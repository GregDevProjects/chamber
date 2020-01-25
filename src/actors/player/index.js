import Bullet from '../bullet'
import Actor from '../actor'
import Head from './head'
import Controller from './controller'
import Gun from './gun'

/* eslint-disable no-undef */
const MASS = 2.5
const RECOIL_FORCE = 0.03

class Player extends Actor {
  constructor (config) {
    super(
      config.scene.matter.world,
      config.x,
      config.y,
      'player'
    )
    this.collisions = config.collisions
    this.scaleX = 20 / 128
    this.scaleY = 30 / 128
    // this must be called first or collision filter wont work
    this.setRectangle(20,
      30)

    this.setCollisionCategory(this.scene.collisionCategories.player)
    // collision id of world
    this.setCollidesWith([
      this.scene.collisionCategories.world,
      this.scene.collisionCategories.deathLine,
      this.scene.collisionCategories.block
    ])
    this.setMass(MASS)
    this.collisionEvent()
    this.startPointer()
    this.body.restitution = 1
    this.setTintFill(0xffc0cb)

    this.head = new Head({ scene: this.scene, player: this })
    this.controller = new Controller(this)
    this.gun = new Gun(this)
  }

  startPointer () {
    this.scene.input.on('pointerdown',
      (coords) => {
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
    this.scene.scene.restart()
  }

  shoot (mouseVector, force) {
    this.applyForceInOppositeDirection(mouseVector,
      force)
    new Bullet({ scene: this.scene, x: this.x, y: this.y })
      .fire(mouseVector)
  }

  collisionEvent () {
    this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      callback: function (eventData) {
        const collidedWith = eventData.bodyB.collisionFilter.category

        if (collidedWith === this.scene.collisionCategories.deathLine) {
          this.death()
        }

        if (collidedWith === this.scene.collisionCategories.block &&
          eventData.gameObjectB &&
          eventData.gameObjectB.killPlayer) {
          this.death()
        }
      },
      context: this // Context to apply to the callback function
    })
  }

  update (delta) {
    // console.log(this.body.angularVelocity)
    this.controller.update(delta)
    this.gun.update()
    this.head.update()
  }
}

export default Player
