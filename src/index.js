import Phaser from 'phaser'
import logoImg from './assets/logo.png'
import playerImg from './assets/player.jpg'
import bulletImg from './assets/bullet.png'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'
import Player from './player'
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
  this.load.image('player', playerImg)
  this.load.image('bullet', bulletImg)
}

function create () {
  Matter = this.matter
  Matter.world.setBounds(0, 0, width, height)

  const player = new Player({ scene: this, x: 250, y: 250 })

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
