from flask_restful import Api
from handlers.upload import FileUpload
from handlers.ask import AskQuestion
from handlers.remove import RemoveFile, RefreshFiles


def register_routes(app):
    api = Api(app)
    api.add_resource(FileUpload, "/upload")
    api.add_resource(AskQuestion, "/ask")
    api.add_resource(RemoveFile, "/remove")
    api.add_resource(RefreshFiles, "/refresh")
