import playerImg from './assets/player.jpg'
import bulletImg from './assets/bullet.png'
import arrowTop from './assets/arrow_up.png'
import arrowBottom from './assets/arrow_down.png'
import arrowRight from './assets/arrow_right.png'
import arrowLeft from './assets/arrow_left.png'
import gun from './assets/gun.png'

class Loader extends Phaser.Scene {
  constructor (test) {
    super({
      key: 'Loader'
    })
  }

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
      this.load.image('gun', gun)
  }

  create () {
    const collisionCategories = {
      player: this.matter.world.nextCategory(),
      bullet: this.matter.world.nextCategory(),
      block: this.matter.world.nextCategory(),
      deathLine: this.matter.world.nextCategory(),
      blockBarrier: this.matter.world.nextCategory(),
      world: 1
    }
    this.scene.start('Game',
      { collisionCategories })
  }
}

export default Loader
