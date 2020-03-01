const MAX_ROTATE_SPEED = 0.0778
const ROTATE_SPEED = 0.001

const FORWARD_SPEED = 0.000015 // 0.000025

class Controller {
  constructor (player) {
    this.player = player
    this.a = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.d = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.w = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
  }

  clampRotateSpeed (angularVelocity) {
    return Phaser.Math.Clamp(
      angularVelocity,
      -MAX_ROTATE_SPEED,
      MAX_ROTATE_SPEED
    )
  }

  update (delta) {
    if (this.w.isDown) {
      this.player.thrustLeft(delta * FORWARD_SPEED)
    }

    if (this.a.isDown) {
      const angularVelocity = this.clampRotateSpeed(this.player.body.angularVelocity - ROTATE_SPEED)
      this.player.setAngularVelocity(angularVelocity)

      return
    }
    if (this.d.isDown) {
      const angularVelocity = this.clampRotateSpeed(this.player.body.angularVelocity + ROTATE_SPEED)
      this.player.setAngularVelocity(angularVelocity)
    }
  }
}

export default Controller
