import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_answer(question: str, context_chunks: list[str]) -> str:
    """Generera svar baserat på fråga och kontext."""
    
    context = "\n\n---\n\n".join(context_chunks)
    
    prompt = f"""You are a helpful AI assistant analyzing a document (likely a CV/resume).

Based on the context below, answer the user's question. Be helpful and extract relevant information.
If the context contains relevant information, summarize and present it clearly.
Only say you don't know if the context truly contains no relevant information.

Context from document:
{context}

User's question: {question}

Helpful answer:"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
        max_tokens=500
    )
    
    return response.choices[0].message.content