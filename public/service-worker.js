self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (!navigator.onLine) {
    event.respondWith(
      new Response('Ви офлайн, деякі дії недоступні. Please reconnect to continue.', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      })
    );
  }
});
