import { iswindow } from "@client/entry";
import { SCRAMJETCLIENT } from "@/symbols";
import { ScramjetClient } from "@client/index";
import { POLLUTANT } from "@client/shared/realm";

export default function (client: ScramjetClient) {
	if (iswindow)
		client.Proxy("window.postMessage", {
			apply(ctx) {

				let pollutant;

				if (typeof ctx.args[0] === "object" && ctx.args[0] !== null) {
					pollutant = ctx.args[0];
				} else if (typeof ctx.args[2] === "object" && ctx.args[2] !== null) {
					pollutant = ctx.args[2];
				} else if (
					ctx.this &&
					POLLUTANT in ctx.this &&
					typeof ctx.this[POLLUTANT] === "object" &&
					ctx.this[POLLUTANT] !== null
				) {
					pollutant = ctx.this[POLLUTANT];
				} else {
					pollutant = {};
				}

				const {
					constructor: { constructor: Function },
				} = pollutant;

				const callerGlobalThisProxied: Self = Function("return globalThis")();
				const callerClient = callerGlobalThisProxied[SCRAMJETCLIENT];

				const wrappedPostMessage = Function("...args", "this(...args)");

				ctx.args[0] = {
					$scramjet$messagetype: "window",
					$scramjet$origin: callerClient.url.origin,
					$scramjet$data: ctx.args[0],
				};

				if (typeof ctx.args[1] === "string") ctx.args[1] = "*";
				if (typeof ctx.args[1] === "object") ctx.args[1].targetOrigin = "*";

				ctx.return(wrappedPostMessage.call(ctx.fn, ...ctx.args));
			},
		});

	const toproxy = ["MessagePort.prototype.postMessage"];

	if (self.Worker) toproxy.push("Worker.prototype.postMessage");
	if (!iswindow) toproxy.push("self.postMessage");

	client.Proxy(toproxy, {
		apply(ctx) {

			ctx.args[0] = {
				$scramjet$messagetype: "worker",
				$scramjet$data: ctx.args[0],
			};
		},
	});
}
