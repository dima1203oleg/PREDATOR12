self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Provide a gentle offline notice only for navigation requests to avoid
  // interfering with API calls, non-GET methods, or cross-origin assets.
  if (!navigator.onLine && event.request.mode === 'navigate') {
    event.respondWith(
      new Response('Ви офлайн, деякі дії недоступні. Please reconnect to continue.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      })
    );
  }
});
