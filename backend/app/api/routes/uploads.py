
from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session
from typing import Annotated

from app.api.deps import get_db
from app.crud import item as crud
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/uploadfile")
async def new_file(
    current_user: Annotated[User, Depends(get_current_user)],
    item_id: int,
    file: UploadFile,
    db: Session = Depends(get_db)
):
    return await crud.upload_file(current_user, item_id, file, db)

@router.delete("/deletefile")
async def delete_file(
    filename: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return await crud.delete_file(filename, current_user, db)