from models.player import Player
from models.card import Card
from models.team import Team
from constants.call_truco_constants import ACCEPT,DECLINE,WAITING
from models.hand_resullt import HandResult

''' Valor base (tentos) de uma mão '''
BASE_HAND_VALUE = 2

''' Valor máximo (tentos) de uma mão '''
MAX_HAND_VALUE = 12

'''Winner Team '''
NOT_END = -1
TEAM_ONE = 1
TEAM_TWO = 2
DRAW = 3

'''Player numbers'''
TOTAL_PLAYERS = 4

class Hand:
    def __init__(self, id: int, first_player: Player):
        self.id = id
        self.next_player = first_player
        self.round = 0
        self.hand_value = BASE_HAND_VALUE
        self.table_cards = [[],[],[]]
        self.hand_winners = []
        self.truco_responses = []
        self.waiting_truco = False

    def throw_card(self, player: Player, card: Card, team: Team):
        self.table_cards[self.round].append({
             'player':player,'card':card,'team':team
         })

    def get_winner(self,):
        '''
        Verifica o resultado dessa mão
        Retorna um objeto handResult
        '''
        if len(self.hand_winners) <= 1:
            print('menor que 1')
            return HandResult(None,NOT_END,None)
        print (self.hand_winners)
        if DRAW in self.hand_winners:
            print('Contém empate')
            count = self.hand_winners.count(DRAW)
            if count == 3:
                print('3 empates')
                hand_result = HandResult(DRAW,0,self.table_cards[0][1]['player'])
                self.clear_table()
                return hand_result


        
            result = [value for value in self.hand_winners if value != DRAW]
            hand_result = HandResult(result[0],self.hand_value,self.table_cards[0][1]['player'])
            self.clear_table()
            return hand_result
        print(f'Tamanho da bagunça = {len(self.hand_winners)}, lista == {[team.id for team in self.hand_winners]}')
        if len(self.hand_winners) == 2 and self.hand_winners[0] != self.hand_winners[1]:
            print('if do time diferente')
            return HandResult(None,NOT_END,None)
        
        if len(self.hand_winners) == 2 and self.hand_winners[0] == self.hand_winners[1]:
            print('if do time igual')
            hand_result = HandResult(self.hand_winners[0],self.hand_value,self.table_cards[0][1]['player'])
            self.clear_table()
            return hand_result
        print('max value')
        winner =  max(set(self.hand_winners), key=self.hand_winners.count)
        hand_result = HandResult(winner,self.hand_value,self.table_cards[0][1]['player'])
        self.clear_table()
        return hand_result

    def __get_wight(self,card_on_board):
        return card_on_board['card'].weight

    def __get_max_weight_positions(self):
        max_weight = max(self.table_cards[self.round], key=self.__get_wight)['card'].weight

        max_weight_positions = [i for i, json in enumerate(self.table_cards[self.round]) if json['card'].weight == max_weight]
        return max_weight_positions

    def get_current_round_winner(self):
        if len(self.table_cards[self.round]) < TOTAL_PLAYERS:
            return None
        
        winner_positions = self.__get_max_weight_positions()

        if len(winner_positions) == 1:
            self.hand_winners.append(self.table_cards[self.round][winner_positions[0]]['team'])
            return  self.table_cards[self.round][winner_positions[0]]['player']
        
        if len(winner_positions) > 2:
            self.hand_winners.append(DRAW)
            return self.table_cards[self.round][winner_positions[-1]]['player']
        
        if len(winner_positions) == 2:
            if self.table_cards[self.round][winner_positions[0]]['team'] == self.table_cards[self.round][winner_positions[1]]['team']:
                self.hand_winners.append(self.table_cards[self.round][winner_positions[1]]['team'])
            else:
                self.hand_winners.append(DRAW)   
            return self.table_cards[self.round][winner_positions[1]]['player']

    def next_round(self):
        self.round+=1
    
    def get_current_team_winner(self):
        return self.hand_winners[-1]

    def clear_table(self):
        self.table_cards =[[],[],[]]
        self.hand_winners = []
        self.truco_responses = []
        self.hand_value = BASE_HAND_VALUE
        self.round = 0
    
    def set_responses(self, player, response):
        self.truco_responses.append({'player':player, 'response' : response})
    
    def get_next_player(self,):
        try:
            return self.table_cards[0][1]['player'] 
        except:
            return None

    def check_response(self):
        if len(self.truco_responses) == 0 or (len(self.truco_responses) == 1 and self.truco_responses[0]['response'] == DECLINE):
            return WAITING
        if len(self.truco_responses) == 1:
            return ACCEPT
        if self.truco_responses[0]['response'] == ACCEPT and self.truco_responses[1]['response'] == ACCEPT:
            self.truco_responses = []
            return ACCEPT
        self.truco_responses = []
        return DECLINE
    
    def buff_hand_value(self,):
        self.hand_value+=2 if self.hand_value%4 != 0 else 4

 
