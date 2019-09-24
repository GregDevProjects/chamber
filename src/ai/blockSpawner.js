import { GAME_HEIGHT, GAME_WIDTH } from '../constants'
import Block from '../actors/block'

class BlockSpawner {
  constructor (scene) {
    this.scene = scene
    this.blocks = scene.add.group()
    this.padding = { min: 30, max: 90 }
    this.width = { min: 100, max: 250 }
    this.height = { min: 100, max: 250 }
    this.spawnFrequency = 4000
    this.scene.time.addEvent({
      delay: this.spawnFrequency,
      callback: () => {
        this.spawnGrid()
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
        y: GAME_HEIGHT + height / 2,
        scene: this.scene
      })

      this.blocks.add(block)
    }
    while (true)
  }

  getGridPadding (difficulty) {
    return Phaser.Math.Between(this.padding.min, this.padding.max)
  }

  update (delta) {
    this.blocks.children.iterate((block) => {
      if (!block) {
        return
      }
      block.move(delta)
      if (block.y + block.width < 0) {
        block.destroy()
      }
    })
  }
}

export default BlockSpawner
