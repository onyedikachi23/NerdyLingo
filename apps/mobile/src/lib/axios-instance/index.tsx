/** @format */

import axios, { AxiosError, isAxiosError } from "axios";
import z from "zod";

const baseApiURL = z
	.url({ error: "EXPO_PUBLIC_API_URL env is invalid" })
	.parse(process.env.EXPO_PUBLIC_API_URL);

const apiAxiosInstance = axios.create({
	baseURL: baseApiURL,
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
