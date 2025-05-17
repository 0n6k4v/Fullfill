from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.db.session import get_db
from app.schemas.geography import Subdistrict
from app.services.subdistrict_service import get_subdistricts, get_subdistrict_by_id

router = APIRouter()

@router.get("/", response_model=List[Subdistrict])
async def read_subdistricts(
    district_id: Optional[int] = Query(None, description="กรองตาม district_id"),
    db: AsyncSession = Depends(get_db)
):
    """
    ดึงข้อมูลตำบลทั้งหมด หรือกรองตามอำเภอ
    """
    subdistricts = await get_subdistricts(db, district_id)
    return subdistricts

@router.get("/{subdistrict_id}", response_model=Subdistrict)
async def read_subdistrict(
    subdistrict_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    ดึงข้อมูลตำบลตาม ID
    """
    subdistrict = await get_subdistrict_by_id(db, subdistrict_id)
    if subdistrict is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subdistrict with ID {subdistrict_id} not found"
        )
    return subdistrict