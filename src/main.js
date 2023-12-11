/*

Ethan Heffan

PHASER'S MAJOR COMPONENTS USED:
- Text objects
- Animation manager
- Renderers
- Timers
- State machine?

CHECKLIST

- Create clickable note system
- Sound

STRETCH
- Make nicer fight backgrounds that randomize
- Get garageband running for music composition


*/
let config = {
    parent: "myGame",
    type: Phaser.WEBGL,
    width: 800,
    height: 1074,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 0.5
    },
    scene: [ Load, Menu, Play, GameOver, UI] 
};

let game = new Phaser.Game(config);

let gameActive = false;
let restarted = false;

//set UI sizes
let {width, height} = game.config;

let scr_width = 609, scr_height = 658;

let timerLength = 60000;

let moveEventManager = new Phaser.Events.EventEmitter();
let gameEventManager = new Phaser.Events.EventEmitter();
let scoreEventManager = new Phaser.Events.EventEmitter();