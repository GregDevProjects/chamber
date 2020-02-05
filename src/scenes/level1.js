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
    this.cameras.main.setZoom(1)
    this.player = new Player({ scene: this, x: 500, y: 250 })

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

    this.test = new robotDialogue(this,
      { x: 500, y: 500 })

    // robotDialogue(this,
    //   { x: 500, y: 500 })

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

    // this.matter.world.setGravity(
    //   0,
    //   1,
    //   0.0001
    // )

    this.asc = true
  }

  update (time, delta) {
    // debugger

    // ddthis.blocksController.update(delta)

    this.player.update(delta)

    this.dialogue.update()

    if (this.test.step > 10) {
      this.asc = false
    }

    if (this.test.step <= 1) {
      this.asc = true
    }

    if (this.asc) {
      this.test.step += 0.05
      this.test.radius += 0.5
      this.test.draw()
    } else {
      this.test.step -= 0.05
      this.test.radius -= 0.5
      this.test.draw()
    }
  }
}

class robotDialogue {
  constructor (scene, anchor) {
    this.graphics = scene.add.graphics()
    this.anchor = anchor
    this.step = 1
    this.radius = 100
  }

  draw () {
    this.graphics.clear()
    this.graphics.fillStyle(0xffff00,
      1)

    this.graphics.lineStyle(
      2,
      0x000000,
      1
    )

    this.graphics.fillStyle(0xffff00,
      1)

    // const radius = 100
    for (let i = 0; i < 360; i += this.step) {
      const x = this.radius * Math.cos(i) + this.anchor.x
      const y = this.radius * Math.sin(i) + this.anchor.y
      if (i === 0) {
        this.graphics.moveTo(x,
          y)
        continue
      }
      this.graphics.lineTo(x,
        y)
    }

    this.graphics.closePath()

    this.graphics.strokePath()

    // this.graphics.fillPath()
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
        event.preventDefault()
        this.timesSpaceWasPressed++
        this.onSpacePress(this.timesSpaceWasPressed)
      })
  }

  timesPressed () {
    return this.timesSpaceWasPressed
  }
}

export default Level1
