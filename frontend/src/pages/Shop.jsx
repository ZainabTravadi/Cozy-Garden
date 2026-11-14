import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SeedCard from "../components/SeedCard";
import coinImage from "../assets/gold-coin.png";
import seedImage from "../assets/seed.png";
import seedsData from "../data/seeds";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/useAuth";
import "../styles/shop.css";
import Seo from "../components/Seo";
import { trackEvent } from "../services/analytics";

function Shop() {
  const { user, updateUser } = useAuth();
  const [seeds, setSeeds] = useState(seedsData);
  const [balance, setBalance] = useState(user.coins);
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiRequest("/shop/seeds")
      .then(({ seeds: availableSeeds }) => setSeeds(availableSeeds.map((seed) => ({
        ...seed,
        image: seedsData.find((localSeed) => localSeed.id === seed.id)?.image,
      }))))
      .catch((error) => setMessage(error.message));
  }, []);

  const handleBuy = async (seed) => {
    const isFirstPurchase = (user.lifetimeSeedsPurchased || 0) === 0;
    try {
      const result = await apiRequest("/shop/purchase", {
        method: "POST",
        body: JSON.stringify({ seedId: seed.id, quantity: 1 }),
      });
      setBalance(result.user.coins);
      updateUser(result.user);
      setMessage(`${seed.name} purchased!`);
      if (isFirstPurchase) trackEvent("first_seed_purchased", { seed_id: seed.id });
      for (const achievementId of result.user.achievements || []) {
        if (!(user.achievements || []).includes(achievementId)) trackEvent("achievement_unlocked", { achievement_id: achievementId });
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="shop-page">
      <Seo title="Seed Shop" description="Browse seeds for your Cozy Garden." path="/shop" noindex />
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
