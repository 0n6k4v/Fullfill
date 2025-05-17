from fastapi import APIRouter

from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.user import router as user_router
from app.api.endpoints.image import router as image_router
from app.api.endpoints.provinces import router as provinces_router
from app.api.endpoints.districts import router as districts_router
from app.api.endpoints.subdistricts import router as subdistricts_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(user_router, prefix="/users", tags=["users"])
api_router.include_router(image_router, prefix="/images", tags=["images"])
api_router.include_router(provinces_router, prefix="/provinces", tags=["geography"])
api_router.include_router(districts_router, prefix="/districts", tags=["geography"])
api_router.include_router(subdistricts_router, prefix="/subdistricts", tags=["geography"])