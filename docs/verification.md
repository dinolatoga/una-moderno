# v0.1 verification record

This record describes the local foundation build verified on **2026-11-01**. It is not a production deployment, browser-support certification, or CMS compatibility claim.

## Environment and commands

The recorded toolchain is Node.js **22.23.4**, npm **10.9.4**, Tailwind CSS **4.3.3**, Astro **7.4.4**, Playwright **1.64.1**, and axe Playwright integration **4.14.0**. Dependency versions are pinned in the lockfile.

The host's default shell had an older Node release. Build commands therefore used an ephemeral npm-provided runtime without changing the machine's global installation:

```sh
npm exec --yes --package=node@22.23.4 --package=npm@10.9.4 -- npm ci
npm exec --yes --package=node@22.23.4 --package=npm@10.9.4 -- npm run check
UNA_BROWSER_CHANNEL=chrome npm run test:browser
git diff --check
```

On a shell already using the documented versions, the equivalent commands are `npm ci`, `npm run check`, and the browser command appropriate for the operating system. `npm run build:astro` includes Astro's type/template diagnostics; `npm run typecheck` runs that check independently.

| Gate                            | Recorded outcome                                                                                                                          |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Fresh `npm ci`                  | 411 packages installed, 417 audited, zero reported vulnerabilities. This is the installer audit result, not a security guarantee.         |
| `npm run check`                 | Passed: Prettier, Stylelint and script syntax, 16 unit/contract tests, all package/example builds, and 208 local document/HTML/CSS links. |
| Astro check and build           | 13 files checked; zero errors, warnings, or hints. Seven static pages generated.                                                          |
| Browser and accessibility suite | 28 passed, zero skipped or flaky tests; final run took 47.1 seconds. All 20 viewport/axe cases reported zero violations.                  |
| Independent code review         | Synthetic route collision fixed and independently reproduced as rejected; no remaining blocking, high, or material findings.              |
| Independent visual review       | Final disposition: **ship**. Seven corrected desktop captures reopened; no unresolved material findings or visible regressions.           |
| `git diff --check`              | Passed.                                                                                                                                   |

## Browser coverage

Local tests use the installed **Google Chrome 156.0.8078.74** on macOS 13 through Playwright's `chrome` channel. The pinned Playwright cannot download its current bundled Chromium for this operating system. No Firefox or Safari result is claimed. The GitHub workflow installs bundled Chromium on Ubuntu; its actual result is reported on the pull request.

The suite tests each of five surfaces at **390, 768, 1280, and 1440 CSS pixels**, with a 1000px viewport height:

| Surface                  | Route                              |
| ------------------------ | ---------------------------------- |
| Static editorial index   | `/`                                |
| Static long-form article | `/article.html`                    |
| Tailwind index           | `/examples/tailwind/`              |
| Astro index              | `/astro/`                          |
| Astro long-form article  | `/astro/a-website-can-be-a-place/` |

These 20 cases check horizontal overflow, loaded images, local response errors, landmarks, headings, responsive stacking, desktop column ratio, and the visible 20px gutter. Each runs axe with WCAG 2 A/AA, 2.1 AA, and 2.2 AA tags. Zero detected violations is the acceptance threshold; automated checks cannot establish complete accessibility.

Eight further cases exercise keyboard-visible skip navigation, ordered headings, section links, reduced motion, article measure, long and unbroken titles, omitted images, local links and fragments, preview-file exclusions, native mobile contents disclosure, direct `file://` use, shared core/Tailwind token overrides, and every Astro article state without client scripts.

Manual visual inspection covers the 14 captured pages below, including hierarchy, readable text, contrast, image integrity, wrapping, and sidebar behavior. Additional local captures were opened for the focused skip link at 1280px (`.impeccable/review/keyboard-focus-1280.png`) and expanded mobile contents at 390px (`.impeccable/review/contents-open-390.png`). The first is reached with Tab from page load; the second with Enter on the native summary. Both show an unobstructed 3px blue focus outline. No entrance animation hides content.

## Screenshot evidence and reproduction

Run `npm run build`, then `npm run test:browser` (with `UNA_BROWSER_CHANNEL=chrome` on this host). The suite starts or reuses the local preview and writes full-page PNGs after fonts and images have loaded. It returns the scroll position to the top and disables screenshot animations.

Local review files, intentionally ignored by Git:

- `.impeccable/review/static-index-{390,768,1280,1440}.png`
- `.impeccable/review/static-article-{390,768,1280,1440}.png`
- `.impeccable/review/tailwind-{390,1440}.png`
- `.impeccable/review/astro-{390,1440}.png`
- `.impeccable/review/astro-article-{390,1440}.png`

Selected validated captures are committed for public review:

- [Desktop editorial index](images/editorial-desktop.png), 1440px wide.
- [Mobile editorial index](images/editorial-mobile.png), 390px wide.
- [Desktop article](images/article-desktop.png), 1440px wide.
- [Mobile article](images/article-mobile.png), 390px wide.

These are browser screenshots of fictional content and original repository artwork. Embedded origin metadata and [capture records](images/captures.json) identify the source routes and command. They are not generated artwork or historical Una screenshots. See [asset provenance](assets.md).

## Review and corrections

Fresh Codex code review identified a route collision: an authored fixture could use the synthetic image-free example's `no-image` slug. Route construction now validates the combined authored and synthetic namespace before Astro generates paths. Regression tests cover collisions, missing source content, and preservation of the original fixtures. The reviewer independently repeated the original reproduction and confirmed rejection.

Fresh Impeccable visual review opened all 14 screenshots and found an extra sidebar inset that doubled the visible desktop gutter. Removing the inset restores the promised 20px gap; a browser regression now measures rendered content edges instead of relying only on the grid's computed gap. The reviewer reopened all seven affected desktop captures and returned **ship**, with no unresolved material findings or visible regressions. The four committed screenshot files were also opened and visually validated after origin metadata was embedded.

The design workflow used the delegated code-led route with a documented direction contract. It did not use an approved raster comp or a separately supplied quality-bar card for its grounded editorial direction. The reviewer assessed the actual screenshots, contract, source, and craft rules. Detector warnings about Arial were retained as intentional portable body/fallback typography; the specimen's custom display face is bundled Bricolage Grotesque.

## Scope limits

English fictional fixtures, a light color scheme, current Chrome/Chromium coverage, static output, and the documented body-block subset are the verified scope. EmDash remains an unimplemented experimental mapping proposal. WordPress is a v0.2 adapter target. Dark mode, additional writing systems, other browser engines, live CMS behavior, and package publication policy remain future work.

The repository contains new implementation code and public dependencies only. Historical archives were read as inert evidence in temporary storage. No historical implementation/assets or private personal-site material are included. No merge, npm publication, GitHub release, Pages enablement, or production deployment is part of this delivery.
