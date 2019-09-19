import playerImg from './assets/player.jpg'
import bulletImg from './assets/bullet.png'

class Loader extends Phaser.Scene {
  constructor (test) {
    super({
      key: 'Loader'
    })
  }

  preload () {
    this.load.image('player', playerImg)
    this.load.image('bullet', bulletImg)
  }

  create () {
    this.scene.start('Game')
  }
}

export default Loader
