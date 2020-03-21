const MASS = 0.188;
const FORCE = 0.005;
const RESTITUTION = 1;
const RADIOUS = 8;
// Phaser.Physics.Matter.Image
class Bullet extends Phaser.GameObjects.Arc {
  constructor(config) {
    super(
      config.scene,
      config.x,
      config.y,
      RADIOUS,
      undefined,
      undefined,
      undefined,
      0x551a8b
    );
    this.scene.add.existing(this);
    this.scene.matter.add.gameObject(this);
    this.setCircle(RADIOUS);
    this.setCollisionCategory(this.scene.collisionCategories.bullet);
    this.setCollidesWith([
      this.scene.collisionCategories.world,
      this.scene.collisionCategories.bullet,
      this.scene.collisionCategories.block
    ]);
    this.body.restitution = RESTITUTION;
    this.setMass(MASS);
    this.collisions();
    this.bounces = 0;
  }

  fire(mouseVector) {
    let targetAngle = Phaser.Math.Angle.Between(
      mouseVector.x,
      mouseVector.y,
      this.x,
      this.y
    );

    targetAngle = targetAngle - Math.PI;

    this.applyForce({
      x: Math.cos(targetAngle) * FORCE,
      y: Math.sin(targetAngle) * FORCE
    });
  }

  collisions() {
    this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      // objectB: trapDoor,
      callback: function(eventData) {
        this.bounces++;
        if (this.bounces > 1) {
          // might have to move this outside of the class
          this.destroy();
          return;
        }
        this.scene.time.addEvent({
          delay: 4000,
          callback: () => {
            this.destroy();
          },
          callbackScope: this
        });
      },
      context: this // Context to apply to the callback function
    });
  }
}

export default Bullet;
