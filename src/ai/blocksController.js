import BlockSpawner from "./blockSpawner";
import createBlockBarrier from "../ai/blockBarrier";
// createBlockBarrier(this)
class BlocksController {
  constructor(scene) {
    this.scene = scene;
    this.blockGroup = this.scene.add.group();
    this.allowUpdate = false;

    this.blockSpawner = new BlockSpawner(this.scene, this.blockGroup);
  }

  startRandomSpawning() {
    this.allowUpdate = true;

    this.blockSpawner.start();
    createBlockBarrier(this.scene);
  }

  setPadding(min, max) {
    this.blockSpawner.padding = { min, max };
  }

  changeBlockType(type) {
    this.blockSpawner.setBlockType(type);
  }

  setRandomRotation(randomRotation) {
    this.blockSpawner.setRandomRotationForBlocks(randomRotation);
  }

  changeColorOfAllBLocks(color) {
    this.blocks.children.iterate(block => {
      if (!block) {
        return;
      }
      block.setFillStyle(color);
    });
  }

  update(delta) {
    if (!this.allowUpdate) {
      return;
    }
    this.blockSpawner.update(delta);
  }
}

export default BlocksController;
