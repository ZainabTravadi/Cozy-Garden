# Cozy Garden launch checklist

## Verified in repository

- [x] Public landing and How to Play pages, gameplay routes, existing assets, and sound effects retained.
- [x] API security headers, login/signup/action rate limits, bounded JSON requests, and leaderboard data minimization added.
- [x] Purchase, plant, and harvest reward logic remains server-side and uses atomic updates.
- [x] Self-service password-confirmed account deletion added.
- [x] Public sitemap, robots rules, route metadata, social tags, Vercel SPA fallback, and icons added.
- [x] Optional consent-gated GA4 integration and event reference added.
- [x] Existing unit test/lint/build suites executed (results in the final handoff).

## Owner actions before launch

- [ ] Replace all `[OWNER: ...]` placeholders in Privacy, Terms, and Contact pages; obtain legal review.
- [ ] Decide age eligibility and safeguards; document support and security reporting contacts.
- [ ] Verify Vercel domain and production URL. If the canonical domain changes, update `SITE_URL`, sitemap, robots, and static metadata together.
- [ ] Set backend `MONGODB_URI`, strong unique `JWT_SECRET`, exact `CLIENT_ORIGIN`, and `NODE_ENV=production` in Heroku.
- [ ] Set frontend `VITE_API_URL` in Vercel; optionally set `VITE_GA_MEASUREMENT_ID` only after GA4 and consent review.
- [ ] Verify Heroku `/health`, browser cookie flags, CORS, signup/login/logout, account deletion, and all gameplay actions against production without using real user data.
- [ ] Run a disposable-database integration/concurrency test for ownership, purchases, planting, harvest replay, and simultaneous requests.
- [ ] Review font, sprite, background, favicon, and sound licenses and record attribution/ownership.
- [ ] Verify `https://<domain>/robots.txt`, `/sitemap.xml`, `/social-preview.png`, and client-side route refresh after deployment.
- [ ] Verify metadata and social preview in crawler/share debuggers. Submit sitemap and verify the domain in Google Search Console and Bing Webmaster Tools if desired.
- [ ] Conduct mobile browser, keyboard, screen-reader, and contrast review on supported devices.
- [ ] If GA4 is enabled, verify consent behavior and events in DebugView and configure retention/access in the owner account.

## Launch decision

The repository changes alone do not verify production health, owner policy details, asset licensing, device QA, or legal suitability. Do not treat this checklist as a production certification.
