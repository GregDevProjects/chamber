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
    const collisionCategories = {
      player: this.matter.world.nextCategory(),
      bullet: this.matter.world.nextCategory(),
      block: this.matter.world.nextCategory(),
      deathLine: this.matter.world.nextCategory(),
      blockBarrier: this.matter.world.nextCategory(),
      world: 1
    }
    this.scene.start('Game', { collisionCategories })
  }
}

export default Loader
