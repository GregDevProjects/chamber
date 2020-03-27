const MAX_ROTATE_SPEED = 0.0778;
const ROTATE_SPEED = 0.0001; // 0.001;

const FORWARD_SPEED = 0.000015; // 0.000025

class Controller {
  constructor(player) {
    this.spaceHeld = false;
    this.player = player;
    this.a = player.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.d = player.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );
    this.w = player.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.W
    );

    this.s = player.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );

    this.space = player.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    player.scene.input.keyboard.on("keyup_SPACE", event => {
      if (!this.player.allowMovement) {
        return;
      }

      this.player.stopKick();
    });

    player.scene.input.keyboard.on("keydown_SPACE", event => {
      if (!this.player.allowMovement) {
        return;
      }
      this.player.torso.startFlashing();
    });
  }

  clampRotateSpeed(angularVelocity) {
    return Phaser.Math.Clamp(
      angularVelocity,
      -MAX_ROTATE_SPEED,
      MAX_ROTATE_SPEED
    );
  }

  kick() {
    if (this.a.isDown) {
      this.player.kick(false);
      return;
    }
    this.player.kick(true);
  }

  getRotateSpeed(delta) {
    return delta * ROTATE_SPEED;
  }

  update(delta) {
    if (this.space.isDown) {
      this.kick();
      return;
    }

    if (this.w.isDown) {
      this.player.thrustLeft(delta * FORWARD_SPEED);
    }

    console.log(this.getRotateSpeed(delta));

    if (this.a.isDown) {
      const angularVelocity = this.clampRotateSpeed(
        this.player.body.angularVelocity - this.getRotateSpeed(delta)
      );
      this.player.setAngularVelocity(angularVelocity);

      return;
    }
    if (this.d.isDown) {
      const angularVelocity = this.clampRotateSpeed(
        this.player.body.angularVelocity + this.getRotateSpeed(delta)
      );
      this.player.setAngularVelocity(angularVelocity);
    }
    //FOR DEBUGGING
    if (this.s.isDown) {
      this.player.thrustRight(delta * FORWARD_SPEED);
    }
  }
}

export default Controller;
