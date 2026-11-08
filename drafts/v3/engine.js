  /* ---------- the film: one take behind the whole page, the scroll is the playhead ----------
     film/film.json (written by drafts/film/build-film.sh) lists the frames and where each shot starts.
     Pace: every section that carries data-film="<shot>" (or "<shot>@.5") is given exactly the scroll length its part of
       the film needs (R px per frame), so the camera moves at one steady speed from the first screen to the last.
     Smoothness: the playhead follows the scroll with a time-based ease (independent of the screen's refresh rate),
       and the two frames around it are blended, so 12 film frames per second read as continuous motion.
     Weight: frames load nearest-to-the-playhead first, only within a window around it, and are decoded off the main
       thread into ImageBitmaps just ahead of where the visitor is going. */
  var FILM = { R: 20, nightLen: 0 };
  (function film(){
    var root = document.documentElement, canvas = $('#film');
    if (REDUCE || !canvas || !window.fetch) return; // the poster stays behind the page
    // set before the scroll scenes are measured: the film layout (a taller hero) changes every position below it
    root.classList.add('has-film');
    fetch('film/film.json').then(function(r){ return r.json(); }).then(start).catch(function(){ root.classList.remove('has-film'); if (ST) ST.refresh(); });
    function start(M){
      var ctx = canvas.getContext('2d', { alpha: false }), N = M.n,
          portrait = innerWidth < 760 && innerHeight > innerWidth, fine = matchMedia('(pointer: fine)').matches,
          base = 'film/' + (portrait ? 'm' : 'd') + '/', imgs = new Array(N), asked = new Uint8Array(N), bmps = new Map(), decoding = {},
          cur = 0, target = 0, last = 0, drawn = '', inflight = 0, anchors = [], raf = 0, dir = 1,
          TAU = fine ? 70 : 120, MAXIN = portrait ? 4 : 6;
      function shotFrame(spec){ var p = String(spec).split('@'), s = M.shots[p[0]]; return s ? s[0] + Math.round((+p[1] || 0) * (s[1] - 1)) : null; }
      // one steady pace: each section's scroll length comes from the frames it covers
      function pace(){
        var R = FILM.R = Math.max(14, Math.min(26, innerHeight / (portrait ? 34 : 40)));
        var secs = [$('#top')].concat($$('section[data-film]')), f = secs.map(function(el, i){ return i ? shotFrame(el.dataset.film) : 0; });
        secs.forEach(function(el, i){
          if (i === secs.length - 1) return; // the last stretch runs to the end of the page
          var len = Math.round((f[i + 1] - f[i]) * R); if (!(len > 0)) return;
          if (el.id === 'night'){ FILM.nightLen = len; return; } // the pinned flood takes its length from the pin
          el.style.minHeight = len + 'px';
        });
        var g = $('#gate'), mk = g && $('.film-mark', g);
        if (mk){ var a = shotFrame(g.dataset.film), b = shotFrame(mk.dataset.film), c = shotFrame('S9'); mk.style.top = ((b - a) / (c - a) * 100).toFixed(2) + '%'; }
      }
      function size(){ var d = Math.min(portrait ? 2 : 1.5, devicePixelRatio || 1); canvas.width = Math.round(innerWidth * d); canvas.height = Math.round(innerHeight * d); drawn = ''; }
      // anchors: [scrollY, frame] pairs from the sections; the page end is the last frame
      function measure(){
        var maxY = Math.max(1, root.scrollHeight - innerHeight), list = [[0, 0]];
        $$('[data-film]').forEach(function(el){
          var shot = shotFrame(el.dataset.film); if (shot == null) return;
          var y = el.getBoundingClientRect().top + scrollY - innerHeight * .35;
          if (y > list[list.length - 1][0] && shot > list[list.length - 1][1]) list.push([Math.min(y, maxY - 1), shot]);
        });
        list.push([maxY, N - 1]); anchors = list; update();
      }
      function frameAt(y){
        for (var i = 1; i < anchors.length; i++) if (y <= anchors[i][0]){
          var a = anchors[i - 1], b = anchors[i]; return a[1] + (b[1] - a[1]) * (y - a[0]) / (b[0] - a[0]);
        }
        return N - 1;
      }
      function update(){ target = Math.max(0, Math.min(N - 1, frameAt(Math.max(0, scrollY)))); wake(); }
      // loading: every frame 60 ahead / 30 behind, every 6th up to 200 away; nearest first, a few at a time
      function pick(){
        var c = Math.round(target), best = -1;
        for (var d = 0; d <= 200 && best < 0; d++){
          var ahead = c + d, back = c - d;
          if (ahead < N && !asked[ahead] && (d < 60 || ahead % 6 === 0)) best = ahead;
          else if (back >= 0 && !asked[back] && (d < 30 || back % 6 === 0)) best = back;
        }
        return best;
      }
      function pump(){
        while (inflight < MAXIN){
          var i = pick(); if (i < 0) return;
          asked[i] = 1; inflight++;
          (function(i){
            var img = new Image(); img.decoding = 'async';
            img.onload = function(){ imgs[i] = img; inflight--; if (Math.abs(i - cur) < 3){ drawn = ''; wake(); } pump(); };
            img.onerror = function(){ inflight--; pump(); };
            img.src = base + ('000' + (i + 1)).slice(-4) + '.webp';
          })(i);
        }
      }
      // decoded bitmaps just ahead of the playhead (in the scroll direction), so drawing never waits on a decode
      function keep(c){
        var lo = Math.max(0, c - (dir < 0 ? 24 : 8)), hi = Math.min(N - 1, c + (dir > 0 ? 24 : 8));
        for (var i = lo; i <= hi; i++){
          if (!imgs[i] || bmps.has(i) || decoding[i] || !window.createImageBitmap) continue;
          decoding[i] = 1;
          (function(i){ createImageBitmap(imgs[i]).then(function(b){ delete decoding[i]; if (Math.abs(i - cur) > 40){ b.close(); return; } bmps.set(i, b); if (Math.abs(i - cur) < 2){ drawn = ''; wake(); } }).catch(function(){ delete decoding[i]; }); })(i);
        }
        bmps.forEach(function(b, k){ if (Math.abs(k - c) > 40){ b.close(); bmps.delete(k); } });
      }
      function nearest(i){ for (var d = 0; d < N; d++){ if (imgs[i - d]) return i - d; if (imgs[i + d]) return i + d; } return -1; }
      function blit(src, alpha){
        var w = src.width || src.naturalWidth, h = src.height || src.naturalHeight, cw = canvas.width, ch = canvas.height, s = Math.max(cw / w, ch / h);
        ctx.globalAlpha = alpha; ctx.drawImage(src, (cw - w * s) / 2, (ch - h * s) / 2, w * s, h * s); ctx.globalAlpha = 1;
      }
      // the frame under the playhead, with the next one blended in by the fraction between them
      function draw(){
        var i = Math.floor(cur), t = cur - i, a = nearest(i); if (a < 0) return;
        var b = a === i && t > .03 && imgs[i + 1] ? i + 1 : -1, q = b < 0 ? 0 : Math.round(t * 20) / 20, key = a + ':' + q;
        if (key === drawn) return; drawn = key;
        blit(bmps.get(a) || imgs[a], 1);
        if (b >= 0 && q > 0) blit(bmps.get(b) || imgs[b], q);
      }
      function tick(now){
        raf = 0; var dt = last ? Math.min(64, now - last) : 16; last = now;
        var step = (target - cur) * (1 - Math.exp(-dt / TAU));
        if (step) dir = step > 0 ? 1 : -1;
        cur += step; if (Math.abs(target - cur) < .005) cur = target;
        keep(Math.round(cur)); draw();
        if (cur !== target) wake(); else last = 0;
      }
      function wake(){ if (!raf) raf = requestAnimationFrame(tick); }
      pace(); size(); if (ST) ST.refresh(); measure(); cur = target;
      // the poster covers the first screen; frames start after the page's own load so they never compete with the headline
      if (document.readyState === 'complete') pump(); else addEventListener('load', pump);
      addEventListener('scroll', function(){ update(); pump(); }, { passive: true });
      var rz, w0 = innerWidth;
      addEventListener('resize', function(){ clearTimeout(rz); rz = setTimeout(function(){
        size(); if (innerWidth !== w0){ w0 = innerWidth; pace(); if (ST) ST.refresh(); } measure(); }, 150); });
      if (ST) ST.addEventListener('refresh', measure); // pins change the page length
      addEventListener('load', measure);
    }
  })();

