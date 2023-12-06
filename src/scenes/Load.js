
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

        this.load.spritesheet('lug-idle', './assets/lug-idle-anim.png', {
            frameWidth: 480,
            frameHeight: 480,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('lug-high', './assets/lug-highhit-anim.png', {
            frameWidth: 480,
            frameHeight: 480,
            startFrame: 0,
            endFrame: 2
        });
        this.load.spritesheet('lug-mid', './assets/lug-midhit-anim.png', {
            frameWidth: 480,
            frameHeight: 480,
            startFrame: 0,
            endFrame: 2
        });
        this.load.spritesheet('lug-low', './assets/lug-lowhit-anim.png', {
            frameWidth: 480,
            frameHeight: 480,
            startFrame: 0,
            endFrame: 2
        });
        this.load.image('lug-hit', './assets/lug-hit.png');
        this.load.image('lug-block', './assets/lug-block.png');
        this.load.spritesheet('lug-win', './assets/lug-win-Sheet.png', {
            frameWidth: 480,
            frameHeight: 480,
            startFrame: 0,
            endFrame: 1
        });
        this.load.image('lug-dead', './assets/lug-dead.png');
        this.load.image('base-platform', './assets/base-platform.png');

        this.load.image('health-bar-green', './assets/health-bar-green.png');
        this.load.image('health-bar-yellow', './assets/health-bar-yellow.png');

        this.load.spritesheet('explosion', './assets/explosion-Sheet.png', {
            frameWidth: 142,
            frameHeight: 200,
            startFrame: 0,
            endFrame: 16,
        });

        this.load.audio('block0', ['./assets/block0_sfx.wav'])
        this.load.audio('block1', ['./assets/block1_sfx.wav'])
        this.load.audio('block2', ['./assets/block2_sfx.wav'])
        this.load.audio('dmg0', ['./assets/dmg0_sfx.wav'])
        this.load.audio('dmg1', ['./assets/dmg1_sfx.wav'])
        this.load.audio('dmg2', ['./assets/dmg2_sfx.wav'])
        this.load.audio('super_dmg0', ['./assets/super_dmg0_sfx.wav'])
        this.load.audio('super_dmg1', ['./assets/super_dmg1_sfx.wav'])
        this.load.audio('super_dmg2', ['./assets/super_dmg2_sfx.wav'])
        this.load.audio('win', ['./assets/win_sfx.wav'])
        this.load.audio('explosion', ['./assets/explosion_sfx.wav'])

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
                frames: [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2]
            }),
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'mar-mid',
            frames: this.anims.generateFrameNumbers('mar-mid', {
                frames: [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2]
            }),
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'mar-low',
            frames: this.anims.generateFrameNumbers('mar-low', {
                frames: [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2]
            }),
            frameRate: 12,
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

        // LUIGI ANIMATIONS
        this.background = this.add.image(0,0,"machine-bg").setOrigin(0);
        this.anims.create({
            key: 'lug-idle',
            frames: this.anims.generateFrameNames('lug-idle', {
                start: 0,
                end: 1
            }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'lug-high',
            frames: this.anims.generateFrameNumbers('lug-high', {
                frames: [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2]
            }),
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'lug-mid',
            frames: this.anims.generateFrameNumbers('lug-mid', {
                frames: [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2]
            }),
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'lug-low',
            frames: this.anims.generateFrameNumbers('lug-low', {
                frames: [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2]
            }),
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'lug-win',
            frames: this.anims.generateFrameNumbers('lug-win', {
                frames: [0, 1]
            }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosion'),
            frameRate: 16,
            repeat: -1
        });


        this.scene.launch('menuScene');
    }
}