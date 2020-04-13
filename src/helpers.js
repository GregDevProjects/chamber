const gamePosition = (coordinate) => {
  return coordinate + 150;
};

const setVelocityTowardsPoint = (matterObj, point, velocity) => {
  const angle = Phaser.Math.Angle.BetweenPoints(matterObj, point);
  matterObj.setVelocity(Math.cos(angle) * velocity, Math.sin(angle) * velocity);
};

const setThrustTowardsPoint = (matterObj, point, velocity) => {
  const angle = Phaser.Math.Angle.BetweenPoints(matterObj, point);
  // debugger;
  const vector = {
    x: velocity * Math.cos(angle),
    y: velocity * Math.sin(angle),
  };
  Phaser.Physics.Matter.Matter.Body.applyForce(
    matterObj.body,
    { x: matterObj.x, y: matterObj.y },
    vector
  );
};

const bounceCollision = (eventData, matterObj, force) => {
  const contactPointA = eventData.pair.collision.bodyA.position;
  const contactPointB = eventData.pair.collision.supports[0];
  const angle = Phaser.Math.Angle.BetweenPoints(contactPointA, contactPointB);

  matterObj.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force);
};

const bounceCollisionReversed = (eventData, matterObj, force) => {
  const contactPointA = eventData.pair.collision.bodyA.position;
  const contactPointB = eventData.pair.collision.supports[0];
  const angle =
    Phaser.Math.Angle.BetweenPoints(contactPointA, contactPointB) + Math.PI;

  matterObj.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force);
};

const bounceCollisionReversedFromCenter = (eventData, matterObj, force) => {
  const contactPointA = eventData.pair.collision.bodyA.position;
  const contactPointB = eventData.pair.collision.bodyB.position;
  const angle =
    Phaser.Math.Angle.BetweenPoints(contactPointA, contactPointB) + Math.PI;

  matterObj.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force);
};

const flashTween = (scene, target) =>
  scene.tweens.add({
    targets: target,
    duration: 250,
    callbackScope: this,
    yoyo: true,
    alpha: 1,
    repeat: -1,
  });

const highestValue = (value1, value2) => {
  if (value1 > value2) return value1;

  return value2;
};

const randomProperty = function (obj) {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};

export {
  gamePosition,
  setVelocityTowardsPoint,
  bounceCollision,
  bounceCollisionReversed,
  flashTween,
  setThrustTowardsPoint,
  highestValue,
  randomProperty,
  bounceCollisionReversedFromCenter,
};
