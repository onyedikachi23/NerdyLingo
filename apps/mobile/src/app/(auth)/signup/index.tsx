/** @format */

import {
	AuthOptionButton,
	AuthOptionButtonText,
	AuthOptionsHeading,
	AuthOptionsScreen,
	AuthRedirectBox,
	AuthRedirectButton,
	AuthRedirectText,
	OAuthOptionLogo,
} from "@/app-colocation/auth/components/auth-options";
import { ButtonGroup, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import type { ImageRequireSource } from "react-native";

export default function SignupOptions() {
	return (
		<AuthOptionsScreen>
			<AuthOptionsHeading>
				Instant communication, no matter the language.
			</AuthOptionsHeading>

			<ButtonGroup>
				<ButtonGroup className="flex-row">
					{[
						{
							id: "apple",
							a11yLabel: "Sign up with Apple",
							logo: require("@/assets/images/auth/apple-logo.svg") as ImageRequireSource,
						},
						{
							id: "google",
							a11yLabel: "Sign up with Google",
							logo: require("@/assets/images/auth/google-logo.svg") as ImageRequireSource,
						},
					].map(({ id, a11yLabel, logo }) => (
						<AuthOptionButton
							key={id}
							accessibilityLabel={a11yLabel}
							className="flex-1">
							<OAuthOptionLogo
								source={logo}
								accessibilityLabel={a11yLabel}
							/>
						</AuthOptionButton>
					))}
				</ButtonGroup>

				<Link href={"/signup/email"} asChild>
					<AuthOptionButton>
						<AuthOptionButtonText>
							Sign up with Email
						</AuthOptionButtonText>
					</AuthOptionButton>
				</Link>
			</ButtonGroup>

			<AuthRedirectBox>
				<AuthRedirectText>Already have an account?</AuthRedirectText>
				<Link href={"/login"} asChild>
					<AuthRedirectButton>
						<ButtonText>Go to log in</ButtonText>
					</AuthRedirectButton>
				</Link>
			</AuthRedirectBox>

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
		</AuthOptionsScreen>
	);
}
