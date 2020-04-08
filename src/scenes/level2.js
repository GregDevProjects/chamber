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
    this.player = new Player({ scene: this, x: 250, y: 250 });

    this.updateArray = [];

    const spinner = new Spinner({
      scene: this,
      player: this.player,
      x: 500,
      y: 500,
    });

    const plumb = new Plumb({
      scene: this,
      player: this.player,
      x: 500,
      y: 500,
    });
    //
    plumb.tintFill = true;
    plumb.setTint(0x6a0dad);
    // debugger;
    this.updateArray.push(plumb);
  }

  update(time, delta) {
    this.player.update(delta);

    this.updateArray.forEach((item) => {
      item.update(delta);
    });
  }
}

export default Level2;
