from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Any

class ImageResponse(BaseModel):
    url: HttpUrl
    public_id: str
    width: int
    height: int
    format: str
    resource_type: str

class MultipleImagesResponse(BaseModel):
    images: List[ImageResponse]
    count: int

class DeleteImageRequest(BaseModel):
    public_id: str

class DeleteImageResponse(BaseModel):
    success: bool
    result: Dict[str, Any]