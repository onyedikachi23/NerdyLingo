/** @format */

import { registerAs } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";
import z from "zod";

export default registerAs(
	"jwt",
	(): JwtModuleOptions => ({
		secret: z
			.string({ error: "Invalid JWT_SECRET env" })
			.parse(process.env.JWT_SECRET),
		signOptions: {
			expiresIn: z
				.string({ error: "Invalid JWT_EXPIRE_IN env" })
				.parse(process.env.JWT_EXPIRE_IN),
		},
	}),
);
