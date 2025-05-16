from typing import Optional
from pydantic import BaseModel, EmailStr, Field, validator

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None

# Properties for user creation
class UserCreate(UserBase):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)

# Properties for user login
class UserLogin(BaseModel):
    username: str
    password: str

# Properties to return to client
class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True