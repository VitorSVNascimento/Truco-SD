from flask import Flask
from flask_restx import Api
from flask_socketio import SocketIO

from constants.server_constants import *

class Server():
    def __init__(self,) -> None:
        self.app = Flask(__name__)
        self.api = Api(self.app,
                       version='1.0',
                       title='Truco API',
                       description='API para gerenciar partidas de truco',
                       doc='/docs')
        self.socketio = SocketIO(self.app,cors_allowed_origins='*')
        
    def run(self,):
        self.socketio.run(
            self.app,host=HOST,port=PORT,debug=True
        )
        # self.app.run(port=PORT,debug=True)

server = Server()