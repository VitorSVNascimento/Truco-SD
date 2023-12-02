from models.requests_deck_of_cards import Requests
from models.bot import Bot
from models.team import Team
from models.card import Card
from .player import Player
from .hand import Hand

TEAM_ONE = 1
TEAM_TWO = 2
CARDS_PER_PLAYER = 3
PLAYERS_AMOUNT = 4
FIRST_PLAYER = 0

SUCCESS = 200
NOT_IN_THIS_GAME = 400
ITS_NOT_YOUR_TURN = 401
'''
Códigos das mensagens de erro
'''


messages = {
    SUCCESS:'Sucesso',
    NOT_IN_THIS_GAME:'Você não está nesta partida',
    ITS_NOT_YOUR_TURN:'Não é sua vez de jogar'
}
'''
JSON de mensagens de erro
'''



class Game:
    def __init__(self, id: int, owner: Player):
        self.id = id
        self.owner = owner
        self.teams:list[Team] = [Team(TEAM_ONE, []), Team(TEAM_TWO, [])]
        self.started = False
        self.player_order: list[Player] = []
        self.next_player = 0
        self.deck = None
        self.current_hand:Hand = None
        self.add_player(self.owner, TEAM_ONE)

    def start(self):
        
        # Preenchendo com BOTs
        self.__fill_with_bots()

        # Definindo a ordem das jogadas
        self.__define_player_order()

        # Printando a ordem dos jogadores.
        [print(player.name) for player in self.player_order]

        self.current_hand = Hand(1,self.player_order[FIRST_PLAYER])

        # Criando o baralho de truco e armazenando em deck caso o request ocorreu com sucesso.
        response = Requests.create_truco_deck()
        self.deck = response if Requests.is_response_sucessful(response) else None

        self.__create_players_piles(self.deck['deck_id'], self.player_order)
        
        
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
        for team in self.teams:
            for playerName in team.players:
                if playerName.name == player.name:
                    player.name = player.name + str(len(self.teams[0].players) + len(self.teams[1].players))

        if self.started:
            return None

        if team_id:
            team = next((tm for tm in self.teams if tm.id == team_id), None)
        else:
            team = min(self.teams, key = lambda tm: len(tm.players), default=None)

        if team:
            if team.add_player(player):
                return player.name
            
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

    def __define_player_order_by_last_winner(self,username:str) -> None:
        """
        Define a ordem dos jogadores com base no jogador que ganhou a ultima mão:
        return: None
        """
        self.__define_player_order()

        team = self.find_player_team(username)
        player = team.get_player_by_username(username)
        position_winner = self.player_order.index(player)

        self.player_order[:] = self.player_order[position_winner:] + self.player_order[:position_winner]

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
            used_names.append(bot_name)
            self.add_player(Bot(id_gen, bot_name))


    def is_started(self) -> bool:
        """
        Verifica se o jogo já começou.
        :return: True se o jogo já começou, False caso contrário.
        """
        return self.started
    
    def __create_players_piles(self, deck_id, players: list[Player]):
        """
        Cria a pilha de cada jogador no baralho e distribui as cartas para cada jogador.
        """
        # ESSA LÓGICA DEVE MUDAR PARA TRATAR POSSÍVEIS ERROS DE REQUISIÇÃO DA API DECK OF CARDS
        for player in players:
            # Retirando as cartas do baralho para poder adicionar na pilha do jogador.
            response = Requests.draw_cards(deck_id, CARDS_PER_PLAYER)

            if Requests.is_response_sucessful(response):
                # Obtendo quais cartas foram retiradas do baralho.
                drawn_cards = response['cards']
                drawn_cards_code = []
                
                # Obtendo apenas o código de cada carta retirada do baralho.
                for card in drawn_cards:
                    drawn_cards_code.append(card['code'])

                print(f' codes = {drawn_cards_code}')
                # Removendo espaços do nome do jogador pois aparentemente a api deck of cards não entende nome com espaços
                # Obs.: Parece que ela também não lida com nomes contendo hífen (-)
                # Possível solução: Alterar código da api Deck of Cards para resolver esses problemas.
                player.name = player.name.replace(" ", "")

                # Criando a pilha que contêm as cartas de cada jogador com o seu nome.
                response = Requests.create_pile(deck_id, player.name, drawn_cards_code)
                
                # Criando as cartas de cada jogador
                if Requests.is_response_sucessful(response):
                    player.cards = [Card(card_code) for card_code in drawn_cards_code]

    def throw_card(self,card:Card,username:str):
        if username != self.player_order[FIRST_PLAYER].name:
            return ITS_NOT_YOUR_TURN
        player_current = self.player_order[FIRST_PLAYER]
        
        self.current_hand.throw_card(player_current,card,self.find_player_team(player_current))
        self.player_order.pop()
        winner = self.current_hand.get_winner()
        if not self.player_order or winner != 0:
            if self.current_hand.round == 3:
                pass
            else:
                self.current_hand.__next_round()
            self.__define_player_order()

    def find_player_team(self, player:Player) -> Team:
        for team in self.teams:
            if team.contains_player(player.name):
                return team
        return None
        

    def player_order_to_json(self):
        return {
            'player_order' : [player.name for player in self.player_order]
        }

    def to_json(self):
        return {
            'id':self.id,
            'owner':self.owner.to_json(),
            'teams':[team.to_json() for team in self.teams]
        }
