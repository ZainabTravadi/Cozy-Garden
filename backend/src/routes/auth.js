import bcrypt from "bcryptjs";
import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { toPublicUser } from "../utils/userResponse.js";
import { createToken } from "../utils/token.js";
import { createEmptyGarden } from "../utils/garden.js";

const router = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_]+$/;

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function validateCredentials({ username, email, password, confirmPassword }) {
  if (!username || !email || !password || !confirmPassword) {
    return "All fields are required.";
  }
  if (!emailPattern.test(email)) {
    return "Please enter a valid email address.";
  }
  if (!usernamePattern.test(username) || username.length < 2 || username.length > 30) {
    return "Username must be 2-30 characters and use letters, numbers, or underscores.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (password !== confirmPassword) {
    return "Passwords must match.";
  }
  return null;
}

router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const validationError = validateCredentials({ username, email, password, confirmPassword });
    if (validationError) return res.status(400).json({ message: validationError });

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: username.trim() }],
    });
    if (existing) return res.status(409).json({ message: "Email or username is already in use." });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      passwordHash,
      coins: 500,
      level: 1,
      experiencePoints: 0,
      inventory: [],
      garden: createEmptyGarden(),
      achievements: [],
      cropsHarvested: 0,
      hasSeenGardenWelcome: false,
    });
    const token = createToken(user._id.toString());
    setAuthCookie(res, token);
    return res.status(201).json({ user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { identifier, email, password } = req.body;
    const loginIdentifier = (identifier || email || "").trim();
    if (!loginIdentifier || !password) return res.status(400).json({ message: "Email and password are required." });

    const query = emailPattern.test(loginIdentifier)
      ? { email: loginIdentifier.toLowerCase() }
      : { username: loginIdentifier };
    const user = await User.findOne(query).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    setAuthCookie(res, createToken(user._id.toString()));
    return res.json({ user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, (req, res) => res.json({ user: toPublicUser(req.user) }));

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(204).end();
});

export default router;
