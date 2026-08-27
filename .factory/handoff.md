# Name Tap v1 handoff

Work order: `name-vibration-captions-build-1`

Completed: 2026-08-27

## Shipped

- A finished Vite + TypeScript PWA for configuring a personal name/urgent-phrase list, confirming conversation consent, starting local-only caption recognition, matching fuzzy spelling/phonetic variants, and sending haptic plus full-screen visual cues.
- Session captions remain in memory and are erased on stop. Phrase/language/cue settings persist locally in IndexedDB with localStorage fallback, with JSON export/import.
- First-class empty, unsupported-browser, microphone/language-pack error, offline, listening, heard, stopped, and license states.
- Fourteen selectable conversation languages, explicit on-device recognition enforcement, per-match cooldown, three haptic patterns, and reversible phrase removal.
- A genuinely useful free tier (three phrases, all detection/cue/safety/export behavior) and a US$7 one-time lifetime unlock (unlimited phrases and selectable haptics). Production Sociobot buy, return-token capture, daily-cached verification, optimistic offline state, invalid-license reconciliation, and paste-to-restore are implemented without a product ID.
- Installable PWA manifest, versioned service-worker shell cache, update notice, offline fallback, 192/512/maskable icons, and offline reload coverage.
- Capacitor Android skeleton under `android/`, application ID `in.sociobot.namevibrationcaptions`, generated product icons/splash, microphone/vibration declarations, and synced web assets.
- Direct static `/privacy` and `/terms` entry points; no analytics, CDN assets, accounts, or third-party runtime scripts.
- A product-specific signal-board neo-brutalist system and original generated hero with complete prompt/provenance in `.factory/design.md`.

## Verification

All checks were run from `/work/repo` on 2026-08-27:

- `npm test` — 8/8 matcher tests passed.
- `npm run build` — passed TypeScript and budget checks; output is `dist/`.
- Production assets — initial JS 29.21 KB (10.31 KB gzip), CSS 18.55 KB (5.12 KB gzip), mobile hero 25 KB, desktop hero 98 KB. Budgets: JS ≤200 KB, CSS ≤50 KB, hero ≤300 KB.
- `npm run test:e2e` — 5/5 Playwright mobile-Chromium tests passed: add/test/remove/undo, consent path, paid haptic selection, legal page, axe serious/critical scan, and offline reload.
- `/opt/fleet/lib/verify-url.sh` — HTTP 200, title/lang/main present, one h1, image alt present, zero console/page errors after the final label fix.
- Manual 390×844 and 1440×1000 captures — no horizontal overflow; one h1; no console errors.
- Lighthouse mobile lab run — Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.5 s, TBT 120 ms, CLS 0.
- `npm audit --omit=dev` — zero known production vulnerabilities.

## Known gaps and next work order

- APK assembly was intentionally deferred by the injected stack decision. This static worker has no Java/Android SDK (`./gradlew assembleDebug` reports no `JAVA_HOME`). The later Android work order must add/test a native offline ASR bridge because Capacitor WebView support for the browser `processLocally` API varies by Android System WebView version. The PWA already refuses any recognition implementation that cannot assert local processing.
- Live microphone recognition, vibration strength, language-pack installation, Android permission UX, background/locked-screen behavior, and the brief’s 90%-of-20 controlled noisy-conversation success measure require real compatible Android hardware and hard-of-hearing participant testing. They were not simulated or claimed here.
- The factory still needs to register the production paid product and exercise a real purchase/refund token. UI automation covered a locally cached valid verdict; no payment provider or product ID is embedded.
- Lighthouse results are lab measurements on local production preview. INP needs field interaction data after deployment; TBT was 140 ms and is the available lab responsiveness proxy.
