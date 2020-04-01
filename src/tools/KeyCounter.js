class SpaceCounter {
  constructor(scene, onSpacePress) {
    this.timesSpaceWasPressed = 0;
    this.onSpacePress = onSpacePress;
    this.counterEvent(scene);
  }

  reset() {
    this.timesSpaceWasPressed = 0;
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

export default SpaceCounter;
