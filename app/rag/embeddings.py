import os
import requests
from dotenv import load_dotenv

load_dotenv()

COHERE_API_KEY = os.getenv("COHERE_API_KEY")


def create_embeddings(texts: list[str]) -> list:
    """Skapa embeddings via Cohere API."""
    if not texts:
        return []
    
    try:
        response = requests.post(
            "https://api.cohere.ai/v1/embed",
            headers={
                "Authorization": f"Bearer {COHERE_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "texts": texts,
                "model": "embed-english-light-v3.0",
                "input_type": "search_document"
            },
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json()["embeddings"]
        else:
            print(f"Cohere error: {response.text}")
            return _fallback_embeddings(texts)
    except Exception as e:
        print(f"Cohere exception: {e}")
        return _fallback_embeddings(texts)


def create_query_embedding(text: str) -> list:
    """Skapa embedding för query."""
    try:
        response = requests.post(
            "https://api.cohere.ai/v1/embed",
            headers={
                "Authorization": f"Bearer {COHERE_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "texts": [text],
                "model": "embed-english-light-v3.0",
                "input_type": "search_query"
            },
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json()["embeddings"][0]
        else:
            return _fallback_embeddings([text])[0]
    except:
        return _fallback_embeddings([text])[0]


def _fallback_embeddings(texts: list[str]) -> list:
    """Fallback hash-embeddings om API failar."""
    import hashlib
    embeddings = []
    for text in texts:
        hash_obj = hashlib.sha384(text.encode())
        hash_bytes = hash_obj.digest()
        extended_bytes = hash_bytes * 8
        embedding = [(b - 128) / 128.0 for b in extended_bytes[:384]]
        embeddings.append(embedding)
    return embeddings