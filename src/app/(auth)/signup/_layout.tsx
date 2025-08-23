/** @format */

import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { Stack } from "expo-router";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function SignupScreen() {
	return (
		<AnimatedBox
			className="flex-1"
			entering={FadeInLeft}
			exiting={FadeOutRight}>
			<SafeAreaView className="flex-1 gap-4 p-4">
				<Box className="w-full items-center justify-center bg-white p-4">
					<Image
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						source={require("@/assets/images/brand/logo.svg")}
						alt="presentational blurred conic gradient"
						/* style={gradientRotationStyle} */
						className={"mx-auto"}
						size={"2xl"}
					/>
				</Box>

				<Stack
					screenOptions={{
						headerShown: false,
					}}>
					<Stack.Screen
						name="index"
						options={{ title: "Sign up options" }}
					/>
					<Stack.Screen
						name="email"
						options={{ title: "Sign up with Email" }}
					/>
				</Stack>
			</SafeAreaView>
		</AnimatedBox>
	);
}
