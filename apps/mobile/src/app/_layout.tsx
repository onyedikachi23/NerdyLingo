/** @format */

import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";

import "../../global.css";

import { Box } from "@/components/ui/box";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { toast, Toaster } from "@/components/ui/toast";
import { useAppColorScheme } from "@/hooks/use-color-scheme";
import { useToastThemedColors } from "@/hooks/use-toast-themed-colors";
import {
	focusManager,
	matchQuery,
	MutationCache,
	onlineManager,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import * as Network from "expo-network";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { AppState, Platform, type AppStateStatus } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
	configureReanimatedLogger,
	ReanimatedLogLevel,
} from "react-native-reanimated";
import { getErrorMessage } from "@/lib/utils";

configureReanimatedLogger({
	level: ReanimatedLogLevel.warn,
	strict: false,
});

// To sync app Online status React Query
onlineManager.setEventListener((setOnline) => {
	const eventSubscription = Network.addNetworkStateListener((state) => {
		setOnline(!!state.isConnected);
	});
	return () => eventSubscription.remove();
});

/** Analogous to refetchOnWindowFocus on web */
const useRefetchOnAppFocus = () => {
	const onAppStateChange = React.useCallback((status: AppStateStatus) => {
		if (Platform.OS !== "web") {
			focusManager.setFocused(status === "active");
		}
	}, []);

	React.useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			onAppStateChange,
		);

		return () => subscription.remove();
	}, [onAppStateChange]);
};

const queryClient = new QueryClient({
	mutationCache: new MutationCache({
		onSuccess: (_data, _variables, _context, mutation) => {
			void queryClient.invalidateQueries({
				predicate: (query) =>
					// invalidate all matching tags at once
					// or everything if no meta is provided
					mutation.meta?.invalidates?.some((queryKey) =>
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						matchQuery({ queryKey }, query),
					) ?? true,
			});
		},
	}),
	queryCache: new QueryCache({
		onError(error, query) {
			const customOnError = query.meta?.onError;

			const toastControlValue =
				typeof customOnError === "function"
					? customOnError(error, query)
					: customOnError;

			if (toastControlValue === "no-toast") return;

			const toastTitle =
				typeof toastControlValue === "string"
					? toastControlValue
					: "Something went wrong";

			toast.error(toastTitle, {
				description: getErrorMessage(error),
				position: "top-center",
			});
		},
	}),
});

export default function RootLayout() {
	const { colorScheme } = useAppColorScheme();
	useRefetchOnAppFocus();

	const toastColors = useToastThemedColors();

	return (
		<KeyboardProvider>
			<ThemeProvider
				value={
					colorScheme === "dark"
						? DarkTheme
						: {
								...DefaultTheme,
								colors: {
									...DefaultTheme.colors,
									background: "transparent",
								},
							}
				}>
				<QueryClientProvider client={queryClient}>
					<GestureHandlerRootView>
						<GluestackUIProvider mode={colorScheme ?? "system"}>
							<Box className="flex-1 bg-background-0">
								<StatusBar style="dark" />
								<Stack screenOptions={{ headerShown: false }} />
							</Box>

							<Toaster
								colors={toastColors}
								theme={colorScheme}
								richColors
							/>
						</GluestackUIProvider>
					</GestureHandlerRootView>
				</QueryClientProvider>
			</ThemeProvider>
		</KeyboardProvider>
	);
}
