//global variables
var socket = io();

var pictionary = function () {
    var canvas, context;
    var guessBox;
    var drawing;
    var userGuess;
    var showGuess;
    var broadcastGuess;

    //Function for when user hits enter for the guess input
    var onKeyDown = function (event) {
        if (event.keyCode != 13) { //Enter
            return;
        }
        userGuess = guessBox.val();
        console.log(userGuess);
        guessBox.val('');
        broadcastGuess = showGuess.text(userGuess);

        socket.emit('userGuess', userGuess);
    };
    socket.on('userGuess', function (data) {
        showGuess.text(data);
    });
    showGuess = $('#userGuess');
    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);

    //When user draws in the canvas
    var draw = function (position) {
        context.beginPath();
        context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
        context.fill();
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;

    //When user unclicks the mouse
    canvas.on('mouseup', function () {
        drawing = false;
    });

    //When user clicks the mouse
    canvas.on('mousedown', function () {
        drawing = true;

        //When user moves the mouse
        canvas.on('mousemove', function (event) {
            var offset = canvas.offset();
            var position = {
                x: event.pageX - offset.left,
                y: event.pageY - offset.top
            };

            //if user's mouse is clicked, draw in the canvas
            if (drawing) {
                draw(position);
                socket.emit('draw', position);
            } else {
                //if the user's mouse is not clicked then unbind the event listeners
                canvas.unbind('mousedown', 'mousemove');
            }
        });
    });
    socket.on('draw', draw);
};

$(document).ready(function () {
    pictionary();
});
