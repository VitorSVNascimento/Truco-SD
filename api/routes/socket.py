from flask import request
from flask_socketio import  join_room, emit
from server.instance import server
from models.game_list import game_list
from models.game import Game, TEAM_ONE, TEAM_TWO,messages_json,SUCCESS,END_HAND,END_ROUND
from models.hand import DRAW
from models.player import Player
from models.hand_resullt import HandResult
from models.card import Card

messageCount = 0
players = []

RM_SUCCESS = 0
RM_TEAM_IS_FULL = 1
RM_ROOM_IS_FULL = 2
RM_ROOM_NOT_EXIST = 3

@server.socketio.on('connect')
def test_connect():
    print('connection received')


@server.socketio.on('create_game')
def create(data):
    username = data['username']
    id = game_list.get_next_id()
    players.append(1)
    game_list.games.append(Game(id, Player(len(players), username, request.sid)))
    game_list.sids[request.sid] = id
    join_room(id)
    team_userNames = []
    for team in game_list.games[id - 1].teams:
        team_list = []
        for player in team.players:
            team_list.append(player.name)  
        team_userNames.append(team_list)

    server.socketio.emit(
        'room_message', {'username' : username, 'message' : f'{username} has created and intered on room {id} on team 1'}, to=id)
    server.socketio.emit(
        'connect_successfully', {'username':username, 'players':team_userNames,'room':id}, to=id)

@server.socketio.on('connect_game')
def join(data):
    username = data['username']
    team_id = int(data['team'])
    id = int(data['room'])

    # Verifica se a sala existe.
    if game_list.check_game_by_id(id):
        players.append(1)
        
        # Verifica se a sala está cheia.
        if not game_list.games[id - 1].is_full():
            playName = game_list.games[id - 1].add_player(Player(len(players), username, request.sid), team_id if team_id == TEAM_ONE or team_id == TEAM_TWO else None)
            game_list.sids[request.sid] = id
            if playName:
                join_room(id)
                
                team_userNames = []
                for team in game_list.games[id - 1].teams:
                    team_list = []
                    for player in team.players:
                      team_list.append(player.name)  
                    team_userNames.append(team_list)
                # Entrou no time
                server.socketio.emit(
                    'connect_successfully', {'username':playName, 'players':team_userNames,'room':id}, to=id)
                server.socketio.emit(
                    'room_message', {'status': RM_SUCCESS, 'message': f'{playName} has created and intered on room {id} '}, to=id)
                
            else:
                # Time cheio
                server.socketio.emit(
                    'room_message', {'status': RM_TEAM_IS_FULL, 'message': f'Team {team_id} on room {id} is full'}, to=request.sid)
        else:
            # Sala cheia
            server.socketio.emit(
                'room_message', {'status': RM_ROOM_IS_FULL, 'message': f'Room {id} is full.'}, to=request.sid)
    else:
        # Sala inexistente
        server.socketio.emit(
            'room_message', {'status': RM_ROOM_NOT_EXIST, 'message': f'Room {id} does not exist.'}, to=request.sid)

@server.socketio.on('start_game')
def start():
    id = game_list.sids[request.sid]
    if request.sid == game_list.games[id - 1].owner.sid:
        game_list.games[id - 1].start()
        [server.socketio.emit('your_cards',{"cards": player.cards_to_json()["cards"], "round_order": game_list.games[id - 1].player_order_to_json()},to=player.sid) for player in game_list.games[id - 1].player_order if not player.name.startswith('BOT')]
    else:
        server.socketio.emit(
        'room_message', f'Apenas o dono pode iniciar a partida', to=request.sid)

@server.socketio.on('throw_card')
def throw(data):
    id = game_list.sids[request.sid]
    card_code = data['card_code']
    for player in game_list.games[id - 1].player_order:
        if player.sid == request.sid:
            
            card = Card(card_code)
            result = game_list.games[id -1].throw_card(card,player.name)
            if isinstance(result,HandResult):
                server.socketio.emit('throwed_card',{'username' : player.name,'card':card.to_json()},to=id)
                server.socketio.emit('end_hand',{'new_order':game_list.games[id -1].player_order_to_json()['player_order'],
                                                 'score':game_list.games[id -1].get_score(),'winner':result.team_winner.id},to=id)
                [server.socketio.emit('your_cards',player.cards_to_json(),to=player.sid) for player in game_list.games[id - 1].player_order if not player.name.startswith('BOT')]
                return
            if isinstance(result,Player) or result == DRAW: 
                server.socketio.emit('throwed_card', {'username' : player.name, 'card' : card.to_json()}, to=id)
                server.socketio.emit('end_round',{'team':game_list.games[id -1].find_player_team(result).id if result != DRAW else DRAW,
                                                  'new_order':game_list.games[id -1].player_order_to_json()['player_order']},to=id)
                [server.socketio.emit('your_cards',player.cards_to_json(),to=player.sid) for player in game_list.games[id - 1].player_order if not player.name.startswith('BOT')]
                return

            server.socketio.emit('throwed_card', {'username' : player.name, 'card' : card.to_json()}, to=id)
            

@server.socketio.on('send message')
def send_room_message(data):
    room = game_list.sids[request.sid]
    message = data['message']
    emit('room_message', message, to=room)


@server.socketio.on('message')
def handle_message(data):
    print(f'received message: {data}')
    global messageCount

    # setting the message id
    messageCount += 1
    data['id'] = messageCount

    room = int(data['room'])

    # by including include_self=False, the message wont be sent to the client that sent the message
    server.socketio.emit('new_message', data, to=room)

@server.socketio.on('call_truco')
def call_truco():
    print('Chegou no call_truco!')
    id = game_list.sids[request.sid]
    player = game_list.games[id - 1].get_player_sid(request.sid)
    opponent = game_list.games[id-1].call_truco(player)

    print(player.to_json())
    print(opponent.to_json())
    [server.socketio.emit('receive_truco',{'username': player.name},to=opponent_player.sid) for opponent_player in opponent.players]

@server.socketio.on('accept_truco')
def accept_truco():
    id = game_list.sids[request.sid]
    player = game_list.games[id - 1].get_player_sid(request.sid)
    result = game_list.games[id -1].truco_response(1, player)

    if result == 1:
        server.socketio.emit("accepted_truco", to=id)
    elif result == 2:
        server.socketio.emit("declined_truco", to=id)
    

@server.socketio.on('decline_truco')
def decline_truco():
    pass