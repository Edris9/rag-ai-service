import faiss
import numpy as np
from app.rag.embeddings import create_embeddings, create_query_embedding

vector_store = None
chunks_data = []


def add_to_vector_store(chunks: list[str], doc_id: str):
    global vector_store, chunks_data
    
    embeddings = create_embeddings(chunks)
    if not embeddings:
        return
    
    embeddings_np = np.array(embeddings).astype('float32')
    dimension = embeddings_np.shape[1]
    
    if vector_store is None:
        vector_store = faiss.IndexFlatL2(dimension)
    
    vector_store.add(embeddings_np)
    
    for chunk in chunks:
        chunks_data.append({"text": chunk, "doc_id": doc_id})


def search_vector_store(query: str, k: int = 3) -> list:
    global vector_store, chunks_data
    
    if vector_store is None or len(chunks_data) == 0:
        return []
    
    query_embedding = create_query_embedding(query)
    query_np = np.array([query_embedding]).astype('float32')
    
    distances, indices = vector_store.search(query_np, k)
    
    results = []
    for i, idx in enumerate(indices[0]):
        if idx < len(chunks_data):
            results.append({
                "text": chunks_data[idx]["text"],
                "doc_id": chunks_data[idx]["doc_id"],
                "score": float(distances[0][i])
            })
    
    return results


def clear_vector_store():
    global vector_store, chunks_data
    vector_store = None
    chunks_data = []

def init_vector_store():
    """Initialize vector store - kallas vid startup."""
    global vector_store, chunks_data
    vector_store = None
    chunks_data = []