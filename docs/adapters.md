# Adapters and verified portability

The v0.1 contract is implemented in plain HTML, an optional Tailwind v4 example, and a static Astro reference. Each consumes `packages/core` and its semantic classes. Adapters own content and routing; the core owns tokens and presentation. See [the platform-neutral contract](architecture.md).

## Implemented Astro reference

`examples/astro` validates the public fictional fixtures and renders a journal index, four articles, an about page, and a second rendering of one article without its optional image. The typed `EditorialStory` shape is the adapter boundary. Body blocks deliberately support plain-text paragraphs, level-two headings, lists, and quotes; arbitrary HTML is unsupported. Astro escapes interpolated text. Validation rejects unsafe asset paths, duplicate route slugs/heading IDs, and malformed dates or dimensions.

All routes and local assets use Astro's configured base path (`/astro/`). The core CSS and optional font are bundled by Astro. No framework component, client-side hydration, server adapter, database, credential, or network content fetch is required. See [setup and commands](../examples/astro/README.md).

## Experimental EmDash mapping design — not implemented or verified

Public documentation reviewed on 2026-11-01 describes `getEmDashCollection()` and `getEmDashEntry()` from the `emdash` package, returning entries and errors to Astro pages. It also distinguishes EmDash's runtime database collections and Portable Text from repository-owned content. Sources: [Querying content](https://docs.emdashcms.com/guides/querying-content/), [EmDash for Astro developers](https://docs.emdashcms.com/coming-from/astro/), and [public JavaScript API](https://docs.emdashcms.com/reference/api/).

Those APIs make a future adapter plausible. They do **not** establish compatibility with this example's pinned Astro version, a deployed CMS, a particular schema, or a Portable Text renderer. No EmDash package, database, installation, live query, author/media resolution, preview, cache invalidation, or publication workflow has been exercised in this repository. This is a mapping proposal only; do not treat the Astro fixture build as EmDash support.

| Una field                      | Proposed adapter responsibility                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `slug`                         | Select a stable public identifier; reject route collisions                                                                     |
| `title`, `summary`, `category` | Map configured schema fields and taxonomy display text                                                                         |
| `author`                       | Resolve an author display name from public data                                                                                |
| `published`                    | Normalize the chosen published date to a valid ISO calendar date                                                               |
| `image`                        | Resolve media, dimensions, alternative text, and a deliberate safe-URL policy                                                  |
| `body`                         | Transform supported Portable Text nodes into the typed body contract; explicitly handle or reject unsupported marks and blocks |

A real adapter must define schema/version requirements, published-only access, query error behavior, rich-text and link sanitization, asset URLs, drafts/preview protection, pagination, and tests against a public test CMS before claiming support. Runtime collection rendering would also need an appropriate server adapter; the v0.1 reference remains static.

## WordPress v0.2 target

WordPress is a future server-side adapter around the same markup and CSS. It must map post data, metadata, featured images and navigation while using WordPress escaping APIs and an explicit rich-text policy. Theme/block-editor behavior, internationalization, packaging, minimum versions, and deployment need independent verification. No WordPress theme or compatibility claim ships in v0.1.
