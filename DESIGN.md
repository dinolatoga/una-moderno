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
  accent: '#9b656b'
  original-brown: '#876551'
  original-rose: '#9b656b'
  original-slate: '#727c9f'
  original-orange: '#cd5f19'
  original-cream: '#faf3e2'
typography:
  display:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: min(clamp(3rem, 7vw, 5.5rem), 20vw)
    fontWeight: 200
    lineHeight: 1.05
    letterSpacing: -0.025em
  headline:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: clamp(2.25rem, 4.2vw, 3.375rem)
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: -0.025em
  cover-headline:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: clamp(2rem, 3vw, 2.75rem)
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: -0.025em
  section:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: clamp(2rem, 3vw, 2.5rem)
    fontWeight: 300
    lineHeight: 1.15
  prose-heading:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 2rem
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
  navigation:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: clamp(1.75rem, 3vw, 2.25rem)
    fontWeight: 300
    lineHeight: 1.35
    letterSpacing: -0.015em
  navigation-current:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: clamp(1.75rem, 3vw, 2.25rem)
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: -0.015em
  utility:
    fontFamily: "'Inter', 'Una Inter Fallback', system-ui, sans-serif"
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: 0.04em
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

Una Moderno makes an independent publication feel like a collection worth browsing: large light typography, confident square artwork, compact useful lists, and continuous open space without dividers. Cocoa text and a warm near-white ground surround a charcoal lead-story field. Rose marks navigation state; blue and cream belong to original editorial art and restrained reading cues.

The owner-pinned Zune 4.0 light Collection view supplies the typographic hierarchy, aligned lists, and open canvas. The historical Zune HD website reference supplies the dark lead field within a light document. These principles become an original editorial system, with Inter in every text role and a calm light article surface. The references are evidence, not distributable artwork or a media-player template; their relationship to the implementation is recorded in [the inspiration record](docs/zune-inspiration.md).

Hierarchy comes from weight, scale, leading, and space within one family. The system stays flat and native: ordinary links, a single horizontal navigation strip, semantic headings and lists, and article contents built with disclosure. The charcoal story treatment is a component variant, not a dark theme.

**Key Characteristics:**

- Light lowercase display and navigation typography, with regular-weight sustained reading.
- One charcoal lead-story field, square cover art, and open supporting lists on a continuous light ground.
- Unequal editorial columns with one 20px gutter, followed by a source-order stack on narrow screens.
- Inter across all text roles; prose remains bounded by a 70ch maximum.
- Native scrolling and visible focus, with brief link-color and article-target transitions that respect reduced motion.

This is a derived record of the implemented system. [Canonical token CSS](packages/core/src/tokens.css) remains the authoring authority for all 59 custom properties; [semantic styles](packages/core/src/una.css) define their application. The frontmatter is the machine-readable snapshot for design consumers, not a competing token source. [Generated token JSON](packages/core/tokens.json) is the complete inventory. Update source CSS first, build, and reconcile this document and [.impeccable/design.json](.impeccable/design.json). The optional Tailwind layer aliases the same variables. This record describes implementation, not review or test outcomes.

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

The sidecar's eight-step color ramps are synthetic preview aids, not shipped tokens or approved extra UI colors. This system has no theme switcher or alternate dark mode.

## Typography

**Typeface:** Inter for identity, headings, navigation, supporting text, prose, quotations, and inline code. The body token owns the stack; display, prose, and code tokens alias it at the root. The four public role tokens remain stable.

**Fallback:** Una Inter Fallback, system-ui, sans-serif. The named fallback uses locally installed Arial or Arial Bold; those system fonts are not redistributed. Its adjustments target Inter's optical-size-14 metrics: size-adjust 105.2731%, ascent-override 92.0226%, descent-override 22.9129%, and line-gap-override 0%. Local regular Arial covers requested weights 100–599; local bold covers 600–900. These approximate the fallback's weight and metrics, not every glyph width or optical size.

**Delivery:** The optional [font stylesheet](packages/core/assets/fonts.css) loads one unmodified upright variable WOFF2, with `font-display: swap` and `font-optical-sizing: auto` on the publication. The official release is Inter v4.1; the actual binary embeds `4.001;git-9221beed3`. The file is 352,240 bytes, with SHA-256 `693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3`. Its weight axis spans 100–900 and optical-size axis 14–32. The specimen uses 200, 300, 400, 500, 600, and 700; the last weight belongs to ordinary link hover/active states. Preserve its [SIL OFL license](packages/core/assets/OFL.txt), [asset record](docs/assets.md), and [machine-readable provenance](packages/core/assets/provenance.json). No external runtime font request is needed. Italic emphasis and inline prose links use browser synthesis from the upright face; no separate italic asset is loaded.

**Metrics:** Inter has 2048 units per em, ascent 1984, descent −494, line gap 0, and cap height 1490. X-height is 1118 at optical size 14 and 1056 at optical size 32. The previously measured local Arial/Arial Bold fallback has 2048 units per em and x-height 1062. A single fixed fallback cannot match all optical sizes, weights, or advances; font loading may change wrapping.

**Character:** Large light lettering gives the collection its voice; regular text carries reading. Compact story titles and current navigation gain weight to remain easy to scan. The ramp consists of actual roles rather than one mathematical ratio.

### Hierarchy

- **Display:** the lowercase wordmark, weight 200, using the 3rem–5.5rem fluid token capped at 20vw, with 1.05 leading and tight tracking. Each word stays intact in its own span, with a real space between them.
- **Headline:** lowercase article titles, weight 300, fluid between 2.25rem and 3.375rem, with 1.08 leading and a 21ch maximum. **Cover headline** uses 2rem–2.75rem in the narrower charcoal composition.
- **Section:** lowercase recent-story and sidebar headings, weight 300, fluid between 2rem and 2.5rem. **Prose heading** is 2rem with 1.15 leading.
- **Title:** compact recent-story headings, weight 600, 1.125rem with 1.35 leading; the phone row uses the 1.25rem **Title compact** role.
- **Navigation:** lowercase links, weight 300, fluid between 1.75rem and 2.25rem, with 1.35 leading and slightly tight tracking. Inactive links use muted cocoa and retain weight 300 on hover/active, changing only to rose. **Navigation current** stays rose at weight 600 in every interaction state.
- **Body:** 1rem regular supporting text. **Prose** is 1.1875rem with 1.75 leading and a 70ch maximum. **Deck** is 1.125rem with 1.55 leading and a 60ch maximum; **Cover deck** is 1rem.
- **Label:** metadata and captions, 0.8125rem at weight 500. Dates use tabular numerals. **Utility** and **Section label** are 0.75rem, weight 600, uppercase with separate observed tracking values; they carry actual publication and list information. The publication utility block is hidden entirely at 30rem and below; the section label remains.
- **Note:** 0.875rem muted supporting copy. **Strapline** uses the same size with tighter 1.5 leading. **List link** uses the body size at weight 600, increasing to 700 on hover/active.
- **Quote:** 1.375rem regular text with 1.5 leading inside the cream field. **Code** uses the same family at 0.85em with inherited prose leading, not a fixed-width face.

The frontmatter records the exact implemented roles, including stylesheet literals; it does not create new CSS token names. Headings use balanced wrapping, with `pretty` wrapping for the narrower cover headline. Long words may wrap. Body paragraphs retain normal wrapping. Strong text and ordinary links use weight 600; ordinary link hover/active uses weight 700 outside the stable brand, display-title, navigation, and prose-link roles. **Prose link** stays italic at weight 600 while its color changes, distinguishing it from both regular body text and upright strong text. Link roles retain their surrounding size.

**The One Family Rule.** Use Inter across every text role. Keep display typography light and lowercase, compact titles stronger, and sustained prose regular; establish hierarchy with the existing role scale and spacing.

For coordinated theme changes, override primitives at `:root` after core CSS. Custom-property aliases resolve where declared: changing only `--una-font-body` on a descendant does not recompute the root's display/prose/code aliases. Scoped themes must redeclare the dependent aliases there; the same rule applies to the accent/rose alias. Tailwind's inline mapping does not create an independent token source. See [the markup and theming contract](docs/architecture.md).

## Layout

The centered shell caps at 75rem. It leaves 1.5rem side margins above 30rem and 1rem at or below that breakpoint. The desktop grid uses `minmax(0, 580fr)` and `minmax(0, 360fr)` with one 1.25rem gap. These are proportional tracks rather than fixed pixel widths; the sidebar starts at its track edge.

The index combines one cover story, three recent covers, and useful lists. A cover with a figure uses two equal internal tracks and a 1.5rem gap inside 1.5rem padding. Copy comes before the figure in source order; wider layouts place the figure left and the copy right. At 42rem and below, copy and figure stack in source order. Cover and recent-story art are square; an ordinary article-header image retains its 3:2 frame. Images use cover cropping. Omitting optional images preserves complete linked stories and a one-column feature.

At 56rem and below, the editorial grid becomes one column, the sidebar follows with a 2.5rem top margin in addition to the grid gap, and the masthead description moves below the wordmark. Article contents moves from its sidebar list to native inline disclosure. At 30rem and below, the publication utility block is removed from layout without reserving space, while recent stories become rows with `min(6rem, 33.3333%)` for the image track and a flexible text track; this reserves text space when font size increases. A story without an image uses one text column.

Main navigation remains one horizontal row at every width. Only its strip scrolls when links exceed the space. The gap is 1.5rem, reduced to 0.5rem at 22rem and below; actual fit and the next-label peek depend on text lengths and font metrics.

Spacing follows the quarter-rem scale, with larger steps for sections. Prose siblings are separated by 1.5rem; subsection headings begin after 3rem. Story and sidebar text use open space rather than dividers or enclosing panels.

**The Honest Gutter Rule.** The desktop columns share one layout gap. Do not add sidebar padding that doubles the visible gutter; the dark feature has its own internal padding.

Print hides navigation, sidebar, skip link, and utility copy; it changes the document to black on white and full-width main content. The cover loses its dark background and padding, and its metadata and caption inherit the print text color. All links, including visited, hover, and active states, inherit the surrounding print text color so screen link colors do not carry onto white paper. These are stylesheet behaviors, not print certification.

## Elevation & Depth

The core has no shadows, raised cards, blur, or translucent content layers. The charcoal lead-story field, cream quotation, and pale destination highlight separate roles through tone. Supporting stories and lists remain on the continuous document surface. The masthead has no decorative background or pseudo-element.

**The Flat Page Rule.** Separate functions with continuous space, typography, and the charcoal cover field. Keep supporting stories and lists on the page ground without decorative rules, drop shadows, or floating cards.

## Shapes

No corner-radius, border-width, or divider-color token remains. Containers have square default geometry; cover and recent artwork use square frames while article-header art remains rectangular. The original illustrations may contain circles, paths, and window geometry. Decorative borders, dividers, and link underlines are absent. The focus outline signals interaction rather than elevation. The masthead is a plain open field; illustration geometry remains inside editorial artwork.

## Components

### Masthead

A large light lowercase home link in cocoa sits opposite a short description on desktop and above it when stacked. The two wordmark spans are separated by a real space and each uses `white-space: nowrap`, allowing a break between words while keeping each word intact. Its rendered size is `min(var(--una-text-brand), 20vw)`, capping the fluid logo under enlarged-text conditions. Both words inherit cocoa; hover/active changes only the color to rose while retaining weight 200. The masthead has no decorative geometry. Utility copy carries publication/specimen information separately on wider screens and is hidden with `display: none` at 30rem and below.

### Navigation and text links

One labeled navigation landmark contains a single set of direct anchor children. The links never wrap or shrink. The strip has no bounding rules. Inactive links use muted cocoa at weight 300 and change only to rose on hover/active. The current page has `aria-current="page"`, rose color, and weight 600, which remains stable on hover/active. General links are reading blue at weight 600 and become rose at weight 700 on hover/active. All link states remain undecorated. Linked display titles retain weight 300 while changing color from reading blue to rose; inside the cover they start in paper and change to rose. Inline prose links retain italic weight 600 while changing from reading blue to rose. Recent-story title links use reading blue at weight 600 and rose at weight 700.

The strip has 0.5rem padding; links have a 44px minimum height and 0.25rem by 0.5rem padding. Inline scroll padding of 50% establishes a centered optimal viewing region for native focus scrolling, with 0.5rem link scroll margins. This guides the browser to reveal partly visible focused links. Scrollbar chrome is hidden with `scrollbar-width: none` and the WebKit scrollbar selector. A partial next label indicates continuation. Horizontal overscroll is contained; vertical gestures and momentum remain browser-managed. No snapping, timers, custom scroll animation, or runtime JavaScript is part of this behavior.

Keyboard focus uses a 3px outline offset by 4px. The normal focus color is reading blue; inside the charcoal cover it changes to art blue. The skip link appears on a white surface when focused and targets the main landmark. Forced-colors mode uses `LinkText` for unvisited links, `VisitedText` for visited links, and `Highlight` for hover/active/current links and focus outlines; no masthead geometry exists. No border or underline is added. Reduced motion removes link-color and article-target transitions.

### Cover, article header, and recent stories

The cover variant combines paper-colored copy, a paper-colored linked light-weight headline, summary, metadata, and optional square art on the charcoal field. Caption and metadata stay light. Without the modifier, the article header stays on the document ground with a larger headline and optional 3:2 figure. Recent stories use square thumbnails and stronger compact titles directly on the page ground. Optional decorative thumbnail links in recent stories are removed from keyboard order and the accessibility tree; the titled link remains available. Keep captions and metadata attached to their story.

### Sidebar modules and reading lists

Modules are open and separated only by vertical spacing. The first has no top padding. The historical blue-module class now names an open publication note with a cocoa heading, not a blue heading or filled panel; it has no left/right padding. Reading lists use weight-600 blue links with optional muted descriptions below. Hover/active changes list links to rose and weight 700; focus retains the visible outline.

### Article contents and destination highlight

Desktop contents is a list of native fragment links. At the stacking breakpoint, a `details`/`summary` control presents the destinations inline with vertical spacing. Following a link uses native scrolling and history. Link color transitions at the shared 160ms duration and easing; weight changes directly without a weight animation. The article target receives destination blue and a background-color transition at the shared duration/easing; its heading has a 2rem scroll margin. Reduced motion removes that transition. No sticky or scripted scrolling control is implemented.

### Prose and quotations

Article paragraphs and lists retain regular Inter with generous leading; section headings are light and lowercase. Inline prose anchors use italic weight 600, including hover/active, while adjacent strong text remains upright at weight 600. Link color provides the hover change without changing weight or adding decoration. Browser synthesis supplies the italic from the single upright Inter asset. Quotations use a square cream field, 1.5rem padding, and the larger regular quote role. Inline code uses the same family and wraps long strings. The sidecar previews ten implemented patterns using scoped markup and CSS; buttons, inputs, tags, dialogs, and application cards are absent from the component vocabulary.

## Do's and Don'ts

### Do:

- Do author tokens in the canonical CSS, build the inventories, and then refresh this derived record.
- Do preserve the unequal editorial columns, one layout gutter, and source-order responsive stack.
- Do keep display and navigation light, regular prose readable, and prose links distinct through italic weight 600.
- Do keep wordmark, display-title, navigation, and prose-link weights stable on hover; distinguish current navigation with its established weight 600.
- Do preserve optional images, wrapping titles, and the established article reading measure.
- Do use descriptive links, semantic headings, native navigation, the skip link, and the existing visible focus treatment.
- Do retain the Inter OFL license and exact asset provenance when distributing the optional font.
- Do keep specimen stories and authors clearly identified as fictional.

### Don't:

- Don't introduce an independent palette, font ramp, or layout in Tailwind or an adapter.
- Don't turn the light collection view into a media-player clone, generic tile dashboard, or promotional card gallery.
- Don't distribute the reference screenshots, Microsoft marks, proprietary fonts, or borrowed media artwork.
- Don't add divider lines, link underlines, fake strokes, rounded containers, drop shadows, or invented interface primitives to this vocabulary.
- Don't require JavaScript, a framework, Node, or the optional font for a reader to use the core layout.
- Don't assume inherited aliases recompute after a descendant-only primitive override; redeclare dependent aliases in the same scope.
- Don't treat this record, its preview ramps, or source contrast calculations as a compatibility or accessibility certification.
