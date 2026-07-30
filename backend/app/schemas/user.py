from pydantic import BaseModel, EmailStr
from decimal import Decimal

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    balance: Decimal
    model_config = {"from_attributes": True}

class UserInDB(BaseModel):
    id: int
    username: str
    email: EmailStr
    hashed_password: str
    balance: Decimal
    model_config = {"from_attributes": True}

class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None