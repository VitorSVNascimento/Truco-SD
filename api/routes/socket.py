from flask import Flask, request
from flask_socketio import SocketIO, join_room, emit
from server.instance import server
from routes.routes import check_game_by_id, games, get_next_id
from models.game import Game, TEAM_ONE, TEAM_TWO
from models.player import Player

messageCount = 0
players = []


@server.socketio.on('connect')
def test_connect():
    print('connection received')


@server.socketio.on('create_game')
def create(data):
    username = data['username']
    id = get_next_id()
    players.append(1)
    games.append(Game(id, Player(len(players), username, request.sid)))
    join_room(id)
    server.socketio.emit(
        'room_message', f'{username} has created and intered on room {id} on team 1', to=id)
    server.socketio.emit(
        'game_created', {'room': id}, to=request.sid
    )

# @server.socketio.on('connect_game')
# def create(data):
#     username = data['username']
#     id = int(data['room'])

#     players.append(1)
#     games[id-1].add_player(Player(len(players),username,request.sid))
#     games[id-1].add_player(Player(len(players), username, request.sid))
#     join_room(id)
#     server.socketio.emit('room_message',f'{username} has intered on room {id}',to=id)

#     server.socketio.emit(
#         'room_message', f'{username} has intered on room {id}', to=id)


@server.socketio.on('connect_game')
def join(data):
    username = data['username']
    team_id = int(data['team'])
    id = int(data['room'])

    # Verifica se a sala existe.
    if check_game_by_id(id):
        players.append(1)
        
        # Verifica se a sala está cheia.
        if not games[id - 1].is_full():
            team = games[id - 1].add_player(Player(len(players), username, request.sid), team_id if team_id == TEAM_ONE or team_id == TEAM_TWO else None)
            if team:
                join_room(id)
                
                # Entrou no time
                server.socketio.emit(
                    'connect_successfully', {'username':username,'room':id,'team_id':team.id}, to=id)
                server.socketio.emit(
                    'room_message', {'username':username,'room':id,'team_id':team.id}, to=id)
                
            else:
                # Time cheio
                server.socketio.emit(
                    'room_message', f'Team {team_id} on room {id} is full.', to=request.sid)
        else:
            # Sala cheia
            server.socketio.emit(
                'room_message', f'Room {id} is full.', to=request.sid)
    else:
        # Sala inexistente
        server.socketio.emit(
            'room_message', f'Room {id} does not exist.', to=request.sid)

@server.socketio.on('start_game')
def start(data):
    id = int(data['room'])
    print("Opa")
    games[id - 1].start()
    print(games[id - 1].to_json())


@server.socketio.on('send message')
def send_room_message(data):
    room = int(data['room'])
    message = data['message']
    print(server.socketio.server.manager.rooms)
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
