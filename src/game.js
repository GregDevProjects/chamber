import Player from './actors/player/index'
import { GAME_HEIGHT, GAME_WIDTH, FRAME_WIDTH, FRAME_HEIGHT } from './constants'

import Actor from './actors/actor'
import BlockSpawner from './ai/blockSpawner'
import DeathLine from './actors/deathLine'
class Game extends Phaser.Scene {
  constructor (test) {
    super({
      key: 'Game',
      active: false,
      width: GAME_WIDTH,
      height: GAME_HEIGHT
    })
  }

  init (test) {
    this.collisionCategories = test.collisionCategories
  }

  create () {
    this.cameras.main.setPosition((FRAME_WIDTH - GAME_WIDTH) / 2,
      (FRAME_HEIGHT - GAME_HEIGHT) / 2)
    this.cameras.main.setSize(GAME_WIDTH,
      GAME_HEIGHT)
    this.cameras.main.setBackgroundColor('ffffff')

    this.blocks = this.add.group()
    this.matter.world.setBounds(
      0,
      0,
      GAME_WIDTH,
      GAME_HEIGHT
    )

    this.player = new Player({ scene: this, x: 250, y: 250 })
    this.blockSpawner = new BlockSpawner(this)

    const deathLineTop = new DeathLine({ scene: this, x: GAME_WIDTH / 2, y: 10, width: GAME_WIDTH, height: 10 })
    const deathLineBottom = new DeathLine({ scene: this, x: GAME_WIDTH / 2, y: GAME_HEIGHT - 10, width: GAME_WIDTH, height: 10 })
    const deathLineRight = new DeathLine({ scene: this, x: GAME_WIDTH - 10, y: GAME_HEIGHT / 2, width: 10, height: GAME_HEIGHT })
    const deathLineLeft = new DeathLine({ scene: this, x: 10, y: GAME_HEIGHT / 2, width: 10, height: GAME_HEIGHT })
  }

  update (time, delta) {
    this.blockSpawner.update(delta)
    this.player.update(delta)
  }
}

export default Game
