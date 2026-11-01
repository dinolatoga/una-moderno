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

`src/tokens.css` defines canonical `--una-*` defaults. `.una-layout` uses the original 580:360 ratio and a 20px gap, stacks below 56rem, and accepts token overrides for both tracks. `.una-prose` limits body measure to 70ch. Semantic classes need the actual landmarks, heading levels, alt text and link labels shown in the templates.

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

The same rule applies to color aliases: a scoped `--una-color-original-rose` override needs `--una-color-accent: var(--una-color-original-rose)` in that scope if the accent should follow it. Direct token overrides such as `--una-layout-gap` do not need an alias rebind.

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

Each span is nowrap; the words can wrap between themselves. `font-size: min(var(--una-text-brand), 20vw)` caps the logo on enlarged phone layouts while prose continues to enlarge. `.una-utility` is removed from layout at 30rem and below, with no reserved gap, and remains visible on wider layouts such as 568px and 667px landscape.

Custom type is optional: copy `assets/` alongside your CSS and link `assets/fonts.css` separately for self-hosted Inter from the official 4.1 release. All text roles use Inter: 200 for the wordmark, 300 for display/navigation, 400 for body, 500 for metadata and 600 for current navigation, compact headings and inline prose links. Weight 700 remains available for compact story/resource-link hover states. The upright variable font is 352,240 bytes, about 5.06 times the previous 69,576-byte asset; it preserves the official uncut weight/optical-size font. Browser-synthesized italics add no separate font download. Preserve [OFL.txt](assets/OFL.txt) with the font. The stylesheet uses `font-display: swap` and an approximate metric-adjusted local fallback when Arial is available, followed by system sans. Without it, the same markup remains readable using system fonts. No font downloads occur from third-party services. See [font provenance, payload tradeoff and fallback limits](../../docs/assets.md#inter).

See the [full markup and adapter contract](../../docs/architecture.md) and the [richer static specimen](../../examples/static-html/index.html). Consumers receive CSS and templates only. Node and Lightning CSS are repository build tools, not consumer dependencies.
