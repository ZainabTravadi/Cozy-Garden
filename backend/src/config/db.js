import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required.");
  }
  await mongoose.connect(uri);
  return mongoose.connection;
}

mongoose.connection.on("disconnected", () => {
  console.error("MongoDB disconnected.");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});
