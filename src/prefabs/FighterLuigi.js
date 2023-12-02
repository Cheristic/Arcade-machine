class FighterLuigi extends Fighter {
    constructor(scene, x, y) {
        super(scene, x, y, "luigi");

        this.idleAnim = "mar-idle";
        this.highHitAnim = "mar-high";
        this.midHitAnim = "mar-mid";
        this.lowHitAnim = "mar-low";

        this.keyHigh = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyMid = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyLow = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        
    }
}