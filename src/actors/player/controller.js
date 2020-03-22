const MAX_ROTATE_SPEED = 0.0778;
const ROTATE_SPEED = 0.001;

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
    this.space = player.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    player.scene.input.keyboard.on("keyup_SPACE", event => {
      this.player.stopKick();
    });

    player.scene.input.keyboard.on("keydown_SPACE", event => {
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

  update(delta) {
    if (this.space.isDown) {
      this.kick();
      return;
    }

    if (this.w.isDown) {
      this.player.thrustLeft(delta * FORWARD_SPEED);
    }

    if (this.a.isDown) {
      const angularVelocity = this.clampRotateSpeed(
        this.player.body.angularVelocity - ROTATE_SPEED
      );
      this.player.setAngularVelocity(angularVelocity);

      return;
    }
    if (this.d.isDown) {
      const angularVelocity = this.clampRotateSpeed(
        this.player.body.angularVelocity + ROTATE_SPEED
      );
      this.player.setAngularVelocity(angularVelocity);
    }
  }
}

export default Controller;
