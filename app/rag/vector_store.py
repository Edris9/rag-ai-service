import faiss
import numpy as np

# Global storage
index = None
stored_chunks = []


def init_vector_store(dimension: int = 384):
    """Initiera FAISS index."""
    global index, stored_chunks
    index = faiss.IndexFlatL2(dimension)
    stored_chunks = []


def clear_vector_store():
    """Rensa vector store helt."""
    global index, stored_chunks
    index = None
    stored_chunks = []


def add_to_store(chunks: list[str], embeddings: list):
    """Lägg till chunks och embeddings."""
    global index, stored_chunks
    
    if index is None:
        init_vector_store()
    
    stored_chunks.extend(chunks)
    vectors = np.array(embeddings).astype("float32")
    index.add(vectors)


def search(query_embedding: list, top_k: int = 3) -> list[str]:
    """Sök efter liknande chunks."""
    if index is None:
        return []
    
    query_vector = np.array([query_embedding]).astype("float32")
    distances, indices = index.search(query_vector, top_k)
    
    results = []
    for idx in indices[0]:
        if idx < len(stored_chunks):
            results.append(stored_chunks[idx])
    return results