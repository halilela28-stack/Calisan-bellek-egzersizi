/* Zihin Atölyesi — zihin-1-tahtalar.js (1/8): tahta çizimleri, yerleşim (ZA_BOARD), konuşma (ZA_SPEECH), odak modu, sabitler. Dosyalar zihin-atolyesi.html'de bu sırayla yüklenir; sıra değiştirilemez (önceki tek dosyanın ardışık parçalarıdır). */

/* KURAL (renk erişilebilirliği): uyaran renkleri tek bir palettedir (ACC). Her renk çifti normal görmede ve kırmızı-yeşil (deutan, protan) ile mavi-sarı (tritan) renk körlüğünde ayırt edilir (CIEDE2000 ≥ 12, Machado 2009 benzetimi);
   yazı olarak kullanılan renkler beyaz zeminde ≥ 3:1 karşıtlıktadır (sarı yalnız dolgu/kart rengidir). Yeni bir uyaran rengi gerekirse buradan alınır. Doğru/yanlış geri bildiriminde renk tek başına kullanılmaz; ✓ / ✗ işareti de görünür. */
const ACC = { kirmizi:"#AD0003", turuncu:"#D97F12", sari:"#F4E434", yesil:"#0C6E4E", mavi:"#127CD9", mor:"#4B1F7A", pembe:"#BE3788" };
const COLORS = [ACC.kirmizi, ACC.pembe, ACC.mavi, ACC.yesil, ACC.turuncu];
const COLORS_BY_TIER = [
[COLORS[0], COLORS[2], COLORS[4]],
[COLORS[0], COLORS[1], COLORS[2], COLORS[4]],
COLORS
];
const NUMBERS_BY_TIER = [
[1,2,3],
[1,2,3,4,5,6],
[1,2,3,4,5,6,7,8,9]
];
const COLOR_NAMES = {[ACC.kirmizi]:"kırmızı",[ACC.pembe]:"pembe",[ACC.mavi]:"mavi",[ACC.yesil]:"yeşil",[ACC.turuncu]:"turuncu"};   /* adlar görünen renkle aynı: pembe, gerçek kırmızı */

const TIERS = [
{label:"Başlangıç", rows:4, cols:4, eyeDurationMs:25000, eyeSpeedMs:4500, studyDurationMs:8000},
{label:"Orta Düzey", rows:5, cols:4, eyeDurationMs:25000, eyeSpeedMs:2500, studyDurationMs:12000},
{label:"Zor Düzey", rows:5, cols:5, eyeDurationMs:25000, eyeSpeedMs:1800, studyDurationMs:16000},
{label:"Usta", rows:5, cols:5, eyeDurationMs:25000, eyeSpeedMs:1500, studyDurationMs:16000},
];
const tierMax = (ex) => ex && ex.maxTier === 3 ? 3 : 2;

function randomItem(arr){
if(isPre()){
if(arr === SHAPES) arr = PRE_SHAPES;
else if(arr === COLORS) arr = PRE_COLORS;
}
return arr[Math.floor(Math.random()*arr.length)];
}
function randomInt(min, max){ return min + Math.floor(Math.random()*(max-min+1)); }

const SHAPES = ["star","heart","rect","triangle","circle"];
const SHAPES_BY_TIER = [
["circle","triangle","rect"],
["circle","triangle","rect","star"],
SHAPES
];
const SHAPE_COLORS_BY_TIER = [
[COLORS[0], COLORS[2], COLORS[4]],
[COLORS[0], COLORS[2], COLORS[4], COLORS[1]],
COLORS
];

/* PRE_RATIO: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
const PRE_GRID_DIMS = [ {rows:3, cols:3}, {rows:3, cols:4}, {rows:3, cols:5} ];
const PRE_SHAPES = ["circle","triangle","rect"];
const PRE_COLORS = [COLORS[0], COLORS[2], COLORS[3]];
const PRE_SHAPES_BY_TIER = [ ["circle","triangle"], PRE_SHAPES, PRE_SHAPES ];
const PRE_SHAPE_COLORS_BY_TIER = [ [COLORS[0], COLORS[2]], PRE_COLORS, PRE_COLORS ];
const PRE_NUMBERS_BY_TIER = [ [1,2], [1,2,3,4], [1,2,3,4,5] ];
const PRE_NUMBER_COLORS_BY_TIER = [ [COLORS[0], COLORS[2]], PRE_COLORS, PRE_COLORS ];
function isPre(){ try{ return appMode === "cocuk" || readingLevel === "pre"; }catch(e){ return false; } }
const SCATTER_FONTS = [
'"Trebuchet MS", Verdana, sans-serif',
'Georgia, "Times New Roman", serif',
'"Courier New", Courier, monospace',
'"Comic Sans MS", "Marker Felt", "Chalkboard SE", cursive',
'Impact, "Arial Narrow", "Helvetica Neue", sans-serif'
];
const PRE_SCATTER_FONTS = [SCATTER_FONTS[0], SCATTER_FONTS[1], SCATTER_FONTS[3]];
const TURKISH_LETTERS = ["A","B","C","Ç","D","E","F","G","Ğ","H","I","İ","J"];
function scatterCount(){ const t = currentTier(); return t.rows * t.cols; }
/* GLYPH_STYLES: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
/* PRE_GLYPH_STYLES: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
function darkerColor(hex, k){
const m = /^#([0-9a-f]{6})$/i.exec(hex || ""); if(!m) return "rgba(0,0,0,0.45)";
const n = parseInt(m[1],16), f = c => Math.round(c*k);
return `rgb(${f(n>>16&255)},${f(n>>8&255)},${f(n&255)})`;
}
/* assignGlyphStyles: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
function seqItemHTML(item){
const esc = String(item.text);
if(!item.style){
return `<div class="number-cell seq-cell"><span class="seq-glyph">${esc}</span></div>`;
}
const chars = Array.from(esc);
const inner = item.style === "wave" ? chars.map(c => `<span>${c}</span>`).join("") : esc;
const vars = [`--gc:${item.color}`, `--gd:${darkerColor(item.color, 0.55)}`];
if(item.rot) vars.push(`--rot:${item.rot}deg`);
const font = item.font ? `font-family:${item.font.replace(/"/g,"&quot;")};` : "";
return `<div class="number-cell seq-cell seq-mixed gs-${item.style}" style="color:${item.color};${vars.join(";")};${font}">`
+ `<span class="seq-glyph${chars.length === 1 ? " single" : ""}">${inner}</span></div>`;
}
function shuffleArray(a){ const b = a.slice(); for(let i=b.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [b[i],b[j]] = [b[j],b[i]]; } return b; }
function numberLetterSequence(n, letterFirst){
const firstCount = Math.floor(n/2), secondCount = Math.floor(n/2), seq = [];   /* tam çiftler: 1-A … 12-İ */
for(let i=0;i<firstCount;i++){
const num = String(i+1), let_ = TURKISH_LETTERS[i];
seq.push(letterFirst ? let_ : num);
if(i < secondCount) seq.push(letterFirst ? num : let_);
}
return seq;
}
function trNumSuffix(n, kind){
const last = {1:["e","den"],2:["ye","den"],3:["e","ten"],4:["e","ten"],5:["e","ten"],6:["ya","dan"],7:["ye","den"],8:["e","den"],9:["a","dan"]};
const tens = {10:["a","dan"],20:["ye","den"],30:["a","dan"],40:["a","tan"],50:["ye","den"],60:["a","tan"],70:["e","ten"],80:["e","den"],90:["a","dan"]};
const pair = (n % 10 === 0) ? (tens[n] || ["a","dan"]) : (last[n % 10] || ["e","den"]);
return `${n}'${kind === "dat" ? pair[0] : pair[1]}`;
}

const SHAPE_NAMES = {star:"yıldız", heart:"kalp", rect:"dikdörtgen", triangle:"üçgen", circle:"daire"};

function shapeSVG(shape, color){
const c = color;
switch(shape){
case "star":
return `<svg viewBox="0 0 100 100"><polygon points="50,4 61,37 96,37 68,58 79,92 50,71 21,92 32,58 4,37 39,37" fill="${c}"/></svg>`;
case "heart":
return `<svg viewBox="0 0 100 100"><path d="M50 88 C20 65 5 45 5 28 C5 10 20 2 32 2 C42 2 48 8 50 14 C52 8 58 2 68 2 C80 2 95 10 95 28 C95 45 80 65 50 88 Z" fill="${c}"/></svg>`;
case "rect":
return `<svg viewBox="0 0 100 100"><rect x="10" y="24" width="80" height="52" rx="6" fill="${c}"/></svg>`;
case "square": return `<svg viewBox="0 0 100 100"><rect x="12" y="12" width="76" height="76" rx="8" fill="${c}"/></svg>`; case "triangle":
return `<svg viewBox="0 0 100 100"><polygon points="50,6 96,92 4,92" fill="${c}"/></svg>`;
case "circle":
return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="${c}"/></svg>`;
}
}

function numberHTML(number, color){
return `<div class="number-cell" style="color:${color}">${number}</div>`;
}



const TASTE_NAMES = {watermelon:"karpuz", lemon:"limon", chili:"biber", pasta:"makarna", candy:"lolipop", simit:"simit"};
const TASTE_OF = {watermelon:"tatlı", lemon:"ekşi", chili:"acı", pasta:"tuzlu", candy:"tatlı", simit:"tuzlu"};
const TASTE_ALL = ["candy","lemon","chili","simit"];   // renkleri birbirinden çok farklı: pembe, sarı, kırmızı, kahverengi
const TASTE_COUNT_BY_TIER = [2, 3, 4];
const PRE_TASTE_COUNT_BY_TIER = [2, 2, 3];
let tasteActivePool = null;
let tasteLastKey = "";
function tasteWantedCount(){
const table = isPre() ? PRE_TASTE_COUNT_BY_TIER : TASTE_COUNT_BY_TIER;
return table[currentCombo().t] || table[table.length-1];
}
function tasteAll(){ const alt = { candy:"watermelon", simit:"pasta" }; return TASTE_ALL.map(k => (TASTE_IMAGES[k] ? k : (alt[k] && TASTE_IMAGES[alt[k]] ? alt[k] : null))).filter(Boolean); }   /* resim dosyası eskiyse aynı tattaki eski resim */
function pickTastePool(){
const ALL = tasteAll(), n = Math.min(tasteWantedCount(), ALL.length);
let pool, key, tries = 0;
do{
pool = ALL.slice();
for(let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
pool = pool.slice(0, n);
key = pool.slice().sort().join("|");
tries++;
} while(n < ALL.length && key === tasteLastKey && tries < 8);   // Karıştır'da mümkünse aynı takımı tekrar seçme
tasteLastKey = key;
tasteActivePool = pool;
}


const HOTCOLD_NAMES = {snowman:"kardan adam", penguin:"penguen", icecream:"dondurma", ice:"buz", snowpile:"kar", soup:"çorba", iron:"ütü", sun:"güneş", fire:"ateş"};
const HOTCOLD_OF = {snowman:"soğuk", penguin:"soğuk", icecream:"soğuk", ice:"soğuk", snowpile:"soğuk", soup:"sıcak", iron:"sıcak", sun:"sıcak", fire:"sıcak"};
const HOTCOLD_COLD = ["snowman","penguin","icecream","ice","snowpile"];
const HOTCOLD_HOT = ["soup","iron","sun","fire"];
const HOTCOLD_COUNT_BY_TIER = [4, 6, 8];
const PRE_HOTCOLD_COUNT_BY_TIER = [2, 4, 5];
let hotColdPool = null;
let hotColdLastKey = "";
function hotColdWantedCount(){
const table = isPre() ? PRE_HOTCOLD_COUNT_BY_TIER : HOTCOLD_COUNT_BY_TIER;
return table[currentCombo().t] || table[table.length-1];
}
function pickHotColdPool(){
const n = hotColdWantedCount();
let pool, key, tries = 0;
do{
const coldN = n % 2 ? (Math.random() < 0.5 ? Math.ceil(n/2) : Math.floor(n/2)) : n/2;
pool = shuffleArray(HOTCOLD_COLD).slice(0, coldN).concat(shuffleArray(HOTCOLD_HOT).slice(0, n - coldN));
key = pool.slice().sort().join("|");
tries++;
} while(n < 8 && key === hotColdLastKey && tries < 8);
hotColdLastKey = key;
hotColdPool = pool;
}

/* Kelime Sıralama / Kelime Tekrarı havuzları: okul öncesi kısa ve somut, okul sonrası 2–3 heceli; bir turda aynı kelime tekrar etmez (döngü) */
const AUD_WORDS_PRE = ["top","ev","kedi","elma","araba","balık","kuş","çiçek","ayı","süt","şapka","kalem","ay","masa","kapı","bardak","ağaç","bulut","ekmek","saat","kaşık","yıldız","tren","çanta","köpek","at","inek","kuzu","ördek","tavuk","fil","muz","armut","çilek","üzüm","havuç","domates","peynir","yumurta","su","çay","bal","yatak","koltuk","lamba","tarak","sabun","havlu","terlik","çorap","ceket","eldiven","bebek","bisiklet","uçak","gemi","otobüs","güneş","yağmur","kar"];
const AUD_WORDS_POST = ["kaplumbağa","zürafa","kelebek","karınca","sincap","kirpi","papağan","penguen","yunus","yengeç","salatalık","portakal","mandalina","karpuz","kiraz","fındık","ceviz","makarna","çorba","börek","sandalye","dolap","perde","halı","yastık","battaniye","mutfak","merdiven","pencere","bahçe","kütüphane","hastane","postane","sinema","orman","deniz","nehir","dağ","köprü","kamyon","helikopter","bisiklet","tramvay","öğretmen","doktor","itfaiyeci","terzi","berber","gitar","piyano","keman","defter","silgi","makas","cetvel","boya","harita","şemsiye","gözlük","anahtar"];
const AUD_WORDS = AUD_WORDS_PRE;
let audWordCycle = null, audWordCycleLvl = null;
function audNextWords(n, used){ const lvl = isPre() ? "pre" : "post"; if(!audWordCycle || audWordCycleLvl !== lvl) { audWordCycle = mkCycle(lvl === "pre" ? AUD_WORDS_PRE : AUD_WORDS_POST); audWordCycleLvl = lvl; } const w = []; let g = 0; while(w.length < n && g++ < 400){ const x = audWordCycle(); if(!w.includes(x) && !(used && used.has(x) && g < 200)) w.push(x); } if(used) w.forEach(x => used.add(x)); return w; }
const AUD_SIZE_WORDS = [["karınca",1],["fare",2],["kedi",3],["koyun",4],["at",5],["fil",6],["balina",7]];
const AUD_LEN_BY_TIER = [3, 4, 5];   // okul sonrası: okul öncesinden bir adım uzun
const PRE_AUD_LEN_BY_TIER = [2, 3, 4];
const AUD_DELAY_MS = 4000;
function audLen(){ const tb = isPre() ? PRE_AUD_LEN_BY_TIER : AUD_LEN_BY_TIER; return tb[currentCombo().t] || tb[tb.length-1]; }
function audTrialCount(){ return isPre() ? 3 : 5; }
function makeAudTrials(kind){ const n = audLen(), trials = [], usedWords = new Set(); let prevKey = "";
for(let i=0;i<audTrialCount();i++){
let words, key, g = 0;
do{
if(kind === "size"){
words = shuffleArray(AUD_SIZE_WORDS).slice(0, n);
} else {
words = audNextWords(n, usedWords).map(w => [w, 0]);
}
key = words.map(w => w[0]).join("|"); g++;
} while(key === prevKey && g < 10);
prevKey = key;
trials.push({ words: words.map(w => w[0]), ranks: words.map(w => w[1]) });
}
return trials;
}
function audAnswer(trial, mode){
if(mode === "reverse") return trial.words.slice().reverse();
if(mode === "size") return trial.words.map((w,i)=>[w, trial.ranks[i]]).sort((a,b)=>a[1]-b[1]).map(x=>x[0]);
return trial.words.slice();
}
let audTimers = [];
function clearAudTimers(){ audTimers.forEach(t => clearInterval(t)); audTimers = []; }
function renderAuditoryBoard(){
const ex = currentExercise();
const stage = ex.stages[currentStageIndex];
const board = document.getElementById("board");
clearAudTimers();
board.style.display = "block";
board.style.minHeight = "";
board.style.padding = landscapeMQ.matches ? "8px 10px" : "14px";
board.style.gridTemplateColumns = "";
board.style.gridTemplateRows = "";
board.classList.remove("wide-grid");
if(ex.audRender){ board.innerHTML = ex.audRender(currentGrid); return; }
const mode = stage.answerMode || "same";
const withDelay = !!stage.delay;
const note = withDelay
? "Diziyi okuyun, ardından ⏱ düğmesine basın. Düğme “Söyle!” olunca çocuk söylesin."
: "Her diziyi tek tek, saniyede bir kelime hızında sesli okuyun; bitince çocuk söylesin.";
board.innerHTML = `<div class="aud-list"><div class="aud-note">${note} Yanlış söylenen dizileri hata sayısına ekleyin.</div>` +
currentGrid.map((tr, i) => {
const ans = audAnswer(tr, mode);
const key = mode === "same" ? "" : `<div class="aud-key">Doğru cevap: <b>${ans.join(" – ")}</b></div>`;
const btn = withDelay ? `<button class="aud-delay" data-i="${i}">⏱ ${AUD_DELAY_MS/1000} sn</button>` : "";
return `<div class="aud-row" data-row="${i}"><div class="aud-num">${i+1}</div>` +
`<div class="aud-body"><div class="aud-words">${tr.words.join(" – ")}</div>${key}</div>${btn}</div>`;
}).join("") + `</div>`;
board.querySelectorAll(".aud-delay").forEach(btn => {
btn.addEventListener("click", () => {
if(btn.classList.contains("counting")) return;
const row = btn.closest(".aud-row");
let left = AUD_DELAY_MS/1000;
btn.classList.remove("go");
btn.classList.add("counting");
btn.textContent = `${left}…`;
const t = setInterval(() => {
left--;
if(left > 0){ btn.textContent = `${left}…`; return; }
clearInterval(t);
btn.classList.remove("counting");
btn.classList.add("go");
btn.textContent = "Söyle!";
if(row) row.classList.add("done");
try{ beep(700, 900, 180, 0.15); }catch(e){}
try{ vibrate(60); }catch(e){}
}, 1000);
audTimers.push(t);
});
});
}


const LIVING_NAMES = {dog:"köpek", fish:"balık", rabbit:"tavşan", tree:"ağaç", parrot:"papağan", ball:"top", car:"araba", apple:"elma", chair:"sandalye", bag:"çanta"};
const LIVING_OF = {dog:"canlı", fish:"canlı", rabbit:"canlı", tree:"canlı", parrot:"canlı", ball:"cansız", car:"cansız", apple:"cansız", chair:"cansız", bag:"cansız"};
const LIVING_YES = ["dog","fish","rabbit","tree","parrot"];
const LIVING_NO = ["ball","car","apple","chair","bag"];
const LIVING_COUNT_BY_TIER = [4, 6, 8];
const PRE_LIVING_COUNT_BY_TIER = [2, 4, 5];
let livingPool = null;
let livingLastKey = "";
function livingWantedCount(){
const table = isPre() ? PRE_LIVING_COUNT_BY_TIER : LIVING_COUNT_BY_TIER;
return table[currentCombo().t] || table[table.length-1];
}
function pickLivingPool(){
const n = livingWantedCount();
let pool, key, tries = 0;
do{
const yesN = n % 2 ? (Math.random() < 0.5 ? Math.ceil(n/2) : Math.floor(n/2)) : n/2;
pool = shuffleArray(LIVING_YES).slice(0, yesN).concat(shuffleArray(LIVING_NO).slice(0, n - yesN));
key = pool.slice().sort().join("|");
tries++;
} while(key === livingLastKey && tries < 8);
livingLastKey = key;
livingPool = pool;
}

const CRT_MOVES = [
{ color:"#1F2A33", name:"siyah",   emoji:"", move:"buruna dokun" },
{ color:ACC.mavi, name:"mavi",    emoji:"", move:"dil çıkar" },
{ color:ACC.yesil, name:"yeşil",   emoji:"", move:"alkış yap" },
{ color:ACC.turuncu, name:"turuncu", emoji:"", move:"bay bay yap" },
{ color:ACC.pembe, name:"pembe",     emoji:"", move:"göz kırp" }
];
const CRT_COUNT_BY_TIER = [3, 4, 5];
const PRE_CRT_COUNT_BY_TIER = [2, 2, 3];
let crtMoves = CRT_MOVES.slice();
function shuffleCrtMapping(){
const last = crtMoves.map(m => m.color).join("|");
let cols, g = 0;
do{ cols = shuffleArray(CRT_MOVES.map(m => ({color:m.color, name:m.name}))); g++; }
while(g < 20 && cols.map(c => c.color).join("|") === last);
crtMoves = CRT_MOVES.map((m, i) => Object.assign({}, m, {color: cols[i].color, name: cols[i].name}));
}
let crtPool = null;
let crtLastKey = "";
function crtWantedCount(){
const table = isPre() ? PRE_CRT_COUNT_BY_TIER : CRT_COUNT_BY_TIER;
return table[currentCombo().t] || table[table.length-1];
}
function pickCrtPool(){
shuffleCrtMapping();
const n = crtWantedCount();
let pool, key, tries = 0;
do{
pool = shuffleArray(crtMoves).slice(0, n);
key = pool.map(m => m.color).sort().join("|"); tries++;
} while(n < crtMoves.length && key === crtLastKey && tries < 8);
crtLastKey = key;
crtPool = pool;
}
function crtMoveOf(color){ return crtMoves.find(m => m.color === color); }
function crtLegendHTML(){
const pool = (crtPool && crtPool.length === crtWantedCount()) ? crtPool : crtMoves.slice(0, crtWantedCount());
return `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">` +
crtMoves.filter(m => pool.some(p => p.color === m.color)).map(m =>
`<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid var(--line);border-radius:999px;background:var(--bg);font-weight:700;">` +
`<span style="width:18px;height:18px;border-radius:50%;background:${m.color};display:inline-block;"></span>` +
`${m.name} → ${m.move}</span>`).join("") + `</div>`;
}


const OS_SEQUENCES = [
["egg","chick","hen"],
["seed","sprout","sunflower"],
["caterpillar","cocoon","butterfly"],
["frogspawn","tadpole","frog"],
["apple","applebite","applecore"],
["seed","sprout","tree"],
["baby","kid","adult"], ["wheat","flour","breadloaf"], ["snowpile","snowman2","snowmelt"], ["milk","yogurt","cheese"], ["batter","cakebaked","cakeslice"]
];
/* OS_NAMES: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
const OS_ROWS_BY_TIER = [5, 6, 7];
const OS_DISTRACT_BY_TIER = [2, 3, 4];
const PRE_OS_ROWS_BY_TIER = [2, 3, 3];
const PRE_OS_DISTRACT_BY_TIER = [1, 2, 3];
function osConf(){
const t = currentCombo().t;
const R = isPre() ? PRE_OS_ROWS_BY_TIER : OS_ROWS_BY_TIER;
const D = isPre() ? PRE_OS_DISTRACT_BY_TIER : OS_DISTRACT_BY_TIER;
return { rows: R[t] ?? R[R.length-1], distract: D[t] ?? D[D.length-1] };
}
let osProg = [], osProgGrid = null;
function handleOsTap(ev){ const cell = ev.target.closest && ev.target.closest("[data-osr]"); if(!cell) return; try{ if(!currentExercise().isSeqRows) return; }catch(e){ return; }
if(!timerRunning){ showLevelFlash("Önce Başlat'a basın", "down"); return; }
const ri = Number(cell.dataset.osr), c = cell.dataset.osc, r = currentGrid[ri]; if(!r) return; const got = osProg[ri] || (osProg[ri] = []); if(got.length >= 2 || got.includes(c)) return;
const want = got.length === 0 ? r.second : r.third;
if(c === want){ got.push(c); window.__osFresh = ri + ":" + c; try{ gameSfx("pop"); }catch(e){} renderOsBoard();
  if(osProg.every(x => x.length >= 2)) setTimeout(() => { if(timerRunning){ const b = document.getElementById("timerBtn"); if(b) b.click(); } }, 450); }
else { setErrorCount(currentErrorCount + 1); try{ gameSfx("wrong"); vibrate(40); }catch(e){} cell.classList.add("bad"); setTimeout(() => cell.classList.remove("bad"), 450); } }
document.addEventListener("click", (ev) => { if(zaFastSeen(ev)) return; handleOsTap(ev); });
function makeOsRows(){
const {rows, distract} = osConf();
const seqs = []; const used = new Set(); for(const q of shuffleArray(OS_SEQUENCES)){ const key = q[0] + ">" + q[1]; if(used.has(key)) continue; used.add(key); seqs.push(q); if(seqs.length >= rows) break; }
return seqs.map(seq => {
const others = shuffleArray([...new Set(OS_SEQUENCES.filter(q => q !== seq && q[0] !== seq[0]).flat())].filter(x => !seq.includes(x))).slice(0, distract);   // aynı başlangıçlı dizilerin resimleri şaşırtıcı olmasın (iki doğru cevap)
let choices, g = 0;
do{
choices = shuffleArray([seq[1], seq[2], ...others]);
g++;
} while(g < 10 && choices[0] === seq[1] && choices[1] === seq[2]);
return { start: seq[0], second: seq[1], third: seq[2], choices };
});
}
function osImgSrc(k){ try{ return OS_IMAGES[k] || (typeof LIVING_IMAGES !== "undefined" && LIVING_IMAGES[k]) || (typeof OBJECT_IMAGES !== "undefined" && OBJECT_IMAGES[k]) || ""; }catch(e){ return ""; } }
function renderOsBoard(){ try{
const board = document.getElementById("board");
board.style.display = "block";
board.style.minHeight = "";
board.style.padding = "8px 12px";
board.style.gridTemplateColumns = "";
board.style.gridTemplateRows = "";
board.classList.remove("wide-grid");
const n = currentGrid.length ? currentGrid[0].choices.length + 1 : 1;
let maxW = Math.min(150, Math.floor(1100 / n));
if(landscapeMQ.matches && currentGrid.length){
const avail = (board.clientHeight || window.innerHeight * 0.6) - 16;
maxW = Math.max(30, Math.min(maxW, Math.floor(avail / currentGrid.length) - 12));
}
if(osProgGrid !== currentGrid){ osProgGrid = currentGrid; osProg = currentGrid.map(() => []); }
board.innerHTML = `<div class="os-list">` + currentGrid.map((r, ri) =>
`<div class="os-row" style="grid-template-columns:repeat(${n}, minmax(0, ${maxW}px));justify-content:center;column-gap:${n > 6 ? 6 : 12}px;">` +
`<div class="os-cell os-start"><img src="${osImgSrc(r.start)}" alt=""></div>` +
r.choices.map(c => { const k = (osProg[ri] || []).indexOf(c); return `<div class="os-cell os-tap${k >= 0 ? " ok" : ""}${k >= 0 && window.__osFresh === ri + ":" + c ? " fresh" : ""}" data-osr="${ri}" data-osc="${c}"><img src="${osImgSrc(c)}" alt="">${k >= 0 ? `<b class="os-n">${k + 1}</b>` : ""}</div>`; }).join("") +
`</div>`).join("") + `</div>`;
}finally{ try{ zaTapRestore(); }catch(e){} } }

window.addEventListener("resize", () => {
clearTimeout(window._osResizeT);
window._osResizeT = setTimeout(() => { try{ if(currentExercise().isSeqRows) renderOsBoard(); }catch(e){} }, 150);
});


const SDMT_PAIRS = [
{ shape:"circle",   img:"cup",      name:"fincan" },
{ shape:"triangle", img:"scissors", name:"makas" },
{ shape:"square",   img:"clock",    name:"saat" },
{ shape:"star",     img:"lamp",     name:"lamba" },
{ shape:"heart",    img:"bucket",   name:"kova" }
];
const SDMT_COUNT_BY_TIER = [3, 4, 5];
const PRE_SDMT_COUNT_BY_TIER = [2, 2, 3];
const SDMT_INK = "#1F2A33";
const SDMT_SHAPE_ORDER = ["circle","triangle","square","star","heart"];
let sdmtPairs = SDMT_PAIRS.slice();
function shuffleSdmtMapping(){
const last = sdmtPairs.map(p => p.shape).join("|");
let shapes, g = 0;
do{ shapes = shuffleArray(SDMT_PAIRS.map(p => p.shape)); g++; } while(g < 20 && shapes.join("|") === last);
sdmtPairs = SDMT_PAIRS.map((p, i) => Object.assign({}, p, {shape: shapes[i]}));
}
let sdmtPool = null;
let sdmtLastKey = "";
function sdmtShapeSVG(shape){
const c = SDMT_INK;
switch(shape){
case "circle":   return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="${c}"/></svg>`;
case "triangle": return `<svg viewBox="0 0 100 100"><polygon points="50,8 94,90 6,90" fill="${c}"/></svg>`;
case "square":   return `<svg viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="4" fill="${c}"/></svg>`;
case "star":     return `<svg viewBox="0 0 100 100"><polygon points="50,4 61,37 96,37 68,58 79,92 50,71 21,92 32,58 4,37 39,37" fill="${c}"/></svg>`;
case "heart":    return `<svg viewBox="0 0 100 100"><path d="M50 88 C20 65 5 45 5 28 C5 10 20 2 32 2 C42 2 48 8 50 14 C52 8 58 2 68 2 C80 2 95 10 95 28 C95 45 80 65 50 88 Z" fill="${c}"/></svg>`;
}
return "";
}
function sdmtImgSrc(key){ return HOUSE_IMAGES[key] || LIVING_IMAGES[key]; }
function sdmtWantedCount(){
const table = isPre() ? PRE_SDMT_COUNT_BY_TIER : SDMT_COUNT_BY_TIER;
return table[currentCombo().t] || table[table.length-1];
}
function pickSdmtPool(){
shuffleSdmtMapping();
const n = sdmtWantedCount();
let pool, key, tries = 0;
do{
pool = shuffleArray(sdmtPairs).slice(0, n);
key = pool.map(p => p.shape + p.img).sort().join("|"); tries++;
} while(n < sdmtPairs.length && key === sdmtLastKey && tries < 8);
sdmtLastKey = key;
sdmtPool = pool;
}
function sdmtPairOf(shape){ return sdmtPairs.find(p => p.shape === shape); }
function renderSdmtKey(){
const el = document.getElementById("sdmtKey");
if(!el) return;
const ex = currentExercise();
if(!ex.isSdmt){ el.classList.remove("show"); el.innerHTML = ""; return; }
const pool = (sdmtPool && sdmtPool.length === sdmtWantedCount()) ? sdmtPool : sdmtPairs.slice(0, sdmtWantedCount());
const shown = sdmtPairs.filter(p => pool.some(q => q.shape === p.shape))
.sort((a, b) => SDMT_SHAPE_ORDER.indexOf(a.shape) - SDMT_SHAPE_ORDER.indexOf(b.shape));
el.innerHTML = `<div class="sdmt-key-box">` + shown.map(p =>
`<div class="sdmt-pair"><div>${sdmtShapeSVG(p.shape)}</div><div><img src="${sdmtImgSrc(p.img)}" alt=""></div></div>`).join("") + `</div>`;
el.classList.add("show");
}


/* Eşini Hatırla'nın çift resimleri de bu havuzda kullanılır (aynı fotoğraf stili) */
/* Resim dosyaları arkada yüklenir (bkz. HTML yükleyici). Yükleme bitince çalışır; resimler zaten hazırsa hemen. */
/* Yeni resim sözlüklerine güvenli erişim: dosya eski/eksikse boş nesne döner, sayfa patlamaz */
function NI(n){ try{ const o = eval("NEW_IMAGES_" + n); return o || {}; }catch(e){ return {}; } }
function afterImagesLoaded(){ /* resimler gelince çift havuzunu birleştir; eksik bir sabit varsa yalnızca o anahtar atlanır */
  const pick = (fn) => { try{ return fn(); }catch(e){ return undefined; } };
  const add = { spoon: pick(() => PAL_EXTRA_IMAGES.spoon), bowl: pick(() => PAL_EXTRA_IMAGES.bowl), sock: pick(() => PAL_EXTRA_IMAGES.sock), slipper: pick(() => PAL_EXTRA_IMAGES.slipper), bee: pick(() => PAL_EXTRA_IMAGES.bee), honey: pick(() => PAL_EXTRA_IMAGES.honey), paldog: pick(() => PAL_EXTRA_IMAGES.dog), bone: pick(() => PAL_EXTRA_IMAGES.bone), scissors: pick(() => HOUSE_IMAGES.scissors), broom: pick(() => HOUSE_IMAGES.broom), bucket: pick(() => HOUSE_IMAGES.bucket), cup: pick(() => HOUSE_IMAGES.cup), paper: pick(() => NI(1).paper), dustpan: pick(() => NI(1).dustpan), shovel: pick(() => NI(1).shovel), paintbrush: pick(() => NI(1).paintbrush), paint: pick(() => NI(1).paint), straw: pick(() => NI(1).straw), notebook: pick(() => NI(1).notebook) };
  try{ Object.keys(add).forEach(k => { if(add[k]) PAIR_IMAGES[k] = add[k]; }); }catch(e){}
  try{ if(typeof HOTCOLD_IMAGES !== "undefined" && typeof OS_IMAGES !== "undefined" && OS_IMAGES.snowpile && !HOTCOLD_IMAGES.snowpile) HOTCOLD_IMAGES.snowpile = OS_IMAGES.snowpile; }catch(e){}   /* Sıcak–Soğuk havuzunda kar yığını (resim OS setinden) */
window.__imgReady = true; /* eksik dosya olsa da uygulama kilitlenmez; eksikler uyarıyla bildirilir */ const miss = (window.__imgMissing || []).slice(); ["PAIR_IMAGES","PAL_EXTRA_IMAGES","NEW_IMAGES_5"].forEach(n => { try{ if(eval("typeof " + n) === "undefined" && !miss.length) miss.push(n); }catch(e){} }); if(miss.length){ try{ const el = document.getElementById("imgWarn"); if(el){ el.style.display = "block"; const dg = window.__imgDiag || {}; const dgTxt = Object.keys(dg).map(f => f + ": sunucudan gelen " + dg[f].kb + " KB, sözlükler: " + dg[f].consts).join(" · "); el.textContent = "Resim dosyası eski: " + miss.join(", ") + ". Önbellek temizlendi ve sayfa yenilendi; sorun sürüyorsa GitHub'daki bu dosya eski demektir: son teslimdeki " + [...new Set(miss.map(x => String(x).split(" ")[0]))].join(", ") + " dosyasını yeniden yükleyin." + (dgTxt ? " [" + dgTxt + "]" : ""); } }catch(e){} } }
if(typeof PAIR_IMAGES !== "undefined" && typeof NI(1) !== "undefined") afterImagesLoaded();
let __imgWaiters = [];
function imagesReady(){ return !!window.__imgReady; }
function imgWait(cb){ if(imagesReady()){ cb(); return; } __imgWaiters.push(cb); const ov = document.getElementById("imgOverlay"); if(ov){ ov.style.display = "flex"; } }
window.__onImagesLoaded = function(){ try{ afterImagesLoaded(); }catch(e){} const ov = document.getElementById("imgOverlay"); if(ov) ov.style.display = "none"; const w = __imgWaiters; __imgWaiters = []; w.forEach(f => { try{ f(); }catch(e){} }); };

const PAIR_SETS_PRE = [["door","key"],["foot","shoe"],["tooth","toothbrush"],["cloud","umbrella"],["flower","wateringcan"],["spoon","bowl"],["sock","slipper"],["paldog","bone"],["cup","straw"],["bucket","shovel"]];
const PAIR_SETS_POST = [["nail","hammer"],["screw","screwdriver"],["pencil","sharpener"],["phone","charger"],["spoon","bowl"],["sock","slipper"],["bee","honey"],["scissors","paper"],["broom","dustpan"],["bucket","shovel"],["paintbrush","paint"],["cup","straw"]];   /* mektup–zarf çıkarıldı (artık yaygın değil) */
const PAIR_BLOCKED = new Set([ "cloud-wateringcan", "sock-shoe", "foot-slipper", "flower-honey", "spoon-honey", "paldog-slipper", "paldog-shoe", "pencil-paper", "paintbrush-paper", "bucket-paint", "bucket-dustpan", "spoon-straw", "cup-honey" ]);   /* "o da birlikte kullanılır" denebilecek karışımlar yanlış seçenek olarak gösterilmez */
const PAIR_COUNT_BY_TIER = [4, 5, 6]; const PRE_PAIR_COUNT_BY_TIER = [2, 3, 4];
const PAIR_DIMS_POST = [{rows:5, cols:3}, {rows:6, cols:3}, {rows:7, cols:3}];   /* 15 → 18 → 21 */
const PAIR_DIMS_PRE = [{rows:3, cols:3}, {rows:4, cols:3}, {rows:5, cols:3}];
let pairPool = null;
let pairLastKey = "";
function pairWantedCount(){
const table = isPre() ? PRE_PAIR_COUNT_BY_TIER : PAIR_COUNT_BY_TIER;
return table[currentCombo().t] || table[table.length-1];
}
function pickPairPool(){
const __avail = (p) => !!(PAIR_IMAGES[p[0]] && PAIR_IMAGES[p[1]]); const sets = (isPre() ? PAIR_SETS_PRE : PAIR_SETS_POST).filter(__avail); /* resmi olmayan çift havuza girmez */
const n = pairWantedCount();
let pool, key, tries = 0;
while(true){
pool = shuffleArray(sets).slice(0, n);
key = pool.map(p => p[0]).sort().join("|"); tries++;
if(tries >= 30) break;
let falseOpts = 0;
pool.forEach((a, ai) => pool.forEach((b, bi) => { if(ai !== bi && !PAIR_BLOCKED.has(a[0] + "-" + b[1])) falseOpts++; }));
if(falseOpts < 2) continue;
if(n < sets.length && key === pairLastKey) continue;
break;
}
pairLastKey = key;
pairPool = pool;
}
function makePairItem(forceTruth){ if(!pairPool || pairPool.length !== pairWantedCount()) pickPairPool();
  let truth = (typeof forceTruth === "boolean") ? forceTruth : Math.random() < 0.5; let i = Math.floor(Math.random() * pairPool.length); let j = i;
  /* dengeli seçim: tahtada en az kullanılan doğru çift / yanlış birleşim öncelikli (aynı birleşim üst üste yığılmasın) */
  const used = pairUseCount || (pairUseCount = {}); const pick = (cands, keyOf) => { const mn = Math.min(...cands.map(c => used[keyOf(c)] || 0)); return randomItem(cands.filter(c => (used[keyOf(c)] || 0) === mn)); };
  if(truth){ i = pick(pairPool.map((_, k) => k), k => pairPool[k][0] + "-" + pairPool[k][1]); j = i; }
  else { const opts = []; pairPool.forEach((a, ai) => pairPool.forEach((b, bi) => { if(ai !== bi && !PAIR_BLOCKED.has(a[0] + "-" + b[1])) opts.push([ai, bi]); })); if(opts.length){ [i, j] = pick(opts, c => pairPool[c[0]][0] + "-" + pairPool[c[1]][1]); } else { i = 0; j = 1 % pairPool.length; } }
  used[pairPool[i][0] + "-" + pairPool[j][1]] = (used[pairPool[i][0] + "-" + pairPool[j][1]] || 0) + 1;
  const left = pairPool[i][0], right = pairPool[j][1];
return { key: left + "-" + right, left, right, ok: truth };
}

let pairUseCount = null;
function makePairGrid(n){ pickPairPool(); pairUseCount = {};
let truths, g = 0;
do{
const half = n % 2 ? (Math.random() < 0.5 ? Math.ceil(n/2) : Math.floor(n/2)) : n/2;
truths = shuffleArray(Array.from({length:n}, (_, i) => i < half));
let run = 1, okRun = true;
for(let i = 1; i < n; i++){ run = truths[i] === truths[i-1] ? run + 1 : 1; if(run > 3){ okRun = false; break; } }
if(okRun) break;
g++;
} while(g < 500);
const items = [];
truths.forEach((t, i) => {
let it, k = 0;
do{ it = makePairItem(t); k++; } while(i > 0 && it.key === items[i-1].key && k < 30);
items.push(it);
});
return items;
}

function pickDifferent(pool, last){
if(pool.length < 2) return pool[0];
let v, g = 0;
do{ v = pool[Math.floor(Math.random()*pool.length)]; g++; } while(v === last && g < 30);
return v;
}
function trUpper(t){ return String(t).toLocaleUpperCase("tr-TR"); }

/* makeTargetGrid: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */


const FACE_NAMES = {happy:"mutlu", surprised:"şaşkın", sleepy:"uykulu", sad:"üzgün", angry:"kızgın"};
const FACE_KEYS = ["happy","surprised","sleepy","sad","angry"];
const FACE_COUNT_BY_TIER = [3, 4, 5];
const PRE_FACE_COUNT_BY_TIER = [3, 3, 3];
let goNoGoStops = ["angry"];
function pickGoNoGoStops(){
if(stIx() === 1){
const a = pickDifferent(FACE_KEYS, goNoGoStops[0]);
const b = pickDifferent(FACE_KEYS.filter(f => f !== a), null);
goNoGoStops = [a, b];
} else {
goNoGoStops = [pickDifferent(FACE_KEYS, goNoGoStops[0])];
}
return goNoGoStops;
}
function stopFaceText(){ return goNoGoStops.map(f => trUpper(FACE_NAMES[f])).join(" ya da "); }
function makeFaceGoGrid(n, stops){
const table = isPre() ? PRE_FACE_COUNT_BY_TIER : FACE_COUNT_BY_TIER;
const k = table[currentCombo().t] || table[table.length-1];
const others = shuffleArray(FACE_KEYS.filter(f => !stops.includes(f))).slice(0, Math.max(2, k - stops.length));
const tCount = Math.max(1, Math.round(n * 0.25));
let flags, g = 0;
do{
flags = shuffleArray(Array.from({length:n}, (_, i) => i < tCount));
let ok = flags[0] === false;   // ilk öge hep "söyle" olsun; tepki önce otomatikleşsin
for(let i = 1; ok && i < n; i++) if(flags[i] && flags[i-1]) ok = false;
if(ok) break;
g++;
} while(g < 500);
const items = [];
let si = Math.floor(Math.random() * stops.length);
flags.forEach((isStop, i) => {
let face;
if(isStop){ face = stops[si % stops.length]; si++; }
else {
let c = 0;
do{ face = others[Math.floor(Math.random()*others.length)]; c++; }
while(c < 30 && others.length > 1 && items[i-1] && items[i-1].face === face);
}
items.push({ face });
});
return items;
}


const VEHICLE_NAMES = {bus:"otobüs", plane:"uçak", ship:"gemi", heli:"helikopter", fire:"itfaiye", train:"tren"};
const VEHICLE_KEYS = ["bus","plane","ship","heli","fire","train"];
const VEHICLE_COUNT_BY_TIER = [3, 4, 5];
const PRE_VEHICLE_COUNT_BY_TIER = [2, 2, 3];
let switchSide = "front";
function makeVehicleSwitchGrid(n){
switchSide = pickDifferent(["front","back"], switchSide);
const table = isPre() ? PRE_VEHICLE_COUNT_BY_TIER : VEHICLE_COUNT_BY_TIER;
const k = table[currentCombo().t] || table[table.length-1];
const pool = shuffleArray(VEHICLE_KEYS).slice(0, k);
const tCount = Math.max(1, Math.round(n * 0.35));
let flags, g = 0;
do{
flags = shuffleArray(Array.from({length:n}, (_, i) => i < tCount));
let run = 0, ok = true;
for(const f of flags){ run = f ? run + 1 : 0; if(run > 2){ ok = false; break; } }
if(ok) break;
g++;
} while(g < 500);
const items = [];
flags.forEach((isTarget, i) => {
const back = switchSide === "back" ? isTarget : !isTarget;
let v, c = 0;
do{ v = pool[Math.floor(Math.random()*pool.length)]; c++; }
while(c < 30 && items[i-1] && items[i-1].v === v && items[i-1].back === back);
items.push({ v, back, target: isTarget, cell: v + (back ? "_b" : "_f") });
});
return items;
}


const FLK_NAMES = {apple:"elma", banana:"muz", orange:"portakal", grapes:"üzüm", strawberry:"çilek",
dog:"köpek", cat:"kedi", cow:"inek", rabbit:"tavşan", elephant:"fil",
cap:"şapka", tshirt:"tişört", jeans:"pantolon", sneakers:"ayakkabı", socks:"çorap"};
const FLK_CATS = [["apple","banana","orange","grapes","strawberry"],["dog","cat","cow","rabbit","elephant"],["cap","tshirt","jeans","sneakers","socks"]];
const FLK_DIGITS = ["1","2","3","4","5","6","7","8","9"];
const FLK_SIMILAR = {"1":["7","4"], "2":["5","7"], "3":["8","5"], "4":["1","9"], "5":["6","3","2"],
"6":["9","5","8"], "7":["1","2"], "8":["3","6","9"], "9":["6","8","4"]};
const FLK_GROUPS_BY_TIER = [10, 14, 18];   /* çalışmaya özel kural: telefonda 5 / 7 / 9 satır (satır başına 2 çerçeve) */
const PRE_FLK_GROUPS_BY_TIER = [4, 6, 8];
function flkCatOf(k){ return FLK_CATS.findIndex(c => c.includes(k)); }
function flkPickFlanker(target, t){
if(isPre()){
const ci = flkCatOf(target);
let pool;
if(t === 0) pool = FLK_CATS.filter((_, i) => i !== ci).flat();
else if(t === 2) pool = FLK_CATS[ci].filter(k => k !== target);
else pool = FLK_CATS.flat().filter(k => k !== target);
return randomItem(pool);
}
const sim = FLK_SIMILAR[target] || [];
let pool;
if(t === 0) pool = FLK_DIGITS.filter(d => d !== target && !sim.includes(d));
else if(t === 2) pool = sim.length ? sim : FLK_DIGITS.filter(d => d !== target);
else pool = FLK_DIGITS.filter(d => d !== target);
return randomItem(pool);
}
function makeFlankerGroups(){
const t = currentCombo().t;
const table = isPre() ? PRE_FLK_GROUPS_BY_TIER : FLK_GROUPS_BY_TIER;
const n = table[t] || table[table.length-1];
const all = isPre() ? FLK_CATS.flat() : FLK_DIGITS;
const congN = stIx() === 1 ? Math.max(1, Math.round(n / 3)) : 0;
let flags;
do{ flags = shuffleArray(Array.from({length:n}, (_, i) => i < congN)); } while(congN && flags[0] && n > 1);
const groups = [];
flags.forEach((cong, i) => {
let target, fl, g = 0;
do{
target = randomItem(all);
fl = cong ? target : flkPickFlanker(target, t);
g++;
} while(g < 60 && groups[i-1] && (groups[i-1].target === target || groups[i-1].flanker === fl));
groups.push({ target, flanker: fl, congruent: cong, items: [fl, fl, target, fl, fl] });
});
return groups;
}
function renderFlankerBoard(){
const board = document.getElementById("board");
board.style.display = "block";
board.style.minHeight = "";
board.style.padding = landscapeMQ.matches ? "8px 10px" : "12px";
board.style.gridTemplateColumns = "";
board.style.gridTemplateRows = "";
board.classList.remove("wide-grid");
const n = currentGrid.length;
const isLs = landscapeMQ.matches;
const colsOfGroups = isLs ? (n > 8 ? 3 : (n > 2 ? 2 : 1)) : (n > 1 ? 2 : 1);
const rowsOfGroups = Math.ceil(n / colsOfGroups);
const bw = (board.clientWidth || 360) - (isLs ? 20 : 24);
let cell = Math.min(isLs ? 60 : 70 * tabletScale(), Math.floor((bw / colsOfGroups - (isLs ? 20 : 18)) / 5));
if(isLs){
const avail = (board.clientHeight || window.innerHeight * 0.6) - 16;
cell = Math.max(26, Math.min(cell, Math.floor(avail / rowsOfGroups) - 22));
}
const fs = Math.round(cell * 0.72);
board.innerHTML = `<div class="flk-list" style="grid-template-columns:repeat(${colsOfGroups}, ${cell * 5 + 16}px);">` +
currentGrid.map(gr => `<div class="flk-group">` + gr.items.map(it => `<div class="flk-cell" style="width:${cell}px;">` +
(isPre() ? `<img src="${FLK_IMAGES[it]}" alt="">` : `<span class="flk-num" style="font-size:${fs}px;">${it}</span>`) +
`</div>`).join("") + `</div>`).join("") + `</div>`;
}
window.addEventListener("resize", () => {
clearTimeout(window._flkResizeT);
window._flkResizeT = setTimeout(() => { try{ if(currentExercise().isFlanker) renderFlankerBoard(); }catch(e){} }, 150);
});

/* peTriggers: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
/* pickPeTriggers: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
/* peName: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
/* peMatch: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */

let ptTimes = [15];
function pickPtTimes(){
if(stIx() === 1){
const a = pickDifferent([10, 15, 20], ptTimes[0]);
ptTimes = [a, a + 15];
} else {
ptTimes = [pickDifferent([10, 15, 20, 25], ptTimes[0])];
}
}
const PD_TASKS_1 = ["bana 3 tane hayvan ismi söyleyeceksin", "bana 3 tane meyve ismi söyleyeceksin", "bana 3 tane renk ismi söyleyeceksin",
"ellerini 3 kez çırpacaksın", "bana bir taşıt ismi söyleyeceksin"];
const PD_TASKS_2 = ["bana bugünün hangi gün olduğunu söyleyeceksin", "bana en sevdiğin yemeği söyleyeceksin", "ayağa kalkıp bir kez zıplayacaksın",
"bana adını ve soyadını söyleyeceksin", "bana kapıyı göstereceksin"];
let pdTask = PD_TASKS_1[0];
function pickPdTask(){ pdTask = pickDifferent(stIx() === 1 ? PD_TASKS_2 : PD_TASKS_1, pdTask); }

const CARD_COLORS = [
{ color:ACC.kirmizi, name:"kırmızı" }, { color:ACC.mavi, name:"mavi" }, { color:ACC.yesil, name:"yeşil" },
{ color:ACC.sari, name:"sarı" },    { color:ACC.mor, name:"mor" },  { color:ACC.turuncu, name:"turuncu" }
];
function cardName(c){ const f = CARD_COLORS.find(x => x.color === c); return f ? f.name : ""; }
function swatch(c){ return `<span class="target-swatch" style="background:${c}"></span>`; }
function stopSignSVG(color){
return `<svg viewBox="0 0 100 100" style="width:80%;height:80%;display:block;"><polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="${color}" stroke="#fff" stroke-width="5"/>` +
`<text x="50" y="60" text-anchor="middle" font-size="27" font-weight="900" fill="#fff" font-family="Arial, sans-serif">DUR</text></svg>`;
}
function plainCardSVG(color){
return `<svg viewBox="0 0 80 100" style="width:66%;height:84%;display:block;"><rect x="3" y="3" width="74" height="94" rx="10" fill="${color}" stroke="rgba(0,0,0,0.18)" stroke-width="2"/></svg>`;
}
const TA_ANIMALS = {
dog: () => FLK_IMAGES.dog, cat: () => FLK_IMAGES.cat, cow: () => FLK_IMAGES.cow, rabbit: () => FLK_IMAGES.rabbit,
elephant: () => FLK_IMAGES.elephant, parrot: () => LIVING_IMAGES.parrot, fish: () => LIVING_IMAGES.fish, penguin: () => HOTCOLD_IMAGES.penguin
};
const TA_COUNT_BY_TIER = [3, 4, 5];
const PRE_TA_COUNT_BY_TIER = [2, 2, 3];
const TA_LURE_BY_TIER = [0, 0.10, 0.15];
let taStopColor = ACC.kirmizi;
function makeTouchAnimalGrid(n){
const t = currentCombo().t;
taStopColor = pickDifferent(CARD_COLORS.map(c => c.color), taStopColor);
const k = (isPre() ? PRE_TA_COUNT_BY_TIER : TA_COUNT_BY_TIER)[t] || 3;
const useObj = stIx() === 1, animals = shuffleArray(useObj ? HOUSE_KEYS.filter(x => HOUSE_IMAGES[x]) : WILD_KEYS).slice(0, k);   /* Aşama 2: eşyalar */
const lureColors = CARD_COLORS.map(c => c.color).filter(c => c !== taStopColor);
const sCount = Math.max(1, Math.round(n * 0.25));
const lCount = Math.round(n * (TA_LURE_BY_TIER[t] || 0));
let flags, g = 0;
do{
flags = shuffleArray(Array.from({length:n}, (_, i) => i < sCount ? "S" : (i < sCount + lCount ? "L" : "A")));
let ok = flags[0] === "A";
for(let i = 1; ok && i < n; i++) if(flags[i] === "S" && flags[i-1] === "S") ok = false;
if(ok) break;
g++;
} while(g < 500);
const items = [];
flags.forEach((f, i) => {
if(f === "S") items.push({ kind:"stop", color: taStopColor, go:false });
else if(f === "L") items.push({ kind:"stop", color: randomItem(lureColors), go:true });
else {
let a, c = 0;
do{ a = randomItem(animals); c++; } while(c < 30 && animals.length > 1 && items[i-1] && items[i-1].a === a);
items.push({ kind:"animal", a, src: useObj ? HOUSE_IMAGES[a] : null, go:true });
}
});
return items;
}
let tcTarget = ACC.mavi;
function makeTouchCardGrid(n){
tcTarget = pickDifferent(CARD_COLORS.map(c => c.color), tcTarget);
const others = shuffleArray(CARD_COLORS.map(c => c.color).filter(c => c !== tcTarget)).slice(0, (isPre() ? [2, 3, 3] : [3, 4, 5])[Math.min(currentCombo().t, 2)]);   /* çeldirici renk sayısı düzeyle artar */
const tCount = Math.round(n * 0.4);
let flags, g0 = 0;
do{
flags = shuffleArray(Array.from({length:n}, (_, i) => i < tCount));
let run = 0, ok = true;
for(const f of flags){ run = f ? run + 1 : 0; if(run > 2){ ok = false; break; } }
if(ok) break;
g0++;
} while(g0 < 500);
const items = [];
flags.forEach((isT, i) => {
if(isT) items.push({ color: tcTarget, go:true });
else {
let c, g = 0;
do{ c = randomItem(others); g++; } while(g < 30 && items[i-1] && items[i-1].color === c);
items.push({ color: c, go:false });
}
});
return items;
}
let touchState = { tapped:new Set(), wrong:0, missAdded:false };
function resetTouchState(){ touchState = { tapped:new Set(), wrong:0, missAdded:false }; updateTouchStatus(); }
function touchGoTotal(){ return currentGrid.filter(it => it.go).length; }
function touchGoTapped(){ let k = 0; touchState.tapped.forEach(i => { if(currentGrid[i] && currentGrid[i].go) k++; }); return k; }
function updateTouchStatus(){
const el = document.getElementById("touchStatus");
if(!el) return;
if(!currentExercise().isTouch){ el.style.display = "none"; return; }
el.style.display = "";
el.textContent = `✓ ${touchGoTapped()} / ${touchGoTotal()}   ·   ✗ yanlış dokunma: ${touchState.wrong}`;
}
function setErrorCount(v){
currentErrorCount = v;
const el = document.getElementById("errorCount"); if(el) el.textContent = v;
}
function handleTouchTap(ev){
const ex = currentExercise();
if(!ex.isTouch) return;
const cell = ev.target.closest(".cell");
if(!cell || !cell.parentElement || cell.parentElement.id !== "board") return;
const i = Number(cell.dataset.i);
if(!Number.isFinite(i) || touchState.tapped.has(i)) return;
if(!timerRunning){ showLevelFlash("Önce ▶ Başlat'a basın, sonra çocuk dokunsun.", "down"); return; }
touchState.tapped.add(i);
const item = currentGrid[i];
const mark = document.createElement("div");
mark.className = "tap-mark " + (item.go ? "ok" : "bad");
mark.textContent = item.go ? "✓" : "✗";
cell.appendChild(mark);
if(!item.go){
touchState.wrong++;
setErrorCount(currentErrorCount + 1);
try{ vibrate(60); }catch(e){}
gameSfx("wrong");
} else gameSfx("correct");
updateTouchStatus();
if(touchGoTapped() >= touchGoTotal()){
touchState.missAdded = true;
stopTimer();
showLevelFlash(touchState.wrong ? `Bitti! ${touchState.wrong} yanlış dokunma.` : "Bitti! Hiç yanlış dokunma yok 🎉", "levelup");
}
}
function addTouchMissesOnStop(){
if(!currentExercise().isTouch || touchState.missAdded) return;
touchState.missAdded = true;
const miss = touchGoTotal() - touchGoTapped();
if(miss > 0){ setErrorCount(currentErrorCount + miss); showLevelFlash(`${miss} hedefe dokunulmadı; hata sayısına eklendi.`, "down"); }
}
document.getElementById("board").addEventListener("click", (ev) => { if(zaFastSeen(ev)) return; handleTouchTap(ev); });


const SRH_OBJ_FAMILIES = {
umbrella:["umbrella_red","umbrella_blue","umbrella_green"], pencil:["pencil_yellow","pencil_green","pencil_blue"],
ball:["ball_soccer","ball_basket","ball_beach"], cap:["cap_blue","cap_green","cap_beige"],
beanie:["beanie_red","beanie_gray","beanie_navy"], boots:["boots_yellow","boots_red","boots_green"]
};
const SRH_SHAPE_FAMILIES = { circle:["circle","oval","ring"], triangle:["triangle","tri_down","tri_right"], square:["square","diamond","rect"],
star:["star","star6","star4"], heart:["heart","heart_down","drop"] };
const SRH_SHAPE_BASE = ["circle","triangle","square","star","heart"];
function srhShapeSVG(k, fill){
const c = "#1F2A33", f = fill === false ? "none" : c, sw = fill === false ? 7 : 0;
const P = {
circle:`<circle cx="50" cy="50" r="40" fill="${f}" stroke="${c}" stroke-width="${sw}"/>`,
oval:`<ellipse cx="50" cy="50" rx="44" ry="30" fill="${f}" stroke="${c}" stroke-width="${sw}"/>`,
ring:`<circle cx="50" cy="50" r="36" fill="none" stroke="${c}" stroke-width="12"/>`,
triangle:`<polygon points="50,8 92,88 8,88" fill="${f}" stroke="${c}" stroke-width="${sw}"/>`,
tri_down:`<polygon points="8,12 92,12 50,92" fill="${f}" stroke="${c}" stroke-width="${sw}"/>`,
tri_right:`<polygon points="12,8 92,50 12,92" fill="${f}" stroke="${c}" stroke-width="${sw}"/>`,
square:`<rect x="12" y="12" width="76" height="76" fill="${f}" stroke="${c}" stroke-width="${sw}"/>`,
diamond:`<polygon points="50,4 96,50 50,96 4,50" fill="${f}" stroke="${c}" stroke-width="${sw}"/>`,
rect:`<rect x="6" y="24" width="88" height="52" fill="${f}" stroke="${c}" stroke-width="${sw}"/>`,
star:`<polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38" fill="${f}" stroke="${c}" stroke-width="${sw}"/>`,
star6:`<polygon points="50,4 62,30 92,27 74,50 92,73 62,70 50,96 38,70 8,73 26,50 8,27 38,30" fill="${f}" stroke="${c}" stroke-width="${sw}"/>`,
star4:`<polygon points="50,4 62,38 96,50 62,62 50,96 38,62 4,50 38,38" fill="${f}" stroke="${c}" stroke-width="${sw}"/>`,
heart:`<path d="M50 88 C20 65 5 45 5 28 C5 10 20 2 32 2 C42 2 48 8 50 14 C52 8 58 2 68 2 C80 2 95 10 95 28 C95 45 80 65 50 88 Z" fill="${f}" stroke="${c}" stroke-width="${sw}"/>`,
heart_down:`<path d="M50 12 C20 35 5 55 5 72 C5 90 20 98 32 98 C42 98 48 92 50 86 C52 92 58 98 68 98 C80 98 95 90 95 72 C95 55 80 35 50 12 Z" fill="${f}" stroke="${c}" stroke-width="${sw}"/>`,
drop:`<path d="M50 6 C66 34 84 52 84 66 C84 84 68 96 50 96 C32 96 16 84 16 66 C16 52 34 34 50 6 Z" fill="${f}" stroke="${c}" stroke-width="${sw}"/>`
};
return `<svg viewBox="-4 -4 108 108">${P[k] || ""}</svg>`;
}
const SRH_SYM_FAMILIES = {
diamond:["diamond:1","diamond:0","square:1"], square:["square:1","square:0","rect:1"], circle:["circle:1","circle:0","oval:1"],
triangle:["triangle:1","triangle:0","tri_down:1"], star:["star:1","star:0","star6:1"], heart:["heart:1","heart:0","heart_down:1"]
};
function srhSym(code){ const [k, f] = code.split(":"); return srhShapeSVG(k, f !== "0"); }
const SRH_LETTER_GROUPS = [["R","P","B"],["E","F","L"],["O","Q","C","G"],["M","N","H"],["U","V","Y"],["I","T","İ"],["Ç","C","G"],["Ş","S","Z"],["K","X","Y"],["D","O","P"]];
const SRH_LETTERS = ["A","B","C","Ç","D","E","F","G","H","I","İ","K","L","M","N","O","P","R","S","Ş","T","U","V","Y","Z"];
const SRH_SPECS = {
"search-object": { rows:[5,6,7], size:[3,3,4], absent:false },
"search-shape":  { rows:[5,6,7], size:[3,3,4], absent:false },
"search-symbol": { rows:[6,7,8], size:[5,5,6], absent:false },
"search-letter": { rows:[6,7,8], size:[5,5,6], absent:true }
};
function srhFamilyOf(fams, k){ return Object.keys(fams).find(f => fams[f].includes(k)); }
function srhPick(kind, t, size, present){
let target, all, sim;
if(kind === "search-object"){
const fams = SRH_OBJ_FAMILIES; all = Object.values(fams).flat(); target = randomItem(all);
sim = fams[srhFamilyOf(fams, target)].filter(x => x !== target);
} else if(kind === "search-shape"){
const fams = SRH_SHAPE_FAMILIES; target = randomItem(SRH_SHAPE_BASE); all = Object.values(fams).flat();
sim = fams[target].filter(x => x !== target);
if(t === 0) all = SRH_SHAPE_BASE.slice();
} else if(kind === "search-symbol"){
const fams = SRH_SYM_FAMILIES; all = [...new Set(Object.values(fams).flat())]; target = randomItem(all);
sim = [...new Set(Object.values(fams).filter(v => v.includes(target)).flat())].filter(x => x !== target);
} else {
all = SRH_LETTERS; target = randomItem(all);
sim = [...new Set(SRH_LETTER_GROUPS.filter(g => g.includes(target)).flat())].filter(x => x !== target);
}
const others = all.filter(x => x !== target && !sim.includes(x));
const nDist = present ? size - 1 : size;
let simN = t === 0 ? 0 : (t === 1 ? Math.min(1, sim.length) : Math.min(sim.length, Math.max(2, Math.ceil(nDist / 2))));
if(kind === "search-shape" && t === 0) simN = 0;
const dist = shuffleArray(sim).slice(0, simN).concat(shuffleArray(others).slice(0, nDist - Math.min(simN, sim.length)));
const items = shuffleArray(present ? dist.concat([target]) : dist);
return { target, items, present };
}
let searchState = null;
const srhPos = (r) => { try{ const ch = r.choices || r.items || []; return ch.findIndex(c => c === r.target || (c && r.target && c.k != null && c.k === r.target.k) || (c && c.src && r.target && c.src === r.target.src)); }catch(e){ return -1; } };
function makeSearchRows(){
const id = currentExercise().id, spec = SRH_SPECS[id], t = currentCombo().t;
const nRows = spec.rows[t], size = spec.size[t];
let pres;
if(spec.absent){
let g = 0;
do{
pres = shuffleArray(Array.from({length:nRows}, (_, i) => i < Math.round(nRows / 2)));
let run = 1, ok = true; for(let i = 1; i < nRows; i++){ run = pres[i] === pres[i-1] ? run + 1 : 1; if(run > 3){ ok = false; break; } }
if(ok) break; g++;
} while(g < 300);
} else pres = Array.from({length:nRows}, () => true);
const rows = [];
pres.forEach((pr, i) => {
let r, g = 0;
do{ r = srhPick(id, t, size, pr); g++; } while(g < 40 && ([rows[i-1], rows[i-2]].some(x => x && x.target === r.target) || (pr && rows[i-1] && srhPos(rows[i-1]) === srhPos(r) && Math.random() < 0.75)));
rows.push(r);
});
searchState = { answered:0, wrong:0, ans: rows.map(() => null) };
return rows;
}
function srhFace(id, k, px){
if(id === "search-object") return `<img src="${SRH_IMAGES[k]}" alt="">`;
if(id === "search-shape") return srhShapeSVG(k, true);
if(id === "search-symbol") return srhSym(k);
return `<span class="srh-letter" style="font-size:${Math.round(px*0.62)}px;">${k}</span>`;
}
function renderSearchBoard(){ try{
const board = document.getElementById("board");
board.style.display = "block";
board.style.minHeight = "";
board.style.padding = landscapeMQ.matches ? "6px 8px" : "10px";
board.style.gridTemplateColumns = "";
board.style.gridTemplateRows = "";
board.classList.remove("wide-grid");
if(!searchState) return;
const id = currentExercise().id, spec = SRH_SPECS[id];
const isLs = landscapeMQ.matches;
const n = currentGrid.length, size = currentGrid[0] ? currentGrid[0].items.length : 4;
const W = (board.clientWidth || 360) - 20;
const slots = size + 1 + (spec.absent ? 1.3 : 0) + 0.4;
const maxCell = SRH_SPECS[id].rows[0] <= 5 ? 66 : 50;
const fit = (c) => {
const perCol = Math.ceil(n / c);
let cw = Math.floor((W / c - 14 * (c - 1) - 18 - (size + 2) * 5) / slots);
if(isLs){ const H = (board.clientHeight || 280) - 10; const ch = Math.floor((H - (perCol - 1) * 4) / perCol) - 8; cw = Math.min(cw, ch); }
return Math.min(cw, maxCell);
};
let cols = 1, cell = fit(1);
if(isLs){ for(const c of [2, 3]){ const v = fit(c); if(v > cell){ cell = v; cols = c; } } }
cell = Math.max(isLs ? 18 : 24, Math.floor(cell * (searchState.lsScale || 1)));
const html = currentGrid.map((r, ri) => {
const a = searchState.ans[ri];
const rowCls = a ? (a.ok ? " ok" : " bad") : "";
const items = r.items.map((k, ii) => {
let cls = "";
if(a){ if(a.pick === ii) cls = a.ok ? " pick-ok" : " pick-bad"; else if(!a.ok && r.present && k === r.target) cls = " show"; }
return `<div class="srh-item${cls}" data-r="${ri}" data-i="${ii}" style="width:${cell}px;height:${cell}px;">${srhFace(id, k, cell)}</div>`;
}).join("");
const no = spec.absent ? `<div class="srh-no${a && a.pick === "no" ? (a.ok ? " pick-ok" : " pick-bad") : (a && !a.ok && !r.present ? " pick-ok" : "")}" data-r="${ri}" data-no="1" style="width:${Math.round(cell*1.3)}px;height:${cell}px;font-size:${Math.max(11, Math.round(cell*0.32))}px;">YOK</div>` : "";
return `<div class="srh-row${rowCls}"><div class="srh-target" style="width:${cell}px;height:${cell}px;">${srhFace(id, r.target, cell)}</div><div class="srh-sep"></div>${items}${no}</div>`;
}).join("");
board.innerHTML = `<div class="srh-list${isLs ? " ls" : ""}" style="grid-template-columns:repeat(${cols}, auto);">${html}</div>`;
if(isLs){
const st = searchState;
requestAnimationFrame(() => {
if(searchState !== st || !landscapeMQ.matches) return;
const over = board.scrollHeight - board.clientHeight;
if(over > 2 && (st.lsScale || 1) > 0.5){
st.lsScale = (st.lsScale || 1) * Math.max(0.6, (board.clientHeight - 6) / board.scrollHeight);
renderSearchBoard();
}
});
} else if(searchState) searchState.lsScale = 1;
}finally{ try{ zaTapRestore(); }catch(e){} } }
function handleSearchTap(ev){
const ex = currentExercise();
if(!ex.isSearch || !searchState) return;
const el = ev.target.closest(".srh-item[data-r], .srh-no[data-r]");
if(!el) return;
if(!timerRunning){ showLevelFlash("Önce ▶ Başlat'a basın, sonra çocuk dokunsun.", "down"); return; }
const ri = Number(el.dataset.r), r = currentGrid[ri];
if(searchState.ans[ri]) return;
let ok, pick;
if(el.dataset.no){ pick = "no"; ok = !r.present; }
else { pick = Number(el.dataset.i); ok = r.present && r.items[pick] === r.target; }
searchState.ans[ri] = { ok, pick };
searchState.answered++;
if(!ok){ searchState.wrong++; setErrorCount(currentErrorCount + 1); try{ vibrate(60); }catch(e){} }
gameSfx(ok ? "correct" : "wrong");
const y = window.scrollY;
renderSearchBoard();
if(Math.abs(window.scrollY - y) > 2) window.scrollTo(0, y);
if(searchState.answered >= currentGrid.length){
stopTimer();
showLevelFlash(searchState.wrong ? `Bitti! ${searchState.wrong} hata.` : "Bitti! Hiç hata yok 🎉", searchState.wrong ? "down" : "levelup");
}
}
document.getElementById("board").addEventListener("click", (ev) => { if(zaFastSeen(ev)) return; handleSearchTap(ev); });
window.addEventListener("resize", () => {
clearTimeout(window._srhResizeT);
window._srhResizeT = setTimeout(() => { try{ if(currentExercise().isSearch){ if(searchState) searchState.lsScale = 1; renderSearchBoard(); } }catch(e){} }, 150);
});
const SEARCH_COMMON = `Her satır bir kez cevaplanır: doğru cevap yeşil, yanlış kırmızı olur (yanlışta doğru cevap kesik çizgiyle gösterilir). Hataları uygulama sayar; tüm satırlar bitince kronometre kendiliğinden durur. <i>Hedefler her sayfada ve Karıştır'da değişir.</i>`;


function makeDayNightGrid(n){
let flags, g = 0;
do{
const half = n % 2 ? (Math.random() < 0.5 ? Math.ceil(n/2) : Math.floor(n/2)) : n/2;
flags = shuffleArray(Array.from({length:n}, (_, i) => i < half));
let run = 1, ok = true, alt = 0;
for(let i = 1; i < n; i++){ run = flags[i] === flags[i-1] ? run + 1 : 1; if(run > 2){ ok = false; break; } if(flags[i] !== flags[i-1]) alt++; }
if(ok && alt === n - 1) ok = false;
if(ok) break;
g++;
} while(g < 500);
return flags.map(f => ({ k: f ? "sun" : "moon" }));
}

const PLN_COLORS = [ACC.kirmizi, ACC.sari, ACC.mavi, ACC.yesil, ACC.mor];
const PLN_SPECS = {
"plan-swap":  { type:"swap", items: [3, 3, 4], target: [[1,1],[2,2],[2,3]], problems: [2, 3, 4], colors:[0,1,2,3] },
"plan-beads": { type:"pegs", items: [3, 3, 3], caps: [[3,3,3],[3,3,3],[3,3,3]], target: [[2,2],[3,3],[4,4]], problems: [2, 3, 4], colors:[0,1,2] },
"plan-tol":   { type:"pegs", items: [3, 3, 3], caps: [[3,2,1],[3,2,1],[3,2,1]], target: [[3,3],[4,5],[5,6]], problems: [3, 4, 5], colors:[0,3,2] },
"plan-cubes": { type:"pegs", items: [4, 4, 5], caps: [[4,4,4],[4,4,4],[5,5,5]], target: [[3,4],[5,6],[6,7]], problems: [3, 4, 5], colors:[0,1,2,3,4], square:true }
};
function plnKey(st){ return JSON.stringify(st); }
function plnNeighbors(st, caps){
const out = [];
for(let a = 0; a < st.length; a++){
if(!st[a].length) continue;
for(let b = 0; b < st.length; b++){
if(a === b || st[b].length >= caps[b]) continue;
const nx = st.map(x => x.slice());
nx[b].push(nx[a].pop());
out.push(nx);
}
}
return out;
}
function plnBFS(start, caps){
const dist = new Map([[plnKey(start), 0]]), q = [start], states = [start];
while(q.length){
const cur = q.shift(), d = dist.get(plnKey(cur));
for(const nx of plnNeighbors(cur, caps)){
const k = plnKey(nx);
if(!dist.has(k)){ dist.set(k, d + 1); q.push(nx); states.push(nx); }
}
}
return { dist, states };
}
/* plnMinMoves: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
function plnRandomState(items, caps){
let st, g = 0;
do{
st = caps.map(() => []);
shuffleArray(items).forEach(it => {
const free = st.map((x, i) => i).filter(i => st[i].length < caps[i]);
st[randomItem(free)].push(it);
});
g++;
} while(g < 50 && false);
return st;
}
function swapMin(a, goal){
const pos = new Map(goal.map((c, i) => [c, i]));
const p = a.map(c => pos.get(c)), seen = new Array(p.length).fill(false);
let cycles = 0;
for(let i = 0; i < p.length; i++){ if(seen[i]) continue; cycles++; let j = i; while(!seen[j]){ seen[j] = true; j = p[j]; } }
return p.length - cycles;
}
function makePlanProblems(){
const spec = PLN_SPECS[currentExercise().id];
const t = currentCombo().t;
const n = spec.items[t];
const colors = shuffleArray(spec.colors.map(i => PLN_COLORS[i])).slice(0, n);
const [lo, hi] = spec.target[t];
const problems = [];
let lastKey = "";
const NP = Array.isArray(spec.problems) ? spec.problems[Math.min(t, 2)] : spec.problems;   /* problem sayısı düzeye göre 3-4-5 */
const seenKey = currentExercise().id + "|" + t, seenAll = (window.__plnSeen = window.__plnSeen || {}), seen = seenAll[seenKey] = seenAll[seenKey] || new Set(); const usedS = new Set(), usedG = new Set();
/* KURAL (varyasyon): problemler yalnız renkte değil dizilişte de farklı olur — sayfada aynı hedef/başlangıç dizilişi (kule başına küp sayısı) tekrar etmez, tek kulede toplanmış hedef en fazla bir kez gelir, ilk problemin dizilişi önceki açılıştakiyle aynı olmaz */
const shp = (st) => Array.isArray(st) && Array.isArray(st[0]) ? st.map(x => x.length).join("-") : (Array.isArray(st) ? st.length + "" : ""), usedGS = new Set(), usedSS = new Set(), lastFirst = (window.__plnFirst = window.__plnFirst || {})[seenKey] || []; let towerGoal = 0;
for(let k = 0; k < NP; k++){
let pr = null, g = 0;
while(!pr && g < 120){
g++;
const want = lo + Math.floor(Math.random() * (hi - lo + 1));
if(spec.type === "swap"){
const start = shuffleArray(colors);
let goal, gg = 0;
do{ goal = shuffleArray(colors); gg++; } while(gg < 200 && swapMin(start, goal) !== want);
if(swapMin(start, goal) === want) pr = { start, goal, min: want };
} else {
const caps = spec.caps[t];
const start = plnRandomState(colors, caps);
const { dist, states } = plnBFS(start, caps);
const cands = states.filter(s2 => dist.get(plnKey(s2)) === want);
if(cands.length) pr = { start, goal: randomItem(cands), min: want, caps };
}
if(pr && plnKey([pr.start, pr.goal]) === lastKey) pr = null;
if(pr && g < 100 && (usedS.has(plnKey(pr.start)) || usedG.has(plnKey(pr.goal)))) pr = null;   /* sayfada aynı başlangıç ya da hedef iki kez gelmez */
if(pr && g < 60 && seen.has(plnKey([pr.start, pr.goal]))) pr = null;   /* önceki girişlerde görülen problem, yenisi varken tekrar gelmez */
if(pr && spec.type !== "swap" && g < 90){ const gs = shp(pr.goal), ss = shp(pr.start), single = pr.goal.filter(x => x.length).length === 1;
  if(usedGS.has(gs) || usedSS.has(ss) || (single && towerGoal >= 1) || (k === 0 && lastFirst.includes(gs + "|" + ss))) pr = null; }
}
lastKey = plnKey([pr.start, pr.goal]); usedS.add(plnKey(pr.start)); usedG.add(plnKey(pr.goal)); seen.add(lastKey);
if(spec.type !== "swap"){ usedGS.add(shp(pr.goal)); usedSS.add(shp(pr.start)); if(pr.goal.filter(x => x.length).length === 1) towerGoal++; }
problems.push(pr);
}
problems.sort((a, b) => a.min - b.min);   /* kolaydan zora */
if(spec.type !== "swap") window.__plnFirst[seenKey] = [shp(problems[0].goal) + "|" + shp(problems[0].start)].concat(lastFirst).slice(0, 3);   /* son 3 açılışın ilk dizilişi tekrar etmez */
planState = { p:0, cur: problems[0].start.map(x => Array.isArray(x) ? x.slice() : x), moves:0, extra:0, sel:null, done:false,
firstMoveMs:[], probStart:null, solved:0 };
return problems;
}
let planState = null;
function plnSizes(board){
const spec = PLN_SPECS[currentExercise().id];
const isLs = landscapeMQ.matches;
const W = ((board.clientWidth || 360) - 24) * (window._fitK || 1);
const H = (isLs ? (board.clientHeight || 280) - 20 : Math.min(560 * tabletScale(), window.innerHeight - 260)) * (window._fitK || 1);
const t = currentCombo().t, n = spec.items[t];
if(spec.type === "swap"){
const cube = Math.min(isLs ? 90 : 84, Math.floor((W * (isLs ? 0.55 : 1) - (n - 1) * 10) / n));
return { cube, gcube: Math.round(cube * 0.5) };
}
const caps = spec.caps[t], maxCap = Math.max(...caps);
const workW = isLs ? W * 0.62 : W;
let item = Math.floor(Math.min((workW / 3) * 0.72, (isLs ? H - 40 : H * 0.55) / (maxCap + 0.6)));
item = Math.max(28, Math.min(item, isLs ? 60 : 52));
return { item, gitem: Math.max(14, Math.round(item * 0.42)), pegW: Math.floor(workW / 3) };
}
function plnPegsHTML(st, caps, item, pegW, opts){
const sq = !!opts.square, sel = opts.sel, interactive = !!opts.interactive;
return `<div class="pln-pegs" style="gap:${Math.round(pegW*0.12)}px;padding-bottom:8px;">` + st.map((stack, i) => {
const h = caps[i] * item + Math.round(item * 0.5);
const items = stack.map((c, k) => {
const up = interactive && sel === i && k === stack.length - 1;
return `<div class="pln-item${up ? " up" : ""}" style="width:${sq ? item : Math.round(item*0.95)}px;height:${sq ? item : Math.round(item*0.95)}px;margin-top:${sq ? 0 : Math.round(item*0.05)}px;background:${c};border-radius:${sq ? Math.round(item*0.16) : 999}px;"></div>`;
}).join("");
return `<div class="pln-peg${interactive && sel === i ? " sel" : ""}" ${interactive ? `data-peg="${i}"` : ""} style="width:${Math.round(pegW*0.86)}px;height:${h}px;">` +
`<div class="rod" style="width:${Math.max(4, Math.round(item*0.14))}px;height:${h}px;"></div><div class="base"></div>${items}</div>`;
}).join("") + `</div>`;
}
function renderPlanBoard(){ zaFitReset(); try{
const board = document.getElementById("board");
board.style.display = "block";
board.style.minHeight = "";
board.style.padding = landscapeMQ.matches ? "8px 10px" : "12px";
board.style.gridTemplateColumns = "";
board.style.gridTemplateRows = "";
board.classList.remove("wide-grid");
if(!planState) return;
const spec = PLN_SPECS[currentExercise().id];
const ps = planState, isLs = landscapeMQ.matches;
const total = currentGrid.length;
const pr = currentGrid[Math.min(ps.p, total - 1)];
const S = plnSizes(board);
let goalHtml, workHtml;
if(spec.type === "swap"){
goalHtml = `<div class="pln-row" style="gap:6px;">` + pr.goal.map(c => `<div style="width:${S.gcube}px;height:${S.gcube}px;border-radius:6px;background:${c};border:2px solid rgba(0,0,0,0.25);"></div>`).join("") + `</div>`;
workHtml = `<div class="pln-row">` + ps.cur.map((c, i) => `<div class="pln-cube${ps.sel === i ? " up" : ""}" data-cube="${i}" style="width:${S.cube}px;height:${S.cube}px;background:${c};"></div>`).join("") + `</div>`;
} else {
goalHtml = plnPegsHTML(pr.goal, pr.caps, S.gitem, Math.round(S.gitem * 3.2), { square: spec.square });
workHtml = plnPegsHTML(ps.cur, pr.caps, S.item, S.pegW, { square: spec.square, sel: ps.sel, interactive: true });
}
const over = Math.max(0, ps.moves - pr.min);
const lockLeft = plnLocked() ? Math.ceil((ps.lockUntil - Date.now()) / 1000 / (window.__wmSpeed || 1)) : 0;
const info = ps.done
? `<div class="pln-info">Bitti 🎉 ${total} problem · ${ps.extra} fazla hamle</div>`
: lockLeft > 0 ? `<div class="pln-info">Problem ${ps.p + 1} / ${total}<br><span class="min">Önce düşün… ${lockLeft}</span></div>`
: `<div class="pln-info">Problem ${ps.p + 1} / ${total}<br><span class="min">En az ${pr.min} hamle</span> · Hamle: <span class="${over ? "over" : ""}">${ps.moves}</span></div>`;
const goal = `<div class="pln-goal"><span class="lbl">HEDEF</span>${goalHtml}</div>`;
const resetBtn = ps.done ? "" : `<button class="pln-btn" data-plnreset="1">↺ Bu problemi baştan al</button>`;
board.innerHTML = isLs
? `<div class="pln-wrap" style="flex-direction:row;align-items:center;justify-content:center;gap:18px;"><div style="display:flex;flex-direction:column;align-items:center;gap:8px;">${goal}${info}${resetBtn}</div><div>${workHtml}</div></div>`
: `<div class="pln-wrap"><div class="pln-top">${goal}${info}</div><div style="margin-top:14px;">${workHtml}</div>${resetBtn}</div>`;
}finally{ try{ zaTapRestore(); }catch(e){} } }
function plnSolved(){
const pr = currentGrid[planState.p];
return plnKey(planState.cur) === plnKey(pr.goal);
}
function plnAfterMove(){
const ps = planState, pr = currentGrid[ps.p];
if(ps.moves === 1 && ps.probStart) ps.firstMoveMs.push(Date.now() - ps.probStart);
if(ps.moves > pr.min){ ps.extra++; setErrorCount(currentErrorCount + 1); }
if(plnSolved()){
ps.solved++;
if(ps.p >= currentGrid.length - 1){
ps.done = true;
renderPlanBoard();
stopTimer();
const avg = ps.firstMoveMs.length ? (ps.firstMoveMs.reduce((a, b) => a + b, 0) / ps.firstMoveMs.length / 1000).toFixed(1) : "-";
showLevelFlash(`Bitti! ${ps.extra} fazla hamle · ilk hamleye kadar ortalama ${avg} sn düşünme`, ps.extra ? "down" : "levelup");
return;
}
showLevelFlash(ps.moves === pr.min ? "Harika! En az hamleyle çözdün 🎉" : `Çözüldü (${ps.moves - pr.min} fazla hamle)`, "levelup");
gameSfx("solved");
ps.locked = true;
renderPlanBoard();
setTimeout(() => {
ps.locked = false;
ps.p++; ps.moves = 0; ps.sel = null; ps.probStart = Date.now();
const nx = currentGrid[ps.p];
ps.cur = nx.start.map(x => Array.isArray(x) ? x.slice() : x);
renderPlanBoard();
plnStartLock();
}, 550);
return;
}
renderPlanBoard();
}
function handlePlanTap(ev){
const ex = currentExercise();
if(!ex.isPlan || !planState) return;
const ps = planState;
if(ev.target.closest("[data-plnreset]")){
if(ps.done) return;
const pr = currentGrid[ps.p];
ps.cur = pr.start.map(x => Array.isArray(x) ? x.slice() : x); ps.moves = 0; ps.sel = null;
renderPlanBoard();
return;
}
const peg = ev.target.closest(".pln-peg[data-peg]"), cube = ev.target.closest(".pln-cube[data-cube]");
if(!peg && !cube) return;
if(ps.done || ps.locked) return;
if(!timerRunning){ showLevelFlash("Önce ▶ Başlat'a basın, sonra çocuk dokunsun.", "down"); return; }
if(plnLocked()){ showLevelFlash("Önce düşün… birazdan dokunabilirsin.", "down"); return; }
if(!ps.probStart) ps.probStart = Date.now();
if(cube){
const i = Number(cube.dataset.cube);
if(ps.sel === null){ ps.sel = i; gameSfx("pop"); renderPlanBoard(); return; }
if(ps.sel === i){ ps.sel = null; renderPlanBoard(); return; }
const a = ps.sel; [ps.cur[a], ps.cur[i]] = [ps.cur[i], ps.cur[a]];
ps.sel = null; ps.moves++;
gameSfx("drop");
plnAfterMove();
return;
}
const i = Number(peg.dataset.peg);
const pr = currentGrid[ps.p];
if(ps.sel === null){
if(!ps.cur[i].length) return;
ps.sel = i; gameSfx("pop"); renderPlanBoard(); return;
}
if(ps.sel === i){ ps.sel = null; renderPlanBoard(); return; }
if(ps.cur[i].length >= pr.caps[i]){
peg.classList.remove("bad"); void peg.offsetWidth; peg.classList.add("bad");
showLevelFlash("Bu alan dolu.", "down");
return;
}
ps.cur[i].push(ps.cur[ps.sel].pop());
ps.sel = null; ps.moves++;
gameSfx("drop");
plnAfterMove();
}
document.getElementById("board").addEventListener("click", (ev) => {
if(zaFastSeen(ev)) return;
handlePlanTap(ev);
});
/* KURAL (hızlı ardışık dokunma, 2026-11-09): etkileşimli tahtalarda her parmak ayrı izlenir (pointerId); çocuk ikinci karta ilk parmağını kaldırmadan dokunsa da iki dokunuş da hemen sayılır. Dokunmalı (✓/✗), Oluş Sırası, iz sürme ve arama tahtaları da bu hızlı yoldan geçer; tarayıcının tıklama olayı aynı noktada 700 ms içinde gelirse yok sayılır (zaFastSeen). Önceden tek değişken vardı: ikinci parmak birinciyi siliyor, önceki doğru dokunuş kayboluyordu */
const ZA_FAST = [];
function zaFastSeen(ev){ try{ if(!ev || ev.isTrusted === false) return false; const now = Date.now(); for(let k = ZA_FAST.length - 1; k >= 0; k--){ const p = ZA_FAST[k]; if(now - p.t > 700){ ZA_FAST.splice(k, 1); continue; } if(Math.hypot((ev.clientX || 0) - p.x, (ev.clientY || 0) - p.y) < 26) return true; } }catch(e){} return false; }
(function initFastTap(){
const board = document.getElementById("board");
const starts = new Map();
const pick = (ex, t) => (ex.isTouch && t.closest("#board > .cell[data-i]")) ? "touch" : (ex.isSeqRows && t.closest("[data-osr]")) ? "os" : (ex.isTrail && t.closest(".trl-node")) ? "trail" : (ex.isSearch && t.closest(".srh-item[data-r], .srh-no[data-r]")) ? "search" : (ex.isPlan && t.closest(".pln-peg[data-peg], .pln-cube[data-cube]")) ? "plan"
: (ex.isSort && t.closest(".srt-ref")) ? "sort" : (ex.isWm && t.closest("[data-ans],[data-pic],[data-box]")) ? "wm" : (ex.isChoice && t.closest("[data-ch]")) ? "ch" : (ex.isRt && t.closest("[data-rt]")) ? "rt" : (ex.isMt && t.closest("[data-mt],[data-judge],[data-mtbtn]")) ? "mt" : null;   /* tahta içi düğmeler de (Başla/Dur, Gördüm, sol/sağ…) parmak kalkınca işlenir */
board.addEventListener("pointerdown", (ev) => {
if(ev.button > 0){ starts.delete(ev.pointerId); return; }
const kind = pick(currentExercise(), ev.target);
if(kind) starts.set(ev.pointerId, { kind, x: ev.clientX, y: ev.clientY, t: Date.now(), target: ev.target }); else starts.delete(ev.pointerId);
}, { passive:true });
board.addEventListener("pointermove", (ev) => {
const st = starts.get(ev.pointerId); if(st && Math.hypot(ev.clientX - st.x, ev.clientY - st.y) > 16) starts.delete(ev.pointerId);
}, { passive:true });
board.addEventListener("pointercancel", (ev) => { starts.delete(ev.pointerId); }, { passive:true });
board.addEventListener("pointerup", (ev) => {
const st = starts.get(ev.pointerId); starts.delete(ev.pointerId);
if(!st || Date.now() - st.t > 900 || Math.hypot(ev.clientX - st.x, ev.clientY - st.y) > 16) return;
window._fastTapTs = Date.now(); ZA_FAST.push({ x: st.x, y: st.y, t: Date.now() }); ZA_FAST.push({ x: ev.clientX, y: ev.clientY, t: Date.now() });
let tg = st.target; if(!tg || !tg.isConnected){ const hit = document.elementFromPoint(st.x, st.y); if(hit && board.contains(hit)) tg = hit; } /* tahta ilk dokunuşla yeniden çizildiyse ikinci dokunuş aynı noktadaki yeni öğeye gider */ const fake = { target: tg, clientX: st.x, clientY: st.y };
if(st.kind === "touch") return handleTouchTap(fake); if(st.kind === "os") return handleOsTap(fake); if(st.kind === "trail") return handleTrailTap(fake); if(st.kind === "search") return handleSearchTap(fake);
if(st.kind === "plan") handlePlanTap(fake); else if(st.kind === "sort") handleSortTap(fake); else if(st.kind === "ch") handleChoiceTap(fake); else if(st.kind === "rt") handleRtTap(fake); else if(st.kind === "mt") handleMtTap(fake); else handleWmTap(fake);
}, { passive:true });
})();
["contextmenu", "selectstart", "dragstart"].forEach(evn => {
document.getElementById("board").addEventListener(evn, e => e.preventDefault());
});
window.addEventListener("resize", () => {
clearTimeout(window._plnResizeT);
window._plnResizeT = setTimeout(() => { try{ if(currentExercise().isPlan) renderPlanBoard(); }catch(e){} }, 150);
});
const PLAN_COMMON = `Doğru dokunuşla taşıma yapılır; uygulama hamleleri sayar ve <b>en az hamle sayısını</b> gösterir. En az sayıyı aşan her hamle hata sayısına eklenir. Çocuk takılırsa "Bu problemi baştan al" düğmesini kullanın. <i>Problemler her sayfada ve Karıştır'da değişir.</i>`;

const MONTHS_TR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const TRL_ANIMALS = ["cat","dog","rabbit","cow","elephant","parrot","fish","penguin"];
const TRL_FRUITS = ["apple","banana","strawberry","orange","grapes","watermelon","lemon"];
function trlAnimalImg(k){ return TA_ANIMALS[k] ? TA_ANIMALS[k]() : ""; }
function trlFruitImg(k){ return FLK_IMAGES[k] || TASTE_IMAGES[k] || ""; }
const TRL_PAINTS = [{c:ACC.kirmizi, n:"kırmızı"}, {c:ACC.mavi, n:"mavi"}, {c:ACC.sari, n:"sarı"}, {c:ACC.yesil, n:"yeşil"}, {c:ACC.turuncu, n:"turuncu"}, {c:ACC.mor, n:"mor"}];
const TRL_SHAPES = [{k:"circle", n:"daire"}, {k:"square", n:"kare"}, {k:"triangle", n:"üçgen"}, {k:"star", n:"yıldız"}, {k:"heart", n:"kalp"}, {k:"cross", n:"artı"}];
function paintBlobSVG(c){
return `<svg viewBox="0 0 100 100"><path d="M52 8 C70 6 88 20 90 40 C93 58 84 70 88 82 C91 92 76 96 64 90 C52 85 44 94 30 90 C14 86 8 70 12 56 C15 46 6 36 12 24 C18 12 36 9 52 8 Z" fill="${c}"/></svg>`;
}
function blackShapeSVG(k){
const c = "#1F2A33";
const body = { circle:`<circle cx="50" cy="50" r="40" fill="${c}"/>`, square:`<rect x="12" y="12" width="76" height="76" rx="4" fill="${c}"/>`,
triangle:`<polygon points="50,8 92,88 8,88" fill="${c}"/>`, star:`<polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38" fill="${c}"/>`,
heart:`<path d="M50 88 C20 65 5 45 5 28 C5 10 20 2 32 2 C42 2 48 8 50 14 C52 8 58 2 68 2 C80 2 95 10 95 28 C95 45 80 65 50 88 Z" fill="${c}"/>`,
cross:`<polygon points="36,8 64,8 64,36 92,36 92,64 64,64 64,92 36,92 36,64 8,64 8,36 36,36" fill="${c}"/>` }[k] || "";
return `<svg viewBox="0 0 100 100">${body}</svg>`;
}
const PRE_TRL_COUNT_BY_TIER = [8, 10, 12];
function trlCount(){ return isPre() ? (PRE_TRL_COUNT_BY_TIER[currentCombo().t] || 8) : scatterCount(); }
function trlSequence(kind){
const n = trlCount();
/* KURAL: dönüşümlü izlerde (sayı–harf, hayvan–meyve, renk–şekil, sayı–ay) çiftler tam olur; iki türden eşit sayıda öğe vardır, iz her zaman ikinci türle biter (fazladan tek bir sayı kalmaz) */
const half = Math.floor(n / 2), half2 = Math.floor(n / 2);
if(kind === "animal-fruit"){
const a = shuffleArray(TRL_ANIMALS).slice(0, half), f = shuffleArray(TRL_FRUITS).slice(0, half2);
const seq = []; for(let i = 0; i < half; i++){ seq.push({t:"img", src:trlAnimalImg(a[i])}); if(i < half2) seq.push({t:"img", src:trlFruitImg(f[i])}); }
return seq;
}
if(kind === "color-shape"){
const c = shuffleArray(TRL_PAINTS).slice(0, half), sh = shuffleArray(TRL_SHAPES).slice(0, half2);
const seq = []; for(let i = 0; i < half; i++){ seq.push({t:"paint", c:c[i].c}); if(i < half2) seq.push({t:"shape", k:sh[i].k}); }
return seq;
}
if(kind === "numbers"){
return Array.from({length:n}, (_, i) => ({t:"text", s:String(i + 1)}));
}
if(kind === "number-month"){
const h = Math.min(12, Math.floor(n / 2)), seq = []; for(let i = 0; i < h; i++){ seq.push({t:"text", s:String(i+1)}); seq.push({t:"text", s:MONTHS_TR[i], long:true}); }   /* sayı–ay çiftleri tam: en çok 12 sayı + 12 ay, her zaman bir ayla biter */
return seq;
}
return numberLetterSequence(n, stIx() === 1).map(x => ({t:"text", s:x}));
}
function trlFace(it){
if(it.t === "img") return `<img src="${it.src}" alt="">`;
if(it.t === "paint") return paintBlobSVG(it.c);
if(it.t === "shape") return blackShapeSVG(it.k);
return `<span>${it.s}</span>`;
}
let trailState = null;
function makeTrail(kind, rev){ const seq = trlSequence(kind); if(rev) seq.reverse();   /* tersten: BAŞLA en büyük sayıda */
trailState = { kind, next:0, wrong:0, perm: shuffleArray(Array.from({length:80}, (_, i) => i)) };
return seq.map((it, i) => Object.assign({}, it, { order:i, jx: Math.random()*2-1, jy: Math.random()*2-1 }));
}
function trlPlace(W, H, n, nodeH, hasLong){
const target = Math.ceil(n * 1.4);
let cols = Math.max(2, Math.round(Math.sqrt(target * W / H * (hasLong ? 0.6 : 1))));
let rows = Math.ceil(target / cols);
while(cols * rows < target) rows++;
const cw = W / cols, ch = H / rows;
const cells = trailState.perm.filter(v => v < cols * rows).slice(0, n);
return { cols, rows, cw, ch, cells };
}
function renderTrailBoard(){ zaFitReset(); try{
const board = document.getElementById("board");
board.style.display = "block";
board.style.minHeight = "";
board.style.padding = landscapeMQ.matches ? "6px 8px" : "10px";
board.style.gridTemplateColumns = "";
board.style.gridTemplateRows = "";
board.classList.remove("wide-grid");
if(!trailState) return;
const n = currentGrid.length;
const isLs = landscapeMQ.matches;
const pre = isPre();
const W = ((board.clientWidth || 360) - (isLs ? 16 : 20)) * (window._fitK || 1);
const strip = pre
? `<div class="trl-strip">` + currentGrid.map((it, i) => `<div class="st${i === trailState.next ? " next" : ""}${i < trailState.next ? " done" : ""}">${trlFace(it)}</div>` + (i < n - 1 ? `<span class="ar">›</span>` : "")).join("") + `</div>`
: "";
if(board.offsetHeight) board.style.minHeight = board.offsetHeight + "px";
board.innerHTML = strip + `<div class="trl-area"></div>`;
const stripEl = board.querySelector(".trl-strip");
const stripH = stripEl ? stripEl.offsetHeight + 8 : 0;
const ctrl = document.querySelector(".controls");
const visH = window.innerHeight - (ctrl ? ctrl.offsetHeight : 90) - 24;
const H = isLs ? Math.max(140, (board.clientHeight || 300) - 14 - stripH)
: Math.round(Math.max(260, Math.min(W * 1.25, 520, visH - stripH - 24)));
const hasLong = currentGrid.some(it => it.long);
const TAG = 14;
const L = trlPlace(W, H - TAG, n, 0, hasLong);
const longK = hasLong ? 1.75 : 1;
let node = Math.floor(Math.min(L.ch - 8, (L.cw - 8) / longK, pre ? 66 : 52));
node = Math.max(26, node);
const fs = Math.round(node * 0.42);
const placeWith = (perm, jit) => {
const cells = perm.filter(v => v < L.cols * L.rows).slice(0, n);
return currentGrid.map((it, i) => {
const c = cells[i], cx = c % L.cols, cy = Math.floor(c / L.cols);
const w = it.long ? Math.max(Math.round(node * longK), Math.ceil(String(it.s || "").length * Math.max(11, Math.round(fs * 0.66)) * 0.64) + 10) : node; /* uzun sözcük 11 px'te düğüme sığsın diye düğüm genişler */
const mx = Math.max(0, (L.cw - w) / 2 - 3), my = Math.max(0, (L.ch - node) / 2 - 3);
return { x: (cx + 0.5) * L.cw + jit[i][0] * mx, y: TAG + (cy + 0.5) * L.ch + jit[i][1] * my, w };
});
};
const crossings = (P) => {
let bad = 0;
for(let i = 1; i < P.length; i++){
const ax = P[i-1].x, ay = P[i-1].y, bx = P[i].x, by = P[i].y, dx = bx - ax, dy = by - ay, L2 = dx*dx + dy*dy || 1;
for(let j = 0; j < P.length; j++){
if(j === i || j === i - 1) continue;
const t = Math.max(0, Math.min(1, ((P[j].x - ax) * dx + (P[j].y - ay) * dy) / L2));
const qx = ax + t * dx - P[j].x, qy = ay + t * dy - P[j].y;
const r = Math.max(P[j].w, node) / 2 + 5;
if(qx*qx + qy*qy < r*r) bad++;
}
}
return bad;
};
const layoutKey = [Math.round(W), Math.round(H), n, node].join("x");
let pos;
if(trailState.layoutKey === layoutKey && trailState.pos){
pos = trailState.pos;
} else {
const cellPt = (c, i) => {
const cx = c % L.cols, cy = Math.floor(c / L.cols);
const it = currentGrid[i];
const w = it.long ? Math.max(Math.round(node * longK), Math.ceil(String(it.s || "").length * Math.max(11, Math.round(fs * 0.66)) * 0.64) + 10) : node; /* uzun sözcük 11 px'te düğüme sığsın diye düğüm genişler */
const mx = Math.max(0, (L.cw - w) / 2 - 3), my = Math.max(0, (L.ch - node) / 2 - 3);
return { x: (cx + 0.5) * L.cw + (Math.random()*2-1) * mx, y: TAG + (cy + 0.5) * L.ch + (Math.random()*2-1) * my, w, c };
};
const near = (px, py, ax, ay, bx, by, r) => {
const dx = bx - ax, dy = by - ay, L2 = dx*dx + dy*dy || 1;
const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L2));
const qx = ax + t * dx - px, qy = ay + t * dy - py;
return qx*qx + qy*qy < r*r;
};
const R = (w) => Math.max(w, node) / 2 + 5;
const total = L.cols * L.rows;
const build = () => {
const P = [];
const used = new Set();
let budget = 5000;
const tryStep = (depth) => {
if(P.length === n) return true;
if(--budget <= 0) return false;
let cands;
if(!P.length) cands = shuffleArray(Array.from({length: total}, (_, i) => i));
else {
const pc = P[P.length-1].c, px = pc % L.cols, py = Math.floor(pc / L.cols);
cands = [];
for(let c = 0; c < total; c++){
if(used.has(c)) continue;
const d = Math.max(Math.abs(c % L.cols - px), Math.abs(Math.floor(c / L.cols) - py));
if(d >= 1 && d <= 2) cands.push({ c, d });
}
cands = shuffleArray(cands).sort((a, b) => (b.d === 2) - (a.d === 2) || 0).map(x => x.c);
cands = shuffleArray(cands.slice(0, 3)).concat(cands.slice(3));
}
for(const c of cands){
for(let rep = 0; rep < 3; rep++){
const q = cellPt(c, P.length);
let ok = true;
if(P.length){
const a = P[P.length-1];
for(let j = 0; j < P.length - 1 && ok; j++) if(near(P[j].x, P[j].y, a.x, a.y, q.x, q.y, R(P[j].w))) ok = false;
}
for(let j = 1; j < P.length && ok; j++) if(near(q.x, q.y, P[j-1].x, P[j-1].y, P[j].x, P[j].y, R(q.w))) ok = false;
if(!ok) continue;
P.push(q); used.add(c);
if(tryStep(depth + 1)) return true;
P.pop(); used.delete(c);
break;
}
}
return false;
};
return tryStep(0) ? P : null;
};
const tagSlot = (P, i) => trlTagSlot(P, i, node, W, H);
let best = null, fallback = null;
for(let k = 0; k < 8 && !best; k++){ const b = build(); if(!b) continue; if(!fallback) fallback = b; if(tagSlot(b, 0) !== null && tagSlot(b, b.length - 1) !== null) best = b; }   /* başlangıç/bitiş etiketine yer kalan yerleşim seçilir */
if(!best) best = fallback;
if(!best){
best = placeWith(trailState.perm, currentGrid.map(it => [it.jx, it.jy]));
}
trailState.layoutKey = layoutKey;
trailState.crossings = crossings(best);
pos = best;
}
let lines = "";
for(let i = 1; i < trailState.next; i++) lines += `<line x1="${pos[i-1].x}" y1="${pos[i-1].y}" x2="${pos[i].x}" y2="${pos[i].y}" stroke="#1FA463" stroke-width="3" stroke-linecap="round"/>`;
const tagStyle = (i) => { const sl = trlTagSlot(pos, i, node, W, H); return sl !== null ? sl : "top:2px;transform:translateX(-50%) scale(.82);"; };   /* yer yoksa etiket düğmenin içinde, üst kenarda (komşuya binmez) */   /* BAŞLA/BİTİŞ etiketi: boş yer (üst, alt, sağ, sol) */
const nodes = currentGrid.map((it, i) => {
const tag = i === 0 ? `<span class="tag" style="${tagStyle(i)}">BAŞLA</span>` : (i === n - 1 ? `<span class="tag" style="${tagStyle(i)}background:#5B6B78">BİTİŞ</span>` : "");
return `<div class="trl-node${i < trailState.next ? " done" : ""}" data-o="${i}" style="left:${pos[i].x}px;top:${pos[i].y}px;width:${pos[i].w}px;height:${node}px;font-size:${Math.max(11, it.long ? Math.round(fs*0.66) : fs)}px;">${trlFace(it)}${tag}</div>` /* KURAL (iz sürme, 2026-11-04): düğümdeki yazı (ay adı gibi uzun sözcükler dahil) dar telefonda da 11 px'ten küçük olmaz */;
}).join("");
const area = board.querySelector(".trl-area");
area.style.height = H + "px";
area.innerHTML = `<svg class="trl-lines" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${lines}</svg>${nodes}`;
board.style.minHeight = "";
trailState.pos = pos;
}finally{ try{ zaTapRestore(); }catch(e){} } }
function trailMarkStep(i){
const board = document.getElementById("board");
const node = board.querySelector(`.trl-node[data-o="${i}"]`);
if(node) node.classList.add("done");
const svg = board.querySelector(".trl-lines");
const P = trailState.pos;
if(svg && P && i > 0){
const ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
ln.setAttribute("x1", P[i-1].x); ln.setAttribute("y1", P[i-1].y); ln.setAttribute("x2", P[i].x); ln.setAttribute("y2", P[i].y);
ln.setAttribute("stroke", "#1FA463"); ln.setAttribute("stroke-width", "3"); ln.setAttribute("stroke-linecap", "round");
svg.appendChild(ln);
}
const st = board.querySelectorAll(".trl-strip .st");
if(st.length){
st.forEach((el, k) => { el.classList.toggle("done", k <= i); el.classList.toggle("next", k === i + 1); });
}
}
function handleTrailTap(ev){
const ex = currentExercise();
if(!ex.isTrail || !trailState) return;
const el = ev.target.closest(".trl-node");
if(!el) return;
const st = trailState;
if(st.next >= currentGrid.length) return;
if(!timerRunning){ showLevelFlash("Önce ▶ Başlat'a basın, sonra çocuk dokunsun.", "down"); return; }
const o = Number(el.dataset.o);
if(o < st.next) return;
if(o === st.next){
trailMarkStep(st.next);
gameSfx("correct");
st.next++;
if(st.next >= currentGrid.length){
stopTimer();
showLevelFlash(st.wrong ? `Bitti! ${st.wrong} yanlış dokunma.` : "Bitti! Hiç yanlış yok 🎉", st.wrong ? "down" : "levelup");
}
} else {
st.wrong++;
setErrorCount(currentErrorCount + 1);
gameSfx("wrong");
el.classList.remove("bad"); void el.offsetWidth; el.classList.add("bad");
try{ vibrate(60); }catch(e){}
setTimeout(() => el.classList.remove("bad"), 500);
}
}
document.getElementById("board").addEventListener("click", (ev) => { if(zaFastSeen(ev)) return; handleTrailTap(ev); });

/* KURAL: sayfa yetişkinden "Hata sayısı" ile puanlama istiyorsa (Heykel, Gözle Say, Ne Yapmalı?, Saçmalığı Bul vb.) Hata sayısı satırı çalışma sırasında da görünür kalır */
/* KURAL (içerik uyumu): sayaç satırının adı ile tahtadaki yönlendirme aynı olur — sayaç özel adlıysa (ör. "Hareket / konuşma sayısı", "Yanlış sayılan") tahtadaki "Hata sayısı +" yazısı o adla gösterilir */
let _errHintObs = null;
function syncErrHintText(){ try{ const lb = (document.getElementById("errorRowLabel") || {}).textContent || "Hata sayısı"; if(lb === "Hata sayısı" || /^Doğru/.test(lb)) return; const b = document.getElementById("board"); if(!b) return; const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT); const nodes = []; while(w.nextNode()){ if(/Hata sayısı/.test(w.currentNode.nodeValue)) nodes.push(w.currentNode); } nodes.forEach(n => { n.nodeValue = n.nodeValue.replace(/Hata sayısı/g, lb); }); }catch(e){} }
function syncErrHintWatch(){ try{ const b = document.getElementById("board"); if(!b) return; if(!_errHintObs){ _errHintObs = new MutationObserver(() => syncErrHintText()); _errHintObs.observe(b, { childList:true, subtree:true, characterData:true }); } syncErrHintText(); }catch(e){} }
const MANUAL_ERR_IDS = new Set(["statue","eye-count","what-do","absurd-say"]);
function usesManualErrors(ex){ try{ if(!ex) return false; if(MANUAL_ERR_IDS.has(ex.id) || ex.manualErrors) return true; const b = document.getElementById("board"); return !!(b && /Hata sayısı/.test(b.innerText || "")); }catch(e){ return false; } }
function isInteractiveExercise(ex){ return !!(ex && (ex.isTouch || ex.isSeqRows || ex.isSort || ex.isTrail || ex.isPlan || ex.isSearch || ex.isWm || ex.isChoice || ex.isRt || ex.isMt || ex.isDone)); }
function pageComplete(){ try{ const ex = currentExercise(); if((ex.isMt || ex.isWm) && typeof mtState !== "undefined" && mtState && Array.isArray(mtState.trials) && (mtState.phase === "done" || mtState.ti >= mtState.trials.length)) return true; if(isInteractiveExercise(ex)) return interactiveIsDone(); if(ex.isMotion) return elapsedMs >= (motionDurationMs - 300); }catch(e){} return true; }

// ===== Çalışma odak modu (Başlat → Bitir): ayar satırları gizlenir, sayfa sabitlenir, otomatik kaydırma yapılmaz =====
function pageScroller(){ const ma = document.getElementById("mainApp"); if(ma && /(auto|scroll)/.test(getComputedStyle(ma).overflowY) && ma.scrollHeight > ma.clientHeight + 1) return ma; const b = document.body, cs = getComputedStyle(b); if(/(auto|scroll)/.test(cs.overflowY) && b.scrollHeight > b.clientHeight + 1) return b; return document.scrollingElement || document.documentElement; }
/* pageScrollTop: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
/* resimli seçeneklerde ilk çizimden sonra tahtanın altında boş yer kaldıysa resimler bir kez o yeri de kullanarak yeniden çizilir (soru başına bir kez) */
function zaPicGrow(f, self, args){ try{ if(typeof mtState === "undefined" || !mtState || mtState.kind !== "quiz" || !timerRunning || landscapeMQ.matches) return; const g = document.querySelector("#board .wm-grid"); if(!g || !g.querySelector("img")) return; const k = zaFitKey(); if(window._zaPicHK === k) return; window._zaPicHK = k; window._zaPicH = 0; const free = Math.floor(window.innerHeight - 18 - g.getBoundingClientRect().bottom); if(free > 30){ window._zaPicH = Math.floor(g.getBoundingClientRect().height + free); f.apply(self, args); } }catch(e){} }
/* resimli seçenekler için dizilim: son satırı eksik kalmayan dizilimler arasında resimleri en büyük yapan seçilir */
function zaPicDims(count, W, H, cap){ const c = []; for(let cols = 1; cols <= count; cols++){ const rows = Math.ceil(count / cols); const empty = cols * rows - count; const cell = Math.floor(Math.min(cap, (W - (cols - 1) * 10) / cols, (H - (rows - 1) * 10) / rows)); c.push({ cols, rows, cell, empty }); } const minE = Math.min(...c.map(x => x.empty)); const pool = c.filter(x => x.empty === minE); pool.sort((x, y) => y.cell - x.cell); const p = pool[0]; return { cols: p.cols, rows: p.rows, cell: Math.max(56, p.cell) }; }
/* KURAL (tuş dizisi, 2026-11-06): ses/renk dizisi tuşlarında (Ton dizisi, Simon) yanan tuş ile sönük tuşlar arasındaki fark belirgindir — izleme evresinde sönük tuşlar soluk ve az doygun, yanan tuş tam parlak, daha doygun, büyür ve kendi renginde parlar; dokunma evresinde tuşlar yarı parlak görünür */
/* KURAL (dokunma geri bildirimi, 2026-11-07): etkileşimli tahtalarda dokunulan düğme/kart (sayı, harf, resim, ✓/✗, Saydım…) dokunur dokunmaz kısa bir süre içe göçer ve turkuaz halkayla belirir; tahta dokunuşla yeniden çizilse de aynı öğe vurgulanır (önceden yeniden çizim vurguyu siliyordu, Say ve Hatırla'da basıldığı anlaşılmıyordu) */
const ZA_TAP_ATTRS = ["data-mt", "data-mtbtn", "data-judge", "data-o", "data-peg", "data-cube", "data-i", "data-pad", "data-ch", "data-rt", "data-cup", "data-cat", "data-code", "data-pic", "data-osr", "data-osc", "data-rc", "data-g"]; const ZA_TAP_SEL = ZA_TAP_ATTRS.map(x => "[" + x + "]").join(",");
function zaTapKey(el){ /* KURAL (dokunma vurgusu anahtarı, 2026-11-09): anahtar öğenin bütün dokunma özniteliklerinden oluşur (ör. Oluş Sırası satır+kart); önceden yalnız ilk öznitelik alınıyordu, aynı satırdaki bütün kartların anahtarı aynı çıkıyor ve tahta yeniden çizilince vurgu satırın ilk kartına gidiyordu */ const parts = []; for(const a of ZA_TAP_ATTRS) if(el.hasAttribute(a)) parts.push(a + "=" + el.getAttribute(a)); return parts.join("&"); }
function zaTapMark(el, ms){ try{ /* KURAL (dokunma vurgusu konum, 2026-11-08): konumu transform ile verilen öğeler (Sayılara Sırayla Dokun düğümleri gibi) dokununca kaymaz; yalnız halka ve parlaklıkla belirir */ const tf = getComputedStyle(el).transform; const cls = (tf && tf !== "none") ? "za-tap-ring" : "za-tap"; el.classList.add(cls); setTimeout(() => { try{ el.classList.remove(cls); }catch(e){} }, ms); }catch(e){} }
function zaTapRestore(){ try{ const t = window.__zaTap; if(!t) return; const left = 240 - (Date.now() - t.at); if(left <= 20) return; const bd = document.getElementById("board"); if(!bd) return; const same = [...bd.querySelectorAll(ZA_TAP_SEL)].filter(e => zaTapKey(e) === t.key); const el = same[t.ord || 0] || (same.length === 1 ? same[0] : null); if(el) zaTapMark(el, left); }catch(e){} } /* aynı anahtarlı öğeler (ör. arama satırları, çizim noktaları) tahtadaki sırasıyla ayırt edilir (ord) */
(function(){ try{ /* stil: zihin-stil.css */ }catch(e){}
  try{ document.addEventListener("pointerdown", (ev) => { try{ const bd = document.getElementById("board"); if(!bd || !bd.contains(ev.target)) return; const el = ev.target.closest(ZA_TAP_SEL); if(!el || !bd.contains(el) || el.disabled) return; const __k = zaTapKey(el); window.__zaTap = { key: __k, ord: [...bd.querySelectorAll(ZA_TAP_SEL)].filter(e => zaTapKey(e) === __k).indexOf(el), at: Date.now() }; zaTapMark(el, 240); try{ if(navigator.vibrate) navigator.vibrate(12); }catch(e){} }catch(e){} }, { capture: true, passive: true }); }catch(e){} })();
/* KURAL (tahta düzeni modülü, 2026-11-09 — mühendislik borcu 3. adım): resimli/şekilli tahtanın bütün yerleşim hesabı tek yerdedir, ZA_BOARD: kalan yükseklik (avail), sütun/satır/hücre seçimi (pick, picGrid), özel satır biçimli tahtalar (RG) ve satır ayırıcı çizgiler (dividers). applyBoardLayout yalnız bu modüle çağrı yapar; yerleşimle ilgili bir değişiklik yalnız burada yapılır */
const ZA_BOARD = {
  /* satır biçimli gruplar: iki sütun, satır yüksekliği içeriğin oranına göre (daireler basık görünmez) */
  RG: { "sequence-pattern": 4.2, "visual-analogy": 3.4, "odd-one-out": 2.3 },
  isSpecial(id){ return !!this.RG[id]; },
  /* çalışırken tahtaya kalan yükseklik — sabit model */
  avail(board, padV){ try{ const ma = document.getElementById("mainApp"); const tb = document.getElementById("timerBtn"); const rows = [document.getElementById("instructionBox"), tb && tb.closest(".timer-row"), document.getElementById("errorRow"), document.getElementById("sdmtKey")].filter((e, i, arr) => e && arr.indexOf(e) === i); /* çalışırken görünen satırlar: yönerge, süre, hata sayısı ve (varsa) sembol anahtarı; başlık, çipler, oturum çubuğu, Sonucu Kaydet, alt düğmeler çalışırken gizli olduğu için hesaba girmez */ let used = 0; rows.forEach(el => { const cs = getComputedStyle(el); let h = el.getBoundingClientRect().height; if(cs.display === "none" || h < 1){ if(el.id === "sdmtKey") return; h = el.id === "instructionBox" ? 96 : 68; } used += h + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0); }); const csM = ma ? getComputedStyle(ma) : null; const top = csM ? (parseFloat(csM.paddingTop) || 0) : 12; const csB = getComputedStyle(board); used += (parseFloat(csB.marginTop) || 0); const avail = Math.floor(window.innerHeight - top - used - 14 - padV); if(!isFinite(avail) || avail < 180) return Math.floor(window.innerHeight * 0.5); return avail; }catch(e){ return Math.floor(window.innerHeight * 0.5); } },
  /* n öğe için sütun/satır/hücre adayları ve seçim */
  pick(n, W, avail, gx, gy, MAXC){ const aspect = 1; /* resim ve şekil hücreleri karedir: sütun satırdan geniş olursa iPhone Safari'de şekil hücreden taşıp üstü kesiliyordu (Şekil–Renk kalpleri) */ const cands = []; for(let c = 2; c <= Math.min(8, n); c++){ const r = Math.ceil(n / c); if(c * r - n >= c) continue; const empty = c * r - n; const cw = (W - (c - 1) * gx) / c; const chW = cw / aspect; const chH = avail > 0 ? (avail - (r - 1) * gy) / r : chW; const cell = Math.min(chW, chH, MAXC); cands.push({ c, r, cell, empty }); } /* KURAL (son satır, 2026-11-07): son satırı tam dolu dizilimler önce gelir (9 resim 3×3, 2+2+2+2+1 değil); tam dolu dizilim resimleri en iyinin %70'inden fazla küçültüyorsa (asal sayılar) boşluklu dizilime izin verilir */ const bestAll = cands.reduce((m, x) => Math.max(m, x.cell), 0); const exact = cands.filter(x => x.empty === 0).sort((x, y) => y.cell - x.cell); const pick = exact.length && exact[0].cell >= bestAll * 0.7 ? exact[0] : cands.slice().sort((x, y) => (y.cell - y.empty * 6) - (x.cell - x.empty * 6))[0]; return pick || null; },
  /* resimli tahta için tam yerleşim: {cols, rows, colTrack, rowTrack, fitOver} */
  picGrid(board, n){ try{ const csB = getComputedStyle(board); const padV = parseFloat(csB.paddingTop) + parseFloat(csB.paddingBottom), padH = parseFloat(csB.paddingLeft) + parseFloat(csB.paddingRight); const gx = parseFloat(csB.columnGap) || 10; const gy = n >= 13 && window.innerWidth < 700 ? 12 : (parseFloat(csB.rowGap) || 10); /* KURAL (tahta boyu kalıcı, 2026-11-08): resimli/şekilli tahtanın hücre boyu, o anki ekran konumuna değil sabit bir modele göre hesaplanır — ekran yüksekliğinden yalnız çalışırken görünen satırlar (yönerge, süre, hata) ve kenar boşlukları düşülür. Başlık, çipler, oturum çubuğu, "Sonucu Kaydet" satırı, kaydırma konumu hesaba girmez. Böylece Başlat'tan önce, çalışırken, Bitir'den sonra ve Karıştır/Sonraki'de tahta hep aynı boydadır (önceden tahtanın ekrandaki yerine göre hesaplanıyor, her düğmede farklı boy çıkıyordu) */
const avail = this.avail(board, padV); const W = board.clientWidth - padH; const MAXC = Math.min(150, Math.round(window.innerWidth * 0.42)); const p = this.pick(n, W, avail, gx, gy, MAXC); if(!p) return null; const cell = Math.max(36, Math.floor(p.cell)); return { cols: p.c, rows: p.r, rowTrack: cell + "px", colTrack: cell + "px", fitOver: p.r * cell + (p.r - 1) * gy > avail + 1 }; }catch(e){ return null; } },
  /* satır ayırıcı çizgiler */
  dividers(board, rows, cols, noRaf){ board.querySelectorAll(".row-divider").forEach(el => el.remove()); if(rows <= 1 || cols <= 0) return; const cs = getComputedStyle(board); const padLeft = parseFloat(cs.paddingLeft) || 0; const padRight = parseFloat(cs.paddingRight) || 0; const rowGapPx = parseFloat(cs.rowGap) || 0; const boardRect = board.getBoundingClientRect(); const bt = boardRect.top + (board.clientTop || 0); /* KURAL (satır çizgisi, 2026-11-08): ayırıcı çizgi iki satırın tam ortasındadır — üstteki satırın alt kenarı ile alttaki satırın üst kenarının ortasına çizilir, tahtanın üst kenar çizgisi hesaba katılır; yerleşim bir kare sonra değişmişse çizgiler yeniden hizalanır (önceden çizgi alt satırın üstüne yapışıyordu) */ for(let r = 0; r < rows - 1; r++){ const cell = board.children[r * cols], next = board.children[(r + 1) * cols]; if(!cell) continue; const ar = cell.getBoundingClientRect(); const cr = next ? next.getBoundingClientRect() : null; const mid = (cr && cr.top >= ar.bottom - 1) ? (ar.bottom + cr.top) / 2 : ar.bottom + rowGapPx / 2; const line = document.createElement("div"); line.className = "row-divider"; line.style.top = (mid - bt) + "px"; line.style.left = padLeft + "px"; line.style.right = padRight + "px"; board.appendChild(line); } if(!noRaf && !board.__zaDivRaf){ board.__zaDivRaf = requestAnimationFrame(() => { board.__zaDivRaf = 0; try{ if(board.querySelector(".row-divider") && board.children[cols]) ZA_BOARD.dividers(board, rows, cols, true); }catch(e){} }); } }
};
/* zaRunAvail: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
function renderRowDividers(board, rows, cols, noRaf){ return ZA_BOARD.dividers(board, rows, cols, noRaf); }
/* KURAL (tahta ölçeği, 2026-11-06): çalışırken tahtaya sığmayan içerik küçültülür, ama küçültme yalnız o soru/evre için geçerlidir — yeni denemeye, yeni evreye (ör. cümle → resimleri hatırlama), yeni probleme geçince ölçek yeniden 1'den başlar. Önceden küçültme tek yönlüydü: uzun bir evrede küçülen tahta sonraki denemelerde de küçük kalıyordu (Resimli Dinleme Aralığı ikinci tekrarda küçülüyordu) */
function zaFitKey(){ try{ const ex = currentExercise(); let s = ex ? ex.id : ""; if(typeof mtState !== "undefined" && mtState){ const m = mtState; s += "|" + [m.kind, m.ti, m.si, m.phase, m.round, m.p].map(v => v == null ? "" : v).join(","); } if(typeof planState !== "undefined" && planState) s += "|p" + planState.p; if(typeof trailState !== "undefined" && trailState) s += "|t" + (Array.isArray(currentGrid) ? currentGrid.length : 0) + ":" + (trailState.page || 0); return s; }catch(e){ return ""; } }
function zaFitReset(){ try{ if(window.__zaNoFitReset) return; const k = zaFitKey(); if(k === window._zaFitKey) return; window._zaFitKey = k; if((window._fitK || 1) !== 1){ window._fitK = 1; } const bd = document.getElementById("board"); if(bd){ delete bd.dataset.rf; delete bd.dataset.rfs; } }catch(e){} }

/* KURAL (ödev kartı düğmesi, 2026-11-08): Ödevlerim'de henüz başlanmamış ödevin kartında pasif "Henüz başlanmadı / Henüz yapılmadı" rozeti yerine etkin, turkuaz "Etkinliğe başla" düğmesi vardır (başlanmışsa "Devam et"); dokununca ödev açılır. Ertelenmiş ödevde "Yarına ertelendi" rozeti kalır */
/* KURAL (Bugün tamamlandı tek ekran, 2026-11-07): bugünün dört etkinliği bitince sayfa tek ekrana sığar — kutlama kartı yatay ve küçük (Zihni solda), tamamlanan adımlar tek satır (yalnız ✓ ve çalışma adı), Devam et ve haftanın özeti düğmeleri ince */
/* KURAL (Bugün tek sayfa, 2026-11-07): Bugünün etkinlikleri sayfası boşlukları azaltılmış sıkı düzendedir — hedef satırı, dört adım kartı ve Oturumu başlat düğmesi telefonda tek ekrana sığar; Ödevlerim bir kez daha sıkılaştırıldı (başlık, bölüm başlıkları, kartlar, geçmiş tablosu); yazılar 11 px altına inmez */
/* KURAL (Ödevlerim sıkı düzen, 2026-11-06): Ödevlerim sayfası boşlukları azaltılmış sıkı düzendedir — mümkünse tek ekrana sığar (üst boşluk, başlık, bölüm başlıkları, kartlar ve geçmiş tablosu satırları sıkılaştırılmıştır); yazılar 11 px altına inmez */
(function hwCompact(){ try{ /* stil: zihin-stil.css */ }catch(e){}

 })();
/* KURAL (durum çubuğu kök neden, 2026-11-07): gizli altyazı balonu ekranın en üstünde koyu renkli olarak (yalnız saydam) duruyordu; iPhone durum çubuğunun rengini en üstteki sabit öğeden aldığı için uygulamaya dönünce üst kısım koyu/gri kalıyordu. Gizli altyazı balonu artık hiç yer kaplamaz (display:none); üst kenarda koyu renkli gizli sabit öğe bulunmaz */
/* KURAL (durum çubuğu, 2026-11-06): uygulama arka plandan dönünce (başka uygulamaya girip çıkınca) üstteki durum çubuğu rengi uygulamanın rengine yeniden ayarlanır (iPhone'da gri kalıyordu) */
(function statusBarFix(){ try{ const C = "#EEF3F3"; const fix = () => { try{ const m = document.querySelector('meta[name="theme-color"]'); if(!m) return; m.setAttribute("content", "#EEF3F2"); requestAnimationFrame(() => { m.setAttribute("content", C); }); document.documentElement.style.backgroundColor = C; }catch(e){} }; document.addEventListener("visibilitychange", () => { if(!document.hidden) setTimeout(fix, 60); }); window.addEventListener("pageshow", fix); window.addEventListener("focus", () => setTimeout(fix, 30)); }catch(e){} })();
/* KURAL (ana sayfa kişi seçimi, 2026-11-05): ana sayfada kişi listesi ana sayfanın kendi penceresinde açılır (Değiştir ve kişi gerektiren düğmeler); oyunun "Kim oynuyor?" penceresi ana sayfada gizli kalıp sonra etkinlik sayfasında çıkmaz */
function zaHomePick(cur, cb){ try{ const esc = (x) => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); const sh = whoSheet(`<div class="mola-h">Kim çalışıyor?</div><div class="mola-list hp-list">${whoNames().map(nm => `<button type="button" data-hp="${esc(nm)}"${nm === cur ? ' class="on"' : ""}>${avatarHTML(nm, 30)}<span class="hp-ln">${esc(nm)}</span>${nm === cur ? '<span class="hp-ok">Seçili</span>' : ""}</button>`).join("")}</div>`); sh.querySelectorAll("[data-hp]").forEach(b => b.onclick = () => { sh.style.display = "none"; try{ cb(b.dataset.hp); }catch(e){} }); }catch(e){} }
/* KURAL (ana sayfa · B, 2026-11-05 — kullanıcının onayladığı taslak B): "Merhaba!" altında kişi satırı; turkuaz kartta solda iki düğmenin toplam yüksekliğinde "Bilişsel Etkinlik" düğmesi (alanlar sayfasını açar), sağda Bugünün etkinlikleri ve Ödevlerim üst üste; kartlar orantılı küçültülür, iki kart aynı boydadır. Eski "ana sayfada kişi seçimi/ekleme yok" kuralının yerine */
/* KURAL (kişi, 2026-11-05): etkinlik sayfasında kişi değişince seçim kalıcı olur (ana sayfa, Bugün, Ödevlerim, Gelişim, oyun aynı kişiyi kullanır) ve o kişinin kendi verileri hemen uygulanır — alanın okul dönemi, çalışmanın son düzeyi; aynı çalışma o kişinin düzeyinde yeniden açılır */
function zaPersonChanged(n){ try{ if(!n || n === "__new__") return; try{ whoSelSet(n); whoTouch(n); }catch(e){} if(typeof timerRunning !== "undefined" && timerRunning) return; const ma = document.getElementById("mainApp"); if(!ma || getComputedStyle(ma).display === "none") return; const ex = currentExercise(); if(!ex) return; const exId = ex.id, ci = currentCategoryIndex; selectCategory(ci); const e = currentCategoryExercises().findIndex(x => x.id === exId); if(e < 0) return; const t = Math.max(lastTierFor(exId), exerciseById(exId).minTier || 0); const idx = findSeqIndex(Math.min(t, tierMax(exerciseById(exId))), e); if(idx != null && idx >= 0) goToIndex(idx); }catch(e){} }
/* KURAL (yönerge sesi, 2026-11-06): (1) oyunda yönerge kesilmez — yönerge okunurken Başla'ya basılırsa oyun yönerge bitince başlar, "Başla!" sesi atlanır, oyunun kendi sesleri yönergeden sonra gelir; (2) Bilişsel Etkinlik sayfalarında da (Aile/Uzman, Bugün, Ödevlerim) yönerge sayfa açılınca okunur, Başlat'a basınca okuma durur; (3) yönerge kutusunda "Yönerge:" yazısının önünde hoparlör düğmesi vardır — sesi kapatır/açar, açınca yönergeyi yeniden okur */
/* KURAL (konuşma durum makinesi, 2026-11-09 — mühendislik borcu 5. adım): yönerge konuşmasının bütün durumu tek nesnede tutulur (ZA_SPEECH.S): active (okunuyor), g (yönerge nesli), key (okunan çalışma+aşama), spoken (okunmuş anahtar), cut (pencere kesti), pending (pencere kapanınca okunacak), startAfter (oyunda yönerge bitince Başlat), rt/poll/t (zamanlayıcılar), gen (konuşma nesli). Geçişler yalnız bu modülün yöntemleriyle olur: readInstr (sayfa çizildi → okuma kararı), stop (çıkış/susturma), done (yönerge bitti), modalOpen/waitModal (pencere). Eski window.__zaInstr* adları aynı duruma bakan takma adlardır */
const ZA_SPEECH = {
  S: { active:false, g:0, key:"", spoken:"", cut:false, pending:false, startAfter:false, rt:null, poll:null, t:null, gen:0 },
  /* pencere açık mı (bilgi/onay, kişi, oyun kişi, Değerlendirme turu, tur teklifi) */
  modalOpen(){ try{ return ["zaDlg", "whoSheet", "gameWhoSheet", "placeScreen", "placeOffer"].some(id => { const e = document.getElementById(id); if(!e) return false; const c = getComputedStyle(e); return c.display !== "none" && c.visibility !== "hidden" && e.getBoundingClientRect().height > 0 && (id !== "zaDlg" || e.innerHTML.trim() !== ""); }); }catch(e){ return false; } },
  /* pencere kapanınca yönergeyi oku */
  waitModal(){ const S = this.S; try{ S.pending = true; if(S.poll) return; S.poll = setInterval(() => { if(this.modalOpen()) return; clearInterval(S.poll); S.poll = null; if(S.pending){ S.pending = false; setTimeout(() => this.readInstr(true), 250); } }, 300); }catch(e){} },
  /* sayfa çizildi / pencere kapandı: okuma kararı */
  readInstr(force){ const S = this.S; try{ if(typeof gameMode !== "undefined" && gameMode) return; if(timerRunning) return; if(this.modalOpen()){ this.waitModal(); return; } const ma = document.getElementById("mainApp"); if(!ma || getComputedStyle(ma).display === "none") return; const ex = currentExercise(); if(!ex) return; /* KURAL (yönerge sürekliliği, 2026-11-09): aynı sayfada kalındığı sürece düzey, kişi ya da okul dönemi değişince yönerge yeniden başlamaz ve kesilmez; yalnız başka çalışmaya ya da başka aşamaya geçilince okunur (aşamanın yönergesi farklıdır) */ const k = [ex.id, currentStageIndex].join("|"); if(!force && k === S.key) return; if(force && S.spoken === k && !S.cut) return; /* KURAL (yönerge bir kez, 2026-11-09): aynı çalışma+aşama için yönerge en çok bir kez okunur; yalnız pencere yüzünden kesildiyse pencere kapanınca baştan okunur. Hoparlör düğmesi her zaman yeniden okutabilir */ S.key = k; clearTimeout(S.rt); S.rt = setTimeout(() => { try{ S.rt = null; if(timerRunning || getComputedStyle(ma).display === "none") return; if(this.modalOpen()){ this.waitModal(); return; } const tx = childInstructionText(); if(tx){ S.spoken = k; S.cut = false; speakText(tx, { instr: true }); } }catch(e){} }, 600); }catch(e){} },
  /* yönerge bitti: oyunda ertelenen Başlat çalışır */
  done(){ const S = this.S; try{ S.active = false; clearTimeout(S.t); if(S.startAfter){ S.startAfter = false; const b = document.getElementById("timerBtn"); if(b) b.classList.remove("za-wait"); if(!timerRunning && typeof gameMode !== "undefined" && gameMode){ window.__zaSkipGo = true; try{ startTimer(); }finally{ window.__zaSkipGo = false; } } } }catch(e){} },
  /* çıkış / susturma: her şey susar, bekleyenler iptal */
  stop(){ const S = this.S; try{ S.gen = (S.gen || 0) + 1; S.active = false; S.g = (S.g || 0) + 1; S.startAfter = false; }catch(e){} try{ _ttsMissed = null; }catch(e){} try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){} try{ hideCaption(); }catch(e){} try{ (window._rlTs || []).forEach(clearTimeout); window._rlTs = []; }catch(e){} }
};
[["__zaInstrActive","active"],["__zaInstrG","g"],["__zaInstrKey","key"],["__zaInstrSpoken","spoken"],["__zaInstrCut","cut"],["__zaInstrPending","pending"],["__zaStartAfterInstr","startAfter"],["__zaInstrRT","rt"],["__zaInstrPoll","poll"],["__zaInstrT","t"],["__zaSpGen","gen"]].forEach(([w, k]) => { try{ Object.defineProperty(window, w, { get(){ return ZA_SPEECH.S[k]; }, set(v){ ZA_SPEECH.S[k] = v; }, configurable: true }); }catch(e){} });
function zaInstrDone(){ return ZA_SPEECH.done(); }
function zaModalOpen(){ return ZA_SPEECH.modalOpen(); }
function zaInstrWaitModal(){ return ZA_SPEECH.waitModal(); }
function zaReadInstr(force){ return ZA_SPEECH.readInstr(force); }
function zaStopSpeech(){ return ZA_SPEECH.stop(); }


/* KURAL (düzey bildirimi, 2026-11-07): "Harika gidiyorsun! Zorluk artırıldı…" / "zorluk azaltıldı…" bildirimi kendiliğinden kaybolmaz; Başlat'a basılana, başka çalışmaya/adıma geçilene ya da ekran kaydırılana kadar görünür kalır (önceden 4 sn'de kayboluyor, okunamıyordu) */
(function(){ 
 const hide = (minAge) => { try{ ["levelFlash", "zaToast"].forEach(id => { const e = document.getElementById(id); if(e && e._zaSticky && Date.now() - e._zaSticky > (minAge || 0)){ e.style.display = "none"; e._zaSticky = 0; } }); }catch(e){} };
 window.zaHideLevelFlash = hide;
 try{ document.addEventListener("click", (ev) => { if(ev.target.closest && ev.target.closest("#timerBtn")) hide(0); }, true); }catch(e){}
 try{ ["scroll", "touchmove", "wheel"].forEach(evn => document.addEventListener(evn, () => hide(900), { capture: true, passive: true })); }catch(e){}

 })();
/* KURAL (pencere ve Tebrikler kartı, 2026-11-07): Tebrikler (Zihni) kartı ekrandayken onay penceresi açılırsa kart ekranın en üstüne çıkar, pencere kartın altına yerleşir; ikisi üst üste binmez, ikisi de görünür */
function zaDlgPlace(){ try{ const d = document.getElementById("zaDlg"); if(!d || d.style.display !== "flex") return; d.style.alignItems = ""; d.style.paddingTop = ""; d.style.paddingBottom = ""; const fc = document.getElementById("finishCard"); if(!fc) return; const cs = getComputedStyle(fc); if(cs.display === "none" || cs.visibility === "hidden" || !fc.classList.contains("on") || fc.getBoundingClientRect().height < 10) return; fc.style.top = "calc(8px + env(safe-area-inset-top, 0px))"; fc.style.transition = "none"; const r = fc.getBoundingClientRect(); const card = d.querySelector(".zd-card"); if(!card) return; const ch = card.getBoundingClientRect().height, top = Math.round(r.bottom + 12); if(top + ch <= window.innerHeight - 8){ d.style.alignItems = "flex-start"; d.style.paddingTop = top + "px"; } else { d.style.alignItems = "flex-end"; d.style.paddingBottom = "10px"; } }catch(e){} }

/* KURAL (yönerge ve pencereler, 2026-11-07): bilgi/onay penceresi (ör. "… bir süre Okul Öncesi çalışmalarıyla ilerleyecek") ya da kişi penceresi açıkken yönerge okunmaz; okunmaktaysa susar. Pencere kapanınca (Tamam'a basınca) yönerge baştan okunur */
/* zaModalOpen → ZA_SPEECH */
/* zaInstrWaitModal → ZA_SPEECH */

/* zaReadInstr → ZA_SPEECH */
const ZA_SPK_ON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>', ZA_SPK_OFF = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5"/></svg>';
function zaInstrSpk(){ try{ const ib = document.getElementById("instructionBox"); if(!ib) return; let b = document.getElementById("instrSpk"); if(!b || b.parentNode !== ib){ if(b) b.remove(); b = document.createElement("button"); b.type = "button"; b.id = "instrSpk"; b.className = "instr-spk"; b.onclick = (ev) => { ev.stopPropagation(); const m = !speechMuted(); try{ localStorage.setItem(SPEECH_MUTE_KEY, m ? "1" : "0"); }catch(e){} if(m){ zaStopSpeech(); } else { const tx = childInstructionText(); if(tx) speakText(tx, { instr: true }); } zaInstrSpk(); try{ renderSpeakBtn(); }catch(e){} }; ib.insertBefore(b, ib.firstChild); } /* "Yönerge:" etiketi kutunun ::before yazısıydı; hoparlör etiketin önünde dursun diye etiket gerçek yazıya çevrilir (aynı renk ve kalınlık) */ { let lb = ib.querySelector(":scope > .ib-lbl"); if(!lb){ ib.classList.remove("za-has-spk"); const pb = getComputedStyle(ib, "::before"); const txt = String(pb.content || "").replace(/^["\u201c]|["\u201d]$/g, ""); if(txt && txt !== "none" && txt !== "normal"){ lb = document.createElement("span"); lb.className = "ib-lbl"; lb.textContent = txt; lb.style.cssText = `font-weight:${pb.fontWeight};color:${pb.color};font-size:${pb.fontSize};white-space:pre`; b.after(lb); } } ib.classList.toggle("za-has-spk", !!ib.querySelector(":scope > .ib-lbl")); } const m = speechMuted(); b.innerHTML = m ? ZA_SPK_OFF : ZA_SPK_ON; b.setAttribute("aria-label", m ? "Sesi aç" : "Sesi kapat"); b.setAttribute("aria-pressed", m ? "true" : "false"); b.classList.toggle("off", m); }catch(e){} }
(function(){ try{ /* stil: zihin-stil.css */ }catch(e){}
 try{ const go = () => { const ib = document.getElementById("instructionBox"); if(!ib) return setTimeout(go, 500); new MutationObserver(() => { if(!document.getElementById("instrSpk") || document.getElementById("instrSpk").parentNode !== ib) zaInstrSpk(); }).observe(ib, { childList: true }); zaInstrSpk(); }; if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go(); }catch(e){}
  })();
/* KURAL (konuşma, 2026-11-05): etkinlikten/oyundan çıkınca (Harita, ana sayfa, oyun bitişi) konuşma hemen susar, altyazı balonu kapanır, bekleyen ve "kaçırılıp ilk dokunuşta okunacak" konuşmalar iptal edilir — çıkış dokunuşu önceki etkinliğin yönergesini haritada okutmaz */
/* zaStopSpeech → ZA_SPEECH */

/* KURAL (otomatik hata, 2026-11-05): yanlışı uygulamanın kendisinin saydığı dokunmalı oyunlarda (oyun modu dahil) − ve + düğmeleri görünmez; hata sayısı yalnızca okunur olarak görünür ve her yanlışta kendiliğinden artar. Elle sayılan (söylemeli) çalışmalarda − ve + kalır */
function zaAutoErrClass(){ try{ const ex = currentExercise(); const auto = !!ex && isInteractiveExercise(ex) && !usesManualErrors(ex) && !(typeof mtState !== "undefined" && mtState && mtState.manual); document.documentElement.classList.toggle("za-autoerr", auto); }catch(e){} }
(function(){  try{ const go = () => { const b = document.getElementById("board"); if(!b) return setTimeout(go, 500); new MutationObserver(() => zaAutoErrClass()).observe(b, { childList: true }); zaAutoErrClass(); }; if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go(); }catch(e){} })();
/* Başlat'ta başlık/çipler/çubuk gizlendiği, Bitir'de geri geldiği için tahta o anda bir kez yeniden yerleştirilir (resim boyu değişmez, yalnız yer); çalışma sürerken tahta dondurulur */
function zaSessionRelayout(){ try{ const h = document.documentElement; if(typeof boardIsPic === "function" && !boardIsPic()) return; const go = () => { try{ window._zaLaidGrid = null; applyBoardLayout(); if(typeof runFocusFit === "function") runFocusFit(); }catch(e){} }; requestAnimationFrame(go); setTimeout(go, 150); }catch(e){} }
/* KURAL (odak, 2026-11-05 — kullanıcı kuralı 4): Başlat'a basınca yönerge, süre satırı (Bitir) ve hata sayısı görünür kalır; başlık satırı, Kişi/Düzey/Aşama çipleri, Bugün/ödev çubuğu ve alttaki Önceki · Karıştır · Sonraki düğmeleri gizlenir; Bitir'e basınca hepsi geri gelir. Süre ve hata satırları oranlı küçüktür (hata düğmeleri 46 px) */
function runFocusOn(){ if(window.__TANI_NOFOCUS) return; const h = document.documentElement; try{ const ma = document.getElementById("mainApp"); if(ma) ma.scrollTop = 0; document.body.scrollTop = 0; window.scrollTo(0, 0); const sc = document.scrollingElement; if(sc) sc.scrollTop = 0; }catch(e){} window._fitK = 1; h.classList.add("run-focus"); try{ document.body.scrollTop = 0; window.scrollTo(0, 0); }catch(e){} runFocusSize(); runFocusWatch(); runFocusRepaint(); }
// iPhone: düzen değişikliğinden sonra tahtayı zorla yeniden çizdir (çizilmeden kalan alanlar için)
function runFocusRepaint(){ const bd = document.getElementById("board"); if(!bd) return; const kick = () => { try{ bd.style.visibility = "hidden"; void bd.offsetHeight; bd.style.visibility = ""; }catch(e){} }; requestAnimationFrame(() => { kick(); setTimeout(kick, 120); setTimeout(kick, 400); }); }
function runFocusSize(){ try{ const bd = document.getElementById("board"); if(!bd) return;
let ex = null; try{ ex = currentExercise(); }catch(e){} window._rfTap = !!(ex && isInteractiveExercise(ex) && !usesManualErrors(ex));   /* yetişkinin Hata sayısı ile puanladığı dokunmalı sayfalarda satır görünür kalır */
if(!window.__TANI_NOTIGHT) document.documentElement.classList.toggle("run-tight", window._rfTap);   /* önce sıkı düzen (dokunmalıda hata satırı gizlenir), sonra ölç */
const bar = document.querySelector(".controls"); const barH = bar && getComputedStyle(bar).display !== "none" ? bar.getBoundingClientRect().height : 0; const top = bd.getBoundingClientRect().top;
const mx = Math.max(160, Math.floor(window.innerHeight - barH - top - 10)); document.documentElement.style.setProperty("--boardMax", mx + "px"); window._rfMax = mx;
if(bd.style.maxHeight) bd.style.maxHeight = ""; delete bd.dataset.rf; delete bd.dataset.rfs; runFocusFit(); }catch(e){} }
// Odak modunda sabit boyutlu çizen tahtalar: taşarsa öğeler adım adım küçültülüp yeniden çizilir (en fazla %40)
const FIT_SHRINK = new Set(["zihni","corsi","corsi-verbal","maze","what-do","symmetry","spot-diff","copy-design","vis-draw","class-table","sudoku","plan-cubes","plan-tol","plan-beads","plan-swap","trail-animal-fruit","trail-color-shape","trail-numbers","trail-number-month","number-letter"]);
function fitShrinkStep(){ try{ const ex = currentExercise(); if(!FIT_SHRINK.has(ex.id) && !QZ[ex.id] && !ex.isMt) return false; /* soru-cevap ve etkileşimli (isMt) tahtalar küçültülebilir */ const k = window._fitK || 1; if(k <= 0.61) return false;
  window._fitK = Math.max(0.6, +(k * 0.9).toFixed(3));
  if(ex.isTrail) renderTrailBoard(); else if(ex.isPlan) renderPlanBoard(); else renderMtBoard(); return true; }catch(e){ return false; } }
function runFocusFit(){ try{ if(window.__TANI_NOFIT) return; if(!document.documentElement.classList.contains("run-focus")) return; const bd = document.getElementById("board"); if(!bd) return;
const bar = document.querySelector(".controls"); const barH = bar && getComputedStyle(bar).display !== "none" ? bar.getBoundingClientRect().height : 0; const mx = Math.max(160, Math.floor(window.innerHeight - barH - bd.getBoundingClientRect().top - 10)); window._rfMax = mx; document.documentElement.style.setProperty("--boardMax", mx + "px");
if(bd.dataset.rf !== "1" && bd.getBoundingClientRect().height > mx + 2) bd.dataset.rf = "1";   // sınır bir kez konunca çalışma boyunca kalır (gidip gelme olmasın)
if(bd.dataset.rf === "1"){ const over = bd.scrollHeight > bd.clientHeight + 2; if(over && fitShrinkStep()) return; /* küçültülebilen tahtada önce küçült, olmazsa kaydırmaya izin ver */ if(over && bd.dataset.rfs !== "1") bd.dataset.rfs = "1"; else if(!over && bd.dataset.rfs === "1" && bd.scrollHeight <= mx - 4) delete bd.dataset.rfs; } }catch(e){} }
let _rfObs = null;
function runFocusWatch(){ if(window.__TANI_NOFIT) return; const bd = document.getElementById("board"); if(!bd || !window.MutationObserver) return; if(_rfObs) _rfObs.disconnect(); let pend = false;
_rfObs = new MutationObserver(() => { if(pend) return; pend = true; requestAnimationFrame(() => { pend = false; runFocusFit(); }); }); _rfObs.observe(bd, { childList:true, subtree:true, attributes:true, attributeFilter:["class","style"] });
if(window.ResizeObserver){ if(window._rfRo) window._rfRo.disconnect(); window._rfRo = new ResizeObserver(() => { if(pend) return; pend = true; requestAnimationFrame(() => { pend = false; runFocusFit(); }); }); [...bd.children].forEach(c => window._rfRo.observe(c)); window._rfRo.observe(bd); }
[80, 300, 700].forEach(ms => setTimeout(runFocusFit, ms)); }
function runFocusOff(){ const h = document.documentElement; window._fitK = 1; h.classList.remove("run-focus"); h.classList.remove("run-tight"); if(_rfObs){ _rfObs.disconnect(); _rfObs = null; } if(window._rfRo){ window._rfRo.disconnect(); window._rfRo = null; } h.style.removeProperty("--boardMax"); const bd = document.getElementById("board"); if(bd){ if(bd.style.maxHeight) bd.style.maxHeight = ""; delete bd.dataset.rf; delete bd.dataset.rfs; } }
function runScrollLocked(){ try{ return !!timerRunning && document.documentElement.classList.contains("run-focus"); }catch(e){ return false; } }
function boardScrollable(){ const bd = document.getElementById("board"); return !!bd && bd.dataset.rfs === "1" && bd.scrollHeight > bd.clientHeight + 2; }
document.addEventListener("touchmove", (e) => { if(!runScrollLocked() || !e.cancelable) return; if(boardScrollable() && e.target && e.target.closest && e.target.closest("#board")) return; e.preventDefault(); }, { passive:false });
document.addEventListener("wheel", (e) => { if(!runScrollLocked() || !e.cancelable) return; if(boardScrollable() && e.target && e.target.closest && e.target.closest("#board")) return; e.preventDefault(); }, { passive:false });
window.addEventListener("resize", () => { if(document.documentElement.classList.contains("run-focus")) runFocusSize(); });

// ===== Tanı paneli (yalnızca ?tani=1 ile) =====
(function(){ try{ if(!/[?&]tani=1/.test(location.search)) return; window.__TANI_NOFIT = /[?&]fit=0/.test(location.search); window.__TANI_NOFOCUS = /[?&]odak=0/.test(location.search); window.__TANI_NOTIGHT = window.__TANI_NOFIT; const pn = document.createElement("div"); pn.id = "taniPanel";
pn.style.cssText = "position:fixed;left:4px;right:4px;top:calc(4px + env(safe-area-inset-top,0px));z-index:99999;background:rgba(20,20,20,.82);color:#fff;font:11px/1.35 monospace;padding:6px 8px;border-radius:8px;pointer-events:none;white-space:pre-wrap;max-height:46vh;overflow:hidden";
document.body.appendChild(pn); const R = e => { if(!e) return "yok"; const r = e.getBoundingClientRect(); return Math.round(r.top)+"→"+Math.round(r.bottom)+" h"+Math.round(r.height)+" w"+Math.round(r.width); };
const nm = e => e ? ((e.id ? "#"+e.id : e.tagName.toLowerCase()) + (e.className && typeof e.className === "string" ? "."+e.className.split(" ").slice(0,2).join(".") : "")) : "-";
setInterval(() => { try{ const bd = document.getElementById("board"), card = bd && bd.querySelector(".wm-card"), svg = card && card.querySelector("svg"), wrap = card && card.closest(".wm-wrap"), ma = document.getElementById("mainApp");
const cs = bd ? getComputedStyle(bd) : null; const L = [];
L.push("anahtar: izleyici "+(window.__TANI_NOFIT?"KAPALI":"açık")+" · odak "+(window.__TANI_NOFOCUS?"KAPALI":"açık")); L.push("ekran "+innerWidth+"x"+innerHeight+" vv "+(window.visualViewport ? Math.round(visualViewport.height)+" ofs "+Math.round(visualViewport.offsetTop) : "-")+" dpr "+devicePixelRatio+" · sınıf: "+document.documentElement.className);
L.push("kaydırma: win "+Math.round(scrollY)+" body "+document.body.scrollTop+" main "+(ma?ma.scrollTop:"-"));
L.push("tahta "+R(bd)+(cs ? " · h "+cs.height+" minh "+cs.minHeight+" maxh "+cs.maxHeight+" ovf "+cs.overflowY+" zoom "+(bd.style.zoom||"-")+" rf "+(bd.dataset.rf||"-")+"/"+(bd.dataset.rfs||"-") : ""));
L.push("kap "+R(wrap)+" · kart "+R(card)+" · svg "+R(svg)+(card ? " · kart stil "+card.getAttribute("style") : ""));
if(card){ const r = card.getBoundingClientRect(), x = Math.round(r.left + r.width/2); const seen = []; for(let y = Math.round(r.top) + 10; y <= Math.round(r.bottom) + 30; y += 20){ const el = document.elementFromPoint(x, y); seen.push(y+":"+nm(el)); } L.push("kart ortasında yukarıdan aşağı: "+seen.join("  ")); }
pn.textContent = L.join("\n"); }catch(e){ pn.textContent = "tanı hatası: "+e.message; } }, 400); }catch(e){} })();
function interactiveIsDone(){
const ex = currentExercise();
if(!isInteractiveExercise(ex) || !Array.isArray(currentGrid) || !currentGrid.length) return false;
if(typeof ex.isDone === "function") return ex.isDone();
if(ex.isSeqRows) return Array.isArray(osProg) && osProg.length === currentGrid.length && osProg.every(x => x && x.length >= 2); if(ex.isTrail) return !!trailState && trailState.next >= currentGrid.length;
if(ex.isSort)  return !!sortState && sortState.idx >= currentGrid.length;
if(ex.isTouch) return touchGoTotal() > 0 && touchGoTapped() >= touchGoTotal();
return false;
}
function ensureInteractiveStop(){
if(timerRunning && interactiveIsDone()) stopTimer();
}
document.getElementById("board").addEventListener("click", () => setTimeout(ensureInteractiveStop, 520));
window.addEventListener("resize", () => {
clearTimeout(window._trlResizeT);
window._trlResizeT = setTimeout(() => { try{ if(currentExercise().isTrail) renderTrailBoard(); }catch(e){} }, 150);
});
function trailExampleText(k){ return currentGrid.slice(0, k).map(it => it.t === "text" ? it.s : "").filter(Boolean).join(" → "); }

/* SORT_COLORS4: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
const SORT_WORD_COLORS = [{c:ACC.kirmizi, n:"kırmızı"}, {c:ACC.mavi, n:"mavi"}, {c:ACC.yesil, n:"yeşil"}, {c:ACC.mor, n:"mor"}];
function sortShapeSVG(shape, color){
switch(shape){
case "circle":   return `<circle cx="50" cy="50" r="40" fill="${color}"/>`;
case "triangle": return `<polygon points="50,10 92,88 8,88" fill="${color}"/>`;
case "star":     return `<polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38" fill="${color}"/>`;
case "cross":    return `<polygon points="36,8 64,8 64,36 92,36 92,64 64,64 64,92 36,92 36,64 8,64 8,36 36,36" fill="${color}"/>`;
case "square":   return `<rect x="14" y="14" width="72" height="72" rx="4" fill="${color}"/>`;
case "heart":    return `<path d="M50 88 C20 65 5 45 5 28 C5 10 20 2 32 2 C42 2 48 8 50 14 C52 8 58 2 68 2 C80 2 95 10 95 28 C95 45 80 65 50 88 Z" fill="${color}"/>`;
}
return "";
}
function oneShape(shape, color, size){ return `<svg viewBox="0 0 100 100" style="width:${size}px;height:${size}px;display:block;">${sortShapeSVG(shape, color)}</svg>`; }
function faceShapeCount(card, px){
const n = card.count, s = Math.round(px * (n === 1 ? 0.55 : n === 2 ? 0.38 : 0.32));
const items = Array.from({length:n}, () => oneShape(card.shape, card.color, s)).join("");
const cols = n <= 2 ? n : 2;
return `<div class="srt-face"><div style="display:grid;grid-template-columns:repeat(${cols}, auto);gap:${Math.round(px*0.04)}px;justify-items:center;">${items}</div></div>`;
}
function faceAnimalSize(card, px){
const img = FLK_IMAGES[card.animal];
const sz = card.size === "big" ? 0.9 : 0.42;
return `<div class="srt-face"><img src="${img}" alt="" style="width:${Math.round(px*sz)}px;height:${Math.round(px*sz)}px;object-fit:contain;display:block;"></div>`;
}
function faceWord(card, px){
const len = card.word.length;
const fs = Math.round(Math.min(px * 0.2, (px * 0.86) / (Math.max(3, len) * 0.68)));
return `<div class="srt-face"><span class="srt-word" style="color:${card.color};font-size:${fs}px;">${trUpper(card.word)}</span></div>`;
}
const SORT_WORDS = {
hayvan:  {1:["at","fil","koç","kuş"], 2:["kedi","köpek","aslan","tavşan"], 3:["zürafa","kelebek","papağan","karınca"], 4:["kaplumbağa","devekuşu","orangutan"]},
yiyecek: {1:["süt","bal","nar"], 2:["ekmek","peynir","havuç","karpuz","elma"], 3:["domates","patates","portakal"], 4:["mandalina","çikolata","karnabahar"]},
"eşya":  {1:["top","ip","zil"], 2:["masa","kalem","kaşık","dolap"], 3:["sandalye","tencere","anahtar","şemsiye"], 4:["televizyon","bilgisayar","buzdolabı"]},
"taşıt": {1:["tır","jip","yat"], 2:["gemi","kamyon","uçak","tekne"], 3:["araba","otobüs","bisiklet"], 4:["motosiklet","denizaltı","helikopter"]}
};
const SORT_CATS = ["hayvan","yiyecek","eşya","taşıt"];
const SORT_SPECS = {
"sort-color-shape": {
dims: [{key:"color", name:"renk", acc:"RENGE"}, {key:"shape", name:"şekil", acc:"ŞEKLE"}],
refs: () => { const c = shuffleArray([ACC.kirmizi,ACC.mavi,ACC.sari,ACC.yesil]).slice(0, 2), sh = shuffleArray(["circle","triangle","square","star"]).slice(0, 2);
return [{color:c[0], shape:sh[0]}, {color:c[1], shape:sh[1]}]; },
face: (c, px) => `<div class="srt-face">${oneShape(c.shape, c.color, Math.round(px*0.62))}</div>`
},
"sort-animal-size": {
dims: [{key:"animal", name:"hayvan türü", acc:"HAYVAN TÜRÜNE"}, {key:"size", name:"büyüklük", acc:"BÜYÜKLÜĞE"}],
refs: () => { const a = shuffleArray(["cat","dog","rabbit"]).slice(0, 2), big = Math.random() < 0.5;
return [{animal:a[0], size: big ? "big" : "small"}, {animal:a[1], size: big ? "small" : "big"}]; },
face: faceAnimalSize
},
"sort-color-shape-count": {
dims: [{key:"color", name:"renk", acc:"RENGE"}, {key:"shape", name:"şekil", acc:"ŞEKLE"}, {key:"count", name:"sayı", acc:"ŞEKİL SAYISINA"}],
refs: () => {
const k = sortRefN();   /* düzeye göre 2-3-4 örnek kart */
const c = shuffleArray([ACC.kirmizi,ACC.yesil,ACC.sari,ACC.mavi,ACC.mor]).slice(0, k);
const sh = shuffleArray(["triangle","star","cross","circle","square","heart"]).slice(0, k);
const n = shuffleArray([1, 2, 3, 4]).slice(0, k);
return Array.from({length:k}, (_, i) => ({color:c[i], shape:sh[i], count:n[i]}));
},
face: faceShapeCount
},
"sort-words": {
dims: [{key:"cat", name:"anlam kategorisi", acc:"ANLAM KATEGORİSİNE"}, {key:"syl", name:"hece sayısı", acc:"HECE SAYISINA"}, {key:"color", name:"yazı rengi", acc:"YAZI RENGİNE"}],
refs: () => {
const k = sortRefN();   /* düzeye göre 2-3-4 örnek kart */
const syl = shuffleArray([1, 2, 3, 4]), col = shuffleArray(SORT_WORD_COLORS.map(x => x.c));
return shuffleArray(SORT_CATS.slice()).slice(0, k).map((cat, i) => ({ word: randomItem(SORT_WORDS[cat][syl[i]]), cat, syl: syl[i], color: col[i] }));
},
face: faceWord,
wide: true        // kelimeler için geniş (yatay) kartlar, örnek kartlar 2x2
}
};
/* SORT_PER_PHASE: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
const sortRefN = () => isPre() ? 4 : ([2, 3, 4][currentCombo().t] || 4);   /* üç boyutlu sıralamada örnek kart sayısı düzeye göre 2-3-4 */
/* PRE_SORT_PER_PHASE: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
let sortState = null;
let sortLastRules = "";
function sortSpec(){ return SORT_SPECS[currentExercise().id]; }
function sortMatchIndex(card, dimKey, refs){ return refs.findIndex(r => r[dimKey] === card[dimKey]); }
function makeConflictCard(spec, refs){
let idx = shuffleArray(refs.map((_, i) => i)).slice(0, spec.dims.length);
if(refs.length < spec.dims.length){ let g = 0; do{ idx = spec.dims.map(() => Math.floor(Math.random() * refs.length)); g++; } while(g < 50 && idx.every(x => x === idx[0])); }   /* örnek kart boyut sayısından azsa: her boyut bir karttan, ama hiçbir örnek kartın kopyası değil */
const card = {};
spec.dims.forEach((d, k) => { card[d.key] = refs[idx[k]][d.key]; });
if(spec === SORT_SPECS["sort-words"]){
const pool = (SORT_WORDS[card.cat] || {})[card.syl] || [];
card.word = randomItem(pool.filter(w => !refs.some(r => r.word === w)));
}
return card;
}
function makeSortDeck(){
const spec = sortSpec();
const t = currentCombo().t;
const totalN = selCount(), per = Math.round(totalN / spec.dims.length);   /* toplam kart sayısı ortak kuraldan */
const perOf = (ph) => Math.floor(totalN / spec.dims.length) + (ph < totalN % spec.dims.length ? 1 : 0);
let rules, g = 0;
do{ rules = shuffleArray(spec.dims.map(d => d.key)); g++; } while(g < 20 && rules.join("|") === sortLastRules);
sortLastRules = rules.join("|");
let refs, gR = 0;
do{ refs = shuffleArray(spec.refs()); gR++; }
while(gR < 20 && JSON.stringify(refs.map(r => JSON.stringify(r)).sort()) === sortState?.lastRefsKey);
const refsKey = JSON.stringify(refs.map(r => JSON.stringify(r)).sort());
const d0 = spec.dims[0].key, d1 = spec.dims[1].key;
const crossTests = refs.length === 2 && spec.dims.length === 2 ? [{[d0]: refs[1][d0], [d1]: refs[0][d1]}, {[d0]: refs[0][d0], [d1]: refs[1][d1]}] : null;
const cards = [];
for(let ph = 0; ph < rules.length; ph++){
for(let k = 0; k < perOf(ph); k++){
let c, gg = 0;
do{
c = crossTests ? Object.assign({}, randomItem(crossTests)) : makeConflictCard(spec, refs);
gg++;
} while(gg < 30 && cards.length && JSON.stringify(cards[cards.length-1]) === JSON.stringify(c));
c.phase = ph;
cards.push(c);
}
}
{
const k = refs.length;
let pos, g2 = 0;
do{
pos = shuffleArray(cards.map((_, i) => i % k));
let run = 1, ok = true;
for(let i = 1; i < pos.length; i++){ run = pos[i] === pos[i-1] ? run + 1 : 1; if(run > 2){ ok = false; break; } }
if(ok) break;
g2++;
} while(g2 < 500);
let prevOrder = "";
cards.forEach((c, i) => {
const ans = sortMatchIndex(c, rules[c.phase], refs);
let order, g3 = 0;
do{
const others = shuffleArray(refs.map((_, r) => r).filter(r => r !== ans));
order = others.slice(0, pos[i]).concat([ans], others.slice(pos[i]));
g3++;
} while(g3 < 20 && k > 2 && order.join() === prevOrder);
prevOrder = order.join();
c.order = order;
});
}
sortState = { refs, rules, per, idx:0, wrong:0, persev:0, locked:false, lastRefsKey: refsKey };
return cards;
}
function sortRuleText(ph){ const d = sortSpec().dims.find(x => x.key === sortState.rules[ph]); return d ? d.acc : ""; }
function sortRuleOrderText(){
return sortState.rules.map((r, i) => sortSpec().dims.find(d => d.key === r).acc).join(", sonra ");
}
function sortSizes(board){
const nRef = sortState.refs.length;
const bw = (board.clientWidth || 360) - 28;
const isLs = landscapeMQ.matches;
const wide = !!sortSpec().wide;
const h = (board.clientHeight || 280) - 70;
if(wide){
const refCols = 2;
let ref = Math.min(170, Math.floor((isLs ? bw * 0.5 : bw) - 10) / 2);
let card = Math.min(240, Math.round(isLs ? bw * 0.36 : bw * 0.7));
if(isLs){ ref = Math.min(ref, Math.floor((h / 2 - 8) / 0.5)); card = Math.min(card, Math.floor(h * 0.55 / 0.5)); }
return { ref: Math.floor(ref), refH: Math.round(ref * 0.5), card, cardH: Math.round(card * 0.5), refCols };
}
const refCols = isLs ? Math.min(nRef, 2) : nRef;
let ref = Math.min(isLs ? 110 : 110, Math.floor((bw - (nRef - 1) * 10) / nRef));
let card = Math.min(isLs ? 130 : 140, Math.round(bw * 0.42));
if(isLs){
ref = Math.min(ref, Math.floor((nRef > 2 ? h / 2 - 8 : h * 0.8) / 1.15));
card = Math.min(card, Math.floor(h * 0.6 / 1.15));
}
return { ref, refH: Math.round(ref * 1.15), card, cardH: Math.round(card * 1.15), refCols };
}
function renderSortBoard(){ try{
const board = document.getElementById("board");
board.style.display = "block";
board.style.minHeight = "";
board.style.padding = landscapeMQ.matches ? "8px 10px" : "14px";
board.style.gridTemplateColumns = "";
board.style.gridTemplateRows = "";
board.classList.remove("wide-grid");
if(!sortState) return;
const spec = sortSpec();
const { ref, refH, card, cardH, refCols } = sortSizes(board);
const st = sortState;
const cur = currentGrid[st.idx];
const done = st.idx >= currentGrid.length;
const ph = done ? st.rules.length - 1 : cur.phase;
const order = (cur && cur.order) || (currentGrid[currentGrid.length-1] && currentGrid[currentGrid.length-1].order) || st.refs.map((_, i) => i);
const refsHtml = order.map(i => { const r = st.refs[i];
return `<div class="srt-ref" data-ref="${i}" style="width:${ref}px;height:${refH}px;">${spec.face(r, Math.min(ref, spec.wide ? ref : refH))}</div>`; }).join("");
const isLs = landscapeMQ.matches;
const middle = done
? `<div class="srt-card" style="width:${card}px;height:${cardH}px;border-style:solid;"><div style="font-weight:800;text-align:center;padding:8px;">Bitti 🎉<br><span style="font-size:13px;font-weight:600;">${st.wrong} hata · ${st.persev} perseverasyon</span></div></div>`
: `<div class="srt-card" style="width:${card}px;height:${cardH}px;">${spec.face(cur, card)}</div>`;
const info = `<div class="srt-rule${st.justChanged ? " changed" : ""}" id="srtRule">Kural: ${sortRuleText(ph)} göre</div>` +
`<div class="srt-prog">Kart ${Math.min(st.idx + 1, currentGrid.length)} / ${currentGrid.length}</div>`;
board.innerHTML = isLs
? `<div class="srt-wrap" style="flex-direction:row;justify-content:center;gap:18px;">` +
`<div style="display:flex;flex-direction:column;align-items:center;gap:6px;">${info}${middle}</div>` +
`<div class="srt-refs" style="${st.refs.length % refCols ? `display:flex;flex-wrap:wrap;justify-content:center;max-width:${refCols * ref + (refCols - 1) * 10}px;margin:0 auto` : `grid-template-columns:repeat(${refCols}, ${ref}px)`};">${refsHtml}</div></div>`
: `<div class="srt-wrap">${info}${middle}<div class="srt-refs" style="margin-top:6px;${st.refs.length % refCols ? `display:flex;flex-wrap:wrap;justify-content:center;max-width:${refCols * ref + (refCols - 1) * 10}px;margin:6px auto 0` : `grid-template-columns:repeat(${refCols}, ${ref}px)`};">${refsHtml}</div></div>`; /* KURAL (kart eşleme düzeni, 2026-11-09): dikeyde eşlenecek tek kart üstte, seçilecek örnek kartlar altta (parmak altta seçer, kart görünür kalır) */
st.justChanged = false;
}finally{ try{ zaTapRestore(); }catch(e){} } }
function handleSortTap(ev){
const ex = currentExercise();
if(!ex.isSort || !sortState) return;
const el = ev.target.closest(".srt-ref");
if(!el) return;
const st = sortState;
if(st.locked || st.idx >= currentGrid.length) return;
if(!timerRunning){ showLevelFlash("Önce ▶ Başlat'a basın, sonra çocuk dokunsun.", "down"); return; }
const chosen = Number(el.dataset.ref);
const cur = currentGrid[st.idx];
const ruleKey = st.rules[cur.phase];
const correct = sortMatchIndex(cur, ruleKey, st.refs) === chosen;
el.classList.add(correct ? "ok" : "bad");
gameSfx(correct ? "correct" : "wrong");
if(!correct){
st.wrong++;
if(cur.phase > 0 && sortMatchIndex(cur, st.rules[cur.phase - 1], st.refs) === chosen) st.persev++;
setErrorCount(currentErrorCount + 1);
try{ vibrate(60); }catch(e){}
}
st.locked = true;
setTimeout(() => {
st.locked = false;
st.idx++;
if(st.idx >= currentGrid.length){
renderSortBoard();
stopTimer();
showLevelFlash(`Bitti! ${st.wrong} hata, ${st.persev} perseverasyon.`, st.wrong ? "down" : "levelup");
return;
}
if(currentGrid[st.idx].phase !== currentGrid[st.idx - 1].phase){
st.justChanged = true;
if(typeof gameMode !== "undefined" && gameMode) showLevelFlash(`Kural değişti! Şimdi ${sortRuleText(currentGrid[st.idx].phase)} göre eşleştir.`, "levelup");
else showLevelFlash(`KURAL DEĞİŞTİ! Çocuğa söyleyin: "Şimdi ${sortRuleText(currentGrid[st.idx].phase)} göre eşleştir."`, "levelup");
if(typeof gameMode !== "undefined" && gameMode) speakText(`Kural değişti. Şimdi ${sortRuleText(currentGrid[st.idx].phase).toLocaleLowerCase("tr-TR")} göre eşleştir.`);
}
renderSortBoard();
}, 260);
}
document.getElementById("board").addEventListener("click", (ev) => {
if(zaFastSeen(ev)) return;
handleSortTap(ev);
});
window.addEventListener("resize", () => {
clearTimeout(window._srtResizeT);
window._srtResizeT = setTimeout(() => { try{ if(currentExercise().isSort) renderSortBoard(); }catch(e){} }, 150);
});
function sortInstruction(){
return `Önce <b>▶ Başlat</b>'a basın, sonra çocuk ekrana dokunsun. Çocuğa örnek kartları gösterin ve <b>"Tek kartı ${sortRuleText(0)} göre, ona uyan örnek karta dokunarak eşleştir"</b> deyin. ` +
`Kural sırası: <b>${sortRuleOrderText()}</b>. Kural değişince ekranda uyarı çıkar; o an çocuğa yeni kuralı söyleyin. Hataları uygulama sayar; bir önceki kurala göre yapılan yanlışlar <i>perseverasyon</i> olarak ayrıca gösterilir. <i>Kural sırası her sayfada ve Karıştır'da değişir.</i>`;
}

const PRE_OBJECTS_BY_TIER = [
["lion","jacket","bread"],
["lion","zebra","jacket","bread"],
["lion","zebra","jacket","tshirt","bread","orange"]
];
const OBJECTS_BY_TIER = [
["lion","jacket","bread"],
["lion","zebra","jacket","tshirt","bread","orange"],
["lion","zebra","monkey","jacket","tshirt","jeans","bread","orange","chocolate"]
];
const OBJECT_NAMES = {lion:"aslan", zebra:"zebra", monkey:"maymun", dog:"köpek", cat:"kedi", cow:"inek", jacket:"kot ceket", tshirt:"tişört", jeans:"kot pantolon", bread:"ekmek", orange:"portakal", chocolate:"çikolata"};
const OBJECT_CATEGORY = {lion:"hayvan", zebra:"hayvan", monkey:"hayvan", dog:"hayvan", cat:"hayvan", cow:"hayvan", jacket:"giysi", tshirt:"giysi", jeans:"giysi", bread:"yiyecek", orange:"yiyecek", chocolate:"yiyecek"};



/* objectSVG: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */

/* FRUITS: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
/* VEGETABLES: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
const FRUITS_AND_VEGGIES = [...FRUITS, ...VEGETABLES];
const PRE_FRUITS_AND_VEGGIES = [...FRUITS.slice(0,3), ...VEGETABLES.slice(0,3)];
const FRUIT_VEG_NAMES = {
apple:"elma", banana:"muz", grapes:"üzüm", strawberry:"çilek", orange:"portakal",
carrot:"havuç", tomato:"domates", cucumber:"salatalık", pepper:"biber", broccoli:"brokoli"
};
const FRUIT_VEG_CATEGORY = {
apple:"meyve", banana:"meyve", grapes:"meyve", strawberry:"meyve", orange:"meyve",
carrot:"sebze", tomato:"sebze", cucumber:"sebze", pepper:"sebze", broccoli:"sebze"
};


const FV_SIZE_SCALE = {large:1.0, small:0.55};

function fruitVegInnerSVG(name){
switch(name){
case "apple":
return `<ellipse cx="52" cy="90" rx="34" ry="6" fill="#000" opacity="0.08"/>
<path d="M50 30 C30 22 12 38 12 60 C12 80 28 94 46 94 C50 94 50 90 54 90 C58 90 58 94 62 94 C80 94 96 80 96 60 C96 38 78 22 58 30 C56 24 58 16 64 10 C56 8 50 16 50 30 Z" fill="#E0392E"/>
<path d="M58 30 C78 22 96 38 96 60 C96 80 80 94 62 94 C58 94 58 90 54 90 C58 90 62 88 70 78 C82 64 82 42 68 32 C64 29 60 29 58 30 Z" fill="#B82820" opacity="0.55"/>
<path d="M50 30 C48 18 40 12 34 12 C36 20 42 26 50 28 Z" fill="#3D7A45"/>
<path d="M50 28 C46 22 40 18 36 16 C39 21 43 25 48 27 Z" fill="#5FAE68" opacity="0.6"/>
<path d="M50 30 C50 24 52 18 56 13" fill="none" stroke="#6B4A2A" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="32" cy="44" rx="12" ry="16" fill="#fff" opacity="0.3"/>
<circle cx="27" cy="38" r="4" fill="#fff" opacity="0.55"/>`;
case "banana":
return `<ellipse cx="52" cy="90" rx="34" ry="6" fill="#000" opacity="0.08"/>
<path d="M18 70 C10 50 18 24 42 14 C47 12 52 17 48 21 C30 30 22 50 28 64 C34 76 50 80 62 74 C72 69 78 58 80 48 C81 43 90 44 89 50 C86 68 72 84 52 88 C36 91 24 84 18 70 Z" fill="#F6C445"/>
<path d="M42 14 C45 11 51 11 53 15 L48 21 C46 18 44 16 42 14 Z" fill="#6B4A22"/>
<path d="M28 64 C24 50 30 32 44 22" fill="none" stroke="#C98F1A" stroke-width="4" stroke-linecap="round" opacity="0.4"/>
<path d="M24 62 C21 50 26 34 38 24" fill="none" stroke="#FCE79A" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>`;
case "grapes":
return `<ellipse cx="46" cy="88" rx="26" ry="5" fill="#000" opacity="0.08"/>
<path d="M50 14 C46 8 52 4 57 8 C55 3 62 1 65 6" fill="none" stroke="#4F9D5A" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="36" cy="30" r="11" fill="#6B4C9A"/>
<circle cx="54" cy="28" r="11" fill="#7A5CAE"/>
<circle cx="68" cy="34" r="10" fill="#6B4C9A"/>
<circle cx="28" cy="46" r="11" fill="#7A5CAE"/>
<circle cx="46" cy="46" r="11" fill="#6B4C9A"/>
<circle cx="62" cy="50" r="10" fill="#7A5CAE"/>
<circle cx="36" cy="62" r="10" fill="#6B4C9A"/>
<circle cx="52" cy="64" r="10" fill="#7A5CAE"/>
<circle cx="42" cy="78" r="9" fill="#6B4C9A"/>
<ellipse cx="32" cy="26" rx="3.5" ry="4.5" fill="#fff" opacity="0.35"/>
<circle cx="50" cy="24" r="2" fill="#fff" opacity="0.5"/>
<ellipse cx="24" cy="42" rx="2.5" ry="3.5" fill="#fff" opacity="0.3"/>`;
case "strawberry":
return `<ellipse cx="52" cy="90" rx="28" ry="6" fill="#000" opacity="0.08"/>
<path d="M50 30 L38 14 L50 20 L58 10 L62 22 L74 16 L66 30 Z" fill="#4F9D5A"/>
<path d="M42 16 L38 14 L44 22 Z" fill="#3D7A45"/>
<path d="M50 30 C30 30 18 46 22 64 C26 82 40 94 50 94 C60 94 74 82 78 64 C82 46 70 30 50 30 Z" fill="#E8455A"/>
<path d="M58 30 C72 32 82 46 78 64 C74 82 60 94 50 94 C56 92 66 82 70 66 C74 50 68 38 56 32 Z" fill="#C22B40" opacity="0.5"/>
<circle cx="38" cy="54" r="2.4" fill="#FCE79A"/>
<circle cx="50" cy="46" r="2.4" fill="#FCE79A"/>
<circle cx="62" cy="54" r="2.4" fill="#FCE79A"/>
<circle cx="42" cy="70" r="2.4" fill="#FCE79A"/>
<circle cx="58" cy="70" r="2.4" fill="#FCE79A"/>
<circle cx="50" cy="82" r="2.4" fill="#FCE79A"/>
<ellipse cx="34" cy="48" rx="8" ry="10" fill="#fff" opacity="0.25"/>
<circle cx="30" cy="42" r="3" fill="#fff" opacity="0.45"/>`;
case "orange":
return `<ellipse cx="52" cy="92" rx="34" ry="6" fill="#000" opacity="0.08"/>
<circle cx="50" cy="54" r="38" fill="#F5A038"/>
<path d="M64 22 C82 30 92 48 88 66 C84 82 68 92 52 92 C62 88 74 76 78 60 C82 42 76 30 62 24 Z" fill="#D67A1E" opacity="0.45"/>
<path d="M50 16 C46 10 52 6 56 10" fill="none" stroke="#4F9D5A" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="36" cy="38" rx="10" ry="13" fill="#fff" opacity="0.28"/>
<circle cx="31" cy="32" r="3.5" fill="#fff" opacity="0.5"/>`;
case "carrot":
return `<ellipse cx="46" cy="93" rx="20" ry="5" fill="#000" opacity="0.08"/>
<path d="M50 32 L61 90 C62 95 55 98 52 93 L46 80 L40 92 C37 97 30 94 32 89 L42 32 Z" fill="#EE8B2E"/>
<path d="M50 32 L61 90 C62 95 55 98 52 93 L48 84 C52 68 52 46 50 32 Z" fill="#C96A16" opacity="0.5"/>
<path d="M46 32 C40 14 46 4 54 4 C56 14 52 26 46 32 Z" fill="#4F9D5A"/>
<path d="M50 8 C52 14 50 22 46 28" fill="none" stroke="#3D7A45" stroke-width="2" opacity="0.6"/>
<path d="M46 30 C34 20 20 20 14 26 C22 28 26 34 34 34 Z" fill="#4F9D5A"/>
<path d="M50 30 C62 20 76 20 82 26 C74 28 70 34 62 34 Z" fill="#4F9D5A"/>
<ellipse cx="40" cy="50" rx="4" ry="10" fill="#fff" opacity="0.2"/>`;
case "tomato":
return `<ellipse cx="52" cy="94" rx="36" ry="6" fill="#000" opacity="0.08"/>
<ellipse cx="50" cy="60" rx="38" ry="32" fill="#EE4C30"/>
<path d="M64 28 C82 36 90 54 84 70 C80 82 66 90 52 92 C64 86 76 74 78 58 C80 44 74 34 60 30 Z" fill="#C4331E" opacity="0.5"/>
<path d="M50 26 L54 34 L50 30 L46 34 Z" fill="#4F9D5A"/>
<path d="M38 24 C42 30 45 34 45 34 C40 32 33 31 28 26 Z" fill="#4F9D5A"/>
<path d="M62 24 C58 30 55 34 55 34 C60 32 67 31 72 26 Z" fill="#4F9D5A"/>
<path d="M50 24 C48 30 48 34 50 38 C52 34 52 30 50 24 Z" fill="#3D6B2E"/>
<ellipse cx="35" cy="46" rx="10" ry="12" fill="#fff" opacity="0.28"/>
<circle cx="30" cy="40" r="3.5" fill="#fff" opacity="0.5"/>`;
case "eggplant":
return `<ellipse cx="50" cy="94" rx="26" ry="6" fill="#000" opacity="0.08"/>
<path d="M50 30 C46 20 34 14 26 16 C32 22 34 28 40 30 Z" fill="#4F9D5A"/>
<path d="M50 30 C54 20 66 14 74 16 C68 22 66 28 60 30 Z" fill="#4F9D5A"/>
<rect x="47" y="14" width="6" height="14" rx="3" fill="#3D6B2E"/>
<path d="M50 30 C30 30 20 50 24 68 C28 86 40 96 52 92 C66 88 76 70 72 50 C69 36 60 30 50 30 Z" fill="#63417A"/>
<path d="M60 32 C70 40 74 54 70 68 C66 82 56 90 50 92 C58 86 64 74 66 60 C68 46 64 38 56 32 Z" fill="#452A57" opacity="0.55"/>
<ellipse cx="38" cy="50" rx="9" ry="13" fill="#fff" opacity="0.22"/>
<circle cx="33" cy="44" r="3" fill="#fff" opacity="0.4"/>`;
case "pepper":
return `<ellipse cx="48" cy="90" rx="18" ry="5" fill="#000" opacity="0.08"/>
<rect x="43" y="2" width="9" height="11" rx="3" fill="#3D6B2E"/>
<path d="M40 16 C34 10 44 4 51 10 C60 8 66 15 61 21 C74 30 80 48 73 66 C67 82 51 92 41 85 C35 81 33 73 37 67 C48 71 60 61 62 45 C64 31 54 21 43 19 C40 18 38 18 40 16 Z" fill="#57A85F"/>
<path d="M58 22 C68 32 72 46 66 62 C61 76 49 86 41 84 C48 80 58 70 62 56 C66 42 60 30 52 22 Z" fill="#3D7A45" opacity="0.55"/>
<ellipse cx="52" cy="32" rx="6" ry="12" fill="#fff" opacity="0.25"/>
<circle cx="50" cy="24" r="2.5" fill="#fff" opacity="0.45"/>`;
case "broccoli":
return `<ellipse cx="50" cy="92" rx="20" ry="5" fill="#000" opacity="0.08"/>
<rect x="42" y="60" width="16" height="30" rx="6" fill="#DCE6C8"/>
<rect x="50" y="60" width="8" height="30" rx="4" fill="#C7D4AE" opacity="0.6"/>
<circle cx="30" cy="56" r="13" fill="#356B32"/>
<circle cx="70" cy="56" r="13" fill="#356B32"/>
<circle cx="40" cy="46" r="16" fill="#3E7D3A"/>
<circle cx="60" cy="46" r="16" fill="#3E7D3A"/>
<circle cx="50" cy="32" r="16" fill="#4F9D5A"/>
<ellipse cx="44" cy="26" rx="5" ry="4" fill="#fff" opacity="0.25"/>
<ellipse cx="34" cy="50" rx="4" ry="3" fill="#fff" opacity="0.2"/>`;
}
}

function fruitVegSVG(name, size){
const scale = FV_SIZE_SCALE[size] || 1;
const src = FRUIT_VEG_IMAGES[name];
if(src){
const pct = (scale * 100).toFixed(0);
return `<img src="${src}" alt="" style="width:${pct}%;height:${pct}%;object-fit:contain;display:block;">`;
}
return `<svg viewBox="0 0 100 100"><g transform="translate(50 50) scale(${scale}) translate(-50 -50)">${fruitVegInnerSVG(name)}</g></svg>`;
}

function colorSwatchHTML(color){
return `<svg viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" rx="16" fill="${color}"/></svg>`;
}

function arrowSVG(direction, color){
const rot = {up:0, right:90, down:180, left:270}[direction] || 0;
return `<svg viewBox="0 0 100 100" style="transform:rotate(${rot}deg)"><polygon points="50,6 90,55 65,55 65,94 35,94 35,55 10,55" fill="${color}"/></svg>`;
}

function polygonSVG(sides, color){
const pts = [];
for(let i=0;i<sides;i++){
const angle = (Math.PI*2*i/sides) - Math.PI/2;
pts.push((50+44*Math.cos(angle)).toFixed(1) + "," + (50+44*Math.sin(angle)).toFixed(1));
}
return `<svg viewBox="0 0 100 100"><polygon points="${pts.join(' ')}" fill="${color}"/></svg>`;
}

function litCircleHTML(lit, color){
return lit
? `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="${color}"/></svg>`
: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#D9E2E2" stroke-width="4"/></svg>`;
}

const SIZE_LABELS = {small:"küçük", medium:"orta", large:"büyük"};
const SIZE_SCALE = {small:0.5, medium:0.75, large:1.0};
function sizedCircleHTML(size, color){
const scale = SIZE_SCALE[size];
return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="${42*scale}" fill="${color}"/></svg>`;
}

/* KURAL (içerik uyumu): hatırlama listelerinde bir sayfada aynı öğe iki kez gelmez; havuz en zor düzeydeki öğe sayısından (25) büyüktür */
const WORD_POOL = ["kalem","masa","elma","kapı","kitap","bardak","pencere","anahtar","deniz","balık","yıldız","köprü","güneş","bulut","ağaç","çiçek","kuş","araba","top","şapka","ayna","çanta","saat","yastık","halı","dolap","kutu","peynir","ekmek","limon","köpek","kedi","tren","vapur","orman","dağ","nehir","kar","yağmur","ay"];
const PHRASE_POOL = ["kırmızı top","büyük ev","hızlı araba","yeşil ağaç","tatlı elma","küçük kedi","uzun yol","soğuk su","sıcak çorba","mavi deniz","yumuşak yastık","eski ayakkabı","yüksek dağ","parlak yıldız","sessiz orman","sarı balon","kısa merdiven","derin göl","taze ekmek","beyaz bulut","sıcak güneş","ıslak şemsiye","kocaman fil","minik kuş","tuzlu peynir","ekşi limon","karanlık oda","geniş bahçe","dar sokak","ağır çanta","hafif tüy","keskin bıçak","yuvarlak masa","uzun kuyruk","sıcak ekmek","serin rüzgar"];
const CATEGORY_WORDS = {
"meyve": ["elma","muz","çilek","karpuz","armut","kiraz"],
"hayvan": ["kedi","köpek","aslan","inek","tavşan","zürafa"],
"taşıt": ["araba","uçak","gemi","tren","bisiklet","otobüs"],
"giysi": ["ceket","etek","çorap","kazak","pantolon","şapka"],
"mobilya": ["masa","sandalye","dolap","koltuk","yatak","kitaplık"],
"renk": ["mavi","sarı","kırmızı","yeşil","mor","turuncu"],
"sebze": ["havuç","patates","soğan","ıspanak","salatalık","pırasa"],
"kuş": ["serçe","kartal","güvercin","karga","baykuş","papağan"],
"meslek": ["doktor","öğretmen","aşçı","pilot","itfaiyeci","berber"],
"müzik aleti": ["davul","gitar","piyano","keman","flüt","bağlama"],
"mutfak eşyası": ["kaşık","tabak","tencere","çatal","bardak","tava"],
"vücut bölümü": ["kol","bacak","burun","kulak","dirsek","diz"]
};
const WG_TIERS = [["meyve","hayvan","taşıt"], ["meyve","hayvan","taşıt","giysi","mobilya","renk"], Object.keys(CATEGORY_WORDS)];
let sylWordCycle = null;
const SYLLABLE_WORDS = [ {word:"el", syl:1}, {word:"kalem", syl:2}, {word:"kitaplık", syl:3}, {word:"bilgisayar", syl:4}, {word:"top", syl:1}, {word:"masa", syl:2}, {word:"pencere", syl:3}, {word:"televizyon", syl:4}, {word:"su", syl:1}, {word:"kapı", syl:2}, {word:"araba", syl:3}, {word:"otomobil", syl:4}, {word:"kol", syl:1}, {word:"kedi", syl:2}, {word:"elbise", syl:3}, {word:"helikopter", syl:4}, {word:"at", syl:1}, {word:"ördek", syl:2}, {word:"kaplumbağa", syl:4}, {word:"portakal", syl:3}, {word:"muz", syl:1}, {word:"tren", syl:1}, {word:"bahçe", syl:2}, {word:"salatalık", syl:4}, {word:"dondurma", syl:3}, {word:"bisiklet", syl:3}, {word:"ekmek", syl:2} ];
const ANTONYM_PAIRS = [
{word:"büyük", opp:"küçük"}, {word:"sıcak", opp:"soğuk"}, {word:"hızlı", opp:"yavaş"},
{word:"açık", opp:"kapalı"}, {word:"uzun", opp:"kısa"}, {word:"temiz", opp:"kirli"},
{word:"mutlu", opp:"üzgün"}, {word:"ağır", opp:"hafif"}, {word:"içinde", opp:"dışında"},
{word:"dolu", opp:"boş"}, {word:"üstünde", opp:"altında"}
];

