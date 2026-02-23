from sqlalchemy.orm import Session
from app.models.user import User
from typing import Optional


class UserRepository:
    """
    Clase de repositorio para manejar las operaciones de la Base de Datos
    relacionadas con el modelo User.
    """
    def __init__(self, db: Session):
        self.db = db

    def get_by_username(self, username: str) -> Optional[User]:
        """
        Obtiene un usuario por nombre de usuario (utilizado para la autenticación).
        """
        return self.db.query(User).filter(User.username == username).first()

    def create(self, user: User) -> User:
        """
        Crea y persiste un nuevo usuario en la base de datos (utilizado para el registro).
        """
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """
        Obtiene un usuario por su ID (utilizado para verificar el token JWT).
        
        Este método es esencial para la función get_current_user en app/core/auth.py.
        """
        return self.db.query(User).filter(User.id == user_id).first()
    
    
    def update(self, user: User) -> User:
        """
        Persiste los cambios de un objeto User existente y lo refresca.
        """

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user