import {
  SPAWN_LOCATION,
  GAME_HEIGHT,
  GAME_WIDTH,
  DEBUG_MODE
} from "../constants";
import Block from "../actors/block";
import Blinkers from "../blinkers";
import { gamePosition, highestValue } from "../helpers";

const randomProperty = function(obj) {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};

class BlockSpawner {
  constructor(scene, blocks) {
    this.blinkers = new Blinkers(scene);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.scene = scene;
    this.blocks = blocks;
    // space between blocks
    this.padding = { min: 30, max: 40 };
    this.width = { min: 10, max: 250 };
    this.height = { min: 10, max: 250 };
    this.spawnFrequency = 3500;
    this.nextSpawn = randomProperty(SPAWN_LOCATION);
    this.spawnOrigin = randomProperty(SPAWN_LOCATION);
    this.spawnCount = 1;
    this.type = null;
    this.randomRotation = false;
  }

  setBlockType(type) {
    this.type = type;
  }

  start() {
    this.spawnOnTimer();
    this.spawnGrid();
  }

  stop() {
    this.timer.remove();
  }

  setRandomRotationForBlocks(randomRotation) {
    this.randomRotation = randomRotation;
  }

  spawnOnTimer() {
    this.timer = this.scene.time.addEvent({
      delay: this.spawnFrequency,
      callback: () => {
        this.spawnGrid();
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
      repeat: -1
    });
  }

  spawnGrid() {
    let lastSpawn = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    do {
      const width = Phaser.Math.Between(this.width.min, this.width.max);
      const height = Phaser.Math.Between(this.height.min, this.height.max);

      const xOrigin = this.getXOrigin(width, height, lastSpawn);
      const yOrigin = this.getYOrigin(height, width, lastSpawn);

      lastSpawn = {
        x: xOrigin,
        y: yOrigin,
        width: width,
        height: height
      };

      if (!xOrigin || !yOrigin) {
        return;
      }

      const block = new Block({
        w: width,
        h: height,
        x: gamePosition(xOrigin),
        y: gamePosition(yOrigin),
        scene: this.scene,
        type: this.type,
        randomRotation: this.randomRotation
      });

      this.blocks.add(block);
    } while (true);
  }

  getXOrigin(width, height, lastSpawn) {
    const longestDistanceBetweenTwoPoints = this.longestDistanceBetweenTwoPoints(
      height,
      width
    );

    if (
      this.spawnOrigin === SPAWN_LOCATION.top ||
      this.spawnOrigin === SPAWN_LOCATION.bottom
    ) {
      let spawnLocationX =
        this.getGridPadding(1) + longestDistanceBetweenTwoPoints;
      if (lastSpawn.x) {
        spawnLocationX +=
          this.longestDistanceBetweenTwoPoints(
            lastSpawn.width,
            lastSpawn.height
          ) + lastSpawn.x;
      }

      if (spawnLocationX + longestDistanceBetweenTwoPoints > GAME_WIDTH) {
        return false;
      }
      return spawnLocationX;
    }

    if (this.spawnOrigin === SPAWN_LOCATION.left) {
      return GAME_WIDTH + longestDistanceBetweenTwoPoints;
    }

    if (this.spawnOrigin === SPAWN_LOCATION.right) {
      return -longestDistanceBetweenTwoPoints;
    }
  }

  //IMPROVEMENT - get the length of the block based it's angle instead
  // this is just a hack to make sure they don't collide
  longestDistanceBetweenTwoPoints(width, height) {
    return highestValue(height, width) / 1.35;
  }

  getYOrigin(height, width, lastSpawn) {
    const longestDistanceBetweenTwoPoints = this.longestDistanceBetweenTwoPoints(
      height,
      width
    );
    //use higest value out of width/height
    if (this.spawnOrigin === SPAWN_LOCATION.top) {
      return -longestDistanceBetweenTwoPoints; // - height / 4;
    }

    if (this.spawnOrigin === SPAWN_LOCATION.bottom) {
      return GAME_HEIGHT + longestDistanceBetweenTwoPoints; // + height / 4;
    }

    if (
      this.spawnOrigin === SPAWN_LOCATION.left ||
      this.spawnOrigin === SPAWN_LOCATION.right
    ) {
      let spawnLocationY =
        this.getGridPadding(1) + longestDistanceBetweenTwoPoints;
      if (lastSpawn.y) {
        spawnLocationY +=
          this.longestDistanceBetweenTwoPoints(
            lastSpawn.width,
            lastSpawn.height
          ) + lastSpawn.y; //lastSpawn.height / 2 + lastSpawn.y;
      }
      //debugger;
      if (spawnLocationY + longestDistanceBetweenTwoPoints > GAME_HEIGHT) {
        return false;
      }
      return spawnLocationY;
    }
  }

  getGridPadding(difficulty) {
    return Phaser.Math.Between(this.padding.min, this.padding.max);
  }

  update(delta) {
    this.blocks.children.iterate(block => {
      if (!block) {
        return;
      }
      block.move(delta, this.spawnOrigin);
    });

    if (!DEBUG_MODE) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.spawnOrigin = SPAWN_LOCATION.left;
    } else if (this.cursors.right.isDown) {
      this.spawnOrigin = SPAWN_LOCATION.right;
    }

    if (this.cursors.up.isDown) {
      this.spawnOrigin = SPAWN_LOCATION.bottom;
    } else if (this.cursors.down.isDown) {
      this.spawnOrigin = SPAWN_LOCATION.top;
    }
  }
}

export default BlockSpawner;
