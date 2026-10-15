import { defineConfig, devices } from "@playwright/test";
import type { GitHubActionOptions } from "@estruyf/github-actions-reporter";

export default defineConfig({
	testDir: "./tests/integration/site",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: 2,
	reporter: process.env.CI
		? [
				[
					"@estruyf/github-actions-reporter",
					{
						title: "Test summary",
						useDetails: true,
						showError: true,
					} as GitHubActionOptions,
				],
				["github"],
			]
		: "html",
	timeout: 20000,
	use: {
		trace: "on-first-retry",
		actionTimeout: 10000,
		baseURL: "http://localhost:1337",
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],

	webServer: {
		command: "pnpm run dev",
		url: "http://127.0.0.1:1337",
		reuseExistingServer: false,
	},
});
