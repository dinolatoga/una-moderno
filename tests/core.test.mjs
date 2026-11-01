import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
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
  for (const category of ['color', 'font', 'space', 'layout', 'border', 'focus', 'motion']) {
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

test('bundled Geist binary and license notices match their recorded provenance', async () => {
  const assetRoot = 'packages/core/assets';
  const provenance = JSON.parse(await read(`${assetRoot}/provenance.json`));
  const font = await readFile(resolve(root, assetRoot, provenance.file));
  assert.equal(provenance.file, 'geist-variable.woff2');
  assert.equal(provenance.package, 'geist@1.9.0');
  assert.equal(provenance.source, 'https://registry.npmjs.org/geist/-/geist-1.9.0.tgz');
  assert.equal(provenance.member, 'package/dist/fonts/geist-sans/Geist-Variable.woff2');
  assert.equal(font.subarray(0, 4).toString(), 'wOF2');
  assert.equal(font.length, 69576);
  assert.equal(font.length, provenance.bytes);
  const digest = createHash('sha256').update(font).digest('hex');
  assert.equal(digest, '5c5588027e59e74e205b9d6c7fd877b261091cee367f6bb3a8d505da14cae512');
  assert.equal(digest, provenance.sha256);
  assert.deepEqual(provenance.axes, [{ tag: 'wght', min: 100, default: 400, max: 900 }]);
  assert.equal(provenance.license, 'OFL-1.1');
  const notices = {
    'OFL.txt': 'c683bfbcc7e087f5d37a54ef628f10387c451a83ddc459b151403a164ac46c90',
    'Geist-LICENSE.txt': '930853ee1daa68554d9e35c8a9175affb74f699fad9a5da6ee5ebe76379d9137',
  };
  assert.deepEqual(provenance.licenseFiles, Object.keys(notices));
  for (const [file, expected] of Object.entries(notices)) {
    const notice = await readFile(resolve(root, assetRoot, file));
    assert.equal(createHash('sha256').update(notice).digest('hex'), expected, file);
    assert.match(notice.toString(), /SIL OPEN FONT LICENSE Version 1\.1/);
  }
});

test('font roles share one Geist stack and the optional face stays local with swap fallback', async () => {
  const source = await read('packages/core/src/tokens.css');
  const tokens = Object.fromEntries(
    [...source.matchAll(/(--una-[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
  );
  assert.match(tokens['--una-font-body'], /^'Geist', 'Una Geist Fallback', system-ui/);
  for (const role of ['display', 'prose', 'code']) {
    assert.equal(tokens[`--una-font-${role}`], 'var(--una-font-body)');
  }
  const fonts = await read('packages/core/assets/fonts.css');
  const geistFace = fonts.match(/@font-face\s*\{[^}]*font-family: Geist;[^}]*\}/)?.[0];
  assert.ok(geistFace);
  assert.match(geistFace, /font-weight: 100 900;/);
  assert.match(geistFace, /font-display: swap;/);
  const downloads = [...fonts.matchAll(/url\(([^)]+)\)/g)].map((match) => match[1]);
  assert.deepEqual(downloads, ["'./geist-variable.woff2'"]);
  assert.match(fonts, /src: local\('Arial'\), local\('ArialMT'\)/);
  assert.match(fonts, /size-adjust: 102\.2072%/);
  assert.doesNotMatch(fonts, /@import|https?:\/\//);
});
