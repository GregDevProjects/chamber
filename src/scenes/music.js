export class Music extends Phaser.Scene {
  constructor(test) {
    super({ key: "music", active: false });
  }

  init(test) {}

  preload() {}

  setVolume(volume) {
    return;
    this.music.setVolume(volume);
  }

  create() {
    return;
    this.music = this.sound.add("ticker", { loop: true });
    // this.music.play()
  }
}

export default Music;
