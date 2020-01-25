const ROTATE_SPEED = 0.002

class Controller {
  constructor (player) {
    this.player = player
    this.a = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.d = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.w = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
  }

  update (delta) {
    if (this.w.isDown) {
      this.player.thrustLeft(delta * 0.000025)
    }

    if (this.a.isDown) {
      // this.player.angle -= delta * 0.2
      this.player.setAngularVelocity(-delta * ROTATE_SPEED)
      return
    }
    if (this.d.isDown) {
      // this.player.angle += delta * 0.2
      this.player.setAngularVelocity(delta * ROTATE_SPEED)
    }
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
