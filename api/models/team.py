from typing import List
from models.hand import BASE_HAND_VALUE
from models.player import Player

''' O número máximo de jogadores permitidos em um time. '''
MAX_PLAYERS = 2

class Team:
    """
    Representa um time em um jogo de Truco, composto por jogadores.
    A classe `Team` contém informações sobre o time, incluindo seu ID, jogadores, pontuação da mão e jogos vencidos.
    """

    class MaximumNumberOfPlayersException(Exception):
        """
        Uma exceção personalizada para representar que o número máximo de jogadores por time foi excedido.
        """
        def __init__(self, card_code):
            self.message = f"Maximum number of players exceeded. {Team.MAX_PLAYERS} players maximum!"
            super().__init__(self.message)

    def __init__(self, id: int, players: List[Player] = []):
        self.id = id

        if len(players) > MAX_PLAYERS:
            raise Team.MaximumNumberOfPlayersException()
        
        self.players = players
        # self.hand_score = 0
        self.games_won = 0

    def add_player(self, player: Player) -> bool:
        """
        Adiciona um jogador ao time, se houver espaço disponível.
        :param player: Um objeto da classe 'Player' a ser adicionado ao time.
        :return: True se o jogador foi adicionado com sucesso, False se o número máximo de jogadores já foi atingido.
        """
        if len(self.players) < MAX_PLAYERS:
            self.players.append(player)
            return True
        
        return False
    
    def number_of_players(self) -> int:
        """
        Retorna a quantidade de jogadores do time.
        :return: Quantidade de jogadores
        """
        return len(self.players)
    
    def is_full(self) -> bool:
        """
        Verifica se o time já está cheio, ou seja, se a quantidade máxima de jogadores foi atingida.
        :return: True caso esteja cheio, False caso contrário.
        """
        return len(self.players) >= MAX_PLAYERS

    def increment_hand_score(self, hand_value: int):
        """
        Incrementa a pontuação da mão do time com um valor.
        :param hand_value: Um valor inteiro a ser adicionado à pontuação da mão do time.
        """
        if hand_value >= BASE_HAND_VALUE:
            self.hand_score += hand_value

    def increment_games_won(self):
        """
        Incrementa o número de jogos vencidos pelo time.
        """
        self.games_won += 1

    def reset_hand_score(self):
        """
        Reseta a pontuação da mão do time para zero.
        """
        self.hand_score = 0

    def reset_games_won(self):
        """
        Reseta o número de jogos vencidos pelo time para zero.
        """
        self.games_won = 0

    def to_json(self):
        """
        Converte os atributos do time em um dicionário JSON.
        :return: Um dicionário com as informações do time.
        """
        return {
            'id': self.id,
            'players': [player.to_json() for player in self.players],
            # 'hand_score': self.hand_score,
            'games_won': self.games_won
        } 
    
    def contains_player(self,username:str) -> bool:
        return any(player.name == username for player in self.players)
    
    def get_player_by_username(self,username:str) -> Player:
        for player in self.players:
            if player.name == username:
                return player
        return None