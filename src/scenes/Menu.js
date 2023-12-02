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
    }

    update() {
        if (!this.started) {
            this.started = true;
            this.scene.start('playScene')
        }
    }

}