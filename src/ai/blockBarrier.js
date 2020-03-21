import { GAME_HEIGHT, GAME_WIDTH } from "../constants";
import { gamePosition } from "../helpers";

const MAX_BLOCK_WIDTH = 250;
const MAX_BLOCK_HEIGHT = 250;

const createBlockBarrier = scene => {
  spawnSensors(scene);
};

const makeSensor = (x, y, width, height, scene) => {
  const sensor = scene.matter.add.rectangle(
    gamePosition(x),
    gamePosition(y),
    width,
    height,
    { isSensor: true, label: "blockBoundary" }
  );
  sensor.collisionFilter.category = scene.collisionCategories.blockBarrier;
  sensor.ignoreGravity = true;
};

const spawnSensors = scene => {
  const width = GAME_WIDTH + 600;
  const height = GAME_HEIGHT + 600;
  makeSensor(width / 2 - 300, -MAX_BLOCK_WIDTH - 10, width, 10, scene);
  makeSensor(
    width / 2 - 300,
    GAME_HEIGHT + MAX_BLOCK_HEIGHT + 10,
    width,
    10,
    scene
  );

  makeSensor(-MAX_BLOCK_WIDTH - 10, height / 2 - 300, 10, height, scene);
  makeSensor(
    GAME_WIDTH + MAX_BLOCK_WIDTH + 10,
    height / 2 - 300,
    10,
    height,
    scene
  );
};

export default createBlockBarrier;
