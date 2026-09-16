import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

export async function serveDocs() {
  const root = path.resolve('docs/.vuepress/dist');
  const failPaths = new Set();
  const failedRequests = [];
  const types = {'.js':'text/javascript', '.css':'text/css', '.html':'text/html',
    '.json':'application/json', '.jsonl':'application/x-ndjson', '.md':'text/plain',
    '.txt':'text/plain', '.svg':'image/svg+xml', '.png':'image/png', '.webmanifest':'application/manifest+json'};
  const server = http.createServer((request, response) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
    catch { response.writeHead(400).end(); return; }
    if (failPaths.has('*') || failPaths.has(pathname)) {
      failedRequests.push(pathname);
      response.writeHead(503).end('Offline test: download interrupted');
      return;
    }
    let file = path.resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
    if (!fs.existsSync(file) && fs.existsSync(file+'.html')) file += '.html';
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404).end(); return; }
    response.writeHead(200, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Content-Length': fs.statSync(file).size,
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  return {url:`http://127.0.0.1:${server.address().port}`, failPaths, failedRequests,
    close:() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); })};
}
