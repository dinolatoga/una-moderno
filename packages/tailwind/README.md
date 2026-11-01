# Optional Tailwind v4 theme

This package maps Una Moderno's canonical CSS properties to Tailwind utilities. It contains aliases, not a second palette. Core semantic classes still provide the editorial layout; use utilities for local extensions.

These packages are private workspace packages in this repository and have **not** been published to npm. Start from a clone with the root `npm ci`. To adopt this in another project, copy the package directories and install them as local `file:` dependencies; include `@una-moderno/core` and Tailwind v4 in that project.

```css
@layer theme, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import '@una-moderno/core' layer(components);
@import '@una-moderno/tailwind';
@import 'tailwindcss/utilities.css' layer(utilities) source(none);

@source "../index.html";
```

Omit Tailwind Preflight: core already defines its scoped semantic presentation, and a global reset would change the template defaults. Putting core in `components` lets intentional `utilities` additions win without `!important`. The optional font stylesheet can be linked separately or bundled by your application.

`@theme inline` makes generated utilities refer directly to the corresponding `--una-*` token. Override canonical tokens on `:root` after core CSS for coordinated theme changes across semantic classes and utilities. Scoped direct overrides work too, but aliases inherited from `:root` retain their resolved values: setting only `--una-font-body` on `.una` updates body text and `font-una-body`, not the inherited `--una-font-display` used by `font-una-display`. Rebind each affected role or alias in the same scope, as shown in [core customization](../core/README.md#theme-overrides).

Utilities can extend the semantic presentation directly:

```html
<p class="bg-una-blue-light px-una-3 py-una-2 text-una-ink font-una-body">
  A note from the reading desk.
</p>
```

All four font-role aliases resolve to the canonical Inter stack. Link the core `assets/fonts.css` entrypoint to load the local variable font and preserve its OFL notice. Weight utilities use an explicit `weight` segment to avoid colliding with family utilities: `font-una-display` selects the family role; `font-una-weight-display` selects the canonical display weight.

Aliases cover colors (including `bg-una-stage` and `text-una-accent`), font families and weights, type sizes (including `text-una-nav`, `text-una-section`, and `text-una-utility`), line heights, tracking, spacing, layout/prose maximum widths, and easing. All six weight roles are available through `font-una-weight-{brand,display,body,label,strong,hover}` using complete class names. For example, `font-una-weight-hover` resolves to the canonical weight 700, used by compact story/resource links. It is not a blanket hover treatment: semantic primary titles retain 300, inactive navigation retains 300, and italic prose links retain 600 while their colors change. Other properties remain available directly, for example `duration-(--una-motion-duration)`. Grid proportions and the optional `una-feature--cover` layout stay in the semantic core.

The core presentation uses spacing, color, weight and italic prose links without decorative dividers, masthead stripes or link underlines. Rule-color and border-radius aliases have been removed with their unused core tokens; do not recreate underline treatments with utility borders, pseudo-elements, shadows or gradients. Retain the core keyboard focus outline, two-word wordmark markup and phone utility-line behavior instead of adding competing utility rules. The optional 352,240-byte Inter font and synthesized italic behavior are shared with core; see [the font payload tradeoff](../../docs/assets.md#inter).

Source paths are relative to the input stylesheet. The example disables automatic scanning with `source(none)` and explicitly scans one HTML file. Register additional template directories with `@source` and write complete utility names; dynamically assembled class fragments cannot be detected.

From the repository root, run `npm run build:tailwind`, then `npm run dev` and visit `http://127.0.0.1:4321/examples/tailwind/`. The example imports the same core CSS and local artwork as the static specimen. Its story links lead to the complete static articles.

See [the compiling example](../../examples/tailwind/src/input.css), [token source](../core/src/tokens.css), and Tailwind's official documentation on [theme aliases](https://tailwindcss.com/docs/theme#referencing-other-variables), [source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files), and [Preflight](https://tailwindcss.com/docs/preflight).
