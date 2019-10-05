import { GAME_WIDTH } from '../constants'
import Actor from './actor'

class DeathLine extends Actor {
  constructor (config) {
    super(config.scene.matter.world, config.x, config.y, 'player', { isSensor: true })
    this.scaleX = config.width / 128
    this.scaleY = config.height / 128
    this.setTintFill(0xc90707)
    this.setRectangle(config.width, config.height)
    this.setCollidesWith([this.scene.collisionCategories.player, this.scene.collisionCategories.bullet])
    // this.setStatic(true)
    this.setDepth(1)
    this.setCollisionCategory(this.scene.collisionCategories.deathLine)
    // this.setTexture()
  }
}

export default DeathLine
