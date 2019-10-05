import Phaser from 'phaser'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'

import Loader from './loader'
import Game from './game'
import { GAME_WIDTH, GAME_HEIGHT, FRAME_HEIGHT, FRAME_WIDTH } from './constants'

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: FRAME_WIDTH,
  height: FRAME_HEIGHT,
  backgroundColor: '#392542',
  physics: {
    default: 'matter',
    matter: {
      debug: false,
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
