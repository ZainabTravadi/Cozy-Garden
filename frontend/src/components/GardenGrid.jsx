import GardenTile from "./GardenTile";

function GardenGrid({ garden, now, onSelect, selectedTileId }) {
  return (
    <div className="garden-grid" aria-label="Garden plots">
      {garden.map((tile) => (
        <GardenTile
          key={tile.tileId}
          now={now}
          onSelect={onSelect}
          selected={selectedTileId === tile.tileId}
          tile={tile}
        />
      ))}
    </div>
  );
}

export default GardenGrid;
