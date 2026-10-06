/// <reference types="@rspack/core/module" />

import "./safe-postmessage";
import type { ScramjetVersionInfo } from "./types";
import JSZip from "jszip";

export { JSZip };

export function crxToZip(buffer: ArrayBuffer): ArrayBuffer {
	if (!buffer || buffer.byteLength < 16) return buffer;
	const view = new DataView(buffer);
	const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
	if (magic !== "Cr24") {
		return buffer;
	}
	const version = view.getUint32(4, true);
	let zipStart: number;
	if (version === 2) {
		const pubKeyLen = view.getUint32(8, true);
		const sigLen = view.getUint32(12, true);
		zipStart = 16 + pubKeyLen + sigLen;
	} else if (version === 3) {
		const headerSize = view.getUint32(8, true);
		zipStart = 12 + headerSize;
	} else {
		return buffer;
	}

	return buffer.slice(zipStart);
}

export async function normalizeExtensionBuffer(buffer: ArrayBuffer, _filename = "extension.zip"): Promise<ArrayBuffer> {
	if (!buffer || buffer.byteLength < 16) return buffer;
	try {
		const zipBuffer = crxToZip(buffer);
		if (zipBuffer.byteLength >= 2) {
			const v = new Uint8Array(zipBuffer);
			if (v[0] !== 0x50 || v[1] !== 0x4b) {
				return zipBuffer;
			}
		}
		const zip = await JSZip.loadAsync(zipBuffer);
		if (zip.file("manifest.json")) {
			return zipBuffer;
		}
		let manifestPath: string | null = null;
		zip.forEach((relativePath, file) => {
			if (!file.dir && relativePath.endsWith("manifest.json")) {
				if (!manifestPath || relativePath.split("/").length < manifestPath.split("/").length) {
					manifestPath = relativePath;
				}
			}
		});

		if (manifestPath) {
			const prefix = manifestPath.slice(0, manifestPath.length - "manifest.json".length);
			const newZip = new JSZip();
			const promises: Promise<void>[] = [];
			zip.forEach((relativePath, file) => {
				if (relativePath.startsWith(prefix) && !file.dir) {
					const cleanPath = relativePath.slice(prefix.length);
					promises.push(
						file.async("arraybuffer").then((data) => {
							newZip.file(cleanPath, data);
						})
					);
				}
			});
			await Promise.all(promises);

			return await newZip.generateAsync({ type: "arraybuffer" });
		}

		return zipBuffer;
	} catch (e) {
		console.warn("[normalizeExtensionBuffer] fallback to original buffer:", e);
	}

	return buffer;
}

/**
 * Hash of the current commit in `MercuryWorkshop/scramjet` Scramjet was built from.
 */
declare const COMMITHASH: string;
/**
 * Semantic version of the current Scramjet build.
 */
declare const VERSION: string;

/**
 * @category Window Context
 */
export type { ScramjetFlags } from "./types";

/**
 * @category Window Context
 */
export type { ScramjetInitConfig } from "./types";

/**
 * @category Window Context
 */
export type { ScramjetGlobalEvent } from "./client/events";

/**
 * @category Window Context
 */
export type { ScramjetGlobalDownloadEvent } from "./client/events";

/**
 * @category Window Context
 */
export type { ScramjetGlobalEvents } from "./client/events";

/**
 * @category Window Context
 */
export type { ScramjetDownload } from "./client/events";

/**
 * @category Window Context
 */
export type { ScramjetEvent } from "./client/events";

/**
 * @category Window Context
 */
export type { ScramjetEvents } from "./client/events";

/**
 * @category Window Context
 */
export type { NavigateEvent } from "./client/events";

/**
 * @category Window Context
 */
export type { UrlChangeEvent } from "./client/events";

/**
 * @category Window Context
 */
export type { ScramjetContextEvent } from "./client/events";

/**
 * @category Window Context
 */
export type { ScramjetController } from "./controller";

/**
 * @category Window Context
 */
export type { ScramjetFrame } from "./controller/frame";

/**
 * @category Window Context
 */
export type { ScramjetClient } from "./client";

/**
 * @category Service Worker Context
 */
export type { ScramjetServiceWorker } from "./worker";

/**
 * @fileoverview Scramjet Entry Point. This module contain global constants and factory functions to load the APIs in the bundle.
 *
 * @categoryDescription Window Context
 * APIs for the main window context, which includes creating Scramjet Frames and the Controller for managing the Scramjet proxy behavior in the SW.
 * @categoryDescription Service Worker Context
 * APIs designed for the service worker context, where the core logic resides. These are the essentials and include the the `ScramjetServiceWorker`.
 */

/**
 * Factory function that creates the `ScramjetController` class.
 *
 * @returns The `ScramjetController` class.
 *
 * @example
 * ```typescript
 * const { ScramjetController } = $scramjetLoadController();
 *
 * const scramjet = new ScramjetController({
 *   prefix: "/scramjet/"
 * });
 *
 * await scramjet.init();
 *
 * const frame = scramjet.createFrame();
 * document.body.appendChild(frame.frame);
 * frame.navigate("https://example.com");
 * ```
 *
 * @category Window Context
 */
export function $scramjetLoadController() {
	return require("./controller/index");
}
/**
 * Factory function that creates the `ScramjetClient` for controlling sandboxing.
 *
 * @returns The `ScramjetClient` class.
 *
 * @example
 * ```typescript
 * const ScramjetClient = $scramjetLoadClient();
 *
 * const scramjetClient = new ScramjetClient.ScramjetClient();
 * ```
 * @category Window Context
 */
export function $scramjetLoadClient() {
	return require("./client/entry");
}
/**
 * Factory function that creates the `ScramjetServiceWorker` class.
 *
 * @returns The `ScramjetServiceWorker` class.
 *
 * Plain SW example
 * @example
 * ```typescript
 * // In your Service Worker
 * const { ScramjetServiceWorker } = $scramjetLoadWorker();
 *
 * const scramjet = new ScramjetServiceWorker();
 *
 * self.addEventListener("fetch", async (ev) => {
 *   await scramjet.loadConfig();
 *
 *   if (scramjet.route(ev)) {
 *     ev.respondWith(scramjet.fetch(ev));
 *   }
 * });
 * ```
 *
 * Workbox-powered SW routing example
 * @example
 * ```typescript
 * // In your Service Worker (ensure you are using a bundler for Workbox)
 * // This is more useful for a webOS or if you have Offline PWA support on your proxy site
 * import { registerRoute } from 'workbox-routing';
 *
 * const { ScramjetServiceWorker } = $scramjetLoadWorker();
 *
 * const scramjet = new ScramjetServiceWorker();
 *
 * registerRoute(
 *   ({ request }) => {
 *     return scramjet.route({ request });
 *   },
 *   async ({ event }) => {
 *     await scramjet.loadConfig();
 *
 *     return scramjet.fetch(event);
 *   }
 * );
 * ```
 *
 * @category Service Worker Context
 */
export function $scramjetLoadWorker() {
	return require("./worker/index");
}

globalThis.$scramjetRequire = function (path: string) {
	return require(path);
};

/**
 * Version information for the current Scramjet build.
 *
 * @category Window Context
 */
export const $scramjetVersion: ScramjetVersionInfo = {
	build: COMMITHASH,
	version: VERSION,
};

globalThis.$scramjetLoadController = $scramjetLoadController;
globalThis.$scramjetLoadClient = $scramjetLoadClient;
globalThis.$scramjetLoadWorker = $scramjetLoadWorker;
globalThis.$scramjetVersion = $scramjetVersion;
(globalThis as any).$scramjetController = require("./controller/shim");

globalThis.JSZip = JSZip;
globalThis.crxToZip = crxToZip;
globalThis.normalizeExtensionBuffer = normalizeExtensionBuffer;

import { Sapphire, SapphireContentScriptPlugin, SapphirePlugin, findMatchingCommand, triggerCommand } from "@x8r/sapphire";

export { Sapphire, SapphireContentScriptPlugin, SapphirePlugin, findMatchingCommand, triggerCommand };
(globalThis as any).Sapphire = Sapphire;
(globalThis as any).SapphirePlugin = SapphirePlugin;
(globalThis as any).SapphireContentScriptPlugin = SapphireContentScriptPlugin;
(globalThis as any).findMatchingCommand = findMatchingCommand;
(globalThis as any).triggerCommand = triggerCommand;

if ("document" in globalThis && document?.currentScript) {
	document.currentScript.remove();
}
