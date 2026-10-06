/// <reference path="../lib/index.d.ts" />

// dumb hack to allow firefox to work (please dont do this in prod)
if (navigator.userAgent.includes("Firefox")) {
	Object.defineProperty(globalThis, "crossOriginIsolated", {
		value: true,
		writable: false,
	});
}

importScripts("/safe-postmessage.js");
importScripts("/scram/scramjet.all.js");
const loadWorker = self.$scramjetLoadWorker || globalThis.$scramjetLoadWorker || (typeof $scramjetLoadWorker !== "undefined" ? $scramjetLoadWorker : null);
if (!loadWorker) {
	throw new Error("Scramjet worker loader ($scramjetLoadWorker) is not defined.");
}
const { ScramjetServiceWorker } = loadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim());
});

async function handleRequest(event) {
	try {
		await scramjet.loadConfig();
		if (scramjet.route(event)) {
			return await scramjet.fetch(event);
		}
	} catch (e) {
		console.error("SW handleRequest error:", e);
	}

	return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event));
});

let playgroundData;
self.addEventListener("message", ({ data }) => {
	if (data.type === "playgroundData") {
		playgroundData = data;
	}
});
