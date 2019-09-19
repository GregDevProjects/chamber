import Phaser from 'phaser'
import logoImg from './assets/logo.png'

import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'

import Loader from './loader'
import Game from './game'
// baaaad

const width = 700
const height = 700

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: width,
  height: height,
  scene: {
    preload: preload
    // create: create
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
  },
  scene: [
    Loader,
    Game
  ]
}

const game = new Phaser.Game(config)
