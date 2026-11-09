const SOUND_DURATION_MS = 2000;
const activeSounds = new Map();

function playSound(name, path) {
  const activeSound = activeSounds.get(name);
  if (activeSound) {
    window.clearTimeout(activeSound.timeoutId);
    activeSound.audio.pause();
    activeSound.audio.currentTime = 0;
  }

  const audio = new Audio(path);
  audio.volume = 0.35;
  const timeoutId = window.setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
    activeSounds.delete(name);
  }, SOUND_DURATION_MS);

  activeSounds.set(name, { audio, timeoutId });
  audio.play().catch((error) => {
    window.clearTimeout(timeoutId);
    activeSounds.delete(name);
    console.warn(`Unable to play ${name} sound:`, error);
  });
}

export function playPlantSound() {
  playSound("plant", "/sounds/planting.mp3");
}

export function playHarvestSound() {
  playSound("harvest", "/sounds/harvest.mp3");
}
