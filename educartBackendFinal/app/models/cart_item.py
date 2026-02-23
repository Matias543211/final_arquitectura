from sqlalchemy import Column, Integer, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class CartItem(Base):
    """
    Representa un producto dentro de un carrito de compras, incluyendo la cantidad.
    Es la tabla de asociación entre Cart y Product.
    """
    __tablename__ = "cart_items"
    
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    quantity = Column(Integer, nullable=False, default=1)

    __table_args__ = (
        PrimaryKeyConstraint("cart_id", "product_id"),
    )

    # Relaciones ORM
    cart = relationship("Cart", back_populates="items")
    product = relationship("Product") 
