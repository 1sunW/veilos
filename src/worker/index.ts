
import { FakeServiceWorker } from "@/worker/fakesw";
import { handleFetch } from "@/worker/fetch";
import BareClient from "@mercuryworkshop/bare-mux";
import { ScramjetConfig, ScramjetDB } from "@/types";
import { asyncSetWasm } from "@rewriters/wasm";
import { CookieStore } from "@/shared/cookie";
import { openScramjetDB } from "@/shared/db";
import { config, loadCodecs, setConfig } from "@/shared";
import { ScramjetDownload } from "@client/events";
export * from "./error";
export * from "./fetch";
export * from "./fakesw";

export class ScramjetServiceWorker extends EventTarget {
	client: BareClient;
	config: ScramjetConfig;

	syncPool: Record<number, (val?: any) => void> = {};
	synctoken = 0;

	cookieStore = new CookieStore();

	serviceWorkers: FakeServiceWorker[] = [];

	constructor() {
		super();
		this.client = new BareClient();
		this.config = config;

		(async () => {
			try {
				const db = await openScramjetDB();
				if (!db.objectStoreNames.contains("cookies")) return;
				const cookies = await db.get("cookies", "cookies");
				if (cookies) {
					this.cookieStore.load(cookies);
				}
			} catch (e) {
				console.warn("Failed to load cookies from IDB", e);
			}
		})();

		addEventListener("message", async ({ data }: { data: MessageC2W }) => {
			if (!("scramjet$type" in data)) return;

			if ("scramjet$token" in data) {
				const cb = this.syncPool[data.scramjet$token];
				delete this.syncPool[data.scramjet$token];
				cb(data);

				return;
			}

			if (data.scramjet$type === "registerServiceWorker") {
				this.serviceWorkers.push(new FakeServiceWorker(data.port, data.origin));

				return;
			}

			if (data.scramjet$type === "cookie") {
				this.cookieStore.setCookies([data.cookie], new URL(data.url));
				try {
					const db = await openScramjetDB();
					if (db.objectStoreNames.contains("cookies")) {
						await db.put("cookies", JSON.parse(this.cookieStore.dump()), "cookies");
					}
				} catch (e) {
					console.warn("Failed to save cookies to IDB", e);
				}
			}

			if (data.scramjet$type === "loadConfig") {
				this.config = data.config;
				setConfig(this.config);
				await asyncSetWasm();
			}
		});
	}

	async dispatch(client: Client, data: MessageW2C): Promise<MessageC2W> {
		const token = this.synctoken++;
		let cb: (val: MessageC2W) => void;
		const promise: Promise<MessageC2W> = new Promise((r) => (cb = r));
		this.syncPool[token] = cb;
		data.scramjet$token = token;

		client.postMessage(data);

		return await promise;
	}

	async loadConfig() {
		try {
			const db = await openScramjetDB();
			const stored = await db.get("config", "config");
			if (stored) {
				this.config = stored;
			}
		} catch (e) {
			dbg.error("Failed to read config from IndexedDB", e);
		}

		if (!this.config) {
			this.config = config;
		}

		if (this.config) {
			setConfig(this.config);
			await asyncSetWasm();
		}
	}

	route({ request }: FetchEvent) {
		const cfg = this.config || config;
		if (!cfg) return false;

		const url = new URL(request.url);
		if (cfg.files?.wasm && url.pathname === cfg.files.wasm) {
			return true;
		}

		const prefix = cfg.prefix || "/scramjet/";
		if (
			url.pathname.startsWith(prefix) ||
			url.pathname === prefix.replace(/\/$/, "")
		) {
			return true;
		}

		return false;
	}

	async fetch({ request, clientId }: FetchEvent) {
		if (!this.config) await this.loadConfig();

		const client = await self.clients.get(clientId);

		return handleFetch.call(this, request, client);
	}
}

type RegisterServiceWorkerMessage = {
	scramjet$type: "registerServiceWorker";
	port: MessagePort;
	origin: string;
};

type CookieMessage = {
	scramjet$type: "cookie";
	cookie: string;
	url: string;
};

type ConfigMessage = {
	scramjet$type: "loadConfig";
	config: ScramjetConfig;
};

type DownloadMessage = {
	scramjet$type: "download";
	download: ScramjetDownload;
};
type MessageCommon = {
	scramjet$token?: number;
};

type MessageTypeC2W =
	| RegisterServiceWorkerMessage
	| CookieMessage
	| ConfigMessage;
type MessageTypeW2C = CookieMessage | DownloadMessage;

export type MessageC2W = MessageCommon & MessageTypeC2W;
export type MessageW2C = MessageCommon & MessageTypeW2C;
