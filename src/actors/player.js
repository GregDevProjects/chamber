import Bullet from './bullet'
import Actor from './actor'

/* eslint-disable no-undef */
const MASS = 2.5

class Player extends Actor {
  constructor (config) {
    super(config.scene.matter.world, config.x, config.y, 'player')
    this.collisions = config.collisions
    // this must be called first or collision filter wont work
    this.setRectangle(20, 30)
    // const playerCollisionCat = config.scene.matter.world.nextCategory()
    // this.bulletCollisionCat = config.scene.matter.world.nextCategory()
    this.setCollisionCategory(this.scene.collisionCategories.player)
    // collision id of world
    this.setCollidesWith(this.scene.collisionCategories.world)
    this.setMass(MASS)
    this.collisionEvent()
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

  shoot (mouseVector, force) {
    this.applyForceInOppositeDirection(mouseVector, force)
    new Bullet({ scene: this.scene, x: this.x, y: this.y })
      .fire(mouseVector)
  }

  collisionEvent () {
    this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      // objectB: trapDoor,
      callback: function (eventData) {
      // console.log(eventData)
      // This function will be invoked any time the player and trap door collide
      // const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
      // bodyA & bodyB are the Matter bodies of the player and door respectively
      // gameObjectA & gameObjectB are the player and door respectively
      // pair is the raw Matter pair data
      },
      context: this // Context to apply to the callback function
    })
  }
}

export default Player
