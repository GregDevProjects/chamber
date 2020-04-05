import DialogueManager from "./dialogueManager";

const ANCHOR_OFFSET = 30;

const TEXT_STYLE = {
  fontSize: 24,
  fontFamily: "Arial",
  align: "left",
  wordWrap: { width: 200, useAdvancedWrap: true },
  color: "black"
};

class RobotDialogue extends DialogueManager {
  constructor(scene) {
    super(scene);
    this.type = "robot";
    this.style = TEXT_STYLE;
    this.step = 30;
    this.radius = 100;
    this.movingPointsBottomLine = [];
    this.movingPointsRightOval = [];
    this.movingPointsLeftOval = [];
    this.movingPointsTopLine = [];
    this.pulseSpeed = 1000;
    this.pulseRange = 30;
  }

  textPositionAboveAnchor(x, y) {
    y += -40;
    x -= 85;
    return [x, y];
  }

  degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  nextSpikeMovement(index, anchor, movingPoints) {
    const sinWave =
      Math.abs(Math.sin(this.scene.time.now / this.pulseSpeed)) *
      this.pulseRange;

    const newRad = movingPoints[index].radius + sinWave;
    const newx =
      (this.radius + newRad) *
        Math.cos(this.degreesToRadians(index + this.step / 2)) +
      anchor.x;
    const newy =
      (this.radius + newRad) *
        Math.sin(this.degreesToRadians(index + this.step / 2)) +
      anchor.y;

    return { x: newx, y: newy };
  }

  trig(vector, angle) {
    const x = this.radius * Math.cos(this.degreesToRadians(angle)) + vector.x;
    const y = this.radius * Math.sin(this.degreesToRadians(angle)) + vector.y;
    return { x, y };
  }

  drawDialogueBubble() {
    const anchorOffsetX = ANCHOR_OFFSET;
    const rightOvalStart = {
      x: this.anchor.x + anchorOffsetX,
      y: this.anchor.y
    };

    const leftOvalStart = {
      x: this.anchor.x - anchorOffsetX,
      y: this.anchor.y
    };

    const topLeftOval = this.trig(leftOvalStart, 270);

    const topRightOval = this.trig(rightOvalStart, 270);
    const bottomRightOval = this.trig(rightOvalStart, 450);

    this.graphics.clear();
    this.graphics.fillStyle(0xffff00, 1);

    this.graphics.lineStyle(6, 0x000000, 1);

    this.graphics.fillStyle(0xffff00, 1);

    const topAnchor = {
      x: this.anchor.x,
      y: this.anchor.y
    };

    //TOP LINE
    for (let i = topLeftOval.x; i < topRightOval.x; i += this.step) {
      const vector = {
        x: i,
        y: topLeftOval.y
      };

      this.graphics.lineTo(vector.x, vector.y);

      const angle = 260;

      if (!this.movingPointsTopLine[angle]) {
        this.setNextMovePoint(angle, topAnchor, this.movingPointsTopLine);
      }

      const animatePoints = this.nextSpikeMovement(
        angle,
        topAnchor,
        this.movingPointsTopLine
      );
      this.graphics.lineTo(animatePoints.x, animatePoints.y);
    }

    //RIGHT OVALL
    for (let i = 270; i < 450; i += this.step) {
      const vector = this.trig(rightOvalStart, i);

      this.graphics.lineTo(vector.x, vector.y);

      if (!this.movingPointsRightOval[i]) {
        this.setNextMovePoint(i, rightOvalStart, this.movingPointsRightOval);
      }

      const animatePoints = this.nextSpikeMovement(
        i,
        rightOvalStart,
        this.movingPointsRightOval
      );
      this.graphics.lineTo(animatePoints.x, animatePoints.y);
    }

    // BOTTOM LINE
    for (
      let i = bottomRightOval.x;
      i > bottomRightOval.x - anchorOffsetX;
      i -= this.step
    ) {
      const vector = {
        x: i,
        y: bottomRightOval.y
      };
      this.graphics.lineTo(vector.x, vector.y);

      const angle = 435;

      if (!this.movingPointsBottomLine[angle]) {
        this.setNextMovePoint(angle, topAnchor, this.movingPointsBottomLine);
      }

      const animatePoints = this.nextSpikeMovement(
        angle,
        topAnchor,
        this.movingPointsBottomLine
      );
      this.graphics.lineTo(animatePoints.x, animatePoints.y);
    }

    //LEFT OVAL
    for (let i = 90; i < 270; i += this.step) {
      const vector = this.trig(leftOvalStart, i);
      this.graphics.lineTo(vector.x, vector.y);

      if (!this.movingPointsLeftOval[i]) {
        this.setNextMovePoint(i, leftOvalStart, this.movingPointsLeftOval);
      }

      const animatePoints = this.nextSpikeMovement(
        i,
        leftOvalStart,
        this.movingPointsLeftOval
      );
      this.graphics.lineTo(animatePoints.x, animatePoints.y);
    }

    this.graphics.closePath();
    this.graphics.strokePath();
    this.graphics.fillPath();
  }

  setNextMovePoint(i, anchor, movingPoints) {
    const newRad = Phaser.Math.Between(20, 100);
    const newx = movingPoints[i]
      ? movingPoints[i].x
      : (this.radius + newRad) *
          Math.cos(this.degreesToRadians(i + this.step / 2)) +
        anchor.x;
    const newy = movingPoints[i]
      ? movingPoints[i].y
      : (this.radius + newRad) *
          Math.sin(this.degreesToRadians(i + this.step / 2)) +
        anchor.y;
    movingPoints[i] = { x: newx, y: newy, radius: newRad };
  }
}

export default RobotDialogue;
