from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.db.base import Base

class ItemType(enum.Enum):
    Request = "Request"
    Offer = "Offer"

class ItemCategory(enum.Enum):
    furniture = "furniture"
    clothing = "clothing"
    electronics = "electronics"
    appliances = "appliances"
    kids_toys = "kids_toys"
    books = "books"
    kitchen = "kitchen"
    other = "other"

class ItemCondition(enum.Enum):
    Poor = "Poor"
    Fair = "Fair"
    Good = "Good"
    Like_New = "Like New"
    New = "New"

class ItemStatus(enum.Enum):
    available = "available"
    matched = "matched"
    fulfilled = "fulfilled"
    expired = "expired"

class Item(Base):
    __tablename__ = "item_fulfill"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(ItemType), nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(Enum(ItemCategory), nullable=False)
    condition = Column(Enum(ItemCondition), nullable=False)
    description = Column(String(500))
    location = Column(String(255))
    image = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    uploaded_by = Column(Integer, nullable=False)
    status = Column(Enum(ItemStatus), nullable=False)
    expire = Column(DateTime(timezone=True))
    matched_userid = Column(Integer)
    lon = Column(Float)
    lat = Column(Float)
    subdistrict_id = Column(Integer, ForeignKey("subdistricts.id"))
    
    # Relationships
    subdistrict = relationship("Subdistrict", back_populates="items")