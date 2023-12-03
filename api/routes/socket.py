from flask import request
from flask_socketio import  join_room, emit
from server.instance import server
from models.game_list import game_list
from models.game import Game, TEAM_ONE, TEAM_TWO
from models.player import Player
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
        [server.socketio.emit('your_cards',player.cards_to_json(),to=player.sid) for player in game_list.games[id - 1].player_order if not player.name.startswith('BOT')]
        server.socketio.emit('round_order',game_list.games[id - 1].player_order_to_json(),to=id)
    else:   
        server.socketio.emit(
        'room_message', f'Apenas o dono pode iniciar a partida', to=request.sid)

@server.socketio.on('throw_card')
def throw(data):
    id = game_list.sids[request.sid]
    card_code = data['card_code']
    for player in game_list.games[id - 1].player_order:
        if player.sid == request.sid:
            result = game_list.games[id -1].throw_card()
            if result is not None:
                card = Card(card_code)
                server.socketio.emit("throwed_card", {'username' : player.name, 'card' : card.to_json()}, to=id)

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
