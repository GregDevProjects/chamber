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

const NEW_DIRECTION_CHECK = 6;

const SIN_RADIAN_INCREMENT = 0.1309;

class SinWaveBlockSpawner {
  constructor(scene, blocks) {
    this.blinkers = new Blinkers(scene);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.scene = scene;
    this.blocks = blocks;
    // space between blocks
    this.spawnFrequency = 2500;
    this.nextSpawn = randomProperty(SPAWN_LOCATION);
    this.spawnOrigin = SPAWN_LOCATION.top; // randomProperty(SPAWN_LOCATION);
    this.spawnCount = 1;
    this.type = null;
    this.randomRotation = false;
    this.sinRadian = 0;
  }

  spawnOnTimer() {
    const nextSpawnWillChangeDirection = () => {
      return (
        (this.spawnCount + 1) % NEW_DIRECTION_CHECK === 0 &&
        this.nextSpawn !== this.spawnOrigin
      );
    };

    const thisSpawnWillChangeDirection = () => {
      return this.spawnCount % NEW_DIRECTION_CHECK === 0;
    };

    this.timer = this.scene.time.addEvent({
      delay: this.spawnFrequency,
      callback: () => {
        this.spawnCount++;
        if (nextSpawnWillChangeDirection()) {
          this.blinkers.showArrow(this.nextSpawn);
          this.newDirection = true;
        }
        if (thisSpawnWillChangeDirection()) {
          if (this.newDirection) {
            this.sinRadian = -SIN_RADIAN_INCREMENT;
            this.newDirection = false;
            this.skipWave = true;
          }

          this.spawnOrigin = this.nextSpawn;
          this.nextSpawn = randomProperty(SPAWN_LOCATION);
          this.blinkers.hideAllArrows();
        }

        if (!this.skipWave) {
          this.sinRadian += SIN_RADIAN_INCREMENT;
          this.spawnSinBlock();
          this.spawnInverseSinBlock();
        }
        this.skipWave = false;
      },
      callbackScope: this,
      repeat: -1,
    });
  }

  spawnSinBlock() {
    const x = this.getXOrigin(false);
    const y = this.getYOrigin(false);

    const block = new Block({
      w: BLOCK_WIDTH,
      h: BLOCK_HEIGHT,
      x: gamePosition(x),
      y: gamePosition(y),
      scene: this.scene,
      type: 1,
    });

    this.blocks.add(block);
  }

  spawnInverseSinBlock() {
    const x = this.getXOrigin(true);
    const y = this.getYOrigin(true);

    const block = new Block({
      w: BLOCK_WIDTH,
      h: BLOCK_HEIGHT,
      x: gamePosition(x),
      y: gamePosition(y),
      scene: this.scene,
      type: 1,
    });

    this.blocks.add(block);
  }

  getYOrigin(inverseSin) {
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
      return this.getSinModifier(GAME_HEIGHT, inverseSin);
    }
  }

  getSinModifier(range, inverseSin) {
    const sin = Math.abs(Math.sin(this.sinRadian));
    if (inverseSin) {
      return (-sin + 1) * range;
    }
    return sin * range;
  }

  getXOrigin(inverseSin) {
    if (
      this.spawnOrigin === SPAWN_LOCATION.top ||
      this.spawnOrigin === SPAWN_LOCATION.bottom
    ) {
      return this.getSinModifier(GAME_WIDTH, inverseSin);
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
    this.spawnSinBlock();
    this.spawnInverseSinBlock();
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
