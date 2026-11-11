/* Zihin Atölyesi — zihin-8-aile.js (8/8): arayüz yardımcıları, sözcük verileri, ayarlar, kişi ekranı, Ödevlerim, gelişim planı. Dosyalar zihin-atolyesi.html'de bu sırayla yüklenir; sıra değiştirilemez (önceki tek dosyanın ardışık parçalarıdır). */
function escHTML(v){ return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function avatarHTML(name, size){
const initial = (name||"?").trim().charAt(0).toLocaleUpperCase("tr-TR") || "?";
const s = size || 26;
return `<span class="avatar-chip" style="width:${s}px;height:${s}px;background:${avatarColor(name||"")};font-size:${Math.round(s*0.46)}px;">${initial}</span>`;
}

function uiIconSVG(name){
const s = `stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
switch(name){
case "brain":
return `<svg viewBox="0 0 100 100"><path d="M40 16a14 14 0 0 0-14 14 12 12 0 0 0-8 20 13 13 0 0 0 6 22 13 13 0 0 0 16 10V16Z" ${s}/><path d="M60 16a14 14 0 0 1 14 14 12 12 0 0 1 8 20 13 13 0 0 1-6 22 13 13 0 0 1-16 10V16Z" ${s}/><path d="M50 24v58" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`;
case "bulb":
return `<svg viewBox="0 0 100 100"><path d="M50 12a26 26 0 0 0-14 48c3 2 4 5 4 8v4h20v-4c0-3 1-6 4-8a26 26 0 0 0-14-48Z" ${s}/><path d="M42 84h16M45 92h10" ${s}/></svg>`;
case "grid":
return `<svg viewBox="0 0 100 100"><rect x="12" y="12" width="30" height="30" rx="6" ${s}/><rect x="58" y="12" width="30" height="30" rx="6" ${s}/><rect x="12" y="58" width="30" height="30" rx="6" ${s}/><rect x="58" y="58" width="30" height="30" rx="6" ${s}/></svg>`;
case "stopwatch":
return `<svg viewBox="0 0 100 100"><circle cx="50" cy="56" r="34" ${s}/><path d="M50 56V36M38 10h24" ${s}/><path d="M78 26l8 8" ${s}/></svg>`;
case "shield":
return `<svg viewBox="0 0 100 100"><path d="M50 10 L84 24v24c0 24-15 38-34 42-19-4-34-18-34-42V24Z" ${s}/><path d="M36 50l10 10 18-20" ${s}/></svg>`;
case "gear":
return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="14" ${s}/><path d="M50 20v10M50 70v10M20 50h10M70 50h10M28 28l7 7M65 65l7 7M72 28l-7 7M35 65l-7 7" ${s}/></svg>`;
case "cloud":
return `<svg viewBox="0 0 100 100"><path d="M30 66a16 16 0 0 1-2-32 22 22 0 0 1 42-8 18 18 0 0 1-4 40H30Z" ${s}/></svg>`;
case "cloud-off":
return `<svg viewBox="0 0 100 100"><path d="M30 66a16 16 0 0 1-2-32 22 22 0 0 1 42-8 18 18 0 0 1-4 40H30Z" ${s}/><path d="M18 18l64 64" ${s}/></svg>`;
case "shuffle":
return `<svg viewBox="0 0 100 100"><path d="M14 30h18l40 40h14M14 70h18l14-14M66 30h20M78 22l8 8-8 8M78 62l8 8-8 8" ${s}/></svg>`;
case "chart":
return `<svg viewBox="0 0 100 100"><path d="M18 82V18M18 82h64" ${s}/><path d="M32 82V56M52 82V38M72 82V50" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>`;
case "trophy":
return `<svg viewBox="0 0 100 100"><path d="M32 20h36v20a18 18 0 0 1-36 0V20Z" ${s}/><path d="M32 26H18v6a14 14 0 0 0 14 14M68 26h14v6a14 14 0 0 1-14 14" ${s}/><path d="M50 58v14M36 82h28M40 72h20l2 10H38l2-10Z" ${s}/></svg>`;
case "calendar":
return `<svg viewBox="0 0 100 100"><rect x="16" y="24" width="68" height="58" rx="8" ${s}/><path d="M16 42h68M34 16v14M66 16v14" ${s}/></svg>`;
case "arrow-up":
return `<svg viewBox="0 0 100 100"><path d="M50 78V26M28 46l22-22 22 22" ${s}/></svg>`;
case "arrow-down":
return `<svg viewBox="0 0 100 100"><path d="M50 22v52M28 54l22 22 22-22" ${s}/></svg>`;
case "family":
return `<svg viewBox="0 0 100 100"><circle cx="30" cy="28" r="12" ${s}/><circle cx="66" cy="28" r="12" ${s}/><circle cx="48" cy="56" r="10" ${s}/><path d="M12 82c2-16 12-24 18-24s10 4 10 4M88 82c-2-16-12-24-18-24s-10 4-10 4M30 82c1-12 8-18 18-18s17 6 18 18" ${s}/></svg>`;
case "expert":
return `<svg viewBox="0 0 100 100"><path d="M32 14v24a18 18 0 0 0 36 0V14" ${s}/><circle cx="32" cy="10" r="6" fill="currentColor"/><circle cx="68" cy="10" r="6" fill="currentColor"/><path d="M50 56v14" ${s}/><circle cx="50" cy="78" r="12" ${s}/></svg>`;
case "copy":
return `<svg viewBox="0 0 100 100"><rect x="34" y="34" width="52" height="52" rx="8" ${s}/><path d="M66 34V22a6 6 0 0 0-6-6H20a6 6 0 0 0-6 6v46a6 6 0 0 0 6 6h12" ${s}/></svg>`;
case "printer":
return `<svg viewBox="0 0 100 100"><rect x="20" y="38" width="60" height="30" rx="5" ${s}/><path d="M30 38V20a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v18M30 68v12a2 2 0 0 0 2 2h36a2 2 0 0 0 2-2V68" ${s}/><circle cx="66" cy="48" r="3" fill="currentColor"/></svg>`;
default:
return "";
}
}

function oppositeSVG(type, state, color){
switch(type){
case "length":
return state === "long"
? `<svg viewBox="0 0 100 100"><rect x="8" y="42" width="84" height="16" rx="8" fill="${color}"/></svg>`
: `<svg viewBox="0 0 100 100"><rect x="35" y="42" width="30" height="16" rx="8" fill="${color}"/></svg>`;
case "position":
return state === "inside"
? `<svg viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" rx="10" fill="none" stroke="#888" stroke-width="5"/><circle cx="50" cy="50" r="10" fill="${color}"/></svg>`
: `<svg viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" rx="10" fill="none" stroke="#888" stroke-width="5"/><circle cx="88" cy="88" r="10" fill="${color}"/></svg>`;
case "fill":
return state === "filled"
? `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" fill="${color}"/></svg>`
: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" fill="none" stroke="${color}" stroke-width="6"/></svg>`;
case "vertical":
return state === "above"
? `<svg viewBox="0 0 100 100"><line x1="8" y1="60" x2="92" y2="60" stroke="#888" stroke-width="5"/><circle cx="50" cy="28" r="11" fill="${color}"/></svg>`
: `<svg viewBox="0 0 100 100"><line x1="8" y1="40" x2="92" y2="40" stroke="#888" stroke-width="5"/><circle cx="50" cy="72" r="11" fill="${color}"/></svg>`;
default:
return "";
}
}
const OPPOSITE_LABELS = {
long:"uzun", short:"kısa",
inside:"içinde", outside:"dışında",
filled:"dolu", empty:"boş",
above:"üstünde", below:"altında"
};
const OPPOSITE_OF = {
long:"kısa", short:"uzun",
inside:"dışında", outside:"içinde",
filled:"boş", empty:"dolu",
above:"altında", below:"üstünde"
};
const OPPOSITE_STATES = {
length:["long","short"], position:["inside","outside"], fill:["filled","empty"], vertical:["above","below"]
};

const SIMILARITY_PAIRS = [
{a:"elma", b:"armut", hint:"meyve"}, {a:"köpek", b:"kedi", hint:"hayvan"},
{a:"masa", b:"sandalye", hint:"mobilya"}, {a:"kırmızı", b:"mavi", hint:"renk"},
{a:"otobüs", b:"tren", hint:"taşıt"}, {a:"kalem", b:"silgi", hint:"kırtasiye malzemesi"},
{a:"anne", b:"baba", hint:"ebeveyn"}, {a:"yaz", b:"kış", hint:"mevsim"}
];
const VOCAB_WORDS = [
{word:"cesur", def:"korkusuz, gözü pek"}, {word:"nazik", def:"kibar, ince düşünceli"},
{word:"meraklı", def:"öğrenmek isteyen"}, {word:"sabırlı", def:"beklemeyi bilen"},
{word:"dürüst", def:"doğru sözlü"}, {word:"cömert", def:"paylaşmayı seven"},
{word:"tembel", def:"çalışmaktan kaçınan"}, {word:"yardımsever", def:"başkalarına yardım eden"}
];
const SIM_PRE0 = [ {a:"elma", b:"muz", hint:"ikisi de meyve"}, {a:"kedi", b:"köpek", hint:"ikisi de hayvan"}, {a:"araba", b:"otobüs", hint:"ikisi de taşıt"}, {a:"tişört", b:"pantolon", hint:"ikisi de giysi"}, {a:"top", b:"bebek", hint:"ikisi de oyuncak"}, {a:"masa", b:"sandalye", hint:"ikisi de eşya / mobilya"} ];
const SIM_PRE1 = [ {a:"kaşık", b:"çatal", hint:"ikisiyle de yemek yenir"}, {a:"bardak", b:"fincan", hint:"ikisiyle de bir şey içilir"}, {a:"yatak", b:"yastık", hint:"ikisi de uyurken kullanılır"}, {a:"diş fırçası", b:"diş macunu", hint:"ikisiyle de diş fırçalanır"}, {a:"kalem", b:"boya", hint:"ikisiyle de çizilir"}, {a:"şapka", b:"bere", hint:"ikisi de başa takılır"} ];
const SIM_PRE2 = [ {a:"top", b:"portakal", hint:"ikisi de yuvarlak"}, {a:"kar", b:"süt", hint:"ikisi de beyaz"}, {a:"güneş", b:"ateş", hint:"ikisi de sıcak"}, {a:"buz", b:"dondurma", hint:"ikisi de soğuk"}, {a:"kuş", b:"uçak", hint:"ikisi de uçar"}, {a:"balık", b:"gemi", hint:"ikisi de suda gider"} ];
const VOCAB_PRE0 = [ {word:"top", def:"oynamak için yuvarlak oyuncak"}, {word:"yatak", def:"üzerinde uyuduğumuz eşya"}, {word:"ayakkabı", def:"ayağa giyilen şey"}, {word:"buzdolabı", def:"yiyecekleri soğuk tutan dolap"}, {word:"şemsiye", def:"yağmurda ıslanmamak için açılan şey"}, {word:"diş fırçası", def:"dişleri temizleyen fırça"} ];
const VOCAB_PRE1 = [ {word:"koşmak", def:"çok hızlı yürümek / hızla ilerlemek"}, {word:"uyumak", def:"gözleri kapatıp dinlenmek"}, {word:"zıplamak", def:"yerden yukarı sıçramak"}, {word:"yıkamak", def:"suyla temizlemek"}, {word:"çizmek", def:"kalemle resim yapmak"}, {word:"paylaşmak", def:"elindekini başkasına da vermek"} ];
const VOCAB_PRE2 = [ {word:"mutlu", def:"sevinçli, neşeli"}, {word:"ıslak", def:"suyla dolmuş, kuru olmayan"}, {word:"yorgun", def:"gücü azalmış, dinlenmek isteyen"}, {word:"karanlık", def:"ışığı olmayan"}, {word:"kocaman", def:"çok büyük"}, {word:"sessiz", def:"ses çıkarmayan"} ];
const COMP_PRE0 = [ {q:"Karnın acıkınca ne yaparsın?", hint:"yemek yerim / büyüklere söylerim"}, {q:"Ellerin kirlenince ne yaparsın?", hint:"ellerimi yıkarım"}, {q:"Uykun gelince ne yaparsın?", hint:"yatağıma yatarım, uyurum"}, {q:"Üşüyünce ne yaparsın?", hint:"montumu / kazağımı giyerim"}, {q:"Susayınca ne yaparsın?", hint:"su içerim"}, {q:"Dizini incitince ne yaparsın?", hint:"bir büyüğe söylerim"} ];
const COMP_PRE1 = [ {q:"Neden dişlerimizi fırçalarız?", hint:"dişlerimiz çürümesin / temiz kalsın"}, {q:"Neden kışın mont giyeriz?", hint:"üşümemek için"}, {q:"Neden karşıdan karşıya geçerken bir büyüğün elini tutarız?", hint:"güvende olmak / araba çarpmasın diye"}, {q:"Neden oyuncaklarımızı toplarız?", hint:"kaybolmasın, kimse basıp düşmesin"}, {q:"Neden yemekten önce ellerimizi yıkarız?", hint:"mikroplar ağzımıza girmesin"} ];
const COMP_PRE2 = [ {q:"Oyuncağın kırılsa ne yaparsın?", hint:"bir büyüğe gösteririm, tamir etmeye çalışırız"}, {q:"Parkta annemi göremesem ne yaparım?", hint:"olduğum yerde kalır, bir görevliye / büyüğe söylerim"}, {q:"Arkadaşın ağlıyorsa ne yaparsın?", hint:"neden ağladığını sorarım, yardım ederim"}, {q:"Yanlışlıkla birinin ayağına bassan ne yaparsın?", hint:"özür dilerim"}, {q:"Yerde çöp görürsen ne yaparsın?", hint:"çöp kutusuna atarım"} ];
const SIM_FUNC = [ {a:"kalem", b:"fırça", hint:"ikisiyle de çizilir / boyanır"}, {a:"bıçak", b:"makas", hint:"ikisi de keser"}, {a:"mum", b:"lamba", hint:"ikisi de ışık verir"},
{a:"bardak", b:"kova", hint:"ikisine de sıvı konur"}, {a:"gözlük", b:"dürbün", hint:"ikisi de görmeye yardım eder"}, {a:"kaşık", b:"kürek", hint:"ikisi de bir şeyi alıp taşır"},
{a:"palto", b:"eldiven", hint:"ikisi de soğuktan korur"}, {a:"telefon", b:"mektup", hint:"ikisiyle de haberleşilir"} ];
const SIM_ABSTRACT = [ {a:"sevinç", b:"korku", hint:"ikisi de duygu"}, {a:"saat", b:"takvim", hint:"ikisi de zamanı gösterir"}, {a:"ağaç", b:"çocuk", hint:"ikisi de büyür / canlıdır"}, {a:"harita", b:"pusula", hint:"ikisi de yön bulmaya yardım eder"}, {a:"kitap", b:"öğretmen", hint:"ikisi de bilgi verir"}, {a:"tohum", b:"yumurta", hint:"ikisi de yeni bir canlının başlangıcı"}, {a:"ödül", b:"ceza", hint:"ikisi de bir davranışın sonucu"}, {a:"köprü", b:"tünel", hint:"ikisi de engeli aşıp karşıya geçirir"}, {a:"yağmur", b:"kar", hint:"ikisi de gökten yağar, sudan oluşur"}, {a:"gazete", b:"televizyon", hint:"ikisi de haber verir"}, {a:"anahtar", b:"şifre", hint:"ikisi de açmaya / girmeye yarar"}, {a:"öğretmen", b:"doktor", hint:"ikisi de insanlara yardım eden meslek"}, {a:"ayna", b:"fotoğraf", hint:"ikisi de görüntü gösterir"}, {a:"merdiven", b:"asansör", hint:"ikisi de yukarı çıkarır"}, {a:"söz", b:"yazı", hint:"ikisiyle de düşünce anlatılır"}, {a:"para", b:"zaman", hint:"ikisi de harcanır, ikisi de değerlidir"} ];
const VOCAB_CONCRETE = [ {word:"şemsiye", def:"yağmurdan korunmak için açılan araç"}, {word:"köprü", def:"bir yerden karşıya geçmeyi sağlayan yapı"}, {word:"kütüphane", def:"kitapların bulunduğu, okunduğu yer"},
{word:"merdiven", def:"yukarı-aşağı çıkıp inmeye yarayan basamaklar"}, {word:"cüzdan", def:"para ve kart taşınan küçük çanta"}, {word:"fırın", def:"yemek ve ekmek pişirilen yer / alet"},
{word:"terzi", def:"elbise diken kişi"}, {word:"ada", def:"dört yanı suyla çevrili kara parçası"} ];
const VOCAB_ACTION = [ {word:"fısıldamak", def:"çok alçak sesle konuşmak"}, {word:"sıçramak", def:"yerden yukarı ani zıplamak"}, {word:"kalabalık", def:"çok insanın bir arada olduğu"},
{word:"utangaç", def:"insanlar arasında çekingen davranan"}, {word:"ıslak", def:"suyla dolmuş, kuru olmayan"} ];
const VOCAB_ABSTRACT = [ {word:"cesaret", def:"korkuya rağmen yapabilme gücü"}, {word:"sabır", def:"sıkılmadan bekleyebilme"}, {word:"dürüstlük", def:"doğruyu söyleme, hile yapmama"},
{word:"sorumluluk", def:"üstlendiği işi yerine getirme"}, {word:"dostluk", def:"birbirini seven, güvenen kişilerin bağı"}, {word:"özgürlük", def:"başkasına bağlı olmadan seçebilme"},
{word:"merak", def:"bilmediğini öğrenme isteği"}, {word:"cömertlik", def:"elindekini isteyerek paylaşma"} ];
const COMP_WHY = [ {q:"Neden otobüse sırayla bineriz?", hint:"herkese adil olsun, itişme olmasın"}, {q:"Neden yemekten önce ellerimizi yıkarız?", hint:"mikroplar vücuda girmesin"},
{q:"Neden kütüphanede sessiz oluruz?", hint:"başkaları okuyabilsin"}, {q:"Neden emniyet kemeri takarız?", hint:"kazada korunmak için"},
{q:"Neden sokağa çöp atmayız?", hint:"çevre kirlenmesin"}, {q:"Neden yabancıların arabasına binmeyiz?", hint:"güvenliğimiz için"} ];
const COMP_IF = [ {q:"Okula giderken yolunu kaybetsen ne yaparsın?", hint:"bir polise / güvenilir bir büyüğe danışırım"}, {q:"Arkadaşının oyuncağını yanlışlıkla kırsan ne yaparsın?", hint:"özür dilerim, söylerim, telafi etmeye çalışırım"},
{q:"Evde duman kokusu alsan ne yaparsın?", hint:"büyüklere haber veririm, dışarı çıkarım"}, {q:"Marketten aldığın paranın üstünü fazla verseler ne yaparsın?", hint:"fazlasını geri veririm"},
{q:"Sınıfta biri arkadaşınla alay etse ne yaparsın?", hint:"durmasını söylerim, öğretmene haber veririm"}, {q:"Elektrikler kesilse ne yaparsın?", hint:"sakin kalırım, el feneri bulurum, büyüklere söylerim"} ];
const COMPREHENSION_QS = [
{q:"Üşürsen ne yaparsın?", hint:"kalın giysi giyerim / ısınırım"},
{q:"Neden dişlerimizi fırçalarız?", hint:"sağlıklı kalması için"},
{q:"Sokakta para bulursan ne yaparsın?", hint:"sahibini bulmaya çalışırım"},
{q:"Neden kırmızı ışıkta dururuz?", hint:"güvenlik için"},
{q:"Arkadaşın üzgünse ne yaparsın?", hint:"onunla konuşurum, yardım ederim"},
{q:"Neden kitap okuruz?", hint:"öğrenmek / eğlenmek için"}
];

function tripleShapeHTML(items){ return `<div class="odd-group" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-height:38px;aspect-ratio:2.4/1;gap:3%;box-sizing:border-box;padding:4% 5%;background:#F1F5F9;border:2px solid #E3E9F0;border-radius:14px;">${
items.map(it => `<div style="width:31%;height:90%;">${shapeSVG(it.shape, it.color)}</div>`).join('')
}</div>`;
}

function sequenceHTML(sequence){
const dot = c => `<span style="display:inline-block;width:15%;height:55%;border-radius:50%;background:${c};margin:0 2%;"></span>`;
const q = `<span style="display:inline-flex;align-items:center;justify-content:center;width:15%;height:55%;border-radius:50%;border:3px dashed #999;margin:0 2%;font-weight:800;color:#999;font-size:14px;">?</span>`;
return `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${sequence.map(dot).join('')}${q}</div>`;
}

function analogyHTML(a, b, c){
const box = it => `<div style="width:22%;height:70%;">${shapeSVG(it.shape, it.color)}</div>`;
const sep = t => `<div style="width:8%;text-align:center;font-weight:800;color:var(--ink-soft);">${t}</div>`;
return `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
${box(a)}${sep("→")}${box(b)}${sep("::")}${box(c)}${sep("→")}
<div style="width:16%;height:60%;display:flex;align-items:center;justify-content:center;font-weight:800;color:#999;border:2px dashed #999;border-radius:8px;">?</div>
</div>`;
}

function categoryIconSVG(id, color){
const s = `stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
if(readingLevel === "pre"){
switch(id){
case "islemleme-hizi":
return `<svg viewBox="0 0 100 100"><path d="M58 10 24 58h20l-9 32 37-46H54Z" ${s} fill="${color}22"/></svg>`;
case "goz-takip":
return `<svg viewBox="0 0 100 100"><path d="M50 12l11 24 27 3-20 18 6 27-24-14-24 14 6-27-20-18 27-3Z" ${s} fill="${color}22"/></svg>`;
case "yurutucu-islev":
return `<svg viewBox="0 0 100 100"><rect x="34" y="12" width="32" height="76" rx="15" ${s}/><circle cx="50" cy="34" r="8.5" fill="${color}"/><circle cx="50" cy="50" r="8.5" fill="${color}66"/><circle cx="50" cy="66" r="8.5" fill="${color}2A"/></svg>`;
case "calisan-bellek":
return `<svg viewBox="0 0 100 100"><rect x="14" y="46" width="36" height="36" rx="9" fill="${color}"/><rect x="50" y="18" width="36" height="36" rx="9" fill="${color}77"/></svg>`;
case "sozel-bellek":
return `<svg viewBox="0 0 100 100"><path d="M50 14a30 30 0 0 0-13 57l-3 14 16-9a30 30 0 1 0 0-62Z" ${s} fill="${color}22"/><circle cx="42" cy="48" r="5.5" fill="${color}"/><circle cx="60" cy="42" r="5.5" fill="${color}"/><path d="M47.5 48V32l17-4v14" ${s}/></svg>`;
case "gorsel-bellek":
return `<svg viewBox="0 0 100 100"><rect x="12" y="30" width="76" height="54" rx="13" ${s}/><rect x="36" y="17" width="28" height="15" rx="6" ${s}/><circle cx="50" cy="57" r="17" ${s}/><circle cx="50" cy="57" r="7" fill="${color}"/></svg>`;
case "sozel-organizasyon":
return `<svg viewBox="0 0 100 100"><path d="M20 42h60l-6 38a9 9 0 0 1-9 8H35a9 9 0 0 1-9-8Z" ${s} fill="${color}22"/><path d="M32 42 41 20h18l9 22" ${s}/></svg>`;
case "sozel-kavrama":
return `<svg viewBox="0 0 100 100"><path d="M50 13a25 25 0 0 0-14 46c3 2 5 6 5 10h18c0-4 2-8 5-10a25 25 0 0 0-14-46Z" ${s} fill="${color}22"/><path d="M42 78h16M45 87h10" ${s}/></svg>`;
}
}
switch(id){
case "sozel-kavrama":
return `<svg viewBox="0 0 100 100"><path d="M16 24h68v42H46l-16 16V66H16Z" ${s}/><path d="M42 38a8 8 0 0 1 16 0c0 6-8 6-8 14" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="50" cy="60" r="2.5" fill="${color}"/></svg>`;
case "algisal-akil-yurutme":
return `<svg viewBox="0 0 100 100"><path d="M22 22h20a7 7 0 0 1 14 0h20v20a7 7 0 0 1 0 14v22H56a7 7 0 0 1-14 0H22V58a7 7 0 0 1 0-14Z" ${s}/></svg>`;
case "islemleme-hizi":
return `<svg viewBox="0 0 100 100"><path d="M20 68a34 34 0 1 1 60 0" ${s}/><path d="M50 68 L66 46" ${s}/><circle cx="50" cy="68" r="5" fill="${color}"/></svg>`;
case "goz-takip":
return `<svg viewBox="0 0 100 100"><path d="M12 50c10-18 26-27 38-27s28 9 38 27c-10 18-26 27-38 27S22 68 12 50Z" ${s}/><circle cx="50" cy="50" r="11" fill="${color}"/></svg>`;
case "yurutucu-islev":
return `<svg viewBox="0 0 100 100">
<path d="M22 30h56M22 50h56M22 70h56" ${s}/>
<circle cx="38" cy="30" r="7" fill="${color}"/>
<circle cx="64" cy="50" r="7" fill="${color}"/>
<circle cx="46" cy="70" r="7" fill="${color}"/>
</svg>`;
case "calisan-bellek":
return `<svg viewBox="0 0 100 100">
<rect x="14" y="38" width="40" height="40" rx="7" ${s}/>
<rect x="34" y="18" width="40" height="40" rx="7" fill="var(--bg)" ${s}/>
</svg>`;
case "sozel-organizasyon":
return `<svg viewBox="0 0 100 100">
<path d="M16 24h68v42H46l-16 16V66H16Z" ${s}/>
<path d="M30 40h40M30 52h26" ${s}/>
</svg>`;
case "gorsel-organizasyon":
return `<svg viewBox="0 0 100 100">
<circle cx="28" cy="72" r="10" fill="${color}"/>
<circle cx="54" cy="72" r="15" fill="${color}"/>
<circle cx="82" cy="72" r="20" fill="${color}"/>
</svg>`;
case "sozel-bellek":
return `<svg viewBox="0 0 100 100">
<path d="M22 16h56v68l-28-16-28 16Z" ${s}/>
<path d="M34 36h32M34 48h32" ${s}/>
</svg>`;
case "gorsel-bellek":
return `<svg viewBox="0 0 100 100">
<rect x="14" y="18" width="72" height="64" rx="8" ${s}/>
<circle cx="34" cy="42" r="8" fill="${color}"/>
<path d="M14 66l22-18 18 14 14-10 18 16" ${s}/>
</svg>`;
default:
return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" ${s}/></svg>`;
}
}

const CATEGORY_IMPACT = {
"islemleme-hizi": {
good: "Okuma akıcı ilerler, günlük görevler ve ödevler daha çabuk biter, sınavda zaman sıkıntısı daha az yaşanır.",
watch: "Okurken/yazarken yavaş kalabilir, arkadaşlarına yetişmek için daha çok çaba harcayabilir, aynı sürede daha çabuk yorulabilir."
},
"goz-takip": {
good: "Satır takibi rahat ilerler, top oyunları ve el-göz koordinasyonu gerektiren etkinliklerde rahat hareket eder.",
watch: "Okurken satır veya kelime atlayabilir, yerini kaybedip aynı satırı tekrar okuyabilir."
},
"yurutucu-islev": {
good: "Kuralları takip eder, dürtüsünü kontrol edip düşünerek tepki verir, bir işten diğerine kolayca geçiş yapar.",
watch: "Kuralı unutup eski alışkanlığa dönebilir, düşünmeden hızlı tepki verebilir, ani değişikliklere uyum sağlamakta zorlanabilir."
},
"calisan-bellek": {
good: "Çok adımlı yönergeleri sırasıyla uygular, aynı anda birden fazla bilgiyi aklında tutabilir, yaptığı işin neresinde olduğunu bilir.",
watch: "Yönergenin ortasında ne yapacağını unutabilir, işlem sırasında bir adımı atlayabilir, \u201cbir şey getirmesi söylenip başka bir şeyle dönebilir\u201d."
},
"sozel-bellek": {
good: "Sözlü anlatılanı hatırlar, derste veya evde verilen yönergeleri takip edebilir, dinlediği bir hikayeyi aktarabilir.",
watch: "Az önce söyleneni çabuk unutabilir, \u201cne demiştin?\u201d diye sık sorabilir, sözlü derslerde bilgi kaybı yaşayabilir."
},
"gorsel-bellek": {
good: "Gördüğü yer, yüz veya nesneyi hatırlar, görsel materyalle (resim, şema) öğrenmesi güçlenir.",
watch: "Eşyasını nereye koyduğunu hatırlamakta zorlanabilir, az önce gördüğü bir şekli veya sırayı unutabilir."
},
"sozel-organizasyon": {
good: "Kelimeleri anlamına göre hızlı gruplayabilir, konuşmasını ve yazısını düzenli kurabilir.",
watch: "Konuşurken veya yazarken düşüncelerini toparlamakta zorlanabilir, anlatımı dağınık kalabilir."
},
"sozel-kavrama": {
good: "Soyut ilişkileri ve mecazları kolay kavrar, okuduğunu derinlemesine anlayıp yorumlayabilir.",
watch: "Mecazi veya soyut anlatımı harfi harfine algılayabilir, okuduğunu anlama düzeyi yüzeysel kalabilir."
},
"gorsel-organizasyon": {
good: "Şekil, boyut ve yön ilişkilerini hızlı kurar; geometri ve uzamsal görevlerde rahat çalışır.",
watch: "Şekilleri veya boyutları karşılaştırmakta yavaş kalabilir, sağ-sol veya yukarı-aşağı gibi yön kavramlarında karışıklık yaşayabilir."
},
"algisal-akil-yurutme": {
good: "Örüntüleri ve mantıksal ilişkileri fark eder, yeni ve alışılmadık durumlara hızlı uyum sağlar.",
watch: "Bir örüntüyü veya kuralı bulmakta zaman alabilir, alışılmadık görevlerde başlangıçta zorlanabilir."
}
};

function renderAboutCategoryList(){
const list = document.getElementById("aboutCategoryList");
if(!list) return;
list.innerHTML = "";
let lastGroup = null;
CATEGORIES.forEach(cat=>{
if(cat.hidden) return;
if(cat.group !== lastGroup){
const header = document.createElement("div");
header.className = "about-group-header";
header.textContent = cat.group;
list.appendChild(header);
lastGroup = cat.group;
}
const row = document.createElement("div");
row.className = "about-cat-row";
const impact = CATEGORY_IMPACT[cat.id];
const impactHTML = impact ? `
<div class="about-cat-impact">
<div class="about-impact-line good"><b>Güçlü olduğunda:</b> ${impact.good}</div>
<div class="about-impact-line watch"><b>Zorlandığında:</b> ${impact.watch}</div>
</div>
` : "";
row.classList.add("ab-acc"); row.dataset.key = cat.id; if(ABOUT_OPEN === cat.id) row.classList.add("open");
row.innerHTML = ` <button type="button" class="ab-head"><span class="about-cat-icon" style="background:${cat.color}22;">${categoryIconSVG(cat.id, cat.color)}</span><span class="about-cat-title">${cat.label}</span><span class="rp-chev" aria-hidden="true"></span></button> <div class="ab-body"> <div class="about-cat-purpose">${cat.purpose}</div> ${impactHTML} </div> `;
row.querySelector(".ab-head").onclick = () => aboutToggle(cat.id);
list.appendChild(row);
});
}
/* KURAL (açılır bölümler): Hakkında ekranında Kavramlar ve her alan başlığı dokununca açılır; biri açılınca açık olan diğeri kapanır */
let ABOUT_OPEN = "__gloss";
function aboutToggle(key){ const willOpen = ABOUT_OPEN !== key; ABOUT_OPEN = willOpen ? key : null; document.querySelectorAll("#aboutCategoryList .ab-acc").forEach(r => r.classList.toggle("open", r.dataset.key === ABOUT_OPEN)); const g = document.getElementById("aboutGlossary"); if(g && g.open !== (ABOUT_OPEN === "__gloss")){ g.dataset.sync = "1"; g.open = ABOUT_OPEN === "__gloss"; } }
function openAboutScreen(){ renderAboutCategoryList(); try{ renderGlossary(); }catch(e){} const a = document.getElementById("aboutScreen"); a.style.zIndex = "380"; a.style.display = "block"; a.scrollTop = 0; }
function closeAboutScreen(){
document.getElementById("aboutScreen").style.display = "none";
}
document.getElementById("aboutBtn").addEventListener("click", openAboutScreen);
document.getElementById("closeAboutBtn").addEventListener("click", closeAboutScreen);
document.getElementById("closeAboutBtn2").addEventListener("click", closeAboutScreen);
document.getElementById("settingsAboutLink").addEventListener("click", (e)=>{
e.preventDefault();
openAboutScreen();
});

function categoryHasPreExercises(cat){
return cat.exerciseIds.some(id => exerciseById(id).readingLevel.includes("pre"));
}

/* Kategori kartı: bölüm (üst başlık) çipleri; dokununca o bölümün çalışma sayfaları listelenir, bir çalışmaya dokununca doğrudan o sayfa açılır */
/* Kategori kartı · düzey satırı: etkin kademe, kaynağı ve elle seçim (uzman / aile). Uzman belirlediyse aile değiştiremez. */
function renderCatLevelRow(host, cat, onChange){
const n = (catPlayerName() || "").trim(); if(!n || n === "Misafir" || n === "Oyuncu") return null;
const info = catLevelInfo(cat.id, n), srcTxt = { uzman: "uzman seçti", aile: "aile seçti", degerlendirme: "Değerlendirme turu", genel: "varsayılan" }[info.by] || "";
const row = document.createElement("span"); row.className = "cat-level-row";
const locked = appMode === "aile" && info.by === "uzman";
const mk = (lvl, txt) => { const b = document.createElement("button"); b.type = "button"; b.className = "cat-level-btn" + (info.lvl === lvl ? " on" : ""); b.textContent = txt; b.disabled = locked;
  b.addEventListener("click", (ev) => { ev.stopPropagation(); if(locked || info.lvl === lvl) return; catLevelTransition(cat.id, n, lvl, appMode === "uzman" ? "uzman" : "aile", { explain: false }); onChange(); }); return b; };
row.innerHTML = `<span class="cat-level-lbl">Okul dönemi · <b>${info.lvl === "pre" ? "Okul Öncesi" : "Okul Sonrası"}</b> <small>(${escHTML(srcTxt)})</small></span>`;
const btns = document.createElement("span"); btns.className = "cat-level-btns"; btns.appendChild(mk("pre", "Okul Öncesi")); btns.appendChild(mk("post", "Okul Sonrası"));
if(!locked && (info.by === "uzman" || info.by === "aile")){ const auto = document.createElement("button"); auto.type = "button"; auto.className = "cat-level-btn auto"; auto.textContent = "Otomatik"; auto.title = "Seçimi kaldır: Değerlendirme turu ya da genel düzey kullanılır";
  auto.addEventListener("click", (ev) => { ev.stopPropagation(); setCatLevel(cat.id, n, null); onChange(); }); btns.appendChild(auto); }
row.appendChild(btns);
if(locked){ const nt = document.createElement("small"); nt.className = "cat-level-note"; nt.textContent = "Bu alanın okul dönemini uzman belirledi."; row.appendChild(nt); }
return row;
}
/* Ana sayfa başlıklarını sığdır: metin kesilmez, kartın dışına taşmaz; gerekirse yazı boyu adım adım küçülür (en az 12px) */
function fitHomeTitles(box){ try{ if(!box) return; const fit = (el, min, oneLine) => { if(!el) return; el.style.fontSize = ""; let fs = parseFloat(getComputedStyle(el).fontSize) || 16; const words = () => { if(oneLine) return el.scrollWidth > el.clientWidth + 1; const r = document.createRange(); let worst = 0; el.childNodes.forEach(n => { if(n.nodeType === 3){ n.textContent.split(/\s+/).forEach(() => {}); } }); return el.scrollWidth > el.clientWidth + 1; }; let g = 0; while(words() && fs > min && g++ < 20){ fs -= 0.5; el.style.fontSize = fs + "px"; } };
  box.querySelectorAll(".fh-today .fh-t1").forEach(el => fit(el, 14, true));
  box.querySelectorAll(".fh-grid .fh-week .t1").forEach(el => { el.style.fontSize = ""; let fs = parseFloat(getComputedStyle(el).fontSize) || 14.5; const longest = (el.textContent || "").split(/\s+/).sort((a, b) => b.length - a.length)[0] || ""; const probe = document.createElement("span"); probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;font-weight:900;font-family:inherit"; el.appendChild(probe); probe.textContent = longest; let g = 0; while(probe.getBoundingClientRect().width > el.clientWidth + 0.5 && fs > 12 && g++ < 20){ fs -= 0.5; el.style.fontSize = fs + "px"; probe.style.fontSize = fs + "px"; } probe.remove(); }); }catch(e){} }
/* Etkinlik Raporları düğmesi: büyük yeşil kartla aynı boy ve stil */
function reportsBtnHtml(id){ return `<button type="button" class="fh-today fh-reports" id="${id}"><span class="fh-rep-ic">${uiIconSVG("chart")}</span><span class="fh-tx"><div class="fh-t1">Etkinlik Raporları</div><div class="fh-t2">Son sonuçlar · haftalık rapor · özet</div></span><span class="fh-rep-go" aria-hidden="true"><svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M10.5 8l4 4-4 4"></path></svg></span></button>`; }
/* KURAL (sadelik): bilgi (i) düğmesiyle açılan Hakkında ekranının başında kısa kavram sözlüğü; terimler arayüzdeki tek adlarla aynıdır */
const GLOSSARY = [["Alan", "Uygulamadaki 10 beceri grubundan biri (ör. Çalışan Bellek, Sözel Kavrama)."], ["Bölüm", "Bir alanın içindeki çalışma grubu (ör. Yürütücü İşlev'de Ketleme)."], ["Çalışma ve aşama", "Her sayfa bir çalışmadır; aşamalar aynı çalışmanın adım adım zorlaşan hâlleridir."], ["Düzey", "Başlangıç, Orta, Zor. Çocuğun sonuçlarına göre kendiliğinden değişir."], ["Okul dönemi", "Okul Öncesi ya da Okul Sonrası içerik. Her alan için ayrı belirlenebilir."], ["Değerlendirme turu", "Her alanda çocuğun nereden başlayacağını belirleyen kısa tur."], ["Bugünün etkinlikleri", "Ailenin evde her gün uyguladığı yaklaşık 12 dakikalık plan."], ["Ödev ve önerilen çalışma", "Ödevi uzman verir; önerilen çalışmayı uygulama, çocuğun sonuçlarına göre hazırlar."], ["Zihin Adaları", "Çocuğun tek başına oynadığı oyun bölümü; duraklarda yıldız, macerada ışık toplar."]];
function renderGlossary(){ try{ const host = document.getElementById("aboutCategoryList"); if(!host || document.getElementById("aboutGlossary")) return; const d = document.createElement("details"); d.id = "aboutGlossary"; d.className = "gr-acc"; d.open = ABOUT_OPEN === "__gloss"; d.addEventListener("toggle", () => { if(d.dataset.sync){ delete d.dataset.sync; return; } if(d.open && ABOUT_OPEN !== "__gloss") aboutToggle("__gloss"); else if(!d.open && ABOUT_OPEN === "__gloss") ABOUT_OPEN = null; }); d.innerHTML = `<summary>${grIc("book", "#0A847E", "#DDF3F0")}<span class="gr-acc-t">Kavramlar</span><span class="gr-chev" aria-hidden="true"></span></summary><div class="gr-acc-b"><dl class="gloss">${GLOSSARY.map(([t, x]) => `<dt>${t}</dt><dd>${x}</dd>`).join("")}</dl></div>`; host.parentNode.insertBefore(d, host); }catch(e){} }
function renderCatGroups(host, cat, realIndex){
if(!host || host.dataset.built) return; host.dataset.built = "1";
const groups = cat.exerciseGroups || [["Çalışmalar", cat.exerciseIds]];
const lvlHere = catLevelFor(cat.id, catPlayerName());   /* liste ve sayılar bu kategorinin kademesine göre */
const avail = (id) => { const ex = exerciseById(id); return ex && ex.readingLevel.includes(lvlHere); };
try{ const lr = renderCatLevelRow(host, cat, () => { host.innerHTML = ""; delete host.dataset.built; renderCatGroups(host, cat, realIndex); }); if(lr) host.appendChild(lr); }catch(e){}
groups.forEach(([name, ids]) => { const inLevel = ids.filter(avail); if(!inLevel.length) return;
  const wrap = document.createElement("span"); wrap.className = "cat-group";
  const chip = document.createElement("button"); chip.type = "button"; chip.className = "cat-group-chip"; chip.innerHTML = `${escHTML(name)} <small>${inLevel.length}</small>`;
  const ul = document.createElement("span"); ul.className = "cat-group-list"; ul.style.display = "none";
  inLevel.forEach(id => { const ex = exerciseById(id); const b = document.createElement("button"); b.type = "button"; b.className = "cat-ex-btn"; b.textContent = ex.label;
    b.addEventListener("click", (ev) => { ev.stopPropagation(); selectCategory(realIndex); try{ const exs = currentCategoryExercises(); const e = exs.findIndex(x => x.id === id); if(e >= 0){ const tt = Math.max(ex.minTier || 0, Math.min(currentCombo().t, tierMax(ex))); const idx = findSeqIndex(tt, e); if(idx >= 0) goToIndex(idx); } }catch(err){} });
    ul.appendChild(b); });
  chip.addEventListener("click", (ev) => { ev.stopPropagation(); const open = ul.style.display !== "none"; host.querySelectorAll(".cat-group-list").forEach(x => { x.style.display = "none"; }); host.querySelectorAll(".cat-group-chip").forEach(x => x.classList.remove("on")); if(!open){ ul.style.display = "flex"; chip.classList.add("on"); } });
  wrap.appendChild(chip); wrap.appendChild(ul); host.appendChild(wrap); });
  { const all = document.createElement("button"); all.type = "button"; all.className = "cat-all-btn"; all.textContent = "Bu alanın bütün çalışmaları ›"; all.addEventListener("click", (ev) => { ev.stopPropagation(); selectCategory(realIndex); }); host.appendChild(all); }
}

/* KURAL (Aile ve Uzman sayfası, 2026-11-03 şablonu A): üstte tek çubuk (geri · "Bilişsel Etkinlik · Aile/Uzman" ve sayfa adı · mod etiketi · alanlar hakkında · ana sayfa) ve altında Bugünün etkinlikleri (Uzman'da Etkinlik Raporları) kartı; ortada alanlar uygulamadaki sırayla tek sütunda, grup başlıklarıyla, sol kenarı alan renginde ince satırlar ("N etkinlik"); satırlar ekranın kalanını boşluk bırakmadan eşit doldurur; altta yanlara açık, birbirine bitişik renkli dört düğme (Aile: Ödevlerim · Gelişim · Bu hafta · Uzmana bağlan; Uzman: Danışanlar · Gelişim · Bu hafta · Değerlendirme). Alt düğmeler eski düğmelerin işini aynen yapar. */
function catV2Render(){ const sc = document.getElementById("categoryScreen"); if(!sc) return; const on = appMode === "aile" || appMode === "uzman"; sc.classList.toggle("cat-v2", on); const inner = sc.querySelector(".category-inner"); let top = document.getElementById("catTop"), dock = document.getElementById("catDock");
  if(!on){ if(top) top.style.display = "none"; if(dock) dock.style.display = "none"; return; }
  const isA = appMode === "aile", M = isA ? "Aile" : "Uzman";
  if(!top){ top = document.createElement("div"); top.id = "catTop"; inner.insertBefore(top, inner.firstChild); }
  top.style.display = ""; top.innerHTML = `<button type="button" class="ct-btn" id="catTopBack" aria-label="Geri"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1C2B39" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button><div class="ct-tx"><small>Bilişsel Etkinlik · ${M}</small><b>${M} Etkinlik Sayfası</b></div><span class="ct-tag ${isA ? "a" : "u"}">${M}</span><button type="button" class="ct-btn ct-i" id="catTopInfo" aria-label="Alanlar hakkında"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0A847E" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg></button><button type="button" class="ct-btn" id="catTopHome" aria-label="Ana sayfa"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0A847E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg></button>`;
  document.getElementById("catTopBack").onclick = () => { try{ document.getElementById("categoryScreen").style.display = "none"; categoryBackTarget = null; goHome(); }catch(e){ const b = document.getElementById("categoryBackBtn"); if(b) b.click(); } };   /* KURAL: Aile/Uzman sayfasında geri her zaman ana sayfaya döner (son etkinliğe değil) */
  document.getElementById("catTopInfo").onclick = () => { try{ openAboutScreen(); }catch(e){} };
  document.getElementById("catTopHome").onclick = () => { try{ document.getElementById("categoryScreen").style.display = "none"; goHome(); }catch(e){} };
  /* üst kart: eski sayfadaki kahraman kart (Bugünün etkinlikleri / Etkinlik Raporları) kahraman olarak kalır; dört kutu alta taşınır */
  const home = document.getElementById(isA ? "familyHome" : "expertHome");
  if(home && home.parentElement !== inner){} if(home && top.nextSibling !== home) inner.insertBefore(home, top.nextSibling);
  if(!dock){ dock = document.createElement("div"); dock.id = "catDock"; dock.setAttribute("role", "navigation"); inner.appendChild(dock); } else if(dock.parentElement !== inner || dock !== inner.lastElementChild) inner.appendChild(dock);
  dock.style.display = "";
  const I = { clip:'<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4V3h6v1M8.5 13l2.5 2.5 4.5-5"/>', sprout:'<path d="M12 21v-9"/><path d="M12 12c0-4 3-7 7-7 0 4-3 7-7 7z"/><path d="M12 14c0-3-2.5-5.5-6-5.5 0 3.5 2.5 5.5 6 5.5z"/>', chart:'<path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/>', link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>', users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.2 2.4 3.6 5.2"/>', compass:'<circle cx="12" cy="12" r="9.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>' };
  const linked = (() => { try{ return !!familyLinkLocal(); }catch(e){ return false; } })();
  const T = isA ? [["fhHwBtn", "clip", "Ödevlerim", "#0E968D", "#0A6E68"], ["fhGrowBtn", "sprout", "Gelişim", "#B58410", "#8A6206"], ["fhWeekBtn", "chart", "Bu hafta", "#A9632A", "#7E4718"], ["fhLinkBtn", "link", linked ? "Uzmanım" : "Uzmana bağlan", "#3A8FA8", "#256B80"]]
                : [["exHomeBtn", "users", "Danışanlar", "#0E968D", "#0A6E68"], ["exGrowBtn", "sprout", "Gelişim", "#B58410", "#8A6206"], ["exWeekBtn", "chart", "Bu hafta", "#A9632A", "#7E4718"], ["exPlaceBtn", "compass", "Değerlendirme", "#3A8FA8", "#256B80"]];
  dock.innerHTML = T.map(([id, ic, t, c, d], k) => { const src = document.getElementById(id); const bd = src ? src.querySelector(".hw-badge") : null; return `<button type="button" class="cd-b" data-proxy="${id}" style="--c:${c};--d:${d}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[ic]}</svg><span>${t}</span>${bd ? `<em class="cd-badge">${escHTML(bd.textContent.trim())}</em>` : ""}</button>`; }).join("");
  dock.querySelectorAll("[data-proxy]").forEach(b => b.onclick = () => { const src = document.getElementById(b.dataset.proxy); if(src){ src.click(); return; } try{ pickPerson(() => renderCategoryList(), { noGuest:true }); }catch(e){} });
}
function renderCategoryList(){
try{ const __n = catPlayerName(); const __g = __n && __n !== "Misafir" && __n !== "Oyuncu" ? getPlayerLevel(__n) : null; if(__g && __g !== readingLevel){ readingLevel = __g; applyLevelDefaultThresholds(__g); } }catch(e){}   /* kategori listesine dönünce genel düzeye dönülür; kartlar kendi kademesini gösterir */
try{ renderFamilyHome(); }catch(e){}
try{ renderExpertHome(); }catch(e){}
const list = document.getElementById("categoryList");
list.innerHTML = "";
let lastGroup = null;
CATEGORIES.forEach((cat)=>{
if(cat.hidden) return;
const realIndex = CATEGORIES.indexOf(cat);
if(cat.group !== lastGroup){
const header = document.createElement("div");
header.className = "category-group-header";
header.textContent = cat.group;
list.appendChild(header);
lastGroup = cat.group;
}
const card = document.createElement("button");
card.className = "category-card"; try{ const nEx = (cat.exerciseIds || []).filter(id => { const ex = exerciseById(id); return ex && (ex.readingLevel || []).includes(readingLevel); }).length; card.dataset.count = nEx; card.style.setProperty("--cc", cat.color); }catch(e){}
const isDraft = false;   // tüm kategorilerin içeriği tamamlandı   // içeriği tamamlanan kategorilerde "Taslak" etiketi yok
const isComingSoon = readingLevel === "pre" && !categoryHasPreExercises(cat);
let badge = "";
if(isComingSoon) badge = `<span class="category-badge category-badge-soon">Yakında eklenecek</span>`;
else if(isDraft) badge = `<span class="category-badge">Taslak · örnek çalışmalar</span>`;
card.innerHTML = `
<span class="category-icon-badge" style="background:${cat.color}22;">${categoryIconSVG(cat.id, cat.color)}</span>
<span class="category-card-text">
<span class="category-card-title">${cat.label}</span>
<span class="category-card-sub">${cat.sub}</span>
<span class="cat-groups" data-cat="${cat.id}"></span>
<span class="cat-hint">Bölüm adına dokununca çalışmaları açılır, yeniden dokununca kapanır · kartı kapatmak için başlığa dokunun</span>
${badge}
</span>
<span class="cat-count" aria-hidden="true">${isComingSoon ? "Yakında" : (card.dataset.count || "") + " etkinlik"}</span><span class="cat-chev" aria-hidden="true">›</span>
`;
card.addEventListener("click", (ev)=>{ if(ev.target.closest(".cat-groups")) return;   /* bölüm/çalışma dokunuşları kendi işleyicisinde */
if(card.classList.contains("open")){ card.classList.remove("open"); card.setAttribute("aria-expanded", "false"); return; } /* KURAL (alan kartı aç-kapa, 2026-11-09): açık alan kartının başlığına dokununca kart kapanır (açıldığı gibi); alanın çalışmalarına bölüm içindeki çalışma düğmeleriyle ya da en alttaki "Bu alanın bütün çalışmaları" düğmesiyle gidilir. Önceden açık karta ikinci dokunuş alana geçiyor, kart kapatılamıyordu */
list.querySelectorAll(".category-card.open").forEach(c => c.classList.remove("open")); card.classList.add("open"); card.setAttribute("aria-expanded", "true");
try{ renderCatGroups(card.querySelector(".cat-groups"), cat, realIndex); }catch(e){}
setTimeout(() => { try{ card.scrollIntoView({ block: "nearest", behavior: "smooth" }); }catch(e){} }, 50); });
list.appendChild(card);
});
try{ catV2Render(); }catch(e){ console.error(e); }
}


const TOURS = {
home: { key: "wm_tour_home_seen_v3", steps: [
{sel:"#hmPerson", title:"Kişi", text:"Çalışan çocuk burada görünür. Değiştir ile başka bir çocuğa geçin, + Kişi ekle ile yeni çocuk ekleyin. Sonuçlar her çocuk için ayrı tutulur."},
{sel:"#hmEtkBtn", title:"Bilişsel Etkinlik", text:"Yetişkinle birlikte yapılan çalışmalar: 10 beceri alanı ve her alanda çok sayıda etkinlik."},
{sel:"#hmToday", title:"Bugünün etkinlikleri", text:"Günlük kısa oturum: dört etkinlik. Uygulama çocuğun düzeyine göre kendisi hazırlar."},
{sel:"#hmHw", title:"Ödevlerim", text:"Uzmanın verdiği ödevler ve çalışmalara göre önerilen sonraki adımlar."},
{sel:"#hmGame", title:"Bilişsel Oyun", text:"Çocuğun tek başına oynadığı Zihin Adaları. Oyundan çıkış ebeveyn kontrolüyle korunur."},
{sel:"#hmModeNote", title:"Aile ve Uzman modu", text:"Hangi modda olduğunuzu gösterir. Uzman modunda danışanlar, programlar ve ödev verme açılır; geçmeden önce onay sorulur."},
{sel:"#hmSet", title:"Ayarlar", text:"Ses, görünüm ve yazı boyutu, hesap ve bulut eşitleme, Uzman PIN'i ve tanıtımları yeniden gösterme burada."}
] },
modes: {
key: "wm_tour_modes_seen_v2",
steps: [
{sel:'#modeScreen .mode-card[data-mode="etkinlik"]', title:"Bilişsel Etkinlik", text:"Yetişkinle birlikte yapılan çalışmalar. Yetişkin yönergeyi verir; sözlü cevapları ve süreyi takip eder."},
{sel:'#viewSwitch', title:"Görünüm", text:"Uzman: düzeyi, çalışmayı ve aşamayı kendin seçersin. Aile: çalışmalar sırayla ilerler, zorluk kendiliğinden ayarlanır."},
{sel:'#modeScreen .mode-card[data-mode="cocuk"]', title:"Bilişsel Oyun", text:"Çocuk tek başına oynar: dokunarak cevap verir, uygulama puanlar ve yıldız verir. Çıkış için ebeveyn kontrolü sorulur."}
]
},
level: {
key: "wm_tour_level_seen_v1",
steps: [
{sel:'#readingLevelScreen .mode-card[data-level="pre"]',  title:"Okul Öncesi",  text:"Henüz okuma yazma bilmeyen çocuklar için (3-6 yaş). Okuma gerektirmeyen çalışmalar gelir; ekranda daha az öge ve çeşit olur."},
{sel:'#readingLevelScreen .mode-card[data-level="post"]', title:"Okul Sonrası", text:"Okuma yazma bilen çocuklar ve yetişkinler için: okuma gerektirenler dahil tüm çalışmalar."},
{sel:"#readingLevelScreen .player-row", title:"Kim çalışıyor?", text:"İstersen çalışacak kişiyi şimdi seç ya da yeni kişi ekle. Seçtiğin düzey o kişiye kaydedilir, sonraki sefer aynı düzey önerilir. Seçmezsen çalışma ekranında da seçebilirsin."}
]
},
category: { key: "wm_tour_category_seen_v3", steps: [
{sel:"#categoryList .category-card", title:"Alanlar", text:"Her kart bir beceri alanı. Dokununca o alanın etkinlikleri açılır; kartın üstündeki sayı, bu alanda yapılan etkinlikleri gösterir."},
{sel:"#fhTodayBtn", title:"Bugünün etkinlikleri", text:"Günün dört etkinliğine buradan başlayın; kaçının yapıldığı yanında yazar."},
{sel:"#catTopInfo", title:"Alanlar hakkında", text:"Her alanın neyi çalıştırdığını ve hangi durumlarda önerildiğini buradan okuyabilirsiniz."},
{sel:"#catDock", title:"Alt çubuk", text:"Ödevlerim, Gelişim (alanlara göre ilerleme), Bu hafta (haftalık özet) ve Uzmana bağlan."},
{sel:"#catTopHome", title:"Ana sayfa", text:"Ana sayfaya dönmek için."}
] },
islands: {
key: "wm_tour_islands_seen_v2",
steps: [
{sel:"#islandScreen .isl-head", title:"Zihin Adaları", text:"Çocuğun tek başına oynadığı harita. Toplam yıldız sağ üstte görünür; kıyas yalnızca çocuğun kendi önceki sonuçlarıyla yapılır."},
{sel:"#islandScreen .isl-who", title:"Kim oynuyor?", text:"Oynamadan önce çocuğu seçin. Yıldızlar ve düzey her çocuğa özeldir; aynı cihazı kardeşler de kullanabilir."},
{sel:"#islandMap .isl-island", title:"Adalar ve duraklar", text:"Her ada bir beceri alanı. Her durakta Başlangıç, Orta ve Zor için üç yıldız var; zorluk kazanılan yıldıza göre kendiliğinden seçilir. İlk günlerde birkaç ada açıktır; diğerleri toplam yıldız arttıkça keşfedilir. Kilitli adaya dokununca kaç yıldız gerektiği yazar."},
{sel:"#islandRoute .rt-card", title:"Bugünün Rotası", text:"Her gün 3–4 duraklık rota: ısınma, haftanın hedef alanı (uzman seçtiyse 'özel görev') ve çocuğun sevdiği adadan kapanış. Zorlandığı durakta ipucu verilir; iki kez zorlanırsa bir alt düzeyle ısınır."},
{sel:"#islandRoute .rt-row", title:"Işık, hafta ve dolap", text:"Işık; bitirmek, başarmak, kendini geçmek ve ipucunu kullanmak için verilir, adalar ışıkla büyür. Süre hedefi tutturulursa ayrıca ⚡ şimşek rozeti kazanılır; tutturulamazsa hiçbir şey kaybedilmez. Haftalık hedef 4 gün; kaçırılan gün sıfırlamaz. Aksesuarlar satın alınmaz, hedeflerle açılır. Günlük süre Ayarlar'dan değişir."},
{sel:"#islandNext", title:"Sıradaki durak", text:"'Oyna' ile durak açılır. Yönerge sesli okunur; oyun ekranındaki hoparlörle konuşma kapatılabilir. Çalışma bitince kronometre kendiliğinden durur ve ödül ekranı çıkar."},
{sel:"#islandBackBtn", title:"Ebeveyn kontrolü", text:"Oyundan çıkmak için bir işlem sorusu sorulur; çocuk yanlışlıkla çıkamaz."}
]
},
today: { key: "wm_tour_today_seen_v3", steps: [
{sel:"#todayWrap .fam-target", title:"Haftanın hedefi", text:"Bu hafta öncelik verilen alan. Değiştir ile başka bir alan seçebilirsiniz."},
{sel:"#todayWrap .fam-steps", title:"Dört adım", text:"Isınma, iki ana çalışma ve kapanış. Her adım çocuğun düzeyine göre seçilir; zorluk her çalışmada sonuca göre ayarlanır."},
{sel:"#famStartCta", title:"Oturumu başlat", text:"Adımlar sırayla açılır. Her adımın sonunda sonucu kaydedin; oturum bitince özet görünür."}
] },
expert: {
key: "wm_tour_expert_seen_v1",
steps: [
{sel:"#exNewBtn", title:"Danışan ekle", text:"Çocuğun adını ve okul dönemini girin; uygulama aileye vereceğiniz 8 karakterlik bir bağlantı kodu üretir."},
{sel:"#expertWrap .ex-client", title:"Danışan kartı", text:"Bu haftaki programdan tamamlanan günler çubuk olarak görünür. Karta dokunarak program atayabilir (hedef alan, günler, süre, önerilen çalışmalar) ve son sonuçları izleyebilirsiniz."}
]
},
main: {
key: "wm_tour_seen_v3",
steps: [
{sel:"#lsToggleBtn", title:"Üst bölüm", text:"Ekran kısa olduğu için etkinlik, kişi, düzey ve aşama seçicileri bu düğmenin içinde. Dokununca açılır."},
{sel:"#exhExBtn", title:"Etkinlik", text:"Şu anki etkinliğin adı. Dokununca bu alandaki bütün etkinlikler listelenir; aradığınızı yazarak bulabilirsiniz.", menu:true},
{sel:"#exhWho", title:"Kişi", text:"Sonuçların kaydedileceği çocuk.", menu:true},
{sel:"#exhTier", title:"Düzey", text:"Başlangıç, Orta, Zor. Uygulama başarıya göre düzeyi kendisi önerir; buradan elle de değiştirebilirsiniz.", menu:true},
{sel:"#exhStage", title:"Aşama", text:"Bazı etkinliklerin birden çok aşaması vardır; her aşamanın yönergesi farklıdır.", menu:true},
{sel:"#instructionBox", title:"Yönerge", text:"Çocuğa söyleyeceğiniz cümle. Hoparlör düğmesi yönergeyi sesli okur ya da sesi kapatır."},
{sel:"#timerBtn", title:"Başlat ve Bitir", text:"Başlat'a basınca süre başlar ve ekran sadeleşir. Bitir'e basınca süre durur; ardından sonucu kaydedin."},
{sel:"#errorRow", title:"Hata sayısı", text:"Söylemeli etkinliklerde yanlışları + ile siz eklersiniz. Dokunmalı etkinliklerde uygulama kendisi sayar."},
{sel:"#board", title:"Tahta", text:"Çocuğun baktığı ya da dokunduğu alan."},
{sel:"#reshuffleBtn", title:"Karıştır", text:"Aynı etkinliği yeni bir dizilimle verir."},
{sel:"#nextBtn", title:"Önceki ve Sonraki", text:"Etkinlikler arasında geçiş."},
{sel:"#exhCloud", title:"Kayıt durumu", text:"Sonuçların bulutla eşitlenip eşitlenmediğini gösterir. Bağlantı yoksa sonuçlar cihazda bekler, bağlantı gelince yüklenir.", menu:true}
] },
hw: { key: "wm_tour_hw_seen_v1", steps: [
{sel:"#linkWrap [id^=hwLinkBtn]", title:"Uzman ödevleri", text:"Bir uzmana bağlandığınızda uzmanın verdiği ödevler burada görünür."},
{sel:"#devPlaceBtn, #devPlaceBtn2", title:"Değerlendirme turu", text:"Her alanda çocuğun başlangıç düzeyini bulan kısa tur. Önerilen çalışmalar bu sonuca göre hazırlanır."},
{sel:"#linkWrap .dev-card", title:"Önerilen çalışmalar", text:"Çalışmalara göre hazırlanan sonraki adımlar. Karta dokununca açılır; Etkinliğe başla ile ödev başlar, Yarına ertele ile bir gün sonraya kalır."},
{sel:"#linkWrap details.fam-card", title:"Bu ödevler nasıl seçilir?", text:"Önerilerin hangi kurala göre seçildiğini buradan okuyabilirsiniz."}
] }
};
let tourState = null;

function tourSeen(kind){ try{ return localStorage.getItem(TOURS[kind].key) === "1"; }catch(e){ return true; } }
function tourMarkSeen(kind){ try{ localStorage.setItem(TOURS[kind].key, "1"); }catch(e){} }

function tourVisible(el){
if(!el) return false;
const r = el.getBoundingClientRect();
if(r.width < 4 || r.height < 4) return false;
const cs = getComputedStyle(el);
if(cs.display === "none" || cs.visibility === "hidden") return false;
/* KURAL (tanıtım yeniden, 2026-11-09): sayfa tanıtımları güncel ekranlara göre yazılıdır (ana sayfa, alanlar, etkinlik sayfası, Bugün, Ödevlerim); anahtarlar yenilendi — eski arayüze göre yazıldıkları için adımları görünmüyor ve "görüldü" sayılıp hiç gösterilmiyorlardı. Her sayfa ilk girişte bir kez tanıtılır; Ayarlar'dan yeniden gösterilebilir */
/* KURAL (tanıtım): başka bir ekranın/pencerenin altında kalan öğe gösterilmez (boş yer vurgulanmasın); içi boş öğe de atlanır */
try{ if(r.bottom > 0 && r.top < innerHeight){ const x = Math.max(1, Math.min(innerWidth - 1, r.left + r.width / 2)), y = Math.max(1, Math.min(innerHeight - 1, r.top + Math.min(r.height / 2, 24))); const stack = document.elementsFromPoint(x, y).filter(e => !e.closest("#tourOverlay, #tourSpot, #tourBubble, #tourArrow")); const top = stack[0]; if(top && !el.contains(top) && !top.contains(el)){ let n = top; while(n && n !== document.body){ if(getComputedStyle(n).position === "fixed" && !n.contains(el)) return false; n = n.parentElement; } }   /* hedefin üstünde, onu içermeyen sabit bir katman (ekran, pencere, kapat düğmesi) varsa hedef örtülüdür */ } }catch(e){}
if(!(el.innerText || "").trim() && !el.querySelector("img,svg,canvas,input,select,button,.cell")) return false;
return true;
}
/* bir pencere ya da Değerlendirme turu açılınca süren tanıtım durdurulur ve "görüldü" sayılmaz; ekran yeniden açılınca baştan gösterilir */
function pauseTour(){ try{ if(!tourState) return; const k = tourState.kind, forced = !tourState.mandatory; endTour(); if(!forced && TOURS[k]) localStorage.removeItem(TOURS[k].key); }catch(e){} }

/* KURAL (sadelik): tanıtım turu açık bir pencerenin (Kişi ekle, rol sorusu, Değerlendirme turu, onay kutusu) üstüne açılmaz; pencere kapanınca başlar */
function tourBlockedByModal(){ return ["whoSheet","roleScreen","placeScreen","zaDlg","consentScreen","onboardScreen"].some(id => { const e = document.getElementById(id); return e && getComputedStyle(e).display !== "none" && e.getBoundingClientRect().height > 0; }) || !!document.querySelector(".who-sheet[style*='flex'], .mola-sheet[style*='flex']"); }
function scheduleTour(kind, screenId, tries){
if(tourSeen(kind)) return;
if(typeof gameMode !== "undefined" && gameMode) return;
tries = tries || 0;
setTimeout(()=>{
if(document.getElementById(screenId).style.display === "none") return;
if(tourBlockedByModal()){ if(tries < 120) scheduleTour(kind, screenId, tries + 1); return; }
startTour(kind, false);
}, tries ? 1500 : 500);
}

function computeTourSteps(kind){
const ls = kind === "main" && landscapeMQ.matches;
let steps = TOURS[kind].steps.filter(st => !(ls && st.skipCompact));
if(ls) setLsOpen(true);
steps = steps.filter(st => tourVisible(document.querySelector(st.sel)));
if(ls){
setLsOpen(false);
const toggle = steps.filter(s => s.sel === "#lsToggleBtn");
const inMenu = steps.filter(s => s.menu);
const rest   = steps.filter(s => !s.menu && s.sel !== "#lsToggleBtn");
steps = [...toggle, ...inMenu, ...rest];
} else {
steps = steps.filter(s => s.sel !== "#lsToggleBtn");
}
return steps;
}

function startTour(kind, force){
if(tourState) return;
if(!force && tourSeen(kind)) return;
const steps = computeTourSteps(kind);
if(!steps.length){ tourMarkSeen(kind); return; }
const scroller = document.scrollingElement || document.documentElement;
const mainEl = document.getElementById("mainApp");
tourState = { kind, steps, i:0, final:false, mandatory: !force, placement:"", saved:{ doc: scroller.scrollTop, app: mainEl.scrollTop } };
document.getElementById("tourSkipBtn").style.display = "block"; /* KURAL (tanıtım geç, 2026-11-09): ilk girişte kendiliğinden açılan tanıtımda da "Turu kapat" görünür; kapatılan tanıtım görüldü sayılır, bir daha kendiliğinden açılmaz (Ayarlar'dan yeniden gösterilebilir) */
document.getElementById("tourOverlay").style.display = "block";
showTourStep();
}

function showTourStep(){
const t = tourState; if(!t) return;
if(t.i >= t.steps.length){
if(t.kind === "main") showTourFinal();   // "Hadi başlayalım!" yalnızca en sondaki turun sonunda
else endTour();
return;
}
const st = t.steps[t.i];
if(t.kind === "main" && landscapeMQ.matches) setLsOpen(!!st.menu);
const el = document.querySelector(st.sel);
if(!tourVisible(el)){ t.i++; showTourStep(); return; }
try{ el.scrollIntoView({block:"center", inline:"nearest"}); }catch(e){}
requestAnimationFrame(()=>requestAnimationFrame(positionTourStep));
}

function positionTourStep(){
const t = tourState; if(!t || t.final) return;
const st = t.steps[t.i];
const el = document.querySelector(st.sel);
if(!tourVisible(el)){ t.i++; showTourStep(); return; }
const spot = document.getElementById("tourSpot");
const bubble = document.getElementById("tourBubble");
const arrow = document.getElementById("tourArrow");
const W = window.innerWidth, H = window.innerHeight;
const compact = landscapeMQ.matches;
const pad = 6, arrowH = compact ? 30 : 38, gap = 6;

document.getElementById("tourStep").textContent = `${t.i+1} / ${t.steps.length}`;
document.getElementById("tourTitle").textContent = st.title;
document.getElementById("tourText").textContent = st.text;
const bw = Math.min(W - 24, compact ? 600 : (W >= 600 ? 440 : 330));
bubble.style.display = "";
bubble.style.width = bw + "px";
bubble.style.left = "0px"; bubble.style.top = "0px";
const bh = bubble.offsetHeight;
const need = bh + arrowH + gap;

let R = el.getBoundingClientRect();
const roomBelow = () => H - (R.bottom + pad) - 12;
const roomAbove = () => (R.top - pad) - 12;
if(roomBelow() < need && roomAbove() < need){
const prevMargin = el.style.scrollMargin;
el.style.scrollMargin = "16px";
for(const align of ["start","end"]){
try{ el.scrollIntoView({block:align, inline:"nearest"}); }catch(e){}
R = el.getBoundingClientRect();
if(roomBelow() >= need || roomAbove() >= need) break;
}
el.style.scrollMargin = prevMargin;
}

spot.style.display = "block";
spot.style.left = (R.left - pad) + "px";
spot.style.top = (R.top - pad) + "px";
spot.style.width = (R.width + pad*2) + "px";
spot.style.height = (R.height + pad*2) + "px";

const fits = roomBelow() >= need || roomAbove() >= need;
const below = roomBelow() >= need || (roomAbove() < need && roomBelow() >= roomAbove());
let top;
if(fits){
top = below ? (R.bottom + pad + arrowH + gap) : (R.top - pad - arrowH - gap - bh);
t.placement = below ? "below" : "above";
} else {
top = R.top + R.height/2 - bh/2;
t.placement = "overlay";
}
top = Math.max(8, Math.min(H - bh - 8, top));
const left = Math.max(12, Math.min(W - bw - 12, R.left + R.width/2 - bw/2));
bubble.style.left = left + "px";
bubble.style.top = top + "px";

if(fits){
arrow.style.display = "block";
arrow.className = "tour-arrow " + (below ? "up" : "down");
arrow.style.left = Math.max(8, Math.min(W - 38, R.left + R.width/2 - 15)) + "px";
arrow.style.top = (below ? (R.bottom + pad + 2) : (R.top - pad - 2 - arrowH)) + "px";
} else {
arrow.style.display = "none";
}
}

function showTourFinal(){
const t = tourState; if(!t) return;
t.final = true;
if(t.kind === "main" && landscapeMQ.matches) setLsOpen(false);
document.getElementById("tourOverlay").classList.add("final");
["tourSpot","tourBubble","tourArrow"].forEach(id => document.getElementById(id).style.display = "none");
document.getElementById("tourFinal").style.display = "flex";
}

function endTour(){
const t = tourState;
const ov = document.getElementById("tourOverlay");
ov.style.display = "none";
ov.classList.remove("final");
document.getElementById("tourFinal").style.display = "none";
if(t){
tourMarkSeen(t.kind);
if(t.kind === "main" && landscapeMQ.matches) setLsOpen(false);
const scroller = document.scrollingElement || document.documentElement;
scroller.scrollTop = t.saved.doc;
document.getElementById("mainApp").scrollTop = t.saved.app;
if(t.kind === "modes") document.getElementById("modeScreen").scrollTop = 0;
if(t.kind === "level") document.getElementById("readingLevelScreen").scrollTop = 0;
if(t.kind === "category") document.getElementById("categoryScreen").scrollTop = 0;
}
tourState = null;
}

function tourAdvance(){
if(!tourState) return;
if(tourState.final){ endTour(); return; }
tourState.i++;
showTourStep();
}

document.getElementById("tourOverlay").addEventListener("click", tourAdvance);
document.getElementById("tourSkipBtn").addEventListener("click", (e)=>{ e.stopPropagation(); endTour(); });
document.addEventListener("keydown", (e)=>{
if(!tourState) return;
if(e.key === "Escape"){ if(!tourState.mandatory) endTour(); }
else if(e.key === "Enter" || e.key === " " || e.key === "ArrowRight"){ e.preventDefault(); tourAdvance(); }
});
window.addEventListener("resize", ()=>{ if(tourState && !tourState.final) positionTourStep(); });

function watchTourScreen(screenId, kind){
new MutationObserver(()=>{
const el = document.getElementById(screenId);
if(el.style.display !== "none" && !tourState && !tourSeen(kind)) scheduleTour(kind, screenId);
}).observe(document.getElementById(screenId), {attributes:true, attributeFilter:["style"]});
}
watchTourScreen("modeScreen", "modes");
watchTourScreen("readingLevelScreen", "level");
watchTourScreen("categoryScreen", "category");

document.getElementById("settingsTourLink").addEventListener("click", (e)=>{
e.preventDefault();
closeSettings(); try{ endTour(); }catch(_){} ["home","category","islands","today","expert","level","hw"].forEach(k => { try{ localStorage.removeItem(TOURS[k].key); }catch(_){} });
if(getComputedStyle(document.getElementById("mainApp")).display === "none" || getComputedStyle(document.getElementById("whoScreen")).display !== "none"){ document.getElementById("whoScreen").style.display = "none"; hideFamScreens(); if(appMode === "cocuk" || !appMode) appMode = "uzman"; if(!readingLevel) readingLevel = "post"; const ci = CATEGORIES.findIndex(c => !c.hidden && c.exerciseIds.length); selectCategory(ci); try{ goToIndex(findSeqIndex(0, 0)); newPage(); }catch(_){} document.getElementById("categoryScreen").style.display = "none"; document.getElementById("mainApp").style.display = "block"; }
setTimeout(()=>startTour("main", true), 450); });
document.getElementById("settingsModeTourLink").addEventListener("click", (e)=>{
e.preventDefault();
closeSettings();
showWho();
setTimeout(()=>startTour("home", true), 450);
});
document.getElementById("settingsLevelTourLink").addEventListener("click", (e)=>{
e.preventDefault();
closeSettings();
document.getElementById("modeSwitchBtn").click();
setTimeout(()=>{ startApp(appMode === "aile" ? "aile" : "uzman"); }, 250);
setTimeout(()=>startTour("level", true), 750);
});
document.getElementById("settingsCategoryTourLink").addEventListener("click", (e)=>{
e.preventDefault();
closeSettings(); try{ endTour(); }catch(_){} document.getElementById("whoScreen").style.display = "none"; ["mainApp"].forEach(id => document.getElementById(id).style.display = "none"); if(appMode === "cocuk" || !appMode) appMode = getEtkinlikView() === "uzman" ? "uzman" : "aile"; renderCategoryList(); document.getElementById("categoryScreen").style.display = "block"; setTimeout(()=>startTour("category", true), 450); });

function selectCategory(i){ if(!imagesReady()){ imgWait(() => selectCategory(i)); return; } try{ const __c = CATEGORIES[i]; if(__c) applyPlacedLevel(__c.id, (appMode === "aile" && typeof famProfile === "function") ? famProfile() : currentPlayerName); }catch(e){}
currentCategoryIndex = i;
if(currentCategoryExercises().length === 0){
document.getElementById("categoryScreen").style.display = "none";
document.getElementById("emptyCategoryTitle").textContent = currentCategory().label;
document.getElementById("emptyCategoryScreen").style.display = "block";
return;
}
SEQUENCE = buildSequenceForCategory(); currentIndex = 0; currentStageIndex = 0; navTier = 0;
document.getElementById("categoryScreen").style.display = "none";
document.getElementById("mainApp").style.display = "flex";
const catLabelEl = document.getElementById("categoryLabel");
if(catLabelEl) catLabelEl.textContent = currentCategory().label;
const catIconEl = document.getElementById("categoryIconSlot");
if(catIconEl){
catIconEl.innerHTML = categoryIconSVG(currentCategory().id, currentCategory().color);
catIconEl.style.color = currentCategory().color;
}
applyModeVisibility(); renderTierRow(); renderExerciseRow(); renderStageRow(); newPage(); try{ if(appMode === "uzman"){ const st = placedStep(currentCategory().id, currentPlayerName); if(st != null){ const tt = stepTier(st), si = findSeqIndex(tt, 0); if(si > 0){ navTier = tt; goToIndex(si); } } } }catch(e){} /* uzman girişi: değerlendirme yerleşimindeki düzeyden başla */ scheduleTour("main", "mainApp"); }

function openCategoryScreen(){ ZA_LIFE.leave(); 
resetTimer();
try{ exitSessionMode(); exitRecMode(); }catch(e){}
categoryBackTarget = "mainApp";
document.getElementById("mainApp").style.display = "none";
renderCategoryList();
document.getElementById("categoryScreen").style.display = "block";
}

let onboardStep = 0;
const ONBOARD_SLIDES = 2;   /* KURAL (sadelik): tanıtım iki ekran, terimsiz */

function renderOnboardDots(){
const dots = document.getElementById("onboardDots");
dots.innerHTML = "";
for(let i=0;i<ONBOARD_SLIDES;i++){
const d = document.createElement("div");
d.className = "dot" + (i===onboardStep ? " on" : "");
dots.appendChild(d);
}
}

function showOnboardStep(i){
onboardStep = i;
document.querySelectorAll(".onboard-slide").forEach(s=>{
s.classList.toggle("active", parseInt(s.dataset.slide,10) === i);
});
renderOnboardDots();
document.getElementById("onboardNextLabel").textContent = i === ONBOARD_SLIDES-1 ? "Hadi başlayalım →" : "Devam →";
document.getElementById("onboardBackBtn").style.display = i > 0 ? "flex" : "none";
}

const TEXT_SIZE_KEY = "wm_text_size_v1";

function applyTextSize(size){
document.documentElement.classList.remove("text-lg","text-xl");
if(size === "lg") document.documentElement.classList.add("text-lg");
if(size === "xl") document.documentElement.classList.add("text-xl");
document.querySelectorAll(".text-size-btn").forEach(btn=>{
btn.classList.toggle("active", btn.dataset.size === size);
});
const mainAppEl = document.getElementById("mainApp");
if(mainAppEl && mainAppEl.style.display !== "none"){
renderBoard();
}
}

const savedTextSize = localStorage.getItem(TEXT_SIZE_KEY) || "normal";
applyTextSize(savedTextSize);

document.querySelectorAll(".text-size-btn").forEach(btn=>{
btn.addEventListener("click", ()=>{
localStorage.setItem(TEXT_SIZE_KEY, btn.dataset.size);
applyTextSize(btn.dataset.size);
});
});

const CONSENT_KEY = "wm_consent_accepted_v1";
const SEEN_ONBOARDING_KEY = "wm_seen_onboarding_v1";
const RETURN_SLOGANS = [
"Bugün zihnini ısıt, yarın fark et.",
"Küçük turlar, büyük kazanımlar.",
"Odaklan. Hızlan. Şaşırt kendini.",
"Her gün birkaç dakika, kalıcı bir fark.",
"Zihnin de antrenman ister.",
"Bugünkü rekorun hazır mı?",
"Dikkat de bir kastır, onu da çalıştır.",
"Hız kazan, zamana hakim ol.",
"Beynin için en keyifli birkaç dakika.",
"Bugün hangi rekoru kıracaksın?",
"Küçük adımlar, keskin zihinler.",
"Az ve sık çalış, alışkanlık gücünü kullan.",
"Zihnini oyun gibi çalıştır.",
"Bugün senin antrenman günün.",
"Hazır ol, zihnin seni bekliyor."
];
let onboardEntryScreen = "onboardScreen";
let modeScreenBackTarget = "onboardScreen";
let categoryBackTarget = "readingLevelScreen";

function proceedAfterOnboarding(){
localStorage.setItem(SEEN_ONBOARDING_KEY, "true");
document.getElementById("onboardScreen").style.display = "none";
document.getElementById("returnSplashScreen").style.display = "none";
if(localStorage.getItem(CONSENT_KEY) === "true"){
modeScreenBackTarget = "onboardScreen";
if(typeof showWho === "function"){ try{ if(isExpertDevice()) setEtkinlikView("uzman"); }catch(e){} showWho(); return; }
document.getElementById("modeScreen").style.display = "flex";
} else {
document.getElementById("consentScreen").style.display = "flex";
}
}

document.getElementById("returnSplashIcon").innerHTML = `<div class="logo-zihni">${zihniSVG("wave")}</div>`;
document.getElementById("returnSloganText").textContent = randomItem(RETURN_SLOGANS);
document.getElementById("returnSplashBtn").addEventListener("click", proceedAfterOnboarding);
const LAST_KEY = "wm_last_v1";
function lastGet(){ try{ return JSON.parse(localStorage.getItem(LAST_KEY) || "null"); }catch(e){ return null; } }
function lastSave(mode, player){ const p = (player || "").trim(); if(!p || p === "Misafir" || p === "Oyuncu") return; const rec = { mode, level: readingLevel === "pre" ? "pre" : "post", player: p, t: Date.now() };
try{ localStorage.setItem(LAST_KEY, JSON.stringify(rec)); const m = JSON.parse(localStorage.getItem("wm_last_by") || "{}"); m[p] = rec; localStorage.setItem("wm_last_by", JSON.stringify(m)); }catch(e){} }
function lastFor(n){ try{ const m = JSON.parse(localStorage.getItem("wm_last_by") || "{}"); if(m[n]) return m[n]; }catch(e){} const L = lastGet(); if(L && L.player === n) return L; return lastInfer(n); }
function lastInfer(n){ try{ const lv = getPlayerLevel(n) || "post"; let sT = 0; loadSessions().forEach(r => { if((r.player || "").trim() === n && r.t > sT) sT = r.t; });
let gT = 0; const keep = currentPlayerName, keepL = readingLevel; try{ currentPlayerName = n; readingLevel = lv; const g = gxGet(); Object.keys(g.screen || {}).forEach(k => { const t = Date.parse(k); if(!isNaN(t) && t > gT) gT = t + 12 * 36e5; }); }catch(e){} finally{ currentPlayerName = keep; readingLevel = keepL; }
if(!gT){ const d = (gameStoreAll()[n] || {})[lv] || {}; if(Object.values(d).some(r => r && (r.plays || (r.stars && r.stars.some(Boolean))))) gT = 1; }
if(!sT && !gT) return null; const mode = gT >= sT ? "cocuk" : (getEtkinlikView() === "uzman" ? "uzman" : "aile"); return { mode, level: lv, player: n, t: Math.max(sT, gT) }; }catch(e){ return null; } }
const MODE_NAMES = { cocuk:"Zihin Adaları", aile:"Bilişsel Etkinlik · Aile", uzman:"Bilişsel Etkinlik · Uzman" };
function renderResume(){ const L = lastGet(), btn = document.getElementById("returnSplashBtn"); let el = document.getElementById("resumeCard");
  const ok = L && L.player && localStorage.getItem(CONSENT_KEY) === "true" && MODE_NAMES[L.mode];
  if(!ok){ if(el) el.remove(); return; }
  if(!el){ el = document.createElement("button"); el.type = "button"; el.id = "resumeCard"; el.className = "resume-card"; btn.parentNode.insertBefore(el, btn); el.addEventListener("click", resumeLast); }
  el.innerHTML = `<span class="rc-play">▶</span><span class="rc-tx"><b>Kaldığın yerden devam</b><span>${escHTML(L.player)} · ${MODE_NAMES[L.mode]} · ${L.level === "pre" ? "Okul Öncesi" : "Okul Sonrası"}</span></span>`;
  btn.textContent = "Başka kişi ya da mod"; btn.classList.add("rc-alt"); }
function resumeLast(rec){ const L = (rec && rec.mode) ? rec : lastGet(); if(!L) return proceedAfterOnboarding();
  localStorage.setItem(SEEN_ONBOARDING_KEY, "true"); document.getElementById("returnSplashScreen").style.display = "none";
  readingLevel = L.level; try{ applyLevelDefaultThresholds(readingLevel); }catch(e){}
  if(L.mode === "cocuk"){ appMode = "cocuk"; currentPlayerName = L.player; try{ showIslandMap(); }catch(e){ proceedAfterOnboarding(); } return; }
  try{ exitGameMode(); exitSessionMode(); exitRecMode(); hideFamScreens(); hideLinkScreens(); }catch(e){}
  try{ setEtkinlikView(L.mode === "uzman" ? "uzman" : "aile"); }catch(e){}
appMode = L.mode; pendingLevelPlayerName = L.player; pendingLevelPlayerIsNew = false;
  try{ chooseReadingLevel(L.level); }catch(e){ console.error(e); proceedAfterOnboarding(); } }

// ===== Uygulama içi onay ve uyarı pencereleri =====
function zaDialog(msg, opts){ try{ if(!(typeof gameMode !== "undefined" && gameMode) && (window.__zaInstrActive || window.__zaInstrRT)){ clearTimeout(window.__zaInstrRT); window.__zaInstrRT = null; if(window.__zaInstrActive){ window.__zaInstrCut = true; zaStopSpeech(); } if(window.__zaInstrActive || window.__zaInstrCut || window.__zaInstrSpoken !== window.__zaInstrKey) zaInstrWaitModal(); } }catch(e){} try{ return new Promise(res => { let d = document.getElementById("zaDlg"); if(!d){ d = document.createElement("div"); d.id = "zaDlg"; document.body.appendChild(d); }
const danger = opts && opts.danger, alertOnly = opts && opts.alert;
d.innerHTML = `<div class="zd-card" role="dialog" aria-modal="true"><div class="zd-ic ${danger ? "dg" : ""}">${hmIc(danger ? "warn" : alertOnly ? "info" : "ask")}</div><div class="zd-msg"></div><div class="zd-row">${alertOnly ? "" : `<button type="button" class="zd-no">Vazgeç</button>`}<button type="button" class="zd-yes${danger ? " danger" : ""}">${alertOnly ? "Tamam" : /kaldır/i.test(msg) ? "Evet, kaldır" : /sil/i.test(msg) ? "Evet, sil" : danger ? "Evet" : "Tamam"}</button></div></div>`;
d.querySelector(".zd-msg").textContent = msg; d.style.display = "flex";
const done = (v) => { d.style.display = "none"; res(v); };
d.querySelector(".zd-yes").onclick = () => done(true); const no = d.querySelector(".zd-no"); if(no) no.onclick = () => done(false);
d.onclick = (e) => { if(e.target === d) done(false); }; }); }finally{ try{ zaDlgPlace(); setTimeout(zaDlgPlace, 60); setTimeout(zaDlgPlace, 400); }catch(e){} } }
function zaConfirm(msg){ return zaDialog(msg, { danger: /sil|kaldır|geri alınamaz|birleştir/i.test(msg) }); }
function zaAlert(msg){ return zaDialog(msg, { alert: true }); }
// ===== Ana menü simgesi: daire içinde çizgi ev =====
const HOME_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0A847E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/></svg>';
document.querySelectorAll(".home-btn").forEach(b => { b.innerHTML = HOME_SVG; });
// ===== Ana ekran motivasyon cümleleri =====

function hmIc(k){ const P = { user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>', users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.8 2.9-6 6.5-6s6.5 2.2 6.5 6"/><circle cx="17" cy="9" r="2.8"/><path d="M16.5 14.2c3 .2 5 2.2 5 5.3"/>', brief:'<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7"/><path d="M3 12.5h18"/>', home:'<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>', clip:'<rect x="5" y="4.5" width="14" height="16.5" rx="2.5"/><path d="M9 4.5V3.5h6v1"/><path d="m8.8 13 2.2 2.2 4.4-4.4"/>',
star:'<path d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>', island:'<path d="M3 19c3-2 6-2 9 0s6 2 9 0"/><path d="M12 17V8"/><path d="M12 8c-2-3-6-3-7-1 2 0 4 .5 7 1zM12 8c2-3 6-3 7-1-2 0-4 .5-7 1z"/>', bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
hat:'<path d="M4 18h16"/><path d="M7 18V9a5 5 0 0 1 10 0v9"/><path d="M7 14h10"/>', smile:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1.8 2 5.2 2 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/>', heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', rocket:'<path d="M12 3c3 2 5 5.5 5 10l-2.5 3h-5L7 13c0-4.5 2-8 5-10z"/><circle cx="12" cy="10" r="1.6"/><path d="M9.5 16 8 20M14.5 16l1.5 4"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 7.5h.01"/>', warn:'<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5"/><path d="M12 17.3h.01"/>', ask:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.6"/><path d="M12 16.8h.01"/>',
phone:'<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>', trash:'<path d="M4 7h16"/><path d="M9 7V4.5h6V7"/><path d="M6.5 7l1 13h9l1-13"/><path d="M10 11v5.5M14 11v5.5"/>', lock:'<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', unlock:'<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>' , pin:'<path d="M9 3.5h6l-.8 5.5 3.3 3.2H6.5L9.8 9z"/><path d="M12 12.2V21"/>', blocks:'<rect x="3.5" y="11" width="8.5" height="8.5" rx="1.8"/><rect x="11.5" y="4.5" width="8.5" height="8.5" rx="1.8"/>', book:'<path d="M12 6.5C10 5 7 4.5 3.5 5v13.5C7 18 10 18.5 12 20c2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z"/><path d="M12 6.5V20"/>', key:'<circle cx="8" cy="15.5" r="4"/><path d="m10.9 12.6 8.6-8.6M16.5 7l2.6 2.6M14.2 9.3l2 2"/>', sprout:'<path d="M12 21v-8.5"/><path d="M12 12.5c0-4 3-6.5 7.5-6.5 0 4.3-3 6.5-7.5 6.5z"/><path d="M12 15c0-3-2.3-5-6-5 0 3.4 2.4 5 6 5z"/>', refresh:'<path d="M19.5 11a7.5 7.5 0 0 0-13.6-4.3M4.5 13a7.5 7.5 0 0 0 13.6 4.3"/><path d="M5.5 3v4h4M18.5 21v-4h-4"/>', search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>'};
return `<svg class="hm-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k] || ""}</svg>`; }
function icI(k, px, col){ return `<span class="ic-inl" style="display:inline-flex;width:${px}px;height:${px}px;color:${col || "currentColor"};vertical-align:-0.18em;flex:none">${hmIc(k).replace('class="hm-svg"', 'class="hm-svg" style="width:100%;height:100%;margin:0"')}</span>`; }   /* satır içi çizgi simge */
/* hmMotto: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */

renderResume();
// ===== Kalıcı cihaz tercihleri =====
const PREF_KEY = "wm_prefs_v1";
function prefsGet(){ try{ return JSON.parse(localStorage.getItem(PREF_KEY) || "{}"); }catch(e){ return {}; } }
function prefsSet(k, v){ const p = prefsGet(); p[k] = v; try{ localStorage.setItem(PREF_KEY, JSON.stringify(p)); }catch(e){} }
(function prefsLoad(){ try{ const p = prefsGet(); if("sound" in p) soundEnabled = !!p.sound; if("haptic" in p) hapticEnabled = !!p.haptic; if("confetti" in p) confettiEnabled = !!p.confetti; expertAdaptiveEnabled = ("expAdapt" in p) ? !!p.expAdapt : true;
const set = (id, v) => { const e = document.getElementById(id); if(e) e.checked = v; }; set("soundToggle", soundEnabled); set("hapticToggle", hapticEnabled); set("confettiToggle", confettiEnabled); set("expertAdaptiveToggle", expertAdaptiveEnabled);
[["soundToggle","sound"],["hapticToggle","haptic"],["confettiToggle","confetti"],["expertAdaptiveToggle","expAdapt"]].forEach(([id, k]) => { const e = document.getElementById(id); if(e) e.addEventListener("change", () => prefsSet(k, e.checked)); });

if(!("vibrate" in navigator)){ const h = document.getElementById("hapticToggle"); if(h){ h.checked = false; h.disabled = true; const g = h.closest(".settings-group"); const lab = g && g.querySelector(".settings-label"); if(lab && !lab.querySelector(".hap-note")) lab.insertAdjacentHTML("beforeend", `<span class="hap-note" style="display:block;font-size:12px;font-weight:600;color:var(--ink-soft)">Bu cihaz titreşimi desteklemiyor (iPhone'daki tarayıcılar izin vermez).</span>`); } }
}catch(e){ console.error(e); } })();
// ===== Ana menü =====
function goHome(lock){ ZA_LIFE.leave();  const go = () => { try{ resetTimer(); }catch(e){} try{ hideGameScreens(); exitGameMode(); }catch(e){} try{ hideFamScreens(); hideLinkScreens(); }catch(e){} ["mainApp","categoryScreen","growthScreen","aboutScreen"].forEach(id => { const e = document.getElementById(id); if(e) e.style.display = "none"; }); showWho(); };
if(lock) showParentLock(go); else go(); }
function addHomeBtn(afterId, lock, inline){ const ref = document.getElementById(afterId); if(!ref || ref.parentElement.querySelector(".home-btn")) return; const b = document.createElement("button"); b.type = "button"; b.className = "home-btn" + (inline ? " inl" : ""); b.setAttribute("aria-label", "Ana menü"); b.title = "Ana menü"; b.innerHTML = HOME_SVG; b.onclick = (e) => { e.stopPropagation(); goHome(lock); }; ref.insertAdjacentElement("afterend", b); }
[["islandStopsBackBtn", true], ["expertBackBtn", false], ["todayBackBtn", false], ["weekBackBtn", false], ["linkBackBtn", false]].forEach(([id, lk]) => addHomeBtn(id, lk));
addHomeBtn("gameMapBtn", true, true);
addHomeBtn("cloudBadge", false, true);   /* çalışma sayfası: bulutun yanında ana menü */
// ===== Gizlilik politikası uygulama içinde =====
function openPolicy(){ let v = document.getElementById("policyView"); if(!v){ v = document.createElement("div"); v.id = "policyView"; v.innerHTML = `<div class="pv-bar"><b>Gizlilik Politikası</b><button type="button" class="sheet-x" id="pvClose" aria-label="Kapat">✕</button></div><iframe src="gizlilik-politikasi.html" title="Gizlilik Politikası"></iframe>`; document.body.appendChild(v); document.getElementById("pvClose").onclick = () => { v.style.display = "none"; }; } v.style.display = "flex"; }
document.addEventListener("click", (e) => { const a = e.target.closest && e.target.closest('a[href="gizlilik-politikasi.html"]'); if(!a) return; e.preventDefault(); openPolicy(); }, true);
// ===== Ayarlar: tek başlık açık =====
document.addEventListener("toggle", (e) => { const d = e.target; if(!(d instanceof HTMLDetailsElement) || !d.classList.contains("set-sec") || !d.open) return; document.querySelectorAll("#settingsScreen details.set-sec[open]").forEach(x => { if(x !== d) x.open = false; }); }, true);

// ===== Uzman PIN'i (isteğe bağlı, yalnızca bu cihazda; özeti saklanır) =====
const PIN_KEY = "wm_expert_pin";
async function pinHash(p){ try{ const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("zihin|" + p)); return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join(""); }catch(e){ return "x" + p.split("").reverse().join(""); } }
function pinSet(){ try{ return !!localStorage.getItem(PIN_KEY); }catch(e){ return false; } }
function expertGate(go){ if(!pinSet() || sessionStorage.getItem("wm_pin_ok") === "1") return go();
const sh = whoSheet(`<div class="mola-h">Uzman PIN'i</div><div class="mola-s">Uzman bölümüne girmek için PIN'i yazın.</div><input id="pinIn" class="ex-input" type="password" inputmode="numeric" maxlength="6" autocomplete="off" style="width:100%;margin:8px 0;text-align:center;font-size:22px;letter-spacing:6px"><div class="ex-err" id="pinErr"></div><div class="mola-list"><button type="button" id="pinGo"><span>🔓</span>Aç</button></div>`);
const inp = document.getElementById("pinIn"); setTimeout(() => { try{ inp.focus(); }catch(e){} }, 60);
const tryIt = async () => { if(await pinHash(inp.value) === localStorage.getItem(PIN_KEY)){ sessionStorage.setItem("wm_pin_ok", "1"); sh.style.display = "none"; go(); } else { document.getElementById("pinErr").textContent = "PIN hatalı."; inp.value = ""; } };
document.getElementById("pinGo").onclick = tryIt; inp.onkeydown = (e) => { if(e.key === "Enter") tryIt(); }; }
function renderPinSettings(){ const box = document.getElementById("pinBox"); if(!box) return; const on = pinSet();
box.innerHTML = `<div class="acct-note">${on ? "PIN açık: Uzman girişi ve danışan bilgileri PIN'le korunuyor." : "PIN kapalı. Ortak kullanılan uzman cihazlarında açmanız önerilir."}</div><div class="acct-btns"><button type="button" class="fam-chip${on ? "" : " on"}" id="pinSetBtn">${on ? "PIN'i değiştir" : "PIN belirle"}</button>${on ? `<button type="button" class="fam-chip" id="pinOffBtn">PIN'i kaldır</button>` : ""}</div>`;
document.getElementById("pinSetBtn").onclick = () => expertGate(() => { const sh = whoSheet(`<div class="mola-h">Yeni PIN</div><div class="mola-s">4–6 haneli bir sayı seçin. Unutursanız uygulama verilerini silmeden kaldırılamaz; bir yere not edin.</div><input id="pinA" class="ex-input" type="password" inputmode="numeric" maxlength="6" style="width:100%;margin:6px 0;text-align:center;font-size:22px;letter-spacing:6px" placeholder="PIN"><input id="pinB" class="ex-input" type="password" inputmode="numeric" maxlength="6" style="width:100%;margin:6px 0;text-align:center;font-size:22px;letter-spacing:6px" placeholder="Tekrar"><div class="ex-err" id="pinE"></div><div class="mola-list"><button type="button" id="pinSave"><span>🔒</span>Kaydet</button></div>`);
document.getElementById("pinSave").onclick = async () => { const a = document.getElementById("pinA").value, b = document.getElementById("pinB").value; if(!/^\d{4,6}$/.test(a)) return document.getElementById("pinE").textContent = "PIN 4–6 haneli bir sayı olmalı."; if(a !== b) return document.getElementById("pinE").textContent = "İki PIN aynı değil.";
localStorage.setItem(PIN_KEY, await pinHash(a)); sessionStorage.setItem("wm_pin_ok", "1"); sh.style.display = "none"; showLevelFlash("PIN kaydedildi ✓", "levelup"); renderPinSettings(); }; });
const off = document.getElementById("pinOffBtn"); if(off) off.onclick = () => expertGate(() => { localStorage.removeItem(PIN_KEY); showLevelFlash("PIN kaldırıldı", "levelup"); renderPinSettings(); }); }
function wipeDeviceData(){ const keep = []; for(let i = localStorage.length - 1; i >= 0; i--){ const k = localStorage.key(i); if(k && k.startsWith("wm_")) localStorage.removeItem(k); } try{ sessionStorage.clear(); }catch(e){} }

// ===== HESAP (e-posta) VE BULUT SENKRONU =====
const SYNC_KEYS = ["wm_game_v1","wm_gamex_v1","wm_game_route_v1","wm_game_limit_v1","wm_place_v1","wm_ages_v1","wm_player_levels_v1","wm_last_v1","wm_last_by","wm_who_last","wm_unlock_seen_v1","wm_mola_v1","wm_daily_v1","wm_week_target_v1","wm_family_links_v1","wm_place_v2","wm_place_seen_v1","wm_cat_levels_v1","wm_cat_streak_v1","wm_cat_pending_v1","wm_devhw_v1"] /* KURAL (eşitleme): kişiye ait her kalıcı veri (değerlendirme sonucu, alan düzeyleri, ödev motoru) hesap eşitlemesine dahildir */;
const SYNC_T_KEY = "wm_sync_t";
const syncable = (k) => SYNC_KEYS.includes(k) || k.startsWith("wm_delay_");
function acct(){ const f = window.__fb; return f && f.authApi ? f.authApi : null; }
function acctEmail(){ const a = acct(); return a && !a.isAnon ? a.email : null; }
function syncCollect(){ const d = {}; for(let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); if(syncable(k)) d[k] = localStorage.getItem(k); } return d; }
let syncTimer = null, syncBusy = false, syncApplying = false, syncReady = false;   // hesaptaki veri indirilip karşılaştırılmadan yükleme yok
async function syncUpload(force){ if(!acctEmail() || syncApplying || (!syncReady && !force)) return false; const { db, doc, setDoc } = window.__fb; const t = Date.now();
try{ syncBusy = true; await setDoc(doc(db, "appState", window.__fb.uid), { uid: window.__fb.uid, t, data: JSON.stringify(syncCollect()) }); localStorage.setItem(SYNC_T_KEY, String(t)); return true; }
catch(e){ console.error("Senkron yüklenemedi:", e); return false; } finally{ syncBusy = false; } }
function syncSchedule(){ if(!acctEmail()) return; clearTimeout(syncTimer); syncTimer = setTimeout(syncUpload, 4000); }
async function syncDownload(){ if(!acctEmail()) return "yok"; const { db, doc, getDoc } = window.__fb;
try{ const snap = await getDoc(doc(db, "appState", window.__fb.uid)); const local = Number(localStorage.getItem(SYNC_T_KEY) || 0);
if(!snap.exists()){ syncReady = true; await syncUpload(); return "ilk"; }
const r = snap.data(); if(r.t > local){ const d = JSON.parse(r.data || "{}"); syncApplying = true;
Object.keys(d).forEach(k => { try{ localStorage.setItem(k, d[k]); }catch(e){} }); localStorage.setItem(SYNC_T_KEY, String(r.t)); syncApplying = false; syncReady = true; return "indi"; }
syncReady = true; if(local > r.t) await syncUpload(); return "güncel"; }
catch(e){ console.error("Senkron indirilemedi:", e); return "hata"; } }
{ const _set = Storage.prototype.setItem; Storage.prototype.setItem = function(k, v){ _set.call(this, k, v); try{ if(this === window.localStorage && !syncApplying && syncable(k)) syncSchedule(); }catch(e){} }; }
document.addEventListener("visibilitychange", () => { if(document.visibilityState === "hidden" && syncTimer){ clearTimeout(syncTimer); syncUpload(); } });
window.addEventListener("firebase-ready", async () => { try{ renderAcctSettings(); }catch(e){} if(!acctEmail()) return; const r = await syncDownload();
if(r === "indi" && !sessionStorage.getItem("wm_sync_reloaded")){ sessionStorage.setItem("wm_sync_reloaded", "1"); location.reload(); } });
const AUTH_ERR = { "auth/email-already-in-use":"Bu e-postayla zaten bir hesap var. “Giriş yap”ı kullanın.", "auth/credential-already-in-use":"Bu e-postayla zaten bir hesap var. “Giriş yap”ı kullanın.", "auth/invalid-email":"E-posta adresi geçerli görünmüyor.",
"auth/weak-password":"Şifre en az 6 karakter olmalı.", "auth/wrong-password":"E-posta ya da şifre hatalı.", "auth/invalid-credential":"E-posta ya da şifre hatalı.", "auth/user-not-found":"Bu e-postayla bir hesap bulunamadı.",
"auth/too-many-requests":"Çok fazla deneme yapıldı. Biraz sonra tekrar deneyin.", "auth/network-request-failed":"İnternet bağlantısı yok.", "auth/operation-not-allowed":"E-posta ile giriş Firebase'de henüz açılmamış (Authentication → Sign-in method → Email/Password)." };
const authMsg = (e) => AUTH_ERR[e && e.code] || "İşlem tamamlanamadı. Lütfen tekrar deneyin.";
function renderAcctSettings(){ const box = document.getElementById("acctBox"); if(!box) return; const a = acct(), em = acctEmail(), t = Number(localStorage.getItem(SYNC_T_KEY) || 0);
if(!a){ box.innerHTML = `<div class="acct-note">Bulut bağlantısı yok. İnternete bağlanınca hesap seçenekleri görünür.</div>`; return; }
if(em){ box.innerHTML = `<div class="acct-note"><b>${escHTML(em)}</b> ile giriş yapıldı.${a.verified === false ? `<br><span style="color:#B45309">E-posta adresi henüz doğrulanmadı. Gelen kutunuzdaki bağlantıya dokunun.</span> <button type="button" class="age-link" id="acctVerBtn" style="display:inline;margin:0">Tekrar gönder</button>` : ""}<br>Son eşitleme: ${t ? new Date(t).toLocaleString("tr-TR") : "henüz yok"}</div>
<div class="acct-btns"><button type="button" class="fam-chip" id="acctSyncBtn">Şimdi eşitle</button><button type="button" class="fam-chip" id="acctOutBtn">Çıkış yap</button></div>`;
document.getElementById("acctSyncBtn").onclick = async () => { const ok = await syncUpload(); showLevelFlash(ok ? "Eşitlendi ✓" : "Eşitlenemedi", ok ? "levelup" : "down"); renderAcctSettings(); };
{ const vb = document.getElementById("acctVerBtn"); if(vb) vb.onclick = async () => { const note = document.createElement("div"); note.className = "acct-note"; note.style.marginTop = "6px"; note.textContent = "Gönderiliyor…"; vb.after(note); vb.disabled = true;
try{ await a.verify(); note.innerHTML = "<b>Doğrulama e-postası gönderildi.</b> Gelen kutunuza ve <b>Gereksiz/Spam</b> klasörüne bakın; bağlantıya dokunduktan sonra bu ekrana dönün."; }catch(e){ note.textContent = authMsg(e); vb.disabled = false; } }; }
document.getElementById("acctOutBtn").onclick = () => { const sh = whoSheet(`<div class="mola-h">Çıkış yap</div><div class="mola-s">Hesaptaki veriler bulutta güvende kalır. Bu cihazdaki kayıtlar ne olsun?</div><div class="mola-list"><button type="button" data-out="keep"><span>📱</span>Bu cihazda kalsın<small>kendi cihazınızsa</small></button><button type="button" data-out="wipe"><span>🧹</span>Bu cihazdan silinsin<small>ortak cihazsa önerilir</small></button></div>`);
sh.querySelectorAll("[data-out]").forEach(b => b.onclick = async () => { const wipe = b.dataset.out === "wipe"; if(wipe && !await zaConfirm("Bu cihazdaki kişiler, ilerleme ve ayarlar silinecek. Hesaptaki veriler etkilenmez. Devam edilsin mi?")) return; await syncUpload(true); try{ await a.signOut(); }catch(e){} if(wipe) wipeDeviceData(); location.reload(); }); };
return; }
box.innerHTML = `<div class="acct-note">Şu an ilerleme yalnızca bu cihazda. Bir hesap oluşturursanız kişiler, sonuçlar ve oyun ilerlemesi buluta kaydedilir; başka bir cihazdan aynı hesapla girdiğinizde kaldığınız yerden devam edersiniz.</div>
<div class="acct-btns"><button type="button" class="fam-chip on" id="acctNewBtn">Hesap oluştur</button><button type="button" class="fam-chip" id="acctInBtn">Giriş yap</button></div>`;
document.getElementById("acctNewBtn").onclick = () => acctForm("new"); document.getElementById("acctInBtn").onclick = () => acctForm("in"); }
function acctForm(mode){ const sh = whoSheet(`<div class="mola-h">${mode === "new" ? "Hesap oluştur" : "Giriş yap"}</div>
${mode === "new" ? `<div class="mola-s">Bu cihazdaki kişiler ve ilerleme bu hesaba taşınır.</div>` : `<div class="mola-s">Hesaptaki veriler bu cihaza gelir. Bu cihazda hesaba bağlı olmayan kayıtlar varsa hesaptakiyle değiştirilir.</div>`}
<input id="acEmail" class="ex-input" type="email" autocomplete="email" placeholder="E-posta" style="width:100%;margin:6px 0">
<input id="acPass" class="ex-input" type="password" autocomplete="${mode === "new" ? "new-password" : "current-password"}" placeholder="Şifre (en az 6 karakter)" style="width:100%;margin:6px 0">
${mode === "new" ? `<input id="acPass2" class="ex-input" type="password" autocomplete="new-password" placeholder="Şifre (tekrar)" style="width:100%;margin:6px 0">` : ""}
<div class="ex-err" id="acErr"></div><div class="mola-list"><button type="button" id="acGo"><span>${mode === "new" ? "✨" : "🔑"}</span>${mode === "new" ? "Hesabı oluştur" : "Giriş yap"}</button></div>
${mode === "in" ? `<button type="button" class="age-link" id="acReset">Şifremi unuttum</button>` : ""}`);
const err = (m) => { document.getElementById("acErr").textContent = m; };
document.getElementById("acGo").onclick = async () => { const a = acct(); if(!a) return err("İnternet bağlantısı yok."); const em = document.getElementById("acEmail").value.trim(), pw = document.getElementById("acPass").value;
if(!/^\S+@\S+\.\S+$/.test(em)) return err("E-posta adresi geçerli görünmüyor."); if(pw.length < 6) return err("Şifre en az 6 karakter olmalı.");
if(mode === "new" && pw !== document.getElementById("acPass2").value) return err("Şifreler aynı değil.");
err("Lütfen bekleyin…"); try{ if(mode === "new"){ await a.link(em, pw); try{ if(a.verify) await a.verify(); }catch(e){} syncReady = true; await syncUpload(true); sh.style.display = "none"; showLevelFlash("Hesap oluşturuldu ✓", "levelup"); renderAcctSettings(); }
else { await a.signIn(em, pw); localStorage.setItem(SYNC_T_KEY, "0"); sessionStorage.removeItem("wm_sync_reloaded"); err("Veriler getiriliyor…"); setTimeout(() => location.reload(), 600); } }
catch(e){ console.error(e); err(authMsg(e)); } };
const rs = document.getElementById("acReset"); if(rs) rs.onclick = async () => { const em = document.getElementById("acEmail").value.trim(); if(!/^\S+@\S+\.\S+$/.test(em)) return err("Önce e-posta adresinizi yazın.");
try{ await acct().reset(em); err("Şifre sıfırlama bağlantısı e-postanıza gönderildi."); }catch(e){ err(authMsg(e)); } }; }


// ---- Ayarlar: dört başlık altında, açılır-kapanır bölümler ----
(function settingsSections(){ try{ const inner = document.querySelector("#settingsScreen .settings-inner");
if(inner){ let wrap = null; [...inner.children].forEach(ch => { const isLab = ch.classList.contains("settings-label"), stop = ch.classList.contains("settings-group") || ch.tagName === "DETAILS";
if(isLab){ wrap = document.createElement("div"); wrap.className = "settings-group set-loose"; inner.insertBefore(wrap, ch); wrap.appendChild(ch); } else if(stop){ wrap = null; } else if(wrap){ wrap.appendChild(ch); } }); }
[...document.querySelectorAll("#settingsScreen .set-loose")].forEach(g => { if(g.children.length === 1 && (g.textContent || "").trim() === "Erişilebilirlik"){ const nx = g.nextElementSibling; const lab = nx && nx.querySelector(".settings-label"); if(lab){ lab.insertAdjacentHTML("afterbegin", "<b style=\"display:block;font-size:16px;color:var(--ink);margin-bottom:4px\">Erişilebilirlik</b>"); } g.remove(); } });
const groups = [...document.querySelectorAll("#settingsScreen .settings-group")]; if(!groups.length) return;
/* KURAL (sadelik): Ayarlar'da sık kullanılanlar üstte; az kullanılanlar (uyarlamalı zorluk, uzman girişi ayrıntısı, oyun yedeği) "Gelişmiş" başlığında */
const S = [["smile|#0A847E|#DDF3F0|Çocuk", ["Günlük oyun süresi","Başlangıç değerlendirmesi"]],
["bulb|#9A6B00|#FFF1D6|Ses ve görünüm", ["Ses efektleri","Altyazı","Sade görünüm","Titreşim","Kutlama","Erişilebilirlik","Yazı boyutu"]], ["lock|#5A2D8C|#EEE6FA|Hesap, veri ve cihaz", ["Hesap ve bulut","Bu cihazı kullanan","Kişiler ve veriler","Uzman PIN"]],
["key|#3D4F5F|#EEF2F5|Gelişmiş", ["Uyarlamalı zorluk","Uzman girişinde","Oyun ilerlemesi yedeği"]]];
const lab = (g) => ((g.querySelector(".settings-label") || {}).textContent || "").trim(); const host = groups[0].parentNode, mark = document.createElement("div"); host.insertBefore(mark, groups[0]);
S.forEach(([title, keys], k) => { const d = document.createElement("details"); d.className = "set-sec"; if(k === 0) d.open = true; const [ic, col, bg, ttl] = title.split("|"); d.innerHTML = `<summary><span class="gr-ic" style="background:${bg};color:${col};margin-right:10px">${icI(ic, 18, col)}</span>${ttl}</summary>`;   /* emoji yerine palet renginde çizgi simge */
keys.forEach(key => groups.filter(g => lab(g).startsWith(key)).forEach(g => d.appendChild(g))); if(d.children.length > 1) host.insertBefore(d, mark);
d.addEventListener("toggle", () => { if(d.open) document.querySelectorAll("#settingsScreen details.set-sec[open]").forEach(o => { if(o !== d) o.open = false; }); }); });   /* Ayarlar'da da bir bölüm açılınca diğeri kapanır */
groups.filter(g => lab(g).startsWith("Sorun giderme")).forEach(g => { g.style.display = "none"; });
}catch(e){ console.error(e); } })();
// ===== KİM? ekranı: kişi merkezli giriş (seviye profilde saklı) =====
const EXPERT_DEV_KEY = "wm_expert_device";
let viaWho = true, whoNew = null;
function isExpertDevice(){ try{ return localStorage.getItem(EXPERT_DEV_KEY) === "1"; }catch(e){ return false; } }
/* KURAL (sadelik): ilk açılışta bir kez "Bu cihazı kim kullanacak?" sorulur; ana sayfada yalnızca o rolün düğmeleri görünür (Ayarlar'dan değişir). Rol seçilmemiş eski cihazlarda iki rol de görünür. */
const HOME_ROLE_KEY = "wm_home_role";
function homeRole(){ try{ const r = localStorage.getItem(HOME_ROLE_KEY); return r === "uzman" || r === "aile" ? r : null; }catch(e){ return null; } }
function setHomeRole(r){ try{ localStorage.setItem(HOME_ROLE_KEY, r); localStorage.setItem(EXPERT_DEV_KEY, r === "uzman" ? "1" : "0"); }catch(e){} }
function showRolePick(done){ pauseTour(); let el = document.getElementById("roleScreen"); if(!el){ el = document.createElement("div"); el.id = "roleScreen"; el.className = "consent-screen"; document.body.appendChild(el); }
  el.innerHTML = `<div class="consent-inner" style="text-align:left"><h2 style="text-align:center">Bu cihazı kim kullanacak?</h2><p class="consent-text" style="text-align:center">Ana sayfada yalnızca sizin işinize yarayan düğmeler görünür. Sonra Ayarlar'dan değiştirebilirsiniz.</p>
  <button type="button" class="hm-card role-card" data-role="aile"><span class="hm-ic" style="background:#FFF1D6;color:#9A6B00">${hmIc("home")}</span><span><b>Aile</b><span>Evde çocuğumla çalışacağım</span></span></button>
  <button type="button" class="hm-card role-card" data-role="uzman"><span class="hm-ic" style="background:#DDF3F0;color:#0A847E">${hmIc("brief")}</span><span><b>Uzman</b><span>Öğretmen, terapist ya da psikoloğum; danışanlarıma plan hazırlayacağım</span></span></button></div>`;
  el.style.display = "flex"; el.querySelectorAll("[data-role]").forEach(b => b.onclick = () => { setHomeRole(b.dataset.role); el.style.display = "none"; try{ setEtkinlikView(b.dataset.role); }catch(e){} done && done(); }); }
function whoNames(){ const bad = new Set(["Misafir","Oyuncu","Tarama",""]), set = new Set();
[].concat(playersList || [], Object.keys(playerReadingLevels || {}), Object.keys(gameStoreAll() || {})).forEach(n => { n = String(n || "").trim(); if(!bad.has(n)) set.add(n); });
let T = {}; try{ T = JSON.parse(localStorage.getItem("wm_who_last") || "{}"); }catch(e){}
try{ loadSessions().forEach(r => { const n = (r.player || "").trim(); if(n && (!T[n] || r.t > T[n])) T[n] = r.t; }); }catch(e){}
return [...set].sort((a, b) => (T[b] || 0) - (T[a] || 0) || a.localeCompare(b, "tr")); }
function whoTouch(n){ if(!n || n === "__guest__") return; try{ const T = JSON.parse(localStorage.getItem("wm_who_last") || "{}"); T[n] = Date.now(); localStorage.setItem("wm_who_last", JSON.stringify(T)); }catch(e){} }
function whoStars(n){ const d = (gameStoreAll()[n] || {})[getPlayerLevel(n) || "post"] || {}; return Object.values(d).reduce((s, r) => s + ((r && r.stars) ? r.stars.filter(Boolean).length : 0), 0); }
function whoHue(n){ let h = 0; for(const ch of n) h = (h * 31 + ch.charCodeAt(0)) % 360; return h; }
function whoSelGet(){ try{ const v = localStorage.getItem("wm_who_sel"); if(v !== null) return v; }catch(e){} const L = lastGet(); return L ? L.player : ""; }
function whoSelSet(v){ try{ localStorage.setItem("wm_who_sel", v); }catch(e){} }
function whoAvatar(n){ const keep = currentPlayerName, keepL = readingLevel; try{ currentPlayerName = n || ""; const lv = n ? getPlayerLevel(n) : null; if(lv) readingLevel = lv; return zihniSVG("happy"); }catch(e){ return ""; } finally { currentPlayerName = keep; readingLevel = keepL; } }
function whoSelect(n){ whoSelSet(n); whoTouch(n); showWho(); }
let whoListOpen = false;
function showWho(openList){ ZA_LIFE.leave();  viaWho = true; try{ const ov = document.getElementById("tourOverlay"); if(ov && getComputedStyle(ov).display !== "none") endTour(); }catch(e){}
["modeScreen","readingLevelScreen","childLevelScreen","categoryScreen","mainApp","returnSplashScreen","familyHome"].forEach(id => { const e = document.getElementById(id); if(e) e.style.display = "none"; });
try{ hideGameScreens(); exitGameMode(); hideFamScreens(); hideLinkScreens(); }catch(e){}
if(typeof openList === "boolean") whoListOpen = openList;
let el = document.getElementById("whoScreen"); if(!el){ el = document.createElement("div"); el.id = "whoScreen"; document.body.appendChild(el); }
const names = whoNames(), sel = whoSelGet(), guest = sel === "__guest__", cur = guest ? "" : (names.includes(sel) ? sel : ""), view = getEtkinlikView(), L = cur ? lastFor(cur) : null;
const sub = (n) => { const a = ageOf(n), lv = getPlayerLevel(n), st = whoStars(n); return [a ? (a >= 12 ? "12+ yaş" : `${a} yaş`) : "", (() => { const P = placeGet(n); if(P && P.dom){ const v = Object.values(P.dom), post = v.filter(x => x >= 3).length; return post === v.length ? "Değerlendirme: Okul Sonrası" : post === 0 ? "Değerlendirme: Okul Öncesi" : `Değerlendirme: ${post} alan Okul Sonrası`; } return lv ? (lv === "pre" ? "Okul Öncesi" : "Okul Sonrası") : "okul dönemi seçilmedi"; })(), st ? `${(typeof EMO_MAP !== "undefined" && EMO_MAP["⭐"]) ? EMO_MAP["⭐"]() : "★"} ${st}` : ""].filter(Boolean).join(" · ");   /* emoji yerine uygulamanın yıldızı */ };
const row = (n, i) => `<div class="hm-row${n === cur ? " on" : ""}" data-hsel="${escHTML(n)}"><span class="hm-av" style="background:hsl(${whoHue(n)},70%,88%)">${whoAvatar(n)}</span><div class="hm-tx"><b>${escHTML(n)}</b><span>${sub(n)}</span></div>${n === cur ? `<i class="hm-ck">✓</i>` : ""}<button type="button" class="hm-gear" data-hgear="${escHTML(n)}" aria-label="Okul dönemi ve yaş"><svg viewBox="0 0 24 24" width="1.15em" height="1.15em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button></div>`;
el.innerHTML = `<div class="hm-wrap ha-wrap">
<div class="ha-top"><div><div class="ha-app">Zihin Atölyesi</div><div class="ha-hi">Merhaba!</div></div><button type="button" class="hm-set" id="hmSet" aria-label="Ayarlar"><svg viewBox="0 0 24 24" width="1.15em" height="1.15em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button></div>
<!-- KURAL (ana sayfa · B, 2026-11-05): "Merhaba!" altında kişi satırı (seçili kişi, okul dönemi, Değiştir, + Kişi ekle) --><div class="ha-person" id="hmPerson">${cur ? avatarHTML(cur, 40) : '<span class="hp-av0">?</span>'}<span class="hp-nm"><b>${cur ? escHTML(cur) : "Kişi seçilmedi"}</b><small>${cur ? ((getPlayerLevel(cur) || "post") === "pre" ? "Okul Öncesi" : "Okul Sonrası") : "Çalışacak kişiyi seçin"}</small></span>${names.length ? '<button type="button" class="hp-ch" id="hmPersonChange">Değiştir ▾</button>' : ""}<button type="button" class="hp-add" id="hmPersonAdd">+ Kişi ekle</button></div>
<!-- KURAL (ana sayfa tasarımı · A): selamlama başlığı; turkuaz Bilişsel Etkinlik kartında tam genişlik iki düğme; şeftali Bilişsel Oyun kartında Zihni ve Oyna; altta ünlemli mod notu -->
<div class="ha-card ha-etk" id="hmEtk" role="group" aria-label="Bilişsel Etkinlik"><div class="ha-grid"><button type="button" class="ha-big" id="hmEtkBtn" data-hview="${homeRole() === "uzman" ? "uzman" : "aile"}"><span class="ha-bic">${hmIc("users")}</span><span class="ha-bbt"><b>Bilişsel Etkinlik</b><small>Alanlar ve etkinlikler</small></span><i aria-hidden="true">›</i></button>
${homeRole() === "aile" ? `<button type="button" class="ha-b ha-b1" id="hmToday">${hmIc("home")}<span class="ha-bt">Bugünün etkinlikleri</span><i aria-hidden="true">›</i></button><button type="button" class="ha-b ha-b2" id="hmHw"><span style="position:relative;display:inline-flex">${hmIc("clip")}${cur ? hwBadgeHtml(hwBadgeCount(cur, getPlayerLevel(cur) || "post"), true) : ""}</span><span class="ha-bt">Ödevlerim</span><i aria-hidden="true">›</i></button>`
 : homeRole() === "uzman" ? `<button type="button" class="ha-b ha-b1" data-hview="uzman">${hmIc("brief")}<span class="ha-bt">Uzman sayfası</span><i aria-hidden="true">›</i></button><button type="button" class="ha-b ha-b2" id="hmClients">${hmIc("users")}<span class="ha-bt">Danışanlar</span><i aria-hidden="true">›</i></button>`
 : `<button type="button" class="ha-b ha-b1" data-hview="aile">${hmIc("home")}<span class="ha-bt">Aile</span><i aria-hidden="true">›</i></button><button type="button" class="ha-b ha-b2" data-hview="uzman">${hmIc("brief")}<span class="ha-bt">Uzman</span><i aria-hidden="true">›</i></button>`}</div>
</div>
<div class="ha-card ha-game" id="hmGame" role="button" tabindex="0" aria-label="Bilişsel Oyun, Zihin Adaları"><div class="ha-gt"><b>Bilişsel Oyun</b><span>Zihin Adaları · eğlenerek gelişelim</span><span class="ha-play"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>Oyna</span></div><span class="ha-z">${zihniSVG("cheer")}</span></div>
${homeRole() ? `<div class="hm-mode-note" id="hmModeNote" role="note"><span class="hm-bang" aria-hidden="true">!</span><span class="hm-mn-tx">Şu an <b>${homeRole() === "uzman" ? "Uzman" : "Aile"}</b> modundasınız.</span><button type="button" class="hm-mn-btn" id="hmModeSwitch">${homeRole() === "uzman" ? "Aile" : "Uzman"} moduna geç</button></div>` : ""} </div>`;
el.style.display = "flex"; try{ scheduleTour("home", "whoScreen"); }catch(e){}
const $ = (id) => document.getElementById(id);
$("hmSet").onclick = () => { try{ openSettings(); }catch(e){} }; /* KURAL (ana sayfa · B, 2026-11-05): kişi satırından kişi değiştirilir ve eklenir; seçim kalıcıdır */ if($("hmPersonChange")) $("hmPersonChange").onclick = (ev) => { ev.stopPropagation(); zaHomePick(cur, (nm) => { try{ whoSelSet(nm); whoTouch(nm); }catch(e){} currentPlayerName = nm; showWho(); }); }; if($("hmPersonAdd")) $("hmPersonAdd").onclick = (ev) => { ev.stopPropagation(); whoAdd((n) => { if(!n) return; try{ whoSelSet(n); whoTouch(n); }catch(e){} currentPlayerName = n; showWho(); }); };
if($("hmHead")) $("hmHead").onclick = () => { whoListOpen = !whoListOpen; showWho(); };
el.querySelectorAll("[data-hsel]").forEach(r => r.onclick = (ev) => { if(ev.target.closest("[data-hgear]")) return; whoListOpen = false; whoSelect(r.dataset.hsel); });
el.querySelectorAll("[data-hgear]").forEach(b => b.onclick = (ev) => { ev.stopPropagation(); whoLevel(b.dataset.hgear, () => showWho()); });
if($("hmAdd")) $("hmAdd").onclick = whoAdd;
if($("hmGuest")) $("hmGuest").onclick = () => { whoListOpen = false; whoSelect("__guest__"); };
if($("hmResume")) $("hmResume").onclick = () => { const go = () => { whoSelSet(L.player); whoTouch(L.player); document.getElementById("whoScreen").style.display = "none"; resumeLast(L); }; if(L.mode === "uzman") expertGate(go); else go(); };
el.querySelectorAll("[data-hview]").forEach(b => b.onclick = (ev) => { ev.stopPropagation(); const v = b.dataset.hview; try{ setEtkinlikView(v); }catch(e){} if(v === "uzman") expertGate(() => { if(!homeRole()) setHomeRole("uzman"); need("uzman"); }); else { if(!homeRole()) setHomeRole("aile"); need("aile"); } });
  if($("hmToday")) $("hmToday").onclick = (ev) => { ev.stopPropagation(); withPerson((n) => { try{ whoTouch(n); }catch(e){} currentPlayerName = n; readingLevel = getPlayerLevel(n) || "post"; try{ applyLevelDefaultThresholds(readingLevel); }catch(e){} try{ exitGameMode(); }catch(e){} setEtkinlikView("aile"); appMode = "aile"; viaWho = true; el.style.display = "none"; try{ showToday(); }catch(e){ console.error(e); } }); };   /* KURAL (ana ekran): "Bugünün etkinlikleri" düğmesi Aile sayfası arada görünmeden doğrudan Bugün ekranını açar */
  if($("hmModeSwitch")) $("hmModeSwitch").onclick = async (ev) => { ev.stopPropagation(); const to = homeRole() === "uzman" ? "aile" : "uzman"; const ok = await zaConfirm(`${to === "uzman" ? "Uzman" : "Aile"} moduna geçilecek. Emin misiniz?`); if(!ok) return; const go = () => { setHomeRole(to); try{ setEtkinlikView(to); }catch(e){} showWho(); showToast(`${to === "uzman" ? "Uzman" : "Aile"} moduna geçildi`); }; if(to === "uzman") expertGate(go); else go(); };   /* KURAL: mod geçişi ana sayfanın altındaki ünlemli nottan, onay sorularak yapılır */
const withPerson = (fn) => { if(cur && !guest) return fn(cur); if(names.length) return zaHomePick(cur, (n) => { if(!n || n === "Misafir") return; try{ whoSelSet(n); whoTouch(n); }catch(e){} fn(n); }); whoAdd((n) => fn(n)); };   /* KURAL: kişi yoksa listeden seçilir ya da yaşıyla eklenir */
  if($("hmHw")) $("hmHw").onclick = (ev) => { ev.stopPropagation(); if(guest || !cur){ return withPerson(() => { showWho(); setTimeout(() => { const b = document.getElementById("hmHw"); if(b) b.click(); }, 60); }); } try{ whoTouch(cur); }catch(e){} currentPlayerName = cur; readingLevel = getPlayerLevel(cur) || "post"; try{ applyLevelDefaultThresholds(readingLevel); }catch(e){} setEtkinlikView("aile"); appMode = "aile"; viaWho = true; el.style.display = "none"; hwFrom = "home"; try{ showHwScreen(); }catch(e){ console.error(e); } };   /* Ödevlerim: doğrudan, Aile sayfası arada görünmeden */
if($("hmClients")) $("hmClients").onclick = (ev) => { ev.stopPropagation(); expertGate(() => { el.style.display = "none"; appMode = "uzman"; window.__exFromHome = true; try{ showExpert("list"); }catch(e){} }); };
const need = (mode) => { if(guest) return whoGuestEnter(mode); withPerson((n) => whoEnter(n, mode)); };
$("hmEtk").onclick = () => { if(getEtkinlikView() === "uzman") expertGate(() => need("uzman")); else need("aile"); };
$("hmGame").onclick = () => need("cocuk"); }
function whoGuestEnter(mode){ const sh = whoSheet(`<div class="mola-h">Misafir</div><div class="mola-s">Hangi okul döneminde?</div><div class="mola-list"><button type="button" data-gl="pre"><span>🧸</span>Okul Öncesi</button><button type="button" data-gl="post"><span>🎒</span>Okul Sonrası</button></div>`);
sh.querySelectorAll("[data-gl]").forEach(b => b.onclick = () => { sh.style.display = "none"; const lv = b.dataset.gl; document.getElementById("whoScreen").style.display = "none"; readingLevel = lv; try{ applyLevelDefaultThresholds(lv); }catch(e){}
if(mode === "cocuk"){ appMode = "cocuk"; currentPlayerName = ""; showIslandMap(); } else { try{ exitGameMode(); hideFamScreens(); setEtkinlikView(mode); }catch(e){} appMode = mode; pendingLevelPlayerName = ""; pendingLevelPlayerIsNew = false; chooseReadingLevel(lv); } }); }

const AGE_KEY = "wm_ages_v1";   // yalnızca bu cihazda: { ad: doğum yılı (yaklaşık) }
function agesAll(){ try{ return JSON.parse(localStorage.getItem(AGE_KEY) || "{}"); }catch(e){ return {}; } }
function ageOf(n){ const y = agesAll()[n]; return y ? new Date().getFullYear() - y : null; }
function ageSet(n, age){ const d = agesAll(); d[n] = new Date().getFullYear() - age; try{ localStorage.setItem(AGE_KEY, JSON.stringify(d)); }catch(e){} }
const levelForAge = (a) => a <= 6 ? "pre" : "post";
function ageChips(attr){ return `<div class="age-chips">${[3,4,5,6,7,8,9,10,11,12].map(a => `<button type="button" ${attr}="${a}">${a === 12 ? "12+" : a}</button>`).join("")}</div>`; }
/* KURAL (klavye): ekran klavyesi açıkken pencereler görünen alana sığar ve kaydırılabilir; onay/seçim düğmeleri klavyenin altında kalmaz. Klavyedeki "Bitti/Enter" klavyeyi kapatır. (iPad yatay ekranda Kişi ekle onaylanamıyordu) */
(function keyboardFit(){ try{ const vv = window.visualViewport; const root = document.documentElement; const upd = () => { const h = vv ? vv.height : innerHeight, top = vv ? vv.offsetTop : 0; root.style.setProperty("--vvh", Math.round(h) + "px"); root.style.setProperty("--vvtop", Math.round(top) + "px"); root.classList.toggle("kb-open", !!vv && innerHeight - h > 120); };
  if(vv){ vv.addEventListener("resize", upd); vv.addEventListener("scroll", upd); } addEventListener("resize", upd); upd();
  const TXT = 'input:not([type]), input[type="text"], input[type="email"], input[type="password"], input[type="tel"], input[type="number"], input[type="search"], textarea';
  document.addEventListener("focusin", (e) => { const el = e.target; if(!el || !el.matches || !el.matches(TXT)) return; if(!el.getAttribute("enterkeyhint")) el.setAttribute("enterkeyhint", "done"); setTimeout(() => { try{ el.scrollIntoView({ block: "center", behavior: "smooth" }); }catch(_){} }, 350); });
  document.addEventListener("keydown", (e) => { const el = e.target; if(e.key !== "Enter" || !el || !el.matches || !el.matches(TXT) || el.tagName === "TEXTAREA") return;
    const box = el.closest(".mola-card, .zd-card, .settings-inner, .isl-wrap, .fam-screen, #linkScreen, #expertScreen, .ls-bar, #mainApp, body"); const fields = box ? [...box.querySelectorAll(TXT)].filter(x => x.offsetParent && !x.disabled) : []; const i = fields.indexOf(el);
    if(i >= 0 && i < fields.length - 1){ e.preventDefault(); fields[i + 1].focus(); return; }   /* çok alanlı formda sonraki alana geç */
    setTimeout(() => { try{ el.blur(); }catch(_){} const next = box && box.querySelector("[data-wna], .mola-list button, .zd-yes, .save-result-btn, button.primary"); if(next) setTimeout(() => { try{ next.scrollIntoView({ block: "nearest", behavior: "smooth" }); }catch(_){} }, 250); }, 0);   /* son alanda Enter: klavye kapanır, onay düğmesi görünür */
  });
}catch(e){} })();
function whoSheet(html){ pauseTour(); html = String(html).replace(/<span>📱<\/span>/g, `<span class="ws-ic">${hmIc("phone")}</span>`).replace(/<span>🧹<\/span>/g, `<span class="ws-ic">${hmIc("trash")}</span>`).replace(/<span>🔒<\/span>/g, `<span class="ws-ic">${hmIc("lock")}</span>`).replace(/<span>🔓<\/span>/g, `<span class="ws-ic">${hmIc("unlock")}</span>`).replace(/<span>🧸<\/span>/g, `<span class="ws-ic">${hmIc("blocks")}</span>`).replace(/<span>🎒<\/span>/g, `<span class="ws-ic">${hmIc("book")}</span>`).replace(/<span>🏝️<\/span>/g, `<span class="ws-ic">${hmIc("island")}</span>`).replace(/<span>🔑<\/span>/g, `<span class="ws-ic">${hmIc("key")}</span>`).replace(/<span>✨<\/span>/g, `<span class="ws-ic">${hmIc("star")}</span>`);   /* emoji yerine çizgi simge */ let sh = document.getElementById("whoSheet"); if(!sh){ sh = document.createElement("div"); sh.id = "whoSheet"; document.body.appendChild(sh); } sh.innerHTML = `<div class="mola-card" style="position:relative"><button type="button" class="sheet-x" aria-label="Kapat">✕</button>${html}</div>`; sh.querySelector(".sheet-x").onclick = () => { sh.style.display = "none"; }; sh.style.display = "flex"; sh.onclick = (e) => { if(e.target === sh) sh.style.display = "none"; }; return sh; }
function whoLevel(n, then, manual){ const a = ageOf(n);
const sh = whoSheet(manual ? `<div class="mola-h">${escHTML(n)}</div><div class="mola-s">Hangi okul döneminde çalışsın?</div><div class="mola-list"><button type="button" data-wl="pre"><span>🧸</span>Okul Öncesi</button><button type="button" data-wl="post"><span>🎒</span>Okul Sonrası</button></div><button type="button" class="age-link" data-wage="1">Yaşa göre seçilsin</button>`
: `<div class="mola-h">${escHTML(n)}</div><div class="mola-s">Kaç yaşında?${a ? ` (şu an ${a})` : ""}</div>${ageChips("data-wa")}<button type="button" class="age-link" data-wman="1">Okul dönemini kendim seçeceğim</button>`);
sh.querySelectorAll("[data-wl]").forEach(b => b.onclick = () => { rememberPlayerLevel(n, b.dataset.wl); sh.style.display = "none"; then && then(); });
sh.querySelectorAll("[data-wa]").forEach(b => b.onclick = () => { const v = Number(b.dataset.wa); ageSet(n, v); rememberPlayerLevel(n, levelForAge(v)); sh.style.display = "none"; then && then(); });
const m = sh.querySelector("[data-wman]"); if(m) m.onclick = () => whoLevel(n, then, true);
const g = sh.querySelector("[data-wage]"); if(g) g.onclick = () => whoLevel(n, then, false); }
function whoAdd(after){ const sh = whoSheet(`<div class="mola-h">Kişi ekle</div><input id="whoName" class="ex-input" placeholder="Adı" maxlength="40" enterkeyhint="done" autocomplete="off" style="width:100%;margin:8px 0"><div class="mola-s">Kaç yaşında?</div>${ageChips("data-wna")}<button type="button" class="age-link" data-wnman="1">Okul dönemini kendim seçeceğim</button><div class="mola-list" id="whoManual" style="display:none"><button type="button" data-wnl="pre"><span>🧸</span>Okul Öncesi</button><button type="button" data-wnl="post"><span>🎒</span>Okul Sonrası</button></div><div class="ex-err" id="whoErr"></div>`);
sh.querySelector("[data-wnman]").onclick = () => { document.getElementById("whoManual").style.display = ""; };
setTimeout(() => { try{ document.getElementById("whoName").focus(); }catch(e){} }, 50);
sh.querySelectorAll("[data-wnl], [data-wna]").forEach(b => b.onclick = () => { const n = cleanPersonName(document.getElementById("whoName").value); if(!n){ document.getElementById("whoErr").textContent = "Önce adı yazın."; return; }
if(b.dataset.wna){ const v = Number(b.dataset.wna); ageSet(n, v); b.dataset.wnl = levelForAge(v); }
if(!playersList.includes(n)){ if(firestoreReady && window.__fb){ const { db, collection, addDoc } = window.__fb; addDoc(collection(db, "players"), withUid({ name: n, createdAt: Date.now() })).catch(e => console.error(e)); playersList.push(n); } else { playersList.push(n); try{ queuePendingWrite("players", { name: n, createdAt: Date.now() }); }catch(e){} } try{ renderPlayerOptions(); }catch(e){} }
rememberPlayerLevel(n, b.dataset.wnl); whoNew = null; sh.style.display = "none"; whoListOpen = false; if(typeof after === "function"){ try{ renderPlayerOptions(); }catch(e){} after(n); setTimeout(() => { try{ if(!placeGet(n)) placeOffer(n); }catch(e){} }, 600); return; } whoSelect(n);
readingLevel = b.dataset.wnl; try{ applyLevelDefaultThresholds(readingLevel); }catch(e){} setTimeout(() => { try{ if(!placeGet(n)) placeStart(n); }catch(e){} }, 250); }); }
function whoPick(n){ const lv = getPlayerLevel(n); if(!lv) return whoLevel(n, () => whoPick(n));
const sh = whoSheet(`<div style="width:70px;height:70px;margin:0 auto">${zihniSVG("happy")}</div><div class="mola-h">${escHTML(n)}</div><div class="mola-s">Ne yapalım?</div><div class="mola-list"><button type="button" data-wgo="cocuk"><span>🏝️</span>Zihin Adaları<small>tek başına oyna</small></button><button type="button" data-wgo="aile"><span>👩‍👧</span>Birlikte çalışalım<small>yetişkinle etkinlik</small></button></div>`);
sh.querySelectorAll("[data-wgo]").forEach(b => b.onclick = () => { sh.style.display = "none"; whoEnter(n, b.dataset.wgo); }); }
function whoEnter(n, mode){ whoTouch(n); const lv = getPlayerLevel(n) || "post"; document.getElementById("whoScreen").style.display = "none"; viaWho = true;
readingLevel = lv; try{ applyLevelDefaultThresholds(lv); }catch(e){}
if(mode === "cocuk"){ appMode = "cocuk"; currentPlayerName = n; showIslandMap(); }
else { const vw = mode === "uzman" ? "uzman" : "aile"; try{ exitGameMode(); exitSessionMode(); exitRecMode(); hideFamScreens(); hideLinkScreens(); setEtkinlikView(vw); }catch(e){} appMode = vw; pendingLevelPlayerName = n; pendingLevelPlayerIsNew = false; chooseReadingLevel(lv); }
if(whoNew === n){ whoNew = null; setTimeout(() => { try{ if(!placeGet(n)) placeOffer(n); }catch(e){} }, 700); } }


if(localStorage.getItem(SEEN_ONBOARDING_KEY) === "true" && localStorage.getItem(CONSENT_KEY) === "true"){
onboardEntryScreen = "returnSplashScreen"; setTimeout(() => showWho(), 0);
} else if(localStorage.getItem(SEEN_ONBOARDING_KEY) === "true"){
onboardEntryScreen = "returnSplashScreen";
document.getElementById("returnSplashScreen").style.display = "flex";
} else {
onboardEntryScreen = "onboardScreen";
document.getElementById("onboardScreen").style.display = "flex";
}

document.getElementById("onboardNextBtn").addEventListener("click", ()=>{
if(onboardStep < ONBOARD_SLIDES - 1){
showOnboardStep(onboardStep + 1);
} else {
proceedAfterOnboarding();
}
});

document.getElementById("consentCheckbox").addEventListener("change", (e)=>{
document.getElementById("consentAcceptBtn").disabled = !e.target.checked;
});

document.getElementById("consentAcceptBtn").addEventListener("click", ()=>{
if(!document.getElementById("consentCheckbox").checked) return;
modeScreenBackTarget = "consentScreen";
try{ localStorage.setItem(CONSENT_KEY, "true"); }catch(e){}
if(firestoreReady && window.__fb){
const { db, collection, addDoc, uid } = window.__fb;
addDoc(collection(db, "consents"), { uid: uid || "bilinmiyor", acceptedAt: Date.now() })
.catch(e=> console.error("Onay kaydedilemedi:", e));
}
document.getElementById("consentScreen").style.display = "none";
const __afterRole = () => { showWho(); try{ if(!whoNames().length) setTimeout(() => whoAdd(), 300); }catch(e){} };   /* ilk kişi: "Kişi ekle" doğrudan açılır */
if(!homeRole()) showRolePick(__afterRole); else __afterRole();
});

showOnboardStep(0);

document.querySelectorAll(".mode-card[data-mode]").forEach(card=>{
card.addEventListener("click", ()=>{
startApp(card.dataset.mode);   // "etkinlik" seçilen görünüme (uzman / aile) çevrilir
});
});
document.querySelectorAll(".mode-card[data-level]").forEach(card=>{
card.addEventListener("click", ()=>{
chooseReadingLevel(card.dataset.level);
});
});

document.getElementById("levelPlayerSelect").addEventListener("change", (e)=>{
const val = e.target.value;
const newRow = document.getElementById("levelNewPlayerRow");
if(val === "__new__"){
newRow.style.display = "flex";
document.getElementById("levelNewPlayerInput").focus();
pendingLevelPlayerName = null;
pendingLevelPlayerIsNew = false;
} else {
newRow.style.display = "none";
pendingLevelPlayerName = val || null;
pendingLevelPlayerIsNew = false;
}
updateLevelPlayerStatus();
});

document.getElementById("levelAddPlayerBtn").addEventListener("click", ()=>{
const input = document.getElementById("levelNewPlayerInput");
const name = cleanPersonName(input.value);
if(!name) return;
pendingLevelPlayerName = name;
pendingLevelPlayerIsNew = true;
document.getElementById("levelNewPlayerRow").style.display = "none";
input.value = "";
updateLevelPlayerStatus();
});

document.getElementById("modeSwitchBtn").addEventListener("click", ()=>{   /* çalışma sayfasında Uzman/Aile → o görünümün kendi sayfası */
resetTimer(); try{ exitSessionMode(); exitRecMode(); }catch(e){}
document.getElementById("mainApp").style.display = "none";
categoryBackTarget = "readingLevelScreen";
renderCategoryList();
document.getElementById("categoryScreen").style.display = "block";
try{ window.scrollTo(0, 0); }catch(e){}
});

document.getElementById("onboardIcon0").innerHTML = `<div class="logo-zihni">${zihniSVG("wave")}</div>`;
document.getElementById("onboardIcon1").innerHTML = uiIconSVG("bulb");
document.getElementById("settingsIconSlot").innerHTML = uiIconSVG("gear");
document.getElementById("consentIconSlot").innerHTML = uiIconSVG("shield");
document.getElementById("cloudBadgeIcon").innerHTML = uiIconSVG("cloud-off");
document.getElementById("reshuffleIconSlot").innerHTML = uiIconSVG("shuffle");

document.getElementById("tabReportIconSlot").innerHTML = uiIconSVG("calendar");
document.getElementById("tabSummaryIconSlot").innerHTML = uiIconSVG("grid");
document.getElementById("exportCsvIconSlot").innerHTML = uiIconSVG("arrow-down");

document.getElementById("categorySwitchBtn").addEventListener("click", ()=>{
openCategoryScreen();
});

document.getElementById("lsToggleBtn").addEventListener("click", ()=>{
setLsOpen(!document.documentElement.classList.contains("ls-open"));
});
(function(){
const relayout = ()=>{ try{ applyBoardLayout(); }catch(e){} };
const onMQ = ()=>{ if(!landscapeMQ.matches) setLsOpen(false); relayout(); };
if(landscapeMQ.addEventListener) landscapeMQ.addEventListener("change", onMQ);
else if(landscapeMQ.addListener) landscapeMQ.addListener(onMQ);
window.addEventListener("resize", relayout);
if("ResizeObserver" in window){
new ResizeObserver(relayout).observe(document.getElementById("board"));
}
})();

(function(){
["gesturestart", "gesturechange", "gestureend"].forEach(t=>{
document.addEventListener(t, e=> e.preventDefault(), {passive:false});
});
const FREE_SCROLL = ".exercise-row, input[type='range'], select, textarea";
const LS_SCROLL = "#lsMore, .settings-screen, .category-screen, .mode-screen, .onboard-screen, .consent-screen";
const INTERACTIVE = "button, a, input, select, textarea, label";
let sx = 0, sy = 0, startedOnInteractive = false, axis = null, freeScroll = false;
document.addEventListener("touchstart", e=>{
if(e.touches.length === 1){
sx = e.touches[0].clientX; sy = e.touches[0].clientY; axis = null;
const t = e.target instanceof Element ? e.target : null;
startedOnInteractive = !!(t && t.closest(INTERACTIVE));
freeScroll = !!(t && t.closest(FREE_SCROLL));
}
}, {passive:true});
document.addEventListener("touchmove", e=>{
if(e.touches.length > 1){ e.preventDefault(); return; }
if(freeScroll) return;
if(axis === null){
const dx = Math.abs(e.touches[0].clientX - sx), dy = Math.abs(e.touches[0].clientY - sy);
if(dx < 6 && dy < 6) return;
axis = dx > dy * 1.2 ? "x" : "y";
}
if(axis === "x"){ if(!startedOnInteractive) e.preventDefault(); return; }
if(landscapeMQ.matches){ const t = e.target; if(t instanceof Element && !t.closest(LS_SCROLL)) e.preventDefault(); }
}, {passive:false});
})();

(function(){
const box = document.getElementById("diagBox");
const btn = document.getElementById("diagToggleBtn");
let timer = null;
function text(){
const de = document.documentElement, vv = window.visualViewport;
const lines = [];
lines.push(`inner ${innerWidth}x${innerHeight}  client ${de.clientWidth}x${de.clientHeight}`);
lines.push(`scroll ${de.scrollWidth}x${de.scrollHeight}  konum ${Math.round(scrollX)},${Math.round(scrollY)}`);
if(vv) lines.push(`vv ${vv.width.toFixed(1)}x${vv.height.toFixed(1)}  olcek ${vv.scale.toFixed(3)}  kayma ${vv.offsetLeft.toFixed(1)},${vv.offsetTop.toFixed(1)}`);
lines.push(`yon ${landscapeMQ.matches ? "yatay-kisa" : "diger"}  dpr ${devicePixelRatio}`);
const wide = [];
document.querySelectorAll("body *").forEach(el=>{
if(wide.length >= 4 || el.id === "diagBox") return;
const cs = getComputedStyle(el);
if(cs.display === "none" || cs.position === "fixed") return;
if(el.closest(".exercise-row")) return;
const r = el.getBoundingClientRect();
if(r.width === 0) return;
if(r.right > de.clientWidth + 1) wide.push(el.tagName.toLowerCase() + "." + String(el.className).split(" ")[0] + " " + Math.round(r.right));
});
if(wide.length) lines.push("tasan: " + wide.join(" | "));
return lines.join("\n");
}
function refresh(){ box.textContent = text(); }
function setOn(on){
box.style.display = on ? "block" : "none";
btn.textContent = on ? "Ekran tanısını kapat" : "Ekran tanısını aç";
if(timer){ clearInterval(timer); timer = null; }
if(on){ refresh(); timer = setInterval(refresh, 700); }
}
btn.addEventListener("click", ()=> setOn(box.style.display !== "block"));
})();

function openSettings(){
renderPersonDataList();
try{ renderAcctSettings(); }catch(e){ console.error(e); } try{ renderPlaceSettings(); }catch(e){} try{ renderPinSettings(); }catch(e){}
try{ const a = acct(); if(a && !a.isAnon && a.verified === false && a.refresh) a.refresh().then(() => { if(a.verified) try{ renderAcctSettings(); }catch(e){} }).catch(() => {}); }catch(e){}
document.getElementById("settingsScreen").style.display = "block";
}
function closeSettings(){
document.getElementById("settingsScreen").style.display = "none";
}

document.getElementById("settingsBtn").addEventListener("click", openSettings);
document.getElementById("closeSettingsBtn").addEventListener("click", closeSettings);
document.getElementById("closeSettingsBtn2").addEventListener("click", closeSettings);

document.getElementById("soundToggle").addEventListener("change", (e)=>{
soundEnabled = e.target.checked;
});

document.getElementById("confettiToggle").addEventListener("change", (e)=>{
confettiEnabled = e.target.checked;
});

document.getElementById("hapticToggle").addEventListener("change", (e)=>{
hapticEnabled = e.target.checked;
});

document.getElementById("expertAdaptiveToggle").addEventListener("change", (e)=>{
expertAdaptiveEnabled = e.target.checked;
});

document.getElementById("successThresholdInput").addEventListener("input", (e)=>{
SUCCESS_SEC_PER_ITEM = parseFloat(e.target.value);
document.getElementById("successThresholdValue").textContent = SUCCESS_SEC_PER_ITEM.toFixed(1) + " sn";
});

document.getElementById("failThresholdInput").addEventListener("input", (e)=>{
FAIL_SEC_PER_ITEM = parseFloat(e.target.value);
document.getElementById("failThresholdValue").textContent = FAIL_SEC_PER_ITEM.toFixed(1) + " sn";
});

/* Soru-cevap: aynı doğru cevap art arda en çok 2 kez (oluşturucu sarılır; ısınma da aynı yoldan geçer) */
try{ QZ_NORUN.forEach(id => { const f = NEW_MT.build[id]; if(typeof f !== "function") return; NEW_MT.build[id] = function(){ const T = f.apply(this, arguments); try{ if(Array.isArray(T) && T.length && T[0] && T[0].opts){ const R = limitRuns(T, qzAnsKey, 2); T.splice(0, T.length, ...R); } }catch(e){} return T; }; }); }catch(e){}

/* ===== Ödevlerim (aile) ===== */
/* Uzman ödev verdiğinde/kaldırdığında tarih damgası: hwLog = [{ id, at, end? }] */
function hwStamp(p){ if(!p) return; const now = Date.now(); p.hwLog = Array.isArray(p.hwLog) ? p.hwLog : []; const active = (id) => p.hwLog.find(e => e.id === id && !e.end);
  (p.hw || []).forEach(id => { if(!active(id)) p.hwLog.push({ id, at: now }); });
  p.hwLog.forEach(e => { if(!e.end && !(p.hw || []).includes(e.id)) e.end = now; });
  if(p.hwLog.length > 80) p.hwLog = p.hwLog.slice(-80); }
function hwEntries(prog){ if(!prog) return []; const log = Array.isArray(prog.hwLog) ? prog.hwLog.slice() : []; (prog.hw || []).forEach(id => { if(!log.some(e => e.id === id && !e.end)) log.push({ id, at: prog.updatedAt || Date.now(), noDate: !prog.updatedAt }); }); return log.filter(e => exerciseById(e.id)); }
function hwStatus(e, player){ const ex = exerciseById(e.id); const nm = (player || "").trim().toLocaleLowerCase("tr"); const labels = [ex.label].concat(ex.oldLabels || []);
  const recs = perfRecords().filter(r => (r.player || "").trim().toLocaleLowerCase("tr") === nm && (labels.includes(r.exerciseLabel) || r.exId === e.id) && r.t >= e.at && (!e.end || r.t <= e.end)).sort((a, b) => b.t - a.t);
  if(!recs.length) return { k:"none", n:0 }; const er = recs[0].errors || 0; return { k: er <= 1 ? "ok" : er === 2 ? "mid" : "hard", n: recs.length, last: recs[0].t, err: er }; }
const HW_ST = { none:["Henüz yapılmadı","#EEF2F6","#5B6B7A"], ok:["Başarılı ✓","#E3F6EA","#1B7A3D"], mid:["Gelişiyor","#FFF6D6","#8A6400"], hard:["Tekrar edelim","#FDEBDD","#A9632A"] };
function showHwScreen(){ try{ hideFamScreens(); hideLinkScreens(); hwScreenOpen = true; if(hwRun) hwRunEnd(); ["categoryScreen","familyHome","mainApp","readingLevelScreen","returnSplashScreen"].forEach(id => { const e = document.getElementById(id); if(e) e.style.display = "none"; });
  const l = familyLinkLocal(), player = famProfile(), lvl = famLvl(), now = Date.now(), list = hwEntries(l && l.program).sort((a, b) => b.at - a.at); const w = document.getElementById("linkWrap");
  const activeExpert = list.filter(e => !e.end).length; let plan = null; try{ plan = devPlanRefresh(player, lvl, { now, expertCount: activeExpert, off: !!(l && l.program && l.program.devOff), excludeIds: list.filter(e => !e.end).map(e => e.id) }); if(l) devPlanSync(plan, l); }catch(e){ console.error(e); }
  const devItems = plan ? plan.items.slice().sort((a, b) => (a.snooze > now ? 1 : 0) - (b.snooze > now ? 1 : 0) || (a.kind === "strong") - (b.kind === "strong")) : [];
  const devDone = plan ? (plan.history || []).filter(h => h.status === "done" && now - (h.doneAt || h.at) < 7 * 864e5).sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0)) : []; const dayStart0 = new Date(now).setHours(0, 0, 0, 0); const doneToday = devDone.filter(h => (h.doneAt || 0) >= dayStart0).length;
  const dk = (t) => { const d = new Date(t); return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate(); }; const dLong = (t) => new Date(t).toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric", weekday:"long" }); const dShort = (t) => new Date(t).toLocaleDateString("tr-TR", { day:"numeric", month:"short" });
  const head = (ic, col, title, sub) => `<div style="display:flex;align-items:center;gap:8px;margin:14px 2px 6px">${icI(ic, 20, col)}<div><div style="font-weight:900;font-size:17px">${title}</div>${sub ? `<div class="fam-sub" style="font-weight:600">${sub}</div>` : ""}</div></div>`;
  const pill = (c) => `<span style="flex:none;padding:6px 10px;border-radius:999px;font-weight:900;font-size:13px;background:${c[1]};color:${c[2]}">${c[0]}</span>`;
  const catName = (id) => { const c = CATEGORIES.find(x => !x.hidden && x.exerciseIds.includes(id)); return c ? (c.label || c.title || "") : ""; };
  /* Uzman ödevleri */
  let expertHtml = "";
  if(list.length){ const groups = []; list.forEach(e => { const g = groups.find(x => x.k === dk(e.at)); if(g) g.items.push(e); else groups.push({ k: dk(e.at), at: e.at, items:[e] }); });
    expertHtml = groups.map(g => `<div><div style="font-weight:800;font-size:13px;color:#5B6B7A;margin:6px 2px 6px">${g.items[0].noDate ? "Tarihi kayıtlı olmayan ödevler" : escHTML(dLong(g.at))}</div>${g.items.map(e => { const st = hwStatus(e, player), c = HW_ST[st.k];
      return `<button type="button" class="fam-card" data-hwopen="${e.id}" style="display:flex;align-items:center;gap:10px;width:100%;text-align:left;margin-bottom:8px;cursor:pointer;font:inherit;color:inherit"><span style="flex:1;min-width:0"><span style="display:flex;align-items:center;gap:6px;font-weight:900;font-size:15px">${icI("pin", 17, "#0A847E")}${escHTML(famLabel(e.id))}</span><span class="fam-sub" style="display:block;font-weight:600;margin-top:2px">${escHTML(catName(e.id))}${e.end ? " · süresi tamamlandı" : ""}</span><span class="fam-sub" style="display:block;font-weight:600;margin-top:2px">${st.n ? `${st.n} kez çalışıldı · son: ${escHTML(dShort(st.last))} · ${st.err} hata` : "Bu ödev henüz çalışılmadı"}</span><span style="display:block;margin-top:8px">${st.k === "none" && !e.end ? `<span class="fam-go" aria-hidden="true">${icI("play", 16, "#fff")} Etkinliğe başla</span>` : pill(c)}</span></span></button>`; }).join("")}</div>`).join(""); }
  else if(l){ expertHtml = `<div class="fam-sub" style="font-weight:600;margin:0 2px 4px">Uzmanınız henüz ödev vermedi.</div>`; }
  else { expertHtml = `<div class="fam-sub" style="font-weight:600;margin:0 2px 4px">Uzmanınıza bağlandığınızda verdiği ödevler burada görünür. <button type="button" id="hwLinkBtn2" style="background:none;border:0;padding:0;font:inherit;font-weight:800;color:#0A847E;text-decoration:underline;cursor:pointer">Uzmana bağlan</button></div>`; }
  /* Gelişim ödevleri */
  const DEV_ST = { none:["Henüz başlanmadı","#EEF2F6","#5B6B7A"], go:["Devam ediyor","#FFF6D6","#8A6400"], snooze:["Yarına ertelendi","#EEF2F6","#5B6B7A"] };
  let devHtml = "";
  if(devItems.length){ devHtml = devItems.map(it => { const A = devAttempts(it, player, now), sn = it.snooze > now, c = sn ? DEV_ST.snooze : A.n ? DEV_ST.go : DEV_ST.none; const tl = (TIERS[it.ti] || TIERS[0]).label; const ex = it.kind === "explore"; const open = window.__zaDevOpen instanceof Set && window.__zaDevOpen.has(it.id);
/* KURAL (önerilen çalışma kartları, 2026-11-08): Ödevlerim'deki önerilen çalışmalar kapalı (tek satır: simge, ad, alan · düzey, ok) gelir; dokununca açılır ve açıklama, durum satırı, "Etkinliğe başla" ve "Yarına ertele" görünür; başka bir karta dokununca önceki kapanır. Ekran kalabalık görünmez */
return `<div class="fam-card dev-card${open ? " open" : ""}" data-devcard="${it.id}" style="margin-bottom:6px;${sn ? "opacity:.65;" : ""}"><button type="button" class="dev-head" data-devtoggle="${it.id}" aria-expanded="${open ? "true" : "false"}"><span class="dev-ic">${icI(it.kind === "strong" ? "star" : ex ? "search" : "sprout", 17, it.kind === "strong" ? "#A9632A" : ex ? "#0A847E" : "#1B7A3D")}</span><span class="dev-tt"><span class="dev-name">${escHTML(famLabel(it.id))}</span><span class="dev-sub">${escHTML(catName(it.id))} · ${escHTML(tl)}${it.kind === "strong" ? " · Güçlü yön" : ex ? " · Tanıma" : ""}${sn ? " · ertelendi" : A.n ? " · devam ediyor" : ""}</span></span><span class="dev-chev" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></button><div class="dev-body"><div class="fam-sub" style="font-weight:600">${escHTML(it.kind === "strong" ? "İyi yaptığı bir çalışma; kendine güvenini destekler" : ex ? "Bu alanı tanımak için kısa bir çalışma" : (it.reason || ""))}</div><div class="fam-sub" style="font-weight:700;margin-top:3px;color:#0A847E">${ex ? "Bir kez yapınca tamamlanır" : A.ok >= 1 ? "Bir başarı daha kaldı" : A.n ? `${A.n} kez çalışıldı · iki başarılı deneme gerekiyor` : "İki kez başarıyla yapınca tamamlanır"}</div><div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px">${sn ? pill(c) : `<button type="button" class="fam-go" data-devopen="${it.id}" data-devti="${it.ti}">${icI("play", 16, "#fff")} ${A.n ? "Devam et" : "Etkinliğe başla"}</button>`}<button type="button" data-devsnooze="${it.id}" style="min-height:40px;padding:6px 12px;font:inherit;font-size:14px;font-weight:800;color:#0A847E;background:#fff;border:2px solid #D7E2EA;border-radius:12px;cursor:pointer">${sn ? "Ertelemeyi geri al" : "Yarına ertele"}</button></div></div></div>`; }).join("");
  }
  else if(plan && plan.off){ devHtml = `<div class="fam-sub" style="font-weight:600;margin:0 2px 4px">Uzmanınız önerilen çalışmaları bu dönem için kapattı.</div>`; }
  else if(plan && plan.needData){ devHtml = `<div class="fam-card"><div style="font-weight:900">Önerilen çalışmaları hazırlamak için biraz daha çalışma gerekiyor</div><div class="fam-sub" style="font-weight:600;margin-top:4px">Birkaç çalışma yapıldıkça ya da değerlendirme turu tamamlandığında uygulama ${escHTML(player)} için ödevleri kendisi hazırlar.</div><button type="button" class="fam-cta" id="devPlaceBtn" style="margin-top:10px">Değerlendirme turunu başlat</button></div>`; }
  else if(plan){ devHtml = `<div class="fam-sub" style="font-weight:600;margin:0 2px 4px">Şu an bütün alanlarda iyi gidiyor. Yeni çalışmalar yapıldıkça burada yeni adımlar çıkabilir.</div>`; }
  if(devDone.length && !devItems.length && plan && !plan.off && doneToday) devHtml = `<div class="fam-card" style="margin-bottom:8px;display:flex;align-items:center;gap:10px">${icI("star", 24, "#1B7A3D")}<div><div style="font-weight:900">Bugünkü ödevler tamamlandı</div><div class="fam-sub" style="font-weight:600;margin-top:2px">Yarın yeni ödevler hazırlanacak.</div></div></div>`;
  devHtml += hwHistoryTable(plan, player, now, catName, dShort);   /* geçmiş ödevler tablosu */

  const anyHw = list.length || devItems.length || devDone.length || hwHistRows(plan, now).length; let body = ""; if(devItems.length && plan && plan.needData) devHtml = hwKesifCard(player) + devHtml; else if(devItems.length && plan && hwNeedsKesif(player)) devHtml = hwKesifCard(player, true) + devHtml;
  if(!anyHw){ body = `<div class="fam-card" style="text-align:center;padding:28px 18px"><div style="width:64px;height:64px;margin:0 auto;border-radius:50%;background:#D9F2EF;display:flex;align-items:center;justify-content:center">${icI("clip", 34, "#0A847E")}</div><div style="font-weight:900;font-size:18px;margin-top:10px">Henüz ödeviniz yok.</div><div class="fam-sub" style="font-weight:600;margin-top:6px">${l ? "Uzmanınız ödev verdiğinde ya da uygulama bir çalışma önerdiğinde burada görünecek." : "Uzmanınıza bağlandığınızda verdiği ödevler, çalışmalar yapıldıkça da önerilen çalışmalar burada görünecek."}</div>${l ? "" : `<button type="button" class="fam-cta" id="hwLinkBtn" style="margin-top:14px">Uzmana bağlan</button>`}</div>`
      + (plan && plan.needData ? devHtml : hwDevStatusLine(plan, player, lvl)); }
  else { body = head("brief", "#0A847E", "Uzman ödevleri", list.length ? "Uzmanınızın verdiği ödevler; önce bunlarla başlayın" : "") + expertHtml + head("sprout", "#1B7A3D", "Önerilen çalışmalar", "Çalışmalarına göre hazırlanan bir sonraki adımlar") + devHtml
      + `<details class="fam-card" style="margin-top:10px"><summary style="font-weight:800;cursor:pointer">Bu ödevler nasıl seçilir?</summary><div class="fam-sub" style="font-weight:600;margin-top:8px;line-height:1.55">Uzman ödevlerini uzmanınız verir ve her zaman önceliklidir. Önerilen çalışmaları uygulama, son 60 gündeki çalışmalara bakarak hazırlar: daha çok çalışmaya ihtiyaç duyduğu alanlardan bir çalışma bir alt düzeyden başlar, iyi yaptığı bir alandan da bir çalışma eklenir. Bir ödev iki başarılı denemeyle tamamlanır ve yerine bir sonraki adım gelir. Uzman ödevi varken en fazla bir önerilen çalışma verilir.<br>Uzman ödevlerinde: Başarılı = son denemede en çok 1 hata · Gelişiyor = 2 hata · Tekrar edelim = 3 ve üzeri hata.</div></details>`; }
  const todayTotal = devItems.length + doneToday; w.innerHTML = `<div><h2 class="fam-h">Ödevlerim</h2><div class="fam-sub">${escHTML(player)}${todayTotal && doneToday ? ` · Bugün ${doneToday}/${todayTotal} ödev tamamlandı` : ""}</div></div>${body}`;
  ["hwLinkBtn","hwLinkBtn2"].forEach(id => { const lb = document.getElementById(id); if(lb) lb.onclick = () => { try{ showLinkScreen(); }catch(e){} }; });
  const pb = document.getElementById("devPlaceBtn") || document.getElementById("devPlaceBtn2"); if(pb) pb.onclick = () => { try{ placeStart(player); }catch(e){ console.error(e); } };   /* KURAL: tur, altındaki ekran gizlenmeden başlar (bitince o ekrana dönülür) */
  w.querySelectorAll("[data-hwopen]").forEach(b => b.onclick = () => hwRunOpen(b.dataset.hwopen, null));
  w.querySelectorAll("[data-devopen]").forEach(b => b.onclick = () => hwRunOpen(b.dataset.devopen, +b.dataset.devti)); /* KURAL (kart dokunma hassasiyeti, 2026-11-08): önerilen çalışma kartı parmak kalkar kalkmaz (pointerup) açılıp kapanır, tarayıcının tıklama gecikmesini beklemez; 8 px'ten fazla kaydırma dokunma sayılmaz (kaydırırken kart açılmaz); kapalı kartın tamamı dokunma alanıdır; basınca kart hafifçe renk değiştirir */ w.querySelectorAll("[data-devtoggle]").forEach(b => { const card = b.closest(".dev-card"); const tgt = card || b; let st = null; const down = (ev) => { if(ev.pointerType === "mouse" && ev.button !== 0) return; if(card && card.classList.contains("open") && !ev.target.closest(".dev-head")) return; st = { x: ev.clientX, y: ev.clientY, t: Date.now() }; }; const move = (ev) => { if(st && Math.hypot(ev.clientX - st.x, ev.clientY - st.y) > 8) st = null; }; const up = (ev) => { if(!st) return; st = null; b.__zaPd = Date.now(); b.__zaToggle(); }; tgt.addEventListener("pointerdown", down, { passive: true }); tgt.addEventListener("pointermove", move, { passive: true }); tgt.addEventListener("pointerup", up, { passive: true }); tgt.addEventListener("pointercancel", () => { st = null; }, { passive: true }); b.addEventListener("click", () => { if(b.__zaPd && Date.now() - b.__zaPd < 700) return; b.__zaToggle(); }); b.__zaToggle = () => { const id = b.dataset.devtoggle; if(!(window.__zaDevOpen instanceof Set)) window.__zaDevOpen = new Set(); const was = window.__zaDevOpen.has(id); window.__zaDevOpen.clear(); if(!was) window.__zaDevOpen.add(id); w.querySelectorAll(".dev-card").forEach(c => { const on = c.dataset.devcard === id && !was; c.classList.toggle("open", on); const h = c.querySelector(".dev-head"); if(h) h.setAttribute("aria-expanded", on ? "true" : "false"); }); }; });
  w.querySelectorAll("[data-devsnooze]").forEach(b => b.onclick = () => { const pl = devPlanGet(player, lvl); if(!pl) return; const it = pl.items.find(x => x.id === b.dataset.devsnooze); if(!it) return; if(it.snooze > Date.now()) delete it.snooze; else { it.snooze = Date.now() + 864e5; it.at = Math.max(it.at, Date.now() - (DEV_STALE_DAYS - 2) * 864e5); } devPlanSave(player, lvl, pl); showHwScreen(); });
  document.getElementById("linkScreen").style.display = "flex"; document.getElementById("linkScreen").scrollTop = 0; }finally{ try{ const ls = document.getElementById("linkScreen"); if(ls) ls.classList.add("za-hw"); }catch(e){} try{ scheduleTour("hw", "linkScreen"); }catch(e){} } }
function hwOpen(id, l, tiOverride){ hideLinkScreens(); hideFamScreens(); appMode = "aile"; try{ applyModeVisibility(); }catch(e){} try{ renderPlayerOptions(); const sel = document.getElementById("playerSelect"); if(playersList.includes(currentPlayerName)){ sel.value = currentPlayerName; updatePlayerAvatar(currentPlayerName); } }catch(e){} const ci = CATEGORIES.findIndex(c => !c.hidden && c.exerciseIds.includes(id)); if(ci < 0) return; selectCategory(ci);
  let k = currentCategoryExercises().findIndex(x => x.id === id);
  if(k < 0){ const ex0 = exerciseById(id), alt = ex0 && ex0.readingLevel.find(lv => lv !== readingLevel); if(alt){ readingLevel = alt; try{ applyLevelDefaultThresholds(alt); }catch(e){} SEQUENCE = buildSequenceForCategory(); currentIndex = 0; k = currentCategoryExercises().findIndex(x => x.id === id); } }   /* uzman ödevi kendi kademesinde açılır */
  if(k < 0) return; const cf = l && l.program && l.program.cfg ? l.program.cfg[id] : null; const t = tiOverride != null && !isNaN(tiOverride) ? tiOverride : (cf && cf.t != null ? cf.t : currentCombo().t); const si = findSeqIndex(t, k); goToIndex(si >= 0 ? si : findSeqIndex(0, k)); }

/* Yönerge kutusundaki strateji notları: 💡 emojisi yerine çizgi ampul simgesi (metinler tek tek değiştirilmeden) */
function iconizeTips(root){ if(!root || !/💡/.test(root.textContent)) return; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), hits = []; let n; while((n = w.nextNode())) if(n.nodeValue.includes("💡")) hits.push(n);
  hits.forEach(t => { const parts = t.nodeValue.split("💡"); const frag = document.createDocumentFragment(); parts.forEach((pt, i) => { if(i){ const sp = document.createElement("span"); sp.innerHTML = icI("bulb", 17, "#B07D00"); frag.appendChild(sp.firstChild); } if(pt) frag.appendChild(document.createTextNode(pt.replace(/^\s+/, i ? " " : ""))); }); t.parentNode.replaceChild(frag, t); }); }
try{ const ib = document.getElementById("instructionBox"); if(ib){ iconizeTips(ib); new MutationObserver(() => iconizeTips(ib)).observe(ib, { childList:true, subtree:true, characterData:true }); } }catch(e){}

/* ===== Gelişim ödevleri · Aşama 1: performans özeti (veri katmanı) ===== */
function perfSrc(){ return appMode === "cocuk" || (typeof gameMode !== "undefined" && gameMode) ? "oyun" : appMode === "uzman" ? "uzman" : "aile"; }
function autoSaveable(ex){ return !!(ex && (ex.isTouch || ex.isSeqRows || ex.isChoice || ex.isSearch || ex.isTrail || ex.isPlan || ex.isSort || ex.isMt || ex.isWm || ex.isRt)); }
/* KURAL (Oluş Sırası otomatik, 2026-11-09): Oluş Sırası dokunmalı bir çalışmadır — bitince sonucu kendisi kaydeder, hata sayısını kendisi tutar (−/+ yok) */
function perfIsAuto(ex){ return !!(ex && (ex.isTouch || ex.isSeqRows || ex.isChoice || ex.isSearch || ex.isTrail || ex.isMotion || ex.isPlan || ex.isSort || (typeof NEW_MT !== "undefined" && NEW_MT.build && NEW_MT.build[ex.id]))); }
function perfItemCount(ex, layout){ try{ if(typeof chState !== "undefined" && chState && chState.id === ex.id && chState.trials) return chState.trials.length; if(typeof mtState !== "undefined" && mtState && Array.isArray(mtState.trials) && NEW_MT.build[ex.id]) return Math.max(1, mtState.trials.length - (mtState.warmN || 0)); if(ex.isTouch) return Math.max(1, touchGoTotal()); if(Array.isArray(currentGrid) && currentGrid.length) return currentGrid.length; }catch(e){} return layout ? layout.rows * layout.cols : 10; }
/* Kayıtlar: buluttan yüklenenler + bağlantısızken kuyrukta bekleyenler (yenilemede kaybolmasın), yinelenmeden */
function perfRecords(){ const key = (r) => r.t + "|" + (r.player || "") + "|" + (r.exerciseLabel || ""); const local = perfLocalAll(), lmap = new Map(local.map(r => [key(r), r])); const out = loadSessions().map(r => lmap.has(key(r)) ? Object.assign({}, r, lmap.get(key(r))) : r); const seen = new Set(out.map(key)); local.forEach(r => { if(!seen.has(key(r))){ seen.add(key(r)); out.push(r); } }); try{ loadPendingWrites().forEach(w => { if(w && w.coll === "sessions" && w.data && !seen.has(key(w.data))){ seen.add(key(w.data)); out.push(w.data); } }); }catch(e){} return out; }
/* Bir denemenin sonucu: hata oranı öğe sayısına göre (oyunun yıldız kuralıyla uyumlu) */
function perfOutcome(rec){ const n = Math.max(1, rec.n || perfLegacyN(rec)), e = rec.errors || 0; if(e <= Math.max(1, Math.floor(n * 0.1))) return "ok"; if(e >= Math.max(3, Math.ceil(n * 0.25))) return "hard"; return "mid"; }
const PERF_DAYS = 60, PERF_MIN_EVIDENCE = 3;
function perfExOf(rec){ if(rec.exId && exerciseById(rec.exId)) return exerciseById(rec.exId); return EXERCISES.find(e => e.label === rec.exerciseLabel || (e.oldLabels || []).includes(rec.exerciseLabel)) || null; }
function perfCatOf(exId){ return CATEGORIES.find(c => !c.hidden && c.id !== "oyun-parki" && c.exerciseIds.includes(exId)) || null; }
/* Kişinin son 60 günlük kayıtlarından çalışma ve alan özeti.
   Ağırlık: otomatik ölçülen çalışma 1 · elle ölçülen 0,5 · Zihin Adaları 0,5. Kanıt 3'ten azsa "veri az". */
function perfSummary(player, opts){ opts = opts || {}; const nm = (player || "").trim().toLocaleLowerCase("tr"); const since = (opts.now || Date.now()) - PERF_DAYS * 864e5; const lvl = opts.lvl || null; const lvlOf = (r) => { if(!opts.catLvl || !lvl) return lvl; try{ const ex = perfExOf(r), c = ex && perfCatOf(ex.id); return c ? catLevelFor(c.id, player) : lvl; }catch(e){ return lvl; } };
  const recs = perfRecords().filter(r => { if((r.player || "").trim().toLocaleLowerCase("tr") !== nm || r.t < since) return false; const want = lvlOf(r); return !want || !r.lvl || r.lvl === want; });
  const byEx = {};
  recs.forEach(r => { const ex = perfExOf(r); if(!ex) return; const cat = perfCatOf(ex.id); if(!cat) return; const auto = r.auto !== undefined ? !!r.auto : perfIsAuto(ex); const src = r.src || "etkinlik"; const w = (auto ? 1 : 0.5) * (src === "oyun" ? 0.5 : 1);
    (byEx[ex.id] = byEx[ex.id] || { id: ex.id, cat: cat.id, auto, recs: [] }).recs.push({ t: r.t, o: perfOutcome(r), w, ti: r.ti, tier: r.tier, src, errors: r.errors || 0, n: r.n || r.itemCount }); });
  const exercises = Object.values(byEx).map(x => { const last = x.recs.sort((a, b) => b.t - a.t).slice(0, 3); const W = last.reduce((s, r) => s + r.w, 0) || 1;
    const hard = last.reduce((s, r) => s + r.w * (r.o === "hard" ? 1 : r.o === "mid" ? 0.5 : 0), 0) / W, ok = last.reduce((s, r) => s + r.w * (r.o === "ok" ? 1 : 0), 0) / W;
    const evG = last.filter(r => r.src === "oyun").reduce((s, r) => s + r.w, 0), evA = last.filter(r => r.src !== "oyun").reduce((s, r) => s + r.w, 0); const gl = last.filter(r => r.src === "oyun"), gW = gl.reduce((s, r) => s + r.w, 0) || 1; const gHard = gl.reduce((s, r) => s + r.w * (r.o === "hard" ? 1 : r.o === "mid" ? 0.5 : 0), 0) / gW;
    return { id: x.id, cat: x.cat, auto: x.auto, count: x.recs.length, evidence: last.reduce((s, r) => s + r.w, 0), evAct: evA, evGame: evG, gameStruggle: gl.length ? gHard : 0, struggle: hard, success: ok, lastT: last[0].t, lastTi: last[0].ti, lastTier: last[0].tier, lastOutcome: last[0].o }; });
  const domains = {}; CATEGORIES.filter(c => !c.hidden && c.id !== "oyun-parki").forEach(c => { const xs = exercises.filter(x => x.cat === c.id); const ev = xs.reduce((s, x) => s + x.evidence, 0);
    const struggle = ev ? xs.reduce((s, x) => s + x.struggle * x.evidence, 0) / ev : 0, success = ev ? xs.reduce((s, x) => s + x.success * x.evidence, 0) / ev : 0;
    const evAct = xs.reduce((s, x) => s + (x.evAct || 0), 0), evGame = xs.reduce((s, x) => s + (x.evGame || 0), 0), gameStruggle = evGame ? xs.reduce((s, x) => s + (x.gameStruggle || 0) * (x.evGame || 0), 0) / evGame : 0;
    /* Zihin Adaları destekleyicidir: alan, aile/uzman çalışmasından en az 1 kanıt olmadan "zorlanıyor" ya da "güçlü" sayılmaz */
    const state = ev < PERF_MIN_EVIDENCE || evAct < 1 ? "veri-az" : struggle > 0.5 ? "zorlaniyor" : success >= 0.75 ? "guclu" : "gelisiyor";
    domains[c.id] = { id: c.id, evidence: ev, evAct, evGame, exercises: xs.length, struggle, success, gameStruggle, gameSignal: evGame >= 1 && gameStruggle > 0.5, state }; });
  return { player: player, records: recs.length, exercises: exercises.sort((a, b) => b.struggle - a.struggle || b.evidence - a.evidence), domains }; }

/* ===== Gelişim ödevleri · Aşama 2: öneri motoru ===== */
const DEV_KEY = "wm_devhw_v1", DEV_RECENT_DAYS = 14, DEV_STALE_DAYS = 7, DEV_EASE_DAYS = 14, DEV_WEEK_DAYS = 7, DEV_MAX_TOTAL = 5;
/* Alan → velinin göreceği kısa "neden" (Aşama 6'da birlikte gözden geçirilecek) */
const DEV_REASON = { "islemleme-hizi":"Hızlı ve doğru çalışmayı destekler", "goz-takip":"Gözleriyle takip etmeyi destekler", "yurutucu-islev":"Dikkatini toplamayı ve kurala uymayı destekler", "calisan-bellek":"Bilgiyi aklında tutup kullanmayı destekler", "sozel-bellek":"Duyduklarını hatırlamayı destekler", "gorsel-bellek":"Gördüklerini hatırlamayı destekler", "sozel-organizasyon":"Düşüncelerini sözcüklerle düzenlemeyi destekler", "sozel-kavrama":"Dinlediğini ve okuduğunu anlamayı destekler", "gorsel-organizasyon":"Parçaları birleştirip bütünü görmeyi destekler", "algisal-akil-yurutme":"Örüntü ve kuralları fark etmeyi destekler" };
function devStoreAll(){ try{ return JSON.parse(localStorage.getItem(DEV_KEY) || "{}"); }catch(e){ return {}; } }
function devStoreSave(d){ try{ localStorage.setItem(DEV_KEY, JSON.stringify(d)); }catch(e){} }
function devKey(player, lvl){ return (player || "").trim() + "|" + (lvl === "pre" ? "pre" : "post"); }
function devPlanGet(player, lvl){ return devStoreAll()[devKey(player, lvl)] || null; }
function devPlanSave(player, lvl, plan){ const d = devStoreAll(); d[devKey(player, lvl)] = plan; devStoreSave(d); }
/* Ödev verildikten sonraki denemeler: kaç kez, kaç başarılı */
function devAttempts(item, player, now){ const nm = (player || "").trim().toLocaleLowerCase("tr"); const ex = exerciseById(item.id); if(!ex) return { n:0, ok:0, last:0 }; const labels = [ex.label].concat(ex.oldLabels || []);
  const recs = perfRecords().filter(r => (r.player || "").trim().toLocaleLowerCase("tr") === nm && (r.exId === item.id || labels.includes(r.exerciseLabel)) && r.t >= item.at && r.t <= (now || Date.now()) && (r.ti == null || item.ti == null || r.ti >= item.ti)).sort((a, b) => b.t - a.t);   /* ödevin düzeyinde ya da üstünde; adalardaki denemeler de sayılır */
  return { n: recs.length, ok: recs.filter(r => perfOutcome(r) === "ok").length, last: recs.length ? recs[0].t : 0, lastOutcome: recs.length ? perfOutcome(recs[0]) : null }; }
function devLevelOk(ex, lvl){ return !!ex && (!ex.readingLevel || ex.readingLevel.includes(lvl)); }
/* Alanda verilecek çalışmayı seç: tercihen otomatik ölçülen, son 2 haftada verilmemiş; zorlandığı çalışma öncelikli */
function devPickExercise(cat, lvl, S, recentIds, prefer){ const c = CATEGORIES.find(x => x.id === cat); if(!c) return null; const exs = c.exerciseIds.map(exerciseById).filter(e => devLevelOk(e, lvl));
  const info = (id) => S.exercises.find(x => x.id === id); const score = (e) => { const i = info(e.id); let sc = 0; if(perfIsAuto(e)) sc += 4; if(recentIds.has(e.id)) sc -= 10; if(prefer === "hard" && i) sc += 3 * i.struggle; if(prefer === "strong" && i) sc += 3 * i.success - (i.lastOutcome === "ok" ? 0 : 2); if(prefer === "strong" && !i) sc -= 5; if(prefer === "explore") sc -= 3 * (e.minTier || 0) + (i ? 2 : 0); return sc + Math.random() * 0.5; };   /* tanıma: Başlangıçtan açılan ve henüz yapılmamış çalışma */
  const best = exs.slice().sort((a, b) => score(b) - score(a))[0]; return best || null; }
function devTierFor(ex, S, mode){ const i = S.exercises.find(x => x.id === ex.id); let t; if(i && i.lastTi != null) t = mode === "strong" ? i.lastTi : i.lastTi - 1; else { const xs = S.exercises.filter(x => x.cat === (perfCatOf(ex.id) || {}).id && x.lastTi != null && x.struggle > 0.5); t = xs.length ? Math.min(...xs.map(x => x.lastTi)) - 1 : 0; } return Math.max((ex.minTier || 0), Math.min(2, Math.max(0, t))); }
function devMakeItem(ex, cat, ti, kind, now, extra){ return Object.assign({ id: ex.id, cat, ti, kind, at: now, status: "open", reason: DEV_REASON[cat] || "" }, extra || {}); }
/* Planı güncelle: biten ödevleri kapat, dokunulmayanları düşür, haftalık yenile, sınırları uygula */
function devPlanRefresh(player, lvl, opts){ opts = opts || {}; const now = opts.now || Date.now(); lvl = lvl === "pre" ? "pre" : "post";
  let plan = devPlanGet(player, lvl) || { genAt: 0, items: [], history: [] }; plan.items = plan.items || []; plan.history = plan.history || [];
  const S = perfSummary(player, { lvl, now, catLvl: true }); const expertN = opts.expertCount || 0; const lvlC = (cat) => { try{ return catLevelFor(cat, player); }catch(e){ return lvl; } }; const exclude = new Set(opts.excludeIds || []); plan.items = plan.items.filter(it => { if(exclude.has(it.id)){ it.status = "promoted"; plan.history.push(it); return false; } return true; }); if(opts.off){ plan.items.forEach(it => { it.status = "off"; plan.history.push(it); }); plan.items = []; plan.off = true; devPlanSave(player, lvl, plan); return plan; } plan.off = false;
  const devCap = expertN > 0 ? 1 : 2, strongCap = expertN > 0 ? 0 : 1, totalCap = Math.max(0, Math.min(devCap + strongCap, DEV_MAX_TOTAL - expertN));
  const recentIds = new Set(plan.history.concat(plan.items).filter(it => now - it.at < DEV_RECENT_DAYS * 864e5).map(it => it.id).concat([...exclude]));
  /* 1) kapananlar ve süresi dolanlar */ const keep = [], nextSteps = [], easeSteps = [];
  plan.items.forEach(it => { const A = devAttempts(it, player, now); it.tries = A.n; it.oks = A.ok; it.last = A.last;
    if(A.ok >= 2 || (it.kind === "explore" && A.n >= 1)){ it.status = "done"; it.doneAt = A.last; plan.history.push(it); if(it.kind === "dev") nextSteps.push(it); }   /* tanıma ödevi tek denemeyle tamamlanır */
    else if(A.n === 0 && now - it.at >= DEV_STALE_DAYS * 864e5){ it.status = "expired"; plan.history.push(it); }
    else if(A.n > 0 && now - it.at >= DEV_EASE_DAYS * 864e5){ it.status = "eased"; plan.history.push(it); if(it.kind === "dev") easeSteps.push(it); }   /* 14 günde 2 başarı yoksa: bir alt düzeyde başka çalışma */
    else keep.push(it); });
  plan.items = keep.filter(it => { const ex = exerciseById(it.id); if(ex && it.cat && !devLevelOk(ex, lvlC(it.cat))){ it.status = "level"; plan.history.push(it); return false; } return true; });   /* kademe değişince o kategorideki açık otomatik ödevler kapanır; uzman ödevlerine dokunulmaz */
  /* 2) kapanan gelişim ödevinin bir sonraki adımı: aynı alan, farklı çalışma, bir üst düzey (alan hâlâ zorlanıyorsa ya da veri azsa) */
  nextSteps.forEach(prev => { if(plan.items.filter(i => i.kind === "dev").length >= devCap || plan.items.length >= totalCap) return; const d = S.domains[prev.cat]; if(d && d.state === "guclu") return; recentIds.add(prev.id);
    const ex = devPickExercise(prev.cat, lvlC(prev.cat), S, recentIds, "hard"); if(!ex) return; const ti = Math.max(ex.minTier || 0, Math.min(2, (prev.ti || 0) + 1)); plan.items.push(devMakeItem(ex, prev.cat, ti, "dev", now, { step: (prev.step || 1) + 1, from: prev.id })); recentIds.add(ex.id); });
  easeSteps.forEach(prev => { if(plan.items.filter(i => i.kind === "dev").length >= devCap || plan.items.length >= totalCap) return; recentIds.add(prev.id);
    const ex = devPickExercise(prev.cat, lvlC(prev.cat), S, recentIds, "hard"); if(!ex) return; const ti = Math.max(ex.minTier || 0, Math.max(0, (prev.ti || 0) - 1)); plan.items.push(devMakeItem(ex, prev.cat, ti, "dev", now, { step: prev.step || 1, from: prev.id, eased: true })); recentIds.add(ex.id); });
  /* 3) haftalık yenileme: ilk kez ya da 7 gün geçtiyse eksikleri tamamla */
  const weekly = !plan.genAt || now - plan.genAt >= DEV_WEEK_DAYS * 864e5 || plan.needData || plan.items.filter(i => i.kind !== "explore").length === 0;   /* veri az yüzünden boş kaldıysa ya da açık ödev yoksa 7 gün bekleme */
  if(weekly){ plan.genAt = now; const makeRoom = () => { if(plan.items.length < totalCap) return true; const ei = plan.items.findIndex(i => i.kind === "explore" && !(i.tries > 0)); if(ei < 0) return false; const rm = plan.items.splice(ei, 1)[0]; rm.status = "replaced"; plan.history.push(rm); return true; };   /* gelişim ödevi tanıma ödevinden önceliklidir */
    const prio = (d) => d.struggle + (d.gameSignal ? 0.1 : 0); const hardDomains = Object.values(S.domains).filter(d => d.state === "zorlaniyor").sort((a, b) => prio(b) - prio(a) || b.evidence - a.evidence);   /* oyun sinyali önceliği artırır */
    for(const d of hardDomains){ if(plan.items.filter(i => i.kind === "dev").length >= devCap) break; { const ei = plan.items.findIndex(i => i.cat === d.id && i.kind === "explore" && !(i.tries > 0)); if(ei >= 0){ const rm = plan.items.splice(ei, 1)[0]; rm.status = "replaced"; plan.history.push(rm); } } if(!makeRoom()) break; if(plan.items.some(i => i.cat === d.id)) continue;   /* aynı alandaki başlanmamış tanıma ödevi gelişime yer açar */ const ex = devPickExercise(d.id, lvlC(d.id), S, recentIds, "hard"); if(!ex) continue; plan.items.push(devMakeItem(ex, d.id, devTierFor(ex, S, "dev"), "dev", now, { step: 1 })); recentIds.add(ex.id); }
    const nDev = plan.items.filter(i => i.kind === "dev").length;
    if(nDev > 0 && strongCap > 0 && !plan.items.some(i => i.kind === "strong") && makeRoom()){ const strong = Object.values(S.domains).filter(d => d.state === "guclu" && !plan.items.some(i => i.cat === d.id)).sort((a, b) => b.success - a.success || b.evidence - a.evidence)[0];
      if(strong){ const ex = devPickExercise(strong.id, lvlC(strong.id), S, recentIds, "strong"); if(ex){ plan.items.push(devMakeItem(ex, strong.id, devTierFor(ex, S, "strong"), "strong", now)); recentIds.add(ex.id); } } } }
  /* 3b) tanıma ödevleri: gelişim ödevleri 3'ten azsa, verisi az alanlardan kısa çalışmalar (uzman ödevi yokken) */
  if(!expertN && !opts.noExplore){ const exploreCap = 3; const nowCount = () => plan.items.length; const dayStart = new Date(now).setHours(0, 0, 0, 0); let exploreLeft = Math.max(0, 3 - plan.history.concat(plan.items).filter(i => i.kind === "explore" && i.at >= dayStart && i.status !== "replaced" && i.status !== "trimmed").length);   /* günde en çok 3 tanıma ödevi; yapılan hemen yenisiyle değişmez */
    const poor = Object.values(S.domains).filter(d => d.state === "veri-az" && !plan.items.some(i => i.cat === d.id) && !plan.history.some(h => h.cat === d.id && h.kind === "explore" && now - h.at < DEV_RECENT_DAYS * 864e5)).sort((a, b) => a.evidence - b.evidence || (Math.random() - 0.5));
    for(const d of poor){ if(nowCount() >= exploreCap || exploreLeft <= 0) break; const ex = devPickExercise(d.id, lvl, S, recentIds, "explore"); if(!ex) continue; let ti = 0; try{ const pt = placedTierFor(ex.id, player); if(pt != null) ti = Math.min(2, Math.max(ex.minTier || 0, pt)); }catch(e){} plan.items.push(devMakeItem(ex, d.id, Math.max(ex.minTier || 0, ti), "explore", now)); recentIds.add(ex.id); exploreLeft--; } }
  /* 4) sınır: uzman ödevi sonradan eklendiyse fazlası düşer (önce güçlü alan, sonra en yeni gelişim) */
  while(plan.items.length > Math.max(totalCap, expertN ? 0 : 3) || plan.items.filter(i => i.kind === "dev").length > devCap || (expertN && plan.items.some(i => i.kind === "explore"))){ let idx = plan.items.findIndex(i => i.kind === "explore"); if(idx < 0) idx = plan.items.findIndex(i => i.kind === "strong"); const rm = idx >= 0 ? plan.items.splice(idx, 1)[0] : plan.items.pop(); rm.status = "trimmed"; plan.history.push(rm); }
  plan.needData = !Object.values(S.domains).some(d => d.state !== "veri-az");
  if(plan.history.length > 40) plan.history = plan.history.slice(-40);
  devPlanSave(player, lvl, plan); return plan; }

/* ===== Gelişim ödevleri · Aşama 4: uzman tarafı ===== */
/* Aile cihazı: plan değiştiğinde (en çok saatte bir) özetini bulutta bağlantının sonuçlar listesine yazar */
function devPlanSync(plan, l){ try{ if(!plan || !l || !l.code) return; const items = (plan.items || []).map(it => ({ id: it.id, cat: it.cat, ti: it.ti, kind: it.kind, at: it.at, snooze: it.snooze || 0, tries: it.tries || 0, oks: it.oks || 0 })); const done = (plan.history || []).filter(h => h.status === "done").slice(-8).map(h => ({ id: h.id, cat: h.cat, ti: h.ti, doneAt: h.doneAt || h.at }));
  const body = { kind: "devplan", items, done, needData: !!plan.needData, off: !!plan.off }; const hash = JSON.stringify(body); const k = "wm_devsync_" + l.code; let last = {}; try{ last = JSON.parse(localStorage.getItem(k) || "{}"); }catch(e){}
  if(last.h === hash && Date.now() - (last.t || 0) < 6 * 3600e3) return; if(last.h !== hash && Date.now() - (last.t || 0) < 600e3 && last.h) return;   /* değiştiyse en çok 10 dakikada bir */
  const rec = Object.assign({ t: Date.now(), player: linkedChildName(l) || famProfile() }, body); localStorage.setItem(k, JSON.stringify({ h: hash, t: Date.now() }));
  if(!fbOk()){ queuePendingWrite("links/" + l.code + "/results", rec); return; } const { db, collection, addDoc } = window.__fb; addDoc(collection(db, "links", l.code, "results"), Object.assign({ uid: window.__fb.uid }, rec)).catch(() => {}); }catch(e){} }
/* Uzman danışan sayfası: ailenin cihazındaki gelişim planı + çevir / kapat */
function exDevCardHtml(p, dp){ const tl = (t) => (TIERS[t] || TIERS[0]).label; const ago = (t) => { const d = Math.round((Date.now() - t) / 864e5); return d <= 0 ? "bugün" : d === 1 ? "dün" : d + " gün önce"; };
  let h = `<div style="display:flex;align-items:center;gap:8px">${icI("sprout", 20, "#1B7A3D")}<div style="font-weight:900;font-size:16px">Önerilen çalışmalar</div></div><div class="fam-sub" style="font-weight:600">Aile cihazındaki uygulama, çalışma sonuçlarına göre zorlandığı alanlardan ödev hazırlar. Uzman ödevi varken en fazla 1 önerilen çalışma verilir.</div>`;
  h += `<div class="ex-seg" style="grid-template-columns:1fr 1fr"><button type="button" data-devoff="0" class="${p.devOff ? "" : "on"}">Açık</button><button type="button" data-devoff="1" class="${p.devOff ? "on" : ""}">Kapalı</button></div>`;
  if(p.devOff) return h + `<div class="fam-sub" style="font-weight:600">Kapalı: aile yalnızca sizin verdiğiniz ödevleri görür.</div>`;
  if(!dp) return h + `<div class="fam-sub" style="font-weight:600">Aile cihazından henüz gelişim planı gelmedi. Aile uygulamayı güncelleyip Ödevlerim ekranını açtığında burada görünür.</div>`;
  if(dp.off) h += `<div class="fam-sub" style="font-weight:600">Aile cihazı en son kapalı durumu bildirdi; açık olarak kaydettiğinizde yeniden hazırlanır.</div>`;
  if(!(dp.items || []).length) h += `<div class="fam-sub" style="font-weight:600">${dp.needData ? "Aile cihazında henüz yeterli çalışma yok; çalışma önerisi hazırlanmadı." : "Şu an açık önerilen çalışma yok."}</div>`;
  else h += (dp.items || []).map(it => { const inHw = (p.hw || []).includes(it.id); return `<div class="ex-row"><div class="tx"><div class="t1">${icI(it.kind === "strong" ? "star" : "sprout", 15, it.kind === "strong" ? "#A9632A" : "#1B7A3D")} ${famLabel(it.id)}</div><div class="fam-sub" style="font-weight:600">${famCatName(it.cat)} · ${escHTML(tl(it.ti))}${it.kind === "strong" ? " · güçlü yön" : it.kind === "explore" ? " · tanıma" : ""}${it.kind === "explore" ? "" : ` · ${it.oks || 0}/2 başarı`}${it.snooze > Date.now() ? " · ertelendi" : ""}</div></div>${inHw ? `<span class="hw-in">${icI("pin", 13, "#0A847E")} ödevde</span>` : it.kind === "strong" ? "" : `<button type="button" class="fam-cta ghost" data-devhw="${it.id}" style="width:auto;min-height:40px;padding:6px 10px;font-size:13px">Uzman ödevine çevir</button>`}</div>`; }).join("");
  if((dp.done || []).length) h += `<div class="fam-sub" style="font-weight:600">${icI("star", 14, "#1B7A3D")} Tamamlananlar: ${dp.done.slice(-5).reverse().map(d => famLabel(d.id)).join(", ")}</div>`;
  return h + `<div class="fam-sub" style="font-weight:600">Son güncelleme: ${ago(dp.t)}</div>`; }
function exDevCardWire(box, p, saveProg, redraw){ box.querySelectorAll("[data-devoff]").forEach(b => b.onclick = async () => { const v = b.dataset.devoff === "1"; if(!!p.devOff === v) return; p.devOff = v; await saveProg(v ? "Önerilen çalışmalar kapatıldı ✓" : "Önerilen çalışmalar açıldı ✓"); redraw(); });
  box.querySelectorAll("[data-devhw]").forEach(b => b.onclick = async () => { const id = b.dataset.devhw; p.hw = p.hw || []; if(p.hw.includes(id)) return; if(p.hw.length >= 4){ showLevelFlash("En fazla 4 ödev olabilir.", "down"); return; } p.hw = p.hw.concat([id]); await saveProg("Uzman ödevine çevrildi ✓"); redraw(); }); }

/* ===== Gelişim ödevleri · Aşama 5: Zihin Adaları ===== */
/* Gelişim ödevi olan durağa küçük işaret (çocuk oyunda da o çalışmaya yönelebilsin) */
function devIslandMark(exId){ try{ const pl = devPlanGet(gameProfile(), readingLevel === "pre" ? "pre" : "post"); if(!pl || pl.off || !(pl.items || []).some(it => it.id === exId && it.kind === "dev")) return ""; return `<div class="t2" style="display:flex;align-items:center;gap:4px;color:#1B7A3D;font-weight:800">${icI("sprout", 14, "#1B7A3D")} Gelişim durağı</div>`; }catch(e){ return ""; } }

/* ===== Ödevlerim: gezinme, rozet, durum satırı ===== */
let hwFrom = "aile", hwScreenOpen = false;
/* Eski kayıtlar (öğe sayısı yok): soru-cevap ve seçmeli çalışmalarda ızgara boyutu gerçek soru sayısı değildir */
function perfLegacyN(rec){ try{ const ex = perfExOf(rec); if(ex && ((typeof NEW_MT !== "undefined" && NEW_MT.build && NEW_MT.build[ex.id]) || (typeof CHOICE !== "undefined" && CHOICE[ex.id]))) return CHOICE[ex.id] ? 16 : 6; }catch(e){} return rec.itemCount || 10; }
/* Yapılacak ödev sayısı: uzman ödevlerinden henüz başarılmayanlar + açık (ertelenmemiş) gelişim ödevleri */
function hwBadgeCount(name, lvl){ const keepP = currentPlayerName, keepL = readingLevel; try{ currentPlayerName = name; readingLevel = lvl === "pre" ? "pre" : "post"; const l = familyLinkLocal(); const act = hwEntries(l && l.program).filter(e => !e.end); const exp = act.filter(e => hwStatus(e, name).k !== "ok").length;
    let dev = 0; try{ const plan = devPlanRefresh(name, readingLevel, { expertCount: act.length, off: !!(l && l.program && l.program.devOff), excludeIds: act.map(e => e.id) }); dev = (plan.items || []).filter(i => !(i.snooze > Date.now())).length; }catch(e){} return exp + dev; }catch(e){ return 0; } finally{ currentPlayerName = keepP; readingLevel = keepL; } }
function hwBadgeHtml(n, inset){ if(!n) return ""; return `<span class="hw-badge" aria-label="${n} ödev" style="position:absolute;${inset ? "top:-13px;right:-8px;min-width:19px;height:19px;font-size:11px;padding:0 4px;border-width:1.5px;" : "top:-7px;right:-7px;"}min-width:24px;height:24px;padding:0 6px;border-radius:12px;background:#D62839;color:#fff;font-weight:900;font-size:13px;line-height:1;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-sizing:border-box">${n > 9 ? "9+" : n}</span>`; }
/* Boş durumda velinin nedenini anlayacağı kısa satır */
function hwDevStatusLine(plan, player, lvl){ let t; if(!plan) t = "Önerilen çalışmalar şu an hazırlanamadı; daha sonra yeniden deneyin."; else if(plan.off) t = "Uzmanınız önerilen çalışmaları bu dönem için kapattı.";
  else { let S = null; try{ S = perfSummary(player, { lvl }); }catch(e){} const ok = S ? Object.values(S.domains).filter(d => d.state !== "veri-az").length : 0; const all = S ? Object.keys(S.domains).length : 0; t = !S ? "Şu an bütün alanlarda iyi gidiyor." : ok >= all ? `Son 60 günde ${S.records} çalışma kaydı var. Şu an bütün alanlarda iyi gidiyor; yeni çalışmalar yapıldıkça burada yeni adımlar çıkabilir.` : `Son 60 günde ${S.records} çalışma kaydı var; ${ok} alanda yeterli veri var, ${all - ok} alanda henüz az. Diğer alanlardan da çalıştıkça ödevler hazırlanır.`; }
  return `<div class="fam-sub" style="font-weight:600;margin:10px 4px 0;text-align:center">${t}</div>`; }

/* Değerlendirme turu önerisi: hiç yapılmadıysa */
function hwNeedsKesif(player){ try{ const p = placeGet(player); return !p || !p.dom || !Object.keys(p.dom).length; }catch(e){ return false; } }   /* KURAL: Değerlendirme turu sonucu kayıtta "dom" alanındadır; "yapıldı mı" denetimi her yerde placeGet + dom ile yapılır */
function hwKesifCard(player, soft){ if(soft && !hwNeedsKesif(player)) return ""; if(!soft && !hwNeedsKesif(player)) return `<div class="fam-card" style="margin-bottom:8px"><div style="font-weight:900">Değerlendirme turu tamamlandı</div><div class="fam-sub" style="font-weight:600;margin-top:4px">Birkaç çalışma daha yapıldıkça uygulama ${escHTML(player)} için önerilen çalışmaları kendisi hazırlar.</div></div>`; /* KURAL (Değerlendirme turu sonrası, 2026-11-07): tur yapıldıysa "turu başlat" düğmesi gösterilmez */ return `<div class="fam-card" style="margin-bottom:8px"><div style="font-weight:900">${soft ? "Değerlendirme turu henüz yapılmadı" : "Önerilen çalışmaları hazırlamak için biraz daha çalışma gerekiyor"}</div><div class="fam-sub" style="font-weight:600;margin-top:4px">Değerlendirme turu, ${escHTML(player)} için her alanda uygun başlangıç düzeyini bulur; böylece ödevler daha doğru hazırlanır.</div><button type="button" class="fam-cta" id="${soft ? "devPlaceBtn2" : "devPlaceBtn"}" style="margin-top:10px">Değerlendirme turunu başlat</button></div>`; }

/* ===== Ödev oturumu: ödevler kendi içinde ayrı bir akış ===== */
let hwRun = null;
function hwRunList(){ const l = familyLinkLocal(), player = famProfile(), lvl = famLvl(); const exp = hwEntries(l && l.program).filter(e => !e.end).sort((a, b) => b.at - a.at).map(e => ({ id: e.id, ti: null, kind: "expert", at: e.at }));
  const pl = devPlanGet(player, lvl); const dev = ((pl && pl.items) || []).filter(i => !(i.snooze > Date.now())).map(i => ({ id: i.id, ti: i.ti, kind: i.kind, at: i.at })); return exp.concat(dev.filter(d => !exp.some(e => e.id === d.id))); }
function hwRunGo(idx){ if(!hwRun) return; hwRun.idx = idx; const it = hwRun.items[idx]; hwRun.cur = it.id; hwRun.switching = true; try{ hwOpen(it.id, familyLinkLocal(), it.ti); } finally{ if(hwRun) hwRun.switching = false; } hwBarRender(); }
function hwRunOpen(id, ti){ const items = hwRunList(); let idx = items.findIndex(x => x.id === id); if(idx < 0){ items.unshift({ id, ti, kind: ti == null ? "expert" : "dev", at: Date.now() }); idx = 0; } hwRun = { items, idx, cur: id }; hwRunGo(idx); }
function hwRunStep(dir){ if(!hwRun) return; const j = hwRun.idx + dir; if(j < 0 || j >= hwRun.items.length){ hwRunEnd(); showHwScreen(); return; } hideHwDone(); hwRunGo(j); }
function hwRunEnd(){ hwRun = null; hwBarRender(); hideHwDone(); }
function hwRunCheck(){ if(hwRun && !hwRun.switching && currentExercise() && currentExercise().id !== hwRun.cur) hwRunEnd(); }
function hwBarRender(){ let bar = document.getElementById("hwBar"); if(!hwRun){ if(bar) bar.remove(); return; } if(!bar){ const ib = document.getElementById("instructionBox"); if(!ib) return; bar = document.createElement("div"); bar.id = "hwBar"; ib.parentNode.insertBefore(bar, ib); }
  const it = hwRun.items[hwRun.idx], n = hwRun.items.length, tag = it.kind === "expert" ? "Uzman ödevi" : it.kind === "explore" ? "Tanıma ödevi" : it.kind === "strong" ? "Güçlü yön" : "Önerilen";
  bar.style.cssText = "display:flex;align-items:center;gap:10px;background:#D9F2EF;border:2px solid #A7DDD6;border-radius:16px;padding:10px 12px;margin:0 0 10px";
  bar.innerHTML = `${icI("clip", 22, "#0A847E")}<div style="flex:1;min-width:0"><div style="font-weight:900;font-size:15px;color:#0B5F5A">Ödev ${hwRun.idx + 1}/${n} · ${escHTML(famLabel(it.id))}</div><div style="font-weight:700;font-size:13px;color:#2F6F69">${tag} · Sonraki ile sıradaki ödeve geçilir</div></div><button type="button" id="hwBarBack" style="flex:none;min-height:42px;padding:6px 12px;border-radius:12px;border:2px solid #0A847E;background:#fff;color:#0A847E;font:inherit;font-weight:800;font-size:14px;cursor:pointer">Ödevlerim</button>`;
  document.getElementById("hwBarBack").onclick = () => { hwRunEnd(); showHwScreen(); }; }
function hideHwDone(){ const e = document.getElementById("hwDone"); if(e) e.remove(); }
/* Çalışma kaydedilince: ödevin durumu + Sıradaki ödev / Ödevlerime dön */
function showHwDone(){ if(!hwRun) return; const it = hwRun.items[hwRun.idx], player = famProfile(), lvl = famLvl(), n = hwRun.items.length; let title = "Kaydedildi", sub = "";
  if(it.kind === "expert"){ const st = hwStatus({ id: it.id, at: it.at || 0 }, player); title = st.k === "ok" ? "Ödev başarıyla yapıldı ✓" : "Ödev kaydedildi"; sub = `Durum: ${HW_ST[st.k][0]} · ${st.n} kez çalışıldı`; }
  else { const pl = devPlanGet(player, lvl); const item = ((pl && pl.items) || []).find(x => x.id === it.id) || it; const A = devAttempts(Object.assign({ at: it.at || 0 }, item), player); if(it.kind === "explore"){ if(A.n >= 1){ title = "Tanıma ödevi tamamlandı ✓"; sub = "Bu alan hakkında bilgi toplandı; sonraki ödevler buna göre hazırlanacak."; } else { title = "Kaydedildi"; sub = "Bu çalışma ödevle eşleşmedi; Ödevlerim ekranından yeniden açmayı deneyin."; } } else if(A.ok >= 2){ title = "Ödev tamamlandı ✓"; sub = "İki başarılı deneme yapıldı; yerine bir sonraki adım gelecek."; } else if(A.lastOutcome === "ok"){ title = "Güzel! Bir başarı daha kaldı"; sub = "Bir kez daha başarıyla yapınca ödev tamamlanır."; } else { title = "Ödev kaydedildi"; sub = "İki başarılı deneme gerekiyor; istersen tekrar deneyebilirsin."; } }
  hideHwDone(); const el = document.createElement("div"); el.id = "hwDone"; el.style.cssText = "position:fixed;inset:0;z-index:9000;background:rgba(15,40,40,.35);display:flex;align-items:flex-end;justify-content:center";
  const hasNext = hwRun.idx < n - 1; const done = title.includes("✓");
  el.innerHTML = `<div style="width:100%;max-width:560px;background:#fff;border-radius:24px 24px 0 0;padding:20px 18px calc(18px + var(--hb, 0px) + env(safe-area-inset-bottom,0px));box-shadow:0 -8px 30px rgba(0,0,0,.15)"><div style="display:flex;align-items:center;gap:10px">${icI(done ? "star" : "clip", 26, done ? "#1B7A3D" : "#0A847E")}<div style="font-weight:900;font-size:19px">${escHTML(title)}</div></div><div class="fam-sub" style="font-weight:600;margin:6px 0 14px">${escHTML(famLabel(it.id))} · ${escHTML(sub)}</div><div style="display:flex;flex-direction:column;gap:8px">${hasNext ? `<button type="button" class="fam-cta" id="hwDoneNext">Sıradaki ödev (${hwRun.idx + 2}/${n})</button>` : ""}<button type="button" class="fam-cta${hasNext ? " ghost" : ""}" id="hwDoneList">Ödevlerime dön</button><button type="button" id="hwDoneStay" style="min-height:42px;background:none;border:0;font:inherit;font-weight:800;color:#5B6B7A;cursor:pointer">Bu çalışmada kal</button></div></div>`;
  document.body.appendChild(el); const nx = document.getElementById("hwDoneNext"); if(nx) nx.onclick = () => { hideHwDone(); hwRunStep(1); };
  document.getElementById("hwDoneList").onclick = () => { hwRunEnd(); showHwScreen(); }; document.getElementById("hwDoneStay").onclick = () => hideHwDone(); }

/* ===== Cihazdaki çalışma kaydı: ödev durumu ve özet buluta bağlı kalmasın ===== */
const PERF_LOCAL_KEY = "wm_attempts_v1";
function perfLocalAll(){ try{ return JSON.parse(localStorage.getItem(PERF_LOCAL_KEY) || "[]"); }catch(e){ return []; } }
function perfLogLocal(rec){ try{ const a = perfLocalAll(); a.push(Object.assign({}, rec)); while(a.length > 400) a.shift(); localStorage.setItem(PERF_LOCAL_KEY, JSON.stringify(a)); }catch(e){} }
/* Buluta eski biçim: güvenlik kuralları yalnızca bu alanlara izin veriyor olabilir */
function perfCloudRec(r){ const o = {}; ["t","player","exerciseLabel","stageLabel","tier","itemCount","errors","ms"].forEach(k => { if(r[k] !== undefined) o[k] = r[k]; }); return o; }

/* Seçeneğin görünüş anahtarı: resimli seçeneklerde resim(ler), diğerlerinde boşluksuz kod */
function qzOptKey(o){ const s = String(o), src = (s.match(/src="([^"]+)"/g) || []).sort(); return src.length ? "img:" + src.join("|") : s.replace(/\s+/g, ""); }

/* ===== Geçmiş ödevler tablosu (son 30 gün) ===== */
const HW_HIST_ST = { done:["Tamamlandı ✓","#E3F6EA","#1B7A3D"], expired:["Yapılmadı","#EEF2F6","#5B6B7A"], eased:["Kolaylaştırıldı","#FFF6D6","#8A6400"], promoted:["Uzman ödevi","#D9F2EF","#0A847E"] };
function hwHistRows(plan, now){ return ((plan && plan.history) || []).filter(h => HW_HIST_ST[h.status] && (now - (h.doneAt || h.at)) < 30 * 864e5).sort((a, b) => (b.doneAt || b.at) - (a.doneAt || a.at)); }
function hwHistoryTable(plan, player, now, catName, dShort){ const rows = hwHistRows(plan, now); if(!rows.length) return "";
  const kindIc = (k) => k === "explore" ? "search" : k === "strong" ? "star" : "sprout";
  const errOf = (h) => { if(h.status !== "done") return ""; try{ const A = devAttempts(Object.assign({}, h), player, (h.doneAt || h.at) + 1); const nm = (player || "").trim().toLocaleLowerCase("tr"); const ex = exerciseById(h.id); const labels = ex ? [ex.label].concat(ex.oldLabels || []) : []; const last = perfRecords().filter(r => (r.player || "").trim().toLocaleLowerCase("tr") === nm && (r.exId === h.id || labels.includes(r.exerciseLabel)) && r.t >= h.at && r.t <= (h.doneAt || h.at) + 1).sort((a, b) => b.t - a.t)[0]; return last ? `${last.errors || 0} hata` : ""; }catch(e){ return ""; } };
  const tr = (h) => { const st = HW_HIST_ST[h.status], e = errOf(h); return `<tr><td style="padding:9px 6px;vertical-align:top"><div style="display:flex;align-items:flex-start;gap:5px;font-weight:800;line-height:1.25">${icI(kindIc(h.kind), 14, "#1B7A3D")}<span>${escHTML(famLabel(h.id))}</span></div><div style="font-size:12px;font-weight:600;color:#5B6B7A;margin-top:2px">${escHTML(dShort(h.doneAt || h.at))} · ${escHTML(catName(h.id))}</div></td><td style="padding:9px 4px 9px 6px;text-align:right;vertical-align:top;white-space:nowrap"><span style="display:inline-block;padding:4px 8px;border-radius:999px;font-weight:900;font-size:12px;background:${st[1]};color:${st[2]}">${st[0]}</span>${e ? `<div style="font-size:12px;font-weight:700;color:#5B6B7A;margin-top:3px">${e}</div>` : ""}</td></tr>`; };
  const head = `<thead><tr style="text-align:left;font-size:12px;color:#5B6B7A"><th style="padding:6px;font-weight:800">Ödev</th><th style="padding:6px 4px 6px 6px;font-weight:800;text-align:right">Sonuç</th></tr></thead>`;
  const table = (rs) => `<table style="width:100%;border-collapse:collapse;font-size:14px">${head}<tbody>${rs.map(tr).join("")}</tbody></table>`;
  const nDone = rows.filter(h => h.status === "done").length;
  let html = `<div style="display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:2px 10px;margin:14px 2px 6px"><div style="font-weight:900;font-size:16px;white-space:nowrap">Geçmiş ödevler</div><div class="fam-sub" style="font-weight:700;white-space:nowrap">Son 30 gün · ${nDone} tamamlandı</div></div><div class="fam-card hw-hist" style="padding:6px 8px">`;
  html += table(rows.slice(0, 8)).replace(/<tr>/g, '<tr style="border-top:1px solid #E6ECF2">').replace('<tr style="border-top:1px solid #E6ECF2" style="text-align:left', '<tr style="text-align:left');
  if(rows.length > 8) html += `<details style="margin-top:4px"><summary style="cursor:pointer;font-weight:800;color:#0A847E;padding:8px 6px">Tümünü göster (${rows.length})</summary>${table(rows.slice(8)).replace(/<thead>[\s\S]*?<\/thead>/, "").replace(/<tr>/g, '<tr style="border-top:1px solid #E6ECF2">')}</details>`;
  return html + `</div>`; }

/* Seçenek/resim ızgaralarında (wm-grid) eksik son satırı ortala: tahta her yeniden çizildiğinde */
function centerWmGrids(root){ (root || document).querySelectorAll(".wm-grid, .qz-txt-grid").forEach(g => { const items = [...g.children]; if(g.dataset.centered || items.length < 2) return; const m = /repeat\(\s*(\d+)/.exec(g.style.gridTemplateColumns || ""); const cs = getComputedStyle(g); if(cs.display !== "grid" && !m) return; const cols = m ? +m[1] : (cs.gridTemplateColumns || "").split(" ").filter(Boolean).length; if(!cols || items.length <= cols || items.length % cols === 0) return; const cell = items[0].getBoundingClientRect().width || parseFloat(items[0].style.width) || 0; const gap = parseFloat(cs.columnGap) || parseFloat(cs.gap) || 8; if(!cell) return; g.dataset.centered = "1"; items.forEach(it => { it.style.flex = `0 0 ${cell}px`; it.style.width = cell + "px"; }); g.style.display = "flex"; g.style.flexWrap = "wrap"; g.style.justifyContent = "center"; g.style.gap = (parseFloat(cs.rowGap) || gap) + "px " + gap + "px"; g.style.maxWidth = (cols * cell + (cols - 1) * gap + 1) + "px"; g.style.marginLeft = "auto"; g.style.marginRight = "auto"; }); }   /* seçenek/resim ızgaralarında eksik son satır ortada */
try{ const bd0 = document.getElementById("board"); if(bd0) new MutationObserver(() => { try{ centerWmGrids(bd0); }catch(e){} }).observe(bd0, { childList:true }); }catch(e){}

/* Dur İşareti düğmeleri: 2 → yan yana; 3–4 → ok tuşları düzeni (yukarı üstte, sol–aşağı–sağ altta) */
function stopButtonsHTML(){ const D = stopDirs(), b = (d) => `<button type="button" class="wm-btn diff stp-b" data-mtbtn="stop-${d}" aria-label="${{ l:"sol", r:"sağ", u:"yukarı", d:"aşağı" }[d]}" style="display:flex;align-items:center;justify-content:center">${stopArrowSVG(d, "#fff", 40)}</button>`;
  if(D.length === 2) return `<div class="wm-btns" style="margin:6px auto 0">${b("l")}${b("r")}</div>`;
  return `<div class="wm-btns" style="margin:6px auto 0;grid-template-columns:1fr 1fr 1fr;grid-template-areas:'. u .' 'l d r'">${D.map(d => b(d).replace('style="', `style="grid-area:${d};`)).join("")}</div>`; }

/* Sırayla Dokun: BAŞLA/BİTİŞ etiketi için boş yer (üst, alt, sağ, sol); yoksa null */
function trlTagSlot(P, i, node, W, H){ const p0 = P[i], tw = 64, th = 16, g = 2, hw = p0.w / 2, hh = node / 2; const free = (x1, y1, x2, y2) => x1 >= -2 && y1 >= -2 && x2 <= W + 2 && y2 <= H + 2 && !P.some((q, j) => j !== i && q.x + q.w / 2 > x1 && q.x - q.w / 2 < x2 && q.y + node / 2 > y1 && q.y - node / 2 < y2);
  const opts = [ [p0.x - tw / 2, p0.y - hh - th - g, p0.x + tw / 2, p0.y - hh - g, ""], [p0.x - tw / 2, p0.y + hh + g, p0.x + tw / 2, p0.y + hh + th + g, "top:auto;bottom:-15px;"], [p0.x + hw + g, p0.y - th / 2, p0.x + hw + g + tw, p0.y + th / 2, "top:50%;left:100%;transform:translate(3px,-50%);"], [p0.x - hw - g - tw, p0.y - th / 2, p0.x - hw - g, p0.y + th / 2, "top:50%;left:auto;right:100%;transform:translate(-3px,-50%);"] ];
  const ok = opts.find(o => free(o[0], o[1], o[2], o[3])); return ok ? ok[4] : null; }

function fluUnit(){ return currentExercise().id === "alt-uses" ? "fikir" : "kelime"; }   /* akıcılık sayacının birimi */

/* zihin-gorsel-3.js eski sürümdeyse yeni resimler yoktur: hata vermeden boş döner */
function g3img(k){ try{ return (typeof NEW_IMAGES_2 !== "undefined" && NEW_IMAGES_2[k]) || ""; }catch(e){ return ""; } }
/* zihin-gorsel-4.js (yürütücü işlev görselleri) eksikse hata vermeden boş döner */
function efImg(k){ try{ return (typeof EF_IMAGES !== "undefined" && EF_IMAGES[k]) || ""; }catch(e){ return ""; } }

/* Başka Ne İşe Yarar?: hedef fikir sayısı ve bağlam kısıtı (düzeye göre) */
function altGoal(){ return (isPre() ? [2, 3, 4] : [3, 5, 7])[Math.min(currentCombo().t, 2)]; }
function altCtx(){ const t = Math.min(currentCombo().t, 2); if(t === 0) return ""; const pool = t === 1 ? ["evde"] : (isPre() ? ["okulda", "parkta"] : ["kampta", "okulda", "parkta"]); const key = "alt-ctx|" + (isPre() ? "pre" : "post") + "|" + t; if(fluTarget[key + "@"] !== window.__navSerial || !pool.includes(fluTarget[key])){ fluTarget[key + "@"] = window.__navSerial; let v; do{ v = randomItem(pool); } while(pool.length > 1 && v === fluTarget[key]); fluTarget[key] = v; } return fluTarget[key]; }

/* Ana ekran çubuğu olan iOS cihazlar (çentikli iPhone, iPad): alt boşluk */
(function markHomeBar(){ try{ const ua = navigator.userAgent || "", big = Math.max(screen.width, screen.height); const iphoneX = /iPhone/.test(ua) && big >= 812; const ipad = /iPad/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); if(iphoneX || ipad) document.documentElement.classList.add("ios-hb"); }catch(e){} })();
/* Alt düğmeler (Önceki, Karıştır, Sonraki): hızlı dokunma — parmak biraz kaysa da basış sayılır, çift tetiklenmez */
(function initNavFastTap(){ const ids = ["prevBtn", "reshuffleBtn", "nextBtn"]; ids.forEach(id => { const el = document.getElementById(id); if(!el) return; let st = null;
  el.addEventListener("pointerdown", ev => { if(ev.pointerType === "mouse") return; st = { x: ev.clientX, y: ev.clientY, t: Date.now() }; }, { passive:true });
  el.addEventListener("pointercancel", () => { st = null; }, { passive:true });
  el.addEventListener("pointerup", ev => { if(!st || ev.pointerType === "mouse") return; const ok = Math.hypot(ev.clientX - st.x, ev.clientY - st.y) < 24 && Date.now() - st.t < 900; st = null; if(!ok || el.disabled) return; if(Date.now() - (el._navAt || 0) < 350) return; el._navAt = Date.now(); el._ftAt = Date.now(); el.click(); });
  el.addEventListener("click", ev => { if(ev.isTrusted && Date.now() - (el._ftAt || 0) < 700){ ev.stopImmediatePropagation(); ev.preventDefault(); return; } if(ev.isTrusted){ if(Date.now() - (el._navAt || 0) < 350){ ev.stopImmediatePropagation(); ev.preventDefault(); return; } el._navAt = Date.now(); } }, true); }); })();

function planThinkOn(){ try{ const ex = currentExercise(); const st = ex.stages && ex.stages[currentStageIndex]; return !!(st && st.think); }catch(e){ return false; } }   /* "Önce Planla" kilidi açık mı */

window.__zaReady = true;
/* açılış tamamlandı: dosyanın sonuna kadar hatasız çalıştı (boş ekran yardımı için) */
window.__zaBooted = true;
