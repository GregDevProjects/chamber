import Player from '../actors/player/index'
import { FRAME_WIDTH, FRAME_HEIGHT, GAME_HEIGHT, GAME_WIDTH } from '../constants'

import createBlockBarrier from '../ai/blockBarrier'
import BlocksController from '../ai/blocksController'
import createPlayerBarrier from '../ai/playerBarrier'
import DialogueManager from '../dialogue/dialogueManager'
import drawBackground from '../ai/frameBackground'

import RobotDialogue from '../dialogue/RobotDialogue'
import HumanDialogue from '../dialogue/HumanDialogue'

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

  setupPlayer () {
    this.player = new Player({ scene: this, x: 500, y: 250 })
    this.player.removeGun()
    this.player.removeControls()
  }

  setupCamera () {
    this.cameras.main.setBackgroundColor('ffffff')
    this.cameras.main.setZoom(1)
  }

  startGameplay () {
    this.musicScene.setVolume(1)
    this.robotDialogue.destroy()
    this.blocksController.setPadding(70,
      150)
    this.blocksController.changeBlockType(2)
    this.blocksController.startRandomSpawning()
    this.time.addEvent({
      delay: 3000,
      callback:
        () => {
          this.humanDialogue.setText('This helmet seems pretty flimsy, better watch my HEAD')
        },
      callbackScope: this
    })
  }

  resetScene () {
    this.scene.restart()
  }

  create () {
    this.setupPlayer()
    this.setupCamera()
    this.rotatePlayer = true
    this.blocksController = new BlocksController(this)

    this.humanDialogue = new HumanDialogue(this)
    this.humanDialogue.setAnchor(this.player.head,
      this.player)
    this.humanDialogue.setText('What is this...')

    this.musicScene = this.scene.get('music')
    this.musicScene.setVolume(0.2)
    // this.blockGroup = this.add.group()

    const onSpacePress = (timesPressed) => {
      this.humanDialogue.destroy()
      this.robotDialogue.destroy()

      if (timesPressed === 1) {
        this.humanDialogue.setText('Where the hell am I?')
      }
      if (timesPressed === 2) {
        this.robotDialogue.setAnchor({ x: 500, y: 500 })
        this.robotDialogue.setText('Do not be afraid, I can help')
      }
      if (timesPressed === 3) {
        this.robotDialogue.setAnchor({ x: 250, y: 600 })
        this.robotDialogue.setText('Use the A and D keys to rotate')
        this.player.giveControls()
        this.rotatePlayer = false
      }
      if (timesPressed === 4) {
        this.robotDialogue.destroy()
        this.robotDialogue.setAnchor({ x: 700, y: 400 })
        this.robotDialogue.setText('Use W to accelerate')
      }
      if (timesPressed === 5) {
        this.robotDialogue.destroy()
        this.humanDialogue.setText('You didn\'t answer my question!')
      }
      if (timesPressed === 6) {
        this.humanDialogue.destroy()
        this.robotDialogue.setAnchor({ x: 250, y: 200 })
        this.robotDialogue.setText('This is low priority information compared to SURVIVAL')
      }
      if (timesPressed === 7) {
        this.humanDialogue.destroy()
        this.robotDialogue.setAnchor({ x: 800, y: 200 })
        this.robotDialogue.setText('Move towards the center')
      }
      if (timesPressed === 8) {
        this.startGameplay()
      }
    }

    this.spaceCounter = new SpaceCounter(this,
      onSpacePress)

    this.robotDialogue = new RobotDialogue(this)
    this.robotDialogue.setAnchor({ x: 500, y: 500 })
    // this.robotDialogue.setText('Do not be afraid')
    // this.robotDialogue.drawDialogueBubble()
    // robotDialogue(this,
    //   { x: 500, y: 500 })

    createBlockBarrier(this)
    // dcreatePlayerBarrier(this)
    drawBackground(this)

    // this.matter.world.setGravity(
    //   0,
    //   1,
    //   0.0001
    // )

    this.asc = true
  }

  update (time, delta) {
    // debugger

    this.blocksController.update(delta)

    this.player.update(delta)
    if (this.rotatePlayer) {
      this.player.setAngularVelocity(0.02)
    }

    this.robotDialogue.update()
    this.humanDialogue.update()
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
