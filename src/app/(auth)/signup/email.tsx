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
import { useForm, type DeepKeys } from "@tanstack/react-form";
import * as z from "zod";
import { ButtonSpinner } from "@/components/ui/button";

const AnimatedBox = Animated.createAnimatedComponent(Box);

const StrongPasswordSchema = z
	.string()
	.min(8, "At least 8 characters long")
	.regex(/[a-z]/, "At least one lowercase letter")
	.regex(/[A-Z]/, "At least one uppercase letter")
	.regex(/\d/, "At least one number")
	.regex(/[^a-zA-Z0-9\s]/, "At least one special character");

const fieldsSchema = {
	name: z.string().min(1, {
		error: "Name is required",
	}),
	email: z.email(),
	password: StrongPasswordSchema,
	confirmPassword: z.string(), // Passwords match validation will be done at field level
} satisfies z.ZodRawShape;

type EmailSignupForm = z.infer<z.ZodObject<typeof fieldsSchema>>;

const fieldsBuilder = [
	{
		name: "name",
		label: "Name",
		placeholder: "John Doe",
	},
	{
		name: "email",
		label: "Email",
		placeholder: "hello@example.com",
	},
	{
		name: "password",
		label: "Password",
		placeholder: "••••••••",
	},
	{
		name: "confirmPassword",
		label: "Confirm Password",
		placeholder: "••••••••",
	},
] satisfies {
	name: DeepKeys<EmailSignupForm>;
	label: string;
	placeholder: string;
}[];

export default function EmailSignup() {
	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		} as EmailSignupForm,
	});

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
					{fieldsBuilder.map(({ name, label, placeholder }) => {
						return (
							<form.Field
								key={name}
								name={name}
								validators={{
									onBlurListenTo:
										name === "confirmPassword"
											? ["password"]
											: undefined,
									onBlur: ({ value, fieldApi }) => {
										const fieldValidator =
											name === "confirmPassword"
												? fieldsSchema[name].refine(
														(data) =>
															data ===
															fieldApi.form.getFieldValue(
																"password",
															),
														{
															error: "Passwords do not match",
														},
													)
												: fieldsSchema[name];

										const validationResult =
											fieldValidator.safeParse(value);

										if (!validationResult.success) {
											return validationResult.error
												.issues;
										}
									},
								}}>
								{(field) => (
									<FormControl
										isInvalid={!field.state.meta.isValid}
										isRequired={
											!fieldsSchema[name].safeParse(
												undefined,
											).success
										}>
										<FormControlLabel>
											<FormControlLabelText>
												{label}
											</FormControlLabelText>
										</FormControlLabel>
										<Input className="h-16 rounded-2xl border-0 bg-background-50">
											<InputField
												placeholder={placeholder}
												className="font-semibold"
												value={field.state.value}
												onBlur={field.handleBlur} // for validate on blur
												onChangeText={
													field.handleChange
												} // for syncing changes to field state
											/>
										</Input>

										<FormControlError>
											<FormControlErrorIcon
												as={AlertCircleIcon}
											/>
											<FormControlErrorText>
												{
													// display one error at a time
													field.state.meta.errors[0]
														?.message
												}
											</FormControlErrorText>
										</FormControlError>
									</FormControl>
								)}
							</form.Field>
						);
					})}
				</Box>

				<form.Subscribe
					selector={({ canSubmit, isSubmitting }) => ({
						canSubmit,
						isSubmitting,
					})}>
					{({ canSubmit, isSubmitting }) => {
						const isDisabled = !canSubmit || isSubmitting;
						return (
							<FlowButton
								accessibilityLabel={"Sign up"}
								accessibilityState={{ disabled: isDisabled }}
								isDisabled={isDisabled}
								onPress={() => void form.handleSubmit()}
								className="mx-auto">
								<FlowButtonRing>
									{isSubmitting ? (
										<ButtonSpinner />
									) : (
										<FlowButtonIcon as={ChevronRight} />
									)}
								</FlowButtonRing>
							</FlowButton>
						);
					}}
				</form.Subscribe>
			</ScrollView>
		</AnimatedBox>
	);
}
