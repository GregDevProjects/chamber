const RADIUS = 9;

class DeathAnimation {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;

    this.slices = [];
    this.position = { x: 500, y: 500 };
    this.drawCircle();
  }

  drawCircle() {
    const slices = [];
    for (let i = 0; i < 360; i += 36) {
      //DONT PUSH IF IN CONTACT WITH SUPPORT
      slices.push({
        start: i,
        end: i + 36,
        angle: i + Phaser.Math.Between(0, Math.PI * 2) //Phaser.Math.DegToRad(i + 18)
      });
    }
    slices.forEach(slice => {
      this.slices.push(this.drawSlice(slice));
    });
  }

  drawSlice({ start, end, angle }) {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x0000ff, 1);
    // debugger;
    const slice = graphics.slice(
      this.player.head.visual.x,
      this.player.head.visual.y,
      this.player.head.visual.radius,
      Phaser.Math.DegToRad(start),
      Phaser.Math.DegToRad(end),
      false
    );

    graphics.fillPath();
    graphics.closePath();
    graphics.setDepth(10);
    slice.moveAngle = angle;
    return slice;
  }

  update() {
    this.slices.forEach(slice => {
      console.log(slice.moveAngle);
      const nextPosition = {
        x: Math.cos(slice.moveAngle) * 1,
        y: Math.sin(slice.moveAngle) * 1
      };
      slice.x += nextPosition.x / 2;
      slice.y += nextPosition.y / 2;
    });
  }
}

export default DeathAnimation;
