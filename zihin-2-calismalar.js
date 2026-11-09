/* Zihin Atölyesi — zihin-2-calismalar.js (2/8): çalışma tanımları (EXERCISES). Dosyalar zihin-atolyesi.html'de bu sırayla yüklenir; sıra değiştirilemez (önceki tek dosyanın ardışık parçalarıdır). */
const EXERCISES = [
{
id: "shape-color",
readingLevel: ["pre","post"],
label: "Şekil - Renk",
attrs: ["shape","color"],
randomItem: () => {
const t = currentCombo().t;
return { shape: randomItem((isPre() ? PRE_SHAPES_BY_TIER : SHAPES_BY_TIER)[t]), color: randomItem((isPre() ? PRE_SHAPE_COLORS_BY_TIER : SHAPE_COLORS_BY_TIER)[t]) };
},
renderItem: (item) => shapeSVG(item.shape, item.color),
stages: [
{
label: "Aşama 1 · Ad",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Ben başla dediğimde, gördüğün her şeklin sadece adını olabildiğince hızlı söyle"</b> deyin.`,
example: (item) => `${SHAPE_NAMES[item.shape]}`
},
{
label: "Aşama 2 · Ad + Renk",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Ben başla dediğimde, gördüğün her şeklin rengini ve adını olabildiğince hızlı söyle"</b> deyin.`,
example: (item) => `${COLOR_NAMES[item.color]} ${SHAPE_NAMES[item.shape]}`
}
]
},
{
id: "number-color",
readingLevel: ["pre","post"],
label: "Sayı - Renk",
attrs: ["number","color"],
randomItem: () => {
const t = currentCombo().t;
return { number: randomItem((isPre() ? PRE_NUMBERS_BY_TIER : NUMBERS_BY_TIER)[t]), color: randomItem((isPre() ? PRE_NUMBER_COLORS_BY_TIER : COLORS_BY_TIER)[t]) };
},
renderItem: (item) => numberHTML(item.number, item.color),
stages: [
{
label: "Aşama 1 · Rakam",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Ben başla dediğimde, gördüğün her rakamı olabildiğince hızlı söyle"</b> deyin.`,
example: (item) => `${item.number}`
},
{
label: "Aşama 2 · Renk + Rakam",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Ben başla dediğimde, gördüğün her rakamın rengini ve rakamı olabildiğince hızlı söyle"</b> deyin.`,
example: (item) => `${COLOR_NAMES[item.color]} ${item.number}`
}
]
},
{
id: "object-name",
readingLevel: ["pre","post"],
label: "Nesne Adı",
attrs: ["object"],
randomItem: () => {
const tables = isPre() ? PRE_OBJECTS_BY_TIER : OBJECTS_BY_TIER;
const pool = tables[currentCombo().t] || tables[tables.length-1];
return { object: randomItem(pool) };
},
renderItem: (item) => `<img src="${WILD_IMAGES[item.object] || OBJECT_IMAGES[item.object]}" alt="" style="width:88%;height:88%;object-fit:contain;display:block;">`,
stages: [
{
label: "Aşama 1 · Ad",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Ben başla dediğimde, gördüğün her varlığın sadece adını olabildiğince hızlı söyle"</b> deyin.`,
example: (item) => `${OBJECT_NAMES[item.object]}`
},
{
label: "Aşama 2 · Ad + Grup",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Ben başla dediğimde, gördüğün her varlığın adını ve ait olduğu grubu (hayvan/giysi/yiyecek) olabildiğince hızlı söyle"</b> deyin.`,
example: (item) => `${OBJECT_NAMES[item.object]} ${OBJECT_CATEGORY[item.object]}`
}
]
},
{
id: "fruit-veg",
readingLevel: ["pre","post"],
label: "Meyve - Sebze",
attrs: ["name","size"],
randomItem: () => ({ name: randomItem(isPre() ? PRE_FRUITS_AND_VEGGIES : FRUITS_AND_VEGGIES), size: randomItem(["large","small"]) }),
renderItem: (item) => fruitVegSVG(item.name, currentStageIndex === 0 ? "large" : item.size),   /* Aşama 1'de boy sorulmaz: tüm resimler aynı boyda */
stages: [
{
label: "Aşama 1 · Meyve/Sebze",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Ben başla dediğimde, gördüğün her görselin meyve mi sebze mi olduğunu olabildiğince hızlı söyle"</b> deyin.`,
example: (item) => `${FRUIT_VEG_CATEGORY[item.name]}`
},
{
label: "Aşama 2 · Meyve/Sebze + Boy",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Ben başla dediğimde, gördüğün her görselin boyutunu ve meyve mi sebze mi olduğunu olabildiğince hızlı söyle"</b> deyin.`,
example: (item) => `${SIZE_LABELS[item.size]} ${FRUIT_VEG_CATEGORY[item.name]}`
}
]
},
{
id: "taste-name",
readingLevel: ["pre","post"],
label: "Tatlar",
attrs: ["item"],
beginGrid: () => { pickTastePool(); },
randomItem: () => {
if(!tasteActivePool || tasteActivePool.length !== Math.min(tasteWantedCount(), tasteAll().length)) pickTastePool();
return { item: randomItem(tasteActivePool) };
},
renderItem: (item) => `<img src="${TASTE_IMAGES[item.item]}" alt="" style="width:88%;height:88%;object-fit:contain;display:block;">`,
stages: [
{
label: "Aşama 1 · Tat",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Ben başla dediğimde, gördüğün her yiyeceğin sadece tadını (tatlı/ekşi/acı/tuzlu) olabildiğince hızlı söyle"</b> deyin.`,
example: (item) => `${TASTE_OF[item.item]}`
},
{
label: "Aşama 2 · Tat + Ad",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Ben başla dediğimde, gördüğün her yiyeceğin önce tadını, sonra adını olabildiğince hızlı söyle"</b> deyin.`,
example: (item) => `${TASTE_OF[item.item]} ${TASTE_NAMES[item.item]}`
}
]
},
{
id: "hot-cold",
readingLevel: ["pre","post"],
label: "Soğuk-Sıcak",
attrs: ["item"],
beginGrid: () => { pickHotColdPool(); },
randomItem: () => {
if(!hotColdPool || hotColdPool.length !== hotColdWantedCount()) pickHotColdPool();
return { item: randomItem(hotColdPool) };
},
renderItem: (item) => `<img src="${HOTCOLD_IMAGES[item.item]}" alt="" style="width:88%;height:88%;object-fit:contain;display:block;">`,
stages: [
{
label: "Aşama 1 · Soğuk / Sıcak",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Ben başla dediğimde, gördüğün her görselin soğuk mu sıcak mı olduğunu olabildiğince hızlı söyle"</b> deyin.`,
example: (item) => `${HOTCOLD_OF[item.item]}`
},
{
label: "Aşama 2 · Ad + Soğuk / Sıcak",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Ben başla dediğimde, gördüğün her görselin önce adını, sonra soğuk mu sıcak mı olduğunu olabildiğince hızlı söyle"</b> deyin.`,
example: (item) => `${HOTCOLD_NAMES[item.item]} ${HOTCOLD_OF[item.item]}`
}
]
},
{
id: "living-nonliving",
readingLevel: ["pre","post"],
label: "Canlı-Cansız",
attrs: ["item"],
beginGrid: () => { pickLivingPool(); },
randomItem: () => {
if(!livingPool || livingPool.length !== livingWantedCount()) pickLivingPool();
return { item: randomItem(livingPool) };
},
renderItem: (item) => `<img src="${LIVING_IMAGES[item.item]}" alt="" style="width:88%;height:88%;object-fit:contain;display:block;">`,
stages: [
{
label: "Aşama 1 · Canlı / Cansız",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Ben başla dediğimde, gördüğün her görselin canlı mı cansız mı olduğunu olabildiğince hızlı söyle"</b> deyin.`,
example: (item) => `${LIVING_OF[item.item]}`
},
{
label: "Aşama 2 · Ad + Canlı / Cansız",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Ben başla dediğimde, gördüğün her görselin önce adını, sonra canlı mı cansız mı olduğunu olabildiğince hızlı söyle"</b> deyin.`,
example: (item) => `${LIVING_NAMES[item.item]} ${LIVING_OF[item.item]}`
}
]
},
{
id: "choice-reaction",
readingLevel: ["pre","post"],
label: "Seçimli Tepki",
speedFactor: 2,
attrs: ["color"],
beginGrid: () => { pickCrtPool(); },
randomItem: () => {
if(!crtPool || crtPool.length !== crtWantedCount()) pickCrtPool();
return { color: randomItem(crtPool).color };
},
renderItem: (item) => `<svg viewBox="0 0 10 10" style="width:78%;height:78%;display:block;"><circle cx="5" cy="5" r="5" fill="${item.color}"/></svg>`,
stages: [
{
label: "Aşama 1 · Hareket",
instruction: () => `Öğrenci masada otursun. Renk-hareket eşleşmelerini birlikte birkaç kez deneyin (eşleşmeler her sayfada ve Karıştır'da değişir). Ardından <b>"Ben başla dediğimde, soldan sağa her rengi gördüğünde onun hareketini olabildiğince hızlı yap"</b> deyin.` + crtLegendHTML(),
example: () => ``
},
{
label: "Aşama 2 · Renk + Hareket",
instruction: () => `Öğrenci masada otursun. Renk-hareket eşleşmelerini birlikte birkaç kez deneyin (eşleşmeler her sayfada ve Karıştır'da değişir). Ardından <b>"Ben başla dediğimde, soldan sağa her rengin önce adını söyle, sonra hareketini yap; olabildiğince hızlı"</b> deyin.` + crtLegendHTML(),
example: (item) => `${crtMoveOf(item.color).name}`
}
]
},
{
id: "origin-order",
readingLevel: ["pre","post"],
label: "Oluş Sırası",
isSeqRows: true,
attrs: [],
osRows: () => makeOsRows(),
stages: [
{
label: "Göster",
instruction: () => `Öğrenciye görselleri tanıtın. Ardından <b>"Her satırın başındaki çerçeveli resimden başla. Sonra o satırda ondan sonra ne geldiğine, en son da ne geldiğine sırayla dokun. Örneğin yumurta → civciv → tavuk. Olabildiğince hızlı yap"</b> deyin. Yanlış gösterilen her görseli hata sayısına ekleyin.`,
example: () => ``
}
]
},
{
id: "symbol-image",
readingLevel: ["pre","post"],
label: "Şekil-Resim Eşleme",
speedFactor: 1.5,
isSdmt: true,
attrs: ["shape"],
beginGrid: () => { pickSdmtPool(); },
randomItem: () => {
if(!sdmtPool || sdmtPool.length !== sdmtWantedCount()) pickSdmtPool();
return { shape: randomItem(sdmtPool).shape };
},
renderItem: (item) => `<div style="width:66%;height:66%;display:flex;align-items:center;justify-content:center;">${sdmtShapeSVG(item.shape).replace('<svg ', '<svg style="width:100%;height:100%;display:block;" ')}</div>`,
stages: [
{
label: "Şekil → Resim",
instruction: () => `Sağ üstteki anahtarı öğrenciyle birlikte inceleyin: her şeklin altında eşi olan resim var. Ardından <b>"Ben başla dediğimde, soldan sağa her şekle bak ve eşi olan resmin adını olabildiğince hızlı söyle"</b> deyin. <i>Eşleşmeler her sayfada ve Karıştır'da değişir; önce anahtarı birlikte okuyun.</i>`,
example: (item) => `${sdmtPairOf(item.shape).name}`
}
]
},
/* (2026-11-08: Doğru-Yanlış Eşleşme çalışması kullanıcı isteğiyle silindi — Doğru Çiftleri Bul ile aynı içerikti) */ {
id: "search-object",
readingLevel: ["pre"],
label: "Simge Arama: Aynı Resmi Bul",
isSearch: true, attrs: [], speedFactor: 3,
isDone: () => !!searchState && searchState.answered >= currentGrid.length,
search: () => makeSearchRows(),
randomItem: () => ({}),
stages: [{ label: "Aynı Resmi Bul", instruction: () => `Önce <b>▶ Başlat</b>'a basın, sonra çocuk dokunsun. Çocuğa <b>"Her satırda soldaki çerçevede bir resim var. Sağdakiler arasından tıpatıp aynısını bul ve dokun; olabildiğince hızlı, yukarıdan aşağıya"</b> deyin. Zor düzeyde aynı nesnenin farklı renkleri de çıkar; çocuk rengi de kontrol etmelidir. ` + SEARCH_COMMON, example: () => `` }]
},
{
id: "search-shape",
readingLevel: ["pre"],
label: "Simge Arama: Aynı Şekli Bul",
isSearch: true, attrs: [], speedFactor: 3,
isDone: () => !!searchState && searchState.answered >= currentGrid.length,
search: () => makeSearchRows(),
randomItem: () => ({}),
stages: [{ label: "Aynı Şekli Bul", instruction: () => `Önce <b>▶ Başlat</b>'a basın, sonra çocuk dokunsun. Çocuğa <b>"Her satırda soldaki çerçevede bir şekil var. Sağdakiler arasından aynısını bul ve dokun; olabildiğince hızlı, yukarıdan aşağıya"</b> deyin. Zor düzeyde birbirine benzeyen şekiller çıkar (ör. 5 köşeli ve 6 köşeli yıldız). ` + SEARCH_COMMON, example: () => `` }]
},
{
id: "search-symbol",
readingLevel: ["post"],
label: "Simge Arama: Benzer Semboller",
isSearch: true, attrs: [], speedFactor: 2.5,
isDone: () => !!searchState && searchState.answered >= currentGrid.length,
search: () => makeSearchRows(),
randomItem: () => ({}),
stages: [{ label: "Benzer Semboller", instruction: () => `Önce <b>▶ Başlat</b>'a basın, sonra çocuk dokunsun. Çocuğa <b>"Her satırda soldaki çerçevedeki sembolün tıpatıp aynısını sağdakiler arasından bul ve dokun. Dikkat: içi dolu ile içi boş, düz ile ters olan farklıdır"</b> deyin. ` + SEARCH_COMMON, example: () => `` }]
},
{
id: "search-letter",
readingLevel: ["post"],
label: "Simge Arama: Harf Arama",
isSearch: true, attrs: [], speedFactor: 2.5,
isDone: () => !!searchState && searchState.answered >= currentGrid.length,
search: () => makeSearchRows(),
randomItem: () => ({}),
stages: [{ label: "Harf Arama", instruction: () => `Önce <b>▶ Başlat</b>'a basın, sonra çocuk dokunsun. Çocuğa <b>"Her satırda soldaki çerçevedeki harf, sağdaki dizide var mı? Varsa o harfe dokun, yoksa YOK'a dokun. Olabildiğince hızlı"</b> deyin. Satırların yaklaşık yarısında harf yoktur; Zor düzeyde birbirine benzeyen harfler (R–P–B, E–F) çıkar. ` + SEARCH_COMMON, example: () => `` }]
},
{
id: "number-find",
readingLevel: ["pre","post"],
label: "Sayı Bulma",
isScatter: true,
attrs: [],
scatterItems: () => {
const n = scatterCount();
return shuffleArray(Array.from({length:n}, (_,i)=>({ text:String(i+1) })));
},
renderItem: seqItemHTML,
stages: [
{
label: "Aşama 1 · Küçükten büyüğe",
instruction: () => `Öğrenciye sayfayı gösterin. Ardından <b>"Ben başla dediğimde, 1'den ${trNumSuffix(scatterCount(),"dat")} kadar sayıları sırayla parmağınla göster"</b> deyin.`,
example: () => ``
},
{
label: "Aşama 2 · Büyükten küçüğe",
instruction: () => `Öğrenciye sayfayı gösterin. Ardından <b>"Ben başla dediğimde, ${trNumSuffix(scatterCount(),"abl")} başlayarak 1'e kadar sayıları sırayla parmağınla göster"</b> deyin.`,
example: () => ``
}
]
},
{
id: "same-number",
readingLevel: ["pre","post"],
label: "Aynı Sayıyı Bul",
isMt: true, attrs: [], speedFactor: 1,
onShuffle: () => { snNewTarget(); },
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Biçimi Farklı, Sayı Aynı", instruction: () => ``, example: () => `` } ]
},
{
id: "flanker",
readingLevel: ["pre","post"],
label: "Ortadakini Söyle",
isFlanker: true,
attrs: [],
speedFactor: 1.5,
flankerGroups: () => makeFlankerGroups(),
stages: [
{
label: "Aşama 1 · Ortadaki Farklı",
instruction: () => isPre()
? `Öğrenciye resimleri tanıtın. Ardından <b>"Her çerçevede beş resim var. Ben başla dediğimde, çerçeveleri sırayla (soldan sağa, yukarıdan aşağıya) takip et ve her çerçevede sadece ORTADAKİ resmin adını olabildiğince hızlı söyle; kenardakilere aldırma"</b> deyin.`
: `Öğrenciye <b>"Her çerçevede beş rakam var. Ben başla dediğimde, çerçeveleri sırayla (soldan sağa, yukarıdan aşağıya) takip et ve her çerçevede sadece ORTADAKİ rakamı olabildiğince hızlı söyle; kenardakilere aldırma"</b> deyin.`,
example: (g) => isPre() ? FLK_NAMES[g.target] : g.target
},
{
label: "Aşama 2 · Karışık",
instruction: () => `Aynı kuralı verin ve ekleyin: <b>"Bazen beşi de aynı olabilir, bazen ortadaki farklı olabilir. Her seferinde yine sadece ORTADAKİNİ söyle"</b>. Uyumlu ve uyumsuz grupların karışması ketleme yükünü artırır.`,
example: (g) => isPre() ? FLK_NAMES[g.target] : g.target
}
]
},
{
id: "touch-animal",
readingLevel: ["pre","post"],
label: "Hayvan–Eşya: Dokun",
isTouch: true,
attrs: [],
makeGrid: (n) => makeTouchAnimalGrid(n),
randomItem: () => ({ kind:"animal", a:"lion", go:true }),
renderItem: (item) => item.kind === "animal"
? `<img src="${item.src || WILD_IMAGES[item.a] || (TA_ANIMALS[item.a] ? TA_ANIMALS[item.a]() : "")}" alt="" style="width:86%;height:86%;object-fit:contain;display:block;">`
: stopSignSVG(item.color),
stages: [
{
label: "Aşama 1 · Hayvanlara Dokun",
instruction: () => `Önce <b>▶ Başlat</b>'a basın, sonra çocuk ekrana dokunsun. Çocuğa <b>"Hayvan resimlerine olabildiğince hızlı dokun. AMA ${trUpper(cardName(taStopColor))} ${swatch(taStopColor)} DUR kartına dokunma${currentCombo().t > 0 ? "; başka renkteki DUR kartlarına dokunabilirsin" : ""}"</b> deyin. Dokunmaları uygulama sayar. <i>Dur rengi her sayfada ve Karıştır'da değişir.</i>`,
example: () => ``
},
{
label: "Aşama 2 · Eşyalara Dokun",
instruction: () => `Önce <b>▶ Başlat</b>'a basın, sonra çocuk ekrana dokunsun. Çocuğa <b>"Ekranda eşya resimleri ve DUR kartları var. Eşya resimlerine olabildiğince hızlı dokun. AMA ${trUpper(cardName(taStopColor))} ${swatch(taStopColor)} DUR kartına dokunma${currentCombo().t > 0 ? "; başka renkteki DUR kartlarına dokunabilirsin" : ""}"</b> deyin. Dokunmaları uygulama sayar.`,
example: () => ``
}
]
},
{
id: "touch-card",
readingLevel: ["pre","post"],
label: "Renkli Kart Seç",
isTouch: true,
attrs: [],
makeGrid: (n) => makeTouchCardGrid(n),
randomItem: () => ({ color:ACC.mavi, go:true }),
renderItem: (item) => plainCardSVG(item.color),
stages: [
{
label: "Hedef Renge Dokun",
instruction: () => `Önce <b>▶ Başlat</b>'a basın, sonra çocuk ekrana dokunsun. Çocuğa <b>"Sadece ${trUpper(cardName(tcTarget))} ${swatch(tcTarget)} kartlara olabildiğince hızlı dokun; diğer renklere dokunma"</b> deyin. Dokunmaları uygulama sayar. <i>Hedef renk her sayfada ve Karıştır'da değişir.</i>`,
example: () => ``
}
]
},
{
id: "sort-color-shape",
readingLevel: ["pre"],
label: "Kart Sıralama: Renk–Şekil",
isSort: true, attrs: [], speedFactor: 2,
sortDeck: () => makeSortDeck(),
randomItem: () => ({}),
stages: [{ label: "Renk – Şekil", instruction: () => sortInstruction(), example: () => `` }]
},
{
id: "sort-animal-size",
readingLevel: ["pre"],
label: "Kart Sıralama: Hayvan–Büyüklük",
isSort: true, attrs: [], speedFactor: 2,
sortDeck: () => makeSortDeck(),
randomItem: () => ({}),
stages: [{ label: "Hayvan – Büyüklük", instruction: () => sortInstruction(), example: () => `` }]
},
{
id: "sort-color-shape-count",
readingLevel: ["post"],
label: "Kart Sıralama: Renk–Şekil–Sayı",
isSort: true, attrs: [], speedFactor: 2,
sortDeck: () => makeSortDeck(),
randomItem: () => ({}),
stages: [{ label: "Renk – Şekil – Sayı", instruction: () => sortInstruction(), example: () => `` }]
},
{
id: "sort-words",
readingLevel: ["post"],
label: "Kart Sıralama: Kelime Kartları",
isSort: true, attrs: [], speedFactor: 2.5,
sortDeck: () => makeSortDeck(),
randomItem: () => ({}),
stages: [{ label: "Kategori – Hece – Renk", instruction: () => sortInstruction(), example: () => `` }]
},
{
id: "plan-swap",
readingLevel: ["pre"],
label: "Planlama: Renkli Küpleri Diz",
isPlan: true, attrs: [], speedFactor: 12,
isDone: () => !!planState && planState.done,
plan: () => makePlanProblems(),
randomItem: () => ({}),
stages: [{ label: "Küpleri Diz", instruction: () => `Önce <b>▶ Başlat</b>'a basın. Çocuğa üstteki <b>HEDEF</b> sırayı gösterin ve <b>"Önce düşün, sonra dokun. İki küpe sırayla dokunursan yer değiştirirler. Küpleri en az değiştirmeyle hedefteki sıraya getir"</b> deyin. ` + PLAN_COMMON, example: () => `` }]
},
{
id: "plan-beads",
readingLevel: ["pre"],
label: "Planlama: Boncukları Yer Değiştir",
isPlan: true, attrs: [], speedFactor: 15,
isDone: () => !!planState && planState.done,
plan: () => makePlanProblems(),
randomItem: () => ({}),
stages: [{ label: "Boncuklar", instruction: () => `Önce <b>▶ Başlat</b>'a basın. Çocuğa üstteki <b>HEDEF</b> modeli gösterin ve <b>"Önce düşün, sonra hareket ettir. Bir çubuğa dokun, en üstteki boncuk kalkar; sonra koymak istediğin çubuğa dokun. Boncukları tek tek taşıyarak hedefteki gibi yap"</b> deyin. ` + PLAN_COMMON, example: () => `` }]
},
{
id: "plan-tol",
readingLevel: ["post"],
label: "Planlama: Üç Bardak – Üç Pul",
isPlan: true, attrs: [], speedFactor: 15,
isDone: () => !!planState && planState.done,
plan: () => makePlanProblems(),
randomItem: () => ({}),
stages: [{ label: "Üç Bardak", instruction: () => `Önce <b>▶ Başlat</b>'a basın. <b>"Pulları hedefteki dizilime getir. Bir bardağa dokun, en üstteki pul kalkar; sonra koymak istediğin bardağa dokun. Bardaklar farklı sayıda pul alır: biri 3, biri 2, biri 1. Önce zihninde planla, en az hamleyle çöz"</b> deyin. ` + PLAN_COMMON, example: () => `` }]
},
{
id: "plan-cubes",
readingLevel: ["post"],
label: "Planlama: Kısıtlı Küp Taşıma",
isPlan: true, attrs: [], speedFactor: 18,
isDone: () => !!planState && planState.done,
plan: () => makePlanProblems(),
randomItem: () => ({}),
stages: [{ label: "Küp Taşıma", instruction: () => `Önce <b>▶ Başlat</b>'a basın. <b>"Her hamlede yalnızca bir küp taşıyabilirsin ve sadece en üstteki küpü alabilirsin. Küpleri hedef modeldeki gibi diz; önce zihninde planla, mümkün olan en az hamleyle çöz"</b> deyin. ` + PLAN_COMMON, example: () => `` }]
},
{
id: "cat-fruit",
readingLevel: ["pre","post"],
label: "Meyve–Sebze: Dokun",
isTouch: true, attrs: [],
makeGrid: (n) => makeCatTouchGrid(n),
randomItem: () => ({ go:true }),
renderItem: (item) => imgFill(item.src),
stages: [ { label: "Aşama 1 · Meyvelere Dokun", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Sebzelere Dokun", instruction: () => ``, example: () => `` } ]
},
{
id: "cat-living",
readingLevel: ["pre","post"],
label: "Kurala Göre Dokun",
isTouch: true, attrs: [],
makeGrid: (n) => makeCatTouchGrid(n),
randomItem: () => ({ go:true }),
renderItem: (item) => imgFill(item.src),
stages: [ { label: "Aşama 1 · Kurala Uyanlar", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Karşı Taraf", instruction: () => ``, example: () => `` } ]
},
{
id: "cat-cold",
readingLevel: ["pre","post"],
label: "Sıcak–Soğuk: Dokun",
isTouch: true, attrs: [],
makeGrid: (n) => makeCatTouchGrid(n),
randomItem: () => ({ go:true }),
renderItem: (item) => imgFill(item.src),
stages: [ { label: "Aşama 1 · Sıcaklara Dokun", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Soğuklara Dokun", instruction: () => ``, example: () => `` } ]
},
{
id: "trail-numbers",
readingLevel: ["pre","post"],
label: "Sayılara Sırayla Dokun",
isTrail: true, attrs: [], speedFactor: 1.5,
trail: () => makeTrail("numbers", stIx() === 1),
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · 1'den Sona", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Sondan 1'e", instruction: () => ``, example: () => `` } ]
},
{
id: "pairs-touch",
readingLevel: ["pre","post"],
label: "Doğru Çiftleri Bul",
isTouch: true, attrs: [], speedFactor: 1.5,
dims: () => (isPre() ? PAIR_DIMS_PRE : PAIR_DIMS_POST),
makeGrid: (n) => makePairGrid(n).map(it => Object.assign(it, { go: stIx() === 1 ? !it.ok : it.ok })),   /* Aşama 2: birlikte kullanılMAYAN çiftler hedef */
randomItem: () => ({ go:true }),
renderItem: (item) => `<div class="pair-cell"><img src="${PAIR_IMAGES[item.left]}" alt=""><img src="${PAIR_IMAGES[item.right]}" alt=""></div>`,
stages: [ { label: "Aşama 1 · Doğru Çiftler", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Yanlış Çiftler", instruction: () => ``, example: () => `` } ]
},
{
id: "sdmt-touch",
readingLevel: ["pre","post"],
label: "Şekil-Resim Eşleme (dokunmalı)",
isChoice: true, attrs: [], speedFactor: 2,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Eşini Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "quick-sort",
readingLevel: ["pre","post"],
label: "Hızlı Seç",
isChoice: true, attrs: [], speedFactor: 1.5,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Hızla Ayır", instruction: () => ``, example: () => `` } ]
},
{
id: "stroop-touch",
readingLevel: ["post"],
label: "Renk-Kelime Uyumsuzluğu (dokunmalı)",
isChoice: true, attrs: [], speedFactor: 2,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Yazının Rengi", instruction: () => ``, example: () => `` } ]
},
{
id: "day-night-touch",
readingLevel: ["pre"],
label: "Gece–Gündüz (dokunmalı)",
isChoice: true, attrs: [], speedFactor: 2,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Tersine Dokun", instruction: () => ``, example: () => `` } ]
},
{
id: "fish-flanker",
readingLevel: ["pre","post"],
label: "Ortadakinin Yönü",
isChoice: true, attrs: [], speedFactor: 1.5,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Ortadaki Canlı", instruction: () => ``, example: () => `` } ]
},
{
id: "face-go",
readingLevel: ["pre","post"],
label: "Yüzler Tek Tek",
isChoice: true, attrs: [], speedFactor: 2,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dur Yüzünde Bekle", instruction: () => ``, example: () => `` } ]
},
{
id: "switch-touch",
readingLevel: ["pre","post"],
label: "Ön mü, Arka mı?",
isChoice: true, attrs: [], speedFactor: 2,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Çerçeveye Göre Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "number-letter",
readingLevel: ["post"],
label: "İz Sürme: Sayı–Harf",
oldLabels: ["Sayı-Harf Bulma"],
isTrail: true, attrs: [], speedFactor: 2,
trail: () => makeTrail("number-letter"),
randomItem: () => ({}),
stages: [
{
label: "Aşama 1 · 1-A-2-B",
instruction: () => `Önce <b>▶ Başlat</b>'a basın, sonra çocuk ekrana dokunsun. Çocuğa <b>"BAŞLA yazan yerden başla; sayı ve harflere sırayla, dönüşümlü olarak dokun: ${trailExampleText(5)} … diye BİTİŞ'e kadar devam et"</b> deyin. Doğru dokunuşta çizgi çizilir, yanlışları uygulama sayar.`,
example: () => ``
},
{
label: "Aşama 2 · A-1-B-2",
instruction: () => `Önce <b>▶ Başlat</b>'a basın, sonra çocuk ekrana dokunsun. Çocuğa <b>"Ekranda karışık harfler ve sayılar var. Harften başla; harf ve sayılara sırayla, dönüşümlü olarak dokun: ${trailExampleText(5)} … diye BİTİŞ'e kadar devam et"</b> deyin. Doğru dokunuşta çizgi çizilir, yanlışları uygulama sayar.`,
example: () => ``
}
]
},
{
id: "trail-number-month",
readingLevel: ["post"],
label: "İz Sürme: Sayı–Ay",
isTrail: true, attrs: [], speedFactor: 2.5,
trail: () => makeTrail("number-month"),
randomItem: () => ({}),
stages: [
{
label: "Sayı – Ay",
instruction: () => `Önce <b>▶ Başlat</b>'a basın, sonra çocuk ekrana dokunsun. Çocuğa <b>"BAŞLA yazan yerden başla; sayılar ve aylar arasında sırayla geçerek dokun: ${trailExampleText(6)} … diye BİTİŞ'e kadar devam et"</b> deyin. Doğru dokunuşta çizgi çizilir, yanlışları uygulama sayar.`,
example: () => ``
}
]
},
{
id: "trail-animal-fruit",
readingLevel: ["pre"],
label: "İz Sürme: Hayvan–Meyve",
isTrail: true, attrs: [], speedFactor: 3,
trail: () => makeTrail("animal-fruit"),
randomItem: () => ({}),
stages: [
{
label: "Hayvan – Meyve",
instruction: () => `Önce <b>▶ Başlat</b>'a basın, sonra çocuk ekrana dokunsun. Üstteki <b>yol kartını</b> çocukla birlikte inceleyin: sıra bir hayvan, bir meyve şeklinde ilerliyor. Ardından <b>"BAŞLA yazan resimden başla, yol kartındaki sırayla resimlere dokun"</b> deyin. Sıradaki resim yol kartında turuncu çerçevelidir. <i>Sıra her sayfada ve Karıştır'da değişir.</i>`,
example: () => ``
}
]
},
{
id: "trail-color-shape",
readingLevel: ["pre"],
label: "İz Sürme: Renk–Şekil",
isTrail: true, attrs: [], speedFactor: 3,
trail: () => makeTrail("color-shape"),
randomItem: () => ({}),
stages: [
{
label: "Renk – Şekil",
instruction: () => `Önce <b>▶ Başlat</b>'a basın, sonra çocuk ekrana dokunsun. Üstteki <b>yol kartını</b> çocukla birlikte inceleyin: sıra bir renk (boya lekesi), bir şekil (siyah) şeklinde ilerliyor. Ardından <b>"BAŞLA yazan yerden başla, yol kartındaki sırayla dokun"</b> deyin. Sıradaki öge yol kartında turuncu çerçevelidir. <i>Sıra her sayfada ve Karıştır'da değişir.</i>`,
example: () => ``
}
]
},
{
id: "eye-horizontal",
readingLevel: ["pre","post"],
label: "Yatay",
isMotion: true,
motionPattern: "horizontal",
attrs: [],
stages: [
{
label: "Takip Et",
instruction: () => `Çocuğa <b>"Kafanı sabit tut, sadece gözünle hareket eden şekli takip et"</b> deyin. Şekil yatay eksende sağa ve sola hareket edecek.`,
example: () => ``
}
]
},
{
id: "eye-vertical",
readingLevel: ["pre","post"],
label: "Dikey",
isMotion: true,
motionPattern: "vertical",
attrs: [],
stages: [
{
label: "Takip Et",
instruction: () => `Çocuğa <b>"Kafanı sabit tut, sadece gözünle hareket eden şekli takip et"</b> deyin. Şekil dikey eksende yukarı ve aşağı hareket edecek.`,
example: () => ``
}
]
},
{
id: "eye-diagonal",
readingLevel: ["pre","post"],
label: "Çapraz 1",
isMotion: true,
motionPattern: "diagonal",
attrs: [],
stages: [
{
label: "Takip Et",
instruction: () => `Çocuğa <b>"Kafanı sabit tut, sadece gözünle hareket eden şekli takip et"</b> deyin. Şekil çapraz olarak sol üst köşeden sağ alt köşeye doğru hareket edecek.`,
example: () => ``
}
]
},
{
id: "eye-diagonal2",
readingLevel: ["pre","post"],
label: "Çapraz 2",
isMotion: true,
motionPattern: "diagonal2",
attrs: [],
stages: [
{
label: "Takip Et",
instruction: () => `Çocuğa <b>"Kafanı sabit tut, sadece gözünle hareket eden şekli takip et"</b> deyin. Şekil çapraz olarak sağ üst köşeden sol alt köşeye doğru hareket edecek.`,
example: () => ``
}
]
},
{
id: "eye-wave",
readingLevel: ["pre","post"],
label: "Dalga",
isMotion: true,
motionPattern: "wave",
minTier: 1,
waveAmpByTier: [0, 0.06, 0.14],
attrs: [],
stages: [
{
label: "Takip Et",
instruction: () => `Çocuğa <b>"Kafanı sabit tut, sadece gözünle hareket eden şekli takip et"</b> deyin. Şekil yatayda gidip gelirken hafifçe yukarı aşağı dalgalanacak.`,
example: () => ``
}
]
},
{
id: "eye-steep-wave",
readingLevel: ["pre","post"],
label: "Dik Dalga",
isMotion: true,
motionPattern: "steepWave",
minTier: 1,
waveAmpByTier: [0, 0.06, 0.14],
attrs: [],
stages: [
{
label: "Takip Et",
instruction: () => `Çocuğa <b>"Kafanı sabit tut, sadece gözünle hareket eden şekli takip et"</b> deyin. Şekil dikeyde gidip gelirken hafifçe sağa sola dalgalanacak.`,
example: () => ``
}
]
},
{
id: "eye-depth",
readingLevel: ["pre","post"],
label: "Derinlik",
isMotion: true,
motionPattern: "depth",
minTier: 1,
pulseByTier: [0, 0.15, 0.35],
attrs: [],
stages: [
{
label: "Takip Et",
instruction: () => `Çocuğa <b>"Kafanı sabit tut, gözünle şekli takip et"</b> deyin. Şekil yerinde büyüyüp küçülecek — sana yaklaşıp uzaklaşıyormuş gibi.`,
example: () => ``
}
]
},
{
id: "eye-square",
readingLevel: ["pre","post"],
label: "Kare",
isMotion: true,
motionPattern: "square",
pulseByTier: [0, 0.12, 0.28],
attrs: [],
stages: [
{
label: "Takip Et",
instruction: () => `Çocuğa <b>"Kafanı sabit tut, sadece gözünle hareket eden şekli takip et"</b> deyin. Şekil kare bir yörünge çizerek hareket edecek.`,
example: () => ``
}
]
},
{
id: "eye-triangle",
readingLevel: ["pre","post"],
label: "Üçgen",
isMotion: true,
motionPattern: "triangle",
pulseByTier: [0, 0.12, 0.28],
attrs: [],
stages: [
{
label: "Takip Et",
instruction: () => `Çocuğa <b>"Kafanı sabit tut, sadece gözünle hareket eden şekli takip et"</b> deyin. Şekil üçgen bir yörünge çizerek hareket edecek.`,
example: () => ``
}
]
},
{
id: "eye-star",
readingLevel: ["pre","post"],
label: "Yıldız",
isMotion: true,
motionPattern: "star",
minTier: 2,
pulseByTier: [0, 0.12, 0.28],
attrs: [],
stages: [
{
label: "Takip Et",
instruction: () => `Çocuğa <b>"Kafanı sabit tut, sadece gözünle hareket eden şekli takip et"</b> deyin. Şekil yıldız bir yörünge çizerek hareket edecek.`,
example: () => ``
}
]
},
{
id: "eye-saccade-two",
readingLevel: ["pre","post"],
label: "Sıçrama: İki Nokta",
isMotion: true, sacKind: "two",
statefulFn: (ms) => sacTwoPos(ms),
attrs: [],
stages: [{ label: "Sıçra ve Bak", instruction: () => ``, example: () => `` }]
},
{
id: "eye-saccade-random",
readingLevel: ["pre","post"],
label: "Sıçrama: Rastgele Nokta",
isMotion: true, sacKind: "random",
statefulFn: makeRandomSaccade(),
attrs: [],
stages: [{ label: "Sıçra ve Bak", instruction: () => ``, example: () => `` }]
},
{
id: "eye-saccade-reading",
readingLevel: ["pre","post"],
label: "Sıçrama: Satır Dönüşü",
isMotion: true, sacKind: "read",
statefulFn: (ms) => sacReadPos(ms),
attrs: [],
stages: [{ label: "Satır Satır Bak", instruction: () => ``, example: () => `` }]
},
{
id: "eye-junction",
readingLevel: ["pre","post"],
label: "Çapraz Kavşak",
isMotion: true,
statefulFn: makeJunctionWalker(),
minTier: 2,
pulseByTier: [0, 0, 0.3],
attrs: [],
stages: [
{
label: "Takip Et",
instruction: () => `Çocuğa <b>"Kafanı sabit tut, sadece gözünle hareket eden şekli takip et"</b> deyin. Şekil çapraz kavşaklardan geçerken beklenmedik şekilde yön değiştirecek — bu sayfa kestirilemez.`,
example: () => ``
}
]
},
{
id: "eye-crossbox",
readingLevel: ["pre","post"],
label: "Çarpılı Kutu",
isMotion: true,
statefulFn: makeCrossBoxWalker(),
minTier: 2,
pulseByTier: [0, 0, 0.3],
attrs: [],
stages: [
{
label: "Takip Et",
instruction: () => `Çocuğa <b>"Kafanı sabit tut, sadece gözünle hareket eden şekli takip et"</b> deyin. Şekil, kenarları hafif içe basık bir kutunun kenarları ile içindeki çapraz çizgiler arasında beklenmedik şekilde hareket edecek — bu sayfa kestirilemez.`,
example: () => ``
}
]
},

{
id: "stroop",
readingLevel: ["post"],
label: "Renk-Kelime Uyumsuzluğu",
attrs: ["word","inkColor"],
randomItem: () => {
const word = randomItem(Object.values(COLOR_NAMES));
let inkColor;
do{ inkColor = randomItem(COLORS); } while(COLOR_NAMES[inkColor] === word);
return { word, inkColor };
},
renderItem: (item) => `<div class="name-cell stroop-cell" style="color:${item.inkColor}; font-weight:900;">${trUpper(item.word)}</div>`,
stages: [
{
label: "Yazı Rengi",
instruction: () => `Öğrenciye görselleri tanıtın. <b>"Kelimeyi değil, yazının RENGİNİ olabildiğince hızlı söyle"</b> deyin. Örneğin "YEŞİL" yazısı mavi renkteyse "mavi" denmeli.`,
example: (item) => `${COLOR_NAMES[item.inkColor]}`
}
]
},
{
id: "day-night",
readingLevel: ["pre"],
label: "Gece–Gündüz",
attrs: [],
makeGrid: (n) => makeDayNightGrid(n),
randomItem: () => ({ k:"sun" }),
renderItem: (item) => `<img src="${DN_IMAGES[item.k]}" alt="" style="width:86%;height:86%;object-fit:contain;display:block;">`,
stages: [{ label: "Tersini Söyle", instruction: () => ``, example: (item) => item.k === "sun" ? "gece" : "gündüz" }]
},
{
id: "task-switch",
readingLevel: ["pre","post"],
label: "Kural Değişimi",
attrs: ["cell"],
makeGrid: (n) => makeVehicleSwitchGrid(n),
renderItem: (item) => `<img src="${VEHICLE_IMAGES[item.v + (item.back ? "_b" : "_f")]}" alt="" style="width:90%;height:90%;object-fit:contain;display:block;">`,
stages: [
{
label: "Ön / Arka Kuralı",
instruction: () => switchSide === "back"
? `Öğrenciye taşıtları önden ve arkadan tanıtın. Ardından <b>"Ben başla dediğimde, taşıtın ARKASINI görüyorsan 'arka' de, önünü görüyorsan taşıtın adını söyle"</b> deyin. Bu, dikkat kaydırma gerektirir. <i>Kural her sayfada ve Karıştır'da değişebilir.</i>`
: `Öğrenciye taşıtları önden ve arkadan tanıtın. Ardından <b>"Ben başla dediğimde, taşıtın ÖNÜNÜ görüyorsan 'ön' de, arkasını görüyorsan taşıtın adını söyle"</b> deyin. Bu, dikkat kaydırma gerektirir. <i>Kural her sayfada ve Karıştır'da değişebilir.</i>`,
example: (item) => item.target ? (switchSide === "back" ? `arka` : `ön`) : `${VEHICLE_NAMES[item.v]}`
}
]
},
{
id: "go-no-go",
readingLevel: ["pre","post"],
label: "Ket Vurma",
attrs: ["face"],
makeGrid: (n) => makeFaceGoGrid(n, pickGoNoGoStops()),
renderItem: (item) => `<img src="${FACE_IMAGES[item.face]}" alt="" style="width:90%;height:90%;object-fit:contain;display:block;border-radius:10px;">`,
stages: [
{
label: "Aşama 1 · Tek Dur Yüzü",
instruction: () => `Öğrenciye yüzleri tanıtın ve her birinin duygusunu birlikte söyleyin. Ardından <b>"Ben başla dediğimde, her yüzün duygusunu söyle. AMA ${stopFaceText()} yüz gelirse hiçbir şey söyleme, sessiz kal"</b> deyin. <i>Dur yüzü her sayfada ve Karıştır'da değişir.</i>`,
example: (item) => goNoGoStops.includes(item.face) ? `(sessiz kal)` : `${FACE_NAMES[item.face]}`
},
{
label: "Aşama 2 · İki Dur Yüzü",
instruction: () => `Kuralı zorlaştırın: <b>"Her yüzün duygusunu söyle. AMA ${stopFaceText()} yüz gelirse sessiz kal"</b> deyin. İki dur yüzünü aynı anda akılda tutmak ketleme yükünü artırır. <i>Dur yüzleri her sayfada ve Karıştır'da değişir.</i>`,
example: (item) => goNoGoStops.includes(item.face) ? `(sessiz kal)` : `${FACE_NAMES[item.face]}`
}
]
},

{
id: "nback-shape",
readingLevel: ["pre","post"],
label: "Hayvan N-Geri",
oldLabels: ["Şekil N-Geri"],
attrs: ["k"],
beginGrid: () => { pickNbPools(); },
randomItem: () => ({ k: randomItem(nbAnimalPool || NB_ANIMALS) }),
renderItem: (item) => imgTag(animalImg(item.k)),
stages: [
{ label: "Aşama 1 · 1-Geri", instruction: () => ``, example: (item) => `(bir önceki: ${ANIMAL_NAMES[item.k]})` },
{ label: "Aşama 2 · 2-Geri", instruction: () => ``, example: (item) => `(iki önceki: ${ANIMAL_NAMES[item.k]})` }
]
},
{
id: "nback-color",
readingLevel: ["pre","post"],
label: "Taşıt N-Geri",
oldLabels: ["Renk N-Geri"],
attrs: ["k"],
beginGrid: () => { pickNbPools(); },
randomItem: () => ({ k: randomItem(nbVehiclePool || NB_VEHICLES) }),
renderItem: (item) => imgTag(VEHICLE_IMAGES[item.k + "_f"]),
stages: [
{ label: "Aşama 1 · 1-Geri", instruction: () => ``, example: (item) => `(bir önceki: ${VEHICLE_NAMES[item.k]})` },
{ label: "Aşama 2 · 2-Geri", instruction: () => ``, example: (item) => `(iki önceki: ${VEHICLE_NAMES[item.k]})` }
]
},
{
id: "nback-number",
readingLevel: ["pre","post"],
label: "Sayı N-Geri",
attrs: ["number"],
randomItem: () => ({ number: randomInt(1, isPre() ? 5 : 9), color: randomItem(COLORS) }),
renderItem: (item) => numberHTML(item.number, item.color),
stages: [
{
label: "Aşama 1 · 1-Geri",
instruction: () => `Öğrenciye görselleri tanıtın. <b>"Her sayıda, BİR ÖNCEKİ gördüğün sayıyı söyle"</b> deyin.`,
example: (item) => `(bir önceki: ${item.number})`
},
{
label: "Aşama 2 · 2-Geri",
instruction: () => `Zorlaştırın: <b>"İKİ ÖNCEKİ gördüğün sayıyı söyle"</b> deyin.`,
example: (item) => `(iki önceki: ${item.number})`
}
]
},

{
id: "prospective-event",
readingLevel: ["pre","post"],
label: "İleriye Dönük Bellek (Olay)",
attrs: ["k"],
makeGrid: (n) => makePeObjGrid(n),
randomItem: () => ({ k: "umbrella_red" }),
renderItem: (item) => imgTag(SRH_IMAGES[item.k]),
stages: [
{ label: "Aşama 1 · Tek Tetikleyici", instruction: () => ``, example: (item) => peObjMatch(item) === 0 ? `(önce masaya vur) ${OBJ_NAMES[item.k]}` : `${OBJ_NAMES[item.k]}` },
{ label: "Aşama 2 · Çift Tetikleyici", instruction: () => ``, example: (item) => { const m = peObjMatch(item); return m === 0 ? `(masaya vur) ${OBJ_NAMES[item.k]}` : m === 1 ? `(alkış yap) ${OBJ_NAMES[item.k]}` : `${OBJ_NAMES[item.k]}`; } }
]
},
{
id: "prospective-time",
readingLevel: ["pre","post"],
label: "İleriye Dönük Bellek (Zaman)",
attrs: ["k"],
beginGrid: () => { pickPtTimes(); pickSeaPool(); },     // değişken hedef: zaman noktası her sayfada / Karıştır'da değişir
randomItem: () => ({ k: randomItem(seaPool || SEA_KEYS) }),
renderItem: (item) => imgTag(SEA_IMAGES[item.k]),
stages: [
{ label: "Aşama 1 · Tek Zaman Noktası", instruction: () => ``, example: (item) => `${SEA_NAMES[item.k]}` },
{ label: "Aşama 2 · İki Zaman Noktası", instruction: () => ``, example: (item) => `${SEA_NAMES[item.k]}` }
]
},
{
id: "prospective-delayed",
readingLevel: ["pre","post"],
label: "Ertelenmiş Görev Hatırlama",
attrs: ["k"],
beginGrid: () => { pickPdTask(); pickToyPool(); },      // değişken hedef: hatırlanacak görev her sayfada / Karıştır'da değişir
randomItem: () => ({ k: randomItem(toyPool || TOY_KEYS) }),
renderItem: (item) => imgTag(TOY_IMAGES[item.k]),
stages: [
{ label: "Aşama 1 · Basit Görev", instruction: () => ``, example: (item) => `${TOY_NAMES[item.k]}` },
{ label: "Aşama 2 · Farklı Görev", instruction: () => ``, example: (item) => `${TOY_NAMES[item.k]}` }
]
},

{
id: "visual-opposites",
readingLevel: ["pre","post"],
label: "Görsel Zıt Kavramlar",
attrs: ["type","state"],
randomItem: () => {
const type = randomItem(isPre() ? ["length","fill"] : ["length","position","fill","vertical"]);
const state = randomItem(OPPOSITE_STATES[type]);
return { type, state, color: randomItem(COLORS) };
},
renderItem: (item) => oppositeSVG(item.type, item.state, item.color),
stages: [
{
label: "Aşama 1 · Durumu Söyle",
instruction: () => `Öğrenciye görselleri tanıtın. <b>"Gördüğün durumu söyle"</b> deyin (uzun/kısa, içinde/dışında, dolu/boş, üstünde/altında gibi).`,
example: (item) => `${OPPOSITE_LABELS[item.state]}`
},
{
label: "Aşama 2 · Durum + Zıttı",
instruction: () => `Aynı kuralla, çocuktan hem durumu hem de <b>ZITTINI</b> söylemesini isteyin (örn. "uzun — kısa değil").`,
example: (item) => `${OPPOSITE_LABELS[item.state]} — ${OPPOSITE_OF[item.state]} değil`
}
]
},

{
id: "word-group",
readingLevel: ["post"],
label: "Kelime Gruplama",
attrs: ["word"],
randomItem: () => {
const cats = WG_TIERS[currentCombo().t] || WG_TIERS[0];
const cat = randomItem(cats);
const word = randomItem(CATEGORY_WORDS[cat]);
return { word, cat };
},
renderItem: (item) => `<div class="name-cell">${item.word}</div>`,
stages: [
{
label: "Aşama 1 · Kategori",
instruction: () => `Öğrenciye görselleri tanıtın. <b>"Her kelimenin hangi kategoriye ait olduğunu söyle (meyve mi, hayvan mı, taşıt mı)"</b> deyin.`,
example: (item) => `${item.cat}`
},
{
label: "Aşama 2 · Kategori + Örnek",
instruction: () => `Kategoriyi söyledikten sonra o kategoriden <b>BAŞKA bir örnek</b> daha versin (örneğin "meyve... çilek" gibi).`,
example: (item) => `${item.cat}`
}
]
},
{
id: "syllable-count",
readingLevel: ["post"],
label: "Hece Sayma",
attrs: ["word"],
randomItem: () => (sylWordCycle || (sylWordCycle = mkCycle(SYLLABLE_WORDS)))(),
renderItem: (item) => `<div class="name-cell">${item.word}</div>`,
stages: [
{
label: "Aşama 1 · Hece Sayısı",
instruction: () => `Öğrenciye görselleri tanıtın. <b>"Kelimenin kaç heceli olduğunu söyle"</b> deyin.`,
example: (item) => `${item.syl} hece`
},
{
label: "Aşama 2 · Heceleyerek Söyle",
instruction: () => `Kelimeyi hecelerine ayırarak (el-ma gibi) <b>yüksek sesle söylesin</b>, sonra kaç hece olduğunu belirtsin.`,
example: (item) => `${item.syl} hece`
}
]
},
{
id: "opposite-match",
readingLevel: ["post"],
label: "Zıt Anlam",
attrs: ["word"],
randomItem: () => randomItem(ANTONYM_PAIRS),
renderItem: (item) => `<div class="name-cell">${item.word}</div>`,
stages: [
{
label: "Zıt Anlamı",
instruction: () => `Öğrenciye görselleri tanıtın. <b>"Kelimenin zıt anlamını söyle"</b> deyin.`,
example: (item) => `${item.opp}`
}
]
},

{
id: "similarities",
readingLevel: ["pre","post"],
label: "Benzerlik Bulma",
attrs: ["a"],
randomItem: () => randomItem((isPre() ? [SIM_PRE0, SIM_PRE1, SIM_PRE2] : [SIMILARITY_PAIRS, SIM_FUNC, SIM_ABSTRACT])[currentCombo().t] || SIMILARITY_PAIRS),
renderItem: (item) => `<div class="name-cell phrase-cell">${item.a} - ${item.b}</div>`,
stages: [
{
label: "Aşama 1 · Ortak Yön",
instruction: () => `Öğrenciye görselleri tanıtın. <b>"İki kelimenin ORTAK yönünü söyle"</b> deyin.`,
example: (item) => `${item.hint}`
},
{
label: "Aşama 2 · Örnek Ekle",
instruction: () => `Ortak yönü söyledikten sonra, <b>aynı gruba bir örnek daha</b> eklesin.`,
example: (item) => `${item.hint}`
}
]
},
{
id: "vocabulary",
readingLevel: ["pre","post"],
label: "Kelime Tanımlama",
attrs: ["word"],
randomItem: () => randomItem((isPre() ? [VOCAB_PRE0, VOCAB_PRE1, VOCAB_PRE2] : [VOCAB_CONCRETE, VOCAB_WORDS.concat(VOCAB_ACTION), VOCAB_ABSTRACT])[currentCombo().t] || VOCAB_WORDS),
renderItem: (item) => `<div class="name-cell">${item.word}</div>`,
stages: [
{
label: "Aşama 1 · Tanımla",
instruction: () => `Öğrenciye görselleri tanıtın. <b>"Kelimenin ne anlama geldiğini kendi cümlelerinle anlat"</b> deyin.`,
example: (item) => `${item.def}`
},
{
label: "Aşama 2 · Cümlede Kullan",
instruction: () => `Tanımladıktan sonra kelimeyi <b>bir cümlede</b> kullansın.`,
example: (item) => `${item.def}`
}
]
},
{
id: "practical-reasoning",
readingLevel: ["pre","post"],
label: "Genel Kavrama",
attrs: ["q"],
randomItem: () => randomItem((isPre() ? [COMP_PRE0, COMP_PRE1, COMP_PRE2] : [COMPREHENSION_QS, COMP_WHY, COMP_IF])[currentCombo().t] || COMPREHENSION_QS),
renderItem: (item) => `<div class="name-cell phrase-cell">${item.q}</div>`,
stages: [
{
label: "Aşama 1 · Yanıtla",
instruction: () => `Soruyu öğrenciye okuyun, <b>kendi cümleleriyle</b> yanıtlamasını isteyin.`,
example: (item) => `${item.hint}`
},
{
label: "Aşama 2 · Nedenini Ekle",
instruction: () => `Yanıtladıktan sonra <b>NEDEN</b> öyle düşündüğünü de eklesin.`,
example: (item) => `${item.hint}`
}
]
},

{
id: "odd-one-out",
dims: () => ROW_GROUP_DIMS(),
readingLevel: ["pre","post"],
label: "Farklı Olanı Bul",
attrs: ["dimension"],
randomItem: () => {
const dimension = randomItem(["shape","color"]);
const oddIndex = randomInt(0,2);
let items;
if(dimension === "shape"){
const sameShape = randomItem(SHAPES);
let oddShape; do{ oddShape = randomItem(SHAPES); } while(oddShape === sameShape);
const c0 = randomItem(COLORS); items = [0,1,2].map(i => ({ shape: i===oddIndex ? oddShape : sameShape, color: c0 }));
} else {
const sameColor = randomItem(COLORS);
let oddColor; do{ oddColor = randomItem(COLORS); } while(oddColor === sameColor);
const s0 = randomItem(SHAPES); items = [0,1,2].map(i => ({ shape: s0, color: i===oddIndex ? oddColor : sameColor }));   /* KURAL: farklı olan tek bir özellikte ayrılır; diğer özellik herkeste aynı (iki ayrı "farklı" çıkmaz) */
}
return { items, dimension, oddIndex };
},
renderItem: (item) => tripleShapeHTML(item.items),
stages: [
{
label: "Aşama 1 · Farklıyı Bul",
instruction: () => `Öğrenciye görselleri tanıtın. <b>3 şekilden hangisinin FARKLI olduğunu (1, 2 veya 3.)</b> söylesin.`,
example: (item) => `${item.oddIndex+1}. şekil farklı`
},
{
label: "Aşama 2 · Nedenini Söyle",
instruction: () => `Farklı olanı söyledikten sonra <b>NEDEN farklı olduğunu</b> da eklesin (rengi mi, şekli mi?).`,
example: (item) => `${item.oddIndex+1}. şekil farklı (${item.dimension === "shape" ? "şekli" : "rengi"} farklı)`
}
]
},
{
id: "sequence-pattern",
dims: () => ROW_GROUP_DIMS(),
readingLevel: ["pre","post"],
label: "Örüntü Tamamlama",
attrs: ["answer"],
randomItem: () => {
const colorA = randomItem(COLORS);
let colorB; do{ colorB = randomItem(COLORS); } while(colorB === colorA);
if(stIx() === 0){
return { sequence:[colorA,colorB,colorA,colorB], answer: colorA };
}
let colorC; do{ colorC = randomItem(COLORS); } while(colorC === colorA || colorC === colorB);
return { sequence:[colorA,colorB,colorC,colorA,colorB], answer: colorC };
},
renderItem: (item) => sequenceHTML(item.sequence),
stages: [
{
label: "Aşama 1 · İkili Örüntü",
instruction: () => `Öğrenciye görselleri tanıtın. <b>"? yerine hangi renk gelir, söyle"</b> deyin.`,
example: (item) => `${COLOR_NAMES[item.answer]}`
},
{
label: "Aşama 2 · Üçlü Örüntü",
instruction: () => `Zorlaştırın: örüntü artık <b>3 renkten</b> oluşuyor.`,
example: (item) => `${COLOR_NAMES[item.answer]}`
}
]
},
{
id: "visual-analogy",
dims: () => ROW_GROUP_DIMS(),
readingLevel: ["pre","post"],
label: "Görsel Analoji",
attrs: ["shape1"],
randomItem: () => {
const shape1 = randomItem(SHAPES);
let shape2; do{ shape2 = randomItem(SHAPES); } while(shape2 === shape1);
const colorA = randomItem(COLORS);
let colorB; do{ colorB = randomItem(COLORS); } while(colorB === colorA);
return { shape1, shape2, colorA, colorB };
},
renderItem: (item) => analogyHTML({shape:item.shape1,color:item.colorA}, {shape:item.shape1,color:item.colorB}, {shape:item.shape2,color:item.colorA}),
stages: [
{
label: "Aşama 1 · Rengi Bul",
instruction: () => `Öğrenciye görselleri tanıtın. <b>Örüntüye göre SORU İŞARETİ yerine hangi rengin geleceğini</b> söylesin.`,
example: (item) => `${COLOR_NAMES[item.colorB]}`
},
{
label: "Aşama 2 · Tam Tarif Et",
instruction: () => `Çocuk sadece rengi değil, <b>tam olarak ne göreceğini</b> tarif etsin (şekil + renk).`,
example: (item) => `${SHAPE_NAMES[item.shape2]} - ${COLOR_NAMES[item.colorB]}`
}
]
},

{
id: "size-sort",
readingLevel: ["pre","post"],
label: "Boyut Sıralama",
attrs: ["size"],
randomItem: () => ({ size: randomItem(isPre() ? ["small","large"] : ["small","medium","large"]), color: randomItem(COLORS) }),
renderItem: (item) => sizedCircleHTML(item.size, item.color),
stages: [
{
label: "Boyut",
instruction: () => `Öğrenciye görselleri tanıtın. <b>"Her dairenin küçük mü, orta mı, büyük mü olduğunu söyle"</b> deyin.`,
example: (item) => `${SIZE_LABELS[item.size]}`
}
]
},
{
id: "arrow-direction",
readingLevel: ["pre","post"],
label: "Yön Bulma",
attrs: ["direction"],
randomItem: () => {
const pools = [
["up","down"],
["up","down","right"],
["up","down","right","left"]
];
const pool = pools[stIx()] || pools[pools.length-1];
return { direction: randomItem(pool), color: randomItem(COLORS) };
},
renderItem: (item) => arrowSVG(item.direction, item.color),
stages: [
{
label: "Aşama 1 · Yukarı-Aşağı",
instruction: () => `Öğrenciye görselleri tanıtın. <b>"Okun yukarı mı aşağı mı baktığını söyle"</b> deyin.`,
example: (item) => ({up:"yukarı",down:"aşağı",left:"sol",right:"sağ"})[item.direction]
},
{
label: "Aşama 2 · +Sağ",
instruction: () => `Sağ yön de eklendi. <b>"Okun yukarı, aşağı veya sağa mı baktığını söyle"</b> deyin.`,
example: (item) => ({up:"yukarı",down:"aşağı",left:"sol",right:"sağ"})[item.direction]
},
{
label: "Aşama 3 · +Sol",
instruction: () => `Sol yön de eklendi. <b>"Okun hangi yöne baktığını söyle (yukarı, aşağı, sağ, sol)"</b> deyin.`,
example: (item) => ({up:"yukarı",down:"aşağı",left:"sol",right:"sağ"})[item.direction]
}
]
},
{
id: "edge-count",
readingLevel: ["pre","post"],
label: "Kenar Sayma",
attrs: ["sides"],
randomItem: () => ({ sides: randomItem(isPre() ? [3,4] : [3,4,5,6]), color: randomItem(COLORS) }),
renderItem: (item) => polygonSVG(item.sides, item.color),
stages: [
{
label: "Kenar Sayısı",
instruction: () => `Öğrenciye görselleri tanıtın. <b>"Şeklin kaç kenarı olduğunu söyle"</b> deyin.`,
example: (item) => `${item.sides} kenar`
}
]
},

{
id: "word-list-recall",
readingLevel: ["post"],
label: "Kelime Listesi Hatırlama",
isRecall: true,
attrs: ["word"],
randomItem: () => ({ word: randomItem(WORD_POOL) }), uniqueFrom: () => WORD_POOL, itemFrom: (w) => ({ word: w }),
renderItem: (item) => `<div class="name-cell">${item.word}</div>`,
stages: [
{
label: "Aşama 1 · Kelimeleri İncele",
instruction: () => `Bu kelimeleri birlikte okuyun. Süre dolunca kelimeler kapanacak — çocuktan <b>hatırladığı kadarını söylemesini</b> isteyin, doğru sayısını girin.`,
example: () => ``
},
{
label: "Aşama 2 · Sırayla Hatırlama",
instruction: () => `Aynı şekilde inceleyin, ama bu sefer çocuktan kelimeleri <b>gördüğü sırayla</b> hatırlamasını isteyin.`,
example: () => ``
},
{
label: "Aşama 3 · Dinleyerek",
listen: true,
instruction: () => `Kelimeler gösterilmez; Başlat'a basınca uygulama okur.`,
example: () => ``
}
]
},
{
id: "word-repeat",
readingLevel: ["pre","post"],
label: "Kelime Tekrarı",
isAuditory: true,
attrs: [],
audTrials: () => makeAudTrials("plain"),
stages: [
{
label: "Aşama 1 · Hemen Tekrar",
answerMode: "same",
instruction: () => `Kelimeleri <b>çocuğa göstermeden</b> sesli okuyun. Ardından <b>"Söylediğim ${audLen()} kelimeyi aynı sırayla tekrar et"</b> deyin.`,
example: () => ``
},
{
label: "Aşama 2 · 4 Saniye Sonra",
answerMode: "same",
delay: true,
instruction: () => `Kelimeleri <b>çocuğa göstermeden</b> sesli okuyun ve <b>"Ben söyle dediğimde, bu ${audLen()} kelimeyi aynı sırayla söyle"</b> deyin. ⏱ düğmesine basın; 4 saniye sonra "Söyle!" deyin.`,
example: () => ``
}
]
},
{
id: "word-order",
readingLevel: ["pre","post"],
label: "Kelime Sıralama",
isAuditory: true,
attrs: [],
audTrials: () => makeAudTrials(stIx() === 2 ? "size" : "plain"),
stages: [
{
label: "Aşama 1 · Aynı Sırayla",
answerMode: "same",
instruction: () => ``,
example: () => ``
},
{
label: "Aşama 2 · Tersten",
answerMode: "reverse",
instruction: () => `Kelimeleri <b>çocuğa göstermeden</b> sesli okuyun. Ardından <b>"Söylediğim ${audLen()} kelimeyi sondan başa, tersten söyle"</b> deyin.`,
example: () => ``
},
{
label: "Aşama 3 · Küçükten Büyüğe",
answerMode: "size",
instruction: () => `Hayvan adlarını <b>çocuğa göstermeden</b> sesli okuyun. Ardından <b>"Söylediğim ${audLen()} hayvanı en küçükten en büyüğe doğru sıralayarak söyle"</b> deyin.`,
example: () => ``
}
]
},
{
id: "wm-same",
readingLevel: ["pre","post"],
label: "Aynı mı?",
isWm: true, attrs: [], speedFactor: 2.5,
isDone: () => !!wmState && wmState.phase === "done",
wm: () => wmBuild(),
randomItem: () => ({}),
stages: [
{ label: "Aşama 1 · 1-Geri", instruction: () => ``, example: () => `` },
{ label: "Aşama 2 · 2-Geri", instruction: () => ``, example: () => `` }
]
},
{
id: "wm-seq",
readingLevel: ["pre","post"],
label: "Sırayı Hatırla",
isWm: true, attrs: [], speedFactor: 8,
isDone: () => !!wmState && wmState.phase === "done",
wm: () => wmBuild(),
randomItem: () => ({}),
stages: [
{ label: "Aşama 1 · Aynı Sırayla", instruction: () => ``, example: () => `` },
{ label: "Aşama 2 · Tersten", instruction: () => ``, example: () => `` }
]
},
{
id: "wm-where",
readingLevel: ["pre","post"],
label: "Nerede Saklandı?",
isWm: true, attrs: [], speedFactor: 15,
isDone: () => !!wmState && wmState.phase === "done",
wm: () => wmBuild(),
randomItem: () => ({}),
stages: [ { label: "Nerede Saklandı?", instruction: () => ``, example: () => `` } ]
},
{
id: "corsi",
readingLevel: ["pre","post"],
label: "Corsi Blokları",
isMt: true, attrs: [], speedFactor: 21,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · İleri", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Geri", instruction: () => ``, example: () => `` } ]
},
{
id: "corsi-verbal",
readingLevel: ["pre","post"],
label: "Corsi Blokları (uzmanla)",
isMt: true, attrs: [], speedFactor: 16.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · İleri", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Geri", instruction: () => ``, example: () => `` } ]
},
{
id: "span-listen",
readingLevel: ["pre","post"],
label: "Dinleme Aralığı",
isAuditory: true, attrs: [], errorLabel: "Hatalı set sayısı",
audTrials: () => makeSpanSets(isPre() ? SPAN_COUNT_PRE[Math.min(currentCombo().t, 2)] : 3),
audRender: (sets) => renderSpanList(sets, false),
randomItem: () => ({}),
stages: [ { label: "Cümle + Nesne", instruction: () => ``, example: () => `` } ]
},
{
id: "span-read",
readingLevel: ["post"],
label: "Okuma Aralığı",
isAuditory: true, attrs: [], errorLabel: "Hatalı set sayısı",
audTrials: () => makeSpanSets(3),
audRender: (sets) => renderSpanList(sets, true),
randomItem: () => ({}),
stages: [ { label: "Oku + Hatırla", instruction: () => ``, example: () => `` } ]
},
{
id: "span-touch",
readingLevel: ["pre","post"],
label: "Resimli Dinleme Aralığı",
isMt: true, attrs: [], speedFactor: 17,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Doğru mu? + Sırayla Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "lns",
readingLevel: ["post"],
label: "Harf-Sayı Sıralama",
isAuditory: true, attrs: [],
audTrials: () => Array.from({length:5}, () => ({ words: makeLnsSeq(lnsLen()), ranks: [] })),
audRender: (trials) => `<div class="aud-list"><div class="aud-note">Her diziyi saniyede bir öğe hızında okuyun; çocuk istenen sırayla söylesin. Yanlış söylenen dizileri hata sayısına ekleyin.</div>` +
trials.map((tr, i) => `<div class="aud-row"><div class="aud-num">${i + 1}</div><div class="aud-body"><div class="aud-words">${tr.words.join(" – ")}</div><div class="aud-key">Doğru cevap: <b>${lnsAnswer(tr.words, currentStageIndex === 1).join(" – ")}</b></div></div></div>`).join("") + `</div>`,
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Önce Sayılar, Sonra Harfler", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Sıralı (1-2-3, A-B-C)", instruction: () => ``, example: () => `` } ]
},
{
id: "lns-touch",
readingLevel: ["post"],
label: "Harf-Sayı Sıralama (dokunmalı)",
isMt: true, attrs: [], speedFactor: 13.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Önce Sayılar, Sonra Harfler", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Sıralı (1-2-3, A-B-C)", instruction: () => ``, example: () => `` } ]
},
{
id: "animal-fruit",
readingLevel: ["pre"],
label: "Hayvan-Meyve Sıralama",
isMt: true, attrs: [], speedFactor: 9,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Önce Hayvanlar, Sonra Meyveler", instruction: () => ``, example: () => `` } ]
},
{
id: "running",
readingLevel: ["pre","post"],
label: "Sondakileri Hatırla",
isMt: true, attrs: [], speedFactor: 13.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Son Resimler", instruction: () => ``, example: () => `` } ]
},
{
id: "running-verbal",
readingLevel: ["pre","post"],
label: "Sondakileri Hatırla (sözlü)",
isAuditory: true, attrs: [],
audTrials: () => Array.from({length: isPre() ? 3 : 5}, () => ({ words: makeRunStream().map(x => x.n), ranks: [] })),
audRender: (trials) => `<div class="aud-list"><div class="aud-note">Kelimeleri saniyede bir okuyun; kaç kelime olacağını söylemeyin. Bitince çocuk <b>son ${runLast()}</b> kelimeyi sırayla söylesin. Yanlış dizileri hata sayısına ekleyin.</div>` +
trials.map((tr, i) => `<div class="aud-row"><div class="aud-num">${i + 1}</div><div class="aud-body"><div class="aud-words">${tr.words.join(" – ")}</div><div class="aud-key">Doğru cevap: <b>${tr.words.slice(-runLast()).join(" – ")}</b></div></div></div>`).join("") + `</div>`,
randomItem: () => ({}),
stages: [ { label: "Son Kelimeler", instruction: () => ``, example: () => `` } ]
},
{
id: "zihni",
readingLevel: ["pre","post"],
label: "Zihni Nerede?",
isMt: true, attrs: [], speedFactor: 11.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Zihinde Takip", instruction: () => ``, example: () => `` } ]
},
{
id: "zihni-verbal",
readingLevel: ["pre","post"],
label: "Zihni Nerede? (sözlü)",
isAuditory: true, attrs: [],
audTrials: () => Array.from({length: isPre() ? 3 : 5}, () => makeZihniRound()),
audRender: (rs) => { const n = rs[0].n; return `<div class="aud-list"><div class="aud-note">Çocuk ${n}×${n} ızgaraya baksın. Başlangıç kutusunu gösterin, sonra komutları okuyun (çocuk Zihni'yi görmez). Sonunda Zihni'nin olduğu kutuyu göstersin ya da söylesin. Yanlışları hata sayısına ekleyin.</div>` +
`<div class="wm-grid" style="grid-template-columns:repeat(${n}, 56px);gap:6px;margin:8px auto">${Array.from({length:n * n}, () => `<div class="wm-pic" style="width:56px;height:56px;border-radius:12px;cursor:default"></div>`).join("")}</div>` +
rs.map((r, i) => `<div class="aud-row"><div class="aud-num">${i + 1}</div><div class="aud-body"><div class="aud-words" style="font-size:18px">Başlangıç: ${zhCellName({ n:r.n, ex:r.sx, ey:r.sy })} · ${r.cmds.map(d => `${ZH_DIRS[d].w} 1`).join(", ")}</div><div class="aud-key">Doğru cevap: <b>${zhCellName(r)}</b></div></div></div>`).join("") + `</div>`; },
randomItem: () => ({}),
stages: [ { label: "Komutları Dinle", instruction: () => ``, example: () => `` } ]
},
{
id: "market",
readingLevel: ["pre","post"],
label: "Market Listesi",
isMt: true, attrs: [], speedFactor: 23.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Liste → Balon → Raf", instruction: () => ``, example: () => `` } ]
},
{
id: "market-verbal",
readingLevel: ["pre","post"],
label: "Market Listesi (sözlü)",
isAuditory: true, attrs: [],
audTrials: () => Array.from({length:3}, () => ({ list: makeMarketRound().list, task: randomItem(MK_DISTRACT) })),
audRender: (rs) => `<div class="aud-list"><div class="aud-note">Listeyi okuyun, sonra çocuğa araya giren görevi yaptırın; bitince listedekileri söylesin (sıra önemli değil). Eksik ya da yanlış söylediği listeleri hata sayısına ekleyin.</div>` +
rs.map((r, i) => `<div class="aud-row"><div class="aud-num">${i + 1}</div><div class="aud-body"><div class="aud-words">🛒 ${r.list.map(x => x.n).join(", ")}</div><div class="aud-key">Araya giren görev: <b>${r.task}</b></div></div></div>`).join("") + `</div>`,
randomItem: () => ({}),
stages: [ { label: "Liste + Ara Görev", instruction: () => ``, example: () => `` } ]
},
{
id: "pal-touch",
readingLevel: ["pre","post"],
label: "Eşini Hatırla",
isMt: true, attrs: [], speedFactor: 11.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Öğren ve Hatırla", instruction: () => ``, example: () => `` } ]
},
{
id: "word-pairs",
readingLevel: ["post"],
label: "Kelime Çiftleri",
isAuditory: true, attrs: [], errorLabel: "Hatırlanmayan eş sayısı",
audTrials: () => [{ pairs: makeWordPairs(currentStageIndex, [3, 4, 5][currentCombo().t]) }],
audRender: (tr) => { const pr = tr[0].pairs, test = shuffleArray(pr.slice());
return `<div class="aud-list">${currentStageIndex === 3 ? `<div class="aud-note" style="border-color:#E0A100;background:#FFF8E5">💡 <b>Strateji · Cümle kur:</b> Her çifti okuduktan sonra iki kelimeyi birleştiren kısa bir cümle ya da hayal kurdurun. Örnek: <b>"${pr[0][0]} ile ${pr[0][1]}"</b> için komik bir cümle. Sonucu Aşama 1 ile karşılaştırın.</div>` : ""}<div class="aud-note"><b>1. Öğrenme:</b> çiftleri saniyede bir kelime hızında, aralarında kısa duraklarla okuyun. <b>2. Sınama:</b> aşağıdaki sırayla yalnızca ilk kelimeyi söyleyin; çocuk eşini söylesin. Hatırlanmayan eşleri hata sayısına ekleyin. İsterseniz tüm çiftleri öğrenene kadar 3 tur tekrar edin.</div>` +
`<div class="aud-row"><div class="aud-num">1</div><div class="aud-body"><div class="aud-words">${pr.map(p => `${p[0]} – ${p[1]}`).join(" &nbsp;·&nbsp; ")}</div></div></div>` +
`<div class="aud-row"><div class="aud-num">2</div><div class="aud-body">${test.map(p => `<div style="font-size:18px;margin:3px 0"><b>${p[0]}?</b> <span class="aud-key" style="display:inline">→ ${p[1]}</span></div>`).join("")}</div></div></div>`; },
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · İlişkisiz Kelimeler", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Sayı – Kelime", instruction: () => ``, example: () => `` }, { label: "Aşama 3 · İsim – Yer", instruction: () => ``, example: () => `` } ]
},
{
id: "mixed-span",
readingLevel: ["post"],
label: "Karışık Dizi",
isAuditory: true, attrs: [],
audTrials: () => makeMixedSeqs(),
audRender: (tr) => currentStageIndex === 1 ? `<div class="aud-list"><div class="aud-note" style="border-color:#E0A100;background:#FFF8E5">💡 <b>Strateji · Parçala:</b> Diziyi gruplar hâlinde okuyun; grupların arasında kısa bir durak verin. Çocuğa söyleyin: <b>"Küçük parçalar hâlinde aklında tut, sen de parça parça söyle."</b> Uzayan dizi kuralı aynı. Sonucu Aşama 1 ile karşılaştırın.</div>` +
tr.map(t => `<div class="aud-row"><div class="aud-num">${t.L}</div><div class="aud-body"><div class="aud-words">${chunkSeq(t.words).map(g => g.join(" – ")).join(` <span style="color:#E0A100;font-weight:900">&nbsp;|&nbsp;</span> `)}</div></div></div>`).join("") + `</div>` :
`<div class="aud-list"><div class="aud-note">Her diziyi saniyede bir öğe hızında okuyun; çocuk <b>verildiği sırayla</b> tekrar etsin. Her uzunlukta iki dizi var: <b>aynı uzunluktaki iki dizinin ikisi de yanlışsa durun</b>; doğru tekrarlanan en uzun diziyi not edin. Yanlış dizileri hata sayısına ekleyin.</div>` +
tr.map((t, i) => `<div class="aud-row"><div class="aud-num">${t.L}</div><div class="aud-body"><div class="aud-words">${t.words.join(" – ")}</div></div></div>`).join("") + `</div>`,
randomItem: () => ({}),
stages: [ { label: "Uzayan Dizi", instruction: () => ``, example: () => `` } ]
},
{
id: "story-recall",
readingLevel: ["post"],
label: "Hikâye Hatırlama",
isAuditory: true, attrs: [], errorLabel: "Hatırlanmayan ayrıntı sayısı",
audTrials: () => { storyChecked = {}; const ls = lastStory();
if(currentStageIndex === 1 && ls){ const st = STORIES_POST.find(x => x.id === ls.id); if(st) return [st]; }   /* Aşama 2: gecikmeli (strateji aşaması kaldırıldı) */
return [randomItem(STORIES_POST)]; },
audRender: (items) => renderStoryBoard(items),
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Hemen Anlat", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Gecikmeli (10–15 dk sonra)", instruction: () => ``, example: () => `` } ]
},
{
id: "short-story",
readingLevel: ["pre"],
label: "Kısa Hikâye",
isAuditory: true, attrs: [], errorLabel: "Yanlış cevap sayısı",
audTrials: () => shuffleArray(STORIES_PRE).slice(0, 2),
audRender: (tr) => `<div class="aud-list"><div class="aud-note">${ssNote()} Yanlış ya da cevapsız soruları hata sayısına ekleyin.</div>` +
tr.map((st, i) => `<div class="aud-row"><div class="aud-num">${i + 1}</div><div class="aud-body">${ssShowImg() ? `<img src="${STORY_PRE_IMAGES[st.img]}" alt="" style="display:block;width:min(240px,70%);aspect-ratio:1;object-fit:contain;margin:2px auto 8px;border-radius:14px;background:#fff">` : ""}<div style="font-size:20px;font-weight:800;line-height:1.45">${st.text}</div>${st.q.map(q => `<div style="margin-top:4px"><b>${q[0]}</b> <span class="aud-key" style="display:inline">→ ${q[1]}</span></div>`).join("")}</div></div>`).join("") + `</div>`,
randomItem: () => ({}),
stages: [ { label: "Dinle ve Cevapla", instruction: () => ``, example: () => `` } ]
},
{
id: "pic-seq-say",
readingLevel: ["pre"],
label: "Resimleri Sırayla Söyle",
isMt: true, attrs: [], speedFactor: 7,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Sırayla Söyle", instruction: () => ``, example: () => `` } ]
},
{
id: "pic-seq-touch",
readingLevel: ["pre","post"],
label: "Duyduğun Sırayla Dokun",
isMt: true, attrs: [], speedFactor: 16,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Sırayla Dokun", instruction: () => ``, example: () => `` } ]
},
{
id: "hear-find",
readingLevel: ["pre","post"],
label: "Duyduklarını Bul",
isMt: true, attrs: [], speedFactor: 15.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dinle ve Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "dir-follow",
readingLevel: ["pre","post"],
label: "Yönerge İzle",
isMt: true, attrs: [], speedFactor: 15.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dinle ve Yap", instruction: () => ``, example: () => `` } ]
},
{
id: "vis-miss",
readingLevel: ["pre","post"],
label: "Ne Eksik?",
isMt: true, attrs: [], speedFactor: 10.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Eksik Olanı Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "vis-chg",
readingLevel: ["pre","post"],
label: "Ne Değişti?",
isMt: true, attrs: [], speedFactor: 10.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Değişeni Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "vis-recog",
readingLevel: ["pre","post"],
label: "Bunu Gördün mü?",
isMt: true, attrs: [], speedFactor: 3,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Hemen", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Gecikmeli (10–15 dk sonra)", instruction: () => ``, example: () => `` } ]
},
{
id: "vis-draw",
readingLevel: ["pre","post"],
label: "Çizgiyi Hatırla",
isMt: true, attrs: [], speedFactor: 20,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Çiz", instruction: () => ``, example: () => `` } ]
},
{
id: "list-learn",
readingLevel: ["pre","post"],
label: "Liste Öğrenme",
isAuditory: true, attrs: [], errorLabel: "Hatırlanmayan kelime sayısı",

audTrials: () => { ckMarks = {}; return llBuild(); },
audRender: (items) => llRender(items),
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Tekrarlı Öğrenme", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Gecikmeli + Tanıma", instruction: () => ``, example: () => `` } ]
},
{
id: "cat-list",
readingLevel: ["pre","post"],
label: "Kategorili Liste",
isAuditory: true, attrs: [], errorLabel: "Kendiliğinden hatırlanmayan kelime",

audTrials: () => { ckMarks = {}; return clBuild(); },
audRender: (items) => clRender(items),
randomItem: () => ({}),
stages: [ { label: "Serbest + İpuçlu", instruction: () => ``, example: () => `` } ]
},
{
id: "nonword",
readingLevel: ["pre","post"],
label: "Uydurma Kelime Tekrarı",
isAuditory: true, attrs: [], errorLabel: "Yanlış tekrarlanan kelime",
audTrials: () => nwBuild(),
audRender: (tr) => `<div class="aud-list"><div class="aud-note">Kelimeleri tek tek, <b>hece hece vurgulamadan</b>, bir kez söyleyin ya da 🔊 ile dinletin; çocuk hemen tekrar etsin. Tek bir ses bile farklıysa yanlış sayın. Kelimeler kısadan uzuna sıralı.</div>` +
tr.map((x, i) => `<div class="aud-row"><div class="aud-num">${x.L}</div><div class="aud-body" style="display:flex;align-items:center;gap:10px;justify-content:space-between"><div class="aud-words" style="font-size:24px">${x.w}</div>${sayBtn(x.w)}</div></div>`).join("") +
`<div class="aud-note">Sol sütundaki sayı hece sayısıdır. Uzun kelimelerde düşüş belirginse fonolojik bellek desteklenmelidir.</div></div>`,
randomItem: () => ({}),
stages: [ { label: "Dinle ve Tekrar Et", instruction: () => ``, example: () => `` } ]
},
{
id: "sent-listen",
readingLevel: ["pre","post"],
label: "Cümleyi Tekrarla",
isAuditory: true, attrs: [], errorLabel: "Yanlış tekrarlanan cümle",
audTrials: () => sentNext(isPre() ? 3 : 5),
audRender: (tr) => `<div class="aud-list"><div class="aud-note">Cümleyi <b>göstermeden</b>, doğal bir hızla bir kez okuyun ya da 🔊 ile dinletin; çocuk <b>aynen</b> tekrar etsin. Kelime ekleme, atlama, ek ya da sıra değişikliği yanlış sayılır.</div>` +
tr.map((x, i) => `<div class="aud-row"><div class="aud-num">${i + 1}</div><div class="aud-body" style="display:flex;align-items:center;gap:10px;justify-content:space-between"><div style="font-size:19px;font-weight:800;line-height:1.4">${x}</div>${sayBtn(x)}</div></div>`).join("") + `</div>`,
randomItem: () => ({}),
stages: [ { label: "Dinle ve Tekrar Et", instruction: () => ``, example: () => `` } ]
},
{
id: "vis-face",
readingLevel: ["pre","post"],
label: "Yüzleri Hatırla",
isMt: true, attrs: [], speedFactor: 15,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Yüzleri Tanı", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Yüz – İsim", instruction: () => ``, example: () => `` } ]
},
{
id: "scene-mem",
readingLevel: ["pre","post"],
label: "Resme Bak, Hatırla",
isMt: true, attrs: [], speedFactor: 39,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Bak ve Cevapla", instruction: () => ``, example: () => `` } ]
},
{
id: "scene-touch",
readingLevel: ["pre","post"],
label: "Resimde Ne Vardı?",
isMt: true, attrs: [], speedFactor: 23.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Bak ve Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "odd-cat",
readingLevel: ["pre","post"],
label: "Gruba Uymayanı Bul",
isMt: true, attrs: [], speedFactor: 4,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "opp-touch",
readingLevel: ["pre","post"],
label: "Zıttını Seç",
isMt: true, attrs: [], speedFactor: 4,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "syl-touch",
readingLevel: ["pre","post"],
label: "Hece Sayısına Dokun",
isMt: true, attrs: [], speedFactor: 4.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "sim-touch",
readingLevel: ["pre","post"],
label: "Hangisi Benziyor?",
isMt: true, attrs: [], speedFactor: 4,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "def-touch",
readingLevel: ["pre","post"],
label: "Tanımı Dinle, Resmi Seç",
isMt: true, attrs: [], speedFactor: 6,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "use-touch",
readingLevel: ["pre","post"],
label: "Ne İşe Yarar?",
isMt: true, attrs: [], speedFactor: 5.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "size-touch",
readingLevel: ["pre","post"],
label: "Boyut Sırasıyla Dokun",
isMt: true, attrs: [], speedFactor: 7,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Küçükten Büyüğe", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Büyükten Küçüğe", instruction: () => ``, example: () => `` } ]
},
{
id: "arrow-touch",
readingLevel: ["pre","post"],
label: "Okun Yönüne Dokun",
isMt: true, attrs: [], speedFactor: 3,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "edge-touch",
readingLevel: ["pre","post"],
label: "Kenar Sayısına Dokun",
isMt: true, attrs: [], speedFactor: 3.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "odd-touch",
readingLevel: ["pre","post"],
label: "Farklı Olanı Bul (dokunmalı)",
isMt: true, attrs: [], speedFactor: 3.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "pattern-touch",
readingLevel: ["pre","post"],
label: "Sıradakini Seç",
isMt: true, attrs: [], speedFactor: 4.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "analogy-touch",
readingLevel: ["pre","post"],
label: "Eşini Seç (analoji)",
isMt: true, attrs: [], speedFactor: 6,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "move-seq",
readingLevel: ["pre","post"],
label: "Hareket Sırası",
isMt: true, attrs: [], speedFactor: 13.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dinle ve Yap", instruction: () => ``, example: () => `` } ]
},
{
id: "story-order",
readingLevel: ["pre","post"],
label: "Hikâyeyi Sırala",
isMt: true, attrs: [], speedFactor: 20,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "İzle, Dinle, Sırala", instruction: () => ``, example: () => `` } ]
},
{
id: "what-do",
readingLevel: ["pre","post"],
label: "Ne Yapmalı?",
isMt: true, attrs: [], speedFactor: 5.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Ne Yapmalı?", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Nedenini Söyle", instruction: () => ``, example: () => `` } ]
},
{
id: "flu-cat",
readingLevel: ["pre","post"],
label: "Kategori Akıcılığı",
isMt: true, attrs: [], speedFactor: 20,
noAdaptive: true, errorLabel: "Doğru kelime sayısı", onShuffle: () => { fluPick("flu-cat", true); },
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Kelime Üret", instruction: () => ``, example: () => `` } ]
},
{
id: "flu-letter",
readingLevel: ["pre","post"],
label: "Ses ve Harf Akıcılığı",
isMt: true, attrs: [], speedFactor: 20,
noAdaptive: true, errorLabel: "Doğru kelime sayısı", onShuffle: () => { fluPick("flu-letter", true); },
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Kelime Üret", instruction: () => ``, example: () => `` } ]
},
{
id: "flu-switch",
readingLevel: ["pre","post"],
label: "Kategori Değiştirme",
isMt: true, attrs: [], speedFactor: 20,
noAdaptive: true, errorLabel: "Doğru kelime sayısı",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Sırayla Üret", instruction: () => ``, example: () => `` } ]
},
{
id: "sort-pic",
readingLevel: ["pre","post"],
label: "Resimleri Grupla",
isMt: true, attrs: [], speedFactor: 2.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Grupla", instruction: () => ``, example: () => `` } ]
},
{
id: "free-sort",
readingLevel: ["pre","post"],
label: "Kendi Kümeni Kur",
isMt: true, attrs: [], speedFactor: 3.5,
errorLabel: "Hata (uymayan + adı uygun olmayan)",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Grupla", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Grupla ve Adlandır", instruction: () => ``, example: () => `` } ]
},
{
id: "group-say",
readingLevel: ["pre","post"],
label: "Hangileri Birlikte?",
isAuditory: true, attrs: [], errorLabel: "Yanlış gruplanan kelime",

audTrials: () => { ckMarks = {}; return gsBuild(); },
audRender: (items) => gsRender(items),
randomItem: () => ({}),
stages: [ { label: "Grupla ve Söyle", instruction: () => ``, example: () => `` } ]
},
{
id: "same-sound",
readingLevel: ["pre","post"],
label: "Aynı Sesle Başlayanı Bul",
isMt: true, attrs: [], speedFactor: 7,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "rhyme-touch",
readingLevel: ["pre","post"],
label: "Sonu Benziyor mu?",
isMt: true, attrs: [], speedFactor: 4.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dinle ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "syn-touch",
readingLevel: ["post"],
label: "Eş Anlamlısını Bul",
isMt: true, attrs: [], speedFactor: 4,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "seq-words",
readingLevel: ["pre","post"],
label: "Sıraya Diz",
isMt: true, attrs: [], speedFactor: 7,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Sırala", instruction: () => ``, example: () => `` } ]
},
{
id: "part-whole",
readingLevel: ["pre","post"],
label: "Parça–Bütün",
isMt: true, attrs: [], speedFactor: 4,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "dot-count",
readingLevel: ["pre","post"],
label: "Kaç Tane?",
isMt: true, attrs: [], speedFactor: 3,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Bak ve Söyle", instruction: () => ``, example: () => `` } ]
},
{
id: "sem-decide",
readingLevel: ["pre","post"],
label: "Anlam Kararı",
isMt: true, attrs: [], speedFactor: 2.5,
onShuffle: () => { semPick(true); },
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Evet mi, Hayır mı?", instruction: () => ``, example: () => `` } ]
},
{
id: "eye-touch",
readingLevel: ["pre","post"],
label: "Hareketli Hedefe Dokun",
isMt: true, attrs: [], speedFactor: 2,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Topu Yakala", instruction: () => ``, example: () => `` } ]
},
{
id: "alt-uses",
readingLevel: ["pre","post"],
label: "Başka Ne İşe Yarar?",
isMt: true, attrs: [], speedFactor: 20,
noAdaptive: true, errorLabel: "Uygun fikir sayısı", onShuffle: () => { fluPick("alt-uses", true); },
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Fikir Üret", instruction: () => ``, example: () => `` } ]
},
{
id: "time-est",
readingLevel: ["pre","post"],
label: "Zaman Tahmini",
isMt: true, attrs: [], speedFactor: 30,
noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "İçinden Say", instruction: () => ``, example: () => `` } ]
},
{
id: "find-error",
readingLevel: ["pre","post"],
label: "Hatayı Bul",
isMt: true, attrs: [], speedFactor: 5.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Kontrol Et", instruction: () => ``, example: () => `` } ]
},
{
id: "cups",
readingLevel: ["pre","post"],
label: "Bardak Oyunu",
isMt: true, attrs: [], speedFactor: 10,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Topu Takip Et", instruction: () => ``, example: () => `` } ]
},
{
id: "mental-math",
readingLevel: ["pre","post"],
label: "Zihinden Hesap",
isMt: true, attrs: [], speedFactor: 13,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aklında Hesapla", instruction: () => ``, example: () => `` } ]
},
{
id: "who-said",
readingLevel: ["pre","post"],
label: "Kim Söyledi?",
isMt: true, attrs: [], speedFactor: 6,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dinle ve Hatırla", instruction: () => ``, example: () => `` } ]
},
{
id: "rhythm",
readingLevel: ["pre","post"],
label: "Ritim Tekrarı",
isMt: true, attrs: [], speedFactor: 12,
noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dinle ve Vur", instruction: () => ``, example: () => `` } ]
},
{
id: "memory-cards",
readingLevel: ["pre","post"],
label: "Kart Eşleştirme",
isMt: true, attrs: [], speedFactor: 3.5,
noAdaptive: true, errorLabel: "Fazladan eşleşmeyen deneme",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Eşleri Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "analogy-say",
readingLevel: ["pre","post"],
label: "Sözel Analoji",
isAuditory: true, attrs: [], errorLabel: "Uygun olmayan cevap",

audTrials: () => { ckMarks = {}; return lcBuild(ANALOGY); },
audRender: (items) => lcRender(items, `İlk ikiliyi vurgulayarak okuyun; çocuk aynı ilişkiyi ikinci ikiliye aktarsın. Anlamca uygun her cevap kabul edilir.`),
randomItem: () => ({}),
stages: [ { label: "Sor ve Değerlendir", instruction: () => ``, example: () => `` } ]
},
{
id: "proverb-say",
readingLevel: ["pre","post"],
label: "Benzetme ve Atasözü",
isAuditory: true, attrs: [], errorLabel: "Uygun olmayan açıklama",

audTrials: () => { ckMarks = {}; return lcBuild(PROVERB); },
audRender: (items) => lcRender(items, `Okuyun ve sorun: ${isPre() ? "Gerçekten öyle mi? Ne anlatıyor?" : "Bu ne anlatmak istiyor? Ne zaman söylenir?"} Kelimesi kelimesine açıklama (ör. 'eteğinde zil var') uygun sayılmaz.`),
randomItem: () => ({}),
stages: [ { label: "Sor ve Değerlendir", instruction: () => ``, example: () => `` } ]
},
{
id: "infer-say",
readingLevel: ["pre","post"],
label: "Çıkarım Yap",
isAuditory: true, attrs: [], errorLabel: "Uygun olmayan çıkarım",

audTrials: () => { ckMarks = {}; return lcBuild(INFER); },
audRender: (items) => lcRender(items, `Durumu okuyun, soruyu sorun. Çocuk ipuçlarını kullanarak mantıklı bir sonuç söylesin; aynı anlamdaki farklı cevaplar uygundur.`),
randomItem: () => ({}),
stages: [ { label: "Sor ve Değerlendir", instruction: () => ``, example: () => `` } ]
},
{
id: "homonym-say",
readingLevel: ["post"],
label: "Çok Anlamlı Kelimeler",
isAuditory: true, attrs: [], errorLabel: "İki anlamı bulunamayan",

audTrials: () => { ckMarks = {}; return lcBuild(HOMONYM); },
audRender: (items) => lcRender(items, `Kelimeyi söyleyin: "Bu kelimenin iki farklı anlamını söyle, istersen her biriyle bir cümle kur." İki anlamı da söylerse uygun sayın.`),
randomItem: () => ({}),
stages: [ { label: "Sor ve Değerlendir", instruction: () => ``, example: () => `` } ]
},
{
id: "proverb-touch",
readingLevel: ["post"],
label: "Ne Anlama Geliyor?",
isMt: true, attrs: [], speedFactor: 6,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dinle ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "absurd-touch",
readingLevel: ["pre","post"],
label: "Saçma mı?",
isMt: true, attrs: [], speedFactor: 6.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dinle ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "concept-touch",
readingLevel: ["pre","post"],
label: "Kavram Bilgisi",
isMt: true, attrs: [], speedFactor: 6,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dinle ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "infer-touch",
readingLevel: ["post"],
label: "Çıkarım Seç",
isMt: true, attrs: [], speedFactor: 11,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dinle ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "vanalogy-touch",
readingLevel: ["pre","post"],
label: "Analoji Tamamla",
isMt: true, attrs: [], speedFactor: 7,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "İkiliyi Tamamla", instruction: () => ``, example: () => `` } ]
},
{
id: "word-pic",
readingLevel: ["pre","post"],
label: "Söyleneni Göster",
isMt: true, attrs: [], speedFactor: 5.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dinle ve Göster", instruction: () => ``, example: () => `` } ]
},
{
id: "absurd-say",
readingLevel: ["pre","post"],
label: "Saçmalığı Bul",
isMt: true, attrs: [], speedFactor: 6,
errorLabel: "Uygun olmayan açıklama",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Bul ve Açıkla", instruction: () => ``, example: () => `` } ]
},
{
id: "block-design",
readingLevel: ["pre","post"],
label: "Bloklarla Desen",
isMt: true, attrs: [], speedFactor: 32,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Modeli Yap", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Döndürülmüş Model", instruction: () => ``, example: () => `` } ]
},
{
id: "mental-rot",
readingLevel: ["pre","post"],
label: "Zihinsel Döndürme",
isMt: true, attrs: [], speedFactor: 6,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Döndür ve Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "clutter-find",
readingLevel: ["pre","post"],
label: "Kalabalıkta Bul",
isMt: true, attrs: [], speedFactor: 1,
onShuffle: () => { clutTarget = null; },
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Hepsini Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "overlap-count",
readingLevel: ["pre","post"],
label: "Üst Üste Şekiller",
isMt: true, attrs: [], speedFactor: 6,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Say ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "embedded",
readingLevel: ["post"],
label: "Gizli Şekil",
isMt: true, attrs: [], speedFactor: 7,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Bul ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "closure",
readingLevel: ["pre","post"],
label: "Görsel Tamamlama",
isMt: true, attrs: [], speedFactor: 4.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Tamamla ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "copy-design",
readingLevel: ["pre","post"],
label: "Deseni Kopyala",
isMt: true, attrs: [], speedFactor: 16,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Modele Bakarak Çiz", instruction: () => ``, example: () => `` } ]
},
{
id: "symmetry",
readingLevel: ["pre","post"],
label: "Simetriyi Tamamla",
isMt: true, attrs: [], speedFactor: 12,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Ayna Gibi Tamamla", instruction: () => ``, example: () => `` } ]
},
{
id: "maze",
readingLevel: ["pre","post"],
label: "Labirent",
isMt: true, maxTier: 3, attrs: [], speedFactor: 33,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Çıkışı Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "matrix-fill",
readingLevel: ["pre","post"],
label: "Matris Tamamla",
isMt: true, attrs: [], speedFactor: 7,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Boş Kutuyu Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "balance",
readingLevel: ["pre","post"],
label: "Terazi",
isMt: true, attrs: [], speedFactor: 7,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Teraziyi Düşün", instruction: () => ``, example: () => `` } ]
},
{
id: "pic-arrange",
readingLevel: ["pre","post"],
label: "Resimleri Sırala",
isMt: true, attrs: [], speedFactor: 8,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Sırala", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Sırala ve Anlat", instruction: () => ``, example: () => `` } ]
},
{
id: "pair-match",
readingLevel: ["pre","post"],
label: "Aynı İkiliyi Bul",
isMt: true, maxTier: 3, attrs: [], speedFactor: 5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Hızla Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "sent-verify",
readingLevel: ["post"],
label: "Hızlı Cümle Doğrulama",
isMt: true, attrs: [], speedFactor: 3,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oku ve Karar Ver", instruction: () => ``, example: () => `` } ]
},
{
id: "periph",
readingLevel: ["pre","post"],
label: "Kenardan Gelen",
isMt: true, attrs: [], speedFactor: 2.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Ortaya Bak, Kenarı Fark Et", instruction: () => ``, example: () => `` } ]
},
{
id: "fixation",
readingLevel: ["pre","post"],
label: "Sabit Bakış",
isMt: true, attrs: [], speedFactor: 30,
noAdaptive: true, adultOnly: true, errorLabel: "Gözünü ayırdığı deneme",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Noktaya Bak", instruction: () => ``, example: () => `` } ]
},
{
id: "dual-task",
readingLevel: ["pre","post"],
label: "İki İş Birden",
isMt: true, attrs: [], speedFactor: 42.5,
noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dokun ve Say", instruction: () => ``, example: () => `` } ]
},
{
id: "stop-signal",
readingLevel: ["pre","post"],
label: "Dur İşareti",
isMt: true, attrs: [], speedFactor: 2,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Bas ya da Dur", instruction: () => ``, example: () => `` } ]
},
{
id: "num-stroop",
readingLevel: ["post"],
label: "Sayı Stroop",
isChoice: true, attrs: [], speedFactor: 2,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Hangi Tarafta Daha Çok?", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Hangi Rakam Daha Büyük?", instruction: () => ``, example: () => `` } ]
},
{
id: "size-stroop",
readingLevel: ["pre","post"],
label: "Hayvan Boyutu Stroop",
isChoice: true, attrs: [], speedFactor: 2,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Gerçekte Hangisi Büyük?", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Gerçekte Hangisi Küçük?", instruction: () => ``, example: () => `` } ]
},
{
id: "spatial-stroop",
readingLevel: ["post"],
label: "Ok–Kelime Çatışması",
isChoice: true, attrs: [], speedFactor: 2,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Kelimeye Göre", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Yerine Göre", instruction: () => ``, example: () => `` } ]
},
{
id: "anti-touch",
readingLevel: ["pre","post"],
label: "Ters Yöne Dokun",
isChoice: true, attrs: [], speedFactor: 2,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Karşı Tarafa Dokun", instruction: () => ``, example: () => `` } ]
},
{
id: "hayling",
readingLevel: ["post"],
label: "Uymayan Kelimeyle Tamamla",
isAuditory: true, attrs: [], errorLabel: "Uyan kelime söylenen cümle",
audTrials: () => [{ items: haylTrials() }],
audRender: (items) => efAudList(items[0].items.map(x => ({ q: x.s, a: stIx() === 1 ? `Uyan kelime: <b>${x.a}</b> — bunu ya da benzerini söylerse hata` : `Beklenen: <b>${x.a}</b>` })), stIx() === 1 ? "Cümleyi okuyup sonunda durun; çocuk cümleye HİÇ uymayan bir kelime söylesin. Uyan ya da ilgili kelimeyi Hata sayısına ekleyin." : "Cümleyi okuyup sonunda durun; çocuk uygun bir kelimeyle tamamlasın. Uygun olmayanı Hata sayısına ekleyin."),
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Uyan Kelime", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Uymayan Kelime", instruction: () => ``, example: () => `` } ]
},
{
id: "zihni-says",
readingLevel: ["pre","post"],
label: "Zihni Diyor ki",
isAuditory: true, attrs: [], errorLabel: "Yanlış yapılan komut",
audTrials: () => [{ items: simonTrials() }],
audRender: (items) => efAudList(items[0].items.map(x => ({ img: `<img src="${MOVE_IMAGES[x.m]}" alt="" style="width:88%;height:88%;object-fit:contain">`, q: (x.zihni ? "Zihni diyor ki: " : "") + cap(MOVES[x.m]) + "!", a: x.zihni ? "yapmalı" : "<b>yapmamalı</b> — yaparsa hata" })), "Komutları sırayla okuyun; ekranı çocuğa göstermeyin. ‘Zihni diyor ki’ ile başlamayan komutu yaparsa Hata sayısına ekleyin."),
randomItem: () => ({}),
stages: [ { label: "Zihni Derse Yap", instruction: () => ``, example: () => `` } ]
},
{
id: "opp-do",
readingLevel: ["pre","post"],
label: "Tersini Yap",
isAuditory: true, attrs: [], errorLabel: "Yanlış yapılan komut",
audTrials: () => [{ items: oppTrials("htks") }],
audRender: (items) => efAudList(items[0].items.map(x => ({ img: `<img src="${efImg(x.seq[0].img)}" alt="" style="width:88%;height:88%;object-fit:contain">`, q: x.say, a: `tersi: <b>${x.ans}</b>` })), "Komutları sırayla okuyun; ekranı çocuğa göstermeyin. Çocuk söylenenin tersini yapsın; yanlış yaparsa Hata sayısına ekleyin (kendini düzeltirse hata saymayın)."),
randomItem: () => ({}),
stages: [ { label: "Söylenenin Tersini Yap", instruction: () => ``, example: () => `` } ]
},
{
id: "hand-game",
readingLevel: ["pre","post"],
label: "El Oyunu: Yumruk–Parmak",
isAuditory: true, attrs: [], errorLabel: "Yanlış gösterilen dizi",
audTrials: () => [{ items: oppTrials("hand") }],
audRender: (items) => efAudList(items[0].items.map(x => ({ img: x.seq.map(p => `<img src="${efImg(p.img)}" alt="" style="width:${Math.round(84 / x.seq.length)}%;height:88%;object-fit:contain">`).join(""), q: x.say, a: `çocuk: <b>${x.ans}</b>` })), "Her satırdaki işareti elinizle sırayla gösterin; çocuk her birinin tersini aynı sırayla göstersin. Yanlış diziyi Hata sayısına ekleyin."),
randomItem: () => ({}),
stages: [ { label: "Tersini Göster", instruction: () => ``, example: () => `` } ]
},
{
id: "tap-reverse",
readingLevel: ["pre","post"],
label: "Ters Vuruş",
isMt: true, attrs: [], speedFactor: 3,
errorLabel: "Yanlış sayıda vuruş",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Bir Görünce İki", instruction: () => ``, example: () => `` } ]
},
{
id: "statue",
readingLevel: ["pre","post"],
label: "Heykel",
isMt: true, attrs: [], speedFactor: 60, adaptErrorsOnly: true,
errorLabel: "Hareket / konuşma sayısı",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Kıpırdamadan Dur", instruction: () => ``, example: () => `` } ]
},
{
id: "hold-wait",
readingLevel: ["pre","post"],
label: "Bekle ve Bırak",
isMt: true, attrs: [], speedFactor: 12, adaptErrorsOnly: true,
errorLabel: "Erken bırakma sayısı",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Hediye Açılana Kadar Tut", instruction: () => ``, example: () => `` } ]
},
{
id: "less-more",
readingLevel: ["pre","post"],
label: "Azı Seç",
isChoice: true, attrs: [], speedFactor: 3,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Az Olanı Göster, Çoğu Kazan", instruction: () => ``, example: () => `` } ]
},
{
id: "context-go",
readingLevel: ["pre","post"],
label: "Bağlamlı Tepki",
isChoice: true, attrs: [], speedFactor: 2.5,   /* "dokunma" denemeleri pencere süresince bekletir: süre eşiği buna göre */
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Öncekine Göre Dokun", instruction: () => ``, example: () => `` } ]
},
{
id: "distract",
readingLevel: ["pre","post"],
label: "Çeldiriciyi Yoksay",
isChoice: true, attrs: [], speedFactor: 2,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Sessiz", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Çeldiricili", instruction: () => ``, example: () => `` } ]
},
{
id: "opp-world",
readingLevel: ["pre","post"],
label: "Zıt Dünya: 1–2",
attrs: [],
makeGrid: (n) => makeDayNightGrid(n).map(x => ({ v: x.k === "sun" ? 1 : 2 })),
randomItem: () => ({ v: 1 }),
renderItem: (item) => numberHTML(item.v, "#1F2A33"),
stages: [ { label: "Tersini Söyle", instruction: () => ``, example: (item) => item.v === 1 ? "iki" : "bir" } ]   /* KURAL: Zıt Dünya tek aşamalı (yalnız tersini söyleme) */
},
{
id: "grass-snow",
readingLevel: ["pre","post"],
label: "Çimen–Kar",
isChoice: true, attrs: [], speedFactor: 2,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Tersi Renge Dokun", instruction: () => ``, example: () => `` } ]
},
{
id: "rev-arrow",
readingLevel: ["pre","post"],
label: "Ters Ok",
attrs: [],
makeGrid: (n) => makeDayNightGrid(n).map(x => ({ d: x.k === "sun" ? "u" : "d" })),
randomItem: () => ({ d: "u" }),
renderItem: (item) => `<svg viewBox="0 0 100 100" style="width:72%;height:72%;display:block"><g transform="rotate(${item.d === "u" ? -90 : 90} 50 50)"><path d="M14 40 H56 V22 L88 50 L56 78 V60 H14 Z" fill="#2E6FD8" stroke="#2E6FD8" stroke-width="6" stroke-linejoin="round"/></g></svg>`,
stages: [ { label: "Aşama 1 · Yönü Söyle", instruction: () => ``, example: (item) => item.d === "u" ? "yukarı" : "aşağı" }, { label: "Aşama 2 · Tersini Söyle", instruction: () => ``, example: (item) => item.d === "u" ? "aşağı" : "yukarı" } ]
},
{
id: "fist",
readingLevel: ["pre","post"],
label: "İki Yönden Eşle",
isMt: true, attrs: [], speedFactor: 8,
errorLabel: "Yanlış eşleme",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Benzeyen İkiliyi Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "rule-shift",
readingLevel: ["pre","post"],
label: "Kuralı Söylemeden Değiştir",
isMt: true, attrs: [], speedFactor: 3,
errorLabel: "Yanlış eşleme",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Kuralı Keşfet, Değişince Fark Et", instruction: () => ``, example: () => `` } ]
},
{
id: "reversal",
readingLevel: ["pre","post"],
label: "Hangisi Kazandırıyor?",
isMt: true, attrs: [], speedFactor: 2,
errorLabel: "Yıldızsız seçim",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Yıldızlıyı Bul, Değişince Uyum Sağla", instruction: () => ``, example: () => `` } ]
},
{
id: "navon",
readingLevel: ["pre","post"],
label: "Büyük Şekil mi, Küçük Şekil mi?",
isChoice: true, attrs: [], speedFactor: 2,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "İpucuna Göre Dokun", instruction: () => ``, example: () => `` } ]
},
{
id: "plus-minus",
readingLevel: ["post"],
label: "Artı–Eksi",
attrs: [],
makeGrid: (n) => pmGrid(n),
randomItem: () => ({ v: 12 }),
renderItem: (item) => numberHTML(item.v, "#1F2A33"),
stages: [ { label: "Aşama 1 · Artı 3", instruction: () => ``, example: (item) => `${item.v + 3}` }, { label: "Aşama 2 · Eksi 3", instruction: () => ``, example: (item) => `${item.v - 3}` }, { label: "Aşama 3 · Dönüşümlü", instruction: () => ``, example: (item) => `${item.v + 3} (ilk sayıya +3, sonrakine −3, sonra yine +3…)` } ]
},
{
id: "creature-count",
readingLevel: ["post"],
label: "Yaratık Sayma",
isChoice: true, attrs: [], speedFactor: 8,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oka Göre İleri–Geri Say", instruction: () => ``, example: () => `` } ]
},
{
id: "rev-sort",
readingLevel: ["pre","post"],
label: "Tersine Sınıfla",
isChoice: true, attrs: [], speedFactor: 2,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Yerine Koy", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Tersine Koy", instruction: () => ``, example: () => `` } ]
},
{
id: "zoo-map",
readingLevel: ["pre","post"],
label: "Hayvanat Bahçesi Planı",
isMt: true, attrs: [], speedFactor: 25,
errorLabel: "Kural ihlali + eksik durak",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Rotayı Planla", instruction: () => ``, example: () => `` } ]
},
{
id: "key-search",
readingLevel: ["pre","post"],
label: "Kayıp Anahtar",
isMt: true, attrs: [], speedFactor: 25, adaptErrorsOnly: true,
errorLabel: "Yetersiz tarama",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Tarlayı Tara", instruction: () => ``, example: () => `` } ]
},
{
id: "water-jars",
readingLevel: ["post"],
label: "Su Kapları",
isMt: true, attrs: [], speedFactor: 30, adaptErrorsOnly: true,
errorLabel: "Fazla hamle",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Hedef Miktarı Ölç", instruction: () => ``, example: () => `` } ]
},
{
id: "design-fluency",
readingLevel: ["pre","post"],
label: "Desen Akıcılığı",
isMt: true, attrs: [], speedFactor: 60, noAdaptive: true,
errorLabel: "Tekrar eden desen",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Farklı Desenler Çiz", instruction: () => ``, example: () => `` } ]
},
{
id: "twenty-q",
readingLevel: ["pre","post"],
label: "Yirmi Soru",
isMt: true, attrs: [], speedFactor: 60, noAdaptive: true,
errorLabel: "Soru sayısı",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Az Soruyla Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "box-search",
readingLevel: ["pre","post"],
label: "Kutuları Ara",
isMt: true, attrs: [], speedFactor: 10, adaptErrorsOnly: true,
errorLabel: "Aynı kutuya dönüş",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Her Kutuda Bir Yıldız", instruction: () => ``, example: () => `` } ]
},
{
id: "three-tasks",
readingLevel: ["pre","post"],
label: "Üç İş Bir Süre",
isMt: true, attrs: [], speedFactor: 60, adaptErrorsOnly: true,
errorLabel: "Kural ihlali + yapılmayan parça",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Süreyi Paylaştır", instruction: () => ``, example: () => `` } ]
},
{
id: "cog-est",
readingLevel: ["post"],
label: "Bilişsel Tahmin",
isAuditory: true, attrs: [], errorLabel: "Aşırı tahmin",
audTrials: () => [{ items: cogTrials() }],
audRender: (items) => efAudList(items[0].items.map(x => ({ q: x.q, a: `Makul aralık: <b>${x.r}</b>` })), "Soruyu okuyun; tam bilmesi gerekmiyor, makul bir tahmin söylesin. Aralığın çok dışındaki tahmini Hata sayısına ekleyin."),
randomItem: () => ({}),
stages: [ { label: "Makul Tahmin", instruction: () => ``, example: () => `` } ]
},
{
id: "look-first",
readingLevel: ["pre","post"],
label: "Önce Bak, Sonra Dokun",
isChoice: true, attrs: [], speedFactor: 5,
isDone: () => !!chState && chState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Birebir Aynısını Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "keep-track",
readingLevel: ["pre","post"],
label: "Her Grubun Sonuncusu",
isMt: true, attrs: [], speedFactor: 12, adaptErrorsOnly: true,
errorLabel: "Hatırlanmayan sonuncu",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Sonuncuları Hatırla", instruction: () => ``, example: () => `` } ]
},
{
id: "vigilance",
readingLevel: ["pre","post"],
label: "Nadir Hedef",
isMt: true, attrs: [], speedFactor: 1.5,
noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dikkatini Koru", instruction: () => ``, example: () => `` } ]
},
{
id: "pos-nback",
readingLevel: ["pre","post"],
label: "Konum N-Geri",
isMt: true, maxTier: 3, attrs: [], speedFactor: 2.5,
noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aynı Yer mi?", instruction: () => ``, example: () => `` } ]
},
{
id: "count-span",
readingLevel: ["pre","post"],
label: "Say ve Hatırla",
isMt: true, maxTier: 3, attrs: [], speedFactor: 11.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Say, Aklında Tut", instruction: () => ``, example: () => `` } ]
},
{
id: "tone-seq",
readingLevel: ["pre","post"],
label: "Ses Dizisi Belleği",
isMt: true, attrs: [], speedFactor: 10,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Aşama 1 · Işık ve Ses", instruction: () => ``, example: () => `` }, { label: "Aşama 2 · Yalnız Ses", instruction: () => ``, example: () => `` } ]
},
{
id: "which-seen",
readingLevel: ["pre","post"],
label: "Hangisini Gördün?",
isMt: true, attrs: [], speedFactor: 6.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Bak ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "route-mem",
readingLevel: ["pre","post"],
label: "Yolu Hatırla",
isMt: true, maxTier: 3, attrs: [], speedFactor: 12,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "İzle ve Tekrarla", instruction: () => ``, example: () => `` } ]
},
{
id: "syl-blend",
readingLevel: ["pre","post"],
label: "Hece Birleştir",
isMt: true, attrs: [], speedFactor: 4.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dinle ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "sent-build",
readingLevel: ["post"],
label: "Cümleyi Diz",
isMt: true, attrs: [], speedFactor: 11,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Cümle Kur", instruction: () => ``, example: () => `` } ]
},
{
id: "wh-scene",
readingLevel: ["post"],
label: "Soruyu Anla",
isMt: true, attrs: [], speedFactor: 6.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Bak ve Cevapla", instruction: () => ``, example: () => `` } ]
},
{
id: "spot-diff",
readingLevel: ["pre","post"],
label: "Farkları Bul",
isMt: true, maxTier: 3, attrs: [], speedFactor: 15.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Karşılaştır ve Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "paper-fold",
readingLevel: ["post"],
label: "Katla ve Del",
isMt: true, attrs: [], speedFactor: 8,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Zihninde Aç", instruction: () => ``, example: () => `` } ]
},
{
id: "view-from",
readingLevel: ["post"],
label: "Hangi Yönden?",
isMt: true, attrs: [], speedFactor: 8,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Bakış Açısı", instruction: () => ``, example: () => `` } ]
},
{
id: "cause-effect",
readingLevel: ["pre","post"],
label: "Neden–Sonuç Eşleştir",
isMt: true, attrs: [], speedFactor: 4.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Sonucu Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "sudoku",
readingLevel: ["pre","post"],
label: "Resimli Sudoku",
isMt: true, maxTier: 3, attrs: [], speedFactor: 32,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Tabloyu Doldur", instruction: () => ``, example: () => `` } ]
},
{
id: "num-pattern",
readingLevel: ["post"],
label: "Sayı Örüntüsü",
isMt: true, maxTier: 3, attrs: [], speedFactor: 8,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Kuralı Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "phon-manip",
readingLevel: ["pre","post"],
label: "Ses Oyunu",
isAuditory: true, attrs: [], errorLabel: "Doğru yapılamayan madde",

audTrials: () => { ckMarks = {}; return lcBuild(PHON); },
audRender: (items) => lcRender(items, isPre() ? "Kelimeyi hecelerine ayırarak söyleyin; çocuk istenen heceyi çıkarıp ya da değiştirip söylesin." : "Kelimeyi söyleyin; çocuk istenen sesi çıkarıp, ekleyip ya da değiştirip söylesin. Uydurma kelime çıkması doğaldır."),
randomItem: () => ({}),
stages: [ { label: "Sesi Çıkar, Ekle, Değiştir", instruction: () => ``, example: () => `` } ]
},
{
id: "ran-letter",
readingLevel: ["post"],
label: "Harf Adı",
attrs: ["letter"],
randomItem: () => ({ letter: randomItem([["a","e","l","m","s","t"], ["a","e","l","m","s","t","k","n","r","y"], ["a","e","l","m","s","t","k","n","r","b","d","p","ğ","ş"]][currentCombo().t] || ["a","e","l","m"]) }),
renderItem: (item) => `<div class="name-cell" style="font-size:34px;font-family:inherit">${item.letter}</div>`,
stages: [ { label: "Harfleri Oku", instruction: () => `"Ben başla dediğimde harflerin adını soldan sağa olabildiğince hızlı söyle" deyin.`, example: (item) => item.letter } ]
},
{
id: "new-word",
readingLevel: ["pre","post"],
label: "Yeni Kelime Öğren",
isMt: true, attrs: [], speedFactor: 7,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Tanış ve Hatırla", instruction: () => ``, example: () => `` } ]
},
{
id: "sent-pic",
readingLevel: ["pre","post"],
label: "Cümle–Resim Eşleştir",
isMt: true, attrs: [], speedFactor: 4.5,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dinle ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "clue-find",
readingLevel: ["pre","post"],
label: "İpucuyla Bul",
isMt: true, attrs: [], speedFactor: 8,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "İpuçlarıyla Ele", instruction: () => ``, example: () => `` } ]
},
{
id: "class-table",
readingLevel: ["pre","post"],
label: "Sınıflama Tablosu",
isMt: true, attrs: [], speedFactor: 14,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Tabloyu Doldur", instruction: () => ``, example: () => `` } ]
},
{
id: "color-obj",
readingLevel: ["pre","post"],
label: "Renkli Nesneler",
isMt: true, attrs: [], speedFactor: 8,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Bak ve Hatırla", instruction: () => ``, example: () => `` } ]
},
{
id: "pic-order",
readingLevel: ["pre","post"],
label: "Resim Sırası",
isMt: true, attrs: [], speedFactor: 6,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "İzle ve Sırala", instruction: () => ``, example: () => `` } ]
},
{
id: "finger-trace",
readingLevel: ["pre","post"],
label: "Parmakla İzle",
isMt: true, attrs: [], speedFactor: 11,
noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Topla Birlikte Git", instruction: () => ``, example: () => `` } ]
},
{
id: "eye-count",
readingLevel: ["pre","post"],
label: "Gözle Say",
isMt: true, attrs: [], speedFactor: 20,
noAdaptive: true, adultOnly: true, errorLabel: "Yanlış sayılan",
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Gözle Say", instruction: () => ``, example: () => `` } ]
},
{
id: "listen-answer",
readingLevel: ["pre","post"],
label: "Dinle ve Cevapla",
isMt: true, attrs: [], speedFactor: 9,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dinle ve Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "rhyme-done",
readingLevel: ["pre"],
label: "Tekerlemeyi Tamamla",
isAuditory: true, attrs: [], errorLabel: "Tamamlayamadığı tekerleme",

audTrials: () => { ckMarks = {}; return lcBuild(RHYME_DONE); },
audRender: (items) => lcRender(items, ["Tekerlemeyi iki kez birlikte söyleyin, sonra son sözcüğü söylemeden durun; çocuk tamamlasın.", "Tekerlemeyi bir kez söyleyin, sonra son sözcüğü söylemeden durun; çocuk tamamlasın.", "Tekerlemeyi bir kez söyleyin; çocuk tekerlemenin tamamını kendisi tekrar etsin."][currentCombo().t]),
randomItem: () => ({}),
stages: [ { label: "Dinle ve Tamamla", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-balloon",
readingLevel: ["pre","post"],
label: "Balon Patlat",
isMt: true, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-mole",
readingLevel: ["pre","post"],
label: "Köstebek Yakala",
isMt: true, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-catch",
readingLevel: ["pre","post"],
label: "Meyve Sepeti",
isMt: true, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-bag",
readingLevel: ["pre","post"],
label: "Zihni'nin Eşyaları",
isMt: true, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-simon",
readingLevel: ["pre","post"],
label: "Renk Simon",
isMt: true, maxTier: 3, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-light",
readingLevel: ["pre","post"],
label: "Deniz Feneri Işıkları",
isMt: true, maxTier: 3, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-word",
readingLevel: ["pre","post"],
label: "Kelime Avcısı",
isMt: true, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-rhyme",
readingLevel: ["post"],
label: "Sonu Benzeyen Balıklar",
isMt: true, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-train",
readingLevel: ["post"],
label: "Hece Treni",
isMt: true, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-slide",
readingLevel: ["pre","post"],
label: "Kayan Yapboz",
isMt: true, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-bridge",
readingLevel: ["pre","post"],
label: "Köprü Kur",
isMt: true, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-shadow",
readingLevel: ["pre","post"],
label: "Gölge Eşleştir",
isMt: true, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-escape",
readingLevel: ["pre","post"],
label: "Bul ve Kaç",
isMt: true, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-redlight",
readingLevel: ["pre","post"],
label: "Kırmızı Işık – Yeşil Işık",
isMt: true, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-waiter",
readingLevel: ["pre","post"],
label: "Garson Zihni",
isMt: true, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "pk-drum",
readingLevel: ["pre","post"],
label: "Ritim Davulu",
isMt: true, attrs: [], speedFactor: 10, noBolt: true, noAdaptive: true,
isDone: () => !!mtState && mtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Oyna", instruction: () => ``, example: () => `` } ]
},
{
id: "digit-span",
readingLevel: ["pre","post"],
label: "Rakam Dizisi (Digit Span)",
isRecall: true,
attrs: ["number"],
dims: () => isPre() ? [{rows:2, cols:2}, {rows:2, cols:3}, {rows:2, cols:4}] : [{rows:2, cols:4}, {rows:2, cols:5}, {rows:2, cols:6}],
randomItem: () => ({ number: isPre() ? randomInt(1,6) : randomInt(0,9), color: randomItem(COLORS) }),
renderItem: (item) => numberHTML(item.number, item.color),
stages: [
{
label: "Aşama 1 · Rakamları İncele",
instruction: () => `Bu rakamları birlikte okuyun. Süre dolunca kapanacaklar — çocuktan <b>gördüğü sırayla</b> tekrar etmesini isteyin, doğru sayısını girin.`,
example: () => ``
},
{
label: "Aşama 2 · Ters Sırayla",
instruction: () => `Aynı şekilde inceleyin, ama bu sefer çocuktan rakamları <b>tersten</b> söylemesini isteyin (klasik "geriye digit span").`,
example: () => ``
}
]
},
{
id: "sentence-repeat",
readingLevel: ["post"],
label: "Cümle/Öbek Tekrarı",
isRecall: true,
attrs: ["phrase"],
randomItem: () => ({ phrase: randomItem(PHRASE_POOL) }), uniqueFrom: () => PHRASE_POOL, itemFrom: (w) => ({ phrase: w }),
renderItem: (item) => `<div class="name-cell phrase-cell">${item.phrase}</div>`,
stages: [
{
label: "Aşama 1 · Öbekleri İncele",
instruction: () => `Bu kelime öbeklerini birlikte okuyun. Süre dolunca kapanacaklar — çocuktan <b>hatırladığı kadarını</b> tekrar etmesini isteyin, doğru sayısını girin.`,
example: () => ``
},
{
label: "Aşama 2 · Sırayla Tekrar",
instruction: () => `Aynı şekilde inceleyin, çocuktan öbekleri <b>gördüğü sırayla</b> tekrar etmesini isteyin.`,
example: () => ``
},
{
label: "Aşama 3 · Dinleyerek",
listen: true,
instruction: () => `Öbekler gösterilmez; Başlat'a basınca uygulama okur.`,
example: () => ``
}
]
},

{
id: "rt-shapes",
readingLevel: ["pre","post"],
label: "Gördüğün Şekilleri Bul",
isRt: true, attrs: [], speedFactor: 12,
isDone: () => !!rtState && rtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Gördüğün Şekilleri Bul", instruction: () => ``, example: () => `` } ]
},
{
id: "rt-position",
readingLevel: ["pre","post"],
label: "Dolu Daireleri Göster",
isRt: true, attrs: [], speedFactor: 12,
isDone: () => !!rtState && rtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Dolu Daireleri Göster", instruction: () => ``, example: () => `` } ]
},
{
id: "rt-colors",
readingLevel: ["pre","post"],
label: "Renkleri Sırayla Seç",
isRt: true, attrs: [], speedFactor: 12,
isDone: () => !!rtState && rtState.phase === "done",
randomItem: () => ({}),
stages: [ { label: "Renkleri Sırayla Seç", instruction: () => ``, example: () => `` } ]
},
{
id: "shape-recall",
readingLevel: ["pre","post"],
label: "Şekil Hatırlama",
isRecall: true,
attrs: ["shape","color"],
dims: () => isPre() ? [{rows:2, cols:2}, {rows:2, cols:3}, {rows:2, cols:4}] : [{rows:2, cols:4}, {rows:2, cols:5}, {rows:3, cols:4}],
randomItem: () => ({ shape: randomItem(SHAPES), color: randomItem(COLORS) }),
renderItem: (item) => shapeSVG(item.shape, item.color),
stages: [
{
label: "Aşama 1 · Şekilleri İncele",
instruction: () => `Bu şekilleri birlikte inceleyin. Süre dolunca kapanacaklar — çocuktan <b>hangi şekilleri gördüğünü</b> hatırlamasını isteyin, doğru sayısını girin.`,
example: () => ``
},
{
label: "Aşama 2 · Şekil + Renk",
instruction: () => `Aynı şekilde inceleyin, çocuktan hem <b>şekli hem rengini</b> hatırlamasını isteyin.`,
example: () => ``
}
]
},
{
id: "position-recall",
readingLevel: ["pre","post"],
label: "Konum Hatırlama",
isRecall: true,
attrs: ["lit"],
dims: () => isPre() ? [{rows:2, cols:2}, {rows:2, cols:3}, {rows:2, cols:4}] : [{rows:2, cols:4}, {rows:2, cols:5}, {rows:3, cols:4}],
randomItem: () => ({ lit: Math.random() < 0.4, color: randomItem(COLORS) }),
renderItem: (item) => litCircleHTML(item.lit, item.color),
stages: [
{
label: "Aşama 1 · Dolu Daireleri İncele",
instruction: () => `Hangi dairelerin <b>dolu</b> olduğunu birlikte inceleyin. Süre dolunca kapanacak — çocuktan hangi konumların dolu olduğunu hatırlamasını isteyin, doğru sayısını girin.`,
example: () => ``
},
{
label: "Aşama 2 · Sırayla Hatırlama",
instruction: () => `Aynı şekilde inceleyin, çocuktan dolu daireleri <b>soldan sağa sırayla</b> saymasını isteyin.`,
example: () => ``
}
]
},
{
id: "color-recall",
readingLevel: ["pre","post"],
label: "Renk Hatırlama",
isRecall: true,
attrs: ["color"],
dims: () => isPre() ? [{rows:2, cols:2}, {rows:2, cols:3}, {rows:2, cols:4}] : [{rows:2, cols:4}, {rows:2, cols:5}, {rows:3, cols:4}],
randomItem: () => ({ color: randomItem(COLORS) }),
renderItem: (item) => colorSwatchHTML(item.color),
stages: [
{
label: "Aşama 1 · Renkleri İncele",
instruction: () => `Bu renkleri birlikte inceleyin. Süre dolunca kapanacaklar — çocuktan <b>hangi renkleri gördüğünü</b> hatırlamasını isteyin, doğru sayısını girin.`,
example: () => ``
},
{
label: "Aşama 2 · Sırayla Hatırlama",
instruction: () => `Aynı şekilde inceleyin, çocuktan renkleri <b>gördüğü sırayla</b> söylemesini isteyin.`,
example: () => ``
}
]
}
];

