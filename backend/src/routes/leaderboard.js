import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { toLeaderboardEntry } from "../utils/leaderboard.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const users = await User.find({})
      .select("username level experiencePoints createdAt _id")
      .sort({ experiencePoints: -1, level: -1, createdAt: 1, _id: 1 })
      .limit(100);
    const leaderboard = users.map((user, index) => toLeaderboardEntry(user, index + 1, req.user._id));
    if (users[0]) {
      await User.findByIdAndUpdate(users[0]._id, {
        $addToSet: { achievements: "garden-champion" },
        $set: { "achievementUnlockDates.garden-champion": new Date() },
      });
    }
    const currentUser = await User.findById(req.user._id).select("achievements");
    res.json({ leaderboard, achievements: currentUser?.achievements || [] });
  } catch (error) {
    next(error);
  }
});

export default router;
