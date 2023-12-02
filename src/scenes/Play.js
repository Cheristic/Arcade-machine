class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // This will activate after 3 seconds and the game will begin
        this.countdownTimer = this.time.delayedCall(3000, () => {
            gameActive = true;
        }, null, this);

        this.marioFighter = new FighterMario(this, width/2+40, height/2);
        this.luigiFighter = new FighterLuigi(this, width/2-40, height/2);
        this.luigiFighter.flipX = true;

        // #### DEBUGGING ####
        this.debugKEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.physics.world.debugGraphic.clear();
        this.physics.world.drawDebug = false;
    }

    update(time, delta) {
        // IF GAME IS HAPPENING
        if (gameActive) {
            this.handleCollisionCheck();
        }

        this.marioFighter.fighterFSM.step();
        this.luigiFighter.fighterFSM.step();

        // #### DEBUGGING ####
        if (Phaser.Input.Keyboard.JustDown(this.debugKEY)) {
            this.physics.world.debugGraphic.clear();
            this.physics.world.drawDebug = !(this.physics.world.drawDebug);
        }
    }

    handleCollisionCheck() {

    }
}