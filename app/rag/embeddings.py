import os
import hashlib
from dotenv import load_dotenv

load_dotenv()

def create_embeddings(texts: list[str]) -> list:
    """Skapar enkla hash-baserade embeddings (fallback)."""
    embeddings = []
    for text in texts:
        # Skapa en enkel 384-dim embedding baserad på text hash
        hash_obj = hashlib.sha384(text.encode())
        hash_bytes = hash_obj.digest()
        # Konvertera till floats mellan -1 och 1
        embedding = [(b - 128) / 128.0 for b in hash_bytes]
        embeddings.append(embedding)
    return embeddings