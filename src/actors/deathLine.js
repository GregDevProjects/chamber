import { GAME_WIDTH } from '../constants'
import Actor from './actor'

class DeathLine extends Actor {
  constructor (config) {
    super(config.scene.matter.world, config.x, config.y, 'player')
    this.setRectangle(GAME_WIDTH, 10)
    this.setCollidesWith([this.scene.collisionCategories.player, this.scene.collisionCategories.bullet])
    this.setStatic(true)
    this.setCollisionCategory(this.scene.collisionCategories.deathLine)
  }
}

export default DeathLine
