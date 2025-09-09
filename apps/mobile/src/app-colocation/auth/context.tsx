/** @format */

import { toast } from "@/components/ui/toast";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { useMMKVBoolean } from "react-native-mmkv";
import z from "zod";

interface AuthContextType {
	isAuthenticated: boolean;
	logout: () => Promise<void>;
	login: (params: { accessToken: string }) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

const useAuth = () => {
	const context = React.use(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider.");
	}
	return context;
};

const AUTH_KEY_PREFIX = "auth.";
const IS_AUTHENTICATED_KEY = `${AUTH_KEY_PREFIX}isAuthenticated`;
const ACCESS_TOKEN_KEY = `${AUTH_KEY_PREFIX}accessToken`;

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] =
		useMMKVBoolean(IS_AUTHENTICATED_KEY);

	const router = useRouter();
	const logout = React.useCallback(async () => {
		await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);

		// Add api based logout

		setIsAuthenticated(false);
		router.replace("/(auth)/login");
	}, [router, setIsAuthenticated]);

	React.useEffect(() => {
		// confirm accessToken is valid
		if (isAuthenticated) {
			const confirmIsValidAuth = async () => {
				try {
					const accessToken =
						await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

					// Change this to api based validation
					const validation = z.string().safeParse(accessToken);

					if (!validation.success) {
						toast.error("Logging you out for security.", {
							description:
								"There was an issue with your account's authentication status. Please log in again to continue.",
						});
						await logout();
					}
				} catch (error) {
					toast.error("An error occurred", {
						description:
							"We encountered an issue while checking your account's status. Please log in again to continue.",
					});
					console.error(error);

					await logout();
				}
			};

			void confirmIsValidAuth();
			// TODO: Add fallback to using refresh token to see if we can log the user back in
		}
	}, [isAuthenticated, logout, setIsAuthenticated]);

	const login = React.useCallback(
		async ({ accessToken }: { accessToken: string }) => {
			await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
			setIsAuthenticated(true);
		},
		[setIsAuthenticated],
	);

	const value = React.useMemo(
		() =>
			({
				isAuthenticated: !!isAuthenticated,
				login,
				logout,
			}) satisfies AuthContextType,
		[isAuthenticated, login, logout],
	);

	return <AuthContext value={value}>{children}</AuthContext>;
};

export { AuthProvider, useAuth, type AuthContextType };
