from flask_restx import fields

from server.instance import server

new_game = server.api.model('new game',{
    'player_name' : fields.String(description='Nome do Jogador',required=True),
    
})

new_game_return = server.api.model('Id do novo jogo',{
    'game_id' : fields.Integer(description='Id da nova sala criada')
})