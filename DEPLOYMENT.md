# Cozy Garden deployment

## Current deployment references

- Frontend: `https://cozy-garden-three.vercel.app/`
- API: `https://cozy-garden-backend-41e83e1826bf.herokuapp.com/api`
- These URLs were read from the README and deployed JavaScript bundle. On 14 November 2026, the frontend returned 404 for nested pages and new SEO files; the API health endpoint reported MongoDB connected. Deploy the checked-in frontend configuration before expecting those files and refresh routes to work live.

## Required environment variables

### Heroku backend

- `NODE_ENV=production`
- `MONGODB_URI`: MongoDB Atlas URI with the database name
- `JWT_SECRET`: long random secret; never reuse a password
- `CLIENT_ORIGIN`: exact deployed Vercel origin, such as `https://cozy-garden.example.vercel.app`
- `PORT`: leave unset unless Heroku supplies it

### Vercel frontend

- `VITE_API_URL`: deployed Heroku API URL including `/api`, such as `https://cozy-garden-api.example.com/api`
- `VITE_GA_MEASUREMENT_ID` (optional): GA4 web stream ID (`G-...`). Leave unset to keep analytics and the consent prompt disabled.

Only variables prefixed with `VITE_` are exposed to browser code. Do not put backend secrets in Vercel.

## MongoDB Atlas

1. Create an Atlas project and cluster.
2. Create a database user with a strong generated password.
3. Add the Heroku application’s outbound network access to the Atlas IP access list. For a first deployment, `0.0.0.0/0` works but is less restrictive; prefer a restricted allowlist when your hosting plan supports stable egress IPs.
4. Choose **Connect > Drivers**, copy the URI, replace the password placeholder, and include a database name such as `cozy-garden`.
5. Set the complete URI as Heroku’s `MONGODB_URI` config var.

## Heroku backend

1. Create a Heroku app and connect this repository, or deploy it with the Heroku CLI from the repository root.
2. Keep the app root at the repository root. The root `Procfile` starts `backend/src/server.js`, and the root postbuild script installs backend production dependencies.
3. Set the backend config vars listed above. Set `CLIENT_ORIGIN` only to the exact Vercel origin, without a trailing slash.
4. Deploy the repository.
5. Inspect startup logs with `heroku logs --tail --app <app-name>`.
6. Verify `https://<app-name>.herokuapp.com/health` returns HTTP 200 and `"database":"connected"`.

The server connects to MongoDB before listening, exits on startup failure, and closes the database connection during `SIGTERM`.

## Vercel frontend

1. Import the same repository into Vercel.
2. Set the project root directory to `frontend`.
3. Use `npm run build` as the build command and `dist` as the output directory.
4. Set `VITE_API_URL` to the Heroku URL ending in `/api`.
5. Optionally set `VITE_GA_MEASUREMENT_ID` after setting up GA4 and reviewing analytics consent and privacy details.
6. Deploy. `frontend/vercel.json` rewrites client-side routes to `index.html` and adds basic browser security headers.

## Connect and smoke-test both deployments

1. Copy the final Vercel origin into Heroku’s `CLIENT_ORIGIN` and redeploy or restart the backend.
2. Confirm browser requests include credentials and that login sets an HTTP-only, `Secure`, `SameSite=None` cookie in production.
3. Test registration, login, refresh persistence, buying seeds, planting, crop growth, harvesting, rewards, achievements, profile, leaderboard, logout, and mobile layouts.

### Troubleshooting

- **CORS errors:** verify `CLIENT_ORIGIN` exactly matches the Vercel origin and `VITE_API_URL` points to Heroku.
- **Cookie not saved:** use HTTPS, keep `NODE_ENV=production`, and confirm the request is credentialed.
- **401 responses:** check the browser cookie, the JWT secret, and that the frontend is calling the same backend origin.
- **MongoDB failures:** verify the URI, database user password, database name, and Atlas network access list.
- **Vercel refresh 404:** confirm the frontend root is `frontend` and `vercel.json` is present.
- **Missing images or audio:** verify the Vite build completed and inspect the deployed asset URLs under `/assets` and `/sounds`.
- **Heroku crashes:** inspect `heroku logs --tail`; startup failures are usually missing config vars or unavailable MongoDB.
