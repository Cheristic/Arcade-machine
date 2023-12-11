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

        this.botStateData = {
            idle_timer: null,
            block_timer: null,
            block_count: 0,
            attack_timer: null,
            attack_timer_length: 0,
            prev_state: null
        }

        this.fighterFSM = new StateMachine('idle', {
            idle: new IdleBotState(),
            high: new HighHitBotState(),
            mid: new MidHitBotState(),
            low: new LowHitBotState(),
            hit: new DamagedBotState(),
            block: new BlockedBotState(),
            block_high: new HighBlockBotState(),
            block_mid: new MidBlockBotState(),
            block_low: new LowBlockBotState()
        }, [scene, this, enemy, this.botStateData]);

        this.blockDelay = 500;
        this.hitDelay = 500;
        this.attackAnticipationFrames = 4;

        this.isAttacking = false;

        moveEventManager.on("opponentAttack", this.handleMoveCheck, this)
        
        this.botFSM = new StateMachine('idle', {
            idle: new AIIdleState(),
            block: new AIBlockState(),
            attack: new AIAttackState(),
            blocked: new AIBlockedState(),
            hit: new AIHitState()
        }, [scene, this, enemy, this.botStateData]);

        this.idleAnim = "mar-idle";
        this.highHitAnim = "mar-high";
        this.midHitAnim = "mar-mid";
        this.lowHitAnim = "mar-low";
        this.winAnim = "mar-win";
        this.hitAnim ="mar-hit";
        this.blockAnim = "mar-block";
        this.deadAnim = "mar-dead";

        this.currentAIState = "idle";
    }

    preUpdate(delta, time) {
        super.preUpdate(delta, time);

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
            scoreEventManager.emit('hit', 'block-hit');
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
            scoreEventManager.emit('hit', 'super-hit');
            return;
        }

        // If none of these conditions are met = regular hit + recoil
        this.currentHealth -= 9;
        this.fighterFSM.transition("hit");
        let rand = Phaser.Math.RND.between(0, 2);
        this.scene.sound.play(`dmg${rand}`, {volume: 1});
        scoreEventManager.emit('hit', 'norm-hit');
        return;
    }

}

class AIIdleState extends State {
    enter(scene, fighter, enemy, data) {
        if (!gameActive) return;
        fighter.currentAIState = "idle";
        fighter.fighterFSM.transition('idle');
        if (data.idle_timer == null) { // start timer
            let timerLength = Phaser.Math.RND.between(350, 650);
            data.idle_timer = scene.time.delayedCall(timerLength, () => {
                data.idle_timer.remove();
                data.idle_timer = null;
                this.stateMachine.transition('block');
            }, null, this);
        } else { // resume timer
            data.idle_timer.paused = false;
        }
    }
    exit(scene, fighter, enemy, data) {
        data.prev_state = "idle";
        if (data.idle_timer != null) data.idle_timer.paused = true;
    }
}

class AIBlockState extends State {
    enter(scene, fighter, enemy, data) {
        if (!gameActive) return;
        fighter.currentAIState = "block";
        if (data.block_count <= 0) { // initialize block phase
            data.block_count = Phaser.Math.RND.between(1, 3);
        }
        if (data.block_timer != null) { // resume timer
            data.block_timer.paused = false;
        }
    }
    execute(scene, fighter, enemy, data) {
        if (data.block_timer == null) { // start or restart timer

            // Choose block type
            // check to follow enemy movement
            if (enemy.currentState == "block_high" || enemy.currentState == "high") {
                fighter.fighterFSM.transition('block_high')
            } else if (enemy.currentState == "block_mid" || enemy.currentState == "mid") {
                fighter.fighterFSM.transition('block_mid')
            } else if (enemy.currentState == "block_low" || enemy.currentState == "low"){
                fighter.fighterFSM.transition('block_low')
            } else { // choose own movement
                let blockType = Phaser.Math.RND.between(1, 3);
                if (blockType == 1) fighter.fighterFSM.transition('block_high')
                else if (blockType == 2) fighter.fighterFSM.transition('block_mid')
                else fighter.fighterFSM.transition('block_low')
            }
            let timerLength = Phaser.Math.RND.between(400, 600);
            data.block_timer = scene.time.delayedCall(timerLength, () => {
                data.block_count--;
                data.block_timer.remove();
                data.block_timer = null;
                if (data.block_count <= 0) {
                    this.stateMachine.transition('attack');
                }
            }, null, this);
        } 
    }
    exit(scene, fighter, enemy, data) {
        data.prev_state = "block";
        if (data.block_timer != null) data.block_timer.paused = true;
    }
}

class AIAttackState extends State {
    enter(scene, fighter, enemy, data) {
        if (!gameActive) return;
        fighter.currentAIState = "attack";
        let superMove = Phaser.Math.RND.between(1, 2);
        let selectedMove;
        // chose move based on enemy movement
        if (enemy.currentState == "block_high" || enemy.currentState == "high") {
            superMove == 1 ? selectedMove = "low" : selectedMove = "mid";
        } else if (enemy.currentState == "block_mid" || enemy.currentState == "mid") {
            superMove == 1 ? selectedMove = "high" : selectedMove = "low";
        } else if (enemy.currentState == "block_low" || enemy.currentState == "low"){
            selectedMove = "mid";
        } else { // choose own movement
            let attackType = Phaser.Math.RND.between(1, 3);
            if (attackType == 1) selectedMove = "high"
            else if (attackType == 2) selectedMove = "mid"
            else selectedMove = "low"
        }
        
        // Transition to block
        fighter.fighterFSM.transition(`block_${selectedMove}`)

        data.attack_timer_length = Phaser.Math.RND.between(200, 500);
        data.attack_timer = scene.time.delayedCall(data.attack_timer_length, () => {
            data.idle_timer = null;
            fighter.fighterFSM.transition(selectedMove);
        }, null, this);
    }
    exit(scene, fighter, enemy, data) {
        data.prev_state = "attack";
        if (data.attack_timer != null) {
            data.attack_timer.remove(); 
            data.attack_timer = null;
        }
    }
}

class AIBlockedState extends State {
    enter(scene, fighter, enemy, data) {
        if (!gameActive) return;
        fighter.currentAIState = "blocked";
    }
}

class AIHitState extends State {
    enter(scene, fighter, enemy, data) {
        if (!gameActive) return;
        fighter.currentAIState = "hit";
    }
}

class IdleBotState extends State {
    enter(scene, fighter) {
        if (!gameActive) return;
        fighter.anims.stop();
        fighter.anims.play(fighter.idleAnim, true);
        fighter.currentState = "idle";
    }
}

class HighHitBotState extends State {
    enter(scene, fighter) {
        if (!gameActive) return;
        fighter.anims.play(fighter.highHitAnim, true);
        fighter.once('animationcomplete', () => {
            fighter.isAttacking = false;
            fighter.botFSM.transition('idle');
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

class MidHitBotState extends State {
    enter(scene, fighter) {
        if (!gameActive) return;
        fighter.anims.play(fighter.midHitAnim, true);
        fighter.once('animationcomplete', () => {
            fighter.isAttacking = false;
            fighter.botFSM.transition('idle');
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

class LowHitBotState extends State {
    enter(scene, fighter) {
        if (!gameActive) return;
        fighter.anims.play(fighter.lowHitAnim, true);
        fighter.once('animationcomplete', () => {
            fighter.isAttacking = false;
            fighter.botFSM.transition('idle');
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

class HighBlockBotState extends State {
    enter(scene, fighter) {
        fighter.anims.stop();
        fighter.setTexture(fighter.highHitAnim, 0);
        fighter.currentState = "block_high";
    }
}
class MidBlockBotState extends State {
    enter(scene, fighter) {
        if (!gameActive) return;
        fighter.anims.stop();
        fighter.setTexture(fighter.midHitAnim, 0);
        fighter.currentState = "block_mid";
    }
}
class LowBlockBotState extends State {
    enter(scene, fighter) {
        if (!gameActive) return;
        fighter.anims.stop();
        fighter.setTexture(fighter.lowHitAnim, 0);
        fighter.currentState = "block_low";
    }
}

class DamagedBotState extends State {
    enter(scene, fighter, enemy, data) {
        if (!gameActive) return;
        fighter.anims.stop();
        fighter.setTexture(fighter.hitAnim);
        fighter.currentState = "hit";
        fighter.botFSM.transition('hit');
        scene.time.delayedCall(fighter.hitDelay, () => {
            fighter.botFSM.transition(data.prev_state)
        }, null, this);
    }
}

class BlockedBotState extends State {
    enter(scene, fighter, enemy, data) {
        if (!gameActive) return;
        fighter.anims.stop();
        fighter.setTexture(fighter.blockAnim);
        fighter.currentState = "block";
        fighter.botFSM.transition('blocked');
        scene.time.delayedCall(fighter.blockDelay, () => {
            fighter.botFSM.transition(data.prev_state)
        }, null, this);
    }
}