class DeathAnimation {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;

    this.slices = [];
    this.position = { x: 500, y: 500 };
    this.drawCircle();

    var particles = this.scene.add.particles("red");
    particles.setDepth(0);
    this.emitter = particles.createEmitter({
      x: this.player.x,
      y: this.player.y,
      lifespan: 2000,
      speed: { min: 200, max: 400 },
      angle: this.player.angle - 90 + Phaser.Math.Between(-20, 20),
      gravityY: 1,
      quantity: 1,
      frequency: 20
    });

    // setEmitter();
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

  setEmitter() {
    this.emitter.setPosition(this.player.x, this.player.y);
    this.emitter.setEmitterAngle(
      this.player.angle - 90 + Phaser.Math.Between(-20, 20)
    );
    this.emitter.setGravity(
      Phaser.Math.Between(-1000, 1000),
      Phaser.Math.Between(-1000, 1000)
    );
  }

  update() {
    this.setEmitter();
    // debugger;
    this.slices.forEach(slice => {
      const nextPosition = {
        x: Math.cos(slice.moveAngle) * 1,
        y: Math.sin(slice.moveAngle) * 1
      };
      slice.x += nextPosition.x / 2;
      slice.y += nextPosition.y / 2;
      // debugger;
      // slice.angle--;
    });
  }
}

export default DeathAnimation;
