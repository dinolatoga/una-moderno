# Panorama overlap and cover trial — committed with owner authorization

Dino reviewed three annotation rounds and authorized committing this trial on
2026-11-02. [DESIGN.md](../DESIGN.md#pending-prototype-full-cover-hue-wash-and-moving-far-plane)
points here and lists the two trial color tokens. Its baseline cover and artwork
narratives have not yet been rewritten, so this record stays the authority for the trial.

The pre-prototype Claude Opus 5.5 read-only review returned **fix** on 2026-11-01.
It verified the frozen 68-file baseline, including the 1.618 grid, reduced type scale,
approved artwork fidelity and integration parity. That verdict is now **stale for
this prototype** and does not approve the new effect. No new Opus review is requested
until Dino visually approves this trial. The later full-cover treatment, lead-story
byline change and the owner corrections below are also outside that review.

## Compare

- Prototype (the default): `http://127.0.0.1:4321/`, or any illustrated route.
- Original static treatment: add `?art-effect=static`, for example
  `http://127.0.0.1:4321/about.html?art-effect=static`. The query works on every
  illustrated static, Tailwind and Astro route. It is a local preview-server comparison
  that writes the opt-out attribute, not client JavaScript.
- The effect is the shared default: every `body.una` with one of the five valid
  `data-una-art` names and a direct-child `.una-shell` receives it, with no per-page
  opt-in. `data-una-art-effect="static"` opts out; Astro's layout exposes that as
  `artEffect="static"`. Without a direct-child shell, or inside an embedded `.una`
  component, the artwork stays static, because a viewport-wide fixed plane needs the
  shell's paper backing. The unillustrated `/artworks.html` chooser stays plain.

## Owner corrections, 2026-11-01

Dino annotated four corrections on the public preview. Claude Opus 5.5 implemented them
as sole implementation lead; they supersede the earlier trial where the two conflict.

### 1. Cover: one uniform hue wash, no gradient

The copy-row tonal plane and its black vertical gradient are gone. The cover's
`::before` is now absolutely positioned with `inset: 0`, so one flat layer of
`--una-color-wash` (`rgb(28 52 40 / 68%)`, a restrained deep forest cast) covers the
whole box edge to edge, beneath the copy. No linear, radial or conic gradient, mask,
filter, blend mode or local text panel exists anywhere inside the cover. The
illustration keeps its full-bleed `object-fit: cover` frame and square, flat geometry.

The wash was tuned by computed contrast, not by eye. Browsers composite it in sRGB:
the illustration's lightest color, cream `#faf3e2`, becomes luminance 0.154 and even
pure white becomes 0.166, so paper text keeps at least 4.8:1 over any possible pixel.
The illustration keeps visible tonal structure, about a 2.6:1 range between window
fills and cocoa lines. Forest won over rendered olive (khaki) and teal (cold)
candidates; multiply blends were rejected because they push the darks toward black.

Canonical rose `#9b656b` would fall to about 1.1:1 on the wash, so the headline hover
uses `--una-color-accent-light` (`#f4c6cc`, a light tint of the same rose hue), at
about 3.2:1 even against the white composite, enough for this large text. Art blue
would give the focus outline only about 2:1, so the cover's 3px outline uses
destination blue (`--una-color-blue-light`), about 4.2:1 even against white. Weight 300 is unchanged on hover. AGENTS.md
and PRODUCT.md say the cover headline is "rose on hover"; the lighter rose needs the
owner's confirmation. The detector later flagged the caption's one-word last line; the
owner then removed that placeholder caption altogether (see round two).

A cover without an image still shows the plain stage field without the wash; a failed
image leaves the wash over stage. Print and forced colors remove both image and wash.

### 2. Phone recent stories: natural content height

This is a defect fix intended to ship; DESIGN.md records it. At 30rem and below each
`.una-story` was a two-column grid with implicit `auto auto` rows. The 96px thumbnail
spans both rows, so grid sizing distributed its surplus height into the title row as
well: a 27px title sat in a 45–59px stretched box and pushed the metadata down. Rows
are now `auto 1fr` with `align-items: start` and an 8px row gap, matching the desktop
title-to-metadata spacing; the 12px column gap is unchanged. The title row equals its
text, and any surplus thumbnail height falls below the metadata. A row grows when its
text outgrows the thumbnail. No negative margin, fixed or minimum height, or space
distribution is involved, and the source and reading order are unchanged.

Later on 2026-11-02 the recent-story annotation superseded this two-row stack. Cards with
an excerpt now use `auto auto 1fr` rows: title, stacked category and date, then excerpt,
with surplus thumbnail height below the excerpt. Cards without one keep `auto 1fr`.
DESIGN.md describes the current behavior.

### 3. The panorama itself moves

Motion thesis: the approved panorama is the issue's far plane and the paper shell its
near plane. As the reader scrolls, the art recedes at 0.4× the scroll while the shell
rises over it at 1×. This is the only new motion.

Inside `@supports (animation-timeline: scroll())` and
`@media (prefers-reduced-motion: no-preference)`, the fixed `body::before` runs
`una-art-recede` on `scroll(root block)` across `0 → var(--una-art-content-offset)`.
That 39vw range ends exactly where the shell's solid paper reaches the viewport top
and fully covers the art. The single keyframe animates only `translate` to
`calc(var(--una-art-content-offset) * -0.4)`, linear and scroll-locked, with no script,
library, `will-change` or easing lag. Travel is upward only, so the top edge never
shows paper. The art's opaque area always reaches the shell's rising fade, because
`31vw − y` stays above `42.2vw − 0.4y` for every scroll offset. There is no scaling or
cover cropping, and no horizontal overflow.

Lightning CSS folded the timeline into the `animation` shorthand in the minified core
and Astro bundles. Chrome 156 rejects that form (`CSS.supports` returns false), so the
motion would have been silently dropped. Separate longhands now survive all three
bundles, and a unit test guards both core bundles.

Without scroll timelines the art stays the earlier anchored fixed composition. Reduced
motion has no animation; the art returns to page coordinates and the shell fade
remains. Print and forced colors remove the art, offset and backing as before.

### 4. About the author

An open `about the author` module follows the edition note on the static, Tailwind and
Astro indexes: an `h2` and one paragraph, "Dino Latoga created Una Moderno and writes
this specimen." It has no portrait, card, divider, link, biography, location, title or
social account. The order is edition, author, topics, reading desk, colophon. The core
index template gains the same structure with neutral placeholder copy. This is
owner-directed content intended to ship; DESIGN.md records it.

Article sidebars said "All authors and stories in this specimen are fictional" beside
Dino's real byline. They now say "Stories in this specimen are fictional, and every
byline except Dino Latoga’s is invented." README, asset provenance, DESIGN.md and the
changelog use the same distinction. The stories remain illustrative; no biography was
added. Footer disclosures were already accurate and are unchanged.

## Owner corrections, round two

### 5. Placeholder caption removed

The lead feature's caption, "Small places. Open windows. A web made by people.", is gone
from the static, Tailwind and Astro indexes. Astro no longer passes a caption, so
`StoryImage` renders none. The design sidecar's cover preview lost it too; the core
template and fixtures never carried it. Each figure keeps its image, and no empty
`figcaption` remains.

The cover grid's explicit third `auto` row is now implicit: `minmax(12rem, 1fr) auto`, and
`minmax(10rem, 1fr) auto` at 42rem and below. The empty third track had still reserved one
1rem row gap, leaving 40px or 48px below the copy instead of the 24px or 32px padding. The
copy now sits exactly one padding above the cover's bottom edge at 320, 390, 768, 1280
and 1566 on all three integrations. A publisher's caption still creates its own row.

### 6. Parallax is the shared default

The About page showed the panorama without the homepage motion because the effect needed
the homepage-only `data-una-art-effect="parallax"` attribute. The overlap selectors now
match any `body.una` with a valid `data-una-art` and `:has(> .una-shell)`, excluding
`[data-una-art-effect='static']`. The homepage attributes and Astro's
`artEffect="parallax"` prop are gone.

All 14 illustrated routes now share the same motion, shell fade, fallbacks and media
behavior, each with its approved panorama:

- static index, About, long read, blue hour, commonplace and ordinary;
- the Tailwind index;
- Astro index, About, long read, blue hour, commonplace, ordinary and the image-free story.

The Tailwind example is one page; its About and article links lead to the static routes.
Browsers without `:has()` drop every overlap rule together and keep the static composition.

### 7. Navigation aligns with the wordmark

Above 42rem the strip takes a negative start margin:
`calc(0.0625 * min(var(--una-text-brand), 16vw) - 2 * var(--una-space-2) + 0.03 * var(--una-text-nav))`.
That is the strip padding plus the first link's inline padding, less Inter's measured
first-glyph bearings: the wordmark "u" sits 0.0625em in, and the nav "j" overhangs
0.03em. Before the fix the first label's ink sat 13px right of the wordmark's at 768 and
10.5px at 1280 and 1566. It now sits within 0.3px at 4× sampling, at weights 300 and 600,
on every page.

The first link keeps its 44px target and 3px focus outline. Both extend left inside the
strip padding, so the outline is not clipped. Wordmark, gaps, type and vertical geometry
are unchanged. At 42rem and below the strip is untouched. In all 28 phone cases (7 routes
at 320, 390, 568 and 667), the box, margin, scroll metrics, link boxes, hidden scrollbar
and overscroll matched the previous build exactly. The bearings belong to these Inter
glyphs; another wordmark or first label would need its own values.

## Motion and layering

The artwork pseudo-element is fixed. With scroll timelines it recedes at 0.4× until
the content offset, as described above; without them it stays anchored. The shell has
one transparent-to-paper backing, spanning the full page width. It rises over the
panorama, reaches solid paper at the shell's content edge, and protects all subsequent
text and side gutters. Full-width shell padding retains the original inner measure
without viewport-unit scrollbar overflow. The fade extends above the shell by
`clamp(3rem, 8vw, 8rem)`; the existing 39vw content offset is unchanged.

The art is neither cropped nor altered. No scroll handler, animation library, scripted
transform, `background-attachment: fixed`, permanent `will-change`, or additional
hover/reveal motion is used. Both decorative layers ignore pointer input. Print and
forced colors remove artwork, offsets and the backing. Unknown or empty artwork names
fall back to plain paper without a reserved blank band.

See [scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations),
[position](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position)
and [color-mix](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color-mix).
Browser support documentation is not a substitute for physical-device QA.

## Image-led editorial cover and byline

Only `.una-feature--cover` changes. Its illustration fills the entire container with
`object-fit: cover`; the title, deck and byline stay together in normal grid flow above
the uniform wash, so long or enlarged copy grows the cover without a fixed-height clip.
The specimens carry no caption. An optional caption still gets its own implicit row and
`text-wrap: pretty`. The image itself has no opacity filter.

The image link is removed on all three illustrated indexes. The headline remains the
single primary story destination; existing image alt text is preserved. Article
headers and non-cover features retain their existing layout.

The lead story and its article say **By Dino Latoga** across static HTML, Tailwind and
Astro fixtures. Other authors, including Mara Solis on the commonplace story, remain
fictional. Generic core templates keep their sample bylines. Published screenshot
assets are intentionally still the baseline; trial captures live in the ignored local
review directory.

## Tests

- New `tests/browser/collection.spec.mjs` (7 tests): phone recent rows at 320 and
  390px with one-line, authored two-line and long unbroken titles at 100% and 200%
  text, on all three integrations. It checks the title box against its line boxes, the
  8px gap, thumbnail-beside-text order, content-driven height and absence of overlap.
  The author module is checked for order, exact copy, open styling, desktop and stacked
  placement, axe, unskipped heading levels and template parity.
- `cover.spec.mjs`: three new wash tests. They check one computed layer covering the
  box, no gradient, mask, filter or blend anywhere inside, and flat paint with the
  illustration hidden. Paper, light-rose and focus colors must clear AA against the
  brightest washed pixel. Hover color and focus color are asserted.
- `parallax.spec.mjs`: plane geometry now includes `translate`. Three new tests measure
  the painted artwork's shift between screenshots (within 1px of 0.4× the scroll) and
  require a root `ScrollTimeline` animating only `translate`. They also check edges at
  five offsets. A fourth new test reproduces the unsupported cascade and confirms the
  anchored composition. Reduced motion must have no animation.
- `art.test.mjs`: both core bundles keep a feature- and preference-gated longhand timeline.
- `specimen.spec.mjs`: seven baseline failures predate these corrections, and were
  resolved narrowly where the older suite encoded the replaced side-by-side cover. The
  rule detector now admits only full-box tonal layers: the cover wash and the parallax
  shell fade. The full-bleed lead is asserted instead of a square cover. The hover test
  settles the below-the-fold headline before comparing geometry and expects light rose.
  Fixed art is expected on every illustrated page unless it opts out with `static`.
- Round two: `cover.spec.mjs` now asserts that no `figcaption` exists and that the copy
  sits exactly one padding above the cover bottom at 320, 390, 768, 1280 and 1566.
  `parallax.spec.mjs` (23 tests) uses one table of all 14 illustrated routes with their
  approved panoramas. Each route proves painted motion and edges with no query or
  attribute, and stays static under reduced motion. Forced colors and print cover every
  route; fallback, keyboard and delayed-art checks cover each index, About and long read.
  New guard checks cover a body without a direct shell and the `static` opt-out.
  `specimen.spec.mjs` adds ink-edge alignment at 4× sampling for seven routes at 768,
  1280 and 1566, with an unclipped focus outline and a 44px target. Phones at 320, 390,
  568 and 667 must keep a zero margin, the strip at the masthead edge, the 8px link inset,
  a zero scroll start, overflow and hidden scrollbar chrome.

## Evidence

Local Chrome 156 on macOS, against the working tree; the public tunnel was frozen on a
byte-verified pre-change snapshot during the work.

- Baseline (untouched prototype): 102 passed, 7 failed, all in `specimen.spec.mjs` for
  the reasons above.
- After the corrections: the full browser suite passed 123 of 123: collection 7,
  cover 27, parallax 12, specimen 77. No tests were skipped, flaky or unexpected. A
  second full run on the final CSS, after the caption fix, also passed 123 of 123.
- The public preview was refreshed only after these gates:
  https://vehicle-classroom-attitude-dice.trycloudflare.com/index.html served CSS bytes
  identical to the repository build. Fresh Chrome contexts on static, Tailwind and Astro
  at 390 and 1566 returned 200 with the author module and wash. They had no scripts,
  external or failed requests, or overflow, with one selected WebP each and live
  translate. Eight article, about and chooser routes returned 200 with the reconciled
  disclosure.
- `npm run check` exited 0: formatting, lint, 24 unit tests, art/token/core/Tailwind/Astro
  builds (69 tokens; Astro 0 errors, warnings or hints) and 265 local links.
  `git diff --check` was clean. Build outputs were byte-identical before and after the
  gate.
- Painted cover contrast for every text node, at rest and on hover, across static,
  Tailwind and Astro from 320 to 1566px, had these minima: title 3.45 (large text,
  light-rose hover), deck 5.10, metadata 5.21 and caption 5.19.
- The rendered translate matched −0.4× the scroll at every sampled offset. For example,
  −122px at 305px and a held −244.3px from 611px at 1566 wide; −30.4px at 76px and
  −60.8px at 152px at 390 wide. All five scenes kept their correct responsive WebP and
  passed the edge checks at 390 and 1566.
- Lab layout shift was at most 0.00092 for normal, delayed-art, failed-art and
  failed-font loads at 390 and 1566. It is one font-swap shift in masthead and navigation
  text, identical on the pre-change snapshot. Geometry was unchanged across delayed art.
  This is not a field Core Web Vitals claim.
- Keyboard order was skip link, wordmark, four navigation links, cover headline, three
  stories, then sidebar links, each in view with the 3px outline. No document overflow
  occurred at any tested width, at 200% text or with failed fonts.
- The single requested detector pass found 0 primary findings and two pre-existing
  advisories at 390px. The caption straggler was fixed. The cover headline's short last
  line comes from the documented `text-wrap: pretty` choice and was kept.
- Captures: `.impeccable/review/refinement/`, with `summary.json` holding every measured
  value.
- Round two: the full browser suite passed 135 of 135: collection 7, cover 27, parallax
  23 and specimen 78. No tests were skipped, flaky or unexpected. `npm run check` exited 0
  with 24 unit tests, 69 tokens, Astro 0 errors, warnings or hints, and 268 links;
  `git diff --check` was clean and build outputs were byte-identical across the gate.
  About and post routes (static and Astro) and the Tailwind index translated −30.4px at
  76px of scroll at 390 wide and −122px at 305px at 1566 wide. Under reduced motion they
  stayed absolute with no animation; the shell fade was present in both modes. The
  caption-free cover had two rows and exactly its padding below the copy (24px at phone
  widths, 32px at 1280 and 1566) on all three integrations. Nav ink deltas were within
  1px at 768, 1280 and 1566 on every route; phone navigation was unchanged in 28 cases.
  Round-two captures are in `.impeccable/review/refinement/round2/`.

## Remaining limitations

- Round three is recorded at the end of this file.
- Only Chromium 156 on macOS was exercised. Safari, iOS Safari, Firefox, physical
  devices and real touch-scroll smoothness remain unverified. Engines without scroll
  timelines show the anchored composition.
- The light-rose hover departs from the literal canonical rose and needs owner
  confirmation.
- DESIGN.md, the design sidecar and architecture.md still describe the earlier
  side-by-side cover; full reconciliation, including sidecar ramps and contrast pairs for
  the two new tokens, remains open.
- Earlier baseline findings still apply: artwork re-encoding has no proven
  cross-platform byte identity; generator/C2PA and artwork license wording need
  reconciliation; the Astro asset comment and optional prefixed mask were noted. The
  compact-link weight change on hover is resolved: every hover now changes color only.
  An independent review is still pending. The work is committed locally only; nothing is
  pushed, merged, published or deployed.

## Exact prototype changes from the frozen baseline

- `.impeccable/config.json`
- `.impeccable/design.json`
- `CHANGELOG.md`
- `DESIGN.md`
- `README.md`
- `docs/architecture.md`
- `docs/assets.md`
- `docs/parallax-prototype.md`
- `examples/astro/src/content/fixtures.json`
- `examples/astro/src/layouts/Journal.astro`
- `examples/astro/src/pages/[slug].astro`
- `examples/astro/src/pages/about.astro`
- `examples/astro/src/pages/index.astro`
- `examples/static-html/about.html`
- `examples/static-html/article.html`
- `examples/static-html/blue-hour.html`
- `examples/static-html/commonplace.html`
- `examples/static-html/index.html`
- `examples/static-html/ordinary.html`
- `examples/tailwind/index.html`
- `packages/core/dist/una.css`
- `packages/core/dist/una.min.css`
- `packages/core/README.md`
- `packages/core/src/tokens.css`
- `packages/core/src/una.css`
- `packages/core/templates/index.html`
- `packages/core/tokens.json`
- `packages/tailwind/theme.css`
- `scripts/serve.mjs`
- `tests/art.test.mjs`
- `tests/browser/collection.spec.mjs`
- `tests/browser/cover.spec.mjs`
- `tests/browser/parallax.spec.mjs`
- `tests/browser/specimen.spec.mjs`
- `AGENTS.md`
- `PRODUCT.md`
- `docs/design-direction.md`
- `docs/verification.md`
- `docs/images/` shipping captures and `captures.json`
- `.impeccable/surfaces/examples-static-html-index-html.md`

## Owner corrections, round three

Round three (2026-11-02) applies site-wide, not only to the trial:

- The utility row is gone from every page, template and integration, with its styles and tests; the masthead opens the shell with no reserved row.
- The first navigation label's ink aligns with the wordmark's at every width, within 1px.
- Overflowing phone strips gain a paper fade at the right edge, driven by the strip's own scroll timeline. It shows only while destinations remain, clears over the last 2.5rem of travel and never appears when nothing overflows. At 430px the specimen strip fits after the alignment shift, so no fade appears there.
- Titles drop the 21ch measure and balanced or pretty wrapping. They fill the content width and wrap only where a line runs out, so the lead title fits one line at 612px.
- Every link hover changes color only.

A clean full browser suite passed 150 of 150. See [the verification record](verification.md) for gates, public smoke results and the remaining boundaries.
