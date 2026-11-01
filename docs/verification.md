# v0.1 verification record

This record covers the foundation and owner-approved single scrolling navigation/all-Geist refinement on **2026-11-01**. It is evidence for this repository's fictional specimen, not a production deployment, browser-support certification, or CMS compatibility claim.

## Environment and commands

The recorded toolchain is Node.js **22.23.4**, npm **10.9.4**, Tailwind CSS **4.3.3**, Astro **7.4.4**, Playwright **1.64.1**, and axe Playwright integration **4.14.0**. Dependencies are pinned in the lockfile.

The host's default Node is older, so checks use an ephemeral npm-provided runtime without changing the global installation:

```sh
npm exec --yes --package=node@22.23.4 --package=npm@10.9.4 -- npm ci
npm exec --yes --package=node@22.23.4 --package=npm@10.9.4 -- npm run check
UNA_BROWSER_CHANNEL=chrome npm run test:browser
git diff --check
```

With the documented versions already installed, use `npm ci`, `npm run check`, and the browser command appropriate for the operating system. `npm run build:astro` includes Astro's type/template diagnostics; `npm run typecheck` runs them independently.

| Gate                  | Recorded outcome                                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fresh install         | Passed in a separate temporary copy: 411 packages installed, 417 audited, zero reported vulnerabilities; all builds succeeded. The installer audit is not a security guarantee. |
| Full repository check | Passed: Prettier, Stylelint/script syntax, 19 unit/contract tests, token/core/Tailwind/Astro builds and 222 local links.                                                        |
| Astro check/build     | 13 files; zero errors, warnings, or hints; seven static pages.                                                                                                                  |
| Browser/accessibility | 40 passed in 1.7 minutes; zero skipped or flaky tests. All 32 axe analyses reported zero violations.                                                                            |
| Independent review    | Ship: no blocking, high-severity or material findings remain after independent source, interaction, typography and provenance review.                                           |
| `git diff --check`    | Passed. The upstream OFL notice retains its original bytes through a path-specific whitespace attribute and checksum test.                                                      |

## Browser and interaction coverage

Local tests use **Google Chrome 156.0.8078.74** on macOS 13 through Playwright's `chrome` channel. Playwright's current bundled Chromium cannot be downloaded for this host OS. GitHub CI uses bundled Chromium on Ubuntu. No physical-device, Firefox, or Safari result is claimed.

Five surfaces are checked at **390, 768, 1280, and 1440 CSS pixels**, height 1000px:

| Surface        | Route                              |
| -------------- | ---------------------------------- |
| Static index   | `/`                                |
| Static article | `/article.html`                    |
| Tailwind index | `/examples/tailwind/`              |
| Astro index    | `/astro/`                          |
| Astro article  | `/astro/a-website-can-be-a-place/` |

These 20 cases check loaded assets, response errors, document overflow, landmarks, headings, responsive stacking, the 580:360 column ratio and rendered 20px gutter. Each runs axe against WCAG 2 A/AA, 2.1 AA and 2.2 AA tags. Automated checks supplement manual inspection; zero detected violations does not establish complete accessibility.

Foundation regressions cover keyboard-visible skip navigation, heading order, article links, reduced motion, 70ch prose measure, long/unbroken titles, omitted images, local links/fragments, preview-file exclusions, native article contents, direct `file://` consumption, token overrides, and script-free Astro pages.

Navigation coverage verifies one direct-anchor collection across all **16 shipped pages/templates**. The three index integrations are measured at **320×740, 390×844, 568×320, 575×844, 576×844, 577×844, 667×375, 768×1024, 844×390, 1280×1000 and 1440×1000**. Labels remain on one row; targets are at least 44px high; the document's scroll and client widths match. The strip overflows at 320/390px and fits from 768px upward. There is no navigation mode change at 576px.

With Geist loaded, the 320px specimen's strip is 288px wide with 522px scroll width; the 390px strip is 358px wide with 570px scroll width. The initially clipped third destination exposes approximately 43px and 81px respectively. The stylesheet suppresses scrollbar chrome with standard `scrollbar-width: none` and `::-webkit-scrollbar { display: none; }`. Tests check both computed values and zero rendered scrollbar thickness, including forced colors. Screenshots were inspected for the absence of visible chrome.

Forward and reverse keyboard navigation must fully reveal focused links with the standard 3px outline plus 4px offset. Tests also cover immediate wheel scrolling after the last link receives keyboard focus, current-page underline, stable masthead geometry and reachable article links. Twelve additional axe analyses cover the initial and final scroll positions at 320/390px across all three index integrations.

Chromium DevTools Protocol synthesizes horizontal and vertical touch gestures with page JavaScript disabled. Horizontal gestures scroll the nav; vertical gestures initiated over it scroll the document. Switching from keyboard to touch and trackpad-style wheel input remains free. This is browser-generated input evidence, not a physical touchscreen test. Forced colors, reduced motion and missing fonts retain usable links and visible focus.

A 200% text-size regression covers all five surfaces at 320/390px. The wordmark can wrap, and mobile thumbnails cap at one third of their container so enlarged metadata retains a usable text column. Navigation labels wider than their viewport remain focusable and operable through native scrolling.

Typography checks cover loaded Geist roles and weights, local font requests, fallback readability while the font is delayed or unavailable, and navigation fit after loading. One unmodified 69,576-byte variable WOFF2 supplies every text role. Source, version, checksums, OFL notices and measured local fallback metrics are documented in [asset provenance](assets.md#geist-sans).

Paseo's managed preview remains on port **4321**. The owner's existing temporary public tunnel was checked against the new build: HTTP 200, no failed responses, four direct navigation links, no client scripts, loaded Geist, hidden scrollbar chrome and no document overflow. A temporary tunnel is not a durable hosted demo.

## Screenshot evidence

Run `npm run build`, then `npm run test:browser` (with `UNA_BROWSER_CHANNEL=chrome` on this host). Screenshots wait for fonts and images, return the document to its top and disable capture animations. Review files are intentionally ignored by Git:

- `.impeccable/review/static-index-{390,768,1280,1440}.png`
- `.impeccable/review/static-article-{390,768,1280,1440}.png`
- `.impeccable/review/{tailwind,astro,astro-article}-{390,1440}.png`
- `.impeccable/review/nav-{static-index,tailwind,astro}-{320,390}-{initial,end}.png`
- `.impeccable/review/nav-landscape-{568,667,768}.png` and `nav-forced-colors-390.png` (additional manual captures).
- `.impeccable/review/public-nav-{initial,end}-390.png` (temporary public preview).

The following captures are committed, opened and visually validated. All were refreshed for Geist and the single scrolling strip:

- [Desktop index](images/editorial-desktop.png), 1440px.
- [Mobile index](images/editorial-mobile.png), 390px, initial position.
- [Desktop article](images/article-desktop.png), 1440px.
- [Mobile article](images/article-mobile.png), 390px.
- [Scrolled phone navigation](images/navigation-mobile-end.png), 390px, final link keyboard-focused.

Embedded PNG origin metadata and [capture records](images/captures.json) preserve routes, viewports, commands and SHA-256 values. These are browser captures of original fictional content and art, not generated artwork or historical screenshots.

## Review and corrections

Foundation review corrected a synthetic `no-image` route collision and an extra sidebar inset that doubled the intended desktop gutter. Both retain regression coverage.

This refinement followed Impeccable's `adapt` workflow in the incumbent editorial world and a separate `typeset` assessment. The owner's final typography decision is Geist for every role, with weight and scale establishing hierarchy. No extra family or unused font is shipped. Source review and rendered inspection preserve the established proportional layout, flat surfaces and readable article measure.

Independent navigation review caught a focus-only mandatory snapping attempt that pinned wheel scrolling after keyboard use. That attempt was removed. The final solution uses `scroll-padding-inline: 50%` to narrow the native optimal viewing region and reveal partially visible focused links. It has no snapping, timing workaround, animation or runtime JavaScript. Forward/reverse keyboard and immediate wheel regressions cover the original failure.

The type-scoped mechanical detector ran once after UI edits and reported ten occurrences of its overused-font warning for Geist. A narrow `overused-font=geist` exception records the owner's explicit choice. The existing Arial exception now describes only the measured local fallback. The full mechanical detector then ran exactly once on changed UI targets and returned an empty result, exit 0. No file-wide or rule-wide suppression was added; no finding remains standing. `DESIGN.md` and `.impeccable/design.json` were reconciled from the final source, including all 51 canonical tokens.

Final independent Codex review returned **ship**, with no blocking, high-severity or material findings. It reviewed the final CSS, markup, tests, font provenance, documentation and refreshed screenshots; independently repeated forward/reverse focus, immediate wheel and both touch axes across all three integrations with loaded and blocked fonts; and confirmed the 320px, 200% text correction. Remaining browser/device limits are explicit below.

## Scope limits

Verified scope is English fictional fixtures, a light scheme, Chrome/Chromium evidence, static output and the documented body-block subset. Font metric adjustment aligns x-height and vertical metrics where local Arial exists; it does not promise identical glyph widths or zero reflow. Other browser engines, physical devices, additional writing systems, dark mode and package publication policy remain future work. EmDash is an unimplemented experimental mapping proposal; WordPress is a v0.2 adapter target.

Historical archives were read as inert evidence in temporary storage. No historical implementation/assets or private-site material are included. No merge, npm publication, GitHub release, Pages enablement or production deployment is part of this delivery.
