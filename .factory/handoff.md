# Name Tap review round 4 handoff

Work order: `name-vibration-captions-review-4`

## Result

**FAIL — 1 major finding and 1 untested public claim.**

No product code or assets were changed. The independent review report is `.factory/review-4.md`.

## Reviewed versions

- Implementation candidate: `987bdd09f67c45f0b9f719b197e5bd52d2003739`
- Documentation head: `d81e7814b812c8457e77cd016118d6cbe706841e`
- Live: <https://name-vibration-captions.sociobot.in>
- Live JS and CSS byte-match the candidate build.

## Finding to repair

`F-4-1` — In a fresh Chromium browser whose local-caption availability is unknown, **Start listening** can hang while awaiting the native availability call. It does not give the required local-only recovery message within 30 seconds. The public local-only claim’s current remote-only stub does not cover this condition.

Keep the user in setup and show an actionable error when local availability is unknown or never settles. Add a bounded claim test for that condition before accepting the statement that Name Tap stops when it cannot guarantee local captions.

## Verification completed

- `npm ci`: passed; 150 packages and zero reported vulnerabilities.
- All 25 registered claim commands: passed individually, with the coverage exception above.
- `npm run lint`: passed.
- `npm test`: passed, 21/21.
- `npm run build`: passed; static build and budgets passed.
- `npm run test:e2e`: passed, 50/50 desktop and 390 px mobile.
- `npm run cap:sync`: passed.
- `npm run audit:live`: passed.
- Fresh phone and desktop checks covered the first screen, one-click sample, persistent label, replay/reset/exit isolation, normal/invalid/boundary paths, keyboard/focus, reduced motion, routes, privacy/terms, 404, headers, links, offline sample, and console errors.

## Environment boundary

This worker has no `java` command or Android device. No APK or hardware microphone/haptic run was claimed; static Android bridge/package checks and Capacitor sync passed. That boundary is not the cause of this FAIL.

## Evidence

- Repository report: `.factory/review-4.md`
- External copy: `/work/.evidence/qa-report.md`
- Result JSON: `/work/.evidence/qa-result.json`
