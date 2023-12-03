from models.player import Player
from models.card import Card
from models.team import Team
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

    def throw_card(self, player: Player, card: Card, team: Team):
        self.table_cards[self.round].append({
             'player':player,'card':card,'team':team
         })

    def get_winner(self,):
        '''
        Verifica o resultado dessa mão
        Retorna o time vencedor, o valor da mão e o jogador que deve iniciar a próxima mão
        '''
        if len(self.hand_winners) <= 1:
            return HandResult(None,NOT_END,None)
        
        if DRAW in self.hand_winners:
            count = self.hand_winners.count(DRAW)
            if count == 3:
                hand_result = HandResult(DRAW,0,self.table_cards[0][1])
                #resetar
                return hand_result

            result = [value for value in self.hand_winners if value != DRAW]
            hand_result = HandResult(result[0],self.hand_value,self.table_cards[0][1])
            #resetar
            return hand_result

        if len(self.hand_winners) == 2 and self.hand_winners[0] != self.hand_winners[1]:
            #Resetar
             return HandResult(None,NOT_END,None)
        
        if len(self.hand_winners) == 2 and self.hand_winners[0] == self.hand_winners[1]:
            hand_result = HandResult(self.hand_winners[0],self.hand_value,self.table_cards[0][1])
            #Resetar
            return hand_result
        
        winner =  max(set(self.hand_winners), key=self.hand_winners.count)
        hand_result = HandResult(winner,self.hand_value,self.table_cards[0][1])
        return hand_result

        pass
    
    def __get_wight(self,card_on_board):
        return card_on_board['card'].weight

    def __get_max_weight_positions(self):
        max_weight = max(self.table_cards[self.round], key=self.__get_wight)['card'].weight

        max_weight_positions = [i for i, json in enumerate(self.table_cards[self.round]) if json['card'].weight == max_weight]
        return max_weight_positions

    def get_current_round_winner(self):
        if len(self.table_cards[self.round]) < TOTAL_PLAYERS:
            return None,NOT_END
        
        winner_positions = self.__get_max_weight_positions()

        if len(winner_positions) == 1:
            self.hand_winners.append(self.table_cards[self.round][winner_positions[0]]['team'])
            return  self.table_cards[self.round][winner_positions[0]]['player'],self.table_cards[self.round][winner_positions[0]]['team']
        
        if len(winner_positions) > 2:
            self.hand_winners.append(DRAW)
            return self.table_cards[self.round][winner_positions[-1]]['player'],DRAW
        
        if len(winner_positions) == 2:
            if self.table_cards[self.round][winner_positions[0]]['team'] == self.table_cards[self.round][winner_positions[1]]['team']:
                self.hand_winners.append(self.table_cards[self.round][winner_positions[1]]['team'])
                return self.table_cards[self.round][winner_positions[1]]['player'],self.table_cards[self.round][winner_positions[1]]['team']
            else:
                self.hand_winners.append(DRAW)   
                return self.table_cards[self.round][winner_positions[1]]['team'],DRAW


    def __calc_round_winner(self,round_list:list):
        team_one = 0
        team_two = 0
        draw  = 0
        


    def __next_round(self):
        pass
    
    def __clear_table(self):
        self.table_cards.clear()
    
    

