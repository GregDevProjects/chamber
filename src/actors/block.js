import Actor from './actor'
import { SPAWN_LOCATION } from '../constants'
const MOVE_SPEED = 0.1

class Block extends Actor {
  constructor (config) {
    super(config.scene.matter.world, config.x, config.y, 'player')
    // this.setRectangle(config.w, config.h)
    this.setCollidesWith(
      [
        this.scene.collisionCategories.player,
        this.scene.collisionCategories.bullet,
        this.scene.collisionCategories.blockBarrier
      ]
    )
    this.body.restitution = 1
    // this.setStatic(true)
    this.applyModifier()
    this.collisionEvent()

    this.scaleX = config.w / 128
    this.scaleY = config.h / 128
    // debugger
    // this.width = config.w
    // this.height = config.h
  }

  applyModifier () {
    const rand = Phaser.Math.Between(1, 3)

    if (rand === 1) {
      this.setStatic(true)
      this.setTintFill(0x000000)
    } else if (rand === 2) {
      this.setMass(5)
      this.setTintFill(0xadd8e6)
    } else if (rand === 3) {
      this.destroyOnShot = true
      this.setTintFill(0xdaa520)
    }
    // this.setTexture('')
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
