import { useEffect, useState } from "react";

function formatRemaining(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return hours > 0
    ? `${hours}h ${minutes}m`
    : `${minutes}m ${remainingSeconds}s`;
}

function CropGrowthTimer({ remainingSeconds }) {
  const [elapsed, setElapsed] = useState(0);
  const seconds = Math.max(0, remainingSeconds - elapsed);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  return <span>{seconds > 0 ? `Grows in ${formatRemaining(seconds)}` : "Ready to harvest!"}</span>;
}

export default CropGrowthTimer;
