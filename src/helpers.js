const gamePosition = coordinate => {
  return coordinate + 150;
};

const setVelocityTowardsPoint = (matterObj, point, velocity) => {
  const angle = Phaser.Math.Angle.BetweenPoints(matterObj, point);
  matterObj.setVelocity(Math.cos(angle) * velocity, Math.sin(angle) * velocity);
};

export { gamePosition, setVelocityTowardsPoint };
