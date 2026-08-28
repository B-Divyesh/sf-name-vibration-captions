# Polish round 1 — finding closure

Candidate: `902208fe1a57b6eee687e9c7e4fe040c94b18aca`  
Review: `491f39e1ce06bcc60217875e41cb23505c081a9d`  
Repair commit: `37e0a62` (documentation/live-evidence commit follows)

Evidence keys used below:

- `E-home`: `.factory/evidence/local-home/screenshot-mobile.png`
- `E-demo`: `.factory/evidence/local-demo/screenshot-mobile.png`
- `E-legal`: `.factory/evidence/local-privacy/screenshot-mobile.png`
- `E-404`: `test-results/polish-404-mobile.png`
- `E-browser`: `npm run test:e2e` — 48/48 desktop and 390 px tests
- `E-claims`: all 25 commands in `.factory/claims.json` passed from clean clone `/tmp/name-tap-clean-Cuew7v`
- Live checks use `https://name-vibration-captions.sociobot.in` and are recorded in the handoff after deployment.

## Findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the metaphorical hero with the exact job and hard-of-hearing audience wording. | `E-home`; first-screen browser assertion; live `/` |
| F-1-2 | Added `?demo=1` and `/demo`, bundled Maya/Maia sample captions, a persistent banner, reset, exit, and in-memory isolation. | demo-isolation/reset test; `@claim:local-settings`; `E-demo`; live `/?demo=1` |
| F-1-3 | Added `.factory/claims.json` with one uniquely tagged observable test for each retained claim. | claim-tag uniqueness audit; `E-claims` |
| F-1-4 | Removed the dead purchase offer and checkout anchor because the required Sociobot product is not registered. No broken payment link remains. | link crawl in route suite; live `/`; API probe remains 404 and is no longer linked |
| F-1-5 | Added the signal-board 404 page, static `404.html`, and host 404 response override without a catch-all home rewrite. | route/404 test; `E-404`; live `/does-not-exist` |
| F-1-6 | Reworded the statement and registered match vibration behavior. | `@claim:vibration-on-match`; `E-demo`; live demo replay |
| F-1-7 | Kept the concrete no-recording fact and instrumented media/storage APIs. | `@claim:no-recording`; live demo |
| F-1-8 | Kept no-account copy and tested the flow plus request log. | `@claim:no-account`; live demo |
| F-1-9 | Replaced jargon with “other spellings” and proves Maia → Maya. | `@claim:spelling-variants`; live demo |
| F-1-10 | Narrowed copy to phrase settings and free-use data boundaries. | `@claim:device-only-data`; live demo network check |
| F-1-11 | Replaced “Free, always” with the concrete three-phrase limit. | `@claim:free-tier`; live `/` |
| F-1-12 | Retained the no-recording privacy note with API/storage instrumentation. | `@claim:no-recording`; live `/privacy` |
| F-1-13 | Rewrote the local-only refusal in plain words. | `@claim:local-only-recognition`; native bridge unit test |
| F-1-14 | Capability status now has ready/missing/unknown states from a non-starting probe. | `@claim:support-detection` |
| F-1-15 | Split capacity and alternate-spelling statements. | `@claim:free-tier`; `@claim:spelling-variants` |
| F-1-16 | Consent and explicit start gate recognition. | `@claim:explicit-session` |
| F-1-17 | Stop clears captions from DOM and storage. | `@claim:captions-cleared` |
| F-1-18 | Replaced “fuzzy sound matching catches” with concrete matching language and fixtures. | `@claim:matcher` |
| F-1-19 | Clarified device storage and isolated demo memory. | `@claim:local-settings`; `@claim:device-only-data` |
| F-1-20 | Export test inspects the file and rejects caption text. | `@claim:export-no-captions` |
| F-1-21 | Changed the label to “Requests your device vibration motor.” | `@claim:haptics` |
| F-1-22 | Preserved the visual alert and asserts exact computed colors. | `@claim:visual-alert` |
| F-1-23 | Renamed actions to Export settings/Import settings and tests a two-workspace round trip. | `@claim:settings-round-trip` |
| F-1-24 | Replaced “forever” with “Three phrases included.” | `@claim:free-tier` |
| F-1-25 | Removed the unavailable paid offer and future-feature promise. | copy audit; live `/` |
| F-1-26 | Removed unpurchasable entitlement marketing. Existing code paths remain non-promotional. | copy audit; live `/` |
| F-1-27 | Removed the untestable checkout/account statement. | `@claim:no-account`; live `/` |
| F-1-28 | Removed the unregistered US$7 offer rather than sending users to a 404. | link crawl; live `/` |
| F-1-29 | Removed merchant/refund marketing while checkout is unavailable. | copy audit; live `/terms` |
| F-1-30 | Kept the disclosure and registered privacy plus provenance checks. | `@claim:no-analytics`; `@claim:asset-provenance` |
| F-1-31 | Turned non-goals into a clear limits section. | `@claim:non-goals`; live `/` |
| F-1-32 | Rewrote the README opening in plain language and registered audience/privacy behavior. | README; `@claim:device-only-data` |
| F-1-33 | Split the README behavior into three short sentences. | `@claim:explicit-session`; `@claim:vibration-on-match`; `@claim:visual-alert` |
| F-1-34 | Moved this into explicit limitations and removed implied guarantees. | `@claim:non-goals` |
| F-1-35 | Replaced algorithm jargon with user-facing wording while keeping fixed algorithm fixtures. | `@claim:matcher` |
| F-1-36 | Split Android/browser wording and retained the local-only rule. | `@claim:local-only-recognition`; `@claim:native-caption-bridge` |
| F-1-37 | Separated temporary captions from saved phrase settings. | `@claim:captions-cleared`; `@claim:local-settings` |
| F-1-38 | Rewrote offline wording and tests the installed sample offline. | `@claim:offline-reload` |
| F-1-39 | Explained JSON and proves round trip without captions. | `@claim:settings-round-trip`; `@claim:export-no-captions` |
| F-1-40 | Kept only the concrete free features and tests all of them offline. | `@claim:free-tier` |
| F-1-41 | Removed the unavailable checkout offer from README and UI. | link crawl; live `/` |
| F-1-42 | Recast Android versions and language packs as hardware-test requirements. | README device checklist |
| F-1-43 | Rewrote unsupported-browser copy with one next step. | `@claim:unsupported-browser` |
| F-1-44 | Presented build as an instruction; the build remains exercised. | `@claim:build-artifacts` |
| F-1-45 | Split build outputs into short sentences and asserts every named artifact. | `@claim:build-artifacts` |
| F-1-46 | Replaced the dense test boast with direct suite scope and actual test files. | `E-browser` |
| F-1-47 | Split Android project details and inspects package/resources. | `@claim:android-package` |
| F-1-48 | Split native bridge behavior and tagged the native regression. | `@claim:native-caption-bridge` |
| F-1-49 | Recast environment needs as requirements and tests unavailable paths. | `@claim:unsupported-browser`; native source test |
| F-1-50 | Removed the unbuilt APK output claim; the README gives only the build command. | README; `npm run cap:sync` pass |
| F-1-51 | Kept the no-tracking statement with a full request/script audit. | `@claim:no-analytics` |
| F-1-52 | Removed public license-cache implementation claims. | README copy audit |
| F-1-53 | Removed merchant claims while no checkout is registered. | README and terms copy audit |
| F-1-54 | Added canonical, route descriptions, Open Graph/Twitter tags, and a 1200 × 630 product-art image. | metadata test; `@claim:asset-provenance`; live route DOM checks |
| F-1-55 | Added one shared header/footer to home, demo, privacy, terms, and 404. | route suite; `E-legal`; live routes |
| F-1-56 | SPA navigation and Back now focus the new h1 and update a polite route status. A loading state closes the fast-action race. | route focus/back test |
| F-1-57 | Wordmark, nav, footer, actions, and form controls now expose at least 44 px targets. | computed-box mobile/desktop test |
| F-1-58 | Added and linked a real 180 × 180 Apple touch icon. | intrinsic `identify` check; metadata test |
| F-1-59 | Changed “Local attention cue” to “Private name alert.” | `.factory/copy-audit.md`; `E-home` |
| F-1-60 | Changed status to “Phrases stay on this device.” | copy audit; live `/` |
| F-1-61 | Changed first-screen jargon to “local captions on your device.” | copy audit; `E-home` |
| F-1-62 | Added “Try it with sample data” plus its immediate outcome. | `E-home`; demo navigation test |
| F-1-63 | Changed step to “1 / Choose a phrase.” | copy audit |
| F-1-64 | Changed heading to “Choose a name or urgent phrase.” | copy audit |
| F-1-65 | Changed label to “Name or phrase, with other spellings.” | copy audit |
| F-1-66 | Changed heading to “Start local listening.” | copy audit |
| F-1-67 | Rewrote the consent note in plain words. | copy audit; `@claim:local-only-recognition` |
| F-1-68 | Replaced jargon with exact matching behavior. | copy audit; `@claim:matcher` |
| F-1-69 | Changed heading to “Choose your alerts.” | copy audit |
| F-1-70 | Changed heading to “Move your saved phrases.” | copy audit |
| F-1-71 | Changed action to “Export settings.” | copy audit; round-trip test |
| F-1-72 | Changed action to “Import settings.” | copy audit; round-trip test |
| F-1-73 | Removed the vague paid heading with the unavailable offer. | live `/` |
| F-1-74 | Removed the dead “Buy lifetime unlock” action. | link crawl; live `/` |
| F-1-75 | Changed every phrase action to “Test vibration.” | copy audit; `@claim:haptics` |
| F-1-76 | Replaced footer abstraction with a concrete one-line result. | copy audit; all live routes |
| F-1-77 | Standardized phrase, alert, local captions, vibration, and lifetime purchase terminology. | terminology table in `.factory/copy-audit.md` |
| F-1-78 | Split the README opening into short plain sentences. | copy audit |
| F-1-79 | Replaced matcher jargon in README. | copy audit; `@claim:matcher` |
| F-1-80 | Split the recognizer wording into short sentences. | copy audit |
| F-1-81 | Moved storage internals out of the feature summary. | README |
| F-1-82 | Replaced “app shell/PWA” with a concrete offline result. | `@claim:offline-reload` |
| F-1-83 | Explained settings JSON and caption exclusion. | `@claim:export-no-captions` |
| F-1-84 | Replaced “supported path” jargon with hardware requirements. | README |
| F-1-85 | Replaced abstract error wording with the exact stop behavior. | `@claim:unsupported-browser` |
| F-1-86 | Split the build-output sentence. | copy audit; `@claim:build-artifacts` |
| F-1-87 | Split and shortened browser-test wording. | copy audit; `E-browser` |
| F-1-88 | Split Android project details into short sentences. | copy audit; `@claim:android-package` |
| F-1-89 | Split plugin behavior into four short sentences. | copy audit; `@claim:native-caption-bridge` |
| F-1-90 | Split Android requirements and removed the dense fallback clause. | copy audit |
| F-1-91 | Converted hardware verification into five numbered actions. | README |
| F-1-92 | Replaced “runtime CDNs” in user copy with “fonts or scripts from other sites.” | privacy page; `@claim:no-analytics` |
| F-1-93 | Replaced the long repository sentence with four bullets. | README |
| F-1-94 | Replaced “private attention cue” with the exact audience and job. | README opening |
| F-1-95 | Added `engines.node >=20` enforcement and kept the requirement concise. | `package.json`; clean-clone `npm ci` |
| F-1-96 | Registered and checks the canonical MIT text. | `@claim:license-file` |
| F-1-97 | Replaced “On device” with “Phrases stay on this device.” | `@claim:device-only-data`; live header |

## Earlier review findings

| Finding | Recheck | Evidence |
| --- | --- | --- |
| B-1 | Native local speech bridge remains registered and local-only. | `@claim:native-caption-bridge`; `npm run cap:sync` |
| H-1 | Malformed imports remain recoverable and are never persisted. | malformed import browser test; store unit tests |
| M-1 | Build-derived cache version and update flow remain intact. | `@claim:build-artifacts`; offline browser test |
| M-2 | Expensive texture remains absent and budgets pass. | Lighthouse record in handoff; build sizes |
| L-1 | CSP, permissions, framing, cache, and manifest MIME policies remain configured. | deployment unit tests; live header checks |
