/** @format */

import { User } from "@/users/users.schema";

export interface AuthJwtPayload {
	sub: number;
	email: string;
}

export interface AuthSignupResponse {
	accessToken: string;
	user: SafeOmit<User, "password">;
}

// TODO: Add other differentiating properties
export type AuthLoginResponse = AuthSignupResponse;
