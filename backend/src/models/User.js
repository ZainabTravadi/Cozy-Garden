import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema(
  {
    seedId: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
      match: /^[a-zA-Z0-9_]+$/,
    },
    avatarData: {
      type: String,
      default: "",
      maxlength: 2800000,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    passwordHash: { type: String, required: true, select: false },
    level: { type: Number, min: 1, default: 1 },
    experiencePoints: { type: Number, min: 0, default: 0 },
    coins: { type: Number, min: 0, default: 500 },
    inventory: { type: [inventoryItemSchema], default: [] },
    garden: { type: [mongoose.Schema.Types.Mixed], default: [] },
    achievements: { type: [String], default: [] },
    achievementUnlockDates: { type: mongoose.Schema.Types.Mixed, default: {} },
    cropsHarvested: { type: Number, min: 0, default: 0 },
    totalCropsPlanted: { type: Number, min: 0, default: 0 },
    flowersHarvested: { type: Number, min: 0, default: 0 },
    lifetimeCoinsEarned: { type: Number, min: 0, default: 0 },
    lifetimeSeedsPurchased: { type: Number, min: 0, default: 0 },
    currentDailyStreak: { type: Number, min: 0, default: 0 },
    lastActiveDate: { type: String, default: null },
    hasSeenGardenWelcome: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.index({ experiencePoints: -1, level: -1, createdAt: 1, _id: 1 });

export default mongoose.model("User", userSchema);
