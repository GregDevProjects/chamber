const INNER_RADIUS = 30;
const OUTER_RADIUS = 120;

class Pickup {
  constructor(scene) {
    this.starGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    drawStar(
      this.starGraphics,
      500,
      500,
      10,
      OUTER_RADIUS,
      INNER_RADIUS,
      0xffff00,
      0xff0000
    );
    scene.add.existing(this.starGraphics);

    this.animate = false;
    this.time = 0;
    this.innerRadiusTime = 0;
    scene.tweens.add({
      targets: this.starGraphics,
      repeat: -1,
      yoyo: true,
      alpha: 0.1,
      duration: 1000
    });
  }

  fillScreen() {
    this.animate = true;
  }

  update(time) {
    if (!this.animate) {
      return;
    }
    this.time++;

    if (this.time > 700) {
      this.innerRadiusTime++;
    }

    this.starGraphics.clear();
    drawStar(
      this.starGraphics,
      500,
      500,
      Phaser.Math.Clamp(10 + this.time / 100, 10, 20),
      OUTER_RADIUS + this.time / 5,
      INNER_RADIUS + this.innerRadiusTime / 5,
      0xffff00,
      0xff0000
    );
  }
}

function drawStar(
  graphics,
  cx,
  cy,
  spikes,
  outerRadius,
  innerRadius,
  color,
  lineColor
) {
  var rot = (Math.PI / 2) * 3;
  var x = cx;
  var y = cy;
  var step = Math.PI / spikes;
  graphics.lineStyle(5, lineColor, 1.0);
  graphics.fillStyle(color, 1.0);
  graphics.beginPath();
  graphics.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    graphics.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    graphics.lineTo(x, y);
    rot += step;
  }

  graphics.lineTo(cx, cy - outerRadius);
  graphics.closePath();
  graphics.fillPath();
  graphics.strokePath();
}

export default Pickup;
