import Pickup from "../effects/pickup";

class GunFloating extends Phaser.GameObjects.Image {
  constructor(x, y, scene, onPickup) {
    super(scene, x, y, "gun");
    scene.add.existing(this);
    this.setDepth(2);
    scene.matter.add.gameObject(this);

    this.pickupEffect = new Pickup(scene);

    this.setCollidesWith(this.scene.collisionCategories.player);
    this.setCollisionCategory(this.scene.collisionCategories.pickup);

    this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      callback: function(eventData) {
        onPickup();
        this.destroy();
        this.pickupEffect.fillScreen();
      },
      context: this // Context to apply to the callback function
    });
  }

  update(time) {
    this.pickupEffect.update(time);
    if (this.active) this.angle++;
  }
}

export default GunFloating;
