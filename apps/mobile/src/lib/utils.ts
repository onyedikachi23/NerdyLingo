/** @format */

import type { PlainObject } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAxiosApiError } from "./axios-instance";

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const isObject = (object: unknown): object is PlainObject =>
	!!object && typeof object === "object" && !Array.isArray(object);

export const getErrorMessage = (error: unknown): string => {
	if (typeof error === "string") {
		return error;
	}
	if (isAxiosApiError(error)) {
		return error.response.data.message;
	}
	if (error instanceof Error) {
		return error.message;
	}
	return "Unknown error";
};

export const ensureError = (error: unknown): Error => {
	if (error instanceof Error) {
		return error;
	}
	if (typeof error === "string") {
		return new Error(error);
	}

	const stringified = JSON.stringify(error);
	return new Error(`An unknown error occurred: ${stringified}`);
};
