from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional, Dict, Any
import traceback
import json
from geoalchemy2.shape import to_shape
from shapely.geometry import mapping

from app.models.geography import Subdistrict
from app.schemas.geography import Subdistrict as SubdistrictSchema

async def get_subdistricts(db: AsyncSession, district_id: Optional[int] = None) -> List[Dict[str, Any]]:
    """
    ดึงข้อมูลตำบลตามอำเภอ โดยใช้ ORM
    """
    try:
        # สร้าง query พื้นฐาน
        query = select(Subdistrict)
        
        # เพิ่มเงื่อนไขกรองตาม district_id ถ้ามีการระบุ
        if district_id is not None:
            query = query.where(Subdistrict.district_id == district_id)
            
        # เรียงลำดับตามชื่อตำบล
        query = query.order_by(Subdistrict.subdistrict_name)
        
        # ดำเนินการ query - ลบ await ออก
        result = db.execute(query)
        subdistricts = result.scalars().all()
        
        # แปลงผลลัพธ์เป็น Pydantic model และแปลง geometry
        return [
            SubdistrictSchema(
                id=subdistrict.id,
                subdistrict_name=subdistrict.subdistrict_name,
                district_id=subdistrict.district_id,
                perimeter=subdistrict.perimeter,
                area_sqkm=subdistrict.area_sqkm,
                geometry=json.loads(json.dumps(mapping(to_shape(subdistrict.geom)))) if subdistrict.geom else None
            )
            for subdistrict in subdistricts
        ]
    except Exception as e:
        print(f"Error fetching subdistricts: {e}")
        traceback.print_exc()
        return []

async def get_subdistrict_by_id(db: AsyncSession, subdistrict_id: int) -> Optional[Dict[str, Any]]:
    """
    ดึงข้อมูลตำบลตาม ID โดยใช้ ORM
    """
    try:
        query = select(Subdistrict).where(Subdistrict.id == subdistrict_id)
        result = db.execute(query)  # ลบ await ออก
        subdistrict = result.scalars().first()
        
        if not subdistrict:
            return None
            
        # แปลงเป็น Pydantic model และแปลง geometry
        return SubdistrictSchema(
            id=subdistrict.id,
            subdistrict_name=subdistrict.subdistrict_name,
            district_id=subdistrict.district_id,
            perimeter=subdistrict.perimeter,
            area_sqkm=subdistrict.area_sqkm,
            geometry=json.loads(json.dumps(mapping(to_shape(subdistrict.geom)))) if subdistrict.geom else None
        )
    except Exception as e:
        print(f"Error fetching subdistrict by ID: {e}")
        traceback.print_exc()
        return None