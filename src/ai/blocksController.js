import RandomBlockSpawner from "./randomBlockSpawner";
import SinWaveBlockSpawner from "./sinWaveBlockSpawner";
import createBlockBarrier from "../ai/blockBarrier";
// createBlockBarrier(this)
class BlocksController {
  constructor(scene) {
    this.scene = scene;
    this.blockGroup = this.scene.add.group();
    this.allowUpdate = false;
  }

  startRandomSpawning() {
    this.blockSpawner = new RandomBlockSpawner(this.scene, this.blockGroup);
    this.allowUpdate = true;
    this.blockSpawner.start();
    createBlockBarrier(this.scene);
  }

  startSinWaveSpawning() {
    this.blockSpawner = new SinWaveBlockSpawner(this.scene, this.blockGroup);
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
    this.blocks.children.iterate((block) => {
      if (!block) {
        return;
      }
      block.setFillStyle(color);
    });
  }

  destroyAllBlocks() {
    // this.allowUpdate = false;
    // this.blockGroup.destroy(true);
    this.allowUpdate = false;
    this.blockGroup.children.iterate((block) => {
      // debugger;
      if (block) {
        block.setPosition(350, -400);
      }
    });
  }

  stopSpawning() {
    this.blockSpawner.stop();
  }

  update(delta, gameTime) {
    if (!this.allowUpdate) {
      return;
    }
    this.blockSpawner.update(delta, gameTime);
  }
}

export default BlocksController;
