/** @format */

import { toast } from "@/components/ui/toast";
import { apiAxiosInstance } from "@/lib/axios-instance";
import { getErrorMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import type { EmailSignupForm, User } from "../types";
import { saveAccessToken } from "../utils";

interface AuthSignupResponse {
	accessToken: string;
	user: SafeOmit<User, "password">;
}

export const useSignup = () => {
	return useMutation({
		mutationFn: async (body: EmailSignupForm) => {
			const response = await apiAxiosInstance.post<AuthSignupResponse>(
				"/auth/signup",
				body,
			);
			return response.data;
		},
		onSuccess: async (data) => {
			try {
				await saveAccessToken(data.accessToken);

				// TODO: Save data.user directly to query cache for profile
				toast.success("Signup successful");
			} catch (e) {
				toast.error("Failed to save login information.", {
					description: getErrorMessage(e),
				});
			}
		},
		onError: (e) => {
			toast.error("Signup failed", {
				description: getErrorMessage(e),
			});
		},
	});
};
