"""
API endpoint routers for the Fullfill application.
"""

from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.user import router as user_router
from app.api.endpoints.image import router as image_router
from app.api.endpoints.provinces import router as provinces_router
from app.api.endpoints.districts import router as districts_router
from app.api.endpoints.subdistricts import router as subdistricts_router

__all__ = [
    "auth_router", 
    "user_router", 
    "image_router",
    "provinces_router",
    "districts_router",
    "subdistricts_router"
]