class FighterLuigi extends Fighter {
    constructor(scene, x, y) {
        super(scene, x, y, "luigi");

        this.idleAnim = "lug-idle";
        this.highHitAnim = "lug-high";
        this.midHitAnim = "lug-mid";
        this.lowHitAnim = "lug-low";
        this.winAnim = "lug-win";
        this.hitAnim ="lug-hit";
        this.blockAnim = "lug-block";
        this.deadAnim = "lug-dead";

        this.keyHigh = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyMid = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyLow = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        
    }
}