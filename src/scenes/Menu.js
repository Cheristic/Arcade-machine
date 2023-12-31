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

        menuConfig.fontSize = '40px';
        this.menuText = this.add.text(scr_width/2,250,
        'ARCADE MACHINE\nfrom\nANIMAL CROSSING', menuConfig).setOrigin(0.5);

        this.started = false;

        this.spaceKEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.selector = this.add.sprite(scr_width/2-80, scr_height/2+86, 'selector');

        // Create object to pass to state machine holding key inputs
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
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        };
        
        this.menuText2 = this.add.text(scr_width/2,scr_height/2+100,
        '1P START\n2P START', selectorTextConfig).setOrigin(0.5);

        // Set score to 0
        scoreEventManager.emit('hit', 'reset');

        // Create perspective renderer
        this.speckContainer = this.add.rexContainerLite(0 ,0, width, height);
        this.image = this.add.rexPerspectiveRenderTexture({
            x: 399,
            y: 515,
            width: scr_width,
            height: scr_height,
            add: true
        });
        this.speckContainer.addMultiple([this.menuText, this.menuText2, this.selector]);
        this.updateGroup = this.add.group([this.menuText, this.menuText2, this.selector]);        
        this.perspective = this.plugins.get('rexperspectiveimageplugin').addContainerPerspective(this.speckContainer, {
            useParentBounds: false,
        });
        this.image.transformVerts(0, 0, 0, -.210, 0, 0)
        this.perspective.enter();

    }

    update() {
        this.selectorFSM.step();
        // Render skewed objects
        this.image.rt.clear();
        this.image.rt.draw(this.updateGroup.getChildren());
    }

    startGame(mode) {
        gameEventManager.shutdown();
        if (restarted) {
            this.scene.get('playScene').scene.restart(mode);
            this.scene.stop('menuScene');
        } else {
            this.scene.start('playScene', mode);
        }
    }

}

class MenuSelect1P extends State {
    enter(scene, selector, keys) {
        selector.setPosition(scr_width/2-80, scr_height/2+86); // Set selector position
    }
    execute(scene, selector, keys) {
        // Navigate through menu and check for Select
        if(Phaser.Input.Keyboard.JustDown(keys.keyUp1) || Phaser.Input.Keyboard.JustDown(keys.keyUp2)
        || Phaser.Input.Keyboard.JustDown(keys.keyDown1) || Phaser.Input.Keyboard.JustDown(keys.keyDown2)) {
            this.stateMachine.transition('twoP');
            return;
        }
        if (Phaser.Input.Keyboard.JustDown(keys.keySelect1) || Phaser.Input.Keyboard.JustDown(keys.keySelect2)) {
            gameEventManager.emit('startGame', "1");
            scene.sound.play(`ding`, {volume: 1});
        }
    }
}

class MenuSelect2P extends State {
    enter(scene, selector, keys) {
        selector.setPosition(scr_width/2-80, scr_height/2+108); // Set selector position
    }
    execute(scene, selector, keys) {
        // Navigate through menu and check for Select
        if(Phaser.Input.Keyboard.JustDown(keys.keyUp1) || Phaser.Input.Keyboard.JustDown(keys.keyUp2)
        || Phaser.Input.Keyboard.JustDown(keys.keyDown1) || Phaser.Input.Keyboard.JustDown(keys.keyDown2)) {
            this.stateMachine.transition('oneP');
            return;
        }
        if (Phaser.Input.Keyboard.JustDown(keys.keySelect1) || Phaser.Input.Keyboard.JustDown(keys.keySelect2)) {
            gameEventManager.emit('startGame', "2");
            scene.sound.play(`ding`, {volume: 1});
        }
    }
}