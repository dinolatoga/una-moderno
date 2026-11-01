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

- Use one self-hosted Geist Sans variable font for every text role, with weight and scale defining hierarchy; preserve official OFL notices, checksums, and metric-aware local/system fallbacks.
- Main navigation uses one set of direct links at every width. The non-wrapping horizontal strip scrolls natively when needed, with visible continuation on phones, hidden scrollbar chrome, 44px targets, contained horizontal overscroll, unrestricted vertical page gestures, and room for the standard focus outline. Core templates, static HTML, Tailwind, and Astro share this smaller markup contract; no runtime JavaScript is added.

### Boundaries

- The v0.1 API is early and may change; breaking class/token changes must be recorded here.
- EmDash mapping is experimental. A fixture-based Astro build does not establish live CMS support.
- WordPress integration remains a v0.2 target.
- No npm package, GitHub release, hosted demo, or production deployment is established by this entry.
