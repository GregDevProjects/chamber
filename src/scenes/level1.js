import Player from '../actors/player/index'
import { FRAME_WIDTH, FRAME_HEIGHT, GAME_HEIGHT, GAME_WIDTH } from '../constants'

import createBlockBarrier from '../ai/blockBarrier'
import BlocksController from '../ai/blocksController'
import createPlayerBarrier from '../ai/playerBarrier'
import DialogueManager from '../actors/dialogueManager'
import drawBackground from '../ai/frameBackground'

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

    this.dialogue = new DialogueManager(this)
    this.dialogue.setAnchor(this.player.head,
      this.player)
    this.dialogue.setText('What is this...')

    // this.blockGroup = this.add.group()
    // this.blocksController = new BlocksController(this)
    // this.blocksController.startRandomSpawning()

    const onSpacePress = (timesPressed) => {
      console.log(timesPressed)
      if (timesPressed === 1) {
        this.dialogue.destroy()
        this.dialogue.setText('Where the hell am I?')
      }
    }
    this.spaceCounter = new SpaceCounter(this,
      onSpacePress)

    createBlockBarrier(this)
    createPlayerBarrier(this)
    drawBackground(this)

    const style = {
      fontSize: 24,
      fontFamily: 'Arial',
      align: 'left',
      wordWrap: { width: 370, useAdvancedWrap: true },
      color: 'black'
    }

    this.text = this.add.text(
      this.player.x - 100,
      this.player.y + 50,
      'PRESS SPACE TO ADVANCE DIALOGUE',
      style
    )

    this.graphics.fillStyle(0xffff00,
      1)

    this.graphics.fillRect(
      FRAME_WIDTH / 2,
      GAME_HEIGHT,
      400,
      200
    )
    this.graphics.strokePath()
    this.graphics.fillPath()
    // this.matter.world.setGravity(
    //   0,
    //   1,
    //   0.0001
    // )
  }

  update (time, delta) {
    // debugger

    // ddthis.blocksController.update(delta)

    this.player.update(delta)

    this.dialogue.update()
  }
}

class SpaceCounter {
  constructor (scene, onSpacePress) {
    this.timesSpaceWasPressed = 0
    this.onSpacePress = onSpacePress
    this.counterEvent(scene)
  }

  counterEvent (scene) {
    scene.input.keyboard.on('keydown_SPACE',
      (event) => {
        this.timesSpaceWasPressed++
        this.onSpacePress(this.timesSpaceWasPressed)
      })
  }

  timesPressed () {
    return this.timesSpaceWasPressed
  }
}

export default Level1
