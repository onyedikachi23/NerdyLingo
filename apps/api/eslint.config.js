/** @format */

// @ts-check
import baseConfig from "@repo/eslint-config/base";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig({
	extends: [...baseConfig],
	languageOptions: {
		globals: {
			...globals.node,
		},
	},
});
