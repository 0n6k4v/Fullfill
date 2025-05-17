from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional, Dict, Any
import traceback
import json
from geoalchemy2.shape import to_shape
from shapely.geometry import mapping

from app.models.geography import Province
from app.schemas.geography import Province as ProvinceSchema

async def get_provinces(db: AsyncSession) -> List[Dict[str, Any]]:
    """
    ดึงข้อมูลจังหวัดทั้งหมดโดยใช้ ORM
    """
    try:
        # ใช้ ORM แทน raw SQL
        query = select(Province).order_by(Province.province_name)
        result = db.execute(query)  # ลบ await ออกตรงนี้
        provinces = result.scalars().all()
        
        # แปลงผลลัพธ์เป็น dict และแปลง geometry ให้ถูกต้อง
        return [
            ProvinceSchema(
                id=province.id,
                province_name=province.province_name,
                reg_nesdb=province.reg_nesdb,
                reg_royin=province.reg_royin,
                perimeter=province.perimeter,
                area_sqkm=province.area_sqkm,
                geometry=json.loads(json.dumps(mapping(to_shape(province.geom)))) if province.geom else None
            )
            for province in provinces
        ]
    except Exception as e:
        print(f"Error fetching provinces: {e}")
        traceback.print_exc()
        return []

async def get_province_by_id(db: AsyncSession, province_id: int) -> Optional[Dict[str, Any]]:
    """
    ดึงข้อมูลจังหวัดตาม ID โดยใช้ ORM
    """
    try:
        # ใช้ ORM แทน raw SQL
        query = select(Province).where(Province.id == province_id)
        result = db.execute(query)  # ลบ await ออกตรงนี้
        province = result.scalars().first()
        
        if not province:
            return None
            
        # แปลงผลลัพธ์เป็น Pydantic model และแปลง geometry ให้ถูกต้อง
        return ProvinceSchema(
            id=province.id,
            province_name=province.province_name,
            reg_nesdb=province.reg_nesdb,
            reg_royin=province.reg_royin,
            perimeter=province.perimeter,
            area_sqkm=province.area_sqkm,
            geometry=json.loads(json.dumps(mapping(to_shape(province.geom)))) if province.geom else None
        )
    except Exception as e:
        print(f"Error fetching province by ID: {e}")
        traceback.print_exc()
        return None