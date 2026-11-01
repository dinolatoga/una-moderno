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

`src/tokens.css` defines canonical `--una-*` defaults. Override tokens on `.una` to theme a specific publication. `.una-layout` uses the original 580:360 ratio and a 20px gap, stacks below 56rem, and accepts token overrides for both tracks. `.una-prose` limits body measure to 70ch. Semantic classes need the actual landmarks, heading levels, alt text and link labels shown in the templates.

Navigation is one labeled `una-nav` element with direct anchor children. Its links stay horizontal at every width; only the strip scrolls when content exceeds the available space. The same markup provides 44px targets, current-page indication, and native keyboard scrolling without JavaScript. See [the navigation contract](../../docs/architecture.md#responsive-navigation) for spacing, focus, and adapter responsibilities.

Custom type is optional: copy `assets/` alongside your CSS and link `assets/fonts.css` separately for self-hosted Geist Sans 1.900. All text roles use Geist; scale and weights 400, 700, and 800 establish the hierarchy. Preserve [OFL.txt](assets/OFL.txt) and [Geist-LICENSE.txt](assets/Geist-LICENSE.txt) with the font. The stylesheet uses `font-display: swap` and a metric-adjusted local fallback when Arial is available, followed by system sans. Without it, the same markup remains readable using system fonts. No font downloads occur from third-party services. See [font provenance and checksums](../../docs/assets.md#geist-sans).

See the [full markup and adapter contract](../../docs/architecture.md) and the [richer static specimen](../../examples/static-html/index.html). Consumers receive CSS and templates only. Node and Lightning CSS are repository build tools, not consumer dependencies.
