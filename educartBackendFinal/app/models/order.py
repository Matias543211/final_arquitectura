# app/models/order.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False) 
    
    order_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(String(50), default="Pending", nullable=False) 
    shipping_address = Column(String(500), nullable=False) 
    total_amount = Column(Float, nullable=False) 
    
    locality: str = Column(String(50), default="")
    
    user = relationship("User", back_populates="orders")

    items = relationship(
        "OrderItem", 
        back_populates="order", 
        cascade="all, delete-orphan"
    )
    