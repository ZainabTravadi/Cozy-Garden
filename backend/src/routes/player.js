import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { toPublicUser } from "../utils/userResponse.js";
import { normalizeGarden } from "../utils/garden.js";
import bcrypt from "bcryptjs";

const router = Router();
const usernamePattern = /^[a-zA-Z0-9_]+$/;
const avatarPattern = /^data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/;
const maxAvatarLength = 2800000;

router.delete("/account", requireAuth, async (req, res, next) => {
  try {
    const { password } = req.body || {};
    if (typeof password !== "string" || !password) {
      return res.status(400).json({ message: "Enter your password to delete your account." });
    }
    const user = await User.findById(req.user._id).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "The password is incorrect." });
    }
    await User.deleteOne({ _id: user._id });
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

router.get("/profile", requireAuth, (req, res) => {
  const user = toPublicUser(req.user);
  user.garden = normalizeGarden(user.garden);
  const totalSeeds = user.inventory.reduce((total, item) => total + item.quantity, 0);
  res.json({ ...user, totalSeeds });
});

router.patch("/profile", requireAuth, async (req, res, next) => {
  try {
    const username = req.body.username?.trim();
    const avatarData = req.body.avatarData;
    if (!username || username.length < 2 || username.length > 30 || !usernamePattern.test(username)) {
      return res.status(400).json({ message: "Username must be 2-30 characters and use letters, numbers, or underscores." });
    }
    if (avatarData !== undefined && (
      typeof avatarData !== "string"
      || avatarData.length > maxAvatarLength
      || (avatarData !== "" && !avatarPattern.test(avatarData))
    )) {
      return res.status(400).json({ message: "Please upload a valid PNG or JPEG image smaller than 2 MB." });
    }
    const update = { username };
    if (avatarData !== undefined) update.avatarData = avatarData;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true, runValidators: true },
    );
    const publicUser = toPublicUser(user);
    const totalSeeds = publicUser.inventory.reduce((total, item) => total + item.quantity, 0);
    return res.json({ user: { ...publicUser, totalSeeds } });
  } catch (error) {
    return next(error);
  }
});

router.patch("/welcome", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { hasSeenGardenWelcome: true },
      { new: true, runValidators: true },
    );
    res.json({ user: toPublicUser(user) });
  } catch (error) {
    next(error);
  }
});

export default router;
