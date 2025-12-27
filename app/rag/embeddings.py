import os
import requests
from dotenv import load_dotenv

load_dotenv()

def create_embeddings(texts: list[str]) -> list:
    """Skapar embeddings via HuggingFace API (gratis)."""
    API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
    headers = {"Authorization": f"Bearer {os.getenv('HF_API_KEY')}"}
    
    response = requests.post(API_URL, headers=headers, json={"inputs": texts})
    return response.json()