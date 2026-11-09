import { ArrowDown, ArrowLeft, Coins, Trophy } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import gardenBackground from "../assets/Pixel Meadow Garden Plot.png";
import seedImage from "../assets/seed.png";
import "../styles/how-to-play.css";

const growthDurations = [
  ["Carrot", "1 hour 30 minutes"],
  ["Tomato", "2 hours"],
  ["Sunflower", "4 hours"],
  ["Strawberry", "3 hours"],
  ["Pumpkin", "6 hours"],
  ["Violet Flower", "2 hours 30 minutes"],
];

const achievements = [
  ["First Steps", "Plant your first seed."],
  ["Little Gardener", "Harvest 10 crops."],
  ["Flower Power", "Harvest 10 flowers."],
  ["Coin Collector", "Earn 5,000 coins total."],
  ["Seed Hoarder", "Purchase 10 seed packets."],
  ["Fresh Start", "Play 3 consecutive days."],
  ["Dedicated Gardener", "Play 7 consecutive days."],
  ["Harvest Hero", "Harvest 50 crops."],
  ["Garden Champion", "Reach first place on the leaderboard."],
  ["Master Gardener", "Unlock 9 other achievements."],
];

function HowToPlay() {
  const navigate = useNavigate();
  const panelRef = useRef(null);

  return (
    <div className="how-to-play-page">
      <Navbar />
      <main className="how-to-play-content">
        <section
          className="how-to-play-board"
          style={{ backgroundImage: `url("${gardenBackground}")` }}
        >
          <article className="how-to-play-panel" aria-labelledby="how-to-play-title" ref={panelRef}>
            <div className="how-to-play-top-actions">
              <button
                className="how-to-play-back hero-button hero-button-secondary"
                onClick={() => navigate("/")}
                type="button"
              >
                <ArrowLeft aria-hidden="true" size={20} />
                Go Back
              </button>
              <button
                aria-label="Scroll down to read more"
                className="how-to-play-scroll-button"
                onClick={() => panelRef.current?.scrollBy({ behavior: "smooth", top: 320 })}
                type="button"
              >
                <ArrowDown aria-hidden="true" size={17} />
                Scroll
              </button>
            </div>

            <header className="how-to-play-heading">
              <img alt="" src={seedImage} />
              <div>
                <h1 id="how-to-play-title">How to Play Cozy Garden</h1>
                <p>Grow a little, harvest a lot, and become a garden champion.</p>
              </div>
            </header>

            <section>
              <h2>Welcome to Cozy Garden</h2>
              <p>
                Grow crops, harvest them for coins and XP, unlock achievements,
                and progress as a gardener.
              </p>
            </section>

            <section>
              <h2><Coins aria-hidden="true" size={21} /> Buying Seeds</h2>
              <p>
                Visit the Shop to choose from six seed varieties. Purchase seed
                packets with coins and they will be added to your inventory.
                Every new gardener starts with 500 coins.
              </p>
            </section>

            <section>
              <h2>Planting Seeds</h2>
              <ol>
                <li>Open the Garden and select an empty soil tile.</li>
                <li>Choose an owned seed from the inventory grid.</li>
                <li>Click Plant to begin growing.</li>
              </ol>
              <p>Planting consumes one seed from your inventory.</p>
            </section>

            <section>
              <h2>Growing Crops</h2>
              <p>
                Crops grow through three stages: a tiny sprout, a growing plant
                beginning to show its crop or flower, and a fully grown crop
                ready to harvest.
              </p>
              <ul className="growth-duration-list">
                {growthDurations.map(([name, duration]) => (
                  <li key={name}><strong>{name}</strong><span>{duration}</span></li>
                ))}
              </ul>
            </section>

            <section>
              <h2>Harvesting</h2>
              <p>
                Select a fully grown crop and click Harvest. Harvesting pays
                twice the seed price in coins and awards XP equal to the seed
                price. Crops cannot be harvested early; after harvesting, the
                soil tile is free again.
              </p>
            </section>

            <section>
              <h2>XP and Levels</h2>
              <p>
                Harvesting earns XP, and more expensive seeds provide more XP.
                Every 100 XP advances you one level. Your current-level progress
                is the XP earned since the last 100-point level boundary.
              </p>
            </section>

            <section>
              <h2><Trophy aria-hidden="true" size={21} /> Achievements</h2>
              <ul className="achievement-guide-list">
                {achievements.map(([name, condition]) => (
                  <li key={name}><strong>{name}</strong><span>{condition}</span></li>
                ))}
              </ul>
            </section>

            <section>
              <h2>Profile and Leaderboard</h2>
              <p>
                Your Profile shows your username, avatar, level, XP, stats, and
                achievements. The Leaderboard ranks gardeners by total XP and
                level, and shows each player&apos;s profile information.
              </p>
            </section>

            <button
              className="hero-button hero-button-primary how-to-play-bottom-back"
              onClick={() => navigate("/")}
              type="button"
            >
              <ArrowLeft aria-hidden="true" size={20} />
              Go Back to Home
            </button>
          </article>
        </section>
      </main>
    </div>
  );
}

export default HowToPlay;
