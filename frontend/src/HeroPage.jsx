import Navbar from "./components/Navbar";
import meadowBackground from "./assets/Pixel Countryside Cottage Meadow.png";
import seedImage from "./assets/seed.png";
import { Gamepad2, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./HeroPage.css";

function HeroPage() {
  const navigate = useNavigate();

  return (
    <div
      className="hero-page"
      style={{ backgroundImage: `url("${meadowBackground}")` }}
    >
      <Navbar />
      <main className="hero-content">
        <div className="hero-copy">
          <h1 className="hero-title">
            Cozy Garden <img src={seedImage} alt="" />
          </h1>
          <p className="hero-tagline">
            Build your own garden, grow plants and compete with friends!
          </p>
        </div>

        <div className="hero-actions">
          <button
            className="hero-button hero-button-primary"
            onClick={() => navigate("/login")}
            type="button"
          >
            <Gamepad2 aria-hidden="true" size={26} />
            Play Now
          </button>
          <button
            className="hero-button hero-button-secondary"
            onClick={() => navigate("/how-to-play")}
            type="button"
          >
            <Info aria-hidden="true" size={26} />
            How to Play
          </button>
        </div>
      </main>
    </div>
  );
}

export default HeroPage;
