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
import { useColorScheme } from "react-native";
import {
	configureReanimatedLogger,
	ReanimatedLogLevel,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";

configureReanimatedLogger({
	level: ReanimatedLogLevel.warn,
	strict: false,
});

export default function RootLayout() {
	const colorScheme = useColorScheme();

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
				<GluestackUIProvider mode={colorScheme ?? "system"}>
					<Box className="flex-1 bg-background-0">
						<StatusBar style="dark" />
						<Stack screenOptions={{ headerShown: false }} />
					</Box>
				</GluestackUIProvider>
			</ThemeProvider>
		</KeyboardProvider>
	);
}
