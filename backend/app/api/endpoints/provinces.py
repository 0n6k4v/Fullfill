from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.db.session import get_db
from app.schemas.geography import Province
from app.services.province_service import get_provinces, get_province_by_id

router = APIRouter()

@router.get("/", response_model=List[Province])
async def read_provinces(
    db: AsyncSession = Depends(get_db)
):
    """
    ดึงข้อมูลจังหวัดทั้งหมด
    """
    provinces = await get_provinces(db)
    return provinces

@router.get("/{province_id}", response_model=Province)
async def read_province(
    province_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    ดึงข้อมูลจังหวัดตาม ID
    """
    province = await get_province_by_id(db, province_id)
    if province is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Province with ID {province_id} not found"
        )
    return province