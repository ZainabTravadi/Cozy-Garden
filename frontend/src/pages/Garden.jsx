import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import GardenGrid from "../components/GardenGrid";
import SelectedTilePanel from "../components/SelectedTilePanel";
import { useAuth } from "../context/useAuth";
import seeds from "../data/seeds";
import coinImage from "../assets/gold-coin.png";
import leafImage from "../assets/crops-harvested.png";
import gardenBackground from "../assets/Pixel Meadow Garden Plot.png";
import { getGarden, harvestCrop, plantSeed, removeCrop } from "../services/gardenService";
import { apiRequest } from "../services/api";
import { playHarvestSound, playPlantSound } from "../services/gameSounds";
import "../styles/garden.css";
import "../styles/profile.css";

function Garden() {
  const { user, updateUser } = useAuth();
  const [garden, setGarden] = useState([]);
  const [inventory, setInventory] = useState(user?.inventory || []);
  const [selectedTileId, setSelectedTileId] = useState(null);
  const [selectedSeedId, setSelectedSeedId] = useState(null);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [clockOffset, setClockOffset] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const decoratedSeeds = useMemo(() => seeds, []);
  const decoratedGarden = useMemo(
    () => garden.map((tile) => ({
      ...tile,
      seed: decoratedSeeds.find((seed) => seed.id === tile.seedId),
    })),
    [decoratedSeeds, garden],
  );
  const selectedTile = decoratedGarden.find((tile) => tile.tileId === selectedTileId);

  useEffect(() => {
    let active = true;
    getGarden()
      .then((result) => {
        if (!active) return;
        setGarden(result.garden);
        setInventory(result.user.inventory);
        setClockOffset(new Date(result.serverTime).getTime() - Date.now());
        setNow(Date.now());
        updateUser(result.user);
        setWelcomeOpen(!result.user.hasSeenGardenWelcome && result.garden.every((tile) => tile.status === "empty"));
      })
      .catch((requestError) => setError(requestError.message));
    return () => {
      active = false;
    };
  }, [updateUser]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const displayNow = now + clockOffset;

  const applyGardenResult = (result, playSound, clearSelection = false) => {
    setGarden(result.garden);
    setInventory(result.user.inventory);
    setClockOffset(new Date(result.serverTime).getTime() - Date.now());
    setNow(Date.now());
    updateUser(result.user);
    setSelectedSeedId(null);
    if (clearSelection) setSelectedTileId(null);
    if (playSound) playSound();
  };

  const handlePlant = async () => {
    if (selectedTileId === null || !selectedSeedId) return;
    setWorking(true);
    setError("");
    try {
      applyGardenResult(await plantSeed(selectedTileId, selectedSeedId), playPlantSound);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorking(false);
    }
  };

  const handleHarvest = async () => {
    if (selectedTileId === null) return;
    setWorking(true);
    setError("");
    try {
      applyGardenResult(await harvestCrop(selectedTileId), playHarvestSound, true);
    } catch (requestError) {
      setError(requestError.message);
      if (requestError.message.includes("not ready")) {
        try {
          const result = await getGarden();
          setGarden(result.garden);
          setInventory(result.user.inventory);
          setClockOffset(new Date(result.serverTime).getTime() - Date.now());
          setNow(Date.now());
          updateUser(result.user);
        } catch (refreshError) {
          setError(refreshError.message);
        }
      }
    } finally {
      setWorking(false);
    }
  };

  const handleRemove = async () => {
    if (selectedTileId === null) return;
    setWorking(true);
    setError("");
    try {
      applyGardenResult(await removeCrop(selectedTileId), null, true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorking(false);
    }
  };

  const dismissWelcome = async () => {
    try {
      const result = await apiRequest("/player/welcome", { method: "PATCH" });
      updateUser(result.user);
      setWelcomeOpen(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const xpToNextLevel = user?.xpToNextLevel || 100;
  const xp = user?.xpProgress || 0;
  const xpPercent = Math.min(100, (xp / xpToNextLevel) * 100);

  return (
    <div className="garden-page">
      <Navbar />
      <header className="garden-player-strip">
        <div className="garden-player-summary">
          <div className="garden-avatar" aria-label={`${user?.username} avatar`}>
            {user?.avatarData ? (
              <img alt="" src={user.avatarData} />
            ) : (
              user?.username?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="garden-player-details">
            <div className="garden-player-heading">
              <span className="garden-player-name">Hi, {user?.username}!</span>
              <span className="garden-level">Lv. {user?.level}</span>
            </div>
            <div className="garden-xp-row">
              <div className="garden-xp-track"><span style={{ width: `${xpPercent}%` }} /></div>
              <strong>XP: {xp} / {xpToNextLevel}</strong>
            </div>
          </div>
        </div>
        <div className="garden-stat-strip">
          <div className="garden-stat">
            <img src={coinImage} alt="" />
            <strong>{(user?.coins || 0).toLocaleString()}</strong>
          </div>
          <div className="garden-stat">
            <img src={leafImage} alt="" />
            <strong>{user?.cropsHarvested || 0}</strong>
          </div>
        </div>
      </header>
      <main className="garden-content">
        {error && <p className="garden-error" role="alert">{error}</p>}
        <section className="garden-board" style={{ backgroundImage: `url("${gardenBackground}")` }}>
          <GardenGrid
            garden={decoratedGarden}
            now={displayNow}
            onSelect={(tileId) => {
              setSelectedTileId(tileId);
              setSelectedSeedId(null);
            }}
            selectedTileId={selectedTileId}
          />
          <SelectedTilePanel
            garden={decoratedGarden}
            inventory={inventory}
            onHarvest={handleHarvest}
            onRemove={handleRemove}
            onPlant={handlePlant}
            onSeedSelect={setSelectedSeedId}
            selectedSeedId={selectedSeedId}
            selectedTileId={selectedTileId}
            seeds={decoratedSeeds}
            now={displayNow}
            working={working}
          />
        </section>
      </main>
      {welcomeOpen && (
        <div className="profile-dialog-overlay" role="presentation">
          <section aria-labelledby="garden-welcome-title" aria-modal="true" className="profile-dialog" role="dialog">
            <h2 id="garden-welcome-title">Ready to plant your first tree?</h2>
            <div className="profile-dialog-actions">
              <button className="profile-dialog-cancel" onClick={dismissWelcome} type="button">Maybe Later</button>
              <button className="hero-button hero-button-primary profile-dialog-save" onClick={dismissWelcome} type="button">Let&apos;s Grow</button>
            </div>
          </section>
        </div>
      )}
      {selectedTile && <span className="sr-only">Tile {selectedTile.tileId + 1} selected</span>}
    </div>
  );
}

export default Garden;
