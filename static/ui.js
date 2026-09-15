// Google tag (gtag.js)
const script1 = document.createElement('script');
script1.async = true;
script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-CC007RV79S';
document.head.appendChild(script1);

window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-CC007RV79S');

// Ensure store is always defined in ui.js
var store = (typeof window !== "undefined" && window.store) ||
	(typeof self !== "undefined" && self.store) ||
	(typeof store !== "undefined" ? store : null);

if (!store) {
	console.warn("[VeilOS UI] Global store not found, initializing fallback store");
	var fallbackInitial = {
		url: "https://google.com",
		wispurl: (typeof _CONFIG !== "undefined" && _CONFIG && _CONFIG.wispurl) ||
			(typeof window !== "undefined" && window._CONFIG && window._CONFIG.wispurl) ||
			"wss://fern.best/wisp",
		bareurl: (typeof _CONFIG !== "undefined" && _CONFIG && _CONFIG.bareurl) ||
			(typeof window !== "undefined" && window._CONFIG && window._CONFIG.bareurl) ||
			"https://fern.best/bare/",
		proxy: "",
		transport: "/epoxy/index.mjs",
		searchEngine: "google",
		tabCloak: "default",
		customCloakTitle: "",
		customCloakIcon: "",
		autoAboutBlank: false,
		bookmarks: [
			{ id: "bm1", name: "Google", url: "https://google.com", icon: "🔍", addedAt: Date.now() },
			{ id: "bm2", name: "YouTube", url: "https://youtube.com", icon: "📺", addedAt: Date.now() },
			{ id: "bm3", name: "GitHub", url: "https://github.com", icon: "💻", addedAt: Date.now() },
			{ id: "bm4", name: "Wikipedia", url: "https://wikipedia.org", icon: "📖", addedAt: Date.now() },
			{ id: "bm5", name: "Reddit", url: "https://reddit.com", icon: "💬", addedAt: Date.now() },
			{ id: "bm6", name: "Discord", url: "https://discord.com", icon: "🎙️", addedAt: Date.now() }
		],
		history: [
			{ id: "h1", name: "Google", url: "https://google.com", visitedAt: Date.now() - 3600000 }
		],
		wallpaper: "/morning-garden.mp4",
		accentColor: "indigo",
		notes: [
			{ id: "note_1", title: "Welcome to VeilOS", content: "# VeilOS Web Operating System\n\nWelcome to your new Web OS!", updatedAt: Date.now() }
		],
		osUsername: "Veil User",
		dockPosition: "bottom"
	};

	try {
		if (typeof $store === "function") {
			store = $store(fallbackInitial, { ident: "settings", backing: "localstorage", autosave: "auto" });
		} else if (typeof $state === "function") {
			store = $state(fallbackInitial);
		} else {
			store = fallbackInitial;
		}
	} catch (e) {
		store = (typeof $state === "function") ? $state(fallbackInitial) : fallbackInitial;
	}

	if (typeof window !== "undefined") window.store = store;
	if (typeof self !== "undefined") self.store = store;
}

let connection;

window.openSettingsModal = () => {
	const cfg = document.querySelector("dialog.cfg");
	if (cfg) {
		if (typeof cfg.showModal === "function") {
			try {
				if (!cfg.open) cfg.showModal();
			} catch (e) {
				cfg.setAttribute("open", "");
			}
		} else {
			cfg.setAttribute("open", "");
		}
	}
};

window.closeSettingsModal = () => {
	const cfg = document.querySelector("dialog.cfg");
	if (cfg) {
		if (typeof cfg.close === "function") {
			try {
				cfg.close();
			} catch (e) {
				cfg.removeAttribute("open");
			}
		} else {
			cfg.removeAttribute("open");
		}
	}
};

const handleModalClose = (dialogEl) => {
	if (dialogEl && typeof dialogEl.close === "function") {
		try {
			dialogEl.close();
			return;
		} catch (e) {}
	}
	window.closeSettingsModal();
};

const applyTransport = async (transport, wispurl, bareurl) => {
	if (!connection) return;
	try {
		if (transport === "/baremod/index.mjs") {
			await connection.setTransport("/baremod/index.mjs", [bareurl || store.bareurl]);
		} else {
			await connection.setTransport(transport, [{ wisp: wispurl || store.wispurl }]);
		}
	} catch (err) {
		console.warn("Failed to set transport " + transport + ", falling back to Bare 3:", err);
		try {
			await connection.setTransport("/baremod/index.mjs", [bareurl || store.bareurl]);
			store.transport = "/baremod/index.mjs";
		} catch (fallbackErr) {
			console.error("Fallback transport also failed:", fallbackErr);
		}
	}
};

function Config() {
	this.cfgTab = "search"; // "search" | "cloak" | "proxy"

	this.css = `
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 1;
    
    &.cfg {
      background: rgba(10, 10, 15, 0.95) !important;
      color: #f1f5f9;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 24px;
      max-width: 520px;
      width: 92%;
      box-sizing: border-box;
      max-height: 88vh;
      overflow-y: auto;
    }

    &::backdrop {
      background: rgba(0, 0, 0, 0.75) !important;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 12px;
    }

    .modal-title {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      color: #f8fafc;
      font-family: "Inter", sans-serif;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tab-pills {
      display: flex;
      gap: 6px;
      margin-bottom: 18px;
      background: rgba(255, 255, 255, 0.04);
      padding: 4px;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .tab-pills button {
      flex: 1;
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #94a3b8;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .tab-pills button.active {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .section-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 8px;
      font-weight: 700;
    }

    .buttons {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .buttons button {
      flex: 1;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background-color: rgba(255, 255, 255, 0.04);
      border-radius: 12px;
      color: #cbd5e1;
      padding: 10px 14px;
      font-size: 0.85rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .buttons button.active {
      background-color: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
      color: #ffffff;
      box-shadow: 0 0 16px rgba(255, 255, 255, 0.15);
    }

    .buttons button:hover:not(.active) {
      background-color: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
      color: #f1f5f9;
    }

    .input_row {
      margin-bottom: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .input_row label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #94a3b8;
    }

    .input_row input {
      background-color: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: #f1f5f9;
      outline: none;
      padding: 10px 12px;
      font-size: 0.85rem;
      transition: all 0.2s;
      font-family: "IBM Plex Mono", monospace;
    }

    .input_row input:focus {
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 0 12px rgba(255, 255, 255, 0.1);
      background-color: rgba(0, 0, 0, 0.6);
    }

    .status-pill {
      font-family: "IBM Plex Mono", monospace;
      font-size: 0.75rem;
      color: #38bdf8;
      background-color: rgba(56, 189, 248, 0.08);
      border: 1px solid rgba(56, 189, 248, 0.2);
      padding: 10px 14px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 16px;
    }

    .close-btn {
      background: #ffffff;
      color: #000000;
      border: none;
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .close-btn:hover {
      background: #e2e8f0;
      transform: translateY(-1px);
    }

    .close-btn:active {
      transform: translateY(0);
    }
  `;

	function handleModalClose(modal) {
		modal.style.opacity = 0;
		setTimeout(() => {
			modal.close();
			modal.style.opacity = 1;
		}, 250);
	}

	return html`
      <dialog class="cfg">
        <div class="modal-header">
          <div class="modal-title">
            <i class="fa-solid fa-gear text-indigo-400"></i>
            <span>VeilOS Preferences & Cloak</span>
          </div>
        </div>

        <div class="tab-pills">
          <button class=${use(this.cfgTab, (t) => t === "search" ? "active" : "")} on:click=${() => { this.cfgTab = "search"; }}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <span>Search Engine</span>
          </button>
          <button class=${use(this.cfgTab, (t) => t === "cloak" ? "active" : "")} on:click=${() => { this.cfgTab = "cloak"; }}>
            <i class="fa-solid fa-user-secret"></i>
            <span>Cloaking Hub</span>
          </button>
          <button class=${use(this.cfgTab, (t) => t === "proxy" ? "active" : "")} on:click=${() => { this.cfgTab = "proxy"; }}>
            <i class="fa-solid fa-network-wired"></i>
            <span>Proxy</span>
          </button>
        </div>

        ${use(this.cfgTab, (tab) => {
					if (tab === "search") {
						return html`
              <div class="flex flex-col gap-3 mb-4 animate-fade">
                <div class="section-title">Default Search Engine</div>
                <div class="grid grid-cols-2 gap-2 mb-2">
                  <button class="p-3 rounded-xl border transition-all flex items-center gap-2.5 cursor-pointer text-xs font-semibold ${store.searchEngine === 'google' ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-md' : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'}"
                    on:click=${() => { store.searchEngine = "google"; this.cfgTab = "search"; }}>
                    <i class="fa-brands fa-google text-blue-400 text-sm"></i>
                    <span>Google</span>
                  </button>
                  <button class="p-3 rounded-xl border transition-all flex items-center gap-2.5 cursor-pointer text-xs font-semibold ${store.searchEngine === 'duckduckgo' ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-md' : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'}"
                    on:click=${() => { store.searchEngine = "duckduckgo"; this.cfgTab = "search"; }}>
                    <i class="fa-solid fa-shield-halved text-amber-400 text-sm"></i>
                    <span>DuckDuckGo</span>
                  </button>
                  <button class="p-3 rounded-xl border transition-all flex items-center gap-2.5 cursor-pointer text-xs font-semibold ${store.searchEngine === 'bing' ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-md' : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'}"
                    on:click=${() => { store.searchEngine = "bing"; this.cfgTab = "search"; }}>
                    <i class="fa-brands fa-microsoft text-cyan-400 text-sm"></i>
                    <span>Bing</span>
                  </button>
                  <button class="p-3 rounded-xl border transition-all flex items-center gap-2.5 cursor-pointer text-xs font-semibold ${store.searchEngine === 'brave' ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-md' : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'}"
                    on:click=${() => { store.searchEngine = "brave"; this.cfgTab = "search"; }}>
                    <i class="fa-solid fa-fire text-orange-400 text-sm"></i>
                    <span>Brave Search</span>
                  </button>
                </div>
                <div class="text-[11px] text-neutral-400 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed">
                  Queries entered into the address bar will automatically route through your selected search provider.
                </div>
              </div>
            `;
					} else if (tab === "cloak") {
						const presets = window.TAB_CLOAK_PRESETS || [
							{ id: "default", name: "VeilOS (Default)", title: "VeilOS", icon: "/favicon.webp" },
							{ id: "classroom", name: "Google Classroom", title: "Classes", icon: "https://ssl.gstatic.com/classroom/favicon.png" },
							{ id: "drive", name: "Google Drive", title: "My Drive - Google Drive", icon: "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png" },
							{ id: "docs", name: "Google Docs", title: "Google Docs", icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
							{ id: "google", name: "Google Search", title: "Google", icon: "https://www.google.com/favicon.ico" },
							{ id: "canvas", name: "Canvas LMS", title: "Canvas", icon: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico" },
							{ id: "desmos", name: "Desmos Calculator", title: "Desmos | Graphing Calculator", icon: "https://www.desmos.com/favicon.ico" }
						];
						return html`
              <div class="flex flex-col gap-3 mb-4 animate-fade">
                <div class="section-title">Tab Cloak Presets</div>
                <div class="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto custom-scrollbar p-1">
                  ${presets.map(p => html`
                    <button class="p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer text-xs ${store.tabCloak === p.id ? 'bg-indigo-600/30 border-indigo-400 text-white font-semibold' : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'}"
                      on:click=${() => {
												store.tabCloak = p.id;
												if (window.applyTabCloak) window.applyTabCloak(p.id);
												this.cfgTab = "cloak";
											}}>
                      <img src="${p.icon || '/favicon.webp'}" class="w-4 h-4 rounded object-contain shrink-0" onerror="this.src='/favicon.webp'" />
                      <span class="truncate">${p.name}</span>
                    </button>
                  `)}
                </div>

                <div class="section-title mt-2">Stealth Launchers</div>
                <div class="grid grid-cols-2 gap-2">
                  <button class="p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                    on:click=${() => { if (window.openAboutBlankCloak) window.openAboutBlankCloak(); }}>
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <span>About:Blank Cloak</span>
                  </button>
                  <button class="p-2.5 rounded-xl bg-teal-950/60 hover:bg-teal-900/80 border border-teal-500/40 text-teal-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                    on:click=${() => { if (window.openBlobCloak) window.openBlobCloak(); }}>
                    <i class="fa-solid fa-cube"></i>
                    <span>Blob Cloak</span>
                  </button>
                </div>

                <div class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 mt-1">
                  <div class="flex flex-col">
                    <span class="text-xs font-semibold text-white">Auto About:Blank Cloak</span>
                    <span class="text-[10px] text-neutral-400">Launch in disguised about:blank automatically</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" checked=${Boolean(store.autoAboutBlank)}
                      on:change=${(e) => {
												store.autoAboutBlank = Boolean(e.target.checked);
												this.cfgTab = "cloak";
											}} />
                    <div class="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            `;
					} else {
						return html`
              <div class="flex flex-col gap-2 mb-4 animate-fade">
                <div class="section-title">Select Connection Protocol</div>
                <div class="buttons">
                  <button class=${use(store.transport, (t) => t === "/baremod/index.mjs" ? "active" : "")} on:click=${() => {
										store.transport = "/baremod/index.mjs";
										applyTransport("/baremod/index.mjs", store.wispurl, store.bareurl);
									}}>Bare 3</button>
                  <button class=${use(store.transport, (t) => t === "/libcurl/index.mjs" ? "active" : "")} on:click=${() => {
										store.transport = "/libcurl/index.mjs";
										applyTransport("/libcurl/index.mjs", store.wispurl, store.bareurl);
									}}>Libcurl</button>
                  <button class=${use(store.transport, (t) => t === "/epoxy/index.mjs" ? "active" : "")} on:click=${() => {
										store.transport = "/epoxy/index.mjs";
										applyTransport("/epoxy/index.mjs", store.wispurl, store.bareurl);
									}}>Epoxy</button>
                </div>

                <div class="input_row">
                  <label for="wisp_url_input">Wisp Server URL</label>
                  <input id="wisp_url_input" bind:value=${use(store.wispurl)} spellcheck="false" placeholder="wss://fern.best/wisp"></input>
                </div>

                <div class="input_row">
                  <label for="bare_url_input">Bare Server URL</label>
                  <input id="bare_url_input" bind:value=${use(store.bareurl)} spellcheck="false" placeholder="https://fern.best/bare"></input>
                </div>

                <div class="section-title">Active Connection</div>
                <div class="status-pill">
                  ${use(store.transport, (t) => {
										if (t === "/epoxy/index.mjs") return "⚡ Epoxy (WebAssembly TCP)";
										if (t === "/libcurl/index.mjs") return "🌐 Libcurl.js (Wisp Proxy)";
										return "🔗 Bare Server 3 (Classic)";
									})}
                </div>
              </div>
            `;
					}
				})}

        <div>
          <button class="close-btn" on:click=${() => {
						applyTransport(store.transport, store.wispurl, store.bareurl);
						if (window.applyTabCloak) window.applyTabCloak(store.tabCloak, store.customCloakTitle, store.customCloakIcon);
						handleModalClose(this.root);
					}}>
            <i class="fa-solid fa-check"></i>
            <span>Save & Apply Settings</span>
          </button>
        </div>
      </dialog>
  `;
}

window.addEventListener("load", async () => {
	const loadController = window.$scramjetLoadController || globalThis.$scramjetLoadController || (typeof $scramjetLoadController !== "undefined" ? $scramjetLoadController : null);
	if (!loadController) {
		console.error("Scramjet controller loader ($scramjetLoadController) is not defined.");
		return;
	}
	const { ScramjetController } = loadController();

	const scramjet = new ScramjetController({
		files: {
			wasm: "/scram/scramjet.wasm.wasm",
			all: "/scram/scramjet.all.js",
			sync: "/scram/scramjet.sync.js",
		},
		flags: {
			rewriterLogs: false,
			scramitize: false,
			cleanErrors: true,
			sourcemaps: true,
		},
	});

	await scramjet.init();
	window.$scramjet = scramjet;
	window.scramjet = scramjet;
	window.encodeProxyUrl = (url) => {
		try {
			return scramjet.encodeUrl(url);
		} catch (e) {
			return "/scramjet/" + encodeURIComponent(url);
		}
	};
	if ("serviceWorker" in navigator) {
		await navigator.serviceWorker.register("./sw.js");
		if (navigator.serviceWorker.controller) {
			navigator.serviceWorker.controller.postMessage({
				scramjet$type: "loadConfig",
				config: scramjet.config,
			});
		}
	}

	// Initialize Sapphire Chrome Extensions Engine
	const Sapphire = window.Sapphire || globalThis.Sapphire;
	const SapphireContentScriptPlugin = window.SapphireContentScriptPlugin || globalThis.SapphireContentScriptPlugin;

	let sapphire = null;
	if (Sapphire) {
		try {
			sapphire = new Sapphire({
				host: {
					getTabId: (win) => {
						const os = window.osGlobalInstance;
						if (!os) return null;
						for (const osWin of os.windows) {
							if (osWin.customState && osWin.customState.tabs) {
								for (const tab of osWin.customState.tabs) {
									if (tab.frameObj?.frame?.contentWindow === win) {
										return tab.numericId;
									}
								}
							}
						}
						return null;
					},
					getActiveTabId: () => {
						const os = window.osGlobalInstance;
						if (!os) return 1;
						const activeWin = os.windows.find((w) => w.focused && w.customState?.tabs?.length) ||
						                  os.windows.find((w) => w.customState?.tabs?.length);
						if (activeWin && activeWin.customState && activeWin.customState.tabs) {
							const activeTab = activeWin.customState.tabs.find((t) => t.id === activeWin.customState.activeTabId) ||
							                  activeWin.customState.tabs[0];
							return activeTab ? activeTab.numericId : 1;
						}
						return 1;
					},
					getTab: (id) => {
						const os = window.osGlobalInstance;
						if (!os) return null;
						for (const osWin of os.windows) {
							if (osWin.customState && osWin.customState.tabs) {
								const tab = osWin.customState.tabs.find((t) => t.numericId === id);
								if (tab) {
									const rawUrl = tab.url || tab.frameObj?.url || "https://google.com";
									return {
										id: tab.numericId,
										windowId: 1,
										url: rawUrl.startsWith("http") ? rawUrl : (rawUrl.startsWith("about:") ? rawUrl : "https://google.com"),
										title: tab.title || "Tab",
										active: osWin.customState.activeTabId === tab.id,
									};
								}
							}
						}
						return null;
					},
					getAllTabs: () => {
						const all = [];
						const os = window.osGlobalInstance;
						if (!os) return all;
						for (const osWin of os.windows) {
							if (osWin.customState && osWin.customState.tabs) {
								for (const tab of osWin.customState.tabs) {
									const rawUrl = tab.url || tab.frameObj?.url || "https://google.com";
									all.push({
										id: tab.numericId,
										windowId: 1,
										url: rawUrl.startsWith("http") ? rawUrl : (rawUrl.startsWith("about:") ? rawUrl : "https://google.com"),
										title: tab.title || "Tab",
										active: osWin.customState.activeTabId === tab.id,
									});
								}
							}
						}
						return all;
					},
					getTabWindow: (id) => {
						const os = window.osGlobalInstance;
						if (!os) return null;
						for (const osWin of os.windows) {
							if (osWin.customState && osWin.customState.tabs) {
								const tab = osWin.customState.tabs.find((t) => t.numericId === id);
								if (tab && tab.frameObj?.frame?.contentWindow) {
									return tab.frameObj.frame.contentWindow;
								}
							}
						}
						return null;
					},
					openTab: (url, active = true) => {
						const os = window.osGlobalInstance;
						if (!os) return;
						let targetWin = (os.activeWinId ? os.windows.find((w) => w.id === os.activeWinId && w.appId === "browser") : null) ||
						                os.windows.find((w) => w.appId === "browser" && !w.isMinimized) ||
						                os.windows.find((w) => w.appId === "browser");
						if (!targetWin) {
							os.openApp("browser", undefined, { url: url || "https://google.com" });
							return;
						}
						if (targetWin.isMinimized) {
							targetWin.isMinimized = false;
						}
						os.focusWindow(targetWin.id);
						if (targetWin.customState?.hidePopover) {
							targetWin.customState.hidePopover();
						}
						if (typeof targetWin.customState?.createNewTab === "function") {
							targetWin.customState.createNewTab(url || "https://google.com");
						} else {
							targetWin.customState = targetWin.customState || {};
							targetWin.customState.url = url || "https://google.com";
						}
					},
					navigateTab: (id, url) => {
						const os = window.osGlobalInstance;
						if (!os) return;
						if (id !== null && id !== undefined) {
							for (const osWin of os.windows) {
								if (osWin.customState && osWin.customState.tabs) {
									const tab = osWin.customState.tabs.find((t) => t.numericId === id);
									if (tab) {
										tab.url = url;
										if (tab.frameObj?.go) {
											tab.frameObj.go(url);
										}
										return;
									}
								}
							}
						}
						let targetWin = (os.activeWinId ? os.windows.find((w) => w.id === os.activeWinId && w.appId === "browser") : null) ||
						                os.windows.find((w) => w.appId === "browser" && !w.isMinimized) ||
						                os.windows.find((w) => w.appId === "browser");
						if (!targetWin) {
							os.openApp("browser", undefined, { url: url || "https://google.com" });
							return;
						}
						if (targetWin.isMinimized) {
							targetWin.isMinimized = false;
						}
						os.focusWindow(targetWin.id);
						if (targetWin.customState?.hidePopover) {
							targetWin.customState.hidePopover();
						}
						if (typeof targetWin.customState?.createNewTab === "function") {
							targetWin.customState.createNewTab(url || "https://google.com");
						} else {
							targetWin.customState = targetWin.customState || {};
							targetWin.customState.url = url || "https://google.com";
						}
					},
					openExtensionTab: (extId, page, tabId) => {
						const pageUrl = `${window.location.origin}/~/sx/${extId}/${String(page || "").replace(/^\//, "")}`;
						const os = window.osGlobalInstance;
						if (!os) return;
						if (tabId !== null && tabId !== undefined) {
							for (const osWin of os.windows) {
								if (osWin.customState && osWin.customState.tabs) {
									const tab = osWin.customState.tabs.find((t) => t.numericId === tabId);
									if (tab) {
										tab.url = pageUrl;
										if (tab.frameObj?.go) {
											tab.frameObj.go(pageUrl);
										}
										return;
									}
								}
							}
						}
						let targetWin = (os.activeWinId ? os.windows.find((w) => w.id === os.activeWinId && w.appId === "browser") : null) ||
						                os.windows.find((w) => w.appId === "browser" && !w.isMinimized) ||
						                os.windows.find((w) => w.appId === "browser");
						if (!targetWin) {
							os.openApp("browser", undefined, { url: pageUrl });
							return;
						}
						if (targetWin.isMinimized) {
							targetWin.isMinimized = false;
						}
						os.focusWindow(targetWin.id);
						if (targetWin.customState?.hidePopover) {
							targetWin.customState.hidePopover();
						}
						if (typeof targetWin.customState?.createNewTab === "function") {
							targetWin.customState.createNewTab(pageUrl);
						} else {
							targetWin.customState = targetWin.customState || {};
							targetWin.customState.url = pageUrl;
						}
					},
					showNotification: (title, message) => {
						console.log(`[Extension Notification] ${title}: ${message}`);
					},
				},
			});
			await sapphire.init();
			if (typeof sapphire.getPopupUrl !== "function") {
				sapphire.getPopupUrl = async function (extId) {
					if (!extId) return null;
					try {
						const page = typeof this.getExtensionPopupPage === "function" ? this.getExtensionPopupPage(extId) : null;
						if (page) {
							return `${window.location.origin}/~/sx/${extId}/${String(page).replace(/^\//, "")}`;
						}
						const ext = this.registry?.get ? this.registry.get(extId) : null;
						if (ext) {
							const fallback =
								ext.popupPage ||
								ext.manifest?.action?.default_popup ||
								ext.manifest?.browser_action?.default_popup ||
								ext.manifest?.page_action?.default_popup;
							if (fallback) {
								return `${window.location.origin}/~/sx/${extId}/${String(fallback).replace(/^\//, "")}`;
							}
						}
					} catch (e) {
						console.warn("[getPopupUrl] error:", e);
					}
					return null;
				};
			}
			window.sapphire = sapphire;
			console.log("[OnyxOS] Sapphire Chrome Extensions engine initialized");
		} catch (err) {
			console.warn("[OnyxOS] Failed to initialize Sapphire:", err);
		}
	}

	connection = new BareMux.BareMuxConnection("/baremux/worker.js");
	await applyTransport(store.transport || "/baremod/index.mjs", store.wispurl, store.bareurl);

	// Definition of Apps in VeilOS - Onyx Browser, Onyx AI, Helium Vault, SSV Movies, Pulse Games, Cloud Gaming, and Onyx Chat
	const APPS = [
		{ id: "browser", name: "Onyx Browser", icon: "🌐", desc: "Proxy Web Browser with tabs & search", category: "Internet", defaultW: 980, defaultH: 640 },
		{ id: "ai", name: "Onyx AI", icon: "✨", desc: "AI Assistant powered by GLM-5.3 & Emis API", category: "Productivity", defaultW: 940, defaultH: 660 },
		{ id: "vault", name: "Helium Vault", icon: "📺", desc: "Curated Movies, TV Shows, Anime & Direct Streams", category: "Entertainment", defaultW: 1120, defaultH: 740 },
		{ id: "movies", name: "SSV Movies", icon: "🎬", desc: "Proxied movies, TV shows, and streaming player", category: "Entertainment", defaultW: 1080, defaultH: 720 },
		{ id: "games", name: "Pulse Games", icon: "🕹️", desc: "Unblocked arcade with 8 providers & 1,000+ games", category: "Gaming", defaultW: 1080, defaultH: 720 },
		{ id: "cloudgaming", name: "Cloud Gaming", icon: "🎮", desc: "Play cloud games directly at nowgg.fun", category: "Gaming", defaultW: 1040, defaultH: 700 },
		{ id: "chat", name: "Onyx Chat", icon: "💬", desc: "Multi-channel community chat room", category: "Social", defaultW: 860, defaultH: 580 }
	];

	// Main VeilOS Desktop Component
	function VeilOS() {
		window.osGlobalInstance = this;
		this.windows = [];
		this.activeWinId = null;
		this.startMenuOpen = false;
		this.dockOpen = true;
		this.controlCenterOpen = false;
		this.isLocked = false;

		this.animationsEnabled = true;
		this.notificationsEnabled = true;
		this.viewMode = "auto"; // "auto" | "desktop" | "mobile"
		this.searchQuery = "";

		this.daySpacedStr = "W E D N E S D A Y";
		this.dockTimeStr = "7:58 PM";
		this.dockDateStr = "Wed, Sep 2";
		this.cpuLoad = 12;
		this.ramLoad = 34;
		this.topZIndex = 100;

		// Clock & Day Updater
		const updateClock = () => {
			const now = new Date();
			// Day of week uppercase with spaced letters e.g. "W E D N E S D A Y"
			const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
			this.daySpacedStr = dayName.split('').join(' ');

			// Dock Time format e.g. "7:58 PM"
			this.dockTimeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
			// Dock Date format e.g. "Wed, Sep 2"
			this.dockDateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
		};
		updateClock();
		setInterval(updateClock, 1000);

		// Dynamic CPU/RAM simulation
		setInterval(() => {
			this.cpuLoad = Math.floor(8 + Math.random() * 20);
			this.ramLoad = Math.floor(28 + Math.random() * 12);
		}, 3000);

		// Global Keydown Listener for commands & ⌘K search shortcut
		window.addEventListener("keydown", (e) => {
			if (window.sapphire && window.findMatchingCommand && window.triggerCommand) {
				try {
					const match = window.findMatchingCommand(window.sapphire.registry, e);
					if (match) {
						window.triggerCommand(window.sapphire.registry, match.extId, match.name);
					}
				} catch (err) {}
			}
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				this.startMenuOpen = !this.startMenuOpen;
				this.windows = [...this.windows];
			}
		});

		// Window Manager Methods
		this.openApp = (appId, customTitle, customState = {}) => {
			const appDef = APPS.find(a => a.id === appId);
			if (!appDef) return;

			if (appId !== "browser") {
				const existing = this.windows.find(w => w.appId === appId);
				if (existing) {
					if (existing.isMinimized) {
						existing.isMinimized = false;
					} else if (this.activeWinId === existing.id) {
						existing.isMinimized = true;
						const remaining = this.windows.filter(w => w.id !== existing.id && !w.isMinimized);
						this.activeWinId = remaining.length ? remaining[remaining.length - 1].id : null;
						this.windows = [...this.windows];
						return;
					}
					this.focusWindow(existing.id);
					this.windows = [...this.windows];
					this.startMenuOpen = false;
					return;
				}
			}

			const winId = "win_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
			this.topZIndex++;

			const screenW = window.innerWidth;
			const screenH = window.innerHeight;
			const defaultW = Math.min(appDef.defaultW, screenW - 60);
			const defaultH = Math.min(appDef.defaultH, screenH - 120);

			const offsetX = 40 + (this.windows.length % 6) * 30;
			const offsetY = 30 + (this.windows.length % 6) * 30;

			const newWin = {
				id: winId,
				appId: appId,
				title: customTitle || appDef.name,
				icon: appDef.icon,
				x: offsetX,
				y: offsetY,
				w: defaultW,
				h: defaultH,
				isMinimized: false,
				isMaximized: false,
				zIndex: this.topZIndex,
				customState: customState
			};

			this.windows = [...this.windows, newWin];
			this.activeWinId = winId;
			this.startMenuOpen = false;
		};

		this.closeWindow = (winId, e) => {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			const win = this.windows.find(w => w.id === winId);
			if (win) {
				if (win.customState && win.customState.urlPollTimer) {
					clearInterval(win.customState.urlPollTimer);
				}
				if (win.domEl) {
					try { win.domEl.remove(); } catch (err) {}
				}
			}
			this.windows = this.windows.filter(w => w.id !== winId);
			if (this.activeWinId === winId) {
				const remaining = this.windows.filter(w => !w.isMinimized);
				this.activeWinId = remaining.length ? remaining[remaining.length - 1].id : null;
				this.windows.forEach(w => updateWindowStyle(w, this.activeWinId === w.id));
			}
			this.windows = [...this.windows];
		};

		this.minimizeWindow = (winId, e) => {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			const win = this.windows.find(w => w.id === winId);
			if (win) {
				win.isMinimized = true;
				updateWindowStyle(win, false);
				if (this.activeWinId === winId) {
					const remaining = this.windows.filter(w => w.id !== winId && !w.isMinimized);
					this.activeWinId = remaining.length ? remaining[remaining.length - 1].id : null;
					this.windows.forEach(w => updateWindowStyle(w, this.activeWinId === w.id));
				}
				this.windows = [...this.windows];
			}
		};

		this.toggleMaximize = (winId, e) => {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			const win = this.windows.find(w => w.id === winId);
			if (win) {
				win.isMaximized = !win.isMaximized;
				this.focusWindow(winId);
				updateWindowStyle(win, this.activeWinId === winId);
			}
		};

		this.focusWindow = (winId) => {
			const win = this.windows.find(w => w.id === winId);
			if (win) {
				if (win.isMinimized) win.isMinimized = false;
				if (this.activeWinId !== winId || win.zIndex !== this.topZIndex) {
					this.topZIndex++;
					win.zIndex = this.topZIndex;
					this.activeWinId = winId;
					this.windows.forEach(w => updateWindowStyle(w, this.activeWinId === w.id));
					this.windows = [...this.windows];
				} else {
					updateWindowStyle(win, true);
				}
			}
		};

		this.toggleStartMenu = () => {
			this.startMenuOpen = !this.startMenuOpen;
			this.windows = [...this.windows];
		};

		// Dragging Window Handler
		let draggingWin = null;
		let dragOffsetX = 0;
		let dragOffsetY = 0;

		this.startDrag = (winId, e) => {
			if (e.target.closest('button')) return;
			const win = this.windows.find(w => w.id === winId);
			if (!win || win.isMaximized) return;

			this.focusWindow(winId);
			draggingWin = win;
			dragOffsetX = e.clientX - win.x;
			dragOffsetY = e.clientY - win.y;

			const onMouseMove = (moveEv) => {
				if (draggingWin) {
					draggingWin.x = Math.max(0, Math.min(window.innerWidth - 100, moveEv.clientX - dragOffsetX));
					draggingWin.y = Math.max(0, Math.min(window.innerHeight - 80, moveEv.clientY - dragOffsetY));
					if (draggingWin.domEl) {
						draggingWin.domEl.style.left = draggingWin.x + "px";
						draggingWin.domEl.style.top = draggingWin.y + "px";
					}
				}
			};

			const onMouseUp = () => {
				if (draggingWin) {
					if (draggingWin.domEl) {
						draggingWin.domEl.style.left = draggingWin.x + "px";
						draggingWin.domEl.style.top = draggingWin.y + "px";
					}
					draggingWin = null;
				}
				window.removeEventListener("mousemove", onMouseMove);
				window.removeEventListener("mouseup", onMouseUp);
			};

			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
		};

		// Boot default browser window
		setTimeout(() => {
			this.openApp("browser");
		}, 300);

		return html`
			<div class="relative w-screen h-screen overflow-hidden select-none font-sans text-white bg-black">
				
				<!-- ONLY BACKGROUND: Morning Garden Looping Video Background -->
				<div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
					<video 
						autoplay 
						loop 
						muted 
						playsinline
						class="w-full h-full object-cover pointer-events-none"
						src="/morning-garden.mp4">
					</video>
					<div class="absolute inset-0 bg-black/25 pointer-events-none"></div>
				</div>

				<!-- Subtle Screen Ambient Vignette -->
				<div class="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none"></div>

				<!-- TOP CENTER: BIG DAY DISPLAY (e.g., W E D N E S D A Y) -->
				<div class="absolute top-10 sm:top-12 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none select-none w-full px-4">
					<h1 class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.35em] text-white/90 drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] font-sans uppercase">
						${use(this.daySpacedStr)}
					</h1>
				</div>

				<!-- WINDOWS LAYER -->
				<div class="absolute inset-0 pointer-events-none">
					${use(this.windows, (winList) => winList.map(win => renderWindowDOM(win, scramjet, this)))}
				</div>

				<!-- BACKDROP FOR START MENU / FLYOUT (click outside to close) -->
				<div class="fixed inset-0 z-40 bg-transparent"
					style=${use(this.windows, () => this.startMenuOpen ? "display: block;" : "display: none;")}
					on:click=${() => { this.startMenuOpen = false; this.windows = [...this.windows]; }}></div>

				<!-- BOTTOM LEFT FLOATING MENU BUTTON ( ☰ ) -->
				<button class="fixed bottom-4 left-4 z-50 w-11 h-11 rounded-full bg-black/75 hover:bg-black/90 border border-white/20 backdrop-blur-2xl text-white flex items-center justify-center text-lg shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all"
					style=${use(this.windows, () => {
						const active = this.windows.find(w => w.id === this.activeWinId);
						return (active && active.isMaximized && !active.isMinimized) ? "display: none !important;" : "";
					})}
					on:click=${(e) => { e.stopPropagation(); this.toggleStartMenu(); }} title="Toggle System Menu">
					<i class="fa-solid fa-bars text-base"></i>
				</button>

				<!-- LEFT FLYOUT SIDEBAR MENU / APP LAUNCHER -->
				<div class="fixed bottom-16 left-4 z-50 w-80 max-h-[80vh] bg-neutral-950/90 border border-white/20 rounded-3xl p-4 backdrop-blur-2xl text-white shadow-2xl flex flex-col gap-3 font-sans animate-fade overflow-hidden"
					style=${use(this.windows, () => {
						const active = this.windows.find(w => w.id === this.activeWinId);
						if (active && active.isMaximized && !active.isMinimized) return "display: none !important;";
						return this.startMenuOpen ? "display: flex;" : "display: none;";
					})}>
					
					<!-- Header: Branding & Title -->
					<div class="flex items-center justify-between px-1 pb-1 border-b border-white/10">
						<div class="flex items-center gap-2">
							<div class="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs text-indigo-300">
								<i class="fa-solid fa-shapes"></i>
							</div>
							<span class="text-xs font-bold text-white tracking-tight uppercase">VeilOS Launcher</span>
						</div>
						<button class="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white text-xs flex items-center justify-center cursor-pointer transition-colors"
							on:click=${() => { this.startMenuOpen = false; this.windows = [...this.windows]; }} title="Close">
							<i class="fa-solid fa-xmark"></i>
						</button>
					</div>

					<!-- Search input with real-time app filtering -->
					<div class="relative w-full">
						<input class="w-full bg-white/5 border border-white/10 rounded-2xl pl-8 pr-12 py-2 text-xs text-white placeholder-neutral-400 outline-none focus:border-indigo-400 font-sans transition-colors"
							placeholder="Search applications..."
							bind:value=${use(this.searchQuery)}
							on:input=${(e) => { this.searchQuery = e.target.value; this.windows = [...this.windows]; }}
							on:keydown=${(e) => {
								if (e.key === "Enter") {
									const q = (this.searchQuery || "").toLowerCase().trim();
									const match = APPS.find(a => a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)) || APPS[0];
									if (match) {
										this.openApp(match.id);
										this.startMenuOpen = false;
										this.windows = [...this.windows];
									}
								}
							}}></input>
						<i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-[11px] text-neutral-400"></i>
						<span class="absolute right-3 top-2 text-[10px] text-neutral-400 bg-white/10 px-1.5 py-0.5 rounded-md font-mono">↵</span>
					</div>

					<!-- APPLICATIONS LIST -->
					<div class="flex flex-col gap-1 overflow-y-auto max-h-56 pr-1 custom-scrollbar">
						<span class="text-[9px] font-bold text-neutral-400 uppercase tracking-wider px-1">Applications</span>
						${use(this.windows, () => {
							const q = (this.searchQuery || "").toLowerCase().trim();
							const filteredApps = APPS.filter(a => !q || a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q));
							
							if (filteredApps.length === 0) {
								return html`
									<div class="py-4 text-center text-xs text-neutral-500">
										No applications matching "${this.searchQuery}"
									</div>
								`;
							}

							return filteredApps.map(app => html`
								<div class="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/10 active:scale-[0.99] cursor-pointer transition-all border border-transparent hover:border-white/10 group"
									on:click=${() => {
										this.openApp(app.id);
										this.startMenuOpen = false;
										this.windows = [...this.windows];
									}}>
									<div class="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-white/15 border border-white/10 flex items-center justify-center text-lg shrink-0 transition-colors shadow-sm">
										${app.icon}
									</div>
									<div class="flex flex-col min-w-0 flex-1">
										<div class="flex items-center justify-between gap-1">
											<span class="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">${app.name}</span>
											<span class="text-[9px] text-neutral-400 font-mono px-1.5 py-0.5 rounded bg-white/5">${app.category}</span>
										</div>
										<span class="text-[10px] text-neutral-400 truncate">${app.desc}</span>
									</div>
								</div>
							`);
						})}
					</div>

					<div class="h-px bg-white/10 my-0.5"></div>

					<!-- Quick System Toggles -->
					<div class="flex items-center justify-between px-1 py-1">
						<div class="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
							<i class="fa-solid fa-table-columns text-sky-400 text-xs"></i>
							<span>App Dock</span>
						</div>
						<button class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${this.dockOpen ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-white/5 text-neutral-400 hover:text-white'}"
							on:click=${() => { this.dockOpen = !this.dockOpen; this.windows = [...this.windows]; }}>
							${this.dockOpen ? 'Visible' : 'Hidden'}
						</button>
					</div>

					<div class="h-px bg-white/10 my-0.5"></div>

					<!-- Action Menu Items -->
					<div class="grid grid-cols-3 gap-1.5 pt-0.5">
						<button class="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-neutral-200 hover:text-white cursor-pointer transition-all gap-1"
							on:click=${() => {
								this.controlCenterOpen = !this.controlCenterOpen;
								this.startMenuOpen = false;
								this.windows = [...this.windows];
							}} title="Control Center">
							<i class="fa-solid fa-sliders text-amber-400 text-sm"></i>
							<span class="text-[10px] font-medium">Controls</span>
						</button>

						<button class="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-neutral-200 hover:text-white cursor-pointer transition-all gap-1"
							on:click=${() => {
								this.startMenuOpen = false;
								this.windows = [...this.windows];
								window.openSettingsModal();
							}} title="Cloak & System Settings">
							<i class="fa-solid fa-user-secret text-indigo-400 text-sm"></i>
							<span class="text-[10px] font-medium">Settings</span>
						</button>

						<button class="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-rose-300 hover:text-rose-200 cursor-pointer transition-all gap-1"
							on:click=${() => {
								this.isLocked = true;
								this.startMenuOpen = false;
								this.windows = [...this.windows];
							}} title="Lock Screen">
							<i class="fa-solid fa-lock text-rose-400 text-sm"></i>
							<span class="text-[10px] font-medium">Lock</span>
						</button>
					</div>
				</div>

				<!-- FLOATING DOCK (Centered Glass Pill at Bottom - matching image.png) -->
				<div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2 bg-black/75 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-2xl text-white max-w-[95vw] overflow-x-auto transition-all"
					style=${use(this.windows, () => {
						const active = this.windows.find(w => w.id === this.activeWinId);
						if (active && active.isMaximized && !active.isMinimized) return "display: none !important;";
						return this.dockOpen ? "display: flex;" : "display: none;";
					})}>
					
					<!-- Left Launcher Grid Icon ( ::: ) -->
					<button class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center text-sm font-bold text-white cursor-pointer shrink-0"
						on:click=${() => this.toggleStartMenu()} title="App Launcher">
						<i class="fa-solid fa-shapes text-xs"></i>
					</button>

					<div class="w-px h-6 bg-white/15 shrink-0"></div>

					<!-- Dock Application Badges -->
					<div class="flex items-center gap-2 shrink-0">
						<!-- Onyx Browser Badge -->
						<div class="relative group flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-md shrink-0 border border-white/20"
							on:click=${() => this.openApp("browser")} title="Onyx Browser">
							<span class="text-xl drop-shadow-md">🌐</span>
							${use(this.windows, (winList) => winList.some(w => w.appId === "browser") ? html`<div class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>` : null)}
						</div>

						<!-- Onyx AI Badge -->
						<div class="relative group flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-md shrink-0 border border-white/20"
							on:click=${() => this.openApp("ai")} title="Onyx AI (GLM 5.3 & Emis API)">
							<span class="text-xl drop-shadow-md">✨</span>
							${use(this.windows, (winList) => winList.some(w => w.appId === "ai") ? html`<div class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>` : null)}
						</div>

						<!-- Helium Vault Badge -->
						<div class="relative group flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 via-indigo-600 to-cyan-500 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-md shrink-0 border border-white/20"
							on:click=${() => this.openApp("vault")} title="Helium Vault (Movies, TV & Anime Streams)">
							<span class="text-xl drop-shadow-md">📺</span>
							${use(this.windows, (winList) => winList.some(w => w.appId === "vault") ? html`<div class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>` : null)}
						</div>

						<!-- SSV Movies Badge -->
						<div class="relative group flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-800 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-md shrink-0 border border-white/20"
							on:click=${() => this.openApp("movies")} title="SSV Movies & TV (Proxied)">
							<span class="text-xl drop-shadow-md">🎬</span>
							${use(this.windows, (winList) => winList.some(w => w.appId === "movies") ? html`<div class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>` : null)}
						</div>

						<!-- Pulse Games Arcade Badge -->
						<div class="relative group flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-md shrink-0 border border-white/20"
							on:click=${() => this.openApp("games")} title="Pulse Games Arcade">
							<span class="text-xl drop-shadow-md">🕹️</span>
							${use(this.windows, (winList) => winList.some(w => w.appId === "games") ? html`<div class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>` : null)}
						</div>

						<!-- Cloud Gaming Hub Badge -->
						<div class="relative group flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-md shrink-0 border border-white/20"
							on:click=${() => this.openApp("cloudgaming")} title="Cloud Gaming (nowgg.fun)">
							<span class="text-xl drop-shadow-md">🎮</span>
							${use(this.windows, (winList) => winList.some(w => w.appId === "cloudgaming") ? html`<div class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>` : null)}
						</div>

						<!-- Onyx Chat Badge -->
						<div class="relative group flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-md shrink-0 border border-white/20"
							on:click=${() => this.openApp("chat")} title="Onyx Chat">
							<span class="text-xl drop-shadow-md">💬</span>
							${use(this.windows, (winList) => winList.some(w => w.appId === "chat") ? html`<div class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>` : null)}
						</div>
					</div>

					<div class="w-px h-6 bg-white/15 shrink-0"></div>

					<!-- Right end: Clock & Date Widget inside Dock -->
					<div class="flex flex-col items-end shrink-0 pl-1 font-sans cursor-pointer"
						on:click=${() => { this.controlCenterOpen = !this.controlCenterOpen; }}>
						<span class="text-xs sm:text-sm font-bold tracking-tight text-white leading-none">${use(this.dockTimeStr)}</span>
						<span class="text-[10px] text-neutral-400 font-medium leading-tight mt-0.5">${use(this.dockDateStr)}</span>
					</div>
				</div>

				<!-- CONTROL CENTER FLYOUT POPUP -->
				<div class="fixed bottom-16 right-6 z-50 w-72 bg-black/85 border border-white/15 rounded-3xl p-4 backdrop-blur-2xl text-white shadow-2xl flex flex-col gap-3 font-sans animate-fade"
					style=${use(this.controlCenterOpen, (open) => open ? "display: flex;" : "display: none;")}>
					<div class="flex items-center justify-between">
						<div class="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
							<i class="fa-solid fa-sliders text-indigo-400"></i>
							<span>Control Center</span>
						</div>
					</div>
					
					<div class="grid grid-cols-2 gap-2 text-xs">
						<div class="bg-white/10 p-2.5 rounded-2xl flex flex-col gap-1 border border-white/10">
							<span class="text-[10px] text-neutral-400 font-bold uppercase">CPU Load</span>
							<span class="font-mono font-bold text-emerald-400 text-sm">${use(this.cpuLoad)}%</span>
						</div>
						<div class="bg-white/10 p-2.5 rounded-2xl flex flex-col gap-1 border border-white/10">
							<span class="text-[10px] text-neutral-400 font-bold uppercase">RAM Memory</span>
							<span class="font-mono font-bold text-sky-400 text-sm">${use(this.ramLoad)}%</span>
						</div>
					</div>

					<div class="flex items-center justify-between p-2 rounded-2xl bg-white/5 border border-white/10 text-xs">
						<span>Network Proxy</span>
						<div class="px-2.5 py-1 bg-white/10 rounded-xl font-mono text-[10px] text-sky-300">
							${use(store.transport, (t) => t.includes("epoxy") ? "Epoxy (Active)" : t.includes("libcurl") ? "Libcurl (Active)" : "Bare3 (Active)")}
						</div>
					</div>

					<div class="grid grid-cols-2 gap-1.5">
						<button class="py-1.5 px-2 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/40 rounded-xl text-indigo-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
							on:click=${() => { if (window.openAboutBlankCloak) window.openAboutBlankCloak(); }}>
							<i class="fa-solid fa-arrow-up-right-from-square"></i>
							<span>About:Blank</span>
						</button>
						<button class="py-1.5 px-2 bg-teal-950/60 hover:bg-teal-900 border border-teal-500/40 rounded-xl text-teal-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
							on:click=${() => { if (window.openBlobCloak) window.openBlobCloak(); }}>
							<i class="fa-solid fa-cube"></i>
							<span>Blob Cloak</span>
						</button>
					</div>

					<div class="h-px bg-white/10"></div>
					<button class="w-full py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 rounded-2xl text-rose-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
						on:click=${() => location.reload()}>
						<i class="fa-solid fa-rotate-right"></i>
						<span>Restart VeilOS</span>
					</button>
				</div>

				<!-- LOCK SCREEN OVERLAY -->
				<div class="fixed inset-0 z-50 bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-white font-sans animate-fade"
					style=${use(this.isLocked, (locked) => locked ? "display: flex;" : "display: none;")}>
					
					<div class="text-center flex flex-col items-center gap-4 max-w-md">
						<h1 class="text-4xl sm:text-6xl font-extralight tracking-[0.35em] text-white/90 uppercase font-sans">
							${use(this.daySpacedStr)}
						</h1>
						<div class="text-3xl font-bold font-mono tracking-tight text-neutral-300">
							${use(this.dockTimeStr)}
						</div>
						
						<div class="my-6"></div>

						<button class="px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
							on:click=${() => { this.isLocked = false; }}>
							<i class="fa-solid fa-lock-open"></i>
							<span>Unlock VeilOS</span>
						</button>
					</div>
				</div>

				<!-- SYSTEM CONFIG & CLOAKING SETTINGS DIALOG -->
				<${Config}/>

			</div>
		`;
	}

	// Helper function to update window element styles without re-creating DOM or reloading iframes
	function updateWindowStyle(win, isFocused) {
		if (!win || !win.domEl) return;
		if (win.isMinimized) {
			win.domEl.style.display = "none";
		} else {
			win.domEl.style.display = "flex";
		}
		if (win.isMaximized) {
			win.domEl.style.top = "0px";
			win.domEl.style.left = "0px";
			win.domEl.style.width = "100%";
			win.domEl.style.height = "100%";
			win.domEl.style.borderRadius = "0px";
			win.domEl.style.borderWidth = "0px";
			win.domEl.style.zIndex = "100";
		} else {
			win.domEl.style.top = win.y + "px";
			win.domEl.style.left = win.x + "px";
			win.domEl.style.width = win.w + "px";
			win.domEl.style.height = win.h + "px";
			win.domEl.style.borderRadius = "1rem";
			win.domEl.style.borderWidth = "1px";
			win.domEl.style.zIndex = win.zIndex;
		}
		if (isFocused) {
			win.domEl.className = "pointer-events-auto flex flex-col overflow-hidden shadow-2xl border transition-shadow duration-200 border-white/30 shadow-black/80 bg-neutral-950/95 backdrop-blur-2xl";
		} else {
			win.domEl.className = "pointer-events-auto flex flex-col overflow-hidden shadow-2xl border transition-shadow duration-200 border-white/10 bg-neutral-950/90 backdrop-blur-xl";
		}
	}

	// Helper function to render or retrieve persistent Window DOM Node
	function renderWindowDOM(win, scramjet, osInstance) {
		if (win.domEl) {
			updateWindowStyle(win, win.id === osInstance.activeWinId);
			return win.domEl;
		}

		const isFocused = win.id === osInstance.activeWinId;
		const styleStr = win.isMaximized 
			? `position: absolute; top:0; left:0; width:100%; height:100%; z-index:100; display:${win.isMinimized ? 'none' : 'flex'}; border-radius: 0px; border-width: 0px;`
			: `position: absolute; top:${win.y}px; left:${win.x}px; width:${win.w}px; height:${win.h}px; z-index:${win.zIndex}; display:${win.isMinimized ? 'none' : 'flex'}; border-radius: 1rem; border-width: 1px;`;

		const contentEl = renderAppContent(win, scramjet, osInstance);

		const winEl = html`
			<div class="pointer-events-auto flex flex-col overflow-hidden shadow-2xl border transition-shadow duration-200 ${isFocused ? 'border-white/30 shadow-black/80 bg-neutral-950/95 backdrop-blur-2xl' : 'border-white/10 bg-neutral-950/90 backdrop-blur-xl'}"
				style=${styleStr}
				on:mousedown=${(e) => {
					if (!e.target.closest('button')) {
						osInstance.focusWindow(win.id);
					}
				}}>
				
				<!-- Window Titlebar -->
				<div class="h-10 bg-black/60 border-b border-white/10 flex items-center justify-between px-3 cursor-move shrink-0 select-none"
					on:mousedown=${(e) => osInstance.startDrag(win.id, e)}
					on:dblclick=${(e) => osInstance.toggleMaximize(win.id, e)}>
					
					<!-- Traffic Light Controls -->
					<div class="flex items-center gap-2">
						<button class="w-3.5 h-3.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 transition-colors flex items-center justify-center text-[8px] text-rose-950 font-bold cursor-pointer"
							on:mousedown=${(e) => e.stopPropagation()}
							on:click=${(e) => osInstance.closeWindow(win.id, e)} title="Close">
							<i class="fa-solid fa-xmark"></i>
						</button>
						<button class="w-3.5 h-3.5 rounded-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 transition-colors flex items-center justify-center text-[8px] text-amber-950 font-bold cursor-pointer"
							on:mousedown=${(e) => e.stopPropagation()}
							on:click=${(e) => osInstance.minimizeWindow(win.id, e)} title="Minimize">
							<i class="fa-solid fa-minus"></i>
						</button>
						<button class="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 transition-colors flex items-center justify-center text-[8px] text-emerald-950 font-bold cursor-pointer"
							on:mousedown=${(e) => e.stopPropagation()}
							on:click=${(e) => osInstance.toggleMaximize(win.id, e)} title="Maximize">
							<i class="fa-solid fa-up-right-and-down-left-from-center text-[7px]"></i>
						</button>
					</div>

					<!-- Window Title -->
					<div class="flex items-center gap-2 text-xs font-semibold text-neutral-300 truncate max-w-[280px]">
						<span>${win.icon}</span>
						<span>${win.title}</span>
					</div>

					<div class="w-12"></div>
				</div>

				<!-- Window Body -->
				<div class="flex-1 w-full h-full relative overflow-hidden bg-neutral-950">
					${contentEl}
				</div>
			</div>
		`;

		win.domEl = winEl;
		return winEl;
	}

	// Helper function to render specific App content inside an OS Window
	function renderAppContent(win, scramjet, osInstance) {
		const appId = win.appId;

		if (appId === "browser") {
			return renderBrowserApp(win, scramjet, osInstance);
		} else if (appId === "ai") {
			return html`<iframe src="/ai.html" class="w-full h-full border-0 outline-none bg-[#09090d]" allow="fullscreen; clipboard-read; clipboard-write"></iframe>`;
		} else if (appId === "vault") {
			return html`<iframe src="/vault.html" class="w-full h-full border-0 outline-none bg-[#090a12]" allow="fullscreen; autoplay; encrypted-media; picture-in-picture"></iframe>`;
		} else if (appId === "movies") {
			return html`<iframe src="/movies.html" class="w-full h-full border-0 outline-none bg-[#0e001a]" allow="fullscreen; autoplay; encrypted-media; picture-in-picture"></iframe>`;
		} else if (appId === "games") {
			return html`<iframe src="/games.html" class="w-full h-full border-0 outline-none bg-[#090814]"></iframe>`;
		} else if (appId === "chat") {
			return html`<iframe src="/chat.html" class="w-full h-full border-0 outline-none bg-[#0b0b0e]"></iframe>`;
		} else if (appId === "cloudgaming") {
			return renderCloudGamingApp(win, scramjet, osInstance);
		}

		return html`<div class="p-6 text-center text-neutral-400">Application loading...</div>`;
	}

	// 2. Cloud Gaming App Renderer (Pure full-window nowgg.fun webpage)
	function renderCloudGamingApp(win, scramjet, osInstance) {
		if (!win.customState) {
			win.customState = {};
		}

		if (!win.customState.frameObj) {
			const frameObj = scramjet.createFrame();
			frameObj.frame.className = "w-full h-full border-0 outline-none bg-black block";
			frameObj.go("https://nowgg.fun");
			win.customState.frameObj = frameObj;
		}

		const frameObj = win.customState.frameObj;

		return html`
			<div class="w-full h-full relative bg-black overflow-hidden select-text">
				${frameObj.frame}
			</div>
		`;
	}

	// 1. Onyx Browser App Renderer (with Tab System, History & Bookmarks)
	function renderBrowserApp(win, scramjet, osInstance) {
		if (!win.customState) {
			win.customState = {};
		}

		const formatUrl = (targetUrl) => {
			if (!targetUrl) return "https://google.com";
			let clean = ("" + targetUrl).trim();
			const lower = clean.toLowerCase();

			// Normalization for onyx/veil internal URLs and chrome/about aliases
			if (lower === "onyx://bookmarks" || lower === "veil://bookmarks" || lower === "chrome://bookmarks" || lower === "about:bookmarks" || lower === "onyx:bookmarks" || lower === "veil:bookmarks" || lower === "chrome:bookmarks") {
				return "onyx://bookmarks";
			}
			if (lower === "onyx://history" || lower === "veil://history" || lower === "chrome://history" || lower === "about:history" || lower === "onyx:history" || lower === "veil:history" || lower === "chrome:history") {
				return "onyx://history";
			}
			if (lower === "onyx://extensions" || lower === "veil://extensions" || lower === "chrome://extensions" || lower === "about:extensions" || lower === "onyx:extensions" || lower === "veil:extensions" || lower === "chrome:extensions") {
				return "onyx://extensions";
			}
			if (lower === "onyx://settings" || lower === "veil://settings" || lower === "chrome://settings" || lower === "about:settings" || lower === "onyx:settings" || lower === "veil:settings" || lower === "chrome:settings") {
				return "onyx://settings";
			}
			if (lower === "onyx://newtab" || lower === "veil://newtab" || lower === "chrome://newtab" || lower === "about:newtab" || lower === "onyx:newtab" || lower === "veil:newtab" || lower === "chrome:newtab") {
				return "onyx://newtab";
			}

			if (clean.startsWith("onyx://") || clean.startsWith("veil://")) {
				return clean.replace(/^veil:\/\//i, "onyx://");
			}
			if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("about:") || clean.startsWith("data:") || clean.startsWith("blob:")) {
				return clean;
			}
			if (clean.startsWith("/~/sx/")) {
				return window.location.origin + clean;
			}
			if (clean.startsWith("chrome-extension://")) {
				const extPart = clean.slice("chrome-extension://".length);
				return window.location.origin + "/~/sx/" + extPart;
			}
			if (!clean.includes(".") || clean.includes(" ")) {
				const engine = (store.searchEngine || "google").toLowerCase();
				if (engine === "duckduckgo") {
					return "https://duckduckgo.com/?q=" + encodeURIComponent(clean);
				} else if (engine === "bing") {
					return "https://www.bing.com/search?q=" + encodeURIComponent(clean);
				} else if (engine === "brave") {
					return "https://search.brave.com/search?q=" + encodeURIComponent(clean);
				}
				return "https://www.google.com/search?q=" + encodeURIComponent(clean);
			}
			return "https://" + clean;
		};

		const getTitleFromUrl = (urlStr) => {
			if (!urlStr) return "New Tab";
			if (urlStr === "veil://bookmarks" || urlStr === "onyx://bookmarks") return "Bookmarks";
			if (urlStr === "veil://history" || urlStr === "onyx://history") return "History";
			if (urlStr === "veil://extensions" || urlStr === "onyx://extensions") return "Extensions";
			if (urlStr === "veil://settings" || urlStr === "onyx://settings") return "Settings";
			if (urlStr === "veil://newtab" || urlStr === "onyx://newtab") return "New Tab";
			if (urlStr.startsWith("veil://") || urlStr.startsWith("onyx://")) {
				const prefix = urlStr.startsWith("veil://") ? "veil://" : "onyx://";
				const part = urlStr.slice(prefix.length).replace(/\/$/, "");
				return part.charAt(0).toUpperCase() + part.slice(1);
			}
			try {
				const u = new URL(urlStr);
				let host = u.hostname.replace(/^www\./, "");
				return host.charAt(0).toUpperCase() + host.slice(1);
			} catch (e) {
				return urlStr || "New Tab";
			}
		};

		const getIconFromUrl = (urlStr) => {
			if (!urlStr) return '<i class="fa-solid fa-globe"></i>';
			if (urlStr.includes("bookmarks")) return '<i class="fa-solid fa-bookmark text-amber-400"></i>';
			if (urlStr.includes("history")) return '<i class="fa-solid fa-clock-rotate-left text-purple-400"></i>';
			if (urlStr.includes("extensions")) return '<i class="fa-solid fa-puzzle-piece text-emerald-400"></i>';
			if (urlStr.includes("settings")) return '<i class="fa-solid fa-gear text-sky-400"></i>';
			if (urlStr.includes("/~/sx/") || urlStr.startsWith("chrome-extension://")) return '<i class="fa-solid fa-puzzle-piece text-emerald-400"></i>';
			return '<i class="fa-solid fa-globe"></i>';
		};

		const isBookmarked = (url) => {
			if (!url) return false;
			const list = Array.isArray(store.bookmarks) ? store.bookmarks : [];
			return list.some(b => b.url === url);
		};

		const addHistory = (title, url) => {
			if (!url || url.startsWith("data:") || url === "about:blank" || url.startsWith("blob:")) return;
			const list = Array.isArray(store.history) ? [...store.history] : [];
			if (list.length > 0 && list[0].url === url) return;
			const entry = {
				id: "hist_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
				name: title || getTitleFromUrl(url),
				url: url,
				visitedAt: Date.now()
			};
			store.history = [entry, ...list].slice(0, 100);
		};

		// Root container for Browser
		const browserRoot = document.createElement("div");
		browserRoot.className = "flex flex-col w-full h-full bg-neutral-950 text-white font-sans overflow-hidden select-text";

		// Viewport Container (holds all tab iframes persistently)
		if (!win.customState.viewportEl) {
			const vp = document.createElement("div");
			vp.className = "flex-1 w-full h-full relative bg-white overflow-hidden";
			win.customState.viewportEl = vp;
		}

		if (!win.customState.tabs) {
			win.customState.tabs = [];
		}

		if (win.customState.activePanel === undefined) {
			win.customState.activePanel = "none"; // "none" | "bookmarks" | "history"
		}
		if (win.customState.showQuickBookmarks === undefined) {
			win.customState.showQuickBookmarks = (store.showBookmarksBar !== undefined) ? store.showBookmarksBar : true;
		}

		// TAB STRIP BAR
		const tabStrip = document.createElement("div");
		tabStrip.className = "flex items-center justify-between bg-neutral-900 border-b border-white/10 px-2 pt-1.5 gap-2 shrink-0 overflow-x-auto custom-scrollbar";

		const tabsListContainer = document.createElement("div");
		tabsListContainer.className = "flex items-center gap-1 overflow-x-auto min-w-0";

		const panelToggles = document.createElement("div");
		panelToggles.className = "flex items-center gap-1 shrink-0 pb-1";

		const historyToggleBtn = document.createElement("button");
		historyToggleBtn.title = "History (onyx://history)";
		historyToggleBtn.className = "w-7 h-7 rounded-lg text-xs font-medium transition-colors flex items-center justify-center cursor-pointer bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white";
		historyToggleBtn.innerHTML = '<i class="fa-solid fa-clock-rotate-left text-purple-400"></i>';

		const extensionsToggleBtn = document.createElement("button");
		extensionsToggleBtn.title = "Extensions (onyx://extensions)";
		extensionsToggleBtn.className = "w-7 h-7 rounded-lg text-xs font-medium transition-colors flex items-center justify-center cursor-pointer bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white";
		extensionsToggleBtn.innerHTML = '<i class="fa-solid fa-puzzle-piece text-emerald-400"></i>';

		panelToggles.appendChild(historyToggleBtn);
		panelToggles.appendChild(extensionsToggleBtn);
		tabStrip.appendChild(tabsListContainer);
		tabStrip.appendChild(panelToggles);

		// URL NAVIGATION BAR
		const urlBar = document.createElement("div");
		urlBar.className = "flex items-center p-2 gap-2 bg-neutral-900 border-b border-white/10 shrink-0 relative";

		const backBtn = document.createElement("button");
		backBtn.className = "w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center text-xs cursor-pointer";
		backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
		backBtn.title = "Back";

		const fwdBtn = document.createElement("button");
		fwdBtn.className = "w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center text-xs cursor-pointer";
		fwdBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
		fwdBtn.title = "Forward";

		const reloadBtn = document.createElement("button");
		reloadBtn.className = "w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center text-xs cursor-pointer";
		reloadBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
		reloadBtn.title = "Reload";

		const urlInputBox = document.createElement("div");
		urlInputBox.className = "flex-1 flex items-center bg-black/60 border border-white/10 focus-within:border-purple-400 rounded-xl px-3 py-1 gap-2";

		const lockSpan = document.createElement("span");
		lockSpan.className = "text-xs text-emerald-400 flex items-center";
		lockSpan.innerHTML = '<i class="fa-solid fa-lock text-emerald-400 text-xs"></i>';

		const urlInput = document.createElement("input");
		urlInput.className = "flex-1 bg-transparent text-xs text-white font-mono outline-none placeholder-neutral-500";
		urlInput.placeholder = "Search with " + ((store.searchEngine || "Google").charAt(0).toUpperCase() + (store.searchEngine || "Google").slice(1)) + " or enter web address...";

		const starBtn = document.createElement("button");
		starBtn.className = "text-xs hover:scale-125 transition-transform cursor-pointer flex items-center";
		starBtn.innerHTML = '<i class="fa-regular fa-star text-neutral-400"></i>';

		urlInputBox.appendChild(lockSpan);
		urlInputBox.appendChild(urlInput);
		urlInputBox.appendChild(starBtn);

		const goBtn = document.createElement("button");
		goBtn.className = "px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center";
		goBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
		goBtn.title = "Go to URL";

		// EXTENSIONS TOOLBAR CONTAINER (Holds Chrome Extension Action buttons)
		const toolbarExtensions = document.createElement("div");
		toolbarExtensions.className = "flex items-center gap-1.5 shrink-0";

		// FLOATING EXTENSION POPOVER
		const floatingPopover = document.createElement("div");
		floatingPopover.className = "absolute right-2 top-[calc(100%+6px)] z-50 w-[360px] rounded-2xl border border-white/20 bg-[#191a24] shadow-2xl shadow-black/90 overflow-hidden flex flex-col hidden animate-fade";

		function renderExtensionPopup(extId, popupUrl) {
			floatingPopover.innerHTML = "";
			const ext = window.sapphire && window.sapphire.registry?.get ? window.sapphire.registry.get(extId) : null;
			const name = ext?.manifest?.name || "Extension";

			const topBanner = document.createElement("div");
			topBanner.className = "h-11 bg-[#2b2e3c] px-3 flex items-center justify-between border-b border-black/30 shrink-0";
			topBanner.innerHTML = `
				<div class="flex items-center gap-2 truncate">
					<span class="text-sm">🧩</span>
					<span class="text-xs font-bold text-white truncate">${name}</span>
				</div>
			`;
			const closeBtn = document.createElement("button");
			closeBtn.className = "text-neutral-400 hover:text-white text-xs cursor-pointer px-1.5 py-0.5 rounded bg-white/5";
			closeBtn.textContent = "✕";
			closeBtn.onclick = (e) => {
				e.stopPropagation();
				floatingPopover.classList.add("hidden");
				win.customState.activePopup = null;
			};
			topBanner.appendChild(closeBtn);
			floatingPopover.appendChild(topBanner);

			const frameContainer = document.createElement("div");
			frameContainer.className = "w-full h-[450px] bg-white";
			const iframe = document.createElement("iframe");
			iframe.className = "w-full h-full border-0";
			frameContainer.appendChild(iframe);
			floatingPopover.appendChild(frameContainer);

			const activeTab = win.customState?.tabs?.find(t => t.id === win.customState.activeTabId) || win.customState?.tabs?.[0];
			const activeTabId = activeTab ? activeTab.numericId : 1;

			if (window.sapphire && typeof window.sapphire.mountExtensionPopup === "function") {
				window.sapphire.mountExtensionPopup(iframe, extId, activeTabId).catch((err) => {
					console.warn("[renderExtensionPopup] mountExtensionPopup failed, fallback to src:", err);
					iframe.src = popupUrl || `/~/sx/${extId}/popup.html`;
				});
			} else {
				iframe.src = popupUrl || `/~/sx/${extId}/popup.html`;
			}
		}

		win.customState.renderExtensionPopup = renderExtensionPopup;
		win.customState.showExtensionPopover = (extId, popupUrl) => {
			win.customState.activePopup = extId;
			renderExtensionPopup(extId, popupUrl);
			floatingPopover.classList.remove("hidden");
		};

		const renderToolbarExtensions = () => {
			toolbarExtensions.innerHTML = "";

			if (window.sapphire && typeof window.sapphire.getInstalledExtensions === "function") {
				const installed = window.sapphire.getInstalledExtensions();
				installed.filter(ex => ex.enabled).forEach(ex => {
					const extBtn = document.createElement("button");
					extBtn.className = "w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all cursor-pointer shadow-sm relative shrink-0";
					extBtn.title = ex.name || "Extension";
					if (ex.iconUrl) {
						extBtn.innerHTML = `<img src="${ex.iconUrl}" class="w-4 h-4 object-contain rounded" />`;
					} else {
						extBtn.innerHTML = `<span class="text-xs">🧩</span>`;
					}
					extBtn.onclick = async (e) => {
						e.stopPropagation();
						if (!floatingPopover.classList.contains("hidden") && win.customState.activePopup === ex.id) {
							floatingPopover.classList.add("hidden");
							win.customState.activePopup = null;
							return;
						}
						try {
							let popupUrl = null;
							if (typeof window.sapphire.getPopupUrl === "function") {
								popupUrl = await window.sapphire.getPopupUrl(ex.id);
							}
							win.customState.activePopup = ex.id;
							renderExtensionPopup(ex.id, popupUrl);
							floatingPopover.classList.remove("hidden");
						} catch (popupErr) {
							console.error("[ToolbarExtension] Failed to get popup URL:", popupErr);
						}
					};
					toolbarExtensions.appendChild(extBtn);
				});
			}
		};
		win.customState.renderToolbarExtensions = renderToolbarExtensions;

		// Dismiss popover on outside click
		const onDocumentClick = (e) => {
			if (!floatingPopover.classList.contains("hidden")) {
				if (!floatingPopover.contains(e.target) && !toolbarExtensions.contains(e.target)) {
					floatingPopover.classList.add("hidden");
					win.customState.activePopup = null;
				}
			}
		};
		document.addEventListener("mousedown", onDocumentClick);

		renderToolbarExtensions();

		urlBar.appendChild(backBtn);
		urlBar.appendChild(fwdBtn);
		urlBar.appendChild(reloadBtn);
		urlBar.appendChild(urlInputBox);
		urlBar.appendChild(goBtn);
		urlBar.appendChild(toolbarExtensions);
		urlBar.appendChild(floatingPopover);

		// QUICK BOOKMARKS BAR
		const quickBmBar = document.createElement("div");
		quickBmBar.className = "flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 border-b border-white/10 overflow-x-auto text-xs shrink-0 custom-scrollbar";

		// MAIN CONTENT (Viewport + Side Drawer)
		const mainContent = document.createElement("div");
		mainContent.className = "flex-1 w-full h-full relative flex overflow-hidden";

		const drawerContainer = document.createElement("div");
		drawerContainer.className = "h-full flex shrink-0";

		mainContent.appendChild(win.customState.viewportEl);
		mainContent.appendChild(drawerContainer);

		browserRoot.appendChild(tabStrip);
		browserRoot.appendChild(urlBar);
		browserRoot.appendChild(quickBmBar);
		browserRoot.appendChild(mainContent);

		// Tab and Navigation Helpers
		const getActiveTab = () => {
			return win.customState.tabs.find(t => t.id === win.customState.activeTabId) || win.customState.tabs[0];
		};

		const syncActiveTabUrl = (url) => {
			if (document.activeElement !== urlInput) {
				urlInput.value = url || "";
			}
			const isBm = isBookmarked(url);
			starBtn.innerHTML = isBm ? '<i class="fa-solid fa-star text-amber-400"></i>' : '<i class="fa-regular fa-star text-neutral-400"></i>';
			starBtn.title = isBm ? "Remove Bookmark" : "Bookmark this Page";
		};

		let nextTabNumericId = 1;

		// Dedicated Internal Page View Renderer for onyx:// URLs
		const renderInternalPageView = (tabObj, targetUrl) => {
			const container = tabObj.internalEl;
			if (!container) return;
			container.innerHTML = "";

			const lower = (targetUrl || "").toLowerCase();

			// Common Top Header for onyx:// pages
			const headerWrap = document.createElement("div");
			headerWrap.className = "w-full border-b border-white/10 bg-neutral-900/90 backdrop-blur sticky top-0 z-20 px-6 py-4";

			const headerInner = document.createElement("div");
			headerInner.className = "max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap";

			const titleBox = document.createElement("div");
			titleBox.className = "flex items-center gap-3";

			let pageIcon = "⭐";
			let pageTitle = "Bookmarks";
			let pageSub = "Manage and search your saved sites";
			let currentSection = "bookmarks";

			if (lower.startsWith("onyx://history")) {
				pageIcon = "🕒";
				pageTitle = "History";
				pageSub = "View and manage visited pages";
				currentSection = "history";
			} else if (lower.startsWith("onyx://extensions")) {
				pageIcon = "🧩";
				pageTitle = "Extensions";
				pageSub = "Manage, install, and configure browser extensions";
				currentSection = "extensions";
			} else if (lower.startsWith("onyx://settings")) {
				pageIcon = "⚙️";
				pageTitle = "Settings";
				pageSub = "Proxy and browser options";
				currentSection = "settings";
			}

			titleBox.innerHTML = `
				<div class="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-inner">${pageIcon}</div>
				<div>
					<div class="flex items-center gap-2">
						<span class="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">onyx://${currentSection}</span>
					</div>
					<h1 class="text-lg font-bold text-white tracking-tight">${pageTitle}</h1>
				</div>
			`;

			const navTabs = document.createElement("div");
			navTabs.className = "flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10";

			const internalTabs = [
				{ id: "bookmarks", url: "onyx://bookmarks", label: "Bookmarks", icon: "⭐" },
				{ id: "history", url: "onyx://history", label: "History", icon: "🕒" },
				{ id: "extensions", url: "onyx://extensions", label: "Extensions", icon: "🧩" },
				{ id: "settings", url: "onyx://settings", label: "Settings", icon: "⚙️" }
			];

			internalTabs.forEach(it => {
				const isCurrent = currentSection === it.id;
				const tabBtn = document.createElement("button");
				tabBtn.className = `px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
					isCurrent ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-white/5'
				}`;
				tabBtn.innerHTML = `<span>${it.icon}</span><span>${it.label}</span>`;
				tabBtn.onclick = () => handleNav(it.url);
				navTabs.appendChild(tabBtn);
			});

			headerInner.appendChild(titleBox);
			headerInner.appendChild(navTabs);
			headerWrap.appendChild(headerInner);
			container.appendChild(headerWrap);

			const contentArea = document.createElement("div");
			contentArea.className = "max-w-5xl mx-auto p-6 flex flex-col gap-6";

			// 1. BOOKMARKS PAGE
			if (currentSection === "bookmarks") {
				const bms = Array.isArray(store.bookmarks) ? store.bookmarks : [];
				let searchVal = (win.customState.bookmarkPageSearch || "").toLowerCase();

				const toolbarCard = document.createElement("div");
				toolbarCard.className = "flex items-center justify-between gap-3 flex-wrap bg-neutral-900/60 border border-white/10 p-3.5 rounded-2xl";

				const searchInput = document.createElement("input");
				searchInput.className = "flex-1 min-w-[220px] bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-400 outline-none focus:border-amber-400 transition-colors";
				searchInput.placeholder = "Search saved bookmarks...";
				searchInput.value = win.customState.bookmarkPageSearch || "";
				searchInput.oninput = (e) => {
					win.customState.bookmarkPageSearch = e.target.value;
					renderInternalPageView(tabObj, targetUrl);
				};

				const actionsBox = document.createElement("div");
				actionsBox.className = "flex items-center gap-2 shrink-0 flex-wrap";

				const isBarVisible = win.customState.showQuickBookmarks !== false;
				const toggleBarBtn = document.createElement("button");
				toggleBarBtn.id = "toggle_bookmarks_bar_btn";
				toggleBarBtn.className = isBarVisible
					? "px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
					: "px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0";
				toggleBarBtn.title = isBarVisible ? "Hide the bookmarks bar under the navigation address bar" : "Show the bookmarks bar under the navigation address bar";
				toggleBarBtn.innerHTML = isBarVisible
					? `<span>🔖</span><span>Hide Bookmarks Bar</span>`
					: `<span>🔖</span><span>Show Bookmarks Bar</span>`;
				toggleBarBtn.onclick = () => {
					win.customState.showQuickBookmarks = !win.customState.showQuickBookmarks;
					store.showBookmarksBar = win.customState.showQuickBookmarks;
					renderQuickBookmarks();
					renderInternalPageView(tabObj, targetUrl);
				};

				const addBtn = document.createElement("button");
				addBtn.className = "px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shrink-0";
				addBtn.innerHTML = `<span>＋</span><span>Add Bookmark</span>`;

				actionsBox.appendChild(toggleBarBtn);
				actionsBox.appendChild(addBtn);

				toolbarCard.appendChild(searchInput);
				toolbarCard.appendChild(actionsBox);
				contentArea.appendChild(toolbarCard);

				// Inline Add Bookmark Form (collapsible)
				const addForm = document.createElement("div");
				addForm.className = "p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col gap-3 hidden animate-fade";
				addForm.innerHTML = `
					<div class="text-xs font-bold text-amber-300 flex items-center gap-2">
						<span>⭐</span><span>New Bookmark Details</span>
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
						<input id="bm_name_input" class="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-400 outline-none focus:border-amber-400" placeholder="Bookmark Title (e.g. Google)" />
						<input id="bm_url_input" class="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-400 outline-none focus:border-amber-400" placeholder="Bookmark URL (e.g. https://google.com)" />
					</div>
					<div class="flex items-center justify-end gap-2 pt-1">
						<button id="bm_cancel_btn" class="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white bg-white/5 cursor-pointer">Cancel</button>
						<button id="bm_save_btn" class="px-4 py-1.5 rounded-lg text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 cursor-pointer">Save Bookmark</button>
					</div>
				`;
				addBtn.onclick = () => {
					addForm.classList.toggle("hidden");
					if (!addForm.classList.contains("hidden")) {
						const nameEl = addForm.querySelector("#bm_name_input");
						if (nameEl) nameEl.focus();
					}
				};
				const cancelBtn = addForm.querySelector("#bm_cancel_btn");
				if (cancelBtn) cancelBtn.onclick = () => addForm.classList.add("hidden");

				const saveBtn = addForm.querySelector("#bm_save_btn");
				if (saveBtn) {
					saveBtn.onclick = () => {
						const nameEl = addForm.querySelector("#bm_name_input");
						const urlEl = addForm.querySelector("#bm_url_input");
						const nameVal = nameEl ? nameEl.value.trim() : "";
						const rawUrl = urlEl ? urlEl.value.trim() : "";
						if (!rawUrl) return;
						const cleanUrl = formatUrl(rawUrl);
						const newBm = {
							id: "bm_" + Date.now(),
							name: nameVal || getTitleFromUrl(cleanUrl),
							url: cleanUrl,
							icon: "⭐",
							addedAt: Date.now()
						};
						store.bookmarks = [newBm, ...bms];
						renderQuickBookmarks();
						renderInternalPageView(tabObj, targetUrl);
					};
				}
				contentArea.appendChild(addForm);

				// Filtered List
				const filtered = bms.filter(b => !searchVal || (b.name && b.name.toLowerCase().includes(searchVal)) || (b.url && b.url.toLowerCase().includes(searchVal)));

				const grid = document.createElement("div");
				grid.className = "grid grid-cols-1 md:grid-cols-2 gap-3";

				filtered.forEach(bm => {
					const card = document.createElement("div");
					card.className = "group flex items-center justify-between p-3.5 rounded-2xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-white/10 hover:border-amber-400/40 transition-all shadow-sm";

					const info = document.createElement("div");
					info.className = "flex items-center gap-3 min-w-0 flex-1 cursor-pointer pr-3";
					info.innerHTML = `
						<div class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-base shrink-0 group-hover:bg-amber-500/20 transition-colors">${bm.icon || '⭐'}</div>
						<div class="flex flex-col min-w-0 flex-1">
							<span class="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">${bm.name}</span>
							<span class="text-[11px] font-mono text-neutral-400 truncate mt-0.5">${bm.url}</span>
						</div>
					`;
					info.onclick = () => handleNav(bm.url);

					const actions = document.createElement("div");
					actions.className = "flex items-center gap-1.5 shrink-0";

					const openTabBtn = document.createElement("button");
					openTabBtn.className = "w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center justify-center text-xs cursor-pointer";
					openTabBtn.title = "Open in New Tab";
					openTabBtn.textContent = "↗";
					openTabBtn.onclick = () => createNewTab(bm.url);

					const copyBtn = document.createElement("button");
					copyBtn.className = "w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center justify-center text-xs cursor-pointer";
					copyBtn.title = "Copy URL";
					copyBtn.textContent = "📋";
					copyBtn.onclick = () => {
						navigator.clipboard?.writeText(bm.url);
						copyBtn.textContent = "✓";
						setTimeout(() => { copyBtn.textContent = "📋"; }, 1200);
					};

					const delBtn = document.createElement("button");
					delBtn.className = "w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 flex items-center justify-center text-xs cursor-pointer";
					delBtn.title = "Delete Bookmark";
					delBtn.textContent = "🗑️";
					delBtn.onclick = () => {
						store.bookmarks = bms.filter(b => b.id !== bm.id);
						renderQuickBookmarks();
						renderInternalPageView(tabObj, targetUrl);
					};

					actions.appendChild(openTabBtn);
					actions.appendChild(copyBtn);
					actions.appendChild(delBtn);

					card.appendChild(info);
					card.appendChild(actions);
					grid.appendChild(card);
				});

				if (filtered.length === 0) {
					const emptyBox = document.createElement("div");
					emptyBox.className = "col-span-full flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-2xl bg-neutral-900/30";
					emptyBox.innerHTML = `
						<span class="text-3xl mb-2">⭐</span>
						<h3 class="text-sm font-bold text-white mb-1">${bms.length === 0 ? 'No Bookmarks Saved Yet' : 'No Matching Bookmarks Found'}</h3>
						<p class="text-xs text-neutral-400 max-w-sm mb-4">Click "Add Bookmark" above or click the star button in the URL bar while browsing any page.</p>
					`;
					grid.appendChild(emptyBox);
				}

				contentArea.appendChild(grid);
			}

			// 2. HISTORY PAGE
			else if (currentSection === "history") {
				const hists = Array.isArray(store.history) ? store.history : [];
				let searchVal = (win.customState.historyPageSearch || "").toLowerCase();

				const toolbarCard = document.createElement("div");
				toolbarCard.className = "flex items-center justify-between gap-3 flex-wrap bg-neutral-900/60 border border-white/10 p-3.5 rounded-2xl";

				const searchInput = document.createElement("input");
				searchInput.className = "flex-1 min-w-[220px] bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-400 outline-none focus:border-purple-400 transition-colors";
				searchInput.placeholder = "Search browsing history...";
				searchInput.value = win.customState.historyPageSearch || "";
				searchInput.oninput = (e) => {
					win.customState.historyPageSearch = e.target.value;
					renderInternalPageView(tabObj, targetUrl);
				};

				const clearAllBtn = document.createElement("button");
				clearAllBtn.className = "px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shrink-0";
				clearAllBtn.innerHTML = `<span>🗑️</span><span>Clear Browsing Data</span>`;
				clearAllBtn.onclick = () => {
					if (confirm("Clear all recorded browsing history?")) {
						store.history = [];
						renderInternalPageView(tabObj, targetUrl);
					}
				};

				toolbarCard.appendChild(searchInput);
				toolbarCard.appendChild(clearAllBtn);
				contentArea.appendChild(toolbarCard);

				// Filtered List
				const filtered = hists.filter(h => !searchVal || (h.name && h.name.toLowerCase().includes(searchVal)) || (h.url && h.url.toLowerCase().includes(searchVal)));

				const listContainer = document.createElement("div");
				listContainer.className = "flex flex-col gap-2";

				filtered.forEach(h => {
					const row = document.createElement("div");
					row.className = "group flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-white/10 hover:border-purple-500/40 transition-all shadow-sm";

					const timeStr = h.visitedAt ? new Date(h.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

					const info = document.createElement("div");
					info.className = "flex items-center gap-3 min-w-0 flex-1 cursor-pointer pr-3";
					info.innerHTML = `
						<span class="text-xs text-neutral-400 font-mono shrink-0 w-16">${timeStr}</span>
						<div class="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs shrink-0">${getIconFromUrl(h.url)}</div>
						<div class="flex flex-col min-w-0 flex-1">
							<span class="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">${h.name}</span>
							<span class="text-[11px] font-mono text-neutral-400 truncate mt-0.5">${h.url}</span>
						</div>
					`;
					info.onclick = () => handleNav(h.url);

					const actions = document.createElement("div");
					actions.className = "flex items-center gap-1.5 shrink-0";

					const openTabBtn = document.createElement("button");
					openTabBtn.className = "w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center justify-center text-xs cursor-pointer";
					openTabBtn.title = "Open in New Tab";
					openTabBtn.textContent = "↗";
					openTabBtn.onclick = () => createNewTab(h.url);

					const copyBtn = document.createElement("button");
					copyBtn.className = "w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center justify-center text-xs cursor-pointer";
					copyBtn.title = "Copy URL";
					copyBtn.textContent = "📋";
					copyBtn.onclick = () => {
						navigator.clipboard?.writeText(h.url);
						copyBtn.textContent = "✓";
						setTimeout(() => { copyBtn.textContent = "📋"; }, 1200);
					};

					const delBtn = document.createElement("button");
					delBtn.className = "w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 flex items-center justify-center text-xs cursor-pointer";
					delBtn.title = "Remove from history";
					delBtn.textContent = "✕";
					delBtn.onclick = () => {
						store.history = hists.filter(item => item.id !== h.id);
						renderInternalPageView(tabObj, targetUrl);
					};

					actions.appendChild(openTabBtn);
					actions.appendChild(copyBtn);
					actions.appendChild(delBtn);

					row.appendChild(info);
					row.appendChild(actions);
					listContainer.appendChild(row);
				});

				if (filtered.length === 0) {
					const emptyBox = document.createElement("div");
					emptyBox.className = "flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-2xl bg-neutral-900/30";
					emptyBox.innerHTML = `
						<span class="text-3xl mb-2">🕒</span>
						<h3 class="text-sm font-bold text-white mb-1">${hists.length === 0 ? 'No Browsing History Yet' : 'No Matching History Found'}</h3>
						<p class="text-xs text-neutral-400 max-w-sm">Web pages you visit will automatically appear here.</p>
					`;
					listContainer.appendChild(emptyBox);
				}

				contentArea.appendChild(listContainer);
			}

			// 3. EXTENSIONS PAGE
			else if (currentSection === "extensions") {
				const exts = window.sapphire ? window.sapphire.getInstalledExtensions() : [];
				const activeTab = win.customState.extensionPageTab || "store";

				// Top Navigation Tabs
				const tabsContainer = document.createElement("div");
				tabsContainer.className = "flex items-center gap-2 border-b border-white/10 pb-3 flex-wrap";

				const createTabBtn = (id, label, icon, badge) => {
					const btn = document.createElement("button");
					const isActive = activeTab === id;
					btn.className = `px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
						isActive
							? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/40"
							: "bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5"
					}`;
					btn.innerHTML = `<span>${icon}</span><span>${label}</span>${
						badge !== undefined
							? `<span class="px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-neutral-400'}">${badge}</span>`
							: ""
					}`;
					btn.onclick = () => {
						win.customState.extensionPageTab = id;
						renderInternalPageView(tabObj, targetUrl);
					};
					return btn;
				};

				tabsContainer.appendChild(createTabBtn("store", "Chrome Web Store", "🛒"));
				tabsContainer.appendChild(createTabBtn("installed", "Installed Extensions", "🧩", exts.length));
				tabsContainer.appendChild(createTabBtn("upload", "Upload Archive", "📦"));
				contentArea.appendChild(tabsContainer);

				// Notification banner if any
				if (win.customState.extensionBanner) {
					const banner = document.createElement("div");
					banner.className = "p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between gap-3 shadow-md animate-fade-in";
					banner.innerHTML = `
						<div class="flex items-center gap-2">
							<span class="text-base">🎉</span>
							<span>${win.customState.extensionBanner}</span>
						</div>
					`;
					const closeBannerBtn = document.createElement("button");
					closeBannerBtn.className = "text-emerald-400 hover:text-emerald-200 text-xs font-bold px-2 py-1 rounded cursor-pointer";
					closeBannerBtn.textContent = "✕";
					closeBannerBtn.onclick = () => {
						win.customState.extensionBanner = null;
						banner.remove();
					};
					banner.appendChild(closeBannerBtn);
					contentArea.appendChild(banner);
				}

				// TAB 1: CHROME WEB STORE
				if (activeTab === "store") {
					const storeWrap = document.createElement("div");
					storeWrap.className = "flex flex-col gap-5";

					// Search Box & Quick Chips
					const searchHero = document.createElement("div");
					searchHero.className = "p-6 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-emerald-950/30 border border-white/10 shadow-xl flex flex-col gap-4";

					const heroHeader = document.createElement("div");
					heroHeader.className = "flex flex-col gap-1";
					heroHeader.innerHTML = `
						<div class="flex items-center gap-2">
							<span class="text-base">🔍</span>
							<h2 class="text-sm font-bold text-white uppercase tracking-wider">Search Chrome Web Store</h2>
						</div>
						<p class="text-xs text-neutral-400">Search by extension name, keyword, Chrome Web Store URL, or 32-character extension ID.</p>
					`;
					searchHero.appendChild(heroHeader);

					// Search Input Bar
					const searchBarWrap = document.createElement("div");
					searchBarWrap.className = "flex items-center gap-2";

					const searchInput = document.createElement("input");
					searchInput.className = "flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-400 outline-none focus:border-emerald-400 transition-all shadow-inner";
					searchInput.placeholder = "e.g. Dark Reader, uBlock Origin Lite, SponsorBlock, React DevTools, or paste CWS link / ID...";
					searchInput.value = win.customState.webStoreQuery || "";

					const searchBtn = document.createElement("button");
					searchBtn.className = "px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0";
					searchBtn.innerHTML = `<span>🔍</span><span>Search</span>`;

					const clearBtn = document.createElement("button");
					clearBtn.className = `px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-bold text-xs transition-all cursor-pointer ${
						searchInput.value ? "" : "hidden"
					}`;
					clearBtn.textContent = "Clear";

					searchBarWrap.appendChild(searchInput);
					searchBarWrap.appendChild(clearBtn);
					searchBarWrap.appendChild(searchBtn);
					searchHero.appendChild(searchBarWrap);

					// Quick Category / Filter Pills
					const pillsRow = document.createElement("div");
					pillsRow.className = "flex items-center gap-1.5 flex-wrap text-xs";

					const pills = [
						{ label: "Popular", query: "popular", icon: "⭐" },
						{ label: "Ad Blockers", query: "adblock", icon: "🛡️" },
						{ label: "Dark Mode", query: "dark mode", icon: "🌙" },
						{ label: "Developer Tools", query: "developer tools", icon: "🛠️" },
						{ label: "Productivity", query: "productivity", icon: "⚡" },
						{ label: "Media & YouTube", query: "youtube", icon: "▶️" },
					];

					pills.forEach(p => {
						const pillBtn = document.createElement("button");
						pillBtn.className = "px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[11px] font-medium border border-white/5 transition-all flex items-center gap-1.5 cursor-pointer";
						pillBtn.innerHTML = `<span>${p.icon}</span><span>${p.label}</span>`;
						pillBtn.onclick = () => {
							searchInput.value = p.query;
							clearBtn.classList.remove("hidden");
							triggerSearch(p.query);
						};
						pillsRow.appendChild(pillBtn);
					});
					searchHero.appendChild(pillsRow);
					storeWrap.appendChild(searchHero);

					// Results Container
					const resultsWrap = document.createElement("div");
					resultsWrap.className = "flex flex-col gap-3";

					const resultsHeader = document.createElement("div");
					resultsHeader.className = "flex items-center justify-between px-1";
					resultsHeader.innerHTML = `
						<span class="text-xs font-bold text-neutral-300 uppercase tracking-wider" id="cws-results-title">Extensions</span>
						<span class="text-[11px] text-neutral-400 font-mono" id="cws-results-count"></span>
					`;
					resultsWrap.appendChild(resultsHeader);

					const cardsGrid = document.createElement("div");
					cardsGrid.className = "grid grid-cols-1 md:grid-cols-2 gap-4";
					resultsWrap.appendChild(cardsGrid);
					storeWrap.appendChild(resultsWrap);

					const triggerSearch = async (q) => {
						const query = (q !== undefined ? q : searchInput.value).trim();
						win.customState.webStoreQuery = query;

						cardsGrid.innerHTML = `
							<div class="col-span-full flex flex-col items-center justify-center p-12 text-center border border-white/10 rounded-2xl bg-neutral-900/40">
								<span class="text-2xl animate-spin mb-3">⏳</span>
								<div class="text-xs font-bold text-white mb-1">Searching Chrome Web Store...</div>
								<div class="text-[11px] text-neutral-400">Querying live extension repository</div>
							</div>
						`;
						try {
							const res = await fetch(`/api/webstore/search?q=${encodeURIComponent(query || "popular")}`);
							if (!res.ok) throw new Error(`Search failed: HTTP ${res.status}`);
							const data = await res.json();
							renderSearchResults(data.results || [], query);
						} catch (err) {
							console.error("[CWS Search Error]", err);
							cardsGrid.innerHTML = `
								<div class="col-span-full flex flex-col items-center justify-center p-10 text-center border border-rose-500/20 rounded-2xl bg-rose-950/20">
									<span class="text-2xl text-rose-400 mb-2">✕</span>
									<div class="text-xs font-bold text-rose-300 mb-1">Search Error</div>
									<div class="text-[11px] text-neutral-400 max-w-sm mb-3">${err.message || 'Unable to load extensions'}</div>
									<button class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-bold cursor-pointer" id="cws-retry-btn">Retry</button>
								</div>
							`;
							const retryBtn = cardsGrid.querySelector("#cws-retry-btn");
							if (retryBtn) retryBtn.onclick = () => triggerSearch(query);
						}
					};

					const renderSearchResults = (items, currentQuery) => {
						const countEl = resultsWrap.querySelector("#cws-results-count");
						const titleEl = resultsWrap.querySelector("#cws-results-title");
						if (countEl) countEl.textContent = `${items.length} Available`;
						if (titleEl) titleEl.textContent = currentQuery ? `Results for "${currentQuery}"` : "Featured & Popular";

						cardsGrid.innerHTML = "";

						if (items.length === 0) {
							cardsGrid.innerHTML = `
								<div class="col-span-full flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-2xl bg-neutral-900/30">
									<span class="text-3xl mb-2">🔍</span>
									<h3 class="text-sm font-bold text-white mb-1">No Extensions Found</h3>
									<p class="text-xs text-neutral-400 max-w-sm">Try searching for a different keyword or paste a direct Chrome Web Store link.</p>
								</div>
							`;
							return;
						}

						items.forEach(item => {
							const isInstalled = exts.some(e => e.id === item.id || (e.name && item.name && e.name.toLowerCase() === item.name.toLowerCase()));
							const card = document.createElement("div");
							card.className = "p-4 rounded-2xl bg-neutral-900/70 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3 shadow-md";

							const topSection = document.createElement("div");
							topSection.className = "flex flex-col gap-2.5";

							const headerRow = document.createElement("div");
							headerRow.className = "flex items-start justify-between gap-3";

							const iconImg = item.icon
								? `<img src="${item.icon}" class="w-11 h-11 rounded-xl object-contain bg-black/50 p-1.5 border border-white/10 shrink-0" onerror="this.src='';this.className='hidden'" />`
								: `<div class="w-11 h-11 rounded-xl bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 flex items-center justify-center text-xl shrink-0 font-bold">${item.name.charAt(0)}</div>`;

							const titleBlock = document.createElement("div");
							titleBlock.className = "flex flex-col min-w-0 flex-1";

							// Star string helper
							const starStr = item.rating
								? `★ ${item.rating}${item.ratingCount ? ` (${item.ratingCount > 999 ? (item.ratingCount / 1000).toFixed(1) + 'k' : item.ratingCount})` : ''}`
								: "Chrome Extension";

							const userStr = item.users
								? `👥 ${item.users >= 1000000 ? (item.users / 1000000).toFixed(0) + 'M+' : (item.users / 1000).toFixed(0) + 'k+'} users`
								: "";

							titleBlock.innerHTML = `
								<div class="flex items-center gap-1.5">
									<h3 class="text-xs font-bold text-white truncate" title="${item.name}">${item.name}</h3>
									<span class="text-[10px] text-emerald-400">✓</span>
								</div>
								<div class="flex items-center gap-2 flex-wrap mt-0.5">
									<span class="text-[10px] font-semibold text-amber-400">${starStr}</span>
									${userStr ? `<span class="text-[10px] text-neutral-400 font-mono">${userStr}</span>` : ""}
								</div>
							`;

							headerRow.innerHTML = iconImg;
							headerRow.appendChild(titleBlock);
							topSection.appendChild(headerRow);

							// Description
							if (item.description) {
								const descEl = document.createElement("p");
								descEl.className = "text-xs text-neutral-300 line-clamp-2 leading-relaxed";
								descEl.textContent = item.description;
								topSection.appendChild(descEl);
							}

							card.appendChild(topSection);

							// Action Row
							const actionRow = document.createElement("div");
							actionRow.className = "flex items-center justify-between pt-2.5 border-t border-white/10 gap-2";

							const idBadge = document.createElement("span");
							idBadge.className = "text-[10px] font-mono text-neutral-400 truncate max-w-[140px]";
							idBadge.textContent = item.id.substring(0, 16) + "...";
							idBadge.title = `Extension ID: ${item.id}`;

							actionRow.appendChild(idBadge);

							if (isInstalled) {
								const installedBadge = document.createElement("div");
								installedBadge.className = "flex items-center gap-2";
								installedBadge.innerHTML = `
									<span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
										<span>✓</span><span>Installed</span>
									</span>
								`;
								actionRow.appendChild(installedBadge);
							} else {
								const installBtn = document.createElement("button");
								installBtn.className = "px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0";
								installBtn.innerHTML = `<span>➕</span><span>Add to Browser</span>`;

								installBtn.onclick = async () => {
									installBtn.disabled = true;
									installBtn.className = "px-3.5 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold flex items-center gap-1.5 cursor-wait shrink-0";
									installBtn.innerHTML = `<span class="animate-spin">⏳</span><span>Downloading...</span>`;

									try {
										const res = await fetch(`/api/webstore/download?id=${encodeURIComponent(item.id)}`);
										if (!res.ok) {
											const errJson = await res.json().catch(() => ({}));
											throw new Error(errJson.error || `Download failed (HTTP ${res.status})`);
										}

										installBtn.innerHTML = `<span class="animate-spin">⚙️</span><span>Installing...</span>`;
										let buffer = await res.arrayBuffer();

										if (window.normalizeExtensionBuffer) {
											buffer = await window.normalizeExtensionBuffer(buffer, `${item.id}.crx`);
										}

										await window.sapphire.installExtension(buffer, `${item.id}.crx`);

										installBtn.className = "px-3.5 py-1.5 rounded-xl bg-emerald-600/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 shrink-0";
										installBtn.innerHTML = `<span>✓</span><span>Installed!</span>`;

										win.customState.extensionBanner = `Installed "${item.name}"! The extension is now active.`;

										if (typeof win.customState.renderToolbarExtensions === "function") {
											win.customState.renderToolbarExtensions();
										}

										setTimeout(() => {
											renderInternalPageView(tabObj, targetUrl);
										}, 800);
									} catch (err) {
										console.error("[Extension Install Error]", err);
										installBtn.disabled = false;
										installBtn.className = "px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0";
										installBtn.innerHTML = `<span>✕</span><span>Retry</span>`;
										alert(`Installation failed for "${item.name}":\n${err.message || 'Unknown error'}`);
									}
								};

								actionRow.appendChild(installBtn);
							}

							card.appendChild(actionRow);
							cardsGrid.appendChild(card);
						});
					};

					// Event listeners for search
					searchBtn.onclick = () => triggerSearch();
					searchInput.onkeydown = (e) => {
						if (e.key === "Enter") triggerSearch();
					};
					searchInput.oninput = (e) => {
						if (e.target.value) {
							clearBtn.classList.remove("hidden");
						} else {
							clearBtn.classList.add("hidden");
						}
					};
					clearBtn.onclick = () => {
						searchInput.value = "";
						clearBtn.classList.add("hidden");
						triggerSearch("popular");
					};

					contentArea.appendChild(storeWrap);

					// Initial load: trigger search for current query or popular
					triggerSearch(win.customState.webStoreQuery || "popular");
				}

				// TAB 2: INSTALLED EXTENSIONS
				else if (activeTab === "installed") {
					const installedWrap = document.createElement("div");
					installedWrap.className = "flex flex-col gap-4";

					// Filter Row
					const filterRow = document.createElement("div");
					filterRow.className = "flex items-center justify-between gap-3 flex-wrap bg-neutral-900/60 border border-white/10 p-3 rounded-2xl";

					const searchInput = document.createElement("input");
					searchInput.className = "flex-1 min-w-[220px] bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-400 outline-none focus:border-emerald-400 transition-colors";
					searchInput.placeholder = "Search installed extensions...";
					searchInput.value = win.customState.extensionPageSearch || "";
					searchInput.oninput = (e) => {
						win.customState.extensionPageSearch = e.target.value;
						renderInternalPageView(tabObj, targetUrl);
					};

					const countBadge = document.createElement("span");
					countBadge.className = "text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
					countBadge.textContent = `${exts.length} Installed`;

					filterRow.appendChild(searchInput);
					filterRow.appendChild(countBadge);
					installedWrap.appendChild(filterRow);

					const searchVal = (win.customState.extensionPageSearch || "").toLowerCase();
					const filtered = exts.filter(ex => !searchVal || (ex.name && ex.name.toLowerCase().includes(searchVal)) || (ex.id && ex.id.toLowerCase().includes(searchVal)));

					const extGrid = document.createElement("div");
					extGrid.className = "grid grid-cols-1 md:grid-cols-2 gap-4";

					filtered.forEach(ext => {
						const card = document.createElement("div");
						card.className = `p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
							ext.enabled ? 'bg-neutral-900/70 border-white/15' : 'bg-neutral-950/40 border-white/5 opacity-60'
						}`;

						const topRow = document.createElement("div");
						topRow.className = "flex items-start justify-between gap-3";

						const iconEl = ext.iconUrl
							? `<img src="${ext.iconUrl}" class="w-10 h-10 rounded-xl object-contain bg-black/40 p-1 border border-white/10 shrink-0" />`
							: `<div class="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">🧩</div>`;

						const titleDiv = document.createElement("div");
						titleDiv.className = "flex items-center gap-3 min-w-0 flex-1";
						titleDiv.innerHTML = `
							${iconEl}
							<div class="flex flex-col min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<span class="text-xs font-bold text-white truncate">${ext.name || 'Extension'}</span>
									${ext.version ? `<span class="text-[10px] text-neutral-400 font-mono bg-white/5 px-1.5 py-0.5 rounded">v${ext.version}</span>` : ''}
								</div>
								<span class="text-[10px] font-mono text-neutral-400 truncate mt-0.5">ID: ${ext.id}</span>
							</div>
						`;

						const toggleLabel = document.createElement("label");
						toggleLabel.className = "relative inline-flex items-center cursor-pointer shrink-0";
						const toggleInput = document.createElement("input");
						toggleInput.type = "checkbox";
						toggleInput.checked = Boolean(ext.enabled);
						toggleInput.className = "sr-only peer";
						toggleInput.onchange = async (e) => {
							if (window.sapphire) {
								await window.sapphire.setExtensionEnabled(ext.id, e.target.checked);
								renderInternalPageView(tabObj, targetUrl);
								if (typeof win.customState.renderToolbarExtensions === "function") {
									win.customState.renderToolbarExtensions();
								}
							}
						};
						const toggleBg = document.createElement("div");
						toggleBg.className = "w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600";
						toggleLabel.appendChild(toggleInput);
						toggleLabel.appendChild(toggleBg);

						topRow.appendChild(titleDiv);
						topRow.appendChild(toggleLabel);
						card.appendChild(topRow);

						if (ext.manifest?.description) {
							const descEl = document.createElement("p");
							descEl.className = "text-xs text-neutral-300 line-clamp-2 leading-relaxed";
							descEl.textContent = ext.manifest.description;
							card.appendChild(descEl);
						}

						const actionRow = document.createElement("div");
						actionRow.className = "flex items-center justify-between pt-2 border-t border-white/10";

						const leftBtns = document.createElement("div");
						leftBtns.className = "flex items-center gap-2";

						if (ext.hasPopup && window.sapphire) {
							const popupBtn = document.createElement("button");
							popupBtn.className = "px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer";
							popupBtn.innerHTML = `<span>🪄</span><span>Popup</span>`;
							popupBtn.onclick = async () => {
								try {
									let popupUrl = null;
									if (typeof window.sapphire.getPopupUrl === "function") {
										popupUrl = await window.sapphire.getPopupUrl(ext.id);
									} else if (typeof window.sapphire.getExtensionPopupPage === "function") {
										const page = window.sapphire.getExtensionPopupPage(ext.id);
										if (page) popupUrl = `${window.location.origin}/~/sx/${ext.id}/${String(page).replace(/^\//, "")}`;
									}
									if (popupUrl) {
										if (typeof win.customState.showExtensionPopover === "function") {
											win.customState.showExtensionPopover(ext.id, popupUrl);
										} else {
											createNewTab(popupUrl);
										}
									}
								} catch (e) {
									console.error(e);
								}
							};
							leftBtns.appendChild(popupBtn);
						}

						const delBtn = document.createElement("button");
						delBtn.className = "px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ml-auto";
						delBtn.innerHTML = `<span>🗑️</span><span>Remove</span>`;
						delBtn.onclick = async () => {
							if (confirm(`Remove extension "${ext.name}"?`)) {
								await window.sapphire.uninstallExtension(ext.id);
								renderInternalPageView(tabObj, targetUrl);
								if (typeof win.customState.renderToolbarExtensions === "function") {
									win.customState.renderToolbarExtensions();
								}
							}
						};

						actionRow.appendChild(leftBtns);
						actionRow.appendChild(delBtn);
						card.appendChild(actionRow);

						extGrid.appendChild(card);
					});

					if (filtered.length === 0) {
						const emptyBox = document.createElement("div");
						emptyBox.className = "col-span-full flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-2xl bg-neutral-900/30";
						emptyBox.innerHTML = `
							<span class="text-3xl mb-2">🧩</span>
							<h3 class="text-sm font-bold text-white mb-1">${exts.length === 0 ? 'No Extensions Installed Yet' : 'No Matching Extensions Found'}</h3>
							<p class="text-xs text-neutral-400 max-w-sm mb-3">Browse and install extensions directly from the Chrome Web Store.</p>
						`;
						const browseStoreBtn = document.createElement("button");
						browseStoreBtn.className = "px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md";
						browseStoreBtn.innerHTML = `<span>🛒</span><span>Browse Chrome Web Store</span>`;
						browseStoreBtn.onclick = () => {
							win.customState.extensionPageTab = "store";
							renderInternalPageView(tabObj, targetUrl);
						};
						emptyBox.appendChild(browseStoreBtn);
						extGrid.appendChild(emptyBox);
					}

					installedWrap.appendChild(extGrid);
					contentArea.appendChild(installedWrap);
				}

				// TAB 3: UPLOAD ARCHIVE (.CRX or .ZIP)
				else if (activeTab === "upload") {
					const uploadCard = document.createElement("div");
					uploadCard.className = "p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-neutral-900 border border-emerald-500/30 flex flex-col gap-4 shadow-lg";

					const uploadHeader = document.createElement("div");
					uploadHeader.className = "flex items-center justify-between";
					uploadHeader.innerHTML = `
						<div class="flex items-center gap-2">
							<span class="text-base">📦</span>
							<h3 class="text-xs font-bold text-emerald-300 uppercase tracking-wider">Manual Extension Package Upload</h3>
						</div>
						<span class="text-[11px] text-neutral-400 font-mono">Supports .CRX & .ZIP</span>
					`;

					const fileInput = document.createElement("input");
					fileInput.type = "file";
					fileInput.accept = ".crx,.zip";
					fileInput.className = "hidden";

					const dropArea = document.createElement("div");
					dropArea.className = "border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 rounded-xl p-8 text-center cursor-pointer transition-all bg-emerald-950/20 hover:bg-emerald-900/30 flex flex-col items-center justify-center gap-2.5";
					dropArea.innerHTML = `
						<span class="text-3xl">📦</span>
						<div class="text-xs font-bold text-emerald-200">Drag & Drop Chrome Extension Archive (.CRX or .ZIP)</div>
						<div class="text-[11px] text-neutral-400">or click to browse your computer</div>
					`;

					const statusBox = document.createElement("div");
					statusBox.className = "text-xs text-neutral-400 hidden p-3 rounded-xl bg-black/40 border border-white/10";

					const handleExtUpload = async (file) => {
						if (!file) return;
						if (!window.sapphire) {
							alert("Extensions engine is not ready.");
							return;
						}
						statusBox.className = "text-xs text-emerald-300 flex items-center gap-2 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30";
						statusBox.innerHTML = `<span class="animate-spin">⏳</span><span>Installing "${file.name}"...</span>`;
						statusBox.classList.remove("hidden");
						try {
							let buffer = await file.arrayBuffer();
							if (window.normalizeExtensionBuffer) {
								buffer = await window.normalizeExtensionBuffer(buffer, file.name);
							}
							await window.sapphire.installExtension(buffer, file.name);
							statusBox.className = "text-xs text-emerald-300 flex items-center gap-2 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30";
							statusBox.innerHTML = `<span>✓</span><span>Successfully installed "${file.name}"!</span>`;
							setTimeout(() => {
								win.customState.extensionPageTab = "installed";
								renderInternalPageView(tabObj, targetUrl);
								if (typeof win.customState.renderToolbarExtensions === "function") {
									win.customState.renderToolbarExtensions();
								}
							}, 800);
						} catch (err) {
							console.error("[Extension Install Error]", err);
							statusBox.className = "text-xs text-rose-300 flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30";
							statusBox.innerHTML = `<span>✕</span><span>Install failed: ${err.message || 'Invalid format'}</span>`;
						}
					};

					dropArea.onclick = () => fileInput.click();
					fileInput.onchange = (e) => {
						const file = e.target.files && e.target.files[0];
						if (file) handleExtUpload(file);
					};
					dropArea.ondragover = (e) => {
						e.preventDefault();
						dropArea.classList.add("border-emerald-400", "bg-emerald-900/40");
					};
					dropArea.ondragleave = () => {
						dropArea.classList.remove("border-emerald-400", "bg-emerald-900/40");
					};
					dropArea.ondrop = (e) => {
						e.preventDefault();
						dropArea.classList.remove("border-emerald-400", "bg-emerald-900/40");
						const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
						if (file) handleExtUpload(file);
					};

					uploadCard.appendChild(uploadHeader);
					uploadCard.appendChild(fileInput);
					uploadCard.appendChild(dropArea);
					uploadCard.appendChild(statusBox);
					contentArea.appendChild(uploadCard);
				}
			}

			// 4. SETTINGS PAGE
			else if (currentSection === "settings") {
				const settingsWrap = document.createElement("div");
				settingsWrap.className = "flex flex-col gap-6 max-w-3xl";

				// Section 1: Search Engine
				const searchSec = document.createElement("div");
				searchSec.className = "p-5 rounded-2xl bg-neutral-900/60 border border-white/10 flex flex-col gap-4";
				searchSec.innerHTML = `
					<div class="flex items-center gap-2.5">
						<span class="text-lg">🔍</span>
						<div>
							<h3 class="text-sm font-bold text-white">Default Search Engine</h3>
							<p class="text-xs text-neutral-400">Choose the search engine used for URL bar queries.</p>
						</div>
					</div>
				`;
				const enginesGrid = document.createElement("div");
				enginesGrid.className = "grid grid-cols-2 sm:grid-cols-4 gap-2.5";
				const engines = [
					{ id: "google", label: "Google", icon: "🔍" },
					{ id: "duckduckgo", label: "DuckDuckGo", icon: "🦆" },
					{ id: "bing", label: "Bing", icon: "🅱️" },
					{ id: "brave", label: "Brave", icon: "🦁" }
				];
				engines.forEach(eng => {
					const btn = document.createElement("button");
					const isSel = (store.searchEngine || "google") === eng.id;
					btn.className = `p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
						isSel ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 shadow-md' : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
					}`;
					btn.innerHTML = `<span>${eng.icon}</span><span>${eng.label}</span>`;
					btn.onclick = () => {
						store.searchEngine = eng.id;
						renderInternalPageView(tabObj, targetUrl);
					};
					enginesGrid.appendChild(btn);
				});
				searchSec.appendChild(enginesGrid);
				settingsWrap.appendChild(searchSec);

				// Section 2: Tab Cloaking
				const cloakSec = document.createElement("div");
				cloakSec.className = "p-5 rounded-2xl bg-neutral-900/60 border border-white/10 flex flex-col gap-4";
				cloakSec.innerHTML = `
					<div class="flex items-center gap-2.5">
						<span class="text-lg">🎭</span>
						<div>
							<h3 class="text-sm font-bold text-white">Tab Cloaking & Stealth</h3>
							<p class="text-xs text-neutral-400">Disguise browser tab title and favicon as school or office apps.</p>
						</div>
					</div>
				`;
				const cloaksGrid = document.createElement("div");
				cloaksGrid.className = "grid grid-cols-2 sm:grid-cols-3 gap-2.5";
				const cloaks = [
					{ id: "default", label: "Default (VeilOS)" },
					{ id: "google", label: "Google Search" },
					{ id: "classroom", label: "Google Classroom" },
					{ id: "drive", label: "Google Drive" },
					{ id: "canvas", label: "Canvas LMS" },
					{ id: "schoology", label: "Schoology" }
				];
				cloaks.forEach(clk => {
					const btn = document.createElement("button");
					const isSel = (store.tabCloak || "default") === clk.id;
					btn.className = `p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
						isSel ? 'bg-purple-600/30 border-purple-500 text-purple-200 shadow-md' : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
					}`;
					btn.innerHTML = `<span>🎭</span><span>${clk.label}</span>`;
					btn.onclick = () => {
						store.tabCloak = clk.id;
						if (window.applyTabCloak) window.applyTabCloak(clk.id, store.customCloakTitle, store.customCloakIcon);
						renderInternalPageView(tabObj, targetUrl);
					};
					cloaksGrid.appendChild(btn);
				});
				cloakSec.appendChild(cloaksGrid);

				const cloakActions = document.createElement("div");
				cloakActions.className = "flex items-center gap-3 pt-2 border-t border-white/10 flex-wrap";
				cloakActions.innerHTML = `
					<button id="about_blank_btn" class="px-4 py-2 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors">
						<span>↗️</span><span>Open in About:Blank</span>
					</button>
					<button id="blob_cloak_btn" class="px-4 py-2 rounded-xl bg-teal-950/70 hover:bg-teal-900 border border-teal-500/40 text-teal-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors">
						<span>🧊</span><span>Open in Blob Cloak</span>
					</button>
				`;
				cloakSec.appendChild(cloakActions);
				setTimeout(() => {
					const abBtn = cloakSec.querySelector("#about_blank_btn");
					const blBtn = cloakSec.querySelector("#blob_cloak_btn");
					if (abBtn) abBtn.onclick = () => { if (window.openAboutBlankCloak) window.openAboutBlankCloak(); };
					if (blBtn) blBtn.onclick = () => { if (window.openBlobCloak) window.openBlobCloak(); };
				}, 10);
				settingsWrap.appendChild(cloakSec);

				// Section 3: Proxy Transport
				const proxySec = document.createElement("div");
				proxySec.className = "p-5 rounded-2xl bg-neutral-900/60 border border-white/10 flex flex-col gap-4";
				proxySec.innerHTML = `
					<div class="flex items-center gap-2.5">
						<span class="text-lg">🌐</span>
						<div>
							<h3 class="text-sm font-bold text-white">Proxy Network Transport</h3>
							<p class="text-xs text-neutral-400">Select WebAssembly TCP or WebSocket Wisp tunneling.</p>
						</div>
					</div>
				`;
				const transportGrid = document.createElement("div");
				transportGrid.className = "grid grid-cols-3 gap-2.5";
				const transports = [
					{ id: "/epoxy/index.mjs", label: "Epoxy (Wasm TCP)" },
					{ id: "/libcurl/index.mjs", label: "Libcurl.js" },
					{ id: "/baremod/index.mjs", label: "Bare 3" }
				];
				transports.forEach(tr => {
					const btn = document.createElement("button");
					const isSel = (store.transport || "/epoxy/index.mjs") === tr.id;
					btn.className = `p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
						isSel ? 'bg-sky-600/30 border-sky-500 text-sky-200 shadow-md' : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
					}`;
					btn.textContent = tr.label;
					btn.onclick = () => {
						store.transport = tr.id;
						applyTransport(tr.id, store.wispurl, store.bareurl);
						renderInternalPageView(tabObj, targetUrl);
					};
					transportGrid.appendChild(btn);
				});
				proxySec.appendChild(transportGrid);

				const systemModalBtn = document.createElement("button");
				systemModalBtn.className = "w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer";
				systemModalBtn.innerHTML = `<span>⚙️</span><span>Open VeilOS System Settings Dialog</span>`;
				systemModalBtn.onclick = () => {
					window.openSettingsModal();
				};
				proxySec.appendChild(systemModalBtn);
				settingsWrap.appendChild(proxySec);

				contentArea.appendChild(settingsWrap);
			}

			container.appendChild(contentArea);
		};

		const loadTabUrl = (tabObj, rawTarget) => {
			const target = formatUrl(rawTarget || "https://google.com");
			tabObj.url = target;
			tabObj.title = getTitleFromUrl(target);

			if (target.startsWith("onyx://") || target.startsWith("veil://")) {
				if (tabObj.frameObj && tabObj.frameObj.frame) {
					tabObj.frameObj.frame.style.display = "none";
				}
				if (!tabObj.internalEl) {
					tabObj.internalEl = document.createElement("div");
					tabObj.internalEl.className = "w-full h-full bg-[#0d0e15] text-white overflow-y-auto custom-scrollbar select-text";
					tabObj.tabEl.appendChild(tabObj.internalEl);
				}
				tabObj.internalEl.style.display = "block";
				renderInternalPageView(tabObj, target);
				addHistory(tabObj.title, target);
				if (win.customState.activeTabId === tabObj.id) {
					syncActiveTabUrl(target);
				}
				renderTabStrip();
				return;
			}

			// Web / Extension URL
			if (tabObj.internalEl) {
				tabObj.internalEl.style.display = "none";
			}
			if (tabObj.frameObj && tabObj.frameObj.frame) {
				tabObj.frameObj.frame.style.display = "block";
			}

			const isExtensionPage = target.includes("/~/sx/") || target.startsWith("chrome-extension://");
			if (isExtensionPage && window.sapphire) {
				let extId = null;
				let pagePath = "popup.html";
				if (target.startsWith("chrome-extension://")) {
					const parts = target.slice("chrome-extension://".length).split("/");
					extId = parts[0];
					pagePath = parts.slice(1).join("/") || "popup.html";
				} else {
					const match = target.match(/\/~\/sx\/([^/]+)(?:\/(.*))?/);
					if (match) {
						extId = match[1];
						pagePath = match[2] || "popup.html";
					}
				}
				if (extId) {
					const ext = window.sapphire.registry?.get ? window.sapphire.registry.get(extId) : null;
					if (ext) {
						tabObj.title = (ext.manifest?.name || "Extension") + (pagePath && pagePath !== "popup.html" ? ` - ${pagePath.replace('.html','')}` : " Page");
					}
					setTimeout(async () => {
						try {
							if (typeof window.sapphire.mountExtensionPage === "function") {
								const ok = await window.sapphire.mountExtensionPage(tabObj.frameObj.frame, extId, pagePath, tabObj.numericId);
								if (ok) return;
							}
							if (typeof window.sapphire.mountExtensionPopup === "function") {
								const ok = await window.sapphire.mountExtensionPopup(tabObj.frameObj.frame, extId, tabObj.numericId);
								if (ok) return;
							}
						} catch (mountErr) {
							console.warn("[loadTabUrl] mountExtensionPage error, falling back to frame.go:", mountErr);
						}
						tabObj.frameObj.go(target);
					}, 0);
					addHistory(tabObj.title, target);
					if (win.customState.activeTabId === tabObj.id) {
						syncActiveTabUrl(target);
					}
					renderTabStrip();
					return;
				}
			}

			tabObj.frameObj.go(target);
			addHistory(tabObj.title, target);
			if (win.customState.activeTabId === tabObj.id) {
				syncActiveTabUrl(target);
			}
			renderTabStrip();
		};

		const createTab = (rawUrl, customTitle) => {
			const tabNumericId = nextTabNumericId++;
			const target = formatUrl(rawUrl || "https://google.com");

			const plugins = [];
			if (window.sapphire && window.SapphireContentScriptPlugin) {
				try {
					plugins.push(new window.SapphireContentScriptPlugin(window.sapphire, tabNumericId));
				} catch (e) {
					console.warn("[createTab] Failed to instantiate SapphireContentScriptPlugin:", e);
				}
			}

			const frame = scramjet.createFrame(undefined, { plugins });
			frame.frame.className = "w-full h-full border-0 outline-none bg-white block";

			const tabEl = document.createElement("div");
			tabEl.className = "w-full h-full absolute inset-0";
			tabEl.appendChild(frame.frame);

			const tabObj = {
				id: "tab_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
				numericId: tabNumericId,
				title: customTitle || getTitleFromUrl(target),
				url: target,
				frameObj: frame,
				tabEl: tabEl,
				internalEl: null,
			};

			const handleUrlUpdate = (newUrl) => {
				if (!newUrl || newUrl === "about:blank" || newUrl.startsWith("blob:")) return;
				if ((tabObj.url.startsWith("onyx://") || tabObj.url.startsWith("veil://")) && !newUrl.startsWith("http")) return;
				tabObj.url = newUrl;
				tabObj.title = getTitleFromUrl(newUrl);
				addHistory(tabObj.title, newUrl);
				if (win.customState.activeTabId === tabObj.id) {
					syncActiveTabUrl(newUrl);
				}
				renderTabStrip();
			};

			frame.addEventListener("urlchange", (e) => {
				if (e && e.url) handleUrlUpdate(e.url);
			});
			frame.addEventListener("navigate", (e) => {
				if (e && e.url) handleUrlUpdate(e.url);
			});
			frame.frame.addEventListener("load", () => {
				try {
					const curr = frame.url ? frame.url.href : (frame.client && frame.client.url ? frame.client.url.href : null);
					if (curr) handleUrlUpdate(curr);
				} catch (err) {}
			});

			win.customState.viewportEl.appendChild(tabEl);
			loadTabUrl(tabObj, target);
			return tabObj;
		};

		const switchTab = (tabId) => {
			win.customState.activeTabId = tabId;
			win.customState.tabs.forEach(t => {
				if (t.tabEl) {
					t.tabEl.style.display = (t.id === tabId) ? "block" : "none";
				}
			});
			const activeTab = getActiveTab();
			if (activeTab) {
				syncActiveTabUrl(activeTab.url);
			}
			renderTabStrip();
		};

		const closeTab = (tabId, e) => {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			const targetTab = win.customState.tabs.find(t => t.id === tabId);
			if (targetTab && targetTab.tabEl) {
				try { targetTab.tabEl.remove(); } catch (err) {}
			}
			win.customState.tabs = win.customState.tabs.filter(t => t.id !== tabId);
			if (win.customState.tabs.length === 0) {
				const freshTab = createTab("https://google.com");
				win.customState.tabs.push(freshTab);
				switchTab(freshTab.id);
			} else if (win.customState.activeTabId === tabId) {
				const nextTab = win.customState.tabs[win.customState.tabs.length - 1];
				switchTab(nextTab.id);
			} else {
				renderTabStrip();
			}
		};

		const createNewTab = (rawUrl) => {
			const newTab = createTab(rawUrl || "https://google.com");
			win.customState.tabs.push(newTab);
			switchTab(newTab.id);
			urlInput.focus();
		};

		const handleNav = (targetUrl) => {
			if (!targetUrl) return;
			const activeTab = getActiveTab();
			if (!activeTab) return;
			loadTabUrl(activeTab, targetUrl);
		};

		win.customState.createNewTab = createNewTab;
		win.customState.createTab = createTab;
		win.customState.switchTab = switchTab;
		win.customState.closeTab = closeTab;
		win.customState.handleNav = handleNav;
		win.customState.hidePopover = () => {
			if (floatingPopover) {
				floatingPopover.classList.add("hidden");
				win.customState.activePopup = null;
			}
		};

		// Tab Strip Renderer
		const renderTabStrip = () => {
			tabsListContainer.innerHTML = "";
			const activeTab = getActiveTab();

			win.customState.tabs.forEach(tab => {
				const isActive = activeTab && tab.id === activeTab.id;
				const tabDiv = document.createElement("div");
				tabDiv.className = `flex items-center gap-2 px-3 py-1.5 rounded-t-xl text-xs transition-all cursor-pointer select-none max-w-[170px] group border-t border-x ${
					isActive 
						? 'bg-neutral-800 text-white font-semibold border-white/20 shadow-md' 
						: 'bg-black/40 text-neutral-400 hover:text-white hover:bg-white/5 border-transparent'
				}`;
				tabDiv.title = tab.url;
				tabDiv.onclick = (e) => {
					if (!e.target.closest(".close-btn")) {
						switchTab(tab.id);
					}
				};

				const globeSpan = document.createElement("span");
				globeSpan.className = "text-xs shrink-0 flex items-center";
				globeSpan.innerHTML = getIconFromUrl(tab.url);

				const titleSpan = document.createElement("span");
				titleSpan.className = "truncate flex-1";
				titleSpan.textContent = tab.title || "New Tab";

				const closeBtnEl = document.createElement("button");
				closeBtnEl.className = "close-btn w-4 h-4 rounded-full hover:bg-white/20 text-neutral-400 hover:text-white flex items-center justify-center text-[10px] transition-colors shrink-0";
				closeBtnEl.title = "Close tab";
				closeBtnEl.innerHTML = '<i class="fa-solid fa-xmark"></i>';
				closeBtnEl.onclick = (e) => {
					closeTab(tab.id, e);
				};

				tabDiv.appendChild(globeSpan);
				tabDiv.appendChild(titleSpan);
				tabDiv.appendChild(closeBtnEl);
				tabsListContainer.appendChild(tabDiv);
			});

			const newTabBtn = document.createElement("button");
			newTabBtn.className = "w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer shrink-0 ml-1";
			newTabBtn.title = "Open new tab";
			newTabBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
			newTabBtn.onclick = () => createNewTab("https://google.com");
			tabsListContainer.appendChild(newTabBtn);
			updateTopRightButtonsState();
		};

		// Quick Bookmarks Bar Renderer
		const renderQuickBookmarks = () => {
			const bms = Array.isArray(store.bookmarks) ? store.bookmarks : [];
			if (win.customState.showQuickBookmarks && bms.length > 0) {
				quickBmBar.style.display = "flex";
				quickBmBar.innerHTML = "";

				const label = document.createElement("span");
				label.className = "text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1";
				label.innerHTML = '<i class="fa-solid fa-bookmark text-amber-400 text-[10px]"></i><span>Bookmarks:</span>';
				quickBmBar.appendChild(label);

				bms.forEach(bm => {
					const bmBtn = document.createElement("button");
					bmBtn.className = "px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-200 hover:text-white border border-white/10 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer shrink-0 text-xs";
					bmBtn.title = bm.url;
					bmBtn.onclick = () => handleNav(bm.url);

					const iconSpan = document.createElement("span");
					iconSpan.className = "flex items-center text-amber-400 text-[11px]";
					iconSpan.innerHTML = bm.icon && bm.icon.startsWith("<i ") ? bm.icon : '<i class="fa-solid fa-star text-amber-400"></i>';

					const nameSpan = document.createElement("span");
					nameSpan.className = "font-medium";
					nameSpan.textContent = bm.name;

					bmBtn.appendChild(iconSpan);
					bmBtn.appendChild(nameSpan);
					quickBmBar.appendChild(bmBtn);
				});
			} else {
				quickBmBar.style.display = "none";
			}
		};

		const updateTopRightButtonsState = () => {
			const activeTab = getActiveTab();
			const activeUrl = (activeTab?.url || "").toLowerCase();
			const isHistory = activeUrl.startsWith("veil://history") || activeUrl.startsWith("onyx://history");
			const isExtensions = activeUrl.startsWith("veil://extensions") || activeUrl.startsWith("onyx://extensions");

			historyToggleBtn.className = `w-7 h-7 rounded-lg text-xs font-medium transition-colors flex items-center justify-center cursor-pointer ${
				isHistory ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm' : 'bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white border border-transparent'
			}`;
			extensionsToggleBtn.className = `w-7 h-7 rounded-lg text-xs font-medium transition-colors flex items-center justify-center cursor-pointer ${
				isExtensions ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' : 'bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white border border-transparent'
			}`;
		};

		// Drawer Renderer (Bookmarks, History, and Extensions side drawer)
		const renderDrawer = () => {
			drawerContainer.innerHTML = "";
			const activePanel = win.customState.activePanel;

			updateTopRightButtonsState();

			if (activePanel === "none") return;

			if (activePanel === "bookmarks") {
				const activeTab = getActiveTab();
				const bms = Array.isArray(store.bookmarks) ? store.bookmarks : [];
				const isCurrBm = activeTab ? isBookmarked(activeTab.url) : false;
				const filterQuery = (win.customState.bookmarkSearch || "").toLowerCase();

				const drawerEl = document.createElement("div");
				drawerEl.className = "w-80 sm:w-96 bg-neutral-900 border-l border-white/15 p-4 flex flex-col gap-3 shrink-0 shadow-2xl z-10 animate-fade overflow-hidden";

				// Top Bar
				const header = document.createElement("div");
				header.className = "flex items-center justify-between pb-2 border-b border-white/10";
				header.innerHTML = `
					<div class="flex items-center gap-2">
						<span class="text-lg">⭐</span>
						<h3 class="text-sm font-bold text-white">Bookmarks</h3>
					</div>
				`;
				const headerRight = document.createElement("div");
				headerRight.className = "flex items-center gap-1.5";

				const fullPageBtn = document.createElement("button");
				fullPageBtn.className = "px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer";
				fullPageBtn.title = "Open onyx://bookmarks in tab";
				fullPageBtn.innerHTML = `<span>↗</span><span>Full Page</span>`;
				fullPageBtn.onclick = () => {
					handleNav("onyx://bookmarks");
					win.customState.activePanel = "none";
					renderDrawer();
				};

				const closeBtn = document.createElement("button");
				closeBtn.className = "w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center text-xs cursor-pointer";
				closeBtn.textContent = "✕";
				closeBtn.onclick = () => {
					win.customState.activePanel = "none";
					renderDrawer();
				};
				headerRight.appendChild(fullPageBtn);
				headerRight.appendChild(closeBtn);
				header.appendChild(headerRight);
				drawerEl.appendChild(header);

				// Bookmark Current Page Button
				const addCurrBtn = document.createElement("button");
				addCurrBtn.className = "w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer";
				addCurrBtn.innerHTML = `<span>${isCurrBm ? '★ Bookmarked' : '☆ Bookmark Current Page'}</span>`;
				addCurrBtn.onclick = () => {
					if (activeTab) {
						toggleBookmark(activeTab.title, activeTab.url);
					}
				};
				drawerEl.appendChild(addCurrBtn);

				// Search input
				const searchInput = document.createElement("input");
				searchInput.className = "w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-400 outline-none focus:border-amber-400";
				searchInput.placeholder = "Search bookmarks...";
				searchInput.value = win.customState.bookmarkSearch || "";
				searchInput.oninput = (e) => {
					win.customState.bookmarkSearch = e.target.value;
					renderDrawer();
				};
				drawerEl.appendChild(searchInput);

				// Bookmarks list container
				const listEl = document.createElement("div");
				listEl.className = "flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar";

				const filtered = bms.filter(b => !filterQuery || b.name.toLowerCase().includes(filterQuery) || b.url.toLowerCase().includes(filterQuery));

				filtered.forEach(bm => {
					const itemDiv = document.createElement("div");
					itemDiv.className = "group flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors";

					const infoDiv = document.createElement("div");
					infoDiv.className = "flex flex-col min-w-0 flex-1 cursor-pointer pr-2";
					infoDiv.innerHTML = `
						<div class="flex items-center gap-1.5">
							<span class="text-xs">${bm.icon || '⭐'}</span>
							<span class="text-xs font-bold text-white truncate">${bm.name}</span>
						</div>
						<span class="text-[10px] font-mono text-neutral-400 truncate mt-0.5">${bm.url}</span>
					`;
					// Clicking bookmark navigates the active tab directly to this URL
					infoDiv.onclick = () => {
						handleNav(bm.url);
						win.customState.activePanel = "none";
						renderDrawer();
					};

					const actionsDiv = document.createElement("div");
					actionsDiv.className = "flex items-center gap-1";

					const openNewTabBtn = document.createElement("button");
					openNewTabBtn.className = "w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 text-xs flex items-center justify-center cursor-pointer";
					openNewTabBtn.title = "Open in new tab";
					openNewTabBtn.textContent = "↗";
					openNewTabBtn.onclick = () => {
						createNewTab(bm.url);
						win.customState.activePanel = "none";
						renderDrawer();
					};

					const deleteBtn = document.createElement("button");
					deleteBtn.className = "w-6 h-6 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-xs flex items-center justify-center cursor-pointer";
					deleteBtn.title = "Delete Bookmark";
					deleteBtn.textContent = "🗑️";
					deleteBtn.onclick = () => {
						store.bookmarks = bms.filter(b => b.id !== bm.id);
						syncActiveTabUrl(activeTab ? activeTab.url : "");
						renderQuickBookmarks();
						renderDrawer();
					};

					actionsDiv.appendChild(openNewTabBtn);
					actionsDiv.appendChild(deleteBtn);

					itemDiv.appendChild(infoDiv);
					itemDiv.appendChild(actionsDiv);
					listEl.appendChild(itemDiv);
				});

				if (filtered.length === 0) {
					const emptyDiv = document.createElement("div");
					emptyDiv.className = "text-center text-xs text-neutral-500 py-8";
					emptyDiv.textContent = bms.length === 0 ? "No saved bookmarks yet." : "No matching bookmarks found.";
					listEl.appendChild(emptyDiv);
				}

				drawerEl.appendChild(listEl);
				drawerContainer.appendChild(drawerEl);
			} else if (activePanel === "history") {
				const hists = Array.isArray(store.history) ? store.history : [];
				const filterQuery = (win.customState.historySearch || "").toLowerCase();

				const drawerEl = document.createElement("div");
				drawerEl.className = "w-80 sm:w-96 bg-neutral-900 border-l border-white/15 p-4 flex flex-col gap-3 shrink-0 shadow-2xl z-10 animate-fade overflow-hidden";

				// Top Bar
				const header = document.createElement("div");
				header.className = "flex items-center justify-between pb-2 border-b border-white/10";
				header.innerHTML = `
					<div class="flex items-center gap-2">
						<span class="text-lg">🕒</span>
						<h3 class="text-sm font-bold text-white">History</h3>
					</div>
				`;
				const headerRight = document.createElement("div");
				headerRight.className = "flex items-center gap-1.5";

				const fullPageBtn = document.createElement("button");
				fullPageBtn.className = "px-2 py-0.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer";
				fullPageBtn.title = "Open onyx://history in tab";
				fullPageBtn.innerHTML = `<span>↗</span><span>Full Page</span>`;
				fullPageBtn.onclick = () => {
					handleNav("onyx://history");
					win.customState.activePanel = "none";
					renderDrawer();
				};

				const closeBtn = document.createElement("button");
				closeBtn.className = "w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center text-xs cursor-pointer";
				closeBtn.textContent = "✕";
				closeBtn.onclick = () => {
					win.customState.activePanel = "none";
					renderDrawer();
				};
				headerRight.appendChild(fullPageBtn);
				headerRight.appendChild(closeBtn);
				header.appendChild(headerRight);
				drawerEl.appendChild(header);

				// Clear All History Button
				const clearBtn = document.createElement("button");
				clearBtn.className = "w-full py-1.5 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer";
				clearBtn.innerHTML = `<span>🗑️</span><span>Clear All History</span>`;
				clearBtn.onclick = () => {
					store.history = [];
					renderDrawer();
				};
				drawerEl.appendChild(clearBtn);

				// Search input
				const searchInput = document.createElement("input");
				searchInput.className = "w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-400 outline-none focus:border-purple-400";
				searchInput.placeholder = "Search history...";
				searchInput.value = win.customState.historySearch || "";
				searchInput.oninput = (e) => {
					win.customState.historySearch = e.target.value;
					renderDrawer();
				};
				drawerEl.appendChild(searchInput);

				// History list container
				const listEl = document.createElement("div");
				listEl.className = "flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar";

				const filtered = hists.filter(h => !filterQuery || h.name.toLowerCase().includes(filterQuery) || h.url.toLowerCase().includes(filterQuery));

				filtered.forEach(item => {
					const itemDiv = document.createElement("div");
					itemDiv.className = "group flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors";

					const timeStr = new Date(item.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

					const infoDiv = document.createElement("div");
					infoDiv.className = "flex flex-col min-w-0 flex-1 cursor-pointer pr-2";
					infoDiv.innerHTML = `
						<div class="flex items-center justify-between gap-2">
							<span class="text-xs font-bold text-white truncate">${item.name}</span>
							<span class="text-[9px] text-neutral-400 font-mono whitespace-nowrap">${timeStr}</span>
						</div>
						<span class="text-[10px] font-mono text-neutral-400 truncate mt-0.5">${item.url}</span>
					`;
					// Clicking history navigates the active tab directly to this URL
					infoDiv.onclick = () => {
						handleNav(item.url);
						win.customState.activePanel = "none";
						renderDrawer();
					};

					const actionsDiv = document.createElement("div");
					actionsDiv.className = "flex items-center gap-1";

					const openNewTabBtn = document.createElement("button");
					openNewTabBtn.className = "w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 text-xs flex items-center justify-center cursor-pointer";
					openNewTabBtn.title = "Open in new tab";
					openNewTabBtn.textContent = "↗";
					openNewTabBtn.onclick = () => {
						createNewTab(item.url);
						win.customState.activePanel = "none";
						renderDrawer();
					};

					const deleteBtn = document.createElement("button");
					deleteBtn.className = "w-6 h-6 rounded-lg bg-white/5 hover:bg-white/20 text-neutral-400 hover:text-white text-xs flex items-center justify-center cursor-pointer";
					deleteBtn.title = "Remove from History";
					deleteBtn.textContent = "✕";
					deleteBtn.onclick = () => {
						store.history = hists.filter(i => i.id !== item.id);
						renderDrawer();
					};

					actionsDiv.appendChild(openNewTabBtn);
					actionsDiv.appendChild(deleteBtn);

					itemDiv.appendChild(infoDiv);
					itemDiv.appendChild(actionsDiv);
					listEl.appendChild(itemDiv);
				});

				if (filtered.length === 0) {
					const emptyDiv = document.createElement("div");
					emptyDiv.className = "text-center text-xs text-neutral-500 py-8";
					emptyDiv.textContent = hists.length === 0 ? "No browsing history yet." : "No matching history found.";
					listEl.appendChild(emptyDiv);
				}

				drawerEl.appendChild(listEl);
				drawerContainer.appendChild(drawerEl);
			} else if (activePanel === "extensions") {
				const exts = window.sapphire ? window.sapphire.getInstalledExtensions() : [];
				const filterQuery = (win.customState.extensionSearch || "").toLowerCase();

				const drawerEl = document.createElement("div");
				drawerEl.className = "w-80 sm:w-96 bg-neutral-900 border-l border-white/15 p-4 flex flex-col gap-3 shrink-0 shadow-2xl z-10 animate-fade overflow-hidden";

				// Top Bar
				const header = document.createElement("div");
				header.className = "flex items-center justify-between pb-2 border-b border-white/10";
				header.innerHTML = `
					<div class="flex items-center gap-2">
						<span class="text-lg">🧩</span>
						<h3 class="text-sm font-bold text-white">Extensions</h3>
						<span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">${exts.length}</span>
					</div>
				`;
				const headerRight = document.createElement("div");
				headerRight.className = "flex items-center gap-1.5";

				const fullPageBtn = document.createElement("button");
				fullPageBtn.className = "px-2 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer";
				fullPageBtn.title = "Open onyx://extensions in tab";
				fullPageBtn.innerHTML = `<span>↗</span><span>Full Page</span>`;
				fullPageBtn.onclick = () => {
					handleNav("onyx://extensions");
					win.customState.activePanel = "none";
					renderDrawer();
				};

				const closeBtn = document.createElement("button");
				closeBtn.className = "w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center text-xs cursor-pointer";
				closeBtn.textContent = "✕";
				closeBtn.onclick = () => {
					win.customState.activePanel = "none";
					renderDrawer();
				};
				headerRight.appendChild(fullPageBtn);
				headerRight.appendChild(closeBtn);
				header.appendChild(headerRight);
				drawerEl.appendChild(header);

				// Tab Navigation inside Drawer
				const drawerTab = win.customState.drawerExtensionTab || (exts.length ? "installed" : "store");
				const tabsRow = document.createElement("div");
				tabsRow.className = "flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10";

				const makeDrawerTabBtn = (tabId, label, icon, badge) => {
					const btn = document.createElement("button");
					const isCur = drawerTab === tabId;
					btn.className = `flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
						isCur
							? "bg-emerald-600 text-white shadow-sm"
							: "text-neutral-400 hover:text-white hover:bg-white/5"
					}`;
					btn.innerHTML = `<span>${icon}</span><span>${label}</span>${
						badge !== undefined
							? `<span class="px-1.5 py-0.2 rounded-full text-[9px] ${isCur ? 'bg-white/20 text-white' : 'bg-white/10 text-neutral-400'}">${badge}</span>`
							: ""
					}`;
					btn.onclick = () => {
						win.customState.drawerExtensionTab = tabId;
						renderDrawer();
					};
					return btn;
				};

				tabsRow.appendChild(makeDrawerTabBtn("store", "Store", "🛒"));
				tabsRow.appendChild(makeDrawerTabBtn("installed", "Installed", "🧩", exts.length));
				tabsRow.appendChild(makeDrawerTabBtn("upload", "Upload", "📦"));
				drawerEl.appendChild(tabsRow);

				// TAB 1: CHROME WEB STORE DRAWER TAB
				if (drawerTab === "store") {
					const storeBox = document.createElement("div");
					storeBox.className = "flex flex-col gap-3 flex-1 overflow-hidden";

					// Search Bar
					const searchWrap = document.createElement("div");
					searchWrap.className = "flex items-center gap-1.5";

					const storeInput = document.createElement("input");
					storeInput.className = "flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-400 outline-none focus:border-emerald-400";
					storeInput.placeholder = "Search Web Store or paste ID...";
					storeInput.value = win.customState.drawerStoreQuery || "";

					const storeSearchBtn = document.createElement("button");
					storeSearchBtn.className = "px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0";
					storeSearchBtn.innerHTML = `<span>🔍</span>`;

					searchWrap.appendChild(storeInput);
					searchWrap.appendChild(storeSearchBtn);
					storeBox.appendChild(searchWrap);

					// Results container
					const storeResultsList = document.createElement("div");
					storeResultsList.className = "flex flex-col gap-2.5 flex-1 overflow-y-auto custom-scrollbar";
					storeBox.appendChild(storeResultsList);

					const queryStore = async (q) => {
						const query = (q !== undefined ? q : storeInput.value).trim();
						win.customState.drawerStoreQuery = query;

						storeResultsList.innerHTML = `
							<div class="py-8 flex flex-col items-center justify-center text-center text-xs text-neutral-400">
								<span class="animate-spin text-lg mb-2">⏳</span>
								<span>Searching Chrome Web Store...</span>
							</div>
						`;

						try {
							const res = await fetch(`/api/webstore/search?q=${encodeURIComponent(query || "popular")}`);
							if (!res.ok) throw new Error(`HTTP ${res.status}`);
							const data = await res.json();
							renderDrawerStoreItems(data.results || []);
						} catch (e) {
							storeResultsList.innerHTML = `
								<div class="py-6 text-center text-xs text-rose-400">
									Failed to load extensions from Web Store.
								</div>
							`;
						}
					};

					const renderDrawerStoreItems = (items) => {
						storeResultsList.innerHTML = "";
						if (items.length === 0) {
							storeResultsList.innerHTML = `
								<div class="py-8 text-center text-xs text-neutral-500">
									No extensions found.
								</div>
							`;
							return;
						}

						items.forEach(item => {
							const isInstalled = exts.some(e => e.id === item.id || (e.name && item.name && e.name.toLowerCase() === item.name.toLowerCase()));
							const card = document.createElement("div");
							card.className = "p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col gap-2 shadow-sm";

							const top = document.createElement("div");
							top.className = "flex items-start justify-between gap-2";

							const iconHtml = item.icon
								? `<img src="${item.icon}" class="w-8 h-8 rounded-lg object-contain bg-black/40 p-1 border border-white/10 shrink-0" onerror="this.src='';this.className='hidden'" />`
								: `<div class="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-300 font-bold flex items-center justify-center text-sm shrink-0 border border-emerald-500/20">${item.name.charAt(0)}</div>`;

							const info = document.createElement("div");
							info.className = "flex flex-col min-w-0 flex-1";
							info.innerHTML = `
								<span class="text-xs font-bold text-white truncate" title="${item.name}">${item.name}</span>
								<div class="flex items-center gap-1.5 text-[10px] text-amber-400 font-medium mt-0.5">
									<span>${item.rating ? '★ ' + item.rating : 'Chrome Extension'}</span>
									${item.users ? `<span class="text-neutral-400 font-mono">👥 ${item.users >= 1000000 ? (item.users / 1000000).toFixed(0) + 'M' : (item.users / 1000).toFixed(0) + 'k'}</span>` : ""}
								</div>
							`;

							top.innerHTML = iconHtml;
							top.appendChild(info);

							if (isInstalled) {
								const instSpan = document.createElement("span");
								instSpan.className = "text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md shrink-0";
								instSpan.textContent = "✓ Installed";
								top.appendChild(instSpan);
							} else {
								const instBtn = document.createElement("button");
								instBtn.className = "px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shrink-0 cursor-pointer shadow-sm";
								instBtn.innerHTML = `<span>➕</span><span>Install</span>`;

								instBtn.onclick = async () => {
									instBtn.disabled = true;
									instBtn.className = "px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 text-[10px] font-bold shrink-0 cursor-wait";
									instBtn.innerHTML = `<span class="animate-spin">⏳</span><span>Installing...</span>`;

									try {
										const dl = await fetch(`/api/webstore/download?id=${encodeURIComponent(item.id)}`);
										if (!dl.ok) throw new Error(`Download failed`);
										let buffer = await dl.arrayBuffer();
										if (window.normalizeExtensionBuffer) {
											buffer = await window.normalizeExtensionBuffer(buffer, `${item.id}.crx`);
										}
										await window.sapphire.installExtension(buffer, `${item.id}.crx`);
										instBtn.className = "px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 shrink-0";
										instBtn.innerHTML = `<span>✓</span><span>Installed</span>`;
										if (typeof win.customState.renderToolbarExtensions === "function") {
											win.customState.renderToolbarExtensions();
										}
										setTimeout(() => renderDrawer(), 800);
									} catch (err) {
										alert(`Failed to install ${item.name}: ${err.message}`);
										instBtn.disabled = false;
										instBtn.className = "px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold shrink-0 cursor-pointer";
										instBtn.textContent = "Retry";
									}
								};
								top.appendChild(instBtn);
							}

							card.appendChild(top);
							if (item.description) {
								const desc = document.createElement("p");
								desc.className = "text-[11px] text-neutral-300 line-clamp-2 leading-tight";
								desc.textContent = item.description;
								card.appendChild(desc);
							}
							storeResultsList.appendChild(card);
						});
					};

					storeSearchBtn.onclick = () => queryStore();
					storeInput.onkeydown = (e) => {
						if (e.key === "Enter") queryStore();
					};

					// Link to open full page
					const fullStoreLink = document.createElement("button");
					fullStoreLink.className = "w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 mt-auto";
					fullStoreLink.innerHTML = `<span>🛒</span><span>Open Full Chrome Web Store ↗</span>`;
					fullStoreLink.onclick = () => {
						win.customState.extensionPageTab = "store";
						handleNav("onyx://extensions");
						win.customState.activePanel = "none";
						renderDrawer();
					};
					storeBox.appendChild(fullStoreLink);

					drawerEl.appendChild(storeBox);
					queryStore(win.customState.drawerStoreQuery || "popular");
				}

				// TAB 2: INSTALLED EXTENSIONS DRAWER TAB
				else if (drawerTab === "installed") {
					// Search input
					const searchInput = document.createElement("input");
					searchInput.className = "w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-400 outline-none focus:border-emerald-400";
					searchInput.placeholder = "Search installed extensions...";
					searchInput.value = win.customState.extensionSearch || "";
					searchInput.oninput = (e) => {
						win.customState.extensionSearch = e.target.value;
						renderDrawer();
					};
					drawerEl.appendChild(searchInput);

					// Extensions list container
					const listEl = document.createElement("div");
					listEl.className = "flex flex-col gap-2.5 flex-1 overflow-y-auto custom-scrollbar";

					const filtered = exts.filter((ex) => !filterQuery || (ex.name && ex.name.toLowerCase().includes(filterQuery)) || (ex.id && ex.id.toLowerCase().includes(filterQuery)));

					filtered.forEach((ext) => {
						const itemDiv = document.createElement("div");
						itemDiv.className = `flex flex-col gap-2 p-3 rounded-xl border transition-colors ${
							ext.enabled ? 'bg-white/5 border-white/15' : 'bg-black/30 border-white/5 opacity-60'
						}`;

						const topRow = document.createElement("div");
						topRow.className = "flex items-start justify-between gap-2";

						const infoDiv = document.createElement("div");
						infoDiv.className = "flex items-center gap-2.5 min-w-0 flex-1";

						const iconEl = ext.iconUrl
							? `<img src="${ext.iconUrl}" class="w-7 h-7 rounded object-contain shrink-0 bg-black/40 p-0.5 border border-white/10" />`
							: `<div class="w-7 h-7 rounded bg-emerald-600/30 text-emerald-200 flex items-center justify-center text-sm shrink-0 border border-emerald-400/20">🧩</div>`;

						infoDiv.innerHTML = `
							${iconEl}
							<div class="flex flex-col min-w-0 flex-1">
								<div class="flex items-center gap-1.5">
									<span class="text-xs font-bold text-white truncate">${ext.name || 'Extension'}</span>
									${ext.version ? `<span class="text-[9px] text-neutral-400 font-mono">v${ext.version}</span>` : ''}
								</div>
								<span class="text-[10px] font-mono text-neutral-400 truncate">${ext.id.substring(0, 16)}...</span>
							</div>
						`;

						const toggleLabel = document.createElement("label");
						toggleLabel.className = "relative inline-flex items-center cursor-pointer shrink-0";
						const toggleInput = document.createElement("input");
						toggleInput.type = "checkbox";
						toggleInput.checked = Boolean(ext.enabled);
						toggleInput.className = "sr-only peer";
						toggleInput.onchange = async (e) => {
							if (window.sapphire) {
								await window.sapphire.setExtensionEnabled(ext.id, e.target.checked);
								renderDrawer();
								if (typeof win.customState.renderToolbarExtensions === "function") {
									win.customState.renderToolbarExtensions();
								}
							}
						};
						const toggleBg = document.createElement("div");
						toggleBg.className = "w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600";
						toggleLabel.appendChild(toggleInput);
						toggleLabel.appendChild(toggleBg);

						topRow.appendChild(infoDiv);
						topRow.appendChild(toggleLabel);
						itemDiv.appendChild(topRow);

						// Manifest description if available
						if (ext.manifest?.description) {
							const descEl = document.createElement("div");
							descEl.className = "text-[11px] text-neutral-300 line-clamp-2";
							descEl.textContent = ext.manifest.description;
							itemDiv.appendChild(descEl);
						}

						// Bottom Actions row
						const bottomRow = document.createElement("div");
						bottomRow.className = "flex items-center justify-between pt-1 border-t border-white/5 text-[10px]";

						const leftActions = document.createElement("div");
						leftActions.className = "flex items-center gap-1.5";

						if (ext.hasPopup && window.sapphire) {
							const popupBtn = document.createElement("button");
							popupBtn.className = "px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium transition-colors flex items-center gap-1 cursor-pointer";
							popupBtn.innerHTML = `<span>🪄</span><span>Popup</span>`;
							popupBtn.onclick = async () => {
								try {
									let popupUrl = null;
									if (typeof window.sapphire.getPopupUrl === "function") {
										popupUrl = await window.sapphire.getPopupUrl(ext.id);
									} else if (typeof window.sapphire.getExtensionPopupPage === "function") {
										const page = window.sapphire.getExtensionPopupPage(ext.id);
										if (page) {
											popupUrl = `${window.location.origin}/~/sx/${ext.id}/${String(page).replace(/^\//, "")}`;
										}
									}
									if (popupUrl) {
										if (typeof win.customState.showExtensionPopover === "function") {
											win.customState.showExtensionPopover(ext.id, popupUrl);
										} else {
											createNewTab(popupUrl);
										}
										win.customState.activePanel = "none";
										renderDrawer();
									}
								} catch (popupErr) {
									console.error("[ExtensionPopup] Failed to open popup:", popupErr);
								}
							};
							leftActions.appendChild(popupBtn);
						}

						const uninstallBtn = document.createElement("button");
						uninstallBtn.className = "px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium transition-colors flex items-center gap-1 cursor-pointer ml-auto";
						uninstallBtn.innerHTML = `<span>🗑️</span><span>Remove</span>`;
						uninstallBtn.onclick = async () => {
							if (confirm(`Remove extension "${ext.name}"?`)) {
								await window.sapphire.uninstallExtension(ext.id);
								renderDrawer();
								if (typeof win.customState.renderToolbarExtensions === "function") {
									win.customState.renderToolbarExtensions();
								}
							}
						};

						bottomRow.appendChild(leftActions);
						bottomRow.appendChild(uninstallBtn);
						itemDiv.appendChild(bottomRow);

						listEl.appendChild(itemDiv);
					});

					if (filtered.length === 0) {
						const emptyDiv = document.createElement("div");
						emptyDiv.className = "text-center text-xs text-neutral-500 py-8 flex flex-col items-center gap-2";
						emptyDiv.innerHTML = `
							<span>${exts.length === 0 ? "No extensions installed yet." : "No matching extensions found."}</span>
							<button class="px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 text-xs font-bold hover:bg-emerald-600/50 transition-all cursor-pointer" id="drawer-empty-store-btn">
								Browse Chrome Web Store
							</button>
						`;
						const btn = emptyDiv.querySelector("#drawer-empty-store-btn");
						if (btn) btn.onclick = () => {
							win.customState.drawerExtensionTab = "store";
							renderDrawer();
						};
						listEl.appendChild(emptyDiv);
					}

					drawerEl.appendChild(listEl);
				}

				// TAB 3: UPLOAD ARCHIVE DRAWER TAB
				else if (drawerTab === "upload") {
					const installBox = document.createElement("div");
					installBox.className = "p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col gap-2";

					const installTitle = document.createElement("div");
					installTitle.className = "text-xs font-semibold text-emerald-200 flex items-center gap-1.5";
					installTitle.innerHTML = `<span>📦</span><span>Upload Archive (.CRX or .ZIP)</span>`;

					const fileInput = document.createElement("input");
					fileInput.type = "file";
					fileInput.accept = ".crx,.zip";
					fileInput.className = "hidden";

					const uploadBtn = document.createElement("button");
					uploadBtn.className = "w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer";
					uploadBtn.innerHTML = `<span>📂</span><span>Select Extension File</span>`;

					const dropZone = document.createElement("div");
					dropZone.className = "border border-dashed border-emerald-400/40 hover:border-emerald-300 rounded-lg p-3 text-center text-[11px] text-emerald-300/80 hover:text-emerald-200 transition-colors cursor-pointer";
					dropZone.textContent = "or drag & drop extension archive here";

					const statusMsg = document.createElement("div");
					statusMsg.className = "text-[11px] text-neutral-400 hidden";

					const handleExtFile = async (file) => {
						if (!file) return;
						if (!window.sapphire) {
							alert("Extensions engine is not ready.");
							return;
						}
						statusMsg.className = "text-[11px] text-emerald-300 flex items-center gap-1.5";
						statusMsg.innerHTML = `<span class="animate-spin">⏳</span><span>Installing ${file.name}...</span>`;
						statusMsg.classList.remove("hidden");
						try {
							let buffer = await file.arrayBuffer();
							if (window.normalizeExtensionBuffer) {
								buffer = await window.normalizeExtensionBuffer(buffer, file.name);
							}
							await window.sapphire.installExtension(buffer, file.name);
							statusMsg.className = "text-[11px] text-emerald-400 flex items-center gap-1.5";
							statusMsg.innerHTML = `<span>✓</span><span>Successfully installed extension!</span>`;
							setTimeout(() => {
								win.customState.drawerExtensionTab = "installed";
								renderDrawer();
							}, 600);
						} catch (err) {
							console.error("[Extension Install Error]", err);
							statusMsg.className = "text-[11px] text-rose-400 flex items-center gap-1.5";
							statusMsg.innerHTML = `<span>✕</span><span>Install failed: ${err.message || 'Invalid format'}</span>`;
						}
					};

					uploadBtn.onclick = () => fileInput.click();
					dropZone.onclick = () => fileInput.click();

					fileInput.onchange = (e) => {
						const file = e.target.files && e.target.files[0];
						if (file) handleExtFile(file);
					};

					dropZone.ondragover = (e) => {
						e.preventDefault();
						dropZone.classList.add("bg-emerald-500/20");
					};
					dropZone.ondragleave = () => {
						dropZone.classList.remove("bg-emerald-500/20");
					};
					dropZone.ondrop = (e) => {
						e.preventDefault();
						dropZone.classList.remove("bg-emerald-500/20");
						const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
						if (file) handleExtFile(file);
					};

					installBox.appendChild(installTitle);
					installBox.appendChild(fileInput);
					installBox.appendChild(uploadBtn);
					installBox.appendChild(dropZone);
					installBox.appendChild(statusMsg);
					drawerEl.appendChild(installBox);
				}

				drawerContainer.appendChild(drawerEl);
			}
		};

		// Event Listeners for Nav Bar
		urlInput.onkeydown = (e) => {
			if (e.key === "Enter") {
				handleNav(urlInput.value);
			}
		};

		goBtn.onclick = () => {
			handleNav(urlInput.value);
		};

		backBtn.onclick = () => {
			const active = getActiveTab();
			if (active && active.frameObj) active.frameObj.back();
		};

		fwdBtn.onclick = () => {
			const active = getActiveTab();
			if (active && active.frameObj) active.frameObj.forward();
		};

		reloadBtn.onclick = () => {
			const active = getActiveTab();
			if (active && active.frameObj) active.frameObj.reload();
		};

		const toggleBookmark = (title, url) => {
			if (!url) return;
			const list = Array.isArray(store.bookmarks) ? [...store.bookmarks] : [];
			if (isBookmarked(url)) {
				store.bookmarks = list.filter(b => b.url !== url);
			} else {
				const newBm = {
					id: "bm_" + Date.now(),
					name: title || getTitleFromUrl(url),
					url: url,
					icon: "⭐",
					addedAt: Date.now()
				};
				store.bookmarks = [...list, newBm];
			}
			const active = getActiveTab();
			if (active) syncActiveTabUrl(active.url);
			renderQuickBookmarks();
			if (win.customState.activePanel === "bookmarks") {
				renderDrawer();
			}
		};

		starBtn.onclick = () => {
			const active = getActiveTab();
			if (active) {
				toggleBookmark(active.title, active.url);
			}
		};

		historyToggleBtn.onclick = () => {
			handleNav("onyx://history");
		};

		extensionsToggleBtn.onclick = () => {
			handleNav("onyx://extensions");
		};

		// Safety URL Polling Timer for pushState or internal navigations
		if (!win.customState.urlPollTimer) {
			win.customState.urlPollTimer = setInterval(() => {
				const active = win.customState.tabs ? win.customState.tabs.find(t => t.id === win.customState.activeTabId) : null;
				if (!active || !active.frameObj) return;
				try {
					const curr = active.frameObj.url?.href;
					if (curr && curr !== "about:blank" && curr !== active.url && !curr.startsWith("blob:")) {
						active.url = curr;
						active.title = getTitleFromUrl(curr);
						syncActiveTabUrl(curr);
						renderTabStrip();
					}
				} catch (e) {}
			}, 600);
		}

		// Handle external URL passed to window
		if (win.customState.url && win.customState.url !== win.customState.lastOpenedUrl) {
			win.customState.lastOpenedUrl = win.customState.url;
			const newTab = createTab(win.customState.url, win.title);
			win.customState.tabs.push(newTab);
			win.customState.activeTabId = newTab.id;
		}

		// Initial tab if empty
		if (win.customState.tabs.length === 0) {
			const defaultTab = createTab(store.url || "https://google.com");
			win.customState.tabs.push(defaultTab);
			win.customState.activeTabId = defaultTab.id;
		}

		// Initial display sync
		switchTab(win.customState.activeTabId);
		renderQuickBookmarks();
		renderDrawer();

		return browserRoot;
	}

	const appRoot = document.getElementById("app");
	try {
		appRoot.replaceWith(h(VeilOS));
	} catch (e) {
		appRoot.replaceWith(document.createTextNode("" + e));
		throw e;
	}
});
