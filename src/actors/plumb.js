import {
  setVelocityTowardsPoint,
  bounceCollision,
  flashTween,
  setThrustTowardsPoint,
} from "../helpers";

const WIDTH = 20;
const HEIGHT = 80;
const RADIUS = 30;
const ROTATE_SPEED = 0.02;
const MOVEMENT_SPEED = 0.000005;
const MASS = 0.5;

const states = { NORMAL: 1, SPINNING: 2, CHARGING: 3, DEAD: 4 };

class Plumb extends Phaser.Physics.Matter.Image {
  constructor(config) {
    super(config.scene.matter.world, config.x, config.y, "transparent");
    this.player = config.player;
    this.addVisuals(config);

    this.setExistingBody(this.getBody(config));
    this.collisions();
    this.setMass(MASS);
    this.collisionEvent();
    this.state = states.NORMAL;
  }

  collisions() {
    this.setCollidesWith([
      this.scene.collisionCategories.player,
      this.scene.collisionCategories.bullet,
      this.scene.collisionCategories.blockBarrier,
      this.scene.collisionCategories.block,
      this.scene.collisionCategories.spinner,
      this.scene.collisionCategories.world,
    ]);
    //TODO: apply collisions filter to all body parts
    this.setCollisionCategory(this.scene.collisionCategories.spinner);
  }

  kill() {
    this.destroy();
  }

  deathState() {
    this.flashTween.stop();
    this.visualCrossFlash.setAlpha(1);
    this.visualStraightFlash.setAlpha(1);
    this.state = states.DEAD;
  }

  //this is nuts, refactor it
  collisionEvent() {
    this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      // objectB: trapDoor,
      callback: function (eventData) {
        if (!this.body) {
          return;
        }

        let collidedWith = eventData.bodyB.collisionFilter.category; // ? eventData.bodyB.collisionFilter.category : eventData.gameObjectB ?  eventData.gameObjectB.body.collisionFilter.category

        if (
          eventData.gameObjectB &&
          eventData.gameObjectB.body &&
          eventData.gameObjectB.body.collisionFilter
        ) {
          collidedWith = eventData.gameObjectB.body.collisionFilter.category;
        }

        //collides with a kicking player
        if (collidedWith === this.scene.collisionCategories.player) {
          //PLAYER COLLIDE
        }

        if (collidedWith === this.scene.collisionCategories.bullet) {
          //BULLET COLLIDE
          this.kill();
        }
      },
      context: this, // Context to apply to the callback function
    });
  }

  addVisuals(config) {}

  updateVisuals() {
    this.visualStraight.setPosition(this.x, this.y);
    this.visualCross.setPosition(this.x, this.y);
    this.visualCrossFlash.setPosition(this.x, this.y);
    this.visualStraightFlash.setPosition(this.x, this.y);

    this.visualCross.setRotation(this.rotation);
    this.visualStraight.setRotation(this.rotation - 1.5708);
    this.visualCrossFlash.setRotation(this.rotation);
    this.visualStraightFlash.setRotation(this.rotation - 1.5708);
  }

  getBody(config) {
    var M = Phaser.Physics.Matter.Matter;

    const one = Phaser.Physics.Matter.Matter.Bodies.circle(
      config.x,
      config.y,
      RADIUS
      //   HEIGHT,
      //   { angle: 1.5708 }
    );

    // Phaser.Physics.Matter.Bodies.

    const two = Phaser.Physics.Matter.Matter.Bodies.rectangle(
      config.x,
      config.y,
      WIDTH,
      HEIGHT
    );

    one.collisionFilter.category = this.scene.collisionCategories.spinner;
    two.collisionFilter.category = this.scene.collisionCategories.spinner;
    // debugger;
    return M.Body.create({
      parts: [one, two],
    });
  }

  update(delta) {
    if (!this.body) {
      return;
    }

    //this.updateVisuals();
    setThrustTowardsPoint(this, this.player, delta * MOVEMENT_SPEED);
    this.setAngularVelocity(ROTATE_SPEED);
  }
}

export default Plumb;
