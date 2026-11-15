// Kobi, three characters. Each lives in the circle like a porthole: the lower part is clipped by the circle,
// the upper part may lean out over the rim (the peek). Built only from the logo's parts: a line and a circle.
window.KOBI = (function(){
  var INK='#0B0D11', P='#12151B', P2='#1A1E26', FG='#F3F1EC', AM='#FFB000', HL='rgba(218,226,240,.22)';
  function wrap(id, body, extra){
    // viewBox leaves room above the circle for the lean-out
    return '<svg class="kobi k-'+id+'" viewBox="0 -40 200 240" overflow="visible" xmlns="http://www.w3.org/2000/svg">'
      + '<defs><clipPath id="cp-'+id+'-'+(++n)+'"><circle cx="100" cy="100" r="86"/><rect x="-60" y="-80" width="320" height="180"/></clipPath></defs>'
      + '<circle cx="100" cy="100" r="90" fill="#0E1116"/>'
      + '<circle cx="100" cy="100" r="90" fill="none" stroke="'+AM+'" stroke-width="5"/>'
      + '<g clip-path="url(#cp-'+id+'-'+n+')"><g class="char">'+body+'</g></g>'
      + '<path d="M10 100 A90 90 0 0 0 190 100" fill="none" stroke="'+AM+'" stroke-width="5"/>' // the front of the rim
      + (extra||'') + '</svg>';
  }
  var n=0;
  var robot = function(){ return wrap('a',
      '<rect x="58" y="152" width="84" height="70" rx="26" fill="'+P2+'" stroke="'+HL+'" stroke-width="2"/>'
    + '<line x1="82" y1="176" x2="100" y2="176" stroke="'+AM+'" stroke-width="4" stroke-linecap="round"/><circle cx="108" cy="176" r="6" fill="none" stroke="'+AM+'" stroke-width="3.5"/>'
    + '<line x1="100" y1="58" x2="100" y2="30" stroke="rgba(243,241,236,.55)" stroke-width="3"/>'
    + '<circle cx="100" cy="21" r="9" fill="'+INK+'" stroke="'+AM+'" stroke-width="3.5"/><circle class="sig" cx="100" cy="21" r="3.5" fill="'+AM+'"/>'
    + '<rect x="31" y="92" width="12" height="28" rx="6" fill="'+P2+'" stroke="'+HL+'" stroke-width="2"/><rect x="157" y="92" width="12" height="28" rx="6" fill="'+P2+'" stroke="'+HL+'" stroke-width="2"/>'
    + '<rect x="40" y="58" width="120" height="94" rx="36" fill="'+P+'" stroke="rgba(218,226,240,.3)" stroke-width="2.5"/>'
    + '<rect x="52" y="72" width="96" height="66" rx="26" fill="#07090C"/>'
    + '<g class="eyes"><rect x="73" y="90" width="15" height="25" rx="7.5" fill="'+FG+'"/><rect x="112" y="90" width="15" height="25" rx="7.5" fill="'+FG+'"/></g>'
    + '<g class="joy" opacity="0"><path d="M72 107 q8.5 -12.75 17 0" fill="none" stroke="'+FG+'" stroke-width="4.5" stroke-linecap="round"/><path d="M111 107 q8.5 -12.75 17 0" fill="none" stroke="'+FG+'" stroke-width="4.5" stroke-linecap="round"/></g>'
    + '<line class="mouth" x1="92" y1="126" x2="108" y2="126" stroke="'+AM+'" stroke-width="4" stroke-linecap="round"/>'); };
  var owl = function(){ return wrap('b',
      '<path d="M44 84 L38 34 L76 62Z M156 84 L162 34 L124 62Z" fill="'+P2+'" stroke="'+HL+'" stroke-width="2" stroke-linejoin="round"/>'
    + '<path d="M28 150 C28 82 58 54 100 54 C142 54 172 82 172 150 C172 214 28 214 28 150Z" fill="'+P2+'" stroke="'+HL+'" stroke-width="2"/>'
    + '<path d="M78 162 l11 7 l11 -7 l11 7 l11 -7 M84 178 l8 5 l8 -5 l8 5 l8 -5" fill="none" stroke="rgba(243,241,236,.22)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<circle cx="76" cy="102" r="29" fill="'+P+'"/><circle cx="124" cy="102" r="29" fill="'+P+'"/>'
    + '<line x1="30" y1="102" x2="58" y2="102" stroke="'+AM+'" stroke-width="5.5" stroke-linecap="round"/><line x1="142" y1="102" x2="170" y2="102" stroke="'+AM+'" stroke-width="5.5" stroke-linecap="round"/>'
    + '<circle cx="76" cy="102" r="17" fill="#07090C" stroke="'+AM+'" stroke-width="5.5"/><circle cx="124" cy="102" r="17" fill="#07090C" stroke="'+AM+'" stroke-width="5.5"/>'
    + '<g class="eyes"><circle class="pup" cx="76" cy="102" r="7" fill="'+FG+'"/><circle class="pup" cx="124" cy="102" r="7" fill="'+FG+'"/></g>'
    + '<g class="joy" opacity="0"><path d="M69 106 q7 -10.5 14 0" fill="none" stroke="'+FG+'" stroke-width="4.5" stroke-linecap="round"/><path d="M117 106 q7 -10.5 14 0" fill="none" stroke="'+FG+'" stroke-width="4.5" stroke-linecap="round"/></g>'
    + '<path d="M93 124 L107 124 L100 137Z" fill="'+AM+'" stroke="'+AM+'" stroke-width="2" stroke-linejoin="round"/>'); };
  var taxi = function(){ return wrap('c',
      '<path d="M-10 230 L-10 176 Q100 150 210 176 L210 230Z" fill="'+P2+'" stroke="'+HL+'" stroke-width="2"/>'
    + '<rect x="40" y="156" width="120" height="14" rx="7" fill="'+P+'" stroke="'+HL+'" stroke-width="2"/>'
    + '<path class="sign" d="M50 158 L61 72 Q63 56 79 56 L121 56 Q137 56 139 72 L150 158Z" fill="'+AM+'"/>'
    + '<line x1="84" y1="74" x2="102" y2="74" stroke="#14120D" stroke-width="4" stroke-linecap="round"/><circle cx="110" cy="74" r="6.5" fill="none" stroke="#14120D" stroke-width="3.5"/>'
    + '<g class="eyes"><rect x="78" y="94" width="13" height="22" rx="6.5" fill="#14120D"/><rect x="109" y="94" width="13" height="22" rx="6.5" fill="#14120D"/></g>'
    + '<g class="joy" opacity="0"><path d="M77 108 q7.5 -11.25 15 0" fill="none" stroke="#14120D" stroke-width="4.5" stroke-linecap="round"/><path d="M108 108 q7.5 -11.25 15 0" fill="none" stroke="#14120D" stroke-width="4.5" stroke-linecap="round"/></g>'
    + '<path class="mouth" d="M87 128 Q100 139 113 128" fill="none" stroke="#14120D" stroke-width="4" stroke-linecap="round"/>'
    + '<circle cx="70" cy="122" r="5" fill="#E89A00"/><circle cx="130" cy="122" r="5" fill="#E89A00"/>'); };

  // D · the dot: the logo comes alive. The circle has a face and rides in along its own line, bouncing.
  var dot = function(){ return wrap('d',
      '<line x1="10" y1="168" x2="190" y2="168" stroke="rgba(218,226,240,.16)" stroke-width="2" stroke-dasharray="6 8"/>'
    + '<line class="road" x1="24" y1="112" x2="66" y2="112" stroke="'+AM+'" stroke-width="10" stroke-linecap="round"/>'
    + '<g class="bob"><circle cx="114" cy="112" r="40" fill="#0E1116" stroke="'+AM+'" stroke-width="10"/>'
    + '<g class="eyes"><g class="look"><rect x="101" y="98" width="10" height="17" rx="5" fill="'+FG+'"/><rect x="119" y="98" width="10" height="17" rx="5" fill="'+FG+'"/></g></g>'
    + '<g class="joy" opacity="0"><path d="M100 108 q6 -8 12 0 M118 108 q6 -8 12 0" fill="none" stroke="'+FG+'" stroke-width="4" stroke-linecap="round"/></g>'
    + '<path d="M107 124 Q115 130 123 124" fill="none" stroke="'+FG+'" stroke-width="3.5" stroke-linecap="round"/></g>'); };
  // E · the eyes: nothing but a gaze. Two eyes that follow the visitor across the page; the logo's line is the brows.
  var eyes = function(){ return wrap('e',
      '<g class="eyes"><ellipse cx="72" cy="112" rx="24" ry="32" fill="'+FG+'"/><ellipse cx="128" cy="112" rx="24" ry="32" fill="'+FG+'"/>'
    + '<g class="look"><g class="scan"><circle cx="72" cy="116" r="12" fill="'+INK+'"/><circle cx="128" cy="116" r="12" fill="'+INK+'"/>'
    + '<circle cx="76" cy="111" r="3.5" fill="'+FG+'"/><circle cx="132" cy="111" r="3.5" fill="'+FG+'"/></g></g></g>'
    + '<g class="joy" opacity="0"><path d="M52 116 q20 -26 40 0 M108 116 q20 -26 40 0" fill="none" stroke="'+FG+'" stroke-width="7" stroke-linecap="round"/></g>'
    + '<line class="brow bl" x1="52" y1="66" x2="90" y2="66" stroke="'+AM+'" stroke-width="7" stroke-linecap="round"/>'
    + '<line class="brow br" x1="110" y1="66" x2="148" y2="66" stroke="'+AM+'" stroke-width="7" stroke-linecap="round"/>'); };
  // F · the dispatcher: a small round creature on the night shift, with a headset; the mic boom is the logo.
  var disp = function(){ return wrap('f',
      '<path d="M36 230 Q36 176 100 172 Q164 176 164 230Z" fill="'+P2+'" stroke="'+HL+'" stroke-width="2"/>'
    + '<line x1="88" y1="196" x2="104" y2="196" stroke="'+AM+'" stroke-width="4" stroke-linecap="round"/><circle cx="111" cy="196" r="5" fill="none" stroke="'+AM+'" stroke-width="3"/>'
    + '<circle cx="44" cy="96" r="13" fill="#2A303B"/><circle cx="156" cy="96" r="13" fill="#2A303B"/>'
    + '<circle cx="100" cy="112" r="60" fill="#2A303B" stroke="'+HL+'" stroke-width="2"/>'
    + '<path d="M44 108 A57 57 0 0 1 156 108" fill="none" stroke="rgba(243,241,236,.6)" stroke-width="7" stroke-linecap="round"/>'
    + '<rect x="32" y="96" width="20" height="34" rx="10" fill="'+P+'" stroke="'+AM+'" stroke-width="3"/><rect x="148" y="96" width="20" height="34" rx="10" fill="'+P+'" stroke="'+AM+'" stroke-width="3"/>'
    + '<g class="eyes"><circle cx="80" cy="108" r="14" fill="'+FG+'"/><circle cx="120" cy="108" r="14" fill="'+FG+'"/>'
    + '<g class="look"><circle cx="80" cy="110" r="6.5" fill="'+INK+'"/><circle cx="120" cy="110" r="6.5" fill="'+INK+'"/></g></g>'
    + '<g class="joy" opacity="0"><path d="M68 110 q12 -14 24 0 M108 110 q12 -14 24 0" fill="none" stroke="'+FG+'" stroke-width="5" stroke-linecap="round"/></g>'
    + '<circle cx="66" cy="130" r="6" fill="rgba(255,176,0,.35)"/><circle cx="134" cy="130" r="6" fill="rgba(255,176,0,.35)"/>'
    + '<ellipse class="talk" cx="100" cy="138" rx="9" ry="4.5" fill="'+INK+'"/>'
    + '<path d="M42 130 Q46 152 74 150" fill="none" stroke="'+AM+'" stroke-width="5" stroke-linecap="round"/>'
    + '<circle class="mic" cx="82" cy="150" r="6.5" fill="'+INK+'" stroke="'+AM+'" stroke-width="3.5"/>'); };
  return { a: robot, b: owl, c: taxi, d: dot, e: eyes, f: disp };
})();
