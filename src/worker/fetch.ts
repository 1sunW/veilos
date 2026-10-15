import BareClient, { BareResponseFetch } from "@mercuryworkshop/bare-mux";
import { MessageW2C, ScramjetServiceWorker } from "@/worker";
import { renderError } from "@/worker/error";
import { FakeServiceWorker } from "@/worker/fakesw";
import { CookieStore } from "@/shared/cookie";

import { getSiteDirective } from "@/shared/security/siteTests";
import {
	initializeTracker,
	updateTracker,
	cleanTracker,
	getMostRestrictiveSite,
	storeReferrerPolicy,
	getReferrerPolicy,
} from "@/shared/security/forceReferrer";

import { unrewriteBlob, unrewriteUrl, type URLMeta } from "@rewriters/url";
import { rewriteJs } from "@rewriters/js";
import { ScramjetHeaders } from "@/shared/headers";
import { config, flagEnabled } from "@/shared";
import { rewriteHeaders } from "@rewriters/headers";
import { rewriteHtml } from "@rewriters/html";
import { rewriteCss } from "@rewriters/css";
import { rewriteWorkers } from "@rewriters/worker";
import { ScramjetDownload } from "@client/events";

async function getExtensionFileFromIDB(
	extId: string,
	filePath: string
): Promise<{ bytes: ArrayBuffer; mime: string } | null> {
	if (typeof indexedDB === "undefined") return null;
	try {
		const db = await new Promise<IDBDatabase | null>((resolve) => {
			const req = indexedDB.open("sapphire_extensions");
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => resolve(null);
		});
		if (!db || !db.objectStoreNames.contains("extension_files")) return null;

		const cleanPath = filePath.replace(/^\/+/, "");
		let keysToTry = [`${extId}/${cleanPath}`];
		if (!cleanPath || cleanPath === "index.html") {
			keysToTry.push(`${extId}/popup.html`, `${extId}/index.html`);
		}

		let bytes: ArrayBuffer | null = null;
		let foundPath = cleanPath;

		for (const key of keysToTry) {
			bytes = await new Promise<any>((resolve) => {
				try {
					const tx = db.transaction("extension_files", "readonly");
					const req = tx.objectStore("extension_files").get(key);
					req.onsuccess = () => resolve(req.result || null);
					req.onerror = () => resolve(null);
				} catch {
					resolve(null);
				}
			});
			if (bytes) {
				foundPath = key.slice(extId.length + 1);
				break;
			}
		}

		if (!bytes) {
			const allKeys = await new Promise<IDBValidKey[]>((resolve) => {
				try {
					const tx = db.transaction("extension_files", "readonly");
					const req = tx.objectStore("extension_files").getAllKeys();
					req.onsuccess = () => resolve(req.result || []);
					req.onerror = () => resolve([]);
				} catch {
					resolve([]);
				}
			});
			for (const k of allKeys) {
				if (typeof k === "string" && k.startsWith(`${extId}/`) && k.endsWith(`/${cleanPath}`)) {
					bytes = await new Promise<any>((resolve) => {
						try {
							const tx = db.transaction("extension_files", "readonly");
							const req = tx.objectStore("extension_files").get(k);
							req.onsuccess = () => resolve(req.result || null);
							req.onerror = () => resolve(null);
						} catch {
							resolve(null);
						}
					});
					if (bytes) {
						foundPath = k.slice(extId.length + 1);
						break;
					}
				}
			}
		}

		db.close();

		if (!bytes) return null;

		const ext = foundPath.split(".").pop()?.toLowerCase() || "";
		const mimeMap: Record<string, string> = {
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
		const mime = mimeMap[ext] || "application/octet-stream";

		return { bytes, mime };
	} catch {
		return null;
	}
}

function isRedirect(response: BareResponseFetch) {
	return response.status >= 300 && response.status < 400;
}

function isDownload(responseHeaders: object, destination: string): boolean {
	if (["document", "iframe"].includes(destination)) {
		const header = responseHeaders["content-disposition"];
		if (header) {
			if (header === "inline") {
				return false;
			} else {
				return true;
			}
		} else {
			const displayableMimes = [
				"text/html",
				"text/plain",
				"text/css",
				"text/javascript",
				"text/xml",
				"application/javascript",
				"application/json",
				"application/xml",
				"application/pdf",
			];
			const contentType = responseHeaders["content-type"]
				?.split(";")[0]
				.trim()
				.toLowerCase();
			if (
				contentType &&
				!displayableMimes.includes(contentType) &&
				!contentType.startsWith("text") &&
				!contentType.startsWith("image") &&
				!contentType.startsWith("font") &&
				!contentType.startsWith("video")
			) {
				return true;
			}
		}
	}

	return false;
}

export async function handleFetch(
	this: ScramjetServiceWorker,
	request: Request,
	client: Client | null
) {
	try {
		const requestUrl = new URL(request.url);

		if (this.config?.files?.wasm && requestUrl.pathname === this.config.files.wasm) {
			try {
				const x = await fetch(this.config.files.wasm);
				if (x.ok) {
					const buf = await x.arrayBuffer();
					const b64 = btoa(
						new Uint8Array(buf)
							.reduce(
								(data, byte) => (data.push(String.fromCharCode(byte)), data),
								[]
							)
							.join("")
					);

					let payload = "";
					payload +=
						"if ('document' in self && document.currentScript) { document.currentScript.remove(); }\n";
					payload += `self.WASM = '${b64}';`;

					return new Response(payload, {
						headers: { "content-type": "text/javascript" },
					});
				}
			} catch (e) {
				console.warn("WASM fetch failed in handleFetch", e);
			}

			return new Response("self.WASM = null;", {
				headers: { "content-type": "text/javascript" },
			});
		}

		let scriptType = "";
		let topFrameName;
		let parentFrameName;

		const extraParams: Record<string, string> = {};
		for (const [param, value] of [...requestUrl.searchParams.entries()]) {
			switch (param) {
				case "type":
					scriptType = value;
					break;
				case "dest":
					break;
				case "topFrame":
					topFrameName = value;
					break;
				case "parentFrame":
					parentFrameName = value;
					break;
				default:
					dbg.warn(
						`${requestUrl.href} extraneous query parameter ${param}. Assuming <form> element`
					);
					extraParams[param] = value;
					break;
			}
			requestUrl.searchParams.delete(param);
		}

		const unrewritten = unrewriteUrl(requestUrl);
		let url: URL;
		try {
			url = new URL(unrewritten);
		} catch {
			url = new URL(requestUrl);
		}
		for (const [param, value] of Object.entries(extraParams)) {
			url.searchParams.set(param, value);
		}

		if (
			url.hostname.endsWith(".sapphire-extension.invalid") ||
			url.hostname.endsWith(".invalid") ||
			url.protocol === "chrome-extension:" ||
			url.protocol === "moz-extension:"
		) {
			let extId = "";
			let path = "";
			if (url.protocol === "chrome-extension:" || url.protocol === "moz-extension:") {
				extId = url.hostname;
				path = url.pathname.replace(/^\/+/, "");
			} else {
				const match = url.hostname.match(/^([a-z0-9]+)\.(?:sapphire-extension\.)?invalid$/i);
				if (match) extId = match[1];
				path = url.pathname.replace(/^\/+/, "");
			}

			if (extId) {
				try {
					path = decodeURIComponent(path);
				} catch {
				}
				const res = await getExtensionFileFromIDB(extId, path);
				if (res) {
					let bodyBytes = res.bytes;
					if (
						res.mime === "text/html" ||
						res.mime === "text/css" ||
						res.mime === "application/javascript" ||
						res.mime === "application/json"
					) {
						let text = new TextDecoder().decode(res.bytes);
						text = text.replace(
							/chrome-extension:\/\/([a-z0-9]{1,64})\//g,
							(_, id) => `https://${id}.sapphire-extension.invalid/`
						);
						text = text.replace(/__MSG_@@extension_id__/g, extId);

						const meta: URLMeta = {
							origin: url,
							base: url,
							topFrameName,
							parentFrameName,
						};

						if (res.mime === "text/html") {
							text = rewriteHtml(text, this.cookieStore, meta, true);
						} else if (res.mime === "text/css") {
							text = rewriteCss(text, meta);
						}

						bodyBytes = new TextEncoder().encode(text).buffer;
					}

					return new Response(bodyBytes, {
						status: 200,
						headers: {
							"content-type":
								res.mime.startsWith("text/") ||
								res.mime === "application/javascript" ||
								res.mime === "application/json"
									? `${res.mime}; charset=utf-8`
									: res.mime,
							"access-control-allow-origin": "*",
							"cache-control": "no-cache",
						},
					});
				}
			}

			return new Response("", {
				status: 404,
				headers: { "content-type": "text/plain", "access-control-allow-origin": "*" },
			});
		}

		const meta: URLMeta = {
			origin: url,
			base: url,
			topFrameName,
			parentFrameName,
		};

		if (
			requestUrl.pathname.startsWith(`${this.config.prefix}blob:`) ||
			requestUrl.pathname.startsWith(`${this.config.prefix}data:`)
		) {
			let dataUrl = requestUrl.pathname.substring(this.config.prefix.length);
			if (dataUrl.startsWith("blob:")) {
				dataUrl = unrewriteBlob(dataUrl);
			}

			const response: Partial<BareResponseFetch> = await fetch(dataUrl, {});
			const url = dataUrl.startsWith("blob:") ? dataUrl : "(data url)";
			response.finalURL = url;
			let body: BodyType;

			if (response.body) {
				body = await rewriteBody(
					response as BareResponseFetch,
					meta,
					request.destination,
					scriptType,
					this.cookieStore
				);
			}
			const headers = Object.fromEntries(response.headers.entries());

			if (crossOriginIsolated) {
				headers["Cross-Origin-Opener-Policy"] = "same-origin";
				headers["Cross-Origin-Embedder-Policy"] = "require-corp";
			}

			return new Response(body, {
				status: response.status,
				statusText: response.statusText,
				headers: headers,
			});
		}

		const activeWorker: FakeServiceWorker | null = this.serviceWorkers.find(
			(w) => w.origin === url.origin
		);

		if (
			activeWorker?.connected &&
			requestUrl.searchParams.get("from") !== "swruntime"
		) {
			const r = await activeWorker.fetch(request);
			if (r) return r;
		}
		if (url.origin === new URL(request.url).origin) {
			throw new Error(
				"attempted to fetch from same origin - this means the site has obtained a reference to the real origin, aborting"
			);
		}

		const headers = new ScramjetHeaders();
		for (const [key, value] of request.headers.entries()) {
			headers.set(key, value);
		}

		if (client && new URL(client.url).pathname.startsWith(config.prefix)) {
			const clientURL = new URL(unrewriteUrl(client.url));
			if (clientURL.toString().includes("youtube.com")) {
			} else {
				headers.set("Referer", clientURL.href);
				headers.set("Origin", clientURL.origin);
			}
		}

		const cookies = this.cookieStore.getCookies(url, false);

		if (cookies.length) {
			headers.set("Cookie", cookies);
		}

		let isTopLevelProxyNavigation = false;
		if (
			request.destination === "iframe" &&
			request.mode === "navigate" &&
			request.referrer &&
			request.referrer !== "no-referrer" &&
			request.referrer !== location.origin + config.prefix + "no-referrer"
		) {
			let currentReferrer = request.referrer;
			const allClients = await self.clients.matchAll({ type: "window" });

			while (currentReferrer) {
				if (!currentReferrer.includes(config.prefix)) {
					isTopLevelProxyNavigation = true;
					break;
				}

				const parentChainClient = allClients.find(
					(c) => c.url === currentReferrer
				);

				// eslint-disable-next-line no-await-in-loop
				const parentPolicyData = await getReferrerPolicy(currentReferrer);

				if (!parentPolicyData || !parentPolicyData.referrer) {
					if (
						parentChainClient &&
						currentReferrer.startsWith(location.origin)
					) {
						isTopLevelProxyNavigation = true;
					}
					break;
				}

				if (parentChainClient && parentChainClient.frameType === "nested") {
					currentReferrer = parentPolicyData.referrer;
				} else {
					break;
				}
			}
		}

		if (isTopLevelProxyNavigation) {
			headers.set("Sec-Fetch-Dest", "document");
			headers.set("Sec-Fetch-Mode", "navigate");
		} else {
			headers.set("Sec-Fetch-Dest", request.destination || "empty");
			headers.set("Sec-Fetch-Mode", request.mode);
		}

		let siteDirective = "none";
		if (
			request.referrer &&
			request.referrer !== "" &&
			request.referrer !== "no-referrer" &&
			request.referrer !== location.origin + config.prefix + "no-referrer"
		) {
			if (request.referrer.includes(config.prefix)) {
				const unrewrittenReferrer = unrewriteUrl(request.referrer);
				if (unrewrittenReferrer) {
					const referrerUrl = new URL(unrewrittenReferrer);
					siteDirective = await getSiteDirective(
						meta,
						referrerUrl,
						this.client
					);
				}
			}
		}

		await initializeTracker(
			url.toString(),
			request.referrer ? unrewriteUrl(request.referrer) : null,
			siteDirective
		);

		headers.set(
			"Sec-Fetch-Site",
			await getMostRestrictiveSite(url.toString(), siteDirective)
		);

		const ev = new ScramjetRequestEvent(
			url,
			headers.headers,
			request.body,
			request.method,
			request.destination,
			client
		);
		this.dispatchEvent(ev);

		const response =
			(await ev.response) ||
			((await this.client.fetch(ev.url, {
				method: ev.method,
				body: ev.body,
				headers: ev.requestHeaders,
				credentials: "omit",
				mode: request.mode === "cors" ? request.mode : "same-origin",
				cache: request.cache,
				redirect: "manual",
				// @ts-ignore why the fuck is this not typed microsoft
				duplex: "half",
			})) as BareResponseFetch);
		response.finalURL = ev.url.href;

		return await handleResponse(
			url,
			meta,
			scriptType,
			request.destination,
			request.mode,
			response,
			this.cookieStore,
			client,
			this.client,
			this,
			request.referrer
		);
	} catch (err) {
		const errorDetails = {
			message: err.message,
			url: request.url,
			destination: request.destination,
		};
		if (err.stack) {
			errorDetails["stack"] = err.stack;
		}

		console.error("ERROR FROM SERVICE WORKER FETCH: ", errorDetails);
		console.error(err);

		if (!["document", "iframe"].includes(request.destination))
			return new Response(undefined, { status: 500 });

		const formattedError = Object.entries(errorDetails)
			.map(
				([key, value]) =>
					`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
			)
			.join("\n\n");

		return renderError(formattedError, unrewriteUrl(request.url));
	}
}

async function handleResponse(
	url: URL,
	meta: URLMeta,
	scriptType: string,
	destination: RequestDestination,
	mode: RequestMode,
	response: BareResponseFetch,
	cookieStore: CookieStore,
	client: Client,
	bareClient: BareClient,
	swtarget: ScramjetServiceWorker,
	referrer: string
): Promise<Response> {
	let responseBody: BodyType;
	const isNavigationRequest =
		mode === "navigate" && ["document", "iframe"].includes(destination);
	const responseHeaders = await rewriteHeaders(
		response.rawHeaders,
		meta,
		bareClient,
		{ get: getReferrerPolicy, set: storeReferrerPolicy }
	);

	if (isNavigationRequest && responseHeaders["referrer-policy"] && referrer) {
		await storeReferrerPolicy(
			url.href,
			responseHeaders["referrer-policy"],
			referrer
		);
	}

	if (isRedirect(response)) {
		const redirectUrl = new URL(unrewriteUrl(responseHeaders["location"]));

		await updateTracker(
			url.toString(),
			redirectUrl.toString(),
			responseHeaders["referrer-policy"]
		);

		const redirectMeta = {
			origin: redirectUrl,
			base: redirectUrl,
		};
		const newSiteDirective = await getSiteDirective(
			redirectMeta,
			url,
			bareClient
		);
		await getMostRestrictiveSite(redirectUrl.toString(), newSiteDirective);

		if (scriptType) {
			const url = new URL(responseHeaders["location"]);
			url.searchParams.set("type", scriptType);
			responseHeaders["location"] = url.href;
		}
	}

	const maybeHeaders = responseHeaders["set-cookie"] || [];
	for (const cookie in maybeHeaders) {
		if (client) {
			const promise = swtarget.dispatch(client, {
				scramjet$type: "cookie",
				cookie,
				url: url.href,
			});
			if (destination !== "document" && destination !== "iframe") {
				await promise;
			}
		}
	}

	await cookieStore.setCookies(
		maybeHeaders instanceof Array ? maybeHeaders : [maybeHeaders],
		url
	);

	for (const header in responseHeaders) {
		if (Array.isArray(responseHeaders[header]))
			responseHeaders[header] = responseHeaders[header][0];
	}

	if (isDownload(responseHeaders, destination) && !isRedirect(response)) {
		if (flagEnabled("interceptDownloads", url)) {
			if (!client) {
				throw new Error("cant find client");
			}
			let filename: string | null = null;
			const disp = responseHeaders["content-disposition"];
			if (typeof disp === "string") {
				const filenameMatch = disp.match(/filename=["']?([^"';\n]*)["']?/i);
				if (filenameMatch && filenameMatch[1]) {
					filename = filenameMatch[1];
				}
			}
			const length = responseHeaders["content-length"];

			let clis = await clients.matchAll({});
			clis = clis.filter((e) => !e.url.includes(config.prefix));
			if (clis.length < 1) {
				throw Error(
					"couldn't find a controller client to dispatch download to"
				);
			}

			const download: ScramjetDownload = {
				filename,
				url: url.href,
				type: responseHeaders["content-type"],
				body: response.body,
				length: Number(length),
			};
			clis[0].postMessage(
				{
					scramjet$type: "download",
					download,
				} as MessageW2C,
				[response.body]
			);

			await new Promise(() => {});
		} else {
			const header = responseHeaders["content-disposition"];

			if (!/\s*?((inline|attachment);\s*?)filename=/i.test(header)) {
				const type = /^\s*?attachment/i.test(header) ? "attachment" : "inline";

				const [filename] = new URL(response.finalURL).pathname
					.split("/")
					.slice(-1);

				responseHeaders["content-disposition"] =
					`${type}; filename=${JSON.stringify(filename)}`;
			}
		}
	}

	if (response.body && !isRedirect(response)) {
		responseBody = await rewriteBody(
			response,
			meta,
			destination,
			scriptType,
			cookieStore
		);
	}

	if (responseHeaders["accept"] === "text/event-stream") {
		responseHeaders["content-type"] = "text/event-stream";
	}

	delete responseHeaders["permissions-policy"];

	if (
		crossOriginIsolated &&
		[
			"document",
			"iframe",
			"worker",
			"sharedworker",
			"style",
			"script",
		].includes(destination)
	) {
		responseHeaders["Cross-Origin-Embedder-Policy"] = "require-corp";
		responseHeaders["Cross-Origin-Opener-Policy"] = "same-origin";
	}

	const ev = new ScramjetHandleResponseEvent(
		responseBody,
		responseHeaders,
		response.status,
		response.statusText,
		destination,
		url,
		response,
		client
	);
	swtarget.dispatchEvent(ev);

	if (!isRedirect(response)) {
		await cleanTracker(url.toString());
	}

	return new Response(ev.responseBody, {
		headers: ev.responseHeaders as HeadersInit,
		status: ev.status,
		statusText: ev.statusText,
	});
}

async function rewriteBody(
	response: BareResponseFetch,
	meta: URLMeta,
	destination: RequestDestination,
	workertype: string,
	cookieStore: CookieStore
): Promise<BodyType> {
	switch (destination) {
		case "iframe":
		case "document":
			if (response.headers.get("content-type")?.startsWith("text/html")) {
				return rewriteHtml(await response.text(), cookieStore, meta, true);
			} else {
				return response.body;
			}
		case "script": {
			return rewriteJs(
				new Uint8Array(await response.arrayBuffer()),
				response.finalURL,
				meta,
				workertype === "module"
			) as unknown as ArrayBuffer;
		}
		case "style":
			return rewriteCss(await response.text(), meta);
		case "sharedworker":
		case "worker":
			return rewriteWorkers(
				new Uint8Array(await response.arrayBuffer()),
				workertype,
				response.finalURL,
				meta
			);
		default:
			return response.body;
	}
}

type BodyType = string | ArrayBuffer | Blob | ReadableStream<any>;

export class ScramjetHandleResponseEvent extends Event {
	constructor(
		public responseBody: BodyType,
		public responseHeaders: Record<string, string>,
		public status: number,
		public statusText: string,
		public destination: string,
		public url: URL,
		public rawResponse: BareResponseFetch,
		public client: Client
	) {
		super("handleResponse");
	}
}

export class ScramjetRequestEvent extends Event {
	constructor(
		public url: URL,
		public requestHeaders: Record<string, string>,
		public body: BodyType,
		public method: string,
		public destination: string,
		public client: Client
	) {
		super("request");
	}
	public response?: BareResponseFetch | Promise<BareResponseFetch>;
}
