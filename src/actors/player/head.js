const RADIUS = 9;

class Head {
  constructor(config) {
    this.scene = config.scene;
    this.player = config.player;

    this.visual = new Phaser.GameObjects.Arc(
      config.scene,
      config.player.x,
      config.player.y,
      RADIUS,
      undefined,
      undefined,
      undefined,
      0x0000ff
    );

    this.scene.add.existing(this.visual);
  }

  getBody(x, y) {
    const head = Phaser.Physics.Matter.Matter.Bodies.circle(x, y - 15, RADIUS, {
      isSensor: true
    });
    this.collisions(head);
    return head;
  }

  collisions(head) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: head,
      // bullet too?
      callback: function(eventData) {
        const collidedWith = eventData.bodyB.collisionFilter.category;
        if (
          collidedWith === this.scene.collisionCategories.block ||
          collidedWith === this.scene.collisionCategories.deathLine ||
          collidedWith === this.scene.collisionCategories.world ||
          collidedWith === this.scene.collisionCategories.spinner
        ) {
          this.player.death();
        }
      },
      context: this // Context to apply to the callback function
    });
  }

  degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  update() {
    // TODO: find a way to attach the visuals directly to the body
    const playerAngle = this.player.angle;
    const x =
      this.player.x + 17 * Math.cos(this.degreesToRadians(playerAngle - 90));
    const y =
      this.player.y + 17 * Math.sin(this.degreesToRadians(playerAngle - 90));
    this.visual.setPosition(x, y);
  }
}

export default Head;
