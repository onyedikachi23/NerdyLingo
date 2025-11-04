/** @format */

import { EmailLoginFieldsSchema } from "@repo/shared";
import z from "zod";

export const loginSchema = z.object(EmailLoginFieldsSchema);

export type LoginDto = z.infer<typeof loginSchema>;
