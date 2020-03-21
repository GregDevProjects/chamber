class Actor extends Phaser.Physics.Matter.Sprite {
  constructor(world, x, y, assetKey) {
    super(world, x, y, assetKey, null);
    this.matter = world;
    this.scene = world.scene;
    this.collisionCategories = this.scene.collisionCategories;
    this.scene.add.existing(this);
  }

  getRightX() {
    return this.width / 2 + this.x;
  }
}

export default Actor;
