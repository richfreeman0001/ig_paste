const CACHE_NAME = 'ig-spacer-v2'; // 版本號改一下，強制瀏覽器更新
const ASSETS = [
    './',
    './index.html',
    './css/style.css',       // 改了
    './js/script.js',        // 改了
    './manifest.json',
    './images/icon-192.png', // 改了
    './images/icon-512.png', // 改了
    './images/preview.jpg',  // 建議把這張大圖也快取起來
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

// 加入自動清除舊快取的邏輯 (更新結構後這很重要)
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
});