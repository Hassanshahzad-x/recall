# 🧠 Recaller AI - Smart Knowledge Base

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Flask%20%7C%20AI%20%7C%20VectorDB-brightgreen)

Recaller AI is an intelligent knowledge base that lets you **upload documents and interact with them** using contextual search and **AI-powered Q&A**. It uses **embeddings, vector search, and language models** to deliver precise, source-grounded answers from your content.

---

## ✨ Features

✅ Upload PDFs, Word docs, and text files  
✅ Contextual semantic search across all documents  
✅ AI-powered Q&A with cited sources  
✅ Smart document embeddings & vector database  
✅ Summarization of long documents  
✅ Scalable backend ready for large datasets  

---

## ⚙️ Tech Stack

| Frontend | Backend | AI/ML | Database | Deployment |
|----------|---------|-------|----------|------------|
| React.js | Flask   | Transformers, Sentence-Transformers | PostgreSQL + Vector DB (FAISS/PGVector) | Netlify + Google Cloud Run |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Hassanshahzad-x/recall.git
cd recall
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

## 🤖 AI Models

- sentence-transformers/all-MiniLM-L6-v2 → embeddings
- FAISS → vector similarity search

## 📌 Workflow

- Upload a document via UI
- Backend chunks + embeds text, stores vectors
- User asks a question
- System retrieves nearest chunks from vector DB
- LLM generates an answer with cited sources

## 📄 License

MIT License — free for personal and commercial use.

## 💡 Author

Made with ❤️ by Hassan Shahzad
