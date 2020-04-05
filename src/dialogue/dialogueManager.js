const TEXT_DEPTH = 11;
const DIALOGUE_BOX_DEPTH = 10;

class DialogueManager {
  constructor(scene) {
    this.scene = scene;
    //text game object
    this.text = "";
    //the finished text
    this.fullText = "";
    //true if the full text has been displayed to the user
    this.finished = false;
    this.anchor = null;
    this.dialogueBox = null;

    this.graphics = this.scene.add.graphics();
    this.graphics.setDepth(DIALOGUE_BOX_DEPTH);
    this.doUpdate = false;
    this.textSkipped = false;
  }

  setAnchor(anchor, body) {
    this.anchor = anchor;
    this.body = body;
  }

  moveText() {
    const startPositions = this.body ? this.body : this.anchor;
    const [x, y] = this.textPositionAboveAnchor(
      startPositions.x,
      startPositions.y
    );
    // debugger
    this.text.setPosition(x, y);
  }

  setText(text) {
    this.finished = false;
    this.fullText = text;
    // TODO: play a sound here
    // if (this.text.destroy) {
    //   this.text.destroy();
    // }

    this.text = this.scene.add.text(
      this.anchor.x,
      this.anchor.y,
      "",
      this.style
    );

    this.text.setDepth(TEXT_DEPTH);
    this.textCharacterArray = text.split("");
    this.textDisplay = "";

    const onEvent = () => {
      if (!this.doUpdate || this.finished) {
        return;
      }
      const newChar = this.textCharacterArray.shift();
      if (!newChar) {
        return;
      }
      this.textDisplay += newChar;

      this.text.setText(this.textDisplay);

      if (this.timedEvent.getRepeatCount() === 0) {
        this.finished = true;
      }
    };

    this.timedEvent = this.scene.time.addEvent({
      delay: 60,
      callback: onEvent,
      callbackScope: this,
      repeat: this.textCharacterArray.length - 1,
    });
    this.doUpdate = true;
  }

  // advance() {
  //   // this.finished = true
  //   if (!this.finished) {
  //     this.finished = true
  //     this.skip();
  //     return;
  //   }
  //   // this.destroy();
  // }

  skip() {
    this.finished = true;
    this.text.setText(this.fullText);
  }

  destroy() {
    this.doUpdate = false;
    // this.finished = true;
    if (this.text) {
      this.text.destroy();
    }
    this.graphics.clear();
  }

  update() {
    if (!this.doUpdate) {
      return;
    }

    this.moveText();
    this.drawDialogueBubble();
  }
}

export default DialogueManager;
