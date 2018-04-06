const DEV = true;
const HEROKU = false;

// Repertoires
const worldColors = {
	black:            { r: 0,     g: 0,    b: 0   }, 
	white:            { r: 240,   g: 240,  b: 240 }, 
	blue:             { r: 247,   g: 250,  b: 255 }
};
const orgColors = {
	black: {
		fire:          { r: 255,   g: 90,   b: 81  }, 
		camel:         { r: 232,   g: 183,  b: 155 }, 
		clay:          { r: 232,   g: 145,  b: 95  }, 
		sun:           { r: 255,   g: 246,  b: 86  }, 
		leaf:          { r: 125,   g: 255,  b: 200 }, 
		lime:          { r: 57,    g: 249,  b: 86  }, 
		sky:           { r: 48,    g: 210,  b: 255 }, 
		lake:          { r: 142,   g: 182,  b: 255 }, 
		ocean:         { r: 102,   g: 136,  b: 244 }, 
		royal:         { r: 175,   g: 132,  b: 255 }, 
		petal:         { r: 250,   g: 122,  b: 255 }, 
		hot:           { r: 232,   g: 2,    b: 216 }
	}, 
	white: {
		fire:          { r: 240,   g: 75,   b: 66  }, 
		camel:         { r: 232,   g: 183,  b: 155 }, 
		clay:          { r: 232,   g: 145,  b: 95  }, 
		burnt:         { r: 196,   g: 99,   b: 19  }, 
		lime:          { r: 57,    g: 249,  b: 86  }, 
		forest:        { r: 0, 	   g: 114,  b: 38  }, 
		peacock:       { r: 16,    g: 143,  b: 147 }, 
		sky:           { r: 48,    g: 210,  b: 255 }, 
		lake:          { r: 104,   g: 157,  b: 255 }, 
		ocean:         { r: 102,   g: 136,  b: 244 }, 
		royal:         { r: 175,   g: 132,  b: 255 }, 
		petal:         { r: 250,   g: 122,  b: 255 }, 
		hot:           { r: 232,   g: 2,    b: 216 }
	}
};
const skins = [
	'grid', 
	'circles'
];
const modes = {
	ffa: 'Free for All', 
	skm: 'Skirmish', 
	srv: 'Survival', 
	ctf: 'Capture the Flag', 
	inf: 'Infection', 
	kth: 'King of the Hill'
};
const teamColors = [
	'red', 
	'blue', 
	'green', 
	'pink'
];
const teamColorDef = {
	red: 'fire', 
	blue: 'sky', 
	green: 'lime', 
	pink: 'petal'
};

// Math
const cos45 = 0.70710678118;

// Defaults
const RANGE = 50;
const CELLWIDTH = 6;
const MOVESPEED = 1.8;
const SPECTATESPEED = 4;
const WORLDWIDTH = 800;
const WORLDHEIGHT = 800;
const PLAYERCAP = 10;
const BOARDLENGTH = 10;
const TEAMCOUNT = 2;
const SHRINKRATE = .1;

// Settings
var Labels = true;

// Controls
var Controls = {
	left1: {
		key: 'A', 
		code: 65
	}, 
	left2: {
		key: '←', 
		code: 37
	}, 
	up1: {
		key: 'W', 
		code: 87
	}, 
	up2: {
		key: '↑', 
		code: 38
	}, 
	right1: {
		key: 'D', 
		code: 68
	}, 
	right2: {
		key: '→', 
		code: 39
	}, 
	down1: {
		key: 'S', 
		code: 83
	}, 
	down2: {
		key: '↓', 
		code: 40
	}, 
	ability1: {
		key: 'X', 
		code: 88
	}, 
	ability2: {
		key: 'C', 
		code: 67
	}, 
	ability3: {
		key: 'V', 
		code: 86
	}, 
	ability4: {
		key: ' ', 
		code: 32
	}, 
	respawn: {
		key: 'R', 
		code: 82
	}, 
	pause: {
		key: 'ESC', 
		code: 27
	}, 
};