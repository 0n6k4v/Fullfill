"""
Schema definitions for the Fullfill application.

These Pydantic models define the structure of request and response data.
"""

# User schemas
from app.schemas.user import (
    UserBase,
    UserCreate,
    UserLogin,
    UserResponse
)

# Token schemas
from app.schemas.token import (
    Token,
    TokenRefresh,
    TokenPayload
)

# Image schemas
from app.schemas.image import (
    ImageResponse,
    MultipleImagesResponse,
    DeleteImageRequest,
    DeleteImageResponse
)

# Geography schemas
from app.schemas.geography import (
    GeometryModel,
    ProvinceBase,
    Province,
    DistrictBase,
    District,
    SubdistrictBase,
    Subdistrict
)

__all__ = [
    # User schemas
    "UserBase",
    "UserCreate",
    "UserLogin", 
    "UserResponse",
    
    # Token schemas
    "Token",
    "TokenRefresh",
    "TokenPayload",
    
    # Image schemas
    "ImageResponse",
    "MultipleImagesResponse",
    "DeleteImageRequest",
    "DeleteImageResponse",
    
    # Geography schemas
    "GeometryModel",
    "ProvinceBase",
    "Province",
    "DistrictBase",
    "District",
    "SubdistrictBase",
    "Subdistrict"
]