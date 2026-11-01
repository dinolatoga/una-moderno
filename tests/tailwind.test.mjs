import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('Tailwind theme aliases core values instead of defining a second palette', async () => {
  const theme = await read('packages/tailwind/theme.css');
  const tokens = await read('packages/core/src/tokens.css');
  assert.match(theme, /@theme inline/);
  const aliases = [...theme.matchAll(/(--[\w-]+):\s*var\((--una-[\w-]+)\);/g)];
  assert.ok(aliases.length >= 30);
  for (const [, , core] of aliases) assert.ok(tokens.includes(`${core}:`), core);
  assert.doesNotMatch(theme, /#[a-f\d]{3,8}\b|:\s*\d+(?:px|rem)\b/i);
});

test('example source detection is explicit and excludes unrelated projects', async () => {
  const input = await read('examples/tailwind/src/input.css');
  assert.match(input, /source\(none\)/);
  assert.match(input, /@source ['"]\.\.\/index\.html['"]/);
  assert.doesNotMatch(input, /preflight\.css/);
  assert.match(input, /@import ['"]@una-moderno\/core['"]/);
});
