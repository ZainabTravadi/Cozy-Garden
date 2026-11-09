const achievementRules = [
  ["first-steps", (user) => user.totalCropsPlanted >= 1],
  ["little-gardener", (user) => user.cropsHarvested >= 10],
  ["flower-power", (user) => user.flowersHarvested >= 10],
  ["coin-collector", (user) => user.lifetimeCoinsEarned >= 5000],
  ["seed-hoarder", (user) => user.lifetimeSeedsPurchased >= 10],
  ["fresh-start", (user) => user.currentDailyStreak >= 3],
  ["dedicated-gardener", (user) => user.currentDailyStreak >= 7],
  ["harvest-hero", (user) => user.cropsHarvested >= 50],
];

export async function recordDailyActivity(user) {
  const today = new Date().toISOString().slice(0, 10);
  if (user.lastActiveDate === today) return user;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  user.currentDailyStreak = user.lastActiveDate === yesterday ? user.currentDailyStreak + 1 : 1;
  user.lastActiveDate = today;
  return user;
}

export function evaluateAchievements(user) {
  const achievements = new Set(user.achievements || []);
  const unlockDates = user.achievementUnlockDates || {};
  const now = new Date();
  for (const [id, condition] of achievementRules) {
    if (!achievements.has(id) && condition(user)) {
      achievements.add(id);
      unlockDates[id] = now;
    }
  }
  const nonMasterCount = [...achievements].filter((id) => id !== "master-gardener").length;
  if (!achievements.has("master-gardener") && nonMasterCount >= 9) {
    achievements.add("master-gardener");
    unlockDates["master-gardener"] = now;
  }
  user.achievements = [...achievements];
  user.achievementUnlockDates = unlockDates;
  return user;
}
