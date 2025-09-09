/** @format */

import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { SkipAuth } from "./auth/skip-auth.decorator";
import { User } from "./users/users.schema";

@Controller()
export class AppController {
	constructor() {}

	@UseGuards(JwtAuthGuard)
	@Get("profile")
	getProfile(@Request() req: Record<"user", User>) {
		return req.user;
	}

	@SkipAuth()
	@Get()
	findAll() {
		return [];
	}
}
