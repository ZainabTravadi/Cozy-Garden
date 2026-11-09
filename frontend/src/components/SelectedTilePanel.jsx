import { Trash2 } from "lucide-react";
import SeedInventorySelector from "./SeedInventorySelector";
import CropGrowthTimer from "./CropGrowthTimer";
import CropGrowth from "./CropGrowth";
import { getGrowthStage } from "../utils/cropGrowth";

function SelectedTilePanel({
  garden,
  inventory,
  onHarvest,
  onRemove,
  onPlant,
  onSeedSelect,
  selectedSeedId,
  selectedTileId,
  seeds,
  now,
  working,
}) {
  const tile = garden.find((candidate) => candidate.tileId === selectedTileId);
  const selectedSeed = seeds.find((seed) => seed.id === selectedSeedId);
  const isEmpty = tile?.status === "empty";
  const ready = tile?.status === "ready"
    || getGrowthStage(tile?.plantedAt, tile?.growthDurationSeconds, now) >= 3;
  const canRemove = tile && !isEmpty
    && getGrowthStage(tile.plantedAt, tile.growthDurationSeconds, now) >= 2;
  const canPlant = isEmpty && selectedSeed && (inventory.find((item) => item.seedId === selectedSeed.id)?.quantity || 0) > 0;

  return (
    <aside className="selected-tile-panel" aria-live="polite">
      <h2>Selected Tile</h2>
      {!tile && <p className="selected-tile-empty">Select a soil tile to get started.</p>}
      {tile && isEmpty && (
        <>
          <p className="selected-tile-status">Empty plot</p>
          <SeedInventorySelector
            inventory={inventory}
            onSelect={onSeedSelect}
            selectedSeedId={selectedSeedId}
            seeds={seeds}
          />
          <button className="hero-button hero-button-primary garden-plant-button" disabled={!canPlant || working} onClick={onPlant} type="button">
            Plant{selectedSeed ? ` ${selectedSeed.name}` : " seed"}
          </button>
        </>
      )}
      {tile && !isEmpty && (
        <>
          <CropGrowth
            className="selected-crop-image"
            durationSeconds={tile.growthDurationSeconds}
            plantedAt={tile.plantedAt}
            seedId={tile.seedId}
            now={now}
          />
          <h3>{tile.seed?.name || tile.seedId}</h3>
          <p className={ready ? "ready-status" : "selected-tile-status"}>
            {ready ? "Ready to harvest!" : <CropGrowthTimer remainingSeconds={tile.remainingSeconds} />}
          </p>
          {ready && (
            <button className="hero-button hero-button-primary garden-harvest-button" disabled={working} onClick={onHarvest} type="button">
              Harvest (+{tile.rewardCoins || tile.seed?.price * 2} coins)
            </button>
          )}
          <button className="garden-action-button remove" disabled={!canRemove || working} onClick={onRemove} type="button">
            <Trash2 size={18} /> Remove
          </button>
          <p className="selected-tile-remove-hint">
            You can remove this crop after half of its growing time has passed.
          </p>
        </>
      )}
    </aside>
  );
}

export default SelectedTilePanel;
