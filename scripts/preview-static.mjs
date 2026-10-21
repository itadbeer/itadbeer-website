import http from 'node:http';
import path from 'node:path';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const root = path.resolve('dist/client');
const port = Number(process.env.PORT || 4174);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.rsc': 'text/x-component' };
http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end(); return; }
  const candidate = path.resolve(root, `.${pathname}`);
  if (!candidate.startsWith(`${root}${path.sep}`) && candidate !== root) { response.writeHead(403).end(); return; }
  let file = [candidate, `${candidate}.html`, path.join(candidate, 'index.html')].find(file => existsSync(file) && statSync(file).isFile());
  const status = file ? 200 : 404;
  file ||= path.join(root, '404.html');
  if (!existsSync(file)) { response.writeHead(404).end('Not found'); return; }
  const type = types[path.extname(file)] || 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Cache-Control': 'public, max-age=0, must-revalidate', 'X-Content-Type-Options': 'nosniff' };
  if (pathname.startsWith('/fonts/') || pathname.startsWith('/itadbeer-wordmark-')) headers['Cache-Control'] = 'public, max-age=2592000';
  if (pathname.startsWith('/_next/static/')) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  let body = readFileSync(file);
  if (/text|xml|json/.test(type) && request.headers['accept-encoding']?.includes('gzip')) {
    body = gzipSync(body); headers['Content-Encoding'] = 'gzip'; headers.Vary = 'Accept-Encoding';
  }
  headers['Content-Length'] = String(body.length);
  response.writeHead(status, headers).end(request.method === 'HEAD' ? undefined : body);
}).listen(port, '127.0.0.1', () => console.log(`Static production preview: http://127.0.0.1:${port}`));
