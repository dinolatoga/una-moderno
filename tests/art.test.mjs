import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const names = ['cat-studio', 'desktop-garden', 'kite-festival', 'ribbon-world', 'robot-city'];
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

test('approved PNG masters retain their original hashes and remain outside the core package', async () => {
  const receipt = JSON.parse(await read('artwork/masters/provenance.json'));
  const provenance = JSON.parse(await read('packages/core/assets/art/provenance.json'));
  assert.deepEqual(receipt.assets.map(({ name }) => name).sort(), names);
  assert.deepEqual(provenance.assets.map(({ name }) => name).sort(), names);
  assert.equal(new Set(receipt.assets.map(({ sha256 }) => sha256)).size, 5);
  for (const source of receipt.assets) {
    assert.equal(source.file, `artwork/masters/${source.name}.png`);
    assert.ok(
      !new URL(source.file, root).pathname.startsWith(new URL('packages/core/', root).pathname),
    );
    const bytes = await readFile(new URL(source.file, root));
    assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(bytes.length, source.bytes);
    assert.equal(sha256(bytes), source.sha256);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format, 'png');
    assert.equal(metadata.width, 1672);
    assert.equal(metadata.height, 941);
    assert.equal(metadata.hasAlpha, false);
    assert.deepEqual(provenance.assets.find(({ name }) => name === source.name).source, source);
  }
});

test('ten responsive WebP derivatives match provenance without packaging PNG masters or SVG substitutes', async () => {
  const directory = 'packages/core/assets/art/';
  const provenance = JSON.parse(await read(`${directory}provenance.json`));
  assert.equal(provenance.schemaVersion, 2);
  const expected = names.flatMap((name) => [`${name}-1672.webp`, `${name}-832.webp`]).sort();
  const files = await readdir(new URL(directory, root));
  assert.deepEqual(
    files.filter((file) => /\.(?:webp|png|svg|jpe?g|avif)$/i.test(file)).sort(),
    expected,
  );
  assert.equal(provenance.totals.runtimeImageCount, 10);
  assert.deepEqual(provenance.encoder.resize.widths, [1672, 832]);
  assert.deepEqual(provenance.encoder.options, {
    quality: 78,
    effort: 6,
    preset: 'drawing',
    smartSubsample: true,
  });
  assert.equal(provenance.encoder.resize.kernel, 'lanczos3');
  assert.equal(provenance.encoder.resize.withoutEnlargement, true);
  let total = 0;
  for (const asset of provenance.assets) {
    assert.deepEqual(
      asset.derivatives.map(({ width }) => width),
      [1672, 832],
    );
    for (const derivative of asset.derivatives) {
      assert.equal(derivative.file, `${asset.name}-${derivative.width}.webp`);
      const bytes = await readFile(new URL(`${directory}${derivative.file}`, root));
      assert.equal(bytes.subarray(0, 4).toString(), 'RIFF');
      assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
      assert.equal(bytes.length, derivative.bytes);
      assert.equal(sha256(bytes), derivative.sha256);
      const metadata = await sharp(bytes).metadata();
      assert.equal(metadata.format, 'webp');
      assert.equal(metadata.width, derivative.width);
      assert.equal(metadata.height, derivative.width === 832 ? 468 : 941);
      assert.equal(metadata.height, derivative.height);
      assert.equal(metadata.hasAlpha, false);
      assert.equal(metadata.pages ?? 1, 1);
      total += bytes.length;
    }
  }
  assert.equal(total, provenance.totals.runtimeWebpBytes);
  const pkg = JSON.parse(await read('packages/core/package.json'));
  assert.ok(pkg.files.includes('assets'));
  assert.ok(!pkg.files.some((file) => file.includes('artwork') || file.includes('masters')));
});

test('one opt-in selection maps responsive raster assets through canonical URL tokens', async () => {
  const tokens = await read('packages/core/src/tokens.css');
  const source = await read('packages/core/src/una.css');
  assert.match(tokens, /--una-art-url:\s*none;/);
  assert.match(tokens, /--una-art-url-small:\s*none;/);
  assert.match(tokens, /--una-art-aspect-ratio:\s*1672 \/ 941;/);
  for (const name of names) {
    const selection = source.match(
      new RegExp(`\\.una\\[data-una-art=['"]${name}['"]\\]\\s*\\{([^}]+)\\}`),
    );
    assert.ok(selection, name);
    for (const [suffix, width] of [
      ['', 1672],
      ['-small', 832],
    ]) {
      assert.match(
        selection[1],
        new RegExp(
          `--una-art-url${suffix}:\\s*url\\(['"]\\.\\./assets/art/${name}-${width}\\.webp['"]\\);`,
        ),
      );
    }
  }
  assert.equal([...source.matchAll(/--una-art-url(?:-small)?:\s*url\(/g)].length, 10);
  assert.match(source, /background-image:\s*var\(--una-art-url\);/);
  const compactRule = source.match(
    /@media \(width <= 52rem\)\s*\{\s*\.una:where\(([^)]+)\)::before\s*\{\s*background-image:\s*var\(--una-art-url-small\);/,
  );
  assert.ok(compactRule);
  assert.deepEqual(
    [...compactRule[1].matchAll(/data-una-art=['"]([^'"]+)['"]/g)].map((match) => match[1]).sort(),
    names,
  );
  assert.doesNotMatch(source, /assets\/art\/[^'"\s)]+\.(?:svg|png)/);
});

test('canonical spatial and display contracts preserve reading sizes and golden track proportions', async () => {
  const source = await read('packages/core/src/tokens.css');
  const tokens = Object.fromEntries(
    [...source.matchAll(/(--una-[\w-]+):\s*([^;]+);/g)].map(([, key, value]) => [
      key,
      value.trim(),
    ]),
  );
  assert.equal(
    parseFloat(tokens['--una-layout-primary']) / parseFloat(tokens['--una-layout-sidebar']),
    1.618,
  );
  assert.equal(
    tokens['--una-layout-gap'],
    'clamp(var(--una-space-12), 4.1667vw, var(--una-space-20))',
  );
  assert.equal(tokens['--una-layout-stack-gap'], 'var(--una-space-10)');
  for (const [role, value] of Object.entries({
    brand: 'clamp(2.4rem, 5.6vw, 4.4rem)',
    nav: 'clamp(1.4rem, 2.4vw, 1.8rem)',
    section: 'clamp(1.6rem, 2.4vw, 2rem)',
    title: 'clamp(1.8rem, 3.36vw, 2.7rem)',
    cover: 'clamp(1.6rem, 2.4vw, 2.2rem)',
    subsection: '1.6rem',
    body: '1rem',
    prose: '1.1875rem',
    deck: '1.125rem',
    small: '0.8125rem',
    utility: '0.75rem',
  }))
    assert.equal(tokens[`--una-text-${role}`], value, role);
});

test('the parallax far plane keeps a guarded longhand scroll timeline in both core bundles', async () => {
  for (const file of ['packages/core/dist/una.css', 'packages/core/dist/una.min.css']) {
    const css = (await read(file)).replace(/\s+/g, ' ');
    // Engines reject a timeline inside the animation shorthand; a folded rule would silently
    // drop the motion, so the timeline must stay a separate longhand.
    assert.doesNotMatch(css, /animation:[^;}]*scroll\(/, file);
    const guarded = css.match(
      /@supports \(animation-timeline: ?scroll\(\)\) ?\{ ?@media \(prefers-reduced-motion: ?no-preference\) ?\{([^}]+)\}/,
    );
    assert.ok(guarded, `${file}: motion must be feature- and preference-gated`);
    // Every illustrated page with a direct shell gets the effect; only static opts out.
    assert.match(
      guarded[1],
      /:has\(> ?\.una-shell\):not\(\[data-una-art-effect=['"]?static['"]?\]\)/,
    );
    assert.match(guarded[1], /animation-name: ?una-art-recede/);
    assert.match(guarded[1], /animation-timeline: ?scroll\(root(?: block)?\)/);
    assert.match(guarded[1], /animation-range: ?0 var\(--una-art-content-offset\)/);
    const keyframes = css.match(/@keyframes una-art-recede ?\{ ?to ?\{([^}]+)\}/);
    assert.ok(keyframes, file);
    assert.match(
      keyframes[1].trim(),
      /^translate: ?0 calc\(var\(--una-art-content-offset\) \* -0?\.4\);?$/,
    );
  }
});
