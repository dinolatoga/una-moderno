# Tailwind specimen

From the repository root, run `npm ci`, `npm run build:core`, `npm run build:tailwind`, and `npm run dev`. Open `http://127.0.0.1:4321/examples/tailwind/`.

The homepage uses the same semantic markup and artwork as the static HTML specimen. The “Made to travel” note adds the generated `bg-una-blue-light`, `px-una-3`, `py-una-2`, `text-una-ink`, and `font-una-body` utilities. Article and about links lead to the complete static example. No runtime JavaScript is included.

The body selects `data-una-art="cat-studio"`. The repository build copies the canonical WebPs into `dist/art/` and rebases stylesheet URLs to `./art/`. Keep that directory with `dist/styles.css` when moving the compiled example. The five choices have separate full-size and 832px WebP derivatives. CSS selects the smaller file at 52rem and below; only the selected scene is active. See [artwork delivery](../../packages/core/README.md#optional-page-artwork).

`src/input.css` imports core in the `components` layer, omits Preflight, and registers only `index.html` for utility detection. The generated CSS is written to `dist/styles.css`. See [the package usage guide](../../packages/tailwind/README.md).
