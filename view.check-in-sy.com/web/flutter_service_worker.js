'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "45a909dac919fad1a6e191c37545e124",
"assets/AssetManifest.bin.json": "35ee5b95ae110dda613a72c18c875607",
"assets/AssetManifest.json": "556f71b4c43811ae5a11037eb76b4a3b",
"assets/assets/image/1.jpg": "d05cf6e86bc0b183be2e54ceb8b2ea19",
"assets/assets/image/2.jpg": "0808697c0fbec940117b41d973cece89",
"assets/assets/image/3.jpg": "60b30f03d9b335e9af7d3bfc917136c4",
"assets/assets/image/4.jpg": "ff590dfac9bb93eaaf5ab68ed062f672",
"assets/assets/image/FINAL%2520FINAL%2520F-05.jpg": "754b60c64b6244ee706aa2ab2c19ae83",
"assets/assets/image/FINAL%2520FINAL%2520F-06.jpg": "efcc198cff000ec92ccf7746fb70121e",
"assets/assets/image/FINAL%2520FINAL%2520F-07.jpg": "4f625155ffd5a281e1c561a316434755",
"assets/assets/image/FINAL%2520FINAL%2520F-08.jpg": "dce71579ab6cd95ed8930e3039443eb3",
"assets/assets/image/FINAL%2520FINAL%2520F-09.jpg": "eabaaedd37b0ce09c4d11ff49b018159",
"assets/assets/image/FINAL%2520FINAL%2520F-10.jpg": "27a365f7b55245dd2a7093d81177b8ba",
"assets/assets/image/FINAL%2520FINAL%2520F-11.jpg": "e8c3ac5fbcd1cdec3c33a53a3f2b8662",
"assets/assets/image/FINAL%2520FINAL%2520F-12.jpg": "9c6eccefbc30935eb877f63540ffdb49",
"assets/assets/image/FINAL%2520FINAL%2520F-13.jpg": "84b70e55b35d975a30563c600759221e",
"assets/assets/image/FINAL%2520FINAL%2520F-14.jpg": "5753bad03c00f2456237bff0e9601876",
"assets/assets/image/FINAL%2520FINAL%2520F-15.jpg": "331725a7a043547e4c832a1730a291b7",
"assets/assets/image/FINAL%2520FINAL%2520F-16.jpg": "9d2b54d00c241887a1d4f6056e98c776",
"assets/assets/image/FINAL%2520FINAL%2520F-17.jpg": "13625f9837dee0df132dd1a7eaa581c7",
"assets/assets/image/FINAL%2520FINAL%2520F-18.jpg": "5e8ee06c20c69d535f212c9196a1d6de",
"assets/assets/image/FINAL%2520FINAL%2520F-19.jpg": "888118cd963d48ab323a936ca1e2760c",
"assets/assets/image/home.png": "34cfb70d0935aa73581d5c003cd1de47",
"assets/assets/image/logo%2520white.png": "df8b9525c32d9affdb6f7a47e1aa4df3",
"assets/assets/Video/notfi.mp4": "aae5e05ff6770b5bfef863e21505620a",
"assets/assets/Video/pay.mp4": "1834fac9f77f765e0465229a744e9452",
"assets/assets/Video/profile.mp4": "68ff0c9d6c52c05223e1cc066e8932b1",
"assets/assets/Video/splash.mp4": "7f0a0d25d9f844bc8c0bf32796777a36",
"assets/assets/Video/trackingV.mp4": "9a08b2c80325af24cb5e2f2165cae10e",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "31c751d24c471710f3583abd2f77c0bd",
"assets/NOTICES": "e30014c8f7cd497e9d2ab4e7b999876d",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "140ccb7d34d0a55065fbd422b843add6",
"canvaskit/canvaskit.js.symbols": "58832fbed59e00d2190aa295c4d70360",
"canvaskit/canvaskit.wasm": "07b9f5853202304d3b0749d9306573cc",
"canvaskit/chromium/canvaskit.js": "5e27aae346eee469027c80af0751d53d",
"canvaskit/chromium/canvaskit.js.symbols": "193deaca1a1424049326d4a91ad1d88d",
"canvaskit/chromium/canvaskit.wasm": "24c77e750a7fa6d474198905249ff506",
"canvaskit/skwasm.js": "1ef3ea3a0fec4569e5d531da25f34095",
"canvaskit/skwasm.js.symbols": "0088242d10d7e7d6d2649d1fe1bda7c1",
"canvaskit/skwasm.wasm": "264db41426307cfc7fa44b95a7772109",
"canvaskit/skwasm_heavy.js": "413f5b2b2d9345f37de148e2544f584f",
"canvaskit/skwasm_heavy.js.symbols": "3c01ec03b5de6d62c34e17014d1decd3",
"canvaskit/skwasm_heavy.wasm": "8034ad26ba2485dab2fd49bdd786837b",
"favicon.png": "f22a1ece852fab6aaeb04874293f77e9",
"flutter.js": "888483df48293866f9f41d3d9274a779",
"flutter_bootstrap.js": "981be4062e80f4863be25bbf46f6ced6",
"icons/Icon-192.png": "c416e5c6ff5bc342bc34a2dc53f0f542",
"icons/Icon-512.png": "b3b211e6a046919bf5877dd2ec158045",
"icons/Icon-maskable-192.png": "c416e5c6ff5bc342bc34a2dc53f0f542",
"icons/Icon-maskable-512.png": "b3b211e6a046919bf5877dd2ec158045",
"index.html": "5feb199ae2a78fdf721573113924f1d5",
"/": "5feb199ae2a78fdf721573113924f1d5",
"main.dart.js": "dde6444efe57a7f574f48028ee248ff8",
"manifest.json": "765c8eb1b202d4dddc8003029185c8d9",
"version.json": "797fc1d7f45954e87af387a3a4c6583d"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
