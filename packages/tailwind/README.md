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

`@theme inline` makes generated utilities refer directly to the `--una-*` variables on the styled element. Override those canonical variables to change both semantic classes and utility colors together. For example:

```html
<p class="bg-una-blue-light px-una-3 py-una-2 text-una-ink font-una-body">
  A note from the reading desk.
</p>
```

Aliases cover colors, fonts, type sizes, line heights, tracking, spacing, layout/prose maximum widths, border radius, and easing. Other properties remain available directly, for example `duration-(--una-motion-duration)`. Grid proportions stay in the semantic `una-layout` class.

Source paths are relative to the input stylesheet. The example disables automatic scanning with `source(none)` and explicitly scans one HTML file. Register additional template directories with `@source` and write complete utility names; dynamically assembled class fragments cannot be detected.

From the repository root, run `npm run build:tailwind`, then `npm run dev` and visit `http://127.0.0.1:4321/examples/tailwind/`. The example imports the same core CSS and local artwork as the static specimen. Its story links lead to the complete static articles.

See [the compiling example](../../examples/tailwind/src/input.css), [token source](../core/src/tokens.css), and Tailwind's official documentation on [theme aliases](https://tailwindcss.com/docs/theme#referencing-other-variables), [source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files), and [Preflight](https://tailwindcss.com/docs/preflight).
