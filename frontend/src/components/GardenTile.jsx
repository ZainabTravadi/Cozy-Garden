import { Plus } from "lucide-react";
import CropGrowthTimer from "./CropGrowthTimer";
import CropGrowth from "./CropGrowth";

function GardenTile({ now, onSelect, selected, tile }) {
  const isEmpty = tile.status === "empty";
  return (
    <button
      aria-label={`Garden tile ${tile.tileId + 1}${isEmpty ? ", empty" : `, ${tile.seed?.name || tile.seedId}`}`}
      className={`garden-tile ${selected ? "selected" : ""} ${tile.status}`}
      onClick={() => onSelect(tile.tileId)}
      type="button"
    >
      {isEmpty ? (
        <Plus aria-hidden="true" className="garden-tile-plus" size={34} />
      ) : (
        <>
          <CropGrowth
            durationSeconds={tile.growthDurationSeconds}
            plantedAt={tile.plantedAt}
            seedId={tile.seedId}
            now={now}
            style={{ "--crop-animation-delay": `${(tile.tileId % 5) * 0.18}s` }}
          />
          {tile.status === "growing" && (
            <small className="garden-tile-timer">
              <CropGrowthTimer remainingSeconds={tile.remainingSeconds} />
            </small>
          )}
        </>
      )}
    </button>
  );
}

export default GardenTile;
