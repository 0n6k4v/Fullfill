from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.schemas.token import Token, TokenRefresh
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import authenticate_user, refresh_user_token
from app.services.user_service import create_new_user

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


@router.post("/register", response_model=UserResponse)
def register(*, db: Session = Depends(get_db), user_in: UserCreate) -> Any:
    """
    Register a new user.
    """
    return create_new_user(db, user_in)


@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get access and refresh tokens.
    """
    return authenticate_user(db, form_data.username, form_data.password)


@router.post("/refresh", response_model=Token)
def refresh_token(
    token_data: TokenRefresh, db: Session = Depends(get_db)
) -> Any:
    """
    Get a new access token using the refresh token
    """
    return refresh_user_token(db, token_data.refresh_token)