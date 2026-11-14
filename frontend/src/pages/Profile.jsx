import { useEffect, useState } from "react";
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
import { apiRequest } from "../services/api";
import { useAuth } from "../context/useAuth";
import Seo from "../components/Seo";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user: authUser, updateUser, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(authUser);
  const xp = profile.xpProgress ?? profile.experiencePoints % 100;
  const maxXp = profile.xpToNextLevel || 100;
  const xpPercentage = (xp / maxXp) * 100;
  const [username, setUsername] = useState(authUser.username ?? "");
  const [profileImage, setProfileImage] = useState(authUser.avatarData ?? "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draftUsername, setDraftUsername] = useState(authUser.username ?? "");
  const [draftImage, setDraftImage] = useState(profileImage);
  const [validationMessage, setValidationMessage] = useState("");
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    apiRequest("/player/profile").then((nextProfile) => {
      setProfile(nextProfile);
      setUsername(nextProfile.username);
      setProfileImage(nextProfile.avatarData ?? "");
      updateUser(nextProfile);
    }).catch((error) => setProfileError(error.message));
  }, [updateUser]);

  const stats = [
    { label: "Coins", value: profile.coins.toLocaleString(), icon: coinImage },
    { label: "Seeds", value: profile.totalSeeds?.toLocaleString() || "0", icon: seedImage },
    { label: "Crops Harvested", value: profile.cropsHarvested.toLocaleString(), icon: cropsImage },
    { label: "Level", value: profile.level.toString(), icon: levelImage },
  ];

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
    if (file.size > 2 * 1024 * 1024) {
      setValidationMessage("Please select an image smaller than 2 MB.");
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

  const saveChanges = async () => {
    const nextUsername = draftUsername.trim();

    if (!nextUsername) {
      setValidationMessage("Username cannot be empty.");
      return;
    }

    try {
      const result = await apiRequest("/player/profile", {
        method: "PATCH",
        body: JSON.stringify({ username: nextUsername, avatarData: draftImage }),
      });
      setProfile(result.user);
      updateUser(result.user);
      setUsername(result.user.username);
      setProfileImage(result.user.avatarData ?? "");
      setIsDialogOpen(false);
      setValidationMessage("");
    } catch (error) {
      setValidationMessage(error.message);
    }
  };

  return (
    <div className="profile-page">
      <Seo title="Your Profile" description="Your Cozy Garden player profile and progress." path="/profile" noindex />
      <Navbar />
      <main className="profile-content">
        {profileError && <p role="alert">{profileError}</p>}
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
            <p>Level {profile.level}</p>
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
                {...achievement}
                key={achievement.id}
                onShare={setSelectedAchievement}
                progress={profile.achievementProgress?.[achievement.id] || "0 / 1"}
                unlocked={profile.achievements.includes(achievement.id)}
              />
            ))}
          </div>
        </section>
        <section className="profile-section account-deletion" aria-labelledby="delete-account-title">
          <h2 id="delete-account-title">Delete Account</h2>
          <p>Permanently remove your account, garden, inventory, and progress.</p>
          <label htmlFor="delete-account-password">Confirm your password</label>
          <input id="delete-account-password" autoComplete="current-password" onChange={(event) => setDeletePassword(event.target.value)} type="password" value={deletePassword} />
          <button disabled={!deletePassword || deleting} onClick={async () => {
            if (!window.confirm("Delete your Cozy Garden account and all game progress? This cannot be undone.")) return;
            setDeleting(true);
            setDeleteMessage("");
            try { await deleteAccount(deletePassword); navigate("/", { replace: true }); }
            catch (error) { setDeleteMessage(error.message); setDeleting(false); }
          }} type="button">{deleting ? "Deleting…" : "Permanently Delete Account"}</button>
          {deleteMessage && <p role="alert">{deleteMessage}</p>}
        </section>
      </main>
      {selectedAchievement && (
        <AchievementShareModal
          achievement={selectedAchievement}
          level={profile.level}
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
