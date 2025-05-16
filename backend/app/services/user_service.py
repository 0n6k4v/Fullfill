from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate

def get_user_by_id(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> User:
    return db.query(User).filter(User.username == username).first()

def create_new_user(db: Session, user_in: UserCreate):
    # Check if user with this email or username already exists
    if get_user_by_email(db, user_in.email):
        raise ValueError("Email already registered")
    
    if get_user_by_username(db, user_in.username):
        raise ValueError("Username already taken")
    
    # Create new user with contact_info from request
    user = User(
        email=user_in.email,
        username=user_in.username,
        password=get_password_hash(user_in.password),
        contact_info=user_in.contact_info if hasattr(user_in, 'contact_info') else None
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user