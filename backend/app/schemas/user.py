from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    username: str

# Properties for user creation
class UserCreate(UserBase):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
    contact_info: Optional[Dict[str, Any]] = None

# Properties for user login
class UserLogin(BaseModel):
    username: str
    password: str

# Properties to return to client
class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True