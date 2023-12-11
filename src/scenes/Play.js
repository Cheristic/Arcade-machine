class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    init(mode) {
        this.mode = mode;
    }

    create() {
        // This will activate after 3 seconds and the game will begin
        this.countdownTimer = this.time.delayedCall(3000, () => {
            gameActive = true;
            this.gameTimer = this.time.delayedCall(timerLength, () => {
                gameEventManager.emit('end game', null);
            }, null, this);
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
        this.luigiFighter = new FighterLuigi(this, scr_width/2-40, scr_height/2).setOrigin(0.5);
        this.luigiFighter.flipX = true;
        if (this.mode == "2") {
            // 2 PLAYERS
            this.marioFighter = new FighterMario(this, scr_width/2+40, scr_height/2).setOrigin(0.5);
        } else {
            // 1 PLAYER
            this.marioFighter = new FighterBot(this, scr_width/2+40, scr_height/2, this.luigiFighter).setOrigin(0.5);
        }
        
        

        
        this.lugHealthBarY = this.add.sprite(scr_width/2-280, 50, "health-bar-yellow").setOrigin(0, 0.5);
        this.lugHealthBarG = this.add.sprite(scr_width/2-280, 50, "health-bar-green").setOrigin(0, 0.5);
        this.marHealthBarY = this.add.sprite(scr_width/2+280, 50, "health-bar-yellow").setOrigin(1, 0.5);
        this.marHealthBarG = this.add.sprite(scr_width/2+280, 50, "health-bar-green").setOrigin(1, 0.5);

        this.explosion = this.add.sprite(0, 0, "explosion");
        this.explosion.setVisible(false);

        this.gameTimerTextConfig = {
            fontFamily: 'Pixel',
            fontSize: '40px',
            color: '#DE0000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        };

        this.gameTimerText = this.add.text(scr_width/2, 50, 
            "", this.gameTimerTextConfig).setOrigin(0.5);


        this.speckContainer.addMultiple([this.fightbg, this.marioFighter, this.luigiFighter, this.lugHealthBarY, 
            this.lugHealthBarG, this.marHealthBarY, this.marHealthBarG, this.gameTimerText, this.explosion]);
        this.updateGroup = this.add.group([this.fightbg, this.marioFighter, this.luigiFighter, this.lugHealthBarY, 
            this.lugHealthBarG, this.marHealthBarY, this.marHealthBarG, this.gameTimerText]);        
        this.perspective = this.plugins.get('rexperspectiveimageplugin').addContainerPerspective(this.speckContainer, {
            useParentBounds: false,
        });
        this.image.transformVerts(0, 0, 0, -.210, 0, 0)
        this.perspective.enter();        

        gameEventManager.on('end game', this.endGame, this);


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
            if (this.mode == "1") this.marioFighter.botFSM.step();
            this.luigiFighter.fighterFSM.step();

            // Update timer
            this.gameTimerText.text = Math.ceil(this.gameTimer.getRemainingSeconds());
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
        if (this.mode == "1") scoreEventManager.emit('hit', Math.ceil(this.gameTimer.getRemainingSeconds()));
        this.gameTimer.remove(false);
        this.sound.play(`win`, {volume: 1});
        if (fighter == null) { // TIME RAN OUT
            this.gameTimerText.text = 0;
            if (this.marioFighter.currentHealth > this.luigiFighter.currentHealth) { // MARIO WINS
                this.sound.play(`explosion`, {volume: 1});
                this.explosion.setPosition(scr_width/2-120, scr_height/2-140)
                this.updateGroup.add(this.explosion);
                this.explosion.anims.play('explosion');
                this.scene.launch('gameOverScene', {winner: this.marioFighter, loser: this.luigiFighter, tie: "no"});
            } else if (this.marioFighter.currentHealth < this.luigiFighter.currentHealth) { // LUIGI WINS
                this.sound.play(`explosion`, {volume: 1});
                this.explosion.setPosition(scr_width/2+120, scr_height/2-140)
                this.updateGroup.add(this.explosion);
                this.explosion.anims.play('explosion');
                this.scene.launch('gameOverScene', {winner: this.luigiFighter, loser: this.marioFighter, tie: "no"});
            } else { // EXACT SAME HEALTH
                this.scene.launch('gameOverScene', {winner: this.luigiFighter, loser: this.marioFighter, tie: "yes"});
            }
        } else {
            this.sound.play(`explosion`, {volume: 1});
            if (fighter == "mario") {
                this.marHealthBarG.scaleX = 0;
                this.explosion.setPosition(scr_width/2+120, scr_height/2-140)
                this.updateGroup.add(this.explosion);
                this.explosion.anims.play('explosion');
                this.scene.launch('gameOverScene', {winner: this.luigiFighter, loser: this.marioFighter, tie: "no"});
            } else {
                this.lugHealthBarG.scaleX = 0;
                this.explosion.setPosition(scr_width/2-120, scr_height/2-140)
                this.updateGroup.add(this.explosion);
                this.explosion.anims.play('explosion');
                this.scene.launch('gameOverScene', {winner: this.marioFighter, loser: this.luigiFighter, tie: "no"});
            }  
        }
    }

    onDestroy() {

        this.marioFighter.destroy();
        this.luigiFighter.destroy();
        this.fightbg.destroy();
        this.marHealthBarG.destroy();
        this.marHealthBarY.destroy();
        this.lugHealthBarG.destroy();
        this.lugHealthBarY.destroy();
        this.speckContainer.destroy();
        this.explosion.destroy();
        this.input.keyboard.clearCaptures();
        gameEventManager.shutdown();
        moveEventManager.shutdown();

    }
}