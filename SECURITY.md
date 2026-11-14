# Security

## Reporting a vulnerability

Please do not publish exploit details or account data in a public issue. Contact **[OWNER: add a security contact email]** with a description and reproduction steps. The owner must replace this placeholder before launch; no monitored reporting address is configured in this repository.

## Current safeguards

- Passwords use bcryptjs hashing with 12 rounds and are excluded from ordinary model reads and public API responses.
- Authentication uses a seven-day JWT in a secure, HTTP-only cookie in production. Authentication and sensitive actions have IP-based rate limits.
- Current limits are 10 login attempts per 15 minutes per IP, 5 signups per hour per IP, 5 account deletion attempts per 15 minutes per IP, and 120 shop/garden requests per 15 minutes per IP.
- Helmet security headers, exact-origin credentialed CORS, bounded JSON body parsing, server-side seed catalogs and reward calculations, and per-user database filters are enabled.
- Purchases, planting, and harvesting use atomic MongoDB updates. A harvest consumes the matching planted crop in the same update that awards its server-calculated reward.
- Profile image input is limited to PNG/JPEG data URLs and size; React escapes displayed text.

## Operations and limits

Configure `JWT_SECRET`, `MONGODB_URI`, and exact `CLIENT_ORIGIN` only in the backend secret store. Set `VITE_API_URL` only in the frontend host. Never put backend secrets in `VITE_*` variables. Do not commit `.env` files.

The current rate limiter uses an in-memory store, so counts are per process and reset on restart. If the backend runs multiple instances, configure a shared rate-limit store before relying on a global limit. Production services and dependency alerts have not been independently inspected. Reported package audit status is in the launch report.
