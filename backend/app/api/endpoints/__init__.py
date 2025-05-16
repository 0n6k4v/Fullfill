"""
API endpoint routers for the Fullfill application.
"""

from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.user import router as user_router

__all__ = ["auth_router", "user_router"]