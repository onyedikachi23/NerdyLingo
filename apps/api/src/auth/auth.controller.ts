/** @format */

import { ZodValidationPipe } from "@/common/zod-validation.pipe";
import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { type SignupDto, signupSchema } from "./dto/signup.dto";
import { SkipAuth } from "./skip-auth.decorator";
import { UsersService } from "@/users/users.service";

@Controller("auth")
export class AuthController {
	constructor(private usersService: UsersService) {}
	@Post("signup")
	@UsePipes(new ZodValidationPipe(signupSchema))
	@SkipAuth()
	async signup(@Body() signupDto: SignupDto) {
		const user = await this.usersService.createUser(signupDto);
		const { password: _, ...result } = user;
		return result;
	}
}
