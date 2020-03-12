import playerImg from './assets/player.jpg'
import bulletImg from './assets/bullet.png'
import arrowTop from './assets/arrow_up.png'
import arrowBottom from './assets/arrow_down.png'
import arrowRight from './assets/arrow_right.png'
import arrowLeft from './assets/arrow_left.png'
import gun from './assets/gun.png'
import transparent from './assets/transparent.png'

class Loader extends Phaser.Scene {
  constructor (test) {
    super({
      key: 'Loader'
    })
  }

  // https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/?a=13
  preload () {
    this.load.image('player',
      playerImg)
    this.load.image('bullet',
      bulletImg)

    this.load.image('arrowTop',
      arrowTop)
    this.load.image('arrowBottom',
      arrowBottom)
    this.load.image('arrowRight',
      arrowRight)
    this.load.image('arrowLeft',
      arrowLeft)
    this.load.image('gun',
      gun)
    this.load.audio('ticker',
      'src/assets/music/Ticker.mp3')
    this.load.image('transparent',
      transparent)
    this.load.image('spark',
      'src/assets/small_explode.png')
  }

  create () {
    const collisionCategories = {
      head: this.matter.world.nextCategory(),
      player: this.matter.world.nextCategory(),
      bullet: this.matter.world.nextCategory(),
      block: this.matter.world.nextCategory(),
      deathLine: this.matter.world.nextCategory(),
      blockBarrier: this.matter.world.nextCategory(),
      world: 1
    }
    const music = this.scene.start('music')
    this.scene.start('main_menu',
      { collisionCategories, music })
  }
}

export default Loader
