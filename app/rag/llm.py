import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_answer(question: str, context_chunks: list[str]) -> str:
    """Generera svar baserat på fråga och kontext."""
    
    context = "\n\n".join(context_chunks)
    
    prompt = f"""You are a helpful AI assistant. Answer the question based ONLY on the context below.
If the answer is not in the context, say "I don't know based on the provided documents."

Context:
{context}

Question: {question}

Answer:"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=500
    )
    
    return response.choices[0].message.content