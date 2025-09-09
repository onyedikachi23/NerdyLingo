/** @format */

import type { z } from "zod";

export const isFieldRequired = (fieldSchema: z.ZodType) =>
	!fieldSchema.safeParse(undefined).success;
