from sentence_transformers import SentenceTransformer

# Ladda modell (liten och snabb)
model = SentenceTransformer("all-MiniLM-L6-v2")


def create_embeddings(texts: list[str]) -> list:
    """Skapar embeddings för en lista av texter."""
    embeddings = model.encode(texts)
    return embeddings.tolist()