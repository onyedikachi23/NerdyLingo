/** @format */

import { toast } from "@/components/ui/toast";
import { apiAxiosInstance } from "@/lib/axios-instance";
import { getErrorMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import type { EmailSignupForm } from "./types";
import * as SecureStore from "expo-secure-store";

interface User {
	id: number;
	name: string;
	email: string;
	password: string;
}

interface AuthSignupResponse {
	accessToken: string;
	user: SafeOmit<User, "password">;
}

const ACCESS_TOKEN_KEY = "auth-access-token";

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
				await SecureStore.setItemAsync(
					ACCESS_TOKEN_KEY,
					data.accessToken,
				);

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
