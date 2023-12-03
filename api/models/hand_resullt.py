class HandResult:

    def __init__(self, team_winner,hand_value,next_player):
        self.team_winner = team_winner
        self.hand_value = hand_value
        self.next_player = next_player

    def to_json(self):
        return{
            'team_winner':self.team_winner,
            'hand_value':self.hand_value,
            'next_player':self.next_player

        }