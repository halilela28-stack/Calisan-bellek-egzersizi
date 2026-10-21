/* Zihin Atölyesi · service worker
   Amaç: ikinci açılışlar tamamen cihazdan gelsin, uygulama çevrimdışı da açılsın; güncellemeler HTML üzerinden gelsin.
   - Çekirdek (HTML, uygulama betiği, manifest) kurulumda önbelleğe alınır.
   - HTML: önce ağ (4 sn), ağ yoksa önbellek.
   - Betikler (zihin-*.js) ve resim dosyaları: önce önbellek; yoksa ağdan alınıp saklanır; aynı dosyanın eski sürümleri silinir.
   - Diğer aynı kaynaklı istekler: önbellekten ver, arkada yenile.
   Sürüm değişince (SW_VERSION) eski önbellekler temizlenir. */
const SW_VERSION = "2026.10.21-b";
const CACHE = "za-" + SW_VERSION;
const CORE = ["./zihin-atolyesi.html", "./zihin-app.js", "./manifest.json"];
const HTML_TIMEOUT_MS = 4000;

self.addEventListener("install", (ev) => {
  ev.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(CORE.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))); /* eski service worker önbellekleri dâhil hepsi temizlenir */
    await self.clients.claim();
  })());
});

const sameOrigin = (url) => url.origin === self.location.origin;
const isHtml = (req, url) => req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("/");
const isScript = (url) => /\/zihin-[\w-]+\.js$/.test(url.pathname);

/* Aynı yolun (sorgu dışı) eski kopyalarını sil: zihin-gorsel-1.js?v=eski gibi */
async function pruneOld(cache, url){
  const keys = await cache.keys();
  await Promise.all(keys.filter(r => { const u = new URL(r.url); return u.pathname === url.pathname && u.search !== url.search; }).map(r => cache.delete(r)));
}

async function networkFirstHtml(req){
  const cache = await caches.open(CACHE);
  try{
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), HTML_TIMEOUT_MS);
    const res = await fetch(req.url, { signal: ctrl.signal, cache: "no-cache", credentials: "same-origin" }); clearTimeout(t); /* HTML her açılışta sunucuya sorulur (GitHub Pages'in 10 dakikalık önbelleği atlanır) */
    if(res && res.ok){ cache.put("./zihin-atolyesi.html", res.clone()); }
    return res;
  }catch(e){
    const hit = (await cache.match(req, { ignoreSearch: true })) || (await cache.match("./zihin-atolyesi.html"));
    return hit || new Response("<h1>Çevrimdışı</h1><p>Zihin Atölyesi henüz bu cihaza kaydedilmemiş. İnternete bağlanıp bir kez açın.</p>", { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 503 });
  }
}

async function cacheFirst(req, url){
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if(hit) return hit;
  const res = await fetch(req);
  if(res && res.ok){ await cache.put(req, res.clone()); pruneOld(cache, url); }
  return res;
}

async function staleWhileRevalidate(req){
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  const refresh = fetch(req).then(res => { if(res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
  return hit || (await refresh) || new Response("", { status: 504 });
}

self.addEventListener("fetch", (ev) => {
  const req = ev.request; if(req.method !== "GET") return;
  const url = new URL(req.url); if(!sameOrigin(url)) return;
  if(isHtml(req, url)) ev.respondWith(networkFirstHtml(req));
  else if(isScript(url)) ev.respondWith(cacheFirst(req, url));
  else ev.respondWith(staleWhileRevalidate(req));
});

self.addEventListener("message", (ev) => { if(ev.data === "skipWaiting") self.skipWaiting(); });
