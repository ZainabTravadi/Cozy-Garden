import test from "node:test";
import assert from "node:assert/strict";
import { getHarvestRewards, getLevelFromXp, getXpProgress } from "../src/services/progressionService.js";
import { evaluateAchievements } from "../src/services/achievementService.js";

test("derives level and current-level XP from total XP", () => {
  assert.equal(getLevelFromXp(0), 1);
  assert.equal(getXpProgress(0), 0);
  assert.equal(getLevelFromXp(99), 1);
  assert.equal(getXpProgress(99), 99);
  assert.equal(getLevelFromXp(100), 2);
  assert.equal(getXpProgress(100), 0);
  assert.equal(getLevelFromXp(250), 3);
  assert.equal(getXpProgress(250), 50);
  assert.equal(getLevelFromXp(400), 5);
});

test("uses trusted seed price for harvest rewards and XP", () => {
  assert.deepEqual(getHarvestRewards({ price: 25 }), { rewardCoins: 50, rewardXp: 25 });
});

test("evaluates achievement thresholds once", () => {
  const user = {
    achievements: ["garden-champion"],
    achievementUnlockDates: {},
    totalCropsPlanted: 1,
    cropsHarvested: 50,
    flowersHarvested: 10,
    lifetimeCoinsEarned: 5000,
    lifetimeSeedsPurchased: 10,
    currentDailyStreak: 7,
  };
  evaluateAchievements(user);
  const firstUnlocks = [...user.achievements];
  evaluateAchievements(user);
  assert.deepEqual(user.achievements, firstUnlocks);
  assert.ok(user.achievements.includes("master-gardener"));
});
