# The platform-neutral contract

## Ownership

`packages/core/src/tokens.css` is the source of truth for every `--una-*` token. The core build concatenates tokens and semantic styles into readable and minified CSS. Generated token JSON is an inventory, never a competing authoring source. Core has no runtime JavaScript, framework, external network request, or dependency on a build tool in the consuming page.

An outer `.una` element scopes styles and establishes inherited typography/color. Place it on `<body>` for a whole page, or on a wrapper for an embedded region. Tokens are defaulted at `:root` and can be overridden on `.una` or a containing element. Core does not impose a global reset on unrelated content. Optional `assets/fonts.css` loads the bundled, separately licensed display face; the core works with fallbacks without this file.

## Stable v0.1 markup

| Class                                          | Element / responsibility                                   |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `una`                                          | body or wrapper; scope and type/color context              |
| `una-skip-link`                                | first anchor, href to main id                              |
| `una-shell`                                    | centered page container                                    |
| `una-masthead`                                 | header with brand and publication description              |
| `una-brand`                                    | home link / text wordmark                                  |
| `una-nav`                                      | labeled nav containing the wide links and phone disclosure |
| `una-nav-links` / `una-nav-links--wide`        | link group / horizontal group above the phone breakpoint   |
| `una-nav-disclosure` / `una-nav-toggle`        | native details / summary with a visible Menu label         |
| `una-nav-icon`                                 | authored, aria-hidden SVG menu/close icon                  |
| `una-layout`                                   | primary column followed by sidebar; 580:360 at desktop     |
| `una-main`                                     | main landmark, unique id and tabindex=-1 for skip link     |
| `una-feature`                                  | article with heading, link, metadata, optional figure      |
| `una-title`                                    | feature or article heading; level chosen by document       |
| `una-meta`                                     | author/date/category metadata, time uses datetime          |
| `una-deck`                                     | summary paragraph                                          |
| `una-recent`                                   | section containing three `una-story` articles              |
| `una-story`                                    | linked heading, optional image, and metadata               |
| `una-sidebar`                                  | aside with accessible label                                |
| `una-module`                                   | a useful sidebar section with a heading                    |
| `una-module--blue`                             | blue module surface                                        |
| `una-link-list`                                | list of navigation/resource links                          |
| `una-contents-inline` / `una-contents-sidebar` | mobile native details contents / desktop sidebar contents  |
| `una-prose`                                    | long-form article body, max 70ch                           |
| `una-footer`                                   | footer and specimen disclosure                             |

Classes express presentation, never replace landmarks, headings or link semantics. No DOM query hooks or script behavior is promised. Feature images are optional; omitting the figure leaves a complete story. Do not render an empty or broken image. Long text wraps. Sidebar follows primary content in source and on small screens. Use a single page h1, h2 section headings, and h3 for stories inside those sections. Core custom properties and documented classes are the public v0.1 surface; changes require a changelog note while this pre-1.0 API stabilizes.

## Responsive navigation

One labeled `nav.una-nav` contains two equivalent link groups: `.una-nav-links.una-nav-links--wide` for wider screens, and a closed-by-default `details.una-nav-disclosure` for phones. Its first child is `summary.una-nav-toggle`, containing an authored `svg.una-nav-icon` and the visible label **Menu**; its second child is `.una-nav-links`. Copy the complete pattern from the [index template](../packages/core/templates/index.html).

At 36rem (576px with the default root size) and below, only the native disclosure is displayed. Above that breakpoint, only the horizontal group is displayed. The four specimen links need approximately 482px plus 48px of page margins; the breakpoint leaves room before they would wrap. Both groups must have identical destinations, labels, and current-page attributes. CMS adapters should render them from one data collection, as the Astro reference does. The hidden group is absent from keyboard navigation and the accessibility tree.

The native summary exposes its name and expanded state; do not replace its role or hard-code `aria-expanded`. The SVG is `aria-hidden="true"` and `focusable="false"`; its `.una-nav-icon-menu` and `.una-nav-icon-close` paths switch with the details element's `open` state. The toggle and mobile links have at least 44px touch targets. Open links occupy the full width in normal document flow, below the masthead. No overlay, scroll lock, animation, or script is needed.

Native disclosure state persists when resizing away from and back to the phone layout. An in-page link scrolls to its destination without automatically closing the disclosure. Ordinary page navigation loads a closed menu in the new document; browser history restoration follows the browser's native behavior. The two markup groups avoid overriding the hidden content or accessibility semantics of a closed details element to force a desktop view.

## Normalized content

Adapters map source data to `EditorialStory`: stable slug, title, summary, author display name, ISO publication date, category, optional image (`src`, `alt`, width, height), and typed body blocks. The Astro example owns validation and escaping. Body blocks support paragraph, heading, list and quote; no arbitrary HTML or script from fixtures. CMS-specific rich text must be deliberately transformed and sanitized by its adapter.

The static specimen uses handwritten HTML to show the complete output contract. Astro renders the same class/landmark pattern from typed public fixtures. Tailwind includes core CSS and aliases core variables through CSS-first `@theme inline`; it adds only utility-based extensions. No adapter may silently fork the core palette or layout.

## Adapter boundary

Adapters own data fetching, credentials, URL construction, asset resolution, rich-text sanitization, dates and author presentation. Core owns visual tokens, layout and semantic CSS. Routing, authentication, content persistence, SEO policy and CMS management are outside core.

WordPress is a v0.2 target: map public post data to the same fields and render server-side semantic templates. Theme APIs, block editor integration, escaping, internationalization and deployment must be verified before claiming WordPress support. EmDash mapping is experimental; the v0.1 Astro fixture renderer is not proof of a live CMS integration.
