# Name Tap handoff — FAIL

Work order: `name-vibration-captions-verify-1`
Verified: 2026-08-28
Candidate: `df35f453057671ee5bf7aa0290adb8fa6e9a8af2`
URL: <https://name-vibration-captions.sociobot.in>

**FAIL — do not ship as the Android product in the brief.** The live deployment is byte-identical to the candidate, but the Android shell has no native local ASR bridge for the central live-caption job and invalid settings import can persistently crash the app.

## What was verified

- Fresh clean-checkout `npm ci`, `npm test` (8/8), exact `npm run build`, and `npm run test:e2e` (5/5) passed.
- Production browser smoke at 1440×1000 and 390×844 passed for normal phrase setup, consent gating, keyboard skip link/focus, no overflow, no initial console/page errors, reduced motion, offline shell reload, and axe serious/critical findings (none).
- A simulated compatible local-recognition session correctly matched a target phrase, produced the configured haptic call, visual cue, and session stop/clear behavior.
- Byte hashes of deployed HTML, JS, CSS, and service worker match the candidate exactly.
- Native Android Gradle tests/APK assembly could not run because this environment has no Java or `JAVA_HOME`; source inspection additionally proves there is only a default `BridgeActivity`, with no native ASR bridge.

## Release-blocking defects

1. **Blocker:** Android cannot be accepted as an end-to-end local live-caption product. The required native offline ASR bridge and hardware validation do not exist.
2. **High:** An import with a `phrases` array containing an invalid `variants` value is saved, then throws `t.variants.slice(...).map is not a function` on import and every reload. No in-app recovery is available.
3. **Medium:** PWA cache version is hard-coded (`name-tap-shell-v1`), live hashed assets cache for only 30 seconds rather than immutable, and update behavior across a deployment is unproven.
4. **Medium:** Fresh mobile Lighthouse measured Performance 77 (TBT 1,040 ms), below the >=90 gate.
5. **Low:** Live response headers lack CSP, clickjacking protection, and Permissions-Policy; manifest is `application/octet-stream`.

See `.factory/verification.md` for exact commands, hashes, results, and remediation.

## How to reproduce

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

After the blockers are fixed, build/install the Android APK on compatible hardware, verify local ASR, microphone consent, haptic cue, offline reload, PWA update, import validation/recovery, and repeat Lighthouse and deployed-header checks.
