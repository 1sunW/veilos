import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const safePostMessageCode = readFileSync(join(root, "static", "safe-postmessage.js"), "utf8");

export function patchFile(filePath, transforms) {
	if (!existsSync(filePath)) {
		return false;
	}
	let content = readFileSync(filePath, "utf8");
	let modified = false;

	for (const [pattern, replacement] of transforms) {
		if (typeof pattern === "string") {
			if (content.includes(pattern)) {
				content = content.replaceAll(pattern, replacement);
				modified = true;
			}
		} else if (pattern instanceof RegExp) {
			if (pattern.test(content)) {
				content = content.replace(pattern, replacement);
				modified = true;
			}
		}
	}

	if (modified) {
		writeFileSync(filePath, content, "utf8");
		console.log(`  ✓ Patched ${filePath}`);
	}
	return modified;
}

export function patchAll() {
	console.log("Applying postMessage data clone and event serialization patches...");

	const workerTransforms = [
		[
			'(a=>{e.call(t.websocket.channel,{type:"error",args:[a]})})',
			'(a=>{e.call(t.websocket.channel,{type:"error",args:[a&&typeof a==="object"?{type:a.type||"error",isEvent:true}:a]})})',
		],
		[
			'(a=>{e.call(t.websocket.channel,{type:"open",args:[a]})})',
			'(a=>{e.call(t.websocket.channel,{type:"open",args:[typeof a==="string"||Array.isArray(a)?a:""]})})',
		],
		[
			'((a,n)=>{e.call(t.websocket.channel,{type:"close",args:[a,n]})})',
			'((a,n)=>{e.call(t.websocket.channel,{type:"close",args:[typeof a==="number"?a:1000,typeof n==="string"?n:""]})})',
		],
		[
			'function a(e,t,a){console.error(`error while processing \'${a}\': `,t),e.postMessage({type:"error",error:t})}',
			'function a(e,t,a){console.error(`error while processing \'${a}\': `,t);const _err=t instanceof Error?{message:t.message,name:t.name,stack:t.stack}:(t&&typeof t==="object"?{message:t.message||t.type||String(t),type:t.type,isEvent:true}:String(t));try{e.postMessage({type:"error",error:_err})}catch(_e){console.error("error postMessage:",_e)}}',
		],
	];

	const indexTransforms = [
		[
			'(t=>{o.call(e.websocket.channel,{type:"error",args:[t]})})',
			'(t=>{o.call(e.websocket.channel,{type:"error",args:[t&&typeof t==="object"?{type:t.type||"error",isEvent:true}:t]})})',
		],
		[
			'(t=>{o.call(e.websocket.channel,{type:"open",args:[t]})})',
			'(t=>{o.call(e.websocket.channel,{type:"open",args:[typeof t==="string"||Array.isArray(t)?t:""]})})',
		],
		[
			'((t,r)=>{o.call(e.websocket.channel,{type:"close",args:[t,r]})})',
			'((t,r)=>{o.call(e.websocket.channel,{type:"close",args:[typeof t==="number"?t:1000,typeof r==="string"?r:""]})})',
		],
		[
			'function w(e,t,r){console.error(`error while processing \'${r}\': `,t),e.postMessage({type:"error",error:t})}',
			'function w(e,t,r){console.error(`error while processing \'${r}\': `,t);const _err=t instanceof Error?{message:t.message,name:t.name,stack:t.stack}:(t&&typeof t==="object"?{message:t.message||t.type||String(t),type:t.type,isEvent:true}:String(t));try{e.postMessage({type:"error",error:_err})}catch(_e){console.error("error postMessage:",_e)}}',
		],
		[
			'function u(e,t,r){console.error(`error while processing \'${r}\': `,t),e.postMessage({type:"error",error:t})}',
			'function u(e,t,r){console.error(`error while processing \'${r}\': `,t);const _err=t instanceof Error?{message:t.message,name:t.name,stack:t.stack}:(t&&typeof t==="object"?{message:t.message||t.type||String(t),type:t.type,isEvent:true}:String(t));try{e.postMessage({type:"error",error:_err})}catch(_e){console.error("error postMessage:",_e)}}',
		],
	];

	const epoxyTransforms = [
		[
			`  connect(url, protocols, requestHeaders, onopen, onmessage, onclose, onerror) {
    let handlers = new EpoxyHandlers(
      onopen,
      onclose,
      onerror,
      (data) => data instanceof Uint8Array ? onmessage(data.buffer) : onmessage(data)
    );`,
			`  connect(url, protocols, requestHeaders, onopen, onmessage, onclose, onerror) {
    const safeError = (err) => {
      if (err && typeof err === "object") {
        onerror({ type: err.type || "error", message: err.message || "Epoxy connection error", isEvent: true });
      } else {
        onerror(String(err || "Epoxy connection error"));
      }
    };
    const safeOpen = (evt) => {
      if (evt && typeof evt === "object" && !(typeof evt === "string")) {
        onopen(protocols);
      } else {
        onopen(evt);
      }
    };
    let handlers = new EpoxyHandlers(
      safeOpen,
      onclose,
      safeError,
      (data) => data instanceof Uint8Array ? onmessage(data.buffer) : onmessage(data)
    );`,
		],
	];

	// 1. Prepend safe-postmessage to worker.js files
	const workerFiles = [
		join(root, "node_modules", "@mercuryworkshop", "bare-mux", "dist", "worker.js"),
		join(root, "public", "baremux", "worker.js"),
	];

	for (const f of workerFiles) {
		if (existsSync(f)) {
			let c = readFileSync(f, "utf8");
			if (!c.includes("__safeClonePatched")) {
				c = safePostMessageCode + "\n" + c;
				writeFileSync(f, c, "utf8");
				console.log(`  ✓ Prepended safe-postmessage to ${f}`);
			}
		}
		patchFile(f, workerTransforms);
	}

	// 2. Patch index.js and index.mjs files
	const indexFiles = [
		join(root, "node_modules", "@mercuryworkshop", "bare-mux", "dist", "index.js"),
		join(root, "node_modules", "@mercuryworkshop", "bare-mux", "dist", "index.mjs"),
		join(root, "public", "baremux", "index.js"),
		join(root, "public", "baremux", "index.mjs"),
		join(root, "dist", "scramjet.all.js"),
		join(root, "dist", "scramjet.bundle.js"),
		join(root, "public", "scram", "scramjet.all.js"),
		join(root, "public", "scram", "scramjet.bundle.js"),
	];

	for (const f of indexFiles) {
		if (existsSync(f)) {
			let c = readFileSync(f, "utf8");
			if (!c.includes("__safeClonePatched") && (f.endsWith("baremux/index.js") || f.includes("@mercuryworkshop/bare-mux/dist/index.js"))) {
				c = safePostMessageCode + "\n" + c;
				writeFileSync(f, c, "utf8");
				console.log(`  ✓ Prepended safe-postmessage to ${f}`);
			}
		}
		patchFile(f, indexTransforms);
	}

	// 3. Patch epoxy-transport files
	const epoxyFiles = [
		join(root, "node_modules", "@mercuryworkshop", "epoxy-transport", "dist", "index.mjs"),
		join(root, "public", "epoxy", "index.mjs"),
	];

	for (const f of epoxyFiles) {
		patchFile(f, epoxyTransforms);
	}

	console.log("Patches applied successfully!");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	patchAll();
}
