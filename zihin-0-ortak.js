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

/* KURAL (Tepki hızı tablosu, 2026-11-15): süre/hız isteyen bütün çalışmaların zamanları bu tek tablodan gelir. Her satır milisaniye (ya da saniye) cinsinden SÜREdir: küçük sayı = daha hızlı.
   1) Okul öncesi her düzeyde okul sonrasından daha yavaştır (pre[d] > post[d]).
   2) Her dönemde düzey arttıkça hız artar (pre ve post kesin azalan).
   3) Tempo çocukların eğlenebileceği, yetişebileceği bir hızdadır; yeni bir hızlı çalışma eklenirse süresi buraya yazılır, kodun içine sayı yazılmaz. */
const ZA_PACE = {
  "face-go":              { pre:[1800, 1600, 1400], post:[1300, 1100, 950] },   /* Yüzler Tek Tek: yanıt süresi */
  "anti-touch":           { pre:[2000, 1800, 1650], post:[1600, 1400, 1250] },  /* Ters Yöne Dokun */
  "context-go":           { pre:[2100, 1800, 1600], post:[1600, 1400, 1200] },  /* Bağlamlı Tepki */
  "distract":             { pre:[2200, 1900, 1700], post:[1700, 1400, 1200] },  /* Çeldiriciyi Yoksay */
  "navon":                { pre:[3000, 2600, 2400], post:[2400, 2000, 1800] },  /* Büyük Şekil mi, Küçük Şekil mi? */
  "rev-sort":             { pre:[2600, 2200, 2000], post:[2000, 1700, 1500] },  /* Tersine Sınıfla */
  "tap-reverse":          { pre:[3000, 2600, 2400], post:[2400, 2000, 1700] },  /* Ters Vuruş */
  "periph":               { pre:[1600, 1300, 1100], post:[1500, 1200, 1000] },  /* Kenardan Gelen: görünme süresi */
  "dual-task.hedef":      { pre:[1700, 1500, 1300], post:[1400, 1200, 1000] },  /* İki İş Birden: yıldızın ekranda kalma süresi */
  "dual-task.aralik":     { pre:[2400, 2200, 2000], post:[1900, 1700, 1500] },  /* İki İş Birden: iki yıldız arası */
  "stop-signal":          { pre:[2000, 1800, 1600], post:[1800, 1600, 1400] },  /* Dur İşareti: yanıt süresi */
  "vigilance":            { pre:[1400, 1250, 1100], post:[1100, 950, 850] },    /* Nadir Hedef: şekil başına süre */
  "pos-nback":            { pre:[2000, 1800, 1650], post:[1700, 1500, 1350] },  /* Konum N-Geri: kare başına süre */
  "dot-count":            { pre:[2800, 2200, 1700], post:[2200, 1700, 1300] },  /* Kaç Tane?: görünme süresi */
  "cups":                 { pre:[1200, 1000, 850],  post:[1000, 800, 650] },    /* Bardak Oyunu: yer değiştirme süresi */
  "pk-mole":              { pre:[1600, 1350, 1150], post:[1150, 950, 780] },    /* Köstebek Yakala: yukarıda kalma süresi */
  "pk-catch.dusus":       { pre:[3.4, 3.0, 2.6],    post:[2.8, 2.3, 1.9] },     /* Meyve Sepeti: düşme süresi (sn) */
  "pk-catch.aralik":      { pre:[1200, 1050, 950],  post:[1000, 850, 720] },
  "pk-balloon.yukselis":  { pre:[6.5, 5.5, 4.8],    post:[5.2, 4.4, 3.6] },     /* Balon Patlat: yükselme süresi (sn) */
  "pk-balloon.aralik":    { pre:[1100, 1000, 900],  post:[900, 800, 700] },
  "pk-escape":            { pre:[1300, 1100, 950],  post:[1000, 850, 700] },    /* Bul ve Kaç: bulut adımı */
  "pk-redlight":          { pre:[1000, 850, 700],   post:[800, 650, 500] },     /* Kırmızı Işık – Yeşil Işık: bırakma payı */
  "pk-drum.vurus":        { pre:[900, 820, 750],    post:[700, 620, 560] },     /* Ritim Davulu: vuruş aralığı */
  "pk-drum.pay":          { pre:[320, 280, 240],    post:[260, 220, 180] },     /* Ritim Davulu: zamanında sayılma payı */
  "pk-simon":             { pre:[800, 700, 650, 600], post:[650, 550, 450, 400] }, /* Renk Simon: yanma süresi */
  "nback.goster":         { pre:[2200, 1900, 1600], post:[1700, 1400, 1100] },   /* Hayvan / Taşıt / Sayı N-Geri: öğenin ekranda kalma süresi */
  "creature-count":       { pre:[1600, 1400, 1250], post:[1300, 1100, 950] },   /* Yaratık Sayma: her yaratığın / okun ekranda kalma süresi */
  "pk-light":             { pre:[900, 800, 700, 650], post:[750, 650, 550, 480] }  /* Deniz Feneri Işıkları: yanma süresi */
};
function zaPace(key){ const p = ZA_PACE[key]; if(!p) return 0; const A = (typeof isPre === "function" && isPre()) ? p.pre : p.post; let t = 0; try{ t = currentCombo().t | 0; }catch(e){} return A[Math.max(0, Math.min(A.length - 1, t))]; }
/* KURAL (Ardıl İşlemleme uyarlamaları, 2026-11-26; kullanıcı kararı): Ardıl İşlemleme alanındaki çalışmalar başka alanlardaki çalışmaların aynısı değildir — oyun mantığı aynı olabilir, içerik ve yönerge alana özeldir. Her uyarlama ayrı bir çalışmadır (ayrı ad, ayrı kayıt); motor tabloları (düzey, süre, aşama kilidi) taban çalışmanınkiyle ortaktır: arBase(id) uyarlamanın taban çalışmasını verir */
const AR_OF = { "ar-heard":"pic-seq-touch", "ar-corsi":"corsi", "ar-span":"digit-span", "ar-words":"word-order", "ar-route":"route-mem", "ar-tone":"tone-seq", "ar-porder":"pic-order", "ar-sent":"sent-listen", "ar-wmseq":"wm-seq", "ar-rhythm":"rhythm", "ar-dir":"dir-follow", "ar-rt":"rt-colors", "ar-move":"move-seq", "ar-simon":"pk-simon", "ar-seqw":"seq-words" };
const arBase = (id) => AR_OF[id] || id;
