import os

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
    DATABASE_URI: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/fullfill")
    
    class Config:
        case_sensitive = True

settings = Settings()

# Add debugging print
print(f"DEBUG: DATABASE_URI = {settings.DATABASE_URI}")