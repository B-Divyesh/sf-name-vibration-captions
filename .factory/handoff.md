# Name Tap review 5 handoff

Work order: `name-vibration-captions-review-5`

## Result

**FAIL — 1 low-severity finding and 0 untested public claims.**

No product code was changed. The live 404 has one decorative metaphor label, `WRONG FREQUENCY · 404`, which violates the plain-words contract. Replace it with plain information and add that 404 copy to the copy audit before a PASS can be claimed.

## Versions

- Implementation candidate: `bb66111dde6987882e8c5f3f279af39805610886`
- Documentation head reviewed: `7cc0b383376c6dc37db7b5cc5fcae33b3bb57bc7`
- Live URL: <https://name-vibration-captions.sociobot.in>
- Live and built JavaScript SHA-256: `73409698d501a703e2bb1e37c5ae0931de51212635d023d6efd321e490d15eb7`
- Live and built CSS SHA-256: `f94023838af558315d086285e8ec946bc98ed3732a45aa72507801e0966476f7`

The commits after the implementation candidate are documentation-only. The deployed JavaScript and CSS match the clean build exactly.

## What was verified

- Fresh phone and desktop first screens state the job, hard-of-hearing audience, sample action, and three facts before scrolling.
- The one-click Maya sample, persistent demo label, reset, real-data isolation, replay alert, and same-origin network behavior passed live.
- Live offline sample reload, reduced motion, skip-link focus, legal routes, 404 response, headers, and Axe smoke checks passed. The 404 wording is the single finding.
- All 25 declared claim commands passed individually from clean checkout `/tmp/name-tap-review5.pDHIlD`.
- `npm run lint`, 21 unit/static tests, 50 browser tests, build, Capacitor sync, and live audit passed.

Read the required repair and complete evidence in [`.factory/review-5.md`](review-5.md).

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

Physical Android-device testing remains unperformed. A compatible Android 12+ device needs the README hardware checklist; this is not a public claim and is not counted as an untested claim.
