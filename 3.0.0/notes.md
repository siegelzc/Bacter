# BACTER

## Movement:
	Target is centered in the screen
	Org spawns on target (in center screen)
	Rate of growth increases as cells approach target
		(Rate of growth decreases further from target)
	Rate of death decreases as cells approach target
		(Rate of death increases further from target)

## Abilities:
	Spore: (Ultimate)
		All exposed (membranal) cells jettison from org away from the center of org
	Secrete: (Ultimate)
		All non-enclosed (by friendly cells) cells secrete acid into adjacent 8 (or 4) regions
	X Stimulate:
		Accelerated Birth
		Effectively increases movement speed
	X Poison:
		X Accelerated Death
		Decelerated Birth
		Effectively decreases movement speed
	Immmortality:
		Halt Natural Death
			May still die from secretions
		Leaves trail of cells behind
			Allows for clever spore/secrete
			Blocks movement of opponents through trail
	Freeze: (Formerly Stunt):
		Halt Birth and Death
		Effectively freezes org, halting movement
	X Speed:
		Increase Movement Speed
	X Slow:
		Slow Movement Speed
	Extend:
		Increase Living Range
		Increases Surface Area
			Increases Spore Count
	Compress:
		Decrease Living Range
		Decreases Surface Area
			Decreases Spore Count
	Neutralize:
		Neutralize all acid in a circular area surrounding the organism
			- By secreting a base
		Immortalizes cells within alkaline radius from acidic secretions
		Rendering - Circle around org
			X Circle around each cell
		No shoot
	Toxin:
		Kill all enemy cells in a circular area surrounding the organism
			- By secreting a self-immune toxin
		Rendering - Circle around org
			X Circle around each cell
		No shoot
	Tag:
		Shoot single spore to pop on enemy
	Stimulate: (NEW)
		Increases birth/death rate
		Increases movement speed
	? Cloak:
		Temporarily become invisible to opponents
			- Usage of abilities denied while stealthed
			- OR Usage of an ability disables cloak

## Game Modes:
	Free For All (FFA)
		Boast the most kills and the least deaths
		Leaderboard tracks kills, deaths, and k:d
	Skirmish (SKM)
		Players are sorted into teams
			Players cannot harm teammates
		Leaderboard tracks team kills, team deaths, team k:d
	Survival (SRV)
		Last man standing wins
		World border slowly creeps in
		What's done is done: Cannot respawn until game is completed
		Leaderboard tracks wins, kills
	Capture the Flag (CTF)
		Players are sorted into teams
			Players cannot harm teammates
		Spawn in random positions
		Each team has a colored base at corner of map
			Players capture single flag and return to base for capture
				Pick up flag by making contact with flag on body
			Flag returns to center of map after capture
			Flag drops at location of flag bearer on death
		Tag ability
			Shoot single spore and pop on enemy
			If spore is on friendly side, send to jail
			Safe zone around flag protects carrier
			If holding the flag, throws the flag
		Leaderboard tracks captures (score) and round wins
	Infection (INF)
		Players sorted into infected and healthy
			One infected per eight healthy, round up
		Infected players are red, Healthy players are green
		Tag ability for infected
			Shoots single spore to pop on enemy
			On hit, healthy org dies, new infected org spawns
		Stimulate ability for healthy
			Increases birth/death rate
			Increases movement speed
		Infected players are zoomed in, so have less visibility to equalize power of tag 
		Last man standing wins
		Leaderboard tracks wins
	King of the Hill (KTH)
		Players spawn on outsides of map
		Region in center of the map
			Region is same shape as map
		When player enters empty region, player becomes king
			Region stroke becomes very wide to idicate capture
			If player leaves region, he loses kingship
				Closest player to center becomes new king
			Score is 1 : 3 seconds as king
		Leaderboard tracks score and round wins
	? Freeze Tag (FZT)
		Use tag ability with freeze item art and similar 
	? Territories (TRT)
		Players are assigned a small circular territory at spawn

## Bugs/Fixes:
	Leaderboard flicker on new spectator bug
		Spectator has not yet been added to spectators array

## To-Do:
	3.0.0 - Game Modes
		✔ GitHub versioning improvement
		✔ Menu buttons cursor is pointer
		✔ windowResized() functionality in-game
		✔ Circular name label positioning
		✔ Allow rectangular world
		✔ Elliptical world option
		✔ Begin spectating at location of death
		✔ Circular cells skin
		✔ Shoot cooldown
		✔ Fix occasional rapid growth bug
		✔ Improve controls config variables
		✔ Remove world border movement block
		✔ Reduce movement speed so standard movement cannot suicide
		✔ Extend + Compress = 0
		✔ Color outside of world
		✔ Remove world border movement block
		✔ Change respawn alert to in-game tip
		✔ Added tips setting
		✔ Leaderboard, messages, and world shadows
		✔ Balancing
			✔ Lengthen neutralize cooldown
			✔ Shorten neutralize uptime
			✔ Spores shoot from center of mass rather than crosshair (nerf on immortality combo)
			✔ Reduce spore range
		✔ Back button entire footer
		✔ Remove white world option
		✔ Remove non-square dimensions
		✔ Set maximum dimensions
		✔ Center titles in browser
		✔ Remove host column in browser
		✔ Update orderBoard() to game modes
		✔ Game join misplacement and browser ordering issue
		✔ Board constructor object
		✔ Game constructor object
		✔ Add Game Modes
			✔ Add to new game settings
				X Team colors (if applicable)
				✔ Team count (if applicable)
			✔ Add to join game settings
				✔ Team (if applicable)
					X Team color background of list
					✔ Auto-assign (square button in row below team list that disables team list when selected)
				✔ Team length update
			✔ Pause and respawn menus
			✔ Round system
				✔ Staging period before round start
					✔ Player minimum
					✔ 10 second wait time
				✔ Respawn all players when round begins
					✔ 10 second wait time
				✔ Pause spectate menu return to non-spectate
			✔ Game Modes
				✔ Add tag ability
					✔ Item art
				✔ FFA
				✔ SKM
					✔ No friendly fire
					✔ Team leaderboard
				✔ SRV
					✔ Last man standing wins
					✔ Cannot respawn until round is over
					✔ World shrink
	3.1.0
		CTF
			✔ Round system
				Round end at 3 captures
			✔ No friendly fire
			✔ Tag
			✔ Larger minimum world
			✔ Random spawn
			✔ Color team bases
			Flag placement
			Base collision detection
		INF
			Round system
				Randomize teams each round
			✔ No friendly fire
			✔ Tag
			Boost ability
		KTH
			Round system
			Score counting - time
			Hill placement
		Polygon skin
			Random number of vertices
			Random radians between using perlin noise
	4.0.0
		Title Screen
			Canvas background with 3/4 bot orgs
			Central menu - Host, Join, Tutorial, Settings/Controls
		Tutorial
		Images for ability tooltips
		Add controls settings menu
			Ability keys
			Respawn key
			Pause key
		Add info menu
		Add popup info box
		Custom select menu
		? Player minimum browser column
		Sparks skin
			On birth, release sparks particle effect
		Fix ctf base world corner rendering bug
	X.1.0 - Visual Enhancement
		Add substance to the world (background)
			Decoration
				Add option to Create Game Settings Menu
				? Grid
				? Dots
			Pickups that lower cooldowns
			Pickups that increase radius
		Spores decelerate over time (Friction)
			Constant acceleration - Integrate
		When spores die, shrink radius
			Delete spore when radius is less than one pixel
		When secretions end, shrink radius
			Delete when radius is less than one pixel
		Customize menu alerts
		Customize death alert
		Customize game ended alert
		Transparent pause menu
		Add music
		Add SFX
		Centralize hit detections and such at host
		Graphical overhaul
			World border
				If substance, can remove
			World substance
			Spore animations
			Secrete animations
				Inner circle expands through interval
			X Animation over selected abilities in chooseAbilities()
			Graphics settings/Performance levels