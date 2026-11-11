// render.mjs — renders the ad's graphics layer (comp.html) to transparent PNG frames, 24 per second.
// Usage: node render.mjs <base-url> <seconds> [out-dir]     e.g. node render.mjs http://127.0.0.1:8090 22
// Needs a static server on the repo root (tools/serve.mjs) and playwright-core (PLAYWRIGHT_CORE = its folder).
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const [base = 'http://127.0.0.1:8090', secs = '22', out = 'raw/gfx'] = process.argv.slice(2);
const N = Math.round(parseFloat(secs) * 24);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(base + '/drafts/ad/comp.html?r=' + Date.now(), { waitUntil: 'load' });
await page.evaluate(() => window.adReady);
for (let f = 0; f < N; f++) {
  await page.evaluate(t => window.renderAt(t), f / 24);
  await page.screenshot({ path: `${out}/f${String(f).padStart(4, '0')}.png`, omitBackground: true });
}
// stills on a dark backdrop, for a quick look (argument 4: comma-separated seconds)
if (process.argv[5]) {
  await page.evaluate(() => document.body.classList.add('preview'));
  for (const t of process.argv[5].split(',')) { await page.evaluate(t => window.renderAt(+t), t); await page.screenshot({ path: `${out}/../still-${t}.jpg`, type: 'jpeg', quality: 70 }); }
}
await browser.close();
console.log('rendered', N, 'frames');
