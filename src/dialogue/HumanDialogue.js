import DialogueManager from "./dialogueManager";

const TEXT_STYLE = {
  fontSize: 24,
  fontFamily: "Arial",
  align: "left",
  wordWrap: { width: 370, useAdvancedWrap: true },
  color: "black"
};

class RobotDialogue extends DialogueManager {
  constructor(scene) {
    super(scene);
    this.style = TEXT_STYLE;
    this.type = "human";
  }

  textPositionAboveAnchor(x, y) {
    y -= 130;
    x += 30;
    return [x, y];
  }

  drawDialogueBubble() {
    this.graphics.clear();

    this.graphics.lineStyle(6, 0x000000, 1);

    this.graphics.fillStyle(0xffff00, 1);

    const x = this.anchor.visual.x;
    const y = this.anchor.visual.y;

    this.graphics.beginPath();

    this.graphics.lineTo(x + 10, y - 10); // head

    this.graphics.lineTo(this.body.x + 70, this.body.y - 70);

    this.graphics.moveTo(this.body.x + 130, this.body.y - 70);

    this.graphics.lineTo(this.body.x + 400, this.body.y - 70);

    this.graphics.lineTo(this.body.x + 400, this.body.y - 140);

    this.graphics.lineTo(this.body.x + 20, this.body.y - 140);

    this.graphics.lineTo(this.body.x + 20, this.body.y - 71);

    this.graphics.lineTo(this.body.x + 20, this.body.y - 70);

    this.graphics.lineTo(this.body.x + 50, this.body.y - 70);

    this.graphics.lineTo(x + 10, y - 10); // head

    this.graphics.closePath();
    this.graphics.strokePath();
    this.graphics.fillPath();
  }
}

export default RobotDialogue;
