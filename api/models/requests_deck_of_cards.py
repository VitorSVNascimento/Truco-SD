import requests
from models.card import VALID_CARD_CODES as TRUCO_CARDS

URL_DECK_OF_CARDS_API = 'http://127.0.0.1:8000/api/'

class Requests:

    @staticmethod
    def create_truco_deck():
        url = f"{URL_DECK_OF_CARDS_API}deck/new/shuffle/?cards={','.join(TRUCO_CARDS)}"
        return requests.get(url).json()
    
    @staticmethod
    def draw_cards(deck_id, number_of_cards):
        url_draw_cards = f'{URL_DECK_OF_CARDS_API}deck/{deck_id}/draw/?count={number_of_cards}'
        return requests.get(url_draw_cards).json()

    @staticmethod
    def create_pile(deck_id, pile_name, cards_code):
        url = f"{URL_DECK_OF_CARDS_API}deck/{deck_id}/pile/{pile_name}/add/?cards={','.join(cards_code)}"
        return requests.get(url).json()

    @staticmethod
    def show_cards_pile(deck_id, pile_name):
        url = f"{URL_DECK_OF_CARDS_API}deck/{deck_id}/pile/{pile_name}/list/"
        return requests.get(url).json()
    
    @staticmethod
    def remove_all_cards_of_pile(deck_id):
        url = f'{URL_DECK_OF_CARDS_API}deck/{deck_id}/return/'
        return requests.get(url).json()
    
    @staticmethod
    def reshuffle_deck(deck_id):
        url = f'{URL_DECK_OF_CARDS_API}deck/{deck_id}/shuffle/'
        return requests.get(url).json()

    @staticmethod
    def is_response_sucessful(request_response) -> bool:
        return request_response['success']
