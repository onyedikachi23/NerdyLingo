/** @format */

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";

const AnimatedBox = Animated.createAnimatedComponent(Box);

export const EmailSignup = () => {
	return (
		<AnimatedBox
			className="flex-1 gap-12"
			entering={FadeInLeft}
			exiting={FadeOutRight}>
			<Heading className="text-center">
				Sign up with your email address
			</Heading>

			{/* Email signup form goes here */}
		</AnimatedBox>
	);
};
