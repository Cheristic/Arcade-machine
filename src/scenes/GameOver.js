
class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
    }

    init(data) {
        data.winner.anims.stop();
        data.winner.anims.play(data.winner.winAnim, true);
    }

    create() {

    }
}