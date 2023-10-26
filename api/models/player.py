from api.models.card import Card
from typing import List

class Player:
    """
    Representa um jogador em um jogo de cartas.

    A classe `Player` contém informações sobre o jogador, incluindo seu ID, nome e as cartas em sua mão.
    """
    
    def __init__(self, id: int, name: str, cards: List[Card] = []):
        self.id = id
        self.name = name
        self.cards = cards

    def throw_card_using_code(self, card_code: str) -> Card:
        """
        Remove uma carta da mão do jogador com base em seu código.
        :param card_code: Uma string representando o código da carta a ser removida da mão do jogador.
        :return: Um objeto da classe 'Card' que foi removido da mão do jogador, ou None se a carta não for encontrada.
        """
        for card in self.cards:
            if card.code == card_code:
                return self.cards.pop(self.cards.index(card))
        return None
    
    def throw_card(self, card: Card) -> Card:
        """
        Remove uma carta da mão do jogador com base em um objeto 'Card'.
        :param card: Um objeto da classe 'Card' a ser removido da mão do jogador.
        :return: O objeto 'Card' que foi removido da mão do jogador.
        """
        return self.throw_card_using_code(card.code)

    # Essa função provavelmente vai sair daqui.
    def increase_hand_value(self) -> None:
        pass

    def to_json(self):
        """
        Converte os atributos do jogador em um dicionário JSON.
        :return: Um dicionário com as informações do jogador.
        """
        return {
            'id': self.id,
            'name': self.name,
            'cards': self.cards
        }    