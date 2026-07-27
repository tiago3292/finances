from typing import TYPE_CHECKING
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User 

class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    value: Mapped[Decimal] = mapped_column(Numeric(precision=10, scale=2))
    category: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),default=lambda: datetime.now(timezone.utc)
        )
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False
    )
    owner: Mapped["User"] = relationship(back_populates="items")