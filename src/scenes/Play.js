class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.plugin('rexquadimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexquadimageplugin.min.js', true);
        this.load.plugin('rexcontainerliteplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcontainerliteplugin.min.js', true);
        this.load.plugin('rexquadimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexquadimageplugin.min.js', true);
        this.load.plugin('rexperspectiveimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexperspectiveimageplugin.min.js', true);

    }

    create() {
        // This will activate after 3 seconds and the game will begin
        this.countdownTimer = this.time.delayedCall(3000, () => {
            gameActive = true;
        }, null, this);
        
        this.speckContainer = this.add.rexContainerLite(0 ,0, width, height);
        this.image = this.add.rexPerspectiveRenderTexture({
            x: 399,
            y: 515,
            width: scr_width,
            height: scr_height,
            add: true
        });
        
        
        this.fightbg = this.add.sprite(scr_width/2, scr_height/2, "fight-bg0").setOrigin(0.5);
        this.marioFighter = new FighterMario(this, scr_width/2+40, scr_height/2).setOrigin(0.5);
        this.luigiFighter = new FighterLuigi(this, scr_width/2-40, scr_height/2).setOrigin(0.5);
        this.luigiFighter.flipX = true;

        
        this.lugHealthBarY = this.add.sprite(scr_width/2-280, 50, "health-bar-yellow").setOrigin(0, 0.5);
        this.lugHealthBarG = this.add.sprite(scr_width/2-280, 50, "health-bar-green").setOrigin(0, 0.5);
        this.marHealthBarY = this.add.sprite(scr_width/2+280, 50, "health-bar-yellow").setOrigin(1, 0.5);
        this.marHealthBarG = this.add.sprite(scr_width/2+280, 50, "health-bar-green").setOrigin(1, 0.5);



        this.speckContainer.addMultiple([this.fightbg, this.marioFighter, this.luigiFighter, this.lugHealthBarY, 
            this.lugHealthBarG, this.marHealthBarY, this.marHealthBarG]);
        this.updateGroup = this.add.group([this.fightbg, this.marioFighter, this.luigiFighter, this.lugHealthBarY, 
            this.lugHealthBarG, this.marHealthBarY, this.marHealthBarG]);        
        this.perspective = this.plugins.get('rexperspectiveimageplugin').addContainerPerspective(this.speckContainer, {
            useParentBounds: false,
        });
        this.image.transformVerts(0, 0, 0, -.210, 0, 0)
        this.perspective.enter();        

        gameEventManager.on('end game', this.endGame, this)

        // #### DEBUGGING ####
        this.debugKEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.physics.world.debugGraphic.clear();
        this.physics.world.drawDebug = false;
    }

    update(time, delta) {
        // IF GAME IS HAPPENING
        if (gameActive) {            
            this.marHealthBarG.scaleX = this.marioFighter.currentHealth/100;
            this.lugHealthBarG.scaleX = this.luigiFighter.currentHealth/100;

            this.marioFighter.fighterFSM.step();
            this.luigiFighter.fighterFSM.step();
        }

        

        // Render skewed objects
        this.image.rt.clear();
        this.image.rt.draw(this.updateGroup.getChildren());

        // #### DEBUGGING ####
        if (Phaser.Input.Keyboard.JustDown(this.debugKEY)) {
            this.physics.world.debugGraphic.clear();
            this.physics.world.drawDebug = !(this.physics.world.drawDebug);
        }
    }
    

    endGame(fighter) {
        gameActive = false;
        if (!this.scene.isActive('gameOverScene')) {
            this.scene.launch('gameOverScene', {winner: fighter});
        } else {
            this.scene.get('gameOverScene').restart();
            this.scene.resume('gameOverScene', {winner: fighter});
        }
    }
}