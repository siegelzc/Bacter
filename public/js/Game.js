class Game {
   /**
    * All static fields are listed below:
    * (static) Game.game;
    * (static) Game.games;
    * (static) Game.state;
    */
    
   /**
    * Construct a Game object
    * @param  {Map} data {
    *                       title: gametitle,
    *                       password: password,
    *                       type: type,
    *                       width: width,
    *                       height: height,
    *                       color: color,
    *                       cap: cap,
    *                       show: show,
    *                       mode: mode,
    *                       teamCount: teamCount,
    *                       min: minimum
    *                    }
    */
   constructor(data) {
      this.src = 'game';
      this.players = []; { // Info
         this.info = {
            host: connection.socket.id,
            title: data.title,
            protected: undefined,
            count: 0,
            cap: data.cap,
            mode: data.mode,
            teamCount: data.teamCount
         };
         if (!data.password) // If there is no password
            this.info.protected = false;
         else // If there is a password
            this.info.protected = true;
      } { // Teams
         this.teams = [];
         if (this.info.mode === 'skm' || this.info.mode === 'ctf') {
            for (let i = 0; i < this.info.teamCount; i++) {
               this.teams.push([]); // Outer array contains teams, inner arrays contain player ids
            }
         } else if (this.info.mode === 'inf') {
            for (let i = 0; i < 2; i++) { // Only can be two teams in infection (healthy/infected)
               this.teams.push([]); // Outer array contains teams, inner arrays contain player ids
            }
         }
      } { // Rounds
         this.rounds = {
            host: undefined, // Identification purposes
            util: false, // If game utilizes rounds
            waiting: true,
            delayed: false,
            delaystart: undefined,
            rounddelay: _rounddelay,
            start: undefined,
            min: undefined, // Min players
            winner: undefined
         };
         if (this.info.mode === 'srv' || this.info.mode === 'ctf' || this.info.mode === 'inf' || this.info.mode === 'kth') { // If game mode utilizes round system
            this.rounds.util = true;
            this.rounds.host = this.info.host;
            this.rounds.min = data.min;
            this.rounds.waiting = true;
         }
      }
      this.board = new Board(data);
      this.world = new World(data);
      if (this.info.mode === 'ctf')
         this.flag = new Flag(this.world.x + this.world.width / 2, this.world.y + this.world.height / 2, this.world.border.color);
      this.players = [];
      this.spectators = [];
      this.orgs = [];
      this.abilities = [];
   }
}

// Static Initialization Block for class Game
(function() {
   
   Game.games = [];

})();