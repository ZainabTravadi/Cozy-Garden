# Cozy Garden launch readiness audit

Initial repository audit: 14 November 2026. Scope: checked-in frontend, API, deployment files, package manifests, README, and existing automated tests. A read-only smoke check of the referenced live Vercel and Heroku hosts was performed after implementation; no production mutations were made.

## P0 — launch blockers

- **Authenticated leaderboard disclosed more private player data than its purpose requires.** It returned every player's coin balance and full avatar data URL. Reduce the response to public ranking fields and cap the result set. (Fixed in this launch pass.)
- **Sensitive endpoints have no rate limiting.** Signup/login allow unbounded password hashing attempts; purchase and gameplay endpoints also have no request throttles. Add limits appropriate to authentication and state-changing actions. (Fixed in this launch pass.)
- **Account deletion is not implemented.** Users cannot delete their account or associated garden/progression. Add a password-confirmed self-service deletion route and UI. (Fixed in this launch pass.)
- **No documented request-size, security-header, or production abuse protections.** Set conservative JSON limits, security headers, and request throttles without changing the deployment model. (Fixed in this launch pass.)
- **Error handling could log request content.** Body parser errors flowed to a generic logger that printed the full error object, including its raw body field. Parser errors now receive safe 400/413 messages and production logs record only the error class. (Fixed and unit tested.)

## P1 — important launch requirements

- **Public page metadata is incomplete.** `index.html` only has a generic title. No descriptions, canonical tags, share metadata, sitemap, or robots rules existed. Public content is the home/how-to pages; account/game pages must stay out of search. (Fixed in this launch pass.)
- **No privacy, terms, support, analytics, or launch checklist documents/pages existed.** There is no payment functionality or analytics SDK in the repository. Add clearly qualified policy pages with owner-supplied placeholders, and keep analytics off until consent and configuration. (Fixed/documented in this launch pass.)
- **No GA4 setup existed.** Add optional consent-gated event support and instructions; do not send account identifiers or personal data. (Fixed in this launch pass.)
- **Production deployment is only partially verified.** Read-only checks confirmed the frontend and API health, but the deployed frontend lacks route fallback and SEO assets. Secret values and all production environment settings were not inspected. (Repository fixes are ready; deploy and verify.)
- **Mobile/accessibility concerns:** app navigation lacked accessible menu state/name; global focus styles and several image descriptions need review. Mobile CSS exists, but no interactive browser or viewport inspection tool was available. (Added accessible menu state, focus indicators, and account deletion feedback; full device QA remains.)
- **Database-dependent lifecycle and authorization tests are absent.** Existing tests cover progression helpers and crop timing only. Exercise endpoint concurrency and ownership against a disposable MongoDB before launch. (Manual/CI task.)
- **Image transfer sizes are high.** The production build includes several PNGs between 0.6 and 1.8 MB; the landing background/social image is about 1.8 MB. Keep the art, but optimize formats/responsive variants after confirming visual fidelity. (Needs performance follow-up.)
- **Legal ownership details and asset licenses are not established in source.** No company, support email, age policy, or licenses are evidenced. Placeholder policies and a source inventory are provided; owner/legal review required.

## P2 — post-launch improvements

- Add automated browser/device coverage and API integration tests with isolated test database.
- Add email verification and password reset if account recovery is needed; neither flow currently exists.
- Review leaderboard pagination and query/index behavior as user count grows.
- JWT logout clears the browser cookie but does not revoke a copied token before its seven-day expiry; consider per-session revocation if account security requirements call for it.
- Consider storing profile images in a dedicated media service rather than MongoDB documents as profile use grows.
- Review font hosting and third-party asset terms; current CSS fetches Google Fonts at runtime.

## Existing verified features

- React/Vite frontend, Express 5 API, MongoDB/Mongoose data model; Vercel + Heroku + Atlas deployment intent documented.
- Seven-day JWT in HTTP-only cookie; bcryptjs hashing (12 rounds); ownership scoped to authenticated user IDs.
- Seed purchase and planting use atomic MongoDB updates. Harvest checks server time and clears the crop in the same atomic update that awards server-calculated coins/XP, preventing a repeated/concurrent harvest from paying twice.
- Existing test suites: backend progression/achievement unit tests and frontend crop-stage unit tests.
- No payment flow or analytics SDK found. External Google Fonts are requested by CSS. No file-upload endpoint; profile image data URLs are limited and validated by type/size pattern.

## Production identity and deployment references

- Public frontend URL referenced in README and verified live: `https://cozy-garden-three.vercel.app/`.
- API URL found in its deployed JavaScript bundle: `https://cozy-garden-backend-41e83e1826bf.herokuapp.com/api`.
- Live checks on 14 November 2026: homepage HTTP 200, basic `<title>Cozy Garden</title>`, API `/health` HTTP 200 with MongoDB connected, `/api/shop/seeds` HTTP 200, unauthenticated `/api/auth/me` HTTP 401, and credentialed CORS allowed the Vercel origin.
- The current deployed Vercel host returns 404 for `/how-to-play`, `/privacy`, `/robots.txt`, `/sitemap.xml`, and `/social-preview.png`. This confirms the fallback and SEO assets have not reached production. The checked-in Vercel config and assets fix the repository; deployment is still required.
- Read-only responses from the current Vercel homepage and Heroku health endpoint did not include `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy`; the checked-in Vercel headers and API Helmet middleware add these after deploy.
- Backend requires `MONGODB_URI`, `JWT_SECRET`, and production `CLIENT_ORIGIN`; Heroku supplies `PORT`. Secret values were not inspected.

## Implementation verification

- Backend tests: 7 passed, 0 failed. Includes focused checks for leaderboard field minimization, safe parser errors/logging, and live Express rate limits without a database.
- Frontend tests: 6 passed, 0 failed. Existing crop growth coverage.
- Frontend lint and production build passed. Bundle: 331.41 kB JavaScript (104.55 kB gzip), 37.64 kB CSS (8.18 kB gzip); several original PNG assets exceed 1 MB.
- Dependency audit: `npm audit --omit=dev` in backend and `npm audit` in frontend both report 0 vulnerabilities after updating the frontend lockfile.
- Local Vite production preview returned HTTP 200 for `/`, `/how-to-play`, `/privacy`, `/cookies`, `/robots.txt`, `/sitemap.xml`, `/site.webmanifest`, `/cozy-garden-icon.svg`, and `/social-preview.png`.
- No disposable MongoDB integration suite, interactive browser/device test, Lighthouse run, or production mutation was performed. Production smoke checks were read-only.
