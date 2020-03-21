import { setVelocityTowardsPoint } from "../helpers";

const WIDTH = 20;
const HEIGHT = 80;

const ROTATE_SPEED = 0.02;
const MOVEMENT_SPEED = 1;
const CHARGING_SPEED = 2.5;

const COLOR = 0x0000ff;

const MASS = 0.001;

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
    this.destroy();
  }

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
          this.state = states.CHARGING;
        }
        if (this.state === states.DEAD) {
          this.kill();
          return;
        }

        if (
          collidedWith === this.scene.collisionCategories.player &&
          this.player.kick.isKicking
        ) {
          if (this.state === states.NORMAL) {
            this.state = states.SPINNING;
          }
          if (this.state === states.CHARGING) {
            this.state = states.DEAD;
          }

          const force = 8; // eventData.gameObjectB.body.speed * 2

          const contactPointA = eventData.pair.collision.bodyA.position;
          const contactPointB = eventData.pair.collision.supports[0];
          // block
          //this.setAngularVelocity(Phaser.Math.RND.pick([0, 1]) ? 0.02 : -0.02);
          const angle = Phaser.Math.Angle.BetweenPoints(
            contactPointA,
            contactPointB
          );

          this.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force);
          if (this.player.angularVelocity > 0) {
            this.setAngularVelocity(0.3);
          } else {
            this.setAngularVelocity(-0.3);
          }
        }

        if (collidedWith === this.scene.collisionCategories.bullet) {
          this.kill();
        }
      },
      context: this // Context to apply to the callback function
    });
  }

  addVisuals(config) {
    this.visualStraight = new Phaser.GameObjects.Rectangle(
      config.scene,
      config.x,
      config.y,
      WIDTH,
      HEIGHT,
      COLOR
    );

    this.visualCross = new Phaser.GameObjects.Rectangle(
      config.scene,
      config.x,
      config.y,
      WIDTH,
      HEIGHT,
      0x0000ff
    );

    this.visualCross.rotation = 1.5708;

    this.scene.add.existing(this.visualStraight);
    this.scene.add.existing(this.visualCross);
  }

  updateVisuals() {
    this.visualStraight.setPosition(this.x, this.y);
    this.visualCross.setPosition(this.x, this.y);

    this.visualCross.setRotation(this.rotation);
    this.visualStraight.setRotation(this.rotation - 1.5708);
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

  update() {
    if (!this.body) {
      return;
    }

    switch (this.state) {
      case states.NORMAL:
        setVelocityTowardsPoint(this, this.player, MOVEMENT_SPEED);
        this.setAngularVelocity(ROTATE_SPEED);
        break;
      case states.SPINNING:
        break;
      case states.CHARGING:
        setVelocityTowardsPoint(this, this.player, CHARGING_SPEED);
        this.setAngularVelocity(0.1);
        break;
      case states.DEAD:
    }

    this.updateVisuals();
  }
}

export default Spinner;
