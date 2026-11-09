import { seeds } from "../data/seeds.js";

export const GARDEN_TILE_COUNT = 16;
export const DEFAULT_GROWTH_SECONDS = {
  carrot: 90 * 60,
  tomato: 2 * 60 * 60,
  sunflower: 4 * 60 * 60,
  strawberry: 3 * 60 * 60,
  pumpkin: 6 * 60 * 60,
  "violet-flower": 150 * 60,
};

export function createEmptyGarden() {
  return Array.from({ length: GARDEN_TILE_COUNT }, (_, index) => ({
    tileId: index,
    seedId: null,
    plantedAt: null,
    growthDurationSeconds: null,
  }));
}

export function normalizeGarden(garden) {
  if (!Array.isArray(garden) || garden.length !== GARDEN_TILE_COUNT) {
    return createEmptyGarden();
  }
  return garden.map((tile, index) => ({
    tileId: index,
    seedId: tile?.seedId || null,
    plantedAt: tile?.plantedAt || null,
    growthDurationSeconds: tile?.growthDurationSeconds || null,
    rewardCoins: tile?.rewardCoins || null,
    rewardXp: tile?.rewardXp || null,
  }));
}

export function getSeed(seedId) {
  return seeds.find((seed) => seed.id === seedId);
}

export function serializeGarden(garden, now = Date.now()) {
  return normalizeGarden(garden).map((tile) => {
    if (!tile.seedId || !tile.plantedAt) {
      return { ...tile, status: "empty", remainingSeconds: 0 };
    }
    const plantedTime = new Date(tile.plantedAt).getTime();
    const duration = Number(tile.growthDurationSeconds || 0);
    const remainingSeconds = Math.max(0, Math.ceil((plantedTime + duration * 1000 - now) / 1000));
    return {
      ...tile,
      status: remainingSeconds > 0 ? "growing" : "ready",
      remainingSeconds,
      seed: getSeed(tile.seedId) || null,
    };
  });
}
