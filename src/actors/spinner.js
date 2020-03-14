const WIDTH = 15
const HEIGHT = 60

class Spinner extends Phaser.Physics.Matter.Image {
  constructor (config) {
    super(
      config.scene.matter.world,
      config.x,
      config.y,
      'transparent'
    )

    this.setExistingBody(this.getBody(config))
    console.log('io')
  }

  getBody (config) {
    var M = Phaser.Physics.Matter.Matter

    const one = Phaser.Physics.Matter.Matter.Bodies.rectangle(
      config.x,
      config.y,
      WIDTH,
      HEIGHT,
      { angle: 1.5708 }
    )

    // one.angle = 2

    const two = Phaser.Physics.Matter.Matter.Bodies.rectangle(
      config.x,
      config.y,
      WIDTH,
      HEIGHT
    //   { angle: 5.1050881 } // 292.5 degrees
    )

    return M.Body.create({
      parts: [
        one,
        two
      ]
    })
  }

  update () {
    this.setAngularVelocity(0.01)
    // gameObject.applyForceFrom(position, force);
    // need to apply thrust towards player
    this.thrust(0.0001)
  }
}

export default Spinner
