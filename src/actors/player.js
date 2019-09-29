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
    this.setCollidesWith(
      [
        this.scene.collisionCategories.world,
        this.scene.collisionCategories.deathLine
      ])
    this.setMass(MASS)
    this.collisionEvent()
    this.startPointer()
    this.body.restitution = 1
    this.setTexture()
  }

  startPointer () {
    this.scene.input.on('pointerdown', (coords) => {
      const force = 0.03
      const mouseVector = {
        x: coords.worldX,
        y: coords.worldY
      }

      this.shoot(mouseVector, force)
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
        const collidedWith = eventData.bodyB.collisionFilter.category

        if (collidedWith === this.scene.collisionCategories.deathLine) {
          console.log(collidedWith)
          this.scene.scene.restart()
          // this.scene.sys.game.destroy()
        }
      },
      context: this // Context to apply to the callback function
    })
  }
}

export default Player
