import Player from './player'

const width = 700
const height = 700

// TODO: seperate game and loader
class Game extends Phaser.Scene {
  constructor (test) {
    super({
      key: 'Game'
    })
  }

  create () {
    // Matter = this.matter
    this.matter.world.setBounds(0, 0, width, height)

    const player = new Player({ scene: this, x: 250, y: 250 })
    // debugger
    this.input.on('pointerdown', (coords) => {
      const force = 0.04
      const mouseVector = {
        x: coords.worldX,
        y: coords.worldY
      }

      player.shoot(mouseVector, force)
    })

    this.matterCollision.addOnCollideStart({
      objectA: player,
      // objectB: trapDoor,
      callback: function (eventData) {
        console.log(eventData)
        // This function will be invoked any time the player and trap door collide
        // const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
        // bodyA & bodyB are the Matter bodies of the player and door respectively
        // gameObjectA & gameObjectB are the player and door respectively
        // pair is the raw Matter pair data
      },
      context: this // Context to apply to the callback function
    })
  }
}

export default Game
