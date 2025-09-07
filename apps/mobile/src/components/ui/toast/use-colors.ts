/** @format */

import { useColorScheme } from "react-native";
import { useToastContext } from "./context";

export const useColors = (invertProps?: boolean) => {
	const { invert: invertCtx, theme, colors } = useToastContext();
	const { light, dark } = colors;
	const systemScheme = useColorScheme();
	const scheme = theme === "system" ? systemScheme : theme;
	const invert = invertProps ?? invertCtx;

	if (scheme === "dark") {
		if (invert) return light;
		return dark;
	}

	if (invert) return dark;
	return light;
};
