from sqlalchemy.orm import Session, joinedload
from typing import Optional, List

from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.schemas.cart import CartItemCreate

class CartRepository:
    """
    Maneja las operaciones de persistencia para Cart y CartItem.
    """
    def __init__(self, db: Session):
        self.db = db

    def get_cart_by_user_id(self, user_id: int) -> Optional[Cart]:
        """Obtiene el carrito de un usuario, cargando sus items y productos asociados."""
        return self.db.query(Cart).options(
            joinedload(Cart.items).joinedload(CartItem.product)
        ).filter(Cart.user_id == user_id).first()

    def get_or_create_cart(self, user_id: int) -> Cart:
        """Obtiene el carrito o lo crea si no existe para ese usuario."""
        cart = self.get_cart_by_user_id(user_id)
        if cart:
            return cart
        
        new_cart = Cart(user_id=user_id)
        self.db.add(new_cart)
        self.db.commit()
        self.db.refresh(new_cart)
        return new_cart

    def get_item(self, cart_id: int, product_id: int) -> Optional[CartItem]:
        """Obtiene un ítem específico del carrito."""
        return self.db.query(CartItem).filter(
            CartItem.cart_id == cart_id,
            CartItem.product_id == product_id
        ).first()

    def add_item(self, cart_id: int, product_id: int, quantity: int) -> CartItem:
        """Agrega un nuevo ítem al carrito."""
        new_item = CartItem(
            cart_id=cart_id, 
            product_id=product_id, 
            quantity=quantity
        )
        self.db.add(new_item)
        self.db.commit()
        self.db.refresh(new_item)
        return new_item

    def update_item_quantity(self, item: CartItem, quantity: int) -> CartItem:
        """Actualiza la cantidad de un ítem existente."""
        item.quantity = quantity
        self.db.commit()
        self.db.refresh(item)
        return item
    
    def remove_item(self, item: CartItem):
        """Elimina un ítem del carrito."""
        self.db.delete(item)
        self.db.commit()

    def clear_cart(self, cart: Cart):
        """Elimina todos los ítems de un carrito."""
        for item in cart.items:
            self.db.delete(item)
        self.db.commit()
