/** @format */

// @ts-check
import expoConfig from "eslint-config-expo/flat.js";
import { defineConfig } from "eslint/config";

import baseConfig from "@repo/eslint-config/react";
import pluginQuery from "@tanstack/eslint-plugin-query";
import reactQueryKeys from "eslint-plugin-react-query-keys";

export default defineConfig({
	ignores: [".expo/**"],
	extends: [
		...baseConfig,
		expoConfig,
		...pluginQuery.configs["flat/recommended"],
	],
	plugins: {
		// @ts-ignore setup correct according to docs
		"react-query-keys": reactQueryKeys,
	},
	rules: {
		"react-query-keys/no-plain-query-keys": "warn",
	},
});
