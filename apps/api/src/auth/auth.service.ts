/** @format */

import { User } from "@/users/users.schema";
import { UsersService } from "@/users/users.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthJwtPayload, AuthSignupResponse } from "./types";
import { SignupDto } from "./dto/signup.dto";

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUser({ email, password }: Pick<User, "email" | "password">) {
		const user = await this.usersService.findOne(email);
		if (user && user.password === password) {
			const { password: _, ...result } = user;
			return result;
		}
		return null;
	}

	async signup(signupDto: SignupDto) {
		const { password: _, ...user } =
			await this.usersService.createUser(signupDto);
		const payload = {
			sub: user.id,
			email: user.email,
		} satisfies AuthJwtPayload;

		const accessToken = this.jwtService.sign(payload);

		return { accessToken, user } satisfies AuthSignupResponse;
	}

	login(user: Pick<User, "id" | "email">) {
		const payload = {
			email: user.email,
			sub: user.id,
		} satisfies AuthJwtPayload;
		return this.jwtService.sign(payload);
	}
}
