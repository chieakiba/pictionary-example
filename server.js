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

    socket.on('userGuess', function (guessBox) {
        console.log('What\'s in the guess box?', guessBox);
        socket.broadcast.emit('guess', guessBox);
    });

    socket.on('guess', function (onKeyDown) {
        console.log('userGuess', onKeyDown);
        socket.broadcast.emit('userGuess', onKeyDown);
    });

    socket.on('error', function (error) {
        console.log('What is the error? ', error);
    });
});

server.listen(8080);
