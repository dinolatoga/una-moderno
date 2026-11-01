# v0.1 verification record

This record describes the local foundation build and owner-approved phone-navigation refinement verified on **2026-11-01**. It is not a production deployment, browser-support certification, or CMS compatibility claim.

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

| Gate                            | Recorded outcome                                                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Fresh `npm ci`                  | 411 packages installed, 417 audited, zero reported vulnerabilities. This is the installer audit result, not a security guarantee.              |
| `npm run check`                 | Passed: Prettier, Stylelint and script syntax, 17 unit/contract tests, all package/example builds, and 243 local document/HTML/CSS links.      |
| Astro check and build           | 13 files checked; zero errors, warnings, or hints. Seven static pages generated.                                                               |
| Browser and accessibility suite | 37 passed, zero skipped or flaky tests. All 26 axe analyses, including six open-menu states, reported zero violations.                         |
| Independent code review         | Synthetic route collision fixed and independently reproduced as rejected; no remaining blocking, high, or material findings.                   |
| Independent visual review       | Final disposition: **ship**. Phone navigation and retained desktop hierarchy reviewed; no unresolved material findings or visible regressions. |
| `git diff --check`              | Passed.                                                                                                                                        |

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

Eight foundation interaction cases exercise keyboard-visible skip navigation, ordered headings, section links, reduced motion, article measure, long and unbroken titles, omitted images, local links and fragments, preview-file exclusions, native mobile contents disclosure, direct `file://` use, shared core/Tailwind token overrides, and every Astro article state without client scripts.

Nine navigation cases add contract parity across all 16 shipped pages/templates, native accessible name and expanded state, closed/open keyboard order, Enter/Space operation, reachable article links, and synthesized touch with page JavaScript disabled. The three index implementations are checked at **320×740, 390×844, 568×320, 575×844, 576×844, 577×844, 667×375, 768×1024, 844×390, and 1440×1000**. These checks cover the content-driven 36rem boundary, portrait and landscape, 44px minimum controls, full-width vertical links, unchanged masthead bounds, and no horizontal overflow. Six additional axe analyses run with the menu open at 320px and 390px across static HTML, Tailwind, and Astro. Chromium's accessibility tree confirms the native summary's name, focusability, and expanded state; no redundant authored ARIA is added.

Forced-colors and reduced-motion checks preserve the currentColor icon, current-page underline, visible focus, and native state through resizing. No entrance animation hides content. This is browser viewport and synthesized-touch evidence, not a physical-device or mobile Safari test.

Manual visual inspection covers the 14 foundation captures, the 12 fresh closed/open phone captures, landscape at 568px and 667px, tablet at 768px, and forced colors at 390px. The updated page was also opened through the owner's existing temporary public tunnel: HTTP 200, no failed responses, menu closed by default, tap open/close with JavaScript disabled, 48px mobile links, and no overflow. Paseo's managed preview remained healthy on port 4321. The temporary tunnel URL is not a durable hosted demo.

## Screenshot evidence and reproduction

Run `npm run build`, then `npm run test:browser` (with `UNA_BROWSER_CHANNEL=chrome` on this host). The suite starts or reuses the local preview and writes full-page PNGs after fonts and images have loaded. It returns the scroll position to the top and disables screenshot animations.

Local review files, intentionally ignored by Git:

- `.impeccable/review/static-index-{390,768,1280,1440}.png`
- `.impeccable/review/static-article-{390,768,1280,1440}.png`
- `.impeccable/review/tailwind-{390,1440}.png`
- `.impeccable/review/astro-{390,1440}.png`
- `.impeccable/review/astro-article-{390,1440}.png`
- `.impeccable/review/nav-{static-index,tailwind,astro}-{320,390}-{closed,open}.png`
- `.impeccable/review/nav-landscape-{568,667,768}.png` and `nav-forced-colors-390.png` (additional manual viewport captures).
- `.impeccable/review/public-nav-{closed,open}-390.png` (temporary public-preview check).

Selected validated captures are committed for public review:

- [Desktop editorial index](images/editorial-desktop.png), 1440px wide.
- [Mobile editorial index](images/editorial-mobile.png), 390px wide.
- [Desktop article](images/article-desktop.png), 1440px wide.
- [Mobile article](images/article-mobile.png), 390px wide.
- [Open phone navigation](images/navigation-mobile-open.png), 390px wide.

These are browser screenshots of fictional content and original repository artwork. Embedded origin metadata and [capture records](images/captures.json) identify the source routes and command. They are not generated artwork or historical Una screenshots. See [asset provenance](assets.md).

## Review and corrections

Fresh Codex code review identified a route collision: an authored fixture could use the synthetic image-free example's `no-image` slug. Route construction now validates the combined authored and synthetic namespace before Astro generates paths. Regression tests cover collisions, missing source content, and preservation of the original fixtures. The reviewer independently repeated the original reproduction and confirmed rejection.

Fresh Impeccable visual review opened all 14 screenshots and found an extra sidebar inset that doubled the visible desktop gutter. Removing the inset restores the promised 20px gap; a browser regression now measures rendered content edges instead of relying only on the grid's computed gap. The reviewer reopened all seven affected desktop captures and returned **ship**, with no unresolved material findings or visible regressions. The committed screenshot files were also opened and visually validated after origin metadata was embedded. For the phone refinement, only the two now-inaccurate mobile captures were replaced, and the open-menu capture was added. Both desktop images were retained after decoded-pixel comparisons proved identical output.

The design workflow used the delegated code-led route with a documented direction contract. It did not use an approved raster comp or a separately supplied quality-bar card for its grounded editorial direction. The reviewer assessed the actual screenshots, contract, source, and craft rules. The existing narrow Arial exception preserves intentional portable body/fallback typography; the specimen's custom display face is bundled Bricolage Grotesque.

The owner-approved phone refinement followed Impeccable's `adapt` workflow in the incumbent design. Source review found no material defect. Independent visual review opened all 12 phone-state captures, both public-preview captures, and the 768px/1440px index; final disposition was **ship**, with no blocking, high-severity, or material finding. The first browser run found a test timing race after activating a link; the destination loaded correctly, and replacing an immediate URL comparison with Playwright's waiting URL assertion resolved it. The final complete run passed.

The mechanical detector ran exactly once on the changed UI targets after implementation. Its existing 14px note-size advisory exposed an omitted type role in the design inventory; that role is now documented without changing typography. Its default-black paragraph advisories were false positives: computed-style checks on every named page, including direct-file templates, returned canonical cocoa `rgb(71, 40, 26)`. A file-scoped value exception records that evidence. No rule-wide or whole-file suppression was added, and no finding remains unresolved. `DESIGN.md` and its sidecar now describe the native phone menu and retain all 51 canonical tokens.

## Scope limits

English fictional fixtures, a light color scheme, current Chrome/Chromium coverage, static output, and the documented body-block subset are the verified scope. EmDash remains an unimplemented experimental mapping proposal. WordPress is a v0.2 adapter target. Dark mode, additional writing systems, other browser engines, live CMS behavior, and package publication policy remain future work.

The repository contains new implementation code and public dependencies only. Historical archives were read as inert evidence in temporary storage. No historical implementation/assets or private personal-site material are included. No merge, npm publication, GitHub release, Pages enablement, or production deployment is part of this delivery.
