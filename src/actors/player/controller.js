const MAX_ROTATE_SPEED = 0.0025
const MIN_ROTATE_SPEED = 0.0002

const FORWARD_SPEED = 0.000015 // 0.000025

class Controller {
  constructor (player) {
    this.player = player
    this.a = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.d = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.w = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.millisecondsAHeldDown = 0
    this.millisecondsDHeldDown = 0
  }

  getRotateSpeed (milliseconds) {
    const retVal = milliseconds / 20000

    if (retVal < MIN_ROTATE_SPEED) {
      return MIN_ROTATE_SPEED
    }

    if (retVal > MAX_ROTATE_SPEED) {
      return MAX_ROTATE_SPEED
    }

    return retVal
  }

  update (delta) {
    if (this.w.isDown) {
      this.player.thrustLeft(delta * FORWARD_SPEED)
    }

    if (this.a.isDown) {
      this.millisecondsAHeldDown++

      // this.player.angle -= delta * 0.2
      this.player.setAngularVelocity(-delta * this.getRotateSpeed(this.millisecondsAHeldDown,
        true))
      return
    }
    if (this.d.isDown) {
      this.millisecondsDHeldDown++
      // this.player.angle += delta * 0.2
      this.player.setAngularVelocity(delta * this.getRotateSpeed(this.millisecondsDHeldDown,
        false))
      return
    }

    this.millisecondsAHeldDown = 0
    this.millisecondsDHeldDown = 0
  }

  // if (Math.abs(this.body.angularVelocity) > 0.01 ) {
  //   if (this.body.angularVelocity > 0) {
  //     this.setAngularVelocity( -delta *0.00001)
  //   } else {
  //     this.setAngularVelocity( delta *0.00001)
  //   }
  // }
}

export default Controller
