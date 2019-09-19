class Actor extends Phaser.Physics.Matter.Image {
  constructor (world, x, y, assetKey) {
    super(world, x, y, assetKey)
    this.matter = world
    this.scene = world.scene
  }
}

export default Actor
