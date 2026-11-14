# Analytics reference

## Status

Optional GA4 support is implemented in the frontend. It is disabled unless `VITE_GA_MEASUREMENT_ID` is set to a valid `G-...` measurement ID. When configured, the Google Analytics script is not requested until a player opts in. Consent is stored in local browser storage, can be denied, and can be changed from the Privacy page. Blocking or refusing analytics does not affect the game.

Events contain no username, email, account ID, password, cookie, token, or free-form text. GA4 can still receive standard technical request data once enabled; the owner must review the provider terms, retention, region, and applicable consent rules before enabling it.

## Events

| Event | When | Parameters |
|---|---|---|
| `landing_page_viewed` | Landing page rendered | none |
| `registration_started` | Signup submitted | none |
| `registration_completed` | Signup succeeds | none |
| `login_completed` | Login succeeds | none |
| `first_garden_created` | First garden is initialized during account creation | none |
| `first_seed_purchased` | First successful seed purchase | `seed_id` |
| `first_crop_planted` | First successful planting | `seed_id` |
| `crop_harvested` | Successful harvest | `reward_coins`, `reward_xp` |
| `first_crop_harvested` | First successful harvest | none |
| `achievement_unlocked` | A newly received achievement appears after a game action | `achievement_id` |
| `return_session` | A later authenticated browser session begins | none |
| `game_session_duration` | Authenticated page session exits | `duration_seconds` |

## Owner setup

1. Create a GA4 property and web data stream in the owner-controlled Google account.
2. Add its measurement ID as `VITE_GA_MEASUREMENT_ID` in the Vercel project for the intended environments, then rebuild and redeploy.
3. Test with consent denied and granted, and confirm events in GA4 DebugView. This repository has no production credentials, so property setup and collection are not verified.
4. If analytics is not wanted, leave the variable unset; no banner or third-party analytics request is shown.
