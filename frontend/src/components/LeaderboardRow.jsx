import coinImage from "../assets/gold-coin.png";
import bronzeCrown from "../assets/bronze-crown.png";
import goldCrown from "../assets/gold-crown.png";
import silverCrown from "../assets/silver-crown.png";

const crownImages = {
  gold: goldCrown,
  silver: silverCrown,
  bronze: bronzeCrown,
};

function LeaderboardRow({
  avatar,
  avatarColor,
  coins,
  crown,
  currentUser = false,
  level,
  name,
  rank,
}) {
  return (
    <article className={`leaderboard-row ${currentUser ? "current-user" : ""}`}>
      <div className="leaderboard-rank">
        {crown ? (
          <img
            className="crown-image"
            src={crownImages[crown]}
            alt={`${rank} place`}
          />
        ) : (
          rank
        )}
      </div>
      <div className="leaderboard-player">
        <span className="player-avatar" style={{ backgroundColor: avatarColor }}>
          {avatar}
        </span>
        <span>{name}</span>
      </div>
      <div className="leaderboard-level">Lv. {level}</div>
      <div className="leaderboard-coins">
        <img src={coinImage} alt="" />
        <span>{coins.toLocaleString()}</span>
      </div>
    </article>
  );
}

export default LeaderboardRow;
