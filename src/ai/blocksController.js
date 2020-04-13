import RandomBlockSpawner from "./randomBlockSpawner";
import SinWaveBlockSpawner from "./sinWaveBlockSpawner";
import createBlockBarrier from "../ai/blockBarrier";
import { BLOCK_WAVE_TYPE } from "../constants";
// createBlockBarrier(this)
class BlocksController {
  constructor(scene, blockWaveType) {
    this.scene = scene;
    this.blockGroup = this.scene.add.group();
    this.allowUpdate = false;

    switch (blockWaveType) {
      case BLOCK_WAVE_TYPE.RANDOM:
        this.blockSpawner = new RandomBlockSpawner(this.scene, this.blockGroup);
        createBlockBarrier(this.scene, true);
        break;
      case BLOCK_WAVE_TYPE.SIN:
        this.blockSpawner = new SinWaveBlockSpawner(
          this.scene,
          this.blockGroup
        );
        createBlockBarrier(this.scene, false);
        break;
    }
  }

  startSpawning() {
    this.allowUpdate = true;
    this.blockSpawner.start();
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
