from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Fullfill API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you should specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/items")
def get_items(
    skip: int = 0,
    limit: int = 20,
    type: str = None,
    category: str = None,
    condition: str = None,
    search: str = None,
    location: str = None,
    status: int = None,
    date_filter: str = None,
):
    mock_items = [
        {
            "id": 1,
            "TYPE": "donation",  # 'donation' or 'request'
            "name": "Winter Jacket (Size L)",
            "category": "clothing",
            "Condition": "good",
            "Description": "Warm winter jacket in excellent condition. Size Large, dark blue color.",
            "Location": "Downtown",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-01T10:30:00Z",
            "updated_at": "2025-05-01T10:30:00Z",
            "uploaded_by": 101,
            "Status": 1,  # 1: available, 2: reserved, 3: completed
            "Expire": "2025-06-01T00:00:00Z",
            "matched_userid": None
        },
        {
            "id": 2,
            "TYPE": "donation",
            "name": "Coffee Table",
            "category": "furniture",
            "Condition": "fair",
            "Description": "Wooden coffee table, minor scratches but sturdy and functional.",
            "Location": "Westside",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-04T14:15:00Z",
            "updated_at": "2025-05-04T14:15:00Z",
            "uploaded_by": 102,
            "Status": 1,
            "Expire": "2025-06-04T00:00:00Z",
            "matched_userid": None
        },
        {
            "id": 3,
            "TYPE": "donation",
            "name": "Laptop (2022 Model)",
            "category": "electronics",
            "Condition": "good",
            "Description": "Laptop in working condition. 8GB RAM, 256GB SSD. No charger included.",
            "Location": "Northside",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-06T09:45:00Z",
            "updated_at": "2025-05-06T09:45:00Z",
            "uploaded_by": 103,
            "Status": 1,
            "Expire": "2025-06-06T00:00:00Z",
            "matched_userid": None
        },
        {
            "id": 4,
            "TYPE": "donation",
            "name": "Children's Books",
            "category": "Books",
            "Condition": "like_new",
            "Description": "Collection of 15 children's books, suitable for ages 3-8.",
            "Location": "Eastside",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-03T16:20:00Z",
            "updated_at": "2025-05-03T16:20:00Z",
            "uploaded_by": 104,
            "Status": 1,
            "Expire": "2025-06-03T00:00:00Z",
            "matched_userid": None
        },
        {
            "id": 5,
            "TYPE": "donation",
            "name": "Board Games",
            "category": "Kids & toys",
            "Condition": "Good",
            "Description": "Set of classic board games including Monopoly and Scrabble.",
            "Location": "Downtown",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-07T11:10:00Z",
            "updated_at": "2025-05-07T11:10:00Z",
            "uploaded_by": 105,
            "Status": 1,
            "Expire": "2025-06-07T00:00:00Z",
            "matched_userid": None
        },
        {
            "id": 6,
            "TYPE": "donation",
            "name": "Microwave Oven",
            "category": "appliances",
            "Condition": "Good",
            "Description": "700W microwave, works perfectly. Clean and in good condition.",
            "Location": "Southside",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-02T13:25:00Z",
            "updated_at": "2025-05-02T13:25:00Z",
            "uploaded_by": 106,
            "Status": 1,
            "Expire": "2025-06-02T00:00:00Z",
            "matched_userid": None
        },
        {
            "id": 7,
            "TYPE": "donation",
            "name": "Kitchen Blender",
            "category": "Kitchen",
            "Condition": "like_new",
            "Description": "Powerful 1000W blender, hardly used. Perfect for smoothies and food preparation.",
            "Location": "Northside",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-10T08:30:00Z",
            "updated_at": "2025-05-10T08:30:00Z",
            "uploaded_by": 107,
            "Status": 1,
            "Expire": "2025-06-10T00:00:00Z",
            "matched_userid": None
        },
        {
            "id": 8,
            "TYPE": "donation",
            "name": "Office Chair",
            "category": "furniture",
            "Condition": "Good",
            "Description": "Ergonomic office chair with adjustable height and lumbar support. Black color.",
            "Location": "Downtown",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-08T15:45:00Z",
            "updated_at": "2025-05-08T15:45:00Z",
            "uploaded_by": 108,
            "Status": 1,
            "Expire": "2025-06-08T00:00:00Z",
            "matched_userid": None
        },
        {
            "id": 9,
            "TYPE": "donation",
            "name": "Baby Stroller",
            "category": "Kids & toys",
            "Condition": "Fair",
            "Description": "Lightweight baby stroller, foldable design. Some wear but still works great.",
            "Location": "Eastside",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-05T11:20:00Z",
            "updated_at": "2025-05-05T11:20:00Z",
            "uploaded_by": 109,
            "Status": 2,  # Reserved
            "Expire": "2025-06-05T00:00:00Z",
            "matched_userid": 201
        },
        {
            "id": 10,
            "TYPE": "donation",
            "name": "Acoustic Guitar",
            "category": "Other",
            "Condition": "Good",
            "Description": "Yamaha acoustic guitar with case. Great for beginners. Needs new strings.",
            "Location": "Westside",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-09T16:15:00Z",
            "updated_at": "2025-05-09T16:15:00Z",
            "uploaded_by": 110,
            "Status": 1,
            "Expire": "2025-06-09T00:00:00Z",
            "matched_userid": None
        },
        {
            "id": 11,
            "TYPE": "request",
            "name": "Child's Bicycle",
            "category": "Kids & toys",
            "Condition": "Good",
            "Description": "Looking for a bicycle suitable for a 6-year-old. Preferably with training wheels.",
            "Location": "Northside",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-12T09:30:00Z",
            "updated_at": "2025-05-12T09:30:00Z",
            "uploaded_by": 111,
            "Status": 1,
            "Expire": "2025-06-12T00:00:00Z",
            "matched_userid": None
        },
        {
            "id": 12,
            "TYPE": "request",
            "name": "Winter Boots (Size 8)",
            "category": "clothing",
            "Condition": "Fair",
            "Description": "Need warm winter boots for the upcoming season. Women's size 8.",
            "Location": "Downtown",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-11T14:00:00Z",
            "updated_at": "2025-05-11T14:00:00Z",
            "uploaded_by": 112,
            "Status": 1,
            "Expire": "2025-06-11T00:00:00Z",
            "matched_userid": None
        },
        {
            "id": 13,
            "TYPE": "request",
            "name": "School Textbooks",
            "category": "Books",
            "Condition": "any",
            "Description": "Looking for high school math and science textbooks for the new school year.",
            "Location": "Southside",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-13T10:45:00Z",
            "updated_at": "2025-05-13T10:45:00Z",
            "uploaded_by": 113,
            "Status": 1,
            "Expire": "2025-06-13T00:00:00Z",
            "matched_userid": None
        },
        {
            "id": 14,
            "TYPE": "request",
            "name": "Desk Lamp",
            "category": "Other",
            "Condition": "any",
            "Description": "Need a desk lamp for studying. Preferably LED with adjustable brightness.",
            "Location": "Eastside",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-14T08:15:00Z",
            "updated_at": "2025-05-14T08:15:00Z",
            "uploaded_by": 114,
            "Status": 2,  # Reserved
            "Expire": "2025-06-14T00:00:00Z",
            "matched_userid": 202
        },
        {
            "id": 15,
            "TYPE": "donation",
            "name": "Dining Table with 4 Chairs",
            "category": "furniture",
            "Condition": "Good",
            "Description": "Wooden dining set. Table dimensions: 120x80cm. Chairs are sturdy and comfortable.",
            "Location": "Westside",
            "image": {"url": "/api/placeholder/300/200"},
            "created_at": "2025-05-12T15:30:00Z",
            "updated_at": "2025-05-12T16:45:00Z",
            "uploaded_by": 115,
            "Status": 3,  # Completed
            "Expire": "2025-06-12T00:00:00Z",
            "matched_userid": 203
        },
        {
        "id": 16,
        "TYPE": "donation",
        "name": "Rice Cooker",
        "category": "Kitchen",
        "Condition": "like_new",
        "Description": "5-cup automatic rice cooker with steamer basket. Used only a few times.",
        "Location": "Downtown",
        "image": {"url": "/api/placeholder/300/200"},
        "created_at": "2025-05-13T13:10:00Z",
        "updated_at": "2025-05-13T13:10:00Z",
        "uploaded_by": 116,
        "Status": 1,
        "Expire": "2025-06-13T00:00:00Z",
        "matched_userid": None
        },
        {
        "id": 17,
        "TYPE": "request",
        "name": "Laptop Charger",
        "category": "electronics",
        "Condition": "Any",
        "Description": "Need a charger for HP laptop model 15-dy1024wm. 65W adapter with USB-C connector.",
        "Location": "Northside",
        "image": {"url": "/api/placeholder/300/200"},
        "created_at": "2025-05-15T09:25:00Z",
        "updated_at": "2025-05-15T09:25:00Z",
        "uploaded_by": 117,
        "Status": 1,
        "Expire": "2025-06-15T00:00:00Z",
        "matched_userid": None
        },
        {
        "id": 18,
        "TYPE": "request",
        "name": "Small Microwave",
        "category": "appliances",
        "Condition": "Fair",
        "Description": "Looking for a small microwave for a studio apartment. Any brand is fine.",
        "Location": "Downtown",
        "image": {"url": "/api/placeholder/300/200"},
        "created_at": "2025-05-16T11:40:00Z",
        "updated_at": "2025-05-16T11:40:00Z",
        "uploaded_by": 118,
        "Status": 3, # Completed
        "Expire": "2025-06-16T00:00:00Z",
        "matched_userid": 204
        },
        {
        "id": 19,
        "TYPE": "donation",
        "name": "Men's Suits (Size 42)",
        "category": "clothing",
        "Condition": "Good",
        "Description": "Two men's suits, navy and charcoal, size 42 regular. Dry cleaned and ready to wear.",
        "Location": "Eastside",
        "image": {"url": "/api/placeholder/300/200"},
        "created_at": "2025-05-17T14:20:00Z",
        "updated_at": "2025-05-17T14:20:00Z",
        "uploaded_by": 119,
        "Status": 2, # Reserved
        "Expire": "2025-06-17T00:00:00Z",
        "matched_userid": 205
        },
        {
        "id": 20,
        "TYPE": "donation",
        "name": "Gaming Console",
        "category": "electronics",
        "Condition": "Good",
        "Description": "PlayStation 4 with one controller and 5 games. Works perfectly, just upgraded to newer model.",
        "Location": "Westside",
        "image": {"url": "/api/placeholder/300/200"},
        "created_at": "2025-05-18T16:10:00Z",
        "updated_at": "2025-05-18T16:10:00Z",
        "uploaded_by": 120,
        "Status": 3, # Completed
        "Expire": "2025-06-18T00:00:00Z",
        "matched_userid": 206
        },
        {
        "id": 21,
        "TYPE": "request",
        "name": "Bedside Table",
        "category": "furniture",
        "Condition": "Any",
        "Description": "Looking for a small bedside table or nightstand for a new apartment.",
        "Location": "Southside",
        "image": {"url": "/api/placeholder/300/200"},
        "created_at": "2025-05-19T10:15:00Z",
        "updated_at": "2025-05-19T10:15:00Z",
        "uploaded_by": 121,
        "Status": 2, # Reserved
        "Expire": "2025-06-19T00:00:00Z",
        "matched_userid": 207
        },
        {
        "id": 22,
        "TYPE": "donation",
        "name": "Knife Set",
        "category": "Kitchen",
        "Condition": "like_new",
        "Description": "15-piece kitchen knife set with block. High-quality stainless steel, barely used.",
        "Location": "Downtown",
        "image": {"url": "/api/placeholder/300/200"},
        "created_at": "2025-05-20T13:30:00Z",
        "updated_at": "2025-05-20T13:30:00Z",
        "uploaded_by": 122,
        "Status": 1,
        "Expire": "2025-06-20T00:00:00Z",
        "matched_userid": None
        },
        {
        "id": 23,
        "TYPE": "request",
        "name": "Baby Clothes",
        "category": "Kids & toys",
        "Condition": "Good",
        "Description": "Looking for baby clothes for 6-12 month old. Any gender neutral colors preferred.",
        "Location": "Northside",
        "image": {"url": "/api/placeholder/300/200"},
        "created_at": "2025-05-21T09:45:00Z",
        "updated_at": "2025-05-21T09:45:00Z",
        "uploaded_by": 123,
        "Status": 1,
        "Expire": "2025-06-21T00:00:00Z",
        "matched_userid": None
        },
        {
        "id": 24,
        "TYPE": "donation",
        "name": "Fiction Book Collection",
        "category": "Books",
        "Condition": "Good",
        "Description": "Collection of 20+ fiction books including mysteries, thrillers, and classics.",
        "Location": "Eastside",
        "image": {"url": "/api/placeholder/300/200"},
        "created_at": "2025-05-22T11:20:00Z",
        "updated_at": "2025-05-22T11:20:00Z",
        "uploaded_by": 124,
        "Status": 1,
        "Expire": "2025-06-22T00:00:00Z",
        "matched_userid": None
        },
        {
        "id": 25,
        "TYPE": "request",
        "name": "Toaster Oven",
        "category": "appliances",
        "Condition": "Fair",
        "Description": "Looking for a small toaster oven for a dorm room. Doesn't need to be fancy.",
        "Location": "Westside",
        "image": {"url": "/api/placeholder/300/200"},
        "created_at": "2025-05-23T14:50:00Z",
        "updated_at": "2025-05-23T14:50:00Z",
        "uploaded_by": 125,
        "Status": 1,
        "Expire": "2025-06-23T00:00:00Z",
        "matched_userid": None
        },
        {
        "id": 26,
        "TYPE": "donation",
        "name": "Yoga Mat and Blocks",
        "category": "Other",
        "Condition": "Good",
        "Description": "Yoga mat with two foam blocks and a strap. Lightly used, clean and ready to use.",
        "Location": "Downtown",
        "image": {"url": "/api/placeholder/300/200"},
        "created_at": "2025-05-24T08:30:00Z",
        "updated_at": "2025-05-24T08:30:00Z",
        "uploaded_by": 126,
        "Status": 1,
        "Expire": None,
        "matched_userid": None
        }
    ]

    # Return mock response with pagination structure
    return {
        "items": mock_items,
        "total": len(mock_items),
        "page": skip // limit + 1,
        "page_size": limit
    }

@app.get("/api/items/{item_id}")
def get_item_by_id(item_id: int):
    # Get the mock items data
    mock_items = get_items(skip=0, limit=100)["items"]

    # Find the item with the matching ID
    item = next((item for item in mock_items if item["id"] == item_id), None)

    # If the item is found, return it with additional user info
    if item:
        return item

    # If the item is not found, return None or raise an exception
    return None

@app.get("/api/items/{item_id}/similar")
def get_similar_items(item_id: int, category: str = None, limit: int = 3):
    # Get all mock items
    mock_items = get_items(skip=0, limit=100)["items"]

    # Get the current item to find its category if not provided
    if not category:
        current_item = next((item for item in mock_items if item["id"] == item_id), None)
        if current_item:
            category = current_item.get("category")

    # Find similar items based on category
    similar_items = []
    if category:
        similar_items = [
            item for item in mock_items
            if item["category"] == category and item["id"] != item_id
        ]

    # If not enough similar items by category, add some other items
    if len(similar_items) < limit:
        other_items = [
            item for item in mock_items
            if item["id"] != item_id and item not in similar_items
        ]
        similar_items.extend(other_items[:limit - len(similar_items)])

    return similar_items[:limit]
