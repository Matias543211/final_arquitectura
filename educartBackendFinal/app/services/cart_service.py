from sqlalchemy.orm import Session
from app.repositories.cart_repository import CartRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.cart import CartItemCreate, CartItemUpdate
from app.models.cart import Cart

class CartService:
    def __init__(self, db: Session):
        self.db = db
        self.cart_repo = CartRepository(db)
        self.product_repo = ProductRepository(db)

    def get_cart_for_user(self, user_id: int) -> Cart:
        """Obtiene el carrito activo o crea uno si no existe."""
        return self.cart_repo.get_or_create_cart(user_id)

    def add_or_update_item(self, user_id: int, item_data: CartItemCreate) -> Cart:
        """
        Agrega item validando stock.
        """

        cart = self.cart_repo.get_or_create_cart(user_id)
        
        product = self.product_repo.get_by_id(item_data.product_id)
        if not product:
            raise ValueError("Product not found")

        existing_item = self.cart_repo.get_item(cart.id, product.id)
        current_qty_in_cart = existing_item.quantity if existing_item else 0
        final_quantity = current_qty_in_cart + item_data.quantity

        if final_quantity > product.stock_current:
            raise ValueError(f"Stock insuficiente. Disponible: {product.stock_current}, En carrito: {current_qty_in_cart}, Intentas agregar: {item_data.quantity}")

        if existing_item:
            self.cart_repo.update_item_quantity(existing_item, final_quantity)
        else:
            self.cart_repo.add_item(cart.id, product.id, item_data.quantity)
            
        return self.cart_repo.get_cart_by_user_id(user_id)

    def update_item_quantity_explicit(self, user_id: int, item_data: CartItemUpdate) -> Cart:
        """Define una cantidad exacta (ej: cambiar de 1 a 5 en el input)."""
        cart = self.cart_repo.get_or_create_cart(user_id)
        existing_item = self.cart_repo.get_item(cart.id, item_data.product_id)

        if not existing_item:
            return None 


        product = self.product_repo.get_by_id(item_data.product_id)
        if item_data.quantity > product.stock_current:
             raise ValueError(f"Stock insuficiente. Solo hay {product.stock_current} unidades.")

        if item_data.quantity <= 0:
            self.cart_repo.remove_item(existing_item)
        else:
            self.cart_repo.update_item_quantity(existing_item, item_data.quantity)

        return self.cart_repo.get_cart_by_user_id(user_id)

    def remove_item_from_cart(self, user_id: int, product_id: int) -> bool:
        cart = self.cart_repo.get_cart_by_user_id(user_id)
        if not cart: 
            return False
            
        item = self.cart_repo.get_item(cart.id, product_id)
        if item:
            self.cart_repo.remove_item(item)
            return True
        return False

    def empty_cart(self, user_id: int) -> bool:
        cart = self.cart_repo.get_cart_by_user_id(user_id)
        if cart:
            self.cart_repo.clear_cart(cart)
            return True
        return False