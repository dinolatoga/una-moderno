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

Navigation uses a horizontal link group above 36rem and a closed native hamburger disclosure at smaller widths. Copy the complete `una-nav` pattern from a template, including both matching link groups, the `Menu` summary, and authored SVG. The disclosure supplies its own accessible expanded state and needs no script. See [the navigation contract](../../docs/architecture.md#responsive-navigation) for adapter responsibilities and native state behavior.

Custom type is optional: copy `assets/` alongside your CSS and link `assets/fonts.css` separately for Bricolage Grotesque. Preserve [OFL.txt](assets/OFL.txt) with the font. Without that stylesheet, the display falls back to Arial; article prose uses local Charter/Georgia. No font downloads occur from third-party services.

See the [full markup and adapter contract](../../docs/architecture.md) and the [richer static specimen](../../examples/static-html/index.html). Consumers receive CSS and templates only. Node and Lightning CSS are repository build tools, not consumer dependencies.
