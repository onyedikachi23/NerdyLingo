/** @format */

import { Stack } from "expo-router";

export default function LoginScreen() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen name="index" options={{ title: "Log in options" }} />
			<Stack.Screen
				name="email"
				options={{ title: "Log in with Email" }}
			/>
		</Stack>
	);
}
