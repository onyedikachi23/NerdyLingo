/** @format */
import "dotenv/config";

import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
import z from "zod";

dotenv.config({ path: [".env", ".env.local"] });

const DATABASE_URL = z
	.url({ error: "Invalid DATABASE_URL env" })
	.parse(process.env.DATABASE_URL);

export default defineConfig({
	schema: "./src/**/*.schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: DATABASE_URL,
	},
	out: "./drizzle",
});
