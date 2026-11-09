/* Zihin Atölyesi — zihin-0-ortak.js (0/8): yükleme sırasında (çalışma tanımları ve veri listeleri kurulurken) çağrılan yardımcı fonksiyonlar. Tek dosyada fonksiyon kaldırması (hoisting) sayesinde her yerden görünüyorlardı; dosyalar bölününce ilk sıraya alındılar. */

function makeRandomSaccade(){
let last = -1, pos = {x:0.5, y:0.5}, prevIdx = -1;
return function(elapsedMs){
const i = Math.floor(elapsedMs / sacDwell());
if(elapsedMs < last - 50) prevIdx = -1;
last = elapsedMs;
if(i !== prevIdx){
let p, g = 0;
do{ p = { x: 0.1 + Math.random() * 0.8, y: 0.14 + Math.random() * 0.72 }; g++; }
while(g < 40 && Math.hypot(p.x - pos.x, p.y - pos.y) < 0.35);
pos = p; prevIdx = i;
}
return pos;
};
}

function makeJunctionWalker(){
const center = {x:0.5, y:0.5};
const corners = [{x:0.08,y:0.14},{x:0.92,y:0.14},{x:0.92,y:0.86},{x:0.08,y:0.86}];
let from = center;
let to = corners[Math.floor(Math.random()*4)];
let legStartMs = 0;
let lastSeen = -1;
return function(elapsedMs, legMs){
if(lastSeen < 0 || elapsedMs < lastSeen - 50){
from = center;
to = corners[Math.floor(Math.random()*4)];
legStartMs = elapsedMs;
}
lastSeen = elapsedMs;
let f = (elapsedMs - legStartMs) / legMs;
while(f >= 1){
legStartMs += legMs;
const arrivedAtCenter = (to === center);
from = to;
to = arrivedAtCenter ? corners[Math.floor(Math.random()*4)] : center;
f = (elapsedMs - legStartMs) / legMs;
}
return { x: from.x + (to.x-from.x)*f, y: from.y + (to.y-from.y)*f };
};
}

function makeCrossBoxWalker(){
const corners = [{x:0.1,y:0.16},{x:0.9,y:0.16},{x:0.9,y:0.84},{x:0.1,y:0.84}];
const center = {x:0.5,y:0.5};
const pinch = 0.07;
function pinchMid(a, b){
const m = {x:(a.x+b.x)/2, y:(a.y+b.y)/2};
const dx = center.x - m.x, dy = center.y - m.y;
const len = Math.hypot(dx,dy) || 1;
return { x: m.x + dx/len*pinch, y: m.y + dy/len*pinch };
}
function pathsFromCorner(i){
const next = (i+1)%4, prev = (i+3)%4, opp = (i+2)%4;
return [
[pinchMid(corners[i],corners[next]), corners[next]],
[pinchMid(corners[prev],corners[i]), corners[prev]],
[center, corners[opp]]
];
}
let cur = corners[0];
let cornerIdx = 0;
let queue = [];
let legStartMs = 0;
let lastSeen = -1;
function pickNewQueue(ms){
const options = pathsFromCorner(cornerIdx);
queue = options[Math.floor(Math.random()*options.length)].slice();
legStartMs = ms;
}
return function(elapsedMs, legMs){
if(lastSeen < 0 || elapsedMs < lastSeen - 50){
cur = corners[0]; cornerIdx = 0; pickNewQueue(elapsedMs);
}
lastSeen = elapsedMs;
let f = (elapsedMs - legStartMs) / legMs;
while(f >= 1 && queue.length){
cur = queue.shift();
legStartMs += legMs;
f = (elapsedMs - legStartMs) / legMs;
if(queue.length === 0){
let idx = -1;
for(let i=0;i<corners.length;i++){ if(corners[i].x===cur.x && corners[i].y===cur.y){ idx=i; break; } }
cornerIdx = idx !== -1 ? idx : 0;
pickNewQueue(legStartMs);
}
}
const target = queue[0];
const ff = Math.min(1, Math.max(0, f));
return { x: cur.x + (target.x-cur.x)*ff, y: cur.y + (target.y-cur.y)*ff };
};
}

/* 7. adım: yanlışlıkla silinen tanımlar geri alındı (başvuruları yorum/dize içinde "//" bulunan satırlarda kaldığı için gözden kaçmıştı) */
const FRUITS = ["apple","banana","grapes","strawberry","orange"];

const VEGETABLES = ["carrot","tomato","cucumber","pepper","broccoli"];

const GLYPH_STYLES = ["rotate","wave","depth","wide","tall","outline"];

const PRE_GLYPH_STYLES = ["rotate","wide","tall","outline"];

let peTriggers = [{shape:"triangle", color:"#0072B2"}];

const RHYME_TIPS = "Kelimenin başını değiştir, sonunu koru; uydurma kelime de olur.";
