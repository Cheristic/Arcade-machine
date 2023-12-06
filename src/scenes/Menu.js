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
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        };

        this.add.text(game.config.width/2,game.config.height/2+100,
        'Press SPACE to Begin', menuConfig).setOrigin(0.5);

        menuConfig.fontSize = '40px'
        this.add.text(game.config.width/2,scr_height-200,
        'ARCADE MACHINE\nfrom\nANIMAL CROSSING', menuConfig).setOrigin(0.5);

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