from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.dashboard import DashboardSummary, DashboardCharts, NeededItem
from app.services import dashboard_service

router = APIRouter()

@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(db: Session = Depends(get_db)):
    try:
        summary_data = await dashboard_service.get_dashboard_summary_data(db)
        return summary_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching summary data: {str(e)}")

@router.get("/charts", response_model=DashboardCharts)
async def get_dashboard_charts(db: Session = Depends(get_db)):
    try:
        charts_data = await dashboard_service.get_dashboard_charts_data(db)
        return charts_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chart data: {str(e)}")

@router.get("/needed-items", response_model=List[NeededItem])
async def get_dashboard_needed_items(db: Session = Depends(get_db)):
    try:
        needed_items_data = await dashboard_service.get_dashboard_needed_items_data(db)
        return needed_items_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching needed items data: {str(e)}")