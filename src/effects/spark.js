const spark = (position, scene) => {
  const image = scene.add.image(position.x, position.y, "spark");

  image.setAngle(Phaser.Math.Between(0, 360));

  image.setDepth(100);

  scene.tweens.add({
    targets: image,
    scaleX: 2,
    scaleY: 2,
    alpha: 0,
    duration: 500,
    onComplete: (greg, test) => {
      test[0].destroy();
    },
    onCompleteParams: [image]
  });
};

const makeDot = (scene, position) => {
  var graphics = scene.add.graphics();

  var color = 0x000000;
  var alpha = 1;

  graphics.fillStyle(color, alpha);
  graphics.fillRect(position.x, position.y, 10, 10);
};

export { spark, makeDot };
