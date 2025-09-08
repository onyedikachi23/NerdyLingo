/** @format */

import { DRIZZLE_KEY, PG_ERROR_CODES } from "@/drizzle/constants";
import type { DrizzleDB } from "@/drizzle/types";
import {
	ConflictException,
	Inject,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { User, users } from "./users.schema";
import { eq } from "drizzle-orm";
import { isPostgresError } from "@/drizzle/utils";

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
	constructor(@Inject(DRIZZLE_KEY) private db: DrizzleDB) {}

	async createUser(user: Pick<User, "name" | "email" | "password">) {
		try {
			const [newUser] = await this.db
				.insert(users)
				.values(user)
				.returning();

			if (!newUser) {
				throw new InternalServerErrorException(
					"Failed to create user: no user data returned.",
				);
			}

			// TODO encrypt password

			return newUser;
		} catch (error) {
			if (
				isPostgresError(error) &&
				error.cause.code === PG_ERROR_CODES.UNIQUE_VIOLATION
			) {
				throw new ConflictException("Email already exists");
			}
			throw error;
		}
	}

	async findOne(email: string) {
		const user = await this.db.query.users.findFirst({
			where: eq(users.email, email),
		});
		return user;
	}
}
