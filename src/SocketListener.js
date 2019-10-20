const Permissions = require('./Permissions.js');

class SocketListener {
   constructor(socket, io, config) {
      this.socket = socket;
      this.io = io;
      this.config = config;
   }

   /**
   * Listen for a new connection to the socketio server
   *    Initialize all other socketio listeners
   */
   listen(games) {
      games.connections++;
      if (this.config.project_state === 'development') console.log('Client connected:     ' + this.socket.id + ' (' + games.connections + ')'); // Server Message

      this.socket.join('Lobby'); // Join 'Lobby' room in '/' namespace
      this.socket.emit('Games', { games: games.list, connections: games.connections }); // Copied from 'Games Request'

      // Socket Management
      this.listen_disconnect(games);

      // Control Flow
      this.listen_leave_game(games);
      this.listen_game_ended(games);
      this.listen_create_game(games);
      this.listen_create_password(games);
      this.listen_ask_permission(games);
      this.listen_check_permission(games);
      this.listen_player_joined(games);
      this.listen_spectator_joined(games);
      this.listen_spectator_left(games);
      this.listen_end_round(games);
      this.listen_round_delay(games);
      this.listen_dead(games);

      // Data Congruence
      this.listen_board(games);
      this.listen_org(games);
      this.listen_game(games);
      this.listen_teams(games);
      this.listen_flag(games);
      this.listen_ability(games);

      // Ability Transmission
      this.listen_abilities();

      // Miscellaneous
      this.listen_error();
      this.listen_test();
   }

   /**
    * Listen for the test event from client
    */
   listen_test() {
      this.socket.on('Test', (data, callback) => {
         console.log('Test Successful');
         callback(data);
      });
   }

   /**
    * Listen for the socketio error event
    */
   listen_error() {
      this.socket.on('error', error => {
         console.error('Error -- socket.io:\n', error);
      });
   }

   /**
   * Listen for the socket disconnect
   */
   listen_disconnect(games) {
      this.socket.on('disconnect', () => {
         games.connections--;
         if (this.config.project_state === 'development') console.log('Client disconnected:  ' + this.socket.id + ' (' + games.connections + ')'); // Server Message

         // End Hosted Game
         for (let i = 0; i < games.count; i++) {
            if (games.list[i].info.host === this.socket.id) { // If player is host
               this.io.to(games.list[i].info.title).emit('Game Ended', games.list[i]); // Remove Players From Hosted Game
               for (let j = 0; j < games.list[i].players.length; j++) {
                  for (let k = 0; k < this.io.sockets.sockets.length; k++) {
                     if (games.list[i].players[j] === this.io.sockets.sockets[k].id) {
                        this.io.sockets.sockets[k].leave(games.list[i].info.title);
                        break;
                     }
                  }
               }
               for (let j = 0; j < games.list[i].spectators.length; j++) {
                  for (let k = 0; k < this.io.sockets.sockets.length; k++) {
                     if (games.list[i].spectators[j] === this.io.sockets.sockets[k].id) {
                        this.io.sockets.sockets[k].leave(games.list[i].info.title);
                        break;
                     }
                  }
               }
               if (this.config.project_state === 'development') console.log('                                               Game Deleted: ' + games.list[i].info.title + ' (' + games.list[i].info.host + ')'); // Before game deletion so game info can be attained before it is deleted
               let password_count = games.securities.length;
               for (let j = 0; j < password_count; j++) {
                  if (games.securities[j].title === games.list[i].info.title) {
                     games.securities.splice(j, 1);
                     break;
                  }
               }
               games.list.splice(i, 1); // Delete Game
               clearInterval(games.intervals[i]); // Clear Game Interval
               games.intervals.splice(i, 1);
               break; // User can only host one game
            } else { // If player is not host
               let game_count = games.count;
               for (let g = 0; g < game_count; g++) { // Search games.list for the game this socket is in
                  let game;

                  let user_found = false;
                  let user_count = games.list[g].board.list.length;
                  for (let p = 0; p < user_count; p++) { // Find user in the user list (board.list) in the currently iterated game
                     if (this.socket.id === games.list[g].board.list[p]) {
                        game = games.list[g];
                        user_found = true;
                        break;
                     }
                  }
                  if (! user_found) continue; // If user is not found in this game's users list, continue searching in the next game

                  this.socket.leave(game.info.title); // Leave 'Game' Room

                  let player_count = games.list[g].players.length;
                  for (let l = 0; l < player_count; l++) { // Search leaderboard rather than players and spectators because players and spectators both have place on leaderboard
                     if (games.list[g].board.list[l].player === this.socket.id) { // Find player in leaderboard
                        games.list[g].board.list.splice(l, 1); // Remove player from leaderboard
                        break;
                     }
                  }

                  let is_player = false;
                  for (let p = 0; p < player_count; p++) { // Search players array to determine if user is a player or not
                     if (games.list[g].players[p] === this.socket.id) { // Find Player
                        is_player = true;

                        if (games.list[g].teams.length > 0) { // If is a team game, remove player from team
                           let team = games.list[g].teams[teamColors.indexOf(games.list[g].orgs[p].team)]; // Identify player's team
                           team.splice(team.indexOf(this.socket.id), 1); // Remove player from team
                        }
                        games.list[g].players.splice(p, 1); // Remove player from game's players list
                        games.list[g].orgs.splice(p, 1); // Remove player's org from game's orgs list (Orgs array should be indexed identically to players array)
                        games.list[g].abilities.splice(p, 1); // Remove player's abilities from game's abilities list (Abilities array should be indexed identically to players array)
                        games.list[g].info.count--; // Reduce the number of players in the game

                        if (this.config.project_state === 'development') console.log('                                               Player Left: ' + games.list[g].info.title + ' (' + this.socket.id + ')');
                        break;
                     }
                  }
                  if (! is_player) { // If user is a spectator
                     for (let s = 0; s < games.list[g].spectators.length; s++) { // Search Spectators
                        if (games.list[g].spectators[s] === this.socket.id) { // Find Spectator
                           games.list[g].spectators.splice(s, 1);

                           if (this.config.project_state === 'development') console.log('                                               Spectator Left: ' + games.list[g].info.title + ' (' + this.socket.id + ')');
                           break;
                        }
                     }
                  }
               }
            }
         }
      });
   }

   /**
    * Listen for leave game event from client
    */
   listen_leave_game(games) {
      this.socket.on('leave game', (game) => {
         if (game.info.host === this.socket.id) { // If player is host
            this.io.to(game.info.title).emit('Game Ended', game); // Copied from 'Game Ended'
            this.socket.leave(game.info.title);

            let password_count = games.securities.length;
            for (let i = 0; i < password_count; i++) {
               if (games.securities[i].title === game.info.title) {
                  games.securities.splice(i, 1); // Remove game from securities array
                  break;
               }
            }
            if (this.config.project_state === 'development') console.log('                                               Game Deleted: ' + game.info.title + ' (' + game.info.host + ')'); // Before game deletion so game info can be attained before it is deleted

            let game_count = games.count;
            for (let i = 0; i < game_count; i++) {
               if (games.list[i].info.host === game.info.host) {
                  games.list.splice(i, 1); // Delete Game
                  clearInterval(games.intervals[i]); // Clear Game Interval
                  games.intervals.splice(i, 1); // Remove game interval from intervals array
                  break;
               }
            }
         } else { // If player is not host
            this.socket.leave(game.info.title); // Leave 'Game' Room

            let game_count = games.count;
            for (let g = 0; g < game_count; g++) { // Search games.list for the game this socket is in
               if (games.list[g].title !== game.info.title) continue; // Match game with the game the player was in

               let player_count = games.list[g].players.length;

               for (let l = 0; l < player_count; l++) { // Search leaderboard rather than players and spectators because players and spectators both have place on leaderboard
                  if (games.list[g].board.list[l].player === this.socket.id) { // Find player in leaderboard
                     games.list[g].board.list.splice(l, 1); // Remove player from leaderboard
                     break;
                  }
               }

               let is_player = false;
               for (let p = 0; p < player_count; p++) { // Search players array to determine if user is a player or not
                  if (games.list[g].players[p] === this.socket.id) { // Find Player
                     is_player = true;

                     if (games.list[g].teams.length > 0) { // If is a team game, remove player from team
                        let team = games.list[g].teams[teamColors.indexOf(games.list[g].orgs[p].team)]; // Identify player's team
                        team.splice(team.indexOf(this.socket.id), 1); // Remove player from team
                     }
                     games.list[g].players.splice(p, 1); // Remove player from game's players list
                     games.list[g].orgs.splice(p, 1); // Remove player's org from game's orgs list (Orgs array should be indexed identically to players array)
                     games.list[g].abilities.splice(p, 1); // Remove player's abilities from game's abilities list (Abilities array should be indexed identically to players array)
                     games.list[g].info.count--; // Reduce the number of players in the game

                     if (this.config.project_state === 'development') console.log('                                               Player Left: ' + games.list[g].info.title + ' (' + this.socket.id + ')');
                     break;
                  }
               }
               if (! is_player) { // If user is a spectator
                  for (let s = 0; s < games.list[g].spectators.length; s++) { // Search Spectators
                     if (games.list[g].spectators[s] === this.socket.id) { // Find Spectator
                        games.list[g].spectators.splice(s, 1);

                        if (this.config.project_state === 'development') console.log('                                               Spectator Left: ' + games.list[g].info.title + ' (' + this.socket.id + ')');
                        break;
                     }
                  }
               }
            }
         }
      });
   }

   /**
    * Listen for game ended event from client
    */
   listen_game_ended(games) {
      this.socket.on('Game Ended', (game) => {
         if (game.info.host === this.socket.id) {
            this.io.to(game.info.title).emit('Game Ended', game);
            this.io.of('/').in(game.info.title).clients((error, ids) => { // Get each client in room
               let client_count = ids.length;
               for (let i = 0; i < client_count; i++) {
                  io.sockets.sockets[ids[i]].leave(game.info.title); // Direct each player to leave the room
               }
            });

            if (game.info.protected) { // If game is protected by a password, remove the security info from the securities array
               let password_count = games.securities.length;
               for (let p = 0; p < password_count; p++) {
                  if (games.securities[p].title === game.info.title) { // Find game's security info and remove it
                     games.securities.splice(p, 1);
                     // p--; // Unnecessary since already breaking from the loop, but if break is not here, this may cause a difficult bug to find
                     break;
                  }
               }
            }

            let game_count = games.count;
            for (let g = 0; g < game_count; g++) {
               if (games.list[g].info.host === game.info.host) {
                  games.list.splice(g, 1); // Delete Game
                  clearInterval(games.intervals[g]); // Clear Game Interval
                  games.intervals.splice(g, 1);
                  // g--; // Unnecessary since already breaking from the loop, but if break is not here, this may cause a difficult bug to find
                  break;
               }
            }

            if (this.config.project_state === 'development') console.log('                                               Game Deleted: ' + game.info.title + ' (' + game.info.host + ')'); // Before game deletion so game info can be attained before it is deleted
         }
      });
   }

   /**
    * Listen for create game event from client
    */
   listen_create_game(games) {
      /**
       * Create a game instance on the server and emit it to all clients
       * @param data {Map} game object
       */
      this.socket.on('create game', (game) => {
         games.createGame(game, this.socket.id, this.io);

         this.socket.leave('Lobby'); // Leave 'Lobby' Room (this.socket.io)
         this.socket.join(game.info.title); // Join 'Game' Room (this.socket.io)
      });
   }

   /**
    * Listen for create password event from client
    * @param {Games} games Game instance
    */
   listen_create_password(games) {
      this.socket.on('create password', (data) => {
         let permissions = new Permissions(data.info.title, data.pass);
         permissions.permiss(this.socket.id);
         games.securities.push(permissions);
      });
   }

   /**
    * Verify Password on Join or Spectate
    *    Callback with argument 'true' if client is permissed, else callback 'false'
    */
   listen_ask_permission(games) {
      this.socket.on('Ask Permission', (data, callback) => {
         let len = games.securities.length;
         for (let i = 0; i < len; i++) {
            let permissions = games.securities[i];
            if (data.info.title === permissions.title &&
               data.pass === permissions.password) {
               permissions.permiss(this.socket.id);
               callback(true);
            }
         }
         callback(false);
      });
   }

   /**
    * Check if the player is permitted entry into game
    */
   listen_check_permission(games) {
      /**
       * Check if the player is permitted entry into a game
       *    Responds to the client with a callback specified by the client
       * @param  {Map}      data      {
       *                                 title: Corresponds to game.info.title
       *                              }
       * @param  {Function} callback  Will be called with a resultant value fed as an argument
       *                                 Run by the client after called on the server
       */
      this.socket.on('Check Permission', (data, callback) => {
         let has_password = false;
         let granted = false;
         let secured_count = games.securities.length;

         for (let i = 0; i < secured_count; i++) {
            if (games.securities[i].title === data.title) { // Identify game
               has_password = true;
               if (games.securities[i].isPermissed(this.socket.id)) {
                  granted = true;
               }
               break;
            }
         }

         if (!has_password || granted) {
            callback('permission granted');
         } else { // (has_password && !granted)
            callback('permission denied');
         }
      });
   }

   /**
    * Listen for player joined event from client
    */
   listen_player_joined(games) {
      /**
       * Player Joined emit listener
       * @param  data {Map} {
       *                       info: game.info,
       *                       org: org,
       *                       ability: ability
       *                    }
       */
      this.socket.on('Player Joined', (data) => {
         let len = games.count;
         for (let i = 0; i < len; i++) {
            if (games.list[i].info.host === data.info.host) {
               this.socket.leave('Lobby'); // Leave 'Lobby' Room
               this.socket.join(data.info.title); // Join 'Game' Room
               games.list[i].players.push(this.socket.id); // Add player to server's list of players in game
               games.list[i].orgs.push(data.org); // Create server instance of compressed org (no functions)
               games.list[i].abilities.push(data.ability); // Create server instance of ability
               games.list[i].info.count = games.list[i].orgs.length;

               this.socket.emit('enter');
               if (this.config.project_state === 'development') console.log('                                               Player Spawned: ' + games.list[i].info.title + ' (' + this.socket.id + ')');
               break;
            }
         }
      });
   }

   /**
    * Listen for spectator joined event from client
    * @return {void}
    */
   listen_spectator_joined(games) {
      this.socket.on('Spectator Joined', (game) => {
         const game_count = games.count;
         for (let g = 0; g < game_count; g++) {
            if (games.list[g].info.host === game.info.host) {
               this.socket.leave('Lobby'); // Leave 'Lobby' Room
               this.socket.join(game.info.title); // Join 'Game' Room
               games.list[g].spectators.push(this.socket.id);
               if (this.config.project_state === 'development') console.log('                                               Spectator Spawned: ' + games.list[g].info.title + ' (' + this.socket.id + ')');
               break;
            }
         }
      });
   }

   /**
    * Listen for spectator left event from client
    * @return {void}
    */
   listen_spectator_left(games) {
      this.socket.on('Spectator Left', (data) => { // data is game.info
         const game_count = games.count;
         outer:
         for (let g = 0; g < game_count; g++) {
            if (games.list[g].info.host === data.host) {
               let spectator_count = games.list[g].spectators.length;
               for (let s = 0; s < spectator_count; s++) {
                  if (games.list[g].spectators[s] === this.socket.id) {
                     games.list[g].spectators.splice(s, 1);
                     break outer;
                  }
               }
            }
         }
      });
   }

   /**
    * Listen for end round event from client
    */
   listen_end_round(games) {
      /**
       * End Round
       *    Received upon round of survival ending after only one player stands (or zero if multiple die on same tick)
       * @param  {Object} data: game.info
       * @return {void}
       */
      this.socket.on('End Round', (data) => { // data is game.info
         const game_count = games.count;
         for (let g = 0; g < game_count; g++) {
            if (games.list[g].info.host === data.host) { // Identify game
               games.list[g].rounds.waiting = false;
               games.list[g].rounds.delayed = true;
               games.list[g].rounds.delaystart = (new Date()).valueOf();
               break;
            }
         }

         let delay = setTimeout(() => { // End of round delay
            const game_count = games.count;
            for (let g = 0; g < game_count; g++) {
               if (games.list[g].info.host === data.host) {
                  games.list[g].rounds.waiting = true;
                  games.list[g].rounds.delayed = false;
                  break;
               }
            }
            this.io.in(data.title).emit('Force Spawn');
         }, this.config.delay_time);

         if (data.mode === 'srv') {
            for (let s = 0; s < games.shrinkIntervals.length; s++) {
               if (games.shrinkIntervals[s].host === data.host) { // Identify shrink interval
                  clearInterval(games.shrinkIntervals[s].interval);

                  const game_count = games.count;
                  for (let g = 0; g < game_count; g++) {
                     if (games.list[g].info.host === data.host) {
                        games.list[g].world.width = games.shrinkIntervals[s].width; // games.shrinkIntervals[s].world is preserved from 'Round Delay'
                        games.list[g].world.height = games.shrinkIntervals[s].height; // Reset world width and height
                        break;
                     }
                  }
                  games.shrinkIntervals.splice(s, 1); // Remove shrink interval
                  break;
               }
            }
         }
      });
   }

   /**
    * Listen for round delay event from client
    */
   listen_round_delay(games) {
      this.socket.on('Round Delay', (game) => {
         const game_count = games.count;
         for (let g = 0; g < game_count; g++) {
            if (games.list[g].info.host === game.info.host) { // Identify game
               games.list[g].rounds.waiting = true;
               games.list[g].rounds.delayed = true;
               games.list[g].rounds.delaystart = (new Date()).valueOf();
               break;
            }
         }
         let delay = setTimeout(() => {
            const game_count = games.count;
            for (let g = 0; g < game_count; g++) {
               if (games.list[g].info.host === game.info.host) { // Identify game
                  games.list[g].rounds.waiting = false; // Start Round
                  games.list[g].rounds.delayed = false;
                  if (game.info.mode === 'srv') { // If is survival mode
                     games.shrinkIntervals.push({ // Shrink the world
                        host: game.info.host,
                        width: game.world.width, // Preserve initial width of world
                        height: game.world.height, // Preserve initial height of world
                        interval: setInterval(() => {
                           const game_count = games.count;
                           for (let g = 0; g < game_count; g++) {
                              if (games.list[g].info.host === game.info.host && (games.list[g].world.width > 200 && games.list[g].world.height > 200)) { // Identify game; If both dimensions are greater than minimum
                                 games.list[g].world.width -= config.shrink_rate;
                                 games.list[g].world.height -= config.shrink_rate;
                                 games.list[g].world.x += config.shrink_rate / 2; // World shrinks to center
                                 games.list[g].world.y += config.shrink_rate / 2;
                                 break;
                              }
                           }
                        }, this.config.render_frequency) // Same frequency as game interval
                     });
                  }
                  games.list[g].rounds.start = (new Date()).valueOf();
                  break;
               }
            }
         }, this.config.delay_time);
         let spawndelay = setTimeout(() => { // Force spawns 1 second before round starts so one player does not join before the others and automatically win game
            this.io.in(game.info.title).emit('Force Spawn');
         }, this.config.delay_time - 1000);
      });
   }

   /**
    * Listen for board event from client
    *    Update server-side board data
    */
   listen_board(games) {
      this.socket.on('Board', (data) => { // data: { list: board.list, host: game.board.host }
         const game_count = games.count;
         for (let g = 0; g < game_count; g++) {
            if (games.list[g].info.host === data.host) { // Find board's game
               games.list[g].board.list = data.list; // Update server leaderboard list
               break;
            }
         }
      });
   }

   /**
    * Listen for org event from client
    *    Update server-side org data
    */
   listen_org(games) {
      /*
       * Update Server Org
       * @param data: {
       *     cells: org.cells,
       *     off: org.off,
       *     pos: org.pos,
       *     color: org.color,
       *     skin: org.skin,
       *     team: org.team,
       *     coefficient: org.coefficient,
       *     range: org.range
       *  }
       */
      this.socket.on('Org Update', (data) => { // data is an array in order to decrease json data sent over web this.socket
         let done = false;
         const game_count = games.count;

         outer:
         for (let i = 0; i < game_count; i++) {
            const org_count = games.list[i].orgs.length;
            for (let j = 0; j < org_count; j++) {
               if (games.list[i].orgs[j].player === this.socket.id) {
                  // games.list[i].orgs[j] = org; // Latency is decreased by only sending necessary data rather than the entire org object
                  games.list[i].orgs[j].cells = data.cells; // Only the following attributes of org need to be updated and shared
                  games.list[i].orgs[j].count = data.cells.length;
                  games.list[i].orgs[j].off = data.off;
                  games.list[i].orgs[j].pos = data.cursor;
                  games.list[i].orgs[j].color = data.color;
                  games.list[i].orgs[j].skin = data.skin;
                  games.list[i].orgs[j].team = data.team;
                  games.list[i].orgs[j].coefficient = data.coefficient;
                  games.list[i].orgs[j].range = data.range;
                  break outer;
               }
            }
         }
      });
   }

   /**
    * Listen for ability event from client
    */
   listen_ability(games) {
      this.socket.on('Ability', (ability) => {
         let done = false;
         const game_count = games.count;
         outer:
         for (let g = 0; g < game_count; g++) {
            const player_count = games.list[g].info.count;
            for (let p = 0; p < player_count; p++) {
               if (games.list[g].abilities[p].player === this.socket.id) { // Find ability of this.socket
                  games.list[g].abilities[p] = ability;
                  break outer;
               }
            }
         }
      });
   }

   /**
    * Listen for game event from client
    */
   listen_game(games) {
      this.socket.on('game', (data) => { // data: { game: {} } (data object literal exists rather than just 'game' to allow for customization of input beyond 'game')
         const game_count = games.count;
         for (let g = 0; g < game_count; g++) {
            if (games.list[g].info.host === data.game.host) {
               games.list[g] = data.game;
               break;
            }
         }
      });
   }

   /**
    * Listen for team event from client
    */
   listen_teams(games) {
      this.socket.on('Teams', (data) => { // data: { teams: game.teams, host: game.info.host }
         const game_count = games.count;
         for (let g = 0; g < game_count; g++) {
            if (games.list[g].info.host === data.host) { // Identify game
               games.list[g].teams = data.teams; // All data in teams array must be updated
               break;
            }
         }
      });
   }

   /**
    * Listen for flag event from client
    */
   listen_flag(games) {
      /**
       * Update the server's instance of game's flag
       * @param {Object} data {
       *       flag: game.flag,
       *       host: game.info.host
       *    }
       */
      this.socket.on('Flag', (data) => { // Be careful
         const game_count = games.count;
         for (let g = 0; g < game_count; g++) {
            if (games.list[g].info.host === data.host) {
               games.list[g].flag = data.flag;
               break;
            }
         }
      });
   }

   /**
    * Listen for dead event from client
    */
   listen_dead(games) {
      this.socket.on('Dead', (spectating) => {
         const game_count = games.count;
         outer:
         for (let g = 0; g < game_count; g++) {
            if (games.list[g].players.indexOf(this.socket.id) !== -1) {
               const player_count = games.list[g].players.length;
               for (let p = 0; p < player_count; p++) { // Do not use games.list[g].info.count server-side (orgs.length may change before count changes)
                  if (games.list[g].players[p] === this.socket.id) {
                     games.list[g].players.splice(p, 1); // User is no longer a player, but a spectator
                     games.list[g].abilities.splice(p, 1); // Abilities array should be indexed identically to players array
                     games.list[g].orgs.splice(p, 1); // Orgs array should be indexed identically to players array
                     games.list[g].info.count--; // One less player in the game
                     if (spectating) {
                        this.socket.emit('Spectate'); // Dead player becomes spectator
                     }
                     break outer;
                  }
               }
            }
         }
      });
   }

   /**
    * Listen for ability events from client
    * The client emitting the event is requesting to the server that his ability be applied to either himself or an opponent
    *    Standard: Extend, Compress, Immortality, Freeze, Neutralize, Toxin, Spore
    *    Special: Tag
    *    Old: Speed, Slow, Stimulate, Poison
    */

   listen_abilities() {
      /**
       * Emit an ability to the specified player
       * @param {String} ability The ability to be applied
       *                            First letter is capitalized
       * @param {String} player The player to whom the ability will be applied
       *                           Corresponds to a socket.id String in the player's game's org array
       */
      function emit_ability(ability, player) {
         if (player === this.socket.id) {
            this.socket.emit(ability);
         } else {
            this.socket.to(player).emit(ability);
         }
      }

      this.socket.on('Extend', player => emit_ability('Extend', player));
      this.socket.on('Compress', player => emit_ability('Compress', player));
      this.socket.on('Immortality', player => emit_ability('Immortality', player));
      this.socket.on('Freeze', player => emit_ability('Freeze', player));
      this.socket.on('Neutralize', player => emit_ability('Neutralize', player));
      this.socket.on('Toxin', player => emit_ability('Toxin', player));
      this.socket.on('Tag', player => emit_ability('Tag', player)); // UNRELEASED
      // this.socket.on('Speed', player => emit_ability('Speed', player)); // OLD
      // this.socket.on('Slow', player => emit_ability('Slow', player)); // OLD
      // this.socket.on('Stimulate', player => emit_ability('Stimulate', player)); // OLD
      // this.socket.on('Poison', player => emit_ability('Poison', player)); // OLD
   }
}

module.exports = SocketListener;
