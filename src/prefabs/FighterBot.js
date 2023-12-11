class FighterBot extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, enemy) {
        super(scene, x, y);

        // add object to existing scene
        scene.add.existing(this);
        this.scene = scene;

        // Unique mario/luigi information
        this.fighterType = "mario";

        this.currentState = "idle";

        this.currentHealth = 100;

        this.fighterFSM = new StateMachine('idle', {
            idle: new IdleState(),
            high: new HighHitState(),
            mid: new MidHitState(),
            low: new LowHitState(),
            hit: new DamagedState(),
            block: new BlockedState(),
            block_high: new HighBlockState(),
            block_mid: new MidBlockState(),
            block_low: new LowBlockState()
        }, [scene, this]);

        this.blockDelay = 500;
        this.hitDelay = 1000;
        this.attackAnticipationFrames = 4;

        this.isAttacking = false;

        moveEventManager.on("opponentAttack", this.handleMoveCheck, this);

        this.idleAnim = "mar-idle";
        this.highHitAnim = "mar-high";
        this.midHitAnim = "mar-mid";
        this.lowHitAnim = "mar-low";
        this.winAnim = "mar-win";
        this.hitAnim ="mar-hit";
        this.blockAnim = "mar-block";
        this.deadAnim = "mar-dead";
    }

    preUpdate(delta, time) {
        super.preUpdate(delta, time);

        this.enemyAIChecker();


        // CHECK FOR END OF GAME
        if (this.currentHealth <= 0 && gameActive) {
            gameEventManager.emit('end game', this.fighterType);
        }
    }  

    handleMoveCheck(fighterType, move) {
        if(fighterType == this.fighterType) return;
        if (this.currentState == "hit" || this.currentState == "block") return;

        if (this.currentState == "idle") {
            // BLOCKED + recoil
            this.currentHealth -= 5;
            this.fighterFSM.transition('block');
            let rand = Phaser.Math.RND.between(0, 2);
            this.scene.sound.play(`block${rand}`, {volume: 1});
            return;
        } else if (move == "high" && this.currentState == "block_high" 
        || move == "mid" &&  this.currentState == "block_mid"
        || move == "low" && this.currentState == "block_low"
        || move == this.currentState || move == "high" && this.currentState == "block_low"
        || move == "high" && this.currentState == "low") {
            // BLOCKED BUT NO RECOIL OR DAMAGE
            let rand = Phaser.Math.RND.between(0, 2);
            this.scene.sound.play(`block${rand}`, {volume: 1});
            return;
        } else if (move == "high" && this.currentState == "mid" 
        || move == "mid" &&  this.currentState == "low"
        || move == "low" && this.currentState == "high") {
            // HANDLE SUPER EFFECTIVE
            this.currentHealth -= 15;
            this.fighterFSM.transition("hit");
            let rand = Phaser.Math.RND.between(0, 2);
            this.scene.sound.play(`super_dmg${rand}`, {volume: 1});
            return;
        }

        // If none of these conditions are met = regular hit + recoil
        this.currentHealth -= 9;
        this.fighterFSM.transition("hit");
        let rand = Phaser.Math.RND.between(0, 2);
        this.scene.sound.play(`dmg${rand}`, {volume: 1});
        return;
    }

    enemyAIChecker() {

    }
}

class IdleState extends State {
    enter(scene, fighter) {
        if (!gameActive) return;
        fighter.anims.stop();
        fighter.anims.play(fighter.idleAnim, true);
        fighter.currentState = "idle";
    }
    execute(scene, fighter) {
        if (!gameActive) return;
        if(Phaser.Input.Keyboard.JustDown(fighter.keyHigh)) {
            this.stateMachine.transition('block_high');
            return;
        }
        if(Phaser.Input.Keyboard.JustDown(fighter.keyMid)) {
            this.stateMachine.transition('block_mid');
            return;
        }
        if(Phaser.Input.Keyboard.JustDown(fighter.keyLow)) {
            this.stateMachine.transition('block_low');
            return;
        }
    }
}

class HighHitState extends State {
    enter(scene, fighter) {
        if (!gameActive) return;
        fighter.anims.play(fighter.highHitAnim, true);
        fighter.once('animationcomplete', () => {
            fighter.isAttacking = false;
            this.stateMachine.transition('idle');
        });
        fighter.currentState = "high";
    }
    execute(scene, fighter) {
        if(fighter.anims.currentFrame.index == fighter.attackAnticipationFrames) {
            // INITIATE HIT
            if (fighter.isAttacking) return;
            fighter.isAttacking = true;
            moveEventManager.emit("opponentAttack", fighter.fighterType, "high");
        }
    }
}

class MidHitState extends State {
    enter(scene, fighter) {
        if (!gameActive) return;
        fighter.anims.play(fighter.midHitAnim, true);
        fighter.once('animationcomplete', () => {
            fighter.isAttacking = false;
            this.stateMachine.transition('idle');
        });
        fighter.currentState = "mid";
    }
    execute(scene, fighter) {
        if(fighter.anims.currentFrame.index == fighter.attackAnticipationFrames) {
            // INITIATE HIT
            if (fighter.isAttacking) return;
            fighter.isAttacking = true;
            moveEventManager.emit("opponentAttack", fighter.fighterType, "mid");
        }
    }
}

class LowHitState extends State {
    enter(scene, fighter) {
        if (!gameActive) return;
        fighter.anims.play(fighter.lowHitAnim, true);
        fighter.once('animationcomplete', () => {
            fighter.isAttacking = false;
            this.stateMachine.transition('idle');
        });
        fighter.currentState = "low";
    }
    execute(scene, fighter) {
        if(fighter.anims.currentFrame.index == fighter.attackAnticipationFrames) {
            // INITIATE HIT
            if (fighter.isAttacking) return;
            fighter.isAttacking = true;
            moveEventManager.emit("opponentAttack", fighter.fighterType, "low");
        }
    }
}

class HighBlockState extends State {
    enter(scene, fighter) {
        fighter.anims.stop();
        fighter.setTexture(fighter.highHitAnim, 0);
        fighter.currentState = "block_high";
    }
    execute(scene, fighter) {
        if (!gameActive) return;
        
        if(Phaser.Input.Keyboard.JustDown(fighter.keyHigh)) {
            this.stateMachine.transition('block_high');
            return;
        }
        if(Phaser.Input.Keyboard.JustDown(fighter.keyMid)) {
            this.stateMachine.transition('block_mid');
            return;
        }
        if(Phaser.Input.Keyboard.JustDown(fighter.keyLow)) {
            this.stateMachine.transition('block_low');
            return;
        }
        if (Phaser.Input.Keyboard.JustUp(fighter.keyHigh)) {
            this.stateMachine.transition('high');
        }
    }
}
class MidBlockState extends State {
    enter(scene, fighter) {
        if (!gameActive) return;
        fighter.anims.stop();
        fighter.setTexture(fighter.midHitAnim, 0);
        fighter.currentState = "block_mid";
    }
    execute(scene, fighter) {
        if (!gameActive) return;
        
        if(Phaser.Input.Keyboard.JustDown(fighter.keyHigh)) {
            this.stateMachine.transition('block_high');
            return;
        }
        if(Phaser.Input.Keyboard.JustDown(fighter.keyMid)) {
            this.stateMachine.transition('block_mid');
            return;
        }
        if(Phaser.Input.Keyboard.JustDown(fighter.keyLow)) {
            this.stateMachine.transition('block_low');
            return;
        }
        if (Phaser.Input.Keyboard.JustUp(fighter.keyMid)) {
            this.stateMachine.transition('mid');
        }
    }
}
class LowBlockState extends State {
    enter(scene, fighter) {
        if (!gameActive) return;
        fighter.anims.stop();
        fighter.setTexture(fighter.lowHitAnim, 0);
        fighter.currentState = "block_low";
    }
    execute(scene, fighter) {
        if (!gameActive) return;
        
        if(Phaser.Input.Keyboard.JustDown(fighter.keyHigh)) {
            this.stateMachine.transition('block_high');
            return;
        }
        if(Phaser.Input.Keyboard.JustDown(fighter.keyMid)) {
            this.stateMachine.transition('block_mid');
            return;
        }
        if(Phaser.Input.Keyboard.JustDown(fighter.keyLow)) {
            this.stateMachine.transition('block_low');
            return;
        }
        if (Phaser.Input.Keyboard.JustUp(fighter.keyLow)) {
            this.stateMachine.transition('low');
        }
    }
}

class DamagedState extends State {
    enter(scene, fighter) {
        if (!gameActive) return;
        fighter.anims.stop();
        fighter.setTexture(fighter.hitAnim);
        fighter.currentState = "hit";
        scene.time.delayedCall(fighter.hitDelay, () => {
            this.stateMachine.transition('idle');
        }, null, this);
    }
}

class BlockedState extends State {
    enter(scene, fighter) {
        if (!gameActive) return;
        fighter.anims.stop();
        fighter.setTexture(fighter.blockAnim);
        fighter.currentState = "block";
        scene.time.delayedCall(fighter.blockDelay, () => {
            this.stateMachine.transition('idle');
        }, null, this);
    }
}