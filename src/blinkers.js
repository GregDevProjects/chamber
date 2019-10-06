import { GAME_HEIGHT, GAME_WIDTH, SPAWN_LOCATION } from './constants'

class Blinkers {
  constructor (scene) {
    this.scene = scene
    this.arrowTop = this.scene.add.image(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 3,
      'arrowTop'
    )
    this.arrowRight = this.scene.add.image(
      GAME_WIDTH - GAME_WIDTH / 3,
      GAME_HEIGHT / 2,
      'arrowRight'
    )
    this.arrowBottom = this.scene.add.image(
      GAME_WIDTH / 2,
      GAME_HEIGHT - GAME_HEIGHT / 3,
      'arrowBottom'
    )
    this.arrowLeft = this.scene.add.image(
      GAME_WIDTH / 3,
      GAME_HEIGHT / 2,
      'arrowLeft'
    )

    this.allArrows = [
      this.arrowTop,
      this.arrowBottom,
      this.arrowLeft,
      this.arrowRight
    ]

    this.allArrows.forEach((arrow) => {
      arrow.setDepth(2).setAlpha(0.9).setVisible(false)
    })

    this.scene.tweens.add({
      targets: this.allArrows,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
      paused: false
    })
  }

  hideAllArrows () {
    this.allArrows.forEach((arrow) => {
      arrow.setVisible(false)
    })
  }

  showArrow (spawnLocation) {
    this.hideAllArrows()
    switch (spawnLocation) {
      case SPAWN_LOCATION.top:
        this.arrowBottom.setVisible(true)
        break
      case SPAWN_LOCATION.bottom:
        this.arrowTop.setVisible(true)
        break
      case SPAWN_LOCATION.left:
        this.arrowLeft.setVisible(true)
        break
      case SPAWN_LOCATION.right:
        this.arrowRight.setVisible(true)
        break
    }
  }
}

export default Blinkers
