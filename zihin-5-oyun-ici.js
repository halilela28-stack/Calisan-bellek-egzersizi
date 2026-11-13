/* Zihin Atölyesi — zihin-5-oyun-ici.js (5/8): etkileşimli çalışma türleri, dokunma işleyicileri, kısa yönergeler, stratejiler. Dosyalar zihin-atolyesi.html'de bu sırayla yüklenir; sıra değiştirilemez (önceki tek dosyanın ardışık parçalarıdır). */
const NEW_MT_KINDS = ["tapr","selfchk","cgt","ktrack","zoo","keys","jars","dfl","twq","bsearch","six","fist","wcst","rev","statue","hold","hear","dir","miss","chg","recog","draw","face","scene","scenet","samenum","size","movesay","storyord","whatdo","flu","spic","fsort","absay","parr","nword","rl","wt","dr","kav","ubal","htrn","slide","kopru","esc","bln","mol","ctc","bag","smn","clue","ctab","cobj","porder","ftrace","ecount","pairm","per","fix","dual","stop","vig","pnb","csp","tone","wseen","route","sbuild","spotd","sdk","blk","clut","sym","maze","ssnd","seqw","dots","chase","time","ferr","cups","mmath","who","rhy","mem"];

const DELAY_TASKS = { story:"Hikâye Hatırlama → Aşama 3 (Gecikmeli)", recog:"Bunu Gördün mü? → Aşama 2 (Gecikmeli)", list:"Liste Öğrenme → Aşama 2 (Gecikmeli)" };
function delayKey(task){ return "wm_delay_" + task + "_" + (currentPlayerName || "Misafir"); }
function delaySet(task, data){ try{ localStorage.setItem(delayKey(task), JSON.stringify(Object.assign({ ts: Date.now(), notified:false }, data))); }catch(e){} }
function delayGet(task){ try{ return JSON.parse(localStorage.getItem(delayKey(task)) || "null"); }catch(e){ return null; } }
function delayMins(task){ const d = delayGet(task); return d ? Math.floor((Date.now() - d.ts) / 60000) : 0; }
setInterval(() => { try{ for(const task in DELAY_TASKS){ const d = delayGet(task);
if(d && !d.notified && Date.now() - d.ts > 10 * 60 * 1000){ d.notified = true; localStorage.setItem(delayKey(task), JSON.stringify(d)); showLevelFlash("⏰ Gecikmeli hatırlama zamanı: " + DELAY_TASKS[task], "levelup"); break; } } }catch(e){} }, 30000);

let ckMarks = {};   // işaretleme düğmeleri (liste öğrenme / kategorili liste): "blok:sıra" → durum
const LL_WORDS = ["davul","perde","kaşık","güneş","okul","fare","bahçe","ceket","burun","tavuk","nehir","şeker","renk","ev","çiftçi","kahve","şapka","dağ","bulut","kitap","kalem","deniz","saat","ağaç","kapı","bardak","yıldız","çanta","balık","masa","ayna","köprü","lamba","halı","tren","çorap","fener","bal","pencere","gemi"];
const LL_LEN = { post:[8, 10, 12], pre:[5, 6, 7] }, LL_TRIALS = { post:5, pre:3 };
function llBuild(){
if(currentStageIndex === 1){ const d = delayGet("list"); if(d && d.A){ const rest = shuffleArray(LL_WORDS.filter(w => !d.A.includes(w) && !(d.B || []).includes(w)));
return [{ A: d.A, delayed:true, R: shuffleArray(d.A.concat(rest.slice(0, d.A.length))) }]; } }
const N = (isPre() ? LL_LEN.pre : LL_LEN.post)[currentCombo().t], w = shuffleArray(LL_WORDS), A = w.slice(0, N), B = w.slice(N, N * 2);
try{ delaySet("list", { A, B }); }catch(e){}   /* gecikmeli aşama için öğrenilen liste (işaretleme kalktığı için burada kaydedilir) */
return [{ A, B, delayed:false }];
}
const ckCount = (blk, n) => Array.from({length:n}, (_, i) => ckMarks[blk + ":" + i] ? 1 : 0).reduce((a, b) => a + b, 0);
/* KURAL: listeli sözel çalışmalarda tek tek işaretleme yok; kelimeler okuma listesi olarak görünür, yetişkin Hata sayısı −/+ ile puanlar */
const ckChip = (blk, i, word, state, labels) => `<span style="border:2px solid var(--line);background:var(--panel);border-radius:999px;padding:5px 11px;font-weight:800;font-size:14px;color:var(--ink)">${word}</span>`;
const ckRow = (inner) => `<div style="display:flex;flex-wrap:wrap;gap:5px;margin:4px 0 10px">${inner}</div>`;
function llRender(items){
const L = items[0], T = isPre() ? LL_TRIALS.pre : LL_TRIALS.post;
if(L.delayed){
const mins = delayMins("list"), d = ckCount("D", L.A.length);
const rh = L.R.filter((w, i) => ckMarks["R:" + i] && L.A.includes(w)).length, rf = L.R.filter((w, i) => ckMarks["R:" + i] && !L.A.includes(w)).length;
return `<div class="aud-list"><div class="aud-note">⏰ Liste <b>${mins} dakika</b> önce öğrenildi${mins < 10 ? " <b>(10–15 dakika beklemeniz önerilir)</b>" : ""}. Listeyi okumadan önce <b>hatırladığı kelimeleri</b> sorun; hatırlamadığı her kelime için <b>Hata sayısı +</b>. Sonra <b>tanıma</b> listesini tek tek okuyun; listede olanlar koyu yazılı. Yanlış "vardı" ya da yanlış "yoktu" dediği her kelime için de <b>Hata sayısı +</b>.</div>` +
`<div style="font-weight:900">1. Gecikmeli hatırlama</div>` + ckRow(L.A.map((w, i) => ckChip("D", i, w, ckMarks["D:" + i])).join("")) +
`<div style="font-weight:900">2. Tanıma (koyu olanlar listedeydi)</div>` + ckRow(L.R.map((w, i) => ckChip("R", i, L.A.includes(w) ? "<b>" + w + "</b>" : w)).join("")) +
`<div class="aud-note">Gecikmeli hatırlamada düşük, tanımada yüksek puan: bilgi kaydedilmiş ama geri getirmekte güçlük var. İkisi de düşükse kayıt (öğrenme) güçlüğü düşünülebilir.</div></div>`;
}
const curve = Array.from({length:T}, (_, k) => ckCount("t" + k, L.A.length));
let html = `<div class="aud-list"><div class="aud-note">A listesini her denemede <b>aynı sırayla</b>, saniyede bir kelime okuyun; her okumadan sonra çocuk <b>hatırladığı kadarını, istediği sırayla</b> söylesin. Son denemede hatırlanmayan her kelime için <b>Hata sayısı +</b>. ${T} denemeden sonra B listesini bir kez okuyup sordurun, ardından <b>A listesini okumadan</b> yeniden sorun. 10–15 dakika sonra <b>Aşama 2</b>'yi açın.</div>` +
`<div class="aud-row"><div class="aud-num">A</div><div class="aud-body"><div class="aud-words">${L.A.join(" – ")}</div></div></div>` +
``;
for(let k = 0; k < T; k++) html += `<div style="font-weight:800">${k + 1}. deneme</div>` + ckRow(L.A.map((w, i) => ckChip("t" + k, i, w, ckMarks["t" + k + ":" + i])).join(""));
html += `<div class="aud-row"><div class="aud-num">B</div><div class="aud-body"><div class="aud-words">${L.B.join(" – ")}</div></div></div>` +
`<div style="font-weight:800">B listesi (karışma)</div>` + ckRow(L.B.map((w, i) => ckChip("B", i, w, ckMarks["B:" + i])).join("")) +
`<div style="font-weight:800">A listesi, B'den sonra (okumadan)</div>` + ckRow(L.A.map((w, i) => ckChip("A2", i, w, ckMarks["A2:" + i])).join(""));
return html + `</div>`;
}
/* llScore: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
const CL_BANK = { "meyve":["elma","armut","muz","kiraz","çilek","üzüm","karpuz"], "hayvan":["kedi","inek","at","tavşan","aslan","kuş","koyun"], "taşıt":["araba","otobüs","tren","uçak","gemi","bisiklet","kamyon"], "giysi":["gömlek","pantolon","çorap","şapka","ceket","etek","eldiven"],
  "sebze":["havuç","patates","soğan","salatalık","domates","biber","ıspanak"], "renk":["kırmızı","mavi","sarı","yeşil","mor","turuncu","pembe"], "mobilya":["masa","sandalye","dolap","koltuk","yatak","kitaplık","sehpa"], "mutfak eşyası":["kaşık","çatal","tabak","bardak","tencere","bıçak","tava"],
  "okul eşyası":["kalem","defter","silgi","cetvel","çanta","kitap","makas"], "meslek":["doktor","öğretmen","aşçı","pilot","itfaiyeci","berber","polis"], "müzik aleti":["davul","gitar","piyano","keman","flüt","bağlama","zil"], "kuş":["serçe","kartal","güvercin","karga","baykuş","papağan","leylek"],
  "deniz canlısı":["balık","yunus","yengeç","ahtapot","denizatı","balina","midye"], "vücut parçası":["el","ayak","burun","kulak","göz","diz","parmak"], "oyuncak":["top","bebek","yapboz","uçurtma","lego","ayıcık","balon"], "hava olayı":["yağmur","kar","rüzgâr","güneş","bulut","fırtına","sis"] };
const CL_PLURAL = { "meyve":"meyveler", "hayvan":"hayvanlar", "taşıt":"taşıtlar", "giysi":"giysiler", "sebze":"sebzeler", "renk":"renkler", "mobilya":"mobilyalar", "mutfak eşyası":"mutfak eşyaları", "okul eşyası":"okul eşyaları", "meslek":"meslekler", "müzik aleti":"müzik aletleri", "kuş":"kuşlar", "deniz canlısı":"deniz canlıları", "vücut parçası":"vücut parçaları", "oyuncak":"oyuncaklar", "hava olayı":"hava olayları" };
let clLastCats = [];
function clBuild(){
const spec = isPre() ? [[2, 2], [2, 3], [3, 3]] : [[3, 3], [3, 4], [4, 4]], [C, K] = spec[currentCombo().t];
const allCats = Object.keys(CL_BANK), fresh = shuffleArray(allCats.filter(c => !clLastCats.includes(c))), cats = fresh.concat(shuffleArray(clLastCats)).slice(0, C); clLastCats = cats.slice(); /* art arda turlarda aynı kategoriler gelmesin */ const groups = cats.map(c => ({ c, w: shuffleArray(CL_BANK[c]).slice(0, K) }));
let flat; do{ flat = shuffleArray(groups.flatMap(g => g.w.map(w => ({ w, c: g.c })))); } while(flat.some((x, i) => i && flat[i - 1].c === x.c) && Math.random() < 0.97);
return [{ groups, flat }];
}
function clRender(items){
const L = items[0], total = L.flat.length, strat = false;
let free = 0, cued = 0; L.groups.forEach((g, gi) => g.w.forEach((w, i) => { const s = ckMarks[gi + ":" + i]; if(s === 1) free++; if(s === 2) cued++; }));
const tip = strat ? `<div class="aud-note" style="border-color:#E0A100;background:#FFF8E5">💡 <b>Strateji · Grupla:</b> Okumadan önce söyleyin: <b>"Bu listede ${L.groups.map(g => CL_PLURAL[g.c]).join(", ")} var. Dinlerken aklında grupla; söylerken önce bir grubu bitir, sonra diğerine geç."</b> Sonuçları Aşama 1 ile karşılaştırın.</div>` : "";
return `<div class="aud-list"><div class="aud-note">Kelimeleri karışık sırayla, saniyede bir okuyun; çocuk <b>hatırladıklarını</b> söylesin. Kendiliğinden hatırlanmayan her kelime için <b>Hata sayısı +</b>. Sonra eksik kalan gruplar için ipucu verin: <b>"${CL_PLURAL[L.groups[0].c][0].toLocaleUpperCase("tr-TR") + CL_PLURAL[L.groups[0].c].slice(1)} hangileriydi?"</b></div>${tip}` +
`<div class="aud-row"><div class="aud-num">↓</div><div class="aud-body"><div class="aud-words">${L.flat.map(x => x.w).join(" – ")}</div></div></div>` +
`` +
L.groups.map((g, gi) => `<div style="font-weight:800">${cap(CL_PLURAL[g.c])}</div>` + ckRow(g.w.map((w, i) => ckChip(gi, i, w, ckMarks[gi + ":" + i], { 1:"✓", 2:"◐" })).join(""))).join("") +
`<div class="aud-note">İpucuyla çok kelime ekleniyorsa bilgi bellekte var, geri getirme stratejisi desteklenmeli.</div></div>`;
}
/* clScore: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
const NW_BANK = {
2:["tipo","nake","fumi","gobe","lesu","vuka","zemo","dafi","rugo","meti"],
3:["tabuke","linome","gosefa","mipura","dalefo","kuvami","senolu","bilaso","femuri","nokatu"],
4:["talimope","gusinare","mekobali","fiderumo","nopalesi","rimatoke","sulafeni","bonekura"],
5:["tamilokesu","berunafoti","gosimelaku","palinodera","kufamesito","nemitaluso"]
};
function nwBuild(){
const t = currentCombo().t, lens = isPre() ? [[2, 2], [2, 3], [3, 4]][t] : [[2, 3], [3, 4], [4, 5]][t], out = [];
lens.forEach((L, k) => shuffleArray(NW_BANK[L]).slice(0, isPre() ? [3, 2][k] : 4).forEach(w => out.push({ w, L })));
return out;
}
const sentCycles = {};
function sentNext(n){ const key = (isPre() ? "pre" : "post") + currentCombo().t; if(!sentCycles[key]) sentCycles[key] = mkCycle(SENT_BANK[isPre() ? "pre" : "post"][currentCombo().t]); const out = []; while(out.length < n){ const x = sentCycles[key](); if(!out.includes(x)) out.push(x); } return out; }   /* art arda turlarda da tekrar etmez (30 cümlelik döngü) */
const SENT_BANK = { pre:[ ["Kedi süt içiyor.","Ben parka gittim.","Annem kek yaptı.","Top masanın altında.","Kuş ağaçta ötüyor.","Bebek şimdi uyuyor.","Köpek kemik yiyor.","Babam gazete okuyor.","Kardeşim top oynuyor.","Çiçekler bahçede açtı.","Ali okula gitti.","Elma çok tatlı.","Araba hızlı gidiyor.","Ayşe resim yapıyor.","Balık suda yüzüyor.","Güneş sıcak parlıyor.","Dedem çay içiyor.","Kedi koltukta uyuyor.","Yağmur yağmaya başladı.","Mert süt döktü.","Kuş yuvasına uçtu.","Kapı sessizce kapandı.","Kelebek çiçeğe kondu.","Tavşan havuç yedi.","Çocuklar parkta koşuyor.","Annem ekmek aldı.","Top çok yüksek zıpladı.","Elif şarkı söylüyor.","Ördek gölde yüzüyor.","Bugün hava güzel."], ["Kırmızı top yatağın altına kaçtı.","Babam bana yeni bir kitap aldı.","Köpek bahçede kemiğini saklıyor.","Yağmur yağınca şemsiyemi açtım.","Kardeşim mavi kalemle resim yaptı.","Akşam yemekten sonra dişimi fırçaladım.","Annem sabah bize sıcak çorba pişirdi.","Küçük kedi ağacın tepesine tırmandı.","Ali bahçede sarı bir kelebek yakaladı.","Kuşlar sabah erkenden ötmeye başladı.","Dedem bana eski bir fotoğraf gösterdi.","Ayşe kırmızı bisikletiyle parka gitti.","Babam arabayı garajın önüne park etti.","Kardeşim en sevdiği oyuncağını kaybetti.","Mavi balon gökyüzüne doğru uçtu.","Anneannem tatlı kurabiyeler pişirdi.","Mert topunu komşunun bahçesine kaçırdı.","Öğretmen bize yeni bir şarkı öğretti.","Kedi pencereden kuşları seyrediyor.","Elif bahçeden taze çilek topladı.","Köpek kapının önünde sahibini bekliyor.","Çocuklar kumdan büyük bir kale yaptı.","Annem çamaşırları balkona astı.","Büyük kırmızı tren istasyona geldi.","Babam akşam bize masal okudu.","Tavşan havuçları kutunun içine sakladı.","Deniz yazın denizde yüzmeyi öğrendi.","Kuş yuvasına küçük dallar taşıdı.","Dolabın üstünde eski bir saat var.","Çocuklar bahçede saklambaç oynadı."], ["Kedi uyurken fare sessizce kaçtı.","Parka gittik ama hava çok soğuktu.","Annem gelince hep birlikte yemek yedik.","Topu bulamadım çünkü dolabın arkasına düşmüştü.","Ali hem resim yaptı hem şarkı söyledi.","Kuşu gören kedi hızla ağaca tırmandı.","Yağmur dinince çocuklar yeniden bahçeye çıktı.","Kardeşim ağladı çünkü balonu elinden kaçtı.","Dedem bahçeyi sularken ben çiçekleri topladım.","Ayşe ödevini bitirince arkadaşıyla oynamaya gitti.","Köpek kemiğini bulamayınca bütün bahçeyi kazdı.","Annem markete gitti ama ekmek almayı unuttu.","Hava karardığı için parktan erken döndük.","Mert düşünce dizi acıdı ama ağlamadı.","Kedi mamasını yedikten sonra koltukta uyudu.","Babam arabayı yıkadı sonra bahçede çay içti.","Elif uyandı ama pencereden kar yağdığını gördü.","Tavşan havucu yedi ve yuvasına geri döndü.","Çocuklar top oynarken top komşunun bahçesine kaçtı.","Kuş yuvadan uçtu ama hemen geri geldi.","Öğretmen içeri girince herkes yerine oturdu.","Anneannem kurabiye yaptı ve hepsini bize verdi.","Deniz denize girmek istedi ama su çok soğuktu.","Kapı çalınca köpek havlayarak kapıya koştu.","Balon patlayınca bebek birden ağlamaya başladı.","Eve gelir gelmez ellerimi sabunla yıkadım.","Kardeşim uyuyunca ben sessizce kitap okudum.","Hava güneşli olduğu için şapkamı taktım.","Kedi süt içti ama tabağı devirdi.","Annem seslenince hemen masaya oturduk."] ], post:[ ["Okul çıkışında arkadaşımla dondurma yedik.","Kedi uyurken fare sessizce kaçtı.","Babam arabayı yıkadıktan sonra bahçeyi suladı.","Kitabımı okulda unuttuğum için ödevimi yapamadım.","Kardeşim hem resim yaptı hem şarkı söyledi.","Yağmur dinince çocuklar bahçeye koştu.","Öğretmenimiz bugün bize yeni bir şarkı öğretti.","Annem akşam yemeğinden sonra bize meyve ikram etti.","Kütüphanede sessizce oturup kitabımı okudum.","Kuşlar sabah erkenden bahçedeki ağaçlara kondu.","Dedem her hafta sonu bizi parka götürür.","Kardeşim yeni bisikletiyle sokakta tur attı.","Bahçedeki elma ağacı bu yıl bol meyve verdi.","Sınıfımız gezi için sabah erkenden yola çıktı.","Ayşe kaybettiği anahtarı çantasının dibinde buldu.","Hafta sonu ailece sinemaya gitmeyi planlıyoruz.","Köpeğimiz kapının sesini duyunca hemen havladı.","Annem pazardan taze sebze ve meyve aldı.","Okulun bahçesine renkli çiçekler diktik.","Babam tamir ettiği saati duvara astı.","Mert yarışta ikinci olunca çok sevindi.","Kedi pencerede oturup dışarıyı seyretti.","Teneffüste arkadaşlarımla ip atladık.","Elif resim yarışmasında birincilik ödülü kazandı.","Yolda gördüğümüz yaşlı amcaya yardım ettik.","Deniz yüzme dersinde kulaç atmayı öğrendi.","Sabah kahvaltıda peynir, zeytin ve yumurta yedik.","Kardeşim uyumadan önce dişlerini fırçaladı.","Kuşlara balkonda küçük bir yemlik yaptık.","Müzik dersinde flüt çalmayı öğreniyoruz."], ["Öğretmenimiz yarın müzeye gideceğimizi ve yanımıza su almamızı söyledi.","Kırmızı bisikletli çocuk, yolda düşen yaşlı adama yardım etti.","Annem markete gitmeden önce buzdolabındaki eksikleri bir kâğıda yazdı.","Dün akşam izlediğimiz film o kadar komikti ki herkes kahkahalarla güldü.","Bahçedeki elma ağacının dalları rüzgârda kırılınca babam onları topladı.","Kayıp kediyi bulan çocuk, onu sahibine götürüp ödül almayı reddetti.","Hava kararmadan eve dönmemiz gerektiğini söyleyen annem bizi pencereden izledi.","Kütüphaneden aldığım kitabı okurken kardeşim yanıma gelip bana sorular sordu.","Sabah okula giderken yolda bulduğumuz küçük köpeğe su ve ekmek verdik.","Öğretmen sınıfa girince gürültü kesildi ve herkes defterini açtı.","Dedemin bahçesindeki kirazlar olgunlaşınca hep birlikte toplamaya gittik.","Yağmur çok şiddetli yağdığı için futbol maçı başka bir güne ertelendi.","Ayşe doğum günü için arkadaşlarına renkli davetiyeler hazırladı.","Kardeşim ödevini bitirmeden dışarı çıkmak istedi ama annem izin vermedi.","Parkta kaybolan çocuğu gören görevli, onu hemen annesinin yanına götürdü.","Pazar sabahı babamla balık tutmaya gittik ama hiç balık yakalayamadık.","Okul bahçesindeki fidanları her sabah sırayla sulamaya karar verdik.","Mert yeni aldığı kitabı bir günde bitirip arkadaşına ödünç verdi.","Annem kek yaparken ben de ona yumurtaları kırmakta yardım ettim.","Tren istasyona geç geldiği için dedemi yarım saat beklemek zorunda kaldık.","Elif resim dersinde çizdiği deniz manzarasını duvara astı.","Gece yarısı başlayan fırtına sabaha kadar devam etti ve ağaçları salladı.","Teneffüste oynadığımız oyunu kaybeden takım bir sonraki maçta kazanmaya çalıştı.","Deniz kenarında topladığımız kabukları kavanoza koyup eve getirdik.","Köpeğimiz topu getirmeyi öğrenince bütün gün bahçede onunla oynadık.","Sınıf başkanı seçilen Can, arkadaşlarına teşekkür etti.","Yaz tatilinde köye gidip dedemin ineklerini sağmayı öğrendim.","Hastaneye giden babamı beklerken annemle bulmaca çözdük.","Öğretmenimiz en güzel şiiri yazan öğrenciye bir kitap hediye etti.","Markete giderken yolda komşumuzla karşılaşıp bir süre sohbet ettik."], ["Kütüphaneden aldığım kitabı geri vermeyi unuttuğum için görevli bana nazikçe hatırlattı.","Tren istasyona geç geldiği için toplantıya yetişemeyen mühendis, yöneticisini telefonla aradı.","Okulun bahçesine dikilen fidanlar, öğrencilerin her hafta düzenli olarak sulamasıyla büyüdü.","Hava kararmadan eve dönmemizi isteyen annem, yine de bizi parkta biraz daha bekledi.","Yarışmayı kazanan takım, ödül olarak verilen kupayı okulun girişindeki dolaba koydu.","Arkadaşının doğum gününü unutan Ali, ertesi gün ona özür dileyerek küçük bir hediye verdi.","Sabah erkenden kalkıp otobüsü kaçırmamak için hızla hazırlanan Ayşe, çantasını evde unuttu.","Öğretmenimiz, projesini zamanında teslim edemeyen öğrencilere bir hafta daha süre verdi.","Dedemin anlattığı eski masalı dinlerken kardeşim koltukta uyuyakaldı ve biz onu yatağına taşıdık.","Fırtına yüzünden kapanan yolu açmaya çalışan görevliler, sabaha kadar kar küredi.","Kaybettiği köpeğini üç gün boyunca mahallede arayan Mert, onu sonunda parkın yanında buldu.","Bahçedeki kuş yuvasına dokunmamamızı tembihleyen annem, yavruların yakında uçacağını söyledi.","Yağmur dinince dışarı çıkan çocuklar, su birikintilerinde zıplayarak ayakkabılarını ıslattı.","Resim yarışmasına katılmak için haftalarca çalışan Elif, tablosunu son gün teslim edebildi.","Okul gezisinde müzeyi gezerken rehber bize eski çağlarda insanların nasıl yaşadığını anlattı.","Hastanede yatan komşumuzu ziyaret etmek için annemle birlikte ona çiçek ve meyve götürdük.","Deniz kenarında kumdan büyük bir kale yapan çocuklar, dalgalar gelince kaleyi korumaya çalıştı.","Her sabah erken kalkıp koşuya çıkan babam, bize de hafta sonları ona katılmamızı önerdi.","Kardeşim bisiklet sürmeyi öğrenirken birkaç kez düştü ama pes etmeden tekrar denedi.","Sınıfta okunan hikâyeyi dikkatle dinleyen öğrenciler, öğretmenin sorularını kolayca yanıtladı.","Pazar yerinde taze sebze alan annem, satıcıyla biraz pazarlık yaptıktan sonra hesabı ödedi.","Gece gökyüzündeki yıldızları seyrederken dedem bize takımyıldızların isimlerini öğretti.","Tatil için hazırladığımız bavulları arabaya yerleştirirken babam yol haritasını kontrol etti.","Okuldaki tiyatro gösterisinde başrol oynayan Can, repliklerini günlerce aynanın karşısında çalıştı.","Köyde tanıştığımız çoban, koyunlarını nasıl saydığını ve kurtlardan nasıl koruduğunu anlattı.","Yeni taşınan komşularımızı tanımak için annem bir tepsi börek yapıp onlara götürdü.","Kütüphanede bulduğu eski haritayı inceleyen Deniz, şehrin yıllar önce nasıl göründüğünü hayal etti.","Fırından yeni çıkan ekmeğin kokusu bütün sokağa yayılınca çocuklar birer dilim istedi.","Kar yağınca okulların tatil edildiğini öğrenen kardeşim, sevinçle kızağını almaya koştu.","Bahçedeki çiçeklerin solduğunu fark eden annem, onları her akşam düzenli olarak sulamaya başladı."] ] };
const sayBtn = (t) => `<button type="button" data-say="${t.replace(/"/g, "&quot;")}" style="border:2px solid var(--line);background:var(--panel);border-radius:12px;padding:4px 10px;font-size:18px;cursor:pointer;flex:none">🔊</button>`;
function chunkSeq(words){ const out = []; let i = 0; while(i < words.length){ const rem = words.length - i, sz = rem === 4 ? 2 : rem >= 3 ? 3 : rem; out.push(words.slice(i, i + sz)); i += sz; } return out; }
document.getElementById("board").addEventListener("click", (ev) => {
const sp = ev.target.closest("[data-say]"); if(sp && currentExercise().isAuditory){ sayTask(sp.dataset.say, 0.8); return; }
const b = ev.target.closest("[data-ck]"); if(!b) return; const ex = currentExercise(); if(!ex.ckScore) return;
const k = b.dataset.ck, cyc = ex.ckCycle || 2; ckMarks[k] = ((ckMarks[k] || 0) + 1) % cyc;
if(ex.id === "list-learn" && currentStageIndex === 0){ const L = currentGrid[0], d = delayGet("list"); if(!d || (d.A || []).join() !== L.A.join()) delaySet("list", { A: L.A, B: L.B }); }
setErrorCount(ex.ckScore()); renderBoard();
});

let mtState = null, mtTimers = [];
function mtClear(){ mtTimers.forEach(t => clearTimeout(t)); mtTimers = []; }
function mtLater(fn, ms){ const st = mtState; mtTimers.push(setTimeout(() => { if(mtState === st && timerRunning) fn(); }, ms * (window.__wmSpeed || 1))); }
function qzWarmup(id){ const st = mtState; if(!st || st.kind !== "quiz" || !Array.isArray(st.trials) || st.trials.length < 3 || st.warmN != null) return;
const N = st.trials.length, W = Math.max(1, Math.round(N * 0.3)), t = currentCombo().t; st.warmN = W;
if(t > 0){ const save = currentCombo; try{ currentCombo = () => Object.assign({}, save(), { t: t - 1 }); NEW_MT.build[id](); const E = (mtState && mtState.trials) || []; const sc = (q) => (String((q && (q.stim || q.prompt)) || "").replace(/<[^>]+>/g, " ").match(/[.!?](\s|$)/g) || []).length; const med = (A) => { const v = A.map(sc).sort((x, y) => x - y); return v.length ? v[Math.floor(v.length / 2)] : 0; }; if(E.length && med(E.slice(0, W)) === med(st.trials.slice(W))) for(let i = 0; i < W && i < E.length; i++) st.trials[i] = E[i];   /* soru biçimi (cümle sayısı) aynıysa alt düzeyden ısın; farklıysa (Zor: iki cümle) bu düzeyin sorularıyla ısın */ }catch(e){ console.error(e); } finally{ currentCombo = save; mtState = st; } } }
/* KURAL (otomatik hata, 2026-11-05): dokunmalı oyunlarda her yanlış dokunuş kendiliğinden sayılır ve kayda geçer — ısınma soruları dahil (önceden ısınmadaki yanlışlar sayılmıyordu, bu yüzden ilk 2–3 yanlış görünmüyordu) */
function mtErr(){ if(mtState && mtState.kind === "quiz" && mtState.warmN && mtState.ti < mtState.warmN){ mtState.warmErr = (mtState.warmErr || 0) + 1; mtState.wrong++; setErrorCount(currentErrorCount + 1); try{ vibrate(40); }catch(e){} gameSfx("wrong"); return; }
mtState.wrong++; setErrorCount(currentErrorCount + 1); try{ vibrate(60); }catch(e){} gameSfx("wrong"); }
function mtFinish(extra){
const st = mtState; st.phase = "done"; renderMtBoard(); stopTimer();
if(st.manual){ showLevelFlash("Bitti! Hata sayısını kontrol edin.", "levelup"); return; }   /* yetişkin Hata sayısı −/+ ile puanladı */
showLevelFlash((st.wrong ? `Bitti! ${st.wrong} hata.` : "Bitti! Hiç hata yok 🎉") + (extra || ""), st.wrong ? "down" : "levelup");
}
function mtBuild(){
const id = currentExercise().id, t = currentCombo().t, pre = isPre();
mtClear();
if(id === "corsi" || id === "corsi-verbal"){
const N = pre ? [5, 6, 6][Math.min(t, 2)] : 9;   // öncesi: 5 blok → 6 blok → 6 blok + 3'lük dizi
mtState = { kind: id, N, blocks: null, len: (pre ? [2, 3, 4] : [3, 4, 5])[t], maxLen: pre ? N : 9, tries: 0, okAtLen: 0, best: 0, wrong:0, phase:"idle", back: stIx() === 1, seq:[], pos:0, trials:0, maxTrials: (pre ? [4, 5, 6] : [6, 8, 10])[Math.min(t, 2)], manual: id === "corsi-verbal" };   /* uzmanla: sabit uzunluk, "Sonraki" + Hata sayısı */
return Array.from({length: 12}, () => ({}));
}
if(id === "span-touch"){
const sets = makeSpanSets(pre ? SPAN_COUNT_PRE[Math.min(t, 2)] : 3);
mtState = { kind:id, sets, si:0, ii:0, wrong:0, phase:"idle" };
return sets;
}
if(id === "lns-touch"){
const n = 4;
mtState = { kind:id, trials: Array.from({length:n}, () => makeLnsSeq(lnsLen())), ti:0, pos:0, wrong:0, phase:"idle", sorted: stIx() === 1 };
return mtState.trials;
}
if(id === "pal-touch"){
const K = (isPre() ? PAL_K.pre : PAL_K.post)[currentCombo().t];
const pairs = isPre() ? shuffleArray(palPairsPre()).slice(0, K) : palPairsPost(K);
mtState = { kind:id, pairs, cycle:0, cycles:3, wrong:0, phase:"idle", scores:[] };
return pairs;
}
if(id === "pic-seq-say" || id === "pic-seq-touch"){
const L = (isPre() ? [2, 3, 4] : [3, 4, 5])[currentCombo().t];
mtState = { kind: id === "pic-seq-say" ? "picsay" : "picseq", audio: id === "pic-seq-touch", trials: Array.from({length: isPre() ? 3 : 4}, () => shuffleArray(picPool()).slice(0, L)), ti:0, pos:0, wrong:0, phase:"idle" };
return mtState.trials;
}
if(NEW_MT.build[id]){ const r0 = NEW_MT.build[id](); try{ qzWarmup(id); }catch(e){ console.error(e); } return (mtState && mtState.trials) || r0; }
if(id === "running"){
const R = isPre() ? 3 : 4;
mtState = { kind:id, trials: Array.from({length:R}, () => makeRunStream()), ti:0, pos:0, wrong:0, phase:"idle", L: runLast() };
return mtState.trials;
}
if(id === "zihni"){
const R = isPre() ? 3 : 4;
mtState = { kind:id, rounds: Array.from({length:R}, () => makeZihniRound()), ri:0, wrong:0, phase:"idle", res:[] };
return mtState.rounds;
}
if(id === "market"){
mtState = { kind:id, rounds: Array.from({length:2}, () => makeMarketRound()), ri:0, wrong:0, phase:"idle", found:{}, res:[] };
return mtState.rounds;
}
const n = 4;
mtState = { kind:"animal-fruit", trials: Array.from({length:n}, () => { const L = [3, 4, 5][t]; const nA = Math.ceil(L / 2);
const a = shuffleArray(NB_ANIMALS).slice(0, nA).map(k => ({ k, g:"a", src: animalImg(k) })), f = shuffleArray(["apple","banana","grapes","strawberry","orange"]).slice(0, L - nA).map(k => ({ k, g:"f", src: FRUIT_VEG_IMAGES[k] }));
return shuffleArray(a.concat(f)); }), ti:0, pos:0, wrong:0, phase:"idle" };
return mtState.trials;
}
function mtStart(){ const st = mtState; if(!st || st.phase !== "idle") return;
if(st.kind === "corsi" || st.kind === "corsi-verbal") corsiTrial();
else if(st.kind === "span-touch") spanShow();
else if(st.kind === "running") runShow();
else if(st.kind === "pal-touch") palStudy();
else if(NEW_MT.start[st.kind]) NEW_MT.start[st.kind]();
else if(st.kind === "zihni") zhShow();
else if(st.kind === "market") mkShow();
else seqShow();
}
function palStudy(){
const st = mtState; st.phase = "study"; st.si = -1; renderMtBoard();
const step = isPre() ? 2600 : 2200;
const strat = false, stp = step;
st.pairs.forEach((p, k) => mtLater(() => { st.si = k; renderMtBoard(); sayTask(strat ? `${p.a.n} ile ${p.b.n}. İkisini birlikte hayal et.` : `${p.a.n}, ${p.b.n}`); }, 300 + k * stp));
mtLater(() => palTest(), 300 + st.pairs.length * stp + 200);
}
function palTest(){
const st = mtState; st.order = shuffleArray(st.pairs.map((p, i) => i)); st.qi = 0; st.cycleOk = 0; palAsk();
}
function palAsk(){
const st = mtState, p = st.pairs[st.order[st.qi]];
const others = shuffleArray(st.pairs.filter(x => x !== p).map(x => x.b));
const fill = shuffleArray(picPool()).filter(x => !st.pairs.some(q => q.b.src === x.src || q.a.src === x.src)).map(x => ({ src:x.src, n:x.n }));
st.opts = shuffleArray([p.b].concat(others.slice(0, 3), fill).slice(0, 4)); st.ans = p.b; st.pick = null; st.phase = "ask"; renderMtBoard();
}
function palTap(i){
const st = mtState; if(st.phase !== "ask") return;
const ok = st.opts[i] === st.ans; st.pick = i; st.phase = "fb"; if(ok){ st.cycleOk++; gameSfx("correct"); } else mtErr(); renderMtBoard();
mtLater(() => {
st.qi++;
if(st.qi < st.order.length){ palAsk(); return; }
st.scores.push(st.cycleOk); st.cycle++;
const perfect = st.cycleOk === st.pairs.length;
if(st.cycle >= st.cycles || (perfect && st.cycle >= 2)){ mtFinish(` Öğrenme: ${st.scores.map((x, k) => `${k + 1}. tur ${x}/${st.pairs.length}`).join(" → ")}`); return; }
showLevelFlash(`${st.cycle}. tur: ${st.cycleOk}/${st.pairs.length}. Şimdi çiftleri bir kez daha izle.`, perfect ? "levelup" : "down");
palStudy();
}, ok ? 500 : 1100);
}
function runShow(){
const st = mtState, items = st.trials[st.ti];
st.phase = "show"; st.showIdx = -1; st.pos = 0; st.marks = {}; renderMtBoard();
const step = isPre() ? 1300 : 1000;
items.forEach((x, k) => mtLater(() => { st.showIdx = k; renderMtBoard(); gameSfx("pop"); }, 400 + k * step));
mtLater(() => {
const last = items.slice(-st.L), earlier = items.slice(0, -st.L);
const extra = shuffleArray(earlier).slice(0, isPre() ? 2 : 3).concat(shuffleArray(picPool().filter(p => !items.some(x => x.k === p.k))).slice(0, 1));
st.options = shuffleArray(last.concat(extra)); st.target = last; st.showIdx = -1; st.phase = "input"; renderMtBoard();
if(gameMode) speakText(`Son ${st.L} resme sırayla dokun.`);
}, 400 + items.length * step + 200);
}
function runTap(i){
const st = mtState; if(st.phase !== "input") return;
if(st.options[i] === st.target[st.pos] && !st.marks[i]){ st.marks[i] = "ok"; st.pos++; gameSfx("correct"); renderMtBoard(); if(st.pos >= st.target.length){ st.phase = "fb"; mtLater(runNext, 600); } }
else { st.marks[i] = "bad"; mtErr(); st.reveal = true; st.phase = "fb"; renderMtBoard(); mtLater(() => { st.reveal = false; runNext(); }, 1300); }
}
function runNext(){ const st = mtState; st.ti++; if(st.ti >= st.trials.length){ mtFinish(); return; } runShow(); }
function zhShow(){
const st = mtState, r = st.rounds[st.ri];
st.phase = "start"; st.cmdIdx = -1; st.pick = null; renderMtBoard();
const step = isPre() ? 1600 : 1300;
mtLater(() => { st.phase = "cmds"; renderMtBoard(); }, 1400);
r.cmds.forEach((d, k) => mtLater(() => { st.cmdIdx = k; renderMtBoard(); gameSfx("pop"); if(!isPre()) speakText(`${ZH_DIRS[d].w} bir`); }, 1400 + 300 + k * step));
mtLater(() => { st.cmdIdx = -1; st.phase = "input"; renderMtBoard(); if(gameMode) speakText("Zihni şimdi nerede? Dokun."); }, 1400 + 300 + r.cmds.length * step + 200);
}
function zhTap(i){
const st = mtState; if(st.phase !== "input") return;
const r = st.rounds[st.ri], ok = i === r.ey * r.n + r.ex;
st.pick = i; st.res[st.ri] = ok; st.phase = "reveal"; if(ok) gameSfx("correct"); else mtErr(); renderMtBoard();
mtLater(() => { st.ri++; if(st.ri >= st.rounds.length){ mtFinish(); return; } zhShow(); }, ok ? 900 : 1500);
}
function mkShow(){
const st = mtState, r = st.rounds[st.ri];
st.phase = "list"; st.found = {}; st.marks = {}; renderMtBoard();
if(gameMode) speakText("Listeyi aklında tut: " + r.list.map(x => x.n).join(", "));
const ms = (isPre() ? 1800 : 1400) * r.list.length + 800;
mtLater(() => { st.phase = "distract"; st.balloons = Array.from({length:6}, (_, i) => ({ i, popped:false, c: randomItem(["#FF6B6B","#4DABF7","#FFD43B","#69DB7C","#B197FC","#FFA94D"]) })); renderMtBoard(); if(gameMode) speakText("Şimdi balonları patlat!"); }, ms);
}
function mkPop(i){
const st = mtState; if(st.phase !== "distract") return;
if(st.balloons[i].popped) return; st.balloons[i].popped = true; gameSfx("pop"); renderMtBoard();
if(st.balloons.every(b => b.popped)){ st.phase = "shop"; renderMtBoard(); if(gameMode) speakText("Şimdi listedekileri raftan seç."); }
}
function mkTap(i){
const st = mtState; if(st.phase !== "shop") return;
const r = st.rounds[st.ri], it = r.shelf[i]; if(st.marks[i]) return;
if(r.list.includes(it)){ st.marks[i] = "ok"; gameSfx("correct"); } else { st.marks[i] = "bad"; mtErr(); st.roundBad = (st.roundBad || 0) + 1; }
renderMtBoard();
if(r.list.every(x => st.marks[r.shelf.indexOf(x)] === "ok")){ st.res[st.ri] = !st.roundBad; st.roundBad = 0; st.phase = "fb"; mtLater(() => { st.ri++; if(st.ri >= st.rounds.length){ mtFinish(); return; } mkShow(); }, 800); }
}
function corsiLayout(){
const st = mtState; if(st.blocks) return;
const pts = []; let g = 0;
while(pts.length < st.N && g < 4000){ g++; const x = 0.06 + Math.random() * 0.76, y = 0.06 + Math.random() * 0.76;
if(pts.every(p => Math.abs(p.x - x) > 0.2 || Math.abs(p.y - y) > 0.2)) pts.push({ x, y }); }
st.blocks = pts;
}
function corsiTrial(){
const st = mtState; corsiLayout();
st.seq = []; while(st.seq.length < st.len){ const i = Math.floor(Math.random() * st.N); if(!st.seq.includes(i)) st.seq.push(i); }
st.pos = 0; st.marks = {}; st.phase = "show"; st.lit = null; renderMtBoard();
const on = isPre() ? 900 : 750, off = 300;
st.seq.forEach((bi, k) => {
mtLater(() => { st.lit = bi; renderMtBoard(); gameSfx("pop"); }, 600 + k * (on + off));
mtLater(() => { st.lit = null; renderMtBoard(); }, 600 + k * (on + off) + on);
});
mtLater(() => { st.phase = st.kind === "corsi" ? "input" : "judge"; renderMtBoard(); }, 600 + st.seq.length * (on + off) + 100);
}
function corsiResult(ok){
const st = mtState; st.trials++; st.tries++;
if(ok){ st.okAtLen++; st.best = Math.max(st.best, st.len); gameSfx("correct"); } else mtErr();
st.phase = "between"; renderMtBoard();
mtLater(() => {
if(st.tries >= 2){
if(st.okAtLen === 0 || st.len >= st.maxLen){ mtFinish(` En uzun dizi: ${st.best || "—"}`); return; }
st.len++; st.tries = 0; st.okAtLen = 0;
}
corsiTrial();
}, 700);
}
function corsiVerbalNext(){ const st = mtState; st.trials++; st.phase = "between"; renderMtBoard(); mtLater(() => { if(st.trials >= st.maxTrials){ mtFinish(); return; } corsiTrial(); }, 500); }
function corsiTap(i){
const st = mtState; if(st.phase !== "input") return;
const order = st.back ? st.seq.slice().reverse() : st.seq;
if(order[st.pos] === i){ st.marks = {}; st.marks[i] = "ok"; st.pos++; renderMtBoard(); if(st.pos >= order.length) corsiResult(true); }
else { st.marks = {}; st.marks[i] = "bad"; renderMtBoard(); corsiResult(false); }
}
function spanShow(){
const st = mtState, set = st.sets[st.si], it = set.items[st.ii];
st.phase = "judge"; st.flash = ""; renderMtBoard();
speakText(it.truth ? it.b.bt : it.b.bf);
}
function spanJudge(yes){
const st = mtState; if(st.phase !== "judge") return;
const it = st.sets[st.si].items[st.ii], ok = (yes === 1) === it.truth;
st.flash = ok ? "ok" : "bad"; if(ok) gameSfx("correct"); else mtErr();
st.phase = "fb"; renderMtBoard();
mtLater(() => {
st.ii++;
if(st.ii < st.sets[st.si].items.length){ spanShow(); return; }
const set = st.sets[st.si], tg = set.items.map(x => x.b);
const dis = shuffleArray(SPAN_BANK.filter(b => !tg.includes(b))).slice(0, isPre() ? 2 : 3);
st.options = shuffleArray(tg.concat(dis)); st.pos = 0; st.marks = {}; st.phase = "recall"; renderMtBoard();
speakText("Şimdi gördüğün resimlere sırayla dokun.");
}, ok ? 450 : 750);
}
function spanTap(i){
const st = mtState; if(st.phase !== "recall") return;
const order = st.sets[st.si].items.map(x => x.b);
if(st.options[i] === order[st.pos]){ st.marks[i] = "ok"; st.pos++; gameSfx("correct"); renderMtBoard(); if(st.pos >= order.length) spanNextSet(); }
else { st.marks[i] = "bad"; mtErr(); st.reveal = true; renderMtBoard(); st.phase = "fb"; mtLater(() => { st.reveal = false; spanNextSet(); }, 1100); }
}
function spanNextSet(){ const st = mtState; st.phase = "fb"; mtLater(() => { st.si++; st.ii = 0; if(st.si >= st.sets.length){ mtFinish(); return; } spanShow(); }, 600); }
function seqShow(){
const st = mtState, items = st.trials[st.ti];
st.phase = "show"; st.showIdx = -1; st.pos = 0; st.marks = {}; renderMtBoard();
const step = isPre() ? 1300 : 1100;
if(st.kind === "lns-touch") speakText(items.join(", "), { rate: 0.85 });
items.forEach((x, k) => { mtLater(() => { st.showIdx = k; renderMtBoard(); if(st.audio) sayTask(x.n); }, 400 + k * (st.audio ? step + 300 : step)); });
mtLater(() => { st.showIdx = -1; st.phase = st.kind === "picsay" ? "judge" : "input"; st.keys = shuffleArray(items.map((x, i) => i)); renderMtBoard(); }, 400 + items.length * (st.audio ? step + 300 : step) + 300);
}
function seqTarget(){
const st = mtState, items = st.trials[st.ti];
if(st.kind === "lns-touch") return lnsAnswer(items, st.sorted);
if(st.kind === "picseq" || st.kind === "picsay") return items.slice();
return items.filter(x => x.g === "a").concat(items.filter(x => x.g === "f"));
}
function seqTap(i){
const st = mtState; if(st.phase !== "input") return;
const items = st.trials[st.ti], want = seqTarget()[st.pos], got = items[i];
const same = st.kind === "lns-touch" ? got === want : got === want;
if(same && !st.marks[i]){ st.marks[i] = "ok"; st.pos++; gameSfx("correct"); renderMtBoard(); if(st.pos >= items.length){ st.phase = "fb"; mtLater(seqNext, 600); } }
else { st.marks[i] = "bad"; mtErr(); st.reveal = true; st.phase = "fb"; renderMtBoard(); mtLater(() => { st.reveal = false; seqNext(); }, 1300); }
}
function seqNext(){ const st = mtState; st.ti++; if(st.ti >= st.trials.length){ mtFinish(); return; } seqShow(); }

function renderMtBoard(){ try{ const st = mtState; if(st && (st.kind === "quiz" || st.kind === "wseen" || st.kind === "bag") && !st._balanced && Array.isArray(st.trials)){ const exId = (currentExercise() || {}).id; if(st.kind === "quiz") qzDedupe(st, exId); qzBalancePos(st.trials, exId); if(st.kind === "quiz" && !["syl-touch","sem-decide","absurd-touch","rhyme-touch","sent-verify","arrow-touch","balance"].includes(exId)) qzBalanceNum(st.trials); if(st.kind === "quiz"){ qzBreakRuns(st.trials, st.warmN || 0); qzFixRuns(st, exId); } st._balanced = true; } }catch(e){} /* soru düzeni dengeleme (eski sarmalayıcı, 7. adımda içeri alındı) */  zaFitReset(); try{
const board = document.getElementById("board");
board.style.display = "block"; board.style.minHeight = ""; board.style.padding = landscapeMQ.matches ? "6px 8px" : "12px";
board.style.gridTemplateColumns = ""; board.style.gridTemplateRows = ""; board.classList.remove("wide-grid");
if(!mtState) return;
const st = mtState, isLs = landscapeMQ.matches;
const W = (board.clientWidth || 360) - 24, H = isLs ? Math.max((board.clientHeight || 280), Math.floor(window.innerHeight - board.getBoundingClientRect().top - 8)) - 60 : Math.min(460 * tabletScale(), window.innerHeight - 330); /* KURAL (yatay ekran, 2026-11-07): yatay ekranda tahta yüksekliği, tahtanın o anki içeriğine göre değil ekranda kalan yere göre hesaplanır — önceden küçük içerik küçük tahta, küçük tahta küçük içerik doğuruyordu (resimler 12–40 px kalıyordu) */
let info = "", body = "";
if(st.kind === "corsi" || st.kind === "corsi-verbal"){
corsiLayout();
const area = Math.min(W, isLs ? (st.kind === "corsi-verbal" && st.phase === "judge" ? H - 112 : H) : 420 * tabletScale()) * (window._fitK || 1), bs = Math.round(area * 0.15);
info = st.phase === "idle" ? "▶ Başlat'a bas" : st.phase === "show" ? "<b>İzle…</b>" : st.phase === "input" ? `<b>${st.back ? "Tersten" : "Aynı sırayla"}</b> dokun · ${st.pos}/${st.seq.length}` : st.phase === "judge" ? `Çocuk sırayı ${st.back ? "<b>tersten</b>" : ""} söylesin / göstersin:` : st.phase === "done" ? (st.manual ? `Bitti · ${st.len}'lü diziler · hatalar Hata sayısında` : `Bitti · en uzun dizi <b>${st.best || "—"}</b>`) : `Dizi uzunluğu: <b>${st.len}</b>`;
body = `<div style="position:relative;width:${area}px;height:${area}px;margin:0 auto;background:#EEF2F6;border-radius:18px;">` + st.blocks.map((p, i) => {
const lit = st.lit === i, mk = st.marks && st.marks[i];
const bg = lit ? "#FFC21A" : mk === "ok" ? "#1FA463" : mk === "bad" ? "#E5484D" : "#2E6FD8";
const num = st.kind === "corsi-verbal" ? `<span style="color:#fff;font-weight:900;font-size:${Math.round(bs * 0.42)}px">${i + 1}</span>` : "";
return `<div data-mt="${i}" style="position:absolute;left:${(p.x * area).toFixed(0)}px;top:${(p.y * area).toFixed(0)}px;width:${bs}px;height:${bs}px;border-radius:10px;background:${bg};box-shadow:0 4px 0 rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .1s">${num}</div>`; }).join("") + `</div>`;
if(st.kind === "corsi-verbal" && st.phase === "judge"){
const order = st.back ? st.seq.slice().reverse() : st.seq;
body += `<div class="aud-key" style="text-align:center;margin-top:8px">Doğru cevap: <b>${order.map(i => i + 1).join(" – ")}</b> · dizi <b>${st.trials + 1}/${st.maxTrials}</b></div><div class="aud-key" style="text-align:center">Yetişkin: dizi yanlışsa <b>Hata sayısı +</b></div><div class="wm-btns" style="margin:6px auto 0"><button type="button" class="wm-btn same" data-judge="9">Sonraki ▶</button></div>`;
}
} else if(st.kind === "span-touch"){
const set = st.sets[st.si] || st.sets[0], it = set.items[Math.min(st.ii, set.items.length - 1)];
const dots = `<div class="wm-dots">${st.sets.map((x, i) => `<i class="${i < st.si ? "on" : ""}"></i>`).join("")}</div>`;
if(st.phase === "idle"){ info = "▶ Başlat'a bas"; body = dots; }
else if(st.phase === "done"){ info = "Bitti!"; body = dots; }
else if(st.phase === "recall" || (st.phase === "fb" && st.options && st.ii >= set.items.length)){
info = `<b>Gördüğün resimlere sırayla dokun</b> · ${st.pos}/${set.items.length}`;
const d = wmGridDims(st.options.length, W, H, 96);
const order = set.items.map(x => x.b);
body = dots + `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + st.options.map((b, i) => {
const mk = st.marks[i] || (st.reveal && order.includes(b) ? "ok" : "");
const num = st.reveal && order.includes(b) ? `<span class="num">${order.indexOf(b) + 1}</span>` : "";
return `<div class="wm-pic${mk ? " " + mk : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;">${imgTag(b.img())}${num}</div>`; }).join("") + `</div>`;
} else {
info = `Cümle ${st.ii + 1} / ${set.items.length} · <b>doğru mu?</b>`;
const sz = Math.min(isLs ? H - 10 : 200, W * (isLs ? 0.4 : 0.6));
const cardHtml = `<div class="wm-card ${st.flash || ""}" style="width:${sz}px;height:${sz}px;flex:none">${imgTag(it.b.img())}</div>`;
const ctrl = `<div style="font-size:13px;color:var(--ink-soft);text-align:center;min-height:18px">${document.documentElement.classList.contains("show-span-text") ? (it.truth ? it.b.bt : it.b.bf) : ""}</div>` +
`<div class="wm-btns"><button type="button" class="wm-btn same" data-judge="1" ${st.phase === "judge" ? "" : "disabled"}>✓ Doğru</button><button type="button" class="wm-btn diff" style="background:#E5484D;box-shadow:0 5px 0 #A9262B" data-judge="0" ${st.phase === "judge" ? "" : "disabled"}>✗ Yanlış</button></div>` +
`<div style="display:flex;gap:8px;justify-content:center"><button type="button" class="gb-btn" data-speak="1">🔊 Tekrar dinle</button><button type="button" class="gb-btn" data-showtext="1">Aa Metni göster</button></div>`;
if(isLs){ body = dots + `<div style="display:flex;gap:18px;align-items:center;justify-content:center;width:100%">${cardHtml}<div style="display:flex;flex-direction:column;gap:10px;flex:1;max-width:420px">${ctrl}</div></div>`; }
else body = dots + cardHtml +
`<div style="font-size:13px;color:var(--ink-soft);text-align:center;min-height:18px">${document.documentElement.classList.contains("show-span-text") ? (it.truth ? it.b.bt : it.b.bf) : ""}</div>` +
`<div class="wm-btns"><button type="button" class="wm-btn same" data-judge="1" ${st.phase === "judge" ? "" : "disabled"}>✓ Doğru</button><button type="button" class="wm-btn diff" style="background:#E5484D;box-shadow:0 5px 0 #A9262B" data-judge="0" ${st.phase === "judge" ? "" : "disabled"}>✗ Yanlış</button></div>` +
`<div style="display:flex;gap:8px;justify-content:center"><button type="button" class="gb-btn" data-speak="1">🔊 Tekrar dinle</button><button type="button" class="gb-btn" data-showtext="1">Aa Metni göster</button></div>`;
}
} else if(st.kind === "pal-touch"){
const dots = `<div class="wm-dots">${Array.from({length:st.cycles}, (_, i) => `<i class="${i < st.scores.length ? (st.scores[i] === st.pairs.length ? "on" : "off") : ""}"></i>`).join("")}</div>`;
if(st.phase === "idle"){ info = "▶ Başlat'a bas"; body = dots; }
else if(st.phase === "done"){ info = `Bitti · ${st.scores.map((x, k) => `${k + 1}. tur ${x}/${st.pairs.length}`).join(" → ")}`; body = dots; }
else if(st.phase === "study"){
const p = st.pairs[st.si];
info = `<b>${st.cycle + 1}. tur</b> · çiftleri aklında tut`;
const sz = Math.min(isLs ? H - 75 : 150, (W - 60) / 2);
body = dots + (p ? `<div style="display:flex;align-items:center;gap:10px;justify-content:center"><div class="wm-card" style="width:${sz}px;height:${sz}px">${imgTag(p.a.src)}</div><span style="font-size:30px;font-weight:900;color:var(--teal-dark)">＋</span><div class="wm-card" style="width:${sz}px;height:${sz}px">${imgTag(p.b.src)}</div></div><div style="font-weight:900;font-size:18px">${p.a.n} – ${p.b.n}</div>${currentStageIndex === 1 ? `<div style="font-weight:800;color:#B07D00;margin-top:2px">💡 İkisini birlikte hayal et</div>` : ""}` : "");
} else {
const p = st.pairs[st.order[st.qi]];
info = `<b>Eşi hangisiydi?</b> · ${st.qi + 1}/${st.order.length}`;
const cue = Math.min(isLs ? H * 0.45 : 130, W * 0.4);
const d = wmGridDims(4, isLs ? W * 0.55 : W, isLs ? H - 20 : H - cue - 40, 100);
const grid = `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + st.opts.map((o, i) => {
const mk = st.phase === "fb" ? (o === st.ans ? "ok" : (i === st.pick ? "bad" : "")) : "";
return `<div class="wm-pic${mk ? " " + mk : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;">${imgTag(o.src)}</div>`; }).join("") + `</div>`;
const cueHtml = `<div class="wm-card" style="width:${cue}px;height:${cue}px;border-color:var(--teal)">${imgTag(p.a.src)}</div>`;
body = dots + (isLs ? `<div style="display:flex;gap:16px;align-items:center;justify-content:center">${cueHtml}${grid}</div>` : cueHtml + grid);
}
} else if(st.kind === "quiz"){
const r = qzRender(st, W, H, isLs); info = r.info; body = r.body;
} else if(NEW_MT_KINDS.includes(st.kind)){
const r = NEW_MT.render(st, W, H, isLs); info = r.info; body = r.body;
} else if(st.kind === "picsay" && st.phase === "judge"){
const items = st.trials[st.ti];
info = "Çocuk resimlerin adlarını <b>sırayla</b> söylesin:";
body = `<div class="wm-dots">${st.trials.map((x, i) => `<i class="${i < st.ti ? "on" : ""}"></i>`).join("")}</div><div class="aud-key" style="text-align:center;font-size:17px">Doğru cevap: <b>${items.map(x => x.n).join(" – ")}</b></div><div class="aud-key" style="text-align:center;margin-top:6px">Yetişkin: sıra yanlışsa <b>Hata sayısı +</b></div><div class="wm-btns" style="margin:6px auto 0"><button type="button" class="wm-btn same" data-judge="9">Sonraki ▶</button></div>`;
} else if(st.kind === "running"){
const items = st.trials[Math.min(st.ti, st.trials.length - 1)];
const dots = `<div class="wm-dots">${st.trials.map((x, i) => `<i class="${i < st.ti ? "on" : ""}"></i>`).join("")}</div>`;
if(st.phase === "idle"){ info = "▶ Başlat'a bas"; body = dots; }
else if(st.phase === "done"){ info = "Bitti!"; body = dots; }
else if(st.phase === "show"){ info = "<b>İzle…</b> (ne zaman biteceği belli değil)"; const sz = Math.min(isLs ? H - 30 : 180, W * 0.55); body = dots + `<div class="wm-card" style="width:${sz}px;height:${sz}px;">${st.showIdx >= 0 ? imgTag(items[st.showIdx].src) : ""}</div>`; }
else {
info = `<b>Son ${st.L}</b> resme sırayla dokun · ${st.pos}/${st.L}`;
const d = wmGridDims(st.options.length, W, isLs ? H - 30 : H, 96);
body = dots + `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + st.options.map((o, i) => {
const inT = st.target.indexOf(o), mk = st.marks[i] || (st.reveal && inT >= 0 ? "ok" : "");
return `<div class="wm-pic${mk ? " " + mk : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;">${imgTag(o.src)}${st.reveal && inT >= 0 ? `<span class="num">${inT + 1}</span>` : ""}</div>`; }).join("") + `</div>`;
}
} else if(st.kind === "zihni"){
const r = st.rounds[Math.min(st.ri, st.rounds.length - 1)], n = r.n;
const dots = `<div class="wm-dots">${st.rounds.map((x, i) => `<i class="${st.res[i] === true ? "on" : st.res[i] === false ? "off" : ""}"></i>`).join("")}</div>`;
const area = Math.min(W, isLs ? H - 20 : 320 * tabletScale()) * (window._fitK || 1), cell = Math.floor((area - (n - 1) * 6) / n);
const showZ = st.phase === "start" ? r.sy * n + r.sx : st.phase === "reveal" ? r.ey * n + r.ex : -1;
const cmd = st.phase === "cmds" && st.cmdIdx >= 0 ? r.cmds[st.cmdIdx] : null;
info = st.phase === "idle" ? "▶ Başlat'a bas" : st.phase === "start" ? "<b>Zihni burada.</b> Aklında tut…" : st.phase === "cmds" ? `Komut ${Math.max(1, st.cmdIdx + 1)} / ${r.cmds.length}` : st.phase === "input" ? "<b>Zihni şimdi nerede?</b> Dokun." : st.phase === "done" ? "Bitti!" : "";
const grid = `<div class="wm-grid" style="grid-template-columns:repeat(${n}, ${cell}px);gap:6px;">` + Array.from({length:n * n}, (_, i) => {
const mk = st.phase === "reveal" && st.pick === i ? (i === r.ey * n + r.ex ? "ok" : "bad") : "";
return `<div class="wm-pic${mk ? " " + mk : ""}" data-mt="${i}" style="width:${cell}px;height:${cell}px;border-radius:14px;">${showZ === i ? `<div style="width:80%;height:80%">${mascotSVG(st.phase === "reveal" ? "cheer" : "happy")}</div>` : ""}</div>`; }).join("") + `</div>`;
const cmdBox = `<div style="min-height:64px;display:flex;align-items:center;justify-content:center;gap:12px">${cmd ? `<span style="font-size:52px;font-weight:900;color:var(--teal-dark);line-height:1">${ZH_DIRS[cmd].a}</span>${isPre() ? "" : `<span style="font-size:26px;font-weight:900;color:var(--ink)">${ZH_DIRS[cmd].w} 1</span>`}` : ""}</div>`;
body = dots + (isLs ? `<div style="display:flex;gap:18px;align-items:center;justify-content:center">${grid}${cmdBox}</div>` : cmdBox + grid);
} else if(st.kind === "market"){
const r = st.rounds[Math.min(st.ri, st.rounds.length - 1)];
const dots = `<div class="wm-dots">${st.rounds.map((x, i) => `<i class="${st.res[i] === true ? "on" : st.res[i] === false ? "off" : ""}"></i>`).join("")}</div>`;
if(st.phase === "idle"){ info = "▶ Başlat'a bas"; body = dots; }
else if(st.phase === "done"){ info = "Bitti!"; body = dots; }
else if(st.phase === "list"){
info = "<b>Alışveriş listesi</b> · aklında tut";
const d = wmGridDims(r.list.length, W, isLs ? H - 75 : H * 0.7, isLs ? 80 : 96);
body = dots + `<div style="background:#FFFDF2;border:2px dashed #E0C97A;border-radius:18px;padding:10px"><div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + r.list.map(x => `<div style="display:flex;flex-direction:column;align-items:center;width:${d.cell}px"><div class="wm-pic" style="width:${d.cell}px;height:${d.cell}px;cursor:default">${imgTag(x.src)}</div><b style="font-size:14px;margin-top:2px">${x.n}</b></div>`).join("") + `</div></div>`;
} else if(st.phase === "distract"){
info = "<b>Balonların hepsini patlat!</b>";
const d = wmGridDims(6, W, isLs ? H - 20 : 260, 90);
body = dots + `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + st.balloons.map(bl => `<div data-mt="${bl.i}" style="width:${d.cell}px;height:${d.cell}px;display:flex;align-items:center;justify-content:center;cursor:pointer">${bl.popped ? `<span style="font-size:${Math.round(d.cell * 0.4)}px">💥</span>` : `<svg viewBox="0 0 60 80" style="width:70%;height:90%"><ellipse cx="30" cy="30" rx="24" ry="28" fill="${bl.c}"/><ellipse cx="22" cy="20" rx="6" ry="9" fill="#fff" opacity=".45"/><path d="M30 58 l-4 6 h8z" fill="${bl.c}"/><path d="M30 64 q-6 8 0 14" stroke="#888" fill="none" stroke-width="1.5"/></svg>`}</div>`).join("") + `</div>`;
} else {
const got = r.list.filter(x => st.marks[r.shelf.indexOf(x)] === "ok").length;
info = `<b>Listedekileri raftan seç</b> · ${got}/${r.list.length}`;
const d = wmGridDims(r.shelf.length, W, isLs ? H - 20 : H, 92);
body = dots + `<div style="background:linear-gradient(#F3E3C3 0 0) bottom/100% 6px no-repeat;padding-bottom:8px"><div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + r.shelf.map((x, i) => `<div class="wm-pic${st.marks[i] ? " " + st.marks[i] : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;">${imgTag(x.src)}</div>`).join("") + `</div></div>`;
}
} else {
const items = st.trials[Math.min(st.ti, st.trials.length - 1)], isL = st.kind === "lns-touch";
const face = (x) => isL ? `<span style="font-size:34px;font-weight:900;color:var(--ink)">${x}</span>` : imgTag(x.src);
const dots = `<div class="wm-dots">${st.trials.map((x, i) => `<i class="${i < st.ti ? "on" : ""}"></i>`).join("")}</div>`;
if(st.phase === "idle"){ info = "▶ Başlat'a bas"; body = dots; }
else if(st.phase === "done"){ info = "Bitti!"; body = dots; }
else if(st.phase === "show"){
info = isL ? "<b>Dinle ve izle…</b>" : st.audio ? "<b>Dinle…</b>" : "<b>İyi bak…</b>";
const sz = Math.min(isLs ? H - 30 : 180, W * 0.55);
body = dots + (st.audio ? SPEAKER_HTML(true) : `<div class="wm-card" style="width:${sz}px;height:${sz}px;">${st.showIdx >= 0 ? face(items[st.showIdx]) : ""}</div>`);
} else {
const tgt = seqTarget();
info = isL ? (st.sorted ? "Önce sayılar <b>küçükten büyüğe</b>, sonra harfler <b>alfabe sırasıyla</b>" : "Önce <b>sayılara</b>, sonra <b>harflere</b> dokun (duyduğun sırayla)") : st.kind === "picseq" ? "Resimlere <b>duyduğun sırayla</b> dokun" : "Önce <b>hayvanlara</b>, sonra <b>meyvelere</b> dokun (gördüğün sırayla)";
const d = wmGridDims(items.length, W, isLs ? H - 45 : H, isL ? 84 : 100);
body = dots + `<div class="wm-info">${st.pos}/${items.length}</div><div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + st.keys.map(i => {
const mk = st.marks[i] || (st.reveal ? "ok" : "");
const num = st.reveal ? `<span class="num">${tgt.indexOf(items[i]) + 1}</span>` : "";
return `<div class="wm-pic${mk ? " " + mk : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;">${face(items[i])}${num}</div>`; }).join("") + `</div>`;
}
}
board.innerHTML = `<div class="wm-wrap"><div class="wm-info">${info}</div>${body}</div>`;
}finally{ try{ zaPicGrow(renderMtBoardCore, this, arguments); }catch(e){} try{ zaTapRestore(); }catch(e){}  try{ const b = document.getElementById("board"); if(b){ emojiFix(b); emojiStrip(b); } }catch(e){} syncJudgePause(); try{ zaFitBoardContent(); requestAnimationFrame(zaFitBoardContent); }catch(e){} } }
/* zaPicGrow için kancasız yeniden çizim (sarmalayıcıların kaldırılması, 2026-11-09) */
function renderMtBoardCore(){
const board = document.getElementById("board");
board.style.display = "block"; board.style.minHeight = ""; board.style.padding = landscapeMQ.matches ? "6px 8px" : "12px";
board.style.gridTemplateColumns = ""; board.style.gridTemplateRows = ""; board.classList.remove("wide-grid");
if(!mtState) return;
const st = mtState, isLs = landscapeMQ.matches;
const W = (board.clientWidth || 360) - 24, H = isLs ? Math.max((board.clientHeight || 280), Math.floor(window.innerHeight - board.getBoundingClientRect().top - 8)) - 60 : Math.min(460 * tabletScale(), window.innerHeight - 330); /* KURAL (yatay ekran, 2026-11-07): yatay ekranda tahta yüksekliği, tahtanın o anki içeriğine göre değil ekranda kalan yere göre hesaplanır — önceden küçük içerik küçük tahta, küçük tahta küçük içerik doğuruyordu (resimler 12–40 px kalıyordu) */
let info = "", body = "";
if(st.kind === "corsi" || st.kind === "corsi-verbal"){
corsiLayout();
const area = Math.min(W, isLs ? (st.kind === "corsi-verbal" && st.phase === "judge" ? H - 112 : H) : 420 * tabletScale()) * (window._fitK || 1), bs = Math.round(area * 0.15);
info = st.phase === "idle" ? "▶ Başlat'a bas" : st.phase === "show" ? "<b>İzle…</b>" : st.phase === "input" ? `<b>${st.back ? "Tersten" : "Aynı sırayla"}</b> dokun · ${st.pos}/${st.seq.length}` : st.phase === "judge" ? `Çocuk sırayı ${st.back ? "<b>tersten</b>" : ""} söylesin / göstersin:` : st.phase === "done" ? (st.manual ? `Bitti · ${st.len}'lü diziler · hatalar Hata sayısında` : `Bitti · en uzun dizi <b>${st.best || "—"}</b>`) : `Dizi uzunluğu: <b>${st.len}</b>`;
body = `<div style="position:relative;width:${area}px;height:${area}px;margin:0 auto;background:#EEF2F6;border-radius:18px;">` + st.blocks.map((p, i) => {
const lit = st.lit === i, mk = st.marks && st.marks[i];
const bg = lit ? "#FFC21A" : mk === "ok" ? "#1FA463" : mk === "bad" ? "#E5484D" : "#2E6FD8";
const num = st.kind === "corsi-verbal" ? `<span style="color:#fff;font-weight:900;font-size:${Math.round(bs * 0.42)}px">${i + 1}</span>` : "";
return `<div data-mt="${i}" style="position:absolute;left:${(p.x * area).toFixed(0)}px;top:${(p.y * area).toFixed(0)}px;width:${bs}px;height:${bs}px;border-radius:10px;background:${bg};box-shadow:0 4px 0 rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .1s">${num}</div>`; }).join("") + `</div>`;
if(st.kind === "corsi-verbal" && st.phase === "judge"){
const order = st.back ? st.seq.slice().reverse() : st.seq;
body += `<div class="aud-key" style="text-align:center;margin-top:8px">Doğru cevap: <b>${order.map(i => i + 1).join(" – ")}</b> · dizi <b>${st.trials + 1}/${st.maxTrials}</b></div><div class="aud-key" style="text-align:center">Yetişkin: dizi yanlışsa <b>Hata sayısı +</b></div><div class="wm-btns" style="margin:6px auto 0"><button type="button" class="wm-btn same" data-judge="9">Sonraki ▶</button></div>`;
}
} else if(st.kind === "span-touch"){
const set = st.sets[st.si] || st.sets[0], it = set.items[Math.min(st.ii, set.items.length - 1)];
const dots = `<div class="wm-dots">${st.sets.map((x, i) => `<i class="${i < st.si ? "on" : ""}"></i>`).join("")}</div>`;
if(st.phase === "idle"){ info = "▶ Başlat'a bas"; body = dots; }
else if(st.phase === "done"){ info = "Bitti!"; body = dots; }
else if(st.phase === "recall" || (st.phase === "fb" && st.options && st.ii >= set.items.length)){
info = `<b>Gördüğün resimlere sırayla dokun</b> · ${st.pos}/${set.items.length}`;
const d = wmGridDims(st.options.length, W, H, 96);
const order = set.items.map(x => x.b);
body = dots + `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + st.options.map((b, i) => {
const mk = st.marks[i] || (st.reveal && order.includes(b) ? "ok" : "");
const num = st.reveal && order.includes(b) ? `<span class="num">${order.indexOf(b) + 1}</span>` : "";
return `<div class="wm-pic${mk ? " " + mk : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;">${imgTag(b.img())}${num}</div>`; }).join("") + `</div>`;
} else {
info = `Cümle ${st.ii + 1} / ${set.items.length} · <b>doğru mu?</b>`;
const sz = Math.min(isLs ? H - 10 : 200, W * (isLs ? 0.4 : 0.6));
const cardHtml = `<div class="wm-card ${st.flash || ""}" style="width:${sz}px;height:${sz}px;flex:none">${imgTag(it.b.img())}</div>`;
const ctrl = `<div style="font-size:13px;color:var(--ink-soft);text-align:center;min-height:18px">${document.documentElement.classList.contains("show-span-text") ? (it.truth ? it.b.bt : it.b.bf) : ""}</div>` +
`<div class="wm-btns"><button type="button" class="wm-btn same" data-judge="1" ${st.phase === "judge" ? "" : "disabled"}>✓ Doğru</button><button type="button" class="wm-btn diff" style="background:#E5484D;box-shadow:0 5px 0 #A9262B" data-judge="0" ${st.phase === "judge" ? "" : "disabled"}>✗ Yanlış</button></div>` +
`<div style="display:flex;gap:8px;justify-content:center"><button type="button" class="gb-btn" data-speak="1">🔊 Tekrar dinle</button><button type="button" class="gb-btn" data-showtext="1">Aa Metni göster</button></div>`;
if(isLs){ body = dots + `<div style="display:flex;gap:18px;align-items:center;justify-content:center;width:100%">${cardHtml}<div style="display:flex;flex-direction:column;gap:10px;flex:1;max-width:420px">${ctrl}</div></div>`; }
else body = dots + cardHtml +
`<div style="font-size:13px;color:var(--ink-soft);text-align:center;min-height:18px">${document.documentElement.classList.contains("show-span-text") ? (it.truth ? it.b.bt : it.b.bf) : ""}</div>` +
`<div class="wm-btns"><button type="button" class="wm-btn same" data-judge="1" ${st.phase === "judge" ? "" : "disabled"}>✓ Doğru</button><button type="button" class="wm-btn diff" style="background:#E5484D;box-shadow:0 5px 0 #A9262B" data-judge="0" ${st.phase === "judge" ? "" : "disabled"}>✗ Yanlış</button></div>` +
`<div style="display:flex;gap:8px;justify-content:center"><button type="button" class="gb-btn" data-speak="1">🔊 Tekrar dinle</button><button type="button" class="gb-btn" data-showtext="1">Aa Metni göster</button></div>`;
}
} else if(st.kind === "pal-touch"){
const dots = `<div class="wm-dots">${Array.from({length:st.cycles}, (_, i) => `<i class="${i < st.scores.length ? (st.scores[i] === st.pairs.length ? "on" : "off") : ""}"></i>`).join("")}</div>`;
if(st.phase === "idle"){ info = "▶ Başlat'a bas"; body = dots; }
else if(st.phase === "done"){ info = `Bitti · ${st.scores.map((x, k) => `${k + 1}. tur ${x}/${st.pairs.length}`).join(" → ")}`; body = dots; }
else if(st.phase === "study"){
const p = st.pairs[st.si];
info = `<b>${st.cycle + 1}. tur</b> · çiftleri aklında tut`;
const sz = Math.min(isLs ? H - 75 : 150, (W - 60) / 2);
body = dots + (p ? `<div style="display:flex;align-items:center;gap:10px;justify-content:center"><div class="wm-card" style="width:${sz}px;height:${sz}px">${imgTag(p.a.src)}</div><span style="font-size:30px;font-weight:900;color:var(--teal-dark)">＋</span><div class="wm-card" style="width:${sz}px;height:${sz}px">${imgTag(p.b.src)}</div></div><div style="font-weight:900;font-size:18px">${p.a.n} – ${p.b.n}</div>${currentStageIndex === 1 ? `<div style="font-weight:800;color:#B07D00;margin-top:2px">💡 İkisini birlikte hayal et</div>` : ""}` : "");
} else {
const p = st.pairs[st.order[st.qi]];
info = `<b>Eşi hangisiydi?</b> · ${st.qi + 1}/${st.order.length}`;
const cue = Math.min(isLs ? H * 0.45 : 130, W * 0.4);
const d = wmGridDims(4, isLs ? W * 0.55 : W, isLs ? H - 20 : H - cue - 40, 100);
const grid = `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + st.opts.map((o, i) => {
const mk = st.phase === "fb" ? (o === st.ans ? "ok" : (i === st.pick ? "bad" : "")) : "";
return `<div class="wm-pic${mk ? " " + mk : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;">${imgTag(o.src)}</div>`; }).join("") + `</div>`;
const cueHtml = `<div class="wm-card" style="width:${cue}px;height:${cue}px;border-color:var(--teal)">${imgTag(p.a.src)}</div>`;
body = dots + (isLs ? `<div style="display:flex;gap:16px;align-items:center;justify-content:center">${cueHtml}${grid}</div>` : cueHtml + grid);
}
} else if(st.kind === "quiz"){
const r = qzRender(st, W, H, isLs); info = r.info; body = r.body;
} else if(NEW_MT_KINDS.includes(st.kind)){
const r = NEW_MT.render(st, W, H, isLs); info = r.info; body = r.body;
} else if(st.kind === "picsay" && st.phase === "judge"){
const items = st.trials[st.ti];
info = "Çocuk resimlerin adlarını <b>sırayla</b> söylesin:";
body = `<div class="wm-dots">${st.trials.map((x, i) => `<i class="${i < st.ti ? "on" : ""}"></i>`).join("")}</div><div class="aud-key" style="text-align:center;font-size:17px">Doğru cevap: <b>${items.map(x => x.n).join(" – ")}</b></div><div class="aud-key" style="text-align:center;margin-top:6px">Yetişkin: sıra yanlışsa <b>Hata sayısı +</b></div><div class="wm-btns" style="margin:6px auto 0"><button type="button" class="wm-btn same" data-judge="9">Sonraki ▶</button></div>`;
} else if(st.kind === "running"){
const items = st.trials[Math.min(st.ti, st.trials.length - 1)];
const dots = `<div class="wm-dots">${st.trials.map((x, i) => `<i class="${i < st.ti ? "on" : ""}"></i>`).join("")}</div>`;
if(st.phase === "idle"){ info = "▶ Başlat'a bas"; body = dots; }
else if(st.phase === "done"){ info = "Bitti!"; body = dots; }
else if(st.phase === "show"){ info = "<b>İzle…</b> (ne zaman biteceği belli değil)"; const sz = Math.min(isLs ? H - 30 : 180, W * 0.55); body = dots + `<div class="wm-card" style="width:${sz}px;height:${sz}px;">${st.showIdx >= 0 ? imgTag(items[st.showIdx].src) : ""}</div>`; }
else {
info = `<b>Son ${st.L}</b> resme sırayla dokun · ${st.pos}/${st.L}`;
const d = wmGridDims(st.options.length, W, isLs ? H - 30 : H, 96);
body = dots + `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + st.options.map((o, i) => {
const inT = st.target.indexOf(o), mk = st.marks[i] || (st.reveal && inT >= 0 ? "ok" : "");
return `<div class="wm-pic${mk ? " " + mk : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;">${imgTag(o.src)}${st.reveal && inT >= 0 ? `<span class="num">${inT + 1}</span>` : ""}</div>`; }).join("") + `</div>`;
}
} else if(st.kind === "zihni"){
const r = st.rounds[Math.min(st.ri, st.rounds.length - 1)], n = r.n;
const dots = `<div class="wm-dots">${st.rounds.map((x, i) => `<i class="${st.res[i] === true ? "on" : st.res[i] === false ? "off" : ""}"></i>`).join("")}</div>`;
const area = Math.min(W, isLs ? H - 20 : 320 * tabletScale()) * (window._fitK || 1), cell = Math.floor((area - (n - 1) * 6) / n);
const showZ = st.phase === "start" ? r.sy * n + r.sx : st.phase === "reveal" ? r.ey * n + r.ex : -1;
const cmd = st.phase === "cmds" && st.cmdIdx >= 0 ? r.cmds[st.cmdIdx] : null;
info = st.phase === "idle" ? "▶ Başlat'a bas" : st.phase === "start" ? "<b>Zihni burada.</b> Aklında tut…" : st.phase === "cmds" ? `Komut ${Math.max(1, st.cmdIdx + 1)} / ${r.cmds.length}` : st.phase === "input" ? "<b>Zihni şimdi nerede?</b> Dokun." : st.phase === "done" ? "Bitti!" : "";
const grid = `<div class="wm-grid" style="grid-template-columns:repeat(${n}, ${cell}px);gap:6px;">` + Array.from({length:n * n}, (_, i) => {
const mk = st.phase === "reveal" && st.pick === i ? (i === r.ey * n + r.ex ? "ok" : "bad") : "";
return `<div class="wm-pic${mk ? " " + mk : ""}" data-mt="${i}" style="width:${cell}px;height:${cell}px;border-radius:14px;">${showZ === i ? `<div style="width:80%;height:80%">${mascotSVG(st.phase === "reveal" ? "cheer" : "happy")}</div>` : ""}</div>`; }).join("") + `</div>`;
const cmdBox = `<div style="min-height:64px;display:flex;align-items:center;justify-content:center;gap:12px">${cmd ? `<span style="font-size:52px;font-weight:900;color:var(--teal-dark);line-height:1">${ZH_DIRS[cmd].a}</span>${isPre() ? "" : `<span style="font-size:26px;font-weight:900;color:var(--ink)">${ZH_DIRS[cmd].w} 1</span>`}` : ""}</div>`;
body = dots + (isLs ? `<div style="display:flex;gap:18px;align-items:center;justify-content:center">${grid}${cmdBox}</div>` : cmdBox + grid);
} else if(st.kind === "market"){
const r = st.rounds[Math.min(st.ri, st.rounds.length - 1)];
const dots = `<div class="wm-dots">${st.rounds.map((x, i) => `<i class="${st.res[i] === true ? "on" : st.res[i] === false ? "off" : ""}"></i>`).join("")}</div>`;
if(st.phase === "idle"){ info = "▶ Başlat'a bas"; body = dots; }
else if(st.phase === "done"){ info = "Bitti!"; body = dots; }
else if(st.phase === "list"){
info = "<b>Alışveriş listesi</b> · aklında tut";
const d = wmGridDims(r.list.length, W, isLs ? H - 75 : H * 0.7, isLs ? 80 : 96);
body = dots + `<div style="background:#FFFDF2;border:2px dashed #E0C97A;border-radius:18px;padding:10px"><div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + r.list.map(x => `<div style="display:flex;flex-direction:column;align-items:center;width:${d.cell}px"><div class="wm-pic" style="width:${d.cell}px;height:${d.cell}px;cursor:default">${imgTag(x.src)}</div><b style="font-size:14px;margin-top:2px">${x.n}</b></div>`).join("") + `</div></div>`;
} else if(st.phase === "distract"){
info = "<b>Balonların hepsini patlat!</b>";
const d = wmGridDims(6, W, isLs ? H - 20 : 260, 90);
body = dots + `<div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + st.balloons.map(bl => `<div data-mt="${bl.i}" style="width:${d.cell}px;height:${d.cell}px;display:flex;align-items:center;justify-content:center;cursor:pointer">${bl.popped ? `<span style="font-size:${Math.round(d.cell * 0.4)}px">💥</span>` : `<svg viewBox="0 0 60 80" style="width:70%;height:90%"><ellipse cx="30" cy="30" rx="24" ry="28" fill="${bl.c}"/><ellipse cx="22" cy="20" rx="6" ry="9" fill="#fff" opacity=".45"/><path d="M30 58 l-4 6 h8z" fill="${bl.c}"/><path d="M30 64 q-6 8 0 14" stroke="#888" fill="none" stroke-width="1.5"/></svg>`}</div>`).join("") + `</div>`;
} else {
const got = r.list.filter(x => st.marks[r.shelf.indexOf(x)] === "ok").length;
info = `<b>Listedekileri raftan seç</b> · ${got}/${r.list.length}`;
const d = wmGridDims(r.shelf.length, W, isLs ? H - 20 : H, 92);
body = dots + `<div style="background:linear-gradient(#F3E3C3 0 0) bottom/100% 6px no-repeat;padding-bottom:8px"><div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + r.shelf.map((x, i) => `<div class="wm-pic${st.marks[i] ? " " + st.marks[i] : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;">${imgTag(x.src)}</div>`).join("") + `</div></div>`;
}
} else {
const items = st.trials[Math.min(st.ti, st.trials.length - 1)], isL = st.kind === "lns-touch";
const face = (x) => isL ? `<span style="font-size:34px;font-weight:900;color:var(--ink)">${x}</span>` : imgTag(x.src);
const dots = `<div class="wm-dots">${st.trials.map((x, i) => `<i class="${i < st.ti ? "on" : ""}"></i>`).join("")}</div>`;
if(st.phase === "idle"){ info = "▶ Başlat'a bas"; body = dots; }
else if(st.phase === "done"){ info = "Bitti!"; body = dots; }
else if(st.phase === "show"){
info = isL ? "<b>Dinle ve izle…</b>" : st.audio ? "<b>Dinle…</b>" : "<b>İyi bak…</b>";
const sz = Math.min(isLs ? H - 30 : 180, W * 0.55);
body = dots + (st.audio ? SPEAKER_HTML(true) : `<div class="wm-card" style="width:${sz}px;height:${sz}px;">${st.showIdx >= 0 ? face(items[st.showIdx]) : ""}</div>`);
} else {
const tgt = seqTarget();
info = isL ? (st.sorted ? "Önce sayılar <b>küçükten büyüğe</b>, sonra harfler <b>alfabe sırasıyla</b>" : "Önce <b>sayılara</b>, sonra <b>harflere</b> dokun (duyduğun sırayla)") : st.kind === "picseq" ? "Resimlere <b>duyduğun sırayla</b> dokun" : "Önce <b>hayvanlara</b>, sonra <b>meyvelere</b> dokun (gördüğün sırayla)";
const d = wmGridDims(items.length, W, isLs ? H - 45 : H, isL ? 84 : 100);
body = dots + `<div class="wm-info">${st.pos}/${items.length}</div><div class="wm-grid" style="grid-template-columns:repeat(${d.cols}, ${d.cell}px);">` + st.keys.map(i => {
const mk = st.marks[i] || (st.reveal ? "ok" : "");
const num = st.reveal ? `<span class="num">${tgt.indexOf(items[i]) + 1}</span>` : "";
return `<div class="wm-pic${mk ? " " + mk : ""}" data-mt="${i}" style="width:${d.cell}px;height:${d.cell}px;">${face(items[i])}${num}</div>`; }).join("") + `</div>`;
}
}
board.innerHTML = `<div class="wm-wrap"><div class="wm-info">${info}</div>${body}</div>`;
}

function handleMtTap(ev){
if(!currentExercise().isMt || !mtState) return;
const sp = ev.target.closest("[data-speak]"); if(sp){ const st = mtState; const it = st.sets && st.sets[st.si] && st.sets[st.si].items[st.ii]; if(it) speakText(it.truth ? it.b.bt : it.b.bf); return; }
const tx = ev.target.closest("[data-showtext]"); if(tx){ document.documentElement.classList.toggle("show-span-text"); renderMtBoard(); return; }
const b = ev.target.closest("[data-mt],[data-judge],[data-mtbtn]"); if(!b) return;
if(!timerRunning){ showLevelFlash("Önce ▶ Başlat'a basın.", "down"); return; }
const st = mtState;
if(b.dataset.mtbtn){ const f = NEW_MT.btn[b.dataset.mtbtn]; if(f) f(); return; }
if(b.dataset.judge !== undefined && NEW_MT.judge[st.kind]){ NEW_MT.judge[st.kind](Number(b.dataset.judge)); return; }
if(b.dataset.mt !== undefined && NEW_MT.tap[st.kind]){ const v = b.dataset.mt; NEW_MT.tap[st.kind](/^-?\d+$/.test(v) ? Number(v) : v); return; }
if(b.dataset.judge !== undefined){ if(st.kind === "picsay" && st.phase === "judge"){ const jv = b.dataset.judge; st.manual = jv === "9"; if(jv === "1") gameSfx("correct"); else if(jv !== "9") mtErr(); st.phase = "fb"; renderMtBoard(); mtLater(seqNext, 400); return; }
if(st.kind === "corsi-verbal" && st.phase === "judge") corsiVerbalNext(); else if(st.kind === "span-touch") spanJudge(Number(b.dataset.judge)); return; }
const i = Number(b.dataset.mt);
if(st.kind === "corsi") corsiTap(i); else if(st.kind === "span-touch") spanTap(i);
else if(st.kind === "running") runTap(i); else if(st.kind === "zihni") zhTap(i); else if(st.kind === "pal-touch") palTap(i);
else if(st.kind === "market"){ if(st.phase === "distract") mkPop(i); else mkTap(i); }
else if(st.kind !== "corsi-verbal") seqTap(i);
}
document.getElementById("board").addEventListener("click", (ev) => { if(zaFastSeen(ev)) return; handleMtTap(ev); });
window.addEventListener("resize", () => { clearTimeout(window._mtResizeT); window._mtResizeT = setTimeout(() => { try{ if(currentExercise().isMt) renderMtBoard(); }catch(e){} }, 150); });

const Q = (t) => `<b>"${t}"</b>`;
const EYE = (d) => Q(`Ekranda bir top var. Başını hiç oynatma; top nereye giderse sadece gözlerinle onu takip et. ${d}`);
/* KURAL (terimler): arayüzde tek ad — 10 beceri alanı için "alan" (kategori değil), Başlangıç/Orta/Zor için "düzey" (seviye değil), Okul Öncesi/Okul Sonrası için "okul dönemi" (kademe/seviye değil), otomatik ödevler için "önerilen çalışma" (gelişim ödevi değil); içerikteki anlam kategorileri (meyve, hayvan…) bu kuralın dışındadır */
/* KURAL (uyum, düzen ve denge — uygulamanın bütünü için):
   İÇERİK UYUMU: yönerge, ekrandaki içerik ve puanlama birbiriyle çelişmez (yönergede geçen sayı/hedef tahtadakiyle aynı; dönüşümlü izlerde tam çift; hatırlama listelerinde tekrar yok; Aşama 1'de sorulmayan özellik gösterilmez).
   MANTIK UYUMU: düzey geçişleri, kategori kademesi, Değerlendirme turu, ödev ve planlar aynı kademe/düzey ölçeğini kullanır (okul öncesi 0–2, okul sonrası 3–5).
   DÜZEN UYUMU: hiçbir sayfa yatay taşmaz, ızgarada son satır eksik kalmaz, uyaran kutusu çökmez, ana sayfalar aynı iskeleti (başlık, büyük kart, 2×2 kart) kullanır, renkler tek paletten gelir, geri bildirim ✓/✗ taşır.
   DENGE: her kategoride en az 15 çalışma, her bölümde en az 3 çalışma, her kategorinin en az %70'i Okul Öncesi'nde de var, her kategorinin Zihin Adaları'nda en az 8 durağı ve Değerlendirme turunda bir alanı var, her çalışmanın her aşaması için yönerge var, aşama sayısı 1–3.
   Bu kurallar her teslimden önce kural denetimiyle (rules_check) sınanır. */
/* KURAL (yönergeler): Q(...) içindeki yeşil metin çocuğa okunur. Düzgün Türkçe, tam cümleler; önce ne olacağını, sonra çocuğun ne yapacağını anlatır;
   tek kelimelik ya da kopuk komut olmaz ("Tersini yap." gibi); kısalık uğruna anlatım bozulmaz; düzeye özgü kural (eşler, sıra) yetişkin notunda değil çocuğun cümlesinde geçer;
   ekrandaki eylemle birebir örtüşür (dokun/söyle/vur/çiz); çalışmayla çelişen ifade olmaz. Q dışındaki metin yetişkine yöneliktir ve kısa tutulur.
   Yeşil cümleden SONRA açıklama, örnek, puanlama notu ya da "Örneğin" satırı gelmez (yetişkin bunu cümlenin devamı sanıp çocuğa okuyabilir); yetişkine gereken kısa yönlendirme yeşilden ÖNCE yazılır. İstisna: renk–hareket anahtarı gibi görsel anahtar. */
const INSTR_SHORT = {
"shape-color":      [() => Q("Ekranda şekiller var. Soldan sağa, satır satır her şeklin adını hızlıca söyle."), () => Q("Ekranda renkli şekiller var. Soldan sağa, satır satır her şeklin önce rengini, sonra adını hızlıca söyle.")],
"number-color":     [() => Q("Ekranda rakamlar var. Soldan sağa, satır satır her rakamı hızlıca söyle."), () => Q("Her rakamın önce rengini, sonra kendisini söyle.")],
"object-name":      [() => Q("Ekranda resimler var. Soldan sağa, satır satır her resmin adını hızlıca söyle."), () => Q("Her resmin adını ve hangi gruptan olduğunu söyle: hayvan mı, giysi mi, yiyecek mi?")],
"fruit-veg":        [() => Q("Ekranda meyveler ve sebzeler var. Soldan sağa, satır satır her biri için meyve mi sebze mi olduğunu hızlıca söyle."), () => Q("Her biri için önce büyük mü küçük mü olduğunu, sonra meyve mi sebze mi olduğunu söyle.")],
"taste-name":       [() => Q("Ekranda yiyecekler var. Her biri için tadını söyle: tatlı mı, ekşi mi, acı mı, tuzlu mu?"), () => Q("Her biri için önce tadını, sonra adını söyle.")],
"hot-cold":         [() => Q("Ekranda resimler var. Her biri için soğuk mu sıcak mı olduğunu hızlıca söyle."), () => Q("Her biri için önce adını, sonra soğuk mu sıcak mı olduğunu söyle.")],
"living-nonliving": [() => Q("Ekranda resimler var. Her biri için canlı mı cansız mı olduğunu hızlıca söyle."), () => Q("Her biri için önce adını, sonra canlı mı cansız mı olduğunu söyle.")],
"choice-reaction":  [() => `Eşleşmeleri birlikte deneyin, sonra: ${Q("Her rengin bir hareketi var. Ekrandaki renkleri soldan sağa, satır satır git; her rengin hareketini hızlıca yap.")}` + crtLegendHTML(),
() => `${Q("Ekrandaki renkleri soldan sağa, satır satır git; önce rengin adını söyle, sonra hareketini yap.")}` + crtLegendHTML()],
"origin-order":     [() => `${Q("Her satırın başında bir resim var. Ondan sonra ne olur, en sonda ne olur? Satırdaki resimlere oluş sırasına göre sırayla dokun.")}`],
"symbol-image":     [() => `Anahtarı birlikte okuyun, sonra: ${Q("Üstteki anahtarda her şeklin bir resmi var. Aşağıdaki şekillere soldan sağa bak; her şeklin eşi olan resmin adını söyle.")}`],

"search-object":    [() => Q("Her satırın solunda bir resim var. Satırdaki resimler arasından onun tıpatıp aynısını bul ve ona dokun.")],
"search-shape":     [() => Q("Her satırın solunda bir şekil var. Satırdaki şekiller arasından onun tıpatıp aynısını bul ve ona dokun.")],
"search-symbol":    [() => Q("Her satırın solunda bir sembol var. Satırdaki semboller arasından onun tıpatıp aynısını bul ve ona dokun. İçi dolu olanla boş olan aynı sayılmaz.")],
"search-letter":    [() => Q("Her satırın solunda bir harf var. O harf satırda varsa ona dokun; satırda yoksa YOK yazan kutuya dokun.")],
"cat-fruit":        [() => Q(`Ekranda meyveler ve sebzeler var. Yalnızca ${trUpper(catTargetWord("cat-fruit")[1])} hızlıca dokun; diğerlerine dokunma.`), () => Q(`Ekranda meyveler ve sebzeler var. Yalnızca ${trUpper(catTargetWord("cat-fruit")[1])} hızlıca dokun; diğerlerine dokunma.`)],
"cat-living":       [() => Q(`Ekranda karışık resimler var. Yalnızca ${trUpper(catTargetWord("cat-living")[1])} hızlıca dokun; diğerlerine dokunma.`), () => Q(`Ekranda karışık resimler var. Yalnızca ${trUpper(catTargetWord("cat-living")[1])} hızlıca dokun; diğerlerine dokunma.`)],
"cat-cold":         [() => Q(`Ekranda sıcak ve soğuk şeyler var. Yalnızca ${trUpper(catTargetWord("cat-cold")[1])} hızlıca dokun; diğerlerine dokunma.`), () => Q(`Ekranda sıcak ve soğuk şeyler var. Yalnızca ${trUpper(catTargetWord("cat-cold")[1])} hızlıca dokun; diğerlerine dokunma.`)],
"trail-numbers":    [() => Q(`Ekranda karışık duran sayılar var. BAŞLA yazan yerden başla; sayılara küçükten büyüğe sırayla dokun: 1, 2, 3 … ${currentGrid.length || ""}.`), () => Q(`Ekranda karışık duran sayılar var. BAŞLA yazan yerden başla; sayılara büyükten küçüğe sırayla dokun: ${currentGrid.length || ""}, ${(currentGrid.length || 2) - 1} … 1.`)],
"pairs-touch":      [() => Q("Her kutuda iki şey var. Birlikte kullanılan çiftlere hızlıca dokun; birlikte kullanılmayanlara dokunma."), () => Q("Her kutuda iki şey var. Birlikte KULLANILMAYAN çiftlere hızlıca dokun; birlikte kullanılanlara dokunma.")],
"sdmt-touch":       [() => `Anahtarı birlikte inceleyin, sonra: ${Q("Üstteki anahtarda her şeklin bir resmi var. Ekrana bir şekil gelince anahtara bak; o şeklin eşi olan resme hızlıca dokun.")}`],
"quick-sort":       [() => { const R = qsRule(); const tail = qsRuleKey === "canli" ? " Bitkiler de canlıdır; oyuncak hayvanlar cansızdır." : ""; const t = Math.min(currentCombo().t, 2); const extra = t === 2 ? " Dikkat: oyunun ortasında kural değişecek; ekranda uyarı çıkınca yeni kurala göre dokun." : ""; return Q(`Ekrana resimler tek tek gelecek. ${trCap(R.a.l)} gelirse ${trDat(R.a.l)}, ${R.b.l === "DEĞİL" ? "taşıt olmayan bir şey" : trCap(R.b.l).toLocaleLowerCase("tr")} gelirse ${trDat(R.b.l)} hızlıca dokun.${tail}${extra}`); }],
"stroop-touch":     [() => Q("Ekrana renk adı yazan kelimeler gelecek ama her kelime başka renkle yazılmış. Kelimeyi okuma; yazının rengi hangisiyse alttan o renk düğmesine dokun.")],
"day-night-touch":  [() => Q("Ekrana güneş ya da ay gelecek. Tersine dokunacaksın: güneş gelince AY düğmesine, ay gelince GÜNEŞ düğmesine dokun.")],
"fish-flanker":     [() => Q("Ekranda yan yana balıklar var. Yalnızca ORTADAKİ balığa bak; yandakilere aldırma. Ortadaki balık hangi yöne bakıyorsa alttan o yönün okuna dokun.")],
"face-go":          [() => Q(`Ekrana yüzler tek tek gelecek. Her yüz gelince DOKUN'a bas. Ama ${trUpper(FACE_NAMES[fgStop])} yüz gelince dokunma, bekle.`)],
"switch-touch":     [() => Q("Ekrana ön ya da arka tarafı görünen taşıtlar gelecek. Çerçeve yeşilse gördüğünle aynı tarafa, çerçeve turuncuysa ters tarafa dokun: yeşilde önü gördüysen ön'e, turuncuda önü gördüysen arka'ya.")],

"hear-find":        [() => Q("Ekranda resimler var. Bazılarının adı okunacak; dinle ve aklında tut. Bitince adı okunan resimlere dokun; sonra Bitti'ye bas.")],
"dir-follow":       [() => Q("Ekranda resimler var. Sana hangi resimlere, hangi sırayla dokunacağını söyleyeceğim; dinle ve aklında tut. Bitince söylediğim sırayla resimlere dokun.")],
"vis-miss":         [() => Q("Ekranda resimler var; hepsine iyi bak ve aklında tut. Sonra resimlerden biri kaybolacak. Hangi resmin eksik olduğunu bul; alttan ona dokun.")],
"vis-chg":          [() => Q("Ekranda resimler var; hepsine iyi bak ve aklında tut. Sonra resimlerden biri değişecek, yerine başka bir resim gelecek. Değişen resme dokun.")],
"vis-recog":        [() => Q("Ekranda resimler var; hepsine iyi bak ve aklında tut. Sonra resimler tek tek gelecek; bazıları az önce gördüklerin, bazıları yeni. Her resim için Gördüm ya da Görmedim'e dokun."), () => `10–15 dk sonra açın: ${Q("Az önce gördüğün resimleri hatırlıyor musun? Şimdi resimler tek tek gelecek. Her resim için Gördüm ya da Görmedim'e dokun.")}`],
"pk-redlight":      [() => Q("Işık yeşilken düğmeye basılı tut, Zihni koşsun. Kırmızı olunca hemen bırak!")],
"pk-waiter":        [() => Q("Siparişi dinle ve aklında tut. Tepsiye doğru sayıda meyve koy, sonra Servis Et'e bas.")],
"pk-drum":          [() => Q("Önce ritmi dinle. Sonra her vuruşla aynı anda davula vur.")],
"pk-word":          [() => Q(isPre() ? "Akan resimlerden yalnızca söylenen gruptakilere dokun." : "Akan kelimelerden yalnızca söylenen gruba girenlere dokun.")],
"pk-rhyme":         [() => Q("Söylenen kelimeyle sonu benzeyen kelimeyi taşıyan balığı yakala.")],
"pk-train":         [() => Q("Resmin adını dinle. Hece vagonlarını sırayla takarak treni kur.")],
"pk-slide":         [() => Q("Resme bak. Parçaları boşluğa kaydırarak resmi yeniden tamamla.")],
"pk-bridge":        [() => Q("Zihni karşıya geçsin. Boşluğa tam uyan tahtayı seç.")],
"pk-shadow":        [() => Q("Resme bak ve onun gölgesini bul.")],
"pk-escape":        [() => Q("Zihni'yi yıldıza götür. Gideceğin kareye dokun, bulutlara yakalanma.")],
"pk-balloon":       [() => Q("Yalnızca söylenen renkteki balonları patlat. Renk değişirse dikkat et!")],
"pk-mole":          [() => Q("Delikten çıkan köstebeğe hızlıca dokun. Şapkalı köstebeğe dokunma!")],
"pk-catch":         [() => Q("Parmağınla sepeti kaydır. Meyveleri yakala, taşları yakalama.")],
"pk-bag":           [() => Q("Zihni bavuluna ne koyuyor, iyi bak. Bavul kapanınca soruyu cevapla.")],
"pk-simon":         [() => Q("Renklerin sırasını izle ve dinle, sonra aynı sırayla dokun. Dizi her turda uzar.")],
"pk-light":         [() => Q("Fenerlerin yanma sırasını izle, sonra aynı sırayla dokun. Her turda bir fener daha yanar.")],
"clue-find":        [() => Q("Ekranda şekiller var. Sana ipuçları okunacak; dinle. Her ipucu bazı şekilleri eler. Bütün ipuçlarına uyan tek bir şekil kalır; ona dokun.")],
"class-table":      [() => Q("Ekranda bir tablo var: satırlar renkleri, sütunlar şekilleri gösteriyor. Aşağıdan bir parça seç; rengi hangi satıra, şekli hangi sütuna uyuyorsa o kutuya koy. Bütün parçaları yerleştir.")],
"color-obj":        [() => Q("Ekranda resimler var ve her resim renkli bir kartın üstünde duruyor. Hangi resmin hangi renkte olduğuna iyi bak ve aklında tut. Sonra her resim için hangi renk kartta olduğunu seç.")],
"pic-order":        [() => Q("Resimler tek tek gelecek; hangi resmin hangi sırada geldiğine iyi bak ve aklında tut. Bitince resimler karışık görünecek; onlara geliş sırasıyla dokun.")],
"finger-trace":     [() => Q("Ekranda bir top var. Parmağını topun üstüne koy. Top nereye giderse parmağınla onunla birlikte git; parmağını kaldırma.")],
"eye-count":        [() => `Çocuğa söyleyin: ${Q(!isPre() && currentCombo().t === 2 ? "Ekranda karışık şekiller var. Parmağını kullanmadan, sadece yıldızları gözünle soldan sağa say. Bitince Devam'a bas ve saydığın sayıya dokun." : "Ekranda şekiller var. Parmağını kullanmadan, sadece gözünle soldan sağa say. Bitince Devam'a bas ve saydığın sayıya dokun.")}`],
"listen-answer":    [() => Q("Sana kısa bir hikâye okunacak; dikkatle dinle. Sonra hikâyedeki bir an sorulacak. Resimlerden o anı gösterene dokun.")],
"rhyme-done":       [() => `Okuyun: ${Q("Sana bir tekerleme okuyacağım ama sonunu söylemeyeceğim. Dinle; sonunu sen tamamla.")}`],
"new-word":         [() => Q("Ekranda yeni arkadaşlar var; her birinin adını duyacaksın. Adlarını dinle ve aklında tut. Sonra bir ad sorulacak; o arkadaşı bul ve ona dokun.")],
"sent-pic":         [() => isPre() ? Q("Bir cümle okunacak; dinle. Sonra ekrandaki resimlere bak; cümlede anlatılana uyan resme dokun.") : Q("Ekranda bir cümle var; oku ve dinle. Altındaki resimlerden cümlede anlatılana tam uyan resme dokun.")],
"pair-match":       [() => Q("Her satıra dikkatle bak. Satırda birbirinin tıpatıp aynısı olan iki kart var; o ikisine dokun.")],
"sent-verify":      [() => Q(currentCombo().t === 2 ? "Ekrana iki cümle gelecek. İkisini de oku; ikinci cümle ilkine uyuyorsa Doğru'ya, ters düşüyorsa Yanlış'a dokun." : "Ekrana cümleler tek tek gelecek. Cümleyi oku; doğruysa Doğru'ya, yanlışsa Yanlış'a hızlıca dokun.")],
"periph":           [() => Q("Ortada kırmızı bir nokta var; gözünü ondan hiç ayırma. Kenarlardan bir yıldız belirince, gözünü ortadan ayırmadan parmağınla yıldıza dokun." + (!isPre() && currentCombo().t === 2 ? " Mavi daire çıkarsa ona dokunma." : ""))],

"dual-task":        [() => Q("İki işi birden yapacaksın: ekranda çıkan yıldızlara dokun, aynı anda duyduğun bip seslerini içinden say. Sonunda kaç bip duyduğunu söyle.")],
"stop-signal":      [() => Q("Ekrana oklar gelecek. Ok hangi yöne bakıyorsa alttan o yönün düğmesine hızlıca bas. Ama ok kırmızıya dönerse hiçbir düğmeye basma, bekle.")],
"look-first":       [() => Q("Tek başına duran bir ev var. Yanındaki evlerden sadece biri onun birebir aynısı, diğerlerinde küçük bir fark var. Dokunmadan önce hepsine dikkatle bak ve karşılaştır; sonra aynı olana dokun.")],
"keep-track":       [() => `${Q("Resimler tek tek gelecek; hayvanlar, oyuncaklar, meyveler gibi gruplardan. Her gruptan en son gelen resmi aklında tut. Resimler bitince her grubun en son gelenini söyle.")}`],
"zoo-map":          [() => Q("Bu bir hayvanat bahçesi haritası. Girişten başla, yıldızlı hayvanların hepsine uğra ve çıkışta bitir. Gitmek istediğin yere dokun. Aynı yoldan iki kez geçemezsin; dikkatli plan yap.")],
"key-search":       [() => Q("Bu tarlada bir anahtar kayboldu ama nerede olduğunu bilmiyoruz. Parmağınla tarlanın içinde bir yol çiz; öyle çiz ki tarlanın her yerine bakmış ol. Bitince ‘Bitti’ye dokun.")],
"water-jars":       [() => Q("Kaplarla su ölçeceğiz. Bir kaba dokunup ‘Doldur’a basarsan kap tamamen dolar, ‘Boşalt’a basarsan boşalır. Önce bir kaba, sonra öbürüne dokunursan suyu aktarırsın. Kaplardan birinde tam istenen kadar su olunca kazanırsın; az hamleyle yapmaya çalış.")],
"design-fluency":   [() => Q("Noktaları çizgilerle birleştirerek desenler yapacaksın. Bir noktaya, sonra başka bir noktaya dokununca aralarına çizgi çizilir. Her deseni bitirince ‘Desen bitti’ye bas. Olabildiğince çok ve hep birbirinden farklı desen çiz.")],
"twenty-q":         [() => `Hedefi çocuğa göstermeyin; her soruda Soru +1'e basın. ${Q("Tahtadaki resimlerden birini aklımda tuttum. Bana sorular sorarak hangisi olduğunu bul. Sadece ‘evet’ ya da ‘hayır’ diye cevap verebileceğim sorular sor; az soruyla bulmaya çalış.")}`],
"box-search":       [() => Q("Kutuların içinde yıldızlar saklı; her kutuda tam bir yıldız var. Kutulara dokunarak yıldızları bul. Bir kutuda yıldız bulduktan sonra o kutuya bir daha dokunma, çünkü yıldız artık orada olmaz.")],
"three-tasks":      [() => Q("Üç çeşit iş var ve her işin iki parçası var. Süre bitmeden altı parçanın hepsine dokunup biraz yap. Ama bir kural var: aynı işin iki parçasını arka arkaya yapma, araya başka bir iş koy.")],
"cog-est":          [() => `Soruyu okuyun: ${Q("Sana bazı sorular soracağım. Tam cevabı bilmen gerekmiyor; aşağı yukarı ne kadar olabileceğini tahmin et ve söyle.")}`],
"fist":             [() => `${Q("Üç kart göreceksin. Önce birbirine benzeyen iki karta dokun. Sonra başka bir yönden benzeyen iki karta dokun; mesela önce rengi aynı olanları, sonra şekli aynı olanları seç.")}`],
"rule-shift":       [() => Q("Üstte dört anahtar kart var. Alttaki kartı anahtarlardan birinin üstüne dokunarak koy. Kuralı sana söylemeyeceğim; doğru mu yanlış mı işaretine bakarak kuralı sen bul. Kural ara sıra değişir; yanlış çıkmaya başlayınca yeni kuralı bul.")],
"reversal":         [() => Q("İki resim var. Birine dokununca yıldız alırsın, öbürüne dokununca almazsın. Hangisinin yıldız verdiğini bul ve hep ona dokun. Bir süre sonra yıldız öbür resme geçebilir; fark edince ona dokun.")],
"navon":            [() => Q("Ekranda küçük şekillerden yapılmış büyük bir şekil var. Üstte ‘BÜYÜK’ yazıyorsa büyük şeklin ne olduğuna bak ve alttan ona dokun. ‘KÜÇÜK’ yazıyorsa küçük şekillerin ne olduğuna bak ve ona dokun.")],
"plus-minus":       [() => Q("Ekranda sayılar var. Her sayıya 3 ekle ve sonucu söyle. Mesela 12 görünce ‘15’ de."), () => Q("Ekranda sayılar var. Her sayıdan 3 çıkar ve sonucu söyle. Mesela 12 görünce ‘9’ de."), () => Q("Ekranda sayılar var. Sırayla değişeceksin: ilk sayıya 3 ekle, ikinci sayıdan 3 çıkar, üçüncüye yine 3 ekle, dördüncüden yine 3 çıkar; böyle devam et.")],
"creature-count":   [() => Q("Yaratıkları sırayla sayacaksın. Yeşil ok gelince yukarı doğru saymaya devam et, kırmızı ok gelince geriye doğru say. En sonda kaça geldiysen alttan o sayıya dokun.")],
"rev-sort":         [() => Q("Ekranda büyük ya da küçük bir şekil gelecek. Büyük şekli büyük kovaya, küçük şekli küçük kovaya koy; koymak için kovaya dokun."), () => Q("Ekrana büyük ya da küçük bir şekil gelecek. Büyük şekli küçük kovaya, küçük şekli büyük kovaya koy; koymak için kovaya dokun.")],
"statue":           [() => `Çocuk ayakta, gözler kapalı, eller yanda: ${Q("Heykel oyunu oynayacağız. Gözlerini kapat, ellerini yanına indir ve ben ‘bitti’ diyene kadar hiç kıpırdamadan dur. Sesler duysan bile kıpırdama ve konuşma.")}`],
"hold-wait":        [() => Q("Ekranda bir hediye var. Parmağını hediyenin üstüne koy ve hediye açılana kadar hiç çekme. Etrafta resimler çıksa, sesler gelse bile parmağını kaldırma.")],
"less-more":        [() => Q("İki tabakta yiyecekler var. Bu oyunda az olan tabağa dokunursan çok olanı kazanırsın. Çok olanı kazanmak için hangi tabağa dokunmalısın?")],
"context-go":       [() => Q(`Resimler tek tek gelecek. Önce ${ANIMAL_NAMES[axCue]} gelip hemen arkasından ${ANIMAL_NAMES[axTgt]} gelirse DOKUN düğmesine bas. Başka bir resim gelince basma.`)],
"distract":         [() => Q("Ortada bir ok göreceksin. Ok hangi yöne bakıyorsa alttaki aynı yönlü oka dokun."), () => Q("Ortada bir ok göreceksin. Etrafında resimler uçuşacak ve sesler gelecek; onlara bakma. Ortadaki ok hangi yöne bakıyorsa alttaki aynı yönlü oka dokun.")],
"opp-world":        [() => Q("Ekranda 1 ve 2 rakamları var. Tersini söyleyeceksin: 1 görünce ‘iki’ de, 2 görünce ‘bir’ de. Hızlı ol ama şaşırma.")],
"grass-snow":       [() => Q("Ekranda çimen ya da kar resmi gelecek. Çimen gelince beyaz kutuya dokun, kar gelince yeşil kutuya dokun. Yani hep tersi rengi seçeceksin.")],
"rev-arrow":        [() => Q("Ekranda oklar var. Her ok için baktığı yönü söyle: ‘yukarı’ ya da ‘aşağı’."), () => Q("Ekranda oklar var. Her ok için baktığı yönün tersini söyle: ok yukarı bakıyorsa ‘aşağı’ de, aşağı bakıyorsa ‘yukarı’ de.")],
"num-stroop":       [() => Q("Ekranda iki tarafta rakamlar olacak. Rakamın kaç olduğuna bakma; hangi tarafta daha çok rakam varsa o tarafa dokun."), () => Q("Ekranda iki tarafta rakamlar olacak. Kaç tane olduğuna bakma; hangi taraftaki rakam daha büyükse o tarafa dokun.")],
"size-stroop":      [() => Q("İki hayvan göreceksin. Resimde hangisi büyük çizilmiş, ona aldanma. Gerçek hayatta hangisi daha büyükse ona dokun."), () => Q("İki hayvan göreceksin. Resimde hangisi küçük çizilmiş, ona aldanma. Gerçek hayatta hangisi daha küçükse ona dokun.")],
"spatial-stroop":   [() => Q("Ekranda SOL, SAĞ, YUKARI ya da AŞAĞI yazacak. Yazının nerede durduğuna bakma; ne yazıyorsa o yönün okuna dokun."), () => Q("Ekranda bir kelime olacak. Ne yazdığını okuma; kelime ekranın neresinde duruyorsa o yönün okuna dokun.")],
"anti-touch":       [() => Q("Ekranda mavi bir top belirecek. Topun olduğu tarafa değil, tam karşı tarafın okuna dokun. Top solda çıkarsa sağ oka, sağda çıkarsa sol oka bas.")],
"hayling":          [() => `Cümleyi okuyun, son kelimeyi söylemeden durun: ${Q("Sana bir cümle okuyacağım ama sonunu söylemeyeceğim. Sen cümleyi uygun bir kelimeyle tamamla.")}`, () => `Cümleyi okuyun, son kelimeyi söylemeden durun: ${Q("Sana bir cümle okuyacağım ama sonunu söylemeyeceğim. Sen cümleye hiç uymayan, alakasız bir kelime söyle. Uyan kelimeyi söylersen olmaz.")}`],
"zihni-says":       [() => `Komutları okuyun: ${Q("Sana komutlar vereceğim. Komut ‘Zihni diyor ki’ diye başlıyorsa yap. ‘Zihni diyor ki’ demeden söylersem yapma, olduğun gibi dur.")}`],
"opp-do":           [() => `Komutları okuyun: ${Q(oppKidText("htks"))}`],
"hand-game":        [() => `Elinizle gösterin: ${Q(oppKidText("hand"))}`],
"tap-reverse":      [() => Q("Ekranda yumruk resmi göreceksin. Bir yumruk görürsen büyük düğmeye iki kez vur. İki yumruk görürsen bir kez vur. Yani hep gördüğünün tersi kadar vur.")],
"vigilance":        [() => Q("Ekrana şekiller tek tek gelecek; çoğu başka şekil olacak. Sadece kırmızı yıldız gelince Gördüm'e bas; diğerlerinde basma. Uzun sürse de dikkatini bırakma.")],
"pos-nback":        [() => Q(mtState && mtState.n === 2 ? "Ekranda mavi bir kare tek tek belirip kaybolacak. İlk iki kareyi sadece aklında tut. Sonra kare iki önceki karenin olduğu yerde belirirse ‘Aynı yer’e bas; başka yerde belirirse basma." : "Ekranda mavi bir kare tek tek belirip kaybolacak. İlk kareyi sadece aklında tut. Sonra kare bir önceki karenin olduğu yerde belirirse ‘Aynı yer’e bas; başka yerde belirirse basma.")],
"count-span":       [() => Q("Kartlar tek tek gelecek. Her karttaki noktaları say, sayıyı aklında tut ve Saydım'a bas. Kartlar bitince saydığın sayıları sırayla seç.")],
"tone-seq":         [() => Q("Ekranda tuşlar var. Tuşlar sırayla yanacak ve her biri bir ses çıkaracak; sırayı izle ve dinle. Bitince tuşlara aynı sırayla dokun."), () => Q("Tuşlar yanmayacak, sadece sesler çalacak. Sesleri dikkatle dinle; bitince tuşlara aynı sırayla dokun.")],
"which-seen":       [() => Q("Ekranda bir resim var; ona iyice bak ve ayrıntılarını aklında tut. Sonra birbirine çok benzeyen resimler gelecek. Az önce gördüğün resmin tıpatıp aynısına dokun.")],
"route-mem":        [() => Q("Ekranda kareler var ve turuncu bir yol çizilecek; yolu iyi izle ve aklında tut. Sonra yol kaybolacak. Yeşil kareden başla ve aynı yolu kare kare dokunarak tekrarla.")],
"syl-blend":        [() => Q("Bir kelimenin heceleri ayrı ayrı okunacak: ‘ka – lem’ gibi. Heceleri kafanda birleştir, hangi kelime olduğunu bul ve o resme dokun.")],
"phon-manip":       [() => `Okuyun: ${Q("Sana bir kelime söyleyeceğim, sonra ne yapacağını söyleyeceğim: bir sesi çıkar, bir ses ekle ya da bir sesi değiştir. Kelimenin yeni hâlini söyle.")}`],
"sent-build":       [() => Q("Ekranda karışık kelimeler var. Kelimelere doğru sırayla dokunarak anlamlı bir cümle kur.")],
"wh-scene":         [() => Q("Ekranda bir resim ve bir soru var. Resme bak, soruyu oku ya da dinle. Sorunun cevabı olan seçeneğe dokun.")],
"spot-diff":        [() => Q("Yan yana iki resim var; birbirine çok benziyorlar ama aralarında farklar var. İkisini dikkatle karşılaştır. Sağdaki resimde farklı olan yerleri bul ve her birine dokun.")],
"paper-fold":       [() => Q("Ekranda katlanmış ve bir yerinden delinmiş bir kâğıt var; nasıl katlandığına ve deliğin yerine iyi bak. Kâğıt açılınca delikler nerede olur? Doğru görünen seçeneğe dokun.")],
"view-from":        [() => Q("Ekranda küplerden yapılmış bir yapı var. Sana hangi yönden bakacağın sorulacak: önden, yandan ya da üstten. O yönden bakınca ne görünür? Doğru seçeneğe dokun.")],
"cause-effect":     [() => Q("Üstte bir olay resmi var; ona iyi bak. Bu olayın sonunda ne olur? Alttaki resimlerden bunun sonucunu gösterene dokun.")],
"sudoku":           [() => Q("Ekranda kutulardan oluşan bir tablo var; bazı kutular boş. Her satırda ve her sütunda her meyveden yalnız bir tane olmalı. Alttan bir meyve seç, sonra boş bir kutuya dokunarak onu yerleştir. Bütün boş kutuları doldur.")],
"num-pattern":      [() => Q("Ekranda bir sayı dizisi var; sayılar bir kurala göre değişiyor. Kuralı bul ve sıradaki sayının ne olacağını düşün; alttan o sayıya dokun.")],
"ran-letter":       [() => `Okuyun: ${Q("Ben ‘başla’ deyince harflerin adını soldan sağa, satır satır, olabildiğince hızlı söyle.")}`],
"pic-arrange":      [() => Q("Ekranda karışık duran resimler var; hepsi aynı olayı anlatıyor. Önce ne oldu, sonra ne oldu, en sonda ne oldu? Resimlere bu sırayla dokunarak sırala."), () => `Sıraladıktan sonra sorun: ${Q("Sıraladığın resimlere bak. Şimdi bu hikâyeyi başından sonuna bana anlat.")}`],
"matrix-fill":      [() => Q("Ekranda kutulardan oluşan bir tablo var; bir kutu boş. Satırlara ve sütunlara bak, nasıl bir düzen olduğunu bul. Boş kutuya hangisi gelmeli? Alttan ona dokun.")],
"balance":          [() => isPre() ? Q("Ekranda bir terazi var. Terazinin aşağı inen tarafı daha ağır demektir. Soruyu dinle ve teraziye bakarak doğru cevaba dokun.") : Q("Üstteki teraziler dengede; onlara bakarak hangi şeklin kaç daire ağırlığında olduğunu bul. Son teraziyi dengelemek için kaç daire gerekir? Alttan o sayıya dokun. Dairelerin rengi her soruda değişir.")],
"block-design":     [() => Q("Üstte bir model desen var. Alttaki bloklara dokunarak modelin tıpatıp aynısını yap; bir bloğa her dokunuşta rengi değişir. Bitince Bitti'ye bas."), () => Q("Üstte bir model desen var ama döndürülmüş duruyor; yanındaki ok modelin gerçek yukarısını gösteriyor. Deseni kafanda düzelt ve alttaki bloklara dokunarak düz hâlini yap. Bitince Bitti'ye bas.")],
"mental-rot":       [() => Q("Üstte bir şekil var. Alttaki seçeneklerden biri aynı şeklin döndürülmüş hâli, diğerleri farklı. Şekli kafanda çevir ve aynı olana dokun.")],
"clutter-find":     [() => Q(`Ekranda birbirine karışmış pek çok resim var. Bunların arasında saklanan bütün ${clutTarget || "hedef"} resimlerini bul ve her birine dokun.`)],
"overlap-count":    [() => Q(isPre() ? "Ekranda üst üste çizilmiş şekiller var. Bunların arasında kaç tane daire var? Say ve alttan o sayıya dokun." : "Ekranda üst üste çizilmiş şekiller var. Bunların arasında kaç tane beşgen var? Say ve alttan o sayıya dokun.")],
"embedded":         [() => Q("Üstte kırmızı bir şekil var. Alttaki çizimlerden birinin içinde bu şekil aynen saklı. Hangi çizimin içinde olduğunu bul ve ona dokun.")],
"closure":          [() => Q("Üstte bir resim var ama yalnızca bir parçası görünüyor. Bu parça hangi resme ait? Alttan bütün resmi bul ve ona dokun.")],
"copy-design":      [() => Q("Üstte noktalar üzerine çizilmiş bir model var. Alttaki noktalara sırayla dokunarak aynı çizgileri çiz. Bitince Bitti'ye bas.")],
"symmetry":         [() => Q("Ortadaki kırmızı çizgi bir ayna. Bir tarafta boyalı kareler var. Öbür tarafı aynadaki görüntüsü gibi, tam karşılıklı olacak şekilde boya. Bitince Bitti'ye bas.")],
"maze":             [() => Q("Bu bir labirent. Topu yıldıza götüreceksin. Gitmek istediğin kareye dokunarak ilerle; duvarların içinden geçemezsin, yolu bul.")],
"vanalogy-touch":   [() => isPre() ? Q("Üstte bir ikili var; ikisi arasında bir ilişki var. Altta soru işaretli yarım bir ikili var. Üsttekine benzeyecek şekilde soru işaretinin yerine gelecek resme dokun.") : Q("Üstte bir ikili var; ikisi arasında bir ilişki var. Alttaki ikilide bir soru işareti var. İlk ikilideki ilişkiyi düşün; soru işaretinin yerine gelecek kelimeye dokun.")],
"word-pic":         [() => Q("Bir kelime okunacak; dinle. Ekrandaki resimlerden söyleneni gösteren resme dokun.")],
"absurd-say":       [() => isPre() ? `Resmi gösterin, sorun: ${Q("Bu resme iyi bak. Resimde yanlış ya da olmayacak bir şey var. Nedir, bul ve söyle.")}` : `Cümleyi okuyun (uygulama da okur): ${Q("Sana bir cümle okuyacağım. Bu cümlede mantıksız bir şey var. Nedir, bul; neden mantıksız, açıkla.")}`],
"analogy-say":      [() => `Okuyun: ${Q("Sana bir ikili söyleyeceğim; ikisi arasında bir ilişki var. Sonra yarım bir ikili söyleyeceğim. İlk ikilideki ilişkiyi düşün ve ikinciyi aynı şekilde tamamla.")}`],
"proverb-say":      [() => isPre() ? `Okuyun: ${Q("Sana bir söz okuyacağım. Bu gerçekten öyle mi olur? Bu söz ne demek istiyor, anlat.")}` : `Okuyun: ${Q("Sana bir atasözü ya da benzetme okuyacağım. Bu söz aslında ne anlatmak istiyor? Açıkla.")}`],
"infer-say":        [() => `Okuyun: ${Q("Sana kısa bir durum anlatacağım; dinle. Sence ne olmuş olabilir? İpuçlarına bakarak tahmin et ve anlat.")}`],
"homonym-say":      [() => `Okuyun: ${Q("Sana bir kelime söyleyeceğim. Bu kelimenin birbirinden farklı iki anlamı var. İkisini de söyle.")}`],
"proverb-touch":    [() => Q("Ekranda bir atasözü ya da deyim var; oku. Altındaki seçeneklerden bu sözün asıl anlatmak istediği anlama dokun.")],
"absurd-touch":     [() => Q(!isPre() && currentCombo().t === 2 ? "İki cümle okunacak; dinle. Yapılan davranış amaca uyuyorsa Doğru'ya, uymuyorsa Saçma'ya dokun." : "Bir cümle okunacak; dinle. Cümle mantıklıysa Doğru'ya, saçmaysa Saçma'ya dokun.")],
"concept-touch":    [() => Q("Bir soru okunacak; dinle: ‘Hangisi masanın üstünde?’, ‘Hangisi daha büyük?’ gibi. Ekrandaki resimlerden söylenene uyana dokun.")],
"infer-touch":      [() => Q(currentCombo().t === 2 ? "İki cümle var; oku ya da dinle. İkisindeki ipuçlarını birleştir ve ne olmuş olabileceğini düşün. En uygun cevaba dokun." : currentCombo().t === 1 ? "Bir durum anlatılıyor; oku ya da dinle. İçinde iki ipucu var; ikisini birleştir ve ne olmuş olabileceğini düşün. En uygun cevaba dokun." : "Bir durum anlatılıyor; oku ya da dinle. İçindeki ipucuna göre ne olmuş olabileceğini düşün. En uygun cevaba dokun.")],
"dot-count":        [() => Q(Math.min(currentCombo().t, 2) === 0 ? "Ekranda noktalar çok kısa bir süre görünüp kaybolacak. Kaç tane nokta gördüysen alttan o sayıya dokun." : "Ekranda resimler çok kısa bir süre görünüp kaybolacak. Kaç tane resim gördüysen alttan o sayıya dokun.")],
"sem-decide":       [() => { const t = currentCombo().t; return Q(t === 0 ? "Üstte bir soru var; altta resimler tek tek gelecek. Her resim için soruya göre hızlıca Evet ya da Hayır'a dokun." : t === 1 ? "Üstteki soru iki resimde bir değişecek. Her resimde soruyu oku, ona göre hızlıca Evet ya da Hayır'a dokun." : "Üstteki soru her resimde değişecek. Her resimde soruyu oku, ona göre hızlıca Evet ya da Hayır'a dokun."); }],
"eye-touch":        [() => Q("Ekranda kayan bir top var. Topu gözünle izle ve yakalamak için üstüne dokun.")],
"alt-uses":         [() => `Okuyun ve ▶'a basın: ${Q(`${fluPrompt("alt-uses").say} Aklına gelen her kullanımı söyle; gerçek kullanımı dışında olsun yeter.`)}`],
"time-est":         [() => Q("Sana bir süre söylenecek, mesela 10 saniye. Başla'ya bas ve içinden say. Söylenen süre dolduğunu düşündüğün anda Dur'a bas. Saate bakmak yok.")],
"find-error": [() => Q("Sana bir kural söylenecek; dinle. Ekrandaki resimlere bak; kurala uymayanları bul ve her birine dokun. Hepsini bulunca sıradaki kendiliğinden gelir.")],
"cups":             [() => Q("Bardaklardan birinin altında top var; hangi bardakta olduğuna iyi bak. Bardaklar karışacak. Durunca topun olduğu bardağa dokun.")],
"mental-math":      [() => isPre() ? Q("Kutuya nesneler girecek, bazıları çıkacak; iyi izle. Sonunda kutuda kaç tane kaldığını alttaki sayılardan seç.") : Q("Sayılar ve işlemler tek tek gelecek; hepsini aklında tut ve hesapla. Sonunda sonucu seç.")],
"who-said":         [() => Q("Ekranda çocuklar var ve her biri bir şey söyleyecek; kimin ne söylediğini dinle ve aklında tut. Sonra bir resim gelecek; onu kimin söylediğini seç.")],
"rhythm":           [() => Q("Bir ritim çalacak; dikkatle dinle. Bitince davula aynı ritimle vur.")],
"memory-cards":     [() => Q("Kartlar kapalı duruyor. Kartları ikişer ikişer aç; aynı resim çıkarsa eşleşir ve açık kalır. Farklı çıkarsa kapanır; yerlerini aklında tut. Bütün eşleri bul.")],
"same-sound":       [() => Q("Bir ses söylenecek. Ekrandaki resimlerden adı bu sesle başlayanların hepsine dokun; bitince Bitti'ye bas.")],
"rhyme-touch":      [() => Q("İki kelime okunacak; dinle. İkisinin sonu aynı biterse ‘Benziyor’a, bitmezse ‘Benzemiyor’a dokun.")],
"syn-touch":        [() => Q("Ekranda bir kelime var. Altındaki kelimelerden onunla aynı anlama gelene dokun.")],
"seq-words":        [() => isPre() ? Q("Ekranda hayvanlar var. Onları gerçek hayattaki boylarına göre en küçükten en büyüğe sırayla dokunarak diz.") : Q("Ekranda kelimeler karışık duruyor. Onları doğru sıraya diz: önce ilk geleni, sonra sıradakini seç.")],
"part-whole":       [() => isPre() ? Q("Bir soru okunacak; dinle: ‘Tekerlek neyin parçası?’ gibi. Resimlerden doğru olana dokun.") : Q("Ekrandaki soruyu oku: bir şeyin parçası ya da bütünü soruluyor. Kelimelerden doğru olana dokun.")],
"flu-cat":          [() => `Okuyun ve ▶'a basın: ${Q(`${fluPrompt("flu-cat").say} Aklına gelen her şeyi söyle; olabildiğince çok söyle ama aynı kelimeyi iki kez söyleme.`)}`],
"flu-letter":       [() => `Okuyun ve ▶'a basın: ${Q(`${fluPrompt("flu-letter").say} İnsan adı ve yer adı söyleme; aynı kelimeyi de tekrar etme.`)}`],
"flu-switch":       [() => `Okuyun ve ▶'a basın: ${Q(`${fluPrompt("flu-switch").say} Hep bu sırayla devam et; olabildiğince çok söyle.`)}`],
"sort-pic":         [() => Q("Ekrana bir resim gelecek; altta grup kutuları var. Resim hangi gruba giriyorsa o grubun kutusuna dokun.")],
"group-say":        [() => `Kelimeleri okuyun: ${Q("Sana kelimeler okuyacağım. Bazıları birbiriyle ilgili, aynı gruptan. Hangilerinin birlikte olduğunu söyle ve her grubun adını söyle.")}`],
"free-sort":        [() => Q("Ekranda karışık resimler var; bazıları aynı gruptan. Önce bir renk seç, sonra aynı gruptan olan resimlere dokun; hepsi o renge boyanır. Başka bir grup için başka bir renk seç. Bitince Bitti'ye bas."), () => `Gruplar bitince sorun: ${Q("Bu gruptakilerin ortak adı ne? Bu gruba bir ad ver.")}`],
"move-seq":         [() => `Çocuk ayakta olsun, yakında bir masa bulunsun. ${Q("Sana birkaç hareket söyleyeceğim; dinle ve aklında tut, hemen yapma. Ben ‘şimdi yap’ deyince hareketleri aynı sırayla yap.")}`],
"story-order":      [() => Q("Sana resimli bir hikâye gösterilecek; izle ve dinle. Sonra resimler karışacak. Resimleri hikâyedeki doğru sıraya koy.")],
"what-do":          [() => `Resmi gösterin, soruyu okuyun (uygulama da okur): ${Q("Resme bak; burada bir sorun var. Bu durumda ne yapmalı? Anlat.")}`, () => `Cevaptan sonra sorun: ${Q("Neden öyle yapmalı? Nedenini de anlat.")}`],
"odd-cat":          [() => Q("Ekranda resimler var. Biri hariç hepsi aynı gruptan. Gruba uymayan resmi bul ve ona dokun.")],
"opp-touch":        [() => isPre() ? Q("Bir kelime okunacak; dinle. Söylenenin zıttını gösteren resme dokun.") : Q("Ekranda bir kelime var. Altındaki kelimelerden onun zıt anlamlısına dokun.")],
"syl-touch":        [() => Q("Bir resmin adı okunacak; dinle. Kelimeyi hecelerine ayırarak el çırp ve heceleri say. Sonra alttan doğru sayıya dokun.")],
"sim-touch":        [() => Q("Üstte birbirine benzeyen resimler var; onlara bak ve ortak yönlerini düşün. Alttaki resimlerden onlara benzeyene dokun.")],
"def-touch":        [() => Q("Bir şeyin tanımı okunacak ama adı söylenmeyecek; dinle. Anlatılan şeyin resmine dokun.")],
"use-touch":        [() => Q("Bir soru okunacak; dinle: ‘Saçını neyle tararsın?’ gibi. Ekrandaki resimlerden doğru olana dokun.")],
"size-touch":       [() => Q("Ekranda aynı şeyin farklı boylarda resimleri var. Önce en küçüğüne, sonra sırayla daha büyüğüne dokun; en büyükte bitir."), () => Q("Ekranda aynı şeyin farklı boylarda resimleri var. Önce en büyüğüne, sonra sırayla daha küçüğüne dokun; en küçükte bitir.")],
"arrow-touch":      [() => Q(Math.min(currentCombo().t, 2) === 2 ? "Ortada büyük bir ok var, etrafında küçük oklar da var; küçüklere aldırma. Büyük ok hangi yöne bakıyorsa alttan aynı yöne bakan oka dokun." : "Üstte bir ok var. Ok hangi yöne bakıyorsa alttan aynı yöne bakan oka dokun.")],
"edge-touch":       [() => Q("Ekranda bir şekil var. Kenarlarını say; sonra alttan doğru sayıya dokun.")],
"odd-touch":        [() => Q("Ekranda şekiller var; biri hariç hepsi birbirine benziyor. Farklı olanı bul ve ona dokun.")],
"pattern-touch":    [() => Q("Ekranda bir sıra var; sıradakiler bir düzene göre değişiyor: tekrar mı ediyor, büyüyor mu, dönüyor mu? Düzeni bul; soru işaretinin yerine gelecek olana dokun.")],
"analogy-touch":    [() => Q("Üstte bir ikili var; ilkinden ikincisine geçerken bir şey değişmiş. Ne değiştiğini bul. Aynı değişikliği alttaki şekle uygula; soru işaretinin yerine gelecek olana dokun.")],
"same-number":      [() => Q(`Ekranda rakamlar karışık duruyor. Bütün ${SN_PLURAL[snValid()]} bul ve her birine dokun. Rengi, boyu ya da eğikliği farklı olabilir; yine de aynı rakamdır.`) ],
"vis-face":         [() => Q("Ekranda yüzler var; her birine iyi bak ve aklında tut. Sonra daha çok yüz gelecek. Az önce gördüğün yüzlere dokun; bitince Bitti'ye bas."), () => Q("Ekranda yüzler var ve her birinin bir adı var; yüzleri ve adlarını aklında tut. Sonra sana bir ad söylenecek; o ada ait yüze dokun.")],
"scene-mem":        [() => `Resme birlikte bakın; kapanınca soruları sorun: ${Q("Ekranda bir resim var; ona iyice bak, resimde neler olduğunu aklında tut. Resim kapanınca sana sorular soracağım; cevapla.")}`],
"scene-touch":      [() => Q("Ekranda bir resim var; ona iyice bak, içinde neler olduğunu aklında tut. Resim kapanınca küçük resimler gelecek; büyük resimde olana dokun.")],
"vis-draw":         [() => Q("Noktaların üstünde bir çizgi var; çizginin hangi noktalardan geçtiğine iyi bak ve aklında tut. Çizgi kaybolunca noktalara sırayla dokunarak aynı çizgiyi çiz.")],
"list-learn":       [() => `Okuyun: ${Q("Sana kelimeler okuyacağım; dinle ve aklında tut. Bitince hatırladığın kelimeleri söyle; sıra önemli değil. Aynı listeyi birkaç kez okuyacağım.")}`, () => `Listeyi okumadan sorun: ${Q("Az önce okuduğum kelimeleri hatırlıyor musun? Aklında kalanları söyle.")}`],
"cat-list":         [() => `Okuyun: ${Q("Sana kelimeler okuyacağım; dinle ve aklında tut. Bitince hatırladığın kelimeleri söyle; sıra önemli değil.")}`],
"nonword":          [() => `Okuyun: ${Q("Sana uydurma kelimeler söyleyeceğim; bunların bir anlamı yok. Her kelimeyi dikkatle dinle ve duyduğun gibi tekrar et.")}`],
"sent-listen":      [() => `Göstermeden okuyun: ${Q("Sana bir cümle söyleyeceğim. Dikkatle dinle; bitince cümleyi aynen, hiç değiştirmeden tekrar et.")}`],
"pal-touch":        [() => Q("Ekranda ikişer ikişer resimler gelecek; her ikili birbirinin eşi. Onları izle ve dinle, kimin kiminle eş olduğunu aklında tut. Sonra tek bir resim gelecek; onun eşi olan resme dokun.")],
"word-pairs":       [() => `Okuyun: ${Q("Sana ikişer ikişer kelimeler okuyacağım; her ikili birbirinin arkadaşı. İyi dinle. Sonra ikilinin ilkini söyleyeceğim; arkadaşını sen söyle.")}`, () => `Okuyun: ${Q("Her sayının bir kelimesi var; sayı ve kelimeyi birlikte okuyacağım, aklında tut. Sonra sadece sayıyı söyleyeceğim; kelimesini sen söyle.")}`, () => `Okuyun: ${Q("Her çocuk bir şehirde yaşıyor; ismini ve şehrini okuyacağım, aklında tut. Sonra sadece ismi söyleyeceğim; şehrini sen söyle.")}`],
"mixed-span":       [() => `Göstermeden okuyun: ${Q("Sana bazı şeyler söyleyeceğim; sayılar, kelimeler karışık olabilir. Dikkatle dinle; bitince söylediklerimi aynı sırayla tekrar et.")}`],
"story-recall":     [() => `Okuyun: ${Q("Sana bir hikâye okuyacağım; dikkatle dinle. Bitince hikâyede hatırladığın her şeyi bana anlat.")}`, () => `Aşama 1'deki hikâyeyi okumadan sorun: ${Q("Az önce okuduğum hikâyeyi hatırlıyor musun? Onu bana baştan sona yeniden anlat.")}`],
"short-story":      [() => `Okuyun: ${Q("Ekrandaki resme bak; ben sana onunla ilgili kısa bir hikâye okuyacağım. Dikkatle dinle. Bitince sana sorular soracağım, cevapla.")}`],
"pic-seq-say":      [() => `Resimler tek tek görünecek. Kapanınca: ${Q("Resimler tek tek gelecek; her birine iyi bak ve aklında tut. Resimler kapanınca gördüğün resimleri sırayla söyle.")}`],
"pic-seq-touch":    [() => Q("Ekranda resimler var. Bazılarının adı sırayla okunacak; dinle ve sırayı aklında tut. Bitince resimlere duyduğun sırayla dokun.")],
"running":          [() => Q(`Resimler tek tek gelecek ama kaç tane geleceğini bilmiyorsun. Resimler bitince en son gelen ${runLast()} resmi hatırla ve onlara geliş sırasıyla dokun.`)],
"running-verbal":   [() => `Göstermeden okuyun: ${Q(`Sana kelimeler okuyacağım ama kaç tane olduğunu söylemeyeceğim. Dinle. Bittiğinde en son söylediğim ${runLast()} kelimeyi sırasıyla söyle.`)}`],
"zihni":            [() => Q(isPre() ? "Zihni bir kutuda duruyor; yerine iyi bak. Sonra oklar gelecek; oklar Zihni'nin nereye gittiğini gösterir. Zihni'nin gittiği kutuya dokun." : "Zihni bir kutuda duruyor; yerine iyi bak. Sonra komutlar gelecek: ‘bir sağa’, ‘iki yukarı’ gibi. Zihni'yi kafanda yürüt ve en son geldiği kutuya dokun.")],
"zihni-verbal":     [() => `Komutları okuyun: ${Q("Zihni bir kutuda duruyor. Ben komutları söyleyeceğim: ‘bir sağa’, ‘iki aşağı’ gibi. Zihni'yi kafanda yürüt; sonunda hangi kutuda olduğunu söyle.")}`],
"market":           [() => Q("Önce bir alışveriş listesi göreceksin; listedekileri aklında tut. Sonra balonlar gelecek, onları patlat. En sonda raftan listedeki şeyleri seç.")],
"market-verbal":    [() => `Listeyi okuyun: ${Q("Sana bir alışveriş listesi okuyacağım; aklında tut. Arada başka bir iş yapacağız. Sonra listedekileri bana söyle.")}`],
"corsi":            [() => Q("Ekranda mavi bloklar var. Bloklar sırayla yanıp sönecek; iyi bak. Bitince bloklara aynı sırayla dokun."), () => Q("Ekranda mavi bloklar var. Bloklar sırayla yanıp sönecek; iyi bak. Bitince bloklara TERSTEN dokun: en son yanana ilk, ilk yanana en son.")],
"corsi-verbal":     [() => `${Q("Ekranda numaralı bloklar var. Bloklar sırayla yanacak; iyi bak. Bitince yanan blokların numaralarını aynı sırayla söyle ya da parmağınla göster.")}`, () => `${Q("Ekranda numaralı bloklar var. Bloklar sırayla yanacak; iyi bak. Bitince yanan blokların numaralarını TERSTEN söyle ya da göster: en son yanandan ilk yanana.")}`],
"span-listen":      [() => `Göstermeden okuyun: ${Q("Sana cümleler okuyacağım. Her cümle için doğru mu yanlış mı söyle ve cümledeki nesneyi aklında tut. Bitince nesneleri sırayla söyle.")}`],
"span-read":        [() => Q("Cümleleri tek tek oku; her cümle için doğru mu yanlış mı söyle. Her cümledeki nesneyi aklında tut. Bitince nesneleri sırayla söyle.")],
"span-touch":       [() => Q("Sana cümleler okunacak. Her cümle doğruysa ✓'ye, yanlışsa ✗'e dokun. Her cümlenin resmini aklında tut. Bitince resimlere sırayla dokun.")],
"lns":              [() => `Göstermeden okuyun: ${Q("Sana sayılar ve harfler karışık okuyacağım. Bitince önce sayıları, sonra harfleri söyle.")}`, () => `Göstermeden okuyun: ${Q("Sana sayılar ve harfler karışık okuyacağım. Bitince önce sayıları küçükten büyüğe, sonra harfleri alfabe sırasıyla söyle.")}`],
"lns-touch":        [() => Q("Sayılar ve harfler karışık okunacak; dinle. Bitince önce sayılara, sonra harflere dokun."), () => Q("Sayılar ve harfler karışık okunacak; dinle. Bitince sayılara küçükten büyüğe, harflere alfabe sırasıyla dokun.")],
"animal-fruit":     [() => Q("Resimlere iyi bak ve hepsini aklında tut. Resimler kapanınca önce hayvanlara, sonra meyvelere dokun.")],
"rt-shapes":        [() => Q("Ekranda şekiller var; hepsine iyi bak ve aklında tut. Şekiller kapanınca daha çok şekil gelecek. Az önce gördüğün şekillere dokun.")],
"rt-position":      [() => Q("Ekranda daireler var; bazıları dolu, bazıları boş. Hangilerinin dolu olduğuna iyi bak ve aklında tut. Daireler kapanınca dolu olanların yerine dokun.")],
"rt-colors":        [() => Q("Ekranda renkler sırayla gösterilecek; sırayı iyi izle ve aklında tut. Renkler kapanınca aynı sırayla renklere dokun.")],
"wm-same":          [() => Q("Kartlar tek tek gelecek. İlk kartı sadece aklında tut. Sonra gelen her kart bir önceki kartla aynıysa AYNI'ya, farklıysa FARKLI'ya dokun."), () => Q("Kartlar tek tek gelecek. İlk iki kartı sadece aklında tut. Sonra gelen her kart iki önceki kartla aynıysa AYNI'ya, farklıysa FARKLI'ya dokun.")],
"wm-seq":           [() => Q("Ekranda oyuncaklar var. Oyuncaklar sırayla parlayacak; iyi bak. Bitince oyuncaklara aynı sırayla dokun."), () => Q("Ekranda oyuncaklar var. Oyuncaklar sırayla parlayacak; iyi bak. Bitince oyuncaklara TERSTEN dokun: en son parlayana ilk, ilk parlayana en son.")],
"wm-where":         [() => Q("Hayvanlar kutulara saklanacak; hangisinin hangi kutuya girdiğine iyi bak. Sonra bir hayvan sorulacak; o hayvanın saklandığı kutuya dokun.")],
"number-find":      [() => Q(`Ekranda karışık duran sayılar var. 1'den ${trNumSuffix(scatterCount(),"dat")} kadar sayıları sırayla bul ve parmağınla göster.`),
() => Q(`Ekranda karışık duran sayılar var. ${trNumSuffix(scatterCount(),"abl")} 1'e kadar sayıları geriye doğru bul ve parmağınla göster.`)],
"syllable-count":   [() => Q("Ekranda kelimeler var. Her kelimenin kaç heceli olduğunu söyle."), () => Q("Ekranda kelimeler var. Her kelimeyi hecelerine ayırarak söyle, sonra kaç hece olduğunu söyle.")],
"eye-horizontal":   [() => EYE("Top sağa sola gider.")],
"eye-vertical":     [() => EYE("Top yukarı aşağı gider.")],
"eye-diagonal":     [() => EYE("Top sol üstten sağ alta gider.")],
"eye-diagonal2":    [() => EYE("Top sağ üstten sol alta gider.")],
"eye-wave":         [() => EYE("Top dalgalanarak sağa sola gider.")],
"eye-steep-wave":   [() => EYE("Top dalgalanarak yukarı aşağı gider.")],
"eye-depth":        [() => EYE("Top büyüyüp küçülecek; sanki sana yaklaşıp uzaklaşıyor gibi.")],
"eye-square":       [() => EYE("Top kare çizer.")],
"eye-triangle":     [() => EYE("Top üçgen çizer.")],
"eye-star":         [() => EYE("Top yıldız çizer.")],
"eye-junction":     [() => EYE("Top yol ayrımlarına gelince beklenmedik bir yöne dönecek.")],
"eye-crossbox":     [() => EYE("Top kutunun kenarlarında ve çaprazlarında beklenmedik yönlere gidecek.")],
"eye-saccade-two":  [() => Q(`Ekranda bir top var; top bir yerden başka yere atlayacak. Başını hiç oynatma; top atladığı anda gözlerinle hemen ona bak. Top ${currentCombo().t === 2 ? "sağ ile sol, yukarı ile aşağı arasında" : "sağ ile sol arasında"} atlar.`)],
"eye-saccade-random":[() => Q("Ekranda bir top belirip kaybolacak; her seferinde başka bir yerde çıkacak. Başını hiç oynatma; top nerede belirirse gözlerinle hemen oraya bak.")],
"eye-saccade-reading":[() => Q("Top kitap okur gibi satır satır gidecek: soldan sağa gider, satır bitince alt satırın başına atlar. Başını hiç oynatma; topu sadece gözlerinle izle.")],
"stroop":           [() => `${Q("Ekranda renk adları yazıyor ama her kelime başka renkle yazılmış. Kelimeyi okuma; soldan sağa, satır satır her kelimenin yazı rengini söyle.")}`],
"day-night":        [() => Q("Ekranda güneşler ve aylar var. Tersini söyleyeceksin: güneş görünce ‘gece’ de, ay görünce ‘gündüz’ de. Soldan sağa, satır satır git.")],
"task-switch":      [() => switchSide === "back" ? Q("Ekranda taşıtlar var; bazılarının önü, bazılarının arkası görünüyor. Arkasını görüyorsan ‘arka’ de, önünü görüyorsan taşıtın adını söyle.") : Q("Ekranda taşıtlar var; bazılarının önü, bazılarının arkası görünüyor. Önünü görüyorsan ‘ön’ de, arkasını görüyorsan taşıtın adını söyle.")],
"go-no-go":         [() => Q(`Ekranda yüzler var. Soldan sağa, satır satır her yüzün duygusunu söyle. Ama ${stopFaceText()} yüz gelince sus, hiçbir şey söyleme.`), () => Q(`Ekranda yüzler var. Her yüzün duygusunu söyle. Ama ${stopFaceText()} yüz gelince sus, hiçbir şey söyleme.`)],
"flanker":          [() => Q(isPre() ? "Ekranda çerçeveler var; her çerçevede beş resim var. Yandakilere aldırma; her çerçevede yalnızca ORTADAKİ resmin adını söyle." : "Ekranda çerçeveler var; her çerçevede beş rakam var. Yandakilere aldırma; her çerçevede yalnızca ORTADAKİ rakamı söyle."),
() => `${Q("Ekranda çerçeveler var; her çerçevede beş şey var. Bazen beşi de aynı olacak, bazen ortadaki farklı; yandakilere aldanma, her çerçevede yalnızca ORTADAKİNİ söyle.")}`],
"touch-animal":     [() => `<b>"Ekranda hayvanlar ve DUR kartları var. Bütün hayvanlara hızlıca dokun. ${trUpper(cardName(taStopColor))}</b> ${swatch(taStopColor)} <b>DUR kartına dokunma.${currentCombo().t > 0 ? " Başka renkteki DUR kartlarına dokunabilirsin." : ""}"</b>`, () => `<b>"Ekranda eşyalar ve DUR kartları var. Bütün eşyalara hızlıca dokun. ${trUpper(cardName(taStopColor))}</b> ${swatch(taStopColor)} <b>DUR kartına dokunma.${currentCombo().t > 0 ? " Başka renkteki DUR kartlarına dokunabilirsin." : ""}"</b>`],
"touch-card":       [() => `<b>"Ekranda renkli kartlar var. Yalnızca ${trUpper(cardName(tcTarget))}</b> ${swatch(tcTarget)} <b>kartlara hızlıca dokun; diğer renklere dokunma."</b>`],
"sort-color-shape":       [() => sortShort()],
"sort-animal-size":       [() => sortShort()],
"sort-color-shape-count": [() => sortShort()],
"sort-words":             [() => sortShort()],
"number-letter":    [() => Q(`Ekranda sayılar ve harfler karışık duruyor. BAŞLA yazan yerden başla; bir sayı, bir harf diye sırayla dokun: ${trailExampleText(5)} … En sona kadar git.`), () => Q(`Ekranda karışık harfler ve sayılar var. Harften başlayacaksın; bir harf, bir sayı diye sırayla dokun: ${trailExampleText(5)} … En sona kadar git.`)],
"trail-number-month":[() => Q(`Ekranda sayılar ve ay adları karışık duruyor. BAŞLA yazan yerden başla; bir sayı, bir ay diye sırayla dokun: ${trailExampleText(6)} … En sona kadar git.`)],
"trail-animal-fruit":[() => Q("Üstteki yol kartında bir sıra var: bir hayvan, bir meyve. Ekranda resimler karışık duruyor. BAŞLA yazan yerden başla; yol kartındaki sırayla, bir hayvan bir meyve diye dokun.")],
"trail-color-shape": [() => Q("Üstteki yol kartında bir sıra var: bir renk, bir şekil. Ekranda kartlar karışık duruyor. BAŞLA yazan yerden başla; yol kartındaki sırayla, bir renk bir şekil diye dokun.")],
"plan-swap":        [() => Q("Üstte hedef sıra, altta renkli küpler var. İki küpe dokununca yerleri değişir. Önce düşün; küpleri en az hamleyle hedefteki sıraya diz.")],
"plan-beads":       [() => Q("Üstte hedef dizilim, altta çubuklara dizilmiş boncuklar var. Bir çubuğa dokununca en üstteki boncuk kalkar; başka bir çubuğa dokununca oraya konur. Dokunmadan önce düşün ve boncukları hedefteki gibi diz."), () => Q("Önce birkaç saniye sadece düşüneceksin, sonra dokunabileceksin. Boncukları hedefteki gibi diz.")],
"plan-tol":         [() => `${Q("Üstte hedef, altta üç bardak ve renkli pullar var. Bir bardağa dokununca üstteki pul kalkar; başka bardağa dokununca oraya konur. Bardaklar farklı sayıda pul alır. Dokunmadan önce zihninde planla; pulları en az hamleyle hedefteki gibi diz.")}`, () => `${Q("Önce birkaç saniye sadece bakıp planlayacaksın, sonra dokunabileceksin. Pulları en az hamleyle hedefteki gibi diz.")}`],
"plan-cubes":       [() => Q("Üstte hedef, altta küp kuleleri var. Bir kuleye dokununca en üstteki küp kalkar; başka kuleye dokununca oraya konur. Yalnızca en üstteki küpü taşıyabilirsin. Önce zihninde planla; küpleri en az hamleyle hedefteki gibi diz.")],
"nback-shape":      [() => NB_SEQ_NOTE + Q("Hayvanlar tek tek gelecek. Her yeni hayvan gelince, ondan BİR ÖNCE gelen hayvanın adını söyle. İlk hayvanda bir şey söyleme, sadece aklında tut."), () => NB_SEQ_NOTE + Q("Hayvanlar tek tek gelecek. Her yeni hayvan gelince, ondan İKİ ÖNCE gelen hayvanın adını söyle. İlk iki hayvanda bir şey söyleme, sadece aklında tut.")],
"nback-color":      [() => NB_SEQ_NOTE + Q("Taşıtlar tek tek gelecek. Her yeni taşıt gelince, ondan BİR ÖNCE gelen taşıtın adını söyle. İlk taşıtta bir şey söyleme, sadece aklında tut."), () => NB_SEQ_NOTE + Q("Taşıtlar tek tek gelecek. Her yeni taşıt gelince, ondan İKİ ÖNCE gelen taşıtın adını söyle. İlk iki taşıtta bir şey söyleme, sadece aklında tut.")],
"nback-number":     [() => NB_SEQ_NOTE + Q("Sayılar tek tek gelecek. Her yeni sayı gelince, ondan BİR ÖNCE gelen sayıyı söyle. İlk sayıda bir şey söyleme, sadece aklında tut."), () => NB_SEQ_NOTE + Q("Sayılar tek tek gelecek. Her yeni sayı gelince, ondan İKİ ÖNCE gelen sayıyı söyle. İlk iki sayıda bir şey söyleme, sadece aklında tut.")],
"digit-span":       [() => `Rakamları birlikte okuyun. Kapanınca: ${Q("Ekranda rakamlar var; onları birlikte okuyacağız ve sen aklında tutacaksın. Rakamlar kapanınca onları aynı sırayla söyle.")}`, () => `Rakamları birlikte okuyun. Kapanınca: ${Q("Ekranda rakamlar var; onları birlikte okuyup aklında tutacaksın. Rakamlar kapanınca onları tersten söyle: en sondakinden başla, ilkte bitir.")}`],
"word-order":       [() => `Göstermeden okuyun: ${Q(`Sana ${audLen()} kelime okuyacağım. Bitince aynı sırayla tekrar et.`)}`, () => `Göstermeden okuyun: ${Q(`Sana ${audLen()} kelime okuyacağım. Bitince tersten söyle: en son söylediğimden başla.`)}`, () => `Göstermeden okuyun: ${Q(`Sana ${audLen()} hayvan adı okuyacağım. Bitince onları küçükten büyüğe sırala ve söyle.`)}`],
"prospective-event":[() => `Başlamadan önce: ${Q(`Resimler gelecek; her resmin adını söyle. Ama ${peObjName(peObjTriggers[0])} görünce adını söylemeden önce masaya vur.`)}`,
() => `Başlamadan önce: ${Q(`Resimler gelecek; her resmin adını söyle. ${peObjName(peObjTriggers[0])} görünce masaya vur, ${peObjName(peObjTriggers[1] || peObjTriggers[0])} görünce alkışla.`)}`],
"prospective-time": [() => `Başlamadan önce: ${Q(`Deniz canlıları gelecek; her birinin adını söyle. Bir de kronometreye göz at: ${ptTimes[0]}. saniyeye gelince dur ve o anda ekranda olan canlıyı söyle.`)}`,
() => `Başlamadan önce: ${Q(`Deniz canlıları gelecek; her birinin adını söyle. Bir de kronometreye göz at: ${ptTimes[0]}. ve ${ptTimes[1] || ptTimes[0] + 15}. saniyelerde dur ve o anda ekranda olan canlıyı söyle.`)}`],
"prospective-delayed":[() => `Başlamadan önce: ${Q(`Oyuncaklar gelecek; her birinin adını söyle. Oyun bitince ${pdTask}; bunu unutma.`)}`,
() => `Başlamadan önce: ${Q(`Oyuncaklar gelecek; her birinin adını söyle. Oyun bitince ${pdTask}; bunu unutma.`)}`],
"word-list-recall": [() => `Kelimeleri birlikte okuyun. Kapanınca: ${Q("Ekranda kelimeler var; onları birlikte okuyacağız ve sen aklında tutacaksın. Kelimeler kapanınca hatırladığın kelimeleri söyle; sıra önemli değil.")}`, () => `Kapanınca: ${Q("Ekranda kelimeler var; onları birlikte okuyup aklında tutacaksın. Kelimeler kapanınca onları aynı sırayla söyle.")}`, () => `Kelimeler gizli; Başlat'a basın, uygulama okusun. Bitince: ${Q("Kelimeleri görmeyeceksin, sadece duyacaksın. Dikkatle dinle; bitince duyduğun kelimeleri söyle.")}`],
"sentence-repeat":  [() => `Öbekleri birlikte okuyun. Kapanınca: ${Q("Ekranda kısa söz öbekleri var; onları birlikte okuyacağız ve sen aklında tutacaksın. Kapanınca hatırladıklarını söyle.")}`, () => `Kapanınca: ${Q("Ekranda kısa söz öbekleri var; onları birlikte okuyup aklında tutacaksın. Kapanınca onları aynı sırayla söyle.")}`, () => `Öbekler gizli; Başlat'a basın, uygulama okusun. Bitince: ${Q("Söz öbeklerini görmeyeceksin, sadece duyacaksın. Dikkatle dinle; bitince duyduklarını söyle.")}`],
"word-repeat":      [() => `Göstermeden okuyun: ${Q(`Sana ${audLen()} kelime söyleyeceğim; dikkatle dinle. Bitince kelimeleri aynı sırayla tekrar et.`)}`,
() => `Göstermeden okuyun, ⏱'a basın: ${Q(`Sana ${audLen()} kelime söyleyeceğim; dinle ve aklında tut ama hemen söyleme. Biraz bekleyeceğiz; ben ‘söyle’ deyince kelimeleri aynı sırayla söyle.`)}`],
"shape-recall":     [() => `Şekilleri birlikte inceleyin. Kapanınca: ${Q("Ekranda şekiller var; onlara iyi bak ve aklında tut. Şekiller kapanınca hangi şekilleri gördüğünü söyle.")}`, () => `Kapanınca: ${Q("Ekranda renkli şekiller var; şekillere ve renklerine iyi bak. Şekiller kapanınca her şekli rengiyle birlikte söyle: ‘mavi üçgen’ gibi.")}`],
"position-recall":  [() => `Dolu daireleri birlikte inceleyin. Kapanınca: ${Q("Ekranda daireler var; bazıları dolu. Dolu dairelerin yerine iyi bak ve aklında tut. Daireler kapanınca hangilerinin dolu olduğunu söyle.")}`, () => `Kapanınca: ${Q("Ekranda daireler var; bazıları dolu. Dolu dairelerin yerine iyi bak. Daireler kapanınca dolu daireleri soldan sağa sırayla söyle.")}`],
"color-recall":     [() => `Renkleri birlikte inceleyin. Kapanınca: ${Q("Ekranda renkli kartlar var; renklere iyi bak ve aklında tut. Kartlar kapanınca hangi renkleri gördüğünü söyle.")}`, () => `Kapanınca: ${Q("Ekranda renkli kartlar var; renklere ve sıralarına iyi bak. Kartlar kapanınca renkleri soldan sağa, aynı sırayla söyle.")}`],
"word-group":       [() => `Seçenek vermeden sorun: ${Q("Ekranda kelimeler var. Her kelime için hangi grubun üyesi olduğunu söyle: hayvan, taşıt, giysi gibi.")}`, () => Q("Ekranda kelimeler var. Her kelime için önce grubunun adını söyle, sonra o gruptan bir örnek daha söyle.")],
"opposite-match":   [() => Q("Ekranda kelimeler var. Her kelimenin zıt anlamlısını söyle: ‘sıcak’ için ‘soğuk’ gibi.")],
"similarities":     [() => Q("Ekranda ikişer kelime var. Her ikili için bu iki şeyin ortak yönünü söyle: ikisi de ne? Neden birbirine benziyorlar?"), () => Q("Ekranda ikişer kelime var. Her ikili için önce ortak yönlerini söyle, sonra aynı gruptan bir örnek daha söyle.")],
"vocabulary":       [() => Q("Ekranda kelimeler var. Her kelime için ne demek olduğunu kendi sözlerinle anlat."), () => Q("Ekranda kelimeler var. Her kelime için önce anlamını söyle, sonra o kelimeyi bir cümlenin içinde kullan.")],
"practical-reasoning":[() => `Soruyu okuyun: ${Q("Sana bir durum anlatacağım. Sen böyle bir durumda ne yaparsın? Anlat.")}`, () => `Soruyu okuyun: ${Q("Sana bir durum anlatacağım. Böyle bir durumda ne yaparsın ve neden öyle yaparsın? Anlat.")}`],
"size-sort":        [() => Q("Ekranda aynı şeyin küçük, orta ve büyük hâlleri var. Soldan sağa, satır satır her biri için küçük mü, orta mı, büyük mü olduğunu söyle.")],
"arrow-direction":  [() => Q("Ekranda oklar var. Soldan sağa, satır satır her ok için yukarı mı aşağı mı baktığını söyle."), () => Q("Ekranda oklar var. Her ok için hangi yöne baktığını söyle: yukarı, aşağı ya da sağ."), () => Q("Ekranda oklar var. Her ok için hangi yöne baktığını söyle: yukarı, aşağı, sağ ya da sol.")],
"edge-count":       [() => Q("Ekranda şekiller var. Her şekil için kenarlarını say ve kaç kenarı olduğunu söyle.")],
"visual-opposites": [() => Q("Ekranda resimler var. Her resim için ne gördüğünü bir kelimeyle söyle: uzun mu kısa mı, dolu mu boş mu, içinde mi dışında mı gibi."), () => Q("Ekranda resimler var. Her resim için önce gördüğünü söyle, sonra onun zıttını söyle.")],

"odd-one-out":      [() => Q("Ekranda üçer şekilden oluşan sıralar var. Her sırada iki şekil birbirine benziyor, biri farklı. Farklı olanın kaçıncı olduğunu söyle: 1, 2 ya da 3."), () => Q("Ekranda üçer şekilden oluşan sıralar var. Her sırada farklı olanın kaçıncı olduğunu söyle, sonra neden farklı olduğunu açıkla: rengi mi, şekli mi, boyu mu?")],
"sequence-pattern": [() => Q("Ekranda renkli şekillerden oluşan sıralar var; renkler belli bir düzenle tekrar ediyor. Düzeni bul ve soru işaretinin yerine hangi rengin geleceğini söyle."), () => Q("Ekranda renkler üçlü bir düzenle tekrar ediyor. Düzeni bul ve soru işaretinin yerine hangi rengin geleceğini söyle.")],
"visual-analogy":   [() => Q("Ekranda ikişer ikili var: ilk ikilide bir şey değişiyor. Aynı değişiklik ikinci ikilide de olacak. Soru işaretinin yerine hangi renk gelir? Söyle."), () => Q("Ekranda ikişer ikili var: ilk ikilide bir şey değişiyor. O değişikliği bul. Soru işaretinin yerine ne gelir? Şeklini ve rengini söyle.")]
};
const STRATEGIES = (() => {
const finger = [0, "Parmakla İzle", "Parmağınla her birinin altını göster, satır satır ilerle."];
const scan = [0, "Sistemli Tara", "Soldan sağa, satır satır bak; hiçbirini atlama."];
const nback = [1, "Sesli Tekrarla", "Her yenisi gelince son ikisini içinden tekrar et."];
const rule = (r) => [0, "Kuralı Söyle", `Her karttan önce kuralı sesli söyle: ‘Şimdi ${r} göre.’ Yanlış olursa yeni kuralı ara.`];
const trail = [0, "Sıradakini Söyle", "Dokunmadan önce sıradakini sesli söyle."];
const plan = [0, "Sesli Düşün", "Başlamadan hedefe bak; ilk hamleni sesli söyle, sonra yap."];
const stop = [0, "Dur–Bak–Yap", "Her resimde önce içinden ‘dur, bak’ de; sonra karar ver."];
const span = [0, "İçinden Tekrarla", "Her cümleden sonra hatırlayacaklarını baştan içinden söyle."];
const pros = [0, "Kendine Söz Ver", "Başlamadan görevi bir cümleyle söyle ve o anı gözünde canlandır."];
const rehearse = [0, "İçinden Tekrarla", "Duydukça kelimeleri baştan içinden tekrar et."];
return {
"shape-color":finger, "object-name":finger, "fruit-veg":finger, "number-color":finger, "taste-name":finger, "hot-cold":finger, "living-nonliving":finger,
"trail-numbers":[0, "Sesli Say", "Dokunurken sayıları sesli söyle: bir, iki, üç…"],
"search-object":scan, "search-symbol":scan, "search-shape":scan, "search-letter":scan, "number-find":scan,
"cat-cold":scan, "cat-living":scan, "cat-fruit":scan, "touch-card":scan, "pairs-touch":scan,
"sdmt-touch":[0, "Adlandır", "Başlamadan anahtardaki eşleri adlarıyla sesli söyle."],
"symbol-image":[0, "Adlandır", "Başlamadan anahtardaki eşleri adlarıyla sesli söyle."],
"origin-order":[0, "Kendine Sor", "Her resimde kendine sor: ‘Bundan önce ne vardı?’"],
"stroop":[0, "Kendine Söyle", "Kelimeyi okuma; içinden ‘rengine bak’ de, sonra söyle."],
"stroop-touch":[0, "Kendine Söyle", "Kelimeyi okuma; içinden ‘rengine bak’ de, sonra dokun."],
"day-night":[0, "Kendine Söyle", "Resmi görünce içinden ‘tersi’ de, sonra söyle."],
"day-night-touch":[0, "Kendine Söyle", "Resmi görünce içinden ‘tersi’ de, sonra dokun."],
"go-no-go":stop, "face-go":stop, "touch-animal":stop,
"fish-flanker":[0, "Ortaya Odaklan", "Önce ortadaki balığı parmağınla göster, sonra yönünü seç."],
"flanker":[0, "Ortaya Odaklan", "Önce ortadakini parmağınla göster, sonra söyle."],
"task-switch":[0, "Kuralı Söyle", "Her kartta önce kuralı sesli söyle, sonra cevap ver."],
"switch-touch":[0, "Kuralı Söyle", "Her kartta önce kuralı sesli söyle, sonra dokun."],
"sort-color-shape":rule("renge"), "sort-animal-size":rule("hayvana"), "sort-color-shape-count":rule("renge"), "sort-words":rule("kategoriye"),
"number-letter":trail, "trail-number-month":trail, "trail-animal-fruit":trail, "trail-color-shape":trail,
"plan-beads":plan, "plan-swap":plan, "plan-tol":plan, "plan-cubes":plan,
"nback-shape":nback, "nback-color":nback, "nback-number":nback, "wm-same":nback,
"corsi":[0, "Yolu Hayal Et", "Blokların yolunu bir şekle benzet: çizgi, köşe, zikzak…"],
"corsi-verbal":[0, "Yolu Hayal Et", "Blokların yolunu bir şekle benzet: çizgi, köşe, zikzak…"],
"market":[0, "Grupla", "Ürünleri gruplara ayır ve gruplar hâlinde aklında tut."],
"market-verbal":[0, "Grupla", "Ürünleri gruplara ayır ve gruplar hâlinde aklında tut."],
"span-listen":span, "span-read":span, "span-touch":span,
"zihni":[0, "Kendine Söyle", "Her oktan sonra Zihni'nin yerini kendine söyle."],
"zihni-verbal":[0, "Kendine Söyle", "Her komuttan sonra Zihni'nin yerini kendine söyle."],
"lns":[0, "Ayır", "Duyarken sayıları bir kutuya, harfleri diğerine koyduğunu hayal et."],
"lns-touch":[0, "Ayır", "Sayıları bir kutuya, harfleri diğerine koyduğunu hayal et."],
"animal-fruit":[0, "Ayır", "Hayvanları bir kutuya, meyveleri diğerine koyduğunu hayal et."],
"digit-span":[0, "Parçala", "Rakamları telefon numarası gibi ikişer üçer grupla."],
"running":[0, "Sonuncuları Tekrarla", "Her yenisi gelince sondakileri içinden yeniden söyle."],
"running-verbal":[0, "Sonuncuları Tekrarla", "Her yenisi gelince sondakileri içinden yeniden söyle."],
"wm-seq":[0, "Adlandır", "Her resmin adını içinden söyle, diziyi baştan tekrarla."],
"word-order":[0, "Hayal Et", "Kelimeleri bir trenin vagonlarına dizdiğini hayal et."],
"wm-where":[0, "Adıyla Söyle", "Her saklananı adı ve yeriyle kendine söyle."],
"prospective-event":pros, "prospective-time":pros, "prospective-delayed":pros,
"pic-seq-say":[0, "İçinden Tekrarla", "Her yeni resimde baştan içinden say."],
"hear-find":rehearse, "pic-seq-touch":rehearse,
"dir-follow":[0, "Tekrarla", "Yönergeyi duyunca bir kez içinden söyle, sonra dokun."],
"sentence-repeat":[0, "Hayal Et", "Her öbeği gözünde canlandır: kırmızı bir top, büyük bir ev…"],
"sent-listen":[0, "Hayal Et", "Cümleyi dinlerken bir resim gibi gözünde canlandır."],
"short-story":[0, "Hayal Et", "Dinlerken hikâyeyi bir film gibi gözünde canlandır."],
"rt-position":[0, "Şekle Benzet", "Dolu daireler neye benziyor? Bir çizgi mi, bir harf mi?"],
"rt-shapes":[0, "Adlandır", "Bakarken her şekli sesli söyle: mavi üçgen, yeşil kalp…"],
"rt-colors":[0, "Sesli Söyle", "Renkleri görünce sırayla sesli söyle."],
"vis-miss":[0, "Adlandır", "Bakarken resimlerin adlarını sırayla söyle."],
"vis-chg":[0, "Sistemli Bak", "Satır satır bak, adlarını içinden söyle."],
"vis-recog":[0, "Adlandır", "Her resmi görünce adını söyle ve bir şeye benzet."],
"vis-face":[1, "İsimle Özellik", "Her yüzün bir özelliğini bul, adıyla birleştir: gözlüklü, kıvırcık saçlı…"],
"scene-mem":[0, "Sesli Say", "Bakarken resimde gördüklerini sesli say."],
"scene-touch":[0, "Sistemli Bak", "Resme soldan sağa bak, gördüklerinin adını içinden söyle."],
"vis-draw":[0, "Şekle Benzet", "Çizgi neye benziyor? Bir harf mi, bir dağ mı? Kendine söyle."],
"word-group":[0, "Kendine Sor", "Kendine sor: Bu nedir? Hangi büyük grubun içinde yer alır?"],
"opposite-match":[0, "Resmini Düşün", "Kelimenin resmini gözünde canlandır, sonra tersini düşün."],
"syllable-count":[0, "El Çırp", "Her hecede bir el çırp, sonra say."],
"similarities":[0, "Kendine Sor", "Kendine sor: İkisi nerede bulunur, ne işe yarar, nasıl görünür? Ortak olanı bul."],
"vocabulary":[0, "Kendine Sor", "Kendine sor: Bu nedir? Nerede bulunur? Ne işe yarar?"],
"practical-reasoning":[0, "Sesli Düşün", "Önce ne olduğunu, sonra ne yapabileceğini sesli söyle."],
"size-sort":[0, "İkişer Karşılaştır", "İkişer ikişer karşılaştır: hangisi daha büyük?"],
"arrow-direction":[0, "Elinle Göster", "Okun yönünü önce elinle göster, sonra söyle."],
"edge-count":[0, "Parmakla Say", "Bir köşeden başla, parmağınla kenarlara dokunarak say."],

"clue-find":[0, "Tek Tek Ele", "Her ipucundan sonra uymayanları içinden ele; geriye kalana bak."],
"class-table":[0, "Satır ve Sütun", "Parmağınla satırın rengini, sütunun şeklini göster; ikisi de uyuyor mu?"],
"color-obj":[0, "Birlikte Söyle", "Her resmi rengiyle birlikte içinden söyle: 'kırmızı top'."],
"pic-order":[0, "Hikâye Kur", "Resimlerden kısa bir hikâye uydur; hikâye sırayı hatırlatır."],
"finger-trace":[0, "Gözün Topta", "Gözünü toptan ayırma; parmağın gözünü izlesin."],
"listen-answer":[0, "Önce–Sonra", "Hikâyeyi dinlerken 'önce, sonra, en son' diye içinden sırala."],
"rhyme-done":[0, "Ritimle Söyle", "Tekerlemeyi el çırparak, ritimle söyle; son sözcük kendiliğinden gelir."],
"new-word":[0, "Adı Bir Şeye Bağla", "Adı yaratığın bir özelliğiyle bağla: 'tomi'nin tek gözü var'."],
"sent-pic":[0, "Kim Kime?", "Kendine sor: Kim yapıyor? Kime yapıyor? Sonra resimlere bak."],
"pair-match":[0, "Sistemli Tara", "Soldan başla; ilk tanenin aynısını ara, yoksa ikinciye geç."],
"periph":[0, "Geniş Bak", "Gözün noktada; ekranın tamamını aynı anda görmeye çalış."],
"dual-task":[0, "Sesli Say", "Bipleri içinden 'bir, iki, üç' diye say; dokunurken saymayı bırakma."],
"stop-signal":[0, "Bekle ve Bak", "Basmadan önce bir an oka bak; kırmızı mı?"],
"look-first":[0, "Parça Parça Karşılaştır", "Çatı, kapı, pencere, baca, bayrak, ağaç: her birini sırayla karşılaştır."],
"keep-track":[0, "Grubu Güncelle", "Her resimde içinden söyle: ‘hayvan: artık kedi.’ Eskisini unut."],
"zoo-map":[0, "Önce Çiz, Sonra Git", "Dokunmadan önce rotayı parmağınla havada göster; sonra sırayla git."],
"key-search":[0, "Sistemli Tara", "Bir köşeden başla; satır satır ya da halka halka ilerle, boş yer bırakma."],
"water-jars":[0, "Sesli Düşün", "Her hamleden önce söyle: ‘Dolu kapta kaç var, boşta kaç yer var?’"],
"design-fluency":[0, "Kuralla Üret", "Bir deseni al, tek çizgisini değiştir; sonra bir çizgi ekle."],
"twenty-q":[0, "Grupla Sor", "Tek tek sorma; ‘hayvan mı, yenir mi, büyük mü’ diye yarısını eleyen sorular sor."],
"box-search":[0, "Sırayla Tara", "Her aramaya aynı köşeden başla, sırayla ilerle; bulduğunu atla."],
"three-tasks":[0, "Dönüşümlü Git", "A1 → B1 → C1 → A2 → B2 → C2 sırasını önceden kur."],
"cog-est":[0, "Bilinenle Kıyasla", "Bildiğin bir şeyle karşılaştır: ‘Benden uzun mu, araba kadar mı?’"],
"fist":[0, "Boyutları Say", "Önce renklere bak, sonra şekillere, sonra boyutlara: hangi ikisi aynı?"],
"rule-shift":[0, "Yanlışta Dur", "Yanlış çıkınca kendine söyle: ‘Kural değişti, başka bir şeye bakayım.’"],
"reversal":[0, "Yıldızı Takip Et", "Yıldız kesilince ısrar etme; hemen öbür resmi dene."],
"navon":[0, "İpucunu Söyle", "Dokunmadan önce ipucunu sesli oku: ‘büyük’ ya da ‘küçük’."],
"plus-minus":[2, "Kendine Söyle", "Her sayıdan önce içinden ‘artı’ ya da ‘eksi’ de, sonra hesapla."],
"creature-count":[0, "Parmakla İzle", "Her yaratığı parmağınla göster, oku görünce yönü sesli söyle."],
"rev-sort":[1, "Kendine Söyle", "Dokunmadan önce içinden ‘tersi’ de: büyük → küçük kova."],
"statue":[0, "İçinden Say", "Kıpırdamadan dururken içinden yavaşça say; ses gelince saymaya devam et."],
"hold-wait":[0, "Hediyeye Odaklan", "Gözünü hediyeden ayırma; içinden ‘tutuyorum, bekliyorum’ de."],
"less-more":[0, "Kuralı Söyle", "Dokunmadan önce söyle: ‘Azı gösteririm, çoğu alırım.’"],
"context-go":[0, "Öncekini Söyle", "Her resimde içinden söyle: ‘Önceki neydi?’ Sonra karar ver."],
"distract":[1, "Ortaya Kilitlen", "Gözünü ortadaki oktan ayırma; kenardakilere bakma."],
"opp-world":[0, "Kendine Söyle", "Rakamı görünce içinden ‘tersi’ de, sonra söyle."],
"grass-snow":[0, "Kendine Söyle", "Resmi görünce içinden ‘tersi’ de, sonra dokun."],
"rev-arrow":[1, "Kendine Söyle", "Oku görünce içinden ‘tersi’ de, sonra söyle."],
"num-stroop":[0, "Sadece Say", "Rakamı okuma; parmağınla tek tek say, sonra dokun."],
"size-stroop":[0, "Hayvanı Düşün", "Resme değil hayvana bak: ‘Fil kocaman, fare minik.’"],
"spatial-stroop":[0, "Kelimeyi Oku", "Önce kelimeyi içinden oku, sonra oku seç."],
"anti-touch":[0, "Karşıya Hazırlan", "Top çıkmadan iki tarafı da düşün; çıkınca hemen karşıyı seç."],
"hayling":[1, "Önce Dur", "Aklına ilk gelen kelimeyi söyleme; odadaki bir eşyanın adını söyle."],
"zihni-says":[0, "Önce Dinle", "Harekete geçmeden önce sor: ‘Zihni diyor ki’ dedi mi?"],
"opp-do":[0, "Tersini Söyle", "Yapmadan önce tersini sesli söyle: ‘Baş değil, ayak.’"],
"hand-game":[0, "Tersini Söyle", "Göstermeden önce tersini söyle: ‘Yumruk değil, parmak.’"],
"tap-reverse":[0, "Tersini Söyle", "Vurmadan önce içinden söyle: ‘Bir gördüm, iki vuracağım.’"],
"vigilance":[0, "Hedefi Söyle", "İçinden tekrar et: kırmızı yıldız, kırmızı yıldız."],
"pos-nback":[0, "Yeri Söyle", "Her kareyi içinden adlandır: 'üst sol', 'orta'…"],
"count-span":[0, "Sayıları Tekrarla", "Her yeni sayıyı önceki sayılarla birlikte içinden tekrar et."],
"tone-seq":[0, "Seslere Ad Ver", "Seslere ad ver: kalın, ince… Sırayı adlarla tekrarla."],
"which-seen":[0, "Ayrıntıya Bak", "Resmin yönüne, rengine ve küçük ayrıntılarına dikkat et."],
"route-mem":[0, "Yolu Söyle", "Yolu yönlerle söyle: sağ, aşağı, sağ…"],
"syl-blend":[0, "Hızlı Söyle", "Heceleri giderek hızlanarak tekrar et; kelime kendiliğinden ortaya çıkar."],
"phon-manip":[0, "Parçalara Ayır", "Kelimeyi önce seslerine ya da hecelerine ayırarak söyle."],
"sent-build":[0, "Kim, Ne Yaptı?", "Önce kimin olduğunu, sonra ne yaptığını bul; eylem sona gelir."],
"wh-scene":[0, "Soru Kelimesine Dikkat", "Kim, ne, nerede: soru kelimesine göre resimde ara."],
"spot-diff":[0, "Parça Parça Karşılaştır", "Resimleri satır satır, kutu kutu karşılaştır."],
"paper-fold":[0, "Katı Ayna Say", "Katlama çizgisi ayna gibidir; delik karşı tarafta da olur."],
"view-from":[0, "Kendini Koy", "Kendini o tarafa yerleştir ve ne göreceğini düşün."],
"cause-effect":[0, "Sonra Ne Olur?", "Kendine sor: Bu olursa sonra ne olur?"],
"sudoku":[0, "Eksik Olanı Bul", "Satırda hangi meyve yok? Sütunda da yok mu? Önce ona bak."],
"num-pattern":[0, "Farkı Bul", "Ardışık sayılar arasındaki farkı yaz; fark nasıl değişiyor?"],
"pic-arrange":[0, "Önce–Sonra", "Kendine sor: Hangisi en önce olmuş? Sonra ne olmuş? En son?"],
"matrix-fill":[0, "Satır, Sonra Sütun", "Önce satırda neyin değiştiğini söyle, sonra sütunda; ikisini birleştir."],
"balance":[0, "Yerine Koy", "Dengedeki teraziyi kullan: bir şeklin yerine ona eşit olanları koy, sonra say."],
"block-design":[0, "Parçalara Böl", "Modeli satır satır incele; her bloğu tek tek kontrol ederek yerleştir."],
"mental-rot":[0, "Ayırt Edici Parça", "Şeklin ayırt edici bir ucunu bul; döndürünce o uç nereye gider?"],
"clutter-find":[0, "Sistemli Tara", "Soldan sağa, yukarıdan aşağıya tara; bulduklarını say."],
"overlap-count":[0, "Parmakla İzle", "Her şeklin çizgisini parmağınla izle, hedef şekilleri tek tek say."],
"embedded":[0, "Köşeleri Ara", "Kırmızı şeklin köşelerini çizimlerde ara."],
"closure":[0, "Ne Olabilir?", "Görünen parçayı söyle: kulak mı, tekerlek mi? Sonra bütünü düşün."],
"copy-design":[0, "Noktaları Say", "Çizginin başladığı noktayı bul; kaç nokta gittiğini sayarak çiz."],
"symmetry":[0, "Çizgiden Say", "Her boyalı kare çizgiden kaç kare uzakta? Öbür yanda aynı uzaklığa boya."],
"maze":[0, "Önce Gözle", "Dokunmadan önce yolu gözünle sondan başa izle."],
"vanalogy-touch":[0, "İlişkiyi Söyle", "İlk ikilinin ilişkisini cümleyle söyle, sonra aynısını bul."],
"word-pic":[0, "Hepsine Bak", "Seçmeden önce bütün resimlere tek tek bak, adlarını içinden söyle."],
"absurd-say":[0, "Hayal Et", "Resmi ya da cümleyi gözünde canlandır: gerçek hayatta böyle olur mu?"],
"analogy-say":[0, "İlişkiyi Söyle", "İlk ikilinin ilişkisini cümleyle söyle, sonra aynısını ikinciye uygula."],
"proverb-say":[0, "Gerçek mi Mecaz mı?", "Kendine sor: Bu gerçekten mi oluyor, yoksa bir şeyi mi anlatıyor?"],
"proverb-touch":[0, "Gerçek mi Mecaz mı?", "Kelimesi kelimesine olanı ele; asıl anlatılanı ara."],
"absurd-touch":[0, "Hayal Et", "Cümleyi gözünde canlandır: gerçekten olabilir mi?"],
"concept-touch":[0, "Kelimeyi Tekrarla", "Önemli kelimeyi tekrar et: içinde, altında, en çok…"],
"infer-say":[0, "İpuçlarını Topla", "Hikâyedeki ipuçlarını say, sonra tahmin et."],
"infer-touch":[0, "İpuçlarını Topla", "Hikâyedeki ipuçlarını say, sonra seçeneklere bak."],
"homonym-say":[0, "İki Cümle Kur", "Kelimeyle iki farklı cümle kur."],
"dot-count":[0, "Gruplara Böl", "Noktaları ikişer üçer gruplar hâlinde gör, sonra topla."],
"alt-uses":[0, "Şekline Bak", "Şekline ve malzemesine bak: başka neye benziyor, ne yapılabilir?"],
"time-est":[0, "Bin-Bir Say", "İçinden 'bin bir, bin iki…' diye say."],
"find-error":[0, "Kuralı Söyle", "Kuralı sesli söyle, sonra her birini tek tek kontrol et."],
"cups":[0, "Gözünle Takip", "Gözünü topun bardağından ayırma; içinden 'şurada' de."],
"mental-math":[0, "Ara Sonucu Söyle", "Her adımdan sonra kaç olduğunu içinden söyle."],
"who-said":[0, "Kişiyle Bağla", "Her resmi söyleyen kişiyle birlikte hayal et."],
"rhythm":[0, "Sesli Say", "Ritmi içinden 'ta, ta, taaa' diye söyle."],
"memory-cards":[0, "Yerini Söyle", "Açtığın her kartın adını ve yerini söyle: 'kedi üst köşede'."],
"same-sound":[0, "Sesi Uzat", "Her resmin adını söylerken ilk sesini uzat."],
"rhyme-touch":[0, "Sonları Söyle", "İki kelimenin yalnızca son kısımlarını tekrar et."],
"syn-touch":[0, "Cümlede Dene", "Kelimeyi bir cümlede kullan; yerine seçeneği koy, anlam değişmiyor mu?"],
"seq-words":[0, "Önce–Sonra", "Kendine sor: Hangisi en önce gelir? Sonra hangisi?"],
"part-whole":[0, "Hayal Et", "Bütünü gözünde canlandır, parçalarını say."],
"flu-cat":[0, "Küçük Gruplar", "Aklında küçük gruplar kur; bir grup bitince yenisine geç."],
"flu-letter":[0, "Heceyle Dene", "Bu sesle başlayan heceleri sırayla dene; her heceden kelime bul."],
"flu-switch":[0, "Sırayı Söyle", "Her kelimeden önce içinden sıradaki grubu söyle."],
"sort-pic":[0, "Kendine Sor", "Kendine sor: Bu ne? Hangi gruba girer?"],
"group-say":[0, "Önce Grupları Bul", "Önce hangi gruplar olduğunu söyle, sonra kelimeleri yerleştir."],
"free-sort":[0, "Ortak Özellik Ara", "Kendine sor: Bunlar nerede bulunur? Ne işe yarar?"],
"move-seq":[0, "Kafanda Yap", "Dinlerken hareketleri kafanda bir kez yap."],
"story-order":[0, "Önce–Sonra", "Kendine söyle: önce…, sonra…, en son…"],
"what-do":[0, "Sesli Düşün", "Ne oldu? Ne yapabilirim? Sonra ne olur? Sesli düşün."],
"odd-cat":[0, "Kendine Sor", "Kendine sor: Bunlar ne? Hangisi onlardan değil?"],
"opp-touch":[0, "Kelimeyi Söyle", "Önce resimdekini söyle, sonra tersini düşün."],
"syl-touch":[0, "El Çırp", "Adını söylerken her hecede bir el çırp, sonra say."],
"sim-touch":[0, "Kendine Sor", "Kendine sor: Bu ne? Hangi gruba girer?"],
"def-touch":[0, "İpucunu Yakala", "Dinlerken en önemli ipucunu kendine söyle."],
"use-touch":[0, "Hayal Et", "O işi yaparken kendini gözünde canlandır."],
"size-touch":[0, "En Küçüğü Bul", "Her seferinde kalanlar arasından en küçüğünü ara."],
"arrow-touch":[0, "Elinle Göster", "Okun yönünü önce elinle göster, sonra dokun."],
"edge-touch":[0, "Parmakla Say", "Bir köşeden başla, kenarlara dokunarak say."],
"odd-touch":[0, "Tek Tek Karşılaştır", "Renge, şekle, büyüklüğe ve yöne tek tek bak."],
"pattern-touch":[0, "Sesli Söyle", "Sırayı sesli söyle, sonra sıradakini bul."],
"analogy-touch":[0, "Kuralı Söyle", "İlk ikilide ne değişti? Sesli söyle, sonra uygula."],
"same-number":[0, "Şeklini Söyle", "Sayının şeklini kendine anlat; sonra satır satır tara."],
"odd-one-out":[0, "Tek Tek Karşılaştır", "Renge, şekle, büyüklüğe tek tek bak: hangisi farklı?"],
"sequence-pattern":[0, "Sesli Söyle", "Örüntüyü sesli söyle, sonra sıradakini bul."],
"visual-analogy":[0, "Kuralı Söyle", "İlk çiftte ne değişti? Sesli söyle, sonra ikinci çifte uygula."]
};
})();
/* "Önce Planla" ayrı çalışma olmaktan çıktı: Üç Bardak – Üç Pul ve Boncukları Yer Değiştir'e 2. aşama olarak eklendi */
[["plan-tol", "Üç Bardak"], ["plan-beads", "Boncuklar"]].forEach(([id, first]) => { const ex = EXERCISES.find(e => e.id === id); if(!ex || ex.stages.some(st => st.think)) return; const base = ex.stages[0]; base.label = "Aşama 1 · " + first; ex.stages.push(Object.assign({}, base, { label: "Aşama 2 · Önce Planla", think: true, instruction: () => `${base.instruction()} <br><b>Bu aşamada</b> her problemin başında ekran birkaç saniye kilitlidir; çocuk önce zihninde planlar. İsterseniz kaç hamlede çözeceğini önce söylesin.` })); });
EXERCISES.forEach(ex => {
return;   /* KURAL: strateji aşamaları kaldırıldı — yönlendirmeyi uzman yapar (STRATEGIES yalnızca oyun modundaki ipucu metni olarak kalır) */
const sp = STRATEGIES[ex.id]; if(!sp || !ex.stages || ex.stages.some(st => st.strategyOf != null)) return;
const [of, name, tip] = sp, base = ex.stages[Math.min(of, ex.stages.length - 1)];
const lab = /^Aşama \d/.test(base.label) || ex.stages.length > 1 ? `Aşama ${ex.stages.length + 1} · Strateji · ${name}` : `Strateji · ${name}`;
ex.stages = ex.stages.concat([Object.assign({}, base, { label: lab, strategyOf: Math.min(of, ex.stages.length - 1), stratName: name, strategy: tip })]);
});

function sortShort(){ const rest = sortState.rules.slice(1).map((r, i) => sortRuleText(i + 1)).join(", "); return `${Q(`Ekranda tek bir kart ve örnek kartlar var. Tek kartı ${sortRuleText(0)} göre uyan örnek karta dokunarak eşleştir. Bir süre sonra kural değişecek; uyarı çıkınca yeni kurala göre eşleştir.`)}`; }

function renderInstruction(){
const box = document.getElementById("instructionBox");
const lsBox = document.getElementById("lsInstructionBox");
const stage = currentExercise().stages[currentStageIndex];
const sample = currentGrid[0] || (currentExercise().randomItem ? currentExercise().randomItem() : {});
const exampleText = stage.example(sample);
const shortFn = (INSTR_SHORT[currentExercise().id] || [])[stIx()];
let ins;
try{ ins = shortFn ? shortFn() : stage.instruction(); }catch(e){ ins = stage.instruction(); }
if(stage.strategyOf != null) ins = `<span class="strat-tip">💡 <b>Strateji · ${stage.stratName}:</b> ${Q(stage.strategy)}</span>${ins}`;
else { const sm = /Strateji · (.+)$/.exec(stage.label || ""); if(sm && /^💡/.test(ins)) ins = `<span class="strat-tip">💡 <b>Strateji · ${sm[1]}</b></span>` + ins.replace(/^💡\s*/, ""); }
const html = `${ins}`.replace(/ (<\/[a-z]+>) +/g, "$1 ").replace(/ +(<[a-z][^>]*>) +/g, " $1").replace(/(\S) {2,}/g, "$1 ").replace(/([A-Za-zÇĞİÖŞÜçğıöşü])'([A-Za-zÇĞİÖŞÜçğıöşü])/g, "$1’$2");   /* KURAL (yazım): yönergede çift boşluk olmaz; kesme işareti ’ (Zihni’nin) */ /* KURAL: yönergede "Örneğin" satırı ve yeşil cümlenin anlamını bozan açıklama yazıları gösterilmez */
box.innerHTML = html;
if(lsBox) lsBox.innerHTML = html;
}

let motionAnimFrame = null;
let motionStartTs = 0;
let motionDurationMs = 25000;

function renderMotionBoard(){
const board = document.getElementById("board");
board.style.display = "flex";
board.style.padding = "0";
board.style.minHeight = "280px";
board.style.gridTemplateColumns = "";
board.style.gridTemplateRows = "";
board.innerHTML = `
<div class="motion-board" id="motionBoard">
${currentExercise().sacKind ? sacDecor(currentExercise().sacKind) : ""}
<div class="motion-shape${currentExercise().sacKind ? " sac" : ""}" id="motionShape"></div>
<div class="motion-progress"><div class="motion-progress-fill" id="motionProgressFill"></div></div>
</div>
`;
positionMotionShape(0);
}

const EYE_PATTERNS = {
horizontal: (t) => ({ x: 0.5 + 0.42*Math.sin(t*2*Math.PI), y: 0.5 }),
vertical:   (t) => ({ x: 0.5, y: 0.5 + 0.38*Math.sin(t*2*Math.PI) }),
diagonal:   (t) => {
const s = (Math.sin(t*2*Math.PI) + 1) / 2;
return { x: 0.08 + 0.84*s, y: 0.12 + 0.76*s };
},
diagonal2:  (t) => {
const s = (Math.sin(t*2*Math.PI) + 1) / 2;
return { x: 0.92 - 0.84*s, y: 0.12 + 0.76*s };
},
square: (t) => {
const corners = [{x:0.12,y:0.15},{x:0.88,y:0.15},{x:0.88,y:0.85},{x:0.12,y:0.85}];
const p = (((t % 1) + 1) % 1) * 4;
const seg = Math.floor(p) % 4;
const f = p - Math.floor(p);
const a = corners[seg], b = corners[(seg+1) % 4];
return { x: a.x + (b.x-a.x)*f, y: a.y + (b.y-a.y)*f };
},
triangle: (t) => {
const corners = [{x:0.5,y:0.12},{x:0.88,y:0.85},{x:0.12,y:0.85}];
const p = (((t % 1) + 1) % 1) * 3;
const seg = Math.floor(p) % 3;
const f = p - Math.floor(p);
const a = corners[seg], b = corners[(seg+1) % 3];
return { x: a.x + (b.x-a.x)*f, y: a.y + (b.y-a.y)*f };
},
star: (t) => {
const corners = [
{x:0.5,y:0.08},{x:0.6,y:0.362},{x:0.899,y:0.37},{x:0.662,y:0.553},{x:0.747,y:0.84},
{x:0.5,y:0.67},{x:0.253,y:0.84},{x:0.338,y:0.553},{x:0.101,y:0.37},{x:0.4,y:0.362}
];
const n = corners.length;
const p = (((t % 1) + 1) % 1) * n;
const seg = Math.floor(p) % n;
const f = p - Math.floor(p);
const a = corners[seg], b = corners[(seg+1) % n];
return { x: a.x + (b.x-a.x)*f, y: a.y + (b.y-a.y)*f };
},
wave: (t, amp) => ({
x: 0.5 + 0.42*Math.sin(t*2*Math.PI),
y: 0.5 + (amp || 0.06)*Math.sin(t*2*Math.PI*3)
}),
steepWave: (t, amp) => ({
x: 0.5 + (amp || 0.06)*Math.sin(t*2*Math.PI*3),
y: 0.5 + 0.38*Math.sin(t*2*Math.PI)
}),
depth: (t) => ({ x: 0.5, y: 0.5 })
};

const SAC_DWELL_BY_TIER = [1600, 1200, 900];
function sacDwell(){ return Math.round((SAC_DWELL_BY_TIER[currentCombo().t] || 1000) * (isPre() ? 1.3 : 1)); }
const SAC_TWO_POINTS = [{x:0.12, y:0.5}, {x:0.88, y:0.5}];
const SAC_FOUR_POINTS = [{x:0.12, y:0.5}, {x:0.88, y:0.5}, {x:0.5, y:0.13}, {x:0.5, y:0.87}];
function sacTwoPos(elapsedMs){
const i = Math.floor(elapsedMs / sacDwell());
if(currentCombo().t === 2){ const seq = [0, 1, 2, 3]; return SAC_FOUR_POINTS[seq[i % 4]]; }
return SAC_TWO_POINTS[i % 2];
}
/* makeRandomSaccade → zihin-0-ortak.js (yükleme zamanında kullanılıyor) */
const SAC_READ_ROWS = 5;
const SAC_READ_STEPS_BY_TIER = [4, 5, 6];
function sacReadLayout(){
const steps = SAC_READ_STEPS_BY_TIER[currentCombo().t] || 5;
const rows = Array.from({length: SAC_READ_ROWS}, (_, r) => 0.16 + r * (0.68 / (SAC_READ_ROWS - 1)));
const xs = Array.from({length: steps}, (_, k) => 0.1 + k * (0.8 / (steps - 1)));
return { rows, xs, steps };
}
function sacReadPos(elapsedMs){
const L = sacReadLayout();
const step = Math.round(sacDwell() * 0.55);
const rowMs = (L.steps - 1) * step + Math.round(step * 1.6);
const tRow = elapsedMs % (rowMs * SAC_READ_ROWS);
const r = Math.floor(tRow / rowMs), inRow = tRow - r * rowMs;
const k = Math.min(L.steps - 1, Math.floor(inRow / step));
return { x: L.xs[k], y: L.rows[r] };
}
function sacDecor(kind){
if(kind === "two"){
const pts = currentCombo().t === 2 ? SAC_FOUR_POINTS : SAC_TWO_POINTS;
return pts.map(p => `<div class="sac-mark" style="left:${p.x*100}%;top:${p.y*100}%;"></div>`).join("");
}
if(kind === "read"){
const L = sacReadLayout();
return L.rows.map(y => `<div class="sac-line" style="left:7%;width:86%;top:${y*100}%;"></div>`).join("") +
L.rows.map(y => L.xs.map(x => `<div class="sac-mark" style="left:${x*100}%;top:${y*100}%;width:10px;height:10px;border-width:1px;"></div>`).join("")).join("");
}
return "";
}

/* makeJunctionWalker → zihin-0-ortak.js (yükleme zamanında kullanılıyor) */

/* makeCrossBoxWalker → zihin-0-ortak.js (yükleme zamanında kullanılıyor) */


// Göz takibi hızı: okul öncesi her düzeyde daha yavaş; düzeyler arası adımlar dengeli (~%30).
