from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas.item import ItemCreate, ItemUpdate
from app.models.user import User
from app.models.item import Item

def create_item(item: ItemCreate, owner_id: int, db: Session):
    owner = db.query(User).filter(User.id == owner_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="User not found")
    new_item = Item(
        title=item.title,
        value=item.value,
        category=item.category.value,
        owner_id=owner_id
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

def update_item(current_item: Item, updated_item: ItemUpdate, db: Session):
    updated_fields = updated_item.model_dump(exclude_unset=True)
    for key, value in updated_fields.items():
        setattr(current_item, key, value)
    db.commit()
    db.refresh(current_item)
    return current_item