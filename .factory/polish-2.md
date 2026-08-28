# Polish round 2 — complete finding closure

Candidate: `8fad78a3f454a1121a40ad005f2b859560082fed`

Review: `6c406b3beed21f30545532ae8ec5a690eb9c3228`

Repair commits: `e549c29`, `24f4ad3`, `987bdd0`

Deployment: `d2cb6a41-9e56-4fbb-9ded-9edd24fde556`

Live URL: <https://name-vibration-captions.sociobot.in>

## Evidence keys

- `C25`: all 25 `.factory/claims.json` commands passed individually from clean clone `/tmp/name-tap-polish2-final.V2vJO7` at `987bdd09f67c45f0b9f719b197e5bd52d2003739`.
- `B50`: `npm run test:e2e` passed 50/50 desktop and 390 × 844 mobile tests.
- `U21`: `npm test` passed 21/21 unit and static-integration tests.
- `LIVE`: `npm run audit:live` passed against the production URL from fresh browser contexts.
- `VERIFY`: the factory URL verifier passed `/`, `/?demo=1`, `/privacy`, and `/terms` with no console errors.
- `S-home`: `.factory/evidence/polish-2-live-home/screenshot-mobile.png`.
- `S-demo`: `.factory/evidence/polish-2-live-demo/screenshot-mobile.png` and `screenshot-desktop.png`.
- `S-privacy`: `.factory/evidence/polish-2-live-privacy/screenshot-mobile.png`.
- `S-404`: `.factory/evidence/polish-2-live-404/screenshot-mobile.png`.
- `LH`: live mobile Lighthouse 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.1 s, TBT 70 ms, CLS 0.
- `HASH`: live and local JS SHA-256 `95cfff433f392f582e1e50864138bf7e29dc22d9e382153f5a0494a761c1bfd2`.

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Removed the repeated landing hero from demo mode. The matched Maya board is now the demo h1 and first content panel below the persistent banner/header. | `landing sample action opens the matched board inside the first viewport` at both projects; `S-demo`; `LIVE`; live `/?demo=1`. |
| F-2-2 | Replaced the prototype heuristic with an asynchronous, language-aware `SpeechRecognition.available` probe. Added checking, download-needed, unavailable, rejected/unknown, native, and stale-language handling. | `@claim:support-detection` covers five results and language changes; `C25`; `LIVE`. |
| F-2-3 | Renamed the setting to “High-contrast visual alert” and aligned the registry wording. The test now checks the exact state, colours, and WCAG contrast ratio. | `@claim:visual-alert`; `C25`; `S-demo`; live `/?demo=1`. |
| F-2-4 | Expanded the claim to enter `Maya, Maia` through the real form, verify label and alternate spelling, emit a Maia caption, and assert a Maya match. | `@claim:spelling-variants`; `C25`; `LIVE`. |
| F-2-5 | Removed the unavailable purchase/license runtime and every public license-token statement. No token storage or Sociobot verification request remains. | `routes set metadata…` rejects dormant license copy; same-origin `@claim:device-only-data`; `S-privacy`; live `/privacy`. |
| F-2-6 | Changed the privacy h1 to “How Name Tap handles your data.” | Route test; `S-privacy`; `VERIFY`; live `/privacy`. |
| F-2-7 | Removed the false blanket claim-coverage sentence. Added a unit gate that enforces one unique test tag for every registry entry. | `keeps one uniquely tagged test for every registered claim`; `U21`; `C25`. |
| F-2-8 | Replaced “tap pattern” with “vibration pattern.” | Copy regression unit test; `.factory/copy-audit.md`; `S-demo`. |
| F-2-9 | Replaced “axe” with “automated accessibility rules.” | Copy regression unit test; README; 50-route/project accessibility checks in `B50`. |
| F-2-10 | Replaced “native vibration waveform” with “A match asks Android to play the vibration pattern.” | Copy regression unit test; README; `@claim:native-caption-bridge`. |
| F-2-11 | Replaced “off origin” with “to another site.” | Copy regression unit test; README; `@claim:device-only-data`. |
| F-2-12 | Replaced checkout infrastructure language with “New purchases are unavailable. The app does not show a purchase link.” | Copy regression unit test; README; live link crawl in `LIVE`. |
| F-2-13 | Replaced undefined “short security logs” with a link to the published Sociobot privacy policy. The policy URL returns HTTP 200. | Copy regression unit test; route/link test; `S-privacy`; live `/privacy`. |

## Cumulative review 1 findings

Every review-1 item was rechecked after the round-2 changes. The specific closure remains recorded in `.factory/polish-1.md`; this table records the round-2 recheck and current evidence.

| Finding | Current change/state | Evidence |
| --- | --- | --- |
| F-1-1 | Job-first h1 and hard-of-hearing audience remain on the first screen. | `S-home`; live `/`. |
| F-1-2 | Demo remains isolated and now opens directly on the sample result. | F-2-1 test; demo reset/isolation test; `LIVE`; `S-demo`. |
| F-1-3 | Registry contains 25 unique claims with one test tag each. | Registry uniqueness unit test; `C25`. |
| F-1-4 | No dead purchase link is rendered. | Link audit in `LIVE`; live `/`. |
| F-1-5 | Unknown routes retain the designed page and HTTP 404. | Route test; `LIVE`; live `/does-not-exist`. |
| F-1-6 | Matching requests vibration and shows the phrase. | `@claim:vibration-on-match`; `C25`. |
| F-1-7 | No recording is created. | `@claim:no-recording`; `C25`. |
| F-1-8 | Demo and free flow require no account. | `@claim:no-account`; `C25`. |
| F-1-9 | Alternate spelling entry and Maia → Maya matching are proven through the form. | F-2-4; `@claim:spelling-variants`. |
| F-1-10 | Phrase/caption traffic remains same-origin in free use. | `@claim:device-only-data`; `LIVE`. |
| F-1-11 | The concrete three-phrase tier remains tested. | `@claim:free-tier`; `C25`. |
| F-1-12 | Privacy copy retains the scoped no-recording statement. | `@claim:no-recording`; live `/privacy`. |
| F-1-13 | Remote-only recognition remains refused. | `@claim:local-only-recognition`; `C25`. |
| F-1-14 | Availability now requires the real language-aware asynchronous probe. | F-2-2; `@claim:support-detection`. |
| F-1-15 | Capacity and alternate-spelling statements remain separate and tested. | `@claim:free-tier`; `@claim:spelling-variants`. |
| F-1-16 | Recognition remains gated by consent and Start listening. | `@claim:explicit-session`; `C25`. |
| F-1-17 | Stop removes temporary captions. | `@claim:captions-cleared`; `C25`. |
| F-1-18 | Concrete matcher wording and positive/negative fixtures remain. | `@claim:matcher`; `C25`. |
| F-1-19 | Real IndexedDB and demo memory remain separate. | `@claim:local-settings`; demo isolation test; `LIVE`. |
| F-1-20 | Exported JSON excludes captions. | `@claim:export-no-captions`; `C25`. |
| F-1-21 | Vibration-motor request remains concrete. | `@claim:haptics`; `C25`. |
| F-1-22 | Visual wording now exactly matches the tested high-contrast state. | F-2-3; `@claim:visual-alert`. |
| F-1-23 | Export/import round trip remains proven. | `@claim:settings-round-trip`; `C25`. |
| F-1-24 | “Forever” remains absent. | Copy regression unit test; live `/`. |
| F-1-25 | Future paid-feature promise remains absent. | Copy audit; live `/`. |
| F-1-26 | Unavailable paid entitlements and dormant token flow are removed. | F-2-5; live `/`. |
| F-1-27 | No checkout/account promise is made. | `@claim:no-account`; live `/`. |
| F-1-28 | No unregistered price or checkout link is shown. | `LIVE`; live `/`. |
| F-1-29 | Merchant/refund marketing remains absent. | README/terms audit; live `/terms`. |
| F-1-30 | Analytics absence and generated-art provenance remain registered. | `@claim:no-analytics`; `@claim:asset-provenance`. |
| F-1-31 | Product limits remain explicit. | `@claim:non-goals`; live `/`. |
| F-1-32 | README retains the audience and job in plain words. | README; `@claim:device-only-data`. |
| F-1-33 | Session, vibration, and visual behaviors remain split and tested. | Three corresponding claim tests in `C25`. |
| F-1-34 | Non-goals remain labeled as limitations without accuracy guarantees. | `@claim:non-goals`; live `/terms`. |
| F-1-35 | README matcher copy remains user-facing. | `@claim:matcher`; README. |
| F-1-36 | Browser refusal and Android local recognizer remain separate and local-only. | `@claim:local-only-recognition`; `@claim:native-caption-bridge`. |
| F-1-37 | Captions and phrase-setting persistence remain separated. | `@claim:captions-cleared`; `@claim:local-settings`. |
| F-1-38 | Installed sample still opens offline. | `@claim:offline-reload`; `LIVE`. |
| F-1-39 | Settings JSON round-trip and caption exclusion remain proven. | Two corresponding claim tests in `C25`. |
| F-1-40 | Three phrases, both alerts, and export work at no charge. | `@claim:free-tier`; `C25`. |
| F-1-41 | Unavailable checkout offer remains absent. | `LIVE`; live `/`. |
| F-1-42 | Android/language-pack wording remains a hardware requirement. | README; native static tests. |
| F-1-43 | Unsupported browsers still receive an exact next step. | `@claim:unsupported-browser`; `C25`. |
| F-1-44 | Build wording remains an instruction and succeeds. | `npm run build`; deployment build. |
| F-1-45 | Every named build artifact remains asserted. | `@claim:build-artifacts`; `C25`. |
| F-1-46 | Suite wording now says automated accessibility rules and matches the tests. | F-2-9; `B50`. |
| F-1-47 | Android package ID, events, and permissions remain asserted. | `@claim:android-package`; `C25`. |
| F-1-48 | Native bridge behavior remains asserted. | `@claim:native-caption-bridge`; `C25`. |
| F-1-49 | Android requirements and unavailable local paths remain explicit. | README; local-only tests. |
| F-1-50 | No built-APK claim is made; APK remains a later Android work order. | README; `npm run cap:sync` pass. |
| F-1-51 | No analytics, ads, third-party fonts, or runtime scripts load. | `@claim:no-analytics`; `LIVE`. |
| F-1-52 | Public license-cache implementation claim and dormant code are gone. | F-2-5; source audit. |
| F-1-53 | Merchant claim remains absent. | README/terms audit. |
| F-1-54 | Route metadata and product-specific social art remain complete. | Route test; `VERIFY`; live routes. |
| F-1-55 | Shared header/footer remain on every route. | Route test; live screenshots. |
| F-1-56 | SPA navigation and Back focus/announce the h1. | Route focus test; `B50`. |
| F-1-57 | Visible controls retain ≥44 px targets. | Mobile/desktop computed target test; `B50`. |
| F-1-58 | Genuine 180 × 180 Apple icon remains linked. | Metadata test; built asset. |
| F-1-59 | “Private name alert” remains the eyebrow. | `S-home`; copy audit. |
| F-1-60 | Device status remains scoped to phrases. | `S-home`; `@claim:device-only-data`. |
| F-1-61 | First screen says “local captions on your device.” | `S-home`; live `/`. |
| F-1-62 | Sample CTA and its result remain adjacent. | First-viewport test; `S-home`. |
| F-1-63 | “1 / Choose a phrase” remains. | `S-home`; copy audit. |
| F-1-64 | Phrase setup heading remains concrete. | `S-home`; copy audit. |
| F-1-65 | Label uses “other spellings.” | F-2-4 claim test; live demo. |
| F-1-66 | Session heading remains action-first. | `S-home`; live `/`. |
| F-1-67 | Consent copy remains direct and local. | `@claim:local-only-recognition`; live `/`. |
| F-1-68 | Matching copy remains concrete. | `@claim:matcher`; live `/`. |
| F-1-69 | Alert-controls heading remains clear. | `S-home`; copy audit. |
| F-1-70 | Settings-move heading remains concrete. | `S-home`; live `/`. |
| F-1-71 | Export action names settings. | `@claim:settings-round-trip`; live `/`. |
| F-1-72 | Import action names settings. | `@claim:settings-round-trip`; live `/`. |
| F-1-73 | Vague paid heading remains absent. | Live `/`; copy audit. |
| F-1-74 | Dead purchase action remains absent. | `LIVE`; live `/`. |
| F-1-75 | Phrase test action remains “Test vibration.” | `@claim:haptics`; live demo. |
| F-1-76 | Footer retains the concrete one-line result. | Live screenshots. |
| F-1-77 | Phrase/alert/local captions/vibration terminology is consistent. | F-2-8 copy regression; `.factory/copy-audit.md`. |
| F-1-78 | README opening remains split and under 22 words per sentence. | `.factory/copy-audit.md`; README. |
| F-1-79 | README matcher explanation remains jargon-free. | README; `@claim:matcher`. |
| F-1-80 | Browser/native recognition wording remains split. | README; two local-only claims. |
| F-1-81 | Storage implementation stays outside the feature summary. | README copy audit. |
| F-1-82 | Offline wording remains concrete. | `@claim:offline-reload`; README. |
| F-1-83 | JSON and caption exclusion remain explained. | Two export/import claim tests. |
| F-1-84 | Hardware requirement wording remains direct. | README. |
| F-1-85 | Unsupported-browser error remains exact and actionable. | `@claim:unsupported-browser`. |
| F-1-86 | Build output wording remains short and tested. | `@claim:build-artifacts`; README. |
| F-1-87 | Test wording is short and now expands accessibility jargon. | F-2-9; README. |
| F-1-88 | Android project details remain split. | README; `@claim:android-package`. |
| F-1-89 | Native plugin behavior remains short and plain. | F-2-10; `@claim:native-caption-bridge`. |
| F-1-90 | Android requirements remain split. | README. |
| F-1-91 | Hardware verification remains a numbered checklist. | README. |
| F-1-92 | User privacy copy avoids CDN jargon. | Live `/privacy`; `@claim:no-analytics`. |
| F-1-93 | Product records remain a readable list. | README. |
| F-1-94 | README opens with the audience and job. | README. |
| F-1-95 | Node 20+ remains enforced by `engines`. | Clean-clone `npm ci`; package manifest. |
| F-1-96 | Canonical MIT text remains present and linked. | `@claim:license-file`; `C25`. |
| F-1-97 | Header remains “Phrases stay on this device.” | `@claim:device-only-data`; `S-home`. |

## Pre-review regression findings

| Finding | Current change/state | Evidence |
| --- | --- | --- |
| B-1 | Android bridge registration and on-device recognition remain intact. | `@claim:native-caption-bridge`; `npm run cap:sync`. |
| H-1 | Malformed imports remain rejected before persistence. | `rejects malformed imports…`; `B50`; store unit tests. |
| M-1 | Worker cache remains content-versioned with update handling. | `@claim:build-artifacts`; offline test. |
| M-2 | Expensive texture remains absent and budgets pass. | `LH`; JS 40.31 KB raw/14.17 KB gzip; CSS 21.09 KB raw/5.47 KB gzip. |
| L-1 | CSP, permissions, framing, referrer, cache, and manifest policies remain deployed. | Deployment unit tests; production header inspection; `VERIFY`. |

## Final live result

- `npm run audit:live` passed after deployment from fresh browser contexts.
- The demo result intersects both initial viewports, keeps the banner, resets its seed, restores real data on exit, and reloads offline.
- Live `/`, demo, Privacy, and Terms have correct titles, one h1, one main, shared legal links, and zero serious/critical axe findings.
- Live `/does-not-exist` returns HTTP 404 with the designed Name Tap page.
- No review finding of any severity remains open.
