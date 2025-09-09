/** @format */
import { useColorScheme as useNWColorScheme } from "nativewind";
import { useColorScheme as useRNColorScheme } from "react-native";

/**
 * Hook to get the device's current system color scheme preference.
 * This is a direct wrapper around React Native's useColorScheme.
 */
const useSystemColorScheme = useRNColorScheme;

/**
 * Hook to get and set the application's active color scheme.
 * This is a direct wrapper around Nativewind's useColorScheme,
 * which supports user overrides and persistence.
 */
const useAppColorScheme = useNWColorScheme;

export { useAppColorScheme, useSystemColorScheme };
