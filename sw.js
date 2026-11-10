/* App shell is cached for offline opening; editions are fetched fresh and fall back to the last copy. */
var CACHE='edition-v1', SHELL=['./','index.html','manifest.webmanifest','icons/icon.svg'];
self.addEventListener('install',function(e){ e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener('activate',function(e){ e.waitUntil(caches.keys().then(function(k){ return Promise.all(k.filter(function(n){ return n!==CACHE; }).map(function(n){ return caches.delete(n); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch',function(e){
  var u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin) return;
  var key=u.origin+u.pathname;
  e.respondWith(fetch(e.request).then(function(r){
    if(r&&r.ok){ var copy=r.clone(); caches.open(CACHE).then(function(c){ c.put(key,copy); }); }
    return r;
  }).catch(function(){ return caches.match(key).then(function(m){ return m||caches.match('index.html'); }); }));
});
