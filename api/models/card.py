from constants.server_constants import DECK_OF_CARDS_API_PORT,DECK_OF_CARDS_API_HOST
CARDS_WEIGHT = {
    '4C': 14, '7H': 13, 'AS': 12, '7D': 11, # Special cards

    '3S': 10, '3D': 10, '3C': 10, '3H': 10,
    '2S': 9, '2D': 9, '2C': 9, '2H': 9,
    'AD': 8, 'AC': 8, 'AH': 8,
    'KS': 7, 'KD': 7, 'KC': 7, 'KH': 7,
    'JS': 6, 'JD': 6, 'JC': 6, 'JH': 6,
    'QS': 5, 'QD': 5, 'QC': 5, 'QH': 5,
    '7S': 4, '7C': 4,
    '6S': 3, '6D': 3, '6C': 3, '6H': 3,
    '5S': 2, '5D': 2, '5C': 2, '5H': 2,
    '4S': 1, '4D': 1, '4H': 1
}

VALID_CARD_CODES = [
    'AS', '2S', '3S', '4S', '5S', '6S', '7S', 'JS', 'QS', 'KS',
    'AD', '2D', '3D', '4D', '5D', '6D', '7D', 'JD', 'QD', 'KD',
    'AC', '2C', '3C', '4C', '5C', '6C', '7C', 'JC', 'QC', 'KC',
    'AH', '2H', '3H', '4H', '5H', '6H', '7H', 'JH', 'QH', 'KH'
]

SPECIAL_CARDS_START_WEIGHT = 11

SUITS = {'S': 'SPADES', 'D': 'DIAMONDS', 'H': 'HEARTS', 'C': 'CLUBS'}

class Card:
    """
    Representa uma carta de um baralho de Truco.
    
    A classe `Card` é usada para criar objetos que representam cartas de um baralho padrão.
    Cada carta é identificada por seu código, como '3S' para 3 de Espadas, e possui um peso
    associado que é calculado com base em regras específicas do jogo 'Truco'.
    """

    class InvalidCardException(Exception):
        """
        Uma exceção personalizada para representar um código de carta de baralho inválido.
        Esta exceção é lançada quando um código de carta não é encontrado na lista de cartas válidas.
        """
        def __init__(self, card_code):
            self.message = f"Invalid card code: {card_code}"
            super().__init__(self.message)



    def __init__(self, code: str):
        if code not in VALID_CARD_CODES:
            raise Card.InvalidCardException(code)
        
        self.code = code
        self.weight = CARDS_WEIGHT[code]
        self.value = code[:1]
        self.suit = SUITS[code[1:]]

    def get_img_url(self) -> str:
        """
        Retorna a URL de uma imagem da carta com base em seu código.
        :return: Uma string contendo a URL da imagem da carta no formato 'https://deckofcardsapi.com/static/img/{code}.png'.
        """
        return f"http://{DECK_OF_CARDS_API_HOST}:{DECK_OF_CARDS_API_PORT}/static/img/{self.code}.png"
    
    def __le__(self, other_card: 'Card') -> bool:
        if isinstance(other_card, Card):
            return self.weight <= other_card.weight 
        else:
            raise TypeError(f'Object {other_card} is not a Card object')
    
    def __lt__(self, other_card: 'Card') -> bool:
        if isinstance(other_card, Card):
            return self.weight < other_card.weight
        else:
            raise TypeError(f'Object {other_card} is not a Card object')
        
    def __ge__(self, other_card: 'Card') -> bool:
        if isinstance(other_card, Card):
            return self.weight >= other_card.weight
        else:
            raise TypeError(f'Object {other_card} is not a Card object')
        
    def __gt__(self, other_card: 'Card') -> bool:
        if isinstance(other_card, Card):
            return self.weight > other_card.weight
        else:
            raise TypeError(f'Object {other_card} is not a Card object')
        
    def __eq__(self, other_card: 'Card') -> bool:
        if isinstance(other_card, Card):
            return self.weight == other_card.weight
        else:
            raise TypeError(f'Object {other_card} is not a Card object')
        
    def to_json(self):
        """
        Converte os atributos da carta em um dicionário JSON.
        :return: Um dicionário com as informações da carta, incluindo o código e o peso.
        """
        return {
            'code': self.code,
            'weight': self.weight,
            'value' : self.value,
            'suit' : self.suit,
            'url_image' : self.get_img_url()
        }    