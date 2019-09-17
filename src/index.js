import Phaser from 'phaser'
import logoImg from './assets/logo.png'
// baaaad
let Matter = Phaser.Physics.Matter

const width = 700
const height = 700

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: width,
  height: height,
  scene: {
    preload: preload,
    create: create
  },
  physics: {
    default: 'matter',
    matter: {
      debug: true,
      gravity: {
        x: 0,
        y: 0
      }
    }
  }
}

const game = new Phaser.Game(config)

function preload () {
  this.load.image('logo', logoImg)
}

function create () {
  Matter = this.matter
  Matter.world.setBounds(0, 0, width, height)

  const player = Matter.add.rectangle(250, 250, 50, 50)

  this.input.on('pointerdown', (coords) => {
    const force = 0.1
    const mouseVector = {
      x: coords.worldX,
      y: coords.worldY
    }

    applyForceInOppositeDirection(player, mouseVector, force)
  })
}

const applyForceInOppositeDirection = (gameObj, vector, force) => {
  const playerVector = {
    x: gameObj.position.x,
    y: gameObj.position.y
  }
  const targetAngle = Phaser.Math.Angle.Between(
    vector.x,
    vector.y,
    playerVector.x,
    playerVector.y
  )

  Matter.body.applyForce(gameObj, playerVector, {
    x: Math.cos(targetAngle) * force,
    y: Math.sin(targetAngle) * force
  })
}
