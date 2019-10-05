import Player from './actors/player'
import { GAME_HEIGHT, GAME_WIDTH } from './constants'

import Actor from './actors/actor'
import BlockSpawner from './ai/blockSpawner'
import DeathLine from './actors/deathLine'
class Game extends Phaser.Scene {
  constructor (test) {
    super({
      key: 'Game'
    })
  }

  init (test) {
    this.collisionCategories = test.collisionCategories
  }

  create () {
    this.blocks = this.add.group()
    this.matter.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT)

    const player = new Player({ scene: this, x: 250, y: 250 })
    this.blockSpawner = new BlockSpawner(this)

    const deathLineTop = new DeathLine({ scene: this, x: GAME_WIDTH / 2, y: 10 })

    const deathLineBottom = new DeathLine({ scene: this, x: GAME_WIDTH / 2, y: GAME_HEIGHT - 10 })

    // this.cameras.main.setZoom(0.5)
    // rect.setRectangle(GAME_WIDTH, 10)
    // rect.setStatic(true)
    // console.log(rect)
  }

  update (time, delta) {
    this.blockSpawner.update(delta)
  }
}

export default Game
