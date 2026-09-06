# Verification 3 — alert when a chosen phrase is spoken

Verified 6 September 2026 at <https://name-vibration-captions.sociobot.in>.

- Implementation candidate: `bb66111dde6987882e8c5f3f279af39805610886`
- Documentation head reviewed: `ca4c9ac59eba797ff960e4806dd39f21eed9ccf7`
- Live URL: <https://name-vibration-captions.sociobot.in>

The commits after `bb66111` change only `.factory` records. The live JavaScript and CSS match the clean candidate build byte for byte.

## Verdict

**PASS — 0 findings and 0 untested public claims.**

No critical, high, medium, low, or untested-claim finding remains.

## Job, audience, and first action before scrolling

Fresh 390 × 844 phone and 1440 × 1000 desktop contexts showed the same information before any scroll.

| Question | Visible answer |
| --- | --- |
| Job | “Feel a tap when someone says your name.” |
| Audience | “For hard-of-hearing people who want to follow group conversations without watching captions.” |
| First action | **Try it with sample data**. The adjacent text says it loads a sample caption and name alert. |

The same first screen also shows three short facts: captions are local, no recording or account is used, and three phrases are free. The headline is eight words and names the job without metaphor.

## Live product results

The first click opened the populated **Maya was heard** board in the initial phone and desktop viewports. It showed “Can Maia bring the blue folder?”, `HEARD · MAYA`, and the explanation that Maia matched Maya. **Replay sample alert** changed the board to the alert state.

The persistent banner said **Demo — sample data, nothing is saved** and kept **Reset demo** and **Start for real** available. Reset restored the bundled Maya sample. A real sentinel phrase created before entering the demo was absent from the demo and returned after **Start for real**. No demo request left the product origin.

The repaired fresh-browser path passed on the deployed site. After adding Maya, accepting the consent statement, and selecting **Start listening**, an unmodified Chromium context returned this message in 28 ms on phone and 31 ms on desktop:

> Couldn’t start. This browser cannot confirm local captions, so Name Tap will not send audio. Use current Chrome on Android.

Setup remained visible, no **Stop listening** control appeared, and captions did not start. This closes the exact hanging condition from `F-4-1`.

Normal, invalid, boundary, and recovery checks also passed:

- Empty phrase submission stayed on the labeled required input.
- A duplicate Maya entry said the phrase was already on the list and kept one phrase.
- Three entries showed `3 / 3 phrases` and disabled further entry.
- Remove followed by **Undo** restored Maya.
- A malformed settings file produced an announced error, was not saved, and did not break reload.
- Unsupported, unavailable, downloadable, rejected, unsafe-native, and never-settling caption checks all failed safely or showed the correct state.
- Stopping a supported fixture session removed its temporary caption.

The installed sample reloaded while offline. Keyboard focus started on **Skip to main content** with a visible 4 px ring. Link navigation and browser Back focused the destination h1. The reduced-motion context used a 0.01 ms transition. The browser suite also checked 44 px controls, no horizontal overflow, and keyboard behavior in desktop and phone projects.

Privacy, Terms, and the demo each have their own title, one h1, one main landmark, shared navigation, and working links. The link crawl returned 200 for every page link except the deliberate unknown URL. That URL correctly returned HTTP 404 with the designed **Page not found** screen; this is expected behavior.

No console or page error occurred on the checked 200 routes. Playwright Axe found no serious or critical issue on landing, demo, Privacy, Terms, or the 404 design at both project sizes. The factory URL verifier found a title, `lang="en"`, one h1, a main landmark, image alt text, labeled buttons, and no console errors.

## Claims

The clean clone was `/tmp/name-tap-verify3.NnwnXU` at documentation head `ca4c9ac`. `npm ci` installed the locked packages and reported no vulnerability. Every command in `.factory/claims.json` was then run separately.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `vibration-on-match` | PASS | Match appeared and requested `[220,90,320]`. |
| `no-recording` | PASS | Sample session created no `MediaRecorder` and no recording database. |
| `no-account` | PASS | Sample completed with no authentication traffic. |
| `spelling-variants` | PASS | Form entry `Maya, Maia` labeled Maya and a Maia caption matched it. |
| `device-only-data` | PASS | Phrase and caption flow made no off-origin request. |
| `free-tier` | PASS | Third phrase, alert, and settings download worked offline without payment. |
| `local-only-recognition` | PASS | Unsafe-native and never-settling checks recovered in bounds and never started recognition. |
| `support-detection` | PASS | Pending, available, downloadable, unavailable, rejected, and changed-language outcomes passed. |
| `explicit-session` | PASS | Recognition did not start before consent and the start action. |
| `captions-cleared` | PASS | Stop removed the caption from the page and storage. |
| `matcher` | PASS | Alternate spelling, close text, phonetic matches, and the published false positive passed. |
| `local-settings` | PASS | Demo changes stayed in memory and did not replace real phrases. |
| `export-no-captions` | PASS | Export contained phrases and no temporary captions. |
| `haptics` | PASS | The documented vibration request was `[220,90,320]`. |
| `visual-alert` | PASS | Alert state and measured black-on-green contrast passed. |
| `settings-round-trip` | PASS | Demo export imported into a clean real workspace. |
| `offline-reload` | PASS | The installed sample reopened offline in a fresh context. |
| `unsupported-browser` | PASS | Missing speech support gave the local-caption recovery message. |
| `no-analytics` | PASS | Demo requests and runtime scripts remained same-origin. |
| `non-goals` | PASS | No recorder, speaker identity, or emergency action was exposed. |
| `build-artifacts` | PASS | Direct routes, metadata, host policy, and content-versioned worker were built. |
| `native-caption-bridge` | PASS | Static native checks proved the on-device recognizer, offline request, permission, events, and restart path. |
| `android-package` | PASS | App ID, permissions, caption events, and native vibration wiring passed static checks. |
| `license-file` | PASS | The repository and public footer identify the MIT license. |
| `asset-provenance` | PASS | Source art, prompt record, public derivative, and design record agree. |

Result: **25 of 25 claim commands passed.** The landing, legal pages, demo, README, and changed recovery copy were cross-checked against the registry. No unlisted or incompletely tested public claim was found.

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm test` | PASS — 21 of 21 tests |
| `npm run build` | PASS — `dist/` created |
| `npm run test:e2e` | PASS — 50 of 50 tests across desktop and 390 px phone |
| `npm run cap:sync` | PASS |
| `npm run audit:live` | PASS |
| Factory URL verifier on home, demo, Privacy, and Terms | PASS |

The production build contains 40.43 KB JavaScript, 21.09 KB CSS, and no runtime font download. Gzip sizes are 14.23 KB and 5.47 KB. These are below the stated budgets.

Fresh live Lighthouse results were Performance 98, Accessibility 100, Best Practices 100, and SEO 100. FCP was 0.9 s, LCP 1.4 s, TBT 150 ms, and CLS 0. The first collection crashed while taking the optional full-page screenshot. A clean rerun with only that screenshot disabled completed and produced the retained JSON report.

The live and clean-build files match:

| File | SHA-256 |
| --- | --- |
| `assets/index-BUZfVh5m.js` | `73409698d501a703e2bb1e37c5ae0931de51212635d023d6efd321e490d15eb7` |
| `assets/style-DuB63aH8.css` | `f94023838af558315d086285e8ec946bc98ed3732a45aa72507801e0966476f7` |

Live responses include a self-only content policy, frame blocking, strict referrer policy, content-type protection, HTTPS transport policy, and microphone-only permissions policy. Hashed assets are immutable. The manifest is served as `application/manifest+json` without caching.

## Earlier finding disposition

All earlier verification, review, and polish records were read before this verdict.

| Earlier finding | Current proof |
| --- | --- |
| Verification 1 `B-1` | The native bridge and package claims pass. Capacitor sync includes the bridge. Physical-device confirmation remains explicitly unclaimed. |
| Verification 1 `H-1` | The malformed import is rejected, announced, not persisted, and a reload remains usable. |
| Verification 1 `M-1` | Build output has a content-derived worker cache; the isolated sample reloads offline. |
| Verification 1 `M-2` | The build is small and live Lighthouse is 98 performance with LCP 1.4 s, TBT 150 ms, and CLS 0. |
| Verification 1 `L-1` | Live CSP, framing, permissions, referrer, cache, transport, and manifest media-type checks pass. |
| Review 1 `F-1-1` to `F-1-5` | The first screen names the job and audience; the demo is isolated and populated; the claim registry exists; no dead purchase link is shown; unknown paths use a designed HTTP 404. |
| Review 1 `F-1-6` to `F-1-23` | The matching, vibration, recording, account, spelling, local-data, free-tier, local-only, support, consent, caption, matcher, demo-storage, export, visual, and round-trip claim commands all pass. |
| Review 1 `F-1-24` to `F-1-31` | “Forever,” future paid features, unavailable checkout, merchant promises, and unsupported entitlements remain absent. Analytics, art provenance, and product limits are tested. |
| Review 1 `F-1-32` to `F-1-53` | README audience, behavior, storage, offline, import/export, free tier, platform boundary, build, Android source/package, privacy, and license statements match passing claims. No APK-built or purchase claim is made. |
| Review 1 `F-1-54` to `F-1-58` | Route metadata, shared header/footer, navigation and Back focus, touch targets, and the 180 px Apple icon pass current browser and build checks. |
| Review 1 `F-1-59` to `F-1-97` | The current copy audit remains short, literal, consistent, and free of the former metaphor, jargon, vague actions, and unsupported marketing statements. |
| Review 2 `F-2-1` | The first demo viewport is the populated Maya board on phone and desktop. |
| Review 2 `F-2-2` | The current language-aware probe test covers all result states without an unavailable false positive. |
| Review 2 `F-2-3` | The public wording is “High-contrast visual alert”; the alert colors and contrast are tested. |
| Review 2 `F-2-4` | The claim enters `Maya, Maia` through the real form and proves the displayed alternate match. |
| Review 2 `F-2-5` to `F-2-7` | License-token runtime and claims remain absent, the Privacy h1 is scoped to data handling, and no blanket coverage claim is published. |
| Review 2 `F-2-8` to `F-2-13` | Current copy uses “vibration,” explains accessibility testing plainly, avoids infrastructure jargon, states that purchases are unavailable, and links the live Sociobot privacy page. |
| Review 3 | It assigned no finding IDs. Its demo, claims, structure, accessibility, and copy conclusions were reproduced. |
| Review 4 `F-4-1` | Fresh live phone and desktop start attempts return the local-only recovery message in 28–31 ms. The claim now tests unsafe-native and never-settling checks and asserts that recognition never starts. |

## Remaining hardware boundary

This worker has no Java runtime, Android SDK, `adb`, or physical Android device. The native source/package tests and Capacitor sync pass, but a compatible Android 12+ device is still required to install a debug build, grant microphone access, use an offline language pack, speak a saved phrase, and confirm physical vibration. The product does not publish a claim that this device test was completed, so this boundary is not an untested public claim.

## Evidence

Detailed logs, screenshots, live checks, headers, hashes, link crawl, and Lighthouse JSON are in `/work/.evidence/name-vibration-captions-verify-3/`.
