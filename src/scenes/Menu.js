class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        let menuConfig = {
            fontFamily: 'Source Code Pro',
            fontStyle: 'Bold',
            fontSize: '28px',
            color: '#A9E010',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        };

        this.add.text(game.config.width/2,game.config.height/2,
        'Press SPACE to Begin', menuConfig).setOrigin(0.5);

        this.started = false;

        this.spaceKEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    update() {
        if (!this.started && Phaser.Input.Keyboard.JustDown(this.spaceKEY)) {
            this.started = true;
            if (restarted) {
                //this.scene.get('playScene').onDestroy();
                this.scene.get('playScene').scene.restart();
            } else {
                this.scene.start('playScene');
            }
            
        }
    }

}