var socket;
var passwordConfirmed;
function connectSocket() {
	socket = io.connect('24.55.26.67'); // Local Server
	// socket = io.connect('https://bacter.herokuapp.com/'); // Heroku Server

	gamesInterval = setInterval(function() {
		if (state != 'game') {
			socket.emit('Games Request');
		}
	}, 250);

	socket.on('Games', function(datA) {
		games = datA.games;
		connections = datA.connections;
		if (state == 'browser') {
			renderBrowser('games');
		}
	});

	socket.on('Enter', function() {
		if (org.count == 0) {
			org.cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org
			org.count++;
			grow(); // Begin growth
		}
		// chooseAbilities();
	});

	socket.on('Game', function(gamE) {
		game = gamE;
		if (ability.spore.value == true) {
			ability.spore.interval();
		}
		for (let i = 0; i < 3; i++) {
			if (ability.shoot.value[i] == true) {
				ability.shoot.interval[i]();
			}
		}
		if (state == 'game') {
			translate(-org.off.x, -org.off.y);

			renderWorld();
			for (let i = 0; i < game.info.count; i++) {
				renderToxin(game.abilities[i]);
			}
			for (let i = 0; i < game.info.count; i++) {
				renderSecretions(game.abilities[i]);
			}
			for (let i = 0; i < game.info.count; i++) {
				renderNeutralize(game.abilities[i]);
			}
			renderOrgs();
			for (let i = 0; i < game.info.count; i++) {
				renderSpores(game.abilities[i]);
			}
			renderUI();
			renderLeaderboard();
			move(); // Move goes at the end so player does not render his movements before others

			translate(org.off.x, org.off.y);
		} else if (state == 'spectate') {
			translate(-org.off.x, -org.off.y);

			renderWorld();
			for (let i = 0; i < game.info.count; i++) {
				renderToxin(game.abilities[i]);
			}
			for (let i = 0; i < game.info.count; i++) {
				renderSecretions(game.abilities[i]);
			}
			for (let i = 0; i < game.info.count; i++) {
				renderNeutralize(game.abilities[i]);
			}
			renderOrgs(); // Orgs render over neutralize and toxin but under other abilities
			for (let i = 0; i < game.info.count; i++) {
				renderSpores(game.abilities[i]);
			}
			renderLeaderboard();
			move();

			translate(org.off.x, org.off.y);
		}
	});

	socket.on('Game Ended', function(gamE) {
		if (gamE.info.host != socket.id) { // Don't alert host (he already knows)
			alert('The game has ended');
		}
		renderBrowser();
	});

	socket.on('Spectate', function() {
		spectate({ color: org.color, gridded: org.gridded });
	});

	{ // Abilities
		socket.on('Extend', function() {
			ability.extend.value = true;
			clearTimeout(ability.extend.timeout);
			org.coefficient = -25.5;
			org.range = 70;
			ability.extend.start = new Date();
			socket.emit('Ability', ability);
			ability.extend.timeout = setTimeout(function() { // End ability
				ability.extend.value = false;
				ability.extend.end = new Date();
				org.coefficient = -27.5;
				org.range += 10; // So as to cancel out compress
				if (org.range > 50) {
					org.range = 50; // Extend does not stack
				}
				ability.extend.cooling = true;
				socket.emit('Ability', ability);
			}, ability.extend.time);
		});

		socket.on('Compress', function() {
			ability.compress.value = true;
			clearTimeout(ability.compress.timeout);
			org.coefficient = -31.5;
			org.range -= 10; // So as to cancel out extend
			if (org.range < 30) {
				org.range = 30; // Compress does not stack
			}
			socket.emit('Ability', ability);
			ability.compress.timeout = setTimeout(function() {
				ability.compress.value = false;
				org.coefficient = -27.5;
				org.range = 50;
				socket.emit('Ability', ability);
			}, ability.compress.time);
		});

		// socket.on('Speed', function() { // Not updated
		// 	ability.speed.value = true;
		// 	org.speed *= ability.speed.factor;
		// 	clearTimeout(ability.speed.timeout);
		// 	socket.emit('Ability', ability);
		// 	ability.speed.timeout = setTimeout(function() { // End ability
		// 		org.speed /= ability.speed.factor;
		// 		ability.speed.value = false;
		// 		socket.emit('Ability', ability);
		// 	}, ability.speed.time);
		// });

		// socket.on('Slow', function() { // Not updated
		// 	ability.slow.value = true;
		// 	org.speed /= ability.slow.factor; // Divide speed by factor
		// 	clearTimeout(ability.slow.timeout);
		// 	socket.emit('Ability', ability);
		// 	ability.slow.timeout = setTimeout(function() { // End ability
		// 		org.speed *= ability.slow.factor; // Multiply speed by factor to reset to original
		// 		ability.slow.value = false;
		// 		socket.emit('Ability', ability);
		// 	}, ability.slow.time);
		// });

		socket.on('Immortality', function() {
			ability.immortality.value = true;
			clearTimeout(ability.immortality.timeout);
			ability.immortality.start = new Date();
			socket.emit('Ability', ability);
			ability.immortality.timeout = setTimeout(function() { // End ability
				ability.immortality.value = false;
				ability.immortality.end = new Date();
				ability.immortality.cooling = true;
			}, ability.immortality.time);
		});

		socket.on('Freeze', function() {
			ability.freeze.value = true;
			clearTimeout(ability.freeze.timeout);
			socket.emit('Ability', ability);
			ability.freeze.timeout = setTimeout(function() { // End ability
				ability.freeze.value = false;
				socket.emit('Ability', ability);
			}, ability.freeze.time);
		});

		// socket.on('Stimulate', function() {
		// 	ability.stimulate.value = true;
		// 	clearTimeout(ability.stimulate.timeout);
		// 	ability.stimulate.start = new Date();
		// 	socket.emit('Ability', ability);
		// 	ability.stimulate.timeout = setTimeout(function() { // End ability
		// 		ability.stimulate.value = false;
		// 		ability.stimulate.end = new Date();
		// 		ability.stimulate.cooling = true;
		// 		socket.emit('Ability', ability);
		// 	}, ability.stimulate.time);
		// });

		// socket.on('Poison', function() {
		// 	ability.poison.value = true;
		// 	clearTimeout(ability.poison.timeout);
		// 	socket.emit('Ability', ability);
		// 	ability.poison.timeout = setTimeout(function() { // End ability
		// 		ability.poison.value = false;
		// 		socket.emit('Ability', ability);
		// 	}, ability.poison.time);
		// });

		socket.on('Neutralize', function() {
			ability.neutralize.value = true;
			ability.neutralize.start = new Date();
			clearTimeout(ability.neutralize.timeout);
			ability.neutralize.x = org.x();
			ability.neutralize.y = org.y();
			socket.emit('Ability', ability);
			ability.neutralize.timeout = setTimeout(function() {
				ability.neutralize.value = false;
				ability.neutralize.end = new Date();
				ability.neutralize.cooling = true;
				socket.emit('Ability', ability);
			}, ability.neutralize.time);
		});

		socket.on('Toxin', function() {
			ability.toxin.value = true;
			ability.toxin.start = new Date();
			clearTimeout(ability.toxin.timeout);
			ability.toxin.x = org.x();
			ability.toxin.y = org.y();
			socket.emit('Ability', ability);
			ability.toxin.timeout = setTimeout(function() {
				ability.toxin.value = false;
				ability.toxin.end = new Date();
				ability.toxin.cooling = true;
				socket.emit('Ability', ability);
			}, ability.toxin.time);
		});
	}
}