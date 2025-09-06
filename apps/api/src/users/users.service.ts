/** @format */

import { Injectable } from "@nestjs/common";

// This should be a real class/interface representing a user entity
export interface User {
	userId: number;
	email: string;
	password: string;
}

@Injectable()
export class UsersService {
	private readonly users: User[] = [
		{
			userId: 1,
			email: "john@gmail.com",
			password: "changeme",
		},
		{
			userId: 2,
			email: "maria@gmail.com",
			password: "guess",
		},
	];

	async findOne(email: string): Promise<User | undefined> {
		return this.users.find((user) => user.email === email);
	}
}
