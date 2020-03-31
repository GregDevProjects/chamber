import Bullet from "../bullet";
import Head from "./head";
import Controller from "./controller";
import Gun from "./gun";
import Torso from "./torso";
import DeathAnimation from "../../effects/DeathAnimation";

/* eslint-disable no-undef */
const MASS = 1;
const RECOIL_FORCE = 0.015;
const KICK_SPEED = 7;

class Player extends Phaser.Physics.Matter.Image {
  constructor(config) {
    super(config.scene.matter.world, 200, 200, "transparent");
    this.scene = config.scene;

    this.startPointer();
    this.body.restitution = 1;

    this.controller = new Controller(this);
    this.gun = new Gun(this);
    this.head = new Head({ scene: this.scene, player: this });
    this.torso = new Torso({ scene: this.scene, player: this });
    this.allowMovement = true;

    var M = Phaser.Physics.Matter.Matter;

    var compoundBody = M.Body.create({
      parts: [
        // parent,
        this.torso.getBody(config.x, config.y),
        this.head.getBody(config.x, config.y)
      ],
      friction: 0.01,
      restitution: 1 // Prevent body from sticking against a wall
    });

    this.setExistingBody(compoundBody);
    this.setMass(MASS);
    this.setCollisionCategory(this.scene.collisionCategories.player);

    this.setCollidesWith([
      this.scene.collisionCategories.world,
      this.scene.collisionCategories.deathLine,
      this.scene.collisionCategories.block,
      this.scene.collisionCategories.spinner,
      this.scene.collisionCategories.pickup
    ]);

    this.isKicking = false;
  }

  kick(rotateClockwise) {
    this.isKicking = true;
    if (rotateClockwise) {
      this.angle += KICK_SPEED;
      return;
    }
    this.angle -= KICK_SPEED;
  }

  stopKick() {
    this.torso.stopFlashing();
    this.isKicking = false;
    this.setAngularVelocity(0);
  }

  startPointer() {
    this.scene.input.on("pointerdown", coords => {
      if (!this.gun.active) {
        return;
      }

      const mouseVector = {
        x: coords.worldX,
        y: coords.worldY
      };

      this.shoot(mouseVector, RECOIL_FORCE);
    });
  }

  applyForceInOppositeDirection(vector, force) {
    const playerVector = {
      x: this.x,
      y: this.y
    };
    const targetAngle = Phaser.Math.Angle.Between(
      vector.x,
      vector.y,
      playerVector.x,
      playerVector.y
    );

    this.applyForce({
      x: Math.cos(targetAngle) * force,
      y: Math.sin(targetAngle) * force
    });
  }

  death() {
    if (!this.head.visual.active) {
      return;
    }

    this.deathAnimation = new DeathAnimation(this.scene, this);
    this.head.destroy();
    //send the player ragdolling backwards
    const angle = this.rotation + 1.5708;
    this.setAngularVelocity(0.1);
    this.setVelocity(Math.cos(angle) * 3, Math.sin(angle) * 3);
    this.scene.gameOver();
  }

  shoot(mouseVector, force) {
    this.applyForceInOppositeDirection(mouseVector, force);
    new Bullet({ scene: this.scene, x: this.x, y: this.y }).fire(mouseVector);
  }

  removeGun() {
    this.gun.destroy();
  }

  giveGun() {
    this.gun = new Gun(this);
  }

  removeControls() {
    this.allowMovement = false;
  }

  giveControls() {
    this.allowMovement = true;
  }

  update(delta) {
    if (this.allowMovement) {
      this.controller.update(delta);
    }

    if (this.gun) {
      this.gun.update();
    }

    if (this.deathAnimation) {
      this.deathAnimation.update();
    }

    this.head.update();
    this.torso.update();
  }
}

export default Player;
