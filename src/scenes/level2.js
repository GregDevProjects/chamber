import Player from "../actors/player/index";
import BlocksController from "../ai/blocksController";
import Spinner from "../actors/spinner";
import Plumb from "../actors/plumb";
import { BLOCK_WAVE_TYPE } from "../constants";
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

  makePlumb(x, y) {
    const plumb = new Plumb({
      scene: this,
      player: this.player,
      x: x,
      y: y,
    });

    this.updateArray.push(plumb);
  }

  levelCreate() {
    this.player = new Player({ scene: this, x: 500, y: 500 });

    this.blocksController = new BlocksController(this, BLOCK_WAVE_TYPE.SIN);

    this.updateArray = [];

    // this.timer = this.time.addEvent({
    //   delay: 5000,
    //   callback: () => {
    //     this.makePlumb(100, 100);
    //   },
    //   callbackScope: this,
    //   repeat: -1,
    // });

    // this.makePlumb(100, 100);
    // this.makePlumb(100, 600);
    // this.makePlumb(600, 100);
    // this.makePlumb(100, 600);

    this.blocksController.startSpawning();

    // // debugger;
    // this.updateArray.push(plumb, plumb2, plumb3, plumb4);
  }

  update(time, delta) {
    this.player.update(delta);

    this.blocksController.update(delta, time);

    this.updateArray.forEach((item) => {
      item.update(delta);
    });
  }
}

export default Level2;
