/** @format */

// @ts-check
import expoConfig from "eslint-config-expo/flat.js";
import { defineConfig } from "eslint/config";

import baseConfig from "@repo/eslint-config/react";

export default defineConfig({
	extends: [...baseConfig, expoConfig],
});
