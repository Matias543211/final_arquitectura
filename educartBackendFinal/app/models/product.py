from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False) 
    description = Column(String(500)) 
    price = Column(Float, nullable=False)
    rating = Column(Integer, default=0, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    image_url = Column(String(500))
    
    sku = Column(String(50), nullable=False, unique=True, index=True) 
    stock_current = Column(Integer, default=0, nullable=False) 
    stock_min = Column(Integer, default=10, nullable=False) 
    __table_args__ = (
        CheckConstraint('stock_current >= 0', name='check_stock_non_negative'),
    )
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)  

    category = relationship("Category", back_populates="products")

    @property
    def stock_status(self) -> str:
        """
        Calcula el estado del stock: Normal, Alerta o Agotado.
        """
        if self.stock_current == 0:
            return "Agotado"

        elif self.stock_current <= self.stock_min:
            return "Alerta"

        else:
            return "Normal"