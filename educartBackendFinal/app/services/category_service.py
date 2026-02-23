from sqlalchemy.orm import Session
from typing import List, Optional

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.repositories.category_repository import CategoryRepository

class CategoryService:
    """
    Clase que contiene la lógica de negocio para las Categorías.
    """
    def __init__(self, db: Session):
        self.repository = CategoryRepository(db)

    def get_all_categories(self) -> List[Category]:
        """Recupera la lista completa de categorías."""
        return self.repository.get_all()

    def get_category_by_id(self, category_id: int) -> Optional[Category]:
        """Recupera una categoría por ID. Manejo de 'no encontrado' queda en el Router."""
        return self.repository.get_by_id(category_id)

    def create_category(self, category_data: CategoryCreate) -> Category:
        """Crea una nueva categoría."""
        return self.repository.create(category_data)

    def update_category(self, category_id: int, category_data: CategoryUpdate) -> Optional[Category]:
        """Actualiza una categoría existente."""
        category = self.get_category_by_id(category_id)
        if category is None:
            return None 
        
        return self.repository.update(category, category_data)

    def delete_category(self, category_id: int) -> bool:
        """Elimina una categoría."""
        category = self.get_category_by_id(category_id)
        if category is None:
            return False 

        self.repository.delete(category)
        return True
