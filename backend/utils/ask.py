import os
from openai import OpenAI


def ask_question(query, top_chunks):
    context = "\n\n".join(
        f"(From {chunk['pdf']}): {chunk['chunk']}" for chunk in top_chunks
    )

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=f"{os.getenv('OPENAI_API_KEY')}",
    )

    completion = client.chat.completions.create(
        model="deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages=[
            {
                "role": "system",
                "content": (
                    "Your job is to answer strictly based on the provided context. "
                    "If the answer is not found clearly in the context, say only: 'Not found in the provided context.'"
                ),
            },
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {query}",
            },
        ],
    )

    return completion.choices[0].message.content
