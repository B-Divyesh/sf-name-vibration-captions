# Name Tap verification handoff — PASS

**Fresh verification verdict: PASS** for candidate `f03223229e1d7d15603abc8d01a6735c99df274c` at <https://name-vibration-captions.sociobot.in> on 2026-08-28. The live JS/CSS are byte-identical to the candidate build (`599e7e6578091678c638ffa66a7537920633f77198bb044a22c3eb23787dfdc7`, `af40a5870107f9535b0c054bbebf3c6eb7397127690aef7bd75937f2c73e84ca`). `npm ci`, lint, 15/15 unit tests, exact build, 14/14 Playwright tests, Capacitor sync, independent desktop/390px browser QA, live offline/update checks, response-policy checks, and 100/100/100/100 mobile Lighthouse pass. No critical, high, medium, or low product defects were found.

Fresh Android Gradle/APK and hardware ASR/haptics execution remain unavailable because this `deploy: none` worker has no JDK, Android SDK, `java`, or `javac`. This is a verification environment boundary, not a failed Android test. See `.factory/verification-2.md` for the complete evidence and rerun commands. Historical builder repair notes follow.

---

# Name Tap repair handoff — PASS locally

Work order: `name-vibration-captions-repair-1`
Base verifier report: `8242664778728614c0685a2a57ff6e878d3d480d` (candidate `df35f453057671ee5bf7aa0290adb8fa6e9a8af2`)
Repaired: 2026-08-28
Repair commits: `01bbfaf` (core repair), `e936b20` (manifest MIME fix)

## Release-blocking repairs

1. **Android local live captions:** Added the registered `LocalSpeechPlugin` native Capacitor bridge. On Android 12+ it checks `isOnDeviceRecognitionAvailable`, requests `RECORD_AUDIO` in context, creates only `createOnDeviceSpeechRecognizer`, sets `EXTRA_PREFER_OFFLINE`, streams transient partial/final captions, restarts each completed utterance for a continuous user-started session, and triggers Android waveform haptics. The web layer uses this bridge on Android and never falls back to remote recognition. Unsupported devices/language packs surface an actionable error.
2. **Safe settings imports and recovery:** Every phrase and settings field is now validated before import or render. The verifier’s malformed `variants: "string"` payload is rejected with an announced recoverable error and is never saved. Invalid legacy IndexedDB/localStorage data is discarded and the app starts with clean settings plus a recovery notice.
3. **Versioned offline updates:** The build injects a content-derived release ID into the service-worker cache and the manifest start URL. A waiting update exposes an in-app **Update now** action which sends `SKIP_WAITING`; cache activation purges prior Name Tap shell caches and claims clients.
4. **Performance:** Removed the fixed viewport `feTurbulence` paint path. The signal-board visual system, original hero, contrast, motion policy, and layout remain intact.
5. **Static host hardening:** Added `public/staticwebapp.config.json`, copied to `dist/`, with a self-only CSP, `frame-ancestors 'none'`/`X-Frame-Options: DENY`, microphone-only Permissions-Policy, no-sniff/referrer headers, immutable hashed asset caching, no-cache service worker/manifest, and the Static Web Apps `.webmanifest` MIME mapping (`application/manifest+json`).

## Exact regression coverage

- `tests/store.test.ts`: accepts a valid export, rejects the verifier’s exact malformed phrase payload, and rejects corrupted persisted settings.
- `tests/native-bridge.test.ts`: asserts the registered Android on-device/offline recognizer, continuous restart, permission declaration, caption events, and native waveform cue.
- `tests/deployment.test.ts`: asserts CSP/framing/microphone policy plus immutable assets and manifest media type.
- `tests/e2e/app.spec.ts`: adds malformed-import + reload recovery and built service-worker/manifest version tests; the full suite runs at 1440×1000 desktop and 390×844 mobile.

## Verification run

All commands ran from `/work/repo` on 2026-08-28.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 150 packages, 0 vulnerabilities |
| `npm run lint` | PASS — TypeScript strict typecheck |
| `npm test` | PASS — 15/15 Vitest regressions |
| `npm run build` | PASS — `dist/` generated; JS 40.45 KB (14.31 KB gzip), CSS 18.12 KB (4.94 KB gzip); both within budget |
| `npm run test:e2e` | PASS — 14/14 Playwright checks across desktop and 390px mobile, including keyboard setup, axe serious/critical scan, offline reload, import recovery, and SW versioning |
| `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ …` | PASS — HTTP 200; title/lang/one h1/main/alt present; 0 page/console errors |
| Lighthouse mobile, production preview | PASS — Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0 |
| `npm run cap:sync` | PASS — final built PWA synced to Capacitor Android assets |
| `ANDROID_HOME=/opt/android-sdk JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 ./gradlew test assembleDebug` | PASS — Android unit tests and debug APK assembly |
| Live `verify-url.sh https://name-vibration-captions.sociobot.in/ …` | PASS — HTTP 200, 690 ms load, 0 console/page errors; title/lang/one h1/main/alt checks pass |
| Live response policy | PASS — CSP, `Permissions-Policy: microphone=(self)`, `X-Frame-Options: DENY`; hashed JS is immutable and `/manifest.webmanifest` is `application/manifest+json` |

Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk` (4.5 MB, SHA-256 `79b7b176299f67eeaf30f4f777d903e7fa56b320585aaa4aa059a2105f91df90`). It is a local build artifact and is intentionally not committed.

## Deploy and remaining hardware evidence

Deployed to <https://name-vibration-captions.sociobot.in> with the factory static deployment configuration (Azure Static Web Apps deployment `99ac4b32-80ad-4f51-8610-8671840f4732`). The live response serves `assets/index-B2yzgzdZ.js`, confirming the repaired bundle is active.

No physical Android device is available in this worker. The native bridge and debug APK compile successfully, but final hardware acceptance still needs an Android 12+ device with an installed offline recognizer/language pack: grant microphone permission, start a consented session, speak a configured phrase, and confirm temporary captions plus the physical vibration/visual cue. No recording, remote-ASR fallback, or transcript persistence was added.

## How to run

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:e2e
npm run cap:sync
cd android
ANDROID_HOME=/path/to/android-sdk JAVA_HOME=/path/to/jdk ./gradlew test assembleDebug
```
