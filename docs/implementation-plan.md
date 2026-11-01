# v0.1 acceptance plan

1. Evidence and contract: verify Git and tools, safely inspect archives, establish PRODUCT.md, choose code-led direction, document the markup/content boundary.
2. Core vertical slice: source tokens and semantic CSS, readable/minified distributions, plain HTML index and article, export/token/markup/runtime tests. Format, lint, test, build; commit when green.
3. Portability: Tailwind v4 aliases to core variables and explicit source detection; Astro static rendering of normalized public fixtures. Check and commit when green.
4. Front door: local visual proof, README, contributor/security/conduct documents, provenance, templates and CI. Validate all local links and commands.
5. Hardening: fresh installation, format/lint/type/unit/build/link checks, Playwright and axe at 390/768/1280/1440, navigation/focus/reduced-motion/long-title/no-image checks, independent Codex review, fixes, final generated design inventory.
6. Delivery: inspect public boundary and ancestry, commit, push codex/v0.1-foundation, open PR against main; start a Paseo local preview. No merge, npm publication, release, Pages or production deployment.

## Pass criteria

All commands above must actually pass. Screenshots must be opened and inspected. The static example must work directly from its HTML file with committed CSS and local assets. The Tailwind example must compile; Astro must build without private content or credentials. Automated accessibility evidence supplements manual inspection and is not a certification. The PR must remain open and unmerged. Any unavailable historical evidence or unverified platform mapping stays explicitly labeled.
