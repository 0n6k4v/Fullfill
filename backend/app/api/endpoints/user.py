from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List
from jose import jwt, JWTError

from app.core.config import settings
from app.core.security import oauth2_scheme
from app.db.session import get_db
from app.schemas.token import TokenPayload
from app.schemas.user import UserResponse
from app.services.user_service import get_user_by_id, get_user_by_email, get_user_by_username

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def read_users_me(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> Any:
    """
    Get current user profile.
    """
    try:
        # ถอดรหัส token เพื่อรับ user ID
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = TokenPayload(**payload)
        
        # ใช้ service function เพื่อรับข้อมูลผู้ใช้
        user = get_user_by_id(db, token_data.sub)
        
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    
    return user

@router.get("/{user_id}", response_model=UserResponse)
def read_user(
    user_id: int, db: Session = Depends(get_db)
) -> Any:
    """
    Get user by ID.
    """
    # ใช้ service function ที่มีอยู่แล้ว
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    return user

@router.get("/by-username/{username}", response_model=UserResponse)
def read_user_by_username(
    username: str, db: Session = Depends(get_db)
) -> Any:
    """
    Get user by username.
    """
    # ใช้ service function ที่มีอยู่แล้ว
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    return user

@router.get("/by-email/{email}", response_model=UserResponse)
def read_user_by_email(
    email: str, db: Session = Depends(get_db)
) -> Any:
    """
    Get user by email.
    """
    # ใช้ service function ที่มีอยู่แล้ว
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    return user