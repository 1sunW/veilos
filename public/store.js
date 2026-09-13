const defaultBookmarks = [
	{ id: "bm1", name: "Google", url: "https://google.com", icon: "🔍", addedAt: Date.now() },
	{ id: "bm2", name: "YouTube", url: "https://youtube.com", icon: "📺", addedAt: Date.now() },
	{ id: "bm3", name: "GitHub", url: "https://github.com", icon: "💻", addedAt: Date.now() },
	{ id: "bm4", name: "Wikipedia", url: "https://wikipedia.org", icon: "📖", addedAt: Date.now() },
	{ id: "bm5", name: "Reddit", url: "https://reddit.com", icon: "💬", addedAt: Date.now() },
	{ id: "bm6", name: "Discord", url: "https://discord.com", icon: "🎙️", addedAt: Date.now() }
];

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

const defaultWisp = _CONFIG?.wispurl || "wss://fern.best/wisp";
const defaultBare = _CONFIG?.bareurl || "https://fern.best/bare/";

const defaultNotes = [
	{ id: "note_1", title: "Welcome to Onyx OS", content: "# Onyx Web Operating System\n\nWelcome to your new Web OS!\n\nFeatures:\n- Multi-window desktop manager\n- Onyx Web Browser with proxy engine\n- Gemini AI Workspace\n- Interactive Unix Terminal\n- File Explorer & Notes App\n- Games & Utilities", updatedAt: Date.now() }
];

const store = $store(
	{
		url: "https://google.com",
		wispurl: defaultWisp,
		bareurl: defaultBare,
		proxy: "",
		transport: "/epoxy/index.mjs",
		bookmarks: defaultBookmarks,
		history: [
			{ id: "h1", name: "Google", url: "https://google.com", visitedAt: Date.now() - 3600000 }
		],
		wallpaper: "/morning-garden.mp4",
		accentColor: "indigo",
		notes: defaultNotes,
		osUsername: "Onyx User",
		dockPosition: "bottom"
	},
	{ ident: "settings", backing: "localstorage", autosave: "auto" }
);

// On page refresh / load, set automatically to default wisp and bare
store.wispurl = defaultWisp;
store.bareurl = defaultBare;

if (!store.bookmarks || !Array.isArray(store.bookmarks) || store.bookmarks.length === 0) {
	store.bookmarks = defaultBookmarks;
}
if (!store.history || !Array.isArray(store.history)) {
	store.history = [];
}

self.store = store;
