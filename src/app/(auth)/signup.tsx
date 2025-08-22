/** @format */

import { EmailSignup } from "@/app-colocation/auth/signup/components/email-signup";
import { SignupOptions } from "@/app-colocation/auth/signup/components/signup-options";
import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import React from "react";
import { ScrollView } from "react-native";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function SignupScreen() {
	const [isSigningUpByEmail, setIsSigningUpByEmail] = React.useState(false);
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

					{isSigningUpByEmail ? (
						<EmailSignup />
					) : (
						<SignupOptions
							onSignupWithEmail={() =>
								setIsSigningUpByEmail(true)
							}
						/>
					)}
				</ScrollView>
			</SafeAreaView>
		</AnimatedBox>
	);
}
