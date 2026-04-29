import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"vectorize-pixelart": resolve(__dirname, "../src/index.ts"),
		},
		tsconfigPaths: true,
	},
	test: {
		environment: "jsdom",
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
		},
	},
});
