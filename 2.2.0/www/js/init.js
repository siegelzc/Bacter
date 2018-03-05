var cnv;
var center = {};
var game = {
	players: [], 
	info: {
		host: undefined, 
		title: undefined
	}, 
	board: {
		host: undefined, 
		list: [
			// {
			// 	player: undefined, // ID of player
			// 	name: undefined, // Screen name of player
			// 	kills: undefined, // Kills as defined by number of enemy cells killed
			// 	deaths: undefined, // Deaths as defined by number of org deaths
			// 	ratio: undefined // Ratio of kills to deaths
			// }
		], 
		count: undefined, 
		show: undefined, // Maximum number of players shown in leaderboard (Top __)
		x: undefined, // width - (nameWidth + killWidth + deathWidth) / 2 - marginRight
		y: undefined, // marginTop
		marginRight: 15, 
		marginTop: 15, 
		text: {
			marginLeft: 5, 
			marginTop: 15, 
			size: 11, 
			font: 'Helvetica', 
			boldFont: 'Verdana', 
			color: { r: 0, g: 0, b: 0 }
		}, 
		nameWidth: 170, 
		killWidth: 46, 
		deathWidth: 46, 
		ratioWidth: 46, 
		rowHeight: 22, 
		tableWeight: 1, 
		headWeight: 1, 
		cellWeight: 1, 
		headColor: { r: 200, g: 200, b: 200 }, 
		cellColor: { r: 245, g: 245, b: 245 }, 
		stroke: { r: 0, g: 0, b: 0 }
	}, 
	world: {
		host: undefined, 
		width: undefined, 
		height: undefined, 
		x: undefined, 
		y: undefined, 
		color: undefined, 
		background: undefined, 
		border: {
			color: undefined, 
			weight: 1
		}, 
		grid: {
			width: 100
		}, 
		dots: {
			r: {
				min: .5, 
				max: 2
			}, 
			prob: .2, 
			array: [], 
			count: 0
		}
	}, 
	orgs: [], 
	abilities: []
};
function initialize(gamE, datA) {
	state = 'initialize';
	game = gamE;

	// Clear Body
	var page = document.body.parentNode;
	page.removeChild(document.body);
	body = document.createElement('body');
	page.appendChild(body);

	// Apply Canvas Styling
	body.style.overflow = 'hidden';
	body.style.margin = '0px';
	body.style.border = '0px';
	body.style.padding = '0px';

	// Initialize Game
	cnv = createCanvas(window.innerWidth, window.innerHeight);
	canvas = cnv.elt; // HTML Node is stored in p5 canvas' .elt property
	canvas.style.visibility = 'visible';
	body.appendChild(canvas);
	center = {
		x: width / 2, 
		y: height / 2
	};
	rectMode(CENTER);
	ellipseMode(RADIUS);
	angleMode(DEGREES);
	textAlign(LEFT);

	if (datA.spectate != true) { // Field can be left undefined
		spawn({ color: datA.color, gridded: datA.gridded });
	} else if (datA.spectate == true) {
		spectate({ color: datA.color, gridded: datA.gridded });
	}
}

function createGame(datA) {
	game.info = {
		host: socket.id, 
		title: datA.title, 
		count: 0, 
		cap: datA.cap
	};
	game.world.host = game.info.host;
	game.world.width = datA.width;
	game.world.height = datA.height;
	game.world.x = 0;
	game.world.y = 0;
	game.world.color = datA.color.toLowerCase();
	{
		for (let i in worldColors) {
			if (i == game.world.color) {
				game.world.background = worldColors[i];
				break;
			}
		}
	}
	game.world.border.weight = 1;
	{
		if (game.world.color == 'black') {
			game.world.border.color = { r: 255, g: 255, b: 255 };
		} else if (game.world.color == 'white') {
			game.world.border.color = { r: 0, g: 0, b: 0 };
		}
	}
	game.players = [];
	game.spectators = [];
	game.orgs = [];
	game.abilities = [];
	for (let i = 0; i < game.world.width; i++) {
		if (random() < game.world.dots.prob) { // About every five pixels, draw dot
			let dot = {
				i: game.world.dots.array.length, 
				r: random(game.world.dots.r.min, game.world.dots.r.max), 
				x: i, 
				y: random(0, game.world.height)
			};
			game.world.dots.array.push(dot);
		}
	}
	game.world.dots.count = game.world.dots.array.length;
	game.board.host = game.info.host;
	game.board.list = [];
	game.board.show = datA.show;
	socket.emit('Game Created', game);
	if (datA.password != '') {
		socket.emit('Password Created', { pass: datA.password, info: game.info });
	}
	renderMenu('join', game);
}