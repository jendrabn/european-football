importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: 1 },
    { url: '/competition.html', revision: 1 },
    { url: '/saved.html', revision: 1 },
    { url: '/manifest.json', revision: 1 },
    { url: '/css/style.css', revision: 1 },
    { url: '/vendor/idb-2.1.3/idb.js', revision: 1 },
    { url: '/vendor/materialize/js/materialize.min.js', revision: 1 },
    { url: '/img/404.png', revision: 1 },
    { url: '/img/logo-144.png', revision: 1 },
    { url: '/img/logo-192.png', revision: 1 },
    { url: '/img/logo-512.png', revision: 1 },
    { url: '/img/liga/liga-belanda.png', revision: 1 },
    { url: '/img/liga/liga-champions.png', revision: 1 },
    { url: '/img/liga/liga-inggris.png', revision: 1 },
    { url: '/img/liga/liga-jerman.png', revision: 1 },
    { url: '/img/liga/liga-perancis.png', revision: 1 },
    { url: '/img/liga/liga-spanyol.png', revision: 1 },
    { url: '/js/components/CardLeague.js', revision: 1 },
    { url: '/js/components/Footer.js', revision: 1 },
    { url: '/js/components/Navbar.js', revision: 1 },
    { url: '/js/api.js', revision: 1 },
    { url: '/js/db.js', revision: 1 },
    { url: '/js/main.js', revision: 1 }

], {
    ignoreURLParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|js|css)$/,
    new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-webfonts',
    })
);

workbox.routing.registerRoute(
    /^https:\/\/upload\.wikimedia\.org/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'team-images',
    })
);

workbox.routing.registerRoute(
    /^https:\/\/api\.football-data\.org\/v2/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'football-data'
    })
);

self.addEventListener('push', event => {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    const options = {
        body: body,
        icon: '/img/logo-512.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});

