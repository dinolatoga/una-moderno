import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { compileCore } from '../scripts/build-core.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFile(resolve(root, path), 'utf8');

test('every core token reference resolves to a canonical --una-* definition', async () => {
  const tokens = await read('packages/core/src/tokens.css');
  const styles = await read('packages/core/src/una.css');
  const definitions = new Set([...tokens.matchAll(/(--una-[\w-]+)\s*:/g)].map((match) => match[1]));
  for (const category of ['color', 'font', 'weight', 'space', 'layout', 'focus', 'motion']) {
    assert.ok(
      [...definitions].some((name) => name.startsWith(`--una-${category}-`)),
      `Missing ${category} tokens.`,
    );
  }
  for (const match of `${tokens}\n${styles}`.matchAll(/var\(\s*(--una-[\w-]+)/g)) {
    assert.ok(definitions.has(match[1]), `Undefined core token: ${match[1]}`);
  }
  assert.doesNotMatch(tokens, /@import\b/, 'Core tokens cannot require a CSS framework.');
});

test('committed core distributions reproduce the sources and remain self-contained', async () => {
  const expected = await compileCore();
  const css = await read('packages/core/dist/una.css');
  const minified = await read('packages/core/dist/una.min.css');
  assert.equal(css, expected.css, 'Run npm run build:core after editing core sources.');
  assert.equal(minified, expected.minified, 'Minified CSS must be built from the same sources.');
  assert.ok(
    Buffer.byteLength(minified) < Buffer.byteLength(css),
    'Minification should reduce bytes.',
  );
  assert.doesNotMatch(css, /@import\b|javascript:|expression\(/i);
});

test('core package has CSS/data-only exports and no consumer dependencies', async () => {
  const pkg = JSON.parse(await read('packages/core/package.json'));
  assert.equal(pkg.license, 'MIT');
  assert.equal(Object.keys(pkg.dependencies ?? {}).length, 0);
  assert.equal(Object.keys(pkg.peerDependencies ?? {}).length, 0);
  assert.equal(Object.keys(pkg.optionalDependencies ?? {}).length, 0);
  assert.ok(!pkg.main || pkg.main.endsWith('.css'), 'Core cannot expose a JavaScript entry point.');
  assert.ok(!pkg.module, 'Core cannot expose a JavaScript module entry point.');
  assert.ok(pkg.exports, 'Core must declare its supported import surface.');
  const exports = Object.values(pkg.exports).flatMap((value) =>
    typeof value === 'string' ? [value] : Object.values(value),
  );
  for (const exported of exports) {
    assert.equal(typeof exported, 'string');
    assert.doesNotMatch(exported, /\.(?:mjs|cjs|js|ts)$/);
    if (!exported.includes('*')) {
      assert.ok((await stat(resolve(root, 'packages/core', exported))).isFile(), exported);
    }
  }
});

for (const page of ['index.html', 'article.html']) {
  test(`${page} proves semantic, framework-free core markup`, async () => {
    const html = await read(`examples/static-html/${page}`);
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /<html\b[^>]*\blang="en"/i);
    assert.match(html, /<meta\b[^>]*name="viewport"/i);
    assert.equal((html.match(/<main\b/gi) ?? []).length, 1);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
    assert.match(html, /<nav\b/i);
    assert.match(html, /class="[^"]*\buna\b/);
    assert.match(html, /href="[^"\s]*packages\/core\/dist\/una(?:\.min)?\.css"/);
    assert.match(html, /class="[^"]*\buna-skip-link\b/);
    assert.doesNotMatch(html, /<script\b|\son\w+=|javascript:|data-(?:react|astro)-/i);
  });
}

test('generated token inventory exactly reflects canonical CSS', async () => {
  const source = await readFile(
    new URL('../packages/core/src/tokens.css', import.meta.url),
    'utf8',
  );
  const expected = Object.fromEntries(
    [...source.matchAll(/(--una-[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
  );
  const inventory = JSON.parse(
    await readFile(new URL('../packages/core/tokens.json', import.meta.url), 'utf8'),
  );
  assert.deepEqual(inventory.tokens, expected, 'Run npm run build:tokens after editing tokens.');
});

test('core templates expose one script-free horizontal navigation link set', async () => {
  for (const name of ['index', 'article']) {
    const html = await read(`packages/core/templates/${name}.html`);
    const navigation = html.match(
      /<nav\b[^>]*class="una-nav"[^>]*aria-label="[^"]+"[^>]*>([\s\S]*?)<\/nav>/,
    );
    assert.ok(navigation, `${name} needs a named navigation landmark.`);
    const links = [...navigation[1].matchAll(/<a\b[^>]*href="([^"]+)"/g)];
    assert.ok(links.length > 0);
    assert.equal(new Set(links.map((link) => link[1])).size, links.length);
    assert.doesNotMatch(navigation[1], /<(?:details|summary|button|svg|div)\b|aria-expanded=/i);
    assert.doesNotMatch(html, /<script\b|\son\w+=|javascript:/i);
  }
});

test('bundled Inter binary and license match the official release provenance', async () => {
  const assetRoot = 'packages/core/assets';
  const provenance = JSON.parse(await read(`${assetRoot}/provenance.json`));
  const font = await readFile(resolve(root, assetRoot, provenance.font.file));
  assert.equal(provenance.font.file, 'inter-variable.woff2');
  assert.equal(provenance.release.tag, 'v4.1');
  assert.equal(provenance.release.url, 'https://github.com/rsms/inter/releases/tag/v4.1');
  assert.equal(provenance.selectedMember, 'web/InterVariable.woff2');
  assert.equal(font.subarray(0, 4).toString(), 'wOF2');
  assert.equal(font.length, 352240);
  assert.equal(font.length, provenance.font.bytes);
  const digest = createHash('sha256').update(font).digest('hex');
  assert.equal(digest, '693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3');
  assert.equal(digest, provenance.font.sha256);
  assert.equal(digest, provenance.crossSourceVerification.websiteFontSha256);
  assert.deepEqual(provenance.font.axes, [
    { tag: 'opsz', minimum: 14, default: 14, maximum: 32 },
    { tag: 'wght', minimum: 100, default: 400, maximum: 900 },
  ]);
  assert.equal(provenance.license, 'OFL-1.1');
  assert.equal(provenance.font.licenseFile, 'OFL.txt');
  const notice = await readFile(resolve(root, assetRoot, provenance.font.licenseFile));
  const licenseDigest = createHash('sha256').update(notice).digest('hex');
  assert.equal(licenseDigest, '262481e844521b326f5ecd053e59b98c8b2da78c8ee1bdbb6e8174305e54935a');
  assert.equal(licenseDigest, provenance.font.licenseSha256);
  assert.match(notice.toString(), /SIL OPEN FONT LICENSE Version 1\.1/);
  assert.deepEqual(
    (await readdir(resolve(root, assetRoot))).filter((file) => file.endsWith('.woff2')),
    [provenance.font.file],
  );
});

test('font roles share one Inter stack and the optional face stays local with swap fallback', async () => {
  const source = await read('packages/core/src/tokens.css');
  const tokens = Object.fromEntries(
    [...source.matchAll(/(--una-[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
  );
  assert.match(tokens['--una-font-body'], /^'Inter', 'Una Inter Fallback', system-ui/);
  for (const role of ['display', 'prose', 'code']) {
    assert.equal(tokens[`--una-font-${role}`], 'var(--una-font-body)');
  }
  for (const [role, weight] of Object.entries({
    brand: 200,
    display: 300,
    body: 400,
    label: 500,
    strong: 600,
    hover: 700,
  })) {
    assert.equal(tokens[`--una-weight-${role}`], String(weight));
  }
  const fonts = await read('packages/core/assets/fonts.css');
  const face = fonts.match(/@font-face\s*\{[^}]*font-family: Inter;[^}]*\}/)?.[0];
  assert.ok(face);
  assert.match(face, /font-weight: 100 900;/);
  assert.match(face, /font-display: swap;/);
  const downloads = [...fonts.matchAll(/url\(([^)]+)\)/g)].map((match) => match[1]);
  assert.deepEqual(downloads, ["'./inter-variable.woff2'"]);
  assert.match(fonts, /src: local\('Arial'\), local\('ArialMT'\)/);
  const provenance = JSON.parse(await read('packages/core/assets/provenance.json'));
  assert.ok(fonts.includes(`size-adjust: ${provenance.fallback.sizeAdjust};`));
  assert.ok(fonts.includes(`ascent-override: ${provenance.fallback.ascentOverride};`));
  assert.ok(fonts.includes(`descent-override: ${provenance.fallback.descentOverride};`));
  assert.doesNotMatch(fonts, /@import|https?:\/\//);
});
