
class UI extends Phaser.Scene {
    constructor() {
        super("UIScene");
        // UI manages Notes and Score
    }

    create() {
        // Create initial small note
        var note0 = new Note(this, width-70, height-400, 0);
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
        .setVisible(false)
    }

    update() {
        this.scene.bringToTop();
    }

    openNote(note_index) {
        this.currNoteIndex = note_index;
        this.bigNotes.getChildren()[note_index].visible = true;
        this.noteXButton.visible = true;
    }

    addRemainingNotes() {
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
}