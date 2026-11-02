# Changelog

Changes that affect consumers, contributors, or the public markup/token contract are recorded here. Package metadata describes the development version; it does not mean a package or release has been published.

## 0.1.0 — Unreleased

### Added

- Framework-neutral core with `--una-*` tokens, semantic `una-*` classes, readable and minified distributable CSS, and HTML templates.
- Plain HTML editorial index and article specimens with fictional content, local art, responsive columns, and optional local typography.
- Optional Tailwind CSS v4 token mapping and a compilation example.
- Astro reference using a normalized content contract and public fictional fixtures.
- Historical provenance, architecture and product documentation, asset licensing records, contributor policies, and repository verification tooling.

- Five owner-approved panoramic backgrounds, preserved as exact PNG masters and delivered as reproducibly encoded full-size and 832px WebP derivatives. An allowlisted `data-una-art` selector and unillustrated `/artworks.html` chooser support deterministic selection without client JavaScript. The selected artwork retains its natural proportions, with a 39vw header offset and a bottom-only blend into paper. CSS selects 832px derivatives at 52rem and below; print and forced colors remove both artwork and offset.
- Eight canonical tokens for cover/subsection sizes, the 5rem spacing step, a separate stacked gap, full/small artwork URLs, the master aspect ratio and the content offset; the generated inventory now contains 67 tokens.
- An open `about the author` sidebar module after the edition note on the static, Tailwind and Astro indexes, with a neutral placeholder in the core index template. It reuses `una-module` markup and states only that Dino Latoga created Una Moderno and writes this specimen.
- `una-excerpt`, a shared class for a short story excerpt after its metadata: regular muted text with natural height, never clamped. Recent stories on the static, Tailwind and Astro indexes reuse each fixture `summary` as the excerpt, and the core index template adds three image-free recent-story placeholders showing the pattern.
- Prototype pending owner approval: `--una-color-wash` and `--una-color-accent-light`, with matching optional Tailwind aliases, grade the opt-in full-cover illustration with one uniform forest wash and keep its headline hover legible. Every illustrated page whose body holds a direct `.una-shell` gets this overlap by default, with `data-una-art-effect="static"` as the opt-out. Its fixed panorama recedes at 0.4× the scroll through a feature- and motion-preference-gated CSS scroll timeline, under a full-width paper shell fade. The generated inventory now contains 69 tokens.

### Changed

- Replace the historical 580:360 tracks and 20px gutter with an exact 1.618:1 grid and `clamp(3rem, 4.1667vw, 5rem)` column gap. Use a separate 2.5rem row gap when stacked, without an additional sidebar margin.
- Reduce display, navigation, section, article-title, cover-title and prose-subheading sizes to 80% of the preceding scale. Preserve body, prose, metadata, decks, quotations and compact story-title sizes. Phone navigation uses 16px gaps at 30rem and below, with no narrower gap override.
- Preserve stylesheet-relative artwork delivery in the core and Tailwind build, and disable Astro/Vite asset inlining so CSS does not embed every background choice.
- Recent stories read title, category, date, then excerpt. Inside `una-story`, `una-meta` stacks the category above the date as one tight pair. At 30rem and below, the title, metadata and excerpt form one content-height stack with 8px gaps beside the thumbnail; surplus thumbnail height falls below the last text row instead of stretching the title row. Astro's compact metadata now renders the category before the date, matching the static markup.
- Specimen disclosures now say the stories are fictional and every byline except Dino Latoga’s is invented.
- At every width the navigation strip shifts left so the first label's ink aligns with the wordmark's ink within a pixel; hit and focus areas extend left inside the strip padding. On phones, where scroll timelines exist, a paper fade at the strip's right edge appears only while destinations remain and clears at the end of travel. Forced colors remove it.
- Remove the utility row ("An independent web journal" and its edition line) from every page, template and integration, together with its styles; the masthead now opens the shell with no reserved row. The utility type token remains for the section label.
- Titles drop the 21ch measure and balanced or pretty wrapping: they use the full content width and wrap only where a line runs out.
- Hover and active change link color only on every link role; no state changes weight or geometry. `--una-weight-hover` remains a compatibility token that core no longer applies.

- Use one self-hosted Inter variable font from the official 4.1 release for every text role; preserve its OFL notice, checksums, and measured local/system fallbacks. Weight roles assign 200 to the wordmark, 300 to display/navigation, 400 to body text, 500 to metadata and 600 to current navigation, compact headings and inline prose links. Inline prose links are italic and retain weight 600 on hover, distinguishing them from upright strong text. Link hover never changes weight.
- Add `--una-color-stage`, `--una-color-accent`, navigation/section/utility type tokens, and matching optional Tailwind aliases. The owner's Zune desktop and website references inform lighter typography and open editorial columns; no proprietary reference assets are shipped.
- Add `una-feature--cover` and `una-feature-copy` for a dark lead-story field with optional art. Long-form articles retain a light reading surface.
- Keep `una-module--blue` as a compatible class name, now styling an unboxed module with an ink-colored noninteractive heading instead of a blue panel.
- Give the dark cover's headline a paper rest color and rose hover color without changing weight 300. Primary-title and inactive-navigation hover changes color only; inactive navigation is muted/300 and the current page remains rose/600.
- Remove masthead stripes. Render the wordmark as two nowrap word spans separated by a literal space, with a `16vw` cap on its fluid size. Prose continues to enlarge independently of the wordmark cap.
- Document the optional Inter font payload: 352,240 bytes versus the previous 69,576-byte asset, approximately 5.06 times as large. The official variable file remains unsubsetted.
- Remove decorative dividers from navigation, sections, modules, article contents and the footer. Link states use color and weight without text decoration or simulated underlines; keyboard focus retains its 3px outline. Forced colors use system link, visited-link and focus colors.
- Remove unused `--una-color-rule`, `--una-border-width` and `--una-border-radius` tokens and their optional Tailwind aliases. Add `--una-weight-hover` and `font-una-weight-hover` for the canonical 700 hover weight.
- Main navigation uses one lowercase set of direct links at every width: journal, stories, long read, about. The non-wrapping horizontal strip scrolls natively when needed, with visible continuation on phones, hidden scrollbar chrome, 44px targets, contained horizontal overscroll, unrestricted vertical page gestures, and room for the standard focus outline. Core templates, static HTML, Tailwind, and Astro share this smaller markup contract; no runtime JavaScript is added.

### Boundaries

- The v0.1 API is early and may change; breaking class/token changes must be recorded here.
- EmDash mapping is experimental. A fixture-based Astro build does not establish live CMS support.
- WordPress integration remains a v0.2 target.
- No npm package, GitHub release, hosted demo, or production deployment is established by this entry.
