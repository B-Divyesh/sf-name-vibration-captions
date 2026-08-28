# Name Tap polish round 1 handoff

Work order: `name-vibration-captions-polish-1`  
Repair commits: `37e0a62` plus the final evidence commit  
Live URL: <https://name-vibration-captions.sociobot.in>

## Delivered

- Rewrote the first screen around the job and hard-of-hearing audience.
- Added one-click `?demo=1` and `/demo` entry points with a realistic Maya/Maia match.
- Kept demo state in memory, separate from the real IndexedDB and license namespaces.
- Added the persistent demo banner, Reset demo, and Start for real controls.
- Added 25 registered claims with exactly one tagged observable test each.
- Added route-specific titles, descriptions, canonical URLs, Open Graph, Twitter metadata, and product-art social image.
- Added shared chrome, route focus/announcement, 44 px targets, a 180 px Apple icon, and a designed 404.
- Rewrote unclear UI and README language and recorded the copy audit.
- Preserved the signal-board neo-brutalist palette, typography, hard shadows, and generated art.
- Preserved the native Android local-recognition bridge and synced the production web build into Capacitor.
- Removed the dead checkout action. The required Sociobot product is not registered, and repository rules prohibit changing billing infrastructure.

Every finding is mapped in `.factory/polish-1.md`.

## Verification

- Clean clone: `npm ci` — 150 packages, 0 vulnerabilities.
- Clean clone: all 25 commands from `.factory/claims.json` — PASS individually.
- `npm test` — 19/19 PASS.
- `npm run lint` — PASS.
- `npm run build` — PASS; `dist/` includes direct demo/privacy/terms/404 entries.
- Production payload: JS 41.62 KB / 14.64 KB gzip; CSS 21.02 KB / 5.45 KB gzip; mobile hero 25.48 KB.
- `npm run test:e2e` — 48/48 PASS across desktop and 390 × 844 mobile.
- Playwright axe integration — zero serious or critical violations on the demo in both projects.
- Factory URL verifier on `/`, `/?demo=1`, `/privacy`, and `/terms` — one h1, `lang`, main, alt text, and zero console errors.
- Lighthouse mobile on local production preview — Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, TBT 130 ms, CLS 0.
- `npm run cap:sync` — PASS.
- Android Gradle and hardware tests — unavailable because this static-deploy worker has no Java, Android SDK, or physical device. Static native bridge tests pass.

Local verifier screenshots are under `.factory/evidence/local-*` in the work container. Key mobile views are referenced by `.factory/polish-1.md`.

## Run

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:e2e
npm run cap:sync
```

## Deployment and live recheck

Pending final push/deploy. This section will be replaced with deployed hashes, status codes, accessibility results, and cold screenshots before handoff.
