/** @format */

import {
	FlowButton,
	FlowButtonIcon,
	FlowButtonRing,
} from "@/components/ui-common/flow-button";
import { Box } from "@/components/ui/box";
import {
	FormControl,
	FormControlError,
	FormControlErrorIcon,
	FormControlErrorText,
	FormControlLabel,
	FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { AlertCircleIcon, ChevronRight } from "lucide-react-native";
import { ScrollView } from "react-native";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function EmailSignup() {
	// TODO: Integrate with Tanstack form
	return (
		<AnimatedBox
			className="flex-1 gap-12"
			entering={FadeInLeft}
			exiting={FadeOutRight}>
			<Heading className="text-center">
				Sign up with your email address
			</Heading>

			<ScrollView
				className="flex-1"
				contentContainerClassName="gap-8"
				showsVerticalScrollIndicator={false}>
				<Box className="flex-1">
					{(
						[
							{
								path: "name",
								label: "Name",
								placeholder: "John Doe",
								errorMessage:
									"At least 2 characters are required.",
							},
							{
								path: "email",
								label: "Email",
								placeholder: "hello@example.com",
								errorMessage:
									"At least 6 characters are required.",
							},
							{
								path: "password",
								label: "Password",
								placeholder: "••••••••",
								errorMessage:
									"At least 8 characters are required.",
							},
						] satisfies {
							path: string;
							label: string;
							placeholder: string;
							errorMessage: string;
						}[]
					).map(({ path, label, placeholder, errorMessage }) => (
						<FormControl
							key={path}
							isInvalid={false}
							isDisabled={false}
							isReadOnly={false}
							isRequired={false}>
							<FormControlLabel>
								<FormControlLabelText>
									{label}
								</FormControlLabelText>
							</FormControlLabel>
							<Input className="h-16 rounded-2xl border-0 bg-background-50">
								<InputField
									placeholder={placeholder}
									className="font-semibold"
								/>
							</Input>

							<FormControlError>
								<FormControlErrorIcon as={AlertCircleIcon} />
								<FormControlErrorText>
									{errorMessage}
								</FormControlErrorText>
							</FormControlError>
						</FormControl>
					))}
				</Box>

				<FlowButton
					accessibilityLabel={"Sign up"}
					isDisabled={false}
					className="mx-auto">
					<FlowButtonRing>
						<FlowButtonIcon as={ChevronRight} />
					</FlowButtonRing>
				</FlowButton>
			</ScrollView>
		</AnimatedBox>
	);
}
