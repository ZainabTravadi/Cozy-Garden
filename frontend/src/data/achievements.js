import carrotImage from "../assets/carrot.png";
import coinCollectorImage from "../assets/coin-collector.png";
import dedicatedGardenerImage from "../assets/dedicated-gardener.png";
import firstStepsImage from "../assets/golden-sprout_first-steps_Your-Stats.png";
import flowerPowerImage from "../assets/flower-power.png";
import freshStartImage from "../assets/fresh-start.png";
import harvestHeroImage from "../assets/harvest-hero.png";
import masterGardenerImage from "../assets/master-gardener.png";
import seedHoarderImage from "../assets/seed-hoarder.png";
import trophyImage from "../assets/Golden-Trophy.png";

const achievements = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Plant your first seed",
    requirement: "Plant your first seed",
    icon: firstStepsImage,
    progress: "1 / 1",
    unlocked: true,
  },
  {
    id: "little-gardener",
    name: "Little Gardener",
    description: "Harvest 10 crops",
    requirement: "Harvest 10 crops",
    icon: carrotImage,
    progress: "7 / 10",
    unlocked: false,
  },
  {
    id: "flower-power",
    name: "Flower Power",
    description: "Grow 10 flowers",
    requirement: "Grow 10 flowers",
    icon: flowerPowerImage,
    progress: "3 / 10",
    unlocked: false,
  },
  {
    id: "coin-collector",
    name: "Coin Collector",
    description: "Earn 5,000 coins total",
    requirement: "Earn 5,000 coins total",
    icon: coinCollectorImage,
    progress: "1,250 / 5,000",
    unlocked: false,
  },
  {
    id: "seed-hoarder",
    name: "Seed Hoarder",
    description: "Purchase 10 seed packets",
    requirement: "Purchase 10 seed packets",
    icon: seedHoarderImage,
    progress: "4 / 10",
    unlocked: false,
  },
  {
    id: "fresh-start",
    name: "Fresh Start",
    description: "Play 3 consecutive days",
    requirement: "Play 3 consecutive days",
    icon: freshStartImage,
    progress: "1 / 3 days",
    unlocked: false,
  },
  {
    id: "dedicated-gardener",
    name: "Dedicated Gardener",
    description: "Play 7 consecutive days",
    requirement: "Play 7 consecutive days",
    icon: dedicatedGardenerImage,
    progress: "1 / 7 days",
    unlocked: false,
  },
  {
    id: "harvest-hero",
    name: "Harvest Hero",
    description: "Harvest 50 crops",
    requirement: "Harvest 50 crops",
    icon: harvestHeroImage,
    progress: "12 / 50",
    unlocked: false,
  },
  {
    id: "garden-champion",
    name: "Garden Champion",
    description: "Reach first place on the leaderboard",
    requirement: "Reach first place on the leaderboard",
    icon: trophyImage,
    progress: "Not achieved",
    unlocked: false,
  },
  {
    id: "master-gardener",
    name: "Master Gardener",
    description: "Unlock 9 other achievements",
    requirement: "Unlock 9 other achievements",
    icon: masterGardenerImage,
    progress: "1 / 9 achievements",
    unlocked: false,
  },
];

export default achievements;
