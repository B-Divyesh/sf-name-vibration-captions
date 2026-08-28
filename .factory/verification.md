# Verification 1 — FAIL

Verified 2026-08-28 against candidate commit `df35f453057671ee5bf7aa0290adb8fa6e9a8af2` (`df35f45`) and production URL <https://name-vibration-captions.sociobot.in>.

## Verdict

**FAIL.** The deployed static files exactly match the candidate, but the Android product cannot perform its core local live-caption job and an invalid settings import can persistently crash the app. Do not ship this candidate as the Android product described in the researched brief.

## Fresh local verification

The checkout began clean at the requested commit. `npm ci` installed 150 packages from `package-lock.json`, reporting zero vulnerabilities.

| Check | Result |
| --- | --- |
| `npm test` | PASS — 8/8 Vitest matcher tests |
| `npm run build` | PASS — TypeScript check, Vite build, static legal-route generation and build-budget check |
| `npm run test:e2e` | PASS — 5/5 Playwright tests, including offline shell reload and axe scan |
| Android `./gradlew test` / `./gradlew assembleDebug` | NOT RUNNABLE — environment has neither `java` nor `JAVA_HOME` |
| Fresh Playwright desktop 1440×1000 and mobile 390×844 smoke | PASS — normal phrase setup, consent gating, no overflow, no load console/page errors |
| Independent simulated local-recognition flow | PASS — `Maya, Maia` matched “Could Maya help me”, showed `HEARD`, called haptic `[220,90,320]`, and Stop cleared the session |
| Invalid-input/import recovery | FAIL — malformed but accepted settings import causes an uncaught page error; see H-1 |
| Axe serious/critical (desktop and 390px mobile) | PASS — none |
| Keyboard/focus and reduced motion | PASS — first Tab reaches Skip to main content; designed focus outline is present; reduced-motion changes scrolling to `auto` and transitions to `0.01ms` |
| Offline reload | PASS — repository Playwright PWA test passed |

Production bundle sizes were 29,212 bytes JS (10,311 gzip), 18,554 bytes CSS (5,120 gzip), 25,480-byte mobile hero, and 99,578-byte desktop hero. These meet the repository’s 200 KB JS, 50 KB CSS, and 300 KB hero budgets.

A fresh mobile Lighthouse run on the production build yielded Performance **77**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 0.9 s, LCP 1.6 s, TBT 1,040 ms, CLS 0. Lighthouse reported a late browser-tab crash while collecting the full-page screenshot, but retained a complete scored report. The performance score is below the stated >=90 gate; the trace attributed 1,649 ms to style/layout and recorded an 804 ms long task.

## Deployment and privacy evidence

The host served byte-identical candidate artifacts:

| Artifact | SHA-256 | Match |
| --- | --- | --- |
| `index.html` | `b04429f331a2eface0637af4e9f527837b3bd84c9feaff0f0b4dfbf438a7a628` | yes |
| `assets/index-Ct7rvL-3.js` | `33a39d1622a71d0e2566e6313adfc42d243089e69c713fe7b0db8210330b186e` | yes |
| `assets/style-TUc_L42h.css` | `4481b57ede18318d0dd50d059d9fe883159471d410bf902398a2d668e36603a2` | yes |
| `sw.js` | `a3b6bac483b04c58fb66ce9295c0721dc7213ad520ddebc0dd8e7eff51474280` | yes |

`/`, `/privacy`, `/terms`, `/manifest.webmanifest`, and `/offline.html` all returned HTTP 200. A fresh browser load made no outbound requests and has no CDN fonts/scripts, analytics, or trackers. The live app includes title, `lang`, one h1, main landmark, image alt text, local storage disclosures, consent gate, and legal pages.

Live HTML/JS/service-worker responses have HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`. They do **not** have CSP, `Permissions-Policy`, `frame-ancestors`/`X-Frame-Options`, or immutable asset caching. Hashed JS/CSS are served with `Cache-Control: public, must-revalidate, max-age=30`; the web manifest is served as `application/octet-stream` rather than a manifest/JSON media type.

## Defects

### Blocker B-1 — Android artifact has no usable local speech-recognition implementation

The acceptance contract calls for an Android app that listens during a user-started local live-caption session. `android/app/src/main/java/in/sociobot/namevibrationcaptions/MainActivity.java` is only `extends BridgeActivity`; no Android speech-recognition/ASR implementation or Capacitor plugin exists. All caption functionality is browser-only `SpeechRecognition` code in `src/speech.ts`, which refuses to start when `processLocally` is unavailable. The repository’s own prior handoff explicitly says a later work order must add a native offline ASR bridge.

Thus a Capacitor Android WebView cannot be shown to provide the product’s core local-caption function, and no debug APK could be built or tested in this environment because Java/Android tooling is absent. This directly fails the smallest useful product and Android artifact contract.

### High H-1 — A malformed settings JSON import crashes and persists a broken app state

`parseSettingsFile()` accepts any `settings.phrases` array without validating its entries. Importing this otherwise well-formed JSON:

```json
{"format":"name-tap-settings","settings":{"phrases":[{"id":"bad","label":"Broken","variants":"string","pattern":"tap","createdAt":1}]}}
```

caused the uncaught browser error `t.variants.slice(...).map is not a function`. The imported object is saved before render, so reloading produced the same error again. The user receives no recoverable import error or usable UI; they must manually clear origin storage. This violates the required invalid-input and recovery path.

### Medium M-1 — PWA cache/update policy is not versioned and production caching is too short

`public/sw.js` hard-codes `const VERSION = 'name-tap-shell-v1'`; the build does not change it. New deployments therefore do not use versioned cache names or reliably purge a prior shell as required. The live host also returns only 30-second `must-revalidate` caching for content-hashed JS/CSS, rather than long-lived immutable caching. Offline reload currently passes, but safe update/offline-cache behavior across a release was not demonstrated.

### Medium M-2 — Mobile performance gate misses

The fresh Lighthouse mobile score was 77, below the acceptance criterion of >=90, with TBT 1,040 ms. The fixed full-screen `feTurbulence` paper texture is a likely contributor to the trace’s 1,649 ms style/layout work. Re-measure after optimizing/removing that expensive paint path.

### Low L-1 — Deployment response-policy and manifest media-type hardening are incomplete

The live host has no CSP, clickjacking defense, or `Permissions-Policy`; this is particularly undesirable for an app which requests microphone access and holds private name phrases. It also serves `manifest.webmanifest` as `application/octet-stream`. Set a restrictive static-site CSP, `frame-ancestors 'none'` (or XFO), a microphone policy appropriate to the app, and `application/manifest+json` or `application/json` for the manifest.

## Required next steps

1. Implement and hardware-test an Android-native, on-device ASR bridge with microphone permission rationale and real haptic behavior; build and install an APK.
2. Validate imported settings fully before saving, reject malformed entries with an announced recoverable error, and add regression tests including reload after a rejected import.
3. Version service-worker caches per build, prove update behavior, configure immutable caching for hashed assets, and repeat offline/update tests.
4. Reduce mobile main-thread/style-layout cost and rerun Lighthouse to the required threshold.
5. Add the missing response policies and correct manifest media type.
