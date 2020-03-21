import { FRAME_WIDTH, FRAME_HEIGHT } from "../constants";

export class MainMenu extends Phaser.Scene {
  constructor(test) {
    super({ key: "main_menu", active: false });
  }

  init(test) {
    this.collisionCategories = test.collisionCategories;
  }

  preload() {}

  create() {
    // this.add.image(
    //   FRAME_WIDTH / 2,
    //   FRAME_HEIGHT / 2,
    //   'main_menu'
    // )
    // TODO: get interactive cursor working .setInteractive({ cursor: 'url(assets/main_menu_pizza.png), pointer'})

    this.start();

    // this.scene.stop();
    // this.scene.start( 'win' );
  }

  levelButton(level) {
    return this.add
      .text(FRAME_WIDTH / 2, 50 + 100 * level + 1, "LEVEL " + level, {
        font: "30px Arial"
      })
      .setInteractive()
      .on("pointerdown", event => {
        this.scene.stop();
        this.scene.start(level.toString(), this.collisionCategories);
      });
  }

  start() {
    this.levelButton(1);

    this.levelButton(2);

    this.scene.stop();
    this.scene.start("1", this.collisionCategories);

    // const start = this.add.image(
    //   FRAME_WIDTH / 2,
    //   500,
    //   'start'
    // )
    //   .setInteractive({ cursor: 'pointer' })
    //   .on(
    //     'pointerdown',
    //     (event) => {
    //       this.scene.stop()
    //       this.scene.start('game',
    //         this.collisionCategories)
    //     }, this
    //   )
  }
}

export default MainMenu;
