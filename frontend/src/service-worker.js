const CACHE_NAME = 'movie-news-cache-v1';

// Basic initial installation
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                './',
                './index.html',
            ]);
        })
    );
});

self.addEventListener('activate', () => {
    console.log('News Service Worker natively enabled.');
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // CRITICAL EXCLUSION RULE: If the request is internal to the Webpack Dev Server, 
    // we let it pass through the cable without touching it to prevent tab reload.
    if (url.port === '8080' || url.pathname.includes('hot-update') || url.pathname === '/ws') {
        return;
    }

    // We intercept ONLY the calls destined for the backend (port 7070)
    if (url.pathname === '/api/news') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // If the backend returns a 500, we force the jump to the catch block to use the historical cache
                    if (!response.ok) {
                        throw new Error('Server error 500');
                    }
                    // If the backend responds correctly, we save a fresh copy in the local storage
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(async () => {
                    // If the server is down, we rescue the saved JSON from the memory
                    const cachedResponse = await caches.match(event.request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // If there's nothing in the cache, we return a controlled state to activate the mockup
                    return new Response(JSON.stringify({ status: 'error' }), { status: 500 });
                })
        );
    }
});
