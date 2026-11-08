import { forwardRef } from "react";
import seedImage from "../assets/seed.png";
import "./AchievementShareCard.css";

const AchievementShareCard = forwardRef(function AchievementShareCard(
  { achievement, level, username },
  ref,
) {
  return (
    <article className="achievement-share-card" ref={ref}>
      <span className="share-card-sparkle sparkle-one">✦</span>
      <span className="share-card-sparkle sparkle-two">✦</span>
      <span className="share-card-flower flower-one">✿</span>
      <span className="share-card-flower flower-two">✿</span>
      <header className="share-card-brand">
        <img src={seedImage} alt="" />
        <span>Cozy Garden</span>
      </header>
      <p className="share-card-kicker">ACHIEVEMENT UNLOCKED!</p>
      <img
        className="share-card-achievement-icon"
        src={achievement.icon}
        alt=""
      />
      <h2>{achievement.name}</h2>
      <p className="share-card-description">
        {achievement.description || achievement.requirement}
      </p>
      <div className="share-card-player">
        <span>Unlocked by {username}</span>
        <span>Level {level}</span>
      </div>
      <footer>
        <img src={seedImage} alt="" />
        <span>Cozy Garden</span>
      </footer>
    </article>
  );
});

export default AchievementShareCard;
