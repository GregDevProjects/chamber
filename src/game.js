import Player from './actors/player'
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

    const player = new Player({ scene: this, x: 250, y: 250 })
    this.blockSpawner = new BlockSpawner(this)

    const deathLineTop = new DeathLine({ scene: this, x: GAME_WIDTH / 2, y: 10, width: GAME_WIDTH, height: 10 })
    const deathLineBottom = new DeathLine({ scene: this, x: GAME_WIDTH / 2, y: GAME_HEIGHT - 10, width: GAME_WIDTH, height: 10 })
    const deathLineRight = new DeathLine({ scene: this, x: GAME_WIDTH - 10, y: GAME_HEIGHT / 2, width: 10, height: GAME_HEIGHT })
    const deathLineLeft = new DeathLine({ scene: this, x: 10, y: GAME_HEIGHT / 2, width: 10, height: GAME_HEIGHT })

    // debugger
    new Test(
      this.matter.world,
      200,
      200
    )
    // https://github.com/photonstorm/phaser/blob/8af70d02d1f42a0b56e618840d27b2d1807848cf/src/physics/matter-js/lib/render/Render.js#L59
    // this.cameras.main.backgroundColor.setTo(255, 255, 255)
    // this.cameras.main.setZoom(0.5)
    // rect.setRectangle(GAME_WIDTH, 10)
    // rect.setStatic(true)
    // console.log(rect)
  }

  update (time, delta) {
    this.blockSpawner.update(delta)
  }
}

class Test extends Phaser.Physics.Matter.Sprite {
  constructor (
    world, x, y
  ) {
    super(
      world,
      x,
      y,
      'player',
      null,
      {
        vertices: [
          { x: 10, y: 10 },
          { x: 30, y: 30 },
          { x: 500, y: 10 }
        ],
        render: {
          fillStyle: 'red',
          strokeStyle: 'blue',
          lineWidth: 3,
          wireframes: false
        }
      }
    )
    this.matter = world
    this.scene = world.scene
    this.collisionCategories = this.scene.collisionCategories
    this.scene.add.existing(this)
  }

  getRightX () {
    return this.width / 2 + this.x
  }
}

export default Game
