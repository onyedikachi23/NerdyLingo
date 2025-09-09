/** @format */

import { toast } from "@/components/ui/toast";
import { apiAxiosInstance } from "@/lib/axios-instance";
import { getErrorMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { useAuth } from "../context";
import type { EmailLoginForm, User } from "../types";

interface AuthLoginResponse {
	accessToken: string;
	user: SafeOmit<User, "password">;
}

export const useLogin = () => {
	const router = useRouter();

	React.useEffect(() => {
		router.prefetch("/(tabs)");
	}, [router]);

	const { login } = useAuth();

	return useMutation({
		mutationFn: async (body: EmailLoginForm) => {
			const response = await apiAxiosInstance.post<AuthLoginResponse>(
				"/auth/login",
				body,
			);
			return response.data;
		},
		onSuccess: async ({ accessToken }) => {
			try {
				await login({ accessToken });

				// TODO: Save data.user directly to query cache for profile

				toast.success("Login successful");

				router.replace("/(tabs)");
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
