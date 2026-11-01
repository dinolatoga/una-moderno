# Astro reference

A static Astro renderer of Una Moderno's public fictional editorial fixtures. It imports the core distributable and optional local font stylesheet, renders semantic `una-*` markup, and ships no client JavaScript. It is **not an EmDash integration**.

Use Node.js 22.23.4 or a supported newer even-numbered release. From the repository root:

```sh
npm ci
npm run build:core
npm run build:astro
npm run dev
```

Open `http://127.0.0.1:4321/astro/`. Seven generated pages are available: the index, four story routes, about, and an intentional [image-free article fixture](src/content/stories.ts) at `/astro/no-image/`. The root preview server mounts this example's `dist` at `/astro/`. For development with Astro itself, run `npm run dev --workspace=@una-moderno/example-astro` and open its printed `/astro/` address. Stop the root preview first if both use port 4321.

`src/content/contract.ts` defines and validates `EditorialStory`: slug, title, summary, author, ISO calendar date, category, optional local image, and paragraph/heading/list/quote body blocks. Duplicate slugs, unsafe image paths, invalid dates, invalid dimensions, and unsupported body blocks fail the build. All text is escaped by Astro; no arbitrary HTML renderer is used. The fixture renderer deliberately accepts local `assets/` paths only. A future remote-media adapter must define its own origin and URL policy.

`src/content/fixtures.json` contains only fictional content authored in this repository's static HTML example. `public/assets/*.svg` are copies of this repository's original static specimen illustrations, covered by its MIT license; they are not historical Una assets or private-site material. The optional Inter variable font is imported from core and retains its separate OFL license there. The index uses the shared `una-feature--cover` and `una-feature-copy` markup; article routes retain the light reading surface. One lowercase navigation collection is rendered by the shared layout.

Routes and local assets use `import.meta.env.BASE_URL`, so links include the configured `/astro/` prefix. Change `base` in `astro.config.mjs` when integrating the reference under another path. The shared CSS is bundled into the build; no copy of the visual system is maintained here.

The shared layout accepts a typed `art` prop with the five core choices. The index defaults to cat-studio; the lead article and image-free fixture use robot-city, blue-hour uses ribbon-world, commonplace uses kite-festival, and ordinary/about use desktop-garden. Selection is resolved during static rendering and emits one `data-una-art` attribute; there is no client randomization or artwork runtime.

Core artwork URLs are handled by Astro’s asset-aware build. `astro.config.mjs` sets [Vite `build.assetsInlineLimit`](https://vite.dev/config/build-options#build-assetsinlinelimit) to `0`, keeping the WebP derivatives as separate output assets instead of embedding all five choices in CSS. Core selects the 832px file at 52rem and below and the full-size file above that breakpoint. Only the selected background becomes active. The page atmosphere is independent of a story’s optional content image and follows the core print/forced-colors omission. [Artwork provenance](../../docs/assets.md#optional-page-artwork) stays with the core assets.

Run `npm run check --workspace=@una-moderno/example-astro` for Astro/TypeScript diagnostics; `npm run build:astro` includes this check. [Adapter boundaries and the experimental EmDash mapping](../../docs/adapters.md) distinguish this working fixture renderer from future CMS work.
