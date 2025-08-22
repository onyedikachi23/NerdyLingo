/** @format */

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function LoginScreen() {
	return (
		<AnimatedBox
			className="flex-1 items-center justify-center"
			entering={FadeInLeft}
			exiting={FadeOutRight}>
			<Text>Login</Text>

			<Link href={"/signup"}>Go to signup</Link>
		</AnimatedBox>
	);
}
