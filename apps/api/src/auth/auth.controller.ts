/** @format */

import { ZodValidationPipe } from "@/common/zod-validation.pipe";
import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { type SignupDto, signupSchema } from "./dto/signup.dto";
import { SkipAuth } from "./skip-auth.decorator";
import { AuthSignupResponse } from "./types";
import { type LoginDto, loginSchema } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("signup")
	@SkipAuth()
	@UsePipes(new ZodValidationPipe(signupSchema))
	async signup(@Body() signupDto: SignupDto): Promise<AuthSignupResponse> {
		const response = await this.authService.signup(signupDto);
		return response;
	}

	@Post("login")
	@SkipAuth()
	@UsePipes(new ZodValidationPipe(loginSchema))
	async login(@Body() loginDto: LoginDto) {
		const response = await this.authService.login(loginDto);
		return response;
	}
}
