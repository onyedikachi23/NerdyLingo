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
import {
	focusManager,
	onlineManager,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import {
	AppState,
	Platform,
	useColorScheme,
	type AppStateStatus,
} from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
	configureReanimatedLogger,
	ReanimatedLogLevel,
} from "react-native-reanimated";
import * as Network from "expo-network";
import React from "react";

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

const queryClient = new QueryClient();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	useRefetchOnAppFocus();

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
					<GluestackUIProvider mode={colorScheme ?? "system"}>
						<Box className="flex-1 bg-background-0">
							<StatusBar style="dark" />
							<Stack screenOptions={{ headerShown: false }} />
						</Box>
					</GluestackUIProvider>
				</QueryClientProvider>
			</ThemeProvider>
		</KeyboardProvider>
	);
}
