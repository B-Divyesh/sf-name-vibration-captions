# Name Tap visual thesis

## Direction: signal-board neo-brutalism

Name Tap should feel like a piece of dependable accessibility equipment, not a meeting app. Its visual language borrows from high-visibility workshop controls, captioning strips, and the physical pulse of a phone in a pocket: flat ink, hard offsets, obvious controls, and a single electric signal colour. The bluntness supports a two-second read of the only critical state: listening, heard, or stopped.

The interface is deliberately single-mode with an ink-on-paper daylight palette. It paints every surface explicitly and does not follow device dark mode; maintaining one high-contrast signal system avoids the meaning of the alert colours changing in a dark room. The active listening view reduces surrounding copy and keeps the stop control reachable at the bottom edge on a phone.

## Colour tokens

| Token | Value | Job |
| --- | --- | --- |
| paper | `#F4F0E6` | warm, low-glare app background |
| panel | `#FFFDF7` | working surfaces |
| ink | `#171713` | text, borders, shadows |
| muted ink | `#5D5A50` | supporting copy; 5.8:1 on paper |
| signal | `#C9FF38` | listening, focus, positive attention |
| signal ink | `#171713` | text on signal |
| notice | `#FFD23F` | permission and offline notices |
| danger | `#D9382C` | stop/error, always paired with words/icons |
| cool | `#86D8FF` | captions and informational status |

All body copy meets 4.5:1. State is never carried by colour alone: labels, icons, and geometry change with it.

## Type and rhythm

No runtime fonts are downloaded. Headlines use `Arial Black`, `Arial Narrow Bold`, and the system sans fallback to make dense, poster-like equipment labels. Body and controls use `Inter` when locally available, then `ui-sans-serif`/system sans. This is intentionally limited to device fonts for instant offline rendering and clear multilingual fallback.

The type scale is 16, 18, 24, 36, and clamp(44–72) px. Body line-height is 1.55 with a 68-character measure. Layout follows an 8px base rhythm with 4px optical corrections; control targets are at least 48px. Borders are 3px and key controls cast a hard 6px ink offset rather than soft shadows.

## Interaction grammar

- Pressable objects shift 3px toward their hard shadow, like a physical switch.
- Starting a session transforms the setup board into a listening instrument; the large state disc comes from the start control's visual vocabulary.
- A matched phrase creates one 240ms scale pulse and a haptic pattern. The transcript row is stamped `HEARD` so the cue survives without colour or motion.
- Captions are transient by design and are never persisted. Phrase settings persist locally.
- Destructive phrase removal is one-step undoable through a live status toast.
- The live screen has one dominant action: stop listening.

## Motion policy

Transitions last 160–240ms and animate only opacity and transform. Nothing loops. Match emphasis occurs once per detection with a 700ms cooldown to prevent repeated buzzes. Under `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed; match state switches instantly while haptics remain user-controlled.

## Illustration and assets

The hero illustration is a generated still life of a rugged phone acting as an attention relay: speech blocks enter one side and a bright tactile pulse exits the other. It explains the product without depicting a person, recording, or unsupported speaker identification. Authored SVG marks/icons use square terminals and inherit the same 3px ink stroke.

### Prompt sheet

Subject: a single rugged generic smartphone face-up, abstract paper speech fragments flowing toward it, concentric tactile vibration blocks radiating from its side. World: an accessibility tool bench assembled from cut paper, rubber, and screen-printed ink. Materials: matte recycled paper, black rubber, slightly imperfect risograph ink. Light: direct overhead studio light with hard compact shadow. Lens: orthographic editorial still life. Palette words: warm oatmeal, carbon black, acid chartreuse, small sky-blue accent. Composition: landscape, generous empty paper field, strong readable silhouette, no people.

Negative list: text, letters, numbers, captions, logos, trademarks, brands, watermarks, UI screenshots, gradients, glossy 3D, photorealistic hands, faces, ears, medical imagery, extra devices, illegible symbols.

### Provenance

- `assets/src/name-tap-hero.png` and derived WebP: generated for this product with Azure OpenAI image generation (`factory-image`) on 2026-08-27. Prompt: “Editorial neo-brutalist still life, a single rugged generic smartphone face-up on a warm oatmeal recycled-paper workbench, abstract blank paper speech fragments moving toward the phone from the left, bold concentric tactile vibration blocks radiating from the phone's right edge, carbon-black rubber and slightly imperfect screen-printed ink, acid chartreuse signal blocks with one small sky-blue accent, orthographic overhead composition, direct studio light, hard compact shadows, landscape with generous empty field, physical cut-paper construction, high contrast, no people, no text, no letters, no numbers, no watermark, no logos, no brands, no UI screenshot, no gradients, no glossy 3D, no medical imagery.”
- Original use and derivatives are licensed under this repository's MIT license. Generated imagery is disclosed in the footer.
