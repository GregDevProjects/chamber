import {
  bounceCollisionReversed,
  bounceCollisionReversedFromCenter,
  setThrustTowardsPoint,
} from "../helpers";

import { spark } from "../effects/spark";

const PLAYER_DISTANCE = Phaser.Math.Between(150, 200);
const RADIUS = 15;
const ROTATE_SPEED = 0.02;
const MOVEMENT_SPEED = 0.000005;
const MASS = 0.5;
const BOUNCE_VELOCITY = 2;

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

    this.movementDirection = Phaser.Math.RND.pick([1, -1]);
  }

  collisions() {
    this.setCollidesWith([
      this.scene.collisionCategories.player,
      this.scene.collisionCategories.bullet,
      this.scene.collisionCategories.blockBarrier,
      this.scene.collisionCategories.block,
      this.scene.collisionCategories.spinner,
      // this.scene.collisionCategories.world,
    ]);
    //TODO: apply collisions filter to all body parts
    this.setCollisionCategory(this.scene.collisionCategories.spinner);
  }

  kill() {
    this.circleVisual.destroy();
    this.leftTriangleVisual.destroy();
    this.rightTriangleVisual.destroy();
    this.destroy();
  }

  deathState() {
    this.flashTween.stop();
    this.visualCrossFlash.setAlpha(1);
    this.visualStraightFlash.setAlpha(1);
    this.state = states.DEAD;
  }

  bounce(eventData) {
    spark(eventData.pair.collision.supports[0], this.scene);
    bounceCollisionReversedFromCenter(eventData, this, BOUNCE_VELOCITY);

    const angularVelocity = this.player.angularVelocity > 0 ? 0.1 : -0.1;
    this.setAngularVelocity(angularVelocity);
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

        if (collidedWith !== this.scene.collisionCategories.spinner) {
          this.bounce(eventData);
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

  addVisuals(config) {
    const triangle = () => {
      const triangleVisual = config.scene.add.graphics({
        fillStyle: { color: 0xababab },
      });
      var a = new Phaser.Geom.Point(0, 20);
      var b = new Phaser.Geom.Point(-10, 0);
      var c = new Phaser.Geom.Point(10, 0);

      triangleVisual.fillTriangle(a.x, a.y, b.x, b.y, c.x, c.y);
      return triangleVisual;
    };

    this.leftTriangleVisual = triangle();
    this.rightTriangleVisual = triangle();
    const circle = new Phaser.Geom.Circle(0, 0, RADIUS);
    //debugger;
    this.circleVisual = config.scene.add.graphics({
      fillStyle: { color: 0xff0000 },
    });
    this.circleVisual.fillCircleShape(circle);
    triangle();
  }

  updateVisuals() {
    this.circleVisual.setPosition(this.x, this.y);

    const leftTriangleCoords = () => {
      const x = this.x + 10 * Math.cos(this.rotation);
      const y = this.y + 10 * Math.sin(this.rotation);
      const rotation = this.rotation + 4.71239;
      return { x, y, rotation };
    };

    //LEFT TRIANGLE
    const left = leftTriangleCoords();

    this.leftTriangleVisual.setPosition(left.x, left.y, left.rotation);
    this.leftTriangleVisual.setRotation(this.rotation + 4.71239);

    //RIGHT TRIANGLE
    const newX = this.x + 10 * Math.cos(this.rotation + Math.PI);
    const newY = this.y + 10 * Math.sin(this.rotation + Math.PI);

    this.rightTriangleVisual.setPosition(newX, newY);
    this.rightTriangleVisual.setRotation(this.rotation - 4.71239);
  }

  getBody(config) {
    const M = Phaser.Physics.Matter.Matter;
    const distance = 18;
    const one = Phaser.Physics.Matter.Matter.Bodies.circle(
      config.x,
      config.y,
      RADIUS
    );

    const two = Phaser.Physics.Matter.Matter.Bodies.polygon(
      config.x - distance,
      config.y,
      3,
      10
    );

    const three = Phaser.Physics.Matter.Matter.Bodies.polygon(
      config.x + distance,
      config.y,
      3,
      10,
      { angle: Math.PI }
    );

    one.collisionFilter.category = this.scene.collisionCategories.spinner;
    two.collisionFilter.category = this.scene.collisionCategories.spinner;
    three.collisionFilter.category = this.scene.collisionCategories.spinner;

    return M.Body.create({
      parts: [one, two, three],
    });
  }

  deathAnimation() {
    const triangle = () => {
      const triangleVisual = config.scene.add.graphics({
        fillStyle: { color: 0xababab },
      });
      var a = new Phaser.Geom.Point(0, 20);
      var b = new Phaser.Geom.Point(-10, 0);
      var c = new Phaser.Geom.Point(10, 0);

      triangleVisual.fillTriangle(a.x, a.y, b.x, b.y, c.x, c.y);
      return triangleVisual;
    };
  }

  getMovementCoords() {
    const distanceFromPlayer = PLAYER_DISTANCE;

    const newAngle =
      Phaser.Math.Angle.BetweenPoints(this, this.player) +
      Math.PI +
      this.movementDirection;

    const x = this.player.x + distanceFromPlayer * Math.cos(newAngle);
    const y = this.player.y + distanceFromPlayer * Math.sin(newAngle);

    return { x, y };
  }

  update(delta) {
    if (!this.body) {
      return;
    }

    this.updateVisuals();

    setThrustTowardsPoint(
      this,
      this.getMovementCoords(),
      delta * MOVEMENT_SPEED
    );
    this.setAngularVelocity(ROTATE_SPEED);

    this.updateVisuals();
  }
}

export default Plumb;
