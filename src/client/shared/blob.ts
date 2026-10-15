import { rewriteBlob, unrewriteBlob } from "@rewriters/url";
import { ScramjetClient } from "@client/index";
export default function (client: ScramjetClient) {
	client.Proxy("URL.createObjectURL", {
		apply(ctx) {
			const url: string = ctx.call();
			if (url.startsWith("blob:")) {
				ctx.return(rewriteBlob(url, client.meta));
			} else {
				ctx.return(url);
			}
		},
	});

	client.Proxy("URL.revokeObjectURL", {
		apply(ctx) {
			ctx.args[0] = unrewriteBlob(ctx.args[0]);
		},
	});
}
