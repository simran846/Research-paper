import os
import uuid
import aiofiles
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any

router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".nii", ".gz", ".dcm"}
MAX_FILE_SIZE = 150 * 1024 * 1024 # 150 MB limit

@router.post("/mri")
async def upload_mri(file: UploadFile = File(...)) -> Dict[str, Any]:
    filename = file.filename or ""
    ext = os.path.splitext(filename)[1].lower()
    if filename.endswith(".nii.gz"):
        ext = ".nii.gz"
        
    if not any(filename.lower().endswith(allowed) for allowed in ALLOWED_EXTENSIONS):
        raise HTTPException(status_code=400, detail=f"Unsupported imaging file format. Allowed: PNG, JPG, NIfTI (.nii, .nii.gz)")

    file_id = f"mri_{uuid.uuid4().hex[:12]}{ext}"
    dest_path = os.path.join(UPLOAD_DIR, file_id)

    size = 0
    async with aiofiles.open(dest_path, "wb") as out_file:
        while content := await file.read(1024 * 1024):
            size += len(content)
            if size > MAX_FILE_SIZE:
                raise HTTPException(status_code=400, detail="File size exceeds maximum allowable limit (150 MB)")
            await out_file.write(content)

    return {
        "status": "success",
        "file_id": file_id,
        "modality": "MRI",
        "original_name": filename,
        "size_bytes": size,
        "message": "MRI uploaded successfully. Ready for 3D CNN spatial feature extraction."
    }

@router.post("/pet")
async def upload_pet(file: UploadFile = File(...)) -> Dict[str, Any]:
    filename = file.filename or ""
    ext = os.path.splitext(filename)[1].lower()
    if filename.endswith(".nii.gz"):
        ext = ".nii.gz"

    if not any(filename.lower().endswith(allowed) for allowed in ALLOWED_EXTENSIONS):
        raise HTTPException(status_code=400, detail=f"Unsupported imaging file format. Allowed: PNG, JPG, NIfTI (.nii, .nii.gz)")

    file_id = f"pet_{uuid.uuid4().hex[:12]}{ext}"
    dest_path = os.path.join(UPLOAD_DIR, file_id)

    size = 0
    async with aiofiles.open(dest_path, "wb") as out_file:
        while content := await file.read(1024 * 1024):
            size += len(content)
            if size > MAX_FILE_SIZE:
                raise HTTPException(status_code=400, detail="File size exceeds maximum allowable limit (150 MB)")
            await out_file.write(content)

    return {
        "status": "success",
        "file_id": file_id,
        "modality": "PET",
        "original_name": filename,
        "size_bytes": size,
        "message": "PET uploaded successfully. Ready for metabolic feature extraction."
    }
