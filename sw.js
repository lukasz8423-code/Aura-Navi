const CACHE="aura-navi-v30";
const SHELL=["./","./index.html","./style.css","./app.js","./manifest.webmanifest"];
self.addEventListener("install",event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.all(SHELL.map(async path=>{try{const response=await fetch(path,{cache:"reload"});if(response.ok)await cache.put(path,response);}catch(_){}}));await self.skipWaiting();})()));
self.addEventListener("activate",event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith("aura-navi-")&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim();})()));
self.addEventListener("fetch",event=>{
 const request=event.request;if(request.method!=="GET")return;
 const url=new URL(request.url);if(url.origin!==self.location.origin)return;
 const path=url.pathname;const isShell=request.mode==="navigate"||/\/(index\.html|app\.js|style\.css|manifest\.webmanifest|sw\.js)$/.test(path);
 if(!isShell)return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(request,{cache:"no-store"});if(response.ok){const cleanUrl=new URL(request.url);cleanUrl.search="";await cache.put(cleanUrl.pathname.endsWith("/")?"./":cleanUrl.pathname,response.clone());}return response;}catch(_){return await cache.match(request,{ignoreSearch:true})||await cache.match("./index.html")||Response.error();}})());
});