// VeilOS System Audio, Assets, and Built-in Applications (Task Manager, Terminal, Files)
(function () {
	// Synthesized Web Audio API sound effects
	window.VeilAudio = {
		ctx: null,
		init() {
			if (!this.ctx && typeof window !== "undefined") {
				const AudioContext = window.AudioContext || window.webkitAudioContext;
				if (AudioContext) {
					this.ctx = new AudioContext();
				}
			}
			if (this.ctx && this.ctx.state === "suspended") {
				this.ctx.resume().catch(() => {});
			}
		},
		playChime() {
			if (window.store && window.store.soundEffects === false) return;
			try {
				this.init();
				if (!this.ctx) return;
				const notes = [523.25, 659.25, 783.99, 1046.50];
				notes.forEach((freq, idx) => {
					const osc = this.ctx.createOscillator();
					const gain = this.ctx.createGain();
					osc.type = "sine";
					const t = this.ctx.currentTime + idx * 0.08;
					osc.frequency.setValueAtTime(freq, t);
					gain.gain.setValueAtTime(0, t);
					gain.gain.linearRampToValueAtTime(0.08, t + 0.02);
					gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
					osc.connect(gain);
					gain.connect(this.ctx.destination);
					osc.start(t);
					osc.stop(t + 0.5);
				});
			} catch (e) {}
		},
		playClick() {
			if (window.store && window.store.soundEffects === false) return;
			try {
				this.init();
				if (!this.ctx) return;
				const osc = this.ctx.createOscillator();
				const gain = this.ctx.createGain();
				osc.type = "triangle";
				const t = this.ctx.currentTime;
				osc.frequency.setValueAtTime(880, t);
				osc.frequency.exponentialRampToValueAtTime(320, t + 0.035);
				gain.gain.setValueAtTime(0.03, t);
				gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
				osc.connect(gain);
				gain.connect(this.ctx.destination);
				osc.start(t);
				osc.stop(t + 0.04);
			} catch (e) {}
		},
		playPop() {
			if (window.store && window.store.soundEffects === false) return;
			try {
				this.init();
				if (!this.ctx) return;
				const osc = this.ctx.createOscillator();
				const gain = this.ctx.createGain();
				osc.type = "sine";
				const t = this.ctx.currentTime;
				osc.frequency.setValueAtTime(380, t);
				osc.frequency.exponentialRampToValueAtTime(140, t + 0.07);
				gain.gain.setValueAtTime(0.04, t);
				gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
				osc.connect(gain);
				gain.connect(this.ctx.destination);
				osc.start(t);
				osc.stop(t + 0.075);
			} catch (e) {}
		},
		playSnap() {
			if (window.store && window.store.soundEffects === false) return;
			try {
				this.init();
				if (!this.ctx) return;
				const osc = this.ctx.createOscillator();
				const gain = this.ctx.createGain();
				osc.type = "sine";
				const t = this.ctx.currentTime;
				osc.frequency.setValueAtTime(600, t);
				osc.frequency.exponentialRampToValueAtTime(900, t + 0.05);
				gain.gain.setValueAtTime(0.05, t);
				gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
				osc.connect(gain);
				gain.connect(this.ctx.destination);
				osc.start(t);
				osc.stop(t + 0.065);
			} catch (e) {}
		}
	};

	// Default wallpaper preset only
	window.VEIL_WALLPAPERS = [
		{ id: "default", name: "Default Wallpaper", url: "assets/background.jpg" }
	];

	function escapeHtml(str) {
		return ("" + (str || "")).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}

	// ==========================================
	// 1. Task Manager / Activity Monitor App
	// ==========================================
	window.renderActivityApp = function (win, scramjet, osInstance) {
		if (!win.customState) win.customState = {};
		if (win.customState.rootEl) return win.customState.rootEl;

		const root = document.createElement("div");
		root.className = "w-full h-full bg-[#0a0c12] text-white font-sans text-xs flex flex-col overflow-hidden select-none";

		let cpuUsage = 8;
		let memUsage = 280;

		function updateMetrics() {
			const activeWins = (osInstance && osInstance.windows) ? osInstance.windows.length : 1;
			cpuUsage = Math.min(96, Math.max(3, Math.round(5 + activeWins * 3.5 + (Math.sin(Date.now() / 1500) * 4) + (Math.random() * 3))));
			memUsage = Math.round(240 + activeWins * 48 + (Math.sin(Date.now() / 3000) * 12));
		}

		function render() {
			updateMetrics();
			const windows = (osInstance && osInstance.windows) ? osInstance.windows : [];
			const otherWins = windows.filter(w => w.id !== win.id);

			root.innerHTML = `
				<!-- Top Bar: Telemetry Gauges -->
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-neutral-900/60 border-b border-white/10 shrink-0">
					<div class="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
						<div class="flex items-center justify-between text-neutral-400 text-[10px] font-semibold uppercase tracking-wider">
							<span>CPU Usage</span>
							<i class="fa-solid fa-microchip text-indigo-400"></i>
						</div>
						<div class="text-xl font-bold font-mono text-indigo-400">${cpuUsage}%</div>
						<div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
							<div class="h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-500" style="width: ${cpuUsage}%"></div>
						</div>
					</div>

					<div class="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
						<div class="flex items-center justify-between text-neutral-400 text-[10px] font-semibold uppercase tracking-wider">
							<span>Memory</span>
							<i class="fa-solid fa-memory text-sky-400"></i>
						</div>
						<div class="text-xl font-bold font-mono text-sky-400">${memUsage} MB</div>
						<div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
							<div class="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500" style="width: ${Math.round((memUsage / 4096) * 100)}%"></div>
						</div>
					</div>

					<div class="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
						<div class="flex items-center justify-between text-neutral-400 text-[10px] font-semibold uppercase tracking-wider">
							<span>Active Processes</span>
							<i class="fa-solid fa-layer-group text-emerald-400"></i>
						</div>
						<div class="text-xl font-bold font-mono text-emerald-400">${windows.length}</div>
						<span class="text-[10px] text-neutral-400 truncate">Threads active</span>
					</div>

					<div class="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
						<div class="flex items-center justify-between text-neutral-400 text-[10px] font-semibold uppercase tracking-wider">
							<span>Network Gateway</span>
							<i class="fa-solid fa-network-wired text-purple-400"></i>
						</div>
						<div class="text-xl font-bold font-mono text-purple-400">${(osInstance && osInstance.pingMs) ? osInstance.pingMs : 12}ms</div>
						<span class="text-[10px] text-emerald-400 font-semibold truncate">BareMux Transport OK</span>
					</div>
				</div>

				<!-- Process Table Header -->
				<div class="flex items-center justify-between px-4 py-2 bg-neutral-950/80 border-b border-white/10 text-neutral-400 text-[11px] font-semibold">
					<div class="w-2/5">Process Name</div>
					<div class="w-1/6 text-center">PID</div>
					<div class="w-1/6 text-center">Status</div>
					<div class="w-1/6 text-center">CPU</div>
					<div class="w-1/6 text-right">Action</div>
				</div>

				<!-- Process Rows -->
				<div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
					${windows.map((w, idx) => {
						const isThis = w.id === win.id;
						const isFocus = osInstance && osInstance.activeWinId === w.id;
						const pCpu = isThis ? 1.2 : Math.max(0.5, Math.round((cpuUsage / (windows.length || 1)) * 10) / 10);
						return `
							<div class="flex items-center justify-between px-3 py-2 rounded-xl ${isFocus ? 'bg-indigo-600/20 border border-indigo-500/30 text-white' : 'bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-200'} transition-colors">
								<div class="w-2/5 flex items-center gap-2.5 truncate">
									<i class="${w.iconClass || 'fa-solid fa-window-maximize'} ${w.iconColor || 'text-neutral-400'} text-xs shrink-0"></i>
									<span class="font-medium truncate text-xs">${escapeHtml(w.title)}</span>
									${isThis ? '<span class="text-[9px] bg-white/10 text-neutral-400 px-1.5 py-0.5 rounded-md font-mono">This</span>' : ''}
								</div>
								<div class="w-1/6 text-center font-mono text-neutral-400 text-[11px]">#${1000 + idx * 12 + 4}</div>
								<div class="w-1/6 text-center">
									<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${w.isMinimized ? 'bg-amber-500/20 text-amber-400' : (isFocus ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400')}">
										${w.isMinimized ? 'Minimized' : (isFocus ? 'Focused' : 'Running')}
									</span>
								</div>
								<div class="w-1/6 text-center font-mono text-neutral-300 text-xs">${pCpu}%</div>
								<div class="w-1/6 text-right">
									<button data-win-id="${w.id}" class="end-task-btn px-2.5 py-1 rounded-lg bg-rose-600/25 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-[11px] font-semibold transition-all cursor-pointer">
										End Task
									</button>
								</div>
							</div>
						`;
					}).join("")}
				</div>

				<!-- Footer Controls -->
				<div class="p-2.5 px-4 bg-neutral-950 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
					<span>VeilOS Process Supervisor v2.5</span>
					<button id="refresh-task-mgr" class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1.5 cursor-pointer">
						<i class="fa-solid fa-rotate-right text-[10px]"></i>
						<span>Refresh</span>
					</button>
				</div>
			`;

			root.querySelectorAll(".end-task-btn").forEach(btn => {
				btn.addEventListener("click", (e) => {
					e.stopPropagation();
					const targetId = btn.getAttribute("data-win-id");
					if (targetId && osInstance) {
						osInstance.closeWindow(targetId);
						window.VeilAudio && window.VeilAudio.playPop();
						render();
					}
				});
			});

			const refBtn = root.querySelector("#refresh-task-mgr");
			if (refBtn) {
				refBtn.addEventListener("click", () => {
					window.VeilAudio && window.VeilAudio.playClick();
					render();
				});
			}
		}

		render();
		const interval = setInterval(render, 2000);
		win.customState.cleanup = () => clearInterval(interval);
		win.customState.rootEl = root;
		return root;
	};

	// ==========================================
	// 2. Veil Terminal App
	// ==========================================
	window.renderTerminalApp = function (win, scramjet, osInstance) {
		if (!win.customState) win.customState = {};
		if (win.customState.rootEl) return win.customState.rootEl;

		const root = document.createElement("div");
		root.className = "w-full h-full bg-[#090b10] text-[#e2e8f0] font-mono text-xs flex flex-col overflow-hidden select-text p-3";

		const historyLines = [
			{ type: "sys", text: "VeilOS Terminal v2.5.0 (x86_64-veil-web)" },
			{ type: "sys", text: "Type 'help' for available commands or 'veilfetch' for system info.\n" }
		];

		const outputContainer = document.createElement("div");
		outputContainer.className = "flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1 font-mono";

		function printLines() {
			outputContainer.innerHTML = "";
			historyLines.forEach(item => {
				const div = document.createElement("div");
				if (item.type === "cmd") {
					div.className = "flex items-center gap-2 text-emerald-400 font-semibold";
					div.innerHTML = `<span class="text-neutral-500">user@veilos:~$</span> <span>${escapeHtml(item.text)}</span>`;
				} else if (item.type === "sys") {
					div.className = "text-neutral-400 whitespace-pre-wrap";
					div.textContent = item.text;
				} else if (item.type === "success") {
					div.className = "text-sky-300 whitespace-pre-wrap";
					div.textContent = item.text;
				} else if (item.type === "warn") {
					div.className = "text-amber-400 whitespace-pre-wrap";
					div.textContent = item.text;
				} else if (item.type === "error") {
					div.className = "text-rose-400 whitespace-pre-wrap";
					div.textContent = item.text;
				}
				outputContainer.appendChild(div);
			});
			outputContainer.scrollTop = outputContainer.scrollHeight;
		}

		const promptRow = document.createElement("div");
		promptRow.className = "flex items-center gap-2 pt-2 border-t border-white/10 shrink-0 font-mono";
		promptRow.innerHTML = `
			<span class="text-emerald-400 font-bold shrink-0">user@veilos:~$</span>
			<input type="text" class="flex-1 bg-transparent text-white outline-none font-mono text-xs border-0 p-0" autocomplete="off" spellcheck="false" autofocus />
		`;

		const inputEl = promptRow.querySelector("input");
		const cmdHistory = [];
		let historyIdx = -1;

		function handleCommand(cmdStr) {
			const clean = cmdStr.trim();
			if (!clean) return;
			cmdHistory.push(clean);
			historyIdx = cmdHistory.length;
			historyLines.push({ type: "cmd", text: clean });

			const parts = clean.split(" ");
			const cmd = parts[0].toLowerCase();
			const args = parts.slice(1);

			if (cmd === "help") {
				historyLines.push({
					type: "sys",
					text: [
						"VeilOS Shell Built-in Commands:",
						"  veilfetch      Display system overview and ASCII logo",
						"  open <app>     Launch an application (e.g. open browser, open ai, open games)",
						"  ps             List all running window tasks",
						"  kill <pid>     Terminate a running window",
						"  ping           Check proxy gateway network latency",
						"  date           Display current system date and time",
						"  whoami         Print current logged in session username",
						"  clear          Clear the terminal window",
						"  echo <msg>     Echo a message to terminal"
					].join("\n")
				});
			} else if (cmd === "veilfetch") {
				const active = (osInstance && osInstance.windows) ? osInstance.windows.length : 1;
				historyLines.push({
					type: "success",
					text: [
						"       __      __   _ _  ____   _____ ",
						"       \\ \\    / /  (_) |/ __ \\ / ____|",
						"        \\ \\  / /__  _| | |  | | (___  ",
						"         \\ \\/ / _ \\| | | |  | |\\___ \\ ",
						"          \\  /  __/| | | |__| |____) |",
						"           \\/ \\___||_|_|\\____/|_____/ ",
						"  OS: VeilOS Web Desktop Environment 2.5",
						"  Host: WebAssembly & BareMux Worker Core",
						"  Kernel: Linux x86_64 Browser Sandboxed",
						"  Uptime: Active Web Session",
						"  Resolution: " + window.innerWidth + "x" + window.innerHeight,
						"  Active Windows: " + active,
						"  Theme: Obsidian Glass / Plus Jakarta Sans"
					].join("\n")
				});
			} else if (cmd === "open") {
				const target = args[0] ? args[0].toLowerCase() : "";
				if (!target) {
					historyLines.push({ type: "warn", text: "Usage: open <app>\nAvailable: browser, ai, chat, vault, movies, games, activity, files, gaming" });
				} else {
					const appAliases = {
						"browser": "browser", "web": "browser", "chrome": "browser",
						"ai": "ai", "scenario": "ai",
						"chat": "chat",
						"vault": "vault", "helium": "vault",
						"movies": "movies", "ssv": "movies",
						"games": "games", "pulse": "games",
						"activity": "activity", "taskmgr": "activity", "top": "activity",
						"files": "files", "file": "files",
						"gaming": "cloudgaming", "cloudgaming": "cloudgaming"
					};
					const realId = appAliases[target];
					if (realId && osInstance) {
						osInstance.openApp(realId);
						historyLines.push({ type: "success", text: `[VeilOS] Launched ${realId}` });
					} else {
						historyLines.push({ type: "error", text: `Unknown app: '${target}'. Type 'help' for options.` });
					}
				}
			} else if (cmd === "ps") {
				const wins = (osInstance && osInstance.windows) ? osInstance.windows : [];
				const lines = ["PID   APP             TITLE", "----- --------------- -------------------------"];
				wins.forEach((w, idx) => {
					const pid = String(1000 + idx * 12 + 4).padEnd(5);
					const app = String(w.appId).padEnd(15);
					lines.push(`${pid} ${app} ${w.title.slice(0, 25)}`);
				});
				historyLines.push({ type: "sys", text: lines.join("\n") });
			} else if (cmd === "kill") {
				const pid = parseInt(args[0], 10);
				const wins = (osInstance && osInstance.windows) ? osInstance.windows : [];
				const targetWin = wins.find((w, idx) => (1000 + idx * 12 + 4) === pid);
				if (targetWin && osInstance) {
					osInstance.closeWindow(targetWin.id);
					historyLines.push({ type: "success", text: `Terminated process #${pid} (${targetWin.title})` });
				} else {
					historyLines.push({ type: "error", text: `Process #${args[0]} not found. Run 'ps' to list running processes.` });
				}
			} else if (cmd === "ping") {
				historyLines.push({ type: "sys", text: `PING /baremux/worker.js: 64 bytes, latency = ${(osInstance && osInstance.pingMs) ? osInstance.pingMs : 12}ms` });
			} else if (cmd === "date") {
				historyLines.push({ type: "sys", text: new Date().toString() });
			} else if (cmd === "whoami") {
				historyLines.push({ type: "success", text: "veil-user (admin - wheel, audio, video, scramjet)" });
			} else if (cmd === "clear") {
				historyLines.length = 0;
			} else if (cmd === "echo") {
				historyLines.push({ type: "sys", text: args.join(" ") });
			} else {
				historyLines.push({ type: "error", text: `bash: ${cmd}: command not found. Type 'help' for command list.` });
			}
			printLines();
		}

		inputEl.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				const val = inputEl.value;
				inputEl.value = "";
				handleCommand(val);
			} else if (e.key === "ArrowUp") {
				if (cmdHistory.length > 0 && historyIdx > 0) {
					historyIdx--;
					inputEl.value = cmdHistory[historyIdx] || "";
				}
			} else if (e.key === "ArrowDown") {
				if (cmdHistory.length > 0 && historyIdx < cmdHistory.length - 1) {
					historyIdx++;
					inputEl.value = cmdHistory[historyIdx] || "";
				} else {
					historyIdx = cmdHistory.length;
					inputEl.value = "";
				}
			}
		});

		root.addEventListener("click", () => inputEl.focus());
		root.appendChild(outputContainer);
		root.appendChild(promptRow);
		printLines();

		win.customState.rootEl = root;
		return root;
	};

	// ==========================================
	// 3. Veil Files App
	// ==========================================
	window.renderFilesApp = function (win, scramjet, osInstance) {
		if (!win.customState) win.customState = {};
		if (win.customState.rootEl) return win.customState.rootEl;

		const root = document.createElement("div");
		root.className = "w-full h-full bg-[#0a0c14] text-white font-sans text-xs flex flex-col overflow-hidden select-none";

		const filesData = [
			{ name: "Onyx Browser.app", type: "app", appId: "browser", icon: "fa-solid fa-compass", color: "text-sky-400", size: "4.8 MB" },
			{ name: "Sonora.app", type: "app", appId: "music", icon: "fa-solid fa-music", color: "text-cyan-400", size: "7.4 MB" },
			{ name: "Scenario AI.app", type: "app", appId: "ai", icon: "fa-solid fa-wand-magic-sparkles", color: "text-purple-400", size: "8.2 MB" },
			{ name: "Onyx Chat.app", type: "app", appId: "chat", icon: "fa-solid fa-comments", color: "text-emerald-400", size: "3.1 MB" },
			{ name: "Helium Vault.app", type: "app", appId: "vault", icon: "fa-solid fa-tv", color: "text-cyan-400", size: "6.4 MB" },
			{ name: "SSV Movies.app", type: "app", appId: "movies", icon: "fa-solid fa-film", color: "text-pink-400", size: "5.5 MB" },
			{ name: "Pulse Games.app", type: "app", appId: "games", icon: "fa-solid fa-gamepad", color: "text-violet-400", size: "12.0 MB" },
			{ name: "Cloud Gaming.app", type: "app", appId: "cloudgaming", icon: "fa-solid fa-cloud", color: "text-indigo-400", size: "2.1 MB" },
			{ name: "Task Manager.app", type: "app", appId: "activity", icon: "fa-solid fa-chart-line", color: "text-rose-400", size: "1.4 MB" },
			{ name: "Veil Terminal.app", type: "app", appId: "terminal", icon: "fa-solid fa-terminal", color: "text-emerald-400", size: "1.2 MB" }
		];

		let activeCategory = "all";
		let searchQuery = "";

		function render() {
			const filtered = filesData.filter(f => {
				if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
				return true;
			});

			root.innerHTML = `
				<!-- Top Bar -->
				<div class="h-11 bg-neutral-900/60 border-b border-white/10 flex items-center justify-between px-4 shrink-0">
					<div class="flex items-center gap-2 text-neutral-300 text-xs font-semibold">
						<i class="fa-solid fa-hard-drive text-indigo-400"></i>
						<span>VeilOS Virtual Storage</span>
						<span class="text-neutral-500">/</span>
						<span class="text-white">Applications</span>
					</div>
					<div class="relative w-48">
						<input id="files-search" type="text" placeholder="Search apps..." value="${escapeHtml(searchQuery)}"
							class="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-3 py-1 text-xs text-white placeholder-neutral-500 outline-none focus:border-indigo-400" />
						<i class="fa-solid fa-magnifying-glass absolute left-2.5 top-2 text-[10px] text-neutral-400"></i>
					</div>
				</div>

				<!-- Main 2-Pane Body -->
				<div class="flex-1 flex overflow-hidden">
					<!-- Left Sidebar -->
					<div class="w-48 bg-neutral-950/60 border-r border-white/10 p-3 flex flex-col gap-1 shrink-0">
						<div class="text-[10px] uppercase font-bold text-neutral-500 px-2 py-1 tracking-wider">Navigation</div>
						<button data-cat="all" class="cat-btn flex items-center gap-2.5 px-3 py-2 rounded-xl bg-indigo-600/25 text-white border border-indigo-500/30 font-medium cursor-pointer transition-colors text-left">
							<i class="fa-solid fa-cubes w-4 text-sky-400"></i>
							<span>Applications</span>
						</button>
						<div class="mt-auto p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1 text-[11px] text-neutral-400">
							<span class="font-semibold text-white">Drive Health</span>
							<span>48.6 MB / 512 MB Used</span>
							<div class="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-0.5">
								<div class="h-full bg-indigo-500 w-[10%]"></div>
							</div>
						</div>
					</div>

					<!-- Right Grid -->
					<div class="flex-1 overflow-y-auto custom-scrollbar p-4">
						<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
							${filtered.map(f => `
								<div data-app-id="${f.appId || ''}" data-file-name="${f.name}"
									class="file-item p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 hover:border-indigo-400/40 cursor-pointer flex flex-col items-center gap-2 transition-all group">
									<div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl ${f.color} group-hover:scale-110 transition-transform">
										<i class="${f.icon}"></i>
									</div>
									<div class="text-center w-full">
										<div class="font-medium text-white text-xs truncate w-full" title="${f.name}">${escapeHtml(f.name)}</div>
										<div class="text-[10px] text-neutral-400 font-mono mt-0.5">${f.size}</div>
									</div>
								</div>
							`).join("")}
						</div>
					</div>
				</div>
			`;

			root.querySelectorAll(".cat-btn").forEach(btn => {
				btn.addEventListener("click", () => {
					activeCategory = btn.getAttribute("data-cat");
					render();
				});
			});

			const searchInput = root.querySelector("#files-search");
			if (searchInput) {
				searchInput.addEventListener("input", (e) => {
					searchQuery = e.target.value;
					render();
				});
			}

			root.querySelectorAll(".file-item").forEach(item => {
				item.addEventListener("dblclick", () => {
					const appId = item.getAttribute("data-app-id");
					if (appId && osInstance) {
						osInstance.openApp(appId);
						window.VeilAudio && window.VeilAudio.playPop();
					} else {
						const fileName = item.getAttribute("data-file-name");
						osInstance && osInstance.notify("File Opened", fileName, "fa-solid fa-file");
					}
				});
			});
		}

		render();
		win.customState.rootEl = root;
		return root;
	};
})();
