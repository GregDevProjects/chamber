const gamePosition = coordinate => {
  return coordinate + 150;
};

const setVelocityTowardsPoint = (matterObj, point, velocity) => {
  const angle = Phaser.Math.Angle.BetweenPoints(matterObj, point);
  matterObj.setVelocity(Math.cos(angle) * velocity, Math.sin(angle) * velocity);
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

export {
  gamePosition,
  setVelocityTowardsPoint,
  bounceCollision,
  bounceCollisionReversed
};
