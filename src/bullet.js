import Actor from './actor/actor'

const MASS = 0.188
const FORCE = 0.003
const RESTITUTION = 2
// Phaser.Physics.Matter.Image
class Bullet extends Actor {
  constructor (config) {
    super(config.scene.matter.world, config.x, config.y, 'bullet')
    // this must be called first or collision filter wont work
    this.setCircle(8)
    this.setCollisionCategory(config.collisionCat)
    this.setCollidesWith([1])
    this.body.restitution = RESTITUTION
    this.setMass(MASS)
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
}

export default Bullet
