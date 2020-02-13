import DialogueManager from './dialogueManager'

const TEXT_STYLE = {
  fontSize: 24,
  fontFamily: 'Arial',
  align: 'left',
  wordWrap: { width: 200, useAdvancedWrap: true },
  color: 'black'
}

class RobotDialogue extends DialogueManager {
  constructor (scene) {
    super(scene)
    this.style = TEXT_STYLE
    this.step = 30
    this.radius = 100
    this.movingPoints = []
    this.pulseSpeed = 1000
    this.pulseRange = 30
  }

  textPositionAboveAnchor (x, y) {
    y += -10
    x -= 85
    return [x, y]
  }

  degreesToRadians (degrees) {
    return degrees * Math.PI / 180
  }

  nextSpikeMovement (index) {
    const sinWave = Math.abs(Math.sin(this.scene.time.now / this.pulseSpeed)) * this.pulseRange

    const newRad = this.movingPoints[index].radius + sinWave
    const newx = (this.radius + newRad) * Math.cos(this.degreesToRadians(index + this.step / 2)) + this.anchor.x
    const newy = (this.radius + newRad) * Math.sin(this.degreesToRadians(index + this.step / 2)) + this.anchor.y

    return { x: newx, y: newy }
  }

  drawDialogueBubble () {
    this.graphics.clear()
    this.graphics.fillStyle(0xffff00,
      1)

    this.graphics.lineStyle(
      6,
      0x000000,
      1
    )

    this.graphics.fillStyle(0xffff00,
      1)

    // const radius = 100

    for (let i = 0; i < 360; i += this.step) {
      const x = this.radius * Math.cos(this.degreesToRadians(i)) + this.anchor.x
      const y = this.radius * Math.sin(this.degreesToRadians(i)) + this.anchor.y

      this.graphics.lineTo(x,
        y)

      // find a point between this one and the next, give it a random radius
      if (!this.movingPoints[i]) {
        const newRad = Phaser.Math.Between(20,
          100)
        const newx = this.movingPoints[i] ? this.movingPoints[i].x
          : (this.radius + newRad) * Math.cos(this.degreesToRadians(i + this.step / 2)) + this.anchor.x
        const newy = this.movingPoints[i] ? this.movingPoints[i].y
          : (this.radius + newRad) * Math.sin(this.degreesToRadians(i + this.step / 2)) + this.anchor.y

        this.movingPoints[i] = { x: newx, y: newy, radius: newRad }
      }

      const animatePoints = this.nextSpikeMovement(i)
      this.graphics.lineTo(animatePoints.x,
        animatePoints.y)
    }

    this.graphics.closePath()
    this.graphics.strokePath()
    this.graphics.fillPath()
  }
}

export default RobotDialogue
