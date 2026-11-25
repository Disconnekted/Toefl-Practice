// Offline support.
// App files open instantly from the saved copy. Each deploy gives this file a
// new SHELL_CACHE name, so the phone downloads the new version in the
// background, all files together, and uses it from the next launch.
// Audio clips and fonts: saved copy first.
const SHELL_CACHE = 'toefl-shell-v6';
const AUDIO_CACHE = 'toefl-audio';
const FONT_CACHE = 'toefl-fonts';
const SHELL = ['./', 'index.html', 'app.js', 'i18n.js', 'audio-key.js', 'data/content.js', 'data/awl.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'audio/index.json'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(cache =>
    Promise.all(SHELL.map(u => cache.add(new Request(u, { cache: 'reload' })).catch(() => { })))
  ).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k.startsWith('toefl-shell-') && k !== SHELL_CACHE).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

async function cacheFirst(request, cacheName, opts) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request, opts);
  if (hit) return hit;
  try {
    const res = await fetch(request);
    if (res && (res.ok || res.type === 'opaque')) cache.put(request, res.clone());
    return res;
  } catch (e) {
    if (request.mode === 'navigate') {
      const page = (await cache.match('index.html')) || (await cache.match('./'));
      if (page) return page;
    }
    throw e;
  }
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(req, FONT_CACHE)); return;
  }
  if (url.origin !== self.location.origin) return; // e.g. the Anthropic API: always live
  if (url.pathname.endsWith('.mp3')) { event.respondWith(cacheFirst(req, AUDIO_CACHE)); return; }
  event.respondWith(cacheFirst(req, SHELL_CACHE, { ignoreSearch: true }));
});
