import DeathLine from "../actors/deathLine";

import { gamePosition } from "../helpers";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants";

const createPlayerBarrier = scene => {
  const deathLineTop = new DeathLine({
    scene: scene,
    x: gamePosition(GAME_WIDTH / 2),
    y: gamePosition(10),
    width: GAME_WIDTH,
    height: 10
  });
  const deathLineBottom = new DeathLine({
    scene: scene,
    x: gamePosition(GAME_WIDTH / 2),
    y: gamePosition(GAME_HEIGHT - 10),
    width: GAME_WIDTH,
    height: 10
  });
  const deathLineRight = new DeathLine({
    scene: scene,
    x: gamePosition(GAME_WIDTH - 10),
    y: gamePosition(GAME_HEIGHT / 2),
    width: 10,
    height: GAME_HEIGHT
  });
  const deathLineLeft = new DeathLine({
    scene: scene,
    x: gamePosition(10),
    y: gamePosition(GAME_HEIGHT / 2),
    width: 10,
    height: GAME_HEIGHT
  });
};

export default createPlayerBarrier;
