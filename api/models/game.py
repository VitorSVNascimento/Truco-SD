from models.bot import Bot
from models.team import Team
from .player import Player

TEAM_ONE = 1
TEAM_TWO = 2

class Game:
    def __init__(self, id: int, owner: Player):
        self.id = id
        self.owner = owner
        self.teams = [Team(TEAM_ONE, []), Team(TEAM_TWO, [])]
        self.started = False
        self.player_order = []
        self.next_player = 0
        self.deck = None
        self.add_player(self.owner, TEAM_ONE)

    def start(self):
        # Preenchendo com BOTs
        self.__fill_with_bots()

        # Definindo a ordem das jogadas
        self.__define_player_order()

        # Printando a ordem dos jogadores.
        [print(p.name) for p in self.player_order]
        

        self.started = True

        

    def game_over():
        pass

    def add_player(self, player: Player, team_id: int = None) -> Team:
        """
        Adiciona um jogador a uma equipe existente ou a uma equipe com espaço disponível.
        :param player: Um objeto da classe 'Player' a ser adicionado a uma equipe.
        :param team_id: (opcional) Um número inteiro representando o ID da equipe à qual o jogador deve ser adicionado.
        :return: A equipe à qual o jogador foi adicionado, ou None se não houver espaço em nenhuma equipe disponível.
        """
        if self.started:
            return None

        if team_id:
            team = next((tm for tm in self.teams if tm.id == team_id), None)
        else:
            team = min(self.teams, key = lambda tm: len(tm.players), default=None)

        if team:
            if team.add_player(player):
                return team
            
        return None
    
    def is_full(self) -> bool:
        """
        Verifica se todas as equipes estão cheias de jogadores.
        :return: True se todas as equipes estiverem cheias de jogadores, False caso contrário.
        """
        return all([team.is_full() for team in self.teams])

    def __define_player_order(self) -> None:
        """
        Define a ordem dos jogadores com base na ordem das equipes, alternando entre os times.
        :return: None
        """
        self.player_order = []
        max_players_per_team = max(len(team.players) for team in self.teams)
        
        for i in range(max_players_per_team):
            for team in self.teams:
                if i < len(team.players):
                    self.player_order.append(team.players[i])

    def __fill_with_bots(self) -> None:
        """
        Preenche as equipes com bots até que todas as equipes estejam cheias.
        Esta função gera bots com nomes aleatórios e os adiciona às equipes até que todas as equipes estejam cheias.
        :return: None
        """
        id_gen = 15000
        used_names = []
        while not self.is_full():
            bot_name = Bot.get_random_bot_name(used_names)
            self.add_player(Bot(id_gen, bot_name))

    def is_started(self) -> bool:
        """
        Verifica se o jogo já começou.
        :return: True se o jogo já começou, False caso contrário.
        """
        return self.started

    def to_json(self):
        return {
            'id':self.__id,
            'owner':self.__owner.to_json(),
            'teams':[team.to_json() for team in self.teams]
        }
