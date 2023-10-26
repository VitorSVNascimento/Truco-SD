from api.models.player import Player



''' Valor base (tentos) de uma mão '''
BASE_HAND_VALUE = 2

''' Valor máximo (tentos) de uma mão '''
MAX_HAND_VALUE = 12

class Hand:
    def __init__(self, id: int, first_player: Player):
        self.id = id
        self.next_player = first_player
        self.round = 0
        self.hand_value = BASE_HAND_VALUE
        self.table_cards = []

    def start_hand(self):
        pass

    def __next_round(self):
        pass
    
    def __clear_table(self):
        self.table_cards.clear()
    
    
