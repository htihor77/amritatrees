const staticCacheName = 'site-static-v1'
const dynamicCacheName = 'site-dynamic-v1'
const assets = [
  // "/",
  // "/js/app.js",
  // "/style.css",
  // "/fallback.html"
  // "/inventory"
];

const limitCacheSize = (name, size) => {
  caches.open(name).then(cache=>{
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    })
  })
}

// install sw
self.addEventListener("install", (evt)=>{
    console.log("service worker has been installed");
    evt.waitUntil(
        caches.open(staticCacheName).then(cache=>{
            console.log("caching shell assets");
            cache.addAll(assets);
        })
    )
});

// activate sw
self.addEventListener("activate", (evt)=>{
    console.log("service worker has been activated");
    evt.waitUntil(
        caches.keys().then(keys=>{
          //console.log(keys);
          return Promise.all(keys
              .filter(key => key !== staticCacheName && key !== dynamicCacheName)
              .map(key => caches.delete(key))
            )
        })
    );
});

//fetch sw
self.addEventListener("fetch", (evt)=>{
  if(evt.request.url.indexOf("https://amritatrees.glitch.me") != -1){
    console.log("fetch event", evt.request.url.split("https://amritatrees.glitch.me")[1]);
  }else{
    console.log("fetch event", evt.request.url);    
  }
    // evt.respondWith(
    //     caches.match(evt.request).then(cacheResponse => {
    //         return cacheResponse || fetch(evt.request).then(fetchResponse => {
    //           return caches.open(dynamicCacheName).then(cache=>{
    //             cache.put(evt.request.url, fetchResponse.clone());
    //             limitCacheSize(dynamicCacheName, 15);
    //             return fetchResponse;
    //           })
    //         });
    //     }).catch( () => {
    //       if(evt.request.url.includes(".html")){
    //         return caches.match('fallback.html');
    //       }
    //     })
    // );
});