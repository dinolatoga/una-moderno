import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'examples/tailwind/dist/styles.css');
execFileSync(
  resolve(root, 'node_modules/.bin/tailwindcss'),
  ['-i', resolve(root, 'examples/tailwind/src/input.css'), '-o', output, '--minify'],
  { cwd: root, stdio: 'inherit' },
);

// Custom-property URLs survive Tailwind's bundle unchanged. Keep the compiled
// example self-contained by copying the canonical assets and rebasing only URLs.
const css = await readFile(output, 'utf8');
const names = [
  ...new Set(
    [...css.matchAll(/url\(["']?\.\.\/assets\/art\/([\w-]+\.webp)["']?\)/g)].map(
      (match) => match[1],
    ),
  ),
];
await rm(resolve(root, 'examples/tailwind/dist/art'), { recursive: true, force: true });
await mkdir(resolve(root, 'examples/tailwind/dist/art'), { recursive: true });
await Promise.all(
  names.map((name) =>
    copyFile(
      resolve(root, 'packages/core/assets/art', name),
      resolve(root, 'examples/tailwind/dist/art', name),
    ),
  ),
);
await writeFile(output, css.replace(/\.\.\/assets\/art\//g, './art/'));
console.log(`Tailwind example built with ${names.length} canonical WebP assets.`);
