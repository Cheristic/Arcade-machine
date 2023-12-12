class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    init(mode) {
        this.mode = mode;
    }

    create() {
        // This will activate after 3 seconds and the game timer will begin
        this.countdownTimer = this.time.delayedCall(3000, () => {
            gameActive = true;
            this.gameTimer = this.time.delayedCall(timerLength, () => {
                gameEventManager.emit('end game', null);
            }, null, this);
        }, null, this);
    

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

        // Create health bars
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

        this.speckContainer = this.add.rexContainerLite(0 ,0, width, height);
        this.image = this.add.rexPerspectiveRenderTexture({
            x: 399,
            y: 515,
            width: scr_width,
            height: scr_height,
            add: true
        });
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

    }

    update(time, delta) {
        // IF GAME IS HAPPENING
        if (gameActive) {            
            this.marHealthBarG.scaleX = this.marioFighter.currentHealth/100;
            this.lugHealthBarG.scaleX = this.luigiFighter.currentHealth/100;

            // Update state machines
            this.marioFighter.fighterFSM.step();
            if (this.mode == "1") this.marioFighter.botFSM.step();
            this.luigiFighter.fighterFSM.step();

            // Update timer
            this.gameTimerText.text = Math.ceil(this.gameTimer.getRemainingSeconds());
        }

        // Render skewed objects
        this.image.rt.clear();
        this.image.rt.draw(this.updateGroup.getChildren());
    }
    

    endGame(fighter) {
        gameActive = false;
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
            } else { // EXACT SAME HEALTH SO TIE
                this.scene.launch('gameOverScene', {winner: this.luigiFighter, loser: this.marioFighter, tie: "yes"});
            }
        } else { // FIGHTER DIED
            this.sound.play(`explosion`, {volume: 1});
            if (fighter == "mario") { // LUIGI WINS
                this.marHealthBarG.scaleX = 0;
                this.explosion.setPosition(scr_width/2+120, scr_height/2-140)
                this.updateGroup.add(this.explosion);
                this.explosion.anims.play('explosion');
                this.scene.launch('gameOverScene', {winner: this.luigiFighter, loser: this.marioFighter, tie: "no"});
            } else { // MARIO WINS
                this.lugHealthBarG.scaleX = 0;
                this.explosion.setPosition(scr_width/2-120, scr_height/2-140)
                this.updateGroup.add(this.explosion);
                this.explosion.anims.play('explosion');
                this.scene.launch('gameOverScene', {winner: this.marioFighter, loser: this.luigiFighter, tie: "no"});
            }  
        }
        if (this.mode == "1") { // Add clock score and achievement
            if (fighter == "luigi") this.scene.get('UIScene').unlockNote(3); // Lose unlocks note
            else {
                if (this.luigiFighter.currentHealth == 100) this.scene.get('UIScene').unlockNote(4); // Achievement for no damage
                this.clockScore(Math.ceil(this.gameTimer.getRemainingSeconds())); 
            }
        }
        this.gameTimer.remove(false);
    }

    clockScore(currScore) {
        this.time.delayedCall(80, () => {
            if (currScore > 0) {
                currScore--;
                this.gameTimerText.text = currScore;
                scoreEventManager.emit('hit', 1)
                this.sound.play(`ding`, {volume: .25});
                this.clockScore(currScore)
            } else {
                this.healthScore(this.luigiFighter.currentHealth)
            }
        }, null, this);
    }

    healthScore(currHealth) {
        this.time.delayedCall(80, () => {
            if (currHealth > 0) {
                currHealth-=5;
                this.lugHealthBarG.scaleX = currHealth/100;
                scoreEventManager.emit('hit', 1)
                this.sound.play(`ding`, {volume: .25});
                this.healthScore(currHealth)
            } else {
                this.lugHealthBarG.scaleX = 0;
            }
        }, null, this);
    }

    onDestroy() {
        // Destroy all spawned game objects and reset event emitters
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