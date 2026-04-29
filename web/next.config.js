/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = join(webRoot, "..");

/** @type {import("next").NextConfig} */
const config = {
	transpilePackages: ["vectorize-pixelart"],
	turbopack: {
		root: workspaceRoot,
	},
};

export default config;
