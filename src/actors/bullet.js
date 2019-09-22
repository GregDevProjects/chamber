import Actor from './actor'

const MASS = 0.188
const FORCE = 0.003
const RESTITUTION = 1
// Phaser.Physics.Matter.Image
class Bullet extends Actor {
  constructor (config) {
    super(config.scene.matter.world, config.x, config.y, 'bullet')
    // this must be called first or collision filter wont work
    this.setCircle(8)
    this.setCollisionCategory(this.scene.collisionCategories.bullet)
    this.setCollidesWith([this.scene.collisionCategories.world, this.scene.collisionCategories.bullet])
    this.body.restitution = RESTITUTION
    this.setMass(MASS)
    this.collisions()
    this.bounces = 0
  }

  fire (mouseVector) {
    let targetAngle = Phaser.Math.Angle.Between(
      mouseVector.x,
      mouseVector.y,
      this.x,
      this.y
    )

    targetAngle = targetAngle - Math.PI

    this.applyForce({
      x: Math.cos(targetAngle) * FORCE,
      y: Math.sin(targetAngle) * FORCE
    })
  }

  collisions () {
    this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      // objectB: trapDoor,
      callback: function (eventData) {
        this.bounces++
        if (this.bounces > 1) {
          // might have to move this outside of the class
          this.destroy()
          return
        }
        this.scene.time.addEvent({
          delay: 4000,
          callback: () => {
            this.destroy()
          },
          callbackScope: this
        })
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

export default Bullet
