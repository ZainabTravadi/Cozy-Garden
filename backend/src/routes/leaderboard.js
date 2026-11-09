import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const users = await User.find({})
      .select("username avatarData level experiencePoints coins createdAt _id")
      .sort({ experiencePoints: -1, level: -1, createdAt: 1, _id: 1 });
    const leaderboard = users.map((user, index) => ({
      username: user.username,
      avatarData: user.avatarData || "",
      level: user.level,
      experiencePoints: user.experiencePoints,
      coins: user.coins,
      rank: index + 1,
      currentUser: user._id.equals(req.user._id),
    }));
    if (users[0]) {
      await User.findByIdAndUpdate(users[0]._id, {
        $addToSet: { achievements: "garden-champion" },
        $set: { "achievementUnlockDates.garden-champion": new Date() },
      });
    }
    res.json({ leaderboard });
  } catch (error) {
    next(error);
  }
});

export default router;
