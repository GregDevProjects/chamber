import Player from "../actors/player/index";
import {
  FRAME_WIDTH,
  FRAME_HEIGHT,
  GAME_HEIGHT,
  GAME_WIDTH
} from "../constants";

import BlocksController from "../ai/blocksController";
import RobotDialogue from "../dialogue/RobotDialogue";
import HumanDialogue from "../dialogue/HumanDialogue";
import Level from "./level";
import GunFloating from "../actors/gun_floating";

import SpaceCounter from "../tools/KeyCounter";
import ProgressBar from "../effects/ProgressBar";

const BLOCK_TIME = 100;

class Level1 extends Level {
  constructor(test) {
    super({
      key: "1",
      active: false,
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT
    });

    this.progressBar = false;
  }

  setupPlayer() {
    this.player = new Player({ scene: this, x: 500, y: 250 });
    this.player.removeGun();
    this.player.removeControls();
    this.humanDialogue = new HumanDialogue(this);
    this.humanDialogue.setAnchor(this.player.head, this.player);
  }

  startGameplay() {
    this.player.giveControls();
    this.robotDialogue.destroy();
    //this.blocksController.setPadding(70, 150);
    this.blocksController.changeBlockType(2);
    this.blocksController.setRandomRotation(true);
    this.blocksController.startRandomSpawning();
  }

  startLevel() {
    this.rotatePlayer = true;
    this.humanDialogue.setText("What is this...");
    const onSpacePress = timesPressed => {
      this.humanDialogue.destroy();
      this.robotDialogue.destroy();

      if (this.levelFinished) {
        this.afterBlockStory(timesPressed);
        return;
      }

      this.beforeBlockStory(timesPressed);
    };

    this.spaceCounter = new SpaceCounter(this, onSpacePress);
  }

  beforeBlockStory(timesPressed) {
    if (timesPressed === 1) {
      this.humanDialogue.setText("Where the hell am I?");
    }
    if (timesPressed === 2) {
      this.robotDialogue.setAnchor({ x: 500, y: 500 });
      this.robotDialogue.setText("Do not be afraid, I can help");
    }
    if (timesPressed === 3) {
      this.robotDialogue.setAnchor({ x: 250, y: 600 });
      this.robotDialogue.setText("Use the A and D keys to rotate");
      this.player.giveControls();
      this.rotatePlayer = false;
    }
    if (timesPressed === 4) {
      this.robotDialogue.setAnchor({ x: 700, y: 400 });
      this.robotDialogue.setText("Use W to accelerate");
    }
    if (timesPressed === 5) {
      this.humanDialogue.setText("You didn't answer my question!");
    }
    if (timesPressed === 6) {
      this.robotDialogue.setAnchor({ x: 250, y: 200 });
      this.robotDialogue.setText(
        "This is low priority information compared to SURVIVAL"
      );
    }
    if (timesPressed === 7) {
      this.robotDialogue.setAnchor({ x: 800, y: 200 });
      this.robotDialogue.setText("Move towards the center, press E to begin");
    }
    if (timesPressed === 8) {
      this.time.addEvent({
        delay: 3000,
        callback: () => {
          this.humanDialogue.setText(
            "This helmet seems pretty flimsy, better watch my HEAD"
          );
        },
        callbackScope: this
      });
      this.startGameplay();
      this.progressBar = new ProgressBar(
        this,
        BLOCK_TIME,
        "MOVEMENT SYNCHRONIZATION",
        () => {
          this.blocksController.stopSpawning();
          this.time.addEvent({
            delay: 3500,
            callback: () => {
              this.humanDialogue.destroy();
              this.levelFinished = true;
              this.spaceCounter.reset();
              this.robotDialogue.setAnchor({ x: 800, y: 800 });
              this.robotDialogue.setText("Synchronization Complete");
              this.progressBar.destroy();
            },
            callbackScope: this
          });
        }
      );
    }
  }

  afterBlockStory(timesPressed) {
    if (timesPressed === 1) {
      this.humanDialogue.setText("Synchronization with what?");
    }
    if (timesPressed === 2) {
      this.robotDialogue.setAnchor({ x: 300, y: 800 });
      this.robotDialogue.setText("PICK UP THE GUN");
    }
    if (timesPressed === 3) {
      this.musicScene.stop();
      this.humanDialogue.setText("OUCH! FINE!");
      this.cameras.main.flash();
      this.player.setAngle(0);
      this.player.setPosition(700, 300);
      this.player.setVelocity(0, 0);

      this.gunFloating = new GunFloating(500, 500, this, () => {
        //picking up gun
        this.cameras.main.flash();
        this.player.removeControls();
        this.player.setPosition(500, 500);
        this.player.setVelocity(0, 0);
        this.rotatePlayer = true;
        this.humanDialogue.destroy();
        this.time.addEvent({
          delay: 3000,
          callback: () => {
            this.humanDialogue.setText("WHAT THE FUCK IS HAPPENING TO ME");
          },
          callbackScope: this
        });

        this.time.addEvent({
          delay: 25000,
          callback: () => {
            alert("level complete");
          },
          callbackScope: this
        });
      });
    }
  }

  resetScene() {
    this.scene.restart();
  }

  levelCreate() {
    // this.circleTest(180, 0);
    //will need this on every scene
    this.setupPlayer();

    this.rotatePlayer = false;
    this.blocksController = new BlocksController(this);

    this.musicScene = this.scene.get("music");
    this.musicScene.play();

    this.robotDialogue = new RobotDialogue(this);
    this.robotDialogue.setAnchor({ x: 500, y: 500 });

    this.startLevel();
  }

  update(time, delta) {
    if (this.done) {
      return;
    }
    // put everything to update in array?
    if (this.progressBar) {
      this.progressBar.update();
    }

    if (this.gunFloating) {
      this.gunFloating.update();
    }

    this.blocksController.update(delta);

    this.player.update(delta);
    if (this.rotatePlayer) {
      this.player.setAngularVelocity(0.02);
    }

    this.robotDialogue.update();
    this.humanDialogue.update();
  }
}

export default Level1;
