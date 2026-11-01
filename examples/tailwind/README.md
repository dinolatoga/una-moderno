# Tailwind specimen

From the repository root, run `npm ci`, `npm run build:core`, `npm run build:tailwind`, and `npm run dev`. Open `http://127.0.0.1:4321/examples/tailwind/`.

The homepage uses the same semantic markup and artwork as the static HTML specimen. The “Made to travel” note adds the generated `bg-una-blue-light`, `px-una-3`, `py-una-2`, `text-una-ink`, and `font-una-body` utilities. Article and about links lead to the complete static example. No runtime JavaScript is included.

`src/input.css` imports core in the `components` layer, omits Preflight, and registers only `index.html` for utility detection. The generated CSS is written to `dist/styles.css`. See [the package usage guide](../../packages/tailwind/README.md).
