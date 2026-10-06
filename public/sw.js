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

const SAPPHIRE_PREFIX = "/~/sx/";
const clientToExtId = new Map();

function getExtIdFromReferrer(referrer) {
	if (!referrer) return null;
	try {
		const refUrl = new URL(referrer);
		if (refUrl.pathname.startsWith(SAPPHIRE_PREFIX)) {
			const rest = refUrl.pathname.slice(SAPPHIRE_PREFIX.length);
			const slash = rest.indexOf("/");
			const extId = slash === -1 ? rest : rest.slice(0, slash);
			return extId || null;
		}
	} catch (e) {}
	return null;
}

function guessMime(path) {
	const ext = (path || "").split(".").pop()?.toLowerCase() || "";
	const map = {
		html: "text/html",
		htm: "text/html",
		js: "application/javascript",
		mjs: "application/javascript",
		css: "text/css",
		json: "application/json",
		png: "image/png",
		jpg: "image/jpeg",
		jpeg: "image/jpeg",
		gif: "image/gif",
		svg: "image/svg+xml",
		webp: "image/webp",
		ico: "image/x-icon",
		woff: "font/woff",
		woff2: "font/woff2",
		ttf: "font/ttf",
		wasm: "application/wasm",
	};
	return map[ext] || "application/octet-stream";
}

let sapphireDbPromise = null;
function ensureSapphireStores(db) {
	if (!db.objectStoreNames.contains("extensions")) {
		db.createObjectStore("extensions", { keyPath: "id" });
	}
	if (!db.objectStoreNames.contains("extension_files")) {
		db.createObjectStore("extension_files");
	}
	if (!db.objectStoreNames.contains("extension_storage")) {
		db.createObjectStore("extension_storage");
	}
}

function openSapphireDB() {
	if (sapphireDbPromise) return sapphireDbPromise;
	sapphireDbPromise = new Promise((resolve) => {
		if (typeof indexedDB === "undefined") return resolve(null);
		try {
			const req = indexedDB.open("sapphire_extensions");
			req.onupgradeneeded = () => {
				ensureSapphireStores(req.result);
			};
			req.onsuccess = () => {
				const db = req.result;
				db.onversionchange = () => {
					db.close();
					sapphireDbPromise = null;
				};
				if (
					db.objectStoreNames.contains("extensions") &&
					db.objectStoreNames.contains("extension_files") &&
					db.objectStoreNames.contains("extension_storage")
				) {
					resolve(db);
					return;
				}
				const nextVersion = (db.version || 1) + 1;
				db.close();
				const upgradeReq = indexedDB.open("sapphire_extensions", nextVersion);
				upgradeReq.onupgradeneeded = () => {
					ensureSapphireStores(upgradeReq.result);
				};
				upgradeReq.onsuccess = () => {
					const udb = upgradeReq.result;
					udb.onversionchange = () => {
						udb.close();
						sapphireDbPromise = null;
					};
					resolve(udb);
				};
				upgradeReq.onerror = () => {
					sapphireDbPromise = null;
					resolve(null);
				};
			};
			req.onerror = () => {
				sapphireDbPromise = null;
				resolve(null);
			};
		} catch (e) {
			sapphireDbPromise = null;
			resolve(null);
		}
	});
	return sapphireDbPromise;
}

async function getExtensionFile(extId, filePath) {
	try {
		const db = await openSapphireDB();
		if (!db || !db.objectStoreNames.contains("extension_files")) return null;
		return new Promise((resolve) => {
			try {
				const tx = db.transaction("extension_files", "readonly");
				const store = tx.objectStore("extension_files");
				const key = `${extId}/${filePath.replace(/^\//, "")}`;
				const req = store.get(key);
				req.onsuccess = () => resolve(req.result || null);
				req.onerror = () => resolve(null);
			} catch (err) {
				resolve(null);
			}
		});
	} catch (e) {
		return null;
	}
}

async function findExtensionFile(filePath, preferredExtId) {
	try {
		const db = await openSapphireDB();
		if (!db || !db.objectStoreNames.contains("extension_files")) return null;
		const clean = filePath.replace(/^\//, "");

		// 1. If preferredExtId is provided, try that first
		if (preferredExtId) {
			const bytes = await new Promise((resolve) => {
				try {
					const tx = db.transaction("extension_files", "readonly");
					const store = tx.objectStore("extension_files");
					const req = store.get(`${preferredExtId}/${clean}`);
					req.onsuccess = () => resolve(req.result || null);
					req.onerror = () => resolve(null);
				} catch (e) {
					resolve(null);
				}
			});
			if (bytes) return { extId: preferredExtId, bytes };
		}

		// 2. Search all keys in extension_files store
		const allKeys = await new Promise((resolve) => {
			try {
				const tx = db.transaction("extension_files", "readonly");
				const store = tx.objectStore("extension_files");
				const req = store.getAllKeys();
				req.onsuccess = () => resolve(req.result || []);
				req.onerror = () => resolve([]);
			} catch (e) {
				resolve([]);
			}
		});

		for (const key of allKeys) {
			if (typeof key === "string" && (key.endsWith("/" + clean) || key === clean)) {
				const slash = key.indexOf("/");
				const foundExtId = slash === -1 ? "" : key.slice(0, slash);
				const bytes = await new Promise((resolve) => {
					try {
						const tx = db.transaction("extension_files", "readonly");
						const store = tx.objectStore("extension_files");
						const req = store.get(key);
						req.onsuccess = () => resolve(req.result || null);
						req.onerror = () => resolve(null);
					} catch (e) {
						resolve(null);
					}
				});
				if (bytes) {
					return { extId: foundExtId, bytes };
				}
			}
		}

		return null;
	} catch (e) {
		return null;
	}
}

async function handleSapphireRequest(url) {
	const pathname = url.pathname || "";
	if (!pathname.startsWith(SAPPHIRE_PREFIX)) return null;

	if (pathname.endsWith("/__bootstrap__")) {
		return new Response("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Sapphire Extension</title></head><body></body></html>", {
			status: 200,
			headers: { "Content-Type": "text/html" },
		});
	}

	const rest = pathname.slice(SAPPHIRE_PREFIX.length);
	const slash = rest.indexOf("/");
	if (slash === -1) return null;
	const extId = rest.slice(0, slash);
	const filePath = decodeURIComponent(rest.slice(slash + 1));
	if (!extId || !filePath) return null;

	const bytes = await getExtensionFile(extId, filePath);
	if (bytes) {
		return new Response(bytes, {
			status: 200,
			headers: { "Content-Type": guessMime(filePath) },
		});
	}
	return null;
}

async function handleRequest(event) {
	try {
		const url = new URL(event.request.url);
		const pathname = url.pathname || "";

		// Handle chrome-extension:// scheme if requested directly
		if (url.protocol === "chrome-extension:") {
			const extId = url.hostname;
			const filePath = decodeURIComponent(url.pathname.replace(/^\//, ""));
			const bytes = await getExtensionFile(extId, filePath);
			if (bytes) {
				return new Response(bytes, {
					status: 200,
					headers: { "Content-Type": guessMime(filePath) },
				});
			}
		}

		// Extract extId if we can from the path
		let extIdFromPath = null;
		if (pathname.startsWith(SAPPHIRE_PREFIX)) {
			const rest = pathname.slice(SAPPHIRE_PREFIX.length);
			const slash = rest.indexOf("/");
			extIdFromPath = slash === -1 ? rest : rest.slice(0, slash);
		}

		// Save mapping of clientId/resultingClientId to extId
		const cid = event.clientId;
		const rcid = event.resultingClientId;

		if (extIdFromPath) {
			if (rcid) clientToExtId.set(rcid, extIdFromPath);
			if (cid) clientToExtId.set(cid, extIdFromPath);
		}

		// Also check referrer as a fallback to map client
		const refExtId = getExtIdFromReferrer(event.request.referrer);
		if (refExtId) {
			if (cid) clientToExtId.set(cid, refExtId);
			if (rcid) clientToExtId.set(rcid, refExtId);
		}

		// Resolve from sapphire extension path directly (/~/sx/<extId>/...)
		if (pathname.startsWith(SAPPHIRE_PREFIX)) {
			const sResp = await handleSapphireRequest(url);
			if (sResp) return sResp;
		}

		// Check if this request is for an extension-local bundled file (e.g. /rulesets/*.json or /manifest.json)
		const mappedExtId = (cid ? clientToExtId.get(cid) : null) || refExtId;
		const cleanPath = pathname.replace(/^\//, "");

		const isInternalPath =
			pathname.startsWith("/scram/") ||
			pathname.startsWith("/baremux/") ||
			pathname.startsWith("/epoxy/") ||
			pathname.startsWith("/libcurl/") ||
			pathname.startsWith("/baremod/") ||
			pathname.startsWith("/assets/") ||
			pathname.startsWith("/bare/") ||
			pathname.startsWith("/wisp/") ||
			pathname.startsWith("/api/") ||
			pathname.startsWith("/socket.io/") ||
			pathname === "/sw.js" ||
			pathname === "/index.html" ||
			pathname === "/" ||
			pathname === "/data.tsx" ||
			pathname === "/data.js";

		if (!isInternalPath && cleanPath) {
			const fileRes = await findExtensionFile(cleanPath, mappedExtId);
			if (fileRes && fileRes.bytes) {
				if (cid && fileRes.extId) clientToExtId.set(cid, fileRes.extId);
				return new Response(fileRes.bytes, {
					status: 200,
					headers: { "Content-Type": guessMime(cleanPath) },
				});
			}
		}

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

scramjet.addEventListener("request", (e) => {
	if (e.url && (e.url.protocol === "chrome-extension:" || (e.url.pathname && e.url.pathname.startsWith(SAPPHIRE_PREFIX)))) {
		e.response = (async () => {
			let extId = "";
			let filePath = "";
			if (e.url.protocol === "chrome-extension:") {
				extId = e.url.hostname;
				filePath = decodeURIComponent(e.url.pathname.replace(/^\//, ""));
			} else {
				const rest = e.url.pathname.slice(SAPPHIRE_PREFIX.length);
				const slash = rest.indexOf("/");
				if (slash !== -1) {
					extId = rest.slice(0, slash);
					filePath = decodeURIComponent(rest.slice(slash + 1));
				}
			}
			if (extId && filePath) {
				const bytes = await getExtensionFile(extId, filePath);
				if (bytes) {
					const mime = guessMime(filePath);
					const headers = { "content-type": mime };
					const resp = new Response(bytes, { status: 200, headers });
					resp.rawHeaders = headers;
					resp.rawResponse = {
						body: bytes,
						headers: headers,
						status: 200,
						statusText: "OK",
					};
					resp.finalURL = e.url.toString();
					return resp;
				}
			}
			const resp = await handleSapphireRequest(e.url);
			if (resp) {
				const headers = {};
				resp.headers.forEach((val, key) => {
					headers[key] = val;
				});
				resp.rawHeaders = headers;
				resp.rawResponse = {
					body: resp.body,
					headers: headers,
					status: resp.status,
					statusText: resp.statusText,
				};
				resp.finalURL = e.url.toString();
				return resp;
			}
			return new Response("Extension resource not found", { status: 404 });
		})();
		return;
	}

	if (playgroundData && e.url.href.startsWith(playgroundData.origin)) {
		const headers = {};
		const origin = playgroundData.origin;
		if (e.url.href === origin + "/") {
			headers["content-type"] = "text/html";
			e.response = new Response(playgroundData.html, {
				headers,
			});
		} else if (e.url.href === origin + "/style.css") {
			headers["content-type"] = "text/css";
			e.response = new Response(playgroundData.css, {
				headers,
			});
		} else if (e.url.href === origin + "/script.js") {
			headers["content-type"] = "application/javascript";
			e.response = new Response(playgroundData.js, {
				headers,
			});
		} else {
			e.response = new Response("empty response", {
				headers,
			});
		}
		e.response.rawHeaders = headers;
		e.response.rawResponse = {
			body: e.response.body,
			headers: headers,
			status: e.response.status,
			statusText: e.response.statusText,
		};
		e.response.finalURL = e.url.toString();
	} else {
		return;
	}
});
