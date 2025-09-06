/** @format */

import { User, UsersService } from "@/users/users.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

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

	async login(user: Pick<User, "userId" | "email">) {
		const payload = { email: user.email, sub: user.userId };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
