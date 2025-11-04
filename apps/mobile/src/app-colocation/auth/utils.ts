/** @format */

import * as SecureStore from "expo-secure-store";
import type { z } from "zod";

const ACCESS_TOKEN_KEY = `auth.accessToken`;

const isFieldRequired = (fieldSchema: z.ZodType) =>
	!fieldSchema.safeParse(undefined).success;

const getAuthToken = () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
const deleteAuthToken = () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
const setAuthToken = (accessToken: string) =>
	SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);

export { deleteAuthToken, getAuthToken, isFieldRequired, setAuthToken };
