/** @format */

import { toast } from "@/components/ui/toast";
import { apiAxiosInstance } from "@/lib/axios-instance";
import { getErrorMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import type { EmailLoginForm, User } from "../types";
import { saveAccessToken } from "../utils";

interface AuthLoginResponse {
	accessToken: string;
	user: SafeOmit<User, "password">;
}

export const useLogin = () => {
	return useMutation({
		mutationFn: async (body: EmailLoginForm) => {
			const response = await apiAxiosInstance.post<AuthLoginResponse>(
				"/auth/login",
				body,
			);
			return response.data;
		},
		onSuccess: async (data) => {
			try {
				await saveAccessToken(data.accessToken);

				// TODO: Save data.user directly to query cache for profile
				toast.success("Login successful");
			} catch (e) {
				toast.error("Failed to save login information.", {
					description: getErrorMessage(e),
				});
			}
		},
		onError: (e) => {
			toast.error("Login failed", {
				description: getErrorMessage(e),
			});
		},
	});
};
