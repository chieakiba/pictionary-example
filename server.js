var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

io.on('connection', function (socket) {
    console.log('Client connected');

    socket.on('draw', function (position) {
        socket.broadcast.emit('draw', position);
    });

    socket.on('guess', function (onKeyDown) {
        console.log('What\'s in the guess box?', onKeyDown);
        socket.broadcast.emit('guess', onKeyDown);
    });

    socket.on('showGuess', function (guessBox) {
        console.log('showGuess', guessBox);
        //        userGuess.text(guessBox.val());
        socket.broadcast.emit('showGuess', userGuess);
    });

    socket.on('error', function (error) {
        console.log('What is the error? ', error);
    });
});

server.listen(8080);
