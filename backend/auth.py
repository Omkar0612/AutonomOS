"""Authentication and authorization utilities."""
import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

# Security configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

class TokenData(BaseModel):
    """JWT token payload."""
    user_id: str
    api_provider: Optional[str] = None
    api_key_hash: Optional[str] = None

class UserCredentials(BaseModel):
    """User API credentials (encrypted)."""
    provider: str
    api_key: str
    model: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def hash_api_key(api_key: str) -> str:
    """Hash API key for secure storage."""
    return pwd_context.hash(api_key)

def verify_api_key(plain_key: str, hashed_key: str) -> bool:
    """Verify hashed API key."""
    return pwd_context.verify(plain_key, hashed_key)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> TokenData:
    """Validate JWT token and return user data."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
        
        return TokenData(
            user_id=user_id,
            api_provider=payload.get("api_provider"),
            api_key_hash=payload.get("api_key_hash")
        )
    except JWTError:
        raise credentials_exception

# In-memory credential store (replace with Redis/database in production)
_credential_store = {}

def store_user_credentials(user_id: str, credentials: UserCredentials) -> str:
    """Store encrypted user credentials and return token."""
    # Hash the API key before storing
    api_key_hash = hash_api_key(credentials.api_key)
    
    # Store credentials (in production, use encrypted database)
    _credential_store[user_id] = {
        "provider": credentials.provider,
        "api_key": credentials.api_key,  # In production: encrypt this
        "model": credentials.model,
        "api_key_hash": api_key_hash
    }
    
    # Create JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={
            "user_id": user_id,
            "api_provider": credentials.provider,
            "api_key_hash": api_key_hash
        },
        expires_delta=access_token_expires
    )
    
    return token

def get_user_credentials(user_id: str) -> Optional[UserCredentials]:
    """Retrieve user credentials from secure store."""
    creds = _credential_store.get(user_id)
    if creds:
        return UserCredentials(
            provider=creds["provider"],
            api_key=creds["api_key"],
            model=creds["model"]
        )
    return None
