const CACHE_NAME = 'void_management_storage';

self.addEventListener("activate", event => {
    event.waitUntil(caches.keys().then(keyList =>
        Promise.all(keyList.map(key => {
            if (key !== CACHE_NAME) {
                return caches.delete(key);
            }
        }))
    ));
});


self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(CACHE_NAME).then(function (cache) { cache.addAll(['/']); }));
});

self.addEventListener('fetch', function (event) {

    event.respondWith((async () => {
        const cacheMatch = await caches.match(event.request);
        if (cacheMatch) {
            return cacheMatch;
        }

        // if (cacheMatch && cacheMatch.headers.has('Date')) {
        //     const cacheDate = new Date(cacheMatch.headers.has('Date'));
        //     if (Date.now() > cacheDate.getTime() + 60000 * 1) {
        //         return cacheMatch;
        //     }
        // }

        const response = await fetch(event.request);
        const url = event.request.url;

        const cannotBeCached = url.startsWith('chrome-extension') || url.includes('extension')
            || !(url.indexOf('http') === 0) || !response || response.status !== 200 || response.type !== 'basic';

        if (cannotBeCached) {
            return response;
        }

        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, response.clone());
        return response;

    })());

});