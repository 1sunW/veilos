
import { ScramjetController } from "@/controller/index";
import type { ScramjetClient } from "@client/index";
import type { ScramjetEvent, ScramjetEvents } from "@client/events";
import { SCRAMJETCLIENT, SCRAMJETFRAME } from "@/symbols";
function createFrameId() {
	return `${Array(8)
		.fill(0)
		.map(() => Math.floor(Math.random() * 36).toString(36))
		.join("")}`;
}

export class ScramjetHook {
	private listeners: ((ctx: any) => void)[] = [];
	tap(_nameOrCb: any, cb?: any) {
		const fn = typeof cb === "function" ? cb : _nameOrCb;
		if (typeof fn === "function") {
			this.listeners.push(fn);
		}
	}
	dispatch(ctx: any) {
		for (const listener of this.listeners) {
			try {
				listener(ctx);
			} catch (err) {
				console.error("[ScramjetHook dispatch error]", err);
			}
		}
	}
}

export interface FrameOptions {
	plugins?: any[];
}

export class ScramjetFrame extends EventTarget {
	public options: FrameOptions;
	public hooks = {
		init: {
			pre: new ScramjetHook(),
			post: new ScramjetHook(),
		},
		fetch: new ScramjetHook(),
		error: new ScramjetHook(),
	};

	constructor(
		private controller: ScramjetController,
		public frame: HTMLIFrameElement,
		options?: FrameOptions
	) {
		super();
		this.options = options || {};
		frame.name = createFrameId();
		frame[SCRAMJETFRAME] = this;

		if (this.options?.plugins && Array.isArray(this.options.plugins)) {
			for (const plugin of this.options.plugins) {
				if (plugin && typeof plugin.install === "function") {
					try {
						plugin.install(this);
					} catch (e) {
						console.error("[ScramjetFrame plugin install error]", e);
					}
				}
			}
		}

		const triggerInitHooks = () => {
			try {
				if (this.frame && this.frame.contentWindow) {
					this.hooks.init.pre.dispatch({
						window: this.frame.contentWindow,
						isTopLevel: true,
					});
				}
			} catch (e) {}
		};

		this.frame.addEventListener("load", triggerInitHooks);
	}

	getPlugin<T = any>(name: string): T | undefined {
		if (!this.options?.plugins) return undefined;

		return this.options.plugins.find((p) => p?.name === name) as T;
	}

	get client(): ScramjetClient {
		return this.frame.contentWindow.window[SCRAMJETCLIENT];
	}

	get url(): URL {
		return this.client.url;
	}

	go(url: string | URL) {
		if (url instanceof URL) url = url.toString();

		dbg.log("navigated to", url);

		this.frame.src = this.controller.encodeUrl(url);
	}

	back() {
		this.frame.contentWindow?.history.back();
	}

	forward() {
		this.frame.contentWindow?.history.forward();
	}

	reload() {
		this.frame.contentWindow?.location.reload();
	}

	addEventListener<K extends keyof ScramjetEvents>(
		type: K,
		listener: (event: ScramjetEvents[K]) => void,
		options?: boolean | AddEventListenerOptions
	): void {
		super.addEventListener(type, listener as EventListener, options);
	}
}
