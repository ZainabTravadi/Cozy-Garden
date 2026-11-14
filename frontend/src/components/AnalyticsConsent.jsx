import { useEffect, useState } from "react";
import { analyticsConfigured, initializeAnalytics, setAnalyticsConsent } from "../services/analytics";

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState(() => {
    try { return localStorage.getItem("cozy-garden-analytics-consent"); } catch { return "denied"; }
  });
  useEffect(() => {
    const refresh = () => {
      try { setChoice(localStorage.getItem("cozy-garden-analytics-consent")); } catch { setChoice("denied"); }
      initializeAnalytics();
    };
    window.addEventListener("cozy-garden-consent-changed", refresh);
    return () => window.removeEventListener("cozy-garden-consent-changed", refresh);
  }, []);
  if (!analyticsConfigured() || choice) return null;
  return <aside className="analytics-consent" aria-label="Analytics choice"><p>May we use privacy-conscious analytics to understand how Cozy Garden is used? Analytics is optional and starts only if you agree.</p><button onClick={() => { setAnalyticsConsent(true); setChoice("granted"); }} type="button">Allow analytics</button><button onClick={() => { setAnalyticsConsent(false); setChoice("denied"); }} type="button">No thanks</button></aside>;
}
