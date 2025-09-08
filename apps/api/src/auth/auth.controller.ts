/** @format */

import { ZodValidationPipe } from "@/common/zod-validation.pipe";
import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { type SignupDto, signupSchema } from "./dto/signup.dto";
import { SkipAuth } from "./skip-auth.decorator";
import { AuthSignupResponse } from "./types";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}
	@Post("signup")
	@UsePipes(new ZodValidationPipe(signupSchema))
	@SkipAuth()
	async signup(@Body() signupDto: SignupDto): Promise<AuthSignupResponse> {
		const response = await this.authService.signup(signupDto);
		return response;
	}
}
