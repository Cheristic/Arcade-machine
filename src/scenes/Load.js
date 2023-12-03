
class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.image('machine-bg', './assets/arcade-machine-bg.png');
        this.load.image('fight-bg0', './assets/fight-bg0.png');
        this.load.spritesheet('mar-idle', './assets/mar-idle-anim.png', {
            frameWidth: 480,
            frameHeight: 480,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('mar-high', './assets/mar-highhit-anim.png', {
            frameWidth: 480,
            frameHeight: 480,
            startFrame: 0,
            endFrame: 2
        });
        this.load.spritesheet('mar-mid', './assets/mar-midhit-anim.png', {
            frameWidth: 480,
            frameHeight: 480,
            startFrame: 0,
            endFrame: 2
        });
        this.load.spritesheet('mar-low', './assets/mar-lowhit-anim.png', {
            frameWidth: 480,
            frameHeight: 480,
            startFrame: 0,
            endFrame: 2
        });
        this.load.image('mar-hit', './assets/mar-hit.png');
        this.load.image('mar-block', './assets/mar-block.png');
        this.load.spritesheet('mar-win', './assets/mar-win-Sheet.png', {
            frameWidth: 480,
            frameHeight: 480,
            startFrame: 0,
            endFrame: 1
        });
        this.load.image('mar-dead', './assets/mar-dead.png');
        this.load.image('base-platform', './assets/base-platform.png');

        this.load.image('health-bar-green', './assets/health-bar-green.png');
        this.load.image('health-bar-yellow', './assets/health-bar-yellow.png');

    }

    create() {
        // MARIO ANIMATIONS
        this.background = this.add.image(0,0,"machine-bg").setOrigin(0);
        this.anims.create({
            key: 'mar-idle',
            frames: this.anims.generateFrameNames('mar-idle', {
                start: 0,
                end: 1
            }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'mar-high',
            frames: this.anims.generateFrameNumbers('mar-high', {
                frames: [0, 1, 2, 2, 2, 2, 2, 2]
            }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'mar-mid',
            frames: this.anims.generateFrameNumbers('mar-mid', {
                frames: [0, 1, 2, 2, 2, 2, 2, 2]
            }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'mar-low',
            frames: this.anims.generateFrameNumbers('mar-low', {
                frames: [0, 1, 2, 2, 2, 2, 2, 2]
            }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'mar-win',
            frames: this.anims.generateFrameNumbers('mar-win', {
                frames: [0, 1]
            }),
            frameRate: 4,
            repeat: -1
        });


        this.scene.launch('menuScene');
    }
}