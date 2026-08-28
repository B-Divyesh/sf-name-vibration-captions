# Name Tap review round 3 handoff

Work order: `name-vibration-captions-review-3`

## Delivered

- Performed an adversarial cold-read review of the deployed site at 390 px and desktop.
- Wrote `.factory/review-3.md`; verdict: **PASS**, with zero findings.
- Did not modify product code or assets.

## Verification

- Fresh clean clone: `/tmp/name-tap-review3.5SSa1o` at `67f8ac3`.
- `npm ci`: passed (0 vulnerabilities reported).
- `npm test`: passed, 21/21.
- `npm run test:e2e`: passed, 50/50; every registered claim tag was exercised.
- `npm run build` and `npm run lint`: passed.
- `npm run audit:live`: passed.
- Manual fresh-context checks confirmed the first-screen message, one-click matched demo, reset/isolation, no off-origin demo traffic, offline claim coverage, titles/metadata, route/404 status, and links.

## Known gaps and next step

No web review finding remains. Physical Android-device acceptance is still a hardware validation task, not a claim accepted by this review.

---

# Prior polish round 2 handoff

Work order: `name-vibration-captions-polish-2`

Candidate repaired: `8fad78a3f454a1121a40ad005f2b859560082fed`

Adversarial review: `6c406b3beed21f30545532ae8ec5a690eb9c3228`

Repair head before this evidence record: `987bdd09f67c45f0b9f719b197e5bd52d2003739`

Deployment ID: `d2cb6a41-9e56-4fbb-9ded-9edd24fde556`

Live: <https://name-vibration-captions.sociobot.in>

## Delivered

- Demo mode now opens directly on the matched Maya caption board at both phone and desktop sizes.
- The persistent demo banner, Reset demo, Start for real, memory-only sample state, and offline sample remain intact.
- Local-caption support now uses an asynchronous probe for the selected language. Available, download-needed, unavailable, and rejected states are separate.
- The comma-entry claim now proves `Maya, Maia` parsing and a real Maia → Maya caption match.
- The visual setting and claim now say “High-contrast visual alert.” Its exact colours and 4.5:1-or-better contrast are tested.
- The dormant purchase/license path and its unprovable privacy claims were removed.
- Privacy copy now scopes device data correctly and links the host’s published policy.
- Every round-2 copy finding was rewritten. A regression test rejects the reviewed phrases.
- A registry gate enforces exactly one tagged test for each of the 25 claims.
- `scripts/audit-live.mjs` provides a repeatable cold production acceptance audit.
- The signal-board neo-brutalist visual identity, generated art, PWA, and Capacitor Android skeleton were preserved.
- `.factory/polish-2.md` maps every cumulative finding to current evidence.

## Exact verification

Final clean clone: `/tmp/name-tap-polish2-final.V2vJO7` at `987bdd09f67c45f0b9f719b197e5bd52d2003739`.

- `npm ci`: passed; 150 packages, 0 vulnerabilities.
- Every command in `.factory/claims.json`: 25/25 passed individually.
- `npm run lint`: passed.
- `npm test`: 21/21 passed.
- `npm run build`: passed and produced `dist/`.
- Production bundle: JS 40.31 KB raw / 14.17 KB gzip; CSS 21.09 KB raw / 5.47 KB gzip.
- `npm run test:e2e`: 50/50 passed across 1440 × 1000 and 390 × 844 projects.
- Browser suite: demo isolation/reset/exit, privacy traffic, offline reload, keyboard/focus, routes, metadata, imports, 44 px targets, and route accessibility passed.
- `npm run cap:sync`: passed and synchronized the final web build into the Android project.
- Factory URL verifier: passed `/`, `/?demo=1`, `/privacy`, and `/terms`; no page or console errors.
- `npm run audit:live`: passed after deployment from fresh contexts.
- Live unknown route: `/does-not-exist` returns HTTP 404 and the designed 404 page.
- Live/local JS SHA-256 match: `95cfff433f392f582e1e50864138bf7e29dc22d9e382153f5a0494a761c1bfd2`.
- Live mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.1 s, TBT 70 ms, CLS 0.
- Sociobot privacy-policy link: HTTP 200.

Evidence screenshots are under `.factory/evidence/polish-2-live-*`. The demo evidence shows the matched board inside the initial viewport.

## Run locally

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:e2e
npm run cap:sync
```

Run `npm run audit:live` after deployment. Run each command in `.factory/claims.json` from a clean checkout for claim acceptance.

## Known gaps and next step

No review finding remains open. This static work order does not contain a JDK or Android SDK, so Gradle and physical microphone/vibration checks could not run here. The work-order contract explicitly assigns APK building and hardware acceptance to a later Android work order; the Capacitor project and static native regressions are ready for it.
