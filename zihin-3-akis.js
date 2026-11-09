/* Zihin Atölyesi — zihin-3-akis.js (3/8): alanlar (CATEGORIES), sıra, kişi düzeyleri, yaşam döngüsü (ZA_LIFE), Başlat/Bitir/Sıfırla, kayıt, alan düzeyi geçişi. Dosyalar zihin-atolyesi.html'de bu sırayla yüklenir; sıra değiştirilemez (önceki tek dosyanın ardışık parçalarıdır). */
const CATEGORIES = [
{
id:"oyun-parki",
hidden:true,
readingLevel:["pre","post"],
label:"Oyun Parkı",
sub:"Kısa, tekrar oynanabilir oyunlar: dikkat, tepki, göz–el, bellek, dil, mantık, görsel-uzamsal ve yürütücü işlev · 👥 birlikte oyna",
purpose:"Bilişsel becerileri oyun mekaniğinin içinde, kısa ve tekrar oynanabilir oyunlarla çalıştırır.",
color:"#62C1FA",
group:"Oyun",
exerciseIds:["pk-balloon","pk-bag","pk-word","pk-slide","pk-redlight","pk-mole","pk-simon","pk-shadow","pk-waiter","pk-rhyme","pk-catch","pk-light","pk-bridge","pk-drum","pk-train","pk-escape"]
},
{
id:"islemleme-hizi",
readingLevel:["post"],
label:"İşlemleme Hızı",
sub:"Hızlı Adlandırma · Hızlı Dokunma · Simge Arama · Hızlı Karar",
purpose:"Görsel bilgiyi hızlı ve doğru biçimde tarama, eşleme, isimlendirme ve karar verme becerisini çalıştırır; bu beceriler okuma akıcılığıyla ilişkilendirilir.",
color:"#2E6F6E",
group:"Hız & Dikkat",
exerciseIds:["shape-color","cat-cold","trail-numbers","object-name","cat-living","fruit-veg","touch-card","pairs-touch","number-color","cat-fruit","ran-letter","pair-match","taste-name","dot-count","search-symbol","hot-cold","sdmt-touch","symbol-image","sem-decide","choice-reaction","quick-sort","origin-order","living-nonliving","sent-verify","number-find","search-letter","search-object","search-shape"] /* KURAL (karışık sıra, 2026-11-09): İşlemleme Hızı'nda dokunmalı ve söylemeli çalışmalar dönüşümlü dizilir; aynı biçim art arda 3'ten fazla gelmez (Doğru-Yanlış Eşleşme silinince dokunmalılar sona yığılmıştı) */,
exerciseGroups:[["Hızlı Adlandırma", ["shape-color", "object-name", "fruit-veg", "number-color", "ran-letter", "taste-name", "hot-cold", "symbol-image", "choice-reaction", "living-nonliving"]], ["Hızlı Dokunma", ["cat-cold", "trail-numbers", "cat-living", "sdmt-touch", "quick-sort", "touch-card", "pairs-touch", "cat-fruit"]], ["Simge Arama", ["search-object", "pair-match", "search-symbol", "search-shape", "search-letter"]], ["Hızlı Karar", ["dot-count", "number-find", "origin-order", "sem-decide", "sent-verify"]]]
},
{
id:"goz-takip",
readingLevel:["pre","post"],
label:"Göz Takip",
sub:"Yumuşak İzleme · Sıçrama · Hedef ve Bakış",
purpose:"Gözlerin hareketli bir hedefi baş hareketi olmadan izlemesini, bir noktadan diğerine hızlı sıçramasını ve göz–el koordinasyonunu çalıştırır.",
color:"#C97F32",
group:"Hız & Dikkat",
exerciseIds:["eye-horizontal","eye-vertical","periph","eye-diagonal","eye-diagonal2","eye-wave","eye-touch","eye-steep-wave","eye-depth","eye-square","fixation","eye-triangle","eye-star","eye-junction","finger-trace","eye-crossbox","eye-saccade-two","eye-saccade-random","eye-count","eye-saccade-reading"],
exerciseGroups:[["Yumuşak İzleme", ["eye-horizontal", "eye-vertical", "eye-diagonal", "eye-diagonal2", "eye-wave", "eye-steep-wave", "eye-depth", "eye-square", "eye-triangle", "eye-star", "eye-junction", "eye-crossbox"]], ["Sıçrama", ["eye-saccade-two", "eye-saccade-random", "eye-saccade-reading"]], ["Hedef ve Bakış", ["periph", "eye-touch", "fixation", "finger-trace", "eye-count"]]]
},
{
id:"yurutucu-islev",
readingLevel:["post"],
label:"Yürütücü İşlev",
sub:"Ketleme · Esneklik · Planlama · Öz Denetim · Dikkat Kontrolü",
purpose:"Dikkati yönetme, kural değiştirme, dürtüsel tepkiyi durdurma, planlama, zamanı tahmin etme ve kendi işini denetleme becerilerini çalıştırır.",
color:"#3A6EA5",
group:"Hız & Dikkat",
exerciseIds:["tap-reverse","fish-flanker","stroop","touch-animal","statue","stroop-touch","hold-wait","day-night","plan-beads","day-night-touch","alt-uses","sort-color-shape","opp-do","face-go","fist","num-stroop","rule-shift","trail-number-month","go-no-go","size-stroop","reversal","zoo-map","spatial-stroop","flanker","plan-swap","box-search","sort-animal-size","zihni-says","water-jars","anti-touch","less-more","hand-game","trail-animal-fruit","key-search","context-go","three-tasks","hayling","grass-snow","sort-color-shape-count","design-fluency","plan-tol","opp-world","distract","time-est","find-error","switch-touch","rev-arrow","number-letter","navon","sort-words","keep-track","creature-count","plan-cubes","plus-minus","dual-task","task-switch","rev-sort","stop-signal","trail-color-shape","cog-est","look-first","vigilance"],
exerciseGroups:[["Ketleme", ["stroop", "day-night", "opp-do", "go-no-go", "fish-flanker", "stroop-touch", "day-night-touch", "touch-animal", "flanker", "face-go", "num-stroop", "zihni-says", "size-stroop", "spatial-stroop", "hand-game", "hayling", "anti-touch", "tap-reverse", "statue", "opp-world", "less-more", "hold-wait", "context-go", "grass-snow", "distract", "rev-arrow"]], ["Esneklik", ["sort-color-shape", "trail-number-month", "sort-animal-size", "trail-animal-fruit", "sort-color-shape-count", "number-letter", "task-switch", "sort-words", "trail-color-shape", "switch-touch", "alt-uses", "fist", "navon", "rule-shift", "plus-minus", "reversal", "creature-count", "rev-sort"]], ["Planlama", ["plan-beads", "zoo-map", "plan-swap", "box-search", "plan-tol", "water-jars", "plan-cubes", "key-search", "three-tasks", "design-fluency", "cog-est"]], ["Öz Denetim", ["time-est", "find-error", "look-first", "keep-track"]], ["Dikkat Kontrolü", ["dual-task", "stop-signal", "vigilance"]]]
},
{
id:"calisan-bellek",
readingLevel:["pre","post"],
label:"Çalışan Bellek",
sub:"N-Geri · Diziler · Dinleme ve Okuma Aralığı · Takip ve Güncelleme · İleriye Dönük Bellek",
purpose:"Bilgiyi kısa süre zihinde tutup üzerinde işlem yapma becerisini çalıştırır: sayı ve kelime dizileri, ters ve sıralı tekrar, n-geri güncelleme, ileriye dönük bellek, zihinden hesap ve görsel-uzamsal takip.",
color:"#4F9D5A",
group:"Bellek",
exerciseIds:["pos-nback","nback-shape","corsi","nback-color","wm-same","nback-number","running","lns","corsi-verbal","digit-span","count-span","running-verbal","lns-touch","word-order","wm-seq","span-listen","animal-fruit","span-read","mental-math","market-verbal","span-touch","zihni-verbal","market","prospective-event","wm-where","prospective-time","zihni","prospective-delayed","cups"],
exerciseGroups:[["N-Geri", ["nback-shape", "wm-same", "nback-color", "pos-nback", "nback-number"]], ["Diziler", ["corsi", "lns", "running", "digit-span", "wm-seq", "corsi-verbal", "running-verbal", "count-span", "word-order", "lns-touch", "animal-fruit"]], ["Dinleme ve Okuma Aralığı", ["span-listen", "mental-math", "span-touch", "span-read"]], ["Takip ve Güncelleme", ["market", "zihni", "cups", "market-verbal", "zihni-verbal", "wm-where"]], ["İleriye Dönük Bellek", ["prospective-event", "prospective-time", "prospective-delayed"]]]
},
{
id:"sozel-bellek",
readingLevel:["pre","post"],
label:"Sözel Bellek",
sub:"Kelime Listeleri · Cümle ve Hikâye · Resimli ve Sesli Bellek",
purpose:"Duyduğu bilgiyi kaydedip sonra geri getirme becerisini çalıştırır: kelime listeleri ve öğrenme denemeleri, kelime çiftleri, hikâye ve cümle hatırlama, gecikmeli hatırlama, sözel yönerge ve kaynak belleği.",
color:"#2E5F8A",
group:"Bellek",
exerciseIds:["word-list-recall","new-word","mixed-span","story-order","word-pairs","pic-seq-say","list-learn","pal-touch","cat-list","move-seq","word-repeat","who-said","story-recall","tone-seq","sent-listen","hear-find","short-story","rhythm","nonword","dir-follow","rhyme-done","pic-seq-touch","sentence-repeat"],
exerciseGroups:[["Kelime Listeleri", ["word-list-recall", "mixed-span", "word-pairs", "list-learn", "cat-list", "word-repeat", "new-word"]], ["Cümle ve Hikâye", ["story-recall", "sent-listen", "short-story", "nonword", "rhyme-done", "story-order", "sentence-repeat"]], ["Resimli ve Sesli Bellek", ["pic-seq-say", "pal-touch", "move-seq", "who-said", "tone-seq", "hear-find", "rhythm", "dir-follow", "pic-seq-touch"]]]
},
{
id:"gorsel-bellek",
readingLevel:["pre","post"],
label:"Görsel Bellek",
sub:"Ne Gördün? · Yer ve Sıra · Sahne ve Değişim",
purpose:"Gördüğü nesne, konum, yüz, sahne ve desenleri kısa ya da uzun bir süre sonra hatırlama becerisini çalıştırır.",
color:"#D64545",
group:"Bellek",
exerciseIds:["vis-face","which-seen","rt-shapes","vis-recog","shape-recall","memory-cards","pic-order","rt-colors","route-mem","color-recall","rt-position","vis-draw","color-obj","scene-mem","position-recall","vis-miss","scene-touch","vis-chg"],
exerciseGroups:[["Ne Gördün?", ["vis-face", "rt-shapes", "shape-recall", "color-recall", "which-seen", "vis-recog", "memory-cards", "rt-colors"]], ["Yer ve Sıra", ["pic-order", "rt-position", "position-recall", "route-mem", "color-obj", "vis-draw"]], ["Sahne ve Değişim", ["scene-mem", "vis-miss", "scene-touch", "vis-chg"]]]
},
{
id:"sozel-organizasyon",
readingLevel:["post"],
label:"Sözel Organizasyon",
sub:"Gruplama · Ses ve Hece · Anlam İlişkileri · Akıcılık",
purpose:"Sözcükleri anlamına ve sesine göre düzenleme becerisini çalıştırır: sözel akıcılık, anlamsal kümeleme ve üst kavram, uyak, hece ve ses farkındalığı, zıt ve eş anlam, parça–bütün ve sıralama.",
color:"#8A5A8C",
group:"Dil & Görsel Analiz",
exerciseIds:["sort-pic","odd-cat","part-whole","word-group","seq-words","free-sort","syl-blend","group-say","same-sound","syl-touch","rhyme-touch","syllable-count","opp-touch","sent-build","syn-touch","phon-manip","flu-cat","flu-letter","opposite-match","flu-switch"],
exerciseGroups:[["Gruplama", ["word-group", "sort-pic", "group-say", "odd-cat", "part-whole", "seq-words", "free-sort"]], ["Ses ve Hece", ["syl-blend", "syllable-count", "phon-manip", "rhyme-touch", "syl-touch", "same-sound"]], ["Anlam İlişkileri", ["opposite-match", "opp-touch", "sent-build", "syn-touch"]], ["Akıcılık", ["flu-cat", "flu-letter", "flu-switch"]]]
},
{
id:"sozel-kavrama",
readingLevel:["post"],
label:"Sözel Kavrama",
sub:"Anlama · Akıl Yürütme · Kelime ve Deyim",
purpose:"Kelimeleri ve sözel ifadeleri anlama, aralarında ilişki kurma becerisini çalıştırır: alıcı sözcük dağarcığı, tanımlama, benzerlik ve analoji, mecaz ve atasözü, çıkarım, mantıksızlık bulma ve temel kavramlar.",
color:"#6B4C9A",
group:"Dil & Görsel Analiz",
exerciseIds:["sent-pic","infer-say","word-pic","listen-answer","similarities","wh-scene","concept-touch","analogy-say","def-touch","use-touch","practical-reasoning","absurd-touch","sim-touch","proverb-say","vanalogy-touch","what-do","vocabulary","infer-touch","absurd-say","homonym-say","proverb-touch"],
exerciseGroups:[["Anlama", ["sent-pic", "word-pic", "listen-answer", "wh-scene", "concept-touch", "def-touch", "use-touch"]], ["Akıl Yürütme", ["infer-say", "absurd-touch", "similarities", "analogy-say", "practical-reasoning", "sim-touch", "vanalogy-touch", "what-do", "infer-touch", "absurd-say"]], ["Kelime ve Deyim", ["proverb-say", "vocabulary", "homonym-say", "proverb-touch"]]]
},
{
id:"gorsel-organizasyon",
readingLevel:["pre","post"],
label:"Görsel Organizasyon",
sub:"Boyut ve Yön · Şekil Algısı · Zihinsel Döndürme ve Yapı",
purpose:"Görsel bilgiyi çözümleyip düzenleme becerisini çalıştırır: boyut, yön ve biçim değişmezliği, zihinsel döndürme, şekil–zemin ayırt etme, görsel tamamlama, bloklarla desen, kopyalama, simetri ve labirent.",
color:"#E8823A",
group:"Dil & Görsel Analiz",
exerciseIds:["size-touch","arrow-touch","size-sort","clutter-find","spot-diff","closure","overlap-count","arrow-direction","same-number","edge-touch","embedded","block-design","visual-opposites","mental-rot","paper-fold","copy-design","symmetry","edge-count","view-from","maze"],
exerciseGroups:[["Boyut ve Yön", ["size-sort", "arrow-direction", "size-touch", "visual-opposites", "arrow-touch"]], ["Şekil Algısı", ["edge-count", "clutter-find", "spot-diff", "closure", "overlap-count", "same-number", "edge-touch", "embedded"]], ["Zihinsel Döndürme ve Yapı", ["block-design", "mental-rot", "paper-fold", "copy-design", "symmetry", "view-from", "maze"]]]
},
{
id:"algisal-akil-yurutme",
readingLevel:["pre","post"],
label:"Algısal Akıl Yürütme",
sub:"Örüntü ve Analoji · Sınıflama ve Kural · Neden–Sonuç ve Mantık",
purpose:"Görsel örüntü ve ilişkileri çözümleyerek sözel olmayan akıl yürütme becerisini çalıştırır: örüntü ve matris tamamlama, analoji, kural keşfi, terazi ve neden–sonuç sıralaması.",
color:"#B08900",
group:"Dil & Görsel Analiz",
exerciseIds:["matrix-fill","pattern-touch","num-pattern","sequence-pattern","analogy-touch","class-table","twenty-q","visual-analogy","sudoku","odd-touch","clue-find","odd-one-out","cause-effect","pic-arrange","balance"],
exerciseGroups:[["Örüntü ve Analoji", ["matrix-fill", "sequence-pattern", "visual-analogy", "pattern-touch", "num-pattern", "analogy-touch"]], ["Sınıflama ve Kural", ["odd-one-out", "class-table", "sudoku", "odd-touch", "clue-find", "twenty-q"]], ["Neden–Sonuç ve Mantık", ["cause-effect", "pic-arrange", "balance"]]]
},
];

function exerciseById(id){ return EXERCISES.find(e => e.id === id); }
function currentCategory(){ return CATEGORIES[currentCategoryIndex]; }
function currentCategoryExercises(){
const all = currentCategory().exerciseIds.map(exerciseById);
return all.filter(ex => ex.readingLevel.includes(readingLevel === "pre" ? "pre" : "post"));
}

function buildSequenceForCategory(){
const seq = [];
const exs = currentCategoryExercises();
TIERS.forEach((_, t)=>{
exs.forEach((ex, e)=>{
if((ex.minTier || 0) <= t && t <= tierMax(ex)){
seq.push({t, e});
}
});
});
return seq;
}

function findSeqIndex(t, e){
let idx = SEQUENCE.findIndex(p => p.t === t && p.e === e);
if(idx !== -1) return idx;
for(let ee = e - 1; ee >= 0; ee--){
idx = SEQUENCE.findIndex(p => p.t === t && p.e === ee);
if(idx !== -1) return idx;
}
idx = SEQUENCE.findIndex(p => p.t === t);
return idx !== -1 ? idx : 0;
}

let currentCategoryIndex = 0;
let appMode = null;
let readingLevel = null;

const PLAYER_LEVELS_KEY = "wm_player_levels_v1";
let playerReadingLevels = {};
try{
playerReadingLevels = JSON.parse(localStorage.getItem(PLAYER_LEVELS_KEY) || "{}");
}catch(e){ playerReadingLevels = {}; }

function getPlayerLevel(name){
return playerReadingLevels[name] || null;
}
function rememberPlayerLevel(name, level){
playerReadingLevels[name] = level;
try{ localStorage.setItem(PLAYER_LEVELS_KEY, JSON.stringify(playerReadingLevels)); }catch(e){}
}

function applyLevelDefaultThresholds(level){
if(level === "pre"){
SUCCESS_SEC_PER_ITEM = 1.6;
FAIL_SEC_PER_ITEM = 3.0;
} else {
SUCCESS_SEC_PER_ITEM = 1.0;
FAIL_SEC_PER_ITEM = 2.0;
}
const si = document.getElementById("successThresholdInput");
const fi = document.getElementById("failThresholdInput");
if(si){
si.value = SUCCESS_SEC_PER_ITEM;
document.getElementById("successThresholdValue").textContent = SUCCESS_SEC_PER_ITEM.toFixed(1) + " sn";
}
if(fi){
fi.value = FAIL_SEC_PER_ITEM;
document.getElementById("failThresholdValue").textContent = FAIL_SEC_PER_ITEM.toFixed(1) + " sn";
}
}

let pendingLevelPlayerName = null;
let pendingLevelPlayerIsNew = false;

function renderLevelPlayerOptions(){
const sel = document.getElementById("levelPlayerSelect");
if(!sel) return;
const prevValue = sel.value;
sel.innerHTML = `<option value="">Seç...</option>` +
playersList.map(name => `<option value="${escHTML(name)}">${escHTML(name)}</option>`).join("") +
`<option value="__new__">+ Yeni kişi ekle</option>`;
if(playersList.includes(prevValue)) sel.value = prevValue;
}

function updateLevelPlayerStatus(){
document.querySelectorAll('#readingLevelScreen .mode-card[data-level]').forEach(c=> c.classList.remove("suggested"));
const status = document.getElementById("levelPlayerStatus");
if(!status) return;
if(!pendingLevelPlayerName){ status.textContent = ""; return; }
const known = getPlayerLevel(pendingLevelPlayerName);
if(known){
const label = known === "pre" ? "Okul Öncesi" : "Okul Sonrası";
status.textContent = `${pendingLevelPlayerName} için önerilen: ${label}`;
const card = document.querySelector(`#readingLevelScreen .mode-card[data-level="${known}"]`);
if(card) card.classList.add("suggested");
} else {
status.textContent = `${pendingLevelPlayerName} için düzey seç:`;
}
}
let SEQUENCE = buildSequenceForCategory();

let currentIndex = 0;
let currentStageIndex = 0;

/* KURAL (N-Geri): "tek tek gelecek" diyen N-Geri çalışmalarında öğeler gerçekten tek tek gösterilir — Başlat'tan sonra yalnız sıradaki öğe görünür, öncekiler kapanır; yetişkin, çocuk söyleyince tahtaya dokunur ve sıradaki gelir (önceki öğe ekranda kalırsa bellek çalışmaz) */
const NB_SEQ = new Set(["nback-shape", "nback-color", "nback-number"]);
const NB_SEQ_NOTE = `<span style="display:block;font-size:13px;color:var(--muted,#5B6B7B);margin-bottom:4px">Başlat’tan sonra öğeler tek tek açılır; çocuk söyleyince tahtaya dokunun, sıradaki gelir.</span>`;
let nbSeqIdx = 0;
function nbSeqCells(){ const b = document.getElementById("board"); return b ? [...b.querySelectorAll(":scope > .cell")] : []; }
function nbSeqPaint(){ const b = document.getElementById("board"); if(!b || !b.classList.contains("nb-seq")) return; const cells = nbSeqCells(); cells.forEach((c, i) => c.classList.toggle("nb-cur", i === nbSeqIdx)); let h = b.querySelector(".nb-hint"); if(nbSeqIdx >= cells.length - 1){ if(!h){ h = document.createElement("div"); h.className = "nb-hint"; b.appendChild(h); } h.textContent = "Son öğe · çocuk söyleyince Bitir’e basın"; } else if(h) h.remove(); }
function nbSeqStart(){ const ex = currentExercise(); if(!ex || !NB_SEQ.has(ex.id)) return; const b = document.getElementById("board"); if(!b) return; nbSeqIdx = 0; b.classList.add("nb-seq"); nbSeqPaint(); if(!b._nbSeqBound){ b._nbSeqBound = true; b.addEventListener("click", () => { if(!b.classList.contains("nb-seq") || !timerRunning) return; const cells = nbSeqCells(); if(nbSeqIdx < cells.length - 1){ nbSeqIdx++; nbSeqPaint(); } }); } }
function nbSeqStop(){ const b = document.getElementById("board"); if(!b) return; b.classList.remove("nb-seq"); b.querySelectorAll(".nb-cur").forEach(c => c.classList.remove("nb-cur")); const h = b.querySelector(".nb-hint"); if(h) h.remove(); }
/* KURAL: resimli tahtaya özgü düzen kuralları (en küçük hücre, dar satır aralığı) yalnız resimli tahtalara uygulanır; harf, sayı, kelime tahtaları eski dizilimini korur (sütun kaybetmez) */
function boardIsPic(){ try{ const ex = currentExercise(); const h = String(ex.renderItem((currentGrid || [])[0] || ex.randomItem())); return /<img|<svg/.test(h) && !/name-cell|word-cell|stroop/.test(h); }catch(e){ return false; } }
function stIx(){ try{ const st = currentExercise().stages[currentStageIndex]; return st && st.strategyOf != null ? st.strategyOf : currentStageIndex; }catch(e){ return currentStageIndex; } }
function baseStageCount(ex){ return ex.stages.filter(st => st.strategyOf == null).length; }
let currentGrid = [];
let currentPlayerName = "";
let playersList = [];
let currentHistoryTab = "recent";
let currentErrorCount = 0;
let successStreak = 0;
let currentReportPlayer = "Herkes";
let currentSummaryPlayer = "Herkes";

let SUCCESS_SEC_PER_ITEM = 1.0;
let FAIL_SEC_PER_ITEM = 2.0;
let soundEnabled = true;
let confettiEnabled = true;
let hapticEnabled = true;
let expertAdaptiveEnabled = false;

function currentCombo(){ return SEQUENCE[currentIndex]; }
/* KURAL (düzen): satır biçimli grup gösteren çalışmalar (Örüntü Tamamlama, Görsel Analoji, Farklı Olanı Bul) telefonda okunur olsun diye iki sütun ve tam satırla gelir;
   öğe sayısı Okul Sonrası 12/16/20, Okul Öncesi 8/10/12 */
const ROW_GROUP_DIMS = () => isPre() ? [{rows:4, cols:2}, {rows:5, cols:2}, {rows:6, cols:2}] : [{rows:6, cols:2}, {rows:8, cols:2}, {rows:10, cols:2}];
function currentTier(){
const base = TIERS[currentCombo().t];
const exForDims = currentCategoryExercises()[currentCombo().e];
if(exForDims && exForDims.dims){
const tb = exForDims.dims();
const d = tb[currentCombo().t] || tb[tb.length-1];
return Object.assign({}, base, {rows:d.rows, cols:d.cols});
}
if(isPre()){
const d = PRE_GRID_DIMS[currentCombo().t] || PRE_GRID_DIMS[PRE_GRID_DIMS.length-1];
return Object.assign({}, base, {rows:d.rows, cols:d.cols});
}
return base;
}
function currentExercise(){ return currentCategoryExercises()[currentCombo().e]; }

let timerInterval = null;
let timerRunning = false; try{ document.documentElement.classList.remove("za-running"); zaSessionRelayout(); }catch(e){};
let elapsedMs = 0;
let timerStartedAt = 0;

function itemsFullyEqual(a, b, attrs){
return attrs.every(k => a[k] === b[k]);
}

function generateGrid(exercise, rows, cols){
if(exercise.uniqueFrom){ const pool = shuffleArray(exercise.uniqueFrom()); const nU = pool.length >= rows * cols ? rows * cols : (Math.floor(pool.length / cols) * cols || pool.length); return Array.from({length: nU}, (_, i) => exercise.itemFrom(pool[i])); } /* KURAL (çalışma mantığı): tekrarsız liste — havuz ızgaradan küçükse aynı soru/öbek ikinci kez yazılmaz, sayfa havuz kadar öğe gösterir */ if(exercise.id === "syllable-count"){ const pool = shuffleArray(SYLLABLE_WORDS); return Array.from({length: rows * cols}, (_, i) => Object.assign({}, pool[i % pool.length])); } /* Hece Sayma: ızgara karıştırılmış listeden kurulur, tekrar olmaz */
if(exercise.isMt) return mtBuild();
if(exercise.isRt) return rtBuild();
if(exercise.isChoice) return chBuild();
if(exercise.isWm) return exercise.wm();
if(exercise.isSearch) return exercise.search();
if(exercise.isPlan) return exercise.plan();
if(exercise.isTrail) return exercise.trail();
if(exercise.isSort) return exercise.sortDeck();
if(exercise.isFlanker) return exercise.flankerGroups();             // Flanker: 5'li çerçeveli gruplar
if(exercise.makeGrid) return touchSpread(exercise.makeGrid(rows * cols), cols, exercise);
if(exercise.isSeqRows) return exercise.osRows();
if(exercise.isAuditory) return exercise.audTrials();
if(exercise.isScatter) return exercise.scatterItems();
if(typeof exercise.beginGrid === "function") exercise.beginGrid();
const probe = [];
for(let k=0;k<60;k++) probe.push(exercise.randomItem());
const rich = exercise.attrs.filter(a => new Set(probe.map(p => p[a])).size >= 3);
const poor = exercise.attrs.filter(a => !rich.includes(a));
const distinctItems = new Set(probe.map(p => exercise.attrs.map(a => p[a]).join("|"))).size;
/* KURAL (adlandırma tahtası): tahta tahmin edilebilir olmaz — bütün satırlar aynı sırada ya da iki ve daha fazla sütun tek tip (hep aynı şekil/resim) olan tahta yeniden üretilir */
const predictable = (g) => { try{ const a0 = exercise.attrs[0]; /* KURAL (adlandırma tahtası, 2026-11-04): öngörülemezlik, telefonda tahtanın gerçekte dizildiği sütun sayısında da denetlenir — tahta dar ekranda 4 yerine 3 sütuna dizilince tek tip sütun çıkıyordu (Tat Adlandırma); bu yüzden öğe sayısını tam bölen bütün sütun sayıları (2…cols) denenir */ const colsSet = []; for(let cc = 2; cc <= Math.max(2, cols); cc++){ if(cc === cols || g.length % cc === 0) colsSet.push(cc); } return colsSet.some(C => { const R = Math.floor(g.length / C); if(R < 3 || C < 2) return false; const rs = []; for(let r = 0; r < R; r++) rs.push(g.slice(r * C, r * C + C).map(x => x[a0]).join(",")); if(new Set(rs).size === 1) return true; let mono = 0; for(let c = 0; c < C; c++){ const st = new Set(); for(let r = 0; r < R; r++) st.add(g[r * C + c][a0]); if(st.size === 1) mono++; } return mono >= 2; }); }catch(e){ return false; } };
let grid = [];
for(let attempt = 0; attempt < 30; attempt++){
grid = [];
for(let i=0;i<rows*cols;i++){
let item;
let tries = 0;
do{
item = exercise.randomItem();
tries++;
} while(
tries < 30 &&
(
(grid.length > 0 && rich.some(a => item[a] === grid[grid.length-1][a]) && !(attempt >= 20 && grid.length % cols === 0)) ||
(grid.length > 0 && distinctItems >= 3 && itemsFullyEqual(item, grid[grid.length-1], exercise.attrs)) ||
(grid.length > 1 && poor.some(a => item[a] === grid[grid.length-1][a] && item[a] === grid[grid.length-2][a] && !(attempt >= 10 && grid.length % cols !== 0))) ||
(grid.length > 1 && distinctItems >= 6 && itemsFullyEqual(item, grid[grid.length-2], exercise.attrs)) ||
(i >= cols && distinctItems >= 6 && itemsFullyEqual(item, grid[i-cols], exercise.attrs))
)
);
grid.push(item);
}
if(!predictable(grid)) break;
}
return verbalUnique(grid, exercise, cols);
}
/* KURAL (çalışma mantığı): sözcük/öbek/soru gösteren sözel sayfalarda aynı metin sayfada ikinci kez yazılmaz; havuz yetmezse sayfa daha az öğe gösterir (Stroop gibi az sayıda sözcükle çalışan görevler hariç) */
const VERBAL_REPEAT_OK = new Set(["stroop","num-stroop","color-recall","position-recall","digit-span","shape-recall"]);
function verbalUnique(grid, ex, cols){ try{ if(!ex || VERBAL_REPEAT_OK.has(ex.id) || !Array.isArray(grid)) return grid; const txt = (it) => it && (it.word || it.phrase || it.q || it.text || (it.a && it.b ? it.a + "|" + it.b : null)); if(grid.filter(txt).length < grid.length * 0.8) return grid; const seen = new Set(), out = []; grid.forEach(it => { let x = it, k = 0; while(seen.has(txt(x)) && k < 40){ x = ex.randomItem(); k++; } if(!seen.has(txt(x))){ seen.add(txt(x)); out.push(x); } }); if(out.length < grid.length && cols > 1){ const tr = Math.floor(out.length / cols) * cols; if(tr >= cols) return out.slice(0, tr); } return out; }catch(e){ return grid; } }   /* eksik kalırsa son satır tamamlanmış olarak kesilir */

/* Sonraki/Önceki: sekme sırasını izler. navTier = gezilen düzey (bu düzeyi olmayan çalışma kendi en yüksek düzeyinde açılır);
   satırın sonunda bir sonraki düzeyin ilk sekmesine, son düzeyin sonunda Başlangıç'ın ilk sekmesine geçilir. */
let navTier = null;
function navStep(dir){ if(hwRun){ hwRunStep(dir); return; } const exs = currentCategoryExercises(), n = exs.length; if(!n) return; let e = currentCombo().e, t = (navTier == null ? currentCombo().t : navTier);
  for(let i = 0; i < n * TIERS.length + 2; i++){ e += dir;
    if(e >= n){ e = 0; t = (t + 1) % TIERS.length; } else if(e < 0){ e = n - 1; t = (t - 1 + TIERS.length) % TIERS.length; }
    const ex = exs[e]; if((ex.minTier || 0) > t) continue; if(!exs.some(x => (x.minTier || 0) <= t && t <= tierMax(x))) continue;
    navTier = t; goToIndex(findSeqIndex(Math.min(t, tierMax(ex)), e)); return; } }
function goToIndex(newIndex){ try{
window.__navSerial = (window.__navSerial || 0) + 1;   /* sayfaya her giriş */
const prevExId = currentExercise().id;
currentIndex = ((newIndex % SEQUENCE.length) + SEQUENCE.length) % SEQUENCE.length;
if(currentExercise().id !== prevExId){
currentStageIndex = Math.min(currentStageIndex, currentExercise().stages.length - 1);
}
renderTierRow();
renderExerciseRow();
renderStageRow();
newPage();
}finally{ try{ zaHideLevelFlash(400); }catch(e){} } }

function renderTierRow(){
const row = document.getElementById("tierRow");
row.innerHTML = "";
TIERS.forEach((tier, t)=>{
if(t > tierMax(currentExercise())) return;
const btn = document.createElement("button");
btn.className = "tier-btn" + (t===currentCombo().t ? " active" : "") + (t === 3 ? " usta" : "");
btn.textContent = tier.label;
btn.addEventListener("click", ()=>{ navTier = t; goToIndex(findSeqIndex(t, currentCombo().e)); }); row.appendChild(btn);
});
}

/* Etkin çalışma sekmesini görünür (ortada) tut: Sonraki/Önceki ile sayfa değişince sekme satırı da birlikte kayar; sayfanın dikey konumu değişmez */
function centerActiveChip(row, instant){ try{ const go = () => { const b = row.querySelector(".exercise-btn.active"); if(!b || row.scrollWidth <= row.clientWidth + 2) return; const rr = row.getBoundingClientRect(), br = b.getBoundingClientRect(); const rel = br.left - rr.left - row.clientLeft; /* satırın görünen kısmına göre konum */ const target = Math.max(0, Math.min(row.scrollWidth - row.clientWidth, row.scrollLeft + rel - (row.clientWidth - br.width) / 2)); if(Math.abs(row.scrollLeft - target) < 2) return; const vis = rel >= 4 && rel + br.width <= row.clientWidth - 4; if(vis && !instant && Math.abs(row.scrollLeft - target) < row.clientWidth * 0.25) return; try{ row.scrollTo({ left: target, behavior: instant ? "auto" : "smooth" }); }catch(e){ row.scrollLeft = target; } }; requestAnimationFrame(go); }catch(e){} }
function renderExerciseRow(){ try{ hwRunCheck(); }catch(e){} const row = document.getElementById("exerciseRow"); const prevScroll = row.scrollLeft; row.innerHTML = "";
const exs = currentCategoryExercises();
const t = currentCombo().t;
const groups = [];   /* KURAL: etkinlik şeridinde çalışma biçimleri (söyleme/dokunma/göz) karışık sıralıdır; bölüm etiketleri şeritte gösterilmez */
const shownGroups = new Set();
exs.forEach((ex, e)=>{ if((ex.minTier || 0) > t) return; /* bu düzeyi olmayan çalışma da listelenir; dokununca kendi en yüksek düzeyine gider */
const grp = groups.find(g => g[1].includes(ex.id));
if(grp && !shownGroups.has(grp[0])){
shownGroups.add(grp[0]);
const lbl = document.createElement("button"); lbl.type = "button"; lbl.className = "exercise-group-label"; lbl.innerHTML = `${escHTML(grp[0])}<span class="egl-arrow" aria-hidden="true">›</span>`; lbl.setAttribute("aria-label", grp[0] + " bölümüne git"); const firstE = e; lbl.addEventListener("click", () => { const ex0 = exs[firstE]; const tt = Math.min(currentCombo().t, tierMax(ex0)); goToIndex(findSeqIndex(tt, firstE)); });   /* bölüm başlığı: dokununca o bölümün ilk çalışması */
row.appendChild(lbl);
}
const btn = document.createElement("button");
btn.className = "exercise-btn" + (e===currentCombo().e ? " active" : "");
btn.textContent = ex.label;
btn.addEventListener("click", ()=>{ const tt = Math.min(currentCombo().t, tierMax(ex)); goToIndex(findSeqIndex(tt, e)); }); if(t > tierMax(ex)) btn.classList.add("dim"); row.appendChild(btn); }); row.scrollLeft = prevScroll; centerActiveChip(row); }
function formatTime(ms){
const totalMs = Math.max(0, ms);
const totalSec = Math.floor(totalMs/1000);
const m = String(Math.floor(totalSec/60)).padStart(2,"0");
const s = String(totalSec%60).padStart(2,"0");
const tenths = Math.floor((totalMs%1000)/100);
return `${m}:${s}.${tenths}`;
}

function tickTimer(){
if(timerPausedAt) return;
elapsedMs = Date.now() - timerStartedAt;
document.getElementById("timerDisplay").textContent = formatTime(elapsedMs);
}

/* KURAL (süre): yalnızca yetişkinin değerlendirdiği ara ekranlarda (ör. Gözünü Ayırma'da "Gözünü noktadan ayırdı mı?") kronometre durur; çocuk yeniden çalışmaya başlayınca kaldığı yerden devam eder */
let timerPausedAt = 0;
function setTimerPaused(on){ if(!timerRunning){ timerPausedAt = 0; return; } const disp = document.getElementById("timerDisplay"); if(on && !timerPausedAt){ elapsedMs = Date.now() - timerStartedAt; timerPausedAt = Date.now(); clearInterval(timerInterval); disp.textContent = formatTime(elapsedMs); disp.classList.add("paused"); clearInterval(window.__pausePoll); window.__pausePoll = setInterval(() => { if(!timerPausedAt){ clearInterval(window.__pausePoll); return; } syncJudgePause(); }, 150); } else if(!on && timerPausedAt){ timerStartedAt += Date.now() - timerPausedAt; timerPausedAt = 0; clearInterval(timerInterval); timerInterval = setInterval(tickTimer, 100); disp.classList.remove("paused"); } }
function syncJudgePause(){ try{ const st = mtState; setTimerPaused(!!(timerRunning && ((st && st.kind === "fix" && st.phase === "judge") || document.hidden))); }catch(e){} }
/* KURAL (arka plan): uygulama arka plana geçince (ekran kilidi, başka uygulama, gelen arama) çalışan kronometre durur ve konuşma kesilir; geri dönülünce süre kaldığı yerden devam eder — arka planda geçen süre sonuca eklenmez */
document.addEventListener("visibilitychange", () => { try{ if(document.hidden){ try{ speechSynthesis.cancel(); }catch(e){} } syncJudgePause(); }catch(e){} });
let recallHideTimeout = null;

function recallListen(){ try{ const st = currentExercise().stages[currentStageIndex]; return !!(currentExercise().isRecall && st && st.listen); }catch(e){ return false; } }
function recallWords(){ return [].concat(...currentGrid).map(x => x && (x.word || x.phrase)).filter(Boolean); }
function applyRecallListen(){
const board = document.getElementById("board"); let key = document.getElementById("recallKey");
if(!recallListen()){ if(key) key.remove(); return; }
board.querySelectorAll(".cell").forEach(c => { c.innerHTML = `<div class="recall-hidden">🔊</div>`; });
if(key) key.remove();
}
function hideRecallItems(){
const board = document.getElementById("board");
if(!board) return;
board.querySelectorAll(".cell").forEach(cell=>{
cell.innerHTML = `<div class="recall-hidden">🙈</div>`;
});
showLevelFlash("Şimdi hatırlamaya çalışın!", "up");
try{ renderRecallChecklist(); }catch(e){ console.error(e); }
}
let recallChecked = {};
function recallTargets(){ const ex = currentExercise(); return currentGrid.map((it, i) => ({ it, i })).filter(x => ex.id === "position-recall" ? x.it.lit : true); }
function removeRecallChecklist(){ const el = document.getElementById("recallCheck"); if(el) el.remove(); recallChecked = {}; }
function renderRecallChecklist(){
const ex = currentExercise(); if(!ex.isRecall) return;
const board = document.getElementById("board"); let box = document.getElementById("recallCheck");
if(!box){ box = document.createElement("details"); box.id = "recallCheck"; box.className = "rc-box"; board.insertAdjacentElement("afterend", box); }
const ordered = /sırayla|Sırayla|soldan sağa/.test(ex.stages[stIx()].label + " " + ((INSTR_SHORT[ex.id] || [])[stIx()] ? INSTR_SHORT[ex.id][stIx()]() : ""));
const cols = currentTier().cols, isPos = ex.id === "position-recall";
const targets = recallTargets(), orderOf = {}; targets.forEach((x, k) => { orderOf[x.i] = ex.id === "digit-span" ? (x.i % cols) + 1 : k + 1; });
const n = Object.keys(recallChecked).filter(k => recallChecked[k]).length;
const cell = (it, i) => { const tgt = orderOf[i] != null, on = !!recallChecked[i];
return `<button type="button" class="rc-cell${tgt ? "" : " off"}${on ? " on" : ""}" ${tgt ? `data-rc="${i}"` : "disabled"}>${ex.renderItem(it)}${ordered && tgt ? `<span class="rc-num">${orderOf[i]}</span>` : ""}${on ? `<span class="rc-ok">✓</span>` : ""}</button>`; };
const grid = isPos ? currentGrid.map(cell).join("") : targets.map(x => cell(x.it, x.i)).join("");
box.innerHTML = `<summary>Kontrol listesi <span class="rc-cnt">${n}/${targets.length}</span><span class="rc-hint">yetişkin için · çocuk cevap verdikten sonra açın</span></summary>
<div class="rc-note">${ordered ? "Sırası doğru olarak söylediklerine dokunun (numara doğru sırayı gösterir)." : isPos ? "Çocuğun doğru gösterdiği dolu dairelere dokunun." : "Çocuğun hatırladıklarına dokunun."} Sayaç kendiliğinden güncellenir.</div>
<div class="rc-grid" style="grid-template-columns:repeat(${isPos ? cols : Math.min(cols, 6)}, minmax(0, 1fr))">${grid}</div>`;
}
document.addEventListener("click", (ev) => {
const b = ev.target.closest("#recallCheck [data-rc]"); if(!b) return;
const i = b.dataset.rc; recallChecked[i] = !recallChecked[i];
setErrorCount(Object.keys(recallChecked).filter(k => recallChecked[k]).length);
const open = document.getElementById("recallCheck").open; renderRecallChecklist(); document.getElementById("recallCheck").open = open;
});

setInterval(() => { try{ ensureInteractiveStop(); }catch(e){} }, 400);
/* KURAL (yaşam döngüsü, 2026-11-09): sayfa olayları tek yerden geçer — ZA_LIFE.freshAttempt (yeni deneme), ZA_LIFE.rebuild/clear/resetBoard (sıfırlama ve yarım kalan deneme), ZA_LIFE.leave (sayfadan/oyundan çıkış), ZA_LIFE.afterRender (sayfa çizildi). Çalışma türüne özel sıfırlama kuralları yalnız bu tabloda yazılır; startTimer, stopTimer, resetTimer ve gezinti fonksiyonları buraya çağrı yapar. Yeni bir çalışma türü eklenirken sıfırlaması buraya eklenir (mühendislik borcu 2. adım) */
const ZA_LIFE = {
  /* etkileşimli, kendi deneme üreten tahtalar: yeni deneme kurulur (sıfırlama ve yarım kalan deneme) */
  rebuild(ex){ try{ if(ex.isMt){ mtClear(); currentGrid = mtBuild(); renderMtBoard(); return true; } if(ex.isRt){ rtClear(); currentGrid = rtBuild(); renderRtBoard(); return true; } if(ex.isChoice){ chClear(); currentGrid = chBuild(); renderChoiceBoard(); return true; } if(ex.isWm){ wmClearTimers(); currentGrid = wmBuild(); renderWmBoard(); return true; } }catch(e){ console.error(e); } return false; },
  /* aynı sayfada ilerleme işaretlerini temizleyen tahtalar */
  clear(ex){ try{
    if(ex.isSearch && searchState){ searchState = { answered:0, wrong:0, ans: currentGrid.map(() => null) }; renderSearchBoard(); }
    if(ex.isPlan && planState && currentGrid.length){ Object.assign(planState, { p:0, cur: currentGrid[0].start.map(x => Array.isArray(x) ? x.slice() : x), moves:0, extra:0, sel:null, done:false, firstMoveMs:[], probStart:null, solved:0, locked:false }); renderPlanBoard(); }
    if(ex.isTrail && trailState){ Object.assign(trailState, { next:0, wrong:0 }); renderTrailBoard(); }
    if(ex.isSort && sortState){ Object.assign(sortState, { idx:0, wrong:0, persev:0, locked:false, justChanged:false }); renderSortBoard(); }
    if(ex.isTouch){ document.querySelectorAll("#board .tap-mark").forEach(m => m.remove()); resetTouchState(); }
    /* KURAL (temiz başlangıç, 2026-11-08): Oluş Sırası'nda sıfırlama ve yeni deneme işaretleri (yeşil ✓, sıra numaraları) temizler; önceden aynı sayfada işaretler kalıyor, bütün satırlar dokunulmuş görünüyordu */
    if(ex.isSeqRows){ osProg = currentGrid.map(() => []); osProgGrid = currentGrid; renderOsBoard(); }
  }catch(e){ console.error(e); } },
  resetBoard(ex){ this.rebuild(ex); this.clear(ex); },
  /* yeni deneme (süre 0'dan): hata sayısı 0'dan başlar; Oluş Sırası'nda eski işaret kaldıysa temizlenir */
  freshAttempt(ex){ currentErrorCount = 0; const ce0 = document.getElementById("errorCount"); if(ce0) ce0.textContent = "0"; try{ if(ex.isSeqRows && osProg.some(r => r && r.length)){ osProg = currentGrid.map(() => []); osProgGrid = currentGrid; renderOsBoard(); } }catch(e){} },
  /* etkinlikten/oyundan çıkış: konuşma susar, altyazı kapanır */
  leave(){ try{ zaStopSpeech(); }catch(e){} },
  /* sayfa çizildi: yönerge hoparlörü kurulur, yönerge (gerekiyorsa) okunur */
  afterRender(){ try{ zaInstrSpk(); zaReadInstr(); }catch(e){} }
};
function startTimer(){ try{ const gm = typeof gameMode !== "undefined" && gameMode; if(window.__zaInstrActive && !timerRunning){ if(gm){ window.__zaStartAfterInstr = true; const b = document.getElementById("timerBtn"); if(b) b.classList.add("za-wait"); return; } else { zaStopSpeech(); } } }catch(e){}  window.__zaStartAt = Date.now(); if(!(typeof gameMode !== "undefined" && gameMode) && !(currentPlayerName || "").trim() && document.getElementById("mainApp").style.display !== "none" && !window.__qaNoPlayerGuard){ try{ const row = document.getElementById("playerRow"); row.scrollIntoView({ behavior:"smooth", block:"center" }); row.classList.remove("attn"); void row.offsetWidth; row.classList.add("attn"); }catch(e){} showToast("Başlamadan önce kimin çalıştığını seçin", "err"); return; }
window._incomplete = false; setLsOpen(false);
if(elapsedMs < 50) ZA_LIFE.freshAttempt(currentExercise());
try{ if(elapsedMs < 50) nbSeqStart(); }catch(e){}   /* KURAL: yeni başlayan çalışmada hata sayısı 0'dan başlar (başlamadan önce artırılmış sayı taşınmaz); arka plandan dönüşte sayı korunur */
timerStartedAt = Date.now() - elapsedMs;
timerInterval = setInterval(tickTimer, 100);
timerRunning = true; try{ document.documentElement.classList.add("za-running"); zaSessionRelayout(); }catch(e){};
const btn = document.getElementById("timerBtn");
btn.textContent = "⏹ Bitir";
btn.classList.add("running");
document.getElementById("saveResultBtn").style.display = "none";
document.getElementById("saveHint").style.display = "none";
if(currentExercise().isMotion){
startEyeMotion();
}
if(currentExercise().isWm){ setTimeout(() => { try{ wmStart(); }catch(e){ console.error(e); } }, 250); }
if(currentExercise().isChoice){ setTimeout(() => { try{ chStart(); }catch(e){ console.error(e); } }, 250); }
if(currentExercise().isRt){ setTimeout(() => { try{ rtStart(); }catch(e){ console.error(e); } }, 250); }
if(currentExercise().isMt){ setTimeout(() => { try{ mtStart(); }catch(e){ console.error(e); } }, 250); }
if(planThinkOn()){ try{ plnStartLock(); }catch(e){} }
if(typeof gameMode !== "undefined" && gameMode){ sfx("go"); if(!window.__zaSkipGo && !window.__zaInstrActive) speakText(gameLine("go"), { pitch: 1.2 }); try{ renderGameWho(); }catch(e){} }
{ if(!landscapeMQ.matches){
const bd = document.getElementById("board");
bd.style.scrollMarginTop = "8px";
try{ const r0 = bd.getBoundingClientRect(), below = document.documentElement.scrollHeight - (r0.top + window.scrollY); { const bar = document.querySelector(".controls"), barH = bar && getComputedStyle(bar).display !== "none" ? bar.getBoundingClientRect().height : 0; document.documentElement.style.setProperty("--runpad", Math.round(window.innerHeight) + "px"); } }catch(e){}
document.documentElement.classList.add("board-run"); document.documentElement.style.setProperty("--runpad", "0px"); runFocusOn();
const reveal = (smooth, force) => { try{ if((!force && !timerRunning) || landscapeMQ.matches) return; const r = bd.getBoundingClientRect(), bar = document.querySelector(".controls"), barH = bar && getComputedStyle(bar).display !== "none" ? bar.getBoundingClientRect().height : 0, avail = innerHeight - barH - 12;
let dy = 0; if(r.height > avail - 8) dy = r.top - 8; else dy = r.bottom - avail;   // sığan tahta: alt kenarı düğme çubuğunun hemen üstüne
if(Math.abs(dy) > 4){ let sc = bd.parentElement; while(sc && sc !== document.documentElement){ const cs = getComputedStyle(sc); if(/(auto|scroll)/.test(cs.overflowY) && sc.scrollHeight > sc.clientHeight + 2) break; sc = sc.parentElement; }
if(!sc || sc === document.documentElement) sc = document.scrollingElement || document.documentElement; sc.scrollBy({ top: dy, behavior: smooth ? "smooth" : "auto" }); } }catch(e){} };
 
} }
if(currentExercise().isRecall){
clearTimeout(recallHideTimeout);
if(recallListen()){
const words = recallWords(); clearTimeout(window._rlT); (window._rlTs || []).forEach(clearTimeout); window._rlTs = [];
words.forEach((w, k) => window._rlTs.push(setTimeout(() => { if(timerRunning) sayTask(w); }, 300 + k * 1400 * (window.__wmSpeed || 1))));
recallHideTimeout = setTimeout(() => { showLevelFlash("Şimdi hatırlamaya çalışın!", "up"); try{ renderRecallChecklist(); }catch(e){} }, (300 + words.length * 1400) * (window.__wmSpeed || 1));
} else recallHideTimeout = setTimeout(hideRecallItems, currentTier().studyDurationMs);
}
}

function stopTimer(){ try{ nbSeqStop(); }catch(e){} window._lastStopAt = Date.now(); document.documentElement.classList.remove("board-run"); runFocusOff();   // süre bitimi zamanlayıcısı, son durağın ödül ekranını atlamasın
clearInterval(timerInterval);
if(timerPausedAt){ timerPausedAt = 0; } try{ document.getElementById("timerDisplay").classList.remove("paused"); }catch(e){}
timerRunning = false; try{ document.documentElement.classList.remove("za-running"); zaSessionRelayout(); }catch(e){};
addTouchMissesOnStop();
stopEyeMotion();
clearTimeout(recallHideTimeout);
const btn = document.getElementById("timerBtn");
btn.textContent = "▶ Başlat";
btn.classList.remove("running");
{ const manual = window._manualStop; window._manualStop = false; const hint = document.getElementById("saveHint"); window._incomplete = !!(manual && !gameMode && !pageComplete());
if(window._incomplete){ document.getElementById("saveResultBtn").style.display = "none"; hint.style.display = "block"; hint.textContent = "Çalışma tamamlanmadan durduruldu; bu sonuç kaydedilemez. ↻ ile yeniden başlatabilirsin."; hint.classList.add("warn");
  try{ const ex = currentExercise(); let rebuilt = false;   /* yarım kalan deneme tahtada asılı kalmasın: etkileşimli tahta başa döner */
    rebuilt = ZA_LIFE.rebuild(ex);
    if(rebuilt){ elapsedMs = 0; document.getElementById("timerDisplay").textContent = "00:00.0"; currentErrorCount = 0; const ce = document.getElementById("errorCount"); if(ce) ce.textContent = "0"; hint.textContent = "Çalışma tamamlanmadan durduruldu; bu sonuç kaydedilmedi. ▶ Başlat ile baştan başlayabilirsin."; } }catch(e){} }
else if(elapsedMs > 300){ document.getElementById("saveResultBtn").style.display = "block"; hint.style.display = "block"; hint.textContent = "Çalışmayı bitirdin — hata sayısını kontrol et ve kaydet."; hint.classList.remove("warn");
/* KURAL: hatayı uygulamanın kendisinin saydığı dokunmalı çalışmalar (seçmeli, arama, iz sürme, sıralama, plan, dokunma, tepki, bellek oyunları) tamamlanınca sonuç kendiliğinden kaydedilir; yetişkinin hata saydığı söylemeli çalışmalarda Kaydet düğmesi kalır */
const __exA = currentExercise(); if(!hwRun && !gameMode && autoSaveable(__exA) && pageComplete() && !window._autoSavePending){ if((currentPlayerName || "").trim()){ window._autoSavePending = true; document.getElementById("saveResultBtn").style.display = "none"; hint.textContent = "Çalışma bitti — sonuç kendiliğinden kaydediliyor…"; setTimeout(() => { window._autoSavePending = false; try{ confirmSaveResult(); }catch(e){ console.error(e); } }, 450); } else { hint.textContent = "Çalışma bitti — kaydetmek için yukarıdan kimin çalıştığını seçip Kaydet’e basın."; } }
if(hwRun && !gameMode){ if(perfIsAuto(currentExercise())) setTimeout(() => { try{ confirmSaveResult(); }catch(e){ console.error(e); } }, 80); else hint.textContent = "Ödevi bitirdin — hata sayısını kontrol et ve Kaydet'e bas."; } } }
/* KURAL (tüm çalışmalar, yeni eklenecekler dahil): çalışma tamamlanınca konfeti. Tek noktadan: süre durunca, yarım bırakılmadıysa. Oyun modunda ödül kartı kendi konfetisini atar. */
/* (kutlama artık kayıttan sonra: confirmSaveResult) */
if(!gameMode) requestAnimationFrame(() => { try{ const hn = document.getElementById("saveHint"), sv = document.getElementById("saveResultBtn"); const tg = (hn && getComputedStyle(hn).display !== "none") ? hn : sv; if(!tg || getComputedStyle(tg).display === "none") return; const bar = document.querySelector(".controls"); const barH = bar && getComputedStyle(bar).display !== "none" ? bar.getBoundingClientRect().height : 0; const r = tg.getBoundingClientRect(); if(r.bottom > window.innerHeight - barH - 8 || r.top < 0) pageScroller().scrollBy(0, r.bottom - (window.innerHeight - barH - 16)); }catch(e){} });
if(gameMode){ setTimeout(gameAfterStop, 400); try{ renderGameWho(); }catch(e){} }
}

function resetTimer(){
window._autoSavePending = false; try{ nbSeqStop(); }catch(e){} timerPausedAt = 0; try{ document.getElementById("timerDisplay").classList.remove("paused"); }catch(e){}
document.documentElement.classList.remove("board-run"); runFocusOff();
clearInterval(timerInterval);
timerRunning = false; try{ document.documentElement.classList.remove("za-running"); zaSessionRelayout(); }catch(e){};
stopEyeMotion();
clearTimeout(recallHideTimeout);
if(currentExercise().isMotion){
positionMotionShape(0);
const fill = document.getElementById("motionProgressFill");
if(fill) fill.style.width = "0%";
}
if(currentExercise().isRecall){
renderBoard();
}
elapsedMs = 0;
document.getElementById("timerDisplay").textContent = "00:00.0";
const btn = document.getElementById("timerBtn");
btn.textContent = "▶ Başlat";
btn.classList.remove("running");
currentErrorCount = 0;
const countEl = document.getElementById("errorCount");
if(countEl) countEl.textContent = "0";
try{ if(gameMode) renderGameWho(); }catch(e){}
ZA_LIFE.resetBoard(currentExercise()); /* tür bazlı sıfırlama kuralları ZA_LIFE tablosunda */
document.getElementById("saveResultBtn").style.display = "none";
document.getElementById("saveHint").style.display = "none";
}

function confirmSaveResult(){ if(elapsedMs <= 300 || window._incomplete) return; { const __k = currentExercise().id + "|" + Math.round(timerStartedAt || 0) + "|" + Math.round(elapsedMs); if(window._lastSavedKey === __k) return; window._lastSavedKey = __k; }   /* KURAL: aynı çalışma iki kez kaydedilmez (kendiliğinden kayıt ile Kaydet düğmesi çakışsa da) */ if(!gameMode && !(currentPlayerName || "").trim()){ zaAlert("Kaydetmek için önce kimin çalıştığını seçin."); try{ const row = document.getElementById("playerRow"); row.scrollIntoView({ behavior:"smooth", block:"center" }); row.classList.remove("attn"); void row.offsetWidth; row.classList.add("attn"); }catch(e){} return; }
recordSession(elapsedMs, currentErrorCount); playSound("save"); if(!gameMode){ try{ finishCard(); }catch(e){} }   /* konfeti recordSession içinde bir kez */   /* KURAL: Zihni (bitiş kartı) ve konfeti kaydettikten sonra çıkar */
if(hwRun){ resetTimer(); setTimeout(() => { try{ showHwDone(); }catch(e){ console.error(e); } }, 120); return; }   /* ödev oturumu: otomatik düzey değişmez, sonuç paneli */
const __j = (!currentExercise().isMotion && !currentExercise().isRecall && !currentExercise().noAdaptive) ? sessionJudge(elapsedMs, currentErrorCount) : null;
if(__j && (appMode === "aile" || (appMode === "uzman" && expertAdaptiveEnabled))){
applyAdaptiveDifficulty(elapsedMs, currentErrorCount);
}
resetTimer();
if(__j && !gameMode) try{ catLevelSuggest(__j); }catch(e){}
}
/* ===== Kategori düzeyi geçiş önerisi =====
   KURAL: okul sonrası Başlangıç'ta aynı kategoride art arda 2 kötü kayıt → "okul öncesine geçilsin mi?"; okul öncesi Zor'da art arda 2 başarılı kayıt → "okul sonrasına geçilsin mi?".
   Karar yetişkinde; "Hayır" denirse o kategoride 14 gün tekrar sorulmaz. Yalnız Bilişsel Etkinlik'te (çocuk tek başına oynarken sorulmaz). */
const CAT_STREAK_KEY = "wm_cat_streak_v1", CAT_SNOOZE_DAYS = 14;
function catStreakAll(){ try{ return JSON.parse(localStorage.getItem(CAT_STREAK_KEY) || "{}"); }catch(e){ return {}; } }
function catStreakSave(d){ try{ localStorage.setItem(CAT_STREAK_KEY, JSON.stringify(d)); }catch(e){} }
function catPlayerName(){ return (appMode === "aile" && typeof famProfile === "function") ? famProfile() : currentPlayerName; }
/* KURAL (kademe geçişi): okul öncesi ↔ okul sonrası geçişlerinde motive edici ifade kullanılır. İniş bir başarısızlık gibi anlatılmaz ("geri", "düştün", "başaramadın" yok);
   temeli sağlamlaştırma olarak anlatılır. Çıkışta kutlama (konfeti). Yetişkine geçiş anında, çocuğa o alanı bir sonraki açışında gösterilir. */
const CAT_CHEER = {
  up:   ["Süpersin! {alan} alanında bir üst basamağa geçtin 🌟", "Emeğinin karşılığını aldın! {alan} alanında yeni ve daha heyecanlı çalışmalar seni bekliyor 🚀", "Harika gidiyorsun! {alan} alanında artık okul çağı çalışmalarındasın 🎉", "Çok çalıştın, çok da başardın! {alan} alanında yeni bir maceraya hazırsın ⭐"],
  down: ["{alan} alanında temelleri sağlamlaştırıyoruz; her adım seni daha da güçlendirecek 💪", "En yüksek kuleler sağlam temellerle yükselir. {alan} alanında adım adım ilerliyoruz 🧱", "Biraz daha pratikle çok daha hızlı olacaksın. {alan} alanında yeni çalışmalar seni bekliyor 🌱", "Her usta işe temelden başlar. {alan} alanında birlikte güçleniyoruz ✨"]
};
const CAT_CHEER_ADULT = {
  up: "Tebrikler! {ad}, {alan} alanında Okul Sonrası çalışmalarına geçti. Yeni çalışmalar biraz daha zorlayıcı olabilir; ilk günlerde küçük hatalar olağandır.",
  down: "{ad}, {alan} alanında bir süre Okul Öncesi çalışmalarıyla ilerleyecek. Bu ara basamak, temeli sağlamlaştırıp daha emin adımlarla ilerlemesi içindir; diğer alanlar değişmez. Başarı geldikçe uygulama Okul Sonrası'nı yeniden önerecek."
};
function catCheerText(kind, catLabel, name){ const pool = CAT_CHEER[kind] || []; return (pool[Math.floor(Math.random() * pool.length)] || "").replace("{alan}", catLabel).replace("{ad}", name || ""); }
function catCheerAdult(kind, catLabel, name){ return (CAT_CHEER_ADULT[kind] || "").replace("{alan}", catLabel).replace("{ad}", name || "Çocuk"); }
const CAT_CHEER_KEY = "wm_cat_cheer_v1";
function catCheerQueue(name, catId, target){ try{ const d = JSON.parse(localStorage.getItem(CAT_CHEER_KEY) || "{}"), n = (name || "").trim(); if(!n) return; d[n] = d[n] || {}; d[n][catId] = { target, at: Date.now() }; localStorage.setItem(CAT_CHEER_KEY, JSON.stringify(d)); }catch(e){} }
function catCheerShow(name, catId){ try{ const d = JSON.parse(localStorage.getItem(CAT_CHEER_KEY) || "{}"), n = (name || "").trim(); const q = d[n] && d[n][catId]; if(!q) return false; delete d[n][catId]; localStorage.setItem(CAT_CHEER_KEY, JSON.stringify(d));
  const c = CATEGORIES.find(x => x.id === catId); if(!c) return false; const kind = q.target === "post" ? "up" : "down"; setTimeout(() => { try{ showLevelFlash(catCheerText(kind, c.label, n), "levelup"); /* KURAL (konfeti zamanı, 2026-11-09): konfeti yalnız çalışma bitip sonuç kaydedilince yağar; alan düzeyi (Okul Öncesi/Sonrası) değişiminde yağmaz */ }catch(e){} }, 450); return true; }catch(e){ return false; } }
/* Yetişkin onayıyla geçiş: yetişkine açıklama + çocuğa bir sonraki açılışta motive edici ifade */
function catLevelTransition(catId, name, target, by, opts){ opts = opts || {}; const c = CATEGORIES.find(x => x.id === catId); if(!c) return; const prev = catLevelFor(catId, name); setCatLevel(catId, name, target, by); if(prev === target) return;
  const kind = target === "post" ? "up" : "down"; catCheerQueue(name, catId, target);
  if(opts.now){ try{ catCheerShow(name, catId); }catch(e){} } else { try{ showLevelFlash(kind === "up" ? `🌟 ${c.label}: Okul Sonrası çalışmalarına geçildi` : `🌱 ${c.label}: Okul Öncesi çalışmalarıyla temeli sağlamlaştırıyoruz`, "levelup"); /* KURAL (konfeti zamanı, 2026-11-09): konfeti yalnız çalışma bitip sonuç kaydedilince yağar; düzey yükselme bildiriminde yağmaz */ }catch(e){} }
  if(opts.explain !== false){ setTimeout(() => { try{ zaAlert(catCheerAdult(kind, c.label, name)); }catch(e){} }, 700); } }
const CAT_PENDING_KEY = "wm_cat_pending_v1";
function catPendingAll(){ try{ return JSON.parse(localStorage.getItem(CAT_PENDING_KEY) || "{}"); }catch(e){ return {}; } }
function catPendingSave(d){ try{ localStorage.setItem(CAT_PENDING_KEY, JSON.stringify(d)); }catch(e){} }
function catPendingList(name){ const n = (name || "").trim(); const d = catPendingAll()[n] || {}; return Object.keys(d).map(cid => Object.assign({ catId: cid }, d[cid])); }
function catPendingClear(name, catId){ const d = catPendingAll(), n = (name || "").trim(); if(d[n]){ delete d[n][catId]; catPendingSave(d); } }
/* Zihin Adaları: art arda sonuçlar izlenir; eşik dolunca çocuğa soru sorulmaz, yetişkin sayfasına bildirim düşer */
function catGameStreak(ex, t, good){
const c = CATEGORIES.find(c => c.exerciseIds.includes(ex.id)); if(!c || ex.isMotion) return; const n = (gameProfile() || "").trim(); if(!n || n === "Misafir" || n === "Oyuncu") return;
const lvl = gameLevelFor(ex.id); const d = catStreakAll(); d[n] = d[n] || {}; const st = d[n][c.id] = d[n][c.id] || { good: 0, bad: 0, lvl };
if(st.lvl !== lvl){ st.lvl = lvl; st.good = 0; st.bad = 0; }
if(!good){ st.bad = (lvl === "post" && t === 0) ? st.bad + 1 : 0; st.good = 0; } else { st.good = (lvl === "pre" && t === tierMax(ex)) ? st.good + 1 : 0; st.bad = 0; }
let target = null; if(lvl === "post" && st.bad >= 2) target = "pre"; if(lvl === "pre" && st.good >= 2) target = "post";
if(target && !(st.snoozeUntil && st.snoozeUntil > Date.now())){ st.good = 0; st.bad = 0; const pd = catPendingAll(); pd[n] = pd[n] || {}; pd[n][c.id] = { target, at: Date.now(), from: "oyun" }; catPendingSave(pd); }
catStreakSave(d);
}
/* Yetişkin sayfası (Aile / Uzman): bekleyen kademe önerileri */
function catPendingCardHtml(name){
const n = (name || "").trim(); if(!n || n === "Misafir" || n === "Oyuncu") return "";
const list = catPendingList(n); if(!list.length) return "";
return list.map(p => { const c = CATEGORIES.find(x => x.id === p.catId); if(!c) return ""; const info = catLevelInfo(c.id, n); const locked = appMode === "aile" && info.by === "uzman" && !catLevelEntry(c.id, n);
  const txt = p.target === "pre" ? `Zihin Adaları'nda ${escHTML(c.label)} durakları ${escHTML(n)} için şimdilik biraz zorlayıcı görünüyor. Okul Öncesi çalışmalarıyla temeli sağlamlaştırıp daha emin ilerleyebilir. Bu alanda Okul Öncesi'ne geçilsin mi?` : `Harika! ${escHTML(n)}, Zihin Adaları'nda ${escHTML(c.label)} duraklarında Okul Öncesi Zor düzeyini art arda başardı. Okul Sonrası çalışmalarına geçmeye hazır görünüyor. Geçilsin mi?`;
  return `<div class="fh-rec cat-pending" data-cat="${c.id}" data-target="${p.target}"><div class="fh-rec-h">Okul dönemi önerisi</div><div style="font-size:14px;line-height:1.4;margin:4px 0 8px">${txt}</div>${locked ? `<small style="color:#5B6B78;font-weight:700">Bu alanın okul dönemini uzman belirledi; uzmanınıza iletin.</small>` : `<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="cat-level-btn on" data-pend="go">Geç</button><button type="button" class="cat-level-btn auto" data-pend="later">Şimdi değil</button></div>`}</div>`; }).join("");
}
function catPendingBind(box, name, rerender){
box.querySelectorAll(".cat-pending").forEach(card => { const cid = card.dataset.cat, target = card.dataset.target;
  card.querySelectorAll("[data-pend]").forEach(b => b.addEventListener("click", (ev) => { ev.stopPropagation(); const n = (name || "").trim();
    if(b.dataset.pend === "go"){ catPendingClear(n, cid); catLevelTransition(cid, n, target, appMode === "uzman" ? "uzman" : "aile"); }
    else { const d = catStreakAll(); d[n] = d[n] || {}; d[n][cid] = d[n][cid] || { good: 0, bad: 0 }; d[n][cid].snoozeUntil = Date.now() + CAT_SNOOZE_DAYS * 864e5; catStreakSave(d); catPendingClear(n, cid); }
    try{ rerender(); }catch(e){} })); });
}
async function catLevelSuggest(j){
const cat = currentCategory(); if(!cat || cat.hidden) return; const n = (catPlayerName() || "").trim(); if(!n || n === "Misafir" || n === "Oyuncu") return;
const t = currentCombo().t, lvl = readingLevel === "pre" ? "pre" : "post", ex = currentExercise();
const d = catStreakAll(); d[n] = d[n] || {}; const st = d[n][cat.id] = d[n][cat.id] || { good: 0, bad: 0, lvl };
if(st.lvl !== lvl){ st.lvl = lvl; st.good = 0; st.bad = 0; }
if(j.isBad){ st.bad = (lvl === "post" && t === 0) ? st.bad + 1 : 0; st.good = 0; } else if(j.isGood){ st.good = (lvl === "pre" && t === tierMax(ex)) ? st.good + 1 : 0; st.bad = 0; } else { st.good = 0; st.bad = 0; }
catStreakSave(d);
if(st.snoozeUntil && st.snoozeUntil > Date.now()) return;
let target = null, msg = "";
if(lvl === "post" && st.bad >= 2){ target = "pre"; msg = `${cat.label} alanında Okul Sonrası Başlangıç, ${n} için şimdilik biraz zorlayıcı görünüyor. Okul Öncesi çalışmalarıyla temeli sağlamlaştırıp daha emin adımlarla ilerleyebilir. Bu alanda Okul Öncesi'ne geçilsin mi? Diğer alanlar değişmez.`; }
if(lvl === "pre" && st.good >= 2){ target = "post"; msg = `Harika! ${n}, ${cat.label} alanında Okul Öncesi Zor düzeyini art arda iki kez başardı. Bu alanda Okul Sonrası çalışmalarına geçmeye hazır görünüyor. Geçilsin mi? Diğer alanlar değişmez.`; }
if(!target) return;
if(appMode === "aile" && catLevelInfo(cat.id, n).by === "uzman" && !catLevelEntry(cat.id, n)) return;   /* uzman belirlemişse aileye sorulmaz */
const ok = await zaConfirm(msg);
const d2 = catStreakAll(); d2[n] = d2[n] || {}; d2[n][cat.id] = d2[n][cat.id] || {}; d2[n][cat.id].good = 0; d2[n][cat.id].bad = 0;
if(!ok){ d2[n][cat.id].snoozeUntil = Date.now() + CAT_SNOOZE_DAYS * 864e5; catStreakSave(d2); return; }
catStreakSave(d2);
catLevelTransition(cat.id, n, target, appMode === "uzman" ? "uzman" : "aile", { now: true });
const exId = ex.id, ci = currentCategoryIndex; applyPlacedLevel(cat.id, n);
selectCategory(ci);
try{ const exs = currentCategoryExercises(); const e = exs.findIndex(x => x.id === exId); if(e >= 0){ const tt = target === "pre" ? tierMax(exs[e]) : 0; const idx = findSeqIndex(tt, e); if(idx >= 0) goToIndex(idx); } }catch(e){}
}

let audioCtx = null;
let audioUnlocked = false;

let _sfxBus = null;
function sfxBus(ctx){ if(_sfxBus && _sfxBus.context === ctx) return _sfxBus; try{ const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 6; comp.attack.value = 0.003; comp.release.value = 0.2; const master = ctx.createGain(); master.gain.value = 0.75; master.connect(comp); comp.connect(ctx.destination); _sfxBus = master; return master; }catch(e){ return ctx.destination; } }
function getAudioCtx(){
if(!audioCtx){
try{
audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}catch(e){
return null;
}
}
return audioCtx;
}

function unlockAudio(){
if(audioUnlocked) return;
const ctx = getAudioCtx();
if(!ctx) return;
if(ctx.state === "suspended"){
ctx.resume().catch(()=>{});
}
try{
const osc = ctx.createOscillator();
const gain = ctx.createGain();
gain.gain.setValueAtTime(0.0001, ctx.currentTime);
osc.connect(gain);
gain.connect(sfxBus(ctx));
osc.start();
osc.stop(ctx.currentTime + 0.05);
}catch(e){}
audioUnlocked = true;
}

document.addEventListener("touchend", unlockAudio, {once:true});
document.addEventListener("click", unlockAudio, {once:true});

function beep(freqStart, freqEnd, durationMs, volume){
if(!soundEnabled) return;
const ctx = getAudioCtx();
if(!ctx) return;
if(ctx.state === "suspended"){
ctx.resume().catch(()=>{});
}
try{
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = "sine";
osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
osc.frequency.linearRampToValueAtTime(freqEnd, ctx.currentTime + durationMs/1000);
gain.gain.setValueAtTime(0.0001, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume * 0.8), ctx.currentTime + 0.015);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs/1000);
osc.connect(gain);
gain.connect(sfxBus(ctx));
osc.start();
osc.stop(ctx.currentTime + durationMs/1000);
}catch(e){}
}

function playSound(kind){
if(kind === "save"){ beep(650, 780, 130, 0.15); }
else if(kind === "up"){ beep(520, 940, 320, 0.18); }
else if(kind === "down"){ beep(420, 260, 380, 0.18); }
}

function vibrate(pattern){
if(!hapticEnabled) return;
try{
if(navigator.vibrate) navigator.vibrate(pattern);
}catch(e){}
}

/* KURAL (düzey geçişleri, yeni eklenecek her çalışma için):
   1) İki başarılı kayıt → bir üst düzey; bir kötü kayıt → bir alt düzey; son düzeyde iki başarı → (çok aşamalı sözel/etkileşimli çalışmada) sonraki aşamanın ilk düzeyi.
   2) Her yeni çalışma teslimden önce bu geçişler Başlangıç→Orta→Zor ve geri yönde test edilir (tier_audit) ve "iyi oynayan çocuk" temposunda (0,8 sn/tepki; Okul Öncesi 1,1 sn) başarı eşiğine ulaşılabildiği doğrulanır (adapt_test).
   3) Süresi görevce sabit olan çalışmalar (tutma, oynatma, geri sayım, arama uzunluğu) adaptErrorsOnly ile yalnızca hataya göre; sessiz kural değişimi gibi kaçınılmaz hatası olan çalışmalar adaptInevitable ile; "dokunma" denemelerinde pencere süresince bekleyen çalışmalar daha yüksek speedFactor ile tanımlanır.
   4) noAdaptive yalnızca ölçüsü hata sayısı olmayan çalışmalarda (ör. Yirmi Soru, Desen Akıcılığı) kullanılır.
   Kaçınılmaz hatalar (sessiz kural değişimi, yıldızın yer değiştirmesi, ilk tahmin) başarıyı engellemez: */
function adaptInevitable(ex){ try{ if(!ex || !mtState) return 0; if(ex.id === "rule-shift" && mtState.kind === "wcst") return (mtState.shifts || 0) + 1; if(ex.id === "reversal" && mtState.kind === "rev") return (mtState.revs || 0) + 1; }catch(e){} return 0; }
function sessionJudge(ms, errors){
const ex = currentExercise(); errors = Math.max(0, errors - adaptInevitable(ex));
const itemCount = ex.isSeqRows ? Math.max(1, currentGrid.length * 2)
: (ex.isFlanker || ex.isSort || ex.isTrail || ex.isPlan || ex.isSearch || ex.isWm || ex.isChoice || ex.isRt || ex.isMt) ? Math.max(1, currentGrid.length)
: currentTier().rows * currentTier().cols;
const secPerItem = (ms/1000) / itemCount;
const k = ex.speedFactor || (ex.isSeqRows ? 3 : (ex.isScatter ? 2 : 1));
/* KURAL: süresi görevce sabit olan çalışmalarda (tutma, oynatma, geri sayım, arama uzunluğu) düzey yalnızca hataya göre değişir (adaptErrorsOnly) */
const errOnly = ex.isAuditory || ex.adaptErrorsOnly;
const isGood = errOnly ? errors === 0 : (errors === 0 && secPerItem <= SUCCESS_SEC_PER_ITEM * k);
const isBad = errOnly ? errors >= 2 : (errors > 0 || secPerItem >= FAIL_SEC_PER_ITEM * k);
return { isGood, isBad };
}
function applyAdaptiveDifficulty(ms, errors){
const ex = currentExercise();
const { isGood, isBad } = sessionJudge(ms, errors);
const combo = currentCombo();
const player = currentPlayerName.trim() || "Oyuncu";
const useStages = (ex.isScatter || ex.isAuditory || ex.isSeqRows || ex.isFlanker || ex.isTrail || ex.isWm || ex.isMt) && ex.stages.length > 1;
const stageName = (i) => ex.stages[i].label.split("·")[0].trim();
const labelFor = (t, st) => useStages ? `${TIERS[t].label} · ${stageName(st)}` : TIERS[t].label;

function moveTo(t, st, dir){
const label = labelFor(t, st);
currentStageIndex = st;
goToIndex(findSeqIndex(t, combo.e));
if(dir === "up"){
showLevelFlash(`Harika gidiyorsun! Zorluk artırıldı: ${label}`, "levelup");
playSound("up"); vibrate([40, 60, 40]);
} else {
showLevelFlash(`Biraz daha pratik edelim, zorluk azaltıldı: ${label}`, "down");
playSound("down"); vibrate(80);
}
logLevelEvent({t: Date.now(), dir, toLabel: label, player});
}

const skey = player + "|" + ex.id + "|" + currentStageIndex; window.__zaStreak = window.__zaStreak || {}; try{ window.__zaStreak = Object.assign(JSON.parse(localStorage.getItem("za_streak") || "{}"), window.__zaStreak); }catch(e){} successStreak = window.__zaStreak[skey] || 0; const saveStreak = () => { window.__zaStreak[skey] = successStreak; try{ localStorage.setItem("za_streak", JSON.stringify(window.__zaStreak)); }catch(e){} };   /* KURAL: "iki başarılı kayıt → üst düzey" aynı çocuk + aynı çalışma + aynı aşama için sayılır; sayaç kalıcı */
if(isGood){
successStreak++; saveStreak();
if(successStreak >= 2){
successStreak = 0; saveStreak();
if(combo.t < tierMax(ex)){
moveTo(combo.t + 1, currentStageIndex, "up");
} else if(useStages && currentStageIndex < baseStageCount(ex) - 1){
moveTo(0, currentStageIndex + 1, "up");
}
}
} else if(isBad){
successStreak = 0; saveStreak();
if(combo.t > 0){
moveTo(combo.t - 1, currentStageIndex, "down");
} else if(useStages && currentStageIndex > 0 && currentStageIndex < baseStageCount(ex)){
moveTo(tierMax(ex), currentStageIndex - 1, "down");
}
} else { successStreak = 0; saveStreak(); }
}

/* spawnConfetti: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */

function showToast(text, type){ let t = document.getElementById("zaToast"); if(!t){ t = document.createElement("div"); t.id = "zaToast"; document.body.appendChild(t); }
t.textContent = text; t.className = type === "down" ? "warn" : "ok"; t.style.display = "block"; clearTimeout(t._h); t._h = setTimeout(() => { t.style.display = "none"; }, 3200); }
function showLevelFlash(text, type){ try{
const flash = document.getElementById("levelFlash");
if(!flash || flash.offsetParent === null || ["settingsScreen","whoScreen","expertScreen","linkScreen"].some(id => { const e = document.getElementById(id); return e && getComputedStyle(e).display !== "none"; })) return showToast(text, type);
flash.textContent = text;
flash.className = "level-flash " + type;
flash.style.display = "block";
clearTimeout(flash._hideTimer);
/* KURAL (konfeti zamanı, 2026-11-09): düzey bildiriminde konfeti yok */
flash._hideTimer = setTimeout(()=>{ flash.style.display = "none"; }, 4000);
}finally{ try{ if(type === "levelup" || type === "down"){ const fl = document.getElementById("levelFlash"); if(fl && fl.style.display === "block"){ clearTimeout(fl._hideTimer); fl._zaSticky = Date.now(); } const tt = document.getElementById("zaToast"); if(tt && tt.style.display === "block" && /Zorluk|zorluk/.test(tt.textContent)){ clearTimeout(tt._h); tt._zaSticky = Date.now(); } } }catch(e){} } }

function renderStageRow(){
try{ const __ex = currentExercise(); if(__ex && __ex.stages && currentStageIndex >= __ex.stages.length) currentStageIndex = 0; }catch(e){}   /* kaldırılmış aşama (strateji) kayıtlı kalmışsa ilk aşamaya dön */
const row = document.getElementById("stageRow");
row.innerHTML = "";
if(currentExercise().stages.length <= 1){
row.style.display = "none";
return;
}
row.style.display = "";
currentExercise().stages.forEach((stage, i)=>{
const btn = document.createElement("button");
btn.className = "stage-btn" + (i===currentStageIndex ? " active" : "") + (stage.strategyOf != null || /Strateji/.test(stage.label) ? " strat" : "");
btn.textContent = `Aşama ${i + 1}`; btn.title = stage.label;   /* KURAL: aşama düğmelerinde yalnız "Aşama 1", "Aşama 2"… yazar; aşama adı düğmede gösterilmez */
if(recCfgNow && recCfgNow.s === i && recCfgNow.id === currentExercise().id){ btn.textContent = `Aşama ${i + 1} · ⭐ Uzman`; btn.classList.add("rec-stage"); }
btn.addEventListener("click", ()=>{
currentStageIndex = i;
renderStageRow();
newPage();
});
row.appendChild(btn);
});
}





const TOY_NAMES = { car:"araba", doll:"bebek", ball:"top", teddy:"ayıcık", puzzle:"yapboz", train:"tren", kite:"uçurtma", drum:"davul" };
const SEA_NAMES = { fish:"balık", dolphin:"yunus", octopus:"ahtapot", starfish:"deniz yıldızı", turtle:"kaplumbağa", crab:"yengeç", seahorse:"denizatı", shark:"köpekbalığı" };
const ANIMAL_NAMES = { dog:"köpek", cat:"kedi", cow:"inek", rabbit:"tavşan", elephant:"fil", parrot:"papağan", fish:"balık", penguin:"penguen" };
const OBJ_NAMES = {
umbrella_red:"kırmızı şemsiye", umbrella_blue:"mavi şemsiye", umbrella_green:"yeşil şemsiye",
pencil_yellow:"sarı kalem", pencil_green:"yeşil kalem", pencil_blue:"mavi kalem",
ball_soccer:"futbol topu", ball_basket:"basketbol topu", ball_beach:"deniz topu",
cap_blue:"mavi şapka", cap_green:"yeşil şapka", cap_beige:"bej şapka",
beanie_red:"kırmızı bere", beanie_gray:"gri bere", beanie_navy:"lacivert bere",
boots_yellow:"sarı çizme", boots_red:"kırmızı çizme", boots_green:"yeşil çizme"
};
const imgTag = (src) => `<img src="${src}" alt="" style="width:88%;height:88%;object-fit:contain;display:block;">`;
const animalImg = (k) => TA_ANIMALS[k] ? TA_ANIMALS[k]() : "";
const nbPool = (all) => isPre() ? all.slice(0, Math.max(3, Math.round(all.length * 0.6))) : all;
const NB_ANIMALS = ["dog","cat","cow","rabbit","elephant","parrot","fish","penguin"];
const NB_VEHICLES = ["bus","plane","ship","heli","fire","train"];
let nbAnimalPool = null, nbVehiclePool = null;
function pickNbPools(){ nbAnimalPool = nbPool(shuffleArray(NB_ANIMALS)); nbVehiclePool = nbPool(shuffleArray(NB_VEHICLES)); }

function objFamily(k){ return k.split("_")[0]; }
let peObjTriggers = ["umbrella_red"];
function pickPeObjTriggers(){
const fams = shuffleArray(Object.keys(SRH_OBJ_FAMILIES));
const pickIn = (f) => randomItem(SRH_OBJ_FAMILIES[f]);
let tr, g = 0;
do{ tr = stIx() === 1 ? [pickIn(fams[0]), pickIn(fams[1])] : [pickIn(fams[0])]; g++; } while(g < 20 && tr.join() === peObjTriggers.join());
peObjTriggers = tr; return tr;
}
function makePeObjGrid(n){
pickPeObjTriggers();
const famsAll = Object.keys(SRH_OBJ_FAMILIES);
const trigFams = peObjTriggers.map(objFamily);
const others = shuffleArray(famsAll.filter(f => !trigFams.includes(f))).slice(0, isPre() ? 2 : 3);
const fillPool = others.flatMap(f => SRH_OBJ_FAMILIES[f]);
const lurePool = trigFams.flatMap(f => SRH_OBJ_FAMILIES[f]).filter(k => !peObjTriggers.includes(k));
const tCount = Math.max(1, Math.round(n * 0.2)), lCount = Math.min(n - tCount, Math.round(n * 0.15));
let flags, g = 0;
do{ flags = shuffleArray(Array.from({length:n}, (_, i) => i < tCount ? "T" : (i < tCount + lCount ? "L" : "N")));
let ok = true; for(let i = 1; i < n; i++) if(flags[i] === "T" && flags[i-1] === "T") ok = false; if(ok) break; g++; } while(g < 500);
let ti = Math.floor(Math.random() * peObjTriggers.length);
const items = [];
flags.forEach((f, i) => {
let k, gg = 0;
do{ k = f === "T" ? peObjTriggers[(ti++) % peObjTriggers.length] : f === "L" ? randomItem(lurePool) : randomItem(fillPool); gg++; }
while(gg < 20 && items[i-1] && items[i-1].k === k);
items.push({ k });
});
return items;
}
const peObjMatch = (item) => peObjTriggers.indexOf(item.k);
const peObjName = (k) => trUpper(OBJ_NAMES[k] || k);
const SEA_KEYS = ["fish","dolphin","octopus","starfish","turtle","crab","seahorse","shark"];
const TOY_KEYS = ["car","doll","ball","teddy","puzzle","train","kite","drum"];
let seaPool = null, toyPool = null;
function pickSeaPool(){ seaPool = nbPool(shuffleArray(SEA_KEYS)); }
function pickToyPool(){ toyPool = nbPool(shuffleArray(TOY_KEYS)); }


let wmState = null, wmTimers = [];
function wmClearTimers(){ wmTimers.forEach(t => clearTimeout(t)); wmTimers = []; }
function wmLater(fn, ms){ const st = wmState; wmTimers.push(setTimeout(() => { if(wmState === st && timerRunning) fn(); }, ms * (window.__wmSpeed || 1))); }
const WM_SPECS = {
"wm-same":  { trials:[14, 18, 22], preTrials:[9, 11, 13] },
"wm-seq":   { pics:[6, 8, 8], prePics:[4, 5, 6], startLen:[3, 4, 5], preStartLen:[2, 3, 4], rounds:5, preRounds:4 },
"wm-where": { boxes:[6, 6, 6], preBoxes:[4, 4, 4], animals:[2, 4, 6], preAnimals:[2, 3, 4], rounds:2 }
};
function wmTier(){ return currentCombo().t; }
function wmBuild(){
const id = currentExercise().id, t = wmTier(), pre = isPre(), sp = WM_SPECS[id];
wmClearTimers();
if(id === "wm-same"){
const n = stIx() === 1 ? 2 : 1;
const T = (pre ? sp.preTrials : sp.trials)[t];
const pool = nbPool(shuffleArray(SEA_KEYS));
const seq = [];
const total = T + n;
const judged = Array.from({length:T}, (_, i) => i < Math.round(T * 0.35));
let flags, g = 0;
do{ flags = shuffleArray(judged.slice()); let run = 0, ok = true; for(const f of flags){ run = f ? run + 1 : 0; if(run > 2){ ok = false; break; } } if(ok) break; g++; } while(g < 300);
for(let i = 0; i < total; i++){
if(i < n){ let k; do{ k = randomItem(pool); } while(seq.length && seq[seq.length-1] === k && pool.length > 1); seq.push(k); continue; }
const isT = flags[i - n];
if(isT) seq.push(seq[i - n]);
else { let k, gg = 0; do{ k = randomItem(pool); gg++; } while(gg < 30 && (k === seq[i - n] || (n === 1 && k === seq[i-1] && false))); seq.push(k); }
}
wmState = { kind:"same", n, seq, idx:0, wrong:0, answered:0, total:T, phase:"idle", res:[] };
return seq.map((k, i) => ({ k, judged: i >= n, target: i >= n && seq[i] === seq[i - n] }));
}
if(id === "wm-seq"){
const K = (pre ? sp.prePics : sp.pics)[t], L0 = (pre ? sp.preStartLen : sp.startLen)[t], R = pre ? sp.preRounds : sp.rounds;
const pics = shuffleArray(TOY_KEYS).slice(0, K);
wmState = { kind:"seq", pics, maxLen:Math.min(K, L0 + 3), len:Math.min(L0, K), round:0, rounds:R, wrong:0, phase:"idle", seq:[], pos:0, back: stIx() === 1, res:[] };
return Array.from({length:R}, (_, i) => ({ round:i }));
}
const B = (pre ? sp.preBoxes : sp.boxes)[t], A = (pre ? sp.preAnimals : sp.animals)[t], R = sp.rounds;
wmState = { kind:"where", B, A, round:0, rounds:R, wrong:0, phase:"idle", boxes:[], ask:[], askIdx:0, res:[] };
return Array.from({length:R}, (_, i) => ({ round:i }));
}
function wmSizes(board){
const isLs = landscapeMQ.matches, W = (board.clientWidth || 360) - 24;
const H = isLs ? (board.clientHeight || 280) - 20 : Math.min(560 * tabletScale(), window.innerHeight - 280);
return { W, H, isLs };
}
/* Tablet katsayısı: ekranın kısa kenarı 700 noktayı geçiyorsa (iPad) resimler ve alanlar %50 büyür; telefonda 1 */
function tabletScale(){ const m = Math.min(window.innerWidth, window.innerHeight); return m >= 700 ? 1.5 : m >= 600 ? 1.25 : 1; }
function wmGridDims(count, W, H, maxCell, cap){ maxCell = Math.min(cap || 170, Math.max(maxCell, 110) * tabletScale()) * (window._fitK || 1);   /* yer varsa hücreler en az 110 noktaya kadar büyüyebilir; genişlik/yükseklik yine sınırlar */
const cands = [];
for(let cols = 1; cols <= count; cols++){
const rows = Math.ceil(count / cols);
const cell = Math.min(maxCell, Math.floor(Math.min((W - (cols - 1) * 10) / cols, (H - (rows - 1) * 10) / rows)));
cands.push({ cols, cell, empty: cols * rows - count });
}
/* KURAL: ızgarada son satır eksik kalmaz — hücre boyu en iyinin %60'ından (en az 56 nokta) küçük olmayan ve en/boy oranı 3'ü aşmayan dizilimler arasında boş hücresi en az olan seçilir (yalnız asal sayılarda kaçınılmaz) */
const best = Math.max(...cands.map(c => c.cell)); const ok = cands.filter(c => { const rows = Math.ceil(count / c.cols); return c.cell >= Math.max(best * 0.6, Math.min(56, best)) && Math.max(rows / c.cols, c.cols / rows) <= 3; });
const pool = ok.length ? ok : cands;
return pool.sort((a, b) => a.empty - b.empty || b.cell - a.cell || Math.abs(Math.ceil(count / a.cols) - a.cols) - Math.abs(Math.ceil(count / b.cols) - b.cols) || b.cols - a.cols)[0];
}

function renderWmBoard(){ try{
const board = document.getElementById("board");
board.style.display = "block"; board.style.minHeight = ""; board.style.padding = landscapeMQ.matches ? "6px 8px" : "12px";
board.style.gridTemplateColumns = ""; board.style.gridTemplateRows = ""; board.classList.remove("wide-grid");
if(!wmState) return;
const S = wmSizes(board), st = wmState;
if(st.kind === "same"){
const card = Math.min(S.isLs ? S.H - 30 : 230, S.W * (S.isLs ? 0.4 : 0.7));
const cur = st.phase === "idle" ? null : st.seq[st.idx];
const holding = st.phase === "hold";
const face = st.phase === "idle" ? `<span class="hold">▶ Başlat'a bas</span>` : st.phase === "gap" ? "" : imgTag(SEA_IMAGES[cur]).replace("88%", "82%").replace("88%", "82%");
const info = st.phase === "idle" ? `${st.n === 1 ? "Bir önceki" : "İki önceki"} kartla karşılaştır` : holding ? `<b>Aklında tut…</b>` : st.phase === "done" ? `Bitti!` : `Kart <b>${Math.max(1, st.idx - st.n + 1)}</b> / ${st.total}`;
const btns = `<div class="wm-btns"><button type="button" class="wm-btn same" data-ans="1" ${st.phase === "ask" ? "" : "disabled"}>AYNI</button><button type="button" class="wm-btn diff" data-ans="0" ${st.phase === "ask" ? "" : "disabled"}>FARKLI</button></div>`;
board.innerHTML = S.isLs
? `<div class="wm-wrap" style="flex-direction:row;justify-content:center;gap:22px;"><div class="wm-card ${st.flash || ""}" id="wmCard" style="width:${card}px;height:${card}px;">${face}</div><div style="display:flex;flex-direction:column;gap:12px;align-items:center;width:44%"><div class="wm-info">${info}</div>${btns}</div></div>`
: `<div class="wm-wrap"><div class="wm-info">${info}</div><div class="wm-card ${st.flash || ""}" id="wmCard" style="width:${card}px;height:${card}px;">${face}</div>${btns}</div>`;
return;
}
if(st.kind === "seq"){
const d = wmGridDims(st.pics.length, S.isLs ? S.W * 0.7 : S.W, S.H - 60, S.isLs ? 110 : 96);
const info = st.phase === "idle" ? `Resimler sırayla parlayacak` : st.phase === "show" ? `<b>İzle…</b>` : st.phase === "input" ? `<b>${st.back ? "Tersten" : "Aynı sırayla"}</b> dokun · ${st.pos}/${st.seq.length}` : st.phase === "done" ? "Bitti!" : "";
const dots = `<div class="wm-dots">${Array.from({length:st.rounds}, (_, i) => `<i class="${st.res[i] === true ? "on" : st.res[i] === false ? "off" : ""}"></i>`).join("")}</div>`;
const tapped = st.tapped || {};
const grid = `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + st.pics.map((k, i) => {
const cls = (st.lit === i ? " lit" : "") + (tapped[i] === "ok" ? " ok" : tapped[i] === "bad" ? " bad" : "");
const num = st.nums && st.nums[i] ? `<span class="num">${st.nums[i]}</span>` : "";
return `<div class="wm-pic${cls}" data-pic="${i}" style="width:${d.cell}px;height:${d.cell}px;">${imgTag(TOY_IMAGES[k])}${num}</div>`; }).join("") + `</div>`;
board.innerHTML = `<div class="wm-wrap"><div class="wm-info">${info}</div>${dots}${grid}</div>`;
return;
}
const d = wmGridDims(st.B, S.isLs ? S.W * 0.68 : S.W, S.H - (S.isLs ? 108 : 90), 120);
const askK = st.phase === "ask" ? st.ask[st.askIdx] : null;
const info = st.phase === "idle" ? `Hayvanlar kutulara saklanacak` : st.phase === "show" ? `<b>Hangi hayvan nerede? Aklında tut…</b>` : st.phase === "done" ? "Bitti!" : "";
const askHtml = askK ? `<div class="wm-ask">${imgTag(animalImg(askK)).replace(/style="[^"]*"/, "")}<span>${trUpper(ANIMAL_NAMES[askK])} nerede?</span></div>` : `<div class="wm-info">${info}</div>`;
const dots = `<div class="wm-dots">${Array.from({length:st.rounds}, (_, i) => `<i class="${st.res[i] === true ? "on" : st.res[i] === false ? "off" : ""}"></i>`).join("")}</div>`;
const grid = `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + Array.from({length:st.B}, (_, i) => {
const a = st.boxes[i]; const open = st.phase === "show" || (st.opened && st.opened[i]);
const mark = st.mark && st.mark[i] ? " " + st.mark[i] : "";
return `<div class="wm-box${open ? " open" : ""}${mark}" data-box="${i}" style="width:${d.cell}px;height:${d.cell}px;">${a ? imgTag(animalImg(a)) : ""}<div class="lid">?</div></div>`; }).join("") + `</div>`;
board.innerHTML = `<div class="wm-wrap">${askHtml}${dots}${grid}</div>`;
}finally{ try{ zaTapRestore(); }catch(e){} } }
function wmStart(){
const st = wmState; if(!st || st.phase !== "idle") return;
if(st.kind === "same"){ wmSameShow(); return; }
if(st.kind === "seq"){ wmSeqRound(); return; }
wmWhereRound();
}
function wmFinish(){
const st = wmState; st.phase = "done"; renderWmBoard();
const wrong = st.wrong;
stopTimer();
showLevelFlash(wrong ? `Bitti! ${wrong} hata.` : "Bitti! Hiç hata yok 🎉", wrong ? "down" : "levelup");
}
function wmErr(){ wmState.wrong++; setErrorCount(currentErrorCount + 1); try{ vibrate(60); }catch(e){} gameSfx("wrong"); }
function wmSameShow(){
const st = wmState;
st.phase = "gap"; st.flash = ""; renderWmBoard();
wmLater(() => {
st.phase = st.idx < st.n ? "hold" : "ask"; renderWmBoard();
if(st.phase === "hold") wmLater(() => { st.idx++; wmSameShow(); }, 1300);
}, 180);
}
function wmSameAnswer(same){
const st = wmState; if(!st || st.phase !== "ask") return;
const target = st.seq[st.idx] === st.seq[st.idx - st.n];
const ok = (same === 1) === target;
st.answered++; st.flash = ok ? "ok" : "bad";
if(ok) gameSfx("correct"); else wmErr();
st.phase = "feedback"; renderWmBoard();
wmLater(() => { st.idx++; if(st.idx >= st.seq.length) wmFinish(); else wmSameShow(); }, 380);
}
function wmSeqRound(){
const st = wmState;
st.seq = []; const K = st.pics.length;
if(st.len <= K){ st.seq = shuffleArray(Array.from({length: K}, (_, i) => i)).slice(0, st.len); } else { while(st.seq.length < st.len){ const i = Math.floor(Math.random() * K); if(st.seq[st.seq.length-1] !== i) st.seq.push(i); } }   /* KURAL: resim sayısı yettikçe dizide her resim bir kez geçer (aynı resim iki kez yanmaz) */
st.pos = 0; st.tapped = {}; st.nums = {}; st.phase = "show"; st.lit = null; renderWmBoard();
const on = isPre() ? 850 : 700, off = 300;
st.seq.forEach((pi, k) => {
wmLater(() => { st.lit = pi; renderWmBoard(); gameSfx("pop"); }, 500 + k * (on + off));
wmLater(() => { st.lit = null; renderWmBoard(); }, 500 + k * (on + off) + on);
});
wmLater(() => { st.phase = "input"; renderWmBoard(); }, 500 + st.seq.length * (on + off) + 150);
}
function wmSeqTap(i){
const st = wmState; if(!st || st.phase !== "input") return;
const order = st.back ? st.seq.slice().reverse() : st.seq;
if(order[st.pos] === i){
st.tapped = {}; st.tapped[i] = "ok"; st.pos++; st.nums[i] = (st.nums[i] ? st.nums[i] + "," : "") + st.pos; gameSfx("correct"); renderWmBoard();
if(st.pos >= order.length){ st.res[st.round] = true; st.phase = "between"; wmLater(() => wmSeqNext(true), 700); }
} else {
st.tapped = {}; st.tapped[i] = "bad"; wmErr(); st.res[st.round] = false; st.phase = "between"; renderWmBoard();
st.nums = {}; order.forEach((pi, k) => { st.nums[pi] = (st.nums[pi] ? st.nums[pi] + "," : "") + (k + 1); });
wmLater(() => { renderWmBoard(); }, 250);
wmLater(() => wmSeqNext(false), 1500);
}
}
function wmSeqNext(success){
const st = wmState;
st.round++;
if(st.round >= st.rounds){ wmFinish(); return; }
if(success) st.len = Math.min(st.pics.length, st.maxLen || 99, st.len + 1);
wmSeqRound();
}
function wmWhereRound(){
const st = wmState;
const animals = shuffleArray(NB_ANIMALS).slice(0, st.A);
const slots = shuffleArray(Array.from({length:st.B}, (_, i) => i)).slice(0, st.A);
st.boxes = Array.from({length:st.B}, () => null); animals.forEach((a, k) => { st.boxes[slots[k]] = a; });
st.ask = shuffleArray(animals.slice()); st.askIdx = 0; st.opened = {}; st.mark = {}; st.roundWrong = 0;
st.phase = "show"; renderWmBoard();
const showMs = (isPre() ? 1600 : 1200) + st.A * (isPre() ? 800 : 600);
wmLater(() => { st.phase = "ask"; renderWmBoard(); if(gameMode) speakText(`${ANIMAL_NAMES[st.ask[0]]} nerede?`); }, showMs);
}
function wmWhereTap(i){
const st = wmState; if(!st || st.phase !== "ask") return;
const want = st.ask[st.askIdx];
const right = st.boxes.indexOf(want);
st.phase = "reveal";
if(i === right){ st.opened = {}; st.opened[i] = true; st.mark = {}; st.mark[i] = "ok"; gameSfx("correct"); }
else { st.opened = {}; st.opened[right] = true; st.mark = {}; st.mark[i] = "bad"; st.roundWrong++; wmErr(); }
renderWmBoard();
wmLater(() => {
st.opened = {}; st.mark = {}; st.askIdx++;
if(st.askIdx >= st.ask.length){
st.res[st.round] = st.roundWrong === 0; st.round++;
if(st.round >= st.rounds){ wmFinish(); return; }
wmWhereRound(); return;
}
st.phase = "ask"; renderWmBoard(); if(gameMode) speakText(`${ANIMAL_NAMES[st.ask[st.askIdx]]} nerede?`);
}, 900);
}
function handleWmTap(ev){
const ex = currentExercise(); if(!ex.isWm || !wmState) return;
const b = ev.target.closest("[data-ans],[data-pic],[data-box]"); if(!b) return;
if(!timerRunning){ showLevelFlash("Önce ▶ Başlat'a basın.", "down"); return; }
if(b.dataset.ans !== undefined) wmSameAnswer(Number(b.dataset.ans));
else if(b.dataset.pic !== undefined) wmSeqTap(Number(b.dataset.pic));
else wmWhereTap(Number(b.dataset.box));
}
document.getElementById("board").addEventListener("click", (ev) => { if(Date.now() - (window._fastTapTs || 0) < 700) return; handleWmTap(ev); });
window.addEventListener("resize", () => { clearTimeout(window._wmResizeT); window._wmResizeT = setTimeout(() => { try{ if(currentExercise().isWm) renderWmBoard(); }catch(e){} }, 150); });




const HOUSE_NAMES = { cup:"fincan", scissors:"makas", clock:"saat", lamp:"lamba", comb:"tarak", pillow:"yastık", bucket:"kova", broom:"süpürge" };
const WILD_NAMES = { lion:"aslan", giraffe:"zürafa", zebra:"zebra", monkey:"maymun", bear:"ayı", fox:"tilki", squirrel:"sincap", hedgehog:"kirpi" };
const WILD_KEYS = Object.keys(WILD_NAMES), HOUSE_KEYS = Object.keys(HOUSE_NAMES);

const CAT_TOUCH = {
"cat-fruit": { stageOrder:[0, 1], groups:[["meyve","meyvelere"],["sebze","sebzelere"]], items:() => Object.keys(FRUIT_VEG_CATEGORY).map(k => ({ k, g: FRUIT_VEG_CATEGORY[k], src: FRUIT_VEG_IMAGES[k] })) },
"cat-living": { dyn: true, stageOrder:[0, 1], groups:[["canlı","canlılara"],["cansız","cansızlara"]], items:() => [] },   /* dinamik: kural tur başına değişir (catDynSpec) */
"cat-cold": { stageOrder:[1, 0], groups:[["soğuk","soğuklara"],["sıcak","sıcaklara"]], items:() => HOTCOLD_COLD.map(k => ({ k, g:"soğuk", src: HOTCOLD_IMAGES[k] })).concat(HOTCOLD_HOT.map(k => ({ k, g:"sıcak", src: HOTCOLD_IMAGES[k] }))) }
};
const catTarget = {};
/* Canlılara Dokun: hedef kuralı tur başına değişir (Hızlı Seç'in kural tablosu); düzey havuzu genişletir */
const CAT_PHRASE = { HAYVAN:"hayvanlara", EŞYA:"eşyalara", CANLI:"canlılara", CANSIZ:"cansızlara", YENİR:"yenilebilenlere", YENMEZ:"yenmeyenlere", UÇAR:"uçabilenlere", UÇMAZ:"uçamayanlara", SUDA:"suda yaşayanlara", KARADA:"karada yaşayanlara", TAŞIT:"taşıtlara", DEĞİL:"taşıt olmayanlara", SICAK:"sıcaklara", SOĞUK:"soğuklara", MEYVE:"meyvelere", SEBZE:"sebzelere", GİYİLİR:"giyilenlere", GİYİLMEZ:"giyilmeyenlere" };
const catDyn = {};   // id → { key, groups }
function catDynSpec(id){ let pool = (isPre() ? QS_TIER.pre : QS_TIER.post)[Math.min(currentCombo().t, 2)]; /* KURAL (yönerge dili, 2026-11-08): yönergeler ve oyun içi metinler günlük dille yazılır — "ötekiler" değil "diğerleri", "uyaklı" değil "sonu benzeyen" */ /* KURAL (Kurala Göre Dokun kural havuzu, 2026-11-08): İşlemleme Hızı'nda Sıcak–Soğuk: Dokun ve Meyve–Sebze: Dokun ayrı çalışmalar olduğu için Kurala Göre Dokun bu iki kuralı kullanmaz (aynı resimlerle iki aynı çalışma oluşuyordu) */ { const f = pool.filter(k => !["sicak", "meyve"].includes(k)); if(f.length) pool = f; } const prev = catDyn[id] ? catDyn[id].key : null; const s1 = catS1[id]; const key = (stIx() === 1 && s1 && s1.key && pool.includes(s1.key)) ? s1.key : (pool.length > 1 ? pickDifferent(pool, prev) : pool[0]);   /* Aşama 2 ("tersi") Aşama 1'deki kuralı korur */ const R = qsRules()[key];
  const groups = [[R.a.id + "_a", CAT_PHRASE[R.a.l] || R.a.l.toLocaleLowerCase("tr")], [R.b.id + "_b", CAT_PHRASE[R.b.l] || R.b.l.toLocaleLowerCase("tr")]]; catDyn[id] = { key, groups };
  const mk = (arr, g) => (arr || []).filter(Boolean).map((src, i) => ({ k: g + i, g, src }));   /* resmi olmayan öğe (eski resim dosyası) atlanır */
  return { groups, items: () => mk(R.a.pool, groups[0][0]).concat(mk(R.b.pool, groups[1][0]), isPre() ? [] : mk(R.a.trick, groups[0][0]).map(x => Object.assign(x, { k: "tA" + x.k })), isPre() ? [] : mk(R.b.trick, groups[1][0]).map(x => Object.assign(x, { k: "tB" + x.k }))) }; }
const catS1 = {};
function makeCatTouchGrid(n){ const id = currentExercise().id, spec = CAT_TOUCH[id].dyn ? catDynSpec(id) : CAT_TOUCH[id];
const gi = CAT_TOUCH[id].stageOrder ? CAT_TOUCH[id].stageOrder[Math.min(stIx(), 1)] : ((stIx() === 1 && catS1[id]) ? 1 - catS1[id].gi : (catTarget[id] === undefined ? Math.floor(Math.random() * 2) : 1 - catTarget[id]));
if(stIx() === 0) catS1[id] = { gi, key: catDyn[id] ? catDyn[id].key : null };   /* KURAL (içerik uyumu): ters kuralla çalışan ikinci aşama, önceki aşamanın kuralının gerçekten tersidir */   /* aşamalı çalışmada hedef aşamadan gelir (Aşama 1 / Aşama 2) */   // her sayfada / Karıştır'da hedef değişir
catTarget[id] = gi;
const tg = spec.groups[gi][0];
let all = spec.items();
if(isPre()){ const a = shuffleArray(all.filter(x => x.g === tg)).slice(0, 3), b = shuffleArray(all.filter(x => x.g !== tg)).slice(0, 3); all = a.concat(b); }
const T = all.filter(x => x.g === tg), O = all.filter(x => x.g !== tg);
const tCount = Math.round(n * 0.4);
let flags, g = 0;
do{ flags = shuffleArray(Array.from({length:n}, (_, i) => i < tCount)); let run = 0, ok = true; for(const f of flags){ run = f ? run + 1 : 0; if(run > 2){ ok = false; break; } } if(ok) break; g++; } while(g < 400);
const items = [];
flags.forEach((f, i) => { let it, gg = 0; do{ it = randomItem(f ? T : O); gg++; } while(gg < 20 && items[i-1] && items[i-1].k === it.k); items.push({ k: it.k, src: it.src, go: f }); });
return items;
}
const catTargetWord = (id) => { const sp = (CAT_TOUCH[id].dyn && catDyn[id]) ? catDyn[id] : CAT_TOUCH[id]; const gi = CAT_TOUCH[id].stageOrder ? CAT_TOUCH[id].stageOrder[Math.min(stIx(), 1)] : (catTarget[id] || 0); return sp.groups[gi]; };

let chState = null, chTimers = [];
function chClear(){ chTimers.forEach(t => clearTimeout(t)); chTimers = []; }
function chLater(fn, ms){ const st = chState; chTimers.push(setTimeout(() => { if(chState === st && timerRunning) fn(); }, ms * (window.__wmSpeed || 1))); }
const SEL_N = { post:[16, 20, 24], pre:[10, 12, 14] };   /* KURAL: seçim yapılan kart/deneme sayısı (Okul Öncesi = 3/5 oranı) */
const selCount = () => (isPre() ? SEL_N.pre : SEL_N.post)[Math.min(currentCombo().t, 2)];
const CH_TRIALS = SEL_N;
function chTrialCount(spec){ const tb = spec.trials || CH_TRIALS; return (isPre() ? tb.pre : tb.post)[Math.min(currentCombo().t, 2)]; }
const CHOICE = {};
/* Aynı doğru cevap art arda en çok maxRun kez: sorular değişmez, yalnızca tur içindeki sırası düzenlenir */
function limitRuns(arr, keyFn, maxRun){ if(!Array.isArray(arr) || arr.length < 3) return arr; const left = arr.map((x, i) => ({ x, i, k: String(keyFn(x)) })), out = [];
  while(left.length){ let run = 0; const last = out.length ? out[out.length - 1].k : null; for(let q = out.length - 1; q >= 0 && out[q].k === last; q--) run++;
    const cnt = {}; left.forEach(o => { cnt[o.k] = (cnt[o.k] || 0) + 1; }); const ok = left.filter(o => !(o.k === last && run >= maxRun)); const pool = ok.length ? ok : left;
    const mx = Math.max(...pool.map(o => cnt[o.k])); const pick = pool.find(o => cnt[o.k] === mx); out.push(pick); left.splice(left.indexOf(pick), 1); }
  return out.map(o => o.x); }
const qzAnsKey = (q) => { if(q && q.res !== undefined) return String(q.res); if(!q || !q.opts || q.ans == null) return JSON.stringify(q && q.ans); const h = String(q.opts[q.ans]); return h.replace(/<[^>]+>/g, "").trim() || h; };
const CH_NORUN = new Set(["switch-touch"]), QZ_NORUN = ["sem-decide","sent-verify","syl-touch","absurd-touch","rhyme-touch","overlap-count","mental-math"];
function chBuild(){
const id = currentExercise().id, spec = CHOICE[id];
chClear();
const ctx = spec.setup ? spec.setup() : {};
const trials = spec.trials_make(chTrialCount(spec), ctx); if(CH_NORUN.has(id)){ const R = limitRuns(trials, x => String(spec.correct(x)), 2); trials.splice(0, trials.length, ...R); }   /* aynı doğru tepki art arda en çok 2 */
chState = { id, spec, ctx, trials, idx:0, wrong:0, phase:"idle", flash:"", rts:[], picked:null };
try{ renderInstruction(); }catch(e){}   /* yönerge, yeni kurulan dizinin rastgele seçimine (ör. dur yüzü) göre yeniden yazılır */
return trials;
}
function chStart(){ try{ if(chState && chState.phase === "idle") chFirstGo(); }catch(e){} try{ if(!chState || chState.phase !== "idle") return; chNext(); }finally{ chBreakRuns(); } }
function chNext(){
const st = chState;
if(st.idx >= st.trials.length){ st.phase = "done"; renderChoiceBoard(); stopTimer(); showLevelFlash(st.wrong ? `Bitti! ${st.wrong} hata.` : "Bitti! Hiç hata yok 🎉", st.wrong ? "down" : "levelup"); return; }
st.phase = "gap"; st.flash = ""; st.picked = null; renderChoiceBoard();
chLater(() => {
st.phase = "ask"; st.shownAt = performance.now(); renderChoiceBoard();
const w = st.spec.window ? st.spec.window() : 0;
const myIdx = st.idx;
if(w) chLater(() => { if(st.phase === "ask" && st.idx === myIdx) chAnswer(null); }, w);
}, st.spec.gap || 220);
}
function chAnswer(btnId){
const st = chState; if(!st || st.phase !== "ask") return;
const tr = st.trials[st.idx];
const correct = st.spec.correct(tr, st.ctx);
const ok = btnId === correct;
if(btnId !== null) st.rts.push(performance.now() - st.shownAt);
st.picked = btnId; st.flash = ok ? "ok" : "bad";
if(ok) gameSfx("correct"); else { st.wrong++; setErrorCount(currentErrorCount + 1); try{ vibrate(60); }catch(e){} gameSfx("wrong"); }
st.phase = "feedback"; renderChoiceBoard();
chLater(() => { st.idx++; chNext(); }, ok ? 260 : (st.spec.tapStim ? 1400 : 520));   /* resme dokunmalı çalışmalarda yanlışta düzeltme notu okunabilsin */
}
function renderChoiceBoard(){ try{
const board = document.getElementById("board");
board.style.display = "block"; board.style.minHeight = ""; board.style.padding = landscapeMQ.matches ? "6px 8px" : "12px";
board.style.gridTemplateColumns = ""; board.style.gridTemplateRows = ""; board.classList.remove("wide-grid");
if(!chState) return;
const st = chState, sp = st.spec, isLs = landscapeMQ.matches;
const W = (board.clientWidth || 360) - 24, H = isLs ? (board.clientHeight || 280) - 16 : Math.min(560 * tabletScale(), window.innerHeight - 280);
const stimSize = Math.floor(Math.min(isLs ? H - 20 : 220 * tabletScale(), W * (isLs ? 0.42 : 0.75)));   /* tablette uyaran büyür */
const tr = st.trials[st.idx];
const stim = st.phase === "idle" ? `<span class="hold">▶ Başlat'a bas</span>` : st.phase === "done" ? `<span class="hold">Bitti!</span>` : st.phase === "gap" ? "" : sp.stim(tr, stimSize, st.ctx);   /* Tahmin Et – Yap – Karşılaştır katmanı: işaretli çalışmalarda */
const buttons = sp.buttons(st.ctx, tr);   /* deneme bazlı düğmeler (Hızlı Seç: yer ve kural değişimi); tapStim: seçim resmin kendisine dokunarak */
const corr = st.phase === "feedback" ? sp.correct(tr, st.ctx) : undefined;
const btnHtml = sp.tapStim ? (st.phase === "ask" ? `<div class="aud-key" style="text-align:center">Resme dokun</div>` : "") : `<div class="ch-btns" style="grid-template-columns:repeat(${Math.min(buttons.length, (typeof sp.cols === "function" ? sp.cols(buttons.length) : sp.cols) || buttons.length)}, minmax(0, 1fr));">` + buttons.map(b => {
let cls = "";
if(st.phase === "feedback"){ if(b.id === st.picked) cls = st.flash === "ok" ? " ok" : " bad"; else if(b.id === corr && st.flash === "bad") cls = " show"; }
return `<button type="button" class="ch-btn${cls}" data-ch="${b.id}" ${st.phase === "ask" ? "" : "disabled"} style="${b.style || ""}">${b.html}</button>`; }).join("") + `</div>`;
const key = sp.key ? sp.key(st.ctx) : "";
const prog = st.phase === "idle" ? (sp.hint ? sp.hint(st.ctx) : "") : st.phase === "done" ? "" : `Deneme <b>${Math.min(st.idx + 1, st.trials.length)}</b> / ${st.trials.length}`;
const stimBox = `<div class="wm-card ${sp.tapStim ? "" : (st.flash || "")}" style="width:${sp.wideStim ? Math.min(W, stimSize * 1.8) : stimSize}px;height:${stimSize}px;${sp.tapStim ? "padding:0;" : ""}">${stim}</div>`;
board.innerHTML = isLs
? `<div class="wm-wrap" style="flex-direction:row;justify-content:center;gap:20px;">${stimBox}<div style="display:flex;flex-direction:column;gap:10px;align-items:center;width:46%">${key}<div class="wm-info">${prog}</div>${btnHtml}</div></div>`
: `<div class="wm-wrap">${key}<div class="wm-info">${prog}</div>${stimBox}${btnHtml}</div>`;
}finally{ try{ zaTapRestore(); }catch(e){} } }
function handleChoiceTap(ev){
if(!currentExercise().isChoice || !chState) return;
const b = ev.target.closest("[data-ch]"); if(!b) return;
if(!timerRunning){ showLevelFlash("Önce ▶ Başlat'a basın.", "down"); return; }
chAnswer(b.dataset.ch);
}
document.getElementById("board").addEventListener("click", (ev) => { if(Date.now() - (window._fastTapTs || 0) < 700) return; handleChoiceTap(ev); });
window.addEventListener("resize", () => { clearTimeout(window._chResizeT); window._chResizeT = setTimeout(() => { try{ if(currentExercise().isChoice) renderChoiceBoard(); }catch(e){} }, 150); });
const imgFill = (src, flip) => `<img src="${src}" alt="" style="width:82%;height:82%;object-fit:contain;display:block;${flip ? "transform:scaleX(-1);" : ""}">`;

CHOICE["sdmt-touch"] = {
setup: () => { const shapes = shuffleArray(["circle","triangle","square","star","heart"]); const pics = shuffleArray(HOUSE_KEYS).slice(0, (isPre() ? [3, 3, 4] : [3, 4, 5])[Math.min(currentCombo().t, 2)]);   /* anahtar düzeyle büyür */
const pairs = pics.map((p, i) => ({ shape: shapes[i], img: p })); return { pairs, order: shuffleArray(pairs.map(p => p.img)) }; },
trials_make: (n, c) => { const a = []; while(a.length < n){ const p = randomItem(c.pairs); if(!a.length || a[a.length-1].shape !== p.shape) a.push(p); } return a; },
stim: (t, sz) => `<svg viewBox="0 0 100 100" style="width:70%;height:70%">${sortShapeSVG(t.shape, "#1F2A33")}</svg>`,
buttons: (c) => c.order.map(k => ({ id: k, html: imgFill(HOUSE_IMAGES[k]) })),
correct: (t) => t.img,
key: (c) => `<div class="ch-key">${c.pairs.map(p => `<div class="ch-kp"><svg viewBox="0 0 100 100">${sortShapeSVG(p.shape, "#1F2A33")}</svg>${imgFill(HOUSE_IMAGES[p.img])}</div>`).join("")}</div>`,
cols: 5   /* deneme sayısı ortak kuraldan (SEL_N) */
};
const STROOP_T = [{ c:ACC.kirmizi, n:"KIRMIZI" }, { c:ACC.mavi, n:"MAVİ" }, { c:ACC.yesil, n:"YEŞİL" }, { c:ACC.turuncu, n:"TURUNCU" }, { c:ACC.mor, n:"MOR" }];
CHOICE["stroop-touch"] = {
setup: () => { const k = (isPre() ? [3, 3, 4] : [3, 4, 5])[Math.min(currentCombo().t, 2)]; const set = shuffleArray(STROOP_T.slice(0, 4)).slice(0, Math.min(k, 4)).concat(k >= 5 ? [STROOP_T[4]] : []); return { order: shuffleArray(set), set }; },   /* renk sayısı düzeyle büyür */
trials_make: (n, c) => { const set = (c && c.set) || STROOP_T.slice(0, 4); const inks = balancedSeq(n, set.map((x, i) => i), 1);   /* aynı mürekkep rengi art arda gelmez */
  const nCong = Math.round(n * 0.25), cong = balancedSeq(n, [true, false], 1, [nCong, n - nCong]); const a = []; let pw = -1;
  for(let i = 0; i < n; i++){ const ik = inks[i]; let wk = ik; if(!cong[i] || pw === ik){ const cand = set.map((x, j) => j).filter(j => j !== ik && j !== pw && (i === 0 || j !== inks[i - 1])); wk = cand.length ? randomItem(cand) : set.map((x, j) => j).find(j => j !== ik && j !== pw); if(wk === undefined) wk = set.map((x, j) => j).find(j => j !== ik); } pw = wk; a.push({ ink: set[ik].c, word: set[wk].n, cong: wk === ik }); }
  return a; },
stim: (t, sz) => `<span style="font-size:${Math.round(sz * 0.2)}px;font-weight:900;color:${t.ink};letter-spacing:1px">${t.word}</span>`,
buttons: (c) => c.order.map(x => ({ id: x.c, html: "", style: `background:${x.c};min-height:64px;` })),
correct: (t) => t.ink, cols: 0, wideStim: true   /* sütun = renk sayısı */
};
CHOICE["day-night-touch"] = {
setup: () => ({ order: shuffleArray(["sun","moon"]) }),
trials_make: (n) => { const f = makeDayNightGrid(n); return f.map(x => ({ k: x.k })); },
stim: (t) => imgFill(DN_IMAGES[t.k]),
buttons: (c) => c.order.map(k => ({ id: k, html: imgFill(DN_IMAGES[k]) })),
correct: (t) => t.k === "sun" ? "moon" : "sun", cols: 2
};
/* Dengeli dizi: değerler mümkün olduğunca eşit sayıda; aynı değer en çok maxRun kez art arda */
function balancedSeq(n, values, maxRun, counts){ const want = counts || values.map((v, i) => Math.floor(n / values.length) + (i < n % values.length ? 1 : 0)); let best = null;
  for(let tries = 0; tries < 60; tries++){ const bag = []; shuffleArray(values.map((v, i) => [v, want[i]])).forEach(([v, c]) => { for(let k = 0; k < c; k++) bag.push(v); }); const a = shuffleArray(bag); let ok = true, run = 1; for(let k = 1; k < a.length; k++){ run = a[k] === a[k - 1] ? run + 1 : 1; if(run > maxRun){ ok = false; break; } } if(ok) return a; best = a; }
  /* rastgele denemeler tutmadıysa: kalan sayısı en çok olan ve sıra kuralını bozmayan değeri seçerek kesin kur */
  const left = want.slice(), out = [];
  for(let k = 0; k < n; k++){ let run = 1; for(let q = out.length - 1; q > 0 && out[q] === out[q - 1]; q--) run++; const last = out.length ? out[out.length - 1] : undefined;
    const ok = values.map((v, i) => i).filter(i => left[i] > 0 && !(values[i] === last && run >= maxRun)); const pool = ok.length ? ok : values.map((v, i) => i).filter(i => left[i] > 0); if(!pool.length) break;
    const mx = Math.max(...pool.map(i => left[i])); const pick = randomItem(pool.filter(i => left[i] === mx)); out.push(values[pick]); left[pick]--; }
  return out.length === n ? out : (best || []); }
/* Balıklar Hangi Yöne?: canlıların hepsi resimde SAĞA bakar; L = aynalanmış. N = yönsüz çeldirici. */
const FISH_KINDS_BY_TIER = [["fish","turtle"], ["fish","shark","turtle","seahorse"], ["fish","shark","turtle","seahorse"]], FISH_NEUTRAL = ["octopus","starfish","crab"];   /* ortadaki canlı her denemede değişir */
/* fishKindPrev: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
function fishSpec(){ const t = Math.min(currentCombo().t, 2); return isPre()
  ? [{ side:1, cong:0.6, neu:0,   jitter:false }, { side:2, cong:0.5, neu:0,   jitter:false }, { side:2, cong:0.4, neu:0.2, jitter:true }][t]
  : [{ side:2, cong:0.5, neu:0,   jitter:false }, { side:2, cong:0.4, neu:0.2, jitter:true }, { side:3, cong:0.35, neu:0.2, jitter:true }][t]; }
CHOICE["fish-flanker"] = {
setup: () => { const t = Math.min(currentCombo().t, 2), kinds = FISH_KINDS_BY_TIER[t].filter(k => SEA_IMAGES[k]); return { kinds: kinds.length ? kinds : ["fish"], mix: t === 2, spec: fishSpec() }; },   /* Zor: yanlardaki canlı ortadakinden farklı tür */
trials_make: (n, c) => { const sp = (c && c.spec) || fishSpec(), kinds = (c && c.kinds) || ["fish"]; let prevK = null;
  const nNeu = Math.round(n * sp.neu), nCong = Math.round((n - nNeu) * sp.cong), nInc = n - nNeu - nCong;
  const conds = balancedSeq(n, ["C","I","N"], 2, [nCong, nInc, nNeu]), dirs = balancedSeq(n, ["L","R"], 2);
  return conds.map((cd, k) => { const dir = dirs[k]; const kind = kinds.length > 1 ? pickDifferent(kinds, prevK) : kinds[0]; prevK = kind; const fkind = c && c.mix && kinds.length > 1 ? pickDifferent(kinds, kind) : kind; return { dir, flank: cd === "C" ? dir : cd === "I" ? (dir === "L" ? "R" : "L") : "N", kind, fkind, side: sp.side, dy: sp.jitter ? randomItem([-22, 0, 22]) : 0, neu: randomItem(FISH_NEUTRAL) }; }); },
stim: (t, sz) => { const items = (t.side || 2) * 2 + 1, w = Math.min(19, Math.floor(92 / items)); const src = (k) => SEA_IMAGES[k] || SEA_IMAGES.fish;
  const one = (d, k) => d === "N" ? `<img src="${src(t.neu)}" alt="" style="width:${w}%;object-fit:contain">` : `<img src="${src(k || t.kind)}" alt="" style="width:${w}%;object-fit:contain;${d === "L" ? "transform:scaleX(-1);" : ""}">`;
  const side = Array.from({ length: t.side || 2 }, () => one(t.flank, t.fkind)).join("");
  return `<div style="display:flex;align-items:center;justify-content:center;gap:1%;width:100%;transform:translateY(${t.dy || 0}%)">${side}${one(t.dir, t.kind)}${side}</div>`; },
buttons: () => [{ id:"L", html:'<span style="font-size:34px;font-weight:900">◀</span>' }, { id:"R", html:'<span style="font-size:34px;font-weight:900">▶</span>' }],
correct: (t) => t.dir, cols: 2, wideStim: true
};


/* Hızlı Seç: ayrım kuralları. Her tur bir kural seçilir (bir önceki turdan farklı); düzey, kural havuzunu genişletir.
   Her kuralın iki yanı var: a (sol) ve b (sağ); a/b havuzları + yanıltıcı öğeler (trick). */
function qsRules(){ const W = WILD_IMAGES, H = HOUSE_IMAGES, V = VEHICLE_IMAGES, T = TOY_IMAGES, F = FRUIT_VEG_IMAGES, O = OS_IMAGES, OB = OBJECT_IMAGES, X = PAL_EXTRA_IMAGES, HC = HOTCOLD_IMAGES, TS = TASTE_IMAGES, S = SRH_IMAGES, P = PAIR_IMAGES, SC = SCENE_OBJ_IMAGES;
  const wild = WILD_KEYS.map(k => W[k]), house = HOUSE_KEYS.map(k => H[k]);
  const food = [F.apple, F.banana, F.orange, F.grapes, F.strawberry, F.carrot, F.cucumber, F.tomato, OB.bread, OB.chocolate, TS.candy, TS.simit, O.cheese, O.egg, HC.soup];
  return {
    animal:  { a:{ id:"animal", l:"HAYVAN", e:"🐾", pool: wild }, b:{ id:"thing", l:"EŞYA", e:"🏠", pool: house } },
    canli:   { a:{ id:"animal", l:"CANLI", e:"🌱", pool: wild, trick:[LIVING_IMAGES.tree, O.sunflower, O.sprout, PART_IMAGES[4]] }, b:{ id:"thing", l:"CANSIZ", e:"🪨", pool: house.concat([V.bus_f, V.train_f]), trick:[T.teddy, T.doll, T.train, T.car] } },
    yenir:   { a:{ id:"yes", l:"YENİR", e:"🍎", pool: food }, b:{ id:"no", l:"YENMEZ", e:"🚫", pool: house.concat([T.ball, T.kite, T.drum, P.hammer, P.key, X.sock, V.bus_f]) } },
    ucar:    { a:{ id:"yes", l:"UÇAR", e:"🐦", pool: [O.butterfly, X.bee, V.plane_f, V.heli_f, SC.bird, SC.balloon] }, b:{ id:"no", l:"UÇMAZ", e:"🐾", pool: [W.lion, W.zebra, W.bear, W.fox, W.giraffe, V.bus_f, V.train_f, V.ship_f, T.ball, HC.penguin] } },
    suda:    { a:{ id:"yes", l:"SUDA", e:"🌊", pool: qzCats().sea.items.map(x => x.src).concat([V.ship_f, O.frog]) }, b:{ id:"no", l:"KARADA", e:"🌳", pool: wild.concat([V.bus_f, V.train_f, LIVING_IMAGES.tree]) } },
    tasit:   { a:{ id:"yes", l:"TAŞIT", e:"🚌", pool: [V.bus_f, V.plane_f, V.ship_f, V.heli_f, V.fire_f, V.train_f, LIVING_IMAGES.car] }, b:{ id:"no", l:"DEĞİL", e:"❌", pool: wild.concat(house, [F.apple, T.teddy, T.ball, T.kite]) } },
    sicak:   { a:{ id:"yes", l:"SICAK", e:"🔥", pool: [HC.fire, HC.soup, HC.sun, HC.iron, NI(1).tea] }, b:{ id:"no", l:"SOĞUK", e:"❄️", pool: [HC.snowman, HC.ice, HC.icecream, HC.penguin, O.snowpile, O.snowman2] } },
    meyve:   { a:{ id:"yes", l:"MEYVE", e:"🍎", pool: [F.apple, F.banana, F.orange, F.grapes, F.strawberry, TS.watermelon, TS.lemon] }, b:{ id:"no", l:"SEBZE", e:"🥕", pool: [F.carrot, F.cucumber, F.pepper, F.broccoli, F.tomato, TS.chili] } },
    giyilir: { a:{ id:"yes", l:"GİYİLİR", e:"👕", pool: [P.shoe, X.sock, X.slipper, OB.jacket, OB.tshirt, OB.jeans, S.boots_yellow, S.beanie_red, S.cap_blue] }, b:{ id:"no", l:"GİYİLMEZ", e:"🚫", pool: house.concat([T.ball, P.hammer, F.apple, P.phone, T.drum]) } } }; }
const QS_TIER = { pre:[["animal","tasit"], ["yenir","giyilir","meyve"], ["ucar","suda","sicak"]], post:[["animal","canli"], ["yenir","tasit","giyilir"], ["ucar","suda","sicak","meyve"]] }   /* düzeyler örtüşmez: somut görsel ayrım → işlev/özellik → bilgi ve çıkarım */;
let qsRuleKey = null, qsRulePrev = null;
/* qsPools: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */   /* eski arayüz (testler ve olası dış kullanım) */
function qsPickRule(){ const pool = (isPre() ? QS_TIER.pre : QS_TIER.post)[Math.min(currentCombo().t, 2)]; qsRuleKey = pool.length > 1 ? pickDifferent(pool, qsRulePrev) : pool[0]; return qsRuleKey; }
function qsRule(){ const R = qsRules()[qsRuleKey || qsPickRule()]; ["a","b"].forEach(sd => { R[sd].pool = (R[sd].pool || []).filter(Boolean); if(R[sd].trick) R[sd].trick = R[sd].trick.filter(Boolean); }); return R; }
/* yönelme eki: büyük ünlü uyumu + ünlüyle bitiyorsa kaynaştırma y */
function trDat(w){ const last = w[w.length - 1].toLocaleLowerCase("tr"), vowels = "aeıioöuü"; const back = [...w.toLocaleLowerCase("tr")].reverse().find(c => vowels.includes(c)); const front = "eiöü".includes(back || "a"); return w + "'" + (vowels.includes(last) ? "y" : "") + (front ? "e" : "a"); }
const trCap = (w) => w.charAt(0) + w.slice(1).toLocaleLowerCase("tr");
/* Hızlı Seç düşündürücü öğeleri: anahtar adıyla resim sözlüklerinden bulunur; normal havuzdan çıkarılır, yalnızca düzeyin oranında gelir */
const QS_TRICKS = { yenir:{ a:["chili","lemon"], b:["ball"] }, tasit:{ a:["fire_f","heli_f"], b:["car","train"] }, giyilir:{ a:["beanie_red","cap_blue","boots_yellow"], b:[] }, ucar:{ a:["kite"], b:["penguin"] }, suda:{ a:["dolphin","starfish"], b:[] }, sicak:{ a:["iron"], b:[] }, meyve:{ a:["lemon","watermelon"], b:["pepper","chili"] } };
function qsImg(key){ const D = [() => FRUIT_VEG_IMAGES, () => TASTE_IMAGES, () => TOY_IMAGES, () => VEHICLE_IMAGES, () => HOTCOLD_IMAGES, () => SEA_IMAGES, () => OS_IMAGES, () => OBJECT_IMAGES, () => PAL_EXTRA_IMAGES, () => HOUSE_IMAGES, () => WILD_IMAGES, () => SRH_IMAGES, () => PAIR_IMAGES, () => SCENE_OBJ_IMAGES, () => NI(1), () => NI(2), () => NI(3), () => NI(4), () => NI(5)]; for(const f of D){ try{ const o = f(); if(o && o[key]) return o[key]; }catch(e){} } return null; }
function qsSide(rk, sd){ const R = qsRules()[rk], side = R[sd], T = QS_TRICKS[rk]; const base = (side.pool || []).filter(Boolean); if(!T) return { pool: base, trick: (side.trick || []).filter(Boolean) }; const tr = (T[sd] || []).map(qsImg).filter(Boolean); const set = new Set(tr); const pool = base.filter(x => !set.has(x)); return { pool: pool.length >= 4 ? pool : base, trick: tr.concat((side.trick || []).filter(Boolean)) }; }
/* Hızlı Seç düzey ayarları: düşündürücü öğe oranı · düğme yeri (0 sabit, 1 her sayfada, 2 her resimde) · Zor'da tur ortasında kural değişimi */
function qsTierCfg(){ const t = Math.min(currentCombo().t, 2); return { t, trickP: (isPre() ? [0, 0.15, 0.3] : [0, 0.2, 0.4])[t], swap: t, sw: t === 2 }; }
CHOICE["quick-sort"] = {
setup: () => { qsRule(); const cfg = qsTierCfg(), pool = (isPre() ? QS_TIER.pre : QS_TIER.post)[cfg.t]; const others = pool.filter(k => k !== qsRuleKey); const rule2 = cfg.sw && others.length ? randomItem(others) : null; return { rule: qsRuleKey, rule2, flip: cfg.swap === 1 ? Math.random() < 0.5 : false, cfg }; },
trials_make: (n, c) => { const cfg = c.cfg || qsTierCfg(), half = c.rule2 ? Math.floor(n / 2) : n; const cyc = {}; const next = (rk, sd) => { const key = rk + sd; if(!cyc[key]) cyc[key] = mkCycle(qsSide(rk, sd).pool); return cyc[key](); };
  const flips = cfg.swap === 2 ? balancedSeq(n, [false, true], 3) : []; const sides = balancedSeq(n, ["a", "b"], 3); const a = [];
  for(let k = 0; k < n; k++){ const rk = k < half ? c.rule : c.rule2, R = qsRules()[rk], sd = sides[k], side = R[sd]; const tricks = qsSide(rk, sd).trick; const trick = tricks.length && Math.random() < cfg.trickP;
    let src = trick ? randomItem(tricks) : next(rk, sd), g = 0; while(a.length && a[a.length - 1].src === src && g++ < 5) src = next(rk, sd);
    a.push({ src, g: side.id, rk, flip: cfg.swap === 2 ? flips[k] : false, sw: !!(c.rule2 && k === half), trick: !!trick }); }
  return a; },
stim: (t) => { if(!t || !t.sw) return imgFill(t.src); const R = qsRules()[t.rk]; return `<div style="position:relative;width:100%;height:100%">${imgFill(t.src)}<div style="position:absolute;left:4%;right:4%;top:4%;background:#FFF4E5;border:3px solid #F59E0B;border-radius:14px;padding:6px 8px;text-align:center;font-weight:900;color:#9A3412;font-size:17px;line-height:1.2">${icI("refresh", 17, "#9A3412")} Kural değişti!<br>${R.a.l} – ${R.b.l}</div></div>`; },
buttons: (c, t) => { const R = qsRules()[(t && t.rk) || c.rule]; const sides = [R.a, R.b]; const f = c.cfg && c.cfg.swap === 2 ? !!(t && t.flip) : !!c.flip; if(f) sides.reverse(); return sides.map(sd => ({ id: sd.id, html: `<span style="font-size:30px">${sd.e}</span><b style="margin-left:6px">${sd.l}</b>` })); },
correct: (t) => t.g, cols: 2 };
let fgStop = "angry";
CHOICE["face-go"] = {
setup: () => { fgStop = pickDifferent(FACE_KEYS, fgStop); return { stop: fgStop }; },
trials_make: (n, c) => { const go = FACE_KEYS.filter(f => f !== c.stop); const a = []; const sN = Math.round(n * 0.28);
let S = sN; while(n - S > 3 * (S + 1)) S++;   /* dur yüzleri aralıklara kesin yerleşir: art arda gelmez, aralarda 1–3 "dokun" */
  const gaps = Array(S + 1).fill(0); for(let q = 0; q < S; q++) gaps[q] = 1; let rem = n - S - S; while(rem > 0){ const cand = gaps.map((x, q) => q).filter(q => gaps[q] < 3); if(!cand.length) break; gaps[randomItem(cand)]++; rem--; }
  const flags = []; gaps.forEach((x, q) => { for(let z = 0; z < x; z++) flags.push(false); if(q < S) flags.push(true); });
flags.forEach(f => a.push({ face: f ? c.stop : randomItem(go), stop: f })); return a; },
stim: (t) => imgFill(FACE_IMAGES[t.face]),
buttons: () => [{ id:"go", html:'<span style="font-size:30px">👆</span><b style="margin-left:8px;font-size:20px">DOKUN</b>' }],
correct: (t) => t.stop ? null : "go",
window: () => isPre() ? 1600 : [1300, 1100, 950][currentCombo().t], gap: 300, cols: 1
};
CHOICE["switch-touch"] = {
trials_make: (n) => { const a = []; let rule = Math.random() < 0.5 ? "same" : "flip"; const want = balancedSeq(n, ["front","back"], 2);   /* doğru tepki dengeli, en çok 2 kez art arda */
  for(let i = 0; i < n; i++){ if(i && Math.random() < 0.4) rule = rule === "same" ? "flip" : "same"; const v = randomItem(["bus","plane","ship","heli","fire","train"]); const back = rule === "same" ? want[i] === "back" : want[i] === "front"; a.push({ v, back, rule }); } return a; },
stim: (t, sz) => `<div style="width:100%;height:100%;border-radius:20px;box-shadow:inset 0 0 0 ${Math.round(sz * 0.05)}px ${t.rule === "same" ? "#1FA463" : "#FF9500"};display:flex;align-items:center;justify-content:center">${imgFill(VEHICLE_IMAGES[t.v + (t.back ? "_b" : "_f")])}</div>`,
buttons: () => [{ id:"front", html: imgFill(VEHICLE_IMAGES.bus_f) + '<b style="margin-left:4px">ÖN</b>' }, { id:"back", html: imgFill(VEHICLE_IMAGES.bus_b) + '<b style="margin-left:4px">ARKA</b>' }],
correct: (t) => { const seen = t.back ? "back" : "front"; return t.rule === "same" ? seen : (seen === "front" ? "back" : "front"); },
key: () => `<div class="ch-key" style="font-weight:800;font-size:13px;color:var(--ink);gap:12px;padding:6px 12px"><span><span class="target-swatch" style="background:#1FA463"></span>aynı yöndekine dokun</span><span><span class="target-swatch" style="background:#FF9500"></span>ters yöndekine dokun</span></div>`,
cols: 2
};
/* ===== Yürütücü İşlev · Paket 1 · dokunmalı çalışmalar ===== */
CHOICE["num-stroop"] = {
trials_make: (n) => { const t = Math.min(currentCombo().t, 2), nI = Math.round(n * [0.5, 0.6, 0.7][t]); const conds = balancedSeq(n, ["I","C"], 2, [nI, n - nI]), sides = balancedSeq(n, ["L","R"], 2);
  const CS = t === 0 ? [[2, 4], [2, 5], [3, 5]] : [[2, 3], [2, 4], [3, 4], [3, 5], [4, 5], [2, 5]];
  return conds.map((cd, k) => { let a, b; do{ a = 1 + Math.floor(Math.random() * 9); b = 1 + Math.floor(Math.random() * 9); } while(a === b || (t === 0 && Math.abs(a - b) < 3)); if(a < b){ const x = a; a = b; b = x; }   /* a: büyük rakam */
    const [lo, hi] = randomItem(CS), cong = cd === "C"; const big = { d: a, c: cong ? hi : lo }, small = { d: b, c: cong ? lo : hi };   /* uyumlu: büyük rakam daha çok */
    const left = sides[k] === "L"; return { L: left ? big : small, R: left ? small : big, valSide: left ? "L" : "R", moreSide: (big.c > small.c) === left ? "L" : "R", cong }; }); },
stim: (t, sz) => { const grp = (g, id) => `<div ${chSideAttr(id)}><div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;align-content:center;gap:2px 8px;font-weight:900;font-size:${Math.round(sz * 0.2)}px;line-height:1;color:#1F2A33;pointer-events:none">${Array.from({length:g.c}, () => `<span>${g.d}</span>`).join("")}</div></div>`;
  const cs = stIx() === 1 ? t.valSide : t.moreSide, cg = t[cs]; const note = chSideNote(stIx() === 1 ? `Doğrusu: ${cg.d} — daha büyük rakam` : `Doğrusu: ${cg.c} tane olan — daha çok`);
  return `<div style="display:flex;width:100%;height:100%;align-items:center;position:relative">${grp(t.L, "L")}<div style="width:3px;height:70%;background:#C9D3DE;border-radius:2px"></div>${grp(t.R, "R")}${note}</div>`; },
buttons: () => [], tapStim: true,
correct: (t) => stIx() === 1 ? t.valSide : t.moreSide, cols: 2, wideStim: true
};
CHOICE["size-stroop"] = {
setup: () => ({ big: shuffleArray(SZ_BIG()), small: shuffleArray(SZ_SMALL()) }),
trials_make: (n, c) => { const t = Math.min(currentCombo().t, 2), nI = Math.round(n * [0.5, 0.6, 0.7][t]); const conds = balancedSeq(n, ["I","C"], 2, [nI, n - nI]), sides = balancedSeq(n, ["L","R"], 2); let pb = null, ps = null;
  return conds.map((cd, k) => { const b = pickDifferent(c.big, pb), s = pickDifferent(c.small, ps); pb = b; ps = s; return { b, s, cong: cd === "C", bigSide: sides[k] }; }); },
stim: (t) => { const one = (x, large, id) => `<div ${chSideAttr(id)}><img src="${x[1]}" alt="" style="width:${large ? 92 : 38}%;height:${large ? 92 : 38}%;object-fit:contain;pointer-events:none"></div>`;
  const oS = t.bigSide === "L" ? "R" : "L", L = t.bigSide === "L" ? one(t.b, t.cong, "L") : one(t.s, !t.cong, "L"), R = t.bigSide === "L" ? one(t.s, !t.cong, "R") : one(t.b, t.cong, "R");   /* uyumsuz: büyük hayvan küçük çizilir */
  const note = chSideNote(stIx() === 1 ? `Doğrusu: ${t.s[0]} — gerçekte daha küçük` : `Doğrusu: ${t.b[0]} — gerçekte daha büyük`);
  return `<div style="display:flex;width:100%;height:100%;align-items:center;position:relative">${L}<div style="width:3px;height:70%;background:#C9D3DE;border-radius:2px"></div>${R}${note}</div>`; },
buttons: () => [], tapStim: true,
correct: (t) => stIx() === 1 ? DIR_OPP[t.bigSide.toLowerCase()].toUpperCase() : t.bigSide, cols: 2, wideStim: true
};
CHOICE["spatial-stroop"] = {
setup: () => ({ D: spDirs() }),
trials_make: (n, c) => { const t = Math.min(currentCombo().t, 2), nI = Math.round(n * [0.5, 0.6, 0.7][t]); const conds = balancedSeq(n, ["I","C"], 2, [nI, n - nI]), words = balancedSeq(n, c.D, 2);
  return conds.map((cd, k) => { const w = words[k], pos = cd === "C" ? w : pickDifferent(c.D, w); return { w, pos, cong: cd === "C" }; }); },
stim: (t, sz) => `<div style="position:relative;width:100%;height:100%"><div style="position:absolute;left:50%;top:50%;width:8px;height:8px;margin:-4px;border-radius:50%;background:#C9D3DE"></div><b style="position:absolute;${DIR_POS[t.pos]};transform:translate(-50%,-50%);font-size:${Math.round(sz * 0.14)}px;font-weight:900;letter-spacing:.02em;color:#1F2A33;white-space:nowrap">${SP_WORD[t.w]}</b></div>`,
buttons: (c) => dirButtons(c.D),
correct: (t) => stIx() === 1 ? t.pos : t.w, cols: 4, wideStim: true
};
CHOICE["anti-touch"] = {
setup: () => ({ D: atDirs() }),
trials_make: (n, c) => balancedSeq(n, c.D, 2).map(p => ({ pos: p })),
stim: (t, sz) => { const r = Math.round(sz * 0.2); return `<div style="position:relative;width:100%;height:100%"><div style="position:absolute;left:50%;top:50%;width:10px;height:10px;margin:-5px;border-radius:50%;background:#C9D3DE"></div><div style="position:absolute;${DIR_POS[t.pos]};transform:translate(-50%,-50%);width:${r}px;height:${r}px;border-radius:50%;background:#2E6FD8;box-shadow:0 0 0 6px rgba(46,111,216,.25)"></div></div>`; },
buttons: (c) => dirButtons(c.D),
correct: (t) => DIR_OPP[t.pos],
window: () => (isPre() ? [2000, 1700, 1700] : [1600, 1300, 1300])[Math.min(currentCombo().t, 2)], gap: 320, cols: 4, wideStim: true
};
/* ===== Yürütücü İşlev · Paket 2 · dokunmalı çalışmalar ===== */
CHOICE["less-more"] = {
setup: () => ({ treats: shuffleArray(LM_TREATS()), won: 0 }),
trials_make: (n, c) => { const t = Math.min(currentCombo().t, 2), P = (isPre() ? LM_PAIRS.pre : LM_PAIRS.post)[t], sides = balancedSeq(n, ["L","R"], 2); return sides.map((s, i) => { const [lo, hi] = randomItem(P); return { lo, hi, loSide: s, tr: c.treats[i % c.treats.length] }; }); },
stim: (t, sz, c) => { let mk = null; if(chState && chState.phase === "feedback"){ if(!t.counted){ t.counted = true; t.good = chState.picked === t.loSide; t.got = t.good ? t.hi : t.lo; c.won += t.got; } mk = { n: t.got, good: t.good }; }   /* ödül: az olanı gösterince çok olanı alır */
  const L = t.loSide === "L", hiSide = L ? "R" : "L", lo = lmPlate(t.lo, t.tr[1], sz, mk && !mk.good ? mk : null, t.loSide), hi = lmPlate(t.hi, t.tr[1], sz, mk && mk.good ? mk : null, hiSide);
  const note = chSideNote("Az olanı göster, çoğu sana gelir");
  return `<div style="display:flex;width:100%;height:100%;align-items:center;gap:2%;position:relative">${L ? lo : hi}<div style="width:3px;height:70%;background:#C9D3DE;border-radius:2px"></div>${L ? hi : lo}${note}</div>`; },
buttons: () => [], tapStim: true,
correct: (t) => t.loSide, cols: 2, wideStim: true, gap: 420,
key: (c) => `<div class="ch-key" style="font-weight:800;font-size:14px;color:var(--ink);padding:6px 12px">🧺 Kazandığın: <b style="margin-left:4px">${c.won}</b></div>`
};
CHOICE["context-go"] = {
setup: () => { const pool = NB_ANIMALS.filter(k => animalImg(k)); const cue = pickDifferent(pool, axCue), tgt = pickDifferent(pool.filter(k => k !== cue), axTgt); axCue = cue; axTgt = tgt; return { cue, tgt, others: pool.filter(k => k !== cue && k !== tgt), support: Math.min(currentCombo().t, 2) === 0 }; },
trials_make: (n, c) => axSeq(n, c),
stim: (t, sz, c) => `<div style="position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center">${imgFill(animalImg(t.k))}${c.support && t.prev ? `<div style="position:absolute;left:4%;top:4%;width:26%;height:26%;border-radius:12px;background:#F2F5F8;border:2px solid #C9D3DE;display:flex;align-items:center;justify-content:center"><img src="${animalImg(t.prev)}" alt="" style="width:80%;height:80%;object-fit:contain;opacity:.75"></div>` : ""}</div>`,
buttons: () => [{ id:"go", html:'<span style="font-size:30px">👆</span><b style="margin-left:8px;font-size:20px">DOKUN</b>' }],
correct: (t) => t.go ? "go" : null,
window: () => (isPre() ? [2100, 1800, 1600] : [1600, 1400, 1200])[Math.min(currentCombo().t, 2)], gap: 300, cols: 1,
key: (c) => `<div class="ch-key" style="font-weight:800;font-size:13px;color:var(--ink);gap:8px;padding:6px 12px;align-items:center"><img src="${animalImg(c.cue)}" alt="" style="width:34px;height:34px;object-fit:contain"><span>sonra</span><img src="${animalImg(c.tgt)}" alt="" style="width:34px;height:34px;object-fit:contain"><span>gelirse → DOKUN</span></div>`
};
CHOICE["distract"] = {
setup: () => { const t = Math.min(currentCombo().t, 2); return { D: ["l","r","u","d"].slice(0, [2, 3, 4][t]), dist: stIx() === 1, nD: (isPre() ? [2, 3, 4] : [3, 5, 7])[t], pool: shuffleArray(picPool()) }; },
trials_make: (n, c) => balancedSeq(n, c.D, 2).map((d, i) => ({ dir: d, snd: c.dist && i % 3 === 1, ds: c.dist ? Array.from({length: c.nD}, (_, k) => ({ x: 4 + Math.random() * 78, y: 4 + Math.random() * 78, dx: (Math.random() - 0.5) * 90, dy: (Math.random() - 0.5) * 70, dur: 0.9 + Math.random() * 0.9, src: c.pool[(i * c.nD + k) % c.pool.length].src })) : [] })),
stim: (t, sz) => { if(t.snd && chState && chState.phase === "ask" && !t.played){ t.played = true; sfx("pop"); }
  const arrow = `<div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${Math.round(sz * 0.42)}px;height:${Math.round(sz * 0.42)}px">${stopArrowSVG(t.dir, "#1F2A33", "100%")}</div>`;
  const ds = t.ds.map(d => `<img src="${d.src}" alt="" class="ef-dist" style="left:${d.x}%;top:${d.y}%;width:18%;height:18%;object-fit:contain;--dx:${d.dx}px;--dy:${d.dy}px;animation:efFly ${d.dur}s ease-in-out infinite">`).join("");
  return `<div style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:16px">${ds}${arrow}</div>`; },
buttons: (c) => dirButtons(c.D),
correct: (t) => t.dir,
window: () => (isPre() ? [2200, 1900, 1700] : [1700, 1400, 1200])[Math.min(currentCombo().t, 2)], gap: 300, cols: 4, wideStim: true
};
CHOICE["grass-snow"] = {
setup: () => ({ order: shuffleArray(["green","white"]) }),
trials_make: (n) => makeDayNightGrid(n).map(x => ({ k: x.k === "sun" ? "grass" : "snow" })),
stim: (t) => t.k === "grass"
  ? `<svg viewBox="0 0 100 100" style="width:82%;height:82%;display:block"><rect x="4" y="60" width="92" height="36" rx="10" fill="${ACC.yesil}"/><path d="M14 62 C16 48 10 40 18 28 M26 62 C24 46 32 42 30 26 M40 62 C44 50 36 40 46 30 M54 62 C52 46 60 44 58 28 M68 62 C72 50 64 40 74 30 M84 62 C82 46 90 44 88 30" stroke="${ACC.yesil}" stroke-width="6" stroke-linecap="round" fill="none"/></svg>`
  : `<svg viewBox="0 0 100 100" style="width:82%;height:82%;display:block"><rect x="4" y="4" width="92" height="92" rx="18" fill="#DCEBFA"/><g stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"><path d="M50 16V84M20 33l60 34M20 67l60-34"/><path d="M50 16l-8 8M50 16l8 8M50 84l-8-8M50 84l8-8M20 33l11-3M20 33l3 11M80 67l-11 3M80 67l-3-11M20 67l11 3M20 67l3-11M80 33l-11-3M80 33l-3 11"/></g></svg>`,
buttons: (c) => c.order.map(col => ({ id: col, html: `<div style="width:54px;height:54px;border-radius:12px;background:${col === "green" ? ACC.yesil : "#FFFFFF"};border:3px solid #9AA8B5"></div>` })),
correct: (t) => t.k === "grass" ? "white" : "green", cols: 2
};
/* ===== Yürütücü İşlev · Paket 3 · dokunmalı çalışmalar ===== */
CHOICE["navon"] = {
setup: () => ({ col: randomItem([ACC.mavi, ACC.yesil, ACC.mor, ACC.kirmizi]) }),
trials_make: (n) => { const t = Math.min(currentCombo().t, 2); let cues; if(t === 0){ const first = Math.random() < 0.5 ? "big" : "small"; cues = Array.from({length:n}, (_, i) => i < n / 2 ? first : (first === "big" ? "small" : "big")); } else if(t === 1){ cues = []; let c = "big"; for(let i = 0; i < n; i++){ if(i && Math.random() < 0.3) c = c === "big" ? "small" : "big"; cues.push(c); } } else cues = balancedSeq(n, ["big", "small"], 2);
  const bigs = balancedSeq(n, NV_SHAPES, 2); return cues.map((cue, i) => { const big = bigs[i], small = pickDifferent(NV_SHAPES, big); return { cue, big, small, sw: i > 0 && cues[i - 1] !== cue }; }); },
stim: (t, sz, c) => { const lab = t.cue === "big" ? "BÜYÜK" : "KÜÇÜK"; const ic = t.cue === "big" ? `<svg viewBox="0 0 100 100" style="width:22px;height:22px"><rect x="8" y="8" width="84" height="84" rx="10" fill="none" stroke="#1F2A33" stroke-width="10"/></svg>` : `<svg viewBox="0 0 100 100" style="width:22px;height:22px"><rect x="32" y="32" width="36" height="36" rx="6" fill="none" stroke="#1F2A33" stroke-width="10"/></svg>`;
  return `<div style="position:relative;width:100%;height:100%"><div style="position:absolute;left:50%;top:3%;transform:translateX(-50%);display:flex;align-items:center;gap:6px;background:${t.sw ? "#FFF4E5" : "#F2F5F8"};border:2px solid ${t.sw ? "#F59E0B" : "#C9D3DE"};border-radius:999px;padding:2px 12px;font-weight:900;font-size:${Math.round(sz * 0.08)}px;color:#1F2A33;white-space:nowrap">${ic}${lab}${t.sw ? " · değişti!" : ""}</div><div style="position:absolute;left:50%;top:56%;transform:translate(-50%,-50%);width:${Math.round(sz * 0.72)}px;height:${Math.round(sz * 0.72)}px">${navonSVG(t.big, t.small, c.col)}</div></div>`; },
buttons: (c) => NV_SHAPES.map(s => ({ id: s, html: `<svg viewBox="0 0 100 100" style="width:40px;height:40px">${sortShapeSVG(s, "#1F2A33")}</svg>` })),
correct: (t) => t.cue === "big" ? t.big : t.small,
window: () => (isPre() ? [3000, 2600, 2400] : [2400, 2000, 1800])[Math.min(currentCombo().t, 2)], gap: 300, cols: 3,
key: () => `<div class="ch-key" style="font-weight:800;font-size:13px;color:var(--ink);gap:12px;padding:6px 12px"><span>BÜYÜK → büyük şekil</span><span>KÜÇÜK → küçük şekiller</span></div>`
};
CHOICE["creature-count"] = {
trials_make: () => ccTrials(),
stim: (t, sz) => { const w = Math.round(sz * 0.17); return `<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px;width:100%;height:100%;padding:4px;box-sizing:border-box;overflow:hidden">${t.items.map(it => it.arrow ? `<div style="width:${w}px;height:${w}px;border-radius:8px;background:${it.arrow > 0 ? "#E3F6EC" : "#FDECEC"};display:flex;align-items:center;justify-content:center;font-size:${Math.round(w * 0.7)}px;font-weight:900;color:${it.arrow > 0 ? ACC.yesil : ACC.kirmizi}">${it.arrow > 0 ? "▲" : "▼"}</div>` : `<img src="${it.img}" alt="" style="width:${w}px;height:${w}px;object-fit:contain">`).join("")}</div>`; },
buttons: (c, t) => (t ? t.opts : [0, 1, 2, 3]).map(v => ({ id: String(v), html: `<b style="font-size:26px">${v}</b>` })),
correct: (t) => String(t.ans), cols: 4, wideStim: true, gap: 350, trials: { post:[6, 8, 10], pre:[4, 5, 6] },
key: () => `<div class="ch-key" style="font-weight:800;font-size:13px;color:var(--ink);gap:12px;padding:6px 12px"><span style="color:${ACC.yesil}">▲ ileri say</span><span style="color:${ACC.kirmizi}">▼ geri say</span></div>`
};
CHOICE["rev-sort"] = {
setup: () => ({ order: shuffleArray(["big", "small"]), col: randomItem([ACC.kirmizi, ACC.mavi, ACC.yesil, ACC.sari, ACC.mor]) }),
trials_make: (n, c) => balancedSeq(n, ["big", "small"], 2).map((z, i) => ({ z, s: randomItem(["square", "circle", "triangle"]), col: i % 2 ? c.col : pickDifferent([ACC.kirmizi, ACC.mavi, ACC.yesil, ACC.sari, ACC.mor], c.col) })),
stim: (t, sz) => { const px = Math.round(sz * (t.z === "big" ? 0.78 : 0.34)); return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 100 100" style="width:${px}px;height:${px}px">${sortShapeSVG(t.s, t.col)}</svg></div>`; },
buttons: (c) => c.order.map(z => ({ id: z, html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px"><img src="${HOUSE_IMAGES.bucket}" alt="" style="width:${z === "big" ? 52 : 30}px !important;max-height:${z === "big" ? 52 : 30}px"><b style="font-size:13px">${z === "big" ? "BÜYÜK KOVA" : "KÜÇÜK KOVA"}</b></div>` })),
correct: (t) => stIx() === 1 ? (t.z === "big" ? "small" : "big") : t.z,
window: () => (isPre() ? [2600, 2200, 2000] : [2000, 1700, 1500])[Math.min(currentCombo().t, 2)], gap: 300, cols: 2
};
/* ===== Yürütücü İşlev · Paket 5 · dokunmalı ===== */
CHOICE["look-first"] = {
trials_make: () => lfTrials(),
stim: (t, sz) => `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;gap:2px"><div class="aud-key" style="font-size:12px">Bunun <b>birebir aynısı</b> hangisi?</div>${lfHouse(t.base, Math.round(sz * 0.66))}</div>`, buttons: (c, t) => (t ? t.opts : []).map((o, i) => ({ id: String(i), html: lfHouse(o, (t.opts.length > 4 ? 84 : 104)) })), correct: (t) => String(t.ans), cols: (n) => n > 4 ? 3 : 2,   /* KURAL: dört seçenek 2×2, altı seçenek 3×2 dizilir; hepsi tek ekranda */ gap: 400, trials: { post:[6, 8, 10], pre:[4, 5, 6] },
key: () => { const st = chState; if(!st || st.phase !== "done" || !st.rts.length) return ""; const mean = Math.round(st.rts.reduce((a, b) => a + b, 0) / st.rts.length / 100) / 10; return `<div class="ch-key" style="font-weight:800;font-size:13px;color:var(--ink);gap:10px;padding:6px 12px;flex-wrap:wrap;justify-content:center"><span>Ortalama ilk tepki: <b>${mean} sn</b></span><span>Hata: <b>${st.wrong}</b></span><span style="color:#5B6B78">${st.wrong >= 2 && mean < 2.5 ? "hızlı ve hatalı → bakmadan dokunuyor olabilir" : st.wrong === 0 ? "dikkatli karşılaştırdı" : "düşünerek ilerliyor"}</span></div>`; }
};

const PLAN_THINK_MS = () => isPre() ? 4000 : 5000;
let plnLockTimer = null;
function plnStartLock(){
if(!planThinkOn() || !planState) return;
planState.lockUntil = Date.now() + PLAN_THINK_MS() * (window.__wmSpeed || 1);
clearInterval(plnLockTimer);
plnLockTimer = setInterval(() => { if(!planState || Date.now() >= planState.lockUntil){ clearInterval(plnLockTimer); plnLockTimer = null; } try{ renderPlanBoard(); }catch(e){} }, 250);
renderPlanBoard();
}
const plnLocked = () => planThinkOn() && planState && planState.lockUntil && Date.now() < planState.lockUntil;


let rtState = null, rtTimers = [];
function rtClear(){ rtTimers.forEach(t => clearTimeout(t)); rtTimers = []; }
function rtLater(fn, ms){ const st = rtState; rtTimers.push(setTimeout(() => { if(rtState === st && timerRunning) fn(); }, ms * (window.__wmSpeed || 1))); }
const RT_SPECS = {
"rt-shapes":   { k:[3, 4, 5], preK:[2, 3, 4], rounds:3, preRounds:2 },
"rt-position": { cells:[8, 10, 12], preCells:[4, 6, 8], k:[3, 4, 5], preK:[2, 2, 3], rounds:3, preRounds:2 },
"rt-colors":   { k:[3, 4, 5], preK:[2, 3, 4], rounds:3, preRounds:2 }
};
function rtBuild(){
const id = currentExercise().id, sp = RT_SPECS[id], t = currentCombo().t, pre = isPre();
rtClear();
const R = pre ? sp.preRounds : sp.rounds, K = (pre ? sp.preK : sp.k)[t];
rtState = { id, K, R, round:0, wrong:0, phase:"idle", res:[], cells: sp.cells ? (pre ? sp.preCells : sp.cells)[t] : 0 };
return Array.from({length:R}, (_, i) => ({ round:i }));
}
function rtNewRound(){
const st = rtState, pre = isPre();
st.found = {}; st.marks = {}; st.pos = 0; st.roundWrong = 0;
if(st.id === "rt-shapes"){
const pool = []; SHAPES.forEach(sh => COLORS.forEach(c => pool.push({ shape: sh, color: c })));
const tg = shuffleArray(pool).slice(0, st.K);
const key = (x) => x.shape + x.color;
const near = shuffleArray(pool.filter(x => !tg.some(y => key(y) === key(x)) && tg.some(y => y.shape === x.shape || y.color === x.color)));
const far = shuffleArray(pool.filter(x => !tg.some(y => key(y) === key(x)) && !near.includes(x)));
const dis = near.concat(far).slice(0, st.K + (pre ? 1 : 2));
st.targets = tg; st.options = shuffleArray(tg.concat(dis));
} else if(st.id === "rt-position"){
st.lit = shuffleArray(Array.from({length:st.cells}, (_, i) => i)).slice(0, st.K);
st.colors = st.lit.reduce((a, i) => { a[i] = randomItem(COLORS); return a; }, {});
} else {
const pal = pre ? COLORS.slice(0, 4) : COLORS.concat(["#7B4FD6"]);
st.pal = shuffleArray(pal);
st.seq = []; while(st.seq.length < st.K){ const c = randomItem(pal); if(st.seq[st.seq.length-1] !== c) st.seq.push(c); }
}
st.phase = "study"; renderRtBoard();
const ms = (pre ? 1700 : 1200) * st.K + 800;
rtLater(() => { st.phase = "answer"; renderRtBoard(); if(gameMode) speakText(st.id === "rt-colors" ? "Şimdi renkleri aynı sırayla seç." : "Şimdi gördüklerini bul."); }, ms);
}
function rtStart(){ if(rtState && rtState.phase === "idle") rtNewRound(); }
function rtEndRound(){
const st = rtState;
st.res[st.round] = st.roundWrong === 0; st.round++; st.phase = "between"; renderRtBoard();
rtLater(() => {
if(st.round >= st.R){ st.phase = "done"; renderRtBoard(); stopTimer(); showLevelFlash(st.wrong ? `Bitti! ${st.wrong} hata.` : "Bitti! Hiç hata yok 🎉", st.wrong ? "down" : "levelup"); return; }
rtNewRound();
}, 800);
}
function rtErr(){ rtState.wrong++; rtState.roundWrong++; setErrorCount(currentErrorCount + 1); try{ vibrate(60); }catch(e){} gameSfx("wrong"); }
function rtTap(i){
const st = rtState; if(!st || st.phase !== "answer") return;
if(st.id === "rt-shapes"){
if(st.found[i]) return;
const o = st.options[i], hit = st.targets.some(t => t.shape === o.shape && t.color === o.color);
st.found[i] = true; st.marks[i] = hit ? "ok" : "bad";
if(hit) gameSfx("correct"); else rtErr();
renderRtBoard();
const got = Object.keys(st.marks).filter(k => st.marks[k] === "ok").length;
if(got >= st.K) rtEndRound();
} else if(st.id === "rt-position"){
if(st.found[i]) return;
const hit = st.lit.includes(i);
st.found[i] = true; st.marks[i] = hit ? "ok" : "bad";
if(hit) gameSfx("correct"); else rtErr();
renderRtBoard();
if(st.lit.every(x => st.found[x])) rtEndRound();
} else {
const c = st.pal[i];
if(c === st.seq[st.pos]){ st.pos++; st.marks = {}; st.marks[i] = "ok"; gameSfx("correct"); renderRtBoard(); if(st.pos >= st.seq.length) rtEndRound(); }
else { st.marks = {}; st.marks[i] = "bad"; rtErr(); st.reveal = true; renderRtBoard(); rtLater(() => { st.reveal = false; rtEndRound(); }, 900); st.phase = "between"; }
}
}
function renderRtBoard(){ try{
const board = document.getElementById("board");
board.style.display = "block"; board.style.minHeight = ""; board.style.padding = landscapeMQ.matches ? "6px 8px" : "12px";
board.style.gridTemplateColumns = ""; board.style.gridTemplateRows = ""; board.classList.remove("wide-grid");
if(!rtState) return;
const st = rtState, isLs = landscapeMQ.matches;
const W = (board.clientWidth || 360) - 24, H = isLs ? (board.clientHeight || 280) - 70 : Math.min(520 * tabletScale(), window.innerHeight - 320);
const dots = `<div class="wm-dots">${Array.from({length:st.R}, (_, i) => `<i class="${st.res[i] === true ? "on" : st.res[i] === false ? "off" : ""}"></i>`).join("")}</div>`;
const info = st.phase === "idle" ? "▶ Başlat'a bas" : st.phase === "study" ? "<b>İyi bak, aklında tut…</b>" : st.phase === "answer" ? (st.id === "rt-colors" ? `<b>Aynı sırayla</b> seç · ${st.pos}/${st.seq.length}` : "<b>Gördüklerini bul</b>") : st.phase === "done" ? "Bitti!" : "";
let body = "";
if(st.id === "rt-shapes"){
const list = st.phase === "study" ? st.targets : (st.phase === "idle" ? [] : st.options);
const d = wmGridDims(Math.max(1, list.length), W, H, 100);
body = `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + list.map((o, i) => `<div class="wm-pic${st.phase === "study" ? "" : ""}${st.marks && st.marks[i] && st.phase !== "study" ? " " + st.marks[i] : ""}" data-rt="${i}" style="width:${d.cell}px;height:${d.cell}px;"><div style="width:72%;height:72%">${shapeSVG(o.shape, o.color)}</div></div>`).join("") + `</div>`;
} else if(st.id === "rt-position"){
const n = st.cells, d = wmGridDims(n, W, H, 96);
body = `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + Array.from({length:n}, (_, i) => {
const show = st.phase === "study" && st.lit.includes(i);
const mark = st.phase !== "study" && st.marks && st.marks[i];
const fill = show ? st.colors[i] : (mark === "ok" ? st.colors[i] : null);
return `<div data-rt="${i}" style="width:${d.cell}px;height:${d.cell}px;cursor:pointer;${mark === "bad" ? "animation:trlShake .3s;" : ""}">${fill ? litCircleHTML(true, fill) : `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="${mark === "bad" ? "#E5484D" : "#D9E2E2"}" stroke-width="5"/></svg>`}</div>`; }).join("") + `</div>`;
} else {
const sz = Math.min(100 * tabletScale(), Math.floor((W - 8 * 6) / Math.max(st.K, 5)), isLs ? Math.floor((H + 50) / 3.4) : 100 * tabletScale());
const slots = st.phase === "study" || st.reveal
? st.seq.map(c => `<span class="rt-sw" style="width:${sz}px;height:${sz}px;background:${c};cursor:default"></span>`).join("")
: st.phase === "idle" ? "" : (st.seq || []).map((c, i) => i < st.pos ? `<span class="rt-sw" style="width:${sz}px;height:${sz}px;background:${c};cursor:default"></span>` : `<span class="rt-slot" style="width:${sz}px;height:${sz}px"></span>`).join("");
const pc = isLs ? (st.pal || []).length || 5 : 3, psz = isLs ? Math.min(70, Math.floor((W - 12 * pc) / pc), Math.floor(H * 0.45)) : Math.min(76, sz + 12);
const pal = st.phase === "answer" || st.phase === "between" ? `<div class="rt-pal" style="grid-template-columns:repeat(${pc}, ${psz}px);">` + st.pal.map((c, i) => `<span class="rt-sw${st.marks && st.marks[i] ? " " + st.marks[i] : ""}" data-rt="${i}" style="width:${psz}px;height:${psz}px;background:${c}"></span>`).join("") + `</div>` : "";
body = `<div class="rt-slots">${slots}</div>${pal}`;
}
board.innerHTML = `<div class="wm-wrap"><div class="wm-info">${info}</div>${dots}${body}</div>`;
}finally{ try{ zaTapRestore(); }catch(e){} } }
function handleRtTap(ev){
if(!currentExercise().isRt || !rtState) return;
const b = ev.target.closest("[data-rt]"); if(!b) return;
if(!timerRunning){ showLevelFlash("Önce ▶ Başlat'a basın.", "down"); return; }
rtTap(Number(b.dataset.rt));
}
document.getElementById("board").addEventListener("click", (ev) => { if(Date.now() - (window._fastTapTs || 0) < 700) return; handleRtTap(ev); });
window.addEventListener("resize", () => { clearTimeout(window._rtResizeT); window._rtResizeT = setTimeout(() => { try{ if(currentExercise().isRt) renderRtBoard(); }catch(e){} }, 150); });


const SPAN_BANK = [
{ k:"dog",      n:"köpek",       img:() => TA_ANIMALS.dog(),      t:"Köpekler havlar.",               f:"Köpekler uçar.",                bt:"Bu hayvan havlar.",          bf:"Bu hayvan uçar." },
{ k:"cat",      n:"kedi",        img:() => TA_ANIMALS.cat(),      t:"Kediler miyavlar.",              f:"Kediler havlar.",               bt:"Bu hayvan miyavlar.",        bf:"Bu hayvan havlar." },
{ k:"cow",      n:"inek",        img:() => TA_ANIMALS.cow(),      t:"İnekten süt elde edilir.",       f:"İnekler ağaçta yaşar.",         bt:"Bu hayvandan süt elde edilir.", bf:"Bu hayvan ağaçta yaşar." },
{ k:"fish",     n:"balık",       img:() => SEA_IMAGES.fish,       t:"Balıklar suda yaşar.",           f:"Balıklar ağaca tırmanır.",      bt:"Bu hayvan suda yaşar.",      bf:"Bu hayvan ağaca tırmanır." },
{ k:"elephant", n:"fil",         img:() => TA_ANIMALS.elephant(), t:"Fillerin hortumu vardır.",       f:"Filler çok küçüktür.",          bt:"Bu hayvanın hortumu vardır.", bf:"Bu hayvan çok küçüktür." },
{ k:"parrot",   n:"papağan",     img:() => TA_ANIMALS.parrot(),   t:"Papağanlar uçabilir.",           f:"Papağanların dört bacağı vardır.", bt:"Bu hayvan uçabilir.",      bf:"Bu hayvanın dört bacağı vardır." },
{ k:"penguin",  n:"penguen",     img:() => TA_ANIMALS.penguin(),  t:"Penguenler soğukta yaşar.",      f:"Penguenler çölde yaşar.",       bt:"Bu hayvan soğukta yaşar.",   bf:"Bu hayvan çölde yaşar." },
{ k:"lion",     n:"aslan",       img:() => WILD_IMAGES.lion,      t:"Aslanlar et yer.",               f:"Aslanlar ot yer.", bt:"Bu hayvan et yer.", bf:"Bu hayvan ot yer." },
{ k:"giraffe",  n:"zürafa",      img:() => WILD_IMAGES.giraffe,   t:"Zürafaların boynu uzundur.",     f:"Zürafaların boynu kısadır.",    bt:"Bu hayvanın boynu uzundur.", bf:"Bu hayvanın boynu kısadır." },
{ k:"zebra",    n:"zebra",       img:() => WILD_IMAGES.zebra,     t:"Zebraların çizgileri vardır.",   f:"Zebralar mor renklidir.",       bt:"Bu hayvanın çizgileri vardır.", bf:"Bu hayvan mor renklidir." },
{ k:"monkey",   n:"maymun",      img:() => WILD_IMAGES.monkey,    t:"Maymunlar ağaca tırmanır.",      f:"Maymunlar denizde yüzer.",      bt:"Bu hayvan ağaca tırmanır.",  bf:"Bu hayvan denizde yüzer." },
{ k:"bear",     n:"ayı",         img:() => WILD_IMAGES.bear,      t:"Ayılar kışın uyur.",             f:"Ayılar yumurtadan çıkar.",      bt:"Bu hayvan kışın uyur.",      bf:"Bu hayvan yumurtadan çıkar." },
{ k:"squirrel", n:"sincap",      img:() => WILD_IMAGES.squirrel,  t:"Sincaplar fındık yer.",          f:"Sincaplar filden büyüktür.",    bt:"Bu hayvan fındık yer.",      bf:"Bu hayvan filden büyüktür." },
{ k:"hedgehog", n:"kirpi",       img:() => WILD_IMAGES.hedgehog,  t:"Kirpilerin dikenleri vardır.",   f:"Kirpiler uçar.",                bt:"Bu hayvanın dikenleri vardır.", bf:"Bu hayvan uçar." },
{ k:"dolphin",  n:"yunus",       img:() => SEA_IMAGES.dolphin,    t:"Yunuslar denizde yüzer.",        f:"Yunuslar ormanda yaşar.",       bt:"Bu hayvan denizde yüzer.",   bf:"Bu hayvan ormanda yaşar." },
{ k:"turtle",   n:"kaplumbağa",  img:() => SEA_IMAGES.turtle,     t:"Kaplumbağaların kabuğu vardır.", f:"Kaplumbağalar çok hızlı koşar.", bt:"Bu hayvanın kabuğu vardır.", bf:"Bu hayvan çok hızlı koşar." },
{ k:"crab",     n:"yengeç",      img:() => SEA_IMAGES.crab,       t:"Yengeçler yan yan yürür.",       f:"Yengeçler ağaçta yaşar.",       bt:"Bu hayvan yan yan yürür.",   bf:"Bu hayvan ağaçta yaşar." },
{ k:"ball",     n:"top",         img:() => TOY_IMAGES.ball,       t:"Top yuvarlaktır.",               f:"Top kare şeklindedir.",         bt:"Bu oyuncak yuvarlaktır.",    bf:"Bu oyuncak kare şeklindedir." },
{ k:"teddy",    n:"ayıcık",      img:() => TOY_IMAGES.teddy,      t:"Ayıcık yumuşaktır.",             f:"Ayıcık yenir.",                 bt:"Bu oyuncak yumuşaktır.",     bf:"Bu oyuncak yenir." },
{ k:"kite",     n:"uçurtma",     img:() => TOY_IMAGES.kite,       t:"Uçurtma rüzgârda uçar.",         f:"Uçurtma suda yüzer.",           bt:"Bu oyuncak rüzgârda uçar.",  bf:"Bu oyuncak suda yüzer." },
{ k:"drum",     n:"davul",       img:() => TOY_IMAGES.drum,       t:"Davul çalınır.",                 f:"Davul giyilir.",                bt:"Bu çalınır.",                bf:"Bu giyilir." },
{ k:"train",    n:"tren",        img:() => TOY_IMAGES.train,      t:"Tren raylarda gider.",           f:"Tren gökyüzünde uçar.",         bt:"Bu raylarda gider.",         bf:"Bu gökyüzünde uçar." },
{ k:"cup",      n:"fincan",      img:() => HOUSE_IMAGES.cup,      t:"Fincanla çay içilir.",           f:"Fincanla saç taranır.",         bt:"Bununla çay içilir.",        bf:"Bununla saç taranır." },
{ k:"scissors", n:"makas",       img:() => HOUSE_IMAGES.scissors, t:"Makasla kâğıt kesilir.",         f:"Makasla çorba içilir.",         bt:"Bununla kâğıt kesilir.",     bf:"Bununla çorba içilir." },
{ k:"clock",    n:"saat",        img:() => HOUSE_IMAGES.clock,    t:"Saat zamanı gösterir.",          f:"Saat havlar.",                  bt:"Bu zamanı gösterir.",        bf:"Bu havlar." },
{ k:"lamp",     n:"lamba",       img:() => HOUSE_IMAGES.lamp,     t:"Lamba ışık verir.",              f:"Lamba yemek pişirir.",          bt:"Bu ışık verir.",             bf:"Bu yemek pişirir." },
{ k:"comb",     n:"tarak",       img:() => HOUSE_IMAGES.comb,     t:"Tarakla saç taranır.",           f:"Tarakla su taşınır.",           bt:"Bununla saç taranır.",       bf:"Bununla su taşınır." },
{ k:"pillow",   n:"yastık",      img:() => HOUSE_IMAGES.pillow,   t:"Yastık yumuşaktır.",             f:"Yastık çok sert ve keskindir.", bt:"Bu yumuşaktır.",             bf:"Bu çok keskindir." },
{ k:"bucket",   n:"kova",        img:() => HOUSE_IMAGES.bucket,   t:"Kovayla su taşınır.",            f:"Kovayla resim çizilir.",        bt:"Bununla su taşınır.",        bf:"Bununla resim çizilir." },
{ k:"broom",    n:"süpürge",     img:() => HOUSE_IMAGES.broom,    t:"Süpürgeyle yer temizlenir.",     f:"Süpürge meyve verir.",          bt:"Bununla yer temizlenir.",    bf:"Bu meyve verir." },
{ k:"apple",    n:"elma",        img:() => FRUIT_VEG_IMAGES.apple,  t:"Elma bir meyvedir.",           f:"Elma bir hayvandır.",           bt:"Bu bir meyvedir.",           bf:"Bu bir hayvandır." },
{ k:"banana",   n:"muz",         img:() => FRUIT_VEG_IMAGES.banana, t:"Muzun kabuğu soyulur.",        f:"Muz havlar.",                   bt:"Bunun kabuğu soyulur.",      bf:"Bu havlar." },
{ k:"carrot",   n:"havuç",       img:() => FRUIT_VEG_IMAGES.carrot, t:"Havuç bir sebzedir.",          f:"Havuç uçabilir.",               bt:"Bu bir sebzedir.",           bf:"Bu uçabilir." },
{ k:"strawberry", n:"çilek",     img:() => FRUIT_VEG_IMAGES.strawberry, t:"Çilek kırmızıdır.",        f:"Çilek mavidir.",                bt:"Bu kırmızıdır.",             bf:"Bu mavidir." }
];
const SPAN_SETS = { post:[2, 3, 4], pre:[2, 3, 3] }, SPAN_COUNT_PRE = [2, 2, 3];   // öncesi: 2 öğe×2 set → 3 öğe×2 set → 3 öğe×3 set
const spanSetSize = () => (isPre() ? SPAN_SETS.pre : SPAN_SETS.post)[currentCombo().t];
/* Okuma Aralığı (span-read) düzey cümleleri: t2/f2 = Orta (çıkarım isteyen tek cümle, nesne cümlenin içinde), t3/f3 = Zor (iki cümle: olay + çıkarım) */
const SPAN_LEVELS = {
dog:{ t2:"Hırsız gelince bahçedeki köpek havlayarak haber verir.", f2:"Evdeki köpek her sabah yumurtlayarak kahvaltıyı hazırlar.", t3:"Köpek kapıya koşup kuyruğunu salladı. Sahibi eve gelmiş olmalı.", f3:"Köpek kuyruğunu sallayıp havladı. Demek ki köpek derin uykudaydı." },
cat:{ t2:"Fare görünce kedi sessizce ona yaklaşır.", f2:"Soğuk kış günlerinde kedi gölde yüzmeye gider.", t3:"Kedi mama kabının başında miyavlıyor. Acıkmış olmalı.", f3:"Kedi tabağındaki mamanın hepsini yedi. Demek ki hiç aç değildi." },
cow:{ t2:"Çiftçi her sabah ineği sağar ve sütü kovaya doldurur.", f2:"Çiftçi ineğin sırtına binip ağaçlara tırmanır.", t3:"İneğin sütü kovaya dolduruldu. Çiftçi ineği sağmış.", f3:"İnek bütün gün ahırda uyudu. Demek ki tarlayı sürmüş." },
fish:{ t2:"Akvaryumdaki balık suyun içinde yüzerek yaşar.", f2:"Balık susayınca sudan çıkıp çeşmeden su içer.", t3:"Balık suyun üstüne çıkıp ağzını açtı. Yem bekliyor olabilir.", f3:"Balık akvaryumda yüzüyor. Demek ki susuz kalmış." },
elephant:{ t2:"Fil, hortumuyla su çekip üstüne püskürtür.", f2:"Fil küçücük olduğu için cebimize sığar.", t3:"Fil hortumunu göle daldırıp su çekti. Su içecek ya da serinleyecek.", f3:"Fil çalıları ezerek geçti. Demek ki çok küçük bir hayvan." },
parrot:{ t2:"Papağan duyduğu kelimeleri tekrar edebilir.", f2:"Papağan tüyleri olmadığı için dört ayak üstünde koşar.", t3:"Papağan sabah 'günaydın' dedi. Birinden duyup öğrenmiş olmalı.", f3:"Papağan kafesinde sessizce uyuyor. Demek ki şarkı söylüyor." },
penguin:{ t2:"Buzların üstünde yürüyen penguen soğuktan üşümez.", f2:"Çölde yaşayan penguen sıcak kumda yuva yapar.", t3:"Penguen buzun kenarından denize atladı. Balık avlayacak.", f3:"Penguen sıcak kumda ter içinde kaldı. Demek ki kutuplarda yaşıyor." },
lion:{ t2:"Ormanda avlanan aslan et yer.", f2:"Aslan otla beslendiği için koyunlarla birlikte otlar.", t3:"Aslan uzun otların arasında usulca ilerledi. Avını gözetliyor.", f3:"Aslan karnı tok, gölgede uyuyor. Demek ki şu anda avlanıyor." },
giraffe:{ t2:"Zürafa, uzun boynu sayesinde ağaçların tepesindeki yapraklara ulaşır.", f2:"Zürafa boynu kısa olduğu için yerdeki otları zor yer.", t3:"Zürafa boynunu uzatıp en yüksek dalı yedi. Boyu bu işe yetiyor.", f3:"Zürafa yerdeki otu zor yiyor. Demek ki boynu kısa." },
zebra:{ t2:"Zebranın siyah beyaz çizgileri onu diğer atlardan ayırır.", f2:"Zebra tek renk mor olduğu için kolayca tanınır.", t3:"Zebralar birden sürü hâlinde koşmaya başladı. Bir tehlike görmüş olabilirler.", f3:"Zebra tek başına uyuyor. Demek ki arkadaşlarıyla koşuyor." },
monkey:{ t2:"Maymun daldan dala atlayarak ağaçta dolaşır.", f2:"Maymun denizin dibinde yüzgeçleriyle yüzer.", t3:"Maymun muzu kaptı ve ağaca tırmandı. Muzu yukarıda yiyecek.", f3:"Maymun yerde uyuyor. Demek ki daldan dala atlıyor." },
bear:{ t2:"Ayı kış gelince mağarasında uzun bir uykuya yatar.", f2:"Ayı yumurtadan çıktığı için tavuğa benzer.", t3:"Ayı sonbaharda bol bol yedi ve mağarasına girdi. Kış uykusuna hazırlanıyor.", f3:"Ayı karda oynuyor. Demek ki yaz tatilindeyiz." },
squirrel:{ t2:"Sincap kış için fındıkları toplayıp saklar.", f2:"Sincap filden büyük olduğu için ağaca sığmaz.", t3:"Sincap fındıkları toprağa gömdü. Kışın bulup yiyecek.", f3:"Sincap yazın hiç fındık saklamadı. Demek ki kışın bol yiyeceği olacak." },
hedgehog:{ t2:"Kirpi tehlike görünce dikenlerini kabartıp top olur.", f2:"Kirpi kanatlarını açıp gökyüzünde uçar.", t3:"Kirpi dikenlerini kabartıp top oldu. Bir tehlike hissetmiş.", f3:"Kirpi rahatça geziniyor. Demek ki çok korkmuş." },
dolphin:{ t2:"Yunus denizde sudan zıplayarak oynar.", f2:"Yunus ormanda ağaçların arasında koşar.", t3:"Yunus sudan zıpladı ve yeniden daldı. Nefes almış olabilir.", f3:"Yunus denizde yüzüyor. Demek ki ormanda yaşıyor." },
turtle:{ t2:"Kaplumbağa korkunca başını kabuğunun içine çeker.", f2:"Kaplumbağa tavşandan hızlı koştuğu için yarışı hep kazanır.", t3:"Kaplumbağa başını kabuğuna çekti. Korkmuş olmalı.", f3:"Kaplumbağa yavaşça yürüyor. Demek ki koşu yarışını kazandı." },
ball:{ t2:"Çocuklar bahçede topu birbirlerine atarak oynar.", f2:"Top kare olduğu için yerde yuvarlanmaz.", t3:"Top çite çarpıp geri geldi. Biri topa sert vurmuş.", f3:"Top suya düşüp batmadı. Demek ki taştan yapılmış." },
kite:{ t2:"Rüzgârlı günde uçurtma gökyüzünde yükselir.", f2:"Uçurtma rüzgâr olmayınca daha yükseğe uçar.", t3:"Uçurtma birden yere düştü. Rüzgâr kesilmiş olabilir.", f3:"Uçurtma gökyüzünde yükseldi. Demek ki hiç rüzgâr yok." },
apple:{ t2:"Ağaçtan koparılan elma yıkanıp yenir.", f2:"Elma denizin dibinde yetişen bir balıktır.", t3:"Elma ağaçtan yere düştü. Olgunlaşmış olabilir.", f3:"Elma yemyeşil ve çok sert. Demek ki çürümüş." },
carrot:{ t2:"Toprağın altında büyüyen havuç turuncu renklidir.", f2:"Havuç gökyüzünde bulutların üstünde yetişir.", t3:"Havuç topraktan çekilince üstü çamurluydu. Toprağın altında büyümüş.", f3:"Havuç ağacın tepesinden koparıldı. Demek ki toprakta yetişmiş." } };
