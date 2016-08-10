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

    socket.on('showInput', function (userGuess) {
        console.log('What\'s in the guess box?', userGuess);
        socket.broadcast.emit('guess', userGuess);
    });

    socket.on('userGuess', function (onKeyDown) {
        console.log('guess', onKeyDown);
        socket.broadcast.emit('guess', onKeyDown);
    });

    socket.on('error', function (error) {
        console.log('What is the error? ', error);
    });
});

server.listen(8080);
