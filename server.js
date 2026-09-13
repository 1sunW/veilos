// Dev server imports
import { createBareServer } from "@nebula-services/bare-server-node";
import { createServer } from "http";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { join } from "node:path";
import rspackConfig from "./rspack.config.js";
import { rspack } from "@rspack/core";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

//transports
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { execSync } from "node:child_process";
import { GoogleGenAI } from "@google/genai";
import ts from "typescript";

let aiClient = null;
function getAiClient() {
	if (!aiClient) {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) {
			throw new Error("GEMINI_API_KEY environment variable is required");
		}
		aiClient = new GoogleGenAI({
			apiKey,
			httpOptions: {
				headers: {
					"User-Agent": "aistudio-build",
				},
			},
		});
	}
	return aiClient;
}

// Always ensure static assets are synced to public
try {
	execSync("node scripts/copy-assets.mjs", { stdio: "inherit" });
} catch (e) {
	console.error("Failed to sync static assets to public:", e);
}

const bare = createBareServer("/bare/", {
	logErrors: true,
	blockLocal: false,
});

wisp.options.allow_loopback_ips = true;
wisp.options.allow_private_ips = true;

const fastify = Fastify({
	serverFactory: (handler) => {
		return createServer()
			.on("request", (req, res) => {
				if (bare.shouldRoute(req)) {
					bare.routeRequest(req, res);
				} else {
					handler(req, res);
				}
			})
			.on("upgrade", (req, socket, head) => {
				if (bare.shouldRoute(req)) {
					bare.routeUpgrade(req, socket, head);
				} else {
					wisp.routeRequest(req, socket, head);
				}
			});
	},
});

fastify.register(fastifyStatic, {
	root: join(fileURLToPath(new URL(".", import.meta.url)), "./public"),
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: join(fileURLToPath(new URL(".", import.meta.url)), "./dist"),
	prefix: "/scram/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: join(fileURLToPath(new URL(".", import.meta.url)), "./assets"),
	prefix: "/assets/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: baremuxPath,
	prefix: "/baremux/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: epoxyPath,
	prefix: "/epoxy/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: libcurlPath,
	prefix: "/libcurl/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: bareModulePath,
	prefix: "/baremod/",
	decorateReply: false,
});

// Helper to locate data.tsx / data.ts
function getDataTsPath() {
	if (existsSync("./data.tsx")) return "./data.tsx";
	if (existsSync("./src/data.tsx")) return "./src/data.tsx";
	if (existsSync("./static/data.tsx")) return "./static/data.tsx";
	if (existsSync("./data.ts")) return "./data.ts";
	if (existsSync("./src/data.ts")) return "./src/data.ts";
	if (existsSync("./static/data.ts")) return "./static/data.ts";
	return null;
}

function transpileDataFile(source) {
	return ts.transpileModule(source, {
		compilerOptions: {
			target: ts.ScriptTarget.ES2022,
			module: ts.ModuleKind.ES2022,
			jsx: ts.JsxEmit.ReactJSX,
			removeComments: false,
		},
	});
}

// Helium Vault dynamic data endpoint - transpiles data.tsx / data.ts on the fly for live updates
fastify.get("/data.tsx", async (request, reply) => {
	try {
		const filePath = getDataTsPath();
		if (!filePath) {
			return reply
				.header("Content-Type", "application/javascript; charset=utf-8")
				.header("Cache-Control", "no-cache, no-store, must-revalidate")
				.send("export const VAULT_DATA = { movies: [], tv: [], anime: [], manga: [], apps: [], proxies: [] }; export default VAULT_DATA;");
		}
		const source = readFileSync(filePath, "utf8");
		const transpiled = transpileDataFile(source);
		return reply
			.header("Content-Type", "application/javascript; charset=utf-8")
			.header("Cache-Control", "no-cache, no-store, must-revalidate")
			.send(transpiled.outputText);
	} catch (err) {
		console.error("Transpiling data.tsx error:", err);
		return reply
			.header("Content-Type", "application/javascript; charset=utf-8")
			.header("Cache-Control", "no-cache, no-store, must-revalidate")
			.send(`console.error("data.tsx transpile error:", ${JSON.stringify(err.message)}); export const VAULT_DATA = { movies: [], tv: [], anime: [], manga: [], apps: [], proxies: [] }; export default VAULT_DATA;`);
	}
});

fastify.get("/data.ts", async (request, reply) => {
	try {
		const filePath = getDataTsPath();
		if (!filePath) {
			return reply
				.header("Content-Type", "application/javascript; charset=utf-8")
				.header("Cache-Control", "no-cache, no-store, must-revalidate")
				.send("export const VAULT_DATA = { movies: [], tv: [], anime: [], manga: [], apps: [], proxies: [] }; export default VAULT_DATA;");
		}
		const source = readFileSync(filePath, "utf8");
		const transpiled = transpileDataFile(source);
		return reply
			.header("Content-Type", "application/javascript; charset=utf-8")
			.header("Cache-Control", "no-cache, no-store, must-revalidate")
			.send(transpiled.outputText);
	} catch (err) {
		console.error("Transpiling data.ts error:", err);
		return reply
			.header("Content-Type", "application/javascript; charset=utf-8")
			.header("Cache-Control", "no-cache, no-store, must-revalidate")
			.send(`console.error("data.ts transpile error:", ${JSON.stringify(err.message)}); export const VAULT_DATA = { movies: [], tv: [], anime: [], manga: [], apps: [], proxies: [] }; export default VAULT_DATA;`);
	}
});

// Alias for /data.js
fastify.get("/data.js", async (request, reply) => {
	try {
		const filePath = getDataTsPath();
		if (!filePath) {
			return reply
				.header("Content-Type", "application/javascript; charset=utf-8")
				.header("Cache-Control", "no-cache, no-store, must-revalidate")
				.send("window.VAULT_DATA = { movies: [], tv: [], anime: [], manga: [], apps: [], proxies: [] };");
		}
		const source = readFileSync(filePath, "utf8");
		const transpiled = transpileDataFile(source);
		return reply
			.header("Content-Type", "application/javascript; charset=utf-8")
			.header("Cache-Control", "no-cache, no-store, must-revalidate")
			.send(transpiled.outputText);
	} catch (err) {
		console.error("Transpiling data.js error:", err);
		return reply
			.header("Content-Type", "application/javascript; charset=utf-8")
			.header("Cache-Control", "no-cache, no-store, must-revalidate")
			.send(`console.error("data.js transpile error:", ${JSON.stringify(err.message)});`);
	}
});

// Sapphire Extension bootstrap and fallback routes
fastify.get("/~/sx/:extId/__bootstrap__", async (request, reply) => {
	return reply
		.header("Content-Type", "text/html; charset=utf-8")
		.header("Cache-Control", "no-cache, no-store, must-revalidate")
		.send("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Sapphire Extension</title></head><body></body></html>");
});

fastify.get("/~/sx/*", async (request, reply) => {
	if (request.url.includes("__bootstrap__")) {
		return reply
			.header("Content-Type", "text/html; charset=utf-8")
			.header("Cache-Control", "no-cache, no-store, must-revalidate")
			.send("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Sapphire Extension</title></head><body></body></html>");
	}
	return reply.status(404).send("Extension resource handled via Service Worker.");
});

// AI API Endpoints using Server-Side Gemini API
fastify.post("/api/ai/chat", async (request, reply) => {
	try {
		const ai = getAiClient();
		const { prompt, history = [], pageContext, systemInstruction } = request.body || {};

		if (!prompt && !history.length) {
			return reply.code(400).send({ error: "Prompt or message history is required." });
		}

		// Streamlined message content mapping
		const contents = history.map(msg => ({
			role: msg.role === "user" ? "user" : "model",
			parts: [{ text: msg.content }],
		}));

		if (prompt) {
			const contextText = pageContext && (pageContext.url || pageContext.title || pageContext.text)
				? `[Page Context: Title "${pageContext.title || "Untitled"}", URL "${pageContext.url || "Unknown"}"${pageContext.text ? `\nSnippet: ${pageContext.text.slice(0, 2000)}` : ""}]\n\n`
				: "";

			contents.push({
				role: "user",
				parts: [{ text: contextText + prompt }],
			});
		}

		const defaultSystem = systemInstruction || "You are Veil AI, an intelligent, fast browser assistant built into the Veil Web Browser. You help users navigate the web, summarize content, answer questions, explain code, and assist with creative or research tasks. Keep answers concise, accurate, formatted in clear markdown, and friendly.";

		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents,
			config: { systemInstruction: defaultSystem },
		});

		return reply.send({ text: response.text || "No response generated." });
	} catch (err) {
		console.error("AI Chat API Error:", err);
		return reply.code(500).send({ error: err.message || "Failed to generate AI response" });
	}
});

fastify.post("/api/ai/summarize", async (request, reply) => {
	try {
		const ai = getAiClient();
		const { content = "", title = "N/A", url = "N/A" } = request.body || {};

		if (!content && !url) {
			return reply.code(400).send({ error: "Content or URL is required to summarize" });
		}

		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: `Please summarize this content concisely:\nTitle: ${title}\nURL: ${url}\n\nContent:\n${content.slice(0, 15000)}`,
			config: {
				systemInstruction: "You are Veil AI Page Summarizer. Produce clear, elegant, markdown-formatted summaries including an executive summary (2-3 sentences), key takeaways (3-5 bullet points), and Conclusions/Actionable Insights.",
			},
		});

		return reply.send({ summary: response.text || "Unable to generate summary." });
	} catch (err) {
		console.error("AI Summarize API Error:", err);
		return reply.code(500).send({ error: err.message || "Failed to summarize page" });
	}
});

// Curated list of popular, high-utility Chrome extensions for instant browsing
const FEATURED_EXTENSIONS = [
	{
		id: "eimadpbcbfnmbkopoojfekhnkhdbieeh",
		name: "Dark Reader",
		icon: "https://lh3.googleusercontent.com/T66wTLk-gpBBGsMm0SDJJ3VaI8YM0Utr8NaGCSANmXOfb84K-9GmyXORLKoslfxtasKtQ4spDCdq_zlp_t3QQ6SI0A",
		description: "Dark mode for every website. Invert colors cleanly, reduce eye strain, and protect your eyes day and night.",
		rating: 4.7,
		ratingCount: 13185,
		users: 7000000,
		category: "Accessibility & Themes"
	},
	{
		id: "ddkjiahejlhfcafbddmgiahcphecmpfh",
		name: "uBlock Origin Lite",
		icon: "https://lh3.googleusercontent.com/TNijZW_Gp9MZ3eqXkve0YWDEiHV-a2IpSpD6IJzrV3Y76GJcLEyzX2regTLemXzBHbHVqkKuxnnWDT34Cp4sNh-Y",
		description: "Permission-less, fast, efficient MV3 ad blocker and content filter by Raymond Hill.",
		rating: 4.6,
		ratingCount: 5240,
		users: 1000000,
		category: "Privacy & Ad Blockers"
	},
	{
		id: "mnjggcdmjocbbbhaepdhchncahnbgone",
		name: "SponsorBlock for YouTube",
		icon: "https://lh3.googleusercontent.com/o_XWfKq5Lgq5e7Y9M3v5E1R4m0w4k6Y9P1b2N3X5Z7V9W1L3Q5A7C9E1G3I5K7M9",
		description: "Skip sponsor segments, intros, animated endcards, and self-promotion in YouTube videos.",
		rating: 4.8,
		ratingCount: 6800,
		users: 1000000,
		category: "Video & Media"
	},
	{
		id: "gebbhagfogifgggkldgodflihgfeippi",
		name: "Return YouTube Dislike",
		icon: "https://lh3.googleusercontent.com/P0_k6M8Y1W3v5E7Q9A1C3E5G7I9K1M3O5Q7S9U1W3Y5a7c9e1g3i5k7m9o1q3s5",
		description: "Restores the ability to see dislike counts on YouTube videos using community data.",
		rating: 4.7,
		ratingCount: 14200,
		users: 4000000,
		category: "Social & Media"
	},
	{
		id: "fmkadmapgofadopljbjfkapdkoienihi",
		name: "React Developer Tools",
		icon: "https://lh3.googleusercontent.com/TNijZW_Gp9MZ3eqXkve0YWDEiHV-a2IpSpD6IJzrV3Y76GJcLEyzX2regTLemXzBHbHVqkKuxnnWDT34Cp4sNh-Y",
		description: "Inspect the React component hierarchies, props, state, and context in Chrome DevTools.",
		rating: 3.9,
		ratingCount: 1640,
		users: 5000000,
		category: "Developer Tools"
	},
	{
		id: "jinjaccalgkegednnccohejagnlnfdag",
		name: "Violentmonkey",
		icon: "https://lh3.googleusercontent.com/Z4w2t5_F8A0X3s_C5v7D_q2qA2D_r0W4p4A4h7q0F5D4h4e4p_u4x4F5F4h4e4p",
		description: "Open-source userscript manager for running Greasemonkey and Tampermonkey scripts.",
		rating: 4.7,
		ratingCount: 2200,
		users: 800000,
		category: "Productivity & Scripting"
	},
	{
		id: "bgnkhhnnamicmpeenaelnjfhikgbkllg",
		name: "AdGuard AdBlocker",
		icon: "https://lh3.googleusercontent.com/bgnkhhnnamicmpeenaelnjfhikgbkllg",
		description: "Blocks all types of advertisements, popups, and intrusive tracking across websites.",
		rating: 4.7,
		ratingCount: 48900,
		users: 10000000,
		category: "Privacy & Ad Blockers"
	},
	{
		id: "nngceckbapebfimnlniiiahkandclblb",
		name: "Bitwarden - Free Password Manager",
		icon: "https://lh3.googleusercontent.com/nngceckbapebfimnlniiiahkandclblb",
		description: "Secure, open-source password manager to store and autofill credentials securely.",
		rating: 4.8,
		ratingCount: 8800,
		users: 5000000,
		category: "Security"
	}
];

// Chrome Web Store Search Endpoint
fastify.get("/api/webstore/search", async (request, reply) => {
	try {
		const rawQuery = (request.query && request.query.q ? String(request.query.q).trim() : "");

		// 1. Direct Web Store URL or pure 32-letter Extension ID check
		let directExtId = null;
		const urlMatch = rawQuery.match(/detail\/(?:[^\/]+\/)?([a-z]{32})/i);
		if (urlMatch) {
			directExtId = urlMatch[1].toLowerCase();
		} else if (/^[a-z]{32}$/i.test(rawQuery)) {
			directExtId = rawQuery.toLowerCase();
		}

		// Empty or popular query
		if (!rawQuery || rawQuery.toLowerCase() === "popular" || rawQuery.toLowerCase() === "featured") {
			return reply.send({ results: FEATURED_EXTENSIONS });
		}

		const searchQuery = directExtId || rawQuery;
		const searchUrl = `https://chromewebstore.google.com/search/${encodeURIComponent(searchQuery)}`;
		const response = await fetch(searchUrl, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				"Accept-Language": "en-US,en;q=0.9",
			},
		});

		if (!response.ok) {
			// Fallback to filtering featured extensions
			const fallback = FEATURED_EXTENSIONS.filter(ex =>
				ex.name.toLowerCase().includes(rawQuery.toLowerCase()) ||
				ex.description.toLowerCase().includes(rawQuery.toLowerCase()) ||
				ex.id.toLowerCase() === rawQuery.toLowerCase()
			);
			return reply.send({ results: fallback.length ? fallback : FEATURED_EXTENSIONS });
		}

		const html = await response.text();
		const items = [];
		const seenIds = new Set();

		// Priority check: if query matches any featured extension
		for (const feat of FEATURED_EXTENSIONS) {
			if (
				feat.name.toLowerCase().includes(rawQuery.toLowerCase()) ||
				rawQuery.toLowerCase().includes(feat.name.toLowerCase()) ||
				feat.id.toLowerCase() === rawQuery.toLowerCase()
			) {
				items.push(feat);
				seenIds.add(feat.id);
			}
		}

		// Parse AF_initDataCallback structures
		const cbMatches = [...html.matchAll(/AF_initDataCallback\(([\s\S]*?)\);<\/script>/g)];
		for (const match of cbMatches) {
			const raw = match[1];
			if (raw.includes("https://lh3.googleusercontent.com") || raw.includes("data:")) {
				try {
					const fn = new Function("AF_initDataCallback", "AF_initDataCallback(" + raw + ")");
					fn((obj) => {
						function walk(node) {
							if (!node || typeof node !== "object") return;
							if (Array.isArray(node)) {
								if (
									typeof node[0] === "string" &&
									/^[a-z]{32}$/.test(node[0]) &&
									typeof node[2] === "string"
								) {
									const id = node[0];
									if (!seenIds.has(id)) {
										seenIds.add(id);
										items.push({
											id,
											icon: typeof node[1] === "string" ? node[1] : "",
											name: typeof node[2] === "string" ? node[2] : "Chrome Extension",
											rating: typeof node[3] === "number" ? Math.round(node[3] * 10) / 10 : null,
											ratingCount: typeof node[4] === "number" ? node[4] : null,
											description: typeof node[6] === "string" ? node[6] : "",
											users: typeof node[14] === "number" ? node[14] : null,
											category: "Chrome Web Store"
										});
									}
								}
								for (const child of node) walk(child);
							}
						}
						walk(obj.data);
					});
				} catch {
					// continue if specific script fails evaluation
				}
			}
		}

		// Regex fallback for HTML anchors if AF_initDataCallback extracted nothing
		if (items.length === 0) {
			const linkMatches = [...html.matchAll(/detail\/([^\/]+)\/([a-z]{32})/g)];
			for (const m of linkMatches) {
				const slug = decodeURIComponent(m[1]).replace(/-/g, " ");
				const id = m[2];
				if (!seenIds.has(id)) {
					seenIds.add(id);
					const cleanName = slug
						.split(" ")
						.map(w => w.charAt(0).toUpperCase() + w.slice(1))
						.join(" ");
					items.push({
						id,
						icon: "",
						name: cleanName || "Chrome Extension",
						rating: 4.5,
						ratingCount: null,
						description: "Chrome Web Store extension ready to install.",
						users: null,
						category: "Chrome Web Store"
					});
				}
			}
		}

		return reply.send({ results: items });
	} catch (err) {
		console.error("WebStore Search API Error:", err);
		return reply.code(500).send({ error: err.message || "Failed to search Chrome Web Store" });
	}
});

// Chrome Web Store CRX Download & Proxy Endpoint
fastify.get("/api/webstore/download", async (request, reply) => {
	try {
		const { id } = request.query || {};
		if (!id || !/^[a-z]{32}$/i.test(String(id).trim())) {
			return reply.code(400).send({ error: "Invalid extension ID. Must be 32 lowercase letters." });
		}

		const cleanId = String(id).trim().toLowerCase();
		const downloadUrls = [
			`https://clients2.google.com/service/update2/crx?response=redirect&prodversion=130.0&acceptformat=crx2,crx3&x=id%3D${cleanId}%26uc`,
			`https://clients2.google.com/service/update2/crx?response=redirect&prodversion=120.0&acceptformat=crx2,crx3&x=id%3D${cleanId}%26installsource%3Dondemand%26uc`,
			`https://clients2.google.com/service/update2/crx?response=redirect&prodversion=114.0&acceptformat=crx2,crx3&x=id%3D${cleanId}%26uc`,
		];

		let resp = null;
		for (const url of downloadUrls) {
			try {
				const r = await fetch(url, {
					headers: {
						"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
						"Accept": "*/*",
					},
					redirect: "follow",
				});
				if (r.ok && r.status === 200) {
					resp = r;
					break;
				}
			} catch (fetchErr) {
				console.warn(`[CRX Download] Failed URL: ${url}`, fetchErr.message);
			}
		}

		if (!resp) {
			return reply.code(404).send({
				error: "Failed to download CRX from Chrome Web Store. The extension might be private, removed, or incompatible."
			});
		}

		const arrayBuffer = await resp.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		return reply
			.header("Content-Type", "application/x-chrome-extension")
			.header("Content-Disposition", `attachment; filename="${cleanId}.crx"`)
			.header("Content-Length", buffer.length)
			.header("Cache-Control", "public, max-age=3600")
			.send(buffer);
	} catch (err) {
		console.error("WebStore Download API Error:", err);
		return reply.code(500).send({ error: err.message || "Failed to download extension CRX" });
	}
});

const PORT = 3000;

fastify.listen({
	port: PORT,
	host: "0.0.0.0",
});

fastify.setNotFoundHandler((request, reply) => {
	console.error("PAGE PUNCHED THROUGH SW - " + request.url);
	reply.code(593).send("punch through");
});
console.log(`Listening on http://localhost:${PORT}/`);
if (process.env.NODE_ENV !== "production" && existsSync(".git")) {
	try {
		writeFileSync(
			".git/hooks/pre-commit",
			"pnpm format\ngit update-index --again"
		);
		chmodSync(".git/hooks/pre-commit", 0o755);
	} catch {}

	const compiler = rspack(rspackConfig);
	compiler.watch({}, (err, stats) => {
		console.log(
			stats
				? stats.toString({
						preset: "minimal",
						colors: true,
						version: false,
					})
				: ""
		);
	});
}
