import Player from '../actors/player/index'
import { FRAME_WIDTH, FRAME_HEIGHT, GAME_HEIGHT, GAME_WIDTH } from '../constants'

import createBlockBarrier from '../ai/blockBarrier'
import BlocksController from '../ai/blocksController'
import createPlayerBarrier from '../ai/playerBarrier'
import DialogueManager from '../actors/dialogueManager'

class Level1 extends Phaser.Scene {
  constructor (test) {
    super({
      key: '1',
      active: false,
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT
    })
  }

  init (collisionCategories) {
    this.collisionCategories = collisionCategories
  }

  create () {
    this.cameras.main.setBackgroundColor('ffffff')
    this.cameras.main.setZoom(0.5)
    this.player = new Player({ scene: this, x: 250, y: 250 })

    this.blockGroup = this.add.group()

    this.dialogue = new DialogueManager(this)
    this.dialogue.setAnchor(this.player.head,
      this.player)
    this.dialogue.setText('What is this.. where the hell am I? What is this.. where the hell am I?')
    this.blocksController = new BlocksController(this)
    this.blocksController.startRandomSpawning()
    createBlockBarrier(this)
    createPlayerBarrier(this)

    this.graphics = this.add.graphics()

    this.graphics.lineStyle(
      6,
      0x000000,
      1
    )

    this.graphics.fillStyle(0xffff00,
      1)
    // OUTER SQUARE
    this.graphics.moveTo(0,
      0)

    this.graphics.lineTo(FRAME_WIDTH,
      0)

    this.graphics.lineTo(FRAME_WIDTH,
      FRAME_HEIGHT)

    this.graphics.lineTo(0,
      FRAME_HEIGHT)

    this.graphics.lineTo(0,
      0)
    // INNER SQUARE
    this.graphics.moveTo(150,
      150)

    this.graphics.lineTo(150 + GAME_WIDTH,
      150)

    this.graphics.closePath()
    this.graphics.fillPath()
    this.graphics.strokePath()
    this.graphics.setDepth(100)
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

    this.dialogue.update()
  }
}

export default Level1
