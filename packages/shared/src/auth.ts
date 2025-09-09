/** @format */

import { z } from "zod";

const StrongPasswordSchema = z
	.string()
	.min(8, "At least 8 characters long")
	.regex(/[a-z]/, "At least one lowercase letter")
	.regex(/[A-Z]/, "At least one uppercase letter")
	.regex(/\d/, "At least one number")
	.regex(/[^a-zA-Z0-9\s]/, "At least one special character");

/**
 * @note You have to add confirm password validation yourself.
 */
export const EmailSignupFieldsSchema = {
	name: z.string().min(1, {
		error: "Name is required",
	}),
	email: z.email(),
	password: StrongPasswordSchema,
	confirmPassword: z.string(),
} satisfies z.ZodRawShape;

export const EmailLoginFieldsSchema = {
	email: z.email(),
	password: z.string().min(1, {
		error: "Password is required",
	}), // no need for strong password schema. Api will validate the authenticity.
} satisfies z.ZodRawShape;
