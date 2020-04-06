import drawBackground from "../ai/frameBackground";

//abstract
class Level extends Phaser.Scene {
  init(collisionCategories) {
    this.collisionCategories = collisionCategories;
  }

  setupCamera() {
    this.cameras.main.setBackgroundColor("ffffff");
    this.cameras.main.setZoom(1);
  }

  create() {
    this.setupCamera();
    drawBackground(this);
    //must be called by child class
    this.levelCreate();
  }

  gameOver() {
    this.fade(
      () => {
        this.gameOverMenu();
      },
      [250, 0, 0],
      0xff00000
    );
  }

  fade(onFadeFinish, rbgValues, hex) {
    this.cameras.main.fade(2000, ...rbgValues);

    this.cameras.main.on("camerafadeoutcomplete", () => {
      this.cameras.main.resetFX();
      var graphics = this.add.graphics();

      graphics.fillStyle(hex, 1);
      graphics.fillRect(0, 0, 1000, 1000);
      graphics.setDepth(100);
      onFadeFinish();
    });
  }

  gameOverMenu() {
    //TODO: need a way to destroy everything in scene
    const TEXT_STYLE = {
      fontSize: 60,
      fontFamily: "Arial",
      align: "left",
      // wordWrap: { width: 370, useAdvancedWrap: true },
      color: "white",
    };

    const text = [];

    //game over
    text.push(this.add.text(500, 300, "GAME OVER", TEXT_STYLE));

    //restart
    TEXT_STYLE.fontSize = 30;
    text.push(
      this.add
        .text(500, 400, "RESTART LEVEL", TEXT_STYLE)
        .setInteractive()
        .on("pointerdown", (event) => {
          this.resetScene();
        })
    );

    //main menu
    text.push(
      this.add
        .text(500, 460, "MAIN MENU", TEXT_STYLE)
        .setInteractive()
        .on("pointerdown", (event) => {
          this.scene.stop();
          this.scene.start("main_menu");
        })
    );

    text.forEach((aText) => {
      aText.x -= aText.width / 2;
      aText.setDepth(101);
    });
  }

  levelWin(onNextLevelClick) {
    this.fade(
      () => {
        this.levelWinMenu(onNextLevelClick);
      },
      [255, 255, 255],
      0xffffff
    );
  }

  levelWinMenu(onNextLevelClick) {
    //TODO: need a way to destroy everything in scene
    const TEXT_STYLE = {
      fontSize: 60,
      fontFamily: "Arial",
      align: "left",
      // wordWrap: { width: 370, useAdvancedWrap: true },
      color: "black",
    };

    const text = [];

    //game over
    text.push(this.add.text(500, 300, "LEVEL COMPLETE", TEXT_STYLE));

    //restart
    TEXT_STYLE.fontSize = 30;
    text.push(
      this.add
        .text(500, 400, "NEXT LEVEL", TEXT_STYLE)
        .setInteractive()
        .on("pointerdown", (event) => {
          onNextLevelClick();
        })
    );

    //main menu
    text.push(
      this.add
        .text(500, 460, "MAIN MENU", TEXT_STYLE)
        .setInteractive()
        .on("pointerdown", (event) => {
          this.scene.stop();
          this.scene.start("main_menu");
        })
    );

    text.forEach((aText) => {
      aText.x -= aText.width / 2;
      aText.setDepth(101);
    });
  }

  //when the dialogue is required to be in a position for the story to advance
  //position is before the text I want
  moveDialogueTo(position, dialogueArray) {
    this.dialogueProgress = position;
    this.robotDialogue.destroy();
    this.humanDialogue.destroy();
    this.robotDialogue.finished = true;
    this.humanDialogue.finished = true;
    this.handleDialogue(dialogueArray);
  }

  handleDialogue(dialogueArray) {
    //This is really bad
    //IMPROVEMENTS
    // 1 set the text directly in the level instead of using an array
    // 2 instead of having a hold type, use a method to clear dialogue and prevent it from advancing
    // 3 pass in the different dialogue types instead of using robot/human directly
    const currentSpeaker = (newDialogue) => {
      if (newDialogue.type === "human") {
        return this.humanDialogue;
      }
      return this.robotDialogue;
    };

    const speakerChanged = (speaker) => {
      return speaker.type != dialogueArray[this.dialogueProgress - 1].type;
    };

    const previousSpeaker = () => {
      if (dialogueArray[this.dialogueProgress - 1].type === "human") {
        return this.humanDialogue;
      }
      return this.robotDialogue;
    };

    const advanceDialogue = (speaker) => {
      if (speaker.finished) {
        speaker.destroy();
        speaker.setText(newDialogue.text);
        this.dialogueProgress++;
      } else {
        //if the last speaker was a different type
        if (!speaker.text) {
          speaker.setText(newDialogue.text);
          this.dialogueProgress++;
          return;
        }
        speaker.skip();
      }
    };
    //beginningGameDialogue.shift()

    const newDialogue = dialogueArray[this.dialogueProgress];

    if (!newDialogue) {
      if (!dialogueArray[this.dialogueProgress - 1]) {
        return;
      }

      //On the last dialogue in array
      const lastSpeaker = previousSpeaker();
      if (!lastSpeaker.finished) {
        lastSpeaker.skip();
        return;
      }
      this.humanDialogue.destroy();
      this.robotDialogue.destroy();
      this.dialogueProgress++;
      return;
    }

    //hold type advances the dialogue but shows nothing
    if (newDialogue.type === "hold") {
      const lastSpeaker = previousSpeaker();
      if (!lastSpeaker.finished) {
        lastSpeaker.skip();
      } else {
        lastSpeaker.destroy();
        this.dialogueProgress++;
      }
      return;
    }

    const speaker = currentSpeaker(newDialogue);

    if (speakerChanged(speaker)) {
      const lastSpeaker = previousSpeaker();
      if (!lastSpeaker.finished) {
        advanceDialogue(lastSpeaker);
        return;
      }
      lastSpeaker.destroy();
    }

    advanceDialogue(speaker);
  }
}

export default Level;
