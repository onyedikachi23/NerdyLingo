/** @format */

import { User } from "@/users/users.schema";
import { UsersService } from "@/users/users.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { AuthJwtPayload, AuthLoginResponse, AuthSignupResponse } from "./types";
import bcrypt from "bcrypt";

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

		const accessToken = this.jwtService.sign(payload, {
			expiresIn: "30d",
		});

		return { accessToken, user } satisfies AuthSignupResponse;
	}

	async login(loginDto: LoginDto) {
		const user = await this.usersService.findOne(loginDto.email);

		if (!user) {
			throw new UnauthorizedException("User not found.");
		}

		const isPasswordMatching = await bcrypt.compare(
			loginDto.password,
			user.password,
		);

		if (!isPasswordMatching) {
			throw new UnauthorizedException("Invalid password");
		}

		const payload = {
			email: user.email,
			sub: user.id,
		} satisfies AuthJwtPayload;

		const { password: _, ...userWithoutPassword } = user;
		const accessToken = this.jwtService.sign(payload, {
			expiresIn: "30d",
		});
		return {
			accessToken,
			user: userWithoutPassword,
		} satisfies AuthLoginResponse;
	}
}
