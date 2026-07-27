from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class ItemCategory(str, Enum):
    CONTAS = "contas"
    MERCADO = "mercado"
    TRANSPORTE = "transporte"
    MANUTENÇÕES = "manutenções"
    LAZER = "lazer"
    OUTRO = "outro"

class ItemCreate(BaseModel):
    title: str
    value: float
    category: ItemCategory

class ItemResponse(BaseModel):
    id: int
    title: str
    value: float
    category: ItemCategory
    created_at: datetime
    owner_id: int
    model_config = {"from_attributes": True}

class ItemUpdate(BaseModel):
    title: str | None = None
    value: float | None = None
    category: ItemCategory | None = None