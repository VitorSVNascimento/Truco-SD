from flask import Flask
from flask_socketio import SocketIO
from server.instance import server

messageCount = 0


@server.socketio.on('connect')
def test_connect():
    print('connection received')


@server.socketio.on('message')
def handle_message(data):
    print(f'received message: {data}')
    global messageCount

    # setting the message id
    messageCount += 1
    data['id'] = messageCount

    # by including include_self=False, the message wont be sent to the client that sent the message
    server.socketio.emit('new_message', data)