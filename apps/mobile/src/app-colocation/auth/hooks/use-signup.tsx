/** @format */

import { apiAxiosInstance } from "@/lib/axios-instance";
import { useMutation } from "@tanstack/react-query";
import type { EmailSignupForm } from "../signup/form-schema";

export const useSignup = () => {
	return useMutation({
		mutationFn: async (body: EmailSignupForm) => {
			await apiAxiosInstance.post("/auth/signup", body);
		},
		onSuccess: () => {
			alert("Signup success");
		},
		onError: (e) => {
			console.error("sign up failed", e);

			alert("Signup failed");
		},
	});
};
