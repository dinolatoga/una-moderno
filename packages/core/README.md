# @una-moderno/core

Prebuilt editorial CSS. This workspace is not published to npm.

Copy `dist/una.css` (or `una.min.css`) into your site's assets and link it from a page with `<body class="una">`. No build tool, JavaScript, network font, or framework is required. Open [the minimal index template](templates/index.html) or [article template](templates/article.html) directly in a browser.

```html
<link rel="stylesheet" href="/assets/una.css" />
<body class="una">
  <main class="una-shell">
    <h1 class="una-title">Your story belongs here.</h1>
    <div class="una-prose"><p>Start with the words.</p></div>
  </main>
</body>
```

`src/tokens.css` defines canonical `--una-*` defaults. `.una-layout` uses exact 1.618:1 tracks and a fluid column gap of `clamp(3rem, 4.1667vw, 5rem)`. At 56rem and below it stacks with a separate 2.5rem row gap and no extra sidebar margin. Both tracks and gaps accept canonical token overrides. `.una-prose` limits body measure to 70ch. Semantic classes need the actual landmarks, heading levels, alt text and link labels shown in the templates.

## Optional page artwork

Select one approved panoramic background with `data-una-art` on the `.una` body or wrapper. Omit the attribute for the plain paper ground. The five supported values are `cat-studio`, `robot-city`, `desktop-garden`, `kite-festival`, and `ribbon-world`; `--una-art-url` defaults to `none`.

```html
<link rel="stylesheet" href="/vendor/una/dist/una.css" />
<body class="una" data-una-art="cat-studio">
  <!-- The same semantic publication markup goes here. -->
</body>
```

Keep `dist/una.css` and `assets/art/` as sibling package directories when copying them: the selected image URL is relative to the stylesheet, `../assets/art/cat-studio-1672.webp`, not to the page. The readable and minified CSS share this contract. If CSS is moved or bundled, preserve or rewrite those URLs and publish the referenced assets. Copying CSS alone remains sufficient when artwork is omitted. Font delivery is a separate opt-in.

The artwork scope is positioned and isolated, with `padding-block-start: var(--una-art-content-offset)` set to `39vw`. Its absolute, full-width `::before` layer sits behind content with `z-index: -1`, `pointer-events: none`, a 1672:941 aspect ratio, centered top positioning and `background-size: 100% auto`. The complete panorama is scaled without cover cropping or blanket opacity. A CSS mask stays opaque through 75% of the image height, then blends the near-white bottom into the warm paper ground. This preserves the master’s existing opaque white fade; it does not edit the asset or add an opaque text panel. The content offset places the header in the scene’s quiet lower area. Print and forced colors remove both the layer and its reserved top space.

The `39vw` offset is calibrated for a full-width page. For an embedded narrower `.una` scope, explicitly adapt `--una-art-content-offset` to that scope’s width. The selected panorama retains its natural 1672:941 proportions, without cover cropping. The default WebP uses the full 1672px width; at 52rem and below CSS selects the 832px derivative. Print and forced colors hide the background. It is noninteractive page artwork without client-side randomization. Pending owner approval, an illustrated page whose body holds a direct `.una-shell` also gets a fixed, scroll-linked far plane with a paper shell fade; add `data-una-art-effect="static"` to keep the artwork static. Approved PNG masters stay in repository source under `artwork/masters/` and are excluded from the consumer package; consumers need only the generated WebP files.

Choose an allowlisted value in HTML or at server/build time; do not add client-side randomization. Only the selected URL becomes a background image. Bundlers must leave the WebP derivatives as separate assets rather than embedding every choice into CSS. The [plain HTML chooser](../../examples/static-html/artworks.html) links to all five examples and selects no artwork itself. See [route assignments and adapter ownership](../../docs/architecture.md#optional-page-artwork) and [generation and derivative provenance](../../docs/assets.md#optional-page-artwork).

## Theme overrides

Load customization after core CSS. Override tokens on `:root` for coordinated theme changes: aliases declared there resolve against the updated root values. For example, a root `--una-font-body` override also updates the display, prose and code aliases.

For a scoped publication, override the direct tokens and rebind each affected alias in that scope. Changing only `--una-font-body` on `.una` changes body text, but does not recompute the display/prose/code values already inherited from `:root`:

```css
.my-publication.una {
  --una-font-body: system-ui, sans-serif;
  --una-font-display: var(--una-font-body);
  --una-font-prose: var(--una-font-body);
  --una-font-code: var(--una-font-body);
}
```

The same rule applies to color aliases: a scoped `--una-color-original-rose` override needs `--una-color-accent: var(--una-color-original-rose)` in that scope if the accent should follow it. Direct token overrides such as `--una-layout-gap` do not need an alias rebind. If a scoped theme changes `--una-space-12`, `--una-space-20`, or `--una-space-10`, redeclare the dependent layout-gap or stack-gap expression there when it should follow those scoped primitives.

## Shared presentation

Navigation is one labeled `una-nav` element with direct anchor children. The specimen uses journal, stories, long read, and about; labels render lowercase. Links stay horizontal at every width; only the strip scrolls when content exceeds the available space. The same markup provides 44px targets, current-page indication, and native keyboard scrolling without JavaScript. See [the navigation contract](../../docs/architecture.md#responsive-navigation) for spacing, focus, and adapter responsibilities.

Sections are separated by spacing and typography, without decorative rules or masthead stripes. Links have no text decoration in default, hover, active, visited or current states. Inline prose links are italic/600 against regular/400 body and upright/600 strong text; hover changes color to rose while keeping italic/600. Inactive navigation is muted/300 and rose/300 on hover; the current page is rose/600. Primary-title hover changes color without changing weight. Keyboard focus keeps the standard 3px outline and 4px offset. Forced colors use system `LinkText`, `VisitedText` and `Highlight` cues.

Add `una-feature--cover` to an index's `una-feature` for a dark lead-story field. Wrap its heading, summary and metadata in `una-feature-copy`, followed by an optional figure. Its headline stays weight 300, paper-colored at rest and rose on hover. The art and copy share columns on wider screens and follow source order on phones. Omit the figure when unavailable; the text remains complete. Use an ordinary `una-feature` for the light article view. The legacy `una-module--blue` class now has an ink-colored, noninteractive heading on an unboxed surface.

Keep the two wordmark words intact with a literal space between their spans:

```html
<a class="una-brand" href="index.html" aria-label="Una Moderno home">
  <span>Una</span> <span>Moderno</span>
</a>
```

Each span is nowrap; the words can wrap between themselves. `font-size: min(var(--una-text-brand), 16vw)` caps the logo on enlarged phone layouts while prose continues to enlarge. No utility row sits above the masthead.

Custom type is optional: copy `assets/` alongside your CSS and link `assets/fonts.css` separately for self-hosted Inter from the official 4.1 release. All text roles use Inter: 200 for the wordmark, 300 for display/navigation, 400 for body, 500 for metadata and 600 for current navigation, compact headings and inline prose links. Link hover changes color only; the 700 hover token remains for compatibility but no core state applies it. The upright variable font is 352,240 bytes, about 5.06 times the previous 69,576-byte asset; it preserves the official uncut weight/optical-size font. Browser-synthesized italics add no separate font download. Preserve [OFL.txt](assets/OFL.txt) with the font. The stylesheet uses `font-display: swap` and an approximate metric-adjusted local fallback when Arial is available, followed by system sans. Without it, the same markup remains readable using system fonts. No font downloads occur from third-party services. See [font provenance, payload tradeoff and fallback limits](../../docs/assets.md#inter).

See the [full markup and adapter contract](../../docs/architecture.md) and the [richer static specimen](../../examples/static-html/index.html). The consumer runtime is semantic HTML and CSS, with optional local font and artwork assets. Node and Lightning CSS are repository build tools, not consumer dependencies.
