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
    this.dialogue.setAnchor(this.player.head,
      this.player)
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

    this.graphics = this.scene.add.graphics()
  }

  setAnchor (anchor, body) {
    this.anchor = anchor
    this.body = body
  }

  textPositionAboveAnchor (x, y) {
    y -= 130
    x += 30
    return [x, y]
  }

  moveText () {
    const [x, y] = this.textPositionAboveAnchor(this.body.x,
      this.body.y)
    // debugger
    this.text.setPosition(x,
      y)
  }

  setText (text) {
    // TODO: play a sound here
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
      '',
      style
    )

    this.textCharacterArray = text.split('')
    this.textDisplay = ''

    const onEvent = () => {
      this.textDisplay += this.textCharacterArray.shift()
      this.text.setText(this.textDisplay)
    }

    this.scene.time.addEvent({
      delay: 60,
      callback:
      onEvent,
      callbackScope: this,
      repeat: this.textCharacterArray.length - 1
    })
  }

  drawDialogueBubble () {
    this.graphics.clear()

    this.graphics.lineStyle(
      6,
      0x000000,
      1
    )

    this.graphics.fillStyle(0xffff00,
      1)

    const x = this.anchor.x
    const y = this.anchor.y

    this.graphics.beginPath()

    this.graphics.lineTo(x + 10,
      y - 10) // head

    this.graphics.lineTo(this.body.x + 70,
      this.body.y - 70)

    this.graphics.moveTo(this.body.x + 130,
      this.body.y - 70)

    this.graphics.lineTo(this.body.x + 400,
      this.body.y - 70)

    this.graphics.lineTo(this.body.x + 400,
      this.body.y - 140)

    this.graphics.lineTo(this.body.x + 20,
      this.body.y - 140)

    this.graphics.lineTo(this.body.x + 20,
      this.body.y - 71)

    this.graphics.lineTo(this.body.x + 20,
      this.body.y - 70)

    this.graphics.lineTo(this.body.x + 50,
      this.body.y - 70)

    this.graphics.lineTo(x + 10,
      y - 10) // head

    this.graphics.closePath()
    this.graphics.strokePath()
    this.graphics.fillPath()
  }

  update () {
    if (!this.anchor || !this.text) {
      return
    }
    // this.yo += 'a'

    this.moveText()
    this.drawDialogueBubble()
  }
}

export default Level1
