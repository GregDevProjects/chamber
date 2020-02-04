const TEXT_DEPTH = 11
const DIALOGUE_BOX_DEPTH = 10

class DialogueManager {
  constructor (scene) {
    this.scene = scene
    this.text = ''
    this.anchor = null
    this.dialogueBox = null

    this.graphics = this.scene.add.graphics()
    this.graphics.setDepth(DIALOGUE_BOX_DEPTH)
    this.doUpdate = false
  }

  setAnchor (anchor, body) {
    this.anchor = anchor
    this.body = body
  }

  textPositionAboveAnchor (x, y) {
    y -= 130
    x += 30
    return [x, y]
  }

  moveText () {
    const [x, y] = this.textPositionAboveAnchor(this.body.x,
      this.body.y)
    // debugger
    this.text.setPosition(x,
      y)
  }

  setText (text) {
    // TODO: play a sound here
    const style = {
      fontSize: 24,
      fontFamily: 'Arial',
      align: 'left',
      wordWrap: { width: 370, useAdvancedWrap: true },
      color: 'black'
    }

    this.text = this.scene.add.text(
      this.anchor.x,
      this.anchor.y,
      '',
      style
    )

    this.text.setDepth(TEXT_DEPTH)
    this.textCharacterArray = text.split('')
    this.textDisplay = ''

    const onEvent = () => {
      if (!this.doUpdate) {
        return
      }
      this.textDisplay += this.textCharacterArray.shift()
      this.text.setText(this.textDisplay)
    }

    this.scene.time.addEvent({
      delay: 60,
      callback:
        onEvent,
      callbackScope: this,
      repeat: this.textCharacterArray.length - 1
    })
    this.doUpdate = true
  }

  drawDialogueBubble () {
    this.graphics.clear()

    this.graphics.lineStyle(
      6,
      0x000000,
      1
    )

    this.graphics.fillStyle(0xffff00,
      1)

    const x = this.anchor.x
    const y = this.anchor.y

    this.graphics.beginPath()

    this.graphics.lineTo(x + 10,
      y - 10) // head

    this.graphics.lineTo(this.body.x + 70,
      this.body.y - 70)

    this.graphics.moveTo(this.body.x + 130,
      this.body.y - 70)

    this.graphics.lineTo(this.body.x + 400,
      this.body.y - 70)

    this.graphics.lineTo(this.body.x + 400,
      this.body.y - 140)

    this.graphics.lineTo(this.body.x + 20,
      this.body.y - 140)

    this.graphics.lineTo(this.body.x + 20,
      this.body.y - 71)

    this.graphics.lineTo(this.body.x + 20,
      this.body.y - 70)

    this.graphics.lineTo(this.body.x + 50,
      this.body.y - 70)

    this.graphics.lineTo(x + 10,
      y - 10) // head

    this.graphics.closePath()
    this.graphics.strokePath()
    this.graphics.fillPath()
  }

  destroy () {
    this.doUpdate = false
    this.text.destroy()
    this.graphics.clear()
  }

  update () {
    if (!this.doUpdate) {
      return
    }

    this.moveText()
    this.drawDialogueBubble()
  }
}

export default DialogueManager
