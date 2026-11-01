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

`src/content/fixtures.json` contains only fictional content authored in this repository's static HTML example. `public/assets/*.svg` are copies of this repository's original static specimen illustrations, covered by its MIT license; they are not historical Una assets or private-site material. The optional Geist Sans variable font is imported from core and retains its separate OFL license and distribution notice there.

Routes and local assets use `import.meta.env.BASE_URL`, so links include the configured `/astro/` prefix. Change `base` in `astro.config.mjs` when integrating the reference under another path. The shared CSS is bundled into the build; no copy of the visual system is maintained here.

Run `npm run check --workspace=@una-moderno/example-astro` for Astro/TypeScript diagnostics; `npm run build:astro` includes this check. [Adapter boundaries and the experimental EmDash mapping](../../docs/adapters.md) distinguish this working fixture renderer from future CMS work.
