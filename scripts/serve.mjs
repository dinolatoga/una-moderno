import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const port = Number(process.env.PASEO_PORT ?? process.env.PORT ?? 4321);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer from 1 to 65535.');
}

const routes = [
  ['/astro/', 'examples/astro/dist'],
  ['/examples/static-html/', 'examples/static-html'],
  ['/assets/', 'examples/static-html/assets'],
  ['/examples/tailwind/dist/', 'examples/tailwind/dist'],
  ['/examples/assets/', 'examples/assets'],
  ['/packages/core/dist/', 'packages/core/dist'],
  ['/packages/core/assets/', 'packages/core/assets'],
];
const mediaTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

function locate(pathname) {
  if (pathname === '/' || pathname === '/index.html') {
    return { directory: 'examples/static-html', relative: 'index.html' };
  }
  if (/^\/[a-z0-9][a-z0-9-]*\.html$/.test(pathname)) {
    return { directory: 'examples/static-html', relative: pathname.slice(1) };
  }
  if (pathname === '/examples/tailwind/' || pathname === '/examples/tailwind/index.html') {
    return { directory: 'examples/tailwind', relative: 'index.html' };
  }
  for (const [prefix, directory] of routes) {
    if (pathname.startsWith(prefix)) return { directory, relative: pathname.slice(prefix.length) };
  }
  return undefined;
}

function reply(response, status, message) {
  response.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' });
  response.end(`${message}\n`);
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('allow', 'GET, HEAD');
    return reply(response, 405, 'Method not allowed');
  }
  try {
    const rawPath = (request.url ?? '/').split('?')[0];
    const pathname = decodeURIComponent(rawPath);
    if (
      pathname.includes('\\') ||
      pathname.includes('\0') ||
      pathname.split('/').some((part) => part.startsWith('.') || part === 'node_modules')
    ) {
      return reply(response, 404, 'Not found');
    }
    const route = locate(pathname);
    if (!route) return reply(response, 404, 'Not found');

    const allowedRoot = await realpath(resolve(repository, route.directory));
    if (!allowedRoot.startsWith(`${repository}${sep}`)) return reply(response, 404, 'Not found');
    let candidate = resolve(allowedRoot, route.relative || 'index.html');
    if (!candidate.startsWith(`${allowedRoot}${sep}`)) return reply(response, 404, 'Not found');
    if ((await stat(candidate)).isDirectory()) candidate = resolve(candidate, 'index.html');
    candidate = await realpath(candidate);
    if (!candidate.startsWith(`${allowedRoot}${sep}`)) return reply(response, 404, 'Not found');
    const contentType = mediaTypes[extname(candidate)];
    if (!contentType) return reply(response, 404, 'Not found');

    let bytes = await readFile(candidate);
    // Preview-only deterministic comparison: shipped HTML/CSS needs no client script.
    if (contentType.startsWith('text/html')) {
      const effect = new URL(request.url, 'http://localhost').searchParams.get('art-effect');
      if (effect === 'static' || effect === 'parallax') {
        // Illustrated pages get the overlap by default; the static comparison opts out.
        const html = bytes.toString().replace(/<body\b[^>]*>/, (body) => {
          const plain = body.replace(/\sdata-una-art-effect="[^"]*"/, '');
          return effect === 'static' && /data-una-art="[a-z-]+"/.test(plain)
            ? plain.replace(/>$/, ' data-una-art-effect="static">')
            : plain;
        });
        bytes = Buffer.from(html);
      }
    }
    response.writeHead(200, {
      'content-type': contentType,
      'content-length': bytes.byteLength,
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : bytes);
  } catch (error) {
    if (error instanceof URIError) return reply(response, 400, 'Invalid URL');
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR')
      return reply(response, 404, 'Not found');
    console.error(error);
    reply(response, 500, 'Local preview error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Una Moderno: http://127.0.0.1:${port}/`);
  console.log(`Tailwind: http://127.0.0.1:${port}/examples/tailwind/`);
  console.log(`Astro: http://127.0.0.1:${port}/astro/ (run npm run build first)`);
});

server.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close());
}
