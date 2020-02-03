const RADIOUS = 9

class Head extends Phaser.GameObjects.Arc {
  constructor (config) {
    super(
      config.scene,
      config.player.x,
      config.player.y,
      RADIOUS,
      undefined,
      undefined,
      undefined,
      0x0000ff
    )
    this.player = config.player
    this.scene.add.existing(this)

    this.scene.matter.add.gameObject(this)

    this.setCircle(RADIOUS)
    this.setCollisionCategory(this.scene.collisionCategories.bullet)
    this.setCollidesWith([
      this.scene.collisionCategories.world,
      this.scene.collisionCategories.block,
      this.scene.collisionCategories.deathLine
    ])

    this.collisions()
  }

  collisions () {
    this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      // bullet too?
      callback: function (eventData) {
        const collidedWith = eventData.bodyB.collisionFilter.category
        if (
          collidedWith === this.scene.collisionCategories.block ||
          collidedWith === this.scene.collisionCategories.deathLine
        ) {
          this.player.death()
        }
      },
      context: this // Context to apply to the callback function
    })
  }

  degreesToRadians (degrees) {
    return degrees * Math.PI / 180
  }

  update () {
    const playerAngle = this.player.angle
    const x = this.player.x + 25 * Math.cos(this.degreesToRadians(playerAngle - 90))
    const y = this.player.y + 25 * Math.sin(this.degreesToRadians(playerAngle - 90))
    this.setPosition(x,
      y)
  }
}

export default Head
