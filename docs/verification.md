# v0.1 verification record

This record covers the owner-approved Zune-inspired, all-Inter editorial system including the final hover, wordmark and phone-utility corrections after removal of decorative rules and link underlines on **2026-11-01**. It records the fictional specimen's verified behavior, not a production deployment, browser-support certification or CMS compatibility claim. The final local gates pass; independent review is recorded below.

## Environment and commands

The recorded toolchain is Node.js **22.23.4**, npm **10.9.4**, Tailwind CSS **4.3.3**, Astro **7.4.4**, Playwright **1.64.1**, and axe Playwright integration **4.14.0**. The lockfile did not change during this visual revision.

The host's default Node is older, so repository checks use an ephemeral npm-provided runtime without replacing the global installation:

```sh
npm exec --yes --package=node@22.23.4 --package=npm@10.9.4 -- npm ci
npm exec --yes --package=node@22.23.4 --package=npm@10.9.4 -- npm run check
UNA_BROWSER_CHANNEL=chrome npm run test:browser
git diff --check
```

With the documented versions installed, use `npm ci` and `npm run check` directly. `npm run build:astro` includes Astro's type/template diagnostics; `npm run typecheck` runs them independently. These are reproduction commands, not a claim that every command was rerun while writing this record.

| Gate                       | Recorded outcome                                                                                                                                                                                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fresh install              | Final isolated temporary-copy `npm ci` and full `npm run check` passed: 411 packages installed, 417 audited, zero reported vulnerabilities. This is an install result, not a security guarantee.                                                           |
| Unit/contract tests        | 19 passed for the final rule-free build.                                                                                                                                                                                                                   |
| Package/example builds     | Token, core CSS, Tailwind and Astro builds passed. Astro produces seven static pages.                                                                                                                                                                      |
| Browser suite              | **50 passed in 166.614 seconds**, including stable hover geometry, enlarged wordmarks and the utility breakpoint; zero unexpected failures, skipped tests, flaky tests or retries. No reporter errors.                                                     |
| Automated accessibility    | **36 axe analyses, zero reported violations**: 20 main-surface cases, 12 navigation states and four about-page cases.                                                                                                                                      |
| Mechanical design detector | The single changed-target run after the final owner fix batch covered 17 UI targets and returned `[]`; no repeat detector run.                                                                                                                             |
| Final repository check     | `npm run check` passed: formatting, lint, 19 tests, all builds and 227 local-link checks. Astro: 13 files, zero errors/warnings/hints, seven static pages.                                                                                                 |
| Independent review         | Fresh Codex finish review: **ship**. All 38 screen/state captures, four print-media captures, sampled source and final browser results inspected; no remaining material fixes in that scope.                                                               |
| Shipping screenshots       | Seven files refreshed with Inter/rule-free provenance and SHA-256 records; decoded pixels match the final browser rerun. Lead engineer inspected the seven shipping sources and representative states; independent Codex review inspected all 42 captures. |

The browser totals come from the saved `una-owner-fix-browser-results.json` report: start time `2026-11-01T04:41:33.443Z`, duration `166613.959` milliseconds. The final detector record is `una-owner-fix-detector.json`. Package dry runs contained 15 core files and four Tailwind files, with licenses and no runtime JavaScript or obsolete font asset. These local working reports are not distributed assets; the repository tests define the reproducible checks.

## Browser and accessibility coverage

Local browser evidence uses **Google Chrome 156.0.8078.74** on macOS 13 through Playwright's `chrome` channel. This host cannot download Playwright's current bundled Chromium. CI is configured to use bundled Chromium on Ubuntu. No physical-device, Firefox or Safari result is claimed.

Five surfaces are tested at **390, 768, 1280 and 1440 CSS pixels**, height 1000px:

| Surface        | Route                              |
| -------------- | ---------------------------------- |
| Static index   | `/`                                |
| Static article | `/article.html`                    |
| Tailwind index | `/examples/tailwind/`              |
| Astro index    | `/astro/`                          |
| Astro article  | `/astro/a-website-can-be-a-place/` |

These 20 cases check assets, response errors, document overflow, landmarks, headings, responsive stacking, the 580:360 desktop column ratio and rendered 20px gutter. Each runs axe with WCAG 2 A/AA, 2.1 AA and 2.2 AA tags. Static and Astro about pages add four axe cases at 390/1440px, checking credits, local assets and the current navigation destination. Automated results supplement visual and keyboard review; zero detected violations does not establish complete accessibility.

Other regressions cover skip navigation, heading order, article links, reduced motion, 70ch prose measure, long/unbroken titles, missing optional images, local links/fragments, preview-file exclusions, native article contents, direct `file://` use and script-free Astro output. A shared-token test overrides `document.documentElement`, proving root-level aliases reach both semantic classes and Tailwind utilities. It does not claim that an inherited alias recomputes after a descendant-only override; see the [customization contract](../packages/core/README.md#theme-overrides).

## Navigation, typography and link states

One direct-anchor navigation collection serves all 16 shipped pages/templates. The three index integrations are checked at **320×740, 390×844, 568×320, 575×844, 576×844, 577×844, 667×375, 768×1024, 844×390, 1280×1000 and 1440×1000**. Labels remain on one row with at least 44px targets. The strip overflows at 320/390px and fits from 768px upward, without document overflow or a mode change at 576px.

Forward and reverse keyboard traversal reveal the complete focus outline. Tests cover immediate wheel scrolling after keyboard focus, stable masthead geometry, reachable links, hidden scrollbar chrome and zero occupied scrollbar thickness. The final native scrolling solution uses `scroll-padding-inline: 50%`, without snapping, timers or animated scroll position. Twelve axe analyses check initial and final navigation positions at 320/390px across all three integrations.

Chromium DevTools Protocol synthesizes horizontal and vertical touch gestures with page JavaScript disabled. Horizontal gestures scroll the strip; vertical gestures initiated over it scroll the document. Keyboard-to-touch and keyboard-to-wheel transitions remain free. These are browser-generated gestures, not physical touchscreen results.

The single local Inter variable face is checked through rendered-font inspection, canonical weights, optical sizing and font requests. Delayed and failed loads retain readable fallback text and usable navigation. A 200% text-size regression covers all five main surfaces at 320/390px; a combined failed-font/200% regression adds phone and landscape cases at 320, 390, 568 and 667px. The square cover, single feature-copy wrapper and unboxed sidebar are checked across the three index integrations. [Font provenance](assets.md#inter) records the unmodified 352,240-byte Inter asset, OFL notice, measured fallback and optical-size/weight limitations.

The final interaction checks verify **no decorative borders or link text decoration** across seven reading surfaces at 390/1440px in screen, forced-color and print media. Artwork strokes inside SVG illustrations are content, not interface dividers. Print removes the dark cover background and makes links inherit surrounding ink; cover headlines are asserted black in default and hover states. Authored link roles are checked in default, hover, keyboard-focus, active and current-page states, and again after a real destination visit. Browser privacy hides visited matching/color, so the history check verifies the decoration invariant without claiming access to concealed visited styling.

Inline prose links remain **italic/600** in default and hover states, distinct from regular/400 prose and upright/600 strong text. Inactive navigation uses **muted/300**, changing only color to rose on hover or active; the current destination uses **rose/600**. Cover titles remain **300**, paper at rest and rose on hover. Regression checks compare the title, deck, metadata and navigation-link rectangles before and during hover/active states: their layout stays unchanged. The noninteractive legacy blue-module heading uses ink, and the masthead has no decorative geometry. The **3px keyboard focus outline and 4px offset remain**. No border, pseudo-element, shadow or gradient substitutes for an underline. Forced colors use `LinkText`, `VisitedText` and `Highlight` rather than restoring decorative rules.

The wordmark has a real space between two nowrap spans. Its `min(var(--una-text-brand), 20vw)` size cap keeps both words intact under 200% text enlargement, without capping article prose. One canonical `@media (width <= 30rem)` rule sets `.una-utility` to `display: none`; the unchanged metadata markup consumes no phone layout space. Regression assertions cover hidden utility at 320/390/480px, visible utility at 481/568/667/768/1280/1440px, and intact wordmarks at 320/390px with 100% and 200% text. Existing skip-link, nav-peek, scrolling and overflow checks remain green.

## Preview and capture evidence

Paseo's local preview uses port **4321**. The supplementary `una-owner-fix-public.json` record includes landscape, forced-color, font-failure, enlarged-text and public-preview observations. Recorded cases returned HTTP 200 with no reported page/response errors, external asset requests, client scripts or document overflow; the font-failure case deliberately blocks Inter. The temporary public-preview case loaded Inter and retained hidden scrollbar chrome. At 390px, its navigation measured 358px client width and 490px scroll width, exposing about 108.42px of the next `long read` destination. This is evidence for the actual specimen labels, not a universal fit guarantee or a durable hosted demo.

The browser suite waits for fonts and images, restores the top position and disables capture animations. Review captures are ignored by Git:

- `.impeccable/review/static-index-{390,768,1280,1440}.png`
- `.impeccable/review/static-article-{390,768,1280,1440}.png`
- `.impeccable/review/{tailwind,astro,astro-article}-{390,1440}.png`
- `.impeccable/review/{static-about,astro-about}-{390,1440}.png`
- `.impeccable/review/nav-{static-index,tailwind,astro}-{320,390}-{initial,end}.png`
- `.impeccable/review/nav-landscape-{568,667}.png`, `nav-tablet-768.png` (768×1024 portrait), `nav-forced-colors-390.png`, `font-failure-390.png` and `text-200-390.png` from supplementary captures.
- `.impeccable/review/public-nav-{initial,end}-390.png` from the temporary public preview.

The seven-file shipping set below has been refreshed, visually opened, and reconciled with current origin metadata and checksums. The lead engineer opened the seven shipping source images and representative integration/edge states; independent Codex review opened all 38 screen/state captures and four print-media captures:

| Shipping filename under `docs/images/` | Source capture                     | Viewport width |
| -------------------------------------- | ---------------------------------- | -------------- |
| `editorial-desktop.png`                | `static-index-1440.png`            | 1440px         |
| `editorial-mobile.png`                 | `static-index-390.png`             | 390px          |
| `article-desktop.png`                  | `static-article-1440.png`          | 1440px         |
| `article-mobile.png`                   | `static-article-390.png`           | 390px          |
| `navigation-mobile-end.png`            | `nav-static-index-390-end.png`     | 390px          |
| `navigation-320-initial.png`           | `nav-static-index-320-initial.png` | 320px          |
| `navigation-320-end.png`               | `nav-static-index-320-end.png`     | 320px          |

Embedded PNG origin metadata and [capture records](images/captures.json) preserve routes, dimensions, commands and SHA-256 values. The shipping images are original browser captures of the fictional specimen, not copied Zune screenshots or private-site material.

## Review status and limits

Earlier foundation review corrected a synthetic `no-image` route collision and a sidebar inset that doubled the intended gutter. Earlier navigation review found mandatory snapping that trapped wheel scrolling after keyboard focus; the final implementation removes snapping and retains the regression. These resolved historical findings do not replace independent review of this revision.

The lead engineer identified a light cover-link color on white in print and changed print links to inherit surrounding ink. The full rerun now asserts default and hover black cover headlines. Four print-media captures were opened to verify readable text; these emulate print styles, not physical printer output.

The current system has **59 canonical tokens**. Impeccable typography assessment and the type detector ran during the Inter transition. The saturated-font warning has a narrow owner-confirmed `inter` exception; Arial is exempted only as the measured local fallback. Stale prior-family and type-size findings were reconciled through canonical source and design metadata, not blanket suppression. No unresolved detector finding is being carried forward. The owner selected Inter and the Zune desktop/website references, then explicitly removed decorative rules and all link underlines while preserving keyboard focus. The mechanical detector returned no findings. The fresh Codex reviewer returned **ship** after checking the 59-token inventory, font/license hashes, all 38 screen/state captures, four print-media captures, sampled source and the final browser report. A mislabeled 768×1024 tablet portrait capture was renamed from landscape to tablet; the actual 568×320 and 667×375 landscape captures were valid. The final re-review confirmed stable title/nav/wordmark hover geometry, readable word separation, phone utility removal, paper cover headlines, ink module headings, italic prose-link cues, stripe removal and print contrast. No material implementation fixes remain. The review did not independently repeat upstream archive retrieval, browser interactions or physical-device checks.

Both About pages use the owner-required durable policy URL, `https://github.com/dinolatoga/una-moderno/blob/main/docs/zune-inspiration.md`, with the label “Read the Zune inspiration and asset policy.” It returns HTTP 404 before this feature branch is merged into main. That known external destination limitation is not counted among local-link passes; it is not authorization to merge. The document is available in this branch and through the repository-relative links.

Verified scope remains English fictional fixtures, a light reading surface with an optional dark index cover, Chrome evidence, static output and the documented content-block subset. Font fallback adjustment does not promise identical glyph widths, weights or zero reflow. Other browser engines, physical devices, additional writing systems, dark mode and package publication policy remain future work. EmDash is an unimplemented experimental mapping proposal; WordPress remains a v0.2 adapter target.

Historical material was inspected as inert evidence. No historical implementation/assets or private-site material are included. No merge, npm publication, GitHub release, Pages enablement or production deployment occurred.
