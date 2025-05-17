from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.db.session import get_db
from app.schemas.geography import District
from app.services.district_service import get_districts, get_district_by_id

router = APIRouter()

@router.get("/")  # เอา response_model ออกชั่วคราว
async def read_districts(
    province_id: Optional[int] = Query(None, description="กรองตาม province_id"),
    db: AsyncSession = Depends(get_db)
):
    """
    ดึงข้อมูลอำเภอทั้งหมด หรือกรองตามจังหวัด
    """
    districts = await get_districts(db, province_id)
    return districts

@router.get("/{district_id}", response_model=District)
async def read_district(
    district_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    ดึงข้อมูลอำเภอตาม ID
    """
    district = await get_district_by_id(db, district_id)
    if district is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"District with ID {district_id} not found"
        )
    return district