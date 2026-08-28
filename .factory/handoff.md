# Name Tap adversarial review 2 handoff

Work order: `name-vibration-captions-review-2`

Reviewed commit: `8fad78a3f454a1121a40ad005f2b859560082fed`

Live URL: <https://name-vibration-captions.sociobot.in>

## Delivered

- Added `.factory/review-2.md` with a **FAIL** verdict and 13 actionable findings.
- Re-ran the cold 390×844 and 1440×1000 first-read review.
- Exercised demo entry, reset, real-data isolation, exit, offline reload, and request boundaries.
- Ran every command in `.factory/claims.json` from a clean clone; 25/25 exited successfully.
- Rechecked every prior review/polish finding against the live site, source, and tests.
- Completed the landing, demo, and README sentence inventory with word counts.
- Rechecked metadata, routes, 404 behavior, focus, links, accessibility, headers, and visual identity.
- No product source was changed.

## Blocking result

The sample result is below the initial viewport after the one-click demo action. The live support status can also say “Local captions are available” when the browser's availability API returns `unavailable`. The advertised full-screen alert is not tested at full-screen size.

## Verification

From clean clone `/tmp/name-tap-review2.vJO8Zb`:

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:e2e
```

- `npm ci`: PASS, zero vulnerabilities.
- `npm run lint`: PASS.
- `npm test`: PASS, 19/19.
- `npm run build`: PASS; JS 14.64 KB gzip and CSS 5.45 KB gzip.
- All 25 claim commands: PASS individually.
- `npm run test:e2e`: PASS, 48/48 on rerun. The first full run had one Chromium process crash before test setup; the affected claim had already passed individually.
- Factory URL verifier: PASS on `/`, `/?demo=1`, `/privacy`, and `/terms`.
- Live Playwright axe: zero serious/critical findings on audited routes.
- Live unknown route: designed page with HTTP 404.
- Live and built JS/CSS hashes match exactly.

## Remaining work

Resolve F-2-1 through F-2-13 in `.factory/review-2.md`, then repeat the full review. Physical Android speech and haptic verification remains outside this container.
