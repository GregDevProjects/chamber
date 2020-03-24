import Phaser from "phaser";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

import Loader from "./loader";
import {
  FRAME_HEIGHT,
  FRAME_WIDTH,
  GAME_WIDTH,
  GAME_HEIGHT
} from "./constants";
import MainMenu from "./scenes/menu";
import Level1 from "./scenes/level1";
import Level2 from "./scenes/level2";
import Music from "./scenes/music";

const config = {
  type: Phaser.WEBGL,
  parent: "phaser-example",
  width: FRAME_WIDTH,
  height: FRAME_HEIGHT,
  physics: {
    default: "matter",
    matter: {
      setBounds: { x: 150, y: 150, width: GAME_WIDTH, height: GAME_HEIGHT },
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
        key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
      }
    ]
  },
  scene: [Loader, MainMenu, Level1, Level2, Music]
};

// eslint-disable-next-line no-new
new Phaser.Game(config);
