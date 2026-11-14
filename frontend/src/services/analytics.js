const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const CONSENT_KEY = "cozy-garden-analytics-consent";
let initialized = false;

function hasConsent() {
  try { return localStorage.getItem(CONSENT_KEY) === "granted"; } catch { return false; }
}

export function setAnalyticsConsent(granted) {
  try { localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied"); } catch { return; }
  window.dispatchEvent(new Event("cozy-garden-consent-changed"));
  if (granted) initializeAnalytics();
}

export function initializeAnalytics() {
  if (!MEASUREMENT_ID || !/^G-[A-Z0-9]+$/.test(MEASUREMENT_ID) || !hasConsent() || initialized) return;
  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false, anonymize_ip: true });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function trackEvent(name, parameters = {}) {
  initializeAnalytics();
  if (!window.gtag || !hasConsent()) return;
  window.gtag("event", name, parameters);
}

export function analyticsConfigured() {
  return Boolean(MEASUREMENT_ID && /^G-[A-Z0-9]+$/.test(MEASUREMENT_ID));
}

export function getAnalyticsConsent() {
  return hasConsent();
}
