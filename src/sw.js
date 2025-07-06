import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    /\/image(\/asset)?\/.*\.(?:png|jpg|jpeg|gif|svg)$/,
    new CacheFirst({
        cacheName: 'images-cache',
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7일
                maxEntries: 100,
                purgeOnQuotaError: true,
            }),
        ],
    })
);

registerRoute(
    /\.(?:mp3|wav|ogg|flac)$/,
    new CacheFirst({
        cacheName: 'audio-cache',
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 7 * 24 * 60 * 60,
                maxEntries: 30,
                purgeOnQuotaError: true,
            }),
        ],
    })
);