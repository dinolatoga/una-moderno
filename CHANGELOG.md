# Changelog

Changes that affect consumers, contributors, or the public markup/token contract are recorded here. Package metadata describes the development version; it does not mean a package or release has been published.

## 0.1.0 — Unreleased

### Added

- Framework-neutral core with `--una-*` tokens, semantic `una-*` classes, readable and minified distributable CSS, and HTML templates.
- Plain HTML editorial index and article specimens with fictional content, local art, responsive columns, and optional local typography.
- Optional Tailwind CSS v4 token mapping and a compilation example.
- Astro reference using a normalized content contract and public fictional fixtures.
- Historical provenance, architecture and product documentation, asset licensing records, contributor policies, and repository verification tooling.

### Changed

- Use one self-hosted Inter variable font from the official 4.1 release for every text role; preserve its OFL notice, checksums, and measured local/system fallbacks. Weight roles assign 200 to the wordmark, 300 to display/navigation, 400 to body text, 500 to metadata and 600 to current navigation, compact headings and inline prose links. Inline prose links are italic and retain weight 600 on hover, distinguishing them from upright strong text. Weight 700 remains available for compact story/resource-link hover states.
- Add `--una-color-stage`, `--una-color-accent`, navigation/section/utility type tokens, and matching optional Tailwind aliases. The owner's Zune desktop and website references inform lighter typography and open editorial columns; no proprietary reference assets are shipped.
- Add `una-feature--cover` and `una-feature-copy` for a dark lead-story field with optional art. Long-form articles retain a light reading surface.
- Keep `una-module--blue` as a compatible class name, now styling an unboxed module with an ink-colored noninteractive heading instead of a blue panel.
- Give the dark cover's headline a paper rest color and rose hover color without changing weight 300. Primary-title and inactive-navigation hover changes color only; inactive navigation is muted/300 and the current page remains rose/600.
- Remove masthead stripes. Render the wordmark as two nowrap word spans separated by a literal space, with a `20vw` cap on its fluid size. Hide the utility line with no reserved space at 30rem and below; prose continues to enlarge independently of the wordmark cap.
- Document the optional Inter font payload: 352,240 bytes versus the previous 69,576-byte asset, approximately 5.06 times as large. The official variable file remains unsubsetted.
- Remove decorative dividers from navigation, sections, modules, article contents and the footer. Link states use color and weight without text decoration or simulated underlines; keyboard focus retains its 3px outline. Forced colors use system link, visited-link and focus colors.
- Remove unused `--una-color-rule`, `--una-border-width` and `--una-border-radius` tokens and their optional Tailwind aliases. Add `--una-weight-hover` and `font-una-weight-hover` for the canonical 700 hover weight.
- Main navigation uses one lowercase set of direct links at every width: journal, stories, long read, about. The non-wrapping horizontal strip scrolls natively when needed, with visible continuation on phones, hidden scrollbar chrome, 44px targets, contained horizontal overscroll, unrestricted vertical page gestures, and room for the standard focus outline. Core templates, static HTML, Tailwind, and Astro share this smaller markup contract; no runtime JavaScript is added.

### Boundaries

- The v0.1 API is early and may change; breaking class/token changes must be recorded here.
- EmDash mapping is experimental. A fixture-based Astro build does not establish live CMS support.
- WordPress integration remains a v0.2 target.
- No npm package, GitHub release, hosted demo, or production deployment is established by this entry.
