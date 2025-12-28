import os
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
from jose import jwt

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
CSHARP_API_URL = os.getenv("CSHARP_API_URL", "https://rag-ai-service-production.up.railway.app")


def verify_user(username: str, password: str) -> dict | None:
    """Verifiera användare via C# API."""
    try:
        response = requests.post(
            f"{CSHARP_API_URL}/api/Users/login",
            json={"username": username, "password": password},
            timeout=10
        )
        if response.status_code == 200:
            return response.json()
        return None
    except:
        return None


def register_user(username: str, password: str) -> dict | None:
    """Registrera ny användare via C# API."""
    try:
        response = requests.post(
            f"{CSHARP_API_URL}/api/Users/register",
            json={"username": username, "password": password},
            timeout=10
        )
        if response.status_code == 200:
            return response.json()
        return None
    except:
        return None


def create_token(username: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=24)
    data = {"sub": username, "exp": expire}
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except:
        return None