from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import settings

# ใช้ engine แบบ sync
engine = create_engine(settings.DATABASE_URI, echo=False)

# สร้าง session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False, 
    bind=engine
)

# ฟังก์ชันสำหรับเรียกใช้งาน dependency injection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()