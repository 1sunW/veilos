// Google tag (gtag.js)
const script1 = document.createElement('script');
script1.async = true;
script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-CC007RV79S';
document.head.appendChild(script1);

window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-CC007RV79S');

let connection;

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
	this.css = `
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 1;
    
    &.cfg {
      background: rgba(10, 10, 15, 0.95) !important;
      color: #f1f5f9;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 24px;
      max-width: 480px;
      width: 90%;
      box-sizing: border-box;
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
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 12px;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      letter-spacing: -0.025em;
      color: #f8fafc;
      font-family: "Inter", sans-serif;
    }

    .section-title {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 8px;
      font-weight: 600;
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
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .input_row label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #94a3b8;
    }

    .input_row input {
      background-color: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: #f1f5f9;
      outline: none;
      padding: 10px 12px;
      font-size: 0.9rem;
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
      margin-bottom: 20px;
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
          <div class="modal-title">System Settings & Proxy</div>
        </div>
        
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

        <div>
          <button class="close-btn" on:click=${() => {
						applyTransport(store.transport, store.wispurl, store.bareurl);
						handleModalClose(this.root);
					}}>Save & Close</button>
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

	// Definition of Apps in Onyx OS - Onyx Browser, Helium Vault, SSV Movies, Pulse Games, Cloud Gaming, and Onyx Chat
	const APPS = [
		{ id: "browser", name: "Onyx Browser", icon: "🌐", desc: "Proxy Web Browser with tabs & search", category: "Internet", defaultW: 980, defaultH: 640 },
		{ id: "vault", name: "Helium Vault", icon: "📺", desc: "Curated Movies, TV Shows, Anime & Direct Streams", category: "Entertainment", defaultW: 1120, defaultH: 740 },
		{ id: "movies", name: "SSV Movies", icon: "🎬", desc: "Proxied movies, TV shows, and streaming player", category: "Entertainment", defaultW: 1080, defaultH: 720 },
		{ id: "games", name: "Pulse Games", icon: "🕹️", desc: "Unblocked arcade with 8 providers & 1,000+ games", category: "Gaming", defaultW: 1080, defaultH: 720 },
		{ id: "cloudgaming", name: "Cloud Gaming", icon: "🎮", desc: "Play cloud games directly at nowgg.fun", category: "Gaming", defaultW: 1040, defaultH: 700 },
		{ id: "chat", name: "Onyx Chat", icon: "💬", desc: "Multi-channel community chat room", category: "Social", defaultW: 860, defaultH: 580 }
	];

	// Main Onyx OS Desktop Component
	function OnyxOS() {
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

				<!-- DESKTOP APP SHORTCUTS (Left Canvas) -->
				<div class="absolute top-28 left-8 z-10 hidden sm:flex flex-col gap-6 pointer-events-auto">
					${APPS.map(app => html`
						<div class="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-black/30 hover:bg-black/50 border border-white/10 backdrop-blur-md transition-all cursor-pointer group hover:scale-105 active:scale-95 shadow-lg"
							on:click=${() => this.openApp(app.id)} title=${app.desc}>
							<div class="text-3xl mb-1 group-hover:scale-110 transition-transform drop-shadow-md">${app.icon}</div>
							<span class="text-[10px] font-semibold text-neutral-200 tracking-tight truncate max-w-[70px]">${app.name}</span>
						</div>
					`)}
				</div>

				<!-- WINDOWS LAYER -->
				<div class="absolute inset-0 pointer-events-none">
					${use(this.windows, (winList) => winList.map(win => renderWindowDOM(win, scramjet, this)))}
				</div>

				<!-- BOTTOM LEFT FLOATING MENU BUTTON ( ☰ ) -->
				<button class="fixed bottom-4 left-4 z-50 w-11 h-11 rounded-full bg-black/75 hover:bg-black/90 border border-white/20 backdrop-blur-2xl text-white flex items-center justify-center text-lg shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all"
					style=${use(this.windows, () => {
						const active = this.windows.find(w => w.id === this.activeWinId);
						return (active && active.isMaximized && !active.isMinimized) ? "display: none !important;" : "";
					})}
					on:click=${() => this.toggleStartMenu()} title="Toggle System Menu">
					<span class="text-base font-bold">☰</span>
				</button>

				<!-- LEFT FLYOUT SIDEBAR MENU (as seen in inspiration image.png) -->
				<div class="fixed bottom-16 left-4 z-50 w-72 bg-black/85 border border-white/15 rounded-3xl p-4 backdrop-blur-2xl text-white shadow-2xl flex flex-col gap-2 font-sans animate-fade"
					style=${use(this.windows, () => {
						const active = this.windows.find(w => w.id === this.activeWinId);
						if (active && active.isMaximized && !active.isMinimized) return "display: none !important;";
						return this.startMenuOpen ? "display: flex;" : "display: none;";
					})}>
					
					<!-- Header: All Apps -->
					<div class="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/10 cursor-pointer transition-colors"
						on:click=${() => { this.openApp("browser"); this.startMenuOpen = false; }}>
						<span class="text-sm">⊞</span>
						<span class="text-xs font-semibold">All Apps</span>
					</div>

					<!-- Search input with ⌘K badge -->
					<div class="relative w-full">
						<input class="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-neutral-400 outline-none focus:border-white/30 pr-12 font-sans"
							placeholder="Search..."
							bind:value=${use(this.searchQuery)}
							on:input=${(e) => { this.searchQuery = e.target.value; }}></input>
						<span class="absolute right-3 top-2 text-[10px] text-neutral-400 bg-white/10 px-1.5 py-0.5 rounded-md font-mono">⌘K</span>
					</div>

					<!-- App Dock item -->
					<div class="flex items-center justify-between p-2 rounded-2xl hover:bg-white/10 cursor-pointer transition-colors"
						on:click=${() => { this.dockOpen = !this.dockOpen; }}>
						<div class="flex items-center gap-2 text-xs font-semibold">
							<span>📱</span>
							<span>App Dock</span>
						</div>
						<span class="text-xs text-neutral-400">›</span>
					</div>

					<div class="h-px bg-white/10 my-0.5"></div>

					<!-- Toggle: Animations -->
					<div class="flex items-center justify-between px-2 py-1.5">
						<span class="text-xs font-medium text-neutral-200">Animations</span>
						<button class="w-9 h-5 rounded-full transition-colors relative cursor-pointer ${this.animationsEnabled ? 'bg-white' : 'bg-white/20'}"
							on:click=${() => { this.animationsEnabled = !this.animationsEnabled; this.windows = [...this.windows]; }}>
							<div class="w-4 h-4 rounded-full bg-black absolute top-0.5 transition-transform ${this.animationsEnabled ? 'right-0.5' : 'left-0.5'}"></div>
						</button>
					</div>

					<!-- Toggle: Notifications -->
					<div class="flex items-center justify-between px-2 py-1.5">
						<span class="text-xs font-medium text-neutral-200">Notifications</span>
						<button class="w-9 h-5 rounded-full transition-colors relative cursor-pointer ${this.notificationsEnabled ? 'bg-white' : 'bg-white/20'}"
							on:click=${() => { this.notificationsEnabled = !this.notificationsEnabled; this.windows = [...this.windows]; }}>
							<div class="w-4 h-4 rounded-full bg-black absolute top-0.5 transition-transform ${this.notificationsEnabled ? 'right-0.5' : 'left-0.5'}"></div>
						</button>
					</div>

					<div class="h-px bg-white/10 my-0.5"></div>

					<!-- VIEW MODE Pills -->
					<div class="flex flex-col gap-1.5 px-1">
						<span class="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">VIEW MODE</span>
						<div class="flex items-center bg-white/5 p-1 rounded-full border border-white/10 gap-1 text-[11px]">
							<button class="flex-1 py-1 rounded-full text-center font-medium transition-all ${this.viewMode === 'auto' ? 'bg-white text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'}"
								on:click=${() => { this.viewMode = 'auto'; this.windows = [...this.windows]; }}>Auto</button>
							<button class="flex-1 py-1 rounded-full text-center font-medium transition-all ${this.viewMode === 'desktop' ? 'bg-white text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'}"
								on:click=${() => { this.viewMode = 'desktop'; this.windows = [...this.windows]; }}>Desktop</button>
							<button class="flex-1 py-1 rounded-full text-center font-medium transition-all ${this.viewMode === 'mobile' ? 'bg-white text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'}"
								on:click=${() => { this.viewMode = 'mobile'; this.windows = [...this.windows]; }}>Mobile</button>
						</div>
					</div>

					<div class="h-px bg-white/10 my-0.5"></div>

					<!-- Action Menu Items -->
					<div class="flex flex-col gap-0.5">
						<div class="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/10 cursor-pointer transition-colors text-xs font-medium"
							on:click=${() => { this.controlCenterOpen = !this.controlCenterOpen; this.startMenuOpen = false; }}>
							<span>🎛️</span>
							<span>Control Center</span>
						</div>
						<div class="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/10 cursor-pointer transition-colors text-xs font-medium text-rose-300 hover:text-rose-200"
							on:click=${() => { this.isLocked = true; this.startMenuOpen = false; }}>
							<span>🔒</span>
							<span>Lock Screen</span>
						</div>
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
						⠿
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
					<div class="text-xs font-bold text-neutral-300 uppercase tracking-wider">Control Center</div>
					
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

					<div class="h-px bg-white/10"></div>
					<button class="w-full py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 rounded-2xl text-rose-300 text-xs font-semibold transition-colors"
						on:click=${() => location.reload()}>
						Restart Onyx OS
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

						<button class="px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
							on:click=${() => { this.isLocked = false; }}>
							Unlock Onyx OS
						</button>
					</div>
				</div>

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
							✕
						</button>
						<button class="w-3.5 h-3.5 rounded-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 transition-colors flex items-center justify-center text-[8px] text-amber-950 font-bold cursor-pointer"
							on:mousedown=${(e) => e.stopPropagation()}
							on:click=${(e) => osInstance.minimizeWindow(win.id, e)} title="Minimize">
							−
						</button>
						<button class="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 transition-colors flex items-center justify-center text-[8px] text-emerald-950 font-bold cursor-pointer"
							on:mousedown=${(e) => e.stopPropagation()}
							on:click=${(e) => osInstance.toggleMaximize(win.id, e)} title="Maximize">
							⤢
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
				return "https://www.google.com/search?q=" + encodeURIComponent(clean);
			}
			return "https://" + clean;
		};

		const getTitleFromUrl = (urlStr) => {
			try {
				const u = new URL(urlStr);
				let host = u.hostname.replace(/^www\./, "");
				return host.charAt(0).toUpperCase() + host.slice(1);
			} catch (e) {
				return urlStr || "New Tab";
			}
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
			win.customState.showQuickBookmarks = true;
		}

		// TAB STRIP BAR
		const tabStrip = document.createElement("div");
		tabStrip.className = "flex items-center justify-between bg-neutral-900 border-b border-white/10 px-2 pt-1.5 gap-2 shrink-0 overflow-x-auto custom-scrollbar";

		const tabsListContainer = document.createElement("div");
		tabsListContainer.className = "flex items-center gap-1 overflow-x-auto min-w-0";

		const panelToggles = document.createElement("div");
		panelToggles.className = "flex items-center gap-1 shrink-0 pb-1";

		const bookmarksToggleBtn = document.createElement("button");
		bookmarksToggleBtn.title = "Bookmarks Manager";
		bookmarksToggleBtn.className = "px-2.5 py-1 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-neutral-300";
		bookmarksToggleBtn.innerHTML = `<span>⭐</span><span class="hidden sm:inline">Bookmarks</span>`;

		const historyToggleBtn = document.createElement("button");
		historyToggleBtn.title = "Browsing History";
		historyToggleBtn.className = "px-2.5 py-1 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-neutral-300";
		historyToggleBtn.innerHTML = `<span>🕒</span><span class="hidden sm:inline">History</span>`;

		const extensionsToggleBtn = document.createElement("button");
		extensionsToggleBtn.title = "Chrome Extensions";
		extensionsToggleBtn.className = "px-2.5 py-1 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-neutral-300";
		extensionsToggleBtn.innerHTML = `<span>🧩</span><span class="hidden sm:inline">Extensions</span>`;

		panelToggles.appendChild(bookmarksToggleBtn);
		panelToggles.appendChild(historyToggleBtn);
		panelToggles.appendChild(extensionsToggleBtn);
		tabStrip.appendChild(tabsListContainer);
		tabStrip.appendChild(panelToggles);

		// URL NAVIGATION BAR
		const urlBar = document.createElement("div");
		urlBar.className = "flex items-center p-2 gap-2 bg-neutral-900 border-b border-white/10 shrink-0 relative";

		const backBtn = document.createElement("button");
		backBtn.className = "w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 flex items-center justify-center text-xs cursor-pointer";
		backBtn.textContent = "←";
		backBtn.title = "Back";

		const fwdBtn = document.createElement("button");
		fwdBtn.className = "w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 flex items-center justify-center text-xs cursor-pointer";
		fwdBtn.textContent = "→";
		fwdBtn.title = "Forward";

		const reloadBtn = document.createElement("button");
		reloadBtn.className = "w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 flex items-center justify-center text-xs cursor-pointer";
		reloadBtn.textContent = "🔄";
		reloadBtn.title = "Reload";

		const urlInputBox = document.createElement("div");
		urlInputBox.className = "flex-1 flex items-center bg-black/60 border border-white/10 focus-within:border-purple-400 rounded-xl px-3 py-1 gap-2";

		const lockSpan = document.createElement("span");
		lockSpan.className = "text-xs text-emerald-400";
		lockSpan.textContent = "🔒";

		const urlInput = document.createElement("input");
		urlInput.className = "flex-1 bg-transparent text-xs text-white font-mono outline-none placeholder-neutral-500";
		urlInput.placeholder = "Search with Google or enter web address...";

		const starBtn = document.createElement("button");
		starBtn.className = "text-xs hover:scale-125 transition-transform cursor-pointer";
		starBtn.textContent = "☆";

		urlInputBox.appendChild(lockSpan);
		urlInputBox.appendChild(urlInput);
		urlInputBox.appendChild(starBtn);

		const goBtn = document.createElement("button");
		goBtn.className = "px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer";
		goBtn.textContent = "➜";
		goBtn.title = "Go to URL";

		const quickBmToggleBtn = document.createElement("button");
		quickBmToggleBtn.className = "w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 flex items-center justify-center text-xs cursor-pointer";
		quickBmToggleBtn.textContent = "🔖";
		quickBmToggleBtn.title = "Toggle Quick Bookmark Bar";

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
		urlBar.appendChild(quickBmToggleBtn);
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
			starBtn.textContent = isBm ? "⭐" : "☆";
			starBtn.title = isBm ? "Remove Bookmark" : "Bookmark this Page";
		};

		let nextTabNumericId = 1;

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
			};

			const handleUrlUpdate = (newUrl) => {
				if (!newUrl || newUrl === "about:blank" || newUrl.startsWith("blob:")) return;
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
								const ok = await window.sapphire.mountExtensionPage(frame.frame, extId, pagePath, tabNumericId);
								if (ok) return;
							}
							if (typeof window.sapphire.mountExtensionPopup === "function") {
								const ok = await window.sapphire.mountExtensionPopup(frame.frame, extId, tabNumericId);
								if (ok) return;
							}
						} catch (mountErr) {
							console.warn("[createTab] mountExtensionPage error, falling back to frame.go:", mountErr);
						}
						frame.go(target);
					}, 0);
					win.customState.viewportEl.appendChild(tabEl);
					addHistory(tabObj.title, target);
					return tabObj;
				}
			}

			frame.go(target);
			win.customState.viewportEl.appendChild(tabEl);
			addHistory(tabObj.title, target);
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
			const clean = formatUrl(targetUrl);
			activeTab.url = clean;
			activeTab.title = getTitleFromUrl(clean);
			syncActiveTabUrl(clean);
			activeTab.frameObj.go(clean);
			addHistory(activeTab.title, clean);
			renderTabStrip();
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
				globeSpan.className = "text-xs shrink-0";
				globeSpan.textContent = "🌐";

				const titleSpan = document.createElement("span");
				titleSpan.className = "truncate flex-1";
				titleSpan.textContent = tab.title || "New Tab";

				const closeBtnEl = document.createElement("button");
				closeBtnEl.className = "close-btn w-4 h-4 rounded-full hover:bg-white/20 text-neutral-400 hover:text-white flex items-center justify-center text-[10px] transition-colors shrink-0";
				closeBtnEl.title = "Close tab";
				closeBtnEl.textContent = "✕";
				closeBtnEl.onclick = (e) => {
					closeTab(tab.id, e);
				};

				tabDiv.appendChild(globeSpan);
				tabDiv.appendChild(titleSpan);
				tabDiv.appendChild(closeBtnEl);
				tabsListContainer.appendChild(tabDiv);
			});

			const newTabBtn = document.createElement("button");
			newTabBtn.className = "w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer shrink-0 ml-1";
			newTabBtn.title = "Open new tab";
			newTabBtn.textContent = "＋";
			newTabBtn.onclick = () => createNewTab("https://google.com");
			tabsListContainer.appendChild(newTabBtn);
		};

		// Quick Bookmarks Bar Renderer
		const renderQuickBookmarks = () => {
			const bms = Array.isArray(store.bookmarks) ? store.bookmarks : [];
			if (win.customState.showQuickBookmarks && bms.length > 0) {
				quickBmBar.style.display = "flex";
				quickBmBar.innerHTML = "";

				const label = document.createElement("span");
				label.className = "text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1";
				label.textContent = "Bookmarks:";
				quickBmBar.appendChild(label);

				bms.forEach(bm => {
					const bmBtn = document.createElement("button");
					bmBtn.className = "px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-200 hover:text-white border border-white/10 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer shrink-0";
					bmBtn.title = bm.url;
					bmBtn.onclick = () => handleNav(bm.url);

					const iconSpan = document.createElement("span");
					iconSpan.textContent = bm.icon || "⭐";

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

		// Drawer Renderer (Bookmarks, History, and Extensions side drawer)
		const renderDrawer = () => {
			drawerContainer.innerHTML = "";
			const activePanel = win.customState.activePanel;

			bookmarksToggleBtn.className = `px-2.5 py-1 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
				activePanel === 'bookmarks' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
			}`;
			historyToggleBtn.className = `px-2.5 py-1 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
				activePanel === 'history' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
			}`;
			extensionsToggleBtn.className = `px-2.5 py-1 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
				activePanel === 'extensions' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
			}`;

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
						<h3 class="text-sm font-bold text-white">Bookmarks Manager</h3>
					</div>
				`;
				const closeBtn = document.createElement("button");
				closeBtn.className = "w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center text-xs cursor-pointer";
				closeBtn.textContent = "✕";
				closeBtn.onclick = () => {
					win.customState.activePanel = "none";
					renderDrawer();
				};
				header.appendChild(closeBtn);
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
						<h3 class="text-sm font-bold text-white">Browsing History</h3>
					</div>
				`;
				const closeBtn = document.createElement("button");
				closeBtn.className = "w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center text-xs cursor-pointer";
				closeBtn.textContent = "✕";
				closeBtn.onclick = () => {
					win.customState.activePanel = "none";
					renderDrawer();
				};
				header.appendChild(closeBtn);
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
						<h3 class="text-sm font-bold text-white">Chrome Extensions</h3>
						<span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">${exts.length}</span>
					</div>
				`;
				const closeBtn = document.createElement("button");
				closeBtn.className = "w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center text-xs cursor-pointer";
				closeBtn.textContent = "✕";
				closeBtn.onclick = () => {
					win.customState.activePanel = "none";
					renderDrawer();
				};
				header.appendChild(closeBtn);
				drawerEl.appendChild(header);

				// Install Extension Drop / Picker Section
				const installBox = document.createElement("div");
				installBox.className = "p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col gap-2";

				const installTitle = document.createElement("div");
				installTitle.className = "text-xs font-semibold text-emerald-200 flex items-center gap-1.5";
				installTitle.innerHTML = `<span>➕</span><span>Install Extension</span>`;

				const fileInput = document.createElement("input");
				fileInput.type = "file";
				fileInput.accept = ".crx,.zip";
				fileInput.className = "hidden";

				const uploadBtn = document.createElement("button");
				uploadBtn.className = "w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer";
				uploadBtn.innerHTML = `<span>📂</span><span>Upload .CRX or .ZIP Extension</span>`;

				const dropZone = document.createElement("div");
				dropZone.className = "border border-dashed border-emerald-400/40 hover:border-emerald-300 rounded-lg p-2.5 text-center text-[11px] text-emerald-300/80 hover:text-emerald-200 transition-colors cursor-pointer";
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
					emptyDiv.className = "text-center text-xs text-neutral-500 py-8";
					emptyDiv.textContent = exts.length === 0 ? "No extensions installed yet. Upload a .CRX or .ZIP above to get started!" : "No matching extensions found.";
					listEl.appendChild(emptyDiv);
				}

				drawerEl.appendChild(listEl);
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

		quickBmToggleBtn.onclick = () => {
			win.customState.showQuickBookmarks = !win.customState.showQuickBookmarks;
			quickBmToggleBtn.className = `w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs cursor-pointer ${
				win.customState.showQuickBookmarks ? 'text-amber-400' : 'text-neutral-300'
			}`;
			renderQuickBookmarks();
		};

		bookmarksToggleBtn.onclick = () => {
			win.customState.activePanel = (win.customState.activePanel === "bookmarks") ? "none" : "bookmarks";
			renderDrawer();
		};

		historyToggleBtn.onclick = () => {
			win.customState.activePanel = (win.customState.activePanel === "history") ? "none" : "history";
			renderDrawer();
		};

		extensionsToggleBtn.onclick = () => {
			win.customState.activePanel = (win.customState.activePanel === "extensions") ? "none" : "extensions";
			renderDrawer();
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
		quickBmToggleBtn.className = `w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs cursor-pointer ${
			win.customState.showQuickBookmarks ? 'text-amber-400' : 'text-neutral-300'
		}`;

		return browserRoot;
	}

	const appRoot = document.getElementById("app");
	try {
		appRoot.replaceWith(h(OnyxOS));
	} catch (e) {
		appRoot.replaceWith(document.createTextNode("" + e));
		throw e;
	}
});
