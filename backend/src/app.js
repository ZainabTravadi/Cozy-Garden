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
app.use("/api/auth", authRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/garden", gardenRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
