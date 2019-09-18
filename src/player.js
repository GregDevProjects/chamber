/* eslint-disable no-undef */
class Player extends Phaser.Physics.Matter.Image {
  constructor (config) {
    super(config.scene.matter.world, config.x, config.y, 'player')
    // this must be called first or collision filter wont work
    this.setRectangle(50, 50)
    const playerCollisionCat = config.scene.matter.world.nextCategory()
    this.bulletCollisionCat = config.scene.matter.world.nextCategory()
    this.matter = config.scene.matter
    this.setCollisionCategory(playerCollisionCat)
    // collision id of world
    this.setCollidesWith([1])
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
    this.spawnProjectile(mouseVector)
  }

  spawnProjectile (mouseVector) {
    const force = 0.003
    const circle = this.matter.add.image(this.x, this.y, 'bullet')
    circle.setCircle(8)
    circle.setCollisionCategory(this.bulletCollisionCat)
    // debugger
    circle.restitution = 2

    let targetAngle = Phaser.Math.Angle.Between(
      mouseVector.x,
      mouseVector.y,
      this.x,
      this.y
    )

    targetAngle = targetAngle - Math.PI

    circle.applyForce({
      x: Math.cos(targetAngle) * force,
      y: Math.sin(targetAngle) * force
    })
  }
}

export default Player
