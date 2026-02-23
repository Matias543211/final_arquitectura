from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.repositories.user_repository import UserRepository


pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"], 
    deprecated="auto"
)

class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    
    def get_password_hash(self, password: str):

        return pwd_context.hash(password)
    
    
    def verify_password(self, plain_password, hashed_password) -> bool:
        return pwd_context.verify(plain_password, hashed_password)


    def create_user(self, user_data: UserCreate) -> User:
        password_hash = self.get_password_hash(user_data.password)

        user = User(
            name=user_data.name,
            username=user_data.username,
            email=user_data.email,
            password=password_hash,
            role=user_data.role
        )

        created_user = self.repo.create(user) 

        return created_user
    


    def authenticate_user(self, username: str, password: str):
        user = self.repo.get_by_username(username)
        if not user or not self.verify_password(password, user.password):
            return None
        return user

    def create_access_token(self, data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt





    def update_user_data(self, user_to_update: User, update_data: UserUpdate) -> User:
        """
        Aplica los cambios al objeto User, hashea la nueva contraseña si se proporciona, 
        y delega el guardado al repositorio.
        """
        update_data_dict = update_data.model_dump(exclude_unset=True)
        

        if 'password' in update_data_dict:
            new_password = update_data_dict.pop('password')
            user_to_update.password = self.get_password_hash(new_password)
        
        for key, value in update_data_dict.items():
            setattr(user_to_update, key, value)
            
        return self.repo.update(user_to_update)