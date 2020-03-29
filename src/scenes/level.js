import drawBackground from "../ai/frameBackground";

//abstract
class Level extends Phaser.Scene {
  init(collisionCategories) {
    this.collisionCategories = collisionCategories;
  }

  setupCamera() {
    this.cameras.main.setBackgroundColor("ffffff");
    this.cameras.main.setZoom(1);
  }

  create() {
    this.setupCamera();
    drawBackground(this);
    //must be called by child class
    this.levelCreate();
  }

  gameOver() {
    this.cameras.main.fade(2000, 255, 0, 0);

    this.cameras.main.on("camerafadeoutcomplete", () => {
      this.cameras.main.resetFX();
      var graphics = this.add.graphics();

      graphics.fillStyle(0xff00000, 1);
      graphics.fillRect(0, 0, 1000, 1000);
      graphics.setDepth(100);
      this.gameOverMenu();
    });
  }

  gameOverMenu() {
    //TODO: need a way to destroy everything in scene
    const TEXT_STYLE = {
      fontSize: 60,
      fontFamily: "Arial",
      align: "left",
      // wordWrap: { width: 370, useAdvancedWrap: true },
      color: "white"
    };

    const text = [];

    //game over
    text.push(this.add.text(500, 300, "GAME OVER", TEXT_STYLE));

    //restart
    TEXT_STYLE.fontSize = 30;
    text.push(
      this.add
        .text(500, 400, "RESTART LEVEL", TEXT_STYLE)
        .setInteractive()
        .on("pointerdown", event => {
          this.resetScene();
        })
    );

    //main menu
    text.push(
      this.add
        .text(500, 460, "MAIN MENU", TEXT_STYLE)
        .setInteractive()
        .on("pointerdown", event => {
          this.scene.stop();
          this.scene.start("main_menu");
        })
    );

    text.forEach(aText => {
      aText.x -= aText.width / 2;
      aText.setDepth(101);
    });
  }
}

export default Level;
