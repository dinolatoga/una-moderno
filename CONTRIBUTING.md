# Contributing to Una Moderno

Una Moderno is an early editorial layout system. Small pull requests with a clear problem, an explained change, and reproducible evidence are the most useful contributions. Read [PRODUCT.md](PRODUCT.md), the [platform-neutral contract](docs/architecture.md), and the [code of conduct](CODE_OF_CONDUCT.md) first.

## Work locally

Install Node.js **22.23.4 or newer** and use the npm version declared in `package.json`. From a clone or fork:

```sh
npm ci
npm run build
npm run dev
```

The local server prints its preview URL. See the [README](README.md) for the specimen routes and browser-test prerequisites. Before submitting:

```sh
npm run check
npm run test:browser
git diff --check
```

Use `npm run format` when formatting needs repair. Commit the lockfile when dependencies change. Core build output is committed so the plain HTML specimen can work without a consumer build step; regenerate it after source changes.

## Keep the contract portable

Edit tokens in `packages/core/src/tokens.css`, then regenerate the derived files. Preserve semantic `una-*` markup, useful reading hierarchy, and a core with no runtime JavaScript. Tailwind and CMS examples consume this contract; they do not define competing visual systems. Explain public class/token changes in [CHANGELOG.md](CHANGELOG.md).

Visual contributions should include desktop and mobile screenshots using fictional content, plus checks at 390, 768, 1280, and 1440 pixels. Check keyboard navigation, focus, contrast, reduced motion, long titles, absent optional images, and overflow. Report the exact checks run; an automated accessibility pass is not a claim of complete accessibility.

Do not bring in private site code, unpublished content, credentials, historical implementation code, or assets with uncertain licensing. Original contributions use the repository [MIT license](LICENSE). Preserve third-party notices, including the bundled font's [SIL OFL license](packages/core/assets/OFL.txt), and document new asset provenance in [docs/assets.md](docs/assets.md).

## Propose or submit a change

Use the [issue templates](https://github.com/dinolatoga/una-moderno/issues/new/choose) for reproducible bugs or a concrete user problem. For a large API or platform change, discuss the proposed boundary in an issue before investing in a full implementation. WordPress integration is a v0.2 target; the Astro fixture example is not evidence of a production CMS integration.

Open a focused pull request against `main`. Explain the before/after behavior, list verification results and limitations, and attach screenshots when appearance changes. Avoid unrelated formatting or dependency updates. Maintainer review controls merges and releases; a contribution does not authorize publishing packages or deploying a site.

For security concerns, follow [SECURITY.md](SECURITY.md) instead of posting exploit details in an issue.
