import coinImage from "../assets/gold-coin.png";
import "../styles/shop.css";

function SeedCard({ seed, onBuy }) {
  return (
    <article className="seed-card">
      <img className="seed-image" src={seed.image} alt="" />
      <h2 className="seed-name">{seed.name}</h2>
      <p className="seed-growth">Grows in {seed.growthTime}</p>
      <p className="seed-price">
        <img src={coinImage} alt="" />
        {seed.price}
      </p>
      <button
        className="hero-button hero-button-primary seed-buy-button"
        onClick={() => onBuy(seed)}
        type="button"
      >
        Buy
      </button>
    </article>
  );
}

export default SeedCard;
