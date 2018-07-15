var express = require('express');
var app = express();
var http = require('http').Server(app);
var server = require('socket.io')(http);

var players = [];

app.use(express.static('client'));

app.get('/', function(req, res) {
     res.sendFile(__dirname + '/index.html');
});

server.on('connection', function(client) {
    client.on('socketSend', function(data) {
        if (data.type == 'Connect') {
            players.push(client);
            client.emit('serverMessage', { type:'ConnectionResponse', playerCount: players.length - 1, socketID: client.id });
        } else if (data.type == 'Disconnect') {
            client.disconnect();
        } else {
            if (data.target[0] == 'all') {
                server.emit('serverMessage', data);
            } else if (data.target[0] == 'broadcast') {
                client.broadcast.emit('serverMessage', data);
            } else {
                var i;
                for (i = 0; i < data.target.length; i++) {
                    server.to(data.target[i]).emit('serverMessage', data);
                }
            }
        }
    });
              
    client.on('disconnect', function() {
        var i = players.indexOf(client);
        players.splice(i, 1);
        server.emit('serverMessage', { type: 'PlayerDisconnection', socketID: client.id });
    });
});

http.listen(0.0.0.0, function(){
});