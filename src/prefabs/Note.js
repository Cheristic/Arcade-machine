class Note extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, note_index) {
        super(scene, x, y, "note-small");
        scene.add.existing(this);
        this.scene = scene;
        this.setInteractive({useHandCursor: true})
        this.note_index = note_index;
        this.isBeingDragged = false;
        this.name = "note-small"
    }
}