from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Annotated

from app.api.deps import get_db
from app.crud import item as crud
from app.schemas import item as schema
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=schema.ItemResponse)
def create_item(
    item: schema.ItemCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return crud.create_item(item, current_user, db)

@router.get("/", response_model=list[schema.ItemResponse])
async def fetch_items(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return crud.list_items(current_user, db)

@router.get("/{item_id}", response_model=schema.ItemResponse)
def get_item(
    item_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return crud.read_item(item_id, current_user, db)

@router.put("/{item_id}", response_model=schema.ItemResponse)
def put_item(
    item_id: int,
    updated_item: schema.ItemUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return crud.update_item(item_id, updated_item, current_user, db)

@router.delete("/{item_id}")
def del_item(
    item_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return crud.delete_item(item_id, current_user, db)