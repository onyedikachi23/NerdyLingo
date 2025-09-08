/** @format */

import { DrizzleQueryError } from "drizzle-orm";
import { DatabaseError } from "pg";

export const isPostgresError = (
	error: unknown,
): error is DrizzleQueryError & { cause: DatabaseError } => {
	if (error instanceof DrizzleQueryError) {
		return error.cause instanceof DatabaseError;
	}
	return false;
};
