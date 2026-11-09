export function getGrowthStage(plantedAt, growthDurationSeconds, now = Date.now()) {
  if (!plantedAt || !growthDurationSeconds) return 1;

  const elapsed = Math.max(0, now - new Date(plantedAt).getTime());
  const progress = elapsed / (growthDurationSeconds * 1000);

  if (progress >= 1) return 3;
  if (progress >= 0.5) return 2;
  return 1;
}

export function isCropReady(plantedAt, growthDurationSeconds, now = Date.now()) {
  return getGrowthStage(plantedAt, growthDurationSeconds, now) === 3;
}
