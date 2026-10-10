let wasm;
const encoder = new TextEncoder();

export class Rewriter {
	constructor(options) {
		this.options = options;
	}
	free() {}
	rewrite_html(html, base, cookie_store) {
		return html;
	}
	rewrite_js(input, base, source, module) {
		return {
			js: typeof input === "string" ? encoder.encode(input) : input,
			map: null,
			scramtag: "",
			errors: []
		};
	}
	rewrite_js_bytes(input, base, source, module) {
		return {
			js: input,
			map: null,
			scramtag: "",
			errors: []
		};
	}
	rewrite_css(css, base) {
		return css;
	}
}

export function initSync(input) {
	if (input && input.module) {
		const instance = new WebAssembly.Instance(input.module, {});
		wasm = instance.exports;
	}
	return wasm;
}

export default async function init(input) {
	return initSync(input);
}
