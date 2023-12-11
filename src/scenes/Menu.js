class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        let menuConfig = {
            fontFamily: 'Pixel',
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

        //this.add.text(game.config.width/2,game.config.height/2+100,
        //'Press SPACE to Begin', menuConfig).setOrigin(0.5);

        menuConfig.fontSize = '40px'
        this.add.text(game.config.width/2,scr_height-200,
        'ARCADE MACHINE\nfrom\nANIMAL CROSSING', menuConfig).setOrigin(0.5);

        this.started = false;

        this.spaceKEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.selector = this.add.sprite(width/2-80, height/2+86, 'selector');

        this.menuKeyInputs = {
            keyUp1: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            keySelect1: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            keyDown1: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
            keyUp2: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
            keySelect2: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
            keyDown2: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
        }

        this.selectorFSM = new StateMachine('oneP', {
            oneP: new MenuSelect1P(),
            twoP: new MenuSelect2P()
        }, [this, this.selector, this.menuKeyInputs]);

        gameEventManager.on('startGame', this.startGame, this);

        let selectorTextConfig = {
            fontFamily: 'Pixel',
            fontStyle: 'Bold',
            fontSize: '20px',
            color: '#A9E010',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        };
        
        this.add.text(game.config.width/2,game.config.height/2+100,
        '1P START\n2P START', selectorTextConfig).setOrigin(0.5);

        selectorTextConfig.fontSize = '14px'
        this.add.text(game.config.width/2+140,game.config.height/2+86,
        '(COMING SOON)', selectorTextConfig).setOrigin(0.5);

    }

    update() {
        this.selectorFSM.step();
    }

    startGame(mode) {
        gameEventManager.shutdown();
        if (restarted) {
            //this.scene.get('playScene').onDestroy();
            this.scene.get('playScene').scene.restart(mode);
        } else {
            this.scene.start('playScene', mode);
        }
    }

}

class MenuSelect1P extends State {
    enter(scene, selector, keys) {
        selector.setPosition(width/2-80, height/2+86);
    }
    execute(scene, selector, keys) {
        if(Phaser.Input.Keyboard.JustDown(keys.keyUp1) || Phaser.Input.Keyboard.JustDown(keys.keyUp2)
        || Phaser.Input.Keyboard.JustDown(keys.keyDown1) || Phaser.Input.Keyboard.JustDown(keys.keyDown2)) {
            this.stateMachine.transition('twoP');
            return;
        }
        if (Phaser.Input.Keyboard.JustDown(keys.keySelect1) || Phaser.Input.Keyboard.JustDown(keys.keySelect2)) {
            gameEventManager.emit('startGame', "1");
            let rand = Phaser.Math.RND.between(0, 2);
            scene.sound.play(`block${rand}`, {volume: 1});
        }
    }
}

class MenuSelect2P extends State {
    enter(scene, selector, keys) {
        selector.setPosition(width/2-80, height/2+108);
    }
    execute(scene, selector, keys) {
        if(Phaser.Input.Keyboard.JustDown(keys.keyUp1) || Phaser.Input.Keyboard.JustDown(keys.keyUp2)
        || Phaser.Input.Keyboard.JustDown(keys.keyDown1) || Phaser.Input.Keyboard.JustDown(keys.keyDown2)) {
            this.stateMachine.transition('oneP');
            return;
        }
        if (Phaser.Input.Keyboard.JustDown(keys.keySelect1) || Phaser.Input.Keyboard.JustDown(keys.keySelect2)) {
            gameEventManager.emit('startGame', "2");
        }
    }
}