# Adversarial first-read review 1 — FAIL

Reviewed 28 August 2026 from repository base `902208fe1a57b6eee687e9c7e4fe040c94b18aca` and the live site at <https://name-vibration-captions.sociobot.in>. The live JS and CSS hashes match the local production build.

## Verdict

**FAIL.** There are blocking findings. A cold visitor is not told who the product is for, there is no sample-data demo, `/demo` reads real saved data, the claims registry is absent, the paid CTA returns 404, and unknown routes render the home page instead of a designed 404. There are also metadata, navigation, touch-target, and copy defects. PASS requires zero findings and no untested claim.

## Thirty-second first read

| View | What I understood before scrolling | For whom | What I would click first | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | The text says it turns “on-device captions” into a vibration for a name or urgent phrase. “On-device captions” still requires prior product knowledge. | Not stated. The brief's hard-of-hearing audience never appears in the first screen. | “Set your attention cue ↓” | **BLOCKING** |
| 1440 × 1000 | Same interpretation; the phone illustration supports the vibration idea. | Not stated. | “Set your attention cue ↓” | **BLOCKING** |

Exact first-screen text that failed: “Feel your name. Keep your eyes up.”, “Name Tap turns on-device captions into a private vibration when your name or an urgent phrase is spoken. No recording. No account.”, and “Set your attention cue ↓”.

## Blocking findings

### F-1-1 — The first screen does not identify its audience

Location: live `/`, both viewports. The hero says “Feel your name. Keep your eyes up.” and “Local attention cue,” but never says “hard-of-hearing.” A first-time visitor can infer a vibration feature but cannot answer who it is for. The headline is also metaphorical rather than the job in the visitor's words.

Concrete fix: use “Feel a tap when someone says your name” as the headline and “For hard-of-hearing people who want to follow group conversations without watching captions” as the supporting sentence.

### F-1-2 — No one-click demo exists, and `/demo` reads real data

Location: first screen, `/demo`, `?demo=1`, source, and repository docs. There is no “Try it with sample data” action, `.factory/demo.md`, sample session, demo banner, **Reset demo**, or **Start for real** control. `/demo` returns the ordinary home app. In a fresh browser context seeded with an IndexedDB phrase named `REAL PRIVATE PHRASE`, visiting `/demo` displayed that real phrase. The sentinel data remained unchanged, but merely reading and exposing it violates demo isolation. The page retained the normal `name-tap` IndexedDB namespace rather than using `demo:` storage. An offline reload of `/demo` also returned the ordinary home app without a demo banner.

Concrete fix: implement `/demo` as a separately namespaced, pre-seeded experience. Its first screen must already show realistic live-caption output and at least one detected phrase. Add the persistent “Demo — sample data, nothing is saved” banner with **Reset demo** and **Start for real**, discard demo state on exit, add the first-screen **Try it with sample data** action, document it in `.factory/demo.md`, and add isolation/reset/offline tests.

### F-1-3 — The required claims registry and claim-tagged tests do not exist

Location: `.factory/claims.json` and the test suite. The file is absent, and `rg '@claim:'` finds no tagged tests. Therefore there were no listed claim commands to run from the clean checkout. `npm test` passing 15 tests and `npm run test:e2e` passing 14 tests do not verify the public claims under the claims contract.

Concrete fix: create `.factory/claims.json`; give every claim below exactly one observable `@claim:<id>` test that starts from the demo entry point; remove any claim that cannot be tested.

### F-1-4 — The paid CTA is a dead link

Location: live `/`, **Buy lifetime unlock**. Its anchor is `https://api.sociobot.in/api/v1/products/name-vibration-captions/checkout`; a real GET returns HTTP 404 with `{"error":"enabled factory product","status":404}`. A visitor attempting the advertised US$7 purchase reaches an API error.

Concrete fix: point the anchor at a working Sociobot hosted checkout URL and add a link-crawl/payment-entry test that expects a successful HTML checkout response without creating a purchase.

### F-1-5 — Unknown routes masquerade as the product home page

Location: live `/404` and `/does-not-exist`. Both return HTTP 200 with the home title and hero. There is no designed 404 state, so a mistyped or stale link looks valid.

Concrete fix: add a product-styled not-found route with a clear “Page not found” h1 and **Back to Name Tap** link, and configure the host to return HTTP 404 for unknown paths while preserving known SPA deep links.

## Unlisted claim findings

Every row below is a separate blocking finding because there is no corresponding `.factory/claims.json` entry or tagged sandbox test. Repeated claims may share one registry entry only when that entry lists every location and its single test proves the whole wording.

| ID | Exact claim and location | Concrete fix/test |
| --- | --- | --- |
| F-1-6 | Landing hero: “Name Tap turns on-device captions into a private vibration when your name or an urgent phrase is spoken.” | Add `@claim:vibration-on-match`; seed a caption match and assert the visible cue plus requested vibration pattern. |
| F-1-7 | Landing hero: “No recording.” | Add `@claim:no-recording`; inspect media/storage APIs through a complete demo session and assert no audio blob or recording is created. |
| F-1-8 | Landing hero: “No account.” | Add `@claim:no-account`; complete the free demo and real phrase flow without authentication or account requests. |
| F-1-9 | Setup: “Comma-separated spellings help with names that captions often mishear.” | Add `@claim:spelling-variants`; seed `Maya, Maia` and assert a realistic `Maia` caption matches Maya. |
| F-1-10 | Setup help: “Nothing leaves this device.” | Add `@claim:device-only-data`; intercept the entire demo and assert only same-origin static requests, with no phrase/audio payloads. |
| F-1-11 | Capacity label: “Free, always.” | Add `@claim:free-tier`; prove three phrases, alerts, and export work without a license or network. |
| F-1-12 | Privacy note: “Audio is not recorded.” | Cover this location with `@claim:no-recording`. |
| F-1-13 | Privacy note: “Name Tap requests on-device recognition and refuses remote caption mode.” | Add `@claim:local-only-recognition`; assert the local flag/native API and refusal path when only remote recognition is available. |
| F-1-14 | Support status: “On-device captions available.” | Add `@claim:support-detection`; assert this status appears only after a positive capability probe. |
| F-1-15 | How it works: “Add up to three free phrases, with likely spelling variants.” | Cover with `@claim:free-tier` and `@claim:spelling-variants`, or rewrite as two independently listed claims. |
| F-1-16 | How it works: “Only during a session you start.” | Add `@claim:explicit-session`; assert recognition is not constructed or started before consent plus **Start listening**. |
| F-1-17 | How it works: “Captions disappear when you stop.” | Add `@claim:captions-cleared`; stop a seeded session and assert captions leave DOM and all storage. |
| F-1-18 | How it works: “Fuzzy sound matching catches close caption spellings.” | Add `@claim:fuzzy-match`; publish concrete positive and negative sample cases and assert both. |
| F-1-19 | Settings: “Settings live on this device.” | Add `@claim:local-settings`; save/reload in the demo namespace and assert no settings request leaves the origin. |
| F-1-20 | Settings: “Live captions never enter the settings file.” | Add `@claim:export-no-captions`; export after a seeded session and inspect the JSON. |
| F-1-21 | Setting label: “Uses your device vibration motor.” | Add `@claim:haptics`; assert the web/native vibration call and document the required hardware verification. |
| F-1-22 | Setting label: “Full-screen visual cue” / “High-contrast phrase alert.” | Add `@claim:visual-alert`; trigger a match and assert full-screen state plus tested contrast. |
| F-1-23 | Settings: “Move phrases between devices.” | Add `@claim:settings-round-trip`; export in one clean context, import in another, and compare phrases. |
| F-1-24 | Price section: “The free version gives you three phrases forever.” | Cover with `@claim:free-tier`; if “forever” cannot be proved, replace it with “The free version includes three phrases.” |
| F-1-25 | Price section: “Pay once to add unlimited phrases and extra vibration patterns as they arrive.” | Add `@claim:lifetime-unlock`; verify a valid sandbox license removes the limit and exposes patterns. Remove “as they arrive,” which promises unspecified future work. |
| F-1-26 | Price list: “Unlimited phrase list” and “Knock and urgent vibration patterns.” | Cover both observable entitlements with `@claim:lifetime-unlock`. |
| F-1-27 | Price list: “No subscription or account.” | Add `@claim:no-subscription-account`; verify the checkout description and unlocked flow. |
| F-1-28 | Price card: “US $7 one-time purchase.” | Add `@claim:price`; assert the live Sociobot checkout presents US$7 once. The current dead link prevents this. |
| F-1-29 | Price note: “Checkout and refunds are handled by Sociobot/Dodo.” | Add `@claim:merchant`; assert the hosted checkout/terms identify the merchant and refund path. |
| F-1-30 | Footer: “Original generated illustration · No analytics.” | Add `@claim:no-analytics`; intercept a complete demo flow and assert no analytics/tracking requests or scripts. Verify the illustration provenance and generated source asset named in `.factory/design.md`. |
| F-1-31 | Footer: “Not an emergency or recording service.” | Add `@claim:non-goals`; assert the UI never exposes recording/emergency actions, or keep this solely as a clearly labeled safety limitation. |
| F-1-32 | README: “Name Tap is a private attention cue for hard-of-hearing people in multilingual group conversations.” | List the audience and privacy aspects in the relevant behavior/privacy entries and tests. |
| F-1-33 | README: “During a session the user starts, it watches on-device live captions for a short personal phrase list and gives a distinct vibration and high-contrast visual cue when it hears a match.” | Cover with `@claim:explicit-session`, `@claim:vibration-on-match`, and `@claim:visual-alert`; split the sentence. |
| F-1-34 | README: “It is intentionally not a meeting recorder, speaker identifier, emergency service, or promise of perfect speech recognition.” | Add `@claim:non-goals` with static/API assertions, or move this to an explicitly untestable limitations section without product promises. |
| F-1-35 | README: “Matches names and urgent phrases using explicit spelling variants, conservative edit distance, and phonetic matching.” | Add `@claim:matcher`; assert each named algorithm behavior with positive and false-positive fixtures. |
| F-1-36 | README: “Uses Android’s native on-device recognizer (Android 12+) inside the Capacitor app and local-only browser recognition where it is explicitly available; it never falls back to remote recognition.” | Add `@claim:local-only-recognition` against native source/build and a browser refusal case. |
| F-1-37 | README: “Keeps captions in memory for the active session only; phrase settings persist in IndexedDB with a localStorage fallback.” | Add `@claim:storage-boundaries`; assert caption absence and settings presence in each store. |
| F-1-38 | README: “Supports offline app-shell use and installed on-device language packs as a PWA.” | Add `@claim:offline-reload`; install from `/demo`, go offline, reload, and exercise the seeded sample without external network. |
| F-1-39 | README: “Exports/imports user-owned settings JSON without transcripts.” | Cover with `@claim:settings-round-trip` and `@claim:export-no-captions`. |
| F-1-40 | README: “Gives every user three phrases, visual alerts, haptics, and export for free.” | Cover all four outcomes in `@claim:free-tier`. |
| F-1-41 | README: “Offers an optional US$7 lifetime unlock for unlimited phrases and selectable vibration patterns through the Sociobot hosted checkout.” | Cover price, checkout reachability, and entitlements in `@claim:lifetime-unlock`. |
| F-1-42 | README: “Current Chrome on Android with on-device speech recognition and the chosen language pack is the supported live-caption path.” | Add `@claim:supported-platform`; run or explicitly document a device-matrix test. |
| F-1-43 | README: “Unsupported browsers get an actionable explanation and never fall back silently to remote speech processing.” | Add `@claim:unsupported-browser`; remove speech APIs and assert the exact recovery message and zero remote ASR requests. |
| F-1-44 | README: “The exact production build command is `npm run build`.” | Add `@claim:build-command`, or state it only as an instruction and keep the existing build gate as its evidence. |
| F-1-45 | README: “It creates the complete static site in `dist/`, including `dist/index.html`, direct `/privacy` and `/terms` entry points, a content-versioned web manifest/service worker, and static-host response policy configuration.” | Add `@claim:build-artifacts`; assert every named artifact and version/header configuration. |
| F-1-46 | README: “Browser tests use Playwright 1.58.2 and cover desktop plus 390 px mobile flows, keyboard controls, axe accessibility checks, import recovery, service-worker versioning, and an explicit offline reload.” | Add an automated test-manifest assertion or replace “cover” with direct links to the test files. |
| F-1-47 | README: “`android/` is a Capacitor project using application ID `in.sociobot.namevibrationcaptions`, product-specific icons/splash, microphone and vibration declarations, a light edge-to-edge treatment, and synced web assets.” | Add `@claim:android-package`; inspect the Android manifest/resources and synced assets. |
| F-1-48 | README: “`LocalSpeechPlugin` requests microphone permission in context, uses only `createOnDeviceSpeechRecognizer` with `EXTRA_PREFER_OFFLINE`, streams temporary captions to the web UI, and triggers the native waveform cue.” | Tag the existing native bridge checks as `@claim:native-caption-bridge` and assert the complete behavior. |
| F-1-49 | README: “Android 12+ and an installed offline speech recognizer/language pack are required; an unavailable local recognizer is reported clearly and never falls back to remote recognition.” | Add `@claim:android-requirements`; test supported and unavailable native status paths. |
| F-1-50 | README: “The debug APK is emitted at `android/app/build/outputs/apk/debug/app-debug.apk`.” | Add `@claim:android-build`; build from clean state and assert the APK exists at that path. |
| F-1-51 | README: “There are no analytics, advertising scripts, third-party fonts, or runtime CDNs.” | Cover with `@claim:no-analytics`; also assert all loaded URLs are same-origin except an explicitly initiated checkout/license request. |
| F-1-52 | README: “The license token uses the key `sb_license:name-vibration-captions`; cached verification is refreshed no more than daily.” | Add `@claim:license-cache`; control time and assert key use plus the 24-hour request boundary. |
| F-1-53 | README: “Checkout and refunds are handled by Sociobot/Dodo, not by this app.” | Cover with `@claim:merchant` and a working hosted checkout. |
| F-1-95 | README: “Requires Node.js 20 or newer.” | Add `@claim:node-version`; run the supported-version build in CI and enforce the version through `engines`. |
| F-1-96 | Landing footer and README: “MIT licensed” / “MIT — see `LICENSE`.” | Add `@claim:license-file`; assert that the referenced MIT license exists and matches the package documentation. |
| F-1-97 | Landing header: “On device.” | Cover with `@claim:device-only-data`, or rewrite the status to identify exactly what remains on the device. |

## Other structure and accessibility findings

### F-1-54 — Canonical, Open Graph, and Twitter metadata are absent

Location: every live route. There is a title and description, but no canonical link, `og:title`, `og:description`, `og:image`, or Twitter card metadata. `/privacy` and `/terms` also reuse the home description. The product has no 1200 × 630 social image; the existing hero is 1200 × 800.

Concrete fix: add route-specific canonical/title/description metadata and a product-art 1200 × 630 OG image, then add Twitter card tags and metadata tests.

### F-1-55 — Header and footer are not consistent across routes

Location: `/privacy` and `/terms`. Both omit the site header. Their two-item footer differs from home and contains no Privacy/Terms links. The home footer omits “Built by Param Factory” and a version/build ID.

Concrete fix: render the shared header and footer on every route, including the not-found route. Include the one-line product description, Privacy, Terms, “Built by Param Factory,” and the build ID.

### F-1-56 — Route changes do not move focus or announce the new page

Location: navigation from the home footer to `/privacy` and browser Back. After navigation, `document.activeElement` is `BODY`, not the new h1; there is no route-announcement live region. Direct deep links load and browser Back returns, but the screen-reader focus contract is not met.

Concrete fix: after route navigation, focus a `tabindex="-1"` h1 and announce its text in an `aria-live="polite"` region; add forward/back focus tests.

### F-1-57 — Several primary and navigation touch targets are below 44 px

Location: live 390 px and desktop. Measured target heights include **Set your attention cue** 25 px, the wordmark 34 px, home footer links 22 px, and desktop header links 41 px.

Concrete fix: give each interactive link a minimum 44 × 44 px clickable box without relying only on adjacent whitespace; add computed-box tests at 390 px.

### F-1-58 — The Apple touch icon is not the required size

Location: `index.html` links `/icon-192.png`; the site-structure contract calls for a 180 px Apple touch icon.

Concrete fix: ship a genuine 180 × 180 icon, reference it with `sizes="180x180"`, and verify its intrinsic dimensions.

## Copy audit findings

The following are separate copy findings in addition to the first-screen and claim failures above.

| ID | Exact copy/location | Problem | Proposed rewrite |
| --- | --- | --- | --- |
| F-1-59 | “Local attention cue” (hero eyebrow) | “Attention cue” is unexplained jargon. | “Private name alert” |
| F-1-60 | “On device” (header status) | It does not say whether data, captions, or processing is on the device. | “Speech stays on this device” |
| F-1-61 | “on-device captions” (hero) | Platform jargon in the first explanation. | “captions made on your phone” |
| F-1-62 | “Set your attention cue” (hero action) | The object is jargon and the action does not provide the required sample result. | “Try it with sample data” with “Loads a sample caption and name alert.” beside it. |
| F-1-63 | “01 / Set your signal” | “Signal” introduces a second term for the cue. | “1 / Choose a phrase” |
| F-1-64 | “What should tap you?” | The heading is metaphorical out of context. | “Choose a name or urgent phrase” |
| F-1-65 | “Phrase and spelling variants” | “Variants” is specialist language. | “Name or phrase, with other spellings” |
| F-1-66 | “Ready when you are.” | The heading says neither the state nor the next action. | “Start local listening” |
| F-1-67 | “on-device recognition” / “remote caption mode” | Undefined technical terms in a consent-critical note. | “Name Tap turns speech into text on this phone. It stops if your phone can only send speech to a server.” |
| F-1-68 | “Fuzzy sound matching catches close caption spellings.” | “Fuzzy sound matching” is jargon and “catches” implies unspecified accuracy. | “Name Tap also checks the alternate spellings you add.” |
| F-1-69 | “Pocket rules.” | The heading has no clear meaning out of context. | “Choose your alerts” |
| F-1-70 | “Own your settings” | Vague marketing language. | “Move your saved phrases” |
| F-1-71 | “Export” button | The button does not name what it produces. | “Export settings” |
| F-1-72 | “Import” control | The control does not name what it imports. | “Import settings” |
| F-1-73 | “More signals. Same privacy.” | Vague and inconsistent with cue/tap/alert. | “Add unlimited phrases and vibration patterns” |
| F-1-74 | “Buy lifetime unlock” | “Unlock” hides the purchased result. | “Buy unlimited phrases — $7” |
| F-1-75 | “Test” button after adding a phrase | The button does not name the result. | “Test vibration” |
| F-1-76 | “Attention support for conversations.” | The footer sentence is abstract. | “Get a private tap when someone says your chosen phrase.” |
| F-1-77 | cue / signal / tap / vibration / alert | The same notification concept changes names across the landing page and README. | Use “alert” for the feature, “vibration” for the physical effect, and “phrase” for a saved target everywhere. |
| F-1-78 | README opening sentence 2 (31 words) | Over 22 words and contains “on-device live captions.” | “Name Tap watches a short phrase list during a session you start. It vibrates and flashes when local captions match a phrase.” |
| F-1-79 | README: “explicit spelling variants, conservative edit distance, and phonetic matching” | Algorithm jargon obscures the user result. | “Matches names and urgent phrases, including alternate spellings and similar-sounding caption text.” |
| F-1-80 | README Android/browser recognizer sentence (27 words) | Over 22 words and dense with platform jargon. | “The Android app uses Android’s local speech recognizer. Supported browsers also use local recognition. Name Tap never switches to a remote recognizer.” |
| F-1-81 | README: “IndexedDB with a localStorage fallback” | Storage implementation is mixed into the feature summary. | “Phrase settings stay in this browser or app. Technical storage details are below.” |
| F-1-82 | README: “offline app-shell use … as a PWA” | “App shell” and “PWA” are undefined. | “After installation, the app opens offline when the required language pack is already on the device.” |
| F-1-83 | README: “Exports/imports user-owned settings JSON without transcripts.” | “User-owned” is marketing language and JSON is unexplained. | “Exports and imports phrase settings as a JSON file. Transcripts are never included.” |
| F-1-84 | README supported-path sentence | “supported live-caption path” is internal terminology. | “Use current Chrome on Android with an installed offline language pack.” |
| F-1-85 | README: “actionable explanation” / “remote speech processing” | Abstract wording. | “Other browsers explain why captions cannot start. Name Tap does not send audio to a remote speech service.” |
| F-1-86 | README build-output sentence (29 words) | Over 22 words. | “`npm run build` writes the site to `dist/`. It includes the legal pages, versioned service worker, manifest, and host configuration.” |
| F-1-87 | README browser-tests sentence (29 words) | Over 22 words. | “Playwright 1.58.2 runs desktop and 390 px mobile tests. It also checks keyboard use, axe, import recovery, updates, and offline reload.” |
| F-1-88 | README Android-project sentence (26 words) | Over 22 words. | Split after the application ID; list assets and declarations in a second sentence. |
| F-1-89 | README `LocalSpeechPlugin` sentence (26 words) | Over 22 words. | Split permission, recognition, caption streaming, and vibration into short sentences. |
| F-1-90 | README Android-requirements sentence (26 words) | Over 22 words. | “Android 12+ and an offline language pack are required. If local recognition is unavailable, the app stops and explains why.” |
| F-1-91 | README hardware-verification sentence (31 words) | Over 22 words. | Turn the four verification actions into a numbered list. |
| F-1-92 | README: “runtime CDNs” | Jargon in the privacy summary. | “The app loads no fonts or scripts from other sites.” |
| F-1-93 | README repository-documents sentence (29 words) | Over 22 words. | Use three bullets: brief, design/provenance, and handoff. |
| F-1-94 | README: “private attention cue” | Repeats the unclear product-category phrase. | “Name Tap alerts hard-of-hearing people when a chosen phrase is spoken in a group conversation.” |

## Complete copy inventory

Counts treat a hyphenated term as one word. The landing inventory is the cold default state; language names, counters, prices, icons, and proper-name-only labels are not sentences. Headings and actions that fail the plain-words rules are included in the findings above.

### Landing-page sentences

| Sentence | Words | Flag |
| --- | ---: | --- |
| Feel your name. | 3 | F-1-1 |
| Keep your eyes up. | 4 | F-1-1 |
| Name Tap turns on-device captions into a private vibration when your name or an urgent phrase is spoken. | 18 | F-1-6, F-1-61 |
| No recording. | 2 | F-1-7 |
| No account. | 2 | F-1-8 |
| What should tap you? | 4 | F-1-64 |
| Add your name, a nickname, or an urgent phrase. | 9 | — |
| Comma-separated spellings help with names that captions often mishear. | 9 | F-1-9 |
| First entry is the label. | 5 | — |
| Nothing leaves this device. | 4 | F-1-10 |
| No phrases yet. | 3 | — |
| Add the name or words you most need to notice. | 10 | — |
| Ready when you are. | 4 | F-1-66 |
| Audio is not recorded. | 4 | F-1-12 |
| Name Tap requests on-device recognition and refuses remote caption mode. | 10 | F-1-13, F-1-67 |
| I have told people nearby that live captions are on, and I follow local consent laws. | 16 | — |
| Captions you don’t have to watch. | 6 | — |
| Add up to three free phrases, with likely spelling variants. | 10 | F-1-15 |
| Only during a session you start. | 6 | F-1-16 |
| Captions disappear when you stop. | 5 | F-1-17 |
| Fuzzy sound matching catches close caption spellings. | 7 | F-1-18, F-1-68 |
| Always confirm important instructions. | 4 | — |
| Pocket rules. | 2 | F-1-69 |
| Settings live on this device. | 5 | F-1-19 |
| Live captions never enter the settings file. | 7 | F-1-20 |
| More signals. | 2 | F-1-73 |
| Same privacy. | 2 | F-1-73 |
| The free version gives you three phrases forever. | 8 | F-1-24 |
| Pay once to add unlimited phrases and extra vibration patterns as they arrive. | 13 | F-1-25 |
| Have a license? | 3 | — |
| Checkout and refunds are handled by Sociobot/Dodo. | 8 | F-1-29 |
| Terms apply. | 2 | — |
| Attention support for conversations. | 4 | F-1-76 |
| Not an emergency or recording service. | 6 | F-1-31 |

No landing sentence exceeds 22 words. Non-sentence headings/actions/statuses checked include “On device” (F-1-60/F-1-97), “Local attention cue” (F-1-59), “Set your attention cue” (F-1-62), “Set your signal” (F-1-63), “Phrase and spelling variants” (F-1-65), “On-device captions available” (F-1-14), “Own your settings” (F-1-70), “Export” (F-1-71), “Import” (F-1-72), “Buy lifetime unlock” (F-1-74), the post-add “Test” button (F-1-75), and the provenance/license footer fragments (F-1-30/F-1-96).

### README sentences

| Sentence | Words | Flag |
| --- | ---: | --- |
| Name Tap is a private attention cue for hard-of-hearing people in multilingual group conversations. | 14 | F-1-32, F-1-94 |
| During a session the user starts, it watches on-device live captions for a short personal phrase list and gives a distinct vibration and high-contrast visual cue when it hears a match. | 31 | F-1-33, F-1-78 |
| It is intentionally not a meeting recorder, speaker identifier, emergency service, or promise of perfect speech recognition. | 17 | F-1-34 |
| Live: `https://name-vibration-captions.sociobot.in`. | 1 | — |
| Matches names and urgent phrases using explicit spelling variants, conservative edit distance, and phonetic matching. | 15 | F-1-35, F-1-79 |
| Uses Android’s native on-device recognizer (Android 12+) inside the Capacitor app and local-only browser recognition where it is explicitly available; it never falls back to remote recognition. | 27 | F-1-36, F-1-80 |
| Keeps captions in memory for the active session only; phrase settings persist in IndexedDB with a localStorage fallback. | 18 | F-1-37, F-1-81 |
| Supports offline app-shell use and installed on-device language packs as a PWA. | 12 | F-1-38, F-1-82 |
| Exports/imports user-owned settings JSON without transcripts. | 7 | F-1-39, F-1-83 |
| Gives every user three phrases, visual alerts, haptics, and export for free. | 12 | F-1-40 |
| Offers an optional US$7 lifetime unlock for unlimited phrases and selectable vibration patterns through the Sociobot hosted checkout. | 19 | F-1-41 |
| Current Chrome on Android with on-device speech recognition and the chosen language pack is the supported live-caption path. | 18 | F-1-42, F-1-84 |
| Unsupported browsers get an actionable explanation and never fall back silently to remote speech processing. | 15 | F-1-43, F-1-85 |
| Requires Node.js 20 or newer. | 6 | F-1-95 |
| The exact production build command is `npm run build`. | 9 | F-1-44 |
| It creates the complete static site in `dist/`, including `dist/index.html`, direct `/privacy` and `/terms` entry points, a content-versioned web manifest/service worker, and static-host response policy configuration. | 29 | F-1-45, F-1-86 |
| Browser tests use Playwright 1.58.2 and cover desktop plus 390 px mobile flows, keyboard controls, axe accessibility checks, import recovery, service-worker versioning, and an explicit offline reload. | 29 | F-1-46, F-1-87 |
| `android/` is a Capacitor project using application ID `in.sociobot.namevibrationcaptions`, product-specific icons/splash, microphone and vibration declarations, a light edge-to-edge treatment, and synced web assets. | 26 | F-1-47, F-1-88 |
| `LocalSpeechPlugin` requests microphone permission in context, uses only `createOnDeviceSpeechRecognizer` with `EXTRA_PREFER_OFFLINE`, streams temporary captions to the web UI, and triggers the native waveform cue. | 26 | F-1-48, F-1-89 |
| Android 12+ and an installed offline speech recognizer/language pack are required; an unavailable local recognizer is reported clearly and never falls back to remote recognition. | 26 | F-1-49, F-1-90 |
| The debug APK is emitted at `android/app/build/outputs/apk/debug/app-debug.apk`. | 14 | F-1-50 |
| Never commit a release keystore. | 5 | — |
| Hardware verification still requires a compatible Android device: grant the microphone permission, confirm the device reports on-device recognition available, speak a configured phrase, and confirm both the visual and vibration cues. | 31 | F-1-91 |
| There are no analytics, advertising scripts, third-party fonts, or runtime CDNs. | 11 | F-1-51, F-1-92 |
| The license token uses the key `sb_license:name-vibration-captions`; cached verification is refreshed no more than daily. | 17 | F-1-52 |
| Checkout and refunds are handled by Sociobot/Dodo, not by this app. | 12 | F-1-53 |
| See `/privacy` and `/terms` for user-facing policies. | 7 | — |
| The product brief is in `.factory/brief.json`, the complete visual rationale and image provenance are in `.factory/design.md`, and the verification record is in `.factory/handoff.md`. | 29 | F-1-93 |
| MIT — see `LICENSE`. | 3 | F-1-96 |

README headings (“Name Tap,” “What v1 does,” “Develop and verify,” “Android handoff,” “Privacy and payment,” and “License”) make sense in document context. Commands and file paths inside code blocks are not sentences and are excluded.

### Terminology check

| Concept | Terms currently used | Required single term |
| --- | --- | --- |
| Saved target | phrase, words, name, urgent phrase | “phrase”; explain that it can be a name or urgent words |
| User notification | attention cue, cue, signal, tap, vibration, visual cue, alert | “alert”; reserve “vibration” for the physical effect |
| Speech-to-text facility | captions, live captions, on-device recognition, recognizer, remote caption mode | “local captions” in user copy; technical names only in developer notes |
| Paid state | unlock, lifetime unlocked, license, purchase | “lifetime purchase” for the offer and “license” only for restore/support |

## Demo, privacy, and offline evidence

- Fresh `/demo` request: HTTP 200 but ordinary home route; no seeded sample or demo controls.
- Isolation check: a real IndexedDB phrase was visible on `/demo`; this directly fails sandbox isolation. The test context was disposable and did not touch an actual user profile.
- Network interception on fresh `/` and `/demo`: only the same-origin HTML, hashed JS/CSS, and hero asset loaded. No third-party request occurred during passive use.
- Offline reload after service-worker installation: `/demo` reloaded, but as the ordinary home app. The claimed demo path therefore cannot be exercised offline.
- Live CSP, microphone Permissions-Policy, no-sniff, referrer policy, and frame blocking are present.

## Route, link, and visual checks

- `/`, `/privacy`, and `/terms` deep links return 200 with one h1 and a main landmark.
- Home title follows the required pattern: “Name Tap — feel when your name is spoken.” Privacy and Terms titles follow “Route — Name Tap.” `/demo` and unknown paths do not.
- The skip link, `lang="en"`, alt text, visible focus CSS, reduced-motion rule, and favicon exist.
- Fresh live axe scans at 1440 × 1000 and 390 × 844 found zero violations. The factory `verify-url.sh` also found no console/page errors, one h1, a main landmark, and no missing image alt.
- All internal links crawled successfully except the intentional finding for unknown routes; the external checkout link is the dead link in F-1-4. `mailto:` links were treated as explicit exceptions.
- The signal-board neo-brutalist identity is distinct and product-specific. It does not look like the prohibited generic centered-gradient/three-card SaaS template. The generated hero provenance is recorded in `.factory/design.md`.

## Earlier-finding audit

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. The earlier handoff and verification documents repeat these repaired findings; each was checked again:

| Earlier ID | Current result | Evidence |
| --- | --- | --- |
| B-1 Android local speech implementation | Fixed as originally stated | `MainActivity` registers `LocalSpeechPlugin`; native code uses `createOnDeviceSpeechRecognizer`, `EXTRA_PREFER_OFFLINE`, caption events, and waveform vibration. The native regression test passes. A physical Android device remains unavailable, so this review does not claim hardware acceptance. |
| H-1 malformed import crash | Fixed | Validation occurs before save; the exact malformed `variants: "string"` regression passes on desktop and mobile with a clean reload. |
| M-1 unversioned service worker/cache | Fixed | Live `sw.js` uses `name-tap-shell-f98d35fe1082`; manifest uses the same release; hashed assets are immutable and SW/manifest are no-cache. |
| M-2 mobile performance | Fixed | `feTurbulence` is absent. Fresh mobile Lighthouse: Performance 100, FCP 1.0 s, LCP 1.1 s, TBT 50 ms, CLS 0. |
| L-1 response policy/manifest MIME | Fixed | Live CSP, `frame-ancestors 'none'`, X-Frame-Options DENY, Permissions-Policy, and `application/manifest+json` were confirmed. |

## Verification record

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 150 packages, 0 vulnerabilities |
| `npm test` | PASS — 15/15; no claim tags |
| `npm run build` | PASS — JS 14.31 KB gzip; CSS 4.94 KB gzip |
| `npm run test:e2e` | PASS — 14/14 desktop/mobile tests |
| Live bundle equality | PASS — JS SHA-256 `599e7e…dc7`; CSS `af40a5…4ca` match local build |
| Fresh live axe | PASS — 0 violations on desktop and 390 px mobile |
| `verify-url.sh` | PASS — 200, title/lang/main/alt, no console errors |
| Mobile Lighthouse | PASS — 100/100/100/100 |
| Claim suite | **BLOCKED/FAIL** — `.factory/claims.json` is missing |
| Demo sandbox | **FAIL** — absent and reads real storage |
| Link crawl | **FAIL** — paid CTA returns 404 |
| Unknown route | **FAIL** — home page returned with 200 |

## What would make this perfect

Resolve every finding above, then verify the whole flow from a fresh 390 px context: understand the audience and job from the first screen, enter a realistic isolated demo in one click, see a match immediately, reset it, leave without touching real data, start a real session, and reach a working checkout. Register and run every public claim from that demo. Finish with correct route metadata, a real 404, shared site chrome, route-focus behavior, 44 px targets, and a fresh zero-finding copy/link/accessibility review.
