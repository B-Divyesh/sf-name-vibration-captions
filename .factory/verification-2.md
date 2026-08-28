# Verification 2 — PASS

Verified 2026-08-28 against candidate commit `f03223229e1d7d15603abc8d01a6735c99df274c` (`f032232`) and live URL <https://name-vibration-captions.sociobot.in>.

## Verdict

**PASS.** The production deployment is the exact built candidate and passes the verifiable product, privacy, PWA, accessibility, performance, and response-policy acceptance checks. This replaces Verification 1's repaired failure findings.

## Fresh clean-checkout evidence

The checkout began clean at the requested SHA. No product source was changed.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 150 packages; 0 audit vulnerabilities. |
| `npm run lint` | PASS — strict TypeScript check. |
| `npm test` | PASS — 15/15 Vitest tests. |
| `npm run build` | PASS — exact production build and build budgets passed. |
| `npm run test:e2e` | PASS — 14/14 Playwright tests at 1440×1000 and 390×844. The executor's non-interactive 30 s yield interrupted initial attempts; persistent-terminal rerun completed in 29.1 s. |
| `npm run cap:sync` | PASS — production PWA was synced to Capacitor Android assets. |
| Android Gradle/APK | NOT RUNNABLE — this `deploy: none` worker has no `java`, `javac`, `JAVA_HOME`, or Android SDK. This is an environment boundary, not a failed Gradle test. |

Built payloads: JS 40,448 bytes / 14,314 gzip (<200 KB); CSS 18,120 bytes / 4,940 gzip (<50 KB); mobile hero 25,480 bytes and desktop hero 99,578 bytes (<300 KB).

## Product acceptance coverage

- Exercised normal phrase + spelling variant setup, duplicate recovery, blank-entry recovery, the three-free-phrase boundary, remove/Undo, cue test, consent gating, and unsupported-local-caption recovery. Malformed settings import/reload recovery is covered by the regression suite.
- With web speech APIs unavailable, Start showed the actionable local-caption unsupported-browser error with no page/console error and no remote request. Native source/tests confirm Android uses only `createOnDeviceSpeechRecognizer` with `EXTRA_PREFER_OFFLINE`, in-context microphone permission, temporary captions, continuous restart, and waveform haptics.
- Live PWA installed its service worker and reloaded offline with the shell and `OFFLINE` status intact. A simulated content-versioned update showed **A Name Tap update is ready**; `Update now` sent `SKIP_WAITING`, reloaded, and activated the new controller.
- Live desktop and 390px browser checks: no console/page errors or horizontal overflow; first Tab reaches the skip link with a 4px focus ring; all visible buttons meet 44px; reduced motion sets transitions to 0.01ms; axe reported 0 serious/critical violations on each viewport.
- Fresh mobile Lighthouse on the production preview: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.1 s, LCP 1.3 s, TBT 0 ms, CLS 0.

## Live deployment, privacy, and policies

The live HTML references the candidate's `assets/index-B2yzgzdZ.js` and `assets/style-DVZyV0Hd.css`; both are byte-identical to `dist/`.

| File | SHA-256 |
| --- | --- |
| `assets/index-B2yzgzdZ.js` | `599e7e6578091678c638ffa66a7537920633f77198bb044a22c3eb23787dfdc7` |
| `assets/style-DVZyV0Hd.css` | `af40a5870107f9535b0c054bbebf3c6eb7397127690aef7bd75937f2c73e84ca` |

Both local/live service workers use `name-tap-shell-f98d35fe1082`; both manifests use `/?source=pwa&v=f98d35fe1082`. `/`, `/privacy`, `/terms`, `/offline.html`, `/manifest.webmanifest`, and `/sw.js` return HTTP 200.

Live responses include self-only CSP, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, nosniff, strict-origin referrer policy, and microphone-only Permissions-Policy. Hashed assets are immutable; the manifest/service worker are no-cache; manifest type is `application/manifest+json`. Fresh normal-use browser loads made only same-origin requests and no third-party fonts, scripts, analytics, or tracking calls. Static inspection found only the allowed Sociobot purchase/license verification endpoint; free use does not call it. Settings remain local and captions transient.

## Defects by severity

No reproducible critical, high, medium, or low product defects were found.

## Remaining verification boundary (not a product defect)

No physical Android device or Android toolchain is available here. A final Android 12+ run should build/install the APK, grant microphone permission, use an installed offline recognizer/language pack, speak a configured phrase, and confirm the physical haptic plus transient visual caption/match cue.
