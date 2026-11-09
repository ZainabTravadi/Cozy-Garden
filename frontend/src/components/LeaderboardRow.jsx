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
  avatarData,
  avatarColor,
  crown,
  currentUser = false,
  experiencePoints,
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
          {avatarData ? <img alt="" src={avatarData} /> : avatar}
        </span>
        <span>{name}</span>
      </div>
      <div className="leaderboard-level">Lv. {level}</div>
      <div className="leaderboard-xp">
        <span>{experiencePoints.toLocaleString()} XP</span>
      </div>
    </article>
  );
}

export default LeaderboardRow;
