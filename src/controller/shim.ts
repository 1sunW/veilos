import { ScramjetController } from "./controller";
import { ScramjetFrame, ScramjetHook } from "./frame";

export class Plugin {
	name: string;
	constructor(name: string) {
		this.name = name;
	}
	tap(hook: any, cb: any) {
		if (hook && typeof hook.tap === "function") {
			hook.tap(this.name, cb);
		}
	}
}

export class ManagedPlugin extends Plugin {
	frame: ScramjetFrame = null!;
	dependencies: string[] = [];
	constructor(name: string, dependencies: string[] = []) {
		super(name);
		this.dependencies = dependencies;
	}

	install(frame: ScramjetFrame): void {
		this.frame = frame;
	}
}

export const Controller = ScramjetController;
export const Frame = ScramjetFrame;
export const Hook = ScramjetHook;
export const VERSION = "2.0.0-alpha";
export function assertRuntimeScramjetVersion() {}
export const config = {};
