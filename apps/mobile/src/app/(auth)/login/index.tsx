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
import { Link } from "expo-router";
import type { ImageRequireSource } from "react-native";

export default function LoginOptions() {
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
							a11yLabel: "Log in with Apple",
							logo: require("@/assets/images/auth/apple-logo.svg") as ImageRequireSource,
						},
						{
							id: "google",
							a11yLabel: "Log in with Google",
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

				<Link href={"/login/email"} asChild>
					<AuthOptionButton>
						<AuthOptionButtonText>
							Log in with Email
						</AuthOptionButtonText>
					</AuthOptionButton>
				</Link>
			</ButtonGroup>

			<AuthRedirectBox>
				<AuthRedirectText>Don&apos;t have an account?</AuthRedirectText>
				<Link href={"/signup"} asChild>
					<AuthRedirectButton>
						<ButtonText>Go to sign up</ButtonText>
					</AuthRedirectButton>
				</Link>
			</AuthRedirectBox>
		</AuthOptionsScreen>
	);
}
