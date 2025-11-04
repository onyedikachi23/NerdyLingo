/** @format */

import type { EmailLoginFieldsSchema } from "@repo/shared";
import { EmailSignupFieldsSchema } from "@repo/shared";
import type z from "zod";

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
