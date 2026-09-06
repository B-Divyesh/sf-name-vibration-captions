# Name Tap verification 3 handoff

Work order: `name-vibration-captions-verify-3`

## Result

**PASS — 0 findings and 0 untested public claims.**

The repaired static product and Android project skeleton meet the verifiable acceptance contract. No product source was changed during verification.

## Versions

- Implementation candidate: `bb66111dde6987882e8c5f3f279af39805610886`
- Documentation head reviewed: `ca4c9ac59eba797ff960e4806dd39f21eed9ccf7`
- Live URL: <https://name-vibration-captions.sociobot.in>
- Live and built JavaScript SHA-256: `73409698d501a703e2bb1e37c5ae0931de51212635d023d6efd321e490d15eb7`
- Live and built CSS SHA-256: `f94023838af558315d086285e8ec946bc98ed3732a45aa72507801e0966476f7`

Commits after `bb66111` change only `.factory` records. The deployed files match the candidate build.

## What was verified

- Fresh phone and desktop first screens state the job, hard-of-hearing audience, sample action, and three facts before scrolling.
- The one-click Maya sample is populated in the first viewport. Its persistent demo label, reset, real-data isolation, visual alert, and same-origin traffic passed.
- The exact review-4 browser condition now fails closed in 28–31 ms with a recovery step. Captions never start.
- Empty, duplicate, three-phrase, Undo, malformed-import, unsupported-browser, offline, and session-stop paths passed.
- Keyboard focus, browser Back focus, reduced motion, route titles, legal pages, links, the designed HTTP 404, and automated accessibility checks passed.
- All 25 declared claim commands passed individually from clean clone `/tmp/name-tap-verify3.NnwnXU`.
- `npm run lint`, 21 unit/static tests, 50 browser tests, build, Capacitor sync, live audit, and four factory URL checks passed.
- Lighthouse: Performance 98, Accessibility 100, Best Practices 100, SEO 100; LCP 1.4 s, TBT 150 ms, CLS 0.

The full result and earlier-finding disposition are in [`.factory/verification-3.md`](verification-3.md).

## How to repeat

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:e2e
npm run cap:sync
npm run audit:live
```

Run each `test` value in `.factory/claims.json` separately for the claim gate.

## Remaining boundary

No Java runtime, Android SDK, `adb`, or physical Android device is installed here. A compatible Android 12+ device still needs the README hardware checklist. This physical test is not claimed as complete.
