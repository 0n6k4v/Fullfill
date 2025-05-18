from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, text
from typing import List, Optional, Dict, Any
import traceback
from datetime import datetime, timezone

from app.models.item import Item, ItemStatus
from app.schemas.item import ItemCreate, ItemUpdate

def create_item(db: Session, item_data: ItemCreate, images: List[Dict] = None, user_id: int = None) -> Item:
    """
    สร้างรายการสิ่งของใหม่
    """
    try:
        print(f"Creating item: {item_data}")  # Debug
        
        # แปลง ItemCreate เป็น dict
        item_dict = item_data.dict()
        
        # ถ้ามีการส่งข้อมูลรูปภาพมา ให้เพิ่มลงใน item_dict
        if images is not None:
            item_dict["image"] = images
        else:
            item_dict["image"] = []
            
        # ถ้ามีการระบุ user_id
        if user_id is not None:
            item_dict["uploaded_by"] = user_id
        
        # ตรวจสอบว่า subdistrict_id ถูกส่งมาหรือไม่
        if item_dict.get('subdistrict_id') is None:
            # ถ้าไม่มี ให้นำออกจาก dict เพื่อป้องกันการส่งค่า NULL
            item_dict.pop('subdistrict_id', None)
        
        # สร้าง Item object
        item = Item(**item_dict)
        item.status = "available"
        
        # บันทึกลงฐานข้อมูล
        db.add(item)
        db.commit()
        db.refresh(item)
        return item
    except Exception as e:
        db.rollback()
        print(f"Error creating item: {e}")
        import traceback
        traceback.print_exc()
        raise

# เปลี่ยนจาก async เป็น sync
def get_items(
    db: Session,  # เปลี่ยนเป็น Session
    skip: int = 0,
    limit: int = 100,
    type: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    user_id: Optional[int] = None,
    subdistrict_id: Optional[int] = None,
    search: Optional[str] = None
) -> List[Item]:
    """
    ดึงรายการสิ่งของทั้งหมด
    """
    query = db.query(Item)
    
    # เพิ่ม filters
    if type:
        query = query.filter(Item.type == type)
    if category:
        query = query.filter(Item.category == category)
    if status:
        query = query.filter(Item.status == status)
    if user_id:
        query = query.filter(Item.uploaded_by == user_id)
    if subdistrict_id:
        query = query.filter(Item.subdistrict_id == subdistrict_id)
    if search:
        query = query.filter(
            or_(
                Item.name.ilike(f"%{search}%"),
                Item.description.ilike(f"%{search}%"),
                Item.location.ilike(f"%{search}%")
            )
        )
    
    # ใช้แทน await db.execute()
    items = query.offset(skip).limit(limit).all()
    return items

# เปลี่ยนจาก async เป็น sync
def get_item_by_id(db: Session, item_id: int) -> Optional[Item]:
    """
    ดึงข้อมูลสิ่งของตาม ID
    """
    # ใช้แทน await db.execute()
    item = db.query(Item).filter(Item.id == item_id).first()
    return item

# เปลี่ยนจาก async เป็น sync
def update_item(db: Session, item_id: int, item_data: ItemUpdate) -> Item:
    """
    อัพเดทข้อมูลสิ่งของ
    """
    # ดึงข้อมูล item เดิม
    item = db.query(Item).filter(Item.id == item_id).first()
    
    # อัพเดทข้อมูล
    item_data_dict = item_data.dict(exclude_unset=True)
    for key, value in item_data_dict.items():
        setattr(item, key, value)
    
    # บันทึกลงฐานข้อมูล
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

# เปลี่ยนจาก async เป็น sync
def delete_item(db: Session, item_id: int) -> bool:
    """
    ลบรายการสิ่งของ
    """
    item = db.query(Item).filter(Item.id == item_id).first()
    if item:
        db.delete(item)
        db.commit()
        return True
    return False

# เปลี่ยนจาก async เป็น sync
def get_nearby_items(
    db: Session,
    lat: float,
    lon: float,
    radius: float = 5.0,
    type: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None
) -> List[Item]:
    """
    ค้นหาสิ่งของที่อยู่ใกล้เคียงตามพิกัด
    """
    # SQL query ที่ใช้ PostGIS ในการคำนวณระยะทาง
    query = f"""
    SELECT 
        i.*,
        ST_Distance(
            ST_SetSRID(ST_MakePoint(i.lon, i.lat), 4326)::geography,
            ST_SetSRID(ST_MakePoint({lon}, {lat}), 4326)::geography
        )/1000 as distance_km
    FROM 
        item_fulfill i
    WHERE 
        ST_DWithin(
            ST_SetSRID(ST_MakePoint(i.lon, i.lat), 4326)::geography,
            ST_SetSRID(ST_MakePoint({lon}, {lat}), 4326)::geography,
            {radius * 1000}
        )
    """
    
    # เพิ่ม filters
    filters = []
    if type:
        filters.append(f"i.type = '{type}'")
    if category:
        filters.append(f"i.category = '{category}'")
    if status:
        filters.append(f"i.status = '{status}'")
    
    if filters:
        query += " AND " + " AND ".join(filters)
    
    query += " ORDER BY distance_km"
    
    # ใช้แทน await db.execute()
    result = db.execute(text(query))
    items = []
    for row in result:
        item_dict = {c.name: getattr(row, c.name) for c in row._mapping}
        items.append(Item(**item_dict))
    
    return items