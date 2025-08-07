import os
from flask import request
from flask_restful import Resource
from openai import OpenAI
from utils.search import search_chunks_across_all_pdfs
from utils.ask import ask_question
from dotenv import load_dotenv

load_dotenv()


class AskQuestion(Resource):
    def post(self):
        data = request.get_json()
        query = data.get("query")
        chunks = search_chunks_across_all_pdfs(query)

        if not chunks:
            return {"error": "No chunks found"}, 404

        answer = ask_question(query, chunks)

        return {"answer": answer, "query": query}
