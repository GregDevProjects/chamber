import { GAME_WIDTH } from '../constants'
import Actor from './actor'

class DeathLine extends Phaser.GameObjects.Rectangle {
  constructor (config) {
    super(
      config.scene,
      config.x,
      config.y,
      config.width,
      config.height,
      0xc90707
    )

    this.scene.add.existing(this)
    this.scene.matter.add.gameObject(this,
      { isSensor: true })
    this.setCollidesWith([this.scene.collisionCategories.player, this.scene.collisionCategories.bullet])
    this.setDepth(1)
    this.setCollisionCategory(this.scene.collisionCategories.deathLine)
  }
}

export default DeathLine
