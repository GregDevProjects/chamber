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
    this.applyModifier(config.type)
    this.collisionEvent()
    this.setIgnoreGravity(true)
    this.setCollisionCategory(this.scene.collisionCategories.block)
  }

  applyModifier (type) {
    if (!type) {
      type = Phaser.Math.Between(1,
        5)
    }

    // this.setAngle(Phaser.Math.Between(0,
    //   360))
    this.restitution = 1
    if (type === 1) {
      this.setStatic(true)
      this.setFillStyle(0x000000)
    } else if (type === 2) {
      this.setMass(5)
      this.setFillStyle(0xadd8e6)
    } else if (type === 3) {
      this.destroyOnShot = true
      this.setFillStyle(0xdaa520)
    } else if (type === 4) {
      this.killPlayer = true
      this.setFillStyle(0xff0000)
    } else if (type === 5) {
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
        const collidedWith = eventData.gameObjectB ? eventData.gameObjectB.body.collisionFilter.category : eventData.bodyB.collisionFilter.category
        if (collidedWith === this.scene.collisionCategories.blockBarrier) {
          this.destroy()
          return
        }

        if (collidedWith === this.scene.collisionCategories.player) {
          const force = 3// eventData.gameObjectB.body.speed * 2

          const contactPointA = eventData.pair.collision.bodyA.position
          const contactPointB = eventData.pair.collision.bodyB.position

          const angle = Phaser.Math.Angle.BetweenPoints(contactPointA,
            contactPointB)

          this.setVelocity(Math.cos(angle) * force,
            Math.sin(angle) * force)

          const playerAngle = angle + Math.PI
          const playerForce = 2
          eventData.gameObjectB.setVelocity(Math.cos(playerAngle) * playerForce,
            Math.sin(playerAngle) * playerForce)
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
