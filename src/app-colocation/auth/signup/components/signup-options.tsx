/** @format */

import { Box } from "@/components/ui/box";
import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";

const AnimatedBox = Animated.createAnimatedComponent(Box);

interface SignupOptionsProps {
	onSignupWithEmail: () => void;
}

export const SignupOptions = ({ onSignupWithEmail }: SignupOptionsProps) => {
	return (
		<AnimatedBox
			className="flex-1 gap-12"
			entering={FadeInLeft}
			exiting={FadeOutRight}>
			<Heading className="text-center">
				Instant communication, no matter the language.
			</Heading>

			<ButtonGroup>
				<ButtonGroup className="flex-row">
					{[
						{
							id: "apple",
							a11yLabel: "Sign in with Apple",
							logo: require("@/assets/images/auth/apple-logo.svg") as number,
						},
						{
							id: "google",
							a11yLabel: "Sign in with Google",
							logo: require("@/assets/images/auth/google-logo.svg") as number,
						},
					].map(({ id, a11yLabel, logo }) => (
						<Button
							key={id}
							accessibilityLabel={a11yLabel}
							size="lg"
							className="aspect-[23/8] h-auto max-h-16 flex-1 rounded-full border-0 bg-background-100 data-[active=true]:bg-background-200">
							<Image
								source={logo}
								alt={a11yLabel}
								size="none"
								className="size-6"
								contentFit="contain"
							/>
						</Button>
					))}
				</ButtonGroup>

				<Button
					onPress={onSignupWithEmail}
					className="aspect-[23/4] h-auto max-h-16 rounded-full border-0 bg-background-100 data-[active=true]:bg-background-200">
					<ButtonText size="lg">Sign up with Email</ButtonText>
				</Button>
			</ButtonGroup>

			<Box className="items-center justify-center gap-1">
				<Text size="sm" className="text-center">
					Already have an account?
				</Text>
				<Link href={"/login"} asChild>
					<Button variant="link" className="h-auto py-0">
						<ButtonText>Go to login</ButtonText>
					</Button>
				</Link>
			</Box>

			<Text size="xs" className="mt-auto text-center">
				By continuing you confirm that you’ve read and accepted out{" "}
				<Link
					href={"/(legal)/terms-of-service"}
					className="text-primary-500 underline-offset-4 active:underline">
					Terms
				</Link>{" "}
				and{" "}
				<Link
					href={"/(legal)/privacy-policy"}
					className="text-primary-500 underline-offset-4 active:underline">
					Privacy Policy
				</Link>
			</Text>
		</AnimatedBox>
	);
};
