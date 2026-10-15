import { config, flagEnabled } from "@/shared";
import { unrewriteUrl } from "@rewriters/url";
import { ScramjetClient } from "@client/index";

export const enabled = (client: ScramjetClient) =>
	flagEnabled("cleanErrors", client.url);

export default function (client: ScramjetClient, _self: Self) {
	const closure = (error, stack) => {
		let newstack = error.stack;

		for (let i = 0; i < stack.length; i++) {
			const url = stack[i].getFileName();

			try {
				if (url.endsWith(config.files.all)) {
					const lines = newstack.split("\n");
					const line = lines.find((l) => l.includes(url));
					lines.splice(line, 1);
					newstack = lines.join("\n");
					continue;
				}
			} catch {}

			try {
				newstack = newstack.replaceAll(url, unrewriteUrl(url));
			} catch {}
		}

		return newstack;
	};
	client.Trap("Error.prepareStackTrace", {
		get(_ctx) {
			return closure;
		},
		set(_value) {
		},
	});
}
