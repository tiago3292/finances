from datetime import datetime, timezone
from decimal import Decimal
from typing import TYPE_CHECKING
from enum import Enum
from sqlalchemy import DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.schemas.item import ItemType

if TYPE_CHECKING:
    from app.models.user import User 


class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[String] = mapped_column(String(200), nullable=False)
    value: Mapped[Decimal] = mapped_column(Numeric(precision=10, scale=2))
    type: Mapped[ItemType] = mapped_column(String(20)) 
    category: Mapped[str]
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    owner: Mapped["User"] = relationship(back_populates="items", passive_deletes=True)

    uploaded_file: Mapped[str | None] = mapped_column(nullable=True)