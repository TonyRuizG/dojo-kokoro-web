#!/usr/bin/env node
/**
 * Servidor local mínimo (sin dependencias) con URLs limpias, para ver el sitio igual que en producción.
 *
 *   node tools/servir.mjs          -> sirve dist/ en http://localhost:8080
 *   node tools/servir.mjs dist 3000
 */
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = resolve(ROOT, process.argv[2] || 'dist');
const PORT = Number(process.argv[3] || process.env.PORT || 8080);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
};

if (!existsSync(DIR)) {
  console.error(`No existe ${DIR}. Ejecuta primero: node build.mjs`);
  process.exit(1);
}

http
  .createServer((req, res) => {
    const path = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
    let file = join(DIR, path);
    if (!file.startsWith(DIR)) { res.writeHead(403); return res.end('Prohibido'); }
    if (existsSync(file) && statSync(file).isDirectory()) {
      if (!req.url.split('?')[0].endsWith('/')) { res.writeHead(301, { Location: req.url.replace(/(\?|$)/, '/$1') }); return res.end(); }
      file = join(file, 'index.html');
    }
    if (!existsSync(file)) {
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      return res.end(existsSync(join(DIR, '404.html')) ? readFileSync(join(DIR, '404.html')) : 'No encontrado');
    }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
  })
  .listen(PORT, () => console.log(`Dojo Kokoro → http://localhost:${PORT}   (Ctrl+C para detener)`));
