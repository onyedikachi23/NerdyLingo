/** @format */

import type { z } from "zod";
import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN_KEY } from "./constants";

export const isFieldRequired = (fieldSchema: z.ZodType) =>
	!fieldSchema.safeParse(undefined).success;

export const saveAccessToken = (token: string) =>
	SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
