import { ScramjetClient } from "@client/index";
import { config } from "@/shared";

export const POLLUTANT = Symbol.for("scramjet realm pollutant");

export default function (client: ScramjetClient, self: typeof globalThis) {
	Object.defineProperty(self.Object.prototype, config.globals.setrealmfn, {
		value(pollution: object) {
			Object.defineProperty(this, POLLUTANT, {
				value: pollution,
				writable: false,
				configurable: true,
				enumerable: false,
			});

			return this;
		},
		writable: true,
		configurable: true,
		enumerable: false,
	});
}
