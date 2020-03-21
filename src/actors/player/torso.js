import { spark } from "../../effects/spark";

const WIDTH = 20;
const HEIGHT = 30; // 30

class Torso {
  constructor(config) {
    this.scene = config.scene;
    this.player = config.player;

    this.visual = new Phaser.GameObjects.Rectangle(
      config.scene,
      config.player.x,
      config.player.y,
      WIDTH,
      HEIGHT,
      0xdeb887
    );

    this.scene.add.existing(this.visual);
  }

  getBody(x, y) {
    const torso = Phaser.Physics.Matter.Matter.Bodies.rectangle(
      x,
      y + 9,
      WIDTH,
      HEIGHT
    );
    this.collisions(torso);
    torso.restitution = 10;
    return torso;
  }

  blockCollision(eventData) {
    const contactPointA = eventData.pair.collision.bodyA.position;
    const contactPointB = eventData.pair.collision.supports[0];

    spark(contactPointB, this.scene);
    const angle = Phaser.Math.Angle.BetweenPoints(contactPointA, contactPointB);

    const playerAngle = angle + Math.PI;
    const playerForce = 2;
    this.player.setVelocity(
      Math.cos(playerAngle) * playerForce,
      Math.sin(playerAngle) * playerForce
    );
  }

  worldBoundryCollision(wallBody) {
    const topCollision = this.scene.matter.world.walls.top.id === wallBody.id;
    if (topCollision) {
      console.log("top");
      // todo: add wall collision events
    }
  }

  collisions(torso) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: torso,
      callback: function(eventData) {
        const collidedWith = eventData.bodyB.collisionFilter.category;

        if (collidedWith === this.scene.collisionCategories.deathLine) {
          this.player.death();
        }

        if (collidedWith === this.scene.collisionCategories.block) {
          this.blockCollision(eventData);
        }

        if (collidedWith === this.scene.collisionCategories.spinner) {
          this.blockCollision(eventData);
        }

        if (collidedWith === this.scene.collisionCategories.world) {
          this.worldBoundryCollision(eventData.bodyB);
        }
      },
      context: this // Context to apply to the callback function
    });
  }

  degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  update() {
    const playerAngle = this.player.angle;
    const x =
      this.player.x - 7 * Math.cos(this.degreesToRadians(playerAngle - 90));
    const y =
      this.player.y - 7 * Math.sin(this.degreesToRadians(playerAngle - 90));
    this.visual.setPosition(x, y);
    this.visual.setAngle(this.player.angle);
  }
}

export default Torso;
