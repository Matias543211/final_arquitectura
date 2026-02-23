from sqlalchemy.orm import Session
from typing import List, Optional

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

class CategoryRepository:
    """
    Clase encargada de la persistencia de datos (CRUD) para la entidad Category.
    """
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Category]:
        """Recupera todas las categorías."""
        return self.db.query(Category).all()

    def get_by_id(self, category_id: int) -> Optional[Category]:
        """Recupera una categoría por su ID."""
        return self.db.query(Category).filter(Category.id == category_id).first()

    def create(self, category_data: CategoryCreate) -> Category:
        """Crea una nueva categoría en la base de datos."""
        new_category = Category(**category_data.model_dump()) 
        self.db.add(new_category)
        self.db.commit()
        self.db.refresh(new_category)
        return new_category

    def update(self, category: Category, category_data: CategoryUpdate) -> Category:
        """Actualiza una categoría existente."""
        for key, value in category_data.model_dump(exclude_unset=True).items():
            setattr(category, key, value)
            
        self.db.commit()
        self.db.refresh(category)
        return category

    def delete(self, category: Category):
        """Elimina una categoría de la base de datos."""
        self.db.delete(category)
        self.db.commit()
