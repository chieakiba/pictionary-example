var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var curatedUsers = [];

io.on('connection', function (socket) {
    console.log('Client connected');

    socket.on('user joined', function (user) {
        curatedUsers.push(user);
        socket.broadcast.emit('user joined', user);
    });

    socket.on('check this user', function (users) {
        if (curatedUsers.length > 0) {
            for (var j = 0; j < curatedUsers.length; j++) {
                if (curatedUsers[j].canDraw) {
                    break;
                }
            }

            //Check to see how many other users chose to be the drawer
            for (var k = 0; k < curatedUsers.length; k++) {
                if (curatedUsers[j].canDraw && k != j) {
                    curatedUsers[k].canDraw = false; //Gets rid of the other users' ability to draw
                }
            }

            //Emits a message to the user who can't draw
            socket.broadcast.emit('not drawer', 'Sorry! Someone else already chose to draw!');

            //New curatedUsers array
            console.log("New array", curatedUsers);
        }
        socket.broadcast.emit('users', curatedUsers);
    });

    socket.on('chose not to be a drawer', function (data) {
        console.log('Double check this person', data);
        socket.broadcast.emit('should be a guesser', data);
    });

    socket.on('final user array', function (finalizedList) {
        console.log('Show me the finalized list', finalizedList);
        socket.broadcast.emit('final list', finalizedList);
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
