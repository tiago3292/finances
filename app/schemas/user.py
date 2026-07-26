from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    model_config = {"from_attributes": True}

class UserInDB(BaseModel):
    id: int
    username: str
    email: EmailStr
    hashed_password: str
    model_config = {"from_attributes": True}

class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None