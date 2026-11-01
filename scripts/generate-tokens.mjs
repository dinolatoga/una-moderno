import { readFile, writeFile } from 'node:fs/promises';
import { format } from 'prettier';

const source = await readFile(new URL('../packages/core/src/tokens.css', import.meta.url), 'utf8');
const tokens = Object.fromEntries(
  [...source.matchAll(/(--una-[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
);
if (!Object.keys(tokens).length) throw new Error('No canonical tokens found.');
const inventory = {
  $schema: './tokens.schema.json',
  name: 'Una Moderno',
  version: '0.1.0',
  source: 'src/tokens.css',
  description: 'Generated CSS custom-property inventory. Edit source CSS, not this file.',
  tokens,
};
const output = await format(JSON.stringify(inventory), { parser: 'json' });
await writeFile(new URL('../packages/core/tokens.json', import.meta.url), output);
console.log(`Generated ${Object.keys(tokens).length} canonical tokens.`);
