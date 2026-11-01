# Repository working rules

## Product and boundaries

Una Moderno — a portable editorial layout system for the independent web.

Read [PRODUCT.md](PRODUCT.md) and [the markup/content contract](docs/architecture.md) before changing the public API. The framework-neutral core is the source of truth. Tailwind v4 is optional; Astro demonstrates an adapter. Core consumers must need no Node, framework, Tailwind, or runtime JavaScript.

- Work only in this repository and its public dependencies. Do not read, copy, modify, or depend on the private personal-site repository, its history, credentials, or unpublished content.
- Preserve unrelated working-tree changes. Use focused patches and coherent checkpoints.
- Never execute historical PHP or JavaScript. The original Una archives are evidence only; follow [the provenance record](docs/history.md).
- Use fictional, clearly disclosed specimen content. Do not fabricate compatibility, usage, adoption, benchmark, security, or accessibility claims.
- Keep WordPress as a v0.2 target. Experimental EmDash mapping must stay labeled until an integration is proved with public APIs and tests.
- Maintainer authorization is required for merges, npm publication, GitHub releases, Pages enablement, production deployment, or account/settings changes. Commit, push, and PR permissions are task-specific; do not infer them from successful local checks.

## Architecture

- Author `--una-*` tokens in `packages/core/src/tokens.css`. Generate distributable CSS and token inventories through the build; do not maintain a second token source.
- Keep semantic `una-*` classes stable and document contract changes. Adapters own content acquisition, validation, escaping, routing, and asset resolution.
- Tailwind aliases core variables; it must not fork the palette or layout. Static HTML remains usable with the committed core distributable.
- Preserve the unequal editorial columns, leading story, three recent stories, and useful sidebar. Do not replace the reading surface with a generic component gallery.
- Keep the optional Geist font's [SIL OFL license](packages/core/assets/OFL.txt), [distribution notice](packages/core/assets/Geist-LICENSE.txt) and [asset provenance](docs/assets.md). The repository MIT license does not replace third-party licenses.

## Commands

Use Node.js **22.23.4 or newer** and the npm version declared in `package.json`. Run from the repository root:

```sh
npm ci
npm run check
npm run test:browser
git diff --check
```

`npm run check` is the format, lint, test, and build gate. Follow the README for browser-test prerequisites. Use `npm run format` to format changes and `npm run dev` for the local specimen. Keep `package-lock.json` synchronized with dependency changes.

## Verification and handoff

For visual changes, verify 390px, 768px, 1280px, and 1440px widths. For navigation changes, also verify 320px, phone landscape, the 576px neighborhood, initial/end scroll positions, unclipped keyboard focus, native horizontal and vertical touch scrolling, missing fonts, hidden scrollbar chrome, 44px targets, and axe; inspect screenshots, keyboard focus, skip navigation, headings, contrast, links, long titles, absent optional images, reduced motion, and horizontal overflow. Automated accessibility results supplement manual inspection.

Before declaring work ready, run the full gates above, verify relative links/assets and package exports, inspect the diff for private material or secrets, and record actual results. Update generated design documentation from the implemented system. Report incomplete or unavailable checks explicitly; never turn a skipped check into a pass. Independent review should seek material defects and record their resolution.

Report the exact branch, commits, PR/publication state, verification commands and outcomes, screenshot locations, and remaining limitations. Local previews and successful builds are not deployments or releases.
