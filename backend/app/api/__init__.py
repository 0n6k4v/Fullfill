"""
API module for the Fullfill application.
"""

# ลดการ import ลงเพื่อป้องกัน circular imports
from app.api.router import api_router

__all__ = ["api_router"]