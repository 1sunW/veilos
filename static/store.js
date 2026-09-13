const defaultBookmarks = [
	{ id: "bm1", name: "Google", url: "https://google.com", icon: "🔍", addedAt: Date.now() },
	{ id: "bm2", name: "YouTube", url: "https://youtube.com", icon: "📺", addedAt: Date.now() },
	{ id: "bm3", name: "GitHub", url: "https://github.com", icon: "💻", addedAt: Date.now() },
	{ id: "bm4", name: "Wikipedia", url: "https://wikipedia.org", icon: "📖", addedAt: Date.now() },
	{ id: "bm5", name: "Reddit", url: "https://reddit.com", icon: "💬", addedAt: Date.now() },
	{ id: "bm6", name: "Discord", url: "https://discord.com", icon: "🎙️", addedAt: Date.now() }
];

const TAB_CLOAK_PRESETS = [
	{ id: "default", name: "VeilOS (Default)", title: "VeilOS", icon: "/favicon.webp" },
	{ id: "classroom", name: "Google Classroom", title: "Classes", icon: "https://ssl.gstatic.com/classroom/favicon.png" },
	{ id: "drive", name: "Google Drive", title: "My Drive - Google Drive", icon: "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png" },
	{ id: "docs", name: "Google Docs", title: "Google Docs", icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
	{ id: "google", name: "Google Search", title: "Google", icon: "https://www.google.com/favicon.ico" },
	{ id: "canvas", name: "Canvas LMS", title: "Canvas", icon: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico" },
	{ id: "desmos", name: "Desmos Calculator", title: "Desmos | Graphing Calculator", icon: "https://www.desmos.com/favicon.ico" },
	{ id: "khan", name: "Khan Academy", title: "Dashboard | Khan Academy", icon: "https://www.khanacademy.org/favicon.ico" },
	{ id: "wikipedia", name: "Wikipedia", title: "Wikipedia", icon: "https://en.wikipedia.org/static/favicon/wikipedia.ico" },
	{ id: "youtube", name: "YouTube", title: "YouTube", icon: "https://www.youtube.com/s/desktop/f2a33f38/img/favicon.ico" },
	{ id: "custom", name: "Custom Tab Cloak", title: "", icon: "" }
];

if (typeof window !== "undefined") {
	window.TAB_CLOAK_PRESETS = TAB_CLOAK_PRESETS;
}

const getLocalWisp = () => {
	if (typeof location !== "undefined" && location.host) {
		return (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/wisp/";
	}
	return "wss://wisp.mercurywork.shop/";
};

const getLocalBare = () => {
	if (typeof location !== "undefined" && location.host) {
		return location.origin + "/bare/";
	}
	return "https://fern.best/bare";
};

const defaultWisp = (typeof _CONFIG !== "undefined" && _CONFIG && _CONFIG.wispurl) ||
	(typeof window !== "undefined" && window._CONFIG && window._CONFIG.wispurl) ||
	"wss://fern.best/wisp";

const defaultBare = (typeof _CONFIG !== "undefined" && _CONFIG && _CONFIG.bareurl) ||
	(typeof window !== "undefined" && window._CONFIG && window._CONFIG.bareurl) ||
	"https://fern.best/bare/";

const defaultNotes = [
	{ id: "note_1", title: "Welcome to VeilOS", content: "# VeilOS Web Operating System\n\nWelcome to your new Web OS!\n\nFeatures:\n- Multi-window desktop manager\n- Veil Web Browser with proxy engine & Chrome extensions\n- Tab Cloaking & presets (Classroom, Drive, Canvas, Desmos, etc.)\n- Blob & About:blank Cloaking\n- Search engine choice (DuckDuckGo, Google, Bing, Brave)\n- Games, Movies, Vault & Chat", updatedAt: Date.now() }
];

// Sanitize localStorage settings to protect Dreamland's $store parser
try {
	if (typeof localStorage !== "undefined") {
		const rawSettings = localStorage.getItem("settings");
		if (rawSettings !== null) {
			let isValid = false;
			try {
				const parsed = JSON.parse(rawSettings);
				if (parsed && typeof parsed === "object" && parsed["0"] && parsed["0"].values && typeof parsed["0"].values === "object") {
					isValid = true;
				}
			} catch (parseErr) {
				isValid = false;
			}
			if (!isValid) {
				console.warn("[VeilOS Store] Found corrupted or incompatible settings in localStorage, resetting key.");
				localStorage.removeItem("settings");
			}
		}
	}
} catch (e) {
	console.warn("[VeilOS Store] Could not access localStorage:", e);
}

const initialSettings = {
	url: "https://google.com",
	wispurl: defaultWisp,
	bareurl: defaultBare,
	proxy: "",
	transport: "/epoxy/index.mjs",
	searchEngine: "google", // "google" | "duckduckgo" | "bing" | "brave"
	tabCloak: "default",
	customCloakTitle: "",
	customCloakIcon: "",
	autoAboutBlank: false,
	bookmarks: defaultBookmarks,
	showBookmarksBar: true,
	history: [
		{ id: "h1", name: "Google", url: "https://google.com", visitedAt: Date.now() - 3600000 }
	],
	wallpaper: "/morning-garden.mp4",
	accentColor: "indigo",
	notes: defaultNotes,
	osUsername: "Veil User",
	dockPosition: "bottom"
};

var store;
try {
	if (typeof $store === "function") {
		store = $store(initialSettings, { ident: "settings", backing: "localstorage", autosave: "auto" });
	} else if (typeof $state === "function") {
		store = $state(initialSettings);
	} else {
		store = initialSettings;
	}
} catch (storeErr) {
	console.error("[VeilOS Store] Error during $store initialization, clearing storage and falling back:", storeErr);
	try {
		if (typeof localStorage !== "undefined") {
			localStorage.removeItem("settings");
		}
	} catch (e) {}

	try {
		if (typeof $store === "function") {
			store = $store(initialSettings, { ident: "settings", backing: "localstorage", autosave: "auto" });
		} else if (typeof $state === "function") {
			store = $state(initialSettings);
		} else {
			store = initialSettings;
		}
	} catch (retryErr) {
		console.error("[VeilOS Store] Retry failed, using reactive or plain fallback:", retryErr);
		store = (typeof $state === "function") ? $state(initialSettings) : initialSettings;
	}
}

// On page refresh / load, set automatically to default wisp and bare
store.wispurl = defaultWisp;
store.bareurl = defaultBare;

if (!store.searchEngine) {
	store.searchEngine = "google";
}
if (!store.tabCloak) {
	store.tabCloak = "default";
}
if (store.autoAboutBlank === undefined) {
	store.autoAboutBlank = false;
}

if (!store.bookmarks || !Array.isArray(store.bookmarks) || store.bookmarks.length === 0) {
	store.bookmarks = defaultBookmarks;
}
if (store.showBookmarksBar === undefined) {
	store.showBookmarksBar = true;
}
if (!store.history || !Array.isArray(store.history)) {
	store.history = [];
}

// Global Tab Cloak Helper
function applyTabCloak(presetId, customTitle, customIcon) {
	const presetKey = presetId || store.tabCloak || "default";
	let title = "VeilOS";
	let icon = "/favicon.webp";

	if (presetKey === "custom") {
		title = customTitle !== undefined ? customTitle : (store.customCloakTitle || "VeilOS");
		icon = customIcon !== undefined ? customIcon : (store.customCloakIcon || "/favicon.webp");
	} else {
		const found = TAB_CLOAK_PRESETS.find(p => p.id === presetKey);
		if (found) {
			title = found.title;
			icon = found.icon;
		}
	}

	if (typeof document !== "undefined") {
		document.title = title || "VeilOS";
		let link = document.querySelector("link[rel*='icon']");
		if (!link) {
			link = document.createElement("link");
			link.rel = "icon";
			document.head.appendChild(link);
		}
		link.href = icon || "/favicon.webp";
	}
	return { title, icon };
}

// Global Cloak Execution Functions
function openAboutBlankCloak(targetUrl) {
	const url = targetUrl || (typeof window !== "undefined" ? window.location.href : "/");
	const cloakInfo = applyTabCloak(store.tabCloak, store.customCloakTitle, store.customCloakIcon);
	
	try {
		const win = window.open("about:blank", "_blank");
		if (!win) {
			alert("Pop-up was blocked! Please enable pop-ups in your browser settings to use About:Blank Cloak.");
			return false;
		}
		const doc = win.document;
		doc.open();
		doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${cloakInfo.title || "Classes"}</title>
	<link rel="icon" href="${cloakInfo.icon || "https://ssl.gstatic.com/classroom/favicon.png"}">
	<style>
		* { box-sizing: border-box; }
		html, body { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; background: #050505; }
		iframe { width: 100%; height: 100%; border: none; outline: none; margin: 0; padding: 0; display: block; }
	</style>
</head>
<body>
	<iframe src="${url}" allow="fullscreen; autoplay; encrypted-media; camera; microphone; clipboard-read; clipboard-write; display-capture"></iframe>
</body>
</html>`);
		doc.close();
		return true;
	} catch (e) {
		console.error("[AboutBlank Cloak Error]", e);
		return false;
	}
}

function openBlobCloak(targetUrl) {
	const url = targetUrl || (typeof window !== "undefined" ? window.location.href : "/");
	const cloakInfo = applyTabCloak(store.tabCloak, store.customCloakTitle, store.customCloakIcon);

	try {
		const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${cloakInfo.title || "My Drive - Google Drive"}</title>
	<link rel="icon" href="${cloakInfo.icon || "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png"}">
	<style>
		* { box-sizing: border-box; }
		html, body { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; background: #050505; }
		iframe { width: 100%; height: 100%; border: none; outline: none; margin: 0; padding: 0; display: block; }
	</style>
</head>
<body>
	<iframe src="${url}" allow="fullscreen; autoplay; encrypted-media; camera; microphone; clipboard-read; clipboard-write; display-capture"></iframe>
</body>
</html>`;

		const blob = new Blob([htmlContent], { type: "text/html" });
		const blobUrl = URL.createObjectURL(blob);
		const win = window.open(blobUrl, "_blank");
		if (!win) {
			// Fallback: navigate current window to blob
			window.location.href = blobUrl;
		}
		return true;
	} catch (e) {
		console.error("[Blob Cloak Error]", e);
		return false;
	}
}

// Initial cloak application on page load
if (typeof window !== "undefined") {
	window.applyTabCloak = applyTabCloak;
	window.openAboutBlankCloak = openAboutBlankCloak;
	window.openBlobCloak = openBlobCloak;
	
	setTimeout(() => {
		applyTabCloak(store.tabCloak, store.customCloakTitle, store.customCloakIcon);

		// Auto About:blank cloak check
		if (store.autoAboutBlank && window.self === window.top && !window.location.href.startsWith("blob:") && !window.location.href.includes("about:blank")) {
			try {
				const cloaked = openAboutBlankCloak(window.location.href);
				if (cloaked) {
					window.location.replace("https://classroom.google.com");
				}
			} catch (err) {
				console.warn("[Auto About:Blank] trigger error:", err);
			}
		}
	}, 50);
}

if (typeof window !== "undefined") {
	window.store = store;
}
if (typeof self !== "undefined") {
	self.store = store;
}
if (typeof globalThis !== "undefined") {
	globalThis.store = store;
}
