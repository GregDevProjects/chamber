import Player from "../actors/player/index";

import Spinner from "../actors/spinner";
import Plumb from "../actors/plumb";

import {
  GAME_HEIGHT,
  GAME_WIDTH,
  FRAME_WIDTH,
  FRAME_HEIGHT,
} from "../constants";

import Level from "./level";

class Level2 extends Level {
  constructor(test) {
    super({
      key: "2",
      active: false,
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
    });
  }

  init(collisionCategories) {
    this.collisionCategories = collisionCategories;
  }

  levelCreate() {
    this.player = new Player({ scene: this, x: 500, y: 500 });

    this.updateArray = [];

    // const spinner = new Spinner({
    //   scene: this,
    //   player: this.player,
    //   x: 500,
    //   y: 500,
    // });

    const plumb = new Plumb({
      scene: this,
      player: this.player,
      x: 600,
      y: 600,
    });
    //

    const plumb2 = new Plumb({
      scene: this,
      player: this.player,
      x: 100,
      y: 100,
    });

    // debugger;
    this.updateArray.push(plumb, plumb2);
  }

  update(time, delta) {
    this.player.update(delta);

    this.updateArray.forEach((item) => {
      item.update(delta);
    });
  }
}

export default Level2;
