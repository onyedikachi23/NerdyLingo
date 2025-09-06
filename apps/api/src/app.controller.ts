/** @format */

import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { SkipAuth } from "./auth/skip-auth.decorator";
import { User } from "./users/users.service";

@Controller()
export class AppController {
	constructor(private authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post("auth/login")
	async login(@Request() req: Record<"user", User>) {
		return this.authService.login(req.user);
	}

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
