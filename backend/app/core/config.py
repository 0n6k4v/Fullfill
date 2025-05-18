import os
import cloudinary

from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Fullfill Authentication API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database connection
    DATABASE_URI: str = os.getenv("DATABASE_URI", "postgresql://postgres:postgres@db:5432/fullfill")
    # Cloudinary settings
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET")
    
    class Config:
        case_sensitive = True

settings = Settings()

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)