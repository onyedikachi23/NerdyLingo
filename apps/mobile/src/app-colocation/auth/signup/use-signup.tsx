/** @format */

import { apiAxiosInstance } from "@/lib/axios-instance";
import { useMutation } from "@tanstack/react-query";
import type { EmailSignupForm } from "./form-schema";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/utils";

export const useSignup = () => {
	return useMutation({
		mutationFn: async (body: EmailSignupForm) => {
			await apiAxiosInstance.post("/auth/signup", body);
		},
		onSuccess: () => {
			toast.success("Signup successful");
		},
		onError: (e) => {
			toast.error("Signup failed", {
				description: getErrorMessage(e),
			});
		},
	});
};
