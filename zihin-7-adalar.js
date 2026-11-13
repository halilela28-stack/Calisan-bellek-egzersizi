/* Zihin Atölyesi — zihin-7-adalar.js (7/8): Zihin Adaları oyunları. Dosyalar zihin-atolyesi.html'de bu sırayla yüklenir; sıra değiştirilemez (önceki tek dosyanın ardışık parçalarıdır). */
const GAME_TIER_NAMES = ["Başlangıç","Orta","Zor"];
let gameMode = false;
let gameStop = null;
let gameIsland = null;

function gameStoreAll(){ try{ return JSON.parse(localStorage.getItem(GAME_KEY) || "{}"); }catch(e){ return {}; } }
function gameStoreSave(d){ try{ localStorage.setItem(GAME_KEY, JSON.stringify(d)); }catch(e){} }
function gameProfile(){ return (currentPlayerName || "").trim() || "Misafir"; }
/* KURAL (Zihin Adaları): her durak kendi kategorisinin kademesiyle gelir ve yıldızları o kademede tutulur; çocuk kademe etiketi görmez */
function gameLevelFor(exId){ try{ const c = CATEGORIES.find(c => c.exerciseIds.includes(exId)); if(c) return catLevelFor(c.id, gameProfile()); }catch(e){} return readingLevel || "post"; }
function gameRecord(exId){
const d = gameStoreAll(), p = gameProfile(), l = gameLevelFor(exId);
const r = ((d[p] || {})[l] || {})[exId];
return r || { stars:[false,false,false], best:[null,null,null], plays:0 };
}
function gameRecordSave(exId, r){
const d = gameStoreAll(), p = gameProfile(), l = gameLevelFor(exId);
d[p] = d[p] || {}; d[p][l] = d[p][l] || {}; d[p][l][exId] = r;
gameStoreSave(d);
}
function gameStars(exId){ return gameRecord(exId).stars.filter(Boolean).length; }
function gameNextTier(exId){
const r = gameRecord(exId);
{ const exU = exerciseById(exId); if(exU && exU.maxTier === 3 && r.stars.every(Boolean) && !r.crown) return 3; }
if(!r.plays && !r.stars.some(Boolean)){ const pt = placedTierFor(exId, gameProfile()); if(pt != null){ const ex0 = exerciseById(exId); return Math.max(pt, (ex0 && ex0.minTier) || 0); } }
const i = r.stars.findIndex(x => !x);
let t = i < 0 ? 2 : i;
const ex = exerciseById(exId);
if(r.jump === 2 && !r.stars[2]) return Math.max(2, (ex && ex.minTier) || 0);
if(t > 0 && r.fails && (r.fails[t] || 0) >= 2) t -= 1;
return Math.max(t, (ex && ex.minTier) || 0);
}
function gameIslandStops(isl){
let ids = isl.dyn ? isl.dyn() : (isl.ids || []);
if(isl.fromCategory){ const c = CATEGORIES.find(c => c.id === isl.fromCategory); ids = c ? c.exerciseIds.slice() : []; }
return ids.filter(id => { const ex = exerciseById(id); return ex && !ex.adultOnly && ex.readingLevel.includes(gameLevelFor(id)) && CATEGORIES.some(c => c.exerciseIds.includes(id)); });   /* durak kendi kategorisinin kademesine göre */
}
function gameIslandStarInfo(isl){
if(isl.legacy || isl.special) return { got:0, total:0 };
const st = gameIslandStops(isl);
return { got: st.reduce((a, id) => a + gameStars(id), 0), total: st.length * 3 };
}
function gameTotalStars(){ return GAME_ISLANDS.reduce((a, isl) => a + gameIslandStarInfo(isl).got, 0); }
const PROG_UNLOCK = { resim:4, soz:8, kavram:12, bulmaca:16, mantik:20, plan:24 };   // kademeli açılış (toplam yıldız)
function gameIslandNeed(isl){ return PROG_UNLOCK[isl.id] != null ? PROG_UNLOCK[isl.id] : (isl.unlockStars || 0); }
function gameIslandTouched(isl){ try{ return gameIslandStops(isl).some(id => { const r = gameRecord(id); return r.plays > 0 || r.stars.some(Boolean); }); }catch(e){ return false; } }
function gameIslandLocked(isl){ const need = gameIslandNeed(isl); if(!need) return false; if(!isl.special && gameIslandTouched(isl)) return false; return gameTotalStars() < need; }   // oynanmış ada bir daha kilitlenmez
const UNLOCK_SEEN_KEY = "wm_unlock_seen_v1";
function gxUnlockCheck(){ const k = gameProfile() + "|" + (readingLevel || "post"); let d = {}; try{ d = JSON.parse(localStorage.getItem(UNLOCK_SEEN_KEY) || "{}"); }catch(e){}
const open = GAME_ISLANDS.filter(i => gameIslandNeed(i) && !gameIslandLocked(i)).map(i => i.id);
const first = !d[k]; const fresh = first ? [] : open.filter(id => !d[k].includes(id)); d[k] = Array.from(new Set((d[k] || []).concat(open)));
try{ localStorage.setItem(UNLOCK_SEEN_KEY, JSON.stringify(d)); }catch(e){}
if(fresh.length){ const isl = GAME_ISLANDS.find(i => i.id === fresh[0]); setTimeout(() => { try{ gameSfx("solved"); }catch(e){} showLevelFlashGame(`🎉 Yeni ada keşfedildi: ${isl.name}!`); try{ speakText(`Yeni ada keşfedildi: ${isl.name}!`); }catch(e){} }, 600); } }
function gameChildLabel(ex){ const l = ex.label; const i = l.indexOf(": "); return i >= 0 ? l.slice(i + 2) : l; }

function hideGameScreens(){ ZA_LIFE.leave(); 
["islandScreen","islandStopsScreen","gameReward"].forEach(id => { const el = document.getElementById(id); if(el) el.style.display = "none"; });
}
function exitGameMode(){ ZA_LIFE.leave(); 
gameMode = false;
document.documentElement.classList.remove("game-mode");
try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
}
function renderGamePlayerSelect(){
const sel = document.getElementById("gamePlayerSelect");
if(!sel) return;
const names = (typeof playersList !== "undefined" ? playersList : []).filter(n => n !== "Misafir");
const cur = (currentPlayerName || "").trim();
if(cur && cur !== "Misafir" && !names.includes(cur)) names.push(cur);
const esc = (n) => String(n).replace(/"/g, "&quot;"), html = (n) => String(n).replace(/</g, "&lt;");
sel.innerHTML = `<option value="" disabled>Kişi seç…</option>` + names.map(n => `<option value="${esc(n)}">${html(n)}</option>`).join("") +
`<option value="Misafir">Misafir</option><option value="__new__">+ Yeni kişi ekle</option>`;
sel.value = cur || "";
sel.classList.toggle("unset", !cur);
}
function showIslandMap(){ ZA_LIFE.leave();  try{ const __n = gameProfile(); const __L = __n && __n !== "Misafir" ? getPlayerLevel(__n) : null; if(__L) readingLevel = __L; }catch(e){}   /* harita profilin seviyesiyle çizilir */
try{ lastSave("cocuk", gameProfile()); }catch(e){}
setTimeout(() => { try{ gxUnlockCheck(); }catch(e){} }, 300);
if(!window.__islSoft){ exitGameMode(); hideAllKidScreens(); hideGameScreens(); }
document.getElementById("mainApp").style.display = "none";
renderGamePlayerSelect();
const lvl = readingLevel === "pre" ? "Okul Öncesi" : "Okul Sonrası";
document.getElementById("islandSub").textContent = `${(currentPlayerName || "").trim() || "Kişi seçilmedi"} · ${lvl}`;
document.getElementById("islandTotal").textContent = gameTotalStars();
document.getElementById("islandScreen").style.display = "flex";
const map = document.getElementById("islandMap");
const H = 172, W = 100;
let herePos = null;
const hereIsl = GAME_ISLANDS.find(isl => !isl.legacy && !isl.special && !gameIslandLocked(isl) && gameIslandStops(isl).some(x => gameStars(x) < 3)); const islLag = islLagPlan();
const pts = [];
const html = GAME_ISLANDS.map((isl, i) => {
const left = i % 2 === 0 ? 2 : 50, top = 34 + i * H + (islLag && i > islLag.idx ? islLag.h : 0);
pts.push([left + 24, top + 66]); if(islLag && i === islLag.idx){ islLag.top = top + 250; pts.push([left + 24, top + 214]); islLag.pos.forEach(q => pts.push([q.cx, islLag.top + q.y + 46])); }
const info = gameIslandStarInfo(isl), locked = gameIslandLocked(isl);
const shown = Math.min(3, Math.round(info.total ? info.got / info.total * 3 : 0));
const stars = isl.legacy ? "" : isl.adv ? `<span class="ct">${(() => { const A = advState().adv; return A.lit ? "Macera tamam! 🎉" : `Bölüm ${A.ch + 1}/8`; })()}</span>` : isl.mola ? `<span class="ct">Dinlen, nefeslen</span>` : isl.special ? `<span class="ct">${(() => { const st = gameIslandStops(isl), d = gxWeekDone(isl.id); return `Bu hafta ${st.filter(x => d[x]).length}/${st.length}`; })()}</span>` : `<span class="st">${[0,1,2].map(k => GAME_STAR_SVG(k < shown)).join("")}</span><span class="ct">${info.got}/${info.total} yıldız</span>`;
const extra = isl.legacy ? `<span class="ct">3 oyun</span>` : "";
const lock = locked ? `<span class="lk">${GAME_LOCK_SVG}</span>` : "";
const here = hereIsl && hereIsl.id === isl.id ? `<span class="here">Buradasın</span>` : "";
const palms = isl.legacy ? PALM_SVG : (i % 2 ? PALM_SVG.replace('class="palm"', 'class="palm l"') : PALM_SVG);
if(here) herePos = { left, top, right: i % 2 === 0 };
const grow = isl.legacy || isl.special ? "" : (() => { const n = gxIslGrowth(isl.id); return n ? `<span class="isl-grow">${GROW_SVG.slice(0, n).join("")}</span>` : ""; })();
const art = gimg("isl_" + isl.id) || (isl.legacy ? null : gimg("isl_base"));   /* KURAL (görsellik): adalar kullanıcının ürettiği 3B ada görselleriyle; görsel yoksa eski renkli ada */
if(art) return `<button type="button" class="isl-island has-art${locked ? " locked" : ""}" data-isl="${isl.id}" style="left:${left}%;top:${top}px;">${lock}<img class="isl-art" src="${art}" alt=""><span class="isl-lbl" style="--ic:${isl.color}"><span class="nm">${isl.name}</span>${stars}${extra}</span>${here}${grow}</button>`;
return `<button type="button" class="isl-island${locked ? " locked" : ""}" data-isl="${isl.id}" style="left:${left}%;top:${top}px;background:${isl.color};">${palms}<span class="ico">${GAME_ISLAND_ICONS[isl.id] || ""}</span>${lock}<span class="nm">${isl.name}</span>${stars}${extra}${here}${grow}</button>`;
}).join("");
const mapW = map.clientWidth || 360, mapH = GAME_ISLANDS.length * H + 40 + (islLag ? islLag.h : 0);
const P = pts.map(p => [p[0] / 100 * mapW, p[1]]);
let pathD = "";
for(let i = 1; i < P.length; i++){
const [ax, ay] = P[i-1], [bx, by] = P[i];
const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
const steps = 28, amp = 9, waves = 1.5;
for(let k = (i === 1 ? 0 : 1); k <= steps; k++){
const t = k / steps, w = Math.sin(t * Math.PI * 2 * waves) * amp * Math.sin(t * Math.PI);
const x = ax + dx * t + nx * w, y = ay + dy * t + ny * w;
pathD += (pathD ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
}
}
map.style.height = mapH + "px";
const spIdx = GAME_ISLANDS.findIndex(x => x.special), spLabel = spIdx > 0 ? `<div class="isl-section" style="top:${34 + spIdx * H - 34 + (islLag && spIdx > islLag.idx ? islLag.h : 0)}px">Özel Adalar</div>` : "";   /* KURAL: harita üstündeki her konumlu öğe (bölüm başlıkları dahil) açık lagün kadar aşağı kayar */
map.innerHTML = `<svg class="isl-path" viewBox="0 0 ${mapW} ${mapH}" preserveAspectRatio="none" aria-hidden="true">` +
`<path d="${pathD}" fill="none" stroke="rgba(8,70,120,.25)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" transform="translate(0,3)"/>` +
`<path d="${pathD}" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="1 13" stroke-linecap="round" stroke-linejoin="round"/></svg>` + spLabel + html + (islLag ? islLagHTML(islLag) : "") +
(herePos ? `<div class="isl-mascot" style="${herePos.right ? `left:min(calc(${herePos.left + 48}% + 4px), calc(100% - 74px))` : `left:max(calc(${herePos.left}% - 70px), 0px)`};top:${herePos.top + 30}px;">${zihniSVG("happy")}</div>` : "");
let next = null;
for(const isl of GAME_ISLANDS){
if(isl.legacy || isl.special || gameIslandLocked(isl)) continue;
const id = gameIslandStops(isl).find(x => gameStars(x) < 3);
if(id){ next = { isl, id }; break; }
}
const nx = document.getElementById("islandNext");
nx.innerHTML = next
? `<div class="tx"><div class="t1">Sıradaki durak</div><div class="t2">${next.isl.name} · ${gameChildLabel(exerciseById(next.id))}</div></div><button type="button" class="isl-play" data-play="${next.id}" data-isl="${next.isl.id}">Oyna</button>`
: `<div class="tx"><div class="t1">Tüm yıldızları topladın!</div><div class="t2">İstediğin durağı yeniden oynayabilirsin.</div></div>`;
try{ gxRenderMapExtras(); if(gxRouteNext() && (currentPlayerName || "").trim()) nx.style.display = "none"; else nx.style.display = ""; }catch(e){ console.error(e); } try{ islRenderV2(); }catch(e){ console.error(e); }
document.getElementById("islandScreen").style.display = "flex";
if(!window.__islSoft) document.getElementById("islandScreen").scrollTop = 0;
try{ scheduleTour("islands", "islandScreen"); }catch(e){}
}

/* KURAL (Zihin Adaları ana ekranı, 2026-11-02 tasarımı): harita ve ada içi tek ekranda. Üstte tek çubuk — kişi (gün halkalı avatar), yıldız · ışık · gün · kalan dk kutuları ve Bugünün Rotası şeridi; altta sekmeler (Harita, Rota, Dolap, Çıkış). Normal bir adaya dokununca ada yerinde açılır: altında lagün ve adanın etkinlikleri küçük adacıklar olarak aynı noktalı yolda sıralanır (yıldız halkası, ✓, sıradaki oynat); sonraki adalar aşağı kayar; aynı anda tek ada açık; açıkken altta derin mavi "Sıradaki" düğmesi. Kilitli ve özel adalar eski davranışla açılır. */
window.islOpenId = window.islOpenId || null;
function islLagPlan(){ const id = window.islOpenId; if(!id) return null; const idx = GAME_ISLANDS.findIndex(x => x.id === id); const isl = GAME_ISLANDS[idx]; if(!isl || isl.legacy || isl.special || isl.mola || isl.adv || gameIslandLocked(isl)) { window.islOpenId = null; return null; } const stops = gameIslandStops(isl); if(!stops.length) return null; const STEP = 92; const pos = stops.map((sid, k) => ({ id: sid, cx: k % 2 === 0 ? 66 : 34, y: 14 + k * STEP })); return { idx, isl, stops, pos, h: 70 + stops.length * STEP + 30, top: 0 }; }
function islLagHTML(L){ const cur = L.stops.find(x => gameStars(x) < 3) || null; const segs = (n) => ["M30 6 A24 24 0 0 1 50.8 42", "M48 47 A24 24 0 0 1 12 47", "M9.2 42 A24 24 0 0 1 30 6"].map((d, k) => `<path d="${d}" fill="none" stroke="${k < n ? "#FFC23A" : "rgba(255,255,255,.65)"}" stroke-width="6" stroke-linecap="round"/>`).join(""); const base = gimg("isl_base");
  const items = L.pos.map((q, k) => { const ex = exerciseById(q.id), st = gameStars(q.id), isCur = q.id === cur, done = st >= 3; const coinCls = isCur ? "cur" : done ? "done" : st > 0 ? "part" : "new"; const inner = isCur ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>' : done ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' : `<b>${k + 1}</b>`;
    return `<button type="button" class="isl-islet${isCur ? " cur" : ""}" data-play="${q.id}" data-isl="${L.isl.id}" style="left:calc(${q.cx}% - 62px);top:${L.top + q.y}px" aria-label="${escHTML(islName(ex))}, ${st} yıldız">${isCur ? '<span class="il-tag">Sıradaki</span>' : ""}<span class="il-pic">${base ? `<img src="${base}" alt="">` : '<span class="il-sand"></span>'}<span class="il-ring"><svg viewBox="0 0 60 60" aria-hidden="true">${segs(st)}</svg><span class="il-coin ${coinCls}">${inner}</span></span></span><span class="il-nm">${escHTML(islName(ex))}</span></button>`; }).join("");
  const info = gameIslandStarInfo(L.isl);
  const ci = L.pos.find(q => q.id === cur); const zh = ci ? `<div class="isl-lag-zihni" style="left:calc(${ci.cx < 50 ? ci.cx + 22 : ci.cx - 44}% - 30px);top:${L.top + ci.y + 6}px">${zihniSVG("wave")}</div>` : ""; return zh + `<div class="isl-lagoon" style="top:${L.top - 26}px;height:${L.h - 20}px"></div><div class="isl-lag-tag" style="top:${L.top - 18}px">${escHTML(L.isl.name)} · ${L.stops.length} etkinlik · ${info.got}/${info.total} ★</div>${items}`; }
function islScroller(){ const sc = document.getElementById("islandScreen"); const oy = getComputedStyle(sc).overflowY; return (oy === "auto" || oy === "scroll") && sc.scrollHeight > sc.clientHeight + 2 ? sc : (document.scrollingElement || document.documentElement); }
/* KURAL (Zihin Adaları geçişi): ada açılıp kapanırken ekran gizlenip yeniden açılmaz, sayfa başa sıçramaz; dokunulan ada ekranda yerinde kalır, ardından üst çubuğun hemen altına yumuşakça kayar; adacıklar yavaşça belirir */
function islScrollFix(scr, fn){ /* iOS: süren kaydırma programla verilen konumu yok sayar; kaydırmayı bir an kapatıp konumu öyle verir */ const prev = scr.style.overflowY; scr.style.overflowY = "hidden"; try{ fn(); }catch(e){} void scr.offsetHeight; scr.style.overflowY = prev; }
function islToggle(id){ const isl = GAME_ISLANDS.find(x => x.id === id); if(!isl) return; if(isl.legacy || isl.special || isl.mola || isl.adv || gameIslandLocked(isl)) return showIslandStops(id); const opening = window.islOpenId !== id; window.islOpenId = opening ? id : null; const q = () => document.querySelector(`#islandMap .isl-island[data-isl="${id}"]`); const b0 = q(), y0 = b0 ? b0.getBoundingClientRect().top : 0, scr = islScroller();
  window.__islSoft = true; try{ showIslandMap(); } finally { window.__islSoft = false; }
  const th = () => ((document.getElementById("islTop") || {}).offsetHeight || 0) + 8;
  if(opening){ /* KURAL: açılan adanın kendisi ve ilk adacığı her zaman üst çubuğun hemen altına gelir (önceki ada kapanınca sayfa ortasında kalınmaz) */ const go = () => { const b = q(); if(!b) return; const d = b.getBoundingClientRect().top - th(); if(Math.abs(d) > 3) islScrollFix(scr, () => { scr.scrollTop += d; }); }; go(); requestAnimationFrame(go); setTimeout(go, 80); setTimeout(go, 320); }
  else { const b1 = q(); if(b1){ const d = b1.getBoundingClientRect().top - y0; islScrollFix(scr, () => { scr.scrollTop += d; }); } } }
function islName(ex){ if(!ex) return ""; let l = String(ex.label || "").replace(/\s*\((dokunmalı|dokunarak)\)\s*$/i, ""); const i = l.indexOf(": "); if(i >= 0){ const a = l.slice(0, i), b = l.slice(i + 2); l = (b.length <= 7 || /^(dokun|dokunarak|seç|bul)$/i.test(b)) ? a : b; } return l; }   /* KURAL: adacık adı ayırt edici kalır ("Sıcak–Soğuk: Dokun" → "Sıcak–Soğuk", "Simge Arama: Harf Arama" → "Harf Arama") */
function islTab(t){ if(t === "harita"){ window.islOpenId = null; showIslandMap(); return; } if(t === "rota"){ const n = gxRouteNext(); if(n){ sfx("go"); window.gxReturnTo = "map"; startGameStop(n.id, n.isl); } else { const r = document.getElementById("islTop"); if(r) r.scrollIntoView({ behavior: "smooth" }); showLevelFlashGame("Bugünün rotası tamam!"); } return; } if(t === "dolap"){ sfx("pop"); gxOpenCloset(); return; } if(t === "cikis"){ const b = document.getElementById("islandBackBtn"); if(b) b.click(); } }
function islRenderV2(){ const sc = document.getElementById("islandScreen"); if(!sc) return; sc.classList.add("isl-v2"); const wrap = sc.querySelector(".isl-wrap"); let top = document.getElementById("islTop"); if(!top){ top = document.createElement("div"); top.id = "islTop"; sc.insertBefore(top, sc.firstChild); } const csS = getComputedStyle(sc), pl = parseFloat(csS.paddingLeft) || 0, pr = parseFloat(csS.paddingRight) || 0, pt = parseFloat(csS.paddingTop) || 0, pb = parseFloat(csS.paddingBottom) || 0; top.style.margin = `${-pt}px ${-pr}px 12px ${-pl}px`; top.style.top = `${-pt}px`;   /* yapışkan çubuk ekranın dolgusunu da örter: tam üstte ve tam genişlikte */ sc.style.setProperty("--islTopH", top.offsetHeight + "px"); if(!sc.__islMini){ sc.__islMini = true; const tgt = islScroller() === sc ? sc : window; const onS = () => { const y = islScroller().scrollTop; const t = document.getElementById("islTop"); if(t) t.classList.toggle("mini", y > 70); }; tgt.addEventListener("scroll", onS, { passive: true }); }   /* KURAL: harita kaydırılınca üst çubuktaki sayaç satırı gizlenir, yalnız rota şeridi kalır; en üste dönünce geri gelir */ try{ const mp = document.getElementById("islandMap"); if(mp) mp.classList.toggle("lag-open", !!window.islOpenId); }catch(e){}
  const nm = (currentPlayerName || "").trim(), lvl = readingLevel === "pre" ? "Okul Öncesi" : "Okul Sonrası", g = gxGet(), days = gxWeekDays(g), dn = Math.min(days.length, WEEK_GOAL), L = gxLimitMin(), leftMin = L ? Math.max(0, Math.ceil((gxAllowedSec() - gxUsedSec()) / 60)) : null;
  const av = nm ? (() => { try{ return avatarHTML(nm, 38); }catch(e){ return `<span class="it-av">${escHTML(nm[0])}</span>`; } })() : `<span class="it-av none">?</span>`;
  const r = nm ? gxRoute() : null, nx = nm ? gxRouteNext() : null, all = r && r.done.every(Boolean);
  const routeBtn = !nm ? "" : `<button type="button" class="it-route${all ? " ok" : ""}" ${nx ? `data-play="${nx.id}" data-isl="${nx.isl}"` : 'data-isltab="harita"'}><span class="it-rt"><span class="it-rt1"><span>BUGÜNÜN ROTASI · ${r.done.filter(Boolean).length}/${r.steps.length}</span><span class="it-steps">${r.steps.map((st, i) => `<i class="${r.done[i] ? "d" : nx && nx.id === st.id ? "n" : ""}">${i + 1}</i>`).join("")}</span></span><span class="it-rt2">${all ? "Rota tamam!" : escHTML((nx && nx.role ? nx.role + ": " : "") + (nx ? gameChildLabel(exerciseById(nx.id)) : ""))}</span></span><span class="it-play">${all ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' : '<svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M8 5v14l11-7z"/></svg>'}</span></button>`;
  top.innerHTML = `<div class="it-row"><button type="button" class="it-who" id="islWhoBtn" aria-label="Kim oynuyor: ${escHTML(nm || "seç")}"><span class="it-ring" style="--p:${Math.round(dn / WEEK_GOAL * 100)}%">${av}</span><span class="it-nm"><b>${escHTML(nm || "Kim oynuyor?")}</b><small>${lvl} ▾</small></span></button><div class="it-stats"><span class="it-st y">${GAME_STAR_SVG(true)}<b>${gameTotalStars()}</b><small>yıldız</small></span><span class="it-st p">${I_SPARK}<b>${g.light}</b><small>ışık</small></span><span class="it-st o"><svg viewBox="0 0 24 24" fill="none" stroke="#FF9F2E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c1 4 6 5 6 11a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3-1-5 1-8z"/></svg><b>${dn}/${WEEK_GOAL}</b><small>gün</small></span>${leftMin !== null ? `<span class="it-st b"><svg viewBox="0 0 24 24" fill="none" stroke="#3D9BF0" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg><b>${leftMin}</b><small>dk</small></span>` : ""}</div></div>${routeBtn}`;
  document.getElementById("islWhoBtn").onclick = (e) => { e.stopPropagation(); try{ openGameWho(true); }catch(err){ const s2 = document.getElementById("gamePlayerSelect"); if(s2) s2.focus(); } };
  /* açık adanın sıradaki düğmesi */
  let dock = document.getElementById("islDock"); if(!dock){ dock = document.createElement("div"); dock.id = "islDock"; sc.appendChild(dock); } dock.style.margin = `auto ${-pr}px ${-pb}px ${-pl}px`; dock.style.bottom = `${-pb}px`; let nb = document.getElementById("islOpenNext"); if(!nb){ nb = document.createElement("div"); nb.id = "islOpenNext"; dock.appendChild(nb); }
  const oi = window.islOpenId ? GAME_ISLANDS.find(x => x.id === window.islOpenId) : null, oc = oi ? gameIslandStops(oi).find(x => gameStars(x) < 3) : null, ost = oi ? gameIslandStops(oi) : [];
  nb.innerHTML = oi && oc ? `<button type="button" class="isl-nextbtn" data-play="${oc}" data-isl="${oi.id}"><span class="nb-coin"><svg viewBox="0 0 24 24" width="22" height="22" fill="#2E86DA"><path d="M8 5v14l11-7z"/></svg></span><span class="nb-tx"><span class="nb1">${escHTML(oi.name.toLocaleUpperCase("tr"))} · SIRADAKİ ${ost.indexOf(oc) + 1}/${ost.length}</span><span class="nb2">${escHTML(islName(exerciseById(oc)))}</span></span></button>` : "";
  nb.style.display = oi && oc ? "" : "none"; if(oi && !window.__islSoft){ const scr2 = islScroller(); const show = () => { const t = document.querySelector(".isl-islet.cur") || document.querySelector(`#islandMap .isl-island[data-isl="${oi.id}"]`); if(!t) return; const d = t.getBoundingClientRect().top - (top.offsetHeight + 60); if(Math.abs(d) > 3) islScrollFix(scr2, () => { scr2.scrollTop += d; }); }; requestAnimationFrame(show); setTimeout(show, 200); }   /* KURAL: oyundan haritaya dönünce açık adada kalınır ve sıradaki adacık görünür */
  /* alt sekmeler */
  let tb = document.getElementById("islTabs"); if(!tb){ tb = document.createElement("nav"); tb.id = "islTabs"; tb.setAttribute("aria-label", "Zihin Adaları"); dock.appendChild(tb); }
  const T = [["harita", "Harita", "#14A39A", '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>'], ["rota", "Rota", "#8B6CF6", '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>'], ["dolap", "Dolap", "#FF9F2E", '<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M3 13h18M5 9a7 5 0 0 1 14 0M12 12v3"/>'], ["cikis", "Çıkış", "#3D9BF0", '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>']];
  /* KURAL (ada alt çubuğu, 2026-11-06): Zihin Adaları'nın alt düğmeleri Aile/Uzman sayfasının alt çubuğuyla aynı tasarımdadır — bitişik dört renkli düğme, beyaz simge ve yazı, uçları yuvarlak, alt gölgeli; bulunulan sekme beyaz alt çizgiyle belirtilir */
    const DARK = { harita:["#14A39A","#0A6E68"], rota:["#7D5CF0","#5537C4"], dolap:["#E8861C","#A95A06"], cikis:["#3D8FE0","#1F63AE"] };
    tb.classList.add("cd-like"); tb.innerHTML = T.map(([k, t, c, d]) => `<button type="button" data-isltab="${k}" class="cd-b${k === "harita" ? " on" : ""}" style="--c:${DARK[k] ? DARK[k][0] : c};--d:${DARK[k] ? DARK[k][1] : c};--tc:${c}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg><span>${t}</span></button>`).join("");
  /* adaların etiketlerine Aç / Kapat */
  document.querySelectorAll("#islandMap .isl-island").forEach(b => { const isl = GAME_ISLANDS.find(x => x.id === b.dataset.isl); if(!isl || isl.legacy || isl.special || isl.mola || isl.adv || b.classList.contains("locked")) return; const lbl = b.querySelector(".isl-lbl") || b; const op = window.islOpenId === isl.id; if(op) b.classList.add("open"); lbl.insertAdjacentHTML("beforeend", `<span class="isl-oc" aria-hidden="true">${op ? "Kapat ▴" : "Aç ▾"}</span>`); b.setAttribute("aria-expanded", op ? "true" : "false"); });
}

function showIslandStops(islId){
const isl = GAME_ISLANDS.find(x => x.id === islId);
if(!isl) return;
if(isl.legacy){ if(gxOver()){ gxShowSleep(); return; } hideGameScreens(); showChildModeScreen(); return; }
if(gameIslandLocked(isl)){ showLevelFlashGame(`${isl.name} ${gameIslandNeed(isl)} yıldızla açılır. Şu an ${gameTotalStars()} yıldızın var.`); return; }
if(isl.mola){ showMola(); return; }
if(isl.adv){ showAdventure(); return; }
gameIsland = islId;
exitGameMode();
hideGameScreens();
document.getElementById("mainApp").style.display = "none";
document.getElementById("islandStopsTitle").textContent = isl.name;
const info = gameIslandStarInfo(isl);
document.getElementById("islandStopsSub").textContent = `${info.got}/${info.total} yıldız`;
document.getElementById("islandStops").innerHTML = gameIslandStops(isl).map((id, k) => {
const ex = exerciseById(id), r = gameRecord(id), t = gameNextTier(id);
const done = r.stars.every(Boolean);
return `<div class="isl-stop${done ? " complete" : ""}"><span class="num" style="background:${isl.color.replace(/^#/, "#")};color:#1C2B39;">${k + 1}</span><div class="tx"><div class="t1">${gameChildLabel(ex)}</div>
<div class="t2">${done ? "Tüm yıldızlar tamam · yeniden oynayabilirsin" : "Sıradaki: " + GAME_TIER_NAMES[t]}</div>${devIslandMark(id)}
<div class="st">${r.stars.map(GAME_STAR_SVG).join("")}${r.crown ? `<span class="st-bolt" title="Usta tacı">👑</span>` : ""}${(r.bolt || []).filter(Boolean).length ? `<span class="st-bolt" title="Şimşek rozeti">⚡${(r.bolt || []).filter(Boolean).length}</span>` : ""}</div></div>
<div style="display:flex;align-items:center"><button type="button" class="isl-play" data-play="${id}" data-isl="${islId}">Oyna</button>${COOP_IDS.includes(id) ? `<button type="button" class="isl-play coop" data-coop="${id}" data-isl="${islId}" title="Birlikte oyna">👥</button>` : ""}</div></div>`;
}).join("");
document.getElementById("islandStopsScreen").style.display = "flex";
document.getElementById("islandStopsScreen").scrollTop = 0;
}
function showLevelFlashGame(msg){
let el = document.getElementById("gameToast");
if(!el){ el = document.createElement("div"); el.id = "gameToast"; el.style.cssText = "position:fixed;left:50%;bottom:32px;transform:translateX(-50%);z-index:230;background:#1F2A33;color:#fff;padding:12px 18px;border-radius:14px;font-weight:800;font-size:15px;max-width:90%;text-align:center"; document.body.appendChild(el); }
el.textContent = msg; el.style.display = "block";
clearTimeout(el._t); el._t = setTimeout(() => { el.style.display = "none"; }, 2200);
}

function sfxTone(ctx, freq, t0, dur, type, vol, glideTo){
const o = ctx.createOscillator(), g = ctx.createGain();
o.type = type || "triangle";
o.frequency.setValueAtTime(freq, t0);
if(glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
g.gain.setValueAtTime(0.0001, t0);
g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
o.connect(g); g.connect(sfxBus(ctx));
o.start(t0); o.stop(t0 + dur + 0.02);
}
function sfx(kind){
if(typeof soundEnabled !== "undefined" && !soundEnabled) return;
const ctx = getAudioCtx(); if(!ctx) return;
if(ctx.state === "suspended") ctx.resume().catch(()=>{});
const t = ctx.currentTime + 0.005;
const N = { C5:523.25, D5:587.33, E5:659.25, G5:783.99, A5:880, C6:1046.5, E6:1318.5, G6:1568, C7:2093 };
try{
switch(kind){
case "tap":     sfxTone(ctx, 1150, t, 0.035, "sine", 0.07, 820); break; /* düğme dokunuşu: kısa, yumuşak tık */
case "pop":     sfxTone(ctx, 520, t, 0.08, "sine", 0.18, 880); break;
case "drop":    sfxTone(ctx, 700, t, 0.07, "sine", 0.16, 420); break;
case "correct": sfxTone(ctx, N.E5, t, 0.10, "triangle", 0.20); sfxTone(ctx, N.A5, t + 0.07, 0.16, "triangle", 0.20); break;
case "wrong":   sfxTone(ctx, 300, t, 0.16, "triangle", 0.20, 190); sfxTone(ctx, 220, t + 0.06, 0.16, "sine", 0.10, 150); break;
case "solved":  [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => sfxTone(ctx, f, t + i * 0.07, 0.18, "triangle", 0.18)); break;
case "star":    [N.C6, N.E6, N.G6, N.C7].forEach((f, i) => sfxTone(ctx, f, t + i * 0.05, 0.22, "sine", 0.14)); break;
case "fanfare": [N.G5, N.C6, N.E6].forEach((f, i) => sfxTone(ctx, f, t + i * 0.11, 0.2, "triangle", 0.2));
[N.C6, N.E6, N.G6].forEach(f => sfxTone(ctx, f, t + 0.36, 0.55, "triangle", 0.12)); break;
case "soft":    [N.G5, N.E5, N.D5].forEach((f, i) => sfxTone(ctx, f, t + i * 0.1, 0.2, "sine", 0.14)); break;   // "bir daha dene"
case "go":      sfxTone(ctx, N.C5, t, 0.1, "triangle", 0.18); sfxTone(ctx, N.G5, t + 0.1, 0.18, "triangle", 0.2); break;
}
}catch(e){}
}
/* KURAL (düğme sesi, 2026-11-09): Ayarlar'da ses efektleri açıkken düğmelere basınca kısa, yumuşak bir tık sesi çıkar (parmak kalkınca). Tahtanın içindeki dokunuşlar kendi doğru/yanlış sesini kullandığı için bu sesi çalmaz; devre dışı düğmeler ses çıkarmaz. iPhone'da telefon sessiz moddayken uygulama sesleri çalmaz (ses oturumu "ambient") */
try{ if(navigator.audioSession) navigator.audioSession.type = "ambient"; }catch(e){}
const ZA_TAP_SFX_SEL = 'button, [role="button"], .category-card, .dev-head, .fam-go, .exh-it, .mode-card, .cd-b, a.btn, label.switch';
let __zaTapSfxAt = 0;
document.addEventListener("pointerup", (ev) => { try{ if(ev.pointerType === "mouse" && ev.button !== 0) return; if(!soundEnabled) return; const el = ev.target && ev.target.closest ? ev.target.closest(ZA_TAP_SFX_SEL) : null; if(!el || el.disabled || el.getAttribute("aria-disabled") === "true") return; const bd = document.getElementById("board"); if(bd && bd.contains(el)) return; if(el.closest("#tourOverlay") && !el.closest("button")) return; const now = Date.now(); if(now - __zaTapSfxAt < 60) return; __zaTapSfxAt = now; sfx("tap"); }catch(e){} }, { capture: true, passive: true });
function gameSfx(kind){ if(typeof gameMode !== "undefined" && gameMode){ sfx(kind); if(kind === "wrong") zihniAgain(); } }
/* KURAL: oyun modunda yanlış cevaptan sonra köşede 1,1 sn "Olsun, bir daha!" diyen Zihni çıkar (en çok 3 sn'de bir; dokunmayı engellemez; Sade görünümde ve hareketi azalt ayarında yalnız belirip kaybolur) */
let _zAgainT = 0; function zihniAgain(){ try{ const now = Date.now(); if(now - _zAgainT < 3000) return; _zAgainT = now; let el = document.getElementById("zAgain"); if(!el){ el = document.createElement("div"); el.id = "zAgain"; el.setAttribute("aria-hidden", "true"); document.body.appendChild(el); } el.innerHTML = `<span class="za-z">${zihniSVG("again")}</span><span class="za-t">Olsun, bir daha!</span>`; el.classList.remove("on"); void el.offsetWidth; el.classList.add("on"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("on"), 1100); }catch(e){} }
const SPEECH_MUTE_KEY = "wm_speech_mute_v1";
try{ if(!localStorage.getItem("wm_speech_mute_migr_v1")){ localStorage.removeItem(SPEECH_MUTE_KEY); localStorage.setItem("wm_speech_mute_migr_v1", "1"); } }catch(e){} /* hoparlör artık "dinle/durdur": eski "sesi kapat" durumu içerik seslerini sessizce kapatmasın diye bir kez temizlenir */
function speechMuted(){ try{ return localStorage.getItem(SPEECH_MUTE_KEY) === "1"; }catch(e){ return false; } }
const SPK_ON  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
const SPK_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5"/></svg>';
function renderSpeakBtn(){
const b = document.getElementById("gameSpeakBtn"); if(!b) return;
const m = speechMuted();
b.innerHTML = m ? SPK_OFF : SPK_ON;
b.setAttribute("aria-label", m ? "Konuşmayı aç" : "Konuşmayı kapat");
b.setAttribute("aria-pressed", m ? "true" : "false");
b.classList.toggle("muted", m);
}
function toggleSpeechMute(){
const m = !speechMuted();
try{ localStorage.setItem(SPEECH_MUTE_KEY, m ? "1" : "0"); }catch(e){}
renderSpeakBtn();
if(m){ try{ speechSynthesis.cancel(); }catch(e){} }
else speakText(childInstructionText());
}

let _trVoice = null;
/* KURAL (okuma sesi): uygulama cihazdaki en doğal Türkçe sesi kendiliğinden seçer; Ayarlar > Okuma sesi'nden ses ve hız elle seçilebilir, seçim saklanır; seçilen ses cihazda yoksa en iyisine döner */
const VOICE_KEY = "wm_voice_v1";
const VOICE_SAMPLES = ["Ekranda şekiller var. Soldan sağa, satır satır her şeklin adını hızlıca söyle.", "Merhaba, ben Zihni! Bugün birlikte oynayalım mı?", "Zihni, ekmek, kırmızı, toprak, çiçek, kalem.", "Sana bir durum anlatacağım. Sen böyle bir durumda ne yaparsın? Anlat.", "Harika! Yeni bir yıldız kazandın!"];
/* KURAL: iPhone/iPad'de standart okuma ayarı (kullanıcının seçtiği): hız %120, ton %120, cümle arası duraklama açık; kullanıcı kendi ayarını yaparsa onunki geçerli, "sıfırla" bu standarda döner. Diğer cihazlarda hız %100, ton %100 */
function isAppleTouch(){ try{ return /iPad|iPhone|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && "ontouchend" in document); }catch(e){ return false; } }
function voiceDefaults(){ return isAppleTouch() ? { rateV: 1.20, pitchV: 1.20, pause: true, rate: "hizli" } : {}; }
function voicePrefStored(){ try{ return JSON.parse(localStorage.getItem(VOICE_KEY) || "{}") || {}; }catch(e){ return {}; } }
function voicePref(){ return Object.assign({}, voiceDefaults(), voicePrefStored()); }
function voiceRateMul(){ const p = voicePref(); if(typeof p.rateV === "number") return p.rateV; const r = p.rate; return r === "yavas" ? 0.86 : r === "hizli" ? 1.14 : 1; }
function voicePitch(base){ const p = voicePref(); return Math.max(0.5, Math.min(2, (base || 1) * (typeof p.pitchV === "number" ? p.pitchV : 1))); }
/* KURAL (okuma sesi ince ayarı): okumadan önce metin hazırlanır — kullanıcının okunuş düzeltmeleri uygulanır, tırnak/simgeler okunmaz, "…" ve "·" kısa duraklamaya döner; "cümle arası duraklama" açıksa her cümle ayrı okunur */
const TTS_BASE_FIX = [];
/* İsteğe bağlı: iki ünsüzün yan yana geldiği hece sınırına (Zih|ni, ek|mek) küçük bir ayırıcı konur; tek ünsüzlü geçişlere (me|ra|ba) dokunulmaz */
function ttsSyllableSoften(x, sep){ const V = "aeıioöuüâîûAEIİOÖUÜÂÎÛ"; return x.replace(/[A-Za-zÇĞİÖŞÜçğıöşüÂÎÛâîû]{4,}/g, w => { const isV = (ch) => V.indexOf(ch) >= 0; const vi = []; for(let i = 0; i < w.length; i++) if(isV(w[i])) vi.push(i); if(vi.length < 2) return w; const cut = []; for(let k = 0; k + 1 < vi.length; k++){ const gap = vi[k + 1] - vi[k] - 1; if(gap >= 2) cut.push(vi[k + 1] - 1); } if(!cut.length) return w; let out = ""; for(let i = 0; i < w.length; i++){ if(cut.includes(i)) out += sep; out += w[i]; } return out; }); }
function ttsPrep(t){ let x = String(t || ""); try{ const fx = (voicePref().fixes || []).concat(TTS_BASE_FIX); fx.forEach(f => { if(!f || !f.a) return; const esc = f.a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); const re = new RegExp("(^|[^\\p{L}])(" + esc + ")(?=$|[^\\p{L}])", "giu"); x = x.replace(re, (m, pre) => pre + (f.b || "")); }); }catch(e){}
  x = x.replace(/[“”"«»„]/g, "").replace(/…/g, ". ").replace(/\s·\s/g, ", ").replace(/\s+/g, " ").trim();
  if(voicePref().syl) x = ttsSyllableSoften(x, voicePref().sylSep === "space" ? " " : "-");
  if(!voicePref().pause) return [x];
  const parts = x.replace(/([.!?])\s+/g, "$1\n").split("\n").map(y => y.trim()).filter(Boolean); return parts.length ? parts : [x]; }   /* geriye bakan regex kullanılmaz (eski iPhone'larda betiği çökertir) */
function trVoices(){ try{ return speechSynthesis.getVoices().filter(v => /^tr/i.test(v.lang)); }catch(e){ return []; } }
function voiceScore(v){ return (/(premium|enhanced|neural|natural|gelişmiş|geliştirilmiş|yüksek|improved|superior)/i.test(v.name) ? 10 : 0) + (/samsung/i.test(v.name) ? 6 : 0) + (/google/i.test(v.name) ? 4 : 0) + (/yelda|emel|filiz|seda|ahmet/i.test(v.name) ? 3 : 0) + (/compact|kompakt/i.test(v.name) ? -3 : 0) + (v.localService ? 1 : 0); }
function pickTurkishVoice(){ try{ const vs = trVoices(); if(!vs.length) return null; const want = voicePref().name; if(want){ const f = vs.find(v => v.name === want); if(f) return f; } return vs.slice().sort((a, b) => voiceScore(b) - voiceScore(a))[0]; }catch(e){ return null; } }
function voiceLabel(v){ const q = voiceScore(v) >= 10 ? "doğal" : voiceScore(v) >= 4 ? "iyi" : "standart"; return `${v.name} · ${q}`; }
function renderVoiceSettings(){ try{ let g = document.getElementById("voiceGroup"); if(!g){ const lab = [...document.querySelectorAll("#settingsScreen .settings-label")].find(x => /^Altyazı/.test(x.textContent.trim())); const host = lab ? lab.closest(".settings-group") : null; if(!host) return; g = document.createElement("div"); g.className = "settings-group"; g.id = "voiceGroup"; g.style.display = "block"; g.style.minWidth = "0"; g.style.overflow = "hidden"; host.parentNode.insertBefore(g, host.nextSibling); }
  const vs = trVoices(), cur = pickTurkishVoice(), pref = voicePref(), r = pref.rate || "normal", ios = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) && "ontouchend" in document;
  const help = ios ? "Daha doğal ses için: iPhone Ayarlar → Erişilebilirlik → Seslendirme İçeriği → Sesler → Türkçe → <b>Yelda (Gelişmiş)</b> sesini indirin, sonra burada seçin." : "Daha doğal ses için: telefon Ayarlar → Genel yönetim → <b>Metin okuma</b> (Metin okuma çıkışı) → tercih edilen motor <b>Samsung</b> ya da <b>Google</b> → Türkçe ses verisini indirin, sonra burada seçin.";
  g.innerHTML = `<div class="settings-label">Okuma sesi<br><span style="font-size:12px;font-weight:600;color:var(--ink-soft)">Yönergeleri ve soruları okuyan ses. Uygulama cihazdaki en doğal Türkçe sesi kendisi seçer; isterseniz değiştirin.</span></div>
    ${vs.length ? `<div style="display:flex;gap:8px;margin-top:10px;align-items:center"><select id="voiceSel" style="flex:1;min-width:0;padding:10px 8px;border-radius:12px;border:1.5px solid var(--line,#DDE6EE);font:inherit;font-size:16px;font-weight:700;background:#fff;text-overflow:ellipsis">${vs.map(v => `<option value="${escHTML(v.name)}"${cur && v.name === cur.name ? " selected" : ""}>${escHTML(voiceLabel(v))}</option>`).join("")}</select><button type="button" id="voiceTry" style="flex:0 0 auto;padding:10px 16px;border-radius:12px;font:inherit;font-weight:800;border:1.5px solid var(--teal,#0F8B85);background:#fff;color:var(--teal-dark,#0B5F5A)">Dinle</button></div>` : `<div style="margin-top:8px;font-weight:700;color:#B4532A">Bu cihazda Türkçe ses bulunamadı; yönergeler altyazıyla gösterilir.</div>`}
    <div style="display:flex;gap:6px;margin-top:10px">${[["yavas","Yavaş"],["normal","Normal"],["hizli","Hızlı"]].map(([k, t]) => `<button type="button" data-vrate="${k}" style="flex:1;padding:10px 6px;border-radius:12px;font:inherit;font-weight:800;border:1.5px solid ${r === k ? "var(--teal,#0F8B85)" : "var(--line,#DDE6EE)"};background:${r === k ? "var(--teal,#0F8B85)" : "#fff"};color:${r === k ? "#fff" : "var(--ink,#1C2B39)"}">${t}</button>`).join("")}</div>
    <div style="font-size:12px;font-weight:600;color:var(--ink-soft);margin-top:10px;line-height:1.45">${help}</div>
    <details id="voiceFine" style="margin-top:12px;min-width:0;max-width:100%;overflow:hidden"${window.__vfOpen ? " open" : ""}><summary style="font-weight:800;cursor:pointer">İnce ayar</summary>
      <div style="margin-top:10px;display:grid;grid-template-columns:minmax(0,1fr);gap:12px;min-width:0">
        <label style="font-weight:700">Hız: <b id="vRateV">${Math.round(voiceRateMul() * 100)}%</b><input type="range" id="vRate" min="60" max="130" step="2" value="${Math.round(voiceRateMul() * 100)}" style="width:100%"></label>
        <label style="font-weight:700">Ton (incelik): <b id="vPitchV">${Math.round((pref.pitchV || 1) * 100)}%</b><input type="range" id="vPitch" min="70" max="140" step="2" value="${Math.round((pref.pitchV || 1) * 100)}" style="width:100%"></label>
        <label style="display:flex;gap:8px;align-items:center;font-weight:700"><input type="checkbox" id="vPause"${pref.pause ? " checked" : ""}> Cümleler arasında kısa duraklama</label>
        <label style="display:flex;gap:8px;align-items:flex-start;font-weight:700"><input type="checkbox" id="vSyl"${pref.syl ? " checked" : ""} style="margin-top:3px"> <span>Yan yana iki sessiz harfte yavaşla<br><span style="font-size:12px;font-weight:600;color:var(--ink-soft)">"Zihni", "ekmek" gibi kelimelerde hece arasına küçük bir ayrım koyar.</span></span></label>
        <div style="display:flex;gap:6px;align-items:center;font-size:13px;font-weight:700${pref.syl ? "" : ";opacity:.45;pointer-events:none"}">Ayrım biçimi: ${[["dash","Kısa çizgi"],["space","Boşluk"]].map(([k, t]) => `<button type="button" data-vsep="${k}" style="flex:1;padding:7px 6px;border-radius:10px;font:inherit;font-weight:800;border:1.5px solid ${(pref.sylSep || "dash") === k ? "var(--teal,#0F8B85)" : "var(--line,#DDE6EE)"};background:${(pref.sylSep || "dash") === k ? "var(--teal,#0F8B85)" : "#fff"};color:${(pref.sylSep || "dash") === k ? "#fff" : "var(--ink,#1C2B39)"}">${t}</button>`).join("")}</div>
        <div style="display:flex;gap:8px"><select id="vSample" style="flex:1;min-width:0;padding:9px 8px;border-radius:12px;border:1.5px solid var(--line,#DDE6EE);font:inherit;font-size:16px;background:#fff">${VOICE_SAMPLES.map((x, i) => `<option value="${i}">${escHTML(x.slice(0, 40))}${x.length > 40 ? "…" : ""}</option>`).join("")}</select><button type="button" id="vSampleGo" style="flex:0 0 auto;padding:9px 14px;border-radius:12px;font:inherit;font-weight:800;border:1.5px solid var(--teal,#0F8B85);background:#fff;color:var(--teal-dark,#0B5F5A)">Dinle</button></div>
        <div><div style="font-weight:800;margin-bottom:6px">Okunuş düzeltmeleri</div><div style="font-size:12px;font-weight:600;color:var(--ink-soft);margin-bottom:6px">Yanlış okunan bir kelimeyi, okunmasını istediğiniz biçimde yazın (ör. "Zihni" → "Zih-ni").</div>
          ${(pref.fixes || []).map((f, i) => `<div style="display:flex;gap:6px;align-items:center;margin-bottom:6px"><span style="flex:1;font-weight:700">${escHTML(f.a)} → ${escHTML(f.b)}</span><button type="button" data-vfdel="${i}" style="padding:6px 10px;border-radius:10px;border:1.5px solid var(--line,#DDE6EE);background:#fff;font:inherit;font-weight:700">Sil</button></div>`).join("")}
          <div style="display:flex;gap:6px"><input id="vFixA" placeholder="Yazılışı" style="flex:1;min-width:0;padding:9px;border-radius:10px;border:1.5px solid var(--line,#DDE6EE);font:inherit;font-size:16px"><input id="vFixB" placeholder="Okunuşu" style="flex:1;min-width:0;padding:9px;border-radius:10px;border:1.5px solid var(--line,#DDE6EE);font:inherit;font-size:16px"><button type="button" id="vFixAdd" style="padding:9px 12px;border-radius:10px;border:none;background:var(--teal,#0F8B85);color:#fff;font:inherit;font-weight:800">Ekle</button></div></div>
        <button type="button" id="vReset" style="padding:9px;border-radius:12px;border:1.5px solid var(--line,#DDE6EE);background:#fff;font:inherit;font-weight:700">Ses ayarlarını sıfırla</button>
      </div></details>`;
  const save = (o) => { try{ localStorage.setItem(VOICE_KEY, JSON.stringify(Object.assign(voicePrefStored(), o))); }catch(e){} _trVoice = pickTurkishVoice(); };
  const sel = g.querySelector("#voiceSel"); if(sel) sel.onchange = () => { save({ name: sel.value }); speakText("Merhaba, ben Zihni. Hadi birlikte çalışalım!"); };
  const tr = g.querySelector("#voiceTry"); if(tr) tr.onclick = () => speakText("Merhaba, ben Zihni. Hadi birlikte çalışalım!");
  g.querySelectorAll("[data-vrate]").forEach(b => b.onclick = () => { save({ rate: b.dataset.vrate, rateV: b.dataset.vrate === "yavas" ? 0.86 : b.dataset.vrate === "hizli" ? 1.14 : 1 }); renderVoiceSettings(); speakText("Bu hızla okuyacağım."); });
  const fd = g.querySelector("#voiceFine"); if(fd) fd.ontoggle = () => { window.__vfOpen = fd.open; };
  const rr = g.querySelector("#vRate"), pp = g.querySelector("#vPitch"), sm = g.querySelector("#vSample");
  const sample = () => speakText(VOICE_SAMPLES[+(sm ? sm.value : 0)] || VOICE_SAMPLES[0]);
  if(rr){ rr.oninput = () => { g.querySelector("#vRateV").textContent = rr.value + "%"; }; rr.onchange = () => { const v = +rr.value / 100; save({ rateV: v, rate: v < 0.93 ? "yavas" : v > 1.07 ? "hizli" : "normal" }); sample(); }; }
  if(pp){ pp.oninput = () => { g.querySelector("#vPitchV").textContent = pp.value + "%"; }; pp.onchange = () => { save({ pitchV: +pp.value / 100 }); sample(); }; }
  const pz = g.querySelector("#vPause"); if(pz) pz.onchange = () => { save({ pause: pz.checked }); sample(); };
  const sy = g.querySelector("#vSyl"); if(sy) sy.onchange = () => { save({ syl: sy.checked }); window.__vfOpen = true; renderVoiceSettings(); speakText(VOICE_SAMPLES[2]); };
  g.querySelectorAll("[data-vsep]").forEach(b => b.onclick = () => { save({ sylSep: b.dataset.vsep }); window.__vfOpen = true; renderVoiceSettings(); speakText(VOICE_SAMPLES[2]); });
  const sg = g.querySelector("#vSampleGo"); if(sg) sg.onclick = sample;
  const fa = g.querySelector("#vFixAdd"); if(fa) fa.onclick = () => { const a = (g.querySelector("#vFixA").value || "").trim(), b = (g.querySelector("#vFixB").value || "").trim(); if(!a || !b) return; const fx = (voicePref().fixes || []).filter(f => f.a.toLocaleLowerCase("tr") !== a.toLocaleLowerCase("tr")).concat([{ a, b }]); save({ fixes: fx }); window.__vfOpen = true; renderVoiceSettings(); speakText(a); };
  g.querySelectorAll("[data-vfdel]").forEach(b => b.onclick = () => { const fx = (voicePref().fixes || []).slice(); fx.splice(+b.dataset.vfdel, 1); save({ fixes: fx }); window.__vfOpen = true; renderVoiceSettings(); });
  const rs = g.querySelector("#vReset"); if(rs) rs.onclick = () => { try{ localStorage.removeItem(VOICE_KEY); }catch(e){} _trVoice = pickTurkishVoice(); window.__vfOpen = true; renderVoiceSettings(); };
}catch(e){} }
try{ if(window.speechSynthesis) speechSynthesis.onvoiceschanged = () => { _trVoice = pickTurkishVoice(); try{ if(document.getElementById("voiceGroup")) renderVoiceSettings(); }catch(e){} }; }catch(e){}
(function voiceSettingsHook(){ const tryIt = () => { try{ renderVoiceSettings(); }catch(e){} }; setTimeout(tryIt, 600); setTimeout(tryIt, 3000); try{ new MutationObserver(() => { const sc = document.getElementById("settingsScreen"); if(sc && sc.style.display !== "none" && !document.getElementById("voiceGroup")) tryIt(); }).observe(document.body, { attributes: true, subtree: true, attributeFilter: ["style"] }); }catch(e){} })();
function _ttsSpeak(u){ try{ const busy = speechSynthesis.speaking || speechSynthesis.pending; if(busy) speechSynthesis.cancel(); try{ speechSynthesis.resume(); }catch(e){}
if(busy){ const g0 = window.__zaSpGen || 0; setTimeout(() => { if((window.__zaSpGen || 0) !== g0) return; try{ speechSynthesis.speak(u); }catch(e){} }, 120); } else speechSynthesis.speak(u); }catch(e){} }
function speakText(t, opts){
try{
if(!t) return;
/* KURAL (altyazı, 2026-11-06): ses kapatılınca siyah altyazı balonu çıkmaz; yönerge okunurken de çıkmaz (yönerge zaten ekranda yazılı). Altyazı yalnız Ayarlar'daki altyazı açıksa ya da cihazda Türkçe ses yokken (yönerge dışındaki konuşmalarda) görünür */ if(!(opts && opts.instr) && !speechMuted() && (captionOn() || !("speechSynthesis" in window) || !ttsUsable())) showCaption(t);   // altyazı: ayar açıkken, ses kapalıyken ya da Türkçe ses yokken
if(!("speechSynthesis" in window) || speechMuted()) return;
if(!_ttsUnlocked) _ttsMissed = { t, opts, at: Date.now(), g: window.__zaSpGen || 0 };
const isInstr = !!(opts && opts.instr); let instrG = 0; if(isInstr){ instrG = window.__zaInstrG = (window.__zaInstrG || 0) + 1; window.__zaInstrActive = true; clearTimeout(window.__zaInstrT); window.__zaInstrT = setTimeout(() => { if(window.__zaInstrG === instrG) zaInstrDone(); }, Math.min(30000, 1500 + String(t).length * 75)); } else if(window.__zaInstrActive){ window.__zaInstrActive = false; } /* yönerge okunurken başka bir konuşma başlarsa yönerge bitmiş sayılır */
const chunks = ttsPrep(t); _trVoice = _trVoice || pickTurkishVoice();
chunks.forEach((c, i) => { const u = new SpeechSynthesisUtterance(c);
  if(i === 0){ u.onstart = () => { if(_ttsMissed && _ttsMissed.t === t) _ttsMissed = null; }; { const g0 = window.__zaSpGen || 0; u.onerror = (ev) => { if((window.__zaSpGen || 0) !== g0) return; if(ev && /cancel|interrupt/i.test(String(ev.error || ""))) return; if(!(opts && opts.instr) && !speechMuted()) showCaption(t); }; } }   // gerçekten çaldıysa tekrar okunmasın
  u.lang = "tr-TR"; u.rate = ((opts && opts.rate) || 0.85) * voiceRateMul(); u.pitch = voicePitch((opts && opts.pitch) || 1.0);
  if(_trVoice) u.voice = _trVoice;
  if(isInstr && i === chunks.length - 1){ const g1 = instrG; const done = () => { if(window.__zaInstrG === g1) setTimeout(() => { if(window.__zaInstrG === g1) zaInstrDone(); }, 250); }; u.onend = done; if(i > 0) u.onerror = done; }
  if(i === 0) _ttsSpeak(u); else { const g0 = window.__zaSpGen || 0; setTimeout(() => { if((window.__zaSpGen || 0) !== g0) return; try{ speechSynthesis.speak(u); }catch(e){} }, 150); } });
}catch(e){}
}
let _ttsUnlocked = false, _ttsMissed = null;
function ttsUnlock(){ if(_ttsUnlocked || !("speechSynthesis" in window)) return; _ttsUnlocked = true;
try{ speechSynthesis.getVoices(); const m = _ttsMissed; _ttsMissed = null;
{ const u = new SpeechSynthesisUtterance(" "); u.volume = 0; u.lang = "tr-TR"; speechSynthesis.speak(u); } if(m && Date.now() - m.at < 6000 && !speechMuted()){ const g0 = m.g || 0; setTimeout(() => { if(g0 !== (window.__zaSpGen || 0)) return; speakText(m.t, m.opts); }, 60); } /* kaçırılan konuşma, dokunuş bir çıkış düğmesine değilse okunur (çıkış konuşma sırasını değiştirir) */ }catch(e){} }
/* KURAL (yönerge sürekliliği, 2026-11-09): ilk dokunuşta kaçırılan yönergenin yeniden okunması, dokunuş düzey/kişi/aşama/çalışma seçicilerine ya da açık bir menüye yapıldıysa atlanır — sayfa içi ayar değişikliği yönergeyi baştan başlatmaz */
["touchend","pointerup","click","keydown"].forEach(ev => document.addEventListener(ev, (e) => { try{ const t = e.target && e.target.closest ? e.target.closest("#tierRow, #playerRow, #stageRow, #exerciseRow, #exHead, .exh-pop, .exh-bd, #whoSheet") : null; if(t && e.type !== "keydown"){ const m = _ttsMissed; _ttsMissed = null; ttsUnlock(); _ttsMissed = null; return; } }catch(err){} ttsUnlock(); }, { capture: true, passive: true }));
const GAME_LINES = {
start:   ["Hadi başlayalım!", "Hazır mısın?", "Haydi bakalım!", "Yeni bir macera!"],
go:      ["Başla!", "Hadi!", "Şimdi!"],
newStar: ["Harika! Yeni bir yıldız kazandın!", "Süpersin! Yıldızı kaptın!", "Bravo! Bir yıldız daha senin!", "Muhteşem! Yıldız cebinde!"],
good:    ["Aferin, çok güzel!", "Harikasın!", "Çok iyi iş çıkardın!", "Tebrikler!"],
allStars:["Vay canına! Bu duraktaki bütün yıldızları topladın!", "İnanılmaz! Hepsini topladın!"],
faster:  ["Üstelik öncekinden daha hızlıydın!", "Bu sefer daha da hızlıydın!"],
retry:   ["Az kaldı! Bir daha deneyelim.", "Neredeyse oluyordu, hadi bir daha!", "Sorun değil, bir daha dene, yapabilirsin!"]
};
function gameLine(k){ const a = GAME_LINES[k] || [""]; return a[Math.floor(Math.random() * a.length)]; }
function childInstructionText(){
const t = (document.getElementById("instructionBox").innerText || "").replace(/\s+/g, " ");
const m = t.match(/"([^"]+)"/);
return (m ? m[1] : t).trim();
}

let gamePendingStart = null;
function startGameStop(exId, islId, opts){ if(!imagesReady()){ imgWait(() => startGameStop(exId, islId, opts)); return; } try{ const __c = CATEGORIES.find(c => c.exerciseIds.includes(exId)); if(__c) applyPlacedLevel(__c.id, gameProfile()); }catch(e){}
const ci = CATEGORIES.findIndex(c => c.exerciseIds.includes(exId));
if(ci < 0) return;
if(!(currentPlayerName || "").trim()){ gamePendingStart = [exId, islId]; openGameWho(); return; }
if(gxOver()){ gxShowSleep(); return; }
gameStop = { exId, islandId: islId || gameIsland, coop: opts && opts.coop ? opts.coop : null };
gameIsland = gameStop.islandId;
hideGameScreens();
hideAllKidScreens();
appMode = "aile";
gameMode = true;
document.documentElement.classList.add("game-mode");
selectCategory(ci);
const e = currentCategoryExercises().findIndex(x => x.id === exId);
const t = gameStop.islandId === "usta" ? 2 : gameNextTier(exId);
let idx = findSeqIndex(t, e);
if(idx === undefined || idx < 0) idx = findSeqIndex(0, e);
goToIndex(idx);
currentStageIndex = 0;
renderStageRow();
newPage();
const ex = currentExercise();
document.getElementById("gameStopTitle").textContent = gameChildLabel(ex);
document.getElementById("gameStopStars").innerHTML = gameRecord(exId).stars.map(GAME_STAR_SVG).join("");
renderGameWho();
const rr = gameRecord(exId), tt = currentCombo().t, hint = gxHintFor(exId);
const needHint = !!hint && rr.fails && ((rr.fails[tt] || 0) >= 1 || (rr.fails[tt + 1] || 0) >= 2);
gameStop.hinted = needHint;
const hb = document.getElementById("gameHint"); hb.style.display = needHint ? "" : "none"; hb.textContent = needHint ? "💡 İpucu: " + hint : "";
window.scrollTo(0, 0);
gameStop.pred = null;
const inRoute = (() => { try{ const rr2 = gxRoute(); const k = rr2.steps.findIndex(x => x.id === exId); return k >= 0 && !rr2.done[k]; }catch(e){ return false; } })();
/* yönerge kendiliğinden okunmaz; yönerge kutusundaki hoparlörle dinlenir (KURAL yönerge elle, 2026-11-09) */
}

function gameAfterStop(){
if(!gameMode || !gameStop) return;
const ex = currentExercise();
if(ex.id !== gameStop.exId) return;
const finished = isInteractiveExercise(ex) ? interactiveIsDone() : (ex.isMotion ? elapsedMs >= (motionDurationMs - 300) : false);
if(!finished) return;
const ms = elapsedMs, errors = currentErrorCount;
if(gameStop.coop){ try{ coopAfter(mtState, errors); }catch(e){ console.error(e); } return; }
try{ recordSession(ms, errors); }catch(e){}
const n = ex.isTouch ? Math.max(1, touchGoTotal()) : Math.max(1, Array.isArray(currentGrid) ? currentGrid.length : 1);
const allowed = ex.isMotion ? 0 : Math.max(1, Math.floor(n * 0.1)) + adaptInevitable(ex);   /* kaçınılmaz hatalar yıldızı engellemez */
const good = errors <= allowed;
const t = currentCombo().t;
const r = gameRecord(ex.id);
if(t === 3){ r.plays = (r.plays || 0) + 1; const newCrown = good && !r.crown; if(good) r.crown = true; gameRecordSave(ex.id, r);
let gxU = []; try{ gxU = gxAfterStop(ex.id, gameStop.islandId, { good, newStar:false, faster:false, hinted:false }); }catch(e){}
if(newCrown){ try{ const g = gxGet(); g.light = (g.light || 0) + 3; gxSave(g); }catch(e){} gxU.unshift({ k:"crown", t:"👑 Usta tacı! Bu durağın ustası oldun. +3 ışık" }); }
else if(!good) gxU.unshift({ k:"crown", t:"Usta düzeyi zorlu; bir daha dene!" });
showGameReward({ ex, t: 2, good, newStar: false, faster: false, r, gx: gxU });
setTimeout(() => { const c = document.getElementById("grCard"); if(c) c.innerHTML = c.innerHTML.replace(/Zor düzey(ini|i)?/g, "Usta düzeyini"); }, 30);
return; }
r.plays = (r.plays || 0) + 1;
const newStar = good && !r.stars[t];
if(good) r.stars[t] = true;
const faster = good && r.best[t] && ms < r.best[t];
if(good) r.best[t] = r.best[t] ? Math.min(r.best[t], ms) : ms;
r.fails = r.fails || [0, 0, 0];
const warmedUp = good && t < 2 && (r.fails[t + 1] || 0) >= 2;
if(good){ r.fails[t] = 0; if(warmedUp) r.fails[t + 1] = 0; }
else r.fails[t] = (r.fails[t] || 0) + (errors >= Math.max(4, allowed * 3) ? 2 : 1);
const stepDown = !good && t > 0 && r.fails[t] >= 2;
let skipped = false;
if(r.jump === t){ delete r.jump; if(good && t === 2 && !r.stars[1]){ r.stars[1] = true; skipped = true; } }
let jumped = false;
if(good && newStar && t === 0 && !r.stars[2] && !ex.isMotion && gxFastFlawless(ex, ms, errors)){ r.jump = 2; jumped = true; }
if(!good && !ex.isMotion) r.lastBad = todayKey(); else if(good && r.lastBad) delete r.lastBad;
try{ catGameStreak(ex, t, good); }catch(e){}
r.bolt = r.bolt || [false, false, false];
const onTime = good && !ex.isMotion && !ex.noBolt && gxOnTime(ex, ms), newBolt = onTime && !r.bolt[t]; if(onTime) r.bolt[t] = true;
gameRecordSave(ex.id, r);
const outcome = !good ? 0 : (errors === 0 ? 2 : 1), predHit = false;
const spIsl = GAME_ISLANDS.find(x => x.id === gameStop.islandId && x.special);
if(spIsl && spIsl.id === "macera"){ try{ advTaskDone(ex.id); }catch(e){} }
if(spIsl){ gxWeekMark(spIsl.id, ex.id); if(spIsl.id === "usta" && good){ gx0Usta = true; } }
let gx = []; try{ gx = gxAfterStop(ex.id, spIsl ? ((gxIslandOf(ex.id) || {}).id || null) : gameStop.islandId, { good, newStar, faster, hinted: !!gameStop.hinted, bolt: newBolt, pred: predHit }); }catch(e){ console.error(e); }
if(newBolt) gx.unshift({ k:"bolt", t:"⚡ Şimşek rozeti! Süre hedefini tutturdun." });
if(!good && (r.fails && r.fails[t] >= 2)) setTimeout(() => { try{ const c = document.getElementById("grCard"); if(c && !c.querySelector(".mola-inv")){ const d = document.createElement("button"); d.type = "button"; d.className = "mola-inv"; d.textContent = "🌿 Biraz mola verelim mi?"; d.onclick = () => { document.getElementById("gameReward").style.display = "none"; showMola(); }; c.appendChild(d); } }catch(e){} }, 300);
if(warmedUp) gx.unshift({ k:"up", t:`Isındın! Şimdi yeniden ${GAME_TIER_NAMES[t + 1]} düzeyi deneyebilirsin.` });
if(stepDown) gx.unshift({ k:"down", t:"Bir dahaki sefere biraz daha kolayıyla ısınacağız." });
if(jumped) gx.unshift({ k:"up", t:"Çok hızlı ve hatasızdın! Orta'yı atlayıp Zor düzeyi deneyeceksin." });
if(skipped) gx.unshift({ k:"up", t:"Zor düzeyi başardığın için Orta da tamamlandı." });
showGameReward({ ex, t, good, newStar, faster, r, gx });
}
function showGameReward({ ex, t, good, newStar, faster, r, gx }){
const isl = GAME_ISLANDS.find(x => x.id === (gameStop && gameStop.islandId));
document.getElementById("grWhere").textContent = `${isl ? isl.name + " · " : ""}${gameChildLabel(ex)}`;
document.getElementById("grTitle").textContent = good ? "Durak tamam!" : "Az kaldı!";
document.getElementById("grTitle").classList.toggle("soft", !good);
document.getElementById("grMascot").innerHTML = zihniSVG(good ? "cheer" : "encourage");
document.querySelector("#gameReward .gr-rays").style.display = good ? "" : "none";
const burst = document.getElementById("grBurst");
burst.innerHTML = good && newStar ? Array.from({length: 14}, (_, k) => {
const a = (k / 14) * Math.PI * 2, d = 90 + Math.random() * 60;
return `<i style="--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d).toFixed(0)}px;animation-delay:${(0.3 + Math.random() * 0.15).toFixed(2)}s"></i>`;
}).join("") : "";
document.getElementById("grStars").innerHTML = r.stars.map((on, i) => GAME_STAR_SVG(on).replace("<svg ", `<svg class="${i === 1 ? "mid" : ""}" `)).join("");
document.getElementById("grChips").innerHTML = GAME_TIER_NAMES.map((nm, i) => `<span class="gr-chip${r.stars[i] ? " on" : ""}">${nm}${r.stars[i] ? " ✓" : ""}${r.bolt && r.bolt[i] ? " ⚡" : ""}</span>`).join("");
const L = (icon, color, text) => `<div class="gr-line"><svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>${text}</div>`;
const I_OK = '<path d="M4.5 12.5l4.5 4.5 10.5-11"/>', I_UP = '<path d="M5 14l7-7 7 7"/>', I_NEXT = '<path d="M5 12h14M13 6l6 6-6 6"/>', I_AGAIN = '<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v4h4"/>';
const lines = [];
if(good){
lines.push(L(I_OK, "#2E6F6E", `${GAME_TIER_NAMES[t]} düzeyini bitirdin`));
if(newStar) lines.push(L(I_OK, "#2E6F6E", "Yeni yıldız kazandın!"));
if(faster) lines.push(L(I_UP, "#2E6F6E", "Öncekinden daha hızlıydın"));
const nt = r.stars.findIndex(x => !x);
lines.push(nt < 0 ? L(I_OK, "#9A5A12", "Bu duraktaki tüm yıldızları topladın!") : L(I_NEXT, "#9A5A12", `Sıradaki: ${GAME_TIER_NAMES[gameNextTier(ex.id)]} düzey`));
} else {
lines.push(L(I_AGAIN, "#9A5A12", "Biraz acele ettin. Bir daha dene, bu kez daha dikkatli!"));
}
const I_SP = '<path d="M12 3l2 5.6 5.6 2-5.6 2L12 18.2l-2-5.6-5.6-2 5.6-2z"/>';
(gx || []).forEach(x => lines.push(L(x.k === "down" ? I_AGAIN : x.k === "up" ? I_UP : I_SP, "#B07D00", x.t).replace('class="gr-line"', 'class="gr-line gx"')));
document.getElementById("grCard").innerHTML = lines.join("");
document.getElementById("gameReward").classList.toggle("many", lines.length > 4);
const over = gxOver();
let nxt = over ? null : gxRouteNext(); if(nxt && nxt.id === ex.id) nxt = null;
if(!nxt && !over){ try{ const isl = GAME_ISLANDS.find(i => i.id === gameStop.islandId); if(isl && !isl.special){ const ids = gameIslandStops(isl), k = ids.indexOf(ex.id); const order = ids.slice(k + 1).concat(ids.slice(0, Math.max(0, k)));
const nid = order.find(id => gameStars(id) < 3) || null; if(nid) nxt = { id: nid, isl: isl.id }; } }catch(e){} }
const rb = document.getElementById("grRouteBtn"); rb.style.display = nxt ? "" : "none";
if(nxt){ rb.dataset.play = nxt.id; rb.dataset.isl = nxt.isl; const nx = exerciseById(nxt.id); rb.innerHTML = `<span class="gr-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5.2v13.6c0 .8.9 1.3 1.6.8l10-6.8c.6-.4.6-1.2 0-1.6l-10-6.8C8.9 3.9 8 4.4 8 5.2z" fill="currentColor"/></svg></span><span>Sıradaki durak: ${nx ? escHTML(gameChildLabel(nx)) : ""}</span>`; rb.classList.add("gr-primary"); /* KURAL (ödül ekranı, 2026-11-06): "Sıradaki durak" düğmesi Haritaya dön · Bir daha satırının hemen üstündedir; başlama üçgeni beyaz yuvarlak içinde belirgin */ { const row = document.querySelector("#gameReward .gr-btns"); if(row && row.firstElementChild !== rb) row.insertBefore(rb, row.firstChild); } /* alttaki sabit (yapışık) düğme alanının içinde, iki düğmenin üstünde tam genişlik */ }
const leftSec = (() => { try{ return gxAllowedSec() - gxUsedSec(); }catch(e){ return 9999; } })();
let mb = document.getElementById("grMolaNear"); if(mb) mb.remove();
if(!over && leftSec > 0 && leftSec <= 180){ lines.push(L(I_SP, "#2E7D5B", "Son bir durak daha, sonra Mola Adası'nda dinlenelim 🌿").replace('class="gr-line"', 'class="gr-line gx"'));
document.getElementById("grCard").innerHTML = lines.join("");
mb = document.createElement("button"); mb.type = "button"; mb.id = "grMolaNear"; mb.className = rb.className.replace("gr-primary", "").trim(); mb.textContent = "🌿 Mola Adası"; rb.parentNode.insertBefore(mb, rb.nextSibling);
mb.onclick = () => { document.getElementById("gameReward").style.display = "none"; try{ exitGameMode(); showMola(); }catch(e){ showIslandMap(); } }; }
if(over){ const done = (() => { try{ return gxRoute().done.filter(Boolean).length; }catch(e){ return 0; } })();
lines.push(L(I_SP, "#2E7D5B", done ? `Bugünlük bu kadar! ${done} durak bitirdin, harikaydın. Zihni yarın seni bekliyor 💤` : "Bugünlük bu kadar! Yarın yeni duraklar seni bekliyor 💤").replace('class="gr-line"', 'class="gr-line gx"'));
document.getElementById("grCard").innerHTML = lines.join(""); }
document.getElementById("grAgainBtn").style.display = over ? "none" : "";
document.getElementById("grMapBtn").textContent = over ? "Zihni uyusun" : "Haritaya dön";
document.getElementById("gameReward").style.display = "block";
document.getElementById("gameReward").scrollTop = 0;
const allDone = r.stars.every(Boolean);
sfx(good ? (newStar ? "fanfare" : "solved") : "soft");
if(newStar) setTimeout(() => sfx("star"), 650);
const say = good ? [allDone && newStar ? gameLine("allStars") : (newStar ? gameLine("newStar") : gameLine("good")), faster ? gameLine("faster") : ""].join(" ") : gameLine("retry");
const sayEnd = over ? " Bugünlük bu kadar, harikaydın!" : (leftSec > 0 && leftSec <= 180 ? " Son bir durak daha, sonra mola!" : "");
setTimeout(() => speakText(say + sayEnd, { pitch: 1.2 }), 500);
}


function renderGameWho(){
const b = document.getElementById("gameWhoBtn"); if(!b) return;
const n = (currentPlayerName || "").trim();
b.classList.toggle("unset", !n);
b.innerHTML = n ? `${avatarHTML(n, 30)}<span class="nm">${n.replace(/</g, "&lt;")}</span>`
: `<span class="gw-plus">+</span><span class="nm">Kişi seç</span>`;
b.disabled = !!timerRunning;
b.setAttribute("aria-label", n ? `Kim oynuyor: ${n}. Değiştirmek için dokunun` : "Kişi seç");
}
let whoCallback = null, whoNoGuest = false;
function pickPerson(cb, opts){ whoCallback = cb; whoNoGuest = !!(opts && opts.noGuest); openGameWho(false, true); }
function openGameWho(focusNew, keepCallback){
if(timerRunning) return;
if(!keepCallback){ whoCallback = null; whoNoGuest = false; }
const cur = (currentPlayerName || "").trim();
const names = (typeof playersList !== "undefined" ? playersList : []).filter(n => n !== "Misafir").concat(whoNoGuest ? [] : ["Misafir"]);
document.getElementById("gwList").innerHTML = names.map(n => `<button type="button" class="gw-item${n === cur ? " on" : ""}" data-who="${n.replace(/"/g, "&quot;")}">${avatarHTML(n, 34)}<span>${n.replace(/</g, "&lt;")}</span>${n === cur ? '<span class="ok">Oynuyor</span>' : ""}</button>`).join("");
document.getElementById("gwNewName").value = "";
document.getElementById("gameWhoSheet").style.display = "flex";
if(focusNew === true) setTimeout(() => document.getElementById("gwNewName").focus(), 50);
}
function setGamePlayer(name){
document.getElementById("gameWhoSheet").style.display = "none";
if(whoCallback){ const f = whoCallback; whoCallback = null; whoNoGuest = false; currentPlayerName = name; try{ renderPlayerOptions(); const ps = document.getElementById("playerSelect"); if(ps) ps.value = name; updatePlayerAvatar(name); }catch(e){} f(name); return; }
const pending = gamePendingStart; gamePendingStart = null;
if(pending){ currentPlayerName = name; sfx("pop"); startGameStop(pending[0], pending[1]); return; }
if(name === (currentPlayerName || "").trim()) return;
currentPlayerName = name;
sfx("pop");
if(gameMode && gameStop) startGameStop(gameStop.exId, gameStop.islandId);
else showIslandMap();
}
function gameAddPlayer(name){
name = cleanPersonName(name); if(!name) return;
if(!playersList.includes(name)){ setTimeout(() => { try{ if(!placeGet(name)) placeOffer(name); }catch(e){} }, 600);
if(firestoreReady && window.__fb){ const { db, collection, addDoc } = window.__fb; addDoc(collection(db, "players"), withUid({ name, createdAt: Date.now() })).catch(e => console.error("Profil eklenemedi:", e)); playersList = playersList.concat([name]); }
else { playersList.push(name); try{ renderPlayerOptions(); }catch(e){} queuePendingWrite("players", { name, createdAt: Date.now() }); }
}
setGamePlayer(name);
}
(function initGameWho(){
document.getElementById("gameWhoBtn").addEventListener("click", openGameWho);
document.getElementById("gwList").addEventListener("click", e => { const b = e.target.closest("[data-who]"); if(b) setGamePlayer(b.dataset.who); });
document.getElementById("gwAddBtn").addEventListener("click", () => gameAddPlayer(document.getElementById("gwNewName").value));
document.getElementById("gwNewName").addEventListener("keydown", e => { if(e.key === "Enter") gameAddPlayer(e.target.value); });
document.getElementById("gwCancelBtn").addEventListener("click", () => {
const hadCb = !!whoCallback; whoCallback = null; whoNoGuest = false; gamePendingStart = null;
document.getElementById("gameWhoSheet").style.display = "none";
if(!gameMode && !hadCb) showIslandMap();
});
})();

let plAnswerVal = "", plExpected = 0, plOnSuccess = null;
function showParentLock(onSuccess){
plOnSuccess = onSuccess;
const a = 11 + Math.floor(Math.random() * 9), b = 3 + Math.floor(Math.random() * 7);
plExpected = a * b; plAnswerVal = "";
document.getElementById("plQuestion").textContent = `${a} × ${b}`;
document.getElementById("plAnswer").textContent = "";
document.getElementById("parentLock").style.display = "flex";
}
function plPress(k){
if(k === "Sil"){ plAnswerVal = plAnswerVal.slice(0, -1); }
else if(k === "Tamam"){
if(Number(plAnswerVal) === plExpected){
document.getElementById("parentLock").style.display = "none";
const f = plOnSuccess; plOnSuccess = null; if(f) f();
return;
}
const card = document.querySelector("#parentLock .pl-card");
card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
showParentLock(plOnSuccess);
{ const sub = document.querySelector("#parentLock .pl-sub"); if(sub){ sub.textContent = "Cevap yanlış. Yeni soruyu deneyin."; sub.style.color = "#B45309"; clearTimeout(sub._t); sub._t = setTimeout(() => { sub.textContent = "Oyun modundan çıkmak için cevabı yazın"; sub.style.color = ""; }, 2600); } }
return;
} else if(plAnswerVal.length < 4){ plAnswerVal += k; }
document.getElementById("plAnswer").textContent = plAnswerVal;
}
(function initGameUI(){
document.getElementById("plKeys").innerHTML = ["1","2","3","4","5","6","7","8","9","Sil","0","Tamam"]
.map(k => `<button type="button" class="pl-key${k === "Tamam" ? " ok" : ""}" data-k="${k}">${k}</button>`).join("");
document.getElementById("plKeys").addEventListener("click", e => { const b = e.target.closest("[data-k]"); if(b) plPress(b.dataset.k); });
document.getElementById("plCancelBtn").addEventListener("click", () => { document.getElementById("parentLock").style.display = "none"; plOnSuccess = null; });
document.getElementById("islandBackBtn").addEventListener("click", () => {
showParentLock(() => { hideGameScreens(); exitGameMode(); if(viaWho) showWho(); else document.getElementById("modeScreen").style.display = "flex"; });
});
document.getElementById("islandStopsBackBtn").addEventListener("click", showIslandMap);
document.getElementById("islandScreen").addEventListener("click", e => {
if(e.target.closest("#closetBtn")){ sfx("pop"); gxOpenCloset(); return; }
const p = e.target.closest("[data-play]"); if(p){ sfx("go"); window.gxReturnTo = "map"; startGameStop(p.dataset.play, p.dataset.isl); return; }
const b = e.target.closest(".isl-island"); if(b){ sfx("pop"); islToggle(b.dataset.isl); return; } const tb = e.target.closest("[data-isltab]"); if(tb){ islTab(tb.dataset.isltab); }
});
document.getElementById("islandStops").addEventListener("click", e => { const cp = e.target.closest("[data-coop]"); if(cp){ sfx("go"); startGameStop(cp.dataset.coop, cp.dataset.isl, { coop: { res:[] } }); return; } const p = e.target.closest("[data-play]"); if(p){ sfx("go"); window.gxReturnTo = "stops"; startGameStop(p.dataset.play, p.dataset.isl); } });
document.getElementById("gamePlayerSelect").addEventListener("change", e => {
const v = e.target.value;
if(v === "__new__"){ renderGamePlayerSelect(); openGameWho(true); return; }
currentPlayerName = v; showIslandMap();
});
document.getElementById("gameMapBtn").addEventListener("click", () => {
resetTimer();
exitGameMode();
document.getElementById("mainApp").style.display = "none";
if(gameIsland && window.gxReturnTo !== "map") showIslandStops(gameIsland); else showIslandMap();
});
/* KURAL (tek hoparlör, 2026-11-09): Zihin Adaları sayfalarında başlıktaki oyun hoparlörü kaldırıldı; yönerge kutusundaki hoparlör yeterli */
renderSpeakBtn();
document.getElementById("grRouteBtn").addEventListener("click", (e) => {
const b = e.currentTarget; document.getElementById("gameReward").style.display = "none"; resetTimer(); sfx("go"); window.gxReturnTo = "map";
startGameStop(b.dataset.play, b.dataset.isl);
});
document.getElementById("gsExitBtn").addEventListener("click", () => { document.getElementById("gameSleep").style.display = "none"; hideGameScreens(); exitGameMode(); showWho(); });
document.getElementById("gsMoreBtn").addEventListener("click", () => showParentLock(() => { const g = gxGet(), k = todayKey(); g.extra[k] = (g.extra[k] || 0) + 10; g.warned[k] = 0; gxSave(g); document.getElementById("gameSleep").style.display = "none"; showIslandMap(); }));
document.getElementById("closetCloseBtn").addEventListener("click", () => { document.getElementById("closetSheet").style.display = "none"; showIslandMap(); });
document.getElementById("grMapBtn").addEventListener("click", () => {
if(gxOver()){ document.getElementById("gameReward").style.display = "none"; resetTimer(); gxShowSleep(); return; }
document.getElementById("gameReward").style.display = "none";
resetTimer(); exitGameMode(); document.getElementById("mainApp").style.display = "none";
if(gameIsland === "macera"){ showAdventure(); return; }
if(gameIsland && window.gxReturnTo !== "map") showIslandStops(gameIsland); else showIslandMap();
});
document.getElementById("grAgainBtn").addEventListener("click", () => {
document.getElementById("gameReward").style.display = "none";
resetTimer();
if(gameStop) startGameStop(gameStop.exId, gameStop.islandId);
});
document.querySelectorAll("#viewSwitch .view-btn").forEach(b => b.addEventListener("click", (e) => { e.stopPropagation(); setEtkinlikView(b.dataset.view); }));
renderViewSwitch();
try{ if(window.speechSynthesis) speechSynthesis.getVoices(); }catch(e){}
})();


const GX_KEY = "wm_gamex_v1", GX_ROUTE_KEY = "wm_game_route_v1", GX_LIMIT_KEY = "wm_game_limit_v1";
function mascotName(){ try{ const n = (gxGet().mname || "").trim(); return n || "Zihni"; }catch(e){ return "Zihni"; } }
function gxAll(){ try{ return JSON.parse(localStorage.getItem(GX_KEY) || "{}"); }catch(e){ return {}; } }
function gxGet(){ const d = gxAll(), p = gameProfile(); const g = d[p] || {};
return Object.assign({ light:0, lightIsl:{}, owned:[], worn:{}, routes:0, weeks:{}, weekGoals:0, screen:{}, extra:{}, warned:{} }, g); }
function gxSave(g){ const d = gxAll(); d[gameProfile()] = g; try{ localStorage.setItem(GX_KEY, JSON.stringify(d)); }catch(e){} }

function gxLimitMin(){ try{ const v = localStorage.getItem(GX_LIMIT_KEY); return v === null ? 20 : Number(v); }catch(e){ return 20; } }
function gxUsedSec(){ const g = gxGet(); return g.screen[todayKey()] || 0; }
function gxAllowedSec(){ const L = gxLimitMin(); if(!L) return Infinity; const g = gxGet(); return (L + (g.extra[todayKey()] || 0)) * 60; }
function gxOver(){ return gxUsedSec() >= gxAllowedSec(); }
function gxScreensActive(){ return gameMode || ["islandScreen","islandStopsScreen","gameReward"].some(id => { const el = document.getElementById(id); return el && el.style.display !== "none"; }); }
setInterval(() => { try{
if(document.hidden || !gxScreensActive() || !(currentPlayerName || "").trim()) return;
const g = gxGet(), k = todayKey(); g.screen[k] = (g.screen[k] || 0) + 5;
for(const old in g.screen){ if(old < todayKey(new Date(Date.now() - 14 * 864e5))) delete g.screen[old]; }
const left = gxAllowedSec() - g.screen[k];
if(left <= 120 && left > 0 && !g.warned[k]){ g.warned[k] = 1; gxSave(g); showLevelFlashGame(`${mascotName()} esniyor… Biraz sonra dinlenme zamanı.`); try{ speakText(`${mascotName()} esniyor. Bu son durağın olabilir.`); }catch(e){} return; }
gxSave(g);
if(left <= 0 && !timerRunning && Date.now() - (window._lastStopAt || 0) > 3000 && document.getElementById("gameReward").style.display === "none" && document.getElementById("gameSleep").style.display === "none") gxShowSleep();
}catch(e){} }, 5000);
function gxShowSleep(){
hideGameScreens(); exitGameMode(); document.getElementById("mainApp").style.display = "none";
document.getElementById("gsMascot").innerHTML = zihniSVG("sleepy");
document.getElementById("gsText").textContent = `${mascotName()} çok çalıştı, şimdi dinleniyor. Yarın yine buluşalım.`;
document.getElementById("gameSleep").style.display = "flex";
try{ speakText(`Bugünlük bu kadar! ${mascotName()} dinleniyor. Yarın yine buluşalım.`); }catch(e){}
}

function gxOnTime(ex, ms){
const n = ex.isSeqRows ? Math.max(1, currentGrid.length * 2) : Array.isArray(currentGrid) && currentGrid.length ? currentGrid.length : 1;
const k = ex.speedFactor || (ex.isSeqRows ? 3 : (ex.isScatter ? 2 : 1));
return (ms / 1000) / n <= SUCCESS_SEC_PER_ITEM * k;
}
function gxFastFlawless(ex, ms, errors){
if(errors !== 0) return false;
const n = ex.isSeqRows ? Math.max(1, currentGrid.length * 2) : Array.isArray(currentGrid) && currentGrid.length ? currentGrid.length : 1;
const k = ex.speedFactor || (ex.isSeqRows ? 3 : (ex.isScatter ? 2 : 1));
return (ms / 1000) / n <= SUCCESS_SEC_PER_ITEM * k * 0.6;
}
function gxHintFor(exId){ const sp = typeof STRATEGIES !== "undefined" ? STRATEGIES[exId] : null; return sp ? sp[2] : ""; }

const GROW = [ { at:5, nm:"çiçekler açtı" }, { at:15, nm:"gökkuşağı çıktı" }, { at:30, nm:"deniz feneri yandı" } ];
const GROW_SVG = [
'<svg viewBox="0 0 24 24"><g fill="#FF7AB6"><circle cx="12" cy="6.5" r="3.6"/><circle cx="17.2" cy="10.3" r="3.6"/><circle cx="15.2" cy="16.4" r="3.6"/><circle cx="8.8" cy="16.4" r="3.6"/><circle cx="6.8" cy="10.3" r="3.6"/></g><circle cx="12" cy="12" r="3.4" fill="#FFD23F"/></svg>',
'<svg viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round"><path d="M3 18a9 9 0 0 1 18 0" stroke="#E5484D"/><path d="M6 18a6 6 0 0 1 12 0" stroke="#F5C518"/><path d="M9 18a3 3 0 0 1 6 0" stroke="#2E6FD8"/></svg>',
'<svg viewBox="0 0 24 24"><path d="M9 21l1.5-14h3L15 21z" fill="#fff" stroke="#C0392B" stroke-width="1.2"/><path d="M9.8 14h4.4l.3 3H9.5z" fill="#E5484D"/><path d="M10.3 9.5h3.4l.2 2H10.1z" fill="#E5484D"/><path d="M9.5 7h5l-1-3h-3z" fill="#FFD23F"/><path d="M15.5 5.5l5-2M15.5 6.5l5 1" stroke="#FFD23F" stroke-width="1.6" stroke-linecap="round"/></svg>'
];
function gxIslGrowth(islId){ const n = gxGet().lightIsl[islId] || 0; return GROW.filter(x => n >= x.at).length; }

const ACCS = [
{ id:"bow",     slot:"neck", nm:"Papyon",        need:"İlk rotanı tamamla",              ok:(g) => g.routes >= 1 },
{ id:"glasses", slot:"face", nm:"Gözlük",        need:"10 ışık topla",                   ok:(g) => g.light >= 10 },
{ id:"explorer",slot:"head", nm:"Kâşif şapkası", need:"30 ışık topla",                   ok:(g) => g.light >= 30 },
{ id:"scarf",   slot:"neck", nm:"Atkı",          need:"Bir haftada 4 gün oyna",          ok:(g) => g.weekGoals >= 1 },
{ id:"flowers", slot:"head", nm:"Çiçek tacı",    need:"3 rota tamamla",                  ok:(g) => g.routes >= 3 },
{ id:"cape",    slot:"back", nm:"Pelerin",       need:"80 ışık topla",                   ok:(g) => g.light >= 80 },
{ id:"crown",   slot:"head", nm:"Taç",           need:"Bir adanın tüm yıldızlarını topla", ok:() => GAME_ISLANDS.some(i => !i.legacy && (() => { const s = gameIslandStarInfo(i); return s.total && s.got >= s.total; })()) }
];
const ACC_SVG = {
cape:     '<path d="M32 40 Q20 70 24 98 L96 98 Q100 70 88 40 Z" fill="#7B5CFF"/><path d="M32 40 Q26 70 29 98" fill="none" stroke="#5B3FE0" stroke-width="3"/>',
explorer: '<ellipse cx="60" cy="17" rx="36" ry="6.5" fill="#B88A45"/><path d="M38 17 Q39 -6 60 -8 Q81 -6 82 17 Z" fill="#D9B26B"/><rect x="39" y="9" width="42" height="6" fill="#8B5A2B"/>',
crown:    '<path d="M40 19 L40 2 L50 10 L60 -5 L70 10 L80 2 L80 19 Z" fill="#FFC83D" stroke="#D99A00" stroke-width="2" stroke-linejoin="round"/><circle cx="60" cy="12" r="3" fill="#E5484D"/><circle cx="48" cy="14" r="2.2" fill="#2E6FD8"/><circle cx="72" cy="14" r="2.2" fill="#1FA463"/>',
flowers:  [[34,24],[45,15],[60,12],[75,15],[86,24]].map(([x, y], k) => `<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a => `<circle cx="${(Math.cos(a * Math.PI / 180) * 4.2).toFixed(1)}" cy="${(Math.sin(a * Math.PI / 180) * 4.2).toFixed(1)}" r="3.4" fill="${["#FF7AB6","#FFD23F","#FF8A3D","#B58CFF","#FF7AB6"][k]}"/>`).join("")}<circle r="2.6" fill="#fff"/></g>`).join(""),
glasses:  '<circle cx="45" cy="50" r="14.5" fill="none" stroke="#1C2B39" stroke-width="3.5"/><circle cx="75" cy="50" r="14.5" fill="none" stroke="#1C2B39" stroke-width="3.5"/><path d="M59 48 Q60 45 61 48" fill="none" stroke="#1C2B39" stroke-width="3.5"/>',
bow:      '<path d="M60 83 L45 74 L45 92 Z" fill="#E5484D"/><path d="M60 83 L75 74 L75 92 Z" fill="#E5484D"/><circle cx="60" cy="83" r="4.5" fill="#B8262B"/>',
scarf:    '<path d="M27 70 Q60 88 93 70 L94 79 Q60 97 26 79 Z" fill="#FF8A3D"/><path d="M78 82 L84 102 L74 103 L70 85 Z" fill="#FF8A3D"/><path d="M30 74 Q60 90 90 74" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 5" opacity=".7"/>'
};
function zihniSVG(mood){
let s = mascotSVG(mood); s = s.replace('<svg ', `<svg data-zw="1" data-mood="${mood || "happy"}" `);
if(!(currentPlayerName || "").trim()) return s;
const w = gxGet().worn || {}; const ids = Object.values(w).filter(Boolean);
if(!ids.length) return s;
s = s.replace('viewBox="0 0 120 120"', 'viewBox="0 -14 120 134"');
const pz = zihniPose(mood || "happy"); if(w.back) s = s.replace('<g class="bob">', '<g class="bob">' + zihniAcc(w.back, pz));
const front = ["neck","face","head"].map(k => w[k] ? zihniAcc(w[k], pz) : "").join("");
return s.replace(/<\/g><\/svg>\s*$/, front + "</g></svg>");
}
function gxUnlockNew(g){ const got = []; ACCS.forEach(a => { if(!g.owned.includes(a.id) && a.ok(g)){ g.owned.push(a.id); got.push(a); } }); return got; }

const WEEK_GOAL = 4;
function gxWeekDays(g){ return (g.weeks[weekKey()] || []); }

function gxIslandOf(exId){ return GAME_ISLANDS.find(i => !i.legacy && !i.special && gameIslandStops(i).includes(exId)); }
function gxExpertGames(){ const p = typeof familyProgram === "function" ? familyProgram() : null; return p && Array.isArray(p.games) ? p.games.filter(id => { const i = gxIslandOf(id); return i && !gameIslandLocked(i); }) : []; }
function gxBuildRoute(){
const rnd = seededRand("route" + todayKey() + gameProfile() + (readingLevel || "post"));
const pick = (arr) => arr.length ? arr[Math.floor(rnd() * arr.length)] : null;
const open = GAME_ISLANDS.filter(i => !i.legacy && !i.special && !gameIslandLocked(i));
const stopsOf = (i) => gameIslandStops(i);
const notFull = (ids) => { const a = ids.filter(id => gameStars(id) < 3); return a.length ? a : ids; };
const used = new Set(), steps = [];
const add = (id, role, expert) => { if(id && !used.has(id)){ used.add(id); steps.push({ id, isl: gxIslandOf(id).id, role, expert: !!expert }); } };
const goz = open.find(i => i.id === "goz"); if(goz) add(pick(notFull(stopsOf(goz))), "Isınma");
const L = isPre() ? 3 : 4;
gxExpertGames().slice(0, 2).forEach(id => add(id, "Özel görev", true));
const tgt = (() => { try{ return famTarget(); }catch(e){ return null; } })();
const tgtIds = open.flatMap(stopsOf).filter(id => tgt && (CATEGORIES.find(c => c.id === tgt) || { exerciseIds:[] }).exerciseIds.includes(id) && !used.has(id));
while(steps.length < L - 1){ const pool = notFull(tgtIds.filter(id => !used.has(id))); const id = pick(pool.length ? pool : notFull(open.filter(i => i.id !== "goz").flatMap(stopsOf).filter(id => !used.has(id)))); if(!id) break; add(id, "Ana durak"); }
const daysAgo = (k) => { const a = new Date(k + "T00:00:00"), b = new Date(todayKey() + "T00:00:00"); return Math.round((b - a) / 86400000); };
const review = open.flatMap(stopsOf).filter(id => !used.has(id) && gameRecord(id).lastBad && daysAgo(gameRecord(id).lastBad) >= 2);
if(review.length){ if(steps.length >= L - 1) { const k = steps.map(x => x.role).lastIndexOf("Ana durak"); if(k >= 0){ used.delete(steps[k].id); steps.splice(k, 1); } } add(pick(review), "Tekrar"); }
const plays = (i) => stopsOf(i).reduce((a, id) => a + (gameRecord(id).plays || 0), 0);
const mainIsl = new Set(steps.filter(s => s.role !== "Isınma").map(s => s.isl));
const cands = open.filter(i => i.id !== "goz");
const fav = cands.some(i => plays(i) > 0) ? cands.sort((a, b) => plays(b) - plays(a))[0] : (pick(cands.filter(i => !mainIsl.has(i.id))) || pick(cands));
if(fav) add(pick(stopsOf(fav).filter(id => !used.has(id))), "Kapanış");
return { steps, done: steps.map(() => false), sig: gxExpertGames().join("+") };
}
function gxRoute(){
let st; try{ st = JSON.parse(localStorage.getItem(GX_ROUTE_KEY) || "{}"); }catch(e){ st = {}; }
const k = gameProfile() + "|" + (readingLevel || "post") + "|" + todayKey();
const sig = gxExpertGames().join("+");
if(!st[k] || (st[k].sig !== sig && !st[k].done.some(Boolean))){ st[k] = gxBuildRoute(); }
for(const kk in st){ if(!kk.endsWith(todayKey())) delete st[kk]; }
try{ localStorage.setItem(GX_ROUTE_KEY, JSON.stringify(st)); }catch(e){}
return st[k];
}
function gxRouteSave(r){ let st; try{ st = JSON.parse(localStorage.getItem(GX_ROUTE_KEY) || "{}"); }catch(e){ st = {}; } st[gameProfile() + "|" + (readingLevel || "post") + "|" + todayKey()] = r; try{ localStorage.setItem(GX_ROUTE_KEY, JSON.stringify(st)); }catch(e){} }
function gxRouteNext(){ const r = gxRoute(); const i = r.done.findIndex(x => !x); return i < 0 ? null : r.steps[i]; }
const I_LETTER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>';
const I_SPARK = '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3L3.5 11l6.3-2.2z" fill="#FFC83D" stroke="#E0A100" stroke-width="1.2" stroke-linejoin="round"/></svg>';
function gxRenderMapExtras(){
const box = document.getElementById("islandRoute"); if(!box) return;
if(!(currentPlayerName || "").trim()){ box.innerHTML = ""; return; }
setTimeout(() => { try{ let pc = document.getElementById("placeCard"); const nm = gameProfile(); const due = nm !== "Misafir" && placeDue(nm), had = !!placeGet(nm);
if(!due){ if(pc) pc.remove(); return; } if(!pc){ pc = document.createElement("div"); pc.id = "placeCard"; box.parentNode.insertBefore(pc, box); }
pc.innerHTML = `<div class="place-card"><span>🧭</span><div><b>${had ? "Yeniden değerlendirme turu" : "Değerlendirme turu"}</b><div>${had ? "6 hafta oldu, düzeyler güncellensin" : "Zihni ile başlangıç düzeyini bul"}</div></div><button type="button" class="gr-btn" id="placeCardBtn">Oyna</button></div>`;
document.getElementById("placeCardBtn").onclick = () => placeStart(nm); }catch(e){} }, 0);
const g = gxGet(), r = gxRoute(), days = gxWeekDays(g), ti = todayDayIdx();
const allDone = r.done.every(Boolean), nx = gxRouteNext();
const steps = r.steps.map((s, i) => { const ex = exerciseById(s.id), isl = GAME_ISLANDS.find(x => x.id === s.isl);
return `<button type="button" class="rt-step${r.done[i] ? " done" : ""}${nx && nx.id === s.id ? " now" : ""}" data-play="${s.id}" data-isl="${s.isl}"><span class="rt-dot" style="background:${isl ? isl.color : "#ccc"}">${r.done[i] ? I_CHECK : i + 1}</span><span class="rt-tx"><span class="rt-role">${s.expert ? I_LETTER + " " : ""}${s.role}</span><span class="rt-nm">${gameChildLabel(ex)}</span>${r.done[i] ? `<span class="rt-stars">${"★".repeat(gameStars(s.id))}${"☆".repeat(Math.max(0, 3 - gameStars(s.id)))}</span>` : ""}</span></button>`; }).join("");
const L = gxLimitMin(), leftMin = L ? Math.max(0, Math.ceil((gxAllowedSec() - gxUsedSec()) / 60)) : null;
box.innerHTML = `<div class="rt-card"><div class="rt-h"><span>Bugünün Rotası</span>${allDone ? `<span class="rt-ok">Tamam!</span>` : `<span class="rt-cnt">${r.done.filter(Boolean).length}/${r.steps.length}</span>`}</div>
<div class="rt-steps">${steps}</div>
${allDone ? `<div class="rt-msg">Rotayı bitirdin! İstersen başka duraklarda da oynayabilirsin.</div>` : nx ? `<button type="button" class="isl-play rt-go" data-play="${nx.id}" data-isl="${nx.isl}">Rotaya devam</button>` : ""}</div>
<div class="rt-row"><div class="rt-pill" title="Işık">${I_SPARK}<b>${g.light}</b> ışık</div>
<div class="rt-pill rt-week" title="Bu hafta oynanan günler">${DAY_SHORT.map((d, i) => `<i class="${days.includes(i) ? "on" : ""}${i === ti ? " today" : ""}"></i>`).join("")}<b>${Math.min(days.length, WEEK_GOAL)}/${WEEK_GOAL}</b> gün</div>
<button type="button" class="rt-pill rt-closet" id="closetBtn">${mascotSVG("happy").replace('class="zmascot"', 'class="zmascot mini"')}Dolap</button></div>
${leftMin !== null ? `<div class="rt-time">Bugün kalan oyun süresi: <b>${leftMin} dk</b></div>` : ""}`;
}
function gxOpenCloset(){
const g = gxGet(); gxUnlockNew(g); gxSave(g);
const sheet = document.getElementById("closetSheet");
const draw = () => { const g2 = gxGet();
document.getElementById("closetPreview").innerHTML = zihniSVG("happy");
document.getElementById("closetList").innerHTML = ACCS.map(a => { const own = g2.owned.includes(a.id), on = g2.worn[a.slot] === a.id;
return `<button type="button" class="cl-item${own ? "" : " locked"}${on ? " on" : ""}" data-acc="${a.id}"><svg viewBox="0 -14 120 134" class="cl-ico">${a.slot === "back" ? zihniAcc(a.id) : ""}${(() => { const z = zihniPose("happy"); return z ? `<image href="${z.u}" x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" opacity="${own ? 0.4 : 0.18}" preserveAspectRatio="none"/>` : ""; })()}${a.slot !== "back" ? zihniAcc(a.id) : ""}</svg><span class="cl-nm">${a.nm}</span><span class="cl-need">${own ? (on ? "Takılı · çıkar" : "Tak") : "🔒 " + a.need}</span></button>`; }).join("");
};
draw(); sheet.style.display = "flex";
const nin = document.getElementById("mascotNameIn"); nin.value = (gxGet().mname || "");
document.getElementById("clTitle").textContent = `Dolap · ${mascotName()}`;
document.getElementById("mascotNameBtn").onclick = () => { const v = nin.value.replace(/[^A-Za-zÇĞİÖŞÜçğıöşü ]/g, "").replace(/\s+/g, " ").trim().slice(0, 12);
const g3 = gxGet(); g3.mname = v; gxSave(g3); nin.value = v; document.getElementById("clTitle").textContent = `Dolap · ${mascotName()}`; sfx("solved"); showLevelFlashGame(`Yeni adı: ${mascotName()}`); };
document.getElementById("closetList").onclick = (e) => { const b = e.target.closest("[data-acc]"); if(!b) return; const a = ACCS.find(x => x.id === b.dataset.acc), g2 = gxGet();
if(!g2.owned.includes(a.id)){ showLevelFlashGame(`${a.nm}: ${a.need}`); return; }
g2.worn[a.slot] = g2.worn[a.slot] === a.id ? null : a.id; gxSave(g2); sfx("pop"); draw(); };
}
let gx0Usta = false;
function gxWeekDone(islId){ const g = gxGet(), k = weekKey(); return ((g.spw || {})[k] || {})[islId] || {}; }
function gxWeekMark(islId, exId){ const g = gxGet(), k = weekKey(); g.spw = g.spw || {}; for(const w in g.spw) if(w !== k) delete g.spw[w]; g.spw[k] = g.spw[k] || {}; g.spw[k][islId] = g.spw[k][islId] || {}; g.spw[k][islId][exId] = true; gxSave(g); }
function gxSeeded(seedStr){ let h = 2166136261; for(const c of seedStr) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h >>> 0) % 10000) / 10000; }; }
function gxUstaStops(){ const rnd = gxSeeded(weekKey() + "|usta|" + (currentPlayerName || "") + "|" + readingLevel);
return GAME_ISLANDS.filter(i => !i.legacy && !i.special && i.id !== "goz").map(i => { const st = gameIslandStops(i).filter(id => !exerciseById(id).isMotion); return st.length ? st[Math.floor(rnd() * st.length)] : null; }).filter(Boolean); }
function gxGezginStops(){ const rnd = gxSeeded(weekKey() + "|gezgin|" + (currentPlayerName || "") + "|" + readingLevel);
const all = GAME_ISLANDS.filter(i => !i.legacy && !i.special && !gameIslandLocked(i)).flatMap(i => gameIslandStops(i)).filter(id => !exerciseById(id).isMotion);
const score = (id) => { const r = gameRecord(id); return (r.lastBad ? -100 : 0) + (r.plays || 0) * 3 + rnd() * 2; };
const out = [], seenIsl = new Set();
for(const id of all.slice().sort((a, b) => score(a) - score(b))){ const isl = gxIslandOf(id); if(isl && seenIsl.has(isl.id) && out.length < 5) continue; out.push(id); if(isl) seenIsl.add(isl.id); if(out.length >= 6) break; }
return out; }
/* MOLA_KEY: hiçbir yerde kullanılmıyordu, silindi (2026-11-09, 7. adım) */
function showMola(){ let el = document.getElementById("molaScreen"); if(!el){ el = document.createElement("div"); el.id = "molaScreen"; document.body.appendChild(el); }
el.innerHTML = `<div class="mola-card"><button type="button" class="mola-x" data-mola="close">✕</button><div style="width:90px;height:90px;margin:0 auto">${zihniSVG("happy")}</div><div class="mola-h">Mola Adası</div><div class="mola-s">Biraz dinlenelim. Hangisini yapalım?</div>
<div class="mola-list"><button type="button" data-mola="breath"><span>🎈</span>Nefes Balonu</button><button type="button" data-mola="stretch"><span>🤸</span>Esneme Zamanı</button><button type="button" data-mola="senses"><span>👀</span>5-4-3-2-1</button></div></div>`;
el.style.display = "flex"; speakText("Biraz dinlenelim. Hangisini yapalım?");
el.querySelectorAll("[data-mola]").forEach(b => b.onclick = () => { const k = b.dataset.mola; if(k === "close"){ el.style.display = "none"; return; } molaRun(k); }); }
function molaDone(){ const el = document.getElementById("molaScreen"); const g = gxGet(), d = todayKey(); g.mola = g.mola || {}; let bonus = false; if(!g.mola[d]){ g.mola = { [d]: true }; g.light = (g.light || 0) + 1; bonus = true; gxSave(g); }
el.innerHTML = `<div class="mola-card"><div style="width:90px;height:90px;margin:0 auto">${zihniSVG("happy")}</div><div class="mola-h">Harika dinlendin!</div><div class="mola-s">${bonus ? "+1 ışık · mola" : "Hazır olunca oyuna dönebilirsin."}</div><div class="mola-list"><button type="button" data-mola="again"><span>🌿</span>Başka mola</button><button type="button" data-mola="close"><span>🗺️</span>Haritaya dön</button></div></div>`;
speakText("Harika dinlendin!"); el.querySelectorAll("[data-mola]").forEach(b => b.onclick = () => { if(b.dataset.mola === "again") showMola(); else { el.style.display = "none"; try{ showIslandMap(); }catch(e){} } }); }
function molaRun(k){ const el = document.getElementById("molaScreen"); let alive = true; const stop = () => { alive = false; };
const frame = (inner) => { el.innerHTML = `<div class="mola-card"><button type="button" class="mola-x" data-mola="x">✕</button>${inner}</div>`; const x = el.querySelector("[data-mola=x]"); if(x) x.onclick = () => { stop(); showMola(); }; };
if(k === "breath"){ let c = 0; const cyc = () => { if(!alive) return; if(c >= 4){ molaDone(); return; } c++;
frame(`<div class="mola-h">Nefes Balonu · ${c}/4</div><div class="mola-ball-wrap"><div class="mola-ball in"></div></div><div class="mola-s" id="molaTx">Burnundan nefes al…</div>`); speakText("Nefes al");
setTimeout(() => { if(!alive) return; const b = el.querySelector(".mola-ball"); if(b){ b.classList.remove("in"); b.classList.add("out"); } const tx = document.getElementById("molaTx"); if(tx) tx.textContent = "Ağzından yavaşça ver…"; speakText("Yavaşça ver"); }, 4000);
setTimeout(cyc, 8500); }; cyc(); }
else if(k === "stretch"){ const order = shuffleArray(MOVES.map((m, i) => i).filter(i => i !== 2)).slice(0, 5); let j = 0;
const nx = () => { if(!alive) return; if(j >= order.length){ molaDone(); return; } const m = order[j++];
frame(`<div class="mola-h">Esneme Zamanı · ${j}/${order.length}</div><div style="width:160px;height:160px;margin:6px auto"><img src="${MOVE_IMAGES[m]}" alt="" style="width:100%;height:100%;object-fit:contain"></div><div class="mola-s" style="font-size:22px;font-weight:900">${cap(MOVES[m])}!</div>`); speakText(cap(MOVES[m]));
setTimeout(nx, 5000); }; nx(); }
else { const steps = ["Etrafında gördüğün 5 şeyi göster.","Dokunabildiğin 4 şeye dokun.","Duyduğun 3 sesi söyle.","Kokusunu alabildiğin 2 şeyi düşün.","Sevdiğin 1 tadı söyle."]; let j = 0;
const nx = () => { if(!alive) return; if(j >= steps.length){ molaDone(); return; } const t = steps[j++]; frame(`<div class="mola-h">${6 - j}</div><div class="mola-s" style="font-size:21px;font-weight:800">${t}</div><div class="mola-list"><button type="button" id="molaNext"><span>👍</span>Yaptım</button></div>`); speakText(t);
const b = document.getElementById("molaNext"); if(b) b.onclick = nx; }; nx(); } }
function gxAfterStop(exId, islId, info){
const g = gxGet(), lines = []; let light = 1; const why = ["bitirdin"];
if(info.good){ light++; why.push("başardın"); }
if(info.newStar){ light++; why.push("yeni yıldız"); }
if(info.faster){ light++; why.push("kendini geçtin"); }
if(info.good && info.hinted){ light++; why.push("ipucunu kullandın"); }
if(info.bolt){ light++; why.push("şimşek rozeti"); }
if(info.pred){ light++; why.push("doğru tahmin"); }
if(gx0Usta){ gx0Usta = false; light += info.bolt ? 2 : 1; why.push(info.bolt ? "usta durağı ×2" : "usta durağı"); }
const before = islId ? gxIslGrowth(islId) : 0;
const r = gxRoute(); const ri = r.steps.findIndex((s, i) => s.id === exId && !r.done[i]);
let routeDone = false;
if(ri >= 0){ r.done[ri] = true; gxRouteSave(r); if(r.done.every(Boolean)){ routeDone = true; light += 3; g.routes = (g.routes || 0) + 1; } }
const wk = weekKey(), di = todayDayIdx(); g.weeks[wk] = g.weeks[wk] || []; let weekGoal = false;
if(!g.weeks[wk].includes(di)){ g.weeks[wk].push(di); if(g.weeks[wk].length === WEEK_GOAL){ weekGoal = true; light += 5; g.weekGoals = (g.weekGoals || 0) + 1; } }
for(const k in g.weeks){ if(k < todayKey(new Date(Date.now() - 60 * 864e5))) delete g.weeks[k]; }
g.light = (g.light || 0) + light; if(islId) g.lightIsl[islId] = (g.lightIsl[islId] || 0) + light;
const after = islId ? (g.lightIsl[islId] >= GROW[0].at ? GROW.filter(x => g.lightIsl[islId] >= x.at).length : 0) : 0;
const unlocked = gxUnlockNew(g); gxSave(g);
lines.push({ k:"light", t:`+${light} ışık · ${why.join(", ")}${routeDone ? ", rota" : ""}${weekGoal ? ", haftalık hedef" : ""}` });
if(routeDone) lines.push({ k:"route", t:"Bugünün rotası tamam!" });
if(weekGoal) lines.push({ k:"week", t:`Bu hafta ${WEEK_GOAL} gün oynadın!` });
if(after > before){ const isl = GAME_ISLANDS.find(x => x.id === islId); lines.push({ k:"grow", t:`${isl ? isl.name : "Ada"}: ${GROW[after - 1].nm}!` }); }
unlocked.forEach(a => lines.push({ k:"acc", t:`Dolaba yeni: ${a.nm}` }));
return lines;
}

(function initGameSettings(){
const sel = document.getElementById("gameLimitSel");
if(sel){ sel.value = String(gxLimitMin()); sel.addEventListener("change", () => { try{ localStorage.setItem(GX_LIMIT_KEY, sel.value); }catch(e){} }); }
const keys = [GAME_KEY, GX_KEY];
const bb = document.getElementById("gameBackupBtn"), rb = document.getElementById("gameRestoreBtn"), rf = document.getElementById("gameRestoreFile");
if(bb) bb.addEventListener("click", () => {
const data = { app:"zihin-atolyesi", kind:"game-progress", v:1, at: new Date().toISOString(), keys:{} };
keys.forEach(k => { try{ data.keys[k] = JSON.parse(localStorage.getItem(k) || "{}"); }catch(e){} });
const blob = new Blob([JSON.stringify(data)], { type:"application/json" }), a = document.createElement("a");
a.href = URL.createObjectURL(blob); a.download = `zihin-atolyesi-oyun-yedegi-${todayKey()}.json`; document.body.appendChild(a); a.click();
setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
showLevelFlash("Yedek dosyası hazırlandı ✓", "levelup");
});
if(rb) rb.addEventListener("click", () => rf.click());
if(rf) rf.addEventListener("change", () => {
const f = rf.files && rf.files[0]; if(!f) return;
const rd = new FileReader();
rd.onload = async () => { try{
const d = JSON.parse(rd.result); if(!d || d.kind !== "game-progress" || !d.keys) throw 0;
if(!await zaConfirm("Bu cihazdaki oyun ilerlemesi yedekteki ile birleştirilsin mi? Aynı kişinin kayıtlarında yedekteki geçerli olur.")) return;
keys.forEach(k => { if(!d.keys[k]) return; let cur = {}; try{ cur = JSON.parse(localStorage.getItem(k) || "{}"); }catch(e){} localStorage.setItem(k, JSON.stringify(Object.assign(cur, d.keys[k]))); });
showLevelFlash("Oyun ilerlemesi geri yüklendi ✓", "levelup");
}catch(e){ showLevelFlash("Bu dosya bir oyun yedeği değil.", "down"); } rf.value = ""; };
rd.readAsText(f);
});
})();

function chooseReadingLevel(level){ try{
readingLevel = level;
applyLevelDefaultThresholds(level);
if(pendingLevelPlayerName){
const name = pendingLevelPlayerName;
if(pendingLevelPlayerIsNew && !playersList.includes(name)){
if(firestoreReady && window.__fb){
const { db, collection, addDoc } = window.__fb;
addDoc(collection(db, "players"), withUid({ name, createdAt: Date.now(), readingLevel: level }))
.catch(e=> console.error("Profil eklenemedi:", e));
} else {
playersList.push(name);
queuePendingWrite("players", { name, createdAt: Date.now(), readingLevel: level });
}
}
rememberPlayerLevel(name, level);
currentPlayerName = name;
pendingLevelPlayerName = null;
pendingLevelPlayerIsNew = false;
renderPlayerOptions();
}
categoryBackTarget = "readingLevelScreen";
document.getElementById("readingLevelScreen").style.display = "none";
renderCategoryList();
document.getElementById("categoryScreen").style.display = "block";
}finally{ try{ if(appMode === "aile" || appMode === "uzman") lastSave(appMode, currentPlayerName); }catch(e){} } }


function hideAllKidScreens(){
["childLevelScreen","childSoonScreen","childModeScreen","kidResultScreen","kidOddOneOutScreen","kidMemoryScreen","kidQuickTapScreen"]
.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = "none"; });
}

function showChildModeScreen(){
hideAllKidScreens();
document.getElementById("childModeScreen").style.display = "flex";
}

let kidResultReplayFn = null;
function showKidResult({stars, title, detail, replay}){
hideAllKidScreens();
document.getElementById("kidResultStars").textContent = "⭐️".repeat(stars) + "☆".repeat(3-stars);
document.getElementById("kidResultTitle").textContent = title;
document.getElementById("kidResultDetail").textContent = detail;
kidResultReplayFn = replay;
document.getElementById("kidResultScreen").style.display = "flex";
playSound("save");
vibrate([40]);
}

document.getElementById("childLevelBackBtn").addEventListener("click", ()=>{
document.getElementById("childLevelScreen").style.display = "none";
document.getElementById("modeScreen").style.display = "flex";
});
document.querySelectorAll(".mode-card[data-kidgroup]").forEach(card=>{
card.addEventListener("click", ()=>{
readingLevel = card.dataset.kidgroup === "pre" ? "pre" : "post";
try{ applyLevelDefaultThresholds(readingLevel); }catch(e){}
showIslandMap();
});
});
document.getElementById("childSoonBackBtn").addEventListener("click", ()=>{
hideAllKidScreens();
document.getElementById("childLevelScreen").style.display = "flex";
});
document.getElementById("childModeBackBtn").addEventListener("click", ()=>{
showIslandMap();
});
const parkGuard = (fn) => () => { try{ if(typeof gxOver === "function" && gxOver()){ hideAllKidScreens(); gxShowSleep(); return; } }catch(e){} fn(); };
document.getElementById("kidGameOddOneOutBtn").addEventListener("click", parkGuard(startOddOneOut));
document.getElementById("kidGameMemoryBtn").addEventListener("click", parkGuard(startMemoryGame));
document.getElementById("kidGameQuickTapBtn").addEventListener("click", parkGuard(startQuickTap));
document.getElementById("kidOddBackBtn").addEventListener("click", showChildModeScreen);
document.getElementById("kidMemoryBackBtn").addEventListener("click", ()=>{ clearInterval(kidMemoryTimerId); showChildModeScreen(); });
document.getElementById("kidQuickTapBackBtn").addEventListener("click", ()=>{ kidQuickTapActive = false; showChildModeScreen(); });
document.getElementById("kidPlayAgainBtn").addEventListener("click", ()=>{ if(kidResultReplayFn) kidResultReplayFn(); });
document.getElementById("kidBackToGamesBtn").addEventListener("click", showChildModeScreen);

let kidOddState = {};
const KID_ODD_ROUNDS_FULL = [4,4,6,6,9,9,12,12];
const KID_ODD_ROUNDS_PRE = [3,3,4,5,7];
function kidOddRounds(){ return isPre() ? KID_ODD_ROUNDS_PRE : KID_ODD_ROUNDS_FULL; }

function startOddOneOut(){ if(!imagesReady()){ imgWait(() => startOddOneOut()); return; }
hideAllKidScreens();
document.getElementById("kidOddOneOutScreen").style.display = "flex";
kidOddState = { round: 0, mistakes: 0, startTime: Date.now() };
renderOddRound();
}

function renderOddRound(){
const board = document.getElementById("kidOddBoard");
board.innerHTML = "";
const n = kidOddRounds()[kidOddState.round] || 12;
const baseShape = randomItem(SHAPES);
const baseColor = randomItem(COLORS);
let oddColor = baseColor, oddShape = baseShape;
if(Math.random() < 0.5){
do { oddColor = randomItem(COLORS); } while(oddColor === baseColor);
} else {
do { oddShape = randomItem(SHAPES); } while(oddShape === baseShape);
}
const oddIndex = Math.floor(Math.random()*n);
for(let i=0;i<n;i++){
const btn = document.createElement("button");
btn.className = "kid-shape-btn";
const isOdd = (i === oddIndex);
btn.innerHTML = shapeSVG(isOdd?oddShape:baseShape, isOdd?oddColor:baseColor);
btn.addEventListener("click", ()=> handleOddTap(isOdd, btn));
board.appendChild(btn);
}
document.getElementById("kidOddProgress").textContent = `${kidOddState.round+1} / ${kidOddRounds().length}`;
}

function handleOddTap(correct, btn){
if(correct){
btn.classList.add("kid-correct");
playSound("up");
vibrate([25]);
setTimeout(()=>{
kidOddState.round++;
if(kidOddState.round >= kidOddRounds().length){
finishOddOneOut();
} else {
renderOddRound();
}
}, 450);
} else {
kidOddState.mistakes++;
btn.classList.add("kid-wrong");
setTimeout(()=> btn.classList.remove("kid-wrong"), 350);
}
}

function finishOddOneOut(){
const seconds = ((Date.now() - kidOddState.startTime)/1000).toFixed(1);
const m = kidOddState.mistakes;
const stars = m === 0 ? 3 : m <= 2 ? 2 : 1;
showKidResult({
stars,
title: "Harika iş!",
detail: `${seconds} saniyede, ${m} yanlışla tamamladın.`,
replay: startOddOneOut
});
}

let kidMemoryState = {};
let kidMemoryTimerId = null;

function startMemoryGame(){ if(!imagesReady()){ imgWait(() => startMemoryGame()); return; }
hideAllKidScreens();
document.getElementById("kidMemoryScreen").style.display = "flex";
let icons;
if(isPre()){
icons = PRE_SHAPES.map((s,i)=>({shape:s, color:PRE_COLORS[i]}));
icons.push({shape: PRE_SHAPES[0], color: COLORS[4]});
} else {
icons = SHAPES.map((s,i)=>({shape:s, color:COLORS[i]}));
icons.push({shape: SHAPES[0], color: COLORS[4]});
}
const deck = [...icons, ...icons].map((icon,i)=>({...icon, id:i}));
for(let i=deck.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [deck[i],deck[j]]=[deck[j],deck[i]]; }
kidMemoryState = { deck, flipped: [], matched: new Set(), moves: 0, startTime: Date.now(), locked:false };
clearInterval(kidMemoryTimerId);
kidMemoryTimerId = setInterval(updateMemoryProgress, 500);
renderMemoryBoard();
updateMemoryProgress();
}

function updateMemoryProgress(){
const seconds = ((Date.now() - kidMemoryState.startTime)/1000).toFixed(0);
document.getElementById("kidMemoryProgress").textContent = `${kidMemoryState.moves} hamle · ${seconds} sn`;
}

function renderMemoryBoard(){ try{
const board = document.getElementById("kidMemoryBoard");
board.innerHTML = "";
kidMemoryState.deck.forEach((card, idx)=>{
const btn = document.createElement("button");
btn.className = "kid-memory-card";
btn.innerHTML = shapeSVG(card.shape, card.color);
btn.addEventListener("click", ()=> handleMemoryTap(idx, btn));
board.appendChild(btn);
});
}finally{ try{ zaTapRestore(); }catch(e){} } }

function handleMemoryTap(idx, btn){
if(kidMemoryState.locked) return;
if(kidMemoryState.matched.has(idx)) return;
if(kidMemoryState.flipped.some(f=>f.idx===idx)) return;
btn.classList.add("flipped");
kidMemoryState.flipped.push({idx, btn});
if(kidMemoryState.flipped.length === 2){
kidMemoryState.moves++;
const [a,b] = kidMemoryState.flipped;
const cardA = kidMemoryState.deck[a.idx], cardB = kidMemoryState.deck[b.idx];
if(cardA.shape === cardB.shape && cardA.color === cardB.color){
kidMemoryState.matched.add(a.idx);
kidMemoryState.matched.add(b.idx);
a.btn.classList.add("matched");
b.btn.classList.add("matched");
kidMemoryState.flipped = [];
playSound("up");
if(kidMemoryState.matched.size === kidMemoryState.deck.length){
setTimeout(finishMemoryGame, 400);
}
} else {
kidMemoryState.locked = true;
setTimeout(()=>{
a.btn.classList.remove("flipped");
b.btn.classList.remove("flipped");
kidMemoryState.flipped = [];
kidMemoryState.locked = false;
}, 700);
}
}
}

function finishMemoryGame(){
clearInterval(kidMemoryTimerId);
const seconds = ((Date.now() - kidMemoryState.startTime)/1000).toFixed(1);
const moves = kidMemoryState.moves;
const pairs = kidMemoryState.deck.length / 2;
const stars = moves <= Math.round(16*pairs/6) ? 3 : moves <= Math.round(22*pairs/6) ? 2 : 1;
showKidResult({
stars,
title: "Tüm eşleri buldun!",
detail: `${moves} hamlede, ${seconds} saniyede tamamladın.`,
replay: startMemoryGame
});
}

let kidQuickTapState = {};
let kidQuickTapActive = false;
function kidQuickTapRounds(){ return isPre() ? 5 : 8; }

function startQuickTap(){ if(!imagesReady()){ imgWait(() => startQuickTap()); return; }
hideAllKidScreens();
document.getElementById("kidQuickTapScreen").style.display = "flex";
kidQuickTapState = { round: 0, times: [] };
kidQuickTapActive = true;
document.getElementById("kidQuickTapProgress").textContent = `0 / ${kidQuickTapRounds()}`;
document.getElementById("kidQuickTapBoard").innerHTML = "";
setTimeout(spawnQuickTapTarget, 500);
}

function spawnQuickTapTarget(){
if(!kidQuickTapActive) return;
const board = document.getElementById("kidQuickTapBoard");
board.innerHTML = "";
const rect = board.getBoundingClientRect();
const margin = 40;
const x = margin + Math.random() * Math.max(1, rect.width - margin*2);
const y = margin + Math.random() * Math.max(1, rect.height - margin*2);
const target = document.createElement("button");
target.className = "kid-quicktap-target";
target.style.left = x + "px";
target.style.top = y + "px";
target.innerHTML = shapeSVG(randomItem(SHAPES), randomItem(COLORS));
const spawnTime = Date.now();
target.addEventListener("click", ()=>{
if(!kidQuickTapActive) return;
kidQuickTapState.times.push(Date.now() - spawnTime);
kidQuickTapState.round++;
playSound("up");
vibrate([20]);
document.getElementById("kidQuickTapProgress").textContent = `${kidQuickTapState.round} / ${kidQuickTapRounds()}`;
board.innerHTML = "";
if(kidQuickTapState.round >= kidQuickTapRounds()){
kidQuickTapActive = false;
setTimeout(finishQuickTap, 300);
} else {
setTimeout(spawnQuickTapTarget, 400 + Math.random()*500);
}
});
board.appendChild(target);
}

function finishQuickTap(){
const times = kidQuickTapState.times;
const avg = times.reduce((a,b)=>a+b,0) / times.length;
const best = Math.min(...times);
const stars = avg <= 700 ? 3 : avg <= 1100 ? 2 : 1;
showKidResult({
stars,
title: "Tüm turları tamamladın!",
detail: `Ortalama tepki süren ${(avg/1000).toFixed(2)} sn, en hızlın ${(best/1000).toFixed(2)} sn.`,
replay: startQuickTap
});
}

const AVATAR_COLORS = ["#2E6F6E","#C97F32","#3A6EA5","#4F9D5A","#8A5A8C","#2E5F8A","#D62839","#0072B2"];
function avatarColor(name){
let hash = 0;
for(let i=0;i<name.length;i++) hash = name.charCodeAt(i) + ((hash<<5)-hash);
return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
