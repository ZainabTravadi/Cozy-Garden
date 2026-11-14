import test from "node:test";
import assert from "node:assert/strict";
import { toLeaderboardEntry } from "../src/utils/leaderboard.js";

test("leaderboard exposes rank fields without private balance or avatar data", () => {
  const playerId = { equals: (value) => value === "player-1" };
  const user = {
    _id: playerId,
    username: "garden_friend",
    level: 4,
    experiencePoints: 325,
    coins: 9000,
    avatarData: "data:image/png;base64,private-image",
    email: "private@example.test",
  };
  const entry = toLeaderboardEntry(user, 3, "player-1");
  assert.deepEqual(entry, {
    username: "garden_friend",
    level: 4,
    experiencePoints: 325,
    rank: 3,
    currentUser: true,
  });
  assert.equal("coins" in entry, false);
  assert.equal("avatarData" in entry, false);
  assert.equal("email" in entry, false);
});
