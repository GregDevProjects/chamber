
export class Music extends Phaser.Scene {
  constructor (test) {
    super({ key: 'music', active: false })
  }

  init (test) {

  }

  preload () {

  }

  setVolume (volume) {
    this.music.setVolume(volume)
  }

  create () {
    this.music = this.sound.add('ticker',
      { loop: true })
    // this.music.play()
  }
}

export default Music
