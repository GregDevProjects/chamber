import Player from './actors/player'
import { GAME_HEIGHT, GAME_WIDTH } from './constants'

// import Block from './actors/block'
import BlockSpawner from './ai/blockSpawner'
class Game extends Phaser.Scene {
  constructor (test) {
    super({
      key: 'Game'
    })
  }

  create () {
    this.blocks = this.add.group()
    this.matter.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT)

    this.collisionCategories = {
      player: this.matter.world.nextCategory(),
      bullet: this.matter.world.nextCategory(),
      block: this.matter.world.nextCategory(),
      world: 1
    }

    const player = new Player({ scene: this, x: 250, y: 250, collisions: this.collisionManager })
    this.blockSpawner = new BlockSpawner(this)

    this.input.on('pointerdown', (coords) => {
      const force = 0.04
      const mouseVector = {
        x: coords.worldX,
        y: coords.worldY
      }

      player.shoot(mouseVector, force)
    })
  }

  update (time, delta) {
    this.blockSpawner.update(delta)
  }
}

export default Game
