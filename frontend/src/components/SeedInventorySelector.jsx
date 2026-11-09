function SeedInventorySelector({ inventory, onSelect, selectedSeedId, seeds }) {
  const quantities = new Map(inventory.map((item) => [item.seedId, item.quantity]));
  return (
    <div className="seed-inventory-selector">
      <h3>Choose a seed</h3>
      <div className="seed-inventory-list">
        {seeds.map((seed) => {
          const quantity = quantities.get(seed.id) || 0;
          return (
            <button
              className={`seed-inventory-item ${selectedSeedId === seed.id ? "selected" : ""}`}
              disabled={quantity === 0}
              key={seed.id}
              onClick={() => onSelect(seed.id)}
              type="button"
            >
              <img alt="" src={seed.image} />
              <span>{seed.name.replace(" Seed", "")}</span>
              <strong>{quantity}</strong>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SeedInventorySelector;
