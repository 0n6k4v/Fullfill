from fastapi import APIRouter, Depends, HTTPException, Body, status
from sqlalchemy.orm import Session
from typing import Any, List, Optional
from jose import jwt, JWTError

from app.core.config import settings
from app.core.security import oauth2_scheme
from app.db.session import get_db
from app.schemas.token import TokenPayload
from app.schemas.user import UserResponse
from app.services.user_service import get_user_by_id, get_user_by_email, get_user_by_username
from app.models.item import Item, ItemStatus
from app.services.auth_service import get_current_user
from app.models.user import User
from app.models.item import ItemType, ItemCategory

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def read_users_me(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> Any:
    """
    Get current user profile.
    """
    try:
        # ถอดรหัส token เพื่อรับ user ID
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = TokenPayload(**payload)
        
        # ใช้ service function เพื่อรับข้อมูลผู้ใช้
        user = get_user_by_id(db, token_data.sub)
        
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    
    return user

@router.get("/{user_id}", response_model=UserResponse)
def read_user(
    user_id: int, db: Session = Depends(get_db)
) -> Any:
    """
    Get user by ID.
    """
    # ใช้ service function ที่มีอยู่แล้ว
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    return user

@router.get("/by-username/{username}", response_model=UserResponse)
def read_user_by_username(
    username: str, db: Session = Depends(get_db)
) -> Any:
    """
    Get user by username.
    """
    # ใช้ service function ที่มีอยู่แล้ว
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    return user

@router.get("/by-email/{email}", response_model=UserResponse)
def read_user_by_email(
    email: str, db: Session = Depends(get_db)
) -> Any:
    """
    Get user by email.
    """
    # ใช้ service function ที่มีอยู่แล้ว
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    return user

@router.get("/me/posts")
async def get_user_posts(
    status: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: Optional[str] = "newest",
    page: int = 1,
    page_size: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get posts created by the current user with optional filtering"""
    # แก้ไขบรรทัดนี้
    query = db.query(Item).filter(Item.uploaded_by == current_user.id)
    
    # Apply status filter
    if status and status != "all":
        if status == "active":
            query = query.filter(Item.status == ItemStatus.available)
        elif status == "pending":
            query = query.filter(Item.status == ItemStatus.matched)
        elif status == "completed":
            query = query.filter(Item.status == ItemStatus.fulfilled)
    
    # Apply category filter
    if category:
        query = query.filter(Item.category == category)
    
    # Apply sorting
    if sort_by == "newest":
        query = query.order_by(Item.created_at.desc())
    elif sort_by == "oldest":
        query = query.order_by(Item.created_at.asc())
    elif sort_by == "mostRequested":
        # Assuming there's a way to count requests for each item
        # This might need a different implementation based on your DB schema
        pass
    elif sort_by == "leastRequested":
        # Similar to mostRequested but in reverse order
        pass
    
    # Calculate pagination
    total_count = query.count()
    total_pages = (total_count + page_size - 1) // page_size
    
    # Apply pagination
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    
    # Format items for response
    formatted_items = []
    for item in items:
        formatted_item = {
            "id": item.id,
            "title": item.name,  # ตรวจสอบว่าควรใช้ field ชื่ออะไร
            "description": item.description,
            "category": item.category.value if hasattr(item.category, 'value') else str(item.category),
            "quantity": 1,  # ถ้าไม่มี quantity field ใน model
            "location": item.location,
            "date": item.created_at.strftime("%b %d, %Y"),
            "status": item.status.value.lower() if hasattr(item.status, 'value') else str(item.status).lower(),
            "views": 0,  # ถ้าไม่มี views field ใน model
            "requests": 0,  # ถ้าไม่มี requests field ใน model
            "type": item.type.value if hasattr(item.type, 'value') else str(item.type),
            # แก้ไขบรรทัดนี้ จาก .url เป็น ['url']
            "image": item.image[0]["url"] if item.image and len(item.image) > 0 else "",
        }
        formatted_items.append(formatted_item)
    
    return {
        "items": formatted_items,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total_count": total_count,
            "total_pages": total_pages
        }
    }

@router.get("/me/posts/stats")
async def get_user_posts_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get statistics about the user's posts"""
    # Count total posts
    total_count = db.query(Item).filter(Item.uploaded_by == current_user.id).count()
    
    # Count available posts (previously active)
    available_count = db.query(Item).filter(
        Item.uploaded_by == current_user.id,
        Item.status == ItemStatus.available
    ).count()
    
    # Count matched posts (previously pending)
    matched_count = db.query(Item).filter(
        Item.uploaded_by == current_user.id,
        Item.status == ItemStatus.matched
    ).count()
    
    # Count fulfilled posts (previously completed)
    fulfilled_count = db.query(Item).filter(
        Item.uploaded_by == current_user.id,
        Item.status == ItemStatus.fulfilled
    ).count()
    
    # Count unique recipients (this depends on your schema)
    # This is a placeholder - adjust based on your actual DB schema
    recipients_count = 0
    
    return {
        "stats": {
            "total": total_count,
            "available": available_count,
            "matched": matched_count,
            "fulfilled": fulfilled_count,
            "recipients": recipients_count
        },
        "counts": {
            "all": total_count,
            "available": available_count,
            "matched": matched_count,
            "fulfilled": fulfilled_count
        }
    }

# เพิ่ม endpoint สำหรับเปลี่ยนสถานะโพสต์
@router.patch("/me/posts/{item_id}/status")
async def update_post_status(
    item_id: int,
    status: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update status of a post owned by the current user"""
    # ค้นหาโพสต์ที่ต้องการแก้ไข
    item = db.query(Item).filter(
        Item.id == item_id,
        Item.uploaded_by == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found or you don't have permission to edit it"
        )
    
    # แปลงค่า status จากที่รับมาเป็น enum ใน database
    try:
        if status == "available":
            item.status = ItemStatus.available
        elif status == "matched":
            item.status = ItemStatus.matched
        elif status == "fulfilled":
            item.status = ItemStatus.fulfilled
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {status}. Valid values are: available, matched, fulfilled"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error updating post status: {str(e)}"
        )
    
    # บันทึกการเปลี่ยนแปลง
    db.commit()
    
    return {"success": True, "message": f"Post status updated to {status}"}

# เพิ่ม endpoint สำหรับ analytics data
@router.get("/me/analytics")
async def get_user_analytics(
    period: Optional[str] = "7days",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analytics data for the current user"""
    # Count donations (ตามประเภท Item.type == 'Offer')
    donations_count = db.query(Item).filter(
        Item.uploaded_by == current_user.id,
        Item.type == ItemType.Offer
    ).count()
    
    # Count requests (ตามประเภท Item.type == 'Request')
    requests_count = db.query(Item).filter(
        Item.uploaded_by == current_user.id,
        Item.type == ItemType.Request
    ).count()
    
    # Count pending offers (matched items ที่ user เป็นเจ้าของ)
    pending_offers_count = db.query(Item).filter(
        Item.uploaded_by == current_user.id,
        Item.status == ItemStatus.matched
    ).count()
    
    # Count saved items (ควรมีตาราง saved_items แต่ถ้ายังไม่มีให้ส่งค่าว่าง)
    saved_items_count = 0  # Placeholder
    
    # อื่นๆ สำหรับกราฟและสถิติ
    return {
        "donations_count": donations_count,
        "requests_count": requests_count,
        "pending_offers_count": pending_offers_count,
        "saved_items_count": saved_items_count,
        # ข้อมูลเพิ่มเติมสำหรับกราฟ
        "donation_growth": 10,
        "request_growth": 5,
        "fulfillment_growth": 15,
        "user_growth": 8
    }

# เพิ่ม endpoint สำหรับ categories
@router.get("/me/categories")
async def get_user_categories(
    period: Optional[str] = "7days",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get category breakdown for the current user's items"""
    # สร้างข้อมูลตัวอย่างสำหรับแต่ละหมวดหมู่
    categories = {}
    
    # ดึงข้อมูลหมวดหมู่ทั้งหมดที่มีในระบบ
    for category in ItemCategory:
        category_name = category.value
        
        # นับจำนวนรายการในแต่ละหมวดหมู่
        count = db.query(Item).filter(
            Item.uploaded_by == current_user.id,
            Item.category == category
        ).count()
        
        if count > 0:
            categories[category_name] = {
                "count": count,
                "percentage": 0  # จะคำนวณหลังจากนับทั้งหมดแล้ว
            }
    
    # คำนวณเปอร์เซ็นต์
    total = sum(cat["count"] for cat in categories.values())
    if total > 0:
        for category in categories:
            categories[category]["percentage"] = round(categories[category]["count"] * 100 / total, 1)
    
    return categories

# เพิ่ม endpoint สำหรับ activity
@router.get("/me/activity")
async def get_user_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recent activity for the current user"""
    # ดึงข้อมูลการบริจาคล่าสุด
    recent_donations = db.query(Item).filter(
        Item.uploaded_by == current_user.id,
        Item.type == ItemType.Offer
    ).order_by(Item.created_at.desc()).limit(5).all()
    
    # ดึงข้อมูลการร้องขอล่าสุด
    recent_requests = db.query(Item).filter(
        Item.uploaded_by == current_user.id,
        Item.type == ItemType.Request
    ).order_by(Item.created_at.desc()).limit(5).all()
    
    # แปลงข้อมูลเป็นรูปแบบที่เหมาะสมสำหรับ frontend
    formatted_donations = []
    for item in recent_donations:
        formatted_donations.append({
            "id": item.id,
            "title": item.name,
            "recipient": "Anonymous", # ในตัวอย่างนี้ไม่มีข้อมูลผู้รับจริง
            "status": item.status.value if hasattr(item.status, 'value') else str(item.status),
            "date": item.created_at.strftime("%b %d, %Y")
        })
    
    formatted_requests = []
    for item in recent_requests:
        formatted_requests.append({
            "id": item.id,
            "title": item.name,
            "donor": "Anonymous", # ในตัวอย่างนี้ไม่มีข้อมูลผู้บริจาคจริง
            "status": item.status.value if hasattr(item.status, 'value') else str(item.status),
            "date": item.created_at.strftime("%b %d, %Y")
        })
    
    # สร้าง saved searches (ตัวอย่าง - ในระบบจริงควรดึงจากฐานข้อมูล)
    saved_searches = [
        {"id": 1, "query": "Electronics in Bangkok", "date": "May 15, 2023"},
        {"id": 2, "query": "Books near me", "date": "May 10, 2023"}
    ]
    
    return {
        "recent_donations": formatted_donations,
        "recent_requests": formatted_requests,
        "saved_searches": saved_searches
    }

# เพิ่ม endpoint สำหรับข้อมูลกราฟแสดงกิจกรรม
@router.get("/me/activity/chart")
async def get_user_activity_chart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get chart data for user activity"""
    # ตัวอย่างข้อมูลสำหรับกราฟแสดงกิจกรรมรายเดือน
    return {
        "categories": ["Jan", "Feb", "Mar", "Apr", "May"],
        "donations": [4, 6, 2, 8, 5],
        "requests": [2, 3, 5, 1, 4]
    }

# เพิ่ม endpoint สำหรับดึงข้อมูลการจับคู่
@router.get("/me/matches")
async def get_user_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get matches for the current user"""
    # สร้างข้อมูลตัวอย่าง - ในระบบจริงควรดึงจากฐานข้อมูล
    # ในอนาคตควรมีตาราง matches ที่เก็บข้อมูลการจับคู่ระหว่างผู้บริจาคและผู้รับ
    
    # matches ที่ผู้ใช้เป็นผู้บริจาค (outgoing)
    outgoing_matches = []
    
    # ดึงรายการ items ที่มีสถานะ matched
    matched_items = db.query(Item).filter(
        Item.uploaded_by == current_user.id,
        Item.status == ItemStatus.matched
    ).all()
    
    for item in matched_items:
        # ในระบบจริง ควรดึงข้อมูลของผู้รับจาก matched_userid
        if item.matched_userid:
            # จำลองข้อมูลพื้นฐาน - ในระบบจริงควรดึงจาก User model
            outgoing_matches.append({
                "id": f"out_{item.id}",
                "type": "outgoing",
                "user_name": f"Recipient #{item.matched_userid}",
                "user_avatar": "https://via.placeholder.com/40",
                "item_title": item.name,
                "created_at": item.updated_at.isoformat(),
                "status": "matched"
            })
    
    # matches ที่ผู้ใช้เป็นผู้รับ (incoming) - ในระบบจริงควรดึงจากตาราง matches
    incoming_matches = []
    
    # ดึงรายการ items ที่ user นี้เป็นผู้ได้รับการจับคู่
    received_items = db.query(Item).filter(
        Item.matched_userid == current_user.id,
        Item.status == ItemStatus.matched
    ).all()
    
    for item in received_items:
        incoming_matches.append({
            "id": f"in_{item.id}",
            "type": "incoming",
            "user_name": f"Donor #{item.uploaded_by}",
            "user_avatar": "https://via.placeholder.com/40",
            "item_title": item.name,
            "created_at": item.updated_at.isoformat(),
            "status": "matched"
        })
    
    # รวม matches ทั้งหมดเข้าด้วยกัน
    all_matches = outgoing_matches + incoming_matches
    
    return all_matches