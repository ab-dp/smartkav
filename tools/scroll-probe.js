(function(){
  const blocks = () => Array.from(document.querySelectorAll('.hero-stick, .scene.hold > .wrap, .hold-b > .hb')).map((el, i) => ({ el, name: (el.closest('section') || {}).id + ':' + i }));
  const P = window.__probe = { rows: [], on: false, shifts: [], heights: [] };
  try { new PerformanceObserver(l => l.getEntries().forEach(e => { if (P.on && !e.hadRecentInput) P.shifts.push({ t: Math.round(e.startTime), v: +e.value.toFixed(4) }); })).observe({ type: 'layout-shift', buffered: false }); } catch (e) {}
  try { new PerformanceObserver(l => l.getEntries().forEach(e => { if (P.on) (P.long = P.long || []).push({ t: Math.round(e.startTime), d: Math.round(e.duration) }); })).observe({ type: 'longtask', buffered: false }); } catch (e) {}
  try { new PerformanceObserver(l => l.getEntries().forEach(e => { if (P.on && e.duration > 45) (P.loaf = P.loaf || []).push({ y: Math.round(scrollY), d: Math.round(e.duration), layout: Math.round(e.startTime + e.duration - e.styleAndLayoutStart), preRender: Math.round(e.renderStart - e.startTime), block: Math.round(e.blockingDuration), ui: e.firstUIEventTimestamp ? Math.round(e.firstUIEventTimestamp - e.startTime) : -1, scripts: e.scripts.map(s => Math.round(s.duration) + "ms " + (s.invoker || "").slice(0, 60) + " " + (s.sourceFunctionName || "") + "@" + (s.sourceURL || "").split("/").pop().slice(0, 30) + " forcedLayout=" + Math.round(s.forcedStyleAndLayoutDuration)) }); })).observe({ type: "long-animation-frame", buffered: false }); } catch (e) {}
  P.start = () => {
    P.rows = []; P.shifts = []; P.long = []; P.on = true; const B = blocks(); P.names = B.map(b => b.name);
    let last = 0;
    const tick = (now) => {
      if (!P.on) return;
      const f = window.__skFilm ? window.__skFilm() : null, vh = innerHeight;
      const tops = B.map(b => { const r = b.el.getBoundingClientRect(); return (r.bottom < -50 || r.top > vh + 50) ? null : +r.top.toFixed(1); });
      P.rows.push({ t: now, dt: last ? now - last : 0, y: scrollY, H: document.documentElement.scrollHeight, cur: f ? f.cur : 0, tg: f ? f.target : 0, have: f ? f.have : true, tops });
      last = now; requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  P.stop = () => {
    P.on = false; const R = P.rows, out = { frames: R.length, secs: R.length ? +((R[R.length - 1].t - R[0].t) / 1000).toFixed(1) : 0 };
    const dts = R.slice(1).map(r => r.dt).sort((a, b) => a - b);
    out.dt = { med: +dts[dts.length >> 1].toFixed(1), p95: +dts[Math.floor(dts.length * .95)].toFixed(1), max: +dts[dts.length - 1].toFixed(1), over34: dts.filter(d => d > 34).length, over50: dts.filter(d => d > 50).length };
    // scroll itself
    let back = 0, stall = 0, jump = [], vels = [];
    for (let i = 1; i < R.length; i++) { const d = R[i].y - R[i - 1].y, v = d / R[i].dt * 16.67; vels.push(v); if (d < -0.5) back++; if (Math.abs(d) < 0.05) stall++; }
    const sv = vels.slice().sort((a, b) => a - b);
    out.scroll = { back, stallFrames: stall, vMed: +sv[sv.length >> 1].toFixed(1), vP5: +sv[Math.floor(sv.length * .05)].toFixed(1), vP95: +sv[Math.floor(sv.length * .95)].toFixed(1), y0: R[0].y, y1: R[R.length - 1].y };
    // page height changes while scrolling
    out.heightChanges = []; for (let i = 1; i < R.length; i++) if (R[i].H !== R[i - 1].H) out.heightChanges.push({ y: Math.round(R[i].y), d: R[i].H - R[i - 1].H });
    // text blocks: screen speed relative to scroll speed, per block
    out.blocks = P.names.map((n, k) => {
      let wrong = 0, wrongMax = 0, minRatio = 9, maxRatio = -9, seen = 0, jerk = 0, prevRatio = null, maxStep = 0;
      for (let i = 1; i < R.length; i++) {
        const a = R[i - 1].tops[k], b = R[i].tops[k], ds = R[i].y - R[i - 1].y; if (a == null || b == null || Math.abs(ds) < 2) continue;
        if (R[i].dt > 40) continue; const ratio = -(b - a) / ds; seen++; // 1 = moves with the page, 0 = stands still, <0 = goes the wrong way
        if (ratio < -0.02) { wrong++; wrongMax = Math.min(wrongMax, ratio); }
        minRatio = Math.min(minRatio, ratio); maxRatio = Math.max(maxRatio, ratio);
        if (prevRatio != null) { const j = Math.abs(ratio - prevRatio); if (j > .25) jerk++; maxStep = Math.max(maxStep, j); }
        prevRatio = ratio;
      }
      return seen ? { n, seen, min: +minRatio.toFixed(2), max: +maxRatio.toFixed(2), wrong, jerk, maxStep: +maxStep.toFixed(2) } : null;
    }).filter(Boolean);
    // film
    let fBack = 0, fJump = 0, fMaxStep = 0, lag = 0, miss = 0, steps = [];
    for (let i = 1; i < R.length; i++) { if (R[i].dt > 40) continue; const d = R[i].cur - R[i - 1].cur; steps.push(d); if (d < -0.02) fBack++; if (Math.abs(d) > 1.5) fJump++; fMaxStep = Math.max(fMaxStep, Math.abs(d)); lag = Math.max(lag, Math.abs(R[i].tg - R[i].cur)); if (!R[i].have) miss++; }
    const ss = steps.slice().sort((a, b) => a - b);
    out.film = { back: fBack, jumps: fJump, maxStep: +fMaxStep.toFixed(2), stepMed: +ss[ss.length >> 1].toFixed(3), stepP5: +ss[Math.floor(ss.length * .05)].toFixed(3), stepP95: +ss[Math.floor(ss.length * .95)].toFixed(3), maxLag: +lag.toFixed(1), missingFrames: miss };
    out.hitches = R.filter(r => r.dt > 34 && r.dt < 400).map(r => Math.round(r.y) + ":" + Math.round(r.dt)).slice(0, 12); out.filmJumps = []; for (let i = 1; i < R.length; i++) if (R[i].dt <= 40 && Math.abs(R[i].cur - R[i-1].cur) > 1.5) out.filmJumps.push(Math.round(R[i].y) + ":" + (R[i].cur - R[i-1].cur).toFixed(1) + "/" + Math.round(R[i].y - R[i-1].y)); out.filmJumps = out.filmJumps.slice(0, 12); out.loaf = (P.loaf || []).slice(0, 8); out.throttled = R.filter(r => r.dt > 400).length; out.shifts = P.shifts.length; out.shiftSum = +P.shifts.reduce((a, s) => a + s.v, 0).toFixed(3); out.long = (P.long || []).length; out.longMax = Math.max(0, ...(P.long || []).map(l => l.d));
    return out;
  };
  P.trace=function(name,from,to){var k=P.names.indexOf(name),o=[];P.rows.forEach(function(r){if(r.y>=from&&r.y<=to)o.push([Math.round(r.y),r.tops[k],+r.cur.toFixed(2),Math.round(r.dt)]);});return o;};
})();