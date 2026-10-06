let _CONFIG = {
	wispurl: (typeof location !== "undefined" && location.host) ? ((location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/wisp/") : "wss://wisp.mercurywork.shop/",
	bareurl: (typeof location !== "undefined" && location.origin) ? (location.origin + "/bare/") : "/bare/"
};
