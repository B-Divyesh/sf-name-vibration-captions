# Name Tap adversarial review 1 handoff — FAIL

Work order: `name-vibration-captions-review-1`

Reviewed 28 August 2026 against repository base `902208fe1a57b6eee687e9c7e4fe040c94b18aca` and <https://name-vibration-captions.sociobot.in> at 390 × 844 and 1440 × 1000. No product code was changed. The complete evidence, copy inventory, findings, and fixes are in `.factory/review-1.md`.

## Outcome

The verdict is **FAIL**. Primary blockers:

- The first screen never identifies hard-of-hearing people as the audience.
- There is no one-click sample demo. `/demo` is the real app and reads the real `name-tap` IndexedDB namespace.
- `.factory/claims.json` and `@claim:` tests are absent; every public claim is unlisted and untested under the required contract.
- **Buy lifetime unlock** returns HTTP 404.
- Unknown paths return the home page with HTTP 200 instead of a designed 404.

Additional findings cover route metadata, inconsistent header/footer, route-change focus, undersized touch targets, the Apple icon, jargon, inconsistent terms, long README sentences, and vague actions/headings.

## Verification performed

- `npm ci` — pass, 150 packages, 0 vulnerabilities.
- `npm test` — pass, 15/15.
- `npm run build` — pass; JS 14.31 KB gzip, CSS 4.94 KB gzip.
- `npm run test:e2e` — pass, 14/14 desktop/mobile tests.
- Fresh live desktop and mobile browser audits, demo storage-isolation probe, offline reload, metadata/route inspection, and link crawl.
- Fresh live axe scans — zero violations at both viewports.
- `/opt/fleet/lib/verify-url.sh` — pass for basic title/lang/main/alt/console checks.
- Fresh mobile Lighthouse — 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; FCP 1.0 s, LCP 1.1 s, TBT 50 ms, CLS 0.
- Live/local artifact comparison — deployed JS and CSS are byte-identical to the local build.
- Rechecked every historical defect in the previous handoff/verification documents; B-1, H-1, M-1, M-2, and L-1 remain repaired in the available code/live evidence.

## Remaining work

Resolve all findings in `.factory/review-1.md` and rerun the review from a fresh context. Physical Android speech/haptic behavior was not executable because this worker has no Java, Android SDK, or device; the native implementation and regression tests were inspected and passed, but this handoff does not claim hardware acceptance.
