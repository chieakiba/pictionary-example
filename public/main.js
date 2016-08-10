//global variables
var socket = io();
var guessBox;



var pictionary = function () {
    var canvas, context;
    var drawing;

    var draw = function (position) {
        context.beginPath();
        context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
        context.fill();
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;

    canvas.on('mouseup', function () {
        drawing = false;
    });

    canvas.on('mousedown', function () {
        drawing = true;

        canvas.on('mousemove', function (event) {

            var offset = canvas.offset();
            var position = {
                x: event.pageX - offset.left,
                y: event.pageY - offset.top
            };

            if (drawing) {
                draw(position);
                socket.emit('draw', position);
            } else {
                canvas.unbind('mousedown', 'mousemove');
            }
        });
    });

    socket.on('draw', draw);
};

$(document).ready(function () {
    pictionary();
    var onKeyDown = function (event) {
        if (event.keyCode != 13) { //Enter
            return;
        }
        console.log(guessBox.val());
        guessBox.val('');
        socket.emit('showInput', guessBox);
    };
    socket.on('guess', guessBox);
    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);
});
