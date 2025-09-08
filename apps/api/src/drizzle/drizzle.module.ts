/** @format */

import { Module } from "@nestjs/common";
import { DRIZZLE_KEY } from "./constants";
import { ConfigModule, ConfigService } from "@nestjs/config";
import z from "zod";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import schema from "./schema";

@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: DRIZZLE_KEY,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const databaseURL = z
					.url({ error: "DATABASE_URL env is invalid" })
					.parse(configService.get("DATABASE_URL"));
				const pool = new Pool({
					connectionString: databaseURL,
					ssl: false, // TODO: update to true for deployment
				});
				return drizzle(pool, { schema });
			},
		},
	],
	exports: [DRIZZLE_KEY],
})
export class DrizzleModule {}
