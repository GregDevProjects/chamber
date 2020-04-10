import {
  SPAWN_LOCATION,
  GAME_HEIGHT,
  GAME_WIDTH,
  DEBUG_MODE,
} from "../constants";
import Block from "../actors/block";
import Blinkers from "../blinkers";
import { gamePosition, highestValue, randomProperty } from "../helpers";

const BLOCK_WIDTH = 100;
const BLOCK_HEIGHT = 100;

class SinWaveBlockSpawner {
  constructor(scene, blocks) {
    this.blinkers = new Blinkers(scene);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.scene = scene;
    this.blocks = blocks;
    // space between blocks
    this.spawnFrequency = 2500;
    this.nextSpawn = randomProperty(SPAWN_LOCATION);
    this.spawnOrigin = SPAWN_LOCATION.right; // randomProperty(SPAWN_LOCATION);
    this.spawnCount = 1;
    this.type = null;
    this.randomRotation = false;
    this.gameTime = 0;
  }

  spawnOnTimer() {
    this.timer = this.scene.time.addEvent({
      delay: this.spawnFrequency,
      callback: () => {
        this.spawnBlock();
        this.spawnCount++;
        if (
          (this.spawnCount + 1) % 4 === 0 &&
          this.nextSpawn !== this.spawnOrigin
        ) {
          this.blinkers.showArrow(this.nextSpawn);
        }
        if (this.spawnCount % 4 === 0) {
          this.spawnOrigin = this.nextSpawn;
          this.nextSpawn = randomProperty(SPAWN_LOCATION);
          this.blinkers.hideAllArrows();
        }
      },
      callbackScope: this,
      repeat: -1,
    });
  }

  spawnBlock() {
    const x = this.getXOrigin();
    const y = this.getYOrigin();
    console.log(x, y);
    const block = new Block({
      w: BLOCK_WIDTH,
      h: BLOCK_HEIGHT,
      x: gamePosition(x),
      y: gamePosition(y),
      scene: this.scene,
      type: 1,
    });

    this.blocks.add(block);
    this.gameTime += 0.2;
  }

  getYOrigin() {
    if (this.spawnOrigin === SPAWN_LOCATION.top) {
      return -BLOCK_WIDTH / 2;
    }
    if (this.spawnOrigin === SPAWN_LOCATION.bottom) {
      return GAME_HEIGHT + BLOCK_WIDTH / 2;
    }
    if (
      this.spawnOrigin === SPAWN_LOCATION.left ||
      this.spawnOrigin === SPAWN_LOCATION.right
    ) {
      return this.getSinModifier(GAME_HEIGHT, BLOCK_HEIGHT);
    }
  }

  getSinModifier(range, blockSize) {
    const modifier = range - blockSize / 2;
    let result = Math.abs(Math.sin(this.gameTime) * modifier);

    if (result < blockSize / 2) {
      result = blockSize / 2;
    }
    return result;
  }

  getXOrigin() {
    if (
      this.spawnOrigin === SPAWN_LOCATION.top ||
      this.spawnOrigin === SPAWN_LOCATION.bottom
    ) {
      return this.getSinModifier(GAME_WIDTH, BLOCK_WIDTH);
    }

    if (this.spawnOrigin === SPAWN_LOCATION.left) {
      return GAME_WIDTH + BLOCK_WIDTH / 2;
    }

    if (this.spawnOrigin === SPAWN_LOCATION.right) {
      return -BLOCK_WIDTH / 2;
    }
  }

  start() {
    this.spawnOnTimer();
    this.spawnBlock();
  }

  update(delta, gameTime) {
    // console.log(Math.sin(gameTime));

    this.blocks.children.iterate((block) => {
      if (!block) {
        return;
      }
      block.move(delta, this.spawnOrigin);
    });
  }
}

export default SinWaveBlockSpawner;
