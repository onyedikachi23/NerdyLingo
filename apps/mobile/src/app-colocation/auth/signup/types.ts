/** @format */

import { z } from "zod";
import { EmailSignupFieldsSchema } from "@repo/shared/auth";

export type EmailSignupForm = z.infer<
	z.ZodObject<typeof EmailSignupFieldsSchema>
>;
