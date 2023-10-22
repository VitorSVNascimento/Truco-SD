from flask import Flask,make_response,jsonify
from flask_restx import Api,Resource

from server.instance import server
from documentation.models.game import new_game,new_game_return

from models.game import Game
from models.player import Player

app,api = server.app,server.api

games = []

def get_next_id():
    if len(games) == 0:
        return 1
    return games[-1].get_id() + 1

# @api.route('/games')
# class GameList(Resource):
#     def get(self,):
#         return make_response(
#             jsonify(
#                 [game.to_json() for game in games]
#                 )
#             )
#     def post(self,):
#         response = api.payload
#         print(response)

#         return make_response(
#             jsonify(
#                 [game.to_json() for game in games]
#                 )
#             )
    
@api.route('/createGame')
class CreateGame(Resource):
    @api.expect(new_game,validate=True)
    @api.marshal_with(new_game_return)
    def post(self,):
        response = api.payload
        id = get_next_id()
        games.append(Game(id,Player(1,response['player_name'])))


        return {'game_id' : id},200