import ProgressBar from "./ProgressBar";

class ProgressBarTimed extends ProgressBar {
  constructor(scene, seconds, text, onFinish) {
    super(scene, text);
    this.seconds = seconds;
    this.onFinish = onFinish;

    this.timedEvent = this.scene.time.addEvent({
      callback: () => {
        if (this.timedEvent.getRepeatCount() === 0) {
          this.onFinish();
        }
      },
      callbackScope: this,
      repeat: this.seconds,
      delay: 1000,
    });
  }

  update() {
    if (!this.percentText.active) {
      return;
    }

    const progressPercentage = this.timedEvent.getOverallProgress();

    this.percentText.setText(
      Phaser.Math.RoundTo(progressPercentage * 100, -1).toFixed(1) + "%"
    );
    this.progressBar.clear();
    this.progressBar.fillStyle(0xffffff, 1);
    this.progressBar.fillRect(
      this.position.x + 10 - this.progressBoxWidth / 2,
      this.position.y + 10,
      (this.progressBoxWidth - 20) * progressPercentage,
      30
    );
    // debugger;
  }

  onDestroy() {
    this.timedEvent.destroy();
  }
}

export default ProgressBarTimed;
