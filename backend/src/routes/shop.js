import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { seeds } from "../data/seeds.js";
import { toPublicUser } from "../utils/userResponse.js";
import { evaluateAchievements, recordDailyActivity } from "../services/achievementService.js";

const router = Router();

router.get("/seeds", (req, res) => res.json({ seeds }));

router.post("/purchase", requireAuth, async (req, res, next) => {
  try {
    const { seedId, quantity } = req.body;
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 100) {
      return res.status(400).json({ message: "Quantity must be a whole number between 1 and 100." });
    }
    const seed = seeds.find((candidate) => candidate.id === seedId);
    if (!seed) return res.status(400).json({ message: "Invalid seed." });

    const totalCost = seed.price * quantity;
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, coins: { $gte: totalCost } },
      [
        {
          $set: {
            coins: { $subtract: ["$coins", totalCost] },
            lifetimeSeedsPurchased: { $add: ["$lifetimeSeedsPurchased", quantity] },
            inventory: {
              $let: {
                vars: {
                  existing: {
                    $filter: {
                      input: "$inventory",
                      as: "item",
                      cond: { $eq: ["$$item.seedId", seedId] },
                    },
                  },
                },
                in: {
                  $concatArrays: [
                    {
                      $filter: {
                        input: "$inventory",
                        as: "item",
                        cond: { $ne: ["$$item.seedId", seedId] },
                      },
                    },
                    [
                      {
                        seedId,
                        quantity: {
                          $add: [
                            { $ifNull: [{ $arrayElemAt: ["$$existing.quantity", 0] }, 0] },
                            quantity,
                          ],
                        },
                      },
                    ],
                  ],
                },
              },
            },
          },
        },
      ],
      { new: true },
    );
    if (!updatedUser) return res.status(409).json({ message: "Not enough coins." });
    await recordDailyActivity(updatedUser);
    evaluateAchievements(updatedUser);
    await updatedUser.save();
    return res.json({ user: toPublicUser(updatedUser), totalCost });
  } catch (error) {
    return next(error);
  }
});

export default router;
