from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Form, status
from typing import List
from sqlalchemy.orm import Session

from app.services.image_service import upload_image, delete_image, upload_multiple_images
from app.schemas.image import ImageResponse, MultipleImagesResponse, DeleteImageRequest, DeleteImageResponse
from app.db.session import get_db
from app.core.security import get_current_user

router = APIRouter()

@router.post("/upload", response_model=ImageResponse, status_code=status.HTTP_201_CREATED)
async def upload_image_endpoint(
    file: UploadFile = File(...),
    folder: str = Form("uploads"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        result = upload_image(file, folder)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/upload-multiple", response_model=MultipleImagesResponse, status_code=status.HTTP_201_CREATED)
async def upload_multiple_images_endpoint(
    files: List[UploadFile] = File(...),
    folder: str = Form("uploads"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        results = upload_multiple_images(files, folder)
        return {"images": results, "count": len(results)}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/delete", response_model=DeleteImageResponse)
async def delete_image_endpoint(
    request: DeleteImageRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        result = delete_image(request.public_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/public-upload", response_model=ImageResponse)
async def public_upload_endpoint(
    file: UploadFile = File(...),
    folder: str = Form("public")
):
    try:
        result = upload_image(file, folder)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))