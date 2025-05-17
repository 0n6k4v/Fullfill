from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional, Dict, Any
import traceback
import json
from geoalchemy2.shape import to_shape
from shapely.geometry import mapping

from app.models.geography import District
from app.schemas.geography import District as DistrictSchema

async def get_districts(db: AsyncSession, province_id: Optional[int] = None) -> List[Dict[str, Any]]:
    """
    ดึงข้อมูลอำเภอตามจังหวัด โดยใช้ ORM
    """
    try:
        # สร้าง query พื้นฐาน
        query = select(District).order_by(District.district_name)
        
        # เพิ่มเงื่อนไขกรองตาม province_id ถ้ามีการระบุ
        if province_id is not None:
            query = query.where(District.province_id == province_id)
            
        # ดำเนินการ query - แก้ไขตรงนี้ ลบ await ออก
        result = db.execute(query)  # ลบ await ออก

        # ไม่ใช้ await กับ result.scalars().all() 
        districts = result.scalars().all()
        
        # แปลงผลลัพธ์เป็น dict และแปลง geometry ให้ถูกต้อง
        return [
            DistrictSchema(
                id=district.id,
                province_id=district.province_id,
                district_name=district.district_name,
                perimeter=district.perimeter,
                area_sqkm=district.area_sqkm,
                geometry=json.loads(json.dumps(mapping(to_shape(district.geom)))) if district.geom else None
            )
            for district in districts
        ]
    except Exception as e:
        print(f"Error fetching districts: {e}")
        traceback.print_exc()
        return []

async def get_district_by_id(db: AsyncSession, district_id: int) -> Optional[Dict[str, Any]]:
    """
    ดึงข้อมูลอำเภอตาม ID โดยใช้ ORM
    """
    try:
        query = select(District).where(District.id == district_id)
        result = await db.execute(query)
        district = result.scalars().first()
        
        if not district:
            return None
            
        return DistrictSchema(
            id=district.id,
            province_id=district.province_id,
            district_name=district.district_name,
            perimeter=district.perimeter,
            area_sqkm=district.area_sqkm,
            geometry=district.geom
        )
    except Exception as e:
        print(f"Error fetching district by ID: {e}")
        return None