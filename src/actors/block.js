import Actor from './actor'

const MOVE_SPEED = 0.1

class Block extends Actor {
  constructor (config) {
    super(config.scene.matter.world, config.x, config.y, 'player')
    this.setRectangle(config.w, config.h)
    this.setCollidesWith([this.scene.collisionCategories.player, this.scene.collisionCategories.bullet])
  }

  move (delta) {
    this.y -= MOVE_SPEED * delta
  }
}

export default Block
