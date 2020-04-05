import Player from "../actors/player/index";
import {
  FRAME_WIDTH,
  FRAME_HEIGHT,
  GAME_HEIGHT,
  GAME_WIDTH,
} from "../constants";

import BlocksController from "../ai/blocksController";
import RobotDialogue from "../dialogue/RobotDialogue";
import HumanDialogue from "../dialogue/HumanDialogue";
import Level from "./level";
import GunFloating from "../actors/gun_floating";

import SpaceCounter from "../tools/KeyCounter";
import ProgressBar from "../effects/ProgressBar";

const BLOCK_TIME = 3;
//robo ttext appears in random corners
const beginningGameDialogue = [
  { type: "human", text: "What is this..." },
  { type: "human", text: "Where the hell am I?" },
  { type: "robot", text: "Do not be afraid, I can help" },
  { type: "robot", text: "Use the A and D keys to rotate" },
  { type: "robot", text: "Use W to accelerate" },
  { type: "human", text: "You didn't answer my question!" },
  {
    type: "robot",
    text: "This is low priority information compared to SURVIVAL",
  },
  { type: "robot", text: "Move towards the center, press E to begin" },
  { type: "hold" },
  {
    type: "human",
    text: "This helmet seems pretty flimsy, better watch my HEAD",
  },
  { type: "hold" },
  { type: "robot", text: "Synchronization Complete" },
  { type: "human", text: "Synchronization with what?" },
  { type: "robot", text: "PICK UP THE GUN" },
  { type: "human", text: "OUCH! FINE!" },
  { type: "hold" },
  { type: "human", text: "WHAT THE FUCK IS HAPPENING TO ME" },
  { type: "hold" },

  //delay text
];

class Level1 extends Level {
  constructor(test) {
    super({
      key: "1",
      active: false,
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
    });
  }

  setupPlayer() {
    this.player = new Player({ scene: this, x: 500, y: 250 });
    this.player.removeGun();
    this.player.removeControls();
    this.humanDialogue = new HumanDialogue(this);
    this.humanDialogue.setAnchor(this.player.head, this.player);
  }

  startBlockDodging() {
    this.blocksController.changeBlockType(2);
    this.blocksController.setRandomRotation(true);
    this.blocksController.startRandomSpawning();

    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.handleDialogue(beginningGameDialogue);
      },
      callbackScope: this,
    });

    this.progressBar = new ProgressBar(
      this,
      BLOCK_TIME,
      "MOVEMENT SYNCHRONIZATION",
      () => {
        this.cameras.main.flash();
        this.blocksController.stopSpawning();
        this.blocksController.destroyAllBlocks();
        this.moveDialogueTo(11, beginningGameDialogue);
        this.progressBar.destroy();
      }
    );
  }

  startLevelEnd() {
    // this.blocksController.destroyAllBlocks();
    this.musicScene.stop();
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
      // this.humanDialogue.destroy();
      this.time.addEvent({
        delay: 3000,
        callback: () => {
          this.moveDialogueTo(16, beginningGameDialogue);
        },
        callbackScope: this,
      });

      this.time.addEvent({
        delay: 25000,
        callback: () => {
          alert("level complete");
        },
        callbackScope: this,
      });
    });
  }

  startLevel() {
    this.rotatePlayer = true;
    this.humanDialogue.setText(beginningGameDialogue[0].text);
    const onSpacePress = (timesPressed) => {
      if (this.dialogueProgress <= 8) {
        this.handleDialogue(beginningGameDialogue);
        if (this.dialogueProgress === 3) {
          this.player.giveControls();
          this.rotatePlayer = false;
        }
      }

      if (this.dialogueProgress === 9 && !this.started) {
        this.started = true;
        this.startBlockDodging();
        return;
      }

      if (this.dialogueProgress === 10) {
        //watch my head
        this.handleDialogue(beginningGameDialogue);
        return;
      }

      if (this.dialogueProgress >= 12 && this.dialogueProgress < 16) {
        this.handleDialogue(beginningGameDialogue);
      }

      if (this.dialogueProgress === 15 && !this.finishedLevel) {
        //show the gun and teleport player
        this.finishedLevel = true;
        this.startLevelEnd();
      }

      if (this.dialogueProgress === 17) {
        this.handleDialogue(beginningGameDialogue);
      }
    };

    this.spaceCounter = new SpaceCounter(this, onSpacePress);
  }

  resetScene() {
    this.scene.restart();
  }

  levelCreate() {
    //when blocks start moving
    this.started = false;
    //when
    this.finishedLevel = false;
    this.progressBar = false;
    this.rotatePlayer = false;
    this.dialogueProgress = 1;

    this.setupPlayer();

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
