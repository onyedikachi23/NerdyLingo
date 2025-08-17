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

	return (
		<View
			style={[
				config[colorScheme!],
				{ flex: 1, height: "100%", width: "100%" },
				props.style,
			]}>
			<OverlayProvider>{props.children}</OverlayProvider>
		</View>
	);
}
