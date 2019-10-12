import { SPAWN_LOCATION } from '../constants'
const MOVE_SPEED = 0.1

class Block extends Phaser.GameObjects.Polygon {
  constructor (config) {
    const verts = [
      { x: 0, y: 0 },
      { x: config.w, y: 0 },
      { x: config.w, y: config.h },
      { x: 0, y: config.h }
    ]
    super(
      config.scene,
      config.x,
      config.y,
      verts,
      0x6666ff

    )
    this.scene.add.existing(this)
    this.scene.matter.add.gameObject(this)

    this.setCollidesWith([
      this.scene.collisionCategories.player,
      this.scene.collisionCategories.bullet,
      this.scene.collisionCategories.blockBarrier,
      this.scene.collisionCategories.block
    ])

    this.body.restitution = 1
    this.applyModifier()
    this.collisionEvent()

    this.setCollisionCategory(this.scene.collisionCategories.block)
  }

  applyModifier () {
    const rand = Phaser.Math.Between(1,
      5)

    if (rand === 1) {
      this.setStatic(true)
      this.setFillStyle(0x000000)
    } else if (rand === 2) {
      this.setMass(5)
      this.setFillStyle(0xadd8e6)
    } else if (rand === 3) {
      this.destroyOnShot = true
      this.setFillStyle(0xdaa520)
    } else if (rand === 4) {
      this.killPlayer = true
      this.setFillStyle(0xff0000)
    } else if (rand === 5) {
      this.setMass(2)
      this.setFillStyle(0x00FF00,
        0.6)
      this.setDepth(2)
      this.setCollidesWith([
        this.scene.collisionCategories.player,
        this.scene.collisionCategories.bullet,
        this.scene.collisionCategories.blockBarrier
      ])
    }
  }

  move (delta, direction) {
    if (direction === SPAWN_LOCATION.bottom) {
      this.y -= MOVE_SPEED * delta
    } else if (direction === SPAWN_LOCATION.top) {
      this.y += MOVE_SPEED * delta
    } else if (direction === SPAWN_LOCATION.right) {
      this.x += MOVE_SPEED * delta
    } else if (direction === SPAWN_LOCATION.left) {
      this.x -= MOVE_SPEED * delta
    }
  }

  collisionEvent () {
    this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      // objectB: trapDoor,
      callback: function (eventData) {
        const collidedWith = eventData.bodyB.collisionFilter.category
        if (collidedWith === this.scene.collisionCategories.blockBarrier) {
          this.destroy()
          return
        }

        if (collidedWith === this.scene.collisionCategories.bullet &&
          this.destroyOnShot &&
          eventData.gameObjectB &&
          eventData.gameObjectB.bounces > 0) {
          this.destroy()
        }
      },
      context: this // Context to apply to the callback function
    })
  }
}

export default Block
