import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = Number(process.env.PORT || 5000);

try {
  console.log(`Starting Cozy Garden API in ${process.env.NODE_ENV || "development"} mode.`);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer.");
  }
  if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) {
    throw new Error("JWT_SECRET and MONGODB_URI are required.");
  }
  if (process.env.NODE_ENV === "production" && !process.env.CLIENT_ORIGIN) {
    throw new Error("CLIENT_ORIGIN is required in production.");
  }

  console.log("Connecting to MongoDB.");
  await connectDatabase();
  console.log("MongoDB connection established.");
  const server = app.listen(port, () => {
    console.log(`Cozy Garden API listening on port ${port}.`);
  });

  const shutdown = async (signal) => {
    console.log(`Received ${signal}; shutting down.`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };

  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown startup error.";
  console.error(`Unable to start Cozy Garden API: ${message}`);
  process.exit(1);
}
