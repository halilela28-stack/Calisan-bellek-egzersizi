/* Zihin Atölyesi — zihin-6-ekran.js (6/8): göz hareketi, tahta düzeni uygulayıcısı (renderBoard/applyBoardLayout), kişi, geçmiş, ayar görünümleri. Dosyalar zihin-atolyesi.html'de bu sırayla yüklenir; sıra değiştirilemez (önceki tek dosyanın ardışık parçalarıdır). */
const EYE_TURN_MS = { pre:[5500, 4000, 3000, 2400], post:[4500, 3200, 2300, 1800] };
const EYE_REF = { w:358, h:280 };   // iPhone 13'teki takip alanı: hız buna göre ayarlı
const eyePathCache = {};
function eyePathLen(ex, w, h, waveAmp){ const key = (ex.motionPattern || ex.id) + "|" + w + "|" + h + "|" + waveAmp; if(eyePathCache[key] != null) return eyePathCache[key];
  const fn = EYE_PATTERNS[ex.motionPattern]; let L = 0;
  if(fn && !ex.statefulFn){ let p = fn(0, waveAmp); for(let i = 1; i <= 120; i++){ const q = fn(i / 120, waveAmp); L += Math.hypot((q.x - p.x) * w, (q.y - p.y) * h); p = q; } }
  else L = (w / EYE_REF.w + h / EYE_REF.h) / 2;   // durum tutan desenler: alanın ortalama büyüme oranı
  return (eyePathCache[key] = L); }
function eyePeriod(ex, t, waveAmp){ const base = (isPre() ? EYE_TURN_MS.pre : EYE_TURN_MS.post)[Math.min(t, 3)] || 3000;
  if(ex.sacKind) return base;   // sıçramalarda süre bekleme ile ayarlı
  const mb = document.getElementById("motionBoard"); if(!mb || !mb.clientWidth) return base;
  const w = mb.clientWidth, h = mb.clientHeight || EYE_REF.h; const r = eyePathLen(ex, w, h, waveAmp) / eyePathLen(ex, EYE_REF.w, EYE_REF.h, waveAmp);
  return Math.round(base * Math.max(1, r));   // takip alanı büyükse süre o oranda uzar: göz her cihazda aynı hızda hareket eder
}
function positionMotionShape(elapsedMs){
const shape = document.getElementById("motionShape");
if(!shape) return;
const ex = currentExercise();
const t = currentCombo().t;
const period = eyePeriod(ex, t, ex.waveAmpByTier ? ex.waveAmpByTier[t] : undefined);
let pos;
if(ex.statefulFn){
pos = ex.statefulFn(elapsedMs, period);
} else {
const cycleT = (elapsedMs % period) / period;
const fn = EYE_PATTERNS[ex.motionPattern] || EYE_PATTERNS.horizontal;
const waveAmp = ex.waveAmpByTier ? ex.waveAmpByTier[t] : undefined;
pos = fn(cycleT, waveAmp);
}
shape.style.left = (pos.x*100) + "%";
shape.style.top = (pos.y*100) + "%";

const pulseAmp = ex.pulseByTier ? (ex.pulseByTier[t] || 0) : 0;
if(pulseAmp > 0){
const pulsePeriod = ex.pulsePeriodMs || 1400;
const pulseT = (elapsedMs % pulsePeriod) / pulsePeriod;
const scale = 1 + pulseAmp * Math.sin(pulseT * 2 * Math.PI);
shape.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
} else {
shape.style.transform = "translate(-50%, -50%)";
}
}

function motionAnimStep(ts){
if(!motionStartTs) motionStartTs = ts;
const elapsed = ts - motionStartTs;
const overallT = Math.min(1, elapsed / motionDurationMs);
positionMotionShape(elapsed);
const fill = document.getElementById("motionProgressFill");
if(fill) fill.style.width = (overallT*100) + "%";
if(overallT < 1 && timerRunning){
motionAnimFrame = requestAnimationFrame(motionAnimStep);
} else if(overallT >= 1){
stopTimer();
}
}

function startEyeMotion(){
motionDurationMs = currentTier().eyeDurationMs || 25000;
motionStartTs = 0;
if(motionAnimFrame) cancelAnimationFrame(motionAnimFrame);
motionAnimFrame = requestAnimationFrame(motionAnimStep);
}

function stopEyeMotion(){
if(motionAnimFrame){
cancelAnimationFrame(motionAnimFrame);
motionAnimFrame = null;
}
motionStartTs = 0;
}

function renderBoard(){
const ex = currentExercise();
const board = document.getElementById("board");
clearAudTimers();
{ const k = document.getElementById("recallKey"); if(k && !recallListen()) k.remove(); }
removeRecallChecklist(); try{ hideCaption(); }catch(e){}
if(!(currentExercise().id === "time-est" && mtState && mtState.kind === "time" && mtState.phase !== "idle" && mtState.phase !== "done")) document.documentElement.classList.remove("hide-clock");
renderSdmtKey();
if(!ex.isTouch){ const ts = document.getElementById("touchStatus"); if(ts) ts.style.display = "none"; }
if(ex.isMotion){
renderMotionBoard();
return;
}
if(ex.isAuditory){
renderAuditoryBoard();
return;
}
if(ex.isSeqRows){
renderOsBoard();
return;
}
if(ex.isFlanker){
renderFlankerBoard();
return;
}
if(ex.isSort){
renderSortBoard();
return;
}
if(ex.isTrail){
renderTrailBoard();
return;
}
if(ex.isPlan){
renderPlanBoard();
return;
}
if(ex.isSearch){
renderSearchBoard();
return;
}
if(ex.isWm){
renderWmBoard();
return;
}
if(ex.isChoice){
renderChoiceBoard();
return;
}
if(ex.isRt){
renderRtBoard();
return;
}
if(ex.isMt){
renderMtBoard();
return;
}
board.style.display = "grid";
board.style.minHeight = "";
board.style.padding = "14px";
board.innerHTML = "";
board.classList.toggle("touch-board", !!ex.isTouch);
currentGrid.forEach((item, idx)=>{
const cell = document.createElement("div");
cell.className = "cell";
cell.dataset.i = idx;
cell.innerHTML = ex.renderItem(item);
board.appendChild(cell);
});
resetTouchState();
applyBoardLayout();
try{ applyRecallListen(); }catch(e){}
}

const landscapeMQ = window.matchMedia("(orientation: landscape) and (max-height: 520px)");
let applyingBoardLayout = false;

function pickLandscapeDims(n, board){
const cs = getComputedStyle(board);
const w = board.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
const h = board.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
if(!(w > 0 && h > 0)) return null;
const gx = parseFloat(cs.columnGap) || 8;
const gy = parseFloat(cs.rowGap) || 6;
const hasText = !!board.querySelector(".name-cell, .stroop-cell, .phrase-cell");
const hasPair = !!board.querySelector(".pair-cell"), hasOdd = !!board.querySelector(".odd-group"); const aspect = hasPair ? 2.1 : hasOdd ? 2.4 : (hasText ? 1.7 : 1);
let best = null;
const exactL = []; for(let c = 2; c < n; c++) if(n % c === 0) exactL.push(c);   /* son satır eksik kalmasın */
for(const c of (exactL.length ? exactL : Array.from({length: n}, (_, i) => i + 1))){
const r = Math.ceil(n / c);
const cw = (w - (c-1)*gx) / c;
const ch = (h - (r-1)*gy) / r;
if(cw <= 0 || ch <= 0) continue;
const score = Math.min(cw / aspect, ch) - (c*r - n) * 0.5;
if(!best || score > best.score) best = {cols:c, rows:r, score};
}
return best;
}

/* Dikey ekran (telefon ve tablet): öğe sayısını koruyup tahtanın genişlik ve yüksekliğine göre en büyük kare hücreyi veren satır/sütun düzenini seç.
   Satırın anlam taşıdığı ya da tek satırlık dizi gösteren çalışmalar dışarıda. */
const NO_REFLOW = new Set(["odd-one-out","position-recall","digit-span","word-list-recall","sentence-repeat","color-recall","shape-recall","sequence-pattern","visual-analogy","nback-shape","nback-color","nback-number"]);
function pickPortraitDims(n, board, rows0, cols0){ try{ if(rows0 < 2 || cols0 < 2 || NO_REFLOW.has(currentExercise().id)) return null; const cs = getComputedStyle(board); const w = board.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const bar = document.querySelector(".controls"); const barH = bar && getComputedStyle(bar).display !== "none" ? bar.getBoundingClientRect().height : 0;
  const focus = document.documentElement.classList.contains("run-focus") && window._rfMax; const availAll = focus ? window._rfMax : Math.max(window.innerHeight - board.getBoundingClientRect().top - barH - 12 - 16, window.innerHeight * 0.62); /* odak dışında sayfa kaydırılabilir: başlık uzun olsa da tahta ekranın en az %62'si kadar yer alabilir (aksi hâlde seçici ham sütuna düşüp hücreleri sıkıştırıyordu) */   /* geçmiş düğmesi kaldırıldı: tahta bu alanı da kullanır */
  const h = availAll - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 16; if(!(w > 0 && h > 120)) return null;
  const gx = parseFloat(cs.columnGap) || 10, gy = (n >= 13 && window.innerWidth < 700 && boardIsPic()) ? 12 : (parseFloat(cs.rowGap) || 26);   /* kalabalık tahtada satır aralığı daralır, resimler büyük kalır */ const hasText = !!board.querySelector(".name-cell, .stroop-cell, .phrase-cell"); const hasPair = !!board.querySelector(".pair-cell"), hasOdd = !!board.querySelector(".odd-group"); const aspect = hasPair ? 2.1 : hasOdd ? 2.4 : (hasText ? 1.7 : 1);
  /* KURAL: tahtada son satır eksik kalmaz — öğe sayısını tam bölen bir sütun sayısı varsa yalnız onlar denenir (15 öğe → 3×5 ya da 5×3, 4 sütun + 1 boş hücre değil) */
  const exact = []; for(let c = 2; c < n; c++) if(n % c === 0) exact.push(c); const tryCols = exact.length ? exact : Array.from({length: Math.max(0, n - 1)}, (_, i) => i + 2);
  let best = null; for(const c of tryCols){ const r = Math.ceil(n / c); if(r < 1 || c * r - n > c - 1) continue; const cw = (w - (c - 1) * gx) / c, ch = (h - (r - 1) * gy) / r; if(cw <= 0 || ch <= 0) continue; const cell = Math.min(cw / aspect, ch); const rem = n % c; const score = cell - (c * r - n) * 0.5 - (rem && rem <= Math.floor(c / 2) ? cell * 0.18 : 0);   /* son satırda yarıdan az kart kalan dizilim cezalı */ if(!best || score > best.score) best = { cols:c, rows:r, cell:Math.floor(cell), cw:Math.floor(Math.min(cw, cell * aspect)), score }; }
  /* KURAL: telefonda düzey yükselip öğe sayısı artınca resimler sıkışıp küçülmez — hücre en az ekran genişliğinin ~%20'si (64–82 px, okul öncesinde 92'ye kadar); gerekirse tahta biraz kaydırılır — 2026-11-05: tek ekran kuralı önceliklidir; tahta ekrana sığmazsa hücreler 36 px'e kadar küçülür */
  { const MINC = Math.round(Math.min(isPre() ? 92 : 82, Math.max(64, window.innerWidth * (isPre() ? 0.24 : 0.2))));
    if(boardIsPic() && best && best.cell < MINC && window.innerWidth < 700){ let alt = null;
      for(const c of tryCols){ const r = Math.ceil(n / c); if(r < 1 || c * r - n > c - 1) continue; const cw = (w - (c - 1) * gx) / c, ch = (h - (r - 1) * gy) / r; const cwA = cw / aspect; if(cwA < MINC * 0.93) continue; const cell = Math.min(cwA, Math.max(Math.min(cwA, ch), MINC)); const rem = n % c; const sc = c * 100 - r - (rem && rem <= Math.floor(c / 2) ? 50 : 0); if(!alt || sc > alt.score) alt = { cols:c, rows:r, cell:Math.floor(cell), cw:Math.floor(Math.min(cw, cell * aspect)), score:sc }; }
      if(alt) best = alt; } }
  return best; }catch(e){ return null; } }
function applyBoardLayout(){
if(applyingBoardLayout) return;
const board = document.getElementById("board");
if(!board || !currentGrid.length) return;
if(currentExercise().isMotion || currentExercise().isAuditory || currentExercise().isSeqRows || currentExercise().isFlanker || currentExercise().isSort || currentExercise().isTrail || currentExercise().isPlan || currentExercise().isSearch || currentExercise().isWm || currentExercise().isChoice || currentExercise().isRt || currentExercise().isMt) return;
if(document.documentElement.classList.contains("run-focus") && window._zaLaidGrid === currentGrid && board.style.gridTemplateRows) return; /* tek ekran: çalışırken aynı tahta yeniden boyutlanmaz (Başlat'ta yerinden oynamaz) */
applyingBoardLayout = true;
try{
window._zaLaidGrid = currentGrid;
let {rows, cols} = currentTier();
let track = "1fr", colTrack = null, rowTrack = null;
if(landscapeMQ.matches){
const best = pickLandscapeDims(currentGrid.length, board);
if(best){ rows = best.rows; cols = best.cols; track = "minmax(0, 1fr)"; }
} else { const best = pickPortraitDims(currentGrid.length, board, rows, cols); if(best){ rows = best.rows; cols = best.cols; colTrack = best.cw + "px"; rowTrack = best.cell + "px"; }
  const RG = ZA_BOARD.RG[currentExercise().id];   /* satır biçimli gruplar: iki sütun, satır yüksekliği içeriğin oranına göre (daireler basık görünmez) */
  if(RG){ const cs = getComputedStyle(board); const w = board.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); const gx = parseFloat(cs.columnGap) || 10; const cw = Math.floor((w - (cols - 1) * gx) / cols); colTrack = cw + "px"; rowTrack = Math.max(40, Math.round(cw / RG)) + "px"; } }
/* KURAL (tahta düzeni, 2026-11-05 — kullanıcının yeniden düzenlediği kurallar): 1) resimler büyük olur; 2) çalışırken tahtanın bütün satırları görünür; 3) başlamadan önce üstteki bütün satırlar (başlık, çipler, yönerge, süre, hata) yerindedir; 4) Başlat'ta yönerge, süre (Bitir) ve hata sayısı görünür kalır, başlık, çipler, Bugün/ödev çubuğu ve alttaki düğmeler gizlenir, Bitir'de geri gelir; 5) çalışma sürerken tahta oynamaz. Bunun için resimli/şekilli tahtada sütun sayısı, çalışırken tahtaya kalan alana göre resimler EN BÜYÜK olacak biçimde seçilir (ör. 15 resim telefonda 5×3; son satır eksik kalmaz, okuma sırası soldan sağa); başlamadan önce de aynı boy kullanılır, böylece Başlat'ta resimler yeniden boyutlanmaz. Eski "hücre en az ekranın %20'si" ve "tahta Başlat'ta yerinden oynamaz" kurallarının yerine */
    let fitOver = false; if(rowTrack && !landscapeMQ.matches && boardIsPic() && !ZA_BOARD.isSpecial(currentExercise().id)){ const g = ZA_BOARD.picGrid(board, currentGrid.length); if(g){ cols = g.cols; rows = g.rows; rowTrack = g.rowTrack; colTrack = g.colTrack; fitOver = g.fitOver; } }
    board.style.rowGap = (!landscapeMQ.matches && currentGrid.length >= 13 && window.innerWidth < 700 && rowTrack && boardIsPic()) ? "12px" : "";
board.style.gridTemplateColumns = `repeat(${cols}, ${colTrack || track})`;
board.style.gridTemplateRows = `repeat(${rows}, ${rowTrack || track})`; board.style.justifyContent = colTrack ? "center" : ""; board.style.alignContent = rowTrack ? (fitOver ? "start" : "center") : "";
board.classList.toggle("wide-grid", cols >= 5 || rows >= 5); centerLastRow(board, cols); renderRowDividers(board, rows, cols);
fitTextCells(board);
const gridAtLayout = currentGrid;
requestAnimationFrame(()=>{
requestAnimationFrame(()=>{
if(document.getElementById("board") === board && currentGrid === gridAtLayout){
renderRowDividers(board, rows, cols);
}
});
});
} finally {
applyingBoardLayout = false;
}
}

/* Son satırı ortala: kart sayısı sütuna bölünmüyorsa kalan kartlar sola yığılmasın (sıra ve dokunma mantığı değişmez, yalnızca yerleşim) */
function centerLastRow(board, cols){ try{ const items = [...board.children].filter(e => e.classList && e.classList.contains("cell")); items.forEach(e => { e.style.gridColumn = ""; e.style.gridColumnStart = ""; e.style.justifySelf = ""; e.style.width = ""; e.style.maxWidth = ""; }); const n = items.length, rem = n % cols; if(!cols || cols < 2 || !rem) return;
  const last = items.slice(n - rem); if(rem === 1){ last[0].style.gridColumn = "1 / -1"; last[0].style.justifySelf = "center"; const w = items[0].getBoundingClientRect().width; last[0].style.width = w ? w + "px" : ""; last[0].style.maxWidth = w ? w + "px" : ""; return; }
  if((cols - rem) % 2 === 0) last[0].style.gridColumnStart = String((cols - rem) / 2 + 1); }catch(e){} }
function setLsOpen(open){
document.documentElement.classList.toggle("ls-open", !!open);
const btn = document.getElementById("lsToggleBtn");
if(btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
}

/* KURAL (okunabilirlik): sözcük/öbek hücrelerinde yazı 14px'in altına düşmez; sığmazsa sütun sayısı azaltılır (sözcük 3, ikili/öbek 2, soru cümlesi 1 sütun) ve yazı satır kırarak sığar; okuma sırası soldan sağa, yukarıdan aşağı korunur */
function fitTextCells(board){ const textEls = Array.from(board.querySelectorAll(".name-cell")); board.classList.remove("txt-wrap"); board.style.removeProperty("--txt-cols"); if(textEls.length === 0) return; textEls.forEach(el=>{ el.style.fontSize = ""; }); let size = Math.min(...textEls.map(el => parseFloat(getComputedStyle(el).fontSize))); const floor = (currentExercise() || {}).id === "stroop" ? 12 : 14;   /* Stroop: büyük harfli, yüksek karşıtlıklı renk adları 12px'e kadar küçülebilir; ızgara düzeni (hızlı okuma) korunur */
  function fitsAll(testSize){ return textEls.every(el=>{ el.style.fontSize = testSize + "px"; return el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 2; }); }
  let guard = 0; while(!fitsAll(size) && size > floor && guard < 30){ size -= 1; guard++; }
  if(!fitsAll(size)){ const curCols = (getComputedStyle(board).gridTemplateColumns || "").split(" ").filter(Boolean).length || 4; const n = board.querySelectorAll(":scope > .cell").length || textEls.length; const L = Math.max(...textEls.map(el => (el.textContent || "").trim().length)); const want = L > 22 ? 1 : L > 9 ? 2 : 3;
    /* sütun sayısı hücre sayısını tam bölmeli (son satır eksik kalmaz): önce istenen genişliğe en yakın bölen, sığmazsa daha az sütun */
    const divs = []; for(let c = curCols; c >= 1; c--) if(n % c === 0) divs.push(c); const order = divs.filter(c => c <= want).concat(divs.filter(c => c > want).reverse());
    board.classList.add("txt-wrap"); let chosen = order[order.length - 1] || 1;
    for(const c of order){ board.style.setProperty("--txt-cols", c); if(fitsAll(floor)){ chosen = c; break; } }
    board.style.setProperty("--txt-cols", chosen); size = 17; guard = 0; while(!fitsAll(size) && size > floor && guard < 20){ size -= 1; guard++; } }
  textEls.forEach(el=>{ el.style.fontSize = Math.max(floor, size) + "px"; });
  /* son güvence: ekrandaki sütun sayısı hücre sayısını bölmüyorsa (son satır eksik), bölen bir sütun sayısına geçilir */
  try{ const n = board.querySelectorAll(":scope > .cell").length, cc = (getComputedStyle(board).gridTemplateColumns || "").split(" ").filter(Boolean).length; if(n > 1 && cc > 1 && n % cc){ let c = cc; while(c > 1 && n % c) c--; /* bölen yoksa tek sütun (okunaklı liste) */ board.classList.add("txt-wrap"); board.style.setProperty("--txt-cols", c); let z = Math.max(floor, size); textEls.forEach(el => el.style.fontSize = z + "px"); } }catch(e){} }
/* KURAL (iPhone/iPad): dokunmatik cihazda giriş alanları en az 16px — Safari alana dokununca sayfayı yakınlaştırmaz */
/* KURAL: bütün çalışma yönergelerinin başında "Yönerge:" etiketi yazar */
/* KURAL: Değerlendirme turu ekranı yüksekliğe sığmazsa (alçak yatay ekran) içerik orantılı küçültülür; seçenekler ekranın altında kalmaz */
(function placeFitHeight(){ try{ const fit = () => { const el = document.getElementById("placeScreen"); if(!el || el.style.display === "none") return; const w = el.querySelector(".adv-wrap"); if(!w) return; w.style.zoom = ""; const avail = el.clientHeight - 12, h = w.getBoundingClientRect().height; if(h > avail && avail > 200){ w.style.zoom = Math.max(0.78, avail / h).toFixed(3); } }; let t = 0; new MutationObserver(() => { clearTimeout(t); t = setTimeout(fit, 30); }).observe(document.body, { childList: true, subtree: true }); window.addEventListener("resize", () => setTimeout(fit, 60)); }catch(e){} })();
/* KURAL: Değerlendirme turunda soru satırı en az iki satır yer kaplar (yazı değişince bardaklar/seçenekler kaymaz); ana sayfadaki ayar dişlisi kutusunda ortalı */
/* KURAL: kural bulma kutuları ekrana sığar, kartlar kutudan taşmaz */
/* KURAL: kart/hücre içindeki yazı (sayı, kelime) kartından taşmaz — sığmazsa yazı küçülür (en az 11px) */
(function fitCardText(){ try{ const fit = () => { const b = document.getElementById("board"); if(!b) return; b.querySelectorAll(".wm-pic > b, .wm-card > b, .wm-pic > span, .wm-card > span").forEach(t => { const par = t.parentElement; if(!par || t.querySelector("img,svg")) return; t.style.fontSize = t.dataset.fs0 || t.style.fontSize; const avail = par.clientWidth - 6; if(avail <= 0) return; if(!t.dataset.fs0) t.dataset.fs0 = t.style.fontSize || getComputedStyle(t).fontSize; const w = t.scrollWidth; if(w > avail){ const cur = parseFloat(getComputedStyle(t).fontSize); t.style.fontSize = Math.max(11, Math.floor(cur * avail / w)) + "px"; t.style.letterSpacing = "0"; t.style.whiteSpace = "nowrap"; } }); }; const lsFit = () => { const b = document.getElementById("board"); if(!b) return; if(innerWidth > innerHeight && innerHeight < 520){ const top = b.getBoundingClientRect().top + (document.getElementById("mainApp") || document.body).scrollTop * 0; let room = Math.floor(innerHeight - Math.max(0, top) - 8); if(room < 200 && timerRunning && b.dataset.lsTop !== "1"){ b.dataset.lsTop = "1"; try{ b.scrollIntoView({ block: "start" }); }catch(e){} room = Math.floor(innerHeight - Math.max(0, b.getBoundingClientRect().top) - 8); } if(!timerRunning) delete b.dataset.lsTop; b.style.maxHeight = (room >= 200 ? room : Math.floor(innerHeight - 16)) + "px"; b.style.overflowY = "auto"; try{ const bt = b.querySelector('[data-mtbtn$="-done"], [data-ecstep], [data-judge="9"]'); if(bt){ let el = bt.closest(".wm-btns") || bt; while(el.parentElement && el.parentElement !== b && el.parentElement.getBoundingClientRect().height < b.clientHeight * 0.6) el = el.parentElement; if(el !== b){ el.style.position = "sticky"; el.style.bottom = "0"; el.style.zIndex = "6"; el.style.background = "linear-gradient(to bottom, rgba(255,255,255,0), var(--card,#fff) 30%)"; }
      const bb = b.getBoundingClientRect(); if(bt.getBoundingClientRect().bottom > bb.bottom + 1){ const row = bt.closest(".wm-btns") || bt; const wrap = b.querySelector(".wm-wrap") || b.firstElementChild; if(wrap && row.parentElement !== wrap && !row.dataset.lsMoved){ row.dataset.lsMoved = "1"; wrap.appendChild(row); row.style.position = "sticky"; row.style.bottom = "0"; row.style.zIndex = "6"; row.style.background = "var(--card,#fff)"; row.style.paddingTop = "6px"; } } } }catch(e){}   /* yapıştırma yetmezse düğme satırı tahtanın en altına taşınır */   /* yatay telefonda ana düğme satırı tahtanın altına yapışır */ } else if(b.style.maxHeight){ b.style.maxHeight = ""; b.style.overflowY = ""; } };   /* KURAL: yatay telefonda tahta ekranın altına taşmaz; ana düğme ilk bakışta görünür */
  let tm = 0; const go = () => { clearTimeout(tm); tm = setTimeout(() => { fit(); lsFit(); }, 20); }; const start = () => { const b = document.getElementById("board"); if(!b) return setTimeout(start, 500); new MutationObserver(go).observe(b, { childList: true, subtree: true }); window.addEventListener("resize", go); }; start(); }catch(e){} })();
(function ecountClicks(){ try{ document.addEventListener("click", (e) => { const st = (typeof mtState !== "undefined") ? mtState : null; if(!st || st.kind !== "ecount" || !timerRunning) return; const c = e.target.closest("[data-ecstep]"); if(c){ st.ecPhase = "answer"; renderMtBoard(); return; } const a = e.target.closest("[data-ecans]"); if(a && st.ecPhase === "answer"){ const tr = st.trials[st.ti], n = +a.dataset.ecans; st.ecPick = n; st.ecPhase = "fb"; if(n !== tr.ans){ currentErrorCount++; const ce = document.getElementById("errorCount"); if(ce) ce.textContent = String(currentErrorCount); try{ gameSfx("wrong"); }catch(e2){} } else { try{ gameSfx("correct"); }catch(e2){} } renderMtBoard(); } }, true); }catch(e){} })();
/* KURAL (düzen, 2026-11-04): çocuk ve yetişkin ekranlarında da hiçbir yazı 11 px'ten küçük olmaz — etkinlik çipleri (KİŞİ/DÜZEY/AŞAMA), Zihin Adaları üst çubuğu ve sekmeleri, alan rozetleri, Harf Arama "YOK" */
/* KURAL (düzen): ekrandaki hiçbir yazı 11 px'ten küçük olmaz ("Isınma" etiketi 12, BAŞLA/BİTİŞ 11) */
/* KURAL: etkinlik şeridi yalnız yana kayar; aşağı-yukarı esnemez, düğmeler (gölgeleriyle) kesilmez, kaydırma çubuğu görünmez */
/* KURAL: tahta kaydırılabilir olsa da "Bitti"/"Devam"/"Sonraki" düğmesi tahtanın altında hep görünür (yapışık); yatay telefonda tahta ekran yüksekliğine sığar ve kendi içinde kayar */
/* KURAL: tek resimli uyaran tablette de en çok ~340 px (Değerlendirme turu), yakınlaştırılan parça en çok 300 px — resim çözünürlüğünün üstüne büyütülmez */
/* KURAL: resimler basık/uzamış gösterilmez (oran korunur) */
/* KURAL (dokunma alanı): tahtadaki düğmeler en az 40px yüksekliğinde; köprü tahtalarının dokunma alanı büyütüldü */
function renderDots(){
const dots = document.getElementById("dots");
dots.innerHTML = "";
const exCount = currentCategoryExercises().length;
SEQUENCE.forEach((combo, i)=>{
const d = document.createElement("div");
const isGroupEnd = (i % exCount) === exCount - 1 && i !== SEQUENCE.length - 1;
d.className = "dot" + (i === currentIndex ? " on" : "") + (isGroupEnd ? " group-end" : "");
dots.appendChild(d);
});
}


/* KURAL (etkinlik sayfası üst kısmı, 2026-11-02 tasarımı): üstte tek satır — geri, alan adı + mod etiketi, etkinlik adı ve açılır etkinlik listesi (bölümlü, aramalı), sağda eşitleme · ayarlar · ana sayfa; altında üç çip — Kişi, Düzey, Aşama (tek aşamalı çalışmada Aşama çipi yok); her çip küçük bir menü açar. Eski üst satırlar (uygulama başlığı, alan/sayfa, düzey satırı, etkinlik şeridi, aşama satırı, kişi satırı) gizlidir ama işlevleri aynen kullanılır (seçimler onların düğmelerine iletilir). */
const EXH_IC = { x: '<path d="M6 6l12 12M18 6L6 18"/>', back: '<path d="M15 6l-6 6 6 6"/>', down: '<path d="M6 9l6 6 6-6"/>', up: '<path d="M6 15l6-6 6 6"/>', cloud: '<path d="M7 18h10a4 4 0 0 0 .6-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18z"/>', home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>', gauge: '<path d="M4.5 17a8 8 0 1 1 15 0"/><path d="M12 13l3.5-4"/>', layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', plus: '<path d="M12 5v14M5 12h14"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>' };
const exhSvg = (k, sz) => `<svg viewBox="0 0 24 24" width="${sz || 20}" height="${sz || 20}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${EXH_IC[k]}</svg>`;
function exhClose(){ document.querySelectorAll(".exh-pop, .exh-bd").forEach(x => x.remove()); document.querySelectorAll("#exHead [aria-expanded='true']").forEach(b => { b.setAttribute("aria-expanded", "false"); b.classList.remove("open"); }); }
function exhMenu(anchor, items, opts){ exhClose(); opts = opts || {}; const bd = document.createElement("div"); bd.className = "exh-bd"; bd.onclick = exhClose; document.body.appendChild(bd);
  const pop = document.createElement("div"); pop.className = "exh-pop" + (opts.wide ? " wide" : ""); pop.setAttribute("role", "listbox");
  const draw = (q) => { const qq = (q || "").toLocaleLowerCase("tr"); /* KURAL (menü kapatma, 2026-11-08): etkinlik/kişi/düzey menüsünün sağ üstünde ✕ düğmesi vardır; seçim yapmadan ✕ ile, dışına dokunarak ya da Esc ile kapanır */ const xBtn = `<button type="button" class="exh-x" aria-label="Kapat">${exhSvg("x", 18)}</button>`; let html = opts.search ? `<div class="exh-top"><label class="exh-srch">${exhSvg("search", 16)}<input type="search" placeholder="Etkinlik ara…" value="${escHTML(q || "")}" aria-label="Etkinlik ara"></label>${xBtn}</div>` : `<div class="exh-top exh-top-x">${xBtn}</div>`; let pendingHead = null, any = false;
    items.forEach((it, i) => { if(it.head){ pendingHead = it; return; } if(qq && !it.label.toLocaleLowerCase("tr").includes(qq)) return; if(pendingHead){ html += `<div class="exh-hd">${escHTML(pendingHead.head)}</div>`; pendingHead = null; } any = true; html += `<button type="button" class="exh-it${it.active ? " on" : ""}${it.add ? " add" : ""}" data-i="${i}" role="option" aria-selected="${it.active ? "true" : "false"}">${it.active ? exhSvg("check", 16) : it.add ? exhSvg("plus", 16) : '<span class="exh-sp"></span>'}<span class="exh-lb">${escHTML(it.label)}</span>${it.note ? `<span class="exh-nt">${escHTML(it.note)}</span>` : ""}</button>`; });
    if(!any) html += `<div class="exh-empty">Bulunamadı</div>`; pop.innerHTML = html;
    pop.querySelectorAll(".exh-it").forEach(b => b.onclick = (e) => { e.stopPropagation(); const it = items[+b.dataset.i]; exhClose(); try{ it.pick(); }catch(err){ console.error(err); } }); const xb = pop.querySelector(".exh-x"); if(xb) xb.onclick = (e) => { e.stopPropagation(); exhClose(); };
    const inp = pop.querySelector("input"); if(inp){ inp.oninput = () => { const v = inp.value, pos = inp.selectionStart; draw(v); const n = pop.querySelector("input"); if(n){ n.focus(); try{ n.setSelectionRange(pos, pos); }catch(e){} } }; } };
  draw(""); document.body.appendChild(pop); try{ const onKey = (ev) => { if(ev.key === "Escape"){ exhClose(); document.removeEventListener("keydown", onKey); } }; document.addEventListener("keydown", onKey); }catch(e){}
  const r = anchor.getBoundingClientRect(), W = Math.min(window.innerWidth - 16, opts.wide ? 420 : Math.max(r.width, 190)); let left = opts.wide ? Math.max(8, (window.innerWidth - W) / 2) : Math.min(Math.max(8, r.left), window.innerWidth - W - 8);
  pop.style.width = W + "px"; pop.style.left = left + "px"; pop.style.top = (r.bottom + 6) + "px"; pop.style.maxHeight = Math.max(200, window.innerHeight - r.bottom - 24) + "px";
  anchor.setAttribute("aria-expanded", "true"); anchor.classList.add("open"); const act = pop.querySelector(".exh-it.on"); if(act && opts.wide) try{ act.scrollIntoView({ block: "center" }); }catch(e){} }
/* KURAL (etkinlik adı, 2026-11-04 kararı): etkinlik sayfası üst satırındaki etkinlik adı telefonda "…" ile kesilmez — önce 20 px'ten en az 14 px'e küçülür, yine sığmazsa iki satıra iner; çok dar ekranda (iPhone SE) iki satıra da sığmayan uzun adlar 12 px'e kadar küçülür, gerekirse üç satır olur */
function exhFitName(){ try{ const n = document.querySelector("#exHead .exh-exnm"); if(!n || !n.clientWidth) return; const s = n.style; s.fontSize = ""; s.whiteSpace = "nowrap"; s.display = ""; s.webkitLineClamp = ""; s.webkitBoxOrient = ""; s.lineHeight = ""; s.textOverflow = ""; let fs = parseFloat(getComputedStyle(n).fontSize) || 20; while(n.scrollWidth > n.clientWidth + 1 && fs > 14){ fs -= 1; s.fontSize = fs + "px"; } if(n.scrollWidth > n.clientWidth + 1){ s.whiteSpace = "normal"; s.display = "-webkit-box"; s.webkitBoxOrient = "vertical"; s.webkitLineClamp = "2"; s.lineHeight = "1.12"; s.textOverflow = "clip"; s.overflowWrap = "anywhere"; while(n.scrollHeight > n.clientHeight + 1 && fs > 12){ fs -= 1; s.fontSize = fs + "px"; } if(n.scrollHeight > n.clientHeight + 1) s.webkitLineClamp = "3"; } }catch(e){} }
window.addEventListener("resize", () => { try{ exhFitName(); }catch(e){} });
function renderExHead(){ try{
  const host = document.getElementById("lsMore"); if(!host) return; let el = document.getElementById("exHead"); if(!el){ el = document.createElement("div"); el.id = "exHead"; host.insertBefore(el, host.firstChild); }
  document.documentElement.classList.add("exh-on"); try{ const exT = currentExercise(); document.documentElement.classList.toggle("pre-tight", !!(exT && isInteractiveExercise(exT) && !usesManualErrors(exT))); }catch(e){}
  const cat0 = currentCategory() || {}, cat = { name: ((document.getElementById("categoryLabel") || {}).textContent || "").trim() || cat0.label || cat0.name || "" }, ex = currentExercise() || {}, mode = ((document.getElementById("modeLabel") || {}).textContent || "").trim();
  const tierBtns = [...document.querySelectorAll("#tierRow .tier-btn")], tierAct = tierBtns.find(b => b.classList.contains("active")), tierTx = tierAct ? tierAct.textContent.replace(/\s*Düzey\s*$/i, "").trim() : "";
  const stBtns = [...document.querySelectorAll("#stageRow .stage-btn")], stAct = stBtns.findIndex(b => b.classList.contains("active"));
  const sel = document.getElementById("playerSelect"), who = sel && sel.value && sel.value !== "__new__" ? sel.value : "";
  const cloud = document.getElementById("cloudBadge"), cloudOn = cloud && cloud.classList.contains("on");
  const av = who ? (() => { try{ return avatarHTML(who, 26); }catch(e){ return `<span class="exh-av">${escHTML(who[0] || "?")}</span>`; } })() : `<span class="exh-av none">${exhSvg("user", 15)}</span>`;
  el.innerHTML = `<div class="exh-top"><button type="button" class="exh-ib" id="exhBack" aria-label="Geri: ${escHTML(cat.name || "Alan")}">${exhSvg("back")}</button>
    <div class="exh-ttl"><div class="exh-cat"><span>${escHTML(cat.name || "")}</span>${mode ? `<span class="exh-mode">${escHTML(mode)}</span>` : ""}</div><button type="button" class="exh-exbtn" id="exhExBtn" aria-haspopup="listbox" aria-expanded="false"><span class="exh-exnm">${escHTML(ex.label || "")}</span>${exhSvg("down", 16)}</button></div>
    <div class="exh-ics"><button type="button" class="exh-ib cloud${cloudOn ? " on" : ""}" id="exhCloud" aria-label="${cloudOn ? "Eşitlendi" : "Eşitleme"}">${exhSvg("cloud", 19)}</button><button type="button" class="exh-ib" id="exhSet" aria-label="Ayarlar">${(document.getElementById("settingsIconSlot") || {}).innerHTML || exhSvg("gauge", 19)}</button><button type="button" class="exh-ib home" id="exhHome" aria-label="Ana menü">${exhSvg("home", 19)}</button></div></div>
    <div class="exh-chips${stBtns.length > 1 ? "" : " two"}"><button type="button" class="exh-chip" id="exhWho" aria-haspopup="listbox" aria-expanded="false">${av}<span class="exh-cv"><small>KİŞİ</small><b>${escHTML(who || "Seç")}</b></span>${exhSvg("down", 14)}</button>
    <button type="button" class="exh-chip" id="exhTier" aria-haspopup="listbox" aria-expanded="false"${tierBtns.length < 2 ? " disabled" : ""}><span class="exh-ci">${exhSvg("gauge", 19)}</span><span class="exh-cv"><small>DÜZEY</small><b>${escHTML(tierTx || "-")}</b></span>${tierBtns.length > 1 ? exhSvg("down", 14) : ""}</button>
    ${stBtns.length > 1 ? `<button type="button" class="exh-chip" id="exhStage" aria-haspopup="listbox" aria-expanded="false"><span class="exh-ci">${exhSvg("layers", 19)}</span><span class="exh-cv"><small>AŞAMA</small><b>${stAct >= 0 ? stAct + 1 : 1}</b></span>${exhSvg("down", 14)}</button>` : ""}</div>`;
  const $q = (id) => document.getElementById(id);
  $q("exhBack").onclick = () => { exhClose(); const b = $q("categorySwitchBtn"); if(b) b.click(); };
  $q("exhCloud").onclick = () => { const b = $q("cloudBadge"); if(b) b.click(); };
  $q("exhSet").onclick = () => { const b = $q("settingsBtn"); if(b) b.click(); };
  $q("exhHome").onclick = (e) => { e.stopPropagation(); const b = document.querySelector("#lsMore .top-btns .home-btn"); if(b) b.click(); else { try{ goHome(); }catch(err){} } };
  $q("exhExBtn").onclick = (e) => { e.stopPropagation(); if(e.currentTarget.classList.contains("open")) return exhClose(); const items = []; document.querySelectorAll("#exerciseRow .exercise-group-label, #exerciseRow .exercise-btn").forEach(n => { if(n.classList.contains("exercise-group-label")) items.push({ head: n.textContent.replace(/[▸▾›]/g, "").trim() }); else items.push({ label: n.textContent.trim(), active: n.classList.contains("active"), note: n.classList.contains("done") ? "✓ yapıldı" : "", pick: () => n.click() }); }); exhMenu(e.currentTarget, items, { wide: true, search: items.filter(x => !x.head).length > 8 }); };
  $q("exhTier").onclick = (e) => { e.stopPropagation(); if(e.currentTarget.classList.contains("open")) return exhClose(); exhMenu(e.currentTarget, tierBtns.map(b => ({ label: b.textContent.trim(), active: b.classList.contains("active"), pick: () => b.click() }))); };
  if($q("exhStage")) $q("exhStage").onclick = (e) => { e.stopPropagation(); if(e.currentTarget.classList.contains("open")) return exhClose(); exhMenu(e.currentTarget, stBtns.map((b, i) => ({ label: `Aşama ${i + 1}`, active: b.classList.contains("active"), pick: () => b.click() }))); };
  $q("exhWho").onclick = (e) => { e.stopPropagation(); if(e.currentTarget.classList.contains("open")) return exhClose(); const s2 = $q("playerSelect"); if(!s2) return; const items = [...s2.options].filter(o => o.value && o.value !== "__new__").map(o => ({ label: o.textContent, active: o.value === s2.value, pick: () => { s2.value = o.value; s2.dispatchEvent(new Event("change", { bubbles: true })); setTimeout(renderExHead, 30); } })); items.push({ label: "Yeni kişi ekle", add: true, pick: () => { s2.value = "__new__"; s2.dispatchEvent(new Event("change", { bubbles: true })); setTimeout(renderExHead, 400); } }); exhMenu(e.currentTarget, items); };
}catch(err){ console.error("exHead", err); }  try{ exhFitName(); }catch(e){} }
document.addEventListener("change", (e) => { if(e.target && e.target.id === "playerSelect") setTimeout(renderExHead, 30); }, true);
window.addEventListener("resize", exhClose);

function renderAll(){ try{
try{ const __c = currentCategory(); if(__c && __c.color) document.documentElement.style.setProperty("--cat", __c.color); }catch(e){}   /* alan renk kimliği */
document.getElementById("pageIndicator").textContent = `${(() => { try{ const c = CATEGORIES[currentCategoryIndex]; const n = (appMode === "aile" && typeof famProfile === "function") ? famProfile() : currentPlayerName; const info = c ? catLevelInfo(c.id, n) : null; return info && info.by !== "genel" ? (readingLevel === "pre" ? "Okul Öncesi · " : "Okul Sonrası · ") : ""; }catch(e){ return ""; } })()}${currentTier().label} · Sayfa ${currentIndex+1}/${SEQUENCE.length}`;
const lsPageEx = document.getElementById("lsPageEx");
const lsPageInfo = document.getElementById("lsPageInfo");
if(lsPageEx) lsPageEx.textContent = currentExercise().label;
if(lsPageInfo) lsPageInfo.textContent = `${currentTier().label} · ${currentIndex+1}/${SEQUENCE.length}`;
renderInstruction();
renderBoard();
renderDots();
 try{ renderExHead(); }catch(e){} }finally{ ZA_LIFE.afterRender(); try{ zaAutoErrClass(); }catch(e){} } }

function refreshHistoryIfVisible(){
const screen = document.getElementById("historyScreen");
if(screen && screen.style.display !== "none"){
renderHistory();
}
}

/* Kaydırma konumunu koru (Karıştır gibi tahtayı yeniden çizen işlemlerde iOS Safari konumu yukarı çekebiliyor) */
function keepScrollSnapshot(){ const els = [document.scrollingElement, document.documentElement, document.body, document.getElementById("mainApp")].filter(Boolean); return { els, tops: els.map(e => e.scrollTop), winY: window.scrollY }; }
function restoreScrollSnapshot(snap){ if(!snap) return; const apply = () => { snap.els.forEach((e, i) => { if(e && Math.abs(e.scrollTop - snap.tops[i]) > 2) e.scrollTop = snap.tops[i]; }); if(Math.abs(window.scrollY - snap.winY) > 2) window.scrollTo(0, snap.winY); }; apply(); requestAnimationFrame(apply); setTimeout(apply, 60); setTimeout(apply, 180); }
function newPage(){ if(qsRuleKey) qsRulePrev = qsRuleKey; qsRuleKey = null; /* Hızlı Seç: her yeni sayfada, bir önceki sayfadan farklı bir kural seçilir */
try{ chClear(); mtClear(); }catch(e){}   /* önceki sayfanın bekleyen zamanlayıcıları (seçimli tepki / etkileşimli tahta) yeni sayfada Başlat'tan sonra tahtayı yeniden çizmesin */
document.documentElement.classList.remove("board-run");
setLsOpen(false);
const ex = currentExercise();
const {rows, cols} = currentTier();
stopEyeMotion();
if(ex.isMotion){
currentGrid = [];
} else {
currentGrid = generateGrid(ex, rows, cols);
}
const label = document.getElementById("errorRowLabel");
if(label){
if(ex.isMotion) label.textContent = "Gözden kaçırma / baş çevirme sayısı";
else if(ex.isRecall) label.textContent = "Doğru hatırlanan sayısı";
else if(ex.errorLabel) label.textContent = ex.errorLabel;
else if(ex.isAuditory) label.textContent = "Yanlış söylenen dizi sayısı";
else label.textContent = "Hata sayısı";
}
syncErrHintWatch();
renderAll();
resetTimer();
const flash = document.getElementById("levelFlash");
if(flash){ clearTimeout(flash._hideTimer); flash.style.display = "none"; }
refreshHistoryIfVisible();
}

let firestoreReady = false;
let sessionHistory = [];
/* KURAL (veri): internetsiz kaydedilen çalışmalar uygulama yeniden açılınca da raporlarda görünür (buluta gidene kadar bekleyen kayıtlardan) */
function pendingSessionRecs(){ try{ return loadPendingWrites().filter(x => x && x.coll === "sessions" && x.data).map(x => Object.assign({}, x.data)); }catch(e){ return []; } }
setTimeout(() => { try{ if(!sessionHistory.length){ sessionHistory = pendingSessionRecs(); } }catch(e){} }, 0);
let levelEvents = [];

function updateCloudBadge(){
const badge = document.getElementById("cloudBadge");
if(!badge) return;
const pending = firestoreReady ? 0 : pendingWriteCount();
if(firestoreReady){
badge.innerHTML = `<span class="ui-icon-slot">${uiIconSVG("cloud")}</span> Bulut`;
} else if(pending > 0){
badge.innerHTML = `<span class="ui-icon-slot">${uiIconSVG("cloud-off")}</span> Yerel · ${pending} bekliyor`;
} else {
badge.innerHTML = `<span class="ui-icon-slot">${uiIconSVG("cloud-off")}</span> Yerel`;
}
badge.className = "cloud-badge " + (firestoreReady ? "on" : "off");
}

function initFirestore(){
try{
if(!window.__fb){
console.warn("Firebase modülü hazır değil, yerel belleğe devam ediliyor.");
updateCloudBadge();
return;
}
const { db, collection, onSnapshot, query, where, uid } = window.__fb;
if(!uid){
console.warn("Kullanıcı kimliği yok, yerel belleğe devam ediliyor.");
updateCloudBadge();
return;
}
const mine = (name)=> query(collection(db, name), where("uid", "==", uid));
const byT = (a, b)=> (a.t || 0) - (b.t || 0);

onSnapshot(mine("sessions"), (snap)=>{
sessionHistory = snap.docs.map(d=>d.data()).concat(pendingSessionRecs()).sort(byT);   /* henüz buluta gitmemiş kayıtlar da listede */
firestoreReady = true;
updateCloudBadge();
refreshHistoryIfVisible();
renderPersonDataList();
flushPendingWrites();
}, (err)=>{
console.error("Firestore sessions okuma hatası:", err);
firestoreReady = false;
updateCloudBadge();
});

onSnapshot(mine("levelEvents"), (snap)=>{
levelEvents = snap.docs.map(d=>d.data()).sort(byT);
refreshHistoryIfVisible();
renderPersonDataList();
}, (err)=>{
console.error("Firestore levelEvents okuma hatası:", err);
});

onSnapshot(mine("players"), (snap)=>{
playersList = snap.docs.map(d=>d.data().name).sort((a, b)=> String(a).localeCompare(String(b), "tr"));
snap.docs.forEach(d=>{
const data = d.data();
if(data.readingLevel) rememberPlayerLevel(data.name, data.readingLevel);
});
renderPlayerOptions();
renderPersonDataList();
renderLevelPlayerOptions();
}, (err)=>{
console.error("Firestore players okuma hatası:", err);
});
}catch(e){
console.error("Firebase başlatılamadı, yerel belleğe devam ediliyor:", e);
firestoreReady = false;
updateCloudBadge();
}
}

window.addEventListener("firebase-ready", initFirestore);

function loadSessions(){
return sessionHistory.slice();
}

const PENDING_KEY = "wm_pending_writes_v1";

function loadPendingWrites(){
try{
const raw = localStorage.getItem(PENDING_KEY);
return raw ? JSON.parse(raw) : [];
}catch(e){ return []; }
}
function savePendingWrites(list){
try{ localStorage.setItem(PENDING_KEY, JSON.stringify(list)); }catch(e){}
}
function queuePendingWrite(coll, data){
const list = loadPendingWrites();
list.push({coll, data});
while(list.length > 500) list.shift();
savePendingWrites(list);
updateCloudBadge();
}
function pendingWriteCount(){
return loadPendingWrites().length;
}
function flushPendingWrites(){
if(!(firestoreReady && window.__fb)) return;
const list = loadPendingWrites();
if(list.length === 0) return;
const { db, collection, addDoc } = window.__fb;
const remaining = [];
let left = list.length;
list.forEach((item)=>{
addDoc(collection(db, item.coll), withUid(item.data))
.catch(()=> remaining.push(item))
.finally(()=>{
left--;
if(left === 0){
savePendingWrites(remaining);
updateCloudBadge();
}
});
});
}
window.addEventListener("online", flushPendingWrites);

function renderPersonDataList(){
const box = document.getElementById("personDataList");
if(!box) return;
box.innerHTML = "";
const names = Array.from(new Set(
playersList.concat(sessionHistory.map(r=>r.player), levelEvents.map(e=>e.player)).filter(Boolean)
)).sort((a, b)=> String(a).localeCompare(String(b), "tr"));
if(names.length === 0){
const empty = document.createElement("div");
empty.className = "settings-note";
empty.textContent = "Henüz kayıtlı kişi yok.";
box.appendChild(empty);
return;
}
names.forEach(name=>{
const count = sessionHistory.filter(r=>r.player === name).length;
const row = document.createElement("div");
row.className = "person-data-row";
const info = document.createElement("div");
info.className = "person-data-info";
const nm = document.createElement("div");
nm.className = "person-data-name";
nm.textContent = name;
const meta = document.createElement("div");
meta.className = "person-data-meta";
meta.textContent = count + " çalışma kaydı";
info.appendChild(nm);
info.appendChild(meta);
const btn = document.createElement("button");
btn.type = "button";
btn.className = "person-delete-btn";
btn.textContent = "Verilerini sil";
btn.addEventListener("click", ()=> deletePersonData(name));
row.appendChild(info);
row.appendChild(btn);
box.appendChild(row);
});
}

function clearLocalPersonData(name){
const dropKey = (key, test) => { try{ const d = JSON.parse(localStorage.getItem(key) || "{}"); let ch = false; Object.keys(d).forEach(k => { if(test(k)){ delete d[k]; ch = true; } }); if(ch) localStorage.setItem(key, JSON.stringify(d)); }catch(e){} };
dropKey("wm_game_v1", k => k === name);
dropKey("wm_gamex_v1", k => k === name);
["wm_game_route_v1", "wm_daily_v1", "wm_week_target_v1"].forEach(key => dropKey(key, k => k.split("|")[0] === name));
try{ Object.keys(localStorage).filter(k => /^wm_delay_[a-z]+_/.test(k) && k.replace(/^wm_delay_[a-z]+_/, "") === name).forEach(k => localStorage.removeItem(k)); }catch(e){}
}
async function deletePersonData(name){
if(!await zaConfirm(`"${name}" kişisine ait tüm çalışma sonuçları, düzey değişiklikleri, kişi kaydı ve bu cihazdaki oyun ilerlemesi (yıldızlar, ışıklar, dolap) kalıcı olarak silinecek. Bu işlem geri alınamaz. Emin misin?`)) return;
try{
if(firestoreReady && window.__fb && window.__fb.uid){
const { db, collection, getDocs, writeBatch, query, where, uid } = window.__fb;
const targets = [];
for(const [coll, field] of [["sessions", "player"], ["levelEvents", "player"], ["players", "name"]]){
const snap = await getDocs(query(collection(db, coll), where("uid", "==", uid)));
snap.docs.forEach(d=>{ if(d.data()[field] === name) targets.push(d.ref); });
}
for(let i = 0; i < targets.length; i += 400){
const batch = writeBatch(db);
targets.slice(i, i + 400).forEach(ref=> batch.delete(ref));
await batch.commit();
}
} else {
sessionHistory = sessionHistory.filter(r=> r.player !== name);
levelEvents = levelEvents.filter(e=> e.player !== name);
playersList = playersList.filter(p=> p !== name);
}
}catch(e){
console.error("Kişi verileri silinemedi:", e);
zaAlert("Silme sırasında bir sorun oluştu. Lütfen tekrar dene.");
return;
}
try{ clearLocalPersonData(name); }catch(e){ console.error(e); }
if(currentPlayerName === name){
currentPlayerName = "";
document.getElementById("playerSelect").value = "";
updatePlayerAvatar(null);
}
if(currentReportPlayer === name) currentReportPlayer = "Herkes";
renderPlayerOptions();
refreshHistoryIfVisible();
renderPersonDataList();
}

function clearAllSessions(){
if(firestoreReady && window.__fb && window.__fb.uid){
const { db, collection, getDocs, writeBatch, query, where, uid } = window.__fb;
getDocs(query(collection(db, "sessions"), where("uid", "==", uid))).then(async (snap)=>{
const docs = snap.docs;
for(let i = 0; i < docs.length; i += 400){
const batch = writeBatch(db);
docs.slice(i, i + 400).forEach(d=> batch.delete(d.ref));
await batch.commit();
}
}).catch(e=> console.error("Temizleme hatası:", e));
} else {
sessionHistory = [];
renderHistory();
}
}

function withUid(rec){
const uid = window.__fb && window.__fb.uid;
return uid ? Object.assign({}, rec, {uid}) : rec;
}

function logLevelEvent(record){
if(firestoreReady && window.__fb){
const { db, collection, addDoc } = window.__fb;
addDoc(collection(db, "levelEvents"), withUid(record)).catch(e=> console.error("Düzey olayı kaydedilemedi:", e));
} else {
levelEvents.push(record);
queuePendingWrite("levelEvents", record);
}
}

function recordSession(ms, errors){
try{
const ex = currentExercise();
const stage = ex.stages[currentStageIndex];
const layout = currentTier();
const record = {
t: Date.now(),
player: currentPlayerName.trim() || "Oyuncu",
exerciseLabel: ex.label,
stageLabel: stage.label,
tier: layout.label,
itemCount: layout.rows * layout.cols,
errors: errors || 0,
ms: ms,
exId: ex.id, src: perfSrc(), lvl: readingLevel === "pre" ? "pre" : "post", ti: currentCombo().t, n: perfItemCount(ex, layout), auto: perfIsAuto(ex)   /* Aşama 1: kaynak, çalışma kimliği, gerçek öğe sayısı */
};
perfLogLocal(record);   /* ödev durumu ve özet buluttan bağımsız */
if(firestoreReady && window.__fb){
const { db, collection, addDoc } = window.__fb;
try{ sessionHistory.push(Object.assign({}, record)); }catch(e){}   /* bulut listesi gelene kadar yerelde de görünsün */
addDoc(collection(db, "sessions"), withUid(perfCloudRec(record))).catch(e=> console.error("Kayıt yazılamadı:", e));
} else {
sessionHistory.push(record);
while(sessionHistory.length > 50) sessionHistory.shift();
queuePendingWrite("sessions", perfCloudRec(record));
}
flashSaved();
celebrateSave();
try{ onSessionRecord(); }catch(e){}
try{ onRecRecord(); }catch(e){}
try{ if(appMode === "aile" || gameMode) sendResultToExpert(record); }catch(e){}
const screen = document.getElementById("historyScreen");
if(screen && screen.style.display !== "none"){
renderHistory();
}
}catch(e){
}
}

/* KURAL (görsellik, aşama 4): çalışma tamamlanınca kısa bir kutlama kartı (Zihni + değişen bir övgü) belirir; dokunmayı engellemez, 1,6 sn sonra kendiliğinden kaybolur; yarıda bırakılınca, oyun modunda, "Kutlama" kapalıyken ve Sade görünümde çıkmaz */
const FINISH_MSGS = ["Harika iş!", "Süpersin!", "Bitti, aferin!", "Çok güzel çalıştın!", "Bravo!", "Tebrikler!"];
let __finishT = null;
function finishCard(){ try{ const e0 = document.getElementById("finishCard"); if(e0){ e0.style.top = ""; e0.style.transition = ""; } }catch(e){} try{ if(!confettiEnabled || document.documentElement.classList.contains("calm") || gameMode) return; let el = document.getElementById("finishCard"); if(!el){ el = document.createElement("div"); el.id = "finishCard"; el.setAttribute("aria-live", "polite"); document.body.appendChild(el); }
  const msg = FINISH_MSGS[Math.floor(Math.random() * FINISH_MSGS.length)]; const star = `<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.6Z" fill="#F5B301" stroke="#C98A00" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
  el.innerHTML = `<div class="fc-card"><div class="fc-z">${zihniSVG("cheer")}</div><div class="fc-t">${msg}</div><div class="fc-s">${star}${star}${star}</div></div>`; el.classList.remove("on"); void el.offsetWidth; el.classList.add("on"); clearTimeout(__finishT); __finishT = setTimeout(() => el.classList.remove("on"), 1600); }finally{ try{ setTimeout(zaDlgPlace, 30); setTimeout(zaDlgPlace, 300); }catch(e){} } }
function celebrateSave(){
if(!confettiEnabled) return; /* KURAL (konfeti yeri, 2026-11-09): konfeti yalnız çalışma/oyun ekranı görünürken yağar; gecikmiş bir kutlama başka sayfaya (Aile alanlar sayfası gibi) geçildikten sonra tetiklenirse atlanır */ try{ const vis = (id) => { const e = document.getElementById(id); return !!e && getComputedStyle(e).display !== "none"; }; const onWork = vis("mainApp") && !vis("categoryScreen") && !vis("islandScreen") && !vis("linkScreen") && !vis("todayScreen"); if(!onWork && !(typeof gameMode !== "undefined" && gameMode)) return; }catch(e){}
let layer = document.getElementById("confettiLayer");
if(!layer){
layer = document.createElement("div");
layer.id = "confettiLayer";
document.body.appendChild(layer);
}
const n = 26;
const w = innerWidth;
const h = innerHeight;
for(let i = 0; i < n; i++){
const el = document.createElement("div");
el.className = "confetti-piece";
const duration = 900 + Math.random() * 700;
const fall = h * 0.55 + Math.random() * h * 0.5;
const spin = (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 540);
el.style.left = (Math.random() * w) + "px";
el.style.top = (-20 - Math.random() * 40) + "px";
el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
el.style.borderRadius = Math.random() < 0.5 ? "50%" : "2px";
el.style.setProperty("--fall-distance", fall + "px");
el.style.setProperty("--spin", spin + "deg");
el.style.animationDuration = duration + "ms";
layer.appendChild(el);
setTimeout(()=> el.remove(), duration + 60);
}
}

function flashSaved(){
const wrap = document.querySelector(".timer-btns");
const old = wrap.querySelector(".saved-flash");
if(old) old.remove();
const span = document.createElement("span");
span.className = "saved-flash";
span.textContent = "Kaydedildi ✓";
wrap.appendChild(span);
setTimeout(()=>{ span.remove(); }, 1800);
}

function formatDateShort(ts){
const d = new Date(ts);
return d.toLocaleDateString("tr-TR", {day:"2-digit", month:"2-digit"}) + " " +
d.toLocaleTimeString("tr-TR", {hour:"2-digit", minute:"2-digit"});
}

function renderHistory(){
if(currentHistoryTab === "report"){
renderWeeklyReport();
} else if(currentHistoryTab === "summary"){
renderSummary();
} else {
renderRecent();
}
}

function dayKey(ts){
const d = new Date(ts);
const m = String(d.getMonth() + 1).padStart(2, "0");
const day = String(d.getDate()).padStart(2, "0");
return `${d.getFullYear()}-${m}-${day}`;
}

const WEEKDAY_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function startOfWeekMonday(base){
const d = new Date(base);
d.setHours(0, 0, 0, 0);
const offset = (d.getDay() + 6) % 7;
d.setDate(d.getDate() - offset);
return d;
}

function buildWeekDays(){
const start = startOfWeekMonday(new Date());
return WEEKDAY_SHORT.map((label, i)=>{
const d = new Date(start);
d.setDate(start.getDate() + i);
return { key: dayKey(d.getTime()), label };
});
}

function buildPrevWeekKeys(){
const start = startOfWeekMonday(new Date());
const keys = [];
for(let i = 7; i >= 1; i--){
const d = new Date(start);
d.setDate(start.getDate() - i);
keys.push(dayKey(d.getTime()));
}
return keys;
}

function buildWeeklyComments(all, days){
const comments = [];
const thisWeekKeys = days.map(d=>d.key);
const thisWeek = all.filter(r => thisWeekKeys.includes(dayKey(r.t)));

if(thisWeek.length === 0){
comments.push("Henüz bu hafta kayıtlı bir çalışma yok. Birkaç sayfa çözüldükçe burada haftalık ilerleme görünecek.");
return comments;
}

comments.push(`Bu hafta toplam ${thisWeek.length} sayfa çalışıldı.`);

const prevKeys = buildPrevWeekKeys();
const prevWeek = all.filter(r => prevKeys.includes(dayKey(r.t)));
const avgThis = thisWeek.reduce((a,r)=>a+r.ms,0) / thisWeek.length;

if(prevWeek.length > 0){
const avgPrev = prevWeek.reduce((a,r)=>a+r.ms,0) / prevWeek.length;
const diffPct = Math.round(((avgPrev - avgThis) / avgPrev) * 100);
if(diffPct > 5){
comments.push(`Ortalama süre geçen haftaya göre %${diffPct} kısaldı. 👏`);
} else if(diffPct < -5){
comments.push(`Ortalama süre geçen haftaya göre %${Math.abs(diffPct)} uzadı. Süreler sayfa zorluğuna ve o günkü koşullara göre değişebilir.`);
} else {
comments.push("Ortalama süre geçen haftaya göre stabil görünüyor.");
}
} else {
comments.push("Geçen haftayla karşılaştırmak için henüz yeterli veri yok.");
}

const totalErrors = thisWeek.reduce((a,r)=>a + (r.errors||0), 0);
if(totalErrors === 0){
comments.push("Bu hafta hiç hata kaydedilmedi. 👏");
} else {
comments.push(`Bu hafta toplam ${totalErrors} hata kaydedildi.`);
}

const upThisWeek = levelEvents.filter(ev =>
ev.dir === "up" &&
thisWeekKeys.includes(dayKey(ev.t)) &&
(currentReportPlayer === "Herkes" || ev.player === currentReportPlayer)
);
if(upThisWeek.length > 0){
comments.push(`Bu hafta ${upThisWeek.length} kez zorluk düzeyi otomatik yükseltildi.`);
}

return comments;
}

function renderWeeklyReport(){
const container = document.getElementById("historyList");
document.getElementById("historyTitle").innerHTML = `<span class="ui-icon-slot">${uiIconSVG("calendar")}</span> Haftalık İlerleme`;
const allRaw = loadSessions();
const players = Array.from(new Set(allRaw.map(r=>r.player)));
if(currentReportPlayer !== "Herkes" && !players.includes(currentReportPlayer)){
currentReportPlayer = "Herkes";
}
const all = currentReportPlayer === "Herkes"
? allRaw
: allRaw.filter(r => r.player === currentReportPlayer);

const days = buildWeekDays();

const perDay = days.map(d=>{
const sessions = all.filter(r => dayKey(r.t) === d.key);
const avgMs = sessions.length ? sessions.reduce((a,r)=>a+r.ms,0)/sessions.length : 0;
return {...d, count: sessions.length, avgMs};
});

const maxAvg = Math.max(...perDay.map(d=>d.avgMs), 1);

container.innerHTML = "";

const filterRow = document.createElement("div");
filterRow.className = "report-filter-row";
const options = ["Herkes", ...players].map(p =>
`<option value="${escHTML(p)}" ${p===currentReportPlayer ? "selected" : ""}>${escHTML(p)}</option>`
).join("");
filterRow.innerHTML = `
<span class="error-label">Kişi</span>
<select id="reportPlayerSelect" class="report-player-select">${options}</select>
`;
container.appendChild(filterRow);
document.getElementById("reportPlayerSelect").addEventListener("change", (e)=>{
currentReportPlayer = e.target.value;
renderWeeklyReport();
});

const chart = document.createElement("div");
chart.className = "week-chart";
perDay.forEach(d=>{
const col = document.createElement("div");
col.className = "week-col";
const barH = d.avgMs ? Math.max(6, Math.round((d.avgMs/maxAvg)*80)) : 0;
col.innerHTML = `
<div class="week-bar-wrap"><div class="week-bar" style="height:${barH}px"></div></div>
<div class="week-day">${d.label}</div>
<div class="week-meta">${d.count ? formatTime(d.avgMs) : "-"}</div>
`;
chart.appendChild(col);
});
container.appendChild(chart);

const comments = buildWeeklyComments(all, days);
const commentBox = document.createElement("div");
commentBox.className = "week-comments";
commentBox.innerHTML = comments.map(c=>`<div class="week-comment">${c}</div>`).join("");
container.appendChild(commentBox);

const disclaimer = document.createElement("div");
disclaimer.className = "report-disclaimer";
disclaimer.textContent = "Bu özet yalnızca kayıtlı çalışma sürelerine ve hata sayılarına dayanır; tanı veya klinik değerlendirme yerine geçmez.";
container.appendChild(disclaimer);

const thisWeekKeys = days.map(d=>d.key);
const recentEvents = levelEvents.filter(ev =>
thisWeekKeys.includes(dayKey(ev.t)) &&
(currentReportPlayer === "Herkes" || ev.player === currentReportPlayer)
);
if(recentEvents.length > 0){
const evBox = document.createElement("div");
evBox.innerHTML = `<div class="week-events-title">Düzey değişiklikleri</div>` +
recentEvents.map(ev => `<div class="week-event ${ev.dir}"><span class="ui-icon-slot">${uiIconSVG(ev.dir==="up" ? "arrow-up" : "arrow-down")}</span> ${ev.player} · ${formatDateShort(ev.t)} · ${ev.toLabel}</div>`).join("");
container.appendChild(evBox);
}
}


let _exLabelToCategoryCache = null;
function exerciseLabelToCategory(label){
if(!_exLabelToCategoryCache){
_exLabelToCategoryCache = {};
CATEGORIES.forEach(cat=>{
cat.exerciseIds.forEach(id=>{
const ex = EXERCISES.find(e=>e.id===id);
if(ex){ _exLabelToCategoryCache[ex.label] = cat; (ex.oldLabels || []).forEach(l => { _exLabelToCategoryCache[l] = cat; }); }
});
});
}
return _exLabelToCategoryCache[label] || null;
}

function computeCategorySummaries(records){
const byCat = {};
records.forEach(r=>{
const cat = exerciseLabelToCategory(r.exerciseLabel);
if(!cat) return;
if(!byCat[cat.id]) byCat[cat.id] = { category: cat, sessions: [] };
byCat[cat.id].sessions.push(r);
});
return Object.values(byCat).map(entry=>{
const sessions = entry.sessions.slice().sort((a,b)=> a.t - b.t);
const n = sessions.length;
const avgMs = sessions.reduce((a,r)=> a + r.ms, 0) / n;
const successRate = Math.round((sessions.filter(r=> !r.errors).length / n) * 100);
const lastTs = sessions[n-1].t;
let trendPct = null;
if(n >= 4){
const half = Math.floor(n/2);
const olderAvg = sessions.slice(0, half).reduce((a,r)=> a + r.ms, 0) / half;
const newerAvg = sessions.slice(n-half).reduce((a,r)=> a + r.ms, 0) / half;
if(olderAvg > 0) trendPct = Math.round(((newerAvg - olderAvg) / olderAvg) * 100);
}
return { category: entry.category, count: n, avgMs, successRate, lastTs, trendPct };
}).sort((a, b)=> b.count - a.count);
}

function summarySuccessColor(rate){
if(rate >= 80) return "#2E7D42";
if(rate >= 50) return "#B08900";
return "#B4433A";
}

function summaryTrendHTML(trendPct){
if(trendPct === null) return "";
if(Math.abs(trendPct) < 5) return `<span class="summary-metric-trend">· stabil</span>`;
return trendPct < 0
? `<span class="summary-metric-trend down">İyileşiyor · %${Math.abs(trendPct)}</span>`
: `<span class="summary-metric-trend up">Yavaşlıyor · %${trendPct}</span>`;
}

function summaryLede(name, stats){
const who = name === "Herkes" ? "" : name;
if(appMode === "uzman"){
return who
? `${who} için kayıtlı ${stats.totalSessions} çalışma oturumu bulunuyor (${stats.distinctDays} farklı gün, ${stats.catCount}/${stats.totalCatCount} alan).`
: `Kayıtlı ${stats.totalSessions} çalışma oturumu bulunuyor (${stats.distinctDays} farklı gün, ${stats.catCount}/${stats.totalCatCount} alan).`;
}
return who
? `${who}, şimdiye kadar ${stats.totalSessions} kez çalıştı (${stats.distinctDays} farklı gün). ${stats.catCount}/${stats.totalCatCount} alandan alıştırma denendi.`
: `Şimdiye kadar toplam ${stats.totalSessions} çalışma yapıldı (${stats.distinctDays} farklı gün). ${stats.catCount}/${stats.totalCatCount} alandan alıştırma denendi.`;
}

function summaryDateOnly(ts){
return new Date(ts).toLocaleDateString("tr-TR", {day:"2-digit", month:"2-digit", year:"numeric"});
}

function buildSummaryPlainText(name, stats, catSummaries, untried){
const lines = [];
lines.push("ZİHİN ATÖLYESİ — ÇALIŞMA ÖZETİ");
lines.push(`Kişi: ${name === "Herkes" ? "Tüm kişiler" : name}`);
lines.push(`Tarih: ${summaryDateOnly(Date.now())}`);
lines.push("");
lines.push(`Toplam çalışma: ${stats.totalSessions}`);
lines.push(`Farklı gün: ${stats.distinctDays}`);
lines.push(`Denenen alan: ${stats.catCount}/${stats.totalCatCount}`);
lines.push(`Genel hatasız tamamlama oranı: %${stats.overallRate}`);
lines.push("");
lines.push("KATEGORİ BAZLI:");
catSummaries.forEach(cs=>{
const trend = cs.trendPct === null ? "" : (cs.trendPct < 0 ? ` · süre %${Math.abs(cs.trendPct)} kısaldı` : (cs.trendPct > 5 ? ` · süre %${cs.trendPct} uzadı` : ""));
lines.push(`- ${cs.category.label}: ${cs.count} çalışma · ortalama ${formatTime(cs.avgMs)} · %${cs.successRate} hatasız${trend}`);
});
if(untried.length){
lines.push("");
lines.push(`Henüz denenmemiş: ${untried.map(c=>c.label).join(", ")}`);
}
lines.push("");
lines.push("Not: Bu özet yalnızca kayıtlı çalışma sürelerine ve hata sayılarına dayanır; tanı veya klinik değerlendirme yerine geçmez.");
return lines.join("\n");
}

function summaryCardHTML(cs, maxCount, maxAvg){
const c = cs.category.color;
const countPct = Math.max(4, Math.round((cs.count / maxCount) * 100));
const timePct = Math.max(4, Math.round((cs.avgMs / maxAvg) * 100));
return `
<div class="summary-card">
<div class="summary-card-head">
<span class="summary-dot" style="background:${c}"></span>
<span class="summary-card-title">${cs.category.label}</span>
<span class="summary-card-meta">Son: ${summaryDateOnly(cs.lastTs)}</span>
</div>
<div class="summary-metric">
<div class="summary-metric-row"><span class="summary-metric-label">Çalışma sayısı</span><span class="summary-metric-value">${cs.count}</span></div>
<div class="summary-bar-track"><div class="summary-bar-fill" style="width:${countPct}%; background:${c}"></div></div>
</div>
<div class="summary-metric">
<div class="summary-metric-row"><span class="summary-metric-label">Ortalama süre</span><span class="summary-metric-value">${formatTime(cs.avgMs)} ${summaryTrendHTML(cs.trendPct)}</span></div>
<div class="summary-bar-track"><div class="summary-bar-fill" style="width:${timePct}%; background:${c}"></div></div>
</div>
<div class="summary-metric">
<div class="summary-metric-row"><span class="summary-metric-label">Hatasız tamamlama</span><span class="summary-metric-value">%${cs.successRate}</span></div>
<div class="summary-bar-track"><div class="summary-bar-fill" style="width:${Math.max(4,cs.successRate)}%; background:${summarySuccessColor(cs.successRate)}"></div></div>
</div>
</div>
`;
}

function renderSummary(){
const container = document.getElementById("historyList");
document.getElementById("historyTitle").innerHTML = `<span class="ui-icon-slot">${uiIconSVG("grid")}</span> Özet`;
const allRaw = loadSessions();
container.innerHTML = "";

if(allRaw.length === 0){
container.innerHTML = `<div class="history-empty"><span class="history-empty-icon">${uiIconSVG("grid")}</span>Henüz kayıtlı sonuç yok. Birkaç çalışma tamamlandığında burada alan bazlı özet görünecek.</div>`;
return;
}

const players = Array.from(new Set(allRaw.map(r=> r.player)));
if(currentSummaryPlayer !== "Herkes" && !players.includes(currentSummaryPlayer)){
currentSummaryPlayer = "Herkes";
}
const all = currentSummaryPlayer === "Herkes" ? allRaw : allRaw.filter(r=> r.player === currentSummaryPlayer);

const filterRow = document.createElement("div");
filterRow.className = "report-filter-row";
const options = ["Herkes", ...players].map(p=>
`<option value="${escHTML(p)}" ${p === currentSummaryPlayer ? "selected" : ""}>${escHTML(p)}</option>`
).join("");
filterRow.innerHTML = `<span class="error-label">Kişi</span><select id="summaryPlayerSelect" class="report-player-select">${options}</select>`;
container.appendChild(filterRow);
document.getElementById("summaryPlayerSelect").addEventListener("change", (e)=>{
currentSummaryPlayer = e.target.value;
renderSummary();
});

const toolbar = document.createElement("div");
toolbar.className = "summary-toolbar";
toolbar.innerHTML = `
<button type="button" class="summary-action-btn" id="summaryCopyBtn"><span class="ui-icon-slot">${uiIconSVG("copy")}</span> Kopyala</button>
<button type="button" class="summary-action-btn" id="summaryPrintBtn"><span class="ui-icon-slot">${uiIconSVG("printer")}</span> Yazdır / PDF</button>
`;
container.appendChild(toolbar);

const wrap = document.createElement("div");
wrap.id = "summaryContentWrap";
container.appendChild(wrap);

const catSummaries = computeCategorySummaries(all);
const untried = CATEGORIES.filter(c=> !c.hidden && !catSummaries.find(cs=> cs.category.id === c.id));
const distinctDays = new Set(all.map(r=> dayKey(r.t))).size;
const overallRate = all.length ? Math.round((all.filter(r=> !r.errors).length / all.length) * 100) : 0;
const stats = {
totalSessions: all.length,
distinctDays,
catCount: catSummaries.length,
totalCatCount: CATEGORIES.filter(c => !c.hidden).length,   /* KURAL (rapor): "Denenen alan" paydası yalnız görünen 10 alanı sayar */
overallRate
};

const overview = document.createElement("div");
overview.className = "summary-overview";
overview.innerHTML = `
<div class="summary-overview-item"><div class="summary-overview-value">${stats.totalSessions}</div><div class="summary-overview-label">Toplam çalışma</div></div>
<div class="summary-overview-item"><div class="summary-overview-value">${stats.distinctDays}</div><div class="summary-overview-label">Farklı gün</div></div>
<div class="summary-overview-item"><div class="summary-overview-value">${stats.catCount}/${stats.totalCatCount}</div><div class="summary-overview-label">Denenen alan</div></div>
<div class="summary-overview-item"><div class="summary-overview-value">%${stats.overallRate}</div><div class="summary-overview-label">Genel hatasız oranı</div></div>
`;
wrap.appendChild(overview);

const lede = document.createElement("div");
lede.className = "summary-lede";
lede.textContent = summaryLede(currentSummaryPlayer, stats);
wrap.appendChild(lede);

const maxCount = Math.max(...catSummaries.map(c=> c.count), 1);
const maxAvg = Math.max(...catSummaries.map(c=> c.avgMs), 1);
catSummaries.forEach(cs=>{
wrap.insertAdjacentHTML("beforeend", summaryCardHTML(cs, maxCount, maxAvg));
});
rpAccordion(wrap, "summary", ".summary-card", ".summary-card-head", el => (el.querySelector(".summary-card-title") || {}).textContent || "");

if(untried.length){
const u = document.createElement("div");
u.className = "summary-untried";
u.textContent = `Henüz denenmemiş: ${untried.map(c=> c.label).join(", ")}`;
wrap.appendChild(u);
}

const disclaimer = document.createElement("div");
disclaimer.className = "report-disclaimer";
disclaimer.textContent = "Bu özet yalnızca kayıtlı çalışma sürelerine ve hata sayılarına dayanır; tanı veya klinik değerlendirme yerine geçmez.";
wrap.appendChild(disclaimer);

document.getElementById("summaryCopyBtn").addEventListener("click", (e)=>{
const btn = e.currentTarget;
const text = buildSummaryPlainText(currentSummaryPlayer, stats, catSummaries, untried);
const flash = (ok)=>{
const original = btn.innerHTML;
btn.innerHTML = ok ? "Kopyalandı ✓" : "Kopyalanamadı";
setTimeout(()=>{ btn.innerHTML = original; }, 1600);
};
if(navigator.clipboard && navigator.clipboard.writeText){
navigator.clipboard.writeText(text).then(()=> flash(true)).catch(()=> flash(fallbackCopyText(text)));
} else {
flash(fallbackCopyText(text));
}
});

document.getElementById("summaryPrintBtn").addEventListener("click", ()=>{
const area = document.getElementById("printArea");
const title = currentSummaryPlayer === "Herkes" ? "Tüm kişiler" : currentSummaryPlayer;
area.innerHTML = `
<h2>Zihin Atölyesi — Çalışma Özeti</h2>
<div class="summary-print-meta">Kişi: ${title} · Tarih: ${summaryDateOnly(Date.now())}</div>
${wrap.innerHTML}
`;
document.documentElement.classList.add("is-printing");
window.print();
});
}

function fallbackCopyText(text){
try{
const ta = document.createElement("textarea");
ta.value = text;
ta.style.position = "fixed";
ta.style.left = "-9999px";
document.body.appendChild(ta);
ta.focus();
ta.select();
const ok = document.execCommand("copy");
document.body.removeChild(ta);
return ok;
}catch(e){
return false;
}
}

window.addEventListener("afterprint", ()=>{
document.documentElement.classList.remove("is-printing");
const area = document.getElementById("printArea");
if(area) area.innerHTML = "";
});

if("serviceWorker" in navigator){
window.addEventListener("load", ()=>{
navigator.serviceWorker.register("sw.js").catch(()=>{});
});
}

function renderRecent(){
const container = document.getElementById("historyList");
const list = loadSessions();
container.innerHTML = "";
if(list.length === 0){
document.getElementById("historyTitle").textContent = "Son sonuçlar";
container.innerHTML = `<div class="history-empty"><span class="history-empty-icon">${uiIconSVG("chart")}</span>Henüz kayıtlı sonuç yok. Kronometreyi durdurup "Kaydet"e bastığında burada görünür.</div>`;
return;
}

const byPlayer = {};
list.forEach(r=>{
if(!byPlayer[r.player]) byPlayer[r.player] = [];
byPlayer[r.player].push(r);
});
const players = Object.keys(byPlayer);
document.getElementById("historyTitle").textContent = `Son sonuçlar · ${players.length} kişi`;

const maxMs = Math.max(...list.map(r=>r.ms), 1);

players.forEach(player=>{
const sessions = byPlayer[player].slice(-5).reverse();
const grp = document.createElement("div"); grp.className = "rp-grp"; grp.dataset.key = player; container.appendChild(grp);
const header = document.createElement("div");
header.className = "player-group-header";
header.innerHTML = `${avatarHTML(player,20)} <span>${escHTML(player)} · ${byPlayer[player].length} çalışma</span>`;
grp.appendChild(header);
const body = document.createElement("div"); body.className = "rp-body"; grp.appendChild(body);

sessions.forEach(r=>{
const card = document.createElement("div");
card.className = "result-card";
const pct = Math.max(6, Math.round((r.ms / maxMs) * 100));
card.innerHTML = `
<div class="rc-top">
<span class="rc-name">${r.exerciseLabel} · ${r.stageLabel}</span>
<span class="rc-time">${formatTime(r.ms)}</span>
</div>
<div class="rc-meta">${r.tier}${r.errors ? " · " + r.errors + " hata" : " · Hatasız"} · ${formatDateShort(r.t)}</div>
<div class="rc-bar-wrap"><div class="rc-bar" style="width:${pct}%"></div></div>
`;
body.appendChild(card);
});
});
rpAccordion(container, "recent", ".rp-grp", ".player-group-header", el => el.dataset.key);
}

function renderPlayerOptions(){
const sel = document.getElementById("playerSelect");
const prevValue = sel.value;
sel.innerHTML = `<option value="">Seç...</option>` +
playersList.map(name => `<option value="${escHTML(name)}">${escHTML(name)}</option>`).join("") +
`<option value="__new__">+ Yeni kişi ekle</option>`;
if(playersList.includes(prevValue)){
sel.value = prevValue;
updatePlayerAvatar(prevValue);
} else if(playersList.includes(currentPlayerName)){
sel.value = currentPlayerName;
updatePlayerAvatar(currentPlayerName);
}
}

function updatePlayerAvatar(name){
const slot = document.getElementById("playerAvatarSlot");
if(!slot) return;
if(name){
slot.innerHTML = avatarHTML(name, 24);
slot.style.display = "inline-flex";
} else {
slot.style.display = "none";
}
}

document.getElementById("playerSelect").addEventListener("change", (e)=>{
const val = e.target.value;
const newRow = document.getElementById("newPlayerRow");
if(val === "__new__"){ const sel = e.target; sel.value = playersList.includes(currentPlayerName) ? currentPlayerName : ""; newRow.style.display = "none"; whoAdd((n) => { currentPlayerName = n; sel.value = n; updatePlayerAvatar(n); try{ whoSelSet(n); whoTouch(n); }catch(err){} if(awaitingPlayerChoice){ awaitingPlayerChoice = false; playerPromptResolvedAt = Date.now(); } });   /* KURAL: kişi etkinlik sayfasından eklenir; ad ve yaş sorulur */ } else {
newRow.style.display = "none";
currentPlayerName = val;
updatePlayerAvatar(val);
try{ zaPersonChanged(val); }catch(err){}
if(awaitingPlayerChoice){
awaitingPlayerChoice = false;
playerPromptResolvedAt = Date.now();
}
}
});

function cleanPersonName(v){ return String(v || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 40); }
function commitNewPlayer(){
const input = document.getElementById("newPlayerInput");
const name = cleanPersonName(input.value);
if(!name) return false;
if(playersList.includes(name)){
currentPlayerName = name;
document.getElementById("playerSelect").value = name;
document.getElementById("newPlayerRow").style.display = "none";
input.value = "";
updatePlayerAvatar(name);
return true;
}
setTimeout(() => { try{ if(!placeGet(name)) placeOffer(name); }catch(e){} }, 600);
if(firestoreReady && window.__fb){
const { db, collection, addDoc } = window.__fb;
addDoc(collection(db, "players"), withUid({ name, createdAt: Date.now() }))
.catch(e=> console.error("Profil eklenemedi:", e));
} else {
playersList.push(name);
renderPlayerOptions();
queuePendingWrite("players", { name, createdAt: Date.now() });
}
currentPlayerName = name;
document.getElementById("newPlayerRow").style.display = "none";
input.value = "";
updatePlayerAvatar(name);
setTimeout(()=>{
const sel = document.getElementById("playerSelect");
if([...sel.options].some(o=>o.value===name)){
sel.value = name;
}
}, 300);
return true;
}

document.getElementById("addPlayerBtn").addEventListener("click", ()=>{
const wasAwaiting = awaitingPlayerChoice;
if(commitNewPlayer() && wasAwaiting){
awaitingPlayerChoice = false;
playerPromptResolvedAt = Date.now();
}
});

function setHistoryTab(tab){
currentHistoryTab = tab;
document.getElementById("tabRecent").classList.toggle("active", tab==="recent");
document.getElementById("tabReport").classList.toggle("active", tab==="report");
document.getElementById("tabSummary").classList.toggle("active", tab==="summary");
renderHistory();
}

document.getElementById("tabRecent").addEventListener("click", ()=> setHistoryTab("recent"));
document.getElementById("tabReport").addEventListener("click", ()=> setHistoryTab("report"));
document.getElementById("tabSummary").addEventListener("click", ()=> setHistoryTab("summary"));

function openHistoryScreen(){
document.getElementById("historyScreen").style.display = "block";
renderHistory();
}
function closeHistoryScreen(){
document.getElementById("historyScreen").style.display = "none";
}
/* KURAL: Etkinlik Raporları çalışma sayfasında değil, Uzman ve Aile sayfalarında büyük kartın hemen altındaki aynı boydaki düğmeden açılır */
document.getElementById("closeHistoryBtn").addEventListener("click", closeHistoryScreen);
document.getElementById("closeEmptyCategoryBtn").addEventListener("click", ()=>{
document.getElementById("emptyCategoryScreen").style.display = "none";
openCategoryScreen();
});

document.getElementById("onboardBackBtn").addEventListener("click", ()=>{
if(onboardStep > 0) showOnboardStep(onboardStep - 1);
});

document.getElementById("consentBackBtn").addEventListener("click", ()=>{
document.getElementById("consentScreen").style.display = "none";
if(onboardEntryScreen === "returnSplashScreen"){
document.getElementById("returnSplashScreen").style.display = "flex";
} else {
document.getElementById("onboardScreen").style.display = "flex";
showOnboardStep(ONBOARD_SLIDES - 1);
}
});

document.getElementById("modeBackBtn").addEventListener("click", ()=>{
document.getElementById("modeScreen").style.display = "none";
if(modeScreenBackTarget === "consentScreen"){
document.getElementById("consentScreen").style.display = "flex";
} else if(onboardEntryScreen === "returnSplashScreen"){
document.getElementById("returnSplashScreen").style.display = "flex";
} else {
document.getElementById("onboardScreen").style.display = "flex";
showOnboardStep(ONBOARD_SLIDES - 1);
}
});

document.getElementById("readingLevelBackBtn").addEventListener("click", ()=>{
document.getElementById("readingLevelScreen").style.display = "none";
document.getElementById("modeScreen").style.display = "flex";
});

document.getElementById("categoryBackBtn").addEventListener("click", ()=>{
document.getElementById("categoryScreen").style.display = "none";
if(categoryBackTarget === "mainApp"){
document.getElementById("mainApp").style.display = "flex";
} else if(viaWho){ showWho();
} else {
document.getElementById("readingLevelScreen").style.display = "flex";
}
});

function exportSessionsToCSV(){
const list = loadSessions();
if(list.length === 0){
zaAlert("Henüz dışa aktarılacak kayıt yok.");
return;
}
const headers = ["Tarih","Kişi","Çalışma","Aşama","Düzey","Süre (sn)","Hata Sayısı"];
const rows = list.map(r => [
new Date(r.t).toLocaleString("tr-TR"),
r.player,
r.exerciseLabel,
r.stageLabel,
r.tier,
(r.ms/1000).toFixed(1),
r.errors || 0
]);
const csvLines = [headers, ...rows].map(row =>
row.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(",")
);
const csvContent = "\uFEFF" + csvLines.join("\r\n");
const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = `calisan-bellek-sonuclari-${new Date().toISOString().slice(0,10)}.csv`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
}

document.getElementById("exportCsvBtn").addEventListener("click", exportSessionsToCSV);

document.getElementById("historyClearBtn").addEventListener("click", async ()=>{
if(!await zaConfirm("Kayıtlı tüm oturum sonuçları silinecek. Bu işlem geri alınamaz. Emin misin?")) return;
try{
clearAllSessions();
}catch(e){}
});

let playerPromptResolvedAt = 0;
let awaitingPlayerChoice = false;

document.getElementById("timerBtn").addEventListener("click", ()=>{ if(timerRunning){ if(Date.now() - (window.__zaStartAt || 0) < 700) return; window._manualStop = true; stopTimer(); return; }   /* KURAL: Başlat'a yanlışlıkla çift dokunma çalışmayı hemen bitirmez (ilk 0,7 sn Bitir yok sayılır) */
/* KURAL: tamamlanmış ama kaydedilmemiş çalışmada Başlat yeniden başlatmaz — önce kaydet uyarısı çıkar (↻ ile sıfırlanabilir) */
try{ const sv = document.getElementById("saveResultBtn"); if(!(typeof gameMode !== "undefined" && gameMode) && !window._incomplete && elapsedMs > 300 && sv && getComputedStyle(sv).display !== "none"){ showToast("Önce sonucu kaydedin (ya da ↻ ile sıfırlayın)", "err"); try{ sv.scrollIntoView({ behavior:"smooth", block:"center" }); sv.classList.remove("attn"); void sv.offsetWidth; sv.classList.add("attn"); }catch(e){} return; } }catch(e){}
if(elapsedMs < 50){ currentErrorCount = 0; const ce1 = document.getElementById("errorCount"); if(ce1) ce1.textContent = "0"; }   /* Başlat'a basılır basılmaz hata sayısı sıfırlanır (geri sayımlı çalışmalar dahil) */
if(typeof gameMode !== "undefined" && gameMode && !(currentPlayerName || "").trim()){ openGameWho(); return; }
const famLocked = document.documentElement.classList.contains("session-mode") || document.documentElement.classList.contains("rec-mode");
if(famLocked && !(currentPlayerName || "").trim()){ pickPerson(() => { try{ pinAssignedChild(); }catch(e){} }, { noGuest:true }); return; }
if(!currentPlayerName){
const newRow = document.getElementById("newPlayerRow");
const newInput = document.getElementById("newPlayerInput");
if(newRow.style.display !== "none" && newInput.value.trim()){
commitNewPlayer();
}
}
if(!currentPlayerName){
const row = document.getElementById("playerRow");
row.scrollIntoView({behavior:"smooth", block:"center"});
row.classList.remove("attn");
void row.offsetWidth;
row.classList.add("attn");
if(landscapeMQ.matches) setLsOpen(true);
awaitingPlayerChoice = true;
zaAlert("Başlamadan önce lütfen bir kişi seç veya yeni bir isim ekle.");
return;
}
if(playerPromptResolvedAt && Date.now() - playerPromptResolvedAt < 700){
playerPromptResolvedAt = 0;
return;
}
startTimer();
});

document.getElementById("timerResetBtn").addEventListener("click", ()=>{ if(timerRunning){ showToast("Yinelemek için önce Bitir'e basın", "err"); return; }
resetTimer();
});

document.getElementById("errorMinusBtn").addEventListener("click", ()=>{
currentErrorCount = Math.max(0, currentErrorCount - 1);
document.getElementById("errorCount").textContent = currentErrorCount;
});

document.getElementById("errorPlusBtn").addEventListener("click", ()=>{
currentErrorCount = currentErrorCount + 1;
document.getElementById("errorCount").textContent = currentErrorCount;
});

document.getElementById("saveResultBtn").addEventListener("click", ()=>{
confirmSaveResult();
});

document.getElementById("reshuffleBtn").addEventListener("click", ()=>{ const __keep = keepScrollSnapshot(); if(qsRuleKey) qsRulePrev = qsRuleKey; qsRuleKey = null; /* Karıştır: Hızlı Seç kuralı da yenilensin */
const ex = currentExercise();
if(ex.onShuffle) try{ ex.onShuffle(); }catch(e){}
if(!ex.isMotion){
const {rows, cols} = currentTier();
currentGrid = generateGrid(ex, rows, cols);
}
renderBoard(); renderInstruction(); resetTimer(); refreshHistoryIfVisible(); restoreScrollSnapshot(__keep); /* Karıştır: sayfa yukarı zıplamasın */ });

document.getElementById("prevBtn").addEventListener("click", ()=>{ navStep(-1); });

document.getElementById("nextBtn").addEventListener("click", ()=>{ navStep(1); });

function applyModeVisibility(){
const isAile = appMode === "aile";
document.getElementById("tierRow").style.display = "flex";   /* düzeyler ve çalışma şeridi Aile görünümünde de: ödev ve egzersiz takibi için */
document.getElementById("exerciseRow").style.display = "flex";
document.getElementById("modeLabel").textContent = isAile ? "Aile" : "Uzman";
document.getElementById("exportCsvBtn").style.display = isAile ? "none" : "inline-block";
}

const VIEW_KEY = "wm_activity_view_v1";
function getEtkinlikView(){ try{ return localStorage.getItem(VIEW_KEY) === "aile" ? "aile" : "uzman"; }catch(e){ return "uzman"; } }
function setEtkinlikView(v){ try{ localStorage.setItem(VIEW_KEY, v); }catch(e){} renderViewSwitch(); }
function renderViewSwitch(){
const v = getEtkinlikView();
document.querySelectorAll("#viewSwitch .view-btn").forEach(b => b.classList.toggle("active", b.dataset.view === v));
const d = document.getElementById("viewDesc");
if(d) d.textContent = v === "aile" ? "Aile: çalışmalar sırayla ilerler; istersen düzeyi ve çalışmayı kendin de seçebilirsin." : "Uzman: düzeyi, çalışmayı ve aşamayı kendin seçersin.";
}

function startApp(mode){
if(mode === "etkinlik") mode = getEtkinlikView();
exitGameMode();
try{ exitSessionMode(); exitRecMode(); hideFamScreens(); hideLinkScreens(); }catch(e){}
appMode = mode;
document.getElementById("modeScreen").style.display = "none";
if(mode === "cocuk"){
document.getElementById("childLevelScreen").style.display = "flex";
return;
}
pendingLevelPlayerName = null;
pendingLevelPlayerIsNew = false;
const levelSel = document.getElementById("levelPlayerSelect");
if(levelSel) levelSel.value = "";
document.getElementById("levelNewPlayerRow").style.display = "none";
renderLevelPlayerOptions();
updateLevelPlayerStatus();
document.getElementById("readingLevelScreen").style.display = "flex";
}



/* KURAL (Zihni): Zihni kullanıcının ürettiği 3B görsellerle gösterilir (9 poz: happy, cheer, encourage, sleepy, wave, think, point, again, listen); her pozda kafa aynı yere oturtulmuştur, giysiler (7 adet) her pozda kafaya ve gözlere göre yerleşir; görsel yoksa eski çizim yedek olarak kullanılır */
/* KURAL (Zihni): eski çizim hiçbir yerde kalmaz — görsel paketi yüklenmeden çizilmiş Zihni'ler, paket gelince yeni görselle (giysileriyle) değiştirilir */
function zihniRefresh(){ try{ if(typeof ZIHNI_IMG === "undefined") return false; document.querySelectorAll("svg.zmascot:not(.zimg)").forEach(sv => { const m = sv.getAttribute("data-mood") || "happy"; const t = document.createElement("div"); t.innerHTML = sv.getAttribute("data-zw") ? zihniSVG(m) : mascotSVG(m); const n = t.firstElementChild; if(n){ n.setAttribute("class", (sv.getAttribute("class") || "zmascot").replace(/\bzmascot\b/, "zmascot zimg")); sv.replaceWith(n); } }); return true; }catch(e){ return false; } }
(function zihniWait(){ let k = 0; const tick = () => { if(zihniRefresh()){ setTimeout(zihniRefresh, 1500); return; } if(++k < 120) setTimeout(tick, 250); }; setTimeout(tick, 200); })();
/* KURAL (Zihni aksesuarı): göz noktası kayıtlı olmayan pozlarda (sevinç) gözlük, gözlerin ölçülen yerine ve genişliğine oturur; gözlük iki gözü eşit örter, kaş/göz çizgisi tek tarafta dışarıda kalmaz */
const ZIHNI_EYES = { cheer: { ex: 63.4, ey: 43.0, es: 30.5, er: -8 } };   /* sevinç pozu: göz merkezleri (47.9, 43.5) ve (79.0, 38.9) ölçüldü; baş yana eğik, gözlük de aynı açıyla eğilir */
function zihniPose(mood){ try{ if(typeof ZIHNI_IMG === "undefined" || !ZIHNI_IMG || !ZIHNI_IMG.poses) return null; const P = ZIHNI_IMG.poses[mood] || ZIHNI_IMG.poses.happy || null; const F = ZIHNI_EYES[mood]; if(P && F && P.ex == null) Object.assign(P, F); return P; }catch(e){ return null; } }
function mascotSVG(mood){ const p = zihniPose(mood || "happy"); if(!p) return mascotSVGOld(mood); return `<svg class="zmascot zimg" viewBox="0 0 120 120" aria-hidden="true" style="overflow:visible"><g class="bob"><image href="${p.u}" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" preserveAspectRatio="none"/></g></svg>`; }
function zihniAcc(id, p){ try{ const A = (typeof ZIHNI_IMG !== "undefined" && ZIHNI_IMG.acc) ? ZIHNI_IMG.acc[id] : null; if(!A) return ACC_SVG[id] || ""; p = p || zihniPose("happy") || {}; const G = { explorer:[76, 32, 0.93], crown:[46, 22, 1], flowers:[64, 27, 0.86], bow:[30, 84, 0.5], scarf:[46, 71, 0], cape:[100, 40, 0] }; let w, x, y;
  if(id === "glasses"){ const cx = p.ex || 60, cy = p.ey || 49; w = Math.max(40, (p.es || 22) * 2.05); const h = w * A.ar; x = cx - w / 2; y = cy - h / 2 - 1; if(p.er) return `<image href="${A.u}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" preserveAspectRatio="none" transform="rotate(${p.er} ${cx} ${cy})"/>`; }
  else { const g = G[id] || [50, 30, 1]; w = g[0]; const h = w * A.ar; x = 60 - w / 2; y = g[1] - h * g[2]; }
  return `<image href="${A.u}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${(w * A.ar).toFixed(1)}" preserveAspectRatio="none"/>`; }catch(e){ return ACC_SVG[id] || ""; } }
function mascotSVGOld(mood){ mood = mood || "happy"; return mascotSVGOldDraw(mood).replace('<svg class="zmascot"', `<svg data-mood="${mood}" class="zmascot"`); }
function mascotSVGOldDraw(mood){
mood = mood || "happy";
const body = "#3DCFC2", shade = "#22AFA3", dark = "#1C2B39";
const arm = (d, cls) => `<path class="${cls || ""}" d="${d}" fill="none" stroke="${shade}" stroke-width="13" stroke-linecap="round"/><path class="${cls || ""}" d="${d}" fill="none" stroke="${body}" stroke-width="9" stroke-linecap="round"/>`;
const armsDown = arm("M34 78 C 22 88, 18 98, 26 104") + arm("M48 84 C 44 96, 46 104, 54 106") + arm("M72 84 C 76 96, 74 104, 66 106") + arm("M86 78 C 98 88, 102 98, 94 104");
const armsCheer = arm("M30 70 C 16 62, 10 48, 16 38", "wave") + arm("M48 84 C 44 96, 46 104, 54 106") + arm("M72 84 C 76 96, 74 104, 66 106") + arm("M90 70 C 104 62, 110 48, 104 38", "wave");
const eyes = mood === "sleepy"
? `<path d="M37 52 Q45 58 53 52" fill="none" stroke="${dark}" stroke-width="4" stroke-linecap="round"/><path d="M67 52 Q75 58 83 52" fill="none" stroke="${dark}" stroke-width="4" stroke-linecap="round"/>`
: mood === "cheer"
? `<path d="M37 50 Q45 40 53 50" fill="none" stroke="${dark}" stroke-width="4.5" stroke-linecap="round"/><path d="M67 50 Q75 40 83 50" fill="none" stroke="${dark}" stroke-width="4.5" stroke-linecap="round"/>`
: `<g class="blink"><ellipse cx="45" cy="50" rx="11" ry="12.5" fill="#fff"/><ellipse cx="75" cy="50" rx="11" ry="12.5" fill="#fff"/>
<circle cx="47" cy="52" r="6.2" fill="${dark}"/><circle cx="77" cy="52" r="6.2" fill="${dark}"/><circle cx="49.5" cy="49" r="2.3" fill="#fff"/><circle cx="79.5" cy="49" r="2.3" fill="#fff"/></g>`;
const brows = mood === "encourage" ? `<path d="M36 34 Q44 30 52 33" fill="none" stroke="${dark}" stroke-width="3" stroke-linecap="round"/><path d="M68 33 Q76 30 84 34" fill="none" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>` : "";
const mouth = mood === "sleepy" ? `<ellipse cx="60" cy="68" rx="4.5" ry="5.5" fill="${dark}"/>`
: mood === "cheer"
? `<path d="M48 64 Q60 80 72 64 Z" fill="${dark}"/><path d="M53 70 Q60 76 67 70" fill="#FF7A8A"/>`
: mood === "encourage" ? `<path d="M51 67 Q60 73 69 67" fill="none" stroke="${dark}" stroke-width="4" stroke-linecap="round"/>`
: `<path d="M50 65 Q60 75 70 65" fill="none" stroke="${dark}" stroke-width="4" stroke-linecap="round"/>`;
return `<svg class="zmascot" viewBox="0 0 120 120" aria-hidden="true"><g class="bob">
${mood === "cheer" ? armsCheer : armsDown}
<ellipse cx="60" cy="50" rx="38" ry="35" fill="${shade}"/>
<ellipse cx="60" cy="47" rx="37" ry="33" fill="${body}"/>
<ellipse cx="46" cy="26" rx="13" ry="7" fill="#fff" opacity=".35" transform="rotate(-18 46 26)"/>
${brows}${eyes}
<ellipse cx="33" cy="63" rx="6" ry="3.6" fill="#FF8FA3" opacity=".75"/><ellipse cx="87" cy="63" rx="6" ry="3.6" fill="#FF8FA3" opacity=".75"/>
${mouth}</g></svg>`;
}
const PALM_SVG = '<svg class="palm" viewBox="0 0 40 48" aria-hidden="true"><path d="M21 46 C 22 34, 20 24, 18 16" fill="none" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/><path d="M18 16 C 10 8, 2 10, 0 16 C 8 13, 13 14, 18 16 Z M18 16 C 22 6, 32 4, 38 9 C 30 9, 24 12, 18 16 Z M18 16 C 12 4, 18 -1, 24 1 C 20 5, 19 10, 18 16 Z M18 16 C 28 14, 36 18, 37 25 C 30 20, 24 18, 18 16 Z" fill="#2E9E4F"/></svg>';

const CALM_KEY = "wm_calm_v1";
function calmOn(){ try{ return localStorage.getItem(CALM_KEY) === "1"; }catch(e){ return false; } }
function applyCalm(){ document.documentElement.classList.toggle("calm", calmOn()); const t = document.getElementById("calmToggle"); if(t) t.checked = calmOn(); }
(function initBrand(){
try{
document.getElementById("bsMascot").innerHTML = mascotSVG("happy");
const em = document.querySelector('.mode-card[data-mode="cocuk"] .mode-emoji');
if(em){ em.innerHTML = mascotSVG("happy"); em.classList.add("has-mascot"); }
applyCalm();
try{ renderPlaceSettings(); }catch(e){}
try{ renderAcctSettings(); }catch(e){}
{ const eb = document.getElementById("expertDevBtn"); if(eb){ const upd = () => { const r = homeRole() || (isExpertDevice() ? "uzman" : null); eb.textContent = r === "uzman" ? "Uzman" : r === "aile" ? "Aile" : "İkisi de"; eb.classList.toggle("on", !!r); }; upd(); eb.onclick = () => { const r = homeRole() || (isExpertDevice() ? "uzman" : null); const next = r === "aile" ? "uzman" : r === "uzman" ? null : "aile"; if(next) setHomeRole(next); else { try{ localStorage.removeItem(HOME_ROLE_KEY); localStorage.setItem(EXPERT_DEV_KEY, "0"); }catch(e){} } upd(); }; } }
const ct = document.getElementById("captionToggle");
if(ct){ ct.checked = captionOn(); ct.addEventListener("change", e => { try{ localStorage.setItem(CAPTION_KEY, e.target.checked ? "1" : "0"); }catch(_){} }); }
const t = document.getElementById("calmToggle");
if(t) t.addEventListener("change", e => { try{ localStorage.setItem(CALM_KEY, e.target.checked ? "1" : "0"); }catch(_){} applyCalm(); });
const sp = document.getElementById("brandSplash");
const hide = () => sp.classList.add("hide");
sp.addEventListener("click", hide);
setTimeout(hide, calmOn() ? 600 : 1500);
}catch(e){ const sp = document.getElementById("brandSplash"); if(sp) sp.classList.add("hide"); }
})();


const DAILY_KEY = "wm_daily_v1", TARGET_KEY = "wm_week_target_v1";
const STEP_META = [
{ role:"Ana çalışma", min:4, cls:"", desc:"Haftanın hedef alanı" },
{ role:"Ana çalışma", min:4, cls:"",      desc:"Haftanın hedef alanı" },
{ role:"Ana çalışma", min:4, cls:"",      desc:"Haftanın hedef alanı" },
{ role:"Kapanış",     min:2, cls:"close", desc:"Çocuk tek başına yapabilir" }
];
let sessionActive = null;
const famProfile = () => (currentPlayerName || "").trim() || "Oyuncu";
let famNameOverride = null;   /* uzman ekranında danışanın adı (famProfile yerine) */
const famLvl = () => { let g = null; try{ const n = famNameOverride || famProfile(); g = n && n !== "Oyuncu" ? getPlayerLevel(n) : null; }catch(e){} return (g || readingLevel) === "pre" ? "pre" : "post"; };   /* çocuğun GENEL düzeyi: plan/ödev/bağlantı anahtarları kategori kademesinden etkilenmez */
function todayKey(d){ d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function weekStart(d){ d = new Date(d || Date.now()); const day = (d.getDay() + 6) % 7; d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - day); return d; }
function weekKey(d){ return todayKey(weekStart(d)); }
function famStoreGet(key){ try{ return JSON.parse(localStorage.getItem(key) || "{}"); }catch(e){ return {}; } }
function famStoreSet(key, v){ try{ localStorage.setItem(key, JSON.stringify(v)); }catch(e){} }
function seededRand(seedStr){ let h = 2166136261; for(const c of seedStr){ h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; }; }
const OKUL_SKILLS = [{ id:"okul-fonoloji", label:"Okumaya hazırlık: sesler ve heceler", okul:true, exerciseIds:["syl-touch", "syllable-count", "syl-blend", "rhyme-touch", "same-sound", "phon-manip", "nonword", "pk-train", "pk-rhyme"] },{ id:"okul-akicilik", label:"Okuma akıcılığı ve hızlı isimlendirme", okul:true, exerciseIds:["shape-color", "object-name", "number-color", "ran-letter", "sent-verify", "search-letter", "pair-match", "sem-decide"] },{ id:"okul-sayi", label:"Sayı ve erken matematik", okul:true, exerciseIds:["dot-count", "mental-math", "num-pattern", "balance", "pk-bridge", "trail-numbers", "number-find", "count-span"] },{ id:"okul-anlama", label:"Dinlediğini anlama ve yönergeler", okul:true, exerciseIds:["dir-follow", "listen-answer", "sent-pic", "word-pic", "wh-scene", "short-story", "story-recall", "concept-touch", "sent-listen"] },{ id:"okul-dikkat", label:"Sınıfta dikkat ve öz denetim", okul:true, exerciseIds:["go-no-go", "stop-signal", "vigilance", "touch-animal", "dual-task", "find-error", "pk-redlight", "flanker", "anti-touch", "hold-wait", "context-go", "look-first"] },{ id:"okul-yazma", label:"Yazmaya hazırlık: görsel-motor", okul:true, exerciseIds:["copy-design", "symmetry", "maze", "finger-trace", "block-design", "vis-draw", "trail-animal-fruit"] }];
/* KURAL (Bugünün planı / Gelişim ödevleri): çalışmalar kendi kategorisinin kademesinden seçilir, sonuç özeti o kademedeki kayıtlardan hesaplanır; uzman ödevi kendi kademesinde açılır */
function famLvlFor(catId){ try{ return catLevelFor(catId, famNameOverride || famProfile()); }catch(e){ return famLvl(); } }
function exLvlOk(id){ const ex = exerciseById(id); if(!ex) return false; const c = CATEGORIES.find(x => x.exerciseIds.includes(id)); return ex.readingLevel.includes(c ? famLvlFor(c.id) : famLvl()); }
function famExIds(catId){
const c = CATEGORIES.find(x => x.id === catId) || OKUL_SKILLS.find(x => x.id === catId); if(!c) return [];
return c.exerciseIds.filter(id => { const ex = exerciseById(id); return ex && exLvlOk(id) && !ex.isMotion; });
}
function famTargetOptions(){ return CATEGORIES.filter(c => !c.hidden && c.id !== "goz-takip" && famExIds(c.id).length >= 2).concat(OKUL_SKILLS.filter(c => famExIds(c.id).length >= 3)); }
function famTarget(){
const prog = typeof familyProgram === "function" ? familyProgram() : null;
if(prog && prog.target && famTargetOptions().some(c => c.id === prog.target)) return prog.target;
const st = famStoreGet(TARGET_KEY), k = famProfile() + "|" + famLvl() + "|" + weekKey();
const opts = famTargetOptions();
if(st[k] && opts.some(c => c.id === st[k])) return st[k];
const wk = Math.floor(weekStart().getTime() / (7 * 864e5));
return opts.length ? opts[wk % opts.length].id : "islemleme-hizi";
}
function setFamTarget(catId){ const st = famStoreGet(TARGET_KEY); st[famProfile() + "|" + famLvl() + "|" + weekKey()] = catId; famStoreSet(TARGET_KEY, st); }
function isGameEligible(ex){ return !!(ex && (ex.isTouch || ex.isSort || ex.isTrail || ex.isPlan || ex.isSearch)); }
function buildTodayPlan(round, exclude){ round = round || 1; exclude = exclude || []; const target = famTarget(); const rnd = seededRand(todayKey() + famProfile() + famLvl() + target + (round > 1 ? "|" + round : ""));
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const eyeAll = (CATEGORIES.find(c => c.id === "goz-takip") || {exerciseIds:[]}).exerciseIds.filter(id => { const ex = exerciseById(id); return ex && exLvlOk(id) && !(ex.minTier > 0); });
const eyePref = eyeAll.filter(id => /saccade/.test(id));
const warm = pick(eyePref.length && rnd() < 0.6 ? eyePref : eyeAll);
const mains = famExIds(target).slice();
const prog = typeof familyProgram === "function" ? familyProgram() : null;
const hwIds = prog && Array.isArray(prog.hw) ? prog.hw.filter(id => !!exerciseById(id)) : [];
let fixed = (prog && prog.target === target && Array.isArray(prog.mains) ? prog.mains.filter(id => mains.includes(id)) : []);
if(hwIds.length){ const h = hwIds.slice(), pickH = []; while(pickH.length < Math.min(2, h.length)) pickH.push(h.splice(Math.floor(rnd() * h.length), 1)[0]); fixed = pickH.concat(fixed.filter(x => !pickH.includes(x))).slice(0, 2); }
if(fixed.length > 2 && !hwIds.length){ const f = fixed.slice(); fixed = []; while(fixed.length < 2 && f.length){ fixed.push(f.splice(Math.floor(rnd() * f.length), 1)[0]); } }   // önerilenlerden her gün 2'si
if(round > 1){ fixed = []; const fresh = mains.filter(x => !exclude.includes(x)); if(fresh.length >= 3) mains.splice(0, mains.length, ...fresh); }   /* sonraki turlarda bugün yapılanlar mümkünse tekrarlanmaz */
let m1 = fixed[0] || pick(mains); let rest = mains.filter(x => x !== m1); let m2 = fixed[1] || (rest.length ? pick(rest) : m1);
if(fixed.length === 1 && m2 === m1){ rest = mains.filter(x => x !== m1); m2 = rest.length ? pick(rest) : m1; }
let closePool = CATEGORIES.flatMap(c => c.id === target ? [] : c.exerciseIds).filter(id => { const ex = exerciseById(id); return ex && exLvlOk(id) && isGameEligible(ex); });   /* KURAL: günlük plandaki her adım, çalışmanın açılacağı alan düzeyinde (okul dönemi) gerçekten bulunan bir çalışmadır */
if(!closePool.length) closePool = CATEGORIES.flatMap(c => c.exerciseIds).filter(id => exerciseById(id) && isGameEligible(exerciseById(id)) && exLvlOk(id));
const cp2 = closePool.filter(x => x !== m1 && x !== m2 && !exclude.includes(x)); const close = pick(cp2.length ? cp2 : closePool.filter(x => x !== m1 && x !== m2));
/* KURAL (Bugün): günün planında ısınma (göz takip) adımı yoktur; dört adım = üç ana çalışma + kapanış, plan ilk adımdan başlar */
const rest3 = mains.filter(x => x !== m1 && x !== m2); const m0 = rest3.length ? pick(rest3) : (pick(closePool.filter(x => x !== close && x !== m1 && x !== m2)) || m1);
return { target, steps:[m0, m1, m2, close], done:[false, false, false, false], v:2, round }; }
function todayPlan(){
const st = famStoreGet(DAILY_KEY), k = famProfile() + "|" + famLvl() + "|" + todayKey();
try{ if(st[k] && Array.isArray(st[k].steps) && st[k].steps.some(id => !exLvlOk(id))){ const old = st[k], nw = buildTodayPlan(); nw.done = nw.steps.map((id, i) => !!(old.done && old.done[i] && old.steps[i] === id)); nw.progSig = old.progSig; st[k] = nw; famStoreSet(DAILY_KEY, st); } }catch(e){}   /* bugün kaydedilmiş planda açılamayan adım varsa plan onarılır */
try{ if(st[k] && !st[k].v){ const old = st[k], nw = buildTodayPlan(); nw.done = nw.steps.map((id) => { const oi = old.steps.indexOf(id); return !!(oi >= 0 && old.done && old.done[oi]); }); nw.progSig = old.progSig; st[k] = nw; famStoreSet(DAILY_KEY, st); } }catch(e){}   /* eski (ısınmalı) plan yeni düzene geçer */
const progSig = (() => { const p = typeof familyProgram === "function" ? familyProgram() : null; return p ? [p.target, (p.mains || []).join("+"), (p.hw || []).join("+")].join("|") : ""; })();
if(st[k] && (st[k].progSig || "") !== progSig && !st[k].done.some(Boolean)){ delete st[k]; }
if(!st[k] || st[k].target !== famTarget()){
const keepDone = st[k] && st[k].target === famTarget() ? st[k].done : null;
st[k] = buildTodayPlan(); if(keepDone) st[k].done = keepDone; st[k].progSig = progSig;
famStoreSet(DAILY_KEY, st);
}
return st[k];
}
function saveTodayPlan(plan){ const st = famStoreGet(DAILY_KEY); st[famProfile() + "|" + famLvl() + "|" + todayKey()] = plan; famStoreSet(DAILY_KEY, st); }
function famLabel(id){ const ex = exerciseById(id); if(!ex) return ""; const i = ex.label.indexOf(": "); return i >= 0 ? ex.label.slice(i + 2) : ex.label; }
function famCatName(catId){ const c = CATEGORIES.find(x => x.id === catId) || OKUL_SKILLS.find(x => x.id === catId); return c ? (c.okul ? "🎒 " : "") + (c.label || c.title || catId) : catId; }
function lastTierFor(id){
const ex = exerciseById(id); if(!ex) return 0;
const names = [ex.label].concat(ex.oldLabels || []);
const list = loadSessions().filter(r => r.player === famProfile() && names.includes(r.exerciseLabel)).sort((a, b) => b.t - a.t);
if(!list.length){ const pt = placedTierFor(id, famProfile()); return pt != null ? pt : 0; }
const t = TIERS.findIndex(x => x.label === list[0].tier);
return t < 0 ? 0 : t;
}
const I_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const I_CHART = '<svg viewBox="0 0 24 24" width="22" height="22" style="flex:0 0 auto;vertical-align:-5px" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/></svg>';   /* KURAL: düğmedeki her simgenin boyu belirlidir (boyutsuz SVG iPhone'da düğmeden taşar) */

function renderFamilyHome(){
const box = document.getElementById("familyHome"); if(!box) return;
if(appMode !== "aile"){ box.style.display = "none"; return; }
try{ resolveLinkedChild(); }catch(e){}
const plan = todayPlan(), n = plan.done.filter(Boolean).length, all = n === 4;
const C = 2 * Math.PI * 26, off = C * (1 - n / 4);
box.innerHTML = `<h2 class="home-title">Aile Etkinlik Sayfası</h2>
<button type="button" class="fh-today" id="fhTodayBtn">
<span class="fh-ring"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="7"/><circle cx="32" cy="32" r="26" fill="none" stroke="#FFC21A" stroke-width="7" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/></svg><b>${n}/4</b></span>
<span class="fh-tx"><div class="fh-t1">${all ? "Bugün tamam!" : "Bugünün etkinlikleri"}</div><div class="fh-t2">${famProfile() === "Oyuncu" ? "Önce kişi seçin" : escHTML(famProfile())} · yaklaşık 12 dakika · hedef: ${famCatName(plan.target)}</div></span>
<span class="fh-go">${all ? "Gör" : (n ? "Devam" : "Başla")}</span></button>
${""/* KURAL: Aile sayfasında Etkinlik Raporları düğmesi yok (Bu hafta ve Gelişim haritası yeterli) */}
${recommendedCardHtml()}
${catPendingCardHtml(famProfile())}
<div class="fh-grid">
<button type="button" class="fh-week" id="fhHwBtn" style="position:relative"><span class="ic" style="background:var(--teal-tint);color:var(--teal-dark)">${icI("clip", 22, "#0A847E")}</span><span><div class="t1">Ödevlerim</div><div class="t2">Uzman ödevleri ve önerilen çalışmalar</div></span>${famProfile() === "Oyuncu" ? "" : hwBadgeHtml(hwBadgeCount(famProfile(), famLvl()))}</button>
<button type="button" class="fh-week" id="fhGrowBtn"><span class="ic" style="background:#FFF3C4;color:#9A6B00">${icI("sprout", 22, "#9A6B00")}</span><span><div class="t1">Gelişim haritası</div><div class="t2">Güçlü yönler ve gelişen alanlar</div></span></button>
<button type="button" class="fh-week" id="fhWeekBtn"><span class="ic">${I_CHART}</span><span><div class="t1">Bu hafta</div><div class="t2">Çalışılan günler ve kısa gelişim özeti</div></span></button>
<button type="button" class="fh-week" id="fhLinkBtn"><span class="ic" style="background:var(--teal-tint);color:var(--teal-dark)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg></span>
<span><div class="t1">${familyLinkLocal() ? "Uzmanınıza bağlı" : "Uzmana bağlan"}</div><div class="t2">${familyLinkLocal() ? (() => { const pr = familyProgram(); if(!pr) return "Uzmanınızın programı bekleniyor"; const tg = pr.target ? famCatName(pr.target) : ""; const days = (pr.days || []).map(d => DAY_SHORT[d]).filter(Boolean).join(", "); const parts = [tg ? "Program: " + tg : "Program hazırlanıyor", days].filter(Boolean); return parts.join(" · "); })() : (otherLevelLink() ? "Bu çocuğun uzman programı " + (famLvl() === "pre" ? "Okul Sonrası" : "Okul Öncesi") + " için; çocuğun okul dönemini değiştirin" : "Uzmanınızın verdiği kodu girin")}</div></span></button>
</div>`;
box.style.display = "flex";
const needPerson = () => famProfile() === "Oyuncu" && !familyLinkLocal();
const guard = (fn) => () => { if(needPerson()) pickPerson(() => renderCategoryList(), { noGuest:true }); else fn(); };
try{ catPendingBind(box, famProfile(), renderFamilyHome); }catch(e){}
try{ const rb = document.getElementById("fhReportsBtn"); if(rb){ rb.onclick = () => openHistoryScreen(); const eq = () => { const hero = rb.previousElementSibling; if(hero && hero.classList.contains("fh-today")){ rb.style.minHeight = ""; const hh = hero.getBoundingClientRect().height; if(hh > rb.getBoundingClientRect().height) rb.style.minHeight = Math.round(hh) + "px"; } }; eq(); requestAnimationFrame(eq); } }catch(e){}   /* büyük kartla aynı boy */
try{ requestAnimationFrame(() => fitHomeTitles(box)); fitHomeTitles(box); }catch(e){}
document.getElementById("fhTodayBtn").onclick = guard(showToday);
document.getElementById("fhWeekBtn").onclick = guard(showWeek);
document.getElementById("fhGrowBtn").onclick = guard(showGrowth);
document.getElementById("fhLinkBtn").onclick = guard(showLinkScreen);
document.getElementById("fhHwBtn").onclick = guard(() => { hwFrom = "aile"; showHwScreen(); });
box.querySelectorAll("[data-rec]").forEach(b => b.onclick = () => openRecommended(b.dataset.rec));
try{ watchFamilyLink(); }catch(e){}
}
function hideFamScreens(){ try{ zaHideLevelFlash(0); }catch(e){}  ["todayScreen","weekScreen"].forEach(id => { const e = document.getElementById(id); if(e) e.style.display = "none"; }); }
let famTargetEditing = false;
function showToday(){ ZA_LIFE.leave(); 
exitSessionMode();
document.getElementById("categoryScreen").style.display = "none";
document.getElementById("mainApp").style.display = "none";
hideFamScreens();
const plan = todayPlan(), n = plan.done.filter(Boolean).length, cur = plan.done.findIndex(x => !x);
const d = new Date();
const dateStr = d.toLocaleDateString("tr-TR", { weekday:"long", day:"numeric", month:"long" });
const chips = famTargetEditing ? `<div class="fam-chips">${famTargetOptions().map(c => `<button type="button" class="fam-chip${c.id === plan.target ? " on" : ""}" data-target="${c.id}">${famCatName(c.id)}</button>`).join("")}</div>` : "";
const steps = plan.steps.map((id, i) => {
const m = STEP_META[i], done = plan.done[i];
const desc = i === 0 || i === 3 ? m.desc : famCatName(plan.target);
return `<div class="fam-step ${m.cls}${done ? " done" : ""}${i === cur ? " current" : ""}"><div class="fam-dot"><span>${done ? I_CHECK : i + 1}</span><i></i></div>
<div class="fam-sc"><div class="fam-role">${m.role}<span>${m.min} dk</span></div><div class="fam-name">${famLabel(id)}</div><div class="fam-desc">${desc}</div></div></div>`;
}).join("");
const done = n === 4;
document.getElementById("todayWrap").innerHTML = `
<div><h2 class="fam-h">Bugün</h2><div class="fam-sub">${escHTML(famProfile())} · ${dateStr}</div></div>
${(() => { const pr = familyProgram(); if(!pr) return `<div class="fam-target">Bu haftanın hedefi: <b>${famCatName(plan.target)}</b><button type="button" id="famTargetBtn">${famTargetEditing ? "Tamam" : "Değiştir"}</button></div>`;
const today = (pr.days || []).includes(todayDayIdx());
return `<div class="fam-target">Uzmanınızın programı: <b>${famCatName(plan.target)}</b></div>${today ? "" : `<div class="fam-note" style="text-align:left">Bugün programda yok (${(pr.days || []).map(d => DAY_SHORT[d]).join(", ")}). İsterseniz yine de çalışabilirsiniz.</div>`}`; })()}
${chips}
${done ? `<div class="fam-card fam-done"><div class="m">${mascotSVG("cheer")}</div><div class="fam-h" style="font-size:22px">Bugünün etkinlikleri tamam!</div><div class="fam-sub">Harika bir iş çıkardınız. İsterseniz dört etkinlik daha yapabilirsiniz.</div></div>` : ""}
<div class="fam-steps">${steps}</div>
${done ? `<button type="button" class="fam-cta" id="famMoreCta"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M7 4.5v15l12-7.5z"/></svg> Devam et: 4 etkinlik daha</button><button type="button" class="fam-cta fam-cta2" id="famWeekCta" style="background:var(--panel,#fff);color:var(--teal-d,#05625D);border:2px solid var(--line,#DDE6EE);margin-top:10px">${I_CHART} Bu haftanın özetini gör</button>` : `<button type="button" class="fam-cta" id="famStartCta"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M7 4.5v15l12-7.5z"/></svg> ${n ? (cur + 1) + ". adımla devam et" : "Oturumu başlat"}</button>`}
<div class="fam-note">Zorluk her çalışmada çocuğun sonucuna göre kendiliğinden ayarlanır. Her adımın sonunda sonucu kaydedin.</div>`;
document.getElementById("todayScreen").style.display = "flex";
document.getElementById("todayScreen").scrollTop = 0;
try{ scheduleTour("today", "todayScreen"); }catch(e){}
const ftb = document.getElementById("famTargetBtn"); if(ftb) ftb.onclick = () => { famTargetEditing = !famTargetEditing; showToday(); };
document.querySelectorAll("#todayWrap [data-target]").forEach(b => b.onclick = () => {
setFamTarget(b.dataset.target);
const st = famStoreGet(DAILY_KEY), k = famProfile() + "|" + famLvl() + "|" + todayKey();
const old = st[k]; const np = buildTodayPlan();
if(old){ for(let q = 0; q < 4; q++){ if(old.done && old.done[q]){ np.steps[q] = old.steps[q]; np.done[q] = true; } } np.round = old.round || 1; np.used = old.used || []; }
st[k] = np; famStoreSet(DAILY_KEY, st);
famTargetEditing = false; showToday();
});
const sc = document.getElementById("famStartCta"); if(sc) sc.onclick = () => startSessionStep(cur);
const wc = document.getElementById("famWeekCta"); if(wc) wc.onclick = showWeek;
const mc = document.getElementById("famMoreCta"); if(mc) mc.onclick = () => { const pl = todayPlan(); const used = (pl.used || []).concat(pl.steps); const r = (pl.round || 1) + 1; const np = buildTodayPlan(r, used); np.round = r; np.used = used; np.progSig = pl.progSig; saveTodayPlan(np); showToday(); };   /* KURAL (Bugün): dört adım bitince "Devam et: 4 etkinlik daha" seçeneği sunulur; yeni turda bugün yapılanlar mümkünse tekrarlanmaz */
}
function startSessionStep(idx){ if(!imagesReady()){ imgWait(() => startSessionStep(idx)); return; }
try{ exitRecMode(); }catch(e){}
const plan = todayPlan(); const id = plan.steps[idx]; if(!id) return;
const ci = CATEGORIES.findIndex(c => c.exerciseIds.includes(id)); if(ci < 0) return;
hideFamScreens();
appMode = "aile";
sessionActive = { date: todayKey(), idx };
document.documentElement.classList.add("session-mode");
selectCategory(ci);
const e = currentCategoryExercises().findIndex(x => x.id === id);
const rc = recCfgFor(id);
let sidx = findSeqIndex(Math.max(rc ? Math.min(rc.t, tierMax(exerciseById(id))) : lastTierFor(id), exerciseById(id).minTier || 0), e);
if(sidx === undefined || sidx < 0) sidx = findSeqIndex(0, e);
goToIndex(sidx); currentStageIndex = rc ? Math.min(rc.s, currentExercise().stages.length - 1) : 0; recCfgNow = rc ? { id, s: currentStageIndex } : null; renderStageRow(); newPage();
renderSessionBar(false);
pinAssignedChild();
document.getElementById("sessionBackBtn").lastChild.textContent = " Bugün";
window.scrollTo(0, 0);
}
function renderSessionBar(stepDone){
if(!sessionActive) return;
const m = STEP_META[sessionActive.idx];
document.getElementById("sessionStepLabel").textContent = `Adım ${sessionActive.idx + 1}/4 · ${m.role}`;
document.getElementById("sessionStepTitle").textContent = famLabel(todayPlan().steps[sessionActive.idx]);
const nb = document.getElementById("sessionNextBtn");
nb.style.display = stepDone ? "" : "none";
nb.textContent = sessionActive.idx >= 3 ? "Bitir ›" : "Sıradaki ›";
}
function exitSessionMode(){ sessionActive = null; document.documentElement.classList.remove("session-mode"); }
function onSessionRecord(){
if(!sessionActive) return;
const plan = todayPlan();
if(currentExercise().id !== plan.steps[sessionActive.idx]) return;
plan.done[sessionActive.idx] = true; saveTodayPlan(plan);
renderSessionBar(true);
try{ playSound("up"); }catch(e){}
showLevelFlash(sessionActive.idx >= 3 ? "Bugünün son adımı tamam! 🎉" : `Adım ${sessionActive.idx + 1} tamam! Sıradaki: ${famLabel(plan.steps[sessionActive.idx + 1])}`, "levelup");
}


const APP_VERSION = "2026.11.09-i";
/* Son eklenen ekranların stili uygulamayla birlikte gelir: HTML dosyası eski kalsa bile görünüm bozulmaz */
/* RUNTIME_CSS → zihin-stil.css */
/* Dosya sürümü denetimi: zihin-atolyesi.html ile uygulama kodu (zihin-1…8) farklı sürümdeyse uyar */
/* KURAL (güncelleme, 2026-11-04): HTML ile uygulama betiği farklı sürümdeyse uygulama önce kendini onarır — sunucudaki HTML önbelleği atlayarak istenir; sunucuda yeni HTML varsa sayfa bir kez yeniden yüklenir (oturumda en çok bir kez). Sunucudaki HTML de uyuşmuyorsa ancak o zaman uyarı çıkar */
function checkFileVersions(){ try{ const hv = window.ZA_HTML_VERSION || null; if(hv === APP_VERSION) { try{ sessionStorage.removeItem("za_ver_heal"); }catch(e){} return; }
    let tried = false; try{ tried = sessionStorage.getItem("za_ver_heal") === APP_VERSION; }catch(e){}
    if(!tried && navigator.onLine !== false){ try{ sessionStorage.setItem("za_ver_heal", APP_VERSION); }catch(e){}
      fetch(location.pathname + "?_v=" + Date.now(), { cache: "no-store" }).then(r => r.ok ? r.text() : "").then(t => { const m = /ZA_HTML_VERSION\s*=\s*"([^"]+)"/.exec(t || ""); if(m && m[1] === APP_VERSION){ try{ if(navigator.serviceWorker && navigator.serviceWorker.controller){ caches.keys().then(ks => Promise.all(ks.filter(k => k !== "za-img").map(k => caches.open(k).then(c => c.delete("./zihin-atolyesi.html"))))).finally(() => location.replace((function(){ const u = new URL(location.href); u.searchParams.set("r", String(Date.now())); return u.href; })())); return; } }catch(e){} location.replace((function(){ const u = new URL(location.href); u.searchParams.set("r", String(Date.now())); return u.href; })()); } else { showVersionWarn(hv); } }).catch(() => showVersionWarn(hv)); return; }
    showVersionWarn(hv); }catch(e){} }
function showVersionWarn(hv){ try{ let el = document.getElementById("imgWarn"); if(!el){ el = document.createElement("div"); el.id = "imgWarn"; el.style.cssText = "display:none;position:fixed;left:12px;right:12px;bottom:92px;z-index:9997;background:#FFF4E5;color:#9A3412;border:2px solid #F59E0B;border-radius:14px;padding:10px 14px;font-weight:700;font-size:14px;text-align:center"; document.body.appendChild(el); }
  el.style.display = "block"; el.textContent = "Dosyalar farklı sürümde: zihin-atolyesi.html " + (hv || "eski sürüm") + ", uygulama kodu " + APP_VERSION + ". GitHub'a son teslimdeki dosyaların hepsini birlikte yükleyin (özellikle zihin-atolyesi.html)."; el.onclick = () => { el.style.display = "none"; }; }catch(e){} }
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(checkFileVersions, 1500)); else setTimeout(checkFileVersions, 1500);

const LINK_LOCAL_KEY = "wm_family_links_v1";
const CODE_ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
let expertLinks = [], expertLinksUnsub = null, expertResultsUnsub = null, expertResults = [], expertDevPlan = null, linkDocUnsubs = {};
const fbOk = () => !!(firestoreReady && window.__fb && window.__fb.doc && window.__fb.uid);
function newLinkCode(){ let c = ""; const a = new Uint32Array(8); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach((_, i) => a[i] = Math.random() * 1e9); a.forEach(v => c += CODE_ALPHA[v % CODE_ALPHA.length]); return c; }
function fmtCode(c){ return c ? c.slice(0, 4) + " " + c.slice(4) : ""; }
function cleanCode(c){ return String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, ""); }
function familyLinkLocal(){
const all = famStoreGet(LINK_LOCAL_KEY), lvl = famLvl(), other = lvl === "pre" ? "post" : "pre";
const hit = all[famProfile() + "|" + lvl] || all[famProfile() + "|" + other];   /* kategori düzeyi değişince de aynı bağlantı bulunur */
if(hit) return hit;
if(famProfile() === "Oyuncu") return all["Oyuncu|" + lvl] || all["Oyuncu|" + other] || null;
return null;
}
function otherLevelLink(){ const all = famStoreGet(LINK_LOCAL_KEY); const other = famLvl() === "pre" ? "post" : "pre"; return all[famProfile() + "|" + other] || null; }
function linkedChildName(l){
l = l || familyLinkLocal(); if(!l) return "";
const p = (l.profile || "").trim();
return p && p !== "Oyuncu" ? p : (l.childName || "").trim();
}
function resolveLinkedChild(){
const all = famStoreGet(LINK_LOCAL_KEY), lvl = famLvl();
if(famProfile() !== "Oyuncu") return;
const l = all["Oyuncu|" + lvl]; if(!l) return;
const name = linkedChildName(l); if(!name) return;
l.profile = name; all[name + "|" + lvl] = l; delete all["Oyuncu|" + lvl];
famStoreSet(LINK_LOCAL_KEY, all);
currentPlayerName = name;
try{
if(typeof playersList !== "undefined" && !playersList.includes(name)){
if(firestoreReady && window.__fb){ const { db, collection, addDoc } = window.__fb; addDoc(collection(db, "players"), withUid({ name, createdAt: Date.now() })).catch(() => {}); playersList = playersList.concat([name]); }
else { playersList.push(name); queuePendingWrite("players", { name, createdAt: Date.now() }); }
renderPlayerOptions();
}
}catch(e){}
}
function setFamilyLinkLocal(v){ const all = famStoreGet(LINK_LOCAL_KEY); const k = famProfile() + "|" + famLvl(); if(v) all[k] = v; else delete all[k]; famStoreSet(LINK_LOCAL_KEY, all); }
const DAY_SHORT = ["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];
const todayDayIdx = () => (new Date().getDay() + 6) % 7;
function hideLinkScreens(){ try{ const ls = document.getElementById("linkScreen"); if(ls) ls.classList.remove("za-hw"); }catch(e){}  ["expertScreen","linkScreen"].forEach(id => { const e = document.getElementById(id); if(e) e.style.display = "none"; }); }
function leaveToCategories(){ hideLinkScreens(); hideFamScreens(); renderCategoryList(); document.getElementById("categoryScreen").style.display = "block"; }
function needCloudHtml(){ return `<div class="fam-card"><div style="font-weight:900;font-size:15px">İnternet bağlantısı gerekli</div><div class="fam-sub" style="font-weight:600;margin-top:4px">Uzman ve aile bağlantısı bulut üzerinden çalışır. Bağlantı kurulunca bu ekran kendiliğinden kullanılabilir olur.</div></div>`; }

function familyProgram(){ const l = familyLinkLocal(); return l && l.program ? l.program : null; }
function watchFamilyLink(){
const l = familyLinkLocal();
if(!l || !fbOk() || linkDocUnsubs[l.code]) return;
const { db, doc, onSnapshot } = window.__fb;
linkDocUnsubs[l.code] = onSnapshot(doc(db, "links", l.code), snap => {
const d = snap.exists() ? snap.data() : null;
const cur = familyLinkLocal();
if(!cur || cur.code !== l.code) return;
if(!d || d.familyUid !== window.__fb.uid){ setFamilyLinkLocal(null); }
else { cur.program = d.program || null; cur.childName = d.childName; setFamilyLinkLocal(cur); }
try{ if(document.getElementById("categoryScreen").style.display !== "none") renderCategoryList(); }catch(e){}
}, () => {});
}
function sendResultToExpert(record){
const l = familyLinkLocal();
if(!l) return;
if(!fbOk()){
try{ queuePendingWrite("links/" + l.code + "/results", Object.assign({}, record, { player: linkedChildName(l) || record.player, fromSession: !!sessionActive })); }catch(e){}
return;
}
const { db, doc, collection, addDoc, updateDoc } = window.__fb;
const child = linkedChildName(l) || record.player;
addDoc(collection(db, "links", l.code, "results"), Object.assign({}, record, { player: child, uid: window.__fb.uid, fromSession: !!sessionActive })).catch(e => console.error("Uzmana sonuç gönderilemedi:", e));
const wk = weekKey();
l.weekDays = l.weekKey === wk ? Array.from(new Set((l.weekDays || []).concat([todayDayIdx()]))) : [todayDayIdx()];
l.weekKey = wk; setFamilyLinkLocal(l);
updateDoc(doc(db, "links", l.code), { weekKey: wk, weekDays: l.weekDays, lastActivityAt: Date.now() }).catch(() => {});
}

function showLinkScreen(){
hwScreenOpen = false; hideFamScreens(); hideLinkScreens();
document.getElementById("categoryScreen").style.display = "none";
const l = familyLinkLocal();
const w = document.getElementById("linkWrap");
if(l){
const p = l.program;
w.innerHTML = `<div><h2 class="fam-h">Uzman bağlantısı</h2><div class="fam-sub">${escHTML(famProfile())} · bağlı</div></div>
<div class="fam-card"><div style="font-weight:900;font-size:15px">Program</div>
<div class="fam-sub" style="font-weight:600;margin-top:6px;line-height:1.6">${p ? `Hedef alan: <b style="color:var(--ink)">${famCatName(p.target)}</b><br>Günler: ${(p.days || []).map(d => DAY_SHORT[d]).join(", ") || "—"}<br>Günlük süre: ${p.minutes || 12} dakika` : "Uzmanınız henüz program atamadı. Atadığında burada ve “Bugün” ekranında görünecek."}</div></div>
${p && ((p.mains || []).length || (p.hw || []).length) ? `<div class="fam-card"><div style="font-weight:900;font-size:15px">Uzmanın önerdiği çalışmalar</div><div class="fam-chips" style="margin-top:8px">${(p.hw || []).map(id => `<span class="fam-chip on">${icI("pin", 15, "#0A847E")} ${famLabel(id)}</span>`).join("")}${(p.mains || []).filter(id => !(p.hw || []).includes(id)).map(id => `<span class="fam-chip">${famLabel(id)}</span>`).join("")}</div><div class="fam-sub" style="font-weight:600;margin-top:6px">${icI("pin", 14, "#0A847E")} işaretliler ödevdir; günlük oturumda önce bunlar gelir.</div></div>` : ""}
<div class="fam-card"><div style="font-weight:900;font-size:15px">Uzmanla paylaşılanlar</div><div class="fam-sub" style="font-weight:600;margin-top:6px;line-height:1.6">Her çalışmadan sonra: çocuğun adı, çalışmanın adı, aşaması, düzeyi, süresi, hata sayısı ve tarihi.<br>Paylaşılmayanlar: oyun ilerlemesi, yıldızlar ve cihazdaki diğer kişiler.</div></div>
<div class="fam-note">Bağlantıyı kaldırırsanız paylaşım bu cihazdan durur; daha önce gönderilen sonuçlar uzmanda kalır.</div>
<button type="button" class="unlink-btn" id="unlinkBtn">Bağlantıyı bu cihazdan kaldır</button>`;
document.getElementById("unlinkBtn").onclick = async () => { if(await zaConfirm("Uzman bağlantısı bu cihazdan kaldırılsın mı?")){ setFamilyLinkLocal(null); leaveToCategories(); } };
} else {
w.innerHTML = `<div><h2 class="fam-h">Uzmana bağlan</h2><div class="fam-sub">${escHTML(famProfile())} için</div></div>
${fbOk() ? "" : needCloudHtml()}
<div class="fam-card" style="display:flex;flex-direction:column;gap:14px">
<div class="ex-field"><label for="linkChildSel">Bu kod hangi çocuk için?</label><select id="linkChildSel" class="ex-input">${(() => { const names = (typeof playersList !== "undefined" ? playersList : []).slice(); const cur = (currentPlayerName || "").trim(); if(cur && !names.includes(cur)) names.unshift(cur); return (names.length ? names : ["Oyuncu"]).map(n => `<option value="${String(n).replace(/"/g, "&quot;")}"${n === cur ? " selected" : ""}>${String(n).replace(/</g, "&lt;")}</option>`).join(""); })()}</select></div>
<div class="ex-field"><label for="linkCodeInput">Uzmanınızın verdiği kod</label><input id="linkCodeInput" class="ex-input code" maxlength="9" autocomplete="off" autocapitalize="characters" placeholder="ABCD 2345"></div>
<label class="ex-consent"><input type="checkbox" id="linkConsent"> <span>${escHTML(famProfile())} için kaydedilen çalışma sonuçlarının (çalışma adı, düzey, süre, hata sayısı) bu uzmanla paylaşılmasına onay veriyorum. Onayımı bağlantıyı kaldırarak istediğim zaman geri alabilirim.</span></label>
<div class="ex-err" id="linkErr"></div>
<button type="button" class="fam-cta" id="linkGoBtn">Bağlan</button>
</div>`;
const inp = document.getElementById("linkCodeInput");
inp.oninput = () => { const c = cleanCode(inp.value).slice(0, 8); inp.value = c.length > 4 ? c.slice(0, 4) + " " + c.slice(4) : c; };
document.getElementById("linkGoBtn").onclick = async () => {
const err = document.getElementById("linkErr"); err.textContent = "";
const code = cleanCode(inp.value);
if(code.length !== 8){ err.textContent = "Kod 8 karakter olmalı."; return; }
if(!document.getElementById("linkConsent").checked){ err.textContent = "Devam etmek için paylaşım onayı gerekli."; return; }
if(!fbOk()){ err.textContent = "İnternet bağlantısı yok."; return; }
const { db, doc, getDoc, updateDoc } = window.__fb;
try{
const snap = await getDoc(doc(db, "links", code));
if(!snap.exists()){ err.textContent = "Bu kodla bir bağlantı bulunamadı."; return; }
const d = snap.data();
if(d.familyUid && d.familyUid !== window.__fb.uid){ err.textContent = "Bu kod başka bir cihazda kullanılmış. Uzmanınızdan yeni kod isteyin."; return; }
await updateDoc(doc(db, "links", code), { familyUid: window.__fb.uid, familyLinkedAt: Date.now(), consent: true });
let owner = ((document.getElementById("linkChildSel") || {}).value || famProfile()).trim();
if(!owner || owner === "Oyuncu") owner = (d.childName || "").trim() || "Oyuncu";
if(owner !== famProfile()){ currentPlayerName = owner; }
setFamilyLinkLocal({ code, childName: d.childName, profile: famProfile(), program: d.program || null, linkedAt: Date.now() });
watchFamilyLink();
showLevelFlash("Uzmanınıza bağlandınız ✓", "levelup");
leaveToCategories();
}catch(e){ console.error(e); err.textContent = "Bağlanılamadı. Kodu kontrol edip tekrar deneyin."; }
};
}
document.getElementById("linkScreen").style.display = "flex";
document.getElementById("linkScreen").scrollTop = 0;
}

function watchExpertLinks(){
if(!fbOk() || expertLinksUnsub) return;
const { db, collection, query, where, onSnapshot } = window.__fb;
expertLinksUnsub = onSnapshot(query(collection(db, "links"), where("expertUid", "==", window.__fb.uid)), snap => {
expertLinks = snap.docs.map(d => Object.assign({ id: d.id }, d.data())).sort((a, b) => String(a.childName).localeCompare(String(b.childName), "tr"));
if(document.getElementById("expertScreen").style.display !== "none" && expertView.mode === "list") renderExpertList(); if(document.getElementById("expertScreen").style.display !== "none" && expertView.mode === "hw") renderExpertHw();
if(document.getElementById("expertScreen").style.display !== "none" && expertView.mode === "client" && expertView.pendingData && expertLinks.some(x => x.id === expertView.code)){ expertView.pendingData = false; renderExpertClient(expertView.code); }
if(document.getElementById("categoryScreen").style.display !== "none") renderExpertHome();
}, e => console.error("Danışanlar okunamadı:", e));
}
function renderExpertHome(){
const box = document.getElementById("expertHome"); if(!box) return;
if(appMode !== "uzman"){ box.style.display = "none"; return; }
watchExpertLinks();
const n = expertLinks.length, linked = expertLinks.filter(l => l.familyUid).length;
const cur = (currentPlayerName || "").trim(), has = !!cur && cur !== "Misafir" && cur !== "Oyuncu";
const P = has ? placeGet(cur) : null, L = (() => { try{ return lastGet(); }catch(e){ return null; } })(), canResume = !!(has && L && L.mode === "uzman" && L.player === cur);
const sumTxt = P ? (() => { const v = Object.values(P.dom), post = v.filter(x => x >= 3).length; return post === v.length ? "Değerlendirme: Okul Sonrası" : post === 0 ? "Değerlendirme: Okul Öncesi" : `Değerlendirme: ${post} alan Okul Sonrası`; })() : "Değerlendirme turu henüz yapılmadı";
const go = !has ? "Seç" : !P ? "Değerlendir" : canResume ? "Devam" : "Başla";
const ic = (path, col) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const T = "#0A847E", K = "#A9632A";
const I = { users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M18 14.8c2 .7 3.2 2.4 3.6 5.2"/>', hw:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 12 3 3 5-6"/>', grow:'<path d="M12 21v-9"/><path d="M12 12c0-4 3-7 7-7 0 4-3 7-7 7z"/><path d="M12 14c0-3-2.5-5.5-6-5.5 0 3.5 2.5 5.5 6 5.5z"/>', week:'<path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/>', compass:'<circle cx="12" cy="12" r="9.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>' };
const goTxt = !has ? "Dokun: kişi seç" : canResume ? "Dokun: kaldığı yerden devam" : P ? "Dokun: gelişmesi gereken alanla başla" : "Dokun: ilk alandan başla";
box.innerHTML = `<h2 class="home-title">Uzman Etkinlik Sayfası</h2>
${""/* KURAL: Uzman sayfasında "… ile seans" kartı yok */}
${reportsBtnHtml("exReportsBtn")}
${has ? catPendingCardHtml(cur) : ""}
<div class="fh-grid">
<button type="button" class="fh-week" id="exHomeBtn"><span class="ic" style="background:var(--teal-tint);color:var(--teal-dark)">${ic(I.users, T)}</span><span><div class="t1">Danışanlar</div><div class="t2">${n ? `${n} danışan · ${linked} aile bağlı · ödevler danışan ekranında` : "Danışan ekle, aileye bağla, ödev gönder"}</div></span></button>
<button type="button" class="fh-week" id="exGrowBtn"><span class="ic" style="background:#FFF3C4;color:#9A6B00">${ic(I.grow, "#9A6B00")}</span><span><div class="t1">Gelişim haritası</div><div class="t2">${has ? escHTML(cur) + " · güçlü yönler ve gelişen alanlar" : "Kişi seçince açılır"}</div></span></button>
<button type="button" class="fh-week" id="exWeekBtn"><span class="ic">${ic(I.week, "#9A5A12")}</span><span><div class="t1">Bu hafta</div><div class="t2">${has ? "Çalışılan günler ve kısa gelişim özeti" : "Kişi seçince açılır"}</div></span></button>
${has ? `<button type="button" class="fh-week" id="exPlaceBtn"><span class="ic" style="background:var(--teal-tint);color:var(--teal-dark)">${ic(I.compass, T)}</span><span><div class="t1">Değerlendirme turu</div><div class="t2">${P ? sumTxt.replace("Değerlendirme: ", "") + " · " + new Date(P.t).toLocaleDateString("tr-TR") + " · yeniden değerlendir" : "On alanda başlangıç düzeyini belirle"}</div></span></button>` : ""}
</div>`;
box.style.display = "flex";
const needPerson = (fn) => () => { if(!has){ pickPerson(() => renderCategoryList(), { noGuest:true }); return; } fn(); };
try{ if(has) catPendingBind(box, cur, renderExpertHome); }catch(e){}
try{ const rb = document.getElementById("exReportsBtn"); if(rb){ rb.onclick = () => openHistoryScreen(); const eq = () => { const hero = rb.previousElementSibling; if(hero && hero.classList.contains("fh-today")){ rb.style.minHeight = ""; const hh = hero.getBoundingClientRect().height; if(hh > rb.getBoundingClientRect().height) rb.style.minHeight = Math.round(hh) + "px"; } }; eq(); requestAnimationFrame(eq); } }catch(e){}   /* büyük kartla aynı boy */
try{ requestAnimationFrame(() => fitHomeTitles(box)); fitHomeTitles(box); }catch(e){}
document.getElementById("exHomeBtn").onclick = () => showExpert("list");
document.getElementById("exGrowBtn").onclick = needPerson(showGrowth);
document.getElementById("exWeekBtn").onclick = needPerson(showWeek);
if(document.getElementById("exTodayCard")) document.getElementById("exTodayCard").onclick = needPerson(() => {
  if(canResume) return resumeLast(L);
  if(P){ const d = PLACE_DOMS.slice().sort((a, b) => (P.dom[a.k] ?? 9) - (P.dom[b.k] ?? 9))[0]; const ci = CATEGORIES.findIndex(c => d.cats.includes(c.id) && !c.hidden); if(ci >= 0) return selectCategory(ci); }
  const first = CATEGORIES.findIndex(c => !c.hidden && c.id === "islemleme-hizi"); selectCategory(first >= 0 ? first : 0); });
const pb = document.getElementById("exPlaceBtn"); if(pb) pb.onclick = async () => { if(P && !await zaConfirm(cur + " için değerlendirme turu yeniden yapılsın mı? Yeni sonuçlar eskisinin yerine geçer.")) return; placeStart(cur); };
}
const expertView = { mode:"list", code:null };
function showExpert(mode, code){
expertView.mode = mode; expertView.code = code || null;
document.getElementById("categoryScreen").style.display = "none";
hideFamScreens(); hideLinkScreens();
watchExpertLinks();
if(mode === "list") renderExpertList(); else if(mode === "hw") renderExpertHw(); else if(mode === "new") renderExpertNew(); else renderExpertClient(code);
document.getElementById("expertScreen").style.display = "flex";
document.getElementById("expertScreen").scrollTop = 0;
if(mode === "list"){ try{ scheduleTour("expert", "expertScreen"); }catch(e){} }
}
function weekBars(l){
const days = l.program && l.program.days && l.program.days.length ? l.program.days : [0,1,2,3,4];
const done = l.weekKey === weekKey() ? (l.weekDays || []) : [];
return { html: days.map(d => `<i class="${done.includes(d) ? "on" : ""}"></i>`).join(""), n: days.filter(d => done.includes(d)).length, total: days.length };
}
function renderExpertList(){
const w = document.getElementById("expertWrap");
const rows = expertLinks.map(l => {
const b = weekBars(l);
const st = !l.familyUid ? ["Kod bekleniyor", "var(--ink-soft)"] : !l.program ? ["Program yok", "#9A5A12"] : b.n >= Math.ceil(b.total * 0.6) ? ["Yolunda", "var(--teal-dark)"] : ["Geride", "#9A5A12"];
return `<button type="button" class="ex-client" data-code="${l.id}"><span class="ex-av">${String(l.childName || "?").charAt(0).toLocaleUpperCase("tr-TR")}</span>
<span class="ex-tx"><div class="ex-t1">${escHTML(l.childName)}</div><div class="ex-t2">${l.level === "pre" ? "Okul Öncesi" : "Okul Sonrası"}${l.program ? " · " + famCatName(l.program.target) : ""}</div>${l.familyUid ? `<div class="ex-bars">${b.html}</div>` : ""}</span>
<span class="ex-status" style="color:${st[1]}">${st[0]}</span></button>`;
}).join("");
w.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><div><h2 class="fam-h">Danışanlarım</h2><div class="fam-sub">Uzman paneli</div></div>
<button type="button" class="fam-cta" id="exNewBtn" style="width:auto;height:48px;padding:0 16px;font-size:15px">+ Danışan</button></div>
${fbOk() ? "" : needCloudHtml()}
${rows || `<div class="fam-card"><div style="font-weight:900">Henüz danışan yok</div><div class="fam-sub" style="font-weight:600;margin-top:4px">“+ Danışan” ile ekleyin; uygulama aileye vereceğiniz bir kod üretir.</div></div>`}
<div class="fam-note">Çubuk: bu haftaki programdan tamamlanan günler.</div>`;
document.getElementById("exNewBtn").onclick = () => showExpert("new");
w.querySelectorAll("[data-code]").forEach(b => b.onclick = () => showExpert("client", b.dataset.code));
}
/* Ödevler özeti: bütün danışanların ödev ve program durumu; önce ilgilenilmesi gerekenler üstte */
function renderExpertHw(){ const w = document.getElementById("expertWrap");
  const info = (l) => { const p = l.program || null, hw = p && Array.isArray(p.hw) ? p.hw.length : 0, b = weekBars(l), last = l.lastActivityAt ? Math.floor((Date.now() - l.lastActivityAt) / 864e5) : null;
    let st, rank; if(!l.familyUid){ st = ["Kod bekleniyor", "var(--ink-soft)"]; rank = 3; } else if(!p){ st = ["Program yok", "#9A5A12"]; rank = 0; } else if(!hw){ st = ["Ödev yok", "#9A5A12"]; rank = 1; } else if(b.n < Math.ceil(b.total * 0.6)){ st = ["Geride", "#9A5A12"]; rank = 2; } else { st = ["Yolunda", "var(--teal-dark)"]; rank = 4; }
    return { l, p, hw, b, last, st, rank }; };
  const all = expertLinks.map(info).sort((a, b) => a.rank - b.rank || String(a.l.childName).localeCompare(String(b.l.childName), "tr")); const need = all.filter(x => x.rank <= 2).length;
  const rows = all.map(x => `<button type="button" class="ex-client" data-code="${x.l.id}"><span class="ex-av">${String(x.l.childName || "?").charAt(0).toLocaleUpperCase("tr-TR")}</span>
    <span class="ex-tx"><div class="ex-t1">${escHTML(x.l.childName)}</div><div class="ex-t2">${x.p ? famCatName(x.p.target) + " · " : ""}${x.hw ? x.hw + " ödev" : "ödev atanmadı"}${x.last != null ? " · son etkinlik " + (x.last === 0 ? "bugün" : x.last + " gün önce") : ""}</div>${x.l.familyUid && x.p ? `<div class="ex-bars">${x.b.html}</div>` : ""}</span>
    <span class="ex-status" style="color:${x.st[1]}">${x.st[0]}</span></button>`).join("");
  w.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><div><h2 class="fam-h">Ödevler</h2><div class="fam-sub">${all.length ? (need ? `${need} danışan ilgi bekliyor` : "Hepsi yolunda") : "Uzman paneli"}</div></div>
    <button type="button" class="fam-cta ghost" id="exHwListBtn" style="width:auto;height:48px;padding:0 16px;font-size:15px">Danışanlar</button></div>
    ${fbOk() ? "" : needCloudHtml()}
    ${rows || `<div class="fam-card"><div style="font-weight:900">Henüz danışan yok</div><div class="fam-sub" style="font-weight:600;margin-top:4px">Önce Danışanlar'dan danışan ekleyin; ödevler danışan ekranında atanır.</div></div>`}
    <div class="fam-note">Sıra: program yok → ödev yok → geride → yolunda. Ödev atamak ya da değiştirmek için danışana dokunun. Çubuk: bu haftaki programdan tamamlanan günler.</div>`;
  document.getElementById("exHwListBtn").onclick = () => showExpert("list");
  w.querySelectorAll("[data-code]").forEach(b => b.onclick = () => showExpert("client", b.dataset.code)); }
function renderExpertNew(){
const w = document.getElementById("expertWrap");
const opts = (typeof playersList !== "undefined" ? playersList : []);
w.innerHTML = `<div><h2 class="fam-h">Danışan ekle</h2><div class="fam-sub">Aileye verilecek bağlantı kodu oluşturulur</div></div>
${fbOk() ? "" : needCloudHtml()}
<div class="fam-card" style="display:flex;flex-direction:column;gap:14px">
<div class="ex-field"><label for="exChildName">Kişi seç ya da yeni ad yaz</label>${(() => { const linked = new Set((expertLinks || []).map(x => (x.childName || "").trim().toLocaleLowerCase("tr"))); const av = whoNames().filter(n => !linked.has(n.toLocaleLowerCase("tr"))); return av.length ? `<div class="ex-pick">${av.map(n => `<button type="button" class="fam-chip" data-pick="${escHTML(n)}">${escHTML(n)}</button>`).join("")}</div>` : ""; })()}<input id="exChildName" class="ex-input" placeholder="Yeni kişinin adı" maxlength="40"><div class="fam-sub" style="font-weight:600;margin-top:4px">Kayıtlı bir kişiyi seçerseniz, bu cihazda onunla yaptığınız çalışmalar ödevlendirmede de görünür.</div></div>
<div class="ex-field"><label>Okul dönemi</label><div class="ex-seg" style="grid-template-columns:1fr 1fr"><button type="button" data-lvl="pre">Okul Öncesi</button><button type="button" data-lvl="post" class="on">Okul Sonrası</button></div></div>
<div class="ex-err" id="exNewErr"></div>
<button type="button" class="fam-cta" id="exCreateBtn">Kod oluştur</button>
</div>`;
let lvl = "post";
w.querySelectorAll("[data-lvl]").forEach(b => b.onclick = () => { lvl = b.dataset.lvl; w.querySelectorAll("[data-lvl]").forEach(x => x.classList.toggle("on", x === b)); });
w.querySelectorAll("[data-pick]").forEach(b => b.onclick = () => { const n = b.dataset.pick; document.getElementById("exChildName").value = n; w.querySelectorAll("[data-pick]").forEach(x => x.classList.toggle("on", x === b)); const pl = getPlayerLevel(n); if(pl){ const lb = w.querySelector(`[data-lvl="${pl}"]`); if(lb) lb.click(); } });
document.getElementById("exCreateBtn").onclick = async (ev) => {
const btn = ev.currentTarget; if(btn.disabled) return;
const err = document.getElementById("exNewErr"); err.textContent = "";
const name = cleanPersonName(document.getElementById("exChildName").value);
if(!name){ err.textContent = "Çocuğun adını yazın."; return; }
if(!fbOk()){ err.textContent = "İnternet bağlantısı yok."; return; }
const { db, doc, getDoc, setDoc, addDoc, collection } = window.__fb;
btn.disabled = true; btn.textContent = "Oluşturuluyor…";
try{
let code, g = 0;
do{ code = newLinkCode(); g++; } while(g < 5 && (await getDoc(doc(db, "links", code))).exists());
const rec = { code, expertUid: window.__fb.uid, childName: name, level: lvl, createdAt: Date.now(), familyUid: null, consent: false, program: null, weekKey: "", weekDays: [], lastActivityAt: null };
await setDoc(doc(db, "links", code), rec);
if(!expertLinks.some(x => x.id === code)) expertLinks.unshift(Object.assign({ id: code }, rec));
try{ if(!playersList.includes(name)){ playersList.push(name); if(addDoc && collection) addDoc(collection(db, "players"), withUid({ name, createdAt: Date.now() })).catch(() => {}); } if(!getPlayerLevel(name)) rememberPlayerLevel(name, lvl); }catch(e){}
showExpert("client", code); showLevelFlash(`${name} için bağlantı kodu oluşturuldu ✓`, "levelup");
}catch(e){ console.error(e); err.textContent = "Kod oluşturulamadı. Tekrar deneyin."; btn.disabled = false; btn.textContent = "Kod oluştur"; }
};
}
function renderExpertClient(code){ try{ hwSel.clear(); }catch(e){}
const found = expertLinks.find(x => x.id === code);
expertView.pendingData = !found;
const l = found || { id: code, childName: "", level: "post" };
const w = document.getElementById("expertWrap");
const lvlSave = readingLevel; readingLevel = l.level || "post";
const targets = famTargetOptions();
const p = Object.assign({ target: targets[0] ? targets[0].id : "islemleme-hizi", days: [0,1,2,3,4], minutes: 12, mains: [], games: [], hw: [] }, l.program || {});
if(!Array.isArray(p.games)) p.games = []; if(!Array.isArray(p.hw)) p.hw = [];
const hwSel = new Set();
const mainsOf = (t) => { famNameOverride = l.childName || null; try{ return famExIds(t); } finally{ famNameOverride = null; } };   /* danışanın kategori kademeleri */
let gamesOpen = null;
const draw = () => {
readingLevel = l.level || "post";
const exs = mainsOf(p.target);
const b = weekBars(l);
w.innerHTML = `<div style="display:flex;align-items:flex-start;gap:10px"><h2 class="fam-h" style="flex:1">${escHTML(l.childName || "Danışan")}</h2><button type="button" class="fam-chip" id="exRenameBtn" style="flex:none">Adı düzenle</button></div><div><div class="fam-sub">${l.level === "pre" ? "Okul Öncesi" : "Okul Sonrası"} · ${l.familyUid ? "aile bağlı" : "aile henüz bağlanmadı"}</div>${(() => { try{ const diff = CATEGORIES.filter(c => !c.hidden).map(c => [c, catLevelInfo(c.id, l.childName)]).filter(([c, i]) => i.by !== "genel" && i.lvl !== (l.level || "post")); return diff.length ? `<div class="fam-sub" style="margin-top:4px">Okul dönemi farklı alanlar: ${diff.map(([c, i]) => escHTML(c.label) + " (" + (i.lvl === "pre" ? "Okul Öncesi" : "Okul Sonrası") + ")").join(", ")}</div>` : ""; }catch(e){ return ""; } })()}</div>
${(l.childName || "").trim() ? `<div class="fam-card" style="display:flex;flex-direction:column;gap:6px"><button type="button" class="fam-cta" id="exStartBtn">▶ ${escHTML(l.childName.trim())} ile oturum başlat</button><div class="fam-sub" style="font-weight:600">Çalışmalar bu cihazda <b>${escHTML(l.childName.trim())}</b> adıyla kaydedilir; ödevlendirme bu kayıtları kullanır.</div></div>` : ""}
${!l.familyUid ? `<div class="fam-card" style="display:flex;flex-direction:column;gap:10px"><div style="font-weight:900">Bağlantı kodu</div><div class="ex-code">${fmtCode(code)}</div>
<div class="fam-sub" style="font-weight:600">Aile, uygulamada <b>Bilişsel Etkinlik → Aile → Uzmana bağlan</b> bölümüne bu kodu girer.</div>
<button type="button" class="fam-cta ghost" id="exShareBtn">Kodu paylaş</button></div>` : ""}
${l.familyUid ? `<div class="fam-card"><div style="font-weight:900;font-size:16px">Son sonuçlar</div><div id="exResults"><div class="fam-sub" style="font-weight:600;margin-top:6px">Yükleniyor…</div></div></div>` : ""}
${(() => { const W = hwWeakPages(l.childName); try{ window.__hwDrawn = { code, sig: W.list.map(x => x.id).join(",") + "|" + W.total }; }catch(e){} const lv = readingLevel;
return `<div class="fam-card" style="display:flex;flex-direction:column;gap:10px"><div style="font-weight:900;font-size:16px">Ödevlendirme</div>
<div class="fam-sub" style="font-weight:600">Bu cihazda <b>${escHTML(l.childName || "danışan")}</b> adıyla yaptığınız son 45 günlük oturumlara göre zorlandığı sayfalar (son 3 denemenin yarısından fazlasında 2+ hata ya da son denemede 3+ hata).</div>
${p.hw.length ? `<div><div style="font-weight:800;margin-bottom:6px">Verilen ödevler</div><div class="fam-chips">${p.hw.map(id => { const cf = expertCfgFor(l.childName, [id])[id]; return `<button type="button" class="fam-chip on" data-hwx="${id}">${icI("pin", 15, "#0A847E")} ${famLabel(id)}${cf ? ` <small>(${escHTML(cfgLabel(id, cf))})</small>` : ""} ✕</button>`; }).join("")}</div><div class="fam-sub" style="font-weight:600;margin-top:4px">Ödevler, sizin bu çocukla en son çalıştığınız aşama ve düzeyde açılır.</div></div>` : ""}
${W.list.length ? `<div>${W.list.slice(0, 8).map(x => `<div class="ex-row" data-hws="${x.id}"><div class="tx"><div class="t1">${famLabel(x.id)}${p.hw.includes(x.id) ? " · " + icI("pin", 14, "#0A847E") : ""}</div><div class="fam-sub" style="font-weight:600">${famCatName(x.cat)} · son: ${x.err} hata, ${escHTML(x.tier || "")} · başarı %${x.rate} (${x.n} deneme)</div></div>${p.hw.includes(x.id) ? `<span class="hw-in">${icI("pin", 13, "#0A847E")} ödevde</span>` : `<span class="ex-check${hwSel.has(x.id) ? " on" : ""}">${hwSel.has(x.id) ? I_CHECK : ""}</span>`}</div>`).join("")}</div>
<div style="display:flex;gap:8px"><button type="button" class="fam-cta" id="hwAutoBtn" style="flex:1">Otomatik ödevlendir</button><button type="button" class="fam-cta ghost" id="hwManBtn" style="flex:1">Seçilenleri ödev yap${hwSel.size ? ` (${hwSel.size})` : ""}</button></div>
<div class="fam-sub" style="font-weight:600">Otomatik: en çok zorlandığı 4 sayfa ödev olur. Manuel: listeden işaretlediklerinizi ekler. En fazla 4 ödev; aile bunları günlük oturumda öncelikli yapar.</div>`
: `<div class="fam-sub" style="font-weight:700;color:var(--ink)">${W.total ? "Zorlandığı sayfa görünmüyor; son oturumlar başarılı. 👍" : "Bu danışan için henüz kayıt yok: ailenin evden gönderdiği sonuç da, bu cihazda yapılmış oturum da bulunmuyor. Aile çalıştıkça ya da siz Etkinlikte “Kim çalışıyor?” bölümünden danışanın adını seçerek çalıştıkça burada zorlandığı sayfalar görünür."}</div>`}</div>`; })()}
<div class="fam-card" id="exDevCard" style="display:flex;flex-direction:column;gap:10px"></div>
<div class="fam-card" style="display:flex;flex-direction:column;gap:14px">
<div style="font-weight:900;font-size:16px">Haftalık program</div>
<div class="ex-field"><label>Hedef alan</label><div class="fam-chips">${targets.map(c => `<button type="button" class="fam-chip${c.id === p.target ? " on" : ""}" data-t="${c.id}">${famCatName(c.id)}</button>`).join("")}</div></div>
<div class="ex-field"><label>Günler</label><div class="ex-seg" style="grid-template-columns:repeat(7,1fr)">${DAY_SHORT.map((d, i) => `<button type="button" data-d="${i}" class="${p.days.includes(i) ? "on" : ""}">${d}</button>`).join("")}</div></div>
<div class="ex-field"><label>Günlük süre</label><div class="ex-seg" style="grid-template-columns:repeat(3,1fr)">${[10, 15, 20].map(m => `<button type="button" data-m="${m}" class="${p.minutes === m ? "on" : ""}">${m} dk</button>`).join("")}</div></div>
<div class="ex-field"><label>Önerilen çalışmalar (en fazla 4). Aile bunları tek dokunuşla açar; günlük oturumda her gün bunlardan 2'si yapılır. Boş bırakılırsa uygulama seçer.</label>
<div>${exs.map(id => `<div class="ex-row" data-x="${id}"><div class="tx"><div class="t1">${famLabel(id)}</div></div><span class="ex-check${p.mains.includes(id) ? " on" : ""}">${p.mains.includes(id) ? I_CHECK : ""}</span></div>`).join("")}</div></div>
<div class="ex-field"><label>Oyun haritası görevleri (en fazla 3). Çocuğun Zihin Adaları'ndaki "Bugünün Rotası"na <b>özel görev</b> olarak eklenir.</label>
${p.games.length ? `<div class="fam-chips" style="margin-bottom:6px">${p.games.map(id => `<button type="button" class="fam-chip on" data-g="${id}">${famLabel(id)} ✕</button>`).join("")}</div>` : ""}
<div>${GAME_ISLANDS.filter(i => !i.legacy && !i.special && i.id !== "goz").map(i => { const ids = gameIslandStops(i); if(!ids.length) return "";
return `<details class="ex-isl" data-isl="${i.id}"${gamesOpen === i.id ? " open" : ""}><summary style="font-weight:800;cursor:pointer;padding:6px 0"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${i.color};margin-right:6px"></span>${i.name} <span style="color:var(--ink-soft);font-weight:700">(${ids.filter(x => p.games.includes(x)).length}/${ids.length})</span></summary>${ids.map(id => `<div class="ex-row" data-g="${id}"><div class="tx"><div class="t1">${famLabel(id)}</div></div><span class="ex-check${p.games.includes(id) ? " on" : ""}">${p.games.includes(id) ? I_CHECK : ""}</span></div>`).join("")}</details>`; }).join("")}</div></div>
<div class="ex-err" id="exProgErr"></div>
<button type="button" class="fam-cta" id="exSendBtn"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3L10.5 13.5"/><path d="M21 3l-6.5 18-4-7.5-7.5-4z"/></svg> ${l.program ? "Programı güncelle" : "Aileye gönder"}</button>
</div>
${l.familyUid ? `<div class="fam-card"><div style="font-weight:900;font-size:16px;margin-bottom:10px">Bu hafta</div>
<div class="fam-days">${DAY_SHORT.map((n, i) => { const on = l.weekKey === weekKey() && (l.weekDays || []).includes(i); return `<div class="fam-day${on ? " on" : ""}${i === todayDayIdx() ? " today" : ""}"><span>${on ? I_CHECK : ""}</span>${n}</div>`; }).join("")}</div>
<div class="fam-sub" style="font-weight:600;margin-top:10px">Programdan tamamlanan gün: <b style="color:var(--ink)">${b.n}/${b.total}</b>${l.lastActivityAt ? ` · son etkinlik: ${new Date(l.lastActivityAt).toLocaleDateString("tr-TR", { day:"numeric", month:"long" })}` : ""}</div></div>` : ""}
<button type="button" class="ex-danger" id="exDeleteBtn">Danışanı ve bağlantıyı sil</button>`;
readingLevel = lvlSave;
w.querySelectorAll("[data-t]").forEach(x => x.onclick = () => { p.target = x.dataset.t; p.mains = []; draw(); });
{ const sb = document.getElementById("exStartBtn"); if(sb) sb.onclick = () => { const nm = cleanPersonName(l.childName || ""); if(!nm) return; const lv = l.level === "pre" ? "pre" : "post";
if(!playersList.includes(nm)){ playersList.push(nm); if(firestoreReady && window.__fb){ const { db, collection, addDoc } = window.__fb; addDoc(collection(db, "players"), withUid({ name: nm, createdAt: Date.now() })).catch(e => console.error(e)); } else { try{ queuePendingWrite("players", { name: nm, createdAt: Date.now() }); }catch(e){} } try{ renderPlayerOptions(); renderLevelPlayerOptions(); }catch(e){} }
rememberPlayerLevel(nm, lv); hideLinkScreens(); try{ exitGameMode(); hideFamScreens(); }catch(e){}
appMode = "uzman"; viaWho = true; readingLevel = lv; try{ applyLevelDefaultThresholds(lv); }catch(e){}
pendingLevelPlayerName = nm; pendingLevelPlayerIsNew = false; chooseReadingLevel(lv); showLevelFlash(`${nm} ile oturum başladı`, "levelup"); }; }
const saveProg = async (msg) => { if(!fbOk()){ showLevelFlash("İnternet bağlantısı yok.", "down"); return false; } hwStamp(p); const { db, doc, updateDoc } = window.__fb;
try{ await updateDoc(doc(db, "links", code), { program: { target: p.target, days: p.days, minutes: p.minutes, mains: p.mains, games: p.games, hw: p.hw, hwLog: p.hwLog, devOff: !!p.devOff, cfg: expertCfgFor(l.childName, (p.mains || []).concat(p.hw || [])), updatedAt: Date.now() } }); l.program = Object.assign({}, p); showLevelFlash(msg, "levelup"); return true; }catch(e){ console.error(e); showLevelFlash("Ödev kaydedilemedi.", "down"); return false; } };
w.querySelectorAll("[data-hws]").forEach(x => x.onclick = () => { const id = x.dataset.hws; if(p.hw.includes(id)) return; if(hwSel.has(id)) hwSel.delete(id); else hwSel.add(id); draw(); });
w.querySelectorAll("[data-hwx]").forEach(x => x.onclick = async () => { p.hw = p.hw.filter(v => v !== x.dataset.hwx); await saveProg("Ödev kaldırıldı ✓"); draw(); });
const devBox = document.getElementById("exDevCard"); const devFill = () => { const bx = document.getElementById("exDevCard"); if(!bx) return; bx.innerHTML = exDevCardHtml(p, expertDevPlan); exDevCardWire(bx, p, saveProg, devFill); }; window.__exDevDraw = devFill; if(devBox) devFill();   /* Aşama 4: gelişim ödevleri kartı */ const ha = document.getElementById("hwAutoBtn"); if(ha) ha.onclick = async () => { readingLevel = l.level || "post"; const W = hwWeakPages(l.childName); readingLevel = lvlSave; p.hw = W.list.filter(x => { const ex = exerciseById(x.id), c = CATEGORIES.find(k => k.exerciseIds.includes(x.id)); return ex && ex.readingLevel.includes(c ? catLevelFor(c.id, l.childName) : (l.level || "post")); }).slice(0, 4).map(x => x.id); hwSel.clear(); await saveProg(`${p.hw.length} sayfa ödev olarak gönderildi ✓`); draw(); };
const hm = document.getElementById("hwManBtn"); if(hm) hm.onclick = async () => { if(!hwSel.size){ showLevelFlash("Önce listeden sayfa işaretleyin.", "down"); return; } const add = [...hwSel].filter(id => !p.hw.includes(id)); const next = p.hw.concat(add);
if(next.length > 4){ showLevelFlash(`En fazla 4 ödev olabilir (şu an ${p.hw.length}).`, "down"); return; }
try{ const off = add.filter(id => { const ex = exerciseById(id), c = CATEGORIES.find(x => x.exerciseIds.includes(id)); if(!ex || !c) return false; return !ex.readingLevel.includes(catLevelFor(c.id, l.childName)); });
  if(off.length){ const c0 = CATEGORIES.find(x => x.exerciseIds.includes(off[0])); const lv = catLevelFor(c0.id, l.childName); const ok = await zaConfirm(`${off.map(id => exerciseById(id).label).join(", ")}: ${l.childName || "çocuk"} için ${c0.label} alanının okul dönemi ${lv === "pre" ? "Okul Öncesi" : "Okul Sonrası"}; bu sayfa o dönemde yok. Yine de ödev verilsin mi? Ödev kendi döneminde açılır.`); if(!ok) return; } }catch(e){}
p.hw = next; hwSel.clear(); await saveProg(`${add.length} sayfa ödev olarak eklendi ✓`); draw(); };
w.querySelectorAll("[data-d]").forEach(x => x.onclick = () => { const d = +x.dataset.d; p.days = p.days.includes(d) ? p.days.filter(v => v !== d) : p.days.concat([d]).sort(); draw(); });
w.querySelectorAll("[data-m]").forEach(x => x.onclick = () => { p.minutes = +x.dataset.m; draw(); });
w.querySelectorAll("[data-x]").forEach(x => x.onclick = () => { const id = x.dataset.x; if(p.mains.includes(id)) p.mains = p.mains.filter(v => v !== id); else if(p.mains.length < 4) p.mains = p.mains.concat([id]); draw(); });
w.querySelectorAll("details.ex-isl").forEach(d => d.addEventListener("toggle", () => { if(d.open) gamesOpen = d.dataset.isl; }));
w.querySelectorAll("[data-g]").forEach(x => x.onclick = () => { const id = x.dataset.g; const d = x.closest("details"); if(d) gamesOpen = d.dataset.isl;
if(p.games.includes(id)) p.games = p.games.filter(v => v !== id); else if(p.games.length < 3) p.games = p.games.concat([id]); else { showLevelFlash("En fazla 3 oyun görevi seçilebilir.", "down"); return; } draw(); });
const sh = document.getElementById("exShareBtn");
if(sh) sh.onclick = async () => {
const text = `Zihin Atölyesi bağlantı kodu (${l.childName}): ${fmtCode(code)}\nUygulamada Bilişsel Etkinlik → Aile → Uzmana bağlan bölümüne girin.`;
try{ if(navigator.share) await navigator.share({ text }); else { await navigator.clipboard.writeText(text); showLevelFlash("Kod kopyalandı ✓", "levelup"); } }catch(e){}
};
document.getElementById("exSendBtn").onclick = async () => {
const err = document.getElementById("exProgErr"); err.textContent = "";
if(!p.days.length){ err.textContent = "En az bir gün seçin."; return; }
if(!fbOk()){ err.textContent = "İnternet bağlantısı yok."; return; }
const { db, doc, updateDoc } = window.__fb;
try{ await updateDoc(doc(db, "links", code), { program: { target: p.target, days: p.days, minutes: p.minutes, mains: p.mains, games: p.games, hw: p.hw, cfg: expertCfgFor(l.childName, (p.mains || []).concat(p.hw || [])), updatedAt: Date.now() } }); showLevelFlash(l.familyUid ? "Program aileye gönderildi ✓" : "Program kaydedildi; aile bağlanınca görecek ✓", "levelup"); }
catch(e){ console.error(e); err.textContent = "Program kaydedilemedi."; }
};
document.getElementById("exRenameBtn").onclick = async () => {
const nv = cleanPersonName(prompt("Danışanın adı:", l.childName || "") || "");
if(!nv || nv === l.childName || !fbOk()) return;
const { db, doc, updateDoc } = window.__fb;
try{ await updateDoc(doc(db, "links", code), { childName: nv }); l.childName = nv; showLevelFlash("Ad güncellendi ✓", "levelup"); draw(); }catch(e){ console.error(e); }
};
document.getElementById("exDeleteBtn").onclick = async () => {
if(!await zaConfirm(`${l.childName}, aile bağlantısı ve bu bağlantıyla gönderilmiş sonuçlar silinsin mi? Aile cihazındaki bağlantı da sona erer.`)) return;
if(!fbOk()) return;
const { db, doc, deleteDoc, collection, getDocs, writeBatch } = window.__fb;
try{
const snap = await getDocs(collection(db, "links", code, "results"));
for(let i = 0; i < snap.docs.length; i += 400){ const bt = writeBatch(db); snap.docs.slice(i, i + 400).forEach(d => bt.delete(d.ref)); await bt.commit(); }
}catch(e){ console.warn("Sonuçlar silinemedi (Firestore kuralı gerekebilir):", e); }
try{ await deleteDoc(doc(db, "links", code)); showExpert("list"); }catch(e){ console.error(e); }
};
if(l.familyUid) watchExpertResults(code);
};
draw();
}
/* KURAL (otomatik ödevlendirme): uzmanın danışan sayfasında "zorlandığı sayfalar" hem uzmanın cihazındaki oturumlardan hem de ailenin evden gönderdiği sonuçlardan (bağlantının sonuç kaydı) hesaplanır; aynı kayıt iki kez sayılmaz */
function hwWeakPages(childName){ const nm = (childName || "").trim().toLocaleLowerCase("tr"); if(!nm) return { list:[], total:0 }; const since = Date.now() - 45 * 864e5; let recs = loadSessions().filter(r => (r.player || "").trim().toLocaleLowerCase("tr") === nm && r.t >= since);
  try{ if(typeof expertView !== "undefined" && expertView && expertView.code && Array.isArray(expertResults) && expertResults.length){ const seen = new Set(recs.map(r => r.t + "|" + r.exerciseLabel)); expertResults.forEach(r => { if(r && r.exerciseLabel && typeof r.t === "number" && r.t >= since && !seen.has(r.t + "|" + r.exerciseLabel)){ seen.add(r.t + "|" + r.exerciseLabel); recs.push(r); } }); } }catch(e){}
const by = {}; recs.forEach(r => { (by[r.exerciseLabel] = by[r.exerciseLabel] || []).push(r); });
const list = [];
for(const [label, arr] of Object.entries(by)){ const ex = EXERCISES.find(e => e.label === label || (e.oldLabels || []).includes(label)); if(!ex) continue;
const cat = CATEGORIES.find(c => !c.hidden && c.exerciseIds.includes(ex.id)); if(!cat || cat.id === "goz-takip") continue;
const last = arr.sort((a, b) => b.t - a.t).slice(0, 3), bad = last.filter(r => (r.errors || 0) >= 2).length, rate = Math.round((1 - bad / last.length) * 100);
if(rate < 50 || (last[0].errors || 0) >= 3) list.push({ id: ex.id, cat: cat.id, rate, err: last[0].errors || 0, tier: last[0].tier, n: last.length, t: last[0].t }); }
list.sort((a, b) => a.rate - b.rate || b.err - a.err || b.t - a.t);
return { list, total: recs.length }; }
function expertCfgFor(child, ids){ const nm = (child || "").trim().toLocaleLowerCase("tr"), out = {}; if(!nm) return out;
const recs = loadSessions().filter(r => (r.player || "").trim().toLocaleLowerCase("tr") === nm).sort((a, b) => b.t - a.t);
Array.from(new Set(ids || [])).forEach(id => { const ex = exerciseById(id); if(!ex) return; const r = recs.find(x => x.exerciseLabel === ex.label || (ex.oldLabels || []).includes(x.exerciseLabel)); if(!r) return;
const t = Math.max(0, TIERS.findIndex(x => x.label === r.tier)); let st = ex.stages.findIndex(x => x.label === r.stageLabel); if(st < 0) st = 0; out[id] = { t, s: st }; }); return out; }
function cfgLabel(id, cf){ const ex = exerciseById(id); if(!ex || !cf) return ""; return `${(ex.stages[cf.s] || ex.stages[0]).label} · ${(TIERS[cf.t] || TIERS[0]).label}`; }
function watchExpertResults(code){
if(!fbOk()) return;
if(expertResultsUnsub){ expertResultsUnsub(); expertResultsUnsub = null; }
const { db, collection, onSnapshot } = window.__fb;
expertResultsUnsub = onSnapshot(collection(db, "links", code, "results"), snap => {
const allR = snap.docs.map(d => d.data()); expertDevPlan = allR.filter(r => r && r.kind === "devplan").sort((a, b) => b.t - a.t)[0] || null; expertResults = allR.filter(r => !r || r.kind !== "devplan").sort((a, b) => b.t - a.t); try{ const dc = document.getElementById("exDevCard"); if(dc && typeof window.__exDevDraw === "function") window.__exDevDraw(); }catch(e){} try{ const hd = window.__hwDrawn; if(hd && hd.code === code && expertView && expertView.code === code && document.getElementById("expertScreen") && document.getElementById("expertScreen").style.display !== "none"){ const l0 = (expertLinks || []).find(x => x.id === code); if(l0){ const W2 = hwWeakPages(l0.childName); const sig2 = W2.list.map(x => x.id).join(",") + "|" + W2.total; if(sig2 !== hd.sig && !(document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))){ hd.sig = sig2; setTimeout(() => { try{ if(expertView.code === code) renderExpertClient(code); }catch(e){} }, 0); } } } }catch(e){}   /* ailenin sonuçları gelince zorlandığı sayfalar kartı yenilenir */
const box = document.getElementById("exResults"); if(!box) return;
const short = (l) => { const i = String(l).indexOf(": "); return i >= 0 ? l.slice(i + 2) : l; };
box.innerHTML = expertResults.length ? expertResults.slice(0, 12).map(r => `<div class="ex-row"><div class="tx"><div class="t1">${escHTML(short(String(r.exerciseLabel || "")))}</div>
<div class="t2">${r.player ? escHTML(String(r.player)) + " · " : ""}${new Date(Number(r.t) || 0).toLocaleDateString("tr-TR", { day:"numeric", month:"short" })} · ${escHTML(String(r.tier || ""))} · ${((Number(r.ms) || 0) / 1000).toFixed(1)} sn · ${Number(r.errors) || 0} hata${r.fromSession ? " · oturum" : ""}</div></div></div>`).join("")
: `<div class="fam-sub" style="font-weight:600;margin-top:6px">Henüz sonuç yok.</div>`;
}, e => console.error("Sonuçlar okunamadı:", e));
}
(function initLinks(){
document.getElementById("expertBackBtn").addEventListener("click", () => {
if(expertResultsUnsub){ expertResultsUnsub(); expertResultsUnsub = null; }
if(expertView.mode === "list"){ if(window.__exFromHome){ window.__exFromHome = false; hideLinkScreens(); showWho(); } else leaveToCategories(); } else showExpert("list");
});
document.getElementById("linkBackBtn").addEventListener("click", () => { if(hwScreenOpen && hwFrom === "home"){ hwScreenOpen = false; hideLinkScreens(); showWho(); return; } hwScreenOpen = false; leaveToCategories(); });   /* Ödevlerim ana sayfadan açıldıysa ana sayfaya döner */
window.addEventListener("firebase-ready", () => setTimeout(() => { try{ watchFamilyLink(); }catch(e){} }, 1500));
})();


let recActive = null;
function recommendedIds(){
const prog = familyProgram(); if(!prog) return [];
const pool = famExIds(prog.target);
const chosen = (prog.mains || []).filter(id => pool.includes(id));
const hw = (prog.hw || []).filter(id => !!exerciseById(id));
const base = chosen.length ? chosen : pool.slice(0, 6);
return hw.concat(base.filter(id => !hw.includes(id)));
}
function recommendedCardHtml(){
const prog = familyProgram(); if(!prog) return "";
const ids = recommendedIds(); if(!ids.length) return "";
const chosen = (prog.mains || []).length > 0 || (prog.hw || []).length > 0;
const doneToday = new Set(loadSessions().filter(r => r.player === famProfile() && todayKey(new Date(r.t)) === todayKey()).map(r => r.exerciseLabel));
return `<div class="fh-rec"><div class="fh-rec-h"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg>Uzmanın önerdiği çalışmalar<span>${chosen ? "uzman seçti" : famCatName(prog.target)}</span></div>` +
ids.map((id, i) => { const ex = exerciseById(id); const done = doneToday.has(ex.label);
return `<button type="button" class="fh-rec-item" data-rec="${id}"><span class="fh-rec-num">${done ? I_CHECK.replace('stroke-width="3"', 'stroke-width="3" width="18" height="18"') : i + 1}</span><span class="fh-rec-tx"><div class="fh-rec-t1">${(prog.hw || []).includes(id) ? "📌 " : ""}${famLabel(id)}</div><div class="fh-rec-t2">${(prog.hw || []).includes(id) ? "Uzmanın ödevi · " : ""}${famCatName(CATEGORIES.find(c => c.exerciseIds.includes(id)).id)}${done ? " · bugün yapıldı" : ""}</div></span><span class="fh-rec-go">Aç</span></button>`; }).join("") + `</div>`;
}
function recNextId(){ const ids = recommendedIds(); const i = ids.indexOf(recActive); return i >= 0 && i < ids.length - 1 ? ids[i + 1] : null; }
function renderRecBar(saved){
const ids = recommendedIds(), i = ids.indexOf(recActive);
document.getElementById("sessionStepLabel").textContent = `Uzman önerisi · ${i + 1}/${ids.length}`;
document.getElementById("sessionStepTitle").textContent = famLabel(recActive);
const nb = document.getElementById("sessionNextBtn");
nb.style.display = "";
nb.textContent = recNextId() ? "Sonraki ›" : "Bitir ›";
nb.classList.toggle("calm-btn", !saved);
}
function recNext(){
const nx = recNextId();
if(nx){ openRecommended(nx); return; }
exitRecMode(); document.getElementById("mainApp").style.display = "none"; leaveToCategories();
showLevelFlash("Uzmanınızın önerdiği çalışmalar tamam 🎉", "levelup");
}
function onRecRecord(){
if(!recActive || currentExercise().id !== recActive) return;
renderRecBar(true);
const nx = recNextId();
showLevelFlash(nx ? `Tamam! Sıradaki öneri: ${famLabel(nx)}` : "Son öneri de tamam! 🎉", "levelup");
}
let recCfgNow = null;
function recCfgFor(id){ try{ const p = familyProgram(); return (p && p.cfg && p.cfg[id]) || null; }catch(e){ return null; } }
function openRecommended(id){
const ci = CATEGORIES.findIndex(c => c.exerciseIds.includes(id)); if(ci < 0) return;
hideFamScreens(); hideLinkScreens();
exitSessionMode();
appMode = "aile";
recActive = id;
document.documentElement.classList.add("rec-mode");
selectCategory(ci);
const e = currentCategoryExercises().findIndex(x => x.id === id);
const rc = recCfgFor(id);
let sidx = findSeqIndex(Math.max(rc ? Math.min(rc.t, tierMax(exerciseById(id))) : lastTierFor(id), exerciseById(id).minTier || 0), e);
if(sidx === undefined || sidx < 0) sidx = findSeqIndex(0, e);
goToIndex(sidx); currentStageIndex = rc ? Math.min(rc.s, currentExercise().stages.length - 1) : 0; recCfgNow = rc ? { id, s: currentStageIndex } : null; renderStageRow(); newPage();
pinAssignedChild();
renderRecBar(false);
document.getElementById("sessionBackBtn").lastChild.textContent = " Geri";
window.scrollTo(0, 0);
}
function exitRecMode(){ recActive = null; document.documentElement.classList.remove("rec-mode"); }
function pinAssignedChild(){
try{ resolveLinkedChild(); }catch(e){}
const l = familyLinkLocal();
const name = linkedChildName(l) || famProfile();
if(name && name !== "Oyuncu"){
currentPlayerName = name;
const sel = document.getElementById("playerSelect");
if(sel){ if(![...sel.options].some(o => o.value === name)){ try{ renderPlayerOptions(); }catch(e){} } sel.value = name; }
try{ updatePlayerAvatar(name); }catch(e){}
awaitingPlayerChoice = false;
}
const w = document.getElementById("sessionWho");
if(w) w.innerHTML = `${avatarHTML(name, 30)}<span>${String(name).replace(/</g, "&lt;")}</span>`;
}


function showWeek(){
exitSessionMode();
document.getElementById("categoryScreen").style.display = "none";
document.getElementById("mainApp").style.display = "none";
hideFamScreens();
const me = famProfile();
const ws = weekStart().getTime(), we = ws + 7 * 864e5, ps = ws - 7 * 864e5;
const mine = loadSessions().filter(r => r.player === me);
const thisW = mine.filter(r => r.t >= ws && r.t < we), prevW = mine.filter(r => r.t >= ps && r.t < ws);
const daysOn = new Set(thisW.map(r => (new Date(r.t).getDay() + 6) % 7));
const todayIdx = (new Date().getDay() + 6) % 7;
const dayNames = ["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];
const minutes = Math.round(thisW.reduce((a, r) => a + (r.ms || 0), 0) / 60000);
const short = (l) => { const i = l.indexOf(": "); return i >= 0 ? l.slice(i + 2) : l; };
const tierIdx = (lbl) => Math.max(0, TIERS.findIndex(t => t.label === lbl));
const insights = [];
const labels = [...new Set(thisW.map(r => r.exerciseLabel))];
labels.forEach(l => {
const a = thisW.filter(r => r.exerciseLabel === l), b = prevW.filter(r => r.exerciseLabel === l);
const speed = (arr) => arr.reduce((s, r) => s + r.ms / Math.max(1, r.itemCount || 1), 0) / arr.length;
const err = (arr) => arr.reduce((s, r) => s + (r.errors || 0), 0) / arr.length;
const maxT = (arr) => Math.max(...arr.map(r => tierIdx(r.tier)));
if(b.length){
if(maxT(a) > maxT(b)) insights.push({ k:3, ic:"up", t:short(l), d:`${TIERS[maxT(a)].label} düzeyine geçti.` });
else if(speed(a) < speed(b) * 0.9 && err(a) <= err(b)) insights.push({ k:2, ic:"up", t:short(l), d:"Geçen haftaya göre daha hızlı çalıştı." });
else if(err(a) < err(b) - 0.4) insights.push({ k:2, ic:"up", t:short(l), d:"Hataları azaldı; daha dikkatli çalışıyor." });
else if(err(a) > err(b) + 1 && speed(a) > speed(b)) insights.push({ k:1, ic:"try", t:short(l), d:"Bu hafta biraz zorladı; aynı düzeyde birkaç kez daha çalışmak iyi gelir." });
} else if(a.length >= 2 && err(a.slice(-1)) < err(a.slice(0, 1))){
insights.push({ k:1, ic:"up", t:short(l), d:"Hafta içinde tekrar ettikçe hataları azaldı." });
}
});
insights.sort((x, y) => y.k - x.k);
const icon = (k) => k === "up"
? `<span class="ic" style="background:var(--teal-tint);color:var(--teal-dark)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 14l7-7 7 7"/></svg></span>`
: `<span class="ic" style="background:var(--amber-tint);color:#9A5A12"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v4h4"/></svg></span>`;
let insightHtml = insights.slice(0, 4).map(x => `<div class="fam-insight">${icon(x.ic)}<div><div class="t1">${x.t}</div><div class="t2">${x.d}</div></div></div>`).join("");
if(!insightHtml){
insightHtml = thisW.length
? `<div class="fam-insight">${icon("up")}<div><div class="t1">İyi bir başlangıç</div><div class="t2">Bu hafta ${labels.length} farklı çalışma yapıldı. Gelecek hafta aynı çalışmalar tekrarlandıkça burada gelişim karşılaştırması görünecek.</div></div></div>`
: `<div class="fam-insight">${icon("try")}<div><div class="t1">Henüz bu hafta çalışılmadı</div><div class="t2">"Bugünün etkinlikleri" ile başlayabilirsiniz; yaklaşık 12 dakika sürer.</div></div></div>`;
}
const opts = famTargetOptions(), cur = famTarget(), ni = (opts.findIndex(c => c.id === cur) + 1) % Math.max(1, opts.length);
const nextTarget = opts.length ? famCatName(opts[ni].id) : "";
document.getElementById("weekWrap").innerHTML = `
<div><h2 class="fam-h">Bu hafta</h2><div class="fam-sub">${escHTML(me)} · aile özeti</div></div>
<div class="fam-card">
<div style="font-size:15px;font-weight:900;margin-bottom:12px">Çalışılan günler</div>
<div class="fam-days">${dayNames.map((n, i) => `<div class="fam-day${daysOn.has(i) ? " on" : ""}${i === todayIdx ? " today" : ""}"><span>${daysOn.has(i) ? I_CHECK : ""}</span>${n}</div>`).join("")}</div>
<div class="fam-stats"><div class="fam-stat"><b>${daysOn.size}</b><span>gün</span></div><div class="fam-stat"><b>${minutes}</b><span>dakika</span></div><div class="fam-stat"><b>${thisW.length}</b><span>çalışma</span></div></div>
</div>
<div class="fam-card"><div style="font-size:15px;font-weight:900">Öne çıkanlar</div>${insightHtml}</div>
<div class="fam-card"><div style="font-size:15px;font-weight:900;margin-bottom:6px">Gelecek hafta önerisi</div>
<div class="fam-sub" style="font-weight:600;line-height:1.5">Haftada 4–5 gün, günde 10–15 dakika. ${nextTarget ? `Hedef alanı <b style="color:var(--ink)">${nextTarget}</b> olabilir.` : ""}</div></div>
<button type="button" class="fam-cta ghost" id="weekTodayBtn">Bugünün etkinliklerine dön</button>`;
document.getElementById("weekScreen").style.display = "flex";
document.getElementById("weekScreen").scrollTop = 0;
document.getElementById("weekTodayBtn").onclick = showToday;
}
(function initFamily(){
document.getElementById("todayBackBtn").addEventListener("click", () => { hideFamScreens(); renderCategoryList(); document.getElementById("categoryScreen").style.display = "block"; });
document.getElementById("weekBackBtn").addEventListener("click", () => { hideFamScreens(); renderCategoryList(); document.getElementById("categoryScreen").style.display = "block"; });
document.getElementById("sessionBackBtn").addEventListener("click", () => {
resetTimer();
if(recActive){ exitRecMode(); document.getElementById("mainApp").style.display = "none"; leaveToCategories(); }
else showToday();
});
document.getElementById("sessionNextBtn").addEventListener("click", () => {
resetTimer();
if(recActive){ recNext(); return; }
const plan = todayPlan(), nx = plan.done.findIndex(x => !x);
if(nx < 0) showToday(); else startSessionStep(nx);
});
})();

const GAME_KEY = "wm_game_v1";
const GAME_STAR_SVG = (on) => on
? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z" fill="#E39B2D" stroke="#E39B2D" stroke-width="1.2" stroke-linejoin="round"/></svg>'
: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z" fill="none" stroke="#9AA6AB" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const GAME_LOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>';
const GAME_ISLAND_ICONS = {
resim:'<svg viewBox="0 0 24 24" fill="none" stroke="#C25A1C" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2" fill="#C25A1C"/><path d="M4 18l5-5 4 4 3-3 4 4"/></svg>',
mantik:'<svg viewBox="0 0 24 24" fill="none" stroke="#1E7A55" stroke-width="2"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5" fill="#1E7A55"/><rect x="3" y="13" width="8" height="8" rx="1.5" fill="#1E7A55"/><rect x="13" y="13" width="8" height="8" rx="1.5" stroke-dasharray="2 2"/></svg>',
usta:'<svg viewBox="0 0 24 24" fill="#FFD23F" stroke="#9A6B00" stroke-width="1.6" stroke-linejoin="round"><path d="M9 21h6l-1-11h-4z"/><path d="M8 10h8l-1-3H9z"/><path d="M12 2l1.2 2.4L16 5l-2.8.6L12 8l-1.2-2.4L8 5l2.8-.6z"/></svg>',
gezgin:'<svg viewBox="0 0 24 24" fill="none" stroke="#1C6F68" stroke-width="2" stroke-linejoin="round"><path d="M3 16h18l-3 4H6z" fill="#1C6F68"/><path d="M12 3v12M12 4l6 9h-6"/></svg>',
macera:'<svg viewBox="0 0 24 24" fill="none" stroke="#9A5A12" stroke-width="2" stroke-linejoin="round"><path d="M4 5l5-2 6 2 5-2v16l-5 2-6-2-5 2z" fill="#FFE2A8"/><path d="M9 3v16M15 5v16"/><circle cx="17.5" cy="9" r="1.6" fill="#E5484D" stroke="none"/></svg>',
mola:'<svg viewBox="0 0 24 24" fill="none" stroke="#4E8A2E" stroke-width="2" stroke-linecap="round"><path d="M12 21c-5-3-8-7-6-12 3 1 5 3 6 6 1-3 3-5 6-6 2 5-1 9-6 12z" fill="#A8D88A"/></svg>',
hiz:'<svg viewBox="0 0 24 24" fill="#FF9F1C" stroke="#B45F00" stroke-width="1.6" stroke-linejoin="round"><path d="M13.5 2.5L5 13.5h6l-1 8 8.5-11h-6z"/></svg>',
dikkat:'<svg viewBox="0 0 24 24" fill="none" stroke="#1F8A4C" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6" fill="#1F8A4C"/></svg>',
goz:'<svg viewBox="0 0 24 24" fill="none" stroke="#5B47C9" stroke-width="2.2" stroke-linecap="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3.2" fill="#5B47C9"/></svg>',
plan:'<svg viewBox="0 0 24 24" fill="none" stroke="#C2410C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4.5L3.5 6.5v13L9 17.5l6 2 5.5-2v-13L15 6.5z"/><path d="M9 4.5v13M15 6.5v13"/></svg>',
bellek:'<svg viewBox="0 0 24 24" fill="none" stroke="#9A6B00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.3 1.1 2.2h5c0-.9.5-1.7 1.1-2.2A6 6 0 0 0 12 3z" fill="#FFE27A"/></svg>',
kavram:'<svg viewBox="0 0 24 24" fill="none" stroke="#1D6FB8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="6" fill="#DDF1FF"/><path d="M9.5 16.5h5M10.5 19.5h3"/><path d="M12 7v3l2 1"/></svg>',
bulmaca:'<svg viewBox="0 0 24 24" fill="none" stroke="#6B3FD0" stroke-width="2" stroke-linejoin="round"><path d="M4 9h4a2 2 0 1 1 4 0h4v4a2 2 0 1 1 0 4v3H4z" fill="#EEE4FF"/></svg>',
soz:'<svg viewBox="0 0 24 24" fill="none" stroke="#B4236A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v10H9l-5 4z" fill="#FFD6E8"/><path d="M8 9h8M8 12h5"/></svg>',
park:'<svg viewBox="0 0 24 24" fill="none" stroke="#1D6FB8" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3.5 9.5c5 1.5 12 1.5 17 0M3.5 14.5c5-1.5 12-1.5 17 0M12 3v18"/></svg>'
};
const GAME_ISLANDS = [
{ id:"hiz",    name:"Hız Adası",     color:"#FFB648", ids:["search-object", "search-shape", "trail-numbers", "cat-fruit", "search-symbol", "search-letter", "sdmt-touch", "cat-cold", "quick-sort", "touch-card", "cat-living", "pairs-touch", "dot-count", "sem-decide", "pair-match", "sent-verify"] },
{ id:"dikkat", name:"Dikkat Adası",  color:"#62D394", ids:["touch-animal", "fish-flanker", "stroop-touch", "day-night-touch", "face-go", "switch-touch", "sort-color-shape", "sort-animal-size", "sort-color-shape-count", "sort-words", "trail-animal-fruit", "trail-color-shape", "number-letter", "trail-number-month", "dual-task", "stop-signal", "vigilance", "anti-touch", "tap-reverse", "size-stroop", "num-stroop", "spatial-stroop", "hold-wait", "less-more", "context-go", "distract", "grass-snow", "fist", "rule-shift", "reversal", "navon", "creature-count", "rev-sort", "look-first"] },
{ id:"goz",    name:"Göz Adası",     color:"#B09BFF", fromCategory:"goz-takip" },
{ id:"bellek", name:"Bellek Adası",  color:"#F7D046", ids:["wm-same", "corsi", "zihni", "wm-seq", "span-touch", "market", "wm-where", "running", "lns-touch", "animal-fruit", "cups", "mental-math", "pos-nback", "count-span"] },
{ id:"resim",  name:"Resim Adası",   color:"#FFC9A3", ids:["rt-shapes", "vis-miss", "rt-position", "vis-chg", "rt-colors", "vis-recog", "vis-face", "scene-touch", "vis-draw", "memory-cards", "which-seen", "route-mem", "color-obj", "pic-order"] },
{ id:"soz",    name:"Söz Adası",     color:"#FF9EC4", ids:["hear-find", "pal-touch", "story-order", "dir-follow", "pic-seq-touch", "who-said", "rhythm", "tone-seq", "syl-blend", "sent-build", "new-word", "same-sound", "rhyme-touch", "syl-touch"] },
{ id:"kavram", name:"Kavram Adası",  color:"#8FD3FF", ids:["word-pic", "vanalogy-touch", "concept-touch", "absurd-touch", "proverb-touch", "infer-touch", "odd-cat", "sort-pic", "sim-touch", "opp-touch", "free-sort", "def-touch", "syn-touch", "use-touch", "seq-words", "part-whole", "wh-scene", "sent-pic", "listen-answer"] },
{ id:"bulmaca",name:"Bulmaca Adası", color:"#C9A7FF", ids:["block-design", "mental-rot", "clutter-find", "overlap-count", "embedded", "closure", "copy-design", "symmetry", "size-touch", "arrow-touch", "edge-touch", "spot-diff", "paper-fold", "view-from", "same-number"] },
{ id:"mantik", name:"Mantık Adası",  color:"#A8E6CF", ids:["matrix-fill", "balance", "odd-touch", "pattern-touch", "analogy-touch", "cause-effect", "sudoku", "num-pattern", "clue-find", "class-table"] },
{ id:"plan",   name:"Plan Adası",    color:"#FF8E7E", ids:["plan-swap", "plan-beads", "plan-tol", "plan-cubes", "maze", "time-est", "find-error", "pic-arrange", "zoo-map", "key-search", "water-jars", "design-fluency", "box-search", "three-tasks"], unlockStars:3 },
{ id:"macera", name:"Macera Adası",  color:"#FFD7A8", special:true, adv:true },
{ id:"usta",   name:"Usta Adası",    color:"#FFE27A", special:true, unlockStars:40, dyn:() => gxUstaStops() },
{ id:"gezgin", name:"Gezgin Adası",  color:"#9FE0D8", special:true, dyn:() => gxGezginStops() },
{ id:"mola",   name:"Mola Adası",    color:"#CFE8B8", special:true, mola:true },
{ id:"park",   name:"Oyun Parkı",    color:"#62C1FA", fromCategory:"oyun-parki", park:true }
];
