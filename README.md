# Name Tap

Name Tap is a private attention cue for hard-of-hearing people in multilingual group conversations. During a session the user starts, it watches on-device live captions for a short personal phrase list and gives a distinct vibration and high-contrast visual cue when it hears a match.

It is intentionally not a meeting recorder, speaker identifier, emergency service, or promise of perfect speech recognition. Live: <https://name-vibration-captions.sociobot.in>.

## What v1 does

- Matches names and urgent phrases using explicit spelling variants, conservative edit distance, and phonetic matching.
- Requests local-only browser speech recognition and refuses to send microphone audio through a remote recognition mode.
- Keeps captions in memory for the active session only; phrase settings persist in IndexedDB with a localStorage fallback.
- Supports offline app-shell use and installed on-device language packs as a PWA.
- Exports/imports user-owned settings JSON without transcripts.
- Gives every user three phrases, visual alerts, haptics, and export for free.
- Offers an optional US$7 lifetime unlock for unlimited phrases and selectable vibration patterns through the Sociobot hosted checkout.

Current Chrome on Android with on-device speech recognition and the chosen language pack is the supported live-caption path. Unsupported browsers get an actionable explanation and never fall back silently to remote speech processing.

## Develop and verify

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
npm test
npm run build
npm run test:e2e
```

The exact production build command is `npm run build`. It creates the complete static site in `dist/`, including `dist/index.html`, direct `/privacy` and `/terms` entry points, the web manifest, and the service worker. Browser tests use Playwright 1.58.2 and cover the 390 px mobile flow, license UI, axe accessibility checks, and an explicit offline reload.

## Android handoff

`android/` is a Capacitor project using application ID `in.sociobot.namevibrationcaptions`, product-specific icons/splash, microphone and vibration declarations, a light edge-to-edge treatment, and synced web assets. This static worker does not include the Android JDK/SDK, so APK assembly and a native on-device ASR bridge belong to the later Android work order.

After native tooling is available:

```sh
npm run cap:sync
cd android
./gradlew assembleDebug
```

Never commit a release keystore.

## Privacy and payment

There are no analytics, advertising scripts, third-party fonts, or runtime CDNs. The license token uses the key `sb_license:name-vibration-captions`; cached verification is refreshed no more than daily. Checkout and refunds are handled by Sociobot/Dodo, not by this app. See `/privacy` and `/terms` for user-facing policies.

The product brief is in `.factory/brief.json`, the complete visual rationale and image provenance are in `.factory/design.md`, and the verification record is in `.factory/handoff.md`.

## License

MIT — see `LICENSE`.
