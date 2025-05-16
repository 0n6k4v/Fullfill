import cloudinary
import cloudinary.uploader
from typing import List, Dict, Any
import uuid
from fastapi import UploadFile

def upload_image(file: UploadFile, folder: str = "uploads") -> Dict[str, Any]:
    try:
        # สร้าง public_id ที่ไม่ซ้ำกันโดยใช้ uuid
        public_id = f"{uuid.uuid4()}"
        
        # อัพโหลดไฟล์ไปยัง Cloudinary
        upload_result = cloudinary.uploader.upload(
            file.file,
            public_id=public_id,
            folder=folder,
            resource_type="auto"
        )
        
        return {
            "url": upload_result["secure_url"],
            "public_id": upload_result["public_id"],
            "width": upload_result["width"],
            "height": upload_result["height"],
            "format": upload_result["format"],
            "resource_type": upload_result["resource_type"]
        }
    except Exception as e:
        raise Exception(f"การอัพโหลดรูปภาพล้มเหลว: {str(e)}")

def delete_image(public_id: str) -> Dict[str, Any]:
    try:
        result = cloudinary.uploader.destroy(public_id)
        return {"success": result["result"] == "ok", "result": result}
    except Exception as e:
        raise Exception(f"การลบรูปภาพล้มเหลว: {str(e)}")

def upload_multiple_images(files: List[UploadFile], folder: str = "uploads") -> List[Dict[str, Any]]:
    results = []
    for file in files:
        result = upload_image(file, folder)
        results.append(result)
    return results