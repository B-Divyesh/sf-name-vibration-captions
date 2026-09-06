# Review 5 — alert when a chosen phrase is spoken

Reviewed 6 September 2026 at <https://name-vibration-captions.sociobot.in>.

- Implementation candidate: `bb66111dde6987882e8c5f3f279af39805610886`
- Documentation head reviewed: `7cc0b383376c6dc37db7b5cc5fcae33b3bb57bc7`
- Live URL: <https://name-vibration-captions.sociobot.in>

Commits after `bb66111` change only `.factory` records. This review built the documentation head from a clean checkout and confirmed the deployed JavaScript and CSS are byte-for-byte identical to that build.

## Verdict

**FAIL — 1 low-severity finding and 0 untested public claims.**

The product works through its core path, and every declared claim is tested and passed. The failure is a plain-words contract violation on the live 404 page.

## First screen before scrolling

Fresh phone (390 × 844) and desktop (1440 × 1000) browser contexts gave the same answers before scrolling.

| Question | Visible answer |
| --- | --- |
| Job | “Feel a tap when someone says your name” |
| Audience | “For hard-of-hearing people who want to follow group conversations without watching captions.” |
| First action | **Try it with sample data** — “Loads a sample caption and name alert.” |
| Facts | Local captions on the device; no recording or account; three phrases are free. |

## Finding

### R5-1 — 404 includes decorative metaphor copy

**Severity: low**

The live designed 404 correctly returns HTTP 404, has the plain h1 **Page not found**, and provides **Back to Name Tap** and **Try sample data**. It also shows the all-caps label **“WRONG FREQUENCY · 404.”**

That label is a metaphor/mood line, not plain information. It violates the plain-words contract, which prohibits metaphor, brand lore, and decorative labels on every page. The current copy audit also omits this 404 text, so it does not catch the violation.

Evidence: fresh live navigation to `/not-a-real-route` returned HTTP 404 with `WRONG FREQUENCY · 404`, `Page not found`, and the two working recovery links. The candidate source has the same string in `src/main.ts`.

Required repair: replace the label with plain information such as `404` or `Page address not found`, and add the 404 text to `.factory/copy-audit.md`.

## Core path and live checks

- On both fresh phone and desktop, the one-click sample opened the populated **Maya was heard** board. It displayed `Can Maia bring the blue folder?`, `HEARD · MAYA`, and the alternate-spelling explanation.
- The persistent **Demo — sample data, nothing is saved** label, **Reset demo**, and **Start for real** controls remained present. Replay kept the Maya alert visible. Removing Maya then resetting restored Maya.
- In a fresh desktop context, a real `REAL PRIVATE REVIEW PHRASE` was saved, absent from the demo, and present again after **Start for real**. Demo isolation therefore did not read or change real data.
- A live demo replay made only three requests, all to `https://name-vibration-captions.sociobot.in`; it produced no console or page error.
- The installed live `/demo` service worker reloaded the sample offline. Under reduced motion, the live primary-action transition duration was `0.00001s`. Fresh keyboard Tab reached **Skip to main content** with a `4px` visible outline.
- Live phone and desktop Axe smoke checks after the demo path reported no serious or critical violations. Live Privacy, Terms, Demo, and 404 routes had their own titles, one h1, and one main landmark. The deliberate 404 response is expected; only its decorative label is a defect.
- Live headers include self-only CSP with `frame-ancestors 'none'`, HSTS, nosniff, strict referrer policy, microphone-only permissions policy, and frame denial. Manifest, worker, robots, sitemap, and offline fallback all returned 200 with the expected media types.

## Clean-checkout verification

Fresh checkout: `/tmp/name-tap-review5.pDHIlD` at `7cc0b38`.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 150 packages, 0 vulnerabilities |
| `npm run lint` | PASS |
| `npm test` | PASS — 21/21 |
| `npm run build` | PASS — `dist/` created; JS 40.43 KB (14.23 KB gzip), CSS 21.09 KB (5.47 KB gzip) |
| `npm run test:e2e` | PASS — 50/50 across desktop and 390 px phone |
| `npm run cap:sync` | PASS |
| `npm run audit:live` | PASS |
| Every exact command in `.factory/claims.json` | PASS — 25/25 commands |

All 25 registry IDs have exactly matching `@claim:` test tags; none is missing or extra. The live asset hashes matched the clean build:

| File | SHA-256 |
| --- | --- |
| `assets/index-BUZfVh5m.js` | `73409698d501a703e2bb1e37c5ae0931de51212635d023d6efd321e490d15eb7` |
| `assets/style-DuB63aH8.css` | `f94023838af558315d086285e8ec946bc98ed3732a45aa72507801e0966476f7` |

The browser suite exercises normal phrase entry, duplicate and blank-entry recovery, three-phrase limit, remove/Undo, malformed import, unsupported/local-only caption recovery, session stop/caption clearing, keyboard and Back focus, touch targets, no overflow, route titles, links, demo isolation, privacy/network requests, and the designed 404. The clean build is the same product image as live, as the hashes prove.

## Earlier finding disposition

All earlier review, verification, and polish records were inspected.

| Earlier record | Current disposition and proof |
| --- | --- |
| Verification 1 `B-1`, `H-1`, `M-1`, `M-2`, `L-1` | Static native/package, malformed-import, versioned worker/offline, build-budget, and host-policy tests pass. |
| Review 1 `F-1-1`–`F-1-58` | First screen, demo isolation, claims, metadata, navigation, touch targets, package, privacy, and legal checks pass in the current suite and live hash-matched build. |
| Review 1 `F-1-59`–`F-1-97` | Landing, demo, README, and legal copy remain short and literal under the current copy audit; R5-1 is a newly found omission because the audit does not include the 404 label. |
| Review 2 `F-2-1`–`F-2-13` | Populated demo, support states, contrast, spelling entry, privacy/legal wording, and unavailable-purchase treatment pass. |
| Review 3 | Its no-ID demo, claims, structure, accessibility, and copy conclusions were reproduced except for R5-1. |
| Review 4 `F-4-1` | The exact local-only recognition recovery claim passes from the clean suite; recognition never starts when local captions cannot be confirmed. |
| Verification 2 and Verification 3 | Their clean build, browser, claim, live hash, header, and PWA evidence still applies to the same implementation candidate; this review reproduced the listed commands and live hash comparison. |

## Hardware boundary

Physical Android-device testing remains the documented boundary: install a debug build on Android 12+, grant microphone permission, use an installed offline language pack, speak a configured phrase, and confirm physical vibration. It is not a public claim, so it is not counted as an untested claim.
