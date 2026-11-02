# Una Moderno

**Una Moderno — a portable editorial layout system for the independent web.**

Give an independent publication a considered editorial layout without adopting a theme framework. Start with semantic HTML and prebuilt CSS; carry the same tokens and markup into Tailwind or Astro when your project needs them.

**Framework-neutral at the core; Tailwind-ready when wanted.**

![Una Moderno's editorial index at desktop width: a panoramic illustration above the lowercase wordmark and navigation, a featured essay on a dark cover, three recent stories with their category, date and a short excerpt, and open sidebar modules.](docs/images/editorial-desktop.png)

[See the mobile specimen](docs/images/editorial-mobile.png) · [See the scrolled navigation](docs/images/navigation-mobile-end.png) · [See a long-form article](docs/images/article-desktop.png) · [Read the markup contract](docs/architecture.md) · [Inspect the source CSS](packages/core/src/una.css)

## Choose a starting point

All three paths share one markup and token contract. The core CSS is the source of truth; the other two build on it.

| Path                      | Choose it when                                                                                     | You need                                                     | Guide                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **Plain HTML + core CSS** | You publish hand-written or generated HTML and want the layout without a build step.               | A copy of `una.css`; the local font and artwork are optional | [Core guide](packages/core/README.md) and [index template](packages/core/templates/index.html) |
| **Tailwind v4**           | Your site already compiles Tailwind v4 and you want utilities on the same `--una-*` tokens.        | Tailwind v4 and both workspace packages, copied locally      | [Tailwind guide](packages/tailwind/README.md) and [example](examples/tailwind/README.md)       |
| **Astro reference**       | You render pages from structured content and want a typed, static example of the content contract. | Node.js 22.23.4 or newer and this workspace                  | [Astro example](examples/astro/README.md) and [adapter boundaries](docs/adapters.md)           |

Tailwind adds aliases, not a second theme. The Astro example builds static pages from fictional fixtures; it is not a live CMS integration.

## What works today

This v0.1 foundation is for independent writers and publishers, developers fitting a layout into HTML or a publishing tool, and maintainers evaluating portability. It includes:

- **A usable CSS core:** `--una-*` custom properties, semantic `una-*` classes, readable and minified distributions, and minimal HTML templates. A consuming page needs no JavaScript, Node, Tailwind or framework.
- **A complete plain-HTML specimen:** a featured story; three recent stories, each with its category and date stacked under the title and a short excerpt; useful sidebar modules; four readable articles; an about page; and a chooser for five optional, owner-approved panoramic backgrounds. All editorial stories are fictional. Dino Latoga, Una Moderno's creator, appears as the lead-story byline and in an author note; every other author is invented.
- **An optional Tailwind v4 layer:** CSS-first aliases of core tokens, explicit source detection, and a compiled example using the same semantic markup.
- **An Astro reference:** a static site rendered from validated fictional fixtures. It demonstrates a normalized content boundary, not a live CMS integration.

The editorial columns use an exact 1.618:1 split with a fluid gutter; on smaller screens the reading column comes first and the sidebar follows. One lowercase navigation row serves every width, and on phones only its strip scrolls. Link hover changes color only. Keyboard focus outlines, a skip link and article contents work without client JavaScript. [DESIGN.md](DESIGN.md) records the implemented system.

## Try it

Packages are workspace-local and **not published to npm**. The API is pre-1.0 and may change; [CHANGELOG.md](CHANGELOG.md) records contract changes.

For the full development setup, use **Node.js 22.23.4 or newer** and **npm 10.9.4**. `.nvmrc` records the tested Node version. Git and a network connection are needed for the clone and dependency installation.

```sh
git clone https://github.com/dinolatoga/una-moderno.git
cd una-moderno
npm ci
npm run build
npm run dev
```

Open <http://127.0.0.1:4321/> for the editorial specimen, <http://127.0.0.1:4321/examples/tailwind/> for the Tailwind example, and <http://127.0.0.1:4321/astro/> for the Astro reference. Browse <http://127.0.0.1:4321/artworks.html> to compare the five page backgrounds. The server listens only on 127.0.0.1; stop it with Ctrl+C.

**Only want HTML and CSS?** After cloning, open `examples/static-html/index.html` directly in a browser. The committed CSS, local font, images and relative links work without installing anything. The minimal [index](packages/core/templates/index.html) and [article](packages/core/templates/article.html) templates also work directly from disk.

## Use plain HTML

Copy `packages/core/dist/una.css` or `una.min.css` into your own assets directory. The `.una` wrapper opts into the system; landmarks, headings, alt text and link labels remain your markup's responsibility.

```html
<link rel="stylesheet" href="/assets/una.css" />
<body class="una">
  <a class="una-skip-link" href="#main">Skip to article</a>
  <main id="main" class="una-shell" tabindex="-1">
    <h1 class="una-title">A small place for your ideas</h1>
    <div class="una-prose">
      <p>Your words, at a comfortable reading measure.</p>
    </div>
  </main>
</body>
```

Three details matter before you adopt it; the [core guide](packages/core/README.md) covers each one:

- **Theme overrides:** override `--una-*` properties on `:root` after core CSS so dependent aliases resolve together. A scoped override on `.una` must redeclare every alias that depends on it, because inherited aliases do not recompute. See [theme overrides](packages/core/README.md#theme-overrides).
- **Page artwork:** `data-una-art` selects one of five allowlisted panoramas, in markup or at build/server time, with no client randomization. Keep the package's `dist/` and `assets/` directories side by side: the stylesheet resolves artwork from `../assets/art/`. See [optional page artwork](packages/core/README.md#optional-page-artwork).
- **Typography:** core CSS makes no external font request. For the specimen's self-hosted Inter, copy `packages/core/assets/`, link `fonts.css` separately and keep `OFL.txt` with the font. The uncut variable font is 352,240 bytes; that is a download-size tradeoff, not a speed claim. See [font provenance](docs/assets.md#inter).

## Tailwind and Astro

**Tailwind v4 is optional.** In this monorepo, `@una-moderno/tailwind` maps core tokens to utilities such as `bg-una-stage` and `text-una-accent`. Outside it, copy or vendor both package directories; do not run a registry install for these unpublished names. The example omits Preflight and registers its template sources explicitly. Follow [the Tailwind guide](packages/tailwind/README.md) for the exact imports, and rebuild the example with `npm run build:tailwind`.

**The Astro reference** renders the same `una-*` markup from a validated story contract and emits static pages under `examples/astro/dist/` with an `/astro/` base. It needs no private code, credentials or database. Rebuild it with `npm run build:astro`; see [the example guide](examples/astro/README.md).

**EmDash is experimental mapping work, not verified integration support.** No live EmDash store is queried in v0.1. WordPress is a v0.2 adapter target, not an included theme. See [adapter boundaries](docs/adapters.md).

## Verify and contribute

```sh
npm run check
npx playwright install chromium
npm run test:browser
git diff --check
```

`npm run check` checks formatting, then runs lint, unit tests, every build and the local link check. On Linux, Playwright may need `npx playwright install --with-deps chromium`. On macOS 13, the pinned Playwright cannot download its current Chromium; with an existing compatible Google Chrome installation, use `UNA_BROWSER_CHANNEL=chrome npm run test:browser`. CI is configured for bundled Chromium on Ubuntu. The [verification record](docs/verification.md) lists exact coverage: recorded browser runs used Google Chrome on macOS, and no Firefox, Safari or physical-device result is claimed. Passing axe checks is not an accessibility certification.

Start with [CONTRIBUTING.md](CONTRIBUTING.md), then propose a focused issue or submit a small pull request with its validation. [AGENTS.md](AGENTS.md) records repository rules. [SECURITY.md](SECURITY.md) explains responsible reporting, and [the code of conduct](CODE_OF_CONDUCT.md) applies to project participation.

## Design, origin, and next steps

Una Moderno descends from Dino Latoga's 2008 Una WordPress theme. The archived source records the historical 580:360 proportions and 20px gap, palette, featured-story rhythm and useful sidebar; the exact 1.618:1 grid, wider fluid gutter and restrained display scale are modern owner-directed refinements. This is a new implementation: no historical PHP, JavaScript, images or CSS were transplanted, and the archive's licensing language is distinct from this repository's MIT license. [Historical evidence and provenance](docs/history.md) record the inspected sources and uncertainties.

[PRODUCT.md](PRODUCT.md) fixes the product boundary. [Machine-readable tokens](packages/core/tokens.json) are generated from source CSS, and [asset provenance](docs/assets.md) covers the story illustrations, generated page artwork, demo writing, font and screenshots. The owner's Zune references inform the light typography and open composition; the [Zune reference record](docs/zune-inspiration.md) separates historical evidence from current choices. Una Moderno is independent of Microsoft, and no Zune screenshots, branding or proprietary assets are redistributed.

v0.2 targets a verified WordPress adapter and a tested CMS mapping. Broader browser testing, additional writing systems, dark-mode design and a package publication policy remain open work. These are roadmap items, not current compatibility claims.

## License

Original code, templates, demo writing and code-authored story illustrations are [MIT licensed](LICENSE), copyright Dino Latoga. The generated page backgrounds have a separate [generation, approval and derivative provenance record](docs/assets.md#optional-page-artwork). Bundled Inter is separately licensed under [SIL OFL 1.1](packages/core/assets/OFL.txt). No historical Una assets are redistributed.
