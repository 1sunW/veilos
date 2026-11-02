(function () {
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

	window.VEIL_WALLPAPERS = [
		{ id: "christmas", name: "Jolly Christmas", url: "assets/christmas.jpg" },
		{ id: "default", name: "Classic (Floral)", url: "assets/background.jpg" }
	];

	function escapeHtml(str) {
		return ("" + (str || "")).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}

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

				<div class="flex items-center justify-between px-4 py-2 bg-neutral-950/80 border-b border-white/10 text-neutral-400 text-[11px] font-semibold">
					<div class="w-2/5">Process Name</div>
					<div class="w-1/6 text-center">PID</div>
					<div class="w-1/6 text-center">Status</div>
					<div class="w-1/6 text-center">CPU</div>
					<div class="w-1/6 text-right">Action</div>
				</div>

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

	window.renderFilesApp = function (win, scramjet, osInstance) {
		if (!win.customState) win.customState = {};
		if (win.customState.rootEl) return win.customState.rootEl;

		const root = document.createElement("div");
		root.className = "w-full h-full bg-[#0a0c14] text-white font-sans text-xs flex flex-col overflow-hidden select-none";

		const filesData = [
			{ name: "Onyx Browser.app", type: "app", appId: "browser", icon: "fa-solid fa-bolt", color: "text-sky-400", size: "4.8 MB" },
			{ name: "SSV Movies.app", type: "app", appId: "movies", icon: "fa-solid fa-film", color: "text-rose-400", size: "5.5 MB" },
			{ name: "Pulse Games.app", type: "app", appId: "games", icon: "fa-solid fa-gamepad", color: "text-violet-400", size: "12.0 MB" },
			{ name: "Sonora.app", type: "app", appId: "music", icon: "fa-solid fa-music", color: "text-rose-400", size: "7.4 MB" },
			{ name: "Scenario.app", type: "app", appId: "ai", icon: "fa-solid fa-brain", color: "text-purple-400", size: "8.2 MB" },
			{ name: "Onyx Chat.app", type: "app", appId: "chat", icon: "fa-solid fa-message", color: "text-emerald-400", size: "3.1 MB" },
			{ name: "Helium Vault.app", type: "app", appId: "vault", icon: "fa-solid fa-vault", color: "text-cyan-400", size: "6.4 MB" },
			{ name: "Cloud Gaming.app", type: "app", appId: "cloudgaming", icon: "fa-solid fa-cloud", color: "text-teal-400", size: "2.1 MB" },
			{ name: "Task Manager.app", type: "app", appId: "activity", icon: "fa-solid fa-chart-line", color: "text-rose-400", size: "1.4 MB" },
			{ name: "Veil Terminal.app", type: "app", appId: "terminal", icon: "fa-solid fa-terminal", color: "text-emerald-400", size: "1.2 MB" },
			{ name: "Ampler Launcher.app", type: "app", appId: "ampler", icon: "fa-solid fa-cube", color: "text-emerald-400", size: "3.2 MB" },
			{ name: "Changelog & Credits.app", type: "app", appId: "changelog", icon: "fa-solid fa-scroll", color: "text-emerald-400", size: "850 KB" }
		];

		let activeCategory = "all";
		let searchQuery = "";

		function render() {
			const filtered = filesData.filter(f => {
				if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
				return true;
			});

			root.innerHTML = `
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

				<div class="flex-1 flex overflow-hidden">
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

	const CHANGELOG_DATA = [
		{
			era: "V0.8.x",
			badge: "Current Release",
			badgeClass: "bg-red-500/20 text-red-300 border-red-500/30",
			versions: [
				{
					version: "V0.8.1",
					title: "remove extensions, when search button is pushed it should automatically minimize all windows open, fix search bar.",
					tag: "Search & Windows",
					tagClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
					desc: "Removed browser extension subsystem and toolbar puzzle icons for a faster, distraction-free browsing experience. Upgraded search button to automatically minimize all open windows to reveal the desktop and search immediately. Fixed the Spotlight search bar with high-performance native DOM rendering, instant application filtering, keyboard navigation, and seamless web/URL browsing without template artifacts."
				},
				{
					version: "V0.8.0",
					title: "remove spooky add jolly (CHRISTMAS)",
					tag: "Jolly Christmas Theme",
					tagClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
					desc: "Transitioned VeilOS from Halloween to the festive Jolly Christmas season! Added holiday wallpaper with illuminated snow-covered pine trees and cozy cabin glow, falling crystalline snowflakes and golden light shimmer, warm crimson red and pine emerald UI accents, holiday sound ambiance, and updated themes across Onyx Browser, Movies, and Games."
				}
			]
		},
		{
			era: "V0.7.x",
			badge: "Previous Release",
			badgeClass: "bg-orange-500/20 text-orange-300 border-orange-500/30",
			versions: [
				{
					version: "V0.7.1",
					title: "add a halloween theme to the site, and every prompt should be a changelog update",
					tag: "Halloween Theme",
					tagClass: "bg-orange-500/20 text-orange-300 border-orange-500/30",
					desc: "Introduced official Halloween Spooky theme with glowing pumpkin amber and witch violet aesthetics, cinematic haunted forest wallpaper, floating spooky spectral ambiance, theme switcher in Preferences and Top Bar widget, Halloween styling across Movies and Games apps, and synchronized all prompt history into the system changelog."
				},
				{
					version: "V0.7.0",
					title: "edit everything",
					tag: "Onyx Chat",
					tagClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
					desc: "Full integration of the uploaded Onyx Chat React 18 multi-channel platform: automated Vite single-file compilation, Fastify /chat.html and /onyx-chat/ routes, onyx://chat internal protocol handler, desktop dock pinning, and New Tab quick shortcuts."
				}
			]
		},
		{
			era: "V0.6.x",
			badge: "Extensions & Chat Era",
			badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
			versions: [
				{
					version: "V0.6.6",
					title: "make a folder dedicated to onyx chat features, i will upload all onyx chat stuff to it",
					tag: "Chat Workspace",
					tagClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
					desc: "Created dedicated onyx-chat/ directory structure equipped with Vite single-file configuration, React 18, Tailwind CSS, Lucide icons, and automated build scripts ready for user uploads."
				},
				{
					version: "V0.6.5",
					title: "change default wisp back to wss://fern.best/wisp/",
					tag: "Networking",
					tagClass: "bg-teal-500/20 text-teal-300 border-teal-500/30",
					desc: "Reverted default Wisp transport proxy endpoint back to wss://fern.best/wisp/ across store settings, Epoxy client, and Scramjet bundle."
				},
				{
					version: "V0.6.4",
					title: "Print the exact source code, unmodified, of ONLY these two Express route handlers from the server file: 1. GET /api/webstore/search 2. GET /api/webstore/download",
					tag: "API Audit",
					tagClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
					desc: "Extracted and verified Fastify server routes for /api/webstore/search and /api/webstore/download with Google Chrome Web Store scraper, CORS proxy, and CRX stream buffering."
				},
				{
					version: "V0.6.3",
					title: "extensions?",
					tag: "Extensions",
					tagClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
					desc: "Integrated Sapphire Chrome Extensions runner with in-browser CRX installation, popup injection, onyx://extensions manager, and Chrome Web Store live search / download proxy with safeApiFetch fallback."
				},
				{
					version: "V0.6.2",
					title: "Unproxy Scenario",
					tag: "AI & Integrations",
					tagClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
					desc: "Direct, high-performance unproxied embedding for Scenario AI assistant with native browser tab passthrough and media permissions."
				},
				{
					version: "V0.6.1",
					title: "Font Awesome icons, Remove other apps from taskbar",
					tag: "UI & Icons",
					tagClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
					desc: "Restructured taskbar dock with core applications, standardized crisp Font Awesome iconography, and organized utility apps into Spotlight and menus."
				}
			]
		},
		{
			era: "V0.5.x",
			badge: "System Era",
			badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
			versions: [
				{
					version: "V0.5.10",
					title: "Unproxy it",
					tag: "Audio",
					tagClass: "bg-rose-500/20 text-rose-300 border-rose-500/30",
					desc: "Direct unproxied embedded playback for Sonora music engine with dedicated audio navigation and playback controls."
				},
				{
					version: "V0.5.9",
					title: "Add Sonora, proxy it",
					tag: "Audio",
					tagClass: "bg-rose-500/20 text-rose-300 border-rose-500/30",
					desc: "Integrated Sonora high-fidelity music streaming application with Scramjet proxy pipeline."
				},
				{
					version: "V0.5.8",
					title: "Fix app logos",
					tag: "Visuals",
					tagClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
					desc: "Replaced placeholder logos with custom crafted SVG app badges for all core desktop applications."
				},
				{
					version: "V0.5.7",
					title: "Add task manager, terminal, files",
					tag: "System Apps",
					tagClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
					desc: "Built-in Veil Task Manager with live process meters, interactive Veil Terminal shell, and Veil Files storage explorer."
				},
				{
					version: "V0.5.6",
					title: "Add close animations and make login icon bigger",
					tag: "Animations",
					tagClass: "bg-pink-500/20 text-pink-300 border-pink-500/30",
					desc: "Fluid window close animations and refined lock screen avatar presentation."
				},
				{
					version: "V0.5.5",
					title: "Add animations",
					tag: "Animations",
					tagClass: "bg-pink-500/20 text-pink-300 border-pink-500/30",
					desc: "Integrated micro-animations, fade transitions, and window bounce physics across desktop UI."
				},
				{
					version: "V0.5.4",
					title: "Login Icon change",
					tag: "Lockscreen",
					tagClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
					desc: "Polished user avatar styling on the VeilOS lock and login prompt."
				},
				{
					version: "V0.5.3",
					title: "Remove novene stuff and Font Awesome",
					tag: "Refactor",
					tagClass: "bg-neutral-500/20 text-neutral-300 border-neutral-500/30",
					desc: "Streamlined icon assets and pruned legacy UI libraries."
				},
				{
					version: "V0.5.2",
					title: "Add lucide.dev icons",
					tag: "Icons",
					tagClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
					desc: "Integrated vector Lucide icon library for modern, minimalist desktop indicators."
				},
				{
					version: "V0.5.1",
					title: "Remove reicon",
					tag: "Refactor",
					tagClass: "bg-neutral-500/20 text-neutral-300 border-neutral-500/30",
					desc: "Removed third-party icon bundle in favor of standalone vector assets."
				}
			]
		},
		{
			era: "V0.4.x",
			badge: "Overhaul Era",
			badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
			versions: [
				{
					version: "V0.4.10",
					title: "Base off of Novene, reicon integration",
					tag: "Design",
					tagClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
					desc: "Visual refresh exploring Novene OS desktop paradigms and icon pack layering."
				},
				{
					version: "V0.4.9",
					title: "Rename OnyxAI to Scenario",
					tag: "Branding",
					tagClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
					desc: "Branding update transitioning the AI assistant to Scenario."
				},
				{
					version: "V0.4.8",
					title: "Login screen",
					tag: "Lockscreen",
					tagClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
					desc: "Interactive system startup login prompt with lock and unlock state handling."
				},
				{
					version: "V0.4.7",
					title: "Make onyx chat account stay logged in through localStorage, fix browser engine",
					tag: "Persistence",
					tagClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
					desc: "Persistent user session state for Onyx Chat and strengthened browser core transport."
				},
				{
					version: "V0.4.6",
					title: "Fix menus loading on launch",
					tag: "Stability",
					tagClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
					desc: "Resolved startup race conditions ensuring flyout menus and windows open clean."
				},
				{
					version: "V0.4.5",
					title: "Fix more things (Cannot exit out of VeilOS launcher, Fix the white outline on everything in VeilOS preferences, fix auto about:blank cloak, bring back apps button but make it a menu with the apps not the hamburger menu, I should not be able to get to controls from time, make onyx browser home look like this, remove password from start, make onyx browser not start on launch)",
					tag: "Major Fixes",
					tagClass: "bg-rose-500/20 text-rose-300 border-rose-500/30",
					desc: "VeilOS launcher exit handling, settings outline refinements, auto about:blank cloak, standalone apps menu, controls isolation from time click, Onyx Browser home page, and start screen behavior."
				},
				{
					version: "V0.4.4",
					title: "Fix a lot of things (Clicking the app button goes to Hamburger Menu, Clicking time takes you to controls, REMOVE the Proxy Settings, Hamburger Menu is a weird font (make it a good one), On the App Dock button in the Hamburger Menu add an arrow and make sure you don't have to close the hamburger menu to see the changes, Remove Tags and Descriptions in the Hamburger Menu, There is a white outline in settings around everything fix it so it's just what you select, The auto about:blank switch is weird fix it, make the tab system in Onyx Browser better, add a home on Onyx Browser, Start with a Login Screen each time with VeilOS, Remove fake CPU and RAM usage in Controls)",
					tag: "Major Overhaul",
					tagClass: "bg-violet-500/20 text-violet-300 border-violet-500/30",
					desc: "App button linking to Hamburger Menu, clock opens controls, removed legacy proxy settings, improved menu typography, App Dock toggle arrow, removed tags/descriptions, settings selection outlines, about:blank cloak switch, improved Onyx tab system & home screen, startup login screen, and cleaned control metrics."
				},
				{
					version: "V0.4.3",
					title: "Make background a flower",
					tag: "Theme",
					tagClass: "bg-pink-500/20 text-pink-300 border-pink-500/30",
					desc: "Installed high-resolution floral aesthetic desktop wallpaper."
				},
				{
					version: "V0.4.2",
					title: "Remove OnyxAI and add OnyxAI through 3rd-Party Site",
					tag: "AI",
					tagClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
					desc: "Transitioned internal AI proxying to cloud hosted web application."
				},
				{
					version: "V0.4.1",
					title: "Remove Desktop Shortcuts",
					tag: "Desktop",
					tagClass: "bg-neutral-500/20 text-neutral-300 border-neutral-500/30",
					desc: "Cleaned desktop workspace by removing cluttered icon grid in favor of clean background and dock."
				}
			]
		},
		{
			era: "V0.3.x",
			badge: "Features Era",
			badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
			versions: [
				{
					version: "V0.3.10",
					title: "Add New Models",
					tag: "AI",
					tagClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
					desc: "Expanded AI assistant capabilities with additional model backends."
				},
				{
					version: "V0.3.9",
					title: "Add OnyxAI",
					tag: "AI",
					tagClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
					desc: "Introduced dedicated OnyxAI assistant window to the OS desktop."
				},
				{
					version: "V0.3.8",
					title: "Fix Hamburger menu",
					tag: "UI",
					tagClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
					desc: "Fixed styling, positioning, and animation triggers for the left slide-out hamburger menu."
				},
				{
					version: "V0.3.7",
					title: "Add Cloaks",
					tag: "Cloaking",
					tagClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
					desc: "Integrated tab disguise presets (Classroom, Drive, Docs, Canvas, Desmos) and stealth popup cloaks."
				},
				{
					version: "V0.3.6",
					title: "Font Awesome Integration",
					tag: "Icons",
					tagClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
					desc: "Full Font Awesome 6 icon system integration across desktop, dock, and windows."
				},
				{
					version: "V0.3.5",
					title: "Add Extension Search",
					tag: "Browser",
					tagClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
					desc: "Extension directory search filter inside Onyx Browser extension manager."
				},
				{
					version: "V0.3.4",
					title: "Add internal URLS to Onyx Browser",
					tag: "Browser",
					tagClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
					desc: "Built-in support for onyx://newtab, onyx://bookmarks, onyx://history, onyx://extensions, and onyx://settings."
				},
				{
					version: "V0.3.3",
					title: "Add Extension Popups",
					tag: "Extensions",
					tagClass: "bg-teal-500/20 text-teal-300 border-teal-500/30",
					desc: "Render Chrome extension action popups in Onyx Browser with full runtime API hooks."
				},
				{
					version: "V0.3.2",
					title: "Fix Helium Vault",
					tag: "Vault",
					tagClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
					desc: "Resolved media catalog indexing and embedded streaming playback issues."
				},
				{
					version: "V0.3.1",
					title: "Fix Extensions Button",
					tag: "Browser",
					tagClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
					desc: "Fixed toolbar extension trigger icon and extension manager modal in browser tabs."
				}
			]
		},
		{
			era: "V0.2.x",
			badge: "Expansion Era",
			badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
			versions: [
				{
					version: "V0.2.10",
					title: "Add Sapphire to Onyx Browser",
					tag: "Extensions",
					tagClass: "bg-teal-500/20 text-teal-300 border-teal-500/30",
					desc: "Embedded Sapphire Chrome Extensions runtime for Chromium-compatible extension injection."
				},
				{
					version: "V0.2.9",
					title: "Rename OnyxOS to VeilOS",
					tag: "Branding",
					tagClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
					desc: "Rebranded system to VeilOS Web Operating System with new branding guidelines."
				},
				{
					version: "V0.2.8",
					title: "Remove Bloxcraft Local Games",
					tag: "Games",
					tagClass: "bg-violet-500/20 text-violet-300 border-violet-500/30",
					desc: "Pruned legacy static game builds in favor of verified multi-provider cloud mirrors."
				},
				{
					version: "V0.2.7",
					title: "Remove Sea Bean, remove now.gg CG, remove all other community vaults",
					tag: "Pruning",
					tagClass: "bg-neutral-500/20 text-neutral-300 border-neutral-500/30",
					desc: "Streamlined game providers and vaulted media collections to fast, verified mirrors."
				},
				{
					version: "V0.2.6",
					title: "Add new Game Providers",
					tag: "Games",
					tagClass: "bg-violet-500/20 text-violet-300 border-violet-500/30",
					desc: "Expanded Pulse Games arcade with 8 high-speed mirror providers."
				},
				{
					version: "V0.2.5",
					title: "Copy media to Helium Vault",
					tag: "Media",
					tagClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
					desc: "Consolidated movie and anime dataset into high-speed unified Helium Vault catalog."
				},
				{
					version: "V0.2.4",
					title: "Remove fake gateway proxy stuff in SSV",
					tag: "Streaming",
					tagClass: "bg-pink-500/20 text-pink-300 border-pink-500/30",
					desc: "Eliminated mock gateway interfaces in favor of real Scramjet proxy streaming."
				},
				{
					version: "V0.2.3",
					title: "Import Helium Vault",
					tag: "Vault",
					tagClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
					desc: "Added Helium Vault movies, TV series, and anime collection browser with responsive cards."
				},
				{
					version: "V0.2.2",
					title: "Add new movie stream sites",
					tag: "Streaming",
					tagClass: "bg-pink-500/20 text-pink-300 border-pink-500/30",
					desc: "Integrated multiple alternate streaming players (VidLink, EmbedSU, SuperEmbed, AutoEmbed)."
				},
				{
					version: "V0.2.1",
					title: "Proxy movies",
					tag: "Streaming",
					tagClass: "bg-pink-500/20 text-pink-300 border-pink-500/30",
					desc: "Implemented Scramjet Service Worker proxying for video stream embeds."
				}
			]
		},
		{
			era: "V0.1.x",
			badge: "Foundations Era",
			badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/30",
			versions: [
				{
					version: "V0.1.10",
					title: "Import SSV movies",
					tag: "Media",
					tagClass: "bg-pink-500/20 text-pink-300 border-pink-500/30",
					desc: "Integrated SSV Movies streaming hub into desktop environment."
				},
				{
					version: "V0.1.9",
					title: "Hide wisps settings",
					tag: "Settings",
					tagClass: "bg-neutral-500/20 text-neutral-300 border-neutral-500/30",
					desc: "Simplified user settings by managing Wisp and Bare endpoints automatically in the background."
				},
				{
					version: "V0.1.8",
					title: "Change fonts on Games, Rename Dominum to Pulse",
					tag: "Games",
					tagClass: "bg-violet-500/20 text-violet-300 border-violet-500/30",
					desc: "Modern typography pass and renamed gaming suite to Pulse Games."
				},
				{
					version: "V0.1.7",
					title: "Remove themes dropdown on games",
					tag: "Games",
					tagClass: "bg-violet-500/20 text-violet-300 border-violet-500/30",
					desc: "Locked in a unified, distraction-free dark neon gaming theme."
				},
				{
					version: "V0.1.6",
					title: "3 updates, Icons (not current)",
					tag: "UI",
					tagClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
					desc: "UI improvements and icon updates."
				},
				{
					version: "V0.1.5",
					title: "Change themes of Games",
					tag: "Games",
					tagClass: "bg-violet-500/20 text-violet-300 border-violet-500/30",
					desc: "Visual refresh for games catalog cards and controls."
				},
				{
					version: "V0.1.4",
					title: "Import Dominum's Games",
					tag: "Games",
					tagClass: "bg-violet-500/20 text-violet-300 border-violet-500/30",
					desc: "Loaded community game directory into desktop window system."
				},
				{
					version: "V0.1.3",
					title: "Remove navigation bar of Cloud Gaming",
					tag: "Gaming",
					tagClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
					desc: "Full-window immersive presentation for Cloud Gaming."
				},
				{
					version: "V0.1.2",
					title: "Cloud gaming just nowgg.fun",
					tag: "Gaming",
					tagClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
					desc: "Configured Cloud Gaming window directly to nowgg.fun."
				},
				{
					version: "V0.1.1",
					title: "17 updates, fix background",
					tag: "Core",
					tagClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
					desc: "Major stability improvements and desktop background fix."
				}
			]
		},
		{
			era: "V0.0.x",
			badge: "Genesis Era",
			badgeClass: "bg-slate-500/20 text-slate-300 border-slate-500/30",
			versions: [
				{
					version: "V0.0.10",
					title: "Remove Playstation, Netflix, and Spotify button",
					tag: "Cleanup",
					tagClass: "bg-neutral-500/20 text-neutral-300 border-neutral-500/30",
					desc: "Cleaned up external launcher buttons for a focused native operating system feel."
				},
				{
					version: "V0.0.9",
					title: "Fix new tabs (again), Fix URL not changing at top",
					tag: "Browser",
					tagClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
					desc: "Resolved browser tab address bar synchronization on internal iframe navigation."
				},
				{
					version: "V0.0.8",
					title: "Make default wisp (Fern)",
					tag: "Proxy",
					tagClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
					desc: "Initial deployment with remote Wisp server transport."
				},
				{
					version: "V0.0.7",
					title: "Maximize covering App Dock and Hamburger Menu, Fix New Tabs, Fix Bookmarks button and History button",
					tag: "Window Manager",
					tagClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
					desc: "Window maximize depth management hiding taskbar, new tab button fixes, and bookmark/history triggers."
				},
				{
					version: "V0.0.6",
					title: "Fix refreshing when moving things",
					tag: "Window Manager",
					tagClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
					desc: "Preserved iframe DOM state when dragging, resizing, or focusing desktop windows."
				},
				{
					version: "V0.0.5",
					title: "Add page system, history and bookmarks to Onyx Browser",
					tag: "Browser",
					tagClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
					desc: "Full web browsing experience with multi-tab management, history logging, and bookmarks bar."
				},
				{
					version: "V0.0.4",
					title: "Add Cloud Gaming via myself",
					tag: "Gaming",
					tagClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
					desc: "Added initial Cloud Gaming app window."
				},
				{
					version: "V0.0.3",
					title: "Copy Synapse's look",
					tag: "Design",
					tagClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
					desc: "Adopted clean, sleek glassmorphism desktop environment aesthetics."
				},
				{
					version: "V0.0.2",
					title: "Fixed Exit and Minimize",
					tag: "Window Manager",
					tagClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
					desc: "Window control buttons (close, minimize, maximize) with active z-index focus."
				},
				{
					version: "V0.0.1",
					title: "Import Onyx and zoom out as a web OS",
					tag: "Genesis",
					tagClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
					desc: "Initial conception and architecture of Onyx/VeilOS as a full web-based operating system."
				}
			]
		}
	];

	const CREDITS_DATA = [
		{
			category: "Core Contributions & Systems",
			members: [
				{
					name: "Cherri",
					role: "Media Hub",
					detail: "SSV skidding and media streaming integration.",
					icon: "fa-solid fa-film text-rose-400",
					badge: "SSV skidding"
				},
				{
					name: "Synapse",
					role: "Original Inspiration",
					detail: "Idea and look behind the web desktop OS interface.",
					icon: "fa-solid fa-lightbulb text-amber-400",
					badge: "Idea"
				},
				{
					name: "ZXS",
					role: "Artificial Intelligence",
					detail: "AI engine integration and backend logic.",
					icon: "fa-solid fa-brain text-purple-400",
					badge: "AI"
				},
				{
					name: "Scramjet",
					role: "Web Proxy",
					detail: "Core proxy engine powering stealth web browsing and media rewriting.",
					icon: "fa-solid fa-bolt text-sky-400",
					badge: "Proxy Engine"
				},
				{
					name: "InHeavenlyy",
					role: "Networking",
					detail: "Wisp server generation and transport connectivity.",
					icon: "fa-solid fa-network-wired text-emerald-400",
					badge: "Wisp Gen"
				},
				{
					name: "Lord Beerus",
					role: "Vault Storage",
					detail: "Helium Vault media files and streaming archives.",
					icon: "fa-solid fa-vault text-cyan-400",
					badge: "Helium Vault Files"
				},
				{
					name: "Material",
					role: "UI & Aesthetics",
					detail: "Scenario UI design and presentation styling.",
					icon: "fa-solid fa-palette text-pink-400",
					badge: "Scenario UI"
				},
				{
					name: "viktorius",
					role: "Branding",
					detail: "Name of VeilOS.",
					icon: "fa-solid fa-signature text-indigo-400",
					badge: "Name"
				},
				{
					name: "Frogiee's Arcade",
					role: "Cloud Gaming",
					detail: "Cloud gaming integration and streaming mirrors.",
					icon: "fa-solid fa-cloud text-teal-400",
					badge: "Cloud Gaming"
				}
			]
		},
		{
			category: "Game Libraries & Game Archives",
			members: [
				{ name: "GN-Math", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "CKV", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "Hydra Network", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "LupineVault", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "3kh0", role: "Arcade Mirror", detail: "Legendary web game archive and library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "Daknux Zones", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "Frogiee's Arcade", role: "Arcade Mirror", detail: "Curated game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "Alexr's Worlds", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "CCPorted", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "Google Classroom Games", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "Seraph", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "Elite Gamez", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "UGS", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "Truffled", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "Bloxcraft UBG", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "PeteZah", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "ShuttleProxy", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" },
				{ name: "Marz Library", role: "Arcade Mirror", detail: "Community game library provider.", icon: "fa-solid fa-gamepad text-violet-400", badge: "Game Library" }
			]
		}
	];

	window.renderChangelogApp = function (win, scramjet, osInstance) {
		if (win.customState && win.customState.rootEl) {
			return win.customState.rootEl;
		}
		if (!win.customState) win.customState = {};

		const root = document.createElement("div");
		root.className = "w-full h-full flex flex-col bg-[#07080d] text-white select-text font-sans overflow-hidden";

		let currentTab = "changelog";
		let selectedEra = "all";
		let searchQuery = "";

		function countTotalVersions() {
			let total = 0;
			CHANGELOG_DATA.forEach(era => { total += era.versions.length; });
			return total;
		}

		function getFilteredEras() {
			const query = searchQuery.trim().toLowerCase();
			return CHANGELOG_DATA.filter(era => {
				if (selectedEra !== "all" && era.era !== selectedEra) return false;
				if (!query) return true;
				return era.era.toLowerCase().includes(query) ||
					era.versions.some(v =>
						v.version.toLowerCase().includes(query) ||
						v.title.toLowerCase().includes(query) ||
						v.desc.toLowerCase().includes(query) ||
						v.tag.toLowerCase().includes(query)
					);
			}).map(era => {
				if (!query) return era;
				return {
					...era,
					versions: era.versions.filter(v =>
						v.version.toLowerCase().includes(query) ||
						v.title.toLowerCase().includes(query) ||
						v.desc.toLowerCase().includes(query) ||
						v.tag.toLowerCase().includes(query)
					)
				};
			});
		}

		function render() {
			const totalVers = countTotalVersions();
			const filteredEras = getFilteredEras();

			root.innerHTML = `
				<div class="h-14 bg-neutral-900/90 border-b border-white/10 px-4 flex items-center justify-between shrink-0 backdrop-blur-xl">
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
							<i class="fa-solid fa-scroll text-sm"></i>
						</div>
						<div class="flex flex-col">
							<div class="flex items-center gap-2">
								<span class="text-sm font-bold text-white tracking-tight">VeilOS Changelog & Credits</span>
								<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
									<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
									<span>v0.6.2</span>
								</span>
							</div>
							<span class="text-[10px] text-neutral-400">Complete release history from V0.0.1 to V0.6.2 &bull; ${totalVers} total versions</span>
						</div>
					</div>

					<div class="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
						<button class="cl-nav-btn px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${currentTab === 'changelog' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}" data-tab="changelog">
							<i class="fa-solid fa-clock-rotate-left text-xs"></i>
							<span>Changelog</span>
						</button>
						<button class="cl-nav-btn px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${currentTab === 'credits' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}" data-tab="credits">
							<i class="fa-solid fa-crown text-xs"></i>
							<span>Credits</span>
						</button>
						<button class="cl-nav-btn px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${currentTab === 'about' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}" data-tab="about">
							<i class="fa-solid fa-circle-info text-xs"></i>
							<span>About</span>
						</button>
					</div>
				</div>

				<div class="flex-1 overflow-y-auto custom-scrollbar p-5">
					${currentTab === "changelog" ? `
						<div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-white/[0.03] border border-white/10 p-3 rounded-2xl backdrop-blur-md">
							<div class="relative flex-1">
								<i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs"></i>
								<input id="cl-search" type="text" value="${escapeHtml(searchQuery)}" placeholder="Search versions, features, fixes..."
									class="w-full pl-8 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-400/50 transition-colors" />
							</div>

							<div class="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar shrink-0">
								<button class="cl-era-btn px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${selectedEra === 'all' ? 'bg-white/20 text-white border border-white/30' : 'bg-white/5 text-neutral-400 hover:text-white border border-transparent'}" data-era="all">All</button>
								${CHANGELOG_DATA.map(era => `
									<button class="cl-era-btn px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all whitespace-nowrap ${selectedEra === era.era ? 'bg-indigo-600 text-white border border-indigo-400/40 shadow-sm' : 'bg-white/5 text-neutral-400 hover:text-white border border-transparent'}" data-era="${era.era}">${era.era}</button>
								`).join("")}
							</div>
						</div>

						<div class="space-y-6 max-w-4xl mx-auto">
							${filteredEras.length === 0 ? `
								<div class="py-12 text-center text-neutral-400">
									<i class="fa-solid fa-search text-3xl mb-3 text-neutral-600"></i>
									<p class="text-sm">No updates match your search "${escapeHtml(searchQuery)}"</p>
								</div>
							` : filteredEras.map(era => `
								<div class="bg-neutral-900/40 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-xl">
									<div class="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
										<div class="flex items-center gap-2.5">
											<div class="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-bold text-white text-xs">
												${era.era.replace(".x", "")}
											</div>
											<div>
												<h2 class="text-sm font-bold text-white tracking-tight">${era.era} Timeline</h2>
												<p class="text-[10px] text-neutral-400">${era.versions.length} release milestone${era.versions.length === 1 ? '' : 's'}</p>
											</div>
										</div>
										<span class="px-2.5 py-1 rounded-xl text-[10px] font-semibold border ${era.badgeClass}">${era.badge}</span>
									</div>

									<div class="space-y-3">
										${era.versions.map(v => `
											<div class="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all hover:bg-black/60 group">
												<div class="flex items-start justify-between gap-3">
													<div class="flex items-center gap-2">
														<span class="font-mono text-xs font-bold text-white px-2 py-0.5 rounded-md bg-white/10 border border-white/15">${v.version}</span>
														<h3 class="text-xs font-semibold text-neutral-100 group-hover:text-white transition-colors">${escapeHtml(v.title)}</h3>
													</div>
													<span class="px-2 py-0.5 rounded-full text-[9px] font-semibold border shrink-0 ${v.tagClass || 'bg-white/10 text-neutral-300 border-white/10'}">${v.tag}</span>
												</div>
												<p class="text-[11px] text-neutral-400 mt-2 leading-relaxed pl-1 border-l-2 border-indigo-500/40">${escapeHtml(v.desc)}</p>
											</div>
										`).join("")}
									</div>
								</div>
							`).join("")}
						</div>
					` : currentTab === "credits" ? `
						<div class="max-w-4xl mx-auto space-y-6">
							<div class="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-indigo-950/40 border border-emerald-500/25 shadow-xl text-center flex flex-col items-center gap-2">
								<div class="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-2xl text-emerald-300 shadow-md">
									<i class="fa-solid fa-crown"></i>
								</div>
								<h2 class="text-lg font-bold text-white tracking-tight">VeilOS Credits & Attributions</h2>
								<p class="text-xs text-neutral-300 max-w-lg leading-relaxed">Recognizing the developers, open-source maintainers, and foundational technologies that power the VeilOS ecosystem.</p>
							</div>

							${CREDITS_DATA.map(sec => `
								<div class="bg-neutral-900/40 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-xl">
									<div class="flex items-center gap-2 pb-3 mb-3 border-b border-white/10">
										<span class="text-xs font-bold text-white uppercase tracking-wider">${sec.category}</span>
										<span class="text-[10px] text-neutral-400">(${sec.members.length})</span>
									</div>
									<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
										${sec.members.map(m => `
											<div class="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between gap-3">
												<div class="flex items-start gap-3">
													<div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0">
														<i class="${m.icon}"></i>
													</div>
													<div class="flex-1 min-w-0">
														<div class="flex items-center justify-between gap-2">
															<span class="text-xs font-bold text-white truncate">${m.name}</span>
															<span class="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white/10 text-neutral-300 border border-white/10">${m.badge}</span>
														</div>
														<div class="text-[10px] text-indigo-400 font-medium">${m.role}</div>
													</div>
												</div>
												<p class="text-[11px] text-neutral-400 leading-relaxed">${m.detail}</p>
											</div>
										`).join("")}
									</div>
								</div>
							`).join("")}
						</div>
					` : `
						<div class="max-w-2xl mx-auto space-y-4">
							<div class="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 shadow-2xl flex flex-col items-center text-center gap-3">
								<div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-3xl text-white shadow-xl">
									<i class="fa-solid fa-shapes"></i>
								</div>
								<h2 class="text-xl font-bold text-white">VeilOS Web Operating System</h2>
								<p class="text-xs text-neutral-400 max-w-md leading-relaxed">
									A privacy-focused, unblocked web desktop operating system featuring an in-OS tabbed web browser, native proxy engine, media vaults, games arcade, and stealth tab disguise cloaks.
								</p>
								<div class="flex items-center gap-2 mt-1">
									<span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Release v0.6.2</span>
									<span class="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-neutral-300 border border-white/10">MIT License</span>
								</div>
							</div>

							<div class="p-5 rounded-3xl bg-black/40 border border-white/10 divide-y divide-white/5 text-xs">
								<div class="py-2.5 flex items-center justify-between">
									<span class="text-neutral-400">Operating System</span>
									<span class="font-semibold text-white">VeilOS Web OS</span>
								</div>
								<div class="py-2.5 flex items-center justify-between">
									<span class="text-neutral-400">Current Build</span>
									<span class="font-mono text-white">v0.6.2 (Unproxy Scenario)</span>
								</div>
								<div class="py-2.5 flex items-center justify-between">
									<span class="text-neutral-400">Default Web Browser</span>
									<span class="font-semibold text-sky-400">Onyx Browser</span>
								</div>
								<div class="py-2.5 flex items-center justify-between">
									<span class="text-neutral-400">Proxy Engine</span>
									<span class="font-semibold text-indigo-400">Scramjet Service Worker + BareMux</span>
								</div>
								<div class="py-2.5 flex items-center justify-between">
									<span class="text-neutral-400">Transport Layer</span>
									<span class="font-mono text-emerald-400">/epoxy/index.mjs &bull; Wisp WebSocket</span>
								</div>
								<div class="py-2.5 flex items-center justify-between">
									<span class="text-neutral-400">Tab Cloaking</span>
									<span class="font-semibold text-purple-400">Classroom, Drive, Canvas, Desmos, Custom</span>
								</div>
								<div class="py-2.5 flex items-center justify-between">
									<span class="text-neutral-400">Stealth Modes</span>
									<span class="font-semibold text-teal-400">Disguised About:Blank & Blob Cloaks</span>
								</div>
								<div class="py-2.5 flex items-center justify-between">
									<span class="text-neutral-400">Developer</span>
									<span class="font-semibold text-amber-400">ezclaps (Gavin)</span>
								</div>
							</div>
						</div>
					`}
				</div>
			`;

			root.querySelectorAll(".cl-nav-btn").forEach(btn => {
				btn.addEventListener("click", () => {
					currentTab = btn.getAttribute("data-tab");
					render();
				});
			});

			root.querySelectorAll(".cl-era-btn").forEach(btn => {
				btn.addEventListener("click", () => {
					selectedEra = btn.getAttribute("data-era");
					render();
				});
			});

			const searchInput = root.querySelector("#cl-search");
			if (searchInput) {
				searchInput.addEventListener("input", (e) => {
					searchQuery = e.target.value;
					render();
					const nextInp = root.querySelector("#cl-search");
					if (nextInp) {
						nextInp.focus();
						nextInp.selectionStart = nextInp.selectionEnd = nextInp.value.length;
					}
				});
			}
		}

		render();
		win.customState.rootEl = root;
		return root;
	};
})();
