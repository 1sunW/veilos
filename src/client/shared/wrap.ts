import { iswindow } from "@client/entry";
import { SCRAMJETCLIENT } from "@/symbols";
import { ScramjetClient } from "@client/index";
import { config } from "@/shared";
import { indirectEval } from "@client/shared/eval";

export function createWrapFn(client: ScramjetClient, self: typeof globalThis) {
	return function (identifier: any, strict: boolean) {
		if (identifier === self.location) return client.locationProxy;
		if (identifier === self.eval) return indirectEval.bind(client, strict);

		if (iswindow) {
			if (identifier === self.parent) {
				if (SCRAMJETCLIENT in self.parent) {
					return self.parent;
				} else {
					return self;
				}
			} else if (identifier === self.top) {
				let current = self;

				for (;;) {
					const test = current.parent.self;
					if (test === current) break;

					if (!(SCRAMJETCLIENT in test)) break;

					current = test;
				}

				return current;
			}
		}

		return identifier;
	};
}

export const order = 4;
export default function (client: ScramjetClient, self: typeof globalThis) {
	Object.defineProperty(self, config.globals.wrapfn, {
		value: client.wrapfn,
		writable: false,
		configurable: false,
		enumerable: false,
	});
	Object.defineProperty(self, config.globals.wrappropertyfn, {
		value: function (str) {
			if (
				str === "location" ||
				str === "parent" ||
				str === "top" ||
				str === "eval"
			)
				return config.globals.wrappropertybase + str;

			return str;
		},
		writable: false,
		configurable: false,
		enumerable: false,
	});
	Object.defineProperty(self, config.globals.cleanrestfn, {
		value: function (obj) {
		},
		writable: false,
		configurable: false,
		enumerable: false,
	});

	Object.defineProperty(
		self.Object.prototype,
		config.globals.wrappropertybase + "location",
		{
			get: function () {

				if (this === self || this === self.document) {
					return client.locationProxy;
				}

				return this.location;
			},
			set(value: any) {
				if (this === self || this === self.document) {
					client.url = value;

					return;
				}
				this.location = value;
			},
			configurable: false,
			enumerable: false,
		}
	);
	Object.defineProperty(
		self.Object.prototype,
		config.globals.wrappropertybase + "parent",
		{
			get: function () {
				return client.wrapfn(this.parent, false);
			},
			set(value: any) {
				this.parent = value;
			},
			configurable: false,
			enumerable: false,
		}
	);
	Object.defineProperty(
		self.Object.prototype,
		config.globals.wrappropertybase + "top",
		{
			get: function () {
				return client.wrapfn(this.top, false);
			},
			set(value: any) {
				this.top = value;
			},
			configurable: false,
			enumerable: false,
		}
	);
	Object.defineProperty(
		self.Object.prototype,
		config.globals.wrappropertybase + "eval",
		{
			get: function () {
				return client.wrapfn(this.eval, true);
			},
			set(value: any) {
				this.eval = value;
			},
			configurable: false,
			enumerable: false,
		}
	);

	self.$scramitize = function (v) {
		if (v === location) debugger;
		if (iswindow) {
			if (v === self.top) debugger;
		}

		if (typeof v === "string" && v.includes("scramjet")) debugger;
		if (typeof v === "string" && v.includes(location.origin)) debugger;

		return v;
	};

	Object.defineProperty(self, config.globals.trysetfn, {
		value: function (lhs: any, op: string, rhs: any) {
			if (lhs instanceof self.Location) {
				// @ts-ignore
				client.locationProxy.href = rhs;

				return true;
			}

			return false;
		},
		writable: false,
		configurable: false,
	});
}
