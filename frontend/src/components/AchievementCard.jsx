import { LockKeyhole, Share2 } from "lucide-react";

function AchievementCard({
  description,
  id,
  icon,
  name,
  progress,
  requirement,
  onShare,
  unlocked,
  unlockDate,
}) {
  return (
    <article className={`achievement-card ${unlocked ? "unlocked" : "locked"}`}>
      <div className="achievement-icon-wrap">
        <img src={icon} alt="" />
        {!unlocked && (
          <span className="achievement-lock" aria-label="Locked">
            <LockKeyhole size={15} />
          </span>
        )}
      </div>
      <h3>{name}</h3>
      <p>{description || requirement}</p>
      {unlocked ? (
        <div className="achievement-complete-row">
          <strong className="achievement-status">✓ Completed</strong>
          <button
            aria-label={`Share ${name} achievement`}
            className="achievement-share-button"
            onClick={() => onShare({ description, icon, id, name, requirement })}
            type="button"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      ) : (
        <strong className="achievement-progress">
          {progress}
        </strong>
      )}
      {unlockDate && <small>{unlockDate}</small>}
    </article>
  );
}

export default AchievementCard;
