//visuals for the progress bar
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../constants";

class ProgressBar {
  constructor(scene, text) {
    this.scene = scene;
    this.position = {
      x: FRAME_WIDTH / 2,
      y: FRAME_HEIGHT - 100,
    };

    this.progressBoxWidth = 350;

    this.progressBar = scene.add.graphics();
    this.progressBar.setDepth(99);

    this.progressBox = scene.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(
      this.position.x - this.progressBoxWidth / 2,
      this.position.y,
      this.progressBoxWidth,
      50
    );
    this.progressBox.setDepth(99);

    this.percentText = scene.make.text({
      x: this.position.x,
      y: this.position.y + 25,
      text: "0%",
      style: {
        font: "18px monospace",
        // fill: "#ffffff"
      },
    });
    this.percentText.setOrigin(0.5, 0.5);
    this.percentText.setDepth(100);

    this.assetText = scene.make.text({
      x: this.position.x,
      y: this.position.y + 70,
      text: text,
      style: {
        font: "18px monospace",
        fill: "#ffffff",
      },
    });

    this.assetText.setOrigin(0.5, 0.5);
    this.assetText.setDepth(99);
  }

  destroy() {
    this.progressBar.destroy();
    this.progressBox.destroy();
    this.percentText.destroy();
    this.assetText.destroy();
    //MUST BE CREATED BY CHILD
    this.onDestroy();
  }
}

export default ProgressBar;
