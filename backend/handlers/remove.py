from flask import request
from flask_restful import Resource
from werkzeug.utils import secure_filename
import os
from utils.chunks import process_pdf_and_store

UPLOAD_FOLDER = "uploads"


class RemoveFile(Resource):
    def post(self):
        data = request.get_json()
        filename = data.get("filename")

        if not filename:
            return {"message": "Filename is required"}, 400

        safe_filename = secure_filename(filename)
        file_path = os.path.join(UPLOAD_FOLDER, safe_filename)

        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"[DEBUG] Deleted: {safe_filename}")
            except Exception as e:
                return {"message": f"Failed to delete file: {str(e)}"}, 500
        else:
            return {"message": f"File '{safe_filename}' not found"}, 404

        try:
            remaining_files = [
                f
                for f in os.listdir(UPLOAD_FOLDER)
                if f.lower().endswith(".pdf")
                and os.path.isfile(os.path.join(UPLOAD_FOLDER, f))
            ]

            print(f"[DEBUG] Remaining files: {remaining_files}")

            if not remaining_files:
                print("[DEBUG] No PDF files remaining after deletion.")
                return {
                    "message": f"Deleted '{safe_filename}'. No PDF files remaining.",
                    "files": [],
                }, 200

            chunks_info = process_pdf_and_store(remaining_files)
            print(f"[DEBUG] Reprocessed chunks info: {chunks_info}")

        except Exception as e:
            return {"message": f"Error reprocessing remaining files: {str(e)}"}, 500

        return {
            "message": f"Deleted '{safe_filename}' and reprocessed remaining files",
            "files": [
                {"filename": fname, "chunks": chunks_info.get(fname, 0)}
                for fname in remaining_files
            ],
        }, 200
