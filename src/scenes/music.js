export class Music extends Phaser.Scene {
  constructor(test) {
    super({ key: "music", active: false });
  }

  init(test) {}

  preload() {}

  setVolume(volume) {
    // return;
    this.music.setVolume(volume);
  }

  play() {
    return;
    this.music.play();
  }

  stop() {
    this.music.stop();
  }

  create() {
    // return;
    this.music = this.sound.add("ticker", { loop: true });
  }
}

export default Music;
