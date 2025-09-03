/** @format */

// @ts-check

import { defineConfig } from "eslint/config";
import baseConfig from "./base.js";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";
import eslintReact from "@eslint-react/eslint-plugin";

export default defineConfig({
	extends: [
		...baseConfig,
		eslintReact.configs["recommended-typescript"],
		reactYouMightNotNeedAnEffect.configs.recommended,
	],
	settings: {
		react: {
			version: "detect",
		},
	},
});
