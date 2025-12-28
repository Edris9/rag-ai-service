import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()

def create_embeddings(texts: list[str]) -> list:
    """Skapar embeddings via HuggingFace API."""
    API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
    headers = {"Authorization": f"Bearer {os.getenv('HF_API_KEY')}"}
    
    # Retry logic - HuggingFace modellen kan behöva "vakna upp"
    for attempt in range(3):
        response = requests.post(API_URL, headers=headers, json={"inputs": texts, "options": {"wait_for_model": True}})
        result = response.json()
        
        # Error-hantering
        if isinstance(result, dict):
            if "error" in result:
                if "loading" in result["error"].lower():
                    print(f"Model loading, waiting... (attempt {attempt + 1})")
                    time.sleep(20)
                    continue
                raise Exception(f"HuggingFace API error: {result['error']}")
        
        return result
    
    raise Exception("HuggingFace API failed after 3 attempts")