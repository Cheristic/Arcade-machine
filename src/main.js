/*

Ethan Heffan

CHECKLIST

- Create luigi sprites/animations
- Create clickable note system
- Main Menu navigation
- Hurt/Block/Death animations

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
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0, y: 0},
            debug: true
        }
    },
    scene: [ Load, Menu, Play, GameOver] 
};

let game = new Phaser.Game(config);

let gameActive = false;

//set UI sizes
let {width, height} = game.config;

let scr_width = 609, scr_height = 658;

let moveEventManager = new Phaser.Events.EventEmitter();
let gameEventManager = new Phaser.Events.EventEmitter();