/** @format */

import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { Stack } from "expo-router";
import { ScrollView } from "react-native";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function SignupScreen() {
	return (
		<AnimatedBox
			className="flex-1"
			entering={FadeInLeft}
			exiting={FadeOutRight}>
			<SafeAreaView className="flex-1">
				<ScrollView
					className="flex-1"
					contentContainerClassName="gap-12 p-4 flex-1">
					<Image
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						source={require("@/assets/images/brand/logo.svg")}
						alt="presentational blurred conic gradient"
						/* style={gradientRotationStyle} */
						className={"mx-auto"}
						size={"2xl"}
					/>

					<Stack
						screenOptions={{
							headerShown: false,
						}}>
						<Stack.Screen
							name="index"
							options={{ title: "Sign up options" }}
						/>
						<Stack.Screen
							name="details"
							options={{ title: "Sign up with Email" }}
						/>
					</Stack>
				</ScrollView>
			</SafeAreaView>
		</AnimatedBox>
	);
}
