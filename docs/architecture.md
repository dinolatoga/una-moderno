# The platform-neutral contract

## Ownership

`packages/core/src/tokens.css` is the source of truth for every `--una-*` token. The core build concatenates tokens and semantic styles into readable and minified CSS. Generated token JSON is an inventory, never a competing authoring source. Core has no runtime JavaScript, framework, external network request, or dependency on a build tool in the consuming page.

An outer `.una` element scopes styles and establishes inherited typography/color. Place it on `<body>` for a whole page, or on a wrapper for an embedded region. Tokens are defaulted at `:root` and can be overridden on `.una` or a containing element. Core does not impose a global reset on unrelated content. Optional `assets/fonts.css` loads the bundled, separately licensed display face; the core works with fallbacks without this file.

## Stable v0.1 markup

| Class                                          | Element / responsibility                                  |
| ---------------------------------------------- | --------------------------------------------------------- |
| `una`                                          | body or wrapper; scope and type/color context             |
| `una-skip-link`                                | first anchor, href to main id                             |
| `una-shell`                                    | centered page container                                   |
| `una-masthead`                                 | header with brand and publication description             |
| `una-brand`                                    | home link / text wordmark                                 |
| `una-nav`                                      | labeled nav containing ordinary links                     |
| `una-layout`                                   | primary column followed by sidebar; 580:360 at desktop    |
| `una-main`                                     | main landmark, unique id and tabindex=-1 for skip link    |
| `una-feature`                                  | article with heading, link, metadata, optional figure     |
| `una-title`                                    | feature or article heading; level chosen by document      |
| `una-meta`                                     | author/date/category metadata, time uses datetime         |
| `una-deck`                                     | summary paragraph                                         |
| `una-recent`                                   | section containing three `una-story` articles             |
| `una-story`                                    | linked heading, optional image, and metadata              |
| `una-sidebar`                                  | aside with accessible label                               |
| `una-module`                                   | a useful sidebar section with a heading                   |
| `una-module--blue`                             | blue module surface                                       |
| `una-link-list`                                | list of navigation/resource links                         |
| `una-contents-inline` / `una-contents-sidebar` | mobile native details contents / desktop sidebar contents |
| `una-prose`                                    | long-form article body, max 70ch                          |
| `una-footer`                                   | footer and specimen disclosure                            |

Classes express presentation, never replace landmarks, headings or link semantics. No DOM query hooks or script behavior is promised. Feature images are optional; omitting the figure leaves a complete story. Do not render an empty or broken image. Long text wraps. Sidebar follows primary content in source and on small screens. Use a single page h1, h2 section headings, and h3 for stories inside those sections. Core custom properties and documented classes are the public v0.1 surface; changes require a changelog note while this pre-1.0 API stabilizes.

## Normalized content

Adapters map source data to `EditorialStory`: stable slug, title, summary, author display name, ISO publication date, category, optional image (`src`, `alt`, width, height), and typed body blocks. The Astro example owns validation and escaping. Body blocks support paragraph, heading, list and quote; no arbitrary HTML or script from fixtures. CMS-specific rich text must be deliberately transformed and sanitized by its adapter.

The static specimen uses handwritten HTML to show the complete output contract. Astro renders the same class/landmark pattern from typed public fixtures. Tailwind includes core CSS and aliases core variables through CSS-first `@theme inline`; it adds only utility-based extensions. No adapter may silently fork the core palette or layout.

## Adapter boundary

Adapters own data fetching, credentials, URL construction, asset resolution, rich-text sanitization, dates and author presentation. Core owns visual tokens, layout and semantic CSS. Routing, authentication, content persistence, SEO policy and CMS management are outside core.

WordPress is a v0.2 target: map public post data to the same fields and render server-side semantic templates. Theme APIs, block editor integration, escaping, internationalization and deployment must be verified before claiming WordPress support. EmDash mapping is experimental; the v0.1 Astro fixture renderer is not proof of a live CMS integration.
