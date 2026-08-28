# Name Tap polish round 1 handoff

Work order: `name-vibration-captions-polish-1`  
Repair commits: `37e0a62` through `d69605f`, plus this final evidence-only commit  
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

Local and live verifier screenshots are under `.factory/evidence/` in the work container. Key mobile views are referenced by `.factory/polish-1.md`.

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

Azure Static Web Apps deployment `2ec6138c-11ba-49c5-902d-444505043219` succeeded in `eastus2` on 28 August 2026.

- `/`, `/demo`, `/privacy`, and `/terms` return 200.
- `/404`, `/404/`, and `/does-not-exist` return 404 with the designed Name Tap page.
- Manifest MIME is `application/manifest+json`; the social image and 180 px Apple icon return 200 with correct image types.
- CSP, microphone Permissions-Policy, frame denial, no-sniff, and referrer policy are live.
- A cold 390 × 844 browser flow passed hero comprehension, real/demo isolation, reset, Start for real, legal routes, route focus, 44 px targets, offline demo reload, and zero console errors.
- Live Playwright axe scan found zero serious or critical issues.
- Live request audit found zero off-origin requests during the full demo flow.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 30 ms, CLS 0.
- Deployed JS SHA-256: `00f0046d2e9bf8bf5fd043c5370861ff5d65fe61c576db38bf2102cb2acebd64`.
- Deployed CSS SHA-256: `0bdd336bdc8c0daf5b07a7aff77720ea4214d4f2eef38beb156ee43cf53c6110`.
- Both deployed hashes match the local `dist/` files exactly.
- Live link crawl passed all ten internal links; `/404` is the only intentional 404.
- A final clean clone at pushed commit `d69605f` ran all 25 claim commands: 25/25 PASS.

No review finding remains open. The only execution boundary is physical Android hardware verification, which this static worker cannot perform.
