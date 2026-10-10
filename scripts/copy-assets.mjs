import { mkdirSync, cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import ts from "typescript";

import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";

import { patchAll } from "./patch-baremux.mjs";
import { patchSapphire } from "./patch-sapphire.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, process.env.OUTPUT_DIR || "public");

// Ensure any upstream quirks in dependencies are patched
patchSapphire();

// Ensure dist bundle exists before copying
const distBundle = join(root, "dist", "scramjet.all.js");
if (!existsSync(distBundle)) {
	console.log("Compiling Scramjet bundle via Rspack...");
	try {
		execSync("npx rspack build", { cwd: root, stdio: "inherit" });
	} catch (e) {
		console.error("Failed to compile Scramjet bundle:", e);
	}
}

console.log(`Copying static client runtime assets to ${outDir}...`);

// Ensure output directory exists
mkdirSync(outDir, { recursive: true });

// Helper to safely copy directories
const copyDir = (src, dest) => {
	if (src && existsSync(src)) {
		mkdirSync(dest, { recursive: true });
		cpSync(src, dest, { recursive: true });
		console.log(`  ✓ Copied ${src} -> ${dest}`);
	} else {
		console.warn(`  ! Warning: Source directory missing: ${src}`);
	}
};

// 1. Copy static UI source files (/static) to build output directory
copyDir(join(root, "static"), outDir);

// 1b. Build and deploy dedicated onyx-chat application if present
if (existsSync(join(root, "onyx-chat"))) {
	const onyxDistHtml = join(root, "onyx-chat", "dist", "index.html");
	if (!existsSync(onyxDistHtml)) {
		console.log("Compiling Onyx Chat single-file application bundle via Vite...");
		try {
			execSync("npx vite build onyx-chat", { cwd: root, stdio: "inherit" });
		} catch (e) {
			console.error("Failed to compile Onyx Chat:", e);
		}
	}
	// Copy full onyx-chat tree
	copyDir(join(root, "onyx-chat"), join(outDir, "onyx-chat"));
	// Ensure the root of onyx-chat in public and chat.html receive the compiled singlefile build
	if (existsSync(onyxDistHtml)) {
		mkdirSync(join(outDir, "onyx-chat"), { recursive: true });
		cpSync(onyxDistHtml, join(outDir, "onyx-chat", "index.html"));
		cpSync(onyxDistHtml, join(outDir, "chat.html"));
		mkdirSync(join(root, "static", "onyx-chat"), { recursive: true });
		cpSync(onyxDistHtml, join(root, "static", "onyx-chat", "index.html"));
		cpSync(onyxDistHtml, join(root, "static", "chat.html"));
		console.log("  ✓ Deployed compiled Onyx Chat to /onyx-chat/index.html and /chat.html");
	}
}

// 2. Copy Scramjet compiled client bundle (/scram/scramjet.all.js, scramjet.sync.js, etc.)
copyDir(join(root, "dist"), join(outDir, "scram"));

// Copy scramjet wasm assets
const scramjetWasmSrc = join(root, "node_modules", "@mercuryworkshop", "scramjet", "dist", "scramjet.wasm");
if (existsSync(scramjetWasmSrc)) {
	try {
		mkdirSync(join(root, "dist"), { recursive: true });
		mkdirSync(join(outDir, "scram"), { recursive: true });
		cpSync(scramjetWasmSrc, join(root, "dist", "scramjet.wasm.wasm"));
		cpSync(scramjetWasmSrc, join(root, "dist", "scramjet.wasm"));
		cpSync(scramjetWasmSrc, join(outDir, "scram", "scramjet.wasm.wasm"));
		cpSync(scramjetWasmSrc, join(outDir, "scram", "scramjet.wasm"));
		cpSync(scramjetWasmSrc, join(outDir, "scramjet.wasm.wasm"));
		cpSync(scramjetWasmSrc, join(outDir, "scramjet.wasm"));
		console.log("  ✓ Copied scramjet wasm assets");
	} catch (e) {
		console.warn("  ! Warning: Failed to copy scramjet wasm:", e);
	}
}

// 3. Copy static asset files (/assets/)
copyDir(join(root, "assets"), join(outDir, "assets"));

// 4. Copy node_modules client transport runtime libraries
copyDir(baremuxPath, join(outDir, "baremux"));
copyDir(epoxyPath, join(outDir, "epoxy"));
copyDir(libcurlPath, join(outDir, "libcurl"));
bareModulePath && copyDir(bareModulePath, join(outDir, "baremod"));

// 5. Transpile single data.tsx / data.ts into public/data.js, public/data.ts, and public/data.tsx
const dataTsPath = existsSync(join(root, "data.tsx"))
	? join(root, "data.tsx")
	: (existsSync(join(root, "src", "data.tsx"))
		? join(root, "src", "data.tsx")
		: (existsSync(join(root, "data.ts"))
			? join(root, "data.ts")
			: (existsSync(join(root, "src", "data.ts")) ? join(root, "src", "data.ts") : null)));

if (dataTsPath) {
	try {
		const source = readFileSync(dataTsPath, "utf8");
		const transpiled = ts.transpileModule(source, {
			compilerOptions: {
				target: ts.ScriptTarget.ES2022,
				module: ts.ModuleKind.ES2022,
				jsx: ts.JsxEmit.ReactJSX,
				removeComments: false,
			},
		});
		writeFileSync(join(outDir, "data.js"), transpiled.outputText, "utf8");
		console.log(`  ✓ Compiled ${dataTsPath} -> public/data.js, public/data.ts, and public/data.tsx`);
	} catch (err) {
		console.error("  ! Failed to transpile data source file:", err.message);
	}
}

// 6. Apply DataCloneError & Event serialization patches to client transport bundles
patchAll();

console.log("Static asset copying complete!");
