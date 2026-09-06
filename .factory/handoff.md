# Name Tap repair 3 handoff

Work order: `name-vibration-captions-repair-3`

## Result

**PASS — the Review 5 plain-words finding is repaired.**

The 404 page now shows the literal status `404`, followed by the plain heading
**Page not found**. It keeps both recovery actions: **Back to Name Tap** and
**Try sample data**. The decorative “WRONG FREQUENCY” label is gone.

The repair implementation is `060dafc049ae20bad0ace0d7db41ad023a23bd05`.

## What changed

- Replaced the decorative 404 label with `404` in `src/main.ts`.
- Advanced the displayed build ID to `1.2.2-repair3`.
- Added every visible 404 sentence and action to `.factory/copy-audit.md`.
- Extended the browser route test and live cold audit to prove the rendered
  status and both recovery destinations. These are user-visible flow checks,
  not source-string checks.
- Copied the verb-first catalog description to
  `/work/.evidence/catalog-description.txt`.

## Verification

From the documented clean setup, `npm ci` installed 150 locked packages with
no reported vulnerabilities. The following all passed:

- `npm run lint`
- `npm test` — 21/21 unit and static tests
- `npm run build` — created `dist/`; JavaScript 40.41 KB (14.21 KB gzip) and
  CSS 21.09 KB (5.47 KB gzip)
- `npm run test:e2e` — 50/50 desktop and 390 px phone browser tests
- Every exact command in `.factory/claims.json` — 25/25 passed individually
- `npm run cap:sync`

The focused not-found browser check passed on desktop and phone. It asserts the
page title, plain 404 status, heading, and both recovery links. The full browser
suite continues to cover the populated Maya sample, persistent demo banner,
reset, real-data isolation, error recovery, keyboard/focus, offline reload,
reduced motion, route structure, and serious/critical accessibility rules.

## Deployment and live check

Built `dist/` was deployed to the existing product static app with deployment
ID `87a64864-9486-4f95-9ac1-7f317971efa4`. HTTPS remained available at
<https://name-vibration-captions.sociobot.in>.

The live JavaScript and CSS match the local build byte-for-byte:

- JavaScript `assets/index-DM2qtCiJ.js`:
  `9c6094a950d0131781c72148d61edb7a989f7d5a50a24d67ac046c9cfd60e79c`
- CSS `assets/style-DuB63aH8.css`:
  `f94023838af558315d086285e8ec946bc98ed3732a45aa72507801e0966476f7`

`npm run audit:live` passed against production. It opened fresh phone and
desktop contexts, exercised the one-click populated sample, demo isolation,
reset, real-data exit, offline reload, route metadata, accessibility checks,
and the deliberate HTTP 404. Fresh phone and desktop reads showed the job
(“Feel a tap when someone says your name”), audience (hard-of-hearing people in
group conversations), and first action (**Try it with sample data**) before
scrolling. The 404 returned HTTP 404 and rendered the literal `404` status with
both recovery links.

A second live Lighthouse run completed after the first headless tab crash:
Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s,
LCP 1.3 s, TBT 70 ms, CLS 0.

## Earlier findings

The Review 5 report and every prior verification/review record were re-read.
Their previously repaired paths remain covered by the current build, browser,
claim, Android static, offline, privacy, accessibility, and host-policy checks.
Review 5's R5-1 was the only open finding; its page copy and audit omission are
both repaired here.

## Remaining boundary

Physical Android acceptance still needs an Android 12+ device with an installed
offline language pack: install the debug build, grant microphone access, speak
a saved phrase, and confirm the physical vibration. This is a documented
hardware boundary, not a public web claim. No paid offer is currently shown;
there is no registered live offer metadata to publish.
