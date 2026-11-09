import carrotStage1 from "../assets/carrot-stage-1.png";
import carrotStage2 from "../assets/carrot-stage-2.png";
import carrotStage3 from "../assets/carrot-stage-3.png";
import tomatoStage1 from "../assets/tomato-stage-1.png";
import tomatoStage2 from "../assets/tomato-stage-2.png";
import tomatoStage3 from "../assets/tomato-stage-3.png";
import sunflowerStage1 from "../assets/sunflower-stage-1.png";
import sunflowerStage2 from "../assets/sunflower-stage-2.png";
import sunflowerStage3 from "../assets/sunflower-stage-3.png";
import strawberryStage1 from "../assets/strawberry-stage-1.png";
import strawberryStage2 from "../assets/strawberry-stage-2.png";
import strawberryStage3 from "../assets/strawberry-stage-3.png";
import pumpkinStage1 from "../assets/pumpkin-stage-1.png";
import pumpkinStage2 from "../assets/pumpkin-stage-2.png";
import pumpkinStage3 from "../assets/pumpkin-stage-3.png";
import violetFlowerStage1 from "../assets/purple-flower-stage-1.png";
import violetFlowerStage2 from "../assets/purple-flower-stage-2.png";
import violetFlowerStage3 from "../assets/purple-flower-stage-3.png";
import { getGrowthStage } from "../utils/cropGrowth";

const cropStageImages = {
  carrot: [carrotStage1, carrotStage2, carrotStage3],
  tomato: [tomatoStage1, tomatoStage2, tomatoStage3],
  sunflower: [sunflowerStage1, sunflowerStage2, sunflowerStage3],
  strawberry: [strawberryStage1, strawberryStage2, strawberryStage3],
  pumpkin: [pumpkinStage1, pumpkinStage2, pumpkinStage3],
  "violet-flower": [violetFlowerStage1, violetFlowerStage2, violetFlowerStage3],
};

function CropGrowth({
  className = "",
  durationSeconds,
  plantedAt,
  seedId,
  now,
  style,
}) {
  const stage = getGrowthStage(plantedAt, durationSeconds, now);
  const image = cropStageImages[seedId]?.[stage - 1];

  if (!image) return null;

  return (
    <img
      alt=""
      className={`garden-crop-image stage-${stage} ${stage === 3 ? "ready" : ""} ${className}`}
      style={style}
      src={image}
    />
  );
}

export default CropGrowth;
