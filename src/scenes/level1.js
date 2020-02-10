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

    this.test.draw()
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
    this.test.draw()
    this.dialogue.update()
  }
}

class robotDialogue {
  constructor (scene, anchor) {
    this.scene = scene
    this.graphics = scene.add.graphics()
    this.anchor = anchor
    this.step = 30
    this.radius = 70
    this.movingPoints = []
    this.growRate = 0.5
    this.framesToSpendGrowing = 200
  }

  degreesToRadians (degrees) {
    return degrees * Math.PI / 180
  }

  nextSpikeMovement (index) {
    // this.movingPoints[index].radius = 200

    // debugger
    const sinWave = Math.abs(Math.sin(this.scene.time.now / 1000)) * 30

    const newRad = this.movingPoints[index].radius + sinWave

    const newx = (this.radius + newRad) * Math.cos(this.degreesToRadians(index + this.step / 2)) + this.anchor.x
    const newy = (this.radius + newRad) * Math.sin(this.degreesToRadians(index + this.step / 2)) + this.anchor.y

    return { x: newx, y: newy }
  }

  draw () {
    this.graphics.clear()
    this.graphics.fillStyle(0xffff00,
      1)

    this.graphics.lineStyle(
      6,
      0x000000,
      1
    )

    this.graphics.fillStyle(0xffff00,
      1)

    // const radius = 100

    for (let i = 0; i < 360; i += this.step) {
      const x = this.radius * Math.cos(this.degreesToRadians(i)) + this.anchor.x
      const y = this.radius * Math.sin(this.degreesToRadians(i)) + this.anchor.y

      this.graphics.lineTo(x,
        y)

      // find a point between this one and the next, give it a random radius
      if (!this.movingPoints[i]) {
        const newRad = Phaser.Math.Between(20,
          100)
        const newx = this.movingPoints[i] ? this.movingPoints[i].x
          : (this.radius + newRad) * Math.cos(this.degreesToRadians(i + this.step / 2)) + this.anchor.x
        const newy = this.movingPoints[i] ? this.movingPoints[i].y
          : (this.radius + newRad) * Math.sin(this.degreesToRadians(i + this.step / 2)) + this.anchor.y

        this.movingPoints[i] = { x: newx, y: newy, radius: newRad }
      }

      // handle shrink.grow of points
      const animatePoints = this.nextSpikeMovement(i)
      // console.log(animatePoints)
      this.graphics.lineTo(animatePoints.x,
        animatePoints.y)
    }
    // console.log(this.movingPoints)

    this.graphics.closePath()

    this.graphics.strokePath()

    this.graphics.fillPath()
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
