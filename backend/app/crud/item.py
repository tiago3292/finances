from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas.item import ItemCreate, ItemUpdate
from app.models.user import User
from app.models.item import Item

def create_item(item: ItemCreate, owner: User, db: Session):
    new_item = Item(
        title=item.title,
        value=item.value,
        type=item.type.value,
        category=item.category.value,
        owner_id=owner.id
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

def list_items(owner: User, db: Session):
    items = db.query(Item).filter(Item.owner_id == owner.id).all()
    if not items:
        raise HTTPException(status_code=404, detail="Items not found")
    return items

def read_item(item_id: int, owner: User, db: Session):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.owner_id != owner.id:
        raise HTTPException(status_code=403, detail="You do not have the permission to see this item")
    return item

def update_item(item_id: int, updated_item: ItemUpdate, owner: User, db: Session):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.owner_id != owner.id:
        raise HTTPException(status_code=403, detail="You do not have the permission to see this item")
    updated_fields = updated_item.model_dump(exclude_unset=True)
    for key, value in updated_fields.items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item

def delete_item(item_id: int, owner: User, db: Session):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.owner_id != owner.id:
        raise HTTPException(status_code=403, detail="You do not have the permission to see this item")
    db.delete(item)
    db.commit()
    return {"message": "Item deleted successfully"}