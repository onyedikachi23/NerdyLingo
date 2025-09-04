/** @format */

import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
	return (
		<SafeAreaView className="flex-1 gap-4 p-4">
			<Box className="w-full items-center justify-center bg-white p-4">
				<Image
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					source={require("@/assets/images/brand/logo.svg")}
					accessibilityLabel="Brand logo"
					size={"2xl"}
				/>
			</Box>

			<Stack
				screenOptions={{
					headerShown: false,
				}}>
				<Stack.Screen name="login" options={{ title: "Log in" }} />
				<Stack.Screen name="signup" options={{ title: "Sign up" }} />
			</Stack>
		</SafeAreaView>
	);
}
