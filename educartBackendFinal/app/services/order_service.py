# app/services/order_service.py
from sqlalchemy.orm import Session, selectinload, joinedload
from sqlalchemy import exc
from typing import Optional, List

from app.models.order_item import OrderItem
from app.models.order import Order
from app.models.user import User
from app.schemas.order import OrderCreate
from app.repositories.order_repository import OrderRepository
from app.repositories.cart_repository import CartRepository
from app.repositories.product_repository import ProductRepository

class OrderService:
    """
    Clase que contiene la lógica de negocio para la gestión de Órdenes y el Checkout Atómico.
    """
    def __init__(self, db: Session):
        self.db = db
        self.order_repository = OrderRepository(db)
        self.cart_repository = CartRepository(db)
        self.product_repository = ProductRepository(db)
        

    def get_order_by_id(self, order_id: int) -> Optional[Order]:
        return self.order_repository.get_by_id(order_id)


    def get_orders_by_user_id(self, user_id: int) -> List[Order]:
        """
        Recupera todas las órdenes de un usuario cargando 
        automáticamente los productos asociados.
        """
        return (
            self.db.query(Order)
            .filter(Order.user_id == user_id)
            # EXPLICACIÓN TÉCNICA:
            # 1. selectinload(Order.items): Carga eficientemente la lista de items.
            # 2. .joinedload(OrderItem.product): Por cada item, une la tabla Products para traer el nombre/imagen.
            .options(
                selectinload(Order.items).joinedload(OrderItem.product)
            )
            .order_by(Order.order_date.desc()) # Ordenamos por fecha descendente
            .all()
        )

    def create_order_transactional(self, user_id: int, order_data: OrderCreate) -> Order:
        """
        Ejecuta la transacción atómica:
        Verifica Stock - Resta Stock - Crea Orden - Vacía Carrito.
        """
        
        cart = self.cart_repository.get_cart_by_user_id(user_id)
        
        if not cart or not cart.items:
            raise ValueError("El carrito está vacío. Agrega productos antes de finalizar la compra.")

        items_to_process = []
        final_total = 0.0
        
        try:

            for cart_item in cart.items:
                product = self.product_repository.get_by_id_for_update(cart_item.product_id)
                
                if product is None:

                    raise ValueError(f"Producto con ID {cart_item.product_id} no encontrado.")
                

                if cart_item.quantity > product.stock_current:

                    raise ValueError(f"Stock insuficiente para {product.name}. Solo quedan {product.stock_current} unidades.")
                

                subtotal = cart_item.quantity * product.price
                final_total += subtotal
                
                items_to_process.append({
                    "product_id": cart_item.product_id,
                    "quantity": cart_item.quantity,
                    "price": product.price,
                    "product_obj": product 
                })
            

            updated_products = []
            for item in items_to_process:
                product = item["product_obj"]
                product.stock_current -= item["quantity"]
                self.db.add(product)
                updated_products.append(product)
                

            new_order = self.order_repository.create_order_transaction(
                user_id=user_id,
                order_data=order_data,
                items_to_add=items_to_process,
                final_total=final_total
            )
            
            self.cart_repository.clear_cart(cart)
            

            self.db.commit()
            self.db.refresh(new_order)
            
            return new_order
        
        except ValueError as e:
           
            self.db.rollback()
            raise e 
        
        except exc.SQLAlchemyError as e:
            self.db.rollback()
            print(f"Error en BD durante la transacción: {e}")
            raise Exception("Fallo la transacción de la orden. Se revirtieron los cambios.")
        
        
    
    
    
    def get_all_orders(self) -> List[Order]:
        """ADMIN: Recupera todas las órdenes del sistema."""
        return (
            self.db.query(Order)
            .options(
                selectinload(Order.items).joinedload(OrderItem.product)
            )
            .order_by(Order.order_date.desc())
            .all()
        )
        
        
        
    def update_order_status(self, order_id: int, new_status: str) -> Order:
        """Cambia el estado de una orden. Lanza error si no existe."""
        updated_order = self.order_repository.update_status(order_id, new_status)
        
        if not updated_order:
            raise ValueError(f"La orden #{order_id} no existe.")
            
        return updated_order