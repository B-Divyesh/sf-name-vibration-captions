# Name Tap review 4 — alert when a chosen phrase is spoken

Reviewed 2026-09-06 at <https://name-vibration-captions.sociobot.in>.

Implementation candidate: `987bdd09f67c45f0b9f719b197e5bd52d2003739`.

Documentation head: `d81e7814b812c8457e77cd016118d6cbe706841e`.

## Verdict

**FAIL.** There is one major finding and one public claim whose current test does not cover the failing live-browser condition. The 25 declared claim commands pass, but that does not prove the affected local-only recovery promise. This is not a product PASS.

## Job, audience, and first action before scrolling

Fresh desktop (1440 × 1000) and phone (390 × 844) Chromium contexts gave the same answer before any scroll:

| Question | Evidence |
| --- | --- |
| Job | “Feel a tap when someone says your name.” The three facts make clear that local captions trigger the private alert. |
| Audience | “For hard-of-hearing people who want to follow group conversations without watching captions.” |
| First action | **Try it with sample data**. The adjacent text says it loads a sample caption and name alert. |

The headline is eight words. The phone and desktop first screens show the job, audience, action, and all three facts. They had no console or page errors.

## Finding

### F-4-1 — Major — an unknown local-caption browser can hang when listening starts

On a fresh, unmodified live Chromium context, the page reports “This browser cannot confirm local captions.” This is the cautious status expected for a browser that cannot prove local recognition. I then added `Maya`, checked the consent box, and activated **Start listening**. The interaction did not return an error, a listening state, or a recovery action after 30 seconds; the browser automation remained blocked while dispatching the click.

The same fresh browser exposes `SpeechRecognition`, `SpeechRecognition.available`, and `processLocally`; `navigator.webdriver` is true and `available` is native. `probeLocalSpeechSupport()` deliberately treats exactly that automated native probe as unsafe and reports `unknown`. `LocalCaptioner.start()`, however, does not apply that guard before awaiting `SpeechRecognition.available(...)`. The inconsistent paths leave the session-start flow waiting indefinitely in this condition.

This fails the required recovery-path check and leaves the public statement “Stops when the device cannot guarantee local captions” inadequately proved in a real fresh browser. The registered `@claim:local-only-recognition` test passes only with a remote-only stub; it does not exercise this native, unknown-result path. Count it as one untested public claim despite its command exiting successfully.

Expected behavior: when local availability is unknown or the availability probe does not settle, keep the user in setup and show a clear local-only recovery message. Do not invoke an unsafe availability probe while starting the session. Add a claim test using the native-unknown or a never-settling availability fixture and assert a bounded, actionable outcome.

## Demo and real-data checks

The one-click sample path itself works.

- The landing action opens `?demo=1` directly on the populated “Maya was heard” board on phone and desktop.
- The realistic caption reads “Can Maia bring the blue folder?” and identifies the Maia → Maya alternate-spelling match.
- The persistent banner says “Demo — sample data, nothing is saved,” with **Reset demo** and **Start for real**.
- **Replay sample alert** activates the visual cue. The registered haptic test proves the `[220,90,320]` request.
- Reset restores Maya. A real phrase saved before entering demo remains absent in demo and is restored after **Start for real**. Demo request interception found no off-origin request.
- The installed demo reloaded offline after a first online load in the live cold audit.

## Normal, invalid, boundary, and recovery checks

The non-caption paths passed in a fresh live phone context with no page errors:

- Blank phrase: announced “Type a name or phrase before adding it.”
- Duplicate phrase: announced “That phrase is already on your list.”
- Boundary: three phrases shows `3 / 3 phrases` and disables the input.
- Removal is reversible with **Undo**.
- Malformed JSON import is announced and does not break the subsequent reload.
- The unsupported-browser test fixture gives its exact recovery message. F-4-1 is the separate unknown-native condition the fixture misses.

## Claims and local quality checks

The checkout was clean at documentation head before `npm ci`. Node was `v22.23.2`; `npm ci` installed 150 packages with zero reported vulnerabilities.

| Check | Result |
| --- | --- |
| Every command in `.factory/claims.json` | PASS individually: 25/25. `local-only-recognition` has the coverage gap in F-4-1. |
| `npm run lint` | PASS |
| `npm test` | PASS — 21/21 |
| `npm run build` | PASS — `dist/`; JS 40.31 KB raw / 14.17 KB gzip; CSS 21.09 KB raw / 5.47 KB gzip |
| `npm run test:e2e` | PASS — 50/50 at desktop and 390 px mobile |
| `npm run cap:sync` | PASS |
| `npm run audit:live` | PASS |

One full-suite attempt overlapped with still-running individual browser checks and got local `ERR_CONNECTION_REFUSED`; the clean standalone rerun passed 50/50. It is not a product finding.

`@axe-core/playwright` runs in the passing browser suite and in the live cold audit. All checked routes had zero serious or critical violations. Manual keyboard checks found a 4 px first-focus ring, **Skip to main content**, h1 focus after navigation, and Space activation of **Replay sample alert**. Reduced-motion demo alert transitions were `0.00001s`. Live route checks covered `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and `/does-not-exist`; each has one h1 and one main. The designed unknown route returns HTTP 404, which is expected rather than a defect. All crawled internal links returned 200 except that deliberate 404; the published Sociobot privacy link returned 200 and mail links are explicit.

Response headers on the live HTML include self-only CSP, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, HSTS, strict-origin referrer policy, nosniff, and microphone-only Permissions-Policy. The PWA manifest, robots file, sitemap, route titles, legal pages, and offline behavior are present. No backend is in scope for this static product. No APK or physical Android device is available; that remains the documented hardware-validation boundary and is not counted as an untested public web claim.

## Candidate and deployment comparison

The current live assets are byte-identical to the reviewed implementation candidate build:

| Asset | SHA-256 |
| --- | --- |
| `index-DFgV5q61.js` | `95cfff433f392f582e1e50864138bf7e29dc22d9e382153f5a0494a761c1bfd2` |
| `style-DuB63aH8.css` | `f94023838af558315d086285e8ec946bc98ed3732a45aa72507801e0966476f7` |

The later commits from `987bdd0` through `d81e781` change only factory reports and handoff material, not product code or assets.

## Earlier finding disposition

All earlier records were read: `verification.md`, `verification-2.md`, `review-1.md`, `review-2.md`, `review-3.md`, `polish-1.md`, and `polish-2.md`.

| Earlier findings | Current disposition and proof |
| --- | --- |
| Verification 1: B-1, H-1, M-1, M-2, L-1 | Native bridge/package static claims, malformed-import recovery, versioned worker/build output, small payload, and live response policy pass current checks. Physical Android hardware remains a stated boundary, not a falsely accepted web result. |
| F-1-1 to F-1-5 | Job-first screen, isolated demo, claim registry, no purchase link, and designed HTTP 404 are live. |
| F-1-6 to F-1-23 | Current tagged tests pass for vibration/visual cue, no recording/account, spelling variants, consent/local-only fixtures, temporary captions, matcher, isolation, and settings transfer. F-4-1 adds a newly observed gap to the local-only path. |
| F-1-24 to F-1-53 | Unsupported paid promises and merchant copy remain absent; privacy, limits, offline, Android-source, build, provenance, no-tracker, and license checks remain covered. |
| F-1-54 to F-1-58 | Route metadata, shared chrome, navigation focus, 44 px targets, and touch icon remain covered by the passing 50-test suite and live crawl. |
| F-1-59 to F-1-97 | The concise landing and README terms remain present. The current first-screen read and source copy audit show no reinstated long, vague, or banned marketing wording. |
| F-2-1 to F-2-13 | The populated first-view demo, language-aware status fixtures, high-contrast wording, entered Maia variant, removed license path, scoped Privacy h1, claim-registry gate, and copy repairs remain in place. |
| Review 3 | It assigned no finding IDs. Its former PASS is superseded by F-4-1, found against the unchanged live implementation during this independent re-review. |

## Required next step

Repair F-4-1, add the missing bounded unknown-native local-caption test to the claim, rerun every registered claim command and the live cold audit, then perform a new independent review. Until then: **FAIL — 1 finding; 1 untested public claim.**
