import { SPAWN_LOCATION, GAME_HEIGHT, GAME_WIDTH } from '../constants'
import Block from '../actors/block'
import Blinkers from '../blinkers'
import { gamePosition } from '../helpers'

const randomProperty = function (obj) {
  var keys = Object.keys(obj)
  return obj[keys[keys.length * Math.random() << 0]]
}

class BlockSpawner {
  constructor (scene, blocks) {
    this.blinkers = new Blinkers(scene)
    this.cursors = scene.input.keyboard.createCursorKeys()
    this.scene = scene
    this.blocks = blocks
    // space between blocks
    this.padding = { min: 30, max: 40 }
    this.width = { min: 10, max: 250 }
    this.height = { min: 10, max: 250 }
    this.spawnFrequency = 3500
    this.nextSpawn = randomProperty(SPAWN_LOCATION)
    this.spawnOrigin = randomProperty(SPAWN_LOCATION)
    this.spawnCount = 1
    this.type = null
  }

  setBlockType (type) {
    this.type = type
  }

  start () {
    this.spawnOnTimer()
    this.spawnGrid()
  }

  stop () {
    this.timer.remove()
  }

  spawnOnTimer () {
    this.timer = this.scene.time.addEvent({
      delay: this.spawnFrequency,
      callback: () => {
        this.spawnGrid()
        this.spawnCount++

        if ((this.spawnCount + 1) % 4 === 0 && this.nextSpawn !== this.spawnOrigin) {
          this.blinkers.showArrow(this.nextSpawn)
        }
        if (this.spawnCount % 4 === 0) {
          this.spawnOrigin = this.nextSpawn
          this.nextSpawn = randomProperty(SPAWN_LOCATION)
          this.blinkers.hideAllArrows()
        }
      },
      callbackScope: this,
      repeat: -1
    })
  }

  spawnGrid () {
    let lastSpawn = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }

    do {
      const width = Phaser.Math.Between(this.width.min,
        this.width.max)
      const height = Phaser.Math.Between(this.height.min,
        this.height.max)

      const xOrigin = this.getXOrigin(width,
        lastSpawn)
      const yOrigin = this.getYOrigin(
        height,
        width,
        lastSpawn
      )

      lastSpawn = {
        x: lastSpawn.x = xOrigin,
        y: yOrigin,
        width: width,
        height: height
      }

      if (!xOrigin || !yOrigin) {
        return
      }

      const block = new Block({
        w: width,
        h: height,
        x: gamePosition(xOrigin),
        y: gamePosition(yOrigin),
        scene: this.scene,
        type: this.type
      })

      this.blocks.add(block)
    }
    while (true)
  }

  getXOrigin (width, lastSpawn) {
    if (this.spawnOrigin === SPAWN_LOCATION.top || this.spawnOrigin === SPAWN_LOCATION.bottom) {
      let spawnLocationX = this.getGridPadding(1) + width / 2
      if (lastSpawn.x) {
        spawnLocationX += lastSpawn.width / 2 + lastSpawn.x
      }

      if (spawnLocationX + width / 2 > GAME_WIDTH) {
        return false
      }
      return spawnLocationX
    } else if (this.spawnOrigin === SPAWN_LOCATION.left) {
      return GAME_WIDTH + width / 2
    } else if (this.spawnOrigin === SPAWN_LOCATION.right) {
      return -width / 2
    }
  }

  getYOrigin (
    height, width, lastSpawn
  ) {
    if (this.spawnOrigin === SPAWN_LOCATION.top) {
      return -height / 2
    } else if (this.spawnOrigin === SPAWN_LOCATION.bottom) {
      return GAME_HEIGHT + height / 2
    } else if (this.spawnOrigin === SPAWN_LOCATION.left || this.spawnOrigin === SPAWN_LOCATION.right) {
      let spawnLocationY = this.getGridPadding(1) + height / 2
      if (lastSpawn.y) {
        spawnLocationY += lastSpawn.height / 2 + lastSpawn.y
      }

      if (spawnLocationY + width / 2 > GAME_HEIGHT) {
        return false
      }
      return spawnLocationY
    }
  }

  getGridPadding (difficulty) {
    return Phaser.Math.Between(this.padding.min,
      this.padding.max)
  }

  update (delta) {
    this.blocks.children.iterate((block) => {
      if (!block) {
        return
      }
      block.move(delta,
        this.spawnOrigin)
    })
    // for debugging
    if (this.cursors.left.isDown) {
      this.spawnOrigin = SPAWN_LOCATION.left
    } else if (this.cursors.right.isDown) {
      this.spawnOrigin = SPAWN_LOCATION.right
    }

    if (this.cursors.up.isDown) {
      this.spawnOrigin = SPAWN_LOCATION.bottom
    } else if (this.cursors.down.isDown) {
      this.spawnOrigin = SPAWN_LOCATION.top
    }
  }
}

export default BlockSpawner
