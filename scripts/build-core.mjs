import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { transform } from 'lightningcss';

const root = fileURLToPath(new URL('../', import.meta.url));
const banner = '/*! Una Moderno v0.1.0 | MIT | https://github.com/dinolatoga/una-moderno */';

export async function compileCore() {
  const sources = await Promise.all(
    ['tokens.css', 'una.css'].map((name) =>
      readFile(resolve(root, 'packages/core/src', name), 'utf8'),
    ),
  );
  if (sources.some((source) => /@import\b/i.test(source))) {
    throw new Error('Core source must be self-contained: @import is not allowed.');
  }

  const css = `${banner}\n\n${sources.map((source) => source.trim()).join('\n\n')}\n`;
  const { code } = transform({ filename: 'una.css', code: Buffer.from(css), minify: true });
  return { css, minified: `${code.toString()}\n` };
}

export async function buildCore() {
  const { css, minified } = await compileCore();
  const output = resolve(root, 'packages/core/dist/una.css');
  await mkdir(dirname(output), { recursive: true });
  await Promise.all([
    writeFile(output, css),
    writeFile(resolve(root, 'packages/core/dist/una.min.css'), minified),
  ]);
  console.log(
    `Core CSS built: ${Buffer.byteLength(css)} B readable, ${Buffer.byteLength(minified)} B minified.`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await buildCore();
}
