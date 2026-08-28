# Name Tap

Name Tap alerts hard-of-hearing people when a chosen phrase is spoken in a group conversation. It uses local captions during a session you start. A match triggers a vibration and high-contrast visual alert.

Name Tap is not a recorder, speaker identifier, or emergency service. Speech recognition can miss or falsely match words.

Live: <https://name-vibration-captions.sociobot.in>

Sample: <https://name-vibration-captions.sociobot.in/?demo=1>

## What it does

- Matches phrases, alternate spellings, close caption text, and similar sounds.
- Stops when the device cannot guarantee local captions.
- Keeps phrase settings on the device.
- Removes temporary captions when listening stops.
- Exports and imports phrase settings as JSON. Temporary captions are excluded.
- Includes three phrases, visual alerts, vibration alerts, and export at no charge.
- Opens the isolated sample offline after its first visit.

The sample runs in memory. It never opens or changes the real phrase database. See [.factory/demo.md](.factory/demo.md).

## Run and verify

Use Node.js 20 or newer.

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
npm run test:e2e
```

`npm run build` writes the static site to `dist/`. It creates direct demo, privacy, terms, and not-found pages. It also versions the offline worker from built asset names.

Playwright 1.58.2 runs desktop and 390 px mobile checks. The suite checks keyboard use, automated accessibility rules, privacy, offline use, demo isolation, imports, routes, and touch targets.

Run each `test` command in `.factory/claims.json` from a clean checkout. Each claim test starts from the sample where browser behavior is required.

After deployment, run the cold production audit:

```sh
npm run audit:live
```

## Android project

`android/` is the Capacitor project. Its application ID is `in.sociobot.namevibrationcaptions`. It declares microphone and vibration access.

`LocalSpeechPlugin` asks for microphone access when listening starts. It uses Android’s on-device recognizer and requests offline recognition. Caption text stays temporary. A match asks Android to play the vibration pattern.

Android 12 or newer and an installed offline language pack are required for hardware testing.

```sh
npm run cap:sync
cd android
./gradlew test assembleDebug
```

Never commit a release keystore. Hardware acceptance needs a compatible Android device:

1. Install the debug build.
2. Grant microphone access.
3. Confirm local recognition is available.
4. Speak a saved phrase.
5. Confirm the visual alert and physical vibration.

## Privacy and purchases

Name Tap loads no analytics, trackers, third-party fonts, or runtime scripts. Free use sends no phrases or captions to another site.

New purchases are unavailable. The app does not show a purchase link.

Read the user-facing [privacy policy](https://name-vibration-captions.sociobot.in/privacy) and [terms](https://name-vibration-captions.sociobot.in/terms).

## Product records

- `.factory/brief.json` defines the researched need.
- `.factory/design.md` records the visual system and image provenance.
- `.factory/polish-2.md` maps every review finding to repair evidence.
- `.factory/handoff.md` records final verification and deployment.

## License

MIT — see [LICENSE](LICENSE).
