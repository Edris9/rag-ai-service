import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()

def create_embeddings(texts: list[str]) -> list:
    """Skapar embeddings via HuggingFace API."""
    API_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2"
    headers = {"Authorization": f"Bearer {os.getenv('HF_API_KEY')}"}
    
    for attempt in range(3):
        try:
            response = requests.post(
                API_URL, 
                headers=headers, 
                json={"inputs": texts, "options": {"wait_for_model": True}},
                timeout=60
            )
            
            # Kolla status code först
            if response.status_code != 200:
                print(f"HF API error {response.status_code}: {response.text}")
                if response.status_code == 503:
                    print(f"Model loading, waiting... (attempt {attempt + 1})")
                    time.sleep(20)
                    continue
                raise Exception(f"HuggingFace API error: {response.status_code}")
            
            # Kolla att response inte är tom
            if not response.text:
                print(f"Empty response, retrying... (attempt {attempt + 1})")
                time.sleep(5)
                continue
                
            result = response.json()
            
            if isinstance(result, dict) and "error" in result:
                raise Exception(f"HuggingFace API error: {result['error']}")
            
            return result
            
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}, retrying... (attempt {attempt + 1})")
            time.sleep(5)
            continue
    
    raise Exception("HuggingFace API failed after 3 attempts")