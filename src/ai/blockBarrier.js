import {
  GAME_HEIGHT,
  GAME_WIDTH,
  FRAME_WIDTH,
  FRAME_HEIGHT,
} from "../constants";
import { gamePosition } from "../helpers";

const MAX_BLOCK_WIDTH = 250;
const MAX_BLOCK_HEIGHT = 250;

const SENSOR_SIZE = 10;

const createBlockBarrier = (scene, farSensors) => {
  if (farSensors) {
    spawnFarSensors(scene);
  } else {
    spawnCloseSensors(scene);
  }

  // spawnSensors(scene);
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

const spawnCloseSensors = (scene) => {
  //grey border around game
  const frameSize = 150;
  //top
  makeSensor(GAME_WIDTH / 2, 0 - frameSize, FRAME_WIDTH, SENSOR_SIZE, scene);

  // //bottom
  makeSensor(
    GAME_WIDTH / 2,
    GAME_HEIGHT + frameSize,
    FRAME_WIDTH,
    SENSOR_SIZE,
    scene
  );

  // //left
  makeSensor(-frameSize, GAME_HEIGHT / 2, SENSOR_SIZE, FRAME_HEIGHT, scene);

  //right
  makeSensor(
    GAME_WIDTH + frameSize,
    GAME_HEIGHT / 2,
    SENSOR_SIZE,
    FRAME_HEIGHT,
    scene
  );
};

const spawnFarSensors = (scene) => {
  const width = GAME_WIDTH + 800;
  const height = GAME_HEIGHT + 800;

  //top
  makeSensor(
    width / 2 - 400,
    -MAX_BLOCK_WIDTH - 150,
    width,
    SENSOR_SIZE,
    scene
  );

  //bottom
  makeSensor(
    width / 2 - 400,
    GAME_HEIGHT + MAX_BLOCK_HEIGHT + 150,
    width,
    SENSOR_SIZE,
    scene
  );

  //left
  makeSensor(
    -MAX_BLOCK_WIDTH - 150,
    height / 2 - 400,
    SENSOR_SIZE,
    height,
    scene
  );

  //right
  makeSensor(
    GAME_WIDTH + MAX_BLOCK_WIDTH + 150,
    height / 2 - 400,
    SENSOR_SIZE,
    height,
    scene
  );
};

export default createBlockBarrier;
