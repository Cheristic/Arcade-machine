class Wedge extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, width/2, 0)
        this.scene = scene;
        scene.add.existing(this);

        this.create();
        
        this.hasAwardedPoints = false;

        this.angleTracker = 0;
        eventEmitter.on('restart', this.onRestart, this);
    }

    preUpdate() {
        Phaser.Actions.RotateAround(this.list, { x: 0, y: height/2 }, Phaser.Math.DegToRad(rotationSpeed));
        this.angleTracker+=rotationSpeed;
        if(this.angleTracker > 190 && !this.hasAwardedPoints && gameActive) {
            this.hasAwardedPoints = true;
            eventEmitter.emit("scorePoints");

        }
    }

    onRestart() {
        this.destroy();
    }

}

Phaser.GameObjects.GameObjectFactory.register("wedge", function (scene, id) {
    let wedge;
    switch(id) {
        case 1: wedge = new Wedge1(scene); break;
        case 2: wedge = new Wedge2(scene); break;
        case 3: wedge = new Wedge3(scene); break;
        case 4: wedge = new Wedge4(scene); break;
        case 5: wedge = new Wedge5(scene); break;
        case 6: wedge = new Wedge6(scene); break;
        case 7: wedge = new Wedge7(scene); break;
        case 8: wedge = new Wedge8(scene); break;
    }


    this.displayList.add(wedge)
    this.updateList.add(wedge)

    return wedge
})

