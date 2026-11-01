import assert from 'node:assert/strict';
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
