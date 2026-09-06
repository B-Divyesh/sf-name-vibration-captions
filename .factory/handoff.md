# Name Tap repair 2 handoff

Work order: `name-vibration-captions-repair-2`

## Result

**PASS for the static product release.** Review finding `F-4-1` is repaired. No current web finding or untested public claim remains.

## Versions and deployment

- Implementation commit: `bb66111dde6987882e8c5f3f279af39805610886`
- Earlier failed review commit: `5b55248de0b7edfcec314b62708f9a60b8535ffd`
- Static deployment ID: `9dc40aae-769d-4342-b82c-63a6942f8809`
- Live URL: <https://name-vibration-captions.sociobot.in>
- Live and built JavaScript SHA-256: `73409698d501a703e2bb1e37c5ae0931de51212635d023d6efd321e490d15eb7`
- Live and built CSS SHA-256: `f94023838af558315d086285e8ec946bc98ed3732a45aa72507801e0966476f7`

## What changed

- Local-caption availability checks now fail closed after three seconds. A check that never settles returns the user to setup with the local-only recovery message.
- Fresh automated Chromium is detected as an unsafe native availability probe. Starting captions does not invoke that probe, does not start recognition, and shows the same recovery message.
- The `local-only-recognition` claim now tests both the native-unknown and never-settling conditions as observable user outcomes.
- Browser Back now restores focus to the destination h1 after the browser completes focus restoration. The existing route accessibility test covers desktop and phone.
- `.factory/copy-audit.md` is current for build `1.2.1-repair2`. The required verb-first catalog description is in `.factory/catalog-description.txt` and `/work/.evidence/catalog-description.txt`.

## Verification

- Fresh local Chromium without a speech stub: phone recovery in 64 ms; desktop recovery in 48 ms. Both stayed in setup, showed “This browser cannot confirm local captions…”, and rendered no Stop listening button.
- Fresh clone at `/tmp/name-tap-clean.eopfql`: `npm ci` passed, then all 25 commands in `.factory/claims.json` passed individually.
- `npm run lint`: passed.
- `npm test`: passed, 21/21.
- `npm run build`: passed. JS is 40.43 KB raw / 14.23 KB gzip; CSS is 21.09 KB raw / 5.47 KB gzip.
- `npm run test:e2e`: passed, 50/50 across desktop and 390 px phone.
- `npm run cap:sync`: passed.
- `npm run audit:live`: passed from fresh browser contexts. It verifies the populated demo in both viewports, reset/exit isolation, privacy requests, offline reload, legal routes, designed HTTP 404, console errors, and serious/critical automated accessibility violations.
- `/opt/fleet/lib/verify-url.sh`: passed. Live page has its title, `lang`, one h1, one main, image alt text, no unlabeled buttons, and no console errors. Evidence is in `/work/.evidence/name-vibration-captions-repair-2`.
- Live Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s, TBT 110 ms, CLS 0.
- Playwright Axe checks passed on the landing, demo, Privacy, Terms, and 404 routes at desktop and phone sizes. The separate `@axe-core/cli` Selenium launcher could not run because its bundled ChromeDriver supports Chrome 152 while the installed Playwright Chromium is 145; this is an environment-driver mismatch, not an untested accessibility path.

## Earlier findings

- `F-4-1` is closed by the bounded local-availability guard and its outcome-based claim test.
- Verification findings `B-1`, `H-1`, `M-1`, `M-2`, and `L-1` remain covered by the native static tests, malformed-import browser recovery, content-versioned worker build check, payload/Lighthouse checks, and live response-policy checks.
- Review 1 findings `F-1-1` through `F-1-97` remain covered by the first-screen, isolated-demo, claim-registry, route, privacy, copy, build, and Android-static checks. The focus regression discovered during this repair was fixed and rechecked in the full route suite.
- Review 2 findings `F-2-1` through `F-2-13` remain covered by the populated demo, language-aware probe states, high-contrast alert, form-entered spelling variant, removed purchase flow, scoped Privacy page, registry gate, and copy checks.
- Review 3 assigned no finding IDs. Its prior pass is superseded and reconfirmed by the current checks above.

## Known boundary

No Java runtime, Android SDK/device, or `adb` is available in this worker. Capacitor sync and the Android source/package claim tests pass, but a compatible Android 12+ device still needs the README hardware checklist: install a debug build, grant microphone access, confirm an offline language pack, speak a saved phrase, and confirm the physical vibration. This is not claimed as a completed device test.
