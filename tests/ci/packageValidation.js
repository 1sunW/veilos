
import test from "ava";
import { glob } from "glob";
import { existsSync } from "node:fs";

const EXPECTED_DIST_FILES = [
	"dist/scramjet.all.js",
	"dist/scramjet.bundle.js",
	"dist/scramjet.sync.js",
	"dist/scramjet.wasm.wasm",
];

const EXPECTED_TYPE_FILES = [
	"dist/types/**/*.d.ts",
	"dist/types/index.d.ts",
	"lib/index.d.ts",
];

test("Package contains all required distribution files", async (t) => {
	const missingFiles = [];

	for (const filePath of EXPECTED_DIST_FILES) {
		if (!existsSync(filePath)) {
			missingFiles.push(filePath);
		}
	}

	t.deepEqual(
		missingFiles,
		[],
		`Missing required distribution files: ${missingFiles.join(", ")}`
	);
});

test("All required JS bundles have corresponding source maps", async (t) => {
	const jsFiles = EXPECTED_DIST_FILES.filter((file) => file.endsWith(".js"));
	const missingMaps = [];

	for (const jsFile of jsFiles) {
		const mapFile = `${jsFile}.map`;
		if (!existsSync(mapFile)) {
			missingMaps.push(mapFile);
		}
	}

	t.deepEqual(
		missingMaps,
		[],
		`Missing source map files: ${missingMaps.join(", ")}`
	);
});

test("Package contains required type definitions", async (t) => {
	const missingTypeGlobs = [];

	for (const glob_ of EXPECTED_TYPE_FILES) {
		const matches = await glob(glob_);
		if (matches.length === 0) {
			missingTypeGlobs.push(glob_);
		}
	}

	t.deepEqual(
		missingTypeGlobs,
		[],
		`No type definition files found for globs: ${missingTypeGlobs.join(", ")}`
	);
});

test("Package structure is valid for distribution", async (t) => {
	const distFiles = await glob("dist/**/*");
	const libFiles = await glob("lib/**/*");

	t.true(distFiles.length > 0, "Distribution directory should contain files");
	t.true(libFiles.length > 0, "Library directory should contain files");

	const hasJsFiles = distFiles.some((file) => file.endsWith(".js"));
	const hasWasmFile = distFiles.some((file) => file.endsWith(".wasm"));
	const hasTypeFiles = libFiles.some((file) => file.endsWith(".d.ts"));

	t.true(hasJsFiles, "Distribution should contain JS files");
	t.true(hasWasmFile, "Distribution should contain WASM file");
	t.true(hasTypeFiles, "Library should contain core type definition files");
});
