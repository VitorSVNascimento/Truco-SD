from models.requests_deck_of_cards import Requests
from models.bot import Bot
from models.team import Team
from models.card import Card
from .player import Player
from .hand_resullt import HandResult
from constants.call_truco_constants import ACCEPT,DECLINE
from .hand import Hand,DRAW

TEAM_ONE = 1
TEAM_TWO = 2
CARDS_PER_PLAYER = 3
PLAYERS_AMOUNT = 4
FIRST_PLAYER = 0

FINAL_RESULT = 12

SUCCESS = 200
END_HAND = 201
END_ROUND = 202
NOT_IN_THIS_GAME = 400
ITS_NOT_YOUR_TURN = 401
'''
Códigos das mensagens de erro
'''
LAST_ROUND = 3
messages_json = {
    SUCCESS : 'Sucesso',
    NOT_IN_THIS_GAME : 'Você não está nesta partida',
    ITS_NOT_YOUR_TURN : 'Não é sua vez de jogar',
    END_HAND : 'A mão foi encerrada',
    END_ROUND : 'O round foi encerrado',
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

    def get_next_player(self):
        return self.player_order[FIRST_PLAYER]
        
    def get_player_sid(self,sid) -> Player:
        for team in self.teams:
            for player in team.players:
                if player.sid == sid:
                    return player
        return None
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

        player = self.get_player_by_username(username)
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
        Requests.remove_all_cards_of_pile(deck_id)
        Requests.reshuffle_deck(deck_id)
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
        player_current.throw_card(card)
        self.current_hand.throw_card(player_current,card,self.find_player_team(player_current))

        self.player_order.pop(0)

        winner = self.current_hand.get_current_round_winner()
        if winner is not None:
            print(f'winner = {winner.name}')
        if winner is not None:
            #Alguém venceu o round
            hand_result : HandResult = self.current_hand.get_winner()
            if hand_result.team_winner != None:
                #Alguém venceu a mão
                return self.end_hand(hand_result)
            

            self.__define_player_order_by_last_winner(winner.name)
            print('----------------New Round------------------')
            [print(f'{player.name} = {[card.code for card in player.cards]}') for player in self.player_order]
            team_winner = self.current_hand.get_current_team_winner()
            self.current_hand.next_round()
            if team_winner == DRAW:
                return team_winner
            return winner
        print(f'Ordem: {[player.name for player in self.player_order]}')
        return messages_json[SUCCESS]

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
    
    def get_player_by_username(self,username:str):
        for team in self.teams:
            for player in team.players:
                if player.name == username:
                    return player
        return None

    def get_score(self,):
        return [self.teams[TEAM_ONE -1].score,self.teams[TEAM_TWO -1].score]
    
    def get_games_won(self,):
        return [self.teams[TEAM_ONE -1].games_won,self.teams[TEAM_TWO -1].games_won]

    def team_opponent(self,team:Team):
        return self.teams[1] if team.id == TEAM_ONE else self.teams[0]
    
    def call_truco(self, player):
        team = self.find_player_team(player)
        if self.current_hand.waiting_truco:
            self.current_hand.buff_hand_value()
            self.current_hand.truco_responses = []
        else:
            self.current_hand.waiting_truco = True
        return team
        
    def truco_response(self, response, player):
        hand_result = None
        self.current_hand.set_responses(player, response)
        response = self.current_hand.check_response()
        if response == ACCEPT or response == DECLINE:
            self.current_hand.waiting_truco = False
            if response == ACCEPT:
                self.current_hand.buff_hand_value()
            else:
                next_player = self.get_next_hand_player()
                hand_result = HandResult(self.team_opponent(self.find_player_team(player)),self.current_hand.hand_value,next_player)
                self.end_hand(hand_result)
        return response,hand_result

    def end_hand(self,hand_result:HandResult) -> HandResult:
        team = self.teams[self.teams.index(hand_result.team_winner)]
        team.increment_score(hand_result.hand_value)
        if team.score >= FINAL_RESULT:
            # Ganhou o jogo
            team.games_won +=1
            team.score = 0
            self.team_opponent(team).score = 0
        self.__define_player_order_by_last_winner(hand_result.next_player.name)
        [player.cards.clear() for player in self.player_order]
        self.current_hand.clear_table()
        self.__create_players_piles(self.deck['deck_id'], self.player_order)
        return hand_result
    
    def get_next_hand_player(self,) -> Player:
        next_player = self.current_hand.get_next_player()
        if next_player == None:
            next_player = self.player_order[1] if len(self.player_order) == 4 else self.player_order[0]
        return next_player

    def decline_ten_hand(self,player:Player):
        team = self.find_player_team(player)
        opponent = self.team_opponent(team)
        next_player = self.get_next_hand_player()
        hand_result = HandResult(opponent,self.current_hand.hand_value,next_player)
        self.end_hand(hand_result)
        return hand_result

