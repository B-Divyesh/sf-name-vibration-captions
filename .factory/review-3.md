# Adversarial first-read review 3 — PASS

Reviewed 2026-08-28 against <https://name-vibration-captions.sociobot.in> and clean clone `/tmp/name-tap-review3.5SSa1o` at `67f8ac3`.

## Verdict

**PASS.** There are zero blocking, major, minor, or untested-claim findings. This report assigns no `F-3-*` IDs.

## Thirty-second cold read

Fresh 390 × 844 and 1440 × 1000 Chromium contexts, before scrolling, gave the same answer:

| Question | What the first screen says |
| --- | --- |
| What does it do? | It gives a phone vibration/visual alert when a chosen name or phrase appears in local captions. |
| For whom? | “For hard-of-hearing people who want to follow group conversations without watching captions.” |
| What should I click first? | **Try it with sample data**; the adjacent line says “Loads a sample caption and name alert.” |

The h1, “Feel a tap when someone says your name,” is eight words, job-first, and unambiguous in the surrounding context. No first-screen blocking finding.

## Complete copy audit

Hyphenated terms count as one word. Headings, labels, buttons, and short UI statements are included because they must work out of context. All are at or below 22 words; there are no banned marketing terms, unexplained jargon, inconsistent core terms, or non-result naming buttons.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Private name alert | 3 | Pass |
| Feel a tap when someone says your name | 8 | Pass |
| For hard-of-hearing people who want to follow group conversations without watching captions. | 12 | Pass |
| Try it with sample data | 5 | Pass |
| Loads a sample caption and name alert. | 7 | Pass |
| Speech becomes local captions on your device. | 7 | Pass |
| No recording or account. | 4 | Pass |
| Three phrases are free. | 4 | Pass |
| Speech nearby | 2 | Pass |
| Your private alert | 3 | Pass |
| 1 / Choose a phrase | 4 | Pass |
| Choose a name or urgent phrase | 6 | Pass |
| Add a name, nickname, or urgent phrase. | 7 | Pass |
| Add other spellings after commas. | 5 | Pass |
| Name or phrase, with other spellings | 7 | Pass |
| Add phrase | 2 | Pass |
| The first entry becomes the label. | 6 | Pass |
| Phrase settings stay on this device. | 6 | Pass |
| No phrases yet. | 3 | Pass |
| Add the phrase you most need to notice. | 9 | Pass |
| Three phrases included | 3 | Pass |
| 2 / Start a session | 4 | Pass |
| Start local listening | 3 | Pass |
| Conversation language | 2 | Pass |
| Audio is not recorded. | 4 | Pass |
| Name Tap turns speech into text on this device. | 9 | Pass |
| It stops if local captions are unavailable. | 7 | Pass |
| I told people nearby that captions are on, and I follow local consent laws. | 14 | Pass |
| Start listening | 2 | Pass |
| Add a phrase first | 4 | Pass |
| This browser cannot confirm local captions | 6 | Pass; status, while the attempted-start error gives the recovery step. |
| How it works | 3 | Pass |
| Get an alert without watching captions | 7 | Pass |
| Choose your phrases | 3 | Pass |
| Add three phrases and the alternate spellings you know. | 9 | Pass |
| Start local captions | 3 | Pass |
| Listening starts only after you consent. | 6 | Pass |
| Captions disappear when you stop. | 5 | Pass |
| Feel the match | 3 | Pass |
| Name Tap checks each caption against your phrases. | 8 | Pass |
| Confirm important instructions yourself. | 4 | Pass |
| Your controls | 2 | Pass |
| Choose your alerts | 3 | Pass |
| Temporary captions never enter the settings file. | 7 | Pass |
| Vibration alert | 2 | Pass |
| Requests your device vibration motor | 5 | Pass |
| High-contrast visual alert | 3 | Pass |
| Flashes the matched phrase in black and bright green | 9 | Pass |
| Move your saved phrases | 4 | Pass |
| Temporary captions are excluded | 4 | Pass |
| Export settings | 2 | Pass |
| Import settings | 2 | Pass |
| Clear limits | 2 | Pass |
| Not a recorder or emergency service | 6 | Pass |
| Name Tap does not identify speakers. | 6 | Pass |
| Speech recognition can miss or falsely match words. | 8 | Pass |
| Get a private tap when someone says your chosen phrase. | 10 | Pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Name Tap | 2 | Pass |
| Name Tap alerts hard-of-hearing people when a chosen phrase is spoken in a group conversation. | 15 | Pass |
| It uses local captions during a session you start. | 9 | Pass |
| A match triggers a vibration and high-contrast visual alert. | 9 | Pass |
| Name Tap is not a recorder, speaker identifier, or emergency service. | 11 | Pass |
| Speech recognition can miss or falsely match words. | 8 | Pass |
| What it does | 4 | Pass |
| Matches phrases, alternate spellings, close caption text, and similar sounds. | 9 | Pass |
| Stops when the device cannot guarantee local captions. | 8 | Pass |
| Keeps phrase settings on the device. | 6 | Pass |
| Removes temporary captions when listening stops. | 6 | Pass |
| Exports and imports phrase settings as JSON. | 8 | Pass |
| Temporary captions are excluded. | 4 | Pass |
| Includes three phrases, visual alerts, vibration alerts, and export at no charge. | 11 | Pass |
| Opens the isolated sample offline after its first visit. | 9 | Pass |
| The sample runs in memory. | 5 | Pass |
| It never opens or changes the real phrase database. | 10 | Pass |
| Run and verify | 3 | Pass |
| Use Node.js 20 or newer. | 6 | Pass |
| `npm run build` writes the static site to `dist/`. | 9 | Pass |
| It creates direct demo, privacy, terms, and not-found pages. | 9 | Pass |
| It also versions the offline worker from built asset names. | 10 | Pass |
| Playwright 1.58.2 runs desktop and 390 px mobile checks. | 9 | Pass |
| The suite checks keyboard use, automated accessibility rules, privacy, offline use, demo isolation, imports, routes, and touch targets. | 17 | Pass |
| Run each `test` command in `.factory/claims.json` from a clean checkout. | 10 | Pass |
| Each claim test starts from the sample where browser behavior is required. | 12 | Pass |
| After deployment, run the cold production audit. | 8 | Pass |
| Android project | 2 | Pass |
| `android/` is the Capacitor project. | 5 | Pass |
| Its application ID is `in.sociobot.namevibrationcaptions`. | 6 | Pass |
| It declares microphone and vibration access. | 6 | Pass |
| `LocalSpeechPlugin` asks for microphone access when listening starts. | 7 | Pass |
| It uses Android’s on-device recognizer and requests offline recognition. | 9 | Pass |
| Caption text stays temporary. | 4 | Pass |
| A match asks Android to play the vibration pattern. | 10 | Pass |
| Android 12 or newer and an installed offline language pack are required for hardware testing. | 15 | Pass |
| Never commit a release keystore. | 6 | Pass |
| Hardware acceptance needs a compatible Android device. | 7 | Pass |
| Install the debug build. | 5 | Pass |
| Grant microphone access. | 3 | Pass |
| Confirm local recognition is available. | 5 | Pass |
| Speak a saved phrase. | 5 | Pass |
| Confirm the visual alert and physical vibration. | 7 | Pass |
| Privacy and purchases | 3 | Pass |
| Name Tap loads no analytics, trackers, third-party fonts, or runtime scripts. | 11 | Pass |
| Free use sends no phrases or captions to another site. | 10 | Pass |
| New purchases are unavailable. | 4 | Pass |
| The app does not show a purchase link. | 9 | Pass |
| Product records | 2 | Pass |
| `.factory/brief.json` defines the researched need. | 5 | Pass |
| `.factory/design.md` records the visual system and image provenance. | 8 | Pass |
| `.factory/polish-2.md` maps every review finding to repair evidence. | 8 | Pass |
| `.factory/handoff.md` records final verification and deployment. | 6 | Pass |
| License | 1 | Pass |
| MIT — see `LICENSE`. | 3 | Pass |

The canonical audit in `.factory/copy-audit.md` agrees with this landing copy and terminology: **phrase**, **alert**, **local captions**, and **demo**.

## Demo and sandbox

The first click opens `?demo=1` directly on the in-use board: **“Maya was heard”**, the realistic caption **“Can Maia bring the blue folder?”**, the Maia → Maya explanation, and **Replay sample alert**. It is visible in both initial viewports.

The persistent **“Demo — sample data, nothing is saved”** banner includes **Reset demo** and **Start for real**. In a fresh live context, Reset restored Maya; the demo had no `demo:` localStorage keys; only the real `name-tap` database appeared after leaving demo; returning to demo did not expose the real phrase. Whole-demo request interception found no off-origin request. The offline-reload claim test passed after service-worker installation.

## Claims and verification

`.factory/claims.json` contains 25 claims, each with one tagged observable test. The fresh-clone aggregate runs exercised every registered tag: `npm test` passed 21/21, and `npm run test:e2e` passed 50/50 (desktop and 390 px mobile); `.last-run.json` records `status: passed`. This includes all browser-backed registry commands and the three static/unit registry commands (`matcher`, `build-artifacts`, native package/bridge, license, and provenance checks). `npm run build`, `npm run lint`, and `npm run audit:live` also passed.

I cross-checked every claim-like landing and README statement against the registry. They map to the registered match/vibration, recording, account, local-only, settings, export, free-tier, offline, privacy, non-goal, build, Android, license, and asset-provenance claims. No unlisted claim remains.

## Earlier-finding audit

Read: `review-1.md`, `review-2.md`, `polish-1.md`, `polish-2.md`, and the preceding handoff. Each earlier finding was rechecked against the current live site and code/test evidence; none is merely marked fixed.

| Earlier IDs | Current confirmation |
| --- | --- |
| B-1, H-1, M-1, M-2, L-1 | Native local recognizer registration, malformed-import recovery, content-versioned worker, small build, and deployed response policy remain covered by the passing unit/browser/build checks. |
| F-1-1 through F-1-5 | Job-first first screen, isolated demo, claim registry, removed purchase link, and designed HTTP 404 are live. |
| F-1-6 through F-1-23 | Vibration, visual alert, no recording/account, spelling variants, local-only handling, consent, temporary captions, matcher, demo isolation, and settings import/export all passed their current tagged tests. |
| F-1-24 through F-1-31 | Unsupported paid promises, merchant copy, and unregistered pricing remain absent; analytics/provenance and limits remain explicit and tested. |
| F-1-32 through F-1-53 | README wording, Android boundary, offline/install behavior, free tier, build/documentation, package/bridge, no-tracker, and license/merchant corrections remain present and pass current checks. |
| F-1-54 through F-1-58 | Per-route metadata, shared chrome, history/focus handling, 44 px controls, and the Apple touch icon pass the browser route/accessibility suite and live crawl. |
| F-1-59 through F-1-97 | The landing and README copy changes remain in the complete audit above; terminology is stable and all former long/jargon/ambiguous wording is absent. |
| F-2-1 | Live demo opens on the matched sample board, not a second landing hero. |
| F-2-2 | The language-aware availability probe covers ready, downloadable, unavailable, rejected, and changed-language states. |
| F-2-3 | The live control says “High-contrast visual alert”; the test measures its exact colours and contrast. |
| F-2-4 | The form test enters `Maya, Maia` and proves the visible Maia → Maya match. |
| F-2-5 through F-2-7 | License-token claims/runtime are absent, Privacy has the scoped h1, and the false blanket test-coverage sentence is absent. |
| F-2-8 through F-2-13 | Current copy uses vibration, explains test/accessibility wording, avoids privacy/infrastructure jargon, and links the published Sociobot privacy policy (HTTP 200). |

## Structure, accessibility, and visual identity

All checked routes (`/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and `/does-not-exist`) have a route-specific title, one h1, one main landmark, description, canonical URL, social image, and favicon. The unknown URL returns HTTP 404. Internal links and the external Sociobot privacy link returned 200; mail links are explicit. Header/footer/legal links are consistent. The existing route test verifies deep links, Back navigation, h1 focus, live announcement, keyboard controls, touch targets, and automated accessibility rules.

The live surface matches the recorded signal-board neo-brutalist system: warm paper, ink borders and offsets, acid signal green, equipment-label type, generated product-specific phone art, and no generic SaaS hero or gradient-card template.

## Missed leverage

No missing AI, import/export, or sync feature is implied by the brief. The product already includes the valuable non-AI settings export/import; local on-device captioning and privacy are central to the job, so adding an AI/provider-key feature would be decorative and undermine the stated boundary.

## What would make this perfect

For this web release, nothing remains to change. Keep the same fresh-context claim, offline, and route checks in the release gate; physical Android-device acceptance remains a separate hardware exercise rather than an unverified web claim.
