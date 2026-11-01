# The platform-neutral contract

## Ownership

`packages/core/src/tokens.css` is the source of truth for every `--una-*` token. The core build concatenates tokens and semantic styles into readable and minified CSS. Generated token JSON is an inventory, never a competing authoring source. Core has no runtime JavaScript, framework, external network request, or dependency on a build tool in the consuming page.

An outer `.una` element scopes styles and establishes inherited typography/color. Place it on `<body>` for a whole page, or on a wrapper for an embedded region. Tokens are defaulted at `:root`; override them there after core CSS for coordinated alias-wide themes. Scoped direct overrides on `.una` or a containing element are supported, but dependent aliases must also be redefined in that scope. An inherited alias retains the value resolved where it was declared; changing `--una-font-body` on a descendant does not recompute the root's display/prose/code aliases. See [the scoped example](../packages/core/README.md#theme-overrides). Core does not impose a global reset on unrelated content. Optional `assets/fonts.css` loads the bundled, separately licensed Inter family for every text role; the core works with fallbacks without this file.

## Stable v0.1 markup

| Class                                          | Element / responsibility                                            |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| `una`                                          | body or wrapper; scope and type/color context                       |
| `una-skip-link`                                | first anchor, href to main id                                       |
| `una-shell`                                    | centered page container                                             |
| `una-masthead`                                 | header with brand and publication description                       |
| `una-brand`                                    | home link with two nowrap word spans and a literal separating space |
| `una-utility`                                  | publication/edition information, hidden at 30rem and below          |
| `una-nav`                                      | labeled, horizontally scrollable nav with direct anchor children    |
| `una-layout`                                   | primary column followed by sidebar; 580:360 at desktop              |
| `una-main`                                     | main landmark, unique id and tabindex=-1 for skip link              |
| `una-feature`                                  | article with heading, link, metadata, optional figure               |
| `una-feature--cover`                           | optional dark lead-story presentation on the editorial index        |
| `una-feature-copy`                             | feature heading, summary and metadata wrapper                       |
| `una-title`                                    | feature or article heading; level chosen by document                |
| `una-meta`                                     | author/date/category metadata, time uses datetime                   |
| `una-deck`                                     | summary paragraph                                                   |
| `una-recent`                                   | section containing three `una-story` articles                       |
| `una-section-heading`                          | section heading and optional supporting label                       |
| `una-story`                                    | linked heading, optional image, and metadata                        |
| `una-sidebar`                                  | aside with accessible label                                         |
| `una-module`                                   | a useful sidebar section with a heading                             |
| `una-module--blue`                             | unboxed module with ink heading; retained legacy modifier name      |
| `una-link-list`                                | list of navigation/resource links                                   |
| `una-contents-inline` / `una-contents-sidebar` | mobile native details contents / desktop sidebar contents           |
| `una-prose`                                    | long-form article body, max 70ch                                    |
| `una-footer`                                   | footer and specimen disclosure                                      |

Classes express presentation, never replace landmarks, headings or link semantics. No DOM query hooks or script behavior is promised. Feature images are optional; omitting the figure leaves a complete story. Do not render an empty or broken image. Long text wraps. Sidebar follows primary content in source and on small screens. Use a single page h1, h2 section headings, and h3 for stories inside those sections. Core custom properties and documented classes are the public v0.1 surface; changes require a changelog note while this pre-1.0 API stabilizes.

For the cover modifier, put `una-feature-copy` before the optional figure in source order. On wider screens CSS places the artwork beside the copy; at 42rem and below the copy precedes the figure in a single column. Omit the modifier for a light long-form article header. `--una-color-stage` supplies the cover's dark ground; its headline uses paper at rest and rose on hover, retaining display weight 300. Primary-title hover changes color without changing type metrics. Inter's role weights are canonical tokens: brand 200, display 300, body 400, label 500, strong 600 and hover 700. The last role remains available for compact story/resource links, not primary titles or prose links. The Tailwind layer aliases these values without introducing a second theme.

Navigation, sections, modules, article contents and the footer use spacing and typography without decorative rules. The masthead has no stripe decoration. Links have no text decoration in default, hover, active, visited or current states; borders, pseudo-elements, shadows and gradients must not simulate an underline. Inline `.una-prose a` links use italic weight 600 against regular body 400 and upright strong 600. Hover changes their color to rose while retaining italic/600. The browser synthesizes italic from the shipped upright variable font; no extra asset is requested. The 3px keyboard focus outline with 4px offset remains an interaction cue. In forced colors, ordinary links use `LinkText`, visited links use `VisitedText`, and hover/active/current-page states use `Highlight`; the focus outline also uses `Highlight`.

The wordmark markup is `<span>Una</span> <span>Moderno</span>` inside `una-brand`: each word stays intact, with a real space that permits wrapping between words. Its size is `min(var(--una-text-brand), 20vw)`, capping the fluid logo independently when phone text is enlarged to 200%; article prose still enlarges. `.una-utility` uses `display: none` at 30rem and below, leaving no reserved utility-line gap. It remains visible at wider widths, including the 568px and 667px landscape layouts.

## Responsive navigation

One labeled `nav.una-nav` contains one set of direct anchor children at every width. Copy the [index template](../packages/core/templates/index.html). The specimen's labels are journal, stories, long read and about; navigation text renders lowercase. Adapters render that one collection once, including destination URLs, descriptive labels, and `aria-current="page"` on the current page. No navigation-specific runtime or expanded state is part of the contract.

The nav is a non-wrapping flex row with horizontally scrollable overflow. Links keep their labels on one line and have at least 44px height. The document stays within the viewport; overflow belongs to the navigation strip alone. The specimen fits on tablet and desktop. Narrow widths expose part of the next destination to make continuation visible, with no added control or instructional copy. There is no navigation mode change at 576px: overflow follows the actual content width.

The strip has 8px padding, and links have 4px block / 8px inline padding with a 24px gap. At 22rem and below the gap becomes 8px. The 8px inner gutter and link scroll margin leave room for the standard 3px outline plus 4px offset. `scroll-padding-inline: 50%` narrows the optimal viewing region to the center, making native keyboard focus reveal even partially visible links. There is no scroll snapping or animated scroll position, so touch and trackpad scrolling remain free after keyboard use. Inactive links are muted/300; hover and active states turn rose while retaining 300. Only the current page uses rose/600, without an underline or divider.

`overflow-x: auto` uses native scrolling, including momentum where the browser provides it. Horizontal overscroll is contained with `overscroll-behavior-x: contain`; the vertical axis and touch-action remain at browser defaults, so vertical gestures over the nav can scroll the page. Scrollbar chrome is suppressed with standard `scrollbar-width: none` and the WebKit/Chromium `::-webkit-scrollbar` rule. The partially visible next destination supplies continuation without an added control. Do not add a JavaScript carousel. Browser history restoration retains its normal scroll behavior.

Longer labels, additional destinations, localization, and font changes require rechecking fit, focus visibility, and continuation at the intended widths. The specimen measurements are evidence for its actual content, not a guarantee for every navigation collection.

## Normalized content

Adapters map source data to `EditorialStory`: stable slug, title, summary, author display name, ISO publication date, category, optional image (`src`, `alt`, width, height), and typed body blocks. The Astro example owns validation and escaping. Body blocks support paragraph, heading, list and quote; no arbitrary HTML or script from fixtures. CMS-specific rich text must be deliberately transformed and sanitized by its adapter.

The static specimen uses handwritten HTML to show the complete output contract. Astro renders the same class/landmark pattern from typed public fixtures. Tailwind includes core CSS and aliases core variables through CSS-first `@theme inline`; it adds only utility-based extensions. No adapter may silently fork the core palette or layout.

## Adapter boundary

Adapters own data fetching, credentials, URL construction, asset resolution, rich-text sanitization, dates and author presentation. Core owns visual tokens, layout and semantic CSS. Routing, authentication, content persistence, SEO policy and CMS management are outside core.

WordPress is a v0.2 target: map public post data to the same fields and render server-side semantic templates. Theme APIs, block editor integration, escaping, internationalization and deployment must be verified before claiming WordPress support. EmDash mapping is experimental; the v0.1 Astro fixture renderer is not proof of a live CMS integration.
