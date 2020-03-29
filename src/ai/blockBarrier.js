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
  const width = GAME_WIDTH + 800;
  const height = GAME_HEIGHT + 800;

  //top
  makeSensor(width / 2 - 400, -MAX_BLOCK_WIDTH - 150, width, 10, scene);

  //bottom
  makeSensor(
    width / 2 - 400,
    GAME_HEIGHT + MAX_BLOCK_HEIGHT + 150,
    width,
    10,
    scene
  );

  //left
  makeSensor(-MAX_BLOCK_WIDTH - 150, height / 2 - 400, 10, height, scene);

  //right
  makeSensor(
    GAME_WIDTH + MAX_BLOCK_WIDTH + 150,
    height / 2 - 400,
    10,
    height,
    scene
  );
};

export default createBlockBarrier;
