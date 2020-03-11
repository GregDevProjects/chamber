import Bullet from '../bullet'
import Actor from '../actor'
import Head from './head'
import Controller from './controller'
import Gun from './gun'
import Torso from './torso'
/* eslint-disable no-undef */
const MASS = 1
const RECOIL_FORCE = 0.015
const KICK_SPEED = 0.50

class Player extends Phaser.Physics.Matter.Image {
  constructor (config) {
    super(
      config.scene.matter.world,
      200,
      200,
      'transparent'
    )
    this.scene = config.scene
    this.collisions = config.collisions

    this.startPointer()
    this.body.restitution = 1

    this.controller = new Controller(this)
    this.gun = new Gun(this)
    this.head = new Head({ scene: this.scene, player: this })
    this.torso = new Torso({ scene: this.scene, player: this })
    this.allowMovement = true

    var M = Phaser.Physics.Matter.Matter

    var compoundBody = M.Body.create({
      parts: [
        // parent,
        this.torso.getBody(config.x,
          config.y),
        this.head.getBody(config.x,
          config.y)
      ],
      friction: 0.01,
      restitution: 1 // Prevent body from sticking against a wall
    })

    this.setExistingBody(compoundBody)
    this.setMass(MASS)
    this.setCollisionCategory(this.scene.collisionCategories.player)

    this.setCollidesWith([
      this.scene.collisionCategories.world,
      this.scene.collisionCategories.deathLine,
      this.scene.collisionCategories.block
    ])

    this.kick = {
      duration: 0,
      isKicking: false,
      startAngle: 0,
      endAngle: 0
    }
  }

  startKick () {
    this.kick.isKicking = true
  }

  startPointer () {
    this.scene.input.on('pointerdown',
      (coords) => {
        if (!this.gun.active) {
          return
        }

        const mouseVector = {
          x: coords.worldX,
          y: coords.worldY
        }

        this.shoot(mouseVector,
          RECOIL_FORCE)
      })
  }

  applyForceInOppositeDirection (vector, force) {
    const playerVector = {
      x: this.x,
      y: this.y
    }
    const targetAngle = Phaser.Math.Angle.Between(
      vector.x,
      vector.y,
      playerVector.x,
      playerVector.y
    )

    this.applyForce({
      x: Math.cos(targetAngle) * force,
      y: Math.sin(targetAngle) * force
    })
  }

  death () {
    this.scene.resetScene()
  }

  shoot (mouseVector, force) {
    this.applyForceInOppositeDirection(mouseVector,
      force)
    new Bullet({ scene: this.scene, x: this.x, y: this.y })
      .fire(mouseVector)
  }

  removeGun () {
    this.gun.destroy()
  }

  giveGun () {
    this.gun = new Gun(this)
  }

  removeControls () {
    this.allowMovement = false
  }

  giveControls () {
    this.allowMovement = true
  }

  update (delta) {
    if (this.allowMovement) {
      this.controller.update(delta)
    }

    if (this.gun) {
      this.gun.update()
    }

    if (this.kick.isKicking) {
      this.twirl360(delta)
    }

    this.head.update()
    this.torso.update()
  }

  twirl360 (delta) {
    if (this.kick.duration === 0) {
      this.kick.startAngle = this.angle
      this.kick.endAngle = Phaser.Math.Angle.Wrap(this.rotation + (Math.PI * 2))
    }

    this.kick.duration++
    this.angle += KICK_SPEED * delta

    const threshold = 0.1

    if (Phaser.Math.Within(
      this.rotation,
      this.kick.endAngle,
      threshold
    ) &&
    this.kick.duration > 10) {
      this.kick.isKicking = false
      this.kick.duration = 0
      this.setAngularVelocity(0)
    }
  }
}

export default Player
