import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import {
  DEFAULT_GROWTH_SECONDS,
  createEmptyGarden,
  getSeed,
  normalizeGarden,
  serializeGarden,
} from "../utils/garden.js";
import { toPublicUser } from "../utils/userResponse.js";
import { evaluateAchievements, recordDailyActivity } from "../services/achievementService.js";
import { getHarvestRewards, getLevelFromXp } from "../services/progressionService.js";

const router = Router();

function gardenResponse(user) {
  const now = Date.now();
  return {
    garden: serializeGarden(user.garden, now),
    serverTime: new Date(now).toISOString(),
    user: {
      ...toPublicUser(user),
      garden: normalizeGarden(user.garden),
    },
  };
}

router.get("/", requireAuth, async (req, res, next) => {
  try {
    let user = req.user;
    if (!Array.isArray(user.garden) || user.garden.length !== 16) {
      user = await User.findByIdAndUpdate(
        user._id,
        { $set: { garden: createEmptyGarden() } },
        { new: true },
      );
    }
    return res.json(gardenResponse(user));
  } catch (error) {
    return next(error);
  }
});

router.post("/plant", requireAuth, async (req, res, next) => {
  try {
    const tileId = Number(req.body.tileId);
    const { seedId } = req.body;
    const seed = getSeed(seedId);
    if (!Number.isInteger(tileId) || tileId < 0 || tileId > 15 || !seed) {
      return res.status(400).json({ message: "Invalid garden tile or seed." });
    }

    const plantedAt = new Date();
    const user = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        inventory: { $elemMatch: { seedId, quantity: { $gte: 1 } } },
        garden: { $elemMatch: { tileId, seedId: null } },
      },
      {
        $inc: {
          "inventory.$[item].quantity": -1,
          totalCropsPlanted: 1,
        },
        $set: {
          "garden.$[tile].seedId": seedId,
          "garden.$[tile].plantedAt": plantedAt,
          "garden.$[tile].growthDurationSeconds": DEFAULT_GROWTH_SECONDS[seedId],
          "garden.$[tile].rewardCoins": seed.price * 2,
          "garden.$[tile].rewardXp": seed.price,
        },
      },
      {
        arrayFilters: [
          { "item.seedId": seedId, "item.quantity": { $gte: 1 } },
          { "tile.tileId": tileId, "tile.seedId": null },
        ],
        new: true,
      },
    );
    if (!user) {
      return res.status(409).json({ message: "That tile is occupied or you do not own this seed." });
    }
    await recordDailyActivity(user);
    evaluateAchievements(user);
    await user.save();
    return res.status(201).json(gardenResponse(user));
  } catch (error) {
    return next(error);
  }
});

router.post("/harvest", requireAuth, async (req, res, next) => {
  try {
    const tileId = Number(req.body.tileId);
    if (!Number.isInteger(tileId) || tileId < 0 || tileId > 15) {
      return res.status(400).json({ message: "Invalid garden tile." });
    }

    const currentTile = normalizeGarden(req.user.garden)[tileId];
    const seed = currentTile?.seedId ? getSeed(currentTile.seedId) : null;
    if (!seed || !currentTile.plantedAt) {
      return res.status(409).json({ message: "That tile is not ready to harvest." });
    }
    const readyAt = new Date(currentTile.plantedAt).getTime() + currentTile.growthDurationSeconds * 1000;
    if (Date.now() < readyAt) {
      return res.status(409).json({ message: "That crop is still growing." });
    }

    const rewards = getHarvestRewards(seed);
    const rewardCoins = currentTile.rewardCoins || rewards.rewardCoins;
    const rewardXp = currentTile.rewardXp || rewards.rewardXp;
    const user = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        garden: {
          $elemMatch: {
            tileId,
            seedId: seed.id,
            plantedAt: currentTile.plantedAt,
          },
        },
      },
      [
        {
          $set: {
            coins: { $add: ["$coins", rewardCoins] },
            experiencePoints: { $add: ["$experiencePoints", rewardXp] },
            level: { $add: [1, { $floor: { $divide: [{ $add: ["$experiencePoints", rewardXp] }, 100] } }] },
            lifetimeCoinsEarned: { $add: ["$lifetimeCoinsEarned", rewardCoins] },
            cropsHarvested: { $add: ["$cropsHarvested", 1] },
            flowersHarvested: {
              $add: [
                "$flowersHarvested",
                ["sunflower", "violet-flower"].includes(seed.id) ? 1 : 0,
              ],
            },
            garden: {
              $map: {
                input: "$garden",
                as: "tile",
                in: {
                  $cond: [
                    { $eq: ["$$tile.tileId", tileId] },
                    {
                      tileId,
                      seedId: null,
                      plantedAt: null,
                      growthDurationSeconds: null,
                      rewardCoins: null,
                      rewardXp: null,
                    },
                    "$$tile",
                  ],
                },
              },
            },
          },
        },
      ],
      { new: true },
    );
    if (!user) {
      return res.status(409).json({ message: "That crop is no longer available to harvest." });
    }
    await recordDailyActivity(user);
    evaluateAchievements(user);
    await user.save();
    return res.json({ ...gardenResponse(user), rewardCoins, rewardXp });
  } catch (error) {
    return next(error);
  }
});

router.post("/remove", requireAuth, async (req, res, next) => {
  try {
    const tileId = Number(req.body.tileId);
    if (!Number.isInteger(tileId) || tileId < 0 || tileId > 15) {
      return res.status(400).json({ message: "Invalid garden tile." });
    }

    const currentTile = normalizeGarden(req.user.garden)[tileId];
    if (!currentTile?.seedId || !currentTile.plantedAt) {
      return res.status(409).json({ message: "That tile does not contain a crop." });
    }

    const readyToRemoveAt = new Date(currentTile.plantedAt).getTime()
      + currentTile.growthDurationSeconds * 500;
    if (Date.now() < readyToRemoveAt) {
      return res.status(409).json({ message: "Stage 1 crops cannot be removed." });
    }

    const user = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        garden: {
          $elemMatch: {
            tileId,
            seedId: currentTile.seedId,
            plantedAt: currentTile.plantedAt,
          },
        },
      },
      {
        $set: {
          "garden.$[tile].seedId": null,
          "garden.$[tile].plantedAt": null,
          "garden.$[tile].growthDurationSeconds": null,
          "garden.$[tile].rewardCoins": null,
          "garden.$[tile].rewardXp": null,
        },
      },
      {
        arrayFilters: [{ "tile.tileId": tileId, "tile.seedId": currentTile.seedId }],
        new: true,
      },
    );
    if (!user) {
      return res.status(409).json({ message: "That crop is no longer available to remove." });
    }

    return res.json(gardenResponse(user));
  } catch (error) {
    return next(error);
  }
});

export default router;
