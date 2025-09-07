/** @format */

import type {
	ToastColors,
	ToastColorsConfig,
} from "@/components/ui/toast/types";
import {
	useThemedColor,
	type ThemeColorName,
	type UseThemedColorReturn,
} from "./use-themed-color";
import React from "react";

type RecursiveApply<T, U> = {
	[K in keyof T]: T[K] extends object ? RecursiveApply<T[K], U> : U;
};

type ToastThemedColorsConfig = RecursiveApply<
	ToastColorsConfig,
	ThemeColorName
>;

const themedConfig = {
	light: {
		"background-primary": "background-0",
		"background-secondary": "background-50",
		"text-primary": "typography-800",
		"text-secondary": "typography-600",
		"text-tertiary": "typography-500",
		"border-secondary": "outline-200",
		success: "success-500",
		error: "error-500",
		warning: "warning-500",
		info: "info-500",

		rich: {
			success: {
				background: "success-0",
				foreground: "success-600",
				border: "success-100",
			},
			error: {
				background: "error-0",
				foreground: "error-600",
				border: "error-100",
			},
			warning: {
				background: "warning-0",
				foreground: "warning-600",
				border: "warning-100",
			},
			info: {
				background: "info-0",
				foreground: "info-600",
				border: "info-100",
			},
		},
	},
	dark: {
		"background-primary": "background-0",
		"background-secondary": "background-100",
		"text-primary": "typography-950",
		"text-secondary": "typography-900",
		"text-tertiary": "typography-800",
		"border-secondary": "outline-200",
		success: "success-500",
		error: "error-500",
		warning: "warning-500",
		info: "info-500",

		rich: {
			success: {
				background: "success-50",
				foreground: "success-600",
				border: "success-100",
			},
			error: {
				background: "error-50",
				foreground: "error-600",
				border: "error-100",
			},
			warning: {
				background: "warning-50",
				foreground: "warning-600",
				border: "warning-100",
			},
			info: {
				background: "info-50",
				foreground: "info-600",
				border: "info-100",
			},
		},
	},
} satisfies ToastThemedColorsConfig;

const getThemeWithHexColors = ({
	config,
	getHex,
}: {
	config: ToastThemedColorsConfig["dark" | "light"];
	getHex: UseThemedColorReturn["getHexColor"];
}) => {
	const newConfig = {} as ToastColors;

	for (const key in config) {
		const typedKey = key as keyof ToastColors;

		if (typeof config[typedKey] === "string") {
			// TODO: Fix this any usage
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
			newConfig[typedKey] = getHex(config[typedKey]) as any;
		} else if (
			typeof config[typedKey] === "object" &&
			config[typedKey] !== null
		) {
			// TODO: Fix this crazy assertions
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			newConfig[typedKey] = getThemeWithHexColors({
				config: config[typedKey] as unknown as ToastThemedColorsConfig[
					| "dark"
					| "light"],
				getHex,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			}) as any;
		}
	}

	return newConfig;
};

export const useToastThemedColors = (): ToastColorsConfig => {
	const getLightHexColor = useThemedColor({
		colorScheme: "light",
	}).getHexColor;
	const light = React.useMemo(() => {
		return getThemeWithHexColors({
			config: themedConfig.light,
			getHex: getLightHexColor,
		});
	}, [getLightHexColor]);

	const getDarkHexColor = useThemedColor({
		colorScheme: "dark",
	}).getHexColor;
	const dark = React.useMemo(() => {
		return getThemeWithHexColors({
			config: themedConfig.dark,
			getHex: getDarkHexColor,
		});
	}, [getDarkHexColor]);

	return React.useMemo(() => ({ light, dark }), [dark, light]);
};
