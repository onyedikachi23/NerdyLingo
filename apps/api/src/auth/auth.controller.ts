/** @format */

import { ZodValidationPipe } from "@/common/zod-validation.pipe";
import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { type SignupDto, signupSchema } from "./dto/signup.dto";
import { SkipAuth } from "./skip-auth.decorator";

@Controller("auth")
export class AuthController {
	@Post("signup")
	@UsePipes(new ZodValidationPipe(signupSchema))
	@SkipAuth()
	signup(@Body() signupDto: SignupDto) {
		const { email, name } = signupDto;
		return { email, name };
	}
}
