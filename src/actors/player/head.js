import { spark } from "../../effects/spark";

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
    this.visual.setDepth(1);
    this.scene.add.existing(this.visual);
  }

  destroy() {
    this.visual.destroy();
    //not sure how to remove the head, so just move it offscreen
    this.player.body.parts[2].position = { x: 10000, y: 10000 };
  }

  getBody(x, y) {
    const head = Phaser.Physics.Matter.Matter.Bodies.circle(x, y - 15, RADIUS, {
      isSensor: true,
    });
    this.collisions(head);
    return head;
  }

  collisions(head) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: head,
      // bullet too?
      callback: function (eventData) {
        const collidedWith = eventData.bodyB.collisionFilter.category;
        if (
          collidedWith === this.scene.collisionCategories.block ||
          collidedWith === this.scene.collisionCategories.deathLine ||
          collidedWith === this.scene.collisionCategories.world ||
          collidedWith === this.scene.collisionCategories.spinner
        ) {
          this.player.torso.blockCollision(eventData);
          this.player.death();
        }
      },
      context: this, // Context to apply to the callback function
    });
  }

  update() {
    // TODO: find a way to attach the visuals directly to the body
    const playerAngle = this.player.angle;
    const x =
      this.player.x + 17 * Math.cos(Phaser.Math.DegToRad(playerAngle - 90));
    const y =
      this.player.y + 17 * Math.sin(Phaser.Math.DegToRad(playerAngle - 90));
    this.visual.setPosition(x, y);
  }
}

export default Head;
