
const putInCache = async (request, response) => {
    const cache = await caches.open("v1");
    await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) { return responseFromCache; }

    const preloadResponse = await preloadResponsePromise;

    if (preloadResponse) {
        putInCache(request, preloadResponse.clone());
        return preloadResponse;
    }

    try {
        const responseFromNetwork = await fetch(request);
        putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;

    } catch (error) {
        const fallbackResponse = await caches.match(fallbackUrl);

        if (fallbackResponse) {
            return fallbackResponse;
        }

        return new Response("Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });
    }

};


self.addEventListener("activate", (event) => {

    event.waitUntil(async () => {
        if (self.registration.navigationPreload) {
            await self.registration.navigationPreload.enable();
        }
    });

});


self.addEventListener("install", (event) => {

    event.waitUntil(async () => {
        const cache = await caches.open("v1");
        await cache.addAll(['/']);
    });

});


self.addEventListener("fetch", (event) => {
    if((event.request.url.indexOf('http') === 0)){ 
        event.respondWith(
            cacheFirst({
                request: event.request,
                preloadResponsePromise: event.preloadResponse,
                fallbackUrl: "/",
            })
        );
    }else{
        event.respondWith(fetch(event.request));
    }

});

self.addEventListener("activate", (event) => {

    event.waitUntil(async () => {

        const cacheKeepList = ["v2"];
        const keyList = await caches.keys();
        const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));

        await Promise.all(cachesToDelete.map(async () => {
            await caches.delete(key);
        }));

    });

});