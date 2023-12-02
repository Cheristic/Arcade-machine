/*

Ethan Heffan

CHECKLIST

- Create luigi sprites/animations
- Main Menu navigation
    - Create menu screen
    - Create controls screen
- Create state machine
- Player animation controls with state machine
- Hurt/Block/Death animations
- Get garageband running for music composition

*/

let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0, y: 0},
            debug: true
        }
    },
    scene: [ Load, Menu, Play ] 
};

let game = new Phaser.Game(config);

let gameActive = false;

//set UI sizes
let {width, height} = game.config;

let moveEventManager = new Phaser.Events.EventEmitter();
