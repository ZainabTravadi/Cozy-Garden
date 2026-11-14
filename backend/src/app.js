import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import playerRoutes from "./routes/player.js";
import shopRoutes from "./routes/shop.js";
import gardenRoutes from "./routes/garden.js";
import { errorHandler, notFound } from "./middleware/errors.js";
import mongoose from "mongoose";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const app = express();
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const allowedOrigins = new Set([allowedOrigin]);
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.add("http://localhost:5173");
  allowedOrigins.add("http://127.0.0.1:5173");
}
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin is not allowed by CORS."));
  },
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "3mb" }));
app.use(cookieParser());
app.set("trust proxy", process.env.NODE_ENV === "production" ? 1 : false);
app.get(["/health", "/api/health"], (req, res) => {
  const healthy = mongoose.connection.readyState === 1;
  return res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "unavailable",
    database: healthy ? "connected" : "disconnected",
  });
});
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false, message: { message: "Too many attempts. Please try again later." } });
const signupLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: "draft-8", legacyHeaders: false, message: { message: "Too many signup attempts. Please try again later." } });
const actionLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 120, standardHeaders: "draft-8", legacyHeaders: false, message: { message: "Too many requests. Please slow down and try again." } });
const sensitiveLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: "draft-8", legacyHeaders: false, message: { message: "Too many attempts. Please try again later." } });
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", signupLimiter);
app.use("/api/player/account", sensitiveLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/shop", actionLimiter, shopRoutes);
app.use("/api/garden", actionLimiter, gardenRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
