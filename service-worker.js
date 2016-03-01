// thanks Jake! https://github.com/jakearchibald/simple-serviceworker-tutorial/blob/gh-pages/sw.js
var currentCache = 'REPEATE_TODO_v2';

// Chrome's currently missing some useful cache methods,
// this polyfill adds them.
polyfillCache();

// Here comes the install event!
// This only happens once, when the browser sees this
// version of the ServiceWorker for the first time.
self.addEventListener('install', function onServiceWorkerInstall(event) {
  console.log('install event', event);
  // We pass a promise to event.waitUntil to signal how 
  // long install takes, and if it failed
  event.waitUntil(
    // We open a cache…
    caches.open(currentCache).then(function(cache) {
      // And add resources to it
      return cache.addAll([
        './',
        'favicon.png',
      ]);
    })
  );
});

// The fetch event happens for the page request with the
// ServiceWorker's scope, and any request made within that
// page
self.addEventListener('fetch', function onServiceWorkerFetch(event) {
  console.log('fetch event', event);
  // Calling event.respondWith means we're in charge
  // of providing the response. We pass in a promise
  // that resolves with a response object
  event.respondWith(
    // First we look for something in the caches that
    // matches the request
    caches.match(event.request).then(function(response) {
      // If we get something, we return it, otherwise
      // it's null, and we'll pass the request to
      // fetch, which will use the network.
      return response || fetch(event.request);
    })
  );
});

// delete all older caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (currentCache !== key) {
          return caches.delete(key);
        }
      }));
    })
  );
});


function polyfillCache() {
  if (!Cache.prototype.add) {
    Cache.prototype.add = function add(request) {
      return this.addAll([request]);
    };
  }

  if (!Cache.prototype.addAll) {
    Cache.prototype.addAll = function addAll(requests) {
      var cache = this;

      // Since DOMExceptions are not constructable:
      function NetworkError(message) {
        this.name = 'NetworkError';
        this.code = 19;
        this.message = message;
      }
      NetworkError.prototype = Object.create(Error.prototype);

      return Promise.resolve().then(function() {
        if (arguments.length < 1) throw new TypeError();

        // Simulate sequence<(Request or USVString)> binding:
        var sequence = [];

        requests = requests.map(function(request) {
          if (request instanceof Request) {
            return request;
          }
          else {
            return String(request); // may throw TypeError
          }
        });

        return Promise.all(
          requests.map(function(request) {
            if (typeof request === 'string') {
              request = new Request(request);
            }

            var scheme = new URL(request.url).protocol;

            if (scheme !== 'http:' && scheme !== 'https:') {
              throw new NetworkError("Invalid scheme");
            }

            return fetch(request.clone());
          })
        );
      }).then(function(responses) {
        // TODO: check that requests don't overwrite one another
        // (don't think this is possible to polyfill due to opaque responses)
        return Promise.all(
          responses.map(function(response, i) {
            return cache.put(requests[i], response);
          })
        );
      }).then(function() {
        return undefined;
      });
    };
  }

  if (!CacheStorage.prototype.match) {
    // This is probably vulnerable to race conditions (removing caches etc)
    CacheStorage.prototype.match = function match(request, opts) {
      var caches = this;

      return this.keys().then(function(cacheNames) {
        var match;

        return cacheNames.reduce(function(chain, cacheName) {
          return chain.then(function() {
            return match || caches.open(cacheName).then(function(cache) {
              return cache.match(request, opts);
            }).then(function(response) {
              match = response;
              return match;
            });
          });
        }, Promise.resolve());
      });
    };
  }
}
