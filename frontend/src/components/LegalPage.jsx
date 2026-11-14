import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Seo from "./Seo";
import "../styles/legal.css";
import { getAnalyticsConsent, setAnalyticsConsent } from "../services/analytics";

const pages = {
  privacy: {
    title: "Privacy Policy",
    path: "/privacy",
    description: "Learn what Cozy Garden stores, why it is used, and how to request account deletion.",
    content: <>
      <p><strong>Owner review required before launch.</strong> Replace the support contact placeholder with an address controlled by the service owner. This draft describes only behavior found in the current repository.</p>
      <h2>Information stored</h2><p>When you create an account, Cozy Garden stores your username, email address, password hash, profile image if supplied, garden, seed inventory, coins, experience, achievements, and activity dates in MongoDB. Passwords are hashed with bcrypt and are not returned by the API.</p>
      <h2>Cookies and analytics</h2><p>Authentication uses a seven-day HTTP-only cookie. Optional Google Analytics is disabled unless a measurement ID is configured and you opt in. The analytics preference is stored in this browser. No analytics event includes email, username, password, token, or account ID.</p>
      <h2>Service providers</h2><p>The documented deployment uses Vercel, Heroku, and MongoDB Atlas. The interface also requests fonts from Google Fonts. The service owner should verify current provider terms, locations, retention, and applicable transfer requirements.</p>
      <h2>Retention and deletion</h2><p>You can delete your account from your profile after confirming your password. This removes the user document and its game data from the application database. Backups and provider logs may persist according to their retention settings; the owner must document those periods.</p>
      <h2>Children and contact</h2><p>The repository does not state an intended age group or provide age safeguards. The owner must decide whether the service is intended for children and obtain legal review before launch. Privacy questions: <strong>[OWNER: add support email]</strong>.</p>
    </>,
  },
  terms: {
    title: "Terms of Service",
    path: "/terms",
    description: "Read the draft terms for using Cozy Garden. Owner and legal review are required before launch.",
    content: <>
      <p><strong>Draft for owner and legal review.</strong> These terms are not a substitute for advice from a qualified lawyer. Service owner and jurisdiction details must be supplied before publication.</p>
      <h2>The service</h2><p>Cozy Garden is a browser based pixel-art gardening game. The checked-in application has no payment, subscription, advertising, or purchase functionality.</p>
      <h2>Accounts</h2><p>Keep your sign-in credentials secure and use the account deletion control in your profile when you want to remove your account. The service owner must add accurate rules for eligibility, suspension, availability, and governing law.</p>
      <h2>Owner details</h2><p>Service operator: <strong>[OWNER: legal name or operator identity]</strong>. Contact: <strong>[OWNER: support email]</strong>. Applicable jurisdiction: <strong>[OWNER: jurisdiction]</strong>.</p>
    </>,
  },
  contact: {
    title: "Contact and Support",
    path: "/contact",
    description: "Find support and account help for Cozy Garden.",
    content: <><p>For account help, privacy requests, accessibility barriers, or bug reports, contact <strong>[OWNER: add support email]</strong>. The service owner must replace this placeholder before public launch.</p><p>To delete your account, open your Profile and use the account deletion section. If you cannot sign in, contact the owner at the address above.</p></>,
  },
  security: {
    title: "Security",
    path: "/security",
    description: "Learn about Cozy Garden's current account safeguards and how to report a security issue.",
    content: <>
      <p>Cozy Garden uses password hashing, HTTP-only authentication cookies, server-validated game actions, per-account data filters, and request limits for authentication and sensitive actions.</p>
      <h2>Report a security issue</h2><p>Please do not post exploit details or account data publicly. Send a report to <strong>[OWNER: add a security contact email]</strong>. The owner must configure and monitor this address before launch.</p>
      <h2>Operational limits</h2><p>Request limits currently use an in-memory store and apply per backend process. Production deployment configuration and monitoring must be reviewed by the service owner.</p>
    </>,
  },
  cookies: {
    title: "Cookie Policy",
    path: "/cookies",
    description: "Learn about Cozy Garden's sign-in cookie and optional analytics cookies.",
    content: <><p>Cozy Garden uses an HTTP-only authentication cookie to keep you signed in. It expires after seven days. In production it is marked Secure and SameSite=None for the separate frontend and API hosts.</p><p>Optional GA4 may set analytics cookies only after you opt in, and only when the owner configures a measurement ID. You can change your analytics choice on the <Link to="/privacy">Privacy page</Link>. Without a configured measurement ID, the game does not show the analytics prompt or load the analytics script.</p><p>The service owner should review this description against the final hosting domains and applicable cookie rules.</p></>,
  },
};

export default function LegalPage({ page }) {
  const data = pages[page];
  return <div className="legal-page"><Seo title={data.title} description={data.description} path={data.path} /><Navbar /><main className="legal-content"><h1>{data.title}</h1>{data.content}{page === "privacy" && <p><button className="consent-manage" onClick={() => setAnalyticsConsent(!getAnalyticsConsent())} type="button">Manage analytics consent</button></p>}<p className="legal-updated">Draft reviewed against repository behavior on 14 November 2026.</p><Link to="/">Return to Cozy Garden</Link></main></div>;
}
