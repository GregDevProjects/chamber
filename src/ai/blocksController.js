import BlockSpawner from './blockSpawner'

class BlocksController {
  constructor (scene) {
    this.scene = scene
    this.blockGroup = this.scene.add.group()
  }

  startRandomSpawning () {
    this.blockSpawner = new BlockSpawner(this.scene,
      this.blockGroup)
    this.blockSpawner.start()
  }

  changeColorOfAllBLocks (color) {
    this.blocks.children.iterate((block) => {
      if (!block) {
        return
      }
      block.setFillStyle(color)
    })
  }

  update (delta) {
    this.blockSpawner.update(delta)
  }
}

export default BlocksController
