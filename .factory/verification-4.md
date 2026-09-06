# Verification 4 — alert when a chosen phrase is spoken

Verified 6 September 2026 at <https://name-vibration-captions.sociobot.in>.

- Implementation candidate: `060dafc049ae20bad0ace0d7db41ad023a23bd05`
- Documentation head reviewed: `ad96025cb4a5c3a5aab5144ca2d2878e74c765c3`
- Live URL: <https://name-vibration-captions.sociobot.in>

The later documentation commit changes only `.factory/handoff.md`. The live
JavaScript and CSS match the clean build of the implementation candidate byte
for byte.

## Verdict

**PASS — 0 findings and 0 untested public claims.**

No critical, high, medium, low, or untested-claim finding remains.

## Job, audience, and first action before scrolling

Fresh 390 × 844 phone and 1440 × 1000 desktop contexts showed these answers
before any scrolling:

| Question | Visible answer |
| --- | --- |
| Job | “Feel a tap when someone says your name.” |
| Audience | “For hard-of-hearing people who want to follow group conversations without watching captions.” |
| First action | **Try it with sample data**. The adjacent text says it loads a sample caption and name alert. |
| Facts | Local captions on the device; no recording or account; three phrases are free. |

The title is **Name Tap — alerts when your phrase is spoken**. The h1 is eight
words, names the job, and uses no metaphor.

## Live product results

The first click opened the populated **Maya was heard** board in the initial
phone and desktop viewports. It showed “Can Maia bring the blue folder?”,
`HEARD · MAYA`, and the explanation that Maia matched Maya. **Replay sample
alert** requested the documented vibration and changed the board to its tested
black-on-green alert state.

The persistent banner said **Demo — sample data, nothing is saved** and kept
**Reset demo** and **Start for real** available. Removing Maya and resetting
restored the bundled sample. A real sentinel phrase created before entering the
demo was absent there and returned after **Start for real**. No demo request
left the product origin, so the sample neither read nor changed real data.

Normal, invalid, boundary, and recovery checks passed:

- Blank and duplicate phrases stayed recoverable; the duplicate produced an
  announced “already on your list” status.
- Three phrases showed `3 / 3 phrases` and disabled further entry.
- Remove/Undo, settings export/import, malformed-import recovery, and caption
  clearing pass the browser suite.
- Available, downloadable, unavailable, rejected, missing, unsafe-native, and
  never-settling local-caption states fail safely or show the correct status.
- Fresh live Chromium returned: “This browser cannot confirm local captions,
  so Name Tap will not send audio. Use current Chrome on Android.” Setup stayed
  available and recognition did not start.

Keyboard Tab reached **Skip to main content** first, Enter moved focus into the
main content, and the primary link had a visible 4 px focus outline. Route
navigation and browser Back focus the new h1 in the browser suite. At 200% root
text size the 390 px page had no horizontal overflow. Reduced motion removed
animation, used 0.01 ms transitions, and disabled smooth scrolling. Visible
controls meet the 44 px target check.

The installed sample reloaded offline. The service worker has a content-derived
cache version, cached direct routes, an offline fallback, and an update-ready
path. No public statement promises background sync or server persistence.

Privacy and Terms expose working email request links. The Sociobot privacy link
returned 200. Every internal page link returned 200; same-page skip/section
links resolved in place. The unknown route deliberately returned HTTP 404 and
rendered the literal `404`, **Page not found**, **Back to Name Tap**, and **Try
sample data**. That expected 404 is not a defect.

Each checked route has `lang="en"`, one h1, one main landmark, a route-specific
title, shared navigation/footer, and correct metadata. Ten fresh live Axe scans
covering landing, demo, Privacy, Terms, and 404 at phone and desktop sizes found
zero violations of any impact. No unexpected console or page error occurred.

## Claims

The clean checkout was `/tmp/name-tap-qa4.R4t0E7` at documentation head
`ad96025`. `npm ci` installed 150 locked packages and reported zero
vulnerabilities. Every exact command in `.factory/claims.json` ran separately.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `vibration-on-match` | PASS | Match appeared and requested `[220,90,320]`. |
| `no-recording` | PASS | A sample session created no `MediaRecorder` or recording database. |
| `no-account` | PASS | The sample ran with no authentication traffic. |
| `spelling-variants` | PASS | `Maya, Maia` labeled Maya and a Maia caption matched it. |
| `device-only-data` | PASS | Phrase and caption use made no off-origin request. |
| `free-tier` | PASS | A third phrase, alert, and export worked offline without payment. |
| `local-only-recognition` | PASS | Unsafe and never-settling probes recovered without starting recognition. |
| `support-detection` | PASS | Every language-aware capability result displayed correctly. |
| `explicit-session` | PASS | Recognition did not start before consent and the start action. |
| `captions-cleared` | PASS | Stop removed the temporary caption from page and storage. |
| `matcher` | PASS | Alternate, close, phonetic, and false-positive fixtures passed. |
| `local-settings` | PASS | Demo changes reset in memory; the full isolation flow preserved a real sentinel. |
| `export-no-captions` | PASS | Export contained phrases and no temporary caption. |
| `haptics` | PASS | The documented vibration request was `[220,90,320]`. |
| `visual-alert` | PASS | Alert state and measured black-on-green contrast passed. |
| `settings-round-trip` | PASS | Demo export imported into a clean real workspace. |
| `offline-reload` | PASS | The installed sample reopened offline in a fresh context. |
| `unsupported-browser` | PASS | Missing speech support gave the recovery message. |
| `no-analytics` | PASS | Demo requests and runtime scripts stayed same-origin. |
| `non-goals` | PASS | No recording, speaker identity, or emergency action appeared. |
| `build-artifacts` | PASS | Direct routes, host policy, and versioned worker were built. |
| `native-caption-bridge` | PASS | Native source uses the on-device recognizer and offline request. |
| `android-package` | PASS | App ID, permissions, caption events, and native vibration wiring passed. |
| `license-file` | PASS | The repository and footer identify the MIT license. |
| `asset-provenance` | PASS | Source art, prompt, derivative, and design record agree. |

Result: **25 of 25 claim commands passed.** There are 25 unique registry IDs
and exactly one matching test tag for each. Landing, demo, legal, README,
Android, offline, build, and 404 statements were cross-checked against the
registry and behavior. No missing, false, incomplete, or untested public claim
was found.

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 150 packages, 0 vulnerabilities |
| `npm run lint` | PASS |
| `npm test` | PASS — 21 of 21 tests |
| `npm run build` | PASS — `dist/` created |
| `npm run test:e2e` | PASS — 50 of 50 tests across desktop and 390 px phone |
| Every declared claim command | PASS — 25 of 25 |
| `npm run cap:sync` | PASS |
| `npm run audit:live` | PASS |
| Live Axe, link, route, keyboard, resize, and recovery checks | PASS |

The build contains 40.41 KB JavaScript and 21.09 KB CSS. Gzip sizes are 14.21
KB and 5.47 KB. There is no runtime font download. These results are below all
declared static-product budgets.

A fresh Lighthouse run completed without a runtime error after disabling only
its optional full-page screenshot artifact: Performance 100, Accessibility
100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 60 ms, CLS 0. The
first attempt reached valid scores but its Chromium tab crashed while collecting
that optional screenshot; it is not used as acceptance evidence.

The live and clean-build files match:

| File | SHA-256 |
| --- | --- |
| `assets/index-DM2qtCiJ.js` | `9c6094a950d0131781c72148d61edb7a989f7d5a50a24d67ac046c9cfd60e79c` |
| `assets/style-DuB63aH8.css` | `f94023838af558315d086285e8ec946bc98ed3732a45aa72507801e0966476f7` |

Live responses include self-only CSP, frame denial, HSTS, strict referrer
policy, content-type protection, and microphone-only permissions policy. The
manifest, worker, robots, sitemap, social image, and direct routes return the
expected successful responses and media types.

## Earlier finding disposition

All earlier verification, review, and polish records were read. This table
accounts for every earlier finding, including minor copy findings.

| Earlier finding | Current disposition and proof |
| --- | --- |
| Verification 1 `B-1` | Native bridge/package claims and Capacitor sync pass. Physical-device confirmation remains explicitly unclaimed. |
| Verification 1 `H-1` | Malformed imports are announced, not persisted, and do not break reload. |
| Verification 1 `M-1` | The worker cache is content-versioned and the sample reloads offline. |
| Verification 1 `M-2` | Payload budgets pass; Lighthouse performance is 100 with LCP 1.1 s and TBT 60 ms. |
| Verification 1 `L-1` | Live CSP, framing, transport, referrer, permissions, cache, and manifest checks pass. |
| Review 1 `F-1-1` | The first screen names the job and hard-of-hearing audience. |
| Review 1 `F-1-2` | One click opens the populated, persistent, isolated demo in the initial viewport. |
| Review 1 `F-1-3` | The registry has 25 unique claims and one tag per claim. |
| Review 1 `F-1-4` | No dead purchase control is rendered; no purchase is offered. |
| Review 1 `F-1-5` | Unknown paths retain the designed page and HTTP 404. |
| Review 1 `F-1-6`–`F-1-23` | Vibration, recording, account, spelling, local data, free tier, local-only support, consent, captions, matching, demo storage, export, and visual claim commands pass. |
| Review 1 `F-1-24`–`F-1-31` | “Forever,” future paid features, checkout, merchant, and unsupported entitlement copy remain absent; tracker, art, and limitation checks pass. |
| Review 1 `F-1-32`–`F-1-53` | README behavior, storage, offline, free tier, build, Android source/package, privacy, and license wording match passing evidence. No APK-built or paid-unlock claim is made. |
| Review 1 `F-1-54` | Titles, canonical/OG/Twitter metadata, social art, robots, and sitemap pass. |
| Review 1 `F-1-55` | Shared header/footer and required legal/build text remain on every route. |
| Review 1 `F-1-56` | Link navigation and Back focus and announce the destination h1. |
| Review 1 `F-1-57` | Computed visible controls meet the 44 px target check. |
| Review 1 `F-1-58` | The linked Apple icon is a genuine 180 × 180 asset. |
| Review 1 `F-1-59`–`F-1-77` | Landing, control, section, and footer terms remain literal, consistent, and action-specific. |
| Review 1 `F-1-78`–`F-1-95` | README copy remains short, plain, and accurate; Node 20+ is enforced and the clean Node 22 setup passes. |
| Review 1 `F-1-96`–`F-1-97` | MIT text exists and the device-status wording remains scoped to phrases. |
| Review 2 `F-2-1` | Demo opens on the populated Maya board, not a second landing hero. |
| Review 2 `F-2-2` | Language-aware support states cannot label an unavailable result available. |
| Review 2 `F-2-3` | Copy says “High-contrast visual alert”; colors and contrast are tested. |
| Review 2 `F-2-4` | The real form proves comma-separated Maya/Maia labeling and matching. |
| Review 2 `F-2-5` | License-token runtime and related privacy copy remain absent. |
| Review 2 `F-2-6` | Privacy h1 is scoped to how Name Tap handles data. |
| Review 2 `F-2-7` | No blanket claim-coverage statement is published. |
| Review 2 `F-2-8` | “Tap pattern” remains replaced by “vibration.” |
| Review 2 `F-2-9` | README says “automated accessibility rules,” not unexplained tool jargon. |
| Review 2 `F-2-10` | Native behavior is explained without “waveform” jargon. |
| Review 2 `F-2-11` | Privacy copy says “another site,” not “off origin.” |
| Review 2 `F-2-12` | Purchase status is stated plainly and no internal billing language appears. |
| Review 2 `F-2-13` | Undefined “short security logs” wording is gone; the live privacy policy is linked. |
| Review 3 | It assigned no finding IDs; its demo, claim, structure, accessibility, and copy conclusions were reproduced. |
| Review 4 `F-4-1` | Unknown/never-settling local-caption probes recover promptly and never start recognition. |
| Review 5 `R5-1` | The live 404 now renders literal `404`; source, browser test, live audit, and copy audit agree. |
| Verification 2 and 3; Polish 1 and 2 | Their repaired paths are covered above by the current clean suites, claim commands, live checks, and byte-identical assets. |

## Scope boundaries

This is a static PWA with a Capacitor Android project, not a backend. Tenant
isolation, server restart persistence, health endpoints, and 429/Retry-After
checks do not apply.

The documented Gradle command was attempted from the clean checkout. It could
not start because this `deploy: none` worker has no Java runtime, Android SDK,
`JAVA_HOME`, or `adb`. The work order explicitly leaves APK production to a
later Android job, and the product makes no APK-built claim. Native source and
package tests plus Capacitor sync pass.

Physical Android acceptance still requires an Android 12+ device with an
installed offline language pack: install the eventual debug build, grant
microphone access, speak a saved phrase, and confirm the physical vibration.
The product does not claim that this hardware test has been completed, so this
known boundary is not an untested public claim.

## Evidence

- Required report copy: `/work/.evidence/qa-report.md`
- Machine result: `/work/.evidence/qa-result.json`
- Fresh screenshots: `/work/.evidence/qa4-*-home.png`,
  `/work/.evidence/qa4-*-demo-fresh.png`, and
  `/work/.evidence/qa4-phone-reduced-200pct.png`
- Lighthouse JSON: `/work/.evidence/lighthouse-qa4.json`
