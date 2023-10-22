from .player import Player
from server.instance import server

class Game:
    def __init__(self, id,owner):
        self.__id = id
        self.__owner = owner
        self.__players = [owner]

    def get_id(self):
        return self.__id
    
    def add_player(self,player:Player):
        self.__players.append(player)
    
    def to_json(self):
        return {
            'id':self.__id,
            'owner':self.__owner.to_json(),
            'players':[player.to_json() for player in self.__players]
        }
