from models.team import Team
from .player import Player

TEAM_ONE = 1
TEAM_TWO = 2

class Game:
    def __init__(self, id: int, owner: Player):
        self.id = id
        self.owner = owner
        self.teams = [Team(TEAM_ONE,[self.owner]), Team(TEAM_TWO)]
        self.next_player_id = owner.id

    def start():
        pass

    def game_over():
        pass

    def add_player(self, player: Player, team_id: int = None) -> Team:
        """
        Adiciona um jogador a uma equipe existente ou a uma equipe com espaço disponível.
        :param player: Um objeto da classe 'Player' a ser adicionado a uma equipe.
        :param team_id: (opcional) Um número inteiro representando o ID da equipe à qual o jogador deve ser adicionado.
        :return: A equipe à qual o jogador foi adicionado, ou None se não houver espaço em nenhuma equipe disponível.
        """
        if team_id:
            team = next((tm for tm in self.teams if tm.id == team_id), None)
        else:
            team = min(self.teams, key = lambda tm: len(tm.players), default=None)

        if team:
            team.add_player(player)
        
        return team
    
    def to_json(self):
        return {
            'id':self.__id,
            'owner':self.__owner.to_json(),
            'teams':[team.to_json() for team in self.teams]
        }
