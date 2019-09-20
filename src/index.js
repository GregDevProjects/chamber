import Phaser from 'phaser'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'

import Loader from './loader'
import Game from './game'
import { GAME_HEIGHT, GAME_WIDTH } from './constants'

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
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

// eslint-disable-next-line no-new
new Phaser.Game(config)
