
class GameList:
    def __init__(self):
        self.games = []
    
    def get_next_id(self):
        if len(self.games) == 0:
            return 1
        return self.games[-1].id + 1


    def  check_game_by_id(self,id: int) -> bool:
        if id in [game.id for game in self.games]:
            return True
        return False

game_list = GameList()