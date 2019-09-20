import Player from './actors/player'
import { GAME_HEIGHT, GAME_WIDTH } from './constants'

import Actor from './actors/actor'

class Game extends Phaser.Scene {
  constructor (test) {
    super({
      key: 'Game'
    })
  }

  create () {
    this.blocks = this.add.group()
    this.matter.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT)

    this.collisionManager = {
      player: this.matter.world.nextCategory(),
      bullet: this.matter.world.nextCategory(),
      block: this.matter.world.nextCategory(),
      world: 1
    }

    const player = new Player({ scene: this, x: 250, y: 250, collisions: this.collisionManager })
    // debugger
    this.input.on('pointerdown', (coords) => {
      const force = 0.04
      const mouseVector = {
        x: coords.worldX,
        y: coords.worldY
      }

      player.shoot(mouseVector, force)
    })

    this.matterCollision.addOnCollideStart({
      objectA: player,
      // objectB: trapDoor,
      callback: function (eventData) {
        console.log(eventData)
        // This function will be invoked any time the player and trap door collide
        // const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
        // bodyA & bodyB are the Matter bodies of the player and door respectively
        // gameObjectA & gameObjectB are the player and door respectively
        // pair is the raw Matter pair data
      },
      context: this // Context to apply to the callback function
    })

    this.spawnGrid()

    this.time.addEvent({
      delay: 4000,
      callback: () => {
        this.spawnGrid()
      },
      callbackScope: this,
      repeat: -1
    })
  }

  spawnGrid () {
    // debugger
    let widthLeft = GAME_WIDTH
    const spaceBetween = 50
    do {
      const width = Phaser.Math.Between(100, 250)
      const height = Phaser.Math.Between(100, 250)
      const block = new Block({ w: width, h: height, x: widthLeft - width / 2, y: GAME_HEIGHT + width / 2, scene: this, collisions: this.collisionManager })
      this.blocks.add(block)
      widthLeft -= width
      widthLeft -= spaceBetween
    }
    while (widthLeft > 0)

    // debugger
  }

  update (time, delta) {
    this.blocks.children.iterate((block) => {
      if (!block) {
        return
      }
      block.move(delta)
      if (block.y + block.width < 0) {
        block.destroy()
        // this.blocks.kill(block)
      }
    })
    console.log(this.blocks.getLength())
    // console.log('jk')
  }
}

const MOVE_SPEED = 0.1

class Block extends Actor {
  constructor (config) {
    super(config.scene.matter.world, config.x, config.y, 'player')
    this.setRectangle(config.w, config.h)
    const collisions = config.collisions
    this.setCollidesWith([collisions.player, collisions.bullet])
  }

  move (delta) {
  //  this.applyForce({ y: 0.002 })
    this.y -= MOVE_SPEED * delta
  }
}

export default Game
