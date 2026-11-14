# Cozy Garden backend

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` and a private `JWT_SECRET`.
3. Run `npm install`.
4. Start the API with `npm run dev` (port 5000 by default).
5. Start the frontend separately with `cd ../frontend && npm install && npm run dev`.

The server waits for MongoDB before accepting requests. `GET /api/health` is available for readiness checks.

## API

- `POST /api/auth/signup` creates a user with 500 coins and empty player data.
- `POST /api/auth/login` accepts `identifier` (username or email) and `password`.
- `GET /api/auth/me` returns the authenticated user.
- `POST /api/auth/logout` clears the HTTP-only auth cookie.
- `GET /api/player/profile` returns current player statistics and inventory.
- `PATCH /api/player/profile` updates the username and persists a PNG/JPEG avatar (sent as a validated data URL, maximum 2 MB).
- `PATCH /api/player/welcome` persists first-garden-dialog dismissal.
- `DELETE /api/player/account` deletes the authenticated account after password confirmation.
- `GET /api/garden` returns the authenticated user's 16 garden tiles with server-time growth status.
- `POST /api/garden/plant` accepts `tileId` and `seedId`, atomically consuming one owned seed.
- `POST /api/garden/harvest` accepts `tileId`, verifies server-side maturity, and awards configured coins and XP.
- `GET /api/shop/seeds` returns the trusted seed catalogue.
- `POST /api/shop/purchase` accepts `seedId` and a positive integer `quantity`.
- `GET /api/leaderboard` returns up to 100 authenticated users ranked by XP, level, and stable creation order. Entries omit email, coin balance, and avatar data.

Passwords are stored as bcrypt hashes. Authentication uses an HTTP-only cookie; login/signup and game actions are rate limited. New users receive 16 empty garden tiles; existing users with legacy empty garden arrays are normalized when they first load the garden. Rate limits currently use per-process memory.
