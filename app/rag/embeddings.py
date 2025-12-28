import os
import hashlib
from dotenv import load_dotenv

load_dotenv()

def create_embeddings(texts: list[str]) -> list:
    """Skapar enkla hash-baserade embeddings (384 dimensioner)."""
    embeddings = []
    for text in texts:
        # Skapa 384-dim embedding genom att upprepa hash
        hash_obj = hashlib.sha384(text.encode())
        hash_bytes = hash_obj.digest()  # 48 bytes
        
        # Upprepa 8 gånger för att få 384 dimensioner
        extended_bytes = hash_bytes * 8
        
        # Konvertera till floats mellan -1 och 1
        embedding = [(b - 128) / 128.0 for b in extended_bytes[:384]]
        embeddings.append(embedding)
    return embeddings