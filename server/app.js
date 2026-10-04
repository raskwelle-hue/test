import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { products } from './products.js';
import { validateQuote, ValidationError } from './quote-service.js';
import { createQuoteRepository } from './quote-repository.js';

export function createApp({ publicDirectory = resolve('public'), repository = createQuoteRepository() } = {}) {
  return createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    const json = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); };
    try {
      const pathname = new URL(req.url, 'http://localhost').pathname;
      if (pathname === '/api/products' && req.method === 'GET') return json(200, products);
      if (pathname === '/api/quotes' && req.method === 'POST') {
        if (!req.headers['content-type']?.startsWith('application/json')) return json(415, { error: 'Usa application/json.' });
        const chunks = []; let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 16384) { json(413, { error: 'Solicitud demasiado grande.' }); return; }
          chunks.push(chunk);
        }
        let input;
        try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return json(400, { error: 'JSON inválido.' }); }
        const quote = await repository.save(validateQuote(input));
        return json(201, { id: quote.id, createdAt: quote.createdAt });
      }
      if (pathname.startsWith('/api/')) return json(404, { error: 'Ruta no encontrada.' });
      if (req.method !== 'GET' && req.method !== 'HEAD') return json(405, { error: 'Método no permitido.' });
      const file = resolve(publicDirectory, '.' + decodeURIComponent(pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(publicDirectory + sep)) return json(403, { error: 'Acceso denegado.' });
      const content = await readFile(file);
      res.writeHead(200, { 'Content-Type': ({ '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' })[extname(file)] || 'application/octet-stream' });
      res.end(req.method === 'HEAD' ? undefined : content);
    } catch (error) {
      if (error instanceof ValidationError) return json(400, { error: error.message });
      if (error.code === 'ENOENT' || error.code === 'EISDIR') return json(404, { error: 'No encontrado.' });
      if (error instanceof URIError) return json(400, { error: 'Ruta inválida.' });
      console.error('Error procesando la solicitud:', error.code || error.name);
      json(500, { error: 'No pudimos guardar la solicitud. Intenta de nuevo.' });
    }
  });
}
