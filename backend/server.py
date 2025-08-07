from flask import Flask
from flask_cors import CORS
from routes import register_routes

app = Flask(__name__)

CORS(app)

app.config["UPLOAD_FOLDER"] = "uploads"

register_routes(app)

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)

