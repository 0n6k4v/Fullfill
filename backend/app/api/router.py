from fastapi import APIRouter

from app.api.endpoints import (
    auth, 
    user, 
    items, 
    image,
    provinces, 
    districts, 
    subdistricts,
    dashboard
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(user.router, prefix="/users", tags=["Users"])
api_router.include_router(items.router, prefix="/items", tags=["Items"])
api_router.include_router(image.router, prefix="/images", tags=["Images"])
api_router.include_router(provinces.router, prefix="/provinces", tags=["Provinces"])
api_router.include_router(districts.router, prefix="/districts", tags=["Districts"])
api_router.include_router(subdistricts.router, prefix="/subdistricts", tags=["Subdistricts"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"]) # Add this line