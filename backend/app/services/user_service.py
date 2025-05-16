from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate

def get_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> User:
    return db.query(User).filter(User.username == username).first()

def get_user_by_id(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()

def create_new_user(db: Session, user_in: UserCreate) -> User:
    """
    Create a new user in the database.
    """
    # Check if a user with this email exists
    if get_user_by_email(db, user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )

    # Check if a user with this username exists
    if get_user_by_username(db, user_in.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this username already exists",
        )

    # Create new user
    user = User(
        email=user_in.email,
        username=user_in.username,
        password=get_password_hash(user_in.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user