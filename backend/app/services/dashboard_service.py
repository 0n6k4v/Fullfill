from sqlalchemy.orm import Session
from sqlalchemy import func, case
from datetime import datetime, timedelta
from app.models.item import Item, ItemType, ItemStatus
from app.models.user import User

async def get_dashboard_summary_data(db: Session) -> dict:
    """
    Calculates summary data for the dashboard.
    """
    try:
        # แก้ ItemType.REQUEST เป็น ItemType.NEED (หรือค่าที่ถูกต้องจาก enum)
        total_requests = db.query(func.count(Item.id)).filter(Item.type == ItemType.Request).scalar() or 0
        
        # ใช้ OFFER (ตรวจสอบว่านี่คือค่าที่ถูกต้อง)
        total_donations = db.query(func.count(Item.id)).filter(Item.type == ItemType.Offer).scalar() or 0
        
        # ตรวจสอบให้แน่ใจว่า FULFILLED มีอยู่จริงใน ItemStatus
        fulfilled_requests = db.query(func.count(Item.id)).filter(
            Item.type == ItemType.Request,
            Item.status == ItemStatus.fulfilled
        ).scalar() or 0
        
        active_users = db.query(func.count(User.id)).scalar() or 0
        
        return {
            "totalRequests": total_requests,
            "totalDonations": total_donations,
            "fulfilledRequests": fulfilled_requests,
            "activeUsers": active_users,
            "requestGrowth": 0,
            "donationGrowth": 0,
            "fulfillmentGrowth": 0,
            "userGrowth": 0
        }
    except Exception as e:
        print(f"Error in get_dashboard_summary_data: {e}")
        raise

async def get_dashboard_charts_data(db: Session) -> dict:
    """
    Prepares data for dashboard charts.
    """
    today = datetime.utcnow().date()
    start_date_trends = today - timedelta(days=29)

    # Request Trends
    request_trends_query = db.query(
        func.date(Item.created_at).label("date"),
        func.count(Item.id).label("count")
    ).filter(
        Item.type == ItemType.Request,
        func.date(Item.created_at) >= start_date_trends
    ).group_by(
        func.date(Item.created_at)
    ).order_by(
        func.date(Item.created_at)
    ).all()
    request_trends = [{"date": r.date, "count": r.count} for r in request_trends_query]

    # Donation Trends
    donation_trends_query = db.query(
        func.date(Item.created_at).label("date"),
        func.count(Item.id).label("count")
    ).filter(
        Item.type == ItemType.Offer,
        func.date(Item.created_at) >= start_date_trends
    ).group_by(
        func.date(Item.created_at)
    ).order_by(
        func.date(Item.created_at)
    ).all()
    donation_trends = [{"date": d.date, "count": d.count} for d in donation_trends_query]

    # Category Distribution
    # This assumes Item.category is an Enum or a string field.
    # If you have a separate Category table, you'd join with it.
    category_dist_query = db.query(
        Item.category.label("category_enum"), # Assuming Item.category is an Enum
        func.sum(case((Item.type == ItemType.Request, 1), else_=0)).label("requests"),
        func.sum(case((Item.type == ItemType.Offer, 1), else_=0)).label("donations")
    ).group_by(
        Item.category
    ).all()
    
    category_distribution = [
        {"category": c.category_enum.value if hasattr(c.category_enum, 'value') else str(c.category_enum), "requests": c.requests, "donations": c.donations}
        for c in category_dist_query
    ]
    
    return {
        "requestTrends": request_trends,
        "donationTrends": donation_trends,
        "categoryDistribution": category_distribution
    }

async def get_dashboard_needed_items_data(db: Session) -> list:
    """
    Analyzes items to find the most needed ones by category,
    including the count of fulfilled requests. Returns raw counts.
    """
    requests_subquery = db.query(
        Item.category.label("category_enum"),
        func.count(Item.id).label("total_requests_raw") # Raw count of all requests
    ).filter(
        Item.type == ItemType.Request
    ).group_by(Item.category).subquery()

    donations_subquery = db.query(
        Item.category.label("category_enum"),
        func.count(Item.id).label("available_donations_raw") # Raw count of available offers
    ).filter(
        Item.type == ItemType.Offer,
        Item.status == ItemStatus.available
    ).group_by(Item.category).subquery()

    fulfilled_requests_subquery = db.query(
        Item.category.label("category_enum"),
        func.count(Item.id).label("fulfilled_requests_raw") # Raw count of requests marked as fulfilled
    ).filter(
        Item.type == ItemType.Request,
        Item.status == ItemStatus.fulfilled
    ).group_by(Item.category).subquery()

    # Main query to join all subqueries
    # We need to handle cases where a category might not exist in all subqueries (e.g., no donations for a category with requests)
    # A full outer join on category might be complex with SQLAlchemy's subquery approach.
    # A simpler approach is to query all categories first, then join.
    # For now, we'll stick to outer joining from the requests_subquery, which means categories without any requests won't appear.

    results = db.query(
        requests_subquery.c.category_enum,
        requests_subquery.c.total_requests_raw,
        func.coalesce(donations_subquery.c.available_donations_raw, 0).label("available_donations_raw"),
        func.coalesce(fulfilled_requests_subquery.c.fulfilled_requests_raw, 0).label("fulfilled_requests_raw")
    ).select_from(requests_subquery).outerjoin(
        donations_subquery, requests_subquery.c.category_enum == donations_subquery.c.category_enum
    ).outerjoin(
        fulfilled_requests_subquery, requests_subquery.c.category_enum == fulfilled_requests_subquery.c.category_enum
    ).order_by(
        # Order by potential shortage (total_requests - available_donations)
        (requests_subquery.c.total_requests_raw - func.coalesce(donations_subquery.c.available_donations_raw, 0)).desc(),
        requests_subquery.c.total_requests_raw.desc()
    ).all()

    needed_items_list = []
    for row in results:
        category_name = row.category_enum.value if hasattr(row.category_enum, 'value') else str(row.category_enum)
        
        # Raw counts directly from the query
        total_requests_in_category = row.total_requests_raw
        available_donations_in_category = row.available_donations_raw
        fulfilled_requests_count = row.fulfilled_requests_raw
        
        # Calculate shortage and fulfillment rate based on these raw counts
        # Shortage: How many requests are not yet marked as fulfilled
        shortage = total_requests_in_category - fulfilled_requests_count
        
        fulfillment_rate = 0
        if total_requests_in_category > 0:
            # Fulfillment rate: Percentage of requests marked as fulfilled
            fulfillment_rate = (fulfilled_requests_count / total_requests_in_category) * 100
        else:
            # If no requests, but there are donations, fulfillment rate could be considered 100% or N/A
            # For simplicity, if no requests, rate is 0 unless donations imply fulfillment (which is not the case here)
            pass

        icon_map = {
            "Clothing": "faTshirt",
            "Books": "faBook",
            "Food": "faUtensils",
            "Electronics": "faBolt",
            "Furniture": "faChair",
            "Toys": "faChild",
            "Medical Supplies": "faBriefcaseMedical",
            "Household Items": "faHome",
            "Other": "faBoxOpen"
            # Ensure your Item.category enum values match these keys
        }
        
        needed_items_list.append({
            "categoryName": category_name,
            "icon": icon_map.get(category_name, "faQuestionCircle"),
            "totalRequestsInCategory": total_requests_in_category,         # Raw count
            "availableDonationsInCategory": available_donations_in_category, # Raw count
            "fulfilledRequests": fulfilled_requests_count,                 # Raw count
            "shortage": shortage,                                          # Calculated
            "fulfillmentRate": fulfillment_rate                            # Calculated
        })
        
    return needed_items_list