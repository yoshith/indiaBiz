'use strict';

const http = require('node:http');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const port = Number(process.env.PORT || 10000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT must be an integer from 1 to 65535.');
  process.exit(1);
}

// Explicit routes keep project files and configuration private. Load the small
// dashboard into memory at startup, so a missing deploy file fails immediately.
const assets = new Map();
for (const [file, type] of [
  ['index.html', 'text/html; charset=utf-8'],
  ['styles.css', 'text/css; charset=utf-8'],
  ['data.js', 'text/javascript; charset=utf-8'],
  ['app.js', 'text/javascript; charset=utf-8']
]) {
  try {
    assets.set('/' + file, { type, body: readFileSync(join(__dirname, 'dist', file)) });
  } catch (error) {
    console.error(`Cannot load dist/${file}. Upload the extracted dist folder beside package.json. (${error.code})`);
    process.exit(1);
  }
}
assets.set('/', assets.get('/index.html'));
assets.set('/healthz', {
  type: 'application/json; charset=utf-8',
  body: Buffer.from('{"status":"ok"}\n')
});

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
  'Cache-Control': 'no-cache'
};

const server = http.createServer((req, res) => {
  function send(status, type, body, extraHeaders = {}) {
    res.writeHead(status, {
      ...securityHeaders,
      'Content-Type': type,
      'Content-Length': Buffer.byteLength(body),
      ...extraHeaders
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(405, 'text/plain; charset=utf-8', 'Method not allowed\n', { Allow: 'GET, HEAD' });
    return;
  }

  let pathname;
  try {
    pathname = new URL(req.url, 'http://localhost').pathname;
  } catch {
    send(400, 'text/plain; charset=utf-8', 'Bad request\n');
    return;
  }

  const asset = assets.get(pathname);
  if (!asset) {
    send(404, 'text/plain; charset=utf-8', 'Not found\n');
    return;
  }
  send(200, asset.type, asset.body);
});

server.requestTimeout = 30_000;
server.headersTimeout = 10_000;
server.keepAliveTimeout = 5_000;
server.maxHeadersCount = 100;
server.on('error', (error) => {
  console.error(`Server failed: ${error.message}`);
  process.exit(1);
});
server.listen(port, '0.0.0.0', () => {
  console.log(`India Market Atlas listening on 0.0.0.0:${port}`);
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.once(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5_000).unref();
  });
}
