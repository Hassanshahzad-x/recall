from flask import request
from flask_restful import Resource
from werkzeug.utils import secure_filename
from utils.chunks import process_pdf_and_store
import os

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"pdf"}


class FileUpload(Resource):
    def post(self):
        if "files" not in request.files:
            return {"message": "No file part in the request"}, 400

        files = request.files.getlist("files")
        if not files:
            return {"message": "No files provided"}, 400

        saved_filenames = []

        for file in files:
            if file.filename == "":
                continue

            filename = secure_filename(file.filename)
            file_ext = filename.rsplit(".", 1)[-1].lower()

            if file_ext not in ALLOWED_EXTENSIONS:
                continue

            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            save_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(save_path)

            if not os.path.exists(save_path):
                print(f"ERROR: File not saved to {save_path}")
                continue

            print(f"Saved: {filename}")
            saved_filenames.append(filename)

        if not saved_filenames:
            return {"message": "No valid PDF files were uploaded"}, 400

        try:
            chunks_info = process_pdf_and_store(saved_filenames)
            print(chunks_info)
        except Exception as e:
            return {"message": f"Error processing files: {str(e)}"}, 500

        return {
            "files": [
                {"filename": fname, "chunks": chunks_info.get(fname, 0)}
                for fname in saved_filenames
            ]
        }, 200
