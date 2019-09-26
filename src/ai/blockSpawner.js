import { GAME_HEIGHT, GAME_WIDTH } from '../constants'
import Block from '../actors/block'

class BlockSpawner {
  constructor (scene) {
    this.cursors = scene.input.keyboard.createCursorKeys()
    // DEBUG
    this.scene = scene
    this.blocks = scene.add.group()
    this.padding = { min: 30, max: 90 }
    this.width = { min: 100, max: 250 }
    this.height = { min: 100, max: 250 }
    this.spawnFrequency = 4000
    this.spawnOrigin = 'bottom'
    this.spawnCount = 1
    this.scene.time.addEvent({
      delay: this.spawnFrequency,
      callback: () => {
        this.spawnGrid()
        this.spawnCount++
        if (this.spawnCount % 4 === 0) {
          this.spawnOrigin = this.spawnOrigin === 'bottom' ? 'top' : 'bottom'
        }
      },
      callbackScope: this,
      repeat: -1
    })
    this.spawnGrid()
  }

  spawnGrid () {
    let lastSpawn = {
      x: 0,
      width: 0
    }

    do {
      const width = Phaser.Math.Between(this.width.min, this.width.max)
      const height = Phaser.Math.Between(this.height.min, this.height.max)
      let spawnLocationX = this.getGridPadding(1) + width / 2
      if (lastSpawn.x) {
        spawnLocationX += lastSpawn.width / 2 + lastSpawn.x
      }
      lastSpawn = { x: lastSpawn.x = spawnLocationX, width: width }

      if (spawnLocationX + width / 2 > GAME_WIDTH) {
        return
      }

      const block = new Block({
        w: width,
        h: height,
        x: spawnLocationX,
        y: this.getYOrigin(height),
        scene: this.scene
      })

      this.blocks.add(block)
    }
    while (true)
  }

  getYOrigin (height) {
    if (this.spawnOrigin === 'top') {
      return -height / 2
    } else if (this.spawnOrigin === 'bottom') {
      return GAME_HEIGHT + height / 2
    }
  }

  getGridPadding (difficulty) {
    return Phaser.Math.Between(this.padding.min, this.padding.max)
  }

  getBlockMoveDirection () {
    if (this.spawnOrigin === 'bottom') {
      return 'up'
    } else if (this.spawnOrigin === 'top') {
      return 'down'
    }
  }

  update (delta) {
    this.blocks.children.iterate((block) => {
      if (!block) {
        return
      }
      block.move(delta, this.getBlockMoveDirection())
      if (this.spawnOrigin === 'bottom' && block.y < 0 - block.height) {
        block.destroy()
      } else if (this.spawnOrigin === 'top' && block.y > GAME_HEIGHT + block.height) {
        block.destroy()
      }
    })

    if (this.cursors.left.isDown) {
      // player.setVelocityX(-300)
    } else if (this.cursors.right.isDown) {
    //  player.setVelocityX(300)
    }

    if (this.cursors.up.isDown) {
      this.spawnOrigin = 'bottom'
    } else if (this.cursors.down.isDown) {
      this.spawnOrigin = 'top'
    }
  }
}

export default BlockSpawner
