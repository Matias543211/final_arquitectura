
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base # Asumo que Base viene de aquí
from datetime import datetime

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True) 
    
    order_id = Column(Integer, ForeignKey("orders.id"), index=True) 
    
    product_id = Column(Integer, ForeignKey("products.id"), index=True, nullable=False)
    
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")