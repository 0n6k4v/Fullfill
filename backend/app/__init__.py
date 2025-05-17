"""
Fullfill Application Package

A web application backend for user authentication and authorization.
This package contains the main application components, API routes,
database models, and business logic services.
"""

from app.api import api_router
from app.core import settings, cloudinary
from app.db import Base, engine
from app.models import User, Province, District, Subdistrict
from app.services import (
    # User services
    create_new_user,
    get_user_by_username,
    get_user_by_email,
    get_user_by_id,
    
    # Auth services
    authenticate_user,
    refresh_user_token,
    
    # Image services
    upload_image,
    delete_image,
    upload_multiple_images,
    
    # Geography services
    get_provinces,
    get_province_by_id,
    get_districts,
    get_district_by_id,
    get_subdistricts,
    get_subdistrict_by_id,
)

__version__ = "0.1.0"

__all__ = [
    # APIs and configuration
    "api_router",
    "settings",
    "Base",
    "engine",
    "__version__",
    
    # Models
    "User",
    "Province",
    "District",
    "Subdistrict",
    
    # Utility services
    "cloudinary",
    
    # User services
    "create_new_user",
    "get_user_by_username",
    "get_user_by_email",
    "get_user_by_id",
    
    # Auth services
    "authenticate_user",
    "refresh_user_token",
    
    # Image services
    "upload_image",
    "delete_image",
    "upload_multiple_images",
    
    # Geography services
    "get_provinces",
    "get_province_by_id",
    "get_districts",
    "get_district_by_id", 
    "get_subdistricts",
    "get_subdistrict_by_id",
]