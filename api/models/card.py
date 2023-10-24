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
            self.message = "Invalid card code"
            super().__init__(self.message)


    CARDS = ['AS', '2S', '3S', '4S', '5S', '6S', '7S', 'JS', 'QS', 'KS',
         'AD', '2D', '3D', '4D', '5D', '6D', '7D', 'JD', 'QD', 'KD',
         'AC', '2C', '3C', '4C', '5C', '6C', '7C', 'JC', 'QC', 'KC',
         'AH', '2H', '3H', '4H', '5H', '6H', '7H', 'JH', 'QH', 'KH']
    
    
    def __init__(self, code: str):
        if code not in Card.CARDS:
            raise Card.InvalidCardException(f"Código de carta inválido: {code}")
        
        self.code = code
        self.weight = Card.calculate_card_weigth(code)


    @staticmethod
    def calculate_card_weigth(code: str) -> int:
        """
        Calcula o peso de uma carta de baralho com base em seu código.
        :param code: Uma string representando o código da carta, por exemplo, '3S' para 3 de Espadas.
        :return: Um inteiro representando o peso da carta. Retorna -1 se o código da carta não for encontrado.
        """ 
        if code not in Card.CARDS:
            return -1
        
        manilhas = ['4C', '7H', 'AS', '7D']
        values = {'3': 10, '2': 9, 'A': 8, 'K': 7, 'J': 6, 'Q': 5, '7': 4, '6': 3, '5': 2, '4': 1}

        card_value = code[:-1]

        if code in manilhas:
            return len(manilhas) - manilhas.index(code) + 10
        elif card_value in values:
            return values[card_value]
        else:
            return -1
        
    
    def get_img_url(self) -> str:
        """
        Retorna a URL de uma imagem da carta com base em seu código.
        :return: Uma string contendo a URL da imagem da carta no formato 'https://deckofcardsapi.com/static/img/{code}.png'.
        """
        return f"https://deckofcardsapi.com/static/img/{self.code}.png"
    
    
    def compare_to(self, card: 'Card') -> int:
        """
        Compara o peso desta carta com o peso de outra carta.
        :param card: Um objeto da classe 'Card' para comparar com esta carta.
        :return: Um valor inteiro que indica a relação de pesos entre as cartas.
                 - 0 se as cartas têm o mesmo peso.
                 - 1 se esta carta tem um peso maior que a carta passada como parâmetro.
                 - -1 se esta carta tem um peso menor que a carta passada como parâmetro.
        """
        if self.weight == card.weight:
            return 0
        
        return 1 if self.weight > card.weight else -1
    

    def to_json(self):
        """
        Converte os atributos da carta em um dicionário JSON.
        :return: Um dicionário com as informações da carta, incluindo o código e o peso.
        """
        return {
            'code': self.code,
            'weight': self.weight
        }    
        