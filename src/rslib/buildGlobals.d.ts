
declare global {
	interface GlobalThis {
		$scramjetLoadController: any;
		$scramjetLoadClient: any;
		$scramjetLoadWorker: any;
		$scramjetRequire: any;
		$scramjetVersion: {
			build: string;
			version: string;
		};
	}
}

declare interface ImportMeta {
	webpackContext?: (request: string, options?: any) => any;
}

declare interface ErrorConstructor {
	stackTraceLimit?: number;
	prepareStackTrace?: (err: Error, stackTraces: NodeJS.CallSite[]) => any;
}
