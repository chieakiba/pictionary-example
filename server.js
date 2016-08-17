var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

//var pickOne = confirm('Would you like to be the drawer?');

io.on('connection', function (socket) {
    console.log('Client connected');

    //how do you know when someone logs on? Need to store some data on the server. Right now the second person doesn't have anyway to know about the first person

    socket.on('user joined', function (user) {
        console.log('Who joined this game?', user);
        socket.broadcast.emit('user joined', user);
    });

    socket.on('check this user', function (users) {
        console.log('Show me what\'s inside:', users);
        if (pickOne) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].canDraw) {
                    pickOne = false;
                    users.push(user);
                }
            }
        }
        socket.broadcast.emit('users', users);
    });

    socket.on('drawThis', function (drawThis) {
        socket.broadcast.emit('drawThis', drawThis);
    });

    socket.on('randomWord', function (randomWord) {
        console.log('randomWord', randomWord);
        socket.broadcast.emit('randomWord', randomWord);
    });

    socket.on('drawer', function (drawer) {
        socket.broadcast.emit('drawer', drawer);
    });

    socket.on('draw', function (position) {
        socket.broadcast.emit('draw', position);
    });

    socket.on('userGuess', function (userGuess) {
        console.log('What\'s in the guess box?', userGuess);
        socket.broadcast.emit('userGuess', userGuess);
    });

    socket.on('error', function (error) {
        console.log('What is the error? ', error);
    });

    socket.on('disconnect', function () {
        console.log('A user has disconnected');
    });
});

server.listen(process.env.PORT || 8080);
