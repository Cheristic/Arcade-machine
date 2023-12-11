
class UI extends Phaser.Scene {
    constructor() {
        super("UIScene");
        // UI manages Notes and Score
    }

    create() {
        // Create initial small note
        var note0 = new Note(this, width/2+30, height/2+130, 0);
        this.smallNotes = this.add.group([note0]);
        this.input.setDraggable(this.smallNotes.getChildren());
        this.noteIsOpened = false;
        // Handle drag

        // from https://github.com/photonstorm/phaser3-examples/blob/master/public/src/input/dragging/retain%20index%20after%20drag.js
        this.input.on('dragstart', (pointer, gameObject) => {
            if (gameObject.name != "note-small" || this.noteIsOpened) return;
            this.children.bringToTop(gameObject);
            gameObject.isBeingDragged = true;
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject.name != "note-small" || this.noteIsOpened) return;
            gameObject.setPosition(dragX, dragY);
        });


        this.input.dragDistanceThreshold = 5;

        this.input.on('pointerup', (pointer, gameObjects) => {
            if (gameObjects == null || gameObjects[0] == null || gameObjects[0].name != "note-small" || this.noteIsOpened) return;
            if (!gameObjects[0].isBeingDragged) {
                // CLICKED ON NOTE, OPEN IT UP
                this.noteIsOpened = true;
                this.openNote(gameObjects[0].note_index)
            }
            gameObjects[0].isBeingDragged = false;
        })

        let textConfig = {
            fontFamily: 'Pixel',
            fontStyle: 'Bold',
            fontSize: '32px',
            color: '#13362D',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        };

        this.currNoteIndex = 0;

        // Create big notes (start hidden)
        this.bigNotes = this.add.group();
        for(let i = 0; i < 1; i++) {
            let currNote = this.add.sprite(width/2, height/2, `note-big${i}`);
            currNote.setVisible(false);
            this.bigNotes.add(currNote);
        }

        // from https://webtips.dev/webtips/phaser/interactive-buttons-in-phaser3
        // X button for big notes (start hidden)
        this.noteXButton = this.add.text(width/2-100, height/2-200, 'X', textConfig)
        .setOrigin(0.5)
        .setPadding(10)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.bigNotes.getChildren()[this.currNoteIndex].visible = false;
            this.noteXButton.visible = false;
            this.noteIsOpened = false;
        })
        .on('pointerover', () => this.noteXButton.setStyle({ fill: '#f39c12' }))
        .on('pointerout', () => this.noteXButton.setStyle({ fill: textConfig.color }))
        .setVisible(false);

        let scoreTextConfig = {
            fontFamily: 'DSEG7',
            fontStyle: 'Bold',
            fontSize: '80px',
            color: '#A9E010',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            }
        };

        this.score = 0;
        this.scoreText = this.add.text(560, 18, this.score, scoreTextConfig).setOrigin(1, 0);

        // Render perspective
        this.speckContainer = this.add.rexContainerLite(0 ,0, width, height);
        this.image = this.add.rexPerspectiveRenderTexture({
            x: 400,
            y: 90,
            width: scr_width-50,
            height: 120,
            add: true
        });
        this.speckContainer.addMultiple([this.scoreText]);
        this.updateGroup = this.add.group([this.scoreText]);        
        this.perspective = this.plugins.get('rexperspectiveimageplugin').addContainerPerspective(this.speckContainer, {
            useParentBounds: false,
        });
        this.image.transformVerts(0, 0, 0, .11, 0, 0)
        this.perspective.enter();
        
        scoreEventManager.on('hit', this.updateScore, this);

    }

    update() {
        this.scene.bringToTop();
        // Render skewed objects
        this.image.rt.clear();
        this.image.rt.draw(this.updateGroup.getChildren());
    }

    openNote(note_index) {
        // Set the corresponding big note to visible and bring to front
        this.currNoteIndex = note_index;
        this.bigNotes.getChildren()[note_index].visible = true;
        this.bigNotes.getChildren()[note_index].depth = 10;
        this.noteXButton.visible = true;
        this.noteXButton.depth = 11;
    }

    addRemainingNotes() {
        // This is called on the first restart, it spawns the remaining notes for the tutorial
        let note1 = new Note(this, 70, height-300, 1);
        this.smallNotes = this.add.group([note1]);
        this.input.setDraggable(this.smallNotes.getChildren());

        for(let i = 1; i < 2; i++) {
            let currNote = this.add.sprite(width/2, height/2, `note-big${i}`);
            currNote.setVisible(false);
            this.bigNotes.add(currNote);
        }
        this.noteXButton.depth = 10;
    }

    updateScore(hit_type) {
        // Event emitter is linked here whenever an attack on the bot is initiated or the 1P game ends
        if (hit_type == "block-hit") {
            this.score += 500;
        } else if (hit_type == "super-hit") {
            this.score += 4000;
        } else if (hit_type == "norm-hit") {
            this.score += 1500
        } else if (hit_type == "reset") {
            this.score = 0;
        } else { // its the timer score
            this.score += hit_type * 400
        }
        this.scoreText.text = this.score;
    }
}