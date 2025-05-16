from datetime import datetime, timedelta
from typing import Dict, Any

from fastapi import HTTPException, status
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
)
from app.models.user import User
from app.schemas.token import TokenPayload
from app.services.user_service import get_user_by_username, get_user_by_id

def authenticate_user(db: Session, username: str, password: str) -> Dict[str, str]:
    """
    Authenticate a user and return tokens.
    """
    user = get_user_by_username(db, username)

    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(user.id, expires_delta=access_token_expires)

    # Create refresh token
    refresh_token, expires = create_refresh_token(user.id)

    # Store refresh token in the database
    user.refresh_token = refresh_token
    user.refresh_token_expires_at = expires
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }

def refresh_user_token(db: Session, refresh_token: str) -> Dict[str, str]:
    """
    Refresh user tokens.
    """
    try:
        payload = jwt.decode(
            refresh_token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_payload = TokenPayload(**payload)

        # Check if token is a refresh token
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Check if token has expired
        if datetime.fromtimestamp(payload.get("exp")) < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = get_user_by_id(db, token_payload.sub)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.refresh_token or user.refresh_token != refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate new tokens
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(user.id, expires_delta=access_token_expires)

    refresh_token_new, expires = create_refresh_token(user.id)

    # Update refresh token in database
    user.refresh_token = refresh_token_new
    user.refresh_token_expires_at = expires
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token_new,
        "token_type": "bearer",
    }