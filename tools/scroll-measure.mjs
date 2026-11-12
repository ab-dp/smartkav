// Unthrottled scroll measurement: a real (headed) Chrome with occlusion throttling off, driven over CDP.
// usage: node tools/scroll-measure.mjs <desk|mob|fling> [url]   (serve the page first: node tools/serve.mjs)
// desk = mouse wheel at 1440x900, mob = a steady finger drag at 390x844 with the CPU slowed 4x, fling = quick flicks.
// env: START=<scrollY> begins there, TRACE=1 prints the longest browser tasks. The probe is tools/scroll-probe.js.
// If the window gives no frames (minimised, screen locked) the run reports an error: run it again.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
const mode = process.argv[2] || 'desk', url = process.argv[3] || 'http://127.0.0.1:8092/', shots = process.argv[4] || '';
const PORT = 9333 + Math.floor(Math.random() * 200), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-chrome-'));
const mobile = mode === 'mob' || mode === 'fling';
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--remote-debugging-port=' + PORT, '--user-data-dir=' + dir, '--no-first-run', '--no-default-browser-check',
  '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--disable-features=CalculateNativeWinOcclusion',
  '--window-size=' + (mobile ? '500,1000' : '1500,1050'), '--window-position=20,20', 'about:blank'], { stdio: 'ignore' });
setTimeout(() => { console.log("GUARD timeout"); try { chrome.kill(); } catch (e) {} process.exit(1); }, (+process.env.GUARD||170000));
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws, id = 0, traceEv = [], traceDone = null; const wait = new Map();
async function connect(){
  for (let i = 0; i < 50; i++){ try { const l = await (await fetch('http://127.0.0.1:' + PORT + '/json/list')).json(); const p = l.find(t => t.type === 'page'); if (p){ ws = new WebSocket(p.webSocketDebuggerUrl); break; } } catch (e) {} await sleep(200); }
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.method === 'Tracing.dataCollected') traceEv.push(...d.params.value.filter(e => e.ph === 'X' && e.dur > 30000)); if (d.method === 'Tracing.tracingComplete') traceDone && traceDone(); if (d.id && wait.has(d.id)){ const [res, rej] = wait.get(d.id); wait.delete(d.id); d.error ? rej(new Error(d.error.message)) : res(d.result); } };
}
let lost = 0; const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; wait.set(i, [res, rej]); setTimeout(() => { if (wait.has(i)) { wait.delete(i); lost++; console.error("no answer: " + method); res({ result: {} }); } }, method.startsWith("Input.") ? 1500 : 20000); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => { const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400)); return r.result.value; };
const shot = async (name) => { if (!shots) return; const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 }); fs.writeFileSync(shots + name + '.jpg', Buffer.from(r.data, 'base64')); };
try {
  await connect(); console.error("connected");
  await send('Page.enable'); await send('Runtime.enable');
  if (mobile){
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await send('Emulation.setCPUThrottlingRate', { rate: 4 });
  } else await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url }); await sleep(mobile ? 6000 : 3500);
  await ev(`new Promise((res, rej) => { const s = document.createElement('script'); s.src = '/tools/scroll-probe.js?' + Date.now(); s.onload = () => res(1); s.onerror = () => rej(new Error('probe')); document.head.appendChild(s); })`);
  const info = await ev(`({ H: document.documentElement.scrollHeight, vh: innerHeight, iw: innerWidth, touch: !matchMedia('(pointer: fine)').matches, lenis: !!window.__skLenis, overflowX: document.documentElement.scrollWidth > innerWidth,
    pxPerFrame: window.__skFilm ? window.__skFilm().anchors.map(a => a.length > 2 ? +(1 / a[2]).toFixed(1) : 0) : [] })`);
  const maxY = info.H - info.vh; console.error('info', JSON.stringify(info));
  if (process.env.START){ await ev('(window.__skLenis ? window.__skLenis.scrollTo(' + process.env.START + ', { immediate: true, force: true }) : scrollTo(0, ' + process.env.START + '), 1)'); await sleep(2500); }
  if (process.env.TRACE) await send('Tracing.start', { transferMode: 'ReportEvents', categories: 'devtools.timeline,v8,blink,cc,gpu,loading' });
  await ev('window.__probe.start()');
  const t0 = Date.now(); let n = 0;
  if (mode === 'desk' || mode === 'pad'){
    const step = mode === 'desk' ? 100 : 14, gap = mode === 'desk' ? 110 : 16;
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 700, y: 450 });
    for (let sent = 0; sent < maxY / .85 + 400 && Date.now() - t0 < 120000; sent += step){ await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 450, deltaX: 0, deltaY: step }); await sleep(gap); if (shots && ++n % (mode === 'desk' ? 12 : 90) === 0) await shot('-' + String(n).padStart(4, '0')); }
  } else if (mode === 'mob'){
    // a finger dragging at a steady pace, lifting and re-gripping
    while (Date.now() - t0 < 150000){
      let y = 720; await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y }] });
      for (let d = 0; d < 560; d += 8){ y -= 8; await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y }] }); await sleep(10); }
      await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      if (shots && ++n % 2 === 0) await shot('-' + String(n).padStart(3, '0'));
      if (await ev('scrollY') >= maxY - 2) break;
    }
  } else {
    // quick flicks with momentum
    while (Date.now() - t0 < 150000){
      let y = 700; await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y }] });
      for (let d = 0; d < 360; d += 30){ y -= 30; await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y }] }); await sleep(8); }
      await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await sleep(900);
      if (await ev('scrollY') >= maxY - 2) break;
    }
  }
  console.error('scrolled'); await sleep(1800);
  if (process.env.TRACE){ const done = new Promise(r => traceDone = r); await send('Tracing.end'); await Promise.race([done, sleep(15000)]); const top = traceEv.sort((a, b) => b.dur - a.dur).slice(0, 25).map(e => Math.round(e.dur / 1000) + 'ms ' + e.cat.split(',')[0] + ':' + e.name + ' ts' + Math.round(e.ts / 1000 % 100000) + ' ' + JSON.stringify(e.args || {}).slice(0, 110)); console.error('TRACE'); top.forEach(t => console.error(t)); }
  const res = await ev('window.__probe.stop()');
  const worst = res.blocks.filter(b => b.min < .98 || b.max > 1.02 || b.wrong || b.jerk).map(b => `${b.n} min ${b.min} max ${b.max} wrong ${b.wrong} jerk ${b.jerk}`);
  res.blocks = res.blocks.length + ' text blocks, off 1:1: ' + (worst.length ? worst.join('; ') : 'none');
  res.lostCommands = lost; console.log(JSON.stringify({ mode, info, res }, null, 1));
} catch (e) { console.log('ERR', e.message); }
finally { try { ws && ws.close(); } catch (e) {} chrome.kill(); await sleep(500); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {} process.exit(0); }
