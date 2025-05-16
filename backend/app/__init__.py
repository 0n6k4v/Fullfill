"""
Fullfill Application Package

A web application backend for user authentication and authorization.
This package contains the main application components, API routes,
database models, and business logic services.
"""

from app.api import api_router
from app.core import settings
from app.db import Base, engine
from app.models import User
from app.services import (
    create_new_user,
    authenticate_user,
    refresh_user_token,
)

__version__ = "0.1.0"

__all__ = [
    "api_router",
    "settings",
    "Base",
    "engine",
    "User",
    "create_new_user",
    "authenticate_user",
    "refresh_user_token",
    "__version__",
]