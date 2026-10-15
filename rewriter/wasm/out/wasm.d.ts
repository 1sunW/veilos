export interface JsRewriterOutput {
	js: Uint8Array;
	map: Uint8Array | null;
	scramtag: string;
	errors: string[];
}

export class Rewriter {
	constructor(options?: any);
	free(): void;
	rewrite_html?(html: string, base: string, cookie_store?: any): string;
	rewrite_js(input: string, base: string, source: string, module: boolean): JsRewriterOutput;
	rewrite_js_bytes(input: Uint8Array, base: string, source: string, module: boolean): JsRewriterOutput;
	rewrite_css?(css: string, base: string): string;
	[key: string]: any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
	readonly memory: WebAssembly.Memory;
}

export function initSync(module: { module: WebAssembly.Module } | BufferSource | WebAssembly.Module): InitOutput;

export default function init(input?: InitInput | Promise<InitInput>): Promise<InitOutput>;
