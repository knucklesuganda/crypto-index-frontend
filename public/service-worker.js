const CACHE_NAME = 'void_management_cache';

self.addEventListener("activate", event => {
    event.waitUntil(caches.keys().then(keyList =>
        Promise.all(keyList.map(key => {
            if (key !== CACHE_NAME) {
                return caches.delete(key);
            }
        })))
    );
});


self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
        cache.addAll([
            '/',
            '/product/index/0xDBCFC1Ec8aF08aB1943aD6dEf907BD0f0b7C4fE0',
            '/product/index/0x7212569605978ce4cC26489611df873706fbc2A1',
        ]);
    }));
});

self.addEventListener('fetch', function (event) {

    event.respondWith((async () => {
        const cacheMatch = await caches.match(event.request);

        if (cacheMatch) {
            return cacheMatch;
        }

        const response = await fetch(event.request);
        const url = event.request.url;

        const cannotBeCached = url.startsWith('chrome-extension') || url.includes('extension')
            || !(url.indexOf('http') === 0) || !response || response.status !== 200 || response.type !== 'basic';

        if (cannotBeCached) {
            return response;
        }

        const cache = await caches.open(CACHE_NAME);

        console.log(123, new Response(response.clone(), {headers: { 'content-type': 'application/json', 'date': new Date() }}));

        await cache.put(event.request, response.clone());
        return response;

    })());

});