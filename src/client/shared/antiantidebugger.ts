import { ScramjetClient } from "@client/index";

export default function (client: ScramjetClient) {
	client.Proxy("console.clear", {
		apply(ctx) {
			ctx.return(undefined);
		},
	});

	const log = console.log;
	client.Trap("console.log", {
		set(_ctx, _v) {
		},
		get(_ctx) {
			return log;
		},
	});
}
