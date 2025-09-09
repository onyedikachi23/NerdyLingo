/** @format */

import type { EmailLoginFieldsSchema } from "@repo/shared/auth";
import type z from "zod";
import { EmailSignupFieldsSchema } from "@repo/shared/auth";

export type EmailSignupForm = z.infer<
	z.ZodObject<typeof EmailSignupFieldsSchema>
>;

export type EmailLoginForm = z.infer<
	z.ZodObject<typeof EmailLoginFieldsSchema>
>;

export interface User {
	id: number;
	name: string;
	email: string;
	password: string;
}
