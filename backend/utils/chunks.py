import os
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
import faiss
import pickle
import numpy as np

UPLOAD_FOLDER = "uploads"
INDEX_FOLDER = "database"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50


def chunk_text(text, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks


def process_pdf_and_store(filenames):
    all_chunks = []
    all_vectors = []
    all_sources = []

    chunk_count_per_file = {}

    for filename in filenames:
        path = os.path.join(UPLOAD_FOLDER, filename)

        reader = PdfReader(path)
        full_text = "\n".join(
            [page.extract_text() for page in reader.pages if page.extract_text()]
        )

        chunks = chunk_text(full_text)
        vectors = SentenceTransformer("all-MiniLM-L6-v2").encode(chunks)

        all_chunks.extend(chunks)
        all_vectors.extend(vectors)
        all_sources.extend([filename] * len(chunks))

        chunk_count_per_file[filename] = len(chunks)

    all_vectors = np.array(all_vectors)

    index = faiss.IndexFlatL2(all_vectors.shape[1])
    index.add(all_vectors)

    os.makedirs(INDEX_FOLDER, exist_ok=True)
    faiss.write_index(index, os.path.join(INDEX_FOLDER, "global.index"))

    with open(os.path.join(INDEX_FOLDER, "global_chunks.pkl"), "wb") as f:
        pickle.dump(all_chunks, f)

    with open(os.path.join(INDEX_FOLDER, "global_sources.pkl"), "wb") as f:
        pickle.dump(all_sources, f)

    return chunk_count_per_file
