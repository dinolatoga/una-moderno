import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';

const root = process.cwd();
const ignored = new Set([
  'node_modules',
  '.git',
  '.impeccable',
  '.astro',
  'dist',
  'test-results',
  'playwright-report',
]);
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !ignored.has(entry.name)) await walk(resolve(dir, entry.name));
    else if (entry.isFile() && /\.(md|html|css)$/.test(entry.name))
      files.push(resolve(dir, entry.name));
  }
}
await walk(root);
const errors = [];
let checked = 0;
for (const file of files) {
  const original = await readFile(file, 'utf8');
  const text = extname(file) === '.md' ? original.replace(/```[\s\S]*?```/g, '') : original;
  const patterns =
    extname(file) === '.md'
      ? [/\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g]
      : extname(file) === '.html'
        ? [/(?:href|src)="([^"]+)"/g]
        : [/url\(['"]?([^'"\s)]+)['"]?\)/g];
  for (const pattern of patterns)
    for (const match of text.matchAll(pattern)) {
      const href = match[1].replace(/^<|>$/g, '');
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) continue;
      const [pathPart, hash] = href.split('#');
      const path = resolve(dirname(file), decodeURIComponent(pathPart.split('?')[0] || '.'));
      const target = pathPart ? path : file;
      try {
        let actual = target;
        if ((await stat(actual)).isDirectory()) actual = resolve(actual, 'index.html');
        await stat(actual);
        if (hash && /\.(html|md)$/.test(actual)) {
          const source = await readFile(actual, 'utf8');
          const id = decodeURIComponent(hash);
          const ids = [...source.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
          if (actual.endsWith('.md'))
            ids.push(
              ...[...source.matchAll(/^#{1,6}\s+(.+)$/gm)].map((m) =>
                m[1]
                  .toLowerCase()
                  .replace(/[^\p{L}\p{N}\s_-]/gu, '')
                  .replace(/ /g, '-'),
              ),
            );
          if (!ids.includes(id)) throw new Error(`missing anchor #${id}`);
        }
        checked++;
      } catch (error) {
        errors.push(`${file.slice(root.length + 1)}: ${href} (${error.code ?? error.message})`);
      }
    }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`Validated ${checked} local document, HTML and CSS links.`);
