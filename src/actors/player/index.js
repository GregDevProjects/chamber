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
    this.allowMovement = true
    // const offset = { x: 0.5, y: 20 }

    // this.body.position.x += offset.x
    // this.body.position.y += offset.y
    // this.body.positionPrev.x += offset.x
    // this.body.positionPrev.y += offset.y
    // this.render

    // this.body.centerOffset = { x: 10, y: 30 }

    // debugger
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
    if (this.allowMovement) {
      this.controller.update(delta)
    }

    if (this.gun) {
      this.gun.update()
    }

    this.head.update()
  }
}

export default Player
