from flask import Flask,request
from flask_socketio import SocketIO, join_room, emit
from server.instance import server
from routes.routes import games, get_next_id
from models.game import Game
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
    games.append(Game(id,Player(len(players), username,request.sid)))
    join_room(id)
    server.socketio.emit('room_message',f'{username} has intered on room {id}',to=id)

@server.socketio.on('connect_game')
def create(data):
    username = data['username']
    id = int(data['room'])

    players.append(1)
    games[id-1].add_player(Player(len(players),username,request.sid))
    join_room(id)
    server.socketio.emit('room_message',f'{username} has intered on room {id}',to=id)
    

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

    # by including include_self=False, the message wont be sent to the client that sent the message
    server.socketio.emit('new_message', data)