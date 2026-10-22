import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../public/', import.meta.url));
const port = Number(process.env.PORT || 5174);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2', '.ico':'image/x-icon' };
http.createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    // Production analytics are disabled in this local copy.
    if (pathname.startsWith('/_vercel/')) {
      res.writeHead(200, {'Content-Type':'text/javascript'}); res.end('/* Disabled in local preview. */'); return;
    }
    if (pathname === '/') { res.writeHead(302, {Location:'/design-system'}); res.end(); return; }
    if (/^\/design-system(?:\/(?:colors|typography|radius|buttons|badges|forms|table|listing|empty-states|loading-states|thinking-orbs|feedback))?\/?$/.test(pathname)) pathname = '/design-system.html';
    else if (pathname.startsWith('/design-system/')) pathname = pathname.slice('/design-system'.length);
    const target = path.resolve(root, '.' + pathname);
    if (!target.startsWith(root)) { res.writeHead(403); res.end(); return; }
    const body = await readFile(target);
    res.writeHead(200, {'Content-Type':types[path.extname(target)] || 'application/octet-stream', 'Cache-Control':'no-store'});
    res.end(body);
  } catch { res.writeHead(404, {'Content-Type':'text/plain'}); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Bird Nest: http://localhost:${port}/design-system`));
