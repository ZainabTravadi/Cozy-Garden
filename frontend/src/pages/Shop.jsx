import { useState } from "react";
import Navbar from "../components/Navbar";
import SeedCard from "../components/SeedCard";
import coinImage from "../assets/gold-coin.png";
import seedImage from "../assets/seed.png";
import seeds from "../data/seeds";
import "../styles/shop.css";

function Shop() {
  const [balance, setBalance] = useState(1250);
  const [message, setMessage] = useState("");

  const handleBuy = (seed) => {
    if (balance < seed.price) {
      setMessage("Not enough coins!");
      return;
    }

    setBalance((currentBalance) => currentBalance - seed.price);
    setMessage(`${seed.name} purchased!`);
  };

  return (
    <div className="shop-page">
      <Navbar />
      <main className="shop-content">
        <header className="shop-header">
          <div>
            <h1 className="shop-title">
              Seed Shop <img src={seedImage} alt="" />
            </h1>
            <p className="shop-subtitle">Buy seeds to grow in your garden</p>
          </div>
          <div className="coin-balance" aria-label={`${balance} coins`}>
            <img src={coinImage} alt="" />
            <span>{balance.toLocaleString()}</span>
          </div>
        </header>

        {message && (
          <p className="shop-message" role="status">
            {message}
          </p>
        )}

        <section className="seed-grid" aria-label="Available seeds">
          {seeds.map((seed) => (
            <SeedCard key={seed.id} onBuy={handleBuy} seed={seed} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default Shop;
