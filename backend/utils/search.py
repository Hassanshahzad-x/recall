import os
import pickle
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

INDEX_FOLDER = "database"
TOP_K = 3


def search_chunks_across_all_pdfs(query, top_k=TOP_K):
    query_embedding = SentenceTransformer("all-MiniLM-L6-v2").encode(query)
    query_embedding = np.array([query_embedding]).astype("float32")

    results = []

    for filename in os.listdir(INDEX_FOLDER):
        if not filename.endswith(".index"):
            continue

        base_name = filename.replace(".index", "")
        index_path = os.path.join(INDEX_FOLDER, filename)
        chunks_path = os.path.join(INDEX_FOLDER, f"{base_name}_chunks.pkl")

        if not os.path.exists(chunks_path):
            continue

        try:
            index = faiss.read_index(index_path)
        except Exception as e:
            print(f"Failed to read index {index_path}: {e}")
            continue

        try:
            with open(chunks_path, "rb") as f:
                chunks = pickle.load(f)
        except Exception as e:
            print(f"Failed to load chunks from {chunks_path}: {e}")
            continue

        distances, indices = index.search(query_embedding, top_k)

        for i, score in zip(indices[0], distances[0]):
            if i < len(chunks):
                results.append(
                    {"chunk": chunks[i], "pdf": base_name, "score": float(score)}
                )

    sorted_results = sorted(results, key=lambda x: x["score"])

    return sorted_results[:top_k]
