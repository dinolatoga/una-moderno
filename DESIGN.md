---
name: Una Moderno
description: A portable editorial layout system for the independent web.
colors:
  ink: '#47281a'
  muted: '#715347'
  paper: '#fffefa'
  white: '#fff'
  blue: '#87a9d3'
  blue-light: '#e8eff8'
  link: '#294d79'
  rust: '#a1440d'
  selection: '#f2cc89'
  focus: '#294d79'
  stage: '#171514'
  wash: 'rgb(28 52 40 / 68%)'
  accent: '#9b656b'
  accent-light: '#f4c6cc'
  original-brown: '#876551'
  original-rose: '#9b656b'
  original-slate: '#727c9f'
  original-orange: '#cd5f19'
  original-cream: '#faf3e2'
typography:
  display:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: min(clamp(2.4rem, 5.6vw, 4.4rem), 16vw)
    fontWeight: 200
    lineHeight: 1.05
    letterSpacing: -0.025em
  headline:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: clamp(1.8rem, 3.36vw, 2.7rem)
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: -0.025em
  cover-headline:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: clamp(1.6rem, 2.4vw, 2.2rem)
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: -0.025em
  section:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: clamp(1.6rem, 2.4vw, 2rem)
    fontWeight: 300
    lineHeight: 1.15
  prose-heading:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 1.6rem
    fontWeight: 300
    lineHeight: 1.15
  title:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.35
  title-compact:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  prose:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 1.1875rem
    fontWeight: 400
    lineHeight: 1.75
  deck:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.55
  cover-deck:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 0.8125rem
    fontWeight: 500
    lineHeight: 1.6
  note:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
  strapline:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  excerpt:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  navigation:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: clamp(1.4rem, 2.4vw, 1.8rem)
    fontWeight: 300
    lineHeight: 1.35
    letterSpacing: -0.015em
  navigation-current:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: clamp(1.4rem, 2.4vw, 1.8rem)
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: -0.015em
  section-label:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: 0.03em
  quote:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 1.375rem
    fontWeight: 400
    lineHeight: 1.5
  list-link:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.6
  code:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 0.85em
    fontWeight: 400
  prose-link:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 1.1875rem
    fontWeight: 600
    lineHeight: 1.75
spacing:
  '1': 0.25rem
  '2': 0.5rem
  '3': 0.75rem
  '4': 1rem
  '5': 1.25rem
  '6': 1.5rem
  '8': 2rem
  '10': 2.5rem
  '12': 3rem
  '16': 4rem
  '20': 5rem
components:
  masthead:
    textColor: '{colors.ink}'
    typography: '{typography.display}'
  navigation:
    textColor: '{colors.muted}'
    typography: '{typography.navigation}'
    padding: 0.5rem
  navigation-current:
    textColor: '{colors.accent}'
    typography: '{typography.navigation-current}'
  feature:
    textColor: '{colors.ink}'
    typography: '{typography.headline}'
  feature-cover:
    backgroundColor: '{colors.stage}'
    textColor: '{colors.paper}'
    typography: '{typography.cover-headline}'
    padding: 1.5rem
  recent-story:
    textColor: '{colors.ink}'
    typography: '{typography.title}'
  story-excerpt:
    textColor: '{colors.muted}'
    typography: '{typography.excerpt}'
  publication-module:
    textColor: '{colors.ink}'
    padding: 0 0 1.5rem
  link-list:
    textColor: '{colors.link}'
    typography: '{typography.list-link}'
  article-contents:
    textColor: '{colors.link}'
    padding: 0.75rem 0
  quote:
    backgroundColor: '{colors.original-cream}'
    textColor: '{colors.ink}'
    typography: '{typography.quote}'
    padding: 1.5rem
  prose-reading:
    textColor: '{colors.ink}'
    typography: '{typography.prose}'
---

# Design System: Una Moderno

## Overview

**Creative North Star: "An editorial collection"**

Una Moderno makes an independent publication feel like a collection worth browsing: large light typography, confident square artwork, compact useful lists, and continuous open space without dividers. Cocoa text and a warm near-white ground surround a charcoal lead-story field. An optional approved panorama opens the page at its natural proportions and gives way to the reading surface. Rose marks navigation state; the colorful page illustrations and geometric story art remain distinct from the interface palette.

The owner-pinned Zune 4.0 light Collection view supplies the typographic hierarchy, aligned lists, and open canvas. The historical Zune HD website reference supplies the dark lead field within a light document. These principles become an original editorial system, with Inter in every text role and a calm light article surface. The references are evidence, not distributable artwork or a media-player template; their relationship to the implementation is recorded in [the inspiration record](docs/zune-inspiration.md).

Hierarchy comes from weight, scale, leading, and space within one family. The system stays flat and native: ordinary links, a single horizontal navigation strip, semantic headings and lists, and article contents built with disclosure. The charcoal story treatment is a component variant, not a dark theme. The five generated panoramic backgrounds were approved for Una under the owner’s direction; their exact masters remain source assets and their delivery derivatives preserve each complete scene.

**Key Characteristics:**

- Light lowercase display and navigation typography, with regular-weight sustained reading.
- An optional full-width panorama, followed by a charcoal lead-story field, square cover art, and open supporting lists on a continuous light ground.
- Exact 1.618:1 editorial columns with one fluid gutter, followed by a source-order stack with a separate row gap.
- Inter across all text roles; prose remains bounded by a 70ch maximum.
- Native scrolling and visible focus, with brief link-color and article-target transitions that respect reduced motion.

This is a derived record of the implemented system. [Canonical token CSS](packages/core/src/tokens.css) remains the authoring authority for all 69 custom properties, two of which serve the [pending cover prototype](#pending-prototype-full-cover-hue-wash-and-moving-far-plane); [semantic styles](packages/core/src/una.css) define their application. The frontmatter is the machine-readable snapshot for design consumers, not a competing token source. [Generated token JSON](packages/core/tokens.json) is the complete inventory. Update source CSS first, build, and reconcile this document and [.impeccable/design.json](.impeccable/design.json). The optional Tailwind layer aliases the same variables. This record describes implementation, not review or test outcomes.

## Colors

Warm cocoa and near-white paper carry reading; a charcoal cover field gives one lead story presence while rose supplies a precise interaction accent. Exact color values appear in the frontmatter.

### Primary

- **Cocoa ink** (`ink`): publication identity, headings, and ordinary text.
- **Selection rose** (`accent`): current navigation and hover/active link states. Its canonical CSS value aliases `original-rose`; the frontmatter resolves it for portability.
- **Reading blue** (`link`): ordinary links and article contents.
- **Focus blue** (`focus`): the ordinary focus outline; a separate semantic token with the same source value as Reading blue.
- **Deep rust** (`rust`): a retained historical core palette token; the current link-hover treatment uses rose, not rust.

### Secondary

- **Art blue** (`blue`): editorial imagery and the higher-contrast focus outline inside the charcoal cover.
- **Destination blue** (`blue-light`): article targets and original illustration detail.
- **Historical rose** (`original-rose`): the accent alias's source and original geometric art.
- **Selection amber** (`selection`): selected text with cocoa ink.
- **Forest wash** (`wash`) and **Light rose** (`accent-light`): the translucent cover grade and its headline hover, reserved for the [pending cover prototype](#pending-prototype-full-cover-hue-wash-and-moving-far-plane).

### Tertiary

- **Historical slate** (`original-slate`) and **Historical orange** (`original-orange`): illustration colors, not ordinary small-text colors.

### Neutral

- **Reading white** (`paper`): the nearly white document and light text on the cover field.
- **Clear white** (`white`): the revealed skip-link surface.
- **Charcoal stage** (`stage`): the optional index-story cover field; the article remains light.
- **Muted cocoa** (`muted`): inactive navigation, metadata, captions, supporting descriptions, and footer copy on the light ground.
- **Historical brown** (`original-brown`): the document scrollbar where supported; navigation scrollbar chrome is hidden.
- **Quote cream** (`original-cream`): quotation fields and original artwork.

**The Useful Color Rule.** Reserve the charcoal field for the cover variant and rose for navigation state and interaction. Make links distinct through color and weight, with italic weight-600 anchors in prose and no underlines or decorative dividers; keep historical slate and orange out of ordinary small text.

Calculated from the source sRGB colors, ink, muted cocoa, and rose against paper are approximately 13.12:1, 6.87:1, and 4.66:1. Paper text against the charcoal stage is 18.04:1; the cover's blue focus outline against that stage is 7.49:1. These pair calculations do not certify complete components or interactions. Cover metadata and captions use paper rather than the muted light-surface color.

The sidecar's eight-step color ramps are synthetic preview aids, not shipped tokens or approved extra UI colors. The approved panoramas contain their own illustration colors; those pixels are not additional interface tokens. This system has no theme switcher or alternate dark mode.

## Typography

**Typeface:** Inter for identity, headings, navigation, supporting text, prose, quotations, and inline code. The body token owns the stack; display, prose, and code tokens alias it at the root. The four public role tokens remain stable.

**Fallback:** Una Inter Fallback, system-ui, sans-serif. The named fallback uses locally installed Arial or Arial Bold; those system fonts are not redistributed. Its adjustments target Inter's optical-size-14 metrics: size-adjust 105.2731%, ascent-override 92.0226%, descent-override 22.9129%, and line-gap-override 0%. Local regular Arial covers requested weights 100–599; local bold covers 600–900. These approximate the fallback's weight and metrics, not every glyph width or optical size.

**Delivery:** The optional [font stylesheet](packages/core/assets/fonts.css) loads one unmodified upright variable WOFF2, with `font-display: swap` and `font-optical-sizing: auto` on the publication. The official release is Inter v4.1; the actual binary embeds `4.001;git-9221beed3`. The file is 352,240 bytes, with SHA-256 `693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3`. Its weight axis spans 100–900 and optical-size axis 14–32. The specimen renders weights 200, 300, 400, 500 and 600; no hover or active state changes weight. Preserve its [SIL OFL license](packages/core/assets/OFL.txt), [asset record](docs/assets.md), and [machine-readable provenance](packages/core/assets/provenance.json). No external runtime font request is needed. Italic emphasis and inline prose links use browser synthesis from the upright face; no separate italic asset is loaded.

**Metrics:** Inter has 2048 units per em, ascent 1984, descent −494, line gap 0, and cap height 1490. X-height is 1118 at optical size 14 and 1056 at optical size 32. The previously measured local Arial/Arial Bold fallback has 2048 units per em and x-height 1062. A single fixed fallback cannot match all optical sizes, weights, or advances; font loading may change wrapping.

**Character:** Large light lettering gives the collection its voice; regular text carries reading. Compact story titles and current navigation gain weight to remain easy to scan. The ramp consists of actual roles rather than one mathematical ratio.

### Hierarchy

- **Display:** the lowercase wordmark, weight 200, using the 2.4rem–4.4rem fluid token capped at 16vw, with 1.05 leading and tight tracking. Each word stays intact in its own span, with a real space between them.
- **Headline:** lowercase article titles, weight 300, fluid between 1.8rem and 2.7rem, with 1.08 leading and no measure cap: titles use the full content width and wrap only where a line runs out. **Cover headline** uses 1.6rem–2.2rem in the narrower charcoal composition.
- **Section:** lowercase recent-story and sidebar headings, weight 300, fluid between 1.6rem and 2rem. **Prose heading** is 1.6rem with 1.15 leading.
- **Title:** compact recent-story headings, weight 600, 1.125rem with 1.35 leading; the phone row uses the 1.25rem **Title compact** role.
- **Navigation:** lowercase links, weight 300, fluid between 1.4rem and 1.8rem, with 1.35 leading and slightly tight tracking. Inactive links use muted cocoa and retain weight 300 on hover/active, changing only to rose. **Navigation current** stays rose at weight 600 in every interaction state.
- **Body:** 1rem regular supporting text. **Prose** is 1.1875rem with 1.75 leading and a 70ch maximum. **Deck** is 1.125rem with 1.55 leading and a 60ch maximum; **Cover deck** is 1rem.
- **Label:** metadata and captions, 0.8125rem at weight 500. Dates use tabular numerals. **Section label** is 0.75rem, weight 600 and uppercase with 0.03em tracking; it carries actual list information. No utility row sits above the masthead.
- **Note:** 0.875rem muted supporting copy. **Strapline** uses the same size with tighter 1.5 leading. **Excerpt** shares the strapline metrics in muted cocoa, with a 60ch maximum and pretty wrapping that avoids one-word last lines. It follows a recent story's stacked category and date: regular, one step larger than the metadata and smaller than the title. **List link** uses the body size at weight 600 in every state.
- **Quote:** 1.375rem regular text with 1.5 leading inside the cream field. **Code** uses the same family at 0.85em with inherited prose leading, not a fixed-width face.

Display, navigation, section, article-title, cover-title, and prose-subheading sizes are 80% of the preceding scale. Body, prose, metadata, decks, quotations, and compact recent-story titles retain their sizes. Cover and prose-subheading sizes now have canonical tokens.

The frontmatter records the exact implemented roles, including stylesheet literals; it does not create new CSS token names. Section headings use balanced wrapping; titles, including the cover headline, wrap naturally at full width. Long words may wrap. Body paragraphs retain normal wrapping. Strong text and ordinary links use weight 600. Hover and active change link color only, never weight or geometry; `--una-weight-hover` (700) remains a compatibility token that no core state applies. **Prose link** stays italic at weight 600 while its color changes, distinguishing it from both regular body text and upright strong text. Link roles retain their surrounding size.

**The One Family Rule.** Use Inter across every text role. Keep display typography light and lowercase, compact titles stronger, and sustained prose regular; establish hierarchy with the existing role scale and spacing.

For coordinated theme changes, override primitives at `:root` after core CSS. Custom-property aliases resolve where declared: changing only `--una-font-body` on a descendant does not recompute the root's display/prose/code aliases. Scoped themes must redeclare the dependent aliases there; the same rule applies to the accent/rose alias and to layout gaps that depend on spacing primitives. Tailwind's inline mapping does not create an independent token source. See [the markup and theming contract](docs/architecture.md).

## Layout

The centered shell caps at 75rem. It leaves 1.5rem side margins above 30rem and 1rem at or below that breakpoint. The desktop grid uses `minmax(0, 1.618fr)` and `minmax(0, 1fr)`: an exact 1.618:1 ratio. Its column gap is `clamp(var(--una-space-12), 4.1667vw, var(--una-space-20))`, or 3rem–5rem. With a 16px root, this ranges from 48px to 80px and is about 60px at a 1440px viewport or 65.25px at 1566px. These are proportional tracks rather than fixed pixel widths; the sidebar starts at its track edge. The separate row gap is `var(--una-space-10)`, or 2.5rem. The historical 580:360 ratio and 20px gap are origin evidence, not current layout values.

The index combines one cover story, three recent covers, and useful lists. A cover with a figure uses two equal internal tracks and a 1.5rem gap inside 1.5rem padding. Copy comes before the figure in source order; wider layouts place the figure left and the copy right. At 42rem and below, copy and figure stack in source order. Cover and recent-story art are square; an ordinary article-header image retains its 3:2 frame. Images use cover cropping. Omitting optional images preserves complete linked stories and a one-column feature.

At 56rem and below, the editorial grid becomes one column, the sidebar follows across the 2.5rem row gap without an additional top margin, and the masthead description moves below the wordmark. Article contents moves from its sidebar list to native inline disclosure. At 30rem and below, recent stories become rows with `min(6rem, 33.3333%)` for the image track and a flexible text track; this reserves text space when font size increases. Beside the thumbnail, the title, metadata and excerpt form one content-height stack with 8px row gaps. Each text row is exactly its content, and any surplus thumbnail height falls below the excerpt rather than between them. A story without an image uses one text column; one without an excerpt keeps the title-and-metadata stack.

At every width a recent story reads title, category, date, then excerpt. The category and date take separate lines with no gap between them, so they read as one tight pair. The title-to-metadata and metadata-to-excerpt intervals are both 0.5rem. Wider layouts keep three natural-height columns: titles that wrap differently shift the lines below them instead of reserving equal title rows.

Main navigation remains one horizontal row at every width. Only its strip scrolls when links exceed the space. The gap is 1.5rem, reduced to 1rem at 30rem and below, with no narrower override; actual fit and the next-label peek depend on text lengths and font metrics.

Spacing follows the quarter-rem scale, with larger steps for sections. Prose siblings are separated by 1.5rem; subsection headings begin after 3rem. Story and sidebar text use open space rather than dividers or enclosing panels.

**The Honest Gutter Rule.** The desktop columns share one fluid column gap; stacked content uses its own 2.5rem row gap. Do not add sidebar padding or margin that doubles either space; the dark feature has its own internal padding.

Print removes the optional page panorama and its content offset, then hides navigation, sidebar and skip link; it changes the document to black on white and full-width main content. The cover loses its dark background and padding, and its metadata and caption inherit the print text color. All links, including visited, hover, and active states, inherit the surrounding print text color so screen link colors do not carry onto white paper. These are stylesheet behaviors, not print certification.

## Elevation & Depth

The core has no shadows, raised cards, blur, or translucent content layers. The charcoal lead-story field, cream quotation, and pale destination highlight separate roles through tone. Supporting stories and lists remain on the continuous document surface. The masthead itself has no decorative background or pseudo-element. When selected, the panorama belongs to a separate full-width page layer behind the content; its lower-quarter mask blends the master’s near-white area into paper. There is no opaque text overlay or blanket dimming of the scene.

**The Flat Page Rule.** Separate functions with continuous space, typography, and the charcoal cover field. Keep supporting stories and lists on the page ground without decorative rules, drop shadows, or floating cards.

## Shapes

No corner-radius, border-width, or divider-color token remains. Containers have square default geometry; cover and recent artwork use square frames while article-header art remains rectangular. The original illustrations may contain circles, paths, and window geometry. Decorative borders, dividers, and link underlines are absent. The focus outline signals interaction rather than elevation. The masthead has no stripe geometry. Optional page panoramas preserve their full rectangular compositions, while geometric story illustrations remain within their content frames.

## Components

### Masthead

A large light lowercase home link in cocoa sits opposite a short description on desktop and above it when stacked. The two wordmark spans are separated by a real space and each uses `white-space: nowrap`, allowing a break between words while keeping each word intact. Its rendered size is `min(var(--una-text-brand), 16vw)`, capping the fluid logo under enlarged-text conditions. Both words inherit cocoa; hover/active changes only the color to rose while retaining weight 200. The masthead has no decorative geometry and opens the shell directly: no utility row sits above it.

### Optional panoramic background

One `data-una-art` choice on the publication scope selects `cat-studio`, `robot-city`, `ribbon-world`, `kite-festival`, or `desktop-garden`; omission keeps the plain paper ground. The positioned, isolated scope reserves `39vw` before content. An absolute `::before` layer spans its width with a 1672:941 aspect ratio, `background-size: 100% auto`, centered top positioning, `z-index: -1` and `pointer-events: none`. The image is neither cropped with cover sizing nor faded through blanket opacity. `mask-image: linear-gradient(#000 75%, transparent)` blends only the lower quarter into the warm paper. The header starts in the master’s quiet lower area, with no opaque panel over the illustration. This viewport-based offset is calibrated for a full-width page; a narrower embedded scope needs an appropriate offset override.

The default source is the 1672px WebP; at 52rem and below CSS uses the 832px derivative. The four artwork tokens own the full and small URLs, the master aspect ratio and the content offset. Print and forced colors hide the layer and remove the offset. There is no client-side randomization; the scroll-linked drift belongs to the [pending prototype](#pending-prototype-full-cover-hue-wash-and-moving-far-plane), and `data-una-art-effect="static"` keeps this static baseline. HTML or the adapter selects one allowlisted scene at build/server time; a fresh page activates one size of that scene, while resizing across the breakpoint can request its other size.

Exact approved 1672×941 PNG masters live under `artwork/masters/` and remain outside the consumer package. The pinned Sharp pipeline produces full-frame 1672×941 and 832×468 WebPs without cropping, recoloring, compositing or further generation. The opaque near-white image fade belongs to the approved master; it is not an intrinsic alpha mask. Preserve the masters and their metadata, and reproduce delivery files with `npm run build:art`. [Asset provenance](docs/assets.md#optional-page-artwork) records generation, approval, encoder settings and hashes. This records the approved source and transformation, not a copyright or exclusivity guarantee. The unillustrated [chooser](examples/static-html/artworks.html) links to all five full-page examples.

### Navigation and text links

One labeled navigation landmark contains a single set of direct anchor children. The links never wrap or shrink. The strip has no bounding rules. Inactive links use muted cocoa at weight 300 and change only to rose on hover/active. The current page has `aria-current="page"`, rose color, and weight 600, which remains stable on hover/active. General links are reading blue at weight 600 and become rose on hover/active without changing weight. All link states remain undecorated. Linked display titles retain weight 300 while changing color from reading blue to rose; inside the cover they start in paper and change to rose. Inline prose links retain italic weight 600 while changing from reading blue to rose. Recent-story title links use reading blue at weight 600 and turn rose on hover. Every hover changes color only.

The strip has 0.5rem padding; links have a 44px minimum height and 0.25rem by 0.5rem padding. Inline scroll padding of 50% establishes a centered optimal viewing region for native focus scrolling, with 0.5rem link scroll margins. This guides the browser to reveal partly visible focused links. Scrollbar chrome is hidden with `scrollbar-width: none` and the WebKit scrollbar selector. A partial next label indicates continuation. Horizontal overscroll is contained; vertical gestures and momentum remain browser-managed. No snapping, timers, custom scroll animation, or runtime JavaScript is part of this behavior. At every width a negative start margin moves the strip left by its padding and the first link's inline padding, less Inter's measured first-glyph bearings (wordmark "u" 0.0625em, nav "j" overhang 0.03em), so the first label's ink starts within a pixel of the wordmark's ink. The first link's hit and focus areas extend left inside the strip padding. At 42rem and below, where scroll timelines exist, a 2.5rem paper fade masks the strip's right edge while destinations remain; it is absent when nothing overflows and clears over the last 2.5rem of travel. Forced colors remove it, and print hides the strip.

Keyboard focus uses a 3px outline offset by 4px. The normal focus color is reading blue; inside the charcoal cover it changes to art blue. The skip link appears on a white surface when focused and targets the main landmark. Forced-colors mode uses `LinkText` for unvisited links, `VisitedText` for visited links, and `Highlight` for hover/active/current links and focus outlines; no masthead geometry exists. No border or underline is added. Reduced motion removes link-color and article-target transitions.

### Cover, article header, and recent stories

The cover variant combines paper-colored copy, a paper-colored linked light-weight headline, summary, metadata, and optional square art on the charcoal field. Caption and metadata stay light. Without the modifier, the article header stays on the document ground with a larger headline and optional 3:2 figure. Recent stories use square thumbnails and stronger compact titles directly on the page ground. The category and date follow on separate muted lines, then a short muted excerpt; the excerpt is the story's existing summary, never clamped or truncated. No field, rule, radius or shadow encloses the card, and title hover changes color only. Optional decorative thumbnail links in recent stories are removed from keyboard order and the accessibility tree; the titled link remains available. Keep captions, metadata and excerpts attached to their story.

### Sidebar modules and reading lists

Modules are open and separated only by vertical spacing. The first has no top padding. On the index, **about the author** follows the edition note as a plain heading and paragraph stating only that Dino Latoga created Una Moderno and writes this specimen, in the spirit of the original Una theme's functional sidebar; it has no portrait, card, divider or link. The historical blue-module class now names an open publication note with a cocoa heading, not a blue heading or filled panel; it has no left/right padding. Reading lists use weight-600 blue links with optional muted descriptions below. Hover/active changes list links to rose without changing weight; focus retains the visible outline.

### Article contents and destination highlight

Desktop contents is a list of native fragment links. At the stacking breakpoint, a `details`/`summary` control presents the destinations inline with vertical spacing. Following a link uses native scrolling and history. Link color transitions at the shared 160ms duration and easing; weight changes directly without a weight animation. The article target receives destination blue and a background-color transition at the shared duration/easing; its heading has a 2rem scroll margin. Reduced motion removes that transition. No sticky or scripted scrolling control is implemented.

### Prose and quotations

Article paragraphs and lists retain regular Inter with generous leading; section headings are light and lowercase. Inline prose anchors use italic weight 600, including hover/active, while adjacent strong text remains upright at weight 600. Link color provides the hover change without changing weight or adding decoration. Browser synthesis supplies the italic from the single upright Inter asset. Quotations use a square cream field, 1.5rem padding, and the larger regular quote role. Inline code uses the same family and wraps long strings. The sidecar previews ten implemented patterns using scoped markup and CSS; buttons, inputs, tags, dialogs, and application cards are absent from the component vocabulary.

### Pending prototype: full cover, hue wash and moving far plane

Illustrated pages run this trial, which the owner authorized committing on 2026-11-02. [The trial record](docs/parallax-prototype.md) stays its authority until the cover and artwork descriptions above are rewritten to match. In the trial, the cover illustration fills the whole field and one uniform forest wash, `--una-color-wash` (`rgb(28 52 40 / 68%)`), grades it edge to edge beneath the copy, with no gradient or local text panel. Paper text keeps AA contrast even over pure-white art; the headline hover uses `--una-color-accent-light` (`#f4c6cc`) and focus uses destination blue, because canonical rose and art blue lack contrast on the wash. Every illustrated page whose body holds a direct `.una-shell` gets the overlap by default, and `data-una-art-effect="static"` opts out: the fixed panorama recedes at 0.4× the scroll through a CSS scroll timeline until the 39vw offset, while the paper shell rises at full speed; without scroll timelines it stays anchored, and reduced motion returns it to page coordinates.

## Do's and Don'ts

### Do:

- Do author tokens in the canonical CSS, build the inventories, and then refresh this derived record.
- Do preserve the exact 1.618:1 editorial columns, one fluid column gutter, and a separate row gap for the source-order responsive stack.
- Do keep display and navigation light, regular prose readable, and prose links distinct through italic weight 600.
- Do keep every link's weight and geometry stable on hover, changing color only; distinguish current navigation with its established weight 600.
- Do preserve optional images, wrapping titles, and the established article reading measure.
- Do preserve approved panorama masters exactly; use the reproducible WebP derivatives, natural aspect ratio, and quiet-area content offset.
- Do use descriptive links, semantic headings, native navigation, the skip link, and the existing visible focus treatment.
- Do retain the Inter OFL license and exact asset provenance when distributing the optional font.
- Do keep specimen stories, and every author other than creator Dino Latoga, clearly identified as fictional; the author note states only that Dino created Una Moderno and writes this specimen.

### Don't:

- Don't introduce an independent palette, font ramp, or layout in Tailwind or an adapter.
- Don't turn the light collection view into a media-player clone, generic tile dashboard, or promotional card gallery.
- Don't distribute the reference screenshots, Microsoft marks, proprietary fonts, or borrowed media artwork.
- Don't replace an approved panorama with a crop, recoloring, vector reinterpretation, or regenerated scene.
- Don't add divider lines, link underlines, fake strokes, rounded containers, drop shadows, or invented interface primitives to this vocabulary.
- Don't require JavaScript, a framework, Node, or the optional font for a reader to use the core layout.
- Don't assume inherited aliases recompute after a descendant-only primitive override; redeclare dependent aliases in the same scope.
- Don't treat this record, its preview ramps, or source contrast calculations as a compatibility or accessibility certification.
