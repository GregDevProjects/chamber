import {
  setVelocityTowardsPoint,
  bounceCollision,
  flashTween,
  setThrustTowardsPoint
} from "../helpers";

const WIDTH = 20;
const HEIGHT = 80;

const ROTATE_SPEED = 0.02;
const MOVEMENT_SPEED = 0.000005;
const CHARGING_SPEED = 0.00009;
const COLOR = 0x0000ff;
const MASS = 0.5;
const BOUNCE_VELOCITY = 8;

const states = { NORMAL: 1, SPINNING: 2, CHARGING: 3, DEAD: 4 };

class Spinner extends Phaser.Physics.Matter.Image {
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
      this.scene.collisionCategories.world
    ]);
    //TODO: apply collisions filter to all body parts
    this.setCollisionCategory(this.scene.collisionCategories.spinner);
  }

  kill() {
    this.visualStraight.destroy();
    this.visualCross.destroy();
    this.visualCrossFlash.destroy();
    this.visualStraightFlash.destroy();
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
      callback: function(eventData) {
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

        if (this.state === states.SPINNING) {
          this.startFlashing();
          this.state = states.CHARGING;
        }
        if (this.state === states.DEAD) {
          this.kill();
          return;
        }

        //collides with a kicking player
        if (
          collidedWith === this.scene.collisionCategories.player &&
          this.player.isKicking
        ) {
          if (this.state === states.NORMAL) {
            this.state = states.SPINNING;
          }
          if (this.state === states.CHARGING) {
            this.deathState();
          }
          bounceCollision(eventData, this, BOUNCE_VELOCITY);
          if (this.player.angularVelocity > 0) {
            this.setAngularVelocity(0.3);
          } else {
            this.setAngularVelocity(-0.3);
          }
        }

        if (
          collidedWith === this.scene.collisionCategories.bullet &&
          this.state === states.CHARGING
        ) {
          this.deathState();
        }
      },
      context: this // Context to apply to the callback function
    });
  }

  addVisuals(config) {
    const createRect = (color = COLOR) =>
      new Phaser.GameObjects.Rectangle(
        config.scene,
        config.x,
        config.y,
        WIDTH,
        HEIGHT,
        color
      );
    this.visualStraight = createRect();
    this.visualCross = createRect();
    this.visualStraightFlash = createRect(0xdff2800);
    this.visualCrossFlash = createRect(0xdff2800);

    this.visualCrossFlash.setDepth(-1);
    this.visualStraightFlash.setDepth(-1);

    this.visualCrossFlash.rotation = 1.5708;
    this.visualCross.rotation = 1.5708;

    this.visualCrossFlash.setAlpha(0);
    this.visualStraightFlash.setAlpha(0);

    this.flashTween = flashTween(this.scene, [
      this.visualCrossFlash,
      this.visualStraightFlash
    ]);

    this.scene.add.existing(this.visualStraight);
    this.scene.add.existing(this.visualCross);
    this.scene.add.existing(this.visualStraightFlash);
    this.scene.add.existing(this.visualCrossFlash);
  }

  startFlashing() {
    this.visualCrossFlash.setDepth(1);
    this.visualStraightFlash.setDepth(1);
  }

  stopFlashing() {
    this.visualCrossFlash.setDepth(-1);
    this.visualStraightFlash.setDepth(-1);
  }

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

    const one = Phaser.Physics.Matter.Matter.Bodies.rectangle(
      config.x,
      config.y,
      WIDTH,
      HEIGHT,
      { angle: 1.5708 }
    );

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
      parts: [one, two]
    });
  }

  update(delta) {
    if (!this.body) {
      return;
    }

    this.updateVisuals();
    switch (this.state) {
      case states.NORMAL:
        // debugger;
        setThrustTowardsPoint(this, this.player, delta * MOVEMENT_SPEED);
        this.setAngularVelocity(ROTATE_SPEED);
        break;
      case states.SPINNING:
        break;
      case states.CHARGING:
        setThrustTowardsPoint(this, this.player, CHARGING_SPEED);
        this.setAngularVelocity(0.1);
        break;
      case states.DEAD:
    }
  }
}

export default Spinner;
