# Adversarial first-read review 2 — FAIL

Reviewed 28 August 2026 against repository commit `8fad78a3f454a1121a40ad005f2b859560082fed` and <https://name-vibration-captions.sociobot.in>. The deployed JS and CSS are byte-identical to the clean-clone build.

## Verdict

**FAIL.** The landing screen itself is clear, but the one-click demo does not show the sample in its first viewport. A registered availability claim can also display a false positive, and several public claims are not tested as written. PASS requires zero findings and no untested claim.

## Thirty-second first read

| View | What this does | For whom | First click | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | It watches local captions for my chosen name or phrase, then alerts me with a tap. | Hard-of-hearing people following group conversations. | **Try it with sample data**. | Clear; all three answers and the three facts are visible without scrolling. |
| 1440 × 1000 | The same job is clear, with the phone art reinforcing the vibration result. | Hard-of-hearing people following group conversations. | **Try it with sample data**. | Clear; all three answers and the three facts are visible without scrolling. |

The successful first-screen copy is: “Feel a tap when someone says your name,” “For hard-of-hearing people who want to follow group conversations without watching captions,” and “Try it with sample data.”

## Blocking findings

### F-2-1 — The demo opens on another landing hero, not the product in use

Reopens earlier finding **F-1-2**.

Location: live `/?demo=1` and `/demo`, immediately after selecting **Try it with sample data**. The first viewport shows the banner and repeats “Feel a tap when someone says your name,” the audience sentence, the same demo action, and the three landing facts. The useful sample — “Maya was heard,” “Can Maia bring the blue folder?”, and “HEARD · MAYA” — starts at y=1,737 px on 390×844 and y=1,155 px on 1440×1000. It does not intersect either viewport.

Why this fails: the required first screen after one click must already look like the product being used. A phone visitor has to scroll more than two screens before seeing sample output and can reasonably conclude the click only reloaded the landing page.

Concrete fix: make the demo route open with the matched-caption board at the top, directly below the persistent banner. Keep **Replay sample alert**, the seeded phrases, and the setup controls below it. Add a test that clicks the landing CTA and asserts the sample board's bounding box intersects the viewport at both 390×844 and desktop.

### F-2-2 — “Local captions are available” can be a false positive

Reopens earlier finding **F-1-14**.

Location: live setup status, `src/speech.ts`, and `@claim:support-detection`. Exact copy: “Local captions are available.” `localSpeechSupport()` reports `ready` when `processLocally` merely exists on the recognition prototype. It does not call the browser's asynchronous `SpeechRecognition.available({ langs, processLocally: true })` probe.

Independent reproduction: a browser stub with `processLocally` present and `available()` returning `unavailable` still rendered `data-support="ready"` and “Local captions are available.” The registered claim command passes because its test supplies only the prototype property; it does not exercise an unavailable result. This makes the claim test pass while the promised state is false.

Concrete fix: keep the status pending until an asynchronous probe for the selected language returns an available state. Show “needs download” and “unavailable” separately. Extend `@claim:support-detection` with available, downloadable, unavailable, rejected, and language-change cases; the unavailable fixture must never render “available.”

### F-2-3 — “Full-screen visual alert” is stronger than its registered claim and test

Reopens earlier finding **F-1-22**.

Location: landing settings, `.factory/claims.json`, and `tests/e2e/app.spec.ts`. The UI says “Full-screen visual alert.” The registry instead promises a “full-board alert,” and the test only checks a below-the-fold `.demo-sample` panel's class and two computed colours. It never asserts a full-screen state.

Concrete fix: either rename the setting to **High-contrast visual alert**, or start the demo listening session in `@claim:visual-alert` and assert the alert surface covers the viewport at 390×844 and desktop, in addition to checking contrast.

## Major findings

### F-2-4 — The comma-entry instructions are not covered by the spelling claim

Location: landing form. Exact copy: “Add other spellings after commas.” and “The first entry becomes the label.” The `spelling-variants` claim test uses already-seeded Maya/Maia data. It never enters comma-separated text or proves that the first entry becomes the label.

Concrete fix: expand the registered claim wording and test to enter `Maya, Maia` through the real form, verify label `Maya`, verify “Other spellings: Maia,” and then prove that a Maia caption matches.

### F-2-5 — License-token privacy claims have no registered test

Location: live `/privacy`. Exact copy: “Your phrases, language, alert choices, and license token stay in this browser or app.” and “Sociobot receives a license token only when you restore a prior purchase. Audio, captions, and phrases are not included.” Existing privacy tests exercise free demo use only; none injects a license return, inspects local storage, or checks the verification request contents.

Concrete fix: add one claim entry and test that returns with a fixture license, verifies the namespaced local value, intercepts the Sociobot request, and proves that only the token is sent. If purchase restoration is intentionally unavailable, remove the dormant flow and these statements.

### F-2-6 — The privacy headline overstates what remains local

Location: live `/privacy` h1. Exact copy: “Privacy stays on your device.” The same page says the host may keep logs and Sociobot may receive a license token. Privacy is not data, and not everything described by the page stays on the device.

Concrete fix: use the factual heading “How Name Tap handles your data.” Keep the scoped claims about phrases, captions, host logs, and license checks in the sections below.

### F-2-7 — README's claim-coverage statement is false

Location: `README.md`. Exact copy: “Every public statement has an observable test in `.factory/claims.json`.” F-2-2 through F-2-5 show counterexamples, including a passing test that does not prove its registered wording.

Concrete fix: remove this sentence until a copy-to-claim inventory check fails the build for unregistered or mismatched claims. Then restore it only after the gaps above have observable tests.

## Minor copy findings

### F-2-8 — “tap pattern” introduces a second term

Location: demo action help. Exact copy: “Requests the tap pattern and flashes this board.” The product otherwise calls the physical output a vibration.

Concrete fix: “Requests the vibration pattern and flashes this board.”

### F-2-9 — “axe” is unexplained README jargon

Location: `README.md`. Exact copy: “The suite covers keyboard use, axe, privacy, offline reload, demo isolation, imports, routing, and touch targets.”

Concrete fix: “The suite checks keyboard use, automated accessibility rules, privacy, offline use, demo isolation, imports, routes, and touch targets.”

### F-2-10 — “native vibration waveform” is implementation jargon

Location: `README.md`. Exact copy: “Matches trigger the native vibration waveform.”

Concrete fix: “A match asks Android to play the vibration pattern.”

### F-2-11 — “off origin” is privacy jargon

Location: `README.md`. Exact copy: “Free use sends no phrase or caption data off origin.”

Concrete fix: “Free use sends no phrases or captions to another site.”

### F-2-12 — Purchase status is written as internal infrastructure language

Location: `README.md`. Exact copy: “New purchases are hidden because this product’s hosted checkout is not registered. Visitors are never sent to the broken endpoint.” “Hosted checkout,” “registered,” and “endpoint” describe implementation rather than the user outcome.

Concrete fix: “New purchases are unavailable. The app does not show a purchase link.”

### F-2-13 — “short security logs” has no defined duration

Location: live `/privacy`. Exact copy: “The web host may keep short security logs.” A privacy reader cannot tell whether “short” means hours, days, or months.

Concrete fix: state the host, fields, and maximum retention period, or say “The web host may keep request logs under its published retention policy” and link that policy.

## Demo and sandbox evidence

The demo is otherwise correctly isolated:

- A real phrase named `REAL PRIVATE PHRASE` was saved before entering the demo. It was not visible in demo mode.
- Instrumenting `indexedDB.open` showed zero database opens while entering and changing the demo.
- Removing Maya and selecting **Reset demo** restored Maya.
- Selecting **Start for real** restored `REAL PRIVATE PHRASE`; demo changes did not overwrite it.
- The banner “Demo — sample data, nothing is saved,” **Reset demo**, and **Start for real** persist in demo setup and listening views.
- After one live visit and service-worker activation, an offline reload retained the banner and “Maya was heard.”
- Live request interception during the exercised demo found no off-origin request.

The sandbox passes isolation and reset. It fails only the required immediate product-in-use presentation in F-2-1.

## Claims registry results

All 25 commands were run individually from clean clone `/tmp/name-tap-review2.vJO8Zb`. Every command exited 0. Passing a command does not close F-2-2 or F-2-3 because those tests do not assert the published wording.

| Claim ID | Result |
| --- | --- |
| `vibration-on-match` | PASS |
| `no-recording` | PASS |
| `no-account` | PASS |
| `spelling-variants` | PASS; coverage gap in F-2-4 |
| `device-only-data` | PASS |
| `free-tier` | PASS |
| `local-only-recognition` | PASS |
| `support-detection` | PASS command; false-positive case fails independently (F-2-2) |
| `explicit-session` | PASS |
| `captions-cleared` | PASS |
| `matcher` | PASS |
| `local-settings` | PASS |
| `export-no-captions` | PASS |
| `haptics` | PASS |
| `visual-alert` | PASS command; full-screen wording remains untested (F-2-3) |
| `settings-round-trip` | PASS |
| `offline-reload` | PASS |
| `unsupported-browser` | PASS |
| `no-analytics` | PASS |
| `non-goals` | PASS |
| `build-artifacts` | PASS |
| `native-caption-bridge` | PASS |
| `android-package` | PASS |
| `license-file` | PASS |
| `asset-provenance` | PASS |

## Complete copy audit

Counts ignore standalone separators such as `/`, `·`, and `—`; hyphenated terms count as one word. Repeated wordmarks and navigation labels are listed once. Language-option names and code blocks are not sentences. No sentence exceeds 22 words, and no banned marketing adjective appears.

### Default landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Name Tap | 2 | Pass |
| Demo | 1 | Pass; destination link |
| How it works | 3 | Pass; destination link and section label |
| Privacy | 1 | Pass; destination link |
| Phrases stay on this device. | 5 | Pass; `device-only-data` |
| Private name alert | 3 | Pass |
| Feel a tap when someone says your name | 8 | Pass |
| For hard-of-hearing people who want to follow group conversations without watching captions. | 12 | Pass |
| Try it with sample data | 5 | Pass |
| Loads a sample caption and name alert. | 7 | Pass |
| Speech becomes local captions on your device. | 7 | Pass; local-only claims |
| No recording or account. | 4 | Pass; registered claims |
| Three phrases are free. | 4 | Pass; `free-tier` |
| Speech nearby | 2 | Pass |
| Your private alert | 3 | Pass |
| 1 / Choose a phrase | 4 | Pass |
| Choose a name or urgent phrase | 6 | Pass |
| Add a name, nickname, or urgent phrase. | 7 | Pass |
| Add other spellings after commas. | 5 | F-2-4 |
| Name or phrase, with other spellings | 6 | Pass |
| Add phrase | 2 | Pass; result-naming action |
| The first entry becomes the label. | 6 | F-2-4 |
| Phrase settings stay on this device. | 6 | Pass; registered claim |
| No phrases yet. | 3 | Pass |
| Add the phrase you most need to notice. | 8 | Pass |
| 0 / 3 phrases | 3 | Pass |
| Three phrases included | 3 | Pass |
| 2 / Start a session | 4 | Pass |
| Start local listening | 3 | Pass |
| Conversation language | 2 | Pass |
| Audio is not recorded. | 4 | Pass; `no-recording` |
| Name Tap turns speech into text on this device. | 9 | Pass; local-only claims |
| It stops if local captions are unavailable. | 7 | Pass; `local-only-recognition` |
| I told people nearby that captions are on, and I follow local consent laws. | 14 | Pass |
| Start listening | 2 | Pass; result-naming action |
| Add a phrase first | 4 | Pass; disabled-state instruction |
| Local captions are available | 4 | F-2-2 |
| Get an alert without watching captions | 6 | Pass |
| Choose your phrases | 3 | Pass |
| Add three phrases and the alternate spellings you know. | 9 | Pass |
| Start local captions | 3 | Pass |
| Listening starts only after you consent. | 6 | Pass; `explicit-session` |
| Captions disappear when you stop. | 5 | Pass; `captions-cleared` |
| Feel the match | 3 | Pass |
| Name Tap checks each caption against your phrases. | 8 | Pass; `matcher` |
| Confirm important instructions yourself. | 4 | Pass |
| Your controls | 2 | Pass |
| Choose your alerts | 3 | Pass |
| Phrase settings stay on this device. | 6 | Pass; repeated |
| Temporary captions never enter the settings file. | 7 | Pass; `export-no-captions` |
| Vibration alert | 2 | Pass |
| Requests your device vibration motor | 5 | Pass; `haptics` |
| Full-screen visual alert | 3 | F-2-3 |
| Shows a high-contrast phrase alert | 5 | F-2-3 |
| Move your saved phrases | 4 | Pass |
| Temporary captions are excluded | 4 | Pass; `export-no-captions` |
| Export settings | 2 | Pass; result-naming action |
| Import settings | 2 | Pass; result-naming action |
| Clear limits | 2 | Pass |
| Not a recorder or emergency service | 6 | Pass |
| Name Tap does not identify speakers. | 6 | Pass; `non-goals` |
| Speech recognition can miss or falsely match words. | 8 | Pass; limitation |
| Get a private tap when someone says your chosen phrase. | 10 | Pass |
| Terms | 1 | Pass; destination link |
| Support | 1 | Pass; mail link |
| Built by Param Factory · Build 1.1.0-polish1 | 6 | Pass |
| Original generated illustration · MIT licensed | 5 | Pass; registered provenance/license claims |

### Demo-only copy

| Copy | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved | 6 | Pass; registered isolation claim |
| Reset demo | 2 | Pass; result-naming action |
| Start for real | 3 | Pass; required demo exit action |
| Sample session · local captions | 4 | Pass |
| Maya was heard | 3 | Pass |
| Can Maia bring the blue folder? | 6 | Pass |
| HEARD · MAYA | 2 | Pass |
| The alternate spelling “Maia” matched the saved phrase “Maya.” | 9 | Pass; `spelling-variants` |
| Replay sample alert | 3 | Pass; result-naming action |
| Requests the tap pattern and flashes this board. | 8 | F-2-8 |
| Test vibration | 2 | Pass; result-naming action |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Name Tap | 2 | Pass; document title |
| Name Tap alerts hard-of-hearing people when a chosen phrase is spoken in a group conversation. | 15 | Pass |
| It uses local captions during a session you start. | 9 | Pass |
| A match triggers a vibration and high-contrast visual alert. | 9 | Pass |
| Name Tap is not a recorder, speaker identifier, or emergency service. | 11 | Pass |
| Speech recognition can miss or falsely match words. | 8 | Pass |
| Live: [URL] | 2 | Pass |
| Sample: [URL] | 2 | Pass |
| What it does | 3 | Pass; heading |
| Matches phrases, alternate spellings, close caption text, and similar sounds. | 10 | Pass |
| Stops when the device cannot guarantee local captions. | 8 | Pass |
| Keeps phrase settings on the device. | 6 | Pass |
| Removes temporary captions when listening stops. | 6 | Pass |
| Exports and imports phrase settings as JSON. | 7 | Pass; JSON is named because this is developer documentation |
| Temporary captions are excluded. | 4 | Pass |
| Includes three phrases, visual alerts, vibration alerts, and export without a license. | 12 | Pass |
| Opens the isolated sample offline after its first visit. | 9 | Pass |
| The sample runs in memory. | 5 | Pass |
| It never opens or changes the real phrase database. | 9 | Pass |
| See `.factory/demo.md`. | 2 | Pass |
| Every public statement has an observable test in `.factory/claims.json`. | 9 | F-2-7 |
| Run and verify | 3 | Pass; heading |
| Use Node.js 20 or newer. | 5 | Pass |
| `npm run build` writes the static site to `dist/`. | 9 | Pass |
| It creates direct demo, privacy, terms, and not-found pages. | 9 | Pass |
| It also versions the offline worker from built asset names. | 10 | Pass |
| Playwright 1.58.2 runs desktop and 390 px mobile checks. | 9 | Pass |
| The suite covers keyboard use, axe, privacy, offline reload, demo isolation, imports, routing, and touch targets. | 16 | F-2-9 |
| Run each `test` command in `.factory/claims.json` from a clean checkout. | 10 | Pass |
| Each claim test starts from the sample where browser behavior is required. | 12 | Pass |
| Android project | 2 | Pass; heading |
| `android/` is the Capacitor project. | 5 | Pass in developer context |
| Its application ID is `in.sociobot.namevibrationcaptions`. | 5 | Pass |
| It declares microphone and vibration access. | 6 | Pass |
| `LocalSpeechPlugin` asks for microphone access when listening starts. | 8 | Pass; exact code name in developer context |
| It uses Android’s on-device recognizer and requests offline recognition. | 9 | Pass |
| Caption text stays temporary. | 4 | Pass |
| Matches trigger the native vibration waveform. | 6 | F-2-10 |
| Android 12 or newer and an installed offline language pack are required for hardware testing. | 15 | Pass |
| Never commit a release keystore. | 5 | Pass |
| Hardware acceptance needs a compatible Android device: | 7 | Pass |
| Install the debug build. | 4 | Pass |
| Grant microphone access. | 3 | Pass |
| Confirm local recognition is available. | 5 | Pass |
| Speak a saved phrase. | 4 | Pass |
| Confirm the visual alert and physical vibration. | 7 | Pass |
| Privacy and purchases | 3 | Pass; heading |
| Name Tap loads no analytics, trackers, third-party fonts, or runtime scripts. | 11 | Pass; `no-analytics` |
| Free use sends no phrase or caption data off origin. | 10 | F-2-11 |
| New purchases are hidden because this product’s hosted checkout is not registered. | 12 | F-2-12 |
| Visitors are never sent to the broken endpoint. | 8 | F-2-12 |
| Read the user-facing privacy policy and terms. | 7 | Pass |
| Product records | 2 | Pass; heading |
| `.factory/brief.json` defines the researched need. | 5 | Pass |
| `.factory/design.md` records the visual system and image provenance. | 8 | Pass |
| `.factory/polish-1.md` maps review findings to repair evidence. | 7 | Pass |
| `.factory/handoff.md` records final verification and deployment. | 6 | Pass |
| License | 1 | Pass; heading |
| MIT — see `LICENSE`. | 3 | Pass; `license-file` |

All headings not flagged above make sense out of context. All visible buttons use result-naming verbs. Terminology is consistent except F-2-8.

## Site structure and accessibility

| Check | Result |
| --- | --- |
| Titles | PASS — home is “Name Tap — alerts when your phrase is spoken”; Demo, Privacy, Terms, and 404 use route-specific titles. |
| Semantics | PASS — `lang="en"`, one h1, one main, ordered headings, shared header/footer. |
| Metadata | PASS — route descriptions/canonicals, OG/Twitter tags, 1200×630 image, SVG favicon, 180 px Apple icon, and theme colour. |
| Routing | PASS — direct routes load; SPA navigation and Back focus and announce the new h1 after rendering. |
| 404 | PASS — unknown routes return HTTP 404 and the designed signal-board page with home/sample actions. |
| Link crawl | PASS — every internal link/anchor resolves; `mailto:` links are explicit exceptions. |
| Accessibility | PASS — live Playwright axe checks found zero serious/critical violations at 390×844 and desktop; targets and overflow pass. |
| Console | PASS on `/`, demo, Privacy, and Terms; no page or console errors. |
| Offline/privacy | PASS except registered-claim gaps above — offline demo reload works and exercised demo requests stay same-origin. |
| Visual identity | PASS — the signal-board neo-brutalist art, hard shadows, chartreuse signal colour, and equipment-label typography are product-specific, not a generic SaaS template. |
| Payload | PASS — JS 41,615 bytes / 14.64 KB gzip; CSS 21,020 bytes / 5.45 KB gzip. |

`robots.txt` and `sitemap.xml` return 200; the sitemap lists `/`, `/demo`, `/privacy`, and `/terms`. CSP, referrer, no-sniff, frame denial, and microphone-only permissions headers are live.

## Earlier-finding audit

Evidence keys: **L** live inspection, **C** current source inspection, **T** clean-clone automated test, **R** current registry command. “Reopened” means the prior repair is incomplete under this round's test.

| Earlier ID | Result | Evidence |
| --- | --- | --- |
| F-1-1 | Fixed | L: first screen names the job and hard-of-hearing audience. |
| F-1-2 | **Reopened as F-2-1** | L/C: isolation works, but sample output is below both initial viewports. |
| F-1-3 | Fixed | C/R: 25 registered, uniquely tagged claims exist and ran. |
| F-1-4 | Fixed | L/C: dead purchase link is absent. |
| F-1-5 | Fixed | L/T: unknown route returns designed HTTP 404. |
| F-1-6 | Fixed | R: `vibration-on-match`. |
| F-1-7 | Fixed | R: `no-recording`. |
| F-1-8 | Fixed | R: `no-account`. |
| F-1-9 | Fixed | L/R: Maia visibly maps to Maya. |
| F-1-10 | Fixed | L/R: same-origin demo network audit. |
| F-1-11 | Fixed | R: concrete three-phrase free tier. |
| F-1-12 | Fixed | R: recording instrumentation. |
| F-1-13 | Fixed | R/C: remote-only recognition is refused. |
| F-1-14 | **Reopened as F-2-2** | L/C: unavailable probe can still render “available.” |
| F-1-15 | Fixed | R: capacity and spelling claims are split. |
| F-1-16 | Fixed | R: explicit-session gate. |
| F-1-17 | Fixed | R: captions clear on stop. |
| F-1-18 | Fixed | R: matcher positives and false positive. |
| F-1-19 | Fixed | L/R: real storage and demo memory remain separate. |
| F-1-20 | Fixed | R: exported settings exclude captions. |
| F-1-21 | Fixed | R: exact vibration waveform request. |
| F-1-22 | **Reopened as F-2-3** | C/R: colours are tested; advertised full-screen size is not. |
| F-1-23 | Fixed | R: two-workspace settings round trip. |
| F-1-24 | Fixed | L: “forever” is absent. |
| F-1-25 | Fixed | L: future paid promise is absent. |
| F-1-26 | Fixed | L: unavailable entitlements are absent. |
| F-1-27 | Fixed | L/R: checkout account claim removed; free no-account claim tested. |
| F-1-28 | Fixed | L: US$7 offer is absent. |
| F-1-29 | Fixed | L: merchant/refund marketing is absent. |
| F-1-30 | Fixed | R: analytics and asset provenance tests pass. |
| F-1-31 | Fixed | L/R: limits section and non-goals test. |
| F-1-32 | Fixed | L/R: README audience and device boundary are plain and tested. |
| F-1-33 | Fixed | R: session, vibration, and visual behaviors are split. |
| F-1-34 | Fixed | L/R: explicit limitation and non-goals test. |
| F-1-35 | Fixed | R: matcher wording and fixtures. |
| F-1-36 | Fixed | R/C: browser refusal and native bridge. |
| F-1-37 | Fixed | R: captions and settings storage separated. |
| F-1-38 | Fixed | L/R: installed sample reloads offline. |
| F-1-39 | Fixed | R: settings round trip and caption exclusion. |
| F-1-40 | Fixed | R: free feature bundle. |
| F-1-41 | Fixed | L: unavailable checkout offer removed. |
| F-1-42 | Fixed | C: hardware requirements are stated as requirements. |
| F-1-43 | Fixed | R: unsupported browser gives a next step. |
| F-1-44 | Fixed | T/R: build instruction succeeds. |
| F-1-45 | Fixed | R: named build artifacts exist. |
| F-1-46 | Fixed | C/T: current 48-test suite contains and passes each listed category; wording issue is separately F-2-9. |
| F-1-47 | Fixed | R/C: package and permissions checks. |
| F-1-48 | Fixed | R/C: native bridge behavior. |
| F-1-49 | Fixed | R/C: unavailable paths and Android requirements. |
| F-1-50 | Fixed | C: unbuilt APK-output promise remains absent. |
| F-1-51 | Fixed | L/R: no analytics or third-party runtime. |
| F-1-52 | Fixed | C: cache implementation claim remains absent from README. |
| F-1-53 | Fixed | L: merchant claim remains absent. |
| F-1-54 | Fixed | L/T: full route metadata and social image. |
| F-1-55 | Fixed | L/T: shared header/footer on all routes. |
| F-1-56 | Fixed | L/T: navigation and Back focus/announcement. |
| F-1-57 | Fixed | T: computed 44 px targets at both viewports. |
| F-1-58 | Fixed | L/T: linked 180×180 Apple icon. |
| F-1-59 | Fixed | L: “Private name alert.” |
| F-1-60 | Fixed | L: scoped device-storage status. |
| F-1-61 | Fixed | L: first-screen wording explains captions. |
| F-1-62 | Fixed | L: required sample action and outcome. |
| F-1-63 | Fixed | L: “Choose a phrase.” |
| F-1-64 | Fixed | L: concrete phrase heading. |
| F-1-65 | Fixed | L: “other spellings.” |
| F-1-66 | Fixed | L: “Start local listening.” |
| F-1-67 | Fixed | L: consent note uses direct sentences. |
| F-1-68 | Fixed | L/R: matcher wording is concrete. |
| F-1-69 | Fixed | L: “Choose your alerts.” |
| F-1-70 | Fixed | L: “Move your saved phrases.” |
| F-1-71 | Fixed | L/R: **Export settings**. |
| F-1-72 | Fixed | L/R: **Import settings**. |
| F-1-73 | Fixed | L: vague paid heading absent. |
| F-1-74 | Fixed | L: dead purchase action absent. |
| F-1-75 | Fixed | L/R: **Test vibration**. |
| F-1-76 | Fixed | L: concrete footer result. |
| F-1-77 | Fixed | L: phrase/alert/captions terminology is consistent except new F-2-8. |
| F-1-78 | Fixed | C: README opening is split and under the cap. |
| F-1-79 | Fixed | C: feature summary avoids algorithm jargon. |
| F-1-80 | Fixed | C: browser/native wording is split. |
| F-1-81 | Fixed | C: storage internals left the feature summary. |
| F-1-82 | Fixed | C/R: concrete offline result. |
| F-1-83 | Fixed | C/R: JSON and caption exclusion split. |
| F-1-84 | Fixed | C: hardware requirement wording. |
| F-1-85 | Fixed | L/R: exact unsupported-browser behavior. |
| F-1-86 | Fixed | C/R: build output split and tested. |
| F-1-87 | Fixed | C/T: test wording shortened; new jargon issue is F-2-9. |
| F-1-88 | Fixed | C/R: Android details split. |
| F-1-89 | Fixed | C/R: plugin behavior split. |
| F-1-90 | Fixed | C: Android requirements split. |
| F-1-91 | Fixed | C: hardware check is a numbered list. |
| F-1-92 | Fixed | L: user privacy copy avoids “runtime CDN”; README developer copy names scripts/fonts. |
| F-1-93 | Fixed | C: product records are bullets. |
| F-1-94 | Fixed | C: README opens with audience and job. |
| F-1-95 | Fixed | C/T: Node engine is declared and clean install succeeds. |
| F-1-96 | Fixed | R: MIT file and references agree. |
| F-1-97 | Fixed | L/R: header scope is phrases, not all processing. |
| B-1 | Fixed in code | C/R: native plugin registration and on-device recognizer exist; physical hardware remains outside this sandbox. |
| H-1 | Fixed | T: malformed import is rejected before persistence and reload remains usable. |
| M-1 | Fixed | T/R: content-derived worker cache and update artifacts. |
| M-2 | Fixed | C/L: expensive texture is absent; deployed bundle is unchanged from the prior 100 Lighthouse build. |
| L-1 | Fixed | L/T: CSP, framing, permissions, cache rules, and manifest MIME are present. |

## Verification record

| Check | Result |
| --- | --- |
| Clean clone | `/tmp/name-tap-review2.vJO8Zb` at `8fad78a` |
| `npm ci` | PASS — 150 packages; zero vulnerabilities |
| All 25 claims commands | PASS individually |
| `npm run lint` | PASS |
| `npm test` | PASS — 19/19 |
| `npm run build` | PASS; `dist/` created and budgets passed |
| `npm run test:e2e` | PASS — 48/48 on immediate rerun. The first full-suite attempt had one Chromium process SIGSEGV before test setup, while the same claim command had already passed individually. |
| Factory URL verifier | PASS on home, demo, Privacy, and Terms |
| Live axe | Zero serious/critical findings on all audited routes at 390×844; the repository suite repeats desktop/mobile scans |
| Live/local equality | JS SHA-256 `00f0046…bd64`; CSS `0bdd336…6110` |
| Android hardware | Not available in this container; native behavior was inspected and static tests passed |

## Missed leverage

No AI feature is warranted. The core task is deterministic local caption matching, and sending conversation text to a model would weaken the product's privacy premise. Settings import/export already covers the obvious portability need. Sync is not an obvious omission for this local-first tool.

## What would make this perfect

Open the demo directly on the already-matched caption board. Replace the capability heuristic with a real language-aware availability probe. Make every public claim match an observable test, especially full-screen alert behavior, comma-entry parsing, and license-token privacy. Then remove the six copy ambiguities above and rerun this entire review from a fresh phone and desktop context.
