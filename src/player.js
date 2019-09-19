import Bullet from './bullet'
import Actor from './actor/actor'
/* eslint-disable no-undef */
const MASS = 2.5

class Player extends Actor {
  constructor (config) {
    super(config.scene.matter.world, config.x, config.y, 'player')
    // this must be called first or collision filter wont work
    this.setRectangle(20, 30)
    const playerCollisionCat = config.scene.matter.world.nextCategory()
    this.bulletCollisionCat = config.scene.matter.world.nextCategory()
    this.setCollisionCategory(playerCollisionCat)
    // collision id of world
    this.setCollidesWith([1])
    this.setMass(MASS)
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
    new Bullet({ scene: this.scene, x: this.x, y: this.y, collisionCat: this.bulletCollisionCat })
      .fire(mouseVector)
  }
}

export default Player
