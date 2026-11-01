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
    fontFamily: "'Geist', 'Una Geist Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: 'clamp(2.7rem, 6.8vw, 5.5rem)'
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: '-0.035em'
  headline:
    fontFamily: "'Geist', 'Una Geist Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: 'clamp(2.25rem, 4.2vw, 3.375rem)'
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: '-0.035em'
  section:
    fontFamily: "'Geist', 'Una Geist Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: '1.625rem'
    fontWeight: 700
    lineHeight: 1.15
  title:
    fontFamily: "'Geist', 'Una Geist Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: '1.25rem'
    fontWeight: 700
    lineHeight: 1.2
  module:
    fontFamily: "'Geist', 'Una Geist Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: '1.5rem'
    fontWeight: 700
    lineHeight: 1.15
  blue-module:
    fontFamily: "'Geist', 'Una Geist Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: 'clamp(1.75rem, 2.8vw, 2.625rem)'
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: '-0.025em'
  body:
    fontFamily: "'Geist', 'Una Geist Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.6
  prose:
    fontFamily: "'Geist', 'Una Geist Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: '1.1875rem'
    fontWeight: 400
    lineHeight: 1.75
  deck:
    fontFamily: "'Geist', 'Una Geist Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Geist', 'Una Geist Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: '0.8125rem'
    fontWeight: 400
    lineHeight: 1.6
  note:
    fontFamily: "'Geist', 'Una Geist Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.6
  navigation:
    fontFamily: "'Geist', 'Una Geist Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: '0.9375rem'
    fontWeight: 700
    lineHeight: 1.6
  quote:
    fontFamily: "'Geist', 'Una Geist Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
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
    padding: '0.5rem'
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

Geist Sans carries every text role, from the heavy publication identity to calm article paragraphs. Weight, size, leading, tracking, and spacing establish the hierarchy within one family. The implemented world is light, flat, and built from ordinary HTML links, headings, lists, a horizontal navigation strip, and native disclosure for article contents. It carries no dark theme, floating card system, or scripted navigation.

**Key Characteristics:**

- Cocoa and rose masthead with a blue editorial margin.
- Unequal columns, a leading story, three recent stories, and useful supporting lists.
- Square corners, rectangular geometric art, and thin functional rules.
- One Geist Sans family across all text roles, with article prose at a 70ch maximum.
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

**Typeface:** Geist Sans for identity, headings, navigation, supporting text, article prose, quotations, and inline code. The body font token owns the family stack; the display, prose, and code tokens alias it. The four public role tokens remain stable while resolving to one family.

**Fallback:** Una Geist Fallback, system-ui, -apple-system, Segoe UI, sans-serif. The named fallback uses locally installed Arial or Arial Bold with measured x-height and vertical-metric adjustments; no fallback font is downloaded or redistributed. It aligns those metrics without promising identical glyph widths or eliminating every layout shift. The system-sans stack remains available when the local fallback is absent.

**Delivery:** The optional local font stylesheet loads one normal variable Geist asset with `font-display: swap`. The embedded font version is 1.900, sourced from the official `geist@1.9.0` npm distribution; its available weight axis is 100–900, and this specimen uses 400, 700, and 800. The font retains its [SIL OFL license](packages/core/assets/OFL.txt), [distribution notice](packages/core/assets/Geist-LICENSE.txt), and [verified asset provenance](docs/assets.md). No external runtime font request is required. Italic emphasis uses browser synthesis from the upright face.

**Character:** A single contemporary sans gives the publication a consistent voice. The heavy, tightly tracked wordmark and bold headings establish identity; regular-weight supporting text and generously led prose keep reading calm. The ramp is role-based rather than a single mathematical scale.

### Hierarchy

- **Display:** the wordmark; the largest fluid role, heavy weight, tight tracking, and compact leading.
- **Headline:** feature and article titles; fluid, bold, balanced, and limited to 21ch. Long words can wrap.
- **Section:** the recent-stories heading. Ordinary sidebar headings use the smaller **Module** role; the blue module has its own fluid heading capped at 12ch above the stacking breakpoint.
- **Title:** recent-story headings, compact enough to remain useful beside thumbnails.
- **Body:** navigation-adjacent copy and sidebar text. **Navigation** is slightly smaller and bold; **Deck** is larger, with a 60ch maximum.
- **Prose:** the sustained-reading role, constrained to 70ch. Article subsection headings use the bold heading role (1.75rem, 1.15 line height).
- **Label:** sentence-case metadata, captions, utility copy, and small link descriptions. Dates use tabular numerals; there is no separate all-caps label system.
- **Note:** muted supporting notes and specimen disclosures, slightly larger than metadata and quieter than body copy.
- **Quote:** a larger regular-weight Geist role within the cream quotation surface.

The frontmatter records each role's exact size, weight, and leading. These values describe the current implementation; they do not create new CSS token names for literals used by the semantic stylesheet.

**The One Family Rule.** Use Geist Sans across every text role. Establish hierarchy through weight, size, line height, tracking, and spacing, while preserving the distinct reading measure and rhythm of article prose.

## Layout

The centered page shell caps at 75rem. Above the small-screen breakpoint it leaves 1.5rem on each side; at 30rem and below those margins become 1rem. The desktop editorial grid uses `minmax(0, 580fr)` and `minmax(0, 360fr)`, with one 1.25rem gap. These are proportional tracks, not fixed 580px and 360px widths. The sidebar begins at its track edge.

The journal presents one leading story, a three-column recent-story row, and supporting sidebar modules. The feature image uses a 3:2 frame; recent thumbnails use 4:3 frames. Both crop with `object-fit: cover`. The core accepts absent optional images; omitting them must leave complete linked stories.

At 56rem and below, the main grid becomes one column, the sidebar follows the main content with a 2.5rem top margin in addition to the grid gap, and the masthead description moves below the wordmark. The article's sidebar contents gives way to native inline disclosure. At 30rem and below, the three recent stories become individual rows with a thumbnail track capped at the smaller of 6rem and 33.3333% of the story width, plus a flexible text track. The cap reserves room for titles and metadata when text size increases. A story without an image uses one text column. Main navigation stays in one horizontal row at every width, with scrolling confined to its own strip when the links exceed the available space. At 22rem and below, its gap decreases from 1.5rem to 0.5rem to keep part of the next destination visible on the narrowest phones; label lengths still determine the actual fit.

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

A compact publication identity, not a campaign banner. The home link uses the display role in cocoa, with the second word in rose; the short description sits beside it on desktop and below it when the layout stacks. The wordmark can shrink within its layout and wrap anywhere when narrow space or enlarged text requires it. It receives the shared focus outline. The separate utility line carries actual publication or specimen information in small muted text.

### Navigation and text links

Ordinary anchors carry the primary actions. One labeled navigation landmark contains a single set of direct link children. The row stays horizontal at every width, with cocoa text between top and bottom cocoa rules. Links keep their labels on one line and do not shrink; only the navigation strip scrolls when they overflow. The current page is declared with `aria-current="page"`; hover and the current page receive an underline, and forced-colors mode adds a system-color bottom border. General links use Reading blue, an offset underline, and Deep rust on hover. Feature and story titles retain cocoa and reveal an underline on hover.

The strip has 0.5rem of padding on every side. Each link has a 44px minimum height and 0.25rem by 0.5rem padding; the normal gap is 1.5rem, reducing to 0.5rem at 22rem and below. The strip's inner padding reserves space for the shared focus outline. The strip uses 50% inline scroll padding to define a centered optimal viewing region for native focus scrolling; each link retains a 0.5rem inline scroll margin. Browser focus scrolling uses that region to reveal the focused destination, including links that were already partly visible. Scrollbar chrome is hidden with the standard `scrollbar-width` declaration and the WebKit scrollbar selector; the partial next label provides the overflow cue. Horizontal overscroll is contained within the strip, while vertical page gestures and momentum remain browser-managed. There is no custom scroll animation or runtime JavaScript.

Keyboard focus is an unambiguous outline (3px, offset 4px). The skip link is translated above the viewport until focused, then appears on a white surface and targets the main landmark. The sidecar records the exact focus, reduced-motion, and forced-color behaviors.

### Feature and recent stories

The feature combines a linked headline, deck, metadata, and an optional figure. Recent stories combine a linked heading, metadata, and optional thumbnail. Neither pattern has a card background, enclosing border, shadow, or decorative badge. Keep captions and metadata attached to the story they explain. Duplicate decorative thumbnail links in the specimen are removed from the accessibility tree and keyboard order; the titled link remains usable.

### Sidebar modules and reading lists

The blue module is a square, unbordered field with generous internal padding. Its heading is fluid; its body and links use cocoa. Ordinary modules use bottom rules and vertical spacing; the first ordinary module has no top padding. Reading lists use plain links with optional muted descriptions beneath them, with enough vertical space to distinguish each destination.

### Article contents and destination highlight

Desktop article contents is a sidebar list of native fragment links. At the stacking breakpoint, an inline `details`/`summary` control exposes the same destinations between horizontal rules. Following a link uses native scroll and browser history. The destination heading receives the pale blue field through `:target`, with a short background-color transition (160ms, the canonical easing curve). Reduced-motion preference removes that transition. The heading's scroll margin is 2rem. No sticky control or smooth-scroll script is implemented.

### Prose and quotations

The article stays one readable column. Headings use bold Geist; paragraphs and lists use regular Geist with the prose role's larger size and generous leading. Quotations are square cream fields with interior spacing and a larger regular-weight Geist role. Lists use normal list semantics and indentation. Inline code uses the same family at 0.85em and wraps long strings; it has no fixed-width typeface contract.

The sidecar previews these eight existing patterns. Buttons, form inputs, tags, dialogs, and application cards are not part of the implemented component vocabulary.

## Do's and Don'ts

### Do:

- Do derive changes from the canonical CSS tokens, then refresh this record and the generated inventory.
- Do preserve the unequal desktop columns and the useful margin; stack in source order at the existing breakpoint.
- Do keep feature images optional, titles able to wrap, and article text within the established reading measure.
- Do use descriptive links, ordered headings, the skip link, and the existing visible focus treatment.
- Do keep supplied specimen stories and authors clearly identified as fictional.
- Do retain the optional Geist font license, distribution notice, and asset provenance when distributing it.

### Don't:

- Don't introduce a second palette or layout in the Tailwind layer or an adapter.
- Don't substitute a generic card gallery or promotional hero for the editorial reading surface.
- Don't use historical orange or slate as ordinary small-text colors; their established role is illustration.
- Don't add rounded cards, drop shadows, decorative badges, or invented interface primitives to this documented system.
- Don't require JavaScript, a framework, Node, or the optional font for a reader to use the core layout.
- Don't treat this extracted design record, its preview ramps, or a successful render as an accessibility or compatibility certification.
