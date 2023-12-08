import random
from models.player import Player
from models.card import Card
from typing import List
from constants.call_truco_constants import ACCEPT,DECLINE

BOT_NAMES = [
    "BOT Zé Da Cerveja",
    "BOT João Do Samba",
    "BOT Maria Da Pinga",
    "BOT Antônio Do Petisco",
    "BOT Carlinhos Da Rocha",
    "BOT Lúcia Do Chopp",
    "BOT Toninho Do TiraGosto",
    "BOT Linus Torvaldespacho Do Samba",
    "BOT Seu Jorge Da Feijoada",
    "BOT Mariana Da Caipirinha",
    "BOT Cleitin Da Cachaça",
    "BOT Piton Cachorro Do Buteco"
]

class Bot(Player):
    def __init__(self, id: int, name: str, cards: List[Card] = []):
        super().__init__(id, name, None, cards)

    def bot_get_random_card(self) -> Card:
        return random.choice(self.cards)
    
    def bot_get_response_truco(self) -> int:
        return random.choice([DECLINE])
    
    # To Do
    def bot_throw_card(self, card: Card) -> Card:
        """
        Remove uma carta da mão do bot com base nos dados do jogo.
        :param card: Um objeto da classe 'Card' a ser removido da mão do jogador.
        :return: O objeto 'Card' que foi removido da mão do jogador.
        """
        return self.throw_card_using_code(card.code)
    
    @staticmethod
    def get_random_bot_name(black_list: List[str]) -> str:
        name = random.choice(BOT_NAMES)
        while name in black_list:
            name = random.choice(BOT_NAMES)
        return name