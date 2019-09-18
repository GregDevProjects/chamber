import Phaser from 'phaser'
import logoImg from './assets/logo.png'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'
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
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: 'matterCollision', // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: 'matterCollision' // Where to store in the Scene, e.g. scene.matterCollision
      }
    ]
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

  const cat1 = Matter.world.nextCategory()
  const cat2 = Matter.world.nextCategory()

  player.collisionFilter.group = -1

  this.input.on('pointerdown', (coords) => {
    const force = 0.04
    const mouseVector = {
      x: coords.worldX,
      y: coords.worldY
    }

    applyForceInOppositeDirection(player, mouseVector, force)
    shoot(player, mouseVector)
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

const shoot = (player, mouseVector) => {
  const force = 0.003
  const circle = Matter.add.circle(player.position.x, player.position.y, 8)
  circle.restitution = 2
  circle.collisionFilter.group = -1

  let targetAngle = Phaser.Math.Angle.Between(
    mouseVector.x,
    mouseVector.y,
    player.position.x,
    player.position.y
  )

  targetAngle = targetAngle - Math.PI

  Matter.body.applyForce(circle, { x: circle.position.x, y: circle.position.y }, {
    x: Math.cos(targetAngle) * force,
    y: Math.sin(targetAngle) * force
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
