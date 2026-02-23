from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Cart(Base):
    """
    Representa el carrito de compras de un usuario.
    Tiene una relación uno a uno con User y uno a muchos con CartItem.
    """
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    # Relación 1:1 con User. Se asume que el user_id es único.
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # Relaciones ORM
    user = relationship("User", back_populates="cart")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")
