/** @format */

import React, { useEffect } from "react";
import { config } from "./config";
import { View, type ViewProps } from "react-native";
import { OverlayProvider } from "@gluestack-ui/overlay";

import { useColorScheme } from "nativewind";

export type ThemeMode = "light" | "dark" | "system";

export function GluestackUIProvider({
	mode = "light",
	...props
}: {
	mode?: ThemeMode;
	children?: React.ReactNode;
	style?: ViewProps["style"];
}) {
	const { colorScheme, setColorScheme } = useColorScheme();

	useEffect(() => {
		setColorScheme(mode);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mode]);

	// useMemo will avoid nativewind remounting the entire app whenever a new css variable is used.
	const themeStyle = React.useMemo(() => {
		return config[colorScheme!];
	}, [colorScheme]);

	return (
		<View
			style={[
				themeStyle,
				{ flex: 1, height: "100%", width: "100%" },
				props.style,
			]}>
			<OverlayProvider>{props.children}</OverlayProvider>
		</View>
	);
}
