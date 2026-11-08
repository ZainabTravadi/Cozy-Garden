import { useRef, useState } from "react";
import { Download, Share2, X } from "lucide-react";
import { toBlob } from "html-to-image";
import AchievementShareCard from "./AchievementShareCard";

function AchievementShareModal({ achievement, level, onClose, username }) {
  const cardRef = useRef(null);
  const [message, setMessage] = useState("");

  const createCardBlob = async () => {
    if (!cardRef.current) {
      throw new Error("Achievement card is not ready.");
    }

    const blob = await toBlob(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
    });

    if (!blob) {
      throw new Error("Unable to create the achievement image.");
    }

    return blob;
  };

  const downloadCard = async () => {
    try {
      const blob = await createCardBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `cozy-garden-${achievement.id}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Achievement card downloaded.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const shareAchievement = async () => {
    const text = `${achievement.name} unlocked in Cozy Garden by ${username}!`;

    try {
      const blob = await createCardBlob();
      const file = new File([blob], `cozy-garden-${achievement.id}.png`, {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${achievement.name} - Cozy Garden`,
          text,
        });
        setMessage("Achievement shared.");
        return;
      }

      if (navigator.share) {
        await navigator.share({ title: "Cozy Garden Achievement", text });
        setMessage("Achievement shared.");
        return;
      }

      if (!navigator.clipboard) {
        throw new Error("Sharing is not supported in this browser.");
      }

      await navigator.clipboard.writeText(text);
      setMessage("Achievement text copied to your clipboard.");
    } catch (error) {
      if (error.name !== "AbortError") {
        setMessage(error.message);
      }
    }
  };

  return (
    <div
      className="achievement-share-overlay"
      onClick={onClose}
      role="presentation"
    >
      <section
        aria-labelledby="share-achievement-title"
        aria-modal="true"
        className="achievement-share-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button
          aria-label="Close achievement sharing dialog"
          className="achievement-share-close"
          onClick={onClose}
          type="button"
        >
          <X size={22} />
        </button>
        <h2 id="share-achievement-title">Share Achievement</h2>
        <AchievementShareCard
          achievement={achievement}
          level={level}
          ref={cardRef}
          username={username}
        />
        {message && (
          <p className="achievement-share-message" role="status">
            {message}
          </p>
        )}
        <div className="achievement-share-actions">
          <button
            className="hero-button hero-button-primary"
            onClick={shareAchievement}
            type="button"
          >
            <Share2 size={19} />
            Share Achievement
          </button>
          <button
            className="achievement-download-button"
            onClick={downloadCard}
            type="button"
          >
            <Download size={19} />
            Download Card
          </button>
        </div>
      </section>
    </div>
  );
}

export default AchievementShareModal;
