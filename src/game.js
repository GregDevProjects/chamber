import Player from './actors/player/index'
import { GAME_HEIGHT, GAME_WIDTH, FRAME_WIDTH, FRAME_HEIGHT } from './constants'

import createBlockBarrier from './ai/blockBarrier'
import BlocksController from './ai/blocksController'
import createPlayerBarrier from './ai/playerBarrier'

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

    this.matter.world.setBounds(
      0,
      0,
      GAME_WIDTH,
      GAME_HEIGHT
    )

    this.player = new Player({ scene: this, x: 250, y: 250 })
    this.blockGroup = this.add.group()

    this.blocksController = new BlocksController(this)
    this.blocksController.startRandomSpawning()
    createBlockBarrier(this)
    createPlayerBarrier(this)

    // this.matter.world.setGravity(
    //   0,
    //   1,
    //   0.0001
    // )
  }

  update (time, delta) {
    // debugger
    this.blocksController.update(delta)

    this.player.update(delta)
  }
}

export default Game
