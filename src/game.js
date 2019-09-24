import Player from './actors/player'
import { GAME_HEIGHT, GAME_WIDTH } from './constants'

// import Block from './actors/block'
import BlockSpawner from './ai/blockSpawner'
import DeathLine from './actors/deathLine'
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
      deathLine: this.matter.world.nextCategory(),
      world: 1
    }

    const player = new Player({ scene: this, x: 250, y: 250 })
    this.blockSpawner = new BlockSpawner(this)

    const deathLine = new DeathLine({ scene: this, x: GAME_WIDTH / 2, y: 10 })
    // rect.setRectangle(GAME_WIDTH, 10)
    // rect.setStatic(true)
    // console.log(rect)
  }

  update (time, delta) {
    this.blockSpawner.update(delta)
  }
}

export default Game
