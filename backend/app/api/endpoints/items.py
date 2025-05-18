from fastapi import APIRouter, Depends, HTTPException, Query, status, File, UploadFile, Form
from sqlalchemy.orm import Session  # เปลี่ยนเป็นใช้แค่ Sessionอย่างเดียว
from typing import List, Optional
import json

from app.db.session import get_db
from app.schemas.item import Item, ItemCreate, ItemUpdate
from app.services import item_service
from app.services.image_service import upload_multiple_images
from app.core.security import get_current_user
from app.models import Subdistrict

router = APIRouter()

# เปลี่ยนเป็น sync
@router.post("/", response_model=Item, status_code=status.HTTP_201_CREATED)
def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    # current_user = Depends(get_current_user)  # Uncomment เมื่อคุณมีระบบ authentication
):
    """
    สร้างรายการสิ่งของใหม่ (ไม่มีการอัพโหลดรูปภาพ)
    """
    # Temporarily use uploaded_by from the request until auth is implemented
    user_id = item.uploaded_by  # In production, use: current_user.id
    try:
        return item_service.create_item(db, item, user_id=user_id)  # ตัด await
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not create item: {str(e)}"
        )

# ตัวนี้เป็น sync อยู่แล้ว OK
@router.post("/with-images", response_model=Item, status_code=status.HTTP_201_CREATED)
def create_item_with_images(
    item_data: str = Form(...),
    images: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        # แปลง JSON string เป็น dict
        try:
            item_dict = json.loads(item_data)
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid JSON format: {str(e)}"
            )
        
        # ตรวจสอบและแก้ไข subdistrict_id
        if 'subdistrict_id' in item_dict:
            try:
                # ตรวจสอบว่า subdistrict_id มีอยู่จริง
                subdistrict = db.query(Subdistrict).filter(Subdistrict.id == item_dict['subdistrict_id']).first()
                if not subdistrict:
                    print(f"Warning: Subdistrict {item_dict['subdistrict_id']} not found. Setting to null.")
                    item_dict['subdistrict_id'] = None
            except Exception as e:
                print(f"Error checking subdistrict: {e}")
                item_dict['subdistrict_id'] = None

        # สร้าง ItemCreate object
        item_create = ItemCreate(**item_dict)
        
        # อัพโหลดรูปภาพ (ไม่ใช้ await)
        uploaded_images = []
        if images and len(images) > 0:
            folder = f"items/{item_create.category}"
            try:
                result = upload_multiple_images(images, folder)
                if result is not None:
                    uploaded_images = result
            except Exception as e:
                print(f"Error uploading images: {e}")
                
        user_id = item_create.uploaded_by
        
        # สร้าง item (ไม่ใช้ await)
        item = item_service.create_item(db, item_create, images=uploaded_images, user_id=user_id)
        
        return item
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not create item with images: {str(e)}"
        )

# เปลี่ยนเป็น sync
@router.get("/", response_model=List[Item])
def read_items(  # เปลี่ยนจาก async def เป็น def
    skip: int = 0,
    limit: int = 100,
    type: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    user_id: Optional[int] = None,
    subdistrict_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)  # เปลี่ยนเป็น Session
):
    """
    ดึงรายการสิ่งของตามเงื่อนไข
    """
    items = item_service.get_items(  # ตัด await
        db, skip, limit, type, category, status, user_id, subdistrict_id, search
    )
    return items

# เปลี่ยนเป็น sync
@router.get("/nearby", response_model=List[Item])
def read_nearby_items(  # เปลี่ยนจาก async def เป็น def
    lat: float = Query(..., description="Latitude ของผู้ใช้"),
    lon: float = Query(..., description="Longitude ของผู้ใช้"),
    radius: float = Query(5.0, description="รัศมีการค้นหา (กิโลเมตร)"),
    type: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)  # เปลี่ยนเป็น Session
):
    """
    ค้นหาสิ่งของที่อยู่ใกล้เคียงตามพิกัด
    """
    items = item_service.get_nearby_items(  # ตัด await
        db, lat, lon, radius, type, category, status
    )
    return items

# เปลี่ยนเป็น sync
@router.get("/{item_id}", response_model=Item)
def read_item(  # เปลี่ยนจาก async def เป็น def
    item_id: int,
    db: Session = Depends(get_db)  # เปลี่ยนเป็น Session
):
    """
    ดึงข้อมูลสิ่งของตาม ID
    """
    item = item_service.get_item_by_id(db, item_id)  # ตัด await
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with ID {item_id} not found"
        )
    return item

# เปลี่ยนเป็น sync
@router.put("/{item_id}", response_model=Item)
def update_item(  # เปลี่ยนจาก async def เป็น def
    item_id: int,
    item_data: ItemUpdate,
    db: Session = Depends(get_db),  # เปลี่ยนเป็น Session
    # current_user = Depends(get_current_user)  # Uncomment when you have authentication
):
    """
    อัพเดทข้อมูลสิ่งของ
    """
    item = item_service.get_item_by_id(db, item_id)  # ตัด await
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with ID {item_id} not found"
        )
    
    updated_item = item_service.update_item(db, item_id, item_data)  # ตัด await
    return updated_item

# เปลี่ยนเป็น sync
@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(  # เปลี่ยนจาก async def เป็น def
    item_id: int,
    db: Session = Depends(get_db),  # เปลี่ยนเป็น Session
    # current_user = Depends(get_current_user)  # Uncomment when you have authentication
):
    """
    ลบรายการสิ่งของ
    """
    item = item_service.get_item_by_id(db, item_id)  # ตัด await
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with ID {item_id} not found"
        )
    
    success = item_service.delete_item(db, item_id)  # ตัด await
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete item"
        )

# ใน controller/endpoint ที่รับผิดชอบการดึงข้อมูลโพสต์
@router.get("/users/me/posts", response_model=List[Item])
def get_user_posts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: Optional[str] = "newest",
    page: int = 1,
    page_size: int = 10
):
    """
    ดึงรายการสิ่งของที่ผู้ใช้ปัจจุบันเป็นเจ้าของ พร้อมกรองตามเงื่อนไข
    """
    # คำนวณ offset จาก page และ page_size
    offset = (page - 1) * page_size
    
    # สร้าง query
    query = db.query(Item).filter(Item.uploaded_by == current_user.id)
    
    # เพิ่มเงื่อนไขการกรอง
    if status and status != 'all':
        query = query.filter(Item.status == status)
        
    if category and category != 'all':
        query = query.filter(Item.category == category)
    
    # เพิ่มการเรียงลำดับ
    if sort_by == "newest":
        query = query.order_by(Item.created_at.desc())
    elif sort_by == "oldest":
        query = query.order_by(Item.created_at.asc())
    
    # นับจำนวนทั้งหมด
    total_count = query.count()
    total_pages = (total_count + page_size - 1) // page_size
    
    # ดึงข้อมูลตาม offset และ limit
    items = query.offset(offset).limit(page_size).all()
    
    # สร้าง response ที่มีทั้งข้อมูลและข้อมูลการแบ่งหน้า
    return {
        "items": items,
        "pagination": {
            "total": total_count,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size
        }
    }

# เพิ่ม endpoint ใหม่สำหรับดึงสถิติ
@router.get("/users/me/posts/stats")
def get_user_posts_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    ดึงสถิติของโพสต์ของผู้ใช้ปัจจุบัน
    """
    # นับจำนวนรายการทั้งหมด
    total = db.query(Item).filter(Item.uploaded_by == current_user.id).count()
    
    # นับจำนวนตามสถานะ
    available = db.query(Item).filter(
        Item.uploaded_by == current_user.id,
        Item.status == 'available'
    ).count()
    
    matched = db.query(Item).filter(
        Item.uploaded_by == current_user.id,
        Item.status == 'matched'
    ).count()
    
    fulfilled = db.query(Item).filter(
        Item.uploaded_by == current_user.id,
        Item.status == 'fulfilled'
    ).count()
    
    # นับจำนวนผู้รับ (ตัวอย่าง - ปรับตามโมเดลของคุณ)
    recipients = db.query(Item).filter(
        Item.uploaded_by == current_user.id,
        Item.status.in_(['matched', 'fulfilled'])
    ).count()
    
    return {
        "stats": {
            "total": total,
            "available": available,
            "matched": matched,
            "fulfilled": fulfilled,
            "recipients": recipients
        },
        "counts": {
            "all": total,
            "available": available,
            "matched": matched,
            "fulfilled": fulfilled
        }
    }

# Add this endpoint to handle status updates
@router.patch("/users/me/posts/{item_id}/status")
def update_item_status(
    item_id: int,
    status_data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update the status of a specific item owned by the current user
    """
    # Verify the item exists and belongs to the current user
    item = db.query(Item).filter(
        Item.id == item_id,
        Item.uploaded_by == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with ID {item_id} not found or not owned by you"
        )
    
    # Update the status
    try:
        new_status = status_data.get("status")
        if not new_status:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status field is required"
            )
        
        # Validate the status value
        valid_statuses = ["available", "matched", "fulfilled"]
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        # Update the item
        item.status = new_status
        db.commit()
        
        return {"message": "Status updated successfully"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating status: {str(e)}"
        )