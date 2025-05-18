from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum

class ItemType(str, Enum):
    request = "Request"
    offer = "Offer"

class ItemCategory(str, Enum):
    furniture = "furniture"
    clothing = "clothing"
    electronics = "electronics"
    appliances = "appliances"
    kids_toys = "kids_toys"
    books = "books"
    kitchen = "kitchen"
    other = "other"

class ItemCondition(str, Enum):
    poor = "Poor"
    fair = "Fair"
    good = "Good"
    like_new = "Like New"
    new = "New"

class ItemStatus(str, Enum):
    available = "available"
    matched = "matched"
    fulfilled = "fulfilled"
    expired = "expired"

# Schema สำหรับข้อมูลรูปภาพ
class ImageData(BaseModel):
    url: str
    public_id: str
    width: Optional[int] = None
    height: Optional[int] = None
    format: Optional[str] = None
    resource_type: Optional[str] = None

# Base schema for shared properties
class ItemBase(BaseModel):
    type: ItemType
    name: str
    category: ItemCategory
    condition: ItemCondition
    description: Optional[str] = None
    location: Optional[str] = None
    image: Optional[List[ImageData]] = None  # เปลี่ยนเป็น List ของ ImageData
    lat: Optional[float] = None
    lon: Optional[float] = None
    subdistrict_id: Optional[int] = None

# For creating a new item
class ItemCreate(ItemBase):
    uploaded_by: int
    expire: Optional[datetime] = None
    # ไม่มี image เพราะจะใช้ endpoints image.py แยกต่างหาก

# For updating an existing item
class ItemUpdate(BaseModel):
    type: Optional[ItemType] = None
    name: Optional[str] = None
    category: Optional[ItemCategory] = None
    condition: Optional[ItemCondition] = None
    description: Optional[str] = None
    location: Optional[str] = None
    image: Optional[List[ImageData]] = None  # เปลี่ยนเป็น List ของ ImageData
    status: Optional[ItemStatus] = None
    expire: Optional[datetime] = None
    matched_userid: Optional[int] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    subdistrict_id: Optional[int] = None

# For returning an item
class Item(ItemBase):
    id: int
    created_at: datetime
    updated_at: datetime
    uploaded_by: int
    status: ItemStatus
    expire: Optional[datetime] = None
    matched_userid: Optional[int] = None

    class Config:
        from_attributes = True