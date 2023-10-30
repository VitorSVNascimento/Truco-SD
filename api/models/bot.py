import random
from models.player import Player
from models.card import Card
from typing import List

BOT_NAMES = [
    "BOT Zé da Cerveja",
    "BOT João do Samba",
    "BOT Maria da Pinga",
    "BOT Antônio do Petisco",
    "BOT Carlinhos da Rocha",
    "BOT Lúcia do Chopp",
    "BOT Toninho do Tira-Gosto",
    "BOT Linus Torvaldespacho do Samba",
    "BOT Seu Jorge da Feijoada",
    "BOT Mariana da Caipirinha",
    "BOT Cleitin da Cachaça",
    "BOT Piton Cachorro do Buteco"
]

class Bot(Player):
    def __init__(self, id: int, name: str, cards: List[Card] = []):
        super().__init__(id, name, None, cards)

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