import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LeaderboardRow from "../components/LeaderboardRow";
import { apiRequest } from "../services/api";
import trophyImage from "../assets/Golden-Trophy.png";
import "../styles/leaderboard.css";
import Seo from "../components/Seo";
import { useAuth } from "../context/useAuth";
import { trackEvent } from "../services/analytics";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    apiRequest("/leaderboard")
      .then(({ leaderboard: rows, achievements = [] }) => {
        setLeaderboard(rows);
        for (const achievementId of achievements) {
          if (!(user.achievements || []).includes(achievementId)) trackEvent("achievement_unlocked", { achievement_id: achievementId });
        }
      })
      .catch((requestError) => setError(requestError.message));
  }, [user.achievements]);

  return (
    <div className="leaderboard-page">
      <Seo title="Leaderboard" description="See Cozy Garden player rankings." path="/leaderboard" noindex />
      <Navbar />
      <main className="leaderboard-content">
        <header className="leaderboard-heading">
          <img src={trophyImage} alt="" />
          <div>
            <h1>
              Leaderboard
            </h1>
            <p>Top gardeners with the most XP!</p>
          </div>
        </header>

        <section className="leaderboard-table" aria-label="Gardeners leaderboard">
          <div className="leaderboard-table-header" aria-hidden="true">
            <span>#</span>
            <span>Player</span>
            <span>Level</span>
            <span>XP</span>
          </div>
          <div className="leaderboard-rows">
            {error ? <p role="alert">{error}</p> : leaderboard.length === 0 ? <p>No gardeners yet.</p> : leaderboard.map((player) => (
              <LeaderboardRow
                avatar={player.username.charAt(0).toUpperCase()}
                avatarData={player.avatarData}
                avatarColor="#e7b5cf"
                crown={player.rank <= 3 ? ["gold", "silver", "bronze"][player.rank - 1] : undefined}
                key={player.rank}
                {...player}
                name={player.username}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Leaderboard;
