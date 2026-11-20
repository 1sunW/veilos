
import { loadCodecs, setConfig } from "@/shared/index";
import { SCRAMJETCLIENT } from "@/symbols";
import { ScramjetClient } from "@client/index";
import { ScramjetContextEvent, UrlChangeEvent } from "@client/events";
import { ScramjetServiceWorkerRuntime } from "@client/swruntime";
import { ScramjetConfig } from "@/types";

export const iswindow = "window" in globalThis && window instanceof Window;
export const isworker = "WorkerGlobalScope" in globalThis;
export const issw = "ServiceWorkerGlobalScope" in globalThis;
export const isdedicated = "DedicatedWorkerGlobalScope" in globalThis;
export const isshared = "SharedWorkerGlobalScope" in globalThis;
export const isemulatedsw =
	"location" in globalThis &&
	new URL(globalThis.location.href).searchParams.get("dest") ===
		"serviceworker";

function createFrameId() {
	return `${Array(8)
		.fill(0)
		.map(() => Math.floor(Math.random() * 36).toString(36))
		.join("")}`;
}

export function loadAndHook(config: ScramjetConfig) {
	setConfig(config);
	dbg.log("initializing scramjet client");
	if (!(SCRAMJETCLIENT in <Partial<typeof self>>globalThis)) {
		loadCodecs();

		const client = new ScramjetClient(globalThis);
		const frame: HTMLIFrameElement =
			globalThis.frameElement as HTMLIFrameElement;
		if (frame && !frame.name) {
			frame.name = createFrameId();
		}

		if (globalThis.COOKIE) client.loadcookies(globalThis.COOKIE);

		client.hook();

		if (isemulatedsw) {
			const runtime = new ScramjetServiceWorkerRuntime(client);
			runtime.hook();
		}

		const contextev = new ScramjetContextEvent(client.global.window, client);
		client.frame?.dispatchEvent(contextev);
		const urlchangeev = new UrlChangeEvent(client.url.href);
		if (!client.isSubframe) client.frame?.dispatchEvent(urlchangeev);
	}

	Reflect.deleteProperty(globalThis, "WASM");
	Reflect.deleteProperty(globalThis, "COOKIE");

	const globalProto = Object.getPrototypeOf(globalThis);
	for (const target of [globalThis, globalProto]) {
		if (!target) continue;
		for (const prop of ["setImmediate", "clearImmediate"] as const) {
			const desc = Object.getOwnPropertyDescriptor(target, prop);
			if (
				desc &&
				desc.configurable &&
				typeof desc.value === "function" &&
				!String(desc.value).includes("[native code]")
			) {
				Reflect.deleteProperty(target, prop);
			}
		}
	}
}
