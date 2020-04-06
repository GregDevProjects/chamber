import Player from "../actors/player/index";
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
    // this.cameras.main.setPosition(
    //   (FRAME_WIDTH - GAME_WIDTH) / 2,
    //   (FRAME_HEIGHT - GAME_HEIGHT) / 2
    // );
    // this.cameras.main.setSize(GAME_WIDTH, GAME_HEIGHT);
    // this.cameras.main.setBackgroundColor("ffffff");

    // this.matter.world.setBounds(
    //   0,
    //   0,
    //   GAME_WIDTH,
    //   GAME_HEIGHT
    // )

    //this.startLevel();
    // this.startGameplay();

    // this._TEST_SPINNER = new Spinner({
    //   x: 300,
    //   y: 300,
    //   scene: this,
    //   player: this.player
    // });
    // this.matter.world.setGravity(0, 1, 0.0001);

    // this.DeathAnimation = new DeathAnimation(this, this.player);

    this.player = new Player({ scene: this, x: 250, y: 250 });

    // this.blockGroup = this.add.group()

    // this.blocksController = new BlocksController(this)
    // this.blocksController.startRandomSpawning()
    // createBlockBarrier(this)
    // createPlayerBarrier(this)

    // this.matter.world.setGravity(
    //   0,
    //   1,
    //   0.0001
    // )
  }

  update(time, delta) {
    // debugger
    // this.blocksController.update(delta)

    this.player.update(delta);
  }
}

export default Level2;
