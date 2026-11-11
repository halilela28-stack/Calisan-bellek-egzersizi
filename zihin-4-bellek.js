/* Zihin Atölyesi — zihin-4-bellek.js (4/8): bellek ve dikkat çalışmalarının veri ve kurucuları (NEW_MT dahil). Dosyalar zihin-atolyesi.html'de bu sırayla yüklenir; sıra değiştirilemez (önceki tek dosyanın ardışık parçalarıdır). */
function spanLevel(){ try{ return currentExercise().id === "span-read" ? Math.min(currentCombo().t, 2) : 0; }catch(e){ return 0; } }
function spanSentence(it){ const L = spanLevel(); if(L === 0 || !SPAN_LEVELS[it.b.k]) return it.truth ? it.b.t : it.b.f; const x = SPAN_LEVELS[it.b.k]; return L === 1 ? (it.truth ? x.t2 : x.f2) : (it.truth ? x.t3 : x.f3); }
function makeSpanSets(count){ const size = spanSetSize(), L = spanLevel(), pool = shuffleArray(L ? SPAN_BANK.filter(b => SPAN_LEVELS[b.k]) : SPAN_BANK), sets = [];
let k = 0;
for(let s2 = 0; s2 < count; s2++){
const items = [];
for(let i = 0; i < size; i++){ const b = pool[k++ % pool.length]; items.push({ b, truth: Math.random() < 0.5 }); }
sets.push({ items });
}
return sets;
}
function renderSpanList(sets, readMode){
return `<div class="aud-list"><div class="aud-note">${readMode ? (spanLevel() === 2 ? "Çocuk iki cümleyi kendisi okusun: ikinci cümle ilkine uyan bir çıkarımsa <b>doğru</b>, uymuyorsa <b>yanlış</b> desin; set bitince cümlelerdeki nesneleri sırayla söylesin." : spanLevel() === 1 ? "Çocuk her cümleyi kendisi okusun ve doğru mu yanlış mı söylesin (nesne cümlenin içinde geçer); set bitince nesneleri sırayla söylesin." : "Çocuk her cümleyi kendisi okusun ve doğru mu yanlış mı söylesin; set bitince cümlelerdeki nesneleri sırayla söylesin.") : "Her cümleyi okuyun; çocuk doğru mu yanlış mı söylesin ve cümledeki nesneyi aklında tutsun. Set bitince nesneleri sırayla söylesin."} Nesneleri yanlış ya da eksik söylediği setleri hata sayısına ekleyin.</div>` +
sets.map((st, i) => `<div class="aud-row" data-row="${i}"><div class="aud-num">${i + 1}</div><div class="aud-body">` +
st.items.map(it => `<div class="${readMode ? "span-read" : "aud-words"}" style="${readMode ? "font-size:22px;font-weight:800;line-height:1.35;margin:4px 0" : "font-size:19px;margin:3px 0"}">${spanSentence(it)} <span style="font-size:13px;font-weight:900;color:${it.truth ? "#1FA463" : "#E5484D"}">(${it.truth ? "doğru" : "yanlış"})</span></div>`).join("") +
`<div class="aud-key">Hatırlanacak: <b>${st.items.map(it => it.b.n).join(" – ")}</b></div></div></div>`).join("") + `</div>`;
}

const LNS_LETTERS = { 0:"ABCDEFGHKLMNPRST".split(""), 1:"ABCDEFGHİKLMNOPRSTUYZ".split(""), 2:"ABCÇDEFGHIİKLMNOÖPRSŞTUÜVYZ".split("") };
const TR_ALPHA = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
const lnsLen = () => [3, 4, 5][currentCombo().t];
function makeLnsSeq(len){
const t = currentCombo().t, letters = shuffleArray(LNS_LETTERS[t]), digits = shuffleArray(["1","2","3","4","5","6","7","8","9"]);
const nL = Math.max(1, Math.floor(len / 2)), nD = len - nL;
let seq; let g = 0;
do{ seq = shuffleArray(digits.slice(0, nD).concat(letters.slice(0, nL))); g++; } while(g < 30 && seq.every((x, i) => i === 0 || /\d/.test(x) !== /\d/.test(seq[i-1])) === false && false);
return seq;
}
function lnsAnswer(seq, sorted){
const d = seq.filter(x => /\d/.test(x)), l = seq.filter(x => !/\d/.test(x));
if(sorted){ d.sort((a, b) => a - b); l.sort((a, b) => TR_ALPHA.indexOf(a) - TR_ALPHA.indexOf(b)); }
return d.concat(l);
}


/* KURAL: Değerlendirme turunda resimli sorular geniş havuzdan seçilir (oyuncak, ev eşyası, meyve-sebze + vahşi/deniz hayvanları ve diğer kategoriler) — aynı resimler sık tekrar etmez */
function picPoolWide(){ const base = picPoolBase(), seen = new Set(base.map(x => x.src)), add = []; try{ const C = qzCats(); Object.keys(C).forEach(cat => (C[cat].items || []).forEach(x => { if(x && x.src && !seen.has(x.src)){ seen.add(x.src); add.push(Object.assign({ cat }, x)); } })); }catch(e){} return base.concat(add); }
function picPool(){ return window.__placeWide ? picPoolWide() : picPoolBase(); }
function picPoolBase(){
return TOY_KEYS.map(k => ({ k:"t-" + k, n: TOY_NAMES[k], src: TOY_IMAGES[k], cat:"toy" }))
.concat(HOUSE_KEYS.map(k => ({ k:"h-" + k, n: HOUSE_NAMES[k], src: HOUSE_IMAGES[k], cat:"house" })))
.concat(Object.keys(FRUIT_VEG_NAMES).map(k => ({ k:"f-" + k, n: FRUIT_VEG_NAMES[k], src: FRUIT_VEG_IMAGES[k], cat: FRUIT_VEG_CATEGORY[k] })));
}
const RUN_LAST = { post:[2, 3, 4], pre:[2, 2, 3] }, RUN_EXTRA = { pre:[0, 2, 2], post:[0, 0, 0] };
const runLast = () => (isPre() ? RUN_LAST.pre : RUN_LAST.post)[currentCombo().t];
function makeRunStream(){
const L = runLast(), len = L + 2 + Math.floor(Math.random() * 4) + (isPre() ? RUN_EXTRA.pre : RUN_EXTRA.post)[Math.min(currentCombo().t, 2)];   // öncesi Orta: aynı "son 2", daha uzun akış
const pool = shuffleArray(picPool()); return pool.slice(0, len);
}
const ZH_SPEC = { post:{ n:[3, 4, 4], k:[2, 3, 4] }, pre:{ n:[3, 3, 3], k:[1, 2, 3] } };
const ZH_DIRS = { R:{dx:1, dy:0, w:"sağa", a:"→"}, L:{dx:-1, dy:0, w:"sola", a:"←"}, U:{dx:0, dy:-1, w:"yukarı", a:"↑"}, D:{dx:0, dy:1, w:"aşağı", a:"↓"} };
function makeZihniRound(){
const sp = isPre() ? ZH_SPEC.pre : ZH_SPEC.post, t = currentCombo().t, n = sp.n[t], k = sp.k[t];
let x = Math.floor(n / 2), y = Math.floor(n / 2); if(n % 2 === 0){ x = Math.floor(Math.random() * n); y = Math.floor(Math.random() * n); }
const sx = x, sy = y, cmds = [];
let last = null;
while(cmds.length < k){
const opts = Object.keys(ZH_DIRS).filter(d => { const v = ZH_DIRS[d]; return x + v.dx >= 0 && x + v.dx < n && y + v.dy >= 0 && y + v.dy < n && !(last && ZH_DIRS[last].dx === -v.dx && ZH_DIRS[last].dy === -v.dy); });
const d = randomItem(opts); x += ZH_DIRS[d].dx; y += ZH_DIRS[d].dy; cmds.push(d); last = d;
}
return { n, sx, sy, cmds, ex: x, ey: y };
}
function zhCellName(r){ const n = r.n; const col = ["sol", "orta", "sağ"], row = ["üst", "orta", "alt"];
if(n === 3) return (r.ey === 1 && r.ex === 1) ? "tam orta" : `${row[r.ey]} ${col[r.ex]}`.replace("orta orta", "tam orta");
return `${r.ey + 1}. satır, ${r.ex + 1}. sütun`; }
const MK_K = { post:[3, 4, 5], pre:[2, 3, 4] };
const mkK = () => (isPre() ? MK_K.pre : MK_K.post)[currentCombo().t];
function makeMarketRound(){
const all = picPool(), K = mkK(), list = shuffleArray(all).slice(0, K);
const similar = shuffleArray(all.filter(x => !list.includes(x) && list.some(l => l.cat === x.cat))).slice(0, Math.min(Math.ceil(K * 0.8), 8 - K));
const other = shuffleArray(all.filter(x => !list.includes(x) && !similar.includes(x))).slice(0, Math.max(1, Math.min(9, K * 2 + 1) - K - similar.length));
return { list, shelf: shuffleArray(list.concat(similar, other)) };
}
const MK_DISTRACT = ["20'den geriye doğru ikişer ikişer say", "haftanın günlerini say", "5 tane hayvan adı söyle", "ellerini 5 kez çırp ve say", "en sevdiğin oyunu anlat"];


function palPairsPre(){
const P = (a, b, na, nb) => ({ a:{ src: PAIR_IMAGES[a], n: na }, b:{ src: PAIR_IMAGES[b], n: nb }, id: a + "-" + b });
return [P("door","key","kapı","anahtar"), P("foot","shoe","ayak","ayakkabı"), P("tooth","toothbrush","diş","diş fırçası"), P("cloud","umbrella","bulut","şemsiye"),
P("flower","wateringcan","çiçek","sulama kabı"), P("nail","hammer","çivi","çekiç"), P("letter","envelope","mektup","makas"), P("pencil","sharpener","kalem","kalemtıraş"),
{ a:{ src: TA_ANIMALS.rabbit(), n:"tavşan" }, b:{ src: FRUIT_VEG_IMAGES.carrot, n:"havuç" }, id:"rabbit-carrot" },
{ a:{ src: WILD_IMAGES.monkey, n:"maymun" }, b:{ src: FRUIT_VEG_IMAGES.banana, n:"muz" }, id:"monkey-banana" },
{ a:{ src: TA_ANIMALS.cat(), n:"kedi" }, b:{ src: SEA_IMAGES.fish, n:"balık" }, id:"cat-fish" },
{ a:{ src: PAL_EXTRA_IMAGES.bee, n:"arı" }, b:{ src: PAL_EXTRA_IMAGES.honey, n:"bal" }, id:"bee-honey" },
{ a:{ src: PAL_EXTRA_IMAGES.spoon, n:"kaşık" }, b:{ src: PAL_EXTRA_IMAGES.bowl, n:"çorba" }, id:"spoon-bowl" },
{ a:{ src: PAL_EXTRA_IMAGES.sock, n:"çorap" }, b:{ src: PAL_EXTRA_IMAGES.slipper, n:"terlik" }, id:"sock-slipper" },
{ a:{ src: PAL_EXTRA_IMAGES.dog, n:"köpek" }, b:{ src: PAL_EXTRA_IMAGES.bone, n:"kemik" }, id:"dog-bone" }];
}
function palPairsPost(K){
const pool = shuffleArray(picUniq(picPool().concat(WILD_KEYS.map(k => ({ k:"w-" + k, n: WILD_NAMES[k], src: WILD_IMAGES[k], cat:"wild" })))));
const out = [], used = new Set();
for(const a of pool){ if(out.length >= K) break; if(used.has(a.k)) continue;
const b = pool.find(x => !used.has(x.k) && x.k !== a.k && x.cat !== a.cat); if(!b) continue;
used.add(a.k); used.add(b.k); out.push({ a:{ src:a.src, n:a.n }, b:{ src:b.src, n:b.n }, id: a.k + "-" + b.k }); }
return out;
}
const PAL_K = { post:[3, 4, 5], pre:[2, 3, 4] };
const WP_WORDS = ["bulut","kitap","kalem","deniz","saat","ağaç","kapı","elma","bardak","yıldız","çanta","balık","masa","kuş","top","ayna","şapka","köprü","lamba","bisiklet","halı","tren","çorap","fener","bal","dağ","pencere","kaşık","ayakkabı","gemi"];
const WP_NAMES = ["Ali","Ece","Can","Elif","Mert","Zeynep","Emre","Defne","Kerem","Ada","Burak","Duru"];
const WP_PLACES = ["Ankara","Bursa","İzmir","Antalya","Trabzon","Konya","Van","Edirne","Samsun","Mardin","Kars","Muğla"];
function makeWordPairs(stage, K){
if(stage === 1){ const nums = shuffleArray(["1","2","3","4","5","6","7","8","9"]).slice(0, K), ws = shuffleArray(WP_WORDS).slice(0, K); return nums.map((n, i) => [n, ws[i]]); }
if(stage === 2){ const ns = shuffleArray(WP_NAMES).slice(0, K), ps = shuffleArray(WP_PLACES).slice(0, K); return ns.map((n, i) => [n, ps[i]]); }
const w = shuffleArray(WP_WORDS).slice(0, K * 2); return Array.from({length:K}, (_, i) => [w[i * 2], w[i * 2 + 1]]);
}
function makeMixedSeqs(){
const start = [3, 4, 5][currentCombo().t], out = [];
for(let L = start; L < start + 4; L++) for(let r = 0; r < 2; r++){
const nD = Math.floor(L / 2), digits = shuffleArray(["1","2","3","4","5","6","7","8","9"]).slice(0, nD), words = shuffleArray(AUD_WORDS).slice(0, L - nD);
let seq; do{ seq = shuffleArray(digits.concat(words)); } while(seq.length > 2 && seq.every((x, i) => i === 0 || /\d/.test(x) === /\d/.test(seq[i-1])));
out.push({ L, words: seq });
}
return out;
}
const STORIES_POST = [
{ id:"s1", text:"Cumartesi sabahı Elif, dedesiyle birlikte balık tutmaya göle gitti. Yanlarına iki sandviç ve bir şişe limonata aldılar. Elif ilk balığı yakaladığında çok sevindi ama balık küçük olduğu için onu suya geri bıraktı. Öğlen yağmur başlayınca sandalyelerini toplayıp eve döndüler.",
units:["Cumartesi","sabah","Elif","dedesiyle","balık tutmaya","göle","iki sandviç","limonata","ilk balığı yakaladı","sevindi","balık küçüktü","suya bıraktı","öğlen yağmur başladı","eve döndüler"],
q:[["Kim balık tutmaya gitti?","Elif ve dedesi"],["Nereye gittiler?","Göle"],["Ne zaman gittiler?","Cumartesi sabahı"],["Balığı neden geri bıraktı?","Küçük olduğu için"]] },
{ id:"s2", text:"Salı günü okulda resim yarışması vardı. Can, kırmızı bir uçurtma uçuran bir çocuk çizdi. Resmini bitirmek üzereyken boya kalemi kırıldı. Arkadaşı Deniz ona kendi kalemini verdi. Can yarışmada ikinci oldu ve ödülünü Deniz'le paylaştı.",
units:["Salı","okulda","resim yarışması","Can","kırmızı","uçurtma uçuran çocuk","boya kalemi kırıldı","arkadaşı Deniz","kalemini verdi","ikinci oldu","ödülünü paylaştı"],
q:[["Yarışma nerede yapıldı?","Okulda"],["Can ne çizdi?","Kırmızı uçurtma uçuran bir çocuk"],["Ne oldu?","Boya kalemi kırıldı"],["Kim yardım etti?","Arkadaşı Deniz"]] },
{ id:"s3", text:"Geçen kış Ayşe ailesiyle Erzurum'a gitti. Dağda ilk kez kayak yaptı ve iki kez düştü. Akşam otelde sıcak çikolata içtiler. Ertesi gün kocaman bir kardan adam yaptılar ve ona havuçtan bir burun taktılar.",
units:["geçen kış","Ayşe","ailesiyle","Erzurum","dağda","ilk kez kayak","iki kez düştü","akşam","otelde","sıcak çikolata","ertesi gün","kardan adam","havuçtan burun"],
q:[["Ayşe nereye gitti?","Erzurum'a"],["Ne zaman gitti?","Geçen kış"],["Kaç kez düştü?","İki kez"],["Kardan adamın burnu neydi?","Havuç"]] },
{ id:"s4", text:"Pazar akşamı Mert'in kedisi Pamuk kayboldu. Mert bütün mahalleyi dolaştı ve komşularına sordu. Bakkal amca, kediyi bahçedeki ağacın üstünde gördüğünü söyledi. Mert merdivenle ağaca çıkan babası sayesinde Pamuk'u kurtardı ve ona süt verdi.",
units:["Pazar","akşam","Mert","kedisi Pamuk","kayboldu","mahalleyi dolaştı","komşulara sordu","bakkal amca","bahçedeki ağaç","babası","merdiven","kurtardı","süt verdi"],
q:[["Kedinin adı neydi?","Pamuk"],["Kedi ne zaman kayboldu?","Pazar akşamı"],["Kediyi kim gördü?","Bakkal amca"],["Kedi neredeydi?","Bahçedeki ağacın üstünde"]] },
{ id:"s5", text:"Yaz tatilinde Zeynep anneannesinin köyüne gitti. Her sabah tavuklara yem verdi ve yumurtaları topladı. Bir gün bahçede küçük bir kaplumbağa buldu. Kaplumbağaya marul yedirdi ve adını Tosbik koydu. Tatil bitince onu yine bahçeye bıraktı.",
units:["yaz tatili","Zeynep","anneannesinin köyü","her sabah","tavuklara yem","yumurtaları topladı","bahçede","küçük kaplumbağa","marul","adı Tosbik","tatil bitince","bahçeye bıraktı"],
q:[["Zeynep nereye gitti?","Anneannesinin köyüne"],["Her sabah ne yaptı?","Tavuklara yem verip yumurta topladı"],["Ne buldu?","Küçük bir kaplumbağa"],["Kaplumbağanın adı neydi?","Tosbik"]] },
{ id:"s6", text:"Perşembe öğleden sonra Burak ve kardeşi parkta bisiklet sürüyordu. Burak'ın bisikletinin zinciri çıktı. Yaşlı bir amca durup zinciri taktı ve ellerini silmeleri için mendil verdi. Burak teşekkür etti ve eve dönünce annesine bu iyiliği anlattı.",
units:["Perşembe","öğleden sonra","Burak","kardeşi","parkta","bisiklet","zincir çıktı","yaşlı amca","zinciri taktı","mendil verdi","teşekkür etti","annesine anlattı"],
q:[["Burak nerede bisiklet sürüyordu?","Parkta"],["Ne oldu?","Bisikletinin zinciri çıktı"],["Kim yardım etti?","Yaşlı bir amca"],["Eve dönünce ne yaptı?","Annesine anlattı"]] }
];


// Kısa Hikâye: zorluk görsel destekle ayarlanır (hikâyelerin uzunluğu birbirine yakın)
function ssNote(){ return ["Çocuk resme bakarken hikâyeyi yavaşça okuyun; resim sorularda da açık kalsın.", "Çocuk resme bakarken hikâyeyi yavaşça okuyun; <b>soruları sormadan önce resmi kapatın</b> (ekranı kendinize çevirin).", "<b>Resim yok:</b> çocuk hikâyeyi yalnızca dinleyerek takip etsin; yavaşça okuyun, sonra soruları sorun."][Math.min(currentCombo().t, 2)]; }
function ssShowImg(){ return currentCombo().t < 2; }
const STORIES_PRE = [
{ img:"park", text:"Ali parka gitti. Topla oynadı. Sonra eve döndü.", q:[["Kim parka gitti?","Ali"],["Ne yaptı?","Topla oynadı"],["Sonra nereye gitti?","Eve"]] },
{ img:"apple", text:"Ece elmasını yıkadı. Elmayı yedi. Çöpünü attı.", q:[["Ece neyi yıkadı?","Elmayı"],["Sonra ne yaptı?","Yedi"],["En son ne yaptı?","Çöpünü attı"]] },
{ img:"cat", text:"Kedi bahçeye çıktı. Bir kelebek gördü. Kelebeğin peşinden koştu.", q:[["Kim bahçeye çıktı?","Kedi"],["Ne gördü?","Kelebek"],["Ne yaptı?","Peşinden koştu"]] },
{ img:"bed", text:"Can dişlerini fırçaladı. Pijamasını giydi. Yatağına yattı.", q:[["Can önce ne yaptı?","Dişlerini fırçaladı"],["Ne giydi?","Pijamasını"],["En son ne yaptı?","Yatağına yattı"]] },
{ img:"rain", text:"Yağmur yağdı. Defne şemsiyesini açtı. Okula gitti.", q:[["Hava nasıldı?","Yağmurlu"],["Defne neyi açtı?","Şemsiyesini"],["Nereye gitti?","Okula"]] },
{ img:"cake", text:"Annem kek yaptı. Kek fırında pişti. Hep birlikte yedik.", q:[["Annem ne yaptı?","Kek"],["Kek nerede pişti?","Fırında"],["Keki kim yedi?","Hep birlikte"]] },
{ img:"bird", text:"Kuş ağaca kondu. Yuvasına çöp taşıdı. Sonra şarkı söyledi.", q:[["Kuş nereye kondu?","Ağaca"],["Ne taşıdı?","Çöp"],["Sonra ne yaptı?","Şarkı söyledi"]] },
{ img:"shoe", text:"Mert ayakkabısını giydi. Bağcığını bağladı. Bahçeye koştu.", q:[["Mert ne giydi?","Ayakkabısını"],["Neyi bağladı?","Bağcığını"],["Nereye koştu?","Bahçeye"]] }
];
let storyChecked = {};
function rememberStory(id){ const d = delayGet("story"); if(!d || d.id !== id) delaySet("story", { id }); }
function lastStory(){ return delayGet("story"); }
function renderStoryBoard(items){
const st = items[0], delayed = currentStageIndex === 1, strat = false;
const total = st.units.length, got = st.units.filter((u, i) => storyChecked[i]).length;
const ls = lastStory(), mins = ls ? Math.floor((Date.now() - ls.ts) / 60000) : 0;
const head = delayed
? `<div class="aud-note">⏰ Hikâye <b>${mins} dakika</b> önce okundu. Hikâyeyi yeniden okumadan çocuktan anlatmasını isteyin ve hatırladığı ayrıntılara dokunun.${mins < 10 ? " <b>(10–15 dakika beklemeniz önerilir.)</b>" : ""}</div><details style="margin:6px 0"><summary style="font-weight:800;color:var(--teal-dark);cursor:pointer">Hikâyeyi göster (yalnızca yetişkin için)</summary><div style="font-size:15px;line-height:1.5;margin-top:6px">${st.text}</div></details>`
: (strat ? `<div class="aud-note" style="border-color:#E0A100;background:#FFF8E5">💡 <b>Strateji · Soru sorarak dinle:</b> Okumadan önce söyleyin: <b>"Dinlerken şu soruların cevaplarını yakala: Kim? Nerede? Ne zaman? Ne oldu? Sonunda ne oldu?"</b> Anlatırken de bu sırayı izlemesine yardım edin. Sonucu Aşama 1 ile karşılaştırın.</div><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:4px 0">${["Kim?","Nerede?","Ne zaman?","Ne oldu?","Sonunda?"].map(q => `<span style="background:#FFE7A3;border-radius:12px;padding:6px 12px;font-weight:900;font-size:17px">${q}</span>`).join("")}</div>` : "") + `<div class="aud-note">${["Hikâyeyi <b>iki kez</b>, doğal bir hızla okuyun.", "Hikâyeyi <b>bir kez</b>, doğal bir hızla okuyun.", "Hikâyeyi <b>bir kez</b> okuyun; çocuk olayları <b>oluş sırasıyla</b> anlatsın (sıra karışırsa not edin)."][Math.min(currentCombo().t, 2)]} Çocuk kendi cümleleriyle anlatsın; hatırladığı her ayrıntıya dokunun. Sonra soruları sorun.</div><div style="font-size:19px;line-height:1.55;font-weight:700;background:var(--panel);border:2px solid var(--line);border-radius:16px;padding:12px 14px;margin:8px 0">${st.text}</div>`;
const chips = `<div style="font-weight:900;margin:6px 0">Hatırlanan ayrıntılar: <span style="color:var(--teal-dark)">${got} / ${total}</span></div><div style="display:flex;flex-wrap:wrap;gap:6px">` +
st.units.map((u, i) => `<button type="button" data-unit="${i}" style="border:2px solid ${storyChecked[i] ? "#1FA463" : "var(--line)"};background:${storyChecked[i] ? "#E3F6EC" : "var(--panel)"};border-radius:999px;padding:6px 12px;font-family:inherit;font-weight:800;font-size:14px;color:var(--ink);cursor:pointer">${storyChecked[i] ? "✓ " : ""}${u}</button>`).join("") + `</div>`;
const qs = delayed ? "" : `<div style="font-weight:900;margin:12px 0 4px">Sorular</div>` + st.q.map(q => `<div class="aud-row" style="padding:8px 10px"><div class="aud-body"><div style="font-weight:800">${q[0]}</div><div class="aud-key">Cevap: <b>${q[1]}</b></div></div></div>`).join("");
return `<div class="aud-list">${head}${chips}${qs}</div>`;
}
document.getElementById("board").addEventListener("click", (ev) => {
const b = ev.target.closest("[data-unit]"); if(!b || currentExercise().id !== "story-recall") return;
const i = Number(b.dataset.unit); storyChecked[i] = !storyChecked[i];
if(currentStageIndex === 0) rememberStory(currentGrid[0].id);
const st = currentGrid[0]; setErrorCount(st.units.length - st.units.filter((u, k) => storyChecked[k]).length);
renderBoard();
});


const CAPTION_KEY = "wm_caption_v1";
function captionOn(){ try{ return localStorage.getItem(CAPTION_KEY) === "1"; }catch(e){ return false; } }
function ttsUsable(){ try{ if(!("speechSynthesis" in window)) return false; const v = speechSynthesis.getVoices(); return !v || v.length === 0 ? (window.__ttsVoicesTried ? false : true) : true; }catch(e){ return false; } }
function showCaption(t){ let el = document.getElementById("ttsCaption"); if(!el){ el = document.createElement("div"); el.id = "ttsCaption"; el.setAttribute("role", "status"); el.setAttribute("aria-live", "polite"); document.body.appendChild(el); }
el.textContent = "🔊 " + t; el.classList.add("on"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("on"), Math.min(6000, Math.max(2200, t.length * 80))); }
function hideCaption(){ const el = document.getElementById("ttsCaption"); if(el){ el.classList.remove("on"); clearTimeout(el._t); } }
try{ if("speechSynthesis" in window){ speechSynthesis.getVoices(); setTimeout(() => { window.__ttsVoicesTried = true; }, 2500); } }catch(e){}
function sayTask(t, rate){
try{
{ const ma = document.getElementById("mainApp"); if(!ma || getComputedStyle(ma).display === "none") return; } /* etkinlik ekranı kapalıyken (haritaya/ana sayfaya dönülmüşse) gecikmeli yönerge okunmaz */
if(captionOn() || !ttsUsable()) showCaption(t);
if(!("speechSynthesis" in window)) return;
const u = new SpeechSynthesisUtterance(ttsPrep(t).join(" ")); u.lang = "tr-TR"; u.rate = (rate || 0.85) * voiceRateMul(); u.pitch = voicePitch(1.0);
_trVoice = _trVoice || pickTurkishVoice(); if(_trVoice) u.voice = _trVoice; u.onerror = () => showCaption(t); _ttsSpeak(u);
}catch(e){}
}
const SPEAKER_HTML = (on) => `<div class="wm-card" style="width:150px;height:150px;font-size:70px;${on ? "animation:spkPulse .6s ease-in-out infinite alternate;" : ""}">🔊</div>`;
const DIR_COLORS = [ { k:"red", hex:ACC.kirmizi, n:"kırmızı", d:"kırmızıya" }, { k:"blue", hex:ACC.mavi, n:"mavi", d:"maviye" }, { k:"yellow", hex:ACC.sari, n:"sarı", d:"sarıya" }, { k:"green", hex:ACC.yesil, n:"yeşil", d:"yeşile" } ];
const DIR_SHAPES = [ { k:"circle", n:"daire", d:"daireye" }, { k:"triangle", n:"üçgen", d:"üçgene" }, { k:"star", n:"yıldız", d:"yıldıza" }, { k:"heart", n:"kalp", d:"kalbe" } ];
function dirItems(){
const t = currentCombo().t;
if(isPre()) return shuffleArray(DIR_COLORS).slice(0, [3, 4, 4][t]).map(c => ({ c, s: DIR_SHAPES[0], dat: c.d, nm: c.n }));
const N = [6, 6, 8][t], shapes = shuffleArray(DIR_SHAPES).slice(0, t === 2 ? 3 : 2), all = [];
DIR_COLORS.forEach(c => shapes.forEach(s => all.push({ c, s, dat: `${c.n} ${s.d}`, nm: `${c.n} ${s.n}` })));
let pick; do{ pick = shuffleArray(all).slice(0, N); } while(!pick.some(a => pick.filter(b => b.c === a.c).length > 1));
return pick;
}
function dirTrial(){
const t = currentCombo().t, items = dirItems(), steps = (isPre() ? [1, 2, 3] : [2, 3, 3])[t];
const ord = shuffleArray(items.map((x, i) => i)).slice(0, steps);
let text;
if(!isPre() && t === 2){   // "…dokunmadan önce …" : söylenen ile yapılacak sıra farklı
text = `${cap(items[ord[1]].dat)} dokunmadan önce ${items[ord[0]].dat} dokun, sonra ${items[ord[2]].dat} dokun.`;
} else if(steps === 1) text = `${cap(items[ord[0]].dat)} dokun.`;
else text = `Önce ${items[ord[0]].dat}, ` + ord.slice(1).map((o, k) => (k === ord.length - 2 ? "en son " : "sonra ") + items[o].dat).join(", ") + " dokun.";
return { items, ord, text };
}
function cap(s){ return s.charAt(0).toLocaleUpperCase("tr-TR") + s.slice(1); }
function drawPattern(n, segs){
const key = (a, b) => a < b ? a + "-" + b : b + "-" + a, nb = (p) => { const r = Math.floor(p / n), c = p % n, out = [];
for(let dr = -1; dr <= 1; dr++) for(let dc = -1; dc <= 1; dc++){ if(!dr && !dc) continue; const rr = r + dr, cc = c + dc; if(rr >= 0 && rr < n && cc >= 0 && cc < n) out.push(rr * n + cc); } return out; };
for(let g = 0; g < 200; g++){
let cur = Math.floor(Math.random() * n * n); const set = new Set(), path = [cur];
while(set.size < segs){ const opts = shuffleArray(nb(cur)).filter(q => !set.has(key(cur, q))); if(!opts.length) break; const q = opts[0]; set.add(key(cur, q)); cur = q; path.push(q); }
if(set.size === segs) return set;
}
return new Set();
}




const FACE_GENDER = ["b","g","b","g","g","b","g","b","b","g","b","g"];
const FACEID_NAMES = { b:["Can","Mert","Ali","Emre","Kerem","Burak","Efe","Arda"], g:["Elif","Zeynep","Defne","Ece","Ada","Duru","Nil","Su"] };
function faceTrial(){
const t = currentCombo().t;
if(stIx() === 1){ const K = (isPre() ? [2, 3, 4] : [3, 4, 5])[t], ids = shuffleArray(FACE_ID_IMAGES.map((x, i) => i)).slice(0, K), used = new Set();
const ppl = ids.map(i => { const nm = shuffleArray(FACEID_NAMES[FACE_GENDER[i]]).find(n => !used.has(n)); used.add(nm); return { i, nm }; });
return { mode:"name", ppl, order: shuffleArray(ppl.map((x, k) => k)) }; }
const M = (isPre() ? [2, 3, 4] : [3, 4, 6])[t], ids = shuffleArray(FACE_ID_IMAGES.map((x, i) => i));
const study = ids.slice(0, M); return { mode:"recog", study, opts: shuffleArray(ids.slice(0, M * 2)) };
}
const SCENES = [
{ k:"room", objs:["ball","clock","cat","lamp"], not:["apples"], q:[["Halının üstünde hangi top vardı?","Kırmızı bir top"],["Sandalyede ne oturuyordu?","Bir kedi"],["Yatak örtüsü ne renkti?","Mavi"],["Perdeler ne renkti?","Sarı"],["Pencerenin yanında duvarda ne asılıydı?","Saat"],["Komodindeki lamba ne renkti?","Yeşil"],["Halıda ne vardı?","Bir oyuncak uçak"],["Halının üstünde ne resmi vardı?","Yıldızlar"]] }   /* KURAL: sahne soruları sahnenin kendi resmindeki ayrıntılarla birebir uyuşur (yeni oda resmi 2026-10-28) */,
{ k:"kitchen", objs:["pot","apples","glass","bowl"], not:["ball"], q:[["Tabakta ne vardı?","Elma"],["Ocaktaki tencere ne renkti?","Kırmızı"],["Masada kaç bardak vardı?","2"],["Buzdolabının üstünde ne vardı?","Saksıda bitki"],["Yerde ne vardı?","Kırmızı mama kabı"],["Pencereden ne görünüyordu?","Güneş (ve ağaçlar)"],["Tabakta kaç elma vardı?","3"],["Buzdolabı ne renkti?","Beyaz"]] },
{ k:"park", objs:["balloon","bucket","bird","grandpa"], not:[], q:[["Salıncakta kim vardı?","Bir kız"],["Kaydıraktan kim kayıyordu?","Bir oğlan"],["Bankta kim oturuyordu?","Bir dede"],["Balon ne renkti?","Kırmızı"],["Ağaçta ne vardı?","Bir kuş"],["Yerde ne vardı?","Mavi bir kova"],["Kızın elbisesi ne renkti?","Pembe"],["Dedenin gözünde ne vardı?","Gözlük"]] },
{ k:"class", objs:["backpack","pencil","map","plant"], not:["ball","cat"], q:[["Tahtada ne resmi vardı?","Güneş"],["Duvarda ne asılıydı?","Harita"],["Öğretmen masasında hangi meyve vardı?","Elma"],["Sandalyede ne vardı?","Mor bir çanta"],["Yerde ne vardı?","Kırmızı bir kalem"],["Öğretmenin hırkası ne renkti?","Mor"],["Masadaki kitap ne renkti?","Mavi"],["Pencerenin önünde ne vardı?","Saksıda bitki"]] }
];
const SCENE_NAMES = { room:"Çocuk odası", kitchen:"Mutfak", park:"Park", class:"Sınıf" };
let lastSceneK = null;
function pickScene(){ const sc = shuffleArray(SCENES).find(x => x.k !== lastSceneK) || SCENES[0]; lastSceneK = sc.k; return sc; }
const sceneStudyMs = () => (isPre() ? [20000, 16000, 12000] : [15000, 12000, 9000])[currentCombo().t];
function sceneImgHTML(k, W, H, isLs){ const w = Math.min(W, isLs ? (H - 30) * 1.5 : 520); return `<img src="${SCENE_IMAGES[k]}" alt="" style="display:block;width:${w}px;max-width:100%;max-height:${isLs ? H - 30 : Math.round(innerHeight * 0.58)}px;object-fit:contain;border-radius:14px;margin:0 auto">`;   /* dikey sahne resmi ekrandan taşmaz */ }
const studyBar = (ms) => `<div style="height:8px;background:var(--line);border-radius:6px;overflow:hidden;margin:6px auto 0;max-width:520px"><div style="height:100%;background:var(--teal);animation:studyBar ${ms * (window.__wmSpeed || 1)}ms linear forwards"></div></div>`;

const SN_PLURAL = { 1:"1'leri", 2:"2'leri", 3:"3'leri", 4:"4'leri", 5:"5'leri", 6:"6'ları", 7:"7'leri", 8:"8'leri", 9:"9'ları" };
const SN_LOOK = { 1:[7], 7:[1], 2:[5], 5:[2], 3:[8], 8:[3], 4:[9], 9:[4], 6:[8] };
let snTarget = null;
function snPool(){ return isPre() ? [1, 2, 3, 4, 5] : (currentCombo().t === 2 ? [2, 3, 4, 5, 7] : [2, 3, 4, 5, 7, 8]); }
function snValid(){ if(snTarget == null || !snPool().includes(snTarget)) snNewTarget(); return snTarget; }
function snNewTarget(){ const pool = snPool(); let t; do{ t = randomItem(pool); } while(t === snTarget && pool.length > 1); snTarget = t; return t; }
function snBuild(){
const t = currentCombo().t, T = snValid();
const N = (isPre() ? [8, 10, 12] : [16, 20, 24])[t], K = (isPre() ? [2, 3, 4] : [4, 5, 6])[t];
const fonts = isPre() ? PRE_SCATTER_FONTS : SCATTER_FONTS, pool = isPre() ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 7, 8];
const look = (SN_LOOK[T] || []).filter(x => pool.includes(x));
const items = [];
for(let k = 0; k < K; k++) items.push({ d:T, tgt:true });
const mirrors = 0;   // ayna ayırt etme Zihinsel Döndürme'de
for(let k = 0; k < mirrors; k++) items.push({ d:T, tgt:false, mirror:true });
while(items.length < N){ const useLook = t > 0 && look.length && Math.random() < 0.45; const d = useLook ? randomItem(look) : randomItem(pool.filter(x => x !== T)); items.push({ d, tgt:false }); }
const rot = isPre() ? [0, 10, 20][t] : [15, 25, 30][t];
return shuffleArray(items).map(x => Object.assign(x, { font: randomItem(fonts), color: randomItem(COLORS), r: Math.round((Math.random() * 2 - 1) * rot), sc: 0.75 + Math.random() * 0.45 }));
}

const QZ_SAFE_SEA = ["fish","dolphin","starfish","turtle","crab","seahorse"];
function qzCats(){
return {
toy:    { n:"oyuncak",        items: TOY_KEYS.map(k => ({ k:"t-" + k, n: TOY_NAMES[k], src: TOY_IMAGES[k] })) },
house:  { n:"ev eşyası",      items: HOUSE_KEYS.map(k => ({ k:"h-" + k, n: HOUSE_NAMES[k], src: HOUSE_IMAGES[k] })) },
meyve:  { n:"meyve",          items: Object.keys(FRUIT_VEG_NAMES).filter(k => FRUIT_VEG_CATEGORY[k] === "meyve").map(k => ({ k:"f-" + k, n: FRUIT_VEG_NAMES[k], src: FRUIT_VEG_IMAGES[k] })) },
sebze:  { n:"sebze",          items: Object.keys(FRUIT_VEG_NAMES).filter(k => FRUIT_VEG_CATEGORY[k] === "sebze" && k !== "tomato").map(k => ({ k:"f-" + k, n: FRUIT_VEG_NAMES[k], src: FRUIT_VEG_IMAGES[k] })) },
wild:   { n:"kara hayvanı",   items: WILD_KEYS.map(k => ({ k:"w-" + k, n: WILD_NAMES[k], src: WILD_IMAGES[k] })) },
sea:    { n:"deniz canlısı",  items: QZ_SAFE_SEA.map(k => ({ k:"s-" + k, n: SEA_NAMES[k], src: SEA_IMAGES[k] })) },
vehicle:{ n:"taşıt",          items: Object.keys(VEHICLE_NAMES).map(k => ({ k:"v-" + k, n: VEHICLE_NAMES[k], src: VEHICLE_IMAGES[k + "_f"] })) }
};
}
const QZ_CLOSE = { meyve:"sebze", sebze:"meyve", wild:"sea", sea:"wild" };
const qzPic = (src, sc) => `<img src="${src}" alt="" style="width:${Math.round((sc || 1) * 100)}%;height:${Math.round((sc || 1) * 100)}%;object-fit:contain">`;
const qzTrials = (post, pre) => isPre() ? pre : post;
const qzOpts = (post, pre) => isPre() ? pre : post;
function qzMake(stim, opts, ans, extra){ const order = shuffleArray(opts.map((o, i) => i)); return Object.assign({ stim, opts: order.map(i => opts[i]), ans: order.indexOf(ans) }, extra || {}); }
const trSyl = (w) => (w.match(/[aeıioöuüâîû]/gi) || []).length;
const QZ_DEFS = { "w-lion":"Yelesi olan, kükreyen büyük bir hayvan.", "w-giraffe":"Boynu çok uzun, benekli bir hayvan.", "w-zebra":"Siyah beyaz çizgili, ata benzeyen bir hayvan.",
"w-monkey":"Ağaçtan ağaca atlayan, muz seven bir hayvan.", "w-bear":"Büyük, tüylü ve bal seven bir hayvan.", "w-fox":"Kabarık kuyruklu, kurnaz bir hayvan.", "w-squirrel":"Fındık toplayan, kabarık kuyruklu küçük bir hayvan.", "w-hedgehog":"Sırtı dikenli küçük bir hayvan.",
"s-fish":"Suda yaşayan, yüzgeçleriyle yüzen bir hayvan.", "s-dolphin":"Denizde yaşayan, sudan zıplamayı seven akıllı bir hayvan.", "s-starfish":"Beş kollu, yıldıza benzeyen bir deniz canlısı.", "s-turtle":"Sırtında kabuğu olan, yavaş yürüyen bir hayvan.", "s-crab":"Yan yan yürüyen, kıskaçlı bir deniz canlısı.", "s-seahorse":"Başı ata benzeyen küçük bir deniz canlısı.",
"f-apple":"Ağaçta yetişen, yuvarlak bir meyve.", "f-banana":"Sarı kabuklu, uzun bir meyve.", "f-grapes":"Salkım salkım olan, küçük taneli bir meyve.", "f-strawberry":"Kırmızı, üstünde minik tohumları olan bir meyve.", "f-orange":"Turuncu renkli, suyu sıkılan bir meyve.",
"f-carrot":"Turuncu renkli, tavşanların sevdiği bir sebze.", "f-cucumber":"Yeşil, uzun ve serin bir sebze.", "f-pepper":"İçi boş, bazen acı olan bir sebze.", "f-broccoli":"Küçük bir ağaca benzeyen yeşil bir sebze.",
"v-bus":"Çok yolcu taşıyan, yolda giden büyük bir taşıt.", "v-plane":"Kanatları olan, gökyüzünde uçan bir taşıt.", "v-ship":"Denizde yüzen büyük bir taşıt.", "v-heli":"Tepesinde dönen pervanesi olan bir taşıt.", "v-fire":"Yangını söndürmeye giden bir taşıt.", "v-train":"Raylarda giden, vagonları olan bir taşıt." };
function qzUseItems(){
return [ { q:"Saçımızı neyle tararız?", src: HOUSE_IMAGES.comb }, { q:"Kâğıdı neyle keseriz?", src: HOUSE_IMAGES.scissors }, { q:"Saatin kaç olduğunu neye bakarak öğreniriz?", src: HOUSE_IMAGES.clock },
{ q:"Karanlıkta odayı neyle aydınlatırız?", src: HOUSE_IMAGES.lamp }, { q:"Uyurken başımızı neye koyarız?", src: HOUSE_IMAGES.pillow }, { q:"Suyu neyle taşırız?", src: HOUSE_IMAGES.bucket },
{ q:"Yeri neyle süpürürüz?", src: HOUSE_IMAGES.broom }, { q:"Çayı neyle içeriz?", src: HOUSE_IMAGES.cup }, { q:"Kapıyı neyle açarız?", src: PAIR_IMAGES.key },
{ q:"Yağmurda ıslanmamak için neyi açarız?", src: PAIR_IMAGES.umbrella }, { q:"Dişlerimizi neyle fırçalarız?", src: PAIR_IMAGES.toothbrush }, { q:"Çiviyi neyle çakarız?", src: PAIR_IMAGES.hammer },
{ q:"Kalemimizi neyle açarız?", src: PAIR_IMAGES.sharpener }, { q:"Çiçekleri neyle sularız?", src: PAIR_IMAGES.wateringcan }, { q:"Telefonu neyle şarj ederiz?", src: PAIR_IMAGES.charger } ];
}
const QZ_ARROW_ROT = { up:0, "up-right":45, right:90, "down-right":135, down:180, "down-left":225, left:270, "up-left":315 };
const qzArrow = (d, col) => arrowSVG("up", col).replace("rotate(0deg)", `rotate(${QZ_ARROW_ROT[d]}deg)`);
/* Ok biçimleri (Okun Yönüne Dokun): hepsi YUKARI çizilir, yön döndürmeyle verilir */
const QZ_ARROW_STYLES = { arrow: null,
  chevron: (c) => `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M22 52 L50 24 L78 52 M22 78 L50 50 L78 78" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  head: (c) => `<svg viewBox="0 0 100 100" width="100%" height="100%"><polygon points="50,10 90,84 50,64 10,84" fill="${c}" stroke="${c}" stroke-width="4" stroke-linejoin="round"/></svg>`,
  hand: (c) => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11V4.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-1.2a6 6 0 0 1-4.6-2.2L4.6 15.4a1.6 1.6 0 0 1 2.4-2.1L10 15V11"/></svg>` };
function qzArrowStyled(d, col, style){ if(!style || style === "arrow" || !QZ_ARROW_STYLES[style]) return qzArrow(d, col); return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;transform:rotate(${QZ_ARROW_ROT[d]}deg)">${QZ_ARROW_STYLES[style](col)}</div>`; }

const QZ_OPP_FACE = { happy:"sad", sad:"happy" };
const QZ = {
"odd-cat": () => { const C = qzCats(), t = currentCombo().t, N = qzOpts([4, 5, 5][t], [3, 4, 4][t]);
return Array.from({length: qzTrials(6, 4)}, () => { const keys = Object.keys(C).filter(k => C[k].items.length >= N - 1); const a = randomItem(keys);
const b = t === 2 && QZ_CLOSE[a] ? QZ_CLOSE[a] : randomItem(keys.filter(k => k !== a && QZ_CLOSE[a] !== k));
const same = shuffleArray(C[a].items).slice(0, N - 1), odd = randomItem(C[b].items);
const opts = same.map(x => qzPic(x.src)).concat([qzPic(odd.src)]);
return qzMake("", opts, opts.length - 1, { prompt:"<b>Gruba uymayan</b> hangisi?", after:`${cap(odd.n)} bir ${C[a].n} değil.` }); }); },
"opp-touch": () => { const t = currentCombo().t, types = isPre() ? ["size","hot","face","length","fill"] : ["size","hot","face","length","fill","position","vertical"];
return Array.from({length: qzTrials(6, 4)}, () => { const ty = randomItem(types); let stim, opts, word;
if(ty === "size"){ const [p, q] = shuffleArray(picPool()).slice(0, 2); word = "büyük"; stim = qzPic(p.src, 1); opts = [qzPic(p.src, 0.45), qzPic(p.src, 1), qzPic(q.src, 1)]; }
else if(ty === "hot"){ const hot = ["soup","iron","sun","fire"], cold = ["snowman","penguin","icecream","ice"]; const h = shuffleArray(hot); word = "sıcak"; stim = qzPic(HOTCOLD_IMAGES[h[0]]); opts = [qzPic(HOTCOLD_IMAGES[randomItem(cold)]), qzPic(HOTCOLD_IMAGES[h[1]]), qzPic(HOTCOLD_IMAGES[h[2]])]; }
else if(ty === "face"){ const f = randomItem(["happy","sad"]); word = f === "happy" ? "mutlu" : "üzgün"; stim = qzPic(FACE_IMAGES[f]); opts = [qzPic(FACE_IMAGES[QZ_OPP_FACE[f]]), qzPic(FACE_IMAGES[f]), qzPic(FACE_IMAGES[randomItem(["surprised","sleepy"])])]; }
else { const st = randomItem(OPPOSITE_STATES[ty]), op = OPPOSITE_STATES[ty].find(x => x !== st), col = randomItem(COLORS), oth = randomItem(Object.keys(OPPOSITE_STATES).filter(k => k !== ty && (!isPre() || ["length","fill"].includes(k))));
word = OPPOSITE_LABELS[st]; stim = oppositeSVG(ty, st, col); opts = [oppositeSVG(ty, op, col), oppositeSVG(ty, st, col), oppositeSVG(oth, randomItem(OPPOSITE_STATES[oth]), col)]; }
if(t === 2 && !isPre()) opts = opts.slice(0, 3);
return qzMake(stim, opts, 0, { prompt:`<b>${cap(word)}</b> · zıttı hangisi?`, say:`${cap(word)}. Zıttı hangisi?` }); }); },
"syl-touch": () => { const t = currentCombo().t, C = qzCats();
const pool = Object.values(C).flatMap(c => c.items).filter(x => !/\s/.test(x.n)).filter(x => { const s = trSyl(x.n); return isPre() ? [s <= 2, s <= 3, s >= 2 && s <= 3][Math.min(t, 2)] : (t === 0 ? s <= 2 : t === 1 ? s <= 3 : s >= 2); });
const max = isPre() ? [2, 3, 3][Math.min(t, 2)] : 4;
const N = qzTrials(6, 4), groups = {}; pool.forEach(x => { const s = Math.min(trSyl(x.n), max); (groups[s] = groups[s] || []).push(x); }); const keys = Object.keys(groups).map(Number); const seq = balancedSeq(N, keys, 2); const used = new Set(); const picks = seq.map(s => { const c = shuffleArray(groups[s]).find(x => !used.has(x.n)) || randomItem(groups[s]); used.add(c.n); return c; });   /* cevaplar (hece sayıları) turda dengeli */
  return picks.map(x => { const s = Math.min(trSyl(x.n), max);
const opts = Array.from({length:max}, (_, i) => `<span style="display:block;white-space:nowrap;line-height:1;font-size:${[18, 15, 12, 10][i]}px">${"👏".repeat(i + 1)}</span><span style="display:block;font-weight:900;font-size:18px;line-height:1.2">${i + 1}</span>`);   // simgeler tek satırda, karta sığacak boyutta
return { stim: qzPic(x.src), opts, ans: s - 1, prompt:"Kaç hece? <b>El çırparak</b> say", say: x.n, replay:true, fixed:true }; }); },
"sim-touch": () => { const C = qzCats(), t = currentCombo().t, N = qzOpts([3, 4, 5][t], [3, 3, 4][t]);
return Array.from({length: qzTrials(6, 4)}, () => { const keys = Object.keys(C); const a = randomItem(keys.filter(k => C[k].items.length >= 3));
const ex = shuffleArray(C[a].items), shown = ex.slice(0, t === 0 ? 2 : 1), ans = ex[t === 0 ? 2 : 1];
const others = shuffleArray(keys.filter(k => k !== a && (t === 2 && !isPre() ? true : QZ_CLOSE[a] !== k))).slice(0, N - 1).map(k => randomItem(C[k].items));
if(t === 2 && !isPre() && QZ_CLOSE[a] && !others.some(o => C[QZ_CLOSE[a]].items.includes(o))) others[0] = randomItem(C[QZ_CLOSE[a]].items);
const opts = [qzPic(ans.src)].concat(others.map(o => qzPic(o.src)));
const stim = `<div style="display:flex;gap:8px;justify-content:center">${shown.map(x => `<div class="wm-card" style="width:92px;height:92px">${qzPic(x.src)}</div>`).join("")}</div>`;
return qzMake(stim, opts, 0, { prompt: shown.length > 1 ? "<b>Bunlara benzeyen</b> hangisi?" : "<b>Buna benzeyen</b> hangisi?", raw:true, after:`İkisi de ${C[a].n}.` }); }); },
"def-touch": () => { const C = qzCats(), t = currentCombo().t, N = qzOpts([3, 4, 5][t], [3, 3, 4][t]);
const all = Object.entries(C).filter(([k]) => ["wild","sea","meyve","sebze","vehicle"].includes(k)).flatMap(([k, c]) => c.items.filter(x => QZ_DEFS[x.k]).map(x => Object.assign({ cat:k }, x)));
return shuffleArray(all).slice(0, qzTrials(6, 4)).map(x => {
const sameCat = all.filter(y => y.cat === x.cat && y.k !== x.k), other = all.filter(y => y.cat !== x.cat);
const dis = shuffleArray(t === 0 ? other : t === 1 ? sameCat.slice(0, 1).concat(other) : sameCat.concat(other)).slice(0, N - 1);
const opts = [qzPic(x.src)].concat(dis.map(d => qzPic(d.src)));
return qzMake("", opts, 0, { prompt:"<b>Dinle</b>, anlatılanı bul", say: QZ_DEFS[x.k], replay:true, showText: !isPre() && t === 2 ? false : false }); }); },
"use-touch": () => { const t = currentCombo().t, N = qzOpts([3, 4, 5][t], [2, 3, 4][t]), items = qzUseItems();
return shuffleArray(items).slice(0, qzTrials(6, 4)).map(x => { const dis = shuffleArray(items.filter(y => y !== x)).slice(0, N - 1);
const opts = [qzPic(x.src)].concat(dis.map(d => qzPic(d.src)));
return qzMake("", opts, 0, { prompt: x.q, say: x.q, replay:true }); }); },
"arrow-touch": () => { const t = currentCombo().t, dirs4 = ["up","down","left","right"], dirs8 = dirs4.concat(["up-left","up-right","down-left","down-right"]);
const dirs = isPre() ? [["left","right"], dirs4, dirs4.concat(["up-left","up-right"])][Math.min(t, 2)] : [dirs4, dirs4.concat(["up-left","up-right"]), dirs8][Math.min(t, 2)];
const nextDir = mkCycle(dirs), nextCol = mkCycle(COLORS), tt = Math.min(t, 2); const nextSty = mkCycle(tt === 0 ? ["arrow"] : ["arrow","chevron","head"]);   /* el emojisi çıkarıldı: parmağın yönü belirsiz */ return Array.from({length: (isPre() ? [4, 5, 6] : [6, 8, 10])[tt]}, () => { const d = nextDir(), col = nextCol(), sty = nextSty(); const opts = dirs.map(x => qzArrow(x, "#5B6B7A")); let stim = qzArrowStyled(d, col, sty);
  if(tt === 2){ /* Zor: ortadaki büyük okun çevresinde başka yönlere bakan küçük gri oklar */ const others = dirs8.filter(x => x !== d); const sm = [0, 1, 2, 3].map(() => qzArrow(randomItem(others), "#B8C2CC")); const cell = (h) => `<div style="width:100%;height:100%">${h}</div>`; stim = `<div style="display:grid;grid-template-columns:1fr 2fr 1fr;grid-template-rows:1fr 2fr 1fr;width:100%;height:100%;align-items:center;justify-items:center"><div style="width:70%;height:70%">${cell(sm[0])}</div><div></div><div style="width:70%;height:70%">${cell(sm[1])}</div><div></div><div style="width:100%;height:100%">${stim}</div><div></div><div style="width:70%;height:70%">${cell(sm[2])}</div><div></div><div style="width:70%;height:70%">${cell(sm[3])}</div></div>`; }
  return { stim, opts, ans: dirs.indexOf(d), prompt: tt === 2 ? "<b>Ortadaki büyük ok</b> hangi yöne bakıyor?" : "Ok <b>hangi yöne</b> bakıyor?", fixed:true }; }); },
"edge-touch": () => { const t = currentCombo().t, sides = isPre() ? [[3, 4], [3, 4, 5], [3, 4, 5]][t] : [[3, 4, 5], [3, 4, 5, 6], [3, 4, 5, 6, 8]][t];
const nextN = mkCycle(sides), nextCol = mkCycle(COLORS); return Array.from({length: qzTrials(6, 4)}, () => { const n = nextN(), col = nextCol(); const rot = t === 0 ? 0 : Math.round(Math.random() * 60 - 30);
const opts = sides.map(x => `<span style="font-size:30px;font-weight:900">${x}</span>`);
return { stim: `<div style="transform:rotate(${rot}deg);width:100%;height:100%">${polygonSVG(n, col)}</div>`, opts, ans: sides.indexOf(n), prompt:"Bu şeklin <b>kaç kenarı</b> var?", fixed:true }; }); },
"odd-touch": () => { const t = currentCombo().t, N = qzOpts([4, 6, 9][t], [3, 4, 6][t]);
return Array.from({length: qzTrials(6, 4)}, () => { const dim = t === 2 && !isPre() ? randomItem(["rot","size","color"]) : randomItem(["shape","color"]);
const sh = dim === "rot" ? randomItem(["star","heart","triangle"]) : randomItem(SHAPES.filter(x => x !== "circle")), col = randomItem(COLORS);   /* KURAL: farklı olan gözle görülür farklı olmalı — dönme farkı yalnız döndürünce değişen şekillerde (dikdörtgen/daire 180° dönünce aynı görünür) */ let oddSh = sh, oddCol = col, rot = 0, sc = 1;
if(dim === "shape") oddSh = randomItem(SHAPES.filter(x => x !== sh)); else if(dim === "color") oddCol = randomItem(COLORS.filter(x => x !== col)); else if(dim === "rot") rot = 180; else sc = 0.7;
const opts = Array.from({length:N}, (_, i) => i === 0 ? `<div style="width:100%;height:100%;transform:rotate(${rot}deg) scale(${sc})">${shapeSVG(oddSh, oddCol)}</div>` : shapeSVG(sh, col));
return qzMake("", opts, 0, { prompt:"<b>Farklı olan</b> hangisi?" }); }); },
"pattern-touch": () => { const t = currentCombo().t;
return Array.from({length: qzTrials(6, 4)}, () => { const cols = shuffleArray(COLORS), shs = shuffleArray(SHAPES);
const units = [ [ [shs[0], cols[0]], [shs[1], cols[1]] ], [ [shs[0], cols[0]], [shs[0], cols[0]], [shs[1], cols[1]] ], [ [shs[0], cols[0]], [shs[1], cols[1]], [shs[2], cols[2]] ] ];
const u = isPre() ? units[t === 2 ? 1 : 0] : units[t];
const len = u.length * 2 + 1, seq = Array.from({length: len}, (_, i) => u[i % u.length]), ans = seq[len - 1];
const shown = seq.slice(0, len - 1).map(([s, c]) => `<div class="wm-card" style="width:44px;height:44px;padding:4px">${shapeSVG(s, c)}</div>`).join("") + `<div class="wm-card" style="width:44px;height:44px;font-weight:900;font-size:24px;border-style:dashed">?</div>`;
const cand = u.map(([s, c]) => s + "|" + c); const extra = [shs[3] + "|" + cols[3]];
const optKeys = Array.from(new Set(cand.concat(extra))).slice(0, isPre() ? 3 : 4);
const opts = optKeys.map(k => { const [s, c] = k.split("|"); return shapeSVG(s, c); });
return { stim: `<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center">${shown}</div>`, opts, ans: optKeys.indexOf(ans[0] + "|" + ans[1]), prompt:"<b>Sırada</b> hangisi var?", raw:true }; }); },
"analogy-touch": () => { const t = currentCombo().t;
return Array.from({length: qzTrials(5, 3)}, () => { const ty = isPre() ? randomItem(["color","size"]) : (t === 2 ? "both" : randomItem(["color","size","shape"]));
const [s1, s2, s3] = shuffleArray(SHAPES.filter(x => x !== "circle")), [c1, c2] = shuffleArray(COLORS);
const f = (s, c, sc) => `<div style="width:100%;height:100%;transform:scale(${sc || 1})">${shapeSVG(s, c)}</div>`;
let A, B, C, D, wrong;
if(ty === "color"){ A = f(s1, c1); B = f(s1, c2); C = f(s2, c1); D = f(s2, c2); wrong = [f(s2, c1), f(s1, c2)]; }
else if(ty === "size"){ A = f(s1, c1, 1); B = f(s1, c1, 0.55); C = f(s2, c2, 1); D = f(s2, c2, 0.55); wrong = [f(s2, c2, 1), f(s1, c1, 0.55)]; }
else if(ty === "shape"){ A = f(s1, c1); B = f(s3, c1); C = f(s2, c2); D = f(s3, c2); wrong = [f(s2, c2), f(s3, c1)]; }
else { A = f(s1, c1, 1); B = f(s1, c2, 0.55); C = f(s2, c1, 1); D = f(s2, c2, 0.55); wrong = [f(s2, c2, 1), f(s2, c1, 0.55)]; }
const card = (h) => `<div class="wm-card" style="width:62px;height:62px;padding:5px">${h}</div>`;
const stim = `<div style="display:flex;align-items:center;gap:6px;justify-content:center;flex-wrap:wrap">${card(A)}<b>→</b>${card(B)}<span style="width:14px"></span>${card(C)}<b>→</b><div class="wm-card" style="width:62px;height:62px;font-weight:900;font-size:26px;border-style:dashed">?</div></div>`;
const opts = [D].concat(wrong).slice(0, isPre() ? 3 : 3);
return qzMake(stim, opts, 0, { prompt:"İlk ikili gibi: <b>soru işaretine</b> hangisi gelir?", raw:true }); }); }
};
QZ["sem-decide"] = () => semTrials(); QZ["pk-shadow"] = () => geTrials(); QZ["listen-answer"] = () => laTrials(); QZ["sent-pic"] = () => spTrials(); QZ["sent-verify"] = () => svTrials(); QZ["syl-blend"] = () => sbTrials(); QZ["wh-scene"] = () => whTrials(); QZ["paper-fold"] = () => pfTrials(); QZ["view-from"] = () => vfTrials(); QZ["cause-effect"] = () => ceTrials(); QZ["num-pattern"] = () => npTrials(); QZ["opp-touch"] = () => oppTrials2(); QZ["pattern-touch"] = () => patTrials2(); QZ["analogy-touch"] = () => anaTrials2(); QZ["matrix-fill"] = () => mxTrials(); QZ["balance"] = () => balTrials(); QZ["mental-rot"] = () => mrTrials(); QZ["overlap-count"] = () => ovTrials(); QZ["embedded"] = () => embTrials(); QZ["closure"] = () => clsTrials(); QZ["vanalogy-touch"] = () => anlTrials(); QZ["word-pic"] = () => wpTrials(); QZ["proverb-touch"] = () => pmcBuild(); QZ["absurd-touch"] = () => absBuild(); QZ["concept-touch"] = () => cpTrials(); QZ["infer-touch"] = () => imcBuild(); QZ["rhyme-touch"] = () => rhBuild(); QZ["syn-touch"] = () => synBuild(); QZ["part-whole"] = () => pwBuild();
function cupsApply(){ const st = mtState, tr = st.trials[st.ti], box = document.getElementById("cupsBox"); if(!box) return; const dur = Math.round(tr.ms * 0.8 * (window.__wmSpeed || 1)) + "ms"; const ball = box.querySelector(".cup-ball"); if(ball){ ball.style.transition = `left ${dur} ease-in-out, opacity ${st.lift ? "120ms" : "0ms"} linear`; ball.style.opacity = st.lift ? "1" : "0"; void ball.offsetWidth; ball.style.left = `calc(${((st.slot.indexOf(tr.ball) + 0.5) * 100 / tr.n).toFixed(3)}% - ${ball.offsetWidth / 2}px)`; }
box.querySelectorAll("[data-cup]").forEach(el => { const c = +el.dataset.cup; el.style.left = `calc(${((st.slot.indexOf(c) + 0.5) * 100 / tr.n).toFixed(3)}% - ${el.offsetWidth / 2}px)`; el.style.transform = st.lift && c === tr.ball ? "translateY(-46px)" : "translateY(0)"; el.style.transitionDuration = dur; el.style.transitionTimingFunction = "ease-in-out"; el.style.transitionProperty = "left, transform"; }); }
function rlInner(light){ const im = gimg(light === "green" ? "tlGreen" : "tlRed"); const t = light === "green" ? "Koş!" : "Dur!"; return im ? `<img src="${im}" alt=""><b>${t}</b>` : t; }
function rlPaint(){ const st = mtState, l = document.getElementById("rlLight"); if(l){ l.className = "rl-light " + st.light + (gimg("tlRed") ? " gi" : ""); l.innerHTML = rlInner(st.light); } }
function rlFlash(){ sayTask("Yakalandın!"); const a = document.getElementById("rlTrack"); if(a){ a.classList.remove("caught"); void a.offsetWidth; a.classList.add("caught"); } }
function escPaint(){ const st = mtState, svg = document.getElementById("escSvg"); if(!svg || st.kind !== "esc"){ renderMtBoard(); return; } const n = st.n, c = Number(svg.dataset.c);
const ctr = (i) => [((i % n) + 0.5) * c, (Math.floor(i / n) + 0.5) * c];
const [px, py] = ctr(st.pos), me = svg.querySelector("#escMe"); if(me){ me.setAttribute("cx", px); me.setAttribute("cy", py); }
st.cl.forEach((k, j) => { const t = svg.querySelector("#escCl" + j); if(t){ const [x, y] = ctr(k); if(t.tagName.toLowerCase() === "g") t.setAttribute("transform", `translate(${x},${y})`); else { t.setAttribute("x", x); t.setAttribute("y", y + c * 0.18); } } });
const s0 = svg.querySelector('[data-mt="0"]'); if(s0) s0.setAttribute("fill", st.flash ? "#FCE3E3" : "transparent"); }
function escHit(){ const st = mtState; mtErr(); st.pos = 0; st.flash = true; setTimeout(() => { st.flash = false; }, 400); sayTask("Bulut! Baştan başla."); }
function molDraw(){ const st = mtState, g = document.getElementById("pkMoles"); if(!g) return; g.querySelectorAll(".pk-hole").forEach((h, k) => { const on = st.cur && st.cur.h === k;
h.innerHTML = gimg("mole") ? `<img class="pk-mimg${on && st.cur.hit ? " hit" : ""}${on ? " up" : ""}" src="${on ? gimg(st.cur.hat ? "moleHat" : "mole") : gimg("hole")}" alt="">` : (on ? `<div class="pk-mole${st.cur.hit ? " hit" : ""}">${st.cur.hat ? `<span class="pk-hat"></span>` : ""}<span class="pk-eye l"></span><span class="pk-eye r"></span><span class="pk-nose"></span></div>` : ""); });
const hd = document.getElementById("pkScore"); if(hd) hd.textContent = st.score; }
function smnFlash(k, ms){ const st = mtState; try{ toneBeep(TONE_KEYS[k % 4].f + (k >= 4 ? 120 : 0)); }catch(e){} const el = document.querySelector(`[data-pad="${k}"]`); if(el){ el.classList.add("lit"); setTimeout(() => el.classList.remove("lit"), ms * (window.__wmSpeed || 1)); } }
function smnRound(){ const st = mtState, c = st.cfg; if(st.seq.length >= c.target){ st.phase = "done"; mtFinish(` En uzun dizi: ${st.score}`); return; }
st.seq.push(Math.floor(Math.random() * st.pads)); st.pos = 0; st.phase = "play"; renderMtBoard();
st.seq.forEach((k, j) => mtLater(() => smnFlash(k, c.ms * 0.7), 500 + j * c.ms)); mtLater(() => { st.phase = "input"; renderMtBoard(); }, 500 + st.seq.length * c.ms); }
function stopResp(d){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "go") return; if(tr.stop && st.red){ mtErr(); } else if(tr.stop && !st.red){ /* dur işaretinden önce basıldı: geçerli yanıt sayılır */ if(d !== tr.dir) mtErr(); else gameSfx("correct"); } else if(d !== tr.dir) mtErr(); else gameSfx("correct");
st.phase = "fb"; renderMtBoard(); mtLater(NEW_MT.next, 350); }
function rhyEval(){ const st = mtState, tr = st.trials[st.ti], T = st.taps; let ok = T.length === tr.L;
if(ok && tr.L > 1){ const d = T.slice(1).map((x, i) => x - T[i]), mn = Math.min(...d), cat = d.map(x => x > mn * 1.45 ? 2 : 1); ok = cat.every((c, i) => c === tr.iv[i]); }
if(ok) gameSfx("correct"); else mtErr(); st.last = ok; st.phase = "fb"; renderMtBoard(); mtLater(NEW_MT.next, ok ? 700 : 1500); }
function qzStart(){ const st = mtState; st.phase = "ask"; st.pick = null; renderMtBoard(); const tr = st.trials[st.ti]; if(tr.say) mtLater(() => sayTask(tr.say, 0.85), 250); }
function qzTap(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "ask") return; st.pick = i; st.phase = "fb";
const ok = i === tr.ans; if(ok) gameSfx("correct"); else mtErr(); renderMtBoard();
if(!ok && tr.after) mtLater(() => sayTask(tr.after), 300);
mtLater(() => { st.ti++; if(st.ti >= st.trials.length){ mtFinish(); return; } qzStart(); }, ok ? 600 : 1500); }
/* Art arda iki soruda doğru cevap aynı konumdaysa (%75 olasılıkla) ikincisinin konumunu kaydır: konum öngörülebilir olmasın */
const QZ_SPREAD_SKIP = new Set(["arrow-touch","edge-touch","overlap-count","syl-touch","balance","sem-decide","absurd-touch","rhyme-touch","sent-verify"]);   // seçenek sırası anlamlı: Evet/Hayır, sayılar, yönler
/* Seçenek sayısı düzeyle büyür (Okul Öncesi 3-3-4, Okul Sonrası 3-4-5): fazlası atılır, eksiği aynı turdan ya da yakın sayılarla tamamlanır */
const QZ_D = { pre:[3,3,4], post:[3,4,5] }, QZ_D2 = { pre:[3,4,4], post:[3,4,5] };
const QZ_TIER_OPTS = { "pattern-touch":QZ_D, "analogy-touch":QZ_D, "pk-shadow":QZ_D, "matrix-fill":QZ_D, "closure":QZ_D, "syl-blend":QZ_D, "embedded":QZ_D, "proverb-touch":QZ_D, "infer-touch":QZ_D, "listen-answer":QZ_D,
  "opp-touch":{ pre:[3,3,4] }, "mental-rot":{ pre:[3,3,4] }, "word-pic":{ post:[3,4,5] }, "syl-touch":{ post:[3,4,5] }, "balance":{ post:[3,4,4] },
  "paper-fold":QZ_D2, "num-pattern":QZ_D2, "overlap-count":QZ_D2, "concept-touch":{ pre:[2,3,3], post:[2,3,4], capOnly:true }, "view-from":{ post:[2,3,4], capOnly:true } };
function qzTierOpts(id, trials){ const cfg = QZ_TIER_OPTS[id]; if(!cfg || !Array.isArray(trials)) return trials; const tab = isPre() ? cfg.pre : cfg.post; if(!tab) return trials; const want = tab[Math.min(currentCombo().t, 2)];
  const plain = (o) => String(o).replace(/<[^>]+>/g, "").trim(); const numVal = (o) => { const m = plain(o).match(/^(?:👏\s*)*(\d+)$/); return m ? +m[1] : NaN; }; const isNum = (q) => q.opts.every(o => !isNaN(numVal(o))); const ordinal = (q) => q.opts.every(o => /^[\d\s👏]+$/.test(plain(o)) && plain(o) !== "");
  const poolAll = []; trials.forEach(q => (q && q.opts || []).forEach(o => { if(!poolAll.includes(o)) poolAll.push(o); }));
  trials.forEach(q => { if(!q || !Array.isArray(q.opts) || q.ans == null || q.ans < 0) return; const ansHtml = q.opts[q.ans]; let opts = q.opts.slice();
    if(opts.length > want){ const wrong = opts.map((o, i) => i).filter(i => i !== q.ans); const drop = new Set(shuffleArray(wrong).slice(0, opts.length - want)); opts = opts.filter((o, i) => !drop.has(i)); }
    else if(opts.length < want && !cfg.capOnly){
      if(isNum(q)){ const a = numVal(ansHtml), have = new Set(opts.map(numVal)), cands = []; for(let d = 1; d <= 6; d++) [a + d, a - d].forEach(v => { if(v >= 1 && !have.has(v) && !cands.includes(v)) cands.push(v); });
        const bare = String(ansHtml).trim() === plain(ansHtml); const claps = (String(ansHtml).match(/👏/g) || []).length; const tmpl = (v) => bare ? String(v) : String(ansHtml).replace(new RegExp(">(\\s*)" + a + "(\\s*)<"), ">$1" + v + "$2<").replace("👏".repeat(claps), "👏".repeat(claps ? v : 0));
        while(opts.length < want && cands.length) opts.push(tmpl(cands.shift())); }
      else if(!ordinal(q)){ const seen = new Set(opts.map(qzOptKey)); const cands = shuffleArray(poolAll.filter(o => !seen.has(qzOptKey(o)) && plain(o) !== plain(ansHtml) || (!plain(o) && !seen.has(qzOptKey(o))))); for(const o of cands){ if(opts.length >= want) break; if(seen.has(qzOptKey(o))) continue; opts.push(o); seen.add(qzOptKey(o)); }   /* resimli seçenek resmine göre karşılaştırılır (döndürülmüş aynı resim ikinci kez gelmez) */ if(opts.length < want && /src="[^"]+"/.test(String(ansHtml))){ const used = new Set(poolAll.concat(opts).map(o => (String(o).match(/src="([^"]+)"/) || [])[1]).filter(Boolean)); for(const pp of shuffleArray(picPool())){ if(opts.length >= want) break; if(!pp || !pp.src || used.has(pp.src)) continue; const h = String(ansHtml).replace(/src="[^"]+"/, `src="${pp.src}"`); if(!seen.has(qzOptKey(h))){ opts.push(h); seen.add(qzOptKey(h)); used.add(pp.src); } } }   /* resimli seçenek: ödünç bulunamazsa resim havuzundan */ if(opts.length < want && id === "closure" && /^<svg/.test(String(ansHtml))){ const fill = (String(ansHtml).match(/fill="([^"]+)"/) || [])[1] || "#2E6FD8"; const extra = [`<rect x="8" y="8" width="84" height="84" fill="${fill}"/>`, `<polygon points="50,4 96,50 50,96 4,50" fill="${fill}"/>`, `<polygon points="27,8 73,8 96,50 73,92 27,92 4,50" fill="${fill}"/>`, `<ellipse cx="50" cy="50" rx="46" ry="30" fill="${fill}"/>`].map(x => `<svg viewBox="0 0 100 100">${x}</svg>`); for(const h of shuffleArray(extra)){ if(opts.length >= want) break; const tag = h.match(/<(rect|polygon points="[^"]+"|ellipse)/)[0]; if(opts.some(o => String(o).includes(tag)) || seen.has(h)) continue; opts.push(h); seen.add(h); } }   /* Görsel Tamamlama: aynı renkte yedek şekiller */ const order = shuffleArray(opts.map((o, i) => i)); opts = order.map(i => opts[i]); } }
    if(isNum({ opts })) opts.sort((x, y) => numVal(x) - numVal(y));   /* sayısal seçenekler hep küçükten büyüğe */
    q.opts = opts; q.ans = opts.indexOf(ansHtml); });
  return trials; }
function qzSpreadAns(trials){ try{ if(QZ_SPREAD_SKIP.has(currentExercise().id)) return trials; for(let i = 1; i < trials.length; i++){ const q = trials[i], p = trials[i-1]; const plain = q && q.opts ? q.opts.map(o => String(o).replace(/<[^>]+>/g, "").trim()) : []; if(plain.length && plain.every(x => /^[\d\s👏]*$/.test(x))) continue; if(!q || !p || q.fixedPos || q.ans == null || p.ans == null || q.ans !== p.ans || q.opts.length < 3 || Math.random() > 0.75) continue; const j = (q.ans + 1 + Math.floor(Math.random() * (q.opts.length - 1))) % q.opts.length; [q.opts[q.ans], q.opts[j]] = [q.opts[j], q.opts[q.ans]]; q.ans = j; } }catch(e){} return trials; }
/* Karıştırılmış döngü: havuzdaki her öğe bir kez gelmeden tekrar etmez (geri koyarak seçimin yerine) */
function mkCycle(arr){ let order = shuffleArray(arr), i = 0, lastV = null; return () => { if(i >= order.length){ order = shuffleArray(arr); i = 0; if(order.length > 1 && order[0] === lastV){ order.push(order.shift()); } } lastV = order[i++]; return lastV; }; }
function qzRender(st, W, H, isLs){
const tr = st.trials[Math.min(st.ti, st.trials.length - 1)], dots = `<div class="wm-dots">${st.trials.map((x, i) => `<i class="${i < st.ti ? "on" : ""}${st.warmN && i < st.warmN ? " w" : ""}"></i>`).join("")}${st.warmN && st.ti < st.warmN && st.phase !== "idle" && st.phase !== "done" ? `<span class="qz-warm in">${icI("sprout", 15, "#1B7A3D")} Isınma</span>` : ""}</div>`;
if(st.phase === "idle") return { info:"▶ Başlat'a bas", body: dots };
if(st.phase === "done") return { info:"Bitti!", body: dots };
const stimH = tr.stim && tr.stimBig ? `<div class="wm-card" style="width:${Math.min(isLs ? H - 30 : 220 * tabletScale() * (window._fitK || 1), W * 0.6)}px;height:${Math.min(isLs ? H - 30 : 220 * tabletScale() * (window._fitK || 1), W * 0.6)}px;margin:0 auto 8px;padding:6px">${tr.stim}</div>` : tr.stim ? (tr.raw ? `<div style="margin:2px 0 8px">${tr.stim}</div>` : `<div class="wm-card" style="width:${Math.min(isLs ? H * 0.5 : 130 * tabletScale() * (window._fitK || 1), W * 0.4)}px;height:${Math.min(isLs ? H * 0.5 : 130 * tabletScale() * (window._fitK || 1), W * 0.4)}px;margin:0 auto 8px;padding:6px">${tr.stim}</div>`) : "";
const replay = tr.replay ? `<button type="button" class="wm-btn diff qz-replay" data-mtbtn="qz-replay">🔊 Bir daha dinle</button>` : "";
/* KURAL (resimli seçenekler, 2026-11-06): yalnız resimden oluşan seçenekler (Cümle–Resim, Kavram, Sözcük–Resim gibi) ekranda kalan yere göre büyür — çalışırken tahtanın altındaki boş alan da kullanılır, hücre 260 noktaya kadar çıkabilir; sütun sayısı resimler en büyük olacak biçimde seçilir */
    const picOpts = !tr.text && tr.opts.length > 0 && tr.opts.every(o => /<img/.test(String(o && o.html != null ? o.html : o)));
    let qH = isLs ? H - 40 : Math.max(120, H - (tr.stim ? (tr.raw ? 120 : 150) : 30) - (tr.replay ? 50 : 0));
    if(picOpts && !isLs){ try{ const bd = document.getElementById("board"); if(bd && timerRunning){ const avail = Math.floor(window.innerHeight - bd.getBoundingClientRect().top - 44 - 64 - (tr.stim ? (tr.raw ? 110 : 160) : 0) - (tr.replay ? 62 : 0)); if(avail > qH) qH = avail; } }catch(e){} }
    if(picOpts && !isLs && window._zaPicH && window._zaPicHK === zaFitKey()) qH = Math.max(qH, window._zaPicH); /* ilk çizimden sonra ölçülen gerçek boş alan */
    const n = tr.opts.length, d = picOpts ? zaPicDims(n, isLs ? W * (tr.stim ? 0.55 : tr.replay ? 0.7 : 0.9) : W, qH, 260 * (window._fitK || 1)) : wmGridDims(n, isLs ? W * (tr.stim ? 0.55 : tr.replay ? 0.7 : 0.9) : W, qH, (tr.cell || (tr.fixed ? 80 : 120)) * (window._fitK || 1));   /* yer varsa seçenek resimleri 120 noktaya kadar büyür */
const grid = tr.text ? `<div class="qz-txt-grid" style="grid-template-columns:repeat(${n % 2 ? 1 : 2}, minmax(0, 1fr))">` /* KURAL (yazılı seçenekler, 2026-11-04): tek sayıda (3, 5) yazılı seçenek tek sütunda alt alta dizilir — 2 sütunda son satır eksik kalıyor ve doğru cevap sağ sütuna yalnız üçte bir düşüyordu; çift sayıda seçenek 2 sütun */ + tr.opts.map((o, i) => { const mk = st.phase === "fb" ? (i === tr.ans ? " ok" : (i === st.pick ? " bad" : "")) : "";
return `<div class="wm-pic qz-txt${mk}" data-mt="${i}">${o}</div>`; }).join("") + `</div>`
: `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + tr.opts.map((o, i) => {
const mk = st.phase === "fb" ? (i === tr.ans ? " ok" : (i === st.pick ? " bad" : "")) : "";
return `<div class="wm-pic${mk}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;padding:6px;flex-direction:column">${o}</div>`; }).join("") + `</div>`;
const body = dots + (isLs && (tr.stim || tr.replay) ? `<div style="display:flex;gap:16px;align-items:center;justify-content:center"><div>${stimH}${replay}</div>${grid}</div>` : stimH + replay + grid);
return { info: tr.prompt, body };
}
function szBuild(){ const t = currentCombo().t, N = (isPre() ? [3, 4, 4] : [3, 4, 5])[t], close = t === 2;
return Array.from({length: qzTrials(5, 3)}, () => { const p = randomItem(picPool()), base = close ? 0.5 : 0.35, step = (1 - base) / (N - 1);
const sizes = Array.from({length:N}, (_, i) => +(base + step * i).toFixed(2)); return { src: p.src, sizes, order: shuffleArray(sizes.map((s, i) => i)) }; }); }




const MOVES = ["alkışla","elini kaldır","masaya vur","zıpla","başına dokun","ayağını yere vur","kollarını aç","yere otur"];
function moveTrials(){ const t = currentCombo().t, L = (isPre() ? [2, 3, 4] : [3, 4, 5])[t];
return Array.from({length: isPre() ? 3 : 4}, () => { let seq; do{ seq = shuffleArray(MOVES.map((m, i) => i)).slice(0, L); } while(seq.slice(0, -1).includes(7)); return seq; }); }   // "yere otur" yalnızca sonda
const STORY_SEQ_TEXT = [ ["Çocuk koşarken düştü.","Annesi ona yardım etti.","Çocuk kalkıp yine koşmaya başladı."],
["Kız elmayı yıkadı.","Elmayı yedi.","Elmanın koçanını çöpe attı."],
["Çocuk saksıya tohum ekti.","Tohumu suladı.","Saksıda bir çiçek açtı."],
["Çocuk dişlerini fırçaladı.","Yatağına girdi.","Uyudu."] ];
function storyOrderTrials(){ const t = currentCombo().t, ids = shuffleArray([0, 1, 2, 3]).slice(0, isPre() ? 2 : 3);
return ids.map(si => { const cards = [0, 1, 2].map(k => ({ si, k }));
if(!isPre() && t === 2){ const o = randomItem([0, 1, 2, 3].filter(x => x !== si)); cards.push({ si: o, k: Math.floor(Math.random() * 3), extra:true }); }
return { si, cards: shuffleArray(cards), given: isPre() && t === 0 ? 1 : 0 }; }); }
const WHATDO = [
{ img:0, q:"Yağmur yağıyor, çocuk ıslanıyor. Ne yapmalı?", a:"Şemsiye açmalı ya da kapalı bir yere girmeli.", why:"Islanıp üşümemek, hasta olmamak için." },
{ img:6, q:"Yerde çöpler var. Ne yapmalısın?", a:"Toplayıp çöp kutusuna atmalı.", why:"Ortalık temiz kalsın; kimse kayıp düşmesin." },
{ img:2, q:"Ayakkabının bağcığı çözülmüş. Ne yapmalı?", a:"Bağcığını bağlamalı ya da yardım istemeli.", why:"Bağcığa basıp düşmemek için." },
{ img:1, q:"Süt yere döküldü. Ne yapmalısın?", a:"Bardağı kaldırıp bezle silmeli ya da bir büyüğe söylemeli.", why:"Kimse kaymasın, yer temiz olsun." },
{ img:3, q:"Oyuncak araba kırıldı. Ne yapmalısın?", a:"Parçaları toplayıp bir büyüğe göstermeli; birlikte tamir etmeyi denemeli.", why:"Küçük parçalar kaybolmasın, kimse yaralanmasın." },
{ img:7, q:"Bebek ağlıyor. Ne yapmalısın?", a:"Annesine ya da bir büyüğe haber vermeli.", why:"Bebeğin bir ihtiyacı olabilir; ona büyükler bakar." },
{ img:5, q:"Arkadaşın düştü, dizi acıyor. Ne yapmalısın?", a:"Nasıl olduğunu sormalı, bir büyüğe haber vermeli.", why:"Yarası temizlenmeli; yardım gerekebilir." },
{ img:4, q:"Kapı zili çaldı, evde bir büyük var. Ne yapmalısın?", a:"Kapıyı kendisi açmamalı, bir büyüğe haber vermeli.", why:"Kapıdakini tanımıyor olabiliriz; güvenlik için." }
];
function whatdoTrials(){ const t = currentCombo().t, N = (isPre() ? [3, 4, 5] : [4, 5, 6])[t];
const pool = isPre() ? (t === 0 ? WHATDO.slice(0, 4) : WHATDO) : WHATDO; return shuffleArray(pool).slice(0, N); }

const FLU_CATS = { pre:[ { k:"hayvan", n:"HAYVANLAR", say:"Bildiğin hayvanları söyle." }, { k:"yiyecek", n:"YİYECEKLER", say:"Yenebilen şeylerden olabildiğince çok söyle." }, { k:"oyuncak", n:"OYUNCAKLAR", say:"Bildiğin oyuncakları söyle." },
    { k:"meyve", n:"MEYVELER", say:"Bildiğin meyveleri söyle." }, { k:"giysi", n:"GİYSİLER", say:"Giyebileceğin şeylerden olabildiğince çok söyle." }, { k:"tasit", n:"TAŞITLAR", say:"Bildiğin taşıtları söyle." }, { k:"vucut", n:"VÜCUDUMUZ", say:"Vücudumuzun bölümlerini söyle." },
    { k:"sebze", n:"SEBZELER", say:"Bildiğin sebzeleri söyle." }, { k:"mutfak", n:"MUTFAK EŞYALARI", say:"Mutfakta bulunan eşyaları söyle." }, { k:"okul", n:"OKULDA", say:"Okulda bulunan şeyleri söyle." } ],
  post:[ { k:"hayvan", n:"HAYVANLAR", say:"Bildiğin bütün hayvanları söyle." }, { k:"yiyecek", n:"YİYECEKLER", say:"Bildiğin bütün yiyecekleri söyle." }, { k:"giysi", n:"GİYSİLER", say:"Bildiğin bütün giysileri söyle." }, { k:"esya", n:"EVDEKİ EŞYALAR", say:"Evde bulunan eşyaları söyle." },
    { k:"meyve", n:"MEYVELER", say:"Bildiğin bütün meyveleri söyle." }, { k:"sebze", n:"SEBZELER", say:"Bildiğin bütün sebzeleri söyle." }, { k:"tasit", n:"TAŞITLAR", say:"Bildiğin bütün taşıtları söyle." }, { k:"spor", n:"SPOR DALLARI", say:"Bildiğin bütün spor dallarını söyle." }, { k:"icecek", n:"İÇECEKLER", say:"Bildiğin bütün içecekleri söyle." },
    { k:"meslek", n:"MESLEKLER", say:"Bildiğin bütün meslekleri söyle." }, { k:"muzik", n:"MÜZİK ALETLERİ", say:"Bildiğin bütün müzik aletlerini söyle." }, { k:"deniz", n:"DENİZ CANLILARI", say:"Denizde yaşayan canlıları söyle." }, { k:"mutfak", n:"MUTFAK ALETLERİ", say:"Mutfakta kullanılan aletleri söyle." }, { k:"kus", n:"KUŞLAR", say:"Bildiğin bütün kuşları söyle." } ] };
const FLU_CAT_TIER = { pre:[["hayvan","yiyecek","oyuncak"], ["meyve","giysi","tasit","vucut"], ["sebze","mutfak","okul"]], post:[["hayvan","yiyecek","giysi","esya"], ["meyve","sebze","tasit","spor","icecek"], ["meslek","muzik","deniz","mutfak","kus"]] }; // geniş kategori kolay, dar kategori zor
const FLU_LETTERS = { pre:[["K","B","A","M"], ["S","T","D","E"], ["Ç","Y","H"]], post:[["K","S","B","A","T"], ["M","D","Y","E","G"], ["Ç","H","O","İ","F","Z"]] };   // sık başlayan sesler kolay, seyrek olanlar zor
const FLU_SWITCH_PRE_POOL = [ [ [["HAYVAN","hayvan"],["YİYECEK","yiyecek"]], [["OYUNCAK","oyuncak"],["MEYVE","meyve"]], [["RENK","renk"],["TAŞIT","taşıt"]] ], [ [["RENK","renk"],["HAYVAN","hayvan"]], [["MEYVE","meyve"],["GİYSİ","giysi"]], [["TAŞIT","taşıt"],["YİYECEK","yiyecek"]] ], [ [["HAYVAN","hayvan"],["YİYECEK","yiyecek"],["RENK","renk"]], [["MEYVE","meyve"],["OYUNCAK","oyuncak"],["TAŞIT","taşıt"]], [["GİYSİ","giysi"],["HAYVAN","hayvan"],["RENK","renk"]] ] ];
const FLU_SWITCH_POOL = [ [ [["HAYVAN","hayvan"],["YİYECEK","yiyecek"]], [["MEYVE","meyve"],["TAŞIT","taşıt"]], [["GİYSİ","giysi"],["SPOR","spor dalı"]], [["MESLEK","meslek"],["RENK","renk"]] ], [ [["MEYVE","meyve"],["GİYSİ","giysi"]], [["MESLEK","meslek"],["HAYVAN","hayvan"]], [["ŞEHİR","şehir"],["YİYECEK","yiyecek"]], [["ÇİÇEK","çiçek"],["EŞYA","ev eşyası"]] ], [ [["HAYVAN","hayvan"],["YİYECEK","yiyecek"],["TAŞIT","taşıt"]], [["MESLEK","meslek"],["MEYVE","meyve"],["GİYSİ","giysi"]], [["ŞEHİR","şehir"],["SPOR","spor dalı"],["HAYVAN","hayvan"]] ] ];
let fluSwPick = {}, fluSwAt = 0;
function fluSwitchSet(force){ const pre = isPre(), t = currentCombo().t, k = (pre ? "pre" : "post") + t, pool = (pre ? FLU_SWITCH_PRE_POOL : FLU_SWITCH_POOL)[t]; if(force && Date.now() - fluSwAt < 400) force = false;   /* aynı açılışta ikinci çağrı yeniden seçmez */
if(force) fluSwAt = Date.now(); if(force || fluSwPick[k] == null){ let i, g = 0; do{ i = Math.floor(Math.random() * pool.length); g++; } while(g < 10 && i === fluSwPick[k]); fluSwPick[k] = i; } return pool[fluSwPick[k]]; }
/* FLU_SWITCH_PRE: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
/* FLU_SWITCH: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
let fluTarget = {};
function fluSecs(fid){ if(fid === "alt-uses") return (isPre() ? [45, 60, 60] : [60, 90, 90])[currentCombo().t]; return (isPre() ? [30, 45, 60] : [45, 60, 60])[currentCombo().t]; }
function fluPick(fid, force){
const lvl = isPre() ? "pre" : "post", t = currentCombo().t, key = fid + "|" + lvl + "|" + t;
const pool = fid === "flu-cat" ? FLU_CAT_TIER[lvl][Math.min(t, 2)] : fid === "flu-letter" ? (isPre() ? FLU_LETTERS.pre : FLU_LETTERS.post)[Math.min(t, 2)] : fid === "alt-uses" ? ALT_BY_TIER[Math.min(t, 2)] : [0];
const visit = fluTarget[key + "@"] !== window.__navSerial; if(visit) fluTarget[key + "@"] = window.__navSerial;   /* sayfaya her girişte yeni öge; sayfa içinde sabit */
if(force || visit || !pool.includes(fluTarget[key])){ let v; do{ v = randomItem(pool); } while(pool.length > 1 && v === fluTarget[key]); fluTarget[key] = v; }
return fluTarget[key];
}
function fluPrompt(fid){
const tg = fluPick(fid);
if(fid === "flu-cat"){ const c = FLU_CATS[isPre() ? "pre" : "post"].find(x => x.k === tg); return { big: c.n, say: c.say }; }
if(fid === "alt-uses"){ const o = ALT_OBJ().find(x => x.n === tg); const cx = altCtx(), cs = cx ? cx + " " : "";   /* bağlam kısıtı: Orta evde, Zor kampta/okulda/parkta */
return { big: o.n.toLocaleUpperCase("tr-TR"), img: o.src, say: `${cap(o.n)} ${cs}başka ne işe yarar?`,   /* kısa soru; yan kullanımlar da sayılır */ sub: `${cs}başka ne işe yarar?` }; }
if(fid === "flu-letter") return isPre() ? { big: tg, say:`${tg} sesiyle başlayan kelimeler bulalım.`, sub:"sesiyle başlayan kelimeler" } : { big: tg, say:`${tg} harfiyle başlayan olabildiğince çok kelime söyle.`, sub:"harfiyle başlayan kelimeler" };
const sw = fluSwitchSet(); return { big: sw.map(x => x[0]).join(" – "), say:`Sırayla bir ${sw.map(x => x[1]).join(", bir ")} söyle.`, sw };
}
const GS_BANK = { hayvan:["kedi","köpek","tavşan","kuş","inek","at","aslan"], meyve:["elma","muz","çilek","armut","kiraz","üzüm"], sebze:["havuç","patates","soğan","salatalık","ıspanak"],
"taşıt":["araba","otobüs","tren","uçak","gemi","bisiklet"], giysi:["ceket","çorap","şapka","etek","pantolon","kazak"], mutfak:["kaşık","tabak","çatal","tencere","bardak"] };
const GS_PLURAL = { hayvan:"hayvanlar", meyve:"meyveler", sebze:"sebzeler", "taşıt":"taşıtlar", giysi:"giysiler", mutfak:"mutfak eşyaları" };
function gsBuild(){ const t = currentCombo().t, spec = isPre() ? [[2, 3], [3, 3], [3, 4]][t] : [[3, 3], [4, 3], [3, 4]][t];
let cats = shuffleArray(isPre() ? ["hayvan","meyve","taşıt","giysi"] : Object.keys(GS_BANK).filter(k => k !== "sebze"));
cats = cats.slice(0, spec[0]); if(!isPre() && t === 2){ cats = ["meyve","sebze"].concat(cats.filter(c => c !== "meyve").slice(0, 1)); }
const groups = cats.map(c => ({ c, w: shuffleArray(GS_BANK[c]).slice(0, spec[1]) }));
let flat; do{ flat = shuffleArray(groups.flatMap(g => g.w.map(w => ({ w, c: g.c })))); } while(flat.some((x, i) => i && flat[i - 1].c === x.c) && Math.random() < 0.97);
return [{ groups, flat }];
}
function gsRender(items){ const L = items[0], total = L.flat.length; let ok = 0; L.groups.forEach((g, gi) => g.w.forEach((w, i) => { if(ckMarks[gi + ":" + i]) ok++; }));
return `<div class="aud-list"><div class="aud-note">Kelimeleri okuyun; çocuk <b>hangilerinin birlikte olduğunu</b> gruplar hâlinde söylesin. Bu bir bellek çalışması değil: kelimeleri <b>istediği kadar tekrar okuyabilirsiniz</b>. Yanlış gruplanan her kelime için <b>Hata sayısı +</b>.</div>` +
`<div class="aud-row"><div class="aud-num">↓</div><div class="aud-body"><div class="aud-words">${L.flat.map(x => x.w).join(" – ")}</div></div></div>` +
`` +
L.groups.map((g, gi) => `<div style="font-weight:800">${cap(GS_PLURAL[g.c])}</div>` + ckRow(g.w.map((w, i) => ckChip(gi, i, w, ckMarks[gi + ":" + i])).join(""))).join("") + `</div>`; }
/* gsScore: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
function spGroups(){
const ta = ["dog","cat","cow","rabbit","elephant","parrot"].map(k => ({ src: TA_ANIMALS[k](), n:k }));
const C = qzCats();
return { hayvan:{ n:"Hayvanlar", items: ta.concat(C.wild.items) }, yiyecek:{ n:"Yiyecekler", items: C.meyve.items.concat(C.sebze.items, [{ src: OBJECT_IMAGES.bread }, { src: OBJECT_IMAGES.chocolate }]) },
"taşıt":{ n:"Taşıtlar", items: C.vehicle.items }, giysi:{ n:"Giysiler", items:[{ src: OBJECT_IMAGES.jacket }, { src: OBJECT_IMAGES.tshirt }, { src: OBJECT_IMAGES.jeans }, { src: PAL_EXTRA_IMAGES.sock }, { src: PAL_EXTRA_IMAGES.slipper }] },
oyuncak:{ n:"Oyuncaklar", items: C.toy.items },
meyve:{ n:"Meyveler", items: C.meyve.items }, sebze:{ n:"Sebzeler", items: C.sebze.items }, kara:{ n:"Kara hayvanları", items: C.wild.items }, deniz:{ n:"Deniz canlıları", items: C.sea.items } };
}
function spBuild(){ const t = currentCombo().t, G = spGroups();
const sets = isPre() ? [2, 3, 3] : [3, 4, 4], per = isPre() && t === 2 ? 3 : 2;
let keys = (!isPre() && t === 2) ? ["meyve","sebze","kara","deniz"] : shuffleArray(isPre() ? ["hayvan","yiyecek","taşıt"] : ["hayvan","yiyecek","taşıt","giysi","oyuncak"]).slice(0, sets[t]);
const bins = keys.map(k => { const its = shuffleArray(G[k].items); return { k, n: G[k].n, ex: its[0], items: its.slice(1, 1 + per) }; });
return { bins, queue: shuffleArray(bins.flatMap((b, bi) => b.items.map(it => ({ it, bi })))) };
}
const FS_FAM = () => ({
giysi:{ n:"giysiler", pics:[OBJECT_IMAGES.jacket, OBJECT_IMAGES.tshirt, OBJECT_IMAGES.jeans, PAL_EXTRA_IMAGES.sock, PAL_EXTRA_IMAGES.slipper] },
mutfak:{ n:"mutfak eşyaları", pics:[PAL_EXTRA_IMAGES.spoon, PAL_EXTRA_IMAGES.bowl, HOUSE_IMAGES.cup] },
alet:{ n:"aletler", pics:[PAIR_IMAGES.hammer, PAIR_IMAGES.nail, PAIR_IMAGES.screw, PAIR_IMAGES.screwdriver] },
okul:{ n:"okul eşyaları", pics:[PAIR_IMAGES.pencil, PAIR_IMAGES.sharpener, HOUSE_IMAGES.scissors, NI(1).notebook] },
bahce:{ n:"bahçe", pics:[PAIR_IMAGES.flower, PAIR_IMAGES.wateringcan, HOUSE_IMAGES.bucket] } });
const FS_WORDS = { meyve:["elma","armut","kiraz","muz","üzüm"], "taşıt":["otobüs","gemi","uçak","tren","kamyon"], giysi:["ceket","etek","çorap","şapka","kazak"], mutfak:["kaşık","tabak","tencere","çatal","bardak"],
hayvan:["aslan","inek","kartal","balık","kedi"], meslek:["doktor","öğretmen","aşçı","pilot","berber"], renk:["mavi","sarı","kırmızı","yeşil","mor"] };
const FS_COLORS = [ACC.kirmizi,ACC.mavi,ACC.yesil,ACC.turuncu,ACC.mor];
function fsBuild(){ const t = currentCombo().t;
if(isPre() || t === 0){ const F = FS_FAM(), spec = isPre() ? [[2, 2], [2, 3], [3, 3]][t] : [3, 3];
const fams = shuffleArray(Object.keys(F)).slice(0, spec[0]);
const items = shuffleArray(fams.flatMap(f => shuffleArray(F[f].pics).slice(0, spec[1]).map(src => ({ src, f }))));
return { items, fams, names: Object.fromEntries(fams.map(f => [f, F[f].n])), pics:true }; }
const spec = [[3, 3], [4, 3], [5, 3]][t], fams = shuffleArray(Object.keys(FS_WORDS)).slice(0, spec[0]);
const items = shuffleArray(fams.flatMap(f => shuffleArray(FS_WORDS[f]).slice(0, spec[1]).map(w => ({ w, f }))));
return { items, fams, names: Object.fromEntries(fams.map(f => [f, GS_PLURAL[f] || (f === "meslek" ? "meslekler" : f === "renk" ? "renkler" : f)])), pics:false };
}
function fsEvaluate(st){
const groups = {}; st.items.forEach((it, i) => { const c = st.asg[i]; if(c == null) return; (groups[c] = groups[c] || []).push(i); });
const wrong = new Set(st.items.map((x, i) => i).filter(i => st.asg[i] == null));
Object.values(groups).forEach(ids => { const cnt = {}; ids.forEach(i => { cnt[st.items[i].f] = (cnt[st.items[i].f] || 0) + 1; }); const maj = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0]; ids.forEach(i => { if(st.items[i].f !== maj) wrong.add(i); }); });
return { groups, wrong };
}

/* KURAL (ses çalışmaları): çocuğun başka bir adla söyleyebileceği resimler (lamba/masa lambası, fincan/bardak, ayıcık/oyuncak ayı, bebek/oyuncak bebek, saat/çalar saat, yapboz/puzzle, salatalık/hıyar) ilk ses, hece ve son ses havuzuna girmez */
const SOUND_AMBIG = new Set(["h-lamp", "h-cup", "t-teddy", "t-doll", "h-clock", "t-puzzle", "f-cucumber"]);
function snPicPool(){ const C = qzCats(), seen = new Set(); return Object.values(C).flatMap(c => c.items).filter(x => !SOUND_AMBIG.has(x.k) && !/\s/.test(x.n) && !seen.has(x.n) && seen.add(x.n)); }
const trFirst = (w) => w.charAt(0).toLocaleUpperCase("tr-TR");
function ssBuild(){ const t = currentCombo().t, pool = snPicPool(), by = {}; pool.forEach(x => { (by[trFirst(x.n)] = by[trFirst(x.n)] || []).push(x); });
const sounds = Object.keys(by).filter(k => by[k].length >= 3), G = (isPre() ? [4, 6, 6] : [6, 8, 9])[t], K = (isPre() ? [2, 2, 3] : [2, 3, 3])[t];
let last = null;
return Array.from({length: isPre() ? 3 : 4}, () => { let s; do{ s = randomItem(sounds); } while(s === last && sounds.length > 1); last = s;
const hits = shuffleArray(by[s]).slice(0, K), rest = shuffleArray(pool.filter(x => trFirst(x.n) !== s)).slice(0, G - K);
return { s, opts: shuffleArray(hits.concat(rest)) }; }); }

const RHYME_PAIRS = { yes:[["kedi","yedi"],["el","gel"],["bal","dal"],["ev","sev"],["kar","dar"],["taş","baş"],["masa","kasa"],["güneş","ateş"],["yastık","bastık"],["ay","çay"],["top","hop"],["kuzu","buzu"],["gül","kül"],["yol","kol"],["diş","iş"],["kuş","tuş"],["saz","kaz"],["göz","söz"],["kapı","yapı"],["salı","halı"],["balon","salon"],["pasta","hasta"],["uçak","bıçak"],["şeker","çeker"]], no:[["kedi","kalem"],["el","ev"],["bal","bebek"],["masa","muz"],["güneş","göz"],["taş","top"],["ay","at"],["kar","kedi"],["yastık","yol"],["top","tavşan"],["ev","elma"],["kuzu","kale"],["gül","gemi"],["yol","yıldız"],["diş","dolap"],["kuş","kalem"],["saz","sabun"],["göz","gazete"],["kapı","kutu"],["salı","süt"],["balon","bisiklet"],["pasta","patates"],["uçak","uyku"],["şeker","şapka"]] };
const RHYME_NEAR = [["bal","bel"],["el","al"],["ev","av"],["kar","kır"],["taş","kuş"],["top","tip"]];   // yalnızca bir ünlü farklı: kulağa uyaklı gelir
function rhNoPool(t){ if(t >= 2) return RHYME_NEAR.concat(RHYME_PAIRS.no); if(t === 1) return RHYME_PAIRS.no;
  const ends = RHYME_PAIRS.no.map(p => p[1]); return RHYME_PAIRS.yes.map(([a]) => [a, randomItem(ends.filter(b => b[0] !== a[0] && b.slice(-2) !== a.slice(-2)))]); }   // Başlangıç: tamamen farklı kelimeler
function rhBuild(){ const t = currentCombo().t, N = (isPre() ? [10, 12, 14] : [16, 20, 24])[Math.min(t, 2)], yes = shuffleArray(RHYME_PAIRS.yes), no = shuffleArray(rhNoPool(t)), out = [];
for(let i = 0; i < N; i++){ const isYes = i % 2 === 0; const pr = isYes ? yes[Math.floor(i / 2) % yes.length] : no[Math.floor(i / 2) % no.length]; out.push({ stim:"", text:true, opts:[`<b style="font-size:20px">✓ Benziyor</b>`, `<b style="font-size:20px">✗ Benzemiyor</b>`], ans: isYes ? 0 : 1, say:`${pr[0]}… ${pr[1]}`, replay:true, fixed:true, prompt:"Bu iki kelimenin <b>sonu benziyor</b> mu?", after: isYes ? "" : `${pr[0]} ve ${pr[1]} kelimelerinin sonu benzemiyor.` }); }
return shuffleArray(out); }
const SYN = [["büyük","iri"],["hızlı","çabuk"],["güzel","hoş"],["mutlu","sevinçli"],["cevap","yanıt"],["okul","mektep"],["öğrenci","talebe"],["siyah","kara"],["beyaz","ak"],["yaşlı","ihtiyar"],["doktor","hekim"],["sınav","imtihan"],["kelime","sözcük"],["kırmızı","al"],["zengin","varlıklı"],["akıllı","zeki"],["cümle","tümce"],["hikâye","öykü"],["misafir","konuk"],["sene","yıl"],["rüzgâr","yel"],["nehir","ırmak"],["şehir","kent"],["hediye","armağan"],["fikir","düşünce"],["kıymetli","değerli"],["kalp","yürek"],["kirli","pis"],["soru","sual"],["anı","hatıra"],["rüya","düş"],["komik","gülünç"]];
const SYN_OPP = { "büyük":"küçük", "hızlı":"yavaş", "güzel":"çirkin", "mutlu":"üzgün", "siyah":"beyaz", "beyaz":"siyah", "yaşlı":"genç", "zengin":"fakir", "akıllı":"aptal", "cevap":"soru", "kirli":"temiz", "soru":"cevap", "kıymetli":"değersiz" };
function synBuild(){ const t = currentCombo().t, N = (isPre() ? [3, 3, 4] : [3, 4, 5])[t];
return shuffleArray(SYN).slice(0, 6).map(([w, s]) => { const pool = SYN.filter(p => p[0] !== w).map(p => p[1]); let dis = shuffleArray(pool).slice(0, N - 1);
if(t === 2 && SYN_OPP[w]) dis[0] = SYN_OPP[w];
const opts = [`<b style="font-size:19px">${s}</b>`].concat(dis.map(d => `<b style="font-size:19px">${d}</b>`));
return qzMake(`<div style="font-size:30px;font-weight:900;color:var(--teal-dark)">${w}</div>`, opts, 0, { prompt:"<b>Eş anlamlısı</b> hangisi?", fixed:true, text:true, raw:true }); }); }
const PW = [["tekerlek","araba"],["yaprak","ağaç"],["sayfa","kitap"],["parmak","el"],["kanat","kuş"],["yelken","gemi"],["kulp","fincan"],["ekran","telefon"],["çatı","ev"],["bilye","rulman"],["yüzgeç","balık"],["dal","ağaç"],["tuş","piyano"]].filter(p => p[0] !== "bilye");
function pwBuildPre(){ const t = currentCombo().t, N = [3, 4, 4][t];
return shuffleArray([0, 1, 2, 3]).slice(0, N).map(i => { const rev = t === 2 && Math.random() < 0.5, others = shuffleArray([0, 1, 2, 3].filter(x => x !== i)).slice(0, [2, 2, 3][t]);
if(!rev) return qzMake(`<div style="width:110px;height:110px;margin:0 auto">${qzPic(PART_IMAGES[i * 2 + 1])}</div>`, [i].concat(others).map(x => qzPic(PART_IMAGES[x * 2])), 0, { prompt:`<b>${cap(PART_PAIRS[i][1])}</b> neyin parçası?`, raw:true, fixed:true, cell:96, say:`${cap(PART_PAIRS[i][1])} neyin parçası?`, replay:true });
return qzMake(`<div style="width:110px;height:110px;margin:0 auto">${qzPic(PART_IMAGES[i * 2])}</div>`, [i].concat(others).map(x => qzPic(PART_IMAGES[x * 2 + 1])), 0, { prompt:"Bunun <b>parçası</b> hangisi?", raw:true, fixed:true, cell:96, say:"Bunun parçası hangisi?", replay:true }); }); }
function pwBuild(){ if(isPre()) return pwBuildPre(); const t = currentCombo().t, N = [3, 4, 5][t], wholes = Array.from(new Set(PW.map(p => p[1]))), parts = PW.map(p => p[0]);
return shuffleArray(PW).slice(0, 6).map(([pa, wh]) => {
if(t < 2){ const dis = shuffleArray(wholes.filter(w => w !== wh)).slice(0, N - 1);
return qzMake(`<div style="font-size:26px;font-weight:900;color:var(--teal-dark)">${pa}</div>`, [wh].concat(dis).map(x => `<b style="font-size:19px">${x}</b>`), 0, { prompt:`<b>${cap(pa)}</b> neyin parçası?`, fixed:true, text:true, raw:true }); }
const own = PW.filter(p => p[1] === wh).map(p => p[0]), dis = shuffleArray(parts.filter(p => !own.includes(p))).slice(0, N - 1);
return qzMake(`<div style="font-size:26px;font-weight:900;color:var(--teal-dark)">${wh}</div>`, [pa].concat(dis).map(x => `<b style="font-size:19px">${x}</b>`), 0, { prompt:"Bunun <b>parçası</b> hangisi?", fixed:true, text:true, raw:true }); }); }
const SEQW = [ ["sabah","öğle","akşam","gece"], ["ilkbahar","yaz","sonbahar","kış"], ["bebek","çocuk","genç","yaşlı"], ["tohum","fidan","ağaç","meyve"], ["yumurta","civciv","tavuk"],
["pazartesi","salı","çarşamba","perşembe","cuma"], ["karınca","kedi","at","fil"], ["damla","su birikintisi","göl","deniz"], ["ocak","şubat","mart","nisan","mayıs"], ["bir","üç","beş","yedi","dokuz"] ];
const SW_PRE_ANIMALS = () => [ ["papağan", TA_ANIMALS.parrot()], ["kedi", TA_ANIMALS.cat()], ["köpek", TA_ANIMALS.dog()], ["inek", TA_ANIMALS.cow()], ["fil", TA_ANIMALS.elephant()] ];
function swBuildPre(){ const t = currentCombo().t, A = SW_PRE_ANIMALS(), sets = [[0, 1, 4], [0, 2, 3], [0, 1, 3, 4]];
return Array.from({length:3}, () => { const idx = t === 0 ? sets[0] : t === 1 ? randomItem([[0, 1, 4], [0, 2, 3], [1, 3, 4]]) : sets[2]; return { seq: idx.map(i => A[i][0]), pics: idx.map(i => A[i][1]), cards: shuffleArray(idx.map((x, k) => k)) }; }); }
function swBuild(){ if(isPre()) return swBuildPre(); const t = currentCombo().t, L = [3, 4, 5][t];
return shuffleArray(SEQW.filter(q => q.length >= L)).slice(0, 4).map(q => { const start = Math.floor(Math.random() * (q.length - L + 1)), seq = q.slice(start, start + L); return { seq, cards: shuffleArray(seq.map((w, i) => i)) }; }); }
/* RHYME_TIPS: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
/* (2026-11-02: Uyak Söyle çalışması kullanıcı isteğiyle silindi) */
/* rhsRender: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
/* rhsScore: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */

function dotTrials(){ const t = currentCombo().t, rng = isPre() ? [[1, 3], [1, 4], [2, 5]][t] : [[1, 5], [2, 7], [3, 9]][t], ms = (isPre() ? [2800, 2200, 1700] : [2200, 1700, 1300])[t];
/* Orta: aynı resimden n tane · Zor: hedef resim + farklı çeldirici resimler (yalnızca hedef sayılır) */ const named = t >= 1 ? placeNamedPool().filter(x => x.n && x.src && x.n.length <= 12) : []; const nextPic = named.length ? mkCycle(named) : null;
let __prevN = window.__dotLastN; /* KURAL (Nokta Say çeşitliliği, 2026-11-09): art arda iki soru aynı sayıyı vermez (sayfa geçişinde de); önceden aynı cevap 4–5 kez art arda gelebiliyordu */
return Array.from({length: isPre() ? [5, 6, 7][t] : [8, 10, 12][t]}, () => { let n = rng[0] + Math.floor(Math.random() * (rng[1] - rng[0] + 1)); for(let g = 0; n === __prevN && g < 12; g++) n = rng[0] + Math.floor(Math.random() * (rng[1] - rng[0] + 1)); __prevN = window.__dotLastN = n; const pts = []; const pic = nextPic ? nextPic() : null; let dis = null, nd = 0; /* çeldirici resim yok: Zor da tek tür resimle; zorluk sayı aralığı ve gösterim süresinden gelir */
const gap = pic ? 40 : 34, lo = pic ? 20 : 14, span = pic ? 160 : 172; let g = 0; while(pts.length < n + nd && g++ < 900){ const x = lo + Math.random() * span, y = lo + Math.random() * span; if(pts.every(p => Math.hypot(p[0] - x, p[1] - y) > gap)) pts.push([x, y]); }
const tp = pts.slice(0, n), dp = pts.slice(n, n + nd); return { n: tp.length, pts: tp, dpts: dp, pic: pic ? pic.src : null, name: pic ? pic.n : null, dis: dis ? dis.src : null, ms, max: rng[1] + 1, min: Math.max(1, rng[0] - 1) }; }); }
const SEM_QS = [ { k:"canli", q:"Canlı mı?" }, { k:"yenir", q:"Yenir mi?" },
  { k:"tasit", q:"Taşıt mı?" }, { k:"kanat", q:"Kanatları var mı?" }, { k:"cep", q:"Cebine sığar mı?" }, { k:"elektrik", q:"Elektrikle mi çalışır?" },
  { k:"su", q:"Suda yaşar mı?" }, { k:"dortayak", q:"Dört ayağı var mı?" }, { k:"yumusak", q:"Yumuşak mı?" }, { k:"yuvarlak", q:"Yuvarlak mı?" }, { k:"soguk", q:"Soğuk mu?" }, { k:"tatli", q:"Tatlı mı?" },
  { k:"meyve", q:"Meyve mi?" }, { k:"sebze", q:"Sebze mi?" }, { k:"giyilir", q:"Giyilir mi?" }, { k:"ucar", q:"Uçabilir mi?" }, { k:"teker", q:"Tekerleği var mı?" }, { k:"kirmizi", q:"Kırmızı mı?" },
  { k:"vahsi", q:"Vahşi hayvan mı?" }, { k:"evcil", q:"Evcil hayvan mı?" }, { k:"oyuncak", q:"Oyuncak mı?" }, { k:"okul", q:"Okulda kullanılır mı?" }, { k:"sicak", q:"Sıcak mı?" } ];   /* ilk ikisi okul öncesi; kalan 20 okul sonrası */   // ilk ikisi okul öncesi; okul sonrası 3.–6.
let semQ = null;
function semPick(force){ const pool = isPre() ? SEM_QS.slice(0, 2) : SEM_QS.slice(2); if(force || !semQ || !pool.includes(semQ)){ let v; do{ v = randomItem(pool); } while(pool.length > 1 && v === semQ); semQ = v; } return semQ; }
function semTrials(){ const C = qzCats(), I = (src) => ({ src }), t = Math.min(currentCombo().t, 2);
  const ta = ["dog","cat","cow","rabbit","elephant","parrot"].map(k => ({ src: TA_ANIMALS[k]() }));
  const living = ta.concat(C.wild.items, C.sea.items), food = C.meyve.items.concat(C.sebze.items, [I(OBJECT_IMAGES.bread), I(OBJECT_IMAGES.chocolate)]), veh = C.vehicle.items, obj = C.toy.items.concat(C.house.items);
  const A = (k) => I(TA_ANIMALS[k]()), V = VEHICLE_IMAGES, H = HOUSE_IMAGES, T = TOY_IMAGES, P = PAIR_IMAGES, X = PAL_EXTRA_IMAGES, O = OS_IMAGES, F = FRUIT_VEG_IMAGES, S = SRH_IMAGES, HC = HOTCOLD_IMAGES, TS = TASTE_IMAGES, SC = SCENE_OBJ_IMAGES, OB = OBJECT_IMAGES, CI = CONCEPT_IMAGES;
    const wildOf = (names) => C.wild.items.filter(x => names.includes(x.n)), seaOf = (names) => C.sea.items.filter(x => names.includes(x.n));
    const SETS = { /* okul sonrası: cevabı resimden kesin anlaşılan öğeler; her sorunun Evet ve Hayır havuzu en az 5 resim */
      tasit:   { yes: veh.concat([I(LIVING_IMAGES.car)]), no: obj.concat(living, food) },
      kanat:   { yes: [A("parrot"), A("penguin"), I(PART_IMAGES[2]), I(O.butterfly), I(X.bee), I(V.plane_f), I(SC.bird)], no: [A("dog"), A("cat"), A("cow"), A("elephant"), A("rabbit"), A("fish"), I(V.bus_f), I(V.train_f), I(T.teddy), I(T.car)] },
      cep:     { yes: [I(P.key), I(P.pencil), I(P.sharpener), I(X.spoon), I(H.comb), I(X.sock), I(TS.candy), I(O.egg), I(X.bone)], no: [I(V.bus_f), I(V.fire_f), A("elephant"), A("cow"), I(H.pillow), I(H.bucket), I(H.broom), I(LIVING_IMAGES.tree), I(LIVING_IMAGES.chair)] },
      elektrik:{ yes: [I(H.lamp), I(P.phone), I(P.charger), I(V.train_f), I(HC.iron), I(SC.lamp), I(NI(1).tv), I(NI(1).fridge), I(NI(1).fan)], no: [I(P.pencil), I(X.spoon), I(T.teddy), I(T.ball), I(H.broom), I(H.bucket), I(X.sock), I(F.apple), I(P.hammer), I(H.comb)] },
      su:      { yes: [A("fish")].concat(seaOf(["yunus","deniz yıldızı","kaplumbağa","yengeç","denizatı"]), [I(O.frog)]), no: [A("dog"), A("cat"), A("cow"), A("rabbit"), A("parrot")].concat(wildOf(["aslan","zürafa"]), [I(LIVING_IMAGES.tree), I(V.bus_f), I(F.apple)]) },
      dortayak:{ yes: [A("dog"), A("cat"), A("cow"), A("elephant"), A("rabbit")].concat(wildOf(["aslan","zebra","zürafa","ayı","tilki"]), [I(O.frog)]), no: [A("parrot"), A("fish"), A("penguin"), I(O.butterfly), I(X.bee), I(O.hen), I(SC.bird), I(T.ball), I(V.bus_f)] },
      yumusak: { yes: [I(T.teddy), I(H.pillow), I(X.sock), I(X.slipper), I(CI.yumusak), I(OB.bread), I(T.doll)], no: [I(P.hammer), I(P.screw), I(P.key), I(P.nail), I(H.scissors), I(H.clock), I(H.bucket), I(CI.sert), I(P.screwdriver)] },
      yuvarlak:{ yes: [I(T.ball), I(S.ball_soccer), I(S.ball_basket), I(S.ball_beach), I(F.orange), I(H.clock), I(HC.sun), I(SC.balloon), I(TS.watermelon)], no: [I(P.pencil), I(V.train_f), I(V.bus_f), I(H.scissors), I(H.broom), I(H.comb), I(P.key), I(P.hammer), I(F.banana)] },
      soguk:   { yes: [I(HC.snowman), I(HC.ice), I(HC.icecream), I(HC.penguin), I(O.snowpile), I(O.snowman2)], no: [I(HC.fire), I(HC.soup), I(HC.sun), I(HC.iron), I(OB.bread), I(X.sock), I(T.teddy), I(F.apple)] },
      sicak:   { yes: [I(HC.fire), I(HC.soup), I(HC.sun), I(HC.iron), I(NI(1).tea)], no: [I(HC.snowman), I(HC.ice), I(HC.icecream), I(HC.penguin), I(O.snowpile), I(O.snowman2), I(F.apple), I(T.ball), I(H.comb)] },
      tatli:   { yes: [I(X.honey), I(OB.chocolate), I(HC.icecream), I(TS.candy), I(O.cakeslice), I(F.strawberry), I(F.banana), I(F.grapes), I(TS.watermelon)], no: [I(TS.lemon), I(TS.chili), I(TS.pasta), I(TS.simit), I(HC.soup), I(OB.bread), I(F.cucumber), I(F.broccoli), I(O.cheese), I(O.egg)] },
      meyve:   { yes: [I(F.apple), I(F.banana), I(F.orange), I(F.grapes), I(F.strawberry), I(TS.watermelon), I(TS.lemon)], no: [I(F.carrot), I(F.cucumber), I(F.pepper), I(F.broccoli), I(OB.bread), I(O.cheese), I(T.teddy), A("dog"), I(H.cup)] },
      sebze:   { yes: [I(F.carrot), I(F.cucumber), I(F.pepper), I(F.broccoli), I(TS.chili), I(F.tomato), I(NI(1).potato), I(NI(1).onion)], no: [I(F.apple), I(F.banana), I(F.orange), I(F.grapes), I(F.strawberry), I(OB.bread), I(O.cheese), I(TS.candy), I(T.ball)] },
      giyilir: { yes: [I(P.shoe), I(X.sock), I(X.slipper), I(OB.jacket), I(OB.tshirt), I(OB.jeans), I(S.boots_yellow), I(S.beanie_red), I(S.cap_blue)], no: [I(H.comb), I(H.cup), I(T.ball), I(P.hammer), I(H.pillow), I(F.apple), I(P.phone), I(H.scissors), I(T.drum)] },
      ucar:    { yes: [A("parrot"), I(O.butterfly), I(X.bee), I(V.plane_f), I(V.heli_f), I(SC.bird)], no: [A("dog"), A("cow"), A("fish"), A("penguin"), A("rabbit"), I(V.bus_f), I(V.train_f), I(LIVING_IMAGES.car), I(O.frog)] },
      teker:   { yes: [I(V.bus_f), I(V.fire_f), I(V.train_f), I(LIVING_IMAGES.car), I(T.car), I(T.train)], no: [I(V.ship_f), A("dog"), A("cow"), I(T.ball), I(LIVING_IMAGES.chair), I(LIVING_IMAGES.tree), I(F.apple), I(T.kite), I(H.lamp)] },
      kirmizi: { yes: [I(S.umbrella_red), I(S.boots_red), I(S.beanie_red), I(F.strawberry), I(F.tomato), I(V.fire_f), I(TS.chili)], no: [I(S.umbrella_blue), I(S.boots_yellow), I(S.cap_green), I(S.beanie_navy), I(F.banana), I(F.cucumber), I(F.broccoli), I(F.orange), I(S.pencil_blue)] },
      vahsi:   { yes: wildOf(["aslan","zürafa","zebra","maymun","ayı","tilki"]), no: [A("dog"), A("cat"), A("cow"), A("rabbit"), I(O.hen), I(O.chick), I(X.dog)] },
      evcil:   { yes: [A("dog"), A("cat"), A("rabbit"), A("parrot"), A("fish"), I(X.dog)], no: wildOf(["aslan","zebra","zürafa","ayı","tilki","maymun"]).concat(seaOf(["yunus","yengeç"])) },
      oyuncak: { yes: [I(T.doll), I(T.teddy), I(T.ball), I(T.kite), I(T.puzzle), I(T.drum), I(T.train), I(T.car)], no: [I(H.cup), I(H.scissors), I(H.clock), I(H.lamp), I(H.comb), I(H.pillow), I(H.bucket), I(H.broom), I(F.apple), I(P.hammer)] },
      okul:    { yes: [I(P.pencil), I(S.pencil_yellow), I(S.pencil_green), I(P.sharpener), I(H.scissors), I(SC.backpack), I(SC.map)], no: [I(P.hammer), I(H.pillow), I(X.spoon), I(T.teddy), I(X.sock), I(H.comb), I(X.slipper), I(H.cup), I(T.kite)] } };
    Object.keys(SETS).forEach(k => { SETS[k].yes = SETS[k].yes.filter(x => x && x.src); SETS[k].no = SETS[k].no.filter(x => x && x.src); }); /* resmi olmayan öğe havuza girmez */
    const sets = (Q) => SETS[Q.k] || ({ yes: Q.k === "canli" ? living : Q.k === "yenir" ? food : veh, no: Q.k === "canli" ? obj.concat(veh, food) : Q.k === "yenir" ? obj.concat(veh, living) : obj.concat(living, food) });
  const pool = shuffleArray((isPre() ? SEM_QS.slice(0, 2) : SEM_QS.slice(2)).slice()).slice(0, isPre() ? 2 : [1, 2, 4][t]), N = isPre() ? [10, 12, 14][t] : [16, 20, 24][t]; const qAt = (i) => t === 0 ? pool[0] : t === 1 ? pool[Math.floor(i / 2) % 2] : pool[i % pool.length]; /* Başlangıç tek soru · Orta iki soru, iki resimde bir · Zor dört soru, her resimde değişir */   // Başlangıç tek soru · Orta iki resimde bir · Zor her resimde
  const ans = shuffleArray(Array.from({length:N}, (_, i) => i % 2 === 0)); const out = [], used = new Set(); for(let i = 0; i < N; i++){ const Q = qAt(i), S = sets(Q), y = ans[i]; const cand = (y ? S.yes : S.no); const fresh = cand.filter(x => !used.has(x.src)); const it = randomItem(fresh.length ? fresh : cand); used.add(it.src); /* bir turda aynı resim tekrar gelmesin */
    out.push({ stim: qzPic(it.src), opts:[`<b style="font-size:20px">✓ Evet</b>`, `<b style="font-size:20px">✗ Hayır</b>`], ans: y ? 0 : 1, prompt:`<b>${Q.q}</b>`, say: Q.q, text:true, qk: Q.k }); }
  return out; }
function chaseCfg(){ const t = currentCombo().t; return { need: isPre() ? [5, 6, 8][t] : [8, 10, 12][t], speed: (isPre() ? [0.45, 0.6, 0.75] : [0.6, 0.85, 1.1])[t], size: isPre() ? 70 : [64, 56, 48][t] }; }
const ALT_BY_TIER = [ ["kutu","ip","kova","yastık","şemsiye","kâğıt","top"], ["kaşık","fincan","çorap","ayakkabı","kâse","kemer","süpürge","pipet","defter","kalem"], ["anahtar","tarak","diş fırçası","kalemtıraş","makas","saat","mıknatıs","gözlük","termos","zarf","tornavida","el feneri","bilezik"] ];   // Başlangıç: çok amaçlı, esnek nesneler (7) · Orta (10) · Zor: kullanım alanı dar nesneler (13)
const ALT_OBJ = () => [ { n:"kutu", src: g3img("box") }, { n:"ip", src: g3img("rope") }, { n:"kova", src: HOUSE_IMAGES.bucket }, { n:"yastık", src: HOUSE_IMAGES.pillow }, { n:"şemsiye", src: PAIR_IMAGES.umbrella }, { n:"kâğıt", src: PAIR_IMAGES.paper }, { n:"top", src: TOY_IMAGES.ball },
  { n:"kaşık", src: PAL_EXTRA_IMAGES.spoon }, { n:"fincan", src: HOUSE_IMAGES.cup }, { n:"çorap", src: PAIR_IMAGES.sock }, { n:"ayakkabı", src: PAIR_IMAGES.shoe }, { n:"kâse", src: PAIR_IMAGES.bowl }, { n:"kemer", src: g3img("belt") }, { n:"süpürge", src: HOUSE_IMAGES.broom }, { n:"pipet", src: PAIR_IMAGES.straw }, { n:"defter", src: PAIR_IMAGES.notebook }, { n:"kalem", src: PAIR_IMAGES.pencil },
  { n:"anahtar", src: PAIR_IMAGES.key }, { n:"tarak", src: HOUSE_IMAGES.comb }, { n:"diş fırçası", src: PAIR_IMAGES.toothbrush }, { n:"kalemtıraş", src: PAIR_IMAGES.sharpener }, { n:"makas", src: HOUSE_IMAGES.scissors }, { n:"saat", src: HOUSE_IMAGES.clock }, { n:"mıknatıs", src: g3img("magnet") }, { n:"gözlük", src: g3img("glasses") }, { n:"termos", src: g3img("thermos") }, { n:"zarf", src: PAIR_IMAGES.envelope }, { n:"tornavida", src: PAIR_IMAGES.screwdriver }, { n:"el feneri", src: g3img("flashlight") }, { n:"bilezik", src: g3img("bracelet") } ];
function timeTrials(){ const t = currentCombo().t, pool = (isPre() ? [[2, 3, 4], [4, 5, 6], [6, 7, 8]] : [[4, 5, 6, 7], [8, 10, 12, 14], [12, 15, 18, 20]])[t]; return shuffleArray(pool).map(secs => ({ secs, tol: isPre() ? 0.3 : 0.2 })); }   /* sayfada her deneme farklı süre */
const FERR_COL = [{ c:ACC.kirmizi, n:"kırmızı" }, { c:ACC.mavi, n:"mavi" }, { c:ACC.yesil, n:"yeşil" }, { c:ACC.sari, n:"sarı" }];
const FERR_SH = [{ s:"circle", n:"daire" }, { s:"triangle", n:"üçgen" }, { s:"square", n:"kare" }, { s:"star", n:"yıldız" }, { s:"heart", n:"kalp" }];
const FERR_DIR = [{ d:"u", n:"yukarı" }, { d:"d", n:"aşağı" }, { d:"l", n:"sola" }, { d:"r", n:"sağa" }];
/* Hatayı Bul: sayfada her soru farklı türden; kurallar kısa (hız çalışması) */
function ferrTrials(){ const tt = Math.min(currentCombo().t, 2), pre = isPre(); const types = pre ? ["color", "shape", "arrow"] : ["num1", "num2", "numDown", "color", "shape", "pattern", "arrow"]; const K = pre ? 3 : 4, E = pre ? [1, 1, 2][tt] : [1, 2, 3][tt];
  return shuffleArray(types).slice(0, K).map(ty => Object.assign(ferrMake(ty, tt, pre, E), { ty })); }
function ferrMake(ty, tt, pre, E){ const gridN = pre ? [4, 6, 6][tt] : [6, 8, 9][tt], seqN = [6, 8, 10][tt];
  const pickBad = (N, seq) => { const bad = new Set(); let g = 0; while(bad.size < E && g++ < 500){ const i = seq ? 1 + Math.floor(Math.random() * (N - 1)) : Math.floor(Math.random() * N); if(seq && (bad.has(i - 1) || bad.has(i + 1))) continue; bad.add(i); } return bad; };
  const num = (v) => ({ html:`<b style="font-size:26px">${v}</b>` });
  if(ty === "num1" || ty === "num2" || ty === "numDown"){ const N = seqN, step = ty === "num2" ? 2 : 1; const arr = Array.from({length:N}, (_, i) => ty === "numDown" ? N - i : (ty === "num2" ? 2 : 1) + step * i); const set = new Set(arr), bad = pickBad(N, true);
    const wrongOf = (v) => { const c = (ty === "num2" ? [v + 1, v - 1, v + 3] : [v + 2, v - 2, v + 3, v + 4, N + 1, N + 2, N + 3, N + 4, N + 5]).filter(x => x >= 0 && !set.has(x)); return c.length ? randomItem(c) : v + N; };   /* hatalı sayı dizideki başka bir sayıyla aynı olmaz */
    const used = new Set(); const items = arr.map((v, i) => { if(!bad.has(i)) return num(v); let w, g = 0; do{ w = wrongOf(v); g++; } while(g < 20 && used.has(w)); used.add(w); return Object.assign(num(w), { bad:true }); });
    if(new Set(items.map(x => x.html)).size < items.length) return ferrMake(ty, tt, pre, E);   /* güvence: aynı sayı iki kez görünmez */
    return { rule: ty === "num2" ? "Sayılar ikişer artmalı." : ty === "numDown" ? "Sayılar birer azalmalı." : "Sayılar birer artmalı.", items }; }
  if(ty === "pattern"){ const [a, b] = shuffleArray(FERR_SH).slice(0, 2), [ca, cb] = shuffleArray(FERR_COL).slice(0, 2), N = seqN, bad = pickBad(N, true);
    const items = Array.from({length:N}, (_, i) => { const want = i % 2 === 0 ? [a.s, ca.c] : [b.s, cb.c], wrong = i % 2 === 0 ? [b.s, cb.c] : [a.s, ca.c]; const sh = bad.has(i) ? wrong : want; return { html: shapeSVG(sh[0], sh[1]), bad: bad.has(i) }; });
    return { rule:"Bir o, bir bu gelmeli.", items, row:true }; }
  if(ty === "arrow"){ const tgt = randomItem(FERR_DIR), others = FERR_DIR.filter(x => x !== tgt), col = randomItem(FERR_COL.filter(x => x.n !== "kırmızı")).c,   /* kırmızı ok kullanılmaz (Dur İşareti'nde "basma" anlamında) */ N = gridN, bad = pickBad(N, false); const svg = (d) => stopArrowSVG(d, col, 64).replace('width="64" height="64"', 'width="100%" height="100%"');
    return { rule:`Hepsi ${tgt.n} bakmalı.`, items: Array.from({length:N}, (_, i) => bad.has(i) ? { html: svg(randomItem(others).d), bad:true } : { html: svg(tgt.d) }) }; }
  if(ty === "shape"){ const tgt = randomItem(FERR_SH), others = FERR_SH.filter(x => x !== tgt), col = randomItem(FERR_COL).c, N = gridN, bad = pickBad(N, false);
    return { rule:`Hepsi ${tgt.n} olmalı.`, items: Array.from({length:N}, (_, i) => bad.has(i) ? { html: shapeSVG(randomItem(others).s, col), bad:true } : { html: shapeSVG(tgt.s, col) }) }; }
  const tgt = randomItem(FERR_COL), others = FERR_COL.filter(x => x !== tgt), sh = randomItem(FERR_SH).s, N = gridN, bad = pickBad(N, false);
  return { rule:`Hepsi ${tgt.n} olmalı.`, items: Array.from({length:N}, (_, i) => bad.has(i) ? { html: shapeSVG(sh, randomItem(others).c), bad:true } : { html: shapeSVG(sh, tgt.c) }) }; }
function cupsTrials(){ const t = currentCombo().t, n = isPre() ? 3 : [3, 4, 5][t], swaps = (isPre() ? [2, 3, 4] : [3, 5, 7])[t], ms = (isPre() ? [1200, 1000, 850] : [1000, 800, 650])[t];
return Array.from({length: isPre() ? 3 : 4}, () => { const ball = Math.floor(Math.random() * n), seq = []; for(let k = 0; k < swaps; k++){ let a = Math.floor(Math.random() * n), b; do{ b = Math.floor(Math.random() * n); } while(b === a); seq.push([a, b]); }
return { n, ball, seq, ms }; }); }
const CUP_SVG = (c) => `<svg viewBox="0 0 100 110" style="width:100%;height:100%"><path d="M34 6 H66 Q72 6 72.5 12 L86 98 H14 L27.5 12 Q28 6 34 6 Z" fill="${c}"/><rect x="4" y="95" width="92" height="13" rx="3" fill="${c}"/><rect x="4" y="95" width="92" height="13" rx="3" fill="#000" opacity=".12"/><path d="M38 22 l-5 62" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".35"/></svg>`;   /* ters bardak: geniş ağız altta, top tamamen içinde kalır */
function mmathTrials(){ const __orig = function(){ const t = currentCombo().t, steps = (isPre() ? [1, 2, 2] : [2, 3, 4])[t];
return Array.from({length: isPre() ? 3 : 5}, () => { let v = isPre() ? 1 + Math.floor(Math.random() * 3) : 1 + Math.floor(Math.random() * 6); const start = v, ops = [];
for(let k = 0; k < steps; k++){ const maxAdd = (isPre() ? 5 : 9) - v; let d; if(v > 0 && (maxAdd <= 0 || Math.random() < 0.45)){ d = -(1 + Math.floor(Math.random() * Math.min(v, isPre() ? 2 : 4))); } else { d = 1 + Math.floor(Math.random() * Math.min(maxAdd, isPre() ? 2 : 4)); } v += d; ops.push(d); }
const want = (isPre() ? [3, 3, 4] : [3, 4, 5])[Math.min(currentCombo().t, 2)]; const near = Array.from(new Set([v + 1, v - 1, v + 2, v - 2, v + 3, v - 3, v + 4, v + 5].filter(x => x >= 0 && x !== v))); const opts = [v].concat(shuffleArray(near.slice(0, Math.max(want - 1, 4))).slice(0, want - 1));   /* seçenek sayısı düzeye göre; doğru cevaba yakın sayılar */
return { start, ops, res: v, opts: shuffleArray(opts), pic: randomItem(picPool()) }; }); }; let T = __orig(); for(let g = 0; g < 25 && T.some((q, i) => i && q.res === T[i - 1].res); g++){ const i = T.findIndex((q, i) => i && q.res === T[i - 1].res); const R = __orig(); T[i] = R.find(q => q.res !== T[i - 1].res && (!T[i + 1] || q.res !== T[i + 1].res)) || T[i]; } return T; /* ardışık iki soru aynı sonucu vermez */ }

function whoTrial(){ const t = currentCombo().t, nP = !isPre() && t === 2 ? 3 : 2, nI = isPre() ? [4, 5, 6][t] : [4, 6, 8][t];
const fids = shuffleArray(FACE_ID_IMAGES.map((x, i) => i)).slice(0, nP), used = new Set(), ppl = fids.map(i => { const nm = shuffleArray(FACEID_NAMES[FACE_GENDER[i]]).find(n => !used.has(n)); used.add(nm); return { i, nm }; });
const items = shuffleArray(picPool()).slice(0, nI).map((x, k) => ({ x, p: k % nP }));
return { ppl, study: shuffleArray(items), test: shuffleArray(items.slice()) }; }
function rhyTrials(){ const t = currentCombo().t, L = (isPre() ? [3, 4, 5] : [4, 5, 6])[t];
return Array.from({length: isPre() ? 3 : 4}, () => { let iv; do{ iv = Array.from({length: L - 1}, () => Math.random() < 0.4 ? 2 : 1); } while(!(iv.includes(1) && iv.includes(2))); return { L, iv }; }); }
function rhyBeep(){ try{ const ctx = getAudioCtx(); if(!ctx) return; if(ctx.state === "suspended") ctx.resume(); sfxTone(ctx, 660, ctx.currentTime + 0.005, 0.12, "triangle", 0.25); }catch(e){} }
function memBuild(){ const t = currentCombo().t, P = (isPre() ? [2, 3, 4] : [4, 6, 8])[t], pics = shuffleArray(picPool()).slice(0, P);
return { cards: shuffleArray(pics.concat(pics).map((x, i) => ({ x }))), P }; }

function lcBuild(bank){ const t = currentCombo().t, lvl = isPre() ? "pre" : "post", pool = (bank[lvl] || []).filter(x => (x.t || 0) <= t), N = isPre() ? [4, 5, 6][t] : [6, 8, 10][t];
const tierFirst = shuffleArray(pool.filter(x => (x.t || 0) === t)), rest = shuffleArray(pool.filter(x => (x.t || 0) !== t));
return [{ items: tierFirst.concat(rest).slice(0, N) }]; }
function lcRender(items, note){ const L = items[0], ok = L.items.filter((x, i) => ckMarks["0:" + i]).length;
return `<div class="aud-list"><div class="aud-note">${note}</div><div class="aud-key" style="margin:4px 0 8px">Yetişkin: uygun olmayan her cevap için <b>Hata sayısı +</b></div>` +
L.items.map((x, i) => `<div class="aud-row"><div class="aud-num">${i + 1}</div><div class="aud-body" style="display:flex;align-items:center;gap:8px;justify-content:space-between"><div><div style="font-size:18px;font-weight:800;line-height:1.35">${x.q}</div><div class="aud-key">Beklenen: <b>${x.a}</b></div></div><div style="display:flex;gap:6px;align-items:center;flex:none">${sayBtn(x.q.replace(/<[^>]+>/g, ""))}</div></div></div>`).join("") + `</div>`; }
/* lcScore: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
const ANALOGY = {
pre:[ { t:0, q:"Kaşık yemek içindir; bardak ne içindir?", a:"su içmek" }, { t:0, q:"Top oynamak içindir; kitap ne içindir?", a:"okumak / bakmak" },
{ t:0, q:"Keçinin yavrusu oğlak; tavuğun yavrusu nedir?", a:"civciv" }, { t:0, q:"Koyunun yavrusu kuzu; atın yavrusu nedir?", a:"tay" },
{ t:1, q:"İneğin yavrusu buzağı; köpeğin yavrusu nedir?", a:"yavru köpek / enik" }, { t:1, q:"Sabun yıkanmak içindir; havlu ne içindir?", a:"kurulanmak" },
{ t:1, q:"Yatak yatak odasındadır; buzdolabı nerededir?", a:"mutfakta" }, { t:1, q:"Balık suda yaşar; kuş nerede yaşar?", a:"ağaçta / yuvada / gökyüzünde" },
{ t:2, q:"Gözlük görmek içindir; kulaklık ne içindir?", a:"dinlemek" }, { t:2, q:"Araba yolda gider; gemi nerede gider?", a:"denizde / suda" },
{ t:2, q:"Gündüz güneş var; gece ne var?", a:"ay / yıldızlar" }, { t:2, q:"Fil büyük; karınca nasıl?", a:"küçük" } ],
post:[ { t:0, q:"Kalem yazmak içinse, fırça ne içindir?", a:"boyamak" }, { t:0, q:"Öğretmen okulda çalışır; doktor nerede çalışır?", a:"hastanede" },
{ t:0, q:"Sıcak soğuğun karşıtıysa, hızlı neyin karşıtıdır?", a:"yavaş" }, { t:0, q:"Aşçı mutfakta çalışır; pilot nerede çalışır?", a:"uçakta / kokpitte" },
{ t:0, q:"Erken geçin karşıtıysa, cesur neyin karşıtıdır?", a:"korkak" }, { t:1, q:"Sayfa kitabın parçasıysa, yaprak neyin parçasıdır?", a:"ağacın / bitkinin" },
{ t:1, q:"Elma bir meyveyse, havuç nedir?", a:"sebze" }, { t:1, q:"Çiftçi tarlada çalışır; hakim nerede çalışır?", a:"mahkemede / adliyede" },
{ t:1, q:"Parmak elin parçasıysa, tekerlek neyin parçasıdır?", a:"arabanın / bisikletin" }, { t:1, q:"Serçe bir kuşsa, gül nedir?", a:"çiçek" },
{ t:2, q:"Yağmur ıslatırsa, güneş ne yapar?", a:"ısıtır / kurutur" }, { t:2, q:"Kocaman çok büyük demekse, minicik ne demektir?", a:"çok küçük" },
{ t:2, q:"Makas terzinin aletiyse, stetoskop kimin aletidir?", a:"doktorun" }, { t:2, q:"Ekmek fırında pişer; buz nerede oluşur?", a:"dondurucuda / soğukta" },
{ t:2, q:"Yorgunluk dinlenmeyle geçerse, açlık neyle geçer?", a:"yemek yemekle" } ] };
const PROVERB = { pre:[ { t:0, q:"“Kaplumbağa gibi yürüyor.” Gerçekten kaplumbağa mı? Ne demek?", a:"çok yavaş yürüyor" }, { t:0, q:"“Pamuk gibi yumuşak.” Ne demek istiyor?", a:"çok yumuşak" }, { t:0, q:"“Arı gibi çalışıyor.” Arı mı oldu? Ne demek?", a:"çok çalışıyor" }, { t:0, q:"“Buz gibi soğuk.” Ne demek?", a:"çok soğuk" }, { t:0, q:"“Fil gibi büyük.” Ne demek?", a:"çok büyük" }, { t:0, q:"“Ateş gibi sıcak.” Ne demek?", a:"çok sıcak" }, { t:0, q:"“Deniz gibi mavi.” Ne demek?", a:"masmavi" },
  { t:1, q:"“Tavşan gibi koşuyor.” Ne demek?", a:"çok hızlı koşuyor" }, { t:1, q:"“Aslan gibi güçlü.” Ne demek?", a:"çok güçlü" }, { t:1, q:"“Kar gibi beyaz.” Ne demek?", a:"bembeyaz" }, { t:1, q:"“Tüy gibi hafif.” Ne demek?", a:"çok hafif" }, { t:1, q:"“Kurt gibi acıkmış.” Kurt mu oldu? Ne demek?", a:"çok acıkmış" }, { t:1, q:"“Kedi gibi sessiz.” Ne demek?", a:"hiç ses çıkarmıyor" }, { t:1, q:"“Çelik gibi sağlam.” Ne demek?", a:"çok sağlam" },
  { t:2, q:"“Kuş gibi hafif.” Ne demek?", a:"çok hafif" }, { t:2, q:"“Taş gibi sert.” Ne demek?", a:"çok sert" }, { t:2, q:"“Bal gibi tatlı.” Ne demek?", a:"çok tatlı" }, { t:2, q:"“Sincap gibi çevik.” Ne demek?", a:"çok çevik, hareketli" }, { t:2, q:"“Baykuş gibi uyanık.” Ne demek?", a:"geceleri uyumuyor / çok dikkatli" }, { t:2, q:"“Güneş gibi parlak.” Ne demek?", a:"çok parlak, ışıl ışıl" } ],
  post:[ { t:0, q:"“Etekleri zil çalıyor.” ne demek?", a:"çok seviniyor" }, { t:0, q:"“Ağzı kulaklarına vardı.” ne demek?", a:"çok sevindi, gülümsedi" }, { t:0, q:"“Söylenenlere kulak asmadı.” ne demek?", a:"dinlemedi, önemsemedi" }, { t:0, q:"“Dili tutuldu.” ne demek?", a:"şaşkınlıktan / heyecandan konuşamadı" }, { t:0, q:"“Burnu havada.” ne demek?", a:"kendini beğenmiş" }, { t:0, q:"“Eli kulağında.” ne demek?", a:"çok yakında olacak" }, { t:0, q:"“Gözü yolda.” ne demek?", a:"birini bekliyor" }, { t:0, q:"“Kulağına küpe olsun.” ne demek?", a:"bunu hiç unutma" },
  { t:1, q:"“Damlaya damlaya göl olur.” ne anlatır?", a:"küçük birikimler zamanla büyür" }, { t:1, q:"“Acele işe şeytan karışır.” ne anlatır?", a:"acele edince hata yapılır" }, { t:1, q:"“Bir elin nesi var, iki elin sesi var.” ne anlatır?", a:"birlikte çalışmak daha etkilidir" }, { t:1, q:"“Dost kara günde belli olur.” ne anlatır?", a:"gerçek dost zor zamanda yanında olandır" }, { t:1, q:"“Taşıma suyla değirmen dönmez.” ne anlatır?", a:"başkasının yardımıyla iş uzun süre yürümez" }, { t:1, q:"“Sütten ağzı yanan yoğurdu üfleyerek yer.” ne anlatır?", a:"bir kez zarar gören çok dikkatli olur" }, { t:1, q:"“Vakit nakittir.” ne anlatır?", a:"zaman çok değerlidir" }, { t:1, q:"“Her koyun kendi bacağından asılır.” ne anlatır?", a:"herkes kendi davranışından sorumludur" },
  { t:2, q:"“Sakla samanı, gelir zamanı.” ne anlatır?", a:"gereksiz görünen şey bir gün işe yarar" }, { t:2, q:"“Ayağını yorganına göre uzat.” ne anlatır?", a:"harcamanı gelirine göre ayarla" }, { t:2, q:"“Ağaç yaşken eğilir.” ne anlatır?", a:"eğitim küçük yaşta daha kolaydır" }, { t:2, q:"“İşleyen demir ışıldar.” ne anlatır?", a:"çalışan kişi gelişir, paslanmaz" }, { t:2, q:"“Dağ dağa kavuşmaz, insan insana kavuşur.” ne anlatır?", a:"insanlar bir gün yeniden karşılaşabilir" }, { t:2, q:"“Gülü seven dikenine katlanır.” ne anlatır?", a:"sevdiğin şeyin zorluklarını da kabul edersin" }, { t:2, q:"“Ne ekersen onu biçersin.” ne anlatır?", a:"ne yaparsan sonucunu görürsün" }, { t:2, q:"“Lafla peynir gemisi yürümez.” ne anlatır?", a:"konuşmak yetmez, iş yapmak gerekir" } ] };
const PROVERB_MC = [ /* 0–9 deyimler (kolay) · 10–19 atasözleri (orta) · 20–27 atasözleri (zor); her soruda bir düz anlam tuzağı, bir alakasız seçenek */
["Etekleri zil çalıyor.", "Çok seviniyor.", "Eteğinde zil var.", "Çok yorgun."], ["Ağzı kulaklarına vardı.", "Çok sevindi.", "Ağzı çok büyüdü.", "Acıktı."], ["Dili tutuldu.", "Şaşkınlıktan konuşamadı.", "Dilini eliyle tuttu.", "Çok konuştu."], ["Kulak asmadı.", "Dinlemedi, önemsemedi.", "Kulağına bir şey asmadı.", "Çok iyi dinledi."], ["Burnu havada.", "Kendini beğenmiş.", "Burnu yukarı bakıyor.", "Üşümüş."], ["Eli kulağında.", "Çok yakında olacak.", "Eli kulağına değiyor.", "Duyamıyor."], ["Gözü yolda.", "Birini bekliyor.", "Gözünü yola dikti.", "Yolda kayboldu."], ["Kulağına küpe olsun.", "Bunu hiç unutma.", "Kulağına küpe tak.", "Yeni küpe al."], ["Ağzında bakla ıslanmıyor.", "Sır tutamıyor.", "Ağzında bakla var.", "Çok aç."], ["Başının etini yedi.", "Sürekli ısrar edip bıktırdı.", "Başındaki eti yedi.", "Çok yemek yedi."],
["Damlaya damlaya göl olur.", "Küçük birikimler zamanla büyür.", "Yağmur yağınca göl oluşur.", "Göller hızla kurur."], ["Acele işe şeytan karışır.", "Acele edince hata yapılır.", "Acele eden şeytanla karşılaşır.", "Hızlı çalışan kazanır."], ["Bir elin nesi var, iki elin sesi var.", "Birlikte çalışmak daha etkilidir.", "İki el çırpınca ses çıkar.", "Tek el daha güçlüdür."], ["Dost kara günde belli olur.", "Gerçek dost zor zamanda yanındadır.", "Dostlar karanlıkta görünür.", "Dostlar sadece iyi günde gelir."], ["Taşıma suyla değirmen dönmez.", "Başkasının yardımıyla iş uzun süre yürümez.", "Değirmene su taşınır.", "Su değirmeni hızlandırır."], ["Sütten ağzı yanan yoğurdu üfleyerek yer.", "Bir kez zarar gören çok dikkatli olur.", "Yoğurt üflenerek yenir.", "Süt sıcak içilmez."], ["Vakit nakittir.", "Zaman çok değerlidir.", "Saat satın alınır.", "Para zamanla kazanılır."], ["Her koyun kendi bacağından asılır.", "Herkes kendi davranışından sorumludur.", "Koyunlar bacağından asılır.", "Koyunlar birlikte yürür."], ["Bir çiçekle bahar olmaz.", "Tek bir iyi şey her şeyi değiştirmez.", "Baharda çiçekler açar.", "Çiçekler kışın solar."], ["Üzüm üzüme baka baka kararır.", "İnsan yanındakilerden etkilenir.", "Üzümler olgunlaşınca kararır.", "Üzüm güneşte kurur."],
["Ağaç yaşken eğilir.", "Eğitim küçük yaşta daha kolaydır.", "Islak ağaç kolay bükülür.", "Yaşlı ağaçlar devrilir."], ["Ayağını yorganına göre uzat.", "Harcamanı gelirine göre ayarla.", "Uyurken ayağını yorgandan çıkarma.", "Uzun yorgan al."], ["Sakla samanı, gelir zamanı.", "Gereksiz görünen şey bir gün işe yarar.", "Samanı ahırda sakla.", "Saman zamanla çürür."], ["İşleyen demir ışıldar.", "Çalışan kişi gelişir.", "Demir parlatılınca ışık verir.", "Demir çabuk paslanır."], ["Dağ dağa kavuşmaz, insan insana kavuşur.", "İnsanlar bir gün yeniden karşılaşabilir.", "Dağlar yan yana durur.", "İnsanlar dağa tırmanır."], ["Gülü seven dikenine katlanır.", "Sevdiğin şeyin zorluklarına katlanırsın.", "Güllerin dikeni vardır.", "Diken ele batar."], ["Ne ekersen onu biçersin.", "Ne yaparsan sonucunu görürsün.", "Tarlaya tohum ekilir.", "Ekinler yazın biçilir."], ["Lafla peynir gemisi yürümez.", "Konuşmak yetmez, iş yapmak gerekir.", "Gemiyle peynir taşınır.", "Peynir gemide bozulur."] ];
function pmcBuild(){ const t = currentCombo().t, pool = t === 0 ? PROVERB_MC.slice(0, 10) : t === 1 ? PROVERB_MC.slice(10, 20) : PROVERB_MC.slice(20);
return shuffleArray(pool).slice(0, 6).map(([p, ok, lit, un]) => qzMake(`<div style="font-size:21px;font-weight:900;color:var(--teal-dark);text-align:center">“${p}”</div>`, [ok, lit, un].map(x => `<b style="font-size:16px">${x}</b>`), 0, { prompt:"<b>Ne anlama geliyor?</b>", fixed:true, text:true, raw:true })); }
const ABSURD = { pre:[ ["Kedi miyavlar.", true], ["Balık ağaca çıktı.", false], ["Kuşlar uçar.", true], ["Ayakkabılarımı ellerime giydim.", false], ["Yağmur yağınca şemsiye açarız.", true],
["İnek havladı.", false], ["Elmayı yedim.", true], ["Güneş gece doğar.", false], ["Dondurma sıcak bir yiyecektir.", false], ["Dişlerimizi diş fırçasıyla fırçalarız.", true],
["Araba gökyüzünde yüzdü.", false], ["Kışın kar yağar.", true],
["Köpek havlar.", true], ["Balık suda yüzer.", true], ["Elbiselerimizi dolaba koyarız.", true], ["Yemekten önce ellerimizi yıkarız.", true],
["Kedi uçtu.", false], ["Çorbayı çatalla içtim.", false], ["Kar sıcaktır.", false], ["Şapkamı ayağıma taktım.", false] ],
post:[ ["Kerem karanlıkta kitap okumak için perdeleri sıkıca kapattı.", false], ["Mert su içmek için boş bardağı ağzına götürdü.", false], ["Ece sıcak çaya, soğusun diye kaynar su ekledi.", false],
["Islanmamak için yağmurluğunu giydi.", true], ["Daha iyi görmek için gözlüğünü çıkardı.", false], ["Erken uyanmak için alarm kurdu.", true],
["Ali, kardeşinden büyük; kardeşi de Ali'den büyük.", false], ["Susadığı için bir bardak su içti.", true], ["Buzlar erisin diye dondurucuya koydu.", false],
["Karanlıkta yolunu bulmak için el fenerini yaktı.", true], ["Pazartesiden sonra pazar gelir.", false], ["Çiçekleri solmasın diye suladı.", true] ] };
const ABSURD_POST = [
[ /* Başlangıç: tek cümle, açık nesne–eylem uyumsuzluğu */
["Ayşe çorbayı kaşıkla içti.", true], ["Ayşe çorbayı çatalla içti.", false],
["Mert ayakkabılarını ayağına giydi.", true], ["Mert ayakkabılarını ellerine giydi.", false],
["Kedi ağaca tırmanarak çıktı.", true], ["Kedi ağaca uçarak çıktı.", false],
["Ali dişlerini diş fırçasıyla fırçaladı.", true], ["Ali dişlerini tarakla fırçaladı.", false],
["Zeynep kitabı masada oturarak okudu.", true], ["Zeynep kitabı kulağıyla okudu.", false],
["Kerem topu elleriyle yakaladı.", true], ["Kerem topu burnuyla yakaladı.", false],
["Elif ekmeği fırında pişirdi.", true], ["Elif ekmeği buzdolabında pişirdi.", false],
["Can yüzmeyi havuzda öğrendi.", true], ["Can yüzmeyi çölde öğrendi.", false],
["Defne saçını tarakla taradı.", true], ["Defne saçını makasla taradı.", false],
["Dede bahçeye çiçek dikti.", true], ["Dede elma ağacından armut topladı.", false] ],
[ /* Orta: amaç–eylem uyumsuzluğu, çıkarım gerekir */
["Islanmamak için yağmurluğunu giydi.", true], ["Erken uyanmak için alarm kurdu.", true], ["Susadığı için bir bardak su içti.", true], ["Karanlıkta yolunu bulmak için el fenerini yaktı.", true], ["Çiçekleri solmasın diye suladı.", true],
["Üşüdüğü için pencereyi kapattı.", true], ["Daha iyi duymak için sesi biraz açtı.", true], ["Dişleri çürümesin diye her akşam fırçaladı.", true], ["Düşerse başı zarar görmesin diye bisiklette kask taktı.", true], ["Geç kalmamak için erken yola çıktı.", true],
["Kerem karanlıkta kitap okumak için perdeleri sıkıca kapattı.", false], ["Mert su içmek için boş bardağı ağzına götürdü.", false], ["Ece sıcak çaya, soğusun diye kaynar su ekledi.", false], ["Daha iyi görmek için gözlüğünü çıkardı.", false], ["Ali, kardeşinden büyük; kardeşi de Ali'den büyük.", false],
["Buzlar erisin diye dondurucuya koydu.", false], ["Pazartesiden sonra pazar gelir.", false], ["Zeynep üşüdüğü için pencereyi sonuna kadar açtı.", false], ["Can sessizlik istediği için müziği sonuna kadar açtı.", false], ["Deniz uykusu gelsin diye akşam kahve içti.", false] ,
["Ellerini kurulamak için havluyu aldı.", true], ["Oyuncakları kırılmasın diye kutuya yerleştirdi.", true], ["Kaybolmamak için haritaya baktı.", true], ["Güneşten korunmak için şapkasını taktı.", true], ["Kardeşi uyusun diye sesini alçalttı.", true],
["Ellerini kurulamak için onları musluğun altına tuttu.", false], ["Yerdeki suyu kurulamak için üstüne biraz daha su döktü.", false], ["Çabuk kurusun diye çamaşırları kovaya koydu.", false], ["Sesi daha iyi duymak için kulaklarını kapattı.", false], ["Karnı doysun diye boş tabağa baktı.", false]],
[ /* Zor: iki cümle; ilki amacı, ikincisi davranışı verir */
["Ece serinlemek istiyordu. İnce bir tişört giyip gölgeye oturdu.", true], ["Ece serinlemek istiyordu. Kalın montunu giyip güneşin altına oturdu.", false],
["Kerem'in karnı çok açtı. Tabağındaki yemeğin hepsini yedi.", true], ["Kerem'in karnı çok açtı. Yemeğe hiç dokunmadan masadan kalkıp 'doydum' dedi.", false],
["Ali ödevini bitirmek istiyordu. Kalemini alıp masaya oturdu.", true], ["Ali ödevini bitirmek istiyordu. Kalemine hiç dokunmadı, akşam 'ödevim bitti' dedi.", false],
["Zeynep karanlıkta göremiyordu. Lambayı açtı.", true], ["Zeynep karanlıkta göremiyordu. Daha iyi görmek için gözlerini sıkıca kapattı.", false],
["Mert uyumak istiyordu. Işıkları kapatıp yatağına yattı.", true], ["Mert uyumak istiyordu. Işıkları açıp yüksek sesle müzik çaldı.", false],
["Defne bisikletle geziye çıkacaktı. Tekerleklerin havasını kontrol edip kaskını taktı.", true], ["Defne bisikletle geziye çıkacaktı. Bisikletin tekerleklerini söküp yola çıktı.", false],
["Can bitkisinin büyümesini istiyordu. Onu güneş gören pencerenin önüne koydu.", true], ["Can bitkisinin büyümesini istiyordu. Onu dolabın içine, karanlığa koydu.", false],
["Elif ısınmak istiyordu. Sıcak çay içip battaniyeye sarıldı.", true], ["Elif ısınmak istiyordu. Soğuk suyla duş alıp balkona çıktı.", false],
["Deniz denize girecekti. Mayosunu giyip havlusunu aldı.", true], ["Deniz denize girecekti. Mayosunu çıkarıp üstüne kalın kazak giydi.", false],
["Ayşe sınıfta sessizlik istiyordu. Parmağını dudağına götürüp 'şşş' dedi.", true], ["Ayşe sınıfta sessizlik istiyordu. Davulu alıp olanca gücüyle çalmaya başladı.", false],
["Ali kardeşine yardım etmek istiyordu. Kardeşinin çantasını onun yerine taşıdı.", true], ["Ali kardeşine yardım etmek istiyordu. Kardeşinin oyuncaklarını saklayıp güldü.", false],
["Zeynep sınavda başarılı olmak istiyordu. Her akşam düzenli çalıştı.", true], ["Zeynep sınavda başarılı olmak istiyordu. Kitaplarını hiç açmadan bütün gün televizyon izledi.", false],
["Kerem otobüsü kaçırmak istemiyordu. Durağa erkenden gitti.", true], ["Kerem otobüsü kaçırmak istemiyordu. Otobüs gittikten sonra evden çıktı.", false],
["Defne kedisini mutlu etmek istiyordu. Onu sevip mamasını verdi.", true], ["Defne kedisini mutlu etmek istiyordu. Kedinin mama kabını boşaltıp sakladı.", false],
["Mert kitabın sonunu merak ediyordu. Son sayfaları okumaya devam etti.", true], ["Mert kitabın sonunu merak ediyordu. Kitabı kapatıp bir daha hiç açmadı.", false] ] ];
function absBuild(){ const t = currentCombo().t, L = isPre() ? ABSURD.pre : ABSURD_POST[Math.min(t, 2)], N = isPre() ? [10, 12, 14][t] : [16, 20, 24][t];
const yes = shuffleArray(L.filter(x => x[1])), no = shuffleArray(L.filter(x => !x[1])), out = [];
for(let i = 0; i < N; i++){ const s = i % 2 ? yes[Math.floor(i / 2) % yes.length] : no[Math.floor(i / 2) % no.length];
out.push({ stim: isPre() ? "" : `<div style="font-size:${!isPre() && t === 2 ? 17 : 19}px;font-weight:800;text-align:center;max-width:340px;margin:0 auto;line-height:1.35">${s[0]}</div>`, raw:true, opts:[`<b style="font-size:20px">✓ Doğru</b>`, `<b style="font-size:20px">✗ Saçma</b>`], ans: s[1] ? 0 : 1, say: s[0], replay:true, fixed:true, text:true, prompt: !isPre() && t === 2 ? "İki cümleyi oku: <b>davranış amaca uyuyor mu?</b>" : "Bu cümle <b>doğru mu, saçma mı?</b>" }); }
return shuffleArray(out); }
const CP_BALL = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 9}" fill="#F5A524" stroke="#C77800" stroke-width="2"/>`;
const CP_TABLE = `<rect x="22" y="50" width="56" height="7" rx="2" fill="#B9773A"/><rect x="26" y="57" width="5" height="33" fill="#8B5A2B"/><rect x="69" y="57" width="5" height="33" fill="#8B5A2B"/>`;
/* KURAL (gerçek nesne): Kavram Bilgisi'nde top–kutu ilişkileri (önünde, arkasında, arasında, dışında) kullanıcının kutu görseli ve gerçek top resmiyle; elma sayma gerçek elma ve hasır sepetle çizilir. Görsel yoksa eski çizim yedektir. Masa, açık kutu ve dolu/boş bardak görselleri gelince onlar da gerçek nesneye geçer */
function cpImg(key, x, y, w, h){ const u = gimg(key); return u ? `<image href="${u}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMax meet"/>` : ""; }
function cpDrawReal(rel, famIn){ if(!gimg("cpBall")) return null;
  { const v0 = (inner) => `<svg viewBox="0 0 100 100" width="100%" height="100%">${inner}</svg>`, BALL0 = (cx, cy, d) => cpImg("cpBall", cx - d / 2, cy - d / 2, d, d), SH0 = (cx, w) => `<ellipse cx="${cx}" cy="91" rx="${w / 2}" ry="2.6" fill="rgba(0,0,0,.12)"/>`, T = (x, w) => cpImg("table", x, 90 - w * 0.664, w, w * 0.664), OB = (x, w) => cpImg("boxOpen", x, 90 - w * 0.763, w, w * 0.763);
    if(["on","under","next"].includes(rel)){ if(!gimg("table")) return null;
      if(rel === "on") return v0(SH0(46, 64) + T(14, 64) + BALL0(46, 90 - 64 * 0.664 - 7, 16));
      if(rel === "under") return v0(SH0(46, 64) + T(14, 64) + BALL0(46, 82, 16));
      return v0(SH0(40, 56) + SH0(87, 14) + T(12, 56) + BALL0(87, 82, 16)); }
    if(rel === "in" || (rel === "out" && famIn)){ if(!gimg("boxOpen")) return null;
      if(rel === "in") return v0(SH0(50, 62) + OB(19, 62) + BALL0(50, 90 - 62 * 0.763 + 62 * 0.763 * 0.36, 16));   /* top kutunun içinde: ön kapağın üstünde görünür */
      return v0(SH0(38, 50) + SH0(86, 16) + OB(13, 50) + BALL0(86, 82, 16)); } }
  if(!gimg("box")) return null; const v = (inner) => `<svg viewBox="0 0 100 100" width="100%" height="100%">${inner}</svg>`; const B = (x, y, w) => cpImg("box", x, y + w * 0.07, w, w * 0.78),   /* kutu resminin altındaki boşluk kadar aşağı: zemine otursun */ BALL = (cx, cy, d) => cpImg("cpBall", cx - d / 2, cy - d / 2, d, d), SH = (cx, w) => `<ellipse cx="${cx}" cy="91" rx="${w / 2}" ry="2.6" fill="rgba(0,0,0,.12)"/>`;
  switch(rel){
    case "front":  return v(SH(50, 60) + B(20, 90 - 60 * 0.78, 60) + BALL(50, 80, 22));
    case "behind": return v(SH(50, 60) + BALL(62, 40, 24) + B(20, 90 - 60 * 0.78, 60));
    case "out":    return v(SH(34, 46) + SH(84, 18) + B(11, 90 - 46 * 0.78, 46) + BALL(84, 81, 18));
    case "between":return v(SH(20, 30) + SH(80, 30) + B(5, 90 - 30 * 0.78, 30) + B(65, 90 - 30 * 0.78, 30) + BALL(50, 82, 18));
    case "left":   return v(SH(53, 30) + SH(83, 30) + B(38, 90 - 30 * 0.78, 30) + B(68, 90 - 30 * 0.78, 30) + BALL(16, 82, 18));
    case "ontop":  return v(SH(20, 30) + SH(80, 30) + B(5, 90 - 30 * 0.78, 30) + B(65, 90 - 30 * 0.78, 30) + BALL(20, 90 - 30 * 0.78 + 30 * 0.07 - 8, 18));
  } return null; }
function cpDraw(rel, oldStyle, famIn){ if(!oldStyle){ const r = cpDrawReal(rel, famIn); if(r) return r; } const v = (inner) => `<svg viewBox="0 0 100 100" width="100%" height="100%">${inner}</svg>`;
const back = `<rect x="30" y="44" width="40" height="10" fill="#9DB7D6"/>`, front = (h) => `<rect x="30" y="${h}" width="40" height="${88 - h}" fill="#5B8BD0"/>`;
switch(rel){
case "on": return v(CP_TABLE + CP_BALL(50, 41));
case "under": return v(CP_TABLE + CP_BALL(50, 81));
case "next": return v(CP_TABLE + CP_BALL(10, 81));
case "in": return v(CP_CRATE_OPEN + CP_BALL(48, 58, 10) + CP_CRATE_FRONT);
case "out": return v(CP_CRATE_OPEN + CP_CRATE_FRONT + CP_BALL(86, 79, 10));
case "front": return v(`<rect x="32" y="34" width="36" height="54" fill="#5B8BD0"/>` + CP_BALL(52, 74, 11));
case "behind": return v(CP_BALL(66, 38, 12) + `<rect x="32" y="34" width="36" height="54" fill="#5B8BD0"/>`);
case "between": return v(`<rect x="8" y="50" width="26" height="38" fill="#5B8BD0"/><rect x="66" y="50" width="26" height="38" fill="#5B8BD0"/>` + CP_BALL(50, 78, 10));
case "left": return v(`<rect x="38" y="50" width="26" height="38" fill="#5B8BD0"/><rect x="68" y="50" width="26" height="38" fill="#5B8BD0"/>` + CP_BALL(16, 78, 10));
case "ontop": return v(`<rect x="8" y="50" width="26" height="38" fill="#5B8BD0"/><rect x="66" y="50" width="26" height="38" fill="#5B8BD0"/>` + CP_BALL(21, 39, 10));
} }
const CP_CRATE_OPEN = `<polygon points="24,56 34,38 76,38 66,56" fill="#C9DCF2" stroke="#3F6FB5" stroke-width="2"/><polygon points="66,56 76,38 76,74 66,88" fill="#4677BF"/>`;
const CP_CRATE_FRONT = `<rect x="24" y="56" width="42" height="32" fill="#5B8BD0" stroke="#3F6FB5" stroke-width="2"/>`;
const CP_PHRASE = { on:"masanın üstünde", under:"masanın altında", next:"masanın yanında", in:"kutunun içinde", out:"kutunun dışında", front:"kutunun önünde", behind:"kutunun arkasında", between:"iki kutunun arasında" };
const CP_FAM = { on:["on","under","next"], under:["on","under","next"], next:["on","under","next"], in:["in","out"], out:["in","out"], front:["front","behind","out"], behind:["front","behind","out"], between:["between","left","ontop"] };
function cpApples(n){ if(gimg("basket") && (typeof CUTOUT_IMAGES !== "undefined" && CUTOUT_IMAGES["f-apple"])){ const A = CUTOUT_IMAGES["f-apple"]; const pts = [[34,44],[52,42],[70,44],[43,52],[61,52],[26,52],[78,52],[52,34]].slice(0, n); return `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="93" rx="38" ry="3" fill="rgba(0,0,0,.12)"/>${cpImg("basket", 6, 22, 88, 72)}${pts.map(q => `<image href="${A}" x="${q[0] - 9}" y="${q[1] - 9}" width="18" height="18"/>`).join("")}</svg>`; } const pts = [[30,40],[55,40],[80,40],[30,68],[55,68],[80,68],[42,54],[68,54]].slice(0, n); return `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="10" y="22" width="80" height="66" rx="8" fill="none" stroke="#B9773A" stroke-width="4"/>${pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="#E5484D"/><rect x="${p[0] - 1}" y="${p[1] - 13}" width="2.5" height="6" fill="#2F7D32"/>`).join("")}</svg>`; }
function cpGlass(f){ const gk = f >= 0.9 ? "glassFull" : f > 0.1 ? "glassHalf" : "glassEmpty"; if(gimg(gk)) return `<svg viewBox="0 0 100 100" width="100%" height="100%">${cpImg(gk, 8, 6, 84, 88)}</svg>`; return cpGlassDraw(f); }
function cpGlassDraw(f){ const h = 60 * f; return `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M30 18 L36 88 L64 88 L70 18" fill="none" stroke="#6B8AA6" stroke-width="4"/>${f > 0 ? `<path d="M${36 - 6 * f * 0} ${88 - h} L64 ${88 - h} L64 88 L36 88 Z" fill="#7CC4F2" opacity=".85"/>` : ""}</svg>`; }
function cpTrials(){ const t = currentCombo().t, pre = isPre();
let types = pre ? ["pos","pair","qty","pair","size","fill"].concat(t > 0 ? ["pos"] : []) : ["pos","pair","pos","qty","size","fill","logic","pair"]; if(!gimg("glassFull")) types = types.map(x => x === "fill" ? "size" : x);   /* KURAL: Kavram Bilgisi'nde çizim gösterilmez; gerçek görseli olmayan soru türü sorulmaz (bardak görselleri gelene kadar dolu/boş yerine büyük/küçük) */
const N = pre ? [6, 7, 7][t] : [7, 8, 8][t], out = [], usedPair = new Set();
for(let k = 0; k < N; k++){ const ty = types[k % types.length]; let opts, ans = 0, say, prompt;
if(ty === "pair"){ const cand = CP_PAIRS.filter(x => !usedPair.has(x[0])), P = randomItem(cand.length ? cand : CP_PAIRS); usedPair.add(P[0]); const side = Math.random() < 0.5 ? 0 : 1;
opts = [qzPic(CONCEPT_IMAGES[P[0]]), qzPic(CONCEPT_IMAGES[P[1]])]; ans = side; say = P[2 + side]; prompt = P[4 + side]; }
else if(ty === "pos"){ const pool = pre ? [["on","under","in","out"], ["on","under","next","in","out"], ["on","under","next","in","out","front","behind"]][Math.min(t, 2)] : [["on","under","next","in","out"], ["on","under","next","in","out","front","behind"], ["on","under","next","in","out","front","behind","between"]][Math.min(t, 2)]; /* Zor: önünde/arkasında (öncesi), arasında (sonrası) */
const realOk = (r) => ["front","behind","out","between"].includes(r) || (["on","under","next"].includes(r) && gimg("table")) || (r === "in" && gimg("boxOpen")); const pool2 = pool.filter(realOk); const rel = randomItem(pool2.length ? pool2 : pool), fam = CP_FAM[rel].slice(0, pre ? 3 : 3); const oldStyle = fam.includes("in") && !gimg("boxOpen"); opts = fam.map(r => cpDraw(r, oldStyle, fam.includes("in")));   /* seçenekler hep aynı biçimde: içinde/dışında ikilisi açık kutu görseli gelene kadar çizimle */ ans = fam.indexOf(rel); say = `Topun ${CP_PHRASE[rel]} olduğu resmi göster.`; prompt = `Top <b>${CP_PHRASE[rel]}</b>`; }
else if(ty === "qty"){ const mode = pre ? randomItem(["most","least"]) : randomItem(["most","least","none"]); let ns = shuffleArray(pre ? [1, 3, 6] : [0, 2, 4, 7]);
if(mode !== "none" && !pre) ns = shuffleArray([1, 3, 5, 7]); opts = ns.map(n => cpApples(n));
ans = mode === "most" ? ns.indexOf(Math.max(...ns)) : mode === "least" ? ns.indexOf(Math.min(...ns)) : ns.indexOf(0);
const kap = gimg("basket") ? "sepet" : "kutu", kapI = gimg("basket") ? "sepeti" : "kutuyu"; say = mode === "most" ? `En çok elma olan ${kapI} göster.` : mode === "least" ? `En az elma olan ${kapI} göster.` : `Hiç elma olmayan ${kapI} göster.`; prompt = mode === "most" ? `<b>En çok</b> elma olan ${kap}` : mode === "least" ? `<b>En az</b> elma olan ${kap}` : `<b>Hiç</b> elma olmayan ${kap}`; }
else if(ty === "size"){ const p = randomItem(picPool()), sc = shuffleArray(pre ? [0.45, 0.72, 1] : [0.45, 0.62, 0.8, 1]), big = Math.random() < 0.5;
opts = sc.map(s => qzPic(p.src, s)); ans = sc.indexOf(big ? Math.max(...sc) : Math.min(...sc)); say = big ? "En büyük olanı göster." : "En küçük olanı göster."; prompt = big ? "<b>En büyük</b> olan" : "<b>En küçük</b> olan"; }
else if(ty === "fill"){ const modes = pre ? ["full","empty"] : ["full","empty","half"], m = randomItem(modes), fs = { full:1, empty:0, half:0.5 };
const set = shuffleArray(pre ? ["full","empty", "half"] : ["full","empty","half"]); opts = set.map(x => cpGlass(fs[x])); ans = set.indexOf(m);
say = m === "full" ? "Dolu bardağı göster." : m === "empty" ? "Boş bardağı göster." : "Yarısına kadar dolu bardağı göster."; prompt = m === "full" ? "<b>Dolu</b> bardak" : m === "empty" ? "<b>Boş</b> bardak" : "<b>Yarısına kadar dolu</b> bardak";
if(pre && m !== "half"){ opts = opts.filter((o, i) => set[i] !== "half"); ans = set.filter(x => x !== "half").indexOf(m); } }
else { const neg = Math.random() < 0.5, red = ACC.kirmizi, blue = ACC.mavi;
if(!neg){ const combos = shuffleArray([[red, 1], [red, 0.55], [blue, 1], [blue, 0.55]]); opts = combos.map(([c, s]) => `<div style="width:100%;height:100%;transform:scale(${s})">${shapeSVG("star", c)}</div>`); ans = combos.findIndex(([c, s]) => c === red && s === 1);
say = "Hem kırmızı hem büyük olanı göster."; prompt = "<b>Hem kırmızı hem büyük</b> olan"; }
else { const cols = shuffleArray([red, red, red, blue]), shs = shuffleArray(["circle", "square", "triangle", "star"]); opts = cols.map((c, i) => shapeSVG(shs[i], c)); ans = cols.indexOf(blue);   /* KURAL: "olmayan" sorusunda kırmızı çeldiriciler farklı şekillerdir; iki seçenek birebir aynı olmaz */ say = "Kırmızı olmayanı göster."; prompt = "Kırmızı <b>olmayan</b>"; } }
if(out.length && out[out.length - 1].say === say){ k--; continue; }
const o = shuffleArray(opts.map((h, i) => i)); out.push({ stim:"", opts: o.map(i => opts[i]), ans: o.indexOf(ans), say, prompt, replay:true, fixed:true, cell:120 }); }
return out; }
const INFER = {
pre:[ { t:0, q:"Ece ağlıyor ve dizini tutuyor. Ne olmuş olabilir?", a:"düşmüş, dizini incitmiş" }, { t:0, q:"Ali montunu, beresini ve eldivenini giydi. Hava nasıl?", a:"soğuk" },
{ t:0, q:"Kedi mama kabının başında miyavlıyor. Neden?", a:"acıkmış" }, { t:1, q:"Annem eve geldi, şemsiyesi sırılsıklam. Dışarıda hava nasıl?", a:"yağmurlu" },
{ t:1, q:"Can'ın tabağı bomboş, 'Karnım doydu' diyor. Ne yapmış?", a:"yemeğini bitirmiş" }, { t:1, q:"Defne'nin elinde balon vardı; şimdi gökyüzüne bakıp üzülüyor. Ne oldu?", a:"balonu uçmuş" },
{ t:2, q:"Bebek esniyor, gözlerini ovuşturuyor. Ne istiyor?", a:"uyumak" }, { t:2, q:"Yerde süt var, bardak devrilmiş, kedi yalanıyor. Ne olmuş?", a:"kedi bardağı devirmiş, sütü içiyor" } ],
post:[ { t:0, q:"Mert sınıfa girince herkes 'Sürpriz!' diye bağırdı; masada mumlu bir pasta vardı. Neden?", a:"doğum günü kutlanıyor" },
{ t:0, q:"Zeynep pencereden baktı, her yer bembeyazdı; botlarını giydi. Ne olmuş?", a:"kar yağmış" },
{ t:0, q:"Kerem'in bisiklet tekerleği sönük, elinde pompa var. Ne yapacak?", a:"tekeri şişirecek" },
{ t:1, q:"Tahtada 'Bugünkü gezi iptal' yazıyor, çocuklar üzgün. Neden üzgünler?", a:"geziye gidemeyecekler" },
{ t:1, q:"Burak'ın ayakkabıları çamurlu, şemsiyesi ıslak. Nereden geliyor?", a:"yağmurlu havada dışarıdan" },
{ t:1, q:"Ayşe 'Alo?' dedi, bekledi, sonra telefonu indirip kaşlarını çattı. Ne olmuş olabilir?", a:"karşıdaki ses vermedi / hat kesildi" },
{ t:2, q:"Ali sabah hiç konuşmadı, kahvaltıyı yarım bıraktı, karnını tutuyor. Neden olabilir?", a:"karnı ağrıyor, hasta olabilir" },
{ t:2, q:"Ece yarışmadan sonra madalyasını öptü, gözleri doldu. Ne hissediyor?", a:"mutlu / gururlu; sevinçten duygulanmış" },
{ t:2, q:"Kapının önünde çamurlu küçük pati izleri ve devrilmiş bir saksı var. Ne olmuş olabilir?", a:"bir kedi ya da köpek girip saksıyı devirmiş" } ] };
const INFER_MC = [ ["Mert sınıfa girince herkes 'Sürpriz!' diye bağırdı; masada mumlu bir pasta vardı.", "Neden?", "Doğum günü kutlanıyor.", "Mert sınıfa geç kaldı.", "Pasta satılıyor."],
["Zeynep pencereden baktı, her yer bembeyazdı; botlarını giydi.", "Ne olmuş?", "Kar yağmış.", "Evler boyanmış.", "Güneş açmış."],
["Kerem'in bisiklet tekerleği sönük, elinde pompa var.", "Ne yapacak?", "Tekeri şişirecek.", "Bisikleti satacak.", "Pompayla oynayacak."],
["Tahtada 'Bugünkü gezi iptal' yazıyor, çocuklar üzgün.", "Neden üzgünler?", "Geziye gidemeyecekler.", "Tahta kirli.", "Gezi çok uzun sürdü."],
["Burak'ın ayakkabıları çamurlu, şemsiyesi ıslak.", "Nereden geliyor?", "Yağmurlu havada dışarıdan.", "Banyodan.", "Uyanmış, yataktan."],
["Ali sabah hiç konuşmadı, kahvaltıyı yarım bıraktı, karnını tutuyor.", "Neden olabilir?", "Karnı ağrıyor.", "Çok acıkmış.", "Şarkı söylemek istiyor."],
["Ece yarışmadan sonra madalyasını öptü, gözleri doldu.", "Ne hissediyor?", "Mutlu ve gururlu.", "Kızgın.", "Uykulu."],
["Kapının önünde çamurlu küçük pati izleri ve devrilmiş bir saksı var.", "Ne olmuş olabilir?", "Bir hayvan girip saksıyı devirmiş.", "Saksı kendi kendine yürümüş.", "Yağmur yağmamış."],
["Bahçedeki çamaşırlar ıslandı, toprak çamur oldu, gökyüzü griydi.", "Ne olmuş?", "Yağmur yağmış.", "Çamaşırlar yıkanmış.", "Güneş açmış."],
["Öğretmen 'Kitaplarınızı kapatın, kalemlerinizi alın' dedi ve kâğıt dağıttı.", "Ne olacak?", "Sınav yapılacak.", "Teneffüse çıkılacak.", "Resim boyanacak."] ];
/* Çıkarım Seç düzeyleri: Başlangıç tek ipucu · Orta iki ipucu birleştirilir (mevcut 10 durum + 10) · Zor iki cümle, ilk cümle yanıltıcı izlenim verir */
const INFER_MC_EASY = [["Ali'nin dişleri sızlıyor.","Ne yapmalı?","Dişçiye gitmeli.","Daha çok şeker yemeli.","Koşmalı."],
["Zeynep esniyor ve gözlerini ovuşturuyor.","Ne istiyor?","Uyumak.","Yüzmek.","Resim yapmak."],
["Kedi mama kabının başında miyavlıyor.","Ne istiyor?","Yemek.","Uyumak.","Banyo yapmak."],
["Kerem'in karnı guruldadı.","Ne hissediyor?","Açlık.","Yorgunluk.","Korku."],
["Ece titriyor ve ellerini ovuşturuyor.","Nasıl hissediyor?","Üşüyor.","Terliyor.","Gülüyor."],
["Bahçedeki ağaçların yaprakları sarardı ve dökülüyor.","Hangi mevsim?","Sonbahar.","Yaz.","İlkbahar."],
["Mert bavulunu hazırladı.","Ne yapacak?","Yolculuğa çıkacak.","Ders çalışacak.","Uyuyacak."],
["Can'ın dizi kanıyor.","Ne olmuş?","Düşmüş.","Uyumuş.","Şarkı söylemiş."],
["Elif'in gözleri doldu, dudakları titriyor.","Ne hissediyor?","Üzgün.","Mutlu.","Aç."],
["Sokak lambaları yandı, gökyüzü karardı.","Günün hangi zamanı?","Akşam.","Öğle.","Sabah."],
["Fırından mis gibi ekmek kokusu geliyor.","Ne olmuş?","Ekmek pişmiş.","Ekmek bozulmuş.","Fırın kapanmış."],
["Deniz'in burnu akıyor ve hapşırıyor.","Ne olmuş?","Üşütmüş.","Çok gülmüş.","Koşmuş."],
["Çocuklar formalarını giydi, hakem düdüğü çaldı.","Ne başlıyor?","Maç.","Ders.","Uyku."],
["Köpek kapıya koşup kuyruğunu sallıyor.","Ne olmuş?","Sahibi gelmiş.","Köpek hastalanmış.","Kapı kilitlenmiş."],
["Ayşe sabah alarmı duymadı ve geç uyandı.","Ne olacak?","Okula geç kalacak.","Okula erken gidecek.","Tatile çıkacak."],
["Burak terden sırılsıklam, nefes nefese.","Ne yapmış?","Koşmuş.","Uyumuş.","Kitap okumuş."],
["Mutfaktan tencere tıkırtısı ve güzel bir koku geliyor.","Ne oluyor?","Yemek pişiyor.","Bulaşık yıkanıyor.","Pencere açılıyor."],
["Yoldaki arabalar durdu, ışık kırmızı yandı.","Neden durdular?","Kırmızı ışıkta beklemek gerekir.","Yol bitmiş.","Arabalar bozulmuş."],
["Ece sobaya dokundu ve elini hemen çekti.","Neden?","Soba sıcaktı.","Soba soğuktu.","Ece eldiven giymişti."],
["Zil çaldı, çocuklar sevinçle bahçeye koştu.","Ne oldu?","Teneffüs başladı.","Ders başladı.","Yağmur yağdı."]];
const INFER_MC_MID_EXTRA = [["Masada boş bir süt bardağı ve ekmek kırıntıları var; kedi masanın altında uyuyor.","Ne olmuş?","Biri kahvaltı yapmış.","Kedi sütü dökmüş.","Masa yeni alınmış."],
["Zeynep'in çantasında havlu ve mayo var, saçları ıslak.","Nereden geliyor?","Havuzdan.","Kütüphaneden.","Sinemadan."],
["Dışarıda kar yağıyor; Kerem kısa kollu tişörtle çıktı ve hemen geri döndü.","Neden geri döndü?","Üşüdü.","Topunu unuttu.","Acıktı."],
["Ece sınav kâğıdını aldı; yüzünde kocaman bir gülümseme, kâğıtta kırmızı bir yıldız var.","Ne olmuş?","Sınavı iyi geçmiş.","Sınava girmemiş.","Kâğıt yırtılmış."],
["Mert'in kolunda alçı var; bisikleti garajda kırık duruyor.","Ne olmuş?","Bisikletten düşmüş.","Yüzmeyi öğrenmiş.","Bisikleti yeni almış."],
["Köpek bütün gün havlamadı, mamasına dokunmadı, köşede yatıyor.","Ne olabilir?","Hasta olabilir.","Çok mutlu.","Oyun oynuyor."],
["Elif saatine baktı, çantasını kaptı ve koşarak çıktı.","Neden koştu?","Geç kalıyor.","Yorgun.","Uyumak istiyor."],
["Odada mum ışığı var; lambalar yanmıyor, buzdolabı sessiz.","Ne olmuş?","Elektrik kesilmiş.","Gece olmuş.","Buzdolabı dolmuş."],
["Can'ın parmakları boyalı, önünde ıslak bir resim duruyor.","Ne yapmış?","Resim yapmış.","Ellerini yıkamış.","Yemek yemiş."],
["Bahçedeki kuş yuvası boş; yerde kırık yumurta kabukları var, dalda cıvıldayan yavrular duyuluyor.","Ne olmuş?","Yavrular yumurtadan çıkmış.","Kuş yuvayı terk etmiş.","Yumurtalar pişmiş."]];
const INFER_MC_HARD = [["Ayşe sabah güneşli havada evden çıktı. Eve döndüğünde saçları ıslaktı ve elinde yeni aldığı bir şemsiye vardı.","Ne olmuş?","Gün içinde yağmur yağmış.","Ayşe havuza girmiş.","Ayşe saçını yıkamış."],
["Kerem'in kalemi yoktu, ödevine başlayamadı. Ertesi sabah defterinde ödev baştan sona yazılmıştı.","Ne olmuş olabilir?","Biri ona kalem vermiş.","Ödev kendiliğinden yazılmış.","Kerem ödevi unutmuş."],
["Mutfakta kedinin mama kabı bomboş. Kedi yine de miyavlamıyor, köşesinde keyifle uyuyor.","Ne olmuş?","Kedi mamasını yemiş.","Kedi çok aç.","Mama kabı kaybolmuş."],
["Zeynep koşu yarışında en arkada bitirdi. Bitiş çizgisinde herkes onu alkışladı.","Neden alkışlandı?","Pes etmeden yarışı bitirdiği için.","Birinci olduğu için.","Yarış iptal olduğu için."],
["Dede bahçeye tohum ekti ve her gün suladı. Haftalar sonra bahçede yemyeşil fideler belirdi.","Ne olmuş?","Tohumlar filizlenmiş.","Dede fideleri satın almış.","Yağmur fideleri getirmiş."],
["Mert'in odasının ışığı gece yarısı hâlâ yanıyordu. Sabah kahvaltıda masaya başını koyup uyuyakaldı.","Neden?","Gece geç yatmış.","Kahvaltıyı sevmemiş.","Sabah erken kalkmış."],
["Ece'nin kardeşi okuldan ağlayarak geldi. Ece ona sıkıca sarıldı, sonra ikisi birlikte oyun oynadı.","Ece ne yapmış?","Kardeşini teselli etmiş.","Kardeşini ağlatmış.","Kardeşini okula götürmüş."],
["Sabah bahçede hiç ayak izi yoktu. Öğleden sonra kapıdan bahçe kapısına kadar çamurlu büyük izler uzanıyordu.","Ne olmuş?","Biri bahçeye girmiş.","Hiç kimse gelmemiş.","Yağmur izleri silmiş."],
["Ali bütün hafta yüzme dersine gitti. Cumartesi havuzda ilk kez kimse tutmadan karşıya yüzdü.","Ne olmuş?","Ali yüzmeyi öğrenmiş.","Ali havuzdan korkmuş.","Dersler iptal olmuş."],
["Sınıfta herkes sessizce kâğıdına yazıyordu. Zil çalınca öğretmen kâğıtları topladı.","Ne olmuş?","Sınav yapılmış.","Resim dersi yapılmış.","Teneffüs olmuş."],
["Can dondurmasını güneşin altında bankta bıraktı. Döndüğünde bankta yalnızca ıslak bir leke vardı.","Ne olmuş?","Dondurma erimiş.","Biri bankı yıkamış.","Dondurma donmuş."],
["Elif'in kuşu kafesten uçup gitti. Elif pencereyi açık bıraktı, kafese yem koydu; sabah kuş kafesteydi.","Ne olmuş?","Kuş geri dönmüş.","Kuş hiç gitmemiş.","Kedi kuşu getirmiş."],
["Burak sabah ateşli ve halsizdi. Doktorun verdiği ilacı içti; akşam oyun oynayacak kadar iyileşti.","Ne olmuş?","İlaç işe yaramış.","Burak hiç hastalanmamış.","Doktor hastalanmış."],
["Market rafında tek bir ekmek kalmıştı. Önündeki kişi onu alınca Deniz boş eliyle eve döndü.","Neden ekmek alamadı?","Ekmek bitmişti.","Parası yoktu.","Market kapalıydı."],
["Kuşlar yuvalarına dönüyor, gökyüzü turuncuya boyanıyor. Sokak lambaları birer birer yanmaya başladı.","Günün hangi zamanı?","Akşam.","Sabah.","Öğle."],
["Zeynep arkadaşının doğum günü için pasta yaptı. Mutfağa döndüğünde pasta yoktu, kedinin bıyıkları kremalıydı.","Ne olmuş?","Kedi pastayı yemiş.","Pasta satılmış.","Zeynep pastayı yapmamış."],
["Dışarıda rüzgâr çok sertti. Kerem uçurtmasını uçurmaya gitti; ipi koptu ve uçurtma gözden kayboldu.","Ne olmuş?","Rüzgâr uçurtmayı götürmüş.","Kerem uçurtmayı satmış.","Hava rüzgârsızdı."],
["Ali sabah çok telaşlıydı, çantasını almadan evden çıktı. Okulda öğretmen defterini isteyince sessiz kaldı.","Neden sessiz kaldı?","Defteri evde kalmıştı.","Defterini okulda bitirmişti.","Öğretmen başkasına sormuştu."],
["Mert'in yeni ayakkabıları sabah tertemizdi. Akşam ayakkabılar çamur içindeydi, pantolonunun dizi yırtılmıştı.","Ne olmuş olabilir?","Dışarıda oynarken düşmüş.","Ayakkabıları yıkamış.","Bütün gün evde oturmuş."],
["Öğretmen sınıfa girince kimse yerinde değildi. Tahtada 'Bahçedeyiz, çiçek dikiyoruz' yazıyordu.","Çocuklar nerede?","Bahçede.","Evde.","Sinemada."]];
const INFER_MC_TIERS = [INFER_MC_EASY, INFER_MC.concat(INFER_MC_MID_EXTRA), INFER_MC_HARD];
function imcBuild(){ const t = currentCombo().t, N = 3, listenOnly = false, bank = INFER_MC_TIERS[Math.min(t, 2)]; return shuffleArray(bank).slice(0, [6, 7, 8][Math.min(t, 2)]).map(([s, q, ok, a, b]) => qzMake(`<div style="font-size:${t === 2 ? 16 : 17}px;font-weight:800;text-align:center;max-width:360px;margin:0 auto;line-height:1.35">${listenOnly ? "🔊 <span style=\"color:var(--muted)\">Dinle</span>" : s}</div><div style="text-align:center;font-weight:900;color:var(--teal-dark);margin-top:4px">${q}</div>`, [ok, a, b].slice(0, N).map(x => `<b style="font-size:16px">${x}</b>`), 0, { prompt:"<b>İpuçlarından</b> çıkar", fixed:true, text:true, raw:true, say:`${s} ${q}`, replay:true })); }
const HOMONYM = { post:[ { t:0, q:"<b>yüz</b>", a:"surat · 100 sayısı" }, { t:0, q:"<b>ay</b>", a:"gökteki ay · yılın ayları" }, { t:0, q:"<b>gül</b>", a:"çiçek · gülmek" }, { t:0, q:"<b>at</b>", a:"hayvan · atmak (topu at)" }, { t:0, q:"<b>ben</b>", a:"kendim (ben, sen) · tendeki küçük kahverengi nokta" }, { t:0, q:"<b>kız</b>", a:"kız çocuk · kızmak (sinirlenmek)" }, { t:0, q:"<b>saç</b>", a:"başımızdaki saç · saçmak (etrafa dağıtmak)" }, { t:0, q:"<b>el</b>", a:"vücudumuzdaki el · başka insanlar (el âlem)" }, { t:1, q:"<b>dil</b>", a:"ağızdaki organ · konuşulan lisan" }, { t:1, q:"<b>yaz</b>", a:"mevsim · yazmak" }, { t:1, q:"<b>kır</b>", a:"şehir dışı açık alan · kırmak" }, { t:1, q:"<b>bin</b>", a:"1000 sayısı · binmek" }, { t:1, q:"<b>ocak</b>", a:"yemek pişirilen yer · yılın ilk ayı" }, { t:1, q:"<b>pazar</b>", a:"alışveriş yeri · haftanın günü" }, { t:1, q:"<b>sağ</b>", a:"solun karşıtı · canlı, sağlıklı (sağ olsun)" }, { t:1, q:"<b>yan</b>", a:"taraf, kenar · yanmak (ateşte)" }, { t:2, q:"<b>çay</b>", a:"içecek · küçük akarsu" }, { t:2, q:"<b>dolu</b>", a:"boş olmayan · buz yağışı" }, { t:2, q:"<b>kara</b>", a:"siyah · deniz olmayan yer (kara yolu)" }, { t:2, q:"<b>kaz</b>", a:"hayvan · kazmak (toprağı kaz)" }, { t:2, q:"<b>dal</b>", a:"ağaç dalı · dalmak (suya dal)" }, { t:2, q:"<b>bağ</b>", a:"üzüm bağı · bağlamak, düğüm" }, { t:2, q:"<b>ekmek</b>", a:"yiyecek · tohum ekmek" }, { t:2, q:"<b>kurt</b>", a:"ormandaki hayvan · meyvenin içindeki küçük kurt" } ] };






const YB = [ ["kedi","yavru kedi"], ["köpek","yavru köpek"], ["tavuk","civciv"], ["inek","buzağı"], ["koyun","kuzu"], ["at","tay"] ];
const ybImg = (i, baby) => ANIM_YB_IMAGES[i * 2 + (baby ? 1 : 0)];
const ANALOGY_TXT = [
{ t:0, a:"kuş", b:"yuva", c:"arı", ans:"kovan", lure:["bal","çiçek","kanat","iğne"] }, { t:0, a:"göz", b:"görmek", c:"kulak", ans:"duymak", lure:["kulaklık","burun","konuşmak","koklamak"] },
{ t:0, a:"ayakkabı", b:"ayak", c:"eldiven", ans:"el", lure:["kış","parmak","çorap","şapka"] }, { t:0, a:"şoför", b:"otobüs", c:"pilot", ans:"uçak", lure:["gökyüzü","havalimanı","tren","gemi"] },
{ t:0, a:"balık", b:"yüzgeç", c:"kuş", ans:"kanat", lure:["tüy","yuva","uçmak","gaga"] }, { t:1, a:"gece", b:"ay", c:"gündüz", ans:"güneş", lure:["yıldız","sabah","bulut","gökyüzü"] },
{ t:1, a:"un", b:"ekmek", c:"süt", ans:"peynir", lure:["inek","bardak","beyaz","çay"] }, { t:1, a:"doktor", b:"hasta", c:"öğretmen", ans:"öğrenci", lure:["okul","kitap","ders","tahta"] },
{ t:1, a:"yağmur", b:"şemsiye", c:"güneş", ans:"şapka", lure:["yaz","sıcak","bulut","mont"] }, { t:1, a:"eczane", b:"ilaç", c:"kütüphane", ans:"kitap", lure:["sessizlik","okul","raf","ekmek"] },
{ t:2, a:"dakika", b:"saat", c:"gün", ans:"hafta", lure:["gece","takvim","saniye","sabah"] }, { t:2, a:"az", b:"çok", c:"küçük", ans:"büyük", lure:["minik","kısa","orta","uzun"] },
{ t:2, a:"tohum", b:"ağaç", c:"yumurta", ans:"tavuk", lure:["kabuk","kahvaltı","yuva","sepet"] }, { t:2, a:"ressam", b:"tablo", c:"yazar", ans:"kitap", lure:["kalem","okumak","kütüphane","sayfa"] },
{ t:2, a:"susuzluk", b:"su", c:"yorgunluk", ans:"dinlenmek", lure:["koşmak","spor","esnemek","ter"] } ];
let anlUsed = new Set();
function anlTrials(){ const t = currentCombo().t;
if(isPre()){ const N = [3, 4, 4][t]; anlUsed = new Set();
return Array.from({length:N}, (_, k) => { const tool = t === 2 && k === N - 1;
if(tool){ const pr = Math.random() < 0.5 ? [["nail","hammer"],["screw","screwdriver"]] : [["screw","screwdriver"],["nail","hammer"]];
const opts = [PAIR_IMAGES[pr[1][1]], PAIR_IMAGES[pr[0][1]], PAIR_IMAGES[pr[1][0]]].map(s => qzPic(s));
return anlMake(PAIR_IMAGES[pr[0][0]], PAIR_IMAGES[pr[0][1]], PAIR_IMAGES[pr[1][0]], opts, "Üstteki ikili gibi eşleştir"); }
let p, q, g2 = 0; do{ [p, q] = shuffleArray([0, 1, 2, 3, 4, 5]).slice(0, 2); } while((anlUsed.has(p + "-" + q) || anlUsed.has("q" + q)) && g2++ < 30); anlUsed.add(p + "-" + q); anlUsed.add("q" + q); const rev = t === 2 && Math.random() < 0.5;
const oth = shuffleArray([0, 1, 2, 3, 4, 5].filter(i => i !== p && i !== q)), other = oth[0]; const opts = [ybImg(q, !rev), ybImg(q, rev), ybImg(other, !rev)].concat(t === 2 ? [ybImg(oth[1], rev)] : []).map(s => qzPic(s));
return anlMake(ybImg(p, rev), ybImg(p, !rev), ybImg(q, rev), opts, rev ? "Yavrudan yetişkine: sıradaki hangisi?" : "Yetişkinden yavruya: sıradaki hangisi?", rev ? `${cap(YB[p][1])}, ${YB[p][0]}. ${cap(YB[q][1])}…?` : `${cap(YB[p][0])}, ${YB[p][1]}. ${cap(YB[q][0])}…?`); }); }
const pool = shuffleArray(ANALOGY_TXT.filter(x => x.t <= t)).sort((a, b) => (b.t === t) - (a.t === t)).slice(0, 6), N = [3, 4, 5][t];
return pool.map(x => qzMake(`<div style="display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;font-size:20px;font-weight:900"><span class="anl-w">${x.a}</span>→<span class="anl-w">${x.b}</span><span style="width:10px"></span><span class="anl-w">${x.c}</span>→<span class="anl-w q">?</span></div>`,
[x.ans].concat(shuffleArray(x.lure).slice(0, N - 1)).map(w => `<b style="font-size:17px">${w}</b>`), 0, { prompt:"İlk ikili gibi: <b>soru işaretine</b> ne gelir?", fixed:true, text:true, raw:true, say:`${x.a}, ${x.b}. ${x.c}…?` })); }
function anlMake(A, B, C, opts, prompt, say){ const card = (s) => `<div class="wm-card" style="width:64px;height:64px;padding:4px">${qzPic(s)}</div>`;
const stim = `<div style="display:flex;align-items:center;gap:6px;justify-content:center;flex-wrap:wrap">${card(A)}<b>→</b>${card(B)}<span style="width:12px"></span>${card(C)}<b>→</b><div class="wm-card" style="width:64px;height:64px;font-weight:900;font-size:26px;border-style:dashed">?</div></div>`;
return qzMake(stim, opts, 0, { prompt:`<b>${prompt}</b>`, raw:true, say, replay: !!say, cell:110 }); }
const ABS_PIC = [ ["Bu resimde yanlış olan ne?", "Ayakkabılar ayağa giyilir; o ellerine giymiş."], ["Burada garip olan ne?", "Balık ağaçta yaşamaz, suda yaşar."],
["Ne yanlış?", "Şemsiye elde tutulup başın üstünde açılır; ayağına takmış."], ["Bu resimde yanlış olan ne?", "Çorba çatalla içilmez, kaşıkla içilir."],
["Burada garip olan ne?", "Arabanın tekerlekleri yuvarlak olmalı; kare tekerlekle gidemez."], ["Ne yanlış?", "Sıcak plajda kalın mont, bere ve atkı giyilmez."],
["Bu resimde yanlış olan ne?", "Dişler saç fırçasıyla değil, diş fırçasıyla fırçalanır."], ["Burada garip olan ne?", "İnek yatakta yatmaz; ahırda uyur."] ];
const ABS_SENT = [ ["Ali sabah okula geç kalmamak için saatini iki saat geriye aldı.", "Saati geri almak onu daha da geç bırakır; ileri alması ya da erken kalkması gerekirdi."],
["Hava çok soğuk olduğu için Ece serinlemek amacıyla montunu giydi.", "Mont ısıtır, serinletmez; zaten hava soğukken serinlemeye gerek yok."],
["Elektrikler kesildiği için Kerem odasını aydınlatmak amacıyla elektrikli lambayı açtı.", "Elektrik yokken elektrikli lamba yanmaz; fener ya da mum gerekir."],
["Mert susadığı için tuzlu cips yedi.", "Tuzlu yiyecek susuzluğu artırır; su içmesi gerekirdi."],
["Zeynep kitabını daha iyi görmek için ışığı kapattı.", "Işık kapanınca karanlıkta kitap görülmez."],
["Defne mektubu hemen ulaşsın diye pul yapıştırmadan postaya attı.", "Pulsuz mektup gönderilmez; daha geç ulaşır ya da hiç ulaşmaz."],
["Burak bisikletinin lastiği patlak olduğu için daha hızlı sürdü.", "Patlak lastikle hızlı sürülemez; önce lastik onarılmalı."],
["Ece soğumasını istediği çorbayı ocağın üstüne koydu.", "Ocak çorbayı ısıtır; soğuması için ocaktan alınmalı."] ];
function absayTrials(){ const t = currentCombo().t;
if(isPre()){ const N = [3, 4, 5][t]; return shuffleArray(ABS_PIC.map((x, i) => ({ img: i, q: x[0], a: x[1] }))).slice(0, N); }
const N = [4, 5, 6][t]; return shuffleArray(ABS_SENT.map(x => ({ s: x[0], q:"Bu cümlede ne mantıksız? Neden?", a: x[1] }))).slice(0, N); }
const WP_OBJ = ["pusula","dürbün","mikroskop","çapa","huni","kum saati","stetoskop","termometre","gözlük","fener","termos","yelpaze","ip","mıknatıs","kutu","kask","bilezik","kemer"];
/* 9. nesneden itibaren resimler NI(2) içinde */
const WP_OBJ_SRC = (i) => i < 8 ? WP_OBJ_IMAGES[i] : NI(2)[["glasses","flashlight","thermos","handfan","rope","magnet","box","helmet","bracelet","belt"][i - 8]];
const WP_EMO = ["Hangi çocuk tereddüt ediyor?","Hangi çocuk utanıyor?","Hangi çocuk gururlanıyor?","Hangi çocuk şaşırıyor?","Hangi çocuk hayal kırıklığına uğramış?","Hangi çocuk kıskanıyor?","Hangi çocuk merak ediyor?","Hangi çocuk sabırsızlanıyor?","Hangi çocuk üzgün?","Hangi çocuk mutlu?","Hangi çocuk korkuyor?","Hangi çocuk yorgun?","Hangi çocuk düşünüyor?","Hangi çocuk halinden memnun?","Hangi çocuk kızgın?","Hangi çocuk teşekkür ediyor?","Hangi çocuk endişeli?","Hangi çocuk rahatlamış?","Hangi çocuk sıkılmış?","Hangi çocuk heyecanlı?"];
/* 9. duygudan itibaren resimler NI(3) içinde */
const WP_EMO_SRC = (i) => i < 8 ? NI(5)[["hesitant", "shy", "proud", "surprised", "disappointed", "jealous", "curious", "impatient"][i]] : NI(3)[["sad", "happy", "scared", "tired", "thoughtful", "content", "angry", "grateful", "worried", "relieved", "bored", "excited"][i - 8]];
const WP_VAL = ["Hangi resimde dayanışma var?","Hangi resimde paylaşma var?","Hangi resimde biri özür diliyor?","Hangi resimde biri teselli ediliyor?","Hangi resimde tartışma var?","Hangi resimde yarışma var?","Hangi resimde kutlama var?","Hangi resimde vedalaşma var?","Hangi resimde biri yardım ediyor?","Hangi resimde çocuklar sıra bekliyor?","Hangi resimde çocuk dürüst davranıyor?","Hangi resimde nezaket var?","Hangi resimde sorumluluk var?","Hangi resimde cesaret var?","Hangi resimde saygı var?","Hangi resimde tutumluluk var?","Hangi resimde temizlik var?","Hangi resimde dostluk var?","Hangi resimde çocuklar dinliyor?","Hangi resimde biri teşekkür ediyor?"];
/* 9. değerden itibaren resimler NI(4) içinde */
const WP_VAL_SRC = (i) => i < 8 ? WP_VAL_IMAGES[i] : NI(4)[["helping", "patience", "honesty", "kindness", "responsibility", "courage", "respect", "thrift", "cleanliness", "friendship", "listening", "thanks"][i - 8]];
function wpPool(){ const C = qzCats(); const ta = [["dog","köpek"],["cat","kedi"],["cow","inek"],["rabbit","tavşan"],["elephant","fil"],["parrot","papağan"]].map(([k, n]) => ({ n, src: TA_ANIMALS[k](), cat:"hayvan" }));
return ta.concat(C.wild.items.slice(0, 4).map(x => Object.assign({ cat:"hayvan" }, x)), C.meyve.items.map(x => Object.assign({ cat:"meyve" }, x)), C.toy.items.map(x => Object.assign({ cat:"oyuncak" }, x)), C.house.items.map(x => Object.assign({ cat:"ev" }, x)), C.vehicle.items.map(x => Object.assign({ cat:"taşıt" }, x))).filter(x => !/\s/.test(x.n)); }
function wpTrials(){ const t = currentCombo().t;
if(isPre()){ const P = wpPool(), N = [5, 6, 6][t], out = [];
if(t === 2){ const an = P.filter(x => x.cat === "hayvan"); const fil = an.find(x => x.n === "fil"), par = an.find(x => x.n === "papağan");
out.push({ opts: shuffleArray([fil].concat(shuffleArray(an.filter(x => x !== fil && x.n !== "zürafa")).slice(0, 3))), ans: fil, say:"En büyük hayvan hangisi?" });
out.push({ opts: shuffleArray([par].concat(shuffleArray(an.filter(x => x !== par && x.n !== "maymun")).slice(0, 3))), ans: par, say:"Hangisi uçabilir?" }); }
for(const tg of shuffleArray(P)){ if(out.length >= N) break; const same = P.filter(x => x.cat === tg.cat && x !== tg), snd = P.filter(x => x.cat !== tg.cat && x.n[0] === tg.n[0]), far = P.filter(x => x.cat !== tg.cat && x.n[0] !== tg.n[0]);
let dis = t === 0 ? shuffleArray(far).slice(0, 2) : t === 1 ? shuffleArray(same).slice(0, 1).concat(shuffleArray(far).slice(0, 1)) : shuffleArray(same).slice(0, 1).concat(shuffleArray(snd).slice(0, 1), shuffleArray(far)).slice(0, 3);
out.push({ opts: shuffleArray([tg].concat(dis)), ans: tg, say:`Hangisi ${tg.n}?` }); }
return out.map(x => ({ stim:"", opts: x.opts.map(o => qzPic(o.src)), ans: x.opts.indexOf(x.ans), say: x.say, prompt:"<b>Dinle</b>, söyleneni göster", replay:true, fixed:true, cell:110 })); }
const set = t === 0 ? WP_OBJ.map((n, i) => ({ src: WP_OBJ_SRC(i), say:`Hangisi ${n}?` })) : t === 1 ? WP_EMO.map((q, i) => ({ src: WP_EMO_SRC(i), say: q })) : WP_VAL.map((q, i) => ({ src: WP_VAL_SRC(i), say: q })); { const okSet = set.filter(x => x && x.src); if(okSet.length >= 4 && okSet.length < set.length) set.splice(0, set.length, ...okSet); }
return shuffleArray(set).slice(0, 6).map(tg => { const o = shuffleArray([tg].concat(shuffleArray(set.filter(x => x !== tg)).slice(0, 3)));
return { stim:"", opts: o.map(x => qzPic(x.src)), ans: o.indexOf(tg), say: tg.say, prompt:`<b>${tg.say}</b>`, replay:true, fixed:true, cell:120 }; }); }

const BLK_COL = { a:ACC.kirmizi, b:"#FFFFFF", c:ACC.mavi, d:ACC.sari };
function blkFace(f, A, B){
const tri = { 2:"0,0 100,0 0,100", 3:"0,0 100,0 100,100", 4:"100,0 100,100 0,100", 5:"0,0 100,100 0,100" }[f];
return `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none"><rect width="100" height="100" fill="${f === 1 ? A : B}"/>${tri ? `<polygon points="${tri}" fill="${A}"/>` : ""}<rect width="100" height="100" fill="none" stroke="#9AA9B8" stroke-width="3"/></svg>`; }
function blkTrials(){ const t = currentCombo().t, pre = isPre();
const cfg = pre ? [ { n:2, faces:[0, 1], A:BLK_COL.a, B:BLK_COL.c }, { n:2, faces:[0, 1, 4, 5], A:BLK_COL.a, B:BLK_COL.d }, { n:2, faces:[0, 1, 4, 5], A:BLK_COL.a, B:BLK_COL.d, house:true } ][t]
: [ { n:2, faces:[0, 1, 2, 3, 4, 5], A:BLK_COL.a, B:BLK_COL.b }, { n:3, faces:[0, 1, 2, 3, 4, 5], A:BLK_COL.a, B:BLK_COL.b }, { n:4, faces:[0, 1, 2, 3, 4, 5], A:BLK_COL.a, B:BLK_COL.b } ][t];
return Array.from({length: pre ? 3 : 3}, () => { let model;
if(cfg.house){ model = [4, 5, 1, 1]; }
else if(pre && t === 0){ model = Math.random() < 0.5 ? [1, 0, 1, 0] : [1, 0, 0, 1]; }
else { const n = cfg.n, half = Math.ceil(n / 2); model = Array(n * n).fill(0);
for(let r = 0; r < n; r++) for(let c = 0; c < half; c++){ const f = randomItem(cfg.faces); model[r * n + c] = f; const mc = n - 1 - c; model[r * n + mc] = ({ 2:3, 3:2, 4:5, 5:4 })[f] || f; }
if(model.every(x => x === model[0])) model[0] = model[0] === 1 ? 0 : 1; }
let rot = 0; if(stIx() === 1) rot = pre ? 2 : 1;
return Object.assign({ model, rot }, cfg); }); }
const blkRotFace = (f, k) => { let x = f; for(let i = 0; i < k; i++) x = ({ 2:3, 3:4, 4:5, 5:2 })[x] || x; return x; };
function blkRotModel(model, n, k){ let m = model.slice(); for(let i = 0; i < k; i++){ const r = Array(n * n); for(let y = 0; y < n; y++) for(let x = 0; x < n; x++) r[x * n + (n - 1 - y)] = blkRotFace(m[y * n + x], 1); m = r; } return m; }
const MR_LETTERS = ["R","F","L","G","J","P","4","7"];
function mrShapeSVG(cells, col, size){ const xs = cells.map(c => c[0]), ys = cells.map(c => c[1]), w = Math.max(...xs) + 1, h = Math.max(...ys) + 1, s = 100 / Math.max(w, h), ox = (100 - w * s) / 2, oy = (100 - h * s) / 2;
return `<svg viewBox="0 0 100 100" width="100%" height="100%">${cells.map(([x, y]) => `<rect x="${ox + x * s + 1}" y="${oy + y * s + 1}" width="${s - 2}" height="${s - 2}" rx="3" fill="${col}"/>`).join("")}</svg>`; }
const mrNorm = (cells) => { const mx = Math.min(...cells.map(c => c[0])), my = Math.min(...cells.map(c => c[1])); return cells.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); };
const mrRot = (cells) => mrNorm(cells.map(([x, y]) => [-y, x])), mrFlip = (cells) => mrNorm(cells.map(([x, y]) => [-x, y]));
const mrKey = (c) => JSON.stringify(mrNorm(c));
const MR_POLY = [ [[0,0],[0,1],[0,2],[1,2]], [[0,0],[1,0],[1,1],[1,2],[2,2]], [[0,0],[0,1],[1,1],[1,2],[1,3]], [[1,0],[0,1],[1,1],[2,1],[2,2]], [[0,0],[1,0],[2,0],[2,1],[0,1],[0,2]] ];
const MR_CUBES = [ [[0,0,0],[1,0,0],[2,0,0],[2,1,0],[2,1,1]], [[0,0,0],[0,1,0],[1,1,0],[1,1,1],[1,2,1]], [[0,0,0],[0,1,0],[0,2,0],[1,2,0],[1,2,1]], [[0,0,0],[0,0,1],[1,0,1],[1,1,1],[2,1,1]], [[0,0,0],[1,0,0],[2,0,0],[0,1,0],[0,1,1]], [[0,0,0],[1,0,0],[1,0,1],[1,1,1],[1,2,1]] ], MR_CUBE_COLS = ["#7FB3E8","#F2A65A","#8FD19E","#E59AC9","#F5D76E","#A99BE8"];
const cubeRot = (cs) => cs.map(([x, y, z]) => [-y, x, z]), cubeFlip = (cs) => cs.map(([x, y, z]) => [-x, y, z]);
const cubeKey = (cs) => { const mx = Math.min(...cs.map(c => c[0])), my = Math.min(...cs.map(c => c[1])); return JSON.stringify(cs.map(([x, y, z]) => [x - mx, y - my, z]).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2])); };
function cubeShade(hex, f){ try{ const n = parseInt(String(hex).replace("#", ""), 16); const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(f > 1 ? v + (255 - v) * (f - 1) * 2 : v * f)))); return "#" + c.map(v => v.toString(16).padStart(2, "0")).join(""); }catch(e){ return hex; } }
function cubeSVG(cs, col){ const mx = Math.min(...cs.map(c => c[0])), my = Math.min(...cs.map(c => c[1])); const C = cs.map(([x, y, z]) => [x - mx, y - my, z]);
const s = 15, P = (x, y, z) => [50 + (x - y) * s * 0.951, 62 + (x + y) * s * 0.309 - z * s * 1.15];   /* KURAL: küp yapıları 18° bakışla çizilir; izometrik bakışta çapraz arkadaki küp öndekinin tam arkasına düşüp görünmez oluyordu */
const ord = C.slice().sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]) || a[2] - b[2]);
const pts = (arr) => arr.map(p => p.map(v => v.toFixed(1)).join(",")).join(" ");
const __all = []; C.forEach(([x, y, z]) => { [[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]].forEach(([a, b, c]) => __all.push(P(x + a, y + b, z + c))); }); const __xs = __all.map(p => p[0]), __ys = __all.map(p => p[1]); const __x0 = Math.min(...__xs) - 3, __y0 = Math.min(...__ys) - 3, __w = Math.max(...__xs) - __x0 + 3, __h = Math.max(...__ys) - __y0 + 3, __d = Math.max(__w, __h);   /* yapıyı kutuya sığdır: uyaran ve seçenekler aynı ölçekte, kırpılmadan */
return `<svg viewBox="${(__x0 - (__d - __w) / 2).toFixed(1)} ${(__y0 - (__d - __h) / 2).toFixed(1)} ${__d.toFixed(1)} ${__d.toFixed(1)}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">${ord.map(([x, y, z]) => { const top = [P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], left = [P(x, y + 1, z + 1), P(x + 1, y + 1, z + 1), P(x + 1, y + 1, z), P(x, y + 1, z)], right = [P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x + 1, y + 1, z), P(x + 1, y, z)];
return `<polygon points="${pts(top)}" fill="${cubeShade(col, 1.06)}" stroke="#2B3A4A" stroke-width="1" stroke-linejoin="round"/><polygon points="${pts(left)}" fill="${cubeShade(col, 0.84)}" stroke="#2B3A4A" stroke-width="1" stroke-linejoin="round"/><polygon points="${pts(right)}" fill="${cubeShade(col, 0.68)}" stroke="#2B3A4A" stroke-width="1" stroke-linejoin="round"/>`;   /* KURAL: küpler opak ve gölgeli (üst açık, yanlar koyu); saydam yüzler arkadaki küplerin çizgilerini gösterip yapıyı karıştırıyordu */ }).join("")}</svg>`; }
let mrPolyCycle = null, mrColCycle = null, mrCubeCycle = null;
function mrTrials(){ const t = currentCombo().t, pre = isPre(), N = pre ? [4, 4, 4][t] : [5, 5, 5][t], out = []; mrPolyCycle = mrColCycle = mrCubeCycle = null;
for(let k = 0; k < N; k++){ let stim, opts, ans = 0, prompt;
if(pre && t === 0){ const pool = qzCats().sea.items.concat(qzCats().wild.items), [a, b, c] = shuffleArray(pool).slice(0, 3), r = [90, 180, 270];
const im = (x, deg, fl) => `<div style="width:100%;height:100%;transform:rotate(${deg}deg)${fl ? " scaleX(-1)" : ""}">${qzPic(x.src)}</div>`;
stim = im(a, 0); opts = [im(a, randomItem(r)), im(b, randomItem(r)), im(c, randomItem(r))]; prompt = "Aynı hayvan, başka yöne <b>dönmüş</b>: hangisi?"; }
else if(pre){ const base = (mrPolyCycle || (mrPolyCycle = mkCycle(MR_POLY.slice(0, 3))))(), col = (mrColCycle || (mrColCycle = mkCycle(COLORS)))(); let rot = base; for(let i = 0; i < 1 + Math.floor(Math.random() * 3); i++) rot = mrRot(rot);
const mir = mrFlip(base); let mir2 = mrRot(mir);
stim = t === 2 ? `<div style="width:100%;height:100%;border:3px dashed #9AA9B8;border-radius:10px;padding:6px">${mrShapeSVG(base, "#E6ECF2")}</div>` : mrShapeSVG(base, col);
opts = [mrShapeSVG(rot, col), mrShapeSVG(mir, col), mrShapeSVG(mir2, col)]; prompt = t === 2 ? "Hangi parça <b>döndürülünce</b> boşluğa tam oturur?" : "Hangisi <b>aynı şeklin döndürülmüş</b> hâli?"; }
else if(t === 0){ const L = randomItem(MR_LETTERS), deg = () => randomItem([90, 180, 270]), lt = (d, fl) => `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font:900 54px 'Trebuchet MS',sans-serif;color:var(--ink);transform:rotate(${d}deg)${fl ? " scaleX(-1)" : ""}">${L}</div>`;
stim = lt(0); const dd = shuffleArray([90, 180, 270]); opts = [lt(dd[0]), lt(dd[1], true), lt(dd[2], true), lt(0, true)]; /* iki aynalı seçenek farklı açılarda */ prompt = "Hangisi <b>yalnızca döndürülmüş</b> (ayna değil)?"; }
else if(t === 1){ const base = randomItem(MR_POLY), col = randomItem(COLORS); let rot = mrRot(base); if(Math.random() < 0.5) rot = mrRot(rot);
const mir = mrFlip(base), wrong = [mir, mrRot(mir), mrRot(mrRot(mir))].filter((m, i, arr) => mrKey(m) !== mrKey(rot) && arr.findIndex(x => mrKey(x) === mrKey(m)) === i);   /* 180° simetrik parçada aynı çeldirici iki kez gelmez */
stim = mrShapeSVG(base, col); opts = [mrShapeSVG(rot, col)].concat(wrong.slice(0, 3).map(m => mrShapeSVG(m, col))); prompt = "Şeklin <b>90° ya da 180° döndürülmüş</b> hâli hangisi?"; }
else { const base = (mrCubeCycle || (mrCubeCycle = mkCycle(MR_CUBES)))(), col = (mrColCycle || (mrColCycle = mkCycle(MR_CUBE_COLS)))();   /* her soruda farklı yapı ve renk */ /* KURAL: uyaran ve seçenekler, küplerin birbirini en az örttüğü yönlerden seçilir; her küp görünür ve sayılabilir olmalı */ const R4 = (c) => { const o = [c]; for(let i = 0; i < 3; i++) o.push(cubeRot(o[o.length - 1])); return o; }; const vis = (c) => { const P = c.map(([x, y, z]) => [(x - y) * 0.951, (x + y) * 0.309 - z * 1.15]); let sc = 0; for(let i = 0; i < P.length; i++) for(let j = i + 1; j < P.length; j++){ const d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]); if(d < 1.25) sc += 1.25 - d; } return sc; }; const byVis = (arr) => arr.slice().sort((p, q) => vis(p) - vis(q));
      const orients = byVis(R4(base)); const shown = orients[0], rot = orients.find(o => cubeKey(o) !== cubeKey(shown)) || cubeRot(shown); const wr = byVis(R4(cubeFlip(base))).filter((m, i, arr) => cubeKey(m) !== cubeKey(rot) && cubeKey(m) !== cubeKey(shown) && arr.findIndex(x => cubeKey(x) === cubeKey(m)) === i); stim = cubeSVG(shown, col); opts = [cubeSVG(rot, col)].concat(wr.slice(0, 2).map(m => cubeSVG(m, col))); prompt = "Hangisi <b>aynı yapının döndürülmüş</b> hâli?"; }
const o = shuffleArray(opts.map((h, i) => i)); out.push({ stim, opts: o.map(i => opts[i]), ans: o.indexOf(ans), prompt, fixed:true, cell:100 }); }
return out; }
function clutBuild(){ const t = currentCombo().t, pre = isPre(), pool = picUniq(picPool().concat(qzCats().wild.items, qzCats().vehicle.items));
const tg = clutPick(pool), K = pre ? [2, 3, 3][t] : [3, 4, 5][t], D = pre ? [5, 8, 10][t] : [10, 14, 18][t];
const items = Array.from({length:K}, () => ({ x: tg, tgt:true })).concat(shuffleArray(pool.filter(x => x.n !== tg.n)).concat(shuffleArray(pool.filter(x => x.n !== tg.n))).slice(0, D).map(x => ({ x })));
const sz = pre ? [30, 27, 25][t] : [24, 21, 18][t];
const placed = shuffleArray(items).map((it, i) => Object.assign(it, { l: 4 + Math.random() * (92 - sz), tp: 4 + Math.random() * (92 - sz), sz: sz * (0.85 + Math.random() * 0.35), r: Math.round((Math.random() * 2 - 1) * (pre ? 15 : 40)), z: it.tgt ? 5 + Math.floor(Math.random() * 3) : Math.floor(Math.random() * 8) }));
/* hedefler her zaman en üstte ve birbirinden uzak: hedefin merkezi başka bir resmin altında kalmasın */
const tgs = placed.filter(x => x.tgt); tgs.forEach((a, i) => { a.z = 10 + i; for(let g = 0; g < 60; g++){ if(tgs.slice(0, i).every(b => Math.hypot(a.l - b.l, a.tp - b.tp) >= sz * 0.9)) break; a.l = 4 + Math.random() * (92 - sz); a.tp = 4 + Math.random() * (92 - sz); } });
return { tg, items: placed, found:{}, bad:{} }; }
let clutTarget = null;
function clutPick(pool){ if(!clutTarget || !pool.some(x => x.n === clutTarget)) clutTarget = randomItem(pool).n; return pool.find(x => x.n === clutTarget); }
const OV_SHAPES = { daire:(cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`, kare:(cx, cy, r) => `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}"/>`,
"üçgen":(cx, cy, r) => `<polygon points="${cx},${cy - r} ${cx + r * 0.95},${cy + r * 0.7} ${cx - r * 0.95},${cy + r * 0.7}"/>`,
"beşgen":(cx, cy, r) => `<polygon points="${Array.from({length:5}, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return (cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1); }).join(" ")}"/>` };
const OV_PLURAL = { daire:"daire", kare:"kare", "üçgen":"üçgen", "beşgen":"beşgen" };
function ovTrials(){ const t = currentCombo().t, pre = isPre(), target = pre ? "daire" : "beşgen", others = pre ? ["kare","üçgen"] : ["daire","kare","üçgen"];
const nextK = mkCycle(pre ? [1, 2, 3] : [1, 2, 3, 4]);   /* hedef sayısı turda dengeli */
  return Array.from({length: pre ? 4 : 5}, () => { const n = pre ? [3, 4, 5][t] : [7, 8, 10][t], k = nextK();
const kinds = shuffleArray(Array(k).fill(target).concat(Array.from({length: n - k}, () => randomItem(others))));
const shapes = kinds.map(kd => OV_SHAPES[kd](22 + Math.random() * 56, 22 + Math.random() * 56, (pre ? 18 : 14) + Math.random() * 8)).join("");
const stim = `<svg viewBox="0 0 100 100" width="100%" height="100%"><g fill="none" stroke="${pre ? "#2E6FD8" : "#3A4A5C"}" stroke-width="${pre ? 2.6 : 2}">${shapes}</g></svg>`;
const nums = Array.from({length: pre ? 4 : 5}, (_, i) => i + 1); if(!nums.includes(k)) nums[nums.length - 1] = k;
return { stim, opts: nums.map(v => `<b style="font-size:24px">${v}</b>`), ans: nums.indexOf(k), prompt:`Çizimde <b>kaç ${OV_PLURAL[target]}</b> var?`, text:true, stimBig:true }; }); }
function embTrials(){ const t = currentCombo().t, polys = { "üçgen":[[0,0],[30,0],[15,26]], "dörtgen":[[0,0],[28,0],[36,20],[8,20]], "ok":[[0,10],[20,10],[20,0],[34,16],[20,32],[20,22],[0,22]], "ev":[[0,14],[14,0],[28,14],[28,34],[0,34]] };
const names = Object.keys(polys);
return Array.from({length:4}, () => { const nm = randomItem(names), P = polys[nm], ox = 20 + Math.random() * 30, oy = 20 + Math.random() * 30;
const poly = (pts, dx, dy) => `<polygon points="${pts.map(([x, y]) => (x + dx).toFixed(1) + "," + (y + dy).toFixed(1)).join(" ")}"/>`;
const extra = () => Array.from({length: [4, 6, 8][t]}, () => { const x1 = Math.random() * 100, y1 = Math.random() * 100, a = Math.random() * Math.PI, L = 30 + Math.random() * 50; return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${(x1 + L * Math.cos(a)).toFixed(1)}" y2="${(y1 + L * Math.sin(a)).toFixed(1)}"/>`; }).join("");
const fig = (inner) => `<svg viewBox="0 0 100 100" width="100%" height="100%"><g fill="none" stroke="#3A4A5C" stroke-width="2">${inner}</g></svg>`;
const others = names.filter(x => x !== nm);
const opts = [fig(poly(P, ox, oy) + extra())].concat(shuffleArray(others).slice(0, 2).map(o => fig(poly(polys[o], 20 + Math.random() * 30, 20 + Math.random() * 30) + extra())));
const stim = `<svg viewBox="-32 -32 100 100" width="100%" height="100%"><g fill="none" stroke="#E5484D" stroke-width="2.4">${poly(P, 0, 0)}</g></svg>`;
const o = shuffleArray([0, 1, 2]); return { stim, opts: o.map(i => opts[i]), ans: o.indexOf(0), prompt:"Üstteki şekil <b>hangisinin içinde gizli</b>?", fixed:true, cell:110 }; }); }
/* KURAL: Görsel Tamamlama'da yakınlaştırma resmin çözünürlüğünü aşmaz (ekranda en çok 1 piksel = 1 resim pikseli; kutu ~300 px). 1024 px resimler gelince istenen 2,2 / 2,8 kat kendiliğinden kullanılır */
const CLS_NAT = {}; function clsZoom(x, pre){ const want = pre ? 2.2 : 2.8; let n = CLS_NAT[x.src]; if(n === undefined){ try{ const im = new Image(); im.src = x.src; n = Math.max(im.naturalWidth || 0, im.naturalHeight || 0); if(n) CLS_NAT[x.src] = n; }catch(e){ n = 0; } } if(!n) n = 560; return Math.max(1.6, Math.min(want, +(n / 300).toFixed(2))); }
function clsTrials(){ const t = currentCombo().t, pre = isPre(), N = pre ? 4 : 5, out = [];
const pool = picUniq(picPool().concat(qzCats().wild.items, qzCats().vehicle.items));
for(let k = 0; k < N; k++){ const [a, b, c, d] = shuffleArray(pool).slice(0, 4); let stim, opts, prompt = "Bu <b>ne</b>?";
const full = (x) => qzPic(x.src);
if(pre && t === 0){ const side = randomItem(["left","right","top","bottom"]), ins = { left:"0 50% 0 0", right:"0 0 0 50%", top:"0 0 50% 0", bottom:"50% 0 0 0" }[side];
stim = `<div style="width:100%;height:100%;clip-path:inset(${ins})">${full(a)}</div>`; opts = [full(a), full(b), full(c)]; prompt = "Resmin <b>yarısı</b> görünüyor: bu ne?"; }
else if((pre && t === 1) || (!pre && t === 0)){ const ox = 15 + Math.random() * 70, oy = 15 + Math.random() * 70;
stim = `<div style="width:100%;height:100%;overflow:hidden;border-radius:10px"><img src="${a.src}" alt="" style="width:100%;height:100%;object-fit:contain;transform:scale(${clsZoom(a, pre)});transform-origin:${ox}% ${oy}%"></div>`;
opts = pre ? [full(a), full(b), full(c)] : [full(a), full(b), full(c), full(d)]; prompt = "Bir <b>parçası</b> görünüyor: hangisinin parçası?"; }
else if(pre && t === 2){ const sh = randomItem(["circle","rect","triangle","star"]), col = "#3A4A5C";
const shp = { circle:`<circle cx="50" cy="50" r="34"/>`, rect:`<rect x="16" y="16" width="68" height="68"/>`, triangle:`<polygon points="50,14 88,82 12,82"/>`, star:`<polygon points="50,10 61,38 92,40 67,58 76,88 50,70 24,88 33,58 8,40 39,38"/>` };
stim = `<svg viewBox="0 0 100 100" width="100%" height="100%"><g fill="none" stroke="${col}" stroke-width="5" stroke-dasharray="14 12">${shp[sh]}</g></svg>`;
const set = shuffleArray(["circle","rect","triangle","star"].filter(x => x !== sh)).slice(0, 2).concat([sh]);
opts = set.map(x => shapeSVG(x === "rect" ? "rect" : x, "#2E6FD8")); const o = shuffleArray([0, 1, 2]); out.push({ stim, opts: o.map(i => opts[i]), ans: o.indexOf(2), prompt:"<b>Eksik çizilmiş</b> şekil hangisi?", fixed:true, cell:100 }); continue; }
else if(t === 1){ const tiles = Array.from({length:16}, (_, i) => i), hide = new Set(shuffleArray(tiles).slice(0, 10));
stim = `<div style="position:relative;width:100%;height:100%">${full(a)}<div style="position:absolute;inset:0;display:grid;grid-template-columns:repeat(4,1fr)">${tiles.map(i => `<div style="background:${hide.has(i) ? "var(--panel)" : "transparent"}"></div>`).join("")}</div></div>`;
opts = [full(a), full(b), full(c), full(d)]; prompt = "Parça parça görünüyor: bu ne?"; }
else { const occ = Array.from({length:4}, () => `<div style="position:absolute;left:${Math.random() * 60}%;top:${Math.random() * 60}%;width:${30 + Math.random() * 20}%;height:${30 + Math.random() * 20}%;background:${randomItem(["#8B5CF6","#1FA463","#F5A524","#E5484D"])};border-radius:${Math.random() < 0.5 ? "50%" : "8px"}"></div>`).join("");
stim = `<div style="position:relative;width:100%;height:100%;overflow:hidden">${full(a)}${occ}</div>`; opts = [full(a), full(b), full(c), full(d)]; prompt = "Önü kısmen <b>kapatılmış</b>: bu ne?"; }
const o = shuffleArray(opts.map((h, i) => i)); out.push({ stim, opts: o.map(i => opts[i]), ans: o.indexOf(0), prompt, fixed:true, cell:100 }); }
return out; }
function symTrials(){ const t = currentCombo().t, pre = isPre(), n = (pre ? [4, 4, 6][t] : [6, 6, 8][t]) - ((!pre && t === 2 && Math.min(innerWidth, innerHeight) < 400 && innerWidth < innerHeight) ? 2 : 0), fill = [0.3, 0.45, 0.4][Math.min(t, 2)];   /* KURAL: küçük telefonda (dar ekran) Simetri Zor ızgarası 8→6 — hücreler dokunulabilir boyda kalır */ /* Orta: aynı ızgara, daha çok kare */
return Array.from({length:3}, () => { const half = n / 2, cells = Array(n * n).fill(0), horiz = !pre && t === 2 && Math.random() < 0.5;
for(let r = 0; r < n; r++) for(let c = 0; c < n; c++){ const given = horiz ? r < half : c < half; if(given && Math.random() < fill) cells[r * n + c] = 1; }
if(!cells.some(Boolean)) cells[0] = 1; return { n, cells, horiz }; }); }
function mazeGen(n){ const W = Array.from({length: n * n}, () => ({ n:1, e:1, s:1, w:1 })), seen = new Set([0]), st = [0];
while(st.length){ const c = st[st.length - 1], r = Math.floor(c / n), k = c % n, nb = [];
if(r > 0 && !seen.has(c - n)) nb.push(["n", c - n]); if(k < n - 1 && !seen.has(c + 1)) nb.push(["e", c + 1]); if(r < n - 1 && !seen.has(c + n)) nb.push(["s", c + n]); if(k > 0 && !seen.has(c - 1)) nb.push(["w", c - 1]);
if(!nb.length){ st.pop(); continue; } const [d, x] = randomItem(nb), op = { n:"s", s:"n", e:"w", w:"e" }[d]; W[c][d] = 0; W[x][op] = 0; seen.add(x); st.push(x); }
return W; }
function mazeTrials(){ const t = currentCombo().t, n = isPre() ? [4, 5, 6, 7][t] : [6, 7, 8, 9][t]; /* 10×10 ve 11×11 telefonda 30 noktalık hücre veriyordu */ return Array.from({length: isPre() ? 2 : 2}, () => ({ n, walls: mazeGen(n) })); }

const AA_SH = ["circle","square","triangle"], AA_COL = [ACC.kirmizi,ACC.mavi,ACC.sari,ACC.yesil], AA_SHN = { circle:"daire", square:"kare", triangle:"üçgen" };
function aaShape(sh, cx, cy, r, col, opt){ opt = opt || {}; const fill = opt.outline ? "none" : col, st = `stroke="${col}" stroke-width="${opt.outline ? 4 : 0}"`, rot = opt.rot ? ` transform="rotate(${opt.rot} ${cx} ${cy})"` : "";
let el = sh === "circle" ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${st}/>` : sh === "square" ? `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="${fill}" ${st}/>`
: sh === "triangle" ? `<polygon points="${cx},${cy - r} ${cx + r},${cy + r * 0.85} ${cx - r},${cy + r * 0.85}" fill="${fill}" ${st}/>`
: sh === "pointer" ? `<polygon points="${cx - r},${cy - r * 0.7} ${cx + r},${cy} ${cx - r},${cy + r * 0.7} ${cx - r * 0.45},${cy}" fill="${fill}" ${st}/>` : "";
if(opt.dot) el += `<circle cx="${cx}" cy="${cy + (sh === "triangle" ? r * 0.25 : 0)}" r="${r * 0.22}" fill="${opt.outline ? col : "#fff"}"/>`;
return `<g${rot}>${el}</g>`; }
function aaCell(c){ const n = c.n || 1, r = (n === 1 ? 26 : n === 2 ? 18 : 14) * (c.sz || 1), pos = n === 1 ? [[50, 50]] : n === 2 ? [[30, 50], [70, 50]] : [[25, 62], [50, 36], [75, 62]];
return `<svg viewBox="0 0 100 100" width="100%" height="100%" data-aa="${[c.sh, c.col, n, aaRotVis(c), !!c.outline, !!c.dot].join("|")}" data-sz="${c.sz || 1}">${pos.map(([x, y]) => aaShape(c.sh, x, y, r, c.col, c)).join("")}</svg>`; }
const aaRotVis = (c) => { const r = ((c.rot || 0) % 360 + 360) % 360; return c.sh === "circle" ? 0 : c.sh === "square" ? r % 90 : r; };   /* görünüşe göre döndürme: daire her açıda, kare 90° katlarında aynı görünür */
const aaKey = (c) => JSON.stringify([c.sh, c.col, c.n || 1, c.sz || 1, aaRotVis(c), !!c.outline, !!c.dot]);
/* KURAL (analoji/matris çeldiricileri): kural boyutla ilgili değilse, doğru cevaptan yalnızca boyutuyla ayrılan (aynı şekil, aynı renk, aynı doluluk) çeldirici üretilmez — "aynı şekil" görünümü vermez */
function aaDistract(ans, muts, k, sizeOk){ const out = [], seen = new Set([aaKey(ans)]); for(const m of shuffleArray(muts)){ const d = Object.assign({}, ans, m); if(!sizeOk && Object.keys(m).every(kk => kk === "sz")) continue; if(!seen.has(aaKey(d))){ seen.add(aaKey(d)); out.push(d); } if(out.length >= k) break; } return out; }
function mxTrials(){ const t = currentCombo().t, pre = isPre(), N = pre ? 4 : 5, out = [];
for(let q = 0; q < N; q++){ let grid, size, muts;
const [s1, s2, s3] = shuffleArray(AA_SH), [c1, c2, c3] = shuffleArray(AA_COL);
if(pre){ size = 2; const ty = t === 0 ? "color" : t === 1 ? randomItem(["color","size"]) : randomItem(["size","count"]);
if(ty === "color") grid = [{ sh:s1, col:c1 }, { sh:s1, col:c2 }, { sh:s2, col:c1 }, { sh:s2, col:c2 }];
else if(ty === "size") grid = [{ sh:s1, col:c1, sz:0.55 }, { sh:s1, col:c1, sz:1 }, { sh:s2, col:c2, sz:0.55 }, { sh:s2, col:c2, sz:1 }];
else grid = [{ sh:s1, col:c1, n:1 }, { sh:s1, col:c1, n:2 }, { sh:s2, col:c2, n:1 }, { sh:s2, col:c2, n:2 }];
muts = [{ col:c1 }, { col:c3 }, { sh:s1 }, { sh:s3 }, { sz:0.55 }, { sz:1 }, { n:1 }, { n:3 }]; }
else { size = 3; const ty = t === 0 ? "countShape" : t === 1 ? randomItem(["latin","countShape","latinColor"]) : randomItem(["rotation","twoRule","latin"]); grid = [];
for(let r = 0; r < 3; r++) for(let c = 0; c < 3; c++){
if(ty === "countShape") grid.push({ sh:[s1, s2, s3][r], col:c1, n:c + 1 });
else if(ty === "latin") grid.push({ sh:[s1, s2, s3][(r + c) % 3], col:[c1, c2, c3][r] });
else if(ty === "latinColor") grid.push({ sh:[s1, s2, s3][r], col:[c1, c2, c3][(c + r) % 3] });
else if(ty === "rotation") grid.push({ sh:"pointer", col:[c1, c2, c3][r], rot:[0, 90, 180][c] + r * 90 });
else grid.push({ sh:s1, col:[c1, c2, c3][r], n:c + 1 }); }
muts = [{ n:1 }, { n:2 }, { n:3 }, { sh:s1 }, { sh:s2 }, { sh:s3 }, { col:c1 }, { col:c2 }, { col:c3 }].concat(ty === "rotation" ? [{ rot:0 }, { rot:90 }, { rot:270 }] : []); }   /* döndürme çeldiricisi yalnızca döndürme sorularında */
const ans = grid[grid.length - 1], dis = aaDistract(ans, muts, pre ? 2 : 3, (typeof ty !== "undefined" && ty === "size"));
const cells = grid.map((c, i) => i === grid.length - 1 ? `<div class="mx-c q">?</div>` : `<div class="mx-c">${aaCell(c)}</div>`).join("");
const stim = `<div class="mx-g" style="grid-template-columns:repeat(${size}, minmax(0,1fr));width:${size === 2 ? 170 : 210}px">${cells}</div>`;
const opts = [ans].concat(dis).map(aaCell); out.push(qzMake(stim, opts, 0, { prompt:"Matristeki <b>boş kutuya</b> ne gelir?", raw:true, fixed:true, cell:86 })); }
return out; }

   // kolaydan zora

/* (2026-11-02: Kural Keşfi kullanıcı isteğiyle silindi) */
/* Terazi renk takımları: soru içinde terazi ve seçenekler aynı takımı kullanır */
const BAL_PALS = [{ circle:ACC.mavi, square:ACC.yesil, triangle:ACC.kirmizi }, { circle:ACC.turuncu, square:ACC.mor, triangle:ACC.mavi }, { circle:ACC.pembe, square:ACC.mavi, triangle:ACC.sari }, { circle:ACC.yesil, square:ACC.kirmizi, triangle:ACC.mavi }];
let balPal = BAL_PALS[0];
const BAL_COLN = { [ACC.mavi]:"mavi", [ACC.turuncu]:"turuncu", [ACC.pembe]:"pembe", [ACC.yesil]:"yeşil" };   /* dairenin renk adı (soruda) */
/* KURAL (gerçek nesne): Terazi sorusu gerçek terazi görselleriyle (dengede / sol aşağıda / sağ aşağıda); şekiller kefelerin üstüne yerleşir */
function balSVG(L, Rt, tilt){ try{ const key = tilt === "L" ? "balL" : tilt === "R" ? "balR" : "balEq", u = gimg(key), P = (typeof BAL_PANS !== "undefined") ? BAL_PANS[key] : null; if(u && P){ const ih = 110, iw = ih / P.ar, ix = (200 - iw) / 2; const icons = (arr, side) => { const pc = P[side], cx = ix + pc[0] * iw, top = pc[1] * ih, pw = pc[2] * iw, sz = Math.min(8.5, pw / (arr.length * 2.3)); return arr.map((sh, i) => aaShape(sh, cx + (i - (arr.length - 1) / 2) * sz * 2.15, top - sz + 1, sz, balPal[sh])).join(""); }; return `<svg viewBox="0 0 200 110" width="100%" height="100%"><image href="${u}" x="${ix.toFixed(1)}" y="0" width="${iw.toFixed(1)}" height="${ih}" preserveAspectRatio="none"/>${icons(L, "L")}${icons(Rt, "R")}</svg>`; } }catch(e){} return balSVGDraw(L, Rt, tilt); }
function balSVGDraw(L, Rt, tilt){ const tr = tilt === "L" ? 9 : tilt === "R" ? -9 : 0, icons = (arr, x0) => arr.map((sh, i) => aaShape(sh, x0 + (i - (arr.length - 1) / 2) * 18, 29, 8.5, balPal[sh])).join("");
return `<svg viewBox="0 0 200 110" width="100%" height="100%"><polygon points="92,100 108,100 100,58" fill="#5B6670"/><g transform="rotate(${-tr} 100 58)"><rect x="18" y="55" width="164" height="5" rx="2" fill="#B9773A"/><line x1="40" y1="58" x2="40" y2="40" stroke="#5B6670" stroke-width="2"/><line x1="160" y1="58" x2="160" y2="40" stroke="#5B6670" stroke-width="2"/><path d="M14 40 h52 l-6 8 h-40 z" fill="#D9B26B"/><path d="M134 40 h52 l-6 8 h-40 z" fill="#D9B26B"/><g transform="translate(-60 0)">${icons(L, 100)}</g><g transform="translate(60 0)">${icons(Rt, 100)}</g></g></svg>`; }
function balTrials(){ const t = currentCombo().t, pre = isPre(), N = pre ? 4 : 5, out = [], W = { circle:1, triangle:2, square:4 };
  const pairCombos = []; AA_SH.forEach((a, i) => AA_SH.forEach((b, j) => { if(i < j){ pairCombos.push([a, b, true]); pairCombos.push([b, a, false]); } })); const balPairCycle = mkCycle(pairCombos);   /* ikili + taraf birleşimleri tekrarsız */ const perms = []; AA_SH.forEach(a => AA_SH.forEach(b => AA_SH.forEach(c => { if(a !== b && b !== c && a !== c) perms.push([a, b, c]); }))); const balOrderCycle = mkCycle(perms);
const palOff = Math.floor(Math.random() * BAL_PALS.length); for(let q = 0; q < N; q++){ balPal = BAL_PALS[(q + palOff) % BAL_PALS.length];   /* her soruda farklı renk takımı */
if(pre){ if(t < 2){ const light = t === 1 && q % 2 === 1;   // Orta: soru dönüşümlü "daha hafif?" (tersini düşünme)
const [a, b, sideL] = balPairCycle(), heavy = W[a] > W[b] ? a : b, lightS = heavy === a ? b : a;
const stim = `<div style="width:220px;height:120px;margin:0 auto">${balSVG(sideL ? [heavy] : [lightS], sideL ? [lightS] : [heavy], sideL ? "L" : "R")}</div>`;
out.push(qzMake(stim, [aaCell({ sh:heavy, col:balPal[heavy] }), aaCell({ sh:lightS, col:balPal[lightS] })], light ? 1 : 0, { prompt: light ? "Hangisi <b>daha hafif</b>?" : "Hangisi <b>daha ağır</b>?", say: light ? "Hangisi daha hafif?" : "Hangisi daha ağır?", raw:true, fixed:true, cell:90 })); }
else { /* ağırlık sırası her denemede rastgele; iki terazi sırayı gösterir; soru dönüşümlü en ağır / en hafif */
          const w = balOrderCycle(), light = q % 2 === 1; const sideA = Math.random() < 0.5, sideB = Math.random() < 0.5;
          const sc = (heavy, lt, left) => balSVG(left ? [heavy] : [lt], left ? [lt] : [heavy], left ? "L" : "R");
          const stim = `<div style="display:flex;gap:6px;justify-content:center"><div style="width:150px;height:84px">${sc(w[1], w[0], sideA)}</div><div style="width:150px;height:84px">${sc(w[2], w[1], sideB)}</div></div>`;
          const optsSh = shuffleArray(w.slice()), target = light ? w[0] : w[2];
          out.push(qzMake(stim, optsSh.map(sh => aaCell({ sh, col:balPal[sh] })), optsSh.indexOf(target), { prompt: light ? "<b>En hafif</b> hangisi?" : "<b>En ağır</b> hangisi?", say: light ? "En hafif hangisi?" : "En ağır hangisi?", raw:true, fixed:true, cell:84 })); }
continue; }
const rows = [`<div style="width:150px;height:84px">${balSVG(["triangle"], ["circle","circle"], "")}</div>`]; let L, ans;
if(t === 0){ const k = randomItem([1, 2]); L = Array(k).fill("triangle"); ans = 2 * k; }
else if(t === 1){ rows.push(`<div style="width:150px;height:84px">${balSVG(["square"], ["triangle","triangle"], "")}</div>`); L = ["square"]; ans = 4; }
else { rows.push(`<div style="width:150px;height:84px">${balSVG(["square"], ["triangle","triangle"], "")}</div>`); L = ["square","triangle"]; ans = 6; }
const q2 = `<div style="width:150px;height:84px">${balSVG(L, ["?"], "")}</div>`.replace("", "");
const stim = `<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">${rows.join("")}<div style="width:150px;height:84px;position:relative">${balSVG(L, [], "")}<b style="position:absolute;right:26px;top:6px;font-size:22px">?</b></div></div>`;
const choices = Array.from(new Set([ans, ans - 1, ans + 1, ans + 2, Math.max(1, ans - 2)])).slice(0, 4);
const opts = choices.map(n => `<div style="display:flex;flex-wrap:wrap;gap:2px;justify-content:center;align-items:center;width:100%;height:100%">${Array.from({length:n}, () => `<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="10" cy="10" r="8" fill="${balPal.circle}"/></svg>`).join("")}</div>`);
out.push(qzMake(stim, opts, 0, { prompt:`Teraziyi <b>dengelemek</b> için kaç ${BAL_COLN[balPal.circle] || ""} daire gerekir?`.replace("kaç  daire", "kaç daire"), raw:true, fixed:true, cell:84 })); }
return out; }

const CP_PAIRS = [ ["acik","kapali","Açık kapıyı göster.","Kapalı kapıyı göster.","<b>Açık</b> kapı","<b>Kapalı</b> kapı"], ["hizli","yavas","Hızlı olanı göster.","Yavaş olanı göster.","<b>Hızlı</b> olan","<b>Yavaş</b> olan"],
["agir","hafif","Ağır olanı göster.","Hafif olanı göster.","<b>Ağır</b> olan","<b>Hafif</b> olan"], ["islak","kuru","Islak şemsiyeyi göster.","Kuru şemsiyeyi göster.","<b>Islak</b> şemsiye","<b>Kuru</b> şemsiye"],
["temiz","kirli","Temiz tişörtü göster.","Kirli tişörtü göster.","<b>Temiz</b> tişört","<b>Kirli</b> tişört"], ["sert","yumusak","Sert olanı göster.","Yumuşak olanı göster.","<b>Sert</b> olan","<b>Yumuşak</b> olan"] ];
const CI = new Proxy({}, { get: (_, k) => (typeof CONCEPT_IMAGES !== "undefined" ? CONCEPT_IMAGES[k] : undefined) }); /* resimler sonradan yüklenir */
const OPP_PRE = () => [
{ w:"açık", pic: CI.acik, opp: CI.kapali, same: CI.acik }, { w:"kapalı", pic: CI.kapali, opp: CI.acik, same: CI.kapali },
{ w:"hızlı", pic: CI.hizli, opp: CI.yavas, same: CI.hizli }, { w:"yavaş", pic: CI.yavas, opp: CI.hizli, same: CI.yavas },
{ w:"ağır", pic: CI.agir, opp: CI.hafif, same: CI.agir, g:"tas" }, { w:"hafif", pic: CI.hafif, opp: CI.agir, same: CI.hafif, g:"tas" },
{ w:"ıslak", pic: CI.islak, opp: CI.kuru, same: CI.islak }, { w:"kuru", pic: CI.kuru, opp: CI.islak, same: CI.kuru },
{ w:"temiz", pic: CI.temiz, opp: CI.kirli, same: CI.temiz }, { w:"kirli", pic: CI.kirli, opp: CI.temiz, same: CI.kirli },
{ w:"sert", pic: CI.sert, opp: CI.yumusak, same: CI.sert, g:"tas" }, { w:"yumuşak", pic: CI.yumusak, opp: CI.sert, same: CI.yumusak, g:"tas" },
{ w:"gece", pic: DN_IMAGES.moon, opp: DN_IMAGES.sun, same: DN_IMAGES.moon },
{ w:"sıcak", pic: HOTCOLD_IMAGES.fire, opp: randomItem([HOTCOLD_IMAGES.snowman, HOTCOLD_IMAGES.ice, HOTCOLD_IMAGES.icecream]), same: randomItem([HOTCOLD_IMAGES.soup, HOTCOLD_IMAGES.iron, HOTCOLD_IMAGES.sun]) },
{ w:"soğuk", pic: HOTCOLD_IMAGES.penguin, opp: randomItem([HOTCOLD_IMAGES.fire, HOTCOLD_IMAGES.soup, HOTCOLD_IMAGES.sun]), same: randomItem([HOTCOLD_IMAGES.snowman, HOTCOLD_IMAGES.ice, HOTCOLD_IMAGES.icecream]) },
{ w:"gündüz", pic: DN_IMAGES.sun, opp: DN_IMAGES.moon, same: DN_IMAGES.sun },
{ w:"mutlu", pic: NI(3).happy, opp: NI(3).sad, same: NI(3).happy },
{ w:"yavru", pic: ANIM_YB_IMAGES[5], opp: ANIM_YB_IMAGES[4], same: ANIM_YB_IMAGES[1] } ];
const OPP_POST = [["büyük","küçük","iri"],["hızlı","yavaş","çabuk"],["sıcak","soğuk","ılık"],["zengin","fakir","varlıklı"],["cesur","korkak","yürekli"],["erken","geç","sabah"],["kolay","zor","basit"],["genç","yaşlı","yeni"],["açık","kapalı","geniş"],["dolu","boş","kalabalık"],["uzun","kısa","yüksek"],["ağır","hafif","büyük"],["temiz","kirli","parlak"],["sert","yumuşak","katı"],["gece","gündüz","akşam"],["ıslak","kuru","nemli"],["tatlı","acı","şekerli"],["kalın","ince","geniş"],["aydınlık","karanlık","parlak"],["yukarı","aşağı","üst"],["eski","yeni","kullanılmış"],["mutlu","üzgün","neşeli"],["pahalı","ucuz","değerli"],["sessiz","gürültülü","sakin"],["derin","sığ","uzun"],["tok","aç","doymuş"],["ileri","geri","ön"],["doğru","yanlış","gerçek"],["güçlü","zayıf","kuvvetli"]];
function oppTrials2(){ const t = currentCombo().t;
if(isPre()){ const P = OPP_PRE(), N = [3, 4, 5][t];
return shuffleArray(P).slice(0, N).map(x => { const other = randomItem(P.filter(y => y.w !== x.w && y.opp !== x.opp && y.opp !== x.same && y.opp !== x.pic && !(x.g && y.g === x.g))).opp;
return qzMake(`<div style="width:110px;height:110px;margin:0 auto">${qzPic(x.pic)}</div>`, [x.opp, x.same, other].map(src => qzPic(src)), 0, { prompt:`<b>${x.w}</b> · zıttı hangisi?`, raw:true, fixed:true, cell:96, say:`${cap(x.w)}. Bunun zıttı hangisi?`, replay:true }); }); }
const N = [3, 4, 4][t];
return shuffleArray(OPP_POST).slice(0, 6).map(([w, opp, near]) => { const un = randomItem(OPP_POST.filter(x => x[0] !== w && x[0] !== opp && x[0] !== near && x[1] !== near))[0];
const base = [opp, near, un]; const extra = t >= 1 ? randomItem(OPP_POST.filter(x => x[0] !== w && x[0] !== un && !base.includes(x[1]) && x[1] !== w))[1] : null; const opts = base.concat(extra ? [extra] : []).slice(0, N); /* dördüncü seçenek üçüyle çakışmasın */
return qzMake(`<div style="font-size:30px;font-weight:900;color:var(--teal-dark);text-align:center">${w}</div>`, opts.map(x => `<b style="font-size:19px">${x}</b>`), 0, { prompt:"<b>Zıt anlamlısı</b> hangisi?", raw:true, fixed:true, text:true }); }); }
function patTrials2(){ const t = currentCombo().t, pre = isPre(), N = pre ? 4 : 6, out = [];
for(let q = 0; q < N; q++){ const [s1, s2, s3] = shuffleArray(AA_SH), [c1, c2, c3] = shuffleArray(AA_COL); let seq, muts;
const ty = pre ? [["colorAB"], ["shapeAB"], ["AAB","sizeGrow"]][t] : [["ABC","AAB"], ["countGrow","sizeGrow"], ["rotStep","twoAttr"]][t];
const k = randomItem(ty);
if(k === "colorAB") seq = [0, 1, 0, 1, 0, 1].map(i => ({ sh:"circle", col:[c1, c2][i] }));
else if(k === "shapeAB") seq = [0, 1, 0, 1, 0, 1].map(i => ({ sh:[s1, s2][i], col:c1 }));
else if(k === "AAB") seq = [0, 0, 1, 0, 0, 1, 0].map(i => ({ sh:[s1, s2][i], col:[c1, c2][i] }));
else if(k === "ABC") seq = [0, 1, 2, 0, 1, 2, 0].map(i => ({ sh:[s1, s2, s3][i], col:[c1, c2, c3][i] }));
else if(k === "sizeGrow") seq = [0.45, 0.65, 0.85, 1].map(z => ({ sh:s1, col:c1, sz:z }));
else if(k === "countGrow") seq = [1, 2, 3].map(n => ({ sh:s1, col:c1, n }));
else if(k === "rotStep") seq = [0, 90, 180, 270].map(r => ({ sh:"pointer", col:c1, rot:r }));
else seq = [0, 1, 2, 3, 4, 5].map(i => ({ sh:[s1, s2][i % 2], col:[c1, c2, c3][i % 3] }));   // şekil 2'li, renk 3'lü döngü
const ans = seq[seq.length - 1], shown = seq.slice(0, -1);
muts = [{ col:c1 }, { col:c2 }, { col:c3 }, { sh:s1 }, { sh:s2 }, { sh:s3 }, { sz:0.65 }, { sz:0.85 }, { n:2 }, { n:1 }, { rot:90 }, { rot:180 }, { rot:0 }];
const dis = aaDistract(ans, muts, pre ? 2 : 3, k === "sizeGrow");
const stim = `<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center">${shown.map(c => `<div class="wm-card" style="width:44px;height:44px;padding:3px">${aaCell(c)}</div>`).join("")}<div class="wm-card" style="width:44px;height:44px;font-weight:900;font-size:22px;border-style:dashed">?</div></div>`;
out.push(qzMake(stim, [ans].concat(dis).map(aaCell), 0, { prompt:"<b>Sırada</b> hangisi var?", raw:true, fixed:true, cell:84 })); }
return out; }
const AN_RED_PICS = () => [ { n:"elma", src: FRUIT_VEG_IMAGES.apple }, { n:"çilek", src: FRUIT_VEG_IMAGES.strawberry }, { n:"araba", src: TOY_IMAGES.car }, { n:"fincan", src: HOUSE_IMAGES.cup }, { n:"terlik", src: PAL_EXTRA_IMAGES.slipper } ];
function anaTrials2(){ const t = currentCombo().t, pre = isPre(), N = pre ? 4 : 5, out = [];
for(let q = 0; q < N; q++){
if(pre && t >= 1 && q % 2 === 1){ const [p1, p2, p3] = shuffleArray([0, 1, 2, 3]).slice(0, 3), W = (i) => PART_IMAGES[i * 2], Pt = (i) => PART_IMAGES[i * 2 + 1];
const card = (src) => `<div class="wm-card" style="width:62px;height:62px;padding:4px">${qzPic(src)}</div>`;
const stim = `<div style="display:flex;align-items:center;gap:6px;justify-content:center;flex-wrap:wrap">${card(W(p1))}<b>→</b>${card(Pt(p1))}<span style="width:10px"></span>${card(W(p2))}<b>→</b><div class="wm-card" style="width:62px;height:62px;font-weight:900;font-size:26px;border-style:dashed">?</div></div>`;
out.push(qzMake(stim, [qzPic(Pt(p2)), qzPic(W(p2)), qzPic(Pt(p3))], 0, { prompt:"Bütün → parçası: <b>soru işaretine</b> hangisi gelir?", raw:true, fixed:true, cell:96, say:`${cap(PART_PAIRS[p1][0])}, ${PART_PAIRS[p1][1]}. ${cap(PART_PAIRS[p2][0])}…?`, replay:true })); continue; }
if(pre && t === 2 && q % 2 === 0){ const [a, b, c] = shuffleArray(AN_RED_PICS()).slice(0, 3), g = (x, green) => `<div style="width:100%;height:100%;${green ? "filter:hue-rotate(110deg) saturate(1.2)" : ""}">${qzPic(x.src)}</div>`;
const card = (h) => `<div class="wm-card" style="width:62px;height:62px;padding:4px">${h}</div>`;
const stim = `<div style="display:flex;align-items:center;gap:6px;justify-content:center;flex-wrap:wrap">${card(g(a))}<b>→</b>${card(g(a, true))}<span style="width:10px"></span>${card(g(b))}<b>→</b><div class="wm-card" style="width:62px;height:62px;font-weight:900;font-size:26px;border-style:dashed">?</div></div>`;
out.push(qzMake(stim, [g(b, true), g(b), g(c, true)], 0, { prompt:"İlk ikili gibi: <b>soru işaretine</b> hangisi gelir?", raw:true, fixed:true, cell:96 })); continue; }
const [s1, s2] = shuffleArray(AA_SH), [c1, c2, c3] = shuffleArray(AA_COL);
const types = pre ? [["size","color"], ["size","color","count"], ["color","size"]][t] : [["fill","dot"], ["rot","count","fill"], ["two"]][t], ty = randomItem(types);
const tf = { size:(c) => Object.assign({}, c, { sz:1 }), color:(c) => Object.assign({}, c, { col:c2 }), count:(c) => Object.assign({}, c, { n:2 }), fill:(c) => Object.assign({}, c, { outline:false }),
dot:(c) => Object.assign({}, c, { dot:true }), rot:(c) => Object.assign({}, c, { rot:90 }), two:(c) => Object.assign({}, c, { col:c2, n:2 }) }[ty];
const base = (sh) => ty === "size" ? { sh, col:c1, sz:0.55 } : ty === "fill" ? { sh, col:c1, outline:true } : ty === "rot" ? { sh:"pointer", col:sh === s1 ? c1 : c3 } : { sh, col:c1 };
const A = base(s1), B = tf(A), C = base(s2), D = tf(C);
const dis = aaDistract(D, [{ sz:0.55 }, { col:c1 }, { col:c3 }, { n:1 }, { n:3 }, { outline:!D.outline }, { dot:!D.dot }, { rot:0 }, { rot:180 }, { sh:s1 }], pre ? 2 : 3, ty === "size");
const card = (c) => `<div class="wm-card" style="width:62px;height:62px;padding:4px">${aaCell(c)}</div>`;
const stim = `<div style="display:flex;align-items:center;gap:6px;justify-content:center;flex-wrap:wrap">${card(A)}<b>→</b>${card(B)}<span style="width:10px"></span>${card(C)}<b>→</b><div class="wm-card" style="width:62px;height:62px;font-weight:900;font-size:26px;border-style:dashed">?</div></div>`;
out.push(qzMake(stim, [D].concat(dis).map(aaCell), 0, { prompt:"İlk ikili gibi: <b>soru işaretine</b> hangisi gelir?", raw:true, fixed:true, cell:86 })); }
return out; }



const PA_TEXT = { pre:[ ["Elma","bütün elma","elmayı ısırıyor","elma koçanı"], ["El yıkama","musluğu açıyor","ellerini sabunluyor","ellerini duruluyor","havluyla kuruluyor"], ["Çiçek","tohum ekiyor","suluyor","filiz çıkmış","çiçek açmış"] ],
post:[ ["Kaybolan kalem","kalemini arıyor","çantasına bakıyor","sıranın altında buluyor","kalemi alıyor"], ["Yağmurlu gün","gökyüzü kararıyor","yağmur başlıyor","şemsiyesini açıyor","kuru varıyor"], ["Kırılan bardak","bardağı düşürüyor","bardak kırılmış","yardım istiyor","kırıklar toplanıyor","dikkatle taşıyor"] ] };
function paTrials(){ const t = currentCombo().t, pre = isPre(), lvl = pre ? "pre" : "post";
// öncesi: 3–4 kare+ilk kare yerinde → 4 kare+ilk kare yerinde → 4 kare ipucusuz
// sonrası: 4 kare+ilk kare yerinde → 4 kare ipucusuz → 5 karelik hikâye dahil
const tt = Math.min(t, 2), allowed = pre ? [[0, 1], [1, 2], [1, 2]][tt] : [[0, 1], [0, 1], [2, 0, 1]][tt];
const pick = (!pre && tt === 2) ? [2].concat(shuffleArray([0, 1]).slice(0, 1)) : shuffleArray(allowed).slice(0, 2), given = (pre ? tt < 2 : tt === 0) ? 1 : 0;
return pick.map(si => { const imgs = PA_IMAGES[lvl][si]; return { si, lvl, n: imgs.length, cards: shuffleArray(imgs.map((x, i) => i)), given }; }); }
const PART_PAIRS = [ ["araba","tekerlek"], ["kuş","kanat"], ["ağaç","yaprak"], ["ev","kapı"] ];

function pmTrials(){ const t = currentCombo().t, pre = isPre(), N = pre ? [5, 6, 7, 7][Math.min(t, 3)] : [8, 10, 12, 12][Math.min(t, 3)];   /* deneme sayısı düzeyle artar */ const D = [3, 4, 5, 6][Math.min(t, 3)] - 1;   // satırdaki öğe: 3/4/5/6 (ikiz dahil)
const mk = () => {
  if(pre){ let pool;
    if(t >= 2){ const by = {}; picPool().forEach(x => (by[x.cat] = by[x.cat] || []).push(x)); const cats = Object.keys(by).filter(c => by[c].length >= D); pool = shuffleArray(by[randomItem(cats)].slice()).slice(0, D); }   // aynı kategori: ayırt etmek zorlaşır
    else pool = shuffleArray(picPool()).slice(0, D);
    return shuffleArray(pool.concat([pool[0]])).map(x => ({ k: x.n, h: qzPic(x.src) })); }
  if(t === 0){ const sh = shuffleArray(SHAPES.slice()).slice(0, D), cols = shuffleArray(COLORS.slice()); const it = sh.map((s, i) => ({ k: s + cols[i], h: shapeSVG(s, cols[i]) })); return shuffleArray(it.concat([Object.assign({}, it[0])])); }
  if(t === 1 || t === 2){ const L = t === 2 ? 4 : 3, base = String(Math.pow(10, L - 1) + Math.floor(Math.random() * 9 * Math.pow(10, L - 1))); const sims = new Set([base]); let g = 0;
    while(sims.size < D && g++ < 200){ const a = base.split(""); const i = Math.floor(Math.random() * L), j = (i + 1 + Math.floor(Math.random() * (L - 1))) % L; [a[i], a[j]] = [a[j], a[i]]; if(Math.random() < 0.5) a[Math.floor(Math.random() * L)] = String(Math.floor(Math.random() * 10)); if(a[0] !== "0") sims.add(a.join("")); }
    const arr = [...sims]; return shuffleArray(arr.concat([base])).map(v => ({ k: v, h:`<b style="font-size:22px;letter-spacing:1px">${v}</b>` })); }
  const LT = ["b","d","p","q","ğ","g"], mkw = () => Array.from({length:3}, () => randomItem(LT)).join(""); const base = mkw(); const set = new Set([base]); while(set.size < D) set.add(mkw());
  return shuffleArray([...set].concat([base])).map(v => ({ k: v, h:`<b style="font-size:20px;font-family:inherit">${v}</b>` })); };
/* İkizlerin arası: yan yana çıkma olasılığı rastgele karıştırmada %40'a varıyordu. Her denemede aralık (1 = yan yana … n-1 = iki uç) sırayla ve eşit sıklıkta kullanılır. */
  const n = D + 1, gapCycle = []; while(gapCycle.length < N) gapCycle.push(...shuffleArray(Array.from({length: n - 1}, (_, i) => i + 1)));
  return Array.from({length:N}, (_, k) => { const items = mk(), cnt = {}; items.forEach(x => cnt[x.k] = (cnt[x.k] || 0) + 1); const pk = Object.keys(cnt).find(k2 => cnt[k2] === 2);
    const g = gapCycle[k], a = Math.floor(Math.random() * (n - g)), twins = items.filter(x => x.k === pk), rest = items.filter(x => x.k !== pk), placed = []; let ri = 0;
    for(let pos = 0; pos < n; pos++) placed.push(pos === a || pos === a + g ? twins.shift() : rest[ri++]);
    return { items: placed, pk }; }); }
const SV_BANK = [ ["Kuşların kanadı vardır.",1],["Balıklar ağaçta yaşar.",0],["Kar soğuktur.",1],["Güneş geceleri doğar.",0],["İnekler süt verir.",1],["Taşlar yumuşaktır.",0],["Elma bir meyvedir.",1],["Arabalar uçar.",0],["Kışın hava soğuk olur.",1],["Kediler havlar.",0],["Su ıslaktır.",1],["Ateş soğuktur.",0],["Ayakkabı ayağa giyilir.",1],["Bir haftada beş gün vardır.",0],["Limon ekşidir.",1],["Filler çok küçüktür.",0],["Yağmur buluttan yağar.",1],["Buz sıcaktır.",0],["Doktorlar hastaları tedavi eder.",1],["Ağaçlar yürür.",0],["Ekmek fırında pişer.",1],["Çorba çatalla içilir.",0],["Kitaplar okunur.",1],["Tavuklar yüzer.",0] ];
const SV_BANK_MID = [ /* Orta: çıkarım isteyen tek cümleler */
["Kaplumbağalar tavşanlardan daha yavaş yürür.",1],["Pazartesiden iki gün sonra çarşamba gelir.",1],["Buz eriyince suya dönüşür.",1],["Karanlıkta görebilmek için ışığa ihtiyaç duyarız.",1],["Bir balina bir kediden daha büyüktür.",1],["Yazın günler kıştakinden daha uzundur.",1],["Islak bir havlu güneşte zamanla kurur.",1],["Bitkiler büyümek için suya ihtiyaç duyar.",1],["Bir saatte altmış dakika vardır.",1],["Dişlerimizi fırçalamazsak çürüyebilir.",1],["Ekmek undan yapılır.",1],
["Pazartesiden bir gün sonra cuma gelir.",0],["Kar, hava çok sıcakken yağar.",0],["Bir kedi bir filden daha ağırdır.",0],["Güneş sabah batıdan doğar.",0],["Bir saat altı dakikadan oluşur.",0],["Yarın bugünden önce gelir.",0],["Bir hafta on gündür.",0],["Sıcak su buzdan daha soğuktur.",0],["Bir bisikletin dört tekerleği vardır.",0],["Ağır bir taş suya atılınca yüzer.",0],["Köpekler yumurtadan çıkar.",0] ,
["Bir yılda on iki ay vardır.",1],["Sıcak çay zamanla soğur.",1],["Kuşlar yumurtadan çıkar.",1],["Bir düzinede on iki tane vardır.",1],
["Ağaçlar kışın hep çiçek açar.",0],["Bir haftada on gün vardır.",0],["Balıklar karada nefes alarak yaşar.",0],["Gece güneş gökyüzünde parlar.",0]];
const SV_BANK_HARD = [ /* Zor: iki cümle; ikinci cümle ilkinin mantıklı sonucuysa Doğru, çelişiyorsa Yanlış */
["Ayşe şemsiyesini açtı ve çizmelerini giydi. Dışarıda yağmur yağıyor.",1],["Mert bütün gece ders çalıştı. Sabah çok yorgundu.",1],["Kedi mama kabının başında miyavlıyor. Kedi acıkmış olabilir.",1],["Ali'nin ayakkabıları çamur içinde. Ali dışarıda oynamış.",1],["Zeynep üç elma aldı, birini yedi. Elinde iki elma kaldı.",1],["Bugün pazartesi. Yarın salı olacak.",1],["Cam bardak masadan yere düştü. Bardak kırılmış olabilir.",1],["Kerem kalın mont giydi ve eldivenlerini taktı. Hava soğuk.",1],["Deniz suyu tuzludur. Denizden alınan su içilmez.",1],["Elif koşarak geldi ve nefes nefeseydi. Elif acele etmişti.",1],["Saat gece on iki. Dışarısı karanlık.",1],
["Ayşe şemsiyesini açtı ve çizmelerini giydi. Dışarıda güneş açmış, hava sıcak.",0],["Mert erkenden yattı ve sabaha kadar uyudu. Mert hiç uyumadı.",0],["Zeynep üç elma aldı, birini yedi. Elinde dört elma kaldı.",0],["Bugün pazartesi. Yarın cuma olacak.",0],["Ali ayakkabılarını hiç dışarı giymedi. Ayakkabıları çamur içinde.",0],["Kerem şort ve tişört giydi, terliyordu. Hava çok soğuktu.",0],["Kar yağıyor ve her yer bembeyaz. Mevsim yazın ortası.",0],["Elif sınıfa en son girdi. Elif sınıfa ilk gelen öğrenciydi.",0],["Saat öğlen on iki ve güneş tepede. Dışarısı zifiri karanlık.",0],["Deniz hiç yüzme bilmiyor. Deniz yüzme yarışını birinci bitirdi.",0],["Can'ın kalemi kırıldı ve başka kalemi yok. Can yazısını aynı kalemle bitirdi.",0] ,
["Çiçeklere bir hafta su verilmedi. Çiçekler soldu.",1],["Ece yere düşüp dizini çarptı. Dizi acıyor.",1],["Fırından yeni çıkan ekmek dumanı tütüyor. Ekmek sıcak.",1],["Telefonun şarjı bitti. Telefon kapandı.",1],
["Çiçeklere bir hafta su verilmedi. Çiçekler her zamankinden canlı.",0],["Fırından yeni çıkan ekmek dumanı tütüyor. Ekmek buz gibi.",0],["Kerem bütün gün hiçbir şey yemedi. Kerem çok tok.",0],["Mutfakta ışık yok ve perdeler kapalı. Mutfak çok aydınlık.",0]];
const SV_BANKS = [SV_BANK, SV_BANK_MID, SV_BANK_HARD];
function svTrials(){ const t = currentCombo().t, N = [16, 20, 24][t], bank = SV_BANKS[Math.min(t, 2)]; const y = shuffleArray(bank.filter(x => x[1])), n = shuffleArray(bank.filter(x => !x[1])), out = [];
for(let i = 0; i < N; i++){ const s = i % 2 ? y[Math.floor(i / 2) % y.length] : n[Math.floor(i / 2) % n.length]; out.push({ stim:`<div style="font-size:${t === 2 ? 18 : 21}px;font-weight:800;text-align:center;line-height:1.35">${s[0]}</div>`, raw:true, opts:[`<b style="font-size:20px">✓ Doğru</b>`, `<b style="font-size:20px">✗ Yanlış</b>`], ans: s[1] ? 0 : 1, fixed:true, text:true, prompt: t === 2 ? "<b>İki cümleyi oku:</b> ikincisi ilkine uyuyor mu?" : "<b>Oku</b> ve hızlıca karar ver" }); }
return shuffleArray(out); }
function perTrials(){ const t = currentCombo().t, pre = isPre(), N = (pre ? [10, 12, 14] : [16, 20, 24])[Math.min(t, 2)],   /* gösterim sayısı düzeye göre */ ms = (pre ? [1600, 1300, 1100] : [1500, 1200, 1000])[t];
return Array.from({length:N}, () => { const side = randomItem(["l","r","t","b"]), u = 8 + Math.random() * 84, pos = side === "l" ? [4 + Math.random() * 10, u] : side === "r" ? [86 + Math.random() * 10, u] : side === "t" ? [u, 5 + Math.random() * 10] : [u, 85 + Math.random() * 10];
return { pos, ms, lure: !pre && t === 2 && Math.random() < 0.3 }; }); }
/* fixTrials: Sabit Bakış silinince kullanılmıyordu (2026-11-09) */
function dualTrials(){ const t = currentCombo().t, pre = isPre(), secs = pre ? [16, 20, 24][t] : [20, 26, 32][t];
return Array.from({length:2}, () => { const beeps = 3 + Math.floor(Math.random() * (pre ? 3 : 5)), bt = [], st = []; let tt = 1500;
while(tt < secs * 1000 - 1500){ st.push(tt); tt += (pre ? 2200 : 1700) + Math.random() * 600; }
for(let i = 0; i < beeps; i++) bt.push(1200 + Math.random() * (secs * 1000 - 2400));
return { secs, beeps, bt: bt.sort((a, b) => a - b), st, show: pre ? 1500 : 1200 }; }); }
const stopDirs = () => ["l", "r", "u", "d"].slice(0, (isPre() ? [2, 3, 3] : [2, 3, 4])[Math.min(currentCombo().t, 2)]);   /* yön düğmesi sayısı düzeye göre */
function stopArrowSVG(dir, col, px){ const rot = { r:0, l:180, u:-90, d:90 }[dir] || 0; return `<svg viewBox="0 0 100 100" width="${px}" height="${px}" style="display:block"><g transform="rotate(${rot} 50 50)"><path d="M14 40 H56 V22 L88 50 L56 78 V60 H14 Z" fill="${col}" stroke="${col}" stroke-width="6" stroke-linejoin="round"/></g></svg>`; }
function stopTrials(){ const t = currentCombo().t, pre = isPre(), N = selCount(), ssd = 0, win = (pre ? [2000, 1800, 1600] : [1800, 1600, 1400])[Math.min(t, 2)], D = stopDirs();   /* zorluk: yanıt süresi kısalır */   /* ok sayısı düzeye göre */ const out = []; for(let i = 0; i < N; i++){ let dir, g = 0; do{ dir = randomItem(D); g++; } while(g < 20 && i >= 2 && out[i - 1].dir === dir && out[i - 2].dir === dir); out.push({ dir, stop: i > 1 && Math.random() < 0.25, ssd, win }); } return out; }
function vigBuild(){ const t = currentCombo().t, pre = isPre(), N = pre ? [24, 30, 36][t] : [36, 48, 60][t], ms = pre ? 1300 : [1100, 950, 850][t];
const seq = Array.from({length:N}, (_, i) => { const tg = i > 2 && Math.random() < 0.15; if(tg) return { sh:"star", col:"#E5484D", tg:true };
if(!pre && Math.random() < 0.35) return Math.random() < 0.5 ? { sh:"circle", col:ACC.kirmizi } : { sh:"star", col:ACC.mavi };
return { sh: randomItem(["circle","square","triangle","heart"]), col: randomItem([ACC.mavi,ACC.yesil,ACC.turuncu,ACC.mor]) }; });
if(!seq.some(x => x.tg)) seq[5] = { sh:"star", col:"#E5484D", tg:true }; return { seq, ms }; }
function pnbBuild(){ const t = currentCombo().t, pre = isPre(), n = pre ? [1, 1, 1, 2][t] : [1, 2, 2, 3][t], L = pre ? [10, 12, 14, 14][t] : [14, 16, 20, 22][t], seq = [];
for(let i = 0; i < L; i++){ if(i >= n && Math.random() < 0.3) seq.push(seq[i - n]); else { let v; do{ v = Math.floor(Math.random() * 9); } while(i >= n && v === seq[i - n]); seq.push(v); } }
return { n, seq, ms: pre ? 1900 : 1600 }; }
function cspTrials(){ const t = currentCombo().t, L = (isPre() ? [2, 3, 3, 4] : [2, 3, 4, 5])[t];
return Array.from({length:3}, () => ({ counts: Array.from({length:L}, () => 2 + Math.floor(Math.random() * (isPre() ? (t >= 2 ? 4 : 3) : 5))) })); }   // öncesi Zor: aynı uzunluk, daha büyük sayılar

const TONE_KEYS = [ { c:ACC.kirmizi, f:392 }, { c:ACC.mavi, f:494 }, { c:ACC.yesil, f:587 }, { c:ACC.turuncu, f:698 } ];
function toneBeep(f){ try{ const ctx = getAudioCtx(); if(!ctx) return; if(ctx.state === "suspended") ctx.resume(); sfxTone(ctx, f, ctx.currentTime + 0.005, 0.32, "sine", 0.28); }catch(e){} }
function toneTrials(){ const t = currentCombo().t, L = (isPre() ? [2, 3, 4] : [3, 4, 5])[t]; return Array.from({length:4}, () => Array.from({length:L}, () => Math.floor(Math.random() * 4))); }
const WS_MIRROR_OK = new Set(["t-car","t-train","t-kite","t-puzzle","t-ball","h-cup","h-scissors","h-lamp","h-comb","h-broom","h-clock","f-banana","f-grapes","f-cucumber","f-apple"]);   /* ayna görüntüsü belirgin farklı olan resimler (gözle seçildi); simetrik nesnelerde ayna = aslı */
function wsTrials(){ const t = currentCombo().t, pre = isPre(), N = pre ? 5 : 6, pool = picPool();
return Array.from({length:N}, () => { const usesFlip = pre ? t >= 1 : true; let a, b, c; if(usesFlip){ const ok = pool.filter(x => WS_MIRROR_OK.has(x.k)); a = randomItem(ok.length ? ok : pool); [b, c] = shuffleArray(pool.filter(x => x !== a)).slice(0, 2); } else [a, b, c] = shuffleArray(pool).slice(0, 3);
const im = (x, o) => `<div style="width:100%;height:100%;position:relative;${o.flip ? "transform:scaleX(-1);" : ""}${o.hue ? "filter:hue-rotate(" + o.hue + "deg) saturate(1.3);" : ""}">${qzPic(x.src)}${o.patch ? `<div style="position:absolute;left:${o.patch[0]}%;top:${o.patch[1]}%;width:30%;height:30%;background:var(--panel);border-radius:50%"></div>` : ""}</div>`;
const orig = im(a, {}); let lures = pre ? [[im(b, {}), im(c, {})], [im(a, { flip:true }), im(b, {})], [im(a, { flip:true }), im(a, { hue:150 }), im(b, {})]][Math.min(t, 2)] : t === 0 ? [im(a, { flip:true }), im(b, {})] : t === 1 ? [im(a, { flip:true }), im(a, { hue:150 }), im(b, {})] : [im(a, { flip:true }), im(a, { hue:150 }), im(a, { patch:[30 + Math.random() * 20, 25 + Math.random() * 30] }), im(b, {})];   /* seçenek: Okul Öncesi 3-3-4, Okul Sonrası 3-4-5 */
const opts = shuffleArray([orig].concat(lures)); return { study: orig, opts, ans: opts.indexOf(orig), ms: pre ? [3000, 2600, 2200][Math.min(t, 2)] : [2200, 1800, 1500][t] }; }); }
function routeTrials(){ const t = currentCombo().t, pre = isPre(), n = pre ? [3, 4, 4, 5][t] : [4, 5, 5, 6][t], L = pre ? [3, 4, 5, 6][t] : [4, 6, 8, 10][t];
return Array.from({length:3}, () => { let path; let g = 0; do{ path = [Math.floor(Math.random() * n * n)];
while(path.length < L){ const c = path[path.length - 1], r = Math.floor(c / n), k = c % n, nb = [[r - 1, k], [r + 1, k], [r, k - 1], [r, k + 1]].filter(([y, x]) => y >= 0 && y < n && x >= 0 && x < n).map(([y, x]) => y * n + x).filter(x => !path.includes(x)); if(!nb.length) break; path.push(randomItem(nb)); } } while(path.length < L && g++ < 50);
return { n, path }; }); }
const TR_V = "aeıioöuüAEIİOÖUÜ";
function trSylSplit(w){ const s = []; let cur = ""; const isV = (ch) => TR_V.includes(ch); const ch = [...w];
for(let i = 0; i < ch.length; i++){ cur += ch[i]; if(isV(ch[i])){ let j = i + 1, cons = 0; while(j < ch.length && !isV(ch[j])){ cons++; j++; } if(j >= ch.length){ cur += ch.slice(i + 1).join(""); s.push(cur); return s; }
const take = cons <= 1 ? 0 : cons - 1; cur += ch.slice(i + 1, i + 1 + take).join(""); s.push(cur); cur = ""; i += take; } }
if(cur) s.push(cur); return s; }
function sbTrials(){ const t = currentCombo().t, pre = isPre(), pool = snPicPool().filter(x => trSylSplit(x.n).length >= 2 && trSylSplit(x.n).length <= (pre ? [2, 3, 4][t] : [3, 4, 4][t]) && (pre || t < 2 || trSylSplit(x.n).length >= 3)), N = pre ? 5 : 6;
return shuffleArray(pool).slice(0, N).map(tg => { const sy = trSylSplit(tg.n), same = pool.filter(x => x !== tg && trSylSplit(x.n)[0] === sy[0]), oth = shuffleArray(pool.filter(x => x !== tg && !same.includes(x)));
const opts = [tg].concat(shuffleArray(same).slice(0, pre ? (t >= 1 ? 1 : 0) : [0, 1, 2][Math.min(t, 2)]), oth).slice(0, pre ? 3 : 4);
return qzMake("", opts.map(x => qzPic(x.src)), 0, { prompt:"Heceleri <b>birleştir</b>: hangi resim?", say: sy.join("… ") + "…", replay:true, fixed:true, cell:100, rate:0.7 }); }); }
const PHON = { pre:[ { t:0, q:"“Kar-puz” de. Şimdi <b>kar</b> demeden söyle.", a:"puz" }, { t:0, q:"“Çi-çek” de. Şimdi <b>çi</b> demeden söyle.", a:"çek" }, { t:0, q:"“Ka-lem” de. Şimdi <b>ka</b> demeden söyle.", a:"lem" }, { t:0, q:"“Ta-vuk” de. Şimdi <b>ta</b> demeden söyle.", a:"vuk" }, { t:0, q:"“Bar-dak” de. Şimdi <b>bar</b> demeden söyle.", a:"dak" }, { t:0, q:"“Si-mit” de. Şimdi <b>si</b> demeden söyle.", a:"mit" }, { t:0, q:"“El-ma” de. Şimdi <b>el</b> demeden söyle.", a:"ma" },
  { t:1, q:"“Ma-sa” de. Şimdi <b>sa</b> demeden söyle.", a:"ma" }, { t:1, q:"“Ba-lık” de. Şimdi <b>lık</b> demeden söyle.", a:"ba" }, { t:1, q:"“Ke-di” de. Şimdi <b>di</b> demeden söyle.", a:"ke" }, { t:1, q:"“Ar-mut” de. Şimdi <b>mut</b> demeden söyle.", a:"ar" }, { t:1, q:"“Ka-pı” de. Şimdi <b>pı</b> demeden söyle.", a:"ka" }, { t:1, q:"“Yıl-dız” de. Şimdi <b>dız</b> demeden söyle.", a:"yıl" }, { t:1, q:"“Çan-ta” de. Şimdi <b>ta</b> demeden söyle.", a:"çan" },
  { t:2, q:"“Ka-pı” de. <b>ka</b> yerine <b>ta</b> söyle.", a:"tapı" }, { t:2, q:"“Top” de. Sonuna <b>-lar</b> ekle.", a:"toplar" }, { t:2, q:"“Ma-sa” de. <b>ma</b> yerine <b>ka</b> söyle.", a:"kasa" }, { t:2, q:"“Ke-di” de. Sonuna <b>-ler</b> ekle.", a:"kediler" }, { t:2, q:"“Ka-le” de. <b>ka</b> yerine <b>ba</b> söyle.", a:"bale" }, { t:2, q:"“Top” de. Sonuna <b>-um</b> ekle.", a:"topum" } ],
  post:[ { t:0, q:"“Kalem” de. Şimdi ilk sesi <b>k</b> olmadan söyle.", a:"alem" }, { t:0, q:"“Masa” de. Şimdi ilk sesi <b>m</b> olmadan söyle.", a:"asa" }, { t:0, q:"“Tarak” de. <b>t</b> olmadan söyle.", a:"arak" }, { t:0, q:"“Kuzu” de. <b>k</b> olmadan söyle.", a:"uzu" }, { t:0, q:"“Para” de. <b>p</b> olmadan söyle.", a:"ara" }, { t:0, q:"“Kaz” de. <b>k</b> olmadan söyle.", a:"az" }, { t:0, q:"“Bal” de. <b>b</b> olmadan söyle.", a:"al" }, { t:0, q:"“Saç” de. <b>s</b> olmadan söyle.", a:"aç" },
  { t:1, q:"“Kitap” de. Son sesi <b>p</b> olmadan söyle.", a:"kita" }, { t:1, q:"“Balık” de. Son sesi <b>k</b> olmadan söyle.", a:"balı" }, { t:1, q:"“Dalga” de. <b>l</b> sesi olmadan söyle.", a:"daga" }, { t:1, q:"“Kurt” de. <b>r</b> sesi olmadan söyle.", a:"kut" }, { t:1, q:"“Kalem” de. Son sesi <b>m</b> olmadan söyle.", a:"kale" }, { t:1, q:"“Taş” de. Son sesi <b>ş</b> olmadan söyle.", a:"ta" }, { t:1, q:"“Yurt” de. <b>r</b> sesi olmadan söyle.", a:"yut" }, { t:1, q:"“Kart” de. <b>r</b> sesi olmadan söyle.", a:"kat" },
  { t:2, q:"“Kedi” de. <b>k</b> yerine <b>b</b> koy.", a:"bedi" }, { t:2, q:"“Masa” de. <b>m</b> yerine <b>k</b> koy.", a:"kasa" }, { t:2, q:"“Top” de. Sesleri tersten söyle.", a:"pot" }, { t:2, q:"“Ara” de. Başına <b>k</b> ekle.", a:"kara" }, { t:2, q:"“Kaz” de. <b>k</b> yerine <b>s</b> koy.", a:"saz" }, { t:2, q:"“Bal” de. <b>b</b> yerine <b>d</b> koy.", a:"dal" }, { t:2, q:"“Kar” de. Sesleri tersten söyle.", a:"rak" }, { t:2, q:"“Al” de. Başına <b>k</b> ekle.", a:"kal" }, { t:2, q:"“At” de. Sesleri tersten söyle.", a:"ta" } ] };
const SB_BANK = [ { t:0, w:["Kedi","süt","içti."], ok:[[0,1,2]] }, { t:0, w:["Ali","top","oynadı."], ok:[[0,1,2]] }, { t:0, w:["Annem","çay","demledi."], ok:[[0,1,2]] }, { t:0, w:["Kuşlar","gökyüzünde","uçar."], ok:[[0,1,2]] },
{ t:1, w:["Ece","parkta","ip","atladı."], ok:[[0,1,2,3],[0,2,1,3]] }, { t:1, w:["Babam","dün","araba","yıkadı."], ok:[[0,1,2,3],[1,0,2,3],[0,2,1,3]] }, { t:1, w:["Çocuklar","bahçede","kartopu","oynadı."], ok:[[0,1,2,3],[0,2,1,3]] },
{ t:2, w:["Küçük","kedi","mavi","yumağı","kovaladı."], ok:[[0,1,2,3,4]] }, { t:2, w:["Mert","sabah","okula","otobüsle","gitti."], ok:[[0,1,2,3,4],[0,1,3,2,4],[1,0,2,3,4],[1,0,3,2,4]] }, { t:2, w:["Yağmur","yağınca","sokaklar","ıslandı."], ok:[[0,1,2,3]] } ];
function sbuildTrials(){ const t = currentCombo().t; return shuffleArray(SB_BANK.filter(x => x.t === t)).concat(shuffleArray(SB_BANK.filter(x => x.t < t))).slice(0, 3).map(x => ({ w: x.w, ok: x.ok, cards: shuffleArray(x.w.map((_, i) => i)) })); }
const WH_FIX = (q) => q.replace(/vardı\?/g, "var?").replace(/asılıydı\?/g, "asılı?").replace(/oturuyordu\?/g, "oturuyor?").replace(/kayıyordu\?/g, "kayıyor?").replace(/renkti\?/g, "renk?").replace(/ydı\?/g, "?").replace(/dı\?/g, "?");
function whTrials(){ const t = currentCombo().t, sc = pickScene(), N = [4, 5, 6][t], allA = SCENES.flatMap(s => s.q.map(x => x[1]));
return shuffleArray(sc.q).slice(0, N).map(([q, a]) => { const near = shuffleArray(sc.q.map(x => x[1]).filter(x => x !== a)), far = shuffleArray(allA.filter(x => x !== a && !near.includes(x)));
return qzMake(`<img class="wh-img" src="${SCENE_IMAGES[sc.k]}" alt="" style="display:block;width:100%;max-width:340px;max-height:46vh;object-fit:contain;border-radius:12px;margin:0 auto">`, [a].concat(near.slice(0, t >= 1 ? 2 : 1), far).slice(0, t === 0 ? 3 : 4).map(x => `<b style="font-size:16px">${x}</b>`), 0, { prompt:`<b>${WH_FIX(q)}</b>`, raw:true, fixed:true, text:true, say: WH_FIX(q), replay:true }); }); }
function sdTrials(){ const t = currentCombo().t, pre = isPre(), slots = pre ? [6, 6, 6, 9][t] : [8, 9, 12, 12][t], D = pre ? [2, 3, 4, 4][t] : [3, 4, 5, 6][t], cols = slots <= 6 ? 3 : slots <= 9 ? 3 : 4;
return Array.from({length: pre ? 2 : 2}, () => { const base = Array.from({length:slots}, () => ({ sh: randomItem(["circle","square","triangle","star","heart"]), col: randomItem(COLORS) }));
const diff = shuffleArray(base.map((_, i) => i)).slice(0, D), right = base.map((b, i) => { if(!diff.includes(i)) return Object.assign({}, b); const kind = randomItem(["col","sh","gone"]);
if(kind === "col") return Object.assign({}, b, { col: randomItem(COLORS.filter(c => c !== b.col)) }); if(kind === "sh") return Object.assign({}, b, { sh: randomItem(["circle","square","triangle","star","heart"].filter(s => s !== b.sh)) }); return Object.assign({}, b, { gone:true }); });
return { base, right, diff, cols }; }); }
function pfTrials(){ const t = currentCombo().t, N = 4;
return Array.from({length:N}, () => { const fold = t === 0 ? randomItem(["v","h"]) : t === 1 ? randomItem(["v","h","d"]) : "q";
let hole; do{ hole = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)]; } while((fold === "v" || fold === "q") && hole[0] > 1 || (fold === "h" || fold === "q") && hole[1] > 1 || fold === "d" && hole[0] <= hole[1]);
const mir = (p, ax) => ax === "v" ? [3 - p[0], p[1]] : ax === "h" ? [p[0], 3 - p[1]] : [p[1], p[0]];
let holes = [hole]; if(fold === "q"){ holes = [hole, mir(hole, "v"), mir(hole, "h"), mir(mir(hole, "v"), "h")]; } else holes = [hole, mir(hole, fold)];
const key = (H) => H.map(p => p.join(",")).sort().join(";"); const right = holes;
const wrongs = [[hole], fold === "v" ? [hole, mir(hole, "h")] : [hole, mir(hole, "v")], holes.concat([[ (hole[0] + 2) % 4, (hole[1] + 1) % 4 ]]), holes.map(p => mir(p, fold === "h" ? "v" : "h")), [[ hole[0], (hole[1] + 2) % 4 ]]].filter((w, k, A) => key(w) !== key(right) && A.findIndex(z => key(z) === key(w)) === k);   /* 5 seçeneğe yetecek kadar farklı çeldirici */ { let g = 0; while(wrongs.length < 4 && g++ < 40){ const w = holes.map(p => [(p[0] + 1 + Math.floor(Math.random() * 3)) % 4, p[1]]); if(key(w) !== key(right) && !wrongs.some(z => key(z) === key(w))) wrongs.push(w); } }   /* her zaman en az 4 farklı çeldirici */
const paper = (H, w) => `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="6" y="6" width="88" height="88" fill="#FFF8E5" stroke="#B9773A" stroke-width="2"/>${H.map(([x, y]) => `<circle cx="${17 + x * 22}" cy="${17 + y * 22}" r="6" fill="#3A4A5C"/>`).join("")}</svg>`;
const foldPic = `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="6" y="6" width="${fold === "v" || fold === "q" ? 44 : 88}" height="${fold === "h" || fold === "q" ? 44 : 88}" fill="#FFE9B8" stroke="#B9773A" stroke-width="2"/>${fold === "d" ? `<polygon points="6,6 94,94 94,6" fill="#FFE9B8" stroke="#B9773A" stroke-width="2"/><rect x="6" y="6" width="88" height="88" fill="none" stroke="#B9773A" stroke-width="1" stroke-dasharray="4 3"/>` : `<rect x="6" y="6" width="88" height="88" fill="none" stroke="#B9773A" stroke-width="1" stroke-dasharray="4 3"/>`}<circle cx="${17 + hole[0] * 22}" cy="${17 + hole[1] * 22}" r="6" fill="#3A4A5C"/></svg>`;
const opts = [paper(right)].concat(wrongs.slice(0, 4).map(w => paper(w)));   /* 5 seçenek; düzeye göre ortak katman kırpar */
const stim = `<div style="display:flex;gap:6px;align-items:center;justify-content:center"><div class="wm-card" style="width:96px;height:96px;padding:2px">${foldPic}</div><b style="font-size:13px;max-width:110px">Kâğıt ${fold === "q" ? "iki kez" : "bir kez"} katlandı ve delindi. Açınca?</b></div>`;
return qzMake(stim, opts, 0, { prompt:"Kâğıt <b>açılınca</b> nasıl görünür?", raw:true, fixed:true, cell:90 }); }); }
function vfTrials(){ const t = currentCombo().t, vfPool = MR_CUBES.concat([[[0,0,0],[1,0,0],[0,1,0],[0,0,1]], [[0,0,0],[1,0,0],[2,0,0],[1,1,0],[1,1,1]]]); const nextCs = mkCycle(t === 2 ? vfPool.filter(c => c.length >= 5) : vfPool), nextCol = mkCycle(MR_CUBE_COLS);   /* tur içinde yapı tekrarsız, her soruda farklı renk; Zor: 5 küplü yapılar */
return Array.from({length:4}, () => { const cs = nextCs(), col = nextCol(), view = t === 0 ? "üst" : t === 1 ? randomItem(["üst","ön"]) : randomItem(["üst","ön","yan"]);
const proj = (C) => { const set = new Set(C.map(([x, y, z]) => view === "üst" ? x + "," + y : view === "ön" ? x + "," + (2 - z) : y + "," + (2 - z))); return [...set].map(s => s.split(",").map(Number)); };
const grid = (P) => { const xs = P.map(p => p[0]), ys = P.map(p => p[1]), mx = Math.min(...xs), my = Math.min(...ys); return `<svg viewBox="-1 -1 5 5" width="100%" height="100%">${P.map(([x, y]) => `<rect x="${x - mx + 0.05}" y="${y - my + 0.05}" width="0.9" height="0.9" fill="${col}" stroke="#2B3A4A" stroke-width="0.05"/>`).join("")}</svg>`; };
const key = (P) => { const xs = P.map(p => p[0]), ys = P.map(p => p[1]), mx = Math.min(...xs), my = Math.min(...ys); return P.map(([x, y]) => (x - mx) + "," + (y - my)).sort().join(";"); };
const right = proj(cs), cand = [right.map(([x, y]) => [-x, y]), right.map(([x, y]) => [y, x]), right.slice(0, -1), right.concat([[Math.max(...right.map(p => p[0])) + 1, right[0][1]]])].filter(c => c.length && key(c) !== key(right));
const seen = new Set([key(right)]), wr = []; cand.forEach(c => { if(!seen.has(key(c))){ seen.add(key(c)); wr.push(c); } });
return qzMake(`<div style="width:130px;height:130px;margin:0 auto">${cubeSVG(cs, col)}</div>`, [grid(right)].concat(wr.slice(0, 3).map(grid)), 0, { prompt:`Bu yapıya <b>${view === "üst" ? "üstten" : view === "ön" ? "önden (sağ alt yüzden)" : "yandan (sol alt yüzden)"}</b> bakınca hangisini görürsün?`, raw:true, fixed:true, cell:80 }); }); }
function ceTrials(){ const t = currentCombo().t, pre = isPre();
const stories = (pre ? PA_IMAGES.pre : PA_IMAGES.post).map(s => [s[0], s[s.length - 1]]).concat(STORY_SEQ_IMAGES.map(s => [s[0], s[s.length - 1]]));
return shuffleArray(stories.map((s, i) => i)).slice(0, pre ? 4 : 5).map(i => { const oth = shuffleArray(stories.map((s, k) => k).filter(k => k !== i)).slice(0, (pre ? [1, 2, 3] : [2, 3, 4])[Math.min(t, 2)]);   // seçenek: öncesi 2/3/4 · sonrası 3/4/5
const img = (src) => `<img src="${src}" alt="" style="width:100%;height:100%;object-fit:contain">`;
return qzMake(`<div class="wm-card" style="width:150px;height:110px;margin:0 auto;padding:3px">${img(stories[i][0])}</div>`, [i].concat(oth).map(k => img(stories[k][1])), 0, { prompt:"Bu olayın <b>sonunda</b> ne olur?", raw:true, fixed:true, cell:110 }); }); }
function sdkTrials(){ const t = currentCombo().t, pre = isPre(), n = pre ? [3, 3, 4, 4][t] : [3, 4, 4, 4][t], blanks = pre ? [2, 3, 4, 5][t] : [4, 6, 9, 12][t];
const fr = shuffleArray([FRUIT_VEG_IMAGES.apple, FRUIT_VEG_IMAGES.banana, FRUIT_VEG_IMAGES.strawberry, FRUIT_VEG_IMAGES.grapes].filter(Boolean)).slice(0, n);
return Array.from({length:2}, () => { const p = shuffleArray([...Array(n).keys()]), rows = shuffleArray([...Array(n).keys()]), cols = shuffleArray([...Array(n).keys()]);
const sol = Array.from({length: n * n}, (_, i) => p[(rows[Math.floor(i / n)] + cols[i % n]) % n]); const hide = new Set(shuffleArray([...Array(n * n).keys()]).slice(0, blanks));
return { n, sol, given: sol.map((v, i) => hide.has(i) ? null : v), pics: fr }; }); }
function npTrials(){ const t = currentCombo().t;
return Array.from({length:6}, () => { let seq, ty = t === 0 ? "add" : t === 1 ? randomItem(["sub","mul","add"]) : t === 2 ? randomItem(["grow","alt","mul"]) : randomItem(["x2p1","fib","grow"]);
if(ty === "add"){ const a = 1 + Math.floor(Math.random() * 9), d = 1 + Math.floor(Math.random() * 5); seq = [0, 1, 2, 3, 4].map(i => a + i * d); }
else if(ty === "sub"){ const d = 1 + Math.floor(Math.random() * 4), a = 20 + Math.floor(Math.random() * 10); seq = [0, 1, 2, 3, 4].map(i => a - i * d); }
else if(ty === "mul"){ const a = 1 + Math.floor(Math.random() * 3); seq = [0, 1, 2, 3, 4].map(i => a * Math.pow(2, i)); }
else if(ty === "grow"){ const a = 1 + Math.floor(Math.random() * 5); seq = [a]; for(let i = 1; i < 5; i++) seq.push(seq[i - 1] + i); }
else if(ty === "x2p1"){ const a = 1 + Math.floor(Math.random() * 3); seq = [a]; for(let i = 1; i < 5; i++) seq.push(seq[i - 1] * 2 + 1); }
else if(ty === "fib"){ const a = 1 + Math.floor(Math.random() * 2), b = a + 1 + Math.floor(Math.random() * 2); seq = [a, b]; while(seq.length < 5) seq.push(seq[seq.length - 1] + seq[seq.length - 2]); }
else { const a = 2 + Math.floor(Math.random() * 5), x = 2 + Math.floor(Math.random() * 3), y = 1; seq = [a]; for(let i = 1; i < 5; i++) seq.push(seq[i - 1] + (i % 2 ? x : -y)); }
const ans = seq[4], opts = shuffleArray(Array.from(new Set([ans, ans + 1, ans - 1, ans + 2, seq[3] + (seq[3] - seq[2])]))).filter(v => v !== ans).slice(0, 3);
return qzMake(`<div style="display:flex;gap:6px;justify-content:center;font-size:24px;font-weight:900">${seq.slice(0, 4).map(v => `<span class="anl-w">${v}</span>`).join("")}<span class="anl-w q">?</span></div>`, [ans].concat(opts).map(v => `<b style="font-size:22px">${v}</b>`), 0, { prompt:"<b>Sırada</b> hangi sayı var?", raw:true, fixed:true, text:true }); }); }




const NW_NAMES = ["tomi","buli","kafo","zeru","mipa","doke","sela","nuvo"];
function newWordBuild(){ const t = currentCombo().t, K = (isPre() ? [2, 3, 3] : [3, 4, 6])[t];
const ids = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7]), names = shuffleArray(NW_NAMES.slice()), learn = ids.slice(0, K).map((ci, k) => ({ ci, nm: names[k] }));
const lure = (!isPre() && t === 2) ? ids[K] : null;
return { learn, lure, test: shuffleArray(learn.slice()).concat(t === 2 ? shuffleArray(learn.slice()).slice(0, 2) : []) }; }
const SP_PAIRS = [ { t:1, a:["Köpek kediyi kovalıyor.", 0], b:["Kedi köpeği kovalıyor.", 1] }, { t:1, a:["Kız oğlanı itiyor.", 2], b:["Oğlan kızı itiyor.", 3] },
{ t:0, a:["Top kutunun içinde.", 4], b:["Kutu topun üstünde.", 5] }, { t:0, a:["Kuş ağacın önünde.", 6], b:["Kuş ağacın arkasında.", 7] },
{ t:1, a:["Anne bebeği yıkıyor.", 8], b:["Bebek anneyi yıkıyor.", 9] }, { t:0, a:["Çocuk ata biniyor.", 10], b:["At çocuğun yanında yürüyor.", 11] },
{ t:2, a:["Kız elmayı yiyor.", 12], b:["Kız elmayı yiyecek.", 13] } ];
function spTrials(){ const t = currentCombo().t, pool = SP_PAIRS.filter(p => p.t <= t), N = isPre() ? [4, 5, 6][t] : [5, 6, 8][t], out = [];
const order = shuffleArray(pool.filter(p => p.t === t)).concat(shuffleArray(pool.filter(p => p.t < t))); const combos = []; order.forEach(pr => { const sidesO = shuffleArray([true, false]); combos.push([pr, sidesO[0]]); }); order.forEach(pr => combos.push([pr, !combos.find(c => c[0] === pr)[1]])); /* önce her çiftin bir yüzü, sonra öbür yüzü: turda aynı cümle tekrarlanmaz */ for(let k = 0; k < N; k++){ const [pr, useA] = combos[k % combos.length], tg = useA ? pr.a : pr.b, foil = useA ? pr.b : pr.a;
const extra = t === 2 ? [randomItem(SP_PAIRS.filter(p => p !== pr))[Math.random() < 0.5 ? "a" : "b"][1]] : [];
const opts = [tg[1], foil[1]].concat(extra).map(i => qzPic(SENTPIC_IMAGES[i]));
out.push(qzMake(isPre() ? "" : `<div style="font-size:20px;font-weight:900;text-align:center;color:var(--teal-dark)">${tg[0]}</div>`, opts, 0, { prompt:"Cümleye <b>uyan resim</b> hangisi?", raw:true, fixed:true, cell:120, say: tg[0], replay:true })); }
return out; }

const CF_COL = [["kırmızı",ACC.kirmizi],["mavi",ACC.mavi],["sarı",ACC.sari],["yeşil",ACC.yesil]], CF_SH = [["daire","circle"],["dikdörtgen","rect"],["üçgen","triangle"],["yıldız","star"]];
function cfTrials(){ const t = currentCombo().t, pre = isPre(), N = pre ? [3, 4, 4][t] : [6, 6, 8][t], maxC = pre ? [2, 2, 3][t] : [3, 3, 4][t];
const mkC = () => ({ c: Math.floor(Math.random() * 4), s: Math.floor(Math.random() * 4), big: Math.random() < 0.5, hol: !pre && t >= 1 && Math.random() < 0.5 });
const key = (x) => [x.c, x.s, x.big, x.hol].join(",");
return Array.from({length: pre ? 4 : 5}, () => { for(let g = 0; g < 200; g++){ const set = new Map(); while(set.size < N){ const x = mkC(); set.set(key(x), x); } const cands = [...set.values()], tg = randomItem(cands);
const st = [ { tx:`${cap(CF_COL[tg.c][0])}.`, f:(x) => x.c === tg.c, pos:true }, ...CF_COL.filter((_, i) => i !== tg.c).map(([n], i0) => { const ci = CF_COL.findIndex(z => z[0] === n); return { tx:`${cap(n)} değil.`, f:(x) => x.c !== ci }; }),
{ tx:`${cap(CF_SH[tg.s][0])}.`, f:(x) => x.s === tg.s, pos:true }, ...CF_SH.filter((_, i) => i !== tg.s).map(([n]) => { const si = CF_SH.findIndex(z => z[0] === n); return { tx:`${cap(n)} değil.`, f:(x) => x.s !== si }; }),
{ tx: tg.s === 0 ? "Köşesi yok." : "Köşesi var.", f:(x) => (x.s === 0) === (tg.s === 0) }, { tx: tg.big ? "Büyük." : "Küçük.", f:(x) => x.big === tg.big } ].concat(!pre && t >= 1 ? [{ tx: tg.hol ? "İçi boş." : "İçi dolu.", f:(x) => x.hol === tg.hol }] : []);
let rem = cands.slice(); const clues = [];
while(rem.length > 1 && clues.length < maxC){ const opts = shuffleArray(st.filter(c => !clues.includes(c) && rem.some(x => !c.f(x)) && rem.filter(c.f).length >= 1)); if(!opts.length) break;
const pref = pre ? opts.sort((a, b) => (b.pos ? 1 : 0) - (a.pos ? 1 : 0)) : opts.sort((a, b) => (a.pos ? 1 : 0) - (b.pos ? 1 : 0));
const c = pref.find(c => rem.filter(c.f).length < rem.length && (clues.length + 1 < maxC || rem.filter(c.f).length === 1)) || pref[0]; clues.push(c); rem = rem.filter(c.f); }
if(rem.length === 1 && rem[0] === tg && clues.length >= Math.min(2, maxC)) return { cands, tg, clues: clues.map(c => c.tx) }; }
return null; }).filter(Boolean); }
const cfShape = (x) => { const sh = CF_SH[x.s][1], col = CF_COL[x.c][1], z = x.big ? 92 : 56;
return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center"><div style="position:relative;width:${z}%;height:${z}%">${shapeSVG(sh, col)}${x.hol ? `<div style="position:absolute;left:24%;top:${sh === "triangle" ? 34 : 24}%;width:52%;height:52%">${shapeSVG(sh, "#FFFFFF")}</div>` : ""}</div></div>`; };
function ctTrials(){ const t = currentCombo().t, pre = isPre(), R = pre ? [2, 2, 3][t] : [3, 3, 3][t], C = pre ? [2, 3, 3][t] : [3, 4, 4][t], given = pre ? [0.5, 0.34, 0.2][t] : [0.34, 0.2, 0][t];
return Array.from({length:2}, () => { const rows = shuffleArray([0, 1, 2, 3]).slice(0, R), cols = shuffleArray([0, 1, 2, 3]).slice(0, C), cells = [];
for(let r = 0; r < R; r++) for(let c = 0; c < C; c++) cells.push({ c: rows[r], s: cols[c], given: Math.random() < given });
if(cells.every(x => x.given)) cells[0].given = false; return { R, C, rows, cols, cells, pieces: shuffleArray(cells.map((x, i) => i).filter(i => !cells[i].given)) }; }); }
const CO_COL = [["kırmızı",ACC.kirmizi],["mavi",ACC.mavi],["sarı",ACC.sari],["yeşil",ACC.yesil],["mor",ACC.mor]];
function coTrials(){ const t = currentCombo().t, pre = isPre(), K = pre ? [2, 3, 4][t] : [3, 4, 6][t], ms = (pre ? [4500, 5500, 6500] : [4000, 5000, 6500])[t];
return Array.from({length: pre ? 2 : 3}, () => { const pics = shuffleArray(picPool()).slice(0, K), cols = shuffleArray(CO_COL.map((_, i) => i)).slice(0, Math.min(K, 5)); const items = pics.map((p, i) => ({ p, ci: cols[i % cols.length] }));
return { items, ms, test: shuffleArray(items.slice()), nOpt: pre ? 3 : 4 }; }); }
function poTrials(){ const t = currentCombo().t, pre = isPre(), K = pre ? [2, 3, 4][t] : [3, 4, 5][t], lures = (!pre && t === 2) ? 2 : (t === 2 ? 1 : 0);
return Array.from({length:3}, () => { const pool = shuffleArray(picPool()), seq = pool.slice(0, K); return { seq, opts: shuffleArray(seq.concat(pool.slice(K, K + lures))), ms: pre ? 1300 : 1000 }; }); }
function ftTrials(){ const t = currentCombo().t, pre = isPre(), dur = (pre ? [11, 9, 8] : [9, 7, 6])[t], R = pre ? 46 : [40, 34, 30][t];
const paths = ["wave","loop","zig"].concat(!pre && t === 2 ? ["eight"] : []); return shuffleArray(paths).slice(0, 3).map(p => ({ p, dur, R })); }
function ftPos(p, u){ if(p === "wave") return [0.1 + 0.8 * u, 0.5 + 0.3 * Math.sin(u * Math.PI * 3)];
if(p === "loop") return [0.5 + 0.35 * Math.cos(u * Math.PI * 2 - Math.PI / 2), 0.5 + 0.35 * Math.sin(u * Math.PI * 2 - Math.PI / 2)];
if(p === "eight") return [0.5 + 0.35 * Math.sin(u * Math.PI * 2), 0.5 + 0.3 * Math.sin(u * Math.PI * 4)];
const k = u * 4, i = Math.min(3, Math.floor(k)), f = k - i, ys = [0.2, 0.8, 0.2, 0.8, 0.2]; return [0.1 + 0.8 * u, ys[i] + (ys[i + 1] - ys[i]) * f]; }
/* KURAL (Gözle Say çeşitliliği, 2026-11-09): şekil sayısı düzeyin aralığından rastgele seçilir (Okul Öncesi 3–6 / 5–8 / 7–10, Okul Sonrası 8–12 / 12–16 / 16–20); bir sayfadaki üç sorunun cevapları birbirinden farklıdır ve bir önceki sayfanın son cevabıyla başlamaz. Önceden şekil sayısı düzeye göre sabitti, cevap hep aynı çıkıyordu (Okul Öncesi Zor'da hep 9) */
function ecTrials(){ const t = currentCombo().t, pre = isPre(), R = pre ? [[3,6],[5,8],[7,10]][t] : [[8,12],[12,16],[16,20]][t], onlyStar = !pre && t === 2; const used = []; let last = window.__ecLastAns;
const one = () => { let best = null; for(let tries = 0; tries < 12; tries++){ const T = ecTrialOnce(R, onlyStar); if(!used.includes(T.ans) && T.ans !== last){ best = T; break; } if(!best) best = T; } used.push(best.ans); last = best.ans; return best; };
const out = [one(), one(), one()]; window.__ecLastAns = out[out.length - 1].ans; return out; }
function ecTrialOnce(R, onlyStar){ const N = R[0] + Math.floor(Math.random() * (R[1] - R[0] + 1)); { const pts = []; let g = 0; while(pts.length < N && g++ < 900){ const x = 6 + Math.random() * 82, y = 6 + Math.random() * 80; if(pts.every(p => Math.hypot(p[0] - x, p[1] - y) > 11)) pts.push([x, y]); }
const items = pts.map(p => ({ x:p[0], y:p[1], sh: onlyStar ? randomItem(["star","star","circle","heart"]) : "star", c: onlyStar ? randomItem(COLORS) : "#F5A524" }));
return { items, ans: onlyStar ? items.filter(i => i.sh === "star").length : items.length, onlyStar }; } }
const LA_PA_TEXT = [ ["Çocuğun önünde bir elma vardı.","Çocuk elmayı ısırdı.","Elmadan geriye koçanı kaldı."], ["Çocuk musluğu açtı.","Ellerini sabunladı.","Ellerini suyla duruladı.","Ellerini havluyla kuruladı."], ["Çocuk saksıya tohum ekti.","Tohumu suladı.","Topraktan küçük bir filiz çıktı.","Saksıda bir çiçek açtı."] ];
function laTrials(){ const t = currentCombo().t, pre = isPre(), stories = PA_IMAGES.pre.map((im, i) => ({ im, tx: LA_PA_TEXT[i] })).concat(STORY_SEQ_IMAGES.map((im, i) => ({ im, tx: STORY_SEQ_TEXT[i] })));
return shuffleArray(stories).slice(0, pre ? 4 : 5).map(S => { const n = S.im.length, types = ["first","last"].concat(t >= 1 ? ["after"] : []).concat(t === 2 ? ["before"] : []); const ty = randomItem(types);
let k, q; if(ty === "first"){ k = 0; q = "En önce ne oldu?"; } else if(ty === "last"){ k = n - 1; q = "En son ne oldu?"; } else if(ty === "after"){ const j = Math.floor(Math.random() * (n - 1)); k = j + 1; q = `“${S.tx[j].replace(/\.$/, "")}.” Sonra ne oldu?`; } else { const j = 1 + Math.floor(Math.random() * (n - 1)); k = j - 1; q = `“${S.tx[j].replace(/\.$/, "")}.” Ondan önce ne olmuştu?`; }
const idx = shuffleArray([...Array(n).keys()]).slice(0, pre ? Math.min(3, n) : n); if(!idx.includes(k)) idx[0] = k; const ord = shuffleArray(idx);
const img = (src) => `<img src="${src}" alt="" style="width:100%;height:100%;object-fit:contain">`;
return { stim:"", opts: ord.map(i => img(S.im[i])), ans: ord.indexOf(k), say: S.tx.join(" ") + " " + q, prompt:`<b>${q}</b>`, replay:true, fixed:true, cell:110 }; }); }
const RHYME_DONE = { pre:[ { t:0, q:"“Minik kedi süt içer, bıyığından süt …”", a:"düşer" }, { t:0, q:"“Yağmur yağar şıp şıp şıp, kurbağalar zıp zıp …”", a:"zıp" }, { t:0, q:"“Ay doğdu, gece oldu; gökyüzü yıldızla …”", a:"doldu" },
{ t:1, q:"“Rüzgâr eser, yapraklar uçar; sincap ağaca hemen …”", a:"kaçar" }, { t:1, q:"“Saat tik tak, tik tak çalar; sabah olunca herkes …”", a:"kalkar" }, { t:1, q:"“Kurbağa vrak vrak der, sinek görünce hemen …”", a:"yer" },
{ t:2, q:"“Ördek yüzer gölde, yavrusu hep …”", a:"önde" }, { t:2, q:"“Annem pasta yapar, mutfak mis gibi …”", a:"kokar" } ] };

const PK_COLS = [["kırmızı",ACC.kirmizi],["mavi",ACC.mavi],["sarı",ACC.sari],["yeşil",ACC.yesil]];
const pkAlive = (st, my) => mtState === st && timerRunning && (my == null || st.round === my);
/* pkHud: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
function blnCfg(){ const t = currentCombo().t, pre = isPre(); return { N: pre ? [8, 10, 12][t] : [12, 15, 18][t], rise: (pre ? [6.5, 5.5, 4.8] : [5.2, 4.4, 3.6])[t], gap: (pre ? [1100, 1000, 900] : [900, 800, 700])[t], sw: !pre && t >= 1 }; }
function molCfg(){ const t = currentCombo().t, pre = isPre(); return { N: pre ? [10, 12, 14][t] : [14, 18, 22][t], up: (pre ? [1600, 1350, 1150] : [1150, 950, 780])[t], hat: pre && t === 0 ? 0 : 0.22 }; }
function ctcCfg(){ const t = currentCombo().t, pre = isPre(); return { N: pre ? [10, 12, 14][t] : [14, 18, 22][t], fall: (pre ? [3.4, 3.0, 2.6] : [2.8, 2.3, 1.9])[t], stone: pre ? 0.2 : 0.3, gap: (pre ? [1200, 1050, 950] : [1000, 850, 720])[t] }; }
function bagTrials(){ const t = currentCombo().t, pre = isPre(), K = pre ? [2, 3, 3][t] : [3, 4, 5][t];
return Array.from({length:4}, () => { const pool = shuffleArray(picPool()), inBag = pool.slice(0, K), out = pool.slice(K, K + 3), askIn = t === 0;
const opts = askIn ? shuffleArray([inBag[0]].concat(out.slice(0, 2))) : shuffleArray(inBag.slice(0, Math.min(K, 3)).concat([out[0]]));
return { inBag, opts, ans: askIn ? opts.indexOf(inBag[0]) : opts.indexOf(out[0]), askIn }; }); }
function smnCfg(){ const t = currentCombo().t, pre = isPre(); return { target: pre ? [3, 4, 5, 6][t] : [5, 7, 9, 11][t], ms: (pre ? [800, 700, 650, 600] : [650, 550, 450, 400])[t] }; }
/* KURAL (görsellik): renkli oyun sahnelerinde fotoğraflar beyaz kutuyla değil, zemini saydamlaştırılmış hâliyle (CUTOUT_IMAGES) gösterilir; kodla çizilen sahne nesneleri (sepet, taş, fener…) gölgeli, katmanlı çizimdir */
/* KURAL (görsellik): oyun sahnesi nesneleri kullanıcının ürettiği resimlerle (GAME_IMAGES) gösterilir; resim paketi yoksa eski çizime düşülür */
function gimg(n){ try{ return (typeof GAME_IMAGES !== "undefined" && GAME_IMAGES[n]) || null; }catch(e){ return null; } }
(function giVars(){ const set = () => { const r = document.documentElement.style; ["wagon","plank","cliff","hole"].forEach(n => { const u = gimg(n); if(u) r.setProperty("--gi-" + n, `url("${u}")`); }); document.documentElement.classList.toggle("gi-ok", !!gimg("cupDown")); }; set(); window.addEventListener("load", () => setTimeout(set, 80)); const t = setInterval(() => { if(gimg("cupDown")){ set(); clearInterval(t); } }, 120);   /* resim paketi gelir gelmez oyun görselleri devreye girsin */ setTimeout(() => clearInterval(t), 30000); })();
/* KURAL (görsellik): emoji cihazdan cihaza farklı çizildiği için uygulamada simge/uyaran olarak emoji kullanılmaz; düğme simgeleri çizgi simge, sahne nesneleri resimdir (aşağıdaki eşleme); resmi henüz olmayan sahne emojileri kullanıcıdan görsel istenene kadar geçicidir */
const EMO_SVG = (p) => `<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-0.2em">${p}</svg>`;
const EMO_MAP = { "🎉": () => EMO_SVG('<path d="M4 20l4-12 8 8-12 4Z"/><path d="M14 6l1-2M18 9l2-1M17 4l.5-.5M20 13l1 .5"/>'), "💡": () => EMO_SVG('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.2.9 2V16h5.2v-.1c0-.8.3-1.5.9-2A6 6 0 0 0 12 3Z"/>'), "⏰": () => EMO_SVG('<circle cx="12" cy="13" r="7"/><path d="M12 9.5V13l2.5 1.5M4 6l3-2.5M20 6l-3-2.5"/>'), "🎒": () => EMO_SVG('<rect x="6" y="7" width="12" height="14" rx="3"/><path d="M9 7V5a3 3 0 0 1 6 0v2M6 13h12M10 17h4"/>'), "✨": () => EMO_SVG('<path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7ZM5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8ZM18 14l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6Z"/>'), "🌿": () => EMO_SVG('<path d="M4 20C8 20 20 16 20 4 8 4 4 12 4 20Z"/><path d="M4 20c3-5 7-9 12-12"/>'), "🧸": () => EMO_SVG('<circle cx="12" cy="13" r="6"/><circle cx="6.5" cy="7" r="2.5"/><circle cx="17.5" cy="7" r="2.5"/><path d="M10 12h.01M14 12h.01M10.5 15.5c1 1 2 1 3 0"/>'), "👥": () => EMO_SVG('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5.2a3.5 3.5 0 0 1 0 5.6M17 14a6.5 6.5 0 0 1 4.5 6"/>'), "🌟": () => EMO_SVG('<path d="M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.6 6.7 19.5l1.1-6L3.4 9.3l6-.8Z"/>'), "☁": () => EMO_SVG('<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 11a3.5 3.5 0 0 0 1 7Z"/>'), "🗺": () => EMO_SVG('<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2ZM9 4v14M15 6v14"/>'), "🎯": () => EMO_SVG('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/>'), "👍": () => EMO_SVG('<path d="M7 11v9H3v-9ZM7 11l4-7a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 2 2.4l-1.4 6A2 2 0 0 1 17 20H7"/>'), "💤": () => EMO_SVG('<path d="M4 16h6l-6 5h6M12 8h5l-5 5h5M16 3h4l-4 4h4"/>'), "🔓": () => EMO_SVG('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-1.8"/>'), "📱": () => EMO_SVG('<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18h2"/>'), "🧹": () => EMO_SVG('<path d="M19 3l-8 8"/><path d="M11 11l-5 5 2 2 5-5Z"/><path d="M5 16l-1.5 4 4-1.5"/>'), "🔑": () => EMO_SVG('<circle cx="8" cy="8" r="4.5"/><path d="M11.5 11.5 21 21M18 18l2.5-2.5M15.5 15.5 18 13"/>'), "🏝": () => EMO_SVG('<path d="M3 19c3-2 6-2 9 0s6 2 9 0"/><path d="M12 16V9M12 9c-2-4-6-4-7-1 3-1 5 0 7 1Zm0 0c2-4 6-4 7-1-3-1-5 0-7 1Z"/>'), "🚀": () => EMO_SVG('<path d="M12 3c3 2 4 6 4 10l-4 3-4-3c0-4 1-8 4-10Z"/><path d="M8 13l-3 2 1 3M16 13l3 2-1 3M10 19h4"/><circle cx="12" cy="9" r="1.5"/>'), "💪": () => EMO_SVG('<path d="M4 9v6M8 7v10M16 7v10M20 9v6M8 12h8"/>'), "🧱": () => EMO_SVG('<rect x="3" y="5" width="18" height="14"/><path d="M3 12h18M8 5v7M16 5v7M12 12v7"/>'), "▶": () => EMO_SVG('<path d="M7 4l12 8-12 8Z" fill="currentColor" stroke="none"/>'), "🔁": () => EMO_SVG('<path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>'), "🚂": () => EMO_SVG('<rect x="4" y="7" width="12" height="9" rx="2"/><path d="M16 10h3l2 3v3h-5M4 20l2-4M14 20l-2-4M8 20h8"/><circle cx="7.5" cy="18.5" r="1"/><circle cx="12.5" cy="18.5" r="1"/>'), "📌": () => EMO_SVG('<path d="M12 17v4M8 17h8l-1.5-5h-5ZM9 4h6l-1 8h-4Z"/>'), "👩‍👧": () => EMO_SVG('<circle cx="9" cy="6" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17.5" cy="10" r="2.2"/><path d="M13.5 20a4 4 0 0 1 8 0"/>'),  "⏱": () => EMO_SVG('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 1.5M9.5 3h5M12 3v3"/>'), "👑": () => EMO_SVG('<path d="M4 18h16M4 18 2.5 7.5 8 11l4-6 4 6 5.5-3.5L20 18"/>'), "⌛": () => EMO_SVG('<path d="M6 3h12M6 21h12M7 3v3.5a5 5 0 0 0 2.2 4.1L12 12l2.8-1.4A5 5 0 0 0 17 6.5V3M7 21v-3.5a5 5 0 0 1 2.2-4.1L12 12l2.8 1.4A5 5 0 0 1 17 17.5V21"/>'), "💥": () => EMO_SVG('<path d="M12 3l1.8 4.6 4.5-1.9-1.9 4.5L21 12l-4.6 1.8 1.9 4.5-4.5-1.9L12 21l-1.8-4.6-4.5 1.9 1.9-4.5L3 12l4.6-1.8-1.9-4.5 4.5 1.9Z"/>'), "☝": () => EMO_SVG('<path d="M10 11V4.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-1.2a6 6 0 0 1-4.6-2.2L4.6 15.4a1.6 1.6 0 0 1 2.4-2.1L10 15V11"/>'), "🙂": () => EMO_SVG('<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9 14.5c1.5 1.5 4.5 1.5 6 0"/>'), "😀": () => EMO_SVG('<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M8.5 13.5c1 2.5 6 2.5 7 0Z"/>'), "🤩": () => EMO_SVG('<circle cx="12" cy="12" r="9"/><path d="M7.5 9.5l1-1.6 1 1.6-1 1.6ZM14.5 9.5l1-1.6 1 1.6-1 1.6ZM8.5 14c1 2.5 6 2.5 7 0Z"/>'), 
  "🔊": () => EMO_SVG('<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" fill="currentColor" stroke="none"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>'),
  "👆": () => EMO_SVG('<path d="M10 11V4.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-1.2a6 6 0 0 1-4.6-2.2L4.6 15.4a1.6 1.6 0 0 1 2.4-2.1L10 15V11"/>'),
  "❓": () => EMO_SVG('<circle cx="12" cy="12" r="9.5"/><path d="M9.3 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.7 2.4-2.7 4"/><circle cx="12" cy="17.6" r=".6" fill="currentColor"/>'),
  "👏": () => EMO_SVG('<path d="M7 13.5 4.6 11a1.4 1.4 0 0 1 2-2l3 3M9 9.5 6.6 7a1.4 1.4 0 0 1 2-2l4.8 4.8M11.3 7.6 10 6.3a1.4 1.4 0 0 1 2-2l4.6 4.6c1.6 1.6 2.1 4.6.1 6.8l-1.4 1.4a5 5 0 0 1-7.1 0L4.5 13.4"/><path d="M17.5 3.5l1-1.5M20 6l1.6-.8M15 2.8V1"/>'),
  "❌": () => EMO_SVG('<path d="M6 6l12 12M18 6 6 18" stroke-width="3" stroke="#C9353A"/>'),
  "🙈": () => EMO_SVG('<path d="M3 3l18 18"/><path d="M10.6 5.2A10 10 0 0 1 12 5c5 0 9 5 9 7a8.5 8.5 0 0 1-2.6 3.6M6.4 6.5C4.3 7.9 3 10.4 3 12c0 2 4 7 9 7a9.3 9.3 0 0 0 4.2-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>'),
  "🥁": () => gimg("drum") ? `<img src="${gimg("drum")}" alt="" style="height:1.2em;width:auto;vertical-align:-0.25em">` : null,
  "🚌": () => gimg("bus") ? `<img src="${gimg("bus")}" alt="" style="height:1.2em;width:auto;vertical-align:-0.25em">` : null,
  "🐻": () => gimg("bear") ? `<img src="${gimg("bear")}" alt="" style="height:1.4em;width:auto;vertical-align:-0.35em">` : null,
  "🐲": () => gimg("dragon") ? `<img src="${gimg("dragon")}" alt="" style="height:1.4em;width:auto;vertical-align:-0.35em">` : null
};
/* Hızlı Seç kategori etiketleri: kütüphanedeki resimler (bulunamazsa çizgi simge) */
function libImg(key){ try{ for(const n of ["HOTCOLD_IMAGES","LIVING_IMAGES","TASTE_IMAGES","PAIR_IMAGES","TOY_IMAGES","OS_IMAGES","WILD_IMAGES","HOUSE_IMAGES","VEHICLE_IMAGES","FRUIT_IMAGES","VEG_IMAGES","FLK_IMAGES","FRUIT_VEG_IMAGES"]){ const o = window[n] || (function(){ try{ return eval(n); }catch(e){ return null; } })(); if(o && o[key]) return o[key]; } }catch(e){} return null; }
const EMO_IMG = (src, h) => { if(!src) return null; try{ const c = typeof CUTOUT_BY_SRC !== "undefined" && CUTOUT_BY_SRC[srcKey(src)]; if(c) src = c; }catch(e){} return `<img src="${src}" alt="" style="height:${h || 1.3}em;width:auto;vertical-align:-0.3em">`; };
Object.assign(EMO_MAP, {
  "⏹": () => '<svg viewBox="0 0 24 24" width="0.95em" height="0.95em" style="vertical-align:-0.1em" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2.5"/></svg>', "🔊": () => '<svg viewBox="0 0 24 24" width="1.05em" height="1.05em" style="vertical-align:-0.15em" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>', "🐻": () => EMO_IMG(gimg("bear")), "🧺": () => EMO_IMG(gimg("basket")), "🏠": () => '<svg viewBox="0 0 24 24" width="1em" height="1em" style="vertical-align:-0.12em" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>', "🐾": () => '<svg viewBox="0 0 24 24" width="1em" height="1em" style="vertical-align:-0.12em" fill="currentColor"><ellipse cx="12" cy="16" rx="4.6" ry="3.8"/><circle cx="6.3" cy="10.5" r="2.1"/><circle cx="9.6" cy="6.6" r="2.1"/><circle cx="14.4" cy="6.6" r="2.1"/><circle cx="17.7" cy="10.5" r="2.1"/></svg>', "🐲": () => EMO_IMG(gimg("dragon")), "🛒": () => EMO_IMG(gimg("basket")), "👆": () => '<svg viewBox="0 0 24 24" width="1em" height="1em" style="vertical-align:-0.12em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11V5a1.5 1.5 0 0 1 3 0v5m0-1a1.5 1.5 0 0 1 3 0v1m0 0a1.5 1.5 0 0 1 3 0v4a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-3-4a1.5 1.5 0 0 1 2.3-1.9L9 14"/></svg>',   /* KURAL: ekranda emoji kalmaz — hoparlör ve parmak çizgi simge, ayı/ejderha/sepet resim */
  "🚫": () => EMO_MAP["❌"](), "❌": EMO_MAP["❌"],
  "🍎": () => EMO_IMG((typeof CUTOUT_IMAGES !== "undefined" && CUTOUT_IMAGES["f-apple"]) || libImg("apple")),
  "🥕": () => EMO_IMG(libImg("carrot")), "🔥": () => EMO_IMG(libImg("fire")), "❄️": () => EMO_IMG(libImg("snowman")), "❄": () => EMO_IMG(libImg("snowman")),
  "👕": () => EMO_IMG(libImg("tshirt")), "🌳": () => EMO_IMG(libImg("tree")), "🌱": () => EMO_IMG(libImg("sprout")), "🐦": () => EMO_IMG(libImg("parrot")), "🐾": () => EMO_IMG(libImg("dog")),
  "🏠": () => EMO_SVG('<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>'),
  "🌊": () => EMO_SVG('<path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>'),
  "🪨": () => `<span style="display:inline-block;width:1.3em;height:1.1em;vertical-align:-0.25em">${PK_STONE_SVG}</span>`,
  /* kullanıcının ürettiği sahne nesneleri */
  "📦": () => gimg("box") ? EMO_IMG(gimg("box"), 1.15) : null, "🧺": () => gimg("basket") ? EMO_IMG(gimg("basket"), 1.35) : null,
  "🗿": () => gimg("statue") ? EMO_IMG(gimg("statue"), 1.25) : null, "🔔": () => gimg("bell") ? EMO_IMG(gimg("bell"), 1.1) : null,
  /* çocuk ekranları: pusula, kilit, şimşek, büyüteç; yıldızlar uygulamanın kendi yıldızı */
  "👂": () => EMO_SVG('<path d="M7 9a5 5 0 0 1 10 0c0 3-2.5 4-3.2 6.2-.5 1.6-1.4 3.3-3.3 3.3A2.6 2.6 0 0 1 8 16"/><path d="M10 9.5a2 2 0 0 1 4 0c0 1.4-1.4 1.7-1.6 2.8"/>'),
  "🧭": () => EMO_SVG('<circle cx="12" cy="12" r="9.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" fill="currentColor" fill-opacity=".25"/>'),
  "🔒": () => EMO_SVG('<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
  "⚡": () => EMO_SVG('<path d="M13 2.5 5.5 13.5H11L10 21.5l8-11.5h-5.5L13 2.5Z" fill="currentColor" fill-opacity=".2"/>'),
  "🔎": () => EMO_SVG('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>'),
  "⭐": () => `<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" aria-hidden="true" style="vertical-align:-0.15em"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.6Z" fill="#F5B301" stroke="#C98A00" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
  "☆": () => `<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" aria-hidden="true" style="vertical-align:-0.15em"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.6Z" fill="none" stroke="#B9C3CD" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  "🎈": () => gimg("molaBalloon") ? EMO_IMG(gimg("molaBalloon"), 1.6) : null, "🤸": () => gimg("molaStretch") ? EMO_IMG(gimg("molaStretch"), 1.6) : null, "👀": () => gimg("molaSenses") ? EMO_IMG(gimg("molaSenses"), 1.3) : null,
  /* düğme ve küçük işaretler: çizgi simge */
  "🚰": () => EMO_SVG('<path d="M4 8h9a3 3 0 0 1 3 3v1"/><path d="M8 5h3M9.5 5v3"/><path d="M16 15c0 1.2-.9 2.4-1.5 3-.6-.6-1.5-1.8-1.5-3s1.5-3 1.5-3 1.5 1.8 1.5 3Z"/>'),
  "🪣": () => EMO_SVG('<path d="M5 8h14l-1.6 11a1.5 1.5 0 0 1-1.5 1.3H8.1a1.5 1.5 0 0 1-1.5-1.3L5 8Z"/><path d="M5 8a7 7 0 0 1 14 0"/>'),
  "👊": () => EMO_SVG('<path d="M7 11V8.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V10m0-.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6v-1.5a1.5 1.5 0 0 1 3 0"/>'),
  "🛒": () => EMO_SVG('<path d="M3 4h2.5l2.2 10.5h10l2-7.5H6.4"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>'),
  "🏁": () => EMO_SVG('<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5" fill="currentColor" fill-opacity=".15"/><path d="M9 4v8M13 4v8M5 8h12"/>')
});
/* EMO_RE: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
function svgStarFix(root){ try{ root.querySelectorAll("svg text").forEach(t => { const v = (t.textContent || "").replace(/\uFE0F/g, "").trim(); if(v !== "⭐") return; const fs = parseFloat(t.getAttribute("font-size")) || 16, x = parseFloat(t.getAttribute("x")) || 0, y = parseFloat(t.getAttribute("y")) || 0, r = fs * 0.5, cy = y - fs * 0.36; const pts = []; for(let k = 0; k < 10; k++){ const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.45 : r; pts.push((x + Math.cos(a) * rr).toFixed(1) + "," + (cy + Math.sin(a) * rr).toFixed(1)); } const pg = document.createElementNS("http://www.w3.org/2000/svg", "polygon"); pg.setAttribute("points", pts.join(" ")); pg.setAttribute("fill", "#F5B301"); pg.setAttribute("stroke", "#C98A00"); pg.setAttribute("stroke-width", Math.max(1, fs * 0.05)); pg.setAttribute("stroke-linejoin", "round"); pg.setAttribute("pointer-events", "none"); if(t.id) pg.id = t.id; t.parentNode.replaceChild(pg, t); }); }catch(e){} }   /* SVG içindeki yıldız emojisi → uygulamanın yıldızı (labirent, hayvanat bahçesi, bul ve kaç) */
/* KURAL (emoji, 2026-11-04): oyun ve etkileşimli tahtalar çizilir çizilmez emoji düzeltmesi tahtada hemen çalışır — Yirmi Soru'nun "Soru +1" düğmesinde ❓ bir an renkli emoji olarak görünüyordu */

function emoRe(){ const n = Object.keys(EMO_MAP).length; if(!emoRe.r || emoRe.n !== n){ emoRe.n = n; emoRe.r = new RegExp("(" + Object.keys(EMO_MAP).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")(\uFE0F)?", "u"); } return emoRe.r; }   /* sonradan eklenen emoji karşılıkları da tanınır */
/* KURAL: ekranda emoji görünmez — eşlemesi olmayan renkli emoji (kutlama, ampul vb.) yazıdan silinir; düğmelerdeki metin simgeleri (✕ ★ ☆ ⌫ ✓ ✗) silinmez */
function emojiStrip(root){ try{ const re = /(?:\p{Emoji_Presentation}|[\u2744\u2601]\uFE0F?|\p{Extended_Pictographic}\uFE0F)(?:\u200D(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F?))*/gu;   /* KURAL: yalnız renkli emoji olarak çizilen karakterler silinir; metin simgeleri (✕ kapat, ★ ☆ yıldız, ⌫ sil, ✓ ✗, ❄ ☁) korunur */ const w = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT); const list = []; let n; while((n = w.nextNode())){ if(n.parentElement && /^(INPUT|TEXTAREA|SCRIPT|STYLE)$/.test(n.parentElement.tagName)) continue; if(re.test(n.nodeValue)){ re.lastIndex = 0; list.push(n); } re.lastIndex = 0; } list.forEach(t => { t.nodeValue = t.nodeValue.replace(re, "").replace(/ {2,}/g, " "); }); }catch(e){} }
function emojiFix(root){ try{ if(!root) return; svgStarFix(root); const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.nodeValue && emoRe().test(n.nodeValue) && n.parentNode && !(n.parentNode.namespaceURI || "").includes("svg") && !/^(TEXTAREA|SCRIPT|STYLE|INPUT|OPTION)$/.test(n.parentNode.nodeName)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT }); const list = []; while(w.nextNode()) list.push(w.currentNode);
  list.forEach(n => { const parts = n.nodeValue.split(emoRe()).filter(x => x !== undefined && x !== "\uFE0F"); if(parts.length < 2) return; const frag = document.createDocumentFragment(); let changed = false; parts.forEach(pt => { if(EMO_MAP[pt]){ const h = EMO_MAP[pt](); if(h){ const sp = document.createElement("span"); sp.className = "emo-ic"; sp.innerHTML = h; frag.appendChild(sp); changed = true; return; } } if(pt) frag.appendChild(document.createTextNode(pt)); }); if(changed) n.parentNode.replaceChild(frag, n); }); }catch(e){} }
(function emojiWatch(){ const start = () => { let q = false; const run = () => { q = false; emojiFix(document.body); emojiStrip(document.body);   /* KURAL: emoji düzeltmesi bütün sayfada çalışır (düğmeler ve tahta dışı alanlar dahil) */ document.querySelectorAll(".say-toast, #sayToast, .ch-key").forEach(emojiFix); }; new MutationObserver(() => { if(!q){ q = true; requestAnimationFrame(run); } }).observe(document.body, { childList: true, subtree: true, characterData: true }); run(); }; if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start(); })();
/* saydam hâl yalnızca renkli zeminde kullanılır; beyaz kartta özgün (kenar boşluklu, daha keskin) resim kalır */
function onColored(im){ try{ let e = im.parentElement; for(let i = 0; i < 6 && e && e.id !== "board"; i++){ const cs = getComputedStyle(e); if(cs.backgroundImage && cs.backgroundImage !== "none" && !/url/.test(cs.backgroundImage)) return true; const m = (cs.backgroundColor || "").match(/[\d.]+/g); if(m && m.length >= 3 && (m.length < 4 || +m[3] > 0)){ return (+m[0] < 240 || +m[1] < 240 || +m[2] < 240); } e = e.parentElement; } return false; }catch(e){ return true; } }
function srcKey(s){ return s.length + ":" + s.slice(40, 72) + s.slice(-24); }
/* tahtaya gelen her resim, saydam hâli varsa onunla değiştirilir (renkli sahnede beyaz kutu kalmaz; beyaz zeminde görünüm aynıdır) */
(function cutoutSwap(){ try{ const run = (root) => { if(typeof CUTOUT_BY_SRC === "undefined") return; root.querySelectorAll("img").forEach(im => { if(im.dataset.cut) return; const s = im.getAttribute("src") || ""; if(s.slice(0, 11) !== "data:image/") return; const c = CUTOUT_BY_SRC[srcKey(s)]; if(!c){ im.dataset.cut = "1"; return; } if(onColored(im)){ im.dataset.cut = "1"; im.src = c; } else { const n = +(im.dataset.cutTry || 0); if(n >= 3) im.dataset.cut = "1"; else { im.dataset.cutTry = n + 1; setTimeout(() => run(root), 120); } }   /* zemin rengi sonradan verilebilir: birkaç kez yeniden bakılır */ }); };
  const start = () => { const b = document.getElementById("board"); if(!b){ setTimeout(start, 400); return; } new MutationObserver(() => run(b)).observe(b, { childList: true, subtree: true }); run(b); };
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start(); }catch(e){} })();
function cutoutSrc(item){ try{ return (typeof CUTOUT_IMAGES !== "undefined" && item && CUTOUT_IMAGES[item.k]) || (item && item.src) || ""; }catch(e){ return item && item.src || ""; } }
const PK_STONE_SVG = `<svg viewBox="0 0 60 50" width="100%" height="100%" aria-hidden="true"><defs><radialGradient id="pkSt" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#C9CED6"/><stop offset=".55" stop-color="#8A929D"/><stop offset="1" stop-color="#5A626C"/></radialGradient></defs><ellipse cx="31" cy="46" rx="22" ry="3.5" fill="#000" opacity=".15"/><path d="M8 30 Q6 14 22 9 Q36 4 48 12 Q57 20 53 33 Q49 44 33 45 Q14 46 8 30 Z" fill="url(#pkSt)" stroke="#4A525C" stroke-width="1.5"/><path d="M18 16 Q24 12 31 13" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" opacity=".55" fill="none"/><path d="M36 30 l5 3 M24 35 l4 -2" stroke="#5A626C" stroke-width="1.4" stroke-linecap="round" opacity=".6"/></svg>`;
const PK_BASKET_SVG = `<svg viewBox="0 0 120 70" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="pkBk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2A35C"/><stop offset=".6" stop-color="#C47F3A"/><stop offset="1" stop-color="#9A5F26"/></linearGradient><pattern id="pkWv" width="12" height="10" patternUnits="userSpaceOnUse"><path d="M0 5 Q3 0 6 5 T12 5" stroke="#8A531F" stroke-width="1.6" fill="none" opacity=".55"/><path d="M6 0 V10" stroke="#8A531F" stroke-width="1" opacity=".35"/></pattern></defs><path d="M6 14 H114 L104 62 Q102 68 94 68 H26 Q18 68 16 62 Z" fill="url(#pkBk)" stroke="#6E4116" stroke-width="2.4" stroke-linejoin="round"/><path d="M8 16 H112 L103 61 Q101 66 94 66 H26 Q19 66 17 61 Z" fill="url(#pkWv)"/><rect x="2" y="8" width="116" height="10" rx="5" fill="#B87434" stroke="#6E4116" stroke-width="2.4"/><path d="M10 11 H110" stroke="#F0C487" stroke-width="2" stroke-linecap="round" opacity=".7"/></svg>`;
/* KURAL (görsel düzen): konum hatırlama sahnelerinde yerler rastgele saçılmaz; önceden tasarlanmış dengeli şablonlardan seçilir (tam simetrik/sıralı değil — konumlar sözel kodlanmasın), her açılışta ayna/hafif kaydırma ile değişir */
const LH_LAYOUTS = { 4: [[[22,30],[70,24],[34,72],[78,66]],[[20,52],[52,22],[82,48],[50,78]]], 5: [[[18,28],[56,20],[84,44],[30,70],[68,76]],[[24,22],[74,30],[50,50],[18,74],[80,76]]], 6: [[[16,26],[50,18],[84,30],[28,62],[66,56],[50,84]],[[20,20],[62,26],[86,56],[14,58],[46,54],[70,84]]], 7: [[[14,24],[44,16],[78,22],[28,52],[62,48],[86,66],[44,82]],[[18,18],[56,22],[86,32],[14,56],[48,52],[76,72],[30,84]]], 8: [[[14,22],[42,14],[72,20],[88,46],[26,48],[58,46],[18,80],[64,80]],[[16,16],[50,20],[84,18],[30,46],[68,44],[12,72],[46,80],[84,74]]], 9: [[[12,20],[40,14],[70,18],[90,40],[24,46],[54,44],[80,66],[14,78],[48,82]],[[14,14],[46,18],[80,14],[28,40],[64,42],[90,56],[12,66],[44,74],[76,86]]] };
function lhCfg(){ const t = currentCombo().t, pre = isPre(); const K = pre ? [4, 4, 4, 5][t] : [6, 7, 8, 9][t]; const L = LH_LAYOUTS[K] || LH_LAYOUTS[6], tpl = L[Math.floor(Math.random() * L.length)], mx = Math.random() < 0.5, my = Math.random() < 0.3; const pts = tpl.map(([x, y]) => { x = mx ? 100 - x : x; y = my ? 104 - y : y; return [Math.max(10, Math.min(90, x + (Math.random() * 4 - 2))), Math.max(16, Math.min(86, y + (Math.random() * 4 - 2)))]; });
return { pts, target: pre ? [3, 4, 5, 6][t] : [4, 6, 8, 10][t], ms: (pre ? [900, 800, 700, 650] : [750, 650, 550, 480])[t] }; }
/* KURAL (SVG): sayfada tekrar eden çizimlerde degrade/desen kimlikleri her kopyada benzersizdir; aksi hâlde gizli kopyadaki kimliğe bağlanıp dolgu boş görünür */
const LH_SVG = (on, k = 0) => { const u = gimg(on ? "lhOn" : "lhOff"); return u ? `<img src="${u}" alt="" style="width:100%;height:100%;object-fit:contain;object-position:bottom;pointer-events:none${on ? ";filter:drop-shadow(0 0 10px rgba(255,214,70,.95)) drop-shadow(0 0 22px rgba(255,214,70,.7))" : ""}">` : LH_SVG_DRAW(on, k); };   /* deniz feneri görselleri gelince gerçek fener */
const LH_SVG_DRAW = (on, k = 0) => `<svg viewBox="0 0 60 90" width="100%" height="100%" aria-hidden="true"><defs><linearGradient id="lhT${k}_${on ? 1 : 0}" x1="0" x2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".65" stop-color="#F1F4F8"/><stop offset="1" stop-color="#C9D2DC"/></linearGradient><linearGradient id="lhR${k}_${on ? 1 : 0}" x1="0" x2="1"><stop offset="0" stop-color="#E5484D"/><stop offset=".7" stop-color="#C9353A"/><stop offset="1" stop-color="#A72A2E"/></linearGradient><radialGradient id="lhG${k}"><stop offset="0" stop-color="#FFF6B8" stop-opacity=".95"/><stop offset=".45" stop-color="#FFE27A" stop-opacity=".55"/><stop offset="1" stop-color="#FFE27A" stop-opacity="0"/></radialGradient></defs>${on ? `<circle cx="30" cy="22" r="22" fill="url(#lhG${k})"/><path d="M36 20 L60 12 L60 30 Z M24 20 L0 12 L0 30 Z" fill="#FFE98F" opacity=".7"/>` : ""}<ellipse cx="30" cy="86" rx="20" ry="4" fill="#1D4E7A" opacity=".35"/><path d="M14 86 Q30 78 46 86 Z" fill="#6F7B88"/><path d="M21 82 L24 36 H36 L39 82 Z" fill="url(#lhT${k}_${on ? 1 : 0})" stroke="#2B3A4A" stroke-width="1.6" stroke-linejoin="round"/><path d="M23 70.5 L37 70.5 L37.6 78 L22.4 78 Z M23.8 55 L36.2 55 L36.7 62 L23.3 62 Z M24.5 41 L35.5 41 L35.9 47 L24.1 47 Z" fill="url(#lhR${k}_${on ? 1 : 0})"/><rect x="20" y="32" width="20" height="4" rx="1.5" fill="#2B3A4A"/><rect x="23" y="20" width="14" height="12" rx="2" fill="${on ? "#FFE27A" : "#BFD3E6"}" stroke="#2B3A4A" stroke-width="1.6"/><path d="M30 20 V32" stroke="#2B3A4A" stroke-width="1"/><path d="M21 20.5 Q30 9 39 20.5 Z" fill="url(#lhR${k}_${on ? 1 : 0})" stroke="#2B3A4A" stroke-width="1.6" stroke-linejoin="round"/><circle cx="30" cy="10" r="1.8" fill="#2B3A4A"/></svg>`;

const KA_CATS = { hayvan:"hayvan", meyve:"meyve", "taşıt":"taşıt", giysi:"giysi", mutfak:"mutfak eşyası", sebze:"sebze" };
function kaCfg(){ const t = currentCombo().t, pre = isPre(); return { N: pre ? [6, 8, 10][t] : [10, 12, 15][t], cross: (pre ? [7, 6, 5.2] : [6, 5, 4.2])[t], gap: (pre ? [1300, 1150, 1000] : [1100, 950, 820])[t], sw: !pre && t === 2 }; }
function kaPools(){ if(isPre()){ const C = qzCats(), ta = ["dog","cat","cow","rabbit","elephant","parrot"].map(k => ({ src: TA_ANIMALS[k]() }));
return { hayvan: ta.concat(C.wild.items), meyve: C.meyve.items, "taşıt": C.vehicle.items, oyuncak: C.toy.items }; }
return { hayvan: GS_BANK.hayvan, meyve: GS_BANK.meyve, "taşıt": GS_BANK["taşıt"], giysi: GS_BANK.giysi, mutfak: GS_BANK.mutfak, sebze: GS_BANK.sebze }; }
function ubTrials(){ const t = currentCombo().t, N = [5, 6, 8][t], nF = [3, 3, 4][t], yes = shuffleArray(RHYME_PAIRS.yes.slice()), out = [];
const others = Array.from(new Set(RHYME_PAIRS.no.map(x => x[1]).concat(RHYME_PAIRS.yes.map(x => x[0]))));
for(let i = 0; i < N; i++){ const [w, r] = yes[i % yes.length], wr = shuffleArray(others.filter(x => x !== w && x !== r && x.slice(-2) !== w.slice(-2))).slice(0, nF - 1);
const fish = shuffleArray([r].concat(wr)); out.push({ w, fish, ans: fish.indexOf(r), dur: [9, 8, 7][t] }); }
return out; }
function htTrials(){ const t = currentCombo().t, pool = snPicPool().filter(x => { const n = trSylSplit(x.n).length; return n >= 2 && n <= [2, 3, 4][t]; });
return shuffleArray(pool).slice(0, 5).map(x => { const sy = trSylSplit(x.n), extra = t === 2 ? [randomItem(["ka","lo","mi","te","bu","sa"].filter(z => !sy.includes(z)))] : [];
return { pic: x, sy, cars: shuffleArray(sy.map((s, i) => ({ s, i })).concat(extra.map(s => ({ s, i:-1 })))) }; }); }
function slCfg(){ const t = currentCombo().t, pre = isPre(), R = pre ? [2, 2, 3][t] : 3, C = pre ? [2, 3, 3][t] : 3, mv = pre ? [6, 10, 14][t] : [12, 24, 40][t];
const n = R * C, b = []; let tiles = Array.from({length:n}, (_, i) => i), blank = n - 1, last = -1;
for(let k = 0; k < mv; k++){ const r = Math.floor(blank / C), c = blank % C, nb = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([y, x]) => y >= 0 && y < R && x >= 0 && x < C).map(([y, x]) => y * C + x).filter(x => x !== last);
const s = randomItem(nb); [tiles[blank], tiles[s]] = [tiles[s], tiles[blank]]; last = blank; blank = s; }
if(tiles.every((v, i) => v === i)){ const s = blank - 1 >= 0 && (blank % C) > 0 ? blank - 1 : blank + 1; [tiles[blank], tiles[s]] = [tiles[s], tiles[blank]]; blank = s; }
return { R, C, tiles, blank, par: mv, limit: mv * 3 + 6, img: randomItem([SCENE_IMAGES.room_pz || SCENE_IMAGES.room, SCENE_IMAGES.kitchen_pz || SCENE_IMAGES.kitchen, SCENE_IMAGES.park_pz || SCENE_IMAGES.park, SCENE_IMAGES.class_pz || SCENE_IMAGES.class].filter(Boolean))   /* KURAL: kaydırmalı bulmacada resim tahtanın 4:3 oranına kırpılmış hâliyle kullanılır (basık/uzamış olmaz) */ }; }
function kkTrials(){ const t = currentCombo().t, pre = isPre(), two = !pre && t === 2;
return Array.from({length:5}, () => { const gap = pre ? [2, 2, 3][Math.min(t, 2)] + Math.floor(Math.random() * [2, 3, 3][Math.min(t, 2)]) : 3 + Math.floor(Math.random() * (t === 0 ? 3 : 5));   /* KURAL: Köprü okul öncesinde de düzeyle zorlaşır (boşluk 2–3 → 2–4 → 3–5) */
if(two){ for(let g = 0; g < 200; g++){ const a = 1 + Math.floor(Math.random() * (gap - 1)), b = gap - a, d1 = 1 + Math.floor(Math.random() * 6), d2 = 1 + Math.floor(Math.random() * 6); if(d1 === d2 || [a, b].includes(d1) || [a, b].includes(d2)) continue;   /* çeldiriciler birbirinden ve doğru tahtalardan farklı */ const opts = shuffleArray([a, b, d1, d2]);
let pairs = 0; for(let i = 0; i < 4; i++) for(let j = i + 1; j < 4; j++) if(opts[i] + opts[j] === gap) pairs++; if(pairs === 1) return { gap, opts, two }; } }
let opts = shuffleArray(Array.from(new Set([gap, gap - 1, gap + 1, gap + 2].filter(x => x >= 1)))).slice(0, pre ? 3 : 4); if(!opts.includes(gap)) opts[0] = gap; return { gap, opts, two:false }; }); }
/* KURAL (resim havuzları, 2026-11-04): birleştirilen resim havuzlarında aynı resim iki kez bulunmaz — Değerlendirme turunun geniş havuzu vahşi hayvanları zaten içerdiği için gölge sorusunda aynı gölge iki seçenekte çıkıyordu; havuzlar resim kimliğine (k) ve kaynağına göre tekilleştirilir */
function picUniq(arr){ const seen = new Set(); return (arr || []).filter(x => { if(!x) return false; const k = x.k || "", s = (typeof srcKey === "function" && x.src) ? srcKey(x.src) : (x.src || ""); if((k && seen.has("k:" + k)) || (s && seen.has("s:" + s))) return false; if(k) seen.add("k:" + k); if(s) seen.add("s:" + s); return true; }); }
/* KURAL (gölge eşleme): gölge, resmin saydam (zemini silinmiş) hâlinden yapılır; saydam hâli olmayan resim gölge sorusunda kullanılmaz (aksi hâlde kare siyah leke çıkar) */
function geCut(x){ try{ return (typeof CUTOUT_BY_SRC !== "undefined" && CUTOUT_BY_SRC[srcKey(x.src)]) || null; }catch(e){ return null; } }
(function silFilterDefs(){ try{ /* stil: zihin-stil.css */ const add = () => { if(document.getElementById("zSilDefs")) return; const d = document.createElement("div"); d.id = "zSilDefs"; d.setAttribute("aria-hidden", "true"); d.style.cssText = "position:absolute;width:0;height:0;overflow:hidden"; d.innerHTML = '<svg width="0" height="0"><filter id="zSil" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -5 -5 -5 0 12.4"/><feMorphology operator="dilate" radius="1.5"/><feMorphology operator="erode" radius="1.5"/></filter><filter id="zSilCut" color-interpolation-filters="sRGB" x="-5%" y="-5%" width="110%" height="110%"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 4 -1.6"/><feMorphology operator="dilate" radius="1.5"/><feMorphology operator="erode" radius="1.5"/></filter></svg>'; document.body.appendChild(d); }; if(document.body) add(); else document.addEventListener("DOMContentLoaded", add); }catch(e){} })();
function geTrials(){ const t = currentCombo().t, pre = isPre(), N = pre ? 5 : 6, pool0 = picUniq(picPool().concat(qzCats().wild.items)), pool1 = pool0.filter(x => geCut(x)), pool = pool1.length >= 8 ? pool1 : pool0;
return Array.from({length:N}, () => { const [a, ...rest] = shuffleArray(pool).slice(0, pre ? 3 : 4), rot = t === 2 ? randomItem([90, 180, -90]) : 0, flip = t >= 1 && Math.random() < 0.5;
const sil = (x, r, f) => { const c = geCut(x); return `<div class="ge-sil${c ? " cut" : ""}" style="width:100%;height:100%;transform:rotate(${r}deg)${f ? " scaleX(-1)" : ""}">${qzPic(c || x.src)}</div>`; };   /* saydam hâli yoksa beyaz zemini saydamlaştıran süzgeçle gölge yapılır */
const opts = [sil(a, rot, flip)].concat(rest.map(x => sil(x, t === 2 ? randomItem([0, 90, 180]) : 0, false)));
return qzMake(`<div style="width:120px;height:120px;margin:0 auto">${qzPic(a.src)}</div>`, opts, 0, { prompt: t === 2 ? "Hangi gölge onun? (Gölge dönmüş olabilir)" : "Hangi <b>gölge</b> onun?", raw:true, fixed:true, cell:100 }); }); }
function bkCfg(){ const t = currentCombo().t, pre = isPre(), n = pre ? [4, 5, 5][t] : [5, 6, 7][t], clouds = pre ? [1, 1, 2][t] : [1, 2, 3][t], ms = (pre ? [1300, 1100, 950] : [1000, 850, 700])[t];
return { n, walls: escBraid(mazeGen(n), n), clouds, ms }; }
/* KURAL (Kaçış): labirentte birkaç ek geçit (döngü) açılır — bulut tek yolu kapatıp oyunu bitirilemez yapmasın. Gerçek hızda 200'er oyunluk benzetimde bütün düzeylerde 10 dakikada bitmeyen oyun 0 */
function escBraid(W, n){ try{ let k = n, g = 0; while(k > 0 && g++ < 500){ const i = Math.floor(Math.random() * n * n), d = []; if(i % n < n - 1 && W[i].e) d.push("e"); if(i + n < n * n && W[i].s) d.push("s"); if(!d.length) continue; const x = d[Math.floor(Math.random() * d.length)]; if(x === "e"){ W[i].e = 0; W[i + 1].w = 0; } else { W[i].s = 0; W[i + n].n = 0; } k--; } }catch(e){} return W; }

function rlCfg(){ const t = currentCombo().t, pre = isPre(); return { grace: (pre ? [1000, 850, 700] : [800, 650, 500])[t], green: pre ? [1600, 3200] : [900, 2600], red: [1200, 2000], speed: (pre ? [16, 14, 12] : [13, 11, 10])[t] }; }
function wtTrials(){ const t = currentCombo().t, pre = isPre(), kinds = pre ? [1, 2, 2][t] : [2, 3, 3][t], hide = !pre && t >= 1 || pre && t === 2;
const fr = shuffleArray(qzCats().meyve.items.slice()).slice(0, 4);
return Array.from({length:4}, () => { const pick = shuffleArray(fr.slice()).slice(0, kinds), order = pick.map(x => ({ x, n: 1 + Math.floor(Math.random() * (pre ? 2 : 3)) }));
return { order, shelf: fr, hide, ms: (pre ? 4500 : [4500, 3800, 3200][t]) }; }); }
function drCfg(){ const t = currentCombo().t, pre = isPre(); return { beat: (pre ? [900, 820, 750] : [700, 620, 560])[t], win: (pre ? [320, 280, 240] : [260, 220, 180])[t], demo: 4, taps: 12 }; }
const COOP_IDS = ["pk-mole","pk-simon","pk-slide","pk-redlight","pk-drum"];
function coopScore(st){ if(st.kind === "slide") return { v: st.moves, unit:"hamle", low:true }; if(st.kind === "rl") return { v: st.caught, unit:"yakalanma", low:true }; return { v: st.score || 0, unit:"puan", low:false }; }
function coopAfter(st, errors){ const c = gameStop.coop, sc = coopScore(st); c.res.push(Object.assign({ errors }, sc));
let el = document.getElementById("coopSheet"); if(!el){ el = document.createElement("div"); el.id = "coopSheet"; document.body.appendChild(el); }
const me = (currentPlayerName || "").trim() || "1. oyuncu", fr = "Arkadaşın";
if(c.res.length === 1){ el.innerHTML = `<div class="mola-card"><div style="font-size:54px">👥</div><div class="mola-h">Sıra ${fr.toLocaleLowerCase("tr")}da!</div><div class="mola-s">${me}: <b>${sc.v} ${sc.unit}</b></div><div class="mola-list"><button type="button" data-coop-go="1"><span>▶️</span>Başla</button></div></div>`;
el.style.display = "flex"; speakText("Sıra arkadaşında!"); el.querySelector("[data-coop-go]").onclick = () => { el.style.display = "none"; startGameStop(gameStop.exId, gameStop.islandId, { coop: c }); }; return; }
const [a, b] = c.res, sum = a.low ? null : a.v + b.v, g = gxGet(); g.light = (g.light || 0) + 1; gxSave(g);
el.innerHTML = `<div class="mola-card"><div style="width:84px;height:84px;margin:0 auto">${zihniSVG("happy")}</div><div class="mola-h">${sum != null ? `Birlikte ${sum} puan!` : "Harika takım!"}</div>
<div class="coop-row"><div><b>${me}</b><span>${a.v} ${a.unit}</span></div><div><b>${fr}</b><span>${b.v} ${b.unit}</span></div></div><div class="mola-s">+1 ışık · birlikte oyun</div>
<div class="mola-list"><button type="button" data-coop="again"><span>🔁</span>Yeniden</button><button type="button" data-coop="map"><span>🗺️</span>Haritaya dön</button></div></div>`;
el.style.display = "flex"; speakText(sum != null ? `Birlikte ${sum} puan topladınız!` : "Harika takım!");
el.querySelectorAll("[data-coop]").forEach(btn => btn.onclick = () => { el.style.display = "none"; if(btn.dataset.coop === "again") startGameStop(gameStop.exId, gameStop.islandId, { coop: { res:[] } }); else { exitGameMode(); showIslandMap(); } }); }


const ADV = [
{ nm:"Gece Kumsalı", g:[79,37], tx:"Bir fırtına gecesi deniz fenerinin ışığı söndü! Işığın parçaları dört bir yana dağıldı. Zihni ilk parçayı kumsalda arıyor.", c:["pk-catch","pk-light","dot-count","pk-balloon"] },
{ nm:"Orman Yolu", g:[13,32], tx:"Zihni ormana geldi. Ağaçların arasında bir şey parlıyor. Önce iki görevi tamamla!", c:["clutter-find","pk-word","search-object","pk-mole"] },
{ nm:"Kırık Köprü", g:[86,30], tx:"Nehrin üstündeki köprü kırılmış! Zihni karşıya geçmenin yolunu arıyor.", c:["pk-bridge","sort-pic","pk-rhyme","cause-effect"] },
{ nm:"Mağara", g:[90,33], tx:"Karanlık bir mağaranın önündesin. İçeriden küçük bir ışık parlıyor.", c:["maze","pk-escape","route-mem","pos-nback"] },
{ nm:"Çiçek Vadisi", g:[89,51], tx:"Rengârenk çiçeklerin arasında bir parça saklanıyor. Dikkatli bak!", c:["color-obj","pk-balloon","same-sound","pk-shadow"] },
{ nm:"Bulutların Üstü", g:[83,32], tx:"Zihni dağın tepesine tırmandı. Bulutların arasında bir parça parlıyor!", c:["balance","matrix-fill","mental-rot","num-pattern"] },
{ nm:"Eski Kule", g:[69,18], tx:"Taş kulenin penceresinde son parça parlıyor. Az kaldı!", c:["pk-slide","block-design","sudoku","clue-find"] },
{ nm:"Fener Yeniden Yanıyor", g:[73,10], tx:"Bütün parçalar toplandı! Son iki görevi tamamla ve feneri yeniden yak.", c:["pk-simon","pic-arrange","pk-waiter","pk-bag"], final:true } ];
function advState(){ const g = gxGet(); g.adv = g.adv || { ch:0, done:{}, frag:[], lit:false }; return g; }
function advTasks(k){ const lvl = isPre() ? "pre" : "post"; return ADV[k].c.filter(id => { const ex = exerciseById(id); return ex && ex.readingLevel.includes(lvl) && CATEGORIES.some(c => c.exerciseIds.includes(id)); }).slice(0, 2); }
function advTaskDone(exId){ const g = advState(), k = g.adv.ch; if(!advTasks(k).includes(exId)) return; g.adv.done[k] = Array.from(new Set((g.adv.done[k] || []).concat([exId]))); gxSave(g); }
let advView = null;
function showAdventure(k){ const g = advState(); const A = g.adv; if(k == null) k = A.ch; advView = k; hideGameScreens(); exitGameMode();
let el = document.getElementById("advScreen"); if(!el){ el = document.createElement("div"); el.id = "advScreen"; document.body.appendChild(el); }
const ch = ADV[k], tasks = advTasks(k), done = (A.done[k] || []), allDone = tasks.every(id => done.includes(id)), got = A.frag.includes(k), cur = k === A.ch;
const canFind = cur && allDone && !got && !ch.final, canLight = cur && allDone && ch.final && !A.lit;
const frags = `<div class="adv-frags">${ADV.slice(0, 7).map((_, i) => `<span class="adv-f${A.frag.includes(i) ? " on" : ""}"></span>`).join("")}</div>`;
el.innerHTML = `<div class="adv-wrap"><div class="adv-top"><button type="button" class="mola-x" data-adv="close">✕</button><div><div class="adv-t1">Macera · Bölüm ${k + 1}/8</div><div class="adv-t2">${ch.nm}</div></div>${frags}</div>
<div class="adv-scene${ch.final && !A.lit ? " dark" : ""}"><img src="${ADV_IMAGES[k]}" alt="">${canFind || canLight ? `<button type="button" class="adv-glow" data-adv="${canLight ? "light" : "frag"}" style="left:${ch.g[0]}%;top:${ch.g[1]}%" aria-label="Parça"></button>` : ""}<div class="adv-zihni">${zihniSVG(allDone ? "cheer" : "point")}</div></div>
<div class="adv-tx">${got ? "Bu bölümün parçasını buldun! ✨" : ch.final && A.lit ? "Fener yeniden yanıyor! Adalar artık güvende. Harika bir macera oldu! 🎉" : canFind ? "Görevler tamam! Şimdi sahnedeki <b>parlayan parçayı bul ve dokun</b>." : canLight ? "Görevler tamam! <b>Fenere dokun</b> ve ışığı yak." : ch.tx}</div>
<div class="adv-tasks">${tasks.map(id => { const ex = exerciseById(id), ok = done.includes(id); return `<div class="adv-task${ok ? " ok" : ""}"><span>${ok ? "✓" : "★"}</span><b>${gameChildLabel(ex)}</b>${cur && !ok ? `<button type="button" class="isl-play" data-adv-play="${id}">Oyna</button>` : ok ? `<em>tamam</em>` : ""}</div>`; }).join("")}</div>
<div class="adv-nav">${k > 0 ? `<button type="button" class="wm-btn diff" data-adv="prev">◀ Önceki</button>` : "<span></span>"}${k < A.ch ? `<button type="button" class="wm-btn diff" data-adv="next">Sonraki ▶</button>` : got && k < 7 ? `<button type="button" class="wm-btn same" data-adv="go">Sonraki bölüm ▶</button>` : "<span></span>"}</div></div>`;
el.style.display = "flex"; el.scrollTop = 0;
if(!got && !(ch.final && A.lit)) setTimeout(() => speakText(canFind ? "Görevler tamam! Parlayan parçayı bul ve dokun." : canLight ? "Fenere dokun ve ışığı yak!" : ch.tx), 250);
el.querySelectorAll("[data-adv]").forEach(b => b.onclick = () => { const a = b.dataset.adv;
if(a === "close"){ el.style.display = "none"; showIslandMap(); }
else if(a === "prev") showAdventure(k - 1); else if(a === "next") showAdventure(k + 1);
else if(a === "go"){ showAdventure(advState().adv.ch); }
else if(a === "frag"){ const g2 = advState(); g2.adv.frag.push(k); g2.adv.ch = Math.min(7, k + 1); g2.light = (g2.light || 0) + 3; gxSave(g2); gameSfx("correct"); b.classList.add("got"); speakText("Bir parça buldun! Üç ışık kazandın."); setTimeout(() => showAdventure(k), 900); }
else if(a === "light"){ const g2 = advState(); g2.adv.lit = true; g2.light = (g2.light || 0) + 10; gxSave(g2); gameSfx("correct"); speakText("Fener yeniden yanıyor! On ışık kazandın!"); showAdventure(k); } });
el.querySelectorAll("[data-adv-play]").forEach(b => b.onclick = () => { el.style.display = "none"; startGameStop(b.dataset.advPlay, "macera"); }); }

const PLACE_KEY = "wm_place_v2", PLACE_REDO_DAYS = 42;
/* Değerlendirme turu: her kategori ayrı alan; her alanda 6 basamaklı tek merdiven
   (Okul Öncesi Başlangıç/Orta/Zor → Okul Sonrası Başlangıç/Orta/Zor). Düzey yaşa göre değil, alanda yapabildiğine göre belirlenir;
   yaş yalnızca başlangıç basamağını seçer. */
const PLACE_DOMS = [
{ k:"hiz",     nm:"İşlemleme hızı",       cats:["islemleme-hizi","oyun-parki"], kind:"qz", q:"sem-decide", lim:[6000, 4500], q2:"pk-shadow", lim2:[9000, 7000] },
{ k:"goz",     nm:"Göz takip",            cats:["goz-takip"],            kind:"cups" },
{ k:"dikkat",  nm:"Yürütücü işlev",       cats:["yurutucu-islev"],       kind:"qz", q:"arrow-touch", lim:[6000, 4500] },
{ k:"calisan", nm:"Çalışan bellek",       cats:["calisan-bellek"],       kind:"span" },
{ k:"sozelb",  nm:"Sözel bellek",         cats:["sozel-bellek"],         kind:"listen" },
{ k:"resim",   nm:"Görsel bellek",        cats:["gorsel-bellek"],        kind:"vis" },
{ k:"sozelo",  nm:"Sözel organizasyon",   cats:["sozel-organizasyon"],   kind:"qz", q:"odd-touch", q2:"analogy-touch" },
{ k:"dil",     nm:"Sözel kavrama",        cats:["sozel-kavrama"],        kind:"qz", q:"word-pic", q2:"concept-touch" },
{ k:"gorsel",  nm:"Görsel organizasyon",  cats:["gorsel-organizasyon"],  kind:"qz", q:"mental-rot", q2:"closure" },
{ k:"mantik",  nm:"Algısal akıl yürütme", cats:["algisal-akil-yurutme"], kind:"qz", q:"matrix-fill", q2:"pattern-touch" } ];
const PLACE_TASK = { hiz:"anlam kararı, gölge eşleme", goz:"bardak takibi", dikkat:"ok yönü", calisan:"sırayı hatırlama", sozelb:"dinle-hatırla", resim:"resimleri hatırlama", sozelo:"farklı olan, benzetme", dil:"söyleneni göster, kavramlar", gorsel:"döndürme, tamamlama", mantik:"matris, örüntü" };   /* sonuç tablosunda her alanın hangi çalışmayla ölçüldüğü yazar */
const PLACE_TIER = ["Başlangıç","Orta","Zor"], PLACE_STEPS = 6;
const stepLvl = (s) => s >= 3 ? "post" : "pre", stepTier = (s) => s % 3;
/* stepName: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
function placeAll(){ try{ return JSON.parse(localStorage.getItem(PLACE_KEY) || "{}"); }catch(e){ return {}; } }
function placeGet(name){ const n = (name || "").trim(); if(!n || n === "Misafir") return null; const r = placeAll()[n]; return (r && r.dom) ? r : null; }
function placeSave(name, rec){ const d = placeAll(); d[name.trim()] = rec; try{ localStorage.setItem(PLACE_KEY, JSON.stringify(d)); }catch(e){} }
function placeDue(name){ const p = placeGet(name); return !p || (Date.now() - p.t) > PLACE_REDO_DAYS * 864e5; }
function placeDomFor(catId){ return PLACE_DOMS.find(d => d.cats.includes(catId)) || null; }
function placedStep(catId, name){ const p = placeGet(name != null ? name : currentPlayerName); if(!p) return null; const d = placeDomFor(catId); if(!d) return null; const v = p.dom[d.k]; return typeof v === "number" ? v : null; }
function placedLevelFor(catId, name){ const s = placedStep(catId, name); return s == null ? null : stepLvl(s); }
function placedTierFor(exId, name){ const c = CATEGORIES.find(c => c.exerciseIds.includes(exId)); if(!c) return null; const s = placedStep(c.id, name); if(s == null) return null;
  if(stepLvl(s) !== readingLevel) return stepLvl(s) === "post" ? 2 : 0; /* başka seviyedeyse o seviyenin ucundan başla */ return stepTier(s); }
/* Çalışma açılırken seviyeyi alandaki değerlendirme sonucuna göre ayarla (sonuç yoksa profildeki seviye) */
/* ===== Kategori düzeyi (okuma düzeyi kategori başına) =====
   KURAL: bir kategorinin okuma düzeyi şu sırayla belirlenir: 1) uzmanın o kategori için seçimi (bağlı aile cihazında program.levels ile gelir),
   2) ailenin seçimi, 3) Değerlendirme turu sonucu, 4) çocuğun genel düzeyi. Yeniden değerlendirme elle seçilmiş düzeyleri değiştirmez.
   Kayıt: wm_cat_levels_v1 = { [çocuk]: { [kategori]: { lvl:"pre"|"post", by:"uzman"|"aile", at } } } */
const CAT_LVL_KEY = "wm_cat_levels_v1";
function catLevelsAll(){ try{ return JSON.parse(localStorage.getItem(CAT_LVL_KEY) || "{}"); }catch(e){ return {}; } }
function catLevelsSave(d){ try{ localStorage.setItem(CAT_LVL_KEY, JSON.stringify(d)); }catch(e){} }
function catLevelEntry(catId, name){ const n = (name || "").trim(); if(!n) return null; const d = catLevelsAll(); return (d[n] && d[n][catId]) || null; }
function catLevelProgram(catId){ try{ if(appMode !== "aile" || typeof familyProgram !== "function") return null; const pr = familyProgram(); const v = pr && pr.levels && pr.levels[catId]; return v === "pre" || v === "post" ? v : null; }catch(e){ return null; } }
/* Kategorinin etkin düzeyi ve kaynağı */
function catLevelInfo(catId, name){
const n = (name != null ? name : currentPlayerName) || "";
const gen = (n && typeof getPlayerLevel === "function" && getPlayerLevel(n)) || readingLevel || "post";
if(!n || n === "Misafir") return { lvl: gen, by: "genel" };
const e = catLevelEntry(catId, n);
if(e && e.by === "uzman" && (e.lvl === "pre" || e.lvl === "post")) return { lvl: e.lvl, by: "uzman" };
const pl = catLevelProgram(catId); if(pl) return { lvl: pl, by: "uzman" };
if(e && e.by === "aile" && (e.lvl === "pre" || e.lvl === "post")) return { lvl: e.lvl, by: "aile" };
let placed = null; try{ placed = placedLevelFor(catId, n); }catch(err){}
if(placed) return { lvl: placed, by: "degerlendirme" };
return { lvl: gen, by: "genel" };
}
function catLevelFor(catId, name){ return catLevelInfo(catId, name).lvl; }
/* Elle seçim: lvl null → seçim silinir (sıradaki kaynağa dönülür). Uzman cihazında bağlı danışan varsa seçim programla aileye gider. */
function setCatLevel(catId, name, lvl, by){
const n = (name || "").trim(); if(!n || n === "Misafir") return false;
const d = catLevelsAll(); d[n] = d[n] || {};
if(lvl === "pre" || lvl === "post") d[n][catId] = { lvl, by: by || (appMode === "uzman" ? "uzman" : "aile"), at: Date.now() }; else delete d[n][catId];
catLevelsSave(d);
try{ if(appMode === "uzman") catLevelSyncToFamily(n, catId, lvl === "pre" || lvl === "post" ? lvl : null); }catch(e){}
return true;
}
function expertLinkForChild(name){ const n = (name || "").trim().toLocaleLowerCase("tr"); return (expertLinks || []).find(l => String(l.childName || "").trim().toLocaleLowerCase("tr") === n) || null; }
async function catLevelSyncToFamily(name, catId, lvl){
if(typeof fbOk !== "function" || !fbOk()) return; const l = expertLinkForChild(name); if(!l) return;
const { db, doc, updateDoc } = window.__fb; const levels = Object.assign({}, (l.program && l.program.levels) || {}); if(lvl) levels[catId] = lvl; else delete levels[catId];
const program = Object.assign({}, l.program || {}, { levels, updatedAt: Date.now() });
try{ await updateDoc(doc(db, "links", l.id || l.code), { program }); l.program = program; }catch(e){ console.error("Kategori düzeyi aileye gönderilemedi:", e); }
}
/* Kategori açılırken o kategorinin düzeyini uygula */
function applyPlacedLevel(catId, name){ try{ const n = (name != null ? name : currentPlayerName) || ""; try{ catCheerShow(n, catId); }catch(e){}   /* çocuğa: bu alanı ilk açışında motive edici ifade */ const L = catLevelFor(catId, n); if(L && L !== readingLevel){ readingLevel = L; try{ applyLevelDefaultThresholds(L); }catch(e){} } }catch(e){} }
/* KURAL (Değerlendirme turu): sonuç, kategorilere göre tek bir özet tabloda gösterilir — Kategori | Kademe (Okul Öncesi / Okul Sonrası) | Düzey (Başlangıç / Orta / Zor); tur sonunda ve Değerlendirme turu panelinde aynı tablo */
function placeTableHtml(dom, opts){ opts = opts || {}; const cats = CATEGORIES.filter(c => !c.hidden); const rows = cats.map(c => { const d = placeDomFor(c.id); const v = d && dom ? dom[d.k] : null; if(typeof v !== "number") return `<tr><td>${escHTML(c.label)}</td><td colspan="2" class="pt-na">—</td></tr>`;
  const pre = v < 3, tier = stepTier(v); return `<tr><td>${escHTML(c.label)}${opts.qn && opts.qn[d.k] ? `<div class="pt-qn">${opts.qn[d.k]} soru${PLACE_TASK[d.k] ? " · " + PLACE_TASK[d.k] : ""}</div>` : ""}</td><td><span class="pt-k ${pre ? "pre" : "post"}">${pre ? "Okul Öncesi" : "Okul Sonrası"}</span></td><td><span class="pt-t t${tier}">${PLACE_TIER[tier]}</span></td></tr>`; }).join("");
  const n = cats.filter(c => { const d = placeDomFor(c.id); return d && dom && typeof dom[d.k] === "number"; }), post = n.filter(c => dom[placeDomFor(c.id).k] >= 3).length;
  return `<div class="place-table-wrap"><table class="place-table"><thead><tr><th>Alan</th><th>Okul dönemi</th><th>Düzey</th></tr></thead><tbody>${rows}</tbody></table>${opts.foot === false ? "" : `<div class="pt-foot">${post} alan Okul Sonrası · ${n.length - post} alan Okul Öncesi</div>`}</div>`; }
function placeSummary(p){ if(!p) return ""; const e = Object.entries(p.dom), nm = (k) => (PLACE_DOMS.find(d => d.k === k) || {}).nm; const post = e.filter(([, v]) => v >= 3).length;
  const hi = e.filter(([, v]) => v >= 4).map(([k]) => nm(k)).filter(Boolean), lo = e.filter(([, v]) => v <= 1).map(([k]) => nm(k)).filter(Boolean);
  return [`${post} alan Okul Sonrası, ${e.length - post} alan Okul Öncesi`, hi.length ? `Güçlü: ${hi.join(", ")}` : "", lo.length ? `Gelişen: ${lo.join(", ")}` : ""].filter(Boolean).join(" · "); }
/* KURAL (Değerlendirme turu): içerik değişken — aynı soru bir tur içinde tekrar sorulmaz ve son turlarda sorulan sorular (çocuk başına, alan başına son 60) yeni soru varken tekrar gelmez ("Hangisi huni?" her turda çıkmaz) */
const PLACE_SEEN_KEY = "wm_place_seen_v1";
function placeSeenAll(){ try{ return JSON.parse(localStorage.getItem(PLACE_SEEN_KEY) || "{}"); }catch(e){ return {}; } }
function placeHash(str){ let h = 5381; for(let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
function placeKey(tr){ const t = String(tr.say || tr.prompt || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); const o = (tr.opts || []).map(x => String(x).replace(/\s+/g, "")).sort().join("|"); return t.slice(0, 60) + "#" + placeHash(String(tr.stim || "").replace(/\s+/g, "") + "§" + o); }
/* KURAL: seçenek ızgarasında son satır eksik kalmaz (4 → 2×2, 6 → 3×2, 8 → 4×2, 9 → 3×3) */
function placeOptCols(n){ return n <= 3 ? n : n === 4 ? 2 : n === 8 ? 4 : (n % 3 === 0 ? 3 : n % 2 === 0 ? Math.min(4, n / 2) : 3); }
function placeQz(q, step, name){ const save = currentCombo, keep = readingLevel; let trials; try{ readingLevel = stepLvl(step); currentCombo = () => Object.assign({}, save(), { t: stepTier(step) }); window.__placeWide = true; trials = QZ[q](); } finally { currentCombo = save; readingLevel = keep; window.__placeWide = false; }
  if(!Array.isArray(trials) || !trials.length) return null; const n = (name || "").trim(); const all = placeSeenAll(); const seen = (all[n] && all[n][q]) || []; const R = placeRun; const used = (R && R.usedKeys) || new Set();
  const keyed = trials.map(tr => ({ tr, k: placeKey(tr) })); let cands = keyed.filter(x => !used.has(x.k) && !seen.includes(x.k)); if(!cands.length) cands = keyed.filter(x => !used.has(x.k)); if(!cands.length) cands = keyed;
  try{ const fx = cands.filter(x => x.tr && Array.isArray(x.tr.opts) && typeof x.tr.ans === "number" && x.tr.opts.length > 1 && qzOrderMatters(x.tr, q)); if(fx.length === cands.length && R){ /* KURAL: seçenek sırası sabit sorularda (Evet/Hayır, yön, sayı) doğru cevabın yeri soruyu seçerken dengelenir: aynı yan üst üste en çok 2 kez, sol/sağ payı eşit */ const SC = R.sideCnt || { L:0, R:0, U:0, D:0, M:0 }, SH = R.sideHist || []; const sideOf = (tr) => { const k = tr.opts.length, cols = placeOptCols(k), c = tr.ans % cols; return cols % 2 === 1 && c === (cols - 1) / 2 ? "M" : (c < cols / 2 ? "L" : "R"); }; const s2 = SH.slice(-2); let c2 = cands; if(s2.length === 2 && s2[0] === s2[1] && s2[0] !== "M"){ const f = c2.filter(x => sideOf(x.tr) !== s2[0]); if(f.length) c2 = f; } const lp = (R.posHist || [])[(R.posHist || []).length - 1]; if(lp){ const f2 = c2.filter(x => !(x.tr.opts.length === lp[0] && x.tr.ans === lp[1])); if(f2.length) c2 = f2; } const sc = (x) => { const sx = sideOf(x.tr); return sx === "M" ? 0 : SC[sx] - Math.min(SC.L, SC.R); }; const mn = Math.min(...c2.map(sc)); cands = c2.filter(x => sc(x) === mn); } }catch(e){}
  const pick = randomItem(cands); if(R){ R.usedKeys = used; used.add(pick.k); } if(n){ all[n] = all[n] || {}; all[n][q] = seen.concat([pick.k]).slice(-60); try{ localStorage.setItem(PLACE_SEEN_KEY, JSON.stringify(all)); }catch(e){} }
  try{ const t = pick.tr; if(t && Array.isArray(t.opts) && typeof t.ans === "number" && t.ans >= 0 && t.opts.length > 1 && !qzOrderMatters(t, q)){ const k = t.opts.length, cols = placeOptCols(k), rows = Math.ceil(k / cols);
    /* ekrandaki yer: sütun yarısı (sol/sağ/orta) ve satır yarısı (üst/alt/orta) */ const side = (i) => { const c = i % cols, r = Math.floor(i / cols); const sx = cols % 2 === 1 && c === (cols - 1) / 2 ? "M" : (c < cols / 2 ? "L" : "R"); const sy = rows % 2 === 1 && r === (rows - 1) / 2 ? "M" : (r < rows / 2 ? "U" : "D"); return [sx, sy]; };
    if(R){ R.ansCnt = R.ansCnt || {}; R.ansCnt[k] = R.ansCnt[k] || new Array(k).fill(0); R.sideCnt = R.sideCnt || { L:0, R:0, U:0, D:0, M:0 }; R.sideHist = R.sideHist || []; R.posHist = R.posHist || []; }
    const cnt = R ? R.ansCnt[k] : new Array(k).fill(0), SC = R ? R.sideCnt : { L:0, R:0, U:0, D:0, M:0 }, SH = R ? R.sideHist : [], PH = R ? R.posHist : [];
    let al = Array.from({length: k}, (_, i) => i);
    const lastPos = PH[PH.length - 1]; al = al.filter(i => !(lastPos && lastPos[0] === k && lastPos[1] === i)); /* aynı konum art arda gelmez */
    const s2 = SH.slice(-2); if(s2.length === 2 && s2[0] === s2[1] && s2[0] !== "M"){ const al2 = al.filter(i => side(i)[0] !== s2[0]); if(al2.length) al = al2; } /* aynı yan (sol/sağ) üst üste en çok 2 kez */
    const score = (i) => { const [sx, sy] = side(i); return (sx === "M" ? 0 : SC[sx] - Math.min(SC.L, SC.R)) * 3 + (sy === "M" ? 0 : SC[sy] - Math.min(SC.U, SC.D)) * 2 + cnt[i]; };
    const mn = Math.min(...al.map(score)); qzMoveAns(t, randomItem(al.filter(i => score(i) === mn)));
    if(R){ cnt[t.ans]++; const [sx, sy] = side(t.ans); SC[sx]++; if(sy !== "M") SC[sy]++; SH.push(sx); R.sideHist = SH.slice(-6); PH.push([k, t.ans]); R.posHist = PH.slice(-6); R.ansHist = ((R.ansHist || []).concat([t.ans])).slice(-4); }
    /* KURAL (Değerlendirme turu, cevap yeri): doğru cevabın EKRANDAKİ yeri dengelidir — sol/sağ sütun ve üst/alt satır payı eşit tutulur (seçenek sayısı ve düzen ne olursa olsun, bütün tur boyunca), aynı yan üst üste en çok 2 kez, aynı konum art arda gelmez */ } }catch(e){} try{ const t2 = pick.tr; if(R && t2 && Array.isArray(t2.opts) && typeof t2.ans === "number" && t2.opts.length > 1 && qzOrderMatters(t2, q)){ const k = t2.opts.length, cols = placeOptCols(k), c = t2.ans % cols; const sx = cols % 2 === 1 && c === (cols - 1) / 2 ? "M" : (c < cols / 2 ? "L" : "R"); R.sideCnt = R.sideCnt || { L:0, R:0, U:0, D:0, M:0 }; R.sideCnt[sx]++; R.sideHist = (R.sideHist || []).concat([sx]).slice(-6); R.posHist = (R.posHist || []).concat([[k, t2.ans]]).slice(-6); } }catch(e){}
  return pick.tr; }
/* KURAL (diziliş): çoktan seçmeli sorularda doğru cevabın yeri dengelidir — her konum eşit sıklıkta kullanılır ve aynı konum üst üste en çok 2 kez gelir; seçenek sırası anlamlı olan sorular (sayılar, yönler, Evet/Hayır, QZ_SPREAD_SKIP) bu kuralın dışındadır */
function qzMoveAns(t, p){ if(!t || !Array.isArray(t.opts) || typeof t.ans !== "number" || t.ans < 0 || p === t.ans || p < 0 || p >= t.opts.length) return; const o = t.opts; const tmp = o[t.ans]; o[t.ans] = o[p]; o[p] = tmp; t.ans = p; }
function qzOrderMatters(t, exId){ try{ if(exId && QZ_SPREAD_SKIP.has(exId)) return true; const plain = t.opts.map(o => String(o).replace(/<[^>]+>/g, "").trim()); if(plain.every(x => x !== "" && /^[\d\s👏]+$/.test(x))) return true; if(plain.some(x => /[✓✗]/.test(x))) return true; }catch(e){} return false; }   /* sıra anlamlı: sayılar küçükten büyüğe, Evet/Hayır, yön düğmeleri, sabit düzenli çalışmalar */
function qzBalancePos(trials, exId){ if(!Array.isArray(trials)) return trials; const use = {}; const hist = []; trials.forEach(t => { if(!t || !Array.isArray(t.opts) || typeof t.ans !== "number" || t.ans < 0 || t.opts.length < 2 || qzOrderMatters(t, exId)) return; const k = t.opts.length; use[k] = use[k] || new Array(k).fill(0); let allowed = Array.from({length: k}, (_, i) => i); if(hist.length >= 2 && hist[hist.length - 1] === hist[hist.length - 2]) allowed = allowed.filter(i => i !== hist[hist.length - 1]); const minU = Math.min(...allowed.map(i => use[k][i])); const pick = randomItem(allowed.filter(i => use[k][i] === minU)); qzMoveAns(t, pick); use[k][pick]++; hist.push(pick); }); return trials; }
/* sayısal seçeneklerde (küçükten büyüğe dizili) doğru cevabın sırası da dengelenir: çeldiriciler cevabın hep iki yanından seçilmez; cevabın kaçıncı sırada duracağı dengeli belirlenir (ör. 3 seçenekte cevap hep ortada kalmaz) */
function qzBalanceNum(trials){ if(!Array.isArray(trials)) return trials; const hist = [], use = {}; trials.forEach(t => { try{ if(!t || !Array.isArray(t.opts) || typeof t.ans !== "number" || t.ans < 0) return; const raw = t.opts.map(o => String(o)); if(raw.some(o => /👏/.test(o))) return; const plain = raw.map(o => o.replace(/<[^>]+>/g, "").trim()); if(!plain.every(x => /^\d+$/.test(x))) return; const k = plain.length, a = +plain[t.ans]; if(k < 3) return; const tmpl = (v) => raw[t.ans].replace(new RegExp("(^|>)(\\s*)" + a + "(\\s*)(<|$)"), "$1$2" + v + "$3$4"); use[k] = use[k] || new Array(k).fill(0); let allowed = Array.from({length: k}, (_, i) => i).filter(r => a - r >= 1); if(hist.length >= 2 && hist[hist.length - 1] === hist[hist.length - 2]) allowed = allowed.filter(r => r !== hist[hist.length - 1]); if(!allowed.length) return; const minU = Math.min(...allowed.map(r => use[k][r])); const r = randomItem(allowed.filter(x => use[k][x] === minU)); const vals = []; for(let i = r; i >= 1; i--) vals.push(a - i); vals.push(a); for(let i = 1; vals.length < k; i++) vals.push(a + i); const nopts = vals.map(v => tmpl(v)); if(new Set(nopts).size < k) return;   /* şablon sayıyı değiştiremediyse dokunma */ t.opts = nopts; t.ans = r; use[k][r]++; hist.push(r); }catch(e){} }); return trials; }
/* sırası anlamlı seçeneklerde (sayı, hece sayısı, terazi yönü) cevap konumu içerikten gelir; aynı cevap üst üste 3. kez gelmesin diye denemelerin sırası değiştirilir (ısınma denemelerine dokunulmaz) */
/* KURAL (içerik): bir oturumda aynı soru iki kez gelmez — tekrar eden soru aynı düzeyden yeni üretilen bir soruyla değiştirilir (havuz yetmezse en az 4 soru arayla) */
function qzSig(q){ const sh = (o) => String(o == null ? "" : o).replace(/(?:src|href)="(data:[^"]+)"/g, (m, u) => "S" + u.length + u.slice(-12)).replace(/\s+/g, " "); return [q.stim, q.prompt, q.say, q.text, q.qk].map(sh).join("|") + "|" + (q.opts || []).map(sh).join("¦"); }
function qzDedupe(st, exId){ try{ if(!QZ[exId] || !Array.isArray(st.trials)) return; const T = st.trials, seen = new Map(); let extra = [], gen = 0; const more = () => { if(gen >= 8) return false; gen++; try{ extra = extra.concat(qzTierOpts(exId, QZ[exId]()) || []); }catch(e){ return false; } return true; };
    for(let i = 0; i < T.length; i++){ let s = qzSig(T[i]); if(seen.has(s)){ let rep = null; while(!rep){ const k = extra.findIndex(c => c && (c.opts || []).length === (T[i].opts || []).length && !seen.has(qzSig(c)) && !T.slice(i + 1).some(x => qzSig(x) === qzSig(c))); if(k >= 0){ rep = extra.splice(k, 1)[0]; break; } if(!more()) break; } if(rep){ T[i] = rep; s = qzSig(rep); } } seen.set(s, i); }
    /* havuz yetmediyse: kalan tekrarlar birbirinden en az 4 soru uzakta */
    for(let pass = 0; pass < 3; pass++){ for(let i = 1; i < T.length; i++){ const s = qzSig(T[i]); for(let d = 1; d <= 3 && i - d >= 0; d++){ if(qzSig(T[i - d]) === s){ for(let j = T.length - 1; j > i; j--){ const sj = qzSig(T[j]); if(sj !== s && !T.slice(Math.max(0, i - 3), i).some(x => qzSig(x) === sj)){ const tmp = T[i]; T[i] = T[j]; T[j] = tmp; break; } } break; } } } }
  }catch(e){} }
/* KURAL (diziliş): doğru cevabın yeri (ya da sayısal cevabın kendisi) art arda en çok 2 kez aynı (iki seçenekli hızlı kararda en çok 3); ısınma dahil bütün oturumda. Yeniden sıralama yetmezse soru aynı düzeyden yeni bir soruyla değiştirilir */
function qzFixRuns(st, exId){ try{ const T = st.trials; if(!Array.isArray(T) || !QZ[exId]) return; const lim = (q) => ((q.opts || []).length <= 2 ? 3 : 2); const A = (q) => (q && typeof q.ans === "number") ? (q.opts || []).length + ":" + q.ans : null; let extra = [], gen = 0; const seen = new Set(T.map(qzSig));
    for(let i = 1; i < T.length; i++){ let run = 1; for(let k = i - 1; k >= 0 && A(T[k]) === A(T[i]); k--) run++; if(A(T[i]) == null || run <= lim(T[i])) continue;
      let rep = null; while(!rep){ const k = extra.findIndex(c => c && (c.opts || []).length === (T[i].opts || []).length && A(c) !== A(T[i]) && A(c) !== A(T[i + 1]) && !seen.has(qzSig(c))); if(k >= 0){ rep = extra.splice(k, 1)[0]; break; } if(gen >= 10) break; gen++; try{ const g = qzTierOpts(exId, QZ[exId]()) || []; qzBalancePos(g, exId); extra = extra.concat(g); }catch(e){ break; } }
      if(rep){ seen.add(qzSig(rep)); T[i] = rep; } } }catch(e){} }
function qzBreakRuns(trials, from){ if(!Array.isArray(trials)) return trials; const A = (t) => t && typeof t.ans === "number" ? t.ans : null; const st0 = Math.max(2, from || 0); for(let pass = 0; pass < 10; pass++){ let changed = false; for(let i = st0; i < trials.length; i++){ const x = A(trials[i]); if(x == null || x !== A(trials[i-1]) || x !== A(trials[i-2])) continue; for(let j = i + 1; j < trials.length; j++){ const y = A(trials[j]); if(y == null || y === x) continue; const tmp = trials[i]; trials[i] = trials[j]; trials[j] = tmp; changed = true; break; } if(A(trials[i]) === x){ for(let j = st0; j < i - 1; j++){ const y = A(trials[j]); if(y == null || y === x || A(trials[j-1]) === x || A(trials[j+1]) === x) continue; const tmp = trials[i]; trials[i] = trials[j]; trials[j] = tmp; changed = true; break; } } } if(!changed) break; } return trials; }
/* KURAL (diziliş, dokunmalı): hedefler satırlara dengeli dağılır — her satıra düşen hedef sayısı birbirine yakındır (bir satırda yığılmaz, mümkünse boş satır kalmaz); aynı resim yan yana gelmez */
const TOUCH_SPREAD = new Set(["cat-fruit","cat-cold","cat-living","pairs-touch","touch-card","touch-animal"]);
function touchSpread(grid, cols, ex){ try{ if(!ex || !ex.isTouch || !TOUCH_SPREAD.has(ex.id) || !Array.isArray(grid) || cols < 2) return grid; const R = Math.ceil(grid.length / cols); if(R < 2) return grid; const tg = grid.filter(x => x && x.go), ot = grid.filter(x => !(x && x.go)); if(!tg.length || !ot.length) return grid;
  const quota = new Array(R).fill(Math.floor(tg.length / R)); shuffleArray(Array.from({length: R}, (_, i) => i)).slice(0, tg.length % R).forEach(i => quota[i]++);
  const sk = (x) => x && (x.src || x.k || x.n || JSON.stringify(x));
  for(let attempt = 0; attempt < 12; attempt++){ const T = shuffleArray(tg.slice()), O = shuffleArray(ot.slice()), out = []; let ok = true;
    for(let r = 0; r < R; r++){ const w = Math.min(cols, grid.length - r * cols); let q = Math.min(quota[r], w, T.length); const row = T.splice(0, q).concat(O.splice(0, w - q)); while(row.length < w && T.length) row.push(T.shift()); while(row.length < w && O.length) row.push(O.shift()); let best = null; for(let k = 0; k < 8; k++){ const rr = shuffleArray(row.slice()); if(rr.every((x, i) => i === 0 || sk(x) !== sk(rr[i - 1]))){ best = rr; break; } } if(!best){ ok = false; best = row; } out.push(...best); }
    if(ok || attempt === 11) return out.length === grid.length ? out : grid; } }catch(e){} return grid; }
let placeRun = null;
function placePool(){ const C = qzCats(), seen = new Set(), out = []; const add = (arr) => (arr || []).forEach(x => { if(x && x.src && !seen.has(x.src)){ seen.add(x.src); out.push(x); } });
add(picPool()); ["wild","vehicle","toy","meyve","sebze","clothes","kitchen"].forEach(k => add(C[k] && C[k].items));
const R = placeRun, recent = (R && R.recent) || []; let pool = shuffleArray(out.filter(x => !recent.includes(x.src))); if(pool.length < 12) pool = shuffleArray(out);
if(R){ R.recent = recent.concat(pool.slice(0, 9).map(x => x.src)).slice(-18); } return pool; }
function placeNamedPool(){ const C = qzCats(), seen = new Set(), out = []; Object.keys(C).forEach(k => (C[k].items || []).forEach(x => { if(x && x.src && x.n && !seen.has(x.n)){ seen.add(x.n); out.push(x); } })); return shuffleArray(out); }
function placeOffer(name){ if(!name || name === "Misafir") return; let el = document.getElementById("placeSheet"); if(!el){ el = document.createElement("div"); el.id = "placeSheet"; document.body.appendChild(el); }
el.innerHTML = `<div class="mola-card"><div style="width:90px;height:90px;margin:0 auto">${zihniSVG("happy")}</div><div class="mola-h">Değerlendirme turu</div><div class="mola-s"><b>${escHTML(name)}</b> için Zihni ile 6–8 dakikalık bir değerlendirme turu oynansın mı? On alanın her birinde çocuğun yapabildiği yer bulunur; çalışmalar oradan başlar.</div>
<div class="mola-list"><button type="button" data-po="go"><span>🧭</span>Şimdi oyna</button><button type="button" data-po="later"><span>⏰</span>Sonra</button></div></div>`;
el.style.display = "flex"; el.querySelector('[data-po="go"]').onclick = () => { el.style.display = "none"; placeStart(name); }; el.querySelector('[data-po="later"]').onclick = () => { el.style.display = "none"; }; }
function placeStart(name){ pauseTour(); let prof = null; try{ prof = getPlayerLevel(name); }catch(e){} const base = (prof || readingLevel) === "pre" ? 0 : 1; /* KURAL (Değerlendirme turu başlangıcı, 2026-11-08 — B kararı): tur basitten zora gider — Okul Sonrası 1. basamaktan, Okul Öncesi 0. basamaktan başlar; içerik de bir kademe kolaylaştığı için ilk sorular eski ölçekten iki kademe kolaydır; başarılı çocuk iniş-çıkışla yukarı çıkar; sonraki alanlar önceki sonuçların ortalamasından başlar */
placeRun = { name, base, di:0, step: base, dir:0, hits:0, n:0, visits:0, res:{}, items:0, warmDone:{}, order: PLACE_DOMS.map((_, i) => i), st:{} };
let el = document.getElementById("placeScreen"); if(!el){ el = document.createElement("div"); el.id = "placeScreen"; document.body.appendChild(el); }
el.style.display = "flex"; el.innerHTML = `<div class="adv-wrap" style="text-align:center"><div style="width:110px;height:110px;margin:20px auto 6px">${zihniSVG("wave")}</div><div class="mola-h">Zihni ile değerlendirme turu!</div><div class="mola-s">On küçük oyun var. Elinden geldiğince dikkatli oyna, acele etmene gerek yok.</div><div class="mola-list" style="max-width:300px;margin:0 auto"><button type="button" id="placeGo" class="place-cta"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M10 8.5v7l5.5-3.5z" fill="currentColor"></path></svg>Başla</button></div></div>`;
speakText("Zihni ile değerlendirme turuna hazır mısın?"); document.getElementById("placeGo").onclick = placeNext; placeExitBtn(); }
/* KURAL (Değerlendirme turu): sonraki alanın başlangıç basamağı önceki alanların sonuçlarına göre belirlenir (tamamlanan alanların ortalaması; ilk alan çocuğun genel düzeyinden başlar) — zorlanan çocuk sonraki alanlara aşağıdan, güçlü çocuk yukarıdan başlar, tur hem kısa hem isabetli olur */
function placeNextStart(R){ const v = Object.values(R.res || {}).filter(x => typeof x === "number"); if(!v.length) return R.base; const m = (v.reduce((a, b) => a + b, 0) + R.base) / (v.length + 1);   /* genel düzey bir "ön bilgi" olarak ortalamaya katılır: ilk alandaki tek sonuç her şeyi belirlemez */ return Math.max(0, Math.min(PLACE_STEPS - 1, Math.round(m))); }
/* KURAL (Değerlendirme turu çıkışı): tur bitince ya da çıkılınca kullanıcı asla boş ekranda kalmaz — açık bir ekran yoksa ana sayfaya dönülür; Zihin Adaları'ndan başlatıldıysa harita yenilenir */
/* KURAL (Değerlendirme turu sonrası, 2026-11-07): Değerlendirme turu kapanınca altta açık kalan sayfa yeni sonuçla yeniden çizilir — Ödevlerim, Aile/Uzman alanlar sayfası, Bugünün etkinlikleri; önceden eski hâliyle kalıyor ve "Değerlendirme turu henüz yapılmadı" görünmeye devam ediyordu */
function zaPlaceRefresh(){ try{ const vis = (id) => { const e = document.getElementById(id); return !!e && getComputedStyle(e).display !== "none"; }; if(typeof hwScreenOpen !== "undefined" && hwScreenOpen && vis("linkScreen")){ showHwScreen(); return true; } if(vis("todayScreen") && typeof showToday === "function"){ showToday(); return true; } if(vis("categoryScreen") && typeof openCategoryScreen === "function"){ openCategoryScreen(); return true; } }catch(e){} return false; }
function placeAfterClose(){ try{ zaPlaceRefresh(); const isl = document.getElementById("islandScreen"); if(isl && isl.style.display === "flex"){ showIslandMap(); return; } const skip = new Set(["placeScreen", "placeX", "placeOffer", "exhPop"]); const vis = [...document.body.children].some(e => { if(skip.has(e.id) || /exh-|toast|sheet|tour|overlay/i.test(e.className || "")) return false; const cs = getComputedStyle(e); if(cs.display === "none" || cs.visibility === "hidden" || cs.position === "fixed" && e.id !== "islandScreen" && !/Screen|Home|mainApp/.test(e.id)) return false; const r = e.getBoundingClientRect(); return r.height > 300 && r.width > 200 && (e.innerText || "").trim().length > 0; }); if(!vis){ try{ goHome(); }catch(e){ location.reload(); } } }catch(e){ try{ goHome(); }catch(_){} } }
function placeExitBtn(){ const el = document.getElementById("placeScreen"); let x = document.getElementById("placeX"); if(x){ x.style.display = "flex"; return; } x = document.createElement("button"); x.id = "placeX"; x.type = "button"; x.className = "place-x mola-x"; x.setAttribute("aria-label", "Değerlendirme turundan çık"); x.textContent = "✕";
x.onclick = async () => { if(!await zaConfirm("Değerlendirme turundan çıkılsın mı? Sonuçlar kaydedilmez; turu daha sonra yeniden başlatabilirsiniz.")) return; placeRun = null; el.style.display = "none"; x.style.display = "none"; try{ speechSynthesis.cancel(); }catch(e){} placeAfterClose(); };
document.body.appendChild(x); }
/* KURAL: oyun sahnesinde sepet gerçek hasır sepet görseli (Meyve Sepeti) */
/* KURAL (Değerlendirme turu, yapı — 2026-11-04'te güncellendi): 10 alanın hepsi sırayla ölçülür; her alan tek blokta biter, bir alana geri dönülmez (eski dönüşümlü yapı kaldırıldı). Basamak iniş-çıkışı aşağıdaki 2026-11-02 kuralına göredir; alan başına en çok 5 tur. */
function placeSaveDom(R){ R.st[R.di] = { step: R.step, dir: R.dir, visits: R.visits }; }
function placeLoadDom(R, i){ R.di = i; const s0 = R.st[i]; if(s0){ R.step = s0.step; R.dir = s0.dir; R.visits = s0.visits; } else { R.step = placeNextStart(R); R.dir = 0; R.visits = 0; } R.n = 0; R.hits = 0; }
function placeRotate(R, finished){ if(R.order && !finished){ R.n = 0; R.hits = 0; return; }   /* aynı alanda kal (dönüşümlü yapı kaldırıldı) */
  if(!R.order){ if(finished){ R.di++; R.step = placeNextStart(R); R.dir = 0; R.visits = 0; } return; } let pos = R.order.indexOf(R.di); if(pos < 0){ R.order = PLACE_DOMS.map((_, i) => i).filter(i => R.res[PLACE_DOMS[i].k] == null); pos = Math.max(0, R.order.indexOf(R.di)); } if(finished){ R.order = R.order.filter(i => i !== R.di); delete R.st[R.di]; if(!R.order.length){ R.di = PLACE_DOMS.length; return; } placeLoadDom(R, R.order[pos % R.order.length]); } else { placeSaveDom(R); placeLoadDom(R, R.order[(pos + 1) % R.order.length]); } }
function placeNext(){ const R = placeRun; if(!R) return; if(R.di >= PLACE_DOMS.length || (R.order && !R.order.length)) return placeFinish(); setTimeout(placeExitBtn, 0);
const d = PLACE_DOMS[R.di]; R.items++; const myItem = R.item = (R.item || 0) + 1;
const warm = !R.warmDone[d.k] && R.n === 0 && R.visits === 0; const TT = Math.max(0, R.step - 1); /* KURAL (Değerlendirme turu içeriği, 2026-11-08): her basamağın içeriği bir kademe kolaydır — basamak s, önceki ölçekte s−1 içeriğini kullanır (ör. 4 resim → 3 resim, 4 sözcük → 3 sözcük, 4 bardak → 3 bardak); en zor basamak da bir kademe kolaylaştı; 0 ve 1. basamak en kolay içeriği paylaşır. Öğrenme güçlüğü olan çocuğa başarısızlık yaşatmamak için ölçeğin tamamı aşağı kaydırıldı */ /* KURAL (Değerlendirme turu, B kararı 2026-10-28): her alan, başlangıç basamağında puanlanmayan bir ısınma sorusuyla başlar; ısınma yanlışsa ölçüm bir alt basamaktan başlar — turun başındaki alanlarda sıra etkisi azalır */ const pre = TT < 3; const el = document.getElementById("placeScreen");
const head = `${warm ? `<div class="qz-warm" style="margin-top:calc(8px + env(safe-area-inset-top))">${icI("sprout", 15, "#1B7A3D")} Isınma</div>` : ""}<div class="place-top"><div class="place-dots">${PLACE_DOMS.map((dd, i) => `<span class="${R.res[dd.k] != null ? "done" : i === R.di ? "cur" : ""}"></span>`).join("")}</div></div>`;
const answer = (ok, right) => { if(placeRun !== R || R.item !== myItem || R.answered === myItem) return; R.answered = myItem;
  if(warm){ R.warmDone[d.k] = true; if(!(right === undefined ? ok : right)) R.step = Math.max(0, R.step - 1); /* KURAL (Değerlendirme turu ısınması, 2026-11-07): ısınma puanlanmaz ve süre sınırı uygulanmaz — doğru ama yavaş cevap ısınmada basamağı düşürmez (önceden doğru cevaptan sonra daha kolay soru geliyordu) */ gameSfx(ok ? "correct" : "pop"); return setTimeout(placeNext, 450); }
  R.n++; if(ok) R.hits++; R.qn = R.qn || {}; R.qn[d.k] = (R.qn[d.k] || 0) + 1; gameSfx(ok ? "correct" : "pop"); /* KURAL (Değerlendirme turu): gerçek uyarlama — her alanda 2/2 doğru bir basamak yukarı, 0/2 bir basamak aşağı; okul sonrası ile okul öncesi basamakları arasında serbestçe geçilir (ör. görsel bellekte 5 → 4 → 3 → 2 resme kadar iner) */ /* KURAL (Değerlendirme turu, basamak iniş-çıkış, 2026-11-02): her alan başlangıç basamağında 2 soruyla ölçülür. 2/2 → bir üst basamağa çıkılır (alanın ikinci çalışma türüyle); 0/2 → bir ALT basamağa inilir ve orada yeniden sorulur (ör. bardak 4 → 3 → 2, resim dizisi 4 → 3 → 2); en kolay basamakta da yapamazsa sonuç en kolay basamaktır. 1/2 → o basamakta durulur. Yön değişince (çıkıştan sonra iniş ya da inişten sonra çıkış) ölçüm biter: çıkıştan sonraki 0/2'de sonuç bir alt basamak, inişten sonraki 2/2'de sonuç o basamaktır. Hızlı iniş: inişteyken ya da en kolay basamakta ilk soru yanlışsa ikinci soru sorulmadan inilir/bitirilir. Alan başına en çok 6 tur (2026-11-08; önceden 5). Bu basamak kuralı bütün alan türleri (bardak, resim dizisi, dinle-hatırla, resim hatırlama, soru-cevap) için ortaktır. */
const earlyDown = !ok && (R.dir === -1 || R.step <= 0); /* hızlı iniş */
if(R.n < 2 && !earlyDown) return setTimeout(placeNext, 450); /* her turda 2 soru */
const h = earlyDown ? 0 : R.hits; R.n = 0; R.hits = 0; R.visits++; let done = false, res = R.step; const TOP = PLACE_STEPS - 1, MAXV = 6; /* 2026-11-08: 0. basamaktan başlayan çocuk en üst basamağa ulaşabilsin diye alan başına en çok 6 tur */
if(h === 2){ if(R.dir === -1){ done = true; res = R.step; } else if(R.visits >= MAXV || R.step >= TOP){ done = true; res = R.step; } else { R.dir = 1; R.step++; } }
else if(h === 0){ if(R.step <= 0){ done = true; res = 0; } else if(R.dir === 1){ done = true; res = R.step - 1; } else if(R.visits >= MAXV){ done = true; res = Math.max(0, R.step - 1); } else { R.dir = -1; R.step--; } }
else { done = true; res = R.step; } /* 1/2: bu basamak */
if(done) R.res[d.k] = Math.max(0, Math.min(PLACE_STEPS - 1, res)); placeRotate(R, done); setTimeout(placeNext, done ? 550 : 450); };
R._answer = answer;   /* test kancası (otomatik denetim) */
if(d.kind === "qz"){ const tr2 = R.visits >= 1 && d.q2 ? placeQz(d.q2, TT, R.name) : null; const tr = tr2 || placeQz(d.q, TT, R.name);   /* 2. turda alanın ikinci çalışma türü (çeşitlilik) */ R.cur = tr; const LIM = tr2 ? d.lim2 : d.lim; const t0 = performance.now(), lim = LIM ? LIM[pre ? 0 : 1] : null;   /* KURAL: süre sınırı alanın hız çalışmasına aittir; ikinci çalışma türü kendi sınırını (ya da sınırsız) kullanır */
const cell = Math.min(tr.cell || 104, (window.innerWidth - 60) / placeOptCols(tr.opts.length));   /* tablette büyütmeyi sayfa ölçeği (tabUi) yapar */
el.innerHTML = `<div class="adv-wrap">${head}<div class="place-q place-q-z"><span class="pq-z" aria-hidden="true">${zihniSVG("think")}</span><span>${tr.prompt || ""}</span></div>${tr.say && tr.replay ? `<button type="button" class="qz-replay" id="placeRep">🔊 Bir daha dinle</button>` : ""}<div class="place-stim"><div class="ps-in">${tr.stim || ""}</div></div>
<div class="place-opts" style="grid-template-columns:repeat(${tr.text ? (tr.opts.length % 2 ? 1 : 2) : placeOptCols(tr.opts.length)}, ${tr.text ? "minmax(0,1fr)" : cell + "px"})">${tr.opts.map((o, i) => `<button type="button" class="wm-pic${tr.text ? " qz-txt" : ""}" data-po-a="${i}" style="${tr.text ? "min-height:64px" : `width:${cell}px;height:${cell}px`};padding:6px">${o}</button>`).join("")}</div></div>`;
{ const st = el.querySelector(".place-stim"), c = st && st.querySelector(".ps-in"); if(c){ const maxH = window.innerHeight * 0.36, f = Math.min(1, st.clientWidth / Math.max(1, c.scrollWidth), maxH / Math.max(1, c.scrollHeight)); if(f < 1){ c.style.transform = `scale(${f})`; c.style.transformOrigin = "center top"; st.style.height = (c.scrollHeight * f) + "px"; } } }
if(tr.say) speakText(tr.say || String(tr.prompt || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()); const rp = document.getElementById("placeRep"); if(rp) rp.onclick = () => speakText(tr.say || String(tr.prompt || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
el.querySelectorAll("[data-po-a]").forEach(b => b.onclick = () => { if(R.answered === myItem) return; const right = Number(b.dataset.poA) === tr.ans, ok = right && (!lim || performance.now() - t0 <= lim); b.classList.add(right ? "ok" : "bad"); answer(ok, right);   /* KURAL: doğru seçilen cevap hiçbir zaman kırmızı (yanlış) gösterilmez; süre sınırını aşan doğru cevap yeşil görünür, yalnız puanda geçmez */ }); return; }
if(d.kind === "cups"){ /* Göz takip: yıldız bir bardağın altında; bardaklar yer değiştirir, çocuk gözüyle izler */
  const C = [2,3,3,4,4,4][TT], S = [2,3,4,5,7,9][TT], ms = [800,680,540,480,400,340][TT]; /* KURAL: en kolay basamak 2 bardak; 4 → 3 → 2 bardağa iner */
  const W = Math.min(window.innerWidth - 40, 340), cw = Math.min(84, (W - 14 * (C - 1)) / C), gap = (W - cw * C) / (C - 1); const star = Math.floor(Math.random() * C); const slot = Array.from({length: C}, (_, i) => i);
  const cupSVG = gimg("cupDown") ? `<img src="${gimg("cupDown")}" alt="" style="width:100%;height:100%;object-fit:contain;object-position:bottom;pointer-events:none;filter:drop-shadow(0 4px 3px rgba(0,0,0,.2))">` : `<svg viewBox="0 0 60 70" width="100%" height="100%" aria-hidden="true"><path d="M8 66 L52 66 L44 8 L16 8 Z" fill="#E8894C" stroke="#B4532A" stroke-width="3" stroke-linejoin="round"/><rect x="12" y="3" width="36" height="9" rx="4.5" fill="#B4532A"/></svg>`;   /* KURAL: Değerlendirme turundaki bardak, Bardak Oyunu'ndaki resimle aynıdır */
  el.innerHTML = `<div class="adv-wrap">${head}<div class="place-q pq-stable"><span>Yıldızı <b>gözünle izle</b>: hangi bardağın altında?</span></div><div id="cupsBox" style="position:relative;width:${W}px;height:${Math.round(cw * 1.9)}px;margin:28px auto 0">${slot.map(i => `<button type="button" class="cupw" data-cup="${i}" aria-label="Bardak ${i + 1}" style="position:absolute;left:${Math.round(i * (cw + gap))}px;bottom:0;width:${cw}px;height:${Math.round(cw * 1.9)}px;background:none;border:0;padding:0;transition:left ${Math.round(ms * 0.85)}ms ease-in-out">${i === star ? `<span style="position:absolute;left:0;right:0;bottom:2px;text-align:center;font-size:${Math.round(cw * 0.55)}px;line-height:1">⭐</span>` : ""}<span class="cup" style="position:absolute;left:0;bottom:0;width:${cw}px;height:${Math.round(cw * 1.15)}px;transition:transform 300ms ease;transform:translateY(-${Math.round(cw * 0.7)}px);z-index:2">${cupSVG}</span></button>`).join("")}</div></div>`;
  const ws = [...el.querySelectorAll(".cupw")]; let ready = false; const alive = () => placeRun === R && R.item === myItem;
  const setLeft = () => ws.forEach((w, i) => { w.style.left = Math.round(slot[i] * (cw + gap)) + "px"; });
  setTimeout(() => { if(!alive()) return; ws.forEach(w => w.querySelector(".cup").style.transform = "translateY(0)");
    let k = 0; const swap = () => { if(!alive()) return; if(k >= S){ ready = true; const q = el.querySelector(".place-q"); if(q) q.innerHTML = "<span>Yıldız hangi bardağın altında? <b>Dokun</b></span>";   /* yazı tek bir öğe içinde: kelimeler sütunlara bölünüp üst üste binmez */ return; } let a = Math.floor(Math.random() * C), b = Math.floor(Math.random() * (C - 1)); if(b >= a) b++; const t = slot[a]; slot[a] = slot[b]; slot[b] = t; setLeft(); k++; setTimeout(swap, ms); };
    setTimeout(swap, 600); }, 1400);
  ws.forEach((w, i) => w.onclick = () => { if(!ready || R.answered === myItem) return; ready = false; w.querySelector(".cup").style.transform = `translateY(-${Math.round(cw * 0.7)}px)`; if(i !== star) setTimeout(() => { ws[star].querySelector(".cup").style.transform = `translateY(-${Math.round(cw * 0.7)}px)`; }, 350); setTimeout(() => answer(i === star), 900); });
  return; }
if(d.kind === "listen"){ /* Sözel bellek: sözcükleri dinler, duyduğu resimlere dokunur */
  const K = [2,3,3,4,5,6][TT], P = placeNamedPool(), words = P.slice(0, K), opts = shuffleArray(words.concat(P.slice(K, K + (pre ? 2 : 3)))); R.cur = { words, opts };
  el.innerHTML = `<div class="adv-wrap">${head}<div class="place-q">İyi <b>dinle</b>…</div><div style="width:120px;height:120px;margin:28px auto" aria-hidden="true">${zihniSVG("listen")}</div></div>`;
  const say = words.map(x => x.n).join(", "); setTimeout(() => { if(placeRun === R && R.item === myItem) speakText(say); }, 300);
  setTimeout(() => { if(!(placeRun === R && R.item === myItem)) return; let found = 0, over = false;
    el.innerHTML = `<div class="adv-wrap">${head}<div class="place-q">Duyduğun <b>resimlere</b> dokun (${K})</div><div class="place-opts" style="grid-template-columns:repeat(3, 96px)">${opts.map((x, i) => `<button type="button" class="wm-pic" data-po-l="${i}" style="width:96px;height:96px;padding:5px">${qzPic(x.src)}</button>`).join("")}</div></div>`;
    el.querySelectorAll("[data-po-l]").forEach(b => b.onclick = () => { if(over || b.classList.contains("ok")) return; const x = opts[Number(b.dataset.poL)]; if(words.includes(x)){ b.classList.add("ok"); found++; if(found >= K){ over = true; answer(true); } } else { b.classList.add("bad"); over = true; answer(false); } }); }, 900 + K * (pre ? 1000 : 800));
  return; }
const pool = placePool();
if(d.kind === "span"){ const K = [2,3,4,4,5,6][TT], seq = pool.slice(0, K), opts = shuffleArray(seq.concat(pool.slice(K, K + (pre ? 2 : 3)))); R.cur = { seq, opts }; let k = 0;
const show = () => { if(!(placeRun === R && R.item === myItem)) return; if(k < seq.length){ el.innerHTML = `<div class="adv-wrap">${head}<div class="place-q">Sırayı aklında tut…</div><div class="wm-card" style="width:170px;height:170px;margin:20px auto;padding:8px">${qzPic(seq[k].src)}</div></div>`; k++; setTimeout(show, pre ? 1300 : 1050); return; }
let pos = 0; el.innerHTML = `<div class="adv-wrap">${head}<div class="place-q">Gördüğün <b>sırayla</b> dokun</div><div class="place-opts" style="grid-template-columns:repeat(3, 96px)">${opts.map((x, i) => `<button type="button" class="wm-pic" data-po-s="${i}" style="width:96px;height:96px;padding:5px">${qzPic(x.src)}</button>`).join("")}</div></div>`;
el.querySelectorAll("[data-po-s]").forEach(b => b.onclick = () => { if(pos < 0) return; const x = opts[Number(b.dataset.poS)]; if(x === seq[pos]){ b.classList.add("ok"); pos++; if(pos >= seq.length){ pos = -1; answer(true); } } else { b.classList.add("bad"); pos = -1; answer(false); } }); };
show(); return; }
const N = [1,2,3,4,5,6][TT], seen = pool.slice(0, N), tgt = randomItem(seen)   /* görsel bellek: basamak başına resim sayısı 1…6 (okul sonrası Başlangıç 4; gerekirse 3 → 2 → 1) */, opts = shuffleArray([tgt].concat(pool.slice(N, N + (pre ? 2 : 3)))); if(R.lastIdx != null && opts.indexOf(tgt) === R.lastIdx){ const j = (R.lastIdx + 1 + Math.floor(Math.random() * (opts.length - 1))) % opts.length; [opts[R.lastIdx], opts[j]] = [opts[j], opts[R.lastIdx]]; } R.lastIdx = opts.indexOf(tgt); R.cur = { tgt, opts };
el.innerHTML = `<div class="adv-wrap">${head}<div class="place-q">Resimlere iyi bak…</div>${(() => { const vc = N === 4 ? 2 : Math.min(N, 3), vs = Math.min(104, Math.floor((window.innerWidth - 60) / vc)); return `<div class="place-opts" style="grid-template-columns:repeat(${vc}, ${vs}px)">${seen.map(x => `<div class="wm-card" style="width:${vs}px;height:${vs}px;padding:5px">${qzPic(x.src)}</div>`).join("")}</div>`; })()}</div>`;
setTimeout(() => { if(!(placeRun === R && R.item === myItem)) return; el.innerHTML = `<div class="adv-wrap">${head}<div class="place-q">Bunlardan hangisi <b>vardı</b>?</div><div class="place-opts" style="grid-template-columns:repeat(${Math.min(opts.length, 3)}, 96px)">${opts.map((x, i) => `<button type="button" class="wm-pic" data-po-v="${i}" style="width:96px;height:96px;padding:5px">${qzPic(x.src)}</button>`).join("")}</div></div>`;
el.querySelectorAll("[data-po-v]").forEach(b => b.onclick = () => { if(R.answered === myItem) return; const ok = opts[Number(b.dataset.poV)] === tgt; b.classList.add(ok ? "ok" : "bad"); answer(ok); }); }, (pre ? 1600 : 1100) * N); }
function placeFinish(){ const R = placeRun; placeRun = null; { const x = document.getElementById("placeX"); if(x) x.style.display = "none"; } const rec = { t: Date.now(), dom: R.res, items: R.items, base: R.base, qn: R.qn || {} }; placeSave(R.name, rec);
try{ if(gameProfile() === R.name){ const g = gxGet(); g.light = (g.light || 0) + 5; gxSave(g); } }catch(e){}
const el = document.getElementById("placeScreen");
el.innerHTML = `<div class="adv-wrap place-done" style="text-align:center"><div class="place-done-top"><div style="width:64px;height:64px;flex:0 0 64px">${zihniSVG("cheer")}</div><div style="text-align:left"><div class="mola-h" style="margin:0">Değerlendirme turu bitti!</div><div class="mola-s" style="margin:2px 0 0">Harikaydın! +5 ışık</div></div></div>
${placeTableHtml(R.res, { qn: R.qn || {} })}
<div class="fam-sub place-note">Yetişkin için: düzey yaşa göre değil, her alanda yapabildiğine göre belirlendi. Çalışmalar buradan başlar, sonra performansa göre kendiliğinden ayarlanır.</div>
<div class="mola-list" style="max-width:300px;margin:0 auto"><button type="button" id="placeDone" class="place-cta"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m7.5 12.5 3 3 6-6.5"></path></svg>Tamam</button></div></div>`;
speakText("Değerlendirme turu bitti! Harikaydın!");
document.getElementById("placeDone").onclick = () => { el.style.display = "none"; const px = document.getElementById("placeX"); if(px) px.style.display = "none"; placeAfterClose(); try{ renderPlaceSettings(); }catch(e){} }; }
function renderPlaceSettings(){ const box = document.getElementById("placeSettingsBox"); if(!box) return; const nm = (currentPlayerName || "").trim();
if(!nm || nm === "Misafir"){ box.innerHTML = `<span style="font-size:12px;font-weight:600;color:var(--ink-soft)">Önce bir kişi seçin.</span>`; return; }
const p = placeGet(nm);
box.innerHTML = `<div style="font-size:13px;font-weight:700">${escHTML(nm)}</div>${p ? `<div style="margin:8px 0 4px">${placeTableHtml(p.dom)}</div><div style="font-size:12px;font-weight:600;color:var(--ink-soft);margin:4px 0">${placeSummary(p)} · ${new Date(p.t).toLocaleDateString("tr-TR")}</div>` : `<div style="font-size:12px;font-weight:600;color:var(--ink-soft);margin:4px 0">Henüz değerlendirme turu yapılmadı.</div>`}
<button type="button" class="fam-chip" id="placeRunBtn">${p ? "Yeniden değerlendir" : "Değerlendirme turunu başlat"}</button>`;
document.getElementById("placeRunBtn").onclick = () => placeStart(nm); }

const GR_CATS = () => CATEGORIES.filter(c => !c.hidden && c.id !== "goz-takip");
function growthData(name, groups){ groups = groups || GR_CATS(); const nm = (name || "").trim(), since = Date.now() - 28 * 864e5, mid = Date.now() - 14 * 864e5;
const recs = loadSessions().filter(r => r.player === nm && r.t >= since);
const catOfLabel = (lb) => { const ex = EXERCISES.find(e => e.label === lb || (e.oldLabels || []).includes(lb)); return ex ? (CATEGORIES.find(c => !c.hidden && c.exerciseIds.includes(ex.id)) || {}).id : null; };
const tierIx = (lb) => Math.max(0, TIERS.findIndex(x => x.label === lb));
const stepOf = (r) => (r.lvl === "pre" ? 0 : 3) + tierIx(r.tier);   /* okul öncesi ve okul sonrası tek ölçekte (0–5): kademe değişse de ilerleme doğru okunur */
const gsAll = gameStoreAll()[nm] || {}, gsOf = (c) => gsAll[(() => { try{ return c.okul ? (readingLevel === "pre" ? "pre" : "post") : catLevelFor(c.id, nm); }catch(e){ return readingLevel === "pre" ? "pre" : "post"; } })()] || {};   /* yıldızlar kategorinin kademesinden */
const exOfLabel = (lb) => { const ex = EXERCISES.find(e => e.label === lb || (e.oldLabels || []).includes(lb)); return ex ? ex.id : null; };
return groups.map(c => { const rs = recs.filter(r => c.okul ? c.exerciseIds.includes(exOfLabel(r.exerciseLabel)) : catOfLabel(r.exerciseLabel) === c.id), ok = (r) => (r.errors || 0) <= 1;
const early = rs.filter(r => r.t < mid), late = rs.filter(r => r.t >= mid), rate = (a) => a.length ? a.filter(ok).length / a.length : null, avgT = (a) => a.length ? a.reduce((s, r) => s + stepOf(r), 0) / a.length : null;
let lvlNow = null, lvlBy = null; try{ if(!c.okul){ const inf = catLevelInfo(c.id, nm); lvlNow = inf.lvl; lvlBy = inf.by; } }catch(e){}
const lastRec = rs.length ? rs.reduce((a, b) => b.t > a.t ? b : a) : null, tierNow = lastRec && (!lvlNow || lastRec.lvl === lvlNow) ? tierIx(lastRec.tier) : null;
const gs = gsOf(c); const stars = c.exerciseIds.reduce((s, id) => s + ((gs[id] && gs[id].stars) ? gs[id].stars.filter(Boolean).length : 0), 0), crowns = c.exerciseIds.filter(id => gs[id] && gs[id].crown).length;
const n = rs.length, R = rate(rs), up = (avgT(late) != null && avgT(early) != null && avgT(late) - avgT(early) >= 0.5) || (rate(late) != null && rate(early) != null && rate(late) - rate(early) >= 0.2);
const days = n ? (Math.max(...rs.map(r => r.t)) - Math.min(...rs.map(r => r.t))) / 864e5 : 0;
const base = lvlNow === "pre" ? 0 : (lvlNow === "post" ? 3 : 0);   /* "güçlü": kendi kademesinde en az Orta düzeyde, tutarlı başarı */
let st = "az"; if(n + stars >= 3){ if(n >= 3 && R >= 0.75 && avgT(rs) >= base + 1 || crowns > 0 || (n < 3 && stars >= 6)) st = "guclu"; else if(up) st = "gelisiyor"; else st = "pratik"; }
const support = n >= 5 && days >= 14 && R < 0.4 && !up;
return { c, n, stars, crowns, st, support, R, lvlNow, lvlBy, tierNow }; }); }
const GR_TXT = { guclu:["Güçlü yön","t2"], gelisiyor:["Gelişiyor","t1"], pratik:["Pratik sürüyor","t0"], az:["Henüz az veri","tz"] };
/* KURAL (Gelişim haritası): son güncellemelere göre — her alanda şu anki kademe ve düzey (kategori kademesi + son kayıt), ilerleme okul öncesi/okul sonrası tek ölçekte hesaplanır,
   "Süren çalışmalar" (uzman ödevleri, açık gelişim ödevleri, bugünün etkinlikleri, bekleyen kademe önerileri) ve son Değerlendirme turu tablosu (tarih + o günden bu yana değişen alanlar) gösterilir */
/* KURAL (Gelişim haritası görünümü): bölüm başlıkları dokununca açılır/kapanır; emoji yerine uygulamanın renk paletinde çizgi simgeler; zemin ve kartlar ana sayfayla aynı renk düzeninde */
function grIc(k, col, bg){ return `<span class="gr-ic" style="background:${bg};color:${col}">${icI(k, 18, col)}</span>`; }
const GR_OPEN = new Set();
/* KURAL (açılır bölümler): Gelişim haritası ve Etkinlik Raporları'nda başlıklar dokununca açılır; bir bölüm açılınca açık olan diğeri kapanır */
let RP_OPEN = { recent: null, summary: null };
function rpAccordion(container, kind, itemSel, headSel, keyOf){ try{ const items = [...container.querySelectorAll(itemSel)]; items.forEach(it => { const head = it.querySelector(headSel); if(!head) return; it.classList.add("rp-acc"); head.classList.add("rp-head"); if(!head.querySelector(".rp-chev")) head.insertAdjacentHTML("beforeend", '<span class="rp-chev" aria-hidden="true"></span>'); const k = keyOf(it); if(RP_OPEN[kind] === k) it.classList.add("open");
  head.setAttribute("role", "button"); head.tabIndex = 0; head.onclick = () => { const willOpen = !it.classList.contains("open"); items.forEach(o => o.classList.remove("open")); if(willOpen){ it.classList.add("open"); RP_OPEN[kind] = k; } else RP_OPEN[kind] = null; }; }); }catch(e){} }
function grSec(id, icon, col, bg, title, body){ return `<details class="gr-acc" data-sec="${id}"${GR_OPEN.has(id) ? " open" : ""}><summary>${grIc(icon, col, bg)}<span class="gr-acc-t">${title}</span><span class="gr-chev" aria-hidden="true"></span></summary><div class="gr-acc-b">${body}</div></details>`; }
function growthOngoingHtml(nm){ try{ const rows = []; const lv = famLvl();
  let prog = null; try{ prog = typeof familyProgram === "function" ? familyProgram() : null; }catch(e){}
  if(appMode === "uzman"){ try{ const l = expertLinkForChild(nm); if(l && l.program) prog = l.program; }catch(e){} }
  const hw = (prog && Array.isArray(prog.hw) ? prog.hw : []).filter(id => exerciseById(id));
  if(hw.length) rows.push(`<div class="gr-row"><div><b>Uzman ödevleri</b><span>${hw.map(id => escHTML(exerciseById(id).label)).join(", ")}</span></div><em class="t1">${hw.length} ödev</em></div>`);
  let dev = null; try{ dev = devPlanGet(nm, lv); }catch(e){} const open = dev && Array.isArray(dev.items) ? dev.items.filter(it => exerciseById(it.id)) : [];
  if(open.length) rows.push(`<div class="gr-row"><div><b>Önerilen çalışmalar</b><span>${open.map(it => escHTML(exerciseById(it.id).label) + " (" + escHTML((CATEGORIES.find(c => c.id === it.cat) || {}).label || "") + ")").join(", ")}</span></div><em class="t1">${open.length} açık</em></div>`);
  if(prog && prog.target){ const tc = CATEGORIES.find(c => c.id === prog.target) || OKUL_SKILLS.find(c => c.id === prog.target); if(tc) rows.push(`<div class="gr-row"><div><b>Program hedefi</b><span>${escHTML(tc.label)}${(prog.days || []).length ? " · " + prog.days.map(d => DAY_SHORT[d]).join(", ") : ""}</span></div><em class="t0">Program</em></div>`); }
  else { try{ const tg = typeof famTarget === "function" ? famTarget() : null; const tc = tg && (CATEGORIES.find(c => c.id === tg) || OKUL_SKILLS.find(c => c.id === tg)); if(tc && appMode === "aile") rows.push(`<div class="gr-row"><div><b>Bugünün etkinlikleri</b><span>Hedef alan: ${escHTML(tc.label)}</span></div><em class="t0">Bu hafta</em></div>`); }catch(e){} }
  const pend = (typeof catPendingList === "function" ? catPendingList(nm) : []).map(p => { const c = CATEGORIES.find(x => x.id === p.catId); return c ? escHTML(c.label) + " → " + (p.target === "pre" ? "Okul Öncesi" : "Okul Sonrası") : ""; }).filter(Boolean);
  if(pend.length) rows.push(`<div class="gr-row"><div><b>Okul dönemi önerisi bekliyor</b><span>${pend.join(", ")}</span></div><em class="t1">Karar bekliyor</em></div>`);
  return grSec("suren", "blocks", "#5A2D8C", "#EEE6FA", "Süren çalışmalar", rows.length ? `<div class="gr-list">${rows.join("")}</div>` : `<div class="fam-sub" style="font-weight:600;margin:4px 0">Şu an açık ödev ya da program yok.</div>`); }catch(e){ return ""; } }
function growthPlaceCompare(nm, P){ try{ const ch = []; CATEGORIES.filter(c => !c.hidden).forEach(c => { const d = placeDomFor(c.id); const v = d && P.dom ? P.dom[d.k] : null; if(typeof v !== "number") return; const now = catLevelFor(c.id, nm), was = v < 3 ? "pre" : "post"; if(now !== was) ch.push(`${escHTML(c.label)}: ${was === "pre" ? "Okul Öncesi" : "Okul Sonrası"} → ${now === "pre" ? "Okul Öncesi" : "Okul Sonrası"}`); });
  return ch.length ? `O günden bu yana okul dönemi değişen alanlar: ${ch.join(" · ")}` : "Tüm alanlar hâlâ değerlendirmedeki okul döneminde çalışıyor."; }catch(e){ return ""; } }
function showGrowth(){ const nm = famProfile(); let el = document.getElementById("growthScreen"); if(!el){ el = document.createElement("div"); el.id = "growthScreen"; document.body.appendChild(el); }
const D = growthData(nm), strong = D.filter(x => x.st === "guclu").map(x => x.c.label), grow = D.filter(x => x.st === "gelisiyor").map(x => x.c.label), sup = D.filter(x => x.support), P = placeGet(nm);
const linked = typeof familyLinkLocal === "function" && familyLinkLocal();
el.innerHTML = `<div class="adv-wrap"><div class="adv-top"><button type="button" class="mola-x" data-gr="close">✕</button><div><div class="adv-t1">Son 4 hafta</div><div class="adv-t2">${escHTML(nm)} · gelişim haritası</div></div></div>
<div class="gr-sum">${strong.length ? `<div class="gr-sl">${grIc("star", "#E0A100", "#FFF4D6")}<span><b>Güçlü yönler:</b> ${strong.join(", ")}</span></div>` : ""}${grow.length ? `<div class="gr-sl">${grIc("sprout", "#1B7A45", "#DDF5E7")}<span><b>Gelişen alanlar:</b> ${grow.join(", ")}</span></div>` : ""}${!strong.length && !grow.length ? `<div>Birkaç gün düzenli çalıştıkça burada çocuğunuzun güçlü yönleri ve gelişen alanları görünecek.</div>` : ""}</div>
${sup.length ? `<div class="gr-note"><b>Bir öneri:</b> ${sup.map(x => x.c.label).join(", ")} alanında bir süredir zorlanma görünüyor. Bu bir değerlendirme ya da tanı değildir; çocuklar farklı hızlarda gelişir. İsterseniz bu özeti bir çocuk gelişim uzmanı, özel eğitim öğretmeni ya da dil ve konuşma terapistiyle paylaşabilirsiniz.${linked ? ` <i>Uzmanınız bu sonuçları görebiliyor.</i>` : `<button type="button" class="fam-cta ghost" data-gr="link" style="margin-top:8px">Uzmana bağlan</button>`}</div>` : ""}
${grSec("alanlar", "pin", "#0A847E", "#DDF3F0", "Alanlar · şu anki çalışma düzeyi", `<div class="gr-list">${D.map(x => `<div class="gr-row"><div><b>${x.c.label}</b><span>${x.lvlNow ? `<i class="gr-lv ${x.lvlNow}">${x.lvlNow === "pre" ? "Okul Öncesi" : "Okul Sonrası"}${x.tierNow != null ? " · " + TIERS[x.tierNow].label.replace(" Düzey", "") : ""}</i>` : ""}${x.n ? `${x.n} çalışma` : ""}${x.n && x.stars ? " · " : ""}${x.stars ? `${x.stars} ${icI("star", 13, "#E0A100")}` : ""}${x.crowns ? ` · ${x.crowns} taç` : ""}</span></div><em class="${GR_TXT[x.st][1]}">${GR_TXT[x.st][0]}</em></div>`).join("")}</div>`)}
${growthOngoingHtml(nm)}
  ${(() => { const O = growthData(nm, OKUL_SKILLS).filter(x => famExIds(x.c.id).length >= 3); return grSec("okul", "book", "#9A6B00", "#FFF1D6", "Okul becerileri", `<div class="gr-list">${O.map(x => `<div class="gr-row"><div><b>${x.c.label}</b><span>${x.n ? `${x.n} çalışma` : ""}${x.n && x.stars ? " · " : ""}${x.stars ? `${x.stars} ${icI("star", 13, "#E0A100")}` : ""}</span></div><em class="${GR_TXT[x.st][1]}">${GR_TXT[x.st][0]}</em></div>`).join("")}</div><div class="fam-sub" style="font-weight:600;margin:6px 0">Bir okul becerisini günlük oturumun hedefi yapmak için “Bugünün etkinlikleri” ekranında hedef alanı değiştirin.</div>`); })()}
${P ? grSec("degerlendirme", "clip", "#1E5FA8", "#DDF1FF", `Son değerlendirme turu · ${new Date(P.t).toLocaleDateString("tr-TR")}`, `${placeTableHtml(P.dom)}<div class="fam-sub" style="font-weight:600;margin:6px 0 4px">${growthPlaceCompare(nm, P)}</div>`) : grSec("degerlendirme", "clip", "#1E5FA8", "#DDF1FF", "Değerlendirme turu", `<div class="fam-sub" style="font-weight:600;margin:4px 0">Henüz yapılmadı. Ana sayfadaki “Değerlendirme turu” ile her alanın başlangıç okul dönemi ve düzeyi belirlenir.</div>`)}
<div class="fam-sub" style="font-weight:600;margin:10px 0 20px">Bu sayfa çocuğunuzun uygulamadaki çalışmalarını özetler; başka çocuklarla karşılaştırma yapmaz ve tanı koymaz.</div></div>`;
el.style.display = "flex"; el.scrollTop = 0;
el.querySelectorAll("details.gr-acc").forEach(d => d.addEventListener("toggle", () => { if(d.open){ GR_OPEN.clear(); GR_OPEN.add(d.dataset.sec); el.querySelectorAll("details.gr-acc[open]").forEach(o => { if(o !== d) o.open = false; }); } else GR_OPEN.delete(d.dataset.sec); }));   /* bir bölüm açılınca diğeri kapanır */
el.querySelectorAll("[data-gr]").forEach(b => b.onclick = () => { el.style.display = "none"; if(b.dataset.gr === "link"){ try{ showLinkScreen(); }catch(e){} } }); }

/* ===== Yürütücü İşlev · Paket 1 (Ketleme A) · veri ve yardımcılar ===== */
/* Yetişkinin okuduğu komut/soru listesi: çocuk ekrana bakmaz, yetişkin Hata sayısı −/+ ile puanlar (Benzerlik Bulma sistemi) */
function efAudList(rows, note){ return `<div class="aud-list"><div class="aud-note">${note}</div>` + rows.map((r, i) => `<div class="aud-row"><div class="aud-num">${i + 1}</div><div class="aud-body" style="display:flex;align-items:center;gap:10px">${r.img ? `<div style="flex:none;width:58px;height:58px;border-radius:10px;background:#F2F5F8;display:flex;align-items:center;justify-content:center;gap:2px">${r.img}</div>` : ""}<div style="min-width:0"><div style="font-size:17px;font-weight:800;line-height:1.3">${r.q}</div>${r.a ? `<div class="aud-key">${r.a}</div>` : ""}</div></div></div>`).join("") + `</div>`; }
/* Uymayan Kelimeyle Tamamla (Hayling): düzey başına 24 cümle; son kelime kuvvetle öngörülür. Başlangıç kısa ve basit, Orta günlük neden–sonuç, Zor iki parçalı cümle */
const HAYL_SENT = {
0: [["Kuşlar gökyüzünde …","uçar"],["Balıklar suda …","yüzer"],["Sabahları güneş …","doğar"],["Kışın gökten kar …","yağar"],["Acıkınca yemek …","yeriz"],["Susayınca su …","içeriz"],["Gece yatakta …","uyuruz"],["Köpek hav hav …","havlar"],["İnek bize süt …","verir"],["Ayakkabıyı ayağımıza …","giyeriz"],["Şapkayı başımıza …","takarız"],["Okulda öğretmen ders …","anlatır"],["Topa ayağımızla …","vururuz"],["Yağmurda şemsiye …","açarız"],["Kitabı gözümüzle …","okuruz"],["Müziği kulağımızla …","dinleriz"],["Çiçekleri burnumuzla …","koklarız"],["Yemeği ağzımızla …","yeriz"],["Kalemle kâğıda …","yazarız"],["Makasla kâğıdı …","keseriz"],["Uyumadan önce dişlerimizi …","fırçalarız"],["Soğukta mont …","giyeriz"],["Arabayı şoför …","sürer"],["Doktor hastaya ilaç …","verir"]],
1: [["Kuşlar kışın sıcak ülkelere …","göç eder / gider"],["Yağmur yağınca yerler …","ıslanır"],["Güneş batınca ortalık …","kararır"],["Buz güneşte kalınca …","erir"],["Hamur fırında pişince …","kabarır / ekmek olur"],["Bebek acıkınca …","ağlar"],["Çaydanlıktaki su kaynayınca …","fokurdar / buhar çıkar"],["Balon fazla şişince …","patlar"],["Sonbaharda yapraklar …","sararır / dökülür"],["Kırmızı ışıkta arabalar …","durur"],["Yeşil ışıkta yayalar karşıya …","geçer"],["Çiçekleri sulamayınca …","solar / kurur"],["Kedi fareyi görünce …","kovalar"],["Fare kediyi görünce …","kaçar"],["Yorulunca biraz …","dinleniriz"],["Hasta olunca doktora …","gideriz"],["Ellerimiz kirlenince sabunla …","yıkarız"],["Karanlıkta görmek için lambayı …","yakarız / açarız"],["Öğretmen soru sorunca parmak …","kaldırırız"],["Kış gelince ağaçlar yapraklarını …","döker"],["Tohumu toprağa ekince …","filizlenir / büyür"],["Sınıfa girince öğretmene günaydın …","deriz"],["Bir hata yapınca özür …","dileriz"],["Kapı çalınca kapıyı …","açarız"]],
2: [["Çok koştuğu için nefes nefese kaldı ve bir bankta oturup …","dinlendi"],["Sabah alarmı duymadığı için okula …","geç kaldı"],["Hava çok soğuktu, bu yüzden gölün üstü …","buz tuttu / dondu"],["Pastayı fırından erken çıkardı, pasta tam …","pişmemişti"],["Kalemi yere düştü ve ucu …","kırıldı"],["Yağmur birden bastırınca şemsiyesi olmayanlar sırılsıklam …","ıslandı"],["Bütün gece ders çalıştığı için sabah çok …","yorgundu / uykusuzdu"],["Kediyi görünce korkan fare hemen deliğine …","kaçtı / saklandı"],["Çiçekleri bir hafta sulamayınca hepsi …","soldu / kurudu"],["Buzdolabının fişi çekilince dondurmalar …","eridi"],["Bardağı masanın kenarına koyunca bardak düşüp …","kırıldı"],["Gözlüğünü evde unuttuğu için yazıları …","okuyamadı"],["Çok fazla şeker yediği için dişi …","ağrıdı / çürüdü"],["Anahtarını kaybettiği için eve …","giremedi"],["Tuzu şekerle karıştırınca çay …","tuzlu oldu"],["Lastiği patlayınca bisikletle devam …","edemedi"],["Telefonun şarjı bitince ekran …","karardı / kapandı"],["Kütüphanede herkes sessizdi, o yüzden fısıltıyla …","konuştular"],["Güneşte uzun süre kalınca cildi …","yandı / kızardı"],["Balonun ipini bırakınca balon gökyüzüne …","uçtu"],["Yolu bilmediği için haritaya …","baktı"],["Ekmeği uzun süre açıkta bırakınca ekmek …","bayatladı / küflendi"],["Işıkları açık unuttuğu için elektrik faturası çok …","yüksek geldi"],["Kar yağınca çocuklar bahçede kardan adam …","yaptı"]]
};
function haylTrials(){ const t = Math.min(currentCombo().t, 2), pool = shuffleArray(HAYL_SENT[t].map(x => ({ s: x[0], a: x[1] }))); return pool.slice(0, Math.min(pool.length, selCount())); }
/* Zihni Diyor ki: komut havuzu (hareket kartları; "yere otur" dışarıda) */
const SIMON_MOVES = [0, 1, 2, 3, 4, 5, 6];
function simonTrials(){ const t = Math.min(currentCombo().t, 2), N = selCount(), nL = Math.round(N * [0.3, 0.4, 0.5][t]);   /* tuzak oranı düzeyle artar */
  const flags = balancedSeq(N, [true, false], 2, [N - nL, nL]); let prev = -1;
  return flags.map(z => { const m = pickDifferent(SIMON_MOVES, prev); prev = m; return { m, zihni: z }; }); }
/* Tersini Yap (HTKS) ve El Oyunu (Luria): komut setleri; düzeyler eşleştirmeyi değiştirir */
const OPP_SETS = {
  htks: { parts: { bas:{ img:"cocuk_bas", say:"Başına dokun" }, ayak:{ img:"cocuk_ayak", say:"Ayağına dokun" }, omuz:{ img:"cocuk_omuz", say:"Omzuna dokun" }, diz:{ img:"cocuk_diz", say:"Dizine dokun" } },
          tiers: [ { bas:"ayak", ayak:"bas" }, { bas:"ayak", ayak:"bas", omuz:"diz", diz:"omuz" }, { bas:"diz", diz:"bas", omuz:"ayak", ayak:"omuz" } ], names: { bas:"baş", ayak:"ayak", omuz:"omuz", diz:"diz" }, len: [1, 1, 1] },
  hand: { parts: { yumruk:{ img:"el_yumruk", say:"Yumruk" }, parmak:{ img:"el_parmak", say:"Parmak" } },
          tiers: [ { yumruk:"parmak", parmak:"yumruk" }, { yumruk:"parmak", parmak:"yumruk" }, { yumruk:"parmak", parmak:"yumruk" } ], names: { yumruk:"yumruk", parmak:"parmak" }, len: [1, 2, 3] }
};
function oppKidText(set){ const t = Math.min(currentCombo().t, 2);
  if(set === "hand"){ const base = "Elimle sana yumruk ya da parmak göstereceğim. Sen tersini göster: ben yumruk gösterirsem sen parmak göster, ben parmak gösterirsem sen yumruk göster."; return t === 0 ? base : base + ` Arka arkaya ${t === 1 ? "iki" : "üç"} işaret göstereceğim; sen hepsinin tersini aynı sırayla göster.`; }
  return t === 2 ? "Sana bir yere dokunmanı söyleyeceğim; sen söylediğimin tersini yap: ‘başına dokun’ dersem dizine dokun, ‘dizine dokun’ dersem başına dokun. ‘Omzuna dokun’ dersem ayağına dokun, ‘ayağına dokun’ dersem omzuna dokun."
       : "Sana ‘başına dokun’ ya da ‘ayağına dokun’ diyeceğim. Sen söylediğimin tersini yap: ‘başına dokun’ dersem ayağına dokun, ‘ayağına dokun’ dersem başına dokun." + (t === 1 ? " Omuz ve diz de var: ‘omzuna dokun’ dersem dizine dokun, ‘dizine dokun’ dersem omzuna dokun." : ""); }
/* oppRuleText: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
function oppTrials(set){ const S = OPP_SETS[set], t = Math.min(currentCombo().t, 2), map = S.tiers[t], keys = Object.keys(map), L = S.len[t], N = Math.max(4, Math.round(selCount() / L));
  const stream = balancedSeq(N * L, keys, 2); const out = [];
  for(let i = 0; i < N; i++){ const seq = stream.slice(i * L, i * L + L).map(k => ({ k, img: S.parts[k].img })); const say = seq.map(x => S.parts[x.k].say).join(" – ") + (set === "htks" ? "!" : ""); const ans = seq.map(x => S.names[map[x.k]]).join(" – "); out.push({ seq, say, ans }); }
  return out; }
/* Hayvan Boyutu Stroop havuzları: gerçekte büyük / gerçekte küçük hayvanlar */
const SZ_BIG = () => [["fil", FLK_IMAGES.elephant], ["zürafa", WILD_IMAGES.giraffe], ["ayı", WILD_IMAGES.bear], ["aslan", WILD_IMAGES.lion], ["inek", FLK_IMAGES.cow], ["zebra", WILD_IMAGES.zebra], ["at", efImg("at")], ["deve", efImg("deve")], ["balina", efImg("balina")]].filter(x => x[1]);
const SZ_SMALL = () => [["fare", efImg("fare")], ["karınca", efImg("karinca")], ["uğur böceği", efImg("ugur_bocegi")], ["arı", PAL_EXTRA_IMAGES.bee], ["kelebek", OS_IMAGES.butterfly], ["tırtıl", OS_IMAGES.caterpillar], ["kirpi", WILD_IMAGES.hedgehog], ["sincap", WILD_IMAGES.squirrel], ["kurbağa", OS_IMAGES.frog], ["civciv", OS_IMAGES.chick]].filter(x => x[1]);
/* Ok–Kelime ve Ters Yöne Dokun: yön kümeleri ve konumlar */
const SP_WORD = { l:"SOL", r:"SAĞ", u:"YUKARI", d:"AŞAĞI" }, DIR_ARROW = { l:"◀", r:"▶", u:"▲", d:"▼" }, DIR_OPP = { l:"r", r:"l", u:"d", d:"u" };
const DIR_POS = { l:"left:14%;top:50%", r:"left:86%;top:50%", u:"left:50%;top:16%", d:"left:50%;top:84%" };
const spDirs = () => ["l","r","u","d"].slice(0, [2, 3, 4][Math.min(currentCombo().t, 2)]);
const atDirs = () => ["l","r","u","d"].slice(0, [2, 2, 4][Math.min(currentCombo().t, 2)]);
const dirButtons = (D) => D.map(d => ({ id: d, html: `<span style="font-size:32px;font-weight:900">${DIR_ARROW[d]}</span>` }));
/* Resme dokunarak seçim (iki taraflı çalışmalar): seçilen taraf belirgin yeşil/kırmızı; yanlışta doğru taraf yeşil çerçeve + kısa not */
function chSideAttr(id){ const st = chState; let bc = "#E6ECF2", sh = ""; if(st && st.phase === "feedback"){ const corr = st.spec.correct(st.trials[st.idx], st.ctx); if(id === st.picked){ bc = st.flash === "ok" ? "var(--good)" : "var(--bad)"; sh = st.flash === "ok" ? "box-shadow:0 0 0 4px rgba(31,164,99,.35);" : "box-shadow:0 0 0 4px rgba(229,72,77,.35);"; } else if(id === corr && st.flash === "bad"){ bc = "var(--good)"; sh = "box-shadow:0 0 0 4px rgba(31,164,99,.35);"; } }
  return `data-ch="${id}" style="flex:1;align-self:stretch;margin:2%;display:flex;align-items:center;justify-content:center;border:4px solid ${bc};border-radius:16px;box-sizing:border-box;cursor:pointer;position:relative;${sh}"`; }
function chSideNote(txt){ const st = chState; if(!st || st.phase !== "feedback" || st.flash !== "bad" || !txt) return ""; return `<b style="position:absolute;left:50%;bottom:3%;transform:translateX(-50%);background:var(--good);color:#fff;border-radius:999px;padding:3px 12px;font-size:13px;white-space:nowrap;pointer-events:none;box-shadow:0 2px 6px rgba(0,0,0,.2)">${txt}</b>`; }
/* sideButtons: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
/* ===== Yürütücü İşlev · Paket 2 (Ketleme B) · veri ve yardımcılar ===== */
/* KURAL (ana sayfalar): Uzman ve Aile sayfasının en üstünde sayfa adı ("Uzman Etkinlik Sayfası" / "Aile Etkinlik Sayfası", uygulamanın başlık yazı tipiyle); dört kısayol kartı iki satırda yan yana 2×2 düğme olarak durur */
/* KURAL (düzen): ilerleme noktaları (deneme göstergesi) ve yanındaki Isınma etiketi her zaman kartın içinde kalır — nokta sayısı artınca noktalar ve aralıklar küçülür, satır taşmaz */
/* KURAL (içerik uyumu): komutu kim veriyorsa (Ayı / Ejderha gibi) komut yazısı onun söz balonunda durur; hareket kartında yalnız hareketin resmi olur; çalışma yalnız dokunma üzerinedir ("dokun = yap" / "dokunmak yapmak demek" ifadeleri kullanılmaz) */
/* KURAL (tek görünüm): çalışma sayfaları dışındaki bütün yetişkin sayfaları ana sayfanın görünüşünü kullanır — açık turkuaz geçişli zemin, koyu turkuaz kalın başlık,
   beyaz kartlar (2 px açık kenarlık + 5 px alt kenar, 22 px köşe), kare beyaz kapat/geri düğmesi, turkuaz etkin sekme; çocuk oyun ekranları (adalar, mola, ödül) kendi görünüşünde kalır */
/* KURAL (tablet): yatay tablette çalışma sayfası iki sütun — solda başlık/yönerge/süre, sağda geniş etkinlik tahtası; dikey tablette içerik ekran genişliğini kullanır. Kenarlarda boş alan kalmaz. */
/* KURAL (tablet): dokunmalı çalışmaların (ızgara ve göz takibi dışındaki) içerikleri telefon genişliğine göre tasarlandı; tablette tahta genişliğine göre büyütülür (en çok 1,6 kat), ekrana sığmayacaksa küçültülmez ama taşmaz. Ölçek sayfa başına sabittir, aşama içinde zıplamaz. */
(function tabletFit(){ try{
  let k = 1, key = "", busy = false;
  const isTab = () => Math.min(innerWidth, innerHeight) >= 600 && Math.max(innerWidth, innerHeight) >= 960;
  const eligible = () => { try{ const ex = currentExercise(); if(!ex) return false; if(ex.isMotion || /^eye-/.test(ex.id)) return false; return !!(ex.isMt || ex.isRt || ex.isWm) && !ex.isChoice; }catch(e){ return false; } };
  const apply = () => { if(busy) return; const b = document.getElementById("board"); if(!b) return; busy = true; try{
    let w = b.querySelector(":scope > .tab-fit"); const want = isTab() && eligible();
    if(!want){ if(w){ while(w.firstChild) b.insertBefore(w.firstChild, w); w.remove(); } return; }
    if(!w || b.children.length > 1){ if(!w){ w = document.createElement("div"); w.className = "tab-fit"; } [...b.childNodes].filter(n => n !== w).forEach(n => w.appendChild(n)); if(!w.parentNode) b.appendChild(w); }
    const pk = (typeof currentIndex !== "undefined" ? currentIndex : "") + "|" + innerWidth + "x" + innerHeight;
    if(pk !== key){ key = pk; w.style.zoom = 1; w.style.width = "100%"; const bw = b.clientWidth - 16; let x0 = 1e9, x1 = -1e9; w.querySelectorAll("*").forEach(e => { if(e.children.length) return; const r = e.getBoundingClientRect(); if(r.width < 2 || r.height < 2) return; x0 = Math.min(x0, r.left); x1 = Math.max(x1, r.right); }); const cw = x1 > x0 ? x1 - x0 : bw, ch = Math.max(1, w.scrollHeight); const avail = innerHeight - b.getBoundingClientRect().top - 96;
      k = Math.min(1.6, Math.max(1, bw / cw)); if(ch * k > avail && avail > 200) k = Math.max(1, Math.min(k, avail / ch)); }   /* ölçek: gerçek içerik genişliği tahtaya sığacak kadar; yükseklik ekrana sığar */
    w.style.zoom = k; w.style.width = (100 / k) + "%"; w.style.margin = "0 auto";   /* yakınlaştırılmış kutu yine tahta genişliğinde kalır */
    if(k > 1){ const br = b.getBoundingClientRect(); let bad = b.scrollWidth > b.clientWidth + 2; if(!bad) w.querySelectorAll("*").forEach(e => { if(bad || e.children.length) return; const r = e.getBoundingClientRect(); if(r.width > 1 && (r.right > br.right + 2 || r.left < br.left - 2)) bad = true; });
      if(bad){ k = 1; w.style.zoom = 1; w.style.width = "100%"; } }   /* KURAL: büyütme hiçbir zaman taşmaya yol açmaz; taşarsa o sayfada büyütme kapanır */
  } finally { busy = false; } };
  const start = () => { const b = document.getElementById("board"); if(!b){ setTimeout(start, 400); return; } new MutationObserver(() => { if(!busy) requestAnimationFrame(apply); }).observe(b, { childList: true }); addEventListener("resize", () => { key = ""; apply(); }); };
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
}catch(e){} })();
/* KURAL (görsellik, aşama 1): çalışma sayfasında kartlara derinlik (üst parlak kenar, yumuşak gölge, çok hafif geçiş) ve alan renk kimliği (tahtanın üst şeridi, yönergenin sol kenarı, bölüm etiketleri alanın renginde).
   Uyaranın bulunduğu tahta zemini düz beyaz kalır; parlama/hareket uyarana eklenmez. "Sade görünüm" (html.calm) açıkken bu süsler kapanır. */
/* KURAL (tablet, çalışma sayfası dışı): tablette yetişkin sayfaları, Değerlendirme turu ve açılır pencereler ekranla orantılı ölçeklenir (dikeyde genişliğe, yatayda yüksekliğe göre; en çok 1,45 kat); içerik kenarlarda dar bir sütunda kalmaz, yazılar küçük kalmaz. Çalışma sayfaları ve çocuk oyun ekranları bu kuralın dışındadır. */
(function tabUi(){ try{
  const upd = () => { const w = innerWidth, h = innerHeight, tab = Math.min(w, h) >= 600 && Math.max(w, h) >= 960;   /* yatay tablette tarayıcı çubuğu yüksekliği düşürür (ör. 1280×690); tablet yine tablet sayılır */ const k = !tab ? 1 : (h >= w ? Math.min(1.45, Math.max(1, w / 560)) : Math.min(1.3, Math.max(1, Math.min(h / 540, w / 960)))); document.documentElement.classList.toggle("tabui", tab); document.documentElement.classList.toggle("tabui-ls", tab && w > h); document.documentElement.style.setProperty("--tabZ", k.toFixed(3)); };
  addEventListener("resize", upd); addEventListener("orientationchange", () => setTimeout(upd, 200)); upd();
  /* stil: zihin-stil.css */
}catch(e){} })();
/* KURAL (görsellik, aşama 2): çalışma sayfası ve oyun düğmeleri kabarık görünür (üstte parlak yansıma, altta koyu kenar) ve basınca içeri çöker; uyaran içeriğinin kendisine parlama eklenmez. "Sade görünüm"de kapalı; telefonun "hareketi azalt" ayarında çökme animasyonu yapılmaz. */
/* KURAL (görsellik, aşama 3): doğru cevapta seçilen öğe kısa bir "zıplama + ışıltı halkası", yanlışta kısa bir "sallanma" yapar (en çok 0,35 sn); standart yeşil/kırmızı ve ✓/✗ korunur; yalnız seçilen öğede, uyaranın kendisinde değil. Sade görünüm ve "hareketi azalt"ta kapalı. */
/* KURAL (diziliş, hızlı tepki): doğru tepki (sol/sağ, renk, şekil…) üst üste en çok 3 kez (iki seçenekli) ya da 2 kez (çok seçenekli) aynı gelir; denemelerin sırası buna göre değiştirilir (ilk deneme yerinde kalır) */
function chBreakRuns(){ try{ const st = chState, c = CHOICE[currentExercise().id]; if(!st || !Array.isArray(st.trials) || !c || !c.correct) return; const T = st.trials, key = (t) => { try{ const v = c.correct(t, st.cfg); return v == null ? null : String(v); }catch(e){ return null; } }; const vals = new Set(T.map(key).filter(v => v != null)); if(vals.size < 2) return; const lim = vals.size === 2 ? 3 : 2; const cur = [st.ti, st.i, st.idx, st.n].find(v => typeof v === "number"); const from = Math.max(1, (cur || 0) + 1);
  /* sol–sağ simetrik denemeler (ör. Sayı Stroop): taraf çevrilerek sol/sağ sayısı eşitlenir ve uzun diziler kırılır */
  const opp = (x) => x === "L" ? "R" : x === "R" ? "L" : x; const flip = (t) => { const L = t.L; t.L = t.R; t.R = L; ["valSide","moreSide","side","ans"].forEach(f => { if(t[f] === "L" || t[f] === "R") t[f] = opp(t[f]); }); };
  if(T.every(t => t && t.L && t.R)){ const idx = T.map((t, i) => i).filter(i => i >= from); let nl = T.filter(t => key(t) === "L").length, nr = T.filter(t => key(t) === "R").length; for(const i of shuffleArray(idx)){ if(Math.abs(nl - nr) <= 1) break; const k0 = key(T[i]); if((k0 === "L" && nl > nr) || (k0 === "R" && nr > nl)){ flip(T[i]); if(k0 === "L"){ nl--; nr++; } else { nr--; nl++; } } } for(let i = Math.max(from, 3); i < T.length; i++){ const k0 = key(T[i]); if(k0 && k0 === key(T[i-1]) && k0 === key(T[i-2]) && k0 === key(T[i-3])) flip(T[i]); } }
  const K = T.map(key); const runAt = (i) => { let r = 1; for(let j = i - 1; j >= 0 && K[j] === K[i]; j--) r++; return r; };
  for(let pass = 0; pass < 8; pass++){ let changed = false; for(let i = from; i < T.length; i++){ if(K[i] == null || runAt(i) <= lim) continue; for(let j = i + 1; j < T.length; j++){ if(K[j] == null || K[j] === K[i]) continue; const ti = T[i]; T[i] = T[j]; T[j] = ti; const ki = K[i]; K[i] = K[j]; K[j] = ki; changed = true; break; } } if(!changed) break; } }catch(e){} }
/* git–gitme çalışmalarında oturum "dokunma" denemesiyle başlamaz (Bağlamlı Tepki hariç: orada ilk resim tanım gereği hedef olamaz) */
function chFirstGo(){ try{ const st = chState, id = currentExercise().id, c = CHOICE[id]; if(!st || !Array.isArray(st.trials) || !c || !c.correct || id === "context-go") return; const isNo = (t) => { try{ return c.correct(t, st.cfg) == null; }catch(e){ return false; } }; if(!isNo(st.trials[0])) return; const j = st.trials.findIndex((t, i) => i > 0 && !isNo(t)); if(j > 0){ const tmp = st.trials[0]; st.trials[0] = st.trials[j]; st.trials[j] = tmp; } }catch(e){} }


/* KURAL (Değerlendirme turu görünümü): resimli uyaran beyaz kartta (açık renkli zeminde beyaz kare görünmez), içerik ekranın dikey ortasında */
/* Heykel (NEPSY Statue): süre ve çeldirici ses zamanları */
function statueCfg(){ const t = Math.min(currentCombo().t, 2), pre = isPre(), secs = (pre ? [30, 45, 60] : [45, 60, 75])[t], nD = (pre ? [2, 3, 4] : [3, 4, 6])[t]; const ds = []; for(let i = 0; i < nD; i++) ds.push(4000 + Math.random() * (secs * 1000 - 8000)); return { secs, ds: ds.sort((a, b) => a - b) }; }
const STATUE_SOUNDS = ["pop", "drop", "soft", "go"];
/* Bekle ve Bırak (hediye bekleme): tutma süresi ve çeldiriciler */
function holdTrials(){ const t = Math.min(currentCombo().t, 2), pre = isPre(), N = (pre ? [3, 4, 5] : [4, 5, 6])[t], secs = (pre ? [6, 9, 12] : [8, 12, 16])[t], nD = (pre ? [2, 3, 3] : [3, 4, 5])[t], pool = shuffleArray(picPool());
  return Array.from({length:N}, (_, i) => { const ds = []; for(let k = 0; k < nD; k++) ds.push({ at: 1200 + Math.random() * (secs * 1000 - 2600), side: k % 2 ? "right" : "left", y: 8 + Math.random() * 60, src: pool[(i * nD + k) % pool.length].src, snd: k % 2 === 0 }); return { secs, ds: ds.sort((a, b) => a.at - b.at) }; }); }
function holdDown(){ const st = mtState; if(!st || st.kind !== "hold" || st.phase !== "wait" || st.holding) return; const tr = st.trials[st.ti], my = st.ti; st.holding = true; st.t0 = performance.now();
  const b = document.getElementById("holdBtn"); if(b) b.classList.add("holding"); const bar = document.getElementById("holdBar"); if(bar){ bar.style.transition = `width ${tr.secs * (window.__wmSpeed || 1)}s linear`; requestAnimationFrame(() => { bar.style.width = "100%"; }); } const inf = document.getElementById("holdInfo"); if(inf) inf.innerHTML = "<b>Bırakma…</b> hediye açılana kadar tut";
  tr.ds.forEach(d => mtLater(() => { if(st.ti !== my || !st.holding) return; const lay = document.getElementById("holdDist"); if(lay){ const el = document.createElement("img"); el.src = d.src; el.alt = ""; el.className = "ef-dist"; el.style.cssText = `${d.side}:2%;top:${d.y}%;width:26%;height:26%;object-fit:contain;animation:efBlink .45s ease-in-out 2`; lay.appendChild(el); mtLater(() => { try{ el.remove(); }catch(e){} }, 900); } if(d.snd) sfx("pop"); }, d.at));
  mtLater(() => { if(st.ti !== my || !st.holding || st.phase !== "wait") return; st.holding = false; st.phase = "fb"; st.ok = true; st.okN++; sfx("solved"); renderMtBoard(); mtLater(NEW_MT.next, 1700); }, tr.secs * 1000); }
function holdUp(){ const st = mtState; if(!st || st.kind !== "hold" || st.phase !== "wait" || !st.holding) return; st.holding = false; st.phase = "fb"; st.ok = false; st.early = Math.max(1, Math.round((performance.now() - st.t0) / 1000 / (window.__wmSpeed || 1))); mtErr(); renderMtBoard(); mtLater(NEW_MT.next, 1500); }
(function initHoldPointer(){ try{ const board = document.getElementById("board"); if(!board) return;
  board.addEventListener("pointerdown", ev => { const b = ev.target.closest("[data-hold]"); if(!b) return; ev.preventDefault(); if(!timerRunning){ showLevelFlash("Önce ▶ Başlat'a basın.", "down"); return; } try{ b.setPointerCapture(ev.pointerId); }catch(e){} holdDown(); }, { passive:false });
  ["pointerup", "pointercancel"].forEach(n => board.addEventListener(n, () => { if(mtState && mtState.kind === "hold" && mtState.holding) holdUp(); }));
  board.addEventListener("contextmenu", ev => { if(ev.target.closest("[data-hold]")) ev.preventDefault(); }); }catch(e){} })();
/* Azı Seç (Less is More): tabak çiftleri ve ödül görselleri */
const LM_TREATS = () => [["kurabiye", efImg("kurabiye")], ["lolipop", efImg("lolipop")], ["çilek", FRUIT_VEG_IMAGES.strawberry], ["üzüm", FRUIT_VEG_IMAGES.grapes]].filter(x => x[1]);
const LM_PAIRS = { pre: [[[1, 3], [1, 4]], [[1, 4], [2, 5]], [[2, 5], [2, 6]]], post: [[[1, 4], [2, 5]], [[2, 6], [3, 6]], [[3, 7], [2, 7], [4, 8]]] };
function lmPlate(n, src, sz, mark, id){ const w = Math.round(sz * (n > 4 ? 0.17 : 0.22)); return `<div ${chSideAttr(id)}><div style="pointer-events:none;width:88%;aspect-ratio:1;max-height:88%;border-radius:50%;background:#F2F5F8;border:3px solid #C9D3DE;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;align-content:center;gap:2px;padding:6%;box-sizing:border-box">${Array.from({length:n}, () => `<img src="${src}" alt="" style="width:${w}px;height:${w}px;object-fit:contain">`).join("")}</div>${mark ? `<b style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:${mark.good ? "#1FA463" : "#E5484D"};color:#fff;border-radius:999px;padding:6px 14px;font-size:${Math.round(sz * 0.11)}px;white-space:nowrap;box-shadow:0 3px 8px rgba(0,0,0,.25)">+${mark.n}</b>` : ""}</div>`; }
/* Bağlamlı Tepki (AX-CPT): ipucu ve hedef hayvan Karıştır'da değişir */
let axCue = "dog", axTgt = "cat";
function axSeq(n, c){ const t = Math.min(currentCombo().t, 2), pAY = [0.2, 0.25, 0.3][t], pBX = [0.15, 0.2, 0.3][t]; let best = null;
  for(let tries = 0; tries < 40; tries++){ const seq = []; let prevCue = false, run = 0; for(let i = 0; i < n; i++){ let kind; const r = Math.random();
      if(prevCue) kind = r < 0.6 ? "X" : r < 0.6 + pAY ? "Y" : "A"; else kind = r < 0.45 ? "A" : r < 0.45 + pBX ? "X" : "Y";
      const go = kind === "X" && prevCue; if(go && run >= 2){ kind = "Y"; } run = (kind === "X" && prevCue) ? run + 1 : 0;
      const pic = kind === "A" ? c.cue : kind === "X" ? c.tgt : randomItem(c.others); seq.push({ k: pic, kind, go: kind === "X" && prevCue, prev: i ? seq[i - 1].k : null }); prevCue = kind === "A"; }
    const nGo = seq.filter(x => x.go).length, nBX = seq.filter(x => x.kind === "X" && !x.go).length; if(nGo >= n * 0.28 && nGo <= n * 0.45 && nBX >= 1) return seq; best = best || seq; }
  return best; }
/* ===== Yürütücü İşlev · Paket 3 (Esneklik) · veri ve yardımcılar ===== */
const FIST_COLORS = [[ACC.kirmizi,"kırmızı"], ["#0072B2","mavi"], ["#009E73","yeşil"], ["#E69F00","sarı"]], FIST_SHAPES = [["circle","daire"], ["square","kare"], ["triangle","üçgen"], ["star","yıldız"]], FIST_SIZES = [[1,"büyük"], [0.55,"küçük"]];
/* İki Yönden Eşle (FIST): B ortak kart; A–B renkte, B–C şekilde ortak; 3 boyutta A–C boyutta ortak */
function fistTrials(){ const t = Math.min(currentCombo().t, 2), pre = isPre(), N = (pre ? [4, 5, 6] : [6, 8, 10])[t], dims3 = t > 0, need = t === 2 ? 3 : 2;
  return Array.from({length:N}, () => { const cols = shuffleArray(FIST_COLORS).slice(0, 2), shs = shuffleArray(FIST_SHAPES).slice(0, 2), szs = dims3 ? shuffleArray(FIST_SIZES) : [FIST_SIZES[0], FIST_SIZES[0]];
    const A = { c: cols[0], s: shs[0], z: szs[0] }, B = { c: cols[0], s: shs[1], z: szs[1] }, C = { c: cols[1], s: shs[1], z: szs[0] };   /* A–B renk, B–C şekil, A–C boyut (3 boyutta) */
    const cards = shuffleArray([A, B, C].map((x, k) => Object.assign({ id: k }, x)));
    const pairs = [[0, 1, "renk"], [1, 2, "şekil"]].concat(dims3 ? [[0, 2, "boyut"]] : []);
    return { cards, pairs, need, found: [], sel: [] }; }); }
function fistPairKey(a, b){ return a < b ? a + "-" + b : b + "-" + a; }
/* Kuralı Söylemeden Değiştir (WCST mantığı): 4 anahtar kart, gizli kural, ardışık doğrudan sonra kural sessizce değişir */
const WC_KEYS = [{ c:ACC.kirmizi, s:"circle", n:1 }, { c:ACC.yesil, s:"triangle", n:2 }, { c:ACC.sari, s:"square", n:3 }, { c:ACC.mavi, s:"star", n:4 }];
/* WC_RULE_NAMES: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
function wcCfg(){ const t = Math.min(currentCombo().t, 2), pre = isPre(); return { rules: (pre ? [["c","s"], ["c","s"], ["c","s","n"]] : [["c","s"], ["c","s","n"], ["c","s","n"]])[t], K: pre ? [4, 4, 3][t] : [5, 5, 4][t], N: selCount() }; }
function wcCard(rules){ /* her boyutta farklı anahtarla eşleşen kart: kurala göre doğru anahtar değişir */ let g = 0; while(g++ < 200){ const ci = Math.floor(Math.random() * 4), si = Math.floor(Math.random() * 4), ni = Math.floor(Math.random() * 4); const m = { c: ci, s: si, n: ni }; const used = rules.map(r => m[r]); if(new Set(used).size === rules.length) return { c: WC_KEYS[ci].c, s: WC_KEYS[si].s, n: WC_KEYS[ni].n, m }; } return { c: WC_KEYS[0].c, s: WC_KEYS[1].s, n: WC_KEYS[2].n, m:{ c:0, s:1, n:2 } }; }
function wcCardSVG(card, px){ const n = card.n, s = Math.round(px * (n === 1 ? 0.6 : n === 2 ? 0.42 : 0.34)); return `<div style="width:${px}px;height:${px}px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;align-content:center;gap:2px">${Array.from({length:n}, () => `<svg viewBox="0 0 100 100" style="width:${s}px;height:${s}px">${sortShapeSVG(card.s, card.c)}</svg>`).join("")}</div>`; }
/* Hangisi Kazandırıyor? (ters öğrenme): yıldız veren resim, ölçüt sağlanınca değişir */
function revCfg(){ const t = Math.min(currentCombo().t, 2), pre = isPre(), pool = shuffleArray(picPool()).slice(0, 2); return { pics: pool, K: pre ? [4, 4, 3][t] : [4, 3, 3][t], maxRev: pre ? [1, 2, 3][t] : [2, 3, 4][t], N: selCount() }; }
/* Navon: küçük şekillerden oluşan büyük şekil */
const NV_SHAPES = ["circle", "square", "triangle"];
function navonPts(big){ const P = []; if(big === "circle"){ for(let i = 0; i < 12; i++){ const a = i / 12 * Math.PI * 2; P.push([50 + 38 * Math.cos(a), 50 + 38 * Math.sin(a)]); } }
  else if(big === "square"){ for(let i = 0; i < 4; i++) for(let k = 0; k < 4; k++){ const x = 14 + k * 24, y = 14 + i * 24; if(i === 0 || i === 3 || k === 0 || k === 3) P.push([x, y]); } }
  else { const T = [[50, 10], [10, 86], [90, 86]]; for(let e = 0; e < 3; e++){ const [x1, y1] = T[e], [x2, y2] = T[(e + 1) % 3]; for(let k = 0; k < 4; k++) P.push([x1 + (x2 - x1) * k / 4, y1 + (y2 - y1) * k / 4]); } }
  return P; }
function navonSVG(big, small, color){ return `<svg viewBox="0 0 100 100" style="width:100%;height:100%;display:block">${navonPts(big).map(([x, y]) => `<svg x="${x - 5.5}" y="${y - 5.5}" width="11" height="11" viewBox="0 0 100 100">${sortShapeSVG(small, color)}</svg>`).join("")}</svg>`; }
/* NV_NAMES: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
/* Artı–Eksi: sayı sütunu */
function pmGrid(n){ const t = Math.min(currentCombo().t, 2), lo = [4, 10, 20][t], hi = [20, 50, 96][t]; const out = []; let prev = -1; for(let i = 0; i < n; i++){ let v; do{ v = lo + Math.floor(Math.random() * (hi - lo + 1)); } while(v === prev); prev = v; out.push({ v }); } return out; }
/* Yaratık Sayma (TEA-Ch): ok işaretleri yönü çevirir */
const CC_IMGS = () => { const a = (typeof CREATURE_IMAGES !== "undefined" ? CREATURE_IMAGES.slice(0, 7) : []).concat([efImg("yaratik_8"), efImg("yaratik_9"), efImg("yaratik_10")]).filter(Boolean); return a.length ? a : [efImg("ejderha")]; };
function ccTrials(){ const t = Math.min(currentCombo().t, 2), N = [6, 8, 10][t], flips = [2, 3, 4][t], imgs = CC_IMGS();
  return Array.from({length:N}, (_, q) => { const img = imgs[q % imgs.length]; const items = []; let dir = 1, val = 0;
    for(let s = 0; s <= flips; s++){ if(s > 0){ const nd = -dir; if(!(nd < 0 && val < 2)){ dir = nd; items.push({ arrow: dir }); } }   /* sıfırın altına inilemez: ok konmaz */
      let len = 2 + Math.floor(Math.random() * (t === 2 ? 4 : 3)); if(dir < 0) len = Math.min(len, val); for(let k = 0; k < len; k++){ val += dir; items.push({ img }); } }
    const opts = new Set([val]); let g = 0; while(opts.size < 4 && g++ < 50){ const d = val + (Math.floor(Math.random() * 7) - 3); if(d >= 0) opts.add(d); } while(opts.size < 4) opts.add(val + opts.size + 3); return { items, ans: val, opts: shuffleArray([...opts]) }; }); }
/* Hareket mi, Yön mü?: ok grubu bir yöne bakarken başka yöne kayar; renk kuralı belirler */
/* mdTrials: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
/* MD_VEC: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
/* ===== Yürütücü İşlev · Paket 4 (Planlama) · veri ve yardımcılar ===== */
/* Hayvanat Bahçesi Planı (Zoo Map): 3×3 düğüm, giriş sol alt, çıkış sağ alt; rota giriş→çıkış, aynı yol iki kez kullanılmaz */
const ZOO_POS = [[16, 18], [50, 18], [84, 18], [16, 50], [50, 50], [84, 50], [16, 82], [50, 82], [84, 82]];
const ZOO_ANIMALS = () => shuffleArray(WILD_KEYS.map(k => ({ k, src: WILD_IMAGES[k], n: WILD_NAMES[k] })).concat(SEA_KEYS.map(k => ({ k, src: SEA_IMAGES[k], n: k }))).filter(x => x.src));
function zooEdges(){ const E = []; for(let r = 0; r < 3; r++) for(let c = 0; c < 3; c++){ const i = r * 3 + c; if(c < 2) E.push([i, i + 1]); if(r < 2) E.push([i, i + 3]); } const drop = shuffleArray(E.filter(([a, b]) => a !== 6 && b !== 6 && a !== 8 && b !== 8)).slice(0, 2); return E.filter(e => !drop.includes(e)); }   /* iki iç yol kapalı */
function zooAdj(E, a, b){ return E.find(e => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a)); }
function zooWalk(E){ let g = 0; while(g++ < 200){ const path = [6]; const used = new Set(); let cur = 6; for(let s = 0; s < 12 && cur !== 8; s++){ const nb = [0, 1, 2, 3, 4, 5, 7, 8].filter(n => zooAdj(E, cur, n) && !used.has(zooAdj(E, cur, n)) && !path.includes(n)); if(!nb.length) break; const nx = randomItem(nb); used.add(zooAdj(E, cur, nx)); path.push(nx); cur = nx; } if(cur === 8 && path.length >= 5) return path; } return [6, 3, 4, 5, 8]; }
function zooTrials(){ const t = Math.min(currentCombo().t, 2), pre = isPre(), R = (pre ? [2, 3, 3] : [3, 4, 5])[t], N = pre ? 2 : 3, ordered = !pre && t === 2;
  return Array.from({length:N}, () => { const E = zooEdges(); const walk = zooWalk(E); const inner = walk.slice(1, -1); const req = shuffleArray(inner).slice(0, Math.min(R, inner.length)).sort((a, b) => walk.indexOf(a) - walk.indexOf(b)); const animals = ZOO_ANIMALS().slice(0, 9); return { E, req, ordered, animals, cur: 6, used: [], visited: [], bad: 0 }; }); }
/* Kayıp Anahtar (Key Search): 8×8 alan, parmakla çizilen yolun kapsadığı hücreler */
function ksTrials(){ const t = Math.min(currentCombo().t, 2), pre = isPre(); return Array.from({length: pre ? 2 : 3}, () => ({ key: [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)], need: (pre ? [45, 55, 65] : [55, 65, 75])[t], pts: [] })); }
function ksCoverage(pts){ const G = 8, cov = new Set(); const mark = (x, y) => { for(let dx = -1; dx <= 1; dx++) for(let dy = -1; dy <= 1; dy++){ const cx = Math.floor((x + dx * 6) / (100 / G)), cy = Math.floor((y + dy * 6) / (100 / G)); if(cx >= 0 && cy >= 0 && cx < G && cy < G) cov.add(cx + "," + cy); } };
  for(let i = 0; i < pts.length; i++){ const [x1, y1] = pts[i]; if(i === 0){ mark(x1, y1); continue; } const [x0, y0] = pts[i - 1]; const L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(L / 2)); for(let k = 0; k <= n; k++) mark(x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n); }
  return cov; }
function ksSvgPoint(ev, svg){ const r = svg.getBoundingClientRect(); return [Math.max(0, Math.min(100, (ev.clientX - r.left) / r.width * 100)), Math.max(0, Math.min(100, (ev.clientY - r.top) / r.height * 100))]; }
function ksAddPoint(p){ const st = mtState; if(!st || st.kind !== "keys" || st.phase !== "input") return; const tr = st.trials[st.ti]; tr.pts.push(p); const el = document.getElementById("ksPath"); if(el) el.setAttribute("points", tr.pts.map(q => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ")); }
(function initKsPointer(){ try{ const board = document.getElementById("board"); if(!board) return; let drawing = false;
  board.addEventListener("pointerdown", ev => { const svg = ev.target.closest("[data-ksdraw]"); if(!svg) return; ev.preventDefault(); if(!timerRunning){ showLevelFlash("Önce ▶ Başlat'a basın.", "down"); return; } drawing = true; try{ svg.setPointerCapture(ev.pointerId); }catch(e){} ksAddPoint(ksSvgPoint(ev, svg)); }, { passive:false });
  board.addEventListener("pointermove", ev => { if(!drawing) return; const svg = ev.target.closest("[data-ksdraw]") || document.querySelector("[data-ksdraw]"); if(!svg) return; ev.preventDefault(); ksAddPoint(ksSvgPoint(ev, svg)); }, { passive:false });
  ["pointerup", "pointercancel"].forEach(n => board.addEventListener(n, () => { drawing = false; })); }catch(e){} })();
/* Su Kapları (Luchins): bulmacalar [kapasiteler, hedef, en az hamle] */
const JAR_PUZZLES = [ [[[2, 5], 3, 2], [[3, 7], 4, 2], [[4, 6], 2, 2], [[3, 5], 2, 2]], [[[3, 5], 1, 4], [[3, 5], 4, 6], [[4, 7], 6, 6]], [[[8, 5, 3], 4, 7], [[10, 7, 3], 5, 6], [[9, 4], 6, 8]] ];
function jarTrials(){ const t = Math.min(currentCombo().t, 2); return shuffleArray(JAR_PUZZLES[t]).slice(0, t === 0 ? 3 : 3).map(([caps, goal, best]) => ({ caps, goal, best, lv: caps.map(() => 0), moves: 0, sel: -1, solved: false })); }
function jarSVG(cap, lv, px, selected, goalHit){ const h = Math.round(px * 1.3), w = px, fillH = Math.round((h - 16) * lv / cap); return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:block"><rect x="4" y="8" width="${w - 8}" height="${h - 12}" rx="10" fill="#F2F5F8" stroke="${goalHit ? "#1FA463" : selected ? "#FFC21A" : "#9AA8B5"}" stroke-width="${selected || goalHit ? 5 : 3}"/><rect x="8" y="${h - 8 - fillH}" width="${w - 16}" height="${fillH}" rx="6" fill="#4FA8F0"/><text x="${w / 2}" y="${h / 2 + 2}" text-anchor="middle" font-size="${Math.round(px * 0.34)}" font-weight="900" fill="#1F2A33">${lv}</text><text x="${w / 2}" y="${h - 1}" text-anchor="middle" font-size="${Math.round(px * 0.2)}" font-weight="800" fill="#5B6B78">${cap} L</text></svg>`; }
/* Desen Akıcılığı (Beş Nokta / D-KEFS): nokta dizisi, çizgi kümesi benzersiz olmalı */
const DFL_LAYOUTS5 = [ [[50, 12], [12, 50], [88, 50], [26, 88], [74, 88]], [[16, 16], [84, 16], [50, 50], [16, 84], [84, 84]], [[50, 10], [14, 40], [86, 40], [30, 88], [70, 88]], [[50, 14], [16, 50], [50, 50], [84, 50], [50, 86]], [[14, 22], [50, 14], [86, 22], [30, 82], [70, 82]] ];
const DFL_LAYOUTS9 = [ [[16, 16], [50, 16], [84, 16], [16, 50], [50, 50], [84, 50], [16, 84], [50, 84], [84, 84]], [[50, 10], [24, 30], [76, 30], [12, 58], [50, 50], [88, 58], [24, 86], [50, 72], [76, 86]], [[14, 20], [38, 14], [62, 14], [86, 20], [26, 52], [74, 52], [14, 84], [50, 84], [86, 84]], [[50, 12], [20, 26], [80, 26], [12, 54], [36, 50], [64, 50], [88, 54], [32, 86], [68, 86]] ];
let dflLast = {}, dflMemo = null;
function dflCfg(){ const t = Math.min(currentCombo().t, 2), pre = isPre(), pool = (pre || t === 0) ? DFL_LAYOUTS5 : DFL_LAYOUTS9, k = (pre ? "p" : "o") + (pool === DFL_LAYOUTS5 ? 5 : 9);
if(dflMemo && dflMemo.k === k && Date.now() - dflMemo.at < 400) return { dots: pool[dflMemo.i], secs: pre ? 45 : 60, minLines: t === 2 ? 3 : 1 };   /* aynı açılışta ikinci çağrı aynı dizilişi verir */
let i, g = 0; do{ i = Math.floor(Math.random() * pool.length); g++; } while(g < 10 && i === dflLast[k]); dflLast[k] = i; dflMemo = { k, i, at: Date.now() }; return { dots: pool[i], secs: pre ? 45 : 60, minLines: t === 2 ? 3 : 1 }; }   /* her açılışta farklı nokta dizilişi */
/* Yirmi Soru: tahta ve hedef */
function twqTrials(){ const pre = isPre(), N = (pre ? [8, 10, 12] : [12, 16, 20])[Math.min(currentCombo().t, 2)],   /* KURAL: 20 Soru düzeyle zorlaşır — aday resim sayısı artar */ pool = shuffleArray(picPool()); const rounds = pre ? 2 : 3; return Array.from({length: rounds}, (_, i) => { const items = pool.slice(i * N, i * N + N).length === N ? pool.slice(i * N, i * N + N) : shuffleArray(picPool()).slice(0, N); return { items, tgt: Math.floor(Math.random() * N), q: 0, gone: {} }; }); }
/* Kutuları Ara (kendi sıralı arama): her kutuda tam bir yıldız; bulunan kutuya yıldız bir daha gelmez */
function bsTrials(){ const t = Math.min(currentCombo().t, 2), pre = isPre(), N = (pre ? [4, 5, 6] : [6, 8, 10])[t], R = pre ? 2 : 2; return Array.from({length:R}, () => ({ N, order: shuffleArray(Array.from({length:N}, (_, i) => i)), found: [], opened: [], k: 0 })); }   /* order[k]: k. yıldızın bulunduğu kutu */
/* Üç İş Bir Süre (Altı Öğe): üç görev × iki parça, süre sınırlı, aynı görevin iki parçası art arda yapılmaz */
const SIX_TASKS = [{ id:"A", n:"Sayılar", c:ACC.mavi }, { id:"B", n:"Hayvanlar", c:ACC.yesil }, { id:"C", n:"Daireler", c:ACC.mor }];
function sixPart(task){ if(task === "A"){ const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 6); return { kind:"A", cells: nums.map(v => ({ v, html: `<b style="font-size:26px">${v}</b>` })), targets: nums.slice().sort((a, b) => a - b).slice(0, 3), ordered: true }; }
  if(task === "B"){ const an = shuffleArray(NB_ANIMALS.filter(k => animalImg(k))).slice(0, 3).map(k => ({ v:"a:" + k, html: imgTag(animalImg(k)) })), ot = shuffleArray(picPool()).slice(0, 3).map(x => ({ v:"o:" + x.k, html: imgTag(x.src) })); const cells = shuffleArray(an.concat(ot)); return { kind:"B", cells, targets: an.map(x => x.v), ordered: false }; }
  const shapes = shuffleArray(["circle", "circle", "circle", "square", "triangle", "star"]).map((s, i) => ({ v: s + i, s, html: `<svg viewBox="0 0 100 100" style="width:60%;height:60%">${sortShapeSVG(s, randomItem([ACC.kirmizi, ACC.mavi, ACC.yesil, ACC.sari]))}</svg>` })); return { kind:"C", cells: shapes, targets: shapes.filter(x => x.s === "circle").map(x => x.v), ordered: false }; }
function sixCfg(){ const t = Math.min(currentCombo().t, 2), pre = isPre(); const parts = {}; SIX_TASKS.forEach(tk => { parts[tk.id + "1"] = sixPart(tk.id); parts[tk.id + "2"] = sixPart(tk.id); }); return { secs: (pre ? [60, 75, 90] : [90, 120, 150])[t], parts }; }
/* Bilişsel Tahmin: makul aralıklar */
const COGEST = {
0: [["Bir sınıfta kaç öğrenci olur?", "15–35"], ["Bir muz yaklaşık kaç santim uzunluğundadır?", "12–25 cm"], ["Bir yetişkin yaklaşık kaç kilodur?", "50–100 kg"], ["Bir kedi kaç kilodur?", "3–6 kg"], ["Bir kapı kaç santim yüksekliğindedir?", "180–220 cm"], ["Bir futbol maçı kaç dakika sürer?", "60–100 dk"], ["Bir okul otobüsü kaç metre uzunluğundadır?", "8–14 m"], ["Bir elma kaç gramdır?", "100–250 g"], ["7 yaşında bir çocuğun boyu kaç santimdir?", "110–135 cm"], ["Diş fırçalamak kaç dakika sürer?", "1–4 dk"], ["Bir kalem kaç santim uzunluğundadır?", "14–20 cm"], ["Bir kedi kaç yıl yaşar?", "10–18 yıl"], ["Bir okul günü kaç saat sürer?", "5–8 saat"], ["Bir futbol topu kaç gramdır?", "400–500 g"], ["Bir yetişkin kaç santim boyundadır?", "155–190 cm"], ["Bir bardak çay kaç dakikada soğur?", "5–15 dk"], ["Bir köpek kaç kilodur?", "5–40 kg"], ["Bir ekmek kaç dilim olur?", "15–25 dilim"], ["Bir yumurta kaç gramdır?", "50–70 g"], ["Sınıftaki yazı tahtası kaç metre uzunluğundadır?", "2–4 m"]],
1: [["Bir araba kaç metre uzunluğundadır?", "3,5–5 m"], ["Bir fil kaç kilodur?", "3.000–7.000 kg"], ["Bir yolcu uçağına kaç kişi biner?", "100–300"], ["İstanbul'dan Ankara'ya araba kaç saat sürer?", "4–7 saat"], ["Bir zürafa kaç metre boyundadır?", "4–6 m"], ["Bir litre süt kaç gramdır?", "900–1.100 g"], ["İnsan kalbi dakikada kaç kez atar?", "60–100"], ["Bir ekmek kaç gramdır?", "200–400 g"], ["Tek katlı bir ev kaç metre yüksekliğindedir?", "3–5 m"], ["Hızlı bir koşucu 100 metreyi kaç saniyede koşar?", "10–15 sn"], ["Bir otobüse kaç kişi biner?", "40–90"], ["Bir yetişkin günde kaç saat uyur?", "6–9 saat"], ["Bir karpuz kaç kilodur?", "3–8 kg"], ["Bir apartman katı kaç metre yüksekliğindedir?", "2,5–3,5 m"], ["Bir insan bir dakikada kaç kez nefes alır?", "12–20"], ["Bisikletle bir saatte kaç kilometre gidilir?", "10–20 km"], ["Bir kamyon kaç metre uzunluğundadır?", "8–15 m"], ["Bir sinema salonuna kaç kişi sığar?", "100–300"], ["Büyük bir ağaç kaç metre boyunda olur?", "10–25 m"], ["Bir kova kaç litre su alır?", "8–12 L"]],
2: [["Bir bisiklet kaç kilodur?", "8–18 kg"], ["Türkiye'de kaç milyon insan yaşar?", "80–90 milyon"], ["Bir mavi balina kaç metre uzunluğundadır?", "20–30 m"], ["Bir kalem pil kaç gramdır?", "20–60 g"], ["Bir kedi günde kaç saat uyur?", "12–16 saat"], ["Bir karınca kaç milimetredir?", "2–10 mm"], ["Ay'a kaç günde gidilir?", "2–4 gün"], ["Bir bardak su kaç mililitredir?", "150–300 ml"], ["Bir sinema filmi kaç dakika sürer?", "80–150 dk"], ["Yüksek bir dağ kaç metre olur?", "1.000–5.000 m"], ["İstanbul'da kaç milyon insan yaşar?", "15–17 milyon"], ["Bir yolcu uçağı saatte kaç kilometre hızla uçar?", "700–950 km"], ["Bir fil kaç yıl yaşar?", "50–70 yıl"], ["Bir arabanın deposu kaç litre benzin alır?", "40–70 L"], ["Okyanus kaç metre derin olur?", "3.000–5.000 m"], ["Bir yolcu treni kaç vagon olur?", "5–15"], ["Bir buzdolabı kaç kilodur?", "50–100 kg"], ["Ekmek fırını kaç derece sıcaktır?", "200–250 °C"], ["Bir güvercin saatte kaç kilometre hızla uçar?", "60–100 km"], ["Bir insan dakikada kaç kelime konuşur?", "120–160"]]
};
function cogTrials(){ const t = Math.min(currentCombo().t, 2); return shuffleArray(COGEST[t].map(x => ({ q: x[0], r: x[1] }))).slice(0, [8, 10, 10][t]); }
/* Paket 4 · akış yardımcıları */
function dflKey(lines){ return lines.map(l => l[0] < l[1] ? l[0] + "-" + l[1] : l[1] + "-" + l[0]).sort().join("|"); }
function dflCommit(){ const st = mtState; if(!st || st.kind !== "dfl") return; if(st.cur.length < st.cfg.minLines){ if(st.cur.length) st.short++; st.cur = []; st.sel = -1; return; } const key = dflKey(st.cur); if(st.designs.includes(key)){ st.rep++; mtErr(); } else { st.designs.push(key); st.uniq++; gameSfx("correct"); } st.cur = []; st.sel = -1; }
function sixFinish(){ const st = mtState; if(!st || st.kind !== "six" || st.phase === "done") return; const missing = 6 - Object.keys(st.done).length; for(let k = 0; k < missing; k++) mtErr(); mtFinish(` Yapılan parça: ${6 - missing}/6 · kural ihlali: ${st.breaks}`); }
function jarCheck(){ const st = mtState; if(!st || st.kind !== "jars") return; const tr = st.trials[st.ti]; if(tr.solved || !tr.lv.some(v => v === tr.goal)) return; tr.solved = true; const extra = Math.max(0, tr.moves - tr.best); for(let k = 0; k < extra; k++) mtErr(); st.okN++; gameSfx("correct"); st.phase = "fb"; renderMtBoard(); mtLater(NEW_MT.next, 1500); }
/* ===== Yürütücü İşlev · Paket 5 (Öz denetim + sıcak YI) · veri ve yardımcılar ===== */
/* Önce Bak, Sonra Dokun (MFFT): ev figürü, tek bir ayrıntı farkı */
/* KURAL (Önce Bak, Sonra Dokun): ev, yapboz gibi saydam parçalardan kurulur (gövde, çatı, baca, bayrak, pencere, kapı, ağaç, saksı, çit, güneş, kedi); örnek ile doğru seçenek birebir aynı parçalardan oluşur, her yanlış seçenekte tam olarak bir parça farklıdır. Kolay düzeyde fark belirgindir (çatı rengi, bayrak, ağacın yeri, kapının yeri, pencere sayısı), zorlaştıkça küçülür (pencere biçimi, kapı rengi, duman, saksı, kedi…) */
const LF_ATTRS = { roof:["r","b","g"], side:["l","r"], winN:[1,2], flag:[true,false], tree:["l","r"], chim:["none","plain","smoke"], door:["gray","brown"], win:["sq","round"], pot:[true,false], fence:[true,false], sun:[true,false], cat:[true,false] };
const LF_VARY = [["roof","side","winN","flag","tree"], ["roof","side","winN","flag","tree","chim","door","sun","fence"], ["chim","door","win","pot","cat","sun","fence","winN","flag"]];
function lfHouse(a, px){
  const P = (typeof LF_PARTS !== "undefined" && LF_PARTS) || window.LF_PARTS || {};
  const L = (k, css) => P[k] ? `<img src="${P[k]}" alt="" draggable="false" style="${("position:absolute;" + css + ";height:auto;aspect-ratio:auto;max-width:none;max-height:none;min-width:0;min-height:0;margin:0;padding:0;border:0;object-fit:contain;transform:none;pointer-events:none").split(";").filter(Boolean).map(d => d + " !important").join(";")}">` : "";   /* parça ölçüleri seçenek düğmesinin resim kurallarından etkilenmez */
  const dl = a.side === "l", door = a.door === "brown" ? "door_brown" : "door_gray", win = a.win === "round" ? "win_round" : "win_sq";
  const wx = a.winN === 1 ? [dl ? 55 : 36] : (dl ? [46, 63] : [27, 44]);
  return `<div class="lf-house" style="position:relative !important;width:${px}px !important;height:${px}px !important;min-height:${px}px !important;max-height:${px}px !important;display:block !important;overflow:hidden !important;flex:0 0 auto !important;padding:0 !important">`
    + (a.sun ? L("sun", "left:3%;top:3%;width:15%") : "")
    + (a.chim !== "none" ? L(a.chim === "smoke" ? "chim_smoke" : "chim", "left:62%;top:20%;width:10%") : "")
    + (a.flag ? L("flag", "left:48.8%;top:9.5%;width:11%") : "")
    + L("body", "left:21%;top:47%;width:58%")
    + L("roof_" + (a.roof || "r"), "left:15%;top:22%;width:70%")
    + wx.map(x => L(win, `left:${x}%;top:58%;width:12%`)).join("")
    + L(door, `left:${dl ? 26 : 61}%;top:63%;width:13%`)
    + (a.pot ? L("pot", `left:${dl ? 40 : 48}%;top:78%;width:9%`) : "")
    + L("tree", `left:${a.tree === "l" ? 0 : 79}%;top:62%;width:21%`)
    + (a.fence ? L("fence", `left:${a.tree === "l" ? 76 : 2}%;top:80%;width:22%`) : "")
    + (a.cat ? L("cat", "left:24%;top:31.5%;width:11%") : "")
    + `</div>`;
}
function lfTrials(){ const t = Math.min(currentCombo().t, 2), pre = isPre(), N = (pre ? [4, 5, 6] : [6, 8, 10])[t], nOpt = pre ? 4 : (t === 0 ? 4 : 6); const vary = LF_VARY[pre ? Math.min(t, 1) : t];
  return Array.from({length:N}, () => { const base = {}; Object.keys(LF_ATTRS).forEach(k => { base[k] = randomItem(LF_ATTRS[k]); });
    if(t === 0 || pre){ base.pot = false; base.cat = false; if(t === 0){ base.fence = false; base.sun = false; base.chim = base.chim === "smoke" ? "plain" : base.chim; } }   /* kolay düzeyde sahne sade */
    const keys = shuffleArray(vary.slice()).slice(0, nOpt - 1);
    const vars = keys.map(k => { const v = Object.assign({}, base); const others = LF_ATTRS[k].filter(x => x !== base[k] && !(t === 0 && k === "chim" && x === "smoke")); v[k] = randomItem(others); return v; });
    const opts = shuffleArray([base].concat(vars)); return { base, opts, ans: opts.indexOf(base) }; }); }
/* (2026-10-29: bu çalışma uygulamadan kaldırıldı; yardımcı işlev kullanılmıyor) */
/* scTrials: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
/* Hangi Kutu Daha İyi? (Çocuk Kumar Görevi, Kerr & Zelazo): riskli kutu çok verir ama çok kaybettirir */
/* (2026-11-02: Hangi Kutu ve Hareket mi Yön mü çalışmaları kullanıcı isteğiyle silindi) */   /* daha iyi kutunun yeri her sayfada değişir */
/* Her Grubun Sonuncusu (Keep Track): kategoriler ve havuzlar */
const KT_CATS = () => [{ k:"hayvan", n:"hayvan", items: NB_ANIMALS.filter(k => animalImg(k)).map(k => ({ n: ANIMAL_NAMES[k], src: animalImg(k) })) }, { k:"oyuncak", n:"oyuncak", items: TOY_KEYS.map(k => ({ n: TOY_NAMES[k], src: TOY_IMAGES[k] })) }, { k:"esya", n:"ev eşyası", items: Object.keys(HOUSE_NAMES).map(k => ({ n: HOUSE_NAMES[k], src: HOUSE_IMAGES[k] })) }, { k:"meyve", n:"meyve", items: ["apple", "banana", "orange", "grapes", "strawberry"].map(k => ({ n: FRUIT_VEG_NAMES[k], src: FRUIT_VEG_IMAGES[k] })) }];
function ktTrials(){ const t = Math.min(currentCombo().t, 2), pre = isPre(), K = (pre ? [2, 2, 3] : [2, 3, 4])[t], L = (pre ? [6, 8, 10] : [9, 12, 15])[t], R = pre ? 2 : 3, cats = KT_CATS();
  return Array.from({length:R}, () => { const use = shuffleArray(cats).slice(0, K); const seq = []; for(let i = 0; i < L; i++){ const c = use[i % K]; let it; let g = 0; do{ it = randomItem(c.items); g++; } while(g < 20 && seq.length && seq[seq.length - 1].n === it.n); seq.push({ cat: c.k, n: it.n, src: it.src }); } const order = shuffleArray(seq.slice()); const last = {}; order.forEach(x => { last[x.cat] = x.n; }); return { cats: use, seq: order, last, judge: {} }; }); }
/* tap-reverse artık vuruş sayılan etkileşimli tahta */



/* (2026-11-03: Tahmin özelliği kullanıcı isteğiyle uygulamadan kaldırıldı) */ /* Paket 5 · akış yardımcıları */
function taprEval(){ const st = mtState; if(!st || st.kind !== "tapr" || st.phase !== "show") return; const tr = st.trials[st.ti], want = tr.k === 1 ? 2 : 1, ok = st.taps === want; if(ok){ st.okN++; gameSfx("correct"); } else mtErr(); st.fb = { ok, want }; st.phase = "fb"; renderMtBoard(); mtLater(NEW_MT.next, ok ? 500 : 1100); }
function scArm(){ const st = mtState; if(!st || st.kind !== "selfchk" || st.phase !== "run") return; const my = st.cur; mtLater(() => { if(mtState !== st || st.phase !== "run" || st.cur !== my) return; const it = st.trials[my]; if(it.ans == null){ it.ans = "-"; it.ok = false; } scNext(); }, st.cfg.win); }
function scNext(){ const st = mtState; st.cur++; if(st.cur >= st.trials.length){ st.phase = "review"; st.view = "review"; renderMtBoard(); return; } renderMtBoard(); scArm(); }
function scAnswer(d){ const st = mtState; if(!st || st.kind !== "selfchk" || st.phase !== "run") return; const it = st.trials[st.cur]; if(it.ans != null) return; it.ans = d; it.ok = d === it.d; scNext(); }
const NEW_MT = {
build: {
"hear-find": () => { const t = currentCombo().t, K = (isPre() ? [2, 2, 3] : [3, 4, 5])[t], G = (isPre() ? [4, 6, 6] : [6, 8, 9])[t];
mtState = { kind:"hear", trials: Array.from({length: isPre() ? 3 : 4}, () => { const p = shuffleArray(picPool()).slice(0, G); return { opts: p, heard: shuffleArray(p.slice()).slice(0, K) }; }), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"dir-follow": () => { mtState = { kind:"dir", trials: Array.from({length: isPre() ? 3 : 5}, dirTrial), ti:0, pos:0, wrong:0, phase:"idle" }; return mtState.trials; },
"vis-miss": () => { const t = currentCombo().t, N = (isPre() ? [3, 4, 5] : [5, 6, 8])[t];
mtState = { kind:"miss", trials: Array.from({length: isPre() ? 3 : 5}, () => { const p = shuffleArray(picPool()); const set = p.slice(0, N), gone = Math.floor(Math.random() * N);
const want = (isPre() ? [3, 3, 4] : [3, 4, 5])[Math.min(t, 2)]; return { set, gone, opts: shuffleArray([set[gone]].concat(p.slice(N, N + want - 1))), shuffle: t > 0 }; })   /* seçenek sayısı düzeye göre */, ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"vis-chg": () => { const t = currentCombo().t, N = (isPre() ? [3, 4, 5] : [4, 6, 8])[t];
mtState = { kind:"chg", trials: Array.from({length: isPre() ? 3 : 5}, () => { const p = shuffleArray(picPool()); return { set: p.slice(0, N), at: Math.floor(Math.random() * N), neo: p[N] }; }), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"vis-recog": () => { const t = currentCombo().t, M = (isPre() ? [4, 5, 6] : [6, 8, 10])[t], pool = shuffleArray(picPool());
let study = pool.slice(0, M), fresh = pool.slice(M, M * 2), delayed = false;
if(currentStageIndex === 1){ const d = delayGet("recog"); if(d && d.keys){ const byK = Object.fromEntries(picPool().map(x => [x.k, x])); const s2 = d.keys.map(k => byK[k]).filter(Boolean);
if(s2.length){ study = s2; fresh = shuffleArray(picPool().filter(x => !d.keys.includes(x.k))).slice(0, s2.length); delayed = true; } } }
mtState = { kind:"recog", study, test: shuffleArray(study.map(x => ({ x, old:true })).concat(fresh.map(x => ({ x, old:false })))), qi:0, wrong:0, hits:0, fa:0, phase:"idle", delayed };
return mtState.test; },
...Object.fromEntries(Object.keys(QZ).map(id => [id, () => { mtState = { kind:"quiz", qid:id, trials: qzSpreadAns(qzTierOpts(id, QZ[id]())), ti:0, wrong:0, phase:"idle" }; return mtState.trials; }])),
"size-touch": () => { mtState = { kind:"size", desc: stIx() === 1, trials: szBuild(), ti:0, pos:0, wrong:0, phase:"idle", marks:{} }; return mtState.trials; },   /* Aşama 2: büyükten küçüğe */
"move-seq": () => { mtState = { kind:"movesay", trials: moveTrials(), ti:0, wrong:0, ok:0, phase:"idle" }; return mtState.trials; },
"story-order": () => { mtState = { kind:"storyord", trials: storyOrderTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"what-do": () => { mtState = { kind:"whatdo", trials: whatdoTrials(), ti:0, wrong:0, part:0, okN:0, phase:"idle" }; return mtState.trials; },
...Object.fromEntries(["flu-cat","flu-letter","flu-switch","alt-uses"].map(id => [id, () => { if(id === "flu-switch") fluSwitchSet(true);   /* her açılışta farklı kategori çifti */
mtState = { kind:"flu", fid:id, P: fluPrompt(id), secs: fluSecs(id), ok:0, rep:0, rule:0, ord:0, q:[0, 0, 0, 0], exp:0, left: fluSecs(id), phase:"idle" }; return [mtState.P]; }])),
"dot-count": () => { mtState = { kind:"dots", trials: dotTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"sem-decide": () => { mtState = { kind:"quiz", qid:"sem-decide", trials: semTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"eye-touch": () => { const c = chaseCfg(); mtState = Object.assign({ kind:"chase", hits:0, wrong:0, phase:"idle" }, c); return Array.from({length: c.need}, () => ({})); },
"time-est": () => { mtState = { kind:"time", trials: timeTrials(), ti:0, wrong:0, phase:"idle", res:[] }; return mtState.trials; },
"find-error": () => { mtState = { kind:"ferr", trials: ferrTrials(), ti:0, wrong:0, phase:"idle", sel:{} }; return mtState.trials; },
"cups": () => { mtState = { kind:"cups", trials: cupsTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"mental-math": () => { mtState = { kind:"mmath", trials: mmathTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"who-said": () => { const tr = whoTrial(); mtState = Object.assign({ kind:"who", wrong:0, phase:"idle", si:-1, qi:0 }, tr); return tr.test; },
"rhythm": () => { mtState = { kind:"rhy", trials: rhyTrials(), ti:0, wrong:0, phase:"idle", taps:[] }; return mtState.trials; },
"memory-cards": () => { const d = memBuild(); mtState = Object.assign({ kind:"mem", open:[], done:{}, miss:0, wrong:0, phase:"idle", lock:false }, d); return d.cards; },
...Object.fromEntries([["proverb-touch", pmcBuild], ["absurd-touch", absBuild], ["concept-touch", cpTrials], ["infer-touch", imcBuild]].map(([id, f]) => [id, () => { mtState = { kind:"quiz", qid:id, trials: qzTierOpts(id, f()), ti:0, wrong:0, phase:"idle" }; return mtState.trials; }])),
...Object.fromEntries([["vanalogy-touch", anlTrials], ["word-pic", wpTrials]].map(([id, f]) => [id, () => { mtState = { kind:"quiz", qid:id, trials: qzTierOpts(id, f()), ti:0, wrong:0, phase:"idle" }; return mtState.trials; }])),
"absurd-say": () => { mtState = { kind:"absay", trials: absayTrials(), ti:0, wrong:0, okN:0, phase:"idle" }; return mtState.trials; },
...Object.fromEntries([["mental-rot", mrTrials], ["overlap-count", ovTrials], ["embedded", embTrials], ["closure", clsTrials]].map(([id, f]) => [id, () => { mtState = { kind:"quiz", qid:id, trials: qzTierOpts(id, f()), ti:0, wrong:0, phase:"idle" }; return mtState.trials; }])),
"block-design": () => { mtState = { kind:"blk", trials: blkTrials(), ti:0, wrong:0, phase:"idle", cells:[] }; return mtState.trials; },
"clutter-find": () => { const d = clutBuild(); mtState = Object.assign({ kind:"clut", wrong:0, phase:"idle" }, d); return d.items; },
"copy-design": () => { const t = currentCombo().t, n = !isPre() && t === 2 ? 4 : 3, segs = (isPre() ? [2, 3, 4] : [3, 5, 7])[t]; mtState = { kind:"draw", copy:true, n, trials: Array.from({length:3}, () => drawPattern(n, segs)), ti:0, wrong:0, phase:"idle", mine:new Set(), sel:-1 }; return mtState.trials; },
"symmetry": () => { mtState = { kind:"sym", trials: symTrials(), ti:0, wrong:0, phase:"idle", mine:{} }; return mtState.trials; },
"maze": () => { mtState = { kind:"maze", trials: mazeTrials(), ti:0, wrong:0, phase:"idle", pos:0, path:[0] }; return mtState.trials; },
...Object.fromEntries([["matrix-fill", mxTrials], ["balance", balTrials]].map(([id, f]) => [id, () => { mtState = { kind:"quiz", qid:id, trials: qzTierOpts(id, f()), ti:0, wrong:0, phase:"idle" }; return mtState.trials; }])),
"pic-arrange": () => { mtState = { kind:"parr", trials: paTrials(), ti:0, wrong:0, phase:"idle", placed:[], bad:{}, telling: stIx() === 1 && !gameMode }; return mtState.trials; },
...Object.fromEntries([["sent-verify", svTrials], ["syl-blend", sbTrials], ["wh-scene", whTrials], ["paper-fold", pfTrials], ["view-from", vfTrials], ["cause-effect", ceTrials], ["num-pattern", npTrials]].map(([id, f]) => [id, () => { mtState = { kind:"quiz", qid:id, trials: qzTierOpts(id, f()), ti:0, wrong:0, phase:"idle" }; return mtState.trials; }])),
"listen-answer": () => { mtState = { kind:"quiz", qid:"listen-answer", trials: qzTierOpts("listen-answer", laTrials()), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"clue-find": () => { mtState = { kind:"clue", trials: cfTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"class-table": () => { mtState = { kind:"ctab", trials: ctTrials(), ti:0, wrong:0, phase:"idle", placed:{}, sel:null }; return mtState.trials; },
"color-obj": () => { mtState = { kind:"cobj", trials: coTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"pic-order": () => { mtState = { kind:"porder", trials: poTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"finger-trace": () => { mtState = { kind:"ftrace", trials: ftTrials(), ti:0, wrong:0, phase:"idle", res:[] }; return mtState.trials; },
"eye-count": () => { mtState = { kind:"ecount", trials: ecTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"pk-redlight": () => { const c = rlCfg(); mtState = { kind:"rl", cfg:c, phase:"idle", wrong:0, prog:0, light:"green", hold:false, caught:0 }; return Array.from({length:10}, () => ({})); },
"pk-waiter": () => { mtState = { kind:"wt", trials: wtTrials(), ti:0, wrong:0, phase:"idle", score:0, tray:[] }; return mtState.trials; },
"pk-drum": () => { const c = drCfg(); mtState = { kind:"dr", cfg:c, phase:"idle", wrong:0, score:0, beats:[], hits:{} }; return Array.from({length:20}, () => ({})); },
"pk-shadow": () => { mtState = { kind:"quiz", qid:"pk-shadow", trials: qzTierOpts("pk-shadow", geTrials()), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"pk-word": () => { const c = kaCfg(), P = kaPools(), keys = Object.keys(P); const tg = randomItem(keys); mtState = { kind:"kav", cfg:c, P, keys, tg, phase:"idle", score:0, wrong:0, items:[], next:0 }; return Array.from({length: c.N}, () => ({})); },
"pk-rhyme": () => { mtState = { kind:"ubal", trials: ubTrials(), ti:0, wrong:0, phase:"idle", score:0 }; return mtState.trials; },
"pk-train": () => { mtState = { kind:"htrn", trials: htTrials(), ti:0, wrong:0, phase:"idle", score:0, placed:[] }; return mtState.trials; },
"pk-slide": () => { const c = slCfg(); mtState = Object.assign({ kind:"slide", wrong:0, phase:"idle", moves:0 }, c); return [{}]; },
"pk-bridge": () => { mtState = { kind:"kopru", trials: kkTrials(), ti:0, wrong:0, phase:"idle", score:0, sel:[] }; return mtState.trials; },
"pk-escape": () => { const c = bkCfg(); mtState = Object.assign({ kind:"esc", wrong:0, phase:"idle", pos:0, cl:[] }, c); return Array.from({length:10}, () => ({})); },
"pk-balloon": () => { const c = blnCfg(); mtState = { kind:"bln", cfg:c, phase:"idle", score:0, wrong:0, items:[], next:0, tgt: Math.floor(Math.random() * 4) }; return Array.from({length: c.N}, () => ({})); },
"pk-mole": () => { const c = molCfg(); mtState = { kind:"mol", cfg:c, phase:"idle", score:0, wrong:0, k:0, cur:null }; return Array.from({length: c.N}, () => ({})); },
"pk-catch": () => { const c = ctcCfg(); mtState = { kind:"ctc", cfg:c, phase:"idle", score:0, wrong:0, items:[], bx:0.5 }; return Array.from({length: c.N}, () => ({})); },
"pk-bag": () => { mtState = { kind:"bag", trials: bagTrials(), ti:0, wrong:0, phase:"idle", score:0 }; return mtState.trials; },
"pk-simon": () => { const c = smnCfg(); mtState = { kind:"smn", cfg:c, seq:[], phase:"idle", score:0, wrong:0, pads:4 }; return Array.from({length: c.target}, () => ({})); },
"pk-light": () => { const c = lhCfg(); mtState = { kind:"smn", cfg:c, seq:[], phase:"idle", score:0, wrong:0, pads:c.pts.length, lh:true }; return Array.from({length: c.target}, () => ({})); },
"sent-pic": () => { mtState = { kind:"quiz", qid:"sent-pic", trials: spTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"new-word": () => { const d = newWordBuild(); mtState = Object.assign({ kind:"nword", wrong:0, phase:"idle", li:-1, qi:0 }, d); return d.test; },
"pair-match": () => { mtState = { kind:"pairm", trials: pmTrials(), ti:0, wrong:0, phase:"idle", pk:[], bad:{} }; return mtState.trials; },
"periph": () => { mtState = { kind:"per", trials: perTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },

"dual-task": () => { mtState = { kind:"dual", trials: dualTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"stop-signal": () => { mtState = { kind:"stop", trials: stopTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"tap-reverse": () => { mtState = { kind:"tapr", trials: balancedSeq(selCount(), [1, 2], 2).map(k => ({ k })), ti:0, wrong:0, okN:0, phase:"idle", taps:0, fb:null }; return mtState.trials; },
"statue": () => { const c = statueCfg(); mtState = { kind:"statue", cfg:c, trials:[{}], ti:0, wrong:0, phase:"idle", left:c.secs, moves:0 }; return mtState.trials; },
"hold-wait": () => { mtState = { kind:"hold", trials: holdTrials(), ti:0, wrong:0, okN:0, phase:"idle", holding:false }; return mtState.trials; },
"fist": () => { mtState = { kind:"fist", trials: fistTrials(), ti:0, wrong:0, okN:0, phase:"idle" }; return mtState.trials; },
"rule-shift": () => { const c = wcCfg(); mtState = { kind:"wcst", cfg:c, trials: Array.from({length: c.N}, () => wcCard(c.rules)), ti:0, wrong:0, okN:0, rule: c.rules[0], ri:0, streak:0, shifts:0, pers:0, lastRule:null, phase:"idle", fb:null, pick:null }; return mtState.trials; },
"reversal": () => { const c = revCfg(); mtState = { kind:"rev", cfg:c, trials: Array.from({length: c.N}, () => ({ swap: Math.random() < 0.5 })), ti:0, wrong:0, okN:0, win: Math.floor(Math.random() * 2), streak:0, revs:0, phase:"idle", fb:null, pick:null }; return mtState.trials; },
"zoo-map": () => { mtState = { kind:"zoo", trials: zooTrials(), ti:0, wrong:0, okN:0, phase:"idle" }; return mtState.trials; },
"key-search": () => { mtState = { kind:"keys", trials: ksTrials(), ti:0, wrong:0, okN:0, phase:"idle", res:[] }; return mtState.trials; },
"water-jars": () => { mtState = { kind:"jars", trials: jarTrials(), ti:0, wrong:0, okN:0, phase:"idle" }; return mtState.trials; },
"design-fluency": () => { const c = dflCfg(); mtState = { kind:"dfl", cfg:c, trials:[{}], ti:0, wrong:0, phase:"idle", left:c.secs, designs:[], cur:[], sel:-1, uniq:0, rep:0, short:0 }; return mtState.trials; },
"twenty-q": () => { mtState = { kind:"twq", trials: twqTrials(), ti:0, wrong:0, phase:"idle", res:[] }; return mtState.trials; },
"box-search": () => { mtState = { kind:"bsearch", trials: bsTrials(), ti:0, wrong:0, okN:0, phase:"idle", last:-1, show:null }; return mtState.trials; },
"three-tasks": () => { const c = sixCfg(); mtState = { kind:"six", cfg:c, trials:[{}], ti:0, wrong:0, phase:"idle", left:c.secs, view:"menu", done:{}, lastTask:null, breaks:0, hits:{} }; return mtState.trials; },
"keep-track": () => { mtState = { kind:"ktrack", trials: ktTrials(), ti:0, wrong:0, okN:0, phase:"idle", si:-1, qi:0 }; return mtState.trials; },
"vigilance": () => { const d = vigBuild(); mtState = Object.assign({ kind:"vig", i:-1, wrong:0, phase:"idle", hits:0, fa:0, miss:0 }, d); return d.seq; },
"pos-nback": () => { const d = pnbBuild(); mtState = Object.assign({ kind:"pnb", i:-1, wrong:0, phase:"idle", resp:{} }, d); return d.seq; },
"count-span": () => { mtState = { kind:"csp", trials: cspTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"tone-seq": () => { mtState = { kind:"tone", trials: toneTrials(), ti:0, wrong:0, phase:"idle", lights: stIx() !== 1 }; return mtState.trials; },
"which-seen": () => { mtState = { kind:"wseen", trials: wsTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"route-mem": () => { mtState = { kind:"route", trials: routeTrials(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"sent-build": () => { mtState = { kind:"sbuild", trials: sbuildTrials(), ti:0, wrong:0, phase:"idle", placed:[], bad:{} }; return mtState.trials; },
"spot-diff": () => { mtState = { kind:"spotd", trials: sdTrials(), ti:0, wrong:0, phase:"idle", found:{}, bad:{} }; return mtState.trials; },
"sudoku": () => { mtState = { kind:"sdk", trials: sdkTrials(), ti:0, wrong:0, phase:"idle", cells:[], sel:0 }; return mtState.trials; },
"rhyme-touch": () => { mtState = { kind:"quiz", qid:"rhyme-touch", trials: rhBuild(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"syn-touch": () => { mtState = { kind:"quiz", qid:"syn-touch", trials: synBuild(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"part-whole": () => { mtState = { kind:"quiz", qid:"part-whole", trials: pwBuild(), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"same-sound": () => { mtState = { kind:"ssnd", trials: ssBuild(), ti:0, wrong:0, phase:"idle", found:{}, bad:{} }; return mtState.trials; },
"seq-words": () => { mtState = { kind:"seqw", trials: swBuild(), ti:0, wrong:0, phase:"idle", placed:[], bad:{} }; return mtState.trials; },
"sort-pic": () => { const d = spBuild(); mtState = Object.assign({ kind:"spic", qi:0, wrong:0, phase:"idle", bad:-1 }, d); return d.queue; },
"free-sort": () => { const d = fsBuild(); mtState = Object.assign({ kind:"fsort", asg:{}, sel:0, wrong:0, phase:"idle", naming: stIx() === 1 && !gameMode }, d); return d.items; },
"same-number": () => { const items = snBuild(); mtState = { kind:"samenum", T: snTarget, items, found:{}, bad:{}, wrong:0, phase:"idle" }; return items; },
"vis-face": () => { mtState = { kind:"face", trials: Array.from({length: isPre() ? 2 : 3}, faceTrial), ti:0, wrong:0, phase:"idle" }; return mtState.trials; },
"scene-mem": () => { const sc = pickScene(), N = (isPre() ? [3, 4, 5] : [4, 5, 6])[currentCombo().t];
mtState = { kind:"scene", sc, qs: sc.q.slice(0, N), qi:0, wrong:0, ok:0, phase:"idle" }; return [sc]; },
"scene-touch": () => { const sc = pickScene(), N = (isPre() ? [2, 3, 4] : [3, 4, 4])[Math.min(currentCombo().t, 2)], D = (isPre() ? [2, 2, 3] : [3, 3, 4])[Math.min(currentCombo().t, 2)], others = SCENES.filter(x => x !== sc).flatMap(x => x.objs).filter(o => !sc.not.includes(o));
const qs = shuffleArray(sc.objs).slice(0, N).map(o => ({ ans:o, opts: shuffleArray([o].concat(shuffleArray(others).slice(0, D))) }));
mtState = { kind:"scenet", sc, qs, qi:0, wrong:0, phase:"idle" }; return [sc]; },
"vis-draw": () => { const t = currentCombo().t, n = !isPre() && t === 2 ? 4 : 3, segs = (isPre() ? [2, 3, 4] : [3, 4, 6])[t];
mtState = { kind:"draw", n, trials: Array.from({length: isPre() ? 3 : 4}, () => drawPattern(n, segs)), ti:0, wrong:0, phase:"idle", mine:new Set(), sel:-1 }; return mtState.trials; }
},
start: {
hear(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "listen"; st.found = {}; st.bad = {}; renderMtBoard();
const step = isPre() ? 1500 : 1300;
tr.heard.forEach((x, k) => mtLater(() => sayTask(x.n), 400 + k * step));
mtLater(() => { st.phase = "input"; renderMtBoard(); }, 400 + tr.heard.length * step + 300); },
dir(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "listen"; st.pos = 0; st.marks = {}; renderMtBoard();
mtLater(() => sayTask(tr.text, 0.85), 300);
mtLater(() => { st.phase = "input"; renderMtBoard(); }, 300 + Math.max(1800, tr.text.length * 75)); },
miss(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "study"; renderMtBoard();
const ms = tr.set.length * (isPre() ? 1100 : 800) + 1000;
mtLater(() => { st.phase = "blank"; renderMtBoard(); }, ms);
mtLater(() => { st.phase = "ask"; st.left = tr.set.filter((x, i) => i !== tr.gone); if(tr.shuffle) st.left = shuffleArray(st.left); st.pick = null; renderMtBoard(); }, ms + 900); },
chg(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "study"; renderMtBoard();
const ms = tr.set.length * (isPre() ? 1100 : 800) + 1000;
mtLater(() => { st.phase = "blank"; renderMtBoard(); }, ms);
mtLater(() => { st.phase = "ask"; st.pick = null; renderMtBoard(); }, ms + 900); },
recog(){ const st = mtState;
if(st.delayed){ st.phase = "ask"; renderMtBoard(); return; }
st.phase = "study"; st.si = -1; renderMtBoard(); const step = isPre() ? 1700 : 1400;
st.study.forEach((x, k) => mtLater(() => { st.si = k; renderMtBoard(); }, 300 + k * step));
mtLater(() => { if(currentStageIndex === 0) delaySet("recog", { keys: st.study.map(x => x.k) }); st.phase = "ask"; renderMtBoard(); }, 300 + st.study.length * step + 300); },
samenum(){ const st = mtState; st.phase = "input"; renderMtBoard(); },
quiz(){ qzStart(); },
flu(){ const st = mtState; st.phase = "run"; st.t0 = Date.now(); renderMtBoard(); sayTask(st.P.say, 0.9);
const tick = () => { if(st.phase !== "run") return; const el = (Date.now() - st.t0) / (window.__wmSpeed || 1) / 1000; st.left = Math.max(0, Math.ceil(st.secs - el));
if(el >= st.secs){ st.phase = "done"; sfx("solved"); mtFinish(fluUnit() === "fikir" ? ` Uygun fikir: ${st.ok} (hedef ${altGoal()}) · tekrar: ${st.rep} · sayılmaz: ${st.rule + st.ord}` : ` Doğru: ${st.ok} · tekrar: ${st.rep} · kural dışı: ${st.rule + st.ord}`); return; }
const hd = document.getElementById("fluLeft"); if(hd) hd.textContent = `${Math.floor(st.left / 60)}:${String(st.left % 60).padStart(2, "0")}`; mtLater(tick, 250); };
mtLater(tick, 250); },
dots(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "show"; renderMtBoard(); mtLater(() => { st.phase = "ask"; st.pick = null; renderMtBoard(); }, tr.ms); },
chase(){ const st = mtState; st.phase = "run"; renderMtBoard(); const box = document.getElementById("chaseBox"), ball = document.getElementById("chaseBall"); if(!box || !ball) return;
const t0 = performance.now(), ph = Math.random() * 6, step = (now) => { if(mtState !== st || st.phase !== "run" || !timerRunning) return;
const bw = box.clientWidth - st.size, bh = box.clientHeight - st.size, k = (now - t0) / 1000 * st.speed / (window.__wmSpeed || 1);
ball.style.left = (bw * (0.5 + 0.5 * Math.sin(k * 1.3 + ph))) + "px"; ball.style.top = (bh * (0.5 + 0.5 * Math.sin(k * 0.9 + ph * 1.7))) + "px"; requestAnimationFrame(step); };
requestAnimationFrame(step); },
time(){ const st = mtState; st.phase = "ready"; renderMtBoard(); document.documentElement.classList.add("hide-clock"); },
ferr(){ const st = mtState; st.sel = {}; st.phase = "input"; renderMtBoard(); const tr = st.trials[st.ti]; if(tr && tr.rule) mtLater(() => sayTask(tr.rule, 1.0), 250); },   /* kısa ve hızlı */   /* kural seslendirilir */
cups(){ const st = mtState, tr = st.trials[st.ti]; st.slot = Array.from({length: tr.n}, (_, i) => i); st.phase = "show"; st.lift = true; renderMtBoard();
mtLater(() => { st.lift = false; cupsApply(); }, 1300);
tr.seq.forEach(([a, b], k) => mtLater(() => { const ca = st.slot.indexOf(a), cb = st.slot.indexOf(b); st.slot[ca] = b; st.slot[cb] = a; cupsApply(); }, 1800 + k * tr.ms));
mtLater(() => { st.phase = "ask"; renderMtBoard(); sayTask("Top hangi bardağın altında?"); }, 1800 + tr.seq.length * tr.ms + 300); },
mmath(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "show"; st.si = -1; renderMtBoard(); const step = isPre() ? 2400 : 1800;
const say0 = isPre() ? `Kutuda ${tr.start} ${tr.pic.n} var.` : `${tr.start}`; mtLater(() => { st.si = 0; renderMtBoard(); sayTask(say0); }, 200);
tr.ops.forEach((d, k) => mtLater(() => { st.si = k + 1; renderMtBoard(); sayTask(isPre() ? (d > 0 ? `${d} ${tr.pic.n} daha girdi.` : `${-d} ${tr.pic.n} çıktı.`) : (d > 0 ? `artı ${d}` : `eksi ${-d}`)); }, 200 + (k + 1) * step));
mtLater(() => { st.phase = "ask"; st.pick = null; renderMtBoard(); sayTask(isPre() ? `Kutuda kaç ${tr.pic.n} var?` : "Sonuç kaç?"); }, 200 + (tr.ops.length + 1) * step); },
who(){ const st = mtState; st.phase = "study"; renderMtBoard(); const step = isPre() ? 2600 : 2200;
st.study.forEach((it, k) => mtLater(() => { st.si = k; renderMtBoard(); sayTask(`${st.ppl[it.p].nm}: ${it.x.n}.`); }, 300 + k * step));
mtLater(() => { st.phase = "ask"; st.qi = 0; renderMtBoard(); sayTask("Bunu kim söyledi?"); }, 300 + st.study.length * step + 200); },
rhy(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "play"; st.taps = []; st.pulse = -1; renderMtBoard(); const unit = 420;
let at = 500; const times = [at]; tr.iv.forEach(u => { at += u * unit; times.push(at); });
times.forEach((tm, k) => mtLater(() => { st.pulse = k; rhyBeep(); const d = document.getElementById("rhyDrum"); if(d){ d.classList.remove("hit"); void d.offsetWidth; d.classList.add("hit"); } }, tm));
mtLater(() => { st.phase = "input"; renderMtBoard(); }, at + 700); },
mem(){ const st = mtState; st.phase = "input"; renderMtBoard(); },
ssnd(){ const st = mtState, tr = st.trials[st.ti]; st.found = {}; st.bad = {}; st.phase = "input"; renderMtBoard(); mtLater(() => sayTask(`${tr.s} sesiyle başlayanları bul.`, 0.85), 250); },
seqw(){ const st = mtState; st.placed = []; st.bad = {}; st.phase = "input"; renderMtBoard(); },
spic(){ const st = mtState; st.phase = "input"; renderMtBoard(); sayTask(st.bins.map(b => b.n).join(", ") + ". Bu resim hangi gruba girer?", 0.9); },
fsort(){ const st = mtState; st.phase = "input"; renderMtBoard(); },
movesay(){ const st = mtState, seq = st.trials[st.ti]; st.phase = "listen"; renderMtBoard();
mtLater(() => sayTask(seq.map(i => MOVES[i]).join(", ") + ".", 0.8), 300);
mtLater(() => { st.phase = "judge"; renderMtBoard(); sayTask("Şimdi yap!"); }, 600 + seq.length * 1300); },
storyord(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "study"; st.si = -1; st.placed = []; st.bad = {}; renderMtBoard();
const step = isPre() ? 3200 : 2800;
[0, 1, 2].forEach(k => mtLater(() => { st.si = k; renderMtBoard(); sayTask(STORY_SEQ_TEXT[tr.si][k], 0.85); }, 300 + k * step));
mtLater(() => { st.phase = "input"; st.placed = tr.given ? [tr.cards.findIndex(c => !c.extra && c.k === 0)] : []; renderMtBoard(); }, 300 + 3 * step + 200); },
absay(){ const st = mtState; st.phase = "judge"; renderMtBoard(); const it = st.trials[st.ti]; if(it.s) mtLater(() => sayTask(it.s, 0.85), 250); },
whatdo(){ const st = mtState; st.phase = "judge"; renderMtBoard(); mtLater(() => sayTask(st.trials[st.ti].q, 0.85), 250); },
size(){ const st = mtState; st.phase = "input"; st.pos = 0; st.marks = {}; renderMtBoard(); },
face(){ const st = mtState, tr = st.trials[st.ti]; st.found = {}; st.bad = {}; st.si = -1; st.phase = "study"; renderMtBoard();
const list = tr.mode === "name" ? tr.ppl : tr.study, step = tr.mode === "name" ? (isPre() ? 3000 : 2600) + (stIx() !== currentStageIndex ? 1200 : 0) : (isPre() ? 1800 : 1500);
list.forEach((x, k) => mtLater(() => { st.si = k; renderMtBoard(); if(tr.mode === "name") sayTask("Bu " + x.nm + "."); }, 300 + k * step));
mtLater(() => { st.phase = "input"; st.qi = 0; if(tr.mode === "name") sayTask("Hangisi " + tr.ppl[tr.order[0]].nm + "?"); renderMtBoard(); }, 300 + list.length * step + 300); },
scene(){ const st = mtState; st.phase = "study"; renderMtBoard(); mtLater(() => { st.phase = "ask"; renderMtBoard(); }, sceneStudyMs()); },
scenet(){ const st = mtState; st.phase = "study"; renderMtBoard(); mtLater(() => { st.phase = "ask"; st.pick = null; renderMtBoard(); }, sceneStudyMs()); },
rl(){ const st = mtState, c = st.cfg; st.phase = "run"; st.light = "green"; renderMtBoard(); sayTask("Yeşilde basılı tut, kırmızıda bırak!");
const btn = document.getElementById("rlBtn"); if(btn){ const on = (e) => { e.preventDefault(); st.hold = true; if(st.light === "red" && performance.now() - st.redAt > c.grace * (window.__wmSpeed || 1) && !st.redErr){ st.redErr = true; st.caught++; mtErr(); rlFlash(); } btn.classList.add("on"); };
const off = () => { st.hold = false; btn.classList.remove("on"); }; btn.onpointerdown = on; btn.onpointerup = btn.onpointerleave = btn.onpointercancel = off; }
const sp = window.__wmSpeed || 1; let last = performance.now();
const swap = () => { if(!pkAlive(st) || st.phase !== "run") return; if(st.light === "green"){ st.light = "red"; st.redAt = performance.now(); st.redErr = false; gameSfx("pop"); } else { st.light = "green"; }
rlPaint(); const [a, b] = st.light === "green" ? c.green : c.red; mtLater(swap, a + Math.random() * (b - a)); };
mtLater(swap, c.green[0] + Math.random() * (c.green[1] - c.green[0]));
const frame = (now) => { if(!pkAlive(st) || st.phase !== "run") return; const dt = (now - last) / 1000 / sp; last = now;
if(st.light === "green" && st.hold) st.prog = Math.min(100, st.prog + c.speed * dt);
if(st.light === "red" && st.hold && !st.redErr && now - st.redAt > c.grace * sp){ st.redErr = true; st.caught++; mtErr(); rlFlash(); st.prog = Math.max(0, st.prog - 12); }
const bar = document.getElementById("rlProg"); if(bar) bar.style.width = st.prog + "%"; const z = document.getElementById("rlRunner"); if(z) z.style.left = `calc(${st.prog}% - 24px)`;
if(st.prog >= 100){ st.phase = "done"; gameSfx("correct"); mtFinish(` Bitiş çizgisi! Yakalanma: ${st.caught}`); return; } requestAnimationFrame(frame); };
requestAnimationFrame(frame); },
wt(){ const st = mtState, tr = st.trials[st.ti]; st.tray = []; st.phase = "order"; renderMtBoard(); sayTask("Sipariş: " + tr.order.map(o => `${o.n} ${o.x.n}`).join(", "));
if(tr.hide) mtLater(() => { st.phase = "input"; renderMtBoard(); }, tr.ms); else { st.phase = "input"; renderMtBoard(); } },
dr(){ const st = mtState, c = st.cfg; st.phase = "demo"; st.k = -1; renderMtBoard(); const sp = window.__wmSpeed || 1, t0 = performance.now() + 400 * sp, total = c.demo + c.taps;
st.beats = Array.from({length: total}, (_, k) => t0 + k * c.beat * sp);
st.beats.forEach((bt, k) => mtLater(() => { st.k = k; if(k === c.demo){ st.phase = "tap"; renderMtBoard(); } try{ rhyBeep(); }catch(e){} const r = document.getElementById("drRing"); if(r){ r.classList.remove("pulse"); void r.offsetWidth; r.classList.add("pulse"); } }, 400 + k * c.beat));
mtLater(() => { for(let k = c.demo; k < total; k++) if(!st.hits[k]) mtErr(); st.phase = "done"; mtFinish(` Tam zamanında: ${st.score}/${c.taps}`); }, 400 + total * c.beat + c.win + 200); },
kav(){ const st = mtState, c = st.cfg, pre = isPre(); st.phase = "run"; renderMtBoard(); sayTask(pre ? `Yalnızca ${st.tg === "taşıt" ? "taşıtlara" : st.tg === "hayvan" ? "hayvanlara" : st.tg === "meyve" ? "meyvelere" : "oyuncaklara"} dokun!` : `Yalnızca ${KA_CATS[st.tg]} olanlara dokun!`);
const area = document.getElementById("pkArea"); if(!area) return; const total = c.N * 2, kinds = shuffleArray(Array.from({length: total}, (_, i) => i < c.N)); let made = 0, tgtMade = 0;
const spawn = () => { if(!pkAlive(st) || st.phase !== "run" || made >= total) return; const isT = kinds[made++]; if(isT) tgtMade++;
if(c.sw && tgtMade === Math.ceil(c.N / 2) && !st.switched){ st.switched = true; st.tg = randomItem(st.keys.filter(k => k !== st.tg)); sayTask(`Şimdi ${KA_CATS[st.tg]}!`); const h = document.getElementById("pkTgt"); if(h) h.textContent = KA_CATS[st.tg]; }
const cat = isT ? st.tg : randomItem(st.keys.filter(k => k !== st.tg)), v = randomItem(st.P[cat]), id = st.next++, el = document.createElement("div");
el.className = "pk-word"; el.dataset.mt = id; el.innerHTML = pre ? `<img src="${v.src}" alt="">` : v; el.style.top = (8 + Math.random() * 76) + "%"; area.appendChild(el);
st.items.push({ id, cat, el, t0: performance.now() }); mtLater(spawn, c.gap); };
spawn();
const frame = (now) => { if(!pkAlive(st) || st.phase !== "run") return; const Wd = area.clientWidth;
for(const it of st.items.slice()){ const u = (now - it.t0) / (c.cross * 1000 * (window.__wmSpeed || 1)); it.el.style.left = (Wd + 10 - u * (Wd + 140)) + "px";
if(u >= 1){ if(it.cat === st.tg) mtErr(); it.el.remove(); st.items.splice(st.items.indexOf(it), 1); } }
if(made >= total && !st.items.length){ st.phase = "done"; mtFinish(` Yakalanan: ${st.score}`); return; } requestAnimationFrame(frame); };
requestAnimationFrame(frame); },
ubal(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "run"; renderMtBoard(); sayTask(`${tr.w} ile sonu benzeyen balığı yakala!`); const my = st.ti, t0 = performance.now();
const frame = (now) => { if(!pkAlive(st) || st.ti !== my || st.phase !== "run") return; const u = (now - t0) / (tr.dur * 1000 * (window.__wmSpeed || 1));
document.querySelectorAll(".pk-fish").forEach((f, k) => { const dir = k % 2 ? -1 : 1, x = dir > 0 ? -20 + u * 130 : 110 - u * 130; f.style.left = x + "%"; f.style.transform = dir < 0 ? "scaleX(-1)" : ""; const sp = f.querySelector("span"); if(sp) sp.style.transform = dir < 0 ? "scaleX(-1)" : ""; });
if(u >= 1){ mtErr(); st.phase = "fb"; renderMtBoard(); mtLater(NEW_MT.next, 900); return; } requestAnimationFrame(frame); };
requestAnimationFrame(frame); },
htrn(){ const st = mtState, tr = st.trials[st.ti]; st.placed = []; st.bad = {}; st.phase = "input"; renderMtBoard(); sayTask(tr.pic.n); },
slide(){ const st = mtState; st.phase = "input"; st.peek = true; renderMtBoard(); mtLater(() => { st.peek = false; renderMtBoard(); }, 1800); },
kopru(){ const st = mtState; st.sel = []; st.phase = "input"; renderMtBoard(); },
esc(){ const st = mtState, n = st.n; st.pos = 0; st.phase = "run"; st.cl = []; const used = new Set([0, n * n - 1, 1, n]);
for(let k = 0; k < st.clouds; k++){ let c; do{ c = Math.floor(Math.random() * n * n); } while(used.has(c)); used.add(c); st.cl.push(c); }
renderMtBoard(); const my = mtState;
const tick = () => { if(!pkAlive(st) || st.phase !== "run") return; st.cl = st.cl.map(c => { const W = st.walls[c], nb = []; if(!W.n) nb.push(c - n); if(!W.s) nb.push(c + n); if(!W.e) nb.push(c + 1); if(!W.w) nb.push(c - 1); return nb.length ? randomItem(nb.filter(x => x !== n * n - 1).concat([c])) : c; });
if(st.cl.includes(st.pos)) escHit(); escPaint(); mtLater(tick, st.ms); };
mtLater(tick, st.ms); },
bln(){ const st = mtState, c = st.cfg; st.phase = "run"; renderMtBoard(); sayTask(`Yalnızca ${PK_COLS[st.tgt][0]} balonları patlat!`);
const area = document.getElementById("pkArea"); if(!area) return; const total = c.N * 2, kinds = shuffleArray(Array.from({length: total}, (_, i) => i < c.N)); let made = 0, tgtMade = 0;
const spawn = () => { if(!pkAlive(st) || st.phase !== "run") return; if(made >= total) return; const isT = kinds[made++]; if(isT) tgtMade++;
if(c.sw && tgtMade === Math.ceil(c.N / 2) && !st.switched){ st.switched = true; let n; do{ n = Math.floor(Math.random() * 4); } while(n === st.tgt); st.tgt = n; sayTask(`Şimdi ${PK_COLS[n][0]} balonlar!`); const h = document.getElementById("pkTgt"); if(h){ h.style.background = PK_COLS[n][1]; h.textContent = PK_COLS[n][0]; } }
const col = isT ? st.tgt : randomItem([0, 1, 2, 3].filter(x => x !== st.tgt)), id = st.next++, el = document.createElement("div");
el.className = "pk-bln"; el.dataset.mt = id; el.style.background = `radial-gradient(circle at 35% 30%, #ffffffaa, ${PK_COLS[col][1]} 55%)`; el.style.left = (6 + Math.random() * 76) + "%"; area.appendChild(el);
st.items.push({ id, col, y: 1.05, el, t0: performance.now() }); mtLater(spawn, c.gap); };
spawn();
const frame = (now) => { if(!pkAlive(st) || st.phase !== "run") return; const A = area.clientHeight;
for(const b of st.items.slice()){ const u = (now - b.t0) / (c.rise * 1000 * (window.__wmSpeed || 1)); b.y = 1.05 - u * 1.25; b.el.style.transform = `translate3d(0,${(b.y * A).toFixed(1)}px,0)`;
if(b.y < -0.2){ if(b.col === st.tgt) mtErr(); b.el.remove(); st.items.splice(st.items.indexOf(b), 1); } }
if(made >= total && !st.items.length){ st.phase = "done"; mtFinish(` Patlatılan: ${st.score}`); return; } requestAnimationFrame(frame); };
requestAnimationFrame(frame); },
mol(){ const st = mtState, c = st.cfg; st.phase = "run"; renderMtBoard(); sayTask("Köstebeğe vur, şapkalıya vurma!");
const pop = () => { if(!pkAlive(st) || st.phase !== "run") return; if(st.k >= c.N){ st.phase = "done"; mtFinish(` Yakalanan: ${st.score}`); return; } st.k++;
let h; do{ h = Math.floor(Math.random() * 9); } while(st.cur && h === st.cur.h); const cur = { h, hat: Math.random() < c.hat, hit:false }; st.cur = cur; molDraw();
mtLater(() => { if(st.cur === cur){ if(!cur.hit && !cur.hat) mtErr(); st.cur = null; molDraw(); mtLater(pop, 320); } }, c.up); };
mtLater(pop, 500); },
ctc(){ const st = mtState, c = st.cfg; st.phase = "run"; renderMtBoard(); sayTask("Sepetle meyveleri yakala, taşları yakalama!");
const area = document.getElementById("pkArea"), bk = document.getElementById("pkBasket"); if(!area || !bk) return;
const setX = (e) => { const r = area.getBoundingClientRect(); st.bx = Math.max(0.1, Math.min(0.9, (e.clientX - r.left) / r.width)); bk.style.left = (st.bx * 100) + "%"; };
area.onpointerdown = (e) => { area.setPointerCapture && area.setPointerCapture(e.pointerId); setX(e); }; area.onpointermove = (e) => { if(e.buttons || e.pointerType === "touch") setX(e); };
let made = 0; const fruits = shuffleArray(Array.from({length: c.N}, (_, i) => i >= Math.round(c.N * c.stone)));
const spawn = () => { if(!pkAlive(st) || st.phase !== "run" || made >= c.N) return; const fruit = fruits[made++], el = document.createElement("div"), x = 0.1 + Math.random() * 0.8;
el.className = "pk-fall"; el.style.left = (x * 100) + "%"; const __fi = fruit ? randomItem(qzCats().meyve.items) : null; el.innerHTML = fruit ? `<img src="${cutoutSrc(__fi)}" alt="">` : (gimg("stone") ? `<img src="${gimg("stone")}" alt="">` : PK_STONE_SVG);   /* taş görseli gelince gerçek taş */ area.appendChild(el);
st.items.push({ x, fruit, el, t0: performance.now() }); mtLater(spawn, c.gap); };
spawn();
const frame = (now) => { if(!pkAlive(st) || st.phase !== "run") return; const A = area.clientHeight;
for(const it of st.items.slice()){ const u = (now - it.t0) / (c.fall * 1000 * (window.__wmSpeed || 1)); it.el.style.top = (u * 0.86 * A) + "px";
if(u >= 1){ const caught = Math.abs(it.x - st.bx) < 0.14; if(it.fruit){ if(caught){ st.score++; gameSfx("pop"); } else mtErr(); } else if(caught) mtErr(); it.el.remove(); st.items.splice(st.items.indexOf(it), 1); const hd = document.getElementById("pkScore"); if(hd) hd.textContent = st.score; } }
if(made >= c.N && !st.items.length){ st.phase = "done"; mtFinish(` Yakalanan meyve: ${st.score}`); return; } requestAnimationFrame(frame); };
requestAnimationFrame(frame); },
bag(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "show"; st.bi = -1; renderMtBoard(); const step = isPre() ? 1200 : 950;
tr.inBag.forEach((x, k) => mtLater(() => { st.bi = k; renderMtBoard(); }, 300 + k * step));
mtLater(() => { st.phase = "closed"; renderMtBoard(); }, 300 + tr.inBag.length * step);
mtLater(() => { st.phase = "ask"; st.pick = null; renderMtBoard(); sayTask(tr.askIn ? "Hangisi bavulda?" : "Hangisi bavulda yok?"); }, 300 + tr.inBag.length * step + 900); },
smn(){ const st = mtState; st.seq = []; smnRound(); },
clue(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "clues"; st.shown = 0; renderMtBoard(); const step = isPre() ? 2600 : 2200;
tr.clues.forEach((c, k) => mtLater(() => { st.shown = k + 1; renderMtBoard(); sayTask(c, 0.9); }, 300 + k * step));
mtLater(() => { st.phase = "ask"; st.pick = null; renderMtBoard(); sayTask("Hangisi?"); }, 300 + tr.clues.length * step); },
ctab(){ const st = mtState; st.placed = {}; st.sel = null; st.bad = null; st.phase = "input"; renderMtBoard(); },
cobj(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "show"; st.qi = 0; renderMtBoard(); mtLater(() => { st.phase = "ask"; st.pick = null; renderMtBoard(); sayTask("Bu hangi renk karttaydı?"); }, tr.ms); },
porder(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "show"; st.si = -1; st.pos = 0; renderMtBoard(); tr.seq.forEach((x, k) => mtLater(() => { st.si = k; renderMtBoard(); }, 300 + k * tr.ms)); mtLater(() => { st.si = -1; renderMtBoard(); }, 300 + tr.seq.length * tr.ms - 200);
mtLater(() => { st.phase = "input"; renderMtBoard(); }, 300 + tr.seq.length * tr.ms + 300); },
ftrace(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "run"; st.inN = 0; st.totN = 0; st.finger = null; renderMtBoard();
const area = document.getElementById("ftArea"), dot = document.getElementById("ftDot"); if(!area || !dot) return;
const pos = (e) => { const r = area.getBoundingClientRect(); st.finger = [e.clientX - r.left, e.clientY - r.top]; };
area.onpointerdown = (e) => { area.setPointerCapture && area.setPointerCapture(e.pointerId); pos(e); }; area.onpointermove = (e) => { if(e.buttons || e.pointerType === "touch") pos(e); }; area.onpointerup = area.onpointercancel = () => { st.finger = null; };
const t0 = performance.now(), D = tr.dur * 1000 * (window.__wmSpeed || 1), my = st.ti;
const frame = (now) => { if(mtState !== st || st.ti !== my || st.phase !== "run" || !timerRunning) return; const u = Math.min(1, (now - t0) / D), [px, py] = ftPos(tr.p, u), W2 = area.clientWidth, H2 = area.clientHeight, x = px * W2, y = py * H2;
dot.style.left = (x - 18) + "px"; dot.style.top = (y - 18) + "px"; if(now - t0 > 600 * (window.__wmSpeed || 1)){ st.totN++; if(st.finger && Math.hypot(st.finger[0] - x, st.finger[1] - y) <= tr.R) st.inN++; }
dot.classList.toggle("on", !!(st.finger && Math.hypot(st.finger[0] - x, st.finger[1] - y) <= tr.R));
if(u >= 1){ const ratio = st.totN ? st.inN / st.totN : 0; st.res.push(Math.round(ratio * 100)); if(ratio < 0.7) mtErr(); else gameSfx("correct"); st.last = ratio; st.phase = "fb"; renderMtBoard(); mtLater(NEW_MT.next, 1200); return; }
requestAnimationFrame(frame); };
requestAnimationFrame(frame); },
ecount(){ const st = mtState; st.phase = "judge"; renderMtBoard(); },
nword(){ const st = mtState; st.phase = "learn"; st.li = -1; renderMtBoard(); const step = isPre() ? 3200 : 2600;
st.learn.forEach((x, k) => mtLater(() => { st.li = k; renderMtBoard(); sayTask(`Bu bir ${x.nm}. ${cap(x.nm)}!`, 0.85); }, 300 + k * step));
mtLater(() => { st.phase = "ask"; st.qi = 0; renderMtBoard(); sayTask(`Hangisi ${st.test[0].nm}?`); }, 300 + st.learn.length * step + 300); },
pairm(){ const st = mtState; st.pk = []; st.bad = {}; st.phase = "input"; renderMtBoard(); },
per(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "wait"; renderMtBoard(); mtLater(() => { st.phase = "show"; renderMtBoard(); const my = st.ti; mtLater(() => { if(st.phase === "show" && st.ti === my){ if(!tr.lure) mtErr(); st.phase = "fb"; NEW_MT.next(); } }, tr.ms); }, 600 + Math.random() * 900); },
fix(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "run"; st.fl = []; renderMtBoard(); const n = Math.floor(tr.secs * 1000 / tr.rate);
for(let k = 0; k < n; k++) mtLater(() => { st.fl = [{ x: 5 + Math.random() * 85, y: 5 + Math.random() * 80, sh: randomItem(["star","heart","circle"]), c: randomItem(COLORS) }]; const b = document.getElementById("fixArea"); if(b){ const f = st.fl[0]; const old = b.querySelector(".fx-f"); if(old) old.remove(); const d = document.createElement("div"); d.className = "fx-f"; d.style.cssText = `position:absolute;left:${f.x}%;top:${f.y}%;width:46px;height:46px`; d.innerHTML = shapeSVG(f.sh, f.c); b.appendChild(d); } }, k * tr.rate);
mtLater(() => { st.phase = "judge"; renderMtBoard(); }, tr.secs * 1000); },
dual(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "run"; st.tgt = null; st.miss = 0; st.hit = 0; renderMtBoard();
tr.bt.forEach(tm => mtLater(() => rhyBeep(), tm));
tr.st.forEach((tm, k) => mtLater(() => { st.tgt = { k, x: 8 + Math.random() * 78, y: 8 + Math.random() * 74 }; const a = document.getElementById("dualArea"); if(a){ const old = a.querySelector(".du-t"); if(old) old.remove(); const d = document.createElement("div"); d.className = "du-t"; d.dataset.mt = "t" + k; d.style.cssText = `position:absolute;left:${st.tgt.x}%;top:${st.tgt.y}%;width:58px;height:58px;cursor:pointer`; d.innerHTML = shapeSVG("star", "#F5A524"); a.appendChild(d); }
mtLater(() => { if(st.tgt && st.tgt.k === k){ st.tgt = null; st.miss++; mtErr(); const a2 = document.getElementById("dualArea"); const o = a2 && a2.querySelector(".du-t"); if(o) o.remove(); } }, tr.show); }, tm));
mtLater(() => { st.phase = "ask"; st.tgt = null; renderMtBoard(); sayTask("Kaç bip sesi duydun?"); }, tr.secs * 1000); },
stop(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "fix"; st.red = false; renderMtBoard(); const my = st.ti;
mtLater(() => { if(st.ti !== my) return; st.phase = "go"; st.red = !!tr.stop; st.t0 = performance.now(); renderMtBoard();   /* kırmızı ok doğrudan kırmızı gelir (maviden dönmez) */
mtLater(() => { if(st.ti === my && st.phase === "go"){ if(!tr.stop) mtErr(); else gameSfx("correct"); st.phase = "fb"; renderMtBoard(); mtLater(NEW_MT.next, 350); } }, tr.win || 1600); }, 500); },   /* mavi ve kırmızı aynı süre ekranda */
tapr(){ const st = mtState, my = st.ti; st.phase = "show"; st.taps = 0; st.fb = null; renderMtBoard(); const win = (isPre() ? [3000, 2600, 2400] : [2400, 2000, 1700])[Math.min(currentCombo().t, 2)];
  mtLater(() => { if(st.ti === my && st.phase === "show") taprEval(); }, win); },
statue(){ const st = mtState; st.phase = "run"; st.left = st.cfg.secs; renderMtBoard();
  const tick = () => { if(st.phase !== "run") return; st.left--; const el = document.getElementById("statueLeft"); if(el) el.textContent = st.left; if(st.left <= 0){ st.phase = "done"; renderMtBoard(); stopTimer(); showLevelFlash("Süre doldu! Hata sayısını kontrol edin.", "levelup"); return; } mtLater(tick, 1000); }; mtLater(tick, 1000);
  st.cfg.ds.forEach(tm => mtLater(() => { if(st.phase !== "run") return; sfx(randomItem(STATUE_SOUNDS)); const el = document.getElementById("statueDist"); if(el){ el.classList.add("on"); mtLater(() => el.classList.remove("on"), 900); } }, tm)); },
hold(){ const st = mtState; st.phase = "wait"; st.holding = false; st.ok = null; st.early = 0; renderMtBoard(); },
fist(){ const st = mtState, tr = st.trials[st.ti]; tr.found = []; tr.sel = []; st.phase = "input"; st.fb = null; renderMtBoard(); },
wcst(){ const st = mtState; st.phase = "input"; st.fb = null; st.pick = null; renderMtBoard(); },
rev(){ const st = mtState; st.phase = "input"; st.fb = null; st.pick = null; renderMtBoard(); },
zoo(){ const st = mtState, tr = st.trials[st.ti]; tr.cur = 6; tr.used = []; tr.visited = []; tr.bad = 0; st.phase = "input"; st.fb = null; renderMtBoard(); },
keys(){ const st = mtState, tr = st.trials[st.ti]; tr.pts = []; st.phase = "input"; renderMtBoard(); },
jars(){ const st = mtState, tr = st.trials[st.ti]; tr.lv = tr.caps.map(() => 0); tr.moves = 0; tr.sel = -1; tr.solved = false; st.phase = "input"; renderMtBoard(); },
dfl(){ const st = mtState; st.phase = "input"; st.left = st.cfg.secs; st.designs = []; st.cur = []; st.sel = -1; st.uniq = 0; st.rep = 0; renderMtBoard();
  const tick = () => { if(st.phase !== "input") return; st.left--; const el = document.getElementById("dflLeft"); if(el) el.textContent = st.left; if(st.left <= 0){ dflCommit(); mtFinish(` Farklı desen: ${st.uniq} · tekrar: ${st.rep}`); return; } mtLater(tick, 1000); }; mtLater(tick, 1000); },
twq(){ const st = mtState, tr = st.trials[st.ti]; tr.q = 0; tr.gone = {}; st.phase = "input"; renderMtBoard(); },
bsearch(){ const st = mtState, tr = st.trials[st.ti]; tr.found = []; tr.opened = []; tr.k = 0; st.last = -1; st.show = null; st.phase = "input"; renderMtBoard(); },
six(){ const st = mtState; st.phase = "input"; st.left = st.cfg.secs; st.view = "menu"; st.done = {}; st.lastTask = null; st.breaks = 0; st.hits = {}; renderMtBoard();
  const tick = () => { if(st.phase !== "input") return; st.left--; const el = document.getElementById("sixLeft"); if(el) el.textContent = st.left; if(st.left <= 0){ sixFinish(); return; } mtLater(tick, 1000); }; mtLater(tick, 1000); },
selfchk(){ const st = mtState; st.view = "run"; st.phase = "run"; st.cur = 0; st.t0 = performance.now(); renderMtBoard(); scArm(); },
cgt(){ const st = mtState; st.phase = "input"; st.fb = null; renderMtBoard(); },
ktrack(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "study"; st.si = -1; st.qi = 0; tr.judge = {}; renderMtBoard(); const step = isPre() ? 1900 : 1500;
  tr.seq.forEach((x, k) => mtLater(() => { st.si = k; renderMtBoard(); sayTask(x.n, 0.9); }, 300 + k * step));
  mtLater(() => { st.phase = "ask"; st.si = -1; renderMtBoard(); sayTask("Her grubun en son geleni söyle.", 0.9); }, 300 + tr.seq.length * step + 300); },
vig(){ const st = mtState; st.phase = "run"; renderMtBoard(); const step = () => { if(st.phase !== "run") return; if(st.i >= 0 && st.seq[st.i].tg && !st.resp) { st.miss++; mtErr(); }
st.i++; st.resp = false; if(st.i >= st.seq.length){ st.phase = "done"; mtFinish(` İsabet: ${st.hits} · kaçırılan: ${st.miss} · yanlış alarm: ${st.fa}`); return; }
const it = st.seq[st.i], b = document.getElementById("vigShape"); if(b) b.innerHTML = shapeSVG(it.sh, it.col); const c = document.getElementById("vigCnt"); if(c) c.textContent = `${st.i + 1}/${st.seq.length}`; mtLater(step, st.ms); };
mtLater(step, 500); },
pnb(){ const st = mtState; st.phase = "run"; renderMtBoard(); const step = () => { if(st.phase !== "run") return;
if(st.i >= st.n && st.seq[st.i] === st.seq[st.i - st.n] && !st.resp[st.i]){ mtErr(); }
st.i++; if(st.i >= st.seq.length){ st.phase = "done"; mtFinish(); return; } const g = document.getElementById("pnbGrid"); if(g){ g.querySelectorAll(".pnb-c").forEach((c, k) => c.classList.toggle("on", k === st.seq[st.i])); mtLater(() => { const g2 = document.getElementById("pnbGrid"); if(g2) g2.querySelectorAll(".pnb-c").forEach(c => c.classList.remove("on")); }, st.ms - 400); }
const c = document.getElementById("pnbCnt"); if(c) c.textContent = `${st.i + 1}/${st.seq.length}`; mtLater(step, st.ms); };
mtLater(step, 600); },
csp(){ const st = mtState; st.ci = 0; st.pos = 0; st.phase = "count"; renderMtBoard(); },
tone(){ const st = mtState, seq = st.trials[st.ti]; st.pos = 0; st.phase = "play"; st.lit = -1; renderMtBoard();
seq.forEach((k, j) => { mtLater(() => { toneBeep(TONE_KEYS[k].f); if(st.lights){ st.lit = k; renderMtBoard(); mtLater(() => { st.lit = -1; renderMtBoard(); }, 420); } }, 400 + j * 700); });
mtLater(() => { st.phase = "input"; renderMtBoard(); }, 400 + seq.length * 700 + 200); },
wseen(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "show"; renderMtBoard(); mtLater(() => { st.phase = "gap"; renderMtBoard(); mtLater(() => { st.phase = "ask"; st.pick = null; renderMtBoard(); }, 500); }, tr.ms); },
route(){ const st = mtState, tr = st.trials[st.ti]; st.phase = "show"; st.step = -1; st.pos = 0; renderMtBoard(); tr.path.forEach((c, k) => mtLater(() => { st.step = k; renderMtBoard(); }, 300 + k * (isPre() ? 750 : 600)));
mtLater(() => { st.phase = "input"; st.step = -1; st.pos = 1; renderMtBoard(); }, 300 + tr.path.length * (isPre() ? 750 : 600) + 400); },
sbuild(){ const st = mtState; st.placed = []; st.bad = {}; st.phase = "input"; renderMtBoard(); },
spotd(){ const st = mtState; st.found = {}; st.bad = {}; st.phase = "input"; renderMtBoard(); },
sdk(){ const st = mtState, tr = st.trials[st.ti]; st.cells = tr.given.slice(); st.sel = 0; st.phase = "input"; renderMtBoard(); },
parr(){ const st = mtState, tr = st.trials[st.ti]; st.bad = {}; st.placed = tr.given ? [tr.cards.indexOf(0)] : []; st.phase = "input"; renderMtBoard(); },
blk(){ const st = mtState, tr = st.trials[st.ti]; st.cells = Array(tr.n * tr.n).fill(0); st.phase = "input"; renderMtBoard(); },
clut(){ const st = mtState; st.phase = "input"; renderMtBoard(); },
sym(){ const st = mtState; st.mine = {}; st.phase = "input"; renderMtBoard(); },
maze(){ const st = mtState; st.pos = 0; st.path = [0]; st.phase = "input"; renderMtBoard(); },
draw(){ const st = mtState; if(st.copy){ st.mine = new Set(); st.sel = -1; st.phase = "input"; renderMtBoard(); return; } st.phase = "study"; st.mine = new Set(); st.sel = -1; renderMtBoard();
mtLater(() => { st.phase = "input"; renderMtBoard(); }, 2500 + st.trials[st.ti].size * 600); }
},
next(){ const st = mtState; st.ti++; if(st.ti >= st.trials.length){ mtFinish(); return; } NEW_MT.start[st.kind](); },
tap: {
fist(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; const k = tr.sel.indexOf(i); if(k >= 0){ tr.sel.splice(k, 1); renderMtBoard(); return; } tr.sel.push(i); if(tr.sel.length < 2){ renderMtBoard(); return; }
  const [a, b] = tr.sel.map(x => tr.cards[x].id); const pr = tr.pairs.find(p => fistPairKey(p[0], p[1]) === fistPairKey(a, b)); const key = pr ? fistPairKey(a, b) : null;
  if(pr && !tr.found.includes(key)){ tr.found.push(key); st.okN++; st.fb = { ok:true, dim: pr[2], sel: tr.sel.slice() }; gameSfx("correct"); } else { mtErr(); st.fb = { ok:false, sel: tr.sel.slice(), dim: pr ? pr[2] : null, rep: !!pr }; }
  tr.sel = []; st.phase = "fb"; renderMtBoard(); mtLater(() => { st.fb = null; if(tr.found.length >= tr.need){ NEW_MT.next(); } else { st.phase = "input"; renderMtBoard(); } }, st.fb && st.fb.ok ? 800 : 1200); },
wcst(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; const ok = tr.m[st.rule] === i; st.pick = i;
  if(ok){ st.okN++; st.streak++; gameSfx("correct"); } else { mtErr(); st.streak = 0; if(st.lastRule && tr.m[st.lastRule] === i) st.pers++; }
  st.fb = ok ? "ok" : "bad"; st.phase = "fb"; renderMtBoard();
  if(st.streak >= st.cfg.K){ st.lastRule = st.rule; st.ri = (st.ri + 1) % st.cfg.rules.length; st.rule = st.cfg.rules[st.ri]; st.streak = 0; st.shifts++; }   /* kural sessizce değişir */
  mtLater(NEW_MT.next, ok ? 500 : 900); },
rev(i){ const st = mtState; if(st.phase !== "input") return; const ok = i === st.win; st.pick = i;
  if(ok){ st.okN++; st.streak++; gameSfx("correct"); } else { mtErr(); st.streak = 0; }
  st.fb = ok ? "ok" : "bad"; st.phase = "fb"; renderMtBoard();
  if(st.streak >= st.cfg.K && st.revs < st.cfg.maxRev){ st.win = 1 - st.win; st.streak = 0; st.revs++; }   /* yıldız veren resim sessizce değişir */
  mtLater(NEW_MT.next, ok ? 700 : 900); },
zoo(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; const e = zooAdj(tr.E, tr.cur, i); if(i === tr.cur) return;
  if(!e){ st.fb = "nopath"; mtErr(); renderMtBoard(); mtLater(() => { st.fb = null; renderMtBoard(); }, 700); return; }
  if(tr.used.includes(e)){ st.fb = "used"; tr.bad++; mtErr(); renderMtBoard(); mtLater(() => { st.fb = null; renderMtBoard(); }, 900); return; }
  if(tr.ordered && tr.req.includes(i) && !tr.visited.includes(i)){ const nextReq = tr.req.find(r => !tr.visited.includes(r)); if(nextReq !== i){ st.fb = "order"; tr.bad++; mtErr(); } }
  tr.used.push(e); tr.cur = i; if(tr.req.includes(i) && !tr.visited.includes(i)){ tr.visited.push(i); gameSfx("pop"); }
  if(i === 8){ const miss = tr.req.filter(r => !tr.visited.includes(r)).length; for(let k = 0; k < miss; k++) mtErr(); st.phase = "fb"; st.fb = miss ? "miss" : "ok"; if(!miss){ st.okN++; gameSfx("correct"); } renderMtBoard(); mtLater(NEW_MT.next, miss ? 2000 : 1200); return; }
  renderMtBoard(); },
jars(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || tr.solved) return;
  if(tr.sel < 0 || tr.sel === i){ tr.sel = tr.sel === i ? -1 : i; renderMtBoard(); return; }
  const amt = Math.min(tr.lv[tr.sel], tr.caps[i] - tr.lv[i]); if(amt > 0){ tr.lv[tr.sel] -= amt; tr.lv[i] += amt; tr.moves++; gameSfx("pop"); } tr.sel = -1; jarCheck(); renderMtBoard(); },
dfl(i){ const st = mtState; if(st.phase !== "input") return; if(st.sel < 0){ st.sel = i; renderMtBoard(); return; } if(st.sel === i){ st.sel = -1; renderMtBoard(); return; } const key = dflKey([[st.sel, i]]); if(!st.cur.some(l => dflKey([l]) === key)) st.cur.push([st.sel, i]); st.sel = i; gameSfx("pop"); renderMtBoard(); },
twq(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; tr.gone[i] = !tr.gone[i]; renderMtBoard(); },
bsearch(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || st.show) return;
  if(tr.found.includes(i)){ mtErr(); st.show = { i, kind:"again" }; } else if(tr.opened.includes(i)){ mtErr(); st.show = { i, kind:"within" }; } else if(tr.order[tr.k] === i){ st.show = { i, kind:"star" }; } else { st.show = { i, kind:"empty" }; tr.opened.push(i); }
  renderMtBoard(); mtLater(() => { if(st.show && st.show.kind === "star"){ tr.found.push(i); tr.k++; tr.opened = []; st.okN++; gameSfx("correct"); } st.show = null;
    if(tr.k >= tr.N){ st.phase = "fb"; renderMtBoard(); mtLater(NEW_MT.next, 900); } else renderMtBoard(); }, st.show.kind === "star" ? 700 : 600); },
six(i){ const st = mtState; if(st.phase !== "input") return; const v = String(i);
  if(st.view === "menu"){ if(st.done[v]) return; const task = v[0]; if(st.lastTask === task){ st.breaks++; mtErr(); } st.lastTask = task; st.view = v; st.hits[v] = []; renderMtBoard(); return; }
  const P = st.cfg.parts[st.view], idx = Number(i), cell = P.cells[idx]; if(!cell) return; const hits = st.hits[st.view]; if(hits.includes(idx)) return;
  const want = P.ordered ? P.targets[hits.length] : null; const ok = P.ordered ? cell.v === want : P.targets.includes(cell.v);
  if(ok){ hits.push(idx); gameSfx("pop"); if(hits.length >= P.targets.length){ st.done[st.view] = true; st.view = "menu"; gameSfx("correct"); if(Object.keys(st.done).length >= 6){ sixFinish(); return; } } } else { mtErr(); st.badCell = idx; mtLater(() => { st.badCell = null; renderMtBoard(); }, 500); }
  renderMtBoard(); },
selfchk(i){ const st = mtState; if(st.phase !== "review") return; const it = st.trials[Number(i)]; if(!it) return; it.mark = !it.mark; renderMtBoard(); },
cgt(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; const risky = (tr.swap ? 1 - i : i) === 0; const k = st.picks.length, loss = risky ? st.cfg.riskLoss[k % st.cfg.riskLoss.length] : st.cfg.safeLoss[k % st.cfg.safeLoss.length], gain = risky ? 2 : 1;
  st.picks.push(risky ? "R" : "S"); st.stars += gain - loss; if(k >= Math.floor(st.cfg.N / 2)){ if(risky){ mtErr(); } else st.okN++; }   /* ikinci yarıda riskli seçim hata */
  st.fb = { i, gain, loss }; st.phase = "fb"; gameSfx(loss ? "wrong" : "correct"); renderMtBoard(); mtLater(NEW_MT.next, loss ? 1300 : 900); },
hear(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || st.found[i] || st.bad[i]) return;
if(tr.heard.includes(tr.opts[i])){ st.found[i] = 1; gameSfx("correct"); renderMtBoard();
if(Object.keys(st.found).length >= tr.heard.length){ st.phase = "fb"; mtLater(NEW_MT.next, 700); } }
else { st.bad[i] = 1; mtErr(); renderMtBoard(); } },
dir(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || st.marks[i]) return;
if(tr.ord[st.pos] === i){ st.marks[i] = "ok"; st.pos++; gameSfx("correct"); renderMtBoard(); if(st.pos >= tr.ord.length){ st.phase = "fb"; mtLater(NEW_MT.next, 700); } }
else { st.marks[i] = "bad"; mtErr(); st.phase = "fb"; st.reveal = true; renderMtBoard(); mtLater(() => { st.reveal = false; NEW_MT.next(); }, 1600); } },
miss(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "ask") return; st.pick = i; st.phase = "fb";
const ok = tr.opts[i] === tr.set[tr.gone]; if(ok) gameSfx("correct"); else mtErr(); renderMtBoard(); mtLater(NEW_MT.next, ok ? 700 : 1500); },
chg(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "ask") return; st.pick = i; st.phase = "fb";
const ok = i === tr.at; if(ok) gameSfx("correct"); else mtErr(); renderMtBoard(); mtLater(NEW_MT.next, ok ? 700 : 1500); },
face(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return;
if(tr.mode === "recog"){ if(st.found[i] || st.bad[i]) return; const fid = tr.opts[i];
if(tr.study.includes(fid)){ st.found[i] = 1; gameSfx("correct"); renderMtBoard(); if(Object.keys(st.found).length >= tr.study.length){ st.phase = "fb"; mtLater(NEW_MT.next, 700); } }
else { st.bad[i] = 1; mtErr(); renderMtBoard(); } return; }
const want = tr.order[st.qi], ok = i === want; st.pick = i; st.phase = "fb"; if(ok) gameSfx("correct"); else mtErr(); renderMtBoard();
mtLater(() => { st.pick = null; st.qi++; if(st.qi >= tr.order.length){ NEW_MT.next(); return; } st.phase = "input"; sayTask("Hangisi " + tr.ppl[tr.order[st.qi]].nm + "?"); renderMtBoard(); }, ok ? 600 : 1300); },
quiz(i){ qzTap(i); },
dots(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "ask") return; st.pick = i; st.phase = "fb"; const ok = i === tr.n; if(ok) gameSfx("correct"); else mtErr(); renderMtBoard(); mtLater(NEW_MT.next, ok ? 500 : 1100); },
chase(i){ const st = mtState; if(st.phase !== "run") return; if(i === 1){ st.hits++; gameSfx("correct"); const b = document.getElementById("chaseBall"); if(b){ b.classList.remove("hit"); void b.offsetWidth; b.classList.add("hit"); }
const c = document.getElementById("chaseCnt"); if(c) c.textContent = `${st.hits}/${st.need}`; if(st.hits >= st.need){ st.phase = "done"; mtFinish(); } }
else { mtErr(); } },
ferr(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || st.sel[i]) return; const it = tr.items[i];   /* KURAL (Hatayı Bul): Bitti düğmesi yok — kurala uymayana dokununca yeşil işaretlenir, hepsi bulununca sıradaki kendiliğinden gelir; kurala uyana dokunmak hata sayılır ve kısa kırmızı yanar */
  if(it && it.bad){ st.sel[i] = true; gameSfx("correct"); const left = tr.items.some((x, j) => x.bad && !st.sel[j]); if(!left){ st.phase = "fb"; renderMtBoard(); mtLater(() => { st.sel = {}; st.flashBad = null; NEW_MT.next(); }, 800); return; } renderMtBoard(); }
  else { mtErr(); st.flashBad = i; renderMtBoard(); setTimeout(() => { if(mtState === st && st.flashBad === i){ st.flashBad = null; renderMtBoard(); } }, 600); } },
cups(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "ask") return; st.pick = i; st.phase = "fb"; const ok = i === tr.ball; if(ok) gameSfx("correct"); else mtErr(); renderMtBoard(); mtLater(NEW_MT.next, ok ? 900 : 1500); },
mmath(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "ask") return; st.pick = i; st.phase = "fb"; const ok = tr.opts[i] === tr.res; if(ok) gameSfx("correct"); else mtErr(); renderMtBoard(); mtLater(NEW_MT.next, ok ? 600 : 1400); },
who(i){ const st = mtState, it = st.test[st.qi]; if(st.phase !== "ask") return; st.pick = i; st.phase = "fb"; const ok = i === it.p; if(ok) gameSfx("correct"); else mtErr(); renderMtBoard();
mtLater(() => { st.qi++; st.pick = null; if(st.qi >= st.test.length){ mtFinish(); return; } st.phase = "ask"; renderMtBoard(); }, ok ? 550 : 1300); },
rhy(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; st.taps.push(performance.now()); rhyBeep(); const d = document.getElementById("rhyDrum"); if(d){ d.classList.remove("hit"); void d.offsetWidth; d.classList.add("hit"); }
const c = document.getElementById("rhyCnt"); if(c) c.textContent = `${st.taps.length}/${tr.L}`; if(st.taps.length >= tr.L) rhyEval(); },
mem(i){ const st = mtState; if(st.phase !== "input" || st.lock || st.done[i] || st.open.includes(i)) return; st.open.push(i); gameSfx("pop"); renderMtBoard();
if(st.open.length === 2){ const [a, b] = st.open; if(st.cards[a].x === st.cards[b].x){ st.done[a] = st.done[b] = 1; st.open = []; gameSfx("correct"); renderMtBoard(); if(Object.keys(st.done).length === st.cards.length){ st.phase = "fb"; mtLater(() => mtFinish(` Açma denemesi: ${st.miss + st.P}, eşleşmeyen: ${st.miss}.`), 500); } }
else { st.miss++; if(st.miss > st.P) mtErr(); st.lock = true; mtLater(() => { st.open = []; st.lock = false; renderMtBoard(); }, 900); } } },
ssnd(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || st.found[i] || st.bad[i]) return;
if(trFirst(tr.opts[i].n) === tr.s){ st.found[i] = 1; gameSfx("correct"); renderMtBoard(); if(Object.keys(st.found).length >= tr.opts.filter(x => trFirst(x.n) === tr.s).length){ st.phase = "fb"; mtLater(NEW_MT.next, 700); } }
else { st.bad[i] = 1; mtErr(); renderMtBoard(); mtLater(() => sayTask(`${tr.opts[i].n}`), 150); } },
seqw(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || st.placed.includes(i)) return;
if(tr.cards[i] === st.placed.length){ st.placed.push(i); gameSfx("correct"); renderMtBoard(); if(st.placed.length === tr.seq.length){ st.phase = "fb"; mtLater(() => { NEW_MT.next(); }, 800); } }
else { st.bad[i] = 1; mtErr(); renderMtBoard(); mtLater(() => { delete st.bad[i]; renderMtBoard(); }, 900); } },
spic(i){ const st = mtState; if(st.phase !== "input") return; const cur = st.queue[st.qi];
if(i === cur.bi){ gameSfx("correct"); st.qi++; st.bad = -1; if(st.qi >= st.queue.length){ st.phase = "fb"; renderMtBoard(); mtLater(() => mtFinish(), 400); return; } renderMtBoard(); }
else { mtErr(); st.bad = i; renderMtBoard(); mtLater(() => { if(st.bad === i){ st.bad = -1; renderMtBoard(); } }, 600); } },
fsort(i){ const st = mtState; if(st.phase !== "input") return; st.asg[i] = st.asg[i] === st.sel ? undefined : st.sel; if(st.asg[i] === undefined) delete st.asg[i]; gameSfx("pop"); renderMtBoard(); },
storyord(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || st.placed.includes(i)) return; const c = tr.cards[i];
if(!c.extra && c.k === st.placed.length){ st.placed.push(i); gameSfx("correct"); renderMtBoard();
if(st.placed.length === 3){ st.phase = "fb"; mtLater(NEW_MT.next, 900); } }
else { st.bad[i] = 1; mtErr(); renderMtBoard(); mtLater(() => { delete st.bad[i]; renderMtBoard(); }, 900); } },
size(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || st.marks[i]) return;
if(tr.order[i] === (st.desc ? tr.sizes.length - 1 - st.pos : st.pos)){ st.marks[i] = "ok"; st.pos++; gameSfx("correct"); renderMtBoard(); if(st.pos >= tr.sizes.length){ st.phase = "fb"; mtLater(() => { st.marks = {}; st.pos = 0; NEW_MT.next(); }, 600); } }
else { st.marks[i] = "bad"; mtErr(); renderMtBoard(); mtLater(() => { if(st.marks[i] === "bad"){ delete st.marks[i]; renderMtBoard(); } }, 600); } },
samenum(i){ const st = mtState; if(st.phase !== "input" || st.found[i] || st.bad[i]) return; const it = st.items[i];
if(it.tgt){ st.found[i] = 1; gameSfx("correct"); renderMtBoard(); if(Object.keys(st.found).length >= st.items.filter(x => x.tgt).length){ st.phase = "fb"; mtLater(() => mtFinish(), 500); } }
else { st.bad[i] = 1; mtErr(); renderMtBoard(); } },
scenet(i){ const st = mtState, q = st.qs[st.qi]; if(st.phase !== "ask") return; st.pick = i; st.phase = "fb";
const ok = q.opts[i] === q.ans; if(ok) gameSfx("correct"); else mtErr(); renderMtBoard();
mtLater(() => { st.qi++; st.pick = null; if(st.qi >= st.qs.length){ mtFinish(); return; } st.phase = "ask"; renderMtBoard(); }, ok ? 600 : 1300); },
wt(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; if(typeof i === "string" && i[0] === "t"){ st.tray.splice(Number(i.slice(1)), 1); renderMtBoard(); return; } if(st.tray.length < 9){ st.tray.push(i); gameSfx("pop"); renderMtBoard(); } },
dr(i){ const st = mtState, c = st.cfg; if(st.phase !== "tap") return; const now = performance.now(), sp = window.__wmSpeed || 1; let best = -1, bd = 1e9;
for(let k = c.demo; k < st.beats.length; k++){ const d = Math.abs(now - st.beats[k]); if(d < bd){ bd = d; best = k; } }
const d = document.getElementById("drDrum"); if(d){ d.classList.remove("hit"); void d.offsetWidth; d.classList.add("hit"); }
if(best >= 0 && bd <= c.win * sp && !st.hits[best]){ st.hits[best] = true; st.score++; gameSfx("pop"); const s2 = document.getElementById("pkScore"); if(s2) s2.textContent = st.score; } else mtErr(); },
kav(i){ const st = mtState; if(st.phase !== "run") return; const it = st.items.find(x => x.id === i); if(!it) return; if(it.cat === st.tg){ st.score++; gameSfx("pop"); } else mtErr();
it.el.classList.add("pop"); st.items.splice(st.items.indexOf(it), 1); setTimeout(() => it.el.remove(), 160); const hd = document.getElementById("pkScore"); if(hd) hd.textContent = st.score; },
ubal(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "run") return; st.pick = i; st.phase = "fb"; if(i === tr.ans){ st.score++; gameSfx("correct"); } else mtErr(); renderMtBoard(); mtLater(NEW_MT.next, i === tr.ans ? 600 : 1300); },
htrn(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || st.placed.includes(i)) return; const car = tr.cars[i];
if(car.i === st.placed.length){ st.placed.push(i); gameSfx("pop"); renderMtBoard(); if(st.placed.length === tr.sy.length){ st.score++; st.phase = "fb"; gameSfx("correct"); sayTask(tr.pic.n); mtLater(NEW_MT.next, 1100); } }
else { st.bad[i] = 1; mtErr(); renderMtBoard(); mtLater(() => { delete st.bad[i]; renderMtBoard(); }, 900); } },
slide(i){ const st = mtState; if(st.phase !== "input" || st.peek) return; const C = st.C, b = st.blank, r = Math.floor(i / C), c = i % C, br = Math.floor(b / C), bc = b % C;
if(Math.abs(r - br) + Math.abs(c - bc) !== 1) return; [st.tiles[b], st.tiles[i]] = [st.tiles[i], st.tiles[b]]; st.blank = i; st.moves++; gameSfx("pop");
if(st.tiles.every((v, k) => v === k)){ if(st.moves > st.limit) mtErr(); st.phase = "fb"; gameSfx("correct"); renderMtBoard(); mtLater(() => { st.phase = "done"; mtFinish(` ${st.moves} hamlede tamamladın.`); }, 1000); return; } renderMtBoard(); },
kopru(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return;
if(!tr.two){ st.pick = i; const ok = tr.opts[i] === tr.gap; st.phase = "fb"; if(ok){ st.score++; gameSfx("correct"); } else mtErr(); renderMtBoard(); mtLater(NEW_MT.next, ok ? 1300 : 1300); return; }
if(st.sel.includes(i)) return; st.sel.push(i); renderMtBoard(); if(st.sel.length === 2){ const ok = tr.opts[st.sel[0]] + tr.opts[st.sel[1]] === tr.gap; st.phase = "fb"; st.okTwo = ok; if(ok){ st.score++; gameSfx("correct"); } else mtErr(); renderMtBoard(); mtLater(NEW_MT.next, 1300); } },
esc(i){ const st = mtState, n = st.n; if(st.phase !== "run") return; const c = st.pos, d = i - c; const dir = d === -n ? "n" : d === n ? "s" : (d === 1 && c % n < n - 1) ? "e" : (d === -1 && c % n > 0) ? "w" : null;
if(!dir || st.walls[c][dir]) return; st.pos = i; gameSfx("pop"); if(st.cl.includes(i)){ escHit(); escPaint(); return; }
if(i === n * n - 1){ st.phase = "done"; gameSfx("correct"); mtFinish(" Yıldıza ulaştın!"); return; } escPaint(); },
bln(i){ const st = mtState; if(st.phase !== "run") return; const b = st.items.find(x => x.id === i); if(!b) return; if(b.col === st.tgt){ st.score++; gameSfx("pop"); } else mtErr();
b.el.style.transform += " scale(1.35)"; b.el.classList.add("pop"); st.items.splice(st.items.indexOf(b), 1); setTimeout(() => b.el.remove(), 160); const hd = document.getElementById("pkScore"); if(hd) hd.textContent = st.score; },
mol(i){ const st = mtState; if(st.phase !== "run" || !st.cur || st.cur.hit || st.cur.h !== i) return; st.cur.hit = true; if(st.cur.hat){ mtErr(); } else { st.score++; gameSfx("pop"); } molDraw(); },
bag(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "ask") return; st.pick = i; st.phase = "fb"; if(i === tr.ans){ st.score++; gameSfx("correct"); } else mtErr(); renderMtBoard(); mtLater(NEW_MT.next, i === tr.ans ? 600 : 1400); },
smn(i){ const st = mtState; if(st.phase !== "input") return; smnFlash(i, 220); if(i === st.seq[st.pos]){ st.pos++; if(st.pos >= st.seq.length){ st.phase = "wait"; st.score = st.seq.length; gameSfx("correct"); mtLater(smnRound, 700); } }
else { mtErr(); st.phase = "fb"; renderMtBoard(); mtLater(() => { st.phase = "done"; mtFinish(` En uzun dizi: ${st.score}`); }, 900); } },
clue(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "ask") return; const ok = tr.cands[i] === tr.tg; st.pick = i; st.phase = "fb"; if(ok) gameSfx("correct"); else mtErr(); renderMtBoard(); mtLater(NEW_MT.next, ok ? 600 : 1400); },
ctab(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return;
if(typeof i === "string" && i[0] === "p"){ st.sel = Number(i.slice(1)); renderMtBoard(); return; }
if(st.sel == null || tr.cells[i].given || st.placed[i] != null) return; const pc = tr.cells[st.sel];
if(pc.c === tr.cells[i].c && pc.s === tr.cells[i].s){ st.placed[i] = st.sel; st.sel = null; gameSfx("correct"); renderMtBoard(); if(Object.keys(st.placed).length >= tr.pieces.length){ st.phase = "fb"; mtLater(NEW_MT.next, 700); } }
else { mtErr(); st.bad = i; renderMtBoard(); mtLater(() => { st.bad = null; renderMtBoard(); }, 500); } },
cobj(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "ask") return; const it = tr.test[st.qi], ok = i === it.ci; st.pick = i; st.phase = "fb"; if(ok) gameSfx("correct"); else mtErr(); renderMtBoard();
mtLater(() => { st.qi++; st.pick = null; if(st.qi >= tr.test.length){ NEW_MT.next(); return; } st.phase = "ask"; renderMtBoard(); }, ok ? 500 : 1300); },
porder(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; if(tr.opts[i] === tr.seq[st.pos]){ st.pos++; gameSfx("pop"); renderMtBoard(); if(st.pos >= tr.seq.length){ st.phase = "fb"; gameSfx("correct"); mtLater(NEW_MT.next, 600); } }
else { mtErr(); st.phase = "fb"; st.reveal = true; renderMtBoard(); mtLater(() => { st.reveal = false; NEW_MT.next(); }, 1400); } },
nword(i){ const st = mtState; if(st.phase !== "ask") return; const want = st.test[st.qi].ci; st.pick = i; st.phase = "fb"; if(i === want) gameSfx("correct"); else mtErr(); renderMtBoard();
mtLater(() => { st.qi++; st.pick = null; if(st.qi >= st.test.length){ mtFinish(); return; } st.phase = "ask"; renderMtBoard(); sayTask(`Hangisi ${st.test[st.qi].nm}?`); }, i === want ? 500 : 1300); },
pairm(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || st.pk.includes(i) || st.bad[i]) return;
if(tr.items[i].k === tr.pk){ st.pk.push(i); gameSfx("correct"); renderMtBoard(); if(st.pk.length === 2){ st.phase = "fb"; mtLater(NEW_MT.next, 1000); } } /* KURAL (geri bildirim süresi, 2026-11-07): hız ölçmeyen seçme oyunlarında doğru seçim/çift yeşil olarak en az ~1 sn, yanlış kart kırmızı olarak en az 0,9 sn görünür; sonra sıradakine geçilir (önceden 0,35–0,7 sn idi, kartlar oynuyormuş gibi görünüyordu) */
else { st.bad[i] = 1; mtErr(); renderMtBoard(); mtLater(() => { delete st.bad[i]; renderMtBoard(); }, 900); } },
per(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "show") return; if(i === "t"){ if(tr.lure) mtErr(); else gameSfx("correct"); st.phase = "fb"; renderMtBoard(); mtLater(NEW_MT.next, 250); } },
dual(i){ const st = mtState; if(st.phase !== "run" || !st.tgt) return; if(String(i) === "t" + st.tgt.k){ st.hit++; st.tgt = null; gameSfx("pop"); const a = document.getElementById("dualArea"); const o = a && a.querySelector(".du-t"); if(o) o.remove(); } },
csp(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "recall") return; if(Number(i) === tr.counts[st.pos]){ st.pos++; gameSfx("correct"); renderMtBoard(); if(st.pos >= tr.counts.length){ st.phase = "fb"; mtLater(NEW_MT.next, 900); } }
else { mtErr(); st.phase = "fb"; st.reveal = true; renderMtBoard(); mtLater(() => { st.reveal = false; NEW_MT.next(); }, 1400); } },
tone(i){ const st = mtState, seq = st.trials[st.ti]; if(st.phase !== "input") return; toneBeep(TONE_KEYS[i].f); st.lit = i; renderMtBoard(); mtLater(() => { st.lit = -1; renderMtBoard(); }, 200);
if(i === seq[st.pos]){ st.pos++; if(st.pos >= seq.length){ st.phase = "fb"; gameSfx("correct"); mtLater(NEW_MT.next, 600); } } else { mtErr(); st.phase = "fb"; mtLater(NEW_MT.next, 900); } },
wseen(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "ask") return; st.pick = i; st.phase = "fb"; if(i === tr.ans) gameSfx("correct"); else mtErr(); renderMtBoard(); mtLater(NEW_MT.next, i === tr.ans ? 500 : 1200); },
route(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; if(i === tr.path[st.pos]){ st.pos++; gameSfx("pop"); renderMtBoard(); if(st.pos >= tr.path.length){ st.phase = "fb"; gameSfx("correct"); mtLater(NEW_MT.next, 600); } }
else { mtErr(); st.phase = "fb"; st.reveal = true; renderMtBoard(); mtLater(() => { st.reveal = false; NEW_MT.next(); }, 1300); } },
sbuild(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || st.placed.includes(i)) return; const w = tr.cards[i], pref = st.placed.map(k => tr.cards[k]).concat([w]);
if(tr.ok.some(o => pref.every((x, j) => o[j] === x))){ st.placed.push(i); gameSfx("correct"); renderMtBoard(); if(st.placed.length === tr.w.length){ st.phase = "fb"; mtLater(NEW_MT.next, 800); } }
else { st.bad[i] = 1; mtErr(); renderMtBoard(); mtLater(() => { delete st.bad[i]; renderMtBoard(); }, 900); } },
spotd(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || st.found[i] || st.bad[i]) return; if(tr.diff.includes(i)){ st.found[i] = 1; gameSfx("correct"); renderMtBoard(); if(Object.keys(st.found).length >= tr.diff.length){ st.phase = "fb"; mtLater(NEW_MT.next, 700); } }
else { st.bad[i] = 1; mtErr(); renderMtBoard(); mtLater(() => { delete st.bad[i]; renderMtBoard(); }, 900); } },
sdk(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || tr.given[i] != null) return; st.cells[i] = st.cells[i] === st.sel ? null : st.sel; gameSfx("pop"); renderMtBoard(); },
parr(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || st.placed.includes(i)) return;
if(tr.cards[i] === st.placed.length){ st.placed.push(i); gameSfx("correct"); renderMtBoard();
if(st.placed.length === tr.n){ if(st.telling){ st.phase = "tell"; renderMtBoard(); return; } st.phase = "fb"; mtLater(NEW_MT.next, 900); } }
else { st.bad[i] = 1; mtErr(); renderMtBoard(); mtLater(() => { delete st.bad[i]; renderMtBoard(); }, 900); } },
blk(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; const k = tr.faces.indexOf(st.cells[i]); st.cells[i] = tr.faces[(k + 1) % tr.faces.length]; gameSfx("pop"); renderMtBoard(); },
clut(i){ const st = mtState; if(st.phase !== "input" || st.found[i] || st.bad[i]) return; if(st.items[i].tgt){ st.found[i] = 1; gameSfx("correct"); renderMtBoard(); if(Object.keys(st.found).length >= st.items.filter(x => x.tgt).length){ st.phase = "fb"; mtLater(() => mtFinish(), 500); } } else { st.bad[i] = 1; mtErr(); renderMtBoard(); } },
sym(i){ const st = mtState; if(st.phase !== "input") return; st.mine[i] = !st.mine[i]; gameSfx("pop"); renderMtBoard(); },
maze(i){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; const n = tr.n, c = st.pos, d = i - c;
const dir = d === -n ? "n" : d === n ? "s" : (d === 1 && c % n < n - 1) ? "e" : (d === -1 && c % n > 0) ? "w" : null;
if(!dir || i === c) return; if(tr.walls[c][dir]){ mtErr(); st.bump = i; renderMtBoard(); mtLater(() => { st.bump = null; renderMtBoard(); }, 300); return; }
st.pos = i; if(st.path[st.path.length - 2] === i) st.path.pop(); else st.path.push(i); gameSfx("pop");
if(i === n * n - 1){ gameSfx("correct"); st.phase = "fb"; renderMtBoard(); mtLater(() => { st.pos = 0; st.path = [0]; NEW_MT.next(); }, 700); return; } renderMtBoard(); },
draw(i){ const st = mtState; if(st.phase !== "input") return;
if(st.sel < 0){ st.sel = i; renderMtBoard(); return; }
if(st.sel === i){ st.sel = -1; renderMtBoard(); return; }
const n = st.n, a = st.sel, b = i, dr = Math.abs(Math.floor(a / n) - Math.floor(b / n)), dc = Math.abs(a % n - b % n);
if(dr > 1 || dc > 1){ st.sel = i; renderMtBoard(); return; }
const k = a < b ? a + "-" + b : b + "-" + a; if(st.mine.has(k)) st.mine.delete(k); else st.mine.add(k);
st.sel = b; gameSfx("pop"); renderMtBoard(); }
},
judge: {
fsort(v){ const st = mtState; if(st.phase !== "name") return; st.manual = v === 9; if(v === 0) mtErr(); else if(v !== 9) gameSfx("correct"); st.ni++; if(st.ni >= st.ng.length){ mtFinish(); return; } renderMtBoard(); },
movesay(v){ const st = mtState; if(st.phase !== "judge") return; st.manual = v === 9; if(v === 1){ st.ok++; gameSfx("correct"); } else if(v !== 9) mtErr(); st.phase = "fb"; renderMtBoard(); mtLater(NEW_MT.next, 400); },
ecount(v){ const st = mtState; if(st.phase !== "judge") return; st.manual = v === 9; if(v === 0) mtErr(); else if(v !== 9) gameSfx("correct"); st.phase = "fb"; NEW_MT.next(); },
fix(v){ const st = mtState; if(st.phase !== "judge") return; st.manual = v === 9; if(v === 0) mtErr(); else if(v !== 9) gameSfx("correct"); st.phase = "fb"; NEW_MT.next(); },
dual(v){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "ask") return; if(v === 9){ st.manual = true; st.phase = "fb"; NEW_MT.next(); return; } if(v !== tr.beeps) mtErr(); else gameSfx("correct"); st.phase = "fb"; st.ansShown = true; renderMtBoard(); mtLater(() => { st.ansShown = false; NEW_MT.next(); }, 1200); },
parr(v){ const st = mtState; if(st.phase !== "tell") return; st.manual = v === 9; if(v === 0) mtErr(); else if(v !== 9) gameSfx("correct"); st.phase = "fb"; renderMtBoard(); mtLater(NEW_MT.next, 400); },
absay(v){ const st = mtState; if(st.phase !== "judge") return; st.manual = v === 9; if(v === 1){ st.okN++; gameSfx("correct"); } else if(v === 0) mtErr();
st.ti++; if(st.ti >= st.trials.length){ mtFinish(); return; } renderMtBoard(); const it = st.trials[st.ti]; if(it.s) mtLater(() => sayTask(it.s, 0.85), 250); },
whatdo(v){ const st = mtState; if(st.phase !== "judge") return; st.manual = v === 9; if(v === 1){ st.okN++; gameSfx("correct"); } else if(v === 0) mtErr();
st.ti++; if(st.ti >= st.trials.length){ mtFinish(); return; } renderMtBoard(); mtLater(() => sayTask(st.trials[st.ti].q, 0.85), 250); },
scene(v){ const st = mtState; if(st.phase !== "ask") return; st.manual = v === 9; if(v === 1){ st.ok++; gameSfx("correct"); } else if(v !== 9) mtErr();
st.qi++; if(st.qi >= st.qs.length){ mtFinish(st.manual ? "" : ` Doğru: ${st.ok}/${st.qs.length}.`); return; } renderMtBoard(); },
recog(v){ const st = mtState; if(st.phase !== "ask") return; const it = st.test[st.qi], ok = (v === 1) === it.old;
if(ok){ gameSfx("correct"); if(it.old) st.hits++; } else { mtErr(); if(!it.old) st.fa++; }
st.fb = ok ? "ok" : "bad"; st.phase = "fb"; renderMtBoard();
mtLater(() => { st.fb = null; st.qi++; if(st.qi >= st.test.length){ mtFinish(` Doğru tanınan: ${st.hits}/${st.study.length}, yanlış "gördüm": ${st.fa}.`); return; } st.phase = "ask"; renderMtBoard(); }, ok ? 450 : 1000); }
},
btn: {
"hear-done"(){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return;
const miss = tr.heard.length - Object.keys(st.found).length; for(let k = 0; k < miss; k++) mtErr();
st.phase = "fb"; st.reveal = true; renderMtBoard(); mtLater(() => { st.reveal = false; NEW_MT.next(); }, miss ? 1500 : 500); },
"face-done"(){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input" || tr.mode !== "recog") return;
const miss = tr.study.length - Object.keys(st.found).length; for(let k = 0; k < miss; k++) mtErr();
st.phase = "fb"; st.reveal = true; renderMtBoard(); mtLater(() => { st.reveal = false; NEW_MT.next(); }, miss ? 1500 : 500); },
"time-go"(){ const st = mtState; if(st.phase !== "ready") return; st.t0 = performance.now(); st.phase = "timing"; renderMtBoard(); },
"time-stop"(){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "timing") return; if(performance.now() - st.t0 < 800) return;   /* Başla ile aynı yerde: yanlışlıkla çift dokunuş Dur sayılmaz */ const sec = (performance.now() - st.t0) / 1000 / (window.__wmSpeed || 1), ok = Math.abs(sec - tr.secs) <= tr.secs * tr.tol;
st.last = { sec, ok }; st.res.push(+sec.toFixed(1)); if(ok) gameSfx("correct"); else mtErr(); st.phase = "fb"; renderMtBoard();
mtLater(() => { st.ti++; if(st.ti >= st.trials.length){ document.documentElement.classList.remove("hide-clock"); mtFinish(` Tahminler: ${st.res.join(" · ")} sn`); return; } st.phase = "ready"; renderMtBoard(); }, 2500); },
"ferr-say"(){ const st = mtState, tr = st && st.trials[st.ti]; if(tr && tr.rule) sayTask(tr.rule, 1.0); }, "ferr-done"(){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; let e = 0; tr.items.forEach((it, i) => { if(!!it.bad !== !!st.sel[i]) e++; }); for(let k = 0; k < e; k++) mtErr(); if(!e) gameSfx("correct");
st.phase = "fb"; renderMtBoard(); mtLater(() => { st.sel = {}; NEW_MT.next(); }, e ? 1800 : 700); },
"rhy-done"(){ const st = mtState; if(st.phase !== "input") return; rhyEval(); },
"per-x"(){},
"stop-l"(){ stopResp("l"); }, "stop-r"(){ stopResp("r"); }, "stop-u"(){ stopResp("u"); }, "stop-d"(){ stopResp("d"); },
"tapr-pad"(){ const st = mtState; if(!st || st.kind !== "tapr" || st.phase !== "show") return; st.taps++; gameSfx("pop"); const el = document.getElementById("taprCount"); if(el) el.textContent = st.taps; const my = st.ti, n = st.taps;
  mtLater(() => { if(st.ti === my && st.phase === "show" && st.taps === n) taprEval(); }, 750); },   /* son vuruştan 0,75 sn sonra değerlendirilir */
"ks-clear"(){ const st = mtState; if(!st || st.kind !== "keys" || st.phase !== "input") return; st.trials[st.ti].pts = []; renderMtBoard(); },
"ks-done"(){ const st = mtState; if(!st || st.kind !== "keys" || st.phase !== "input") return; const tr = st.trials[st.ti]; const cov = ksCoverage(tr.pts), pct = Math.round(cov.size / 64 * 100), found = cov.has(tr.key[0] + "," + tr.key[1]); tr.cov = cov; tr.pct = pct; tr.found = found; st.res.push(pct); if(pct < tr.need) mtErr(); else { st.okN++; gameSfx("correct"); } st.phase = "fb"; renderMtBoard(); mtLater(NEW_MT.next, 2200); },
"jar-fill"(){ const st = mtState; if(!st || st.kind !== "jars" || st.phase !== "input") return; const tr = st.trials[st.ti]; if(tr.sel < 0 || tr.solved) return; if(tr.lv[tr.sel] < tr.caps[tr.sel]){ tr.lv[tr.sel] = tr.caps[tr.sel]; tr.moves++; gameSfx("pop"); } jarCheck(); renderMtBoard(); },
"jar-empty"(){ const st = mtState; if(!st || st.kind !== "jars" || st.phase !== "input") return; const tr = st.trials[st.ti]; if(tr.sel < 0 || tr.solved) return; if(tr.lv[tr.sel] > 0){ tr.lv[tr.sel] = 0; tr.moves++; gameSfx("pop"); } jarCheck(); renderMtBoard(); },
"jar-skip"(){ const st = mtState; if(!st || st.kind !== "jars" || st.phase !== "input") return; const tr = st.trials[st.ti]; if(tr.solved) return; mtErr(); st.phase = "fb"; renderMtBoard(); mtLater(NEW_MT.next, 800); },
"dfl-new"(){ const st = mtState; if(!st || st.kind !== "dfl" || st.phase !== "input") return; if(!st.cur.length) return; dflCommit(); renderMtBoard(); },
"dfl-undo"(){ const st = mtState; if(!st || st.kind !== "dfl" || st.phase !== "input") return; st.cur = []; st.sel = -1; renderMtBoard(); },
"twq-q"(){ const st = mtState; if(!st || st.kind !== "twq" || st.phase !== "input") return; st.trials[st.ti].q++; gameSfx("pop"); renderMtBoard(); },
"twq-found"(){ const st = mtState; if(!st || st.kind !== "twq" || st.phase !== "input") return; const tr = st.trials[st.ti]; st.res.push(tr.q); setErrorCount(currentErrorCount + tr.q); st.wrong += tr.q; gameSfx("correct"); st.phase = "fb"; renderMtBoard(); mtLater(() => { if(st.ti + 1 >= st.trials.length){ st.ti++; st.phase = "done"; renderMtBoard(); stopTimer(); showLevelFlash(`Bitti! Soru sayıları: ${st.res.join(" · ")}`, "levelup"); } else NEW_MT.next(); }, 900); },
"six-back"(){ const st = mtState; if(!st || st.kind !== "six" || st.phase !== "input") return; st.view = "menu"; renderMtBoard(); },
"six-end"(){ const st = mtState; if(!st || st.kind !== "six" || st.phase !== "input") return; sixFinish(); },
...Object.fromEntries(["l", "r", "u", "d"].map(d => ["sc-" + d, () => scAnswer(d)])),
"sc-done"(){ const st = mtState; if(!st || st.kind !== "selfchk" || st.phase !== "review") return; let miss = 0, fa = 0, hit = 0; st.trials.forEach(it => { if(!it.ok && it.mark) hit++; else if(!it.ok && !it.mark) miss++; else if(it.ok && it.mark) fa++; }); for(let k = 0; k < miss + fa; k++) mtErr(); st.res = { hit, miss, fa, errs: st.trials.filter(it => !it.ok).length }; st.phase = "done"; renderMtBoard(); stopTimer(); showLevelFlash(`Bitti! Yaptığı hata: ${st.res.errs} · fark ettiği: ${hit} · fark etmediği: ${miss} · yanlış işaret: ${fa}`, miss + fa ? "down" : "levelup"); },
"kt-next"(){ const st = mtState; if(!st || st.kind !== "ktrack" || st.phase !== "ask") return; if(st.ti + 1 >= st.trials.length){ st.ti++; st.phase = "done"; renderMtBoard(); stopTimer(); showLevelFlash("Bitti! Hata sayısını kontrol edin.", "levelup"); return; } NEW_MT.next(); },
"vig-hit"(){ const st = mtState; if(st.phase !== "run" || st.i < 0 || st.resp) return; st.resp = true; if(st.seq[st.i].tg){ st.hits++; gameSfx("correct"); } else { st.fa++; mtErr(); } const b = document.getElementById("vigShape"); if(b){ b.classList.remove("hit"); void b.offsetWidth; b.classList.add("hit"); } },
"pnb-same"(){ const st = mtState; if(st.phase !== "run" || st.i < 0 || st.resp[st.i]) return; st.resp[st.i] = true; if(st.i >= st.n && st.seq[st.i] === st.seq[st.i - st.n]) gameSfx("correct"); else mtErr(); },
"csp-ok"(){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "count") return; st.ci++; if(st.ci >= tr.counts.length){ st.phase = "recall"; st.pos = 0; } gameSfx("pop"); renderMtBoard(); },
...Object.fromEntries([0, 1, 2, 3].map(k => ["sdk-" + k, () => { const st = mtState; if(st.phase !== "input") return; st.sel = k; renderMtBoard(); }])),
"sdk-done"(){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; const n = tr.n, bad = new Set();
for(let i = 0; i < n * n; i++){ const v = st.cells[i]; if(v == null){ bad.add(i); continue; } const r = Math.floor(i / n), c = i % n;
if(tr.given[i] != null) continue;
for(let k = 0; k < n; k++){ if(k !== c && st.cells[r * n + k] === v) bad.add(i); if(k !== r && st.cells[k * n + c] === v) bad.add(i); } }
st.bad = bad; bad.forEach(() => mtErr()); if(!bad.size) gameSfx("correct"); st.phase = "fb"; renderMtBoard(); mtLater(() => { st.bad = null; NEW_MT.next(); }, bad.size ? 1800 : 700); },
"blk-done"(){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; let e = 0; tr.model.forEach((f, i) => { if(st.cells[i] !== f) e++; }); for(let k = 0; k < e; k++) mtErr(); if(!e) gameSfx("correct"); st.res = e; st.phase = "fb"; renderMtBoard(); mtLater(() => NEW_MT.next(), e ? 1800 : 700); },
"clut-done"(){ const st = mtState; if(st.phase !== "input") return; const miss = st.items.filter((x, i) => x.tgt && !st.found[i]).length; for(let k = 0; k < miss; k++) mtErr(); st.reveal = true; st.phase = "fb"; renderMtBoard(); mtLater(() => mtFinish(), miss ? 1600 : 500); },
"sym-done"(){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; const n = tr.n; let e = 0;
for(let r = 0; r < n; r++) for(let c = 0; c < n; c++){ const given = tr.horiz ? r < n / 2 : c < n / 2; if(given) continue; const src = tr.horiz ? (n - 1 - r) * n + c : r * n + (n - 1 - c); if(!!st.mine[r * n + c] !== !!tr.cells[src]) e++; }
for(let k = 0; k < e; k++) mtErr(); if(!e) gameSfx("correct"); st.phase = "fb"; renderMtBoard(); mtLater(() => { st.mine = {}; NEW_MT.next(); }, e ? 1800 : 700); },
"wt-serve"(){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; const cnt = {}; st.tray.forEach(i => { cnt[i] = (cnt[i] || 0) + 1; });
const ok = tr.order.every(o => cnt[tr.shelf.indexOf(o.x)] === o.n) && Object.keys(cnt).length === tr.order.length; st.okS = ok; if(ok){ st.score++; gameSfx("correct"); } else mtErr(); st.phase = "fb"; renderMtBoard(); mtLater(NEW_MT.next, ok ? 900 : 1700); },
"ss-names"(){ const st = mtState, tr = st.trials && st.trials[st.ti]; if(tr) sayTask(tr.opts.map(x => x.n).join(", "), 0.85); },
"ss-done"(){ const st = mtState, tr = st.trials[st.ti]; if(st.phase !== "input") return; const miss = tr.opts.filter((x, i) => trFirst(x.n) === tr.s && !st.found[i]).length; for(let k = 0; k < miss; k++) mtErr();
st.phase = "fb"; st.reveal = true; renderMtBoard(); mtLater(() => { st.reveal = false; NEW_MT.next(); }, miss ? 1500 : 500); },
"flu-ok"(){ const st = mtState; if(st.phase !== "run") return; st.ok++; const el = (Date.now() - st.t0) / (window.__wmSpeed || 1) / 1000; st.q[Math.min(3, Math.floor(el / (st.secs / 4)))]++; if(st.P.sw) st.exp = (st.exp + 1) % st.P.sw.length; setErrorCount(st.ok); gameSfx("pop");
if(fluUnit() === "fikir" && st.ok >= altGoal()){ st.phase = "done"; st.goalHit = true; sfx("solved"); mtFinish(` Uygun fikir: ${st.ok} (hedef ${altGoal()}) · tekrar: ${st.rep} · sayılmaz: ${st.rule + st.ord}`); return; }   /* hedefe ulaşınca çalışma biter */
renderMtBoard(); },
"flu-rep"(){ const st = mtState; if(st.phase !== "run") return; st.rep++; renderMtBoard(); },
"flu-rule"(){ const st = mtState; if(st.phase !== "run") return; st.rule++; renderMtBoard(); },
"flu-ord"(){ const st = mtState; if(st.phase !== "run") return; st.ord++; renderMtBoard(); },
...Object.fromEntries([0, 1, 2, 3, 4].map(k => ["fs-c" + k, () => { const st = mtState; if(st.phase !== "input") return; st.sel = k; renderMtBoard(); }])),
"fs-done"(){ const st = mtState; if(st.phase !== "input") return; const ev = fsEvaluate(st); st.res = ev.wrong; ev.wrong.forEach(() => mtErr()); if(!ev.wrong.size) gameSfx("correct");
if(st.naming && ev.groups && Object.keys(ev.groups).length){ st.phase = "name"; st.ng = Object.keys(ev.groups).map(Number);   /* hiç grup kurulmadan Bitti'ye basılırsa adlandırma atlanır (önceden hata veriyordu) */ st.groupsOf = ev.groups; st.ni = 0; renderMtBoard(); return; }
st.phase = "fb"; renderMtBoard(); mtLater(() => mtFinish(), ev.wrong.size ? 1800 : 700); },
"qz-replay"(){ const st = mtState, tr = st.trials && st.trials[st.ti]; if(tr && tr.say) sayTask(tr.say, 0.85); },
"draw-undo"(){ const st = mtState; if(st.phase !== "input") return; st.mine = new Set(); st.sel = -1; renderMtBoard(); },
"draw-done"(){ const st = mtState; if(st.phase !== "input") return; const want = st.trials[st.ti];
let e = 0; want.forEach(k => { if(!st.mine.has(k)) e++; }); st.mine.forEach(k => { if(!want.has(k)) e++; });
for(let k = 0; k < e; k++) mtErr(); if(!e) gameSfx("correct");
st.phase = "fb"; renderMtBoard(); mtLater(() => { st.mine = new Set(); st.sel = -1; NEW_MT.next(); }, e ? 1800 : 700); }
},
render(st, W, H, isLs){
let info = "", body = "";
const total = st.trials ? st.trials.length : 0, ti = st.ti || 0;
const dots = st.trials ? `<div class="wm-dots">${st.trials.map((x, i) => `<i class="${i < ti ? "on" : ""}"></i>`).join("")}</div>` : "";
const grid = (arr, cellFn, minCell, availH) => { const d = wmGridDims(arr.length, W, availH || (isLs ? H - 45 : H), minCell || 90);
return `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + arr.map((x, i) => cellFn(x, i, d.cell)).join("") + `</div>`; };
const pic = (x, i, c, mk, extra) => `<div class="wm-pic${mk ? " " + mk : ""}" data-mt="${i}" style="width:${c}px;height:${c}px;">${x ? imgTag(x.src) : ""}${extra || ""}</div>`;
if(st.phase === "idle") return { info:"▶ Başlat'a bas", body: dots };
if(st.phase === "done"){
if(st.kind === "samenum") return { info:"Bitti!", body:"" };
if(st.kind === "mem") return { info:`Bitti · ${st.P} eş · eşleşmeyen deneme ${st.miss}`, body:"" };
if(st.kind === "time") return { info:`Bitti · tahminler: ${st.res.join(" · ")} sn`, body:"" };
if(st.kind === "chase") return { info:`Bitti · ${st.hits} kez dokundun`, body:"" };
if(st.kind === "flu") return { info:`${st.goalHit ? "<b style=\"color:var(--good)\">Hedefe ulaştın ✓</b>" : "Süre doldu"} · ${fluUnit() === "fikir" ? "uygun" : "doğru"} <b>${st.ok}</b> ${fluUnit()}${fluUnit() === "fikir" ? (st.ok >= altGoal() ? ` · hedef ${altGoal()} <b style="color:var(--good)">✓</b>` : ` · hedef ${altGoal()} (ulaşılamadı)`) : ""}`, body:`<div class="flu-q">${st.q.map((n, k) => `<div><b>${n}</b><span>${Math.round(st.secs / 4 * k)}–${Math.round(st.secs / 4 * (k + 1))} sn</span></div>`).join("")}</div><div class="aud-key" style="text-align:center;margin-top:6px">Tekrar: <b>${st.rep}</b> · ${fluUnit() === "fikir" ? "Sayılmaz" : "Kural dışı"}: <b>${st.rule + st.ord}</b>${st.P.sw ? ` (sıra karışması: ${st.ord})` : ""}</div><div class="aud-key" style="text-align:center">İlk çeyrekte çok, sonlara doğru az ${fluUnit()} olağandır; çok erken tükeniyorsa strateji aşamasını deneyin.</div>` };
if(st.kind === "tapr") return { info:`Bitti · doğru <b>${st.okN}/${st.trials.length}</b>`, body:"" };
if(st.kind === "statue") return { info:`Süre doldu · ${st.cfg.secs} sn · hareket/konuşma sayısı Hata sayısında`, body:"" };
if(st.kind === "hold") return { info:`Bitti · sonuna kadar tuttu <b>${st.okN}/${st.trials.length}</b> · erken bıraktı <b>${st.wrong}</b>`, body:"" };
if(st.kind === "fist") return { info:`Bitti · bulunan eşleme <b>${st.okN}</b> · yanlış <b>${st.wrong}</b>`, body:"" };
if(st.kind === "wcst") return { info:`Bitti · doğru <b>${st.okN}/${st.trials.length}</b> · kural değişimi <b>${st.shifts}</b> · eski kurala takılma <b>${st.pers}</b>`, body:"" };
if(st.kind === "rev") return { info:`Bitti · yıldız <b>${st.okN}/${st.trials.length}</b> · değişim <b>${st.revs}</b>`, body:"" };
if(st.kind === "zoo") return { info:`Bitti · tam rota <b>${st.okN}/${st.trials.length}</b> · kural ihlali + eksik <b>${st.wrong}</b>`, body:"" };
if(st.kind === "keys") return { info:`Bitti · tarama: <b>${st.res.map(p => "%" + p).join(" · ")}</b>`, body:"" };
if(st.kind === "jars") return { info:`Bitti · çözülen <b>${st.okN}/${st.trials.length}</b> · fazla hamle <b>${st.wrong}</b>`, body:"" };
if(st.kind === "dfl") return { info:`Bitti · farklı desen <b>${st.uniq}</b> · tekrar <b>${st.rep}</b>`, body:"" };
if(st.kind === "twq") return { info:`Bitti · soru sayıları: <b>${st.res.join(" · ")}</b> (az = iyi strateji)`, body:"" };
if(st.kind === "bsearch") return { info:`Bitti · yıldızlar <b>${st.okN}</b> · aynı kutuya dönüş <b>${st.wrong}</b>`, body:"" };
if(st.kind === "six") return { info:`Bitti · yapılan parça <b>${Object.keys(st.done).length}/6</b> · kural ihlali <b>${st.breaks}</b> · kalan süre <b>${Math.max(0, st.left)}</b> sn`, body:"" };
if(st.kind === "selfchk") return { info: st.res ? `Bitti · yaptığı hata <b>${st.res.errs}</b> · fark ettiği <b>${st.res.hit}</b> · fark etmediği <b>${st.res.miss}</b> · yanlış işaret <b>${st.res.fa}</b>` : "Bitti!", body:"" };
if(st.kind === "cgt"){ const h = Math.floor(st.cfg.N / 2), second = st.picks.slice(h), safe = second.filter(p => p === "S").length; return { info:`Bitti · yıldız <b>${st.stars}</b> · ikinci yarıda güvenli kutu <b>${safe}/${second.length}</b>`, body:"" }; }
if(st.kind === "ktrack") return { info:`Bitti · hatırlanmayan sonuncular Hata sayısında`, body:"" };
if(st.kind === "movesay") return { info: st.manual ? "Bitti · hatalar Hata sayısında" : `Bitti · doğru <b>${st.ok}/${st.trials.length}</b>`, body:"" };
if(st.kind === "absay") return { info:`Bitti · uygun <b>${st.okN}</b> · uygun değil <b>${st.wrong}</b>`, body:"" };
if(st.kind === "whatdo") return { info:`Bitti · uygun <b>${st.okN}</b> · uygun değil <b>${st.wrong}</b>`, body:"" };
if(st.kind === "scene") return { info:`Bitti · doğru <b>${st.ok}/${st.qs.length}</b>`, body:"" };
if(st.kind === "scenet") return { info:"Bitti!", body:"" };
if(st.kind === "recog") return { info:`Bitti · doğru tanınan <b>${st.hits}/${st.study.length}</b> · yanlış "gördüm" <b>${st.fa}</b>`, body:"" };
return { info:"Bitti!", body: dots };
}
if(st.kind === "hear"){
const tr = st.trials[ti];
if(st.phase === "listen") return { info:"<b>Dinle…</b>", body: dots + SPEAKER_HTML(true) };
info = `<b>Duyduklarına</b> dokun · ${Object.keys(st.found).length}/${tr.heard.length}`;
body = dots + grid(tr.opts, (x, i, c) => pic(x, i, c, st.found[i] ? "ok" : st.bad[i] ? "bad" : (st.reveal && tr.heard.includes(x) ? "ok" : "")), 84, isLs ? H - 95 : H - 60) +
`<div class="wm-btns" style="margin:8px auto 0"><button type="button" class="wm-btn same" data-mtbtn="hear-done">Bitti</button></div>`;
} else if(st.kind === "dir"){
const tr = st.trials[ti];
if(st.phase === "listen") return { info:"<b>Dinle…</b>", body: dots + SPEAKER_HTML(true) };
info = st.reveal ? `Yönerge: <b>${tr.text}</b>` : "<b>Duyduğun gibi</b> dokun";
body = dots + grid(tr.items, (x, i, c) => { const mk = st.marks[i] || (st.reveal && tr.ord.includes(i) ? "ok" : "");
const num = st.reveal && tr.ord.includes(i) ? `<span class="num">${tr.ord.indexOf(i) + 1}</span>` : "";
return `<div class="wm-pic${mk ? " " + mk : ""}" data-mt="${i}" style="width:${c}px;height:${c}px;">${shapeSVG(x.s.k === "circle" ? "circle" : x.s.k, x.c.hex)}${num}</div>`; }, 80);
} else if(st.kind === "miss" || st.kind === "chg"){
const tr = st.trials[ti];
if(st.phase === "study"){ info = "<b>İyi bak…</b>"; body = dots + grid(tr.set, (x, i, c) => pic(x, -1, c)); }
else if(st.phase === "blank"){ info = "…"; body = dots + grid(tr.set, (x, i, c) => `<div class="wm-pic" style="width:${c}px;height:${c}px;"></div>`); }
else if(st.kind === "miss"){
info = "<b>Hangisi eksik?</b>";
const shown = tr.shuffle ? st.left : tr.set.map((x, i) => i === tr.gone ? null : x);
const sm = grid(shown, (x, i, c) => `<div class="wm-pic" style="width:${c}px;height:${c}px;${x ? "" : "background:transparent;border-style:dashed"}">${x ? imgTag(x.src) : ""}</div>`, 60, isLs ? H - 20 : (H - 40) * 0.5);
const op = grid(tr.opts, (x, i, c) => pic(x, i, c, st.phase === "fb" ? (x === tr.set[tr.gone] ? "ok" : (i === st.pick ? "bad" : "")) : ""), 80, isLs ? H - 20 : (H - 40) * 0.5);
body = dots + (isLs ? `<div style="display:flex;gap:18px;align-items:center;justify-content:center"><div style="opacity:.85">${sm}</div><div>${op}</div></div>`
: `<div style="opacity:.85">${sm}</div><div class="wm-info" style="margin:6px 0 2px">Eksik olana dokun:</div>${op}`);
} else {
info = "<b>Hangisi değişti?</b>";
const now = tr.set.map((x, i) => i === tr.at ? tr.neo : x);
body = dots + grid(now, (x, i, c) => pic(x, i, c, st.phase === "fb" ? (i === tr.at ? "ok" : (i === st.pick ? "bad" : "")) : ""));
}
} else if(st.kind === "recog"){
if(st.phase === "study"){ const x = st.study[st.si], sz = Math.min(isLs ? H - 30 : 190, W * 0.6);
return { info:`<b>İyi bak…</b> ${Math.max(0, st.si + 1)}/${st.study.length}`, body:`<div class="wm-card" style="width:${sz}px;height:${sz}px;">${x ? imgTag(x.src) : ""}</div>` }; }
const it = st.test[Math.min(st.qi, st.test.length - 1)], sz = Math.min(isLs ? H - 80 : 180, W * 0.55);
info = `${st.delayed ? "⏰ " : ""}<b>Bunu gördün mü?</b> · ${st.qi + 1}/${st.test.length}`;
body = `<div class="wm-card${st.fb ? " " + st.fb : ""}" style="width:${sz}px;height:${sz}px;${st.fb === "ok" ? "border-color:#1FA463" : st.fb === "bad" ? "border-color:#E5484D" : ""}">${imgTag(it.x.src)}</div>` +
`<div class="wm-btns" style="margin:10px auto 0"><button type="button" class="wm-btn same" data-judge="1">Gördüm</button><button type="button" class="wm-btn diff" data-judge="0">Görmedim</button></div>`;
} else if(st.kind === "quiz"){
const r = qzRender(st, W, H, isLs); info = r.info; body = r.body;
} else if(st.kind === "flu"){
const P = st.P, t = `${Math.floor(st.left / 60)}:${String(st.left % 60).padStart(2, "0")}`;
const fluTxt = `<div class="flu-big" style="${P.big.length > 12 ? `font-size:${isLs ? 18 : 24}px` : ""}">${P.big}</div>${P.sub ? `<div class="flu-sub">${P.sub}</div>` : ""}`;
const card = `<div class="flu-card">${P.img && isPre() ? `<div style="display:flex;align-items:center;justify-content:center;gap:12px"><img class="flu-img" src="${P.img}" alt="" style="width:${isLs ? 64 : 84}px;height:${isLs ? 64 : 84}px;object-fit:contain;flex:0 0 auto"><div>${fluTxt}</div></div>` : fluTxt}${P.sw && st.phase === "run" ? `<div class="flu-next">Sıradaki: <b>${P.sw[st.exp][0]}</b></div>` : ""}</div>`;
if(st.phase === "idle"){ info = "▶ Başlat'a basınca süre başlar"; body = card + `<div class="aud-key" style="text-align:center">Süre: ${st.secs} sn · geçerli her ${fluUnit() === "fikir" ? "fikirde" : "kelimede"} <b>+1</b>'e basın${fluUnit() === "fikir" ? ` · hedef <b>${altGoal()}</b> fikir` : ""}</div>`; }
else { info = `Kalan süre: <b id="fluLeft">${t}</b>`;
const okb = `<div class="flu-cnt">${st.ok}${fluUnit() === "fikir" ? `<span style="font-size:.45em;color:var(--ink-soft)"> / ${altGoal()}</span>` : ""}</div>${fluUnit() === "fikir" && st.ok >= altGoal() ? `<div style="text-align:center;color:var(--good);font-weight:900;margin:-4px 0 6px">Hedefe ulaştın ✓</div>` : ""}<button type="button" class="flu-ok" data-mtbtn="flu-ok">+1 ${fluUnit()}</button>`;
const errb = `<div class="wm-btns${isLs ? " wd-compact" : ""}" style="margin:8px auto 0;flex-wrap:wrap"><button type="button" class="wm-btn diff" data-mtbtn="flu-rep">Tekrar · ${st.rep}</button><button type="button" class="wm-btn diff" data-mtbtn="flu-rule">${fluUnit() === "fikir" ? "Sayılmaz" : "Kural dışı"} · ${st.rule}</button>${P.sw ? `<button type="button" class="wm-btn diff" data-mtbtn="flu-ord">Sıra karıştı · ${st.ord}</button>` : ""}</div>`;
body = isLs ? `<div style="display:flex;gap:16px;align-items:center;justify-content:center;width:100%"><div style="width:56%;max-width:420px">${card}${errb}</div><div style="width:38%;max-width:320px">${okb}</div></div>` : card + okb + errb; }
} else if(st.kind === "dots"){
const tr = st.trials[ti], sz = Math.min(isLs ? H - 50 : 230, W * 0.7);
if(st.phase === "show"){ info = tr.name && tr.dis ? `<b>Bak!</b> Yalnızca <b>${escHTML(tr.name)}</b> resimlerini say` : "<b>Bak!</b>"; body = dots + `<div class="wm-card" style="width:${sz}px;height:${sz}px"><svg viewBox="0 0 200 200" width="100%" height="100%">${tr.pic ? tr.pts.map(p => `<image href="${tr.pic}" x="${(p[0] - 18).toFixed(0)}" y="${(p[1] - 18).toFixed(0)}" width="36" height="36" preserveAspectRatio="xMidYMid meet"/>`).join("") + (tr.dpts || []).map(p => `<image href="${tr.dis}" x="${(p[0] - 18).toFixed(0)}" y="${(p[1] - 18).toFixed(0)}" width="36" height="36" preserveAspectRatio="xMidYMid meet"/>`).join("") : tr.pts.map(p => `<circle cx="${p[0].toFixed(0)}" cy="${p[1].toFixed(0)}" r="13" fill="#2E6FD8"/>`).join("")}</svg></div>`; }
else { const nums = Array.from({length: tr.max - tr.min + 1}, (_, k) => tr.min + k); info = tr.name ? `<b>Kaç ${escHTML(tr.name)}</b> vardı?` : "<b>Kaç nokta</b> vardı?";
body = dots + `<div class="qz-txt-grid" style="grid-template-columns:repeat(${Math.min(nums.length, 5)}, minmax(0, 1fr))">${nums.map(n => `<div class="wm-pic qz-txt${st.phase === "fb" ? (n === tr.n ? " ok" : (n === st.pick ? " bad" : "")) : ""}" data-mt="${n}" style="font-size:24px;font-weight:900">${n}</div>`).join("")}</div>`; }
} else if(st.kind === "chase"){
const bh = isLs ? H - 30 : Math.min(H - 20, 420);
info = `Topa <b>dokun</b> · <span id="chaseCnt">${st.hits}/${st.need}</span>`;
body = `<div id="chaseBox" data-mt="0" style="position:relative;width:100%;height:${bh}px;background:var(--panel);border:2px solid var(--line);border-radius:18px;overflow:hidden;touch-action:manipulation"><div id="chaseBall" data-mt="1" class="chase-ball" style="width:${st.size}px;height:${st.size}px;left:${(W - st.size) / 2}px;top:${(bh - st.size) / 2}px"></div></div>`;
} else if(st.kind === "time"){
const tr = st.trials[ti];
info = st.phase === "fb" ? (st.last.ok ? "<b>Çok yakın!</b>" : "<b>Bir dahaki sefere</b> daha dikkatli say") : `<b>${tr.secs} saniye</b> olunca Dur'a bas`;
const big = st.phase === "timing" ? `<button type="button" class="time-btn stop" data-mtbtn="time-stop">Dur</button>` : st.phase === "ready" ? `<button type="button" class="time-btn" data-mtbtn="time-go">Başla</button>` : `<div class="time-res" style="color:${st.last.ok ? "#1B7A3D" : "#B35C00"}">${st.last.sec.toFixed(1)} sn <span>hedef ${tr.secs} sn</span>${st.ti < st.trials.length - 1 ? `<span style="display:block;font-size:14px;margin-top:6px;opacity:.8">Sıradaki deneme birazdan…</span>` : ""}</div>`;
const card = `<div class="flu-card" style="margin-bottom:12px"><div class="flu-big">${tr.secs} sn</div><div class="flu-sub">saati görmeden, içinden say</div></div>`;
body = isLs ? dots + `<div style="display:flex;gap:20px;align-items:center;justify-content:center"><div>${card}</div><div class="time-ls">${big}</div></div>` : dots + card + big;
} else if(st.kind === "ferr"){
const tr = st.trials[ti], n = tr.items.length;
info = st.phase === "fb" ? "<b>Hepsini buldun!</b>" : "Kurala <b>uymayanlara</b> dokun";
const d = wmGridDims(n, W, isLs ? H - 140 : H - 140, 48);
const colN = tr.row ? Math.min(n, d.cols * 2 > n ? n : d.cols) : d.cols, cw = tr.row ? Math.max(40, Math.min(d.cell, Math.floor((W - 10 * (colN - 1)) / colN))) : d.cell;   /* KURAL: hücre genişliği sütun genişliğiyle aynı — kartlar üst üste binmez */
const cell = (it, i) => { const sel = !!st.sel[i]; const mk = sel ? " ok" : (st.flashBad === i ? " bad" : ""); return `<div class="wm-pic${mk}" data-mt="${i}" style="width:${cw}px;height:${cw}px;padding:6px">${it.html}</div>`; };   /* seçildi işareti nötr (turkuaz); kırmızı yalnızca yanlış geri bildirimi */
body = dots + `<div class="aud-note" style="text-align:center;font-weight:800;margin-bottom:6px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap"><span>Kural: ${tr.rule}</span><button type="button" data-mtbtn="ferr-say" aria-label="Kuralı tekrar dinle" style="flex:none;width:40px;height:40px;border-radius:50%;border:2px solid #0A847E;background:#fff;color:#0A847E;display:inline-flex;align-items:center;justify-content:center;cursor:pointer"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg></button></div><div class="wm-grid" style="grid-template-columns:repeat(${colN}, ${cw}px);justify-content:center;">${tr.items.map(cell).join("")}</div>` ;
} else if(st.kind === "cups"){
const tr = st.trials[ti], bw = Math.min(W, 460), cw = Math.min(bw / tr.n * 0.8, ((isLs ? H - 30 : H) - 80) / 1.1), ch = cw * 1.1, bh = ch + 62;
info = st.phase === "show" ? "<b>Topu takip et…</b>" : st.phase === "ask" ? "Top <b>hangi bardağın</b> altında?" : (st.pick === tr.ball ? "<b>Buldun!</b>" : "Top buradaydı");
const bsz = Math.round(Math.min(32, cw * 0.55)), ballSlot = st.slot ? st.slot.indexOf(tr.ball) : tr.ball;   /* KURAL (Bardak Oyunu): top kendi bardağıyla birlikte hareket eder ve onun tam altında durur; bardak inince top gizlenir (karıştırma sırasında bardakların dışında top görünmez); konumlar kutu genişliğine göre yüzde ile verilir (çizim ile karıştırma aynı ölçüyü kullanır) */
const showBall = (st.phase === "show" && st.lift) || st.phase === "fb";   /* bardak inikken top çizilmez */
body = dots + `<div id="cupsBox" style="position:relative;width:${bw}px;height:${bh}px;margin:10px auto 0">${showBall ? `<div class="cup-ball" data-ball="${tr.ball}" style="transition:left 400ms ease-in-out;left:calc(${((ballSlot + 0.5) * 100 / tr.n).toFixed(3)}% - ${bsz / 2}px);top:${bh - 6 - bsz - Math.round(ch * 0.03)}px;width:${bsz}px;height:${bsz}px"></div>` : ""}` +
Array.from({length: tr.n}, (_, c) => { const slot = st.slot ? st.slot.indexOf(c) : c, lift = (st.phase === "show" && st.lift && c === tr.ball) || (st.phase === "fb" && (c === tr.ball || c === st.pick));
return `<div class="cup" data-cup="${c}" ${st.phase === "ask" ? `data-mt="${c}"` : ""} style="width:${cw}px;height:${ch}px;left:calc(${((slot + 0.5) * 100 / tr.n).toFixed(3)}% - ${cw / 2}px);top:${bh - ch - 6}px;transform:translateY(${lift ? -46 : 0}px)">${gimg("cupDown") ? `<img src="${gimg("cupDown")}" alt="" style="width:100%;height:100%;object-fit:contain;object-position:bottom;pointer-events:none;filter:drop-shadow(0 4px 3px rgba(0,0,0,.2))">` : CUP_SVG(["#E5484D","#2E6FD8","#1FA463","#F5A524","#8B5CF6"][0])}</div>`; }).join("") + `</div>`;
} else if(st.kind === "mmath"){
const tr = st.trials[ti];
if(st.phase === "show"){ const k = st.si; let main = "";
if(isPre()){ const n = k === 0 ? tr.start : Math.abs(tr.ops[k - 1]), sign = k === 0 ? "" : (tr.ops[k - 1] > 0 ? "+" : "−");
main = k < 0 ? "" : `<div style="font-size:${isLs ? 22 : 30}px;font-weight:900;color:${sign === "−" ? "#E5484D" : "var(--teal-dark)"}">${sign}${n}</div><div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">${Array.from({length:n}, () => `<div class="wm-card" style="width:${isLs ? 46 : 58}px;height:${isLs ? 46 : 58}px;padding:4px;${sign === "−" ? "opacity:.45" : ""}"><img src="${tr.pic.src}" alt="" style="width:100%;height:100%;object-fit:contain"></div>`).join("")}</div><div style="font-weight:800;margin-top:6px">${k === 0 ? "kutuda" : sign === "+" ? "kutuya girdi" : "kutudan çıktı"}</div>`; }
else main = k < 0 ? "" : `<div style="font-size:64px;font-weight:900;color:var(--teal-dark)">${k === 0 ? tr.start : (tr.ops[k - 1] > 0 ? "+ " : "− ") + Math.abs(tr.ops[k - 1])}</div>`;
info = "<b>Aklında tut…</b>"; body = dots + `<div class="mm-box"${isLs ? ' style="font-size:30px;margin:0"' : ""}>📦</div>${main}`; }
else { info = isPre() ? `Kutuda <b>kaç tane</b> var?` : "<b>Sonuç</b> kaç?";
body = dots + `<div class="mm-box"${isLs ? ' style="font-size:30px;margin:0"' : ""}>📦 ?</div><div class="qz-txt-grid">${tr.opts.map((v, i) => `<div class="wm-pic qz-txt${st.phase === "fb" ? (v === tr.res ? " ok" : (i === st.pick ? " bad" : "")) : ""}" data-mt="${i}" style="font-size:26px;font-weight:900">${v}</div>`).join("")}</div>`; }
} else if(st.kind === "who"){
const fimg = (fid) => `<img src="${FACE_ID_IMAGES[fid]}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:12px">`;
if(st.phase === "study"){ const it = st.study[st.si]; info = `<b>Kim ne söyledi?</b> ${Math.max(0, st.si + 1)}/${st.study.length}`;
body = it ? `<div style="display:flex;gap:14px;align-items:center;justify-content:center"><div style="text-align:center"><div class="wm-card" style="width:${isLs ? 90 : 110}px;height:${isLs ? 90 : 110}px;padding:3px">${fimg(st.ppl[it.p].i)}</div><b>${st.ppl[it.p].nm}</b></div><div class="who-bubble"><img src="${it.x.src}" alt=""><span>${it.x.n}</span></div></div>` : ""; }
else { const it = st.test[Math.min(st.qi, st.test.length - 1)]; info = `<b>Bunu kim söyledi?</b> · ${st.qi + 1}/${st.test.length}`;
body = `<div style="display:flex;${isLs ? "" : "flex-direction:column;"}gap:12px;align-items:center;justify-content:center"><div class="wm-card" style="width:${isLs ? 100 : 120}px;height:${isLs ? 100 : 120}px;padding:6px"><img src="${it.x.src}" alt="" style="width:100%;height:100%;object-fit:contain"></div><div style="display:flex;gap:10px;justify-content:center">${st.ppl.map((pp, i) => `<div class="wm-pic${st.phase === "fb" ? (i === it.p ? " ok" : (i === st.pick ? " bad" : "")) : ""}" data-mt="${i}" style="width:100px;height:${isLs ? 112 : 120}px;flex-direction:column;padding:4px"><div style="width:86px;height:86px">${fimg(pp.i)}</div><b>${pp.nm}</b></div>`).join("")}</div></div>`; }
} else if(st.kind === "rhy"){
const tr = st.trials[ti];
info = st.phase === "play" ? "<b>Dinle…</b>" : st.phase === "input" ? `<b>Sıra sende!</b> Aynı ritimle vur · <span id="rhyCnt">${st.taps.length}/${tr.L}</span>` : (st.last ? "<b>Aynı ritim!</b>" : "Ritim biraz farklıydı");
const drum = `<button type="button" id="rhyDrum" class="rhy-drum" ${st.phase === "input" ? `data-mt="0"` : ""}>🥁</button>`, done = st.phase === "input" ? `<div class="wm-btns" style="margin:10px auto 0"><button type="button" class="wm-btn diff" data-mtbtn="rhy-done">Bitti</button></div>` : "";
body = isLs ? dots + `<div style="display:flex;gap:20px;align-items:center;justify-content:center">${drum}${done}</div>` : dots + drum + done;
} else if(st.kind === "mem"){
const n = st.cards.length, d = wmGridDims(n, W, isLs ? H - 40 : H - 20, 58);
info = `<b>Eşleri bul</b> · ${Object.keys(st.done).length / 2}/${st.P}`;
body = `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + st.cards.map((c, i) => { const up = st.done[i] || st.open.includes(i);
return `<div class="wm-pic mem-card${up ? " up" : ""}${st.done[i] ? " ok" : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;padding:5px">${up ? `<img src="${c.x.src}" alt="" style="width:100%;height:100%;object-fit:contain">` : `<span class="mem-back">?</span>`}</div>`; }).join("") + `</div>`;
} else if(st.kind === "rl"){
info = `Yeşilde <b>basılı tut</b>, kırmızıda <b>bırak</b> · yakalanma ${st.caught}`;
body = `<div style="display:flex;${isLs ? "" : "flex-direction:column;"}gap:14px;align-items:center;justify-content:center"><div id="rlLight" class="rl-light ${st.light}${gimg("tlRed") ? " gi" : ""}">${rlInner(st.light)}</div><div style="flex:1;width:100%;max-width:420px"><div id="rlTrack" class="rl-track"><div id="rlProg" class="rl-prog" style="width:${st.prog}%"></div><div id="rlRunner" class="rl-run" style="left:calc(${st.prog}% - 24px)">${zihniSVG("happy")}</div><div class="rl-flag">🏁</div></div><button type="button" id="rlBtn" class="rl-btn">Basılı tut</button></div></div>`;
} else if(st.kind === "wt"){
const tr = st.trials[ti], im = (x) => `<img src="${x.src}" alt="" style="width:100%;height:100%;object-fit:contain">`;
const ord = `<div class="wt-order">${tr.order.map(o => `<div class="wt-o"><b>${o.n}×</b><div style="width:40px;height:40px">${im(o.x)}</div></div>`).join("")}</div>`;
if(st.phase === "order"){ info = "<b>Siparişi aklında tut…</b>"; body = `<div style="display:flex;flex-direction:column;align-items:center;gap:8px"><div style="width:70px;height:70px">${zihniSVG("happy")}</div>${ord}</div>`; }
else { const showOrd = !tr.hide || st.phase === "fb"; info = st.phase === "fb" ? (st.okS ? "<b>Afiyet olsun!</b>" : "Sipariş böyleydi") : `Tepsiyi <b>siparişe göre</b> hazırla · ⭐ ${st.score}`;
const tray = `<div class="wt-tray">${st.tray.length ? st.tray.map((i, k) => `<div class="wt-it" data-mt="t${k}">${im(tr.shelf[i])}</div>`).join("") : `<span style="color:var(--ink-soft);font-weight:700">Tepsi boş</span>`}</div>`;
const shelf = `<div style="display:flex;gap:8px;justify-content:center">${tr.shelf.map((x, i) => `<div class="wm-pic" data-mt="${i}" style="width:64px;height:64px;padding:5px">${im(x)}</div>`).join("")}</div>`;
const ordH = showOrd ? ord : `<div class="wt-order" style="color:var(--ink-soft);font-weight:800">Sipariş gizli · hatırla!</div>`, serve = st.phase === "input" ? `<div class="wm-btns" style="margin:8px auto 0"><button type="button" class="wm-btn same" data-mtbtn="wt-serve">Servis et</button></div>` : "";
body = isLs ? `<div style="display:flex;gap:16px;align-items:center;justify-content:center"><div>${ordH}${tray}</div><div>${shelf}${serve}</div></div>` : ordH + tray + shelf + serve; }
} else if(st.kind === "dr"){
const c = st.cfg, sz = Math.min(isLs ? H - 60 : 200, 200);
info = st.phase === "demo" ? "<b>Dinle…</b> ritmi hisset" : `Vuruşla <b>aynı anda</b> davula vur · ⭐ <b id="pkScore">${st.score}</b>/${c.taps}`;
body = `<div style="position:relative;width:${sz}px;height:${sz}px;margin:0 auto"><div id="drRing" class="dr-ring"></div><button type="button" id="drDrum" class="rhy-drum dr-drum" ${st.phase === "tap" ? `data-mt="0"` : ""} style="width:${sz * 0.78}px;height:${sz * 0.78}px">🥁</button></div>`;
} else if(st.kind === "kav"){
const ah = isLs ? H - 20 : Math.min(H - 20, 440);
info = `Yalnızca <span id="pkTgt" class="pk-chip" style="background:#2E6FD8">${isPre() ? ({ hayvan:"hayvanlar", meyve:"meyveler", "taşıt":"taşıtlar", oyuncak:"oyuncaklar" })[st.tg] : KA_CATS[st.tg]}</span> · ⭐ <b id="pkScore">${st.score}</b>`;
body = `<div id="pkArea" class="pk-area" style="height:${ah}px"></div>`;
} else if(st.kind === "ubal"){
const tr = st.trials[ti], ah = isLs ? H - 50 : Math.min(H - 60, 400);
info = `<b>${tr.w}</b> ile sonu benzeyen balığı yakala · ⭐ ${st.score} · ${ti + 1}/${st.trials.length}`;
body = `<div class="pk-sea" style="height:${ah}px">${tr.fish.map((w, k) => `<div class="pk-fish${st.phase === "fb" ? (k === tr.ans ? " ok" : k === st.pick ? " bad" : "") : ""}" data-mt="${k}" style="top:${12 + k * (76 / tr.fish.length)}%;left:${k % 2 ? 110 : -20}%"><span>${w}</span></div>`).join("")}</div>`;
} else if(st.kind === "htrn"){
const tr = st.trials[ti], sz = Math.min(isLs ? H - 120 : 120, 120);
info = `Heceleri sırayla takarak <b>treni</b> kur · ⭐ ${st.score}`;
const train = `<div class="pk-train${gimg("loco") ? " gi" : ""}"><div class="pk-loco">${gimg("loco") ? `<img src="${gimg("loco")}" alt="">` : "🚂"}</div>${st.placed.map(k => `<div class="pk-car on">${tr.cars[k].s}</div>`).join("")}${Array.from({length: tr.sy.length - st.placed.length}, () => `<div class="pk-car empty"></div>`).join("")}</div>`;
body = `<div style="display:flex;${isLs ? "" : "flex-direction:column;"}gap:10px;align-items:center;justify-content:center"><div class="wm-card" style="width:${sz}px;height:${sz}px;padding:5px"><img src="${tr.pic.src}" alt="" style="width:100%;height:100%;object-fit:contain"></div><div>${train}<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px">${tr.cars.map((c, i) => st.placed.includes(i) ? "" : `<div class="pk-car${st.bad[i] ? " bad" : ""}" data-mt="${i}">${c.s}</div>`).join("")}</div></div></div>`;
} else if(st.kind === "slide"){
const R = st.R, C = st.C, w = Math.min(isLs ? H - 30 : 300 * tabletScale(), W - 20), cw = w / C, ch = w * 0.75 / R;
info = st.peek ? "<b>Resme bak…</b>" : st.phase === "fb" ? "<b>Tamamlandı!</b>" : `Parçaları boşluğa kaydır · hamle ${st.moves} (en fazla ${st.limit})`;
const tile = (v, k) => v === R * C - 1 && !st.peek && st.phase !== "fb" ? `<div data-mt="${k}" class="pk-tile empty"></div>` : `<div data-mt="${k}" class="pk-tile" style="background-image:url('${st.img}');background-size:${C * 100}% ${R * 100}%;background-position:${C > 1 ? (v % C) / (C - 1) * 100 : 0}% ${R > 1 ? Math.floor(v / C) / (R - 1) * 100 : 0}%"></div>`;
const arr = st.peek ? Array.from({length: R * C}, (_, i) => i) : st.tiles;
body = `<div style="display:grid;grid-template-columns:repeat(${C}, ${cw - 3}px);grid-auto-rows:${ch - 3}px;gap:3px;justify-content:center;background:#C9D3DE;padding:3px;border-radius:12px;width:max-content;margin:0 auto">${arr.map((v, k) => tile(v, k)).join("")}</div>`;
} else if(st.kind === "kopru"){
const tr = st.trials[ti], U = Math.min((W - 40) / 9, 34), bar = (n, cls, mt) => `<div class="pk-plank ${cls || ""}" ${mt != null ? `data-mt="${mt}"` : ""} style="width:${n * U}px">${Array.from({length:n}, () => "<span></span>").join("")}</div>`;
info = tr.two ? `<b>İki tahta</b> seç: boşluğu tam kapatsın · ⭐ ${st.score}` : `Boşluğa <b>tam uyan</b> tahtayı seç · ⭐ ${st.score}`;
const ok = st.phase === "fb" && (tr.two ? st.okTwo : tr.opts[st.pick] === tr.gap);
const scene = `<div class="pk-bridge"><div class="pk-cliff l"></div><div class="pk-gap" style="width:${tr.gap * U}px">${st.phase === "fb" && ok ? bar(tr.gap, "laid") : ""}</div><div class="pk-cliff r"></div><div class="pk-walker${ok ? " go" : ""}" style="--d:${tr.gap * U + 60}px">${zihniSVG("happy")}</div></div>`;
const planks = `<div style="display:flex;flex-direction:column;gap:${isLs ? 6 : 8}px;align-items:center;margin-top:${isLs ? 0 : 12}px">${tr.opts.map((n, i) => bar(n, (st.sel.includes(i) ? "sel" : "") + (st.phase === "fb" && !tr.two && i === st.pick ? (ok ? " ok" : " bad") : ""), st.phase === "input" ? i : null)).join("")}</div>`;
body = isLs ? `<div style="display:flex;gap:20px;align-items:center;justify-content:center"><div style="min-width:55%">${scene}</div>${planks}</div>` : scene + planks;
} else if(st.kind === "esc"){
const n = st.n, w = (isLs ? Math.min(H - 30, W - 20) : W - 20) * (window._fitK || 1), c = w / n;
info = `Zihni'yi <b>yıldıza</b> götür, bulutlara yakalanma`;
let walls = ""; st.walls.forEach((wl, i) => { const x = (i % n) * c, y = Math.floor(i / n) * c; if(wl.n) walls += `<line x1="${x}" y1="${y}" x2="${x + c}" y2="${y}"/>`; if(wl.w) walls += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + c}"/>`; if(i % n === n - 1 && wl.e) walls += `<line x1="${x + c}" y1="${y}" x2="${x + c}" y2="${y + c}"/>`; if(Math.floor(i / n) === n - 1 && wl.s) walls += `<line x1="${x}" y1="${y + c}" x2="${x + c}" y2="${y + c}"/>`; });
const ctr = (i) => [((i % n) + 0.5) * c, (Math.floor(i / n) + 0.5) * c], [gx, gy] = ctr(n * n - 1), [px, py] = ctr(st.pos);
const taps = Array.from({length: n * n}, (_, i) => `<rect data-mt="${i}" style="cursor:pointer" x="${(i % n) * c}" y="${Math.floor(i / n) * c}" width="${c}" height="${c}" fill="${st.flash && i === 0 ? "#FCE3E3" : "transparent"}"/>`).join("");
body = `<svg id="escSvg" data-c="${c}" viewBox="-3 -3 ${w + 6} ${w + 6}" width="${w}" height="${w}" style="display:block;margin:0 auto;background:#fff;border-radius:12px;touch-action:manipulation">${taps}<g stroke="#2B3A4A" stroke-width="${Math.max(2, c * 0.08)}" stroke-linecap="round" pointer-events="none">${walls}</g><text x="${gx}" y="${gy + c * 0.18}" text-anchor="middle" font-size="${c * 0.6}" pointer-events="none">⭐</text>${st.cl.map((k, j) => { const [x, y] = ctr(k); return gimg("cloud") ? `<g id="escCl${j}" transform="translate(${x},${y})" pointer-events="none"><image href="${gimg("cloud")}" x="${-c * 0.42}" y="${-c * 0.36}" width="${c * 0.84}" height="${c * 0.72}"/></g>` : `<text id="escCl${j}" x="${x}" y="${y + c * 0.18}" text-anchor="middle" font-size="${c * 0.62}" pointer-events="none">☁️</text>`; }).join("")}<circle id="escMe" cx="${px}" cy="${py}" r="${c * 0.3}" fill="#3CCFC0" stroke="#1E8F86" stroke-width="2" pointer-events="none"/></svg>`;
} else if(st.kind === "bln" || st.kind === "ctc"){
const ah = isLs ? H - 20 : Math.min(H - 20, 460);
info = st.kind === "bln" ? `Yalnızca <span id="pkTgt" class="pk-chip" style="background:${PK_COLS[st.tgt][1]}">${PK_COLS[st.tgt][0]}</span> balonları patlat · ⭐ <b id="pkScore">${st.score}</b>` : `Meyveleri yakala, taşları yakalama · ⭐ <b id="pkScore">${st.score}</b>`;
body = `<div id="pkArea" class="pk-area" style="height:${ah}px">${st.kind === "ctc" ? `<div id="pkBasket" class="pk-basket" style="left:${st.bx * 100}%">${gimg("basket") ? `<img src="${gimg("basket")}" alt="" style="position:absolute;left:50%;bottom:0;transform:translateX(-50%);height:185%;width:auto;max-width:none;pointer-events:none">` : PK_BASKET_SVG}</div>` : ""}</div>`;
} else if(st.kind === "mol"){
const sz = Math.min(isLs ? H - 30 : 320 * tabletScale(), W - 20);
info = `Köstebeğe vur, <b>şapkalıya vurma</b> · ⭐ <b id="pkScore">${st.score}</b> · ${st.k}/${st.cfg.N}`;
body = `<div id="pkMoles" class="pk-moles" style="width:${sz}px;height:${sz}px">${Array.from({length:9}, (_, k) => `<div class="pk-hole" data-mt="${k}">${gimg("hole") ? `<img class="pk-mimg" src="${gimg("hole")}" alt="">` : ""}</div>`).join("")}</div>`;
} else if(st.kind === "bag"){
const tr = st.trials[ti], sz = Math.min(isLs ? H - 50 : 170, W * 0.5);
const bag = (open) => gimg("bagOpen") ? `<img src="${gimg(open ? "bagOpen" : "bagClosed")}" alt="" style="width:${sz * 1.15}px;height:${sz}px;object-fit:contain;filter:drop-shadow(0 4px 4px rgba(0,0,0,.18))">` : `<svg viewBox="0 0 100 90" width="${sz}" height="${sz * 0.9}"><rect x="12" y="26" width="76" height="58" rx="10" fill="#B9773A" stroke="#7A4A1E" stroke-width="3"/><rect x="36" y="12" width="28" height="16" rx="6" fill="none" stroke="#7A4A1E" stroke-width="5"/>${open ? `<rect x="18" y="24" width="64" height="10" rx="4" fill="#3A2410"/>` : `<rect x="12" y="44" width="76" height="6" fill="#7A4A1E"/><rect x="45" y="40" width="10" height="14" rx="2" fill="#FFD23F"/>`}</svg>`;
if(st.phase === "show" || st.phase === "closed"){ const x = tr.inBag[st.bi]; info = st.phase === "show" ? `Zihni bavulunu hazırlıyor… <b>${Math.max(0, st.bi + 1)}/${tr.inBag.length}</b>` : "<b>Bavul kapandı!</b>";
body = `<div style="display:flex;${isLs ? "" : "flex-direction:column;"}align-items:center;justify-content:center;gap:8px"><div style="width:80px;height:80px">${zihniSVG("happy")}</div>${st.phase === "show" && x ? `<div class="wm-card pk-drop" style="width:90px;height:90px;padding:5px"><img src="${x.src}" alt="" style="width:100%;height:100%;object-fit:contain"></div>` : ""}${bag(st.phase === "show")}</div>`; }
else { const d = wmGridDims(tr.opts.length, W, isLs ? H - 40 : H - 60, 120); info = tr.askIn ? "Hangisi <b>bavulda</b>?" : "Hangisi bavulda <b>yok</b>?";
body = `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">${tr.opts.map((x, i) => `<div class="wm-pic${st.phase === "fb" ? (i === tr.ans ? " ok" : i === st.pick ? " bad" : "") : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;padding:5px"><img src="${x.src}" alt="" style="width:100%;height:100%;object-fit:contain"></div>`).join("")}</div>`; }
} else if(st.kind === "smn"){
const c = st.cfg; info = st.phase === "play" ? `<b>İzle ve dinle…</b> dizi ${st.seq.length}` : st.phase === "input" ? `<b>Aynı sırayla</b> dokun · ${st.pos}/${st.seq.length}` : st.phase === "fb" ? "Olmadı! Bir dahakine…" : `⭐ Dizi ${st.score}`;
if(st.lh){ const ah = isLs ? H - 20 : Math.min(H - 20, 420);
body = `<div class="pk-sea" style="height:${ah}px">${c.pts.map((p, k) => `<div class="pk-lh" data-pad="${k}" ${st.phase === "input" ? `data-mt="${k}"` : ""} style="left:${p[0]}%;top:${p[1]}%"><div class="off">${LH_SVG(false, k)}</div><div class="on">${LH_SVG(true, k)}</div></div>`).join("")}</div>`; }
else { const kw = Math.min(isLs ? (H - 60) / 2 : 130, (W - 30) / 2);
body = `<div style="display:grid;grid-template-columns:repeat(2, ${kw}px);gap:10px;justify-content:center">${TONE_KEYS.map((k, i) => `<button type="button" class="tone-k pk-pad" data-pad="${i}" ${st.phase === "input" ? `data-mt="${i}"` : ""} style="width:${kw}px;height:${kw}px;background:${k.c};--kc:${k.c}"></button>`).join("")}</div>`; }
} else if(st.kind === "clue"){
const tr = st.trials[ti], d = wmGridDims(tr.cands.length, isLs ? W * 0.55 : W, isLs ? H - 40 : H - 130, 100);
info = st.phase === "clues" ? `<b>İpuçlarını dinle…</b> ${st.shown}/${tr.clues.length}` : st.phase === "ask" ? "İpuçlarına uyan <b>tek şekil</b> hangisi?" : (st.pick != null && tr.cands[st.pick] === tr.tg ? "<b>Buldun!</b>" : "Doğrusu yeşil olan");
const clues = `<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px">${tr.clues.map((c, k) => `<span class="anl-w" style="font-weight:900;${k < st.shown || st.phase !== "clues" ? "" : "opacity:.15"}">${c}</span>`).join("")}</div>`;
const grid = `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">${tr.cands.map((x, i) => `<div class="wm-pic${st.phase === "fb" ? (x === tr.tg ? " ok" : i === st.pick ? " bad" : "") : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;padding:6px">${cfShape(x)}</div>`).join("")}</div>`;
body = isLs ? `<div style="display:flex;gap:14px;align-items:center;justify-content:center"><div style="max-width:40%">${dots}${clues}</div>${grid}</div>` : dots + clues + grid;
} else if(st.kind === "ctab"){
const tr = st.trials[ti], cw = Math.min(isLs ? (H - 70) / (tr.R + 1) : (W - 20) / (tr.C + 1), 76) * (window._fitK || 1);
info = "Her parçayı <b>rengine ve şekline</b> göre doğru kutuya koy";
const hdr = `<div></div>` + tr.cols.map(s => `<div class="ct-h">${shapeSVG(CF_SH[s][1], "#9AA9B8")}</div>`).join("");
const body2 = tr.rows.map((c, r) => `<div class="ct-h"><span style="display:block;width:70%;height:70%;border-radius:50%;background:${CF_COL[c][1]}"></span></div>` + tr.cols.map((s, k) => { const i = r * tr.C + k, cell = tr.cells[i], pl = st.placed[i];
return `<div class="ct-c${st.bad === i ? " bad" : ""}" data-mt="${i}">${cell.given || pl != null ? shapeSVG(CF_SH[cell.s][1], CF_COL[cell.c][1]) : ""}</div>`; }).join("")).join("");
const table = `<div style="display:grid;grid-template-columns:repeat(${tr.C + 1}, ${cw}px);grid-auto-rows:${cw}px;gap:4px;justify-content:center">${hdr}${body2}</div>`;
const pieces = `<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:10px">${tr.pieces.filter(i => !Object.values(st.placed).includes(i)).map(i => `<div class="wm-pic${st.sel === i ? " sel" : ""}" data-mt="p${i}" style="width:${Math.min(cw, 60)}px;height:${Math.min(cw, 60)}px;padding:6px">${shapeSVG(CF_SH[tr.cells[i].s][1], CF_COL[tr.cells[i].c][1])}</div>`).join("")}</div>`;
body = isLs ? `<div style="display:flex;gap:14px;align-items:center;justify-content:center">${table}<div style="max-width:40%">${dots}${pieces}</div></div>` : dots + table + pieces;
} else if(st.kind === "cobj"){
const tr = st.trials[ti];
if(st.phase === "show"){ const d = wmGridDims(tr.items.length, W, isLs ? H - 30 : H - 60, 120); info = "<b>Hangi resim hangi renk kartta?</b> İyi bak!";
body = dots + `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">${tr.items.map(x => `<div class="wm-card" style="width:${d.cell}px;height:${d.cell}px;padding:7px;background:${CO_COL[x.ci][1]}"><div style="width:100%;height:100%;background:#fff;border-radius:10px;padding:4px"><img src="${x.p.src}" alt="" style="width:100%;height:100%;object-fit:contain"></div></div>`).join("")}</div>`; }
else { const it = tr.test[Math.min(st.qi, tr.test.length - 1)]; if(!st._co || st._coQ !== st.ti + "-" + st.qi){ const others = shuffleArray(CO_COL.map((_, i) => i).filter(i => i !== it.ci)).slice(0, tr.nOpt - 1); st._co = shuffleArray([it.ci].concat(others)); st._coQ = st.ti + "-" + st.qi; }
const sz = Math.min(isLs ? H - 90 : 150, 150); info = `Bu <b>hangi renk</b> karttaydı? · ${st.qi + 1}/${tr.test.length}`;
body = dots + `<div style="display:flex;${isLs ? "" : "flex-direction:column;"}gap:12px;align-items:center;justify-content:center"><div class="wm-card" style="width:${sz}px;height:${sz}px;padding:6px"><img src="${it.p.src}" alt="" style="width:100%;height:100%;object-fit:contain"></div><div style="display:flex;gap:10px">${st._co.map(ci => `<button type="button" class="co-sw${st.phase === "fb" ? (ci === it.ci ? " ok" : ci === st.pick ? " bad" : "") : ""}" data-mt="${ci}" style="background:${CO_COL[ci][1]}"></button>`).join("")}</div></div>`; }
} else if(st.kind === "porder"){
const tr = st.trials[ti];
if(st.phase === "show"){ const x = tr.seq[st.si], sz = Math.min(isLs ? H - 50 : 190, W * 0.6); info = `<b>Sırayı izle…</b> ${Math.max(0, st.si + 1)}/${tr.seq.length}`; body = dots + `<div class="wm-card" style="width:${sz}px;height:${sz}px;padding:6px;margin:0 auto">${x ? `<img src="${x.src}" alt="" style="width:100%;height:100%;object-fit:contain">` : ""}</div>`; }
else { const d = wmGridDims(tr.opts.length, W, isLs ? H - 40 : H - 60, 110); info = st.reveal ? "Sıra şöyleydi" : `Gördüğün <b>sırayla</b> dokun · ${st.pos}/${tr.seq.length}`;
body = dots + `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">${tr.opts.map((x, i) => { const k = tr.seq.indexOf(x), done = k >= 0 && k < st.pos; return `<div class="wm-pic${done ? " ok" : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;padding:5px;position:relative"><img src="${x.src}" alt="" style="width:100%;height:100%;object-fit:contain">${(done || st.reveal) && k >= 0 ? `<span class="num">${k + 1}</span>` : ""}</div>`; }).join("")}</div>`; }
} else if(st.kind === "ftrace"){
const tr = st.trials[ti], ah = isLs ? H - 30 : Math.min(H - 30, 420);
info = st.phase === "fb" ? `İzleme: <b>%${Math.round((st.last || 0) * 100)}</b> ${st.last >= 0.7 ? "· harika!" : "· biraz daha yakından izle"}` : `Parmağını <b>topun üstünde tut</b>, top nereye giderse onunla git · ${ti + 1}/${st.trials.length}`;
body = `<div id="ftArea" style="position:relative;width:100%;height:${ah}px;background:var(--panel);border:2px solid var(--line);border-radius:18px;overflow:hidden;touch-action:none"><div id="ftDot" class="ft-dot" style="left:${(ftPos(tr.p, 0)[0] * W) - 18}px;top:${ftPos(tr.p, 0)[1] * ah - 18}px"></div></div>`;
} else if(st.kind === "ecount"){
const tr = st.trials[ti], ah = Math.max(160, isLs ? H - 130 : Math.min(H - 200, 340));   /* KURAL: tek ekran — alan, değerlendirme satırı ve Sonraki birlikte görünür */
info = tr.onlyStar ? "Parmağını kullanmadan, <b>yalnızca yıldızları</b> gözünle say" : "Parmağını kullanmadan, <b>gözünle</b> soldan sağa say";
/* KURAL (Gözle Say): 1) şekiller görünür, çocuk gözüyle sayar, "Devam"a basar; 2) şekiller kalkar, sayılar çıkar, çocuk saydığı sayıya dokunur (doğru yeşil, yanlış kırmızı; yanlışta hata kendiliğinden +1); 3) "Sonraki ▶" ile yeni sayfa */
    if(st.ecTi !== ti){ st.ecTi = ti; st.ecPhase = "count"; st.ecPick = null; const A = tr.ans, cand = []; for(let d = 1; cand.length < 3 && d < 6; d++){ if(A + d <= 30) cand.push(A + d); if(cand.length < 3 && A - d >= 1) cand.push(A - d); } const nums = shuffleArray([A].concat(cand.slice(0, 3))); st.ecNums = nums; }
    if(st.ecPhase === "count"){
      body = `<div style="position:relative;width:100%;height:${ah}px;background:var(--panel);border:2px solid var(--line);border-radius:18px;overflow:hidden">${tr.items.map(it => `<div style="position:absolute;left:${it.x}%;top:${it.y}%;width:30px;height:30px">${shapeSVG(it.sh, it.c)}</div>`).join("")}</div>` + `<div class="wm-btns" style="margin:10px auto 0;display:flex;justify-content:center"><button type="button" class="wm-btn same" data-ecstep="cont" style="min-width:150px">Devam ▶</button></div>`;
    } else {
      info = st.ecPhase === "fb" ? (st.ecPick === tr.ans ? "Doğru! <b>" + tr.ans + "</b> tane" : "Doğrusu <b>" + tr.ans + "</b> tane") : (tr.onlyStar ? "Kaç <b>yıldız</b> saydın? Sayıya dokun" : "Kaç tane saydın? <b>Sayıya</b> dokun");
      const cell = Math.min(96, Math.floor((W - 30) / 2));
      body = `<div class="wm-grid" style="grid-template-columns:repeat(2, ${cell}px);justify-content:center;gap:12px;margin:8px auto">${st.ecNums.map(n => { const cls = st.ecPhase === "fb" ? (n === tr.ans ? " ok" : (n === st.ecPick ? " bad" : "")) : ""; return `<button type="button" class="wm-pic${cls}" data-ecans="${n}" style="width:${cell}px;height:${cell}px;font:inherit;font-weight:900;font-size:${Math.round(cell * 0.42)}px;color:var(--ink,#1C2B39)">${n}</button>`; }).join("")}</div>` + (st.ecPhase === "fb" ? `<div class="wm-btns" style="margin:10px auto 0;display:flex;justify-content:center"><button type="button" class="wm-btn same" data-judge="9" style="min-width:150px">Sonraki ▶</button></div>` : "");
    }
} else if(st.kind === "nword"){
if(st.phase === "learn"){ const x = st.learn[st.li], sz = Math.min(isLs ? H - 70 : 200, W * 0.6); info = `<b>Yeni arkadaşlarla tanış</b> · ${Math.max(0, st.li + 1)}/${st.learn.length}`;
body = x ? `<div style="display:flex;${isLs ? "" : "flex-direction:column;"}gap:10px;align-items:center;justify-content:center"><div class="wm-card" style="width:${sz}px;height:${sz}px;padding:6px"><img src="${CREATURE_IMAGES[x.ci]}" alt="" style="width:100%;height:100%;object-fit:contain"></div><div style="font-size:30px;font-weight:900;color:var(--teal-dark)">${x.nm}</div></div>` : ""; }
else { const it = st.test[Math.min(st.qi, st.test.length - 1)], opts = st.learn.map(x => x.ci).concat(st.lure != null ? [st.lure] : []); if(!st._ord || st._ordQi !== st.qi){ st._ord = shuffleArray(opts); st._ordQi = st.qi; }
const d = wmGridDims(st._ord.length, W, isLs ? H - 40 : H - 60, 120); info = `Hangisi <b>${it.nm}</b>? · ${st.qi + 1}/${st.test.length}`;
body = `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">${st._ord.map(ci => `<div class="wm-pic${st.phase === "fb" ? (ci === it.ci ? " ok" : ci === st.pick ? " bad" : "") : ""}" data-mt="${ci}" style="width:${d.cell}px;height:${d.cell}px;padding:5px"><img src="${CREATURE_IMAGES[ci]}" alt="" style="width:100%;height:100%;object-fit:contain"></div>`).join("")}</div>`; }
} else if(st.kind === "pairm"){
const tr = st.trials[ti], n = tr.items.length, cw = Math.min((W - 8 * n) / n, isLs ? 90 : 110 * tabletScale());
info = "Satırda <b>aynı olan iki</b> taneyi bul";
body = dots + `<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">${tr.items.map((it, i) => `<div class="wm-pic${st.pk.includes(i) ? " ok" : st.bad[i] ? " bad" : ""}" data-mt="${i}" style="width:${cw}px;height:${cw}px;padding:4px">${it.h}</div>`).join("")}</div>`;
} else if(st.kind === "per"){
const tr = st.trials[ti], ah = isLs ? H - 20 : Math.min(H - 20, 440);
info = `Gözün <b>ortadaki noktada</b>; kenarda yıldız çıkınca dokun · ${ti + 1}/${st.trials.length}`;
body = `<div style="position:relative;width:100%;height:${ah}px;background:var(--panel);border:2px solid var(--line);border-radius:18px;overflow:hidden"><div style="position:absolute;left:50%;top:50%;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#E5484D;box-shadow:0 0 0 6px rgba(229,72,77,.2)"></div>${st.phase === "show" ? `<div data-mt="t" style="position:absolute;left:clamp(30px, ${tr.pos[0]}%, calc(100% - 30px));top:clamp(30px, ${tr.pos[1]}%, calc(100% - 30px));width:54px;height:54px;margin:-27px 0 0 -27px;cursor:pointer">${shapeSVG(tr.lure ? "circle" : "star", tr.lure ? "#2E6FD8" : "#F5A524")}</div>` : ""}</div>`;
} else if(st.kind === "fix"){
const tr = st.trials[ti], ah = isLs ? H - 20 : Math.min(H - 20, 420);
if(st.phase === "judge"){ info = "<b>Gözünü noktadan ayırdı mı?</b> <span style=\"font-weight:700;color:var(--muted)\">· süre durdu</span>"; body = dots + `<div class="aud-key" style="text-align:center">${tr.secs} sn boyunca çocuğun gözlerini izlediniz. Gözünü kırmızı noktadan hiç ayırmadan durabildi mi?</div><div class="aud-key" style="text-align:center;margin-top:6px">Yetişkin: gözünü ayırdıysa <b>Hata sayısı +</b></div><div class="wm-btns" style="margin:6px auto 0"><button type="button" class="wm-btn same" data-judge="9">Sonraki ▶</button></div>`; }
else { info = `<b>Kırmızı noktaya bak</b>, gözünü ayırma · ${tr.secs} sn`; body = `<div id="fixArea" style="position:relative;width:100%;height:${ah}px;background:var(--panel);border:2px solid var(--line);border-radius:18px;overflow:hidden"><div style="position:absolute;left:50%;top:50%;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:#E5484D"></div></div>`; }
} else if(st.kind === "dual"){
const tr = st.trials[ti], ah = isLs ? H - 44 : Math.min(H - 20, 420);
if(st.phase === "ask" || st.ansShown){ const nums = Array.from({length:5}, (_, k) => Math.max(1, tr.beeps - 2) + k); info = st.ansShown ? `Doğrusu: <b>${tr.beeps}</b> bip` : "<b>Kaç bip sesi</b> duydun?";
body = (isLs ? "" : dots) + `<div class="aud-key" style="text-align:center;margin-top:6px">Doğru bip sayısı: <b>${tr.beeps}</b> · yanlış söylediyse <b>Hata sayısı +</b></div><div class="wm-btns" style="margin:6px auto 0"><button type="button" class="wm-btn same" data-judge="9">Sonraki ▶</button></div>`; }
else { info = "Yıldızlara dokun, aynı anda <b>bip seslerini say</b>"; body = `<div id="dualArea" style="position:relative;width:100%;height:${ah}px;background:var(--panel);border:2px solid var(--line);border-radius:18px;overflow:hidden"></div>`; }
} else if(st.kind === "stop"){
const tr = st.trials[ti];
info = `Okun yönündeki düğmeye bas; <b>kırmızı okta basma</b> · ${ti + 1}/${st.trials.length}`;
const arrow = st.phase === "go" || st.phase === "fb" ? `${stopArrowSVG(tr.dir, st.red ? "#E5484D" : "#2E6FD8", isLs ? 84 : 104)}` : `<div style="font-size:40px;color:var(--ink-soft)">+</div>`;   /* durma işareti yalnızca kırmızı ok (yazı yok); ok SVG */
body = dots + `<div style="height:${isLs ? 110 : 150}px;display:flex;flex-direction:column;align-items:center;justify-content:center">${arrow}</div>${stopButtonsHTML()}`;
} else if(st.kind === "vig"){
info = `Yalnızca <b>kırmızı yıldız</b> görünce bas · <span id="vigCnt">${Math.max(0, st.i + 1)}/${st.seq.length}</span>`;
const sz = Math.min(isLs ? H - 120 : 170, 170);
body = `<div id="vigShape" class="wm-card" style="width:${sz}px;height:${sz}px;margin:0 auto;padding:16px">${st.i >= 0 ? shapeSVG(st.seq[st.i].sh, st.seq[st.i].col) : ""}</div><button type="button" class="flu-ok" data-mtbtn="vig-hit" style="margin-top:12px">Gördüm!</button>`;
} else if(st.kind === "pnb"){
const sz = Math.min(isLs ? H - 80 : 240, W * 0.7);
info = `Kare <b>${st.n === 1 ? "bir önceki" : "iki önceki"}</b> ile aynı yerde mi? · <span id="pnbCnt">${Math.max(0, st.i + 1)}/${st.seq.length}</span>`;
const grid = `<div id="pnbGrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:${sz}px;height:${sz}px">${Array.from({length:9}, (_, k) => `<div class="pnb-c${st.i >= 0 && st.seq[st.i] === k ? " on" : ""}"></div>`).join("")}</div>`;
const b = `<button type="button" class="flu-ok" data-mtbtn="pnb-same" style="margin-top:10px;width:220px">Aynı yer!</button>`;
body = isLs ? `<div style="display:flex;gap:18px;align-items:center;justify-content:center">${grid}${b}</div>` : `<div style="display:flex;flex-direction:column;align-items:center">${grid}${b}</div>`;
} else if(st.kind === "csp"){
const tr = st.trials[ti];
if(st.phase === "count"){ const n = tr.counts[st.ci], sz = Math.min(isLs ? H - 110 : 190, 190), pts = [[30,30],[70,30],[50,50],[30,70],[70,70],[50,20],[50,80]].slice(0, n);
info = `<b>Noktaları say</b> ve aklında tut · kart ${st.ci + 1}/${tr.counts.length}`;
body = dots + `<div style="display:flex;${isLs ? "" : "flex-direction:column;"}gap:12px;align-items:center;justify-content:center"><div class="wm-card" style="width:${sz}px;height:${sz}px"><svg viewBox="0 0 100 100" width="100%" height="100%">${shuffleArray(pts).map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="#2E6FD8"/>`).join("")}</svg></div><button type="button" class="wm-btn same" data-mtbtn="csp-ok">Saydım</button></div>`; }
else { info = st.reveal ? `Doğrusu: <b>${tr.counts.join(" – ")}</b>` : `Kartlardaki sayıları <b>sırayla</b> seç · ${st.pos}/${tr.counts.length}`;
body = dots + `<div class="qz-txt-grid" style="grid-template-columns:repeat(4, minmax(0,1fr))">${[1,2,3,4,5,6,7,8].map(n => `<div class="wm-pic qz-txt" data-mt="${n}" style="font-size:24px;font-weight:900">${n}</div>`).join("")}</div>`; }
} else if(st.kind === "tone"){
const seq = st.trials[ti], kw = Math.min(isLs ? (H - 60) / 2 : 120, (W - 30) / 2);
info = st.phase === "play" ? (st.lights ? "<b>İzle ve dinle…</b>" : "<b>Yalnızca dinle…</b>") : st.phase === "input" ? `<b>Aynı sırayla</b> dokun · ${st.pos}/${seq.length}` : "";
body = dots + `<div style="display:grid;grid-template-columns:repeat(2, ${kw}px);gap:10px;justify-content:center">${TONE_KEYS.map((k, i) => `<button type="button" class="tone-k${st.lit === i ? " lit" : ""}" ${st.phase === "input" ? `data-mt="${i}"` : ""} style="width:${kw}px;height:${kw}px;background:${k.c};--kc:${k.c}"></button>`).join("")}</div>`;
} else if(st.kind === "wseen"){
const tr = st.trials[ti], sz = Math.min(isLs ? H - 50 : 200, W * 0.6);
if(st.phase === "show"){ info = "<b>İyice bak!</b>"; body = dots + `<div class="wm-card" style="width:${sz}px;height:${sz}px;padding:6px;margin:0 auto">${tr.study}</div>`; }
else if(st.phase === "gap"){ info = "…"; body = dots + `<div style="width:${sz}px;height:${sz}px;margin:0 auto"></div>`; }
else { info = "Az önce <b>tam olarak hangisini</b> gördün?"; const d = wmGridDims(tr.opts.length, W, isLs ? H - 40 : H - 60, 120);
body = dots + `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">${tr.opts.map((o, i) => `<div class="wm-pic${st.phase === "fb" ? (i === tr.ans ? " ok" : i === st.pick ? " bad" : "") : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;padding:5px">${o}</div>`).join("")}</div>`; }
} else if(st.kind === "route"){
const tr = st.trials[ti], n = tr.n, w = Math.min(isLs ? H - 30 : 280 * tabletScale(), W - 20);
info = st.phase === "show" ? "<b>Yolu izle…</b>" : st.reveal ? "Yol buydu" : `Yolu <b>aynı sırayla</b> tekrarla: yeşilden başla · ${Math.max(0, st.pos - 1)}/${tr.path.length - 1}`;
const cell = (i) => { const k = tr.path.indexOf(i); let bg = "#fff"; if(st.phase === "show" && k >= 0 && k <= st.step) bg = k === st.step ? "#F5A524" : "#FFE2A8";
if(st.phase !== "show"){ if(i === tr.path[0]) bg = "#1FA463"; else if(k > 0 && k < st.pos) bg = "#1FA463"; if(st.reveal && k > 0) bg = "#FFE2A8"; }
return `<div ${st.phase === "input" ? `data-mt="${i}"` : ""} style="background:${bg};border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:900;color:#2B3A4A">${st.reveal && k >= 0 ? k + 1 : ""}</div>`; };
body = dots + `<div style="display:grid;grid-template-columns:repeat(${n},1fr);gap:4px;width:${w}px;height:${w}px;margin:0 auto;background:#C9D3DE;padding:4px;border-radius:12px">${Array.from({length: n * n}, (_, i) => cell(i)).join("")}</div>`;
} else if(st.kind === "sbuild"){
const tr = st.trials[ti], L = tr.w.length;
info = "Kelimeleri <b>anlamlı bir cümle</b> olacak şekilde diz";
const line = `<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;min-height:54px;margin-bottom:12px;padding:6px;border:2px dashed var(--line);border-radius:14px">${st.placed.map(k => `<span class="anl-w" style="font-size:19px;font-weight:900">${tr.w[tr.cards[k]]}</span>`).join("")}</div>`;
body = dots + line + `<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">${tr.cards.map((c, i) => st.placed.includes(i) ? "" : `<div class="wm-pic${st.bad[i] ? " bad" : ""}" data-mt="${i}" style="min-width:90px;height:52px;padding:4px 12px;font-weight:900;font-size:18px">${tr.w[c]}</div>`).join("")}</div>`;
} else if(st.kind === "spotd"){
const tr = st.trials[ti], cols = tr.cols, rows = Math.ceil(tr.base.length / cols), side = isLs || W >= 600, pw = side ? Math.min((W - 30) / 2, (isLs ? H - 40 : 330 * tabletScale()) * cols / rows) * (window._fitK || 1) : Math.min(W - 20, 300 * tabletScale()) * (window._fitK || 1), ph = pw * rows / cols;
const panel = (arr, tap) => `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${rows},minmax(0,1fr));gap:4px;width:${pw}px;height:${ph}px;box-sizing:border-box;background:#FFF8E5;border:2px solid #E0A100;border-radius:12px;padding:6px">${arr.map((o, i) => `<div ${tap ? `data-mt="${i}"` : ""} style="min-height:0;overflow:hidden;display:flex;align-items:center;justify-content:center;cursor:${tap ? "pointer" : "default"};border-radius:10px;${tap && st.found[i] ? "box-shadow:inset 0 0 0 3px #1FA463;background:#E3F6EC;" : tap && st.bad[i] ? "box-shadow:inset 0 0 0 3px #E5484D;" : ""}padding:4px">${o.gone ? "" : shapeSVG(o.sh, o.col)}</div>`).join("")}</div>`;
info = `Sağdaki resimde <b>${tr.diff.length} fark</b> var · ${Object.keys(st.found).length}/${tr.diff.length}`;
body = dots + `<div style="display:flex;${side ? "" : "flex-direction:column;"}gap:10px;align-items:center;justify-content:center">${panel(tr.base, false)}${panel(tr.right, true)}</div>`;
} else if(st.kind === "sdk"){
const tr = st.trials[ti], n = tr.n, w = Math.min(isLs ? H - 30 : 280 * tabletScale(), W - 20) * (window._fitK || 1);
info = st.phase === "fb" ? (st.bad && st.bad.size ? "Kırmızılar kurala uymuyor" : "<b>Tamam!</b>") : "Her satırda ve sütunda <b>her meyve bir kez</b> olsun";
const grid = `<div style="display:grid;grid-template-columns:repeat(${n},1fr);gap:4px;width:${w}px;height:${w}px;background:#C9D3DE;padding:4px;border-radius:12px">${st.cells.map((v, i) => `<div ${tr.given[i] == null ? `data-mt="${i}"` : ""} style="background:${tr.given[i] != null ? "#EEF3F3" : "#fff"};border-radius:8px;padding:5px;cursor:${tr.given[i] == null ? "pointer" : "default"};${st.bad && st.bad.has && st.bad.has(i) ? "box-shadow:inset 0 0 0 3px #E5484D;" : ""}">${v != null ? `<img src="${tr.pics[v]}" alt="" style="width:100%;height:100%;object-fit:contain">` : ""}</div>`).join("")}</div>`;
const pal = `<div style="display:flex;gap:8px;justify-content:center;margin:${isLs ? "0 0 8px" : "10px 0 0"}">${tr.pics.map((src, k) => `<button type="button" data-mtbtn="sdk-${k}" class="sdk-p${st.sel === k ? " on" : ""}"><img src="${src}" alt="" style="width:100%;height:100%;object-fit:contain"></button>`).join("")}</div>`;
const done = st.phase === "input" ? `<div class="wm-btns" style="margin:8px auto 0"><button type="button" class="wm-btn same" data-mtbtn="sdk-done">Bitti</button></div>` : "";
body = isLs ? `<div style="display:flex;gap:16px;align-items:center;justify-content:center">${grid}<div>${pal}${done}</div></div>` : dots + grid + pal + done;
} else if(st.kind === "parr"){
const tr = st.trials[ti], imgs = PA_IMAGES[tr.lvl][tr.si], n = tr.n, img = (k) => `<img src="${imgs[k]}" alt="" style="width:100%;height:100%;object-fit:contain">`;
const sw = Math.min(isLs ? (W * 0.55 - 8 * n) / n : (W - 8 * n) / n, 120), sh = Math.round(sw * 0.8);
const slots = `<div style="display:flex;gap:6px;justify-content:center;margin-bottom:10px">${Array.from({length:n}, (_, k) => { const ci = st.placed[k]; return `<div class="wm-card" style="width:${sw}px;height:${sh}px;padding:2px;position:relative;${ci == null ? "border-style:dashed" : ""}">${ci != null ? img(tr.cards[ci]) : ""}<span class="num">${k + 1}</span></div>`; }).join("")}</div>`;
const cw = Math.min(isLs ? Math.min((W * 0.42 - 16) / Math.min(3, n), (H - 40) / (Math.ceil(n / 3) * 0.8 + 0.4)) : (W - 30 - 8 * (Math.max(1, Math.min(3, tr.cards.length - st.placed.filter(x => x != null).length) === 4 ? 2 : (tr.cards.length - st.placed.filter(x => x != null).length) <= 3 ? Math.max(1, tr.cards.length - st.placed.filter(x => x != null).length) : (tr.cards.length - st.placed.filter(x => x != null).length) % 2 === 0 ? 2 : 3) - 1)) / Math.max(1, (tr.cards.length - st.placed.filter(x => x != null).length) <= 3 ? Math.max(1, tr.cards.length - st.placed.filter(x => x != null).length) : (tr.cards.length - st.placed.filter(x => x != null).length) % 2 === 0 ? 2 : 3), 150), chh = Math.round(cw * 0.8);   /* KURAL: kalan kart sayısına göre sütun — son satır eksik kalmaz (3 kart tek satır, 4 kart 2×2; 5 asal olduğundan 3+2) */
const cards = `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${tr.cards.map((c, i) => st.placed.includes(i) ? "" : `<div class="wm-pic${st.bad[i] ? " bad" : ""}" data-mt="${i}" style="width:${cw}px;height:${chh}px;padding:3px">${img(c)}</div>`).join("")}</div>`;
if(st.phase === "tell"){ info = "<b>Şimdi hikâyeyi anlat</b>";
body = dots + slots + `<div class="aud-key" style="text-align:center">Beklenen: ${PA_TEXT[tr.lvl][tr.si].slice(1).join(" → ")}. Olayları sırasıyla ve bağlantılı anlatıyor mu?</div><div class="aud-key" style="text-align:center;margin-top:6px">Yetişkin: anlatamadıysa <b>Hata sayısı +</b></div><div class="wm-btns" style="margin:6px auto 0"><button type="button" class="wm-btn same" data-judge="9">Sonraki ▶</button></div>`; }
else { info = "Resimleri <b>olayların sırasına</b> koy: önce olana dokun"; body = dots + (isLs ? `<div style="display:flex;gap:14px;align-items:center;justify-content:center"><div>${slots}</div><div>${cards}</div></div>` : slots + cards); }
} else if(st.kind === "blk"){
const tr = st.trials[ti], n = tr.n, shown = blkRotModel(tr.model, n, tr.rot), mw = Math.min(isLs ? H - 120 : 130, W * 0.36), cw = Math.min(isLs ? H - 40 : 210, W * 0.55);
const grid = (arr, w, tap) => `<div style="display:grid;grid-template-columns:repeat(${n}, 1fr);width:${w}px;height:${w}px;gap:2px;background:#9AA9B8;border:2px solid #9AA9B8;border-radius:8px;overflow:hidden">${arr.map((f, i) => `<div ${tap ? `data-mt="${i}"` : ""} style="cursor:${tap ? "pointer" : "default"};${tap && st.phase === "fb" && f !== tr.model[i] ? "outline:3px solid #E5484D;outline-offset:-3px" : ""}">${blkFace(f, tr.A, tr.B)}</div>`).join("")}</div>`;
info = st.phase === "fb" ? (st.res ? `<b>${st.res}</b> blok farklı (kırmızı çerçeveli)` : "<b>Aynısı!</b>") : tr.rot ? "Model <b>döndürülmüş</b>: ok yukarı bakacak şekilde, düz hâlini yap" : "Modelin <b>aynısını</b> yap: bloğa dokundukça yüzü değişir";
const arrow = tr.rot ? `<div style="display:inline-block;transform:rotate(${tr.rot * 90}deg)">${stopArrowSVG("u", "#B07D00", 30)}</div>` : "";   /* SVG ok: her cihazda aynı renk */
const done = st.phase === "input" ? `<div class="wm-btns" style="margin:8px auto 0"><button type="button" class="wm-btn same" data-mtbtn="blk-done">Bitti</button></div>` : "";
body = (isLs ? "" : dots) + `<div style="display:flex;${isLs ? "" : "flex-direction:column;"}gap:12px;align-items:center;justify-content:center"><div><div style="display:flex;gap:6px;align-items:center"><div style="text-align:center"><div style="font-size:12px;font-weight:800;color:var(--ink-soft)">Model</div>${grid(shown, mw, false)}</div>${arrow}</div>${isLs ? done : ""}</div><div>${grid(st.cells.length ? st.cells : Array(n * n).fill(0), cw, true)}</div></div>` + (isLs ? "" : done);
} else if(st.kind === "clut"){
const tot = st.items.filter(x => x.tgt).length, ah = isLs ? H - 16 : Math.min(H - 60, W * 1.05);
info = `Bütün <img src="${st.tg.src}" alt="" style="width:30px;height:30px;vertical-align:middle;object-fit:contain"> <b>${st.tg.n}</b> resimlerini bul · ${Object.keys(st.found).length}/${tot}`;
const cdone = st.phase === "input" ? `<div class="wm-btns" style="margin:8px auto 0"><button type="button" class="wm-btn same" data-mtbtn="clut-done">Bitti</button></div>` : "";
body = (isLs ? `<div style="display:flex;gap:12px;align-items:center">` : "") + `<div style="position:relative;width:${isLs ? "80%" : "100%"};height:${ah}px;background:var(--panel);border:2px solid var(--line);border-radius:18px;overflow:hidden">${st.items.map((it, i) => `<div data-mt="${i}" style="position:absolute;left:${it.l}%;top:${it.tp}%;width:${it.sz}%;aspect-ratio:1;transform:rotate(${it.r}deg);z-index:${st.found[i] ? 20 : it.z};${st.found[i] ? "outline:4px solid #1FA463;border-radius:50%;background:#E3F6EC" : st.bad[i] ? "outline:3px solid #E5484D;border-radius:50%" : (st.reveal && it.tgt ? "outline:4px dashed #1FA463;border-radius:50%;z-index:30" : "")}"><img src="${it.x.src}" alt="" style="width:100%;height:100%;object-fit:contain;pointer-events:none"></div>`).join("")}</div>` + (isLs ? cdone + "</div>" : cdone);
} else if(st.kind === "sym"){
const tr = st.trials[ti], n = tr.n, w = (isLs ? Math.min(H - 30, W - 20) : W - 20) * Math.max(0.85, window._fitK || 1), c = w / n;   /* Simetri hücreleri kısa ekranda da ~40 px (gerekirse sayfa kayar) */
info = st.phase === "fb" ? "Kırmızı: eksik ya da fazla" : `Çizginin öbür yanını <b>ayna gibi</b> tamamla`;
let cells = ""; for(let r = 0; r < n; r++) for(let k = 0; k < n; k++){ const i = r * n + k, given = tr.horiz ? r < n / 2 : k < n / 2, src = tr.horiz ? (n - 1 - r) * n + k : r * n + (n - 1 - k);
const on = given ? tr.cells[i] : st.mine[i]; let bg = on ? (given ? "#2E6FD8" : "#F5A524") : "#fff"; let ol = "";
if(st.phase === "fb" && !given && !!st.mine[i] !== !!tr.cells[src]){ ol = "box-shadow:inset 0 0 0 3px #E5484D;"; if(!st.mine[i]) bg = "#FCE3E3"; }
cells += `<div ${given ? "" : `data-mt="${i}"`} style="background:${bg};${ol}cursor:${given ? "default" : "pointer"}"></div>`; }
const sdone = st.phase === "input" ? `<div class="wm-btns" style="margin:8px auto 0"><button type="button" class="wm-btn same" data-mtbtn="sym-done">Bitti</button></div>` : "";
const sgrid = `<div style="position:relative;width:${w}px;height:${w}px;margin:0 auto"><div style="display:grid;grid-template-columns:repeat(${n},1fr);gap:2px;background:#C9D3DE;width:100%;height:100%;border:2px solid #C9D3DE">${cells}</div><div style="position:absolute;${tr.horiz ? `left:-6px;right:-6px;top:calc(50% - 2px);height:4px` : `top:-6px;bottom:-6px;left:calc(50% - 2px);width:4px`};background:#E5484D;border-radius:2px;pointer-events:none"></div></div>`;
body = isLs ? `<div style="display:flex;gap:16px;align-items:center;justify-content:center">${sgrid}<div>${dots}${sdone}</div></div>` : dots + sgrid + sdone;
} else if(st.kind === "maze"){
const tr = st.trials[ti], n = tr.n, w = Math.min(isLs ? H - 30 : 320 * tabletScale(), W - 20), c = w / n;
info = st.phase === "fb" ? "<b>Çıkışı buldun!</b>" : "Topu <b>yıldıza</b> götür: gideceğin kareye dokun";
let walls = ""; tr.walls.forEach((wl, i) => { const x = (i % n) * c, y = Math.floor(i / n) * c; if(wl.n) walls += `<line x1="${x}" y1="${y}" x2="${x + c}" y2="${y}"/>`; if(wl.w) walls += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + c}"/>`; if(i % n === n - 1 && wl.e) walls += `<line x1="${x + c}" y1="${y}" x2="${x + c}" y2="${y + c}"/>`; if(Math.floor(i / n) === n - 1 && wl.s) walls += `<line x1="${x}" y1="${y + c}" x2="${x + c}" y2="${y + c}"/>`; });
const ctr = (i) => [((i % n) + 0.5) * c, (Math.floor(i / n) + 0.5) * c], path = st.path.map(ctr).map(p => p.map(v => v.toFixed(1)).join(",")).join(" ");
const taps = Array.from({length: n * n}, (_, i) => `<rect data-mt="${i}" style="cursor:pointer" x="${(i % n) * c}" y="${Math.floor(i / n) * c}" width="${c}" height="${c}" fill="${st.bump === i ? "#FCE3E3" : "transparent"}"/>`).join("");
const [px, py] = ctr(st.pos), [gx, gy] = ctr(n * n - 1);
body = dots + `<svg viewBox="-3 -3 ${w + 6} ${w + 6}" width="${w}" height="${w}" style="display:block;margin:0 auto;background:#fff;border-radius:12px;touch-action:none">${taps}<polyline points="${path}" fill="none" stroke="#7FB3E8" stroke-width="${Math.max(4, c * 0.18)}" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/><g stroke="#2B3A4A" stroke-width="${Math.max(2, c * 0.08)}" stroke-linecap="round" pointer-events="none">${walls}</g><text x="${gx}" y="${gy + c * 0.18}" text-anchor="middle" font-size="${c * 0.6}" pointer-events="none">⭐</text><circle cx="${px}" cy="${py}" r="${c * 0.28}" fill="#F5A524" stroke="#C77800" stroke-width="2" pointer-events="none"/></svg>`;
} else if(st.kind === "ssnd"){
const tr = st.trials[ti], tot = tr.opts.filter(x => trFirst(x.n) === tr.s).length;
info = `<b>${tr.s}</b> sesiyle başlayanlara dokun · ${Object.keys(st.found).length}/${tot}`;
const head = `<div style="display:flex;gap:10px;justify-content:center;align-items:center;margin-bottom:6px"><span class="flu-card" style="margin:0;padding:2px 18px"><span class="flu-big" style="font-size:30px">${tr.s}</span></span><button type="button" class="wm-btn diff" data-mtbtn="ss-names" style="min-width:0;padding:8px 12px">🔊 Adları dinle</button></div>`;
const g2 = (avW, avH) => { const d = wmGridDims(tr.opts.length, avW, avH, 70); return `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + tr.opts.map((x, i) => pic(x, i, d.cell, st.found[i] ? "ok" : st.bad[i] ? "bad" : (st.reveal && trFirst(x.n) === tr.s ? "ok" : ""))).join("") + `</div>`; };
const done = `<div class="wm-btns" style="margin:8px auto 0"><button type="button" class="wm-btn same" data-mtbtn="ss-done">Bitti</button></div>`;
body = isLs ? dots + `<div style="display:flex;gap:16px;align-items:center;justify-content:center"><div>${head}${done}</div>${g2(W * 0.6, H - 30)}</div>` : dots + head + g2(W, H - 120) + done;
} else if(st.kind === "seqw"){
const tr = st.trials[ti], L = tr.seq.length;
info = tr.pics ? "<b>En küçükten en büyüğe</b> diz (gerçek büyüklüklerine göre)" : "<b>Doğru sıraya</b> diz: önce geleni seç";
const sw = Math.min((W - 8 * L) / L, 120);
const lab = (k) => tr.pics ? `<img src="${tr.pics[k]}" alt="" style="width:100%;height:100%;object-fit:contain">` : tr.seq[k], ph = tr.pics ? 76 : 54;
const slots = `<div style="display:flex;gap:6px;justify-content:center;margin-bottom:12px">${tr.seq.map((w, k) => { const ci = st.placed[k]; return `<div class="wm-card" style="width:${tr.pics ? Math.min(sw, 80) : sw}px;height:${ph}px;padding:3px;font-weight:900;font-size:${sw < 80 ? 13 : 16}px;${ci == null ? "border-style:dashed" : ""}">${ci != null ? lab(tr.cards[ci]) : k + 1}</div>`; }).join("")}</div>`;
const cards = `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${tr.cards.map((c, i) => st.placed.includes(i) ? "" : `<div class="wm-pic${st.bad[i] ? " bad" : ""}" data-mt="${i}" style="${tr.pics ? "width:90px;height:90px;padding:4px" : `min-width:${Math.min(130, W / 2 - 20)}px;height:56px;padding:4px 10px`};font-weight:900;font-size:17px">${lab(c)}</div>`).join("")}</div>`;
body = dots + slots + cards;
} else if(st.kind === "spic"){
const cur = st.queue[Math.min(st.qi, st.queue.length - 1)], n = st.bins.length;
info = `<b>Hangi gruba</b> girer? · ${Math.min(st.qi + 1, st.queue.length)}/${st.queue.length}`;
const sz = Math.min(isLs ? H * 0.5 : 140, W * 0.4);
const bw = Math.min((W - 10 * n) / n, isLs ? 150 : 130);
const bins = `<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">${st.bins.map((b, i) => `<div class="wm-pic sp-bin${st.bad === i ? " bad" : ""}" data-mt="${i}" style="width:${bw}px;height:${Math.round(bw * 1.15)}px;flex-direction:column;gap:2px;padding:6px"><img src="${b.ex.src}" alt="" style="width:62%;height:56%;object-fit:contain"><span class="sp-lbl">${b.n}</span></div>`).join("")}</div>`;
const pic = st.phase === "fb" ? `<div class="wm-card" style="width:${sz}px;height:${sz}px;font-size:46px">✓</div>` : `<div class="wm-card" style="width:${sz}px;height:${sz}px;padding:6px"><img src="${cur.it.src}" alt="" style="width:100%;height:100%;object-fit:contain"></div>`;
body = isLs ? `<div style="display:flex;gap:16px;align-items:center;justify-content:center">${pic}${bins}</div>` : pic + `<div style="height:10px"></div>` + bins;
} else if(st.kind === "fsort"){
const nC = st.fams.length, used = (k) => Object.values(st.asg).filter(v => v === k).length;
if(st.phase === "name"){ const gi = st.ng[st.ni], ids = st.groupsOf[gi], cnt = {}; ids.forEach(i => { cnt[st.items[i].f] = (cnt[st.items[i].f] || 0) + 1; }); const maj = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
info = `Grup ${st.ni + 1}/${st.ng.length} · <b>Bu gruba ne ad verirsin?</b>`;
body = `<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:8px">${ids.map(i => { const it = st.items[i]; return `<div class="wm-card" style="width:64px;height:64px;padding:4px;border-color:${FS_COLORS[gi]}">${it.src ? `<img src="${it.src}" alt="" style="width:100%;height:100%;object-fit:contain">` : `<b style="font-size:14px">${it.w}</b>`}</div>`; }).join("")}</div>` +
`<div class="aud-key" style="text-align:center">Beklenen ad: <b>${st.names[maj]}</b> (benzer bir üst ad da uygundur)</div><div class="aud-key" style="text-align:center;margin-top:6px">Yetişkin: verdiği ad uygun değilse <b>Hata sayısı +</b></div><div class="wm-btns" style="margin:6px auto 0"><button type="button" class="wm-btn same" data-judge="9">Sonraki ▶</button></div>`;
} else {
info = st.phase === "fb" ? (st.res.size ? "<b>✗</b> işaretliler gruplarına uymuyor" : "Harika, hepsi doğru gruplandı!") : "<b>Bir renk seç</b>, sonra birlikte olanlara dokun";
const pal = `<div style="display:flex;gap:8px;justify-content:center;margin-bottom:8px">${FS_COLORS.slice(0, nC).map((c, k) => `<button type="button" data-mtbtn="fs-c${k}" class="fs-col${st.sel === k ? " on" : ""}" style="background:${c}">${used(k)}</button>`).join("")}</div>`;
const d = wmGridDims(st.items.length, isLs ? W * 0.62 : W, isLs ? H - 60 : H - 110, st.pics ? 72 : 64);
const grid = `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + st.items.map((it, i) => { const c = st.asg[i]; const mk = "", badge = st.phase === "fb" ? (st.res.has(i) ? `<span class="fs-x">✗</span>` : `<span class="fs-v">✓</span>`) : "";
return `<div class="wm-pic${mk}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;padding:5px;${c != null ? `border-color:${FS_COLORS[c]};background:${FS_COLORS[c]}22;box-shadow:0 0 0 3px ${FS_COLORS[c]} inset` : ""}">${it.src ? `<img src="${it.src}" alt="" style="width:100%;height:100%;object-fit:contain">` : `<b style="font-size:${d.cell > 80 ? 17 : 14}px">${it.w}</b>`}${badge}</div>`; }).join("") + `</div>`;
const done = st.phase === "input" ? `<div class="wm-btns" style="margin:8px auto 0"><button type="button" class="wm-btn same" data-mtbtn="fs-done">Bitti</button></div>` : "";
body = isLs ? `<div style="display:flex;gap:14px;align-items:center;justify-content:center"><div>${pal}${done}</div>${grid}</div>` : pal + grid + done;
}
} else if(st.kind === "tapr"){
const tr = st.trials[Math.min(ti, st.trials.length - 1)], c = Math.min(isLs ? 110 : 120, W * 0.3), pad = Math.min(isLs ? 150 : 180, W * 0.6);
info = st.phase === "fb" ? (st.fb.ok ? `<b style="color:var(--good)">Doğru</b> · ${st.fb.want} kez vurdun` : `<b style="color:var(--bad)">${st.taps} kez vurdun</b> · doğrusu ${st.fb.want} kez`) : `Deneme <b>${ti + 1}/${st.trials.length}</b> · vuruşun: <b id="taprCount">${st.taps}</b>`;
const fists = `<div class="wm-card${st.phase === "fb" ? (st.fb.ok ? " ok" : " bad") : ""}" style="width:${c * (tr.k === 1 ? 1 : 1.7)}px;height:${c}px;gap:4px">${Array.from({length: tr.k}, () => `<img src="${efImg("el_yumruk")}" alt="" style="width:${tr.k === 1 ? 80 : 46}%;height:84%;object-fit:contain">`).join("")}</div>`;
const padBtn = `<button type="button" class="wm-btn same" data-mtbtn="tapr-pad" style="width:${pad}px;height:${Math.round(pad * 0.55)}px;font-size:22px;border-radius:24px;${st.phase === "show" ? "" : "opacity:.55"}">👊 VUR</button>`;
body = dots + (isLs ? `<div style="display:flex;gap:18px;align-items:center;justify-content:center">${fists}${padBtn}</div>` : `<div style="display:flex;flex-direction:column;gap:12px;align-items:center">${fists}${padBtn}</div>`);
} else if(st.kind === "statue"){
const big = isLs ? 120 : Math.min(150, W * 0.4);
info = `<b>Heykel gibi dur!</b> Kalan: <b id="statueLeft">${st.left}</b> sn`;
body = `<div style="display:flex;${isLs ? "" : "flex-direction:column;"}gap:14px;align-items:center;justify-content:center"><div style="position:relative;width:${big}px;height:${big}px;display:flex;align-items:center;justify-content:center;background:#F2F5F8;border-radius:18px;font-size:${Math.round(big * 0.55)}px">🗿<div id="statueDist" style="position:absolute;right:-8px;top:-8px;font-size:${Math.round(big * 0.3)}px">🔔</div></div><div class="aud-key" style="text-align:center;max-width:260px">Çocuk ekrana bakmaz. Hareket, konuşma ya da göz açma gördüğünüzde yukarıdaki <b>Hata sayısı +</b> düğmesine basın.</div></div>`;
} else if(st.kind === "hold"){
const tr = st.trials[Math.min(ti, st.trials.length - 1)], big = isLs ? Math.min(150, W * 0.25) : Math.min(190, W * 0.5);
if(st.phase === "fb"){ info = st.ok ? `<b style="color:var(--good)">Hediye açıldı!</b> Sonuna kadar tuttun 🎉` : `<b style="color:var(--bad)">Erken bıraktın</b> · ${st.early} sn sonra`; body = dots + `<div style="display:flex;justify-content:center"><div class="wm-card ${st.ok ? "ok" : "bad"}" style="width:${big}px;height:${big}px"><img src="${efImg(st.ok ? "hediye_acik" : "hediye_kapali")}" alt="" style="width:92%;height:92%;object-fit:contain"></div></div>`; }
else { info = `<span id="holdInfo">Hediye <b>${ti + 1}/${st.trials.length}</b> · düğmeyi basılı tut, <b>${tr.secs} sn</b> sonra açılır</span>`;
body = dots + `<div style="display:flex;${isLs ? "" : "flex-direction:column;"}gap:12px;align-items:center;justify-content:center"><div style="position:relative;width:${isLs ? Math.min(W * 0.55, 420) : W - 8}px;height:${big}px"><div id="holdDist" style="position:absolute;inset:0;pointer-events:none"></div><button type="button" id="holdBtn" class="wm-card ef-hold" data-hold="1" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${big}px;height:${big}px;cursor:pointer;font-family:inherit"><img src="${efImg("hediye_kapali")}" alt="" draggable="false" style="width:88%;height:88%;object-fit:contain;pointer-events:none"></button></div><div style="width:${isLs ? 180 : Math.min(W - 40, 300)}px"><div class="ef-bar"><i id="holdBar"></i></div><div class="aud-key" style="text-align:center;margin-top:4px">Hediyeye bas ve açılana kadar bırakma</div></div></div>`; }
} else if(st.kind === "fist"){
const tr = st.trials[Math.min(ti, st.trials.length - 1)], c = Math.min(isLs ? 130 : 120, (W - 30) / 3 - 10);
info = st.phase === "fb" ? (st.fb && st.fb.ok ? `<b style="color:var(--good)">Doğru!</b> İkisi de aynı ${st.fb.dim}` : st.fb && st.fb.rep ? `<b style="color:var(--bad)">Bunu zaten buldun</b> · başka bir yönden benzeyen ikiliyi seç` : `<b style="color:var(--bad)">Bu ikisi benzemiyor</b>`) : `Resim <b>${ti + 1}/${st.trials.length}</b> · ${tr.found.length ? `<b>${tr.found.length}/${tr.need}</b> bulundu · <b>başka bir yönden</b> benzeyen ikiliyi seç` : `benzeyen <b>iki</b> karta dokun`}`;
const cell = (x, i) => { const mk = st.fb && st.fb.sel.includes(i) ? (st.fb.ok ? " ok" : " bad") : tr.sel.includes(i) ? " sel" : ""; const px = Math.round(c * 0.74 * x.z[0]); return `<div class="wm-pic${mk}" data-mt="${i}" style="width:${c}px;height:${c}px;display:flex;align-items:center;justify-content:center${mk === " sel" ? ";box-shadow:0 0 0 4px #FFC21A" : ""}"><svg viewBox="0 0 100 100" style="width:${px}px;height:${px}px">${sortShapeSVG(x.s[0], x.c[0])}</svg></div>`; };
body = dots + `<div style="display:flex;gap:10px;justify-content:center;margin-top:6px">${tr.cards.map(cell).join("")}</div><div class="aud-key" style="text-align:center;margin-top:8px">Bulunan: ${tr.found.length ? tr.found.map(k => `<b>${tr.pairs.find(p => fistPairKey(p[0], p[1]) === k)[2]}</b>`).join(", ") : "—"}</div>`;
} else if(st.kind === "wcst"){
const tr = st.trials[Math.min(ti, st.trials.length - 1)], kp = Math.min(isLs ? 78 : 86, (W - 40) / 4 - 10), sp = Math.min(isLs ? 120 : 120, W * 0.3);
info = st.phase === "fb" ? (st.fb === "ok" ? `<b style="color:var(--good)">Doğru</b>` : `<b style="color:var(--bad)">Yanlış</b> · kuralı değiştir`) : `Kart <b>${ti + 1}/${st.trials.length}</b> · alttaki kartı hangi anahtara koyacaksın?`;
const keys = `<div style="display:flex;gap:8px;justify-content:center">${WC_KEYS.map((k, i) => `<div class="wm-pic${st.phase === "fb" && st.pick === i ? " " + st.fb : ""}" data-mt="${i}" style="width:${kp}px;height:${kp}px;display:flex;align-items:center;justify-content:center">${wcCardSVG(k, kp * 0.9)}</div>`).join("")}</div>`;
const card = `<div class="wm-card" style="width:${sp}px;height:${sp}px;margin:${isLs ? 0 : 10}px auto 0">${wcCardSVG(tr, sp * 0.9)}</div>`;
body = dots + (isLs ? `<div style="display:flex;gap:16px;align-items:center;justify-content:center">${keys}${card}</div>` : keys + card);
} else if(st.kind === "rev"){
const tr = st.trials[Math.min(ti, st.trials.length - 1)], c = Math.min(isLs ? 150 : 150, W * 0.38), pics = st.cfg.pics, order = tr.swap ? [1, 0] : [0, 1];
info = st.phase === "fb" ? (st.fb === "ok" ? `<b style="color:var(--good)">⭐ Yıldız!</b>` : `<b style="color:var(--bad)">Yıldız yok</b>`) : `Deneme <b>${ti + 1}/${st.trials.length}</b> · yıldız veren resme dokun`;
body = dots + `<div style="display:flex;gap:16px;justify-content:center;margin-top:6px">${order.map(i => `<div class="wm-pic${st.phase === "fb" && st.pick === i ? " " + st.fb : ""}" data-mt="${i}" style="width:${c}px;height:${c}px;position:relative">${imgTag(pics[i].src)}${st.phase === "fb" && st.pick === i && st.fb === "ok" ? `<span style="position:absolute;right:4px;top:2px;font-size:${Math.round(c * 0.3)}px">⭐</span>` : ""}</div>`).join("")}</div><div class="aud-key" style="text-align:center;margin-top:8px">Toplanan yıldız: <b>${st.okN}</b></div>`;
} else if(st.kind === "zoo"){
const tr = st.trials[Math.min(ti, st.trials.length - 1)], area = Math.min(W, isLs ? 236 : 380 * tabletScale()), R = area * 0.085;
info = st.phase === "fb" ? (st.fb === "ok" ? `<b style="color:var(--good)">Rota tamam!</b> Bütün duraklara uğradın` : `<b style="color:var(--bad)">Çıkışa vardın ama durak eksik</b>`) : st.fb === "used" ? `<b style="color:var(--bad)">Bu yoldan zaten geçtin</b>` : st.fb === "nopath" ? `<b style="color:var(--bad)">Buraya yol yok</b>` : st.fb === "order" ? `<b style="color:var(--bad)">Sıra farklı</b>` : `Harita <b>${ti + 1}/${st.trials.length}</b> · ⭐ duraklar: <b>${tr.visited.length}/${tr.req.length}</b>${tr.ordered ? " · sırayla" : ""}`;
const P = ZOO_POS, edges = tr.E.map(e => { const u = tr.used.includes(e); return `<line x1="${P[e[0]][0]}" y1="${P[e[0]][1]}" x2="${P[e[1]][0]}" y2="${P[e[1]][1]}" stroke="${u ? "#2E6FD8" : "#C9D3DE"}" stroke-width="${u ? 3.2 : 2}" stroke-linecap="round"${u ? "" : ' stroke-dasharray="3 2"'}/>`; }).join("");
const nodes = P.map(([x, y], i) => { const req = tr.req.includes(i), vis = tr.visited.includes(i), cur = tr.cur === i; const a = tr.animals[i]; return `<g data-mt="${i}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="${(R / area * 100).toFixed(1)}" fill="${i === 6 ? "#E3F6EC" : i === 8 ? "#FDECEC" : "#FFFFFF"}" stroke="${cur ? "#FFC21A" : vis ? "#1FA463" : req ? "#F59E0B" : "#9AA8B5"}" stroke-width="${cur ? 2.2 : 1.4}"/>${a ? `<image href="${a.src}" x="${x - 6}" y="${y - 6}" width="12" height="12" preserveAspectRatio="xMidYMid meet"/>` : ""}${req ? `<text x="${x + 6}" y="${y - 5}" font-size="6" font-weight="900" fill="${vis ? "#1FA463" : "#F59E0B"}">${tr.ordered ? (tr.req.indexOf(i) + 1) : "⭐"}</text>` : ""}${i === 6 ? `<text x="${x}" y="${y + 13}" text-anchor="middle" font-size="4.5" font-weight="900" fill="${ACC.yesil}">GİRİŞ</text>` : i === 8 ? `<text x="${x}" y="${y + 13}" text-anchor="middle" font-size="4.5" font-weight="900" fill="${ACC.kirmizi}">ÇIKIŞ</text>` : ""}</g>`; }).join("");
body = dots + `<svg viewBox="0 0 100 100" width="${area}" height="${area}" style="display:block;margin:0 auto;background:#F6FBF6;border-radius:18px;border:2px solid #C9D3DE">${edges}${nodes}</svg>`;
} else if(st.kind === "keys"){
const tr = st.trials[Math.min(ti, st.trials.length - 1)], area = Math.min(W - 10, isLs ? 232 : 340 * tabletScale());
const G = 8, cells = st.phase === "fb" ? Array.from({length:64}, (_, k) => { const cx = k % G, cy = Math.floor(k / G), on = tr.cov && tr.cov.has(cx + "," + cy); return `<rect x="${cx * 12.5}" y="${cy * 12.5}" width="12.5" height="12.5" fill="${on ? "rgba(31,164,99,.35)" : "rgba(229,72,77,.18)"}"/>`; }).join("") : "";
const keyMark = st.phase === "fb" ? `<g transform="translate(${tr.key[0] * 12.5 + 1.5} ${tr.key[1] * 12.5 + 1.5}) scale(0.4)" fill="none" stroke="#1C2B39" stroke-width="2.2" stroke-linecap="round"><circle cx="8" cy="8" r="4.5"/><path d="M11.5 11.5 21 21M18 18l2.5-2.5M15.5 15.5 18 13"/></g>` : "";
info = st.phase === "fb" ? `Tarama: <b style="color:${tr.pct >= tr.need ? "var(--good)" : "var(--bad)"}">%${tr.pct}</b> (hedef %${tr.need}) · anahtar ${tr.found ? "<b style=\"color:var(--good)\">bulundu</b>" : "<b style=\"color:var(--bad)\">kaçtı</b>"}` : `Tarla <b>${ti + 1}/${st.trials.length}</b> · parmağınla arama yolunu çiz`;
const ksSvg = `<svg data-ksdraw="1" viewBox="0 0 100 100" width="${area}" height="${area}" style="display:block;margin:0 auto;background:#F3F7EC;border-radius:14px;border:2px solid #9AA8B5;touch-action:none">${cells}<g stroke="#D9E2CC" stroke-width=".6">${Array.from({length:7}, (_, k) => `<line x1="${(k + 1) * 12.5}" y1="0" x2="${(k + 1) * 12.5}" y2="100"/><line x1="0" y1="${(k + 1) * 12.5}" x2="100" y2="${(k + 1) * 12.5}"/>`).join("")}</g><polyline id="ksPath" points="${tr.pts.map(q => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ")}" fill="none" stroke="#2E6FD8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>${keyMark}</svg>`;
const ksBtns = st.phase === "input" ? `<div class="wm-btns" style="margin:${isLs ? 0 : 8}px auto 0"><button type="button" class="wm-btn diff" data-mtbtn="ks-clear">Sil</button><button type="button" class="wm-btn same" data-mtbtn="ks-done">Bitti</button></div>` : "";
body = dots + (isLs ? `<div style="display:flex;gap:16px;align-items:center;justify-content:center">${ksSvg}<div>${ksBtns}</div></div>` : ksSvg + ksBtns);
} else if(st.kind === "jars"){
const tr = st.trials[Math.min(ti, st.trials.length - 1)], px = Math.min(isLs ? 80 : 96, (W - 40) / tr.caps.length - 14);
info = st.phase === "fb" ? (tr.solved ? `<b style="color:var(--good)">Çözdün!</b> ${tr.moves} hamle (en az ${tr.best})` : `<b style="color:var(--bad)">Atlandı</b>`) : `Bulmaca <b>${ti + 1}/${st.trials.length}</b> · hedef: bir kapta tam <b>${tr.goal} L</b> · hamle: <b>${tr.moves}</b>`;
const jars = `<div style="display:flex;gap:14px;justify-content:center;align-items:flex-end">${tr.caps.map((c, i) => `<div data-mt="${i}" style="cursor:pointer">${jarSVG(c, tr.lv[i], px, tr.sel === i, tr.lv[i] === tr.goal)}</div>`).join("")}</div>`;
const btns = st.phase === "input" ? `<div class="wm-btns${isLs ? " wd-compact" : ""}" style="margin:8px auto 0;flex-wrap:wrap"><button type="button" class="wm-btn same" data-mtbtn="jar-fill">🚰 Doldur</button><button type="button" class="wm-btn diff" data-mtbtn="jar-empty">🪣 Boşalt</button><button type="button" class="wm-btn diff" style="background:#9AA8B5;box-shadow:0 5px 0 #6B7784" data-mtbtn="jar-skip">Atla</button></div><div class="aud-key" style="text-align:center;margin-top:4px">Kaba dokun, sonra Doldur/Boşalt; ya da ikinci kaba dokunarak aktar</div>` : "";
body = dots + (isLs ? `<div style="display:flex;gap:16px;align-items:center;justify-content:center">${jars}<div>${btns}</div></div>` : jars + btns);
} else if(st.kind === "dfl"){
const area = Math.min(W - 10, isLs ? 220 : 300 * tabletScale()), D = st.cfg.dots;
info = `<b>Farklı desenler çiz</b> · kalan <b id="dflLeft">${st.left}</b> sn · farklı: <b>${st.uniq}</b>${st.rep ? ` · tekrar: <b>${st.rep}</b>` : ""}`;
const lines = st.cur.map(([a, b]) => `<line x1="${D[a][0]}" y1="${D[a][1]}" x2="${D[b][0]}" y2="${D[b][1]}" stroke="#2E6FD8" stroke-width="3" stroke-linecap="round"/>`).join("");
const dotsSvg = D.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="11" fill="transparent" data-mt="${i}" style="cursor:pointer"/><circle cx="${x}" cy="${y}" r="5" fill="${st.sel === i ? "#FFC21A" : "#9AA8B5"}" data-mt="${i}" style="cursor:pointer"/>`).join("");
const svg = `<svg viewBox="0 0 100 100" width="${area}" height="${area}" style="display:block;margin:0 auto;background:#F2F5F8;border-radius:16px">${lines}${dotsSvg}</svg>`;
const btns = st.phase === "input" ? `<div class="wm-btns" style="margin:8px auto 0"><button type="button" class="wm-btn diff" data-mtbtn="dfl-undo">Sil</button><button type="button" class="wm-btn same" data-mtbtn="dfl-new">✓ Desen bitti</button></div>` : "";
body = isLs ? `<div style="display:flex;gap:16px;align-items:center;justify-content:center">${svg}<div>${btns}<div class="aud-key" style="text-align:center;margin-top:6px;max-width:200px">${st.cfg.minLines > 1 ? `En az ${st.cfg.minLines} çizgi. ` : ""}Her desen öncekilerden farklı olmalı.</div></div></div>` : svg + btns + `<div class="aud-key" style="text-align:center;margin-top:6px">${st.cfg.minLines > 1 ? `En az ${st.cfg.minLines} çizgi. ` : ""}Her desen öncekilerden farklı olmalı.</div>`;
} else if(st.kind === "twq"){
const tr = st.trials[Math.min(ti, st.trials.length - 1)], twqCols = (() => { const n = tr.items.length, pref = isLs ? 2 : (n > 12 ? 4 : 3); const rows = [pref, 2, 3, 4, 5].find(r => n % r === 0 && n / r <= (isLs ? 10 : 5)) || pref; return Math.ceil(n / rows); })(),   /* KURAL: ızgarada son satır eksik kalmaz — sütun sayısı resim sayısını tam böler */ c = Math.min(isLs ? 50 : Math.min(wmGridDims(tr.items.length, W, H - 40, 56).cell, 64), Math.floor((W - 8 - (twqCols - 1) * 10) / twqCols));   /* sütunlar kartın genişliğine sığar */
info = st.phase === "fb" ? `<b style="color:var(--good)">Buldu!</b> ${tr.q} soruda` : `Tur <b>${ti + 1}/${st.trials.length}</b> · hedef (çocuğa göstermeyin): <b>${tr.items[tr.tgt].n}</b> · soru: <b>${tr.q}</b>`;
const grid = `<div class="wm-grid" style="grid-template-columns:repeat(${twqCols}, ${c}px);">${tr.items.map((x, i) => `<div class="wm-pic${st.phase === "fb" && i === tr.tgt ? " ok" : ""}" data-mt="${i}" style="width:${c}px;height:${c}px;${tr.gone[i] ? "opacity:.25;filter:grayscale(1)" : ""}">${imgTag(x.src)}</div>`).join("")}</div>`;
const btns = st.phase === "input" ? `<div class="wm-btns${isLs ? " wd-compact" : ""}" style="margin:6px auto 0;flex-wrap:wrap"><button type="button" class="wm-btn diff" data-mtbtn="twq-q">❓ Soru +1</button><button type="button" class="wm-btn same" data-mtbtn="twq-found">✓ Buldu</button></div><div class="aud-key" style="text-align:center;margin-top:4px">Elenen resimlere dokunup soldurun</div>` : "";
body = dots + (isLs ? `<div style="display:flex;gap:14px;align-items:center;justify-content:center">${grid}<div>${btns}</div></div>` : grid + btns);
} else if(st.kind === "bsearch"){
const tr = st.trials[Math.min(ti, st.trials.length - 1)], d = isLs ? { cols: Math.ceil(tr.N / 2), cell: 64 } : wmGridDims(tr.N, W, H - 40, 80), c = Math.min(d.cell, isLs ? 64 : 92);
info = st.phase === "fb" ? `<b style="color:var(--good)">Bütün yıldızlar bulundu!</b>` : `Tur <b>${ti + 1}/${st.trials.length}</b> · yıldız <b>${tr.k}/${tr.N}</b> · her kutuda yalnız bir yıldız var`;
body = dots + `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${c}px);">${Array.from({length: tr.N}, (_, i) => { const sh = st.show && st.show.i === i; const mk = sh ? (st.show.kind === "star" ? " ok" : st.show.kind === "empty" ? "" : " bad") : ""; const inner = sh ? (st.show.kind === "star" ? "⭐" : st.show.kind === "empty" ? "" : "🚫") : "📦"; return `<div class="wm-pic${mk}" data-mt="${i}" style="width:${c}px;height:${c}px;font-size:${Math.round(c * 0.5)}px;display:flex;align-items:center;justify-content:center;background:${tr.found.includes(i) ? "#F8FAFC" : "#FFF"}">${inner}</div>`; }).join("")}</div>`;
} else if(st.kind === "six"){
info = `<b>Üç iş, bir süre</b> · kalan <b id="sixLeft">${st.left}</b> sn · yapılan <b>${Object.keys(st.done).length}/6</b>`;
if(st.view === "menu"){ const tiles = SIX_TASKS.map(tk => [1, 2].map(p => { const id = tk.id + p, done = !!st.done[id]; return `<div class="wm-pic${done ? " ok" : ""}" data-mt="${id}" style="width:${isLs ? 92 : 100}px;height:${isLs ? 60 : 64}px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-color:${tk.c};cursor:pointer"><b style="font-size:13px;color:${tk.c}">${tk.n}</b><span style="font-size:15px;font-weight:900">${p}${done ? " ✓" : ""}</span></div>`; }).join("")).join("");
  body = `<div class="wm-grid" style="grid-template-columns:repeat(${isLs ? 6 : 3}, ${isLs ? 92 : 100}px);">${tiles}</div><div class="aud-key" style="text-align:center;margin-top:6px">Altı parçanın hepsine dokun; aynı işin iki parçasını art arda yapma</div><div class="wm-btns" style="margin:6px auto 0"><button type="button" class="wm-btn diff" style="background:#9AA8B5;box-shadow:0 5px 0 #6B7784" data-mtbtn="six-end">Bitir</button></div>`; }
else { const P = st.cfg.parts[st.view], tk = SIX_TASKS.find(x => x.id === st.view[0]), hits = st.hits[st.view] || [], c = Math.min(isLs ? 64 : 84, (W - 30) / 3 - 10);
  const hint = P.kind === "A" ? `Sayılara <b>küçükten büyüğe</b> dokun (${P.targets.join(", ")})` : P.kind === "B" ? "Bütün <b>hayvanlara</b> dokun" : "Bütün <b>dairelere</b> dokun";
  body = `<div class="aud-key" style="text-align:center;margin-bottom:4px"><b style="color:${tk.c}">${tk.n} ${st.view[1]}</b> · ${hint}</div><div class="wm-grid" style="grid-template-columns:repeat(${isLs ? 6 : 3}, ${c}px);">${P.cells.map((x, i) => `<div class="wm-pic${hits.includes(i) ? " ok" : st.badCell === i ? " bad" : ""}" data-mt="${i}" style="width:${c}px;height:${c}px;display:flex;align-items:center;justify-content:center">${x.html}</div>`).join("")}</div><div class="wm-btns" style="margin:6px auto 0"><button type="button" class="wm-btn diff" data-mtbtn="six-back">◀ Geri</button></div>`; }
} else if(st.kind === "selfchk"){
if(st.phase === "run"){ const it = st.trials[Math.min(st.cur, st.trials.length - 1)], px = Math.min(isLs ? 110 : 150, W * 0.4);
  info = `Hızlı ol · <b>${st.cur + 1}/${st.trials.length}</b> · şimdi geri bildirim yok`;
  const stimBox = `<div class="wm-card" style="width:${px}px;height:${px}px">${stopArrowSVG(it.d, "#1F2A33", Math.round(px * 0.6))}</div>`;
  const btns = `<div class="wm-btns" style="margin:${isLs ? 0 : 10}px auto 0;gap:8px">${st.cfg.D.map(d => `<button type="button" class="wm-btn diff stp-b" data-mtbtn="sc-${d}" style="min-width:56px;font-size:26px">${DIR_ARROW[d]}</button>`).join("")}</div>`;
  body = isLs ? `<div style="display:flex;gap:16px;align-items:center;justify-content:center">${stimBox}${btns}</div>` : stimBox + btns; }
else { const c = Math.min(isLs ? 54 : 64, (W - 24) / (isLs ? 10 : 5) - 8);
  info = `<b>Gözden geçir:</b> hangi cevapların yanlıştı? Onlara dokunup işaretle, sonra Bitti`;
  body = `<div class="wm-grid" style="grid-template-columns:repeat(${isLs ? 10 : 5}, ${c}px);">${st.trials.map((it, i) => `<div class="wm-pic${it.mark ? " bad" : ""}" data-mt="${i}" style="width:${c}px;height:${c}px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;font-size:12px"><span style="font-size:${Math.round(c * 0.36)}px;line-height:1">${DIR_ARROW[it.d]}</span><span style="font-weight:900;color:#2E6FD8;font-size:${Math.round(c * 0.3)}px;line-height:1">${it.ans === "-" ? "⌛" : DIR_ARROW[it.ans] || "?"}</span></div>`).join("")}</div><div class="aud-key" style="text-align:center;margin-top:4px">Üst: gösterilen ok · alt: senin cevabın (⌛ = geç kaldın)</div><div class="wm-btns" style="margin:6px auto 0"><button type="button" class="wm-btn same" data-mtbtn="sc-done">Bitti</button></div>`; }
} else if(st.kind === "cgt"){
const tr = st.trials[Math.min(ti, st.trials.length - 1)], c = Math.min(isLs ? 140 : 150, W * 0.38), order = tr.swap ? [1, 0] : [0, 1];
info = st.phase === "fb" ? (st.fb.loss ? `<b style="color:var(--bad)">${st.fb.gain} yıldız geldi, ${st.fb.loss} yıldız gitti</b>` : `<b style="color:var(--good)">${st.fb.gain} yıldız geldi</b>`) : `Deneme <b>${ti + 1}/${st.trials.length}</b> · bir kutuya dokun`;
const box = (i) => { const isRisk = i === 0, col = isRisk ? ACC.mor : ACC.mavi, fb = st.phase === "fb" && st.fb && st.fb.i === i; const faces = fb ? `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:2px;margin-top:2px">${Array.from({length: st.fb.gain}, () => `<img src="${FACE_IMAGES.happy}" alt="" style="width:${Math.round(c * 0.2)}px;height:${Math.round(c * 0.2)}px;object-fit:contain">`).join("")}${Array.from({length: st.fb.loss}, () => `<img src="${FACE_IMAGES.sad}" alt="" style="width:${Math.round(c * 0.2)}px;height:${Math.round(c * 0.2)}px;object-fit:contain">`).join("")}</div>` : `<div style="font-size:${Math.round(c * 0.42)}px;line-height:1.1">📦</div>`; return `<div class="wm-pic${fb ? (st.fb.loss ? " bad" : " ok") : ""}" data-mt="${i}" style="width:${c}px;height:${c}px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-color:${col};cursor:pointer">${faces}<b style="color:${col};font-size:13px">${isRisk ? "Mor kutu" : "Mavi kutu"}</b></div>`; };
body = dots + `<div style="display:flex;gap:16px;justify-content:center;margin-top:6px">${order.map(box).join("")}</div><div class="aud-key" style="text-align:center;margin-top:8px">Yıldızların: <b style="font-size:16px">${st.stars}</b> ⭐</div>`;
} else if(st.kind === "ktrack"){
const tr = st.trials[Math.min(ti, st.trials.length - 1)], c = Math.min(isLs ? 150 : 180, W * 0.5);
if(st.phase === "study"){ const x = st.si >= 0 ? tr.seq[st.si] : null; info = `<b>İzle, dinle…</b> ${Math.max(0, st.si + 1)}/${tr.seq.length} · gruplar: <b>${tr.cats.map(k => k.n).join(", ")}</b>`;
  body = dots + `<div style="display:flex;justify-content:center"><div class="wm-card" style="width:${c}px;height:${c}px;flex-direction:column;gap:4px">${x ? `${imgTag(x.src)}<b style="font-size:16px">${x.n}</b>` : ""}</div></div>`; }
else { info = `<b>Her grubun en son geleni söyle.</b>`;
  body = dots + `<div style="display:flex;flex-direction:column;gap:6px;align-items:center">${tr.cats.map((k, q) => `<div style="display:flex;align-items:center;gap:8px;justify-content:center"><b style="min-width:90px">${cap(k.n)}:</b><span class="aud-key">beklenen <b>${tr.last[k.k]}</b></span></div>`).join("")}</div><div class="aud-key" style="text-align:center;margin-top:6px">Yetişkin: hatırlanmayan her sonuncu için <b>Hata sayısı +</b>, sonra ${ti + 1 < st.trials.length ? "Sonraki tur" : "Bitir"}</div>` + (st.phase === "ask" ? `<div class="wm-btns" style="margin:8px auto 0"><button type="button" class="wm-btn same" data-mtbtn="kt-next">${ti + 1 < st.trials.length ? "Sonraki tur ▶" : "✓ Bitir"}</button></div>` : ""); }
} else if(st.kind === "movesay"){
const seq = st.trials[ti];
if(st.phase === "listen"){ info = "<b>Dinle…</b>"; body = dots + SPEAKER_HTML(true); }
else { info = "<b>Şimdi yap!</b> Hareketleri aynı sırayla yap."; const cards = (c) => `<div style="display:flex;gap:8px;justify-content:center;flex:0 0 auto">${seq.map((i, k) => `<div class="wm-card" style="width:${c}px;height:${c}px;position:relative;overflow:visible"><img src="${MOVE_IMAGES[i]}" alt="" style="width:100%;height:100%;object-fit:contain"><span class="num" style="position:absolute;right:4px;bottom:2px;font-size:${Math.max(14, Math.round(c * 0.16))}px">${k + 1}</span></div>`).join("")}</div>`, key = `<div class="aud-key" style="text-align:center">Doğru sıra: <b>${seq.map(i => MOVES[i]).join(" → ")}</b></div>`, note = `<div class="aud-key" style="text-align:center">Yetişkin: yanlış ya da eksikse <b>Hata sayısı +</b></div>`, btn = `<div class="wm-btns" style="position:static;margin:0 auto;transform:none"><button type="button" class="wm-btn same" data-judge="9">Sonraki ▶</button></div>`;
/* KURAL (yatay ekran, 2026-11-07): Hareket Sırası yatay ekranda iki sütundur — solda resimler kalan yüksekliğe göre büyük, sağda doğru sıra, yetişkin notu ve Sonraki; Sonraki yazının üstüne binmez. Dikeyde resimlerin numarası kartın içinde, kartı kesmez */
if(isLs){ const c = Math.max(56, Math.floor(Math.min(H - 40, (W * 0.58 - 8 * (seq.length - 1)) / seq.length, 150))); body = dots + `<div style="display:flex;align-items:center;justify-content:center;gap:18px">${cards(c)}<div style="display:flex;flex-direction:column;gap:8px;align-items:center;max-width:40%">${key}${note}${btn}</div></div>`; }
else { const c = Math.min(110, (W - 30) / seq.length - 8); body = dots + `<div style="margin-bottom:6px">${key}</div>${cards(c)}<div style="margin-top:6px">${note}</div><div style="margin-top:6px">${btn}</div>`; } }
} else if(st.kind === "storyord"){
const tr = st.trials[ti], simg = (c) => `<img src="${STORY_SEQ_IMAGES[c.si][c.k]}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:10px">`;
if(st.phase === "study"){ const k = st.si, w = Math.min(W - 20, isLs ? (H - 70) * 2 : 340);
info = `<b>İzle ve dinle…</b> ${Math.max(0, k + 1)}/3`;
body = dots + `<div class="wm-card" style="width:${w}px;height:${Math.round(w / 2)}px;padding:4px">${k >= 0 ? simg({ si: tr.si, k }) : ""}</div>${k >= 0 ? `<div style="font-weight:800;font-size:17px;margin-top:6px;text-align:center">${STORY_SEQ_TEXT[tr.si][k]}</div>` : ""}`;
} else {
info = "<b>Doğru sıraya</b> koy: önce olana dokun";
const sw = Math.min(isLs ? (W * 0.5 - 30) / 3 : (W - 30) / 3, 150), sh = Math.round(sw / 2);
const slots = `<div style="display:flex;gap:6px;justify-content:center;margin-bottom:10px">${[0, 1, 2].map(k => { const ci = st.placed[k]; return `<div class="wm-card" style="width:${sw}px;height:${sh}px;padding:2px;position:relative;${ci == null ? "border-style:dashed" : ""}">${ci != null ? simg(tr.cards[ci]) : ""}<span class="num">${k + 1}</span></div>`; }).join("")}</div>`;
const left = tr.cards.map((c, i) => ({ c, i })).filter(x => !st.placed.includes(x.i));
const cw = Math.min(isLs ? (W * 0.5 - 30) / 2 : (W - 30) / 2, 170), ch = Math.round(cw / 2);
const cards = `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${left.map(x => `<div class="wm-pic${st.bad[x.i] ? " bad" : ""}" data-mt="${x.i}" style="width:${cw}px;height:${ch}px;padding:3px">${simg(x.c)}</div>`).join("")}</div>`;
body = dots + (isLs ? `<div style="display:flex;gap:14px;align-items:center;justify-content:center"><div>${slots}</div><div>${cards}</div></div>` : slots + cards);
}
} else if(st.kind === "absay"){
const it = st.trials[Math.min(ti, st.trials.length - 1)], sz = Math.min(isLs ? Math.min(H - 70, W * 0.3) : 210, W * 0.62);
info = `${isPre() ? "Resim" : "Cümle"} <b>${ti + 1}/${st.trials.length}</b>`;
const pic = it.img != null ? `<div class="wm-card" style="width:${sz}px;height:${sz}px;padding:4px"><img src="${ABS_PIC_IMAGES[it.img]}" alt="" style="width:100%;height:100%;object-fit:contain"></div>` : `<div class="flu-card" style="max-width:${isLs ? 300 : 360}px;font-size:${isLs ? 16 : 19}px;font-weight:800;line-height:1.35;text-align:center">${it.s}</div>`;
body = dots + `<div style="display:flex;${isLs ? "" : "flex-direction:column;"}gap:12px;align-items:center;justify-content:center">${pic}<div style="max-width:${isLs ? "60%" : "380px"}"><div style="font-weight:900;font-size:${isLs ? 15 : 19}px;margin-bottom:4px">${it.q}</div><div class="aud-key" style="${isLs ? "font-size:12px;line-height:1.2" : ""}">Beklenen: <b>${it.a}</b></div>` +
`<div class="aud-key" style="text-align:center;margin-top:6px">Yetişkin: yanlış ya da eksikse <b>Hata sayısı +</b></div><div class="wm-btns" style="margin:6px auto 0"><button type="button" class="wm-btn same" data-judge="9">Sonraki ▶</button></div></div></div>`;
} else if(st.kind === "whatdo"){
const it = st.trials[Math.min(ti, st.trials.length - 1)], why = stIx() === 1, sz = Math.min(isLs ? Math.min(H - 70, W * 0.27) : 210, W * 0.62) * (window._fitK || 1);
info = `Durum <b>${ti + 1}/${st.trials.length}</b>`;
body = dots + `<div style="display:flex;${isLs ? "" : "flex-direction:column;"}gap:12px;align-items:center;justify-content:center"><div class="wm-card" style="width:${sz}px;height:${sz}px;padding:4px"><img src="${SIT_IMAGES[it.img]}" alt="" style="width:100%;height:100%;object-fit:contain"></div>` +
`<div style="max-width:${isLs ? "70%" : "380px"}"><div style="font-weight:900;font-size:${isLs ? 14 : 19}px;margin-bottom:${isLs ? 2 : 4}px">${it.q}${why ? " <span style='color:#B07D00'>Neden?</span>" : ""}</div><div class="aud-key" style="${isLs ? "font-size:12px;line-height:1.2" : ""}">${isLs ? "Örnek" : "Uygun cevap örneği"}: <b>${it.a}</b>${why ? `<br>Gerekçe: <b>${it.why}</b>` : ""}</div>` +
`<div class="aud-key" style="text-align:center;margin-top:6px">Yetişkin: yanlış ya da eksikse <b>Hata sayısı +</b></div><div class="wm-btns" style="margin:6px auto 0"><button type="button" class="wm-btn same" data-judge="9">Sonraki ▶</button></div></div></div>`;
} else if(st.kind === "size"){
const tr = st.trials[ti];
info = st.desc ? "<b>Büyükten küçüğe</b> dokun" : "<b>Küçükten büyüğe</b> dokun";
body = dots + grid(tr.order, (o, i, c) => `<div class="wm-pic${st.marks[i] ? " " + st.marks[i] : ""}" data-mt="${i}" style="width:${c}px;height:${c}px;">${qzPic(tr.src, tr.sizes[o])}${st.marks[i] === "ok" ? `<span class="num">${st.desc ? tr.sizes.length - tr.order[i] : tr.order[i] + 1}</span>` : ""}</div>`, 80);
} else if(st.kind === "samenum"){
const total = st.items.filter(x => x.tgt).length;
const head = `<div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:6px"><span style="font-weight:800">Bul:</span><span style="font:900 40px 'Trebuchet MS',Verdana,sans-serif;color:var(--ink);background:var(--panel);border:3px solid var(--teal);border-radius:14px;padding:0 16px;line-height:56px">${st.T}</span><span style="font-weight:800">${Object.keys(st.found).length}/${total}</span></div>`;
info = "<b>Aynı sayının hepsine</b> dokun";
body = head + grid(st.items, (x, i, c) => { const mk = st.found[i] ? " ok" : st.bad[i] ? " bad" : "";
return `<div class="wm-pic${mk}" data-mt="${i}" style="width:${c}px;height:${c}px;"><span style="font-family:${x.font.replace(/"/g, "'")};font-weight:800;font-size:${Math.round(c * 0.55 * x.sc)}px;color:${x.color};display:inline-block;transform:rotate(${x.r}deg)${x.mirror ? " scaleX(-1)" : ""};line-height:1">${x.d}</span></div>`; }, 52, isLs ? H - 70 : H - 70);
} else if(st.kind === "face"){
const tr = st.trials[ti], fimg = (fid) => `<img src="${FACE_ID_IMAGES[fid]}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:12px">`;
if(st.phase === "study"){
const sz = Math.min(isLs ? H - (tr.mode === "name" ? 110 : 60) : 200, W * 0.6);
if(tr.mode === "name"){ const x = tr.ppl[st.si]; info = `<b>Yüzü ve adını aklında tut</b>`;
body = dots + (x ? `<div class="wm-card" style="width:${sz}px;height:${sz}px;padding:4px">${fimg(x.i)}</div><div style="font-weight:900;font-size:24px;margin-top:6px">${x.nm}</div>${stIx() !== currentStageIndex ? `<div style="font-weight:800;color:#B07D00">💡 Bir özelliğini bul, adıyla birleştir</div>` : ""}` : ""); }
else { const fid = tr.study[st.si]; info = `<b>Yüzlere iyi bak…</b> ${Math.max(0, st.si + 1)}/${tr.study.length}`; body = dots + `<div class="wm-card" style="width:${sz}px;height:${sz}px;padding:4px">${fid != null ? fimg(fid) : ""}</div>`; }
} else if(tr.mode === "recog"){
info = `<b>Gördüğün yüzlere</b> dokun · ${Object.keys(st.found).length}/${tr.study.length}`;
body = dots + grid(tr.opts, (fid, i, c) => `<div class="wm-pic${st.found[i] ? " ok" : st.bad[i] ? " bad" : (st.reveal && tr.study.includes(fid) ? " ok" : "")}" data-mt="${i}" style="width:${c}px;height:${c}px;padding:3px">${fimg(fid)}</div>`, 74, isLs ? H - 95 : H - 60) +
`<div class="wm-btns" style="margin:8px auto 0"><button type="button" class="wm-btn same" data-mtbtn="face-done">Bitti</button></div>`;
} else {
const q = tr.ppl[tr.order[Math.min(st.qi, tr.order.length - 1)]];
info = `<b>Hangisi ${q.nm}?</b>`;
body = dots + grid(tr.ppl, (x, i, c) => `<div class="wm-pic${st.phase === "fb" ? (i === tr.order[st.qi] ? " ok" : (i === st.pick ? " bad" : "")) : ""}" data-mt="${i}" style="width:${c}px;height:${c}px;padding:3px">${fimg(x.i)}</div>`, 90);
}
} else if(st.kind === "scene" || st.kind === "scenet"){
if(st.phase === "study"){ info = `<b>Resme iyi bak…</b> · ${SCENE_NAMES[st.sc.k]}`; body = sceneImgHTML(st.sc.k, W, H, isLs) + studyBar(sceneStudyMs()); }
else if(st.kind === "scene"){
const q = st.qs[Math.min(st.qi, st.qs.length - 1)];
info = `Resim kapandı · soru <b>${st.qi + 1}/${st.qs.length}</b>`;
body = `<div style="font-size:22px;font-weight:900;text-align:center;margin:10px 0 4px">${q[0]}</div><div class="aud-key" style="text-align:center;font-size:16px">Cevap: <b>${q[1]}</b></div>` +
`<div class="aud-key" style="text-align:center;margin-top:6px">Yetişkin: yanlış ya da eksikse <b>Hata sayısı +</b></div><div class="wm-btns" style="margin:6px auto 0"><button type="button" class="wm-btn same" data-judge="9">Sonraki ▶</button></div>`;
} else {
const q = st.qs[Math.min(st.qi, st.qs.length - 1)];
info = `<b>Hangisi resimdeydi?</b> · ${st.qi + 1}/${st.qs.length}`;
body = grid(q.opts, (o, i, c) => `<div class="wm-pic${st.phase === "fb" ? (o === q.ans ? " ok" : (i === st.pick ? " bad" : "")) : ""}" data-mt="${i}" style="width:${c}px;height:${c}px;padding:3px"><img src="${SCENE_OBJ_IMAGES[o]}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:10px"></div>`, 100);
}
} else if(st.kind === "draw"){
const n = st.n, want = st.trials[ti], area = Math.min(isLs ? H - 100 : 300 * tabletScale(), W - 20) * (window._fitK || 1), gap = area / n, rr = Math.max(14, gap * 0.16);
const show = st.phase === "study" ? want : st.mine, xy = (p) => [(p % n + 0.5) * gap, (Math.floor(p / n) + 0.5) * gap];
const line = (k, col, w, dash) => { const [a, b] = k.split("-").map(Number), [x1, y1] = xy(a), [x2, y2] = xy(b); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash ? ' stroke-dasharray="6 7"' : ""}/>`; };
let lines = [...show].map(k => line(k, st.phase === "study" ? "#2E6FD8" : "#1D2939", 9)).join("");
if(st.phase === "fb") lines = [...want].map(k => line(k, st.mine.has(k) ? "#1FA463" : "#E5484D", 9, !st.mine.has(k))).join("") + [...st.mine].filter(k => !want.has(k)).map(k => line(k, "#E5484D", 9)).join("");
const dotsSvg = Array.from({length:n * n}, (_, p) => { const [x, y] = xy(p); return `<circle cx="${x}" cy="${y}" r="${Math.max(rr, gap * 0.45)}" fill="transparent" data-mt="${p}" style="cursor:pointer"/><circle cx="${x}" cy="${y}" r="${rr}" fill="${st.sel === p ? "#FFC21A" : "#C9D3DE"}" data-mt="${p}" style="cursor:pointer"/>`;   /* görünmez geniş dokunma alanı */ }).join("");
info = st.phase === "study" ? "<b>Çizgiyi aklında tut…</b>" : st.phase === "fb" ? "Yeşil: doğru · Kırmızı: eksik ya da fazla" : st.copy ? "Soldaki modelin <b>aynısını</b> çiz" : "Noktalara dokunarak <b>aynı çizgiyi</b> çiz";
const modelSvg = st.copy ? (() => { const ma = Math.min(isLs ? H - 100 : 130, W * 0.38), mg = ma / n, mxy = (p) => [(p % n + 0.5) * mg, (Math.floor(p / n) + 0.5) * mg]; return `<svg viewBox="0 0 ${ma} ${ma}" width="${ma}" height="${ma}" style="display:block;background:#FFF8E5;border:2px solid #E0A100;border-radius:14px">${[...want].map(k => { const [a, b] = k.split("-").map(Number), [x1, y1] = mxy(a), [x2, y2] = mxy(b); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2E6FD8" stroke-width="6" stroke-linecap="round"/>`; }).join("")}${Array.from({length:n * n}, (_, q) => { const [x, y] = mxy(q); return `<circle cx="${x}" cy="${y}" r="${Math.max(4, mg * 0.1)}" fill="#C9D3DE"/>`; }).join("")}</svg>`; })() : "";
const areaC = st.copy ? Math.min(area, isLs ? H - 100 : W - 20, isLs ? W * 0.45 : 300) : area;
body = dots + (st.copy ? `<div style="display:flex;${isLs ? "" : "flex-direction:column;"}gap:10px;align-items:center;justify-content:center">${modelSvg}` : "") + `<svg viewBox="0 0 ${area} ${area}" width="${areaC}" height="${areaC}" style="display:block;margin:0 auto;background:#F2F5F8;border-radius:18px;touch-action:none">${lines}${dotsSvg}</svg>` + (st.copy ? "</div>" : "") +
(st.phase === "input" ? `<div class="wm-btns" style="margin:8px auto 0"><button type="button" class="wm-btn diff" data-mtbtn="draw-undo">Sil</button><button type="button" class="wm-btn same" data-mtbtn="draw-done">Bitti</button></div>` : "");
}
return { info, body };
}
};
