---
name: Una Moderno
description: A portable editorial layout system for the independent web.
colors:
  'ink': '#47281a'
  'muted': '#715347'
  'paper': '#fffefa'
  'white': '#fff'
  'blue': '#87a9d3'
  'blue-light': '#e8eff8'
  'link': '#294d79'
  'rust': '#a1440d'
  'rule': '#cbbeb5'
  'selection': '#f2cc89'
  'focus': '#294d79'
  'original-brown': '#876551'
  'original-rose': '#9b656b'
  'original-slate': '#727c9f'
  'original-orange': '#cd5f19'
  'original-cream': '#faf3e2'
typography:
  display:
    fontFamily: "'Bricolage Grotesque', 'Arial', sans-serif"
    fontSize: 'clamp(2.7rem, 6.8vw, 5.5rem)'
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: '-0.035em'
  headline:
    fontFamily: "'Bricolage Grotesque', 'Arial', sans-serif"
    fontSize: 'clamp(2.25rem, 4.2vw, 3.375rem)'
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: '-0.035em'
  section:
    fontFamily: "'Bricolage Grotesque', 'Arial', sans-serif"
    fontSize: '1.625rem'
    fontWeight: 700
    lineHeight: 1.15
  title:
    fontFamily: "'Bricolage Grotesque', 'Arial', sans-serif"
    fontSize: '1.25rem'
    fontWeight: 700
    lineHeight: 1.2
  module:
    fontFamily: "'Bricolage Grotesque', 'Arial', sans-serif"
    fontSize: '1.5rem'
    fontWeight: 700
    lineHeight: 1.15
  blue-module:
    fontFamily: "'Bricolage Grotesque', 'Arial', sans-serif"
    fontSize: 'clamp(1.75rem, 2.8vw, 2.625rem)'
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: '-0.025em'
  body:
    fontFamily: "'Arial', 'Helvetica Neue', sans-serif"
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.6
  prose:
    fontFamily: "'Charter', 'Bitstream Charter', 'Georgia', serif"
    fontSize: '1.1875rem'
    fontWeight: 400
    lineHeight: 1.75
  deck:
    fontFamily: "'Arial', 'Helvetica Neue', sans-serif"
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Arial', 'Helvetica Neue', sans-serif"
    fontSize: '0.8125rem'
    fontWeight: 400
    lineHeight: 1.6
  navigation:
    fontFamily: "'Arial', 'Helvetica Neue', sans-serif"
    fontSize: '0.9375rem'
    fontWeight: 700
    lineHeight: 1.6
  quote:
    fontFamily: "'Charter', 'Bitstream Charter', 'Georgia', serif"
    fontSize: '1.375rem'
    fontWeight: 400
    lineHeight: 1.5
rounded:
  'square': '0'
spacing:
  '1': '0.25rem'
  '2': '0.5rem'
  '3': '0.75rem'
  '4': '1rem'
  '5': '1.25rem'
  '6': '1.5rem'
  '8': '2rem'
  '10': '2.5rem'
  '12': '3rem'
  '16': '4rem'
components:
  masthead:
    textColor: '{colors.ink}'
    typography: '{typography.display}'
  navigation:
    textColor: '{colors.ink}'
    typography: '{typography.navigation}'
    padding: '0.75rem 0'
  feature:
    textColor: '{colors.ink}'
    typography: '{typography.headline}'
  recent-story:
    textColor: '{colors.ink}'
    typography: '{typography.title}'
  blue-module:
    backgroundColor: '{colors.blue}'
    textColor: '{colors.ink}'
    padding: '2rem'
    rounded: '{rounded.square}'
  link-list:
    textColor: '{colors.link}'
    typography: '{typography.body}'
  article-contents:
    textColor: '{colors.link}'
    padding: '0.75rem 0'
  quote:
    backgroundColor: '{colors.original-cream}'
    textColor: '{colors.ink}'
    typography: '{typography.quote}'
    padding: '1.5rem'
    rounded: '{rounded.square}'
---

# Design System: Una Moderno

## Overview

**Creative North Star: "Independent arts-journal contents spread"**

Una Moderno gives an independent publication a clear reading surface and a useful margin. Cocoa and rose display type, a nearly white ground, blue editorial fields, and square-edged imagery make it direct, lively, and grounded. Its density comes from stories and navigable lists, with rules separating functions rather than enclosing every item.

The custom sans establishes identity while familiar sans-serif supporting text and a serif article face keep reading comfortable. The implemented world is light, flat, and built from ordinary HTML links, headings, lists, and native disclosure. It carries no dark theme, floating card system, or scripted navigation.

**Key Characteristics:**

- Cocoa and rose masthead with a blue editorial margin.
- Unequal columns, a leading story, three recent stories, and useful supporting lists.
- Square corners, rectangular geometric art, and thin functional rules.
- A custom sans for identity and headings; quiet serif prose at a 70ch maximum.
- Native links, visible focus, and an article destination highlight without runtime JavaScript.

This is a derived record of the implemented system. [Canonical token CSS](packages/core/src/tokens.css) remains the authoring authority for all 51 custom properties; [semantic styles](packages/core/src/una.css) define their application. The frontmatter is the machine-readable snapshot for design consumers, not an independent token source. [Generated token JSON](packages/core/tokens.json) is the complete inventory. Update the CSS first, build, and reconcile this document and [.impeccable/design.json](.impeccable/design.json). The optional Tailwind layer aliases the same variables.

## Colors

Warm ink and a nearly white reading ground hold the page together; blue carries the margin, while rose and the historical illustration colors give the publication its character. Exact source values are recorded once in the frontmatter.

### Primary

- **Cocoa ink** (`ink`): masthead, headings, ordinary text, and strong navigation rules.
- **Reading blue** (`link`): ordinary links and native article-contents controls.
- **Focus blue** (`focus`): the focus outline; an intentionally separate semantic token with the same value as Reading blue.
- **Deep rust** (`rust`): ordinary link hover color, paired with a thicker underline.

### Secondary

- **Margin blue** (`blue`): the publication-note surface and editorial art.
- **Destination blue** (`blue-light`): the targeted article heading and pale fields in the art.
- **Masthead rose** (`original-rose`): the second part of the wordmark and geometric art.
- **Selection amber** (`selection`): selected text with cocoa ink.

### Tertiary

- **Historical slate** (`original-slate`) and **Historical orange** (`original-orange`): the geometric editorial illustrations. These retained palette tokens are not ordinary text colors.

### Neutral

- **Reading white** (`paper`): the main page ground, visually close to white rather than an antique cream sheet.
- **Clear white** (`white`): the revealed skip-link surface.
- **Muted cocoa** (`muted`): metadata, captions, helper descriptions, and footer copy.
- **Warm rule** (`rule`): secondary dividers.
- **Historical brown** (`original-brown`): scrollbar color, where the browser supports the declaration.
- **Quote cream** (`original-cream`): a restrained blockquote field and illustration detail.

**The Useful Color Rule.** Use the blue field to gather publication or reading context. Keep historical orange and slate in editorial art; ordinary text uses the established ink, muted, link, and hover colors.

The sidecar's eight-step color ramps are generated preview aids, not additional shipped colors or an approved extension palette. This system does not implement a dark mode.

## Typography

**Display Font:** Bricolage Grotesque, with Arial and generic sans-serif fallbacks. The optional local font stylesheet uses a variable weight range of 200–800 and `font-display: swap`; the bundled face retains its [SIL OFL license](packages/core/assets/OFL.txt) and [asset provenance](docs/assets.md).

**Body Font:** Arial, Helvetica Neue, sans-serif.

**Prose Font:** Charter, Bitstream Charter, Georgia, serif.

**Code Font:** ui-monospace, Cascadia Code, monospace; inline code is sized relative to prose (0.85em) and can wrap.

**Character:** The broad custom sans makes a compact, recognizable publication identity. Supporting copy stays familiar and unshowy; the serif appears where sustained reading benefits from a distinct rhythm. The ramp is role-based rather than a single mathematical scale.

### Hierarchy

- **Display:** the wordmark; the largest fluid role, heavy weight, tight tracking, and compact leading.
- **Headline:** feature and article titles; fluid, bold, balanced, and limited to 21ch. Long words can wrap.
- **Section:** the recent-stories heading. Ordinary sidebar headings use the smaller **Module** role; the blue module has its own fluid heading capped at 12ch above the stacking breakpoint.
- **Title:** recent-story headings, compact enough to remain useful beside thumbnails.
- **Body:** navigation-adjacent copy and sidebar text. **Navigation** is slightly smaller and bold; **Deck** is larger, with a 60ch maximum.
- **Prose:** the sustained-reading role, constrained to 70ch. Article subsection headings return to the display face (1.75rem, 1.15 line height).
- **Label:** sentence-case metadata, captions, utility copy, and small link descriptions. Dates use tabular numerals; there is no separate all-caps label system.
- **Quote:** a larger serif voice within the cream quotation surface.

The frontmatter records each role's exact size, weight, and leading. These values describe the current implementation; they do not create new CSS token names for literals used by the semantic stylesheet.

**The Two Reading Voices Rule.** Use the display sans for identity and headings, the body sans for navigation and summaries, and the prose serif for sustained reading. Do not turn the masthead face into the article body.

## Layout

The centered page shell caps at 75rem. Above the small-screen breakpoint it leaves 1.5rem on each side; at 30rem and below those margins become 1rem. The desktop editorial grid uses `minmax(0, 580fr)` and `minmax(0, 360fr)`, with one 1.25rem gap. These are proportional tracks, not fixed 580px and 360px widths. The sidebar begins at its track edge.

The journal presents one leading story, a three-column recent-story row, and supporting sidebar modules. The feature image uses a 3:2 frame; recent thumbnails use 4:3 frames. Both crop with `object-fit: cover`. The core accepts absent optional images; omitting them must leave complete linked stories.

At 56rem and below, the main grid becomes one column, the sidebar follows the main content with a 2.5rem top margin in addition to the grid gap, and the masthead description moves below the wordmark. The article's sidebar contents gives way to native inline disclosure. At 30rem and below, the three recent stories become individual rows with a 6rem thumbnail track and a flexible text track. A story without an image uses one text column. Navigation wraps throughout; no mobile menu is introduced.

The spacing scale is quarter-rem based, with deliberate larger steps for sections. Metadata and list details use the small steps; modules use the middle steps; article sections and the footer use the larger steps. Prose siblings are separated by 1.5rem, with subsection headings beginning after 3rem.

**The Honest Gutter Rule.** The desktop columns share one layout gap. Do not add sidebar padding that doubles the visible gutter; a colored module retains its own internal padding.

Print removes navigation, sidebar, skip link, and utility copy; it changes the reading surface to black on white and lets the main content fill the page width. These are stylesheet behaviors, not a print-layout certification.

## Elevation & Depth

There are no shadows, raised surfaces, or translucent layers in the core. Contrast between paper, the blue module, and the cream quotation gives sections their place. Thin rules establish navigation and section boundaries; ordinary story items remain on the page ground.

**The Flat Page Rule.** Separate functions with space, thin rules, and the blue field. Do not add drop shadows or lift story items into floating cards.

## Shapes

The corner token is square (zero radius), and the stylesheet introduces no rounded containers. Editorial frames are rectangular with square corners; the illustration inside them can use circles, paths, and geometric window shapes. Functional rules are thin (1px); interaction underlines thicken to distinguish hover and the current navigation item. The stronger focus outline is an interaction signal, not decorative elevation.

## Components

### Masthead

A compact publication identity, not a campaign banner. The home link uses the display role in cocoa, with the second word in rose; the short description sits beside it on desktop and below it when the layout stacks. It receives the shared focus outline. The separate utility line carries actual publication or specimen information in small muted text.

### Navigation and text links

Ordinary anchors carry the primary actions. Main navigation has cocoa text between top and bottom cocoa rules, wraps naturally, and underlines both hover and the current page. The current page is declared with `aria-current="page"`; forced-colors mode adds a system-color bottom border. General links use Reading blue, an offset underline, and Deep rust on hover. Feature and story titles retain cocoa and reveal an underline on hover.

Keyboard focus is an unambiguous outline (3px, offset 4px). The skip link is translated above the viewport until focused, then appears on a white surface and targets the main landmark. The sidecar records the exact focus, reduced-motion, and forced-color behaviors.

### Feature and recent stories

The feature combines a linked headline, deck, metadata, and an optional figure. Recent stories combine a linked heading, metadata, and optional thumbnail. Neither pattern has a card background, enclosing border, shadow, or decorative badge. Keep captions and metadata attached to the story they explain. Duplicate decorative thumbnail links in the specimen are removed from the accessibility tree and keyboard order; the titled link remains usable.

### Sidebar modules and reading lists

The blue module is a square, unbordered field with generous internal padding. Its heading is fluid; its body and links use cocoa. Ordinary modules use bottom rules and vertical spacing; the first ordinary module has no top padding. Reading lists use plain links with optional muted descriptions beneath them, with enough vertical space to distinguish each destination.

### Article contents and destination highlight

Desktop article contents is a sidebar list of native fragment links. At the stacking breakpoint, an inline `details`/`summary` control exposes the same destinations between horizontal rules. Following a link uses native scroll and browser history. The destination heading receives the pale blue field through `:target`, with a short background-color transition (160ms, the canonical easing curve). Reduced-motion preference removes that transition. The heading's scroll margin is 2rem. No sticky control or smooth-scroll script is implemented.

### Prose and quotations

The article stays one readable column. Its headings use the display face; paragraphs and lists use the prose face. Quotations are square cream fields with interior spacing and a larger serif voice. Lists use normal list semantics and indentation. Inline code uses the monospace family and wraps long strings.

The sidecar previews these eight existing patterns. Buttons, form inputs, tags, dialogs, and application cards are not part of the implemented component vocabulary.

## Do's and Don'ts

### Do:

- Do derive changes from the canonical CSS tokens, then refresh this record and the generated inventory.
- Do preserve the unequal desktop columns and the useful margin; stack in source order at the existing breakpoint.
- Do keep feature images optional, titles able to wrap, and article text within the established reading measure.
- Do use descriptive links, ordered headings, the skip link, and the existing visible focus treatment.
- Do keep supplied specimen stories and authors clearly identified as fictional.
- Do retain the optional display font license and asset provenance when distributing it.

### Don't:

- Don't introduce a second palette or layout in the Tailwind layer or an adapter.
- Don't substitute a generic card gallery or promotional hero for the editorial reading surface.
- Don't use historical orange or slate as ordinary small-text colors; their established role is illustration.
- Don't add rounded cards, drop shadows, decorative badges, or invented interface primitives to this documented system.
- Don't require JavaScript, a framework, Node, or the optional font for a reader to use the core layout.
- Don't treat this extracted design record, its preview ramps, or a successful render as an accessibility or compatibility certification.
