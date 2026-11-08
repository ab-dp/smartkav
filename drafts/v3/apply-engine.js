// Swaps the film engine in index.html for drafts/v3/engine.js and ties the #night pin to the film pace.
const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');
const a = s.indexOf('  /* ---------- the film: one take behind the whole page');
const b = s.indexOf('  /* ---------- nav: solid');
if (a < 0 || b < 0) throw new Error('engine bounds not found');
s = s.slice(0, a) + fs.readFileSync('drafts/v3/engine.js', 'utf8') + s.slice(b);
const pinFrom = "mm.add(DESK, function(){ ST.create({ trigger: '#night', start: 'top top', end: '+=140%',";
const pinTo = "mm.add(DESK, function(){ ST.create({ trigger: '#night', start: 'top top', end: function(){ return '+=' + Math.max(innerHeight * 1.2, FILM.nightLen - innerHeight); }, invalidateOnRefresh: true,";
if (s.includes(pinFrom)) s = s.replace(pinFrom, pinTo); else if (!s.includes('FILM.nightLen - innerHeight')) throw new Error('pin not found');
fs.writeFileSync('index.html', s);
console.log('engine applied');
