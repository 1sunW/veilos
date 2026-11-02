(function (root) {
	"use strict";

	function installSafePostMessage() {
		function isEventObject(val) {
			if (!val || typeof val !== "object") return false;
			if (typeof Event !== "undefined" && val instanceof Event) return true;
			const ctor = val.constructor?.name;
			if (typeof ctor === "string" && ctor.endsWith("Event")) return true;
			return typeof val.preventDefault === "function" && typeof val.stopPropagation === "function";
		}

		function isErrorObject(val) {
			if (!val || typeof val !== "object") return false;
			if (val instanceof Error) return true;
			const ctor = val.constructor?.name;
			return typeof ctor === "string" && ctor.endsWith("Error");
		}

		function isTransferable(val) {
			if (!val || typeof val !== "object") return false;
			if (typeof MessagePort !== "undefined" && val instanceof MessagePort) return true;
			if (typeof ArrayBuffer !== "undefined" && (val instanceof ArrayBuffer || (ArrayBuffer.isView && ArrayBuffer.isView(val)))) return true;
			if (typeof ReadableStream !== "undefined" && val instanceof ReadableStream) return true;
			if (typeof WritableStream !== "undefined" && val instanceof WritableStream) return true;
			if (typeof TransformStream !== "undefined" && val instanceof TransformStream) return true;
			return false;
		}

		function sanitizeValue(val, depth, seen) {
			if (val === null || typeof val !== "object") {
				return val;
			}
			if (depth > 14) {
				return undefined;
			}
			if (seen.has(val)) {
				return undefined;
			}
			seen.add(val);

			if (isEventObject(val)) {
				const safe = {
					isEvent: true,
					type: typeof val.type === "string" ? val.type : "event",
					isTrusted: Boolean(val.isTrusted),
				};
				if ("code" in val && typeof val.code === "number") safe.code = val.code;
				if ("reason" in val && typeof val.reason === "string") safe.reason = val.reason;
				if ("message" in val && typeof val.message === "string") safe.message = val.message;
				if ("detail" in val && val.detail && typeof val.detail !== "object") safe.detail = val.detail;
				return safe;
			}

			if (isErrorObject(val)) {
				return {
					isError: true,
					name: typeof val.name === "string" ? val.name : "Error",
					message: typeof val.message === "string" ? val.message : String(val),
					stack: typeof val.stack === "string" ? val.stack : undefined,
				};
			}

			if (isTransferable(val)) {
				return val;
			}

			if (Array.isArray(val)) {
				return val.map((item) => sanitizeValue(item, depth + 1, seen));
			}

			const out = {};
			for (const key of Object.keys(val)) {
				try {
					out[key] = sanitizeValue(val[key], depth + 1, seen);
				} catch {
				}
			}
			return out;
		}

		function createPatchedPostMessage(originalMethod) {
			if (!originalMethod || originalMethod.__safeClonePatched) {
				return originalMethod;
			}

			const patched = function (message, ...rest) {
				const seen = new WeakSet();
				let cleanMessage;
				try {
					cleanMessage = sanitizeValue(message, 0, seen);
				} catch {
					cleanMessage = message;
				}

				try {
					return originalMethod.call(this, cleanMessage, ...rest);
				} catch (err) {
					if (err && (err.name === "DataCloneError" || String(err).includes("could not be cloned"))) {
						console.warn("[safePostMessage] Intercepted DataCloneError, applying fallback:", err);
						try {
							const fallbackJson = JSON.parse(
								JSON.stringify(cleanMessage, (k, v) => {
									if (isEventObject(v)) {
										return { isEvent: true, type: v.type || "event" };
									}
									if (isErrorObject(v)) {
										return { isError: true, name: v.name || "Error", message: v.message || String(v) };
									}
									return v;
								})
							);
							const safeRest = rest.length > 0 && Array.isArray(rest[0])
								? [rest[0].filter((item) => isTransferable(item))]
								: rest;
							return originalMethod.call(this, fallbackJson, ...safeRest);
						} catch (jsonErr) {
							console.error("[safePostMessage] Fallback serialization failed:", jsonErr);
							const minimal = {
								type: cleanMessage?.type || "error",
								error: String(cleanMessage?.error || cleanMessage?.message || err.message || "Failed to clone message"),
							};
							return originalMethod.call(this, minimal);
						}
					}
					throw err;
				}
			};

			patched.__safeClonePatched = true;
			return patched;
		}

		if (typeof MessagePort !== "undefined" && MessagePort.prototype && MessagePort.prototype.postMessage) {
			if (!MessagePort.prototype.postMessage.__safeClonePatched) {
				MessagePort.prototype.postMessage = createPatchedPostMessage(MessagePort.prototype.postMessage);
			}
		}

		if (typeof Worker !== "undefined" && Worker.prototype && Worker.prototype.postMessage) {
			if (!Worker.prototype.postMessage.__safeClonePatched) {
				Worker.prototype.postMessage = createPatchedPostMessage(Worker.prototype.postMessage);
			}
		}

		if (typeof root !== "undefined" && typeof root.postMessage === "function" && typeof window === "undefined") {
			if (!root.postMessage.__safeClonePatched) {
				root.postMessage = createPatchedPostMessage(root.postMessage);
			}
		}
	}

	installSafePostMessage();
	if (typeof module !== "undefined" && module.exports) {
		module.exports = { installSafePostMessage };
	}
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this);

!function(){"use strict";const e=MessagePort.prototype.postMessage;let t=null;function a(e,t,a){console.error(`error while processing '${a}': `,t);const _err=t instanceof Error?{message:t.message,name:t.name,stack:t.stack}:(t&&typeof t==="object"?{message:t.message||t.type||String(t),type:t.type,isEvent:true}:String(t));try{e.postMessage({type:"error",error:_err})}catch(_e){console.error("error postMessage:",_e)}}async function n(a,n,s){const o=await s.request(new URL(a.fetch.remote),a.fetch.method,a.fetch.body,a.fetch.headers,null);if(!function(){if(null===t){const a=new MessageChannel,n=new ReadableStream;let s;try{e.call(a.port1,n,[n]),s=!0}catch(e){s=!1}return t=s,s}return t}()&&o.body instanceof ReadableStream){const e=new Response(o.body);o.body=await e.arrayBuffer()}o.body instanceof ReadableStream||o.body instanceof ArrayBuffer?e.call(n,{type:"fetch",fetch:o},[o.body]):e.call(n,{type:"fetch",fetch:o})}let s=null,o="";function c(){return new Error("there are no bare clients",{cause:"No BareTransport was set. Try creating a BareMuxConnection and calling `setTransport()` or `setManualTransport()` on it before using BareClient."})}function r(t,a){const n=s;let o=[a];t.fetch?.body&&o.push(t.fetch.body),t.websocket?.channel&&o.push(t.websocket.channel),e.call(n,{message:t,port:a},o)}function l(t){t.onmessage=async t=>{const l=t.data.port,i=t.data.message;if("ping"===i.type)e.call(l,{type:"pong"});else if("set"===i.type)try{const t=async function(){}.constructor;if("bare-mux-remote"===i.client.function)s=i.client.args[0],o=`bare-mux-remote (${i.client.args[1]})`;else try{const e=new t(i.client.function),[a,n]=await e();s=new a(...i.client.args),o=n}catch(e){throw e.cause="The BareTransport provided was invalid. Common causes of this are a default export that is not a class that implements BareTransport if you are using `setTransport()`",e}console.log("set transport to ",s,o),e.call(l,{type:"set"})}catch(e){a(l,e,"set")}else if("get"===i.type)l.postMessage({type:"get",name:o});else if("fetch"===i.type)try{if(!s)throw c();if(s instanceof MessagePort)return void r(i,l);s.ready||await s.init(),await n(i,l,s)}catch(e){a(l,e,"fetch")}else if("websocket"===i.type)try{if(!s)throw c();if(s instanceof MessagePort)return void r(i,l);s.ready||await s.init(),await async function(t,a,n){const[s,o]=n.connect(new URL(t.websocket.url),t.websocket.protocols,t.websocket.requestHeaders,(a=>{e.call(t.websocket.channel,{type:"open",args:[typeof a==="string"||Array.isArray(a)?a:""]})}),(a=>{a instanceof ArrayBuffer?e.call(t.websocket.channel,{type:"message",args:[a]},[a]):e.call(t.websocket.channel,{type:"message",args:[a]})}),((a,n)=>{e.call(t.websocket.channel,{type:"close",args:[typeof a==="number"?a:1000,typeof n==="string"?n:""]})}),(a=>{e.call(t.websocket.channel,{type:"error",args:[a&&typeof a==="object"?{type:a.type||"error",isEvent:true}:a]})}));t.websocket.channel.onmessage=e=>{"data"===e.data.type?s(e.data.data):"close"===e.data.type&&o(e.data.closeCode,e.data.closeReason)},e.call(a,{type:"websocket"})}(i,l,s)}catch(e){a(l,e,"websocket")}}}new BroadcastChannel("bare-mux").postMessage({type:"refreshPort"}),self.onconnect=e=>{l(e.ports[0])},console.debug("bare-mux: running v2.1.9 (build dc9dc6e)")}();
//# sourceMappingURL=worker.js.map
