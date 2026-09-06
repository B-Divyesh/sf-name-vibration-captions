# Review 6 — alert when a chosen phrase is spoken

Reviewed 6 September 2026 at
<https://name-vibration-captions.sociobot.in>.

- Implementation candidate: `060dafc049ae20bad0ace0d7db41ad023a23bd05`
- Documentation head reviewed: `c6a2d3de7099da2635be2b016d291c16759b8420`
- Live URL: <https://name-vibration-captions.sociobot.in>

The commits after `060dafc` change only `.factory/verification-4.md` and
`.factory/handoff.md`. The live JavaScript and CSS are byte-identical to the
clean build of the implementation candidate.

The requested external report path,
`factory-evidence/name-vibration-captions-verify-4/qa-report.md`, was not
mounted in this worker. Its complete repository counterpart,
`.factory/verification-4.md`, was read before testing. This review then
reproduced its product evidence independently.

## Verdict

**PASS — 0 findings and 0 untested public claims.**

There are zero critical, high, medium, low, or untested-claim findings.

## Job, audience, and first action before scrolling

Fresh 390 × 844 phone and 1440 × 1000 desktop browser contexts showed these
answers before any scrolling:

| Question | Visible answer |
| --- | --- |
| Job | “Feel a tap when someone says your name.” |
| Audience | “For hard-of-hearing people who want to follow group conversations without watching captions.” |
| First action | **Try it with sample data**. The next line says it loads a sample caption and name alert. |
| Facts | Captions are local; there is no recording or account; three phrases are free. |

The page title is **Name Tap — alerts when your phrase is spoken**. The h1 is
eight words and names the job directly.

## Live product checks

The first click opened the populated **Maya was heard** board inside both
initial viewports. It showed “Can Maia bring the blue folder?”, `HEARD · MAYA`,
and the Maia-to-Maya explanation. **Replay sample alert** activated the tested
black-on-green state and requested the documented vibration in the claim test.

The persistent label says **Demo — sample data, nothing is saved** and includes
**Reset demo** and **Start for real**. Removing Maya and resetting restored the
sample. A real sentinel phrase created in a fresh browser context was absent in
demo mode and returned after **Start for real**. The exercised demo made no
off-origin request and did not change real data.

Normal, invalid, boundary, and recovery paths passed:

- Blank input remained on the required field. An exact duplicate produced the
  announced “already on your list” status.
- Three entries showed `3 / 3 phrases` and disabled further entry.
- Remove followed by **Undo** restored the phrase.
- A malformed import produced an announced error, was not persisted, and left
  the app usable after reload.
- The fresh browser's unknown local-caption state returned the local-only
  recovery message in 57 ms. Recognition did not start.
- Available, downloadable, unavailable, rejected, unsafe-native, missing, and
  never-settling caption states pass the browser suite.
- Stopping a supported fixture session clears temporary captions.

Keyboard Tab reached **Skip to main content** first. Enter moved focus to the
page h1. Link navigation and browser Back focused the destination h1 after the
route render. At 200% root text size, the 390 px page had no horizontal
overflow. Reduced motion used 0.01 ms animation and transition durations with
automatic scrolling. The browser suite confirmed visible controls meet the
44 px target requirement.

The installed sample reloaded offline. The service worker uses a build-derived
cache name, caches direct routes and the offline fallback, removes old caches,
and implements the waiting-worker update action. No public statement promises
background sync or server persistence.

Privacy and Terms have working email request links. Every checked internal
route returned 200. The unknown route deliberately returned HTTP 404 and
rendered literal `404`, **Page not found**, **Back to Name Tap**, and **Try
sample data**. This expected 404 is not a defect.

Each checked route has `lang="en"`, one h1, one main landmark, a route-specific
title, shared navigation/footer, and current metadata. Ten fresh live Axe scans
covered landing, demo, Privacy, Terms, and 404 at phone and desktop sizes. They
found zero violations of any impact. The factory URL verifier found no console
errors, missing alt text, or unlabeled buttons.

## Declared claims

The clean checkout was `/tmp/name-tap-review6.BXFN0D` at documentation head
`c6a2d3d`. `npm ci` installed 150 locked packages and reported zero
vulnerabilities. Every exact command in `.factory/claims.json` ran separately.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `vibration-on-match` | PASS | A match appeared and requested `[220,90,320]`. |
| `no-recording` | PASS | The sample created no media recording or recording database. |
| `no-account` | PASS | The sample completed without authentication traffic. |
| `spelling-variants` | PASS | `Maya, Maia` labeled Maya and matched a Maia caption. |
| `device-only-data` | PASS | Phrase and caption use made no off-origin request. |
| `free-tier` | PASS | A third phrase, alert, and export worked offline at no charge. |
| `local-only-recognition` | PASS | Unsafe and never-settling probes recovered without starting recognition. |
| `support-detection` | PASS | Every language-aware capability result displayed correctly. |
| `explicit-session` | PASS | Recognition did not start before consent and the start action. |
| `captions-cleared` | PASS | Stop removed temporary captions from page and storage. |
| `matcher` | PASS | Alternate, close, phonetic, and false-positive fixtures passed. |
| `local-settings` | PASS | Demo state stayed in memory and real phrases remained separate. |
| `export-no-captions` | PASS | The settings file contained phrases and no caption text. |
| `haptics` | PASS | The vibration request was `[220,90,320]`. |
| `visual-alert` | PASS | Alert state and measured black-on-green contrast passed. |
| `settings-round-trip` | PASS | Demo settings imported into a clean real workspace. |
| `offline-reload` | PASS | The installed sample reopened offline. |
| `unsupported-browser` | PASS | Missing speech support gave an actionable explanation. |
| `no-analytics` | PASS | Requests and runtime scripts remained same-origin. |
| `non-goals` | PASS | No recording, speaker identity, or emergency action appeared. |
| `build-artifacts` | PASS | Direct routes, host policy, and versioned worker were built. |
| `native-caption-bridge` | PASS | Native source uses the on-device recognizer and offline request. |
| `android-package` | PASS | App ID, permissions, events, and native vibration wiring passed. |
| `license-file` | PASS | The repository and footer identify the MIT license. |
| `asset-provenance` | PASS | Source art, prompt, derivative, and design record agree. |

Result: **25 of 25 claim commands passed.** The registry contains 25 unique
IDs and exactly one matching test tag for each. Landing, demo, legal, README,
Android, offline, build, and 404 statements were cross-checked against the
registry and behavior. No missing, false, incomplete, or untested public claim
was found.

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 150 packages, 0 vulnerabilities |
| `npm run lint` | PASS |
| `npm test` | PASS — 21/21 tests |
| `npm run build` | PASS — `dist/` created |
| `npm run test:e2e` | PASS — 50/50 desktop and phone tests |
| Every declared claim command | PASS — 25/25 |
| `npm run cap:sync` | PASS |
| `npm run audit:live` | PASS |
| Factory `verify-url.sh` | PASS |
| Fresh live Axe | PASS — 10/10 scans, zero violations |

The build contains 40.41 KB JavaScript and 21.09 KB CSS. Gzip sizes are 14.21
KB and 5.47 KB. No runtime font is downloaded.

Fresh live Lighthouse measured Performance 99, Accessibility 100, Best
Practices 100, and SEO 100. FCP was 1.0 s, LCP 1.1 s, TBT 100 ms, and CLS 0.
The first launch did not find Chromium; the completed run used the worker's
pinned Playwright Chromium path and disabled only the optional full-page
screenshot artifact.

The live and clean-build files match:

| File | SHA-256 |
| --- | --- |
| `assets/index-DM2qtCiJ.js` | `9c6094a950d0131781c72148d61edb7a989f7d5a50a24d67ac046c9cfd60e79c` |
| `assets/style-DuB63aH8.css` | `f94023838af558315d086285e8ec946bc98ed3732a45aa72507801e0966476f7` |

Live responses include a self-only content policy, frame denial, HSTS, strict
referrer policy, content-type protection, and microphone-only permissions.
The manifest, worker, robots, sitemap, social image, and direct routes return
the expected statuses and media types.

## Earlier finding disposition

All earlier review, verification, and polish reports were read in full. The
current live product, source, clean tests, and claims account for every earlier
finding, including minor copy findings.

| Earlier finding | Current disposition and proof |
| --- | --- |
| Verification 1 `B-1` | Native bridge/package checks and Capacitor sync pass. Physical-device confirmation remains explicitly unclaimed. |
| Verification 1 `H-1` | Malformed imports are announced, not persisted, and do not break reload. |
| Verification 1 `M-1` | The worker cache is build-derived and the sample reloads offline. |
| Verification 1 `M-2` | Payload budgets pass; Lighthouse is 99 with LCP 1.1 s and TBT 100 ms. |
| Verification 1 `L-1` | Live CSP, framing, transport, referrer, permissions, cache, and manifest checks pass. |
| Review 1 `F-1-1` | The first screen names the job and hard-of-hearing audience. |
| Review 1 `F-1-2` | One click opens the populated, persistent, isolated demo in the initial viewport. |
| Review 1 `F-1-3` | The registry has 25 unique claims and one tag per claim. |
| Review 1 `F-1-4` | No purchase control is rendered; no purchase is offered. |
| Review 1 `F-1-5` | Unknown paths retain the designed page and HTTP 404. |
| Review 1 `F-1-6`–`F-1-23` | Matching, vibration, recording, account, spelling, local data, free tier, support, consent, captions, demo storage, export, and visual claim commands pass. |
| Review 1 `F-1-24`–`F-1-31` | “Forever,” future paid features, checkout, merchant, and unsupported entitlement copy remain absent; tracker, art, and limit checks pass. |
| Review 1 `F-1-32`–`F-1-53` | README behavior, storage, offline use, build, Android source/package, privacy, and license wording match passing evidence. No APK-built or paid claim is made. |
| Review 1 `F-1-54`–`F-1-58` | Metadata, shared chrome, route focus, 44 px targets, and the 180 px Apple icon pass. |
| Review 1 `F-1-59`–`F-1-97` | Landing, control, footer, and README wording remains short, literal, consistent, and action-specific. Node 20+ is enforced and MIT text exists. |
| Review 2 `F-2-1` | Demo opens on the populated Maya board. |
| Review 2 `F-2-2` | Language-aware support states cannot label an unavailable result available. |
| Review 2 `F-2-3` | Copy says “High-contrast visual alert”; exact colours and contrast are tested. |
| Review 2 `F-2-4` | The real form proves comma-separated Maya/Maia labeling and matching. |
| Review 2 `F-2-5`–`F-2-7` | License-token runtime is absent, Privacy has a scoped h1, and no blanket coverage claim is published. |
| Review 2 `F-2-8`–`F-2-13` | Copy uses “vibration,” explains accessibility checks, avoids infrastructure jargon, and states purchase availability plainly. |
| Review 3 | It assigned no findings; its demo, claim, structure, accessibility, and copy conclusions were reproduced. |
| Review 4 `F-4-1` | Fresh live start recovered in 57 ms; unsafe and never-settling claim fixtures also pass without starting recognition. |
| Review 5 `R5-1` | The live 404 renders literal `404`; source, browser test, live audit, and copy audit agree. |
| Verification 2, Verification 3, Polish 1, and Polish 2 | Their repaired paths are covered by the current clean suites, claim commands, live checks, and byte-identical assets. |

## Scope boundary

This is a static PWA with a Capacitor Android project, not a backend. Tenant
isolation, server restart persistence, health endpoints, and 429/Retry-After
checks do not apply.

The documented `./gradlew test assembleDebug` command could not start because
this `deploy: none` worker has no Java runtime, Android SDK, `JAVA_HOME`, or
`adb`. The product makes no built-APK or completed-device-test claim.

Physical Android acceptance still requires an Android 12+ device with an
installed offline language pack. Install the eventual debug build, grant
microphone access, speak a saved phrase, and confirm physical vibration. This
documented device-only boundary is not an untested public claim.

## Evidence

- Repository report: `.factory/review-6.md`
- Required report copy: `/work/.evidence/qa-report.md`
- Machine result: `/work/.evidence/qa-result.json`
- Fresh screenshots: `/work/.evidence/review6-*-fresh.png` and
  `/work/.evidence/review6-phone-reduced-200pct.png`
- Factory URL verifier: `/work/.evidence/review6-verify-url/`
- Lighthouse: `/work/.evidence/review6-lighthouse.json`
