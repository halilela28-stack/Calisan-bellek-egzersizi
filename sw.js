// Zihin Atölyesi - basit çevrimdışı destek.
// Strateji: çevrimiçiyken her zaman ağdan taze içerik çek (ve önbelleğe kopyala);
// yalnızca ağ başarısız olursa (çevrimdışıysa) son önbelleğe alınan sürümü göster.
// Firebase/harici istekler hiç dokunulmadan doğrudan ağa gider.
const CACHE_NAME = "zihin-atolyesi-v1";
const APP_SHELL = ["./zihin-atolyesi.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Firebase/gstatic vb. ağa aynen gitsin

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
