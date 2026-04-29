/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(webRoot, "..");

/** @type {import("next").NextConfig} */
const config = {
	turbopack: {
		root: workspaceRoot,
		resolveAlias: {
			"vectorize-pixelart": "../src/index.ts",
		},
	},
};

export default config;
