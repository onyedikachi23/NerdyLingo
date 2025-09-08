/** @format */

import { toast } from "@/components/ui/toast";
import { apiAxiosInstance } from "@/lib/axios-instance";
import { getErrorMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import type { EmailSignupForm } from "./types";

export const useSignup = () => {
	return useMutation({
		mutationFn: async (body: EmailSignupForm) => {
			const response = await apiAxiosInstance.post<object>(
				"/auth/signup",
				body,
			);
			return response.data;
		},
		onSuccess: (data) => {
			toast.success("Signup successful", {
				description: JSON.stringify(data, null, 2),
			});
		},
		onError: (e) => {
			toast.error("Signup failed", {
				description: getErrorMessage(e),
			});
		},
	});
};
