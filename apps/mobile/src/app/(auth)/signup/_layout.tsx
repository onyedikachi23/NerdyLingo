/** @format */

import { Stack } from "expo-router";

export default function SignupScreen() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen name="index" options={{ title: "Sign up options" }} />
			<Stack.Screen
				name="email"
				options={{ title: "Sign up with Email" }}
			/>
		</Stack>
	);
}
