# 🚀 RAG AI Service

Production-ready Retrieval Augmented Generation (RAG) API.

## Features

- PDF/TXT document upload
- Text extraction and chunking
- Vector embeddings (SentenceTransformers)
- Semantic search (FAISS)
- LLM-powered answers (Groq/Llama 3.3)
- JWT Authentication

## Tech Stack

- **FastAPI** - Backend framework
- **LangChain** - Text processing
- **FAISS** - Vector database
- **Groq** - LLM API
- **JWT** - Authentication

## Setup

1. Clone repo
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env`:
```
GROQ_API_KEY=your-key-here
SECRET_KEY=your-secret-here
```

4. Run:
```bash
uvicorn app.main:app --reload
```

5. Open: http://127.0.0.1:8000/docs

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | Get JWT token |
| POST | /documents/upload | Upload PDF/TXT |
| GET | /documents/ | List documents |
| POST | /query/ | Ask questions |
| GET | /health | Health check |

## Author

**Edris Kohestani** - AI/ML Developer