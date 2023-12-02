class Fighter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, fighterType) {
        super(scene, x, y);

        // add object to existing scene
        scene.add.existing(this);
        this.scene = scene;

        // Unique mario/luigi information
        this.fighterType = fighterType;

        this.currentState = "idle";

        this.currentHealth = 20;

        this.fighterFSM = new StateMachine('idle', {
            idle: new IdleState(),
            high: new HighHitState(),
            mid: new MidHitState(),
            low: new LowHitState(),
            hit: new DamagedState(),
            block: new BlockedState()
        }, [scene, this]);

        moveEventManager.on("opponentAttack", this.handleMoveCheck, this)
    }

    preUpdate(delta, time) {
        super.preUpdate(delta, time);
    }  

    handleMoveCheck(fighterType, move) {
        if(fighterType == this.fighterType) return;

        if (this.currentState == "idle") {
            // BLOCKED + recoil
            this.currentHealth -= 1;
            this.fighterFSM.transition('block');
            return;
        } else if (move == "high" && this.currentState == "block-high" 
        || move == "mid" &&  this.currentState == "block-mid"
        || move == "low" && this.currentState == "block-low"
        || move == this.currentState) {
            // BLOCKED BUT NO RECOIL OR DAMAGE
            return;
        } else if (move == "high" && this.currentState == "mid" 
        || move == "mid" &&  this.currentState == "low"
        || move == "low" && this.currentState == "high") {
            // HANDLE SUPER EFFECTIVE
            this.currentHealth -= 5;
            this.fighterFSM.transition("hit");
            return;
        }

        // If none of these conditions are met = regular hit + recoil
        this.currentHealth -= 3;
        this.fighterFSM.transition("hit");
        return;
    }
}

class IdleState extends State {
    enter(scene, fighter) {
        fighter.anims.stop();
        fighter.anims.play(fighter.idleAnim, true);
        fighter.currentState = "idle";
    }
    execute(scene, fighter) {
        if(Phaser.Input.Keyboard.JustDown(fighter.keyHigh)) {
            this.stateMachine.transition('high');
            return;
        }
        if(Phaser.Input.Keyboard.JustDown(fighter.keyMid)) {
            this.stateMachine.transition('mid');
            return;
        }
        if(Phaser.Input.Keyboard.JustDown(fighter.keyLow)) {
            this.stateMachine.transition('low');
            return;
        }
    }
}

class HighHitState extends State {
    enter(scene, fighter) {
        fighter.anims.play(fighter.highHitAnim, true);
        fighter.once('animationcomplete', () => {
            this.stateMachine.transition('idle');
        });
        fighter.currentState = "block-high";
    }
    execute(scene, fighter) {
        if(fighter.anims.currentFrame.index == 6) {
            // INITIATE HIT
            moveEventManager.emit("opponentAttack", fighter.fighterType, "high");
            fighter.currentState = "high";
        }
        if (fighter.anims.currentFrame.index < 6) {
            if(Phaser.Input.Keyboard.JustDown(fighter.keyHigh)) {
                this.stateMachine.transition('high');
                return;
            }
            if(Phaser.Input.Keyboard.JustDown(fighter.keyMid)) {
                this.stateMachine.transition('mid');
                return;
            }
            if(Phaser.Input.Keyboard.JustDown(fighter.keyLow)) {
                this.stateMachine.transition('low');
                return;
            }
        }
    }
}

class MidHitState extends State {
    enter(scene, fighter) {
        fighter.anims.play(fighter.midHitAnim, true);
        fighter.once('animationcomplete', () => {
            this.stateMachine.transition('idle');
        });
        fighter.currentState = "block-mid";
    }
    execute(scene, fighter) {
        if(fighter.anims.currentFrame.index == 6) {
            // INITIATE HIT
            moveEventManager.emit("opponentAttack", fighter.fighterType, "mid");
            fighter.currentState = "mid";
        }
        if (fighter.anims.currentFrame.index < 6) {
            if(Phaser.Input.Keyboard.JustDown(fighter.keyHigh)) {
                this.stateMachine.transition('high');
                return;
            }
            if(Phaser.Input.Keyboard.JustDown(fighter.keyMid)) {
                this.stateMachine.transition('mid');
                return;
            }
            if(Phaser.Input.Keyboard.JustDown(fighter.keyLow)) {
                this.stateMachine.transition('low');
                return;
            }
        }
    }
}

class LowHitState extends State {
    enter(scene, fighter) {
        fighter.anims.play(fighter.lowHitAnim, true);
        fighter.once('animationcomplete', () => {
            this.stateMachine.transition('idle');
        });
        fighter.currentState = "block-low";
    }
    execute(scene, fighter) {
        if(fighter.anims.currentFrame.index == 6) {
            // INITIATE HIT
            moveEventManager.emit("opponentAttack", fighter.fighterType, "low");
            fighter.currentState = "low";
        }
        if (fighter.anims.currentFrame.index < 6) {
            if(Phaser.Input.Keyboard.JustDown(fighter.keyHigh)) {
                this.stateMachine.transition('high');
                return;
            }
            if(Phaser.Input.Keyboard.JustDown(fighter.keyMid)) {
                this.stateMachine.transition('mid');
                return;
            }
            if(Phaser.Input.Keyboard.JustDown(fighter.keyLow)) {
                this.stateMachine.transition('low');
                return;
            }
        }
    }
}

class DamagedState extends State {
    enter(scene, fighter) {
        fighter.anims.stop();
        fighter.anims.play(fighter.idleAnim, true);
        fighter.currentState = "hit";
        scene.time.delayedCall(1000, () => {
            this.stateMachine.transition('idle');
        }, null, this);
    }
}

class BlockedState extends State {
    enter(scene, fighter) {
        fighter.anims.stop();
        fighter.anims.play(fighter.idleAnim, true);
        fighter.currentState = "hit";
        scene.time.delayedCall(1000, () => {
            this.stateMachine.transition('idle');
        }, null, this);
    }
}