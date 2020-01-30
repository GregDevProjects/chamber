import Phaser from 'phaser'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'

import Loader from './loader'
import { FRAME_HEIGHT, FRAME_WIDTH } from './constants'
import MainMenu from './scenes/menu'
import Level1 from './scenes/level1'
import Level2 from './scenes/level2'

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
    MainMenu,
    Level1,
    Level2
  ]
}

// eslint-disable-next-line no-new
new Phaser.Game(config)
