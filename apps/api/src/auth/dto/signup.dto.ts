/** @format */

import { EmailSignupFieldsSchema } from "@repo/shared";
import z from "zod";

export const signupSchema = z
	.object(EmailSignupFieldsSchema)
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type SignupDto = z.infer<typeof signupSchema>;
