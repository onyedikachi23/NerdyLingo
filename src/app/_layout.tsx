/** @format */

import { Stack } from "expo-router";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";

import "../../global.css";

import {
	configureReanimatedLogger,
	ReanimatedLogLevel,
} from "react-native-reanimated";
import { useColorScheme } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

configureReanimatedLogger({
	level: ReanimatedLogLevel.warn,
	strict: false,
});

export default function RootLayout() {
	const colorScheme = useColorScheme();
	return (
		<ThemeProvider
			value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<GluestackUIProvider mode={colorScheme ?? "system"}>
				<Stack />
			</GluestackUIProvider>
		</ThemeProvider>
	);
}
