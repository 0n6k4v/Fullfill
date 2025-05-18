"""
Services module for the Fullfill application.

This package contains business logic services that handle operations
between API endpoints and data models.
"""

from app.services.user_service import (
    create_new_user,  # Corrected: was create_user
    get_user_by_username,
    get_user_by_email,
    get_user_by_id
)
from app.services.auth_service import authenticate_user, refresh_user_token
from app.services.image_service import (
    upload_image, # Corrected: was upload_single_image
    delete_image, # Corrected: was delete_single_image
    upload_multiple_images
)
from app.services.province_service import get_provinces, get_province_by_id
from app.services.district_service import get_districts, get_district_by_id
from app.services.subdistrict_service import get_subdistricts, get_subdistrict_by_id
from app.services.item_service import (
    get_items, # Corrected: was get_all_items
    get_item_by_id,
    create_item, # Corrected: was create_new_item
    update_item, # Corrected: was update_existing_item
    delete_item, # Corrected: was delete_item_by_id
    get_nearby_items
)
from app.services.dashboard_service import (
    get_dashboard_summary_data,
    get_dashboard_charts_data,
    get_dashboard_needed_items_data
)

__all__ = [
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
    
    # Item services
    "get_items",
    "get_item_by_id",
    "create_item",
    "update_item",
    "delete_item",
    "get_nearby_items",

    # Dashboard services
    "get_dashboard_summary_data",
    "get_dashboard_charts_data",
    "get_dashboard_needed_items_data",
]