import Navbar from "../components/Navbar";
import LeaderboardRow from "../components/LeaderboardRow";
import leaderboard from "../data/leaderboard";
import trophyImage from "../assets/Golden-Trophy.png";
import "../styles/leaderboard.css";

function Leaderboard() {
  return (
    <div className="leaderboard-page">
      <Navbar />
      <main className="leaderboard-content">
        <header className="leaderboard-heading">
          <img src={trophyImage} alt="" />
          <div>
            <h1>
              Leaderboard
            </h1>
            <p>Top gardeners with the highest coins!</p>
          </div>
        </header>

        <section className="leaderboard-table" aria-label="Gardeners leaderboard">
          <div className="leaderboard-table-header" aria-hidden="true">
            <span>#</span>
            <span>Player</span>
            <span>Level</span>
            <span>Coins</span>
          </div>
          <div className="leaderboard-rows">
            {leaderboard.map((player) => (
              <LeaderboardRow key={player.rank} {...player} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Leaderboard;
