//still need to do
//need to listen to other users who join the game
//flag variable

//global variables
var socket = io();

var pictionary = function () {
    var canvas, context;
    var guessBox;
    var drawing;
    var userGuess;
    var drawThis = $('#drawThis');
    var showGuess = $('#userGuess');
    var drawerWord = $('#randomWord');
    var words = ["word", "letter", "number", "person", "pen", "class", "people", "sound", "water", "side", "place", "man", "men", "woman", "women", "boy", "girl", "year", "day", "week", "month", "name", "sentence", "line", "air", "land", "home", "hand", "house", "picture", "animal", "mother", "father", "brother", "sister", "world", "head", "page", "country", "question", "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree", "farm", "story", "sea", "night", "day", "life", "north", "south", "east", "west", "child", "children", "example", "paper", "music", "river", "car", "foot", "feet", "book", "science", "room", "friend", "idea", "fish", "mountain", "horse", "watch", "color", "face", "wood", "list", "bird", "body", "dog", "family", "song", "door", "product", "wind", "ship", "area", "rock", "order", "fire", "problem", "piece", "top", "bottom", "king", "space"];

    //Have users enter their name
    var user = prompt('Enter your username');
    var users = [];
    users.push({
        user: user,
        canDraw: pickOne
    });

    //Have users pick whether they want to be a drawer or guesser
    var pickOne = confirm('Would you like to be the drawer?');

    socket.emit('users', users);

    socket.on('users', function (data) {
        users.push(data);
        console.log('What does this data look like?', data);
        var foundDrawer = false; //Begins with no drawer for the game
        if (pickOne) {

            for (var i = 0; i < users.length; i++) {
                if (users.include(pickOne)) {
                    foundDrawer = true;
                    alert('Sorry someone chose to be the drawer before you.');
                    pickOne = false;
                    users.push({
                        user: user,
                        canDraw: pickOne
                    });
                    socket.emit('updatedUsers', users);
                    console.log('What does the user data look like now?', users);
                }
                socket.on('updatedUsers', function (data) {
                    users.push(data);
                    drawThis.append('Draw this word: ');
                    socket.emit('randomWord', randomWord);
                    //Listens to the randomWord socket broadcast to append the generated random word
                    socket.on('randomWord', function (data) {
                        drawerWord.append(data);
                    });
                });
            }
        } else if (users.include(!pickOne)) {
            //Make a random user in the array to be the drawer and then push that new property key to the array
            var randomDrawer = users[Math.floor(Math.random() * users.length)];
            console.log('Randomly selected drawer', randomDrawer);
            pickOne = true;
            users.push({
                user: user,
                canDraw: pickOne
            });
            socket.emit('updatedUsers', users);
            console.log('What does the array look like after nobody decided to be the drawer?', users);
            socket.on('updatedUsers', function (data) {
                users.push(data);
                drawThis.append('Draw this word: ');
                socket.emit('randomWord', randomWord);
                //Listens to the randomWord socket broadcast to append the generated random word
                socket.on('randomWord', function (data) {
                    drawerWord.append(data);
                });
            });
        }
    });

    socket.on('updatedUsers', function (data) {
        users.push(data);
    });

    //Function to pick random words in the array
    var randomWord = words[Math.floor(Math.random() * words.length)];
    //    drawerWord.append(randomWord);
    socket.emit('drawThis', drawThis);


    //Listens to the drawThis socket broadcast to append 'Draw this word: '
    socket.on('drawThis', function (data) {
        drawThis.append('Draw this word: ');
        socket.on('users', function (data) {
            users = data;
        });
    });



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
            if (drawing && pickOne) {
                draw(position);
                socket.emit('draw', position);
            } else {
                //if the user's mouse is not clicked then unbind the event listeners
                canvas.unbind('mousedown', 'mousemove');
            }
        });
    });
    socket.on('draw', draw);

    //Function for when user hits enter for the guess input
    var onKeyDown = function (event) {
        if (event.keyCode != 13) { //Enter
            return;
        }
        userGuess = guessBox.val();
        console.log(userGuess);
        guessBox.val('');
        showGuess.text(userGuess);
        socket.emit('userGuess', userGuess);
    };

    //Listens to the userGuess socket in the server to show the guesser's guess
    socket.on('userGuess', function (data) {
        showGuess.text(data);
    });
    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);

};

$(document).ready(function () {
    pictionary();
});
