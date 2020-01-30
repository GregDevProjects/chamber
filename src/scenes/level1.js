import Player from '../actors/player/index'
import { GAME_HEIGHT, GAME_WIDTH, FRAME_WIDTH, FRAME_HEIGHT } from '../constants'

import createBlockBarrier from '../ai/blockBarrier'
import BlocksController from '../ai/blocksController'
import createPlayerBarrier from '../ai/playerBarrier'

class Level1 extends Phaser.Scene {
  constructor (test) {
    super({
      key: '1',
      active: false,
      width: GAME_WIDTH,
      height: GAME_HEIGHT
    })
  }

  init (collisionCategories) {
    this.collisionCategories = collisionCategories
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

    this.dialogue = new DialogueManager(this)
    this.dialogue.setAnchor(this.player)
    this.dialogue.setText('What is this.. where the hell am I? What is this.. where the hell am I?')
    // this.blocksController = new BlocksController(this)
    // this.blocksController.startRandomSpawning()
    // createBlockBarrier(this)
    // createPlayerBarrier(this)

    // this.matter.world.setGravity(
    //   0,
    //   1,
    //   0.0001
    // )
  }

  update (time, delta) {
    // debugger
    // this.blocksController.update(delta)

    this.player.update(delta)

    this.dialogue.update()
  }
}

class DialogueManager {
  constructor (scene) {
    this.scene = scene
    this.text = ''
    this.anchor = null
    this.dialogueBox = null
  }

  setAnchor (anchor) {
    this.anchor = anchor
  }

  moveText () {
    const [x, y] = this.textPositionAboveAnchor(this.anchor.x,
      this.anchor.y)
    // debugger
    this.text.setPosition(x,
      y)
  }

  moveDialogueBox () {
    const [x, y] = this.dialogueBoxPosition(this.anchor.x,
      this.anchor.y)
    // debugger
    this.dialogueBox.setPosition(x,
      y)
  }

  makeDialogueBox (x, y) {
    const graphics = this.scene.add.graphics()
    graphics.lineStyle(
      5,
      'black',
      1.0
    )
    graphics.fillStyle(0xffff00,
      1)

    //  32px radius on the corners
    graphics.fillRoundedRect(
      x,
      y,
      400,
      100,
      32
    )

    graphics.strokeRoundedRect(
      x,
      y,
      400,
      100,
      32
    )

    this.dialogueBox = graphics
  }

  dialogueBoxPosition (x, y) {
    y -= 400
    x -= 240
    return [x, y]
  }

  textPositionAboveAnchor (x, y) {
    y -= 125
    x += 30
    return [x, y]
  }

  setText (text) {
    this.makeDialogueBox(this.anchor.x,
      this.anchor.y)

    const style = {
      fontSize: 24,
      fontFamily: 'Arial',
      align: 'left',
      wordWrap: { width: 370, useAdvancedWrap: true },
      color: 'black'
    }

    this.text = this.scene.add.text(
      this.anchor.x,
      this.anchor.y,
      text,
      style
    )
  }

  update () {
    if (!this.anchor || !this.text) {
      return
    }

    this.moveText()
    this.moveDialogueBox()
  }
}

export default Level1
