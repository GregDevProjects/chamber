

const RADIOUS = 9
// Phaser.Physics.Matter.Image
class Head extends Phaser.GameObjects.Arc {
  constructor (config) {
    super(
      config.scene,
      config.x,
      config.y,
      RADIOUS,
      undefined,
      undefined,
      undefined,
      0x0000ff
    )
    this.scene.add.existing(this)
    this.scene.matter.add.gameObject(this)
    this.setCircle(RADIOUS)
    this.setStatic(true)
    this.setCollisionCategory(this.scene.collisionCategories.bullet)
    this.setCollidesWith([])
    this.collisions()
  }


  collisions () {
    this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      // objectB: trapDoor,
      callback: function (eventData) {
        console.log(eventData)
      },
      context: this // Context to apply to the callback function
    })
  }
}

export default Head
