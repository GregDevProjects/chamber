class Gun extends Phaser.GameObjects.Image {
  constructor (player) {
    super(
      player.scene,
      player.x,
      player.y,
      'gun'
    )
    this.player = player
    this.setOrigin(-0.3,
      0.5)
    this.player.scene.add.existing(this)
    this.angleToPointer()
    this.setDepth(2)
  }

  angleToPointer () {
    this.scene.input.on(
      'pointermove',
      function (pointer) {
        const angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.BetweenPoints(this,
          { x: pointer.worldX, y: pointer.worldY })

        this.setAngle(angle)
      }, this
    )
  }

  update () {
    this.setPosition(this.player.x,
      this.player.y)
  }
}

export default Gun
