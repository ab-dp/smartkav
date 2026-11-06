// שרת סטטי מקומי ל-SmartKav. בלי תלויות.
// הרצה: node tools/serve.mjs  (פורט ברירת מחדל 8080, אפשר: node tools/serve.mjs 3000)
// מאזין על כל הממשקים, כך שאפשר לפתוח גם מהטלפון באותה רשת Wi-Fi.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] || process.env.PORT || 8080);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml'
};

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  // לא מגישים קבצים מחוץ לתיקייה ולא קבצים מוסתרים (.git, .claude)
  if (!file.startsWith(ROOT) || p.split('/').some(s => s.startsWith('.'))) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('404'); }
    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const range = req.headers.range;
    // תמיכה ב-Range כדי שסרטונים ייטענו ויגללו כמו ב-GitHub Pages (ספארי דורש את זה)
    if (range) {
      const [s, e] = range.replace('bytes=', '').split('-');
      const start = Number(s), end = e ? Number(e) : st.size - 1;
      res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Cache-Control': 'no-cache' });
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' });
    fs.createReadStream(file).pipe(res);
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log(`\nSmartKav רץ מקומית:\n  במחשב:   http://localhost:${PORT}/`);
  for (const list of Object.values(os.networkInterfaces())) for (const a of list || [])
    if (a.family === 'IPv4' && !a.internal) console.log(`  בטלפון:   http://${a.address}:${PORT}/   (אותה רשת Wi-Fi)`);
  console.log('');
});
