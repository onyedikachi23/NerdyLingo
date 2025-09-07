/** @format */

import axios, { AxiosError, isAxiosError } from "axios";
import z from "zod";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const baseURLValidation = z.url().safeParse(process.env.EXPO_PUBLIC_API_URL);
if (!baseURLValidation.success) {
	console.error(
		"[axios instance]: EXPO_PUBLIC_API_URL env is invalid",
		baseURLValidation.error.issues,
	);
	throw new Error("[axios instance]: EXPO_PUBLIC_API_URL env is invalid");
}

const apiAxiosInstance = axios.create({
	baseURL: baseURLValidation.data,
});

interface ApiErrorResponse {
	statusCode: number;
	/**Human readable description of the error cause. */
	message: string;
	/**Short name of the error based on status code. */
	error: string;
}

type AxiosApiError<T extends ApiErrorResponse = ApiErrorResponse> = RequireKeys<
	AxiosError<T>,
	"response"
>;

const isAxiosApiError = (error: unknown): error is AxiosApiError => {
	if (!isAxiosError(error) || !error.response) {
		return false;
	}
	const data: unknown = error.response.data;
	return (
		!!data &&
		typeof data === "object" &&
		"message" in data &&
		typeof data.message === "string"
	);
};

// TODO: Add interceptors

export { apiAxiosInstance, isAxiosApiError };
export type { ApiErrorResponse, AxiosApiError };
