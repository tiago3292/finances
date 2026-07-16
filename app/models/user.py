from sqlalchemy import Column, String, Integer, Boolean
from app.db.base import Base

#metadata = Base.metadata

# Classe de teste
class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    name = Column(String(60), unique=True)
    phone = Column(Integer, nullable=True)
    is_admin = Column(Boolean, default=False)

    def __repr__(self) -> str:
        return f"id: {self.id}, name: {self.name}, is_admin {self.is_admin}"