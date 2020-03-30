import Player from "../actors/player/index";
import {
  FRAME_WIDTH,
  FRAME_HEIGHT,
  GAME_HEIGHT,
  GAME_WIDTH
} from "../constants";

import BlocksController from "../ai/blocksController";
import createPlayerBarrier from "../ai/playerBarrier";
import DialogueManager from "../dialogue/dialogueManager";

import RobotDialogue from "../dialogue/RobotDialogue";
import HumanDialogue from "../dialogue/HumanDialogue";

import Spinner from "../actors/spinner";

import Level from "./level";

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
    this.musicScene.setVolume(1);
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
        this.robotDialogue.setText(
          "Move towards the center, press E to begin MOVEMENT SYNCHRONIZATION"
        );
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
          3,
          "MOVEMENT SYNCHRONIZATION",
          () => {
            this.robotDialogue.setText("Get the gun");
            this.progressBar.destroy();
          }
        );
      }
    };

    this.spaceCounter = new SpaceCounter(this, onSpacePress);
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
    this.musicScene.setVolume(0.2);

    this.robotDialogue = new RobotDialogue(this);
    this.robotDialogue.setAnchor({ x: 500, y: 500 });

    this.startLevel();
    //this.startLevel();
    // this.startGameplay();

    // this._TEST_SPINNER = new Spinner({
    //   x: 300,
    //   y: 300,
    //   scene: this,
    //   player: this.player
    // });
    // this.matter.world.setGravity(0, 1, 0.0001);

    // this.DeathAnimation = new DeathAnimation(this, this.player);
  }

  update(time, delta) {
    if (this.done) {
      return;
    }
    // put everything to update in array?
    if (this.progressBar) {
      this.progressBar.update();
    }

    this.blocksController.update(delta);

    this.player.update(delta);
    if (this.rotatePlayer) {
      this.player.setAngularVelocity(0.02);
    }

    this.robotDialogue.update();
    this.humanDialogue.update();
    //this._TEST_SPINNER.update(delta);

    // this.DeathAnimation.update();
  }
}

class SpaceCounter {
  constructor(scene, onSpacePress) {
    this.timesSpaceWasPressed = 0;
    this.onSpacePress = onSpacePress;
    this.counterEvent(scene);
  }

  counterEvent(scene) {
    scene.input.keyboard.on("keydown_E", event => {
      event.preventDefault();
      this.timesSpaceWasPressed++;
      this.onSpacePress(this.timesSpaceWasPressed);
    });
  }

  timesPressed() {
    return this.timesSpaceWasPressed;
  }
}

class ProgressBar {
  constructor(scene, seconds, text, onFinish) {
    this.scene = scene;
    // this.secondsStart = this.scene.game.time.totalElapsedSeconds();
    // this.seconds = seconds;

    this.position = {
      x: FRAME_WIDTH / 2,
      y: FRAME_HEIGHT - 100
    };

    this.progressBoxWidth = 350;

    this.progressBar = scene.add.graphics();
    this.progressBar.setDepth(99);

    this.progressBox = scene.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(
      this.position.x - this.progressBoxWidth / 2,
      this.position.y,
      this.progressBoxWidth,
      50
    );
    this.progressBox.setDepth(99);

    this.percentText = scene.make.text({
      x: this.position.x,
      y: this.position.y + 25,
      text: "0%",
      style: {
        font: "18px monospace"
        // fill: "#ffffff"
      }
    });
    this.percentText.setOrigin(0.5, 0.5);
    this.percentText.setDepth(100);

    this.assetText = scene.make.text({
      x: this.position.x,
      y: this.position.y + 70,
      text: text,
      style: {
        font: "18px monospace",
        fill: "#ffffff"
      }
    });

    this.assetText.setOrigin(0.5, 0.5);
    this.assetText.setDepth(99);

    this.timedEvent = this.scene.time.addEvent({
      callback: () => {
        if (this.timedEvent.getRepeatCount() === 0) {
          onFinish();
        }
      },
      callbackScope: this,
      repeat: seconds,
      delay: 1000
    });
  }

  update() {
    // const secondsElapsed =
    //   this.secondsStart - this.scene.game.time.totalElapsedSeconds();
    // const secondsLeft = this.seconds - secondsElapsed;

    // debugger;

    if (!this.percentText.active) {
      return;
    }

    const progressPercentage = this.timedEvent.getOverallProgress();

    this.percentText.setText(
      Phaser.Math.RoundTo(progressPercentage * 100, -1).toFixed(1) + "%"
    );
    this.progressBar.clear();
    this.progressBar.fillStyle(0xffffff, 1);
    this.progressBar.fillRect(
      this.position.x + 10 - this.progressBoxWidth / 2,
      this.position.y + 10,
      (this.progressBoxWidth - 20) * progressPercentage,
      30
    );
    // debugger;
  }

  destroy() {
    this.progressBar.destroy();
    this.progressBox.destroy();
    this.percentText.destroy();
    this.assetText.destroy();
    this.timedEvent.destroy();
  }
}

export default Level1;
