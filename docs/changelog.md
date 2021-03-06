# Change Log

## a1.0.0
    Initial Alpha Release

## a1.1.0
    Added spectate mode
    Added password protection option to games
    Added denial of movement over world border
    Added browser information
    Changed frame rate to increased frequency
    Fixed ability selection translation issue
    Fixed spawn over opponent org
    Balanced ability durations and cooldowns

## a1.1.1
    Fixed spore/secrete lag issue
    Fixed flicker issue
    Fixed server crash issue

## a1.1.2
    Added cannot spawn outside world boundary
    Added heroku support
    Changed world border width to lesser width
    Fixed package management
    Fixed browser row coloration

## a2.0.0
    Added neutralize
    Added toxin
    Added shoot skillshot mechanic
    Added shoot ability timers
    Added world dots (decoration)
    Added dot eat/replace mechanic
    Added footer with online clients counter
    Removed stimulate
    Removed poison
    Removed 'you are dead' alert
    Improved org aesthetics (stroke on cells to fill gaps)
    Improved browser aesthetics
    Changed stunt mechanic to halt natural death as well as birth (effective freze)
    Changed poison mechanic (accelerated death --> decelerated birth)
    Changed cell width (7px --> 6px);
    Changed movement speed (2.5px/frame --> 2px/frame)
    Changed spore frame rate (increased)
    Changed secrete timer animation
    Fixed spore lag issue
    Fixed join/spectate click mousedown script
    Fixed browser row bug
    Fixed favicon issue
    Balanced secretion duration (decreased)
    Balanced extend/compress durations (decreased)
    Balanced stimulate/poison factors (increased)
    Balanced ability cooldowns

## a2.1.0
    Added leaderboard
    Added kill/death counters
    Added screen names
    Added screen name label when targeting
    Added more org colors
    Added space bar spawn in ability choosing menu
    Removed dots
    Fixed spawn without picking three abilities
    Fixed index death/crash bug
    Fixed render layering bug

## a2.1.1
    Changed runs per second of growth interval (100 --> 80)
    Changed host server info to show screen name of host
    Fixed spawn crash bug
    Fixed two death bug
    Fixed cannot spawn over opponent org
    Fixed leaderboard cover end of long name

## a3.0.0 - Menus and Customization
    Added game creation options menu
    Added join game options menu
    Added spectate game options menu
    Added respawn options menu
    Added pause options menus
    Added world size customization
    Added world color customization
    Added player cap customization
    Added leaderboard length customization
    Added player color customization
    Added player grid texture customization
    Added ability selection to join and respawn menus
    Added leave game option
    Added player name labels
    Added player name label toggle option
    Added leader column to browser
    Added player cap column to browser
    Added peacock color option to white world
    Added burnt color option to white world
    Added forest color option to white world
    Removed ability selection screen
    Removed password entry column from browser
    Removed display of spectators in leaderboard
    Removed turquoise color
    Removed kiwi color
    Improved password protection security
    Improved browser re-rendering (no reload)
    Improved browser updating method
    Improved browser aesthetics
    Improved skill tooltip and timer aesthetics
    Changed 'Screen Name' to 'Player' in leaderboard head
    Changed stunt ability name to 'freeze' (no mechanical change)
    Changed game 'name' to 'title'
    Changed header height (36px --> 32px)
    Fixed browser event listener stacking
    Fixed spawn over toxin and secretions
    Fixed non-removal of passwords on server after game close
    Fixed premature showing of game in browser
    Fixed game closure recurrance issue
    Fixed spore color initialization issue
    Fixed death crossover issue
    Balanced extend time (4000ms --> 4500ms)
    Balanced compress time (3000ms --> 3500ms)
    Balanced immortality cooldown (4000ms --> 3500ms)

## a3.1.0 - Game Modes
    Added skirmish game mode
    Added survival game mode
    Added game mode column to browser
    Added tag ability (ctf + inf)
    Added shoot cooldown
    Added circular world option
    Added circles skin
    Added game backdrop color
    Added messages and messages on/off setting
    Added world, leaderboard, and message shadows
    Added menu responsivity (restructure depending on selections)
    Added window resizing functionality when in game
    Added maximum world dimensions
    Added name label 20 character limit
    Removed world color option
    Removed world border movement block
    Removed host browser column
    Removed leader browser column
    Improved name label positioning
    Improved title text alignment in browser (centered)
    Changed respawn alert message
    Changed menu buttons' cursors to pointer
    Changed lake color (lighter)
    Changed pink color name to petal
    Changed skin selection style in menus
    Changed back button click-box
    Fixed spectate random positioning after death
    Fixed game join misplacement and browser ordering issue
    Fixed numerical operations issues in create game menu
    Fixed respawn menu random positioning on back
    Fixed extend and compress non-cancelation
    Fixed closed game spectate attempt bug
    Fixed occasional rapid growth bug
    Fixed game closure menu bug
    Fixed team count menu option bug
    Balanced spore range (2200ms --> 1700ms)
    Balanced shoot spore range (2000ms --> 1500ms)
    Balanced neutralize uptime (4000ms --> 3500ms)
    Balanced neutralize cooldown (6000ms --> 6500ms)
    Balanced spores shoot from center of mass rather than crosshair (balance to immortality/spore combo)

## a3.2.0 - Title and Tutorial
    Added title screen and menu
    Added tutorial
    Added tutorial pause menu
    Added translucency to brower and menus
    Added ghost skin
    Improved movement multikey detection
    Changed join/spectate column header to 'Bacter'
    Fixed spawn on world edge issue
    Fixed crash on stationary mouse position use

## a3.2.1 - UI Improvement and Optimization
    Added menu issue warnings
    Added leave game option to respawn menu
    Added fullscreen recommendation to tutorial
    Added escape key to go back in game browser and respawn, create, join, and spectate menus
    Added auto-selection of smallest team in join menu team list
    Added darker focus color to select input boxes
    Added backwards compatibility to older browsers
    Added black theme color to compatible browsers
    Removed menu alerts
    Removed targeting click box
    Removed setting update upon exiting pause menu through back button/escape
    Removed pixel units from create game menu
    Improved world width/height auto-equalization response
    Improved auto-assign algorithm
    Improved load times with file compilation into bundle.js
    Improved UI responsiveness and reliability
    Changed pause menu submit button text from 'Return' to 'Apply'
    Fixed spawn with one cell issue
    Fixed skirmish friendly fire issue
    Fixed skirmish team overpopulation issue
    Fixed host menu bug
    Fixed rapid growth bug
    Fixed leader board multiple issue
    Fixed skirmish game creation issue
    Fixed spectate menu back button
    Fixed respawn menu pause issue
    Fixed join game without abilities issue
    Fixed invalid zero dimension error issue
    Fixed minor ability bug
    Fixed minor player cap bug

## a3.2.2 - Lag Reduction and Fixes
    Changed neutralize/toxin center from center of mass to crosshair
    Changed text in respawn menu from 'Respawn' to 'Spawn'
    Changed text in tutorial pause menu from 'Leave Game' to 'Leave Tutorial'
    Improved latency issues
    Fixed second game in single session break-on-spawn bug
    Fixed return to title screen no-render bug
    Fixed current color detection in spawn and pause menus
    Fixed in-game window resizing issue
    Fixed breaking bug in survival after multiple last players die on same tick
    Fixed bug in survival where the world shrinks faster in successive rounds
    Fixed incorrect or required password issue indication
    Fixed password listener bug
    Fixed spectator password denial
    Fixed spectate menu double issue indicators

## a3.2.3 - Organization
    Added gameplay guide
    Added usage guide
    Added '4th Ability' line to 'Join Game Options' menu
    Added pointer cursor over radio buttons
    Changed survival wait delay from ten seconds to eight seconds
    Improved tutorial user interface
    Improved sharpness of ability tooltips and their rendering efficiency
    Improved efficiency of organism generation
    Improved other documentation
    Improved appearance
    Fixed failure to apply compress and extend abilities in the tutorial
    Fixed shrink rate acceleration in survival mode
    Fixed occasional crashing bug in survival mode
    Fixed fatal bug occuring when player is forcibly respawned while viewing the respawn or pause-spectate menus
    Fixed game continuation after player leaves a survival game during the pre-round delay
    Fixed world size reset in survival mode
    Fixed blank background on forced exit of a game
    Fixed survival mode crash when spawn is forced while on respawn menu
    Fixed 'issue with skin detection' bug in the spawn and pause menus
    Fixed server crash on concurrent deletion of a survival game
    Fixed occasional movement speed bug
    Fixed collision detection with world border
    Fixed text alignment in selection input type
    Fixed frequent disconnect and reconnection of client
    Fixed occasional client non-connection to socket
    Fixed rectangular world's north boarder collision detection
    Fixed several instances of unnecessary communications with the server

## a3.2.4 - Optimization
    Improved tutorial user experience
