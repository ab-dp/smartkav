// Kobi, the final robot. One SVG, drawn by us: the head lives in the logo's circle like a porthole, and parts of him
// leave it for the page: the antenna and its signal, a waving hand, the Zzz when he dozes off.
// States are classes on the <svg>: is-idle, is-wave, is-type, is-love, is-sleep, is-wake, is-happy.
// Everything moves with transform/opacity only.
window.kobiRobot = (function () {
  var n = 0;
  var INK = '#0B0D11', P = '#12151B', P2 = '#1A1E26', FG = '#F3F1EC', AM = '#FFB000', HL = 'rgba(218,226,240,.24)';
  return function () {
    var id = 'kr' + (++n);
    return '' +
'<svg class="kobi-robot is-idle" viewBox="-30 -70 260 290" overflow="visible" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
'<defs><clipPath id="' + id + '"><circle cx="100" cy="100" r="86"/><rect x="-80" y="-120" width="360" height="220"/></clipPath></defs>' +
// the porthole: ink, the amber rim behind him
'<circle cx="100" cy="100" r="90" fill="#0E1116"/>' +
'<circle class="rim" cx="100" cy="100" r="90" fill="none" stroke="' + AM + '" stroke-width="5"/>' +
'<g clip-path="url(#' + id + ')"><g class="char">' +
  // body, with the logo on the chest
  '<rect x="58" y="152" width="84" height="74" rx="28" fill="' + P2 + '" stroke="' + HL + '" stroke-width="2"/>' +
  '<g class="chest"><line x1="82" y1="178" x2="100" y2="178" stroke="' + AM + '" stroke-width="4" stroke-linecap="round"/><circle cx="108" cy="178" r="6" fill="none" stroke="' + AM + '" stroke-width="3.5"/></g>' +
  // antenna: the logo again, a line rising into a circle; the signal leaves it as rings
  '<g class="ant"><line x1="100" y1="58" x2="100" y2="30" stroke="rgba(243,241,236,.55)" stroke-width="3"/>' +
  '<g class="waves"><circle class="w1" cx="100" cy="21" r="12" fill="none" stroke="' + AM + '" stroke-width="2.5"/><circle class="w2" cx="100" cy="21" r="12" fill="none" stroke="' + AM + '" stroke-width="2.5"/></g>' +
  '<circle cx="100" cy="21" r="9" fill="' + INK + '" stroke="' + AM + '" stroke-width="3.5"/><circle class="sig" cx="100" cy="21" r="3.5" fill="' + AM + '"/></g>' +
  // ears and head
  '<rect x="31" y="92" width="12" height="28" rx="6" fill="' + P2 + '" stroke="' + HL + '" stroke-width="2"/><rect x="157" y="92" width="12" height="28" rx="6" fill="' + P2 + '" stroke="' + HL + '" stroke-width="2"/>' +
  '<rect x="40" y="58" width="120" height="94" rx="36" fill="' + P + '" stroke="rgba(218,226,240,.32)" stroke-width="2.5"/>' +
  '<rect x="52" y="72" width="96" height="66" rx="26" fill="#07090C"/>' +
  // the face moves a little with the gaze, inside the screen: a hint of depth
  '<g class="face">' +
    '<g class="eyes"><rect x="73" y="90" width="15" height="25" rx="7.5" fill="' + FG + '"/><rect x="112" y="90" width="15" height="25" rx="7.5" fill="' + FG + '"/></g>' +
    '<g class="joy"><path d="M72 107 q8.5 -12 17 0 M111 107 q8.5 -12 17 0" fill="none" stroke="' + FG + '" stroke-width="4.5" stroke-linecap="round"/></g>' +
    '<g class="love"><path d="M80.5 113 l-8.5 -8.2 a4.9 4.9 0 0 1 8.5 -5.4 a4.9 4.9 0 0 1 8.5 5.4z M119.5 113 l-8.5 -8.2 a4.9 4.9 0 0 1 8.5 -5.4 a4.9 4.9 0 0 1 8.5 5.4z" fill="' + AM + '"/></g>' +
    '<g class="zz"><rect x="72" y="103" width="17" height="4.5" rx="2.25" fill="' + FG + '"/><rect x="111" y="103" width="17" height="4.5" rx="2.25" fill="' + FG + '"/></g>' +
    '<rect class="cheek" x="62" y="118" width="10" height="5" rx="2.5" fill="rgba(255,176,0,.45)"/><rect class="cheek" x="128" y="118" width="10" height="5" rx="2.5" fill="rgba(255,176,0,.45)"/>' +
    '<rect class="mouth" x="92" y="124" width="16" height="4" rx="2" fill="' + AM + '"/>' +
  '</g>' +
'</g></g>' +
// the front of the rim: the body stays inside, the head may lean out over the top
'<path d="M10 100 A90 90 0 0 0 190 100" fill="none" stroke="' + AM + '" stroke-width="5"/>' +
// out in the page: the waving hand over the rim, the Zzz, the sparks of joy
'<g class="hand"><path d="M150 176 Q186 158 194 112" fill="none" stroke="rgba(218,226,240,.45)" stroke-width="16" stroke-linecap="round"/><path d="M150 176 Q186 158 194 112" fill="none" stroke="#2A303B" stroke-width="12" stroke-linecap="round"/>' +
  '<circle cx="195" cy="102" r="15" fill="' + FG + '"/><rect x="186" y="113" width="18" height="5" rx="2.5" fill="' + AM + '"/></g>' +
'<g class="zzz" fill="' + FG + '" font-family="IBM Plex Sans Hebrew,system-ui,sans-serif" font-weight="500">' +
  '<text class="z1" x="150" y="40" font-size="20">z</text><text class="z2" x="166" y="18" font-size="26">z</text><text class="z3" x="186" y="-8" font-size="32">Z</text></g>' +
'<g class="sparks" stroke="' + AM + '" stroke-width="4" stroke-linecap="round">' +
  '<line class="s1" x1="20" y1="10" x2="8" y2="-2"/><line class="s2" x1="100" y1="-28" x2="100" y2="-44"/><line class="s3" x1="180" y1="10" x2="192" y2="-2"/>' +
  '<line class="s4" x1="0" y1="80" x2="-16" y2="78"/><line class="s5" x1="200" y1="80" x2="216" y2="78"/></g>' +
'</svg>';
  };
})();

// The behaviour, shared by the playground and the page: gaze, blinking, dozing off, waking up.
window.kobiLife = function (svg, opts) {
  opts = opts || {};
  var face = svg.querySelector('.face'), state = 'idle', sleepT, px = null, py = null, lastMove = Date.now(), sy = scrollY, sv = 0;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function set(s, ms, back) {
    svg.classList.remove('is-' + state); state = s; svg.classList.add('is-' + s);
    if (ms) setTimeout(function () { if (state === s) set(back || 'idle'); }, ms);
  }
  function wake() {
    lastMove = Date.now(); clearTimeout(sleepT);
    if (state === 'sleep' && !opts.manual) set('wake', 900);
    if (opts.manual) return;
    sleepT = setTimeout(function () { if (state === 'idle') set('sleep'); }, opts.sleepAfter || 20000);
  }
  addEventListener('pointermove', function (e) { px = e.clientX; py = e.clientY; wake(); }, { passive: true });
  addEventListener('scroll', function () { sv = scrollY - sy; sy = scrollY; wake(); }, { passive: true });
  wake();
  // the gaze: toward the pointer, or the way the page scrolls; on its own when nobody moves
  function aim() {
    if (!document.hidden && state !== 'sleep') {
      var r = svg.getBoundingClientRect(), cx = r.left + r.width * .5, cy = r.top + r.height * .55, dx = 0, dy = 0, t = Date.now() / 1000;
      if (px !== null && Date.now() - lastMove < 3000) { dx = px - cx; dy = py - cy; var m = Math.hypot(dx, dy) || 1, k = Math.min(1, m / 260); dx = dx / m * k; dy = dy / m * k; }
      else { var a = Math.floor(t / 1.8); dx = Math.cos(a * 2.4) * .8; dy = Math.sin(a * 1.7) * .5; }
      if (Math.abs(sv) > 2) { dy = Math.max(-1, Math.min(1, sv / 18)); sv *= .85; }
      face.style.transform = 'translate(' + (dx * 6).toFixed(1) + 'px,' + (dy * 5).toFixed(1) + 'px)';
    }
    requestAnimationFrame(aim);
  }
  if (!still) requestAnimationFrame(aim);
  return { set: set, get state() { return state; } };
};
