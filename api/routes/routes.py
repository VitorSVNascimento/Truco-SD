from flask import make_response,render_template
from flask_restx import Resource

from server.instance import server
from documentation.models.game import new_game,new_game_return

from models.game import Game
from models.player import Player
import pathlib

app,api = server.app,server.api

@app.route('/docstr',methods=['GET'])
def send_doc_str():
    doc_path = pathlib.Path(__file__).parent / "../documentation/socketdoc.yaml"
    with(open(doc_path,'r') as f):
        doc_data = f.read()
    # doc_data = server.socketio.asyncapi_doc.get_yaml()
    return make_response(doc_data)

@api.route('/docs/socketio')
class SocketDoc(Resource):
    def get(self,):
        return make_response(render_template('socketdoc.html'))