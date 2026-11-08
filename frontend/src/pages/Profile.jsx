import { useState } from "react";
import { ImagePlus, Pencil, X } from "lucide-react";
import Navbar from "../components/Navbar";
import AchievementCard from "../components/AchievementCard";
import AchievementShareModal from "../components/AchievementShareModal";
import StatCard from "../components/StatCard";
import achievements from "../data/achievements";
import coinImage from "../assets/gold-coin.png";
import seedImage from "../assets/seed.png";
import cropsImage from "../assets/crops-harvested.png";
import levelImage from "../assets/golden-star-level.png";
import goldenSproutImage from "../assets/golden-sprout_first-steps_Your-Stats.png";
import "../HeroPage.css";
import "../styles/profile.css";

const stats = [
  { label: "Coins", value: "1,250", icon: coinImage },
  { label: "Seeds", value: "24", icon: seedImage },
  { label: "Crops Harvested", value: "68", icon: cropsImage },
  { label: "Level", value: "5", icon: levelImage },
];

function Profile() {
  const xp = 420;
  const maxXp = 500;
  const xpPercentage = (xp / maxXp) * 100;
  const [username, setUsername] = useState("Jennie");
  const [profileImage, setProfileImage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draftUsername, setDraftUsername] = useState(username);
  const [draftImage, setDraftImage] = useState(profileImage);
  const [validationMessage, setValidationMessage] = useState("");
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const openDialog = () => {
    setDraftUsername(username);
    setDraftImage(profileImage);
    setValidationMessage("");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setDraftUsername(username);
    setDraftImage(profileImage);
    setValidationMessage("");
    setIsDialogOpen(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setValidationMessage("Please select a PNG, JPG, or JPEG image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setDraftImage(reader.result);
    reader.onerror = () => {
      setValidationMessage("Unable to preview that image. Please try another file.");
    };
    reader.readAsDataURL(file);
    setValidationMessage("");
  };

  const saveChanges = () => {
    const nextUsername = draftUsername.trim();

    if (!nextUsername) {
      setValidationMessage("Username cannot be empty.");
      return;
    }

    setUsername(nextUsername);
    setProfileImage(draftImage);
    setIsDialogOpen(false);
    setValidationMessage("");
  };

  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-content">
        <header className="profile-header">
          <div className="profile-avatar" aria-label={`${username} avatar`}>
            {profileImage ? (
              <img src={profileImage} alt="" />
            ) : (
              username.charAt(0).toUpperCase()
            )}
          </div>
          <div className="profile-summary">
            <h1>{username}</h1>
            <p>Level 5</p>
            <div className="xp-row">
              <div className="xp-track" aria-label={`${xp} of ${maxXp} XP`}>
                <span style={{ width: `${xpPercentage}%` }} />
              </div>
              <strong>
                {xp} / {maxXp} XP
              </strong>
            </div>
          </div>
          <button className="profile-edit-button" onClick={openDialog} type="button">
            <Pencil size={20} />
            Edit Profile
          </button>
        </header>

        <section className="profile-section stats-section">
          <h2>
            <img src={goldenSproutImage} alt="" />
            Your Stats
          </h2>
          <div className="stats-grid">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </section>

        <section className="profile-section achievements-section">
          <h2>
            <img src={seedImage} alt="" />
            Achievements
          </h2>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                onShare={setSelectedAchievement}
                {...achievement}
              />
            ))}
          </div>
        </section>
      </main>
      {selectedAchievement && (
        <AchievementShareModal
          achievement={selectedAchievement}
          level={5}
          onClose={() => setSelectedAchievement(null)}
          username={username}
        />
      )}
      {isDialogOpen && (
        <div
          className="profile-dialog-overlay"
          onClick={closeDialog}
          role="presentation"
        >
          <section
            aria-labelledby="edit-profile-title"
            aria-modal="true"
            className="profile-dialog"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Close edit profile dialog"
              className="profile-dialog-close"
              onClick={closeDialog}
              type="button"
            >
              <X size={22} />
            </button>
            <h2 id="edit-profile-title">Edit Profile</h2>
            <div className="profile-dialog-avatar">
              {draftImage ? (
                <img src={draftImage} alt="Profile preview" />
              ) : (
                draftUsername.charAt(0).toUpperCase() || "J"
              )}
            </div>
            <label className="profile-upload-button">
              <ImagePlus size={18} />
              Change Photo
              <input
                accept="image/png,image/jpeg"
                onChange={handleImageChange}
                type="file"
              />
            </label>
            <label className="profile-username-field">
              Username
              <input
                onChange={(event) => {
                  setDraftUsername(event.target.value);
                  setValidationMessage("");
                }}
                value={draftUsername}
              />
            </label>
            {validationMessage && (
              <p className="profile-dialog-error" role="alert">
                {validationMessage}
              </p>
            )}
            <div className="profile-dialog-actions">
              <button
                className="profile-dialog-cancel"
                onClick={closeDialog}
                type="button"
              >
                Cancel
              </button>
              <button
                className="hero-button hero-button-primary profile-dialog-save"
                onClick={saveChanges}
                type="button"
              >
                Save Changes
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Profile;
