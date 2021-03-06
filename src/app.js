/**
 * NPM Version: 5.6.0
 *    Update npm code: <npm install npm@latest -g>
 * Node.js Version: 9.4.0
 */

// Minimist -- Parse command line arguments into array 'argv'
const argv = require('minimist')(process.argv.slice(2)); // 0th argv is path/to/node, 1st argv is .js file

// Express
const port = argv.port || process.env.PORT || 80; // process.env.PORT is fed by Heroku; 80 is default http port
const express = require('express');
let app = express();
let server = app.listen(port, error => {
    if (error) {
        console.error(error);
    } else {
        console.log('Listening on port ' + port + '\n');
        start();
    }
});
app.use(express.static('./public')); // Set path to static data

// Socket.io Setup
const socketio = require('socket.io');
let io = socketio(server);

// Import Configurations
let config;
try { // Production code in try
    config = require('./config/config.json');
} catch (ex) {
    config = require('./../config/config.json');
}
if (config.project_state !== 'production' && config.project_state !== 'development') {
    console.error('Non-Enumerated Value -- config.project_state should be "production" or "development"');
    console.error('Setting default project state to \'development\'');
    config.project_state = 'development';
}

// Bacter Modules
const Games = require('./Games.js');
const SocketListener = require('./SocketListener.js');

/**
 * Start the server processes
 *    start() is called after Express succeeds in listening to the specified port
 */
function start() {
    let games = new Games(config);

    io.on('connection', socket => { // Listen for clients connecting to socket.io '/' namespace
        let listener = new SocketListener(socket, io, games, config);
        listener.listen(); // Initialize all socket.io emit listeners
        games.setGamesInterval(1000, io); // io is a reference to the io object, so the parameter in setGamesInterval will refer to the same object
    });
}
