import Actor from './actor'

const MOVE_SPEED = 0.1

class Block extends Actor {
  constructor (config) {
    super(config.scene.matter.world, config.x, config.y, 'player')
    this.setRectangle(config.w, config.h)
    this.setCollidesWith([this.scene.collisionCategories.player, this.scene.collisionCategories.bullet])

    // this.setStatic(true)
    this.applyModifier()
  }

  applyModifier () {
    const rand = Phaser.Math.Between(1, 2)

    if (rand === 1) {
      this.setStatic(true)
    } else if (rand === 2) {
      this.body.restitution = 1
    }
  }

  move (delta) {
    this.y -= MOVE_SPEED * delta
  }
}

export default Block
