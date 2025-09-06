/** @format */

import axios from "axios";
import z from "zod";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const baseURLValidation = z.url().safeParse(process.env.EXPO_PUBLIC_API_URL);
if (!baseURLValidation.success) {
	console.error(
		"[axios instance]: EXPO_PUBLIC_API_URL env is invalid",
		baseURLValidation.error,
	);
	throw new Error("[axios instance]: EXPO_PUBLIC_API_URL env is invalid");
}

const apiAxiosInstance = axios.create({
	baseURL: baseURLValidation.data,
});

// TODO: Add interceptors

export { apiAxiosInstance };
