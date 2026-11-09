export function getHarvestRewards(seed) {
  return {
    rewardCoins: seed.price * 2,
    rewardXp: seed.price,
  };
}

export function getLevelFromXp(experiencePoints) {
  return Math.floor(experiencePoints / 100) + 1;
}

export function getXpProgress(experiencePoints) {
  return experiencePoints % 100;
}
