const CACHE_NAME = "v1";
const ASSETS = [
    "/",
    "/public",
    "/private/todo.html",
];






// /////////////// WIP !!! /////////////////////

const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath.replace('public', '')); // relativ zum Serverroot
    }
  });
  return arrayOfFiles;
}

const urlsToCache = getAllFiles('./public');

// /////////////// WIP !!! /////////////////////









self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return cacheRes || fetch(event.request);
        })
    );
});
